/* global 
EZfileToUrl, EZdisplayDropdown, EZselectOptionRemove,

EZ, dw:true, DWfile, e:true, g  */
var e;
(function jshint_globals_not_used() { e = [	//global variables and functions defined but not used

EZselectOptionRemove,

e, g, dw, DWfile]
});
/*--------------------------------------------------------------------------------------------------
EZ.debug(o, options)
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
TODO:
--------------------------------------------------------------------------------------------------*/
EZ.debug = (function _____EZdebug_____()
{
	EZ.defaultOptions.debug = {						//default options
													//associated css in EZcommon.css
		tags: {
			debug: 'EZdebugImage',
			nosave: 'EZnosaveImage'
		},
		mode: false,
		nosave: false,	
		enabledIconClass: 'EZenabledBorder',
		enabledBodyClass: 'debugOptions',
		
		name: 'EZdebug.options',					//object name
		version: '08-15-2016'						//and version
	}
	//__________________________________________________________________________________________________
	/**
	 *	constructor for _init() -- subsequently calls defaultFumctiom
	 */
	function EZdebug()
	{
		if (this instanceof arguments.callee)		//called as constructor
		{								
			this._mode = false;
			return;
		}
													//NOT called as constructor
		return EZ.debug.setMode.apply(EZ.debug, [].slice.call(arguments));	
	}
	//__________________________________________________________________________________________________
	/**
	 *	creates new instance but copies all properties and prototypes to static function so EZ.debug()
	 *	still valid and calls defaultFumction with this context.
	 */
	var _init = function(mode /* EZ.debug legacy */)
	{
		var fn = new EZdebug();
		for (var key in fn)
			EZdebug[key] = fn[key];
		
		if (typeof(mode) == 'boolean'					//EZ.debug set -- backward compatibility
		|| (typeof(mode) == 'string') && mode !== '')
			void(0);
		
		else if (typeof(location) != 'undefined')		//check hash if not DW enviornment 
		{
			var hash = (typeof(location) != 'undefined') ? location.hash : '';
			mode = typeof(mode) == 'boolean' ? mode
				 : (hash.substr(1) == '#debug') ? true
				 : undefined;
		}

		EZ.event.add(window, 'onload', function()		//_init() initialize options plus...
		{												
			//======================================================================================
			var options = EZ.store.get('debugOptions$', {});
			//======================================================================================
			options = EZ.debug._options = EZ.debug.options = EZ.options.call(EZ.defaultOptions.debug, options);
			
			var el = EZ(options.tags.debug, null);		//return null if not found
			if (mode === undefined)
				mode = options.mode;
			if (mode || el)
				EZ.debug.setMode(mode, el)		
			
			if (options.nosave)
				EZ.debug.setSaveSuspended(options.nosave);
		});
		return EZdebug;
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZdebug.prototype.toString = function()
	{
		var str = '...';
		if (EZ.debug)
		{
			str = 'debug is '
				+ (EZ.debug._mode ? 'on' : 'off');
			if ('EZ.debug.options.nosave'.ov())
				str += ' [saves suspended]';
		}
		return str;
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZdebug.prototype.getMode = function()
	{
		return this._mode;
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZdebug.prototype.setMode = function(mode, img)
	{
		var options = EZ.debug.options;
		if (EZ.isEl(mode))
		{
			img = mode;									//check if img specified
			mode = EZ.hasClass(img, options.enabledIconClass) ? false 
				 : !img.style.border.includes('red');	//backward compatibility
		}
		
		if (!EZ.isEl(img))								//if img specified, save as tag if not defined
			options.tags.debugImage = options.tags.debugImage || img;
		else											//otherwise ck specified tag or default class
			img = EZ(options.tags.debug || options.debugTag, null);
		
		if (mode === undefined)							//get existing mode if undefined		
			mode = this._mode;

		EZ.debug._mode = options.mode = mode;			//save updated mode
		EZ.addClass(img || options.tags.debugImage, options.enabledIconClass, mode);
		
		if (options.enabledBodyClass)
			EZ.addClass('body', options.enabledBodyClass, mode);
		
		EZ.debug.saveOptions(options);
		return mode;
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZdebug.prototype.isSaveSuspended = EZdebug.prototype.getSaveSuspended = function()
	{
		return EZ.debug.options.nosave;
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZdebug.prototype.setSaveSuspended = function(mode)
	{
		var options = EZ.debug.options;
		if (mode instanceof Event)					//if event, assume button clicked
		{
			EZ.event.cancel(mode,true);
			mode = undefined;
		}
		else if (mode instanceof Element)			//if event, assume button clicked
		{
			var evt = 'window.event'.ov();
			if (evt.srcElement == mode)
				EZ.event.cancel(evt,true);
			mode = undefined;
		}
		
		if (mode === undefined)						//toggle if not defined
			mode = Boolean(!options.nosave);
		
		options.nosave = mode;
		EZ.debug.saveOptions(options);
		
		EZ.addClass(options.tags.nosave, options.enabledIconClass, mode);
		return mode;
		//.addClass(this, 'nosave', window.EZ.get(['nosave']).valueList.includes(true))
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZdebug.prototype.saveOptions = function EZdebug_saveOptions(options)
	{
		//===========================================
		EZ.store.set('debugOptions$', options, true);
		//===========================================
	}
	//=====================
	return _init();
	//=====================
})();

/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.log = (function _____LOG_____()
{
	EZ.defaultOptions.log = {					//default EZ.log.options
		active: false,
		pageTag: null,
		pendingCountTag: null,
		filters: { page: [], console: ['default'], trace:['default'] }
	}
	function EZlogItem(callerName, message)		//EZlogItem constructor
	{
		this.callerName = callerName;
		this.message = message;
		this.toString = function()
		{
			var str = '[' + callerName + '] ' + message.join(' ');
			return str;
		}
	}	
	function EZlog()							//EZlog constructor
	{
		if (this instanceof arguments.callee)
		{
			this.active = false;
			this.history = [];					//processed log item
			this.pending = [];					//log items added when log not active
		//	this.callerNames = {};
			return;
		}										  //-----------------------------------\\
												 //----- NOT called as constructor -----\\
		if (!arguments.length) 					//---------------------------------------\\
			return EZ.log;						//return EZ.log.object if no arguments
			
		var args = [].slice.call(arguments)		//otherwise treat as EZ.log.add(...)
		var caller = this;
		return EZ.log.add.apply(caller, args);
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZlog.prototype.toString = function EZlog_toString()
	{
		var str = EZ.log.history.join('\n') + '...';
		return str;
	}
	//__________________________________________________________________________________________________
	/**
	 *	Add log item and display on page and console is not filtered.
	 *  arguments.callee.caller == EZ.log
		'.'.concat(callerName,' .default').ov();
	 */
	EZlog.prototype.add = function EZlog_add(callerName)
	{
		var args = [].slice.call(arguments);
		
		var callerName = EZ.getType(this) == 'String' ? this + ''
					   : (this != window && this != window.EZ) ? this.name
					   : arguments.callee.caller == EZ.log ? EZ.getCallerName(EZ.log)
					   : EZ.getCallerName(true);
					   
		var logItem = new EZlogItem(callerName, args);
		var options = EZ.options.get('log');
		
		var list = (options.active) ? 'history' : 'pending';
		var count = EZ.log[list].push(logItem);
		if (options.active)
			EZ.log.display(logItem);
		else if (options.pendingCountTag)
			EZ.set( options.pendingCountTag, (count ? count + ' pending' : '') );
				
		return logItem + '';
	}
	//__________________________________________________________________________________________________
	/**
	 *	display log items
	 */
	EZlog.prototype.display = function EZlog_display(logItem)
	{
		var callerName = logItem.callerName;
		var regex = new RegExp('(\\b' + callerName + '|\\bdefault\\b)', 'i')
		var filters = EZ.options.get('log.filters') || {};
		Object.keys(filters).forEach(function(logTarget)
		{
			if (!regex.test(filters[logTarget].join(' ')))
				return;
			switch (logTarget)
			{
				case 'console':
					return console.log.apply(window,['['+callerName+']'].concat(logItem.message));
				default:
				//	return EZ.oops(logTarget + ' log -- not implemented');
			}
		});
	}
	//__________________________________________________________________________________________________
	/**
	 *	optional filter type and name
	 *	name		filter name -- e.g. "saveData"
	 *	type		[page (default) | console | trace]
	 */
	EZlog.prototype.isActive = function EZlog_isActive(name, type)
	{
		if (!EZ.log.options.active)
			return false;
		if (!name)
			return true;
		
		var filters = EZ.log.options.filters[type || 'page'];
		if (!filters)
			return false;
		
		return filters.includes(name);
	}
	//__________________________________________________________________________________________________
	/**
	 *	Activate log
	 */
	EZlog.prototype.setActive = function EZlog_setActive(showPending)
	{
		if (!EZ.options.set('log.active', showPending !== false))
			return;
	
		var pending = 'EZ.log.pending'.ov([]);
		if (!showPending) 
			return pending.length;

		while (pending.length)
			EZ.log.display(pending.shift());
	
		EZ.hide(this.options.pendingCountTag);
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZlog.prototype.status = function EZlog_status(el)
	{
		var note = '';
		var status = {
			action: EZ.getCallerName() + note,
			active: this.options.active,
			counts: {history: this.history.length, pending:this.pending.length},
			filters: EZ.options.get('log.filters')
		}
		var msg = EZ.stringify(status,'*');
		
		if (EZ.isEl(el))
			EZ.displayMessage(msg, el);
		
		return status;
	}
	//__________________________________________________________________________________________________
	/**
	 *	clear all log items
	 */
	EZlog.prototype.clear = function EZlog_clear(isTrue)
	{
		if (isTrue === false) 
			return;
		
		var log = new EZlog();
		for (var key in log)
		{
			var o = log[key];
			if (typeof(o) != 'function')
				this[key] = o;
		}
		if ('.options.pendingCountTag'.ov(this))
			EZ.set( this.options.pendingCountTag, '' );
	}	
	//==================================================================================================
	Object.keys(EZlog.prototype).forEach(function(key)
	{														//export / expose prototype functions
		var fn = EZlog.prototype[key];
		if (typeof(fn) == 'function')
			EZlog[key] = fn;
	});
	EZlog.clear();
	return EZlog;
})();
//________________________________________________________________________________________
EZ.log.test = function()
{	
	var msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, , rtnValue];
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
	EZ.test.run( 'this is log message' )
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	//______________________________________________________________________________
	//EZ.test.run(-2, 		{EZ: {ex:-2	,	note:note	}})
	
	//______________________________________________________________________________
	return;
}
//__________________________________________________________________________________________________
EZ.logPlus = (function _____EZ_LOG_NEW_____() {
/**	{
 *
 *__________________________________________________________________________________________________
}**/
	"use strict";							//global closure variables {
	var ___, data, options = {a:0};			
	[data, options]
	//----------------------------------------------------------------------------------------------
	var defaultOptions = function() {		//default EZ.log.options
	//----------------------------------------------------------------------------------------------
	return {
		active: false,
		maxLogItems: 200,
		toStringMax: 10,
		stackOpts: {
			skip: ___.getFunctionNames().concat(['EZlogItem']),
			format: 'html'
		},
		filters: { page: [], console: ['default'], trace:['default'] },
		tags: {
			pendingCountTag: null,
			logNames: {}
		}
	}}
	//----------------------------------------------------------------------------------------------
	var defaultData = function(active) {	//default data
	//----------------------------------------------------------------------------------------------
	return {
		active: Boolean(active),
		pendingCount: 0,
		history: [],						//displayed log items
		pending: []							//log items added when log not active
	}}
	//______________________________________________________________________________________________
	/**
	 *	EZlogItem constructor -- name e.g. EZ.log.call('myType', message)
	 	
	 	ARGUMENTS:
			name 		(String) EZ.log() defaults to callerName if not String
						use dotName to specify sub-names (keys)
			
			message		(String) callerName / lineno if not String
			
			detail		(String or Object) message argument if not String
	
	**/
	function EZlogItem(name, message, detail)	
	{
		var args = name.queue || [].slice.call(arguments);
		var key = '', skip;
		
		if (name == EZ.logger)
		{
			args.shift();
			args = args.shift();
			key = args[1] || '';
			if (typeof(key) == 'string' && key.startsWith('.')) 
				args.splice(1,1);
			else
				key = '';
			skip = ['-',EZ.logger.name];
		}

		if (name["~queue"] || skip)
		{									//queue item saved by EZlog_boot()
			name = args.shift();
			message = args.shift();		
			detail = args.shift();
		}
		else if (name instanceof String || typeof(name) == 'string') 
			name += ''
		
		if (message && typeof(message) != 'string')
		{
			detail = message;
			message = '';
		}
		
		skip = skip || ___.getFunctionNames().concat(['EZlogItem']);
		var stack = this.stack = EZ.getCaller(skip, 'html');
		
		if (!name)
			name = stack.callerName;

//		var dotName = new EZ.dotNamePlus(name + key);
		var dotName = (name + key).split('.');
		
		this.name = dotName.shift();			//log name is 1st dotName component	
		this.keys = dotName.join('\n').trim();	//key is remaining dotName components or blank
		
		this.message = message || stack.callerName + ':' + stack.line;
		this.detail = detail || '';
		
		this.console = ___.console.bind(this);
		this.toString = _formatValue.bind(this, 'name key');
		this.displayDetails = _displayDetails.bind(this);
	}	
	//..............................................................................................
	//}											//end of data structures
	//==============================================================================================
	/**
	 *	EZlog: calls EZ.log.add() -- not used as constructor -- ignores new() calls
	**/
	___ = function EZlog()							
	{
		if (this && this instanceof ___)		//not used as constuctor
			return null;
			
		var args = [].slice.call(arguments)		//always treat as EZ.log.add(...)
		return ___.add.apply(this, args);
	}
	//______________________________________________________________________________________________
	/**
	**/
	___.toString = function ___toString(name, key)
	{
		var max = options.toStringMax || 10;
		name = name || '-all-';
		var log = _getLog(name) || [];
		
		var logItems = [];
		var isAll = log.every(function(item)
		{
			if (key && item[keys].includes(key)) return true;
			return logItems.push(item.toString()) < max;
		})
		if (!isAll)
			logItems.push('... more');
			
		return logItems.join('\n');
	}
	//__________________________________________________________________________________________________
	___.add = function ___add(message, detail) {		
	/**{
	 *	Add log item -- display on page and/or console if log type is not filtered.
	 *______________________________________________________________________________________________
	}*/
		var logItem = (message["~queue"]) ? new EZlogItem(message)
					: (this != EZ.logger) ? new EZlogItem(this, message, detail)
					: new EZlogItem(this, [].slice.call(arguments));
		
		var log = _getLog(logItem.name, logItem.key);
		log.push(logItem);
		if (log.length > options.maxLogItems)
			log.length = options.maxLogItems;

		log = _getLog('-all-');
		/*
		var fn = function EZlogItem() {};
		fn.logItem = logItem;
		fn.toString = _formatValue.bind(fn.logItem, 'name key');
			log.push(fn);
		*/
		log.push(logItem);
		
		if (options.active)
			___.display(logItem);
		else
		{
			data.pendingCount++;
			_setTag('pendingCountTag', data.pendingCount);
		}
		//return logItem + '';
	}
	//______________________________________________________________________________________________
	function _____PRIMARY_functions_____(){}		//{
	/**																	
	 *
	**/
	___.status = function ___status(el)
	{
		var note = '';
		var status = {
			action: EZ.getCallerName() + note,
			active: options.active,
			counts: {history: data.history.length, pending:data.pending.length},
			filters: options.filters
		}
		var msg = EZ.stringify(status,'*');
		
		if (EZ.isEl(el))
			EZ.displayMessage(msg, el);
		
		return status;
	}
	//__________________________________________________________________________________________________
	/**
	 *	Activate log
	 */
	___.setActive = function ___setActive(showPending)
	{
		options.active = (showPending !== false);
		if (!options.active)
			return;
		___.displayPending();
		EZ.hide(data.options.pendingCountTag);
	}
	//__________________________________________________________________________________________________
	/**
	 *	optional filter type and name
	 *	name		filter name -- e.g. "saveData"
	 *	type		[page (default) | console | trace]
	 */
	___.isActive = function ___isActive(name, type)
	{
		if (!options.active)
			return false;
		if (!name)
			return true;
		
		var filters = options.filters[type || 'page'];
		if (!filters)
			return false;
		
		return filters.includes(name);
	}
	//__________________________________________________________________________________________________
	/**
	 *	re-create data -- breaks links to existing logs -- not safe
	___.reset = function()
	{
		data = this._data = defaultData(data.active);	
		_setTag('pendingCountTag', '');
	}
	 */
	//__________________________________________________________________________________________________
	/**
	 *	clear all logs -- preserves existing log Arrays in case bound to other functions
	 */
	___.clear = function ___clear(isTrue)
	{
		if (isTrue === false) return;
		data.pendingCount = 0;
		
		['pending', 'history'].forEach(function(listKey)
		{
			var list = data[listKey]
			Object.keys(list).forEach(function(key)
			{
				list[key].length = 0;
			});
		});
		_setTag('pendingCountTag', '');
	}	
	//__________________________________________________________________________________________________
	/**
	 *	display pending for active logs
	 */
	___.displayPending = function ___displayPending(name, key)
	{
		if (!options.active)
			return;

		var lists = (name) ? data.pending[name] || {} : data.pending;
		Object.keys(lists).forEach(function(pending)
		{
			pending.slice().forEach(function(item, idx)
			{
				if (key && item.key != key) return;
				
				___.display(item);
				pending.splice(idx,1);
				data.pendingCount--;
			});
		});
		if (data.pendingCount < 0)
			data.pendingCount;

		_setTag('pendingCountTag', data.pendingCount > 0 ? data.pendingCount : '');
	}
	//__________________________________________________________________________________________________
	/**
	 *	display single logItem on active targets if not filtered
	 */
	___.display = function ___display(logItem)
	{
		var name = logItem.name;
		var regex = new RegExp('(\\b' + name + '|\\bdefault\\b)', 'i')
		
		var filters = options.filters || {};
		Object.keys(filters).forEach(function(logTarget)
		{
			if (!regex.test(filters[logTarget].join(' ')))
				return;
			
			switch (logTarget)

			{
				case 'console':
					return logItem.console();
				case 'page':
					return logItem.displayDetails();
				default:
				//	return EZ.oops(logTarget + ' log -- not implemented');
			}
		});
	}
	//..............................................................................................
	[_____PRIMARY_functions_____];		//}	end of primary log functions
	//______________________________________________________________________________________________
	function _____INTERNAL_log_functions_____(){}		//{
	
	//______________________________________________________________________________________________
	function _getLog(name, key) 
	{
		var list = (options.active) ? data.history : data.pending;
		if (!name)
			return list;

		var log = list[name] = (list[name] || []);
		if (key)
			log = log[key] = (log[key] || []);
		return log;
	}
	//______________________________________________________________________________________________
	/**																	
	 *
	**/
	function _displayDetails(item, tag)
	{
		tag = tag || _getTag('.logs.' + item.name)
		if (!tag) return;
		
		var summary = item.toString();
		var details = [];
		summary = summary.replace(/./, function(all,firstLine, rest)
		{
			details = rest.split('\n');
			return firstLine;
		});
		var values = {
			detailsHead: details[0] || '',
			detailsBody: details.slice(1).join('\n'),
			
			action: '',
			name: item.name,
			stack: item.stack,
			notable: item.key || (item.stack ? 'stacktrace' : ''),
			closeDetails: false,
			openDetails: false
		}
		___.addDetails(tag, values);
	}
	//______________________________________________________________________________________________
	/**
	 *
	**/
	var _formatValue = function(format)
	{
		var value = this.message;
		var fmt = (value !== '' && typeof(value) == 'string') ? value
				: (EZ.format && EZ.format.value) ? EZ.format.value(value)
				: (value instanceof Object && !value.hasOwnProperty('toString')) 
					? EZ.toString(value, '*')
				: value + '';
		
		format = format || '';
		if (format.includes('name'))
		{
			fmt = '[' 
				+ this.name
				+ (this.key ? '.' + this.key : '') 
				+ '] ' + fmt; 
		}
		return fmt;
	}
	//__________________________________________________________________________________________________
	/**
	 *
	**/
	function _getTag(name)
	{
		if (!name || !options || !document.body) return;

		var el = name.ov(options.tags);
		if (el instanceof Element)
			return el;

		return options.tags[name] = EZ(el || name, null);
	}
	//__________________________________________________________________________________________________
	/**
	 *
	**/
	function _setTag(name, value)
	{
		var tag = _getTag(name);
		if (!tag) return;
		return EZ.set(tag, value || '');
	}
	//..............................................................................................
	//______________________________________________________________________________________________
	[_____INTERNAL_log_functions_____];		//}	end of internal log functions

	//==============================================================================================
	function _____SHARED_functions_____(){}		//{
	//______________________________________________________________________________________________
	/**
	 *
	**/
	___.console = function ___console(message, details)
	{
		var item = (this instanceof EZlogItem) ? this : {
			name: '',
			message: message || '',
			details: details || '',
			stack: EZ.getStackTrace().slice(1)
		}
		if (!item.message) return;

		var msg = item.toString() + '...';
		var name = item.name;
		
		//				EZ.track('EZ.sync()...\n' + msg.join('\n') + '\n');

		msg = msg.replace(/(.*)[.]{3}\s*/, function(all,prefix)	//name was: EZtrack()...
		{
			name += prefix;
			var space = msg.match(/.*\s(\s*)/);
			return (space ? space[1].substr(1) : '');
		});
		var title = '[' + name + ']' + item.stack[1];
		var stackTrace = {stack: item.stack}
		msg = msg.split('\n').join('\n')

		//==========================================
		console.log(title, stackTrace, '\n',msg)
		//==========================================
	}
	//______________________________________________________________________________________________
	/**																	
	 *
	**/
	___.addDetails = function ___addDetails(tag, values)
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
	 *
	**/
	___.getDetailsNode = function ___getDetailsNode(tagValues)
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
	[_____SHARED_functions_____]	//}	end of SHARED functions
	//==============================================================================================
	var queue = (EZ.log && EZ.log.queue) || [];
	var callback = function()
	{
		queue.forEach(function(q) { ___.add({queue:q}) });
		___.displayPending();
	}
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	e = EZ.common(___, defaultOptions, defaultData, callback);
	data = ___.getData();
	options = ___.getOptions();
	return ___
})();//...end of EZ.log
//________________________________________________________________________________________
EZ.logPlus.test = function()
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
		var options = testrun.getOptions();

		void(msg, results, rtnValue, options)
	}
	//=======================================================================================
	notefn = function(testrun)
	{
		e = testrun;
	}
	//=======================================================================================
	EZ.test.settings( {exfn:exfn} );
	//EZ.test.settings( {legacy:'exclude=isLegacy'} );
	//EZ.test.run(-2, 		{EZ: {ex:-2	,	note:note	}})
	//EZ.test.options( {ex:ex, note:note} )
	//EZ.test.run( ctx, arg, obj )
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	EZ.test.run('simply log message')
	EZ.test.run.call('myLog', 'simply log message')
	EZ.test.run.call('myLog', 'simply log message', 'myKey')
	//_______________________________________________________________________________________
	if (true) return;
	EZ.test.quit;	//script continues but all following test skipped
}//...end of EZ.logPlus.test
/*--------------------------------------------------------------------------------------------------
EZ.trace(heading, text, options)

Add message to trace queue for display by EZtrace.html
Deletes messages already diplayed, more than hour old or more than last 500.

if 2 arguments and 1st (heading) can be options

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
EZ.trace = (function _____EZtrace_____()
{
	EZ.defaultOptions.trace = {				//default options

		mode: false,
		name: '',
		time: 0,
		maxsize: 50,
		hiddensize: 10,						//TODO: ??
		format: 'EZ.toString',
		stacktrace: true,
		
		savedKeys: 'mode name time maxsize hiddensize format stacktrace'.split(/\s+/),
		version: '09-05-2016',

		
		messageDefault: {					
			mode: true,
			time: '',
			heading: '',
			text: ''
		},
		
		traceUpdatesDefault: {				//all EZ.trace() page(s) updates
			time: 0,						//most recent update by any page
			pages: {}						//indivual page updates pass to displayer (EZtrace.html)
		},
		traceUpdatesPageDefault: {
			optionsTime: 0,
			messageTime: 0,
			messageCount: 0
		},
		
		defaultProperties: {
			
			_displayerData: {				//EZtrace.html internal global data
				time: 0,					//last process time
				activePageName: '',
				addedCount: 0,
				addedList: {},				//EZ.counts() list of added messages
				emptyList: [],				//list of pageNames with no messages
				pageDataList: {},			//properties for each currently managed page
			},
			pageData: {						//each page Object in pageDataList
				name: '',
				mode: '',
				status: '',
				formatOptions:{},			//TODO ??
				showingOff: false,
				showTraceOffList: [],			
				selectedFunction: '',
				functionList: [],
				counts: {},
											//data copied to displayerUpdates Object
				time: 0,
				options: undefined,
				messages: [],					
				updatedOptions: {}
			},
			pageDataCounts: {
				displayed:0, hidden:0, filtered:0, total:0
			},
			pageDataMessages: {				//additional displayer properties (plus messageDefault)
				index: '',
				filtered: {}				
			},
			
			_displayerSettings: {			//field values only (class="opt") ??
				reloadSave: false,			//save displayerData whenever traceUpdates processed
				refreshSeconds: 1,			//seconds
				filterSeconds: 5,			//	''
				format: '',
				formatOptions: {}
			},
			
			_displayerUpdates: {},			//displayTime and updated traceOptions entry for...
											//...each page if messages found or options updated
											//saved as ".EZtrace.displayerUpdates@"
			displayerUpdatesPage: {
				time: 0,					//last displayer process time
				options: undefined			//only updated EZ.trace.options if any
			}
		}
	}
	//__________________________________________________________________________________________________
	/**
	 *	constructor for _init() -- subsequently called to add trace message
	 */
	function EZtrace()			
	{
if (true) return;		
		if (this instanceof arguments.callee)
		{								
			this._pageName = '';
			this._messages = [];
			this._traceUpdates = null;				//updated by EZ.trace()
			this._displayerUpdates = null;			//updated by EZtrace.html
			return;
		}
		return _addMessage.apply(EZ.trace, [].slice.call(arguments));
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZtrace.prototype.toString = function()
	{
		var str = this._messages.length + ' queued _messages'
				+ (!this.options.mode ? ' (trace not enabled)' : '');
		return str;
	}
	//__________________________________________________________________________________________________
	/**
	 *	creates new instance but copies all properties and prototypes to static function to allow
	 *	subsequent calls to EZ.trace() for default.
	 */
	var _init = function()
	{
		var fn = new EZtrace();
		for (var key in fn)
			EZtrace[key] = fn[key];
			
		EZ.event.add(window, 'onload', function()
		{
			var pageName = location.pathname.replace(/.*\/(.*)\..*/, '$1');
			var options = EZ.trace.getSavedTraceOptions(pageName);
			EZ.trace.options = EZ.trace._options = EZ.options.call(EZ.defaultOptions.trace, options);
			
			EZ.trace._pageName = pageName;
			EZ.trace.options.name = pageName;
			EZ.trace.options.time = EZ.formatDate();
		});
		return EZtrace;
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	var _addMessage = function _addMessage(heading, text, options)
	{
		if (EZ.trace.options.name == 'EZtrace') 		//bail if called by EZtrace.html (displayer)
			return;
		
		while (EZ.start({lock:true}))
		{	
			EZ.trace._displayerUpdates = null;			//clear prior displayer updates
			_updateTraceOptions(); 
														//trace options must be 3rd arg
			options = EZ.options.call(EZ.trace.options, options);
			if (EZ.trace._pageName != options.name)		
			{											//flush messages when pageName changes
				_saveUpdates();
				this._pageName = options.name;
				this._messages = [];
			}
			
			if (heading instanceof Object)
			{
				if (text === undefined)
					text = heading;
				heading = '';
			}

			if (typeof(heading) == 'boolean')
			{
				options.mode = heading;
				heading = heading ? '@trace enabled' : 'trace disabled';
			}
			else if (!heading && text !== undefined)
			{
				heading = EZ.getConstructorName(text).wrap();
			}
			else if (heading && text === undefined)
			{
				text = heading;
				heading = EZ.getConstructorName(heading).wrap();
			}
			
			
			if (heading.startsWith('@'))
			{
				options.mode = true;
				options.clear = true;
				if (!heading.substr(1))
					heading += 'cleared@';
			}

			if (text instanceof Object)
			{
				text = EZ.toString(text);
			}

			var msg = {							 
				mode:		options.mode,
				time:		EZ.formatDate(EZ.trace.time, 'ms'),
				heading:	heading.toString(),
				text:		(text || ''),
				callerName: EZ.getCallerName(arguments.callee.caller)
			}
			if (options.stacktrace)
			{
				msg.stacktrace = EZ.getStackTrace().slice(4);
				var results = msg.stacktrace[0].match(/at\s+(.*?):(\S*)/);
				if (results)
				{
					msg.callerName = results[1];
					msg.lineno = results[2];
				}
			}
			EZ.trace._mode = EZ.trace.options.mode = options.mode;
			_getMessages().push(msg);
			break;
		}									
		return EZ.finish(EZ.trace.toString(), {timeout:_saveUpdates});	
	}
	//_____________________________________________________________________________
	/**
	 *	return messages
	 */
	function _getMessages()
	{
		return EZ.trace._messages = (EZ.trace._messages || []);
	}
	//______________________________________________________________________________________________
	/**
	 *	called after no activity for 1 second
	 */
	function _saveUpdates()
	{
		var traceUpdates = EZ.trace.getTraceUpdates();
		var formattedDate = traceUpdates.time = EZ.formatDate(new Date(),'ms');

		var ourPageName = EZ.trace._pageName;
		var page = EZ.trace.getTraceUpdates(ourPageName, true);
		
		var displayerUpdates = _getDisplayerUpdates();
		var displayTime = EZ.getTime( EZ.getDate(displayerUpdates.time,1) );
		
		_saveMessages();
		_saveTraceUpdates();
	
		//_____________________________________________________________________________
		/**
		 *	save any messages not processed by EZtrace.html
		 */
		function _saveMessages()
		{
			var messages = _getMessages();
			if (messages.length)			//delete messages already displayed
			{
				while (messages.length && EZ.getTime(messages[0].time) < displayTime)
					messages.shift();
			}
			if (messages.length)
			{
				page.messageCount = messages.length;
				page.messageTime = formattedDate;
			}
			//=========================================================================
			EZ.store.set('.EZtrace.messages.' + ourPageName + '@', messages);
			//=========================================================================
		}
		//_____________________________________________________________________________
		/**
		 *	save EZtrace.traceUpdates and EZ.options if changed 
		 *	prune any pages already processed by EZtrace.html
		 */
		function _saveTraceUpdates()
		{
			var options = EZ.clone(EZ.trace.options, EZ.trace.options.savedKeys);
			if (!EZ.isEqual(options, EZ.trace._savedOptions))
			{
				options.time = EZ.trace.options.time = page.optionsTime = formattedDate;
				//=====================================================================
				var key = _getNameKey('options', ourPageName);
				EZ.trace._savedOptions = EZ.store.set(key, options);
				//=====================================================================
			}
			
			var pages = traceUpdates.pages;
			for (var name in pages)				//delete any page processed by EZtrace.html
			{							
				var pageData = pages[name];
				var optionsTime = EZ.getTime( EZ.getDate(pageData.optionsTime, 2) );
				var messageTime = EZ.getTime( EZ.getDate(pageData.messageTime, 2) );

				if (name == ourPageName && optionsTime < displayTime)
					pageData.optionsTime = 0;	//clear our optionsTime if processed

				if (messageTime < displayTime && optionsTime < displayTime)
					delete pages[name];
			}
			//=========================================================================
			EZ.store.set('.EZtrace.traceUpdates@', traceUpdates);
			//=========================================================================
		}
	}
	//______________________________________________________________________________________________
	/**
	 *	if displayer updated options, merge and update time to now so displayer knows merge occured.
	 *	Save options whenever newer than displayer.optionsDate (including above case and 1st time 
	 *	EZ.trace() called.
	 */
	function _updateTraceOptions(name)
	{
		var displayerUpdates = _getDisplayerUpdates(name);		//updated by EZtrace.html
		var updatedOptions = displayerUpdates.options;
		if (!updatedOptions) return;

		var updatedTime = EZ.getTime(updatedOptions.time, 0);	
		if (updatedTime > EZ.getTime(EZ.trace.options.time))
		{
			EZ.trace.options = EZ.merge(EZ.trace.options, updatedOptions)
			EZ.trace.options.time = EZ.formatDate();
		}
		//=========================================================================
		if (updatedTime < EZ.getTime(EZ.trace.options.time))
			EZ.store.set(_getNameKey('options') + '@', EZ.trace.options);
		//=========================================================================
	}
	//_____________________________________________________________________________
	/**
	 *	get all EZ.trace() page updates or specified pageName.
	 */
	EZtrace.prototype.getTraceUpdates = function EZtrace_getTraceUpdates(name, isCreate)
	{
		//=========================================================================
		if (!EZ.trace._traceUpdates)
			EZ.trace._traceUpdates = EZ.store.get('.EZtrace.traceUpdates@') 
								  || EZ.clone(EZ.trace.options.traceUpdatesDefault, false);
		//=========================================================================
		var allPageUpdates = EZ.trace._traceUpdates;
		delete allPageUpdates.pages.EZtrace;
		if (name)
		{
			var pageUpdates = allPageUpdates.pages[name];
			if (!pageUpdates && isCreate)
			{
				pageUpdates = EZ.clone(EZ.trace.options.traceUpdatesPageDefault, false);
				allPageUpdates.pages[name] = pageUpdates;
			}
			return pageUpdates;
		}
		return allPageUpdates;
	}
	//_____________________________________________________________________________
	/**
	 *	updated by EZtrace.html
	 */
	function _getDisplayerUpdates(name)
	{
		//=========================================================================
		if (!EZ.trace._displayerUpdates) 
			EZ.trace._displayerUpdates = EZ.store.get('.EZtrace.displayerUpdates@') || {};
		//=========================================================================		
		name = name || EZ.trace.options.name;
		return EZ.trace._displayerUpdates[name] || {};
	}
	//_____________________________________________________________________________
	/**
	 *	updated by EZ.trace() -- EZtrace.html specifies name
	 *	if name supplied get: ".name.EZtrace.options@" otherwise "EZtrace.options@"
	 */
	EZtrace.prototype.getSavedTraceOptions = function EZtrace_getSavedTraceOptions(name)
	{
		//=========================================================================
		var options = EZ.store.get(_getNameKey('options', name)) || null;
		//=========================================================================		
		if (options && EZ.getTime(options.time) < EZ.getTime(new Date(),-(1000 * 60 * 60 * 24)))
			options = null;

		return EZ.trace._savedOptions = options;
	}
	//_____________________________________________________________________________
	/**
	 *	
	 */
	var _getNameKey = function(key, name)
	{
		name = name || EZ.trace.options.name;
		return '.' + name + '.EZtrace.' + key + '@'; 
	}

	//==============================================================================================
	return _init();
})();


/*--------------------------------------------------------------------------------------------------
			if (!evalBtn) return EZ.evalError('field id=evalButton not defined');
			if (!scriptEl || typeof(scriptEl) != 'object')
				return EZ.evalError('field theForm.codeEvalScript not defined or form element');
		historyListTag: '',
		favoritesListTag: '',
		favoriteNameTag: '',

--------------------------------------------------------------------------------------------------*/
EZ.script = (function _____SCRIPT_____()
{
	EZ.defaultOptions.script = {			//default options

		listNames: ['history', 'favorites'],
		tags: {},
		script: '',
		sourceTag: '',
		
		listmaxsize: {history:50, favorites:100},
		
		format: 'EZtoString',
		formatOptions: { 
			tostring: {timestamp: false},
			stringify:{spaces:4} 
		},
		append: false,
		enterkey: true,
		saveall: false,						//true to save invalid script
		scriptNameMaxSize: 40,
		
		resultsMaxLines: '',
		resultsTarget: 'textarea',
		resultsTagStyles: {},				//used if resultsTag created
		resultsTagClassNames: ['textBox'],
		
		defaults: {String:'script', Element:'sourceTag'},
		
		name: 'EZ.script.options',
		backupFilename: localStorage.getItem('EZ.script.backupFilename') || 'EZscript.backup.js',
		version: '08-15-2016'
	}
	
	function EZscript(script)				//EZscript constructor
	{
		if (this instanceof arguments.callee)
		{								
			this.script = '';
			this.results = '';
			this.listOptions = {};
			return;
		}
		return EZ.script.run(script);		//not called as constructor
	}
	//__________________________________________________________________________________________________
	/**
	 *	creates new instance but copies all properties and prototypes to static function so EZ.script()
	 *	still valid and calls defaultFumction with this context.
	 */
	var _init = function _init()
	{
		var fn = new EZscript();
		for (var key in fn)
			EZscript[key] = fn[key];
			
		EZ.event.add(window, 'onload', function()	//_init() initialize options plus...
		{
			var _ = EZ.script._;
			//------------------------------------------------
			var options = EZ.options(EZ.defaultOptions.script);
			EZ.script._options = EZ.script.options = options;
			//------------------------------------------------
			for (var key in options._defaults)
				_[key] = options._defaults[key];	//TODO: should be clones
		
			if (!EZ('EZscript').undefined)
				_loadData();
		});
		return EZscript;
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZscript.prototype.toString = function toString()
	{
		var options = ''
		if (EZ.script.options != null)
			options = EZ.script.options.toString();
		var str = 'history:' + this.listOptions.history.optionsList.length.wrap('[')
				+ ' favorites:' + this.listOptions.favorites.optionsList.length.wrap('[')
				+ '\nlast script: ' + (this.script || '[NA]')
				+ options;
		return str;
	}
	//__________________________________________________________________________________________________
	/**
	 *	
		var filename = EZ.constant.configPath + 'Shared/EZ/_browser.html';		
		var url = options.browserurl = this.options.browserurl || filename;
	 */
	var _getBrowserTag = function _getBrowserTag(options)
	{
		var tag = EZ.script.options.tags.browserTag;
		if (tag && !EZ.isEl(tag))
			tag = EZ.script.options.tags.browserTag = EZ(tag);
		
		if (!tag || tag.undefined)
		{
			tag = EZ.script.options.tags.browserTag = EZ.createLayer('', 'A');
			tag.setAttribute('target', '_EZscript');
		}
		
		var url = options.browserurl || EZ.constant.configPath + 'Shared/EZ/_browser.html';
		tag.href = EZfileToUrl(url);
		
		var results = EZ.script.results.replace(RegExp(EZ.DOT, 'g'), '&#8226;');
		results = results.replace(/</g, '&lt;');
		results = results.wrap('<pre>');
		DWfile.write(url, results);
		
		return tag;
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	var _getEl = function _getEl(tag)
	{
		if (tag == window)
			tag = '';
		if (!tag) return '';
			
		var el = EZ(tag, null);
		if (!el)
			return '';
			
		if (EZ.isDW && EZ.getTagType(el) == 'text')
		{
			var btn = _getEl(EZ.script.options.tags.go);
			if (btn)
				btn.focus();
		}
		return el;
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	var _displayValue = function _displayValue(id, value)
	{
		var tag = EZ.script.options.tags[id];
		if (tag && tag != window)
			EZ.set(tag, value);
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	var _getResultsTag = function _getResultsTag()
	{
		var tag = EZ.script.options.tags.results;
		if (tag)
			tag = EZ(tag);
		
		if (!tag || tag.undefined)				//create results tag if not defined or found
		{
			tag = EZ.script.options.tags.results
				= EZ.createLayer(EZ.script.options.resultsTagClassNames, {legacy:false});
		}
		return tag;
	}
	//______________________________________________________________________________________________
	/**
	 *
	 *	Run eval on specified Javascript; display results where specified by resultsTarget
	 */
	EZscript.prototype.run = function EZscript_run(el)
	{
		var options = EZ.options(el, EZ.script.options);
		options.updateLists = ['history'];
		
		var sourceTag = _getEl(options.sourceTag);	
		var scriptTag = _getEl(options.tags.script);
		var historyList = _getEl(options.tags.history);
		var favoritesList = _getEl(options.tags.favorites);
		
		var script = options.script ? options.script
				   : sourceTag ? EZ.get(sourceTag)
				   : scriptTag ? EZ.get(scriptTag)
				   : '';
		
		if (!script)
			return EZ.displayMessage('no script found', sourceTag || scriptTag);
			
		else if (sourceTag)
		{
			if (sourceTag == favoritesList)
			{
				options.updateLists.push('favorites')	
				options.scriptName = EZ.get(favoritesList, 'text');
			}
			else if (sourceTag == historyList)
			{
				EZ.get(historyList, 'text');
				script = historyList.options[historyList.selectedIndex].text;
			}
			EZ.set(scriptTag, script);
		}	
		script = options.script = script.trim().trimPlus(';');
		
		var results,
			isException = false,
			format = /(toString|stringify)/i.test(options.format) ? options.format : 'none',
			formatOptions = '.formatOptions.'.concat(format).ov(options,{}),
			resultsTarget = options.resultsTarget || 'textarea',
			resultsTag = (resultsTarget == 'textarea') ? _getResultsTag(options) : '';
		try
		{	
			//--------------------------------------------------------------------
			results = eval('results=' + script);
			
			results = format.includesIgnoreCase('toString') 	//EZ.toString
				  ? EZ.toString(results, formatOptions)

				  : !format.includesIgnoreCase('stringify') 	//no formatting
				  ? results.toString().trim().replace(/\t/g, '    ')

				  : format.includesIgnoreCase('EZ') 			//EZ|JSON.stringify
				  ? EZ.stringify(results, formatOptions)
				  
				  : JSON.stringify(results, null, formatOptions.spaces || 4);
			//----------------------------------------------------------------------			
		}
		catch (e)
		{
			isException = true;
			results = e.name + ': ' + e.message;
		}
		var value = results;
		value = EZ.formatTime() + ' eval() results'
			  + ' (format: ' + format + '):\n' + value
		
		var maxlines = options.resultsMaxlines || 0;
		if (resultsTag && maxlines && value.count('\n') > maxlines)
		{														//or not all results shown
			EZ.log({script:script, format:format, results:value});
			var lines = value.split('\n');
			lines.length = maxlines;
			lines.push('EZ log contains full results');
			value = lines.join('\n')
		}
		
		if (options.append)
			value+= '\n'.concat(this.results || '').trim();

		switch (resultsTarget)
		{
			case 'trace': 	
			{
				this.results = results;
				EZ.trace( {script:script, format:format, results:results}, true);
				value = 'runScript results (also in trace log):\n' + value;
				break;
			}
			case 'browser': 	
			{
				this.results = value;				
				var tag = _getBrowserTag(options);		//writes value to browser url
				tag.click();
				break;
			}
			case 'textarea': 	
			{
				this.results = value;				
				EZ.set(resultsTag, value);
				EZ.show(resultsTag, 'all');
				setTimeout(function()
				{
					var y = EZ.getBrowserOffsets().scrollY;
					resultsTag.scrollIntoViewIfNeeded();
					if (y != EZ.getBrowserOffsets().scrollY)
						window.scrollBy(0,25);
				},500);
				break;
			}
			default:	return EZ.oops('unknown resultsTarget: ' + resultsTarget)
		}	
		
		if (!isException || options.saveall)
		{
			this.updateLists(options);
			this.script = script;
		}
		
		if (scriptTag)
			setTimeout(function() {scriptTag.select()},10)
		return value;
	}
	//__________________________________________________________________________________________________
	/**
	 *	options.updateLists 	specifies list to update
	 *	options.script			specifies script run or blank if removed
	 *	options.scriptName		specifies favorites name -- if blank and script not, creates default 
	 */
	EZscript.prototype.updateLists = function EZscript_updateLists(options)
	{
		options = EZ.options(options, this.options);
		var updateLists = options.updateLists || 'history';
		var scriptName = options.scriptName || '';
		var timestamp = '';
		if (updateLists.includes('history'))				//update historyList
		{
			if (options.script)
			{
				scriptName = scriptName || _getDefaultScriptName(options.script);
				timestamp = EZ.formatDate();
			}
			if (!this.script || !options.script				//blank if item removed
			|| this.script != options.script)
			{
				_updateList('history', options.script, timestamp);
				this.script	
			}
			if (!this.listOptions.favorites)
				return;
			var not = this.listOptions.favorites.textList.includes(scriptName);
			EZ.addClass(options.tags.addFavorite, 'undim', options.script && !not);
		}
		if (updateLists.includes('favorites'))				//add or delete favorite
		{												
			if (options.script && !scriptName)
				scriptName = _getDefaultScriptName(options.script);
			_updateList('favorites', scriptName, options.script);
			EZ.removeClass(options.tags.addFavorite, 'undim', options.script);
		}
		_displayValue('optionTime', timestamp);
		_displayValue('favoriteName', scriptName);
		EZ.script.saveData();
		
		//______________________________________________________________________________________________
		/**
		 *	update listOptions and associated dropdown if defined
		 */
		function _updateList(listName, defaultText, defaultValue)
		{
			var listOptions = EZ.script.listOptions[listName];
			if (!listOptions)
				return;
			var textList = [options.script].concat(listOptions.textList).remove().removeDups();
			textList.length = Math.min(textList.length, options.listmaxsize[listName] || 20);
			
			var valueList = [];
			var optionsList = [];
			textList.forEach(function(text, idx)			//update listOptions
			{
				if (idx > 0 && text.startsWith('-')) return;
				
				var idx = listOptions.textList.indexOf(text);
				var opt = (idx == -1) ? [defaultText, defaultValue]
						: listOptions.optionsList[idx];
				//valueList.push(listOptions.valueList[idx] || defaultValue || defaultText);
				valueList.push(opt[1]);
				optionsList.push(opt);
			});
			listOptions.valueList = valueList;
			listOptions.optionsList = optionsList;
			
			var list = _getEl(options.tags[listName]);	//update dropdown if defined
			if (list)							
			{
				defaultValue = defaultValue || EZ.get(list);
				listOptions = EZ.displayDropdown(list, optionsList, defaultValue);
			}		
			_displayValue(listName + 'Count', valueList.length.wrap('['));

		}
		//________________________________________________________________________________________
		/**
		 *	
		 */
		function _getDefaultScriptName(script)	
		{	
			var groups = script.matchPlus(/([\w.]+)(?=[^\w])/g);
			var scriptName = script;
			var max = EZ.script.options.scriptNameMaxSize;
			if (!max || scriptName.length < max)
				return scriptName;
				
			scriptName = scriptName.substr(0,max);
			for (var i=0; i<groups.length; i++)
			{
				var offset = groups.end[i]
				if (offset > max) 
					break;
				else
					scriptName = script.substr(0,offset);
			}
			if (script.length > scriptName.length)
				scriptName += (EZ.DOT).dup(3);
			return scriptName;
		}
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZscript.prototype.addFavorite = function EZscript_addFavorite()
	{
		var nameEl = _getEl(EZ.script.options.tags.favoriteName);
		
		var options = {
			updateLists: ['favorites'],
			scriptName: (nameEl ? EZ.get(nameEl) : ''),
			script: this.script
		}
		EZ.script.updateLists(options);
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZscript.prototype.remove = function EZscript_remove(listName)
	{
		var list = _getEl(this.options.tags[listName]);
		if (!list)
			return EZ.oops('specified dropdown list not found: ' + listName);
		
		if (EZ.getTagType(list) == 'text')
			return list.value = '';
			
		else if (list.tagName != 'SELECT')
			return;
	
		var selectedIndex = list.selectedIndex;
		if (selectedIndex == -1)	
			return;
		
		var text = list.options[selectedIndex].text;
		if (!text.trim() || text.startsWith('-'))
			return;
		
		var listOptions = EZ.script.listOptions[listName];
		listOptions.textList.splice(selectedIndex,1);
		
		var options = {
			updateLists: [listName],
			scriptName: EZ.get(list, 'text'),		//next item name
			script: ''
		}
		EZ.script.updateLists(options);
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZscript.prototype.removeAll = function EZscript_removeAll(listName)
	{
		var el = _getEl(this.options.tags[listName]);
		if (!el)
			return EZ.oops('specified dropdown list not found: ' + listName);
		
		if (EZ.getTagType(el) == 'text')
			return el.value = '';
			
		else if (el.tagName != 'SELECT')
			return;
		
		EZ.clearList(el, 'fastclear');
		this.listOptions[listName] = EZ.displayDropdown(el,[]);
		
		var options = {
			listName: [listName],
			script: ''
		}
		EZ.script.updateLists(options);
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZscript.prototype.runOnEnterKey = function EZscript_runOnEnterKey(tag,isTrue)
	{
		EZ.script.options.enterkey = isTrue;
		var el = _getEl(tag);
		if (!el)
			return EZ.oops('Enter key tag not specified or not found', el);
		
		if (!isTrue)
			return el.onkeydown = null;
			
		el.onkeydown = function(evt)
		{
			var keyCode = (window.event) ? event.keyCode : evt.keyCode;
			if (keyCode != 13) 				//bail when enter key NOT pressed
				return true;					

			EZ.event.cancel(evt, true);		//otherwise cancel evt defaultAction and bubble
			return EZ.script.run();			//then run script
		}
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZscript.prototype.saveData = function EZscript_saveData(options)
	{
		options = options || {}
		try
		{													//get non-default fieldValues
			var	fieldValues = EZ.field.getChangedValues(['EZscript']);
			EZ.log('EZscript.saveData', 'saved fieldValues', fieldValues);
			
			var savedData = {
			//	listValues: EZ.get(this.options.listNames).fieldValues,
				listOptions: this.listOptions,
				fieldValues: [].sortPlus.call(fieldValues),
				version: this.options.version
			}
			savedData.timestamp = 'EZ.script.savedData.timestamp'.ov('')
			if (options.debug || !EZ.isEqual(EZ.script.savedData, savedData))
			{
				EZ.script.savedData = savedData;
				EZ.script.options.timestamp = savedData.timestamp = EZ.formatDate();
				//---------------------------------------------------------------------
				var json = JSON.stringify(EZ.script.savedData);
				localStorage.setItem('EZ.script.savedData', json);
				//---------------------------------------------------------------------
			}
			_displayValue('timestamp', savedData.timestamp);
		}
		catch (e)
		{
			EZ.oops(e);
		}
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZscript.prototype.backup = function EZscript_backup(action, el)
	{
		//__________________________________________________________________________________________________
		/**
		 *	
		 */
		var _backupFilename = function(el)
		{
			var filename = (typeof(el) == 'string') ? el
						 : _getEl(el) ? EZ.get(el)
						 : EZ.script.options.backupFilename;
			filename = filename.replace(/\\/g, '/');
			if (!filename.includes('/'))
				filename = EZ.constant.configPath + filename;
			//---------------------------------------------------------------------
			localStorage.setItem('EZ.script.backupFilename', filename);
			//---------------------------------------------------------------------
			EZ.script.options.backupFilename = filename;
			_displayValue('backupFilename', filename);
			return filename;
		}
		//==============================================================================================
		var filename = _backupFilename(el);
		
		switch (action)
		{
			case 'info': 	
			{
				var timestamp = DWfile.getModificationDate(filename);
				timestamp = (timestamp <= 0) ? '' : EZ.formatDate(timestamp);
				
				var size = DWfile.getSize(filename);
				
				var msg = size > 0 ? 'updated: ' + timestamp + '&nbsp; size:' + size
								: 'no backup file';
				_displayValue('backupInfo', msg);
				break;
			}
			case 'backup': 	
			{
				//---------------------------------------------------------------------
				if (!DWfile.write(filename, EZ.script.savedData))
					EZ.displayMessage('file not updated: ' + filename);
				//---------------------------------------------------------------------	
				break;
			}
			case 'read': 	
			{
				//---------------------------------------------------------------------
				var json = DWfile.read(filename);
				//---------------------------------------------------------------------	
				if (!json)
					return EZ.oops('no favorites found', filename);
					
				return EZ.parse(json);
			}
			case 'restore': 	
			{
				var listOptions = EZ.script.backup('read', el);
				if (listOptions)
				{
					EZ.script.listOptions.favorites = EZ.displayDropdown(listOptions,[]);
					this.script = '';
					this.updateLists({});	
				}
				break;
			}
			case 'reset': 	
			{
				var fieldValues = EZ.field.getDefaultValues('EZscript');
				var listOptions = EZ.field.getDefaultListOptions('EZscript');
				
				var options = EZ.script.options;
				options.listNames.forEach(function(name)
				{										
					var list = _getEl(options.tags[name]);
					if (!list) return;

					var items = listOptions[list.id];
					EZ.script.listOptions[name] = EZdisplayDropdown(list, items);
				});
				EZ.set(fieldValues);
				this.updateLists({listNames:EZ.script.listNames});	
				break;
			}
			case 'display': 	
			{
				var what = EZ.script.backup('read', el);
				EZ.displayBrowser( what, 'EZ.script.backup');
				break;
			}
			default:	return EZ.oops('unknown action')
	
		}	
		return filename;
	}
	//__________________________________________________________________________________________________
	/**
	 *	called after page loaded -- before <body onload="...">
	 */
	function _loadData()
	{
		try
		{													//create EZ.script.options from defaults
			var options = EZ.script.options = EZ.options(EZ.defaultOptions.script);		
			
			//---------------------------------------------------------------------
			var json = localStorage.getItem('EZ.script.savedData')
			EZ.script.savedData = json ? JSON.parse(json) : {}	
			//---------------------------------------------------------------------
			
			var savedData = json ? JSON.parse(json) : {}	
			if (savedData.version != options.version)
				savedData = {version: options.version, timestamp:''};
			//savedData.listValues = savedData.listValues || {}
			savedData.listOptions = savedData.listOptions || {};
			savedData.fieldValues = savedData.fieldValues || {};
			
			var log = EZ.field.add(savedData.fieldValues);	//restore saved fieldValues
			EZ.log('EZscript.loadData', 'restored fieldValues', log);
			
			log = EZ.field.add(['EZscript']);				//add fields with default values (not saved)
			EZ.log('EZscript.loadData', 'all EZscript fields', {log:log});
			
			log = EZ.event.trigger(['EZscript']);			//fire events to initialize EZ.script.options
			EZ.log('EZscript.loadData', {'onload events':log})
			
			setTimeout(function()							//after events run...
			{
				options.listNames.forEach(function(name)	//populate saved list(s) options
				{											//...and select save values
					var list = _getEl(options.tags[name]);
					if (list)
					{
						var listValue = EZ.get(list);
						var listOptions = '.'.concat(name,'.optionsList').ov(savedData.listOptions)
									   || [].slice.call(list.options);
						listOptions = EZ.script.listOptions[name] 
									= EZ.displayDropdown(list, listOptions, listValue);
						_displayValue(name + 'Count', listOptions.valueList.length.wrap('['))

						var value = EZ.get(list)
						if (name == 'history' && value.toInt() > 0)
							_displayValue('optionTime', value);
						
						if (name == 'favorites' && list.selectedIndex > 1)
							_displayValue('favoriteName', list.options[list.selectedIndex].text);
					}
				});
				EZ.script.saveData()
			}, 0 );
		}
		catch (e)
		{
			return EZ.oops(e);
		}
	}
	//==================================================================================================
	return _init();
})();

/*--------------------------------------------------------------------------------------------------
base from EZ.todo

used for findSaveIdx
--------------------------------------------------------------------------------------------------*/
EZ.findItem = function _findItem(keyMap, allLists, used)
{
	var lists = allLists.extract( Object.keys(keyMap) );
	
	var foundIdx, foundKey = '', foundUsedIdx, foundUsedKey = '';
	
	lists.forEach(function(key)
	{						
		key = key + '';
		var idx = allLists[key].indexOf(keyMap[key])
		if (idx == -1) 
			return;
		
		if (!used.includes(idx))
		{
			if (foundIdx === undefined
			|| (foundKey.length < key.length))
			{
				foundIdx = foundIdx;
				foundKey = key;
			}
		}
		if (foundUsedIdx === undefined
		|| (foundUsedKey.length < key.length))
		{
			foundUsedIdx = foundIdx;
			foundUsedKey = key;
		}
	});
	return (foundKey) ? foundIdx + '' : '-' + foundUsedIdx;
}
//______________________________________________________________________________________________
EZ.findItem.test = function()
{
	/*NOTES:
		simulates loadSavedResults() id mapping at start of test script then after return 
		from findIten(), simulate appending testrun to EZ.test.data.testrun with saveIdx.
	*/
	//======================================================================================
	var msg, arr, ctx, arg, args, o, obj, note, ex, exfn, notefn, fn, val, rtnValue;
	e = [msg, arr, ctx, arg, args, o, obj, note, ex, exfn, notefn, fn, val, rtnValue];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//======================================================================================
	var testno = 0;
	var testdata = {								//pseudo EZ.test.data
		testrun: {}
	};
	
	var savedResults = [							//pseudo EZ.test.savedesults
		{key: 'Y', id:'good stuff', note:'note1'},
		{key: 'N', id:'plenty now', note:'note2'},
	];
	savedResults.lists = {id:[]};					//new mapping variables
	savedResults.listKeys = ['id'];
	savedResults.used = [];
	
	for (var i=0; i<savedResults.length;i++)		//simulate loadSavedResults() mapping
	{										
		var results = savedResults[i];
		var keys = ['id', 'note', results.key, 'note' + results.key];
		var omitted = savedResults.listKeys.remove(keys);
		var add = keys.remove(savedResults.listKeys);
		var same = savedResults.listKeys.extract(keys)	;
		
		add.forEach(function(key)
		{
			savedResults.lists[key] = Array(savedResults.lists.id.length).fill('');
		});
		same.forEach(function(key)
		{
			savedResults.lists[key].push(results[key]);
		});
		omitted.forEach(function(key)
		{
			savedResults.lists[key].push('');
		});
		savedResults.listKeys = Object.keys(savedResults.lists);
	}
	//======================================================================================
	exfn = function(testrun)
	{
		var test = testrun.getAtgunent('testrun');
		test.testKey = ++testno + test.key
		
		var saveIdx = testrun.getResults();
		test.saveIdx = saveIdx;
		testdata.testrun[test.testKey] = test;
		
		var idx = Math.abs(saveIdx);
		if (!isNaN(saveIdx))
			savedResults.used[idx] = (savedResults.used[idx]) ? savedResults.used[idx]++ : 0;
		
		testrun.setResultsArgument('used', savedResults.used);
		
		testrun.setResults('1st', testdata,'testdata');
		
	}
	//======================================================================================
	EZ.test.settings( {exfn:exfn} );
	//_______________________________________________________________________________________
	/*
	var id1 = 'good stuff';
	var id2 = 'plenty now';
	
	savedResults.lists = {
		id: 	[id1, id2],
		id$: 	[id1+'note', id2+'note'],
		idY: 		[id1+'Y', undefined],
		idN: 		[undefined, id2+'Y'],
		idY$: 	[id1+'noteY', undefined],
		idY$: 	[undefined, id2+'noteY'],
	}
	*/
	//_______________________________________________________________________________________
	var testrun, rtnValue;
	
	testrun = savedResults[0];
	rtnValue = EZ.test.run(testrun, savedResults.lists, savedResults.used)
	
	
	EZ.test.quit;
}
/*--------------------------------------------------------------------------------------------------
EZ.todo(o, options)
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
TODO:
--------------------------------------------------------------------------------------------------*/
EZ.todo = (function _____EZ_toto_____()
{
	EZ.defaultOptions.todo = {		//default options

		filename: 'EZtodo_options_filelist.js',
		
		totals: {checked:0, notes:0, total:0, unused:0},
		todoFileList: {},			//{timestamp:..., counts:{...}} dotName as key
		todoFileListItem: {
			timestamp: '',
			counts: {checked:0, notes:0, total:0, unused:0}
		},
		todofilelistCorrupt: [],
		
		todoDefaultData: {			//saved Object for  each todo data file
			_items: {},				//non-empty todo items -- moved to un-linked when file loaded
			_unused: 				//...until referenced
			{						
				items:[],			//Array of prior un-refernced todo items
				ids:{}				//Arrays of id's associated with each item
//				titles: []			//prior default titles
			},
			_counts: {},			//same properties as totals above
			_savedKeys: '_counts, _items, _unused',
			
			_key: '',				//todo key of item being editted or other incomplete action
									//e.g. linking to unused
			_work: {								
				dotName: '',
				indexKeys: [],
				unusedListOptions: [],
				deletedItems: [],
				setupIds: {},
				setupTitles: {},
				itemsMap: {}		//contains properties for each managed list item optionally
			},						//independent of todo list items linked by key or id.
		},							//See: EZ.todo.setupLink() for details.
		todoDefaultItem: {
			key:'', 
			title:'', 
		//	ids:{}, 
			priority: '',
			checked: '', 
			note:''
		},
		todoContainer: 'tr',
		confirmUnlink: false,
		confirmDelete: false,
		
		tags: {						//tags defined via EZ.options.set('todo.tags...')
			todoFileCount:'',
			todoTotalCount: ''
		},
													
		format: 'EZtoString',		//not used yet
		formatOptions: { 
			tostring: {timestamp: false},
			stringify:{spaces:4} 
		},
		
		//defaults: {String:'script', Element:'sourceTag'},
		
		name: 'EZ.todo.options',
		timestamp: '',
		version: '08-21-2016'
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	function EZtodo(filename, folder)			//EZtodo constructor
	{
		if (this instanceof arguments.callee)
		{										//populated this from EZ.defaultOptions.todo
			/**
			 *	called at end of outer closure function _____EZ_toto_____() to create base Object.
			 *	upon return, prototype functions added and EZ.todo.options created with defaults.
			 *
			 *	_init called by window.onload() and updates EZ.todo.options from saved options
			 *	which includes list of existing todo files
			 */
			var _init = function()				
			{
				var defaultOptions = EZ.defaultOptions.todo;
				EZ.todo._options = EZ.todo.options = EZ.file.read.options(defaultOptions);
				EZ.todo._options.todoDefaultItem = defaultOptions.todoDefaultItem;

				EZ.todo._optionsFile = EZ.file.info;
			}
			EZ.event.add(window, 'onload', _init);
			return;								//and saved options
		}
//		return _todoFileLoad(filename, folder);	//NOT called as constructor												
		//______________________________________________________________________________________________
		/**	
		 *	load todo items from specified file and initialize associated Objects
		 */
		filename = filename || '';
		if (!filename || filename.endsWith('/'))
			filename += 'todo.js';
		
		var todoDefaultData = EZ.defaultOptions.todo.todoDefaultData;
		var data = EZ.todo.__data = EZ.file.read.options(filename, folder, todoDefaultData);
		for (var key in data)
			if (key.startsWith('_'))
				EZ.todo[key] = data[key];

		var file = EZ.file.info;	//.replace(/\./g, '_').split('/').join('.');		
		EZ.todo._file = file;	
		
		//---------------------------------------------------------------------------
		var work = EZ.todo._work;
		for (var key in EZ.todo)				//alternative convenience ref
			if (key.startsWith('_') && key != '_work')
				work[key] = EZ.todo[key];				
		work.dotName = file.basefoldername.concat('/', file.subfolder, file.filename);
		//---------------------------------------------------------------------------
		_reseq();								//build index for saved todo items
		_updateTotals();

		g.work = work;							//debugger convenience
		
		return {items: work._items, unused: work._unused};
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZtodo.prototype.toString = function()
	{
		var str = '...'
		var options = EZ.todo.options;
		if (!options || !options.totals) 
			return str;

		str = '';
		if (EZ.todo._file)
			str += EZ.todo._file.filenameonly;

		var work = EZ.todo._work;			
		var counts = (!work || !work.counts) ? {total:'', checked:'', unlinked:''}
				   : {total: '/' + work.counts.total, 
					  checked: '/' + work.counts.checked, 
					  unlinked: '/' + work.counts.unused}

		var tolals = {
			files: Object.keys(options.todoFileList).length, 
			total: options.totals.total + counts.total, 
		//	checked: options.totals.checked + counts.checked,
			unlinked: options.totals.unused + counts.unlinked
		}
		return JSON.stringify(tolals||'').replace(/["{}]/g, '').replace(/,/g, ' ') + ' ' + str;
	}
	//__________________________________________________________________________________________________
	/**
	 *	return existing or new EZtodoMap Object for specified key.  
	 *	new Objects 
	 *
	 *	new itemsMap Objects are added to EZ.todo.work.itemsMap when created and initially contain 
	 *	default todo item values (blank or checked=false).
	 *
	 *	linkItem() adds EZfields -- EZ.todo.item() replaces values property with EZtodoItem() Object
	 *	when todo is updated or linked to any saved todo item.
	 */
	EZtodo.prototype.map = function EZtodoMap(key, title, ids)
	{
		var options = EZ.todo.options;
		var work = EZ.todo._work;
		if (this instanceof arguments.callee)		//create new Object when called as constructor
		{
			work.itemsMap[key] = this;
			
			this.resetDefaultValues = function()
			{
				var values = this.values = {};
				for (var k in options.todoDefaultItem)
					if (k != 'key')
						values[k] = options.todoDefaultItem[k];
				
				if (work.setupIds[key])
					values.ids = work.setupIds[key];
				
				values.title = (values.title || work.setupTitles[key] || '');
				values.ids = work.setupIds[key] || '';	//restore ids if defined
			}
			this.resetDefaultValues();
			this.values.key = key;
			
		//	if (!work.setupIds[key])				//create ids 1st time map referenced
			{
				this.values.ids = {};
				if (ids instanceof Object)			//top level clone
					this.values.ids = EZ.clone(ids, false);
				else if (ids != null)
					this.values.ids = { id:ids };

				if (title)
					this.values.ids._title = title;
				this.values.ids._key = key;			

				work.setupIds[key] = this.values.ids;			
			}
			return this;
		}
		var map = work.itemsMap[key] || new EZ.todo.map(key, title, ids);
		map.values.ids = work.setupIds[key];		//safety for unexpected
		return map;
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZtodo.prototype.get = function EZtodo_get(key, isCreate)
	{
		if (isCreate === undefined)
			isCreate = false;
		return EZ.todo.item(key, isCreate);
	}
	//__________________________________________________________________________________________________
	/**
	 *	constructor for todo item -- gets defaults from EZtodoMap Object associated with key.
	 */
	EZtodo.prototype.item = function EZtodoItem(key, values)
	{
		if (!key)
			return EZ.oops('key required', arguments);
		
		var map = EZ.todo.map(key, false);		//return existing EZtodoMap Object -- do not create 
			
		if (this instanceof arguments.callee)
		{
			if (!map)
				map = EZ.todo.map(key);		
			values = values || map.values;
			
			if (values.checked === true && !values.note)
				values.checked = 'some';
	
			for (var k in EZ.todo.options.todoDefaultItem)
				this[k] = (k in values) ? values[k] : map.values[k];
			
			this.ids = EZ.todo._work.setupIds[key] || '';
			map.values = this;
			return this;
		}
		
		var item = null;
		if ( !(values instanceof Object) )		//if not item values . . .
		{
			item = (values == 'unused') ?  _findItem(key) : map.values;
			if (!item && !values)
				return undefined;
		}
		if (!EZ.is(item, EZ.todo.item))		
			item = new arguments.callee(key, item);
		
		if (!_isItemEmpty(item, key))			//add to items list if not empty
			EZ.todo._items[key] = item;
		
		//===============
		return item;
		//===============
		//______________________________________________________________________________________________
		/**
		 *
		 */
		function _findItem(key)
		{
			var work = EZ.todo._work;
			var unused = work._unused;
			var ids = work.setupIds[key] || {};

			var keys = Object.keys(ids);
			if (keys.includes('_title'))
				keys = keys.remove('_title').concat(['_title']);
			if (keys.includes('_key'))
				keys = keys.remove('_key').concat(['_key']);

			keys.every(function(k)
			{									//for each index...
				var unusedIndex = unused.ids[k];
				var findValue = ids[k] + '';
				if (findValue === undefined || !unusedIndex)
					return true;

				var idx = unusedIndex.indexOf(findValue);
				if (idx == -1) 
					return true;				//next index
				
				item = _linkItem(idx, key);
			});
			return item;
		}
	}
	//__________________________________________________________________________________________________
	/**
	 *	called for each managed list item -- creates EZtodoMap Object linked to saved todo item with
	 *	specified key using ids if supplied or saved todo title or key.
	 *
	 *	saves current managed list item key, title and ids 
	 *
	 *	links saved todo item with  then title.
	 */
	EZtodo.prototype.linkItem = function EZtodo_linkItem(el, key, title, ids)
	{
		if (!EZ.isEl(el))
			return;									
		
		var work = EZ.todo._work;
		work.setupTitles[key] = (title || EZ.formatDate());
		
		var field = EZ.field(el, true);			//create field for primary display tag 
		field.custom.todo_key = key;			
		el.onclick = EZ.todo.action.bind(el, 'checkboxClicked')
		
		var map = EZ.todo.map(key, title, ids);
		map.primary = map.checkbox = map.label = field;
		
		if (field.tagType != 'checkbox')
			return;		// EZ.oops('el argument must be checkbox', el);
		
		if (map.checkbox)
		{
			el = el.parentElement;
			if (el.tagName == 'LABEL')
			{
				el.onclick = EZ.todo.action.bind(map.primary.el, 'labelClicked');
				map.label = EZ.field(el, true);
				map.label.custom.todo_key = key;
			}
		}
		map.container = EZ.getAncestor(map.primary.el, EZ.options.get('todo.todoContainer'));
		EZ(['todo'], map.container).forEach(function(el)
		{										//find and bind todo edit tags (className=todo)
			var action = (el.getAttribute('alt') || el.getAttribute('title')); 
			var editField = map[action] = EZ.field(el, true);
			editField.custom.todo_key = key;
			
			if (action != 'popup' && EZ.getTagType(el) != 'text')
				el.onclick = EZ.todo.action.bind(el, 'edit' + action, key);
		});
		//------------------------------------------------------------------------------------
		var item = EZ.todo.get(key, 'unused');	
		if (!item)								//update display if item not found
			_updateItemDisplay(key);
	}
	//________________________________________________________________________________________
	/**
	 *	move all saved items to top of unused list -- moved back to items when id matches
	 */
	var _reseq = function _reseq()
	{
		var work = EZ.todo._work;
		var items = EZ.todo._items;
		var unused = EZ.todo._unused;
		var processed = [];
		for (var idx=unused.items.length-1; idx>=0; idx--)
		{										//start with saved unused items
			var item = unused.items[idx];	
			var json = EZ.stringify(item);
			if (processed.includes(json))		//discard duplicates -- unlikely now with default titles
			{
				unused.items.splice(idx,1);
				for (var id in unused.ids)
					unused.ids[id].splice(idx,1);
				continue;							
			}
			processed.push(json);
			work.unusedListOptions.push(item.title);
		}
		
		Object.keys(items).reverse().forEach(function(key)
		{										//prepend existing item values to unused
			var item = items[key];
			if (EZ.getType(item.ids) != 'Object')
				item.ids = { _title:item.title, _key:key+'' };

			_linkItem(null, item, 'reseq');		//unlink -- display not updated
		});										//updates unusedListOptions
		_updateTotals();
	}
	//________________________________________________________________________________________
	/**
	 *	link selected unused todo item to selected item in displayed list.
		var key = (idx != null) ? item
				: (item && item.key) ? item.key
				: '';
		if (!key)
			return EZ.oops('invalid key: [' + key + ']', arguments) || {};							
	 */
	var _linkItem = function _linkItem(idx 		/* =null to unlink */, 
									   item 	/* =key when link */, 
									   action)
	{
		var work = EZ.todo._work;
		var items = EZ.todo._items;
		var unused = EZ.todo._unused;
		var key;
		//________________________________________________________________________________________
		/**
		 *	link selected unused todo item to selected item in displayed list.
		 */
		var _titleNote = function(title, titleNote)
		{
			title = title || '';
			if (titleNote == 'reseq')
				titleNote = '';

			var rtnObj = {title:title, clean:title , note:title}

			var regex = RegExp('\\s*\\[\\w+ @ .*\\]\\s*');
			title = rtnObj.clean = title.replace(regex, '').trim();

			titleNote = (titleNote) ? titleNote = ' [' + titleNote + ' @ ' + EZ.formatDate() + ']' : '';
			rtnObj.note = title + titleNote;

			return rtnObj;
		}
		//========================================================================================
		if (idx != null)									  //--------------------------\\
		{													 //----- link unused item -----\\
			var values = unused.items[idx];					//------------------------------\\
			key = item;
			item = new EZ.todo.item(key, values);			//create new item -- replaces map.value
			action = action || 'link';

			unused.items.splice(idx,1);						//remove item from unused lists
			for (var id in unused.ids)
				unused.ids[id].splice(idx,1);
			work.unusedListOptions.splice(idx,1);			//dropdown
			
			_updateItemValue(key, action);
		}													  //--------------------------------\\
		else												 //----- unlink / add to unused -----\\
		{													//------------------------------------\\
			key = item.key;
			delete items[item.key];							
			action = action || 'unlink';

			unused.items.unshift(item);						//prepend to unused.items list...
															//...and all existing indexes
			item.ids = item.ids || {_key:key}
			var keys = Object.keys(item.ids).sort();		//all susequently prepended indexes must
			if (!EZ.isEqual(keys, work.indexKeys))			//include all these these indexKeys
				keys = work.indexKeys = Object.keys(item.ids).concat(work.indexKeys).removeDups().sort();
			keys.forEach(function(id)				
			{
				unused.ids[id] = unused.ids[id] || [];
				unused.ids[id].unshift(item.ids[id]+'');		//undefined for omitted indexes
			});
			
			var title = (item.title || '').trim() || (item.note || '').replace(/\n/g, '').substr(0,50);						
			var titleNote = action.replace(/reseq/, item.timestamp || '');
			var titleObj = _titleNote(title, titleNote);
			work.unusedListOptions.unshift(titleObj.note);	//update dropdown options
			if (action == 'reseq')
				return;
		
_updateItemDisplay(key, action);
		}
		_updateTotals();		
		return item;
	}
	//__________________________________________________________________________________________________
	/**
	 *	update item and map.values based on action
	 */
	var _updateItemValue = function _updateItemValue(key, action)
	{
		if (!key)
			return EZ.oops('key required', arguments);
		
		var map = EZ.todo.map(key);
		
		var checked = map.values.checked;
		var isChanged = false;		
		switch (action)
		{
			case 'link': 	
			{
				break;
			}	
			case 'undelete':
			{
				if (!map.deleted)
					return EZ.oops('no deleted values found') || EZ.oops.message;
					
				else if (EZ.is(map.deleted, EZ.todo.map))
					map.values = map.deleted;			//restote deleted item
					
				else									//restore canceled changes
				{
					for (var k in map.deleted)
						map.values[k] = map.deleted[k];
				}
				delete map.deleted;
				checked = map.values.checked;
				isChanged = true;
				break;
			}
			case 'delete': 	
			{
				map.deleted = map.values;
				map.resetDefaultValues();
				checked = false;
				isChanged = true;
				break;
			}
			case 'checkbox': 							//item created or updated if checked not false
			{
				action = '';
 				checked = map.checkbox.el.checked;
 				var is3way = !map.values.note;			//el.checked is false for some so el.checked..
				if (is3way)								//...always true if 3way (unless delete call)
					checked = (map.values.checked === 'some') ? false : 'some';
				isChanged = checked != map.values.checked;
				break;
			}	
			case 'editsave': 	
			case 'editclose': 	
			{
				action = 'updated';
				for (var k in EZ.todo.options.todoDefaultItem)
				{
					if (!map[k]) continue;
					var value = EZ.get(map[k].el);
					if (value !== EZ.get(map[k].el)) continue;
					map.values[k] = value;
					isChanged = true;
				}				
				break;
			}
			case 'editcancel': 	
			{
				map.deleted = {};
				for (var k in EZ.todo.options.todoDefaultItem)
				{
					var el = _getEl(map[k])
					if (el)
						map.deleted[k] = EZ.get(el);
				}				
				_updateItemDisplay(key, action);
				return;
			}
			default:	return EZ.oops('unknown action: ' + action)
		}	
		checked = (!isChanged && !checked) ? checked	//keep blank or false
				: (checked === true && !map.values.note) ? 'some'
				: (checked !== '' && map.values.note) ? true
				: checked;	
		map.values.checked = checked;
		
		if (_isItemEmpty(map.values, key))
		{										
			delete EZ.todo._items[key];
			if (checked)
				map.values.checked = '';
			isChanged = true;
		}
		else
		{			
			var item = EZ.todo.get(key, true);			//get existing item or create
			if (!item.timestamp)						//timestamp only in item not map ??	
				isChanged = item.timestamp = EZ.formatDate();	
		}
		if (isChanged)
		{
			_updateTotals();
			_updateItemDisplay(key, action);		
		}
		return isChanged;
	}
	//__________________________________________________________________________________________________
	/**
	 *	update label className, checkbox checked -AND- reset or update tag title(s)
	 */
	var _updateItemDisplay = function _updateItemDisplay(key, titleNote)
	{
		if (!key)
			return EZ.oops('invalid key: [' + key + ']');							
			
		var work = EZ.todo._work;
		var map = EZ.todo.map(key);
		var msg;
		var isLinked = Boolean(work._items[key]);			//i.e. not empty
		var checked = isLinked ? map.values.checked : false;
		
		var className = map.label.className.replace(/\btodo_.*\b/g, '').trim();
		className += (className ? ' ' : '')
				   + (isLinked ? 'todo_yes' : 'todo_no')
				   + (titleNote ? ' todo_' + titleNote : '');
		
		if (checked === true)
			 className += ' todo_checked';
		else if (checked == 'some')
			className += ' todo_some';
		else	//?? if (isLinked)
			className += ' todo_unchecked';
		
		map.label.setClassName(className.trim());			//update label or checkbox className
		
		if (map.undelete)									//reset and/or update titles
			map.undelete.resetInitialAttribute('title');
		map.label.resetInitialAttribute('title');
		if (isLinked && map.values.note)
		{
			msg = map.label.getInitialAttribute('title')
				+ ' -- '
				+ 'note length [' + map.values.note.length +']';
			map.label.el.title = msg.trimPlus(' -- ');
		}
		else
		{
			var is3way = (checked == 'some');					//...and checkbox
			EZ.field.toggleCheckbox(map.checkbox, checked, is3way);
			map.label.el.title = (is3way) ? 'no notes entered' : '';
		}
	}
	//__________________________________________________________________________________________________
	/**
	 *	todo item edit window opened -- init form fields -- but item NOT created until save or close
	 */
	EZtodo.prototype.open = function EZtodo_open(el)
	{
		var work = EZ.todo._work;							
		var key = (typeof(el) == 'string') ? el
										   : '.EZfield.custom.todo_key'.ov(el);
		if (!key)
			return EZ.oops('todo key unknown', el);
			
		var map = EZ.todo.map(key);					//set edit field to current map values
													
		if (map.values.checked === '')				//set checkbox true while edit window open
			map.checkbox.el.checked = true;			//changed on close to match editted values
		
		if (el == key)								//uncancel -- open popup with current field values
			EZ.show(map.popup);
		else if (el.isVisible())
			return;
		else
		{
			for (var k in map.values)
				if (typeof(map.values[k]) != 'object')
					_displayValue(map[k], map.values[k]);
			
			if (map.values.title != work.setupTitles[key])	//hide or show reset title button
				EZ.removeClass(map.resetTitle, 'todo_default');
		}
		var item = EZ.todo.get(key) || {};
			_displayTimestamp(map.timestamp, item.timestamp);
		work.edit = el;										//indicate edit window open
		work.key = key;		
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZtodo.prototype.action = function EZtodo_action(action, key, value, evt)
	{
	//	var options = EZ.todo.options;
		var el = EZ.isEl(this) ? this : {'undefined':true};
		if (key instanceof Element)
		{
			el = key;
			key = '';
		}
		else if (key instanceof Event)
		{
			evt = key;
			key = '';
		}
		else if (!/(string|number)/.test(typeof(key)))
		{
			evt = value;
			value = key;
			key = '';
		}
		if (value instanceof Event)
		{
			evt = value;
			value = undefined;
		}
		if (evt instanceof Event && el.undefined && evt.target)
			el = evt.target;
			
		key = (el.EZfield) ? el.EZfield.custom.todo_key
						   : (key || EZ.todo._key);
		var work = EZ.todo._work;
		var map = key ? EZ.todo.map(key) : {checkbox:false};
		
		g.map = map;									//debugger convenience
		g.el = el;
		g.evt = evt;
		g.action = action;
			
		var msg, tags, idx, list;
		if (key)
			EZ.displayMessage();
			
		switch (action)
		{												//---------------------------------
			case 'unusedList':							//build and display un-linked items
			{											//---------------------------------	
				list = work.unusedList = _getEl(EZ.todo.options.tags.unusedList);
				EZdisplayDropdown(list, work.unusedListOptions);
				
				if (work.selectedItemKey)				//displayed item already selected
					_displayValue('unusedPrompt', 'select item for selected TODO');
				else
					_displayValue('unusedPrompt', 'select item then select displayed TODO');
				
				list.onchange = EZ.todo.action.bind(list, 'unusedSelected');
				list.size = Math.min(25, work.unusedListOptions.length+1)
				return;								
			}
			case 'unusedNote':							//------------------------------------
			{											//unused item selected from dropbox		
				idx = el.selectedIndex;					//------------------------------------
				var goArrow = _getEl(EZ.todo.options.tags.unusedSelected);
				goArrow.onclick = EZ.todo.action.bind(list, 'unusedSelected');
				return;								
			}
			case 'unusedSelected':						//------------------------------------
			{											//go arrow selected from dropbox		
				idx = el.selectedIndex;					//------------------------------------
				if (idx == -1)
					return _displayValue('unusedNote','');
				
				var note = work._unused.items[idx].note || 'no note entered'.wrap();
				_displayValue('unusedNote',note);
				
				work.unusedListIndex = idx;
				if (work.selectedItemKey)				
				{										//displayed item already selected
					_linkItem(idx, work.selectedItemKey, 'linked');
					break;								//save changes
				}												
				tags = EZ('todo_no', true);
				if (tags[0].undefined)
					tags = EZ('todo_yes', true);
				if (tags[0].undefined)
					return;
				else
				{
					tags.forEach(function(el)			//highlight un-linked checkbox(s)
					{									//dim linked items	
						var map = EZ.todo.map(el.EZfield.custom.todo_key);
						EZ.addClass(map.container, 'todo_linking');
					});
					EZ.addClass('body', 'todo_linking')
				}
				EZ.displayMessage('click on TODO item for selected item',el)
				return;									//no changes to save
			}
			case 'unusedClear':
			case 'unusedClose':							//------------------------------------
			{											//unused dropdown list popup closed
				EZ.displayMessage();					//------------------------------------
				if (work.linkingTags)
				{
					work.linkingTags.clear();
					work.linkingTags = work.unlinkKey = '';
					if (el && el.EZfield)
						el.EZfield.resetInitialAttribute('title');
					else void(0);
				}
				return;									//no changes saved ??
			}
			case 'labelClicked':						//------------------------------------
			case 'checkboxClicked':						//todo checkbox label clicked
			{											//------------------------------------
				if (!work.unusedListIndex)
				{										//not linking unused -- update checkbox value;
					if (evt)								
						EZ.event.cancel(evt);			//kill checkbox bubble
						
if (EZ.popup.tags.includes(map.popup.el))
	EZ.popup.hide(map.popup);
					
					if (!_updateItemValue(key, 'checkbox'))	
						return;
					break;
				}
				
				EZ.todo.action('unusedClear');			//clear dim classes
				
				_linkItem(work.unusedListIndex, key, 'linked');
				work.unusedListIndex = undefined;
				
				list = work.unusedList;
				if (work.unusedListOptions.length)		//redisplay dropdown if more unused items
					EZ.todo.action('unusedSelected');				
				break;
			}
														//------------------------------------
			case 'editunlink':							// unlink / move todo to unused list
			{											//------------------------------------				
				while (!work.unlinkKey)
				{
					tags = EZ('todo_no', true);
					if (tags[0].undefined)
						break;
					
					work.linkingTags = EZ.markers(action);
					tags.forEach(function(el)
					{									//dim linked items	
						var map = EZ.todo.map(el.EZfield.custom.todo_key);
						work.linkingTags.add(map.container, 'todo_linking');
					});
					work.linkingTags.add(map.container, 'todo_linking');
					work.linkingTags.add(map.container, 'todo_selected');
					work.linkingTags.add('body', 'todo_linking');

					msg = 'Click on highlighted TODO to move \n'
						+ 'Click "unlink" again to move to un-linked list\n\n'
						+ 'Click anywhere else to cancel';
					EZ.show(el);
					EZ.displayMessage(msg, {delay:0, floatNode:el});
					el.title = '';
					work.unlinkKey = key;
					EZ.popup.add(el);						//pseudo popup to get control on unprocessed clicks
					return;									//TODO: relies on processClick() call to EZ.popup.hide
				}
				if (work.unlinkKey)
				{
					EZ.todo.action('unusedClear', key)
if (true) return;
					_linkItem(null, EZ.todo.get(key), 'unlinked');		
					msg = 'TODO moved to un-linked list';
					EZ.displayMessage(msg, el);
					work.unlinkKey = '';
				}
				break;
			}
			case 'delete': 	
			{
				if (EZ.popup.tags.includes(map.popup.el))
					EZ.popup.hide(map.popup);
						
				if (_updateItemValue(key, 'delete'))
				{										//message if existing note or title
					msg = 'TODO item Deleted\n';	
					if (map.values.note)
						msg += '[note]: ' + map.values.note.truncate(30);
					EZ.displayMessage(msg, map.label.el);
				}
				break;
			}
			case 'undelete': 	
			{
				if (!map.deleted)						//un-cancel
				{
					return EZ.todo.open(key);
				}
				
				
				msg = _updateItemValue(key, action);
				if (msg !== true)
					return EZ.displayMessage(msg, el);
				break;
			}
			//================================================================
			//----- todo edit window controls ----- key bound to event handler
			//================================================================
			case 'editresetTitle': 								
			{												
				_displayValue(map.title, work.setupTitles[key]);
				EZ.addClass(el, 'todo_default');
				return;
			}
			case 'editclear': 								
			{												
				_displayValue(map.note, '');
				return;
			}
			case 'editundo': 	
			{
				for (var k in map.values)
					if (typeof(map.values[k]) != 'object')
						_displayValue(map[k], map.values[k]);
				return;									//changes not saved 
			}
			case 'editcancel': 							//discard changes -- hide w/o saving
			{
				_updateItemValue(key, action)
				if (map.undelete)
					map.undelete.title = 'undo cancel';
					
				if (map.values.note)
					msg = 'changes canceled \n'
						+ '[note]: ' + map.values.note.truncate(30);
				EZ.displayMessage(msg, map.label.el);
				
				work.key = '';
				delete work.edit;				
				EZ.popup.remove(map.popup, 'noclose');
				EZ.hide(map.popup);
				return;									
			}											
			
			/* jshint ignore:start*/	//FALL-thru
			case 'editClose':							//---------------------------------
			case 'editclose': 							//edit popup closed or save button
			case 'editsave': 							//---------------------------------
			/* jshint ignore:end */
			{											
				if (/(editclose)/i.test(action))
				{
					work.key = '';
					if (!delete work.edit)
						return;
				}
				
				if (!key && work.edit)					//keep open if EZ.hide()  ??????????????????????
					return setTimeout(function() {EZ.show(work.edit)}, 250);
				
				if (!key)								
					return;								//probably EZ.hide('.helpbox') ?????????????????????????
				
				if (!_updateItemValue(key, action))
				{										//bail if no changes
					if (action == 'save' && map.timestamp)
						EZ.displayMessage('no changes', map.timestamp.el)
					return;								
				}
				//break;								//otherwise save changes
			}
			break;
			default:	return EZ.oops('unknown action: ' + action);
		}	
		//---------------------------------------------------------------------------
		var items = EZ.todo._items;						//update changed files
		if (items.length === 0)
			delete EZ.todo._items;
		var unused = EZ.todo._unused;
		if (unused.items.length === 0)
			delete EZ.todo._unused;
		//============================================================================
		if (EZ.todo._items || EZ.todo._unused)
			EZ.file.write(EZ.todo._file, EZ.todo, map.timestamp);
		else
			DWfile.remove(EZ.todo._file.url);
		//============================================================================
		EZ.todo._items = items;
		EZ.todo._unused = unused;
		
		EZ.todo.save(null, map.popup);					//save EZ.todo.options
	}
	//__________________________________________________________________________________________________
	/**
	 *	refresh list of todo files / counts
	 */
	EZtodo.prototype.fileListRefresh = function EZtodo_fileListRefresh(el)
	{
		var options = EZ.todo.options;
		var todoFileList = {};
		options.totals = {checked:0, notes:0, total:0, unused:0};
		options.filelistDropdown = [];
		/**
		 *
		 */
		var _processFolder = function(folder)
		{
			var files = DWfile.listFolder(folder + '/*.TODO.*', 'files');
			files.forEach(function(filename)
			{
				//var file = EZ.file(folder, filename);
				var file = EZ.file(folder + '/' + filename);
				var dotName = file.basefoldername.concat('/', file.subfolder, file.filename);
				while (file.size)
				{
					var fileListItem = options.todoFileList[dotName] || {};
					if (fileListItem.timestamp != file.timestamp)
						fileListItem = EZ.file.read.object(folder + '/' + filename, options.todoFileListItem);
					//	fileListItem = EZ.file.read.object(file, options.todoFileListItem); 
					
					var counts = fileListItem._counts;
					if (!counts)
					{
					 	options.todofilelistCorrupt.push([dotName, file.url]);
					 	break;
					}
					Object.keys(counts).forEach(function(cnt)	//update totals
					{
						options.totals[cnt] += counts[cnt];
					});
					todoFileList[dotName] = fileListItem;
					options.filelistDropdown.push( [dotName.replace(/.*?\//,'.../'), file.url] );
					break;
				}
			});
			var folders = DWfile.listFolder(folder, 'folders');
			folders.forEach(function(subfolder)
			{
				if (subfolder.toLowerCase().includes('history')) return;
				_processFolder(folder + '/' + subfolder);
			});
		}
		//============================================================================================
		EZ.addClass(el, 'wait');
		setTimeout(function()
		{
			for (var i=options.todofilelistCorrupt.length-1; i>=0; i--)
			{
				var url = options.todofilelistCorrupt[1];
				if (!url || !DWfile.exists(url) || DWfile.exists(url+'/'))
					options.todofilelistCorrupt.length = i;
			}
			var folder = 'C:/' + EZ.todo._work._optionsFile.basefolderpath.clip();
			_processFolder(folder);
			EZ.removeClass(el, 'wait');
	
			options.todoFileList = todoFileList;
			
			_updateFileList(true);
			EZ.todo.save();
		}, 500);							//need little time to let hourglass img load
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZtodo.prototype.save = function EZtodo_save(timestampTag, msgTag)
	{
		//============================================================================
		EZ.todo.options.extract = Object.keys(EZ.todo.options).remove('tags');
		EZ.file.write(EZ.todo._optionsFile, EZ.todo.options, timestampTag, msgTag)
		//============================================================================
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	var _updateFileList = function _updateFileList(updated)
	{
		var options = EZ.todo.options;
		var work = EZ.todo._work;
		var list = _getEl(EZ.todo.options.tags.fileList);
		if (!list)
			return;

		if (!updated && list.options.length)
			return;
		
		var opts = [];
		var folder = 'C:/' + work._optionsFile.basefolderpath.clip(work._file.basefoldername.length+1);
		Object.keys(options.todoFileList).forEach(function(dotName)
		{
			var url = EZfileToUrl(folder + dotName);
			opts.push( [dotName.replace(/.*?\//,'.../'), url] );
		});

		if (options.todofilelistCorrupt.length)
			opts = opts.concat('----- out-dated files -----', options.todofilelistCorrupt);
					
		EZ.clearList(list);
		EZ.displayDropdown(list, opts);
		list.size = Math.min(15, Math.max(opts.length, 2));
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	var _updateTotals = function _updateTotals()
	{
		var options = EZ.todo.options;
		var items = EZ.todo._items;
		var work = EZ.todo._work;
		if (!items)									//bail if items not initialized...
			return;
			
		var key, counts = work.counts;			
		for (key in counts)
			options.totals[key] -= counts[key];
			
		var	unusedCount = '._unused.items'.ov(work,[]).length;
		counts = work.counts = {checked:0, notes:0, total:0, unused:unusedCount};
		for (var key in items)
		{
			var item = items[key];
			if (!item) continue;
			counts.checked += item.checked ? 1 : 0;
			counts.notes += item.notes ? 1 : 0;
			counts.total ++;
		}
		for (key in counts)
			options.totals[key] += counts[key]	
		
		if (counts.total)
		{
			var todoFileListItem = options.todoFileList[work.dotName] = options.todoFileListItem;
			todoFileListItem.counts = counts;
			todoFileListItem.timestamp = work._file.timestamp; 
		}
		else delete options.todoFileList[work.dotName];
														//all scripts total count														//display counts
		var ourCount = '.counts.total'.ov(work, 0);
		_displayValue('todoFileCount', ourCount);
			
		var totalCount = '.totals.total'.ov(options, 0);
		_displayValue('todoOtherFileCount', totalCount-ourCount);		
		_updateFileList();
		
		//EZ.addClass(EZ.options.get('todo.tags.unusedLink'), 'visible', unusedCount);		
		EZ.addClass(EZ('body'), 'todo_unlinked', unusedCount);		
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	var _getEl = function _getEl(tag)
	{
		if (!tag) return '';
			
		var el = EZ(tag);
		if (el.undefined)
			return '';
			
		return el;
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	var _displayTimestamp = function(tag, value, defaultValue)
	{
		if (!value)
			return _displayValue(tag, defaultValue || '');
		
		var date = new Date(value);
		(EZ.timestamp().substr(0,10) == EZ.timestamp().substr(0,10)) ? EZ.formatTime(date)
			  														 : EZ.formatDate(date);
		return _displayValue(tag, 'updated @ ' + value);
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	var _displayValue = function(tag, value)
	{
		var el = tag;
		if (typeof(tag) == 'string')
			el = EZ.todo.options.tags[tag];
		else if (EZ.is(tag, EZ.field))
			el = tag.el;
		if (el)
			return EZ.set(el, value);
	}
	//________________________________________________________________________________________
	/**
	 *	if not checked, default title and no notes
	 */
	var _isItemEmpty = function _isItemEmpty(item /* or values.map[key] */, key)
	{
		if (item.checked || item.note)
			return false;

		if (!item.title)
			return true;
		
		var title = EZ.todo._work.setupTitles[key || item.key];
		return (item.title == title);
	}
	//==================================================================================================
	var fn = new EZtodo();
	for (var key in fn)
		EZtodo[key] = fn[key];

	fn.options = EZ.options(EZ.defaultOptions.todo);
	return EZtodo;
})();
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
if (EZ && EZ.global && EZ.global.setup) EZ.global.setup('EZ', 'EZdebug');
