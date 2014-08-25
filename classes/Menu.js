RequireScript("euphoria/classes/BaseClass.js");

function MenuClass() {
	var me = this;

	me.superClass = BaseClass;
	me.superClass();

	me.options = [];
	me.selection = 0;
	me.text = null;
	me.xSide = "center";
	me.ySide = "center";

	me.doFrame = function()
	{

	};

	me.draw = function()
	{
		var windowStyle = euphoria.windowManager.getDefaultWindowStyle();
		var font = euphoria.windowManager.getDefaultFont();
		var fontHeight = font.getHeight();
		var lineHeight = fontHeight + 10;
		var arrow = GetSystemArrow();
		var upArrow = GetSystemUpArrow();
		var downArrow = GetSystemDownArrow();
		var color = CreateColor(255, 255, 255);
		var x = 0;
		var y = 0;
		var menuHeight = (fontHeight + 10) * me.options.length;
		var menuWidth = 0;
		var i = 0;
		var marginHeight = 0;

		if (me.text !== null)
		{
			menuWidth = font.getStringWidth(me.text);
			marginHeight = fontHeight + 10;
			menuHeight += marginHeight;
		}
		
		for (i = 0; i < me.options.length; i++)
		{
			if (me.options[i].titleFn)
			{
				me.options[i].title = me.options[i].titleFn();
			}

			var stringWidth = font.getStringWidth(me.options[i].title);
			if (stringWidth > menuWidth)
				menuWidth = stringWidth;
		}

		menuWidth += 60;

		var halfScreenWidth = Math.floor(GetScreenWidth() / 2);
		var halfScreenHeight = Math.floor(GetScreenHeight() / 2);
		var oneThirdScreenWidth = Math.floor(GetScreenWidth() / 3);
		var oneThirdScreenHeight = Math.floor(GetScreenHeight() / 3);

		switch(me.xSide)
		{
			case "left" :
				x = oneThirdScreenWidth - Math.floor(menuWidth / 2);
				break;
			case "right" :
				x = oneThirdScreenWidth * 2 - Math.floor(menuWidth / 2);
				break;
			default :
				x = halfScreenWidth - Math.floor(menuWidth / 2);
				break;
		}

		switch(me.ySide)
		{
			case "top" :
				y = oneThirdScreenHeight - Math.floor(menuHeight / 2);
				break;
			case "bottom" :
				y = oneThirdScreenHeight * 2 - Math.floor(menuHeight / 2);
				break;
			default :
				y = halfScreenHeight - Math.floor(menuHeight / 2);
				break;
		}

		windowStyle.drawWindow(x, y, menuWidth, menuHeight);
		font.setColorMask(color);

		if (me.text !== null)
		{
			font.drawText(x + 30, y + 5, me.text);
		}

		for (i = 0; i < me.options.length; i++)
		{
			font.drawText(x + 30, y + marginHeight + 5 + (lineHeight * i), me.options[i].title);
		}

		arrow.blit(x, y + marginHeight + 5 + (lineHeight * me.selection));
	};

	me.handle = function(flipScreen)
	{
		while (AreKeysLeft())
		{
			switch(GetKey())
			{
				case KEY_UP :
					me.goUp();
					break;
				case KEY_DOWN :
					me.goDown();
					break;
				case KEY_ENTER :
					me.activateOption();
					return false;
				case KEY_ESCAPE :
					return false;
				default :
					break;
			}
		}

		return true;
	};

	me.onClose = function()
	{
		euphoria.openMenu = null;
	};

	me.onSelect = function(selectionIndex)
	{

	};

	me.open = function(backgroundImage)
	{
		euphoria.openMenu = me;

		while (true)
		{
			if (!me.handle())
			{
				me.onClose();
				return;
			}

			if (backgroundImage)
			{
				backgroundImage.blit(0, 0);
			}

			me.draw();
			FlipScreen();
		}
	};

	me.goUp = function()
	{
		me.selection--;
		if (me.selection < 0)
			me.selection = me.options.length -1;

		euphoria.soundManager.playEffectFile(gameConfig.soundFiles.menuMoveUp);
	};

	me.goDown = function()
	{
		me.selection++;
		if (me.selection >= me.options.length)
			me.selection = 0;

		euphoria.soundManager.playEffectFile(gameConfig.soundFiles.menuMoveDown);
	};

	me.activateOption = function()
	{
		me.onSelect(me.selection);
		euphoria.soundManager.playEffectFile(gameConfig.soundFiles.menuDecision);
		me.options[me.selection].onClick();
	};
}