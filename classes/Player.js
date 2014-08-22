RequireScript("euphoria/classes/BaseClass.js");

function PlayerClass() {
	var me = this;

	me.person = null;
	me.lives = 3;

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
		
		mainGame.soundManager.playEffectFile('Recovery.ogg');
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
		if (!IsInputAttached())
			me.person.attachInput();
		
		if (mainGame.mapManager.currentMap.twoDimensional)
		{
			BindKey(KEY_UP, "mainGame.player.person.jump();", null);
			BindKey(KEY_CTRL, "mainGame.player.person.jump();", null);
			BindKey(KEY_DOWN, null, null);
		}
	};

	me.attachCamera = function()
	{
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
		mainGame.keyboardEvents.lockPlayerMovement();
	};

	me.unlockMovement = function()
	{
		mainGame.keyboardEvents.unlockPlayerMovement();
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