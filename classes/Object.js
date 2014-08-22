RequireScript("euphoria/classes/BaseClass.js");

function ObjectClass(name) {
	var me = this;

	me.name = name;
	me.spriteName = null;
	me.created = false;
	me.map = null;

	me.superClass = BaseClass;
	me.superClass();

	me.lastDirection = 0;
	me.lastAbsoluteDirection = 0;

	me.createEntity = function(destroyWithMap)
	{
		if (me.created)
			return me;

		if (me.spriteName)
		{
			CreatePerson(me.name, me.spriteName, destroyWithMap);
		}

		me.created = true;
		me.registerEvents();

		me.onCreate();
		return me;
	};

	me.destroyEntity = function()
	{
		me.created = false;
		DestroyPerson(me.name);
	};

	me.registerEvents = function()
	{
		var methodCall = "var obj = mainGame.getDb().getObject('" + me.name + "'); if (obj) obj";

		SetPersonScript(me.name, SCRIPT_ON_DESTROY, methodCall + ".onDestroy();");
		// SetPersonScript(me.name, SCRIPT_ON_ACTIVATE_TOUCH, methodCall + ".doOnTouch();");
		SetPersonScript(me.name, SCRIPT_ON_ACTIVATE_TALK, methodCall + ".onTalk();");
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
				break;
		}

		QueuePersonCommand(me.name, command, true);
	};

	me.setDirection = function(direction)
	{
		me.lastAbsoluteDirection = direction;
	};

	me.fixFace = function()
	{
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
		me.faceTo(me.getReverseDirection());
	};

	me.faceLeft = function()
	{
		if (me.created)
			me.faceTo(me.getLeftDirection());
	};

	me.faceRight = function()
	{
		me.faceTo(me.getRighttDirection());
	};

	me.faceRandom = function()
	{
		me.faceTo(-1);
	};

	me.setPosition = function(x, y)
	{
		SetPersonXYFloat(me.name, x, y);
	};

	me.getMapPosition = function()
	{
		var x = GetPersonXFloat(me.name);
		var y = GetPersonYFloat(me.name);

		return { x : x, y : y};
	};

	me.ignoreObstructions = function(ignore)
	{
		IgnoreTileObstructions(me.name, ignore);
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
		//Muda o valor pq a getPosition não considera a posição do sprite, mas da base dele
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
		mainGame.mapManager.trackObjectDistance(me);
	};

	me.onUntouch = function()
	{
		
	};

	me.onTalk = function()
	{
		
	};

	me.onCreate = function()
	{

	};

	me.onDestroy = function()
	{	
		me.created = false;
		if (me.map)
			me.map.freeObject(me.name);
	};
}