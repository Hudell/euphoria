RequireScript("euphoria/classes/BaseClass.js");

function MapManagerClass() {
	var me = this;

	me.fps = 60;
	me.currentMap = null;
	me.trackedObjects = [];
	me.touchTrackedObjects = [];
	me.reopen = false;
	me.onReboot = null;

	me.superClass = BaseClass;
	me.superClass();

	me.initializeMapEngine = function()
	{
		MapEngine(me.currentMap.name, me.fps);

		if (me.reopen)
		{
			me.reopen = false;
			me.initializeMapEngine();
		}
	};

	me.endMapEngine = function()
	{
		if (me.currentMap !== null)
		{
			me.currentMap.uninitializeMap();
		}

		me.currentMap = null;
		if (IsMapEngineRunning())
		{
			ExitMapEngine();
		}
	};

	me.changeMap = function(map)
	{
		var reboot = false;

		euphoria.windowManager.closeAll();

		if (me.currentMap !== null)
		{
			me.currentMap.unregisterEvents();
			me.currentMap.uninitializeMap();
			euphoria.player.unloadPerson();
		}
		else
		{
			//if there is no current map and the map engine is running... the map engine is rebooting
			if (IsMapEngineRunning())
			{
				reboot = true;
			}
		}
		
		me.currentMap = map;
		map.initializeMap();
		me.currentMap.registerEvents();

		euphoria.windowManager.addScoreBox();
		euphoria.ranFirstFrame = false;

		if (reboot)
		{
			me.reopen = true;
			return;
		}
		else if (!IsMapEngineRunning())
		{
			me.initializeMapEngine();
			return;
		}

		ChangeMap(map.name);
	};

	me.doFirstFrame = function()
	{
		if (me.currentMap !== null)
		{
			me.currentMap.createEntities();
			me.currentMap.resetMap();
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
		var playerPosition = euphoria.player.getMapPosition();
		var playerDirection = GetPersonDirection(euphoria.player.person.name);
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

		var name = GetObstructingPerson(euphoria.player.person.name, newPosition.x, newPosition.y);
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