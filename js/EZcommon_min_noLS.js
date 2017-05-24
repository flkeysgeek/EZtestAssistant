/*--------------------------------------------------------------------------------------------------
LINT options -- function below not called
--------------------------------------------------------------------------------------------------*/
/*global 
	EZ, e:true, g, dw, DWfile
*/

var e;
(function jshint_globals_not_used() {	//global variables and functions defined but not used
e = [
	e, g, dw, DWfile
]});
/*-----------------------------------------------------------------------------
for each specified el(s) ADD specified className(s)

legacy EZaddClass() in EZ.core.js
-----------------------------------------------------------------------------*/
EZ.addClass = function EZaddClass(el,className,isTrueFalse)
{
	if (EZ.test.capture()) {return EZ.test.capture(this)} else if (EZ.test.debug()) debugger;

	isTrueFalse = arguments.length <= 2 || isTrueFalse;
	var action = isTrueFalse ? 'add' : 'remove';
	return EZ.classAction(el, className, action);
}
//_____________________________________________________________________________________________
EZ.addClass.test = function()
{
	var arg='', el='', obj=null, 
		ctx = 'na', ex = 'na', fn = null, note = '';
	e = [obj];
	
	fn = function validateResults(results, testrun)
	{
		testrun.results = el.className;		//set results to updated classname attribute
		//return ex;	//optionally return expected
	}
	function setup(current, add, want)
	{
		el = document.createElement('div');
		el.className = current;
		note = 'current: ' + current
			 + '\n\nadd arg: ' + add;
		arg = add;
		ex = want || current;
		EZ.test.results({ex:ex, fn:fn, ctx:ctx, note:note})
	}
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	setup('', 'classB', 'classB')
	EZ.test.run(el, arg)
	
	setup('A', 'B', 'A B')
	EZ.test.run(el, arg)
	
	setup('A B', 'B', 'A B')
	EZ.test.run(el, arg)
	
	setup('A B', 'B', 'A B')
	EZ.test.run(el, arg, false)
	
	setup('highlight scroll scrollWidth scrollHeight', 'scrollWidth')
	EZ.test.run(el, arg, false)
	//______________________________________________________________________________
	return //endtest
}
/*-----------------------------------------------------------------------------
return true if any specified el has any specified class
-----------------------------------------------------------------------------*/
EZ.hasClass = function EZhasClass(el, className) 
{ 
	return EZ.classAction(el, className, 'has');
}
EZ.hasAnyClass = function EZhasAnyClass(el, className)	//backward compatibility
{
	return EZ.classAction(el, className, 'has');
}
/*-----------------------------------------------------------------------------
for each specified el(s) remove specified className(s)
-----------------------------------------------------------------------------*/
EZ.removeClass = function EZremoveClass(el, className,isTrueFalse)
{
if (/(hidden)/.test(className))
	void(0);

	isTrueFalse = arguments.length <= 2 || isTrueFalse;
	var action = isTrueFalse ? 'remove' : 'add';
	EZ.classAction(el, className, action);
}
/*--------------------------------------------------------------------------------------------------
for all specified el(s) toggle each specified className(s)

Similar function EZ.core.js::EZtoggleClass(el,className)

RETURNS:
	String of all updated classNames of all specified elements with duplicates removed.
	(easily facilitates search fo partial names)
--------------------------------------------------------------------------------------------------*/
EZ.toggleClass = function EZtoggleClass(el, className)
{
	if (!el || !className) return '';
	var	classNames = EZ.toArray(className, ' ').removeDups(true);
	if (classNames.length === 0) return '';
	
	var updatedClassNames = '';
	//var selectors = EZ.toArray(el, true).removeDups(true)
	EZ(el, true).forEach(function(el)
	{
		classNames.forEach(function(className)
		{
			var action = EZ.hasClass(el, className) ? 'remove' : 'add';
			EZ.classAction(el, className, action);
			updatedClassNames += ' ' + el.className;
		});
	});
	classNames = EZ.toArray(updatedClassNames, ' ').remove().removeDups();
	return classNames.join(' ').trim();
}
/*-----------------------------------------------------------------------------
Implements: EZ.addClass() EZ.removeClass() EZ.hasClass()
-----------------------------------------------------------------------------*/
EZ.classAction = function EZclassAction(el, className, action /* add | remove | has */)
{	
	var isLegacy = EZ.isLegacy()
	if (isLegacy)
	{
		if (!el) return false;
		if (!/(add|remove|has)/.test(action || '')) return false;
	}
	else
	{
		el = EZ(el,true).remove();	//EZ.removeDups(true)
		if (!el || !el.length || el[0].undefined
		|| !/(add|remove|has)/.test(action || '')) 
			return '';
	}
	var allClassNames = [];
	
	// if className not Array, create from comma or space delimited String
	var	classNames = EZ.toArray(className, ' ').remove();
	if (!classNames.length) return false;
	
	// for all specified el(s) (if el not Array, create) . . .
	var status = EZ.toArray(el, ', ').remove().some(function(el)
	{
		if (!el || el.className === undefined) return false;	//continue
		
		// create classArray from el.className
		var	classArray = EZ.toArray(el.className, ' ').remove();
		if (action == 'has' && !classArray.length)				
			return false;	
		
		// for all specified classNames . . .
		var status = classNames.some(function(className)
		{
			if (action == 'has')	//quit if match otherwise continue
				return classArray.indexOf(className) != -1;
		
			//-------------------------------------------------------------------
			if (isLegacy)					//above if never true
			{
				var regex = RegExp('(^| )' + className + '( |$)');
				className = action == 'remove' ? '' 
						  : ' ' + className;
			
				// remove prior className -- then add className for "add" action
				el.className = (el.className.replace(regex, '') + className).trim();
			}								//end of legacy
			//-------------------------------------------------------------------
			else
			{
				var timer = className.split('=');		//class=ssss
				if (timer.length == 2)
				{
					className = timer[0];
					timer = timer[1];
				}
				else timer = '';
				
				var isFound = classArray.length > 0 && classArray.includes(className);
				if (action == 'has') 
					return isFound;						//quits some loop if true
					
				else if (action == 'add' && !isFound)	
				{	
					classArray.push(className);
					if (timer)
						setTimeout(function(){EZ.removeClass(el,className)}, timer);
				}
				else if (action == 'remove' && isFound)		
					classArray = classArray.remove(className);
			
				el.className = classArray.join(' ');	//update this el className
				allClassNames = allClassNames.concat(classArray);
			}
		});
		return status;
	});
	if (isLegacy || action == 'has') 
		return status;						//return true/false for legacy or has
	
	if ([].removeDups)
		allClassNames = allClassNames.removeDups();
	return allClassNames.join(' '); 		//return className(s) for all elements
}
//_____________________________________________________________________________________________
EZ.classAction.test = function()
{
	var el, ex, note;
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	// invalid argument tests -- for valid data, see: add/has/remove/toggle 
	ex = ''
	
	note = 'invalid element'
	EZ.test.results({ex:ex, note:note})
	EZ.test.run(undefined)

	EZ.test.results({ex:ex, note:note})
	EZ.test.run(null)

	EZ.test.results({ex:ex, note:note})
	EZ.test.run('')

	EZ.test.results({ex:ex, note:note})
	EZ.test.run(document)

	EZ.test.results({ex:ex, note:note})
	EZ.test.run({})

	EZ.test.results({ex:ex, note:note})
	EZ.test.run([])

	EZ.test.results({ex:ex, note:note})
	EZ.test.run(EZ.none())

	EZ.test.results({ex:ex, note:note})
	EZ.test.run(document)

	EZ.test.results({ex:ex, note:note})
	EZ.test.run(document.documentElement)

	note = 'element good -- invalid className'
	el = document.createElement('div');
	
	EZ.test.results({ex:ex, note:note})
	EZ.test.run(el,undefined)
	
	EZ.test.results({ex:ex, note:note})
	EZ.test.run(el,null)
	
	EZ.test.results({ex:ex, note:note})
	EZ.test.run(el,{})
	
	EZ.test.results({ex:ex, note:note})
	EZ.test.run(el,[])
	
	EZ.test.results({ex:ex, note:note})
	EZ.test.run(el,'')

	note = 'element / class good -- invalid action'
	
	EZ.test.results({ex:ex, note:note})
	EZ.test.run(el,'myclass',undefined)
	
	EZ.test.results({ex:ex, note:note})
	EZ.test.run(el,'myclass',null)
	
	EZ.test.results({ex:ex, note:note})
	EZ.test.run(el,'myclass',{})
	
	EZ.test.results({ex:ex, note:note})
	EZ.test.run(el,'myclass',[])
	
	EZ.test.results({ex:ex, note:note})
	EZ.test.run(el,'myclass','')
	
	EZ.test.results({ex:ex, note:note})
	EZ.test.run(el,'myclass','bad')

	//______________________________________________________________________________
	return //endtest
}
/*-----------------------------------------------------------------------------
-----------------------------------------------------------------------------*/
EZ.getAllLayers = function EZgetAllLayers(tagNames)
{
	var layers = {};
	tagNames = tagNames || 'div span pre fieldset label layer iframe table b i font';
	EZ.toArray(tagNames, ', ').forEach(function(tag)
	{									// for each element with tagName . . .
		var tags = document.getElementsByTagName(tag);
		[].forEach.call(tags, function(el)
		{								
			if (!el.id) return;			//skip tags w/o id
			if (el.innerHTML.match(/^\s*\[.*\]\s*/)) 
				el.innerHTML = '';		// clear design-time placeholder text
			layers[el.id] = el;
		});
	});
	return layers;
}
/*-----------------------------------------------------------------------------
-----------------------------------------------------------------------------*/
EZ.getAllFields = function EZgetAllFields(myForms)
{
	myForms = myForms || document.forms;
	var fields = {}
	EZ.toArray(myForms).forEach(function(form)
	{
		Array.prototype.forEach.call(form, function(el)
		{
			var id = el.id || el.name;
			if (id)
				fields[id] = el;
		});
		var tags = document.getElementsByTagName('option');
		[].forEach.call(tags, function(el)
		{
			var id = el.id || el.name;
			if (id)
				fields[id] = el;
		});
	});
	return fields;
}
/*-----------------------------------------------------------------------------
EZ.css.insertRule(selector, rules) 

ARGUMENTS:
	selector	specifies css selector
	rules		specifies one or more rules for selector as Array or String
				delimited by ";", "," or (TODO: spaces)
USAGE:
	EZ.css.insertRule('header', 'float: left; opacity: 0.8;');

REFERENCE: base before enhancements
	http://davidwalsh.name/essential-javascript-functions	
-----------------------------------------------------------------------------*/
EZ.css.insertRule = function EZcssInsertRule(selector, rules) 
{
	if (!selector) return;
	
	// if this is document, use it otherwise use document
	var doc = (this.constructor == document.constructor) ? this : document;
	var sheet = (function() 
	{
		// Create the <style> tag
		var style = doc.createElement('style');
	
		// Add a media (and/or media query) here if you'd like!
		// style.setAttribute('media', 'screen')
		// style.setAttribute('media', 'only screen and (max-width : 1024px)')
	
		// WebKit hack :(
		style.appendChild(document.createTextNode(''));
	
		// Add the <style> element to the page
		doc.head.appendChild(style);
	
		return style.sheet;
	})();
	
	rules = EZ.toArray(rules, ';').remove();		//parse rules into array

	rules = rules.join(';').replace(/;+/, ';');		//allow space as delimiter
	rules = rules.replace(/(['"]).*?\1/, function(all)
	{												//for strings inside quotes...
		all = all.replace(/\s+/g, '@~@');			//...escape spaces
		all = all.replace(/,+/g, '@,@');			//...escape commas
	})	
	rules = rules.replace(/(\w*?:)(\s*)/g, '$1');	//remove spaces after ":"
	rules = EZ.toArray(rules, ' ,;').remove();		//re-parse into Array
	
	// 
	rules = rules.join(';').replace(/;+/, ';');
	rules = rules.replace(/@(.*?)@/g, '$1');		//un-escape commas and spaces
	
	// header { float: left; opacity: 0.8; }
	sheet.insertRule(selector + '{' + rules + '}', 0);
	
	return '.rules.0.cssText'.ov(sheet);			//return selector / rules
}
//_____________________________________________________________________________________________
EZ.css.insertRule.test = function()
{
	var impl = document.implementation;
	var doc = impl.createHTMLDocument('unit test');
	//var htmlDoc = new ActiveXObject("htmlfile");	//older IE
	
	EZ.test.run('hide','display:none',					{EZ: {ctx:doc, ex:
	            'hide { display: none; }'				,	note:''	}})
	EZ.test.run('hide','display:none, color:red',		{EZ: {ctx:doc, ex:
	            'hide { display: none; color: red; }'		}})
}

/*-----------------------------------------------------------------------------
EZ.matchesSelector(el, selector)

Find css selector ??

USAGE:
	EZ.matchesSelector(document.getElementById('myDiv'), 'div.someSelector[some-attribute=true]')
-----------------------------------------------------------------------------*/
EZ.matchesSelector = function EZmatchesSelector(el, selector) 
{
	var p = Element.prototype;
	var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector 
	|| function(s) 
	{
		return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
	};
	return f.call(el, selector);
}
/*---------------------------------------------------------------------------------------------
Adjust textarea hieght to fit value up to optional maxHeight.
if textarea.value is empty string, clear height.
---------------------------------------------------------------------------------------------*/
EZ.fitHeight = function EZfitHeight(el, maxHeight)
{
	if (!'.childNodes'.ov(el) || !'textarea'.equalsIgnoreCase(el.tagName)) 
		return;				//not textarea
	
	var maxHeight = Math.max(maxHeight || el.scrollHeight, el.clientHeight);
	
	el.style.height = '';						//clear prior height
	if (el.clientHeight <= el.scrollHeight)		//reset if more needed to show all
	{
		el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px';
	}
}
/*-----------------------------------------------------------------------------
EZ.matchesSelector(el, selector)

Find css selector ??

REFERENCE: base before enhancements
	http://stackoverflow.com/questions/512528/set-cursor-position-in-html-textbox
-----------------------------------------------------------------------------*/
EZ.setCursor = function EZsetCursor(el, caretPos) 
{
    //var el = document.getElementById(elemId);
    if (el != null) 
	{
        if (el.createTextRange) 
		{
            var range = el.createTextRange();
            range.move('character', caretPos);
            range.select();
        }
        else 
		{
            if (el.selectionStart) 
			{
                el.focus();
                setTimeout(function() {el.setSelectionRange(caretPos, caretPos)}, 250);
            }
            //else
            //    el.focus();
        }
    }
}
/*-----------------------------------------------------------------------------
EZ.removeNodes(nodes)
-----------------------------------------------------------------------------*/
EZ.removeNodes = function EZremoveNodes(nodes) 
{
	if (!nodes) return;
	//nodes = EZ.toArray(nodes);
	while (nodes.length)
	{
		var node = nodes[0];
		node.parentNode.removeChild(node);
	}
}
/*---------------------------------------------------------------------------------------------
Return string of the form (for filename): YYYY-MM-DD.HH_MM_SS

TODO: ??
.replace(/ /,'@').replace(/:/,'~');	//2016-01-25@18~50_02
---------------------------------------------------------------------------------------------*/
EZ.timestampFilename = function EZtimestampFilename(date)
{
	return EZ.timestamp(date).replace(/:/g,'_').replace(/ /,'.');
}
/*---------------------------------------------------------------------------------------------
Return string of the form: YYYY-MM-DD HH:MM:SS
---------------------------------------------------------------------------------------------*/
EZ.timestamp = function EZtimestamp(date)
{
	if (!date) date = new Date();
	var str = date.getFullYear() + '-'
			+ EZ.right('0'+(date.getMonth()+1),2) + '-'
			+ EZ.right('0'+date.getDate(),2) + ' '
			+ EZ.right('0'+date.getHours(),2)  + ':'
			+ EZ.right('0'+date.getMinutes(),2)  + ':'
			+ EZ.right('0'+date.getSeconds(),2);
	return str;
}
/*---------------------------------------------------------------------------------------------
options comma delimited string of options -- "time" always appended
spaces appended if "nospace" not found
---------------------------------------------------------------------------------------------*/
EZ.formatTime = function EZformatTime(theDate, options)
{
	if (!options && typeof(theDate) == 'string' && isNaN(new Date(theDate)))
	{
		options = theDate;
		theDate = '';
	}
	options = EZ.toArray(options, ' ,'); 
	options.push('time');
	if (!EZ.join(options).includesIgnoreCase(',nospace'))
		options.push('spaces');
	return EZ.formatdate(theDate, options);
}
/*---------------------------------------------------------------------------------------------
Format date as: mm-dd-yyyy hh:mm am/pm

Options is an optional String representing one of the following
	(default)		Return date and time if not 0
	datetime		Always return date and time
	date, dateonly	Return date only
	time, timeonly	Return time only
	ms				include milli seconds
	space spaces	space before am or pm -- TODO: make default like EZ.formatTime()
	nospaces		no spaces before am or pm

	if options not specified or any other value, return date (and time if not 12:00am)
---------------------------------------------------------------------------------------------*/
EZ.formatDate = function EZformatDate(theDate, options)
{
	var value = ''
	var theDateOrig = theDate;
	options = EZ.toArray(options, ' ,'); 
	//if (typeof options == 'undefined') options = ''

	if (!theDate) theDate = '';
	if (theDate.constructor != Date)
	{
		theDate = theDate ? new Date(theDate) : new Date();
		if (isNaN(theDate.getTime()))
		{
			//EZ.warn(theDateOrig,'Invalid Date');
			return theDateOrig + '';
		}
	}

	var hours = theDate.getHours() % 12
	if (hours == 0) hours = 12

	var year = theDate.getYear()			//js 1.1 compatible
	if (year < 1000) year += 1900			//broswer quirks
	if (year < 2000)
	{
		//see if the 4 digit year matches a string in the date field
		//if not then they we need to add 100 to the year

		//02-16-2016 DCO: disabled -- must be left from clone src 
		//if (fieldValue.indexOf(year.toString()) == -1)
		//	year += 100
	}

	var dateString = EZ.right('0'+(theDate.getMonth()+1).toString(),2) + '-'
	               + EZ.right('0'+theDate.getDate(),2) + '-'
	               + year

	var ms = !options.includes('ms') ? ''
		   : '.' + EZ.right('000'+theDate.getMilliseconds().toString(),3);
		   
	var timeString = EZ.right('0'+hours.toString(),2) + ':'
                   + EZ.right('0'+theDate.getMinutes(),2) + ':'
                   + EZ.right('0'+theDate.getSeconds(),2)
				   + ms
				   + (options.includes('spaces') ? ' ' : '')
                   + (theDate.getHours() < 12 ? 'am' : 'pm'); //no space to avoid wrap

	if (options.includes('datetime'))
		value = dateString + ' ' + timeString

	else if (options.includes('date'))
		value = dateString

	else if (options.includes('time'))
		value = timeString
	
	else
	{
		if (theDate.getHours() == 0 && theDate.getMinutes() == 0)
			value = dateString
		else
			value = dateString + ' ' + timeString
	}
	return value;
}
EZ.formatdate = EZ.formatDate;
/*---------------------------------------------------------------------------------------------
Fast select options builder: initialize
---------------------------------------------------------------------------------------------*/
EZ.selectInit = function EZselectInit(selectElement,options)
{
	var name = EZ.selectValidate(selectElement);
	if (!name) return false;

	// Create initial html for menu/list (i.e. <select...> tag
	var html = '<select';
	if (!options) options = {};

	// get all attributes defined in surrent html tag
	for (var i=0;i<selectElement.attributes.length;i++)
	{
		var attrName = selectElement.attributes[i].name;
		var attrValue = selectElement.attributes[i].value;
		if (options[attrName] != EZ.undefined)
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
	// Sample noclear usage: EZ.refreshModules()
	if (EZ.isChoice(options,'noclear'))
	{
		for (var opt=0;opt<selectElement.options.length;opt++)
		{
			EZ.selectOption(selectElement,
						   selectElement.options[opt].text,
						   selectElement.options[opt].value,
						   selectElement.options[opt].selected);
		}
	}
}
/*---------------------------------------------------------------------------------------------
Fast select options builder: add option
---------------------------------------------------------------------------------------------*/
EZ.selectOption = function EZselectOption(selectElement, text, value, isSelected)
{
	var name = EZ.selectValidate(selectElement, text, value);
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
EZ.selectSave = function EZselectSave(selectElement)
{
 	if (dw.isNotDW) return;
	var name = EZ.selectValidate(selectElement);
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
EZ.selectValidate = function EZselectValidate(selectElement,text,value)
{
	var prefix = 'EZselect: menu/list HTML element ';
	if (!selectElement)
		return EZ.warn(prefix + 'not specified.');

	var name = selectElement.name || selectElement.id;
	if (!name)
		return EZ.warn(prefix + 'does not have name or id.');

/*---------------------------------------------------------------------------------------------
	if (!EZ.selectList || !EZ.selectList[name])
	{
		var msg = prefix + ' name('+name+') unknown;\n';
		if (text) msg += '(text=' + text + ')\n';
		if (value) msg += '(value=' + value + ')\n';
		msg += '\n'
			 + 'EZ.selectInit() may not be called properly OR\n'
		     + 'EZ.selectSave() called before this option added';
		return EZ.warn(msg);
	}
---------------------------------------------------------------------------------------------*/
	return name;
}
/*---------------------------------------------------------------------------------------------
Clear a list by setting all options to null.  Setting length does not do the job.

TODO: retain styles
---------------------------------------------------------------------------------------------*/
EZ.clearList = function EZclearList(theList,options)
{
	theList = EZ.getEl(theList);
	if (theList == null)
		return EZ.warn(theList,'EZclearList: Invalid menu/list');

	if (EZ.isChoice(options,'fastclear') && !dw.isNotDW)
	{
		theList.innerHTML = '';
		return true;
	}

	// clear current list
	if (!EZ.isChoice(options,'noclear'))
	{
		for(var i=theList.options.length-1;i>-1;i--)
			theList.options[i] = null;
		theList.options.length = 0
	}

	// setup html if fastselect
	if (EZ.isChoice(options,'fastselect') && !dw.isNotDW)
		EZ.selectInit(theList,options);
	return true;
}
/*---------------------------------------------------------------------------------------------
Remove a drop down or list option

Input Parameters
----------------
listObject		Down down or list object
opt				Index of select option to be removed
---------------------------------------------------------------------------------------------*/
EZ.selectOptionRemove = function EZselectOptionRemove(listObject, opt)
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
EZ.selectOptionAdd = function EZselectOptionAdd(listObject, text, value, selected, options)
{
	if (typeof listObject != 'object') return
	if (!options) options = '';
	if (EZ.isChoice(options,'fastselect') && !dw.isNotDW)
	{
		EZ.selectOption(listObject, text, value, selected);
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
	selectElement 		object of element list to populate
	items 				array of options added to selectElement
	defaultSelection	(optional) value of selected item
	size				(optional) max list size -- set list size to number of items up to size
---------------------------------------------------------------------------------------------*/
EZ.displayDropdown = function EZdisplayDropdown(selectElement, items, defaultSelection, options)
{
	if (options && typeof(options) != 'object')
		options = {size:options};
	else
		options = options || {};
	if (options.sort && !EZ.isArray(items))
	{
		items.sort();
	}
	var size = options.size;
	
	selectElement = EZ.getEl(selectElement);
	if (selectElement == null) return;

	items = items || [];
	var fast = size ? '' : 'fastclear,fastselect';
	EZ.clearList(selectElement, fast);
	if (items.length > 0)
	{
		for (var i=0; i<items.length; i++)
		{
			var text = items[i];
			var value = text;
			if (EZ.is(text, HTMLOptionElement))
			{
				value = text.value;
				text = text.text;
			}
			if (EZ.isArray(text))
			{
				text = text[0];
				value = value[1];
			}
			var selected = (value == defaultSelection);
			EZ.selectOptionAdd(selectElement, text, value, selected,'fastselect');
		}
	}
	if (fast) 
		EZ.selectSave(selectElement);
	if (size)
		selectElement.size = Math.max(2,Math.min(size, selectElement.options.length));
}
/*---------------------------------------------------------------------------------------------
GET Field value (exists in Dreamweaver...\RevizeCommon.js and \util\snippet_helper.js)
  || field.type == 'Text'		// for DW
---------------------------------------------------------------------------------------------*/
EZ.getFieldValue = function EZgetFieldValue(field,options)
{
	var i;
	var value = ''
	if (typeof field == 'string') field = document.forms[0][field];
	if (typeof options == 'undefined') options = '';

	if (typeof field == 'undefined' || typeof field != "object")
	{
		EZ.log('EZgetFieldValue field invalid',field);
		return value;
	}

	if (field.type == 'text'
	|| field.type == 'textarea'
	|| field.type == 'password'
	|| field.type == 'hidden')
		value = field.value

	else if (field.type == 'checkbox')
	{
		if (options.indexOf('text') == -1)
			value = field.checked
		else
		{
			if (field.checked)
				value = field.value
			else
				value = ""
		}
	}

	else if (field.type == 'select-'				// select-one or select-multiple
	|| typeof field.selectedIndex != 'undefined' ) 	// undefined is DW hack
	{
		if (field.selectedIndex < 0)
		{
			if (typeof field.unchecked == 'undefined')
				value = '|'
			else
				value = field.unchecked
		}
		else
		{
			for (i=0; i<field.options.length; i++)
			{
				if (field.options[i].selected)
				{
					if (options.indexOf('text') >= 0 || field.text)
						value += '|' + field.options[i].text
					else
						value += '|' + field.options[i].value
				}
			}
		}
		if (value.substring(0,1) == '|') value = value.substring(1)
	}

	//********** array of radio buttons **********\\
	else if (field.length > 0 && field[0].checked != 'undefined')
	{
		for (i=0; i<field.length; i++)
		{
			if (field[i].checked)
			{
				value = field[i].value
				break;
			}
		}
	}

	//********** single dim radio button field EZ.savePrefs() **********
	else if (field.type == 'radio')
	{
		// check all fields with same name
		var fields = document.getElementsByTagName('input');
		for (i=0;i<fields.length;i++)
			if (fields[i].name == field.name && field.checked)
				value = fields[i].value;
	}
  	else
		return EZ.warn( 'EZgetFieldValue does not support type: ' + field.type
			  		 + '(name: ' + field.name + ')' )
	return value;
}
/*---------------------------------------------------------------------------------------------
SET Field value (exists in Dreamweaver...\RevizeCommon.js and \util\snippet_helper.js)
---------------------------------------------------------------------------------------------*/
EZ.setFieldValue = function EZsetFieldValue(field, value, options )
{
	var i;
	if (typeof field == 'string') field = document.forms[0][field];
	if (!options) options = '';

	if (typeof field == 'undefined' || typeof field != "object")
		return EZ.warn('field argument not an object: ' + field);

	//----- Setup for radio buttons
	var radioChecked = true;	//supresses message if not radio button

	// determine true / false interpretation of value
	var radioBoolean = false;
	if(value+''.toLowerCase() == 'on'
	|| value+''.toLowerCase() == 'yes'
	|| value+''.toLowerCase() == 'true')
		radioBoolean = true;

	//********** text fields **********\\
	if (field.type == 'text'
	|| field.type == 'Text'		// for DW
	|| field.type == 'textarea'
	|| field.type == 'password'
	|| field.type == 'hidden')
	{
		var disabled = null
		if (typeof value == 'undefined') value = '';
		if (typeof field.disabled != 'undefined')
		{
		  disabled = field.disabled
		  field.disabled = false
		  field.disabled = ''
		  field.value = value
		  field.disabled = disabled
		}
		else
		  field.value = value
	}

	//********** checkbox **********\\
	else if (field.type == 'checkbox')
	{
		if (value == null)
			value = false;

		if (value === false)			//avoids invalid use of toLowerCase()
			field.checked = false

		else if (value == true
		|| value == field.value
		|| value.toLowerCase() == 'on'
		|| value.toLowerCase() == 'yes'
		|| value.toLowerCase() == 'true' )
			field.checked = true
		else if (value)
			field.checked = false
	}

	//********** dropdown menu or list **********\\
	else if (field.type == 'select-one'
	|| typeof field.selectedIndex != 'undefined' )	//test undefined is DW hack
	{
		for (i=0; i<field.options.length; i++)
		{
			if (field.options[i].value == value)
			{
				if (EZ.checkOptions(options,'trace'))
					dw.log('EZsetFieldValue',field.name+' value '+value+'('+i+') selected');
				field.options[i].selected = true
				if (window.EZselectScroll) EZ.selectScroll(field,i)
				break;
			}
		}
	}

	//********** array of radio button fields **********
	//(has checked property and not caught as checkbox above)
	else if (field.length > 0 && field[0].checked != 'undefined')
	{
		radioChecked = false;
		for (i=0; i<field.length; i++)
		{
			if (field[i].value == value+'')
			{
				field[i].checked = true;
				radioChecked = true;
				break;
			}

			// if non false value, uncheck default selection if there is value
			else if (field[i].checked && !radioBoolean && value)
				field[i].checked = false;
		}
	}

	//********** single dim radio button field EZ.setup() **********
	else if (field.type == 'radio')
	{
		radioChecked = false;

		// find all other fields with same name
		var fieldGroup = [];
		var fields = document.getElementsByTagName('input');
		for (i=0;i<fields.length;i++)
			if (fields[i].name == field.name)
				fieldGroup.push(fields[i]);

		for (i=0; i<fieldGroup.length; i++)
		{
			// if passed value matches button value, select it
			if (fieldGroup[i].value == value+'')
				fieldGroup[i].checked = true;

			// if non false value, uncheck default selection if there is value
			else if (fieldGroup[i].checked && !radioBoolean && value)
				fieldGroup[i].checked = false;

			if (fieldGroup[i].checked)
				radioChecked = true;
		}
	}

	//********** unsupported type **********\\
	else
		return EZ.warn( 'EZsetFieldValue does not support type: ' + field.type
			 		 + ' (field: ' + field.name + ')' )

	//----- if no radio button checked and non false value supplied, report error
	if (!radioChecked && value != '' && radioBoolean)
		return EZ.warn('Radio button field ('+field[0].name+') no button for value: ' + value);

	return {'function': 'EZ.setFieldValue()', fieldName: field.name, fieldValue: value};
}
/*-----------------------------------------------------------------------------
-----------------------------------------------------------------------------*/
if (EZ && EZ.global && EZ.global.setup) EZ.global.setup('EZ', 'EZcommon_min');
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
		EZ.checkOptions('filter,editsingle,alt','alt,url,image') returns true	???
		EZ.checkOptions('pam,tom,sandy,larry','pam') returns true
---------------------------------------------------------------------------------------------*/
EZ.checkOptions = function EZcheckOptions(pOptions, pChoices)
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
Run script via eval() -- cloned from EZeval()

Arguments:
	el 			(optional) form field containing script
	options 	(optional) 

TODO:
// move off eval input field to update value of codeEvalScript field
//evalBtn.focus();
---------------------------------------------------------------------------------------------*/
EZ.runScript = function EZrunScript(el, options)
{	
	var rtnValue = true;

	   //----------------------------------------------------\\
	  // init options when not initialized, options specified \\
	 //  -or- el is Array (selectors)                          \\
	//----------------------------------------------------------\\
	var isSelector = (typeof(el) == 'string' && /^[.#]/.test(el)) || EZ.isArray(el);
	var isSetup = isSelector || arguments.length === 0 || options;
	if (isSetup || !EZ.runScript.options)
	{
		var selector = (isSelector || options) ? el : '.runScript';
		runScriptInitOptions(selector, options);
		if (!el || selector == el)
			return;
	}
	if (!el) return;

	  //----------------------------------------------------\\
	 //----- process event when called as event handler -----\\
	//--------------------------------------------------------\\
	var type = '';
	if (EZ.isEvent(el))
	{
		var evt = el;
		el = evt.srcElement;
		type = evt.type;
		if (evt.type ==	'keydown')
		{
			if (evt.keyCode != 13 || EZ.runScript.options.enterkey != 'true') 		
				return true;					//bail when enter key NOT autorun
			
			EZ.event.cancel(evt, true);
			return run(el);
		}
	}
	var action = runScriptAction(el) 					//backward compatibility below
		      || ('string object'.includes(typeof(el)) ? 'runscript' : '');
	switch(action)
	{
		case 'history':
		{
			if (type && type != 'change') return true;
			EZ.set(EZ.runScript.options.script, EZ.get(el));
			el.selectedIndex = 0;
			rtnValue = false;
			break;
		}
		case 'clearhistory':
		{
			if (type && type != 'click') return true;
			EZ.clearList(EZ.runScript.options.history, 'fastclear')
			break;
		}
		case 'clearresults':
		{
			if (type && type != 'click') return true;
			EZ.set(EZ.runScript.options.results, '');
			break;
		}
		case 'clearscript':
		{
			if (type && type != 'click') return true;
			EZ.set(EZ.runScript.options.script, '');
			break;
		}
		case 'runscript':
		{
			if (type && type != 'click') return true;
			if (!EZ.runScript.options.script)
				EZ.runScript.options.script = el;
			rtnValue = run(EZ.runScript.options.script);
			return rtnValue;
		}
		default:
		{
			var key = action;
			if (key in EZ.runScript.fieldValues)
				runScriptUpdateOptions(el, key);			
			return true;						//return true to keep current focus
		}
	}
	setTimeout.call(window, function()
	{											//give focus to script field
		if (EZ.isEl(EZ.runScript.options.script))
			EZ.runScript.options.script.select();
	}, 100);
	return rtnValue;

			
	  //------------------------------------------------------\\
	 //----- run script when el is script field or string -----\\
	//----------------------------------------------------------\\
	function run(el)
	{
		var script = EZ.get(el);
		script = script.trim().trimPlus(';');
		runScriptUpdateOptions(el, 'script');			
		while (script)
		{
			var isException = false;
			try
			{	
				var format = EZ.runScript.options.format;
				format = /(toString|stringify)/i.test(format) ? format : 'none';
				var spaces = EZ.getOptionValue(EZ.runScript.options.stringify, 'spaces', 4);
				
				//--------------------------------------------------------------------
				var value = eval('value=' + script /* script */);
				
				value = format.includesIgnoreCase('toString') 			//EZ.toString
					  ? EZ.toString(value, EZ.runScript.options.tostring)
	
					  : !format.includesIgnoreCase('stringify') 		//no formatting
					  ? value.toString().trim().replace(/\t/g, '    ')
	
					  : format.includesIgnoreCase('EZ') 				//EZ|JSON.stringify
					  ? EZ.stringify(value, EZ.runScript.options.stringify)
					  : JSON.stringify(value, null, spaces);		
				//----------------------------------------------------------------------
				
				var maxlines = runScriptOptionValue('resultsmaxlines', 0);
				if (EZ.runScript.options.results && maxlines && value.count('\n') > maxlines)
				{
					runSciptTrace( {script:script, format:format, results:value} );
					value = value.split('\n');
					value.length = maxlines;
					value.push(EZ.MORE + ' EZ trace log contains full results');
					value.join('\n');
				}
			}
			catch (e)
			{
				isException = true;
				value = e.name + ': ' + e.message;
			}

			if (!EZ.runScript.options.results 
			|| runScriptOptionValue('trace', false))
			{
				runSciptTrace( {script:script, format:format, results:value}, true);
				value = 'runScript results (also in trace log):\n' + value;
			}
			else
			{
				value = EZformatTime() + ' eval() results'
					  + ' (format: ' + format + '):\n' + value
				
				if (runScriptOptionValue('append', false))
					value += ('\n' + EZ.get(EZ.runScript.options.results)).trim();

				EZ.set(EZ.runScript.options.results, value);
			}

			/* did not work before but was "theForm..." NOT "document.theForm..."
			// onFocus="setTimeout('document.theForm.codeEvalScript.select()"
			// just put trash before script field and remove onFocus() handler
			// restore onFocus() to eval script field in 1/2 sec, field gets focus now
			setTimeout(function() {theForm.codeEvalScript.onfocus="this.onfocus='';"
									+ "setTimeout('theForm.codeEvalScript.select()',10)"}, 500);
			*/
			//-------------------- done -------------------\\
			//if (scriptEl && scriptEl.id) setTimeout(scriptEl.id + '.focus()',10)
			//---------------------------------------------//
			if (!isException || runScriptOptionValue('saveall', false))
				runScriptUpdateHistory(script);
			break;
		}
		return value;
	}
	//______________________________________________________________________________
	/**
	 *	
	 */
	function runSciptTrace(msg, forceOn)
	{
		EZ.trace('EZ.runScript', msg, {mode:forceOn});
	}
	//______________________________________________________________________________
	/**
	 *	
	 */
	function runScriptInitOptions(selectors, options)
	{
		EZ.runScript.defaultOptions = {		//TODO: EZ.defaultOptions.runScript
			append: false,
			trace: false,
			format: 'EZtoString',
			tostring: 'timestamp=false',	//EZ.toString options
			stringify: 'spaces=4',			//stringify options
			resultsmaxlines: '',
			historymaxsize: 30,
			saveall: false,					//true to save invalid script
			enterkey: true
		};
											//keep only valid saved options
		var savedOptions = EZ.getLS('runScript.options', {});
		EZ.runScript.options = EZ.mergeReplaceOnly(EZ.runScript.defaultOptions, savedOptions);
		
		var defaultOptions = {
			script: "['scriptSource', 'codeEvalScript']",
			history: "['scriptHistory', 'codeEvalHistory']",
			results: "['scriptResults', 'evalResults']"
		}
		options = EZ.mergeAll(defaultOptions,options);

		var savedFieldValues = EZ.getLS('runScript.fieldValues', {});
		EZ.runScript.fieldValues = {};		//rebuild with current fields
		
		//EZ.trace('EZ.runScript get saved options', savedOptions);
		//EZ.trace('EZ.runScript get saved fieldValues', savedFieldValues);

		  //----------------------------------------------------------\\
		 // for each scriptOption, put each item or key/value in Array \\
		//--------------------------------------------------------------\\
		for (var key in options)
		{
			EZ.runScript.options[key] = '';				//clear default or prior saved
			
			var items = options[key].replace(/(\[[^\]]*)/g, function(all,one)
			{
				return one.replace(/ /g,'');
			});
			items = EZ.toArray(items, ' ')				//convert to array of items after removing...
														//...spaces inside [...]
			options[key] = [];
			items.slice().forEach(function(item,idx)	//for each option item or key/value
			{
				if (item.substr(0,1) == '[')			//element selector if item is "[...]"
				{								
					var tags = eval(item);
					tags = runScriptProcessTags(tags, key);
					if (tags) 							//lookup fields added as embedded array in items array
						options[key] = options[key].concat(tags);
				}
				else options[key].push(item);
			});
		}
		   //------------------------------------------------------------------\\
		  // find tags matching selectors specified as EZ.runScript() argument  \\
		 // with title attribute containing valid runScript action or option key \\
		//------------------------------------------------------------------------\\
		runScriptProcessTags(selectors);
		
		  //------------------------------------------------------------\\
		 // collaspe option items for any option not using lookup fields \\
		//----------------------------------------------------------------\\
		EZ.runScript.lookupOptions = {};				//for all options with lookup fields specified
		for (key in options)
		{												
			if (typeof(EZ.runScript.options[key]) == 'object')
				continue;								//assume element -- skip
			var items = options[key];
														//define lookup when items contains embedded array
			if (JSON.stringify(items).substr(1).includes('['))
				EZ.runScript.lookupOptions[key] = items;
			
			else if (items.length)						//if no lookup fields, save any other static items
				EZ.runScript.options[key] = items.join(' ');
			
			else										//if no other items, restore default (undefined if script)
				EZ.runScript.options[key] = EZ.runScript.defaultOptions[key];
		}
		
		runScriptUpdateOptions();							//set EZ.runScript.options from current lookup field values
		runScriptUpdateHistory();
		
		//EZ.trace('EZ.runScript initialized options', EZ.runScript.options);		
		//=================
		return true;
		//=================
		/**
		 *	
		 */
		function runScriptProcessTags(selectors, optionKey)
		{
			var tags = [];
			EZ.toArray(EZ(selectors, true)).forEach(function(el)
			{
				if (el.undefined) return;
				
				//var option = optionKey;
				///var results = (el.className+'').match(/(^|\s)option=([.\w]+)\b/);
				var title = el.title;
				var action = runScriptAction(el);
				if (!action)
				{
					if (!optionKey) return;
					action = optionKey;
					//el.title = option;
				}
				switch (action)
				{
					case 'history':
					case 'results':
						EZ.runScript.options[action] = el;	//reference not lookup
					
					case 'clearhistory':
					case 'clearscript':
					case 'runscript':
						EZ.event.add(el, 'formfield', EZ.runScript);
						break;
					
					case 'script':
					{	
						EZ.event.add(el, 'onKeyDown', EZ.runScript);
						EZ.runScript.options.script = el;	//reference not lookup
						runScriptSavedOption(el,'script');
						break;
					}					
					default:
					{
						var fullKey = action;
						var keys = fullKey.split('.');
						var key = keys.shift();
						var subKey = keys.shift();
						if (!(key in EZ.runScript.options))
						{
							 if (title)
							 	el.title;
							 return;
						}
						options[key] = options[key] || [];
						options[key].push( [el] );					//add as option lookup item
						
						EZ.event.add(el, 'formfield', EZ.runScript);					
						//el.scriptOption = 'option';
						//el.scriptOptionKey = fullKey;
						
						runScriptSavedOption(el,fullKey);
						tags.push(el);
					}
				}
			});
			//=================
			return tags
			//=================
			/**
			 *	set field to saved value if found -- add to EZ.runScript.fieldValues
			 */
			function runScriptSavedOption(el, key)
			{
				var value = savedFieldValues[key]
				if (value == EZ.undefined)
					value = EZ.get(el);			//if no saved value get current
				else
					EZ.set(el, value);
				
				EZ.runScript.fieldValues[key] = value
			}
		}
	}
	//______________________________________________________________________________
	/**
	 *	
	 */
	function runScriptUpdateHistory(script)
	{
		EZ.runScript.history = EZ.runScript.history || EZ.getLS('runScript.history', []);
		EZ.runScript.history = EZ.runScript.history.remove();	//safety for unexpected
		
		if (script)
		{												//remove prior dup script if any
			EZ.runScript.history = EZ.runScript.history.remove([script]);		
			EZ.runScript.history.unshift(script)		//add script to top of history

			var maxitems = EZ.toInt(Math.max(EZ.runScript.options.historymaxsize), 50)
			EZ.runScript.history.length = Math.min(maxitems, EZ.runScript.history.length);
			EZ.setLS('runScript.history', EZ.runScript.history);
		}
		
		if (EZ.runScript.options.history 				//update history dropdown if defined
		&& EZ.runScript.options.history.tagName == 'SELECT')
		{												
			var items = [];
			EZ.runScript.history.forEach(function(item)
			{
				var text = item.replace(/(.*)([\s\S]*)/, function(all, one, two)
				{
					var count = two.count('\n');
					if (count)
						one += '... (' + two.count('\n') + ' more lines)';
					return one; 
				});
				items.push([text,item]);
			});
			var count = EZ.runScript.history.length;
			var msg = count == 0 ? '-- no prior scripts --'
					: ('-- ' + count + EZ.s(' prior script', count) + ' --')
			items.unshift([msg, ''])
			EZdisplayDropdown(EZ.runScript.options.history, items);
		}
	}
	//______________________________________________________________________________
	/**
	 *	
	 */
	function runScriptAction(el)
	{
		var action = el.title || '';
		return action.trim().toLowerCase().replace(/ /g, '');
	}
	//______________________________________________________________________________
	/**
	 *	
	 */
	function runScriptOptionValue(key, defaultValue)
	{
		value = EZ.runScript.options[key];
		if (typeof defaultValue == 'boolean')
		{
			var el = EZ.runScript.fieldValues[key];
			if (el && 'checked' in el)
				defaultValue = !EZ.isTrueLike(el.value)
		}
		value = EZ.getDefaultValue(value, defaultValue); 
		return value;	
	}
	//______________________________________________________________________________
	/**
	 *	
	 */
	function runScriptUpdateOptions(el, key)
	{
		var msg = '';
		if (el)
		{
			var value = EZ.get(el);
			if (EZ.runScript.fieldValues[key] == value)
				return;
			else
			{
				msg = ' (' + key + ' changed)';
				EZ.runScript.fieldValues[key] = value;
				EZ.setLS('runScript.fieldValues', EZ.runScript.fieldValues);
			}
			if (typeof(EZ.runScript.options[key]) == 'object')
				return;		//i.e.	EZ.runScript.options not updated when key=script 
		}

		  //--------------------------------------------------------\\
		 //----- update EZ.runScript.options from lookupOptions -----\\
		//------------------------------------------------------------\\
		var isOptionsChanged = false;
		for (var key in EZ.runScript.lookupOptions)
		{
			var value = '';
			var items = EZ.runScript.lookupOptions[key];
			for (var i=0; i<items.length; i++)	//for each item of options[key]
			{
				var item = items[i];
				if (!EZ.isArray(item))			//if item not Array of lookup fields...
					value += ' ' + item;			//...append value

				else							//if Array, lookup field values
				{
					for (var j=0; j<item.length; j++)
					{										
						var tag = item[j];
						var subKey = runScriptAction(tag).split('.')[1];
						value += ' ' 			//if field has subkey, append subkey=value 
							   + (subKey ? subKey + '=' : '') 	//e.g. stringify.spaces
							   + EZ.get(tag);	//otherwise just append value
					}
				}
			}
			value = value.trim();
			if (value != EZ.runScript.options[key])
				isOptionsChanged = true;
			EZ.runScript.options[key] = value;
		}
		if (isOptionsChanged)
		{
			EZ.setLS('runScript.options', EZ.runScript.options);
			EZ.trace('updated EZ.runScript.options'+ msg, EZ.runScript.options);
		}
		return true;
	}
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/

