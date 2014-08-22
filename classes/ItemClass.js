RequireScript("euphoria/classes/BaseClass.js");

function ItemClass() {
	var me = this;

	me.name = null;

	me.superClass = BaseClass;
	me.superClass();
}