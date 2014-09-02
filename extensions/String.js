if (!String.prototype.pad)
{
	String.prototype.pad = function(chr, length)
	{
		var text = this;
		for (var i = 0; i < length; i++)
		{
			text = chr + text;
		}

		return text;
	};
}