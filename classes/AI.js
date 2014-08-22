RequireScript("euphoria/classes/BaseClass.js");

function AIClass(object) {
	var me = this;

	me.object = object;
	me.superClass = BaseClass;
	me.superClass();

	me.doFrame = function()
	{
		if (mainGame.paused)
			return;

		me.doStep();
	};

	me.doStep = function()
	{

	};
}