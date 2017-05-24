/*---------------------------------------------------------------------------------------------
checkOptions(pOptions, pChoices)

Description:
        Look for specific option choice(s) in the options string.  Both options and choices
        use commas to seperate multiple individual options.

Input:
        options		valid options (e.g. "filter,editsingle,alt")
        choices		check if any?? or all?? of choices in options (e.g. alt,url,image)

Returns:
        True if at least one choice is contained in options
        False if none of the choice(s) are found

Example:
		EZcheckOptions('filter,editsingle,alt','alt,url,image') returns true	???
		EZcheckOptions('pam,tom,sandy,larry','pam') returns true
---------------------------------------------------------------------------------------------*/
function EZcheckOptions(pOptions, pChoices)
{
	if (!pOptions || !pChoices) return false;
	var inputOpts = "," + pOptions + ",";
	inputOpts = inputOpts.toLowerCase();

	var searchOpts = pChoices.toLowerCase();
	var str;
	var pos;

	//----- For each desired choice ...
	while ( !searchOpts == "" )
	{
		str = searchOpts;
		pos = str.indexOf(",");
		if (pos == 0)
		{
			searchOpts = str.substring(pos+1);	//strip comma
			continue;
		} else if (pos > 0)
		{
			searchOpts = str.substring(pos+1);
			str = str.substring(0,pos);
		} else
		{// no commaa
			searchOpts = "";
		}
		// check for this choice
		if (inputOpts.indexOf("," + str + ",") >= 0) return true;
		if (inputOpts.indexOf("," + str + "=") >= 0) return true;
	}
	return false;
}
/*---------------------------------------------------------------------------------------------
Return specified option value from the snippet (or null if option not found)
---------------------------------------------------------------------------------------------*/
function EZgetOptionValue(optionName, snippet)
{
	var optStr = unescape(snippet);
	var optStrBeg = "<%-- Option:" + optionName + "="; // EZ.const.begLine;
	var optStrEnd = "--%>"; // EZ.const.endComment;
	var optPosBeg = optStr.indexOf(optStrBeg);
	var optPosEnd = optStr.indexOf(optStrEnd, optPosBeg);

	if(optPosBeg == -1 || optPosEnd == -1)
		return null;

	optStr = optStr.substring(optPosBeg + optStrBeg.length, optPosEnd);
	return EZtrim(optStr);

}
EZGetOptionValue = EZgetOptionValue;
/*---------------------------------------------------------------------------------------------
Looks for a key=value in the options string and returns the value portion.
(clone of getValue in EZTagSupport)

Parameters:
	options - String searched for key=value
	key - Key to find in options string

Returns:
	Associated value when key is found, otherwise returns blank string
---------------------------------------------------------------------------------------------*/
function EZgetOption(pOptions, pKey, defaultValue)
{
	var pos, str, keyEqual;
	if (!pOptions) pOptions = '';
	if (typeof defaultValue == 'undefined') defaultValue = '';

	//----- Search for key=
	keyEqual = pKey + "=";
	str = "," + pOptions;
	pos = str.toLowerCase().indexOf( keyEqual.toLowerCase() );

	if (pos == -1) 	// key not found
		str = defaultValue;
	else
	{
		//----- Keep everything after = up to ,
		str = pOptions.substring(pos + keyEqual.length - 1);
		pos = str.indexOf(",");
		if (pos >= 0) str = str.substring( 0, pos );	// value
	}
	//----- For backward compatibility: only map to true or false
	//		if defaultValue specified as boolean type
	if (typeof defaultValue == 'boolean')
		str = EZistrue(str)
	return str;
}
EZgetoption = EZgetOption;
/*---------------------------------------------------------------------------------------------
EZgetKeyValue

Description:
        Looks for a key = value string in the input string and returns the value portion.

Parameters:
        options		String to be searched
        key			Key searching for in options

Returns:
        If key is found, the associated value is returned, otherwise return blank string.
---------------------------------------------------------------------------------------------*/
function EZgetKeyValue( pOptions, pKey)
{
	var pos;
	var str;
	var keyEqual;

	//----- Search for key=
	keyEqual = pKey + "=";
	str = "," + pOptions;
	pos = str.toLowerCase().indexOf( keyEqual.toLowerCase() );

	if (pos == -1) 	// key not found
		str = "";
	else
	{
		//----- Keep everything after =
		str = pOptions.substring(pos + keyEqual.length - 1);
		pos = str.indexOf(",");
		if (pos >= 0) str = str.substring( 0, pos );	// value
	}
	return str;
}
/*---------------------------------------------------------------------------------------------
Fast select options builder: initialize
---------------------------------------------------------------------------------------------*/
function EZselectInit(selectElement,options)
{
	var name = EZselectValidate(selectElement);
	if (!name) return false;

	// Create initial html for menu/list (i.e. <select...> tag
	var html = '<select';
	if (!options) options = {};

	// get all attributes defined in surrent html tag
	for (var i=0;i<selectElement.attributes.length;i++)
	{
		var attrName = selectElement.attributes[i].name;
		var attrValue = selectElement.attributes[i].value;
		if (options[attrName] != undefined)
			attrValue = options[attrName];
		if (attrName == 'type') continue;
		html += ' ' + attrName + '="' + attrValue + '"';
	}
	html += '>\n';

	// Mark this menu/list active
	if (EZ.selectList == null)
		EZ.selectList = {};

	EZ.selectList[name] = {};
	EZ.selectList[name].html = html;

	// Add current options unless noclear specified (e.g. --select--, etc.)
	// Sample noclear usage: EZrefreshModules()
	if (EZcheckOptions(options,'noclear'))
	{
		for (var opt=0;opt<selectElement.options.length;opt++)
		{
			EZselectOption(selectElement,
						   selectElement.options[opt].text,
						   selectElement.options[opt].value,
						   selectElement.options[opt].selected);
		}
	}
}
/*---------------------------------------------------------------------------------------------
Fast select options builder: add option
---------------------------------------------------------------------------------------------*/
function EZselectOption(selectElement, text, value, isSelected)
{
	var name = EZselectValidate(selectElement, text, value);
	if (!name) return false;

	// add option to this active menu/list
	var selected = '';
	if (isSelected)
	{
		selected = ' selected';
		EZ.selectList[name].selected = true;
	}
	var html = '<option value="' + value + '"' + selected + '>' + text + '</option>\n';

	EZ.selectList[name].html += html;
	return true;
}
/*---------------------------------------------------------------------------------------------
Fast select options builder: save into selectElement
---------------------------------------------------------------------------------------------*/
function EZselectSave(selectElement)
{
	var name = EZselectValidate(selectElement);
	if (!name) return false;

	// add </select> if not already added
	var html = EZ.selectList[name].html;
	if (html.indexOf('selected>') == -1)
		html = html.replace(/>/,' selected>');
	html += '</select>'

	//dw.log('name', html);
	selectElement.outerHTML = html;

	// Mark this menu/list complete
	delete EZ.selectList[name];
	return true;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function EZselectValidate(selectElement,text,value)
{
	var prefix = 'EZselect: menu/list HTML element ';
	if (!selectElement)
		return EZwarn(prefix + 'not specified.');

	var name = selectElement.name || selectElement.id;
	if (!name)
		return EZwarn(prefix + 'does not have name or id.');

/*---------------------------------------------------------------------------------------------
	if (!EZ.selectList || !EZ.selectList[name])
	{
		var msg = prefix + ' name('+name+') unknown;\n';
		if (text) msg += '(text=' + text + ')\n';
		if (value) msg += '(value=' + value + ')\n';
		msg += '\n'
			 + 'EZselectInit() may not be called properly OR\n'
		     + 'EZselectSave() called before this option added';
		return EZwarn(msg);
	}
---------------------------------------------------------------------------------------------*/
	return name;
}
/*---------------------------------------------------------------------------------------------
Clear a list by setting all options to null.  Setting length does not do the job.
---------------------------------------------------------------------------------------------*/
function EZclearList(theList,options)
{
	theList = EZgetEl(theList);
	if (theList == null)
		return EZwarn(theList,'EZclearList: Invalid menu/list');

	if (EZcheckOptions(options,'fastclear'))
	{
		el.innerHTML = '';
		return true;
	}

	// clear current list
	if (!EZcheckOptions(options,'noclear'))
	{
		for(var i=theList.options.length-1;i>-1;i--)
			theList.options[i] = null;
		theList.options.length = 0
	}

	// setup html if fastselect
	if (EZcheckOptions(options,'fastselect'))
		EZselectInit(theList,options);
	return true;
}
/*---------------------------------------------------------------------------------------------
Remove a drop down or list option

Input Parameters
----------------
listObject		Down down or list object
opt				Index of select option to be removed
---------------------------------------------------------------------------------------------*/
function EZselectOptionRemove(listObject, opt)
{
	if (typeof listObject != 'object') return

	var selectedIndex = listObject.selectedIndex;

	var len = listObject.options.length
	if (opt < 0 || opt >= len) return

	if (opt < len-1)
	{
		for(var i=opt;i<len-1;i++)
		{
			listObject.options[i].text = listObject.options[i+1].text
			listObject.options[i].value = listObject.options[i+1].value
		}
	}
	listObject.options[len-1] = null
	if (listObject.options.length == len)
		listObject.options.length --

	if (selectedIndex >= listObject.options.length)
	{
		if (listObject.options.length)
		{
			listObject.selectedIndex = listObject.options.length-1;
			listObject.options[listObject.selectedIndex].selected = true;
		}
	}
	else if (selectedIndex == opt)
		listObject.options[selectedIndex].selected = false;
	else if (selectedIndex > opt)
		listObject.options[selectedIndex-1].selected = true;
}
/*---------------------------------------------------------------------------------------------
Set dropdown or list option

Input Parameters
----------------
listObject		Down down or list object
text			Text displayed for option
value			option value
selected		=true always select new option; =false never select
				='noselection' select if nothing yet selected

---------------------------------------------------------------------------------------------*/
function EZselectOptionAdd(listObject, text, value, selected, options)
{
	if (typeof listObject != 'object') return
	if (!options) options = '';
	if (EZcheckOptions(options,'fastselect'))
	{
		EZselectOption(listObject, text, value, selected);
		return;
	}

	var opt = listObject.options.length		//add and select record id

	//----- Don't know why but setting value at same time as defining option causes
	//		dropdown box to be hidden therefore DO NOT use the following form
	//		listObject.options[opt] = new Option(text,value);
	listObject.options[opt] = new Option(text);
	listObject.options[opt].value = value;

	if (selected == 'true' || selected == true)
		listObject.options[opt].selected = true;

	if (selected == 'noselection' && listObject.selectedIndex == -1)
		listObject.options[opt].selected = true;
}
/*---------------------------------------------------------------------------------------------
populate dropdown list using fastselect strategy

Arguments:
	selectElement 		object of element list to populate;
	items 				array of options added to selectElement
	defaultSelection	value of selected item
	
TODO: fix to preserve select properties
---------------------------------------------------------------------------------------------*/
function EZdisplayDropdown(selectElement, items, defaultSelection)
{
	var fastselect = 'window.dw.isNotDW'.ov(true) ? '' : 'fastselect';
	
	selectElement = EZgetEl(selectElement);
	if (selectElement == null) return;

	items = items || [];
	EZclearList(selectElement, fastselect);
	if (items.length > 0)
	{
		for (var i=0; i<items.length; i++)
		{
			var text = items[i];
			var value = text;
			var selected = (text == defaultSelection);
			EZselectOptionAdd(selectElement, text, value, selected,fastselect);
		}
	}
	if (fastselect) EZselectSave(selectElement);
	return selectElement;
}
