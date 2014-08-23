RequireScript("euphoria/classes/Object.js");

function MovableObjectClass(name) {
	var me = this;

	me.superClass = ObjectClass;
	me.superClass(name);

	me.moving = false;
	me.jumping = false;
	me.ai = null;
	me.obeyGravityLaws = true;

	me.jumpingFrame = 0;
	me.makeSounds = false;

	me.stepTo = function(direction, numSteps)
	{
		var command = null;
		me.lastDirection = direction;

		if (direction == -1)
		{
			direction = me.getRandomDirection();
		}
		me.lastAbsoluteDirection = direction;
		me.moving = true;

		if (numSteps !== 0 && !numSteps)
			numSteps = 1;

		switch(direction)
		{
			case 0 :
				command = COMMAND_MOVE_NORTH;
				break;
			case 1 :
				command = COMMAND_MOVE_WEST;
				break;
			case 2 :
				command = COMMAND_MOVE_SOUTH;
				break;
			case 3 :
				command = COMMAND_MOVE_EAST;
				break;
			default :
				command = COMMAND_MOVE_NORTH;
				break;
		}

		for (var i = 0; i < numSteps; i++)
		{
			QueuePersonCommand(me.name, command, true);
		}
	};

	me.checkCollision = function()
	{
		me.checkIfPersonTouchedSomeone(0, 5);
		me.checkIfPersonTouchedSomeone(0, -5);
		me.checkIfPersonTouchedSomeone(5, 0);
		me.checkIfPersonTouchedSomeone(-5, 0);
	};

	me.jump = function()
	{
		if (!me.canJump())
			return;

		if (me.makeSounds && euphoria.allowJumpingEffect)
			euphoria.soundManager.playEffectFile(gameConfig.soundFiles.jump);

		me.jumping = true;
		me.jumpingFrame = 0;
	};

	me.setAi = function(aiClassName)
	{
		var aiClass = euphoria.globalDb.getAIClass(aiClassName);
		me.ai = new aiClass(me);
	};

	me.canJump = function()
	{
		//It can only jump if it's standing in some ground
		return euphoria.mapManager.currentMap.twoDimensional && !me.jumping && me.isOnGround();
	};

	me.getDistanceToGround = function(maxDistance)
	{
		var position = me.getMapPosition();

		for (var i = 1; i <= maxDistance; i++)
		{
			if (IsPersonObstructed(me.name, position.x, position.y + i))
			{
				return i -1;
			}
		}

		return maxDistance;
	};

	me.getDistanceToCeiling = function(maxDistance)
	{
		var position = me.getMapPosition();

		for (var i = -1; i >= maxDistance; i--)
		{
			if (IsPersonObstructed(me.name, position.x, position.y + i))
			{
				return i +1;
			}
		}

		return maxDistance;
	};

	me.isOnGround = function()
	{
		return me.getDistanceToGround(1) === 0;
	};

	me.checkIfPersonTouchedSomeone = function(xDistance, yDistance)
	{
		var position = me.getMapPosition();
		var personName = GetObstructingPerson(me.name, position.x + xDistance, position.y + yDistance);
		if (personName)
		{
			var person = euphoria.getDb().getObject(personName);
			if (person)
			{
				person.onTouch(me);
			}
		}		
	};

	me.applyJumping = function()
	{
		if (euphoria.paused)
			return;
		
		var keepJumping = true;
		if (me == euphoria.player.person)
		{
			keepJumping = euphoria.keyboardEvents.isJumpButtonPressed();
		}

		if (me.jumpingFrame < 20 && keepJumping)
		{
			var distance = me.getDistanceToCeiling(-5);
			// if (distance > -5)
			// {
			// 	me.checkIfPersonTouchedSomeone(0, distance -1);
			// }
			
			if (distance !== 0)
			{
				me.moveVertically(distance);
				me.jumpingFrame++;
			}
			else
			{
				me.jumpingFrame = 20;
			}
		}
		else if (me.jumpingFrame < 25 && keepJumping)
		{
			me.jumpingFrame++;
		}
		else
		{
			me.jumping = false;
			me.jumpingFrame = 0;
		}
	};

	me.moveVertically = function(distance)
	{
		if (distance !== 0)
		{
			var position = me.getMapPosition();
			me.setPosition(position.x, position.y +distance);
		}
	};

	me.applyGravity = function()
	{
		if (!me.obeyGravityLaws)
			return;
		if (euphoria.paused)
			return;

		var distance = me.getDistanceToGround(7);

		// if (distance < 7)
		// {
		// 	me.checkIfPersonTouchedSomeone(0, distance +1);
		// }

		me.moveVertically(distance);
	};

	me.doFrame = function()
	{
		if (me.ai !== null)
		{
			me.ai.doFrame(me);
		}
		me.onFrame();

		if (euphoria.mapManager.currentMap.twoDimensional)
		{
			if (me.jumping)
			{
				me.applyJumping();
			}
			else
			{
				me.applyGravity();
			}
		}
	};	

	me.stop = function()
	{
		me.moving = false;
	};

	me.stepRandom = function(numSteps)
	{
		me.faceRandom();
		me.stepForward(numSteps);
	};

	me.stepNorth = function(numSteps)
	{
		me.faceNorth();
		me.stepForward(numSteps);
	};

	me.stepSouth = function(numSteps)
	{
		me.faceSouth();
		me.stepForward(numSteps);
	};

	me.stepWest = function(numSteps)
	{
		me.faceWest();
		me.stepForward(numSteps);
	};

	me.stepEast = function(numSteps)
	{
		me.faceEast();
		me.stepForward(numSteps);
	};

	me.stepForward = function(numSteps)
	{
		me.stepTo(me.lastAbsoluteDirection, numSteps);
	};

	me.stepBackward = function(numSteps)
	{
		me.faceBackward();
		me.stepForward(numSteps);
	};	
}