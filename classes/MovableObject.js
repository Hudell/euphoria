RequireScript("euphoria/classes/Object.js");

function MovableObjectClass(name) {
	var me = this;

	me.superClass = ObjectClass;
	me.superClass(name);

	me.moving = false;
	me.jumping = false;
	me.fallingFromJump = false;
	me.ai = null;
	me.obeyGravityLaws = true;
	me.gravityStrength = 7;

	me.jumpingFrame = 0;
	me.makeSounds = false;
	me.animationFrame = 0;

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

		var position = me.getMapPosition();

		for (var i = 0; i < numSteps; i++)
		{
			if (euphoria.mapManager.currentMap && euphoria.mapManager.currentMap.twoDimensional)
			{
				if (command == COMMAND_MOVE_EAST || command == COMMAND_MOVE_WEST)
				{
					if (euphoria.mapManager.currentMap.allowObstructionByPass)
					{
						var tileIndex;
						var y = position.y;

						if (command == COMMAND_MOVE_EAST)
						{
							if (IsPersonObstructed(me.name, position.x + 1, y))
							{
								tileIndex = GetObstructingTile(me.name, position.x +1, y);
								if (tileIndex >= 0 && euphoria.mapManager.currentMap.rightByPassableTilesIndexes.indexOf(tileIndex) >= 0)
								{
									me.setXPosition(position.x + 2);
								}
							}
						}
						else
						{
							if (IsPersonObstructed(me.name, position.x - 1, y))
							{
								tileIndex = GetObstructingTile(me.name, position.x +1, y);
								if (tileIndex >= 0 && euphoria.mapManager.currentMap.leftByPassableTilesIndexes.indexOf(tileIndex) >= 0)
								{
									me.setXPosition(position.x - 2);
								}
							}
						}
					}
					
					// 	var xDif = command == COMMAND_MOVE_EAST ? 5 : -5;

					// 	//If the person is obstructed by only 1 vertical pixel, move him up or down to avoid it
					// 	if (IsPersonObstructed(me.name, position.x + xDif, position.y))
					// 	{
					// 		var maxYDistance = 10;
					// 		if (!IsPersonObstructed(me.name, position.x + xDif, position.y - maxYDistance))
					// 		{
					// 			for (var j = 0; j < maxYDistance; j++)
					// 			{
					// 				if (!IsPersonObstructed(me.name, position.x + xDif, position.y - j))
					// 				{
					// 					me.setPosition(position.x + xDif, position.y - j);
					// 					break;
					// 				}

					// 				me.setPosition(position.x + xDif, position.y - maxYDistance);
					// 			}
					// 			continue;
					// 		}
					// 	}
				}
			}

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

	me.dropDown = function()
	{
		//If it can't jump, it can't drop either
		if (!me.canJump())
			return;

		//Check if the tile under it is bypassable
		var position = me.getMapPosition();
		var distance = 10;

		if (IsPersonObstructed(me.name, position.x, position.y + distance))
		{
			//If the map allows bypass
			if (euphoria.mapManager.currentMap.allowObstructionByPass)
			{
				//Check the index of the obstructing tile
				var tileIndex = GetObstructingTile(me.name, position.x, position.y + distance);
				if (tileIndex >= 0)
				{
					//If there is no list, then do not drop
					if (euphoria.mapManager.currentMap.downByPassableTilesIndexes.length === 0)
						return;

					//If there is a list and this tile is on it, then drop the object
					if (euphoria.mapManager.currentMap.downByPassableTilesIndexes.indexOf(tileIndex) >= 0)
					{
						me.moveVertically(distance);
					}
				}
			}
		}
	};

	me.setAi = function(aiClassName)
	{
		var aiClass = euphoria.globalDb.getAIClass(aiClassName);
		me.ai = new aiClass(me);
	};

	me.canJump = function()
	{
		//It can only jump if it's standing in some ground
		return (euphoria.mapManager.currentMap.twoDimensional && !me.jumping && me.isOnGround());
	};

	me.canClimb = function()
	{
		if (euphoria.mapManager.currentMap.twoDimensional && euphoria.mapManager.currentMap.allowStairs && !me.jumping)
		{
			if (euphoria.mapManager.currentMap.stairsTiles.length === 0)
				return false;

			//Test if the current tile is a stair
			var layer = GetPersonLayer(me.name);
			var position = me.getTilePosition();
			var layerX = GetLayerWidth(layer);
			var layerY = GetLayerHeight(layer);
			
			if (position.x < layerX && position.x >= 0 && position.y < layerY && position.y >= 0)
			{
				var tileIndex = GetTile(position.x, position.y, layer);

				return euphoria.mapManager.currentMap.stairsTiles.indexOf(tileIndex) >= 0;
			}
		}

		return false;
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
			if (position.y + i <= 0)
				return i;

			if (IsPersonObstructed(me.name, position.x, position.y + i))
			{
				//If the map allows objects to jump from under an object to over it
				if (euphoria.mapManager.currentMap.allowObstructionByPass)
				{
					//Then do not consider chosen tile obstructions
					var tileIndex = GetObstructingTile(me.name, position.x, position.y + i);
					if (tileIndex >= 0)
					{
						//If there is no list, everything is on the list
						if (euphoria.mapManager.currentMap.upByPassableTilesIndexes.length === 0)
							continue;

						//If there is a list and this tile is on it, then do not obstruct the object
						if (euphoria.mapManager.currentMap.upByPassableTilesIndexes.indexOf(tileIndex) >= 0)
							continue;
					}
				}

				var entitieName = GetObstructingPerson(me.name, position.x, position.y + i);
				if (entitieName)
				{
					//if entitie is breakable, do it!
					var entitie = euphoria.getDb().getObject(entitieName);
					if (entitie)
					{
						entitie.doBreak();

						if (entitie.ignoreObstructions)
							continue;
					}
				}

				return i +1;
			}
		}

		return maxDistance;
	};

	me.isOnGround = function()
	{
		if (me.getDistanceToGround(1) === 0)
		{
			me.fallingFromJump = false;
			return true;
		}

		return false;
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

		//If this is the player, only keep jumping if the jump key is still pressed
		if (me == euphoria.player.person)
		{
			keepJumping = euphoria.keyboardEvents.isJumpButtonPressed();
		}

		if (me.jumpingFrame < 30 && keepJumping)
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
				me.jumpingFrame = 30;
			}
		}
		else if (me.jumpingFrame < 35 && keepJumping)
		{
			me.jumpingFrame++;
			me.fallingFromJump = true;
		}
		else
		{
			me.jumping = false;
			me.jumpingFrame = 0;
		}

		//If this is the player and is currently jumping
		if (me == euphoria.player.person && (me.jumping || me.fallingFromJump))
		{
			//check if it jumped over someone
			var position = me.getMapPosition();
			var jumpedOver = me.getFirstObstructionUnderPosition(position);

			if (jumpedOver !== null)
			{
				jumpedOver.doOnJumpOver();
			}
		}
	};

	me.getFirstObstructionUnderPosition = function(position)
	{
		var x = position.x;
		var y = position.y;

		while (!IsPersonObstructed(me.name, x, y))
		{
			y++;

			//Limit it to 400 pixels
			if (y > position.y + 400)
				return null;
		}

		var name = GetObstructingPerson(me.name, x, y);
		if (name)
		{
			var person = euphoria.getDb().getObject(name);

			if (person)
				return person;

			person = euphoria.globalDb.getObject(name);

			if (person)
				return person;
		}

		return null;
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
		if (!euphoria.gravity)
			return;

		//If the entity is in a climbable tile, do not apply gravity to him
		if (me.canClimb())
			return;

		var distance = me.getDistanceToGround(me.gravityStrength);

		// if (distance < me.gravityStrength)
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
				if (me.obeyGravityLaws)
				{
					me.applyGravity();

					var position = me.getMapPosition();
					var originalY = position.y;

					//If the person is obstructed on it's current position, move it a little down so it doesn't get stuck
					while (IsPersonObstructed(me.name, position.x, position.y))
					{
						position.y++;
						//Make sure it doesn't fall faster than gravity
						if (position.y - originalY > me.gravityStrength)
							break;
					}

					if (position.y !== originalY)
						me.setPosition(position.x, position.y);
				}
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

	me.walkNorth = function(frames)
	{
		me.faceNorth();
		me.stepNorth(frames);
	};

	me.walkSouth = function(frames)
	{
		me.faceSouth();
		me.stepSouth(frames);
	};

	me.walkEast = function(frames)
	{
		me.faceEast();
		me.stepEast(frames);
	};

	me.walkWest = function(frames)
	{
		me.faceWest();
		me.stepWest(frames);
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