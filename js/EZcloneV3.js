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
EZ.cloneV3(o, options)
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
EZ.cloneV3 = (function _____EZcloneV3_____()
{
	var defaultOptions = {				//by default everything cloned up to 99 levels deep
		maxdepth: 99,
		functions: true,
		objects: true,
		ignore: [],			/*			="script" only clone functions with enumerable properties
												and only keep the enumerable properties
												
										="constructor" all Objects and Functions cloned as Objects
												not original constructor -- does not apply to: 
													Date, RegExp, Element or native functions.
												Does apply to NodeList or HTMLCollection
							*/
		exclude: [],		/*			dotName if starts with "." otherwise key or native function name
										e.g. Array, Date, RegExp, Element, Function ("native" for all)
			??							Keys or native functions excluded from all Objects and Functions. 
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
					ignore:'script, constructor', 
					exclude:'Function',
				}
			}
		},
		formatter: 'EZtoString',
		formatOptions: { 
			tostring: {timestamp: false},
			stringify:{spaces:4} 
		},
		name: 'EZ.cloneV3.defaultOptions',
		version: '11-13-2016',
	}
	//__________________________________________________________________________________________________
	/**
	 *	creates new instance but copies all properties and prototypes to global instance (pseudo static)
	 *	 EZ.cloneV3() is valid constructor -or- can call defaultFunction with "this" context.
	 */
	var _init = function _init(name)
	{
		EZ.log('_init():', name.replace(/^_*(EZ)(.*?)_*$/, '$1.$2'));
		
		var fn = new EZcloneV3();					//create instance for persistant EZ.clone Object
		
		fn._ = defaultOptions.defaults._ || {};		//add default this._ properties	from defaultOptions
		fn._.defaultOptions = defaultOptions;		//...and defaultOptions but then... 
		delete fn._.defaultOptions.defaults._;		//...discard this._ defaults from defaultOptions
		
		for (var key in fn)
			EZcloneV3[key] = fn[key];
			
		EZ.event.add(window, 'onload', function()	//initialization done after DOM loaded
		{											
			EZ.log(EZcloneV3.toString())
		});	
	
		return EZcloneV3;
	}
	//__________________________________________________________________________________________________
	/**
	 *	constructor for _init() -- subsequently calls defaultFunction
	 */
	function EZcloneV3()
	{
		var me = arguments.callee;				//if NOT called as constructor -- call default EZ.clone()
		if ( !(this instanceof me) )			//...old EZ.clone.json() until EZ.clone.object solid
		{										
			return _jsonClone.apply(me, [].slice.call(arguments));	
		}
												//called as constructor by _init()	(unused shell code)
		if (EZ.cloneV3 === undefined)			//...getters and setters defined below
		{										//...non-function properties initialized by _init()
													
		}
	}
	//__________________________________________________________________________________________________
	/**
	 *	Now optionally using function from EZ.returnValue() -- don't think we want this
	 */
	/*	gets called by debugger when key typed in console while debugging EZ.jsonPlus() monitor
	EZcloneV3.prototype.toString = function()
	{
		var str = this.name + ':'
		if (this == EZcloneV3)		//TODO: ??
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
	EZcloneV3.prototype.infoClear = function EZclone_infoClear()
	{
		var _ = EZ.cloneV3._;
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
				EZ.logPlus.call('clone.object', msg, details);
				
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
	
	if called as constructor (optional), EZreturnValue function are bound to new Object returned.
	
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
		//if (EZ.test.capture()) {return EZ.test.capture(this)} else if (EZ.test.debug()) debugger;

		false error with ignore contructor
		when contructor not ignored must clear unmatched propeties / fn
		clone log errors, circular, deleted, changed
		stringify messages not logged ??
		
	EZprototypes_only.js::Object.removeKeys.test() great to test clone or callArgs
	--------------------------------------------------------------------------------------------------*/
	EZcloneV3.prototype.object = function EZclone_object(obj, options /*maxdepth*/, depth)
	{
		EZ.clone.counts = EZ.clone.counts || {calls:0, fails:0, faults:[]};
		EZ.clone.counts.calls++;
		
		var log = new EZ.logger('clone');
		
		options = typeof(options) == 'number' ? {maxdepth: options} 
				: EZ.options.call(options);		//convert delimited String to options Object
		
		options = EZ.options.call(EZ.cloneV3._.defaultOptions, options);
		options.ignore = EZ.toArray(options.ignore,', ');
		options.exclude = EZ.toArray(options.exclude,', ');
options.ignore.push('constructor');
		
		//--------------------------------------------------
		var rtnValue = new EZ.returnValue(this, options);
		//--------------------------------------------------
		var data = rtnValue.getData();
		
		var msg,
			depth = depth || 0,
			topDepth = depth,
			dotName = [''],
			counter = 0,
			objectsProcessed = [],
			clonedObjects = [],
			pendingClones = [];
		
		//------------------------------------------------------
		var clone = _clone_object(obj, options, depth, dotName);
		//------------------------------------------------------
		rtnValue.setValue(clone);
		
		pendingClones.forEach(function(key, idx)
		{											//populate pendingClones if any
			if (!key || clonedObjects[idx] === undefined) return;
			var keys = key.split('.')
			var repeatKey = keys.pop();
			var repeatObj = keys.join('.').ov(clone);

			if (repeatObj instanceof Object
			&& !(repeatObj[repeatKey] in repeatObj))
				repeatObj[repeatKey] = clonedObjects[idx];
			else
				void(0);	//debugger breakpoint
		});

		var isEqual = 'na';
		if (options.quit)
			isEqual = 'quit';
		else if (!rtnValue.haveList('excluded'))			//if no excluded values
		{
			var eqOpts = {showDiff:true};
			if (rtnValue.haveList('ignored_constructors'))
				eqOpts.ignore = 'constructor';
			if (rtnValue.haveList('html_tags'))
				eqOpts.html = true;
				
			if (typeof(obj) != 'function')
				isEqual = EZ.isEqual(obj, clone, eqOpts);
			
			if (!isEqual)
			{
				EZ.clone.counts.fails++;
				data.success = false;
				data.showDiff = EZ.equals.formattedLog;
				/*
				var detail = {
					rtnValue: rtnValue.getData(), 
					obj:obj, 
					clone:clone
				}
				*/
				log('clone differences from original Object', data.showDiff);
				
				msg = EZ.equals.formattedLog || ['...EZ.equals() diff detail NA...'];
				rtnValue.addMessage(msg);
				rtnValue.addDetails(msg.concat(EZ.getStackTrace(1)));
				
				EZ.clone.counts.faults++;		
			}
		}
		data.success = isEqual;
		//==========================
		return rtnValue.save(clone);				//return clone or EZclone_object custom Object
		//==========================
		//______________________________________________________________________________________________
		/**
		 *	called specified Object and recursively for any nested Objects.
		 */
		function _clone_object(obj, options, depth, dotName)
		{
			if ( !(obj instanceof Object) )
				return obj;
		
			if (counter++ == 9999) 				//bail if 100 recursive calls
			{
				EZ.oops('10000 recursive calls -- stop Object clone at: $' + dotName.join('.'))
				rtnValue.addMessage('too many recursive calls');
				rtnValue.addDetails(EZ.getStackTrace());
				options.quit = true
			}
			if (options.quit) 					//development aid / safety
				return {};
		
			//---------------------------------
			var clone = '';						//empty string for Object value if excluded
			//---------------------------------
			do
			{
				var type = obj.constructor.name;
				if (topDepth != depth)								//specified obj not excluded
				{														
					if (options.exclude.includes(type) && type != 'Function')
					{												//Function excluded by _createObjectClone()
						rtnValue.mergeListItem('excluded', type, dotName)
						break;											
					}
					if ((options.exclude.includes('Element') || options.exclude.includes('html')) 
					&& (type.startsWith('HTML') || type == 'NodeList'))
					{												//excluding html elements
						rtnValue.mergeListItem('excluded', type, dotName)
						break;
					}
				}
				if (depth > options.maxdepth && options.maxdepth)
				{
					msg = 'maxdepth [' + options.maxdepth + '] reached @ : ' + dotName + '\n'
						+ 'using un-cloned ' + dotName;
					log(msg);
					
					clone = obj;
					break;
				}
																	  //------------------------\\
				if (obj instanceof Date)							 //---------- Date ----------\\
				{													//----------------------------\\
					clone = isNaN(obj) ? new Date('invalid') : new Date(obj.getTime());
					break;
				}
																	  //--------------------------\\
				else if (obj instanceof RegExp)						 //---------- RegExp ----------\\
				{													//------------------------------\\
					clone = new RegExp(obj);
					clone.lastIndex = obj.lastIndex;
					break;
				}
																	  //---------------------------\\
				else if (obj instanceof Element || type == 'Text')	 //---------- Element ----------\\
				{													//-------------------------------\\
					if (_excludedTag(obj))							//TODO: exclude html
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
						Object.keys(clone).forEach(function(key)	//remove non-native properties
						{											// e.g. EZ, EZ$, EZfield...
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
							var node = _clone_object(obj.childNodes[i], childOpts, depth+1, nodeDotName);
							//----------------------------------------------------------------------------
							clone.appendChild(node);
						}
					}
					break;
				}
																	  //----------------------------\\
				var isNative;										 //----- Object or Function -----\\
				clone = _createObjectClone(type);					//--------------------------------\\
																	//clone empty string when excluded
																	//isNative true for native window Object
																	//e.g. Object, Array, alert, Math
				if (topDepth == depth)
				{
					if (clone === '')								//when topLevel Object excluded...
						clone = {};									//...return empty Object
					else if (!isNative)
					{
						objectsProcessed = [obj];
						clonedObjects = [clone];
					}
				}
				else if (clone === '') 								//if not topLevel...
					break;											//...delete excluded Object
									
				var keys = Object.keys(obj);						//Array or Object keys
				var excludeKeys = options.exclude;					//specified exclude keys
				if (excludeKeys.length)								//...remove excluded keys if any
				{														
					var dotNameObj = dotName.slice().join('.');
					var regex = RegExp('^' + dotNameObj + "\\.");
							
					excludeKeys.forEach(function(key)				//for each exclude key. . .	
					{
						if (key.includes('.'))
							key = key.replace(regex, '')
						var idx = keys.indexOf(key);
						if (idx != -1)								//if obj contains exclude key...
						{											//...remove from keys list
							keys.splice(idx,1);						//...add dotName to excluded list
							msg = EZ.getType(obj[key],true).wrap('[]');
							rtnValue.mergeListItem('excluded', msg, dotName.concat(key));
						}
					});
				}
																	  //----------------------------------\\
				keys.forEach(function(p)							 //----- for each Object property -----\\
				{													//--------------------------------------\\
					var idx;
					var dotNameNext = dotName.concat([p]);
					var key = dotNameNext.join('.');
					if (obj[p] instanceof Object === false)
						clone[p] = obj[p];							//copy value if not Object
						
					else if ((idx = objectsProcessed.indexOf(obj[p])) != -1)
					{												//if repeated object . . .
						if (idx < clonedObjects.length
						&& clonedObjects[idx] !== undefined)
							clone[p] = clonedObjects[idx]			//use prior clone if found
						else
							pendingClones[idx] = key;				//or add to pendingClones list
					}
					else											//otherwise . . .
					{
						//var myIdx = objectsProcessed.length;
						objectsProcessed.push(obj[p]);				//add to objectsProcessed list
						//----------------------------------------------------------------------------
						var value = _clone_object(obj[p], options, depth+1, dotNameNext);
						//----------------------------------------------------------------------------					
						if (value !== '')							//if obj property not excluded. . .
						{												
							if (clone instanceof Element)			//NodeList or HTMLCollection
								clone.appendChild(value);
							else
								clone[p] = value;
							
							idx = objectsProcessed.indexOf(obj[p])
							if (idx != -1 							//safety for unexpected
							&& clonedObjects[idx]===undefined)		//if clone not yet saved...
						//	&& clonedObjects[idx] == null)		
								clonedObjects[idx] = clone[p];		//...save for pendingClones
						}
					}
				});
				clone = (type == 'NodeList') ? clone.childNodes
					  : (type == 'HTMLCollection') ? clone.children
					  : clone;
			}
			while (false)
			//==========================
			return clone;
			//==========================
			//__________________________________________________________________________________
			/**
			 *	check for native functions and more intuitive/flexible ignore / exclude options.
			 */
			function _createObjectClone()
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
							if (options.ignore.includes('constructor'))
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
							if (options.ignore.includes('constructor'))
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
											
									="constructor" all Objects and Functions cloned as Objects
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
						
						if (options.ignore.includes('constructor'))
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
								msg = 'unable to clone function: ' + msg 
									+ ' for [' + dotName + ']\n' + 'used empty Object';
								msg = log(msg, e);
								rtnValue.addMessage(msg)
								rtnValue.addDetails(EZ.getStackTrace());
								rtnValue.mergeListItem('excluded', msg + '[script syntax]', dotName)
							}
						}
					}
					while (false)
					return clone;
				}
			}
			//__________________________________________________________________________________
			/**
			 *	
			 */
			function _excludedTag()
			{
				return false;
			}
		}
	}	
	//=============================================================================================
	return _init(arguments.callee.name);
})();
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.cloneV3.object.test = function EZclone_object_test()
{
	var ex, ctx, fn, json, note, obj, arr, tags, x;
	void(ex, ctx, fn, json, note, obj, arr, tags, x);
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	/*NOTES:
	The actual return value displays the returned clone, when the test call isOk(). If the
	actual return value is a returnValue Object, it is replaced with returned clone from getValue() 
	and the actual return value is displayed as the 2nd argument return value.
	
	The expected return value must be set by test script or loaded from previously savedResults.

	The expected value for the 1st argument is set to the returned clone so it can be compared to the
	original call value (unless the test script sets a value or one is loaded from prior savedResults).
	
	The 2nd returned argument displays either the actual return value if its a rtnValue Object
	otherwise the rtnValue if displayed from the testrun data.
	
	When Ok rules require the return value to match the expected value, the test fails unless an 
	expected return value is set by test script or the results are saved with expected results 
	updated to actual results.
	*/
	//________________________________________________________________________________________	
	var exfn = function exfn(testrun)
	{
		var msg;
		var options = EZ.test.run.options || {};
		void(options);
		
		var rtnValue = EZ.test.run.rtnValue;
		if (!rtnValue || !rtnValue.isOk)
			return testrun.appendNote('rtnValue Object NOT available'.wrap('<em>'));
		
		var data = rtnValue._data;
		var isOk = rtnValue.isOk();
		var value = rtnValue.getValue();
		var results = testrun.getResults();
		
		var isReturnValue = (results instanceof Object && results.isOk);	
		var isReturnValueExpected = (testrun.call == 'new' || (options.returnType + '') == 'true');
		
		if (isReturnValue)
			msg = (isReturnValueExpected) ? 'is ' + 'rtnValue'.wrap('<i>')
				: 'IS rtnValue -- NOT'.wrap('<em>') + ''
		else if (isReturnValueExpected)
			msg = 'NOT rtnValue'.wrap('<em>') + ' as expected';
		else
			msg = 'not rtnValue'.wrap('<i>');
		
		msg = 'success=' + isOk.wrap(isOk === true ? '<i>': '<em>')
			+ ' return value ' + msg;
		testrun.appendNote( msg );
		
		//if (isOk !== true && !testrun.isExpectedResults())		//only set expected results if not ok
		//	testrun.setExpectedResults('not expected'.wrap())	//...otherwise use scriipt or saved value
			
		if (isReturnValue)
		{
			testrun.setResults(value, 'returned clone');
			testrun.appendNote('actual return value set to ' + 'rtnValue.getValue()'.wrap('<cite>'));	
		}
		
		if (!testrun.isExpectedArgument('1st') && isOk === true)
		{
			testrun.setExpectedArgument('1st', value );
			testrun.appendNote('1st expected argument set to ' + 'rtnValue.getValue()'.wrap('<cite>'));
		}
		else if (testrun.isArgumentChanged('1st'))
		{
			testrun.setExpectedArgument('1st', testrun.getArgument('1st'), 'input obj');
			testrun.appendNote('1st expected argument set to ' + 'input obj'.wrap('<cite>'));
		}
		//msg = EZ.json.stringify(data)	//.replace(/\\n/g,'<br>\n');
		//msg = msg.replace(/\\n/g, '\n' + ' '.dup(20));
		//testrun.setResultsArgument('2nd', msg, 'EZ.clone.rtnValue');
		
		if (isReturnValue)
		{
			testrun.setResultsArgument('2nd', results, 'actual return value');
			//testrun.appendNote('2nd actual argument set to actual results' + 'EZreturnValue'.wrap('<cite>'));	
			testrun.appendNote('2nd actual argument set to ' + 'actual return value'.wrap('<cite>'));	
		}
		else
		{
			testrun.setResultsArgument('2nd', data, 'EZreturnValue[data]');
			testrun.appendNote('2nd actual argument set to ' + 'EZreturnValue[data]'.wrap('<cite>'));	
		}

		if (value instanceof Element
		|| /(NodeList|HTMLCollection)/.test(EZ.getConstructorName(value)))
		{
			var html = EZ.format.Element(value, {extract:'children'} );
			msg = '<hr><i>HTML created from return value:</i>\n' + html;
			testrun.appendNote( msg.replace(/</g, '&lt;') ); 
		}
	} 
	//=================================================================================
	//EZ.test.settings( {exfn:exfn, notefn:notefn, ignoreArgs:'3rd'} );
	
	//_______________________________________________________________________________
	EZ.test.settings( {group:'live faults:', call:''} );
	
	obj =
		{
			_filename: "EZcloneV3.js",
			_folder: "Shared/EZ/js",
			_functionName: "EZ.cloneV3.object",
			_selectedList: {
				"": "Shared/EZ/js",
				"Shared/EZ/html": "",
				"Shared/EZ/js": "EZcloneV3.js",
				"Shared/EZ/js:EZadvanced.js": "EZ.mergeMessages",
				"Shared/EZ/js:EZbase.js": "",
				"Shared/EZ/js:EZbase_min.js": "EZ.clone",
				"Shared/EZ/js:EZbasic.js": "EZ.mergeMessages",
				"Shared/EZ/js:EZprototypes_only.js": "Array.prototype.remove",
				"Shared/EZ/js:EZcloneV3.js": "EZ.cloneV3.object"
			},
			folderInfo: {
				"Shared/EZ/html": {
					filenameList: [
						"EZextractFunctions.js", "EZtest_assistant_data.js", "EZtest_assistant_run.js", "EZtest_assistant_support.js", "EZtest_assistant_tests.js", "EZtest_assistant_variants.js", "EZtestdata.js", "EZtester.js", "EZtrace.js", "RZcompatibility.js",
						"RZtest_assistant_support.js", "deleteme.js"
					],
					recent: [],
					url: "http://localhost:8080/revize/dw.Configuration/Shared/EZ/html/"
				},
				"Shared/EZ/js": {
					filenameList: [
						"EASY.dom.js", "EZ.deleteme.js", "EZadvanced.js", "EZbase.js", "EZbase_min.js", "EZbasic.js", "EZbasicUtils.js", "EZcapture.js", "EZchecklist.js", "EZcloneDev.js",
						"EZcloneV3.js", "EZcommon.js", "EZcommon.revize.js", "EZcommonParse.beforeEZstackx.js", "EZcommonParse.js", "EZcommonValidate.js", "EZcommonXml.js", "EZcommon_min.js", "EZcommon_min_noLS.js", "EZcommon_pruned.js",
						"EZcore.js", "EZcore_pruned.js", "EZdate - Copy [2].js", "EZdate - Copy [3].js", "EZdate - Copy.js", "EZdate.deleteme.js", "EZdate.js", "EZdate.work.js", "EZdebug - Copy.js", "EZdebug.js",
						"EZdeleteme.js", "EZdev - Copy.js", "EZdev.js", "EZdom.js", "EZdwutils.js", "EZequals.base.js", "EZequals.menu_editlist.js", "EZevent.js", "EZformat.js", "EZfuse.js",
						"EZfuse.replaceValue.js", "EZfuse.safe.js", "EZfuse.work.js", "EZgetset - Copy [2].js", "EZgetset - Copy [3].js", "EZgetset - Copy.js", "EZgetset.deleteme.js", "EZgetset.manual.js", "EZgetset.old.js", "EZgetset.safe.js",
						"EZgetset.try1.js", "EZgetset.work.js", "EZgetset.work2.js", "EZglobal.js", "EZis.js", "EZjson.js", "EZjsonPlus.js", "EZjsonPlusV3 - Copy.js", "EZjsonPlusV3.js", "EZjsonPlus_parse.js",
						"EZlegacy.js", "EZls.js", "EZprototypes.js", "EZprototypes_only - Copy.js", "EZprototypes_only.after2016-04-18.ov fix.js", "EZprototypes_only.before2016-04-18.ov fix.js", "EZprototypes_only.js", "EZreturnValue.bad.js", "EZreturnValue.js", "EZsortable.js",
						"EZstore.js", "EZstringify - Copy.js", "EZstringify.js", "EZstringify.safe.js", "EZstringifyWork - Copy.js", "EZstringifyWork.js", "EZtoString.js", "EZtrace.js", "EZtrace.work.EZdate().js", "Sortable.js",
						"common.js", "commonParse.js", "commonValidate.js", "deleteme.js"
					],
					recent: ["EZcloneV3.js", "EZadvanced.js"],
					url: "http://localhost:8080/revize/dw.Configuration/Shared/EZ/js/",
					set: {}
				}
			},
			fnLists: {
				"Shared/EZ/js": {
					"EASY.dom.js": {
						callCounts: {},
						functionList: [
							["--no test scripts--", "--no test scripts--", false]
						],
						linenos: {},
						recent: [],
						timestamp: "11-03-2015 01:06:46 pm",
						url: "C:/Users/Dell/AppData/Roaming/Adobe/Dreamweaver CC 2014.1/en_US/Configuration/Shared/EZ/js/EASY.dom.js"
					},
					"EZbase.js": {
						functionList: [
						],
						recent: ["EZ.equals", "EZ.getEl_basic", "EZ.getAncestor", "EZ.clone", "EZ.collapse"],
						timestamp: "01-13-2017 02:37:21 am",
						timestamp_functionList: "01-13-2017 02:37:21 am"
					},
					"EZbasicUtils.js": {
						callCounts: {},
						functionList: [
							["--no test scripts--", "--no test scripts--", false]
						],
						linenos: {},
						recent: [],
						timestamp: "10-21-2015 09:14:40 pm",
						url: "C:/Users/Dell/AppData/Roaming/Adobe/Dreamweaver CC 2014.1/en_US/Configuration/Shared/EZ/js/EZbasicUtils.js"
					},
					"EZcapture.js": {
						callCounts: {},
						functionList: [
							[" EZ.valueMap()", "EZ.valueMap", "", ""]
						],
						linenos: {
							"EZ.valueMap": 1546
						},
						linenos_timestamp: "11-19-2016 11:05:50 am",
						recent: [],
						timestamp: 0
					},
					"EZchecklist.js": {
						callCounts: {},
						functionList: [],
						linenos: {},
						linenos_timestamp: "07-01-2015 12:10:36 am",
						recent: [],
						timestamp: 0
					},
					"EZ.mergeMessages": {
						functionList: [
							["-", "no items", false, "noitems"]
						],
						recent: [],
						test_counts: {},
						timestamp_functionList: 0
					}
				}
			},
			recentTestList: ["EZ.mergeMessages 	 EZadvanced.js 	 Shared/EZ/js 	 01-15-2017", "EZ.mergeMessages 	 EZbasic.js 	 Shared/EZ/js 	 @ 01-13-2017"],
			recentTestListLimit: 5,
			timestamp: "2017-01-18T17:36:27.920Z"
		}


	EZ.test.run(obj);
	
	//_______________________________________________________________________________
	EZ.test.settings( {exfn:exfn} );
	EZ.test.settings( {group:'IS called as new:', call:'new'} );
	
	obj = [0,1];
	EZ.test.options( {note:'easy Array - quit after setup'} )
	EZ.test.run(obj, {quit:true, returnType:true});
	
	EZ.test.options( {note:'easy Array - quit after setup', ex:{}} )
	EZ.test.run(obj, {quit:true});

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	EZ.test.options( {note:'easy Array', ex:obj} )
	EZ.test.run(obj, {});
	
	//_______________________________________________________________________________
	EZ.test.settings( {group:'NOT called as new:', call:''} );
	
	EZ.test.options( {note:'easy Array', ex:obj} )
	EZ.test.run(obj, {});
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	EZ.test.options( {note:'easy Array return rtnValue', ex:obj} )
	EZ.test.run(obj, {returnType:true});
	
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
	EZ.test.run(div.childNodes, {ignore:'constructor'});

	EZ.test.options( {note:'HTMLCollection: span, text'} )
	EZ.test.run(div.children, {})

	EZ.test.options( {note:'HTMLCollection: span, text -- cloned as Object'} )
	EZ.test.run(div.children, {ignore:'constructor'});

	tags = document.getElementsByTagName('eztest_tag');
	EZ.test.options( {note:'huge HTMLCollection'} )
	EZ.test.run(tags, {});
	
	EZ.test.options( {note:'huge HTMLCollection -- cloned as Object'} )
	EZ.test.run(tags, {ignore:'constructor'});

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

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
	EZ.test.settings( {group:'Function: script only'} )

	fn = function cloneTest(a,b) {return a*b}
	var anom = function() {};
	var myfn = function my() {};
	
	EZ.test.run(fn, {ignore:'', exclude:''})
	EZ.test.run(fn, {ignore:'', exclude:'Function'})
	EZ.test.run(fn, {ignore:'script', exclude:''})
	EZ.test.run(fn, {ignore:'script', exclude:'Function'})
	EZ.test.run(fn, {ignore:'script, constructor', exclude:''})
	EZ.test.run(fn, {ignore:'script, constructor', exclude:'Function'})

	EZ.test.settings( {group:'Function: with Array property'} )
	fn.colors = ['red','yellow','green']
	EZ.test.run(fn, {ignore:'', exclude:''})
	EZ.test.run(fn, {ignore:'', exclude:'Function'})
	EZ.test.run(fn, {ignore:'script', exclude:''})
	EZ.test.run(fn, {ignore:'script', exclude:'Function'})
	EZ.test.run(fn, {ignore:'script, constructor', exclude:''})
	EZ.test.run(fn, {ignore:'script, constructor', exclude:'Function'})

	EZ.test.settings( {group:'Function: with anonymous fn property'} )
	delete fn.colors
	fn.anom = anom;
	EZ.test.run(fn, {ignore:'', exclude:''})
	EZ.test.run(fn, {ignore:'', exclude:'Function'})
	EZ.test.run(fn, {ignore:'script', exclude:''})
	EZ.test.run(fn, {ignore:'script', exclude:'Function'})
	EZ.test.run(fn, {ignore:'script, constructor', exclude:''})
	EZ.test.run(fn, {ignore:'script, constructor', exclude:'Function'})

	EZ.test.settings( {group:'Function: anonymous and function my() no properties in my'} )
	fn.my = myfn;
	EZ.test.run(fn, {ignore:'', exclude:''})
	EZ.test.run(fn, {ignore:'', exclude:'Function'})
	EZ.test.run(fn, {ignore:'script', exclude:''})
	EZ.test.run(fn, {ignore:'script', exclude:'Function'})
	EZ.test.run(fn, {ignore:'script, constructor', exclude:''})
	EZ.test.run(fn, {ignore:'script, constructor', exclude:'Function'})

	EZ.test.settings( {group:'Function: with function my() with properties'} )
	myfn.counts = {good:9, fail:1};
	EZ.test.run(fn, {ignore:'', exclude:''})
	EZ.test.run(fn, {ignore:'', exclude:'Function'})
	EZ.test.run(fn, {ignore:'script', exclude:''})
	EZ.test.run(fn, {ignore:'script', exclude:'Function'})
	EZ.test.run(fn, {ignore:'script, constructor', exclude:''})
	EZ.test.run(fn, {ignore:'script, constructor', exclude:'Function'})
		
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
	EZ.test.run(obj, {ignore:'script, constructor', exclude:''})
	EZ.test.run(obj, {ignore:'script, constructor', exclude:'Function'})
		
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	EZ.test.settings( {group:'{obj with native constructor Functions}'} )
	obj = {o:Object, a:Array, b:Boolean, s:String, 'alert':alert}
	
	EZ.test.run(obj, {ignore:'', exclude:''})
	EZ.test.run(obj, {ignore:'', exclude:'Function'})
	EZ.test.run(obj, {ignore:'script', exclude:''})
	EZ.test.run(obj, {ignore:'script', exclude:'Function'})
	EZ.test.run(obj, {ignore:'script, constructor', exclude:''})
	EZ.test.run(obj, {ignore:'script, constructor', exclude:'Function'})
		
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	EZ.test.settings( {group:'{obj with native window Objects}'} )
	obj = {'Math':Math, 'status':status, 'statusbar':window.statusbar}
	
	EZ.test.run(obj, {ignore:'', exclude:''})
	EZ.test.run(obj, {ignore:'', exclude:'Function'})
	EZ.test.run(obj, {ignore:'script', exclude:''})
	EZ.test.run(obj, {ignore:'script', exclude:'Function'})
	EZ.test.run(obj, {ignore:'script, constructor', exclude:''})
	EZ.test.run(obj, {ignore:'script, constructor', exclude:'Function'})
	
	obj = {'document':document}
	EZ.test.run(obj, {ignore:'', exclude:''})
	EZ.test.run(obj, {ignore:'', exclude:'Function'})
	EZ.test.run(obj, {ignore:'script', exclude:''})
	EZ.test.run(obj, {ignore:'script', exclude:'Function'})
	EZ.test.run(obj, {ignore:'script, constructor', exclude:''})
	EZ.test.run(obj, {ignore:'script, constructor', exclude:'Function'})
	
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

