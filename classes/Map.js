RequireScript("euphoria/classes/BaseClass.js");

function MapClass(mapName) {
	var me = this;

	euphoria.debug.instantiate('MapClass:' + mapName);

	me.name = mapName;
	me.initialized = false;
	me.twoDimensional = false;
	me.boardMap = false;
	me.allowObstructionByPass = false;
	me.upByPassableTilesIndexes = [];
	me.leftByPassableTilesIndexes = [];
	me.rightByPassableTilesIndexes = [];
	me.downByPassableTilesIndexes = [];
	me.allowStairs = false;
	me.stairsTiles = [];
	
	me.db = new MapDbClass();

	me.superClass = BaseClass;
	me.superClass();

	me.initializeMap = function()
	{
		var callId = euphoria.debug.startedFunction('MapClass.initializeMap: ' + me.name);

		if (!me.initialized)
		{
			me.db.freeAllObjects();
			me.doInitialize();
			me.updateEntitiesIgnoreList();
		}
		me.initialized = true;

		euphoria.debug.endFunction(callId);
	};

	me.uninitializeMap = function()
	{
		var callId = euphoria.debug.startedFunction('MapClass.uninitializeMap: ' + me.name);

		if (me.initialized)
		{
			me.doUninitialize();
			me.db.freeAllObjects();
		}
		me.initialized = false;

		euphoria.debug.endFunction(callId);
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
		var callId = euphoria.debug.startedFunction('MapClass.updateEntitiesIgnoreList: ' + me.name);
		
		me.db.updateEntitiesIgnoreList();

		euphoria.debug.endFunction(callId);
	};

	me.doFrame = function()
	{
		me.db.doEntitiesFrame();
		
		euphoria.player.person.doFrame();
		me.doMapFrame();
	};

	me.doMapFrame = function()
	{

	};

	me.createObject = function(name, className)
	{
		var object = me.db.getOrCreateObject(name, className);
		return object;
	};

	me.createBatchOfObjects = function(name, className, max)
	{
		var callId = euphoria.debug.startedFunction('MapClass.createBatchOfObjects: ' + me.name + '(' + name + ', ' + className + ', ' + max + ')');
		for (var i = 1; i <= max; i++)
		{
			me.createObject(name + '_' + i, className);
		}
		
		euphoria.debug.endFunction(callId);
	};

	me.createSimpleChest = function(name, spriteName)
	{
		var callId = euphoria.debug.startedFunction('MapClass.createSimpleChest: ' + me.name + '(' + name + ', ' + spriteName + ')');
		RequireScript("euphoria/classes/Chest.js");
		
		var chest = me.db.createSimpleChest(name, spriteName);
		return euphoria.debug.endFunction(callId, chest);
	};

	me.createSimpleObject = function(name, spriteName)
	{
		var object = me.db.createSimpleObject(name, spriteName);
		return object;
	};

	me.createSimplePerson = function(name, spriteName)
	{
		RequireScript("euphoria/classes/Person.js");

		var person = me.db.createSimplePerson(name, spriteName);
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
		var callId = euphoria.debug.startedFunction('MapClass.createEntities: ' + me.name);

		me.db.createEntities();

		euphoria.debug.endFunction(callId);
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