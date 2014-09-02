RequireScript("euphoria/classes/BaseClass.js");

function AIClass(object) {
	var me = this;
	euphoria.debug.instantiate('AIClass:' + me.name);

	me.object = object;
	me.superClass = BaseClass;
	me.superClass();
	me.firstStep = false;

	me.doFrame = function()
	{
		var callId = euphoria.debug.startedFunction('AiClass.doFrame', true);

		if (euphoria.paused || !me.object.created)
		{
			return euphoria.debug.endFunction(callId);
		}

		if (me.firstStep !== true)
		{
			me.doFirstStep();
			me.firstStep = true;
		}

		me.doStep();

		return euphoria.debug.endFunction(callId);
	};

	me.doFirstStep = function()
	{

	};

	me.doStep = function()
	{

	};
}