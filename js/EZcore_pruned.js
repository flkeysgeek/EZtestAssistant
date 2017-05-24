/***************************************************************************************************
moved to separate files: 
	EZ.getset.js:	EZ.getEl (and related), EZgetValues, EZgetValue, EZsetValue
***************************************************************************************************/

/*global 
EZgetTagType,
EZgetEl, EZgetFieldValue,
EZ:true, dw:true, e:true  */
/*global EZnone, EZtoArray, EZis, EZisEl, EZgetPref, EZsetPref, EZsetValue  */

var e;
(function jshint_globals_not_used() {	//global variables and functions defined but not used
e = [e]
});
//____________________________________________________________________________________________________

if (typeof(dw) == 'undefined') dw = {isNotDW: true};
if (typeof(EZ) == 'undefined') EZ = {};
/*11-12-2016: what a nightmare -- adds EZ to native Object constructor
if (!EZ.dw) EZ.dw = dw;
{									//global data shared by all DW api commands
	EZ.dw = window.dw ? dw.constructor.EZ : {};
	if (!EZ.dw) EZ.dw = dw.constructor.EZ = {};
}
*/
EZ.legacy = EZ.legacy || {};
/*
EZ.legacy = EZ.merge(EZ.legacy, 
{
	//EZisEmpty: false,
	//EZgetEl:true, 
	//EZgetEl_notFound:null, 
	//EZgetStyle:false, 
	//EZhasClass:false,
	'':''
});
*/
/*---------------------------------------------------------------------------------------------
Return number occurances of chars (default char is dash)
---------------------------------------------------------------------------------------------*/
String.prototype.dup = function(number)
{
	return EZdup(number,this);
}
function EZdup(number,char)
{
	var value = ''
	if (!char) char = '-';
	for (var i=0;i<number;i++)
		value += char;
	return value;
}
/*---------------------------------------------------------------------------------------------
return true or false: check all true/false varients (0 or '0' retrun false
---------------------------------------------------------------------------------------------*/
function EZgetBoolean(el)
{
	var el = EZgetEl(el);
	if (el == null) return false;
	return EZgetFieldValue(el) === true;
}
/*---------------------------------------------------------------------------------------------
return checked value of checkbox/radio -- undefined if invalid element
if no checked property, return element value true/false interpretation
---------------------------------------------------------------------------------------------*/
EZisChecked = function EZisChecked(el)
{
	el = EZ.getEl(el);
	if (el == null) return;		//return undefined (false)

	if (el.checked != EZ.undefined) return el.checked;

	return EZisTrue( EZgetValue(el) );
}
EZgetChecked = EZisChecked;
/*---------------------------------------------------------------------------------------------
Set checked value of checkbox/radio -- returns input value as convenience
if no checked property for element, sets element value true or false.
---------------------------------------------------------------------------------------------*/
function EZsetChecked(el, value)
{
	var els = EZ.getEl(el);
	if (els == null) return false;

	if (els.length > 1)
		return EZsetValue(el, value)

	value = EZisTrue(value);
	if (el.checked != EZ.undefined)
		el.checked = value;
	else
		value = EZsetValue(el, value);

	return value;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function EZtoggleChecked(el)
{
	return EZsetChecked(el, !EZgetValue(el));
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function EZgetInt(el, defaultValue)
{
	return EZtoInt( EZgetValue(el), defaultValue);
}
/*---------------------------------------------------------------------------------------------
return true if trueLike; false if falseLike otherwise value
zero is NOT falseLike
---------------------------------------------------------------------------------------------*/
function EZtrueFalseValue(value)
{
	if (EZisTrueLike(value)) return true;
	if (EZisFalseLike(value)) return false;
	return value;
}
/*---------------------------------------------------------------------------------------------
EZ.isTrue(value,options) --

Always returns true of false unless zerovalue:'value'
TODO: when should zero be interpreted as false -- why not just use: if (value)...
	  -or- EZtrueFalseValue()

For value: true, 'true', 'on', 'yes', typeof(object or function) -- return true
For value: false, 'false', 'off', 'no' or EZ.isNone(value) -- return false
otherwise return value
---------------------------------------------------------------------------------------------*/
function EZisTrue(value, options)
{
	//11-03-2015: causes infinite loop
	//if (EZ.isTrue) return EZisTrue(value, options);
	
	options = options || {zerovalue:false}

	if (EZisTrueLike(value)) return true;
	if (EZisFalseLike(value)) return false;

	switch(options.zerovalue + '')
	{
		case 'false' : return false;
		case 'true'  : return true;
		case 'value' :
		default      : return value;
	}
}
/*---------------------------------------------------------------------------------------------
EZ.isNone(value)

Does not use EZ.getOptions() -- can be used during options setup
---------------------------------------------------------------------------------------------*/
function EZisNone(value)
{
	if (typeof(value) == 'unknown' || value === undefined || value === null)
		return true;

	switch(typeof value)
	{
		case 'string'	: return value === '';
		case 'number'	: return isNaN(value);
		case 'boolean':
		case 'function': return false;
		case 'object':
		{
			if (EZisArrayLike(value)) 	return (value.length === 0);
			if (value.undefined)		return true;

			//e.g. IE events
			if (value.constructor != Object || !value.hasOwnProperty) return false;

			for (var p in value) 	//if any object property/element found, not none
				if (value.hasOwnProperty(p)) return false;
			return true;			//empty object considered none
		}
	}
	return true;	//unexpected scenario -- everything should be covered above
}
/*---------------------------------------------------------------------------------------------
Return text with 's' appended if count > 0
---------------------------------------------------------------------------------------------*/
function EZs(text,count,suffix)
{
	if (!suffix) suffix = 's'
	if (count != 1) text += suffix;
	return text;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function EZsentenceCase(msg)
{
	return msg.replace(/(^|\s)(\w)/g,function(all,p1,p2)
	{
		return p1 + p2.toUpperCase();
	})
}
/*---------------------------------------------------------------------------------------------
http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
---------------------------------------------------------------------------------------------*/
function EZgetRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/*---------------------------------------------------------------------------------------------
Return parent tagName of el
---------------------------------------------------------------------------------------------*/
function EZgetParent(el,tagName)
{
	tagName = tagName || '';
	var name = el.name || el.id || el.outerHTML;	//name for error msg

	tagName = tagName.toUpperCase();
	var count = 0;
	while (count++ < 17)
	{
		//if (!el.parentNode)
		//	return EZwarn(name + ' does not have ' + tagName + ' parent');
		el = el.parentNode;
		if (el == null) break;
		if (!tagName) return el;
		if (!el.tagName) continue;
		if (el.tagName.toUpperCase() == tagName) return el;
	}
	//dw.setFloaterVisibility('RevizeTrace',true);
	var msg = tagName + className + ' parent not found in ' + count + ' generations of ';
	EZlog(msg,el.outerHTML);
	return EZwarn(msg + '\nCheck Trace');
}

/*---------------------------------------------------------------------------------------------
EZ.isArray(value)

IE10- does not support: EZ.isArray(...)
Provided for completeness and documentation reference.
---------------------------------------------------------------------------------------------*/
function EZisArray(o)
{
	return (o != null && typeof(o) == 'object' && o.constructor == Array);
}
/*---------------------------------------------------------------------------------------------
EZ.isArrayLike(o)

Array-like object if not null, object with length property containing number.
object has length property but not Array constructor e.g. arguments object

TODO: better test for fake length than testing o.childNodes
	  how about testing for [0] or using some sort of Array prototype
---------------------------------------------------------------------------------------------*/
function EZisArrayLike(o, makeSure)
{
	while (o != null && typeof(o) == 'object')
	{
		if (o.constructor == Array) return true;
		if (o.length == EZ.undefined || isNaN(o.length)) break;
		if (Math.floor(o.length) != o.length) return false;
		if (o.nodeType || o.childNodes || o.documentElement) break;
		/*
		//--------------------------------------------------------------------
		// http://stackoverflow.com/questions/24048547/checking-if-an-object-is-array-like
		//--------------------------------------------------------------------
		if (makeSure)			//more complete check (optional)
		{
			for (var i=0; i<len; ++i)			
				if (!(i in o)) return false;	//something wrong
		}
		*/
		return true;
	}
	return false;
	//--------------------------------------------------------------------
	// legacy code
	//--------------------------------------------------------------------
	if (EZ.legacy.EZisArrayLike)
	{
	}
}
/*---------------------------------------------------------------------------------------------
return array of elements containing className in tagName under node

className	name of class to search -- blank for any class
tagName		name of tags to search -- omitted or * for all tags
node		html node to search -- omitted or blank for document
---------------------------------------------------------------------------------------------*/
function EZgetElementsByClassName(className, tagName, node)
{
	var i,j;
	var classElements = [];

	className = className || '';
	tagName = tagName || '*';
	node = node || document;

	if (typeof(node) != 'object')
		node = document.getElementById(node+'');
	if (!node) node = document;

	var els = node.getElementsByTagName(tagName);
	var pattern = new RegExp("\\b"+className+"\\b");

	for (i = 0, j = 0; i < els.length; i++)
	{
		if ( pattern.test(els[i].className) )
		{
 			classElements[j] = els[i];
			 j++;
		}
	}
	return classElements;
}

/*______________________________________________________________________________________________

Alternative basic get element and get/set element/form field values

Originally taken from adv.importExportUtils.js which was cloned from EASY.js version 01-28-2015
Additional functions cloned from EASY.js as needed.

Includes enhancements and corrections.

Used by all EZ Dreamweaver extensions and dw.simulator ajax pages to test as standalone pages.
______________________________________________________________________________________________*/

/*---------------------------------------------------------------------------------------------
get all elements with tag name (and className if specified)
---------------------------------------------------------------------------------------------*/
function EZgetTags(tagName,className,doc)
{
	tagName = tagName || '*';
	if (typeof(className) == 'object')
		doc = [].pop.call(arguments);
	doc = doc || window.doc || document;	//if global doc defined

	var tags = doc.getElementsByTagName(tagName)
	if (typeof(className) == 'string')
	{										//if className supplied...
		var regEx = new RegExp( '\\s' + className + '(\\s|$)' );
		for (var i=0; i<tags.length; i++)
		{									//...and tag does not have className...
			while ( !regEx.test(' '+tags[i].className) )
				Array.prototype.splice.call(tags,i,1);	//...remove tag
		}
	}
	if (!tags.length)
		doc.getElementsByTagName('body');	//body tag default if nothing found
	return tags;
}
/*--------------------------------------------------------------------------------------------------
EZ.getCurrentStyle(el, style)

Get specified element(s) current style(s)

ARGUMENTS:
	arg			(*) blah blah
	...			blah blah

RETURNS:
	specified style value

TODO: blend EZgetStyle() & EZgetCurrentStyle() 
--------------------------------------------------------------------------------------------------*/
function EZgetCurrentStyle(el, style)
{
	if (!style) return '';
	var css = style.replace(/([A-Z])/g, '-$1'.toLowerCase());	//e.g. fontSize --> font-size
	var key = style.replace(/(-.)/g, '$1'.toUpperCase());		//e.g. font-size --> fontSize

	var value = '';
	if (document.all && el.currentStyle)
	{
		value = el.currentStyle[key];
	}
	else if (document.defaultView)
	{
		value = document.defaultView.getComputedStyle(el,'').getPropertyValue(css);
	}
	if (css.indexOf('color') != -1)
	{
		if (/rgba(0, 0, 0, 0)/.test(value))
			value = '';		//transparent
	}
	return value;
}
/*---------------------------------------------------------------------------------------------
get current styleProp of el -or- if value specified, el matching traversing up dom tree
TODO: blend EZgetStyle() & EZgetCurrentStyle() 
---------------------------------------------------------------------------------------------*/
function EZgetStyle(el, styleProp, value)
{
	el = EZgetEl(el);
	if (!EZ.legacy.EZgetStyle)
	{
		if (value != EZ.undefined && !EZisArrayLike(value))
			value = [value];
		do
		{
			var val = [];
			var style = el && el.style;
			if (style)
			{
				if (document.defaultView && document.defaultView.getComputedStyle)
					val = document.defaultView.getComputedStyle(el, '');
				else if (el.currentStyle)
					val = el.currentStyle;
				else
					val = '';				//safety for unexpected
			}
			// return all or specified style if not searching for specific value(s)
			if (value == EZ.undefined)
				return !styleProp ? val : val[styleProp];

			// return el if specified property matches one of specified values
			if ([].indexOf.call(value,val[styleProp]) != -1)
				return el;
		}
		while (el = el.parentElement)	//move up dom tree

		return EZnone();				//specified value not found in dom tree
	}
	//--------------------------------------------------------------------
	// legacy code -- get element or element for id if el not element
	//	TODO: may not work on chrome -- window.getComputedStyle is function
	//		  not sure if working in dw environment
	//--------------------------------------------------------------------
	var value = '';
	var currentStyle = null;

	if (window.getComputedStyle)	//chrome & FF work (others TBD per Ray)
		currentStyle = window.getComputedStyle;

	else if (el.currentStyle)		//pre IE11
		currentStyle = el.currentStyle

	if (currentStyle && currentStyle[style])
		value = currentStyle[style];

	return value;
}
//EZgetCurrentStyle = EZgetStyle;
EZgetCurrentStyleValue = EZgetStyle;
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function EZtoggleClass(el,className)
{
	el = EZgetEl(el,true);
	if (el == null) return false;
	
	var rtn = true;
	el.forEach(function(el)
	{
		EZ.toArray(className, ',').forEach(function(className)
		{
			var names = el.className.replace(/\s+/g, ' ').trim().split(' ');
			var idx = names.indexOf(className);
			if (idx == -1)
				names.push(className);
			else
			{
				names.splice(idx,1);
				rtn = false;
			}
			el.className = names.join(' ');
		});
	});
	return rtn;
}
/*---------------------------------------------------------------------------------------------
add className
---------------------------------------------------------------------------------------------*/
function EZaddClass(el, className, trueFalse)
{
	//if (trueFalse === false) return EZremoveClass(el,className);
	if (arguments.length >=3 && !Boolean(trueFalse))
		return EZremoveClass(el,className);
	
	el = EZgetEl(el,true);
	if (el == null) return false;
	el.forEach(function(el)
	{
		EZ.toArray(className, ',').forEach(function(className)
		{
			var names = el.className.replace(/\s+/g, ' ').trim().split(' ');
			var idx = names.indexOf(className);
			if (idx == -1)
				names.push(className);
		
			el.className = names.join(' ');
		});
	});
}
/*---------------------------------------------------------------------------------------------
remove className
---------------------------------------------------------------------------------------------*/
function EZremoveClass(el, className, trueFalse)
{
	if (trueFalse === false) return EZaddClass(el,className);
	
	el = EZgetEl(el,true);
	if (el == null) return false;
	el.forEach(function(el)
	{
		EZ.toArray(className, ',').forEach(function(className)
		{
			var names = el.className.replace(/\s+/g, ' ').trim().split(' ');
			var idx = names.indexOf(className);
			if (idx != -1)
				names.splice(idx,1);
		
			el.className = names.join(' ');
		});
	});
}
/*---------------------------------------------------------------------------------------------
return true if el contains any of specified className(s)
true if className empty, false if el not found.
---------------------------------------------------------------------------------------------*/
function EZhasClass(el, className)
{
	if (!className) return true;

	el = EZgetEl(el);
	if (!EZis(el) || !el.className) return false;

	if (!EZ.legacy.EZhasClass)
	{
		var classNames = EZtoArray(className);
		return el.className.split(' ').some(function(elClass)
		{
			if (classNames.indexOf(elClass) != -1) return true;
		});
	}
	//--------------------------------------------------------------------
	// legacy code
	//--------------------------------------------------------------------
	className = className || '';
	var pattern = new RegExp("\\b" + className + "\\b");
	return pattern.test(el.className || '');
}
EZisClass = EZhasClass;	//alternate name
/*---------------------------------------------------------------------------------------------
show or hide element -- return false if el hidden; true is shown
---------------------------------------------------------------------------------------------*/
function EZhide(el, trueFalse, useVisibility)
{
	el = EZgetEl(el);
	if (el == null) return false;

	if (trueFalse == EZ.undefined) trueFalse = true;
	if (EZisFalseLike(trueFalse)) return EZshow(el);

	useVisibility = typeof(useVisibility) == 'boolean' ? useVisibility
				  : useVisibility == 'visibility';

	if (EZisShow(el))		//if currently showing . . .
	{						//hide via visibilty if specified or previously hidden
		if (!el.EZorigStyle) el.EZorigStyle = {}
		if (useVisibility || el.EZorigStyle.visibility == 'hidden')
			el.style.visibility = 'hidden';
		else
		{					//otherwise set display to none after saving current value
			el.EZorigStyle.display = EZgetStyle(el,'display')
			el.style.display = 'none';
		}
	}
	return false;	//convenience return value
}
/*---------------------------------------------------------------------------------------------
show or hide element -- use visibility=hidden to hide
---------------------------------------------------------------------------------------------*/
function EZvisible(el, trueFalse)
{
	return trueFalse === true || EZisTrue(trueFalse) ? EZshow(el) : EZhide(el, true, 'visibility');
}
/*---------------------------------------------------------------------------------------------
show or hide element -- return false if el hidden; true is shown
---------------------------------------------------------------------------------------------*/
function EZshow(el, trueFalse, useVisibility)
{
	var tags = EZgetEl(el,true);					//=true to get all elements
	if (tags == null) return false;
	[].forEach.call(tags, function(el)
	{
		if (trueFalse == EZ.undefined) trueFalse = true;
		if (EZisFalseLike(trueFalse)) return EZhide(el, true, useVisibility);

		if (!el.EZorigStyle) el.EZorigStyle = 		//save display and visibilty style values
		{
			display: EZgetStyle(el,'display'),
			visibility: EZgetStyle(el,'visibility')
		}
		while (!EZisShow(el))						//if not currently showing
		{											//1st try clearing el visibility style
			if (el.style.visibility == 'hidden') el.style.visibility = '';
			if (el.style.display == 'none')	el.style.display = '';
			if (EZisShow(el)) break;				//bail if that did the trick

			//next try visibility=visible if visibility prop originally defined now hidden
			var visibility = EZgetCurrentStyleValue(el,'visibility');
			if (visibility == 'hidden' || el.EZorigStyle.visibility)
				el.style.visibility = 'visible';
			if (EZisShow(el)) 						//if that did it, cool...
			{										//...save visibility for show if not yet saved
				if (!el.EZorigStyle.visibility) el.EZorigStyle.visibility = visibility;
				break;
			}
			//must use display property if still not showing...
			var display = EZgetCurrentStyleValue(el,'display');
			if (el.EZorigStyle.display)
			{										//...1st try original display style if definned
				el.style.display = el.display;
				if (EZisShow(el)) break;
			}
			if (display == 'none')
			{										//...next try inherit
				el.style.display = 'inherit';
				if (EZisShow(el)) 					//if that did it, cool...
				{									//...save display for show if not yet saved
					if (!el.EZorigStyle.display) el.EZorigStyle.display = display;
					break;
				}
			}
			//http://stackoverflow.com/questions/6867254/browsers-default-css-for-html-elements
			var tagDefault = 						//lastly use tag defaukt display style
			{
				li: 	  'list-item',
				table:    'table',
				thead:    'table-header-group',
				tbody:    'table-row-group',
				tr:       'table-row',
				td:		  'table-cell',
				th:       'table-cell',
				tfoot:    'table-footer-group',
				col:      'table-column',
				colgroup: 'table-column-group',
				caption:  'table-caption',
				input:	  'inline-block',
				select:   'inline-block'
			}
			tagName = el.tagName || '';
			display = tagDefault[tagName.toLowerCase()] || 'block';
			el.style.display = display;
			break;
		}
	})
	return true;	//convenience return value
}
/*---------------------------------------------------------------------------------------------
is element displayed based on offsetHeight
---------------------------------------------------------------------------------------------*/
function EZisShow(el)
{
	el = EZgetEl(el);
	if (el == null) return false;

	if (!dw.isNotDW)
		return el.offsetHeight > 0;

	if (EZgetCurrentStyleValue(el,'display') == 'none') return false;
	if (EZgetCurrentStyleValue(el,'visibility') == 'hidden') return false;
	return true;
}
/*---------------------------------------------------------------------------------------------
show or hide element or element with id
---------------------------------------------------------------------------------------------*/
function EZtoggleShow(el)
{
	return EZshow(el, !EZisShow(el))
}
EZtoggle = EZtoggleShow;	//legacy
/*---------------------------------------------------------------------------------------------
refresh floater by reloading extensions
---------------------------------------------------------------------------------------------*/
function EZrefreshFloater()
{
	dw.reloadExtensions();
}
/*---------------------------------------------------------------------------------------------
fit element width to value -- only select and input tags supported
cloned from EASY.js beta -- works for arial 12px; font normal
probably only works for dw.simulator
---------------------------------------------------------------------------------------------*/
function EZfitWidth(el,extra,base,wide,narrow)
{
	el = EZgetEl(el);
	if (el == null) return false;

	extra = extra || 0;
	base = base || 6.5;		//for testing
	wide = wide || 3;		//		''
	narrow = narrow || 3;	//		''

	var me = arguments.callee;

	var plus = 0;
	var value = el.value;
	if (el.tagName == 'SELECT')
	{								//add fitWidth() to onchange if not already
		addChangeCall('onchange');
		if (el.selectedIndex == -1) return false;
		value = el.options[el.selectedIndex].text;
		plus = 15;
	}
	else if (el.tagName == 'INPUT')
	{
		addChangeCall('onkeyup');
	}
	else
	{
		return false;	//not yet supported
	}
	var width = ((value.length + 1) * base) + extra + plus;

	// cludge for wide chars: uppercase char, m w & _
	width += ('_' + value).match(/[A-Z_mw]/g).length * wide;

	// cludge for narrow chars: some puncation
	width -= ('.' + value).match(/[.,;!'|filrtI]/g).length * narrow;
	width = parseInt(width+.5);
	el.style.width = Math.max(width,5) + 'px';
	//======================
	return true;
	//======================
	/**
	 *	make sure we EZgetEl called when value changes
	 */
	function addChangeCall(onName)
	{
		if (!EZfitWidth.calls)
			EZfitWidth.calls = {};
		if (EZfitWidth.calls[el]) return;		//already added
			EZfitWidth.calls[el] = true;

		// check onName el event handler or source of anounyous
		if (el[onName] == me || (el[onName] + '').indexOf('EZfitWidth(') != -1) return;

		// add event handler -- may already have one but now there are 2
		var callMe = function() {EZfitWidth(el,extra)};
		if (el.addEventListener) el.addEventListener(onName.substr(2), callMe, false);
		else if (el.attachEvent) el.attachEvent(onName, callMe);
	}
}
/*---------------------------------------------------------------------------------------------
DCO 04-20-2015: changes to EZgetDOM() and EZreleaseDOM()

All calls to dw.getDocumentDOM(...) have been converted to EZgetDOM(...)
and calls to dw.releaseDocument(...) are converted to EZreleaseDOM(...)


------------------------
NEW ARGUMENTS 04-20-2015
------------------------
	docType		(optional) when specified always calls dw.getNewDocumentDOM(type)
	content 	(optional) specifies outerHTML content for existing or new DOM.

As of 04-20-2015, the new arguments only used in EZcheckPostStatus()
---------------------------------------------------------------------------------------------*/
function EZgetDOM(url, docType, content)
{
	var dom = null;
	if (url == document) url = 'document';
	if (!url && !docType) url = 'document';

	// get existing DOM if docType not specified and url exists
	// if url does not exist then invalid dw.getDocumentDOM() argument
	if (url == 'document' || (!docType && DWfile.exists(url)))
	{
		// if url in Configuration folder, use: ../ unless simulator
		if (!dw.isNotDW)
			url = EZstripConfigPath(url).replace(/\.\.\.\/Configuration/, '..');
		dom = dw.getDocumentDOM(url);
	}
	else		//get new DOM if docType specified or url does not exist
	{
		if (!docType)
		{
			switch(EZgetFileInfo(url).extension.toLowerCase())
			{
				case 'js': doctype = 'JavaScript'; break;
				case 'xml': doctype = 'xml'; break;
				default: doctype = 'html';
			}
		}
		//------------------------------------------------
		dom = dw.getNewDocumentDOM(docType);
		//------------------------------------------------
		if (url) dom.URL = url;
		if (content)
		{
			dom.documentElement.outerHTML = content;
			if (url && !DWfile.exists(url))
			if (!DWfile.write(url, content))
			{
				var msg = EZstripConFigPath(url) + '\n' + url + '\n\n' + EZdisplayCaller();
				EZerror(msg, 'getDOM: write to url failed');
			}
		}
	}
	return dom;
}
/*---------------------------------------------------------------------------------------------
release DOM: remove dom from open doms list and calls dw.releaseDocument()

Per API doc -- dw.releaseDocument() is relevant only for documents that were referenced by a URL,
are not currently open in a frame or document window, and are not extension files. Extension
files are loaded into memory at startup and are not released until you quit Dreamweaver.

dw.getDocumentList() -- does not include related files
---------------------------------------------------------------------------------------------*/
function EZreleaseDOM(dom)
{
	if (dom != EZ.undefined)
		dw.releaseDocument(dom);
	dom = null;
	return null;
}
/*---------------------------------------------------------------------------------------------
//----- return dom source
---------------------------------------------------------------------------------------------*/
function EZgetSource(dom)
{
	if (!dom) dom = EZ.doc.dom;
	if (!dom || !dom.documentElement) return null;
	dom.synchronizeDocument();
	return dom.documentElement.outerHTML;
}

/*---------------------------------------------------------------------------------------------
get DOM, source, selected/highlighted text in codeview and offsets, release DOM
returns:
	EZ.doc.source
	EZ.doc.currentSelection
	EZ.doc.domSelection	 --  currentSelection expanded to full tag


return false if could get DOM for active window true if dom found  set
---------------------------------------------------------------------------------------------*/
function EZsetupDocDom()
{
	EZ.doc.sourceSelectionString = '';

	EZ.doc.dom = EZgetDOM("document");
	if (EZ.doc.dom == null) return false;

	EZ.doc.dom.synchronizeDocument();
	EZ.doc.source = EZ.doc.dom.documentElement.outerHTML;

	// get tag/jsp offsets if inside tag/jsp otherwise get the real selection or insertion point
	var theSel = EZ.doc.dom.source.getSelection();		//exact selection
	EZ.doc.sourceSelection = theSel;
	EZ.doc.sourceSelectionString = EZ.doc.source.substring(theSel[0],theSel[1]);

	var domSelection = EZ.doc.dom.getSelection(true);	//expands to full tag
	EZ.doc.domSelection = domSelection;
	if (domSelection[0] < theSel[0] || domSelection[1] > theSel[1])		//expanded
		theSel = domSelection;

	EZ.doc.currentSelection = theSel
	EZreleaseDOM(EZ.doc.dom)
	return true;
}
/*---------------------------------------------------------------------------------------------
get Global dw.constructor value shared accross commands
---------------------------------------------------------------------------------------------*/
function EZgetGlobal(key, defaultValue)
{
	if (!key)
	{
		EZwarn('invalid key: ' + key);
		return '';
	}
	//return EZgetConvertedValue(EZ.dw[key], defaultValue);
	return EZgetConvertedValue(dw[key], defaultValue);
}
/*---------------------------------------------------------------------------------------------
set Global dw.constructor value shared accross commands
---------------------------------------------------------------------------------------------*/
function EZsetGlobal(key, value)
{
	if (!key)
	{
		EZwarn('invalid key: ' + key);
		return '';
	}
	//return EZ.dw[key] = EZsetConvertedValue(value);
	return dw[key] = EZsetConvertedValue(value);
}
/*---------------------------------------------------------------------------------------------
validate preference key
---------------------------------------------------------------------------------------------*/
function EZvalidatePref(key)
{
	if (EZ.pref._keys.indexOf(key) == -1)
	{
		if (EZwarn('Undefined Preference: ' + key)) return false;
	}
	return true;
}
/*---------------------------------------------------------------------------------------------
get preference from registry for Dreamweaver EZ group
---------------------------------------------------------------------------------------------*/
function EZisPref(key,options)
{
	return EZgetPref(key,options);
}
/*---------------------------------------------------------------------------------------------
get preference from registry for Dreamweaver EZ group
---------------------------------------------------------------------------------------------*/
function EZgetPref(key,options)
{
	key = EZ.pref && EZ.pref[key] != EZ.undefined
		? EZ.pref[key] 
		: key
	
	var value = '';
	var defaultValue;
	if (options != 'novalidate')
	{
		defaultValue = options;
		options = '';
	}
	//if (EZ.pref._keys.indexOf(options) != -1)
	//	return EZwarn('Invalid Option: ' + options + ' call EZsetPref(...) NOT EZgetPref(...)');

	if (typeof(key) == 'object')	//dreamweaver preference
	{
		if (!EZvalidatePref(key.name)) return '';
		if (key.type == 'int')
			value = dw.getPreferenceInt(key.group,key.name);
		else
			value = dw.getPreferenceString(key.group,key.name);
	}
	else							//EZ preference
	{
		if (!EZcheckOptions(options,'novalidate') && !EZvalidatePref(key)) return null;
		if (!window.dw || !dw.getPreferenceString) return '';
		value = dw.getPreferenceString(EZ.prefGroup, key);

		if (value == '' && EZ.pref.defaultValues && EZ.pref._vars[EZ.pref._keys.indexOf(key)])
			//why not?? value = EZ.pref.defaultValues[key];
			value = EZ.pref.defaultValues[ EZ.pref._vars[EZ.pref._keys.indexOf(key)] ];

		if (typeof(value) == 'undefined')
			value = defaultValue || '';
	}
	//EZlog('','EZgetPref:' + key + '=' + value);


	// value is empty string if undefined and no default defined
	return EZgetConvertedValue(value, defaultValue);
}
/*---------------------------------------------------------------------------------------------
set preference in registry for Dreamweaver EZ group
---------------------------------------------------------------------------------------------*/
function EZsetPref(key, value, options)
{
	options = options || '';
	/*
	if (value === null)
		return EZwarn('EZ Set Preference: ' + key + ' is null');

	else if (value && value.name)
		return EZwarn('EZ Set Preference: ' + key + ' has value from: '
					 + value.name + ': ' + value.note)
	*/

	if (typeof(key) == 'object')	//dreamweaver preference
	{
		if (!EZvalidatePref(key.name)) return null;
		if (key.type == 'int')
		{
			value = value.toInt();
			dw.setPreferenceInt(key.group, key.name, value);
		}
		else
		{
			value += '';
			dw.setPreferenceString(key.group, key.name, value);
		}
	}
	else							//EZ Preference
	{
		if (!EZvalidatePref(key)) return null;

		value = EZsetConvertedValue(value);
		dw.setPreferenceString(EZ.prefGroup, key, value+'');
	}
	return value;
	//return {name: 'EZsetPref', note:'key='+key};
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function EZgetConvertedValue(value, defaultValue)
{
	if (value === null || value == EZ.undefined)
	{
		if (defaultValue != EZ.undefined) value = defaultValue;
	}
	else if (value == 'true')
		value = true;

	else if (value == 'false')
		value = false;

	else if (typeof(value) == 'string' && value.substr(0,1)+value.right(1) == '[]')
	{
		if (value == '[]')	//empty array
			value = [];
		else
			eval( 'value=' + value.split(',') );
	}
	return value;
}
/*---------------------------------------------------------------------------------------------
convert true, false and array
---------------------------------------------------------------------------------------------*/
function EZsetConvertedValue(value)
{
	if (value === null || value == EZ.undefined) return '';

	if (EZisArray(value))
	{
		if (value.length == 0)
			value = '[]';
		else
			value = "['" + value.join("','") + "']"
	}
	return value;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
if (EZ && EZ.global && EZ.global.setup) EZ.global.setup('EZ', 'EZcore');
