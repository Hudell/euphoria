RequireScript("euphoria/classes/BaseClass.js");

function PlayerClass() {
	var me = this;

	me.person = null;
	me.lives = gameConfig.initialLives;

	me.superClass = BaseClass;
	me.superClass();

	//detach input and camera
	me.unloadPerson = function()
	{
		DetachInput();
		DetachCamera();
	};

	me.addLives = function(number)
	{
		me.lives += number;
		
		euphoria.soundManager.playEffectFile(gameConfig.soundFiles.getLives);
	};

	me.removeLive = function()
	{
		me.lives--;
	};

	// Defines what person is controller by the player
	me.setPerson = function(person)
	{
		if (me.person !== null && me.person != person)
		{
			me.unloadPerson();
		}

		me.person = person;

		me.attachInput();
		me.attachCamera();
	};

	me.attachInput = function()
	{
		if (!me.person)
			return;
		
		if (euphoria.mapManager.currentMap && (euphoria.mapManager.currentMap.twoDimensional || euphoria.mapManager.currentMap.boardMap))
		{
			//Don't use default input on two dimensional or board maps
			if (IsInputAttached())
				DetachInput();

			if (euphoria.mapManager.currentMap.twoDimensional === true)
			{
				//Add jump and dropdown capabilities to twoDimensional maps
				var jumpFn = function(){
					me.person.jump();
				};
				var dropDown = function(){
					me.person.dropDown();
				};

				var i = 0;
				for (i = 0; i < gameConfig.keyBinds.jump.length; i++)
				{
					scriptManager.bindKey(gameConfig.keyBinds.jump[i], jumpFn, null);
				}
				for (i = 0; i < gameConfig.keyBinds.dropDown.length; i++)
				{
					scriptManager.bindKey(gameConfig.keyBinds.dropDown[i], dropDown, null);
				}
			}
		}
		else
		{
			euphoria.keyboardEvents.safeUnbind(KEY_UP);
			euphoria.keyboardEvents.safeUnbind(KEY_DOWN);

			if (!IsInputAttached())
				me.person.attachInput();
		}
	};

	me.attachCamera = function()
	{
		if (me.person)
			me.person.attachCamera();
	};

	me.speak = function(message, onCloseMessage, owner)
	{
		me.person.speak(message, onCloseMessage, owner);
	};

	me.fixPlayerFrame = function()
	{
		me.person.fixFrame();
	};

	me.lockMovement = function()
	{
		euphoria.keyboardEvents.lockPlayerMovement();
	};

	me.unlockMovement = function()
	{
		euphoria.keyboardEvents.unlockPlayerMovement();
	};

	me.getPosition = function()
	{
		return me.person.getPosition();
	};

	me.getMapPosition = function()
	{
		return me.person.getMapPosition();
	};
}