RequireScript("euphoria/classes/Object.js");

function ChestClass(name) {
	var me = this;

	me.superClass = ObjectClass;
	me.superClass(name);

	me.frameIndex = 0;
	me.closed = true;

	me.onTalk = function()
	{
		if (!me.closed)
			return;

		mainGame.player.lockMovement();
		me.showNextFrame();
	};

	me.showNextFrame = function()
	{
		if (me.frameIndex < 3)
		{
			SetDelayScript(3, "var obj = mainGame.getDb().getObject('" + me.name + "'); if (obj) obj.showNextFrame();");
			me.faceLeft();
			me.frameIndex++;
		}
		else if (me.frameIndex == 3)
		{
			mainGame.soundManager.playEffectFile('Chest.ogg');
			me.onOpen();
			me.closed = false;
			mainGame.player.unlockMovement();
		}
	};

	me.markAsOpen = function()
	{
		me.setDirection(3);
		me.closed = false;
	};

	me.markAsClosed = function()
	{
		me.setDirection(0);
		me.closed = true;
	};

	me.onOpen = function()
	{

	};
}