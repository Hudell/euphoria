RequireScript("euphoria/classes/BaseClass.js");

function InventoryClass() {
	var me = this;

	me.superClass = BaseClass;
	me.superClass();

	me.normalItems = {};

	me.addItem = function(itemName, amount)
	{
		if (amount === undefined || amount === null)
			amount = 1;

		if (me.normalItems[itemName] === undefined)
		{
			me.normalItems[itemName] = {amount : amount};
			return;
		}

		me.normalItems[itemName].amount += amount;
	};

	me.getItemAmount = function(itemName)
	{
		if (!me.normalItems[itemName])
			return 0;

		return me.normalItems[itemName].amount;
	};
}