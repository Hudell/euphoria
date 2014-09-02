RequireScript("euphoria/gameStates/Menu.js");

function QuestionState(text, answers) {
	var me = this;

	euphoria.debug.instantiate('QuestionState:' + me.name + '(' + text + ')');

	me.superClass = BaseMenuState;
	me.superClass(null);
	me.name = "Question";
	me.text = text;
	me.answers = answers;

	me.registerFunction = function(fn)
	{
		return function(){
			me.closeMenu();
			if (fn)
				fn();
		};
	};

	me.createMenu = function()
	{
		me.menu = new MenuClass();
		me.menu.text = text;

		for (var i = 0; i < me.answers.length; i++)
		{
			var action = me.answers[i].actionFn;

			me.menu.options.push({
				title : me.answers[i].title,
				titleFn : me.answers[i].titleFn,
				actionFn : me.answers[i].actionFn,
				onClick :  me.registerFunction(me.answers[i].actionFn)
			});
		}

		me.menu.draw();
	};
}