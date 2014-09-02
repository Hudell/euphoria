RequireScript("euphoria/classes/BaseClass.js");

function GameStateManagerClass() {
	var me = this;

	me.superClass = BaseClass;
	me.superClass();

	me.stack = [];

	me.addState = function(state)
	{
		if (me.stack.length > 0)
		{
			me.stack[me.stack.length -1].doLosePriority();
		}

		me.stack.push(state);
		state.run();
	};

	me.changeState = function(state)
	{
		var callId = euphoria.debug.startedFunction('GameStateManagerClass.changeState');

		me.releaseCurrentState();
		me.addState(state);

		euphoria.debug.endFunction(callId);
	};

	me.releaseCurrentState = function()
	{
		var callId = euphoria.debug.startedFunction('GameStateManagerClass.releaseCurrentState');
		if (me.stack.length === 0)
		{
			return euphoria.debug.endFunction(callId, null);
		}

		var state = me.stack[me.stack.length -1];
		var oldStateName = state.name;
		state.doLosePriority();
		state.end();
		me.stack.splice(me.stack.length -1, 1);

		if (me.stack.length > 0)
		{
			state = me.stack[me.stack.length -1];
			state.doGetPriority();
		}

		return euphoria.debug.endFunction(callId, oldStateName);
	};

	me.releaseAllStates = function()
	{
		while (me.stack.length > 0)
			me.releaseCurrentState();
	};

	me.getState = function(stateName)
	{
		for (var i = me.stack.length -1; i >= 0; i--)
		{
			if (me.stack[i].name == stateName)
			{
				return me.stack[i];
			}
		}

		return null;
	};

	me.runOnAllStates = function(eventName)
	{
		for (var i = me.stack.length -1; i >= 0; i--)
		{
			var state = me.stack[i];

			state[eventName]();
		}
	};

	me.doFirstFrame = function()
	{
		me.runOnAllStates("doFirstFrame");
	};

	me.doFrame = function()
	{
		me.runOnAllStates("doFrame");
	};
}