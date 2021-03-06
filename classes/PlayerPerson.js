RequireScript("euphoria/classes/Person.js");

function PlayerPersonClass(name) {
	var me = this;

	euphoria.debug.instantiate('PlayerPersonClass:' + name);

	me.superClass = PersonClass;
	me.superClass(name);
	me.myFontColor = CreateColor(0, 0, 0);
	me.makeSounds = true;
	me.nextDirection = null;

	//The player must not be destroyed
	me.onDestroy = function()
	{	
		
	};

	me.isLeftKeyPressed = function()
	{
		if (euphoria.canMove !== true)
			return false;

		for (var i = 0; i < gameConfig.keyBinds.left.length; i++)
		{
			if (IsKeyPressed(gameConfig.keyBinds.left[i]))
				return true;
		}

		return false;
	};

	me.isRightKeyPressed = function()
	{
		if (euphoria.canMove !== true)
			return false;
		
		for (var i = 0; i < gameConfig.keyBinds.right.length; i++)
		{
			if (IsKeyPressed(gameConfig.keyBinds.right[i]))
				return true;
		}

		return false;
	};

	me.isUpKeyPressed = function()
	{
		if (euphoria.canMove !== true)
			return false;

		for (var i = 0; i < gameConfig.keyBinds.up.length; i++)
		{
			if (IsKeyPressed(gameConfig.keyBinds.up[i]))
				return true;
		}
		
		return false;
	};

	me.isDownKeyPressed = function()
	{
		if (euphoria.canMove !== true)
			return false;

		for (var i = 0; i < gameConfig.keyBinds.down.length; i++)
		{
			if (IsKeyPressed(gameConfig.keyBinds.down[i]))
				return true;
		}

		return false;
	};

	me.onFrame = function()
	{
		if (euphoria.paused)
			return;

		if (!euphoria.mapManager.currentMap)
		{
			return;
		}

		var position = me.getMapPosition();
		if (euphoria.mapManager.currentMap.twoDimensional)
		{
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
			else if (me.isUpKeyPressed())
			{
				if (me.canClimb())
					me.walkNorth();
			}
			else if (me.isDownKeyPressed())
			{
				if (me.canClimb())
					me.walkSouth();
			}

			if (checkTrigger)
			{
				var layer = GetPersonLayer(me.name);

				if (IsTriggerAt(position.x, position.y, layer))
				{
					ExecuteTrigger(position.x, position.y, layer);
				}
			}
		}
		else if (euphoria.mapManager.currentMap.boardMap)
		{
			if (me.isLeftKeyPressed())
			{
				me.nextDirection = 1;
			}
			else if (me.isRightKeyPressed())
			{
				me.nextDirection = 3;
			}
			else if (me.isUpKeyPressed())
			{
				me.nextDirection = 0;
			}
			else if (me.isDownKeyPressed())
			{
				me.nextDirection = 2;
			}

			if (me.nextDirection !== null)
			{
				position = me.getNextPosition(me.nextDirection, 10);

				if (!IsPersonObstructed(me.name, position.x, position.y))
				{
					me.faceTo(me.nextDirection);
					me.nextDirection = null;
				}

				var objName = GetObstructingPerson(me.name, position.x, position.y);
				if (objName)
				{
					var obj = euphoria.getDb().getObject(objName);
					if (obj)
					{
						obj.doOnTouch();
					}
				}
			}

			// me.stepForward();
		}
	};	
}

euphoria.globalDb.registerObjectClass("PlayerPerson", PlayerPersonClass);