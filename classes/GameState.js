RequireScript("euphoria/classes/BaseClass.js");

function GameStateClass() {
	var me = this;

	me.superClass = BaseClass;
	me.superClass();
	me.name = null;
	me.hasPriority = false;

	me.run = function()
	{
		me.doGetPriority();
		me.onRun();
	};

	me.onRun = function()
	{

	};

	me.end = function()
	{
		me.onEnd();
		me.doLosePriority();
	};

	me.onEnd = function()
	{

	};

	me.doGetPriority = function()
	{
		me.hasPriority = true;
		me.onGetPriority();
		me.bindStateKeys();
	};

	me.doLosePriority = function()
	{
		me.hasPriority = false;
		me.onLosePriority();
		me.unbindStateKeys();
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

	me.bindStateKeys = function()
	{

	};

	me.unbindStateKeys = function()
	{

	};
}