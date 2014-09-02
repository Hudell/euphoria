RequireScript("euphoria/classes/BaseClass.js");

function ItemClass() {
	var me = this;
	euphoria.debug.instantiate('ItemClass:' + me.name);

	me.name = null;

	me.superClass = BaseClass;
	me.superClass();
}