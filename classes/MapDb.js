RequireScript("euphoria/classes/Db.js");

function MapDbClass() {
	var me = this;
	euphoria.debug.instantiate('MapDbClass');

	me.superClass = DbClass;
	me.superClass();

	/*
		You can call those methods:

		createObject(objectName, objectClassName);
		getObject(objectName);
		getOrCreateObject(objectName, objectClassName);
		createSimpleChest(name, spriteName)
		createSimpleObject(name, spriteName)
		createSimplePerson(name, spriteName)
		freeObject(objectName)

		these are internal, but not redirected:

		registerObject(objectName, objectInstance)


		DON'T CALL ANY OF THE METHODS BELOW THIS POINT.

		You should call the euphoria.globalDb version instead, but even if you call from here, this class will just redirect the call to there.
	*/

	me.createMap = function(mapName, mapClassName)
	{
		return euphoria.globalDb.createMap(mapName, mapClassName);
	};

	me.getMap = function(mapName)
	{
		return euphoria.globalDb.getMap(mapName);
	};

	me.getOrCreateMap = function(mapName, mapClassName)
	{
		return euphoria.globalDb.getOrCreateMap(mapName, mapClassName);
	};

	me.getItem = function(itemClassName)
	{
		return euphoria.globalDb.getItem(itemClassName);
	};

	me.loadImage = function(imageFileName)
	{
		return euphoria.globalDb.loadImage(imageFileName);
	};

	me.createItem = function(itemClassName)
	{
		return euphoria.globalDb.createItem(itemClassName);
	};

	me.registerItem = function(itemName, item)
	{
		return euphoria.globalDb.registerItem(itemName, item);
	};

	me.getItemClass = function(itemClassName)
	{
		return euphoria.globalDb.getItemClass(itemClassName);
	};

	me.registerItemClass = function(itemClassName, itemClass)
	{
		euphoria.globalDb.registerItemClass(itemClassName, itemClass);
	};

	me.getAIClass = function(aiClassName)
	{
		return euphoria.globalDb.getAIClass(aiClassName);
	};
	
	me.registerAIClass = function(aiClassName, aiClass)
	{
		euphoria.globalDb.registerAIClass(aiClassName, aiClass);
	};

	me.getObjectClass = function(objectClassName)
	{
		return euphoria.globalDb.getObjectClass(objectClassName);
	};

	me.registerObjectClass = function(objectClassName, objectClass)
	{
		euphoria.globalDb.registerObjectClass(objectClassName, objectClass);
	};

	me.registerMap = function(mapName, mapInstance)
	{
		euphoria.globalDb.registerMap(mapName, mapInstance);
	};

	me.getMapClass = function(mapClassName)
	{
		return euphoria.globalDb.getMapClass(mapClassName);
	};

	me.registerMapClass = function(mapClassName, mapClass)
	{
		euphoria.globalDb.registerMapClass(mapClassName, mapClass);
	};
}