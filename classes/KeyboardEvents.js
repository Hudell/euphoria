RequireScript("euphoria/classes/BaseClass.js");

function KeyboardEventsClass() {
	var me = this;

	me.superClass = BaseClass;
	me.superClass();

	me.checkKeyEvents = function(key)
	{
		me.runEvent("keyPress", key);
	};

	me.isJumpButtonPressed = function()
	{
		return IsKeyPressed(KEY_UP) || IsKeyPressed(KEY_CTRL);
	};

	me.checkEvents = function()
	{
		var allowedKeys = [KEY_A, KEY_B, KEY_C, KEY_T];

		if (IsAnyKeyPressed())
		{
			for (var i = 0; i < allowedKeys.length; i++)
			{
				var key = allowedKeys[i];
				if (IsKeyPressed(key))
				{
					me.checkKeyEvents(key);
				}
			}

			if (!IsKeyPressed(KEY_LEFT) && !IsKeyPressed(KEY_RIGHT))
			{
				if (mainGame.mapManager.currentMap.twoDimensional || (!IsKeyPressed(KEY_UP) && !IsKeyPressed(KEY_DOWN)))
				{
					mainGame.player.fixPlayerFrame();
				}
			}
		}
		else
		{
			mainGame.player.fixPlayerFrame();
		}
	};

	me.lockPlayerMovement = function()
	{
		BindKey(KEY_LEFT, null, null);
		BindKey(KEY_RIGHT, null, null);

		if (!mainGame.mapManager.currentMap.twoDimensional)
		{
			BindKey(KEY_UP, null, null);
			BindKey(KEY_DOWN, null, null);
		}
	};

	me.safeUnbind = function(key)
	{
		BindKey(key, null, null);
		UnbindKey(key);
	};

	me.unlockPlayerMovement = function()
	{
		me.safeUnbind(KEY_LEFT);
		me.safeUnbind(KEY_RIGHT);
		me.safeUnbind(KEY_UP);
		me.safeUnbind(KEY_DOWN);
	};
}