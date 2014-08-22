function BaseClass()
{
	this.events = {};

	this.registerEvent = function(eventName, fn)
	{
		if (!this.events[eventName])
		{
			this.events[eventName] = new Array();
		}

		this.events[eventName].push(fn);
	};

	this.unregisterEvent = function(eventName, fn)
	{
		if (!this.events[eventName])
		{
			return;
		}

		var index = this.events[eventName].indexOf(fn);
		if (index >= 0)
		{
			this.events[eventName].splice(index, 1);
		}
	};

	this.runEvent = function(eventName, params)
	{
		if (!this.events[eventName])
		{
			return;
		}

		for (var i = 0; i < this.events[eventName].length; i++)
		{
			if (this.events[eventName][i].call(this, params) === false)
			{
				break;
			}
		}
	};
}