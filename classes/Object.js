RequireScript("euphoria/classes/BaseClass.js");

function ObjectClass(name) {
	var me = this;

	euphoria.debug.instantiate('ObjectClass:' + name);

	me.name = name;
	me.spriteName = null;
	me.created = false;
	me.ignoreObstructions = false;

	me.superClass = BaseClass;
	me.superClass();

	me.lastDirection = 0;
	me.lastAbsoluteDirection = 0;
	me.breakable = false;

	me.createEntity = function(destroyWithMap)
	{
		var callId = euphoria.debug.startedFunction('ObjectClass.createEntity: ' + me.name);
		if (me.created)
			return me;

		if (me.spriteName)
		{
			CreatePerson(me.name, me.spriteName, destroyWithMap);
		}

		SetPersonFrameRevert(me.name, 1);
		if (me.ignoreObstructions === true)
		{
			IgnoreTileObstructions(me.name, true);
			IgnorePersonObstructions(me.name, true);
		}

		me.created = true;
		me.registerEvents();

		me.onCreate();
		return euphoria.debug.endFunction(callId, me);
	};

	me.hideEntity = function()
	{
		SetPersonVisible(me.name, false);
	};

	me.showEntity = function()
	{
		SetPersonVisible(me.name, true);
	};

	me.destroyEntity = function()
	{
		me.created = false;
		DestroyPerson(me.name);
	};

	me.registerEvents = function()
	{
		var methodCall = "var obj = euphoria.getDb().getObject('" + me.name + "'); if (obj) obj";

		SetPersonScript(me.name, SCRIPT_ON_DESTROY, methodCall + ".onDestroy();");
		// SetPersonScript(me.name, SCRIPT_ON_ACTIVATE_TOUCH, methodCall + ".doOnTouch();");
		SetPersonScript(me.name, SCRIPT_ON_ACTIVATE_TALK, methodCall + ".onTalk();");
	};

	me.checkIfEntityExists = function()
	{
		var personList = GetPersonList();
		var idx = personList.indexOf(me.name);
		return idx >= 0;
	};

	me.updateIgnoreList = function()
	{
		//If the object is ignoring obstructions, it doesn't need an ignore list
		if (me.ignoreObstructions === true)
			return;

		//If the object hasn't been created yet, don't try to update
		if (!me.created)
			return;

		var personList = GetPersonList();
		var idx = personList.indexOf(me.name);
		if (idx >= 0)
			personList.splice(idx, 1);

		if (euphoria.player.person)
		{
			idx = personList.indexOf(euphoria.player.person.name);
			if (idx >= 0)
				personList.splice(idx, 1);
		}

		SetPersonIgnoreList(me.name, personList);
	};

	me.getRandomDirection = function()
	{
		return Math.floor(Math.random() * 4);
	};

	me.getReverseDirection = function()
	{
		var direction = me.lastAbsoluteDirection + 2;
		if (direction >= 4)
		{
			direction = direction -4;
		}

		return direction;
	};

	me.doFrame = function()
	{
		me.onFrame();
	};

	me.onFrame = function()
	{

	};

	me.getNextPosition = function(direction, distance)
	{
		var position = me.getMapPosition();

		switch(direction)
		{
			case 0 :
				position.y -= distance;
				break;
			case 1 :
				position.x -= distance;
				break;
			case 2 :
				position.y += distance;
				break;
			case 3 :
				position.x += distance;
				break;
			default :
				break;
		}

		return position;
	};

	me.getLeftPosition = function(distance)
	{
		var direction = me.getLeftDirection();

		return me.getNextPosition(direction, distance);
	};

	me.getRightPosition = function(distance)
	{
		var direction = me.getRightDirection();
		return me.getNextPosition(direction, distance);
	};

	me.getBackPosition  = function(distance)
	{
		var direction = me.getReverseDirection();
		return me.getNextPosition(direction, distance);
	};

	me.getFrontPosition = function(distance)
	{
		return me.getNextPosition(me.lastAbsoluteDirection, distance);
	};

	me.isLeftSideObstructed = function(distance)
	{
		var position = me.getLeftPosition(distance);
		return IsPersonObstructed(me.name, position.x, position.y);
	};

	me.isRightSideObstructed = function(distance)
	{
		var position = me.getRightPosition(distance);
		return IsPersonObstructed(me.name, position.x, position.y);
	};

	me.isFrontSideObstructed = function(distance)
	{
		var position = me.getFrontPosition(distance);
		return IsPersonObstructed(me.name, position.x, position.y);
	};

	me.isBackSideObstructed = function(distance)
	{
		var position = me.getBackPosition(distance);
		return IsPersonObstructed(me.name, position.x, position.y);
	};
	
	me.getLeftDirection = function()
	{
		var direction = me.lastAbsoluteDirection +1;
		if (direction == 4)
			direction = 0;

		return direction;
	};

	me.getRightDirection = function()
	{
		var direction = me.lastAbsoluteDirection -1;
		if (direction == -1)
			direction = 3;

		return direction;
	};

	me.faceTo = function(direction)
	{
		var command = null;
		me.lastDirection = direction;

		if (direction == -1)
		{
			direction = me.getRandomDirection();
		}
		me.lastAbsoluteDirection = direction;

		switch(direction)
		{
			case 0 :
				command = COMMAND_FACE_NORTH;
				break;
			case 1 :
				command = COMMAND_FACE_WEST;
				break;
			case 2 :
				command = COMMAND_FACE_SOUTH;
				break;
			case 3 :
				command = COMMAND_FACE_EAST;
				break;
			default :
				command = COMMAND_FACE_NORTH;
				me.lastAbsoluteDirection = 0;
				break;
		}

		QueuePersonCommand(me.name, command, true);
	};

	me.setDirection = function(direction)
	{
		me.lastAbsoluteDirection = direction;
	};

	me.setSprite = function(spriteName)
	{
		var sprite = LoadSpriteset(spriteName);
		SetPersonSpriteset(me.name, sprite);
	};

	me.restoreDefaultSprite = function()
	{
		if (me.spriteName && me.created)
		{
			me.setSprite(me.spriteName);
		}
	};

	me.fixFace = function()
	{
		if (me.lastAbsoluteDirection === undefined)
			return;

		me.faceTo(me.lastAbsoluteDirection);
	};

	me.faceSouth = function()
	{
		me.faceTo(2);
	};

	me.faceNorth = function()
	{
		me.faceTo(0);
	};

	me.faceWest = function()
	{
		me.faceTo(1);
	};

	me.faceEast = function()
	{
		me.faceTo(3);
	};

	me.faceBackward = function()
	{
		var reverseDirection = me.getReverseDirection();

		if (reverseDirection === undefined)
			return;

		me.faceTo(reverseDirection);
	};

	me.faceLeft = function()
	{
		var direction = me.getLeftDirection();
		if (direction === undefined)
			return;
		me.faceTo(direction);
	};

	me.faceRight = function()
	{
		var direction = me.getRightDirection();
		if (direction === undefined)
			return;
		me.faceTo(direction);
	};

	me.faceRandom = function()
	{
		me.faceTo(-1);
	};

	me.setPosition = function(x, y)
	{
		//If we received an object instead of the coordinates, get the coordinates from it
		if (x.x !== undefined && x.y !== undefined)
		{
			SetPersonXYFloat(me.name, x.x, x.y);
			return;
		}

		SetPersonXYFloat(me.name, x, y);
	};

	me.getMapPosition = function()
	{
		var x = GetPersonXFloat(me.name);
		var y = GetPersonYFloat(me.name);

		return { x : x, y : y};
	};

	me.getTilePosition = function()
	{
		var position = me.getMapPosition();

		return { x : Math.floor(position.x / 32), y : Math.floor(position.y / 32)};
	};

	me.ignoreObstructions = function(ignore)
	{
		IgnoreTileObstructions(me.name, ignore);
		IgnorePersonObstructions(me.name, ignore);
	};

	me.getPosition = function()
	{
		var mapPosition = me.getMapPosition();

		var layer = GetPersonLayer(name);
		var x = MapToScreenX(layer, mapPosition.x);
		var y = MapToScreenY(layer, mapPosition.y);

		return { x : x, y : y};
	};

	me.getTopPosition = function()
	{
		var position = me.getPosition();
	
		// Changes value to compensate base size
		// This needs a better solution
		position.y -= 30;
		position.x += 32;

		return position;
	};

	me.setXPosition = function(x)
	{
		SetPersonX(me.name, x);
	};

	me.setYPosition = function(y)
	{
		SetPersonY(me.name, y);
	};

	me.doOnJumpOver = function()
	{
		me.onJumpOver();
	};

	me.onJumpOver = function()
	{

	};

	me.doBreak = function()
	{
		if (!me.breakable)
			return;

		if (me.onBreak() !== false)
			me.destroyEntity();
	};

	me.onBreak = function()
	{

	};

	me.doOnTouch = function(person)
	{
		me.trackDistance();
		me.onTouch(person);
	};

	me.onTouch = function()
	{

	};

	//track the object distance to the player, used to call the onUntouch event
	me.trackDistance = function()
	{
		euphoria.mapManager.trackObjectDistance(me);
	};

	me.onUntouch = function()
	{
		
	};

	me.onTalk = function()
	{
	};

	me.onCreate = function()
	{
		me.lastAbsoluteDirection = 0;
	};

	me.onDestroy = function()
	{	
		me.created = false;
	};
}