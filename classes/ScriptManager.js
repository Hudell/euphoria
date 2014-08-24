var scriptManager = {
	scripts : {},

	registerScript : function(fn)
	{
		var randomId = Math.random();

		while (this.scripts[randomId] !== undefined)
		{
			randomId = Math.random();
		}

		return this.registerNamedScript(randomId, fn);
	},

	registerNamedScript : function(name, fn)
	{
		this.scripts[name] = fn;
		return name;
	},

	runScript : function(name)
	{
		if (this.scripts[name])
		{
			this.scripts[name]();
		}
	},

	runUniqueScript : function(name)
	{
		this.runScript(name);

		this.scripts[name] = undefined;
	},

	setDelayScript : function(frame, fn)
	{
		var name = this.registerScript(fn);

		SetDelayScript(frame, this.getCallString(name, true));
	},

	getCallString : function(name, unique)
	{
		if (unique)
			return "scriptManager.runUniqueScript('" + name + "');";
		else
			return "scriptManager.runScript('" + name + "');";
	},

	bindKey : function(key, fnDown, fnUp)
	{
		var downScript = "";
		var upScript = "";

		if (fnDown)
		{
			var downScriptName = this.registerScript(fnDown);
			downScript = this.getCallString(downScriptName);
		}

		if (fnUp)
		{
			var upScriptName = this.registerScript(fnUp);
			upScript = this.getCallString(upScriptName);
		}

		BindKey(key, downScript, upScript);
	}
};