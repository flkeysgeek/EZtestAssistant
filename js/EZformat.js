/*--------------------------------------------------------------------------------------------------
Dreamweaver LINT global references and defined variables not used here
--------------------------------------------------------------------------------------------------*/
/*global 
EZ, DWfile, 

e:true, g:true, dw:true, f:true
*/
var e;			//global used for try/catch
//. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
(function() {[	//global variables and functions defined but not used

e, f, g, dw, DWfile ]});
//__________________________________________________________________________________________________
EZ.format = (function _____EZ_format_____()
{
	/*----------------------------------------------------------------------------------------------
	EZ.format functions:
		EZ.format.options()		EZoptions
		EZ.format.element()		HTML elements
		EZ.format.value(value)	format based on value type
	
	TODO:
		Array.format()	??
		String.format()	??
		String.prototype.formatStack()	

	===============================
	EZ.format.value(value, options)											
	===============================
	Provides simple formatting for primitive or associated Object e.g. Number, Boolean or String.
	
	Also concisely formats Date or RegExp (or Functions as function statement and line count)
	
	Any other Object simply show as constructor name e.g. [Object] or [Array].
	See EZ.stringify() or EZ.toString() to format Objects or Arrays.
	
	String over maxchars are truncated. Charactor less than 32 or 255 are shown as hex values:
	e.g. oX0056
	
	Originally created for EZ.equals() showDiff reporting to concisely show any value or objent.
	
	
	ARGUMENTS:
		value		(required) value to format.
	
		maxchars	(optional) specifies max formatted characters
	
					Strings: "the value of strin"... -or- "..." if < 6
					RegExp: /start of patt/gm...     -or- /.../gm if < 6
					Date: 	  Date...
					Function: fn(...)
					Object: [Object] or {}
					Array: [Array] or [];
					Number: ###
					Boolean: always true or false
	
	
	RETURNS:
		formated value.  String are enclosed in double quotes
		
	NOTE:
		all code in EZ.basic.js::EZ.format() -- but calls fn here when avail -- e.g. ___.Object()
	----------------------------------------------------------------------------------------------*/
	var ___ = {}, options;
	//var defaultOptions = EZ.defaultFormatOptions; 
	//__________________________________________________________________________________________________
	function _init()
	{													
		for (var key in ___)						//replace basic EZ.format properties or functions
			EZ.format[key] = ___[key];				//...defined here
			
		options = ___.options = EZ.format.options;
		
		EZ.event.add(window, 'onload', function()	//init format.Element() extractGroups after 
		{											//all onload scripts have chance to update
			var keys = [];
			var extractGroups = EZ.format.options.htmlFormatter.extractGroups;
			for (var k in extractGroups)			//each group includes prior group values
			{
				keys = keys.concat(extractGroups[k]);
				extractGroups[k] = keys.slice();
			}
		});
		return EZ.format;
	}
	//__________________________________________________________________________________________________
	/**
	 *
	 */
	___.formatObject = function ___formatObject(value, options)
	{
		this.isTest = arguments.callee.caller.isTest;
		if (this.isTest)
			void(0);
		
		var maxchars = options;
		if (!isNaN(options))
			options = {maxchars: maxchars};	
		options = EZ.options.call(___.options, options);
		
		var formatterArgs = _getFormatter([].slice.call(arguments));
		
		if (typeof(options.formatter) != 'function' || options.formatter == 'native')
			return Object.prototype.toString.call(value);		//native toString()	

		try
		{
			return options.formatter.apply(window, formatterArgs)
		}
		catch (e)
		{
			return e.stack.formatStack().join('\n');
		}
		//______________________________________________________________________________________________
		/**
		 *
		**/
		function _getFormatter()
		{
			var formatter = options.formatter;
			var formatOpts = options.formatOpts;
			
			var formatterName = '';
			if (formatter == 'none')
				formatter = '';
				
			else if (typeof(formatter) == 'function')
				formatterName = formatter.name
			
			else if (typeof(formatter) == 'string')
			{
				formatterName = formatter.replace(/^EZ\.?/, '');
				formatter = EZ[formatterName]
			}
			
			if (formatter)											//if formatter
			{														//TODO: JSON variants
				
				var formatOpts = (formatOpts instanceof Object) ? formatOpts
							   : (typeof(formatOpts) == 'string') ? EZ.getAttributes(formatOpts, true)
							   : {};
				
				if (typeof(formatterName) == 'string')
				{
					
					if (formatterName.includes('toString'))
					{
						options.formatter = EZ.toString;
						formatOpts = ___.options.formatOpts[formatterName.toLowerCase()] 
								  || ___.options.formatOpts.tostring
								  || formatOpts;
					}
					if (formatterName.includes('stringify'))
					{
						options.formatter = (formatterName.includes('plus')) ? JSON.plus.stringify
										  : (formatterName.includes('JSON')) ? JSON.stringify
										  : EZ.stringify;
										  
						formatOpts = ___.options.formatOpts[formatterName.toLowerCase()] 
								  || ___.options.formatOpts.stringify
								  || formatOpts;
					}
				}
				formatOpts = formatOpts || {};
			}
	
			var formatterArgs = [value, formatOpts];
			if (value instanceof Element)
			{
				options.formatter = EZ.format.Element;
				formatterArgs = [value, formatOpts.htmlFormatter, formatOpts];
			}
			if (/(toString|stringify)/.test(formatterName))
			{
				if (options.maxchars)
					options.formatter = EZ.format.brief;
				
				else if (formatter == JSON.stringify)
					formatterArgs = [value, formatOpts.extract, formatOpts.spaces];
			}		
			return formatterArgs;
		}
	}
	//______________________________________________________________________________________________
	/**
	 *	Format date as: mm-dd-yyyy hh:mm am/pm
	 *
	 *	Options is an optional String representing one of the following
	 *		(default)		Return date and time if not 0
	 *		datetime		Always return date and time
	 *		date, dateonly	Return date only
	 *		time, timeonly	Return time only
	 *		ms				include milli seconds
	 *		[x]space spaces	space before am or pm -- TODO: make default like EZ.formatTime()
	 *		nospaces		no spaces before am or pm
	 *	
	 *		if options not specified or any other value, return date (and time if not 12:00am)
	 */
	___.dateTime = function ___format_dateTime(theDate, options)
	{
		var value = ''
		var theDateOrig = theDate;
		options = EZ.toArray(options, ' ,'); 
		if (options.includes('@')) 
			options.push('today', 'time', 'date')
	
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
		if (hours === 0) hours = 12
	
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
			   
		var seconds = ':' + EZ.right('0'+theDate.getSeconds(),2)
		seconds = (options.includes('-seconds')) ? ''
				: (options.includes('+seconds') && seconds == ':00') ? '' 
				: seconds; 
	
		var timeString = EZ.right('0'+hours.toString(),2) + ':'
					   + EZ.right('0'+theDate.getMinutes(),2)
					   + seconds
					   + ms
					   + (true || options.includes('spaces') ? ' ' : '')
					   + (theDate.getHours() < 12 ? 'am' : 'pm'); //no space to avoid wrap
	
		var isToday = dateString == EZ.formatDate('', 'date');
		if (isToday && options.includes('today') && options.includes('time'))
		{
			dateString = '';
			if (options.includes('@'))
				timeString = '@ ' + timeString;
		}
		else if (!isToday && options.includes('today') && options.includes('date'))
			timeString = '';
	
		if (options.includes('today') 
		|| options.includes('datetime')
		|| options.includes('timedate'))
			value = (dateString + ' ' + timeString).trim()
	
		else if (options.includes('date'))
			value = dateString
	
		else if (options.includes('time'))
			value = timeString
		
		else
		{
			if (theDate.getHours() === 0 && theDate.getMinutes() === 0)
				value = dateString
			else
				value = dateString + ' ' + timeString
		}
		return value;
	}
	//______________________________________________________________________________________________
	/**
	 *	options comma delimited string of options -- "time" always appended
	 *	spaces appended if "nospace" not found
	 */
	___.time = function ___format_time(theDate, options)
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
		
		return EZ.format.dateTime(theDate, options);
	}
	//______________________________________________________________________________________________
	/**
	 *
	 */
	___.date = function ___format_date(date, options)
	{
		return EZ.format.dateTime(date, 'date', options)
	}
	//______________________________________________________________________________________________
	/**
	 *
	 */
	___.timeToday = function ___format_timeToday(date, options)
	{
		options = EZ.options.call(options);
		options.today = true;
		options.time = true;
		return EZ.format.dateTime(date, 'date', options)
	}
	//__________________________________________________________________________________________________
	/**
	 *	EZ.format.newlines(value [, format])
	 */
	___.newlines = function ___format_newlines(value, format) 
	{
		if (typeof(value) != 'string') return value;
														//1st convert to unix -- lines end with \n
		value = value.replace(/\\r/g, '\r');
		value = value.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
		
		switch (format+'')
		{
			case 'mac': 	return value.replace(/\n/g, '\r');
			case 'windows': return value.replace(/\n/g, '\r\n')
		}	
		return value;
	}
	//______________________________________________________________________________________________
	/**
	 *	EZ.format.options -- EZoptions.toString() / valueOf()							 INCOMPLETE
	 *	see EZ.format.element for SELECT options
	 */
	___.EZoptions = function ___format_EZoptions(formatter) 
	{
		var options = EZ.options({formatter:formatter}, EZ.defaultOptions.format);
		
		var formatter = options.formatter || 'toString';
		var formatOpts = '.formatOpts'.ov(options, {})[formatter.toLowerCase()] || {};
		/*
		if (!formatOpts)
		{
			formatter = 'toString';
			formatOpts = options.formatOpts.tostring;
		}
		*/
		formatOpts = EZ.options( {htmlFormatter:options.htmlFormatter}, formatOpts)
		
		var str = '[oops]';
		if (formatter == 'toString')
		{
			str = EZ.toString(options, formatOpts)
		}
		else
		{
			str =  EZ.stringify(options, formatOpts)
		}
		return str;
		//return Object.prototype.toString.call(this);		//use native
	}
	//==================================================================================================
	return _init();	
})();
//______________________________________________________________________________________________
/**
 *	returns single line pseudo json if less than maxchars otherwise [...] or {...}
 *	appends "[]" or "{}" if value is ArrayLike or Array has named properties.
 *
 *	refactored from EZtestAssistant.js code used to display short test call argument values.
**/
EZ.format.brief = function ___format_brief(value, maxchars)
{
	var json,
		type = (EZ.getType) ? EZ.getType(value) : '',
		like = (type == 'ArraryLike') ? '[]'
			 : (type == 'ObjectLike') ? '{}'
			 : '';
	try									
	{								//=0 for [1,2] not [1, 2] and {a:1} not {a: 1}
		json = EZ.stringify(value, 'native', 0) + like;
									//remove outer quotes for brievity: [1,"abc"] --> [1,abc]
									//unescape inner quotes: e.g. a \"red\" apple --> a red apple
		json = json.replace(/((\\")|("))/g, '$1'.replace(/^"/, '').replace(/\\"/, '"'));
	}
	catch (e)
	{
		json = value + ':error:' + e;
	}
	if (json.length <= maxchars) return json;
	
	return (value instanceof Array) ? '[...]' + like : '{...}' + like;
}
//______________________________________________________________________________________________
/**																
 *	create and/or display optionally collaspable console.log() entry.
**/
EZ.format.console = function format_console()
{
}
//______________________________________________________________________________________________
/**																
 *	create and optionally append html node from EZ.format.value() -- optionally collaspable.
**/
EZ.format.node = function format_node()
{
}
//______________________________________________________________________________________________
/**																
**/
EZ.format.node.append = function format_nodeAppend(tag, values)
{
	var logTag = tag || values.logTag;
	
	if (values.closeDetails)					//close prior details
		[].forEach.call(logTag.children, function(el) {el.removeAttribute('open')});				
		
	var node = this.getDetailsNode(values)
	logTag.appendChild(node);					//append new details
	
	if (values.openDetails)
		node.setAttribute('open', 'on');		//...and open	
	
	node.scrollIntoViewIfNeeded();
}
//______________________________________________________________________________________________
/**																
**/
EZ.format.node.create = function format_nodeCreate(tagValues)
{
	var _getTags, _getValues;
	var MAIN = function()
	{
		var values = _getValues(tagValues);
		var tags = _getTags(values);				//create tag Object from values
		//EZ.sync(tags, values);
		
		var node = EZ.createTag(tags, null);	
		return node;
	}
	//==========================================================================================
	/**
	 *	http://stackoverflow.com/questions/5239758/css-truncate-table-cells-but-fit-as-much-as-possible	 *
	**/
	_getValues = function(values) 
	{
		//values = {};
		//EZ.sync(values, tagValues, 'tagValues', 1);				//clone tagValues
	
		var defaultValues = {
			detailsHead: '...',
			detailsBody:  '...',
			icon: {
				class: 'hidden',
				src: "../images/compare.png",
				title: 'full compare via winmerge',
				onClick: 'void(0)'
			},
			action: '',
			timestamp: '', 
			name: '',
			summary: '...',
			summaryClass: '',
			stack: '',
			tooltipClass: 'hidden',
			note: '',
			notable: '',
			closeDetails: true,
			openDetails: true,
			value: '',
			formatter: '',
			formatOpts: ''
		}
		EZ.sync(values, defaultValues, '@+^', 1);
		if (values.summary == '...')					//use composite value for summary if not supplied
			values.summary = values.action + ' ' + values.timestamp + ' ' + values.name + values.note;
		//values.summary = values.summary.truncate(76, '...')
		
		if (values.detailsHead == '...')
			values.detailsHead = (EZ.getType(values.value) != 'Object') ? values.value + '' : '';
		
		if (values.detailsBody == '...')
		{
			var val = EZ.format.value(values.value,50, values.formatter, values.formatOpts);
			values.detailsBody = val;
			//(EZ.getType(values.value) != 'Object') ? EZ.format.value(values.value,50)
			//				   : EZ.toString(values.value, values.formatOpts);
		}
		values.detailsBody = values.detailsBody.replace(/&nbsp;/g, '');
		//console.log({values:values, sync:sync})
		
		if (values.stack)
			values.tooltipClass = 'pre';
		return values;
	}
	/**
	 *     icon with optional onclick          with optional stacktrace tooltip
	 *    /                                   /
	 *	> @ action timestamp name note .......noteable
	 *	v detailsHead (optional)
	 *	  detailsBody (optional)
	**/
	_getTags = function(values) 
	{
		return {
			details: {
				nodes: {
					summary: {
						styles: {
							marginTop: '2px',
							padding: '0px 3px 2px'
						},
						onclick: 'e=this.parentNode;setTimeout(function() {e.scrollIntoViewIfNeeded(true)}, 500)',
						nodes: {
							span: {
								class: values.summaryClass,
								nodes: [
									{
										tagName: 'span',
										styles: {
											display: 'table-cell',
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											maxWidth: '500px'
										},
										nodes: {
											input: {
												class: values.icon.class,
												type: "image",
												title: values.icon.title,
												src: values.icon.src,
												onclick: values.icon.onClick
											},
											text: ' ' + values.summary
										}										
									},
									{
										tagName: 'span',
										class: "tooltip stall",
										styles: {
											paddingLeft: '10px',
											paddingRight: '18px',
											display: 'table-cell',
											width: "1%",		//triggers pseudo table width=100%
										},
										nodes: {
											a: {
												nodes: {
													text: values.notable
												}
											},
											code: {
												class: values.tooltipClass,
												styles: {
													position: "fixed",
													right: '6px'
												},
												nodes: {
													text: values.stack
												}
											}
										}
									}
								]
							}
						}
					},
					div: {
						class: 'pre floatClear',
						nodes: {
							span: {
								styles: {
									color: '#cc0000',
									fontWeight: 'bold',
								},
								nodes: {
									text: values.detailsHead,
								}
							},
							text: (values.detailsHead ? '\n' : '')
								+ values.detailsBody 
								+ (values.detailsBody ? '\n' : '')
						}
					}
				}
			}
		}
	}
	//==========================================================================================
	return MAIN()
}
//______________________________________________________________________________________________
/**
 *	EZ.format.Element -- NOT code for: Element.prototype.toString() / valueOf()
 *
 *	original code from: Element.prototype.toString() -- before brief format added
 *
 *	TODO:
 *		support for extracting styles
 *		include code from: Element.prototype.toString()
 *		support fo EZ.createTag Object notation
 */
EZ.format.Element = function ___format_Element(el, options, depth) 
{
	var rtnValue = EZ.returnValue(this)

	if (/(Array|NodeList|HTMLCollection)/.test(EZ.getConstructorName(el)))
	{			
		var html = ''
		for (var i=0; i<el.length; i++)
			html += EZ.format.Element.call(this, el[i], options, depth) + '\n';
		return html.trim();
	}
	else if (el.constructor.name == 'Text')
		return el.textContent.replace(/\n+/gm, '\n').trim();

	else if (el instanceof Element === false)				//TODO: map Objects keys to attributes
	{
		el = EZ(el, null);
		if (!el)
		{
			EZ.oops('ignored non-Element Object', el)
			return rtnValue.save(EZ.oops.message);
		}
	}
	if (depth === undefined)								//1st non-recursive call
	{														//get new EZoptions Object from options
		options = EZ.options.call(options);					//...as either Object or String
		EZ.sync(options, EZ.format.options, '@+^');			//copy htmlFormatter options to top
		EZ.sync(options, EZ.format.options.htmlFormatter, '@+^');
		//options = EZ.options.call(EZ.format.options.htmlFormatter, options);
		
		options.maxdepth = options.maxdepth || 3;
		options.spaces = options.spaces || 4;
		depth = 0;
															//Array or delimited keys or keyGroup 
		options.extract = EZ.toArray(options.extract,' ,');	//e.g. "basic", "attr", "plus" or "all"
		rtnValue.setOptions(options);
	}														

	//=============================================================================================
	var tagOpen = el.outerHTML.match(/([\s\S]*?>)/)[1].replace(/\s+/g, ' ');
	var tagName = tagOpen.match(/<([^\s]*)/)[1];			//tagName in outerHTML case
	if (tagName.endsWith('>'))
		tagName = tagName.clip();
	var tagOpenEnd = tagOpen.substr(-2);
	if (tagOpenEnd.substr(0,1) != '/') tagOpenEnd = tagOpenEnd.substr(1);		

	var parsedAttributes = EZ.getAttributes(tagOpen);
	/*
	var outerHTML = el.outerHTML.match(/([\s\S]*?>)/)[1].replace(/\s+/g, ' ');
	var tagName = outerHTML.match(/<([^\s]*)/)[1];			//tagName in outerHTML case
	if (tagName.endsWith('>'))
		tagName = tagName.clip();
	var tagClose = outerHTML.substr(-2);
		if (tagClose.substr(0,1) != '/') tagClose = tagClose.substr(1);		
	var parsedAttributes = EZ.getAttributes(outerHTML);
	*/

	var attrKeys = [];
	var attrValues = {};
	for (var i=0; i<el.attributes.length; i++)
	{
		var name = el.attributes[i].name;
		attrKeys.push(name);
		attrValues[name] = el.getAttribute(name);
	}
	var tagValues = EZ.toArray(options.tagValues);
	var tagValuesPattern = (tagValues.length === 0) ? /^$/
						 : RegExp(tagValues.join('|').wrap('()'));
	var extractGroups = options.extractGroups || EZ.defaultFormatOptions.htmlFormatter.extractGroups;
	extractGroups.basic = extractGroups.basic.slice().removeDups();
	extractGroups.plus = extractGroups.basic.concat(attrKeys).remove('basic').removeDups();
	extractGroups.offsets = extractGroups.basic.concat(extractGroups.offsets).removeDups();
	extractGroups.na = [];
	extractGroups.all = extractGroups.all.concat(extractGroups.plus).remove('plus').removeDups();

	switch (EZ.getTagType(el))								//drop not applicable keys based on tagType
	{
		case 'text': 	
		case 'textarea': 	
		case 'password': 	
		case 'hidden': 	
		{				
			extractGroups.na.push('checked', 'options', 'src');
			break;
		}	
		case 'radio': 
		case 'checkbox': 	
		{				
			extractGroups.na.push('options', 'src');
			break;
		}	
		case 'select-one':
		case 'select-multiple':
		{				
			extractGroups.na.push('checked, value', 'src');
			break;
		}	
		case 'button': 	
		case 'image': 	
		{				
			extractGroups.na.push('checked, options');
			break;
		}	
	}
	if (el.tagName != 'A')	
		extractGroups.na.push('href')	

	var keys = extractGroups.na.remove(attrKeys)
	extractGroups.basic.remove(keys);
	extractGroups.plus.remove(keys);
	extractGroups.all.remove(keys);

	var extract = options.extract.slice();			//build list of keys to extract
	Object.keys(extractGroups).forEach(function(g)
	{
		var idx = extract.indexOf(g);
		if (idx == -1) return;
		[].splice.apply(extract, [idx, 1].concat(extractGroups[g]));
	});
	extract = extract.removeDups();

	//=============================================================================================
	var obj = {tagName:tagName};					  //-----------------------------\\
	var children = [];								 //----- start building html -----\\
	var attributes = [];							//---------------------------------\\
	var fakeAttributes = [];
	var workKeys = {
		objects: [],
		events: [],
		pseudo: [],		//TODO: fake
	}

	var idx = extract.indexOf('className');
	if (idx != -1 && extract.includes('class'))
		extract.splice(idx,1);
	extract.forEach(function(key)
	{
		if (key == 'tagName') return;

		var value = '';

		if (tagValuesPattern.test(key))				//if using outerHTML parsed value
			value = parsedAttributes[key];			//e.g. tag src rather than fully qualified url

		try
		{
			if (attrKeys.includes(key))				//if key is attr...
			{
				value = el.getAttribute(key);		
				if (/^on/i.test(key))				//if event handler
				{
					if (value)						//validate syntax if not blank
						eval(el[key]);
					else
						value = options.quote.dup(2)
				}
			}
			else if (key in el)						//if key exists for tag. . .
			{
				//if (!/^on/i.test(key))			//if not event, check if acessible
				//	eval('e="' + el[key] + '"');		

				value = (key == 'children') ? el.childNodes : el[key];
				if (value instanceof Object)		//if object e.g. children, process later
				{
					if (value.length === 0)			//ignore zero length ArrayLike Object
						return;						//...e.g. children

					return workKeys.objects.push(key);
				}
				else if (!options.tagAttributes.includes(key))
				{									//not attribute property e.g. nextSibbling
				}
			}
		}
		catch (e)
		{
			value = value || parsedAttributes[key] || '';
			if (value)
				value = '//[invalid syntax]:' + value;
		}
		if (!value.startsWith('//[invalid syntax]:') && key in parsedAttributes)
			value = parsedAttributes[key];	

		else if (!value && !options.extract.includes(key))
			return;									//ignore blank values not explicily specified

		if (key == 'className')
			key = 'class';

		obj[key] = (value == options.quote.dup(2)) ? '' : value;

		if (value == options.quote.dup(2))
			value = key + '=' + value;				
		else if (value)
			value = key + '=' + value.wrap(options.quote);
		else
			value = key;				

			attributes.push(value);
	});

	//________________________________________________________________________________________
	var events = [];								//javascript defined events
	if (extract.includes('events'))
	{
		extract = extract.remove('events');
		EZ.event.names.forEach(function(evtName)
		{
			var evt = el['on' + evtName];
			if (!evt || typeof(evt) != 'function')
				return;
			var script = Function.prototype.toString.call(evt);
			script.replace(/function\s*([\w$]*)?([\s\S]*?){/, function(all, name, args)
			{
				var fn = name ? name + args
					   : 'function' + args;
				events.push(evtName + '="' + fn + '"');
			});
		})
	}
	/*
	EZ.event.names.forEach(function(evtName)
	{
	///	extract = extract.remove([evtName, 'on'+evtName]);

		var evt = el['on' + evtName];
		if (!evt || typeof(evt) != 'function')
			return;

		if (extract.includes('events'))
		{
			var script = Function.prototype.toString.call(evt);
			script.replace(/function\s*([\w$]*)?([\s\S]*?){/, function(all, name, args)
			{
				var fn = name ? name + args
					   : 'function' + args;
				events.push(evtName + '=' + fn.wrap(options.quote) );
			});
		}
	})
	*/

	//________________________________________________________________________________________
	workKeys.objects.forEach(function(key)					//for object element properties . . .
	{														//including children
		key = key.toLowerCase();
		if (key == 'options')
		{
			obj[key] = [].slice.call(el.options);
			for (var opt=0; opt<el.options.lemgth; opt++)
				children.push(_formatOption(el.options[opt]));
		}
		else if (key == 'children')
		{
			var html;
			obj.children = [];
			var maxchildren = Math.min( el.childNodes.length, options.maxchildren)
			for (var i=0; i<maxchildren; i++)
			{
				html = _formatElement(el.childNodes[i]);
				children.push(html);
				obj.children[i] = EZ.format.Element.object;
			}

			if (i == options.maxchildren)
			{
				html = (el.children.length - i).wrap('[]') + ' more children...';
				children.push( html.wrap('<warn>') )
				obj.children[i] = {
					warn: {text: html} 
				}
			}
		}
		else
		{
			debugger;
		}
	});

	//=============================================================================================
	if (options.sort)								
	{												//sort keys if specified
		events.sort();
		attributes.sort();
		fakeAttributes.sort();
		[].sortPlus.call(obj.events);
		[].sortPlus.call(obj.attributes);
		[].sortPlus.call(obj.fakeAttributes);
	}

	var tag = '<' + tagName	+ ' '					//create html tag from extracted properties
			+ attributes.join(' ')
			+ (events.length ? '\n\t' + events.join('\n\t') : '')
			+ (fakeAttributes.length ? '\n\t' + fakeAttributes.join('\n\t') : '')
			+ tagOpenEnd;
	tag = tag.replace(/ >$/, '>');					//remove extra space when no attributes

	if (children.length)
	{
		tag += '\n\t' + children.join('\n\t') + '\n'
	//		 + '\n</' + tagName + '>';
	//else if (tagClose)

		var tagClose = el.outerHTML.replace( RegExp("[\\s\\S]*?(<\\/"+ tagName + ">$|$)", 'i'), '$1');
		tag += tagClose;
	}
	EZ.format.Element.object = rtnValue.set('object', obj);
	if (depth)										//return from recursive call;
	{
		return tag;
	}
	//=====================================================
	var json = '';
	switch (options.formatter)						//format json
	{
		case 'none':
			json = ''
			break;

		case 'EZ.stringify': 	
			json = EZ.stringify(obj, options.formatOpts);	
			break;

		default:
			json = EZ.stringify(obj, options.formatOpts.spaces);	
	}	
	/*
	*/
	EZ.format.Element.tag = rtnValue.setValue(tagName, 'tag');
	EZ.format.Element.html = rtnValue.setValue(tag, 'html');
	EZ.format.Element.json = rtnValue.setValue(json, 'json');
	//return rtnValue.save();
	return (options.format == 'json') ? json			
		 : (options.format.toLowerCase() == 'object') ? obj
		 : tag;
	//=====================================================

	//________________________________________________________________________________________
	/**
	 *	recursive call
	 */
	function _formatElement(el)	
	{	
		if (el.nodeType == 3)				//if text node, return text
		{
			var text = el.nodeValue.replace(/^\s*$/gm, '').trim();
			EZ.format.Element.object = {text: text};
			return text;
		}

		if (depth >= options.maxdepth)		//if maxdepth, return warn tag / property
		{
			var html = 'max children depth:[' + options.maxdepth + ']...';
			children.push( html.wrap('<warn>') )
			EZ.format.Element.object = {
				warn: {text: html} 
			}
			return html;
		}
											//otherwise, return formatted child element
		var tag = EZ.format.Element(el, options, depth+1);
		return tag;
	}
	//________________________________________________________________________________________
	/**
	 *	
	 */
	function _formatOption()	
	{	
		return;
	}
}
//________________________________________________________________________________________
/**
 *	
 */
EZ.format.Element.test = function ___formatElement_test()
{	
	var el, msg, arr, ctx, arg, args, html, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [el, msg, arr, ctx, arg, args, html, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	exfn = function(results, expected, testrun)
	{
		void( [results, expected, testrun] )	//jshint
		testrun.exfnDone = true;				//don't call as legacy

		var html = EZ.format.Element.html.replace(/</g, '<br>&lt;')	//.trimPlus('<br>')
		testrun.argsClone[1] = html.substr(4).wrap('<div style="white-space: normal;">')

		if (testrun.argsClone[2])
		{
			testrun.argsClone[2] = EZ.createTag(results.tagName, results, null, {
				maxdepth: EZ.format.options.Element.maxdepth,
				maxchildren: EZ.format.options.Element.maxchildren
			});
		}
		//return results;
	}
	
	notefn = function(testrun, phase)
	{
		if (phase != 'final') return;
		var el = EZ(testrun.args[0]);
		return el.outerHTML.replace(/</g, '<br>&lt;').wrap('<pre>');
		
		//var html = json + '<hr>' + detail.wrap('<pre>');
		//return html;
	}
	//______________________________________________________________________________
	EZ.test.settings( {exfn:exfn, notefn:notefn} )
	
	html = EZ('argsWrap').outerHTML;
	EZ.test.run('argsWrap', {extract:'basic', format:'json'})	
if (true) return;
	
	//______________________________________________________________________________
	EZ.test.settings( {exfn:exfn, notefn:notefn} )
	
	html = EZ('historyOptionsPopup').outerHTML;
	EZ.test.run('EZtest_div1', {extract:'basic', format:'json'})	
	
	//______________________________________________________________________________
	EZ.test.settings( {group:'historyOptionsPopup', exfn:exfn, notefn:notefn} );
	html = EZ('historyOptionsPopup').outerHTML;
	
	//#2
	EZ.test.run('historyOptionsPopup', {extract:'basic', format:'object'})	
	EZ.test.run('historyOptionsPopup', {extract:'basic children', format:'object', maxdepth:1, maxchildren:1})	
	//$4
	EZ.test.run('historyOptionsPopup', {extract:'all children', format:'object', maxdepth:1, maxchildren:6})	
	EZ.test.run('historyOptionsPopup', {extract:'all children', format:'object', maxdepth:99, maxchildren:99})	
	
	o = {extract:'all children', format:'object', maxdepth:99, maxchildren:99}
	EZ.test.run('historyOptionsPopup', o)	
	
	html = EZ('detailsTest')
	EZ.test.run('detailsTest', o)	
if (true) return;
	
	el = EZ('validationBasic').cloneNode(true);
	EZ.test.run(el, {extract:'all children', format:'object'})
/*	
	var doc = document.cloneNode();
	EZ.test.run(doc)	
	
	var html = document.getElementsByTagName('html')[0];
	EZ.test.run(html)	
	
	var head = document.getElementsByTagName('head')[0];
	EZ.test.run(head)	
	
	var title = document.getElementsByTagName('title')[0];
	EZ.test.run(title)	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	var body = document.getElementsByTagName('body')[0];
	EZ.test.run(body)	

	var wrap = document.getElementById('EZtest_wrap');
	EZ.test.run(wrap)	

	var labels = wrap.getElementsByTagName('label')
	EZ.test.run(labels)	

	var inputs = wrap.getElementsByTagName('input')
	EZ.test.run(inputs)	

	var forms = document.forms;
	EZ.test.run(forms)	

	var fm = forms[1];
	EZ.test.run(fm)	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	var none = EZnone();
	EZ.test.run(none)	

	var tags = wrap.getElementsByTagName('EZtest_tag');
	EZ.test.run(tags)	

	var array = [].slice.call(tags)
	EZ.test.run(array)	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	var divs = wrap.getElementsByTagName('div');
	EZ.test.run(divs)	

	var radios = fm.EZtest_radio;
	EZ.test.run(radios)	

	var radio01 = [].slice.call(radios); radio01.pop();
	EZ.test.run(radio01)	

	var label_some = document.getElementById('EZtest_label_some');
	EZ.test.run(label_some)	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	var mixed = [].slice.call(divs); mixed.push('str');
	EZ.test.run(mixed)	

	var idandclass = document.getElementsByClassName('idandclass');
	EZ.test.run(idandclass)	
*/
}
//________________________________________________________________________________________
/**
 *	
 */
EZ.format.EZoptions.test = function ___formatEZoptions_test()
{	
	var el, msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [el, msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, , rtnValue];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	exfn = function(results, testrun)
	{
		testrun.results = results = {results: results}
	}
	notefn = function(testrun)
	{
		e = testrun;
	}

	//EZ.test.skip(999)		//count to skip 
	//EZ.test.settings({group: 'persistant note'});
	//______________________________________________________________________________________

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = ''
	ctx = ""
	arg = ['1st arg'];
	obj = {}
	ex = [arg];
	ex.results = "supplied object variable is null"
	ex.ctx = ctx;
	
	//EZ.test.options( {ex:ex, note:note} )
	el = EZ('EZtest_input');
	EZ.options.set('format.EZoptions.tags.el', el);
	EZ.test.run()
}


//___________________________________________________________________________________________
EZ.format.value.test = function ___formatValue_test()
{	
	var msg, arr, ctx, arg, args, o, obj, note, ex, exfn, notefn, fn, val, rtnValue;
	e=[ msg, arr, ctx, arg, args, o, obj, note, ex, exfn, notefn, fn, val, rtnValue ];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//=======================================================================================
	/*NOTES:				do not prefix with *				displayed by EZtest Assistant

	*/
	exfn = function(testrun)
	{
		var msg;
		var results = testrun.getResults();
		//var rtnValue = testrun.getReturnValue();
		//var options = testrun.getOptions();

		void(msg, results)
	}
	//=======================================================================================
	notefn = function(testrun)
	{
		e = testrun;
	}
	//=======================================================================================
	EZ.test.settings( {exfn:exfn} );
	//EZ.test.settings( {legacy:'exclude=isLegacy'} );
	//EZ.test.run(-2		,{EZ: {ex:-2, note:note}})
	//EZ.test.options( {ex:ex, note:note} )
	//EZ.test.run( ctx, arg, obj )
	//_______________________________________________________________________________________
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	arg = 'I am string';

	note = 'String'
	EZ.test.run('I am string')
	EZ.test.run('I am string', 10)
	EZ.test.run('I am string', 5)

	note = 'Number'
	EZ.test.run(123, 5)
	EZ.test.run(1234567890, 10)
	EZ.test.run(1234567890, 5)

	note = 'RegExp'
	EZ.test.run(/abc/)
	EZ.test.run(/abc/, 5)
	EZ.test.run(/this is long pattern/)
	EZ.test.run(/this is long pattern/gim)
	EZ.test.run(/this is long pattern/, 5)
	EZ.test.run(/this is long pattern/gim, 5)

	note = 'Date'
	EZ.test.run(new Date("03/31/2016 08:00 AM"))
	EZ.test.run(new Date("03/31/2016 08:00 AM"), 5)
	EZ.test.run(new Date("03/31/2016 08:00.010 AM"))
	arg = new Date("03/31/2011")
	EZ.test.run(arg)
	EZ.test.run(new Date("03/14/2016 02:00 PM"))
	EZ.test.run(new Date("03/14/2016 02:00:01 PM"))
	EZ.test.run(new Date("12/31/1969 07:00:01.234 PM"))
	arg = new Date("12/31/1969 07:00:01.234 PM")
	EZ.test.run(arg)
	EZ.test.run(new Date(""))
	EZ.test.run(new Date("Invalid Date"))

	//_______________________________________________________________________________________
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	EZ.test.settings( {note:'Array'} );
	arr = [
		"Object name NA  @ 00:52:33          ", 
		"   [~cid]       *added*    ... 2    ", 
		"   [~name]      *added*    ... _init"
	]
	EZ.test.run(arr)
	EZ.test.run(arr, {formatter:'native'})


	//_______________________________________________________________________________________
	if (true) return;
	EZ.test.quit;	//script continues but all following test skipped
}
