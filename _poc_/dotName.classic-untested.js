EZ.dotName = function EZdotName(dotName, quote)
{
	if (this instanceof EZdotName === false)
		return new EZdotName(dotName, quote);
	
	this._quote = quote || '';
	this._dotName = [dotName + '' || '$'];
	
	this.toString = function(key, quote)
	{
		var dotName = (!key) ? this._dotName 
					: this._dotName.concat( this.format(key, quote) )
		return dotName.join('');
	}
	this.add = function(key, quote)
	{
		this._dotName.push( this.format(key, quote) );
		return dotName.toString();
	}
	this.get = function(key, quote)
	{
		return dotName.toString(key, quote);
	}
	this.clone = function(key, quote)
	{
		var dotName = new EZ.dotName(this._dotName, quote || this._quote)
		if (key)
			this._dotName.push( this.format(key, quote) );
		return dotName;
	}
	this.format = function(key, quote)
	{
		quote = quote || this._quote;
		return (!isNaN(key)) 				  ? '[' + key + ']'
			 : (/^[A-Z_$][\w_$]*$/i.test(key)) ? '.' + key
			 : key.wrap("["+quote, quote + "]");
	}
}
