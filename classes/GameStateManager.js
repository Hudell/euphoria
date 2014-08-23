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
		me.releaseCurrentState();
		me.addState(state);
	};

	me.releaseCurrentState = function()
	{
		if (me.stack.length === 0)
		{
			return;
		}

		var state = me.stack[me.stack.length -1];
		state.end();
		me.stack.splice(me.stack.length -1, 1);
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
			me.stack[i][eventName]();
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