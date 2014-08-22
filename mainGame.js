var mainGame = {
	ranFirstFrame : false,
	player : new PlayerClass(),
	mapManager : new MapManagerClass(),
	keyboardEvents : new KeyboardEventsClass(),
	windowManager : new WindowManagerClass(),
	soundManager : new SoundManagerClass(),
	inventory : new InventoryClass(),
	currentFlow : null,
	globalDb : new DbClass(),
	allowMusic : true,
	allowSoundEffects : true,
	allowJumpingEffect : true,
	debugging : false,
	score : 0,
	paused : false,
	flags : {},

	startGame : function(initialFlow)
	{
		SetRenderScript("mainGame.doFrame()");

		BindKey(KEY_D, "mainGame.debug();", null);

		this.moveToNewFlow(initialFlow);
	},

	doOnFirstFrame : function()
	{
		this.currentFlow.onFirstFrame();
	},

	moveToNewFlow : function(newFlow)
	{
		if (this.currentFlow !== null)
		{
			this.currentFlow.end();
		}

		this.currentFlow = newFlow;
		this.currentFlow.run();
	},

	doFrame : function()
	{
		if (!this.ranFirstFrame)
		{
			this.doOnFirstFrame();
			this.ranFirstFrame = true;
		}

		this.currentFlow.onFrame();
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