RequireScript("euphoria/classes/BaseClass.js");

function DebuggerClass() {
	var me = this;

	me.superClass = BaseClass;
	me.superClass();

	me.logObject = null;
	me.callStackObject = null;
	me.numberOfSpaces = 0;
	me.currentFunction = null;

	me.getLatestOpenFunction = function()
	{
		if (me.currentFunction === null)
			return null;

		return (function _getLatestOpenFunction(openFn){
			if (openFn.fn !== undefined && openFn.fn !== null)
			{
				return _getLatestOpenFunction(openFn.fn);
			}
			else
				return openFn;
		})(me.currentFunction);
	};

	me.getOpenFunctionByCallId = function(callId)
	{
		if (me.currentFunction === null)
			return null;

		return (function _getLatestOpenFunction(openFn){
			if (openFn.fn !== undefined && openFn.fn !== null)
			{
				if (openFn.fn.id === callId)
				{
					return openFn.fn;
				}

				return _getLatestOpenFunction(openFn.fn);
			}
		})(me.currentFunction);		
	};

	me.log = function(message)
	{
		if (euphoria.generateLog)
		{
			if (me.logObject === null)
				me.logObject = OpenLog("log");

			me.logObject.write(message);
		}
	};

	me.logCallStack = function(message)
	{
		if (euphoria.generateCallStackFile)
		{
			if (me.callStackObject === null)
				me.callStackObject = OpenLog("callStack");

			if (me.numberOfSpaces > 0)
				message = message.pad(' ', me.numberOfSpaces);

			me.callStackObject.write(message);
		}
	};

	me.startedFunction = function(functionName, isCommonFunction)
	{
		if (isCommonFunction && !euphoria.generateCallStackOnLoops)
			return false;

		me.logCallStack('BEGIN ' + functionName);

		var openFn = me.getLatestOpenFunction();
		if (openFn === null)
		{
			me.currentFunction = {
				name : 'main',
				id : 0
			};
			openFn = me.currentFunction;
		}

		openFn.fn = {
			name : functionName,
			id : Math.random(),
			parent : openFn
		};

		me.numberOfSpaces++;

		return openFn.fn.id;
	};

	me.endFunction = function(callId, returnValue)
	{
		if (callId !== false)
		{
			var openFn = me.getOpenFunctionByCallId(callId);
			if (openFn)
			{
				me._returnFunction(openFn.name, returnValue);
			}

			openFn.parent.fn = undefined;
		}

		return returnValue;
	};

	me._returnFunction = function(functionName, returnValue)
	{
		var returnString = '';
		if (returnValue !== undefined)
		{
			returnString = ' RETURN ' + returnValue;
		}

		me.numberOfSpaces--;
		me.logCallStack('END   ' + functionName + returnString);

		return returnValue;
	};

	me.instantiate = function(functionName)
	{
		me.logCallStack('NEW   ' + functionName);
	};

	me.saveCallStack = function(errorMessage)
	{
		if (me.currentFunction === null || me.currentFunction === undefined)
			return;

		var numberOfSpaces = 0;
		(function _saveCallStack(fn){
			if (fn === null || fn === undefined)
				return;

			var message = '';

			if (fn.id > 0)
			{
				message = 'BEGIN ' + fn.name;
				me.log(message.pad(' ', numberOfSpaces));
				numberOfSpaces += 2;
			}

			if (fn.fn !== undefined && fn.fn !== null)
			{
				_saveCallStack(fn.fn, errorMessage);
			}
			else
			{
				me.log(errorMessage.pad(' ', numberOfSpaces));
			}

			if (fn.id > 0)
			{
				numberOfSpaces -= 2;
				message = 'END   ' + fn.name;
				me.log(message.pad(' ', numberOfSpaces));
			}
		})(me.currentFunction);
	};

	me.logArray = function(arrayObj)
	{
		for(var i = 0; i < arrayObj.length; i++)
		{
			if (typeof(arrayObj[i]) == 'object')
			{
				me.logObject(arrayObj[i]);
			}
			else
			{
				me.log(i + ': ' + arrayObj[i]);
			}
		}
	};

	me.logObjectInstance = function(obj)
	{
		if (obj.length !== undefined && obj.indexOf !== undefined)
		{
			me.logArray(obj);
		}
		else
		{
			for (var key in obj)
			{
				if (typeof(obj[key]) == 'object')
				{
					me.logObject(obj[key]);
				}
				else
					me.log(key + ': ' + obj[key]);
			}
		}
	};

	me.throwError = function(error)
	{
		me.saveCallStack('Exception: ' + error);
		throw error;
	};
}