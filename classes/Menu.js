RequireScript("euphoria/classes/BaseClass.js");

function MenuClass() {
	var me = this;

	me.superClass = BaseClass;
	me.superClass();

	me.options = [];
	me.selection = 0;

	me.doFrame = function()
	{

	};

	me.draw = function()
	{
		var windowStyle = mainGame.windowManager.getDefaultWindowStyle();
		var font = mainGame.windowManager.getDefaultFont();
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
		
		for (i = 0; i < me.options.length; i++)
		{
			var stringWidth = font.getStringWidth(me.options[i].title);
			if (stringWidth > menuWidth)
				menuWidth = stringWidth;
		}

		menuWidth += 30;

		var halfScreenWidth = Math.floor(GetScreenWidth() / 2);
		var halfScreenHeight = Math.floor(GetScreenHeight() / 2);
		x = halfScreenWidth - Math.floor(menuWidth / 2);
		y = halfScreenHeight - Math.floor(menuHeight / 2);

		windowStyle.drawWindow(x, y, 200, menuHeight);

		for (i = 0; i < me.options.length; i++)
		{
			font.setColorMask(color);
			font.drawText(x + 30, y + 5 + (lineHeight * i), me.options[i].title);
		}

		arrow.blit(x, y + 5 + (lineHeight * me.selection));
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
		mainGame.openMenu = null;
	};

	me.onSelect = function(selectionIndex)
	{

	};

	me.open = function(backgroundImage)
	{
		mainGame.openMenu = me;

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

		mainGame.soundManager.playEffectFile('Decision1.ogg');
	};

	me.goDown = function()
	{
		me.selection++;
		if (me.selection >= me.options.length)
			me.selection = 0;

		mainGame.soundManager.playEffectFile('Decision1.ogg');
	};

	me.activateOption = function()
	{
		me.onSelect(me.selection);
		// mainGame.soundManager.playEffectFile('Decision2.ogg');
		me.options[me.selection].onClick();
	};
}