/*global EZ, EZ$:true, e:true, g, dw, DWfile, unescape */
/*global EZgetPref, EZgetEl, EZgetValue, EZsetValue, EZnone  */


/*global t_doc, t_html, t_head, t_title, t_body, t_wrap, t_labels, t_inputs */
/*global t_forms, t_fm,  t_none, t_tags, t_array, t_divs, t_radios, t_radio01 */
/*global t_label_some, t_mixed, t_idandclass */


var e;
(function jshint_globals_not_used() {	//list global variables and functions defined but not used
if (typeof(window) != 'undefined') window.dw = {isNotDW: true}
e = [
	e, g, DWfile, EZgetPref, EZgetTagValue, unescape,
	
	t_doc, t_html, t_head, t_title, t_body, t_wrap, t_labels, t_inputs,
	t_forms, t_fm,  t_none, t_tags, t_array, t_divs, t_radios, t_radio01,
	t_label_some, t_mixed, t_idandclass 
	
]})
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
void(0);	//debugger breakpoint
			//NOTE: Chrome seems to load below script before executing this statement ??
			//		Does this mean functions can be referenced before they are defined
			//		as IE has always allowed but not historically allowed by Mozilla ??
/*--------------------------------------------------------------------------------------------------
EZ(el,options) -- primary EZ Object defined as Function

returns single element or Array of elements if el is Array of selectors.

TODO:
	when called as tag handler e.g. onclick="EZ(...)" -- tag passed as this if tag has EZ() bind.
--------------------------------------------------------------------------------------------------*/
function EZ(el, options)
{
	/* jshint: doc only */   e = [el, options];
	var args = [].slice.call(arguments).concat([ {defaults:{legacy:false}} ]);
	return EZgetEl.apply(this, args);
	//return EZ.getEl(el, options === false);	//from unit test
}
/*--------------------------------------------------------------------------------------------------
EZ variants -- stubs to EZgetEl(...)
--------------------------------------------------------------------------------------------------*/
/**
 *	EZ$: return all elements matching all selector(s)
 */
EZ$ = function EZ$()
{
	var args = [].slice.call(arguments).concat([ {defaults:{all:true}} ]);
	return EZgetEl.apply(this, args);
}
EZ.$ = EZ$;
/**
 *	EZ_: return single element even if selector is Array.
 *	TODO: depricate to eliminate clutter
 */
EZ._ = function EZ_()
{
	var args = ([].slice.call(arguments)).concat([ {defaults:{all:false}} ]);
	return EZgetEl.apply(this, args);
}
/**
 *	EZ.nul: return all elements matching selector(s) or null
 */
EZ.nul = function EZnul()
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
//_____________________________________________________________________________________________
/**
 *	unit test stubs -- redefined when EZunit_tests.html loaded
 */
EZ.test.data = {};			//???
EZ.test.running = 'no capture';
EZ.test.capture = function EZtestCapture() {return false}
EZ.test.capture.mode = false;
EZ.test.debug = function EZtestDebug() {return false}
EZ.test.run = function EZtestRun() {return false}
/**
 *	capture stubs -- redefined when 
 */
EZ.capture = function() {return false}

/**
 *
 */
EZ.cookie = {
	get:function EZcookieGet() {return ''},
	set:function EZcookieSet() {return ''}
}
//EZ.cookie = function EZcookie() {};
/**
 *
 */
EZ.css = function EZcss()
{
    if (!EZ.getStyle) return '';
	return EZ.getStyle.apply(this,[].slice.call(arguments));
}
/**
 *
 */
EZ.options = function EZoptions()
{
}
/**
 *	Stubs for functions with full script in other files
 */
EZ.date = function EZdate_stub() { return new Date([].slice.call(arguments)) }
EZ.json = {};
EZ.event = {};
EZ.util = {};
EZ.trace = function EZtrace_stub() {return 'EZtrace.js not loaded'}
EZ.toString = function EZtrace_stub() {return 'EZtoString.js not loaded'}
EZ.getPref = function EZgetPref(key, defaultValue) {return defaultValue};

EZ.parse = function() {return JSON.parse.apply(this, [].slice(arguments))}
/*--------------------------------------------------------------------------------------------------
return simple json for: null, undefined, boolean, number, RegExp or blank;
otherwise call EZ.json.stringify() if loaded -OR- JSON.stringify() if not.
--------------------------------------------------------------------------------------------------*/
EZ.stringify = function EZstringify(value, replacer, spaces) 
{
	var isEZjsonLoaded = EZ.json && !EZ.test.running.includes('EZstringify');
	switch (EZ.getType(value))
	{
		case 'Null': 		
		case 'Undefined': 
		case 'Boolean': 
		case 'NaN': 
		case 'Number': return '"' + value + '"';
		case 'RegExp':	
		{								//TODO: EZ.json.stringify() when fully supports
			return '"' + value + '"';
		}
		case 'String':
		{
			if (!value) return '""';
		}
	}
	try
	{
		var isEZjsonLoaded = EZ.json && !EZ.test.running.includes('EZstringify');
		if (isEZjsonLoaded) 			//call EZ.json.stringify when available
			return EZ.json.stringify(value, replacer, spaces);
			
		if (arguments.length == 2 && !(replacer instanceof Object))
		{								//if replacer not Object, assume its spaces argument
			spaces = replacer;
			replacer = null;
		}
		return (!EZ.isObjectCircular(value)) ? JSON.stringify(value, replacer, spaces)
			 : '{"": "EZ.stringify() failed -- Circular Object]"}';
	}
	catch (e)
	{
		EZ.techSupport(e, this);
		return e.message;
	}
}
//________________________________________________________________________________________
EZ.stringify.test = function()
{	
	var msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, , rtnValue];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	//______________________________________________________________________________________
	var group = 'simple json does not call EZ.json.stringify(): ';
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	EZ.test.settings( {group: group} );
	EZ.test.run(			{EZ: {note:'no arg'		}})
	EZ.test.run(undefined,	{EZ: {note:'undefined'	}})
	EZ.test.run(null	 ,	{EZ: {note:'null'		}})
	
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
	EZ.test.run(NaN		,{EZ: {note:'NaN'		}})
	
	//______________________________________________________________________________
	EZ.test.settings( {group: group + 'Date'} );
	
	//new Date(year, month, day, hours, minutes, seconds, milliseconds);
	arg = new Date('06/13/2016 12:00 GMT')
	EZ.test.run(arg)
	EZ.test.run(new Date('')	,{EZ: {note:'invalid'	}})
	EZ.test.run(new Date(null)	,{EZ: {note:'null'		}})
	
	//______________________________________________________________________________
	EZ.test.settings( {group: group + 'RegExp'} );
	EZ.test.run(/abc/)
	EZ.test.run(/abc/gim)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	arg = RegExp("xyz", "gim")
	arg.lastIndex = 1;
	EZ.test.run(arg				,{EZ: {note:'lastIndex=1'	}})
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	arg.lastIndex = 9;
	EZ.test.run(arg				,{EZ: {note:'lastIndex=9 / too big'	}})
	
	//______________________________________________________________________________
	EZ.test.settings( {group: group + 'String'} );
	EZ.test.run(''		,{EZ: {note:'blank'	}})
	EZ.test.run('embedded "me" double quotes')
	EZ.test.run("embedded 'me' single quotes")
	EZ.test.run('multi-line \n line 2')
	
	//______________________________________________________________________________
	EZ.test.settings( {group: group + 'Object'} );
	obj = { n:0, str:'abc', a:[1,2,3] };
	EZ.test.run(obj, 4)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	o = {a:1}
	obj = {o:o}
	obj.circular = obj;
	EZ.test.run(obj, 4			,{EZ: {note:'circular'	}})
	
	//______________________________________________________________________________
	EZ.test.settings( {group: group + 'test args'} );
	obj = { n:0, str:'abc', a:[1,2,3] };
	EZ.test.run(obj, 4			,{EZ: {note:'spaces=4 1st arg'	}})
	EZ.test.run(obj, null, 4	,{EZ: {note:'spaces=4 2nd arg'	}})
	EZ.test.run(obj, ['str']	,{EZ: {note:'extract str - no spaces'	}})
	EZ.test.run(obj, ['str'], 4	,{EZ: {note:'extract str - spaces=4'	}})
	
	//______________________________________________________________________________
	EZ.test.skip(999)	
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
/*----------------------------------------------------------------------------------
EZ.loadOptions(selectors,group)

load values for all elements with specified selector(s) from specified localStorage
group -or- TODO: DW preferences
----------------------------------------------------------------------------------*/
EZ.loadOptions = function EZloadOptions(selectors,group)
{
	//group = group != EZ.undefined ? group.toString().joinPlus('.') : '';
	group = group ? group + '.' : '';
	var tags = EZ(selectors, true);
	[].forEach.call(tags, function(tag)
	{
		var key = tag.name || tag.id;
		var value = dw.isNotDW ? EZ.ls.get(group + key)
							   : EZ.getPref(group.trimPlus('.'),key)
		if (value != EZ.undefined)
			EZ.set(tag, value);
	});
}
/*----------------------------------------------------------------------------------
EZ.saveOptions(selectors,group)

save values of all elements with specified selector(s) from specified localStorage
group -or- TODO: DW preferences
----------------------------------------------------------------------------------*/
EZ.saveOptions = function EZsaveOptions(selectors,group)
{
	group = group ? group + '.' : '';
	var tags = EZ(selectors, true);
	var processed = [];
	[].forEach.call(tags, function(tag)
	{
		var key = tag.name || tag.id;
		if (!key) return;
		if (processed.indexOf(key) != -1) return;
		processed.push(key);
		var value = EZ.get([key]);
		dw.isNotDW ? EZ.ls.set(group + key, value)
				   : EZ.setPref(group.trimPlus('.'), key, value);
	});
}
/*----------------------------------------------------------------------------------
EZ.updateOptions(selectors,group)

update value of all elements with specified selector(s) in specified localStorage

TODO: 06-14-2016: don't see how this is diff from EZ.loadOptions()
----------------------------------------------------------------------------------*/
EZ.updateOptions = function EZupdateOptions(selectors,group)
{
	group = group ? group + '.' : '';
	var tags = EZ(selectors, true);
	var processed = [];
	[].forEach.call(tags, function(tag)
	{
		var key = tag.name || tag.id;
		if (!key) return;
		if (processed.indexOf(key) != -1) return;
		processed.push(key);
		var value = EZ.get([key]);
		dw.isNotDW ? EZ.ls.set(group + key, value)
				   : EZ.setPref(group.trimPlus('.'), key, value);
	});
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
 *	calls EZ.get_basic until and if EZ.getValue loaded
 */
EZ.get = function EZget(el, defaultValue)
{
   return (window.EZgetValue)
   		? EZgetValue.apply(this,[].slice.call(arguments))	//full functionality if loaded
		: EZ.get_basic(el, defaultValue);					//otherwise basic function
}
//__________________________________________________________________________________
/**
 *	calls EZ.set_basic -OR- EZ.setValue if loaded
 */
EZ.set = function EZset(el, value)
{
	return (window.EZsetValue)			//use full functionality if loaded
		 ? EZsetValue.apply(this,EZ.context(this))
		 : EZ.set_basic(el, value);
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
/*--------------------------------------------------------------------------------------------------
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
/**
 *
 */
EZ.oops = function EZoops(e,msg)
{
	/* jshint: doc only */   e = [e,msg];
   	return EZ.techSupport.apply(this,[].slice.call(arguments));
}
EZ.console = function EZconsole(e,msg)
{
   	if ('console.log'.ov())
		console.log({msg:msg||'N/A', exception:e});
	return 	'';
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
		
		if (EZ.show) EZ.show(el);
		return msg;
	}
	//====================================================================================
	var fault = new EZ.fault(e, msg, ctx, options);
	//====================================================================================
	msg = fault.message;	
	if (!msg)
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
		displayStacktrace( EZ.displayCaller(msg) );
	}
	return fault;
}

//_________________________________________________________________________________________________
e = function _____NEW_WORK_IN_PROGRESS_____() {}	//convenience for DW functions list
//_________________________________________________________________________________________________

/*--------------------------------------------------------------------------------------------------
Save fn name, arguments, exception message with stacktrace and time.
Used to create test scripts for exceptions.
--------------------------------------------------------------------------------------------------*/
EZ.fault = function EZfault(error, msg, ctx, options)
{		
	try
	{
		EZ.fault.count = EZ.fault.count || 0;
		EZ.fault.count++;
		
		var caller = arguments.callee.caller;
		var callerName = caller.name;
		if (callerName == 'EZtechSupport')
		{
			caller = caller.arguments.callee.caller;
			callerName = caller ? caller.name : '';
		}
		
		if (msg instanceof Object)					//if msg is ctx argument
		{
			options = ctx;
			ctx = msg;
			msg = '';
		}		
		msg = msg || '';
		if (EZ.test.testno)
			msg += ' testno[' + EZ.test.testno + ']';	
		if (msg.substr(0,1) == '-' && !EZ.test.running.includes(callerName))	
			msg = msg.substr(1);
		this.message = msg;
		
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
	var stack = (original instanceof Error) ? original.stack : '';
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
EZ.createLayer(id,tag)			//DCO 01-15-2016: loosely modeled after EASY.dom.js version

ARGUMENTS:

RETURNS:
	existing or new layer added at end of document if not found

TODO: not tested
--------------------------------------------------------------------------------------------------*/
EZ.createLayer = function EZcreateLayer(id, tag)
{
	var layer = EZ(id);
	if (layer.undefined)
	{
		layer = document.createElement(tag);
		layer.setAttribute('id',id);
		EZ('body').appendChild(layer);
	}
	return layer;
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
Does not call any functions except formatStack() to avoid infinite loops.
---------------------------------------------------------------------------------------------*/
EZ.getStackTrace = function EZgetStackTrace()
{
	try
	{
		undefined.getStackTrace;
	}
	catch(e)
	{
		return e.stack.formatStack({skipCount: 1});
	}
}
/*-----------------------------------------------------------------------------------
//call as follows: EZ.getStyle(el or id, "border-radius");
-----------------------------------------------------------------------------------*/
EZ.getStyle = function EZgetStyle(el, style)
{
	if (typeof(el) != 'object')
		el = document.getElementById(el);

	var value = "";		
	if (window.getComputedStyle)
		value = getComputedStyle(el).getPropertyValue(style);
	
	else if (el.currentStyle)		//IE
	{
		try 
		{
			value = el.currentStyle[style];
		} 
		catch (e) {}
	}
	return value;
}
/*---------------------------------------------------------------------------------------------
return pseudo tagType -- blank if el undefined or not html element
lowercase el.type if button radio checkbox text password or hidden
otherwise lowercase el.tagName (el.type ignored for select-one or select-multiple)
---------------------------------------------------------------------------------------------*/
function EZgetTagType(el)
{
	if (!el || !el.childNodes) return '';

	var tagName = (el.tagName || '').toLowerCase();
	var tagType = (el.type || '').toLowerCase();

	return (/(button|radio|checkbox|text|password|hidden)/i.test(tagType))
		 ? tagType : tagName;
}
/*---------------------------------------------------------------------------------------------
chrome value is 'on' if not specified -- verify by checking outerHTML for value
return empty string if not explicitly specified
---------------------------------------------------------------------------------------------*/
function EZgetTagValue(el)
{
	var value = el.value;
	if (value == 'on' && !/value="(.*?)"/.test(el.outerHTML) )
		value = '';
	return value;
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

	switch (EZgetTagType(el))
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
	switch (EZgetTagType(el))
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
Append parentNode(s) with node(s)
--------------------------------------------------------------------------------------------------*/
EZ.append = function EZappend(parentNodes, nodes)
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
			//if (!EZ.is(node,document.constructor))	//append if not document
				parent.appendChild(node);
		});
	});
	return nodes;
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

	isLegacy ? bindElement(tags) : bindElementAll(tags);
	if (EZ.isArrayLike(tags))
	{
		Array.prototype.forEach.call(tags, function bindTag(tag)
		{
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
		if (tag.EZ != null) return;			//already bound

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
EZ.clone = function EZclone(obj, depth)
{
	if (EZ.test.capture()) {return EZ.test.capture(this)} else if (EZ.test.debug()) debugger;

	if (!obj || 'object function'.indexOf(typeof(obj)) == -1) return obj;

	if (EZ.isEl(obj)) return EZ.cloneNodes(obj);	//html element
	if (EZ.isArray(obj))
	{
		return obj.slice();		//Array
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
//_____________________________________________________________________________________________
EZ.clone.test = function()
{
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
EZ.run.skip(99999);
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
//	var span = document.createElement('span');
	var divObj = {d:div}
//	var bothObj = {d:span, s:span}

	EZ.test.run(divObj, 		{EZ: {ex:{d:div},       	note:''	}})
//	EZ.test.run(bothObj, 		{EZ: {ex:{d:div, s:span},	note:''	}})

	var fn = function cloneTest(a,b) {return a*b}
	EZ.test.run(fn, 		{EZ: {ex:fn,       	note:''	}})
}
/*----------------------------------------------------------------------------------
 *  return clone of object -- top level only unless isDeep is true
 *	TODO: copy logic into EZ.mergeAll() if not already there
----------------------------------------------------------------------------------*/
EZ.clone = function EZclone(obj, isDeep)
{
	var cloneObj = (obj == null) ? obj		//null, undefined, blank or 0
				 
				 : (typeof(obj) == 'function') ? cloneFunction(obj)
				 
				 : !(obj instanceof Object) ? obj
				 
				 : (obj instanceof RegExp) ? cloneRegExp(obj)
				 
				 : (obj instanceof Date) ? new Date(obj)
				 
		//		 : EZ.isEl(obj) ? obj.clone(isDeep)	//TODO: ??
				 
				 : EZ.isArray(obj) ? cloneArray(obj)
				 
				 : cloneObject(obj)	
	
	return cloneObj;

	//________________________________________________________________________________________
	/**
	 *	
	 */
	function cloneObject(obj)	
	{	
		if (!isDeep)
		{
			if (obj == null) return obj;
			var clone = {};
			Object.keys(obj).forEach(function(key)
			{
				clone[key] = obj[key];
			});
			return clone;
			//return EZ.mergeAll(obj);				//simple top level clone
		}
		try
		{
			var	json = EZ.stringify(obj,'* *circular');	//TODO: circular issues??
			var cloneObj;
			eval('cloneObj=' + json);
			
			if (EZ.equals(cloneObj, obj))
				return cloneObj;
			else
				return '"{cloneObject:' + "'failed', reason:'not equal'" + '}"';
				
		}
		catch (e)
		{
			return '"{cloneObject:' + "'failed', reason:"
					+ "'" + e.message.replace(/'/g, '') + "'"
					+ '}"';
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
			return cloneObject(obj);		
		
	
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

	EZ.test.run(doc					, {EZ: {ex:doc  	}})
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
--------------------------------------------------------------------------------------------------*/
EZ.displayMessage = function EZdisplayMessage(msg, timer)
{
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
}
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
cancel event propogation / bubble and optionally prevent default browser default action such as
going to href link or running href:javascript:...

http://stackoverflow.com/questions/5963669/whats-the-difference-between-event-stoppropagation-and-event-preventdefault
--------------------------------------------------------------------------------------------------*/
EZ.event.cancel = function EZeventCancel(evt, isPreventDefault)
{
    if (!evt) return false;

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
	elSelector		html element, array or collection of html elements

	ancestorSelector (optional)
			one or more selectors specifing ancestor tagName, className or fieldName
				e.g. TR .someClass @someField
			if omitted, blank, null, undefined, empty Array or Object, the immediate
			parent element is returned (i.e. el.parentElement)

	topTag	(legacy EZtest_assistant.js)

RETURNS:
	ancestor of el matching ancestorSelector -OR- EZnone pseudo element found or matching ancestor.

NOTE:	 similpar functions
	EZtest_assistant.js::EZgetParent(el,tag,topTag)
	EZcommon.js::EZgetParent(el,tagName,className)
	EZcore.js::EZgetParent(el,tagName)

TODO:
	as of 01-09-2016 does not work for id or name -- see EZ.getAncestor.test()
--------------------------------------------------------------------------------------------------*/
EZ.getAncestor = EZ.getParent = function EZgetAncestor(elSelector, ancestorSelector /*, topTag */)
{
	if (EZ.test.capture()) {return EZ.test.capture(this)} else if (EZ.test.debug()) debugger;

	var el = EZ(elSelector, false);			//get 1st el matching any selector
	if (el.undefined) return el;			//if el not found

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
	return EZnone();						//if no matching ancestor found
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
EZ.getAttributes = function EZgetAttributes(str /*, isOptions */)
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
					 || '';							//attr without any value

			attributes[groups.attr] = value;
		}
	}
	return attributes;
}
/*---------------------------------------------------------------------------------------------
TODO: rename to EZ.getOptions() -- rename legacy EZ.getOptions() --> EZ.mergeOptions()
---------------------------------------------------------------------------------------------*/
EZ.getOptionsNew = function EZgetOptions(options, defaultOptions /* or default/legacy key */)
{
	while (options)
	{
		if (typeof(options) == 'object')
			return typeof(defaultOptions) == 'object' ? EZ.mergeAll(defaultOptions, options)
													  : options;
		if (/(string|boolean|number)/.test(typeof(options)))
		{
			if (defaultOptions === true)
				return EZ.getAttributes(options, true);
			
			else if (typeof(defaultOptions) == 'string')
			{
				var value = options;
				options = {}
				options[defaultOptions] = value;
				return options;
			}
		}
		break;
	}
	return (typeof(defaultOptions) == 'object') ? defaultOptions : {};
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
EZ.getCallerName([fn])

ARGUMENTS:
	fn		(optional) fn to find caller name (default is immediate caller)
			TODO: if true find immediate caller before anonymous

RETURNS:
	name of the calling function's caller -OR- fn caller if specified.

	var caller = arguments.callee.caller;
	var callerName = caller.displayName || caller.name || '';
--------------------------------------------------------------------------------------------------*/
EZ.getCallerName = function EZcallerName(fn)
{
	if (fn === true)
	{
		fn = undefined;
		/*
		fn = arguments.callee.caller;
		do
		{
			fn = '.arguments.callee.caller'.ov(fn);
		}
		while (false)
		*/
	}
	fn = fn || arguments.callee.caller;
	var caller = '.arguments.callee.caller'.ov(fn);
	return !caller ? ''	//'NA'
	//	  : caller.EZgetName ? caller.EZgetName()
		  : caller.name || caller.displayName || 'anonymous';
}
/*--------------------------------------------------------------------------------------------------
EZ.getConstructorName(obj)

Similar results as EZ.getType() except non-objects and null returned as empty String.
--------------------------------------------------------------------------------------------------*/
EZ.getConstructorName = function EZgetConstructorName(obj)
{
	return !obj || typeof(obj) != 'object' ? '' : obj.constructor.name || '';
}
/*--------------------------------------------------------------------------------------------------
EZ.getType(obj, options)

return value type via Object.prototype.toString.call(value) for more grandularity vs typeof()

ALWAYS:
	"Boolean", "Function", "Number", "String", "Object", "Null", "Undefined"
	
PLUS:
	"Array", "Date", "RegExp"	if options omitted, undefined, null, true or blank
								NOT if options === false
								-and- value is: "Array", "Date", "RegExp"
										
	"NaN",  					if options === true. NaN -or- includes NaN or "NaN"
	
	"ArrayLike"					if options === true -or- includes "ArrayLike"
								and value is Object with only length and numeric keys

	"ObjectLike"				if options === true -or- includes "ObjectLike"
								and value is Array with named keys other than length

								-or- Object with only numeric Keys and length property

	any constructor name 		if options === true 
	e.g. HTMLCollection				not just "Array"  "Date", "RegExp"
	TODO: arguments				-OR- if (options.includes(value.constructor.name)	
								-OR- if Object.prototype.toString.call(value) is all lowercase: 
										e.g. "Window" for [object global] -- snenario forgotten
RETURNS: 
	(String) representing value type as explained above.
--------------------------------------------------------------------------------------------------*/
EZ.getType = function EZgetType(value, options)
{
	var isArrayLike = function()
	{
		var keys = Object.keys(value).sort();
		if (keys.includes('length'))
			keys.splice(keys.includes('length'),1);
		var arr = [].slice.call(value);
		return (Object.keys(arr).sort().join(' ') == keys.join(' '))
	}
	var isObjectLike = function()
	{
		var keys = Object.keys(value).sort();
		return (JSON.stringify(keys).includes('"'));
	}	
	//=================================================================================================
	var type = Object.prototype.toString.call(value);
	type = type.substring(8,type.length-1)
	//=================================================================================================
	
	if (type.toLowerCase() == type)
		type = value.constructor.name;

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
//________________________________________________________________________________________
EZ.getType.test = function()
{	
	var msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, , rtnValue];

	//EZ.test.settings({group: 'persistant note'});
	//EZ.test.options( {ex:ex, note:note} )

	//______________________________________________________________________________
	note = ''
	fn = function() {};
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	//"Boolean", "Function", "Number", "String", "Object", "Null", "Undefined"
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
EZ.is(arg, choices)

Shorthand for: EZ.isChoice(), EZ.isConstructor() and EZ.isEl()

returns false if 1st arg is null, undefined or blank -OR- 2nd arg supplied but null.

Otherwise calls one of the following:

	EZ.isChoice() 		when 2 arguments supplied and niether is typeof 'function'
	EZ.isConstructor() 	when 2 arguments supplied and one is typeof 'function'
	EZ.isEl() 			when only one argument supplied.
--------------------------------------------------------------------------------------------------*/
EZ.is = function EZis(arg, choices, options)
{
	if (!arg || choices === null) return false;

	if (arguments.length == 2)		//-----DUAL ARGUMENT FUNCTIONS-----
	{
		if (typeof(arg) == 'function' || typeof(choices) == 'function')
			return EZ.isConstructor(arg, choices);
		else
			return EZ.isChoice(arg, choices, options);
	}
	//----- Is arg valid html element or collection...?
	return EZ.isEl(arg);
}
/*--------------------------------------------------------------------------------------------------
EZ.isCaller()

Determines number of specified funcions in call stack. if no functions specified.

ARGUMENTS:
	fn		(optional) one or more functions -- Array required for multiple functions.
			default is caller -- returns  recursion level

RETURNS:
	true if any of specified funcions in call stack.

TODO:
	return number of time specified functions found in call stack 
	=0 if no fn specified and only occurance is top of stack (i.e. recurrsion level)
--------------------------------------------------------------------------------------------------*/
EZ.isCaller = function EZisCaller(fn)
{
	fn = EZ.toArray(fn);

	//--------------------------------------------------------------------
	// DCO 02-11-2016:
	//--------------------------------------------------------------------
	while (!EZ.isLegacy())
	{
		var fnList = [];
		[].forEach.call(arguments,function(fn)
		{
			fnList = fnList.concat(EZ.toArray(fn));
		});

		if (!fnList.length)
			fnList = [arguments.callee.caller.name];
		else
		{
			fnList.forEach(function(fn,idx)
			{
				fnList[idx] = typeof(fn) == 'function' ? fn.name || 'n/a' : fn + '';
			});
		}

		var stackTrace = EZ.getStackTrace();
		//	at EZgetOptions_option:1712         (.../EZbase.js:1712)
		//	at Array.forEach
		//	at EZgetOptions:1706                (.../EZbase.js:1706)
		//  at .../EZbase.js:1712
		//	at new EZtoStringSetupOptions:1314  (.../EZtoString.js:1314)
		//	at EZgetOptions_option:1712         (.../EZbase.js:1712)
		var stack = stackTrace.slice(4).join('\n');
		var stackNames = stack.replace(/^.*?at.*?((\S*):|\n).*/gm, '$2').split('\n');

		if (fnList.some(function(funcName)
		{
			return stackNames.includes(funcName);
		})) return true; 					//return true if found in stack

		break;								//otherwise fall thru to legacy
	}
	//--------------------------------------------------------------------
	// legacy code -- nogo if any recursive calls in argument stack
	//--------------------------------------------------------------------
	var processedFunctions = {};			//prevents recurrsion loop
	var caller = arguments.callee.caller;
	for (var func = caller.arguments.callee.caller; func != null; func = func.caller)
	{
		if (fn.indexOf(func) != -1) return true;
		if (processedFunctions[func] && processedFunctions[func]++ > 3) return true;
		processedFunctions[func] = 1;
	}
	return false;
}
/*--------------------------------------------------------------------------------------------------
EZ.isAncestor(el[s], ancestor[s])

Determine if el is ancestor or a decendant of ancestor.

For Array of el(s) or ancestors(s), determine if any el is one of ancestors or decendant.

ARGUMENTS:
	el			html element, array or collection of html elements

	ancestor	html element, array or collection of html elements

RETURNS:
	true if any el is one of ancestor(s) or decendant of anf ancestor otherwise false
--------------------------------------------------------------------------------------------------*/
EZ.isAncestor = function EZisAncestor(el, ancestor)
{												//must be element -- if not already checked
	if (EZ.test.capture()) {return EZ.test.capture(this)} else if (EZ.test.debug()) debugger;

//TODO: quick test
///	if (!EZ.isNotCaller(EZ.isEl, el)) 	//must be html element
///		return false;

	el = EZ.toArray(el, false);					//keep ArrayLike e.g. html collection
///	ancestor = EZ.toArray(ancestor, [',', false]);		//ditto but check for comma delimiters
	ancestor = EZ.toArray(ancestor, false);

	return [].some.call(el, function(eachEl)	//for each element loop till true
	{
		if (el == null) return false;			//skip null including EZnone
		return [].some.call(ancestor, function(ancestor)
		{										//for each ancestor, loop till true
			var el = eachEl;
			if (ancestor == null) return false;

			if (typeof(ancestor) == 'string')
			{
				ancestor = (ancestor.substr(0,1) != '#' ? ancestor
					 : ancestor.substr(1)).toLowerCase();
			}
			else
			{
				if (EZ.is(ancestor.document, document.constructor))
					ancestor = ancestor.document;			//window --> window.document

				if (ancestor == el.ownerDocument) 		//quick check when ancestor is document
					return true;					//e.g. is el in frame or popup document
			}
			while (el.parentNode)
			{										//if ancestor is el and match, quit all loops
				if (typeof(ancestor) == 'object' && ancestor == el.parentNode)
					return true;

				else if (typeof(ancestor) == 'string')	//ancestor specified as string
				{
					//pseudo tagName for document, doctype, html, etc...
					var tagName = el.parentNode.tagName
							   || el.parentNode.nodeName.replace(/^#/, '');

					if (ancestor == tagName.toLowerCase()) return true;
				}
				el = el.parentNode;					//traverse up el dom tree
			}
			return false;
		});
	});
}
/**
 *
 */
EZ.isAncestor.test = function()
{
	/*global t_divs, t_tags, t_radios */
	EZ.test.run(null, 				{EZ: {ex:false		}});
	EZ.test.run(0, 					{EZ: {ex:false 		}});
	EZ.test.run('', 				{EZ: {ex:false 		}});

	EZ.test.run(t_divs,[],			{EZ: {ex:false		}});
	EZ.test.run(t_divs,[null],		{EZ: {ex:false		}});
	EZ.test.run(t_divs,null,			{EZ: {ex:false		}});

	EZ.test.run(t_divs[0],t_tags[0],	{EZ: {ex:true		}});
	EZ.test.run(t_divs[1],t_tags[0],	{EZ: {ex:false		}});
	EZ.test.run(t_divs[1],t_tags,		{EZ: {ex:true		}});
	EZ.test.run(t_tags[0],t_tags,		{EZ: {ex:false		}});
	EZ.test.run(t_divs,t_tags,		{EZ: {ex:true		}});

	EZ.test.run(t_divs,'body',		{EZ: {ex:true		}});
	EZ.test.run(t_divs,'div',			{EZ: {ex:true		}});
	EZ.test.run(t_tags[0],t_radios,		{EZ: {ex:false		}});
}
/*--------------------------------------------------------------------------------------------------
EZ.isArray(arg, allowNaN) -- DW and IE10 need.

--------------------------------------------------------------------------------------------------*/
EZ.isArray = function EZisArray(arg, allowNaN)
{
	//if (EZ.debug === true || (EZ.debug && EZ.debug[arguments.callee.name])) debugger;
	//return (arg != null && typeof(arg) == 'object' && arg.constructor == Array);

	if (!arg || typeof(arg) != 'object' || arg.constructor != Array)
		return false;

	if (allowNaN !== false)	//default is true
		return true;

	return Object.keys(arg).every(function(p)
	{
		if (isNaN(p)) return false;
	});

}
//_____________________________________________________________________________________________
EZ.isArray.test = function()
{
	// create test data


	var str = 'xyz';
	var obj = {a:1, b:2, c:3}
	var numberArray = [1, 2, 3]
	var mixedArray = ['a', 'b', 0, true, obj]
	var arrayLike = {0:'a', 1:'b', length:2};
	var hybrid = [1,2,3];
	hybrid.other = 'otherwise';
	var myFunc = function(o){return o};

	// run tests
	EZ.test.run(obj, 				{EZ: {ex:false,	note:'object is not Array'}} )
	EZ.test.run(numberArray, 		{EZ: {ex:true,  	}})
	EZ.test.run(mixedArray, 		{EZ: {ex:true,  	}})

	EZ.test.run(hybrid, true,		{EZ: {ex:true,
		note: 'created as Array and NaN "other" property added'
			+ ' returns true because allowNaN argument is true'}})

	EZ.test.run(hybrid, false, 		{EZ: {ex:false,
		note: 'created as Array but NaN "other" property NOT allowed'
			+ ' because allowNaN argument is false'}})

	EZ.test.run(hybrid,		 		{EZ: {ex:true,
		note: 'Array with NaN "other" property allowed; allowNaN argument'
			+ '  MUST be specified as false to disallow'}})

	EZ.test.run(arrayLike, true, 	{EZ: {ex:false,
		note: "even with allowNaN set true, not Array because not created with"
			+ " Array constructor - Array functions: join(), push(), etc will not work"}})

	EZ.test.run(					{EZ: {ex:false,	note:'missing argument is not Array'}} )
	EZ.test.run(true, 				{EZ: {ex:false,	note:'true is not Array'}} )
	EZ.test.run(101, 				{EZ: {ex:false,	note:'number is not Array'}} )
	EZ.test.run(str, 				{EZ: {ex:false,	note:'String variable is not Array'}} )
	EZ.test.run('abc', 				{EZ: {ex:false,	note:'String is not Array'}} )
	EZ.test.run([7,8], 				{EZ: {ex:true,	note:'Array argument is Array'}} )
	EZ.test.run(myFunc,				{EZ: {ex:false,	note:'function is not Array'}} )
	EZ.test.run(myFunc(str), 		{EZ: {ex:false,	note:'function returns String'}} )
	EZ.test.run(myFunc(numberArray),{EZ: {ex:true,	note:'function returns Array'}} )
}
/*--------------------------------------------------------------------------------------------------
EZ.isArrayLike(obj, options)

Array-like object if not null, object with length property containing number.
object has length property but not Array constructor e.g. arguments object

Functions are not ArrayLike -- their length property refers to number of named arguments.

	// length must be > 0 for function unless options === true then all function are ArrayLike
	if (obj.length is 0 && options !== true && typeof(obj) == 'function') return false;
--------------------------------------------------------------------------------------------------*/
EZ.isArrayLike = function EZisArrayLike(obj /*TODO: , options */)
{
	if (obj == null || typeof(obj) != 'object') return false;
	if (obj.constructor == Array) return true;

	if (obj.length == null || isNaN(obj.length)) return false;
	if (obj.length != Math.floor(obj.length)) return false;

	if (obj.childNodes != null) return false;

	EZ.styleConstructor = EZ.styleConstructor || 'document.body.style.constructor'.ov();
	if (obj.constructor == EZ.styleConstructor) return false;

	// if obj iterates like array w/o error, return true for ArrayLike
	try
	{
		if ([].some.call(obj,function()
		{
			return true;	// only iterate on 1st item (or none if zero length array)
		}))
			return (obj.length > 0);	//behaved like non-zero length array
		else
			return (!obj.length);	//behaved like zero length array
	}
	catch (e)
	{
		EZ.techSupport(e, 'EZ.ArrayLike catch')
	}
	//debugger		//save this test case
	return false;
}
/**
 *
 */
EZ.isArrayLike.test = function()
{
	var tstArrayObj = [1];
	tstArrayObj.abc = '123';
	var tstFn = function() {};
	var tstObj = {}
	var tstObjArrayLike = [1];
	tstObjArrayLike.xyz = '789';
	var tstObjEmptyArray = {length:0};

	EZ.test.run(null			, {EZ: {ex:false  }})
	EZ.test.run(undefined		, {EZ: {ex:false  }})
	EZ.test.run(true			, {EZ: {ex:false  }})
	EZ.test.run(false			, {EZ: {ex:false  }})
	EZ.test.run([]				, {EZ: {ex:true  }})
	EZ.test.run([1,2,3]			, {EZ: {ex:true  }})

	EZ.test.run(tstFn			, {EZ: {ex:false  }})
	EZ.test.run(tstObj			, {EZ: {ex:false  }})
	EZ.test.run(tstObjArrayLike	, {EZ: {ex:true	  }})
	EZ.test.run(tstObjEmptyArray, {EZ: {ex:true   }})

	EZ.test.run(t_doc			, {EZ: {ex:false  }});
	EZ.test.run(t_none 			, {EZ: {ex:false  }});
	EZ.test.run(t_tags 			, {EZ: {ex:true   }});
	EZ.test.run(t_tags[0]		, {EZ: {ex:false  }});
	EZ.test.run(t_wrap.style	, {EZ: {ex:false  }});
}
/*--------------------------------------------------------------------------------------------------
EZ.isChoice(settings, choices, options)	 --  replacement for RZcheckoptions()

Determine if specified settings contains any of the specified choices.

ARGUMENTS:
	settings	specifies settings to search for any specified choices
				delimited String, Array of Strings, EZoptions or EZoptionValue object

	choices		delimited string or array of strings to search for in settings

	options		object containing {legacy:true|false}


RETURNS:
	true if settings contains any of specified choice(s) otherwise false

	if ('object function'.indexOf(typeof(settings)) != -1
	|| 'object function'.indexOf(typeof(choices)) != -1)
		return (arg == choices);	//avoid legacy code js error
--------------------------------------------------------------------------------------------------*/
EZ.isChoice = function EZisChoice(settings, choices, options)
{
	if (!settings || choices === null) return false;

	var isLegacy = EZ.isLegacy(options)
	&& [settings,choices].every(function(arg)
	{												//use legacy default unless any regex...
		return EZ.toArray(arg).every(function(opt)
		{	//...quit not Array or String or legacy join gets js error
			if (!EZ.isArray(opt) && typeof(opt) != 'string') return false;
			return !EZ.isConstructor(opt, RegExp);	//...legacy does not support regex
		})
	})
	isLegacy = isLegacy;
	/*DCO 11-06-2015: disabled because join not called correctly for settings or choices Strings
	if (isLegacy)
	{
		//--------------------------------------------------------------------
		// 	legacy code -- only tests 1st string?? -- latest code should fix
		// 	think it was supposed to call EZ.indexOf() for multiple strings
		//	might have removed test to avoid recursion loop per note below.
		//--------------------------------------------------------------------
		// if (!EZ.isArray(...) prevent recursive infinity EZ.toArrayMerge() can call EZ.is()
		settings = EZ.toArray(settings)[0];
		choices = EZ.toArray(choices)[0];

		// setup and test using regex
		settings = ' ' + settings.join(' ') + ' ';		//single string to test
		choices = '( ' + choices.join(' | ') + ' )';	//regex
		return choices.test(settings);
	}
	*/
	//--------------------------------------------------------------------
	//DCO 07-17-2015: latest code -- uses regular expressions
	//--------------------------------------------------------------------
	settings = EZ.toArray(settings, ' ,');
	choices = EZ.toArray(choices,  ' ,');
	return settings.some(function(setting)		//for all settings . . .
	{
		return choices.some(function(choice)	//for all choices . . .
		{
			if (EZ.is(setting, RegExp) && !EZ.is(choice,RegExp))
				return setting.test(choice);

			if (!EZ.is(setting, RegExp) && EZ.is(choice,RegExp))
				return choice.test(setting);

			return setting == choice;
		});
	});
}
//__________________________________________________________________________________________________
/**
 *
 **/
EZ.isChoice.test = function()
{
	//EZ.test.legacy('isChoice');		//indicates legacy code exists

	var fn = function() {};
	var obj = {}
	var arrayLike = [1]; arrayLike.other = 'abc';

	EZ.test.run(fn, fn			, {EZ: {ex:true  }})
	EZ.test.run(obj, fn			, {EZ: {ex:false  }})
	EZ.test.run(obj, obj		, {EZ: {ex:true  }})
	EZ.test.run(obj, {}			, {EZ: {ex:false  }})
	EZ.test.run(obj, arrayLike	, {EZ: {ex:false }})
}
/*--------------------------------------------------------------------------------------------------
EZ.isEvent(evt)
--------------------------------------------------------------------------------------------------*/
EZ.isEvent = function EZisEvent(evt)
{
	return EZ.getConstructorName(evt).includes('Event');
}
/*--------------------------------------------------------------------------------------------------
EZ.isEl(arg, options)

Determine if argument is an html form field or any other document element (except EZnone)
including Array of elements or non-empty html collection as described for options below.

The document, documentElement, html, head and related nodes return true unless an options
excludes as described below.

ARGUMENTS:
	arg			element or object to check
	options		=true or =body -- only body elements, not document object or head elements
				=any true if any ArrayLike item contains html element (other than EZnone)
				=all (default) all ArrayLike items must contain html element (not EZzone)
RETURNS:
	true 		if arg is element, Array or html collection of elements as described above
	false		if arg is not element or EZnone
	undefined	if arg not element and not EZnone.
--------------------------------------------------------------------------------------------------*/
EZ.isEl = function EZisEl(arg, options)
{
	if (typeof(arg) != 'object' || arg == null)
		return false;							//must be non-null, non-undefined object

	var rtnValue;
	EZ.toArray(arg).every(function(el)			//for each array item . . .
	{											//set rtnValue: true, false or undefined
		rtnValue = el == null || typeof(el) != 'object' ? false
				 : el.undefined === true ? undefined
				 : !el || el.childNodes === undefined ? false
				 : true;

		if (options === true)
			rtnValue = rtnValue && EZ.isAncestor(el, 'body');

		return (rtnValue && options == 'any') ? false	//quit if element and any will do
			  : !rtnValue ? false						//else quit if not element
			  : true;							//otherwise check next item
	})
	return rtnValue;
}
EZ.isElement = EZ.isEl;
/**
 *
 */
EZ.isEl.test = function()
{
	EZ.test.run(null, 			{EZ: {ex:false, 		}});
	EZ.test.run(0, 				{EZ: {ex:false, 		}});
	EZ.test.run('', 			{EZ: {ex:false, 		}});
	EZ.test.run(t_none, 		{EZ: {ex:undefined,		}});

	EZ.test.run(t_wrap, 		{EZ: {ex:true, 			note:'el'		}});
	EZ.test.run(t_radio01, 		{EZ: {ex:true, 			note:'array'		}});
	EZ.test.run(t_radios, 		{EZ: {ex:true, 			note:'collection'	}});
	EZ.test.run(t_tags, 		{EZ: {ex:true,	 		note:'collection'	}});

	EZ.test.run(t_mixed, 		{EZ: {ex:false,	 		note:'mixed'	}});
	EZ.test.run(t_mixed,'any', 	{EZ: {ex:true,	 		note:'mixed'	}});

	EZ.test.run(document,		{EZ: {ex:true,	 		note:'document'	}});
	EZ.test.run(document,true,	{EZ: {ex:false,	 		note:'document'	}});
	EZ.test.run(t_html,true,	{EZ: {ex:false,	 		note:'html'		}});
	EZ.test.run(t_head,true,	{EZ: {ex:false,	 		note:'head'		}});
	EZ.test.run(t_title,true,	{EZ: {ex:false,	 		note:'title'	}});
}
/*--------------------------------------------------------------------------------------------------
EZ.isObjectCircular(obj)
--------------------------------------------------------------------------------------------------*/
EZ.isObjectCircular = function EZisObjectCircular(obj)	
{	
	if (obj instanceof Object)
	{
		try
		{
			JSON.stringify(obj);
			return false;
		}
		catch (e)
		{
			//var msg = /circular/i.test(e.message) ? 'circular structure' : e.message;
			var o = { 'Object.keys()': Object.keys(obj).join(', ') }
			o[e.constructor.name] = e.message;
			return o;
		}
	}
	return false;
}
/*--------------------------------------------------------------------------------------------------
EZ.isObjectLike(obj)
--------------------------------------------------------------------------------------------------*/
EZ.isObjectLike = function EZisObjectLike(obj)
{
	if (!obj || typeof(obj) != 'object' || EZ.isEl(obj))
		return false;
		
	var keys = Object.keys(obj);
	return keys.match(/ \D+/g);
}
/*--------------------------------------------------------------------------------------------------
EZ.isOptions(options)

true if String and starts with ?
--------------------------------------------------------------------------------------------------*/
EZ.isOptions = function EZisOptions(options, isObjectAllowed)
{
	var type = EZ.getObjectType(options);
	if (type == 'String')	// && options.substr(0,1) == '?' || ??
		return true;
	
	if (!isObjectAllowed)
		return false;
		
	return type == 'Object';
}
/*--------------------------------------------------------------------------------------------------
EZ.equals(x, y [, options])

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
	http://stackoverflow.com/questions/201183/how-to-determine-equality-for-two-javascript-objects/16788517#16788517

TODO:
	options
--------------------------------------------------------------------------------------------------*/
EZ.equals = EZ.isEqual = function EZequals(x, y, showDiff)
{
	var processedObj = {x:[], y:[]};	//only compare Objects once to avoid circular loop
	var matchedObj   = {x:[], y:[]};
	var unmatchedObj = {x:[], y:[]};
	var dotName = [];
	
	var is = isEqualObjects(x, y, 0);
	
	if (EZ.test.running == 'EZequals')
		EZ.test.data.details = EZ.mergeAll({processedObj:processedObj, matchedObj:matchedObj, unmatchedObj:unmatchedObj});

	 return is;

	/**
	 *	recursively called for each embedded or nested object not previously processed.
	 *	
	 */
	function isEqualObjects(x, y, depth)
	{
		if (x === null || x === undefined || y === null || y === undefined)
			return x === y; 					//not both null or undefined

		if (x.constructor !== y.constructor)
			return false;						//not both same constructor

		if (typeof(x) == 'number' && isNaN(x) && isNaN(y))
			return true;						//required because NaN === NaN is false

		// if they are functions, they should exactly refer to same one (because of closures)
		// NO: same name and script except comments (if comment stripper available)
		if (x instanceof Function)
		{
			//if (!x.name && x.name != y.name && x !== y)
			if (x.name !== y.name)
				return false;

			if ((x + '').trim() !== (y + '').trim())
				return false;
		}

		// if they are regexps, they should exactly refer to same one
		// (it is hard to better equality check on current ES)
		// NO -- only check flags and source patter properties -- NOT lastIndex
		if (x instanceof RegExp)
		{
			return x.global == y.global && x.ignoreCase == y.ignoreCase
				&& x.multiline == y.multiline && x.source == y.source;
			//return x === y;
		}

		if (x === y || x.valueOf() === y.valueOf())
			return true;							//both same object ??

		if (x instanceof Array && x.length !== y.length)
			return false;

		// Date: date and time zone besides owner properties (e.g. EZ.date)
		if (x instanceof Date)
		{
			if (x.getTime() != y.getTime())
				return false;						//different dates
		}
		
		// not Object: if they are strictly equal, they both need to be object at least
		if (!(x instanceof Object) || !(y instanceof Object))
			return false;

		//------------------------------------------
		// embedded object properties equality check
		//------------------------------------------
		var keys = Object.keys(x).concat(Object.keys(y)).removeDups();
		var is = keys.every(function(i)					//use is as debugger convenience
		{
			return i in x && i in y && typeof(x[i]) == typeof(y[i]);
		})
		if (!is && !showDiff)							//quit if keys do not match
			return false;

		//if (EZ.test.debug('EZequals')) debugger;
		is = keys.every(function(key)
		{
			while (x[key] instanceof Object)			//for function or object properties . . .
			{			
				if (x[key] == y[key]) return true;		//same Object
				
				if (!showDiff && EZ.test.running != 'EZequals') 
					break;								//skip repeat logic UNLESS TESTING
				//if (true) break;

				var i = getObjectIdx('x', x[key]);		//index of processed x Objects
				if (matchedObj.x[i].includes(y[key]))
					return true;						//...previously matched y[key]
				if (unmatchedObj.x[i].includes(y[key]))
					return false;						//...previously did NOT match y[key]

				var j = getObjectIdx('y', y[key]);		//index of processed y Objects
				if (matchedObj.y[j].includes(x[key]))
					return true;						//...previously matched x[key]
				if (unmatchedObj.y[j].includes(x[key]))
					return false;						//...previously did NOT match x[key]

				dotName.push(key);
				var isEqual = isEqualObjects(x[key], y[key], depth+1);
				dotName.pop();
				if (isEqual)
				{										//objects match -- remember for future
					matchedObj.x[i].push(y[key]);				
					matchedObj.y[j].push(x[key]);
					return true;
				}
				else
				{										//remember NOT matched
					unmatchedObj.x[i].push(y[key]);
					unmatchedObj.y[j].push(x[key]);
					return false;
				}
			}
			var isEqual = isEqualObjects(x[key], y[key], depth+1);
			if (!isEqual && showDiff)
			{
				var msg = 'x.' + key + ': ' + x[key] + '\t\ty.' + key + ': ' + y[key];
				console.log(msg);
			}
			return isEqual;
		});
		return is;
	}
	/**
	 *	keep Array of all compared Objects
	 */
	function getObjectIdx(xy, obj)
	{
		var idx = processedObj[xy].indexOf(obj)
		if (idx == -1)
		{
			idx = processedObj[xy].length;
			processedObj[xy].push(obj);
			matchedObj[xy].push([]);
			unmatchedObj[xy].push([]);
		}
		return idx;
	}
}
/*--------------------------------------------------------------------------------------------------
EZ.isObject(o, isEl)

return true if NOT null, undefined, not EZnone object -AND- either constructor is Object
-OR- is any other typeof object (except Array) and object does not have childNodes property.

isEl to return true for html element, Array or collection of elements.
--------------------------------------------------------------------------------------------------*/
EZ.isObject = function EZisObject(o, isEl)
{
	if (o == null || EZ.isArray(o)
	|| typeof(o) != 'object' || !o.valueOf())
		return false;

	if (EZ.is(o, Object))
		return true;

	return (isEl || !EZ.isEl(o));
}
/*--------------------------------------------------------------------------------------------------
EZ.isConstructor(value) -- is arg constructor of choices or vise-versa

from EZ.is() choice arg desc: -or- single function e.g. choices.remove.is(o.contructor)
--------------------------------------------------------------------------------------------------*/
EZ.isConstructor = function EZisConstructor(arg, choices)
{
	if (typeof(choices) == 'function')
		return (typeof arg == 'object' && arg.constructor == choices);

	else if (typeof(arg) == 'function')
		return (typeof choices == 'object' && choices.constructor == arg);
}
EZ.isFunction = EZ.isConstructor;
/*--------------------------------------------------------------------------------------------------
Determine if object is empty -- do NOT use EZ.isTrue() it uses this function.

legacy: true if any propery or function defined

latest:
	true if o.valueOf() false and length is 0 -OR- has non-hasOwnProperty property
--------------------------------------------------------------------------------------------------*/
EZ.isEmpty = function EZisEmpty(o, options)
{
	if (o == null || 'object function'.indexOf(typeof(o)) == -1) return true;

	// Only Revize extension reference is in RevizeResouces::RZgetTemplateList()
	if (EZ.isLegacy(options))
	{
		for(var i in o) {return false;}
		i = i;
		return true;
	}
	if (Object.keys)
		return (!Object.keys(o).length)

	// true (i.e. empty) when valueOf() false and length === 0
	if (!o.valueOf() && (!EZ.isArrayLike(o) || !o.length)) return true;

	// false (i.e. not empty) if has any property of its own (i.e. not from prototype)
	for (var p in o)
		if (p !== '' && (!o.hasOwnProperty || o.hasOwnProperty(p)))
			return false;

	return true;
}
/*--------------------------------------------------------------------------------------------------
EZ.isLegacy(key, defaultValue)

return value of EZ.legacy[key] if defined -- otherwise defaultValue if specified or undefined

	key 	(optional)	key to check in EZ.legacy (default:	caller function name)
						if boolean, return -- overrides EZ.legacy
	options	(optional)	last arg if object -- return options.legacy in not undefined
--------------------------------------------------------------------------------------------------*/
EZ.isLegacy = function EZisLegacy(key, defaultValue)
{
	if (typeof(key) == 'boolean') return key;

	var args = arguments.length ? [].slice.call(arguments) : [''];	//add blank item if empty

	// if last arg is object pop() for options
	var options = (EZ.is(args[args.length-1], Object)) ? args.pop() : {};

	if ('.legacy'.ov(options) != null)
		return options.legacy;		//if options contains legacy property, return value

	key = ('EZ.global.legacy.') + (args.shift() || EZ.getCallerName(true));
	defaultValue = args[0] != null ? args.shift() : true;

	var isLegacy = key.ov();
	if (isLegacy == null)
		isLegacy = defaultValue;
	return isLegacy === true;
}
/*--------------------------------------------------------------------------------------------------
EZ.isNone(value) -- LEGACY

Must use if value could be object since no Object protoTypes are defined.
Does not use EZ.getOptions() -- can be used during options setup
--------------------------------------------------------------------------------------------------*/
EZ.isNone = function EZisNone(value)
{
	if (typeof(value) == 'unknown' || value == null)
		return true;

	switch (typeof value)
	{
		case 'string'	: return value === '';
		case 'number'	: return isNaN(value);
		case 'boolean':
		case 'function': return false;
		case 'object':
		{
			if (EZ.isArrayLike(value)) 	return (!value.length);
			if (value.undefined)		return true;

			//e.g. IE events
			if (EZ.is(value, Object)
			|| (value.hasOwnProperty && !value.hasOwnProperty)) return false;

			for (var p in value) 	//if any object property/element found, not none
				if (value.hasOwnProperty && value.hasOwnProperty(p)) return false;
			return true;			//empty object considered none
		}
	}
	return true;	//unexpected scenario -- everything should be covered above
}
/*--------------------------------------------------------------------------------------------------
EZ.isTrue(arg, options)

-----------
BACKGROUND:
-----------
Originally created to return true for form field Strings: "on" "yes", "true" and true to handle
case of subsequently calling with value returned by this function.

Additional logic was added to support the EZnone pseudo html element and boolean values returned
by EZgetValue() while remaining backward compatible.  An option was added to return 0 or "0" as
either true or the value itself.

When more functionality was required for ..., the following function were introduced:

	EZisTrueLike()
		can be used for check
	EZisTrueLikeValue()
--------------------------------------------------------------------------------------------------*/
EZ.isTrue = function EZisTrue(value, options)
{
	if (!EZ.isLegacy(options))	//not legacy
		return EZ.isTrueLike(value, ['-0 -# -* +no +yes'].merge(options) )

	//-----------------------------------------------------------------------
	//	legacy code from EASY.js
	//	in theory replicates Revize extension logic unless zerovalue is true
	//-----------------------------------------------------------------------
	if ('EZ.global.setup.key'.ov())			//EASY.js enviornment
		options = EZ.getOptions(arguments,options,'zerovalue');
	else
		options = options || {zerovalue:false}

	if (value === true || value === 'true' || value === 'on' || value === 'yes')
		return true;

	//addition for EZnone
	if (typeof(value) == 'object' && !EZ.isNone(value)) return true;

	// Revize extension variant always returns false here

	//additions of all false values except 0 in lieu of always false to support zerovalue option
	if (value === false || value === 'false' || value === 'off' || value === 'no'
	|| value == null || value === '')
		return false;

	//addition for EZnone
	if (EZ.isNone(value)) return false;

	switch (options.zerovalue + '')
	{
		case 'false' : return false;
		case 'true'  : return true;
		//case 'value' :
		default      : return value;	//0 or "0" effectively false if caller just uses EZ.isTrue()
	}
}
/*--------------------------------------------------------------------------------------------------
EZ.isTrueLike(arg, options)			----Affirmative Truth Formula Core----

Determine an affirmative true/false value or return undefined.

-----------
BACKGROUND:
-----------
Originally created to return true for form field values: "on" "yes", "true" as true and return
false for values: "off" ,"no", "false" as true as false.

With the introduction of the EZnone html element, additional logic was needed to evaluate
this object as false and in general evaluate all objects more intelligently than always true
as JavaScript does for "if ( Expression ) Statement"  or when comparing Object to anything of
a different type. The JavaScript spec does not allow using the valueOf() or toSting() values.


For objects, the valueOf() return value is fisrt used to determine an affirmative true or false
value, Next for ArrayLike objects, length is used to determine true or false (length > 0).

The affirmative formula employed here uses the valueOf() return value when it does not return
the object itself as does the default valueeOf() methed.

(by default) evaluates zero length Arrays and ArrayLike
objects as false. Empty Objects are also evaluated as false. They are considered "empty" if
there are no properies other than length or prototype / isOwnerProperty() properties.


JavaScript spec requires internal toBoolean() to implicitly convert Objects to true
for if, while, etc so "if (!EZnone()..."  cannot be used to test if element found.


The evalue returned custom Objects non-standard  toString() or
valueOf() function will

not always evaluate objects

This still evalutes to false for
all boolean operations but is often quite useful. There is an option to return the arg value
when there is not an affirmative true/false value.

A few standard JavaScript conventions are EXCLUDED (by default) to achieve a more meaningful
affirmative result (especially when evaluating form fields since they do not have boolean values)
and objects that are always true when using the "if ( Expression ) Statement" or comparing them
to other data types. Below are the few deviations:

	0 and "0" DO NOT return false
	Any non-empty string DOES NOT return true
		return true for string values: "on", "yes", "true",
		return false for string values: "off" ,"no", "false"
	Arrays and Objects DO NOT always true -- see TRUTH RULES below.

All these exclusions can be disabled with options described below.

Below is great article describing the JavaScript Truth and Equality conventions.
	https://javascriptweblog.wordpress.com/2011/02/07/truth-equality-and-javascript/

----------
ARGUMENTS:
----------
arg			specifies variable (or data literal e.g. "red", 10, 2.5) to evaluate.

options		supplies one or more options as a comma delimited string or array of values.
(optional)	Each option adds or changes default rules used to determine value returned.
			Unless noted, each option ADDS a rule applied after the default rules.

			When none of the rules evaluate as true, return false unless EZvalue supplied.

				+-0		true for values: 0 or "0"
				+-#		true for any number other than 0
				+-*		true for any non-empty, non-numeric string
				+-[]	only true for Array with length > 0
				+-{}	only true based on Truth Formula described below
				+-no	false for string values: "no", "off", "false"
				+-yes	true for string values: "yes", "on" and "true"
						redundant with +* but set for consistancy and convenience

			The above options are active by default are the defaults rules used unless other option(s) specified

				+reset	same as: -0, +#, +*, -[], -{}, -yes, -no
						effectively return same as JavaScript spec for: if (arg)...
						UNLESS: options other options follow

				+-value	return arg value, or object valueOf() when no other rule evaluates
						as true or false -- e.g. for arg="red" -- return "red"

						NOTE: when this option is specified and arg is collection of one or more
							  html form fields or elements (other than pseudo EZnone) . . .
							  EZgetValue(arg) is evaluated for truefalse not the html collection
							  which by default will return true

				+legacy use legacy algorithm -- all other options ignored
-----------------------------------------------------------------------------------------------
				=trueString
				!falseString



			---------------------------------------------------------------------------------------
			Any other option (any typeof) creates a new rule that will return true if arg == option
			---------------------------------------------------------------------------------------

			CAVENTS:

				Only boolean, number or string typeof options can be specified via a comma seperated
				string of options.  All options must be specified as an Array of option values.

				boolean option values are converted to: "true" or "false"
				string options return true if arg.toString() == option
				number options return true if arg.toValue() == option

				Examples
					"green" will return true if arg value is "green"
					5 will return true for a value of: 5 or "5"

			REGULAR EXPRESSIONS:

				Option values specified as either RegExp object or pattern String (e.g. /.*cows/i) create
				a new rule much like a String option value.

			OTHER OBJECTS:

				For typeof option == "object", return true if arg is object and arg.toValue() == option

				For typeof option == "function" returns true if arg.constructor == option

------------
TRUTH RULES:
------------

Create Rules from Options
.........................

option  actions
 "+0"	return true for arg values: 0 or "0"
 "+0"	return true for arg values: 0 or "0"
 "#"	return true for any number other than 0
 "*"	return true for any non-empty string (except: "false", "off", "no")




 1.	return false if null, undefined, unknown or NaN
 2. return true if arg === true

Number and String options/rules:
................................

 3.	return true if arg is number or string and matches any string, number or regex option
 	e.g. return true if arg="yes" and either "yes" or EZtrue option specified
 4. return false if arg is number or string and matches any false values e.g. "no"

ArrayLike options/rules:
........................
  "[]"	true for any ArrayLike object (not just if length > 0)

  If any trueVales are specified (other than the EZyes or EZno strings), return Array index


 4.	return true if arg is non-ArrayLike object and toSring() or valueOf() matches an
 	option as described above and no other object options are specified -- see below
 5. if arg is ArrayLike object and no other array options are specified -- see below,
 	return arg,length > 0

Non-ArrayLike Object options/rules:
...........................
	option  results
10. "{}"	true for any non-ArrayLike object -- f

		false if EZ.empty(arg): only prototype functions
		false if fake/none HTML element unless EZnone() in options

		otherwise valueOf() intrepreted as follows

			false if null, undefined, unknown
			for typeof boolean, number, string, use valueOf().isTrue(options) results
			true if object itself -- default valueOf() function

			true if ArrayLike and length > 0 as explained above
			true if object and not empty as explained above
			otherwise false: catch all for unexpected types
--------------------------------------------------------------------------------------------------*/
EZ.isTrueLike = function EZisTrueLike(arg, options)
{
	var isTrueFalse, value;
	var rules = processOptions();
	switch(typeof(arg))
	{
		case 'number':
		case 'string':
		{
			isTrueFalse = checkValues(arg);
			if (isTrueFalse != null) return isTrueFalse;

			return (isRule('EZvalue')) ? arg : undefined;
		}
		case 'function':
		case 'object':
		{
			//-----------------------------------
			// REAL ARRAY -- not html collection
			//-----------------------------------
			if (EZ.isArray(arg))
			{
				if (isRule('-[]')) return true;		//if using js spec for arrays, always true;
				return (arg.length > 0)				//return true if length > 0 otherwise false
			}
			//-----------------------------------
			// non-Array Object
			//-----------------------------------
			if (isRule('-{}')) return true;			//if using js spec for object, always true;

			isTrueFalse = checkValues(arg);			//check for affirmative truefalse value...
			if (isTrueFalse != null) 			//...return if found
				return isTrueFalse;
													//check for empty object (checks ArrayLike length)...
			if (EZ.isEmpty(arg,{legacy:false})) 		//...html collection never empty (except EZnone)
				return false;						//return false -- when empty

			if (isRule('EZvalue') && EZ.is(arg))		//if arg is html collection and value option specifed
			{
				value = EZgetValue(arg)					//get value of 1st element or radio group
				isTrueFalse = checkValues(value);		//check truefalse values...
				if (isTrueFalse != null) 			//...if affirmative true/false result, return it
					return isTrueFalse;
				return value;							//...otherwise return element value
			}
			value == arg.valueOf();
			if (arg === value) 						//return true if valueOf() is arg itself as default...
				return true;						//...valueOf() returns (including html collection)

			while (typeof(value) == 'object') 		//while valueOf() is another Object . . .
			{
				if (rules.objectValues[value] != null)		//if have valueOf() for Object, return...
					return rules.objectValues[value] === true;	//...true/false based value (enen if Object)
																//should avoid infinite recursion loop
				else
				{
					rules.objectValues[value] = EZ.isTrue(value, rules, rules.objectValues);
					if (value == rules.objectValues[value]) return true;
					value = rules.objectValues[value];
					if (value != 'object') break;

					if (rules.objectDepth++ > 99) break;
					continue;
				}
			}
			if (value === true) return true;		//true -- valueOf() not object
			return undefined;							//undefined -- not affirmative true or false
		}
	}
	//=========================================
	return undefined;	//safety for unexpected
	//=========================================
	/**
	 *	create rules based on definitions and specified options
	 */
	function processOptions()
	{
		if ('.keys'.ov(options)) return options;	//options is rules from prior call

		//----- check options type
		if ('EZ.global.setup.key'.ov())			//EASY.js enviornment
		{
			options = EZ.getOptions(arguments,options,'zerovalue');
			//TODO: convert options and use new code??
		}

		return EZisTrueRules(options);
	}
	/**
	 *	return if rule defined; otherwise false.
	 */
	function isRule(opt)
	{
		return rules.keys[opt] != null;
	}
	/**
	 *	return false for: ===undefined ===null ==='' ===false -OR- true for ===true
	 *  else return true or false if exact match in trueValues or falseValues
	 *	otherwise return undefined
	 */
	function checkValues(arg)
	{
		//----- check certian values
		if (arg == null || arg === null || arg === '' || arg === false) return false;
		if (/(number|string)/.test(typeof arg) && isNaN(arg)) return false;
		if (arg === true) return true;

		//----- check true / false lists
		if (checkValuesArray(rules.values[0])) return true;
		if (!checkValuesArray(rules.values[1])) return false;
		return undefined;
		/**
		 *	returns true if value found otherwise false
		 */
		function checkValuesArray(values)
		{
			return values.every(function(value)		//loop until true
			{
				var type = EZ.is(value, RegExp) ? 'regex' : typeof(value);
				switch(typeof type)
				{
					case 'regex': 	return value.test(arg.valueOf());

					case 'boolean':
					case 'number':	return arg.valueOf() == value;	//allow js coercion

					case 'string':	return arg.toString() === value;
					case 'function':return EZ.is(arg,value)
					case 'object': 	return arg === value;
				}
			});
		}
	}
}
/*--------------------------------------------------------------------------------------------------
function EZisTrueLikeValue(arg,options)
{
	return EZisTrueLike(arg, ['value'].concat(options))
}

function EZisFalse(arg,options)
{
	return !EZisTrue(arg, ['false', '-0'].concat(options))
}
function EZisFalseLike(arg,options)
{
	return EZisFalse(arg, [EZtrue, 'false', '-0'].concat(options))
}
function EZisFalseLikeValue(arg,options)
{
	return EZisFalseLike(arg, ['value'].concat(options))
}

function EZ.isTrueLike(arg,options) 	{ return EZisTrue(arg, 		[EZtrue, 'false' '-0'].concat(options)) }
function EZisTrueLikeValue(arg,options) { return EZisTrueLike(arg, 	['value'].concat(options)) }
--------------------------------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------------------------
create rules based on definitions and specified options
---------------------------------------------------------------------------------------------*/
function EZisTrueRules(options)
{
	var rules = {keys:[], index:{}, values:[[],[]], objectValues:[], objectDepth:0};

	//----- define rules and groups
	var ruleDefaults = '+o +# +* +yes +no';
	var ruleDefs = {
		//	rules with true and/or false values
		//   +          -
		'0': [/^[0]$/, /^[^0]$/],
		'#': [/^\d*$/, null],
		'*': [/^[^\d]$/, null],
		yes: [/^(yes|on|true)$/, null],
		no:  [null, /^(no|off|false)$/],

		//  rules without true or false values
		'[]': '',
		'{}': '',
		value: '',
		legacy: '',

		'':''
	}
	/*TODO:
	var ruleGroups = {
		'js-spec': ['-0 +# +* -[] -{} -yes, -no', '+0 +# +* +[] +{} +yes, +no']
	}
	*/

	//-------------------------------------
	//----- populate rules and values array
	//-------------------------------------
	setRules(ruleDefaults.split(' '));
	setRules(EZ.toArray(options,true));

	function setRules(opts)
	{
		opts.forEach(function(opt)
		{
			var groups = opt.match(/^([+-])?(.*)/);
			var plusMinus = groups[1] || '+';
			var key = groups[2];
			var idx = rules.keys.indexOf(key);
			if (idx == -1)
				rules.keys.splice(idx,1);
			rules.keys.push(key);
			rules.index[key] = plusMinus == '+' ? 0 : 1;
		});
	}

	rules.keys.forEach(function(key)
	{
		var idx = rules.index[key];
		var ruleDef = ruleDefs[key];
		if (ruleDef)
			rules.values[idx].push(ruleDef[idx]);
		else if (EZ.isArray(ruleDef) && ruleDef[idx])
			rules.values[idx].push(key);
	});
	return rules;
}
/*--------------------------------------------------------------------------------------------------
If typeof(arg) is boolean, number (includes NaN) or string, the following prototype is called
to return true/false per JavaScript spec.

		return (arg.isTrueLike() !== true && arg.isFalseLike() === false)

false is returned for values of null, undefined, unknown or any typeof(arg) != 'object' as per
the JavaScript spec.

The value returned for Objects deviates from the JavaScript spec that has since the beginning
of time has always returned true for the if ( Expression ) Statement and therefore does not
call either toSting() nor valueOf() defined for custom objects -OR- inherited from Object.

false is also return if the object is the fake generic object returned by EZgetEl() when
no html element is found matching the specified selector as determined by checking for tagName
property of none and the exististance of a childNodes property.

Arrays or ArrayLike objects use the length property as: return arg.length < 1;
(html nodes are excluded by EZisArrayLike() function)

Objects without any properties other than isOwnerProperty() and length if arrayLike, return true.

Lastly the JavaScript "Boolean ==" construct is used as followes:
	return (EZisTrueLike(arg.valueOf() !== true && EZisFalseLike(arg.valueOf() === false)
-------------------------------------------------------------------------------------------------*/
EZ.isFalse = function EZisFalse(arg)
{
	if (/(boolean|number|string)/.test(typeof arg) && arg.isFalse() === false) return true;

	if (arg === undefined || arg == null || typeof(arg) != 'object') return true;

	if (arg.childNodes != null && arg.tagName == 'none') return true;

	if (EZ.isArrayLike(arg) && length < 1) return true;

	if (EZ.isFalse(arg) === false) return true;

	if (EZ.isEmpty(arg)) return true;
}
/*--------------------------------------------------------------------------------------------------
return true if trueLike; false if falseLike otherwise value
zero is NOT falseLike
--------------------------------------------------------------------------------------------------*/
EZ.trueFalseValue = function EZtrueFalseValue(value)
{
	if (EZ.isTrueLike(value)) return true;
	if (EZ.isFalseLike(value)) return false;
	return value;
}
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
/*---------------------------------------------------------------------------------------------
EZ.merge([options,] baseObj, object(s)...)

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
EZ.merge = function EZmerge(options, baseObj /*TODO: [, from]  */)
{
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
	mergeOptions.exclude = EZ.toArray(mergeOptions.exclude, true);

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
						baseObj[p] = EZ.clone(fromObj[p], mergeOptions.maxdepth);
						continue;
					}
				}
				baseObj[p] = fromObj[p];
			}
		}
	});
	return baseObj || {};
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
/*---------------------------------------------------------------------------------------------
EZ.mergeAll(obj1, obj2, ... options))
EZ.mergeAppendOnly
EZ.mergeReplaceOnly

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
EZ.mergeAll = function EZmergeAll(options, obj1, obj2)
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
				{							//otherwise call ourself to merge with global options
					var myOptions = {replace:true, append:false, clone:false};
					options = me.call(me, myOptions, me.options, options);
				}
			}
		}

		  //--------------------------\\
		 //----- now do the merge -----\\
		//------------------------------\\
		while (args.length && !(args[0] instanceof Object))
			args.shift();
			
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
//_____________________________________________________________________________________________
EZ.mergeAll.test = function()
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
EZ.mergeMessages(o, group[, msg])

Collapses duplicate messages into a single message with count of occurances.  Non-duplicate
messages are kept as-is without count.  Optionally classify messgaes by group.

ARGUMENTS:
	o		object used to store message and counts
	group	group name if msg supplied otherwise non-classified msg
	msg		group msg

RETURNS:
	Object containing updated messages and counts -OR- when only called with object argument,
	returns String of unique messages separated by newlines, grouped by keys and with counts
	appended to duplicates as shown below.

		missing argument: myfunc()
		\nInvalid arguments: red x 3, yellow x 1

	When group contains multiple messages, counts are appended to all messages in group.
	Multiple messages within group separated by ", " (plus newline if newline in message).

TODO: formating options
--------------------------------------------------------------------------------------------------*/
EZ.mergeMessages = EZ.collapseMessages = function EZmergeMessages(o, group, msg)
{
	if (!o) o = {};	//if (o == null || typeof(o) != 'object') return '';

	if (group)						//save msg or update msg count
	{
		o[group] = o[group]
			   || (msg
				  ? {}
				  : 0);
		msg ? (!o[group][msg]
			? o[group][msg] = 1
			: o[group][msg]++)
			: o[group]++;
		return o;
	}

	var msg = mergeMessages(o);	//return formatted counters
	return msg;

	function mergeMessages(o, level)
	{
		level = level || 0;
		var sep = (!level) ? '\n' : ', ';
		var msg = '';
		var cnt = Object.keys ? Object.keys(o).length : 0;
		for (var k in o)
		{
			var m = '';
			if (typeof(o[k]) == 'object')
				m = k + ': ' + mergeMessages(o[k], level+1)

			else if (isNaN(o[k]))	//not sure what should be done here
				m = k + '=' + o[k] + '';

			else
				m = k + (o[k] > 1 || cnt > 1
						   ? ' x ' + o[k]
						   : '');
				//m += ']'
			var s = sep + ((msg + m).indexOf('\n') != -1 ? '\n' : '')
			msg += (!msg
					? ''
					: s) + m;
		}
		return msg;
	}
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
		if (!el.undefined && el.id)
			hash = el.id;
		else
			hash = '#' + hash.toString().trimPlus('#');

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
EZ.substring(str, start, end)

return substring without throwing exception -- useful when str may be null or undefined.

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
EZ.setDebugMode = function EZsetDebugMode(hash, img)
{
	var debugMode = typeof(hash) == 'boolean' ? hash
				  : typeof(hash) == 'string' && hash.substr(0,1) == '#'
				  ? /debug/i.test(location+'')
				  : undefined;
	if (debugMode === undefined)
	{
		img = img || hash;
		debugMode = img ? !'.style.border'.ov(img, '').includes('red') : EZ.debugMode;
	}
	EZ.debugMode = Boolean(debugMode);

	if (img) img = EZ(img);
	if (img && !img.undefined)
		img.style.border = EZ.debugMode ? '1px red solid' : '';

	if (!location)
		void(0);		//DW environment -- do nothing
	else if (!EZ.debugMode)
		location.hash = location.hash.replace(/^#?(\bdebug|debug)/, '');
	else if (!location.hash.includes('debug'))
		location.hash = '#debug#' + location.hash.substr(1);

	EZ.show('.debug', EZ.debugMode);
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
		if (arg.length > 0 && delimiter === false) return arg;
		return [].slice.call(arg);
	}
	//----- if string with delimiter option, create Array if delimiter found
	while (typeof(arg) == 'string' && (delimiter || delimiter === '0'))
	{
		if (delimiter.constructor != RegExp)
		{
			if (delimiter === true) delimiter = ',';

			// escape ^ [ or ] to treat as literal inside [...]
			var pattern = delimiter.replace(/([\^\]\[])/g, '\\$1');

			// need pattern of form: \s*[<delimiter(s)>]+\s*
			delimiter = new RegExp('\\s*[' + pattern + ']\\s*');
		}
		return EZ.removeItems( arg.trim().split(delimiter) );
	}
	return [arg];
}
//___________________________________________________________________________________________________
EZ.toArray.test = function()
{
	var divsClone = EZ.cloneNodes(t_divs,false);
	EZ.test.run(t_divs, false 		, {EZ: {ex:divsClone  }});

	EZ.test.run(''					, {EZ: {ex:[]  				}})
	EZ.test.run('testFolder', ';'	, {EZ: {ex:['testFolder']  	}})
	EZ.test.run('test;For ; a', ';'	, {EZ: {ex:['test', 'For', 'a']  }})
	EZ.test.run(null				, {EZ: {ex:[]  				}})
	EZ.test.run(true				, {EZ: {ex:[true]  			}})
	EZ.test.run(false				, {EZ: {ex:[false]  		}})
	EZ.test.run(1					, {EZ: {ex:[1] 				}})
	EZ.test.run([1,2,3]				, {EZ: {ex:[1,2,3]  		}})
	EZ.test.run('1,2,3', true		, {EZ: {ex:['1','2','3']	}})
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

	EZ.test.run(t_divs, false 		, {EZ: {ex:t_divs  			}});
	EZ.test.run(t_radios, false 	, {EZ: {ex:t_radios  		}});

	EZ.test.run(t_doc				, {EZ: {ex:[t_doc]  	}});
	EZ.test.run(t_none 				, {EZ: {ex:[t_none]  	}});
	EZ.test.run(t_tags 				, {EZ: {ex:[t_tags]  	}});
	EZ.test.run(t_tags[0]			, {EZ: {ex:[t_tags[0]]  }});
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
			{	//pattern taken from EZ.parse.java for consistancy -- more complex than needed
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
global constants
---------------------------------------------------------------------------------------------*/
EZ.global = {
	legacy: {					//EZ.isLegacy() returns true when legacy key not defined
		na:undefined, n:null,	//test data??
		EZmatchPlus: true,
		EZisEmpty: false,
		EZbindElements: false,
		EZisCaller: false,

		EZeventAdd: true,					//required for regex assistant
		EZshowHide: true,							//	''
		EZclassAction: true, EZhasClass:true,		//	''

		EZgetEl:false, EZgetEl_notFoundnull:true,
		EZgetStyle:false,
		EZtechSupport: true
	},
	messages: {					//EZ.init() copies to EZ.messages
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
/*---------------------------------------------------------------------------------------------
1st called after EZ.prototypes.js loads then after any other js file loads
---------------------------------------------------------------------------------------------*/
EZ.global.setup = function EZglobal_setup(prefix, filename)
{
	if (filename == 'prototypes')
	{
		EZ.EOL = String.fromCharCode(172);	//used to show end of non-object value
		EZ.DASH = '&#8209;';		//non-breaking dash
		EZ.DOT = String.fromCharCode(8226);	//base marker -- used to create compound marker
		EZ.DOTS = ('&nbsp;.').dup(3);
		EZ.MORE = (EZ.DOT + '&nbsp;').dup(3);
		EZ.LINE = '&#8212;'
		EZ.SPACE = String.fromCharCode(160);
		EZ.SPACES = ' '.dup(120);
		EZ.TRUE = 'true'.wrap();
		EZ.FALSE = 'false'.wrap();
		EZ.BLANK = 'blank'.wrap()
		EZ.EMPTY = 'empty string'.wrap()
		EZ.NULL = 'null'.wrap();
		EZ.NAN = 'NaN'.wrap();
		EZ.UNDEFINED = 'undefined'.wrap();
		EZ.NA = 'not loaded'.wrap();
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

EZ.todo = function EZtodo() {};
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

EZ.dom.attributes = ('accept accept-charset accesskey action align allowtransparency alt '
					   + 'border bottom center charset checked cols coords disabled enctype '
					   + 'frameborder height href hspace id justify label left longdesc '
					   + 'marginheight marginwidth maxlength method middle multiple name onreset onsubmit '
					   + 'readonly rel rev right rows scrolling selected shape size src style '
					   + 'target title top type usemap value vspace width wrap' ).split(" ");

EZ.event.names = 'abort autocomplete autocompleteerror beforecopy beforecut beforepaste '
			   + 'blur cancel canplay canplaythrough change click close contextmenu '
			   + 'copy cuechange cut dblclick drag dragend dragenter dragleave '
			   + 'dragover dragstart drop duratichange emptied ended error focus '
			   + 'input invalid keydown keypress keyup load loadeddata loadedmetadata '
			   + 'loadstart mousedown mouseenter mouseleave mousemove mouseout mouseover '
			   + 'mouseup mousewheel paste pause play playing progress ratechange '
			   + 'reset resize scroll search seeked seeking select selectstart show '
			   + 'stalled submit suspend timeupdate toggle volumechange waiting '
			   + 'webkitfullscreenchange webkitfullscreenerror wheel'.split(' ');
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
