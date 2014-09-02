RequireScript("euphoria/classes/BaseClass.js");

function DbClass() {
	var me = this;

	me.objects = {};
	me.objectClasses = {};
	me.maps = {};
	me.mapClasses = {};
	me.items = {};
	me.itemClasses = {};
	me.aiClasses = {};
	me.loadedImages = {};
	me.loadedSongs = {};
	me.loadedSoundEffects = {};

	me.superClass = BaseClass;
	me.superClass();

	/*
		Free to use methods
	*/

	me.createObject = function(objectName, objectClassName)
	{
		var callId = euphoria.debug.startedFunction('DbClass.createObject(' + objectName + ', ' + objectClassName + ')');

		var objectClass = me.getObjectClass(objectClassName);
		var object = new objectClass(objectName);
		me.registerObject(objectName, object);

		return euphoria.debug.endFunction(callId, object);
	};

	me.getObject = function(objectName)
	{
		var callId = euphoria.debug.startedFunction('DbClass.getObject(' + objectName + ')');
		return euphoria.debug.endFunction(callId, me.objects[objectName]);
	};

	me.getOrCreateObject = function(objectName, objectClassName)
	{
		var callId = euphoria.debug.startedFunction('DbClass.getOrCreateObject(' + objectName + ', ' + objectClassName + ')');

		var object = me.getObject(objectName);
		if (object)
			return euphoria.debug.endFunction(callId, object);

		object = me.createObject(objectName, objectClassName);
		return euphoria.debug.endFunction(callId, object);
	};

	me.recreateMap = function(mapName, mapClassName)
	{
		var callId = euphoria.debug.startedFunction('DbClass.recreateMap(' + mapName + ', ' + mapClassName + ')');

		me.freeMap(mapName);
		return euphoria.debug.endFunction(callId, me.createMap(mapName, mapClassName));
	};

	me.createMap = function(mapName, mapClassName)
	{
		var callId = euphoria.debug.startedFunction('DbClass.createMap(' + mapName + ', ' + mapClassName + ')');

		var mapClass = me.getMapClass(mapClassName);
		var map = new mapClass(mapName);
		me.registerMap(mapName, map);

		return euphoria.debug.endFunction(callId, map);
	};

	me.getMap = function(mapName)
	{
		var callId = euphoria.debug.startedFunction('DbClass.getMap(' + mapName + ')');
		return euphoria.debug.endFunction(callId, me.maps[mapName]);
	};

	me.getOrCreateMap = function(mapName, mapClassName)
	{
		var callId = euphoria.debug.startedFunction('DbClass.getOrCreateMap(' + mapName + ', ' + mapClassName + ')');

		var map = me.getMap(mapName);
		if (!map)
		{
			map = me.createMap(mapName, mapClassName);
		}

		return euphoria.debug.endFunction(callId, map);
	};

	me.getItem = function(itemClassName)
	{
		var callId = euphoria.debug.startedFunction('DbClass.getItem(' + itemClassName + ')');
		var item = me.items[itemClassName];
		if (!item)
		{
			item = me.createItem(itemClassName);
		}

		return euphoria.debug.endFunction(callId, item);
	};

	me.createSimpleChest = function(name, spriteName)
	{
		var callId = euphoria.debug.startedFunction('DbClass.createSimpleChest(' + name + ', ' + spriteName + ')');

		var chest = me.getObject(name);		
		if (!chest)
			chest = new ChestClass(name);

		chest.spriteName = spriteName;
		me.registerObject(name, chest);

		return euphoria.debug.endFunction(callId, chest);
	};

	me.createSimpleObject = function(name, spriteName)
	{
		var callId = euphoria.debug.startedFunction('DbClass.createSimpleObject(' + name + ', ' + spriteName + ')');

		var object = me.getObject(name);
		if (!object)
			object = new ObjectClass(name);

		object.spriteName = spriteName;
		me.registerObject(name, object);

		return euphoria.debug.endFunction(callId, object);
	};

	me.createSimplePerson = function(name, spriteName)
	{
		var callId = euphoria.debug.startedFunction('DbClass.createSimplePerson(' + name + ', ' + spriteName + ')');

		var person = me.getObject(name);
		if (!person)
			person = new PersonClass(name);

		person.spriteName = spriteName;
		me.registerObject(name, person);

		return euphoria.debug.endFunction(callId, person);
	};

	me.loadImage = function(imageFileName)
	{
		var callId = euphoria.debug.startedFunction('DbClass.loadImage(' + imageFileName + ')', true);

		if (me.loadedImages[imageFileName])
		{
			var result = me.loadedImages[imageFileName];
			return euphoria.debug.endFunction(callId, result);
		}

		var image = LoadImage(imageFileName);
		me.loadedImages[imageFileName] = image;

		return euphoria.debug.endFunction(callId, image);
	};

	me.loadSong = function(songFileName)
	{
		var callId = euphoria.debug.startedFunction('DbClass.loadSong(' + songFileName + ')');

		if (me.loadedSongs[songFileName])
		{
			var result = me.loadedSongs[songFileName];
			return euphoria.debug.endFunction(callId, result);
		}

		var song = LoadSound(songFileName);
		me.loadedSongs[songFileName] = song;

		return euphoria.debug.endFunction(callId, song);
	};

	me.loadSoundEffect = function(soundEffectFileName)
	{
		var callId = euphoria.debug.startedFunction('DbClass.loadSoundEffect(' + soundEffectFileName + ')');

		if (me.loadedSoundEffects[soundEffectFileName])
		{
			var result = me.loadedSoundEffects[soundEffectFileName];
			return euphoria.debug.endFunction(callId, result);
		}

		var soundEffect = LoadSoundEffect(soundEffectFileName, SE_MULTIPLE);
		me.loadedSoundEffects[soundEffectFileName] = soundEffect;
	
		return euphoria.debug.endFunction(callId, soundEffect);
	};

	/*
		Internal methods
	*/

	me.freeAllObjects = function()
	{
		me.objects = {};
	};

	me.freeMap = function(mapName)
	{
		if (me.maps[mapName])
		{
			me.maps[mapName] = undefined;
		}
	};

	me.freeObject = function(objectName)
	{
		if (me.objects[objectName])
		{
			me.objects[objectName] = undefined;
		}
	};

	me.createItem = function(itemClassName)
	{
		var itemClass = me.getItemClass(itemClassName);
		var item = new itemClass();
		me.registerItem(itemClassName, itemClass);

		return item;
	};

	me.registerItem = function(itemName, item)
	{
		if (me.items[itemName])
		{
			throw "The item " + itemName + " is already registered.";
		}

		me.items[itemName] = item;
	};

	me.getItemClass = function(itemClassName)
	{
		var fileName = "content/items/" + itemClassName + ".js";
		RequireScript(fileName);

		if (!me.itemClasses[itemClassName])
		{
			throw "The item class " + itemClassName + " was not registered.";
		}

		return me.itemClasses[itemClassName];
	};

	me.registerItemClass = function(itemClassName, itemClass)
	{
		me.itemClasses[itemClassName] = itemClass;
	};

	me.getAIClass = function(aiClassName)
	{
		var fileName = "content/ai/" + aiClassName + ".js";
		RequireScript(fileName);

		if (!me.aiClasses[aiClassName])
		{
			throw "The ai class " + aiClassName + " was not registered.";
		}

		return me.aiClasses[aiClassName];
	};
	
	me.registerAIClass = function(aiClassName, aiClass)
	{
		me.aiClasses[aiClassName] = aiClass;
	};

	me.registerObject = function(objectName, objectInstance)
	{
		if (!me.objects[objectName])
		{
			me.objects[objectName] = objectInstance;
		}
	};

	me.getObjectClass = function(objectClassName)
	{
		var fileName = "content/objects/" + objectClassName + ".js";
		RequireScript(fileName);

		if (!me.objectClasses[objectClassName])
		{
			throw "The Object Class " + objectClassName + " was not registered.";
		}

		return me.objectClasses[objectClassName];
	};

	me.registerObjectClass = function(objectClassName, objectClass)
	{
		me.objectClasses[objectClassName] = objectClass;
	};

	me.registerMap = function(mapName, mapInstance)
	{
		if (me.maps[mapName])
		{
			throw "The Map " + mapName + " is already registered.";
		}

		me.maps[mapName] = mapInstance;
	};

	me.getMapClass = function(mapClassName)
	{
		var fileName = "content/maps/" + mapClassName + ".js";
		RequireScript(fileName);

		if (!me.mapClasses[mapClassName])
		{
			throw "The Map Class " + mapClassName + " was not registered.";
		}

		return me.mapClasses[mapClassName];
	};

	me.registerMapClass = function(mapClassName, mapClass)
	{
		me.mapClasses[mapClassName] = mapClass;
	};
}