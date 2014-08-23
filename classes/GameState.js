RequireScript("euphoria/classes/BaseClass.js");

function GameStateClass() {
	var me = this;

	me.superClass = BaseClass;
	me.superClass();
	me.name = null;

	me.getStackPosition = function()
	{

	};

	me.run = function()
	{
		me.onGetPriority();
	};

	me.end = function()
	{

	};

	me.doLosePriority = function()
	{
		me.onLosePriority();
	};

	me.onLosePriority = function()
	{

	};

	me.onGetPriority = function()
	{

	};

	me.doFrame = function()
	{
		me.onFrame();
	};

	me.doFirstFrame = function()
	{
		me.onFirstFrame();
	};

	me.onFrame = function()
	{

	};

	me.onFirstFrame = function()
	{

	};
}