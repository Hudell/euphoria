function BaseClass()
{
	this.events = {};

	this.registerEvent = function(eventName, fn)
	{
		var callId = euphoria.debug.startedFunction('BaseClass.registerEvent(' + eventName + ')');

		if (!this.events[eventName])
		{
			this.events[eventName] = new Array();
		}

		this.events[eventName].push(fn);
		return euphoria.debug.endFunction(callId);
	};

	this.unregisterEvent = function(eventName, fn)
	{
		var callId = euphoria.debug.startedFunction('BaseClass.unregisterEvent(' + eventName + ')');

		if (!this.events[eventName])
		{
			return euphoria.debug.endFunction(callId);
		}

		var index = this.events[eventName].indexOf(fn);
		if (index >= 0)
		{
			this.events[eventName].splice(index, 1);
		}

		return euphoria.debug.endFunction(callId);
	};

	this.runEvent = function(eventName, params)
	{
		var callId = euphoria.debug.startedFunction('BaseClass.runEvent(' + eventName + ')');

		if (!this.events[eventName])
		{
			return euphoria.debug.endFunction(callId);
		}

		for (var i = 0; i < this.events[eventName].length; i++)
		{
			if (this.events[eventName][i].call(this, params) === false)
			{
				break;
			}
		}

		return euphoria.debug.endFunction(callId);
	};
}