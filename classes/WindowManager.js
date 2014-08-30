RequireScript("euphoria/classes/BaseClass.js");

function WindowManagerClass() {
	var me = this;

	me.rightMargin = 32;
	me.topMargin = 16;

	me.superClass = BaseClass;
	me.superClass();

	me.textBoxes = [];

	me.addTextOnObject = function(object, text, onCloseMessage, owner, timeout)
	{
		var id = Math.random();

		me.textBoxes.push({
			type : 'object',
			object : object,
			text : text,
			closed : false,
			onCloseMessage : onCloseMessage,
			owner : owner,
			windowStyle : object.myWindowStyle,
			font : object.myFont,
			fontColor : object.myFontColor,
			timeout : timeout,
			id : id
		});

		return id;
	};

	me.addInfoText = function(text, timeout)
	{
		var randomValue = Math.random();

		me.textBoxes.push({
			type : 'info',
			text : text,
			closed : false,
			id : randomValue,
			timeout : timeout
		});
	};

	me.addScoreBox = function()
	{
		var randomValue = Math.random();

		me.textBoxes.push({
			type : 'score',
			text : null,
			closed : false,
			id : randomValue,
			timeout : 0
		});
	};

	me.addMenuBox = function(menu, onClose)
	{
		var randomValue = Math.random();

		me.textBoxes.push({
			type : 'menu',
			menu : menu,
			closed : false,
			id : randomValue,
			onCloseMessage : onClose,
			timeout : 0
		});

		return randomValue;
	};

	me.closeFirstOpenBox = function()
	{
		if (me.textBoxes.length > 0)
		{
			me.closeBox(0);
		}
	};

	me.closeBoxByOwner = function(owner)
	{
		for (var i = 0; i < me.textBoxes.length; i++)
		{
			var box = me.textBoxes[i];

			if (box.owner === owner)
			{
				me.closeBox(i);
				return;
			}
		}
	};

	me.closeBoxById = function(id)
	{
		for (var i = 0; i < me.textBoxes.length; i++)
		{
			var box = me.textBoxes[i];

			if (box.id === id)
			{
				me.closeBox(i);
				return;
			}
		}
	};

	me.closeBox = function(index)
	{
		me.textBoxes[index].closed = true;

		if (me.textBoxes[index].onCloseMessage)
		{
			me.textBoxes[index].onCloseMessage();
			me.textBoxes[index].onCloseMessage = undefined;
		}
	};

	me.removeClosedBoxes = function()
	{
		var i = 0;

		while (i < me.textBoxes.length)
		{
			if (me.textBoxes[i].closed === true)
			{
				me.textBoxes.splice(i, 1);
				continue;
			}

			i++;
		}
	};

	me.closeAll = function()
	{
		me.textBoxes = new Array();
	};

	me.drawBoxes = function()
	{
		var drewAny = false;

		for (var i = 0; i < me.textBoxes.length; i++)
		{
			var box = me.textBoxes[i];

			if (box.closed === true)
			{
				continue;
			}

			switch(box.type)
			{
				case 'object' :
					var position = box.object.getTopPosition();
					if (me.showTextOnPosition(position, box.text, box.windowStyle, box.font, box.fontColor))
					{
						drewAny = true;
					}
					else
					{
						// TO DO: End the whole conversation here
						me.closeBox(i);
					}
					break;

				case 'info' :
					me.showInfoBox(box.text);
					break;

				case 'score' :
					me.showScoreBox();
					break;

				case 'menu' :
					// me.showMenu(box.menu);
					break;

				default :
					break;
			}

			if (box.timeout)
			{
				SetDelayScript(box.timeout, "euphoria.windowManager.closeBoxById(" + box.id + ");");
			}
		}

		me.removeClosedBoxes();

		return drewAny;
	};

	me.getDefaultWindowStyle = function()
	{
		return GetSystemWindowStyle();
	};

	me.getDefaultFont = function()
	{
		return GetSystemFont();
	};

	me.showInfoBox = function(text)
	{
		var position = { x : 50, y : 50};
		var font = me.getDefaultFont();

		position.width = font.getStringWidth(text);

		var halfWidth = Math.floor(position.width / 2);
		var halfScreenWidth = Math.floor(GetScreenWidth() / 2);

		position.x = halfScreenWidth - halfWidth;

		me.showTextOnPosition(position, text, null, font, null);
	};

	me.showScoreBox = function()
	{
		var position = { x : GetScreenWidth() - 20, y : 50 };
		var font = me.getDefaultFont();

		var text = 'Score: ' + euphoria.score;
		var zoom = 2;

		position.width = font.getStringWidth(text) * zoom + 20;
		position.x = position.x - position.width;
		
		var black = CreateColor(0, 0, 0);
		var white = CreateColor(255, 255, 255);
		
		me.showTextOnPosition({x : position.x, y : position.y}, text, false, font, black, zoom);
		me.showTextOnPosition({x : position.x + 1, y : position.y + 1}, text, false, font, white, zoom);
	};

	me.showTextOnPosition = function(position, text, windowStyle, preferedFont, color, zoom)
	{
		var font = preferedFont;
		var wStyle = windowStyle;
		var fontColor = color;

		if (!font)
			font = me.getDefaultFont();
		if (!wStyle && wStyle !== false)
			wStyle = me.getDefaultWindowStyle();
		if (!color)
			fontColor = CreateColor(255, 255, 255);

		var maxWidth = GetScreenWidth() - me.rightMargin - position.x;
		
		var width = position.width;
		if (!width)
		{
			width = font.getStringWidth(text);
		}

		var height = position.height;
		if (!height)
		{
			height = font.getStringHeight(text, width);
		}

		if (zoom !== undefined)
		{
			height *= zoom;
			width *= zoom;
		}
		if (width > maxWidth)
			width = maxWidth;

		// If the "bottom" position is less than zero, don't bother showing the box
		if (position.y < me.topMargin)
			return false; // return false so that the box will be closed when it gets off the screen

		position.y -= height;
		if (position.y < me.topMargin)
			position.y = me.topMargin;

		if (wStyle !== false)
			wStyle.drawWindow(position.x, position.y, width, height);
		font.setColorMask(fontColor);

		if (zoom !== undefined)
		{
			font.drawZoomedText(position.x, position.y, zoom, text);
		}
		else
		{
			font.drawTextBox(position.x, position.y, width, height, 0, text);
		}

		return true;
	};
}