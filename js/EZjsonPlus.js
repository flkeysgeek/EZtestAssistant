/*--------------------------------------------------------------------------------------------------
Dreamweaver LINT global references and definitions  not used here
--------------------------------------------------------------------------------------------------*/
/*global 
EZ, DWfile, 

e:true, g:true, dw:true, f:true
*/
var e;			//global var for try/catch
(function() {[	//global variables and functions defined but not used

e, f, g, dw, DWfile ]});
//__________________________________________________________________________________________________

/*--------------------------------------------------------------------------------------------------
JSON.plus(o, options)
String.formatStack(options)

whats up...

ARGUMENTS:
	String		...
	options		(optional) Object containing one or more of the following properties:
				Array or delimited string (values separated by commas or spaces)
RETURNS:
	true if ... otherwise ...

REFEERENCE:

TODO:
	format: {					//TODO: beta features not implemented - don't think we want
		arrayItemsPerLine: 1,
		arrayMaxlineLength: 80,
		multilineStrings: 'break'	//probably want this
	},

--------------------------------------------------------------------------------------------------*/
EZ.jsonPlus = (function _____EZjsonPlus_____()
{										
	var options = EZ.defaultOptions.jsonPlus = {

		monitor: true,
		script:	false,			//add script to json to reset escaped values when parsed by eval()
		
		circular: false,		/*	"native" throws exception if circular structures found
									"delete" (or false) circular structures deleted
									"escape" (or true) circular structures escaped
								*/
		repeated:'circular',	/*	currently hardcoded to treat same as circular
									TODO: may want options to treat diff from circular
								*/			
		alertLists: [],			/*	JSON reported as invalid if any of specified list not empty
									-OR- list not empty and not included in infoLists below:
								*/
		infoLists: [				//information lists only -- unless specified in alertList
			'escaped_values', 
			'excluded_values', 
			'ignored_constructors',
			'html_elements',
			'functions',
			'deleted_functions'
		],				
		
		escapeList: [],				//internal -- ignore with include items removed
					

		ignore: [					
			//'circular',			//circular structured are deleted if specified -- otherwise escaped
			//'repeated',			//repeated Objects are stringified as separate equal Object
									//			otherwise they are escaped if not specified
									//			add "repeated" to exclude list to omit from json
									
			'script',				//script: only keep functions with enumerable properties
									//			and only keep the enumerable properties
			//'function',				//functions stringified as empty Object -- i.e. native behavior
									//			add "Function" to exclude list to omit from json
			'constructor',			//constructor all Objects and Functions cloned as Objects
									//		  	not original constructor -- does not apply to: 
									//			Date, RegExp, Element or native functions.
									//			Does apply to NodeList or HTMLCollection	??
									
			//Date, RegExp, html, NodeList, HTMLCollection
									
		],						
		exclude: [],				//dotName if starts with "." otherwise key or native function name
		/*
										e.g. Array, Date, RegExp, Element, Function ("native" for all)
										Keys or native functions excluded from all Objects and Functions. 
										Function with enumerable properties NOT excluded if ignore 
										script also specified.
		*/
		include: [						//overrides items in exclude and ignore lists
		],					
		
		html: {							//EZ.format.Element options used to convert Element to Object					
			maxdepth: 4,
			children: true,
			extract:'all', 
			format:'object', 			//must be "object" to escape otherwise value changed
			formatter:'none',
			cloneNode: false,
			ownerKeys: false,
			boundFunctions: false,		//TODO:
			eventFunctions: false,		//TODO:
			exclude: []					//list of selectors excluded	TODO:
		},

		console: '',
		
		validate: false,				//=true validate json reproduces Object
										//creates validate_details if differences
		validateEqualsOptions: {		
			showDiff:25,
			html: true
		},
								
		clone: false,			//returns clone using json -- implies validate
								//="keep" returns json but rtnValue contains clone from json
		
		unquoteKeys: false,
		spaces: 4,
		format: {
			html: {extract:'all', format:'object', formatter:'none'}
		},
		
		safe: true,				//=true clone input Object before escaping Function or Array
								//TODO:		
								//=false to escape Function or Array w/o cloning Original
								//		 (original Object is changed)
								//="backup" clone input Object as backup (test convenience)
								//="json" clone via json if clone needed otherwise uses cloneObject
		
		replacer: null,
		
										
		escapeTypes: [			
			'undefined', 
			'NaN', 				//escaped as Strings
			'RegExp', 'Date',
			'Array',			//named keys / properties appended to Array as escaped Object
			'Element',
			'Function',			//converted to Object of owner properties including inner functions
			'circular',
			'repeated',			//TODO:
			'script',			//escape: fn name and script as escaped property
			'function',
			'constructor'
		],
		
		escapeMarker: 'JSON_escapeMarker',						//wrapped with "@"
		escapeHTML: '@HTML@',
		escapePrefix: 'JSON.plus._temp=',						//used as-is
		escapeSuffix: 'JSON.plus.unescape(JSON.plus._temp);',	//prefixed with semi-colon ";"
		
		defaults: {
			optionGroups: {				
				escapeAll: 		//TODO: nested optionGroups??
				{
					escape: 'Undefined NaN Date RegExp Array Element Function Script'.split(/\s+/)
				},
				basic: {		//NOT escaping: Array, Element, Function or Object constructors
					validate:true, unquoteKeys:true, circular:true,
					escape: 'Undefined NaN Date RegExp'.split(/\s+/),
					info: 'ignored_constructors'
				},
				cloning: {
					validate:true, circular:true,
					escape: 'Undefined NaN Date RegExp Array Element Function Script'.split(/\s+/),
					ignore: 'none',
					clone: true
				},
				save: {
					validate:true, unquoteKeys:true, circular:true,
					//include: 'circular Undefined NaN Date RegExp Array Element Function'.split(/\s+/),
					ignore: ['constructor', 'script']
				}	
			}
		},
		version: '11-25-2016'
	}
	//__________________________________________________________________________________________________
	/**
	 *	creates static / global instance -- set default JSON.plus options
	 */
	var _init = function _init()
	{
		var fn = new EZjsonPlus();
		for (var key in fn)
			EZjsonPlus[key] = fn[key];
		
		JSON.plus = EZjsonPlus;
		JSON.plus._callCount = 0;

		EZjsonPlus.options = EZjsonPlus._options = options;
		return EZjsonPlus;
	}
	//__________________________________________________________________________________________________
	/**
	 *	constructor (or JSON.plus.stringify() shortcut)
	 */
	function EZjsonPlus(obj, options)
	{
		if ( !(this instanceof arguments.callee))	//NOT called as constructor...
		{
			//return new EZ.jsonPlus(options);	
			return EZ.jsonPlus.stringify.apply(EZ.jsonPlus, [].slice.call(arguments));	
		}
		
		if (EZ.jsonPlus) 							//if not called by _init()
		{											//default options for this instance
			options = obj;
			options = this._options = EZ.options.call(EZ.jsonPlus.options, options);
			options.rtnValue = new EZ.jsonPlus.rtnValue();
			for (var fn in EZjsonPlus.prototype)
				this[fn] = EZjsonPlus.prototype[fn];
		}
		else										//bind global rtnValue functions to JSON.plus instance
		{
		}
	}
	/*--------------------------------------------------------------------------------------------------
	JSON.plus.stringify(value, replacer, spaces)
	--------------------------------------------------------------------------------------------------*/
	EZjsonPlus.prototype.stringify = function EZjsonPlus_stringify(value, replacer, spaces)
	{
		var rtnValue = new EZ.rtnValue(true);			//init rtnValue Object
		var rtnData = rtnValue.getData();

		var isTestFunction = EZ.test.isTestFunction();
		if (isTestFunction)
			void(0);
		//if (isTestFunction) debugger;
		
		JSON.plus._callCount++;
		var msg = '';
		var options = {};
		switch (EZ.getType(replacer))					//check replacer
		{
			case 'Null': 								
			case 'Undefined':
				break; 
			
			case 'Function':							//valid replacer
				break;									
			
			case 'Array':
			{
				options.extract = replacer;
				replacer = null;
				break;
			}
			case 'Object': 								//Object is JSON.plus() options
			{
				options = replacer;
				replacer = null;
				break;
			}
			case 'Number':
			case 'String': 								//use as spaces argument
			{
				if (arguments.length == 2)
				{
					options.spaces = replacer;
					replacer = null;
					break;
				}
			}											//FALL-thru if not only 2 args
			/* jshint ignore:start*/	
			default:
			/* jshint ignore:end */
			{											//ignore invalid replacer
				replacer = null;
				msg = 'invalid replacer argument ignored: ' + replacer;
			}
		}
		rtnValue.addMessage(msg);
		
		//-----------------------------------------------------
		options = EZ.options.call(EZ.jsonPlus.options, options);
		//-----------------------------------------------------
		options.spaces = (arguments.length > 2) ? spaces : options.spaces;
		options.replacer = replacer;
		options.isTestFunction = isTestFunction
		
		JSON.plus.stringify.rtnValue = rtnValue;		//backward comptibility / convenience hack NOT
														//...reliable in debugger if other threads run
		delete options.defaults;
		options.ignore = EZ.toArray(options.ignore, ', ')
		options.include = EZ.toArray(options.include, ', ')
		options.exclude = EZ.toArray(options.exclude, ', ')
		options.extract = EZ.toArray(options.extract, ', ')
		options.ignore.push('constructor');				//TODO: allow escape
			
		var json = '';									  //-----------------------------\\
		try												 //----- finally create json -----\\
		{												//---------------------------------\\
			if (options.monitor)					
				replacer = JSON.plus.circularMonitor(options, rtnValue);	
			//=====================================================================================
			json = rtnData.json = JSON.stringify(value, replacer, options.spaces);
			//=====================================================================================
			rtnData.json = json;						
			rtnValue.setOk();							//ok until found diff
			
			//--------------------------------------------------------------------------------------
			if (options.validate || options.clone)		//validate if requested -- setFail() if bad
				JSON.plus.validate.call(this, (rtnData.value || value), json, options, rtnValue);
			//--------------------------------------------------------------------------------------
			
			//--------------------------------------------------------------------------------------
			if (options.unquoteKeys)						
				json = JSON.plus.unquoteKeys(json);
			//--------------------------------------------------------------------------------------
														
			for (var listName in rtnData.lists)			  //---------------------------------------\\
			{											 //----- build alert and info messages -----\\
				var list = rtnData.lists[listName];		//-------------------------------------------\\
				var count = (list instanceof Array) ? list.length
													: Object.keys(list).length;
				if (!options.alertLists.includes(listName)
				&& (options.infoLists.includes('all') || options.infoLists.includes(listName)))
					rtnValue.addInfo( EZ.s('# ' + listName, count) );
				else
				{
					rtnValue.setFail();
					rtnValue.addMessage( EZ.s('# ' + listName, count) );
				}
			}
			
			if (typeof(json) == 'string' && options.script && rtnValue.haveList('escaped_values'))
				json = options.escapePrefix + json + ';' + options.escapeSuffix;
		}
		catch (e)										//most likely caused by circular Object
		{												//...returns pseudo json below
			if (e instanceof Error)							
			{											//message and stacktrace w/o message
				rtnValue.addMessage(e.message);
				rtnValue.addDetails(e.format());	
			}
			else
			{											
				rtnValue.addMessage(e + '');
				rtnValue.addDetails(EZ.getStackTrace());
			}
		}	
		if (json || json === undefined)					//return json if created -- otherwise...
		{
			//======================================================
			return (options.clone === true) ? rtnData.clone 
			//	 : (options.rtnValue) ? rtnValue
				 : json;									
			//======================================================
		}
		
		if (!rtnValue.getMessageString())				//if no json and no message
		{
			EZ.oops('EZ.stringify() failed (reason unknown)');
			rtnValue.addMessage(EZ.oops.message);
			rtnValue.addDetails(EZ.oops.stackTrace);
		}
														//if no json, return message in json format
		json = rtnValue.getMessage().concat(rtnValue.getDetails()).join('\n').trim();
		
		json = json.wrap('"');							//format based on stringified value type
		json = EZ.isArray(value)         ? json.wrap('[]')			//...Array:  [...]
			 : (value instanceof Object) ? '{"": ' + json + '}'		//...Object: {"", "...")
										 : json;					//...String as is: "..."	
	//	rtnData.message = (rtnData.message.length === 0) ? '' : rtnData.message.join('\n');
		return json;
	}
	/*--------------------------------------------------------------------------------------------------
	JSON stringify circular monitor -- originally created to gracefully handle circular structures.
	
	Optionally escapes or deletes circular and repeated Objects as well as most Object types not fully
	supported by native JSON.stringify() -- e.g. Dates, RegExp, Functions html Elements and more...
	--------------------------------------------------------------------------------------------------*/
	EZjsonPlus.prototype.circularMonitor = function EZjsonPlus_circularMonitor(options, rtnValue)
	{
		//var rtnValue = options.rtnValue;
		var rtnData = rtnValue.getData();
			
		var depth = 0,									//_circular_monitor() global variables
			depthKeys = [],				
			dotName = ['$'],				
			processedObj = [],				
			processedKey = rtnData.objectList = [],
			marker = options.escapeMarker.wrap('@'),
			replacer = options.replacer,
			_checkEscape = this.escape;					//reference to JSON.plus.escape()
		//______________________________________________________________________________________________
		/**
		 *	closure function passed to JSON.stringify as replacer fn -- with access to above variables.
		 */
		function _circular_monitor(key, value)
		{									
			if (rtnData.safe === false)
				return undefined;
			if (replacer)									//caller specified replacer -- TODO: test
				value = replacer.call(this, key, value);
			
			delete options.repeatKey;
			var replaceValue = null;
			var ourKey = depth === 0 ? [] : [key];
			var ourDotName = dotName.concat(ourKey).join('.')
			options.dotName = ourDotName;
			
			var obj = this[key];
			var valueType = EZ.getType(obj, 'NaN Element');
				
	//console.log({ key:key, dotName:ourDotName, type:valueType, value:value });
	var d=ourDotName;
	var dd = d;
	void(d,dd);
			if (value instanceof Object)					
			{
				var keys = Object.keys(value);	
				if (value instanceof Array)
				{
					keys = Object.keys(value).join(',').match(/\d+/g) || [];
				}
				var processedIdx = processedObj.indexOf(value); 
				if (processedIdx == -1)						  //-----------------------------\\
				{											 //----- NOT repeated Object -----\\
					processedObj.push(value); 				//---------------------------------\\
					processedKey.push(ourDotName);
															//must escape some types here
					replaceValue = _checkEscape(value, options, rtnValue);	//...Array, Element, Function, RegExp
					
					if (replaceValue === null)				//not escaped		
						void(0);
					
					else if (valueType == 'Array')			//Array	with named properties
						keys.push(obj.length);				//add key with named properties
					
					else if (replaceValue === undefined)	// ??
						return undefined;					//deleted Object
															
															//must replace this[key] for Function, Element
					else if (replaceValue instanceof Object)
						value = replaceValue;
					
					else 									//replaceValue NOT Object (usually String)
					{										//...replaceValue formatted below		
						key = (valueType == 'Array') ? 0 : marker;
						keys = [key]						// ?????????
					}
				}
															  //----------------------------\\
				else										 //----- IS repeated Object -----\\
				{											//--------------------------------\\
					options.repeatKey = processedKey[processedIdx];
					replaceValue = _checkEscape(value, options, rtnValue);
					
					if (replaceValue === undefined)			//delete repeated Object
						return undefined;					
					else								
						keys = [];	
				}
				
				if (keys.length > 0)						//if keys exist, MOVE down a level
				{											//...current or replaceValue is Object
					depth++;								
					if (depth > 1)
						dotName.push(key);
					depthKeys[depth] = keys;
					key = null;								//disable move up
				}
			}
															//if not already escaped, check for non-Object
			else if (!key.includes(marker))					//...escapable types (including Date)
				replaceValue = _checkEscape(this[key], options, rtnValue);
			
			if (replaceValue !== null)
				value = replaceValue;
			
			if (depth > 0 && key !== null					//if same depth and key exists
			&& depthKeys[depth][0] == key)					//...undefined Array items omitted
			{
				depthKeys[depth].shift()
				while (depth > 0 && !depthKeys[depth].length)
				{											//if no more keys, move up
					depth--;
					dotName.pop();
					if (depth > 0)
						depthKeys[depth].shift();	
				}
			}
			//===========
			return value;									//return from circular monitor replacer
			//===========
		}
		//======================						
		return _circular_monitor;							//return _circular_monitor closure function
		//======================						
	}
	//________________________________________________________________________________________________________
	/**
	 *	return escaped value if escapable and not ignored -- null if non-escapable or ignored (not circular)
	 *	return undefined when circular ignored.(Object deleted)
	 */
	EZjsonPlus.prototype.escape = function EZjsonPlus_escape(value, options, rtnValue)
	{	
		options = options || EZ.options.call(EZ.jsonPlus.options);
		rtnValue = rtnValue || new EZ.rtnValue();
		
		var dotName = options.dotName || '';
		var marker = options.escapeMarker.wrap('@');
		
		var valueType = EZ.getType(value, 'NaN Element')
		if (valueType == 'Undefined')
			valueType = 'undefined';
		
		var escapeType = (options.repeatKey) ? 'circular' : valueType;
		if (!options.escapeTypes.includes(escapeType))
			return null;
			
		var isIgnored = (options.ignore.includes(escapeType))		
		
		switch (escapeType)
		{
			case 'circular':	return _escapeRepeated(options.repeatKey);
			case 'Array':		return _escapeArray();
			case 'Element':		return _escapeElement();
			case 'Function':	return _escapeFunction();
			case 'RegExp':		return _escapeRegExp();
			case 'Date':
			{	
				var dateStr = (isNaN(value)) ? value.toString()
							: EZ.format.dateTime(value, 'ms').replace(/-/g, '/');

				return (isIgnored) ? _escapeChanged(dateStr)
								   : _escapeValue("new Date('" + dateStr + "')", dateStr);
			}
			default:							//NaN, Infinity, undefined, ...
			{
				return (isIgnored) ? _escapeChanged(valueType)
								   : _escapeValue(valueType, valueType);
			}
		}
		//______________________________________________________________________________________________
		/**
		 *
		 */
		function _escapeValue(newValue, displayValue)
		{
			var msg;
			/*
			//if (newValue instanceof Object)		//Array, Element or Function
			{
				if (rtnData.safe !== true)		//only allowed on clone of input Object 
				{
					rtnData.safe = false;
					return null;
				}
			}
				*/
			// . . . . . . . . . . . . . . . . .
			switch (valueType)
			{
				case 'Element': 			//Element converted to Object
				{
					msg = dotName.wrap('[]') + ': ' + value.toString();
					rtnValue.addListItem('html_elements', msg)
					
					newValue[marker] = dotName + '=' + options.escapeHTML;
					break;
				}
				case 'Function':			//Function converted to Object
				{
					break;
				}
				case 'Date':
				{
					break;
				}
				case 'RegExp':
				{							//TODO: consider if top level and options.script-true
					//newValue = 'eval("$JSON$marker$=/m/;$JSON$marker$.lastIndex=5");$JSON$marker$)';	
					break;
				}
				/*
				case 'undefined':
				{
					newValue = 'undefined';
					break;
				}
				*/
				default:
				{
					if (typeof(value) == 'object')
						break;
					
					newValue = valueType;					//undefined, NaN, Infinity ...
				}
			}
			// . . . . . . . . . . . . . . . . .

			if (typeof(newValue) != 'object')			//if escaped value not Object, convert to same
			{											//...type as current value type
				var dotNameValue = dotName + '=' + newValue;	
				
				if (!dotName || dotName == '$')			//return String for top level value 
					newValue = marker + ': '+ newValue;	
					
				else if (valueType == 'Array')			//return single item Array if valueType is Array
					newValue = [marker + ':' + dotNameValue];
				
				else									
				{										//otherwise return as single property Object
					var obj = {};
					obj[marker] = dotNameValue;
					newValue = obj;
				}
			}
			
			msg = (dotName && dotName != '$') ? dotName + '=' : '';
			rtnValue.addListItem('escaped_values', msg + displayValue); 
			
			return newValue;	
		}
		//______________________________________________________________________________________________
		/**
		 *
		 */
		function _escapeCheckConstructor(val, dot)
		{
			val = val || value;
			dot = dot || dotName;
			if (!/(Array|Object)/.test(val.constructor.name))
			{
				var msg = dot.wrap('[]') + ': ' + val.constructor.name;
				rtnValue.addListItem('ignored_constructors', msg);
			}
		}
		//______________________________________________________________________________________________
		/**
		 *
		 */
		function _escapeChanged(fromValue)
		{
			//var msg = options.dotName.wrap('[]') + ' "' + fromValue + '"\n'
			//	+ '  --> "' + toValue + '"';

			var msg;						 		//...check if constructor ignored
			_escapeCheckConstructor();
			
			var toValue = JSON.stringify(value)
			if (toValue === undefined)
				toValue = '"undefined"';
					 
			msg = value;	
			if (valueType == 'Date')
				msg = isNaN(value) ? value : EZ.format.dateTime(value, 'ms');
			
			else if (valueType == 'Function')
				msg = 'Function'
			
			fromValue = fromValue + '';
			msg = (dotName ? dotName.wrap('[]') : '')
				+ ' ' + fromValue.wrap('[]')
				+ (fromValue.concat(toValue).length > 30 ? '\n' : '')
				+ '  -->  ' + toValue.wrap('[]');
			
			rtnValue.addListItem('changed_values', msg);
			
			return null;						
		}
		//______________________________________________________________________________________________
		/**
		 *
		 */
		function _escapeDeleted(newValue, msg)
		{
			msg = (options.dotName || '...').wrap('[]') + ': ' + msg;
			rtnValue.addListItem('deleted_values', msg);
			
			return (escapeType == 'circular') ? undefined : null;						
			//return newValue;	//(escapeType == 'circular') ? undefined : null;						
		}
		//______________________________________________________________________________________________
		/**
		 *
		 */
		function _escapeDeletedFunctions(newValue, msg)
		{
			msg = (options.dotName || '...').wrap('[]') + ': ' + msg;
			rtnValue.addListItem('deleted_functions', msg);
			
			return newValue;
		}
		//______________________________________________________________________________________________
		/**
		 *
		 */
		function _escapeElement()
		{
			var formatted = EZ.format.Element(value, options.format.html);	
			var note = value.toString('brief');
			if (!isIgnored)
				return _escapeValue(formatted, note);

			return _escapeDeleted(undefined, note);
		}
		//______________________________________________________________________________________________
		/**
		 *	String cannot look like pattern or JSON.stringify() discards
		 */
		function _escapeRegExp()
		{										//alway add semi-colon to fool JSON.stringify() 
				var lastIndex = (value.lastIndex === 0) ? ';'			
														: ';#.lastIndex=' + value.lastIndex;
				value = value.toString() + lastIndex;
				if (isIgnored)
					return _escapeChanged(value);
				
				var note = value;
				//if (!dotName)					//unused top level idea??
				//	value = 'eval("$JSON$marker$=/m/;$JSON$marker$.lastIndex=5");$JSON$marker$)';
				
				return _escapeValue(value, note);
		}
		//______________________________________________________________________________________________
		/**
		 *
		 */
		function _escapeArray()
		{
			var msg;
			var obj = {};						//for named Array properties
			obj[marker] = options.dotName;
			Object.keys(value).forEach(function(key)
			{
				if (!isNaN(key)) return;
				obj[key] = value[key];
			});
			if (Object.keys(obj).length === 1)
				return null;					//no named Array properties
				
			if (isIgnored)
			{
				delete obj[marker];
				msg = 'Array named properties:\n' + JSON.stringify(obj,0,4);
				return _escapeDeleted(null, msg);			
			}
			
			msg = 'Array named properties:\n' + JSON.stringify(obj,0,4);
			rtnValue.addListItem('escaped_values', msg); 	
			
			//return value.concat([obj])			//add obj containing named properties
			var newArray = value.concat([obj]);
			return newArray;	//_escapeValue(newArray);
		}
		//______________________________________________________________________________________________
		/**
		 *	escape or delete repeated Object
		 *	TODO: support for ignore: repeated diff fron circular
		 */
		function _escapeRepeated(repeatKey)
		{
			return (isIgnored) ? _escapeDeleted(undefined, dotName)
							   : _escapeValue(repeatKey, repeatKey);
		}
		//______________________________________________________________________________________________
		/**
		 *	create Object containing function owner properties for JSON.stringify() 
		 *	Even functions are included since each may have properties.
		 *
		 *	TODO: don't always ignore script 
		 */
		function _escapeFunction()				
		{
			var name = (value.name || 'anonymous');
			var note = 'function ' + name + '(...)'
			
			var msg = dotName.wrap('[]') + ': ' + note;
			rtnValue.addListItem('functions', msg);			//add to functions list
			
			if (isIgnored)
				return _escapeDeletedFunctions(undefined, note);
																
			var keys = Object.keys(value); 
			if (keys.length === 0
			|| (keys.length === 1 && keys.displayName))
				return _escapeDeletedFunctions(undefined, 'function ' + name + '(script only)');
			
			var obj = {};									
			keys.forEach(function(key)	
			{
				_escapeCheckConstructor(value[key], dotName + '.' + key)
				obj[key] = value[key];
			});
			return _escapeValue(obj, note);
			//________________________________________________________________________________________
			/**
			 *	Determine if Function excluded and type of Object created if not -- little bit complex
			 *	code from EZ.cloneDev.object()...
			
			function _createFunctionClone()
			{
				var clone = '';
				var isNative = false;
				msg = 'function ' + (obj.name || 'anonymous') + '()';
				var script = Function.prototype.toString.call(obj);
				var isNative = (/\{\s*\[native code\]\s*\}/.test(script));
				do
				{														  //-------------------------\\
					if (isNative)										 //----- native function -----\\
					{													//-----------------------------\\	
						if (options.exclude.includes('native'))
						{
							info.mergeListItem('excluded', msg + ' [native]', dotName)
						}
						else clone = obj;								//keep as-is when not excluded
						break;
					}
																		  //--------------------------\\
					var keys = Object.keys(obj);						 //----- defined function -----\\
					var idx = keys.indexOf('displayName');				//------------------------------\\	
					if (idx != -1)
						keys.splice(idx,1);
					var isEnum = (keys.length);							//enumerable properties?

					if (options.exclude.includes('Function')
					&& (options.ignore.includes('script') && !isEnum))
					{
						info.mergeListItem('excluded', msg, dotName)
						break;
					}
					if (options.ignore.includes('script') && !isEnum)
					{
						info.mergeListItem('excluded', msg + ' [no properties]', dotName);
						break;
					}
					else if (options.ignore.includes('script'))			//if excluding script
					{													
						script = 'function ' + obj.name + '()';
						info.mergeListItem('excluded', msg + ' [script only]', dotName)
					}
					
					if (options.exclude.includes('Function') 			//if excluding Function and not script
					&& (!options.ignore.includes('script') || !isEnum))	//...or no enumerable properties
					{
						info.mergeListItem('excluded', msg, dotName)
						break;
					}
					if (options.ignore.includes('script'))				//otherwise if ignoring script . . .
					{
						if (!isEnum)									//exclude function if no properties
						{
							info.mergeListItem('excluded', msg + ' [no properties]', dotName);
							break;
						}
						script = 'function ' + obj.name + '()';			//exclude fn script	
						info.mergeListItem('excluded', msg + ' [script only]', dotName)
					}
					
					if (options.ignore.includes('ignored_constructors'))
					{
						clone = {}										//clone as Object
						info.mergeListItem('ignored_constructors', 'Function', dotName)
					}
					else
					{ 
						try
						{
							eval('clone=' + script);
						}
						catch (e) 
						{
							clone = {};
							info.addMessage('unable to clone function: ' + msg + ' @ ' + dotName.join('.').wrap('[]'))
							info.addDetails(EZ.getStackTrace());
							info.mergeListItem('excluded', msg + '[script syntax]', dotName)
						}
					}
				}
				while (false)
				return clone;
			}
			*/
		}
	}
	//______________________________________________________________________________________________
	/**
	 *	Specified Object is updated by un-escaping any escape markers found in json created via
	 *	JSON.stringify() of the supplied Object.  
	 *
	 *	Markers are un-escaped in the order they appear in the json to insure any repeated Objects
	 *	are available when repeat escape markers are subesequently encountered.
	 */
	EZjsonPlus.prototype.unescape = function JSONplus_unescape(obj, options, rtnValue)
	{
		options = EZ.options.call(EZ.jsonPlus.options, options);
		rtnValue = rtnValue || new EZ.rtnValue();
				
		var msg, json, pattern;
		var errorCount = 0;
		var escapeType = 'escaped values';
		var escapeString = '';
		var evalScript = '';

		var marker = options.escapeMarker.wrap('@');	
		try												
		{											
			json = JSON.stringify(obj, null, 4);
			do
			{
				if (options.isTestFunction || EZ.getTime(options.version) >= EZ.getTime('11-25-2016'))
				{
					var regex = RegExp('^"'	+ marker + ': (.*?)(;#[.].*)?"$');							
					json = json.replace(regex, function(all, script, more)
					{										
						escapeString = all;				//top level marker -- non-Object			
						evalScript = 'obj=' + script;
						if (more)						//e.g. /xyz/gim;#.lastIndex=1
							evalScript += more.replace(/#/g, 'obj');
						eval(evalScript);	
						return '';
					});
					if (!json) break;
			
					regex = RegExp('('					//non-Array escape patterns: e.g. circular
														//...html Element, RegExp, Date, Function
						  + '[\\[{]?\\s*?"'      		//...start of Array or Object: [ or {
						  + marker							
						  + '.*?((\\$.*?)=.*?)"'    	//...(2) script, (3) dotName of Object
						  + '\\s*?[\\]}]'  				//...must only be followed by ] or }
							 
						  + '|'							//Array with named properties pattern
		
						  + "^\\s*"              		//...optional outer Array Object key
						  + "(\".*?\":)?"          		//...start of Array
						  + "\\s*\\["            		//...everything up to marker
						  + "[\\s\\S]*?"         
						  + '"' + marker + '":'			//...marker Object key
						  + '\\s*"'
						  + '(.*?)'						//...arrayDotName
						  + '",'   						//...must be followed by comma
						  + '[\\s\\S]*?\\n\\s*[}]'		//...remaining marker Object
						  + ')', 'gm');							
					
					json = json.replace(regex, function(all, outer, script, dotName, unusedKey, arrayDotName)
					{													
						escapeString = all;								
						evalScript = '';
						try
						{								//named Array properties marker
							if (arrayDotName !== undefined)
								return _unescapeArray(obj, arrayDotName) ? '' : all;
							
							if (script.endsWith('\\'))	//not marker if ends backslash -- ideally regex should exclude
								return '';				//...it is marker text inside String variable
							
														//html Element marker
							if (script.endsWith(options.escapeHTML))
								return _unescapeElement(obj, script)  ? '' : all;			
							
														//all other escape markers -- some marker validation							
							var equalCount = script.count('=');
							var poundCount = script.count('#');
							if ( (equalCount-1) != poundCount )
								return _unescapeError('invalid escape marker: ' + script.wrap('[]'));
							
							_unescapeValue(obj, script, dotName);
							return '';
						}
						catch (e)
						{
							_unescapeError(e.message);
						}
						return all;
					});
				}
				else
				{
					json = JSON.stringify(obj, null, 4);		
					var regex = RegExp('[\\[{]?\\s*?\\"' + marker + '.*?((\\$.*?)=.*?)"[\\s\\S]*?[\\]}]?', 'g');		
					json = json.replace(regex, function(all, set, dotName)
					{													
						if (set.endsWith('\\'))					//not marker if ends backslash -- ideally regex should exclude
							return all;							//...it is marker text inside String variable
						
						void(obj);								//exposes obj for viewing in debugger
						escapeString = all;								
						evalScript = '';
						
						if (!set.endsWith(options.escapeHTML))	//if not html marker. . . 
						{										
							escapeType = '[replace value]';		//1st replace all ";#" with dotName e.g. $.1=/xyz/;#.lastIndex=3	
							set = set.replace(/;#/g, ';' + dotName);	//							 --> $.1=/xyz/;$.1.lastIndex=3
		
																//then change number's in dotName 	e.g. $.1 --> $[1]
							set = set.replace(/\.(\d+)(?=([.=]|$))/g, '[$1]');	
							set = set.replace(/\$/g, 'obj');	//and finally change $ --> obj
							evalScript = set;					//and save for exception reporting
							eval(set);	
						}									
						else										
						{										//drop html marker and parse dotName w/ replace		
							escapeType = '[html]';
							set = set.clip(options.escapeHTML.length+1);	
							var escapeValue = set.replace(/([$]\..*)\.(.*)/, function(all, dotName, key)
							{
								escapeString = all;								
								var obj = (dotName == '$') ? obj 
														   : dotName.replace(/\$/, '').ov(obj);
								if ( !(obj instanceof Object) ) 
									return;
								
								delete obj[key][marker];
								var parent = null;				//TODO: set parentId property with id/dotName
								var tag = EZ.createTag(obj[key].tagName, obj[key], parent);
								obj[key] = tag;
								return '';
							});
							if (!escapeValue)					//blank if Element created if not...
								return;							//...do not remove escape marker fron json							
		
						}
						return '';								//remove marker from json
					});
					escapeType = 'named Array properties';
					evalScript = '';
																//unescape named Array named properties
					pattern = '([{]?"' + marker + '":"(.*?)".*[}])';
					regex = RegExp(pattern, 'g');
					pattern = '';
					json = json.replace(regex, function(all, jsonKeys, dotName)
					{														
						escapeString = all;								
						evalScript = 'array=' + dotName.replace(/\$/, 'obj');
						
						var array = eval(evalScript);
						
						if (!array)			
							return
						
						var o = array.pop();
						for (var key in o)
							if (key != marker)
								array[key] = o[key];
						return '';
					});
				}
			}
			while (false)		
		}
		catch (e)
		{
			_unescapeError(e.message);
		}
		json.replace( RegExp(marker + '(.*)', 'g'), function(all, script)
		{
			errorCount++;
			rtnValue.mergeListItem('unescape_unprocessed_markers', marker, script);
		});
		
		if (errorCount)
		{
			rtnValue.setFail();
			rtnValue.addMessage('JSON.plus.unescape(): ' + EZ.s('# errors', errorCount));
															
			//msg = rtnValue.getList('unescape_errors');
			//rtnValue.addListItem('validate_details', msg);
		}
		//=======================================
		if (!options.rtnValue)
			return obj;
		else
		{
			rtnValue.clone = obj;
		 	return rtnValue;
		}
		//=======================================
		//______________________________________________________________________________________________
		/**
		 *
		 */
		function _unescapeError(details)
		{
			errorCount++;
			rtnValue.setFail();
			
			msg = ['JSON.plus.unescape() processing ' + escapeType + ': '];
			if (evalScript)
				msg.push(escapeString, '\neval("' + evalScript + '")\n');
			
			if (details)
				msg.push(details);
			rtnValue.addMessage(msg);
			
			//msg = [msg].concat(e.stack.formatStack());
			msg.push('un-processed json:', json);
			rtnValue.addDetails(msg);
			//rtnValue.addListItem('unescape_errors', escapeType, evalScript);
		}
		//______________________________________________________________________________________________
		/**
		 *
		 */
		function _unescapeArray(obj, dotName)
		{
			if (!dotName) return false;
				
			escapeType = 'named Array properties';
			//evalScript = 'array=' + dotName.replace(/\$/, 'obj');
			//evalScript = evalScript.replace(/\.(\d+)(?=([.=]|$))/g, '[$1]');	
			
			var dotName = dotName.split('.');	
			//var key = dotName.pop();
			//if (!key)
			//	return false;

			var array = obj;
			if (dotName.length)
			{ 
				dotName[0] = '';
				array = dotName.join('.').ov(obj);
			}
			if (!array)	
				return false;
			
			//var array = eval(evalScript);
			//evalScript = '';
			
			var values = array.pop();
			for (var key in values)
				if (key != marker)
					array[key] = values[key];
			return true;								//remove escape marker from json
		}
		//______________________________________________________________________________________________
		/**
		 *
		 */
		function _unescapeElement(obj, script)	
		{										
			escapeType = '[html Element]';
			var dotName = script.clip(options.escapeHTML.length+1).split('.');	
			var key = dotName.pop();
			if (!key)
				return false;
			
			var parentObj = (dotName.length == 1) ? obj 
						  : dotName.slice(1).join('.').ov(obj);
			
			delete parentObj[key][marker];
			var attr = parentObj[key];
			var parent = null;							//TODO: save parent
			parentObj[key] = EZ.createTag(attr.tagName, attr, parent);
			return true;
		}
		//______________________________________________________________________________________________
		/**
		 *
		 */
		function _unescapeValue(obj, script, dotName)
		{
			escapeType = '[replace value]';		//1st replace all ";#" with dotName e.g. $.1=/xyz/;#.lastIndex=3	
			script = script.replace(/;#/g, ';' + dotName);	//							 --> $.1=/xyz/;$.1.lastIndex=3
	
												//then change number's in dotName 	e.g. $.1 --> $[1]
			script = script.replace(/\.(\d+)(?=([.=]|$))/g, '[$1]');	
			script = script.replace(/\$/g, 'obj');	//and finally change $ --> obj
			evalScript = script;					//and save for exception reporting
			eval(script);	
			return true;								//remove marker from json
		}									
	}
	/*--------------------------------------------------------------------------------------------------
	JSON.plus.unquoteKeys(json)
	
	Uses RegExp to find quoted keys --- 
	As safety, returns json unchanged if initial -or- converted json does not eval() without exceptions.
	
	ARGUMENTS:
		json		String containg json returned with Object keys unquoted if valid variable name.
					i.e. not reserved word, no spaces and startsi with "_" or alphabetic character
	
	RETURNS:
		json with unquoted key -- valid JavaScript / eval() but not recognized by JSON.parse()
				if (regex.reserved.includes(arg))				//reserved word
	--------------------------------------------------------------------------------------------------*/
	EZjsonPlus.prototype.unquoteKeys = function EZjsonPlus_unquoteKeys(json)
	{
		if (!json || typeof(json) != 'string') return json;
		
		var options = {json: json};
	//	if (EZ.capture.check(this,options)) {return EZ.capture()} else if (EZ.test.debug()) debugger;
	
		var phase = 'validating input';
		try
		{
			var value = eval('value='+json);	
			//                         (/([{,]\s*)"([\w_]+?)"         :/gi
			var unquoted = json.replace(/([{,]\s*)"([A-Z_$][\w_$].*?)":/gi, function(all, sep, key)
			{
				if (EZ.json.INVALID_KEYS.indexOf(key) != -1) return all;
				return sep + key + ":";
			});
		
			phase = 'validating unquoted';
			var val = eval('val=' + unquoted);
		
			if (EZ.equals(val, value))
				json = unquoted;
			else
				throw new EZ.error('unable to unquote keys');
		}
		catch (e) 
		{ 
		//	rtnValue.setFail('error', e);
			EZ.json.fault = EZ.techSupport(e, '-' + phase, this, options);	 
		}
		return json;
	}
	//______________________________________________________________________________________________
	/**
	 *	validate json by comparing new Object or value created from json to specified value 
	 */
	EZjsonPlus.prototype.validate = function EZ_JSON_plus_validate(obj, json, options, rtnValue)	
	{	
		options = EZ.options.call(EZ.jsonPlus.options, options);
		rtnValue = rtnValue || new EZ.rtnValue();
		var rtnData = rtnValue.getData();
		
		var clone = eval('clone=' + json);			//create clone from json
		var marker = options.escapeMarker.wrap('@')
													//un-escape json if it contains escape marker but 
		if (json.includes(marker)					//doesnot have embedded JSON.plus.unescape() script
		&& !json.includes(';' + options.escapeSuffix))	
		{											
			//--------------------------------------------------------------------------------------
			var unescapeOpts = EZ.options.call(options, {rtnValue:false})
			clone = JSON.plus.unescape.call(this, clone, unescapeOpts, rtnValue);	
			//--------------------------------------------------------------------------------------
		}											//...may update "validate_details" if errors ??
		rtnData.clone = clone;
		
		var cloneOpts = {};
		if (rtnValue.haveList('functions'))			//if input obj is or contains functions...
cloneOpts.functions = false;			//...convert to Objects via clone
		
		if (options.ignore.includes('constructor')	//if ignoring non-standard Object constructors
		&& rtnValue.haveList('ignored_constructors'))		
cloneOpts.objects = false;				//...undo via {}.cloneObject()
		
		if (Object.keys(cloneOpts).length)			
		{
obj = Object.prototype.cloneObject.call(obj, cloneOpts);
			if (options.clone == 'keep')			//keep clone used to validate (test convenience)
				rtnData.validateObject = obj;		//??
		}
		
		if (!EZ.equals(obj, clone, options.validateEqualsOptions))
			rtnValue.addListItem('validate_details', EZ.equals.formattedLog);
		
		if (rtnValue.haveList('validate_details'))	//unescape may update
		{
			rtnValue.setFail();
			rtnValue.addMessage('JSON.plus.validate() failed');
		}
		else if (!options.clone)					//delete clone unless keep specified					
		{
			delete rtnData.clone;
			delete rtnData.value;
		}
	}
	//==================================================================================================
	return _init();
})();

//________________________________________________________________________________________
EZ.jsonPlus.stringify.test = function JSON_stringify_test()
{	
	var msg, arr, ctx, arg, args, o, obj, opts, note='', ex, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [msg, arr, ctx, arg, args, o, obj, opts, note='', ex,fn, val, , rtnValue];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	ex = note = undefined;						
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .	
	var plusOpts = {
		clone:'keep', validate:true, unquoteKeys:true, 
		ignore:'none'
	}
	var keys_quoted = {
		clone:'keep', validate:true, unquoteKeys:false,
		ignore:'none'
	};
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//========================================================================================
	/**
	 *	set results and/or expected -- using supplemental rtnValue in addition to returned json
	 */
	function exfn(testrun)
	{
		var msg, exResults;
		
		var results = testrun.getResults();
		var opts = testrun.getArgument(1) || {};
		var rtnValue = testrun.getRtnValue();	
		if (!rtnValue)
		{
			testrun.appendNote('no JSON.plus rtnValue Object'.wrap('<em>'));
			return;
		}
		//else testrun.setExtra(rtnValue);
		var rtnData = rtnValue.getData();
		var obj = rtnData.validateObject || testrun.getArgument(0);
		
		if ('clone' in rtnData)							//if clone returned. . .
		{												//...not when no options specified
			testrun.setResultsArgument(0, rtnData.clone, 'clone from json');	
			testrun.appendNote('1st <em>actual</em> argument set to Object created from json')
			
			if (!testrun.isExpectedArgument(0))
			{
				testrun.setExpectedArgument(0, obj, 'input Object');
				testrun.appendNote('1st <em>expected</em> argument set to input obj')
			}
		}
														//if json returned...should always be
		if (results === undefined || typeof(results) == 'string' )
		{			
			if (!opts.circular && rtnValue.getMessageString().includes('Converting circular'))
				exResults = 'circular exception'.wrap();
			else 										//not circular exception
			{
				var eqNote = '';
				var eqOpts = {};
				if (true								//opts.ignore.includes('constructor') 
				&& rtnValue.haveList('ignored_constructors'))
					eqOpts.ignore = 'objectTypes';
					
				if ('clone' in rtnData 
				&& !EZ.equals(obj, rtnData.clone, eqOpts))
					eqNote = 'Object created from json NOT same as input obj'.wrap('<em>');
				
				msg = rtnValue.getMessage();
				if (msg.length)
				{
					if (!testrun.isExpectedResults())
					{
						exResults = 'JSON.plus messages:\n' + msg.join('\n');
						testrun.appendNote('expected ' + 'return value'.wrap('<cite>') + ' set to alert messages');
					}
					else
					{
						msg.unshift('JSON.stringify() messages:'.wrap('<em>'))
						testrun.appendNote('<hr>' + msg.join('\n'));
					}
				}
				else if (!eqNote)						//not equal Objects
				{
					msg = 'no Errors found';
					if (!testrun.isExpectedResults())
					{
						msg += '\nexpected ' + 'return value'.wrap('<cite>') + ' set to actual return value';
						exResults = results;
					}
					testrun.appendNote(msg.wrap('<b>'));
				}
				
				var lists = rtnData.lists;				//show returned lists
				if (Object.keys(lists).length === 0)
					lists = 'no returned lists';
				
				testrun.setResultsArgument(1, lists, 'returned_lists');
				testrun.appendNote('2nd actual return argument set to ' + 'returned lists'.wrap('<cite>'));

				if (testrun.isExpectedResults('2nd'))	//test script set 2nd arg expected
				{
					msg = 'test script set expected value for '.wrap('<em>')
						+ 'returned lists'.wrap('<cite>');
					testrun.appendNote(msg);
				}
				if (eqNote)
					testrun.appendNote(eqNote);
				
				msg = rtnValue.getInfo();
				if (!msg || !msg.length)
					msg = 'none';
				else
					msg = msg.join(';&nbsp; &nbsp;') + '\n';

				msg = 'JSON.stringify() info messages: ' + msg;
					testrun.appendNote('<hr>' + msg);
				
				msg = rtnValue.getDetails();
				if (msg.length)
					testrun.appendNote('<hr>' + 'JSON.stringify() details:\n'.wrap('<em>') + msg.join('\n'));
			}
		}
		if (!exResults && !testrun.isExpectedResults())
		{
			testrun.appendNote('expected value set to native JSON.stringify()'.wrap('<b>'));
			exResults = JSON.stringify(obj, null, 4);			
		}
		else if (exResults !== undefined)
			testrun.setExpectedResults(exResults);
	}
	//========================================================================================
	EZ.test.settings( {group: '', exfn:exfn} );		//, notefn:notefn

	//======================================================================================
	EZ.test.settings( {group: 'simple non-circular JSON.stringify()', exfn:exfn} );
	
	obj = {
		a:1, 
		b:{
			x: 'x-ray',
			y: 99
		} 
	}
	EZ.test.run(obj, keys_quoted);
	EZ.test.run(obj, plusOpts);
	
	obj = {
		a:1, 
		b:{
			x: 'x-ray',
			y: 99
		},
		c: [1, 'cat'],
		d: 'dog'
	}
	EZ.test.run(obj, keys_quoted);
	EZ.test.run(obj, plusOpts);
	

	var x = {a:'abc', b:{key:99}};
	EZ.test.run(x, plusOpts);
	
	//______________________________________________________________________________________
	EZ.test.settings( {group: 'simple JSON.stringify() circular objects', exfn:exfn} );
	
	x.b = x;
	ex = '{\n    "a": "abc"\n}';
	ex = []
	ex.results = '{\n    a: "abc"\n}'
	ex[0] = {
		a: "abc"
	}
	/* do this with saved results
	ex[1] = {
		deleted_values: ["$.b"],
		validate_details: [
			"[Object] ... [Object]",
			"*keys do not match*",
			"+b:      ... -       ",
			"[Object] !== [Object]"
		]
	}
	*/
	EZ.test.options( {note:'circular obj [$.b] deleted', ex:ex} );
	opts = EZ.options.call(plusOpts, {ignore:'circular'})
	EZ.test.run(x, opts);
	EZ.test.run(x, plusOpts);

	obj = {
		ok: true,
		testno: 7,
		actualObj: {
			0: x,
			1: {}
		},
		expectedObj: {
			0: x,
			1: {}
		}
	}
	obj.d = undefined
	EZ.test.run(obj, plusOpts);
	
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
	EZ.test.run(obj, plusOpts);

	obj = {
		a: 1,
		b: [0,1]
	}
	obj.b[2] = obj;
	EZ.test.run(obj, plusOpts);
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	EZ.test.run([], plusOpts);
	EZ.test.run({}, plusOpts);
	EZ.test.run({"":""}, plusOpts);
	EZ.test.run({"":"", x:1, y:[], z:{'':''}}, plusOpts);
	

	//______________________________________________________________________________
	EZ.test.settings( {group:'prior circular test'} );
	
	obj = { n:0, str:'abc', a:[1,2,3] };
	EZ.test.run(obj, plusOpts,	{EZ: {note:'not circular'	}})
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	o = {a:1}
	obj = {o:o}
	obj.circular = obj;
	EZ.test.run(obj, plusOpts	,{EZ: {note:'NOW circular'	}})
	
	//EZ.test.settings( {exfn:null} );
	//EZ.test.quit;

	//______________________________________________________________________________
	EZ.test.settings( {group: 'saveResults scenarios'} );

	EZ.test.run([null, 1, null, null, 5], plusOpts);
	EZ.test.run([1, null], plusOpts);
	
	EZ.test.run([undefined, 1, undefined, undefined, 5], plusOpts);
	
	EZ.test.run([1, NaN, undefined], plusOpts);
	
	var date = new Date('11/06/2016');
	EZ.test.run([date], plusOpts);
//	EZ.test.run(date, 

	//______________________________________________________________________________________
	var group = 'simple json -- previously handled w/o calling stringify:\n';
	EZ.test.settings( {group: group} );
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	ex = JSON.stringify();
	EZ.test.options( {note:'no arg'});
	EZ.test.run()
	
	ex = JSON.stringify(undefined);
	EZ.test.options( {note:'undefined'} );
	EZ.test.run(undefined)
	
	ex = JSON.stringify(null);
	EZ.test.options( {note:'null'		, ex:ex} );
	EZ.test.run(null)
	
	//______________________________________________________________________________
	EZ.test.settings( {group: group + 'Boolean'} );
	
	ex = JSON.stringify(true);
	EZ.test.run(true)

	ex = JSON.stringify(false);
	EZ.test.run(false)

	ex = JSON.stringify(true);
	EZ.test.run(Boolean(true))

	ex = JSON.stringify(false);
	EZ.test.run(Boolean(false))
	
	//______________________________________________________________________________
	EZ.test.settings( {group: group + 'Number'} );

	ex = JSON.stringify(0);
	EZ.test.run(0)

	ex = JSON.stringify(1);
	EZ.test.run(1)

	EZ.test.options( {note:'native JSON.stringify() returns null', ex:"null"} )
	EZ.test.run(NaN,{ignore:'NaN'})
	
	EZ.test.options( {note:'native JSON.stringify() returns null'} )
	EZ.test.run(NaN, plusOpts)
	
	//______________________________________________________________________________
	EZ.test.settings( {group: 'standalone Dates', exfn:exfn} );
	
	arg = new Date('06/13/2016 12:00 GMT') 
	ex = JSON.stringify(arg);
	EZ.test.options( {note:'native JSON Date format', ex:ex} );
	EZ.test.run(arg, {ignore:'Date'})
	
	EZ.test.run(arg, plusOpts)
	
	EZ.test.run(new Date('')			,{EZ: {note:'invalid date'}})
	EZ.test.run(new Date(''), {}		,{EZ: {note:'invalid date'}})
	EZ.test.run(new Date(''), plusOpts	,{EZ: {note:'invalid date'}})

	arg = new Date(null);
	ex = JSON.stringify(arg);
	EZ.test.options( {ex:ex, args:["1970-01-01T00:00:00.000Z"]} );
	EZ.test.run(arg, {ignore:'Date', validate:true, info:'all'})
	
	//______________________________________________________________________________
	EZ.test.settings( {group: 'RegExp'} );
	
	ex = JSON.stringify(/abc/gim);
	EZ.test.options( {note:'native return RegExp as empty Object: "{}"'} );
	EZ.test.run(/abc/gim, {})

	EZ.test.run(/abc/gim, plusOpts)
	
	arr = [/abc/gim, /xyz/]
	arr[1].lastIndex = 3;
	ex = "JSON.plus_.reset=["
	   + 	"@JSON_reset@:$.0=/abc/gim"
	   + 	"@JSON_reset@:$.1=/xyz/;$.1.lastIndex=3"
	   + "];"
	   + "JSON.unescape(JSON.plus_.reset);"	

	//EZ.test.options( {note:'diff from native -- with and w/o lastIndex'} );
	EZ.test.run(arr, plusOpts)


	arg = RegExp("xyz", "gim")
	arg.lastIndex = 1;
	EZ.test.run(arg, plusOpts				,{EZ: {note:'lastIndex=1'	}})
	
	EZ.test.options( {note:'lastIndex:9 too big '.wrap('<em>') } );
	arg.lastIndex = 9;
	EZ.test.run(arg, plusOpts)
	
	
	//______________________________________________________________________________
	EZ.test.settings( {group: 'Function'} );
	
	fn = function cloneTest(a,b) {return a*b}
	var anon = function() {};
	var myfn = function my() {};
	[anon, myfn]
	
	obj = {fn:fn}
	EZ.test.run(obj, plusOpts)
	/*
	EZ.test.run(fn, {ignore:'', exclude:''})
	EZ.test.run(fn, {ignore:'', exclude:'Function'})
	EZ.test.run(fn, {ignore:'script', exclude:''})
	EZ.test.run(fn, {ignore:'script', exclude:'Function'})
	EZ.test.run(fn, {ignore:'script, constructors', exclude:''})
	EZ.test.run(fn, {ignore:'script, constructors', exclude:'Function'})
	*/
	
	//______________________________________________________________________________
	EZ.test.settings( {group: 'non-supported values'} );
	
	obj = {
		0: undefined,
		1: 1
	}
	EZ.test.run(obj, plusOpts				,{EZ: {note:'obj[0]: undefined'}})
	
	//______________________________________________________________________________
	EZ.test.settings( {group: 'simple Strings'} );
	
	EZ.test.options( {note:'empty string', ex:'""'} );
	EZ.test.run('')
	
	
	EZ.test.run('embedded "me" double quotes',		plusOpts)
	EZ.test.run("embedded 'me' single quotes", 		plusOpts)
	EZ.test.run('multi-line \n line 2'		 , 		plusOpts)
	
	//______________________________________________________________________________
	EZ.test.settings( {group: 'EZoptions Object'} );
	
	note = 'should report non-standard constructor';
	obj = EZ.options.call({yes:true, no:false})
	ex = []
	ex.results = '{"yes":true,"no":false}'
	args = [JSON.stringify(obj)]	//{"constructors":["[$]: EZoptions"]}
	EZ.test.options( {note:note, ex:ex, args:args} );	
	opts = EZ.options.call(plusOpts, {unquoteKeys:false, ignore:'constructor'})
	EZ.test.run(obj, opts, 0)
	
	//______________________________________________________________________________
	EZ.test.settings( {group: 'functions:'} );
	
	obj = function obj() {}
	obj.a = 'abc'
	EZ.test.run(obj, plusOpts		,{EZ: {note:'fn has String property'}});
	
	obj = function obj() {}
	obj.a = {yes:true, no:false}
	EZ.test.run(obj, plusOpts		,{EZ: {note:'fn has Object property'}});
	
	obj = function obj() {}
	obj.a = EZ.options.call({yes:true, no:false});
	EZ.test.run(obj, plusOpts		 ,{EZ: {note:'fn has EZoptions property'}});
	
	//______________________________________________________________________________
	EZ.test.settings( {group: 'Array named properties'} );
	
	arr = [0,1];
	arr.yes = true;
	EZ.test.run(arr, plusOpts)
	EZ.test.run({my:arr}, plusOpts)
	EZ.test.run([arr], plusOpts)
	
	var actual = [0,1]
	actual[0] = [8]
	actual[0].more = 'abc';
	actual[1] = [9]
	actual[1].more = 'xyz';
	actual[1].colors = ['red', 'blue'];

	note = 'ignore Array named properties -- same as JSON.stringify'
	ex = JSON.stringify(actual,null,4)
	args = [
		[actual[0].slice(), actual[1].slice()]
	]
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	opts = EZ.options.call(plusOpts, {ignore:'Array', unquoteKeys:false})
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	EZ.test.options( {note:note, ex:ex, args:args} );	
	EZ.test.run(actual, opts)
	
	EZ.test.run(actual, plusOpts)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	obj = { actual: actual }
	ex = JSON.stringify(obj,null,4)
	args = {
		actual: [actual[0].slice(), actual[1].slice()]
	}
	EZ.test.options( {note:note, ex:ex, args:args} );	
	EZ.test.run(obj, opts)
	
	EZ.test.run(obj, plusOpts)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	//______________________________________________________________________________
	EZ.test.settings( {group: 'html'} );
	
	var div = document.createElement('div');
	div.setAttribute('id', 'testDiv')
	var span = document.createElement('span');
	var divObj = {d:div}
	var bothObj = {d:span, s:span}
	void(divObj, bothObj)

	EZ.test.run(divObj, plusOpts)
	/*
	EZ.test.run(divObj, keys_quoted)
	EZ.test.run(divObj, plusOpts)
	EZ.test.run(bothObj, plusOpts)
	*/
	//______________________________________________________________________________
	EZ.test.settings( {group: 'live faults'} );
	obj = {
		0: "",
		1: {
			monitor: true,
			script: false,
			circular: true,
			escape: ["Undefined", "NaN", "Date", "RegExp"],
			info: "constructors",
			escapeMarker: "@JSON_escapeMarker@",
			escapePrefix: "JSON.plus._temp=",
			escapeSuffix: "JSON.plus.unescape(JSON.plus._temp);",
			defaults: {
				optionGroups: {
					basic: {
						validate: true,
						unquoteKeys: true,
						circular: true,
						escape: ["Undefined", "NaN", "Date", "RegExp"],
						info: "constructors"
					}
				}
			}
		},
		results: '""'
	}
	obj[1].defaults.optionGroups.basic.escape = obj[1].escape
	opts = {
		monitor: true,
		script: false,
		circular: true,
		escape: ["Undefined", "NaN", "Date", "RegExp"],
		info: "constructors",
		console: "",
		validate: true,
		clone: 'keep',
		unquoteKeys: true
	}
//	opts.info = plusOpts.info;
//	opts = EZ.options.call()
//	EZ.test.run(obj, opts);
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	obj = [
		"test #1 no data",
		"test #2 no data",
		"test #3 no data",
		"test #4 no data",
		"test #5 no data",
		"test #6 no data",
		"test #7 no data",
		"test #8 no data",
		"test #9 no data",
		"test #10 no data",
		"test #11 no data",
		"test #12 no data",
		"test #13 no data",
		"test #14 no data",
		"test #15 no data",
		"test #16 no data",
		"test #17 no data",
		"test #18 no data",
		"test #19 no data",
		"test #20 no data",
		"test #21 no data",
		"test #22 no data",
		"test #23 no data",
		{
			ok: false,
			testno: 24,
			id: "arg1=1st arg (fn):[],arg2=2nd arg (options):[ignore,exclude],2nd arg (options).ignore:script, constructors,2nd arg (options).exclude:Function,note:<b>Function:scriptonly</b>",
			note: "<b>Function: script only</b>\n",
			actual: {
				0: undefined,
				1: {
					ignore: "script, constructors",
					exclude: "Function"
				},
				results: ""
			},
			expected: {},
			saveDateTime: "11-19-2016 12:08:17 pm"
		}
	]
	EZ.test.run(obj, {save:true, clone:'keep'});
	
	
	//======================================================================================
	fn = function(testrun)
	{
		var rtnValue = EZ.jsonPlus.rtnValue();
		testrun.setResultsArgument(1, rtnValue.options)
	}
	//EZ.test.settings( {exfn:fn} );
	//______________________________________________________________________________________
	EZ.test.settings( {group: 'test options'} );
	
	ex = EZ.options.call( EZ.jsonPlus.options, JSON.plus.options.defaults.optionGroups.basic);
	delete ex.defaults;
	
	EZ.test.options( {ex:'""', args:['', ex]} )
	EZ.test.run('')
	EZ.test.run('', {basic:''})

	ex.script = true;
	EZ.test.options( {ex:'""' } )		//args:['', ex]
	EZ.test.run('', {basic:'', script:true})
EZ.test.quit
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.jsonPlus.unescape.test = function JSON_unescape_tests()
{
	var json, 
		opts = {rtnValue:true};
	
	var fn = function(testrun)
	{
		var rtnValue = testrun.getResults();
		var rtnData = rtnValue.getData();
		testrun.setResults(rtnValue.clone);
		
		testrun.setResultsArgument(1, EZ.stringify(rtnData.lists), 'returned Lists')
	}
	EZ.test.settings( {exfn:fn} );
	json = ''
		+ '{\n'
		+ '    ok: true,\n'
		+ '    testno: 7,\n'
		+ '    actual: {\n'
		+ '        0: {\n'
		+ '            a: "abc",\n'
		+ '            b: {\n'
		+ '                "@JSON_escapeMarker@": "$.actual.0.b=$.actual.0.b"\n'
		+ '            }\n'
		+ '    saveDateTime: "11-28-2016 10:53:46 pm"\n'
		+ '}'	
	
 	EZ.test.run(json,opts)
	
	json = ''
		+ '{\n'
		+ '    ok: true,\n'
		+ '    testno: 7,\n'
		+ '    actual: {\n'
		+ '        0: {\n'
		+ '            a: "abc",\n'
		+ '            b: {\n'
		+ '                "@JSON_escapeMarker@": "$.actual.0.b=$.actual.0.b=$.actual.0"\n'
		+ '            }\n'
		+ '        },\n'
		+ '        1: {\n'
		+ '            escaped_values: [\n'
		+ '                "$.b=[object Object]"\n'
		+ '            ]\n'
		+ '        },\n'
		+ '    },\n'
		+ '    saveDateTime: "11-28-2016 10:53:46 pm"\n'
		+ '}'	
	
	
	
	var json =		//Saved @ 11-18-2016 11:26:15 am
	JSON.plus._temp=[
		{
			"@JSON_escapeMarker@": "$.0=undefined"
		},
		{
			"@JSON_escapeMarker@": "$.5=undefined"
		},
		{
			ok: true,
			testno: 7,
			actual: {
				0: {
					a: "abc",
					b: {
						"@JSON_escapeMarker@": "$.2.actual.0.b=$.2.actual.0"
					}
				},
				1: {
					escaped_values: [
						"$.b=$"
					]
				},
				results: "{\n    a: \"abc\",\n    b: {\n        \"@JSON_escapeMarker@\": \"$.b=$\"\n    }\n}"
			},
			expected: {
				results: "{\n    a: \"abc\",\n    b: {\n        \"@JSON_escapeMarker@\": \"$.b=$\"\n    }\n}"
			},
			saveDateTime: "11-18-2016 11:31:29 am"
		}
		];JSON.plus.unescape(JSON.plus._temp);

	EZ.test.run(json);
}
//__________________________________________________________________________________________
/**
 *	JSON.plus.parse(json)
 *
 *	parse json via eval -- if exception, eval json in fragments to isolate syntax error.
 *
 *	ARGUMENTS:
 *		json	String containing json
 *
 *	RETURNS:
 *		parsed json value if no syntax error otherwise syntax error message as type respresented
 *		by specified json -- e.g. Array is 1st json char is "[", Object if 1st char is "{" ...
 *				
 *		An immediate call to JSON.plus.rtnValue() returns rtnValue Object with methods providing
 *		parse details most notibly: 
 *			rtnValue.getDetails() which returns multiline String pinpointing syntax error.
 * 	___________________________________________________________________________________________
 *
 *	EZ.json.parse(json,layer)													LEGACY clutter
 *
 *	parse json via eval -- if exception, eval json in fragments to isolate syntax error.
 *
 *	ARGUMENTS:
 *		json	String containing json
 *		layer	html layer OR layer id used for error message
 *				TODO: for full backward compatible with original EASY.js
 *	RETURNS:
 *		EZ.json.parse.objname set to name of variable if json of the form: objname = ...
 *		otherwise blank
 *
 *	with no exception:
 *		EZ.json.eval (and EZ.json.parse.objname variable) set to value from json and returned.
 *		EZ.json.message blank
 *
 *	with SyntaxError exception:
 *		EZ.json.eval set to null and returned -- EZ.json.parse.objname variable unchanged
 *		EZ.json.message contains json fragments parsed sucessfully with message inserted
 *		before fragment with SyntaxError.
 *
 *	FRAGMENTS:
 *		The outermost json Object or Function declaration and each nested Object/Function
 *		is considered as a fragment containing zero or more fragment items.  Fragments
 *		items are either another fragment or non-object data type such as Boolean,
 *		Number or String. Statements within a Function declartions are treated as a
 *		fragment item -- except as noted below.
 *
 *		Closure functions enclosed within paraenthesis take precedence as a fragment
 *		over the function definition.
 *
 *		Closure functions used as argements of forEach, every, some or replace are
 *		treated as a complete fragment item of their containig function.
 *
 *		Fragments are passed to eval as found in json first with no fragment items,
 *		then each item added one at a time until all items are added or an exception
 *		occures.
 */
EZ.jsonPlus.parse = function JSON_parse(json, options)
{
	options = EZ.options.call(options)		//converts String delimited options to Object
///	options = EZ.options.call(JSON.plus.options.defaults.parse, options);
	options.details = true;					//more details returned for parse exceptions
	
	var rtnValue = new JSON.plus.rtnValue();
	//______________________________________________________________________________________________
	/**
	 *	returns parsed value if no syntax error otherwise message pin pointing location of syntax
	 *	error in supplied json as typeof() variable or Object implied by supplied json.
	 *	-or- rtnValue Object if options.rtnValue is true.
	 */
	function returnParseValue()				
	{										
		var value = rtnValue.get('value', undefined);
		
		var msg = [rtnValue.get('syntaxError')].concat(rtnValue.getMessage()).join('\n');
		if (msg)
		{										
			msg = value = msg.join('\n');			//value for expected String
			
			if (json instanceof Object)
				json = json instanceof Array ? '[' : '{';
				
			if (typeof(json) != 'string')	//return String if undefined or un-expected type
				void(0)

			else if (json.substr(0,1) == '{' || json.substr(-1) == ']}')
			{								//for expected Object, return Object with message key
				value = {message: value}
			}
			else if (json.substr(0,1) == '[' && json.substr(-1) == ']')
			{								//for expected Array, return empty Array also
				value = [];					//with named property key: message
				value.message = msg;
			}			
		}
		if (rtnValue.get('objname'))		//if objName/variable specified, set to rtnValue
			eval('"' + rtnValue.get('objname') + '=' + value + '"');
		
		return value;
	}
	//=========================================================================================
	var msg, value;
	rtnValue.set('json', json);
	
	var type = EZ.getType(json, 'NaN');
	switch (type)
	{
		case 'Null': 
		case 'Boolean': 
		case 'Number':
			value = JSON.parse(json);
			break;
		
		case 'String': 
			if (json === '')
				msg = 'empty string'
			break;
		
		default:
			msg = typeof(json);
	}
	if (msg) 								//json invalid
	{
		rtnValue.addMessage('supplied json is ' + msg);
		return returnParseValue();
	}
	if (value !== undefined)				//done if value set
	{
		rtnValue.set('value', value);
		return returnParseValue();	
	}
											//carry on if non-empty String
	json = json || '';
	json = json.trim();
	json = json.replace(/\\r/g, '\r');
	json = json.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
	json = json.replace(/^\s*(.*)\s*=\s*/, function(all,objname)
	{									
		rtnValue.set('objname', objname);
		return '';							//remove "objname = ..." prefix if any
	});
	rtnValue.set('json', json);				//save clean json

	  //------------------------\\
	 //----- eval full json -----\\
	//----------------------------\\
	try
	{
		value = eval('value=' + json);
		rtnValue.set('value', value);
											//if escape markers, unsscape
		if (json.includes('@JSON_escapeMarker@'))
		{									//true if not real marker if inside String but so what
			JSON.plus.unescape(value, options, rtnValue);	
		}
		return returnParseValue();			//done
	}
	catch (e)
	{
		rtnValue.addMessage(e.message);
	//	rtnValue.set('syntaxError', e);
	}
	if (!EZ || !EZ.matchPlus)				//if EZ.matchPlus() NOT avail
	{
		rtnValue.addMessage('load EZ.matchPlus() to pin point location of syntax error');
	}
	else									//pin point location of syntax error
	{
		try
		{
			parseFragments()
		}
		catch (e) 
		{
			rtnValue.addMessage('JSON.plus.parse(): fault pin pointing json syntax error');
			rtnValue.addMessage(e.message);
			rtnValue.addDetails( e.stack.formatStack() );
		}
	}
	//========================
	return returnParseValue();
	//========================


	  //--------------------------------------------------------\\
	 //----- eval json in fragments to isolate syntax error -----\\
	//------------------------------------------------------------\\
	function parseFragments()
	{
		var idx, script = '';
	//	EZ.trace(json);
	
		//----- create shadow json with quoted strings neutered (except Object keys)
		var jsonShadow = json.replace(/(\\['"])/g, '@@');		//esc embedded quotes e.g. \" --> @@
		jsonShadow = jsonShadow.replace(/(['"])(.*?)\1(\s*)(\:?)/g,
		function(all, quote, inner, spaces, colon)				//replace all quoted strings
		{														//with #...# e.g. "abc" --> "###"
			if (colon) return all;								//except Object keys
			return quote + '@'.dup(inner.length) + quote + spaces;
		});
		
		//----- also neuter "forEach(function(...){...});" to avoid parsing as fragments
		jsonShadow = jsonShadow.replace(/(forEach\()([\s\S]*?\}.*\n)/g, function(all,prefix,fn)
		{
			return prefix + '@'.dup(fn.length);
		});
		/*___________________________________________________________________________________
		//
		//	SAMPLE JSON before pre-processing nueters quoted Strings and some anounmous
		//	functions to simplify parsing into fragments and fragment items.
		//___________________________________________________________________________________
		{
			guess: 123,
			fn: (function()
			{
				var ____properties____ = {
					color: "green",
					array: [1, 2, "red", true]
				};
				Object.keys(____properties____).forEach(function(key)
				{____function____[key] = ____properties____[key]})
				return ____function____;
			})()
		}
		-------------------------------------------------------------------------------------------
		OPEN FRAGMENT OFFSETS
		-------------------------------------------------------------------------------------------
		offsets: 	0:[0,1], 1:[18,43], 2:[44,74], 3:[75,95]
			[0]:	{
			[1]:	.... fn:. (function() .... {
			[2]:	.... var. ____properties____. =. {
			[3]:	.[12]. array:. [
		-------------------------------------------------------------------------------------------
		CLOSE FRAGMENT OFFSETS
		-------------------------------------------------------------------------------------------
		offsets: 0:[75,100], 1:[101,111], 2:[265,273], 3:[274,275]
			[0]:            array: [1, 2]
			[1]:        };
			[2]:    })()
			[3]:}
	
		-------------------------------------------------------------------------------------------
		//	SAMPLE NUETERED DATA - embedded quotes and forEach converted to @ for parsing
		//	start of fragments marked as -->>...<-- end of fragments marked as --<<...<--
		-------------------------------------------------------------------------------------------
		 __
		|  \................................fragment #0
		|   -->>
		|   {<--
		|    |  guess: 123,
		|	 |_________________________________openOffsets[0] = openResults.end[0] = 1
		|	________
		|  |    -->>\........................fragment #1
		|  |    fn: (function()
		|  |    {<--
		|  |   |_____________________________openOffsets[1] = openResults.end[1] = 43
		|  |   __________________________
		|  |  |                      -->>\.....fragment #2
		|  |  | var ____properties____ = {<--
		|  |  |                           |____openOffsets[2] = openResults.end[2] = 74
		|  |  |
		|  |  |         ________..............fragment #3
		|  |  |        |        \   ___________openOffsets[3] = openResults.end[0] = 95
		|  |  |        |         \ |   _______closeOffsets[3] = closeResults.end[0] = 100 - 1 = 99
		|  |  |        |      -->> <--|
		|  |  |        |   array: [1, 2]
		|  |  |        |           <<-- <--                                          end  - marker size
		|  |  |        |_______________/
		|  |  |     __________________________closeOffsets[2] = (closeResults.end[1] = 111) - 2 = 109
		|  |  |    |
		|  |  | <<--};<--
		|  |  |_______/
		|  |        Object.keys(____properties____).forEach
		|  |        return ____function____;
		|  | <<--})()<--
		|  |________/
		|	    |______________________________closeOffsets[1] = (closeResults.end[2] = 273) - 4 = 269
		|   <<--
		|	}<--
		|  |_________________________________closeOffsets[0] = (closeResults.end[3] = 275) - 1 = 274
		|___/
		*/
		var begWrapPattern = RegExp( "(\\n\\s*)?"      //prefix from line where marker starts
								   + "("               //open marker --	if function...
								   + "(\\(\\s*function||function)"  //optional closure & fn statement
								   + "\\s*[\\w]*\\([^(]*\\)"		//optional fn name & (named args)
								   + "[\\s\\S]*?\\{" 				//optional comment & start of body
								   + "|\\{"            				//...or Object
								   + "|\\["                			//...or Array
								   + ")"               //end of open marker
								   + "(\\s*?\\n?)",    //optional spaces up to optional newline
									 "g");
	
		var endWrapPattern = RegExp( "(.*)"    			//prefix from line where close marker starts
								   + "(" 				//start of close marker
								   + "\\}\\)\\(\\)" 	//end of optional closure -- TODO: expand
								   + "|\\}|\\];?"    	//end of fn, object, array
								   + ")"				//end of close marker
								   + "(\\s*?\\n*)",		//optional spaces up to optional newline
									 "g");
		var itemPatterns = {
			"[": /(\s*)(())?(([^,]*)\s*)(,?\n?)/,			//array -- value [,\n]
			"{": /(\s*)(([^:]*)[:]\s*)(([^,]*)\s*)(,?\n?)/,	//object -- key: value [,\n]
			"(": /(\s*)(())((.*?);?)(\n?)$/m				//function -- single lines .*[;]$
		}
		itemPatterns[')'] = itemPatterns['('];
		var begWrappers =
		{						//use for eval if defined
			'{': 'EZ.obj={\n'		//Object
		}
		var endWrappers = {
			'[': ']',			//Array
			'{': '\n}',			//Object
			')': '\n}',			//function...
			'(': '\n})'			//(function...)
		}
	
		  //-----------------------------------------------\\
		 //----- find all start / end fragment markers -----\\
		//---------------------------------------------------\\
		var openTypes = [],
			openOffsets = [],
			closeOffsets = [],
			openResults = jsonShadow.matchPlus(begWrapPattern),
			closeResults = jsonShadow.matchPlus(endWrapPattern);
	
		idx = 0;

		jsonShadow.replace(begWrapPattern, function(all, prefix, marker, fn, eol)
		{
			var type = !fn ? marker
					 : marker.substr(0,1) == '(' ? '('
					 : ')';
			var offset = openResults.end[idx] + eol.length - (eol ? 1 : 0);
	
			openResults[idx++] = marker + eol;
			openTypes.push(type);
			openOffsets.push(offset);
		});
	
		idx = 0;
		jsonShadow.replace(endWrapPattern, function(all,prefix,marker, eol)
		{
			closeResults[idx] = marker + eol;		//?? prefix offsets may handle
			closeOffsets.push(closeResults.end[idx] - marker.length - 1);
			idx++;
		});
	
		  //--------------------------------------------------------\\
		 //----- reorder closeOffsets to align with openOffsets -----\\
		//------------------------------------------------------------\\
		openOffsets.forEach(function(begOffset,idx)
		{
			var begOffset = openOffsets[idx];
			var endOffset = jsonShadow.length;
			for (var i=idx; i<closeOffsets.length; i++)
			{
				for (var j=i+1; j<openOffsets.length; j++)
				{
					if (openOffsets[j] > closeOffsets[i])
						break;
				}
				if (j == i+1)
					break;
			}
			if (i < closeOffsets.length)
			{										//swap closeOffsets
				endOffset = closeOffsets.splice(i,1)[0];
				closeOffsets.splice(idx,0,endOffset);
				var endWrap = closeResults.splice(i,1)[0];
				closeResults.splice(idx,0,endWrap);
			}
			msg = '\n' + '-'.dup(50)
				+ '\nfragment #' + (idx + 1)
				+ ' offsets: [' + begOffset + ',' +endOffset + ']'
				+ '\n' + '-'.dup(50)
				+ '\n-->>' + openResults[idx].replace(/([\s\S*?])(\n)/, '$1<--$2')
				+  jsonShadow.substring(begOffset, endOffset)
				+ '<<--' + closeResults[idx] + '<--';
			rtnValue.addListItem('fragments', msg);
		});
		openResults.push('');					//fake for idx+1 references
		openOffsets.push(jsonShadow.length);
	
		//	EZ.trace('FRAGMENTS', msg.substr(1));
		options.details = false;
	
		  //------------------------------\\
		 //----- parse outer fragment -----\\
		//----------------------------------\\
		idx = 0;
		var offset = 0;
		jsonFragment();
	
		if (!msg && json.substr(offset))		//any remaining json is unexpected
		{
			msg = 'following unexpected';
			//out of scope function call
			//jsonAppend('=', '@@@error@@@', '@@@good@@@');
					//script += '@@@error@@@' + json.substr(offset);
					//offset += json.substr(offset).length;
		}
		
		if (msg) 								//add to exception from full json eval
		{
			rtnValue.addMessage('more detail below...');
	
			  //------------------------------\\
			 //----- format error message -----\\
			//----------------------------------\\
			if (msg.substr(-1) != '\n') msg += '\n';
			script = script.replace(/([\s\S]*\n)?([\s\S]*)@@@error@@@([\s\S]*)@@@good@@@(.*)(\n?)/,
			function(all, linesBeforeBad, codeBeforeBad, bad, codeAfterBad)
			{
				linesBeforeBad = linesBeforeBad || '';
				var indent = Math.max(0,codeBeforeBad.length - 1);
				var indentBad = Math.max(0,indent + bad.length - 1);
				bad.replace(/[\s\S]*\n(.*)/, function(all, bad /*last line of bad*/)
				{
					indentBad = Math.max(0,bad.length - 1);
				});
				all = linesBeforeBad
					+ (linesBeforeBad ? '='.dup(50) : '')	//	~~~~~~~~~~~~~~~~~~~~~~
					+ '\n...' + msg + ''					//	...msg
					+ '_'.dup(indent) + '\n'				//	_______
					+ ' '.dup(indent) + '\\\n'				//	       \
					+ codeBeforeBad + bad + codeAfterBad	//	before  bad...after
					+ '\n' + '_'.dup(indentBad+1) + '/\n'	//  _____________/
					+ '...end of json parse\n'					//	...end of parse
					+ '='.dup(50) + '\n';					//	~~~~~~~~~~~~~~~~~~~~~~
				return all;
			});
		}
		script += json.substr(offset);
	//	EZ.trace('SCRIPT returned', script);

		//=============================================================
		msg = rtnValue.getMessageObject();
		msg[0] = 'SyntaxError: ' + msg[0];
		rtnValue.addMessage('-'.dup(50));
		rtnValue.addMessage(script);
		/*
		EZ.json.message = 'SyntaxError: ' + EZ.json.message
							  + '\n'
							  + '-'.dup(50) + '\n'
							  + script;
		*/
		return;
		//=============================================================

	
		//_______________________________________________________________________________
		/**
		 *	recursively called for each json fragment until SyntaxError occurs.
		 */
		function jsonFragment(depth/*lastBegWrap, lastEndWrap, lastType*/)
		{
			depth = depth || 0;
			if (idx >= openOffsets.length) return;	//no more fragment markers
	
			var item,
				begWrap = openResults[idx],
				endWrap = closeResults[idx],
				begOffset = openOffsets[idx],
				endOffset = closeOffsets[idx],
	
				type = openTypes[idx],
				begWrapType = begWrappers[type] || begWrap,
				endWrapType = endWrappers[type],
	
				fragmentItems = '';
	
			jsonAppend(begWrap, '-->>', '<--');
			offset = begOffset;
			fragmentItems = begWrapType;			//reset fragmentItems
	
			  //--------------------------------\\
			 //----- for each fragment item -----\\
			//------------------------------------\\
			var thisFragment = '';
			var itemPattern = itemPatterns[type];
			var count = jsonShadow.matchPlus(/(function|\]|\})/g).length;
			do
			{
				//_______________________________________________________________________________
				//
				//	EXAMPLE: items marked as #>...#< -- item separators as ^...^
				//			 keys (or closure variable assignments) marked as !...!
				//_______________________________________________________________________________
				/*
				-->>{<--
					#>!guess: !"neutered quotes@red@"<#,
					#>!fn: !>>(function()
					-->>{<--
						#>!var ____properties____ = !-->>{<--#>!
							color: !"red"<#^,
							^#>!array: !-->>[<--#>1<#^, ^#>2<#--<<]<--
						--<<};<--
						#>Object.keys(____properties____).forEach@@@@@@@@@
						#>return ____function____;<#
					--<<})()<--<#
				--<<}<--
				*/
				var nextFragment = openOffsets[idx+1] - openResults[idx+1].length;
				thisFragment = jsonShadow.substring(offset, Math.min(nextFragment, endOffset));
				if (!thisFragment.length)
					break;
				var groups = "prefix, keyGroup, key, valueGroup, value, itemSep";
				var results = thisFragment.matchPlus(itemPattern, groups);
				if (!results.isFound) break;
	
				results.start.forEach(function(start,idx)
				{								//get un-neutered json results
					item = json.substr(offset+start, results[idx].length);
					results.set(results.keys[idx], item);thisFragment
				});
	
				//fragmentItems += results.prefix;
				jsonAppend(results.prefix, '#>');
	
				if (!results.keyGroup && !results.valueGroup)
				{
					jsonAppend(results.itemSep, '^', '^');
					continue;
				}
				try
				{
					item = results.keyGroup + results.valueGroup;
					if (type != '[' && item.substr(0,1) == '}')
					{						//end of function or object
						jsonAppend(item);
						break;
					}
	
					if (type == '[' && results.key)
						msg = 'name unexpected';
					else if (type == '{' && !results.key)
						msg = 'name required';
					else
					{
						if (type == '{') 			//process key for Object
						{
							item = results.key;
							eval('"' + results.key.trim().trimPlus('"') + '"');
							jsonAppend(results.keyGroup, '!', '!')
							item = results.valueGroup;
						}
	
						if (offset + item.length >= nextFragment)
						{							//value is next fragment e.g. [...] or {...}
							jsonAppend(item);		//append json up to nextFragment
	
							idx++;
							item = jsonFragment(depth+1);
							if (msg) return;
	
							fragmentItems += item;	//append json returned from fragment(s)
						//	EZ.trace('fragmentItems return depth='+ depth, fragmentItems + endWrapType);
						}
						else
						{
							item = results.valueGroup;
							eval(fragmentItems + item + endWrapType);
							jsonAppend(item)	//append valueGroup
						}
						if (options.details) script += '<#';
						jsonAppend(results.itemSep, '^', '^');
					}
					if (options.details) script += '<#';
				}
				catch (e)						//SyntaxError
				{
					msg = e.message;			//...set error message
					console.log(e.stack.replace(/([\s\S]*?\))[\s\S]*/,'$1'))
					item = item.trim();
				}
				if (!msg) continue;
	
				// add message to script and break
				//var padding = Math.max(0,script.length - script.lastIndexOf('\n') - 1);
				jsonAppend(item, '@@@error@@@', '@@@good@@@');
	
				json.substr(offset).replace(/.*\n/, function(all)
				{
					jsonAppend(all);
					return all;
				})
				break;
			}
			while (count-- > 0)					//safety for unexpected endless loop
	
			if (msg || thisFragment.trim()) return;
	
			if (!endWrap)
			{
				msg = 'expected: ' + endWrapType;
				jsonAppend('', '@@@error@@@', '@@@good@@@');
			}
			else								//append end of fragment wrapper and
			{									//replace begWrapType with real begWrap
				jsonAppend(endWrap, '<<--', '<--');
				var regex = RegExp(begWrapType.replace(/([\[{(])/g,'\\$1'));
				return fragmentItems.replace(regex, begWrap);
			}
	
			//_______________________________________________________________________________
			/**
			 *	Append un-neutered json to script and fragmentItems from current offset
			 *	corresponding to code (i.e. code.length).  Annotate with prefix and suffix if
			 *	specified and starts with "@@@" or options.details is true.
			 */
			function jsonAppend(code, prefix, suffix)
			{
				code = code || '';
				prefix = prefix || '';
				suffix = suffix || '';
	
				if (!options.details && prefix.indexOf('@@@') !== 0)
					prefix = suffix = '';
	
				if (!code && !prefix && !suffix) return;
	
				fragmentItems += code;
	
				if (prefix == '<<--' || prefix == '-->>')	//complex annotate
					script += annotate(code, prefix, suffix);
				else										//simple annotate
					script += prefix + json.substr(offset, code.length) + suffix;
	
				offset += code.length;
	
			//	EZ.trace('fragmentItems depth='+ depth, fragmentItems + endWrapType);
			//	EZ.trace('SCRIPT: ' + code, script);
			}
			/**
			 *	returns annotated fragment marker
			 */
			function annotate(code, prefix, suffix)
			{
				return code.replace(/(\s*)([\s\S]*?)(\n?)$/,
				function(all,before,marker,after)
				{
					before = before.endsWith('\n') || !before.length ? prefix + '\n'
						   : before.substr(-4) + prefix
					return before + marker + suffix + after;
				});
			}
		}	//end of jsonFragment
	}	//end of parseFragments
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.jsonPlus.parse.test = function JSON_parse_test()
{
	var msg, arr, ctx, arg, args, o, obj, json, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [msg, arr, ctx, arg, args, o, obj, json, note='', ex, exfn, notefn, fn, val, , rtnValue];
	ex = note = undefined;
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	//============================================================================================
 	function setupTest()
 	{
		if (EZ.test.isRun())				//test NOT skipped
		{ 		
			if (obj !== undefined)
			{
				json = JSON.stringify(obj, null, 4)
				note += '<p>native JSON:<br>' + json.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')
				json = EZ.stringify(obj, '*all');
				
				if (ex !== undefined)
					ex = obj;
			}
			EZ.test.options( {ex:ex} )
		}
		ex = obj = undefined;			//clear ex and obj
 	}
	//============================================================================================
	//EZ.test.settings( {exfn:exfn} );
 	var json = '';
 	var opts = '*NAN, *UNDEFINED, *FUNCTION';	//over-teched EZ.parse() opts
 	var opts = '';
	void(opts);
	//============================================================================================
 	
	//______________________________________________________________________________
 	
	obj = {
		a:1, b:2
	};
 	note = 'easy'
 	setupTest();
 	EZ.test.run(json)
 	
	//_______________________________________________________________________________
	EZ.test.settings( {group:'live faults'} );
	
	json = ''
	   + '{\n'
	   + '    ok: true,\n'
	   + '    testno: 1,\n'
	   + '    id: "arg1=\\"this\\" (Object):[2,11,b,a],\\"this\\" (Object)[2]:1st,\\"this\\" (Object)[11]:2nd,\\"this\\" (Object).b:4th,\\"this\\" (Object).a:3rd,note:<b>sortobjectkeys</b>",\n'
	   + '    note: "<b>sort object keys</b>\\n",\n'
	   + '    warn: "",\n'
	   + '    actual: {\n'
	   + '        results: {\n'
	   + '            2: "1st",\n'
	   + '            11: "2nd",\n'
	   + '            a: "3rd",\n'
	   + '            b: "4th"\n'
	   + '        },\n'
	   + '        ctx: {\n'
	   + '            2: "1st",\n'
	   + '            11: "2nd",\n'
	   + '            a: "3rd",\n'
	   + '            b: "4th"\n'
	   + '        }\n'
	   + '    },\n'
	   + '    expected: {\n'
	   + '        results: {\n'
	   + '            2: "1st",\n'
	   + '            11: "2nd",\n'
	   + '            a: "3rd",\n'
	   + '            b: "4th"\n'
	   + '        },\n'
	   + '        ctx: {\n'
	   + '            2: "1st",\n'
	   + '            11: "2nd",\n'
	   + '            a: "3rd",\n'
	   + '            b: "4th"\n'
	   + '        }\n'
	   + '    },\n'
	   + '    saveDateTime: "12-25-2016 05:44:36 pm"\n'
	   + '}';
	EZ.test.run(json)
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	json = '['
		''
		+ '{\n'
		+ '    used: true\n'
		+ '}','"test #2 no data"'
	']'
	EZ.test.run(json)
	
	json = '['
		+ '{\n'
		+ '    ok: true,\n'
		+ '    testno: 1,\n'
		+ '    used: true\n'
		+ '},'
		+ '{\n'
		+ '    ok: true,\n'
		+ '    testno: 2,\n'
		+ '    used: true\n'
		+ '}\n'
	+ ']'	

	json = '['
		+ '{\n'
		+ '    ok: true,\n'
		+ '    testno: 1,\n'
		+ '    used: true\n'
		+ '}'
	+ ',\n'
		
		+ '{\n'
		+ '    ok: true,\n'
		+ '    testno: 2,\n'
		+ '    used: true\n'
		+ '}'
	+ ']'	
	//setupTest();
	EZ.test.run(json)
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	obj = [
	{
		ok: true,
		testno: 1,
		warn: "",
		actual: {
			0: {
				a: 1,
				b: 2
			},
			1: {
				a: 0,
				b: ""
			},
			2: [
				"1st [Object] \t ... 2nd [Object]",
				"  .a: 1 \t !== 0",
			],
			results: false
		},
		expected: {
			2: [
				"@JSON_escapeMarker@:$.expected.2=$.actual.2"
			],
			results: false
		},
		saveDateTime: "11-23-2016 06:52:18 pm",
		used: true
	},
		''
		+ '{\n'
		+ '    ok: true,\n'
		+ '    testno: 2,\n'
		+ '    warn: "",\n'
		+ '    actual: {\n'
		+ '        0: {\n'
		+ '            a: 1,\n'
		+ '            b: 2\n'
		+ '        },\n'
		+ '        1: {\n'
		+ '            a: 0,\n'
		+ '            b: ""\n'
		+ '        },\n'
		+ '        2: [\n'
		+ '            "1st [Object] \\t .. 2nd [Object]",\n'
		+ '            "  .a: 1 \\t is 0",\n'
		+ '        ],\n'
		+ '        results: false\n'
		+ '    },\n'
		+ '    expected: {\n'
		+ '        2: [\n'
		+ '            "@JSON_escapeMarker@:$.expected.2=$.actual.2"\n'
		+ '        ],\n'
		+ '        results: false\n'
		+ '    },\n'
		+ '    saveDateTime: "11-23-2016 07:30:12 pm",\n'
		+ '    used: true\n'
		+ '}'
	]
	
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	//_______________________________________________________________________________________
	//EZ.test.options( {ex:ex, note:note} )
	//EZ.test.run( ctx, arg, obj )

	if (true) return;
}
