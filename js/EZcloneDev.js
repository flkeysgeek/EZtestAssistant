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

/*--------------------------------------------------------------------------------------------------
EZ.cloneDev(o, options)
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
EZ.cloneDev = (function _____EZcloneDev_____()
{
	var defaultOptions = {				//by default everything cloned up to 99 levels deep
		maxdepth: 99,
		functions: true,
		objects: true,
		ignore: [],			/*			="script" only clone functions with enumerable properties
												and only keep the enumerable properties
												
										="constructors" all Objects and Functions cloned as Objects
												not original constructor -- does not apply to: 
													Date, RegExp, Element or native functions.
												Does apply to NodeList or HTMLCollection
							*/
		exclude: [],		/*			dotName if starts with "." otherwise key or native function name
										e.g. Array, Date, RegExp, Element, Function ("native" for all)
										Keys or native functions excluded from all Objects and Functions. 
										Function with enumerable properties NOT excluded if ignore 
										script also specified.
							*/
		html: {							
			maxdepth: 99,
			children: true,
			cloneNode: false,
			ownerKeys: false,
			boundFunctions: false,		//TODO:
			eventFunctions: false,		//TODO:
			exclude: []					//list of selectors excluded	TODO:
		},
		tags: {
			faults: ''					//tag containing history of clone faults
		},
		defaults: {									
			_: {						//"_" defines "this._" key/value(s) populated by _init()
				cloneList: [],			//list of clones associated with...
				cloneInfo: []			//...clone info
			},										
			Number: 'maxdepth',
			String: 'options',
			optionGroups: {				
				values: {
					ignore:'script, constructors', 
					exclude:'Function',
				}
			}
		},
		formatter: 'EZtoString',
		formatOptions: { 
			tostring: {timestamp: false},
			stringify:{spaces:4} 
		},
		name: 'EZ.cloneDev.defaultOptions',
		version: '11-13-2016',
	}
	//__________________________________________________________________________________________________
	/**
	 *	creates new instance but copies all properties and prototypes to global instance (pseudo static)
	 *	 EZ.cloneDev() is valid constructor -or- can call defaultFunction with "this" context.
	 */
	var _init = function _init(name)
	{
		EZ.log('_init():', name.replace(/^_*(EZ)(.*?)_*$/, '$1.$2'));
		
		var fn = new EZcloneDev();					//create instance for persistant EZ.clone Object
		
		fn._ = defaultOptions.defaults._ || {};		//add default this._ properties	from defaultOptions
		fn._.defaultOptions = defaultOptions;		//...and defaultOptions but then... 
		delete fn._.defaultOptions.defaults._;		//...discard this._ defaults from defaultOptions
		
		for (var key in fn)
			EZcloneDev[key] = fn[key];
			
		EZ.event.add(window, 'onload', function()	//initialization done after DOM loaded
		{											
			EZ.log(EZcloneDev.toString())
			//backupFilename: localStorage.getItem('EZ.cloneDev.backupFilename') || 'EZcloneDev.backup.js'
		});	
	
		return EZcloneDev;
	}
	//__________________________________________________________________________________________________
	/**
	 *	constructor for _init() -- subsequently calls defaultFunction
	 */
	function EZcloneDev()
	{
		var me = arguments.callee;
		if ( !(this instanceof me) )				//NOT called as constructor...
		{											//...call ported EZ.clone()
			var rtnValue;
			rtnValue = _jsonClone.apply(me, [].slice.call(arguments));	
			return rtnValue;
		}
													//called as constructor by _init()
		if (EZ.cloneDev === undefined)				//...getters and setters defined below
		{											//...non-function properties initialized by _init()
													
		}
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	/*	gets called by debugger when key typed in console while debugging EZ.jsonPlus() monitor
	EZcloneDev.prototype.toString = function()
	{
		var str = this.name + ':'
		if (this == EZcloneDev)		//TODO: ??
		{
			for (var key in this)
			{
				//if (key == 'options') continue
				var value = this[key];
				var desc = (typeof(value) == 'function') ? EZ.format(value).replace(/\n/g, ' ')
						 : (value instanceof Object) ? '\t' + JSON.plus.stringify(value)
						 : value;
				str += '\n' + key + ': ' + desc;
			}
		}
		else str += ' not initialized';

		return str;
	}
	*/
	/*--------------------------------------------------------------------------------------------------
	constructor for rtnValue -- if not called as constructor return current (create if necessary)
	--------------------------------------------------------------------------------------------------*/
	EZcloneDev.prototype.infoClear = function EZclone_infoClear()
	{
		var _ = EZ.cloneDev._;
		_.cloneList = [];
		_.cloneInfo = [];
	}
	/*--------------------------------------------------------------------------------------------------
	EZ.clone(obj, depth)
	
	More reliable and enhanced EZ.clone() varient -- used by EZcapture and EZtestAssistant
	
	return clone of specified obj up-to specified depth -- if not Object returned as-is.
	
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
	/**
	 *	called by EZ.clone() when not called as constructor and cloneObject !== true
	 *	TODO: copy EZ.clone() code
	 */
	var _jsonClone = function(obj, depth)
	{
		var _ = this._;
		var options = EZ.options.call(_.defaultOptions, options);
		void(options)
		
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
							ignore: 'constructors'
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

	/*--------------------------------------------------------------------------------------------------
	Object.cloneObject(obj, depth)
	
	return clone of specified object up to maxdepth if supplied. When maxdepth is reached, properties
	from the specified obj are returned as-is (identical Object) e.g. maxdepth=1 if top level clone.
	
	Reference to propeties past depth are
	returned as references to properties in specified Object. Functions are only cloned if not empty
	as determined by EZ.isEmpty() i.e. have properties as does the top level EZ() object.
	
	ARGUMENTS:
		obj		(required)	Object to clone -- if not an Object, immediately returned as-is
		
		options	(optional)	one or more of EZ.clone.options if String or Object
							maxdepth option if number
							
		rtnValue	(optional)	EZclone_rtnValue Object populated with detail rtnValue while cloning
							Only applicable on initial non-recursive call
		
		following arguments always supplied when EZ.clone.object() calls itself (recursive)
		
		depth	(3rd argument)	zero based depth of Object being cloned
		dotName	(4th argument)	dotName associated with Object property being cloned
	
	RETURNS:
		new object cloned from specified Object down to depth if specified.

	
	-------------------------
	09-20-2016 DCO:
	-------------------------
	Fixed code to correctly create new function Object for fn with custom toString() function. 
	However EZ.clone() conflicts with EZ.clone() function  -- not sure which was used before.
	
	Renamed EZ.cloneObject() to avoid conflict with EZ.clone() function which uses json to create what 
	is believed to produce safe clone but does not support circular Object as appears the intented by
	this function.  However as of 09-20-2016, this code has probably NOT been throughly tested.
	
	-------------------------
	11-15-2016 update (major)
	-------------------------
		Created EZ.clone package:
		
		EZ.clone() code moved to embedded EZ.clone.json() function
			for backward compatibility call to EZ.clone() translated to call EZ.clone.json()
			
		EZ.clone() changes:
			Minor refinement to clone validation -- better detection and reporting of Objects
			with circular structures (or repeated nested properties)
			option to use JSON.plus or EZ.clone.object() when clone fails validation.
			
		Object.prototype.cloneObject() code moved to embedded EZ.clone.object() function and
			Object.prototype.cloneObject() changed to call new package new function.
		
		-------------------------------
		EZ.clone.object() enhancements:
		-------------------------------
		Fully supports html Elements, NodeList, HTMLCollections
		Native Functions are copied as-is (if not excluded) -- makes no sence to clone
		Additional options: exclude, ignore, html (additional options for HTML Element clone)
		Robust validation of clone -- Optional detials from clone processing (good or failed)

	REFERENCE: 
		http://heyjavascript.com/4-creative-ways-to-clone-objects/ (ORIGINAL BASE)
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
		
		----------------------------------------------------------------------------------
		Completely rewritten to handle more scenarios and options especially html elements
		----------------------------------------------------------------------------------
	
	TODO:
		extract, include ??
	--------------------------------------------------------------------------------------------------*/
	EZcloneDev.prototype.object = function EZclone_object(obj, options /*maxdepth*/, depth)
	{
		//if (EZ.test.capture()) {return EZ.test.capture(this)} else if (EZ.test.debug()) debugger;
		EZ.clone.counts = EZ.clone.counts || {calls:0, fails:0, faults:[]};
		EZ.clone.counts.calls++;
		
		//______________________________________________________________________________________________
		/**
		 *	2 days to refactor for native functions and more intuitive/flexible ignore / exclude options.
		 */
		var _createObjectClone = function _createObjectClone()
		{
			var reason = '';
			try												
			{
				// . . . . . . . . . . . . . . . . .
				switch (type)
			{
					case 'HTMLCollection': 	
					case 'NodeList': 
		{
						if (options.ignore.includes('constructors'))
							break;
						return document.createElement('div');
		}
					case 'Function': 	
						return _createFunctionClone();
		
					case 'Array': 	
						return [];
		
					case 'Object': 	
						return {};
		
					default:
					{
						if (options.ignore.includes('constructors'))
							break;
						else 
							return new obj.constructor();	//try with original constructor
					}
				}
				// . . . . . . . . . . . . . . . . .
			}
			catch (e)										//report but continue with {} constructor
			{
				reason = ' ' + e.message;
			}
			rtnValue.mergeListItem('ignored_constructors', type + reason, dotName)
			//============
			type = 'Object';
			return {};
			//============
			//__________________________________________________________________________________________
			/**
			 *	Determine if Function excluded and type of Object created if not -- little bit complex
			 */
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
							rtnValue.mergeListItem('excluded', msg + ' [native]', dotName)
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
		
					/*			="script" only clone functions with enumerable properties
										and only keep the enumerable properties
		
								="constructors" all Objects and Functions cloned as Objects
										not original constructor does not apply to: 
											Date, RegExp or native functions
					*/
					/*			dotName if starts with "." otherwise key or native function name
								e.g. Array, Date, RegExp, Element, Function ("native" for all)
								Keys or native functions excluded from all Objects and Functions. 
								Function with enumerable properties NOT excluded if ignore 
								script also specified.
					*/
					if (options.exclude.includes('Function')
					&& (options.ignore.includes('script') && !isEnum))
					{
						rtnValue.mergeListItem('excluded', msg, dotName)
						break;
					}
					if (options.ignore.includes('script') && !isEnum)
					{
						rtnValue.mergeListItem('excluded', msg + ' [no properties]', dotName);
						break;
					}
					else if (options.ignore.includes('script'))			//if excluding script
					{													
						script = 'function ' + obj.name + '()';
						rtnValue.mergeListItem('excluded', msg + ' [script only]', dotName)
					}
		
					if (options.exclude.includes('Function') 			//if excluding Function and not script
					&& (!options.ignore.includes('script') || !isEnum))	//...or no enumerable properties
					{
						rtnValue.mergeListItem('excluded', msg, dotName)
						break;
					}
					if (options.ignore.includes('script'))				//otherwise if ignoring script . . .
					{
						if (!isEnum)									//exclude function if no properties
						{
							rtnValue.mergeListItem('excluded', msg + ' [no properties]', dotName);
							break;
						}
						script = 'function ' + obj.name + '()';			//exclude fn script	
						rtnValue.mergeListItem('excluded', msg + ' [script only]', dotName)
					}

					if (options.ignore.includes('constructors'))
					{
						clone = {}										//clone as Object
						rtnValue.mergeListItem('ignored_constructors', 'Function', dotName)
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
							rtnValue.addMessage('unable to clone function: ' + msg + ' @ ' + dotName.join('.').wrap('[]'))
							rtnValue.addDetails(EZ.getStackTrace());
							rtnValue.mergeListItem('excluded', msg + '[script syntax]', dotName)
						}
					}
				}
				while (false)
				return clone;
			}
		}
		//______________________________________________________________________________________________
		/**
		 *	
		 */
		function _excludedTag()
		{
			return false;
		}
		//==============================================================================================		
		
		var msg, rtnValue;
		var dotName = arguments[3];
			if ( !(obj instanceof Object) )
				return obj;
																	  //-----------------------------------\\
		if (dotName === undefined)									 //----- not recursive call: setup -----\\
		{															//---------------------------------------\\
			depth = depth || 0;
			dotName = [''];										
			options = typeof(options) == 'number' ? {maxdepth: options}
					: typeof(options) == 'object' && !null ? options
					: {}
			

			rtnValue = options.rtnValue || new EZ.rtnValue(options);
			options = EZ.options.call(EZ.cloneDev._.defaultOptions, options);
			options.rtnValue = rtnValue;

			
			//options = EZ.options.call(EZ.cloneDev._.defaultOptions, options);
			//options.rtnValue = new EZ.rtnValue(options);
			options.rtnValue.maxdepthCount = 0;
			
			options.topDepth = depth;
			options.clonedObjects = [];
			options.pendingClones = [];
			options.pendingClones = [];
			options.counter = 0;
		
			options.ignore = EZ.toArray(options.ignore,', ');
			options.exclude = EZ.toArray(options.exclude,', ');
		}
		rtnValue = options.rtnValue;
		var data = rtnValue.getData();
	
		if (options.counter++ == 99) 								//bail if 100 recursive calls
			{
				rtnValue.addMessage('too many recursive calls');
				rtnValue.addDetails(EZ.getStackTrace());
				options.quit = true
			}
			if (options.quit) 									//development aid / safety
				return obj;
		
			//---------------------------------
			var clone = '';											//empty string for Object value if excluded
			//---------------------------------
			do
			{
				var type = obj.constructor.name;
			if (options.topDepth != depth)							//specified obj not excluded
				{														
					if (options.exclude.includes(type) && type != 'Function')
					{													//Function excluded by _createObjectClone()
						rtnValue.mergeListItem('excluded', type, dotName)
						break;											
					}
					if ((options.exclude.includes('Element') || options.exclude.includes('html')) 
					&& (type.startsWith('HTML') || type == 'NodeList'))
					{													//excluding html elements
						rtnValue.mergeListItem('excluded', type, dotName)
						break;
					}
				}
				if (depth > options.maxdepth && options.maxdepth)
				{
					//rtnValue.mergeListItem('maxdepth', options.maxdepth.wrap('[]'), dotName);
				rtnValue.maxdepthCount++;
					clone = obj;
					break;
				}
																		  //------------------------\\
				if (obj instanceof Date)								 //---------- Date ----------\\
				{														//----------------------------\\
					clone = isNaN(obj) ? new Date('invalid') : new Date(obj.getTime());
					break;
				}
																		  //--------------------------\\
				else if (obj instanceof RegExp)							 //---------- RegExp ----------\\
				{														//------------------------------\\
					clone = new RegExp(obj);
					clone.lastIndex = obj.lastIndex;
					break;
				}
																		  //---------------------------\\
				else if (obj instanceof Element || type == 'Text')		 //---------- Element ----------\\
				{														//-------------------------------\\
					if (_excludedTag(obj))								//TODO: exclude html
						break;
					
					rtnValue.mergeListItem('html_tags', obj.tagName, dotName)
					
					if (options.html.cloneNode)
					{
						clone = obj.cloneNode(true);
						break;
					}
					//=====================
					clone = obj.cloneNode();
					//=====================
					
					if (!options.html.ownerKeys)
					{
						Object.keys(clone).forEach(function(key)		//remove non-native properties
						{												// e.g. EZ, EZ$, EZfield...
							delete clone[key];						
						});
					}
					if (options.html.children && obj.children && obj.childNodes.length)
					{
						var keyName = obj.toString('brief');
						var childOpts = EZ.options.call(options, {exclude:['Function']});
						for (var i=0; i<obj.childNodes.length; i++)
						{
							var nodeDotName = dotName.concat([keyName])
							//----------------------------------------------------------------------------
						var node = EZ.cloneDev.object(obj.childNodes[i], childOpts, depth+1, nodeDotName);
							//----------------------------------------------------------------------------
							clone.appendChild(node);
						}
					}
					break;
				}
																		  //----------------------------\\
				var isNative;											 //----- Object or Function -----\\
				clone = _createObjectClone(type);						//--------------------------------\\
																		//clone empty string when excluded
																		//isNative true for native window Object
																		//e.g. Object, Array, alert, Math
			if (options.topDepth == depth)
				{
					if (clone === '')									//when topLevel Object excluded...
						clone = {};										//...return empty Object
					else if (!isNative)
					{
					options.objectsProcessed = [obj];
					options.clonedObjects = [clone];
					}
				}
				else if (clone === '') 									//if not topLevel...
					break;												//...delete excluded Object
									
				var keys = Object.keys(obj);							//Array or Object keys
				var excludeKeys = options.exclude;						//specified exclude keys
				if (excludeKeys.length)									//...remove excluded keys if any
				{														
					var dotNameObj = dotName.slice().join('.');
					var regex = RegExp('^' + dotNameObj + "\\.");
							
					excludeKeys.forEach(function(key)					//for each exclude key. . .	
					{
						if (key.includes('.'))
							key = key.replace(regex, '')
						var idx = keys.indexOf(key);
						if (idx != -1)									//if obj contains exclude key...
						{												//...remove from keys list
							keys.splice(idx,1);							//...add dotName to excluded list
							msg = EZ.getType(obj[key],true).wrap('[]');
							rtnValue.mergeListItem('excluded', msg, dotName.concat(key));
						}
					});
				}
																		  //----------------------------------\\
				keys.forEach(function(p)								 //----- for each Object property -----\\
				{														//--------------------------------------\\
					var idx;
					var dotNameNext = dotName.concat([p]);
					var key = dotNameNext.join('.');
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
						//----------------------------------------------------------------------------
					var value = EZ.cloneDev.object(obj[p], options, depth+1, dotNameNext);
						//----------------------------------------------------------------------------					
						if (value !== '')								//if obj property not excluded. . .
						{												
							if (clone instanceof Element)				//NodeList or HTMLCollection
								clone.appendChild(value);
							else
								clone[p] = value;
							
							idx = options.objectsProcessed.indexOf(obj[p])
							if (idx != -1 								//safety for unexpected
							&& options.clonedObjects[idx]===undefined)	//if clone not yet saved...
						//	&& options.clonedObjects[idx] == null)		
								options.clonedObjects[idx] = clone[p];	//...save for pendingClones
						}
					}
				});
				clone = (type == 'NodeList') ? clone.childNodes
					  : (type == 'HTMLCollection') ? clone.children
					  : clone;
			}
			while (false)
																	  //-------------------------------\\
		if (options.topDepth == depth)								 //----- done with all Objects -----\\
		{															//-----------------------------------\\
			options.pendingClones.forEach(function(key, idx)
			{														//populate pendingClones if any
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
					
										
			//if (clone instanceof Element) EZ.bindElements.log = false;
			/*			
			if (clone instanceof Element)
				Object.keys(clone).forEach(function(key)		//remove non-native properties
				{												// e.g. EZ, EZ$, EZfield...
					delete clone[key];						
				});
					*/
			var isEqual;
			if (!rtnValue.haveList('excluded'))							//if no excluded values
					{
				var isEqual = 'na';
				var eqOpts = {showDiff:true};
				if (rtnValue.haveList('ignored_constructors'))
					eqOpts.ignore = 'constructors';
				if (rtnValue.haveList('html_tags'))
					eqOpts.html = true;
					
				if (typeof(obj) != 'function')
					isEqual = EZ.isEqual(obj, clone, eqOpts);
					
				if (!isEqual)
						{
					EZ.clone.counts.fails++;
					data.success = false;
					data.showDiff = EZ.equals.formattedLog;
					EZ.log.call('clone', 
					{
						'EZ.clone.object failed [details]': rtnValue.getData(), 
						obj:obj, 
						clone:clone
					})
					msg = EZ.equals.formattedLog || '...differences detail NA...';
					rtnValue.addMessage(msg);
					rtnValue.addDetails([msg].concat(EZ.getStackTrace()));
					
					EZ.clone.counts.faults++;		//.push( {rtnValue:data.idx} );
						}
					}
			data.success = isEqual;
			rtnValue.save();
				}
				return clone;
	}	
	//=============================================================================================
	return _init(arguments.callee.name);
})();
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.cloneDev.object.test = function EZclone_object_test()
{
	var ex, ctx, fn, json, note, obj, arr, tags, x;
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	//======================================================================================
	function notefn(testrun, phase)	
	{
		if (phase == 'prerun')
		{
			var opts = EZ.options(testrun.getArgument('2nd'));
			opts.rtnValue = new EZ.cloneDev.rtnValue();
			testrun.setArgument('2nd', opts);
		}
		/*
		if (note !== undefined)
			testrun.setNote(note);
		note = undefined;
		*/
		return '';
	}
	[notefn]
	//________________________________________________________________________________________	
	var exfn = function exfn(testrun)
	{
		var clone = testrun.getResults();
		if (!clone) return;

		var msg;
		var opts = testrun.getArgument(1);
		
		var rtnValue = opts ? opts.rtnValue : '';
		if (!rtnValue || !rtnValue.getMessage)
		{
			testrun.appendNote('no clone rtnValue available'.wrap('<em>'));
			return;
		}
		
		var data = rtnValue._;
		msg = EZ.json.stringify(data)	//.replace(/\\n/g,'<br>\n');
		msg = msg.replace(/\\n/g, '\n' + ' '.dup(20));
		
		if (!testrun.isExpectedArgument('1st') && rtnValue.isOk() === true)
		{
			testrun.setExpectedArgument('1st', testrun.getResults() );
			testrun.appendNote('success=true so 1st expected argument set to return value');
		}
		else
		{
			testrun.setExpectedArgument('1st', testrun.getArgument('1st') );
			testrun.appendNote('1st expected argument set to call arg value');
		}
		testrun.setResultsArgument('2nd', msg, 'EZ.clone.rtnValue');
		testrun.appendNote('2nd actual argument set to EZ.clone.rtnValue');
		
		if (clone instanceof Element
		|| /(NodeList|HTMLCollection)/.test(EZ.getConstructorName(clone)))
		{
			var html = EZ.format.Element(clone, {extract:'all, children'} );
			testrun.appendNote('<hr><em>HTML created from clone:</em>\n' + html.replace(/</g, '&lt;')); 
		}
	} 
	//=================================================================================
	EZ.test.settings( {exfn:exfn, notefn:notefn, ignoreArgs:'3rd'} );
	
	//_______________________________________________________________________________
	EZ.test.settings( {group:''} );
	
	obj = [0,1];
	EZ.test.options( {note:'easy Array', ex:obj} )
	EZ.test.run(obj, {});
	
	//_______________________________________________________________________________
	EZ.test.settings( {group:'html'} );
	
	var div = document.createElement('div');
	var span = document.createElement('span');
	span.setAttribute('id', 'span_id');
	span.setAttribute('name', 'span_name');
	span.className = 'class1 class2';
	div.appendChild(span);

	EZ.test.options( {note:'NodeList: single span'} )
	EZ.test.run(div.childNodes, {})

	EZ.test.options( {note:'HTMLCollection: single span'} )
	EZ.test.run(div.children, {})
	
	var text = document.createTextNode('outside span');
	div.appendChild(text);

	EZ.test.options( {note:'div with child: span, text'} )
	EZ.test.run(div, {});

	var innerText = document.createTextNode('inside span');
	span.appendChild(innerText);
	EZ.test.options( {note:'div with child: span innerText, text'} )
	EZ.test.run(div, {});

	EZ.test.options( {note:'NodeList: span, text'} )
	EZ.test.run(div.childNodes, {})

	EZ.test.options( {note:'NodeList: span, text -- cloned as Object'} )
	EZ.test.run(div.childNodes, {ignore:'constructors'});

	EZ.test.options( {note:'HTMLCollection: span, text'} )
	EZ.test.run(div.children, {})

	EZ.test.options( {note:'HTMLCollection: span, text -- cloned as Object'} )
	EZ.test.run(div.children, {ignore:'constructors'});

	tags = document.getElementsByTagName('eztest_tag');
	EZ.test.options( {note:'huge HTMLCollection'} )
	EZ.test.run(tags, {});
	
	EZ.test.options( {note:'huge HTMLCollection -- cloned as Object'} )
	EZ.test.run(tags, {ignore:'constructors'});
	
	//_______________________________________________________________________________
	EZ.test.settings( {group:'obj and options same Object -- contains property native Object'} )

	x = {children:true, objects:Object};
	EZ.test.run(x, x)

	x.exclude = 'Object';
	EZ.test.run(x, x)

	x.exclude = 'native';
	EZ.test.run(x, x)

	x.exclude = 'objects';
	EZ.test.run(x, x)

	x.exclude = '.objects';
	EZ.test.run(x, x)
	
	EZ.test.settings( {group:''} )
	//_______________________________________________________________________________
	
	ex = {a:1, b:2, arr: [1,2]};
	obj = ex;
	note = 'Object with embedded Array'
	EZ.test.run(ex, {},								{EZ: {ex:ex, ctx:ex, note:note}})
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
	EZ.test.run(ex, {},								{EZ: {ex:ex, ctx:ex, note:note}})
	
	//_______________________________________________________________________________
	EZ.test.settings( {group:'Function: script only'} )

	fn = function cloneTest(a,b) {return a*b}
	var anom = function() {};
	var myfn = function my() {};
	
	EZ.test.run(fn, {ignore:'', exclude:''})
	EZ.test.run(fn, {ignore:'', exclude:'Function'})
	EZ.test.run(fn, {ignore:'script', exclude:''})
	EZ.test.run(fn, {ignore:'script', exclude:'Function'})
	EZ.test.run(fn, {ignore:'script, constructors', exclude:''})
	EZ.test.run(fn, {ignore:'script, constructors', exclude:'Function'})

	EZ.test.settings( {group:'Function: with Array property'} )
	fn.colors = ['red','yellow','green']
	EZ.test.run(fn, {ignore:'', exclude:''})
	EZ.test.run(fn, {ignore:'', exclude:'Function'})
	EZ.test.run(fn, {ignore:'script', exclude:''})
	EZ.test.run(fn, {ignore:'script', exclude:'Function'})
	EZ.test.run(fn, {ignore:'script, constructors', exclude:''})
	EZ.test.run(fn, {ignore:'script, constructors', exclude:'Function'})

	EZ.test.settings( {group:'Function: with anonymous fn property'} )
	delete fn.colors
	fn.anom = anom;
	EZ.test.run(fn, {ignore:'', exclude:''})
	EZ.test.run(fn, {ignore:'', exclude:'Function'})
	EZ.test.run(fn, {ignore:'script', exclude:''})
	EZ.test.run(fn, {ignore:'script', exclude:'Function'})
	EZ.test.run(fn, {ignore:'script, constructors', exclude:''})
	EZ.test.run(fn, {ignore:'script, constructors', exclude:'Function'})

	EZ.test.settings( {group:'Function: anonymous and function my() no properties in my'} )
	fn.my = myfn;
	EZ.test.run(fn, {ignore:'', exclude:''})
	EZ.test.run(fn, {ignore:'', exclude:'Function'})
	EZ.test.run(fn, {ignore:'script', exclude:''})
	EZ.test.run(fn, {ignore:'script', exclude:'Function'})
	EZ.test.run(fn, {ignore:'script, constructors', exclude:''})
	EZ.test.run(fn, {ignore:'script, constructors', exclude:'Function'})

	EZ.test.settings( {group:'Function: with function my() with properties'} )
	myfn.counts = {good:9, fail:1};
	EZ.test.run(fn, {ignore:'', exclude:''})
	EZ.test.run(fn, {ignore:'', exclude:'Function'})
	EZ.test.run(fn, {ignore:'script', exclude:''})
	EZ.test.run(fn, {ignore:'script', exclude:'Function'})
	EZ.test.run(fn, {ignore:'script, constructors', exclude:''})
	EZ.test.run(fn, {ignore:'script, constructors', exclude:'Function'})
		
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	EZ.test.settings( {group:'Function: with circular function my()'} )
	myfn.circular = myfn;
	//EZ.test.run(fn, {ignore:'', exclude:''})

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	EZ.test.settings( {group:'{fn:...Function: with function my() with properties...}'} )
	obj = fn;
	
	EZ.test.run(obj, {ignore:'', exclude:''})
	EZ.test.run(obj, {ignore:'', exclude:'Function'})
	EZ.test.run(obj, {ignore:'script', exclude:''})
	EZ.test.run(obj, {ignore:'script', exclude:'Function'})
	EZ.test.run(obj, {ignore:'script, constructors', exclude:''})
	EZ.test.run(obj, {ignore:'script, constructors', exclude:'Function'})
		
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	EZ.test.settings( {group:'{obj with native constructor Functions}'} )
	obj = {o:Object, a:Array, b:Boolean, s:String, 'alert':alert}
	
	EZ.test.run(obj, {ignore:'', exclude:''})
	EZ.test.run(obj, {ignore:'', exclude:'Function'})
	EZ.test.run(obj, {ignore:'script', exclude:''})
	EZ.test.run(obj, {ignore:'script', exclude:'Function'})
	EZ.test.run(obj, {ignore:'script, constructors', exclude:''})
	EZ.test.run(obj, {ignore:'script, constructors', exclude:'Function'})
		
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	EZ.test.settings( {group:'{obj with native window Objects}'} )
	obj = {'Math':Math, 'status':status, 'statusbar':window.statusbar}
	
	EZ.test.run(obj, {ignore:'', exclude:''})
	EZ.test.run(obj, {ignore:'', exclude:'Function'})
	EZ.test.run(obj, {ignore:'script', exclude:''})
	EZ.test.run(obj, {ignore:'script', exclude:'Function'})
	EZ.test.run(obj, {ignore:'script, constructors', exclude:''})
	EZ.test.run(obj, {ignore:'script, constructors', exclude:'Function'})
	
	obj = {'document':document}
	EZ.test.run(obj, {ignore:'', exclude:''})
	EZ.test.run(obj, {ignore:'', exclude:'Function'})
	EZ.test.run(obj, {ignore:'script', exclude:''})
	EZ.test.run(obj, {ignore:'script', exclude:'Function'})
	EZ.test.run(obj, {ignore:'script, constructors', exclude:''})
	EZ.test.run(obj, {ignore:'script, constructors', exclude:'Function'})
	
	//_______________________________________________________________________________
	EZ.test.settings( {group:'Circular Structures:'} );
	note = ''

	arr = [1,2];
	ex = {a:1, b:2, arr:arr, repeat:arr};
	EZ.test.run(ex, {},								{EZ: {ex:ex, ctx:ex, note:note}})
	
	var x = {a:1};
	x.b = x;
	EZ.test.run(x, {});

	note = 'Object with circular property'
	arr = [1];
	ex = {a:1};
	ex = ex.circular = ex;
	EZ.test.run(ex, {},								{EZ: {ex:ex, ctx:ex, note:note}})
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'use pending clone logic'
	var x = {a:'abc'};
	x.b = x;
	ex = {
		actual: {
			0: x,
		}
	}
	EZ.test.run(ex, {},								{EZ: {ex:ex, ctx:ex, note:note}})
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .


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


	/*
	EZ.test.run(divObj, lists_keys_quoted)
	EZ.test.run(divObj, plusOpts)
	EZ.test.run(bothObj, plusOpts)
	*/
	
	obj = {children:true, objects:Object, functions:false, maxdepth:4};
	EZ.test.run(obj, {})
	//_______________________________________________________________________________

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
	EZ.test.run(obj, {},	 						{EZ:{ex:ex, ctx:ctx, note:note}})


	var div = document.createElement('div');
	var span = document.createElement('span');
	var divObj = {d:div}
	var bothObj = {d:span, s:span}

	EZ.test.run(divObj, {},		{EZ: {ex:{d:div},       	note:''	}})
	EZ.test.run(bothObj, {},	{EZ: {ex:{d:div, s:span},	note:''	}})

	var fn = function cloneTest(a,b) {return a*b}
	var results = EZ.test.run(fn, {},	{EZ: {ex:fn,       	note:''	}})
	
	/* TODO: jshint: future vars - now unused */ e = [bothObj, results]	
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
EZ.test.skip(99999);
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
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/

