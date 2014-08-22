RequireScript("euphoria/classes/BaseClass.js");

function MapManagerClass() {
	var me = this;

	me.fps = 60;
	me.currentMap = null;
	me.trackedObjects = [];
	me.touchTrackedObjects = [];

	me.superClass = BaseClass;
	me.superClass();

	me.initializeMapEngine = function()
	{
		MapEngine(me.currentMap.name, me.fps);
	};

	me.endMapEngine = function()
	{
		if (IsMapEngineRunning())
			ExitMapEngine();
	};

	me.changeMap = function(map)
	{
		mainGame.windowManager.closeAll();

		if (me.currentMap !== null)
		{
			me.currentMap.unregisterEvents();
			me.currentMap.uninitializeMap();
			mainGame.player.unloadPerson();

			if (me.currentMap.twoDimensional)
			{
				mainGame.keyboardEvents.safeUnbind(KEY_UP);
				mainGame.keyboardEvents.safeUnbind(KEY_DOWN);
			}
		}

		me.currentMap = map;
		map.initializeMap();
		me.currentMap.registerEvents();

		mainGame.windowManager.addScoreBox();

		if (!IsMapEngineRunning())
		{
			me.initializeMapEngine();
			return;
		}

		mainGame.ranFirstFrame = false;
		ChangeMap(map.name);
	};

	me.doFirstFrame = function()
	{
		if (me.currentMap !== null)
		{
			me.currentMap.createEntities();
			me.currentMap.doFirstFrame();
		}
	};

	me.doFrame = function()
	{
		if (me.currentMap !== null)
		{
			me.currentMap.doFrame();

			me.doTrackObjectDistances();
		}
	};

	me.checkIfPlayerIsTouchingPerson = function(person)
	{
		var playerPosition = mainGame.player.getMapPosition();
		var playerDirection = GetPersonDirection(mainGame.player.person.name);
		var newPosition = { x : playerPosition.x, y : playerPosition.y};

		switch(playerDirection)
		{
			case 'south' :
				newPosition.y += 10;
				break;
			case 'west' :
				newPosition.x -= 10;
				break;
			case 'north' :
				newPosition.y -= 10;
				break;
			case 'east' :
				newPosition.x += 10;
				break;
			default :
				break;
		}

		var name = GetObstructingPerson(mainGame.player.person.name, newPosition.x, newPosition.y);
		if (person)
			return name == person.name;
		else
			return false;
	};

	me.doTrackObjectDistances = function()
	{
		var i = 0;
		while (i < me.trackedObjects.length)
		{
			if (!me.checkIfPlayerIsTouchingPerson(me.trackedObjects[i]))
			{
				me.trackedObjects[i].onUntouch();
				me.trackedObjects.splice(i, 1);
				continue;
			}

			i++;
		}
	};

	me.trackObjectDistance = function(object)
	{
		if (me.trackedObjects.indexOf(object) >= 0)
		{
			return;
		}

		me.trackedObjects.push(object);
	};
}