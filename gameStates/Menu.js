RequireScript("euphoria/classes/GameState.js");

function BaseMenuState(options) {
	var me = this;

	euphoria.debug.instantiate('BaseMenuState:' + me.name);

	me.superClass = GameStateClass;
	me.superClass();
	me.name = "BaseMenu";
	me.menu = null;
	me.options = options;

	me.onGetPriority = function()
	{
		euphoria.paused = true;
		me.createMenu();
	};

	me.doFrame = function()
	{
		me.menu.draw();
	};

	me.onLosePriority = function()
	{
		euphoria.paused = false;
	};

	me.bindStateKeys = function(menuId)
	{		
		scriptManager.bindKey(KEY_UP, function(){
			me.menu.goUp();
		}, null);

		scriptManager.bindKey(KEY_DOWN, function(){
			me.menu.goDown();
		}, null);

		scriptManager.bindKey(KEY_LEFT, null, null);
		scriptManager.bindKey(KEY_RIGHT, null, null);

		scriptManager.bindKey(KEY_ENTER, function(){
			me.menu.activateOption();
		}, null);

		scriptManager.bindKey(KEY_SPACE, function(){
			me.menu.activateOption();
		}, null);

		scriptManager.bindKey(KEY_ESCAPE, function(){
			euphoria.gameStateManager.releaseCurrentState();
		}, null);
	};

	me.unbindStateKeys = function()
	{
		euphoria.keyboardEvents.safeUnbind(KEY_UP);
		euphoria.keyboardEvents.safeUnbind(KEY_DOWN);
		euphoria.keyboardEvents.safeUnbind(KEY_LEFT);
		euphoria.keyboardEvents.safeUnbind(KEY_RIGHT);
		euphoria.keyboardEvents.safeUnbind(KEY_ENTER);
		euphoria.keyboardEvents.safeUnbind(KEY_SPACE);
		euphoria.keyboardEvents.safeUnbind(KEY_ESCAPE);
	};

	me.createMenu = function()
	{
		me.menu = new MenuClass();

		for (var i = 0; i < me.options.length; i++)
		{
			me.menu.options.push({
				title : me.options[i].title,
				titleFn : me.options[i].titleFn,
				onClick : function(){
					if (me.options[i].keepMenuOpen !== true)
						me.closeMenu();

					if (me.options[i].onClick)
						me.options[i].onClick();
				}
			});
		}

		me.menu.draw();
	};

	me.closeMenu = function()
	{
		euphoria.gameStateManager.releaseCurrentState();
	};
}