RequireScript("euphoria/classes/BaseClass.js");

function AIClass(object) {
	var me = this;

	me.object = object;
	me.superClass = BaseClass;
	me.superClass();
	me.firstStep = false;

	me.doFrame = function()
	{
		if (mainGame.paused)
			return;

		if (me.firstStep !== true)
		{
			me.doFirstStep();
			me.firstStep = true;
		}

		me.doStep();
	};

	me.doFirstStep = function()
	{

	};

	me.doStep = function()
	{

	};
}