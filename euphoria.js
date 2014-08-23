var euphoria = {
	ranFirstFrame : false,
	player : new PlayerClass(),
	mapManager : new MapManagerClass(),
	keyboardEvents : new KeyboardEventsClass(),
	windowManager : new WindowManagerClass(),
	soundManager : new SoundManagerClass(),
	gameStateManager : new GameStateManagerClass(),
	inventory : new InventoryClass(),
	globalDb : new DbClass(),
	allowMusic : true,
	allowSoundEffects : true,
	allowJumpingEffect : true,
	debugging : false,
	score : 0,
	paused : false,
	flags : {},

	startGame : function(initialStateManager)
	{
		SetRenderScript("euphoria.doFrame()");
		BindKey(KEY_D, "euphoria.debug();", null);

		this.gameStateManager.addState(initialStateManager);
	},

	doOnFirstFrame : function()
	{
		this.gameStateManager.doFirstFrame();
	},

	doFrame : function()
	{
		if (!this.ranFirstFrame)
		{
			this.doOnFirstFrame();
			this.ranFirstFrame = true;
		}

		this.gameStateManager.doFrame();
		this.windowManager.drawBoxes();
	},

	getDb : function()
	{
		if (this.mapManager.currentMap)
			return this.mapManager.currentMap.db;
		else
			return this.globalDb;
	},

	debug : function()
	{
		this.debugging = true;

		//add debug functions here
	}
};