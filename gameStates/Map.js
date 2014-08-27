RequireScript("euphoria/classes/GameState.js");

function BaseMapGameState() {
	var me = this;

	me.superClass = GameStateClass;
	me.superClass();
	me.name = "Map";

	me.onRun = function()
	{
		euphoria.gravity = true;
		euphoria.debugging = false;
		euphoria.player.lives = gameConfig.initialLives;

		me.goToMainMap();
	};

	me.bindStateKeys = function()
	{		
	};

	me.unbindStateKeys = function()
	{
	};

	me.onEnd = function()
	{
		euphoria.keyboardEvents.safeUnbind(KEY_ESCAPE);
		euphoria.soundManager.stopSong();
		euphoria.windowManager.closeAll();
		euphoria.mapManager.endMapEngine();
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
		if (!me.isInStage())
			return;

		var player = me.getPlayerObject();
		var position = euphoria.mapManager.currentMap.getDefaultPosition();

		player.setPosition(position.x, position.y);
		euphoria.soundManager.playEffectFile(gameConfig.soundFiles.death);
		euphoria.player.removeLive();

		if (euphoria.player.lives === 0)
		{
			me.doGameOver();
			return;
		}

		if (euphoria.mapManager.currentMap !== null)
		{
			euphoria.mapManager.currentMap.resetMap();
		}
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
		euphoria.canMove = false;
	};

	me.onGetPriority = function()
	{
		euphoria.canMove = true;
	};	
}