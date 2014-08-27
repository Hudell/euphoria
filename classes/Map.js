RequireScript("euphoria/classes/BaseClass.js");

function MapClass(mapName) {
	var me = this;

	me.name = mapName;
	me.initialized = false;
	me.objectList = [];
	me.twoDimensional = false;
	me.db = new MapDbClass();

	me.superClass = BaseClass;
	me.superClass();

	me.initializeMap = function()
	{
		if (!me.initialized)
		{
			me.objectList = [];
			me.db.freeAllObjects();

			me.doInitialize();
			// me.updateEntitiesIgnoreList();
		}
		me.initialized = true;
	};

	me.uninitializeMap = function()
	{
		if (me.initialized)
		{
			me.doUninitialize();
			me.objectList = [];
		}
		me.initialized = false;
	};

	me.registerEvents = function()
	{
		euphoria.keyboardEvents.registerEvent('keyPress', me.onKeyPress);
	};

	me.unregisterEvents = function()
	{
		euphoria.keyboardEvents.unregisterEvent('keyPress', me.onKeyPress);
	};

	me.onKeyPress = function(key)
	{
		return true;
	};

	me.doInitialize = function()
	{

	};

	me.doUninitialize = function()
	{

	};

	me.updateEntitiesIgnoreList = function()
	{
		for (var i = 0; i < me.objectList.length; i++)
		{
			var object = me.objectList[i];
			object.object.updateIgnoreList();
		}
	};

	me.doFrame = function()
	{
		for (var i = 0; i < me.objectList.length; i++)
		{
			me.objectList[i].object.doFrame();
		}

		euphoria.player.person.doFrame();

		me.doMapFrame();
	};

	me.doMapFrame = function()
	{

	};

	me.registerObject = function(name, object)
	{
		if (me.findObject(name) === null)
		{
			me.objectList.push({name : name, object : object});
			object.map = me;
			return;
		}
	};

	me.getObjectIndex = function(name)
	{
		for (var i = 0; i < me.objectList.length; i++)
		{
			if (me.objectList[i].name == name)
			{
				return i;
			}
		}

		return false;
	};

	me.freeObject = function(name)
	{
		var idx = me.getObjectIndex(name);
		if (idx !== false)
		{
			me.objectList.splice(idx, 1);
		}
	};

	me.findObject = function(name)
	{
		var idx = me.getObjectIndex(name);
		if (idx !== false)
			return me.objectList[idx].object;
		else
			return null;
	};

	me.createObject = function(name, className)
	{
		var object = me.db.getOrCreateObject(name, className);
		me.registerObject(name, object);
		return object;
	};

	me.createBatchOfObjects = function(name, className, max)
	{
		for (var i = 1; i <= max; i++)
		{
			me.createObject(name + '_' + i, className);
		}
	};

	me.createSimpleChest = function(name, spriteName)
	{
		RequireScript("euphoria/classes/Chest.js");
		
		var chest = me.db.createSimpleChest(name, spriteName);
		me.registerObject(name, chest);
		return chest;
	};

	me.createSimpleObject = function(name, spriteName)
	{
		var object = euphoria.db.createSimpleObject(name, spriteName);
		me.registerObject(name, object);
		return object;
	};

	me.createSimplePerson = function(name, spriteName)
	{
		RequireScript("euphoria/classes/Person.js");

		var person = me.db.createSimplePerson(name, spriteName);
		me.registerObject(name, person);
		return person;
	};

	me.getObject = function(name)
	{
		return me.db.getObject(name);
	};

	me.getDefaultPosition = function()
	{
		return {x : 0, y : 0};
	};

	me.getBottomPosition = function()
	{
		return 1000;
	};

	me.createEntities = function()
	{
		for (var i = 0; i < me.objectList.length; i++)
		{
			var object = me.objectList[i];
			if (!object.object.spriteName)
			{
				object.object.createEntity(true);
			}
		}
	};

	me.doFirstFrame = function()
	{
		me.onFirstFrame();
		me.updateEntitiesIgnoreList();
	};

	me.onFirstFrame = function()
	{

	};

	me.resetMap = function()
	{

	};

	me.doLastFrame = function()
	{

	};
}