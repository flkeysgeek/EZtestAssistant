/*---------------------------------------------------------------------------------------
JavaScript version of calendar.xml_common_include.jsp

Below are some conversions from Java to JavaScript
.add --> .push
.get(...) -- > [...]
length() --> length
size() --> length
function (\w*)\(  -->  this.$1 = function(
(\s)(\w+\()       -->  $1this.$2
---------------------------------------------------------------------------------------------*/
function EZxmlBuild()
{
	this.VERSION = "12-19-2011";	//@@dw-version@@
	this.TAB = "  ";				//XML indent characters
	this.EOL = "\r\n";				//displays source better on IE windows
	this.CDATA_NEWLINE = "@@@";		//no indent if line starts with this marker

	this.xml = '';					//holds xml before written
	this.attr = [];					//attributes added to open tag e.g. url="myfile"
	this.openTags = [];				//tracks open tags
	this.logData = [];				//log entries put at end of xml

	this.addAttribute = function(attrName,attrValue)
	{
		this.attr.push(attrName + '=' + attrValue);
	}

	/**
	*	Parameters
	*		name	(required)	tag name
	*		value	(optional)	value placed between open & close tag
	*							(cannot be boolean if isHtml parameter omitted)
	*		isHtml	(optional)	true if value if value must be wrapped with CDATA
	*							(must be boolean if value omitted e.g. AddTag('myTag',true)
	**/
	this.addTag = function()	//name, value, isHTML
	{
		var args = [];
		for (var i=0;typeof(this.addTag.arguments[i])!='undefined';i++)
			if (!isNaN(i)) args.push(this.addTag.arguments[i]);

		var name = args.shift();
		var isHTML = false;
		if (args.length > 0
		&& args[args.length-1].constructor == Boolean)
			isHTML = args.pop();
		var value = args.shift();	//may be undefined

		if (!this.xml)				//if first tag, add standard attributes
		{
			this.attr.unshift("updated=" + EZformatdate());
			this.attr.unshift("version=" + VERSION);
		}

		var line = "";
		var lines = [];
		var attrStr = "";
		for (var i=0;i<this.attr.length;i++)
		{
			var keyValue = this.attr[i].split("=");
			attrStr += " " + keyValue[0] + '="' + keyValue[1] + '"';
		}

		var isCloseIt = true;
		if (typeof value == 'undefined')	//if no value, leave tag open
		{
			value = "";
			isCloseIt = false;
		}

		if (!isHTML || value.length == 0)
		{
			Encoder.EncodeType = "entity";
			value = Encoder.htmlEncode(value);
			line = "<" + name + attrStr + ">";
			if (isCloseIt)
			{
				if (value.length == 0)
					line = line.substring(0,line.length-1) + " />";
				else
					line += value + "</" + name + ">";
			}
			lines.push(line);
		}
		else
		{
			lines.push("<" + name + attrStr  + ">");
			value = value.replace(/[\r\n]+/,"\n");
			var values = value.split("\n");
			line = EZdup(1,this.TAB) + "<![" + "CDATA[" + values[0];

			for (var i=1;i<values.length;i++)
			{
				values[i].trim();
				if (values[i].length == 0) continue;
				lines.push(line);
				line = this.CDATA_NEWLINE + values[i];
			}
			lines.push(line + "]]>");
			lines.push("</" + name + ">");
		}
		this.attr = [];

		// add all lines to xml
		this.addLines(lines);

		if (!isCloseIt)
			this.openTags.push(name);
	}

	this.closeTag = function(tag)
	{
		if (!tag) tag = '';
		var tagNote = "";
		if (tag.length > 0)
			tagNote = " expected to close: " + tag;

		if (this.openTags.length == 0)
			this.addLine("***** no open tags" + tagNote);
		else
		{
			var closeTag = this.openTags.pop();
			if (tag.length > 0 && tag != closeTag)
				this.addLine("***** closing " + closeTag + " but" + tagNote);
			else
				this.addLine("</" + closeTag + ">");
		}
	}

	this.addLines = function(lines)
	{
		if (lines.constructor != Array) lines = [lines]
		var padding = EZdup(this.openTags.length,this.TAB);
		for (var i=0;i<lines.length;i++)
		{
			var value = lines[i];
			if (value.indexOf(this.CDATA_NEWLINE) == 0)
				value = value.substring(this.CDATA_NEWLINE.length);
			else
				value = padding + value;
			this.xml += value + this.EOL;
		}
	}
	this.addLine = this.addLines;

	//----- Add log entries to xml for debugging (cannot be top level tag)
	this.addLog = function(key, value)
	{
		if (typeof value == 'undefined')
		{
			value = key;
			key = '';
		}
		value += '';	//ned string

		if (key)
			value = key + '=' + value;

		this.logData.push(value);
	}

	//----- Add log entries to xml for debugging (cannot be top level tag)
	this.closeLog = function()
	{
		var i;
		var size = (this.logData.length-1) + "";
		var padding = EZdup(size,'0');

		this.addTag("log",null);
		for (i=0; i<this.logData.length;i++)
		{
			var key = "line" + (padding + (i+1)).right(size.length);
			var value = " " + this.logData[i] + " ";
			this.addTag(key,value);
		}
		this.closeTag("log");
	}

	this.getXml = function()
	{
		return this.xml;
	}
	this.writeXml = function(url)
	{
		return DWfile.write(url,this.xml);
	}
}