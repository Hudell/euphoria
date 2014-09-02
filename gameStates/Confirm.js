RequireScript("euphoria/gameStates/Question.js");

function ConfirmState(text, actionFn) {
	var me = this;

	euphoria.debug.instantiate('ConfirmState(' + text + ')');

	me.actionFn = actionFn;
	me.superClass = QuestionState;
	me.superClass(text, [
		{
			title : "Yes",
			actionFn : function(){
				me.actionFn();
			}
		},
		{
			title : "No"
		}
	]);
	me.name = "Confirm";
}