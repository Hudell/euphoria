RequireScript("euphoria/classes/GameState.js");

function BaseMapGameState() {
	var me = this;

	euphoria.debug.instantiate('BaseMapGameState');

	me.superClass = GameStateClass;
	me.superClass();
	me.name = "Map";

	me.onRun = function()
	{
		var callId = euphoria.debug.startedFunction('BaseMapGameState.onRun');
		euphoria.gravity = true;
		// euphoria.debugging = false;
		euphoria.player.lives = gameConfig.initialLives;

		me.goToMainMap();

		euphoria.debug.endFunction(callId);
	};

	me.bindStateKeys = function()
	{		
	};

	me.unbindStateKeys = function()
	{
	};

	me.onEnd = function()
	{
		var callId = euphoria.debug.startedFunction('BaseMapGameState.onEnd');

		euphoria.keyboardEvents.safeUnbind(KEY_ESCAPE);
		euphoria.soundManager.stopSong();
		euphoria.windowManager.closeAll();
		// euphoria.mapManager.endMapEngine();

		euphoria.debug.endFunction(callId);
	};

	me.onMapFrame = function()
	{
		me.checkIfPlayerDied();

		euphoria.mapManager.doFrame();
		euphoria.player.person.checkCollision();
		euphoria.keyboardEvents.checkEvents();
	};

	me.onFrame = function()
	{
		me.onMapFrame();
	};

	me.onFirstFrame = function()
	{
		euphoria.mapManager.doFirstFrame();
	};

	me.isInStage = function()
	{
		//Inherit this method
	};

	me.resetPlayer = function()
	{
		var callId = euphoria.debug.startedFunction('BaseMapGameState.resetPlayer');

		if (!me.isInStage())
		{
			return euphoria.debug.endFunction(callId);
		}

		var player = me.getPlayerObject();
		var position = euphoria.mapManager.currentMap.getDefaultPosition();

		player.setPosition(position.x, position.y);
		euphoria.soundManager.playEffectFile(gameConfig.soundFiles.death);
		euphoria.player.removeLive();

		if (euphoria.player.lives === 0)
		{
			me.doGameOver();
			return euphoria.debug.endFunction(callId);
		}

		if (euphoria.mapManager.currentMap !== null)
		{
			euphoria.mapManager.currentMap.resetMap();
		}

		return euphoria.debug.endFunction(callId);
	};

	me.doGameOver = function()
	{
		//Inherit this method
	};

	me.getPlayerObject = function()
	{
		//Inherit this method
	};

	me.checkIfPlayerDied = function()
	{
		//Inherit this method
	};

	me.goToMainMap = function()
	{
		//Inherit this method
	};

	me.onLosePriority = function()
	{
		var callId = euphoria.debug.startedFunction('BaseMapGameState.onLosePriority');
		euphoria.canMove = false;
		euphoria.debug.endFunction(callId);
	};

	me.onGetPriority = function()
	{
		var callId = euphoria.debug.startedFunction('BaseMapGameState.onGetPriority');
		euphoria.canMove = true;
		euphoria.debug.endFunction(callId);
	};	
}