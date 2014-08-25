RequireScript("euphoria/classes/Person.js");

function PlayerPersonClass(name) {
	var me = this;

	me.superClass = PersonClass;
	me.superClass(name);
	me.myFontColor = CreateColor(0, 0, 0);
	me.makeSounds = true;

	//The player must not be destroyed
	me.onDestroy = function()
	{	
		
	};

	me.isLeftKeyPressed = function()
	{
		for (var i = 0; i < gameConfig.keyBinds.left.length; i++)
		{
			if (IsKeyPressed(gameConfig.keyBinds.left[i]))
				return true;
		}

		return false;
	};

	me.isRightKeyPressed = function()
	{
		for (var i = 0; i < gameConfig.keyBinds.right.length; i++)
		{
			if (IsKeyPressed(gameConfig.keyBinds.right[i]))
				return true;
		}

		return false;
	};

	me.onFrame = function()
	{
		if (!euphoria.mapManager.currentMap || !euphoria.mapManager.currentMap.twoDimensional)
		{
			return;
		}

		var checkTrigger = false;

		if (me.isLeftKeyPressed())
		{
			me.walkWest();
			checkTrigger = true;
		}
		else if (me.isRightKeyPressed())
		{
			me.walkEast();
			checkTrigger = true;
		}

		if (checkTrigger)
		{
			var position = me.getMapPosition();
			var layer = GetPersonLayer(me.name);

			if (IsTriggerAt(position.x, position.y, layer))
			{
				ExecuteTrigger(position.x, position.y, layer);
			}
		}
	};	
}

euphoria.globalDb.registerObjectClass("PlayerPerson", PlayerPersonClass);