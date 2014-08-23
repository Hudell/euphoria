RequireScript("euphoria/classes/Person.js");

function PlayerPersonClass(name) {
	var me = this;

	me.superClass = PersonClass;
	me.superClass(name);
	me.myFontColor = CreateColor(0, 0, 0);
	me.makeSounds = true;

	//The player must not be destroyed
	me.onDestroy = function()
	{	
		
	};	
}

euphoria.globalDb.registerObjectClass("PlayerPerson", PlayerPersonClass);