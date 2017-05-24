/*--------------------------------------------------------------------------------------------------
Dreamweaver LINT global references and definitions  not used here {
--------------------------------------------------------------------------------------------------*/
/*global 
EZ:true, EZ$:true, EZ_:true,
EZgetEl, EZgetValue, EZsetValue, EZnone, EZdisplayCaller,
 
DWfile, dw:true, e:true, f:true, g:true
*/
var e;			//global used for try/catch
(function() {[	//global variables and functions defined but not used
EZgetEl, EZgetValue, EZsetValue, EZnone, EZdisplayCaller,

DWfile, dw, e, f, g ]});
//. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .}
(function(ez)
{
	var defaultOptions = {
		equals: {
			ignore: 'objectType',		//most defaults still in EZ.equals()
			groups: {
				log: {
					showDiff:25,
				}
				//console: true,
				//log: true,
			}
		},
		format: {				
			formatter: 'toString',
			formatOpts: { 					
				tostring: {
					timestamp: false,
					format: 'string',			//"string", "html" or "collapse"
					collapse: {					//ignored unless format="html"
						depth: 3,				//depth minlines used - maxlines not
						minlines: 3,			//no collapse if less items than value
						maxlines: 10			//collapse if more items than value
					},
												//TODO: support "stringify"
					htmlFormatter: 'EZ.format.Element',	
					htmlFormatterOpts: {		
						extract: 'brief'
					},							//...if htmlFormatter not defined...
					html: {						//toString() internal html format options
						maxdepth: 3,	
						maxchildren: 1,
						maxchars: 99,
						attributes: 'id className tagName parent'.split(' '),
						input: [				//currently html_tagtype_keys and hardcoding
							{
								type: 'text textarea password hidden button',
								attributes: 'value'
							},{
								type: 'radio checkbox',
								attributes: 'checked'
							},{
								type: 'image',
								attributes: 'src'
							}
						]
					}
				},								
				stringify: {
					spaces:4,
					legacy: '*',
					plus: 'ignore="constructor script" unquoteKeys escapeAll'
				}
			},
			// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 	
			htmlFormatter: {		
				format: 'html',					//"html" "json" or "object" 
				formatter: 'EZ.stringify',		//json formatter
				formatOpts: {spaces: 4},
				
				sort: false,
				maxdepth: 4,
				maxchildren: 1,
				maxchars: 0,
				maxlinechars: 0,
			//	removeQuotes: false,
				noAttributeQuotes: false,
				quote: '"',
				tagValue: 'style src href',
				tagAttributes: ('title checked autocomplete translate spellcheck readOnly disabled required'
							 + ' value size multiple').split(/\+/),
				
				extract: 'basic',				
				extractGroups: {
					brief: ['tagName', 'type', 'name', 'id', 'className'],
					basic: 'tagName type id name className checked value src href'.split(/\s+/),
					plus: ['basic', 'attributes'],					//basic plus defined tag attributes
					children: ['basic', 'children'], 				//basic plus children
					all:'plus checked value selected'.split(/\s+/),	//innerText ??
					
					//TODO: ...
					outer: ['all', 'children'],
					currentStyle: '',
					offsets: ('clientWidth clientHeight clientLeft clientTop ' 
							 + 'offsetWidth offsetHeight offsetLeft offsetTop offsetParent '
							 + 'clientWidth clientHeight clientLeft clientTop').split(/\s+/),
					elements: 'parentElement nextElementSibling previousElementSibling'.split(/\s+/),
					//or nodes
					most: 'events sibblings offsets'.split(/\s+/),
					verbose: 'parent children'.split(/\s+/),
					//verbose: []
					defined: [],
				},
				defaults: {String:'extract', Array:'extract'},
			},
			// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
			version: '02-18-2017'
		}
	};
	
	//===============================================================================================
	/**
	 *	EZ(),  EZ$(), EZ_(), EZ.context(), EZ.get(), EZ.getEl(), EZ.set(), EZ.val() and tubs
	**/
	(function _____EZ_EZget_EZset_related_____() {
	/*-----------------------------------------------------------------------------------------------
	EZ(el,options) -- 											primary EZ Object defined as Function
	
	returns single element or Array of elements if el is Array of selectors.
	
	TODO:
		when called as tag handler e.g. onclick="EZ(...)" -- tag passed as this if tag has EZ() bind.
		allow defaultFormatOptions changes by onLoad functions() including <body onLoad="...">
	------------------------------------------------------------------------------------------------*/
	window.EZ = function EZ(sel, options)
	{
		if (this instanceof arguments.callee) return	//called as constructor
		
		void(options);									//DW lint -- debugger convenience
		EZ.tags = [];
		
		var el = sel;
		var type = EZ.getType(el);
		if (type == 'Element')
			return EZ.el = EZ.tags[0] = el;

														  //-----------------------------------\\
		while (false && typeof(el) == 'string')			 // TODO: cache?? -- could have changed \\
		{												//---------------------------------------\\
			EZ.cache = EZ.cache || [];
			var idx = EZ.cache.indexOf(sel)
			el = EZ[idx];
			if (el !== undefined || !(el instanceof Element))
				break;									//nogo if not cache or not still Element
			
			EZ.cache.splice(idx,1)
			EZ.cache.unshift(el);
			EZ.cache = EZ.cache.slice(0,50);
			return EZ.el = EZ.tags[0] = el;
		}
		
		var args = [].slice.call(arguments);
		var defaults = {defaults:{legacy:false}}
		args.push(defaults);
		
		return EZgetEl.apply(this, args);
	}
														  //-------------------------------\\
	if (ez instanceof Object)							 // restore any prior EZ properties \\ 
	{													//-----------------------------------\\
		for (var key in ez) if (EZ[key] === undefined) EZ[key] = ez[key]; 
	}
	/*--------------------------------------------------------------------------------------------------
	return current global options with defaults appended
	--------------------------------------------------------------------------------------------------*/
	EZ.defaultOptions = function EZdefaultOptions(name)
	{
		var defaultOpts = 'EZ.defaultOptions.'.concat(name).ov();
		var options = 'EZ.'.concat(name,'.options').ov() || defaultOpts;
		
		if (options != defaultOpts)
		{
			Object.keys(defaultOpts).forEach(function(key)
			{
				if (key in options) return;
				options[key] = defaultOpts[key];
			});
		}
		return EZ[name].options = options || {};
	}
	//________________________________________________________________________________________________
	Object.keys(defaultOptions).forEach(function(key)
	{ EZ.defaultOptions[key] = defaultOptions[key] });
						//NOTE: Chrome seems to load below script before executing this statement ??
						//		Does this mean functions can be referenced before they are defined
						//		as IE has always allowed but not historically allowed by Mozilla ??
	EZ.defaultFormatOptions = defaultOptions.format;
	/*--------------------------------------------------------------------------------------------------
	EZ variants and related
	--------------------------------------------------------------------------------------------------*/
	/**
	 *	EZ$: return all elements matching all selector(s)
	 */
	EZ.$ = EZ$ = function()
	{
		var args = [].slice.call(arguments).concat([ {defaults:{all:true}} ]);
		return EZgetEl.apply(this, args);
	}
	/**
	 *	EZ_: return null if no el matches selector
	 */
	EZ_ = function()
	{
		var args = ([].slice.call(arguments)).concat([ {defaults:{all:false}} ]);
		return EZgetEl.apply(this, args);
	}
	EZ._ = EZ_;
	/**
	 *	EZ.nul: return all elements matching selector(s) or null
	 */
	EZ.nul = function()
	{
		var args = [].slice.call(arguments).concat([ {defaults:{notFound:null}} ]);
		return EZgetEl.apply(this, args);
	}
	//_____________________________________________________________________________________________
	EZ.test = function()
	{
		EZ.test.run('#myid', 							{EZ: {ex:'',	note:''	}})
		EZ.test.run('<div>', '<div',					{EZ: {ex:'',	note:''	}})
		EZ.test.run('.myclass',							{EZ: {ex:'',	note:''	}})
		EZ.test.run('myid', 'div', 'myclass',			{EZ: {ex:'',	note:''	}})
	
		// form fields
		EZ.test.run('notifyForm:notifySelected',		{EZ: {ex:'',	note:''	}})
		EZ.test.run('@notifyForm:notifySelected',		{EZ: {ex:'',	note:''	}})
		EZ.test.run('@notifyForm:notifySelecte',		{EZ: {ex:'',	note:'bad name'	}})
		EZ.test.run('notifySelected', 					{EZ: {ex:'',	note:''	}})
		EZ.test.run('@notifySelected', 					{EZ: {ex:'',	note:''	}})
		//. . . . . . . . . . . . . . . . . . . . . . . .
	}
	//__________________________________________________________________________________
	/**
	 * 	if element context, get chain selection element if callers 1st arg is array
	 *	otherwise prepend context elements to callers args.
	 *	if not element context return caller args as is.
	 */
	EZ.context = function EZcontext(ctx)
	{
		var args = [].slice.call(arguments.callee.caller.arguments);
		if (ctx != window && typeof(ctx) != 'function')
		{
			if (!EZ.isArray(args[0]))
				args.unshift(ctx);		//prepend context element(s)
			else
			{				//update 1st arg with selected elements
			   var tags = EZgetEl.call(ctx, args[0], true);
			   args[0] = tags.length > 1 ? tags : tags[0];
			}
		}
		return args;
	}
	//__________________________________________________________________________________
	/**
	 *	calls EZ.get_basic until and if EZ.getValue loaded
	 */
	EZ.get = function EZget(el, defaultValue)
	{
		if (EZ.getConstructorName(el) == 'EZfield')
			el = el.el;
	   var rtnValue = (window.EZgetValue)
					? EZgetValue.apply(this,[].slice.call(arguments))	//full functionality if loaded
					: EZ.get_basic(el, defaultValue);					//otherwise basic function
		
		EZ.tags = EZ.get.tags = EZ.tags;
		EZ.el = EZ.get.el = EZ.tags instanceof Object ? EZ.tags[0] : EZ.none();
		return rtnValue;
	}
	//__________________________________________________________________________________
	/**
	 *	stub with min functionality -- until full version loaded
	 *	if el not element, try as id or name -- returns 1st element for html collection
	 */
	EZ.getEl = function EZgetEl(el, allTags /* true for all tags */)
	{
		var name = el + '';
		if (!EZ.isEl(el)) el = document.getElementById(el);
		if (!el) el = document.getElementsByName(name);
	
		if (!allTags && EZ.isArray(el)) el = EZ.collapse(el);
		return el;
	}
	//__________________________________________________________________________________
	/**
	 *	calls EZ.set_basic -OR- EZ.setValue if loaded
	 */
	EZ.set = function EZset(el, value)
	{
		if (EZ.getConstructorName(el) == 'EZfield')
			el = el.el;
		var ctx = EZ.context(this);
		var rtnValue = (window.EZsetValue)			//use full functionality if loaded
					 ? EZsetValue.apply(this, ctx)
					 : EZ.set_basic(el, value);
		
		EZ.tags = EZ.set.tags = EZ.tags;
		EZ.el = EZ.set.el = EZ.tags instanceof Object ? EZ.tags[0] : EZ.none();
		return rtnValue;
	}
	//__________________________________________________________________________________
	/**
	 *	calls EZ.get() or EZ.set()
	 */
	EZ.val = function EZval(el,value)
	{
		/* jshint: doc only */   e = [el,value];
		return !arguments.length ? '' 					//if no args, return blank
			 : arguments.length == 1 ? EZgetValue(el) 	//if single arg, call getValue()
			 : EZsetValue.apply(this,[].slice.call(arguments));	//otherwise call setValue()
	}
	//_____________________________________________________________________________________________
	/**
	 *	unit test stubs -- redefined when EZunit_tests.html loaded
	 */
	EZ.test.data = {};			//???
	EZ.test.running = 'no capture';
	EZ.test.run = function EZtestRun() {return false}
	EZ.test.isTestFunction = EZ.isTest = function EZisTest()
	{
		return EZ.test.isTest && EZ.test.isTest(arguments.callee.caller);
	}
	EZ.test.getTestrun = EZ.test.setTestValue = function() {}
	
	EZ.test.debug = function EZtestDebug() {return false}
	if (!EZ.debug) EZ.debug = EZ.test.debug;
	/**
	 *	capture stubs -- redefined by EZcapture,js
	 */
	EZ.test.capture = function EZtestCapture() {return false}
	EZ.test.capture.mode = false;
	EZ.capture = function() {return false}
	//_____________________________________________________________________________________________
	/**
	 *	More stubs for functions with full script in other files
	 */
	EZ.json = {};		//uses JSON.stringify/parse if EZ.stringify.js not loaded
	EZ.util = {};
	EZ.popup = function EZpopup__NA() {return EZ.oops('EZadvanced.js required but not loaded')}
	EZ.trace = function EZtrace_NA() { return '' }
	EZ.getPref = function EZgetPref(key, defaultValue) {return defaultValue};
	EZ.toString = function(obj) 
	{											//stub until EZ.toString.js loaded
		var ctx = (obj != null) ? obj : this;
		if (typeof(ctx) == 'function')			//presumably ctx is EZ()
			return Function.prototype.toString.call(ctx);
		else if (typeof(ctx) == 'object')
		{
			var text = 'EZ.toString() not loaded...';
			for (var p in ctx)
				text += p + ': ' + ctx[p];
		}
	}
	//_________________________________________________________________________________________________
	EZ.cookie = {
		get:function EZcookieGet() {return ''},
		set:function EZcookieSet() {return ''}
	}
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
	})();
	return EZ;
})(window.EZ)
//__________________________________________________________________________________________________
EZ.log = EZ.log_boot = function EZlog_boot() {
/** {
 *	save arguments in single EZ.log.queue until fully functional EZ.log() script loaded.
 *	Delete queue and stop savings arguments once DOM is loaded and EZ.log() is not.
 *__________________________________________________________________________________________________
}*/
	if (EZ.log.queue === null)
		return;
	
	if (EZ.log.queue === undefined)			//create for log arguments until full EZ.log loads
	{										//...but stop logging if full EZ.log never loaded
		EZ.log.queue = [];
		window.addEventListener('load', function()
		{									
			if (EZ.log.name.includes('boot'))	
				EZ.log.queue = null;
		}, false);
	}
	var args = [].slice.call(arguments);	//get real Array clone of arguments
											
	args.stack = new Error().stack;			//append stack and "this" if String
	args.name = (this instanceof String) ? this + '' : '-NA-';
	args["~queue"] = new Date();
	
	EZ.log.queue.push(args);				//save for full EZ.log()
}
EZ.log('setup')				//prime EZ.log.queue with setup entry
//__________________________________________________________________________________________________
EZ.logger = function ___EZlogger(name, key, message, detail) {
/**
 *	create new function EZlogger(...) and return EZlogger.log() after binding as follows:
 *		bind "this" to EZ.logger() and 1st argument to log name.
**/
	"use strict";
	if (this == EZ.logger)
		EZ.logPlus.call(this, name, key, message, detail)

//debugger;	
	var logger = function EZlogger() {};
	name = name || EZ.getCaller(1).toString('callerName');
	
	logger.log = EZ.logger.bind(EZ.logger, name);
	return logger.log;							
};
//__________________________________________________________________________________________________
EZ.toArrayBoot = function EZtoArray_boot(arg, delimiter) {
/** {
 *	EZ.toArray() -- most functionality until more functions loaded -- work in process
 *
 *	Only supports delimiter types: String, RegExp or Boolean -- not options Object or String
 *
 *	TODO: 
 *		not well tested BUT VERY LIMITED use if any as of 02-25-2017
 *		Add shadow call to EZ.toArray() and EZ.oops() if diff results	
}*/										
	if (typeof(arg) == 'string' && (delimiter || delimiter === '0'))
	{										//02-25-2017: all calls using true changed to ','
		if (delimiter === true) 		
			delimiter = /\s*[ ,]\s*/		//for: ' ,' most frequently used delimiter by far
	
		if (typeof(delimiter) == 'string')	//escape ^ [ or ] to treat as literal inside [...]
		{									//...pattern of form: /\s*[<delimiter(s)>]+\s*/
			var pattern = delimiter.replace(/([\^\]\[])/g, '\\$1');
			delimiter = new RegExp('\\s*[' + pattern + ']\\s*');
		}
		else if ( !(delimiter instanceof RegExp) )
		{									//TODO: log ignored
			delimiter = '';
		}
	}
	var a = (arg === '' || arg == null) ? []
		  : (arg instanceof Array) ? arg
		  : (typeof(arg) != 'string') ? null
		  : (delimiter) ? arg.split(delimiter)
		  : [arg];
	
	if (a === null)
	{										
		if ((EZ.isArrayLike && EZ.isArrayLike(arg))
		|| (arg instanceof Object && !(arg instanceof Element) && 'length' in arg))
		{									
			arg = (delimiter !== false) ? [].slice.call(arg)
										: arg;
		}
		//...								//TODO: ??
	}
	
	return a || [];
}
//__________________________________________________________________________________________________
EZ.getCaller = function _____EZgetCaller(format, skip) {
/** {
 *	Error.prototype.stackTrace() does all the work -- just identify ourself as caller
}*/
	"use strict";
	var interfaceOpts = {
		caller: EZ.getCaller, 
		format: 'callerName',		//default stackTrace format if none specified
		error: this 				//Error / EZstackTrace Object or stack String / Array
	};								//...otherwise ignored and new Error().stack used
	return Error.prototype.stackTrace.call(interfaceOpts, format, skip);	
}
//__________________________________________________________________________________________________
EZ.getCallerName = function EZcallerName(fn, exclude) {
/* {
EZ.getCallerName([fn])

ARGUMENTS:
	fn		(optional) fn to find caller name (default is immediate caller)
			TODO: if true find immediate caller before anonymous

RETURNS:
	name of the calling function's caller -OR- fn caller if specified.

	var caller = arguments.callee.caller;
	var callerName = caller.displayName || caller.name || '';
----------------------------------------------------------------------------------------------------
}*/
	var isBefore = (fn === true);
	if (isBefore)
		fn = '';
	fn = fn || arguments.callee.caller;
	exclude = exclude || [];
	
	for (var i=0; i<50; i++)
	{
		var caller = '.arguments.callee.caller'.ov(fn);
		if (exclude.includes(caller))
			continue;
		var callerName = !caller ? ''	//'NA'
				   : caller.name || caller.displayName || 'anonymous';
		if (!callerName) 
			return '';
		else if (!isBefore || callerName != 'anonymous')
			return callerName;
	}
	EZ.oops('over 50 callers');
	return '';
}
//__________________________________________________________________________________________________
EZ.getStack = function EZgetStack(options) {
/*{ 
 *	EZ.getStack = function EZgetStack(sliceTo, defaultValue) { [sliceTo, defaultValue] //lint
 *	updated EZ.getStackTrace()-- backward compatible "in theory" -- uses Error.stackTrace() 
 *__________________________________________________________________________________________________
}*/
	"use strict";
	var interfaceOpts = {			//"this" ignored and new Error().stack used if not...
		error: this, 				//...Error / EZstackTrace Object or stack String / Array
		caller: EZ.getStack, 
		defaultFormat: 'html'	
	};								
	return Error.prototype.stackTrace.call(interfaceOpts, options);	
}
//__________________________________________________________________________________________________
/*__________________________________________________________________________________________________
global constants {
__________________________________________________________________________________________________*/
EZ.EOL = String.fromCharCode(172);	//used to show end of non-object value
EZ.DASH = '&#8209;';				//non-breaking dash
EZ.DOT = String.fromCharCode(8226);	//base marker -- used to create compound marker
EZ.DOTS = ('&nbsp;.').dup(3);
EZ.MORE = (EZ.DOT).dup(3);
EZ.LINE = '&#8212;'
EZ.SPACE = String.fromCharCode(160);
EZ.SPACES = ' '.dup(120);
EZ.TRUE = 'true'.wrap();
EZ.FALSE = 'false'.wrap();
EZ.BLANK = 'blank'.wrap()
EZ.EMPTY = 'empty string'.wrap()
EZ.NULL = 'null'.wrap();
EZ.NONE = 'none'.wrap();
EZ.NAN = 'NaN'.wrap();
EZ.UNDEFINED = 'undefined'.wrap();
EZ.NA = 'not loaded'.wrap();
//__________________________________________________________________________________________________
EZ.global = (function(ez)
{
	var global = {
		legacy: {					//EZ.isLegacy() returns true when legacy key not defined
			na:undefined, n:null,	//test data??
			EZmatchPlus: true,
			EZisEmpty: false,
			EZbindElements: false,
			EZisCaller: false,
	
			EZeventAdd: true,								//required for regex assistant
			EZshowHide: true,								//	''
			EZclassAction: true, EZhasClass:true,			//	''
	
			EZgetEl:false, EZgetEl_notFoundnull:true,
			EZgetStyle:false,
			EZtechSupport: true
		},
		messages: {											//EZ.init() copies to EZ.messages
			exception: 'Unexpected Server Response Try Again Later',
			techSupport: 'Technical Difficulty Displaying Page -- Try Later or Contact Tech Support',
			jsonBad: 'Unrecognized Data Returned from Server',
			debugOptionsLost: 'saved debug options invalid',
	
			noTagsFound: 'no html tags found',
			argRequired: '{1} argument required',
			argMissing: '{1} arguments required',			//prefix wih # args required
			argsNotFound: 'arguments not found: ',			//append arg names
			stringRequired: 'armument must be string: ',	//   ''   ''   ''
			functionArgReq: 'armument must be function: ',
			requiresOneArg: 'at least on argument required',
			maxdepth: 'exceeded maxdepth: ',
			noArgs: 'no arguments',
	
			noArrayArg: 'no array argument',
			singleArrayArg: 'single array argument',
			multipleArrayArgs: 'multiple array arguments',
			arrayLikeRequired: 'array or array-like argument required',
			arrayFill: 'array fill',
	
			rootNotFound: 'specified root invalid',
			noStyleFound: 'no style found: ',
			unknownEventName: 'unknown event name',
	
			dropdownModuleRequired: 'EZdropdown RZ.editmodule required',
	
			review: 'review scenario',
			safety: 'unexpected scenario',
			notdone: 'coding not completed',
			untested: 'untested scenario',
			unexpected: 'unexpected scenario',		//oops default?
			moretesting: 'more testing required: {1}',
			oops: 'Technical Difficulty: {0}'
		},
		scripts: {},		//loaded scripts -- set but not yet used
	
	}
	if (ez.global)					//preserve any defined EZ.global properties 
	{
		var _merge = function(global, value)
		{
			if (value instanceof Object)
			{
				if ( !(global instanceof Object) )
					global = {};
				for (var key in value)
					global[key] = _merge(global[key], value[key]);
			}
			else global = value
			return global;
		}
		global = _merge(global, ez.global);
	}
	return global;
})(EZ);
//}		end of EZ.global / constants
//__________________________________________________________________________________________________
EZ.parseFunctionScript = function EZparseFunctionScript(fn) {
/** {
 *	EZ.parseFunctionScript(fn)
 *
 *	returns ObjectLike Array items [script, name, args, body] -- backward compatible -AND-
 *		Object keys/properties: script, name, args/argNames, body
 *__________________________________________________________________________________________________
}*/
	"use strict";					//prefix, thisKeyword, varName, name, argNames, body
	var pattern = /((this\.)?([\w\.]*)\s*[:=]\s*)?function\s*(\w+?)?\s*\(([\w,\s]*?)\s*\)\s*([\s\S]*)/;
	var script = (typeof(fn) != 'function') ? fn + ''
			   : Function.prototype.toString.call(fn).trim()

	var parts = script.match(pattern) || [];
	parts = [].slice.call(parts);	//Array w/o match properties

	parts.script = script;			//set named Array properties to match results
	parts.name = (parts[4] || 'anonymous');
	parts.args = parts.argNames = (parts[5] || '').replace(/(.*)\s*(\/\*.*\*\/)/, '$1'.trim()) || [];
	parts.body = (parts[6] || '');
	parts.varName = (parts[2]) ? 'this' : parts[3] || ''; 
	
	parts.length = 4;				//truncate Array set legacy values
	parts[0] = script;
	parts[1] = parts.name;
	parts[2] = parts.args;
	parts[3] = parts.body;
	return parts;
}
//__________________________________________________________________________________________________
EZ.optionsBoot = (function _____EZoptionsBoot_boot____() {
/**	{ 
 *	EZ.options() -- possibly minimal functionality until more functions loaded -- work in process
 *
 *	Another attempt to automate optional arguments and options -- not finished
 *
 *	If caller Arguments passed as "this":
 *	1.	arguments[...] set to value of each named Argument defined on function statement
 *	2.	check if options passed in any arg defined before options on the function statement
 *		if so, update options, set that arg to undefined and shift remaining arguments.
 *	3.	Set arguments named properties coresponding to named function arguments.
}*/
	"use strict";
	var __;
	//______________________________________________________________________________________________
	var ___ = function EZoptionsBoot(caller, callback)
	{
		var ctx = this || {},
			options = {};
			
		if (Object.prototype.toString.call(ctx).endsWith('Arguments]'))
		{
			options = __.processArguments(ctx, caller);
			return (callback) ? callback(options) : options;
		}
	}
	//==============================================================================================
	__ = function _____INTERNAL_functions_____(){},
	__ = {
	//______________________________________________________________________________________________
	processArguments: function(args, caller)
	{
	/*{---------------------------------------------------------------------------------------------
	 *
	}*/
		var options;
		var argNames = EZ.parseFunctionScript(caller).argNames;
		if (args.length < argNames.length)	//
		{
			var optIdx = argNames.indexOf('options');
			for (var i=0; i<optIdx; i++)
			{
				if (__.isOptions(args[i]))
				{
					[].splice(i, 0, undefined);
					break;
				}
			}
		}
		argNames.forEach(function(name, idx)
		{
			args[name] = args[idx];
		});
		return options;
	},
	fn1: function()
	{
	},
	//______________________________________________________________________________________________
	/**
	 *
	**/
	isOptions: function(arg)
	{
		return (arg instanceof EZ.options)
			|| (typeof(arg) == 'string' && arg.startsWith('?'))
	},
	//..............................................................................................
	
	
	//..............................................................................................
	'~':0};//...end of internal functions
	//==============================================================================================
	return ___;
})()//...end of EZoptions_boot()
//__________________________________________________________________________________________________
EZ.dotNamePlus = (function _____EZdotName_____() {
/*-----------------------------------------------------------------------------------------------{ 
EZ.dotName(dotName, key)

Creates EZdotName Object as Array() with overridden toString() which returns String of the form:
	a.b.c	where a, b, c are values of Array items.
	
exclude functions not supported -- Non-functional placeholder functions created UNTIL pseudo class
EZ.dotName.excludeSetup() loads.
		_toArray = function(dotName)
		{
			return (!dotName) ? []
				 : (dotName instanceof Array) ? dotName.concat(key)
				 : (typeof(dotName) != 'string' && !(dotName instanceof String)) ? key
				 : [dotName+''].concat(key);
		};
-----------------------------------------------------------------------------------------------} */
	"use strict";																			
	var ___ = function EZdotNamePlus(key, options) 
	{
		if (arguments[0] == ___) return this;
		
		var ctx  = (this instanceof ___) ? this 
										 : new ___(___),
		options = EZ.optionsBoot.call(arguments, ___);
		
		var dotName = EZ.toArray(arguments.key);	//dotName tweaked Array Object
		
		for (var p in ctx) dotName[p] = ctx[p];		//append EZ.dotName Object properties
	
		dotName.excludeSetup(options);
		return dotName;
	}
	//__________________________________________________________________________________________________
	___.prototype.toString = function(key)
	{
		var value = this.slice();
		if (key)
			value.push(key);
		return value.join('.');
	}
	//__________________________________________________________________________________________________
	___.prototype.excludeSetup = function() {};
	___.prototype.isExcluded = function() { return false };
	___.prototype.getSkipList = function() { return [] };
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
	return ___;
})();
//__________________________________________________________________________________________________
EZ.dotNamePlus.test = function()
{
	var msg, arr, ctx, arg, args, o, obj, note, ex, exfn, notefn, fn, val, rtnValue;
	e=[ msg, arr, ctx, arg, args, o, obj, note, ex, exfn, notefn, fn, val, rtnValue ];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//=======================================================================================
	/*NOTES:				do not prefix with *				displayed by EZtest Assistant

	*/
	exfn = function(testrun)
	{
		//testrun.set
		if (true) return;
		var msg;

		var results = testrun.getResults();
		var rtnValue = testrun.getReturnValue();

		void(msg, results, rtnValue)
	}
	//=======================================================================================
	notefn = function(testrun)
	{
		e = testrun;
	}
	//=======================================================================================
	//EZ.test.settings( {exfn:exfn} );
	//EZ.test.settings( {legacy:'exclude=isLegacy'} );

	//_______________________________________________________________________________________
	//EZ.test.run(-2, 		{EZ: {ex:-2	,	note:note	}})
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//EZ.test.options( {ex:ex, note:note} )
	//EZ.test.run( ctx, arg, obj )
	
	//_______________________________________________________________________________________
	EZ.test.settings( {exfn:exfn, note:'no exclude -- no options'} );
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	EZ.test.run()
	EZ.test.run('my')
	EZ.test.run({})
 
EZ.test.quit;	//script continues but all following test skipped
if (true) return;

	//_______________________________________________________________________________________
	EZ.test.settings( {note:'exclude'} );
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	var obj = {a:1, b:2}
	var opts = {exclude:'a cat', include:'a'}
	var dotName = new EZ.dotName('dave')
	dotName.setOptions(opts);
	EZ.test.run(dotName, dotName.isExcluded, 'cat', obj)
	EZ.test.run(dotName, dotName.isIncluded, 'cat', obj)
	EZ.test.run(dotName,dotName.push,'cat')
	obj.cat = 'bo'
	EZ.test.run(dotName, dotName.isExcluded, 'cat', obj)
	EZ.test.run(dotName, dotName.isIncluded, 'cat', obj)
	EZ.test.run(dotName, dotName.keys, obj)

	//EZ.test.run(dotName);
	//EZ.test.run(EZ.dotName.keys())
	//_______________________________________________________________________________________
}
//__________________________________________________________________________________________________
EZ.sync = function ___sync(value, defaultValues, name, maxdepth) {
/*-------------------------------------------------------------------------------------------------{
 *	EZ.sync(obj, defaultValues)
 *
 *	TODO:
 *		use EZ.merge.deep if options ??
 *_________________________________________________________________________________________________
}*/
	if ( !(value instanceof Object) || !(defaultValues instanceof Object) ) return;
	
	var logging = (name !== null);
	name = name || '';
	if (!isNaN(name))
	{
		maxdepth = name;
		name = '';
	}
	var actions = '';						//get actions from name prefix
	name = (name+'').replace(/^([+-@*?^]*)/, function(all, p)
	{												
		actions = p;
		return '';
	});
	var logKey = '';						//if name starts with [...]
	name.replace(/^(\[(.*)\])?/, function(all, wrapped, key)
	{
		logKey = key || '';
		return '';
	});
	
	if (!/[+-]/.test(actions))
		actions += '+-';

	var msg = [(name || 'Object name NA') + ' \t\t @ ' + EZ.format.time('ms') + '\t'];

	var formatOpts = maxdepth;
	if (!isNaN(formatOpts))
		formatOpts = {maxdepth: maxdepth};
	else
		formatOpts = EZ.options.call(formatOpts);

	maxdepth = formatOpts.maxdepth || 9;
	formatOpts.maxchars = formatOpts.maxchars || 100;

	var dotName = //(actions.includes('?')) ? new EZ.dotNameDev()
				 (EZ.dotName) ? new EZ.dotName()
				: [];
	//______________________________________________________________________________________________
	/**
	 *
	**/
	var _format = function(action,obj,key)
	{
		formatOpts.key = key;
		var fmt = (dotName instanceof Array) ? dotName.concat([key]).join('.')
											 : dotName.toString(key);
		fmt = '    ' + fmt + ' \t '
			+ '\t *' + action + '* \t ... '
			+ obj[key]
		//		+ EZ.format.value(obj[key], formatOpts)
		msg.push(fmt)
	}
	//______________________________________________________________________________________________
	/**
	 *	for nested Objects at this depth
	**/
	var _syncDepth = function(obj, defaultValues, dotName, depth)
	{
		if (depth > maxdepth || EZ.getType(defaultValues) != 'Object')
			return;

		var keysActs = obj.$sync || actions;				//sync actions for this property
		if (/[+=]/.test(keysActs))
		{													//for add or replace...
			Object.keys(defaultValues).forEach(function(key)	//add missing properties
			{
				if (key in obj || key == '$sync') 
					return;
				obj[key] = obj[key] || defaultValues[key];
				_format('added',obj,key);
			});
			/*
			
			
			
			
			Object.keys(defaultValues).forEach(function(key)	
			{												
				if (key == '$sync')
					return;
				if (obj[key] === defaultValues[key])
					return;
				if (key in obj && !(key in defaultValues))
					return;
					
				if (key in obj && !keysActs.includes('='))
					
				if (keysActs.includes('='))
					delete obj[key];
				
				var act = key in obj ? 'replaced' : 'added';
				_format(act , obj, key);
				obj[key] = obj[key] || defaultValues[key];
			});
			*/
		}
		if (keysActs.includes('-'))							//for delete...
		{
			var deleteKeys = Object.keys(obj).remove( Object.keys(defaultValues) );
			deleteKeys.forEach(function(key)
			{
				if (!isNaN(key)) return;					//ignore numeric keys -- assume ArrayLike
				
				_format('deleted',obj,key);
				delete obj[key];							
			});
		}
		if (!keysActs.includes('$'))						//delete $sync control unless it contains $
			delete obj.$sync;
		
		Object.keys(obj).forEach(function(key)				//for nested Object properties
		{
			if (obj[key] instanceof Object)
				_syncDepth(obj[key], defaultValues[key], dotName.concat([key]), depth+1);
		});
	}
	//==============================================================================================
	_syncDepth(value, defaultValues, dotName, 0);
	//==============================================================================================
	if (msg.length == 1)
	{														
		if (actions.includes('^')) return '';				//no changes not logged
		msg[0] += '... no changes\t\t';
	}
	msg = msg.format();
	if (logging)
		EZ.log(msg, logKey);
	return msg;
}
//__________________________________________________________________________________________________
EZ.sync.getSet = function(obj, dotName){
/*{-------------------------------------------------------------------------------------------------
. . .
-------------------------------------------------------------------------------------------------}*/
	var bindList = {

		get: function _get(key, defaultValue)
		{
			if (key == null || key in this === false)
				return EZ.oops(this.errmsg(key, 'invalid key')) || defaultValue;

			return (key in this && this[key] !== undefined) ? this[key]
															: defaultValue || '000';
		},

		set: function _set(key, value)
		{
			//var msg = 'set ' + this.dotName + key + '=' + value + ' -- ';
			if (key == null || key in this === false)
				return EZ.oops(this.errmsg(key, 'invalid key')) || value;

		//	if (EZ.getType(value) !== EZ.getType(this[key]))
		//		return EZ.oops(msg + 'incorrect type') || this[key];

			return this.key = value;
		},

		errmsg: function(key, value, msg)
		{
			var msg = dotName.join('.')
					+ arguments.callee.caller.name.substr(1) + '(' + key
					+ (arguments.length > 2 ? '=' + value : '')
					+ ') -- ' + arguments[arguments.length-1];
			return msg;
		}
	}
	if (!dotName.endsWith('.'))
		dotName += '.';
	dotName = dotName.split('.');
	for (var fn in bindList)
	{
		if (fn != 'errmsg')
			obj[fn] = bindList[fn].bind(obj)
		else
			obj[fn] = bindList[fn].bind(dotName)
	}
};//...end of EZ.sync.getSet
//__________________________________________________________________________________________________
(function _____EZformat_limited_____() {
/**
 *	EZ.format() -- limited functionality until EZformat.js loads
**/
EZ.format = {
	//_________________________________________________________________________________________
	toStringElement: {					//Element.toString default argument: if blank or
			defaultValue: 'brief',		//undefined native: e.g. "[object HTMLSpanElement]"
			defaultAttributes: 'className id name tagName type'
	},									
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
	value: function ___format_value(value, maxchars, callback, options)
	{
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
			value = value.substr(0,maxchars || value.length).replace(/(.)/g, function(ch)
			{
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
				str = '"' + str.wrap('"') + '"';
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
//_____________________________________________________________________________________________
// EZ.formatDate is defined for backward compatibilty and EZ.format.value() convenience
//	niether is currently updated when EZformat.js is subsequently loaded.
EZ.formatDate = function(date) { return EZ.format.value(date) }
EZ.format.date = EZ.formatDate;
EZ.format.dateTime = EZ.formatDate;
EZ.format.time = EZ.formatDate;
//. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
})();//...end of EZ.format()
EZ.date = function EZdate_stub() { return new Date([].slice.call(arguments)) };
//__________________________________________________________________________________________________
EZ.getDate = function EZgetDate(date, defaultDate) {
/** 
 *	returns Date Object: if specified date invalid or base date i.e. =new Date(null)...
 *		return defaultDate if specified even if invalid e.g. empty string "" -- null
 *		otherwise return current date/time e.g. new Date()
**/
	if (typeof(date) == 'string')
		date = date.replace(/-/g, '/')
	if (typeof(defaultDate) == 'string')
		defaultDate = defaultDate.replace(/-/g, '/')
	
	date = new Date(date);
	if (isNaN(date) || date.getTime() == new Date(0).getTime())
		date = (defaultDate !== undefined) ? new Date(defaultDate) : new Date();
	return date;
}
//______________________________________________________________________________________________
EZ.getTime = function EZ_getTime(date, deltaMS) {
/**
 *	return date with deltaMS added or subtracted is negitive -- uses current date if invalid
 */
	if (date === 0)
		date++;
	return EZ.getDate(date, new Date()).getTime() + (deltaMS || 0);
}

//__________________________________________________________________________________________________
//EZ.toArray(), EZ.callerName(), EZ.getType(), EZ.isLegacy()...plus
// {	COPIED BUT NOT YET REMOVED FROM: EZbasic_pruned.js
EZ.removeItems = function EZremoveItems(array, fromIndex, toIndex)
{
/** {
EZ.removeItems(array,[fromIndex][,toIndex] | [value, value,...], [array-of-values])

returns new Array with specified items removed -- original Array is unchanged.

If only array argument, remove blank, null or undefined Array items.
If second argument is not number, remove all items matching value of any argument after array.
If second argument is ArrayLike object, remove any item matching any of those Array items.

When fromIndex is number, remove slice of elements starting at fromIndex through toIndex if
specified or end of Array if not -- splice() functionality w/o changing original Array and
supports ArrayLike Objects.

NOTE: EZ.toArray() calls to eliminate blank items when converting delimited strings to Array.
---------------------------------------------------------------------------------------------
}*/

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
EZ.toArrayLike = function EZtoArrayLike(arg)
{
	return EZ.toArray(arg, false);
}
//__________________________________________________________________________________________________
EZ.toArray = function EZtoArray(arg, delimiter /* options */) {
/*	{ 
 *
EZ.toArray(arg, delimiter) -- 	MAJOR INTERNAL WORK-HORSE 

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
 *__________________________________________________________________________________________________
}*/
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
	if (!delimiter || delimiter instanceof Array
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
	while (typeof(arg) == 'string' && (delimiter || delimiter === '0'))
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
/*
	EZ.test.run(t_divs, false 		, {EZ: {ex:t_divs  			}});
	EZ.test.run(t_radios, false 	, {EZ: {ex:t_radios  		}});

	EZ.test.run(t_doc				, {EZ: {ex:[t_doc]  	}});
	EZ.test.run(t_none 				, {EZ: {ex:[t_none]  	}});
	EZ.test.run(t_tags 				, {EZ: {ex:[t_tags]  	}});
	EZ.test.run(t_tags[0]			, {EZ: {ex:[t_tags[0]]  }});
*/
}
/*---------------------------------------------------------------------------------------------
return pseudo tagType -- blank if el undefined or not html element
lowercase el.type if button radio checkbox text password or hidden
otherwise lowercase el.tagName (el.type ignored for select-one or select-multiple)
---------------------------------------------------------------------------------------------*/
EZ.getTagType = function EZgetTagType(el)
{
	if (!el || !el.childNodes) return '';

	var tagName = (el.tagName || '').toLowerCase();
	var tagType = (el.type || '').toLowerCase();

	if (!/(button|image|radio|checkbox|text|password|hidden)/i.test(tagType)) 
		tagType = tagName;
	return tagType;
}
/*---------------------------------------------------------------------------------------------
chrome value is 'on' if not specified -- verify by checking outerHTML for value
return empty string if not explicitly specified
---------------------------------------------------------------------------------------------*/
EZ.getTagValue = function EZgetTagValue(el)
{
	var value = el.value;
	if (value == 'on' && !/value="(.*?)"/.test(el.outerHTML) )
		value = '';
	return value;
}
/*--------------------------------------------------------------------------------------------------
EZ.getConstructorName(obj)

Similar results as EZ.getType() except non-objects and null returned as empty String.
--------------------------------------------------------------------------------------------------*/
EZ.getConstructorName = function EZgetConstructorName(obj)
{
	return !obj || typeof(obj) != 'object' ? '' : obj.constructor.name || '';
}
//__________________________________________________________________________________________________
EZ.getType = function EZgetType(value, options) {
/** {
EZ.getType(value, options)

return value type via Object.prototype.toString.call(value) for more grandularity vs typeof()

ALWAYS return...
	"Boolean", "Function", "Number", "String", "Object", "Null", "Undefined"
	
	when typeof(value) == 'function', "Function" only returned if not constructor 	

	
ALSO return...
	"Array", "Date", "RegExp"	when value is: "Array", "Date", "RegExp" 
								-AND- unless options === false
								i.e. options omitted, undefined, null, true or blank
										
	"NaN",  					if options === true, NaN -or- includes NaN or "NaN"
	
	"ArrayLike"					if options === true -or- includes "ArrayLike"
								and value is Object with only length and numeric keys

	"ObjectLike"				if options === true -or- includes "ObjectLike"
								and value is Array with named keys other than length

								-or- Object with only numeric Keys and length property

	constructor name 			when options === true (not just "Array"  "Date", "RegExp")
								e.g. EZoptions, Arguments, Element, HTMLCollection
	
	TODO: arguments				-OR- if (options.includes(value.constructor.name)	
								-OR- if Object.prototype.toString.call(value) is all lowercase: 
										e.g. "Window" for [object global] -- snenario forgotten
RETURNS: 
	(String) representing value type as explained above.
 *______________________________________________________________________________________________
}*/
	var isArrayLike = function()					
	{
		var keys = Object.keys(value).sort();
		if (keys.includes('length'))
			keys.splice(keys.includes('length'),1);
		var arr = [].slice.call(value);
		return (Object.keys(arr).sort().join(' ') == keys.join(' '))
	}
	//______________________________________________________________________________________________
	/**
	 *
	 */
	var isObjectLike = function()
	{
		var keys = Object.keys(value).sort();
		return (JSON.stringify(keys).includes('"'));
	}	
	//______________________________________________________________________________________________
	/**
	 *
	 */
	var _getType = function(value, options)
	{
		var optsArray = EZ.toArray(options, ' ,');
		//===========================================================================================
		var type = Object.prototype.toString.call(value);
		type = type.substring(8,type.length-1)
		//============================================================================================
		
		if (type.toLowerCase() == type)
			type = EZ.getType.details.type = value.constructor.name;
	
		if (type.endsWith('Element') && optsArray.includes('Element'))
			type = 'Element';
		

		if (arguments.length < 2 || options === null || options === undefined 
		|| options === '' || options === true && value)
		{
			while (options === true)
			{				
				if (type == 'Object'
				&& typeof(value) == 'object' && 'length' in value)
				{
					if (isArrayLike())
						return "ArrayLike";
					break;
				}
				else if (type == 'Array'
				&& value && typeof(value) == 'object' && 'length' in value)
				{
					if (isObjectLike())
						return "ObjectLike";
					break;
				}
				break;
			}
			return type;
		}
		if (options === false && /(Array|Date|RegExp)/.test(type))
			return "Object";
		
		if (type == 'Number' && isNaN(value))
		{
			if ((options === true ||options === 'NaN' || isNaN(options))
			|| (EZ.isArray(options) && options.includes(NaN))
			|| (typeof(options) == 'string') && /\bNaN\b/.test(options))
				return "NaN";
			else
				return type;
		}
		if (!(value instanceof Object))
			return type;
		
		if (options == null || /(undefined|boolean|number)/.test(typeof(options)) || options === '')
			return type;
		
		var name = value.constructor.name;
		if (typeof(options) == 'function' && options.constructor.name == name)
			return name;
		
		while (typeof(value) == 'object')
		{	
			options = EZ.toArray(options, ', ');		
			if (options.includes(name) || options.includes(value.constructor))
				return name;					//return constructor name
			
			if (options.includes('ArrayLike') && isArrayLike())
				return "ArrayLike";				
			
			if (options.includes('ObjectLike') && isObjectLike())
				return "ObjectLike";			
			
			break;
		}
		//======================
		return type;
		//======================
	}
	if ( !(this instanceof arguments.callee) )					//not called as constructor
	{
		var isLegacy, types;
		
		if (EZ.test.run.funcName == 'EZgetType')				//unit testing
		{
			var rtnLegacy = _getType(value, options);
			var rtnValue = new EZ.getType(value, options);
			if (rtnLegacy === rtnValue._.returned)				//legacy and new results match
				return rtnLegacy;
			else
				return {legacy: rtnLegacy, newest: rtnValue._.returned}
		}
		else 
		{
			if (options instanceof Object && (options.types || options.legacy))
			{
				types = options.types;
				isLegacy = options.legacy;
			}
			else
			{
				types = options;
				if (EZ.test.run.funcName == 'EZgetType' && EZ.test.run.legacy !== undefined) 
					isLegacy = EZ.test.run.legacy;
				else 
					isLegacy = true;	//EZ.isLegacy();
			}
			if (isLegacy) 
				return _getType(value, types);
		
			var rtnValue = new EZ.getType(value, types);
			//return rtnValue;
			return rtnValue._.returned;
		}
	}
	//______________________________________________________________________________________________
	/**															//constructor
	 *
	this.toString = function()
	{
		return this._ ? this._.returned
				 	  : Function.prototype.toString.call(this);
	}
	 */
	//=================================================================================================
	var type = Object.prototype.toString.call(value);
	type = type.substring(8,type.length-1)
	//=================================================================================================
	var typesList = (typeof(options) == 'object' && EZ.isArray(options)) ? options.slice()
					 : (options instanceof Object) ? [options.constructor.name]
					 : [];
	
	var rtn = this._ = {
		type: type,
		basic: type,
		pseudo: type,
		constructorName: (value instanceof Object) ? value.constructor.name : ''
	}
															//determine pseudo name
	if (type.toLowerCase() == type)							//Window for 'global'
		rtn.pseudo = value.constructor.name;
														
	if (/(Array|Date|RegExp)/.test(rtn.constructor.name))
		rtn.pseudo = rtn.constructorName;					//Array, Date, RegExp
	
	else if (rtn.constructorName == 'Object' 
	&& 'length' in value && isArrayLike())
		rtn.pseudo = "ArrayLike";							//Object with length property
		
	else if (rtn.constructorName == 'Array' && isObjectLike())
		rtn.pseudo = "ObjectLike";							//Array with named properties other than length

	else if (type == 'Number' && isNaN(value))
		rtn.pseudo = "NaN";
	
	else if (!(value instanceof Object))					//pseudo=constructor name if not Object
		rtn.pseudo = rtn.constructorName = type;			//e.g. Number, Boolean
	
	else if (typeof(value) == 'function' && rtn.constructorName == 'Function')							
		rtn.pseudo = value.name;
	
	else
		rtn.pseudo = rtn.constructorName;
															  //--------------------------------------------\\
															 //determine which type returned based on options\\
	rtn.returned = rtn.returned = rtn.basic; 				//------------------------------------------------\\
	if (options == null || options === '' || options === false
	|| /(undefined|number)/i.test(typeof(options)) )
		//rtn.returned type === null ? 'Null' : type;
		void(0);											//return basic i.e typeof() plus Window
	
	else if (options !== false								
	&& /^(Array|Date|RegExp)$/.test(rtn.pseudo))			//1st pseudo group
		rtn.returned = rtn.pseudo;	
	
	else if (options === true)
		rtn.returned = rtn.pseudo;	
	
	else if (typesList.includes(rtn.pseudo))			
		rtn.returned = rtn.pseudo;	
}
//________________________________________________________________________________________
EZ.getType.test = function()
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
			
		ex = note = undefined;
		return exResults;
	}
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	notefn = function(testrun, phase)
	{
		void( [testrun] )	//jshint
		switch (phase)
		{
			case 'prerun': 	//disabled
			{
				break;
			}
			case 'final': 	
			{
				if (typeof(testrun.actual.results) == 'object')
				{
					testrun.info.push('legacy not same as new'.wrap('<em>'));
					if (testrun.okChecked === true)
						testrun.okChecked = 'some';
				//testrun.note += (note || '');
				}
				break;
			}
		}	
	
			
	}
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//EZ.test.skip(999)		//count to skip 
	//EZ.test.settings({group: 'persistant note'});
	//EZ.test.run(-2, 		{EZ: {ex:-2	,	note:note	}})
	//_______________________________________________________________________________________
	
	//EZ.test.settings( {exfn:exfn} )				//exfn called if EZ.test.options() not called
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	//______________________________________________________________________________
	note = ''
	//EZ.test.run.legacy = false;	
	//EZ.test.settings({group: 'legacy: ' + EZ.test.run.legacy + ' (legacy issues)'});
	EZ.test.settings({group: ' (legacy issues)', notefn:notefn});
	
	//EZ.global.legacy.EZgetType = false;
	//var opts = {types:true, legacy:false}

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	obj = EZ.options();
	EZ.test.run(obj);
	EZ.test.run(obj, true);
	EZ.test.run(EZ.options);	
	EZ.test.run(EZ.options,true);	
	
	obj = new Date('01/01/2016')
	EZ.test.run(obj, true);

	//______________________________________________________________________________
	//EZ.test.settings({group: 'legacy: ' + EZ.test.run.legacy, exfn:notefn});
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	EZ.test.settings({group:'Boolean, Function, Number, String, Object, Null, Undefined'});	
	
	EZ.test.run(true)
	EZ.test.run(true, undefined)
	EZ.test.run(true, null)
	EZ.test.run(true, '')
	EZ.test.run(true, NaN)
	EZ.test.run(true, "NaN")
	EZ.test.run(true, [NaN])
	EZ.test.run(true, ["NaN"])
	EZ.test.run(true, true)
	EZ.test.run(true, false)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	fn = function myfn() {}
	EZ.test.run(fn)
	EZ.test.run(fn		, undefined)
	EZ.test.run(fn		, null)
	EZ.test.run(fn		, '')
	EZ.test.run(fn		, NaN)
	EZ.test.run(fn		, "NaN")
	EZ.test.run(fn		, [NaN])
	EZ.test.run(fn		, ["NaN"])
	EZ.test.run(fn		, true)
	EZ.test.run(fn		, false)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .	
	EZ.test.run(1)
	EZ.test.run(1		, undefined)
	EZ.test.run(1		, null)
	EZ.test.run(1		, '')
	EZ.test.run(1		, NaN)
	EZ.test.run(1		, "NaN")
	EZ.test.run(1		, [NaN])
	EZ.test.run(1		, ["NaN"])
	EZ.test.run(1		, true)
	EZ.test.run(1		, false)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	EZ.test.run('')
	EZ.test.run(''		, undefined)
	EZ.test.run(''		, null)
	EZ.test.run(''		, '')
	EZ.test.run(''		, NaN)
	EZ.test.run(''		, "NaN")
	EZ.test.run(''		, [NaN])
	EZ.test.run(''		, ["NaN"])
	EZ.test.run(''		, true)
	EZ.test.run(''		, false)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	EZ.test.run({})
	EZ.test.run({}		, undefined)
	EZ.test.run({}		, null)
	EZ.test.run({}		, '')
	EZ.test.run({}		, NaN)
	EZ.test.run({}		, "NaN")
	EZ.test.run({}		, [NaN])
	EZ.test.run({}		, ["NaN"])
	EZ.test.run({}		, true)
	EZ.test.run({}		, false)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	EZ.test.run(null)
	EZ.test.run(null	, undefined)
	EZ.test.run(null	, null)
	EZ.test.run(null	, '')
	EZ.test.run(null	, NaN)
	EZ.test.run(null	, "NaN")
	EZ.test.run(null	, [NaN])
	EZ.test.run(null	, ["NaN"])
	EZ.test.run(null	, true)
	EZ.test.run(null	, false)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	EZ.test.run(undefined)
	EZ.test.run(undefined	, undefined)
	EZ.test.run(undefined	, null)
	EZ.test.run(undefined	, '')
	EZ.test.run(undefined	, NaN)
	EZ.test.run(undefined	, "NaN")
	EZ.test.run(undefined	, [NaN])
	EZ.test.run(undefined	, ["NaN"])
	EZ.test.run(undefined	, true)
	EZ.test.run(undefined	, false)
/*	
	//______________________________________________________________________________
	//"Array", "Date", "RegExp", "NaN", "Arguments", "Window"
	EZ.test.run([])
	EZ.test.run([]	, undefined)
	EZ.test.run([]	, null)
	EZ.test.run([]	, '')
	EZ.test.run([]	, NaN)
	EZ.test.run([]	, "NaN")
	EZ.test.run([]	, [NaN])
	EZ.test.run([]	, ["NaN"])
	EZ.test.run([]	, true)
	EZ.test.run([]	, false)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	arg = new Date('06/13/2016');
	EZ.test.run(arg)
	EZ.test.run(arg	, undefined)
	EZ.test.run(arg	, null)
	EZ.test.run(arg	, '')
	EZ.test.run(arg	, NaN)
	EZ.test.run(arg	, "NaN")
	EZ.test.run(arg	, [NaN])
	EZ.test.run(arg	, ["NaN"])
	EZ.test.run(arg	, true)
	EZ.test.run(arg	, false)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	arg = /patteern/;
	EZ.test.run(arg)
	EZ.test.run(arg	, undefined)
	EZ.test.run(arg	, null)
	EZ.test.run(arg	, '')
	EZ.test.run(arg	, NaN)
	EZ.test.run(arg	, "NaN")
	EZ.test.run(arg	, [NaN])
	EZ.test.run(arg	, ["NaN"])
	EZ.test.run(arg	, true)
	EZ.test.run(arg	, false)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	arg = NaN;
	EZ.test.run(NaN)
	EZ.test.run(arg	, undefined)
	EZ.test.run(arg	, null)
	EZ.test.run(arg	, '')
	EZ.test.run(arg	, NaN)
	EZ.test.run(arg	, "NaN")
	EZ.test.run(arg	, [NaN])
	EZ.test.run(arg	, ["NaN"])
	EZ.test.run(arg	, true)
	EZ.test.run(arg	, false)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	obj = {'0':'ArrayLike', length:1}
	EZ.test.run(obj)
	EZ.test.run(obj	, undefined)
	EZ.test.run(obj	, null)
	EZ.test.run(obj	, '')
	EZ.test.run(obj	, NaN)
	EZ.test.run(obj	, "ArrayLike")
	EZ.test.run(obj	, [NaN])
	EZ.test.run(obj	, ["ArrayLike"])
	EZ.test.run(obj	, true)
	EZ.test.run(obj	, false)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	arg = [1,2,'abc'];
	arg.hi = 'xyz';
	EZ.test.run(arg)
	EZ.test.run(arg	, undefined)
	EZ.test.run(arg	, null)
	EZ.test.run(arg	, '')
	EZ.test.run(arg	, NaN)
	EZ.test.run(arg	, "ObjectLike")
	EZ.test.run(arg	, [NaN])
	EZ.test.run(arg	, ["ObjectLike"])
	EZ.test.run(arg	, true)
	EZ.test.run(arg	, false)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	arg = document.createElement('div')
	//EZ.test.run(arg)		//test assistant issue

	
	//______________________________________________________________________________
	arg = arguments;		//not found
	arg = window;			//test assistant issue
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
*/	
}

//__________________________________________________________________________________________________
EZ.isLegacy = function EZisLegacy(key, defaultValue)
{
/**	{ 
EZ.isLegacy(key, defaultValue)

return value of EZ.legacy[key] if defined -- otherwise defaultValue if specified or undefined

	key 	(optional)	key to check in EZ.legacy (default:	caller function name)
						if boolean, return -- overrides EZ.legacy
	options	(optional)	last arg if object -- return options.legacy in not undefined
	
NOTE: put in EZbasic.js because used by EZ.event() and probably other fn groups.
	  removed EZ.is and ov dependencies
 *__________________________________________________________________________________________________
}*/
	if (typeof(key) == 'boolean') return key;

	var args = (EZ.getType(key,true) == 'Arguments') ? key : arguments;	
	args = args.length ? [].slice.call(args) 
					   : [''];		//add blank item if empty

									//if last arg is object pop() for options
	var options = (args[args.length-1] instanceof Object) ? args.pop() : {};
	if (options.legacy)
		return options.legacy;		//if options contains legacy property, return value
	
if (EZ.isTestFunction(arguments.callee.caller.name))
	return false;

	key = args.shift() || EZ.getCallerName(true);
	defaultValue = args[0] != null ? args.shift() : true;
	
	var isLegacy = key.indexOf('.') == -1 ? EZ.global.legacy[key]
										  : 'EZ.global.legacy.'.concat(key).ov();
	if (isLegacy == null)
		isLegacy = defaultValue;
	return isLegacy === true;
};
//. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
//}...end of...EZ.toArray(), EZ.callerName(), EZ.getType(), EZ.isLegacy()...plus
//__________________________________________________________________________________________________
(function ________EZoptions________() {
void(0)
/** {
EZ.options(options, defaultKey, defaults)	(defaultKey legacy only)

ARGUMENTS:
	this			(optional)	defaultOptions if not window oe EZ (forces non-legacy)
	
	optValue		(Object) 	(not Element) caller options as key/values
		??			(String) 	if defaultOptions !== true, value of defaultKey
							 	if defaultOptions === true, parse String into key/value Object
				
	options			(Object) 	callers options argument or defaultOptions
					(Boolean)	true to parse key/value pairs from optValue when String
					(String)	option key if options is not an Object

	defaults		(EZoptions)	defaultOptions for keys not specified by optValue or options
	(optional)		(Object) 	specifies optValue options key by type -- where defaults:
								key specifies optValue type -- value spefifies options key
					NOTE: 		1st Object argument with "defaults" key takes precedence

RETURNS:
	options object containing all default options -- values replaced by specified options

TODO:
	allow multiple options arguments ??
//}
--------------------------------------------------------------------------------------------------*/
EZ.options = function EZoptions(optValue, options, defaults)
{																
	if (Object.keys(this).length === 0 			//called as constructor
	&& this instanceof arguments.callee) 		
	{															
  		if (optValue !== undefined || options !== undefined)
  		{
			this.toString = (EZ.format) ? EZ.format.EZoptions
										: Object.prototype.toString;
  		}
		return this;	
	}
	//______________________________________________________________________________________________
	/**
	 *	default validation function used when defaultOptions is native Object not EZoptions
	 *	overridden below if defaultOptions if EZ.options() Object -- never really completed
	 */
	var getValue = function(key, value) {return value};
	//=================================================================================================\\	
	var isLegacy;
	var isOptionsStringAllowed = null;			//assumed below when this is String -- deprecate ??

	var defaultOptions = null;
	if (this != window && this != EZ)
	{
		isLegacy = false;
		if (this instanceof String)
		{	
			defaultOptions = this.toString();	//convert String --> typeof 'string'
			defaultOptions = (/(global|globalDefault)/.test(defaultOptions)) ? EZ.defaultFormatOptions
						   : EZ.getAttributes(defaultOptions, true);
		}
		else defaults = this;
		if (typeof(options) == 'function')
			options = options();
	}
	if (isLegacy === undefined)
		isLegacy = '.legacy'.ov(options||{}, EZ.isLegacy());
	//=================================================================================================
	// 	created: 08-21-2016
	//	updated: 09-10-2016 defaults optionally passed as this -- forces isLegacy false
	//	updated: 10-12-2016 defaultOptions set to (this)defaults
	//						move optValue out of _mergeOptions() into main-line code below
	//	updated: 11-11-2016 check for optionGroup keys in callerOptions
	//	updated: 11-21-2016 case insensitive options properties / convert delimited String to Array
	//=================================================================================================
	if (!isLegacy)
	{
		var callerArgs = _getCallerArgs();				//check if caller passed arguments
		
		if (this == defaults)
		{
			defaultOptions = defaults;
			if (typeof(defaultOptions) == 'function') 
				defaultOptions = defaultOptions();
			
			defaults = EZ.options(defaults);			//create EZoptions object -- loses properties
		}												//...but major issues if not called
		
		else if (!callerArgs && arguments.length == 2
		&& optValue instanceof Object 					//confusing/unreliable legacy syntax
		&& options instanceof Object) 					//...EZ.options(options,defaults)
		{												//...probably not used
			defaults = options;
			options = optValue;
			optValue = undefined;
		}
		if (!defaultOptions)							//default options
			defaultOptions = _getDefaultOptions();		
		var callerOptions = _getCallerOptions();		//caller specified options
		
		options = new EZ.options();		 				//always create fresh EZ.options() Object
		_mergeOptions(defaultOptions);
		
		if (defaults && defaults.optionGroups && callerOptions)
		{												//if predefined option groups and callerOptions
			var groupKeys = Object.keys(defaults.optionGroups);
			groupKeys.forEach(function(key)
			{
				if (key in callerOptions)				//for any predefined key in callerOptions
				{										//...merge predefined options
					delete callerOptions[key];
					_mergeOptions(defaults.optionGroups[key]);
				}
			});
		}
		_mergeOptions(callerOptions);					//merge remaining non-group options
														
		if (optValue !== undefined && defaults)			//10-12-2016\\
		{												//check for default option specified as 1st arg
			var type = EZ.isEl(optValue) ? 'element'	
					 : optValue != null && !isNaN(optValue) ? 'number'	
					 : EZ.getType(optValue).toLowerCase();
			
			var optKey = defaults[type] || defaults[type.toTitleCase()];				
			if (optKey)
				options[optKey] = getValue(optKey, optValue);
		}											
		//_mergeOptions(optValue);						\\10-12-2016//
	//	if (defaultOptions && callerOptions)			//delete groupOptions if NOT initializing default options
	//		delete options.common;						//TODO: need better test
		
		if (arguments.length > 1 && defaultOptions)
		{
			void(0);
		}
		//=================================
		EZ.options.setExcludeKeys(options);
		return options;
		//==================================
	}
	
	//=================================================================================================\\	
	// support functions for VERSION: 08-21-2016
	//=================================================================================================\\	
	function _getCallerArgs()
	{
		var args;
		if (EZ.getType(optValue) == 'Arguments')		
		{
			args = optValue;
			optValue = undefined;
		}
		else if (EZ.getType(options) == 'Arguments')	
		{
			args = options;
			options = undefined;
		}
		else if (EZ.getType(defaults) == 'Arguments')
		{
			args = defaults;
			defaults = undefined;
		}		
		return args;
	}
	//______________________________________________________________________________________________
	function _getDefaultOptions()
	{
		var opts;
		if (EZ.is(defaults, EZ.options))
		{
			opts = defaults;
			if (opts.getValue)
				getValue = opts.getValue;	//option validattion / mapping may be defined
			return opts;
		}
		else if (defaults === true)			//deprecate ??
			isOptionsStringAllowed = true;
	}
	//______________________________________________________________________________________________
	function _getCallerOptions()
	{
		var type = EZ.getType(options);
		var opts = callerArgs ? callerArgs[callerArgs.length-1] : '';
		if (opts)
		{
			if (!defaultOptions && /(Object|EZoptions)/.test(type))
			{
				defaultOptions = options;
				options = null;
				if (defaultOptions.getValue)
					getValue = defaultOptions.getValue;	//option validattion / mapping may be defined
			}
		}
		else
		{		
			if (/(Object|EZoptions)/.test(type))
			{
				opts = options;
				options = null;
				if (opts.getValue)
					getValue = opts.getValue;	//option validattion / mapping may be defined
			}
			else if (options === true && isOptionsStringAllowed === null)
				isOptionsStringAllowed = true;
			
			if (type == 'String' && isOptionsStringAllowed)
			{
				opts = EZ.getAttributes(callerOptions, true);
				options = null;
			}
			else if (!opts && EZ.isObject(optValue))
			{
				opts = optValue;
				optValue = null;
			}
		}
		defaults = '.defaults'.ov(opts) || '.defaults'.ov(defaultOptions) || defaults;
		return opts;				
	}
	//______________________________________________________________________________________________
	/**
	 *	merge opts into options, replacing any existing value -- undefined values ignored
	 */
	function _mergeOptions(opts)
	{
		if (EZ.isObject(opts))
		{
			if ('.defaults.groups'.ov(opts))		
			{
				Object.keys(opts).forEach(function(key)
				{
					if (typeof(opts[key]) == 'function') return;
					
					var value = getValue(key, opts[key]);
					if (value instanceof Object)
						value = value.cloneObject({objects:false, functions:false})	
					
					options[key] = value;
				});
			}
			else									//11-11-2016 replaced by above (deep clone) 
			{
				for (var key in opts)
				{
					if (typeof(opts[key]) != 'function')
						options[key] = getValue(key, opts[key]);
				}
			}
		}
	}	
	//=================================================================================================\\	
	// legacy before 08-21-2016 (still default as of 02-17-2017): EZtestAssistant overrides
	//=================================================================================================\\	
	var getCallerArgs = function()
	{
		if (EZ.getType(optValue) == 'Arguments')		
		{
			callerArgs = optValue;
			optValue = undefined;
		}
		else if (EZ.getType(defaultOptions) == 'Arguments')	
		{
			callerArgs = defaultOptions;
			defaultOptions = undefined;
		}
		else if (EZ.getType(defaults) == 'Arguments')
		{
			callerArgs = defaults;
			defaults = undefined;
		}
		return callerArgs;
	}
	//=================================================================================================\\	
	var defaultOptions = options;
	var options = new EZ.options(); 				//create fresh EZ.options() Object for options
	
	var callerOptions = optValue;
	var callerArgs = getCallerArgs();
	if (!EZ.isObject(callerOptions) && callerArgs)
	{
		callerOptions = callerArgs[callerArgs.length-1];
		if (!EZ.isObject(callerOptions))	
			callerOptions = undefined;
	}
	var isOptionsStringAllowed = (defaultOptions === true);
	var key = (!isOptionsStringAllowed) ? defaultOptions : undefined;

													  //----------------------------------------\\
	if (EZ.isObject(defaultOptions))				 //----- see if defaultOptions supplied -----\\
	{												//--------------------------------------------\\
		if (EZ.is(defaultOptions, EZ.options.defaultValues))
		{											//defaultOptions is EZ.options() class
			getValue = defaultOptions.getValue;		//option validattion / mapping may be defined
			defaultOptions = defaultOptions.defaultValues;
		}
		if (EZ.isObject(defaultOptions.defaults) && !EZ.isObject(defaults))
			defaults = defaultOptions.defaults;
		
		Object.keys(defaultOptions).forEach(function(key)
		{
			options[key] = defaultOptions[key];
		});
	}

	if (callerOptions != null)
	{													//if options supplied as String of key/value pairs
		if (typeof(callerOptions) == 'string' && isOptionsStringAllowed)
			callerOptions = EZ.getAttributes(callerOptions, true);
		
		if (EZ.isObject(callerOptions))					//if options is Object. . .
		{


			Object.keys(callerOptions).forEach(function(key)
			{
				var value = callerOptions[key];
				if (value === undefined)				//null??
					return;						
				options[key] = getValue(key,value);
			});
		}
		
		if (typeof(key) == 'string')					//single option value specified
		{
			options[key] = getValue(key, optValue);
		}
		else if (EZ.isObject(defaults))					//single option key based on optValue
		{
			var type = EZ.isEl(optValue) ? 'element'	
					 : !isNaN(optValue) ? 'number'	
					 : EZ.getType(optValue).toLowerCase();
			
			key = defaults[type] || defaults[type.toTitleCase()];				
			if (key)
				options[key] = getValue(key, optValue);
		}
	}
	//=================================
	EZ.options.setExcludeKeys(options);
	return options;
	//==================================
}
//__________________________________________________________________________________________________
EZ.options.getDefaults = function(name, key) {
/** {
 *
 *__________________________________________________________________________________________________
}**/
	"use strict";							
	//DATA STRUCTURES {
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	// } . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	var options = EZ.defaultOptions[name] || {};
	if (key)
	{
		options = (key in options) ? options[key]	
				: (options.groups && key in options.groups) ? options.groups[key]	
				: {};
	}
	if (this && this != EZ)
		options = EZ.options.call(this, options);	//see EZ.equals() -- 1st user
	
	return options;
}

//________________________________________________________________________________________
/**
 *	
 */
EZ.options.test = function()
{	
	var msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, , rtnValue];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	//EZ.test.skip(999)		//count to skip 
	//EZ.test.settings({group: 'persistant note'});
	//______________________________________________________________________________________
	var defaultOptions = {
		str: 'str',
		num: 0,
		el: 'el',
		defaults: {String:'str', boolean:'bool', number:'num', Element:'el'}
	}
	var options = EZ.options(defaultOptions);
	
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = ''
	ctx = ""
	arg = ['1st arg'];
	obj = {}
	ex = [arg];
	ex.results = "supplied object variable is null"
	ex.ctx = ctx;
	
	//EZ.test.options( {ex:ex, note:note} )
	
	EZ.test.run('abc', options)
	
	//EZ.test.run('xyz', options )
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	//______________________________________________________________________________
}
/*---------------------------------------------------------------------------------------------
EZ.options.get(key, defaultValue)

return value of option of specified by key.

ARGUMENTS:
	key		(String) specifies options key in dot notation -- 1st string is options

RETURNS:
	Object containing all options or only specified option value.
---------------------------------------------------------------------------------------------*/
EZ.options.get = function ___get(nameKey, defaultValue)
{
	var fullKey = (nameKey || '').trim().split('.');
	var name = fullKey.shift();
	var key = fullKey.join('.');
	
	if (!key)
	{
		if (!name) return {};
		var defaultOpts = 'EZ.defaultOptions.'.concat(name).ov();
		var allOptions = 'EZ.'.concat(name,'.options').ov() || defaultOpts;
		
		if (!defaultOpts)						//if no defaultOpts, use allOptions or
		{										//...EZ.name._options if avail else {}
			if (!allOptions)
				allOptions = '.'.concat(name,'._options').ov(EZ, {});
		}
		else if (allOptions != defaultOpts)		//if defaultOpts defined, add any missing
		{										//...default properties
			Object.keys(defaultOpts).forEach(function(key)
			{
				if (key in allOptions) return;
				allOptions[key] = defaultOpts[key];
			});
		}
		
		if (EZ[name] && EZ[name].options != allOptions) 
		{
			if (EZ[name]._options)	
				EZ.track('EZ.' + name + '.options -- out of sync', EZ[name].options)
			else
				EZ[name].options = allOptions;	//save updated options -- not sure why
		}
		return allOptions;
	}
	var options = EZ.options.get(name);
	return '.'.concat(key).ov(options, defaultValue);
}
/*---------------------------------------------------------------------------------------------
EZ.options_set(nameKey, value)
---------------------------------------------------------------------------------------------*/
EZ.options.set = function ___set(nameKey, value)
{
	var dotName = nameKey.split('.');
	var name = dotName.shift();
	var options = EZ.options.get(name);		//creates EZ.name.options from default if needed
	 
	var valueKey = dotName.pop();			//last key
	var valueObj = (dotName.length === 0) 	//drill down if not topLevel option
				 ? options : '.'.concat(dotName.join('.'),'=').ov(options,{});
	if (valueObj instanceof Object)
		return valueObj[valueKey] = value;
	else 
	{
		EZ.$$$ = {
			message: 'EZ.' + name + '.options: not found -- IGNORED: '
				   + 'EZ.options.set(' + nameKey + '=' + value,
			stack: EZ.getStackTrace().slice(1)
		}
	}
}
/*--------------------------------------------------------------------------------------------------
set options.excludedKeys from options.exclude/include/ignore -- all properties left as-is including 
exclude/include/ignore -- backward compatibility for caller's caller e.g. EZ.options()
--------------------------------------------------------------------------------------------------*/
EZ.options.setExcludeKeys = function ___setExcludeKeys(options)
{
	if (!/(exclude|include|ignore)/.test(Object.keys(options)))
		delete options.excludedKeys;
	else
	{
		options.exclude = EZ.toArray(options.exclude, ', ');
		options.include = EZ.toArray(options.include, ', ');
		options.ignore = EZ.toArray(options.ignore, ', ');

		var lists = { 									//create excludedKeys lists
			exclude:{dot:[], not:[]},
			include:{dot:[], not:[]},
			ignore:{dot:[], not:[]}
		};
		Object.keys(lists).forEach(function(listName)	//for each list...
		{												//...sort into keys with dot or not
			if (!options[listName]) return;
			options[listName].forEach(function(key)
			{
				(key.includes('.')) ? lists[listName].dot.push(key)
									: lists[listName].not.push(key);
			});
		});

		var excludedKeys = options.excludedKeys = {dot:[], not:[]};
		['dot', 'not'].forEach(function(type)			//for dot and not exclude list
		{												//...append ignore
			var list = lists.exclude[type].concat(lists.ignore[type]);
			list.forEach(function(key)
			{											//skip key if in include list and not ignore list
				if (lists.include[type].includes(key) && !lists.ignore[type].includes(key))
					return;

				(type == 'not') ? excludedKeys.not.push(key)
								: excludedKeys.dot.push(key.substr(1).split('.'))
			});
			options.excludedKeys[type] = excludedKeys[type].removeDups();
		});

		if (!options.excludedKeys.not.length && !options.excludedKeys.dot.length)
			delete options.excludedKeys;
	}
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.options.defaultFormatOptions  = function ___defaultFormatOptions()
{
	return EZ.defaultFormatOptions;
}
/*--------------------------------------------------------------------------------------------------
EZ.options.defaultValues(defaultOptions) -- idea for validating options

Only called by EZ.options(non-legacy) if defaultOptions argument is EZ.options.defaultValues Object
but there are no new EZ.options.defaultValues() calls.
------------------------------------	
EZ.sortPlus() for example arguments:
------------------------------------	
	var defaultValues = EZ.options.defaultValues({		//TODO:
		sortOrder:['asc=true', 'desc=false'], 			//asc has precedence over desc
		sortType: ['strings=false', 'numbers=false'],	//strings has precedence over number
		sortCase: 'true, false, lowercase, uppercase',
		removeDups: 'false, true, case',
		native: 'false, true'							//EZ test assistant option
	});

TODO: 
	probably not complete -- just some scratch code -- no constructor calls as of 02-15-2017
                                                                                                                                                                                         
--------------------------------------------------------------------------------------------------*/
EZ.options.defaultValues = function EZoptions_defaults(defaultOptions)
{
	if ( !(this instanceof arguments.callee) ) 			//if not called as constructor...
	{	
		var options = new EZ.options();
		options.optionValues = {};
		options.defaultValues = {};
		options.getValue = function(key, value)	
		{	
			var rules = options[key].optionValues[key]
			if (rules)
			{
				var values = EZ.toArray(defaultOptions[key], ', ');
				e = values
			}
			else return value;
		}
	}
	
	Object.keys(defaultOptions).forEach(function(key)
	{
		this[key] = defaultOptions[key];
	});
}
/*--------------------------------------------------------------------------------------------------
EZ.options.load(selectors, [group|filename|url] [,values)			legacy name: EZ.loadOptions()		

load values for all elements with specified selector(s) from specified group:
	
	filename		if group contains: "/:" assume url or file DWfile.read() handles either
	localStorage
	DW preferences	
--------------------------------------------------------------------------------------------------*/
EZ.options.load = EZ.loadOptions = function ___loadOptions(selectors,group)
{
	var valuesObj = EZ.ls.get(group);
	EZ.options.fault = EZ.ls.fault || '';
	
	group = group ? group + '.' : '';
	
	var opts = valuesObj || {};
	var tags = EZ(selectors, true);
	[].forEach.call(tags, function(tag)
	{
		var key = tag.name || tag.id;
		var value = (valuesObj instanceof Object) ? valuesObj[key] 
												  : EZ.ls.get(group + key)
		if (value != null)
			EZ.set(tag, value);
		else
		{
			value = EZ.get(tag);	//update opts to value if defined
			opts[key] = value !== '' ? value : opts[key] 
		}
	});
	return opts;
}
/*--------------------------------------------------------------------------------------------------
EZ.options.remove( [ group | filename | url ] )
--------------------------------------------------------------------------------------------------*/
EZ.options.remove = function EZoptions_remove(group)
{
	EZ.ls.remove(group);	
	EZ.options.fault = EZ.ls.fault || '';
	return !EZ.options.fault
}
/*--------------------------------------------------------------------------------------------------
EZ.options.save(selectors, [group|filename|url] [,opts)				legacy names: EZ.saveOptions()		
																				  EZ.updateOptions()
save values for all elements with specified selector(s) to:
	
	filename		contains: "/:" assume url or file DWfile.read() handles either
	localStorage
	DW preferences	TODO: this intellegence belongs in EZ.ls not here
--------------------------------------------------------------------------------------------------*/
EZ.options.save = EZ.saveOptions = function ___saveOptions(selectors, group, currentOptions)
{
	group = group ? group + '.' : '';
	var name = typeof(currentOptions) == 'string' ? currentOptions : '';
	var options = EZ.get( EZ.toArray(selectors) ).valueMap;
	
	/* updated get has better logic
	var options = (name) ? currentOptions.ov() 
				: (currentOptions instanceof Object) ? currentOptions
				: {};
	options = options || {};
	
	var tags = EZ(selectors, true);
	var processed = [];
	[].forEach.call(tags, function(tag)
	{
		var key = tag.name || tag.id;
		if (!key || processed.indexOf(key) != -1) return;
		processed.push(key);
		
		var value = EZ.get([key]);	//html value
		options[key] = value;
	});
	delete options.fault;
	*/
	
	delete options[''];
	[].sortPlus.call(options);
	
	EZ.ls.set(group, options, name);
	EZ.options.fault = EZ.ls.fault || '';
	return options;
}
/*--------------------------------------------------------------------------------------------------
EZ.options.getValues(selectors)
--------------------------------------------------------------------------------------------------*/
EZ.options.getValues = function ___getValues(selectors)
{
	var opts = {};
	var tags = EZ(selectors, true);
	var processed = [];
	[].forEach.call(tags, function(tag)
	{
		var key = tag.name || tag.id;
		if (!key || processed.indexOf(key) != -1) return;
		processed.push(key);
		
		var value = EZ.get([key]).valueList;	//html value
		opts[key] = value;
	});
	return opts;
}
//. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
})()//...end of EZoptions
//__________________________________________________________________________________________________
EZ.dotName = (function _____EZdotName_____() {
/*{-------------------------------------------------------------------------------------------------
. . .
------------------------------------------------------------------------------------------------}*/
	var ctx, options, data, CLASS, CLASS_ID = 0;
	var defaultOptions = function(q)
	{
		var opts = {
			quote: q || '',
			include: [],
			exclude: [],
			ignore: [],
			excludedList: true,		//=false no list, ="top" embedded excluded keys not listed
			name: 'EZ.dotName.options'
		}
		//if (options)				//apply global class defaults
		//	EZ.sync(opts, options, '@+');
		return CLASS._options = opts;
	}

	var defaultData = function(key)
	{
		key = key || '';
		data = {
			id: ++CLASS_ID,
			dotName: [key],
			dotNameClean: [key],
			excludedKeys: {			//populated by resetOptions()
				dot: [],
				not: []
			},
			lists: {				//populated by pop()
				excluded: []
			},
			pending: [],			//populated by getSkipList()
			priorPending: [],
			excludedStack: []
		}
		CLASS._excludedStack = data.excludedStack;
		return CLASS._data = data;
	}

	var defaultPending = function(depth, keys, keepList, priorPending)
	{
		var skipList = keys.remove(keepList);
		var pending = {
			depth: depth,
			count: keys.length,
			keys: keys,
			keepList: keepList,
			skipList: skipList,
			skipCount: skipList.length,
			eq: true,
			notEqKey: undefined,
			priorPending: priorPending
		}
		return CLASS._pending = pending;
	}
	/**_________________________________________________________________________________________________
	 *
	 *__________________________________________________________________________________________________
	**/
	var ___ = function EZdotName(key, q)
	{
		if (this instanceof arguments.callee)
		{
			if (!CLASS) return this;			//called by _init()	when script 1st loads

			ctx = _init.call(this);				//add or bind CLASS functions
			//ctx = EZ.class.call(this, CLASS);		//add or bind CLASS functions

			if (key instanceof CLASS)			//clone call, clone dotName and dotNameClean
			{									//...use all other existing properties
				data = this._data = {};
				for (var k in key._data)
					data[k] = (k.startsWith('dotName')) ? key._data[k].slice() : key._data[k];
				options = data.options = data._options;
			}
			else
			{
				data = this._data = defaultData(key);
				options = data.options = data._options = defaultOptions(q);
			}
		}
		else ctx = key;							//ctx avail to internal	non-instance functions

		data = CLASS._data = ctx._data;			//update global data closure variable avail to all functions

		CLASS._options = data._options;			//read only debugger convenience
		CLASS._dotName = data.dotName;
		CLASS._dotNameClean = data.dotNameClean;
		return ctx;
	}
	//______________________________________________________________________________________________
	/**
	 *	Creates global CLASS Object (pseudo class) -- valid as constructor for new Objects.
	 *	Subsequently called to bind CLASS functions to any new Object instance.
	 */
	var _init = function _init()
	{
		if (!CLASS)
		{
			CLASS = ___;
			options = CLASS.options = CLASS.___options = defaultOptions();
			var fn = new ___();
			for (var p in fn) ___[p] = fn[p];

			/*
			EZ.event.add(window, 'onload', function()	//initialization requiring DOM
			{
			});
			*/
			//===============
			return CLASS;
			//===============
		}
		for (var fn in CLASS)							//for all non-prototype CLASS functions . . .
		{
			if (typeof(CLASS[fn]) != 'function') continue;

			this[fn] = CLASS[fn].bind(this);			//bind CLASS fn to new Object instance
			for (var k in CLASS[fn])					//...and copy CLASS fn properties ??
				if ( !(k in this[fn]) ) 				//...including un-bound functions ??
					this[fn][k] = CLASS[fn][k];
		}
		return this;
 	}
	//______________________________________________________________________________________________
	/**
	 *


	**/
	___.toString = function(key)
	{
		if (!CLASS)
			return 'no ' + CLASS.name + ' Object created'

		var value;// = ['...'].concat(CLASS._dotName);
		if (this instanceof CLASS)
		{
			CLASS._dotName = data.dotName;
			value = (!key) ? data.dotName
				  : data.dotName.concat(_format(key, '') )
		}
		return value.join('');
	}
	//______________________________________________________________________________________________
	/**
	 *	returns instance data Object -OR- if key supplied, existing data Object property if defined
	 *	otherwise defaultValue if specified (or if not {}) -- but does not create new data proprty.
	 *
	 *	EXAMPLES:
	 *		getData('myKey', []) returns existing data property or new Array if undefined.
	 *		getData('myObj') OR getData('myObj', {}) returns new Object if data.myObj not defined.
	**/
	___.getData = function(key, defaultValue)
	{
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
	//______________________________________________________________________________________________
	/**
	 *
	**/
	___.addListItem = function(name, value, dotName)
	{
		switch (arguments.length)
		{
			case 2:
			{
				var data = this.getData();
				data.lists = data.lists = (data.lists || {})
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
	___.getLists = function()
	{
		return this.getData('lists')
	}
	___.haveList = function(name)
	{
		var data = this.getData();
		var lists = data.lists || {};
		return Boolean(lists[name]);
	}
	___.getList = function(name)
	{
		var list = this.getData('lists')[name];
		return (!list) ? []
			 : (list instanceof Array) ? list
			 : EZ.stringify(list);
	}
	//______________________________________________________________________________________________
	/**
	 *
	**/
	___.setOptions = function ___setOptions(opts)
	{
		___(this);
		var opts = EZ.options.call(opts);
		opts.exclude = EZ.toArray(opts.exclude, ', ');
		opts.include = EZ.toArray(opts.include, ', ');
		opts.ignore = EZ.toArray(opts.ignore, ', ');
		opts.sync = EZ.sync(opts, options, '@+^EZ.options');
		options = this._data.options = this._data._options = opts;
		data = this._data;

		var lists = {
			exclude:{dot:[], not:[]},
			include:{dot:[], not:[]},
			ignore:{dot:[], not:[]}
		};
		Object.keys(lists).forEach(function(listName)	//for each list...
		{												//...sort into keys with dot or not
			opts[listName].forEach(function(key)
			{
				(key.includes('.')) ? lists[listName].dot.push(key)
									: lists[listName].not.push(key);
			});
		});
		var excludedKeys = {dot:[], not:[]};
		['dot', 'not'].forEach(function(type)			//for dot and not exclude list
		{												//...append ignore
			var list = lists.exclude[type].concat(lists.ignore[type]);
			list.forEach(function(key)
			{											//skip key if in include list and not ignore list
				if (lists.include[type].includes(key) && !lists.ignore[type].includes(key))
					return;

				(type == 'not') ? excludedKeys.not.push(key)
								: excludedKeys.dot.push(key.substr(1).split('.'))
			});
		});
		data.excludedKeys = {};
		data.excludedKeys.not = excludedKeys.not.removeDups();
		data.excludedKeys.dot = excludedKeys.dot.removeDups();
		if (!data.excludedKeys.not.length && !data.excludedKeys.dot.length)
			delete data.excludedKeys;
	}
	//______________________________________________________________________________________________
	/**
	 *
	**/
	___.concat = function ___concat(keys, q)
	{
		___(this);
		var clone = new EZ.dotName(this, q)
		keys.forEach(function(key)
		{
			clone.push(key);
		});
		return clone;
	}
	//______________________________________________________________________________________________
	/**
	 *
	**/
	___.push = function ___push(key, obj)
	{
		___(this);

		data.dotName.push(_format(key, options.quote));
		data.dotNameClean.push(key);

		if (!this.isExcluded(key,obj))					//if not excluded
			return '';

		var dotName = this.toString();
		data.excludedStack.unshift(dotName);
		return dotName;
	}
	//______________________________________________________________________________________________
	/**
	 *	log all not equal excluded keys -or- just parent (not nested)
	**/
	___.pop = function ___pop(eq)
	{
		___(this);
		var di = _getPending();

		var key = data.dotNameClean.pop();
		var displayKey = data.dotName.pop();
		[displayKey]
		//===========================================================================================
		while (di)									//if excludes
		{
			if (--di.count === 0)
				_removePending();					//no more keys
			if (di.skipCount === 0)
				break;								//no excludes at this depth

			var excl = di.skipList.includes(key);
			if (!excl)
				break;

			if (options.excludedList == 'all' || !di.priorPending)
			{										//not processing excluded key at lower depth
				if (!eq && excl)					//...or logging all not eq excluded keys
					this.addListItem('excluded', this.toString(key))

				//di.eq = di.eq && eq;
				//if (di.count)						//keep going if more keys
					return true;

				//return di.eq;
			}
			if (!eq && excl && !di.notEqKey)		//remember 1st not eq key
				di.notEqKey = key;

			if (di.count)							//more keys
				return true;

			if (!di.notEqkey)
				break;
													//log if not processing excluded at lowerlevel
			this.addListItem('excluded', di.notEqkey)
			return false;
		}
		//===========================================================================================
		return eq;									//return equal results for this key
	}
	//______________________________________________________________________________________________
	/**
	 *
	**/
	___.isExcluded = function ___isExcluded(key, x, y)
	{
		___(this);
		var keepList = [key];
		var di = _getPending();
		if (di)
			keepList = di.keepList;

		else if (x instanceof Object)
			keepList = this.getSkipList(x,y);

		return !keepList.includes(key);
	}
	//______________________________________________________________________________________________
	/**
	 *	return non-excluded list of keys -- populates data.pending for current depth
	**/
	___.getSkipList = function ___getSkipList(x, y)
	{
		___(this);
		var keys = Object.keys(x);
		if (y instanceof Object)
			keys = keys.concat(Object.keys(y)).removeDups();
		if (keys.length === 0)
			return;
		var keepList = keys.slice();

		var excludedKeys = data.excludedKeys;
		if (excludedKeys)
		{
			var removeList = excludedKeys.not.slice();
			excludedKeys.dot.forEach(function(key)
			{
				var dotNameObj = data.dotNameClean.slice(1, key.length).join('.');
				if (dotNameObj != key.slice(0,-1).join('.'))
					return;

				removeList.push( key.slice(-1)[0] );
			});

			keepList = keys.remove(removeList)

			keys.forEach(function(key)							//property excluded by type
			{
				if ( excludedKeys.not.includes( typeof(x[key]) )
				|| excludedKeys.not.includes( EZ.getType(x[key]) )
				|| (x[key] instanceof Object && excludedKeys.not.includes( x[key].constructor.name )))
					keepList = keepList.remove(key);

				if (y instanceof Object)
				{
					if ( excludedKeys.not.includes( typeof(y[key]) )
					|| excludedKeys.not.includes( EZ.getType(y[key]) )
					|| (y[key] instanceof Object && excludedKeys.not.includes( y[key].constructor.name )))
						keepList = keepList.remove(key);
				}
			});
		}
		_addPending(keys, keepList);
		return keepList;
	}
	//______________________________________________________________________________________________
	/**
	 *
	**/
	var _addPending = function(keys, keepList)
	{
		var depth = data.dotName.length;
		var di = data.pending[0];

		var di = defaultPending(depth, keys, keepList, data.priorPending.length);
		data.pending.unshift(di);
		if (di.skipCount)
			data.priorPending.unshift(depth);
	}
	//______________________________________________________________________________________________
	/**
	 *
	**/
	var _removePending = function()
	{
		var di = data.pending.shift();
		if (di.skipCount)
			data.priorPending.shift();
	}
	//______________________________________________________________________________________________
	/**
	 *
	**/
	var _getPending = function()
	{
		var depth = data.dotName.length - 1;
		var di = data.pending[0];
		if (!di || di.depth != depth)
			return '';

		return di;
	}
	/**
	 *
	**/
	function _format(key, q)
	{
		var fmt = (!isNaN(key)) 				  ? '[' + key + ']'
				: (/^[A-Z_$][\w_$]*$/i.test(key)) ? '.' + key
				: key.wrap("["+q, q + "]");
		return fmt;
	}
	//==================================================================================================
	return _init();									//create and return global "static" Object
})();
//__________________________________________________________________________________________________
EZ.common = (function __________EZcommon__________() {
/** {
EZ.common()																				pseudo class

ARGUMENTS:
	caller		...
	options		(optional) Object containing one or more of the following properties:
				skipCount	number of function to remove from top of stack
	data
	callback

RETURNS:
	EZgroup Object for class or new() instance of specified pseudo class Object.

TODO:
. . .
--------------------------------------------------------------------------------------------------
}*/
	"use strict";
	var __ = {}, ___ = function _____global_variables_____(){};
	//==============================================================================================
	/**
	 *	EZcommon() and global Object common class initializer
	**/
	(function _____EZcommon_constructor_____() {
	//==============================================================================================
	___ = function EZcommon(caller, options, data, callback)							
	{
		if (this && this instanceof ___)
			return this;
		var ctx = this;
		if ( !(this instanceof caller) || ___ == caller)	//initialize pseudo class as its script
			ctx = __.setupClass(caller);					//...loads: e.g. EZcommon or EZdataFile
		else
			__.setupMeta.call(ctx, caller);
															//class default options or specific
		options = __.setupOptions.call(ctx, options);					//...options for class instance
		
		__.setupData.call(ctx, options, data);				//class or instance initial data
														
		if (callback)										//initialization after DOM loaded
			window.addEventListener('load', callback, false);
		
//		if (caller.name == 'EZlog')
//			return new caller();
	}
	})();	//end of constructor
	//==============================================================================================
	___.DATA = {
	_: function _____DATA_functions_____(){},
	//______________________________________________________________________________________________
	getData: function ___getData(key, defaultValue) {
	/*{
	 *	returns instance data Object -OR- if key supplied, existing data Object property if defined
	 *	otherwise defaultValue if specified (or if not {}) -- but does not create new data proprty.
	 *
	 *	EXAMPLES:
	 *		getData('myKey', []) returns existing data property or new Array if undefined.
	 *		getData('myObj') OR getData('myObj', {}) returns new Object if data.myObj not defined.
	 *__________________________________________________________________________________________
	}*/
		var value = this._data || {};
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
	},
	//______________________________________________________________________________________________
	setData: function ___setData(updatedData, name, note) {
	/*{
	 *	updates existing bound data Object by removing all keys then adding from supplied data
	 *__________________________________________________________________________________________
	}*/
		var data = ___.getData.call(this);			//this.getData() not always avail

		note = note || 'set';
		/*
		var debug = ''
		if (data)
		{
			debug = data["~debug"] || '';
			Object.keys(data).forEach(function(key) { delete data[key] });
		}
		*/
		//var cid = this["~cid"] || '';
		//var name = name || (__.getClass(cid) || {}).name || '';
		//debugger;
		
		var cid = this['~cid'];
		var name = this['~class'];
		
		EZ.sync(data, updatedData, '@^' + name + '.data', 1);
		//log.add.call(this, 'sync', sync);

		data['~cid'] = cid;							//constructor reference
		data["~class"] = name + '.data';
		data["~note"] = note + ' @ ' + EZ.format.time('ms');
		/*
		var debugKeys = (data["~debug"] || debug).split(/\s/);
		for (var key in EZ.toArray(debugKeys)) 		//update debugger convenience values
		{
			var _key = '_' + key;
			if (data[key])
				this[_key] = data[key];
		}
		*/
		return data;
	},
	//______________________________________________________________________________________________
	getOptions: function ___getOptions(key, defaultValue) {
	/*{
	 *
	}*/
		var data = this.getData(key, defaultValue);
		return data.options;
	},
	//______________________________________________________________________________________________
	getFunctionNames: function _getFunctionNames() {
	/*{
	 *
	}*/
		return '.~fnList'.ov(this, []).slice();
	},
	//______________________________________________________________________________________________
	getTag: function _getTag(name) {
	/*{
	 *
	}*/
		if (name == window || name == document.body) 
			name = '';
		
		var options = this.getOptions();
		if (!name || !options) return;
		options.tags = options.tags || {};

		var el = options.tags[name];
		if (el instanceof Element)
			return el;

		return options.tags[name] = EZ(el || name, null);
	},
	//______________________________________________________________________________________________
	setTag: function _setTag(name, value) {
	/*{
	 *
	}*/
		var tag = this.getTag(name);
		if (!tag) return;
		return EZ.set(tag, value || '');
	},
	//______________________________________________________________________________________________
	"~":""
	};//...end of data functions
	//==============================================================================================
	__ = {
	_: function _____INTERNAL_functions_____(){},
	//______________________________________________________________________________________________
	getClass: function (cid) {
	/*{
	 *
	}*/
		return ___.CIDS[cid];
	},
	//______________________________________________________________________________________________
	getClassId: function (caller) {
	/*{
	 *
	}*/
		return ___.CLASS_LIST.indexOf(caller);
	},
	//______________________________________________________________________________________________
	setupClass: function(caller) {
	/*{
	 *	Does not create new instance of caller class (if EZ.common or nothistorically done to get 
	 *	prototype functions -- now just copies them from prototype Object plus more.
	 *	eliminates need to add code to constructor to test if class being initialized (HUGE)
	 *
	 *	
	}*/
		var cid = ___.CLASS_LIST.push(caller) - 1;
		___.CIDS[cid] = caller;
		
		for (var p in ___.DATA)						//always copy EZ.common.DATA to EZ.common
			if (!/[(_|~)]/.test(p) && !___[p])		//...in case new fn/properties added
				___[p] = ___.DATA[p];

		for (p in ___.DATA)							//copy EZ.common.DATA to caller.* 
			if (!/[(_|~)]/.test(p) && !caller[p])	//TODO: only if global data ??
				caller[p] = ___.DATA[p];
	
		//var isSingleton = (new caller() == null);
		//if (!isSingleton)							//if not singleton...
		//else caller["~singleton"] = true;
		{										
			for (p in caller)						//copy caller.DATA to caller.prototype				
				if (!caller.prototype[p])		
					caller.prototype[p] = caller[p];
			
			for (p in ___.DATA)						//and EZ.common.DATA if not defined
				if (!caller.prototype[p])			
					caller.prototype[p] = ___.DATA[p];
		
			delete caller.prototype._;
			delete caller.prototype["~"];
		}
			
		caller["~cid"] = cid;
		caller["~class"] = caller.name;
		
		caller["~fnList"] =	_getFunctions(caller);		
		//caller["~nextseq"] = 0;
		//=============
		return caller;
		//=============
		//_________________________________________________________________________
		function _getFunctions(fn, dotName, fnList) {
		/*{
		 *	get copy of all caller functions and names
		 *	return list of all embedded common caller function names and functions 
		}*/
			if (!dotName)
			{
				fnList = [];
				if (fn.name)
					fnList.push(fn.name)
				if (fn.displayName)
					fnList.push(fn.displayName);

				fnList.unbound = {};
				dotName = [fn.name];
				_getFunctions(fn, dotName, fnList);
				dotName = [fn.name];
				_getFunctions(fn.prototype, dotName, fnList);
				return fnList;
			}
			for (var p in fn)
			{
				if (/(^$|^~|^([$_]|CLASS_LIST|CIDS|options|_options|_data)$)/.test(p)) continue;
				
				if (typeof(fn[p]) == 'function') 
				{
					fn["~class"] = dotName[0];
	fn["~dotName"] = dotName.concat(p).join('.');
					if (!fnList.unbound[p])
						fnList.unbound[p] = fn[p];
					var name = fn[p].name || p;
					if (name && !fnList.includes(name))
						fnList.push(name);
				}
				if (fn[p] instanceof Object)
					_getFunctions(fn[p], dotName.concat(p), fnList);
			}
			return fnList;
		}
	},
	//____________________________________________________________________________________________
	setupMeta: function __setupMeta(caller) {
	/*{
	 *
	}*/
		for (var p in caller)
			if (p.startsWith('~'))
				this[p] = caller[p];
	},
	//____________________________________________________________________________________________
	setupOptions: function(options) {													
	/*{
	 *
	}*/
		this["~options initial"] = options;
		try
		{
			if (typeof(options) == 'function')
				options = options();
		}
		catch (e)
		{
			EZ.oops('trouble initializing options for: ' + this["~class"], e);
			EZ.oops(e);
			options = {};
		}
		this.options = this._options = EZ.options.call(EZ.defaultFormatOptions, options);
		
		this.options["~class"] = this["~name"];
		this.options["~cid"] = this["~cid"];
		
		/*
		var defaultOpts = EZ.options.call(___.options);								  
		gdata.sync = commonObj.sync = EZ.sync(caller.options, defaultOpts, '@+');
		*/
		return this.options;
	},
	//____________________________________________________________________________________________
	setupData: function(options, data) {													
	/*{
	 *
	}*/
		try
		{			
			if (typeof(data) == 'function')		//data is function
				data = data();
			else if (data instanceof Object && typeof(data.getData) == 'function')
				data = data.getData();			//data is Object with getData() function
			else if (!data)
				data = {};						//no initial data
		}
		catch (e)
		{
			EZ.oops('trouble initializing data for: ' + this["~className"], e);
			data = {};
		}

		if (!this._data)
			this._data = this.data = data;
		
		if (!this._data.options)
			this._data.options = options || {};
		
		var cid = this['~cid'];
		if (data || data['~cid'] != cid)
			___.setData.call(this, data);
	},
	//______________________________________________________________________________________________
	bindFunctions: function bindFunctions(caller, data) {					
	/*{
	 *	bind functions to new Object -- NO LONGER USED as of 02-27-2017
	 *	not needed if only binding instance "this"
	 *______________________________________________________________________________________________
	}*/
		var obj = this;
		var functions = caller;
		if (functions["~fnList"])
			functions = functions["~fnList"].unbound;
			
		if (!data && typeof(functions.$data) == 'function')
			data = functions.$data();
		
		for (var fn in functions)						
		{
			if (fn == '$data') continue;
			
			if (typeof(functions[fn]) == 'function') 		//for functions
			{
				obj[fn] = (!data) ? functions[fn].bind(obj)
								   : functions[fn].bind(obj, data)
									   
				__.bindFunctions.call(obj, functions[fn], data);
			}
			else if ( !(fn in obj) )						//for other properties
				obj[fn] = functions[fn]; 
		}
	},
	//______________________________________________________________________________________________
	"~":""
	}//...end of internal functions
	//==============================================================================================
	___.CLASS_LIST = [];
	___.CIDS= []
	___(___);
	return ___;
})();//...end of EZ.common
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/


