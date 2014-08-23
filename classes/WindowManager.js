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
			id : Math.random()
		});
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
					me.showMenu(box.menu);
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

	me.bindMenuKeys = function(menuId)
	{
		BindKey(KEY_UP, "euphoria.openMenu.goUp();", "");
		BindKey(KEY_DOWN, "euphoria.openMenu.goDown();", "");
		BindKey(KEY_LEFT, "", "");
		BindKey(KEY_RIGHT, "", "");
		BindKey(KEY_ENTER, "euphoria.openMenu.activateOption();", "");
		BindKey(KEY_ESCAPE, "euphoria.windowManager.closeMenu(" + menuId + ");", "");
	};

	me.unbindMenuKeys = function()
	{
		UnbindKey(KEY_UP);
		UnbindKey(KEY_DOWN);
		UnbindKey(KEY_LEFT);
		UnbindKey(KEY_RIGHT);
		UnbindKey(KEY_ENTER);
		UnbindKey(KEY_ESCAPE);
	};

	me.closeMenu = function(menuId)
	{
		me.closeBoxById(menuId);
	};

	me.showMenu = function(menu, id)
	{
		menu.draw();
		euphoria.openMenu = menu;

		me.bindMenuKeys(id);
		menu.onSelect = function(selectionIdx){
			me.unbindMenuKeys();

			euphoria.player.setPerson(euphoria.player.person);
		};
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

		position.width = font.getStringWidth(text);
		position.x = position.x - position.width;
		me.showTextOnPosition(position, text, null, font, null);
	};

	me.showTextOnPosition = function(position, text, windowStyle, preferedFont, color)
	{
		var font = preferedFont;
		var wStyle = windowStyle;
		var fontColor = color;

		if (!font)
			font = me.getDefaultFont();
		if (!wStyle)
			wStyle = me.getDefaultWindowStyle();
		if (!color)
			fontColor = CreateColor(255, 255, 255);

		var maxWidth = GetScreenWidth() - me.rightMargin - position.x;
		
		var width = position.width;
		if (!width)
		{
			width = font.getStringWidth(text);
		}
		if (width > maxWidth)
			width = maxWidth;

		var height = position.height;
		if (!height)
		{
			height = font.getStringHeight(text, width);
		}

		// If the "bottom" position is less than zero, don't bother showing the box
		if (position.y < me.topMargin)
			return false; // return false so that the box will be closed when it gets off the screen

		position.y -= height;
		if (position.y < me.topMargin)
			position.y = me.topMargin;

		wStyle.drawWindow(position.x, position.y, width, height);
		font.setColorMask(fontColor);
		font.drawTextBox(position.x, position.y, width, height, 0, text);

		return true;
	};
}