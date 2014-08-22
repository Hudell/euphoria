RequireScript("euphoria/classes/Db.js");

function MapDbClass() {
	var me = this;

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
	/*

	/*
		DON'T CALL ANY OF THESE METHODS.

		You should call the mainGame.globalDb version instead, but even if you call from here, this class will just redirect the call to there.
	*/

	me.createMap = function(mapName, mapClassName)
	{
		return mainGame.globalDb.createMap(mapName, mapClassName);
	};

	me.getMap = function(mapName)
	{
		return mainGame.globalDb.getMap(mapName);
	};

	me.getOrCreateMap = function(mapName, mapClassName)
	{
		return mainGame.globalDb.getOrCreateMap(mapName, mapClassName);
	};

	me.getItem = function(itemClassName)
	{
		return mainGame.globalDb.getItem(itemClassName);
	};

	me.loadImage = function(imageFileName)
	{
		return mainGame.globalDb.loadImage(imageFileName);
	};

	me.createItem = function(itemClassName)
	{
		return mainGame.globalDb.createItem(itemClassName);
	};

	me.registerItem = function(itemName, item)
	{
		return mainGame.globalDb.registerItem(itemName, item);
	};

	me.getItemClass = function(itemClassName)
	{
		return mainGame.globalDb.getItemClass(itemClassName);
	};

	me.registerItemClass = function(itemClassName, itemClass)
	{
		mainGame.globalDb.registerItemClass(itemClassName, itemClass);
	};

	me.getAIClass = function(aiClassName)
	{
		return mainGame.globalDb.getAIClass(aiClassName);
	};
	
	me.registerAIClass = function(aiClassName, aiClass)
	{
		mainGame.globalDb.registerAIClass(aiClassName, aiClass);
	};

	me.getObjectClass = function(objectClassName)
	{
		return mainGame.globalDb.getObjectClass(objectClassName);
	};

	me.registerObjectClass = function(objectClassName, objectClass)
	{
		mainGame.globalDb.registerObjectClass(objectClassName, objectClass);
	};

	me.registerMap = function(mapName, mapInstance)
	{
		mainGame.globalDb.registerMap(mapName, mapInstance);
	};

	me.getMapClass = function(mapClassName)
	{
		return mainGame.globalDb.getMapClass(mapClassName);
	};

	me.registerMapClass = function(mapClassName, mapClass)
	{
		mainGame.globalDb.registerMapClass(mapClassName, mapClass);
	};
}