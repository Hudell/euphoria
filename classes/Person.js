RequireScript("euphoria/classes/MovableObject.js");

function PersonClass(name)
{
	var me = this;

	me.speaking = false;
	me.currentConversation = null;
	me.currentConversationIndex = -1;
	me.lockedPlayerMovement = false;
	me.myWindowStyle = null;
	me.myFont = null;
	me.myFontColor = null;
	me.speedDifference = 0;
	me.speakTimeout = 120;

	me.randomConversationsAllowed = [];
	me.conversationList = [];

	me.superClass = MovableObjectClass;
	me.superClass(name);

	this.createPerson = function(destroyWithMap)
	{
		if (!me.created)
		{
			me.createEntity(destroyWithMap);

			if (me.speedDifference)
			{
				var xSpeed = GetPersonSpeedX(me.name);
				var ySpeed = GetPersonSpeedY(me.name);

				SetPersonSpeedXY(me.name, xSpeed + me.speedDifference, ySpeed + me.speedDifference);
			}
		}

		return me;
	};

	this.fixFrame = function()
	{
		var frame = GetPersonFrame(me.name);
		if (frame !== 0)
		{
			SetPersonFrame(me.name, 0);
		}
	};	

	this.attachInput = function()
	{
		AttachInput(me.name);
	};

	this.attachCamera = function()
	{
		AttachCamera(me.name);
	};

	this.showMessage = function(message)
	{
		me.startConversation([
			{	
				text : message
			}
		], false);
	};

	this.registerConversation = function(conversation, allowRandom)
	{
		me.conversationList.push(conversation);
		if (allowRandom)
		{
			me.randomConversationsAllowed.push(me.conversationList.length -1);
		}
	};

	this.startRandomConversation = function()
	{
		if (me.randomConversationsAllowed.length === 0)
			return;

		var idx = Math.floor(Math.random() * me.randomConversationsAllowed.length);
		var conversationIndex = me.randomConversationsAllowed[idx];
		var conversation = me.conversationList[conversationIndex];

		me.startConversation(conversation.messages, conversation.lockMovement);
	};

	this.startConversation = function(messageList, lockMovement)
	{
		if (me.speaking)
			return false;

		me.currentConversation = messageList;
		me.currentConversationIndex = -1;
		me.speaking = true;

		if (lockMovement)
		{
			euphoria.player.lockMovement();
		}
		me.lockedPlayerMovement = lockMovement;

		me.continueConversation();
		return true;
	};

	this.closeOpenMessage = function()
	{
		euphoria.windowManager.closeBoxByOwner(me);
	};

	this.continueConversation = function()
	{
		me.currentConversationIndex++;

		if (me.currentConversationIndex < me.currentConversation.length)
		{
			var currentMessage = me.currentConversation[me.currentConversationIndex];
			var text = currentMessage.text;

			if (currentMessage.textFn)
			{
				text = currentMessage.textFn();
			}

			if (currentMessage.person === 'player')
			{
				euphoria.player.speak(text, me.continueConversation, me);
			}
			else
			{
				me.speak(text, me.continueConversation, me);
			}
		}
		else
		{
			me.speaking = false;
			me.currentConversation = null;
			me.currentConversationIndex = -1;

			if (me.lockedPlayerMovement)
			{
				euphoria.player.unlockMovement();
				me.lockedPlayerMovement = false;
			}
		}
	};

	this.speak = function(message, onCloseMessage, owner, timeout)
	{
		euphoria.windowManager.addTextOnObject(me, message, onCloseMessage, owner, timeout || owner.speakTimeout);
	};
}