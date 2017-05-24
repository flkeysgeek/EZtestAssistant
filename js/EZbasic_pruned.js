/*--------------------------------------------------------------------------------------------------
Dreamweaver LINT global references and definitions  not used here
--------------------------------------------------------------------------------------------------*/
/*global 
t_doc, t_html, t_head, t_title, t_body, t_wrap, t_labels, t_inputs,
t_forms, t_fm,  t_none, t_tags, t_array, t_divs, t_radios, t_radio01,
t_label_some, t_mixed, t_idandclass,

EZgetEl, EZgetPref, EZgetValue, EZsetValue, EZnone, EZdisplayCaller,
 
EZ, DWfile, dw:true, e:true, f:true, g:true, unescape
*/
var e;			//global used for try/catch
//. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
(function() {[	//global variables and functions defined but not used
EZgetEl, EZgetValue, EZsetValue, EZnone, EZdisplayCaller,
	
	t_doc, t_html, t_head, t_title, t_body, t_wrap, t_labels, t_inputs,
	t_forms, t_fm,  t_none, t_tags, t_array, t_divs, t_radios, t_radio01,
	t_label_some, t_mixed, t_idandclass,

DWfile, dw, e, f, g ]});
/*__________________________________________________________________________________________________

organizational structure ...

-----------------------------------------
Flagship and salient differiencators are:
-----------------------------------------
	-standalone lightwieght jquery-like library or jquery wrapper providing the following:

	-avoids js errors when any function called improperly including required arguments omitted,
	 undefined or unexpected typeof value.

	-even prevents js errors in user functions that specify a tag or element selector and assume
	 at least one element always exists but may not because selector is mis-spelled, element is
	 not created before referenced, has been deleted (or type changed) by subsequent design change
	 or any other root cause. **

	 -when called with element selector referencing non-exsistant element, by default a  pseudo
	  element is created and added to the end of the document as a hidden tag unless explicitly
	  prevented by one of the function options.

	-has very robust integrated Testing Assistant that makes it to easy test every function for
	 all scenarios -- unit tests are easy to manually configure or can be automatically created
	 while running live and saved for future regression testing.

	-intregrated javadoc-type documentation facilitates easy creation and maintence of docs.

	-integrated error logging with full stacktrack pinpoints improper function calls and unexpected
	 or suspect results -- logs are easy to optionally viewed while browsing or saved on server for
	 later viewing.
----------------------------------------------------------------------------------------------------
For new , functions moving from EZ.core to one of the following files:

EZ/RZprototypes.js	(same file) and should also match EASY.prototypes.js
									prototypes and related functions
	EZ/RZgetset.js		(same file) future replacement for EASY.core.js::EZ(...)
	EZ/RZcommon.js		(same file) common functions from RevizeCommon.js non-dreamweaver specific
									and partial port of EASY.js functions
	EZdwutils.js 		(latest)	Dreamweaver/Revize specific functions: e.g. getDOM()
	RZdwutils.js		(legacy)	old versions of DW functions used by Revize Extension
-------------------------------------------------------------------------------------------------

-change all is (el == null) --> (el == null)
-test EZ.isEl & EZ.isNonElObject


EZ stubs, prototypes and related or core functions --
	shared between DW extension developer toolkit api and EZ javascript libaray:

	stubs:		EZ(), EZ._(), EZ.$(), EZ.css(), EZ.get(), EZ.set() and EZ.val()
	calls to:	EZgetEl(), EZgetStyle(), EZgetValue(), EZsetValue() . . .
				defined in EZbasics.js along with supporting functions

	functions:  is(), isEmpty(), isNone(), isTrueLike(), isFalseLike(),
				isArray(), isArrayLike(), toArray(), toFloat(), toInt(),
				clip(), format(), left(), right(), trim(), matchPlus(), matches() . . .
__________________________________________________________________________________________________*/
/**
 *	EZ.format functions: all functions available (functionality limited until EZformat.js loads)
 *
 *	NOTE: 
 *		EZ.formatDate is defined for backward compatibilty and use by EZ.format.value()
 *		niether is currently updated when EZformat.js is subsequently loaded.
 */
EZ.formatDate = function(date) { return EZ.format.value(date) }
EZ.format = {
	toStringElement: {					//Element.toString default argument: if blank or
			defaultValue: 'brief',		//undefined native: e.g. "[object HTMLSpanElement]"
			defaultAttributes: 'className id name tagName type'
	},									
	//_________________________________________________________________________________________
	options: EZ.defaultFormatOptions,
	date: EZ.formatDate,
	dateTime: EZ.formatDate,
	time: EZ.formatDate,
	//_________________________________________________________________________________________
	seconds: function format_seconds(ms)								   //full functionality
	{
		var seconds = (ms / 1000) + '';
		var formatted = seconds.match(/^(.*\.\d{0,3})?/)[0] 
					 || seconds.match(/^(.*\.\d{0,4})?/)[0]
					 || '0.000';
		return formatted.concat('0000').substr(0,5);
	},
	//_________________________________________________________________________________________	
	/**
	 *	when called with element from right click context menu...
	 *	formats and displays selected elememt in popup window with additional actions / options
	 *
	 *	http://www.mattzeunert.com/2016/02/19/custom-chrome-devtools-object-formatters.html
	//_________________________________________________________________________________________	
	**/
	tag: function ___format_tag(el)
	{
		return Element.toString.prototype.apply(el, [].slice.call(arguments));
	},
	//__________________________________________________________________________________________
	/**
	 *	Super flexible and robust value formating -- blends full functonality from EZ.toString()
	 *	and JSON.plus.stringify() with powerful html Element format capibility and ability to
	 *	include, exclude or extract one or more specified Object and/or Element properties.
	 *
	 *	Collapsably html -and- console.log formats available.
	 *
	 *	See EZ.format.Element() for html element details -- Element.prototype.toString() linked
	 *	with ability to extract html as String, json or Object representation of live html tags.
	 *__________________________________________________________________________________________
	**/
	value: function ___format_value(value, options, callback)
	{
		[callback]
		if (this.isTest)
			void(0);
		
		var args = [].slice.call(arguments);
			
		var maxchars = options;
		if (!isNaN(options))
			options = {maxchars: maxchars};	
		if (options instanceof Object)
			maxchars = options.maxchars;
		else maxchars = 0;
		
		var type = __getType(value);
		if (type.endsWith('()'))		//native fn: Array(), Object(), trim()
			return type;
		// . . . . . . . . . . . . . . . . .
		switch (type)
		{
			case 'null':		return EZ.NULL;
			case 'undefined':	return EZ.UNDEFINED;

			case 'Boolean': 	return (value) ? EZ.TRUE : EZ.FALSE;
			case 'Number':		return isNaN(value)   ? EZ.NAN : __formatNumber();
			case 'String':		return (value === '') ? EZ.BLANK : __formatString();
			case 'Date':		return __formatDate();
			case 'RegExp':		return __formatRegExp();
			case 'Element':		return __formatElement();
			case 'Function':	return __formatFunction();
			default:	 		return __formatObject();								
		}	
		// . . . . . . . . . . . . . . . . .
		//_________________________________________________________________________________________
		function __getType()
		{
			var toStr = Object.prototype.toString.call(value);
			type = toStr.substring(8,toStr.length-1);
	
			if (/(Null|Undefined)/.test(type))
				return type.toLowerCase();
	
			if (type.toLowerCase() == type)				//got "global" for value=window 
				type = value.constructor.name;			//...at one time 
	
			while (value instanceof Object)
			{
				if (typeof(value) == 'function')
					value = value.constructor;
				if (typeof(value) != 'function') break;
				
				var script = Function.prototype.toString.call(value);
				if (!/\{\s*\[native code\]\s*\}/.test(script)) break;
				
				return value.name + '()';		
			}
			return type;
		}
		//_________________________________________________________________________________________
		/**																	
		 *	calls EZ.format.formatObject() when loaded otherwise use native toString() for value
		 *	type -- avoid value.toString() to prevent loop if it contains any EZ.format() call.
		**/
		function __formatObject()											
		{																	  //full functionality
			//-------------------------------------------------------------------------------------
			if (EZ.format.formatObject)	return EZ.format.formatObject.apply(this, args);	
			//-------------------------------------------------------------------------------------
			var str = value.constructor.prototype.toString.call(value)		//limited functionality
			if (maxchars && str > maxchars)		
				return (value instanceof Array) ? '[]' : '{}';			
		}
		//_________________________________________________________________________________________
		function __formatElement()											
		{
			if (!EZ.format.Element 											
			|| args.length == 1 
			|| Object.keys(options).length === 0
			|| (Object.keys(options).length === 1 && options.extract == this.toStringDefault.defaultValue))
				return Element.prototype.toString.call(value);				//limited functionality

			return EZ.format.Element.apply(this, args);						   //full functionality
		}
		//_________________________________________________________________________________________
		function __formatString()					  						   //full functionality
		{
			var str = '';
			var isClipped = false;
			value = value.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, EZ.EOL);
			value = value.trimPlus(EZ.EOL);		//EOL = String.fromCharCode(172);	 __	end of line
												//									|	
			value.substr(0,maxchars || value.length).replace(/(.)/g, function(ch)
			{									//set str using replace
				if (!maxchars || str.length <= maxchars)
				{
					var code = ch.charCodeAt(0);
					if (code < 32 || code > 255)
						ch = '0x' + code.toString(16);
					str += ch;
				}
				else
					isClipped = true;
			});
			if (!str)
				str = EZ.EMPTY;
			
			else if (isClipped)
				str += EZ.MORE;
	
			else if (maxchars && str.length > maxchars)
				str = '"' + EZ.MORE + '"';
	
			else if (!str.startsWith('"'))
				str = '"' + str + '"';
			return str;
		}
		//_________________________________________________________________________________________
		function __formatNumber()											   //full functionality
		{
			var str = value.toString();
			
			if (maxchars && str.length > maxchars)
				str = str.substr(0, maxchars-1) + '...';
			return str;
		}
		//_________________________________________________________________________________________
		function __formatRegExp()											   //full functionality
		{
			var lastIndex = (value.lastIndex ? ':' + value.lastIndex : '');
			var str = '/' + value.source + '/' + value.flags + lastIndex;
			//		+ (value.lastIndex ? ':' + value.lastIndex : '');
			
			if (maxchars && str.length > maxchars)
			{
				//str = '/' + str.substr(0, Math.min(0, maxchars-5)) + '/...';
				//if (maxchars && str.length > maxchars)
					str = '/.../' + lastIndex;
			}
			return str;
		}
		//_________________________________________________________________________________________
		/**																	   legacy EZ.dateTime()												   					
		 *	 used for EZ.format.value(date) even after EZ.format.js loaded		
		 */
		function __formatDate()
		{
			if (value.valueOf().toString() == 'NaN')
				return 'Invalid Date';
		
			var str = ('0'+(value.getMonth()+1).toString()).substr(-2) + '-'
					+ ('0'+value.getDate()).substr(-2) + '-'
					+ value.getFullYear()
		
			var hours = value.getHours() % 12
			var minutes = value.getMinutes();
			var seconds = value.getSeconds();
			var ms = value.getMilliseconds();
		
			if (hours > 0 || minutes > 0 || seconds > 0 || ms > 0)
			{
				if (maxchars && str.length > (maxchars-10))
					str += '...'
		
				else
				{
					if (hours === 0) hours = 12
					str += ' '
						 + ('00'+hours.toString()).substr(-2) + ':'
						 + ('00'+minutes).substr(-2);
		
					if (seconds > 0)
						str += ':' + ('00'+seconds).substr(-2);
		
					if (ms > 0)
						str += '.' + ('000'+ms).substr(-3);
		
					str += (value.getHours() < 12 ? ' AM' : ' PM');
				}
			}
			if (maxchars && str.length > maxchars)
				str = 'Date()';
		
			return str;
		}
		//______________________________________________________________________________________________
		function __formatFunction()													//full functionality
		{
			var pattern = /function\s*(\w*)\s*\(([\s\S]*?)\)[^{]*{\s*([\s\S]*)}/;
			var results = Function.prototype.toString.call(value).match(pattern);
			if (!results)
				return 'function ' + (value.name || '') + '...';
	
			var name = value.name || results[1] || options.key || '';
			if (name.startsWith('bound '))
				return value.name.substr(6) + '()'
			
			var args = (results[2] || '').replace(/\s*\/\*[\s\S]*?\*\/\s*/g, '');
			
			var lines = EZ.getLineCount(results[3] || '');
			lines = (lines) ? (lines + ' lines').wrap('{}')
				  : (results[3].includes('native')) ? ''
				  : '...'.wrap('{}');
	
			var str = ('function ' + name).trim() + '(' + args + ') ' + lines;
			//var str = 'function ' + name + '(' + args + ')\n'
			//		+ '{ lines: ' + (lines.concat('\n').match(/\n/).length-1) + ' }'
	
			if (maxchars)
			{
				if (str.length > maxchars)
					str = name + '(' + args + ')'
		
				if (str.length > maxchars)
					str = name + '(...)' + lines;
		
				if (str.length > maxchars)
					str = name + '(...)';
			}
			return str.trim();
		}
	},
	//______________________________________________________________________________________________
	$:"last key DW collapse hack"
}
/*--------------------------------------------------------------------------------------------------
constructor for rtnValue
--------------------------------------------------------------------------------------------------*/
EZ.rtnValue = function EZrtnValue(isTestValue)
{
	if ( !(this instanceof arguments.callee))	//NOT called as constructor...
	{
		if (!this._rtnValue)					//if global reference before created
			this._rtnValue = new EZ.jsonPlus.rtnValue();
		return this._rtnValue;
	}
	if (isTestValue)
		EZ.test.setTestValue.call(arguments.callee.caller, 'rtnValue', this);
	
	var data = this._data = {};
	data.info = [];
	data.message = [];
	data.details = [];
	data.json = '';
	data.lists = {}					//escaped_values, escaped_functions, constructor
	//______________________________________________________________________________________________
	/**
	 *	return status of clone	
	 *		=true passed validation =false failed validation
	 *		="na" if not validated  =undefined if exception 
	 */
	this.isOk = function()
	{
		var data = this._data;
		return data.success;		
	}
	this.setOk = function()
	{
		var data = this.getData();
		return data.success = true;
	}
	this.setFail = function()
	{
		var data = this.getData();
		return data.success = false;
	}
	this.getData = function(key, defaultValue)
	{										//do not create Object if defaultValue
		var data = this._data;				//...supplied and null or undefined
		var value = data;
		if (key)
		{
			if (key in value)
				value = value[key];
			else if (arguments.length < 2 || defaultValue != null)
				value = value[key] = (defaultValue || {});
			else
				value = defaultValue;
		}
		return value;
	}
	/**
	 *	cleans up rtnValue -- called after cloning complete for all levels
	 */
	this.save = function()				
	{
		var data = this._data;
		Object.keys(data).forEach(function(key)
		{							
			var value = data[key];
			if (!value								//remove empty data values
			|| (value instanceof Object && Object.keys(value).length === 0))
				delete data[key]
			
			else if (key == 'lists')
			{
				for (var i in value)
				{
					if (value[i] instanceof Object && value[i].length === undefined)
					{								//mergedMessages list
						value[i] = EZ.mergeMessages(value[i]).replace(/ x 1(,|$)/g, '$1');
					}
				}
			}
		});
		data.success = this.isOk();
	}
									//validate_details, changed_values, deleted_values
	//______________________________________________________________________________________
	/**
	 *	info
	 */
	this.addInfo = function(msg)
	{
		var info = this.getData('info');
		(EZ.isArray(msg)) ? info = info.concat(msg).remove()
						  : info.push( (msg+'').trim() );
	}
	this.getInfo = function()
	{
		return  this.getData('info');
	}
	//______________________________________________________________________________________
	/**
	 *	add, get message
	 */
	this.addMessage = function(msg)
	{
		var message = this.getData('message', []);
		if (EZ.isArray(msg))
			msg = msg.join('\n').trim();
		
		//msg = msg || '...message NA...'
		if (!msg)
			void(0);
		else
			message.push(msg);
		
		return this.getMessageObject();		//return message obj as convenience -- not clone
	}
	this.getMessageString = function()
	{
		return this.getMessage().join('\n').trim();
	}
	this.getMessageObject = function()		//create if necessary
	{
		return this.getData('message', []);
	}
	this.getMessage = function()
	{
		var message = this.getData('message', null) || [];
		if (message.includes(''))
			return message.remove();		//remove blank items -- return clone
		return message.slice();
	}
	//______________________________________________________________________________________
	/**
	 *	set, get values
	 */
	this.set = function(key, value)
	{
		var data = this._data;	
		data.values = data.values || {};
		data.values[key] = value;
		return this.get(key);
	}
	this.get = function(key, defaultValue)
	{
		var data = this._data;	
		var values = data.values || {};
		return (key in values) ? values[key]
			 : (arguments.length > 1) ? defaultValue
			 : '';
	}
	//______________________________________________________________________________________
	/**
	 *	add, get details
	 */
	this.addDetails = function(msg)
	{
		msg = msg || '...message NA...'
		var data = this._data;	
		data.details = EZ.toArray(data.details);		
		(EZ.isArray(msg)) ? data.details = data.details.concat(msg)
						  :	data.details.push(msg);
	}
	this.getDetails = function()
	{
		var data = this._data;	
		return EZ.toArray(data.details).join('\n').trim();
	}
	//______________________________________________________________________________________
	/**
	 *	lists: addListItem, mergeListItem, getList, haveList
	 */
	this.mergeListItem = function(name, msg, dotName)
	{
		if (arguments.length < 2)
			return;
		
		var lists = this.getData('lists');
		var list = lists[name] = (lists[name] || {});
		
		if (EZ.isArray(dotName))
		{
			dotName = dotName.join('.');
			if (!dotName.startsWith('$'))
				dotName = '$' + dotName;
		}
		EZ.mergeMessages(list, msg, dotName)
		return list;
	}
	this.addListItem = function(name, value, dotName)
	{
		switch (arguments.length)
		{
			case 2:
			{
				var data = this.getData();
				var list = data.lists[name] = (data.lists[name] || [])
				
				if (value instanceof Array)
					data.lists[name] = list.concat(value);
				else
					list.push(value);
				return list;
			}
			case 3: return this.mergeListItem(name, value, dotName)
		}
	}
	this.getList = function(name)
	{
		var list = this.getData('lists')[name];
		return (!list) ? []
			 : (list instanceof Array) ? list
			 : EZ.mergeMessages(list).replace(/ x 1(,|$)/g, '$1');
		/*
		var data = this._data;	
		var lists = data.lists || {};
		return lists[name] || [];
		*/
	}		
	this.haveList = function(name)
	{
		var data = this._data;	
		var lists = data.lists || {};
		return Boolean(lists[name]);
	}
}
/*--------------------------------------------------------------------------------------------------
put here while updating
TODO:
	showDiff - always 1st diff
	lists:
		circular, excluded, ignored: script/constructor, keysDiff
		changed, added, deleted
	ignore: script
	full html tests
	fn equal faults
	EZ.options() case-insensitive, arrays
--------------------------------------------------------------------------------------------------*/
EZ.isEqual = (function _____EZequals_____()
{
	var defaultOptions = {	
		rtnValue: false,	//=true return rtnValue Object otherwise return true or false
		
		keys: '',			//="sameorder" if Object keys must be in same order
							//TODO: seems to break obj with keys in same order -- SEE:
							//	    working code in EZtest_assistant.js::EZ.test.run()
		
		exclude: [],
		include: [],
		ignore: '',			//"constructor" to compare Object properties only
							//"script"
							//"keysOrder", "keys", "order"
							//can also containt excluded keys not overridden by includes
		
		excludedList: '.',	//=true show all =false no list, ="top" embedded excluded keys not listed


		strict:['String'],	//types requiring exact equality -- keep original rules
							//Function, RegExp, Date, Object	TODO: may not be complete
		showDiff: false,
		neq: '-->',			//char displyed between unequal values -- e.g. 6 !== 5
		console: false,
		name: '',
		maxitems:99, 
		maxchars:30,					
		html: false,		//=true use EZ.format.Element() to compare html elements
							//TODO: Object to override default EZ.format.Element() options
		
		legacyOptions: [],

		defaults: {string:'name', number:'maxchars', boolean:'showDiff'}
	}
	//______________________________________________________________________________________________
	/**
	 *
	 */
	EZ.equals = function EZequals(x, y, options)
	{										
		var equals = {};								// circular Object support
		var processed = {x:[], y:[]};					//		''			''
	
		var showDiff = options;	//showDiff option if not Object -or- any true value when legacy
		//===============================================================================================
		// use legacy if specified, loaded, niether x or y is circular and no new
		// new options are specified
		//===============================================================================================
		if (EZ.equals.legacy 
		&& ((options instanceof Object && options.legacy) || EZ.isLegacy()))
		{
			var msg = EZ.equals.legacy.messages = (EZ.equals.legacy.messages || []);
			
			if (showDiff instanceof Object)
			{
				var keys = Object.keys(options).remove('legacy');
				if (keys.length)
					msg['NOT allowed with options'] = keys.join(', ');
			}
			if (EZ.isObjectCircular(x))
				msg['1st arg circular'] = EZ.isObjectCircular.message;
			
			if (EZ.isObjectCircular(y))
				msg['2nd arg circular'] = EZ.isObjectCircular.message;
				
			if (msg.length === 0)				
				return EZ.equals.legacy(x, y, showDiff);
				
			//EZ.equals.legacy.messages = msg.concat(EZ.equals.legacy.messages || []).slice(0,10);
			//EZ.oops('EZ.equals.legacy() NOT used', msg);		
		}
		//===============================================================================================
		if (this && this instanceof EZ.equals)
			defaultOptions = EZ.options.getDefaults.call(defaultOptions, 'equals', 'log');

		options = EZ.options.call(defaultOptions, showDiff);
		options.exclude = EZ.toArray(options.exclude, ', ');
		options.include = EZ.toArray(options.include, ', ');
		options.ignore = EZ.toArray(options.ignore, ', ');
		
		if (options.ignore.includes('objectType'))				
			options.ignore.push('constructor');			//backward compatibility	
		
		if (showDiff == 99)
			options.console = true;
		
		if (options.name || options.console 
		|| (showDiff != null && typeof(showDiff) != 'object'))
			options.showDiff = true;
		if (options.showDiff && options.excludedList == '.')
			options.excludedList = true;				//default if not specified
		
		if (options.track) EZ.track();
		
		//-------------------------------------------------------------------------
		// setup for showDiff
		//-------------------------------------------------------------------------		
		var rtnValue = new EZ.returnValue(this, options);
		var data = rtnValue.getData();

		var dotNamePlus = new EZ.dotName(options.dotName || '');
		dotNamePlus.setOptions(options);	
		
		var dotName = [EZ.collapse(options.dotName || ['$'])]
		var dotNameDisplay = dotName.slice();
		
		delete EZ.equals.log;
		delete EZ.equals.formattedLog;
		
		var	showDiff_heading = '';
		if (options.showDiff)
		{
			var names = EZ.toArray(options.name);
			/*
			if (names.length === 0)
				names = [x['~name'] || '1st', y['~name'] || '2nd'];
			if (names[0] == x['~name'] && names[0] == y['~name'])
				options.ignore.push('.~name');
			*/
			showDiff_heading = (dotName == '$') ? '$ ' : '';
			var keyFill = ' '.dup(dotName[0].length+1)
			void(keyFill)
			
			var typeX = _getType(x, {types:true}).wrap('[]');		
			var typeY = _getType(y, {types:true}).wrap('[]');	
			if (typeX == typeY) 
			{
				typeY = '';
				if (names.length == 1)
					names[1] = 'CHANGES';
			}
			else if (names.length == 1)
				names[1] = '';
				
			showDiff_heading += names[0] + typeX + ' \t \t ' 
							  + '.'.dup(options.neq.length) + ' '
			//				  + '-'.dup(options.neq.length-1) + '> '
			//				  + options.neq + ' '
							  + names[1] + ' ' + typeY;
		}

		//=========================================================================
		var deepCompare = (options.showDiff || options.excludedList);
		data.success = ___isEqualObjects(x, y, 0);
		//=========================================================================
		if (!rtnValue.haveList('showDiff') && !data.success)
			rtnValue.addListItem('showDiff', 'differences NA');
		var log = rtnValue.getList('showDiff');
		if (log && log.length)
		{
			EZ.isEqual.log = EZ.equals.log = log;
			if (log.length > (options.maxitems+1) && options.maxitems)
			{											//only maxitems in formattedLog
				log = log.slice(0, options.maxitems + 1);
				log.push(EZ.MORE);
			}
			rtnValue.addListItem('formattedLog', log.format());
		}
		var excludedList = dotNamePlus.getList('excluded');
		rtnValue.addListItem('excluded', excludedList);
		if (excludedList.length)
		{
			var s = excludedList.length == 1 ? ' un-equal property' : ' un-equal properties';
			rtnValue.addListItem('formattedLog', excludedList.length + s + ' excluded');
		}
		data.formattedLog = rtnValue.getList('formattedLog');
		if (data.formattedLog.length === 0)
			data.formattedLog = '';
		else if (options.console)
			console.log(data.formattedLog.join('\n'));
		
		EZ.equals.formattedLog = EZ.isEqual.formattedLog = data.formattedLog;

		EZ.equals.rtnValue = EZ.isEqual.rtnValue = rtnValue;
		//EZ.test.setTestValue('rtnValue', rtnValue);
		//==================================================
		return (options.rtnValue) ? rtnValue : data.success;
		//==================================================

		//__________________________________________________________________________________________
		/**
		 *	MEAT: recursively called for each embedded or nested object not previously processed.
		**/
		function ___isEqualObjects(x, y, depth, isExcluded)
		{
			var success = false;
			var loggedError = false;			
			do
			{
				if (x === null || x === undefined || y === null || y === undefined)
				{
					success = (x === y); 							//not both null nor undefined
					break;
				}
				if (depth === 0 									//not both same top constructor
				&& !options.ignore.includes('constructor') && x.constructor !== y.constructor)
				{
					loggedError = _equalsLog();
					if (loggedError && !deepCompare) break;
				}
				if (typeof(x) == 'number' && isNaN(x) && isNaN(y))
					return true;									//required because NaN === NaN is false		
																	
				if (x instanceof Function)							//========== Function ==========\\
				{													
					if (y instanceof Object === false)				
						loggedError = _equalsLog();

					if (!options.ignore.includes('constructor'))
					{
						if ((EZ.isNative(x) || EZ.isNative(y)) && x !== y)
							loggedError = _equalsLog();
							
						if (x.name !== y.name)						
							loggedError = _equalsLog('name');
						else
						{
							var xScript = Function.prototype.toString.call(x).trim();
							var yScript = Function.prototype.toString.call(y).trim();
							if (EZ.commentStripper)
							{
								var cs = new EZ.commentStripper();
								xScript = cs.strip(xScript, true);
								yScript = cs.strip(yScript, true);
							}
							if (xScript !== yScript)
								loggedError = _equalsLog('script');
						}
					}
					if (loggedError && !deepCompare) break;			//bail if error and not deepCompare
				}													//...otherwise fall-thru to compare properties
																	
				if (x instanceof RegExp)							//========== RegExp: ==========\\
				{													
					if (x.source != y.source 						//check source, flags and lastIndex properties
					|| x.flags != y.flags 
					|| x.lastIndex != y.lastIndex)
						break;
					if (options.strict.indexOf(_getType(x)) == -1)
						return true;								//strict: x !== y checked below
				}
		
				//==================================================================================
				// strict
				// if they are functions, they should exactly refer to same one (because of closures)
				// no two different function are equal really, they capture their context variables
				// so even if they have same toString(), they won't have same functionality
		
				// if they are regexps, they should exactly refer to same one
				// (it is hard to better equality check on current ES)
		
				if (x !== y && options.strict.indexOf(_getType(x)) != -1)
					break;
				//==================================================================================
		
				if (x === y 											//quick check...
				|| (Object.prototype.valueOf.call(x) === Object.prototype.valueOf.call(y)))
					return true;										//...both same value or object
		
				if (x instanceof Array && !options.showDiff)			//========== Array: ==========\\
				{
					if (x.length !== y.length)							//must be same length
						break;
				}
		
				if (x instanceof Date)									//========== Date: ==========\\
				{
					if (y instanceof Date === false)					//TODO: needs test -- log msg could be better
						break;
					if (x.getTime() != y.getTime() && !isNaN(x) && !isNaN(x))
						break;											//different dates
					else
						return true;									// TODO:same owner properties (e.g. EZ.date) ??
				}
				
				// not Object: if they are strictly equal, they both need to be object at least
				if (!(x instanceof Object) || !(y instanceof Object))
					break;
																		//check if same Object type
				if (depth === 0 && !options.ignore.includes('constructor') && _getType(x) != _getType(y))
				{
					loggedError = _equalsLog();
					if (!deepCompare) break;							//bail if not deep
				}
				//==================================================================================
				// HTML elements
				//==================================================================================
				if (options.html && x instanceof Element)				
				{														//TODO: unknown scenarios hangs perhaps
					var htmlOpts = {									//		when called from cloneObject
						format:'object', 
						extract:'all', 									//revisit after EZ.format.Element matures
						formatter:'none'
					}
					x = EZ.format.Element(x, htmlOpts);					//convert to Object
					y = EZ.format.Element(y, htmlOpts);					
				}
		
				//==================================================================================
				// Object excluded keys
				//==================================================================================
				var keysX = Object.keys(x);								
				var keysY = Object.keys(y);				
				var keys = keysX.concat(keysY).removeDups();
				/*	dropbox > EZ > ___DEAD_CODE___ > EZ.2017-01-24. =====EZequals dead code===== */
				
var skipList = dotNamePlus.getSkipList(x,y);
				if (options.keys == 'sameorder' 
				&& keysX.extract(skipList).join('.') != keysY.extract(skipList).join('.'))
				{
					msg = _dotNameKey() + ' *keys diff order*';
					loggedError = _equalsLog(_formatKeys(keysX, 6), _formatKeys(keysY, 6), msg);
					if (!deepCompare) break;
					//success = false;
					//break;
				}
				keys.sortPlus();
		
				//==================================================================================
				// object properties equality check
				//==================================================================================
				success = true;
				for (var i=0; i<keys.length; i++)				//for every key until false returned . . .
				{												//...or showDiff limit not reached
					var key = keys[i].trim();
					dotName.push(key === '' ? '""' : key);
					dotNameDisplay.push(_dotNameDisplayFormat(key));
isExcluded = dotNamePlus.push(key)
					
					var xVal = (key in x) ? x[key] : String.fromCharCode(0) + 'added';
					var yVal = (key in y) ? y[key] : String.fromCharCode(0) + 'deleted';
					
					var isEqual = true;							//assume equal until found diff
					do
					{
						if (!(x[key] instanceof Object))		//if x property NOT Object. . .
						{										//...do simple recursive compare
							isEqual = ___isEqualObjects(xVal, yVal, depth+1, isExcluded);
							break;
						}
						if (x[key] == y[key]) 					//equal if same Object
							break;
						
						var xIdx = processed.x.indexOf(xVal);
						var yIdx = processed.y.indexOf(yVal);
						
						if (xIdx == -1)
						{			
							xIdx = processed.x.push(xVal) - 1;	
							equals[xIdx]  = [];
						}
						
						if (yIdx == -1)
						{
							yIdx = processed.y.push(yVal) - 1;	
							equals[xIdx][yIdx] = undefined;		//only allow 1 compare of same Objects
						}										//...prevents circular infinite loop
					
						if (equals[xIdx][yIdx] !== undefined)
						{
							isEqual = equals[xIdx][yIdx] = true;
							break;
						}
						else		
						{
							equals[xIdx][yIdx] = null;
							//-------------------------------------------
							isEqual = ___isEqualObjects(xVal, yVal, depth+1, isExcluded);
							//-------------------------------------------
							equals[xIdx][yIdx] = isEqual;
						}
					}
					while (false)
					dotName.pop();
					dotNameDisplay.pop();

isEqual = dotNamePlus.pop(isEqual)
					if (!isEqual)
					{
						success = false;
						if (!deepCompare) break;
					}
					
				}
				return success && !loggedError;				//errors already reported for Objects
			}
			while (false)

			
			if (!success && !loggedError && !isExcluded && options.showDiff)
				_equalsLog();								//log non-Object diff
			//======================
			return success;
			//======================
			//________________________________________________________________________________________
			/**
			 *
				if (options.formatter == 'type')					//used by EZ.equals() for showDiff log
				{												
					if (EZ.getType)									//pseudo type if EZ.getType() loaded
						type = EZ.getType.call(value, true);		//...e.g. [ArrayLike], [ObjectLike]						
					return '[' + type + ']';
				}
			 */
			function _equalsLog(keysX, keysY, msg)
			{
				if (!options.showDiff) return;
		
				if (!rtnValue.haveList('showDiff'))				//add heading if 1st difference
					rtnValue.addListItem('showDiff', showDiff_heading);

				if (!msg)
				{
					var key = _dotNameKey();
					if (keysX)
						key += '.' + keysX;
					msg = key ? key + ' ' : '';					//key prefix
					
					var fmt_X = '';
				//	var fmt_X = _formatValue(x);				//x value
					var fmt_Y = _formatValue(y);
					if (_getType(x) == _getType(y) 						
					|| depth > 0 || !(x instanceof Object))
						fmt_X = _formatValue(x);				//x value
		
					if (fmt_X === fmt_Y)						//clutter e.g.
						return;									//[Object] !== [Object]
					
					else if (key.length < 99)
						msg += ' \t ' + fmt_X
					else 
					{
						rtnValue.addListItem('showDiff', key + ':');
						msg = ' '.dup( dotName[0].length+2 ) + fmt_X;
					}
					
					msg += ' \t ' + options.neq + ' ' 
						 + fmt_Y;								//y value
					
					rtnValue.addListItem('changed',key);
				}
				
				if (msg != '-')					
					rtnValue.addListItem('showDiff', msg);
				
				if (keysX instanceof Array && keysY instanceof Array)
				{
					var lines = [];
					for (var i=0; i<Math.max(keysX.length, keysY.length); i++)
					{
						lines.push(keysX[i] + ' \t ... ' + keysY[i])
					}
					rtnValue.addListItem('showDiff', lines);
				}
				return true;
			}
			//________________________________________________________________________________________
			/**
			 *
			 */
			function _dotNameDisplayFormat(key)
			{
				//var ch = ["['", "']"];
				var ch = ["[", "]"];				//less clutter
				
				var dispKey = (!isNaN(key)) 				  ? '[' + key + ']'
							: (/^[A-Z_$][\w_$]*$/i.test(key)) ? '.' + key
							: key.wrap(ch[0],ch[1]);
				return dispKey;
			}
			//________________________________________________________________________________________
			/**
			 *
			 */
			function _dotNameKey()
			{
			   	return dotNameDisplay.join('');
			}
			//________________________________________________________________________________________
			/**
			 *
			 */
			function _formatValue(value)
			{															
				var fmt = '';
				if (typeof(value) == 'string' && value.charCodeAt(0) === 0)
					fmt = value.substr(1);								//added -or- deleted
				
				else
				{														//use key for anonymous fn name
					var key = dotNameDisplay[dotNameDisplay.length-1];	//...if valid var name
					key = (key && key.startsWith('.')) ? key.substr(1) : ''
					
					var fmtOptions = {maxchars: options.maxchars, key: key};	//objects:'type' ??
					
					fmt = EZ.format.value(value, fmtOptions);		//otherwise short format
				}
				return fmt;
			}
			//________________________________________________________________________________________
			/**
				[0]: "1st [ObjectLike]    ... 2nd [Array] "
				[1]: " .a *keys do not match*"
				[2]: "  + .more           ... + [2]       "
											  +  .a
				
				[1]: "[1] *keys do not match*"
				[2]: "  + .more"          ... + [2]       "
			 *
			 */
			function _formatKeys(keys, max)
			{
				if (keys.length === 0) return '';
				keys = ('"' + keys.join('"@???@"') + '"').split('@???@');
				
				if (keys.length > (max + 1))
				{
					var extra = '[+' + (keys.length-max) + ' more]';
					keys = keys.slice(0,max+1);
					keys.push(extra);
					//return keys.join(': ');
				}
				return keys;
			}
		}
		//________________________________________________________________________________________
		/**
		 *
		**/
		function _getType(value)
		{
			var type = Object.prototype.toString.call(value);
			type = type.substring(8,type.length-1)
		
			if (type.toLowerCase() == type)
				type = value.constructor.name;
		
			else if (/(Null|Undefined)/.test(type))
				type = type.toLowerCase();
			return type
		}
	}
	//==============
	return EZ.equals;
	//==============
})();
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.equals.test = function EZequals_test()
{
	var x, y, o, obj, note = '', ex, exfn, notefn, setup, showDiff, formattedLog;
	[x, y, o, obj, note, ex, exfn, notefn, setup, showDiff, formattedLog];

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//============================================================================================
	var exfn = function(testrun)			//show available return details
	{										
		var msg;
		var results = testrun.getResults();
		var rtnValue = testrun.getReturnValue();
		var opts = testrun.getOptions();
		
		void(msg, results, rtnValue)
		
		//if (testrun.getResults() === false)	
		//{									//TODO: only 1st diff if options.showDiff is not true
			var log;
			if (!opts.showDiff)
				testrun.appendNote('showDiff not specified');
			
			else if (log = rtnValue.getList('formattedLog'))
			{
				testrun.setResultsArgument('3rd', log, 'showDiff log');
				//var name = testrun.getArgumentCiteName('options')
				//testrun.appendNote('return value for 3rd arg set to "showDiff log"')
			}
			else if (opts.showDiff)
				testrun.appendNote('showDiff log not available', 'alert');
		//}
		if (rtnValue.haveList('circular'))		
		{									//circular details
		}
		
		if (rtnValue.haveList('ignored'))			
		{									//ignore details
		}
		
		if (log = rtnValue.getList('excluded'))
			testrun.setResultsArgument('4th', log, 'excludedList');
		else
			testrun.appendNote('excludedList not available');
	}
	//============================================================================================
	var notefn = function(testrun, phase)	//NOT USED
	{										//set options.rtnValue=true if options argument and
		if (phase == 'prerun')				//...options.rtnValue is undefined
		{
			var opts = testrun.getArgument('options');
			if (opts instanceof Object && opts.rtnValue === undefined)
			{
				opts = EZ.options.call( opts, {rtnValue:true} );
				testrun.setArgument('options', opts);
				testrun.appendNote('options.rtnValue set true')
			}
		}
	}
	void(notefn)
	//============================================================================================
	function setup(exArg)					//set test options {ex:ex, note:note}
	{										//...if ex undefined set true
		var opts = {}
		opts.ex = (exArg !== undefined) ? exArg
				: (ex !== undefined) ? ex 
				: true;
		opts.note = note || '';
		
		ex = undefined;
		note = '';

		if (EZ.test.isRun())				//test not skipped
			EZ.test.options(opts)
	}
	//============================================================================================
	EZ.test.settings( {exfn:exfn} );
	var showDiff = {showDiff:true}
	//============================================================================================

	//______________________________________________________________________________
	EZ.test.settings( {group:'exclude tests:'} );

	x = {'a':1, b:2}
	y = {'a':0, b:''}	
	setup(false);
	EZ.test.run(x, y, {showDiff:true, exclude:'b'})	
	

	x = {'a':1, b:2}
	y = {'a':0, b:''}	
	setup(false);
	EZ.test.run(x, y, {showDiff:true, exclude:'.b', dotName:'mru'})	
	

	//______________________________________________________________________________
	EZ.test.settings( {group:'showDiff tests:'} );

	x = {'a':1, b:2}
	y = {'a':0, b:''}	
	note = 'easy test'
	setup(false);
	EZ.test.run(x, y, showDiff)	
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'no showDiff option'
	setup(false);
	EZ.test.run(x, y, {})
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'no rtnValue'
	setup(false);
	EZ.test.run(x, y)
}
/*---------------------------------------------------------------------------------------------
EZ.removeItems(array,[fromIndex][,toIndex] | [value, value,...], [array-of-values])

returns new Array with specified items removed -- original Array is unchanged.

If only array argument, remove blank, null or undefined Array items.
If second argument is not number, remove all items matching value of any argument after array.
If second argument is ArrayLike object, remove any item matching any of those Array items.

When fromIndex is number, remove slice of elements starting at fromIndex through toIndex if
specified or end of Array if not -- splice() functionality w/o changing original Array and
supports ArrayLike Objects.

NOTE: EZ.toArray() calls to eliminate blank items when converting delimited strings to Array.
---------------------------------------------------------------------------------------------*/
EZ.removeItems = function EZremoveItems(array, fromIndex, toIndex)
{
	if (EZ.test.capture()) {return EZ.test.capture(this)} else if (EZ.test.debug()) debugger;

	if (!EZ.isArray(array)) return array;	//TODO: support ArrayLike

	var rtnArray = [].slice.call(array);
	var values = fromIndex;

	//----- Determine if removing values or slice
	if (arguments.length == 1)
		values = ['', null, undefined];
	else if (values == null)
		values = [values];

	var isRemoveValues = EZ.isArrayLike(values) || values.constructor == RegExp;
	if (!isRemoveValues)
	{
		// bail if values is non-ArrayLike object or function other than RegExp
		//if ('object function'.indexOf(typeof values) != -1) return array;

		// remove Array items specified by arguments
		if (typeof(values) == 'boolean'
		|| isNaN(values) || values == null || !values.toString())
		{
			values = [].slice.call(arguments,1);
			isRemoveValues = true;
		}
	}

	//----- return copy of this Array w/o items containing any specified values
	if (isRemoveValues)
	{
		rtnArray = [];
		for (var i=0; i<array.length; i++)
		{
			var item = array[i];
			if (values.constructor == RegExp)
			{
				if (typeof(item) == 'string' && values.test(item)) continue;
			}
			else if (values.indexOf(item) != -1) continue;

			rtnArray.push(item);
		}
	}
	//----- return Array with fromIndex, toIndex slice removed
	else
	{
		fromIndex = Math.max(0, fromIndex || 0);
		toIndex = Math.min(array.length, (toIndex || array.length-1) + 1);
		rtnArray.splice(fromIndex, toIndex-fromIndex);
	}
	return rtnArray;
}
//_____________________________________________________________________________________________
EZ.removeItems.test = function()
{
	var values  			=['', null, undefined, true, false, 'a', 'b'];
	var values_wo_default 	=[                     true, false, 'a', 'b'];
	var values_wo_blank	 	=[    null, undefined, true, false, 'a', 'b'];
	var values_wo_null		=['',       undefined, true, false, 'a', 'b'];
	var values_wo_undefined	=['', null,            true, false, 'a', 'b'];
	var values_wo_true		=['', null, undefined,       false, 'a', 'b'];
	var values_wo_true_false=['', null, undefined,              'a', 'b'];
	var values_wo_false		=['', null, undefined, true,        'a', 'b'];
	var values_wo_a_b 		=['', null, undefined, true, false          ];
	var values_wo_b	 		=['', null, undefined, true, false, 'a'     ];

	var note = 'remove values';
	EZ.test.run(values, 				{EZ: {ex:values_wo_default		,note:note}})
	EZ.test.run(values, '',				{EZ: {ex:values_wo_blank		,note:note}})
	EZ.test.run(values, null,			{EZ: {ex:values_wo_null			,note:note}})
	EZ.test.run(values, undefined,		{EZ: {ex:values_wo_undefined	,note:note}})
	EZ.test.run(values, true,			{EZ: {ex:values_wo_true			,note:note}})
	EZ.test.run(values, false,			{EZ: {ex:values_wo_false		,note:note}})

	EZ.test.run(values, 'b',			{EZ: {ex:values_wo_b			,note:note}})
	EZ.test.run(values, 'a', 'b', 1,	{EZ: {ex:values_wo_a_b			,note:note}})
	EZ.test.run(values, ['a', 'b'],		{EZ: {ex:values_wo_a_b			,note:note}})
	EZ.test.run(values, true, false,	{EZ: {ex:values_wo_true_false	,note:note}})
	EZ.test.run(values, [true, false],	{EZ: {ex:values_wo_true_false	,note:note}})

	EZ.test.run(values, /[ab]/,			{EZ: {ex:values_wo_a_b	,note:note}})
	EZ.test.run(values, /(a|b)/,		{EZ: {ex:values_wo_a_b	,note:note}})

	var note = 'remove slice';
	var array = [0,1,2,3];

	EZ.test.run(array, -1,		{EZ: {ex:[],	note:note	}})
	EZ.test.run(array, 1,		{EZ: {ex:[0],	note:note 	}})
	EZ.test.run(array, 1, 99,	{EZ: {ex:[0], 	note:note	}})
	EZ.test.run(array, 2, 3,	{EZ: {ex:[0,1], note:note	}})
	EZ.test.run(array, 0,		{EZ: {ex:[], ctx:array,	}})
}
/*--------------------------------------------------------------------------------------------------
EZ.toArrayLike(arg, delimiter)
--------------------------------------------------------------------------------------------------*/
EZ.toArrayLike = function EZtoArrayLike(arg)
{
	return EZ.toArray(arg, false);
}
/*--------------------------------------------------------------------------------------------------
EZ.toArray(arg, delimiter)

Always returns Array or ArrayLike Object fron any type of variable or object (see RETURNS)

If arg is String and delimiter is specified (see options below), create Array from string.
For null, undefined or empty string, return empty Array -- otherwise return single dimension
Array containing variable or non-ArrayLike Object -- NOTE: html collection is ArrayLike

ARGUMENTS:
	arg			any type of variable to return as Array or ArrayLike Object with length

	delimiter	one or more of the following -- use Array for multiple options
	(options)	true	convert comma delimited string to array
				false	do not clone ArrayLike to real Array -- return "as is"
				string	converted to regex
				regex	used as delimiter to split string arg -- leading / trailing
						spaces ignored except...
						TODO: regex with space and another char
				object	1 or more of the following:
						
						delimiter:	one of the above options
						types: 		=false 	converts all values to String via split()
									=true	(default) retain type of delimited values for:
												number, boolean
												TODO: ReqExp, Date, json
RETURNS:
	new empty Array 	for null, undefined or empty string
	"as is" Array 		for real Array -and- ArrayLike with false option e.g. html collection
	new cloned Array 	for ArrarLike unless false option specified then as is
	otherwise new single element Array containing arg variable or non-ArrayLike object

NOTES:
	was originally simplified clone of EASY.js::EZ.syncArrays()
	code is now consice but functionality is significantly enhanced from original clone
	MAJOR INTERNAL WORK-HORSE for DW compatible EZcoder version
-------------------------------------------------------------------------------------------------------*/
EZ.toArray = function EZtoArray(arg, delimiter /* options */)
{
	if (EZ.test.capture()) {return EZ.test.capture(this)} else if (EZ.test.debug()) debugger;

	if (arg === '' || arg == null) return [];
	if (EZ.isArray(arg)) return arg;

	if (EZ.isArrayLike(arg))
	{
		if (arg.length > 0 && delimiter === false) 
			return arg;
		return [].slice.call(arg);		//TODO: drops named Array properties
	}
	
	var options = {};
	if (!delimiter || EZ.isArray(delimiter)
	|| typeof(delimiter) != 'object' || delimiter instanceof RegExp)
	{									//as of 02-25-2017: only set by EZ.toArray.test()
		options = EZ.toArray.options || EZ.defaultOptions.toArray || {};
	}
	else
	{
		options.types = ('types' in delimiter) ? delimiter.types : true;
		delimiter = options.delimiter = delimiter.delimiter;
	}
	
	//----- if string with delimiter option, create Array if delimiter found
	if (typeof(arg) == 'string' && (delimiter || delimiter === '0'))
	{
		if (delimiter.constructor != RegExp)
		{								//02-25-2017: all legacy calls using true changed to ','
										//TODO: change to ', ' or ' ,'
			if (delimiter === true) delimiter = ',';	

			// escape ^ [ or ] to treat as literal inside [...]
			var pattern = delimiter.replace(/([\^\]\[])/g, '\\$1');

			// need pattern of form: \s*[<delimiter(s)>]+\s*
			delimiter = new RegExp('\\s*[' + pattern + ']\\s*');
		}
		//=================================================================================
		var items = arg.trim().split(delimiter);
		//=================================================================================
		if (!options.types)
			return EZ.removeItems(items);			//return Array of delimited values
		
		//_________________________________________________________________________________
		/**
		 *	determine if delimited value represents value other than a String
		 */
		var _getValue = function(value)		
		{
			try
			{
				if (value == 'null')
					return null;
				
				var results = value.match(/xxx/, '');
				if (results)
				{
					var date = new Date(results[1]);
					return isNaN(date) ? value : date;		//string
				}
				var type = eval('typeof ' + value)
				if (type ==	'string')
					return value;
				return eval(value);
			}
			catch (e)
			{
				return value;			//keep as string
			}
		}
		//=================================================================================
		items.forEach(function(value, idx)
		{
			items[idx] = _getValue(value);
		});
		return EZ.removeItems(items);		
	}
	return [arg];
}
//___________________________________________________________________________________________________
EZ.toArray.test = function()
{
	//var divsClone = EZ.cloneNodes(t_divs,false);
	//EZ.test.run(t_divs, false 		, {EZ: {ex:divsClone  }});

	//=========================================
	EZ.defaultOptions.toArray = {types: false};
	//=========================================

	EZ.test.run(''					, {EZ: {ex:[]  				}})
	EZ.test.run('testFolder', ';'	, {EZ: {ex:['testFolder']  	}})
	EZ.test.run('test;For ; a', ';'	, {EZ: {ex:['test', 'For', 'a']  }})
	EZ.test.run(null				, {EZ: {ex:[]  				}})
	EZ.test.run(true				, {EZ: {ex:[true]  			}})
	EZ.test.run(false				, {EZ: {ex:[false]  		}})
	EZ.test.run(1					, {EZ: {ex:[1] 				}})
	EZ.test.run([1,2,3]				, {EZ: {ex:[1,2,3]  		}})
	
	EZ.test.options( {ex:[1, 2, 3]} )
	EZ.test.run('1,2,3', {delimiter:true})
	EZ.test.run('1,2,3'				, {EZ: {ex:['1,2,3'] 		}})

	EZ.test.run(' a b , c', ', '	, {EZ: {ex:['a', 'b', 'c'],
									   note:'space and comma delimiters'}});
	EZ.test.run('a,b,c', ','		, {EZ: {ex:['a','b','c']  	}})
	EZ.test.run(' a, b ,c ', ','	, {EZ: {ex:['a','b','c']  	}})
	EZ.test.run('a,b,c', /,/		, {EZ: {ex:['a','b','c']	}})
	EZ.test.run("a;, b; , c", ',;'	, {EZ: {ex:['a','b','c']	}})
	EZ.test.run(" a;, b; , c", ',;'	, {EZ: {ex:['a','b','c']	}})
	EZ.test.run('a,', true			, {EZ: {ex:['a']  			}});
	EZ.test.run(',a', true			, {EZ: {ex:['a']  			}});
	EZ.test.run('a 0 b', '0'		, {EZ: {ex:['a','b']  		}});
	EZ.test.run({}					, {EZ: {ex:[{}]  			}});
if (true) return;

	EZ.test.run(t_divs, false 		, {EZ: {ex:t_divs  			}});
	EZ.test.run(t_radios, false 	, {EZ: {ex:t_radios  		}});

	EZ.test.run(t_doc				, {EZ: {ex:[t_doc]  	}});
	EZ.test.run(t_none 				, {EZ: {ex:[t_none]  	}});
	EZ.test.run(t_tags 				, {EZ: {ex:[t_tags]  	}});
	EZ.test.run(t_tags[0]			, {EZ: {ex:[t_tags[0]]  }});
}

//_________________________________________________________________________________________________
e = function _____EZevent_____() {}	//convenience for DW functions list
//_________________________________________________________________________________________________

/*--------------------------------------------------------------------------------------------------
EZ.event.add() must be defined before any function groups defined via closure function framework so
for consistancy, the whole group of EZ.event functioms defined at top of EZbasic.js script file.
--------------------------------------------------------------------------------------------------*/
EZ.event = {};
EZ.event.names = ('abort autocomplete autocompleteerror beforecopy beforecut beforepaste'
			   + ' blur cancel canplay canplaythrough change click close contextmenu'
			   + ' copy cuechange cut dblclick drag dragend dragenter dragleave'
			   + ' dragover dragstart drop duratichange emptied ended error focus'
			   + ' input invalid keydown keypress keyup load loadeddata loadedmetadata'
			   + ' loadstart mousedown mouseenter mouseleave mousemove mouseout mouseover'
			   + ' mouseup mousewheel paste pause play playing progress ratechange'
			   + ' reset resize scroll search seeked seeking select selectstart show'
			   + ' stalled submit suspend timeupdate toggle volumechange waiting'
			   + ' webkitfullscreenchange webkitfullscreenerror wheel').split(' ');

EZ.event.customNameList = [];
EZ.event.hasCustom = function EZevent_hasCustom(name) 
{
	return EZ.event.customNameList.includes(name || '');
}
/*-----------------------------------------------------------------------------
EZ.event.add(eventObj, eventName, callback [, wait] [, immediate])

Add event handler for specified eventObj and eventName for callback function.
If wait specified, callback is not called for repeated events in specified wait
time interval (milli-seconds).

ARGUMENTS:
	eventObj	(required) HTML element or Object of event e.g. window
	
	eventNames	(required) Array or comma delimited String specifing one or more
				events for e.g. 'resize'.  All events share same wait interval.
	
	callback	(required) function called when event fires
	
	wait		(optional) if not supplied, true or 0, callback called for every event.
				otherwise specifies time interval in milliseconds in which repeated
				events are ignored -- i.e. callback only called at start and/or end 
				of wait interval -- negative if callback called on first event.
				default: 0 -- if NaN specifies immediate and default: 500
				
				=false to remove event TODO: not tested
	
	immediate	(optional) If true, callback called at start of wait interval.	 
				If "both" callback called at start -AND- end of wait interval.
				default: false or true if wait is negitive number.

NOTES:
	bubbling: event first captured and handled by innermost element then propagated to outer elements.
	capturing, event first captured outermost element then propagated to inner elements.

	Bouncing is the tendency of any two metal contacts in an electronic device to 
	generate multiple signals as the contacts close or open; debouncing is any kind 
	of hardware device or software that ensures only a single signal will be acted 
	upon for a single opening or closing of a contact within certian timeframe.

	Software examples are: mouse click, mouse drag or key pressed in form field.

	eventPhase:
	0. NONE
	1. CAPTURING_PHASE - The event flow is in capturing phase
	2. AT_TARGET - The event flow is in target phase, i.e. it is being evaluated at the event target
	3. BUBBLING_PHASE - The event flow is in bubbling phase

USAGE:
	EZ.event.add(window, 'resize', myFunc, 500)
	EZ.event.add(g.txtLabels, 'keyup', updateGroupLabels, 1000);
	EZ.event.add(window, 'onload', EZscript.loadOptions);


TODO:
	group multiple event for same Object as single debounce ??

REFERENCE: base for wait logic
	http://davidwalsh.name/essential-javascript-functions	
-----------------------------------------------------------------------------*/
EZ.event.add = function EZeventAdd(eventObj, eventNames, callback, wait, immediate) 
{
	if (wait === true) 
		wait = 0;
	var isRemove = (wait === false)
	
	if (!eventObj || !eventNames || typeof(callback) != 'function') 
		return EZ.oops('invalid arguments', arguments);
	
	wait = wait || 0;
	if (isNaN(wait))
	{
		immediate = immediate || wait;
		wait = 500;	
	}
	immediate = immediate || wait < 0;
	
	var isLegacy = EZ.isLegacy('EZevent');
	var fn, timeout = null;
	if (!wait)
		fn = callback
	else									//create event handler fn
	{	
		fn = function EZeventDebounce() 
		{
			var context = this;				//object containing event
			var args = arguments;			//event args
			var later = function EZeventDebounceLater() 
			{
				timeout = null;
				var afterArgs = [].slice.call(args);
				[].push.call(afterArgs, 'end');
				if (!immediate || immediate.toLowerCase() == 'both') 
					callback.apply(context, afterArgs);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, Math.abs(wait));
			
			var beforeArgs = [].slice.call(arguments);
			[].push.call(beforeArgs, 'start');
			if (callNow) callback.apply(context, beforeArgs);
		}
	}
	EZ.toArray(eventNames, ', ').forEach(function(eventName)
	{										//make lowerCase and remove "on" prefix if any
		if (typeof(eventName) == 'string')
			eventName = eventName.indexOf('field') != -1 ? getFieldChangeEvent(eventObj)
					  : eventName.replace(/(on)?(.*)/, '$2').trim().toLowerCase();
		if (!eventName) return;
			
		if (typeof(eventObj) != 'string' && isLegacy)
		{
			if (eventObj.addEventListener) eventObj.addEventListener(eventName, fn, false);
			else if (eventObj.attachEvent) eventObj.attachEvent('on' + eventName, fn);
			return;
		}
		var targets = (eventObj == window || eventObj === document.body || eventObj instanceof Element) 
					? [eventObj]
					: EZ.toArray(EZ(eventObj,','))
		targets.forEach(function(eventObj)
		{									
			var fnName = fn.name || fn.toString().match(/\s*(.*)\s*/)[1];
			fnName = fnName.replace(/(.*?)(\s*)(\/\/|$)/, function(all, fn, space, comment)
			{				
				return fn.replace(/(.*?)/g,'') + ' \t' + comment;
			});
			var stack = EZ.getStackTrace();
			if (fnName == "function()") 
				stack.pop();	//.replace(/.*:/, ':');	//anounymous
			fnName += stack.pop();

			if (isRemove)
			{									
				EZ.oops('not tested');			//TODO: not tested or used
				if (eventObj.removeEventListener) eventObj.removeEventListener(eventName, callback);
				else if (eventObj.detachEvent) eventObj.detachEvent('on' + eventName, callback);
				else EZ.oops('removeEventListener/detachEvent not found for:, eventObj')
//console.log('EZ.event.' + 'remove[on' + eventName + ']:' + fnName);
			}
			else								//activate event handler to call above fn
			{
				//capture, event 1st captured by outermost element then propagated to inner elements.
				var useCapture = false;			//false for innermost element 1st
				if (eventObj.addEventListener) eventObj.addEventListener(eventName, fn, useCapture);
				else if (eventObj.attachEvent) eventObj.attachEvent('on' + eventName, fn);
				else EZ.oops('addEventListener/attachEvent not found for:, eventObj')
//console.log('EZ.event.' + 'add[on' + eventName + ']:' + fnName);
			}
		});
	});
	//______________________________________________________________________________
	/**
	 *	EZ.field should superceed
	 */
	function getFieldChangeEvent(el)
	{
		if (!EZ.isEl(el)) return '';

		var tagType = el.type || el.tagName || '';
		if (el.length && el[0].tagName == 'radio')
			tagType = el[0].tagName;
		
		switch (tagType.toLowerCase())
		{
			case 'text': 	
			case 'textarea': 	
			case 'password': 	
				return 'blur';

			case 'img': 	
			case 'button': 	
			case 'radio': 
			case 'checkbox': 	
				return 'click';

			case 'select-one':
				return 'change';

			//case 'hidden': 	
			default:
				return '';
		}
	}	
}
EZ.event.namesByType = {
	UIEvent: "abort DOMActivate error load resize scroll select unload",
	ProgressEvent: "abort error load loadend loadstart progress progress timeout",
	Event: "abort afterprint beforeprint cached canplay canplaythrough change chargingchange chargingtimechange checking close dischargingtimechange DOMContentLoaded downloading durationchange emptied ended ended error error error error fullscreenchange fullscreenerror input invalid languagechange levelchange loadeddata loadedmetadata noupdate obsolete offline online open open orientationchange pause pointerlockchange pointerlockerror play playing ratechange readystatechange reset seeked seeking stalled submit success suspend timeupdate updateready visibilitychange volumechange waiting",
	AnimationEvent: "animationend animationiteration animationstart",
	AudioProcessingEvent: "audioprocess",
	BeforeUnloadEvent: "beforeunload",
	TimeEvent: "beginEvent endEvent repeatEvent",
	OtherEvent: "blocked complete upgradeneeded versionchange",
	FocusEvent: "blur DOMFocusIn  Unimplemented DOMFocusOut  Unimplemented focus focusin focusout",
	MouseEvent: "click contextmenu dblclick mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup show",
	SensorEvent: "compassneedscalibration Unimplemented userproximity",
	OfflineAudioCompletionEvent: "complete",
	CompositionEvent: "compositionend compositionstart compositionupdate",
	ClipboardEvent: "copy cut paste",
	DeviceLightEvent: "devicelight",
	DeviceMotionEvent: "devicemotion",
	DeviceOrientationEvent: "deviceorientation",
	DeviceProximityEvent: "deviceproximity",
	MutationNameEvent: "DOMAttributeNameChanged DOMElementNameChanged",
	MutationEvent: "DOMAttrModified DOMCharacterDataModified DOMNodeInserted DOMNodeInsertedIntoDocument DOMNodeRemoved DOMNodeRemovedFromDocument DOMSubtreeModified",
	DragEvent: "drag dragend dragenter dragleave dragover dragstart drop",
	GamepadEvent: "gamepadconnected gamepaddisconnected",
	HashChangeEvent: "hashchange",
	KeyboardEvent: "keydown keypress keyup",
	MessageEvent: "message message message message",
	PageTransitionEvent: "pagehide pageshow",
	PopStateEvent: "popstate",
	StorageEvent: "storage",
	SVGEvent: "SVGAbort SVGError SVGLoad SVGResize SVGScroll SVGUnload",
	SVGZoomEvent: "SVGZoom",
	TouchEvent: "touchcancel touchend touchenter touchleave touchmove touchstart",
	TransitionEvent: "transitionend",
	WheelEvent: "wheel"
}
EZ.event.userEvents = "keypress drag drop click contextmenu mousedown mousemove wheel".split(/\s+/);

/*--------------------------------------------------------------------------------------------------
http://stackoverflow.com/questions/5107232/is-it-possible-to-programmatically-catch-all-events-on-the-page-in-the-browser
--------------------------------------------------------------------------------------------------*/
EZ.event.getAllNames = function _getAllNames(el)
{
	el = EZ(el);
	var names = [];
	for (var property in el) 
	{
		var match = property.match(/^on(.*)/);
		if (match) 
			names.push(match[1]);
	}
	return names;
}
/*----------------------------------------------------------------------------------
remove logic in EZ.event.add() -- when wait === false
----------------------------------------------------------------------------------*/
EZ.event.remove = function EZeventAdd(eventObj, eventNames, callback, wait) 
{
	if (wait == null) wait = false;
	return EZ.event.add(eventObj, eventNames, callback, wait) 
}
/*--------------------------------------------------------------------------------------------------
cancel event propogation / bubble and optionally prevent default browser default action such as
going to href link or running href:javascript:...

https://www.w3.org/wiki/Handling_events_with_JavaScript
??

http://stackoverflow.com/questions/5963669/whats-the-difference-between-event-stoppropagation-and-event-preventdefault
--------------------------------------------------------------------------------------------------*/
EZ.event.cancel = function EZeventCancel(evt, isPreventDefault)
{
    if (!EZ.getType(evt).includesIgnoreCase('event'))
    	return EZ.oops('no event specified', evt);

    if (evt.stopPropagation)
      evt.stopPropagation();		//IE9 & Other Browsers
    else if (evt.cancelBubble)
      evt.cancelBubble = true;		//IE8 and Lower

	if (isPreventDefault)
	{
		if (evt.preventDefault)
		  evt.preventDefault();		//IE9 & Other Browsers
		else if (evt.returnValue)
		  evt.returnValue = true;	//IE8 and Lower
	}
	return false;					//convenience allowing return EZ.event.cancel(evt)
}
/*----------------------------------------------------------------------------------
https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events

TODO:
	Created for onEnter but did not use -AND- did not test
----------------------------------------------------------------------------------*/
EZ.event.create = function ___create(eventName, options)
{
	if (!eventName)
		return EZ.oops('event name required');
		
	if (eventName.startsWith('on'))
		eventName = eventName.substr(2);

	//
	options = options || {};
	options.bubbles = (options.bubbles) != null ? Boolean(options.bubbles) : true;
	options.cancelable = (options.cancelable) != null ? Boolean(options.cancelable) : true;
	
	var evt = (window.CustomEvent) ? new CustomEvent(eventName, options)
								   : new Event(eventName, options);
	
	//elem.addEventListener('build', function (e) { ... }, false);
	return evt;
}
/*--------------------------------------------------------------------------------------------------
http://codepen.io/MadeByMike/pen/sBjzn
http://madebymike.com.au/writing/detecting-transition-start/
--------------------------------------------------------------------------------------------------*/
EZ.event.createTransitionEvents = function createTransitionEvents()
{
	var _whichTransitionEvent = function()
	{
		var el = document.createElement('fakeelement');
		var transitions = {
			'transition':'transitionend',
			'OTransition':'oTransitionEnd',
			'MozTransition':'transitionend',
			'WebkitTransition':'webkitTransitionEnd'
		};
		for (var t in transitions)
			if (el.style[t] !== undefined)
			  return transitions[t];
	};

	var transitionEvent = _whichTransitionEvent();
	if (transitionEvent && !EZ.event.hasCustom('transition'))
	{
		EZ.event.customNameList.push('transition');
		
		if (window.CustomEvent) 					//create transition-start/end custom event
		{
			var opts = {'bubbles': true, 'cancelable': true};
			var transitionStartEvent = new CustomEvent('transition-start', opts);
			var transitionEndEvent = new CustomEvent('transition-end', opts);
		} 
		else 
		{
			var transitionStartEvent = document.createEvent('CustomEvent');
			var transitionEndEvent = document.createEvent('CustomEvent');
			transitionStartEvent.initCustomEvent('transition-start', true, true);
			transitionEndEvent.initCustomEvent('transition-end', true, true);
		}
		document.body.addEventListener(transitionEvent, function(evt) 
		{
			//console.log(evt.elapsedTime);			// FF does not report the exact time here.
			if (evt.elapsedTime <= 0.00001)
				evt.target.dispatchEvent(transitionStartEvent);
			else
				evt.target.dispatchEvent(transitionEndEvent);
		});
	}
}
/*--------------------------------------------------------------------------------------------------
Trigger eventName(s) on spectfied html element(s)

If eventName not specified, trigger all events found on specified elements
-OR- only onload if defined.
--------------------------------------------------------------------------------------------------*/
EZ.event.trigger = function EZevent_trigger(el, eventName) 
{											
	//var me = arguments.callee;
	var tags = EZ(el, null);
	if (!tags) return;
	
	var tagList = [];
	var faultList = [];
	EZ.toArray(tags).forEach(function EZevent_trigger_forEachElement(el)
	{
		if (!el || el.undefined || !(el instanceof Element)) 
		{
			tags.push( 'unknown html element: ' + el );
			return;
		}
		var outerHTML = el.toString('brief');
		var evtList = eventName || _trigger_onLoadEvent(el);	//returns onLoad or 1st -- NOT all
		if (evtList.length === 0)
			outerHTML += '\n  no events triggered';
		else
		{			
			EZ.toArray(evtList).forEach(function(evtName)
			{
				if (!evtName || typeof(evtName) != 'string') 
					return;
				
				var rtnValue = _trigger(el, evtName);
				outerHTML += '\n  on' + evtName;
				if (rtnValue.message)
				{
					outerHTML += ' \t ' + rtnValue.message;
					faultList.push(rtnValue.stack);
				}
			});
			tagList.push(outerHTML);
		}
	});
	if (tagList.length === 0)
		tagList = '';
	else
	{
		var log = tagList.slice().sort();
		if (faultList.length)
		{
			tagList.faultList = faultList;
			log.faultList = faultList;
		}		
		if (faultList.length)
			console.log( 'EZ.event.trigger exceptions: ', faultList.join('\n'))
//EZ.log(log);
		tagList.log = log;
	}
	return tagList;
	
	//______________________________________________________________________________________________
	/**
	 *	Cloned from EASY.formfields.js but not originally used
	 *	08-13-2016: fixed for non-IE browser and tested in EZtest_assistant for chrome
	 *	TODO:
	 *		use EZ.event.create() -- initEvent() depricated as on gecko v24
	 */
	function _trigger(el, eventName)
	{
		if (eventName.startsWith('on'))
			eventName = eventName.substr(2);
		
		/*02-15-2017 over-teched
		do
		{
			try
			{
				var evtOpts = {
					srcElement: el,
					target: el,
					detail: 'trigger'
				}
				var evt = EZ.event.create('onload', evtOpts)
				var fn = el['on' + eventName];
				var script = Function.prototype.toString.call(fn);
				if (script.includes('[native') || /\bevent\b/.test(script))
				{
					el.dispatchEvent ? el.dispatchEvent(evt) 
									 : el.fireEvent('on' + eventName, EZ.event.create('onload'));
					rtnValue.message = 'dispatched';
					break;
				}
				
				var fnParts = EZ.getFunction(fn)
				script = ((fnParts && fnParts[3]) || '').trim();
				if (!script)
				{
					rtnValue.message = 'no script';
					break;
				}
				if (script.startsWith('function'))
				{
					msg = fn.call(el,evt);
				}
				else if (/\bevent\b/.test(script))
				{
					msg = el.dispatchEvent ? el.dispatchEvent(evt) 
						: el.fireEvent('on' + eventName, evt);
				}
				else
				{
					 fn = function(event)
					 {
						void(event);
						var $$$;
						eval('$$$=' + script);
						return $$$;
					 }
					 msg = fn.call(el,evt);					 
				}
				if (msg instanceof Object && msg.stack)
					rtnValue.stack = msg.stack;
				
				if (!rtnValue.message)
					rtnValue.message = 'return value: ' + msg; 
				else
					rtnValue.message = 'return value: ' + rtnValue.message; 
			}
			catch (e)						//TODO: may need wrapper to catch
			{
				rtnValue = {
					message: e.message,
					stack: e.stack.formatStack().join('\n')
				}
			}
		}
		while (false)
		if (typeof(rtnValue) == 'string')
			rtnValue = {message:rtnValue};
		return rtnValue;
		*/
		
		var evt, opts = {
			bubbles: false, 
			cancelable: true,
			view: window,
			ctrlKey:false, altKey:false,
			shiftKey:false, metaKey:false,
			button:0,
			screenX:0, screenY:0, clientX:0, clientY:0,
			relatedTarget: undefined,
			detail: 'trigger'			//requires custom event
		};		
										
		if (EZ.MSIE || EZ.isIEw3c)		//OLD COMMENT: does not work (may have applied to chrome)...
		{								//...perhaps document.body.parentNode --> el.parentNode ??
			//http://marcgrabanski.com/simulating-mouse-click-events-in-javascript/
			var args = [eventName,
				opts.bubbles, opts.cancelable, opts.view, opts.detail,
				opts.screenX, opts.screenY, opts.clientX, opts.clientY,
				opts.ctrlKey, opts.altKey, opts.shiftKey, opts.metaKey,
				opts.button, document.body.parentNode
			]
			evt = eventName.startsWith('mouse') ? document.createEvent('MouseEvents')
				: eventName.startsWith('key') ? document.createEvent('KeyBoardEvents')	//??
				: document.createEvent('Events');										//??
			eventName.startsWith('mouse') ? evt.initMouseEvent.apply(el, args) :
			eventName.startsWith('key')   ? evt.initKeyboardEvent.apply(el, args) :
											evt.initEvent.apply(el, args);
		}
		else							//08-13-2016:
		{
			//https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
			evt = eventName.startsWith('mouse') ? new window.MouseEvent(eventName, opts)
				: eventName.startsWith('key') ? new window.KeyboardEvent(eventName, opts)
				: new Event(eventName, opts);								
		}
		var rtnValue = {message:''};
		EZ.$$$ = '';
		_triggerWrap();
		el.dispatchEvent ? el.dispatchEvent(evt) 
						 : el.fireEvent('on' + eventName, evt);
		if (EZ.$$$)
		{
			var stack = '';
			if (EZ.$$$ instanceof Object)
			{
				rtnValue.message = EZ.$$$.message;
				stack = (EZ.$$$.stack instanceof Array) ? EZ.$$$.stack.join('\n')
														: EZ.$$$.stack || '';
			}
			else rtnValue.message = EZ.$$$ + '';
			rtnValue.stack = (rtnValue.message + '\n' + stack).trim();
		}
		//=============
		return rtnValue;
		//=============
		/**
		 *	has issues -- put code in EZ.options.set to set EZ.$$$ if fault
		 */
		function _triggerWrap()
		{
		if (true) return;			
			var fn = el['on' + eventName];
			var fnParts = EZ.getFunction(fn)
			var script = ((fnParts && fnParts[3]) || '').trim();
			if (!script.includes('function wrapper'))
			{
				 var fnWrap = function wrapper(event)
				 {
					try
					{
						fn(event);
					}
					catch (e)
					{
						EZ.$$$ = e;
					}
				 }
				 el['on' + eventName] = fnWrap;
			}
		}	
	}
	//______________________________________________________________________________________________
	/**
	 *	return all events for el except: EZfield_onArrive/onLeave
	 */
	function _trigger_onLoadEvent(el)
	{
		var evtList = [];
		EZ.event.names.forEach(function(evtName)
		{
			var evt = el['on' + evtName];
			if (!evt || typeof(evt) != 'function' || evt.name.startsWith('EZfield_'))
				return;
			evtList.push(evtName);
		})

		var results = evtList.join(' ').match(/(\bload\w*\b)/);
		return (results) ? results[1]	//return 1st onload... event if found
						 : evtList;		//otherwise all events found	
	}
};
// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
//_____________________________________________________________________________________________
EZ.event.trigger.test = function()
{
	var win = window;
	var doc = win.document;
	doc = doc;
	EZ.test.run();
}
/*--------------------------------------------------------------------------------------------------
EZ.xxx(o, options)
String.formatStack(options)

whats up...

ARGUMENTS:
	String		...
	options		(optional) Object containing one or more of the following properties:
				skipCount	number of function to remove from top of stack
	...			blah blah
			Array or delimited string (values separated by commas or spaces)


RETURNS:
	true if ... otherwise ...

REFEERENCE:
	https://github.com/GaurangTandon/checkEventAdded
TODO:
====================================================================================================

var hasEvent, getEvents;
(function () {
    hasEvent = function (elm, type) {
        var ev = elm.dataset.events;
        if (!ev) return false;

        return (new RegExp(type)).test(ev);
    };

    getEvents = function (elm) {
        return elm.dataset.events.replace(/(^,+)|(,+$)/g, "").split(",").filter(function (elm) {
            return elm !== "";
        });
    };

    function addRemoveEvent(elm, type, bool) {
        if (bool) elm.dataset.events += "," + type;
        else elm.dataset.events = elm.dataset.events.replace(new RegExp(type), "");
    }

    function makeListener(name, bool) {
        var f = EventTarget.prototype[name + "EventListener"];

        return function (type, callback, capture, cb1, cb2) {
            if (!this.dataset.events) this.dataset.events = "";

            var has = hasEvent(this, type);

            // event has already been added/removed
            // do not attach listener
            if ((bool && has) || (!bool && !has)) {
                if (cb2) cb2();
                return false;
            }

            f.call(this, type, callback, capture);
            addRemoveEvent(this, type, bool);

            if (cb1) cb1();

            return true;
        };
    }

    EventTarget.prototype.addEventListener = makeListener("add", true);
    EventTarget.prototype.removeEventListener = makeListener("remove", false);
})();
--------------------------------------------------------------------------------------------------*/
  //----------------------------------------------------------\\
 //----- http://davidwalsh.name/essential-javascript-functions \\
//--------------------------------------------------------------\\

/*-----------------------------------------------------------------------------
EZevent.poll(fn, callback, errback, timeout, interval)

USAGE:
	poll		// ensure element is visible
	(
		function() {
			return document.getElementById('lightbox').offsetWidth > 0;
		},
		function() {
			// Done, success callback
		},
		function() {
			// Error, failure callback
		}
	);

REFERENCE: base before enhancements
	http://davidwalsh.name/essential-javascript-functions	
-----------------------------------------------------------------------------*/
EZ.event_poll = function EZevent_poll(fn, callback, errback, timeout, interval) 
{
    var endTime = Number(new Date()) + (timeout || 2000);
    interval = interval || 100;

    (function p() 
	{
            // If the condition is met, we're done! 
            if(fn()) 
				callback();
            
            // If the condition isn't met but the timeout hasn't elapsed, go again
            else if (Number(new Date()) < endTime) 
                setTimeout(p, interval);
            
            // Didn't match and too much time, reject!
            else 
                errback(new Error('timed out for ' + fn + ': ' + arguments));
    })();
}
/*-----------------------------------------------------------------------------
EZ.event.once(fn, context) 

Only calls callback function once -- onload functionality

USAGE:
	var canOnlyFireOnce = once(function() {
		console.log('Fired!');
	});
	
	canOnlyFireOnce(); // "Fired!"
	canOnlyFireOnce(); // nada

REFERENCE: base before enhancements
	http://davidwalsh.name/essential-javascript-functions		
-----------------------------------------------------------------------------*/
EZ.event.once = function EZevent_once(fn, context) 
{ 
	var result;
	return function() 
	{ 
		if (fn) 
		{
			result = fn.apply(context || this, arguments);
			fn = null;
		}
		return result;
	};
}

/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
/**
 *
 */
EZ.css = function EZcss()
{
    if (!EZ.getStyle) return '';
	return EZ.getStyle.apply(this,[].slice.call(arguments));
}
/*-----------------------------------------------------------------------------------
EZ.setSelectorStyle(selector, styleName, styleValue)

Set style for specified selector (style does not need currently defined by css)
Used snippet_helper_rte_tinymce.js::RZtinymceStyles() as base (4.00 hr)

TODO:
	appears function currently only looks at inlines styles
-----------------------------------------------------------------------------------*/
EZ.css.get = EZ.css.set = function EZcss_setSelectorStyle(selectors, styleNames, styleValues)
{
	EZ.oops('not complete')
	var options = {all:true, addStyle:true, defaultValues:styleValues};

	var patternList = {selectors:{}, styles:{}};
	var selectorList = EZ.toArray(selectors, ',');
	var styleValueMap = styleNames;	
	
	if (EZ.getType(styleNames) == 'Object')
		options.defaultValues = styleValueMap.options.defaultValues;
	else
	{
		styleValueMap = {};
		styleNames = EZ.toArray(styleNames, ', ');
		if (styleValues)
		{
			options.defaultValues = '';
		//	if (selector.length === 0 && styleValue == null)
		//		return EZ.oops('cannot set style value for multiple selectors') || '';
			styleValues = EZ.toArray(styleValues);
			if (styleNames.length != styleValues.length)
				return EZ.oops('must have same number of style and values') || '';
		}
		styleNames.forEach(function(style, idx)
		{
			styleValueMap[style] = styleValues ? styleValues[idx] : null;
		});
	}
	if (selectorList.includes('*'))
		selectorList = null;
	else if (!selectorList.length)
		return EZ.oops('selector not specified -- use * for all') || '';
	else
	{
		selectorList.forEach(function(all)
		{
			patternList.selectors[all] = RegExp(all.replace(/\\/g, '\\\\'));
		});
	}
	
	var styleList = Object.keys(styleValueMap);
	if (styleList.includes('*'))
		styleList = null;
	else if (!styleList.length)
		return EZ.oops('style not specified -- use * for all') || '';
	else
	{
		Object.keys(styleValueMap).join(',').replace(/\/.*\//g, function(all)
		{
			patternList.styles[all] = RegExp(all.replace(/\\/g, '\\\\'));
		});
	}
	//________________________________________________________________________________________
	/**
	 *	
	 */
	var isDefined = function(style, value)	
	{	
		if (/(0px|^$)/.test(value))
			return false;
		return true;
	}
	//________________________________________________________________________________________
	/**
	 *	
	 */
	var add = function(selector, style, value)	
	{	
		EZ.css.stylesUpdated.push(style);
		EZ.css.selectorStylesUpdated[selector].push(style);
		
		EZ.css.selectorStyleValues[selector][style].push(value);
		EZ.css.styleValues[style].push(value);
		rtnValue = value;
	}
	//________________________________________________________________________________________
	/**
	 *	
	 */
	var create = function(selector, rules)	
	{	
if (true) return
		var styleElement;
		if (document.all && document.createStyleSheet)
		{
			styleElement = document.createStyleSheet();
			Object.keys(rules).forEach(function(rule)
			{
				styleElement.addRule(selector , rule)
			})
		}
		else
		{
			styleElement = document.createElement("style");
			document.getElementsByTagName("head")[0].appendChild(styleElement);

			styleElement = document.styleSheets[document.styleSheets.length-1];
			var cssText = rules.join(';');
			styleElement.insertRule(selector + ' {' + cssText + '}',0);
		}
		return styleElement;
	}
	//________________________________________________________________________________________
	/**
	 *	
	 */
	var remove = function(style, cssRules, idx)	
	{	
if (true) return
		if (!style) return;
		//style.parentNode.removeChild(style);
		style.removeRule(style.cssRules[idx]);		//TODO: works but does not delete style
	}
	//==========================================================================================
	var rtnValue = '';
	EZ.css.styles = {};
	EZ.css.styleValues = {};
	EZ.css.selectorStyleValues = {};
	EZ.css.stylesUpdated = [];
	EZ.css.selectorStylesUpdated = {};
 	[].forEach.call(document.styleSheets, function(styleSheet)	//styleSheetList
	{														
		if ((styleSheet.href && options.inline) 
		|| (!styleSheet.href && options.href)) 
			return;
		
		var cssRules = styleSheet.cssRules
		var isFound = [].some.call(cssRules, function(rule,idx)	
		{
			var selector = rule.selectorText;
			if (!selector)							//TODO: keyFrames
				return;

			EZ.css.selectorStyleValues[selector] = {}
			EZ.css.selectorStylesUpdated[selector] = [];
			
			while (selectorList)
			{
				if (selectorList.includes(selector)) break;

				if (Object.keys(patternList.selectors).some(function(key)
				{
					return patternList.selectors[key].test(selector);
				})) 
					break;
				return;
			}
			
			// For standards based browser, cssStyle.style is object with length
			// IE only has style property names in pageRule.style object and no methods
			var cssStyles =  rule.style
			if (cssStyles.length === undefined)
				 cssStyles = cssStyles.style;
			
			isFound = [].some.call(cssStyles, function(style)	//for all styles . . .
			{
				EZ.css.selectorStyleValues[selector][style] = [];
				EZ.css.styleValues[style] = [];
				EZ.css.styles[style] = EZ.css.styles[style] || [];
				EZ.css.styles[style].push(selector);
				EZ.css.stylesUpdated[selector] = EZ.css.stylesUpdated[selector] || [];

				var newValue = styleValueMap[style];
				while (styleList)							//if not all styles
				{
					if (styleList.includes(style)) break;

					if (Object.keys(patternList.styles).some(function(key)
					{
						if (!patternList.styles[key].test(style)) return;
						newValue = styleValueMap[key];
						return true;
					})) 
						break;
					return;										//next if not one of specified styles
				}
				
				var oldValue = cssStyles[style];				//save current style value if defined
				if (!styleList && options.defined && !isDefined(style, oldValue))
					return;

				add(selector, style, oldValue);

				var newValue = options.defaultValues;
				if (newValue === null)							//remove
				{
					remove(style, cssRules, idx);
				}
				else if (newValue !== undefined)				//EZ.css.set() 
				{
					//rule.style[style] = newValue;
					if (!options.all)
						return true;
				}										
			});	//end styles
			if (isFound && !options.all)
				return true;
		});	//end rules

	});	// end styleSheet
	if (!rtnValue && options.create)
	{
		Object.keys(selectorList).forEach(function(selector)
		{
			var rules = [];
			Object.keys(styleList).forEach(function(style)
			{
				var styleValue = style + ':' + styleValueMap[style];
				rules.push(styleValue);
			});
			create(selector,rules);
		});
	}
	return rtnValue;
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.parse = function() 
{
	return JSON.parse.apply(this, [].slice(arguments))
//	var parser = (EZ.jsonPlusV3) ? EZ.jsonPlusV3.parse : JSON.parse;
//	return parser.apply(this, [].slice(arguments))
}
/*--------------------------------------------------------------------------------------------------
return simple json for: null, undefined, boolean, number, RegExp or blank;
otherwise call EZ.json.stringify() if loaded -OR- JSON.stringify() if not.

HISTORY:
	11-01-2016:	handle circular Objects more gracefully for both JSON.stringify() and EZ.stringify()
	11-03-2016:	simple circular monitor wrapper for JSON.stringify -- replaces circular structures
--------------------------------------------------------------------------------------------------*/
EZ.stringify = function EZstringify(value, replacer, spaces) 
{
	EZ.stringify.message = '';				//TODO: JSON.plus nolonger uses
	EZ.stringify.details = '';
	EZ.stringify.objectList = [];			//as dotName(s) e.g $.colors, $.fruits...
	EZ.stringify.circularList = [];			//list of repeated / circular objects
	
	switch (EZ.getType(value, NaN))
	{
		case 'Null': 						//JSON.stringify() returns "null" for null	
		case 'Undefined': 
			return value;
		
		case 'NaN': 
			return value;
		
		case 'Boolean': 
		case 'Number': 
			return value.toString();
		
		case 'RegExp':	
			return value;						//TODO: use EZ.json.stringify() when fully supported
												//		to retain lastIndex ??
		case 'Array':
		{
			if (value.length === 0)
				void(0);						//development breakpoint
			break;
		}
		case 'Object':
		{
			if (Object.keys(value).length === 0)
				void(0);						//development breakpoint
			break;
		}
		case 'String':
			if (value === '') return '""';
	}
	if (this == JSON.plus)
		return undefined;
												
	var json;
	if (EZ.json.stringify)						//EZ.json.stringify() if loaded
	{											
		try
		{
			//-----------------------------------------------
			json = EZ.json.stringify(value, replacer, spaces);
			//-----------------------------------------------
		}
		catch (e) 
		{
			//-------------------------------------------------
			//json = JSON.plus(value, replacer, spaces);
			//-------------------------------------------------
		}
	}
	else if (JSON.plus)								//JSON.stringifyPlus if loaded
	{											
		//-------------------------------------------------
		//json = JSON.plus(value, replacer, spaces);
		//-------------------------------------------------
	}
	else										//JSON.stringify()
	{
		//-------------------------------------------------
		json = JSON.stringify(value, replacer, spaces);
		//-------------------------------------------------
	}
	//======================
	return json;		 							 
	//======================
}
//________________________________________________________________________________________
EZ.stringify.test = function()
{	
	var msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, , rtnValue];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	ex = note = undefined;
	exfn = function(results, expected, testrun)
	{
		void( [results, expected, testrun] )	//jshint
		testrun.exfnDone = true;				//don't call as legacy
		//testrun.results = results = {results: results}
		
		var exResults;
		if (note !== undefined)
			testrun.appendNote(note);
			
		if (testrun.isExpectedResults()) return;
			
		var obj = testrun.getArgument(0);
		if (typeof(results) == 'string' 
		&& /\s*([\[{]|JSON._temp)/.test(results))				//Array or Object json...
		{
			var clone = eval('clone=' + results);				//create clone from json
			
			var isPrue = testrun.getArgument(1) == 'pure';			
			if (isPrue && EZ.stringify.circularList.length)		//call setCircular() if circular -AND-
				clone = JSON.setCircular(clone);				//json does not have embedded setCircular()
			
			testrun.setExpectedArgument(0, clone);
			testrun.appendNote('1st expected argument is Object created from json'.wrap('<em>'))

			if (!EZ.equals(obj, clone, {showDiff:5}))
			{
				//testrun.setOk(false);
				var msg = ['Object created from json NOT equal to obj stringified'];
				testrun.appendNote(msg.concat(EZ.equals.formattedLog));
				exResults = clone;
			}
			else
			{
				testrun.appendNote('<b>returned json GOOD -- expected results set to actual<b>');
				exResults = results;
			}
			var lists = {
				'objectList': EZ.stringify.objectList,
				'circularList': EZ.stringify.circularList
			}
			testrun.appendNote(lists);
			//testrun.setArgument(1, lists);
		}
		else
		{
			testrun.appendNote('<b>expected value set to JSON.stringify() value<b>');
var replacer = EZ.stringify._arguments.replacer;			
			var spaces = EZ.stringify._arguments.spaces;
			var json = JSON.stringify(obj, replacer, spaces);
			exResults = json;			
		}
		
		
		ex = note = undefined;
		return exResults;
	}
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	note = undefined;
	notefn = function(testrun)
	{
		if (note !== undefined)
			testrun.setNote(note);
		note = undefined;
	}
	//======================================================================================
	EZ.test.settings( {group: 'simple non-circular JSON.stringify()', exfn:exfn} );
	
	obj = {
		a:1, 
		b:{
			x: 'x-ray',
			y: 99
		} 
	}
	EZ.test.run(obj, 'pure');
	EZ.test.run(obj, 'native');
	
	obj = {
		a:1, 
		b:{
			x: 'x-ray',
			y: 99
		},
		c: [1, 'cat'],
		d: 'dog'
	}
	EZ.test.run(obj, 'pure');
	EZ.test.run(obj, 'native');
	

	var x = {a:'abc', b:{key:99}};
	EZ.test.run(x, 'native');
	
	//______________________________________________________________________________________
	EZ.test.settings( {group: 'simple JSON.stringify() circular objects', exfn:exfn} );
	
	x.b = x;
	EZ.test.run(x, 'pure');
	EZ.test.run(x, 'native');
	
	obj.d = obj.c;
	EZ.test.run(obj, 'native');
	
	obj = {
		a:1, 
		b:{
			x: 'x-ray',
			y: 99
		},
		c: [1, 'cat'],
		d: 'dog'
	}
	obj.d = obj.c;
	obj.b.y = obj;
	EZ.test.run(obj, 'native');

	obj = {
		a: 1,
		b: [0,1]
	}
	obj.b[2] = obj;
	EZ.test.run(obj, 'native');
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	EZ.test.run([], 'native');
	EZ.test.run({}, 'native');
	EZ.test.run({"":""}, 'native');
	EZ.test.run({"":"", x:1, y:[], z:{'':''}}, 'native');
	

	//______________________________________________________________________________
	EZ.test.settings( {group:'prior circular test'} );
	
	obj = { n:0, str:'abc', a:[1,2,3] };
	EZ.test.run(obj, 'native',	{EZ: {note:'not circular'	}})
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	o = {a:1}
	obj = {o:o}
	obj.circular = obj;
	EZ.test.run(obj, 'native'	,{EZ: {note:'NOW circular'	}})
	
	//EZ.test.settings( {exfn:null} );
	//EZ.test.quit;

	//______________________________________________________________________________
	EZ.test.settings( {group: 'saveResults scenarios'} );

	var saveResults = [undefined, 1, undefined, undefined, 5];
	EZ.test.run(saveResults, 'native');

	var saveResults = [null, 1, null, null, 5];
	EZ.test.run(saveResults, 'native');

	//______________________________________________________________________________________
	var group = 'simple json does not call any stringify(): ';
	EZ.test.settings( {group: group} );
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	EZ.test.options( {note:'no arg'		, ex:undefined } );
	EZ.test.run()
	
	EZ.test.options( {note:'undefined'	, ex:undefined } );
	EZ.test.run(undefined)
	
	EZ.test.options( {note:'null'		, ex:null } );
	EZ.test.run(null)
	
	//______________________________________________________________________________
	EZ.test.settings( {group: group + 'Boolean'} );
	
	EZ.test.run(true)
	EZ.test.run(false)
	EZ.test.run(Boolean(true))
	EZ.test.run(Boolean(false))
	
	//______________________________________________________________________________
	EZ.test.settings( {group: group + 'Number'} );
	EZ.test.run(0)
	EZ.test.run(1)

	EZ.test.options( {note:'NaN intended deviation from native JSON.stringify()', ex:NaN} );
	EZ.test.run(NaN)
	
	//______________________________________________________________________________
	EZ.test.settings( {group: group + 'Date'} );
	
	//new Date(year, month, day, hours, minutes, seconds, milliseconds);
	arg = new Date('06/13/2016 12:00 GMT')
	EZ.test.run(arg)
	EZ.test.run(new Date('')	,{EZ: {note:'invalid'	}})
	EZ.test.run(new Date(null)	,{EZ: {note:'null'		}})
	
	//______________________________________________________________________________
	EZ.test.settings( {group: group + 'RegExp'} );
	
	EZ.test.options( {note:'diff from native', ex:/abc/gim } );
	EZ.test.run(/abc/gim)
	
	//______________________________________________________________________________
	group = 'native JSON.stringify() '
	EZ.test.settings( {group: group + ' simple Strings'} );
	
	EZ.test.options( {note:'blank', ex:'""'} );
	EZ.test.run('')
	
	
	EZ.test.run('embedded "me" double quotes',		'native')
	EZ.test.run("embedded 'me' single quotes", 		'native')
	EZ.test.run('multi-line \n line 2'		 , 		'native')
	
	//______________________________________________________________________________
	EZ.test.quit;						//not native tests

	arg = RegExp("xyz", "gim")
	arg.lastIndex = 1;
	EZ.test.run(arg				,{EZ: {note:'lastIndex=1'	}})
	
	EZ.test.options( {note:'lastIndex:9 too big '.wrap('<em>') } );
	arg.lastIndex = 9;
	EZ.test.run(arg)
	EZ.test.settings( {group: group + 'test args'} );
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	obj = { n:0, str:'abc', a:[1,2,3] };
	EZ.test.run(obj, 4			,{EZ: {note:'spaces=4 1st arg'	}})
	EZ.test.run(obj, null, 4	,{EZ: {note:'spaces=4 2nd arg'	}})
	EZ.test.run(obj, ['str']	,{EZ: {note:'extract str - no spaces'	}})
	EZ.test.run(obj, ['str'], 4	,{EZ: {note:'extract str - spaces=4'	}})
	
	//______________________________________________________________________________
	//script written in 1 hr -- refactor old script
	//run started @ :8:30
}
/*--------------------------------------------------------------------------------------------------
 * 	dom function bound to el for all dom related EZ function 
 	in lieu of following new fn created for each EZ fn:
	
 		'var args = window.EZ.dom.context(this);\n'
		'window.EZ.' + key + '.apply(window.EZ, args);\n'
	
	// If called from element event handler, this must be 1st argument to act on
	// element -- otherwise the element is prepended to arguments
	
	// -OR- perhaps bind _.addClass that uses el and EZ.addClass that does not
	
	Either alternative still requires all non-dom EZ.??? bound to window.EZ if 
	EZ added to element
	
	other approach is to return cloned elements
--------------------------------------------------------------------------------------------------*/
EZ.dom = function EZdom()
{
	/*
	[].splice.call(arguments,0,1);
	if (isEvent)
		[].push.call(arguments,this);
	
	return window.EZ[fn].apply(window.EZ, arguments);
	//----------------------------------------------------------------------------
	var thisFn = arguments.callee;
	var caller = thisFn.caller;
	
	// does dom element (this) have event property (e.g. onclick) bound to this fn
	if (this[thisFn.name] == thisFn 
	&& caller.arguments[0]
	&& caller.arguments[0].constructor
	&& caller.arguments[0].constructor.name.substr(-5) == 'Event')
	*/
}
/**
 * 	alternate idea
 */
EZ.domUtils = function EZdomUtils(el)
{
	this.el = el;
	this.get = function EZget()
	{
	}
	this.get = function EZget()
	{
	}
	this.toggleClass = function EZtoggleClass(className)
	{
		return EZ.toggleClass(this.el, className);
	}
}
//__________________________________________________________________________________
/**
 * 	return arguments Object for dom related function bound to html element.
 *	prepend element Object to arguments when NOT called from element event handler.
 */
EZ.dom.context = function EZdom_context(el)
{
	var args = arguments.callee.caller.arguments;
	var caller = args.callee.caller;

	if (el[caller.name] == caller
	&& caller.arguments[0]
	&& caller.arguments[0].constructor
	&& caller.arguments[0].constructor.name.substr(-5) == 'Event')
		return args;

	[].splice.call(args,0,0,el);
	return args;
}

/*--------------------------------------------------------------------------------------------------
if ctx/args supplied, save function name, arguments and exception in EZ.faults
if msg === null, do not display error -- just saveException
--------------------------------------------------------------------------------------------------*/
EZ.techSupport = function EZtechSupport(e, msg, ctx, options)
{
	if (EZ.isLegacy())						
	//--------------------------------------------------------------------
	// legacy code
	//--------------------------------------------------------------------
	{
		if ('dw.techSupport'.ov())
			dw.techSupport.apply(dw, [].slice.call(arguments));
	
		else if ('console.log'.ov())
			console.log({msg:msg||'N/A', exception:e});
	
		else if (EZgetPref(EZ.pref.debugMode) || EZgetPref(EZ.pref.warningMessages))
			return EZ.exception(e,msg);
	
		else if (EZ.createLayer && EZ.displayMessage && 'dw.isNotDW'.ov())
		{
			var showDetails = '';
			var layer = EZ.createLayer('EZtechSupportDetail','div');
			if (!layer.undefined)
			{
				layer.style.display = 'none';
				showDetails = ' <a href="javascript:RZshowlayer(\''
							+ layer.id + '\');EZ.setframesize();window.scrollTo(0,9999)"'
							+ ' class="message">show details</a>';
	
				if (e.stack)
					layer.innerHTML = (e.stack + '').formatStack({wrap:'pre', note:'b'});
				else
					showDetails = e;
			}
			//displayMessage(e.wrap('<div class="errMsg">', '<div>'));	//from EZregex
			EZ.displayMessage( EZ.messages.techSupport + showDetails);
		}
		else
		{
			alert('Technical Difficult -- try again or contact support');
		}
		return;
	}
	//________________________________________________________________________________________
	/**
	 *	
	 */
	var displayMessage = function(msg)
	{
		if (!msg) return;
		var time = EZ.formatdate ? EZ.formatdate('','time') : '';
		msg = time + ' ' + msg.replace(/</g, '&lt;')
		
		var el = document.getElementById('messages');
		if (el) el.innerHTML = msg + '\n' + el.innerHTML;
		return msg;
	}
	//________________________________________________________________________________________
	/**
	 *	Format and display stacktrace
	 *	Add stacktrace container if not defined and msg not blank
	 */
	var displayStacktrace = function(msg)
	{
		if (!msg) return;
		msg = msg.formatStack().join('\n');
		
		var el = document.getElementById('stacktrace');
		if (!el && msg)
		{
			el = document.createElement('div');
			el.setAttribute('id', 'stacktrace');
			el.setAttribute('class', 'floatClear textBox');
			
			var tags = document.getElementsByTagName('body');
			if (tags.length)	//may be called before dom fully loaded
				tags[0].appendChild(el);
		}
		msg = msg.replace(/</g, '&lt;');
		msg = msg.replace(/@.../g, '<span class="note">').replace(/...@/g, '</span>');
		el.innerHTML = (EZ.formatdate ? EZ.formatdate('','time') + ' ' : '')
					 + msg  
					 + (el.innerHTML.trim() ? '<hr>' + el.innerHTML : '');
		
		if (EZ.show) 
			EZ.show(el, true);	//=true to show parents and scrollIntoViewIfNeeded()
		return msg;
	}
	//====================================================================================
	var fault = new EZ.fault(e, msg, ctx, options);
	//====================================================================================
	msg = fault.message;	
	if (!msg || msg.startsWith('-'))
		void(0);						//do nothing if msg starts with "-"

	else if (e instanceof Error)		//dw.techSupport clean clone with refinements
	{
		displayMessage( (msg + '\n' + e.message).trim() );
		displayStacktrace(msg + '\n' + e.stack);
	}
	else if (/(JAVASCRIPT exception|CALLED FROM)/.test(e+''))
	{
		displayMessage(msg);
		displayStacktrace(msg.trim() + '\n' + e.trim());
	}
	else
	{
		msg += e;
		displayMessage(msg);
		displayStacktrace( EZdisplayCaller(msg) );
	}
	return fault;
}
/*--------------------------------------------------------------------------------------------------
basic log functionality -- full functionality in EZ.debug.js
--------------------------------------------------------------------------------------------------*/
//EZ.log = function EZlog(msg) {return EZ.console(msg)}
EZ.log = function EZlog(heading, msg)
{
	if (window.EZlog)
		return EZlog(heading, msg);

	var detail = msg || 'N/A';
	var summary = 'N/A';
	if (typeof(detail) != 'object')
	{
		detail = detail.toString().split('\n');
		summary = detail[0] || '';
	}
	console.log({heading:heading, message:summary, detail:detail});
	return false;
}
EZ.debugLog = function EZdebugLog(msg) {return EZ.console(msg)}
EZ.console = function EZconsole(e,msg)
{
   	if ('console.log'.ov())
		console.log({msg:msg||'N/A', exception:e});
	return 	'';
}

//_________________________________________________________________________________________________
e = function _____NEW_WORK_IN_PROGRESS_____() {}	//convenience for DW functions list
//_________________________________________________________________________________________________

/*--------------------------------------------------------------------------------------------------
EZ.hide(selector(s), isTrue)

Hides specified tags if displayed by the following rules:
	If tag has both invisible and visible classnames, visible is removed
	If tag has both hidden and unhide classnames, unhide is removed
	if tag still displayed and has inline visibility style, el visibility style set to hidden
	if tag still displayed, el.style.display set to 'none' -- prior display style value saved

ARGUMENTS:
	selector	(optional) specifies tags to display if currently hidden
				if omitted, all popup layers.
	
	isTrue		(optional) if false, call EZ.show() -- if ===true, 
				TODO: crawl up dom tree restoring any classNames or el.styles changed by EZ.showw()
RETURNS:
	TBD

REFEERENCE:
TODO:
	option to check opacity and offsets
--------------------------------------------------------------------------------------------------*/
EZ.hide = function EZhide(tags, isTrue)
{
	isTrue = arguments.length < 2 || isTrue;
	if (!isTrue) return EZ.show(tags);
	
	if (EZ.isLegacy('EZshowHide'))
	{
		tags = EZ.toArray(tags, ', ') 	
		tags.remove().forEach(function(el)
		{
			if (el.childNodes)
				el.style.display = 'none';
		});
		return;
	}
	//===== created: 07-24-2016 (updated: 08-05-2016 popupList) =====
	if (!arguments.length)					//if no arguments, close all popups layers
		return (EZ.popup.hide) ? EZ.popup.hide() : '';	

	var _hasBothClassNames = function(el, classNames)
	{
		var classList = el.classList || el.className.split(/\s+/);
		return classNames.remove(classList).length === 0;
	}
	
	if (!EZ.isArray(tags) || !EZ.isEl(tags[0]))
		tags = EZ(tags, true);
	
	tags.remove().forEach(function(el)
	{
		if (!el || el.undefined || !el.childNodes) 
			return;
		
		if (EZ.popup.remove) 
			EZ.popup.remove(el);

		if (_hasBothClassNames(el, ['invisible', 'visible']))
			EZ.removeClass(el, 'visible');
			
		else if (_hasBothClassNames(el, ['hidden', 'unhide']))
			EZ.removeClass(el, 'unhide');
			
		else if (el.style.visibility)			//getStyle(visibility) not meaningful
			el.style.visibility = 'hidden';
		
		else if (EZ.getStyle(el, 'display') != 'none')
		{
			if (el.style.display && EZ.field)	//create EZfield to save prior display style
				EZ.field(el, true);
			el.style.display = 'none';			//set display:none
			//el.displayOrig = EZ.getStyle(el, 'display');
		}
	});
}
/*-----------------------------------------------------------------------------
is el is currently hidden
	var display = EZ.getStyle(el, 'display');
	var visibility = EZ.getStyle(el, 'visibility');
	if (display == 'none' || visibility == 'hidden')
		return isTrue;

	var isHide = arguments.length < 2 || isTrue;
	var why = EZ.isHidden.why = [];

	if (EZ.getStyle(el, 'visibility') == 'hidden')
		why.push('visibility');

	if (EZ.getStyle(el, 'display') == 'none')
		anyNone = why.push('display');
	
	if (isHide)
	{
		if (why.length)
			return why;
		return false;
	}
	else return why.length === 0
-----------------------------------------------------------------------------*/
EZ.isHidden = function EZisHidden(el, styles, mode)
{
	if (!/(String|Array)/.test(EZ.getType(styles)))
	{
		mode = styles;
		styles = 'visibility, display';
	}
	if (mode === undefined) 
		mode = null;
	
	var reasons = [];
	var tags = EZ(el, true);
	[].forEach.call(tags, function(el)
	{
		var why = el.isHidden(styles, mode);
		if (why)
			reasons.push( {el:el, why:why} );
	});
	return (reasons.length === 0) ? false : reasons;
}
/*--------------------------------------------------------------------------------------------------
EZ.show(selector(s), isTrue)

Displays specified tags if hidden by display and/or visibility style and scrollIntoViewIfNeeded().
	
If tag is absolute and isTrue === true...
	adds paddingTop to body if needed to fully display element in browser window
	-OR- adjusts left if needed to fully display

ARGUMENTS:
	selector	specified tags to display if currently hidden
	isTrue		(optional) if false, call EZ.hide()
	isAll		=true, crawls up dom tree to showing
				any parents hidden by (display:none or visibility:hidden)
RETURNS:
	TBD

REFEERENCE:
TODO:
	option to check opacity and offsets -- perhaps EZ.showAll() all styles all parents
--------------------------------------------------------------------------------------------------*/
EZ.show = function EZshow(tags, isTrue)
{
	if (EZ.isLegacy('EZshowHide'))
	{
		if (isTrue !== undefined && !isTrue) 
			return EZ.hide(tags);
		
		tags = EZ.toArray(tags, ', ') 	
		tags.remove().forEach(function(el)
		{
			if (el.childNodes)
				el.style.display = 'block';
		});
		var el = tags[0].parentNode;
		if (el && EZ.getStyle(el,'display') == 'none')
			el.style.display = 'block';
		
		isTrue = arguments.length < 2 || isTrue;
		if (isTrue && tags[0] && tags[0].scrollIntoViewIfNeeded)
			tags[0].scrollIntoViewIfNeeded(true);
		return;
	}
	
	//===== 07-24-2016 / 08-05-2016 (parents/display by tagName) =====
	if (isTrue != null && !isTrue) 
		return EZ.hide(tags);

	//______________________________________________________________________________________________
	/**
	 *	display item.el using following rules:
	 *		if hidden by visibility, add class "visible"
	 *		if display:none, 
	 *			set style.display to orig display style if known otherwise "unhide"
	 *			if still hidden by style.display, set style.display = 'initial'
	 *			if still hidden by style.display, set style.display = <tag default>
	 */
	var _show = function(tagReason)
	{
		var el = tagReason.el;
		var why = tagReason.why;
		do
		{
			if (why.remove('offsets').length === 0) 
				break;						//EZ.popup() deals with offsets
			
			if (el.style.visibility == 'hidden' || EZ.hasClass(el, 'invisible'))
				EZ.addClass(el, 'visible')	//assume good for all scenarios
			
			if (el.style.display == 'none' && el.EZfield 
			&& el.EZfield.getInitialStyle('display') != 'none')
			{								//try resetting initial display style
				el.EZfield.resetInitialStyle('display');
				if (!el.isHidden())
				{
					EZ.oops("resetInitialStyle('display') worked")
					break;
				}
			}
			if (el.style.display == 'none' || EZ.getStyle(el, 'display') == 'none')
			{
				EZ.addClass(el, 'unhide');
				if (el.style.display == 'none' || EZ.hasClass(el, 'hidden'))
					void(0);				//assume unhide works -- probably works for all scenarios
													
											//otherwise check -- TODO: not sure if need or reliable
											//						   for position:absolute
				else if (EZ.getStyle(el, 'display') == 'none')
				{							//use default display style value for tag
					var display = EZ.dom.display[el.tagName.toLowerCase()];
					el.style.display = display || 'inline';
					
					if (!display)
						EZ.oops('EZ.dom.display[' + el.tagName + '] undefined (inline assumed)');
				}
			}
		}
		while (false)
		if (EZ.getStyle(el, 'position') == 'absolute')
		{
		//	popups.push(el);
			EZ.popup.add(el);
			EZ.popup.scrollInToView(el);
		}
	}
	//=======================================================================================
	var isAll = (isTrue == '+');
	//var hiddenArg = !isAll ? '-' : '';			//isHidden() checks all ancestors by default
	
	var popups = [];							//usually only one (1) 
	tags = EZ(tags, true);						
	tags.remove().forEach(function(el)			//for all non-dup tags matching selector(s) . . .
	{											
		if (!el.childNodes) return;
		
		var reasons = el.isHidden();			//only false is reliable because visibility
		if (!reasons)							//is in-herited for position:absolute
			return;								//return if truly visible
		
		if (reasons.document)
			return EZ.oops('element not in document', el);
		
		if (!isAll)
		{
			var why = el.isHidden(null)			//just get why hidden for just specified tag
			reasons = [ {el:el, why:(why || [])} ];
		}	
		_show(reasons.shift());					//show specified tag
		if (!isAll) return;
															
		reasons.every(function(tagReason) 			//for all, crawl up ancesstor chain
		{ 										//not used or tested yet
			_show(tagReason)
			return el.isHidden(); 				//until truely visible
		});		
	});
	if (popups.length && EZ.popup.add)
		EZ.popup.add(popups);
}
/*-----------------------------------------------------------------------------
toggle (show/hide) tags display block/none 
-----------------------------------------------------------------------------*/
EZ.toggle = function EZtoggle(tags)
{
	var isLegacy = EZ.isLegacy('EZshowHide');
	if (isLegacy)
	{
		tags = isLegacy 
			 ? EZ.toArray(tags, ', ') 	
			 : EZ(tags, true);
		
		var display;
		tags.remove().forEach(function(el)
		{
			el = EZ.getEl(el);
			if (!el || !el.style) return;
	
			display = el.style.display == 'block' ? 'none' : 'block';
			
			/*DCO 01-13-2016
			if (!el.childNodes) return;		//continue
			
			if (el.checked)
				el.style.display = display;
			else
			*/
			el.style.display = display;
		});
		return display;
	}
	//===== toggle: 07-24-2016/08-05-2016 =====
	var display = [], showTags=[], hideTags=[];
	
	tags = EZ(tags, true);
	tags = tags.remove().removeDups();			//remove empty and dups
	tags.forEach(function(el)
	{
		if (!el.childNodes) return;
		var isHide = Boolean(EZ.isHidden(el));
		if (isHide)
		{
			EZ.show(el, null);
			showTags.push(el);
			display.push('show');
		}
		else
		{
			EZ.hide(el, null);
			hideTags.push(el);
			display.push('hide');
		}
	});
	return display.remove().join(',');
}
/*--------------------------------------------------------------------------------------------------
Originally written as suttle notification of unsupported / un-expected senario or variable value.

TODO:
	optional call EZ.techSupport() or EZ.capture() ??
	validate url but is noted in console

REFEERENCE:
	C:\Windows\winsxs\amd64_microsoft-windows-shell-sounds_31bf3856ad364e35_6.1.7600.16385_none_73076dd9cf3a9dce
--------------------------------------------------------------------------------------------------*/
EZ.defaultOptions.beep = { 
	url: 'ding',
	files: {
		ding: 'ding.wav',
		error: 'error.wav',
		notify: 'notify.wav',
		clock: 'tick-tock.mp3',
		track: 'track.wav',
		'tick-tock': 'tick-tock.mp3',
	},
	debug: false,
	log: true,				//true until options loaded
	alert: false,
	play: true,
	alertEnabled: true,
	trackEnabled: true,
	message: '',
	details: '',
	defaults: {string:'url'}
}
//___________________________________________________________________________________________________
EZ.beep = function EZbeep(url)
{
	delete EZ.beep.fault;
	
	var defaultOptions = EZ.defaultOptions('beep');
	var options = EZ.options(url, defaultOptions, arguments);
	if ((options.alert && !options.alertEnabled)
	|| (options.track && !options.trackEnabled))
		return;
	//______________________________________________________________________________________________
	/**
	
	if (url == 'ding')						//setup and play sound
	{
		url = 'EZ.simulator.domain'.ov();
	 	if (url)
			url += 'Shared/EZ/sounds/ding.wav';
	}
	else if (url == 'tick-tock')			
	{
		url = 'EZ.simulator.domain'.ov();
	 	if (url)
			url += 'Shared/EZ/sounds/tick-tock.mp3';
	}
	 *	Interface to EZ.format.value() if available
	 */
	var _formatValue = function(value)
	{
		var formattedValue = (value === '' && track) ? ''
						   : (value !== '' && typeof(value) == 'string') ? value
						   : (EZ.format && EZ.format.value) ? EZ.format.value(value)
						   : (value instanceof Object && !value.hasOwnProperty('toString')) 
						   		? EZ.toString(value, '*')
						   : value + '';
		return formattedValue;
	}
	//==============================================================================================
	var audio;
	var url = (typeof(url) == 'string' ? url : '') || options.url
	url = options.files[url] || url;
	if (!url.includes('/'))					//TODO: better strategy for simulator url??
		url = 'EZ.simulator.domain'.ov("http://localhost:8080/revize/dw.Configuration/") 
			+ 'Shared/EZ/sounds/' + url;
	try
	{
		if (url)
		{
			audio = new Audio(url);
//			audio.volume = options.volume || 1;
			if (url.includes('error.wav'))
				audio.volume = 0.3;
			if (options.play)	
				audio.play();
		}
	}
	catch (e)
	{
		EZ.beep.fault = EZ.fault(e);
	}	
	var track = (!options.trackEnabled) ? ''
			  : (options.track) ? options.track + '...'
			  : '';
	if (!options.alert && !track) 			//bail if not alert/EZ.oops or EZ.track call
		return audio;	
	
	if (options.debug)						//if debugger enabled
		debugger;
	
	var title = '', stack = [];
	if (options.log)						//if console.log enabled
	{
		stack = EZ.getStackTrace(EZ.beep);
		if (stack[0].startsWith('@'))
			stack.shift();

		//var stackTrace = EZ.getCaller('beep oops track getCaller');
		//var stack = stackTrace.stackTrace.split('\n');

		var msg = _formatValue(options.message)
		if (track)
		{
			msg = msg.replace(/(.*)[.]{3}\s*/, function(all,prefix)
			{
				track += prefix;
				var space = msg.match(/.*\s(\s*)/);
				return (space ? space[1].substr(1) : '') + '...';
			});
			
			title = track + stack.callerName;
			
			var stackTrace = {stack: stackTrace}
			msg = msg.split('\n').join('\n')
			
			//console.log(title, stackTrace, '\n', msg)
			console.log(title, msg, stackTrace, {detail:'todo'})
		}
		else
		{		
			stack.unshift(track + msg);
			var detail = options.details;
			if (detail === undefined)	
				detail = '';
			else
			{
				stack.push('')
				title = 'detail: [' + EZ.getType(detail) + ']';
				if (detail instanceof Object)
				{
					var json = EZ.stringify(detail, '*')
					var count = json.concat('\n').match(/\n/g).length - 1;
					if (count > 3)			
					{							//put over 3 lines of json in detail dropdown
						detail = document.createElement('detail');
						detail.setAttribute('lines', count);
						detail.innerHTML = json;
					}
				}
				EZ.oops.details = EZ.oops.detail = title + '\n' + detail;
			}
			EZ.oops.stacktrace = stack || '';
			if (EZ.oops.stacktrace)
			{
				var html = EZ.oops.stacktrace.format().join('\n').wrap('<div class="pre">');
				EZ.oops.stacktrace.html = html;
			}
			console.log(stack.join('\n'), title, detail);
		}
	}
	return undefined;						//caller convenience since usually called when error
}
/*--------------------------------------------------------------------------------------------------

legacy EZ.oops() calls passed e from catch as 1st argument:
	EZ.oops = function EZoops(msg, detail)
	{
		return EZ.techSupport.apply(this,[].slice.call(arguments));
	}
	//var log = Boolean(msg || obj || track);
	//var opts = (typeof(msg) == 'object') ? {message:obj, track:track}
	//									 : {message:msg, track:track}
//	EZ.oops.message = opts.message;
//	EZ.oops.detail = opts.obj || '';
	
--------------------------------------------------------------------------------------------------*/
EZ.oops = EZ.beep.alert = function EZbeep_alert(msg, obj, track)
{												//EZbeep in fn name for less stack clutter
	var url = '';
	if (arguments.length == 3)
		url = 'track';	
	
	if (arguments.length < 3)
		track = '';	
	
	if (arguments.length < 2 && typeof(msg) == 'object')
	{
		obj = msg;
		msg = 'EZ.oops()...';
	}
	EZ.oops.message = msg;
	EZ.oops.details = EZ.oops.detail = EZ.oops.stacktrace = '';
	var opts = {
		message:msg, 
		details:obj, 
		track:track, 
		alert:!track
	}
	if (url)
		opts.url = url;
	return EZ.beep(opts);
}
/*--------------------------------------------------------------------------------------------------
Displays EZ.beep if EZ.beep.options.trackEnabled -- placed calls in un-trust code blocks
--------------------------------------------------------------------------------------------------*/
EZ.beep.track = EZ.track = function EZbeep_track(msg, obj) 
{												//EZbeep in fn name keep it out stack
	return EZ.oops(msg, obj, 'EZ.track()');
}
/*--------------------------------------------------------------------------------------------------
		var endTime = new Date().getTime();
		var delta = endTime - begTime;
		EZ.run.screenTime += delta;
		if (delta > 500) ;
	EZ.run.screenTime = EZ.run.screenTime || 0;
--------------------------------------------------------------------------------------------------*/
EZ.queue = function EZqueue(fn, msg, options)
{
	if (msg === true)
	{
		options = msg;
		msg = '';
	}
	if (msg !== false) 					//caller done
		EZ.timer(msg || arguments.callee.caller);
	
	setTimeout(function() { EZ.run(fn, options) }, 0);
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.run = function EZrun(fn, options)
{
	if (typeof(fn) != 'function')
		fn = new Function('', fn);

	var pending = '._.pending='.ov(EZ.timer,[])
	if (options !== false && pending)
		EZ.timer._.pending.push(fn);
	
	fn();		
	
	if (options !== false && pending.includes(fn))
		EZ.timer(fn, options);
}

/*--------------------------------------------------------------------------------------------------
EZ.timer(msg, options)	

Track processing time

ARGUMENTS:
	msg			message displayed -- omit to reset start
	options		(optional) =true overrides EZ.timer.minMS filter

RETURNS:
	{start: EZ.timer.start, time:time, elapsed:EZ.timer.elapsed, total:EZ.timer.total};

_____________________________________________________________________________________________________
EZ.timer.setTimeout(script, delay, note)	

ARGUMENTS:
	script		same as native setTimeout
	delay		
	note		(optional) String containg not displayed in log or error messages

RETURNS:
	EZtimer Object created from arguments

TODO:
	test if closure variables work
	support script and anoumous functions -- think only defined fn work
_____________________________________________________________________________________________________
EZ.timer.clearTimeout(timer)	

ARGUMENTS:
	timer		=true clear all setTimeout() timers
				[Number] behaves like native clearTimeout() and removes from pending timers list.
				[EZtimer] clears timer specified in EZtimer Object

RETURNS:
	nothing
--------------------------------------------------------------------------------------------------*/
EZ.timer = (function _____EZtimer_____()
{
	EZ.defaultOptions.timer = {					//default options

		waitTag: '',							//EZ.addClass(tag, "timer") while waiting
		runningTag: '',
		setTimeoutAutoShow: true,
		confirmResume: true,					//open tooltip if not open to resume 
		queueSize: 10,							//size of finished queue
		tags: {
			pause: ''
		},
		log: true,
		name: 'EZ.timer.options',
		version: '09-30-2016',
	}
	//__________________________________________________________________________________________________
	/**
	 *	constructor for _init() and timer functions -- timer tracking does not call as constructor
				[].forEach(function(key)
				{
					this[key] = EZ.timer.options.defaultTracker[key];
				});
	 */
	function EZtimer(msg, options)				
	{	
		if ( !(this instanceof arguments.callee) )	 //----- NOT called as constructor -----\\
		{
			var tracker = EZ.timer._.tracker;		//global time tracker object
			if (arguments.length)
				return tracker.add.call(tracker, msg, options)
			else
				return tracker;
		}
		//===============================================================================================
		//called as comstructor
		//===============================================================================================
		
		if (!EZ.timer)								//_init() call to create static/global EZtimer Object
		{											//with _default properties and prototype functions
			var _ = this._ = {};				
													
			_.isPaused = false;
			_.timerScripts = [];						//Array 
			_.timers = {};					
		}
		else if (msg instanceof Object 				//EZ.timer.setTimeout() call: create timeout varient
		&& EZ.getType(msg) == 'Arguments')			//...EZ.timer.setTimeout(fn, ...)
		{
			var args = [].slice.call(msg);
			var caller = msg.callee.caller;
			var stack = EZ.stack(caller);
			
			var timer = this;
			var script = args.shift();			
			var fn = (typeof(script) == 'function') ? script
													: new Function(script+'');
			timer.script = Function.prototype.toString.call(fn);
			timer.name = fn.name;
			if (!timer.name || timer.name == "anonymous")
			{										//if fn name unknown, set to 1st function call
				var results = EZ.getFunction(fn)[3].match(/\b([\w$_]*?)\s*\(/);
				timer.name = results ? results[1] + '(...)'	//if fn call found, set to script
						  : timer.script.replace(/\s*(.{0,30})/, '$1').trim();
			}
			else timer.name += '()';
			
			timer.delay = isNaN(args[0]) ? 0 : args.shift();
			timer.waitTag = args.shift() || '';
			timer.runningTag = args.shift() || '';
			
			timer.type = 'setTimeout';
			timer.timestamp = EZ.format.time('', 'ms');
			timer.stacktrace = stack.lines.join('\n').formatStack();
			timer.at = timer.stacktrace[0].replace(/\s*(.*?):\d*\s*(.*)/, '$1$2');
			/**
			 *	
			 */
			timer.log = function _log(action)	
			{	
				if (!EZ.timer.options.setTimeoutLog)
					return;
				action = action || '...';
				var time = EZ.format.time('ms').replace(/ .m/, '');
				var actionFill =  (action + ' '.dup(20)).substr(0,16)
				console.log(time, actionFill, timer.name, timer.at, [this], 'delay:' + this.delay);
			}

			/**
			 *	function passed to setTimeout()
			 */
			timer.fn = function()
			{	
				EZ.timer.start(timer);
				if (!timer.startTime)
					return;

				try
				{
					////////////////////////////////
					fn();	//specified fn or script
					////////////////////////////////
				}
				catch (e)
				{								//append stack from EZ.setTimeout() call
					var stack = e.stack.split('\n').concat(timer.stacktrace).join('\n');
												
					console.log(e.stack.formatStack().concat(timer.stacktrace).join('\n'));					

					var err = EZ.error(e.message, e.name, stack);
					throw err;
				}
				finally
				{
					EZ.timer.finish(timer);
					void(0);
				}
			}
		}											  //-------------------------------------\\
		else 										 //create EZtimer object for time tracking\\
		{											//-----------------------------------------\\
			this._ = {};	
			this._.log = [];
			this._.pending = [];
			this._.options = {};					//TODO:
			/**
			 *	use saved time tracking options if current
			 */
			this.add = function _add(msg, options)
			{				
				var _ = this._;
				options = (options === true) ? {show:true} : options || {};
				options = EZ.options.call(EZ.timer.options.tracker, options);
				var time = new Date().getTime();
				//______________________________________________________________________________
				var fill = function(msg)
				{
					return (msg + ' '.dup(32)).substr(0,32);
				}
				//______________________________________________________________________________
				var log = function(msg, timeStr)
				{
					msg = msg || '';
					timeStr = timeStr || '';
					
					if (options.console)
						console.log(msg, timeStr);
					
					var logMsg = (typeof(msg) == 'string') ? msg : 'anonymous';
					_.log.push(logMsg + '\t' + timeStr)
				}
				//==============================================================================
				do
				{
					if (msg === undefined || !_.start)
					{
						if (_.pending.length)
						{
							log('-'.dup(60));
							log('queued functions')
							log('-'.dup(60));
							while (_.pending.length)
								EZ.timer( _.pending.pop() );	
							log('-'.dup(60));
						}
						_.log = [];
		
						_.start = time;
						log( fill(EZ.getCallerName(msg)), 'reset @ ' + EZ.format.time());
					}
					_.total = time - _.start;
					_.elapsed = time - _.last;
					
					var minMS = EZ.toInt('.minMS'.ov(options, 500));
					if (_.elapsed < minMS && options.show !== true) break;
					
					_.last = time;
				
					if (msg)
					{
						if (typeof(msg) != 'function')
							msg = fill(msg);
						else 
						{
							var fn = msg;
							var idx = _.pending.indexOf(fn);
							if (idx != -1)
								_.pending.splice(idx,1);
				
							msg = (fn.name) ? fill(fn.name)
											: {'anonymous': (fn+'').split('\n')};
						}
						if (_.lastMsg == msg) break;
						_.lastMsg = msg;
						
						var timeStr = 'total/elapsed: ' 
									+ EZ.format.seconds(_.total) + ' ' 
									+ EZ.format.seconds(_.elapsed);
						log(msg, timeStr);
					}
				}
				while (false)
return {start: _.start, time:time, elapsed:_.elapsed, total:_.total};
			}
			/**
			 *
			 */
			this.toString = function EZtimer_toString()
			{
				var _ = EZ.timer._;
				return _.log.length ? _.log.join('\n') : '';
			}
			//______________________________________________________________________________________
			/**
			 *	use saved time tracking log saved on page reload()
			 */
			this.open = function EZtimer_open(projectName)		
			{
				var _ = this._;
				
				projectName = projectName || '';
				//=====================================================================
				var opts = JSON.parse( sessionStorage.getItem(projectName + '.EZtimer'));
				//=====================================================================
				if (!opts || new Date(opts.timestamp).getTime() < new Date().getTime())
					this.reset();
					
				else
				{					
					for (var key in opts)
						_[key] = opts[key];

					if (!EZ.timer.console) 
						return;

					_.log.forEach(function(logMsg)
					{
						var msg = logMsg.split('\t');
						console.log(msg[0],msg[1]);
					});
				}
			}
			//______________________________________________________________________________________
			/**
			 *	use saved options if current
			 */
			this.reset = function EZtimer_reset()
			{
				var _ = this._;
				//var _ = EZ.timer._tracking || {};
				_.log = [];
				_.pending = [];
			}
			//______________________________________________________________________________________
			/**
			 *	save timer log entries created before page reloads -- restored by open()
			 */
			this.save = function EZtimer_save(projectName)		//save current values for reload
			{
				var timestamp = new Date().getTime() + 5*60*1000; 
				var opts = {
					log:EZ.timer.log, 
					start:EZ.timer.start,
					elapsed:EZ.timer.elapsed, 
					last: EZ.timer.last,   
					console:EZ.timer.console, 
					minMS: EZ.timer.minMS,
					timestamp: new Date(timestamp) + ''
				}
				projectName = projectName || '';
				//=====================================================================
				sessionStorage.setItem(projectName + '.EZtimer', JSON.stringify(opts));
				//=====================================================================
			}
		}
	}
	//______________________________________________________________________________________________
	/**
	 *	EZ.setTimeout(script, [,delay] [,note])
	 */
	EZtimer.prototype.setTimeout = function _setTimeout(script, delay, note)
	{
		if (!script)
			return EZ.oops('invalid arguments', arguments);
			
		if (this != EZ.timer)
			return EZ.timer.setTimeout(script, delay, note);
		
		var timer = new EZ.timer(arguments);
		return _update('setTimeout', timer);
	}
	//______________________________________________________________________________________________
	/**
	 *	called by pause/resume button
	 */
	EZtimer.prototype.pause = function _pause(evt)
	{
		if (this != EZ.timer)						//safety for un-expected
			return EZ.timer.pause(evt);
		
		var _ = EZ.timer._;
		var timer;
		var me = arguments.callee.caller;
		var field = EZ.field(_.options.tags.pause, true);
		var el = field.el;							//get field to preserve initial settings??
		var isPaused = _.isPaused;
		
		var type = '.type'.ov(evt);
		if (type == 'dblclick')						//double-click -- toggle pause on or off
			me.timer = clearTimeout(me.timer);
		
		else if (!evt)								//return from timeout -- not double click
		{										
			me.timer = 0;
			if (!isPaused)							//if not paused, fall-thru & toggle it on
				void(0);						
			
			else if (_.queues.paused.isEmpty())		//if no timers paused, un-hover
			{
				var isShow = EZ.hasClass(el.parentElement, 'hover, show');
				EZ.addClass(el.parentElement, 'show', isShow);
				return;
			}
			else									//so if paused and timeout waiting . . .
			{										
				if (!EZ.hasClass(el.parentElement, 'hover, show')
				&& _.options.confirmResume)			//if tooltip review required before resume
				{									//...simulate tooltip hover until closed
					EZ.addClass(el.parentElement, 'hover')
					return;
				}
				timer =_.queues.paused.next();		//get next paused timer and resume it
				_update('resume', timer);	
				return timer.fn();				
			}
		}
		else if (me.timer)							//else if waiting for double-click or timeout
			return;									//...keep waiting
		
		else if (evt)								//otherwise wait a bit for possible double-click
			return me.timer = setTimeout(function() {me()}, 500);
		
													  //-----------------------------------\\
		_.isPaused = !isPaused;						 //toggle pause setting, tooltip & class\\
		_update('refresh');							//---------------------------------------\\
		EZ.addClass(el, 'pause', _.isPaused);

													//if pause toggled off, resume next if any
		if (!_.isPaused && (timer = _.queues.paused.next()))
		{										
			_update('resume', timer);
			return timer.fn();				
		}
	}
	//______________________________________________________________________________________________
	/**
	 *
	 */
	EZtimer.prototype.start = function _start(timer)
	{
		if (this != EZ.timer)
			return EZ.timer.start();
		
		return _update('start', timer);
	}
	//______________________________________________________________________________________________
	/**
	 *
	 */
	EZtimer.prototype.finish = function _finish(timer)
	{
		if (this != EZ.timer)
			return EZ.timer.finish();
		
		return _update('finish', timer);
	}
	//______________________________________________________________________________________________
	/**
	 *
	 */
	EZtimer.prototype.remove = function _remove()
	{
		if (this != EZ.timer)
			return EZ.timer.remove();
		
		return _update('remove');
	}
	//______________________________________________________________________________________________
	/**
	 *
	 */
	EZtimer.prototype.removeAll = function _removeAll()
	{
		if (this != EZ.timer)
			return EZ.timer.removeAll();
		
		return _update('removeAll');
	}
	//______________________________________________________________________________________________
	/**
	 *	EZ.timer.clearTimeout(id) -- clears any function in timeout queue with matching script.
	 *
	 *	called by timeout function when function can be called via EZ.setTimeout() and directly.
	 */
	EZtimer.prototype.clearTimeout = function _clearTimeout(fn)
	{
		fn = fn || arguments.callee.caller;
		
		if (this != EZ.timer)
			return EZ.timer.clearTimeout(fn);
		
		return _update('clearTimeout', fn);
	}
	//______________________________________________________________________________________________
	/**
	 *	setTimeout workhouse -- does heavy lifting -- called by prototype interface functions
	 */
	function _update(action, timer)
	{
		var _ = EZ.timer._;
		var time = EZ.format.time('ms');
		//__________________________________________________________________________________
		/**
		 *	
		 */
		var _clearTimer = function(script)
		{
			var timer = script;						//if script arg is String...
			if (typeof(script) == 'string')			//...search for timer matching script
			{
				var idx = _.timerScripts.indexOf(script);
				if (idx == -1)
					return;
				timer = _.timers[idx];
			}
			if (!timer)
				return;
				
			clearTimeout(timer.id);					//may be cleared but no harm being sure
			
			delete _.timers[timer.idx];				//delete from list of active timers
			_.timerScripts[timer.idx] = undefined;	//placeholder until all queues empty
			
			if (_.queues.paused.delete(timer)		//remove from all queues but finished 
			+ _.queues.pending.delete(timer)
			+ _.queues.running.delete(timer))
				void(0);
			else
				_.timerScripts = [];				//discard placeholders if all queues empty
			
			EZ.removeClass([timer.waitTag, timer.runningTag], 'timer');
			//if (_.options.log) timer.log(action + '-reset');
			return timer;
		}
		//======================================================================================
		switch (action)
		{
			case 'clearTimeout': 	
			{											//timer is clearTimeout() caller fn
				timer = _clearTimer(Function.toString.call(timer));
				if (!timer) return;
				timer.log(action);		
				break;
			}
			case 'setTimeout': 	
			{
				if (_clearTimer(timer.script))				//clear timer with matching script
					action += '-reset';						//...if active timer found
				
				var idx = timer.idx = _.timerScripts.push(timer.script) - 1;
				timer.id = setTimeout(timer.fn, timer.delay);
				_.timers[idx] = timer;
				_.queues.pending.add(timer);
				
				EZ.addClass(timer.waitTag, 'timer');
				if (_.options.setTimeoutAutoShow)
					EZ.addClass(EZ(_.options.tags.pause).parentElement, 'show');			
				
				timer.log(action);		
				break;
			}
			case 'start': 	
			{
				_.queues.pending.delete(timer);			//remove from pending queue
				if (timer.runningTag)
					EZ.addClass(timer.runningTag, 'timer');
				
				if (_.isPaused && !timer.startTime)		//if pausing, add to paused queue
				{
					timer.pauseTime = time;
					_.queues.paused.add(timer);
					break;
				}										//otherwise log and fall thru to resume
				//else timer.log(action);																
				/* jshint ignore:start*/	//FALL-thru
			}
			case 'resume': 										
			{
				/* jshint ignore:end */
				timer.startTime = time;					//set start time means ok to run -- not paused
				if (!_clearTimer(timer))				//remove from active queues -- add to running
					action + '-no-clear';
				_.queues.running.add(timer);			//queue -- allowing fn to re-queue itself
				
				timer.log(action);		
				break;
			}
			case 'finish': 	
			{
				timer.log(action);		
				
				if (timer.runningTag)
					EZ.removeClass(timer.runningTag, 'timer');
		
				if (_.options.setTimeoutAutoShow 		//if showing tooltip and displayed, start hiding
				&& EZ.getStyle(EZ.timer._.options.tags.pauseTooltip,'opacity') > 0)
					EZ.removeClass(EZ(_.options.tags.pause).parentElement, 'show');			
				
				timer.finishTime = time;
				_.queues.running.delete(timer);			//remove from running queue
				_.queues.finished.add(timer);			//...add to finished queue
													
				if (!_.isPaused && _.queues.paused.keys().length)
				{										//if no longer paused and any paused timers...
					setTimeout(function()				//...resume next timer in new thread
					{
						var timer = _.queues.paused.next();
						_update('resume', timer);
						return timer.fn();				
					},0);
				}
				break;
			}
			case 'remove': 	
			{
				timer = _.queues.paused.next();
				_clearTimer(timer)					
				break;
			}
			case 'removeAll': 	
			{
				while (timer = _.queues.paused.next())
					_clearTimer(timer)					
				break;
			}
			case 'refresh': 							//just called to update tooltip
			{
				break;
			}
			default:	return EZ.oops('unknown action: ' + action)
		}	
														//update tooltip using most recent data
		var tooltip = ['no pending, paused or running timers'];
		var haveFinished = !_.queues.finished.isEmpty();
		if (_.timerScripts.length || haveFinished)
		{
			tooltip = [];
			var fmt = '{0} --> {1} {2} {3} ms [{4}]';
			Object.keys(_.queues).forEach(function(q)
			{
				var keys = _.queues[q].keys()
				if (keys.length === 0)
					return;
					
				for (var i=0; i<keys.length; i++)
				{
					var timer = _.queues[q].get(keys[i]);
					
					var wait = '';
					if (q == 'finished')
					{
						wait = timer.finishTime;
						wait = 'finished @ ' + (wait ? wait.clip(3) : 'not run');
					}
					else if (q == 'running')
						wait = 'started @ ' + timer.startTime.clip(3);
					else if (q == 'paused')
						wait = 'paused @ ' + timer.pauseTime.clip(3);
					else
					{
						wait = EZ.getTime(timer.timestamp) + timer.delay;
						wait = (wait <= EZ.getTime(time)) ? 'starting now'
														  : 'runs @ ' + EZ.format.time(EZ.getTime(wait), 'ms').clip(3);
					}
					var html = fmt.format(wait, timer.name, timer.at, timer.delay, timer.timestamp);
					tooltip.push(html);
				}
			});
			tooltip = tooltip.format();
			EZ.log.call('EZtimeout', tooltip);
		}
													  //-----------------------------------\\
		tooltip.push('');							 //----- update pause icon tooltip -----\\
													//---------------------------------------\\
		var deleteLink = ' <a href="javascript:EZ.timer.remove()">delete</a>'
					   + ' &nbsp; &nbsp;'
					   + ' <a href="javascript:EZ.timer.removeAll()">delete all</a>'
		
		if (!_.isPaused)							//paused not enabled
			tooltip.push( '<span class="hourglass">click above</span>to pause timeout calls'
						+ (haveFinished ? deleteLink : '') );
		
		else if (_.queues.paused.isEmpty())			//no paused functions
			tooltip.push( 'PAUSE on future timeout calls<div class="floatRight">'
						+ (haveFinished ? deleteLink : '')
						+ '<span class="hourglass">double click above</span>to stop pausing</div>' );			
		else 										
		{											//paused queue not empty
			tooltip.push('<span class="hourglass">click above</span>to run top paused function'
						+ deleteLink
						+ '<div class="floatRight">double click to stop pausing</div>');
		}
													//prepend close icon (TODO: optional tooltip close BETA)
		var html = EZ.popup.createTag('close', 'html')
				   + tooltip.join('\n');
													//display new tooltip if active
		var field = EZ.field(_.options.tags.pauseTooltip, true);
		EZ.popup.tooltip.set(field, html);
													//blink pause icon if any timers paused
		field = EZ.field(_.options.tags.pause, true)
		EZ.addClass(field, 'blink', _.queues.paused.keys().length);
		
		//==============================
		return timer;
		//==============================
	}	
	//______________________________________________________________________________________________
	/**
	 *	setTimeout Queues hold used for define are used timer state 
	 *	e.g. pending, running, ... finished
	 */
	var Queue = function EZtimer_queue(name, size)
	{										//
		var _ = EZ.timer._;
		this._name = name;					//
		this._size = size;					//-or- 
		this._queue = [];
		
		this.add = function(timer)			//append _.timers[] index -or- timer itself
		{									//e.g. finished queue
			this._queue.push( this._size ? timer : timer.idx );
			
			if (this._size && this._queue.length > this._size)
				this._queue = this._queue.slice(this._queue.length - timer);
		}
		this.get = function(key)
		{
			var value = this._queue[key];
			var timer = (this._size) ? value
									 : _.timers[value];
if (!timer) debugger;	////////////////////////////////////////////////////////////////
			return timer;
		}
		this.delete = function(timer)
		{
			var value = (this._size) ? timer : timer.idx
			var idx = this._queue.indexOf(value);
			if (idx != -1)
				this._queue.splice(idx,1);
			
			return this._queue.length;		//used by _clearTimer()
		}
		this.keys = function()
		{
			return Object.keys(this._queue);
		}
		this.next = function()
		{
			var idx = this._queue.shift();
			return _.timers[idx];
		}
		this.isEmpty = function()
		{
			return !this._queue.length;
		}
	}
	//__________________________________________________________________________________________________
	/**
	 *	creates new instance but copies all properties and prototypes to static function so EZ.timer()
	 *	still valid and calls defaultFumction with this context.
	 */
	function _init()
	{
		var fn = new EZtimer();
		for (var key in fn)
			EZtimer[key] = fn[key];
			
		EZ.event.add(window, 'onload', function()	//_init() initialize options plus...
		{
			var _ = EZ.timer._;
			var options = _.options = EZ.timer.options = EZ.options.call(EZ.defaultOptions.timer);
			options.tracker = EZ.options.call(options.tracker || {});
			_.tracker = new EZ.timer();				//default time tracker object
			
			_.queues = {
				paused: new Queue('paused'),
				pending: new Queue('pending'),
				running: new Queue('running', _.options.queueSize),
				finished: new Queue('finished', _.options.queueSize)	
			};

			EZ.setTimeout = EZ.timer.setTimeout;	//convenience abbreviations
			EZ.clearTimeout = EZ.timer.clearTimeout;
		});
		return EZtimer;
	}
	//==================================================================================================
	return _init();
})();
//________________________________________________________________________________________
/**
 *	time tracking
 */
EZ.timer.test = function()
{	
	var msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, , rtnValue];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	ex = note = undefined;
	exfn = function(results, expected, testrun)
	{
		void( [results, expected, testrun] )	//jshint
		testrun.exfnDone = true;				//don't call as legacy
		//testrun.results = results = {results: results}
		
		var exResults;
		if (ex !== undefined)
			exResults = ex;
		else
		{
		 	exResults = EZ.toArray(testrun.args[1], ', ').slice();
		}
		if (note !== undefined)
			testrun.note = note;
			
		ex = note = undefined;
		return exResults;
	}
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	notefn = function(testrun)
	{
		e = testrun;
	}
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//EZ.test.skip(999)		//count to skip 
	//_______________________________________________________________________________________
	//EZ.test.settings({group: 'persistant note'});
	//EZ.test.settings( {exfn:exfn} )				//exfn called if EZ.test.options() not called
	//EZ.test.run(-2, 		{EZ: {ex:-2	,	note:note	}})
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	//debugger;
	//var timer = EZ.timer();
	//EZ.timer.open();
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	//_______________________________________________________________________________________
	//EZ.test.options( {ex:ex, note:note} )
	//EZ.test.run( ctx, arg, obj )

	if (true) return;
}

/*--------------------------------------------------------------------------------------------------

Works in Firefox and in Safari before version 5


TODO:

REFEERENCE:
--------------------------------------------------------------------------------------------------*/
EZ.clipboard = function EZclipboard()
{
}
/*--------------------------------------------------------------------------------------------------
EZ.clipboard.copy(text, options)

ARGUMENTS:
	text		text copied to clipboard
	
	options		(optional) Object containing one or more of the following properties:
				el		specifies element or element selector used for clipboard text
						default: creates hidden element and removes when done

RETURNS:
	true if success otherwise false if browser does not allow clipboard copy

REFEERENCE:
	http://help.dottoro.com/ljctuhrg.php
	http://stackoverflow.com/questions/32323882/javascript-line-break-is-not-applying-when-i-use-document-execcommandcopy

TODO:
	remove leading \n on multiline text
--------------------------------------------------------------------------------------------------*/
EZ.clipboard.copy = function EZclipboard_copy(text, options)
{
	if (!document.body)
		return;
	text+='';
	var defaultOptions = {
		tagName: text.includes('\n') ? 'textarea' : 'div',
		styles: {
			position: "absolute",
			top: "-10000px",
			left: "-10000px",
		}
	}
	options = EZ.mergeAll(defaultOptions, options);
	
	var success = false;
	if (window.clipboardData) 						 		//IE is easy
		window.clipboardData.setData("Text", text);
	else 
	{														//create a temporary element if not supplied
		var el = options.el || EZ.createElement(options.id, options.tagName, options.styles);
		
		EZ.set(el,text);									//debugger aid
		EZ.el.textContent = text;
		EZ.range.selectNode(el);							//select all element contents

		try 
		{	// UniversalXPConnect privilege is required for clipboard access in Firefox
			if (window.netscape && window.netscape.security) 
				window.netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			
			success = document.execCommand ("copy", false, null);	
			EZ.range.removeAll();
		}
		catch (e) 
		{
			void(0);
		}
		if (!options.el)									//remove the temporary element if created
			document.body.removeChild(el);							
	}
	return (!success) ? EZ.oops() : true;
}
/*--------------------------------------------------------------------------------------------------
javascript move cursor

move cursor to the beginning of the input field
	http://stackoverflow.com/questions/2127221/move-cursor-to-the-beginning-of-the-input-field
move cursor to end of textarea: 
	https://davidwalsh.name/caret-end
Set cursor position in html textbox: 
	http://stackoverflow.com/questions/512528/set-cursor-position-in-html-textbox
--------------------------------------------------------------------------------------------------*/
EZ.range = function EZrange() 
{ 	
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.range.removeAll = function EZrange_removeAll() 
{ 	
	var selection = window.getSelection();							//current selection
	selection.removeAllRanges();
	return selection;
}
/*--------------------------------------------------------------------------------------------------
alse set EZ.setCursor()
--------------------------------------------------------------------------------------------------*/
EZ.range.selectNode = EZ.selectNode = function EZrange_selectNode(el) 
{ 	
	var rangeToSelect = document.createRange();						// first create a range
	rangeToSelect.selectNodeContents(el);

	var selection = EZ.range.removeAll();
	selection.addRange(rangeToSelect);
	return selection;
}
/*--------------------------------------------------------------------------------------------------
Save fn name, arguments, exception message with stacktrace and time.
Used to create test scripts for exceptions.
--------------------------------------------------------------------------------------------------*/
EZ.fault = function EZfault(error, msg, ctx, options)
{		
	if (EZ.getType(error) != 'Error')			//assume error omitted
	{
		options = ctx;
		ctx = msg;
		msg = error;
		error = null;
	}

	try
	{
		EZ.fault.count = EZ.fault.count || 0;
		EZ.fault.count++;
		
		var caller = arguments.callee.caller;
		var callerName = caller.name || caller.displayName || '';
		if (callerName == 'EZtechSupport')
		{
			caller = caller.arguments.callee.caller;
			callerName = caller ? caller.name : '';
		}
		
		if (msg instanceof Object)				//if msg is ctx argument
		{
			options = ctx;
			ctx = msg;
			msg = '';
		}	
			
		msg = msg || '';
		if (EZ.test.testKey)
			msg += ' testno[' + EZ.test.testKey + ']';	
		if (msg.substr(0,1) == '-' && !EZ.test.running.includes(callerName))	
			msg = msg.substr(1);
		this.message = msg || error+'';
		
		
		if (EZ.getConstructorName(ctx) == 'EZcallData')
		{									
			var callData = ctx;						//use callData
			this.name = callData.name;
			this.args = callData.args;
			this.argsClone = callData.args;
			this.argsValueMap = callData.argsValueMap;
		}
		else if (!callerName)
			//==========
			return this;
			//==========
		else										//no callData
		{
			this.name = callerName;
			this.args =  [].slice.call(caller.arguments);
			if (EZ.getPrototype(caller))
				this.args.ctx = ctx;
		}

		if (error instanceof Error)
		{
			var errorType = '.constructor.name'.ov(error, 'Error');
			this.errorType = this.errorType = errorType;
			this[errorType] = this[errorType] = error;
			if (typeof(error.options) == 'object')	//add caller options
				this.args.options = error.options; 
		}
		else if (typeof(options) == 'object')		//add caller options
			this.args.options = options; 

		if (EZ.capture.techSupport)
			EZ.capture.techSupport(this) 
	}
	catch (e)
	{
		var msg = 'EZ.fault failed';
		var elasped = (EZ.fault.exception || 0) - new Date().getTime();
		EZ.fault.exception = new Date().getTime() + 1000;
		
		if (elasped < 0)
			EZ.techSupport(e, msg);
		else
		{
			msg += ' AGAIN';
			console.log( {'': msg, Error:e} );
			this.message = msg;
			return this;
		}
	}
	return this;									//return new fault Object
}
/*--------------------------------------------------------------------------------------------------
EZ.getCallDepth(fn [,stack])

TODO:
	return EZ.isCaller(fn) when updated
--------------------------------------------------------------------------------------------------*/
EZ.getCallDepth = function EZgetCallDepth(fn, stack)
{
	fn = fn || arguments.callee.caller;
	
	if (!stack)
		stack = (EZ.error('','',fn).stack.split('\n')).slice(1);
	stack = EZ.isArray(stack) ? stack : stack.split('\n');
	if (!/ at /.test(stack[0] || ''))
		stack.shift();
	
	var name = fn.name || 'anonymous';
	var regex = RegExp("^.*? at (Function\\.)?" + name + " .*$","gm")

	if (regex.test(stack[0]))
		stack.shift();

	var count = (stack.join('\n').match(regex) || []).length;
	return count;
}

/*--------------------------------------------------------------------------------------------------
EZ.getIndex(value)

return nearest whole (integer) number if value is or starts with number >= 0 otherwise -1 
Strings starting with number but ending with letter are assumed to of the form: '1st', '2nd'...
and the number returned is one number less than the prefixed number i.e. (-1)

Examples:
	0, 0.49, '0' or '1st'	returns 0
	1, 1.1, '1' or '2nd' 	returns 1
	1.5, '1.5' or 1.9		returns 2
	'', 'na', [], {}, -9	returns -1
--------------------------------------------------------------------------------------------------*/
EZ.getIndex = function EZgetIndex(value, names)
{
	if (isNaN(value) && names instanceof Array && names.includes(value))
		return names.indexOf(value);
	
	return isNaN(value) ? EZ.toInt(value, -2) - 1 
		 : (value >= 0) ? EZ.toInt(value)
		 : -1;
}
/*--------------------------------------------------------------------------------------------------
EZ.error(msg, name??, new Error())

TODO:
	window.onerror = printError;

	function printError(msg, url, line){
		document.getElementById('test').innerHTML = msg+'<br>at: '+url+'<br>line: '+line;
		return true;
	}
EXAMPLES:
	throw new EZ.error('Hey,error message!', 'Error.Factory.g3');
	throw new EZ.error('Hey error message!', 'Error.Factory.g3', new Error());

REFERENCES:
	http://stackoverflow.com/questions/8802845/inheriting-from-the-error-object-where-is-the-message-property
	http://jsfiddle.net/centurianii/m2sQ3/1/
--------------------------------------------------------------------------------------------------*/
EZ.error = function EZerror(message, name, original) 
{
	if ( !(this instanceof arguments.callee) ) 			//if not called as constructor...
		return new EZ.error(message, name, original); 	//...do so now
	
	name = (name + '') || 'Error';
	message += '';
	var stack = (original) ? original : '';
	if (!stack)
	{
		stack = new Error().stack;
		stack = stack.split('\n').slice(3);
		stack = stack.join('\n');
		if (typeof(original) == 'function')				//remove all lines upto 1st occurance
		{												//of original function name
			var name = original.name || 'anonymous';	//TODO: not sure anonymous works
			var regex = RegExp("[\\s\\S]*?\\n(\\s+at (Function\\.)?" + name + " .*\\s*[\\s\\S]*)","")
			stack = stack.replace(regex, '$1');
		}
		stack = name 
			  + (message ? ': ' + message : '')
			  + '\n' 
			  + stack;
	}
	this.name = name;
    this.message = message;
    this.stack = stack;
};
   
var ClassEmpty = function() {};
ClassEmpty.prototype = Error.prototype;
EZ.error.prototype = new ClassEmpty();
EZ.error.prototype.constructor = EZ.error;
/*--------------------------------------------------------------------------------------------------
EZ.createTag(id,tag,styles)			//DCO 01-15-2016: loosely modeled after EASY.dom.js version

ARGUMENTS:

RETURNS:
	existing or new layer added at end of document if not found

TODO: not well tested
		//EZ.createTag.fieldMap = {};
		
--------------------------------------------------------------------------------------------------*/
EZ.defaultOptions.createTag = {
	tagName: 'div',
	selector: false,							//true if tag is selector
	format: 'element',
	field: true,								//create field for tag
	
	attributes: '',								//TODO:
	className: '',
	styles: '',
	parent: 'body'
}
//--------------------------------------------------------------------------------------------------
EZ.createTag = function EZcreateTag(tag, attr, parent, options)
{
	//var isLegacy = EZ.isLegacy(arguments);
	var isLegacy = EZ.isLegacy();
	if (isLegacy)
	{
		var tagName = tag;
		var depth = options;
		var defaultOptions = {
			tagName: 'div',
			tag: '',
			attr: '',
			field: true,					//create field for tag
			defaults: {String:'tag', Object:'attr'}
		}
		
		if (isNaN(depth))									//initial non-recursive call
		{
			if (EZ.isObject(tagName))						//if tagName omitted
			{
				var keys = Object.keys(tag);
				if (keys.length != 1)
					return EZ.oops('only 1 tag argument property allowed: ' + keys)
				
				tagName = keys[0];
				parent = attr;
				attr = tag[tagName];

				/*
				01-24-17 DCO: does not seem to work -- may have intented to use defaultOptions
				depth = parent;
				parent = attr;
				attr = tagName;
				tagName = '';
				*/
			}
			EZ.createTag.options = EZ.options.call(defaultOptions.createTag, tagName, depth);
			depth = 0;
			tagName = tagName || EZ.createTag.options.tagName;
		}
		var options = EZ.createTag.options;
		void(options);
		
		var tag;	
		if (tagName == 'text') 
			tag = document.createTextNode(attr);
		else if (tagName == 'innerHTML') 
		{
			if (!attr) return;
			parent.innerHTML = attr;
			return null;
		}
		else
		{
			tag = document.createElement(tagName);
			var innerHTML = attr.innerHTML;
			for( var key in attr)
			{
				if (/(tagName|innerHTML)/.test(key)) continue;
				if (key == 'className')
					key = 'class';

				var value = attr[key];
				if (key == 'nodes' && !innerHTML)
				{
					if (EZ.isArray(value))
					{
						value.forEach(function(attr)
						{
							EZ.createTag(attr.tagName, attr, tag, depth+1, {legacy:true});
						});
					}
					else if (value instanceof Element)
					{
						tag.appendChild(value);
					}
					else if (EZ.isObject(value))
					{
						for (var k in value)
							EZ.createTag(k, value[k], tag, depth+1, {legacy:true})
					}
					else
						EZ.oops('invalid nodes property', value);
				}
				else if (key == 'styles' && EZ.isObject(value))
				{
					for (var s in value)
						tag.style[s] = value[s];
				}
				else if (typeof(value) == 'string')
					tag.setAttribute(key, value);
			}
			if (innerHTML)
				tag.innerHTML = innerHTML;
		}
		if (parent === undefined)
			parent = EZ([parent || 'body', 'body'], false);	//use body if not specified nor found
		
		if (parent) 
		{
			parent.appendChild(tag);
			if (tagName != 'text' && options.field && EZ.field)
				EZ.field(tag, true)
		}
		return tag;
	}
	//==========================================================================================
	// updated: 10-21-2016	support tag specified as selector, html, element (not just tagName)
	//==========================================================================================
	var rtnValue = EZ.createTag.rtnValue = {
		object: null,
		element: {},
		html: ''
	}
	
	options = EZ.options.call(EZ.defaultOptions.createTag, options);
	tag = tag || EZ.createTag.options.tag;
		
	if (EZ.isObject(tag))						//if tag omitted
	{
		parent = attr;
		attr = tag;
		tag = '';
	}
												  //----------------------------------------\\
	var type = EZ.getType(tag, true);			 //----- determine how tag is specified -----\\
	if (typeof(tag) == 'string')				//--------------------------------------------\\
		type = options.selector ? 'Element'
			 : tag.startsWith('<') ? 'html' 
			 : 'tagName';
	
	switch (type)
	{
		case 'tagName':							//tag argument tagName or omitted
		{
			options.tagName = tag || options.tagName;
			break;
		}
		case 'html': 
		case 'Element': 						//clone tag via EZ.format.Element()
		{
			rtnValue.object = EZ.format.Element(tag, 'object', options);
			break;
		}
		case 'Object': 	
		{
			rtnValue.object = tag;
			break;
		}
		default:
		{
		}
	}
	var attrObj = rtnValue.object || {tagName: options.tagName};
	
	rtnValue.el = _createTag(options.tagName, attrObj, parent, 0)
	rtnValue.html = rtnValue.el.outerHTML;
	
	if (!rtnValue.object						//if object format specified, create object if null
	&& '* {} all object'.includes(options.format))
		rtnValue.object = EZ.format.Element(rtnValue.el, 'object');
		
	EZ.createTag.rtnValue = rtnValue
	switch (options.format || '')
	{
		case 'html':	return rtnValue.html;
			
		case '*':
		case '{}':
		case 'all':		return rtnValue;
		case 'object': 	return rtnValue.object;
		default:		return rtnValue.element;
	}	
	//______________________________________________________________________________________________
	/**
	 *
	 */
	function _createTag(tagName, attr, parent, depth)
	{
		var el;	
		if (tagName == 'text') 
			el = document.createTextNode(attr);
		else
		{
			el = document.createElement(tagName);
			for( var key in attr)
			{
				if (key == 'tagName') continue;
				var value = attr[key];
				if (key == 'nodes')
				{
					if (EZ.isArray(value))
					{
						value.forEach(function(attr)
						{
							EZ.createTag(attr.tagName, attr, el, depth+1);
						});
					}
					else if (EZ.isObject(value))
					{
						for (var k in value)
							EZ.createTag(k, value[k], el, depth+1);
					}
					else
						EZ.oops('invalid nodes property', value);
				}
				else if (key == 'styles' && EZ.isObject(value))
				{
					for (var s in value)
						el.style[s] = value[s];
				}
				else if (typeof(value) == 'string')
					el.setAttribute(key, value);
			}
		}
		if (parent === undefined)
			parent = EZ([parent || 'body', 'body'], false);	//use body if not specified nor found
		
		if (parent) 
		{
			parent.appendChild(el);
			if (tagName != 'text' && options.field && EZ.field)
				EZ.field(el, true)
		}
		return el;
	}
}
//________________________________________________________________________________________
/**
 *	
 */
EZ.createTag.test = function()
{	
	var el, msg, arr, ctx, arg, args, html, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [el, msg, arr, ctx, arg, args, html, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	exfn = function(results, expected, testrun)
	{
		void( [results, expected, testrun] )	//jshint
		testrun.exfnDone = true;				//don't call as legacy
												
												//convert return results;
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
	EZ.test.settings( {exfn:exfn} )		//, notefn:notefn
	
	obj = {
		img: {
			src: "../images/hourglass.png",
			styles: {
				verticalAlign: 'baseline'
			}
		}
	}
	EZ.test.run(obj, null);	

	obj = {
	  tagName: "details",
	  nodes: [
		{
		  tagName: "summary"
		},
		{
		  tagName: "div",
		  class: "pre"
		}
	  ]
	}
	EZ.test.run('details', obj, null);	
	
	obj = EZ.defaultOptions.message.waitTag;
	//EZ.test.run(obj, null);	

	if (true) return;
}

/*--------------------------------------------------------------------------------------------------
EZ.createLayer(id,tag,styles)			//DCO 01-15-2016: loosely modeled after EASY.dom.js version

ARGUMENTS:

RETURNS:
	existing or new layer added at end of document if not found

TODO: not tested
--------------------------------------------------------------------------------------------------*/
EZ.defaultOptions.createLayer = {
	tagName: 'pre',
	classNames: [],
	styles: {},
	defaults: {string:'tagName', array:'classNames', object:'styles'}
}
EZ.createElement = EZ.createLayer = function EZcreateLayer(id, tagName, styles, classNames, options)
{
	options = _EZcreateLayer_options(arguments);
	
	var layer = id ? EZ(id) : null;
	if (!layer || layer.undefined)
	{
		layer = document.createElement(tagName || 'pre');
		if (id)
			layer.setAttribute('id',id);
		
		if (EZ.isObject(styles))
		{
			Object.keys(styles).forEach(function(key)
			{
				layer.style[key] = styles[key];
			});
		}
		if (classNames)
			EZ.addClass(layer, classNames);
		var parent = (this == EZ) ? EZ('body') : this.parentElement;
		parent.appendChild(layer);
	}
	//======================
	return layer;
	//======================
	//________________________________________________________________________________________
	/**
	 *	determine supplied or omitted arguments -- return options
	 *	TODO: recognized options if proceeding args omitted
	 */
	function _EZcreateLayer_options(args)	
	{	
		var opts = args[args.length-1];
		var isLegacy = '.legacy'.ov(opts, EZ.isLegacy());
		if (isLegacy)
			return;
		
///		if (!opts.includesPlus( Object.keys(EZ.defaultOptions.createLayer) ))
			opts = {};

		EZ.createLayer.options = EZ.createLayer.options || EZ.options(EZ.defaultOptions.createLayer);

		if (id && EZ.getType(id) == 'Object')	//id and tagName omitted
			opts = EZ.options( {styles:id, classNames:tagName}, EZ.createLayer.options);

		if (id && EZ.getType(id) == 'Array')	//id, tagName and styles id has classNames
			opts = EZ.options({classNames:id}, EZ.createLayer.options);

		else if (typeof(tagName) == 'object')	//tagName omitted and possible styles and classNames
			opts = EZ.options( tagName, EZ.options({id:id, classNames:styles||{}}, EZ.createLayer.options) );
			
		else if (EZ.isArray(styles))			//id, tagName and classNames supplied -- styles omitted
			opts = EZ.options( {id:id, tagName:tagName, classNames:styles}, EZ.createLayer.options );
		
		else									//id, tagName and styles supplied -- maybe classNames
			opts = EZ.options( {id:id, tagName:tagName, styles:styles, classNames:classNames}, EZ.createLayer.options );
		
		id = opts.id;
		tagName = opts.tagName;
		styles = opts.styles;
		classNames = opts.classNames;
		return opts;
	}
}
/*--------------------------------------------------------------------------------------------------
EZ.messageCodes(codes [, type])

Define message text with optional arguments for specified codes. If type supplied, add or update
EZ.global.messages[type] with specified codes otherwise update EZ.global.messages.

ARGUMENTS:
	code		(required) Object containing message codes as properties; text as property values.
	type		(optional) specifies message type as dot notation under EZ.global.messages
				e.g. 'regex' for EZ.global.messages.regex codes.
RETURNS:
	String containing message text specified by code or generic text if code undefined.
--------------------------------------------------------------------------------------------------*/
EZ.messageCodes = function(codes, type)
{
	var obj = EZ.global.messages;
	if (type)
	{						//get or create messages[type]
		obj = EZ.getOpt('messages.' + type, {});
		EZ.messageDefaultType = type;
	}

	for (var key in codes)
	{						//skip key if prototype
		if ('.hasOwnProperty'.ov(codes) && !codes.hasOwnProperty(key)) continue;
		obj[key] = codes[key];
	}
}
/*--------------------------------------------------------------------------------------------------
EZ.message(code [, value])

Get message text for specifed code. If message has arguments, they are replaced with specified values
or empty string if not specified.

ARGUMENTS:
	code		(required) specifies key for message in EZ.global.messages Object
	value		(optional) specifies value(s) for message containing arguments
				Array or delimited string (values separated by commas or spaces)
RETURNS:
	String containing message text specified by code or generic text if code undefined.

//&& EZ.messageDefaultType != keys[0])
--------------------------------------------------------------------------------------------------*/
EZ.message = function(code, values)
{
	if (!code) code = 'oops';
	values = EZ.toArray(values, ' ,');

	var keys = (code || '').trim().split('.').remove();
	if (!keys.length)
		keys = ['oops'];

	if (keys.length == 1 		//if no type and
	&& EZ.messageDefaultType)  	//default type defined, prepend it
		keys.unshift(EZ.messageDefaultType);

	var msg = EZ.getOpt.call(EZ.global.messages, keys)
	if (!msg)
	{
		 msg = EZ.getOpt.call(EZ.global.messages, keys[keys.length-1] = 'oops');
		 values.push(code);
		 values = values.join(', ');
	}
	return msg.format(values);
}
/*--------------------------------------------------------------------------------------------------
EZ.getOpt(key, [defaultValue])

Get value of option specifed by key -- option created and set to defaultValue if not found
and defaultValue is supplied and not undefined (defaultValue null or blank create option).

ARGUMENTS:
	this	Object containing options -- default: EZ.globals if this == EZ

	key		specifies option using dot notation e.g. "messages.argRequired"
			if option not found using full dot notation

	defaultValue (optional)
			specifies value used to create option if not undefined

EXAMPLE:
	EZ.getOpt('formatValue.MAXLINE', defaultValue)
		first checks for EZ.global.formatValue.MAXLINE
		then EZ.global.MAXLINE

RETURNS:
	String containing value of option specified by key -OR- defaultValue if option not found
--------------------------------------------------------------------------------------------------*/
EZ.getOpt = function EZgetOpt(key, defaultValue)
{
	var baseObj = this == EZ ? EZ.global : this;

	var keys = EZ.isArray(key) ? key
			 : (key || '').trim().split('.').remove();

	if (!keys.length)
		return defaultValue;

	key = '';
	for (var i=0; i<keys.length; i++)
		key += '.' + keys.slice(i).join('.') + ' ';

	var value = key.clip().ov(baseObj);
	if (value == null && defaultValue != null)
		value = EZ.setOpt(keys.join('.'), defaultValue);

	return value;
}
//_____________________________________________________________________________________________
EZ.getOpt.test = function()
{
	EZ.test.run('TESTING', 							{EZ: {ex:'globalValue'	, note:''	}})
	EZ.test.run('formatTesting.TESTING',			{EZ: {ex:'globalValue'	, note:''	}})
	EZ.test.run('formatTesting.apple', 				{EZ: {ex:'apple'		, note:''	}})
	EZ.test.run('.formatTesting.apple', 			{EZ: {ex:''				, note:''	}})
	EZ.test.run('formatTesting.apple.not', 			{EZ: {ex:''				, note:''	}})
	EZ.test.run('TEST', 							{EZ: {ex:''				, note:''	}})
	EZ.test.run('formatTesting.TEST',				{EZ: {ex:''				, note:''	}})
}

/*--------------------------------------------------------------------------------------------------
EZ.setOpt(key [. value])

Set existing option specified by all or part of key to specifed value if not undefined.
create option if none exists and value not undefined (option created for blank or null value)
if value undefined, delete existing option if one exists.

ARGUMENTS:
	key		specifies option key as String using dot notation or Array of form below;
			e.g. "messages.argRequired" -- ['messages', 'argRequired']

	value	(optional) specifies option value -- if not supplied or undefined,
			the specified option is deleted if it exists.

RETURNS:
	true if ... otherwise ...

EXAMPLE:
 	'formatValue.MAXLINE'.setOpt(999)
--------------------------------------------------------------------------------------------------*/
EZ.setOpt = function EZsetOpt(key, value)
{
	var baseObj = this == EZ ? EZ.global : this;

	var keys = EZ.isArray(key) ? key
			 : (key || '').trim().split('.').remove();

	if (!keys.length)
		return value;

	var obj;
	for (var i=0; i<keys.length-1; i++)
	{									//look for existing key
		key = '.' + keys.slice(i).join('.');
		obj = key.ov(EZ.global, {});
		if (typeof obj[key] == 'undefined') continue;

		key = keys.shift();				//*** option found ***
		if (value != null)
			return obj[key] = value;	//set & return specified value

		value = obj[key];
		delete obj[key];				//delete option
		return value;					//return current value
	}
										//*** option NOT found ***
	if (value == null)
		return undefined;				//no new option created

	obj = baseObj;						//*** create option ***
	while (keys.length > 0)				//for each key component
	{
		key = keys.shift();

		if (typeof obj[key] != 'undefined')
			obj = obj[key];

		else if (!keys.length)
			obj[key] = value;

		else
			obj[key] = {};
	}
	return typeof(value) == 'object' ? obj[key] : value;
}
//_____________________________________________________________________________________________
EZ.setOpt.test = function()
{
	EZ.test.run('test', 'globalValue', 					{EZ: {ex:'globalValue',
			obj:'test'.ov(EZ.global)				, note: ''			}})

	EZ.test.run('formatValue.test'	, 'testValue',		{EZ: {ex:'testValue',
			obj:'formatValue.test'.ov(EZ.global)	, note:''			}})

	EZ.test.run('formatOther.test'	, 'otherValue',		{EZ: {ex:'otherValue',
			obj:'formatOther.test'.ov(EZ.global)	, note:''			}})

	EZ.test.run('test'				, 'new',			{EZ: {ex:'new',
			obj:'formatNew.test'.ov(EZ.global)		, note:''			}})

	EZ.test.run('formatNew.test',	'newValue',			{EZ: {ex:'newValue',
			obj:'formatNew.test'.ov(EZ.global)		, note:''			}})
}
/*---------------------------------------------------------------------------------------------
Does not call any functions except EZ.stack() and formatStack() to avoid infinite loops.
---------------------------------------------------------------------------------------------*/
EZ.getStackTrace = function EZgetStackTrace(sliceTo, defaultValue)
{
	var stack;
	try
	{
		stack = EZ.stack(sliceTo).lines.join('\n');
		//undefined.getStackTrace;
	}
	catch(e)
	{		//EZ.stack not loaded -- no worries -- use error stack -- remove msg
		stack = e.stack.replace(/.*?\n/, '');	
	}
	stack = stack.formatStack({skipCount: 1});
	
	if (stack[0].startsWith('@'))
		stack = stack.slice(1);
	
	if (defaultValue)
	{
		if (stack.length === 0)
			stack[0] = defaultValue;
//		else if (stack[0].startsWith('@'))
//			stack.shift();
	}
	return stack;
}
/*-----------------------------------------------------------------------------------
//call as follows: EZ.getStyle(el or id, "border-radius");
	if (typeof(el) != 'object')
		el = document.getElementById(el);
-----------------------------------------------------------------------------------*/
EZ.getStyle = function EZgetStyle(el, style)
{
	el = EZ(el);
	var value = "";		
	if (window.getComputedStyle)
		value = getComputedStyle(el).getPropertyValue(style);
	
	else if (el.currentStyle)		//IE
	{
		try 
		{
			value = el.currentStyle[style];
		} 
		catch (e)
		{
			EZ.oops(e);
		}
	}
	return (value || '').toLowerCase();
}
/*--------------------------------------------------------------------------------------------------
Basic getValue functionality -- overriden if full functionality js loaded

limitations:
	checkbox	returns true or false -- not value of checkbox

	radio		value must be defined (chrome default: on??)
				if el is radio element id, returns true or false -- not value
				if el is radio element name, returns value of checked button
				or "" if no button in group is checked

	select		only supports single select i.e. select-one
				returns value if defined otherwise returns text no options
--------------------------------------------------------------------------------------------------*/
EZ.get_basic = function EZget_basic(el, defaultValue)
{
	defaultValue = defaultValue || '';
	el = EZgetEl(el)
	if (!el || el.undefined)
		return defaultValue;		//el null, undefined or empty string

 	var name = el;
	if (typeof(el) != 'object') el = document.getElementById(el);
	if (!el) el = document.getElementsByName(name);
	if (!el) return defaultValue;	//specified el does not exist

	switch (EZ.getTagType(el))
	{
		case 'text':
		case 'textarea':
		case 'password':
		case 'hidden':
		case 'button':
			return el.value || defaultValue;

		case 'radio':
		{							//fall thru if name not radio group
			if (el.length)
			{
				for (var i=0; i<el.length; i++)
					if (el[i].checked) return el[i].value;
				return '';			//no button checked
			}
			return el.checked;
		}
		case 'checkbox':
			return el.checked;

		case 'select':
			return (el.selectedIndex < 0 || el.selectedIndex >= el.options.length)
				 ? ''	//return blank if no selection or invalid selectedIndex
						//return value if not blank otherwise return text
				 : el.options[el.selectedIndex].value || el.options[el.selectedIndex].text;

		case 'image':
			return el.src || defaultValue;

		default:
			return el.innerHTML
				 ? el.innerHTML || defaultValue
				 : defaultValue;
	}
}
//__________________________________________________________________________________
EZ.get_basic.test = function()
{
	var el = EZ('EZtest_select');
	el.selectedIndex = -1;			//TODO: -2, 999, null, undefined
	EZ.test.run(el, 					{EZ: {ex:'??',	note:'select-one selectedIndex:-1'	}})

	el.selectedIndex = 1;
	EZ.test.run(el, 					{EZ: {ex:'1',	note:'select-one'	}})

	var radioFalse = EZ('EZtest_tag');
	var radioTrue = EZ('EZtest_class1');
	radioTrue.checked = true;

	EZ.test.run('EZtest_radio',			{EZ: {ex:'true',	note:'radio group'	}})
	EZ.test.run(radioFalse,				{EZ: {ex:false,		note:'radio id=false'	}})
	EZ.test.run(radioTrue,				{EZ: {ex:true,		note:'radio id=false'	}})

	radioTrue.checked = false;
	EZ.test.run('EZtest_radio',			{EZ: {ex:'',	note:'radio group - none checked'}})

	EZ.test.run('noElement','defValue',	{EZ: {ex:'defValue',	note:'invalid'}})
	EZ.test.run(null,'defValue',		{EZ: {ex:'defValue',	note:'null'}})
}
/*--------------------------------------------------------------------------------------------------
minimal setValue functionality -- overriden if full functionality js loaded
--------------------------------------------------------------------------------------------------*/
EZ.set_basic = function EZset_basic(el, value)
{
	value = value || '';
	el = EZgetEl(el)
	if (!el || el.undefined)
		return value;				//el null, undefined or empty string

	var i, opts = el, val;
	var checked = 'checked';
	switch (EZ.getTagType(el))
	{
		case 'text':
		case 'textarea':
		case 'password':
		case 'hidden':
		case 'button':
			return el.value = value;

		case 'image':
			return el.src = value;

		case 'select':
		{
			checked = 'selected';
			opts = el.options
			if (!opts.length) return '';
		}	
		/* jshint ignore:start*/	//FALL-thru
		case 'radio':
		/* jshint ignore:end */
		{	
			if (opts.length > 0)		//if not single radio button
			{
				value = 'value';
				do						//select or radio group
				{
					for (i=0; i<opts.length; i++)
					{
						val = checked == 'selected'
							? opts[i][value]
							: EZ.getTagValue(opts[i]);

						if (opts[i][value] != value) continue;
						opts[i][checked] = true;
						return value;
					}
					if (value == 'text') break;
					value = 'text';
				}
				while (checked == 'selected')
				return '';
			}
			return EZ.getTagValue(el) || (val === value || EZ.isTrueLike(value))
		}	
		/* jshint ignore:start*/	//FALL-thru
		case 'checkbox':					//checkbox or single radio button
		/* jshint ignore:end */
		{	
			return EZ.getTagValue(el) || (val === value || EZ.isTrueLike(value))
		}	
		/* jshint ignore:start*/	//FALL-thru
		case 'label':						//TODO: copy to EZgetValue()
		/* jshint ignore:end */
		{									//fall thru to default if for attribute
			if (!el.getAttribute('for'))
			{								//otherwise find 1st non-blank text node
				var nodes = el.childNodes;
				var textNode = '';
				for (i=0; i<nodes.length; i++)
				{
					if (nodes[i].nodeType != 3) continue;
					textNode = nodes[i];
					if (nodes[i].nodeValue.trim())
						return nodes[i].nodeValue = value;
				}
				if (textNode)					//all text nodes blank, update last
					return textNode.nodeValue = value;
				return value;					//no text nodes
			}
		}
		/* jshint ignore:start*/	//FALL-thru
		default:	//inclues label with "for" attribute
		/* jshint ignore:end */
			return el.innerHTML != null
				 ? el.innerHTML = value
				 : value;
	}
}
//__________________________________________________________________________________
EZ.set_basic.test = function()
{
	//----- EZ.set radio tests
	var radio_all = document.getElementById('radio_all');
	EZ.test.run( 'EZtest_radio', 'all',		{EZ: {
		ex:function()
		{
			 return radio_all.checked;
		}, note:'radio button'					}})


	//----- EZ.set label tests
	var label_some = document.getElementById('EZtest_label_some');
	EZ.test.run( label_some, '1 of 3',		{EZ: {
		ex:function()
		{
			 return label_some.innerHTML == '1 of 3';
		}, note:'label text'					}})
	EZ.set(label_some, 'some');		//restore orig label text
}
/*--------------------------------------------------------------------------------------------------
set all tags with className to specified value -- if omitted get value tag with id same className 
if value is element, get value  of element.		superceed by data-EZonchange="set=selector"
--------------------------------------------------------------------------------------------------*/
EZ.copyValue = function EZcopyValue(className, value)
{
	value = (value === undefined) ? EZ.get('#' + className)
		  : EZ.isEl(value) ? EZ.get(value)
		  : value; 
	
	EZ(className,true).forEach(function(el)
	{
		EZ.set(el, value);
	});
}
/*--------------------------------------------------------------------------------------------------
Append parentNode(s) with node(s)
--------------------------------------------------------------------------------------------------*/
EZ.appendNodes = EZ.append = function EZappend(parentNodes, nodes)
{
	if (!arguments.length)
		return EZnone('no-arguments');
	
	else if (arguments.length == 1)
		return EZnone('no-enough-arguments');

	parentNodes = EZ.isEl(parentNodes)
				? EZ.toArray(parentNodes, false)
				: EZ(parentNodes,true);
	if (parentNodes[0] == null)
		return EZnone('parent-not-found');

	nodes = EZ.isEl(nodes)
		  ? EZ.toArray(nodes, false)
		  : EZ(nodes,true);
	
	if (nodes[0] == null)
		return EZnone('no-nodes');

	parentNodes.forEach(function(parent)
	{
		nodes.forEach(function(node)
		{
			//TODO: what happens when node appened to multiple parents??
			//if (!EZ.is(node,document.constructor))	//append if not document
				parent.appendChild(node);
		});
	});
	return nodes;
}
/*-----------------------------------------------------------------------------
EZ.removeNodes(nodes)
-----------------------------------------------------------------------------*/
EZ.removeNodes = function EZremoveNodes(nodes) 
{
	if (!nodes) return;
	while (nodes.length)
	{
		var node = nodes[0];
		node.parentNode.removeChild(node);
	}
}
/*-------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------*/
EZ.arrayFromArguments = function(callerArgs)
{
	var array = [];
	if (!callerArgs.length) return [];

	var firstArg = callerArgs[0];
	if (typeof(firstArg) == 'object')
	{
		if (EZ.isArrayLike(firstArg))
			return [].slice.call(firstArg,0);
		else
			firstArg = firstArg.toString();
	}

	// convert firstArg to Array -- typeof object processed above
	switch (typeof firstArg)
	{
		case 'nan':
		case 'null':
		case 'unknown':
		case 'undefined':
		case 'function'	:
			return [];

		case 'boolean':
		case 'number':
			return [firstArg];

		case 'string':
		{
			///if (!firstArg) return [];
			var array = [].slice.call(callerArgs,0);

			// if last array element is EZ.options, remove it
			////////////////////////////     ????????
			//if (array.length && EZ.is(array[array.length],EZ.options))

			// remove blank or none type array elements
			for (var i=array.length-1; i>=0; i--)
				if (EZ.isNone(array[i]))
					array.splice(i,1);
			return array;
		}
	}
	//return EZ.oops(EZ.messages.unexpected, []);
}
/*--------------------------------------------------------------------------------------------------
bind EZgetEl() (and EZ.stubs if defined) to element(s)
--------------------------------------------------------------------------------------------------*/
EZ.bindElements = function EZbindElements(tags)
{
	if (!tags || typeof(tags) != 'object' || (EZ.isArrayLike(tags) && !tags.length))
		return tags;

	var isLegacy = EZ.isLegacy()

//	if (tags instanceof Element && !tags.EZ)					//11-16-2016 bind
		isLegacy ? bindElement(tags) : bindElementAll(tags);
	
	if (EZ.isArrayLike(tags))
	{
		Array.prototype.forEach.call(tags, function bindTag(tag)
		{
//			if (tag instanceof Element && !tag.EZ)				//11-16-2016 bind
				isLegacy ? bindElement(tag) : bindElementAll(tag);
		});
	}
	//======================
	return tags;
	//======================
	//_______________________________________________________________________________
	/**
	 *	DCO 01-11-2015:
	 *	bind all EZ functions and properties to tag as defined in config settings.
	 */
	function bindElementAll(tag)
	{
		if (tag.EZ != null) return;					//already bound

if (EZ.bindElements.log) 
EZ.oops('bind', tag);
		
		tag.EZ = window.EZ.bind(tag);
		tag.EZ$ = window.EZ$.bind(tag);

		tag.EZ.set = EZ.set.bind(tag);
		tag.EZgetEl = window.EZgetEl.bind(tag)

		Object.keys(EZ).forEach(function(key)
		{
			if (key in tag.EZ) 						//property already defined
				return;

			else if (EZ.functions.ignore.includes(key)
			|| key.startsWith('test') || key.endsWith('test'))
				return;

			else if (typeof(EZ[key]) == 'string')	//uppercase Strings -- constants
			{
				if (key != key.toUpperCase()) return;
				tag.EZ[key] = EZ[key];
			}
			else if (typeof(EZ[key]) == 'object')	//only listed Objects
			{
				if (!EZ.functions.obj.includes(key))
					return;
				tag.EZ[key] = EZ[key];
			}
			else if (typeof(EZ[key]) != 'function')	//no other types
				return;
													//EZ$, EZ_, EZ.nul
			else if (EZ.functions.core[key])		//el to prepended arguments
				void(0);							//TODO: will get js error add as needed
				//tag.EZ[key] = EZ.functions.core[key].bind(window.EZ, tag);

			else if (EZ.functions.dom[key])			//dom related function
				tag.EZ[key] = EZ.functions.dom[key].bind(tag);

			else									//utility function -- not element related
				tag.EZ[key] = window.EZ[key];
		});
	}
	/**
	 *
	 */
	function bindElement(tag)
	{
		if (tag.EZ != null) return;	//alread bound

		// Must use new function to avoid inheriting non-dom functions
		tag.EZ = function() { return EZ.apply(tag, [].slice.call(arguments)) };
		//tag.EZ = EZ.bind(tag);  //nogo

		tag.EZ.set = EZ.set.bind(tag);

		//works but add redundant function layer
		tag.EZgetEl = function() { return EZgetEl.apply(tag, [].slice.call(arguments)) };
		//??  tag.EZgetEl = tag.EZ;

	}
}
/*--------------------------------------------------------------------------------------------------
Object.cloneObject(obj, depth)

09-20-2016 DCO:
Fixed code to correctly create new function Object for fn with custom toString() function. 
However EZ.clone() conflicts with EZ.clone() function  -- not sure which was used when.

Renamed EZ.cloneObject() to avoid conflict with EZ.clone() function which uses json to create what 
is believed to produce safe clone but does not support circular Object as appears the intented by
this function.  However as of 09-20-2016, this code has probably NOT been throughly tested.


return clone of specified object up to depth if supplied. Reference to propeties past depth are
returned as references to properties in specified Object. Functions are only cloned if not empty
as determined by EZ.isEmpty() i.e. have properties as does the top level EZ() object.

ARGUMENTS:
	obj		(required)	Object to clone
	depth	(optional)	zero based depth of cloning for properties typeof "object" or "function"
	options	(optional)	maxdepth, 
						functions=false to clone functions as new Object()
						objects=false to clone all Object types as new Object()

RETURNS:
	new object cloned from specified Object down to depth if specified.

http://heyjavascript.com/4-creative-ways-to-clone-objects/
// recursive function to clone an object. If a non object parameter
// is passed in, that parameter is returned and no recursion occurs.

function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    var temp = obj.constructor(); // give temp the original obj's constructor
    for (var key in obj) {
        temp[key] = cloneObject(obj[key]);
    }

    return temp;
}
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
			if (!EZ.isEmpty(obj))

TODO:
	extract, include ??
--------------------------------------------------------------------------------------------------*/
//EZcloneObject
if (EZ.createPrototype(function cloneObjectEZprototypeObject(options /*maxdepth*/, depth, dotName)
{
	//if (EZ.test.capture()) {return EZ.test.capture(this)} else if (EZ.test.debug()) debugger;
	EZ.clone.counts = EZ.clone.counts || {calls:0, fails:0, details:[]};
	
	var obj = this;
	if ( !(obj instanceof Object) )
		return obj;
	
	if (dotName === undefined)								//initialize options and depth if top level
	{
		depth = depth || 0;
		dotName = [''];										
		options = typeof(options) == 'number' ? {maxdepth: options}
				: typeof(options) == 'object' && !null ? options
				: {}
		options.topDepth = depth;
		options.maxdepth = options.maxdepth || 9;
		options.objectsProcessed = [];
		options.clonedObjects = [];
		options.pendingClones = [];
		options.counter = 0;
		options.exclude = EZ.toArray(options.exclude,', ');	//keys to exclude
		options.ignoredconstructor = {};
	
		options.rtnValue = {
			message: '',
			details: '',
			excludedList: [],								//keys actually excluded -- inc functions if omitted
			htmlElementCount: 0,
		//	ignoredconstructor: {}
		};
	}

	if (options.counter++ == 99) 
	{
		EZ.oops('too many recursive calls');
		options.rtnValue.message = options.rtnValue.message.concat('\n', EZ.oops.message).trim();
		options.rtnValue.details = EZ.oops.stacktrace;
		options.quit = true
	}
	if (options.quit) 										//development aid / safety
		return obj;

	var clone;												  //--------------------------\\
	if (obj instanceof RegExp)								 //---------- RegExp ----------\\
	{														//------------------------------\\
		clone = new RegExp(obj);
		clone.lastIndex = obj.lastIndex;
	}
															  //------------------------\\
	else if (obj instanceof Date)							 //---------- Date ----------\\
	{														//----------------------------\\
		clone = isNaN(obj) ? new Date('invalid') : new Date(obj.getTime());
	}
															  //----------------------------\\
	else if (typeof(obj) == 'function') 					 //---------- function ----------\\
	{														//--------------------------------\\
		clone = {};
		if (options.functions === false)					//if false, functions omitted 
		{													//...unless there are enumerable properties
			var keys = Object.keys(obj); 
			if (keys.length === 0
			|| (keys.length === 1 && keys.displayName))
			{
				options.rtnValue.excludedList.push(dotName.join('.'));
				return undefined;	
			}
		}
		else if (options.functions === true)				//TODO: don't like this as default
		{													//create new function from script
			var script = Function.prototype.toString.call(obj);
			if (!/\{\s*\[native code\]\s*\}/.test(script))
				eval('clone=' + Function.prototype.toString.call(obj));
		}
	}
															  //---------------------------\\
	else if (obj instanceof Element)						 //---------- Element ----------\\
	{														//-------------------------------\\
		options.rtnValue.htmlElementCount++;
		if (!options.children)
			return obj.cloneNode(true);
		
		clone = obj.cloneNode();
		delete clone.EZ;
		delete clone.EZ$;
		delete clone.EZgetEl;
		delete clone.EZfield;
		if (obj.children.length)
		{
			var childOpts = EZ.options.call(options, {functions:false});
			var childDotName = dotName.slice().concat(['children'])
			
			var children = obj.children.cloneObject(childOpts, depth+1, childDotName);
			Object.keys(children).forEach(function(key)
			{
				clone.appendChild(children[key]);
			});
		}
		return clone;
	}														  //--------------------------\\
	else													 //---------- Object ----------\\
	{														//------------------------------\\
		clone = {};									
		try
		{	
			if (EZ.isArray(obj))
				clone = [];
			else if (options.objects === false)				
			{
				if (obj.constructor != Object)
					EZ.mergeMessages(options.ignoredconstructor, obj.constructor.name, dotName.join('.'))
			}
			else 											//TODO: don't like this as default
				clone = new obj.constructor();				//try with original constructor
		}
		catch (e) 											//report but continue using {} constructor
		{
// 			EZ.oops(e.message)
			EZ.mergeMessages(options.ignoredconstructor, obj.constructor.name, dotName.join('.'))
		}
	}
	
	if (options.topDepth == depth)
	{
		options.objectsProcessed = [obj];
		options.clonedObjects = [clone];
	}
															
	var keys = Object.keys(obj);							  //-------------------------\\
	if (options.exclude.length)								 //----- excluded key(s) -----\\
	{														//-----------------------------\\
		var dotNameObj = dotName.slice().join('.');
		var regex = RegExp('^' + dotNameObj + "\\.");
				
		options.exclude.forEach(function(key)				
		{
			if (key.includes('.'))
				key = key.replace(regex, '')
			var idx = keys.indexOf(key);
			if (idx != -1)									//if obj contains exclude key...
			{												//...remove from keys list
				keys.splice(idx,1);							//...add dotName to excluded list
				options.rtnValue.excludedList.push(dotName.concat(key).join('.'));	
			}
		});
	}
															  //---------------------------\\
	keys.forEach(function(p)								 //----- Object properties -----\\
	{														//-------------------------------\\
		var idx;
		var dotNameNext = dotName.slice().concat([p]);
		var key = dotName.join('.');
		if (obj[p] instanceof Object === false)
			clone[p] = obj[p];								//copy value if not Object

		else if ((idx = options.objectsProcessed.indexOf(obj[p])) != -1)
		{													//if repeated object . . .
			if (idx < options.clonedObjects.length
			&& options.clonedObjects[idx] !== undefined)
				clone[p] = options.clonedObjects[idx]		//use prior clone if found
			else
				options.pendingClones[idx] = key;			//or add to pendingClones list
		}
		else												//otherwise . . .
		{
			options.objectsProcessed.push(obj[p]);			//add to objectsProcessed list

			var value = obj[p].cloneObject(options, depth+1, dotNameNext);
			if (value === undefined && options.functions === false)
				return;										//experimental
				
			clone[p] = value;
			
			idx = options.objectsProcessed.indexOf(obj[p])
			if (idx != -1 									//safety for unexpected
			&& options.clonedObjects[idx] === undefined) 	//if clone not yet saved...
		//	&& options.clonedObjects[idx] == null)		 	//if clone not yet saved...
				options.clonedObjects[idx] = clone[p];		//...save for pendingClones
		}
	});

	//----- if top level, populate pendingClones if any
	if (options.topDepth == depth)
	{
		options.pendingClones.forEach(function(key, idx)
		{
			if (!key || options.clonedObjects[idx] === undefined) return;
			var keys = key.split('.')
			var repeatKey = keys.pop();
			var repeatObj = keys.join('.').ov(clone);

			if (repeatObj instanceof Object
			&& !(repeatObj[repeatKey] in repeatObj))
				repeatObj[repeatKey] = options.clonedObjects[idx];
			else
				void(0);	//debugger breakpoint
		});
	
		options.rtnValue.ignoredconstructor = EZ.mergeMessages(options.ignoredconstructor);
		if (options.rtnValue.excludedList.length === 0)				//if no excluded values
		{
			var isEqual = true;
			if (typeof(obj) != 'function' && options.rtnValue.htmlElementCount === 0)
			{
				var eqOpts = {showDiff:true};
				//if (!options.rtnValue.ignoredconstructor)
					eqOpts.ignore = 'objectType';
				
			//	if (options.rtnValue.htmlElementCount)				//hangs
			//		eqOpts.html = true;
				
				isEqual = EZ.isEqual(obj, clone, eqOpts);
			}
			if (!isEqual)
			{
				EZ.log.call('clone', 
				{
					'prototype.cloneObject failed':EZ.getStackTrace(), 
					showDiff:EZ.equals.formattedLog, 
					obj:obj, 
					clone:clone
				})
				clone = EZ.cloneDev.object(obj, {objectszzz:false});
				/*				
				EZ.clone.counts.fails++;
				options.rtnValue.message = EZ.equals.formattedLog || '...differences detail NA...';
				var stack = EZ.getStackTrace();
				stack.unshift(options.rtnValue.message);
				options.rtnValue.details = stack;
				EZ.clone.counts.details.push(options.rtnValue.details);
				*/
			}
		}
		Object.keys(options.rtnValue).forEach(function(key)
		{															//remove empty rtnValue(s)
			var value = options.rtnValue[key];
			if (!value
			|| (value instanceof Object && Object.keys(value).length === 0))
				delete options.rtnValue[key]
		});
		EZ.clone.rtnValue = options.rtnValue;
	}
	//============
	return clone;
	//============
}))

//_____________________________________________________________________________________________
Object.prototype.cloneObject.test = function()
{
	var ex, ctx, json, note, obj, arr;

	//_______________________________________________________________________________
	
	ex = {a:1, b:2, arr: [1,2]};
	obj = ex;
	note = 'Object with embedded Array'
	EZ.test.run(ex, 								{EZ: {ex:ex, ctx:ex, note:note}})
	//_______________________________________________________________________________

	json = ''
	   + '[\n'
	   + '    "score", "offsets",\n'
	   + '    {\n'
	   + '        ____properties____: {\n'
	   + '            score: true,\n'
	   + '            scoreKey: true\n'
	   + '        }\n'
	   + '    }\n'
	   + ']';
	ex = EZ.json.parse(json)
	note = 'Array with named properties'
	EZ.test.run(ex, 								{EZ: {ex:ex, ctx:ex, note:note}})
	//_______________________________________________________________________________

	ex = EZ.test.data.fn
	note = 'function with named properties'
	EZ.test.run(ex, 								{EZ: {ex:ex, ctx:ex, note:note}})
	
	//_______________________________________________________________________________
	EZ.test.settings( {group:'Object with repeated properties'} );
	note = ''

	arr = [1,2];
	ex = {a:1, b:2, arr:arr, repeat:arr};
	EZ.test.run(ex, 								{EZ: {ex:ex, ctx:ex, note:note}})
	
	var x = {a:1};
	x.b = x;
	EZ.test.run(x);

	arr = [1];
	ex = {a:1};
	ex = ex.circular = ex;
	note = 'Object with circular property'
	EZ.test.run(ex, 								{EZ: {ex:ex, ctx:ex, note:note}})

	//_______________________________________________________________________________
	EZ.test.settings( {group:'excluded keys', exfn:exfn} );

	obj = {
		a: [0,1,2],
		b: '',
		o: {
			a: 'aaa'
		}
	}
	EZ.test.run(obj, {exclude:'.a'});
	EZ.test.run(obj, {exclude:'.o.a'});
	EZ.test.run(obj, {exclude:'a'});

	//_______________________________________________________________________________
	EZ.test.settings( {group:'html elements'} );

	var div = document.createElement('div');
	div.setAttribute('id', 'testDiv')
	var span = document.createElement('span');
	
	var divObj = {d:div}
	var bothObj = {d:div, s:span}
	void(divObj, bothObj)

	EZ.test.run(divObj, {})
	
	div.appendChild(span);
	EZ.test.run(divObj, {children:true, objects:false, functions:false, maxdepth:4})

	
	obj = {children:true, objects:Object, functions:false, maxdepth:4};
	EZ.test.run(obj)

	//=================================================================================
	function exfn(testrun)
	{
		testrun.setResultsArgument(0, EZ.clone.rtnValue, 'EZ.clone.rtnValue');
	}
	//=================================================================================
EZ.test.quit;
if (true) return;

	var testrun = {
		ex: [
			"score", "offsets",
			{
				____properties____: {
					score: true,
					scoreKey: true
				}
			}
		],
		note: 'ObjectLike Array with named keys<p>native JSON:<br>'
			+ '[<br>&nbsp;&nbsp;&nbsp;&nbsp;"score",<br>&nbsp;&nbsp;&nbsp;&nbsp;'
			+ '"offsets"<br>]',
		ctx: null,
		tags: [
			{
				EZ: {
					set: {}
				},
				EZgetEl: {}
			},
			{
				____properties____: {
					EZ: {
						set: {}
					},
					EZgetEl: {}
				}
			}
		],
		testno: 1,
		argValues: [],
		argsHTML: "",
		callArgs: "EZ.json_parse ( json )",
		display_args: ''
				 + '<pre class=\"EZtoString\"><i>(value): json</i> (String) [9 lines][\\n\n'
				 + '    \"score\", \"offsets\",\\n\n'
				 + '    {\\n\n'
				 + '        ____properties____: {\\n\n'
				 + '            score: true,\\n\n'
				 + '            scoreKey: true\\n\n'
				 + '        }\\n\n'
				 + '    }\\n\n'
				 + ']</pre>",\n'
				 + '',
		results: [
			"score", "offsets",
			{
				____properties____: {
					score: true,
					scoreKey: true
				}
			}
		],
		ok: false,
		okClass: "fail"
	}
	obj = {array: [testrun]}
	ex = obj
	EZ.test.run(obj,	 						{EZ:{ex:ex, ctx:ctx, note:note}})


	var div = document.createElement('div');
	var span = document.createElement('span');
	var divObj = {d:div}
	var bothObj = {d:span, s:span}

	EZ.test.run(divObj, 		{EZ: {ex:{d:div},       	note:''	}})
	EZ.test.run(bothObj, 		{EZ: {ex:{d:div, s:span},	note:''	}})

	var fn = function cloneTest(a,b) {return a*b}
	var results = EZ.test.run(fn, 		{EZ: {ex:fn,       	note:''	}})
	
	/* TODO: jshint: future vars - now unused */ e = [bothObj, results]	
}

/*--------------------------------------------------------------------------------------------------
EZ.clone(obj, depth)

More reliable and enhanced EZ.clone() varient -- used by EZcapture and EZtestAssistant

return clone of specified obj up-to specified depth -- if not Object returned as-is.

returns obj as-is if not Object -- uses json if depth > 0
Uses EZ.cloneNode() for html elements.

Supports Date() and RegExp() Objects at top level (i.e. obj is Date of RegExp)

ARGUMENTS:
	obj		(required)	Object cloned or returned as-is if not Object or null.
	
	depth	(Number)	depth of clone =0 top level only
			(Boolean)	=true (default) deep clone =false top level only
			(valueMap)	return obj (not clone) if it does not contain any valueMao.objList Objects
						used by EZtest_assistant.html
			(Array)		only copies keys specified as items

RETURNS:
	true if ... otherwise ...

TODO:
	include, exclude options
	use legacy EZ.clone once reliable for all embedded types and circular objects
	functions not tested
 	copy logic into EZ.mergeAll() if not already there
--------------------------------------------------------------------------------------------------*/
EZ.clone = function EZclone(obj, depth)
{
	EZ.clone.message = '';
	EZ.clone.detail = '';
	delete EZ.clone.fault, delete EZ.clone.json, delete EZ.clone.object;
	
	var isDeep = (depth === false || depth === 0) ? false 	//default
												  : (depth || true);
	var valueMap = null;
	var onlyKeys = null;
	
	if (EZ.getConstructorName(depth) == 'EZvalueMap')
		valueMap = depth;
	
	else if (EZ.isArray(depth))						//onlyKeys i.e, extract
		onlyKeys = depth;
	
	var cloneObj = (obj == null) ? obj				//null, undefined, blank or 0
				 
				 : (typeof(obj) == 'function') ? cloneFunction(obj)
				 
				 : !(obj instanceof Object) ? obj
				 
				 : (obj instanceof RegExp) ? cloneRegExp(obj)
				 
				 : (obj instanceof Date) ? new Date(obj)
				 
				 : EZ.isEl(obj) ? EZ.cloneNodes(obj)	//same as EZ.clone.legacy
				 									
				 : EZ.isArray(obj) ? cloneArray(obj)
				 
				 : cloneObject(obj)	
	
	//===============
	return cloneObj;
	//===============
	//________________________________________________________________________________________
	/**
	 *	
	 */
	function cloneObject(obj)	
	{	
		var msg = '';
		var clone = {};
		EZ.clone.object = obj;
		try										
		{
			if (onlyKeys)
			{
				onlyKeys.forEach(function(key)
				{
					var value = obj[key];
					//if (value == null) return;
					//clone[key] = EZ.isObjectCircular(value) || value;
					
					if (value == null || !EZ.isObjectCircular(value))
						clone[key] = value;
					else
					{
						clone[key] = EZ.isObjectCircular.object;
						msg.push(key);
					}
					
				///	clone[key] = (value == null || !EZ.isObjectCircular(value)) ? value
				///			   : EZ.isObjectCircular.object;
					
				});
				obj = clone
				if (msg.length)
					msg = EZ.s('circular keys', msg.length) + ': ' + msg.join(', ');
			}
			else if (valueMap)
			{
				var unsafeObjList = valueMap.objList;
				if (unsafeObjList.length === 0) 
					return obj;
					
				var objList = EZ.valueMap(obj).objList;
				var isSafe = !objList.some(function(obj)
				{
					if (unsafeObjList.includes(obj))
						return true;
				})
				if (isSafe) 
					return obj;
			}
			
			else if (!isDeep)								//top level clone only 
			{												
				Object.keys(obj).forEach(function(key)
				{
					clone[key] = obj[key];
				});
				return clone;
			}
			//----------------------------------------------------------------------------
			var msg = [];									//deep clone using json
			var json = EZ.stringify(obj)	//, 'native');
			if (EZ.stringify.message && !EZ.json.stringify)
				msg.push(EZ.stringify.message);
			try
			{
				eval('clone=' + json);					
				if (!EZ.equals(clone, obj, {showDiff:5, ignore:'objectType'}))
					msg = msg.concat(['clone not equal'], EZ.equals.formatedLog);
				
				while (msg.length === 0 && JSON.plus && false)	//JSON.plus
				{
					var opts = {							
						clone:true, validate:true, unquoteKeys:true, circular:true,
						keep: 'Undefined, NaN, Date, RegExp',	
						ignore: 'constructor'
					}
					var opts = 'JSON.plus.options.defaults.groups.cloning'.ov()
					var clonePlus = JSON.plus.stringify(obj, opts);
					
					var rtnValue = JSON.plus.rtnValue();
					if (rtnValue.getMessage())
						EZ.oops('JSON.plus message: ' + rtnValue.getMessage(), rtnValue);
					
					else if (!EZ.equals(clone, clonePlus, {showDiff:5}))
						EZ.oops('EZ.clone diff form JSON.plus', EZ.equals.formatedLog);
					break;
				}
			}
			catch (e)
			{
				msg = e.stack.formatStack();
				var details = 'na'	// EZ.parse(json);
				clone = {
					"[error]": msg,
					details: details
				}
				cloneFail(msg.join('\n'), EZ.parse(json));
			}
			return clone;	
		}
		catch (e)
		{
			msg = e.stack.formatStack();
			/*
			EZ.oops( 'EZ.clone() failed ', {details: e});
			clone = {
				"[error]": EZ.oops.message,
				details: EZ.oops.details
			}
			
			EZ.clone.fault = EZ.techSupport(e, arguments);
			EZ.clone.message = EZ.clone.fault.message;
			*/
			/*
			'"{cloneObject:' + "'failed', reason:"
					+ "'" + e.message.replace(/'/g, '') + "'"
					+ '}"';
			*/
		}
		if (msg.length)
			cloneFail('', msg)
		
		//=============
		return clone;
		//=============
		/**
		 *
		 */
		function cloneFail(msg, details)
		{
			msg = 'EZ.clone() failed: ' + msg;
			details = details || '';
			
			EZ.clone.counts = EZ.clone.counts || {calls:0, fails:0};
			EZ.clone.counts.fails++;
			EZ.log.call('clone', msg, details)
			
			EZ.clone.message = details || '...differences detail NA...';
			if (details)
				EZ.clone.details = EZ.parse(json);
		}
	}
	/**
	 *	Does slice for Array arguments and appends named Arguments if any
		var argClone = EZ.isArray(arg) ? cloneArray(arg)
					 : EZ.getObjectType(arg) == 'Object' ? EZ.mergeAll(arg) 
					 : arg;
	 */
	function cloneArray(obj)	
	{
		if (isDeep)
		{
			//return cloneObject(obj);		
			return (Object.keys(obj).length === 0) ? [] : cloneObject(obj);		
		}
	
		//TODO: copy logic into EZ.mergeAll() if not already there
		var clone = obj.slice();
		(Object.keys(obj) || []).forEach(function(key)
		{
			clone[key] = obj[key];
		});
		return clone;
	}

	function cloneRegExp(obj)
	{
		var clone = new RegExp(obj);
		clone.lastIndex = obj.lastIndex;
		return clone;
	}
		
	function cloneFunction(obj)
	{
		var fn;
		eval('fn = ' + obj);
		Object.keys(obj).forEach(function(key)
		{								//copy any enumerable properties
			fn[key] = obj[key];
		});
		return fn;						//return function
	}			
}
//________________________________________________________________________________________
/**
 *	
 */
EZ.clone.test = function()
{	
	var msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, , rtnValue];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
    
	note = 'nogo';
	obj = {
        ok: true,
        testno: 10,
        id: "arg1=1st arg (obj):[a,b],1st arg (obj).a:1,1st arg (obj).b:[0,1,2],1st arg (obj).b[0]:0,1st arg (obj).b[1]:1,1st arg (obj).b[2]:{1st arg (obj)},arg2=2nd arg (replacer):native,note:<b>simpleJSON.stringify()circularobjects</b>",
        note: "<b>simple JSON.stringify() circular objects</b>\n\n<em>1st expected argument is Object created from json</em>\n<b>returned json GOOD -- expected results set to actual<b><pre>[Object]: \n   circularList (Array) (length=1):\n     [0]: \"$.b.2=$\"\n   objectList (Array) (length=2):\n     [0]: \"$\"\n     [1]: \"$.b\"\n</pre>",
        warn: "<i>expected values changed by test script</i>",
        actual: {
            0: {
                a: 1,
                b: [
                    0,
                    1,
                    {
                        "@circular@": "$.9.actual.0.b.2=$.9.actual.0"
                    }
                ]
            },
            1: "native",
            results: "JSON._temp={\n    a: 1,\n    b: [\n        0,\n        1,\n        {\n            \"@circular@\": \"$.b.2=$\"\n        }\n    ]\n};JSON.setCircular(JSON._temp)"
        },
        expected: {
            results: "JSON._temp={\n    a: 1,\n    b: [\n        0,\n        1,\n        {\n            \"@circular@\": \"$.b.2=$\"\n        }\n    ]\n};JSON.setCircular(JSON._temp)"
        },
        saveDateTime: "11-04-2016 06:06:06 pm"
    }

//_____________________________________________________________________________________________
//below from EZ.clone.legacy
//_____________________________________________________________________________________________
	var ex, ctx, json, note, obj;


	obj = {a:1, b:2, arr: [1,2]};
	EZ.test.run(obj, 		{EZ: {ex:obj,       	note:''	}})

	// #3
	json = ''
	   + '[\n'
	   + '    "score", "offsets",\n'
	   + '    {\n'
	   + '        ____properties____: {\n'
	   + '            score: true,\n'
	   + '            scoreKey: true\n'
	   + '        }\n'
	   + '    }\n'
	   + ']';
	obj = EZ.json.parse(json)
	ex = ''
	EZ.test.run(obj,									{EZ: {ex:ex, note:note}})
	//____________________________________________________________________________
	var testrun = {
		ex: [
			"score", "offsets",
			{
				____properties____: {
					score: true,
					scoreKey: true
				}
			}
		],
		note: 'ObjectLike Array with named keys<p>native JSON:<br>'
			+ '[<br>&nbsp;&nbsp;&nbsp;&nbsp;"score",<br>&nbsp;&nbsp;&nbsp;&nbsp;'
			+ '"offsets"<br>]',
		ctx: null,
		tags: [
			{
				EZ: {
					set: {}
				},
				EZgetEl: {}
			},
			{
				____properties____: {
					EZ: {
						set: {}
					},
					EZgetEl: {}
				}
			}
		],
		testno: 1,
		argValues: [],
		argsHTML: "",
		callArgs: "EZ.json_parse ( json )",
		display_args: ''
				 + '<pre class=\"EZtoString\"><i>(value): json</i> (String) [9 lines][\\n\n'
				 + '    \"score\", \"offsets\",\\n\n'
				 + '    {\\n\n'
				 + '        ____properties____: {\\n\n'
				 + '            score: true,\\n\n'
				 + '            scoreKey: true\\n\n'
				 + '        }\\n\n'
				 + '    }\\n\n'
				 + ']</pre>",\n'
				 + '',
		results: [
			"score", "offsets",
			{
				____properties____: {
					score: true,
					scoreKey: true
				}
			}
		],
		ok: false,
		okClass: "fail"
	}
	obj = {array: [testrun]}
	ex = obj
	EZ.test.run(obj,	 						{EZ:{ex:ex, ctx:ctx, note:note}})
EZ.test.skip(99999);


	var div = document.createElement('div');
//	var span = document.createElement('span');
	var divObj = {d:div}
//	var bothObj = {d:span, s:span}

	EZ.test.run(divObj, 		{EZ: {ex:{d:div},       	note:''	}})
//	EZ.test.run(bothObj, 		{EZ: {ex:{d:div, s:span},	note:''	}})

	var fn = function cloneTest(a,b) {return a*b}
	EZ.test.run(fn, 		{EZ: {ex:fn,       	note:''	}})
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.cloneNodes = function EZcloneNodes(nodes,options)
{
	var clones = [];
	nodes = false && EZ.isEl(nodes)
		  ? EZ(nodes,true)
		  : EZ.toArray(nodes);

	nodes.forEach(function(node)
	{
		clones.push(node.cloneNode(true));
	});
	if (options !== false)
		EZ.bindElements(clones);

	return clones;
}
/*--------------------------------------------------------------------------------------------------
EZ.clone(obj, depth)

return clone of specified object up to depth if supplied. Reference to propeties past depth are
returned as references to properties in specified Object. Functions are only cloned if not empty
as determined by EZ.isEmpty() i.e. have properties as does the top level EZ() object.

ARGUMENTS:
	obj		(required)	Object to clone
	depth	(optional)	zero based depth of cloning for properties typeof "object" or "function"

RETURNS:
	new object cloned from specified Object down to depth if specified.

TODO:
	does not copy named Array item properties

http://heyjavascript.com/4-creative-ways-to-clone-objects/
// recursive function to clone an object. If a non object parameter
// is passed in, that parameter is returned and no recursion occurs.

function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    var temp = obj.constructor(); // give temp the original obj's constructor
    for (var key in obj) {
        temp[key] = cloneObject(obj[key]);
    }

    return temp;
}
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create

--------------------------------------------------------------------------------------------------*/
EZ.clone.legacy = function EZclone_legacy(obj, depth)	//*****  refactored version above *****/
{
	if (EZ.test.capture()) {return EZ.test.capture(this)} else if (EZ.test.debug()) debugger;

	if (!obj || 'object function'.indexOf(typeof(obj)) == -1) return obj;

	if (EZ.isEl(obj)) return EZ.cloneNodes(obj);	//html element
	if (EZ.isArray(obj))
	{
		return obj.slice();			//Array
	}

	var properties = (EZ.is(depth,cloneProperties)) ? depth : new cloneProperties();
	function cloneProperties()
	{								//set properties when not recursive call
		this.depth = 0;
		this.maxDepth = depth;
		this.objectsProcessed = [];
		this.counter = 0;
	}

	var p, newObj = '';
	switch(typeof obj)
	{
		case 'function':
		{
			if (!EZ.isEmpty(obj))
			{
				var patternFunction = /function\s*(\w*)\s*\((.*?)\)[^{]*{\s*([\s\S]*)}/;
				var funcScript = obj.toString();
				var results = funcScript.matchPlus(patternFunction);
				var name = obj.name || obj.displayName || results[1];
				var args = results[2];
				var code = '//clone of: ' + name + '\n'
						 + results[3];
				newObj = new Function(args,code);
			}
		}
		/* jshint ignore:start*/	//FALL-thru ??
		case 'object':
		/* jshint ignore:end */
		{
			if (++properties.counter > 99) undefined.EZclone;
			if (EZ.quit) return obj;
			if (obj == null) return null;
			if (EZ.isArray(obj)) return obj.slice();

			if (!newObj)
				newObj = EZ.isArrayLike(0) ? [].slice.call(obj) : {};

			for (var p in obj)
			{
				if (!isNaN(obj)) continue;
				if (obj.hasOwnProperty && !obj.hasOwnProperty(p)) continue;

				if (!obj[p] || typeof obj[p] != "object")
					newObj[p] = obj[p];

				else  if (EZ.isArray(obj[p]))
					newObj[p] = obj[p].slice()

				else if (properties.objectsProcessed.indexOf(obj[p]) != -1)
					newObj[p] = obj[p];

				 else
				 {
					properties.objectsProcessed.push(newObj[p]);
					newObj[p] = EZ.clone(obj[p], depth+1, properties);
					properties.objectsProcessed.pop();
				}
			}
			return newObj;
		}
		return obj;			//function case: jshint
		
		default:
		{
			return obj;
		}
	}
};
/*--------------------------------------------------------------------------------------------------
EZ.collapse(arg [, delimiter])

return 1st Array item if arg is ArrayLike and length > 0
-OR- empty string if arg undefined, null, empty string or ArrayLike length=0
-OR- arg as is if typeof boolean or number

if arg is String and delimiter is specified, 1st convert toArray() using delimiter.
--------------------------------------------------------------------------------------------------*/
EZ.collapse = function EZcollapse(arg, delimiter, recursive)
{
	if (EZ.test.capture()) {return EZ.test.capture(this)} else if (EZ.test.debug()) debugger;

	if (arg == null || arg === '')	return [];

	recursive = recursive || (arguments.length < 2 ? delimiter === true : false)
	recursive = recursive.isTrueFalseValue();

	if (typeof(arg) == 'string' && typeof(delimiter) == 'string' && delimiter !== '')
		arg = EZ.toArray(arg, delimiter);

	if ('boolean number'.indexOf(typeof(arg)) != -1) return arg;

	if (EZ.isArray(arg) || EZ.isArrayLike(arg))
		arg = arg.length ? arg[0] : '';

	if (recursive && EZ.isArrayLike(arg))
		arg = EZ.collapse(arg, recursive);

	return arg;
}
// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
EZ.collapse.test = function()
{
	EZ.test.run(null				, {EZ: {ex:''	}})
	EZ.test.run([]					, {EZ: {ex:''	}})
	EZ.test.run(''					, {EZ: {ex:''	}})
	EZ.test.run(undefined			, {EZ: {ex:''	}})
	EZ.test.run(true				, {EZ: {ex:true }})
	EZ.test.run([true]				, {EZ: {ex:true }})
	EZ.test.run(false				, {EZ: {ex:false}})
	EZ.test.run([false]				, {EZ: {ex:false}})
	EZ.test.run(1					, {EZ: {ex:1    }})
	EZ.test.run(0					, {EZ: {ex:0    }})
	EZ.test.run('0'					, {EZ: {ex:'0'  }})
	EZ.test.run([1,2,3]				, {EZ: {ex:1	}})
	EZ.test.run(['a', 'b']			, {EZ: {ex:'a'  }})
	EZ.test.run('1, 2, 3'			, {EZ: {ex:'1, 2, 3' }})
	EZ.test.run('1, 2, 3', false	, {EZ: {ex:'1, 2, 3', note:'delimiter/recursive ignored if false'}})

	var arr = [1,2];
	var arrayOfArrays = [arr, 'b'];
	EZ.test.run(arrayOfArrays, true, 		{EZ: {ex:arr,
											note:'recursive=delimiter when true and recursive omitted'}})
	EZ.test.run(arrayOfArrays, false, 		{EZ: {ex:arr	}})
	EZ.test.run(arrayOfArrays, true, true,	{EZ: {ex:1		}})
	EZ.test.run(arrayOfArrays, true, false, {EZ: {ex:arr	}})
	EZ.test.run(arrayOfArrays, true, 'yes', {EZ: {ex:1		}})
	EZ.test.run(arrayOfArrays, true, 'no', 	{EZ: {ex:arr	}})
	EZ.test.run(arrayOfArrays, true, 'on',	{EZ: {ex:1		}})
	EZ.test.run(arrayOfArrays, true, 'off', {EZ: {ex:arr	}})

	var fn = function() {};
	var obj = {}
	var objArrayLike = [1]; obj.other = 'abc';
	var objArrayEmpty = []; objArrayEmpty.other = 'empty';

	EZ.test.run(fn					, {EZ: {ex:fn,
										note:'needs working EZ.clone(fn) to recognize passed' }})
	EZ.test.run(obj					, {EZ: {ex:obj  }})
	EZ.test.run(objArrayLike		, {EZ: {ex:1	}})
	EZ.test.run(objArrayEmpty		, {EZ: {ex:''	}})

	var doc = document.cloneNode();
	var none = EZnone(true)
	var tags = document.getElementsByTagName('body');

[doc]
//TODO: EZtest_assistant freezes
//	EZ.test.run(doc					, {EZ: {ex:doc  	}})
	EZ.test.run(none				, {EZ: {ex:none		}})
	EZ.test.run(tags				, {EZ: {ex:tags[0]	}})
	EZ.test.run(tags[0]				, {EZ: {ex:tags[0]	}})

	var obj = {key:'this is the time for all good men to enjoy life'};
	EZ.test.run(obj, 				{EZ: {ex:obj, note:'non-array object'	}})
	
	EZ.test.run({key:'this is the time for all good men to enjoy life'},
									{EZ: {ex:obj, note:'non-array object'	}});
	
	EZ.test.run({key:'this is obj'},	{EZ: {ex:{key:'this is obj'} }});

	EZ.test.run({}					, {EZ: {ex:{}			}})
	EZ.test.run({a:1,b:2}			, {EZ: {ex:{a:1,b:2}	}})
}
/*---------------------------------------------------------------------------------------------
EZ.compare(oldValue, newValue)

compares 2 Strings or stringified Value/Object via winMerge.

oldValue and/or newValue can be EZfile Object to compare one or both files.

Originally written for EZtest_assistant to compare actual test results to expected results.

TODO:
	 CREATE compare.bat if not found.
	 integrate into EZ.equals() 
---------------------------------------------------------------------------------------------*/
EZ.compare = function EZcompare(oldValue, newValue, options)
{
	options = EZ.options.call(options);
//	if (options.waitEl)	
//		EZ.message.wait('comparing', options.waitEl);
	/*
	var defaultOptions = {
		dl: 'old',
		dr: 'new'
	}
	options = EZ.options.call(defaultOptions, options);
	*/
	var formatter = options.formatter;
	var formatOpts = options.formatOpts;
	if (!formatOpts)
		formatOpts = (formatter == 'EZtoString') ? {} : '*';
	if (formatter == 'EZtoString')
	{
		formatOpts.htmlformat = false;
		formatOpts.collapse = false;
	}
	
	oldValue = oldValue || EZ.compare.oldValue || 'NA';
	newValue = newValue || EZ.compare.newValue || 'NA';
	
	oldValue = EZ.compare.oldValue = (typeof(oldValue) == 'string' || EZ.is(oldValue, EZ.filePlus)) ? oldValue 
								   : (options.formatter == 'EZtoString') ? EZ.toString(oldValue, formatOpts)
								   										 : EZ.stringify(oldValue, formatOpts);
	newValue = EZ.compare.newValue = (typeof(newValue) == 'string' || EZ.is(newValue, EZ.filePlus)) ? newValue
								   : (options.formatter == 'EZtoString') ? EZ.toString(newValue, formatOpts)
								   										 : EZ.stringify(newValue, formatOpts);
	var folder = EZ.constant.configPath + 'Shared/EZ/';
	var oldFile = folder + 'compare.old.txt'; 
	var newFile = folder + 'compare.new.txt'; 
	
	if (typeof(oldValue) == 'string')
	{
 		options.dl = options.dl || 'OLD';
		DWfile.write(oldFile, oldValue);
	}
	else
	{
 		options.dl = options.dl || oldValue.filename;
 		oldFile = oldValue.fullpathname;
 	}
	
	if (typeof(newValue) == 'string')
	{
 		options.dr = options.dr || 'NEW';
		DWfile.write(newFile, newValue);
	}
	else
	{
 		options.dr = options.dr || newValue.filename;
 		newFile = newValue.fullpathname;
 	}
	/*
	var args = '', cmd;
	var cmd = folder + 'compare.bat';
	if (typeof(oldValue) != 'string' || typeof(newValue) != 'string')
	{
		cmd = folder + 'comparePlus.bat';
		
		args = oldFile.wrap('"') + ' '
			 + newFile.wrap('"') + ' '
			 + options.dl.wrap('"') + ' '
			 + options.dr.wrap('"');
	}
	EZ.compare.rtnValue = dw.launchApp('"' + cmd + '"', args);
	*/
	//----------------------------------------------------------
	setTimeout( function() 
	{
		var cmd = folder + 'comparePlus.bat';
		var args = oldFile.wrap('"') + ' '
			 + newFile.wrap('"') + ' '
			 + options.dl.wrap('"') + ' '
			 + options.dr.wrap('"');
		
		EZ.compare.rtnValue = dw.launchApp('"' + cmd + '"', args);
		//console.clear();
		//console.log(EZ.compare.rtnValue)	
	}, 250);
}
/*--------------------------------------------------------------------------------------------------
EZ.concat(strings, separator)
EZ.concatStrings(strings, separator)

Concatenate non-empty strings -- separated with specified separator or \n
Great for combining messages -- or other optional strings

USAGE:
	append msg if not blank with \n inserted between message and msg
	message = EZ.concatStrings(message,msg)
	message = EZ.concatStrings([message,msg], '<br>')

ARGUMENTS:
	strings		array of strings to concatenate	if Array-Like object
				otherwise all arguments are concatenated

	separator	(optional) specifies separator inserted between concatenated strings
				only recognized if strings is array otherwise its part of strings.

RETURNS:
	concatenated strings separated with specified separator or \n
--------------------------------------------------------------------------------------------------*/
EZ.concat = EZ.concatStrings = function EZconcat(strings, separator)
{
	var array = EZ.arrayFromArguments(arguments);
	separator = (typeof(strings) != 'string' ? separator : '') || '\n';

	//----- convert all array elements to strings -- discarding if blank
	for (var i=0; i<array.length; i++)
	{
		while (i<array.length)
		{
			if (array[i] == null)
				array[i] = '';
			array[i] = array[i] + '';
			if (array[i] === '')
				array.splice(i,1);
			else
				break;
		}
	}

	//----- return string from array elements -- join using separator if length > 1
	switch(typeof array)
	{
		case 0: return '';
		case 1: return array[0];
		default: return array.join(separator);
	}
}
/*--------------------------------------------------------------------------------------------------
Return unescaped cookie value or blank if cookie not found.
Note: cookies only available when html file run from server
--------------------------------------------------------------------------------------------------*/
EZ.cookie.get = function EZcookieGet(name)
{
	var value = '';

	// Escape regexp special characters permitted for cookie names
    name = name.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');

    var regex = new RegExp('(?:^|;)\\s?' + name + '=(.*?)(?:;|$)','i');
    var results = document.cookie.match(regex);
	if (results && results.length > 0)
		value = unescape(value=results[1]);

	// supplemental return
	var allValues = value.replace(/\n/g,'@@').split('|');
	if (allValues)
		allValues = allValues.join('\n').replace(/@@/g,'\n\t');
	if (!allValues) allValues = 'N/A';
	EZ.cookie.allValues = allValues;

	// return blank or unescaped value
	return value;
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.cookie.remove = function EZcookieRemove(name)
{
	EZ.cookie.set(name,"",-1)
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.cookie.set = function EZcookieSet(name, value, days)
{
	var expires = "";
	if (days)
	{
		var date = new Date();
		date.setTime(date.getTime() + (days*24*60*60*1000));
		expires = "; expires=" + date.toGMTString();
	}
	document.cookie = name + "=" + value+expires + "; path=/";
}
/*--------------------------------------------------------------------------------------------------
EZ.displayMessage(msg, timer)		   minimal functionality clone from EZregex

Update or clear message -- outer div (g.message)

EZ.displayMessage.blank -- contains message diplayed for blank

TODO: 
	scrollInto view

	var opts = {delay: 1000, floatNode: el}
	if (tagType == 'body')
	{
		opts.el = EZ('warnings');
		opts.left = '';
		opts.right = '10px';
		opts.top = EZ('body').scrollTop + (EZ.getBrowserOffsets().height / 2);
	}
	EZ.displayMessage('no reload required', opts);

--------------------------------------------------------------------------------------------------*/
EZ.displayMessage = function EZdisplayMessage(msg, timer)
{
	//var el = EZ.isEl(timer) ? timer : undefined;
	var defaultOptions = {
		delay: 15000,
		floatNode: undefined,
		selectors: ['message', 'msg']
	}
	var defaults = {number: 'delay', element:'floatNode'};
	var options = EZ.options(timer, defaultOptions, defaults); 

	//--------------------------------------------------------------------
	// legacy code
	//--------------------------------------------------------------------
	if (EZ.isLegacy())						
	{
		// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
		if (EZ.displayMessage.timeOut) clearTimeout(EZ.displayMessage.timeOut);
		EZ.displayMessage.timeOut = '';
	
		if (msg === true) msg = '';
		if (!msg) msg = '';
	
		var el = document.getElementById('message')
			  || document.getElementsByClassName('message')[0];
	
		if (el)			//if message el found . . .
		{
			el.innerHTML = msg || EZ.displayMessage.blank || '&nbsp;';
			var wrap = el.parentNode;
			if (wrap)
			{
				if (EZ.hasClass(wrap, 'hidden')
				|| wrap.style.position == 'absolute')
					EZ.displayMessage.hidden = true;
				if (EZ.displayMessage.hidden)
					wrap.style.display = (msg) ? 'block' : 'none';
			}
			// if timer, clear (or TODO: restore) message after timer milliseconds
			if (msg && timer)
			{
				clearTimeout(EZ.displayMessage.timer);
				EZ.displayMessage.timeOut = setTimeout(function()
				{
					EZ.displayMessage()
				}, timer);
			}
		}
		else if (msg)	//if not message el . . .
			alert( msg.replace(/<br.*?>/g, '\n') );
		// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
		return;			//return after legacy code
	}
	//--------------------------------------------------------------------
	// updated code: 06-17-2016
	//--------------------------------------------------------------------
	var messageReset = function(cancelTimer)	//clear timer and hide	
	{										
		var node = EZ.displayMessage.floatNode;
		if (!node) return '';
		
		if (EZ.displayMessage.timer) 
		{
			clearTimeout(EZ.displayMessage.timer);
			EZ.displayMessage.timer = '';
		}
		if (cancelTimer === undefined && EZ.displayMessage.toggle > new Date().getTime())
			return;
		if (cancelTimer)						//keep displayed until next click
			return EZ.displayMessage.toggle = new Date().getTime() + 1000;			
		
		if (EZ.displayMessage.style)			//TODO: restore prior styles if any
		{
			Object.keys(EZ.displayMessage.style).forEach(function(key)
			{								
				EZ.displayMessage.node.style[key] = EZ.displayMessage.style[key];
			});
			delete EZ.displayMessage.style;
		}
		else node.style.display = 'none';		//hide but keep node as debug aid
		return node;
	}
	//======================================================================
	var msgNode = messageReset(false);	//if prior msg, hide and return node
	if (msg === true) msg = '';
	if (!msg) msg = '';
										//get static message node
	var node = EZ.displayMessage.node = document.getElementById('message')
						  			 || document.getElementsByClassName('message')[0];

	if (typeof(options.floatNode) == 'object')	
	{									//display floating msg if floatTag
		node = '';						//get or create tag
		if (msg)
		{
			var styles = {
				position: 'absolute',			
				visibility: 'visible',
				fontFamily: 'Arial',
				zIndex: 99999
			};
			node = EZ.displayMessage.floatNode = msgNode 
											  || EZ.createLayer('messageFloat', 'div', styles);
			EZ.addClass(node, 'textbox');
			var offsets = EZ.getOffsets(options.floatNode);
			
			var top = 'top' in options ? options.top : offsets.bottom + 2;
			var left = 'left' in options ? options.left : offsets.right + 2;
			var right = 'right' in options ? options.right : '';
			var bottom = 'bottom' in options ? options.bottom : '';
			
			if (top !== '') node.style.top = EZ.toInt(top) + 'px';
			if (left !== '') node.style.left = EZ.toInt(left) + 'px';
			if (right !== '') node.style.right = EZ.toInt(right) + 'px';
			if (bottom !== '') node.style.bottom = EZ.toInt(bottom) + 'px';

			if (options.delay)				//show for delay seconds
				EZ.displayMessage.timer = setTimeout(messageReset, options.delay);
			
			EZ.show(node);
			/*
			if (EZ.popup.add) EZ.popup.add(node);
			node.style.display = 'block';
			if (node.style.visibility == 'hidden')
				node.style.visibility = '';
			*/
			node.onmouseup = function() { setTimeout(messageReset, 500) };
			node.ondblclick = function() { messageReset(true) };
		}
	}
	if (node)								//if message node found . . .
	{
		EZ.set(node, msg || '&nbsp;');
		var msgContainer = EZ.displayMessage.node.parentNode;
		if (msgContainer)
		{
			if (EZ.hasClass(msgContainer, 'hidden')
			|| msgContainer.style.position == 'absolute')
				EZ.displayMessage.hidden = true;
			
			if (EZ.displayMessage.hidden)
				msgContainer.style.display = (msg) ? 'block' : 'none';
		}
	}
	else if (msg)							//alert if no message node
		alert( msg.replace(/<br.*?>/g, '\n') );
}
/*--------------------------------------------------------------------------------------------------
EZ.EZ.merge(o, options)
String.formatStack(options)

whats up...

ARGUMENTS:
	String		...
	options		(optional) Object containing one or more of the following properties:
				skipCount	number of function to remove from top of stack
	...			blah blah
			Array or delimited string (values separated by commas or spaces)


RETURNS:
	true if ... otherwise ...

REFEERENCE:
	http://www.cssscript.com/small-javascript-alert-confirm-dialog-replacement-custom-alert/
	more options
	http://www.cssscript.com/demo/simple-modal-dialog-javascript-plugin-popupmodal-js/ 
	
TODO:
--------------------------------------------------------------------------------------------------*/
EZ.message = (function _____EZmessage_____()
{
	EZ.defaultOptions.message = {			//default options
		
		defaults: {Number: 'delay', Element:'floatNode', 'Function':'callback'},
		
		floatNode: undefined,				//shared by all: alert, confirm, promp and message
		
		message: {							//message  options
			blank: '&nbsp;',				//html displayed when cleared
			delay: 15000,						
			selectors: ['message', 'msg'],
			close: true
		},
		'alert': {
			ok: 'OK',
			title: 'Alert!',
		},
		'confirm': {
			'yes': 'YES',
			'no': 'NO',
			'title': 'Confirm:',
			'return': false
		},
		modal: true,						//shared by: alert, confirm, prompt
		keyboard: true,
		inputLength: 99,
		callback: undefined,						
		nativeList: ['alert'],				//native window functions overridden
		
		tags: {
			'alert': null,
			'confirm': null,
			'prompt': null,
			overlay: null,
			message: null,
			floatNode: null
		},
		
		floatTag: {
			id: 'EZmessageMessageFloat',
			class: 'textbox',
			styles: {
				position: 'absolute',			
				visibility: 'visible',
				fontFamily: 'Arial',
				zIndex: 99999
			},
			nodes: [
				{
					tagName: 'div',
					id: 'EZfloatWrap',
					styles: {
						opacity: '0.2',
						transition: 'opacity 3.0s ease-out'
					},
					nodes: [
						{
							tagName: 'img',
							id: 'EZfloatClose',
							src:"../images/close.png",
							title: 'close',			
							styles: {
								float: 'right',
								margin: '-4px -2px 0 2px'
							}
						},{
							tagName: 'div',
							id: 'EZfloatMessage',
							styles: {
								float: 'left',
								display: 'none'
							},
						},{
							tagName: 'details',
							id: 'EZfloatDetail',
							styles: {
								float: 'left',
								fontSize: '12px',
								display: 'none'
							},
							nodes: [
								{
									tagName: 'summary',
									id: 'EZfloatDetailSummary'
								},{
									tagName: 'pre',
									class: 'pre',
									id: 'EZfloatDetailMessage'
								}
							]
						}
					]
				}
			]
		},
		floatOffsets: {},
		floatOffsetsBody: {top: '4px', left: '4px', right: 'initial', bottom: 'initial'},

		waitTag: {
			id: 'EZmessageWait',
			styles: {
				position: 'absolute',
				margin: '-19px 0 0 0px',
				backgroundColor: 'aqua',
				borderRadius: '6px',
				padding: '4px 3px 1px 1px',
				boxShadow: '1px 1px 1px 2px #b9b5b5',
				zIndex: '99',
				visibility: 'hidden',
				fontWeight: 'bold'
			},
			nodes: {
				img: {
					src: "../images/hourglass.png",
					styles: {
						verticalAlign: 'baseline'
					}
				},
				i: {
					id: 'EZmessageWaitText',
					styles: {
						display: 'inline-block',
						height: '16px',
						verticalAlign: 'text-bottom'
					}
				},
				text: ' ...'			//replaced with tweaked EZ.MORE
			}
		},
		waitOffsets: {},
		tickTockTag: {
			id: "EZtickTock",
			preload: "auto",
			volume: 0.5,
			playbackRate: 1.25,
			loop: true,
			src: "../sounds/tick-tock-clock.wav"
			//src: "../sounds/tictac.wav"
		},
		
		_defaults:							//EZ.message._ default properties (not complete list)
		{
			overflow: null,					//default <html> overflow when overlay displayed
			timers: [],
			active: {
				float: null,
				delay: null,
				wait: null,
				static: []					//TODO: future
			},
		},		
		name: 'EZ.message.options',
		version: '08-20-2016'
	}
	//__________________________________________________________________________________________________
	/**
	 *	constructor for _init() -OR- EZ.message() interface
	 */
	function EZmessage()
	{										//NOT called as constructor -- call _message(...)
		if ( !(this instanceof arguments.callee))	
		{
			var args = [].slice.call(arguments);
			return _message.apply(EZ.message, args);	
		}
											 //-------------------------------\\
		this._ = {};						//----- called as constructor -----\\		
		//__________________________________________________________________________________________________
		/**
		 *	Internal function 
		 */
		this._getTag = function(name)
		{
			var tag = EZ.message.options.tags[name];
			if (!tag) return;
			
			return EZ(tag, null);
		}
		//__________________________________________________________________________________
		/**
		 *	Internal function used by show, hide or toggle modal overlay
		 *
		 *	note: html overflow settings needed to dim scrollbars
		 */
		this._modal = function(isShow)
		{
			var _ = EZ.message._;				
			if (isShow === undefined)
				this.options.modal
			
			if (isShow)							//show
			{									
				if (!_.overlay)
					_.overlay = EZ.createTag( {"id": "EZmessageOverlay"}, 'body');
				
				_.overflow = document.getElementsByTagName("html")[0].style.overflow;
				document.getElementsByTagName("html")[0].style.overflow = "hidden";
				_.overlay.style.display = 'block';
			}
			else if (_.overflow != null)		//hide if showing
			{
				document.getElementsByTagName("html")[0].style.overflow = _.overflow;
				delete _.overflow;
				_.overlay.style.display = 'none';
			}
		}
		//__________________________________________________________________________________
		/**
		 *	Internal function -- sets absolute node offsets relative to anchorNode
		 */
		this._setNodeOffsets = function(node, anchorNode, options)
		{
			anchorNode = EZ(anchorNode, null) || EZ('body');
			var offsets = EZ.getOffsets(anchorNode);
			if (anchorNode.tagName == 'BODY')
				options = this.options.floatOffsetsBody;
			
			var browserOffsets = EZ.getBrowserOffsets();

			var top = 'top' in options ? options.top : offsets.bottom + 2;
			var left = 'left' in options ? options.left : offsets.right + 4;
			var right = 'right' in options ? options.right : '';
			var bottom = 'bottom' in options ? options.bottom : '';
			
			if (top !== '') node.style.top = EZ.toInt(top) + 'px';
			if (left !== '') node.style.left = EZ.toInt(left) + 'px';
			if (right !== '') node.style.right = isNaN(right) ? right : (right + 'px');
			if (bottom !== '') node.style.bottom = isNaN(bottom) ? bottom : (bottom + 'px');

			if (options.marginTop)
				node.style.marginTop = options.marginTop;

			var maxWidth = browserOffsets.outerWidth - EZ.toInt(left) - 40;
			node.style.maxWidth = (maxWidth-15) + 'px';

			return anchorNode;
		}
		//__________________________________________________________________________________
		/**
		 *	Internal function used for relative / floatNode messages
		 *	clear timer(s), clear onmouseup event (sets persist), remove delay class
		 *	and kill tick-tock sound
		 */
		this._messagePersist = function(evt)	
		{										
			void(evt);
			var _ = EZ.message._;	
			_.timers = _.timers || [];
			while (_.timers.length)
				clearTimeout(_.timers.shift());
			
			if (_.tickTock)
				_.tickTock.pause();
			
			if (_.floatNode && _.floatNode.onmouseup)	//assume float message displayed...
			{											//...if onmouseup event exists
				_.floatNode.onmouseup = null;
//EZ.track(evt || (evt+''));
				
				EZ.removeClass(_.floatNode, 'delay');
			}
			else if (_.staticNode && _.staticNode.onmouseup)
			{
				_.staticNode.onmouseup = null;
				EZ.removeClass(_.staticNode, 'delay');
			}
		}
		//__________________________________________________________________________________
		/**
		 *	Internal function used to clear/hide active messages
			if (_.style)						//TODO: restore prior styles if any
			{
				Object.keys(_.style).forEach(function(key)
				{								
					_.node.style[key] = _.style[key];
				});
				delete _.style;
			}
		 */
		this._messageReset = function(evt)	//el, evt, true, false
		{										
			var _ = EZ.message._;
			/*
			var node = '.srcElement'.ov(evt, evt)
			_.active.static = _.active.static || [];
			var list = (evt === true) ? _.active.static : [node]
			list.forEach(function(el)
			{											//close all active static message(s) ??
				if (!el) return;
				if (el)
				{
				}
			});
			*/
			if (_.active.delay) 						//if active delay msg (static), clear
			{
				/**
				 *
				 */
				var _closeStatic = function(el)
				{
					el.onmouseup = null;
					EZ.set(el, _.options.blank || '');
					EZ.message._messagePersist(el);
				//	field.resetInitialAttribute('style');
					if (_.hiddenContainer)				//restore static container display / visibility
						EZ.hide(_.hiddenContainer.el);
				}
				//=========================================================================================
				if (evt === false || '.srcElement.id'.ov(evt) == 'EZfloatClose')
				{
					_closeStatic(_.active.delay)
					_.active.delay = null;
				}
			}
			
			if (_.active.float || (_.floatNode && _.floatNode.isVisible()))
			{											//if SINGLE active float msg, close  or start close
				var _closeFloat = function()
				{
					var node = _.floatNode;
					node.onmouseup = null;
					node.style.visibility = 'hidden';
					
					EZ.message._messagePersist(false);
				//	EZ('EZfloatDetail', node)
				//	node.resetInitialAttribute('style');
					_.active.float = null;
				}
				//=====================================================================================
				EZ('EZfloatWrap',_.floatNode).style.opacity = 0.2;
				
				if (evt === false || '.srcElement.id'.ov(evt) == 'EZfloatClose')
					_closeFloat();						//hide immediately
				else
				{									
					_.timers.push(setTimeout(function()	
					{									//if close not canceled, finish by hiding floatNode
						if (parseInt(EZ('EZfloatWrap',_.floatNode).style.opacity) < 1)
							_closeFloat()
					}, 3500)); 							//hide if non-canceled shortly	
				}
			}		
			
		}
	}
	/*__________________________________________________________________________________________________
	hide float and wait as well as any messages with pending delays
	use EZ.message() to hide/clear all messages including any NOT pending delays.
	--------------------------------------------------------------------------------------------------*/
	EZmessage.prototype.reset = function _reset()
	{
		var _ = EZ.message._;
		this._messageReset(false);
		
		if (_.waitNode)
			_.waitNode.style.visibility = 'hidden';		
		_.waitAnchorTag = '';
		_.waitCaller = '';
	}
	/*__________________________________________________________________________________________________
	EZ.message.wait(text, el, ctx, delay)
	
	display waiting message cleared when any other message displayed
	
	ARGUMENTS:
		text	(optional) if supplied. wait message displayed (with " . . ." suffix
				if omitted just suffix displayed
		
		el		(optional) if supplied. wait message displayed relative to element
				if not supplied, message appears at top of browser window (position:fixed)
		
		ctx		(Object) caller context (i.e. caller this) calling function is called after
				wait message is displayed -- upon return wait message hidden
				
				(Number) specifies number of seconds or milliseconds. wait message appears
				milliseconds if less than 100
				
		delay	(optional) must be Number or String containing number
		
		options	(optional) TODO
		
	RETURNS:
		false if ctx specified and waiting visible otherwise true if no ctx or not visible
	
	TODO:


	LEGACY: _wait(el, ctx, text, delay)
	
		var args = [].slice.call(arguments);
			
		if (EZ.isEl(el))
			args.shift();
		else if (typeof(el) == 'string')
			el = EZ(args.shift(), null);
		el = el || EZ('body');	
		
		ctx = (args[0] instanceof Object) ? args.shift() : '';
		text = (args[0] && isNaN(args[0])) ? args.shift() : '';
		delay = (!isNaN(args[0])) ? args.shift() : 0;
	--------------------------------------------------------------------------------------------------*/
	EZmessage.prototype.wait = function _wait(text, el, ctx, delay)
	{
		var _ = EZ.message._;
		var options = _.options;
		_waitArgsParse([].slice.call(arguments))			//parse arguments
		
		var node = _.waitNode;						//create wait <div> if not already done
		if (!node)
		{										
			options.waitTag.nodes.text = EZ.MORE.wrap(' ');
			node = _.waitNode = EZ.createTag('div', options.waitTag);
		}
													  //----------------------------------------------\\
		if (ctx instanceof Object 					 //if ctx supplied, return false if wait IS visible\\
		&& el == _.waitAnchorTag					//--------------------------------------------------\\
		&& arguments.callee.caller == _.waitCaller
		&& !node.style.visibility)					//return false if wait message displayed
			return false;							//so caller function continues

		this._messageReset(false);					//otherwise, display new wait message
		this._setNodeOffsets(node, el, options.waitOffsets);

		EZ('EZmessageWaitText', node).innerHTML = text;
		node.style.visibility = '';		
		_.waitAnchorTag = el;
		_.waitCaller = arguments.callee.caller;
													  //---------------------------------------\\
		if (delay)									 //if delay specified, hide after delay time\\
		{											//-------------------------------------------\\
			if (delay < 1000)
				delay = delay * 1000;
			_.timers.push( setTimeout(this._messageReset, delay) )
		}
		
		if (ctx instanceof Object)					//if called with ctx, start new thread 
		{											//...to allow screen refresh			
			var caller = arguments.callee.caller;
			var callerArgs = [].slice.call(caller.arguments);
			var timer = setTimeout(function()
			{
				///////////////////////////////////////////////////////////
				var rtnValue = caller.apply( (ctx || window), callerArgs );
				///////////////////////////////////////////////////////////
				_.waitAnchorTag = _.waitCaller = ''
				node.style.visibility = 'hidden';	//hide waiting message if still showing
				return rtnValue;
			},250);									//wait a bit so hourglass gets loaded
			void(timer);
			//this._timers = this._timers = [];
			//this._timers.push(timer);
		}
		//======================
		return true;									//caller must wait for screen refresh
		//======================
		//________________________________________________________________________________________
		/**
		 *	determine supplied arguments
		 */
		function _waitArgsParse(args)	
		{	
			//==================================================================================================
			var count = args.length;
			if (args.length && !isNaN(args[args.length-1]))
			{
				delay = args.pop();
				count = args.length;
		
				text = args.shift();
				el = args.shift();
				ctx = args.shift();
			}		
			
			if (text instanceof Object)
			{
				if (EZ.isEl(text))
				{
					ctx = el;
					el = text;
				}
				else 
					ctx = text
				text = '';
			}
			else if (count == 1)
			{
				if (typeof(text) == 'string')
				{
					el = _getEl(text);
					if (el) text = '';
				}
			}
			else if (count == 2)
			{
				if (typeof(text) == 'string' && el instanceof Object)
				{
					if (_getEl(text))
					{
						ctx = el;
						el = EZ.el;
						text = '';
					}
					else if (EZ.isEl(el))
						ctx = null;
					else
					{
						ctx = el;
						el = null;
					}
				}
				else
					el = _getEl(el);
			}
			else 
				el = _getEl(el);
			
			delay = delay || 0;
		}
	}
	/*--------------------------------------------------------------------------------------------------
	EZ.message(msg, timers)
	
	Update or clear message -- outer div (g.message)
	
	EZ.message._.blank -- contains message diplayed for blank
	
	TODO: 
		scrollInto view
	--------------------------------------------------------------------------------------------------*/
	function _message(msg, opt, options)
	{
		var _ = EZ.message._;
		var defaultOptions = EZ.options.call(EZ.message.options, EZ.message.options.message); 
		
		var delay = defaultOptions.delay;
		delete defaultOptions.delay;				//default delay only used for floatNode
		var closeDefault = defaultOptions.close;
		delete defaultOptions.close;
		delete defaultOptions.floatNode;			//floatNode must be explicity specified
		
		var options = EZ.options.call(defaultOptions, opt, options); 
		if (options.delay && options.delay < 1000)
			options.delay = options.delay * 1000;
		if (options.close === undefined && (options.delay === 0 || options.delay > 5000))
			options.close = closeDefault;
					
		if (msg === true || !msg) 
			msg = '';
													
		EZ.message._messageReset(false);			//hide prior float and/or clear delay msg
		if (_.waitNode && !_.waitNode.style.visibility)
			_.waitNode.style.visibility = 'hidden';	//always hide wait message
		
		var node, msgContainer;
		if (msg)						
		{											
			node = '';								  //----------------------------\\
			if (!options.floatNode)					 //----- staticNode message -----\\
			{										//--------------------------------\\
				node = _.staticNode = (_.staticNode || EZ(options.selector));
				if (node)							//if message node found float or static. . .
				{
					EZ.set(node, msg);				//converts \n to <br> and vis-versa
					
					//_.active.static.push(node);
				
					/*
					if (EZ.hasClass(msgContainer, 'hidden')
					|| msgContainer.style.position == 'absolute')
					if (_.hiddenContainer)
						msgContainer.style.display = (msg) ? 'block' : 'none';
					*/
				
					var msgContainer = node.parentNode;
					if (msgContainer.isHidden())
					{								//note if we messed with container
						_.hiddenContainer = EZ.field(msgContainer, true);	
						EZ.show(msgContainer, msg);
						EZ.track('messed with message container');
					}
				}
				else 
					EZ.message.alert(msg, options);	
			}										  //--------------------------------\\
			else									 //relative to floatNode if specified\\
			{										//------------------------------------\\
				if (options.delay === undefined)
					options.delay = delay;
				node = _.floatNode;					//get or create tag
				if (!node)
				{								
					node = _.floatNode = EZ.createTag('div', options.floatTag);
					EZ('EZfloatClose',node).onclick = this._messageReset;
				}
				EZ.removeClass(node, 'delay');
				EZ.removeClass(EZ('EZfloatClose',node), 'hidden', options.close);
				
				node.style.visibility = '';
				//EZ('EZfloatDetailSummary',node).style.display = 'none'
				if (options.detail)
				{
					EZ.set( EZ('EZfloatDetailSummary',node), msg);
					EZ.set( EZ('EZfloatDetailMessage',node), options.detail);
					EZ('EZfloatDetail', node).style.display = '';
					EZ('EZfloatMessage',node).style.display = 'none'
				}
				else
				{
					EZ('EZfloatDetail', node).style.display = 'none';
					EZ('EZfloatMessage',node).style.display = ''
					EZ.set( EZ('EZfloatMessage',node), msg);
				}
				setTimeout(function() { EZ('EZfloatWrap',node).style.opacity = 1.0; },500);
				
				var anchorNode = EZ(options.floatNode, null);
				if (!anchorNode || anchorNode.isHidden())
				{
					EZ.track();
					anchorNode = 'body';
				}
				_.active.float = this._setNodeOffsets(node, anchorNode, options);
				EZ.show(node);
				
				/*
				if (EZ.popup.add) EZ.popup.add(node);
				node.style.display = 'block';
				if (node.style.visibility == 'hidden')
					node.style.visibility = '';
				*/
			}
			
			if (node && options.delay)				//message shows for only delay seconds
			{
				if (!_.tickTock)
				{			
					_.tickTock = EZ.createTag('audio', options.tickTockTag);
					_.tickTock.volume = options.tickTockTag.volume;
					_.tickTock.playbackRate = options.tickTockTag.playbackRate;
					_.tickTock.loop = true;
				}
				var el = (options.floatNode) ? _.floatNode : _.staticNode;
				_.active.delay = (el == _.floatNode) ? null : el;
				
				_.timers = _.timers || [];			
				if (options.close)
				{
					delay = EZ.toInt(options.delay, 15000);
					var blinkDelay = Math.max(1000, delay - 10000);
					var soundDelay = Math.max(1000, delay - 5000);
														//NON persistant message actions -- ignored once persistant
					_.timers.push( setTimeout(function() { if (el.onmouseup) EZ.addClass(el , 'delay')}, blinkDelay) );
					_.timers.push( setTimeout(function() { if (el.onmouseup) _.tickTock.play() }, soundDelay) );
				}
				_.timers.push( setTimeout(function() { EZ.message._messageReset(node) }, options.delay) );
				
				el.onmouseup = EZ.message._messagePersist;
				//el.onmouseup = function() { setTimeout("EZ.message._messagePersist('onmouseup')", 500) };
			}
		}
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZmessage.prototype.alert = function _alert(dialog, callback, options)
	{
		//__________________________________________________________________________________________________
		/**
		 *	
		 */
		EZ.message.alert.render = function (dialog, callback, options) 
		{
			if (typeof callback == 'function')
			{
				options = options || {};
				options.callback = callback;
			}
			else if (options && typeof options.callback == 'function')
			{
				options.callback = callback;
			}
			var defaultOptions = EZ.options.call(EZ.message.options, EZ.message.options.alert); 
			delete defaultOptions.floatNode;	//must be specified for each call
			var options = EZ.options.call(defaultOptions, options, arguments); 
		
			var tags = EZ.message.options.tags;
			if (!tags.alert) 					//create alert tags if not defined
			{
				tags.alert = EZ.createTag( {"id": "EZmessageAlert"}, 'body');
				tags.alertHeader = EZ.createTag( {class: "header"}, "EZmessageAlert");
				tags.alertBody   = EZ.createTag( {class: "body"}  , "EZmessageAlert");
				tags.alertFooter = EZ.createTag( {class: "footer"}, "EZmessageAlert");
			}
			
			//var el = options.tags.alert;
			EZ.set(tags.alertHeader, options.title);
			EZ.set(tags.alertBody, dialog);	//converts \n to <br> and vis-versa
			
			var html = '<button onclick="window.EZ.message.alert.ok()">' + options.ok + "</button>";
			EZ.set(tags.alertFooter, html);
			
			//EZ.show(el);
			tags.alert.style.display = 'block';
			_modal(options.modal);
		}
		
		EZ.message.alert.ok = function() 
		{
			if (typeof this.options.callback == 'function')
				if (this.options.callback() === false)
					return;						//bail if callback returns false
		
			//EZ.hide([this.tag, this.overlay]);
			EZ.message.alert.tag.style.display = 'none';
			_modal(false)
		}
		//===============================================================================
		//var _ EZ.message.alert._ = EZ.message._;
		var _modal = EZ.message.alert._modal = this._modal;
		
		//EZ.message.alert.options = EZ.options.call(EZ.message.options.alert, arguments); 
		if (!dialog)							//open dialog if not _init() call
			EZ.message.alert.render.call(EZ.message.alert, dialog, callback, options);
		//===============================================================================
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZmessage.prototype.confirm = function _confirm(dialog, callback, options)
	{
		var _ = EZ.message.confirm._ = EZ.message._;
		var _modal = EZ.message.confirm._modal = this._modal;
		
		if (!EZ.message.confirm.tag) 			//create tags if 1st call
		{
			if (!_.overlay)
				_.overlay = EZ.createTag( {"id": "EZmessageOverlay"}, 'body');
			EZ.message.confirm.overlay = _.overlay;
			EZ.message.confirm.tag = EZ.createTag( {"id": "EZmessageConfirm"}, 'body');
			
			EZ.createTag( {class: "header"}, "EZmessageConfirm");
			EZ.createTag( {class: "body"}  , "EZmessageConfirm");
			EZ.createTag( {class: "footer"}, "EZmessageConfirm");
		}
		EZ.message.confirm.options = EZ.options.call(EZ.message.options.confirm, arguments); 
	
	
this.callback = function () {};
	
		//__________________________________________________________________________________
		/**
		 *	
		 */
		this.render = function (dialog, callback, options) 
		{
			if (options)
				options.callback = callback;
			else if (typeof callback == "object") 
				options = callback;
			options = EZ.message.confirm.options = EZ.options.call(EZ.message.confirm.options,options)					

			if (typeof callback == "function") 
			{
				options.confirm = callback.confirm;
				options.cancel = callback.cancel;
			}
			else
			{
				if (callback.confirm)
					options.confirm = callback.confirm;
	
				if (callback.cancel)
					options.cancel = callback.cancel;
			}
			
			var el = EZ.message.confirm.tag;
			EZ.set( EZ("header", el), options.title);
			EZ.set( EZ("body", el), dialog);
			
			var html = '<button class="confirm" onclick="EZ.message.confirm.ok()">'
					 + 		(this.options.yes) 
					 + '</button>'
					 + '<button class="cancel" onclick="EZ.message.confirm.cancel()">'
					 + 		(this.options.no) 
					 + "</button>";
			EZ.set( EZ("footer", el), html);
			
			EZ.message.confirm.tag.style.display = 'block';
			_modal(options.modal);
		};
		/**
		 *	
		 */
		this.ok = function () 
		{
			this.options.answer = true;
			if (typeof this.options.confirm == "function")
				if (!this.options.confirm())
					return;
	
			this.end();
	
			if (this.options.return) 
			{
				if (typeof this.callback == 'function')
					this.callback(true);
				return;
			}
			if (typeof this.options.callback == 'function')
				this.callback();
		}
		/**
		 *	
		 */
		this.cancel = function () 
		{
			this.options.answer = true;
			if (typeof this.options.cancel == "function")
				if (!this.options.cancel())
					return;
	
			this.end();
	
			if (this.options.return) 
			{
				this.clear();
				if (typeof this.callback == 'function')
					this.callback(false);
				return;
			}
		}
		/**
		 *	
		 */
		this.end = function () 
		{
			EZ.message.confirm.tag.style.display = 'none';
			_modal(false);
		}
		//===============================================================================
		if (!dialog)							//open dialog if not _init() call
			EZ.message.confirm.render.call(EZ.message.confirm, dialog, callback, options);
		//===============================================================================
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	var _getEl = function(sel)
	{
		if (!sel)
			 return '';
		
		if (EZ.isEl(sel))
			return sel;

		if (typeof(sel) != 'string')
			 return '';
		
		if (sel.includes(' '))
			 return '';
		
		//if (/([ +-~`!@#%^&*(){}[\]<>,;:"'?/]|\.{2})/.test(sel))
		//		return '';
		
		if (sel.substr(1).includes('.'))
			 return '';
		
		//var return EZ(sel,null);
			
		var el = EZ(sel, null);
		return (!el || el.undefined) ? '' : el;
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	var _displayValue = function(id, value)
	{
		var tag = this.tags[id] || _getEl(this.options.tags[id]);
		if (tag)
			EZ.set(tag, value);
	}
	e = _displayValue;
	//__________________________________________________________________________________________________
	/**
	 *	creates new instance but copies all properties and prototypes to static function so EZ.message()
	 *	still valid and calls defaultFumction with this context.
	 */
	var _init = function()
	{
		var fn = new EZmessage();
		for (var key in fn)
			EZmessage[key] = fn[key];
			
		EZ.event.add(window, 'onload', function()	//_init() initialize options plus...
		{
			var _ = EZ.message._;
			var options = _.options = EZ.message.options = EZ.options(EZ.defaultOptions.message);
			for (var key in options._defaults)
				_[key] = options._defaults[key];
			
			EZ.alert = EZ.message.alert;			//shortut fn references
			EZ.confirm = EZ.message.confirm;
			//EZ.message = EZ.message.message;
/*			
			EZ.event.add(window, 'keydown', function (e) 
			{
				var el, _=EZ.message._;
				var keynum = e.keyCode ? e.keyCode : e.which;
				if (keynum == 13) 
				{					
					if ((el = EZ.message._getTag('alert')) && el.isVisible())
						_.alert.ok();

					else if ((el = EZ.message._getTag('confirm')) && el.isVisible())
						_.confirm.ok();
				}
				else if (keynum == 27 && (el = EZ.message._getTag('confirm')) && el.isVisible())
					_.confirm.cancel();

			}, false);
*/			
			if (EZ.message.options.nativeList.includes('alert'))
			{
				/*
				window.alert = window.Alert = function (dialog, callback, options) 
				{
					EZ.message.alert.render.call(EZ.message, dialog, callback, options);
				};
				*/
				//EZ.message.alert()		//create tags and support functions e.g. render
			}
			if (EZ.message.options.nativeList.includes('confirm'))
			{
				window.confirm = window.Confirm = function (dialog, callback, options) 
				{
					EZ.message.confirm.render.call(EZ.message, dialog, callback, options);
				}
				//EZ.message.confirm()	//create tags and support functions e.g. render
			}
		});
		return EZmessage;
	}
	//==================================================================================================
	return _init();
})();
//________________________________________________________________________________________
/**
 *	_waitArgsParse testing
 */
EZ.message.waitArgs = function(text, el, ctx, delay)
{
	var args = [].slice.call(arguments);
	var count = args.length;
	if (args.length && !isNaN(args[args.length-1]))
	{
		delay = args.pop();
		count = args.length;

		text = args.shift();
		el = args.shift();
		ctx = args.shift();
	}		
	
	if (text instanceof Object)
	{
		if (_isEl(text))
		{
			ctx = el;
			el = text;
		}
		else 
			ctx = text
		text = '';
	}
	else if (count == 1)
	{
		if (typeof(text) == 'string')
		{
			el = _EZ(text, null);
			if (el) text = '';
		}
	}
	else if (count == 2)
	{
		if (typeof(text) == 'string' && el instanceof Object)
		{
			if (_EZ(text,null))
			{
				ctx = el;
				el = EZ.el;
				text = '';
			}
			else if (_isEl(el))
			{
				ctx = null;
			}
			else
			{
				ctx = el;
				el = null;
			}
		}
		else
		{
			el = _EZ(el);
		}
	}
	else el = _EZ(el, null);
	delay = delay || 0;
	
	
	var rtn = {
		text: text,
		el: (el instanceof Object ? el.arg : undefined),
		ctx: (ctx instanceof Object ? ctx.arg : undefined),
		delay: delay
	}
	return rtn
	
	function _isEl(el)
	{
		return (el instanceof Object && el.arg == 'div')
	}
	function _EZ(el)
	{
		EZ.el = (el instanceof Object) ? el
			  : (el == 'div' || el == 'body') ? {arg:el}
			  : false;
		return EZ.el;
	}
}

//_____________________________________________________________________________________________
EZ.message.waitArgs.test = function()
{
	var msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, , rtnValue];

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//EZ.test.run(-2, 		{EZ: {ex:-2	,	note:note	}})
	//EZ.test.options( {ex:ex, note:note} )
	//EZ.test.run( ctx, arg, obj )
	//_______________________________________________________________________________________
	
	var text = 'give';
	var el = {arg:'div'}
	var sel = 'body'
	ctx = {arg:'this'}
	
	//_______________________________________________________________________________________	
	EZ.test.run()
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	EZ.test.run(text, el, ctx, 1)
	EZ.test.run(text, sel, ctx, 1)
	
	EZ.test.settings({group: 'text omitted'})
	EZ.test.run(el, ctx, 1)
	EZ.test.run(sel, ctx, 1)
	
	EZ.test.settings({group: 'text/el omitted'})
	EZ.test.run(ctx, 1)
	EZ.test.run(1)
	
	//_______________________________________________________________________________________
	EZ.test.settings({group: 'text 1st variants'})
	EZ.test.run(text)
	EZ.test.run(text, ctx)
	EZ.test.run(text, 1)
	EZ.test.run(text, ctx, 1)
	
	EZ.test.run(text, el)
	EZ.test.run(text, sel)
	EZ.test.run(text, el, 1)
	EZ.test.run(text, sel, 1)

	//_______________________________________________________________________________________
	EZ.test.settings({group: 'element 1st variants'})
	EZ.test.run(el)
	EZ.test.run(sel)
	
	EZ.test.run(el, ctx)
	EZ.test.run(sel, ctx)
	
	EZ.test.run(el, 1)
	EZ.test.run(sel, 1)
	
	EZ.test.run(el, ctx, 1)
	EZ.test.run(sel, ctx, 1)
	
	//_______________________________________________________________________________________
	EZ.test.settings({group: 'ctx 1st variants'})
	EZ.test.run(ctx)
	EZ.test.run(ctx, 1)
		
	//_______________________________________________________________________________________
	EZ.test.settings({group: 'non-existant selector'})
	sel = 'none'
	//_______________________________________________________________________________________
	EZ.test.run(text, sel, ctx, 1)
	EZ.test.options({note:'must assume 1st arg is text when el not found'})
	EZ.test.run(sel, ctx, 1)
	EZ.test.run(text, sel)
	EZ.test.run(text, sel, 1)
	EZ.test.run(sel)
	EZ.test.run(sel, ctx)
	EZ.test.run(sel, ctx, 1)

	if (true) return;
}
/*-----------------------------------------------------------------------------------
-----------------------------------------------------------------------------------*/

/*--------------------------------------------------------------------------------------------------
Return str of length (default: 80) by duplicating ch (default: dash)
ch can be multiple characters
--------------------------------------------------------------------------------------------------*/
EZ.dup = function EZdup(length,ch)
{
	ch = ch || '-';
	return ch.dup(ch,length);
}
/*--------------------------------------------------------------------------------------------------
EZ.fill(instr, prefix, suffix)

whats up...

ARGUMENTS:
	arg			(*) blah blah
	...			blah blah
	opts		options created by EZ.opt(...) which accepts allows one or more arguments each
				either string containing delimited string, key/values, json or array of same.
				See EZ.opt(...) for examples or more detail.
RETURNS:
	true if ... otherwise ...

TODO:
	check Array.prototype.fill
--------------------------------------------------------------------------------------------------*/
EZ.fill = function EZfill(instr, length, nextStr)
{
	var str = '';
	switch(typeof instr)
	{
		case 'nan':
		case 'null':
		case 'unknown':
		case 'undefined':
							/* jshint ignore:start*/	//flow-thru
			instr = ''		
							/* jshint ignore:end */
		case 'boolean':
		case 'number':
		case 'string':
			str = instr + '';
			break;

		case 'function':
		case 'object':	
							/* jshint ignore:start*/	//flow-thru
		default:	
							/* jshint ignore:end */
		{
			str = EZ.stringFromObject(instr);
		}
	}
	if (isNaN(length))
		length = length || 1;

	if (typeof(nextStr || '') != 'string')
		nextStr = EZ.stringFromObject(instr);

	return str + EZ.dup(length-str.length-1,' ') + ' ' + nextStr;
}
/*--------------------------------------------------------------------------------------------------
EZ.getParent(elSelector[s], ancestorSelector[s])

For first el matching elSelector, find ancestor matching any specfied ancestor selector or
immediate parent if ancestorSelector not supplied.

ARGUMENTS:
	elSelector	html element, array or collection of html elements

	ancestorSelector (optional)
				one or more selectors specifing ancestor tagName, className or fieldName
					e.g. TR .someClass @someField
				if omitted, blank, null, undefined, empty Array or Object, the immediate
				parent element is returned (i.e. el.parentElement)

	options		(optional) =null 
	
	topTag		(legacy EZtest_assistant.js)

RETURNS:
	ancestor of el matching ancestorSelector if found
	otherwise null if options === null -OR- EZnone

NOTE:	 similpar functions
	EZtest_assistant.js::EZgetParent(el,tag,topTag)
	EZcommon.js::EZgetParent(el,tagName,className)
	EZcore.js::EZgetParent(el,tagName)

TODO:
	as of 01-09-2016 does not work for id or name -- see EZ.getAncestor.test()
--------------------------------------------------------------------------------------------------*/
EZ.getAncestor = EZ.getParent = function EZgetAncestor(elSelector, ancestorSelector, options /* topTag */)
{
	if (EZ.test.capture()) {return EZ.test.capture(this)} else if (EZ.test.debug()) debugger;

	var el = EZ(elSelector, null);			//get only 1st el matching any selector
	//if (el.undefined) return el;			//if el not found
	if (el)
	{
		ancestorSelector = EZ.toArray(ancestorSelector);
		if (!ancestorSelector.length)
			return el.parentElement;			//return immediate parent if any ancestor allowed
	
		var node = el;
		while (node = node.parentElement)		//walk up tree until null or matching ancestor found
		{
			var div = document.createElement('div');
			div.appendChild(node.cloneNode(false))
			if (!EZ(ancestorSelector, div)[0].undefined)
				return node;
		}
	}
	return options === null ? null : EZnone();		//if no matching ancestor found
}
//_____________________________________________________________________________________________
EZ.getAncestor.test = function()
{
	/*global t_wrap, t_tags, t_fm, EZsetValue, EZnone */
	var ctx = 'na', note = '';
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'input: el \n ancestorSelector: tagName'
	EZ.test.results({ex:t_wrap, note:note});
	EZ.test.run(t_tags[0], 'div')

	note = 'input: el \n ancestorSelector: className'
	EZ.test.results({ex:t_fm, note:note});
	EZ.test.run(t_tags[0], 'border-simple')

	note = 'input: el \n ancestorSelector: id'
		 + '\n as of 01-09-2016 does not work'
	EZ.test.results({ex:t_wrap, note:note});
	EZ.test.run(t_tags[0], '#EZtest_wrap')

	note = 'input: el id \n ancestorSelector: name'
		 + '\n as of 01-09-2016 does not work'
	EZ.test.results({ex:t_fm, ctx:ctx, note:note});
	EZ.test.run('EZtest_tag0', 'testForm')
	//______________________________________________________________________________
	return //endtest
}
/*---------------------------------------------------------------------------------------------
 *	Pruned version of EZ.getKeyValues() from EASY.js on 08-20-2015	-- NOT TESTED
 *
 *	Returns object containing attributes parsed from input string
 *	(leading, trailing and embedded < or > ignored).

TODO: does not get *

	str = str.replace(/./g, function()
	{
	})
---------------------------------------------------------------------------------------------*/
EZ.getAttributes = function EZgetAttributes(str, defaultValue /*, isOptions */)
{
	if (typeof(str) != 'string') return str;
	if (str.startsWith('?'))
		str = str.substr(1);

	var attributes = {};
	var regex = EZ.patterns.attributes;
	var results = str.trim().match(regex);			//get all attributes
	if (results)
	{
		regex = new RegExp(regex.source);			//remove global flag
		for (var i=0; i<results.length; i++)		//for each attribute
		{
			var groups = results[i].matchPlus(regex, EZ.patterns.attributesLabels);

			var value = groups.single_quoted_value
					 || groups.double_quoted_value
					 || groups.unquoted_value
					 								//attr without any value
					 || (defaultValue === undefined ? '' : defaultValue);							
			
			if (typeof(defaultValue) == 'boolean' && typeof(value) == 'string')
			{
				value = (value == 'true') ? true
					  : (value == 'false') ? false
					  : value;
			}
			attributes[groups.attr] = value;
		}
	}
	return attributes;
}
//________________________________________________________________________________________
/**
 *	
 */
EZ.getAttributes.test = function()
{	
	var msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, , rtnValue];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//______________________________________________________________________________________

	ex = {
	    input: "",
	    type: "text",
	    value: "160",
	    size: "5",
	    id: "maxHeightTestRowsShared",
	    onchange: "EZ.copyValue('maxHeightTestRowsShared', this.value)"
	}
	
	arg = 'input type=text value=160 size=5 id=maxHeightTestRowsShared'
			+ " onchange=EZ.copyValue('maxHeightTestRowsShared', this.value)"
	EZ.test.run(arg, 		{EZ: {ex:ex,	note:'number attr value not quoted'	}})
	
	arg = 'input type=text value="160" size="5" id=maxHeightTestRowsShared'
			+ " onchange=EZ.copyValue('maxHeightTestRowsShared', this.value)"
	EZ.test.run(arg, 		{EZ: {ex:ex,	note:'number attr value not quoted'	}})
	
	arg = 'input type=text value=160 size=5 id=maxHeightTestRowsShared'
			+ ' onchange="EZ.copyValue(\'maxHeightTestRowsShared\', this.value)"'
	EZ.test.run(arg, 		{EZ: {ex:ex,	note:'number attr value not quoted'	}})

	
	//______________________________________________________________________________
	return;
}
/*---------------------------------------------------------------------------------------------
this specifies mergeAll options if String

legacy EASY.js passed arguments as 1st arg

TODO:
	automate legacy default options
	String.formatStack(#/msg)
	if (typeof(options) != 'string')
	{
		stack = options + '\n' + stack;
		options = '';
	}
	options = !options ? {}
			: typeof(options) == 'object' ? options
			: {skipCount: options};		//legacy options was skipCount

---------------------------------------------------------------------------------------------*/
EZ.getOptions = function EZgetOptions(/* opts1 ,opts2 ...optsN */)
{
	var args = [].slice.call(arguments);
	var ctx = this;
	var options = {};
	args.forEach(function EZgetOptions_option(opts)
	{
		opts = typeof(opts) == 'object' ? opts
			 : typeof(opts) == 'string' ? EZ.getAttributes(opts, true)
			 : {}
		if (Object.keys(opts).length > 0)
			options = EZ.mergeAll.call(ctx, opts);
	});
	return options;
}
EZ.getOptionsAppendOnly = function EZgetOptionsAppendOnly()
{
	return EZ.getOptions.apply('? append=true, replace=false', [].slice(arguments))
}
EZ.getOptionsReplaceOnly = function EZgetOptionsReplaceOnly()
{
	return EZ.getOptions.apply('? append=false, replace=true', [].slice(arguments))
}
/*--------------------------------------------------------------------------------------------------
EZ.getOptionValue (options, key)

ARGUMENTS:

RETURNS:
	value of key in options
--------------------------------------------------------------------------------------------------*/
EZ.getOptionValue = function EZgetOptionValue(options, key, defaultValue, formats)
{
	options = EZ.getOptions(options);			//get options as object
	var value = options[key];
	return value !== undefined ? value
		 : defaultValue != null ? EZ.getDefaultValue(value, defaultValue, formats)
		 : '';
}
/*--------------------------------------------------------------------------------------------------
EZ.getOptionValue (options, key)

	//type as constructor: Undefined, Null for undefined or null respectively
	//	Array, Boolean, Function, Number, Object, RegExp

ARGUMENTS:

RETURNS:
	value of key in options
--------------------------------------------------------------------------------------------------*/
EZ.getDefaultValue = function EZgetDefaultValue(value, defaultValue, formats)
{
	var me = arguments.callee;
	var defaultFormats = {
		date: 'shortDateTime'
	}
	if (!me.formats)
		me.formats = EZ.mergeReplaceOnly(defaultFormats);

	formats = EZ.getOptions(me.formats, formats);

	var type = Object.prototype.toString.call(defaultValue);
	switch (type.substring(8,type.length-1))
	{
		case 'Boolean':
		{
			value = EZ.isTrueLike(value);
			break;
		}
		case 'Number':
		{
			value = EZ.toFloat(value);
			break;
		}
		case 'String':
		{
			if (EZ.isArray(value))
				value = value.join(',');

			else if (typeof value == 'object')
				value = EZ.collapse(value);

			else if (typeof value == 'function')
			{
				switch (EZ.getConstructorName(value))
				{
					case 'Date':
					{
						if (EZ.date)
							value = value.toString();
						else
						{
							var date = EZ.date(value);
							value = date.get(formats.date, defaultFormats.date);
						}
						break;
					}
					case 'RegExp':
						value = value.source;
						break;
					default:
						value = value.toString();
				}
			}
			else
				value = value.toString();
			break;
		}
		case 'Array':
		{
			if (!EZ.isArrayLike(value))
				value = EZ.toArray(value, ',');
			break;
		}
		case 'Object':
		{
			value = EZ.getOptions(value);
			break;
		}
		case 'Date':
		{
			value = new Date(value)
			break;
		}
		case 'RegExp':
		{
			value = new Date(value)
			break;
		}

		//case 'Function':
		//case 'Null':
		//case 'Undefined':
		default:
		{
		}
	}
}
/*--------------------------------------------------------------------------------------------------
EZ.getObjectType(value)					UNDER DEVELOPMENT -- MAY BE OVER-TECHED

EZ.getType() simple and probably perfect 99% of the time.
--------------------------------------------------------------------------------------------------*/
EZ.getObjectType = function EZgetObjectType(value)
{
	return EZ.getType(value);
	
	/*TODO: over-teched ideas . . .
	options = options ||
	{
		'NaN':['isNaN'],
		'Object':['object'],
		'Array':['Arguments'],
		'ArrayLike':['Object'],
	};

	var me = arguments.callee;
	me.value = value;
	me.type = type;
	switch (getType(value))
	{
		case 'Null':
		case 'Undefined':
		case 'Boolean':
			break;

		case 'Number':
		case 'String':
		{
			if (options.Object.includes('String'))
			{
				me.value = EZ.getAttributes(value,true)	//convert key=value
				return 'Object';
			}
		}
		case 'Arguments':
		{
			if (options.Array.includes('Arguments'))
			{
				me.value = [].slice.call(value);
				return 'Array';
			}
			break;
		}
		case 'RegExp':
		case 'Function':
			break;

		case 'Array':
		{
			if (EZ.isObjectLike(value))
			{
			}
			break;
		}
		//case 'Object':
		default:
		{
			if (typeof(value) != 'object')
				break;

			type = 'Object'
			if (EZ.isArrayLike(value))
			{
				if (options.ArrayLike.includes('ArrayLike'))
					type = 'ArrayLike';

				if (options.Array.includes('ArrayLike') && EZ.isArrayLike(value))
				{
					me.value = [].slice.call(value);
					Object.keys(value).forEach(function(key)
					{
						ms.value[key] = value[key];
					});
					type = 'ArrayLike';
				}
			}
		}
	}
	if (typeof(value) == 'number' && isNaN(value))
	{
		type = 'NaN';
	}
	if (options.String.includes(me.type)
	|| options.String.includes(typeof(value)))
	{
		if (typeof(value) != 'object')
			me.value = value + '';

		else if (EZ.isArray())
		{

		}
		else
		me.value = [].slice.call(value);
		{
		}
		return 'String';
	}
	return type;
	*/
}
/*--------------------------------------------------------------------------------------------------
EZ.getFunction(fn)

	var fnName = funcParts[1];			//function statement name -- not same as oops funcName
	var argNames = funcParts[2];
	var code = funcParts[3];
--------------------------------------------------------------------------------------------------*/
EZ.getFunction = EZ.getFunctionParts = function EZgetFunction(fn)
{
	var labels = 'name,args,body';
	var matches = (fn+'').matchPlus(EZ.patterns.fn, labels);

	//input[0]:	function(all /**/) { replace }
	//
	//	name[1]:	empty
	//	args[2]:	all /**/
	//	body[3]:	replace
	matches.set('name', matches.get('name', 'anonymous'));
	matches.set('args', matches.args.replace(/(.*)\s*(\/\*.*\*\/)/, '$1'.trim()));
	return matches;
}
/*--------------------------------------------------------------------------------------------------
EZ.getFunction(fn)

returns: "Array", "Boolean", "Number" or "Object", "String" if caller is associated prototype.

Used by EZ.techSupport() and EZ.capture() to determine if caller "this" required for test script..
--------------------------------------------------------------------------------------------------*/
EZ.getPrototype = function EZgetPrototype(ctx)
{
	var proto = EZ.getConstructorName(ctx);
	if (/\b(Array|Boolean|Number|Object|String)\b/.test(proto))
		return proto;
	return '';
}
/*--------------------------------------------------------------------------------------------------
EZ.indexOf(values,choices)

returns indexOf 1st choice found in values array. If values is delimited string,
the number of delimiters before the matching value is returned.
--------------------------------------------------------------------------------------------------*/
EZ.indexOf = function EZindexOf(values,choices)
{
	if (EZ.isNone(values) || EZ.isNone(choices)) return -1;

	if (EZ.is(values,EZ.optionValue)) values = values.get();
	if (EZ.is(choices,EZ.optionValue)) choices = choices.get();

	//----- if niether values or choices is an array or string, return 0 if they match -1 if not
	if (!EZ.isArrayLike(values) && !EZ.isArrayLike(choices))
	{
		if (values == choices) return 0;
		return -1;
	}

	//----- if only values or only choices is array, use builtin js indexOf if browser supports
	if ([].indexOf)
	{
		if (EZ.isArray(values) && !EZ.isArrayLike(choices))
			return values.indexOf(choices);
		if (!EZ.isArray(values) && EZ.isArrayLike(choices))		//values not array
			return choices.indexOf(values);
	}

	//---------------------------------------------------------------------
	//----- do compare the hard way if both arrays of indexOf NA for arrays
	//---------------------------------------------------------------------
	if (!EZ.isArray(values)) values = EZ.arrayFromString(values);
	if (!EZ.isArray(choices)) choices = EZ.arrayFromString(choices);

	for (var i=0; i<choices.length; i++)
		for (var j=0; j<values.length; j++)
			if (choices[i] == values[j])
				return j;
	return -1;
}
/*--------------------------------------------------------------------------------------------------
EZ.join(array,delimiter[,prefix][,suffix])

Same as native Array.join() but works on ArrayLike objects -AND- applies optional prefix and
suffix strings to each array item.

If array is empty or has single empty string item, empty string returned w/o prefix of suffix.

Virtually just one line of code, but much more readable and avoids JavaScript errors by
converting arguments to type expected by Array.join()

Following conveience functions and Array.prototypes produce even more readible code for
delimiter=", " and/or only using prefix or suffix.

	EZ.joinWithPrefixAndSuffix(array, prefix, suffix)
	Array.joinWithPrefixAndSuffix(prefix, suffix)

	EZ.joinWithPrefix(array, prefix)
	Array.joinWithPrefix(prefix)

	EZ.joinWithSuffix(array, suffix)
	Array.joinWithSuffix(suffix)

ARGUMENTS:
	array		array to join
	delimiter	(optional) delimiter used for join -- default: empty string
	prefix		(optional) prepended to joined string -- appended to delimiter
	suffix		(optional) appended to joined string -- prepended to delimiter

EXAMPLE:
	a = [1,2,3];
	EZ.join( a, ", ", "(", ")"  ) 	-or- 	a.joinWithPrefixAndSuffix( "(" , ")" )
	returns--> (1), (2), (3)

RETURNS:
	string containing prefix + array.join(suffix+delimiter+prefix) + suffix
--------------------------------------------------------------------------------------------------*/
EZ.join = function EZjoin(array, delimiter, prefix, suffix)
{
	if (!EZ.isArrayLike(array))
		array = EZ.arrayFromAny(array);

	delimiter = delimiter || ',';
	prefix = prefix == null ? delimiter.trim() : prefix;
	suffix = suffix == null ? prefix : suffix;
	delimiter = (suffix.trim() != delimiter.trim() ? suffix : '')
			  + delimiter
			  + (prefix.trim() != delimiter.trim() ? prefix : '');

	if (!array.length || (array.length == 1 && array[0] === '')) return '';

	return (prefix + [].join.call(array,delimiter) + suffix);
}
/*--------------------------------------------------------------------------------------------------
EZ.join convenience function variants and prototypes.
--------------------------------------------------------------------------------------------------*/
/**
 *	EZ.joinWithPrefixAndSuffix(array, prefix, suffix[, delimiter])
 *
 *	join array with specified prefix and suffix using default delimiter ","
 */
EZ.joinWithPrefixAndSuffix = function EZjoinWithPrefixAndSuffix(array, prefix, suffix, delimiter)
{ return EZ.join(array, delimiter || ', ', prefix, suffix); }

/**
 *	EZ.joinWithPrefix(array, prefix[, delimiter])
 *
 *	join array with specified prefix using delimiter ", " or supplied delimiter
 */
EZ.joinWithPrefix = function EZjoinWithPrefix(array, prefix, delimiter)
{ return EZ.join(array, delimiter || ', ', prefix, undefined); }

/**
 *	EZ.joinWithSuffix(array, suffix[, delimiter])
 *
 *	join array with specified suffix using delimiter ", " or supplied delimiter
 */
EZ.joinWithSuffix = function EZjoinWithSuffix(array, suffix, delimiter)
{ return EZ.join(array, delimiter || ', ', undefined, suffix); }

/*--------------------------------------------------------------------------------------------------
EZ.lock(except)
	//EZ.trace.saveTimer = setTimeout(EZ.trace.save, 1000);

EZ.lock = function EZlock() {return true}
EZ.unlock = function EZunlock() {return 'depricated'}
	return EZ.start(rtnValue, options);
	var rtnValue = options;
--------------------------------------------------------------------------------------------------*/
EZ.start = function EZstart(options /*, finishOptions */)
{
	var rtnValue = true;
	EZ.start.options = EZ.start.options || {};
	do
	{
		var caller = arguments.callee.caller;
		if (!caller || !caller.name) break;
		rtnValue = false;

///		options = EZ.mergeAll(EZ.start.options[caller.name], options);
		EZ.start.options[caller.name] = EZ.start.options[caller.name] || {};
		options = options || {};
		Object.keys(options).forEach(function(key)
		{
			EZ.start.options[caller.name][key] = options[key];
		});
		
		options = EZ.start.options[caller.name];
		options.message = '';

		if (options.timer)
			options.timer = clearTimeout(options.timer);

		if (options.lock)
		{
			if (options.locked)
			{
				options.started = true;
				options.message = caller.name + ' already locked @ ' + EZ.formatTime(options.startTime);
				console.log(options.message);
				break;
			}
			options.locked = true;
		}
		options.started = true;
		options.startTime = new Date();
	}
	while (false)
	return options.started || rtnValue;
}
//__________________________________________________________________________________________________
/**
 *
 */
EZ.finish = function EZfinish(rtnValue, finishOptions)
{
	EZ.start.options = EZ.start.options || {};

	var caller = arguments.callee.caller;
	if (!caller || !caller.name) return rtnValue;

	var options = EZ.start.options[caller.name];
	if (!options) return rtnValue;

	if (!options.started)
		return options.message;

	if (options.locked)
		delete options.locked;

	options.finishTime = new Date();
	options.elapsedSeconds = (options.finishTime.getTime() - options.startTime.getTime()) / 1000;
	if (options.logtime)
		console.log('trace time: ' + options.elapsedSeconds)

///		options = EZ.mergeAll(options, finishOptions);
	finishOptions = finishOptions || options;
	if (finishOptions.timeout)
		options.timer = setTimeout(finishOptions.timeout, finishOptions.wait || 1000);

	return rtnValue;
}
/*--------------------------------------------------------------------------------------------------
EZ.equals(x, y [, options])													updated: 11-01-2016

only compare Objects once to avoid circular loop

Determine if Objects (or variables) have equal values using following critera (scope can vary):

	Array		equal length, item values plus same owner named properties and values
	Objects 	same constructor and owner properties, with same typeof and equal values 
	Function 	same critera as Object plus same name and script (excluding comments)
	RegExp		same flags and source pattern -- lastIndex can vary
	Date		same date and time zone -- i.e. same getTime() and getTimeZoneOffset()
	other		equal if same typeof and value -- primitive and non-primitive equal

ARGUMENTS:
	x, y		specifies Objects or variables compared
	
	options		(optional) one or more of the following properties:
	
				strict		Objects	
				depth
				scope
				
			Array or delimited string (values separated by commas or spaces)

RETURNS:
	true if Objects or variables equal based on specified critera otherwise false

REFEERENCE:
	Base code but very little still used:
	http://stackoverflow.com/questions/201183/how-to-determine-equality-for-two-javascript-objects/16788517#16788517


HISTORY:
	11-01-2016: prior version did not properly support circular Objects causing browser to crash
				will NOT use legacy if NA, either arg is circular or any options specified
				
				major to showDiff -- log contians all diff upto maxitems
				new Option to tighten or lossen equality test
TODO:
	more circular Object testing
--------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------
EZ.left(str, noChars)

return empty string if str not typeof string
--------------------------------------------------------------------------------------------------*/
EZ.left = function EZleft(str, noChars)
{
	if (typeof(str) != 'string') return '';
	return str.substr(noChars);
}
/*--------------------------------------------------------------------------------------------------
EZ.matchPlus(inStr,regex,flags,length)

call String.matchPlus.prototype with specified searchStr (or empty String if null or undefined)
--------------------------------------------------------------------------------------------------*/
EZ.matchPlus = function EZmatchPlus(searchStr,regex,flags,length)
{
	if (!searchStr) searchStr = '';
	return (searchStr + '').matchPlus(regex,flags,length);
}
/*--------------------------------------------------------------------------------------------------
EZ.sync(obj, defaultValues)

sync obj top level properties with defaultValues -- missing added
deletes any not in defaultValues (depricated)

TODO:
	use EZ.merge.deep if options ??
--------------------------------------------------------------------------------------------------*/
//moved to dev.js
 
/*--------------------------------------------------------------------------------------------------
EZ.merge.deep(objList, options)														latest iteration
EZ.merge.top() -- top level merge -- potential replacement for EZ.mergeAll()
EZ.merge.into()

whats up...

ARGUMENTS:
	String		...
	options		(optional) Object containing one or more of the following properties:
				skipCount	number of function to remove from top of stack
	...			blah blah
			Array or delimited string (values separated by commas or spaces)


RETURNS:
	true if ... otherwise ...

REFEERENCE:
TODO:
--------------------------------------------------------------------------------------------------*/
EZ.merge = (function _____EZmerge_____()									   //created: 09-21-2016
{
	EZ.defaultOptions.merge = {			//default options used by: EZ.merge.deep() and variants
										//not used by: EZ.merge(), EZ.mergeAll() and varients
		maxdepth: 5,
		
		trueOpts: '+-*',
		validOpts: '@1+-rk<>',
		defaultOpts: '@',

		
		append: true,	/*				=false		do not append new properties
										
										=true		append 1st occurance and replace if subsequent occurances
										
										=1st		append 1st occurance only -- ignore subsequent occuranes
													
										=@			append 1st occurance but only replace next occurance when
													when prior and next both are Objects or both are not Objects.
													(use + - or * to override as explained for replace option)
													
													NOTE: replace options are NOT applicable to any appened 
														  property but DO apply to nested Object properties.																			
		*/
		replace: '<>',	/*				=false		do not replace existing any properties
										
										=true		replace all occurances of existing properties unless they were
													appended then appended options determines action
										
										=1st		only replace existing properties once -- ignore subsequent occuranes
										
										"@"			Only replace Objects with Objects -AND- non-Object with non-Objects
										
										"+"			same as "@" but replace non-object with object
										"-"			same as "@" but replace object with non-object
										
										When an Object property is another Object it completely replaces
										the the merged target value unless one of the following:
										
										"r"			merge properties from both Objects replacing duplicates
										"k"			Same as "r"	except keep exiting priorities for duplicates
													(takes precedence over "r")
										
								??	NO	"m" 		Same as "k"	except merge embedding priorities append different
										
										Only replace Objects of same type unless one of the following:
										
										"<"			merge properties into existing Object per "r" or "k"
										
										">"			replace existing Object with new Object type if possible
													then add properties as specified by "r" or "k"
													
										"*"			completely replace Objects of different type
										
										----------------------------------------------------------------------
										merge properties from Objects of different types into the
													the existing merged target Object -- "s" ot "t" determine
													which Object has priority 
										
													same as s or t except when Object types do not match
										">"			clone source Object and copy unique properties from target
										
										
										
										When Object types do not match -- i.e. diff constructor...
										target unless the replace option containg one of the following:
										
										"<"			merge properties Object from source into merged target Object
													same as s or t except when Object types do not match
													
													
										">"			clone source Object and copy unique properties from target
										
		*/		
		clone: false,	/*				=false		1st Object in list is updated in-place with top
													top level properties of remaining Objects in list
										
										=true		top level clone of 1st Object in list and top level
													properties from remaining Objects
										
										=[Number]	create clone of 1st Object in list and clone of 
													properties upto depth specified by Number
													(=0 top level clone of all Objects -- same as =true)
		*/
		elements: 'copy',				//copy, clone, deep, ignore, toString, toString("basic")...
		
		functions: 'clone',				//copy, clone, ignore
		
										//??
										//objects: if function statement contains fn name, it is used as a 
										//simple constructor the fn stmt without
										//arguments is used as a simple constructor to create clone then
										//all properties including functions are cloned and merged.
		
		excludeKeys: 'function.script'.split(/\s+/),
		excludeTypes: 'anounomous null undefined'.split(/\s+/),	
		includeTypes: [],				//over-rides excludeTypes
		
	//	retainTypes: 'Element Array object function'.split(/\s+/),
		
		logOutput: ['trace'],			//"oops", "trace", "tag"
		logAll: true,
		logFilter: 'ignore clone append replace create update'.split(/\s*/),

		
		format: 'EZtoString',			//future: ??
		formatOptions: { 
			tostring: {timestamp: false},
			stringify:{spaces:4} 
		},
		
		//defaults: {String:'script', Element:'sourceTag'},
		
		name: 'EZ.merge.options',
		version: '09-21-2016',
		
		tags: {
			log: ''						//EZ.merge.test sets to: "log" as of 09-21-2016
		},
		
		_defaults:						//may not be complete partial list
		{
		}
	}
	//__________________________________________________________________________________________________
	/**
	 *	constructor for _init() -OR- legacy EZ.merge()
	 */
	function EZmerge(options, baseObj /* obj1, obj2, ... */)
	{
		if (this instanceof arguments.callee)		//called as constructor
		{								
			this._ = {};							//object properties -- defaults set by _init()
			//__________________________________________________________________________________________
			/**
			 *	Internal function 
			 */
			this._getTag = function(name)
			{
				var tag = EZ.merge.options.tags[name];
				if (!tag) return;
				
				return EZ(tag, null);
			}
			return this;
		}											
		/*---------------------------------------------------------------------------------------------
		EZ.merge([options,] baseObj, object(s)...)							        1st merge iteration
		
		never fully trusted -- confusing options interface -- but appears to work for EZgetEl_settings()
		may have issuses or over-merge with EZoptions (or others) custom Objects.
																					 
		Merge all properties from each in newObj into 1st object replacing existing properties and
		appending new ones. if 1st Object is undefined or null, clone as next non-null, non-empty
		Object that follows or new Object if none follow.
		
		When any property is an object type, it is cloned upto the maxdepth option described below.
		
		ARGUMENTS:
			options		(optional)	1st argument if Object containing mergeOptions property which is Object
						containing any of the following options:
		
							maxdepth	any property typeof object at this level is not cloned
										it is copied as a reference to the original (default: 9)
		
			baseObj		specifies base object to be merged with properties from all the folowing objects
						use empty object to merge all objects into new object
		
			objects		all arguments following baseObj specify one or more objects to merge
		
		RETURNS:
			1st object with properties merged from following objects.
		
		//if (!fromObj || fromObj == null || typeof(fromObj) != 'object') return;
		--------------------------------------------------------------------------------------------------*/
		var args = [].slice.call(arguments);
	
		//----- options is 1st arg if object with mergeOptions property
		options = '.mergeOptions'.ov(options) ? args.shift().mergeOptions : {};
		var mergeOptions = {
			maxdepth: 	'.maxdepth'.ov(options,	9),
			arraylike: 	'.arraylike'.ov(options,'replace'),	//ignore //TODO: update
			append: 	'.append'.ov(options,	true),
			replace:	'.replace'.ov(options,	true),
			exclude: 	'.exclude'.ov(options,	[''])		//TODO:
		}
		mergeOptions.exclude = EZ.toArray(mergeOptions.exclude, ',');
	
		//----- baaeObj is next argument
		baseObj = args.shift();
		if ('object function'.indexOf(typeof(baseObj)) == -1)
			baseObj = null;					//clear if not Object
	
		//----- remaining args are objects to be merged into the baseObj
		args.forEach(function EZmergeObjects(fromObj)
		{
			if (EZ.isEmpty(fromObj, {legacy:false} )) return;
	
			var isArrayLike = mergeOptions.arraylike == 'ignore' || EZ.isArrayLike(fromObj);
			if (isArrayLike)
			{
				if (!baseObj)				//create baseObj as clone of object Array
					baseObj = [].slice.call(fromObj);
	
				else if (!EZ.isArrayLike(baseObj)) 		//if baseObj not ArrayLike, make it...
					baseObj = [].merge.call(baseObj);	//...so using Array.prototype.merge
	
				else						//otherwise, replace baseObj Array with fromObj
					[].merge.call(baseObj, [].slice.call(fromObj));
			}
	
			if (!baseObj)					//create baseObj if not object
				baseObj = EZ.clone(fromObj, options.maxdepth);
			else
			
			{
				for (var p in fromObj)
				{
					//if (p === '') continue;
					if (isArrayLike && (p == 'length' || !isNaN(p))) continue;
					if (mergeOptions.exclude.indexOf(p) != -1) continue;
					if (fromObj.hasOwnProperty && !fromObj.hasOwnProperty(p)) continue;
	
					if (!mergeOptions.append && typeof(baseObj[p]) == 'undefined') continue;
					if (!mergeOptions.replace && typeof(baseObj[p]) != 'undefined') continue;
	
					if ('object function'.indexOf(typeof(fromObj[p])) != -1)
					{
						if (mergeOptions.maxdepth > 0)
						{
							baseObj[p] = window.EZ.clone(fromObj[p], mergeOptions.maxdepth);
							continue;
						}
					}
					baseObj[p] = fromObj[p];
				}
			}
		});
		return baseObj || {};
	}
	/*---------------------------------------------------------------------------------------------
	EZ.mergeAll(obj1, obj2, ... options))										2nd merge iteration
	EZ.mergeAppendOnly												 optional arguments over-teched
	EZ.mergeReplaceOnly								optionally clones via json -- not fully trusted
												   extensively used and trusted for top level merge
	
	Pruned and refactored version of EZ.merge() -- basic functionality for most common scenarios.
	
	Always returns new object after merging properties from each supplied argument typeof 'object'
	except Array, document or HTML object.
	
	Original purpose was for merging function options supplied as arguments with global or saved
	options.
	
	Simply copies (or clones see below) all top level Object properties regardless of type.
	
	Embedded arrays, objects, functions reference the same Object as the Object supplied as argument
	unless the clone option is specified.
	
	The append and replace options only apply at the top level. When a property is merged from
	another Object argument.
	
	ARGUMENTS:
		options		(required)	Always 1st argument for recursive call otherwise must be space
					delimited of the form: "append=false replace=true"
	
					Below are options available:
	
					append:		false,
					replace:	true,
					clone:		false,		true to clone all top level properties via EZ.stringify()
											using enhanced Javascript json which completely replicates
											most native Objects including Date, RegExp, Function and
											Array (with named properties)
											HTML objects of Objects containing any are not cloned.
	
		obj1, obj2	Object merged into new Object -- if none specified, returns after initializing
		...			global options EZ.mergeAll.options
	
	RETURNS:
		new Object with top level properties merged from each supplied Object argument.
	
		EZ.mergeAll.messages contains list of properties NOT merged when append or replace is false
		-OR- any exceptions throw by EZ.stringify() -- used by EZ test Assistant
		call EZ.mergeMessages(EZ.mergeAll.messages) for formatted String for display
	--------------------------------------------------------------------------------------------------*/
	EZmerge.prototype.all = function EZmergeAll(options, obj1, obj2)
	{																	e=[obj1,obj2]	//doc
		if (EZ.test.capture()) {return EZ.test.capture(this)} else if (EZ.test.debug()) debugger;
		
		var rtnObj = {};
		var me = arguments.callee;
		//---------------------------------
		while (EZ.start({lock:this != me}))
		//---------------------------------
		{
			me.options = me.options || 	//initialize global options if not defined
			{
				append:		true,
				replace:	true,
				clone:		false,		//true to clone top level properties via EZ.stringify()
				trace:		false,
	
				//TODO:
				array:		false,
				arraylike:	false,
				html:		false,
				maxdepth:	9,
				include:	[],
				exclude: 	['[]']		//array of keys to exclude -- * to exclude all except include keys
										//'[]' to exclude numeric keys and length from Array and ArrayLike objects
			}
			if (!arguments.length)
				return {};				//return after global options defined if no arguments
	
			var args = [].slice.call(arguments);
	
			  //-------------------------------------------\\
			 //----- initialize options used for merge -----\\
			//-----------------------------------------------\\
			if (this == me)				//if recursive call, 1st arg is options
				args.shift();
			else						//otherwise . . .
			{										//if this is options			
				if (EZ.getObjectType(this) == 'String')
					options = EZ.getAttributes(this+'', true);
				
		//		else if (EZ.getObjectType(this) == 'Object')
		//			options = this;
	
				else if (typeof(options) == 'string')
					args.shift();					//options is 1st argument if string
				else
					options = me.options;			//otherwise just use global options
	
				if (options != me.options)
				{ 									
					me.messages = {};				//clear merge messages
					me.processedObjects = [];		//clear processedObjects
					
					if (!Object.keys(options).length)
						options = me.options;		//if empty options, use global options
					else
					{								//otherwise call ourself to merge with global options
						var myOptions = {replace:true, append:false, clone:false};
						options = me.call(me, myOptions, me.options, options);
					}
				}
				else								//added 09-05-2016
				{
					me.messages = me.messages || {};	
					me.processedObjects = me.processedObjects = [];
				}
			}
	
			  //--------------------------\\
			 //----- now do the merge -----\\
			//------------------------------\\
			args.forEach(function(obj, idx)
			{
				if (!(obj instanceof Object)) 			//TODO: function script??
					return;
				
				var keys = Object.keys(obj);
				if (EZ.isArray(obj))
				{
					if (idx === 0)
						rtnObj = [];
					keys.remove('length');
					rtnObj.length = !rtnObj.length || isNaN(length) ? obj.length
								  : Math.max(rtnObj.length, obj.length)
				}
				
				keys.forEach(function(key)
				//for (var key in obj)
				{
					if (idx > 0 && !options.replace && key in rtnObj)
						EZ.mergeMessages(me.messages,'not replaced', key);
	
					else if (!options.append && !(key in rtnObj))
						EZ.mergeMessages(me.messages,'not appended', key);
	
					else if (!(obj[key] instanceof Object) || me.processedObjects.includes(obj[key]))
						rtnObj[key] = obj[key];
					
					//05-21-2016
					else if (me.processedObjects.includes(obj[key]))
					{
						EZ.mergeMessages(me.messages,'repeated object', key);
						
						//05-21-2016
						rtnObj[key] = 'circular [Object]';
					}
					else
					{
						me.processedObjects.push(obj[key])
						if (options.clone)
							rtnObj[key] = cloneObject(obj[key]);
						else
							rtnObj[key] = me.call(me, options, rtnObj[key], obj[key]);
					}
					void(0);			//breakpoint
					/*05-21-2016
					*/
					/*
					else if (!options.clone || !obj instanceof Object)
						rtnObj[key] = obj[key];
	
					else
						rtnObj[key] = cloneObject(obj[key]);
					*/
				});
			});
			  //--------------------------------------------\\
			 //----- log any messages if trace enabled  -----\\
			//------------------------------------------------\\
			if (options.trace && !EZ.isLock(EZ.trace))
			{
				var msg = EZ.mergeMessages(me.messages).replace(/ x 1/g, '');
				if (msg)
					EZ.trace('?mode=true stacktrace=true', msg);
			}
			break;
		}
		//========================
		return EZ.finish(rtnObj);
		//========================
	
		//______________________________________________________________________________
		/**
		 *
		 */
		function cloneObject(obj, key)
		{
			try
			{
				var json = EZ.stringify(obj,'*');	//extended javaScript json
				var cloneObj;
				eval('cloneObj=' + json);
				if (EZ.equals(cloneObj, obj))
					return cloneObj;
			}
			catch (e)
			{
				EZ.mergeMessages(me.messages,'EZ.stringify exception', key);
				//EZ.trace('cloneObject failed', json)
			}
			//return EZ.clone(obj)
			EZ.mergeMessages(me.messages,'unable to clone', key);
			return obj;
		}
	}
	//_________________________________________________________________________________	
	/**
	 *	EZ.merge.into(objList, options)							EZ.merge.deep() varient
	 *
	 *	returns first existing Array, Object or Function from specified list after deep
	 *	merge of all properties from subsequent Object(s) supplied in list INTO the 1st
	 *	as specified by the default or supplied options.
	 *
	 *	All objects other than the first are not changed
	 *
	 *	Same high level logic as original EZ.merge() with more flexibity and stability.
	 */
	EZmerge.prototype.into = function EZmerge_deep(objList, options)
	{
		options = options || {}
		options.maxdepth = 0;
		return EZ.merge.deep(objList, options);
	}
	//_________________________________________________________________________________	
	/**
	 *	EZ.merge.top(objList, options) 							EZ.merge.deep() varient
	 *
	 *	returns top level clone of all first Array, Object or Function from specified 
	 *	with top level properties from Object(s) supplied in the list specified by the 
	 *	default or supplied options.
	 *
	 * 	Modeled after EZ.mergeAll() with more flexibility and without its limitations.
	 */
	EZmerge.prototype.top = function EZmerge_deep(objList, options)
	{
		options = options || {}
		options.maxdepth = 0;
		return EZ.merge.deep(objList, options);
	}
	//_________________________________________________________________________________	
	/**
	 *
	 */
	var _validateOptionDetail = function(opt)
	{	
		var _ = EZ.merge._;
		
		if (typeof(opt) == 'boolean')
			return opt ? _.options.trueOpts : false;
		
		if (!EZ.isArray(opt))
		{
			if (typeof(opt) != 'string' || opt == 'false')
				return '';
			
			if (opt === 'true')
				return _.options.trueOpts;
			
			opt = opt.replace(/1st/, '1');	
			opt = opt.split('').extract(_.options.validOpts.split(''));
			
			if (opt.length === 0)
				opt = _.options.defaultOpts;

			if (opt.includes('k'))
				opt = opt.remove('r');
			
			if (opt.includes('*'))
				opt = opt.remove(['<', '>']);
		
			return opt.join('');
		}
	}
	//_________________________________________________________________________________	
	/**
	 *	EZ.merge.deep(objList, options)			Yet another object merge/clone function
	 *
	 *	With default options returns clone of 1st Array, Object or Function Object in 
	 *	specified list with deep merge of all properties from subsequent Object(s) 
	 *	supplied in the manner specified by the default or supplied options.
	 *
	 *	By default merged property Objects are first cloned using the original constructor 
	 *	when possible making them separate Objects. The clones do not replace any existing
	 *	property Objects (by default)
	 *	
	 *	Initially created as optimized merge for EZgetEl_settings() when EZ.merge() was
	 *	failing for some scenarios. Subenquently refined and encapsulated into the EZ.merge 
	 *	fn group after the initial EZ.merge() issue was resolved. 
	 *
	 *	Contains the following refinements:
	 *		-uses logic from EZ prototype.cloneObject() to preserve custom Object types
	 *		-html elements can be copied or cloned via native Element.clone()
	 *		-uses updated EZ.counts() to log merge operations
	 */
	EZmerge.prototype.deep = function EZmerge_deep(objList, options)
	{
		var _ = EZ.merge._;
		
		options = EZ.merge.deep.options = EZ.options.call(EZ.defaultOptions.merge, options);
		options.append = _validateOptionDetail(options.append);
		options.replace = _validateOptionDetail(options.replace);
		
		var excludeTypes = EZ.toArray(options.excludeTypes).slice();
		excludeTypes.forEach(function(type, idx)
		{
			excludeTypes[idx] = type.toLowerCase();
		});
		var includeTypes = EZ.toArray(options.includeTypes).slice();
		includeTypes.forEach(function(type, idx)
		{
			includeTypes[idx] = type.toLowerCase();
		});
		
		var depth = 0;
		var dotName;
		var objPrefix;
		var isClone = options.clone;
		var cloneName = '';
		var mergedName = '_';
		
		var processed = [];
		var appendedList = {};
		var replacedList = {};
		
		_.logAll = [];
		_.logSummary = {}
		_.logCounts = EZ.counts();
		/**
		 *
		 */
		var log = function _log(msg, p)
		{
			var key = objPrefix + dotName.join('.');
			if (p)
				key += '.' + p;
										//remove 1st, 2nd ... prefix if any
			var msgShort = msg.replace(/.*\s+(.*?):.*/, '$1');
			if (!options.logAll)
			{
				var msg1stWord = msgShort.replace(/^(.*?)( | $)/, '$1');
				if (options.logFilter.includes(msg1stWord))
					return;
			}
			_.logAll.push( key + '=' + msg );
			_.logCounts.add(key, msg);
			EZ.mergeMessages(_.logSummary, msgShort, key);
		}
		
		var objList = EZ.toArray(objList);
		if (objList.length === 0)
		{
			log('no Objects supplied');
			options.logOutput.push('oops');
		}
		var obj;
		objList.forEach(function(o, idx)				
		{
			objPrefix = '#' + idx; 
			dotName = ['_'];
			if ( !(o instanceof Object) )				//skip non-objects in specified list
			{
				if (options.logIgnore)
					log('ignored objList item: ' + EZ.format.value(o));
				return;
			}
			else if (obj == null && options.clone === false)
			{											//1st iten not cloned
				obj = objList[idx];
				log('merge into existing [' + EZ.getType(obj) + ']');
				mergedName = objPrefix;
				return;
			}
			obj = _merge(obj, o);
			cloneName = '';
		});												  //------------------------------\\														
														 //----- format and save logs -----\\
		var logAll = _.logAll.join('\n');				//----------------------------------\\
														//convert #1_ --> [1] when not cloned
		logAll = logAll.replace(/#(\d+?)_/g, '[$1]').replace(/=/g, ' \t');
		logAll = logAll.split('\n').format().join('\n');
														//html for <details> tag
		_.detail = EZ.mergeMessages(_.logSummary).replace(/\n+/g, '\n').replace(/ x 1/g, '')
		_.detail = _.detail.replace(/#(\d+?)_/g, '[$1]')
				 + '<br>' 
				 + logAll.wrap('<details>');
		
		var countsSummary = _.logCounts.toString() || 'log empty'.wrap();
		if (options.logOutput.includes('oops'))
			EZ.oops('EZ.counts() merge log', countsSummary);
		
		if (options.logOutput.includes('trace'))
			EZ.trace('complete merge log', _.logAll);
		
		//if (EZ(options.logTag, null))
		//	EZ.set(EZ.el, logMessages);
		//=====================================================
		return obj instanceof Object ? obj : _createObject({});
		//=====================================================
	
		//____________________________________________________________________________________
		/**	
		 *	here is the meat -- with help from: _canMerge() and _createObject()
		 *	==================================================================================
		 *	>>>> merge properties from each specified Object or enbedded property Object <<<<<
		 *	==================================================================================
		 */
		function _merge(toObj, fromObj, key)
		{
			if (key)
				dotName.push(key);
			
			if ( !(toObj instanceof Object) )
			{
				toObj = _createObject(fromObj);
				if (isClone)
				{
					isClone = false;
					cloneName = dotName;
				}
				if (!mergedName)
					mergedName = objPrefix;
			}
			void(0);
			for (var p in fromObj)
			{
				var value = fromObj[p];
				var mergeOpt = _canMerge(toObj, fromObj, p);		//Array of merge options for this key
				if (!mergeOpt)										//...or false if merge not allowed
					continue;
				
				if ( !(value instanceof Object) )
				{
					toObj[p] = fromObj[p]
					log('updated --> ' + value, p);
				}			
				else						//Object, Array or Function
				{
					if (!fromObj.hasOwnProperty(p))
						continue;
					if (p == 'length' && EZ.isArray(fromObj) && EZ.isArray(toObj))
						continue;
					
					else
					{
//TODO: Elements
					}
					if (processed.includes(value))
					{
						log('ignored duplicate Object', p) 
						continue;
					}
					if (typeof(fromObj) == 'function' && /^(source|name|displayName)$/.test(p))
					{
//TODO: Functions, Data, RegExp
						continue;
					}
					
					if (depth >= options.maxdepth)
						log('ignored Object > maxdepth', p) ;

					else if (value.childNodes)
					{
						log('TODO: html element', p) 
					}
					else												  //-----------------------------\\
					{													 //----- property is Object  -----\\
						var sourceObj = value;							//---------------------------------\\
						if ('@ * +'.includes(mergeOpt))	
						{												//simply replace property
							processed.push(sourceObj);
							toObj[p] = _createObject(fromObj, p);
							toObj[p] = _merge(toObj[p], fromObj[p], p, depth+1)
							continue;
						}

						var nowObj = toObj[p];							//current merged Object
						var nowKeys = Object.keys(nowObj);	
						var sourceKeys = Object.keys(sourceObj);
						var allKeys = nowKeys.concat(sourceKeys);
						if (mergeOpt.includes('>'))						//...">"...
							toObj[p] = _createObject(sourceObj, p);		//create new Object of source type
								
						allKeys.forEach(function(key)
						{												//..."r"...replace existing property
							if (mergeOpt.includes('r') && key in sourceObj)
								toObj[p] = _merge(fromObj[p], sourceObj, p, depth+1)
																		//..."k"...keep existing property
							else if (mergeOpt.includes('k') && key in nowObj)
								toObj[p] = _merge(fromObj[p], nowObj, p, depth+1)
									
						});
//TODO: adjust ArrayLike length
					}
				}
				if (typeof(fromObj) == 'function')
				{
					if (Object.keys(value).length === 0)
						log('function object empty') 
				}
				//toObj[p] = value;
			}
			if (key)
				dotName.pop();
			return toObj;
		}
		//_________________________________________________________________________________	
		/**
		 *	determine if value can be merged based on options.append if appending -OR-
		 *	options.replace if replacing -- appending if dotName previously appended.
		 *
		 *	RETURNS:
		 *		single character indicating type of merge:  @ * + > r k
		 *		-OR- empty Array if merge not allowed for property
		 */
		function _canMerge(to, from, key)
		{
			var updateList, action;
			var dotNameKey = dotName.concat([key]).join('.');
			var fullKey = objPrefix + dotNameKey;
			void(fullKey);
			
			var mergeOpt = [];
			var targetType = EZ.getType(to[key]);
			var sourceType = EZ.getType(from[key])
															  //--------------------------------\\
			var type = sourceType.toLowerCase();			 //----- check for excludedType -----\\
			if (excludeTypes.includes(type)					//------------------------------------\\
			&& !includeTypes.includes(type))
			{												
				log('ignored type: ' + type, key);
				return false;
			}

			if (dotName.length == 1 && dotName[0] == cloneName)
			{
				mergeOpt = _.options.trueOpts.split('');
				action = 'clone:&nbsp;&nbsp; ';
			}
																
			else if (!(key in to) 							  //----------------------------------\\
			|| appendedList[dotNameKey])					 //----- append: check if allowed -----\\
			{												//--------------------------------------\\
				if (!options.append)
					action = 'not appended';
				else if (options.append.includes('1') && key in to)
					action = 'not appended - not 1st';
				if (action)
				{
					log(action, key) 
					return false;
				}
				//-----------------------------------------------------------------------------------
				if (!_checkObjectTypes(options.append, 'append'))		//check Object types match
					return false;
				//-----------------------------------------------------------------------------------
				action = 'append:&nbsp; ';
				updateList = appendedList;
			}
															  //----------------------------------\\
			else											 //----- check if replace allowed -----\\
			{												//--------------------------------------\\
				if (!options.replace)
					action = 'not replaced';
				
				else if (options.append.includes('1') && key in to)
					action = 'not replaced - not 1st';
				
				if (action)
					return log(action, key) 
				//-----------------------------------------------------------------------------------
				if (!_checkObjectTypes(options.replace, 'replace'))		//check Object types match
					return false;
				//-----------------------------------------------------------------------------------
				action = 'replace: '; 
				updateList = replacedList;
			}
															  //-----------------------------------\\
			var suffix = '';								 //----- good to merge update logs -----\\
			if (updateList)									//---------------------------------------\\
			{
				if (!updateList[dotNameKey])
					updateList[dotNameKey] = 0;
				var count = ++updateList[dotNameKey];
				suffix = count.suffix() + ' ';
			}
			if (action)	
			{									
				/*
				var msg = suffix + action
						+ EZ.format.value(to[key]) + ' --> '
						+ EZ.format.value(from[key]);
				*/
				var msg = suffix + action
						+ (to[key] === undefined ? '[new key]' : EZ.format.value(to[key]))
						+ ' --> '
						+ EZ.format.value(from[key]);
				log(msg, key)							
			}
			//==============
			return mergeOpt;
			//==============
			//_____________________________________________________________________________
			/**
			 *	determine if replace allowed based on existing and replace property types
			 */
			 function _checkObjectTypes(options,rule)					//"append" or "replace"
			 {
				var flag = '';
				options = options.split('');
				mergeOpt = options.extract('r k');
				
				if ( !(key in to) )								//if new property -- all is good						 
					return _.options.trueOpts.split('');
	
				else if (!(to[key] instanceof Object) 			//to is not object from is 
				&& (from[key] instanceof Object))
				{
					mergeOpt.push('+');
					flag = '[+]';
					if (!options.includes('+'))
					{										 
						log('ignore[+] Object ' + rule + ' rule', key);
						return false;
					}
				}
				else if ((to[key] instanceof Object) 			//to is Object but from is not
				&& !(from[key] instanceof Object))
				{
					mergeOpt.push('-');
					flag = '[-]';
					if (!options.includes('-'))
					{										
						log('ignore[-] non-Object[-] ' + rule + ' rule', key);
						return false;
					}
				}
				else if ((to[key] instanceof Object) 			//both Objects
				&& from[key] instanceof Object)
				{
					mergeOpt = mergeOpt.concat( options.extract('* r k') )
					if (targetType != sourceType && mergeOpt.includes('*'))
					{
						//if (!options.includes('*'))
						//	mergeOpt.push('*');
						
						if (!options.includes('<'))
							mergeOpt.push('<');
						
						else if (!options.includes('>'))
							mergeOpt.push('<');
						
						else
							return log('ignore ' + targetType.wrap('[') 
									  + ' NOT ' + sourceType.wrap('[') + ' ' + rule + ' rule', key);
					}
					flag = mergeOpt;
				}
				if (flag)
					log('changed ' + targetType + ' --> ' + sourceType 
					   + mergeOpt.join('').wrap('[') + ' ' + rule + ' rule', key);
				
				return mergeOpt;
			}
		}
		//_________________________________________________________________________________	
		/**
		 *
		 */
		function _createObject(obj, key)
		{
			var clone = {};	
			try
			{
				var type;
				if (typeof(obj) == 'function') 			//create new fn from script -OR-
				{
					clone = eval('clone=' + Function.prototype.toString.call(obj))
					type = 'function';
				}
				else
				{
					type = obj.constructor.name.wrap('[');
					clone = obj.constructor();			//new Object with original constructor		
				}
				log('created ' + type + ' for ' + mergedName + dotName.concat(key).join('.'), key);
			}
			catch (e)
			{
				EZ.oops('Exception creating custom Object -- returned {}', e);
			}
			return clone;
		}
	}
	//__________________________________________________________________________________________________
	/**
	 *	creates new instance but copies all properties and prototypes to static function so EZ.merge()
	 *	still valid and calls defaultFumction with this context.
	 */
	var _init = function()
	{
		var fn = new EZmerge();
		for (var key in fn)
			EZmerge[key] = fn[key];
			
		EZ.event.add(window, 'onload', function()			//_init() -- initialize options plus...
		{
			var _ = EZ.merge._;
			var options = EZ.merge.options = EZ.merge._.options = EZ.options(EZ.defaultOptions.merge);
			for (var key in options._defaults)
				_[key] = options._defaults[key];
															
			EZ.mergeAll = EZ.merge.all;						//define EZ.mergeAll() and varients
			EZ.mergeWithOptions = function EZmergeWithOptions(options)
			{
				return EZ.mergeAll.apply(options, [].slice.call(arguments, 1))
			}
			EZ.mergeAppendOnly = function EZmergeAppendOnly()
			{
				return EZ.mergeAll.apply('? append=true replace=false', [].slice.call(arguments))
			}
			EZ.mergeReplaceOnly = function EZmergeReplaceOnly()
			{
				return EZ.mergeAll.apply('? append=false replace=true', [].slice.call(arguments))
			}
		});
		return EZmerge;
	}
	//==================================================================================================
	return _init();
})();
//_____________________________________________________________________________________________
EZ.merge.deep.test = function()
{
	var arg, obj=null, ctx, ex, exfn, note = '', rtnValue;
	/*  jshint: future vars */	[arg, obj, ctx, ex, exfn, note, rtnValue];
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	var resultsClone;
	exfn = function(results /*, testrun */)
	{
		resultsClone = results;
		//testrun.results = results = {results: results}
	}
	void(exfn)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	var notefn = function(testrun, phase)
	{
		if (phase != 'final') return;
		
		var optKeys = 'clone append replace'.split(/\s+/);		//opts always displayed
		var defOpts = EZ.defaultOptions.merge;
		for (var k in defOpts)
			if (!optKeys.includes(k) && !EZ.isEqual(EZ.merge.deep.options[k], defOpts[k]))
				optKeys.push(k);						//show keys changed from default
		
		//var note = testrun.note.replace(/\n/, ': ') + '<hr>';
		var opts = EZ.merge.deep.options;
		if (opts.append == opts.trueOpts)
			opts.append += ' (true)';
		if (opts.replace == opts.trueOpts)
			opts.replace += ' (true)';
		var json = EZ.stringify(opts, optKeys).wrap('<pre>');
		var detail = EZ.merge._.detail || 'no details';
		var html = json + '<hr>' + detail.wrap('<pre>');
		return html;
	}
	//[notefn]
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	var list, opts, obj1, obj2, obj3;
	[list, opts, obj1, obj2, obj3]
	
	//______________________________________________________________________________
	EZ.test.settings({group:'simple tests - 2 objects'})
	list = [{a:1, b:2}, {b:22, c:3}]
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	EZ.test.options( {ex:ex, notefn:notefn, note:'append and replace'} )
	EZ.test.run(list, {clone:true});
	
	EZ.test.options( {ex:ex, notefn:notefn, note:'append only'})
	EZ.test.run(list, {replace:false, clone:true});
	
	EZ.test.options( {ex:ex, notefn:notefn , note:'replace only'})
	EZ.test.run(list, {append:false});
	
	//______________________________________________________________________________
	EZ.test.settings({group:'simple tests - 3 objects'})
	list = [					//values coorespond to list index
		null,
		{a:1, b:1}, 
		{     b:2, c:2},
		{a:3, b:3, c:3, d:3}
	]
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	EZ.test.options( {ex:ex, notefn:notefn , note:'append and replace always (default)'})
	EZ.test.run(list);
	
	EZ.test.options( {ex:ex, notefn:notefn , note:'append 1st time only - no replace'})
	EZ.test.run(list, {append:'1st', replace:false});
	
	EZ.test.options( {ex:ex, notefn:notefn , note:'append 1st time only -- replace always'})
	EZ.test.run(list, {append:'1st', replace:true});
	
	//______________________________________________________________________________
	EZ.test.settings({group:'replace scenarios with Objects'})
	list = [					//values coorespond to list index
		null,
		{a:1,    b:1}, 
		{a:2,    b:{x:2, z:9}, c:{x:2}},
		{a:null, b:{x:3, y:3}, c:2},
	]
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	EZ.test.options( {ex:ex, notefn:notefn , note:'embedded Objects replace existing'})
	EZ.test.run(list, {replace:true, });
	
	EZ.test.options( {ex:ex, notefn:notefn , note:'null not ignored -- replaces non-null'})
	EZ.test.run(list, {clone:true, replace:true, includeTypes:['null']});
	
	EZ.test.options( {ex:ex, notefn:notefn , note:'append only'})
	EZ.test.run(list, {replace:false});
	
	EZ.test.options( {ex:ex, notefn:notefn , note:'append 1st only'})
	EZ.test.run(list, {replace:false, append:'1st'});
	
	EZ.test.options( {ex:ex, notefn:notefn , note:'append 1st only'})
	EZ.test.run(list, {replace:false, append:'1st', clone:true});
	
	EZ.test.options( {ex:ex, notefn:notefn , note:'only repl obj with obj -- non-obj with non-obj'})
	EZ.test.run(list, {replace:'@', append:'@'});
	
	EZ.test.options( {ex:ex, notefn:notefn , note:'obj can repl non-obj but non-obj cannot repl obj'})
	EZ.test.run(list, {replace:'@+', append:'@+'});
	
	EZ.test.options( {ex:ex, notefn:notefn , note:'embedded b obj merged repl existing'})
	EZ.test.run(list, {replace:'@+r', append:'@+'});
	
	EZ.test.options( {ex:ex, notefn:notefn , note:'c obj replaced by number because append allows'})
	EZ.test.run(list, {replace:'@+'});
	
	list[1].c=1;
	EZ.test.options( {ex:ex, notefn:notefn , note:'obj can repl non-obj but non-obj cannot repl obj'})
	EZ.test.run(list, {replace:'@+', append:'@+'});
	
	EZ.test.options( {ex:ex, notefn:notefn , note:'non-obj can repl obj but obj cannot repl non-obj'})
	EZ.test.run(list, {replace:'@-', append:'@-'});
	
	EZ.test.options( {ex:ex, notefn:notefn , note:'anything can replace anything'})
	EZ.test.run(list, {replace:'@+-'});

	//______________________________________________________________________________
	EZ.test.settings({group:'embedded objects merged'})
	
	EZ.test.options( {ex:ex, notefn:notefn , note:'keep existing properties of same key'})
	EZ.test.run(list, {replace:'@k'});
	
	EZ.test.options( {ex:ex, notefn:notefn , note:'repl existing properties of same'})
	EZ.test.run(list, {replace:'@r'});

	//______________________________________________________________________________
	EZ.test.settings({group:'different objects types e.g. [Object] vs [Date]'})
	
	EZ.test.options( {ex:ex, notefn:notefn , note:'use new type'})
	EZ.test.run(list, {replace:'<'});
	
	EZ.test.options( {ex:ex, notefn:notefn , note:'keep existing type'})
	EZ.test.run(list, {replace:'>'});
	
	if (true) return;

	//______________________________________________________________________________
	var obj1 = {
		args: [],
		ctx: "@not specified@",
		results: {
			a: 1,
			b: 2,
			c: 3
		}
	}	
	var obj2 = {
		args: [],
		results: {
			a: 11,
			b: 22,
			c: 33
		}
	}
	ex = []
	ex[0] = {
		args: [],
		ctx: "@not specified@",
		results: {
			a: 11,
			b: 22,
			c: 33
		}
	}	
	ex.results = ex[0]	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	EZ.test.options( {ex:ex, notefn:notefn , note:note})
	EZ.test.run(obj1, obj2);	
	
	var defaultOptions = {show:true, green:''}
	obj1 = EZ.options(defaultOptions)
	//delete obj1.toString
	ex = []
	ex[0] = {
	    show: false,
	    green: "",
	    add: "red",
	    del: "green"
	}
	ex.results = ex[0]	
	ex[0].toString = obj1.toString
	
	
	EZ.test.options( {ex:ex, notefn:notefn , note:note})
	rtnValue = EZ.test.run(obj1, {show:false, add:'red', del:'green'});	
	
	EZ.test.options( {ex:ex, notefn:notefn , note:note})
	obj = {};
	var oList = [obj1, {show:false, add:'red', del:'green'}];
	rtnValue = EZ.test.run(obj, oList);	

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	//______________________________________________________________________________
}


// . . . . . . . .  . . . . . . . . . . . . . . .  . . . . . . . . . . . . . . . .
EZ.merge.test = function()
{
	var ex, ctx, note, obj;

	// #1
	var objectLike = [1,2]
	objectLike.x = 24
	objectLike.y = 25

	ex = objectLike;
	EZ.test.run(objectLike,	 					{EZ:{ex:ex, ctx:ctx, note:note}})
	//____________________________________________________________________________

	// #2
	obj = {array: objectLike}
	ex = obj
	EZ.test.run(obj,	 						{EZ:{ex:ex, ctx:ctx, note:note}})
	//____________________________________________________________________________


	//____________________________________________________________________________

	var o = {a:1, b:2};		//clone to retain "as is" for all sebsequent tests
	EZ.test.run(EZ.clone(o), {}, 							{EZ:{ex:o }})
	EZ.test.run(EZ.clone(o), {a:11, b:22},	 				{EZ:{ex:{a:11, b:22} }})
	//______________________________________________________________________________

	var div = document.createElement('div');
	var span = document.createElement('span');
	var divObj = {d:div}
	var spanObj = {d:span}
	EZ.test.run({},divObj,spanObj, 		{EZ: {ex:{d:div, s:span},	note:''	}})

if (!false) return;
	EZ.test.results.push( EZ.merge() );
	EZ.test.results.push( EZ.merge({}) );
	EZ.test.results.push( EZ.merge({}, {a:11, b:22, c:33}) );
	EZ.test.showResults();
}
//_____________________________________________________________________________________________
EZ.merge.all.test = function()
{
	var arg, obj=null, ctx, ex, exfn, note = '';
	/*  jshint: future vars */	e = [arg, obj, ctx, ex, exfn, note];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	var obj1 = {
		args: [],
		ctx: "@not specified@",
		results: {
			a: 1,
			b: 2,
			c: 3
		}
	}	
	var obj2 = {
		args: [],
		results: {
			a: 1,
			b: 2,
			c: 3
		}
	}
		
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	EZ.test.options( {ex:obj1, note:note})
	EZ.test.run(obj1, obj2);	

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	//______________________________________________________________________________
	return;
}
/*--------------------------------------------------------------------------------------------------
EZ.right(str, noChars)

return empty string if str not typeof string
--------------------------------------------------------------------------------------------------*/
EZ.right = function EZright(str, noChars)
{
	if (typeof(str) != 'string') return '';
	return str.right(noChars);
}
/*--------------------------------------------------------------------------------------------------
EZ.s( count, text, [, suffix [, countValue]] )
EZ.s( text [,count] [, suffix [, countValue)]] )

Return singular or plural form of text using count specified as either argument or embedded in text.
Plural text is created by adding specified or default suffix when count is NOT 1 -or- IS -1.

The suffix is added to the last word of the text (or end of text if it does not contain any words.

The returned text is prefixed with the countValue if count is supplied as the 1st argument and the
text does not contain a number or "#" placeholder. When text contains any number or # placeholder,
it is replaced by the countValue derived from count specified as argument or embedded in the text.

A count supplied as an argument takes precendence over a number embedded in the text.

By default the countValue is simply the count or blank when specified as true or false. 

Both the default suffix and countValue can be overriden via the countValue argument.

ARGUMENTS:
	count		(optional) 1st or 2nd argument if number or boolean -- used to determine suffix
				plural suffix added to returned text -- if not supplied, 1st number in text is used.
				text. 

				Prepended to returned text If specified as 1st argument and text 
	
	text		(required) specifies text to append with suffix or zeroSuffix
	
	suffix		(optional) String specifing singular suffix used when count IS -1 -OR- plural suffix 
				used when count >= 0 but NOT 1 (or true) DEFAULT: "s"

				An Array can be supplied to specify count different suffixes. The array item
				corresponding to the count is then used or the last array item when count
				is greater then the Array length.
				
					e.g. 
						EZ.s(count, 'match', 's', 'no')
					returns:
						"no matches"  "1 match"  "2 matches" ...
	
	countValue	(optional) String to specify countValue used for count=0 or Array to spefify
				coutValue associated with specific counts.

				If the count exceeds the Array length, the count is used as the countValue.

RETURNS:
	singular or plural form of specified text with count optionally prepended or replaced.

--------------------------------------------------------------------------------------------------*/
EZ.s = function EZs(count, text, suffix, countValue)
{
	if (!arguments.length) 
		return '';

	var countPrefix = false;
	if ((count != null && count !== '' && !isNaN(count))
	|| ('number boolean'.indexOf(typeof(count)) != -1))
		countPrefix = true;				//count 1st arg if number or boolean
		
	else if (text != null && !isNaN(text) || 'number boolean'.includes(typeof(text)))	
	{									//count 2nd arg if number or boolean
		var countSwap = count;
		count = text;
		text = countSwap;
	}
	else								//otherwise check for embedded number
	{
		countValue = suffix;
		suffix = text;
		text = count;
		var results = text.match(/(\d+)/);
		if (!results) 
			count = 0;
		else
			count = results[1].toInt();
	}
	
	text = text || '';
	if ((!suffix || suffix == 's') && text.endsWith('s'))
		text = text.clip();				//drop 's' at end of text for sufsix of 's'
	
	var countIdx = EZ.toInt(Math.abs(count));
	var countVal = (typeof count == 'boolean') ? '' : countIdx + '';
	
	if (EZ.isArray(suffix))				//get suffix based on count value
		suffix = countIdx < suffix.length ? suffix[countIdx] : suffix[suffix.length-1];
	else if (typeof count == 'boolean')
		suffix = count ? suffix || 's' : '';
	else if (count < 0)
		suffix = (countVal == 1) ? suffix || 's' : '';
	else
		suffix = (countVal != 1) ? suffix || 's' : '';
	
	if (EZ.isArray(countValue))			//set countVal based on count
		countVal = (countIdx < countValue.length) ? countValue[countIdx] : countVal;
	else if (!count && countValue != null)
		countVal = countValue;
	
	var pattern = /[\d#]+/;
	if (pattern.test(text))
		text = text.replace(pattern, countVal);

	else if (countPrefix)				//prepend count to text is 1st arg
		text = text.replace(/^\s*/, countVal + ' ');
	
	if (suffix.indexOf('=') != -1)		//replace suffix 
	{
		suffix = suffix.split('=');
		text = text.replace(RegExp(suffix[0]), suffix[1]);	
	}
	else if (suffix)	
	{						
		pattern = /(.*)(\w)/;
		if (pattern.test(text))		//append suffix after last word character
			text = text.replace(pattern, '$1$2' + suffix);	
		else
			text += suffix;			//or end of text
	}
	return text;
}
//_____________________________________________________________________________________________
EZ.s.test = function()
{
	var note = 'count as 1st arg'
	EZ.test.run(0,'match','es', 		{EZ: {ex:'0 matchesz'	,	note:note	}})
	EZ.test.run('0','match','es', 		{EZ: {ex:'0 matches'	,	note:note	}})
	EZ.test.run(1,'match','es', 		{EZ: {ex:'1 match'		,	note:note	}})
	EZ.test.run('1','match','es', 		{EZ: {ex:'1 match'		,	note:note	}})
	EZ.test.run(2,'match','es', 		{EZ: {ex:'2 matches'	,	note:note	}})
	EZ.test.run('2','match','es', 		{EZ: {ex:'2 matches'	,	note:note	}})

	note = 'count embedded in text'
	EZ.test.run('has 0 match','es', 	{EZ: {ex:'has 0 matches',	note:note	}})
	EZ.test.run('has 1 match','es', 	{EZ: {ex:'has 1 match'	,	note:note	}})
	EZ.test.run('2 cute girl', 			{EZ: {ex:'2 cute girls'	,	note:note	}})
	EZ.test.run('no cute guy',			{EZ: {ex:'no cute guys'	,	note:note	}})

	var repl = ['','children=child','']
	EZ.test.run(0,'children',repl,		{EZ: {ex:'0 children'	,	note:note	}})
	EZ.test.run(0,'children',repl,'no',	{EZ: {ex:'no children'	,	note:note	}})
	EZ.test.run(1,'children',repl,'no',	{EZ: {ex:'1 child'		,	note:note	}})
	EZ.test.run(9,'children',repl,'no',	{EZ: {ex:'9 children'	,	note:note	}})

	note = 'for negitive count ADD suffix if count = -1'
	repl = 'children=child';
	EZ.test.run(-0,'children',repl,		{EZ: {ex:'0 child'		,	note:note	}})
	EZ.test.run(-1,'children',repl,		{EZ: {ex:'1 child'		,	note:note	}})
	EZ.test.run(-2,'children',repl,		{EZ: {ex:'2 children'	,	note:note	}})

	var textArray = ['', 'parties=party', ''];
	var countArray = ['no', 'one', 'two'];
	EZ.test.run(0,'parties today',textArray, countArray,	{EZ: {ex:'no parties today'	, note:note	}})
	EZ.test.run(1,'parties today',textArray, countArray,	{EZ: {ex:'one party today'	, note:note	}})
	EZ.test.run(2,'parties today',textArray, countArray,	{EZ: {ex:'two parties today', note:note	}})
	EZ.test.run('# parties today',9,textArray, countArray,	{EZ: {ex:'9 parties today'	, note:note	}})
	
	EZ.test.run(0,'goose','goose=geese','no',	{EZ: {ex:'no geese',note:note	}})
	EZ.test.run(1,'goose','goose=geese','no',	{EZ: {ex:'1 goose',	note:note	}})
	EZ.test.run(2,'goose','goose=geese','no',	{EZ: {ex:'2 geese',	note:note	}})

	note = 'count 2nd arg'
	EZ.test.run('match',0,'es', 		{EZ: {ex:'matches',	note:note	}})
	EZ.test.run('match','0','es', 		{EZ: {ex:'matches',	note:note	}})
	EZ.test.run('match',1,'es', 		{EZ: {ex:'match',	note:note	}})
	EZ.test.run('match','1','es', 		{EZ: {ex:'match',	note:note	}})
	EZ.test.run('match',2,'es', 		{EZ: {ex:'matches',	note:note	}})
	EZ.test.run('match','2','es', 		{EZ: {ex:'matches',	note:note	}})
	
	EZ.test.run('# exist',NaN,			{EZ: {ex:'0 exists',	note:note	}})
	EZ.test.run('# exist',null,			{EZ: {ex:'0 exists',	note:note	}})
	EZ.test.run('# exist',undefined,	{EZ: {ex:'0 exists',	note:note	}})
	EZ.test.run('# exist',false,		{EZ: {ex:' exist'  ,	note:note	}})
	EZ.test.run('# exist',true,			{EZ: {ex:' exists' ,	note:note	}})
	
	EZ.test.run('',true, 				{EZ: {ex:'s',	note:note	}})
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.getBrowserOffsets = function EZgetBrowserOffsets()
{
	var offsets = {};
	var win = (this.constructor == window.constructor) ? this : window;
	
	if (!win.innerWidth)	//IE...
	{
		if (win.document.documentElement.clientWidth !== 0)
		{					//...strict mode
			offsets.width = win.document.documentElement.clientWidth;
			offsets.height = win.document.documentElement.clientHeight;
			offsets.x = win.document.documentElement.pageXOffset;
			offsets.y = win.document.documentElement.pageYOffset;
		}
		else
		{					//...quirks mode
			offsets.width = win.document.body.clientWidth;
			offsets.height = win.document.body.clientHeight;
			offsets.x = win.document.body.pageXOffset;
			offsets.y = win.document.body.pageYOffset;
		}
	}
	else					//WC3...
	{
		offsets.width = win.innerWidth;
		offsets.height = win.innerHeight;
		offsets.outerWidth = win.outerWidth;
		offsets.outerHeight = win.outerHeight;
		offsets.x = win.pageXOffset;
		offsets.y = win.pageYOffset;

		offsets.scrollX = win.scrollX;
		offsets.scrollY = win.scrollY;
		offsets.scrollbars = win.scrollbars ? win.scrollbars.visible : '';
		offsets.screen = win.screen;
	}
	offsets.position = [offsets.y, offsets.x + offsets.width, offsets.y + offsets.height, offsets.x]
	offsets.position.top = offsets.position[0];
	offsets.position.right = offsets.position[1];
	offsets.position.bottom = offsets.position[2];
	offsets.position.left = offsets.position[3];		
	return offsets;	
}
/*-----------------------------------------------------------------------------
return absolute offsets for el by traversing up dom tree.

ARGUMENTS:
	el				specifies el offsets to determine
	browserOffsets	(optional) Object with left and top properties
-----------------------------------------------------------------------------*/
EZ.getOffsets = function EZgetOffsets(el, browserOffsets)
{
	el = EZ(el, null);
	if (!el) return;
	
	var offsets = Array(2);						//returns ObjectLike Array
	offsets.browser = browserOffsets || EZ.getBrowserOffsets();
	
	browserOffsets = browserOffsets || [];
	var offsetLeft = el.offsetLeft - (browserOffsets[0] || 0);
	var offsetTop = el.offsetTop - (browserOffsets[1] || 0);
	var node = el;
	while (node = node.offsetParent)
	{
		offsetLeft += node.offsetLeft;
		offsetTop += node.offsetTop;
	}
	offsets[0] = offsetLeft						//legacy values
	offsets[1] = offsetTop;				
	offsets.top = offsetTop;						
	offsets.bottom = offsetTop + el.clientHeight;
	offsets.left = offsetLeft;						
	offsets.right = offsetLeft + (el.offsetWidth || el.clientWidth);
	
	offsets.client = [el.clientTop, el.clientLeft + el.clientWidth, el.clientTop + el.clientHeight, el.clientLeft]
	offsets.client.top = offsets.client[0];
	offsets.client.right = offsets.client[1];
	offsets.client.bottom = offsets.client[2];
	offsets.client.left = offsets.client[3];		
	offsets.client.width = el.clientWidth;
	offsets.client.height = el.clientHeight;
	
	offsets.offset = [el.offsetTop, el.offsetLeft + el.offsetWidth, el.offsetTop + el.offsetHeight, el.offsetLeft]
	offsets.offset.top = offsets.offset[0];
	offsets.offset.right = offsets.offset[1];
	offsets.offset.bottom = offsets.offset[2];
	offsets.offset.left = offsets.offset[3];		
	offsets.offset.width = el.offsetWidth;
	offsets.offset.height = el.offsetHeight;
		
	offsets.scroll = [el.scrollTop, el.scrollLeft + el.scrollWidth, el.scrollTop + el.scrollHeight, el.scrollLeft]
	offsets.scroll.top = offsets.scroll[0];
	offsets.scroll.right = offsets.scroll[1];
	offsets.scroll.bottom = offsets.scroll[2];
	offsets.scroll.left = offsets.scroll[3];		
	offsets.scroll.width = el.scrollWidth;
	offsets.scroll.height = el.scrollHeight;
	
	return offsets;
}
/*---------------------------------------------------------------------------------------------
EZ.isInView(el, isAll)

ARGUMENTS:
	el			specifies element (can be selector)
	isAll		true to check is element is completely in viewport

RETURNS:
	true if in view otherwise false;

REFERENCE:
	http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
	
TODO:
	use EZ.getBrowserOffsets() ??
---------------------------------------------------------------------------------------------*/
EZ.isInView = function EZisInView(el, isAll)
{
	var rtnValue = true;
	var offsets = EZ.getOffsets(el);
	if (EZ.el.undefined) return rtnValue;		//true hopefully avoids any action after return
	
	el = EZ.el;
	var top = offsets[0];
	var left = offsets[1];
	var width = el.offsetWidth;
	var height = el.offsetHeight;
	if (!isAll)							//patially in view
		rtnValue = top < (window.pageYOffset + window.innerHeight) &&
				   left < (window.pageXOffset + window.innerWidth) &&
				   (top + height) > window.pageYOffset &&
				   (left + width) > window.pageXOffset;
	else								//completely in view
		rtnValue = top >= window.pageYOffset &&
				   left >= window.pageXOffset &&
				   (top + height) <= (window.pageYOffset + window.innerHeight) &&
				   (left + width) <= (window.pageXOffset + window.innerWidth);
	return rtnValue;
}
/*---------------------------------------------------------------------------------------------
EZ.scrollTo(hash)

scroll to specified hash using scrollIntoView() is available otherwise use as location hash.

When hash is used 1st clear, location.hash if currently the same value.

ARGUMENTS:
	hash		element or id of element to scroll into view -- # prefix is optional.

	scrollBy	(optional) =true to center element vertically after scrolling to element -OR-
				+/- number of pixels to scroll up or down respecifully
RETURNS:
	nothing

http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport

  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while(el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }
---------------------------------------------------------------------------------------------*/
EZ.isInView = function EZisInView(el, isAll)
{
	var rtnValue = true;
	var offsets = EZ.getOffsets(el);
	if (!EZ.el) return rtnValue;		//true to hopefully avoids any action after return
	
	el = EZ.el;
	var top = offsets[0];
	var left = offsets[1];
	var width = el.offsetWidth;
	var height = el.offsetHeight;
	if (!isAll)							//patially in view
		rtnValue = top < (window.pageYOffset + window.innerHeight) &&
				   left < (window.pageXOffset + window.innerWidth) &&
				   (top + height) > window.pageYOffset &&
				   (left + width) > window.pageXOffset;
	else								//completely in view
		rtnValue = top >= window.pageYOffset &&
				   left >= window.pageXOffset &&
				   (top + height) <= (window.pageYOffset + window.innerHeight) &&
				   (left + width) <= (window.pageXOffset + window.innerWidth);
	return rtnValue;
}
/*---------------------------------------------------------------------------------------------
EZ.scrollTo(hash)

scroll to specified hash using scrollIntoView() is available otherwise use as location hash.

When hash is used 1st clear, location.hash if currently the same value.

ARGUMENTS:
	hash		element or id of element to scroll into view -- # prefix is optional.

	scrollBy	(optional) =true to center element vertically after scrolling to element -OR-
				+/- number of pixels to scroll up or down respecifully
RETURNS:
	nothing
---------------------------------------------------------------------------------------------*/
EZ.scrollTo = function EZscrollTo(hash, scrollBy)
{
	var el = EZ(hash);
	if (!el.undefined && el.scrollIntoView)
		el.scrollIntoView();
	else
	{
		hash = (!el.undefined && el.id) ? el.id
			 : (typeof(hash) != 'string') ? ''
			 : hash.trimPlus('#');
		hash = '#' + hash;
		
		if (location.hash == hash)
			location.hash = '';
		location.hash = hash;
	}
	if (scrollBy === true)
		window.scrollBy(0,-document.documentElement.clientHeight/2 + 150);
	else if (typeof(scrollBy) == 'number')
		window.scrollBy(0, scrollBy);
}
/*---------------------------------------------------------------------------------------------
EZ.substring(str, start, end)							Originally written before substr()

return substring without throwing exception -- still useful when str may be null or undefined.

ARGUMENTS
	start 	adjusted to min value of 0 and max value of str length
			=0 if non-numeric values including null undefined or object

	end 	(optional) adjusted to min of start value and max of str length
			str length if non-numeric values including null undefined or object

RETURNS
	empty string if str undefined, null, empty string or not a string
	otherwise as returned by native substring after start/end adjusted
---------------------------------------------------------------------------------------------*/
EZ.substring = function EZsubstring(str, start, end)
{
	if (!str || typeof(str) != 'string') return "";
	start = Math.min( Math.max(0,EZ.toInt(start)), str.length);
	end = end || str.length;
	end = Math.max( Math.min(start,EZ.toInt(end)), str.length);
	return str.substring(start,end);
}
/*-----------------------------------------------------------------------------
EZ.setDebugMode([#] [,img]) -- Set or toggle debugMode

Set debug mode based on location.hash if no arguments or 1st argument is "#".

Set debug mode true if 1st arg is @true -- false if @false

If img is 1st arg and specifies debug image icon (i.e. img element selector)...
	toggle debug mode (border color red if current debugMode true)

"debug" prepended to location.hash if EZ.debugMode true; otherwise removed.

Show all tags with "debug" class if EZ.debugMode true otherwise hide.

if img specified, set border red if EZ.debugMode true otherwise remove border.
-----------------------------------------------------------------------------*/
EZ.setDebugMode = function EZsetDebugMode(mode, img)
{
	if (typeof(EZ.debug) == 'function') 
		return EZ.debug(mode, img);
	
	setTimeout(function()				//try again after all scripts loaded
	{
		if (typeof(EZ.debug) == 'function') 
			EZ.debug(mode, img);
		
	}, 250);
}
/*--------------------------------------------------------------------------------------------------
EZ.trim(str,regex)

Remove leading and trailing spaces (or specified regex) from supplied str.
If str undefined or null, empty string returned.

Parameters:
	str		string trimmed
	regex	ch or regex to trim; defaults to whitespace (i.e. \s) if not supplied.
			undefined, null, empty string or invalid regular expression.
Returns:
	trimmed string or empty string if specified str not string type
--------------------------------------------------------------------------------------------------*/
EZ.trim = function EZtrim(str,regex)
{
	return (typeof(str) != 'string') ? '' : str.trimPlus(regex);
}
/*---------------------------------------------------------------------------------------------
EZ.toFloat(number,defaultValue)

Converts number or string to floating point number

Parameters:
	number 			number or string starting with number (number part is parsed)
	defaultValue 	value returned if number is not a valid number

Returns:
	number or defaultValue if number is invalid
---------------------------------------------------------------------------------------------*/
EZ.toFloat = function EZtoFloat(number,defaultValue)
{
	if (EZ.test.capture()) {return EZ.test.capture(this)} else if (EZ.test.debug()) debugger;
	if (defaultValue == null || isNaN(defaultValue)) defaultValue = 0;
	if (number == null) number = defaultValue;
	if (number !== undefined)
	{
		try
		{
			if (isNaN(number))
			{	
				if (EZ.isEl(number))
					number = EZ.get(number);
				else if (typeof(number) == 'function')
					number += number();
				if (isNaN(number))				//convert to string if still NaN
					number += '';

				//pattern taken from EZ.parse.java for consistancy -- more complex than needed
				var pattern = new RegExp("^\\s*(0*(\\d+))(\\.?(0*)(\\d*))(.*)","")
				number = number.replace(pattern,'$2$3');
			}
			number = parseFloat(number);
		}
		catch (e) {}
	}
	if (isNaN(number)) number = defaultValue;
	return number;
}
/*---------------------------------------------------------------------------------------------
EZ.toInt(number,defaultValue)

Converts number or string to the nearest integer

Parameters:
	number 			number or string starting with number (number part is parsed)
	defaultValue 	value returned if number is not a valid number
					default=0 if not supplied or undefined
					empty string or any other value is valid default if NaN

Returns:
	Nearest whole number or defaultValue if number is invalid
---------------------------------------------------------------------------------------------*/
EZ.toInt = EZ.integer = function EZtoInt(number, defaultValue)
{
	if (EZ.test.capture()) {return EZ.test.capture(this)} else if (EZ.test.debug()) debugger;
	var floatValue = EZ.toFloat(number, defaultValue);
	var value = parseInt(floatValue);
	if (value != floatValue)
		value = parseInt(floatValue + 0.5);
	return value;
}
//_____________________________________________________________________________________________
EZ.toInt.test = function()
{
	var arg, obj=null, ctx, ex, exfn, note = '';
	/*  jshint: future vars */	e = [arg, obj, ctx, ex, exfn, note];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//EZ.test.options( {ex:ex, note:note})
	//EZ.test.run(obj)	
	note = 'count as 1st arg'
	
	EZ.test.run(-2, 		{EZ: {ex:-2	,	note:note	}})
	EZ.test.run(2, 			{EZ: {ex:2	,	note:note	}})

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	//______________________________________________________________________________
	return;
}


/*---------------------------------------------------------------------------------------------
1st called after EZ.prototypes.js loads then after any other js file loads
---------------------------------------------------------------------------------------------*/
EZ.global.setup = function EZglobal_setup(prefix, filename)
{
	if (!EZ.EOL)
	{
		/**
		 *	browser and dw enviornment detection
		 */
		/*global dw:true */
		if (!window.dw) dw = {isNotDW: true};
		EZ.MSIE = navigator.appVersion.indexOf('MSIE') != -1;
		EZ.isIEw3c = !EZ.MSIE
				  && navigator.userAgent.indexOf('Trident') != -1
				  && navigator.appCodeName.indexOf('Mozilla') == -1;
		EZ.isEdge = navigator.userAgent.indexOf('Edge') != -1;
		EZ.isChrome =  navigator.appVersion.indexOf('Chrome') != -1;
		EZ.isnavigator = !EZ.MSIE;
		/*--------------------------------------------------------------------------------------------------
		Clone stubs potentailly overridden and define unit tests.
		--------------------------------------------------------------------------------------------------*/
		EZ.getEl_basic = EZ.clone(EZ.getEl);
		// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
		EZ.getEl_basic.test = function()
		{
			EZ.test.run(arguments[0], 							{EZ: {ex:'',	note:''	}})
		}
	}

	  //------------------------------\\
	 //----- for all script files -----\\
	//----------------------------------\\
	EZglobal_createDisplayNames(prefix);
	EZglobal_mapFunctions(prefix+'.', prefix);
	EZglobal_domBindings();

	EZ.global.scripts[filename] = new Date();		//note script loaded
	
	/*TODO: better strategy?? -- UNCOMPLETED EZ.capture.getFunction() idea - not used
	function findFunctionName(obj, ctx, dotName)
	{
		if (!dotName)
		{
			var name = typeof(ctx) == 'object' ? capture.map.object[ctx]
											   : capture.map.functions[ctx]
			dotName = [name];
			
			findFunctionName.time = new Date();
			findFunctionName.count = 0;
		}
		var keys = Object.keys(obj);
		if (capture.map.processed.includes(obj))
			return;
		else
		{
			capture.map.processed.push(obj);
			 if (obj == window)
			 	keys = keys.remove(capture.map.windowKeys);
		}
		var isFound = keys.some(function(key)
		{
			var o = obj[key];
			if (!(o instanceof Object)) return;
			
			if (typeof(o) == 'function')
			{
				var name = dotName.join('.');
				capture.map.fnMames[o] = name;
				capture.map.displayName[name] = o;
				if (o == caller)
					return true;
			}
			if (findFunctionName(o, dotName.concat([key])))	
				return capture.map.processed.pop();
		});
		return isFound;
	}
	*/
	/**
	 *	Create displayName for all functions
	 *
	 * 	TODO: prototype displayName ??
	 * 	e.g. String.prototype.isTrue.displayName = 'String.prototype.isTrue';
	 *
	 *	['String','Boolean','Number'].forEach( function(type)	//define displayName for prototypes
	 *	{
	 *		EZ.createDisplayNames(type);
	 *	});
	 */
	function EZglobal_createDisplayNames(objName)
	{
		if (!objName) return;
		if (!EZ.displayNames) EZ.displayNames = [];
		var o = window[objName+''];
		for (var fn in o)			//for all functions . . .
		{
			if (o[fn] === undefined) continue;
			if (typeof(o[fn]) == 'function' && !o[fn].displayName)
				o[fn].displayName = objName + '.' + fn;

			EZ.displayNames.push(o[fn].displayName);
		}
	}
	/**
	 *	Map oops functions to non-oops function if non opps not defined -OR-
	 *	clone fromPrefix function --> toPrefix oops or non-oops function
	 *
	 *	Map EZ. oops functions to not oops EZ function name if not defined
	 *	e.g. EZ.is = functrion(...) --> function EZis(...)
	 */
	function EZglobal_mapFunctions(fromPrefix, toPrefix)
	{
		if (!fromPrefix || !toPrefix || fromPrefix == toPrefix) return;
		fromPrefix = fromPrefix + '';
		toPrefix = toPrefix + '';

		var oopsTo = toPrefix.right(1) == '.';
		if (oopsTo)
		{
			toPrefix = toPrefix.clip();
			oopsTo = window[toPrefix];
			if (!oopsTo) window[oopsTo] = {};
		}
		var oopsFrom = fromPrefix.right(1) == '.';
		if (oopsFrom)
		{
			fromPrefix = fromPrefix.clip();
			oopsFrom = window[fromPrefix];
			if (!oopsFrom) return;

			for (var fn in oopsFrom)	//for all from functions . . .
			{
				if (typeof(oopsFrom[fn]) != 'function') continue;

				if (!oopsTo)
				{
					var name = fromPrefix + fn;
					if (window[name] == null)
						window[name] = oopsFrom[fn];
				}
				//always true because oopsName undefined
				//else if (oopsTo[oopsName] == null)
				else
				{
					oopsTo[fn] = oopsFrom[fn];
					oopsTo[fn].displayName = fromPrefix + '.' + fn;
				}
			}
		}
		//TODO: !oopsFrom ??
	}
	/**
	 *	Create bindings for dom related functions
	 */
	function EZglobal_domBindings()
	{
		Object.keys(EZ).forEach(function(key)
		{
			if (EZ.functions.dom[key] 					//binding already created
			|| EZ.dom.functions.indexOf(key) == -1) 	//not dom related function
				return;

			var fn = 'EZ.functions.dom.' + key + ' = function ' + key + '()\n'
				   + '{\n'
				   + '    var args = window.EZ.dom.context(this);\n'
				   + '    window.EZ.' + key + '.apply(window.EZ, args);\n'
				   + '}';
			eval(fn);
		});
	}
}
/*---------------------------------------------------------------------------------------------
more global constants
---------------------------------------------------------------------------------------------*/
EZ.dom.functions = ('getParent getAncestor isAncestor hide show toggle '
				 + 'addClass hasClass hasAnyClass removeClass toggleClass').split(' ');
				// getAllLayers getAllFields

EZ.functions = function EZfunctions() 
{
	if (this instanceof arguments.callee) 	//if  called as constructor..
	{
		this.list = []; 
		this.names = {};
		this.info = []; 
		this.code = [];
		this.calls = {};
	}
	else if (!EZ.functions.map)
	{
		EZ.functions.map = new EZ.functions();
	}
	return EZ.functions.map;
};

EZ.functions.core = {
		  '$':EZ.todo, '_':EZ.todo, 'nul':EZ.todo,
		   'get':EZ.todo, 'val':EZ.todo,
		   'css':EZ.todo, 'json':EZ.todo, 'event':EZ.todo, 'util':EZ.todo
}
EZ.functions.dom = {};						//populated by EZglobal_domBindings()
EZ.functions.obj =  'constant patterns'.split(' ');
EZ.functions.ignore = ('bindElements classAction context createPrototype '
		  			+ 'get_basic set_basic sample cloneNodes').split(' ');
//_____________________________________________________________________________________________
/**
 *	PATTERNS -- //from EASY.js
 */
EZ.patterns = {
	attributes: /([-\w]+)(=("([^<>"]*)"|'([^<>']*)'|[\w,]+))?/g,
	attributesLabels:'attr, combo, unquoted_value, double_quoted_value, single_quoted_value',
	//funcArgs: /function\s*\w*\s*\((.*?)\)[^{]*{([\s\S]*)}/,
	funcArgs: /function\s*\w*\s*\(([\s\S]*?)(\/\*[\s\S]*?\*\/)?\)[^{]*{([\s\S]*)}/,
//	fn: /function\s*(\w*)\s*\((.*?)\)[^{]*{\s*([\s\S]*)}/,
	fn: /function\s*(\w*)\s*\(([\s\S]*?)\)[^{]*{\s*([\s\S]*)}/,
	isJson: /:\[/,
	isKeyValues: undefined,
	isWord: /^\s*[\w-]*\s*$/,
	elementSimpleSelector: /^(\W?)\W*([\w-]*)([^>]*)(>*)([\s\S]*)/m,
	elementFormSelector: /^(@)@*(\w+)(:)(\w*)$/m,
	// NotifyMeReturn: {...} --> ...
	//	[1]=[2]+[3]    [2]=name    [3]=:|=|*empty*    [4],[6]={|[|*empty*    [5]=script
	//			(^\s*[\w\s.]*\s*:)?\s*(\{)?\s*([\s\S]*?)(\})?\s*$
	jsonParts: /(^\s*([\w\s.]*)\s*([:=]?))?\s*([\{\[])?\s*([\s\S]*?)([\}\]]?)\s*$/,
	stackTrace: /\n?(\s*?)(at)\s*([^(]+)\s*.*?(\((.*)(:[<>\d]*).*)?/,
	valid_pathname: /[_a-zA-Z]+[_a-zA-Z0-9]*/,
	valid_classname: /-?[_a-zA-Z]+[_a-zA-Z0-9-]*/,
	'':''
}
EZ.patterns.funcParts = EZ.patterns.fn;
EZ.patterns.functionnDetail	= RegExp(""	//function statement plus trailing comments
							+ "(function\\s*(\\w*)\\s*\\(([\\s\\S]*?)\\)\\s*?)"
							+ "([^{\\n]*)"			//	optional top comment
							+ "(\\n?)"				//	optional top newline
							+ "\\{"					//	{
							+ "(\\s*\\n?)"			//	 	newline before body
							+ "([\\s\\S]*?)"		//		body
							+ "(\\n?)"				//	 	newline after body
							+ "\\}$",				//	}
							"")

EZ.patterns.types = /(nan|null|undefined|boolean|number|string|function|object)/;

//----- PATTERNS -- from DW EZ code base
EZ.patterns.offsetPairssDisplay = /(.+?,.+?,)\s?/g	//from EZgetSelection()
//	html = html.replace(/(\r\n|\n|\r)/g, EZ.constant.EOL) //EZdomWorkbench.htm::process()
EZ.patterns.configPath = /.*?\/en_US\/Configuration.*?(\/|$)/im;
//                                 1         2           3
EZ.patterns.funcParts = /function\s*(\w*)\s*\((.*?)\)[^{]*{([\s\S]*)}/
EZ.patterns.funcParts = /function\s*(\w*)\s*\((.*?)\)[^{]*{\s*([\s\S]*)}/;	//from EZ.clone
//TODO: accomodate embedded comments: function(/** Event */evt...)

EZ.patterns.functionStatement = new RegExp("\\s*(var)?((this\\.)?\\s*(.*?)[=:].*?)?\\bfunction\\s*([\\w$]*)\\s*\\(","");
EZ.patterns.functionAfterEnd = /(^\s*[\w.]+\s*=\s*['"\w.]+\s*;?.*?)[\n\r]/;

EZ.dom.attributes = ('accept accept-charset accesskey action align allowtransparency alt'
				  + ' border bottom center charset checked cols coords disabled enctype'
				  + ' frameborder height href hspace id justify label left longdesc readonly'
				  + ' marginheight marginwidth maxlength method middle multiple name onreset'
				  + ' onsubmit rel rev right rows scrolling selected shape size src style'
				  + ' target title top type usemap value vspace width wrap').split(" ");
		
EZ.dom.display = {		//used by EZ.show()
	a:'inline', abbr:'inline', acronym:'inline', address:'block', applet:'inline', area:'inline', 
	base:'inline', basefont:'inline', big:'inline', blink:'inline', blockquote:'block', p:'block', 
	body:'block', br:'inline', b:'inline', button:'inline-block', caption:'table-caption', center:'block', 
	cite:'inline', code:'inline', pre:'block', col:'table-column', dfn:'inline', dir:'block', div:'block', 
	dl:'block', dt:'block', dd:'block', em:'inline', font:'inline', form:'block', h1:'block', h2:'block', 
	h3:'block', h4:'block', h5:'block', h6:'block', head:'none', hr:'block', html:'block', img:'inline', 
	input:'inline-block', isindex:'inline', 'i':'inline', kbd:'inline', link:'none', li:'list-item', 
	map:'inline', marquee:'inline-block', menu:'block', meta:'none', ol:'block', option:'block', 
	param:'none', q:'inline', samp:'inline', script:'none', select:'inline-block', small:'inline', 
	span:'inline', strong:'inline', style:'none', sub:'inline', sup:'inline', table:'table', 
	td:'table-cell', textarea:'inline-block', th:'table-cell', tbody:'table-row-group', 
	thead:'table-header-group', tfoot:'table-footer-group', title:'none', tr:'table-row', tt:'inline', 
	ul:'block', u:'inline', var:'inline', 
	detail: "inline", summary: "block", fieldset: "block", legend: "block"
}
EZ.dom.tags = Object.keys(EZ.dom.display);

/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
