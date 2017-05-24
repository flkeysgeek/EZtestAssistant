/*______________________________________________________________________________________________

Alternative basic get/set element/form field values -- will probably be called by released EZ();
Still calls EZget/setFieldValues() for some radio, checkbox and select element scenarios.

Originally taken from adv.importExportUtils.js which was cloned from EASY.js version 01-28-2015
Additional functions cloned from EASY.js as needed.

Includes enhancements and corrections.

Used by all EZ Dreamweaver extensions and dw.simulator ajax pages to test as standalone pages.
______________________________________________________________________________________________*/
if (!EZ.legacy)
	EZ.legacy = {getEl:false, getElnull:true, getStyle:false, hasClass:false};
/*---------------------------------------------------------------------------------------------
return array of elements containing className in tagName under node

className	name of class to search -- blank for any class
tagName		name of tags to search -- omitted or * for all tags
node		html node to search -- omitted or blank for document
---------------------------------------------------------------------------------------------*/
EZ.getElementsByClassName = function EZgetElementsByClassName(className, tagName, node)
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
/*---------------------------------------------------------------------------------------------
get all elements with tag name (and className if specified)
---------------------------------------------------------------------------------------------*/
EZ.getTags = function EZgetTags(tagName,className,doc)
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
/*---------------------------------------------------------------------------------------------
Return parent tagName of el
---------------------------------------------------------------------------------------------*/
EZ.getParent = function EZgetParent(el,tagName)
{
	tagName = tagName || '';
	var name = el.name || el.id || el.outerHTML;	//name for error msg

	tagName = tagName.toUpperCase();
	var count = 0;
	while (count++ < 17)
	{
		//if (!el.parentNode)
		//	return EZ.warn(name + ' does not have ' + tagName + ' parent');
		el = el.parentNode;
		if (!el) break;
		if (!tagName) return el;
		if (!el.tagName) continue;
		if (el.tagName.toUpperCase() == tagName) return el;
	}
	//dw.setFloaterVisibility('RevizeTrace',true);
	var msg = tagName + className + ' parent not found in ' + count + ' generations of ';
	EZ.log(msg,el.outerHTML);
	return EZ.warn(msg + '\nCheck Trace');
}

/*---------------------------------------------------------------------------------------------
TODO: return all elements matching all selector.
	  may become EZ.()
---------------------------------------------------------------------------------------------*/
EZ.getAll = function EZgetAll(els, doc)
{
}
/*---------------------------------------------------------------------------------------------
return 1st element matching selector
---------------------------------------------------------------------------------------------*/
EZ.getEl = function EZgetEl(els, doc)
{
	doc = doc || document;
	var tags = EZ.getEls(els, doc);
	if (EZ.legacy.EZgetEl)
		return tags;

	if (EZ.legacy.EZgetEl_notFound && tags[0] != doc && !EZ.is(tags))
		return null;

	return tags[0];
}
/*---------------------------------------------------------------------------------------------
return selector if el otherwise 1st element(s) matching selector(s).
sel is element(s), form field, id, tagName, css selector or array of selectors.

TODO: may be called by EZ.getAll(...), with option to use all selectors.
	  consider recursive forEvery
---------------------------------------------------------------------------------------------*/
EZ.getEls = function EZgetEl(els, doc)
{
	doc = doc || document;						//if global doc defined??
	if (!EZ.legacy.EZgetEl)
	{
		if (!els) return EZ.none();
		if (!EZ.isArrayLike(els)) els = [els];
		if (els[0] == doc || EZ.is(els))
			return els;							//1st selector is element(s)

		var tags = [];
		[].some.call(els, function(sel)		//for future return all els
		{
			if (!sel) return;					//ignore empty selector
			if (EZ.is(sel))
			{									//selector is element(s)
				tags = EZ.isArrayLike(sel) ? sel : [sel];
				return true;
			}
			sel = sel + '';
			if (doc.forms.length && doc.forms[0][sel])
			{
				tags = doc.forms[0][sel];		//selector is form field
				tags = EZ.isArrayLike(tags) ? tags : [tags];
				return true;
			}

			tags = [doc.getElementById(sel)];
			if (EZ.is(tags)) return true;		//found element with id

			tags = doc.getElementsByTagName(sel);
			if (EZ.is(tags)) return true;		//found element(s) with tagName

			tags = doc.getElementsByClassName(sel)
			if (EZ.is(tags)) return true;		//found element(s) with css selector
		});
		return EZ.is(tags) ? tags : [EZ.none()]
	}
	//--------------------------------------------------------------------
	// legacy code
	//--------------------------------------------------------------------
	if (!els) return null;
	if (!EZ.isArray(els)) els = [els];
	for (var i=0; i<els.length; i++)
	{
		var el = els[i] || '';
		if (el == null) continue;

		if (typeof(el) != 'object' && doc.forms.length && doc.forms[0][el])
			el = doc.forms[0][el];			//el is form field

		if (typeof(el) != 'object') 		//if not object, try as id
			el = doc.getElementById(el + '');

		if (el == null)
		{
			var tags = document.getElementsByTagName(els[i]+'');
			if (tags.length) return tags[0];
		}
		if (el) return el;					//return if element
	}
	return null;							//null if el not found
}
/*---------------------------------------------------------------------------------------------
get current styleProp of el -or- if value specified, el matching traversing up dom tree
---------------------------------------------------------------------------------------------*/
EZ.getStyle = function EZgetStyle(el, styleProp, value)
{
	el = EZ.getEl(el);
	if (!EZ.legacy.EZgetStyle)
	{
		if (value != undefined && !EZ.isArrayLike(value))
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
			if (value == undefined)
				return !styleProp ? val : val[styleProp];

			// return el if specified property matches one of specified values
			if ([].indexOf.call(value,val[styleProp]) != -1)
				return el;
		}
		while (el = el.parentElement)	//move up dom tree

		return EZ.none();				//specified value not found in dom tree
	}
	//--------------------------------------------------------------------
	// legacy code -- get element or element for id if el not element
	//	TODO: does not work on chrome -- window.getComputedStyle is function
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
EZgetCurrentStyle = EZgetStyle;
EZgetCurrentStyleValue = EZgetStyle;
/*-----------------------------------------------------------------------------------
EZ.none(id [,root])

return pseudo HTML element object
-----------------------------------------------------------------------------------*/
EZ.none = function EZnone(id,root)
{
	var item = id || '';
	root = root || document;

	// if item is not string, probably called by mistake instead of EZ.isNone()
	// return type none object which evaluates to true if called for EZ.isNone()
	switch(typeof item)
	{
		case 'nan':
		case 'null':
		case 'unknown':
		case 'undefined':
			item = typeof(item)
			break;

		case 'boolean':
		case 'number':
			item = item + '';
			break;

		case 'function':
			item = EZ.getFunctionName(item);
			break;

		case 'object':
			item = item.id || item.name || item.tag || 'object'
			break;

		case 'string':
		default:
	}

	if (!EZ.is(root))
		root = EZ.getEl(root);

	var id = '';
	var name = '';
	var tagName = 'none';
	var s = item.substr(1);
	switch(item.substr(0,1))
	{
		case '#':
		{
			id = s;
			name = s;
			break;
		}
		case '@':
		{
			name = s;
			break;
		}
		case '<':
		{
			tagName = s.replace(/(>$)/m,'');
			break;
		}
	}

	// create pseudo parent
	var parentNode = root.createElement('none');
	parentNode.undefined = true;

	// create new pseudo node
	var node = root.createElement(tagName);

	node.undefined = true;
	node.options = new Option()
	node.setAttribute('id', id);
	node.setAttribute('name', id);

	// add attributes used by most most tags
	var attributes = ('accept accept-charset accesskey action align allowtransparency alt '
				   + 'border bottom center charset checked class cols coords disabled enctype '
				   + 'frameborder height href hspace id justify label left longdesc '
				   + 'marginheight marginwidth maxlength method middle multiple name onreset onsubmit '
				   + 'readonly rel rev right rows scrolling selected shape size src style '
				   + 'target title top type usemap value vspace width wrap' ).split(" ");
	
	for (var i=0; i<attributes.length; i++)
		if (!node.getAttribute(attributes[i]))
			node.setAttribute(attributes[i],'');

	// add dom utils if defineed
	if (EZ.dom && EZ.dom.utils) node.EZ = new EZ.dom.utils(node);
	return node;
}
/*---------------------------------------------------------------------------------------------
return checked value of checkbox/radio -- undefined if invalid element
if no checked property, return element value true/false interpretation
---------------------------------------------------------------------------------------------*/
EZ.isChecked = function EZisChecked(el)
{
	el = EZ.getEl(el);
	if (el == null) return;		//return undefined (false)

	if (el.checked != undefined) return el.checked;

	return EZ.isTrue( EZ.getValue(el) );
}
EZ.getChecked = EZ.isChecked;
/*---------------------------------------------------------------------------------------------
Set checked value of checkbox/radio -- returns input value as convenience
if no checked property for element, sets element value true or false.
---------------------------------------------------------------------------------------------*/
EZ.setChecked = function EZsetChecked(el, value)
{
	var els = EZ.getEl(el);
	if (!els) return false;

	if (els.length > 1)
		return EZ.setValue(el, value)

	value = EZ.isTrue(value);
	if (el.checked != undefined)
		el.checked = value;
	else
		value = EZ.setValue(el, value);

	return value;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
EZ.toggleChecked = function EZtoggleChecked(el)
{
	return EZ.setChecked(el, !EZ.getValue(el));
}
/*---------------------------------------------------------------------------------------------
return true or false: check all true/false varients (0 or '0' retrun false
---------------------------------------------------------------------------------------------*/
EZ.getBoolean = function EZgetBoolean(el)
{
	var el = EZ.getEl(el);
	if (el == null) return false;
	return EZ.isTrue(EZ.getFieldValue(el), {zerovalue:false});
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
EZ.getInt = function EZgetInt(el, defaultValue)
{
	return EZ.toInt( EZ.getValue(el), defaultValue);
}
/*---------------------------------------------------------------------------------------------
//chrome value is 'on' if not specified so...
//...verify by checking outerHTML for value
---------------------------------------------------------------------------------------------*/
EZ.getButtonValue = function EZgetButtonValue(el)
{
	var value = el.value;
	if (value == 'on' && !/value="(.*?)"/.test(el.outerHTML) )
		value = '';
	return value;
}
/*---------------------------------------------------------------------------------------------
return element value(s) as array -- useful for multi-select field
blank or no values returned as ??
---------------------------------------------------------------------------------------------*/
EZ.getValues = function EZgetValues(el, defaultValue)
{
	return EZ.getValue(el, defaultValue).split('|');
}
/*---------------------------------------------------------------------------------------------
return element value -- cloned from EASY.js beta:

if unknown el return defaultValue or undefined
if form field, return field value else el.innerHTML if defined otherwise  null
---------------------------------------------------------------------------------------------*/
EZ.getValue = function EZgetValue(el, defaultValue)	//TODO: complete defaultValue
{
	var els = EZ.getEls(el);
	if (!els) return defaultValue;		//return default or undefined??

	el = EZ.isArrayLike(els) ? els[0] : els;
	var name = el.name || el.id || '';

	var tagName = (el.tagName || '').toLowerCase();
	var tagType = (el.type || '').toLowerCase();
	if (/(radio|checkbox|text|password|hidden)/i.test(tagType))
		tagName = tagType;		//pseudo tagName

	var value = el.value != undefined ? el.value
			  : el.innerHTML != undefined ? el.innerHTML
			  : '';
	switch (tagName)
	{
		case 'textarea':
		case 'text':
		case 'password':
		case 'hidden':
			return value;

		case 'radio':
		if (el.name && els.length == undefined)	//if radio and els not group, make is so...
			els = EZ.getEls(el.name)				//...may have been called with single element
		if (el.name && els.length > 1)			//fall thru to checkbox if single button
		{										//length=1 probably not possible
			for (var i=0; i<els.length; i++)
			{
				if (!els[i].checked) continue;
				value = EZ.getButtonValue(els[i]);
				if (value !== '')				//return value if defined...
					return value.isTrueFalseValue();

				var id = els[i].id;
				if (id && id != name)			//...return id if diff from name
					return id;
												//...return parent label text if any
				var label = EZ.getParent(els[i], 'label');
				if (!EZ.isNone(label))
					return EZ.trim(label.innerText).isTrueFalseValue();

				return '';		//no value, id or label text found for checked button
			}
			return '';			//no button checked
		}
		case 'checkbox':
		{
			value = EZ.getButtonValue(el);
			if (value !== '')
				return  el.checked ? value : '';
			else
				return el.checked;
		}
		case 'select':
		{				//use EZ.getFieldValue() if el.selectedIndex >= 0
			if (el.selectedIndex == -1) return '';
			if (typeof(EZ.getFieldValue) == 'function')
				return EZ.getFieldValue(el);
			return el.options[el.selectedIndex].value || el.options[el.selectedIndex].text
		}
		default:
		{				//return innerHTML if defined
			if (el.innerHTML != undefined)
				return value;
		}
	}
	return null;		//TODO: should null ever be returned??
}
/*---------------------------------------------------------------------------------------------
set element value -- cloned from EASY.js beta:

set and for convenience return value

if form field, set field value otherwise set el.innerHTML

TODO:
defaultValue
select/ text field -- .replace(/(\r\n|\n|\r)/g, EZ.constant.EOL);
---------------------------------------------------------------------------------------------*/
EZ.setValue = function EZsetValue(el, value, defaultValue)
{
	if (value == undefined) value = defaultValue;
	var isValueTrueLike = EZ.isTrueLike(value);
	var isValueFalseLike = EZ.isFalseLike(value);

	var els = EZ.getEls(el);
	if (!els) return value;		//no field or element found

	el = EZ.isArrayLike(els) ? els[0] : els;

	var name = el.name || el.id || '';
	var tagName = (el.tagName || '').toLowerCase();
	var tagType = (el.type || '').toLowerCase();

	if (/(radio|checkbox|text|password|hidden)/i.test(tagType))
		tagName = tagType;		//pseudo tagName
	switch (tagName)
	{
		case 'textarea':
		case 'text':
		case 'password':
		case 'hidden':
			return el.value = value.toString();

		case 'radio':
		if (el.name && els.length == undefined)		//if radio and els not group, make is so...
			els = EZ.getEls(el.name)					//...may have been called with single element
		if (el.name && els.length > 1)				//fall thru to checkbox if not radio group
		{											//length=1 probably not possible
			value = value.toString();
			var trueLikeButton = '';
			var falseLikeButton = '';
			var idButton = '';
			var blankButton = '';
			var labelEqualsButton = '';
			var labelContainsButton = '';
			var labelTrueLikeButton = '';
			var labelFalseLikeButton = '';

			for (var i=0; i<els.length; i++)
			{
				var buttonValue = EZ.getButtonValue(els[i]);
				if (value !== '' && buttonValue.toLowerCase() === value.toLowerCase())
				{
					els[i].checked = true;
					return EZ.getValue(name);			//return if matching value found
				}

				if (value === '')
				{
					if (blankButton === '')
						blankButton == els[i];
				}
				if (EZ.isTrueLike(buttonValue))
				{										//button value is trueLike...
					if (!isValueTrueLike)
						els[i].checked = false;				//...uncheck if value not trueLike
					if (!trueLikeButton)
						trueLikeButton = els[i];			//...remember if 1st trueLike button
				}
				if (EZ.isFalseLike(buttonValue))
				{										//button value is falseLike...
					if (!isValueFalseLike)
						els[i].checked = false;				//...uncheck if value not falseLike
					if (!falseLikeButton)
						falseLikeButton = els[i];			//...remember if 1st falseLike button
				}

				var id = els[i].id;
				if (value !== '' && id && id !== name && id === value)
					idButton = els[i];					//non-blank value matches id diff from name

				while (true) 							//id has priority over label text so...
				{										//...only test label parent (not for="id")
					var label = EZ.getParent(els[i], 'label');
					if (!EZ.is(label)) break;

					var labelText = EZ.trim(label.innerText).toLowerCase();
					if (labelText === '') break;

					if (!labelEqualsButton && labelText === value.toLowerCase())
						labelEqualsButton = els[i];

					if (!labelContainsButton && labelText.indexOf(value.toLowerCase()) != -1)
						labelContainsButton = els[i];

					if (!labelTrueLikeButton && EZ.isTrueLike(labelText))
						labelTrueLikeButton = els[i];

					if (!labelFalseLikeButton && EZ.isFalseLike(labelText))
						labelFalseLikeButton = els[i];

					break;
				}
			}

			//-----	no button matched non-blank value . . .
			if (trueLikeButton && isValueTrueLike)			//if value trueLike...
				trueLikeButton.checked = true;				//...check 1st trueLikeButton if found

			else if (blankButton && value === '')			//if value blank...
				falseLikeButton.checked = true;				//...check 1st falseLikeButton if found

			else if (falseLikeButton && isValueFalseLike)	//if value falseLike...
				falseLikeButton.checked = true;				//...check 1st falseLikeButton if found

			else if (idButton)								//value matches a button id (not id=name)
				idButton.checked = true;
															//check value to labelText...
			else if (labelEqualsButton)
				labelEqualsButton.checked = true;			//...value matches full labelText

			else if (labelTrueLikeButton && isValueTrueLike)
				labelTrueLikeButton.checked = true;			//...trueLike value matches trueLike label

			else if (labelFalseLikeButton && isValueFalseLike)
				labelFalseLikeButton.checked = true;		//...falseLike value matches falseLike label

			else if (labelContainsButton)
				labelContainsButton.checked = true;			//...value matches some labelText

			return EZ.getValue(name);
		}
		case 'checkbox':
		{
			value = value.toString();
			var elValue = EZ.getButtonValue(el);

			//						...check if value matches checkbox value
			if (elValue.toLowerCase() === value.toLowerCase())
				el.checked = true;
			//						...check if value trueLike & checkbox trueLike or blank
			else if ((elValue === '' || !elValue.isFalseLike())  && value.isTrue())
				el.checked = true;
			//						...otherwise uncheck
			else
				el.checked = false;

			return EZ.getValue(el);
		}
		case 'select':
		{				//use EZ.getFieldValue()
			if (typeof(EZ.setFieldValue) != 'function') return value;

			EZ.setFieldValue(el,value);
			return EZ.getFieldValue(el);
		}
		default:
		{				//return innerHTML if defined
			if (el.innerHTML != undefined)
				return el.innerHTML = value;
		}
	}
	//TODO: return undefined or null??
	//if (el.checked == undefined) return;
	return null;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
EZ.toggleClass = function EZtoggleClass(el,className)
{
	el = EZ.getEl(el);
	if (el == null) return false;

	var rtn = true;
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
	return rtn;
}
/*---------------------------------------------------------------------------------------------
add className
---------------------------------------------------------------------------------------------*/
EZ.addClass = function EZaddClass(el, className, trueFalse)
{
	el = EZ.getEl(el);
	if (el == null) return false;
	if (trueFalse === false) return EZ.removeClass(el,className);

	var names = el.className.replace(/\s+/g, ' ').trim().split(' ');
	var idx = names.indexOf(className);
	if (idx == -1)
		names.push(className);

	el.className = names.join(' ');
}
/*---------------------------------------------------------------------------------------------
remove className
---------------------------------------------------------------------------------------------*/
EZ.removeClass = function EZremoveClass(el, className, trueFalse)
{
	el = EZ.getEl(el);
	if (el == null) return false;
	if (trueFalse === false) return EZ.addClass(el,className);

	var names = el.className.replace(/\s+/g, ' ').trim().split(' ');
	var idx = names.indexOf(className);
	if (idx != -1)
		names.splice(idx,1);

	el.className = names.join(' ');
}
/*---------------------------------------------------------------------------------------------
return true if el contains any of specified className(s)
true if className empty, false if el not found.
---------------------------------------------------------------------------------------------*/
EZ.hasClass = function EZhasClass(el, className)
{
	if (!className) return true;

	el = EZ.getEl(el);
	if (!EZ.is(el) || !el.className) return false;

	if (!EZ.legacy.EZhasClass)
	{
		var classNames = EZ.toArray(className);
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
/*---------------------------------------------------------------------------------------------
show or hide element -- return false if el hidden; true is shown
---------------------------------------------------------------------------------------------*/
EZ.hide = function EZhide(el, trueFalse, useVisibility)
{
	el = EZ.getEl(el);
	if (el == null) return false;

	if (trueFalse == undefined) trueFalse = true;
	if (EZ.isFalseLike(trueFalse)) return EZ.show(el);

	useVisibility = typeof(useVisibility) == 'boolean' ? useVisibility
				  : useVisibility == 'visibility';

	if (EZ.isShow(el))		//if currently showing . . .
	{						//hide via visibilty if specified or previously hidden
		if (!el.EZorigStyle) el.EZorigStyle = {}
		if (useVisibility || el.EZorigStyle.visibility == 'hidden')
			el.style.visibility = 'hidden';
		else
		{					//otherwise set display to none after saving current value
			el.EZorigStyle.display = EZ.getStyle(el,'display')
			el.EZstyle.display = 'none';
		}
	}
	return false;	//convenience return value
}
/*---------------------------------------------------------------------------------------------
show or hide element -- use visibility=hidden to hide
---------------------------------------------------------------------------------------------*/
EZ.visible = function EZvisible(el, trueFalse)
{
	return EZ.isTrue(trueFalse) ? EZ.show(el) : EZ.hide(el, true, 'visibility');
}
/*---------------------------------------------------------------------------------------------
show or hide element -- return false if el hidden; true is shown

REFERENCE: w3c HTML4 display property defaults
http://stackoverflow.com/questions/6867254/browsers-default-css-for-html-elements
---------------------------------------------------------------------------------------------*/
EZ.show = function EZshow(el, trueFalse, useVisibility)
{
	el = EZ.getEl(el);
	if (el == null) return false;

	if (trueFalse == undefined) trueFalse = true;
	if (EZ.isFalseLike(trueFalse)) return EZ.hide(el, true, useVisibility);

	if (!el.EZorigStyle) el.EZorigStyle = 			//save display and visibilty style values
	{
		display: EZ.getStyle(el,'display'),
		visibility: EZ.getStyle(el,'visibility')
	}
	while (!EZ.isShow(el))						//if not currently showing
	{											//1st try clearing el visibility style
		if (el.style.visibility == 'hidden') el.style.visibility = '';
		if (el.style.display == 'none')	el.style.display = '';
		if (EZ.isShow(el)) break;				//bail if that did the trick

		//next try visibility=visible if visibility prop originally defined now hidden
		var visibility = EZ.getCurrentStyleValue(el,'visibility');
		if (visibility == 'hidden' || el.EZorigStyle.visibility)
			el.style.visibility = 'visible';
		if (EZ.isShow(el)) 						//if that did it, cool...
		{										//...save visibility for show if not yet saved
			if (!el.EZorigStyle.visibility) el.EZorigStyle.visibility = visibility;
			break;
		}
		//must use display property if still not showing...
		var display = EZ.getCurrentStyleValue(el,'display');
		if (el.EZorigStyle.display)
		{										//...1st try original display style if definned
			el.style.display = el.display;
			if (EZ.isShow(el)) break;
		}
		if (display == 'none')
		{										//...next try inherit
			el.style.display = 'inherit';
			if (EZ.isShow(el)) 					//if that did it, cool...
			{									//...save display for show if not yet saved
				if (!el.EZorigStyle.display) el.EZorigStyle.display = display;
				break;
			}
		}
		var tagDefault = 				//...lastly use tag defaukt display style
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
	return true;	//convenience return value
}
/*---------------------------------------------------------------------------------------------
is element displayed based on offsetHeight
---------------------------------------------------------------------------------------------*/
EZ.isShow = function EZisShow(el)
{
	el = EZ.getEl(el);
	if (el == null) return false;

	if (!dw.isNotDW)
		return el.offsetHeight > 0;

	if (EZ.getCurrentStyleValue(el,'display') == 'none') return false;
	if (EZ.getCurrentStyleValue(el,'visibility') == 'hidden') return false;
	return true;
}
/*---------------------------------------------------------------------------------------------
show or hide element or element with id
---------------------------------------------------------------------------------------------*/
EZ.toggleShow = function EZtoggleShow(el)
{
	return EZ.show(el, !EZ.isShow(el))
}
EZ.toggle = EZ.toggleShow;
