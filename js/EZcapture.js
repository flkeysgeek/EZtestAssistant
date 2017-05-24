/*--------------------------------------------------------------------------------------------------
LINT options -- function below not called
--------------------------------------------------------------------------------------------------*/
/*global EZ, e:true, g, dw, DWfile */
/*global EZdisplayMessage, EZtimestamp, EZstripConfigPath */
var e;
(function jshint_globals_not_used() {	//global variables and functions defined but not used
	e = [e, g, dw, DWfile
]});

/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.defaultOptions = EZ.defaultOptions || {};
EZ.defaultOptions.capture = {
	
	activeList: [],
	
	counts: {}, 		//no limits for: recursive, anonymous.or delay -- never captured
						//				 EZcaptureFault: if under limit, calls EZ.techSupport() 
						//				 
	limits: { 
		'capture.check': 10, 
		'capture':5, 
		'dup args': 1,		//limits captute of unique faults
		exception:0, EZcaptureFault:3, incomplete:1, 
		anonymous:10, testfn:5, nested:2, scripts:5, faults:5,  other:5
	}, 
	
	recursive: {},		//TODO: limits by fn?	-- limits.recursive hard coded to 0 in getCapture()
	delay: { faults: 1000, scripts: 0 },	//skip capture from same fn within delay milliseconds
	
						//capture mode by oops function name e.g. "EZ.capture.get"
						//mode[''] is global values -- can be overridde by fn name
	mode: {'':false, 'EZ.json_unquoteKeys': 'once', 'String.prototype.ov': false},	

						//=false never capture
						//=true or ="unique", capture unique callerArgs
						//="faults" only capture faults
						//="save" 	only save capture data if EZ.save=true -or-
						//			includes fn name (usually set by debugger)
						//		 	EZ.save cleared after data saved
	
	fnNames: {},		//key is fn nmme -- value is fn name
	fnData: {},			//url, lineno
	
	regex: {			//for parsing call stack
		fnName: /[\s\S]*\s+at (Function\.)?(EZcapture.*)\s*at\s+(.*?) (.*)/,
		fnData: /.*\((.*\..*?):(.*)\)/
	},
	
	faults:  {total:0, dup:0, unique:0, skip:0},
	scripts: {total:0, dup:0, unique:0, skip:0},
	
		
	queue: {			//Array of scripts/faults by fn name -- 1st item is last time updated
		counts: {scripts:0, faults:0},
		faults: {},
		scripts: {}
	},
	callData: {},		//=undefined for each function unless captured in-process
						//Object callData depth
						//during capture: Array with element for 1st and every recursive fn call
						//at end of capture, set to back undefined or false if mode="once
	defaultValues: {},
	saveKeys: EZ.toArray('ready modeList', ' '),
	map: {
		functions: {},
		objects: {},
		names: {}
	}
}
/*--------------------------------------------------------------------------------------------------
EZ.capture()	

Must be called after EZ.capture.check(this) when non-blank mode returned.

Encapsulates call to caller function in try/catch to capture return values or uncaught exceptions.
	
Expects caller function context "this" and arguments were saved by prior EZ.capture.check(this)

Next call to EZ.capture(this) always returns false so EZ.capture() not called again..
However if the function calls itself (recursive call), the next resulting call to EZ.capture(this)
will note the recursive call and return false so EZ.capture() not subsequently called.

If uncaught exceptions occures, its thrown after exception saved as-if no capture took place.

EXAMPLE:
	if (EZ.capture(this) {return EZ.capture()} else if (EZ.debug()) debugger;
	
TODO: 
	capture unique recursive call arguments 
	optimize isUnique 
--------------------------------------------------------------------------------------------------*/
EZ.capture = function EZcapture()
{
	var caller = arguments.callee.caller;
	var callerName = EZ.capture.getFunctionName(caller);
	var callData = EZ.capture.get('callData', callerName);
	
	    //----------------------------------------------------------\\
	   //                                               ============ \\
	  // DO the capture if no arguments -- e.g if (...) EZ.capture()  \\
	 //                                                 ============   \\
	//------------------------------------------------------------------\\
	if (!callData)							//if 1st time, otherwise throw error
		EZ.capture.error('EZcapture_noCallerArgs');	
	
	var rtnValue, exception = null;	
	try
	{
		var args = callData ? callData.args : caller.arguments;
		var ctx = callData ? callData.ctx : window;
		//====================================================================
		rtnValue = caller.apply(ctx, args);	
		//====================================================================
	}
	catch (e)								//uncaught exception in caller
	{										//capture then re-throw exception
		exception = e;	//EZ.error(e); 
		EZ.techSupport(e, callData);
		EZ.capture.updateCount('exception');
	}
	if (callData)  		
		saveScript(callData);
		
	var capture = EZ.capture.get();
	var activeName = capture.activeList.pop();
	if (activeName != callerName)
		EZ.capture.error('EZcaptureActiveList', callData);
	
	delete capture.callData[callerName];
	
	if (exception)
		throw exception;
	//==============
	return rtnValue;
	//==============

	//________________________________________________________________________________________
	/**
	 *	update values Object with any changed arg values
	 *	save arg clone if possible otherwise save arg with new valueMap
	 */
	 function saveScript()
	 {
		if (!callData) return;
		
		if ((!callData.fault && callData.mode != 'faults')
		|| (EZ.save === true || (EZ.save || '').includes(callerName)))
		{												//save results and changed ctx or args
			var valueMap = EZ.valueMap('');
			valueMap.objList = callData.argsObjList;
			callData.actual.results = EZ.clone(rtnValue, valueMap);
			callData.actual.actualValueMap = getArgsValue(callData.args, callData.argsValueMap, callData.actual);								

			var queue = EZ.capture.get('scripts', callData.name)
			queue.push(callData);						//save callerArgs and returned results
			capture.queue.counts.scripts++;

			EZ.capture.updateCount(callData.mode);
			
			if (callData.mode == 'once')				//disable capture for fn if only doing once
			{											//change drop down if avail
				if (!EZ.capture.display('modeChange', callerName, 'faults*'))
					capture.mode[callerName] = 'faults';	
			}
			EZ.save = '';
		}
		/**
		 *	update values Object with any changed arg values
		 *	save arg clone if possible otherwise save arg with new valueMap
		 */
		function getArgsValue(args, priorValueMap, values)
		{
			var valueMap = {};	
			Object.keys(args).forEach(function(idx)
			{													
				if (args[idx] instanceof Object)		//save any changed arguments				
				{												
					idx = isNaN(idx) ? idx : parseInt(idx);
					if (EZ.valueMap(args[idx], priorValueMap[idx]))
					{
						values[idx] = EZ.clone(args[idx], true);
						if (EZ.clone.fault)				//if unable to clone save arg with valueMap
						{								//can then determine if arg changed after saved
							values[idx] = args[idx];
							valueMap[idx] = EZ.valueMap(args[idx])
						}
					}
				}
			});
	///		if (!Object.keys(valueMap).length) valueMap = null;
			return valueMap;
		}
	 }
}
/*--------------------------------------------------------------------------------------------------
EZ.capture.check([mode,] this [,options])		

	Determine if function call is captured to create Test Script for unique argument values 
	-OR- uncaught exceptions.
	
	Safe gaurds in-place to limit captures (EZ.capture.options.limits: {}) and avoid infinate loops.

ARGUMENTS:
	ctx			=this if only argument -or
	ctx,error
	
	mode, [options]
	mode	
	this	to begin data capture

RETURNS: (String) capture mode: 
	="faults" 	if capturing uncaught exceptions
	="scripts" 	if arguments are unique and capturing return values
	="both"		if capturing uncaught exceptions and return values
	=""			if not creating any test scripts

EXAMPLE:
	if (EZ.capture(this) {return EZ.capture()} else if (EZ.debug()) debugger;
	
TODO: 
	capture unique recursive call arguments 
	optimize isUnique 
--------------------------------------------------------------------------------------------------*/
EZ.capture.check = function EZcapture_check(mode, ctx, options)
{
	var capture = EZ.capture.get();
	if (arguments.length && !capture.ready) 	//bail if capture not initialized
		return false;							
	
	if (arguments.length < 3 					
	&& (mode instanceof Object || EZ.getPrototype(mode)))
	{											//if mode is Object or recognized prototype
		options = ctx;							//assume its omitted
		ctx = mode;
		mode = '';
	}

	var caller = arguments.callee.caller;
	var callerName = EZ.capture.getFunctionName(caller);
	
	
	var callData = EZ.capture.get('callData', callerName);
	var callDepth = EZ.getCallDepth(caller);
	
	var counter = '';							//count incremented
	mode = mode || '';							//derived from specified or default fn mode
	do											
	{
		if (callData)							
		{
			if (callData.depth === undefined)
			{									//capture started -- set depth
				callData.depth = 0;				//capture.callData[callerName].length - 1
				EZ.capture.updateCount('capture');
				return false;
			}
			else if (callDepth > 0)
			{
				if (tooMany('recursive'))		//TODO: limits:recursive=0
				{
					callData.depth++;				
					break;
				}
			}
			else								//if not recuesive, callData should not exist
			{									//don't know how to verify
				if (tooMany('incomplete'))
				{
					EZ.capture.error('EZcapture_unexpected_callData', callData);
					 break;			//total limit exceeded
				}
				delete capture.callData[callerName];
			}
		}
		
		  //-----------------------------------------------------------\\
		 //----- top level call: EZcapture(ctx [,mode] [,options]) -----\\
		//---------------------------------------------------------------\\
		try
		{										
			if (mode === 'false')				//explicitly excluded
				break;

			if (!callerName) 					//never capture anonymous
			{
				counter = 'anonymous';
				break;
			}

			if (tooMany('capture.check'))		//total limit exceeded
				break;

			if (!mode)							//get default for callerName
			{									//uses dropdown mode if exists
				 var el = (capture.modeRow) ? EZ(callerName, capture.modeRow): null;
				 mode = (el && !el.undefined) ? EZ.get(el)
				 							  : EZ.capture.get('mode', callerName);
				 if (mode == 'EZcaptureFault')
				 {
					 counter = 'EZcaptureFault';
					 break;
				 }
				 if (mode != 'testfn'
				 && EZ.test.running && EZ.test.running.includes(callerName))
				 {
					EZ.capture.updateCount('test function');
					mode = 'faults';			//only capture faults for test fn
				 }
			}
			counter = mode + '';
			if (!mode)
				break
			
	if (!capture.limits.nested || capture.activeList.length >= capture.limits.nested)
	{
		counter = 'nested'
		break;
	}
			
			if (mode != 'faults' && tooMany('scripts') && !tooMany('faults'))
				mode = 'faults'
			
			if (tooMany())						//too many whatever e.g once or red
				break;
			
			mode = (mode == 'faults') ? 'faults' : 'scripts';
			if (tooMany(mode))					//too many final mode 
				break;
			
			var queue = EZ.capture.get(mode, callerName);
			if (tooSoon(mode))
				break;
				
			var callerArgs = caller.arguments;				//save caller initial argument values and options
			
			//-----------------------------------------------------------------
			var callData = new EZcallData(callerName, callerArgs, ctx, options);				
			//-----------------------------------------------------------------
			
			if (mode != 'faults')							//if not faults, arguments must be unique
			{
				if (EZ.capture.isDup(mode, queue))
				{
					mode = '';
					counter = 'dup args';
					EZ.capture.updateCount(counter);
					
					if (tooMany('faults'))	
						break;
					else if (tooSoon('faults'))
					{
						EZ.capture.updateCount('delay');
						break;
					}
					else mode = 'faults';
				}
			}
			callData.mode = mode;
			capture.activeList.push(callerName);
			capture.callData[callerName] = callData;
			
			queue[0] = new Date();				//update MRU time
		}
		catch (e) 
		{
			if (!tooMany('EZcaptureFault'))
				EZ.techSupport(e, 'EZcaptureFault')
			mode = '';
			counter = 'EZcaptureFault';
		}
	}
	while (false)
	EZ.capture.updateCount('capture.check');	
	if (!mode)									//saved counts updated when saved
		EZ.capture.updateCount(counter);
	//======================
	return mode;							
	//======================
	/**
	 *	
	 */
	function tooMany(c)
	{
		c = c || counter;
		var count = capture.counts[c] || 0;
		var limit = capture.limits[c] || 0;
		var isOk = (count === 0 || limit === 0 || count < limit);
		if (isOk)
			return false;
		counter = c;
		return true;
	}
	/**
	 *	not enough elasped time since last capture
	 */
	function tooSoon(mode)
	{
		var delay = capture.delay[mode] || 0;
		if (!delay) return false;
		
		var queue = EZ.capture.get(mode);
		if (!queue || !queue[0]) return false;
		
		var elapsed = new Date().getTime() - queue[0].getTime();
		if (delay > elapsed) return false;
			
		counter = 'delay'
		return true;
	}
	/**
	 *	Create callData Object potentially added to capture queue
	 *	save caller initial argument values and options
		///	this.args[idx] = args[isNaN(idx) ? idx : parseInt(idx)];
	 */
	function EZcallData(callerName, callerArgs, ctx, options)						
	{												//top level clone -- arguments never ObjectLike
		this.name = callerName, 
		this.args = [].slice.call(callerArgs);
		if (EZ.getPrototype(ctx))
			this.args.ctx = ctx;					//saved as named Array property
		
		this.argsClone = {};
		this.argsValueMap = {};
		this.argsObjList = [];
		this.actual = {};
		var callData = this;
		Object.keys(callData.args).forEach(function(idx)
		{											//save deep clone of each arg if possible
			var argClone = EZ.clone(callData.args[idx], true);		
			if (!EZ.clone.fault) 
				callData.argsClone[idx] = argClone;
				
			var valueMap = callData.argsValueMap[idx] = EZ.valueMap(callData.args[idx]);
			callData.argsObjList = callData.argsObjList.concat(valueMap.objList);
		});
		if (typeof(options) == 'object')			//add caller options if any
		{
			callData.options = {};
			for (var key in options)
				callData.options[key] = options[key] 
		}
		return callData;
	}
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
/**
 *	
 */
EZ.capture.isDup = function EZcapture_isDup(callerArgs, queue)						
{				
if (true) return true;	
	var isUnique = queue.every(function(callData,idx)	//if not unique arguments
	{ 
		return idx === 0 || EZ.equals(callData.args, callerArgs) 
	});
	return !isUnique;
}
/**
 *	
 */
EZ.capture.updateCount = function EZcapture_updateCount(counter)						
{				
if (true) return true;	
	var capture = EZ.capture.get();
	capture.counts[counter] = capture.counts[counter] || 0;
	capture.counts[counter]++;
}
/*--------------------------------------------------------------------------------------------------
 *	called from techSupport(e [,ctx] [,options] )
 *	EZ.json.fault = EZ.techSupport(e, phase, options, this) 
--------------------------------------------------------------------------------------------------*/
EZ.capture.techSupport = function EZcapture_techSupport(fault)
{
	if (EZ.getConstructorName(fault) != 'EZfault') return;
	
	var callerName = fault.name;
	do
	{	
		var callData = EZ.capture.get('callData', callerName)
		if (callData && callData.depth === 0)					//if not recursived call, update args
		{														//get callData from fnState
//			if (callData.ctx)
//			fault.ctx = callData.ctx;
//			fault.args = callData.args;		
			fault.argsClone = callData.argsClone;
			fault.argsValueMap = callData.argsValueMap;
			callData.fault = fault;
		}
		var queue = EZ.capture.get('faults', callerName);
	
		if (EZ.capture.isDup(fault.args, queue))				//check for dup using current value of
			EZ.capture.updateCount('dup fault');				//args and options 
		else	
			queue.push(fault);		
		
		EZ.capture.get().queue.counts.faults++;
	}
	while (false)
	return fault;
}
/*---------------------------------------------------------------------------------------------
EZ.capture.get(key, callerName)

ARGUMENTS:
	key		(String) specifies one or more options keys

RETURNS:
	if no key returns EZ.capture.options 
	if key is "faults" or "scripts", returns queue for callerName
	otherwise returns specified key, qualified by callerName if supplied
	
NOTE: 
	***DO NOt CALL*** any function with EZ.capture() call
	no external functions called as of 06-06-2016
---------------------------------------------------------------------------------------------*/
EZ.capture.get = function EZcapture_get(key, callerName, callerArgs)
{
	var capture = getCapture();
	if (!key) 										//return capture Object if no key
		return capture;
	
	if (/(faults|scripts)/.test(key))				//return faults or scripts queue
		return getQueue(key, callerName, callerArgs);
	
	//var defaultValue = capture.defaultValues[key] || '';
	var value = capture[key];
	
	if (key == 'callData')							//return faults or scripts queue
		return getCallData(callerName);
	
	if (value instanceof Object && '' in value)			//if key has optional callerName values
		return value[callerName || ''] || value[''];	//e.g. capture.mode: {...}
	
	if (callerName)
	{
		if (value === undefined)
			return value;
		if (callerName in value)
			value = value[callerName];
	}
	//if (value === undefined)
	//	value = defaultValue;
	//======================
	return value;
	//======================
	
	//________________________________________________________________________________________
	/**
	 *	get or create EZ.capture.options
	 */
	function getCapture()
	{												
		var capture = EZ.capture.options;
		if (!capture)
		{
			capture = EZ.capture.options = EZ.clone(EZ.defaultOptions.capture, true);
			capture.regex = EZ.defaultOptions.capture.regex;

			
			Object.keys(capture.mode).forEach(function(key)	//replicate friendy names --> unfriendly varients
			{												//e.g. for String.ov create ovEZprototypeString
				key.replace(/(Array|Boolean|Number|Object|String)\.(prototype\.)(.*)/, function(all, type, proto, fn)
				{
					var ugly = fn + 'EZprototype' + type;
					var value = capture.mode[all];
					if (value)
						capture.mode[ugly] = value;
				});
			});
		}
		capture.limits.recursive = 0; 		//TODO: not yet suppported
		
		return capture;
	}
	//________________________________________________________________________________________
	/**
	 *	
	 */
	function getQueue(key, callerName)
	{
		var queue = capture.queue[key];
		if (!callerName)
			return queue;
													//get or create callerName queue
		queue = queue[callerName] = (queue[callerName] || []);	
		return queue;
	}
	//________________________________________________________________________________________
	/**
	 *	
	 */
	function getCallData(callerName)
	{
		if (value === undefined)
			return value;
		
		return value[callerName];
	}
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.capture.getFunctionName = function EZcapture_getFunctionName(caller)
{
	var capture = EZ.capture.get();
	
	var name = '', rtnObj = {};
	if (EZ.test.running.includes('EZfunction_getName') || !'EZ.functions.getName'.ov())
	{												
		name = caller ? caller.name || caller.displayName || '' : '';
		if (!name)
			name = findFunctionName(caller);		//TODO: ??
		return name;
	}
	name = EZ.function.getName(capture.regex.fnName, rtnObj);
	if (name && capture.fnData) 
	{
		capture.fnData[name] = {
			url: 	rtnObj.url,
			lineno: rtnObj.lineno,
			column: rtnObj.column
		}
		capture.fnNames[caller] = name;
	}
	
	//throw EZ.capture.error('fn_name_unknown')
	return name;
	//________________________________________________________________________________________
	/**
	 *	find function name by recursively looking for macth to an Object in the caller context.
	 */
	function findFunctionName(fn)
	{
		if (!name)
		{
			var stack = new Error().stack;
			/*
			Error
				at findFunctionName (http://localhost:8080/revize/dw.Configuration/Shared/EZ/js/EZcapture.js:643:16)
				at Function.EZcapture_getFunctionName [as getFunctionName] (http://localhost:8080/revize/dw.Configuration/Shared/EZ/js/EZcapture.js:624:10)
				at Function.EZcapture_check [as check] (http://localhost:8080/revize/dw.Configuration/Shared/EZ/js/EZcapture.js:241:30)
				at EZsample.myfn (http://localhost:8080/revize/dw.Configuration/Shared/EZ/html/EZtest_assistant_tests.js:245:18)
				at EZsample (http://localhost:8080/revize/dw.Configuration/Shared/EZ/html/EZtest_assistant_tests.js:253:3)
				at Function.EZtest_run [as run] (http://localhost:8080/revize/dw.Configuration/Shared/EZ/html/EZtest_assistant_run.js:522:37)
				at Function.EZ.sample.test [as testScript] (http://localhost:8080/revize/dw.Configuration/Shared/EZ/html/EZtest_assistant_tests.js:264:10)
				at http://localhost:8080/revize/dw.Configuration/Shared/EZ/html/EZtest_assistant_run.js:65:11"
			*/			
			var results = stack.match(capture.regex.fnName);
			do
			{										
				if (!results)						//safety for unexpected
				{
					//throw EZ.capture.error('fn_name_unknown')
					break;
				}
				name = results[3];
				capture.fnNames[fn] = name;
													
				if (!results[4]) break;
				results = results[4].match(capture.regex.fnData);
				if (!results || results.length < 2) break;
			
				var lineCol = results[2].split(':');	//save url, lineno and col
				capture.fnData[name] = {
					url: results[1],
					lineno: lineCol[0],
					col: lineCol[1]
				}
			}
			while (false)
		}
		return name;
	}
}
/*--------------------------------------------------------------------------------------------------
 *	log error if 1st time otherwise throw
--------------------------------------------------------------------------------------------------*/
EZ.capture.error = function EZcapture_error(name, callData)
{
	var caller = arguments.callee.caller;
	var callerName = EZ.capture.getFunctionName(caller);
	var capture = EZ.capture.get();
	
	var fubar = capture.callerFubar = (capture.callerFubar || []);
	var error = fubar[callerName];
	if (error)
		throw error;
	
	var messages = {
		EZcapture_noCallerArgs: 'EZ.capture(no arguments): must follow EZ.capture(this)',
		EZcapture_unexpected_callData: 'EZ.capture(this): unused data from prior call deleted',
	}
	var msg = messages[name+''] || ''	
	error = fubar[callerName] = EZ.error(msg, '', caller);
	if (callData)
		error.callData = callData;
	
	console.log({message:error.message, stack:error.stack.split('\n'), EZcaptureError:error});
	if (!EZ.capture.display('modeChange', name, 'EZcaptureFault'))
		capture.mode[name] = 'EZcaptureFault';
		
	return error;
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.capture.display = function EZcapture_display(action, callerName, value)
{
	var capture = EZ.capture.get();
	if (!EZ.get('autoCapture'))
		return
	
	var el; //= action;	// || window.event;
	if (el instanceof Event)
	{
		var evt = el;
		el = evt.srcElement || {className:'', tagName:''};
		if (/(select)/i.test(el.tagName) && evt.type == 'click')
			return true;								//ignore click on select tag
	}
	action = !capture.modeRow		? 'setup'
		   : (!el)					? (action || '')
		   : el.tagName == 'SELECT' ? 'modeOnChange'
		   : (el.className.match(/\b(capture\w*)\b/) || [])[1] || '';
	
	switch (action)
	{
		case 'setup': 									//setup
		{
		//	EZ.show('captureOptions');					//show after setup as dev convenience
	
			var options = EZ.store.get('capture.options', {});
			capture = EZ.capture.options = EZ.mergeAll(EZ.defaultOptions.capture, options);
			capture.regex = EZ.defaultOptions.capture.regex;
			
			el = EZ('captureModeRow');
			capture.modeRow = el.cloneNode(true);
			el.parentElement.removeChild(el);
			
			displayFunctionList(capture.mode);
			break;
		}
		case 'modeChange':								//mode change 	
		{												
			var list = (capture.modeRow) ? EZ(callerName, capture.modeRow): null;
			if (!list)	
				return false;
			else
			{
				EZ.set(list, value);					//update dropdown selection
				if (list.selectedIndex == -1)			//if unknown value, add new select option
				{
					var opt = list.options.length;
					list.options[opt] = new Option(value + '*');
					list.options[opt].value = value;
					list.options[opt].selected = true;
				}
			}
			return true;
		}
		case 'modeOnChange':							//mode drop down onchange 	
		{
			capture.mode[el.className] = EZ.get(el);
			return 
		}
		case 'save': 									//save capture options
		{
			var onlyKeys = EZ.capture.get('saveKeys');			
			var options = EZ.clone(EZ.capture.options, onlyKeys);	
			EZ.store.set('capture.options', options);
			return;
		}
		case 'resetCounts': 							//reset counts
		{
			capture.counts = {};
			if (capture.modeRow)						//reset mode drop down
			{											
				EZ.toArray(capture.modeRow.children).forEach(function(tr)
				{
					var list = EZ.get( EZ('<select>'), tr);
					var mode = EZ.capture.get('mode', list.className)
					if (EZ.get(list) != mode)
						EZ.set(list, mode);
				})
			}
			break;
		}
		case 'captureFunctionList':						//update specific function list: 	
		{
			var modeList = updateFunctionList();
			displayFunctionList(modeList)
			break;
		}
	}	
		
	EZ.set('captureTime', EZ.formatTime());				//update capture display
	
	var html = '';
	Object.keys(capture.counts).forEach(function(key)
	{
		if (!capture.counts[key]) return;
		var limit = capture.limits[key] || 'na';		//show blank if limit zero
		html += '<tr>'
			  + '<td>' + key + '</td>'
			  + '<td>' + capture.counts[key] + '</td>'
			  + '<td>' + limit + '</td>'
			  + '</tr>';
	});
	EZ.set('captureCounts', html);
	
	
	EZ.set('captureModeDefault', capture.mode['']);		//update default mode 
	
	EZ.set('captureScriptsCount', capture.queue.counts.scripts);
	EZ.set('captureFaultsCount', capture.queue.counts.faults);
	//________________________________________________________________________________________
	/**
	 *	
	 */
	function displayFunctionList(modeList)	
	{	
		var tbody = EZ('captureModeList');					//clear current list
		EZ.removeNodes(tbody.children);
		
		Object.keys(modeList).forEach(function(fnName)
		{
			if (!fnName) return;								//blank key is default
			var mode = capture.mode[fnName] = modeList[fnName];		
			
			//var fn = fnName.ov({name:fnName}).name
			
			var row = capture.modeRow.cloneNode(true);
			EZ.append(tbody, row);			
			EZ.set(EZ('<td>', row), fnName);					//opps fnName name e.g. "EZ.capture.get"

			var list = EZ('select', row);
			list.className = fnName;						//non-opps name e.g. "EZcapture_get"
			list.EZ.set(mode);
			list.onchange = function() { EZ.capture.display(this) };
		});
		return;
	}
	//________________________________________________________________________________________
	/**
	 *	
	 */
	function updateFunctionList()	
	{
		var modeList = {};
		var time = new Date().getTime();
		var pattern = /[\s\S]EZ\.capture\.check\s*\(\s*(.*?)(?=[,)])/;
		var quoted = /^(["'])(.*?)\1$/;
		var blank = /^(["'])\1$/;
		var validModes = EZ.toArray('true false once calls faults testfn', ' ');
		
		EZ.toArray(document.scripts).forEach(function(js)
		{
if (!js.src.includes('stringify')) return;
			
			var script = (!js.src) ? js.innerHTML
					   : DWfile.read(js.src);
			if (!script) return;

			var fnList = EZ.getFunctionList(script);
			if (!fnList.length) return;

			var lines = script.split('\n');
			fnList.forEach(function(fn)
			{
				var code = lines.slice(fn.lineno, fn.linenoEnd);
				code = code.join('\n');
				if (/EZ.capture.check/.test(code))
				{
					code.replace(pattern, function(all, arg)
					{
						var mode = (!arg || arg == 'this') ? ''
								 : /(true|false)/.test(arg) ? arg
								 : blank.test(arg) ? ''
								 : quoted.test(arg) ? arg.match(quoted)[1]
								 : '';
						if (!validModes.includes(mode))
							mode = '';
						
						modeList[fn.name] = mode;
						EZ.capture_displayName(fn.name);
					});
				}
			});
		});
		var elasped = new Date().getTime() - time;
		var msg = { 'updateFunctionList()': elasped/1000 + ' seconds', modeList:modeList };
		console.log(msg);
		return modeList;
	}
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
e = function _____LEGACY_FUNCTIONS_____() {}	//convenience for DW functions list

/*--------------------------------------------------------------------------------------------------
EZ.test.data.save(callerName)

Create and save unit test from arguments and return values captured during live function calls.
--------------------------------------------------------------------------------------------------*/
e = function EZtestDataSave(callerName)
{
	var allTestScripts = [];
	//var objects = [];
	//var tags = [];
	var separator = '//' + '_'.dup(90);

	var functions = ('EZ.test.data.functions').ov();
	if (!functions)
		return EZdisplayMessage('No testdata found');

	for (callerName in functions)
	{
		//var count = 0;
		var vars = [];
		var args = [];
		var testScript = 'var ex = [];\n';

		var runs = functions[callerName].runs;
		runs.forEach(function(run)
		{
			var rtnValues = run.rtnValues;
			//rtnValues.sort(rtnValuesSort);

			// set expected value(s)
			var exCode = '';
			var exScript = '';
			vars = [];
			if (rtnValues.length > 1)
				exScript += 'ex=[];\n';
			rtnValues.forEach(function(rtnValue,idx)
			{
				exCode = formatVar(rtnValue.value);
				if (rtnValues.length == 1)
				{
					if (!vars.length) return;
					exCode = 'ex';
					exScript += 'ex' + vars[0] + ';\n';
				}
				else	//multiple return values for arguments
				{
					exCode = 'ex[' + idx + ']';
					exScript += exCode + ' = ' + vars[0] + ';\n';
				}
			});
			if (rtnValues.length > 1)
				exCode = 'ex, count:' + rtnValues.length;

			// set arg values
			vars = [];
			args = [];
			run.args.forEach(function(arg, i)
			{
				args.push(formatVar(arg, i));
			});
			var argsScript = !vars.length ? ''			//if long arg values
						   : vars.join('\n') + '\n';		//arg0 = ...										//arg1 = ...
			var argsCode = !args.length ? ''			//if any args
						 : args.join(', ') + ', ';			//arg0, arg1, ...
			var preScript = exScript + argsScript;

			var runScript = 'EZ.test.run({0:25}  {EZ: {ex:{1:15} }});';
			testScript += '\n'
						//+ (++count % 10 ? '#' + count + '\n' : '')
						+ (!preScript ? '' : '\n' + preScript)
						+ runScript.format([argsCode, exCode]);
		});
		testScript = testScript.replace(/^/gm, '\t');
		//console.log('_'.dup(80));
		//console.log(testScript) || '_'.dup(80);

		var funcScript = callerName + '.test = function()'
				//   + callerName.replace(/\./g, '') + '()'

		var script = [separator, funcScript, '{', testScript, '}'];
		allTestScripts.push(script.join('\n'));
	}
	allTestScripts.push(separator);
	var timestamp = EZtimestamp().replace(/:/g, '_').replace(/ /g, '.');

	var folder = EZ.constant.configPath + 'Shared/EZ/testdata/';
	var fileURL = folder + 'testdata.' + timestamp + '.js';

	var status = DWfile.write(fileURL, allTestScripts.join('\n'));
	var msg = (status ? 'Saved: ' : 'Unable to save: ')
			+ EZstripConfigPath(fileURL);
	EZdisplayMessage(msg);

	//================================
	return;
	//================================

	//______________________________________________________________________________
	/**
	 *	TODO: probably superceeded by: EZtest_assistant_run.js::formatArgumentValues()
	 */
	function formatVar(arg, idx)
	{
		var type = arg === null ? 'null'
				 : arg == EZ.undefined ? 'undefined'
				 : EZ.isArray(arg) ? 'array'
				 : typeof arg;

		switch(type)
		{
			case 'null':
			case 'undefined':	return type;
			case 'boolean':
			case 'number':		return arg + ''

			case 'array':
			{
				arg = arg+'';
				arg = "'" + arg + "'";
				break;
			}
			case 'string':
			{
				arg = "'" + arg + "'";
				break;
			}
			case 'function':

			case 'object':
			{
				arg = 'obj'
				break;
			}
			default:
			{
				arg = 'tbd'
			}
		}
		if (arg.length < 20)			//use as arg if not too big
			return arg;
										//otherwise use variable
		var varName = idx != EZ.undefined
					? 'arg' + idx 		//for argument
					: '';				//for expected value
		vars.push(varName + ' = ' + arg);
		return varName;
	}
}
//_________________________________________________________________________________________________
e = function _____CREATE_TEST_SCRIPT_____() {}	//convenience for DW functions list
//_________________________________________________________________________________________________

/*--------------------------------------------------------------------------------------------
EZ.test.createTestScript(fromObj, el)

Create script from testrun or EZ.capture.stack -- save 

ARGUMENTS:
	fromObj		testrun Object if specified
	
	to			html element or filename -- 
				default if testdata/.../[function name]/scripts/[function name]
	
	options		(optional) Object containing one or more of the following properties:
				??		??
RETURNS:	
	(String) containing test script of the following form:

	//______________________________________________________________________________________')
	EZ.test.skip(1)		//skip next 1 tests for: ...[[function name]...
	
	note = 'created @ ...[date/time]...<hr><pre>'
		 +  '...stacktrace...</pre>'
	
	ctx = ".EZ"			... if prototype function
	args = []			... if multiple args
	args[1] = 'abc'		... 1-based -- args[0] not used
	args[2] = 'xyz'		-OR-	arg = 'single str'  -OR-  true, 66. [...]
	EZ.test.options( {ex:null, note:note} )
	EZ.test.run( ctx, args[1], args[2] )
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	note = "created @ 05-30-2016 03:49:53pm"
	ctx = ".EZ"
	args = []
	args[1] = null
	args[2] = "supplied object variable is null"
	
	ex = []
	ex.results = "supplied object variable is null"
	ex.ctx = null
	ex[2] = {}
	
	EZ.test.options( {ex:ex.results, ctx:ex.ctx, args:ex, note:note} )
	EZ.test.run( ctx, args[1], args[2] )
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	

--------------------------------------------------------------------------------------------*/
EZ.test.createTestScript = function EZtest_createTestScript(fromObj, options)
{
	var el = EZ.isEl(options) ? options : undefined;
	var defaultOptions = {
		callArgs: true,
		note: true,
		comments: true
	}
	//options = EZ.mergeAll(defaultOptions, options);
	options = EZ.options.call(defaultOptions, options);

	var lines = [];
	var heading = 'EZ.test.skip({0})\t\t//skip next {0} tests for: {1}';

	if (fromObj == EZ.faults)
	{
		var faults = EZ.faults || {};
		Object.keys(faults).forEach(function(fn)
		{
			if (typeof(fn) != 'object') return;		//skip counters
			
			if (options.comments)
			{
				lines.push( '//______________________________________________________________________________________')
				lines.push( heading.format(faults[fn].length, fn) );
			}
			faults[fn].forEach(function(fault)
			{
				var testrun = {
					args: [fault.ctx].concat(fault.args),
					ctxRequired: Boolean(fault.ctx),
					stacktrace: fault.stacktrace
				}
				//stacktrace: error.stack.formatStack(),
				
				createScript(testrun);
			});
			if (options.comments)
			{
				lines.push( '// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .' );
				lines.push( '' );
			}
		});
	}
	else if (EZ.is(fromObj, EZ.test.testrun))
	{
		if (options.comments)
			lines.push( '// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .' );
		try
		{
			createScript(fromObj);
		}
		catch (e)
		{
			 EZ.techSupport(e);
		}
		if (options.comments)
		{
			lines.push( '// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .' );
			lines.push( '' );
		}
	}
	else
	{
		lines.push( '***** unrecognized testdata *****' );
	}
	var text = (lines.length === 0) ? ''
			 : (lines.length == 1) ? lines[0].trim()
			 : '\t' + lines.join('\n\t') + '\n';
	
	if (el)
	{
		var el = EZ(el);		//display if el specified
		EZ.set(el, text);
		el.select();
	}
	//=============
	return text;
	//==============

	//______________________________________________________________________________
	/**
	 *	
		if (testrun.note)
			notes.push('"' + testrun.note.split('\n').join('\\n"') + '\n');
		
		if (testrun.stacktrace)
		{
			var html = '"<hr><pre>"\n'
					  + '\t\t + "'
					  + testrun.stacktrace.join('\\n"\n\t\t + "')
					  + '</pre>"';
			notes = lines.concat(html);
		}
	 */
	function createScript(testrun, expected)
	{
		var argsDim = 'args = []'
		if (options.comments)
		{
			var notes = ['note = "created @ ' + EZ.formatDate() + '"'];
			lines.push( '' );
			lines = lines.concat(notes);
		}
		var callArgs = [];
		var testOptions = [];
		
		if (options.callArgs)						//create script for call arguments
		{
			testrun.args_idx.remove('results').forEach(function(idx)
			{										//var name or args[idx]
				var argName = testrun.callArgNameScript[idx];
				var argValue = testrun.callArgValues[idx];
				var json = jsonValue(argValue);

				callArgs.push(argName);
				lines.push( argName + ' = ' + json );
			});
		}
		cleanup = cleanup;
		//cleanup();
		
		lines = lines.concat( createScriptExpected() );
		if (options.note)
			testOptions.push('note:note');
			
		if (options.callArgs)
		{
			if (testOptions.length)
				lines.push( 'EZ.test.options( {' + testOptions.join(', ') + '} )' );
		
			lines.push( 'EZ.test.run( '  + callArgs.join(', ') + ' )' );
		}
		if (options.comments)
			lines.push( '' );
		//=============
		return;
		//=============
		/**
		 *
		 */
		function createScriptExpected()
		{
			var lines = [];
			testrun.args_idx.forEach(function(idx)				
			{												//for each call arg . . .
				if (options.args_idx)
				{
					var argOpt = isNaN(idx) ? idx : 'args'
					if (!options.args_idx.includes(argOpt))					
					//if (options.args_idx[argOpt] === undefined)					
						return;								//skip if args_idx option but idx not included

					if ('.used'.ov(options,[]).includes(argOpt) 
					&& '.allOk.notused'.ov(testrun, [idx]).includes(idx))
						return;								//skip if only inc arg if used for Ok but its NOT
					if (!isNaN(idx) && options.argsChanged && !options.argsChanged[idx])
						return;
				}
				else if (!testrun.argsChanged[idx]) 		//if args_idx NOT supplied...
					return;									//...skip if value not changed
				
				var exIdx = isNaN(idx) ? 'ex.' + idx : 'ex[' + idx + ']';
				
				var value = (expected) ? expected[idx] : '.actual.'.concat(idx).ov(testrun);
				if (value != EZ.test.notSpecified)
					lines.push(exIdx + ' = ' + jsonValue(value));
			});
			if (lines.length)
			{
				if (lines.length == 1 && lines[0].includes('ex.results'))
					lines[0] = lines[0].replace(/ex.results/, 'ex');
				else
					lines.unshift('ex = []');
				testOptions.push('ex:ex');
			}
			return lines;
		}
		/**
		 *
		 */
		function jsonValue(value)
		{
			var json = value + '';
			if (value == null)
				return json;
			if (value instanceof Date || value instanceof RegExp || typeof(value) != 'object')
				json = EZ.format.value(value, 999)
			else
				json = EZ.stringify(value, '*');
			
			return json.replace(/\n/g, '\n\t');
		}
		/**
		 *	add/delete var statements used for callArgs
		 *	if only "args[0] = ..." 	change to "arg = ..."
		 *	if no "args[...] = ..." 	remove: "args = []"
		 */
		function cleanup()
		{
			var str = lines.join('\n');
			var argsCount = (str.match(/args\[/g) || []).length;
			if (argsCount === 0 || !str.match(/args\[[123456789]/))
			{
				str = str.replace(/args\[0/, 'arg');
				lines = str.split('\n');
				lines.splice( lines.indexOf(argsDim) ,1);
			}
		}
	}
}

/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
e = function _____EZ_SUPPLEMENTAL_FUNCTIONS_____() {}	//convenience for DW functions list


/*---------------------------------------------------------------------------------------------
Create valueMap representing the current value of the specified variable or object.  

if callled as constructor, returns valueMap.
otherwise return true if new valueMap for value matches lastMap or false if not

The valueMap consists of an Array of Objects for specified value and all nested Objects. Each
array item, contains all owner keys and values for each Object or value for non-Object values.

if priorMap is specified, it is compared as each Object keys and values are added to new map
and returns false as soon as new map deviates from the prior or true if there is no difference.

The specified value itself is NOT compared, simply all its properties. The difference from
EZ.equals() is that all nested Objects must be same Object as the prior map not just identical
keys and values.

Used by EZ Test Assistant to determine if call to test fn changes any Object arguments.

TODO:
	HTML elements?? -- need list of keys to compare?? -- may work as-is
	Date and RegExp

	var isLegacy = false;
	var isEqual = !isLegacy ? processObject(value, '$')
				: processObjectLegacy(value, '');

	if (lastMap)
	{
		if (typeof(lastMap) == 'string')
		{
			varName = lastMap;
			lastMap = null;
		}
		else varName = lastMap.varName;
	}
	varName = map.varName = (varName || '$');
---------------------------------------------------------------------------------------------*/
EZ.valueMap = function EZvalueMap(value, lastMap)
{											//functions added to both objList[] and fnList[]
	var map = {
		keys:[], values:[], id:'', types:[], keysList:{}, 
		objList:[], fnList:[], elementList:[]
	};
	
	var varName = lastMap || '$';
	if (this instanceof arguments.callee) 	//called as constructor...
	{
		for (var key in map)
			this[key] = map[key];
		this.varName = varName;
		map = this;
		lastMap = null;
	}
	else 
	{										//call as constructor if no prior valueMap
		if (EZ.getConstructorName(lastMap) != 'EZvalueMap')
			return new arguments.callee(value, lastMap);
		varName = lastMap.varName;
	}
	
	  //-------------------------\\
	 //----- build value map -----\\
	//-----------------------------\\
	var isEqual = processObject(value, varName, '');
	if (!lastMap)
		return map;							//when not comparing, return map 
	
	if (lastMap.keys.length > map.keys.length)	
		isEqual = false;					//objects deleted
	
	//===============================
	return isEqual;
	//===============================
	/*
	 *	Quit if end of lastMap otherwise Save dotname in map.keys and obj in map.values
	 *	then recursively process each value property if Object and not already processed.
		//var keys = value instanceof Object ? Object.keys(value) : '';
	 */
	function processObject(value, dotName)
	{
		var idx, 
			keys = [], 
			idVal = value;
		
		if (value instanceof Object)			//for Object or function
		{
			if (!map.objList.includes(value))
				map.objList.push(value);
			
			if (typeof(value) == 'function'		//hach to get list of EZ functions
			&& (value.name && !value.name.startsWith('bound'))
			&& (varName == '$' || value.name.startsWith(varName))
			&& !map.fnList.includes(value))
				map.fnList.push(value);
			
			idx = map.values.indexOf(value);
			if (idx != -1)						//if value is repeated Object, 
			{									//use String pseudo value
				value = '{$repeat:' + idx + '}';
				idVal = '{' + map.keys[idx] + '}';
			}
			else
			{
				keys = Object.keys(value);
				idVal = '[' + keys.join(',') + ']';
			}			
		}

		if (lastMap)							//compare value to prior map value . . .
		{										//next new map index
			var idx = map.keys.length;
			if (lastMap.keys.length < idx 		//if new map bigger than prior
			|| lastMap.keys[idx] !== dotName)	//if diff dotName
				return false;					//quit comparing

			if (idx > 0							//or if not same value or exact object
			&& lastMap.values[idx] !== value
			&& !isNaN(lastMap.values[idx]) && !isNaN(value))
				return false;					//quit comparing		
		}
		
		map.id += ',' + dotName + ':' + idVal;	//append base id
		if (map.id.startsWith(','))
			map.id = map.id.substr(1);

		map.keys.push(dotName);					//add key and pseudo value
		map.types.push(EZ.getConstructorName(value));
		map.values.push(value);		
		map.keysList[dotName] = keys;
		var isEq = true;
		if (keys.length)
		{
			//var k = map.keysList[key] = [];
			//var v = map.shadowObj[key] = {};
			isEq = keys.every(function(key)	//for this Object and all nested Object keys 
			{									//or until new map does not mast lastMap				
				//k.push(key)
				//v[key] = value[key];
				
				var dot = isNaN(key) ? '.' + key : '[' + key + ']';
				var isEq = processObject(value[key], dotName + dot);
				return isEq;
			});
		}
		return isEq;
	}
}
/*---------------------------------------------------------------------------------------------
restore Object
obj may be same as as passed as argument however, keys could have been added or deleted 
-OR- values changed. The value map contains list of original keys and values.
---------------------------------------------------------------------------------------------*/
EZ.valueMap.reset = function EZvalueMap_reset(obj, valueMap)
{
	var log = valueMap.log = [];
	
	if (obj instanceof Object)
		resetArgValueProcess(obj, valueMap.varName);
	
	if (log.length)
		log.unshift('restored original values for: ' + valueMap.varName);	

	//console.log(log.format().join('\n'));
	
	//======================
	return obj;
	//======================
	
	//________________________________________________________________________________________
	/**
	 *	
	 */
	function resetArgValueProcess(obj, dotName)
	{
		Object.keys(obj).forEach(function(key)
		{
			var keyName = dotName + getDot(key);
			var finalValue = obj[key];
			var finalKeys = (finalValue instanceof Object) ? Object.keys(finalValue) : [];
			
			var value = getValue(dotName, key) || finalValue;
			
			if (value !== finalValue)					//value changed
			{
				obj[key] = value;
				log.push(keyName + '\t reset');
			}
			
			if (value instanceof Object)
			{								
				if (value == finalValue)
				{
					var keys = valueMap.keysList[keyName];
					finalKeys.remove(keys).forEach(function(k)
					{								//delete added keys
						delete value[k];
						log.push(keyName + getDot(k) + '\t deleted');
					});
					keys.remove(Object.keys(value)).forEach(function(k)
					{								//add any deleted keys
						value[k] = getValue(dotName, k);
						log.push(keyName + getDot(k) +  '\t addeded');
					});
				}
				resetArgValueProcess(value, keyName);
			}
		});
		/**
		 *	
		 */
		function getDot(key)
		{
			var dot = !key ? ''
					: isNaN(key) ? '.' + key 
					: '[' + key + ']';
			return dot;
		}
		/**
		 *	
		 */
		function getValue(dotName, key)
		{
			var idx = valueMap.keys.indexOf(dotName + getDot(key));
			if (idx == -1)
				return null;
			else							//array of values
				return valueMap.values[idx];
		}
	}
}
//___________________________________________________________________________________________
EZ.valueMap.test = function()
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
	//EZ.test.settings( {exfn:exfn} );
	//EZ.test.settings( {legacy:'exclude=isLegacy'} );
	//EZ.test.run(-2		,{EZ: {ex:-2, note:note}})
	//EZ.test.options( {ex:ex, note:note} )
	//EZ.test.run( ctx, arg, obj )
	//_______________________________________________________________________________________
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	EZ.test.settings({call:'new'})
	var x = {a:1};
	obj = EZ.test.run(x)

	if (true) return;
	EZ.test.quit;	//script continues but all following test skipped

	EZ.test.settings({call:''})
	rtnValue = EZ.test.run(x, obj);
	
	x.b = x;
	x.c = x;
	EZ.test.run(x)	

	//_______________________________________________________________________________________
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
if (EZ && EZ.global && EZ.global.setup) EZ.global.setup('EZ', 'EZcapture');
