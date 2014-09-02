RequireScript("euphoria/classes/Object.js");

function ChestClass(name) {
	var me = this;
	euphoria.debug.instantiate('ChestClass:' + name);

	me.superClass = ObjectClass;
	me.superClass(name);

	me.frameIndex = 0;
	me.closed = true;

	me.onTalk = function()
	{
		var callId = euphoria.debug.startedFunction('Object.onTalk');
		if (!me.closed)
			return euphoria.debug.endFunction(callId);

		euphoria.player.lockMovement();
		me.showNextFrame();
		return euphoria.debug.endFunction(callId);
	};

	me.showNextFrame = function()
	{
		var callId = euphoria.debug.startedFunction('Object.showNextFrame');

		if (me.frameIndex < 3)
		{
			scriptManager.setDelayScript(3, function(){
				me.showNextFrame();
			});

			me.faceLeft();
			me.frameIndex++;
		}
		else if (me.frameIndex == 3)
		{
			euphoria.soundManager.playEffectFile(gameConfig.soundFiles.chest);
			me.onOpen();
			me.closed = false;
			euphoria.player.unlockMovement();
		}

		return euphoria.debug.endFunction(callId);
	};

	me.markAsOpen = function()
	{
		var callId = euphoria.debug.startedFunction('Object.markAsOpen');

		me.setDirection(3);
		me.closed = false;

		return euphoria.debug.endFunction(callId);
	};

	me.markAsClosed = function()
	{
		var callId = euphoria.debug.startedFunction('Object.markAsClosed');

		me.setDirection(0);
		me.closed = true;

		return euphoria.debug.endFunction(callId);
	};

	me.onOpen = function()
	{

	};
}