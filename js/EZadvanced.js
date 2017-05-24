/*global 
EZgetTagType,
EZselectScroll,
EZnone, 
setAction,

EZ, dw:true, DWfile, e:true, g  */
var e;
(function() {[	//global variables and functions defined but not used

e, g, dw, DWfile]
});

//_________________________________________________________________________________________________
e = function _____EZfunctions_EZstack_____() {}	//convenience for DW functions list
//_________________________________________________________________________________________________

/*--------------------------------------------------------------------------------------------------
EZ.getFunctionName(skip, rtnObj)

Originally created for EZ.capture() including EZ.techSupport() new capture and EZ.fault() interfaces.

Consolidates a lot of function and call statement parsing as well as new logic to derive fn from
call stack when function name property is blank (e.g. closures and Object properties).

Works quite well when called with fn String or Regex -- using know stack position -- Chrome always 
has fn name on call stack (even for unnmed fn) will use variable or Object key assigned to function.
Is not nested name.

ARGUMENTS:
	fn			(optional)	specifies function or fn name -- If blank or omitted get immediate caller.
				(String) 	name or regular expression of stack line immediately proceeding the function
				(RegExp)	name returned.  
				
				(Function) 	return name for this function -- if the function does not have name property,
							the stack is searched for matching function (stack name must have global scope)
							If not found on stack, the script containing the function is searched for the
							variable or Object key containing function statement.
	
	rtnObj	(optional)	If Object, following fn properties returned:
						filename:
						lineno:
						column:
						
						TODO: ...
						statement:	string containing call statement
						argNames:	Array containing named arguments on function state
						callNames:	Array containing variable names from call statement or json
						 			representaion of expression if call argument not a variable
						script:		function script if available
						
						arguments:	current fn arguments Object if from is function -or-
									fn name has global scope
	
	
RETURNS:
	specified from function name
	rtnObj set to fn properties descibed above

TODO:
	only implemented funtionality used by EZ.capture
	find function name by recursively looking for macth to an Object in the from context.	
--------------------------------------------------------------------------------------------------*/
EZ.functions.getName = function EZfunctions_getName(fn, rtnObj)
{
	var isNext = false
	switch (EZ.getType(fn, NaN))
	{						//sort arguments
		case 'String':
		case 'RegExp':
			isNext = true;	//next fn on stack
			break;
		case 'Number':		//no of fn before us on stack
		case 'Function':	//get name for specified fn 
			break;			//good as-is
		
		case 'Array': 	
		case 'Object': 		//fn omitted
		{
			rtnObj = fn;
			fn = 0;
			break;
		}
		default:			//including NaN
			fn = 0;			//immediate caller on stack
	}

	var name, stack;
	while (true)
	{
		if (typeof(fn) == 'function')
			name = fn.name || fn.displayName;
		if (name) break;
		
					//column 20 when w/o tabs else column 14              	
        stack = EZ.stack(fn, isNext);	//get fn from stack 
		if (!stack.fault) 
		{			
			name = stack.get('name');
			if (name) break;
		}
		//TODO: not tested
		//name = EZ.functions.mapName(fn);	
		//if (name) break;
		
		return '';		//fn name not found
	}
	  //-------------------------------------------------\\
	 //----- return fn properties if rtnObj supplied -----\\
	//-----------------------------------------------------\\
	while (typeof(rtnObj) == 'object')
	{
		if (!stack) stack = EZ.stack(name);			
		if (stack.fault) break;							//bail if fn name not found on stack
		
		var url = stack.get('url');						//call stack url, lineno, column
		url = url.replace(/(http:.*?)\/(?=\w+\.(js|htm|html|php|jsp|asp))/g, '.../');	//TODO: ??
		rtnObj.url = url;
		rtnObj.lineno = stack.get('lineno');
		rtnObj.column = stack.get('column');
	
		/*TODO:	needs work -- but EZ.capture not using yet
		var args = EZ.stack.get('arguments',stack,fn);	//get fn and call statement arguments
		if (!args) break;								//bail if not available
		
														//save fn statement 
		
		rtnObj.arguments = [];							//save json of call arguments values
		for (var i=0; i<args.length; i++)
			rtnObj.arguments[i] = EZ.stringify(args[i], '*');
		*/											
		break;
	}
	//==========
	return name;
	//==========
}


/*--------------------------------------------------------------------------------------------------
EZ.functions.mapName(fn)

Find function name the hard way (from script)

First look in function map for matching function script.  If not found, scan each script until a
match is found -- as each script is scanned, its added to map to avoid scanning more than once.

ARGUMENTS:
	fn

RETURNS:
	function name if found
	
TODO:
	NOT TESTED -- does not appear needed for EZ.capture on chrome -- stack has name 
				  (not nested name but so what)
	stript comments

	EZ.functionMap = EZ.functionMap || {scripts:[]};
	name = EZ.functionMap[fn];

	if (!name && !EZ.functionMap.scripts.includes(options.url))
	{									//index fn script file if not done yet
		var fnList = EZ.getFunctionList(options.url);
		EZ.functionMap = EZ.functionMap.concat(fnList.xxx);
		EZ.functionMap.scripts.push(options.url);
		name = EZ.functionMap[fn];
	}
--------------------------------------------------------------------------------------------------*/
EZ.functions.add = function EZfunctions_add(fn, name /* values */, url, lineno, column)
{
	var map = EZ.functions();
	var idx = map.list.includes(fn); 
	if (idx != -1) return;
	
	idx = map.list.push(fn) - 1;
	var code = map.code[idx] = fn.toString().trim();
	
	//cross ref to related: EZ.getFunction, EZ.getFunctionParts, function EZgetFunction
	//EZ.patterns.funcParts, EZ.patterns.functionStatement, EZ.patterns.functionnDetail
	e = /function\s*(\w*)\s*\((.*?)\)[^{]*{([\s\S]*)}/
	e = /function\s*(\w*)\s*\((.*?)\)[^{]*{\s*([\s\S]*)}/;	//from EZ.clone
	
	var pattern = /(function\s*(\w+?)?\s*(\([\w,\s]*?\))\s*)([\s\S]*)/
	
	var labels = 'statement, name, argNames, script';
	var matches = code.matchPlus(pattern, labels);
	
	var info = map.info[idx] = {
		statement: matches[1],
		name: matches[2] || name, 
		arguments: matches[3].split(/\s*,\s*/),
		url: url || '', 
		lineno: lineno || '',
		column: column || '',
		names: []
	}
	
	e = [name, fn.name, info.name]
	
	e.forEach(function(name)	
	{
		if (!name || info.names.includes(name)) return;
		map.names[name] = idx;
		info.names.push(name);
	});
}
/*--------------------------------------------------------------------------------------------------
EZ.functions.get(values)

find or add fn values.name to functions.map -- values: name, url, lineno, column
				var script = DWfile.read(values.url)
--------------------------------------------------------------------------------------------------*/
EZ.functions.find = function EZfunctions_find(values)
{
	var name = values.name;
	var map = EZ.functions();
	var idx = map.list.indexOf(name);
	if (idx == -1)
	{												//update map if not done and script supplied
		//var fnCode = fn + '';						//fn script from dom
		[].some.call(document.scripts, function(script)
		{
			if (EZ.hasClass(script, 'EZmapped')) return;
			
			var src = script.src || script.innerHTML;
			if (src)
			{	
				var fnList = EZ.getFunctionList(src);
				script = fnList.script.split('\n');
				fnList.forEach(function(fn)			//for each fn found . . .
				{									
					var code = script.slice(fn.lineno, fn.linenoEnd);
													//remove code before fn statement
					code[0] = code[0].replace(/.*?(function[\s\S]*)/, '$1');	
					code = code.join('\n').trim();
					
					//var idx = map.code.indexOf(code);
					if (!map.code[code])
					{
						map.code[code] = fn.nestedName;
						///if (code == fnCode)
						///name = p.nestedName;
					}
					else
					{
					}
				});
				if (name) return true
			}
			EZ.addClass(script, 'EZmapped');
			if (name) return true
		});
	}
	if (values)
	{
		Object.keys(values).forEach(function(key)
		{
			var value = values[key];
			if (key != name)
				map.info[idx][key] = value || map.info[idx][key];
			else if (!map.names.includes(value))
			{
				map.names[value] = idx;
				map.info.names.push(value);
			}
		});
	}
}
/*----------------------------------------------------------------------------------
test wrapper fn -- global scope
	//if (EZ.capture.check(this)) {return EZ.capture()} else if (EZ.test.debug()) debugger;
----------------------------------------------------------------------------------*/
EZ.functions.getNameStackTest = function(action, name, rtnObj)
{										
	var pattern = /(http:.*?)\/(?=\w+\.(js|htm|html|php|jsp|asp))/g;
	var fnName = 'EZ.functions.getNameStackTest';
	
	/*
		at Object.EZfunctions_getName:664          (.../EZcommonParse.js:664)
		at myfn:774                                (.../EZcommonParse.js:774)
		at EZ.functions.getNameStackTest:786       (.../EZcommonParse.js:786)
		at EZtest_run:525                          (.../EZtest_assistant_run.js:525)
		at EZ.functions.getNameStackTest.test:821  (.../EZcommonParse.js:821)
		at .../EZtest_assistant_run.js:65	
	*/
	var myfn = function()
	{
		var stack = new Error().stack.replace(pattern, '.../');
		EZ.test.note(stack.split('\n').slice(1).join('\n'));

		return EZ.functions.getName('', rtnObj);
	}
	var myNew = function()
	{
		this.objfn = function()
		{
			return EZ.functions.getName('', rtnObj);
		}
	}
	
	switch (action)							//which fn calls EZ.functions.getName()
	{
		case 'myfn': 	return myfn();		//fn with local scope
		case 'myNew': 		
		{
			var my = new myNew()
			return my.objfn();
		}
		default:			
			fnName = EZ.functions.getName(name, rtnObj);
			return fnName;
	}
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.functions.getNameStackTest.test = function()
{
	var notefn = function(testrun, phase)
	{
		e = testrun;
		if (phase == 'final')
			return testrun.testNote;
	}
	
	var rtnObj = {};
	var fn = EZ.functions.getNameStackTest;
	var fnName = 'EZ.functions.getNameStackTest';
	var pattern = '/EZ.functions.getNameStack/';
	var regex = /EZ.functions.getNameStack/;

	/*
    at Function.EZstack [as stack] (http://localhost:8080/revize/dw.Configuration/Shared/EZ/js/EZbase.js:817:11)
    at Object.EZfunctions_getName [as getName] (http://localhost:8080/revize/dw.Configuration/Shared/EZ/js/EZcommonParse.js:659:14)
    at myfn (http://localhost:8080/revize/dw.Configuration/Shared/EZ/js/EZcommonParse.js:774:23)
    at EZ.functions.getNameStackTest (http://localhost:8080/revize/dw.Configuration/Shared/EZ/js/EZcommonParse.js:786:24)
    at Function.EZtest_run [as run] (http://localhost:8080/revize/dw.Configuration/Shared/EZ/html/EZtest_assistant_run.js:537:37)
    at Function.EZ.functions.getNameStackTest.test [as testScript] (http://localhost:8080/revize/dw.Configuration/Shared/EZ/js/EZcommonParse.js:821:10)
    at http://localhost:8080/revize/dw.Configuration/Shared/EZ/html/EZtest_assistant_run.js:65:11"
	*/
EZ.test.only(5)
	//________________________________________________________________________________________
	//EZ.test.settings({group:'get EZtest_run'})
	EZ.test.options({ex:'EZfunctions_getName'})
	EZ.test.run('', fn		, rtnObj)

	//________________________________________________________________________________________
	EZ.test.options({ex:'EZ.functions.getNameStackTest'})
	EZ.test.run('', fnName)

	EZ.test.options({ex:'EZ.functions.getNameStackTest'})
	EZ.test.run('', pattern	, rtnObj)
	
	EZ.test.options({ex:'EZ.functions.getNameStackTest'})
	EZ.test.run('', regex)
	
	//________________________________________________________________________________________
	EZ.test.options({notefn:notefn, ex:'myfn'})
	EZ.test.run('myfn', '', rtnObj )
	
	EZ.test.options({ex:'myNew.objfn'})
	EZ.test.run('myNew', '', rtnObj)
	//________________________________________________________________________________________
EZ.test.skip(999)	
}
/*--------------------------------------------------------------------------------------------------
EZ.stack([sliceTo,] [stack])

Always removes messages at top of stack (and line containing EZstack function if stack not supplied)

ARGUMENTS:
	sliceTo	(optional) 	specifies lines removed from top of stack if supplied as follows:
			(Number)	number of lines removed after messages -- can be 0
			
			(String)	specifies function name -- all lines preceeding the last line containing
			(RegExp)	the specified name are removed.
			
			(function)	All lines proceeding last occurance are removed -OR- all lines if function
						NOT found.  The function must have name property or global scope.
	
	stack	(optional) 	If omitted current stack is used with messages and EZstack line are removed.
						can be stack (Array or String) or function. If function, all lines proceeding
						function are removed from current stack before removing lines specified by "sliceTo"

RETURNS:
	stack as Array with lines removed as explained above and the following named Array properties:
		messages	all messages at top of stack as Array if any otherwise undefined
		fault		EZfault Object if any exceptions occured	

TODO:
	
Creates new stack object containing the following properties:
 *		name, url, linenno, column parsed from stack
 *		statement, argNames, callNames, callTypes come from fn script
 *		callee: fn Object if supplied or name on top fn on stack has global scope
 				TODO: -or- useMap is true
				
 *		arguments comes from function arguments property
 			always added if fn argument is fn or name on stack has global scope
			
 is json representation of currents values from arguments stack

--------------------------------------------------------------------------------------------------*/
EZ.stack = function EZstack(sliceTo,stack,options,caller)
{
	if ( !(this instanceof arguments.callee) ) 	
	{											//if not called as constructor...
		var caller = arguments.callee.caller;
		return new EZ.stack(sliceTo,stack,options,caller);
	}
	if (EZ.getConstructorName(sliceTo) == 'EZstack')
	{											//is 1st arg prior EZstack Object
		options = stack;
		stack = sliceTo;
		sliceTo = 0;
	}
	if (EZ.getConstructorName(stack) == 'EZstack')	
	{											//use prior stack if supplied
		this.lines = stack.lines;	
		this.fnValues = stack.fnValues;	
	}
	else 
	{
		options = stack;
		stack = '';
	}
	options = EZ.options(options, 'useMap');
	this.lines = stack ? [] : new Error().stack.split('\n');
	this.fn	= null;								//fn object if available

	this.values = {						
		nestedName: '',							//from fnList if requested TODO:
		
		name: '',								//parsed from call stack
		lineno: '',
		column: '',
		url: '',
		
		statement: '',							//parsed from fn script if avail
		argNames: [],							//		''
		
		arguments: null,						//parsed from caller script if avail -- TODO:
		callNames: [],							//		''
		callTypes: [],							//		''
		
		stale: true								//get() clears -- sliceTo() resets to true
	}
	//options = options && typeof(options) == 'object' ? options : {useMap: Boolean(options)}
	
	var init = function(caller)
	{
		  //-------------------------------------------------\\
		 //----- map unique functions on arguments stack -----\\
		//-----------------------------------------------------\\
		var processed = [];				//avoid circular loop
		for (var fn = caller; fn != null; fn = fn.caller)
		{
			if (processed.includes(fn)) break;
			processed.push(fn);
			EZ.functions.add(fn)		//add to fn list if not there
		}
		/*
		Error
			at eval (eval at evaluate (unknown source), <anonymous>:1:1)
			at new EZstack (http://localhost:8080/revize/dw.Configuration/Shared/EZ/js/EZcommonParse.js:206:2)
			at Function.EZstack [as stack] (http://localhost:8080/revize/dw.Configuration/Shared/EZ/js/EZcommonParse.js:176:10)

			at Function.EZfunctions_getName [as getName] 	EZcommonParse.js:91:20)
			at EZ.functions.getNameStackTest 				EZcommonParse.js:597:26)
			at Function.EZtest_run [as run] 				EZtest_assistant_run.js:537:37)
			at Function.EZ.functions.getNameStackTest.test [as testScript] 	EZcommonParse.js:624:10)
			at http://localhost:8080/revize/dw.Configuration/Shared/EZ/html/EZtest_assistant_run.js:65:11

		*/
		if (!stack)
		{
			this.sliceTo(/EZstack/, true);				
			void(0)
		}
		this.sliceTo(sliceTo, options);				
		return this;
	}
	//________________________________________________________________________________________
	/**
	 *	slice stack lines upto fn if after omitted or false otherwise slice thru fn.
	 *	if fn is number, it specifies number of lines == same as stack.lines.slice(#) except
	 *	messages are 1st prepended to stack.messages.
	 *
	 *	if fn is typeof function or string slice up to fisrt occurance if RegExp slice upto
	 *	last occurance.
	 *
	 *	returns true if fn found otherwise false
	 *		stack.fault set to EZfault object if js error occurs -- usually bad RegExp
	 */
	this.sliceTo = function(fn, after /* todo */)
	{
		var fn, name, count;		
		var options = EZ.options(after, 'after');
		var stack = this;

		if (!isNaN(fn))
			fn = parseInt(fn) || 0;
		switch (EZ.getType(fn))
		{
			case 'Number':
			{
				count = fn + 1;
				fn = '';
				break;
			}
			case 'String':
			case 'RegExp':	
			{
				name = fn;
				fn = '';
				break;
			}
			case 'Function':
			{
				stack.fn = fn;
				name = fn.name || fn.displayName;
				break;
			}
			default:
			{
				return false;
			}
		}
		var lines = stack.lines.slice();		//clone stack.lines
		var messages = [];						//remove messages
		while (lines.length && !lines[0].includes(' at '))
			messages.push(lines.shift())
		
		try										//slice
		{
			var isFound = false;
			if (count !== undefined)			//specified # lines
			{
				isFound = true;
				lines = lines.slice(count);
			}
			else if (name)						//slice to name
			{
				var pattern = name;
				if (EZ.getType(pattern) == 'RegExp')
					pattern = pattern.source.replace(/\//g, '\\/');	//.replace(/\\/g, '\\\\');
				else if (/^(["'])(.*?)\1$/.test(name))	
					pattern = pattern.substr(1).clip();
		
				pattern = pattern.replace(/\/(.*)\/.*/, '$1');
			
				pattern = "([\\s\\S]*)"				//before line -- always dropped
						+ "(    at ((Function|Object)\\.)?" 	
						+ pattern + ".*\\s*)" 		//thru end of to line
					//	+ "(    [\\s\\S]*)"					
					//	+ "(\\s*?)( [\\s\\S]*)";	//after line -- always kept
					//	think above had rest group wrong
						+ "(    [\\s\\S]*"					
						+ "(\\s*?)( [\\s\\S]*))";	//after line -- always kept
				
				var lines = lines.join('\n');
				lines = lines.replace(RegExp(pattern), function(all, before, line, fngroup, fn, rest)
				{
					isFound = true;
					return (options.after ?  '' : line) + rest;
				});
				lines = lines.split('\n');
				if (!isFound)
					return false;
			}
			else									//slice to fn with unknown name
			{
				//var map = {}
				//var notGlobal = false;
				var lines = stack.lines.slice(0);
				while (true)				
				{
					var fn;
					isFound = !lines.some(function(line)
					{
						var pattern = /[\s\S]*\s+at ((Function|Object)\.)?(\S+)/;
						var results = line.match(pattern);
						while (results && results[3])
						{
							var stackName = results[3] || '';
							if (!stackName) break;		//ignore stack lines w/o function name
							if (name != stackName)		
							{							//if names don't match, compare fn Object
								fn = stackName.ov();
								if (fn != sliceTo) return;
							}
							return true;
						}
						lines.shift();					//remove next line from stack returned
					});
					if (!isFound) return false;
					if (fn)
						stack.fn = fn;
					break; 
				}
			}
		}
		catch (e) 
		{
			stack.fault = EZ.techSupport(e,this);
			return false;
		}
		stack.values.stale = true;
		stack.lines = lines;
		if (messages.length)
			stack.messages = messages.concat(stack.messages || []);
		return stack;
	}
	//__________________________________________________________________________________________________
	/**
	 *	update stack.fn properties if stale then return property specified by key or all if key omitted.
	 *	when properties stale or do not exist update using fn if supplied or updated EZ.functions.map().
	 
		at EZfunctions_getName:660                  (.../EZcommonParse.js:660)
		at myfn:1133                                (.../EZcommonParse.js:1133)
		at EZ.functions.getNameStackTest:1145       (.../EZcommonParse.js:1145)
		at EZtest_run:525                           (.../EZtest_assistant_run.js:525)
		at EZ.functions.getNameStackTest.test:1190  (.../EZcommonParse.js:1190)
		at .../EZtest_assistant_run.js:65           "
   	 */
	this.get = function(key, fn, options)
	{
		var stack = this;
		if (typeof(key) == 'function')
		{
			options = fn;
			fn = key;
			key = '';
		}
		if (typeof(fn) != 'function')
		{
			options = fn;
			fn = '';
		}
		key = key || '';
		options = EZ.options(options, 'map')
		
		var values = stack.values;
		while (!values || values.stale)
		{
			values = {};
			var line = stack.lines[0];
			if (!line) break;					//bail if no stack line (i.e. only messages or length = 0)
			
			var results = line.match(/[\s\S]*\s+at ((Function|Object)\.)?(\S+)(.*)/);
			while (results) 					//at least fn name found from top of stack
			{									
				values = stack.values = {};
				values.name = results[3] || '';
				if (!fn)						//if fn not supplied, try name in global scoope
					fn = values.name.ov()
				
				results = (results[4] || '').match(/.*\((.*\..*?):(.*)\)/);
				if (!results) break;			//bail if parse for url... failed
				
				var url = results[1] || '';
				values.url = url;
				
				var lineCol = results[2].split(':');
				values.lineno = Number(lineCol[0]) || '';
				values.column = Number(lineCol[1]) || '';
				break;
			}
			fn = fn || stack.fn;
			if (fn)
				EZ.functions.add(fn, values);
			else if (key == 'arguments')
			{
				fn = EZ.functions.find(values);
			}
			stack.fn = fn || stack.fn || '';			//update stack fn if changed
			break;
		}
		return key ? values[key] : values;
	}
	init.call(this, caller);
}

//_________________________________________________________________________________________________
e = function _____EZget_set_____() {}	//convenience for DW functions list
//_________________________________________________________________________________________________

/*---------------------------------------------------------------------------------------------
EZ.getEl(selectors, doc)       -- FULL FUNCTIONALITY --

If multiple elements match the selector or the selector is a collection al elements, only the 
1st element is returned.  If the selector is an array, all elements matching all non-empty
selectors is returned.  To always get a single element for selector arrays, use EZ._().

if no element is found matching any of specified selectors, a generic element is returned not
connected to anything visible. It has all the most common properties and attibutes of any tag.

This avoids js errors when subsequent code assumes an element or field is returned which often
happens when selectors are mis-spelled or elements are deleted w/o deleting all related script.

Only enough selectors are tried until one or moe elements match form fields or elements
UNLESS called from EZ.getAll() in which case all selectors are processed. In either case,
selectors are used until match found for fieldname, id, tagName or className in that order.


ARGUMENTS:
	selectors	one or more html elements or a comma delimited string of selector(s), or array
				of elements and selectors (only one element or selector allow per array item)
	
	doc			(optional)	root element used to locate elements matching specified selectors
							defaults to document if only 2 args and 2nd arg is options
			
	options		(optional) 	determines how many elements are returned and/or an array containing
				(last arg)	one or more elements is returned as explained below:
						
				false	only one element returned
				true	only 1st element found is returned as single element array
				@		all elements matching any of the selectors always returned as 
						array even if none are found
						
				default	=true when selectors arg is array =false otherwise 
				
RETURNS:
	either single element or array of elements matching one or more selectors -- if no elements 
	are found matching any of the supplied selectors, a pseudo element is created and returned.

TODO: 
	support selector prefixes and only try matching associated type: 
	"#" element id -- "." className -- "@" fieldName -- "<" tagName with or w/o ">" suffix
	when id or field name specified, only select if under doc root
	compound seelectors e.g. #someid.li ul
	multiple arguments containing more selectors ??

	
	// determine if stopping after 1st match or using all all selectors
	var patternfunction = /function\s*(\w*)\s*\((.*?)\)[^{]*{\s*([\s\S]*)}/;
	var callerName = EZ.matchPlus(arguments.callee.caller, patternfunction)[1];
	var stopAfterFirst = /^(RZ|EZ)_$/.test(callerName)		//always stop if caller EZ_()
					  || /^(RZ|EZ)\$$/.test(callerName) 	//never stop if caller EZ$() or ...
					  || (!EZ.is(els) && els.length > 1);	//...multiple selectors but not els
	
--------------------------------------------------------------------------------------------------*/
EZ.getEl = window.EZgetEl = function EZgetEl(selectors, nodes)
{
	if (!document.body)
		return EZ.oops('document NOT loaded','selectors: ' + selectors.wrap()) || EZ.none();

	var settings = EZ.is(nodes, EZ.getEl.getSettings) 
				 ? EZ.merge(nodes, {selectors:selectors})		//called with pre-defined settings
				 : new EZ.getEl.getSettings(this, arguments); 	//breakpoint for settings not defined
	
	/**	PARTIAL LIST OF SETTINGS:
	 *	
	 *	one:T/F only return 1st html element found -- all:T/F return Array of all tags for all selectors	
	 *
	 *	root(s) starting dom nodes -- nodes: additional starting nodes -- doc: legacy single root
	 *
	 *	selectors: Array of selectors: only first match unless specified as Array (implicit all:true)
	 *
	 *	notFound: object returned if no tags found: EZnone by default -- null if nodes=null
	 */
	//--------------------------------------------------------------------
	// 	legacy code -- doc must be document object
	//	use above new code for correct doc value
	//--------------------------------------------------------------------
	if (settings.legacy)
	{
		var doc = settings.doc;
		var els = settings.selectors[0];
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
	
	//======================================================================================
	// 	NON-legacy -- probably used by default since at least Jan 2016
	//	updated: 09-09-2016: fixed 2nd arg =null to return false if notFound (not EZnone)
	//======================================================================================
	var tags = [];
	
	//----- Nothing selected
	while (settings.selectors.length > 0 && settings.roots.length > 0)	
	{
		//---------------------------------------------------------------------------------- 
		//----- FAST SELECT: all selectors are elements
		//---------------------------------------------------------------------------------- 
		if (EZ.isEl(settings.selectors))	//nodes exploded && (!settings.nodes.length || EZ.isEl(settings.nodes)))
		{									//keep tags in default or specified root(s)
			tags = settings.selectors;
			if (!_EZgetEl_getDescendants(tags, settings.roots)) 
				break;
			
			if (settings.nodes.length)		
				_EZgetEl_getDescendants(tags, settings.nodes);
			break;
		}
		
		//---------------------------------------------------------------------------------- 
		//----- Full selection algorithm
		//---------------------------------------------------------------------------------- 
		[].every.call(settings.selectors, function _forEverySpecifiedSelector(sel)		
		{											
			if (!_EZgetEl_isSelectorType(sel) || sel == null) return true;	//skip invalid type
			
			sel = EZ.toArray(sel, false);	//TODO ','
			[].every.call(settings.selectors, function _forEveryCommaDelimitedSelector(sel)	
			{											
				if (!_EZgetEl_isSelectorType(sel) || sel == null) return true;	
				
				return [].every.call(settings.roots, function _forEveryRootElement(root)	
				{										
					//-----------------------------------------------------------------------------
					// recursively call EZ.getEl() for chained selections from:
					// 		optional nodes argument when called from context element...
					//							...fully exploded into elements by getSettings()
					//		-AND/OR- by space delimited selectors ... exploded below
					//-----------------------------------------------------------------------------
					var chainedSelections = EZ.toArray(sel,' ');	
					sel = chainedSelections.pop();			//remove single selector or last in chain
					[								
						settings.nodes, 					//1st apply nodes selector
						chainedSelections					//selector(s) exploded except last one
					].forEach(function _forEachChain(nodes)	
					{								
	if (nodes.length > 0) debugger;
	if (EZ.quit) return false;
															//for ALL nodes and chained selections . . .
						nodes.forEach(function _forEachChainedSelector(node)	
						{									//get and save ALL matching tags  . . .	
							_EZgetEl_addElements(nodes, EZ.getEl(node, settings.baseSetting));
						});									//last selector applied to all matches
					});										
					
					//----- if selector is element, array of elements or html collection
					if (EZ.isEl(sel)							//...only add elements descendant of roots??
					&& _EZgetEl_getDescendants(sel,root)) 		
						if (_EZgetEl_addElements(sel)) return;
					
					//----------------------------------------------------------------------------
					// for compound selector (e.g #footer.div.input) keep checking until any part 
					// of selectors does not match or all parts checked.
					//-----------------------------------------------------------------------------
					var parts = _EZgetEl_getCompoundParts(sel);
					if (!parts) parts = [];
	if (parts.length > 1) debugger;
	if (EZ.quit) return false;
					
					return parts.every(function _forEverySelectorPart(sel)
					{
						if (sel == null) return false;			//invalid compound
						if (EZ.isArray(sel)) 					//sel is Array of parts if compound . . .
						{
							return sel.every(function _forEveryMatchingPart(sel)
							{
								if (!sel) return true;			//continue empty or EZnone selector
								el = EZ.getEl(el, settings.baseSettings);
								if (!el.length) 			//if not found, break out of loop
									return false;
								if (_EZgetEl_addElements(el)) 	//also break if one is enough
									return false;
							});
						}
						//??? NOTE: below code is only run via recursive if above compound code runs
						var e, prefix = '';
						if (typeof(sel) == 'string')
						{
							var groups = sel.matchPlus(/([#.<@])?(.*?)(>|$)/);
							prefix = groups[1];			//if selector qualified with: # . < -or- @
							sel = groups[2];						//remove qualifier
						}
						if ('@'.indexOf(prefix) < 1)
						{											//try for form field match
							e = _EZgetEl_getFormField(sel,root)		
							if (e != null)
							{ 	
								if (_EZgetEl_addElements(e)) 	//quit if one is enough
									return false;
							}
						}
						if ('#'.indexOf(prefix) < 1)
						{										//try for id match
							e = EZ.getEl.getDocument(root).getElementById(sel);		
							if (EZ.isEl(e) && _EZgetEl_getDescendants(e,root) != null) 
							{ 	
								if (_EZgetEl_addElements(e)) 	//quit if one is enough
									return false;
							}
						}
						if ('<'.indexOf(prefix) < 1)
						{										//try as tagName
							e = root.getElementsByTagName(sel);		
							if (EZ.isEl(e)) 
							{ 	
								if (_EZgetEl_addElements(e)) 	//quit if one is enough
									return false;
							}
						}
						if ('.'.indexOf(prefix) < 1)
						{										//try as css class
							e = root.getElementsByClassName(sel)		
							if (EZ.isEl(e)) 
							{ 	
								if (_EZgetEl_addElements(e)) 	//quit if one is enough
									return false;
							}
						}
						return true;	//breakpoint here for not found or selecting all
					}); //end of compound parts
				});	//end of roots 				
			});	//end of comma delimited selector
		});	//end of selectors
		break;
	} //end Fast or Full selection
	
	//----- Set tags to settings.notFound if no tags selected
	var notFound = '.notFound'.ov(settings, 'EZnone') || null;
	if (!tags.length)		
	{
		if (notFound == 'EZnone')
			tags = [EZ.none(settings)]			//EZnone() pseudo tag is default
		else if (notFound instanceof Object)
			tags = notFound;				
		else
			tags = [];
		
		/*
		else if (notFound === false)
			tags = null;	
		else if (typeof(notFound) == 'object')
			tags = notFound;				//
		else
			tags = [settings.notFound];		//Array if notFound is not object
		*/
		
		/*
		var notFound = '.notFound'.ov(settings, 'EZnone');
		tags = notFound == 'EZnone' 
			 ? [EZ.none(settings)]			//EZnone() pseudo tag is default
			 
			 : typeof(settings.notFound) == 'object'
			 ? settings.notFound			//e.g. [] or {} and null
			 : [settings.notFound];			//Array if notFound is not object
		*/	 
	}
	else 
		tags = tags.removeDups();
	
	EZ.tags = tags;
	EZ.el = (EZ.tags.length) ? tags[0] : notFound;
	//================================================================================
	if (settings.one && tags.length != null)	//if returning 1st tag...
		return EZ.bindElements(tags[0]) 		//...bind 1st tag if not yet bound
	else										//if returning Array or html collection...
		return EZ.bindElements(tags)			//...bind Array/collection and tags
	//================================================================================
	/**
	 *	Add nodes to tags array, return true to continue selecting elements
	 */
	function _EZgetEl_addElements(nodes)
	{
		if (nodes == null) return true;
		
		if (settings.asis && !tags.length && EZ.isArrayLike(nodes))
			tags = nodes;		//save html collection as is if no other tags
		
		else
		{
			if (!EZ.isArrayLike(tags))			//html collection...
				tags = [].slice.call(tags);		//...copy to new Array
			
			EZ.toArray(nodes).forEach(function(el) 
			{ 									
				tags.push(el) 					//add each node to tags
			});
		}
		return !settings.all;	//return true to quit selecting more nodes
	}
	/**
	 *	return selector parts as Array of selectors for compound selectors
	 *	otherwise return selection as single element Array.
	 *	
	 */
	function _EZgetEl_getCompoundParts(sel)
	{
		if (typeof(sel) != 'string') return [sel];		//return if not string
		if (/:\]\[]/.test(sel)) return undefined;		//unsupported selector char
		if (!/[#.:\]\[\w\d]/.test(sel)) return null;	//invalid selector char
		
		var groups = sel.matchPlus(/(\S)(([#.])([\w\d]*))/);
		if (groups) return [sel];				//if nothing found, not compound 
		
		var parts = [];
		if (/^[\w\d]/.test(groups[0]))					//1st part is tag
			parts.push('<' + groups.shift());			
		
		while (groups.length)							//process remaining parts
		{
			var prefix = groups.shift();
			if (!groups.length) return null;		//invalid if last taken
			if (/^[\w\d]/.test(groups[0])) return null;	//invalid if not followed by word
			parts.push(prefix + groups.shift());
		}
		return parts;
	}
	/**
	 *	Get html collection of all form field(s) matching selector -- return any that are decendents
	 *	of element that called EZ.getEl() -or- all elements if EZ.getEl() was not called from element.
	 *
	 *	return null if none found or none are decendents otherwise return those that are decendents.
	 */
	function _EZgetEl_getFormField(sel,root)
	{
		var tags = [];
		[].every.call(EZ.getEl.getDocument(root).forms, function _forEveryForm(form)
		{
			if (!form[sel]) return true;	//keep looking until field(s) found
			
			if (false && !tags.length)
				tags = EZ.toArrayLike(form[sel]);	//retain html collection
			else
			{
				tags = [].slice.call(tags);
				tags = tags.concat(EZ.toArray(form[sel]));
			}
			
			//tags.push(form[sel]);	
			if (_EZgetEl_getDescendants(tags,root) == null)
				return true;				//keep looking if no tags are descendants
		});
		return (tags.length > 0) ? tags : null;
	}
	/**
	 *	return tags that are decendents of element that called EZ.getEl() 
	 
	 disabled this test
	 -OR- all tags returned when
	 *	EZ.getEl() not called from an element i.e. EZ.getEl.settingsroot is document object.
	 */
	function _EZgetEl_getDescendants(tags, root)
	{
		if (tags == null) return tags;	// || root == document //could have diff document
		tags = EZ.toArray(tags, false);
		for (var idx=tags.length-1; idx>=0; idx--)
		{
			//if (root.indexOf(tags[0].ownerDocument) != -1) continue;
			
			if (!EZ.isAncestor(tags[idx], root))
				Array.prototype.splice.call(tags, idx, 1);	//remove tags[idx] is not decendent
		}
		return (tags.length > 0) ? tags : null;
	}
	/**
	 * 	return true if valid variable typeof and valid element, Array or collection of elements
	 * 	TODO: ^([.#a-zA-Z0-9_:[\])])+[,><a-zA-Z0-9_~=\"\":[\] ]*?$
	 */
	function _EZgetEl_isSelectorType(sel)
	{
		if ((!sel && sel !== '0') 
		|| 'string number object'.indexOf(typeof(sel)) == -1)
			return false;	//skip empty or EZnone selector
		
		if (typeof(sel) == 'object' && !EZ.isEl(sel))
			return false;
		
		return true;
	}
}
//_____________________________________________________________________________________________
EZ.getEl.test = function ()
{
	/*global  
		tstArrayObj, tstFn, tstObj, tstObjArrayLike,
		tstObjEmptyArray, t_doc, t_html, t_head, t_title, t_body, t_wrap, t_labels, t_inputs,
		t_forms, t_fm, t_none, t_tags, t_array, t_divs, t_radios, t_radio01, t_label_some, 
		t_mixed, t_idandclass
	*/
	(function jshint_globals_not_used() {	//global variables and functions defined but not used
	e = [
		tstArrayObj, tstFn, tstObj, tstObjArrayLike, 
		tstObjEmptyArray, t_doc, t_html, t_head, t_title, t_body, t_wrap, t_labels, t_inputs,
		t_forms, t_fm, t_none, t_tags, t_array, t_divs, t_radios, t_radio01, t_label_some, 
		t_mixed, t_idandclass
	]})

	var note

	EZ.test.run("----- backup copy of saved data -----", {EZ: {note:'not chained selector'}});
if (true) return;


	var ex_radios = [].slice.call(t_radios);
	EZ.test.run(['EZtest_radio'],	{EZ: {ex:ex_radios, 	note:'selector: radio group name'}});
	EZ.test.run(['test_id1'],t_wrap,	{EZ: {ex:t_idandclass, 	note:'id AND class'}});
	
	EZ.test.run('input',t_wrap,			{EZ: {ex:t_inputs[0], 	note:'field'}});
	EZ.test.run('EZTEST_TAG' ,t_wrap,	{EZ: {ex:t_tags[0],		note:'tag'	}});
	EZ.test.run('EZtest_class0',t_wrap,	{EZ: {ex:t_tags[0],		note:'class'}});	
	EZ.test.run('test_id1',t_wrap,		{EZ: {ex:t_labels[1], 	note:'id selector'}});
	
	EZ.test.run('.test_id1',t_wrap,		{EZ: {ex:t_inputs[3], 	note:'class not id'	}});
	EZ.test.run('@input',t_wrap,		{EZ: {ex:t_inputs[0], 	note:'field'}});
	EZ.test.run('<tags',t_wrap,			{EZ: {ex:t_tags[0],		note:'tag'	}});
	EZ.test.run('.class1',t_wrap,		{EZ: {ex:t_tags[1],		note:'class'}});
	
	//EZ.test.run(tags.EZ, '', 			{EZ: {ex:t_none, 		note:''		}});
	EZ.test.run(null, 					{EZ: {ex:t_none, 		note:''		}});
	EZ.test.run(0, 						{EZ: {ex:t_none, 		note:''		}});
	EZ.test.run('0', 					{EZ: {ex:t_none, 		note:''		}});

	EZ.test.run('tag',  				{EZ: {ex:t_tags[0], 	note:''		}});
	EZ.test.run(['tag'],   				{EZ: {ex:t_tags, 		note:''		}});
	EZ.test.run(['tag'],false,			{EZ: {ex:t_tags[0], 	note:''		}});
	EZ.test.run('tag', true,  			{EZ: {ex:t_tags, 		note:''		}});
	EZ.test.run('tag', false, 	 		{EZ: {ex:t_tags[0], 	note:''		}});
	EZ.test.run('tag', null,  			{EZ: {ex:t_tags, 		note:''		}});
	EZ.test.run('notags',  				{EZ: {ex:t_none,		note:''		}});
	EZ.test.run('notags', null,  		{EZ: {ex:null,			note:''		}});
	
	EZ.test.run('div', t_tags[1],		{EZ: {ex:t_divs[1]      			}});
	EZ.test.run('div',			        {EZ: {ex:t_divs         	   		}});
	EZ.test.run('radio','div',			{EZ: {ex:t_radios[1]				}});
	
	EZ.test.run('radio',t_tags[1],		{EZ: {ex:t_radio01,					}});
	EZ.test.run('radio',				{EZ: {ex:t_radio01,	ctx:t_tags[1]	}});
	
	//not sure how these should work -- convert to chained ??
	EZ.test.run('radio',t_divs[1],		{EZ: {ex:null,		ctx:t_tags[1]	}});
	EZ.test.run('radio','div',			{EZ: {ex:null,		ctx:t_tags[1]	}});
	EZ.test.run('radio','notag',		{EZ: {ex:null,		ctx:t_tags[1]	}});
	
	note = 'not document descendant'
	var div = document.createElement('div');		//alot more descendand scenarios
	EZ.test.run(EZ.getEl, div, 			{EZ: {ex:null, note:note}} );
}
/**
 *	return document object for el
 */
EZ.getEl.getDocument = function EZgetEl_getDocument(el)
{
	return EZ.is(el, document.constructor) 
		 ? el 				//el is document object
		 : el.ownerDocument 	
		 || document;		//safety for expected
}
/*---------------------------------------------------------------------------------------------
 *	1st arg is always selector(s); if more optional arguments . . .
 *
 *		options			last arg if boolean, null or any non-dom html object*
 *		defaultOptions 	2nd arg if more than 2 args and any non-dom html object*
 *
 *	 	nodes	 		2nd arg when 2nd arg is NOT options, defaultOptions, 
 *						undefined, null or blank -and- IS dom html element object* 
 *						or selector specified as string or Array otherwise...
 *						default: document
 *
 *	NOTE: * EZ.isNonElObject() or EZ.isEl() used to determine if dom object or not
-----------------------------------------------------------------------------------*/
EZ.getEl.getSettings = function EZgetEl_getSettings(ctx, args)
{
	//----- context root element(s) -- EZget/EZset pass context elements as nodes
	this.roots = ctx == window || typeof(ctx) == 'function' ? []
			   : EZ.toArray(ctx);			//breakpoint here for element context
	
	var args = args.length ? [].slice.call(args) : [''];	//get real non-empty Array

	//----- get defaultOptions -- its last arg if object containing defaults property
	var defaultOptions = '.defaults'.ov(args[args.length-1]) 
					   ? args.pop().defaults 
					   : '';
	
	//----- get options -- its now last arg if any of following:
	var options = args[args.length-1];		
	options = (options === true) ? {all: true, one:false} 
			: (options === false) ? {all: false, one:true}
			: (options === null) ? {notFound: false}
			: EZ.isObject(options) ? options
			: '';							//breakpoint here for options NOT found
	if (options) 
		args.pop();							//breakpoint here for options found
	
	//----- get selectors argement -- now next item in args -- 
	this.selectors = args.shift();	
	var isMultipleSelectors = (EZ.isArray(this.selectors) && !EZ.isEl(this.selectors));
														//keep ArrayLike html collection...
	this.selectors = EZ.toArray(this.selectors, false);	//...so it can returned "as is"
	
	//----- get nodes argument -- now next item in args
	this.nodes = EZ.toArray(args.shift());				//clone nodes html collection as...
														//...real Array its not returned
	
	//---------------------------------------------------------------------------------
	// set overrideable options to specified value or defaults
	//---------------------------------------------------------------------------------
	var settings = {						//value or object returned when no tags found
		notFound: 'EZ.legacy.EZgetEl.notFound'.ov('EZnone'), 
		uniqueEZnone: false,				//use unique EZnone when needed
		all: isMultipleSelectors,			//return all tags found by all selectors
		one: !isMultipleSelectors,			//return 1st tag found only 1st tag of collection
		asis: false,						//html colections returned as is
		legacy: options ? false : 'EZ.legacy.EZgetEl'.ov(false)
	}
											//get baseSettings for recursive calls to EZ.getEl()		
	//====================================================================================
	// EZ.merge was failing due to conflict with untested Object.clone prototype and 
	// EZ.clone() function -- may not have benn issue until EZ functions were re-ordered.
	//
	// Wrote mergeDeep() initially optimized for this function before fixing EZ.merge()
	//
	// Introduction of custom Objects with toDtring() has complicated Object merge/clone 
	// which has never been solid -- mergeDeep() has incorporated latest knowlege and
	// hopefully is or will soon be solid.
	//
	// ***** As of 09-20-2016: NOT SURE which merge is more stable *****
	//====================================================================================
	var isLegacy = EZ.isLegacy('EZsettings')
	if (isLegacy)
	{
		this.baseSettings = EZ.merge({mergeOptions:{append:false}}, settings, defaultOptions, options);
		EZ.merge(this, this.baseSettings);				
		this.baseSettings = EZ.merge(settings, {legacy:false, notFound:[], all:true, one:false});
	}
	else
	{
		this.baseSettings = EZ.merge.deep(settings, [defaultOptions, options], {append:false});
		EZ.merge.deep(this, this.baseSettings);				
		this.baseSettings = EZ.merge.deep(settings, {legacy:false, notFound:[], all:true, one:false});
	}
	
	//----- get elements for any context roots and/or nodes not specified as elements
	EZgetEl_getElements(this.roots, this.baseSettings, document);
	EZgetEl_getElements(this.nodes, this.baseSettings, this.roots);
	
	//------ if roots not specified, use for nodes if specified
	if (!this.roots.length && this.nodes.length > 0)
	{
		this.roots = this.nodes;			
		this.nodes = [];					
	}
	if (!this.roots.length)
		this.roots = [document];
	
	if (this.selectors.length > 1 
	|| (this.nodes && this.nodes.length > 0)	//if not moved to roots
	|| (this.roots.length > 1 || !EZ.is(this.doc,document.constructor)))
		this.legacy = false;
	
	if (this.legacy)
		this.doc = this.roots[0];	
	//_________________________________________________________________________________	
	/**
	 *	recursive calls to EZ.getEl() to find elements for non-element selectors
	 *	no nodes filter, array of all selections, empty array if no tags found.
	 *	Uses pre-defined settings so EZ.getEl_getSettings() is not called again.
	 */
	function EZgetEl_getElements(tags, baseSettings, roots)
	{
		if (!tags) return;
		if (!EZ.isArrayLike(tags) && !EZ.isEl(tags)) return;
		if (EZ.isArrayLike(tags) && tags.length === 0) return;

		var root = roots && roots.length && roots.length > 0 ? roots : document;
		
		var settings;
		if (isLegacy)
			settings = EZ.merge({mergeOptions:{maxdepth:0}}, baseSettings, {roots:root})
		else
			settings = EZ.merge.deep( baseSettings, [{roots:root}], {maxdepth:0} );
		
		for (var idx=tags.length-1; idx>=0; idx--)	//for each tag in reverse order
		{								
			var el = tags[idx];	//replace each non-el selector with 0+ html elements
			if (!EZ.isEl(el))
			{
				el = EZ.getEl(el, settings);
				var spliceArgs = [].concat([idx,1], [].slice.call(el) );
				Array.prototype.splice.apply(tags, spliceArgs);
			}
		}
	}
}
/*---------------------------------------------------------------------------------------------
update fieldValues for each element fount
---------------------------------------------------------------------------------------------*/
EZ.fieldValues = function EZfieldValues(el, defaultValue)
{
	this.caller = arguments.callee.caller.name || '';
	this.value = '';
	this.tagList = [];
	this.valueList = [];
	this.valueMap = {};
	this.idMap = {};
	
	this.add = this.addValue = function(el, value)
	{
		if (!(el instanceof Object) || el.childNodes === undefined)
			EZ.oops('no element supplied', el)

		if (this.valueList.length === 0)
			this.value = value != null ? value : '';
		
		var idx = this.tagList.indexOf(el)
		if (idx == -1)
			idx = this.tagList.push(el) - 1;
		this.valueList.push(value);
		
		var name = el.name || el.id;
		if (name)
			this.valueMap[name] = value;
		if (el.id)
			this.idMap[el.id] = value;
			
		if (EZ.is(el.EZfield, EZ.field))
			el.EZfield.update(value, this.caller);
	}
	this.getCheckedTags = function(tagType)
	{
		var list = [];
		this.tagList.forEach(function(el)
		{
			if (tagType && tagType != EZ.getTagType(el)) return;
			if (el.checked)
				list.push(el);
		});
		return list;
	}
	this.get = this.getValue = function()
	{
		return this.value;
	}
	if (!el)
		return;
		 
	var tags = EZ.getEl(el,true);		//get all element(s)
	if (!tags || tags[0].undefined) 
	{									//if none found, return defaultValue or blank
		var value = arguments.length > 1 ? defaultValue : '';
		this.addValue(tags[0], value);
		tags = [];
	}
	else if (!EZ.isArray(el))			//only use 1st element if el not Array
		this.tags = [tags[0]]
	this.tagList = [].slice.call(tags);
}
/*---------------------------------------------------------------------------------------------
return element value(s) as array -- useful for multi-select field
blank or no values returned as ??
---------------------------------------------------------------------------------------------*/
EZ.getValues = window.EZgetValues = function EZgetValues(el, defaultValue)
{
	var tags = EZ.toArray(el);		//returns empty Array if el null, blank or undefined
	var values = [];
	[].forEach.call(tags,function(el)
	{
		var val = EZ.getValue(el, defaultValue);
		values = values.concat( EZ.toArray(val, '|') )
	});
	return values;
}
/*---------------------------------------------------------------------------------------------
return element value -- cloned from EASY.js beta:

if unknown el return defaultValue or undefined
if form field, return field value else el.innerHTML if defined otherwise null

TODO: defaultValue may not be complete
	  consolidate, merge or sync with EZget(), EZval() and EZget_basic()
---------------------------------------------------------------------------------------------*/
EZ.getValue = window.EZgetValue = function EZgetValue(el, defaultValue)	
{
	var fieldValues = new EZ.fieldValues(el, defaultValue);
	fieldValues.tagList.forEach(function(el)
	{
		var name = el.name || el.id || '';
		var value = el.value != EZ.undefined ? el.value
				  : el.innerHTML != EZ.undefined ? el.innerHTML
				  : '';
		switch (EZgetTagType(el))
		{
			case 'textarea':
			case 'text':
			case 'password':
			case 'hidden':
				return fieldValues.addValue(el,value);
	
			case 'img':
			case 'image':
			{		
				if (value === '')
					value = el.src;
				return fieldValues.addValue(el,value);
			}
			case 'radio':
			{											//get all radio group tags
				var tags = document.getElementsByName(el.name || el.id || '');		
				if (el.name && tags.length > 1)			//fall thru to checkbox if single button
				{										
					for (var i=0; i<tags.length; i++)
					{
						if (!tags[i].checked) continue;
						value = EZ.getTagValue(tags[i]);
						if (value !== '')				//return value if defined...
							return fieldValues.addValue(el, value.isTrueFalseValue());
		
						var id = tags[i].id;
						if (id && id != name)			//...return id if diff from name
							return fieldValues.addValue(el, id);
														//...return parent label text if any
						var label = EZ.getParent(tags[i], 'label');	//see EZ.getAncestor()
						if (!EZ.isNone(label))
							return fieldValues.addValue(el, EZ.trim(label.innerText).isTrueFalseValue());
		
						return fieldValues.addValue(el, '');		//no value, id or label text found for checked button
					}
					return fieldValues.addValue(el, '');			//no button checked
				}
			}
			/* jshint ignore:start*/	//FALL-thru
			case 'checkbox':
			/* jshint ignore:end */
			{
				value = EZ.getTagValue(el);
				if (value !== '')
					return fieldValues.addValue(el, el.checked ? value : '');
				else
					return fieldValues.addValue(el, el.checked);
			}
			/* jshint ignore:start*/	//FALL-thru
			case 'select':
			/* jshint ignore:end */
			{							
				/*DCO 01-03-2017
				return (el.selectedIndex == -1) ? fieldValues.addValue(el, '')
					 : (typeof(EZ.getFieldValue) == 'function') ? fieldValues.addValue(el, EZ.getFieldValue(el))
					 : fieldValues.addValue(el, el.options[el.selectedIndex].value || el.options[el.selectedIndex].text);
				*/
				//DCO 01-03-2017: only change from above is set: EZ.get.fn, EZ.get.value, EZ.get.text 
				EZ.get.fn = 'EZgetValue';
				if (el.selectedIndex == -1) 
					value = EZ.get.value = EZ.get.text = '';
				else
				{							//use EZ.getFieldValue() if avail and el.selectedIndex >= 0
					EZ.get.value = el.options[el.selectedIndex].value;
					EZ.get.text = el.options[el.selectedIndex].text;
					if (typeof(EZ.getFieldValue) == 'function') 
					{
						EZ.get.fn = 'EZgetFieldValue';
						value = EZ.getFieldValue(el);
					}
					else value = EZ.get.value || EZ.get.text;
				}
				return fieldValues.addValue(el, value);
			}
			/* jshint ignore:start*/	//FALL-thru
			default:
			/* jshint ignore:end */
			{				//return innerHTML if defined
				if (el.innerHTML != EZ.undefined)
					return fieldValues.addValue(el, value);
			}
		}
	});
	return (EZ.isArray(el)) ? fieldValues : fieldValues.getValue();
}
/*---------------------------------------------------------------------------------------------
set element value -- cloned from EASY.js beta:

set and for convenience return value

if form field, set field value otherwise set el.innerHTML

TODO: defaultValue may not be complete
	  consolidate, merge or sync with EZset(), EZval() and EZset_basic()

select/ text field -- .replace(/(\r\n|\n|\r)/g, EZ.constant.EOL);
	var type = /input/i.test(el.tagName || '') 
				? el.type 				//use tag.type for input tag
				: el.tagName || '';		//otherwise tagName if defined
	switch (type.toLowerCase())
---------------------------------------------------------------------------------------------*/
EZ.setValue = window.EZsetValue = function EZsetValue(el, value, defaultValue)
{
	var fieldValues = new EZ.fieldValues(el, defaultValue);
	fieldValues.tagList.forEach(function(el)
	{
		var tagName = (el.tagName || '').toLowerCase();
		var name = el.name || el.id || '';

		EZ.wasValue = '';

		value = (value !== undefined) ? value		//value, defaultValue or blank
			  : (defaultValue !==  undefined) ? defaultValue
			  : '';											
		var isValueTrueLike = EZisTrueLike(value);
		var isValueFalseLike = EZisFalseLike(value);
		
		/*03-23-2017: EZisTrueLike('true') returns false 
		//			  but was not problem with with checkbox
		//			  below does not work if value is Array
		var isValueTrueLike = value.isTrueLike();
		var isValueFalseLike = value.isFalseLike();
		*/
		
		var type = EZgetTagType(el);
		switch (type)
		{
			case 'textarea':
			case 'text':
			case 'password':
			case 'hidden':	
			{
				EZ.wasValue = el.value;
				return fieldValues.addValue(el, el.value = value.toString());
			}
			case 'img':
			case 'image':
			{		
				if (value === '')					//update src if value blank
					return fieldValues.addValue(el, el.src = value.toString());
				return fieldValues.addValue(el, el.value = value.toString());
			}
			case 'radio':					
			{										//get all radio group tags
				var tags = document.getElementsByName(el.name || el.id || '');		
				if (el.name && tags.length > 1)		//fall thru to checkbox if not radio group
				{									//length=1 is possible forgot when
					value = value.toString();
					var trueLikeButton = '';
					var falseLikeButton = '';
					var idButton = '';
					var blankButton = '';
					var labelEqualsButton = '';
					var labelContainsButton = '';
					var labelTrueLikeButton = '';
					var labelFalseLikeButton = '';

					for (var i=0; i<tags.length; i++)
					{
						var buttonValue = EZ.getTagValue(tags[i]);
						if (value !== '' && buttonValue.toLowerCase() === value.toLowerCase())
						{
							tags[i].checked = true;
							return fieldValues.addValue(el, EZ.getValue(name));		//return if matching value found
						}

						if (value === '')
						{
							if (blankButton === '')
								blankButton == tags[i];
						}
						if (EZisTrueLike(buttonValue))
						{									//button value is trueLike...
							if (!isValueTrueLike)
								tags[i].checked = false;	//...uncheck if value not trueLike
							if (!trueLikeButton)
								trueLikeButton = tags[i];	//...remember if 1st trueLike button
						}
						if (EZisFalseLike(buttonValue))
						{									//button value is falseLike...
							if (!isValueFalseLike)
								tags[i].checked = false;	//...uncheck if value not falseLike
							if (!falseLikeButton)
								falseLikeButton = tags[i];	//...remember if 1st falseLike button
						}

						var id = tags[i].id;
						if (value !== '' && id && id !== name && id === value)
							idButton = tags[i];				//non-blank value matches id diff from name

						while (true) 						//id has priority over label text so...
						{									//...only test label parent (not for="id")
							//var label = EZgetParent(tags[i], 'label');	//see EZ.getAncestor()
							var label = EZ.getAncestor(tags[i], 'label');	//see EZ.getAncestor()
							if (!EZ.is(label)) break;

							var labelText = EZ.trim(label.innerText).toLowerCase();
							if (labelText === '') break;

							if (!labelEqualsButton && labelText === value.toLowerCase())
								labelEqualsButton = tags[i];

							if (!labelContainsButton && labelText.indexOf(value.toLowerCase()) != -1)
								labelContainsButton = tags[i];

							if (!labelTrueLikeButton && EZisTrueLike(labelText))
								labelTrueLikeButton = tags[i];

							if (!labelFalseLikeButton && EZisFalseLike(labelText))
								labelFalseLikeButton = tags[i];

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

					return fieldValues.addValue(el, EZ.getValue(name));
				}
			}
			/* jshint ignore:start*/	//FALL-thru
			case 'checkbox':
			/* jshint ignore:end */
			{
				value = value.toString();
				var elValue = EZ.getTagValue(el);
				EZ.wasValue = !el.checked ? ''
							: elValue === '' ? true
							: elValue;
															//...check if value matches checkbox value
				if (elValue.toLowerCase() === value.toLowerCase() 
				&& (value !== '' || type != 'checkbox'))	//03-23-2017: probably applicable for radio

					el.checked = true;
															//...check if value trueLike & checkbox trueLike or blank
				else if ((elValue === '' 
				|| !elValue.isFalseLike())  && value.isTrueLike())
					el.checked = true;
															//...otherwise uncheck
				else
					el.checked = false;

				return fieldValues.addValue(el, EZ.getValue(el));
			}
			/* jshint ignore:start*/	//FALL-thru
			case 'select':
			/* jshint ignore:end */
			//__________________________________________________________________________________________________
			/*
			 *	12-27-2016: added basic support for select-multiple -- did not analyize what happenes
			 *				when no option value matches any of specified values.
			**/
			{				
				EZ.wasValue = [];
				var isSelectOne = (el.type == 'select-one');
				var isSelectMultiple = (el.type == 'select-multiple');
				
				var selectValues = (value instanceof Array) ? value
								 : (typeof(value) != 'string') ? [value]		//TODO

								 : (value == '|') ? ['']
								 : (value.includes('|')) ? value.split('|')
								 : [value];

				var textIndex = [];
				for (var i=0; i<el.options.length; i++)
				{
					if (el.options[i].checked)
						EZ.wasValue.push(el.options[i].value)
																  //-----------------------------\\
					if (!isSelectMultiple)						 //----- select-one or radio -----\\
					{											//---------------------------------\\
						if (el.options[i].value == value)
						{
							el.options[i].selected = true;
							if (isSelectOne) break;
						}
						else if (el.options[i].text == value)
							textIndex.push(i);
					}											
					else										  //-------------------------\\
					{											 //----- select-multiple -----\\
						//el.selectedIndex = -1;
						selectValues.some(function(value)		//-----------------------------\\
						{
							if (el.options[i].value == value)
							{
								el.options[i].selected = true;
								return true;
							}
							else if (el.options[i].text == value)
							{
								textIndex.push(i);
							}
						});
					}
				}
				EZ.wasValue = EZ.wasValue.join('|');
				
				if (i == el.options.length)
					textIndex.some(function(i)
					{ 
						el.options[i].selected = true;
						if (isSelectOne) 
							return fieldValues.addValue(el, true);
					});
				if (el.selectedIndex != -1 && window.EZselectScroll) 
					EZselectScroll(el,i)				//scroll into view

				return fieldValues.addValue(el, EZ.getValue(el));
			}
			/* jshint ignore:start*/	//FALL-thru
			default:
			/* jshint ignore:end */
			{				
				while (tagName && tagName != 'input')
				{										//TODO: 1st empty innerHTML
					if (el.innerHTML != EZ.undefined)
					{									//return innerHTML if defined
						EZ.wasValue = el.innerHTML;
						
						if (typeof(value) == 'string' && value.trim().substr(0,1) != '<')
						{
							value = EZ.getStyle(el, 'white-space').includes('pre')
								  ?  value.replace(/\n/g, '<br>')
								  :  value.replace(/<br.*?>/g, '\n')
						}
						return fieldValues.addValue(el, el.innerHTML = value);		
					}
				}
			}
		}
	});
	return (EZ.isArray(el)) ? fieldValues : fieldValues.getValue();
}
/*-----------------------------------------------------------------------------------
EZnone([selector(s)) -- return pseudo HTML element object

EZ() variant return null if no elements found -OR- 

Used to create

Custom toString() and valueOf() functions return "" and false respectfully ...BUT...

	if (!EZnone()) IS true*
	if (!EZnone() == false) -and- if (!EZnone() === false) work just fine!!!

	EZ.isFalse(EZnone()) / EZ.isFalse(EZnone()) return false or true as expected.
	
ARGUMENTS:
	settings	1st arg if EZgetEl_settings
	selectors	
	isUnique	1st arg if true -- create new EZnone element created
				TODO: currently creates new shared EZnone

RETURNS:
	new or existing EZnone
	
*JavaScript spec requires "if (Expression)..." or similar conditional be evaluated
 as true when the expression is an Object ... dating back to the beginning of time.
-----------------------------------------------------------------------------------*/
EZ.none = function EZnone(/* [settings | selectors | isUnique] */)
{
	var args = [].slice.call(arguments);
	if (!args.length) args.push('');	
	
	var settings = EZ.is(args[0],EZ.getEl.settings) ? args.shift() : '';
	var isUnique = settings ? '.uniqueEZnone'.ov(settings) : args.shift();
	var isOops = isUnique !== false;
	
	var selectors = EZ.toArray('.selectors'.ov(settings, 'unknown'));
//	var item = EZ.collapse(selectors);		//1st selector
 
	if (!EZ.none) EZ.none = {}
	if (!EZ.none.nextId) EZ.none.nextId = 0;
	
	if (!EZ.noneTags)		// create pseudo parent for EZnone tags
	{
		EZ.noneTags = document.getElementById('EZnone');
		if (!EZ.noneTags)
		{
			EZ.noneTags = EZnone_createElement('pre');
			EZ.noneTags.setAttribute('id', 'EZnone');
		}
		var textNode = document.createTextNode('...');
		EZ.noneTags.appendChild(textNode);
		EZ.noneTags.style.fontFamily = 'monospace';
		isUnique = true;
	}
	
	var node = EZ.noneTags.lastChild;
	if (isUnique || EZ.noneTags.childNodes.length === 0)
	{									//create new pseudo node returned
		var id = '';
		var name = '';
		node = EZnone_createElement('select');
		node.setAttribute('id', id);
		node.setAttribute('name', name);
		
		node.style.width = '0px';		//fastselect loses attributes and styles
		node.style.height = '0px';
 		node.style.border = '0px';
		node.style.margin = '0px';
		node.style.padding = '0px';
 		node.style.display = 'none';
 		if (EZ.field && EZ.field.data)
			node.EZfield = EZ.field.data.fieldList[''];
		node.valueOf = function() 
		{
///			console.log('valueOf()'); 
			return null;
		}
		node.toString = function() 
		{
///			console.log('toString'); return this.textContent;
		}
		EZ.noneTags.appendChild(node);
		
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
		
		node.checked = false;
		EZ.bindElements(node);
	}	

	//----- Save selectors and stackTrace that created EZnone
	if (isOops && 'EZ.beep.options.EZnone'.ov())
		EZ.oops('EZnone selectors', selectors);
		
//	var e, msg = '';
//	try
//	{
//	///	undefined['EZnone'];
//	}
//	catch (e)
//	{			
//		var ee;
//		try
//		{
//			var stack = (e.stack+'').formatStack(1);
//			var calledFrom = stack[1];
//			stack[0] = selectors. join(', ');	//replace msg
//			var logStack = stack.slice();					//full stack for log
//			
//			//for html text: drop all but last EZ (and anounymous functions ??)
//			stack.splice(0,0,'-'.dup(50));
//			stack[2] = '-'.dup(50) + '@@@';
//			
//			var fromIdx = 3;
//			var lastEZ = '';
//			while (/(at |\.)(EZ)/.test(stack[fromIdx]) 
//			&& stack[fromIdx].indexOf('.test') == -1)
//				lastEZ = stack.splice(fromIdx,1);
//			stack[fromIdx] = '...' + stack[fromIdx].trim() + '...'
//			if (lastEZ)
//				stack.splice(fromIdx,0,lastEZ[0]);	//put last one back
//				
//	///		console.log({'EZnone for selector':selectors+'', 'in':calledFrom, 'stacktrace':logStack});		
//			
//			var msg = stack.join('\n');
//			EZ.noneTagsReferences = EZcollapseMessages(EZ.noneTagsReferences, calledFrom, msg);
//			msg = EZcollapseMessages(EZ.noneTagsReferences);
//			
//			msg = msg.replace(/@.*?@:\s*/g, '');
//			msg = msg.replace(/,\s*----[\s\S]*@@@/g, ',\n').replace(/@@@/g, '');
//			msg = msg.replace(/x (\d*)/g, '-- $1 TIMES');
//			
//			EZ.noneTags.firstChild.textContent = '\nSELECTORS NOT FOUND . . .\n' + msg; 
//		}
//		catch (ee)
//		{
//			EZ.techSupport(ee);
//		}
//	}
	//======================
	return node;
	//======================
	/**
	 *
	 */	
	function EZnone_createElement(tagName)
	{	
		var node = document.createElement(tagName);
		node.undefined = true;
		node.className = 'EZnone';
		return node;
	}
}
//_________________________________________________________________________________________________
e = function _____CLASS_FUNCTIONS_____() {}	//convenience for DW functions list
//_________________________________________________________________________________________________

/*-----------------------------------------------------------------------------
Implements: EZ.addClass() EZ.removeClass() EZ.hasClass()
-----------------------------------------------------------------------------*/
EZ.classAction = function EZclassAction(field, className, action /* add | remove | has */)
{	
	var el = (EZ.getConstructorName(field) == 'EZfield') ? field.el : field;
	
	var isLegacy = EZ.isLegacy()
	if (isLegacy)
	{
		if (!el) return false;
		if (!/(add|remove|has)/.test(action || '')) return false;
	}
	else
	{
		if (el == null)
			return '';
		el = EZ(el,true).remove();	//EZ.removeDups(true)
		if (!el || !el.length || el[0].undefined
		|| !/(add|remove|has)/.test(action || '')) 
			return '';
	}
	var allClassNames = [];
	
	// if className not Array, create from comma or space delimited String
	var	classNames = EZ.toArray(className, ' ').remove();
	if (!classNames.length) return '';
	
	// for all specified el(s) (if el not Array, create) . . .
	var status = EZ.toArray(el, ', ').remove().some(function(el)
	{
		if (!el || el.className === undefined) return false;	//continue
		
		// create classArray from el.className
		var	classArray = EZ.toArray(el.className, ' ').remove();
		if (action == 'has' && !classArray.length)				
			return false;	
		
		// for all specified classNames . . .
		var status = classNames.some(function(className)
		{
			if (typeof(className) != 'string')
				return false;				//continue if invalid className
				
			if (action == 'has')			//quit if match otherwise continue
				return classArray.indexOf(className) != -1;
		
			//-------------------------------------------------------------------
			if (isLegacy)					//above if never true
			{
				var regex = RegExp('(^| )' + className + '( |$)');
				className = action == 'remove' ? '' 
						  : ' ' + className;
			
				// remove prior className -- then add className for "add" action
				el.className = (el.className.replace(regex, '') + className).trim();
			}								//end of legacy
			//-------------------------------------------------------------------
			else
			{
				var timer = className.split('=');		//class=ssss
				if (timer.length == 2)
				{
					className = timer[0];
					timer = timer[1];
					var field = EZ.field(el, true);
					if (field.timer)
						clearTimeout(field.timer);
					field.timer = setTimeout(function(){EZ.removeClass(el,className)}, timer);
				}
				else timer = '';
				
				var isFound = classArray.length > 0 && classArray.includes(className);
				if (action == 'has') 
					return isFound;						//quits some loop if true
					
				else if (action == 'add' && !isFound)	
				{	
					classArray.push(className);
					//if (timer)
					//	setTimeout(function(){EZ.removeClass(el,className)}, timer);
				}
				else if (action == 'remove' && isFound)		
					classArray = classArray.remove(className);
			
				allClassNames = allClassNames.concat(classArray);	//TODO: too many -- use classArray ??
				
				if (el.EZfield)
					el.EZfield.setClassName(classArray);
				else										//TODO: why not??
					el.className = classArray.join(' ');	//update this el className
			}
		});
		return status;
	});
	if (isLegacy || action == 'has') 
		return status;						//return true/false for legacy or has
	
	if ([].removeDups)
		allClassNames = allClassNames.removeDups();
	
	//======================
	return allClassNames.join(' '); 		//return className(s) for all elements
	//======================
}
/*-----------------------------------------------------------------------------
for each specified el(s) ADD specified className(s)

legacy EZaddClass() in EZ.core.js
-----------------------------------------------------------------------------*/
EZ.addClass = function EZaddClass(el, className, isTrueFalse)
{
	if (EZ.test.capture()) {return EZ.test.capture(this)} else if (EZ.test.debug()) debugger;

	isTrueFalse = arguments.length <= 2 || isTrueFalse;
	var action = isTrueFalse ? 'add' : 'remove';
	
	return EZ.classAction(el, className, action);
}
//_____________________________________________________________________________________________
EZ.addClass.test = function()
{
	var arg='', el='', obj=null, 
		ctx = 'na', ex = 'na', fn = null, note = '';
	e = [obj];
	
	fn = function validateResults(results, testrun)
	{
		testrun.results = el.className;		//set results to updated classname attribute
		//return ex;	//optionally return expected
	}
	function setup(current, add, want)
	{
		el = document.createElement('div');
		el.className = current;
		note = 'current: ' + current
			 + '\n\nadd arg: ' + add;
		arg = add;
		ex = want || current;
		EZ.test.results({ex:ex, fn:fn, ctx:ctx, note:note})
	}
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	setup('', 'classB', 'classB')
	EZ.test.run(el, arg)
	
	setup('A', 'B', 'A B')
	EZ.test.run(el, arg)
	
	setup('A B', 'B', 'A B')
	EZ.test.run(el, arg)
	
	setup('A B', 'B', 'A B')
	EZ.test.run(el, arg, false)
	
	setup('highlight scroll scrollWidth scrollHeight', 'scrollWidth')
	EZ.test.run(el, arg, false)
	//______________________________________________________________________________
	return //endtest
}
/*-----------------------------------------------------------------------------
return true if any specified el has any specified class
-----------------------------------------------------------------------------*/
EZ.hasClass = function EZhasClass(el, className) 
{ 
	return EZ.classAction(el, className, 'has');
}
EZ.hasAnyClass = function EZhasAnyClass(el, className)	//backward compatibility
{
	return EZ.classAction(el, className, 'has');
}
/*-----------------------------------------------------------------------------
for each specified el(s) remove specified className(s)
-----------------------------------------------------------------------------*/
EZ.removeClass = function EZremoveClass(el, className,isTrueFalse)
{
	if (/(hidden)/.test(className))		//research
		void(0);

	isTrueFalse = arguments.length <= 2 || isTrueFalse;
	var action = isTrueFalse ? 'remove' : 'add';
	EZ.classAction(el, className, action);
}
/*--------------------------------------------------------------------------------------------------
for all specified el(s) toggle each specified className(s)

Similar function EZ.core.js::EZtoggleClass(el,className)

RETURNS:
	String of all updated classNames of all specified elements with duplicates removed.
	(easily facilitates search fo partial names)
--------------------------------------------------------------------------------------------------*/
EZ.toggleClass = function EZtoggleClass(el, className)
{
	if (!el || !className) return '';
	var	classNames = EZ.toArray(className, ' ').removeDups(true);
	if (classNames.length === 0) return '';
	
	var updatedClassNames = '';
	//var selectors = EZ.toArray(el, ',').removeDups(true)
	EZ(el, true).forEach(function(el)
	{
		classNames.forEach(function(className)
		{
			var action = EZ.hasClass(el, className) ? 'remove' : 'add';
			EZ.classAction(el, className, action);
			updatedClassNames += ' ' + el.className;
		});
	});
	classNames = EZ.toArray(updatedClassNames, ' ').remove().removeDups();
	return classNames.join(' ').trim();
}
//_____________________________________________________________________________________________
EZ.classAction.test = function()
{
	var el, ex, note;
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	// invalid argument tests -- for valid data, see: add/has/remove/toggle 
	ex = ''
	
	note = 'invalid element'
	EZ.test.results({ex:ex, note:note})
	EZ.test.run(undefined)

	EZ.test.results({ex:ex, note:note})
	EZ.test.run(null)

	EZ.test.results({ex:ex, note:note})
	EZ.test.run('')

	EZ.test.results({ex:ex, note:note})
	EZ.test.run(document)

	EZ.test.results({ex:ex, note:note})
	EZ.test.run({})

	EZ.test.results({ex:ex, note:note})
	EZ.test.run([])

	EZ.test.results({ex:ex, note:note})
	EZ.test.run(EZ.none())

	EZ.test.results({ex:ex, note:note})
	EZ.test.run(document)

	EZ.test.results({ex:ex, note:note})
	EZ.test.run(document.documentElement)

	note = 'element good -- invalid className'
	el = document.createElement('div');
	
	EZ.test.results({ex:ex, note:note})
	EZ.test.run(el,undefined)
	
	EZ.test.results({ex:ex, note:note})
	EZ.test.run(el,null)
	
	EZ.test.results({ex:ex, note:note})
	EZ.test.run(el,{})
	
	EZ.test.results({ex:ex, note:note})
	EZ.test.run(el,[])
	
	EZ.test.results({ex:ex, note:note})
	EZ.test.run(el,'')

	note = 'element / class good -- invalid action'
	
	EZ.test.results({ex:ex, note:note})
	EZ.test.run(el,'myclass',undefined)
	
	EZ.test.results({ex:ex, note:note})
	EZ.test.run(el,'myclass',null)
	
	EZ.test.results({ex:ex, note:note})
	EZ.test.run(el,'myclass',{})
	
	EZ.test.results({ex:ex, note:note})
	EZ.test.run(el,'myclass',[])
	
	EZ.test.results({ex:ex, note:note})
	EZ.test.run(el,'myclass','')
	
	EZ.test.results({ex:ex, note:note})
	EZ.test.run(el,'myclass','bad')

	//______________________________________________________________________________
	return //endtest
}


/*--------------------------------------------------------------------------------------------------
EZ.field(...)	
creates EZfield Object(s) for one or more html elements with properties and functions defined below.

_____EZfield_____ structured so EZfieldData and EZfield properties are shown immediatele below.

TODO:
	EZ.field should call EZ.field.add() to create field if not defined already and return single 
	field or Array similar to EZ().
	
	refactor EZ.field.get() to return existing field(s) only and not called indirectly by EZ.field().

PROMPT for EMPTY FIELD
			if (title)
				EZ.el.className = '';
			else 
			{
				EZ.el.value = EZ.el.getAttribute('alt');
				EZ.el.className = 'dim';
			}
                        	alt="-enter title-" style="margin:0 0 1px 1px;width:100%"
                            onFocus="if (this.value==this.getAttribute('alt')) {this.value='';this.className=''}"
                            onBlur="if (!this.value) {this.value=this.getAttribute('alt');this.className='dim'}"

--------------------------------------------------------------------------------------------------*/
EZ.field = (function _____EZfield_____()
{
	EZ.defaultOptions.field = {
		elements: null,					//elements added if Object specified
		clearvalue: '',					//="[]" to clear design value matching: /^\s*\[.*\]\s*/
		version: '09-05-2016'
	}
	var _init = function()
	{
		EZ.field.options = EZ.options(EZ.defaultOptions.field);
	}
	function EZfieldData()
	{
		this.fieldList = {};			//list of EZfield objects for unique names (key: name)
		this.elementList = [];			//Array of elements 
		this.nameList = [];				//Array of names associated with elementList items 
		this.idMap = {};				//maps non-blank id to name when diff from name
		this.tagList = {all:[]};		//pruned outerHTML associated with elementList
										//sub-list for each tagType
//		this.tagTypeList = {};
//		this.eventList = { all:[], "onclick": [], outerHTML:[] };

		this.groups = {};				//map of all el in each group e.g. radio groups 
		this.groupsList = {};			//list of el outerHTML in each group
		this.noNameList = [];			//outerHTML of tags with no name or id
		this.noDefaultList = [];		//outerHTML of tags with unknown default
	
		this.popupList = [];
		this.tooltipList = [];
		this.messageList = [];
	}
	//______________________________________________________________________________________________
	/**
	 *
	 */
	function EZfield(el, value, defaultValue, work)	
	{												//treat as get if not called as constructor		
		var data = EZ.field.data;					//existing EZfieldData Object
		if (!data)									 
		{											//create if not found
			data = EZ.field.data = new EZfieldData();																	
			EZ.field.add(EZnone(false), null);		//add pseudo field
		}
		if ( !(this instanceof arguments.callee) ) 	//treat as get() if not called as constructor
			return EZ.field.get.call(data, el, value, defaultValue);
		
		/*---------------------------------------------------------------------------------------
		//	called as constructor by EZ.field.add() -- new EZ.field(el, value, defaultValue, work)
		---------------------------------------------------------------------------------------*/
		var tagValues = EZfield_setup(el);
		if (!tagValues) return data.fieldList[''];
		
		var value = tagValues.value || '';
		
		if (work.options.clearvalue == '[]' && /^\s*\[.*\]\s*/.test(value))
			value = EZ.set(el, '');
		if (work.options.elements instanceof Object && el.id)
		{
			if (el.id in work.options.elements && el != work.options.elements[el.id])
				EZ.oops('existing elements property not overwritten:' + el.id, el);
			else
				work.options.elements[el.id] = el;
		}
		el.EZfield = this;
		this.idx = data.nameList.length;
		this.custom = {};
		this.changed = false;						//,,,ditto...
		this.outerHTML = tagValues.outerHTML;
		this.value = value; 						//up-to-date currently NOT guarenteed
		this.lastValue = tagValues.value;			//updated by setChaned() or isChanged()
		this.selectedValue = '';					//onChangeSelectMultipleEZ() updates
		this.id = (el.id || '');
		this.name = tagValues.name;
		this.tagType = tagValues.tagType;
		this.defaultValue = tagValues.defaultValue;	//should not change
		this.defaultListOptions = (this.tagType.startsWith('select') ? [].slice.call(el.options) : '');
		this.count = 1;								//number of tags with same name
		this.el = el;
		this._arrive = {};
		this._leave = {};

		this.onNoChange = /\bonNoChange\b/i.test(el.className);
													//superceeds above
		this.EZonchange = el.getAttribute('data-EZonchange') || el.getAttribute('data-ezonChange')
							//|| (/\bonNoChange\b/i.test(el.className) ? false : true);
		
		var attr = this.attributes = {};			//initial attribute values
		var style = this.style = {};				//initial style values
		
		[].forEach.call(EZ.dom.attributes, function(key)
		{											//get initial attributes
			var value = el.getAttribute(key);
			if (value == null) return;
			attr[key] = value;
		});
		if (this.tagType == 'select')				//keep select options as pseudo attribute
		{
			attr.options = [].slice.call(el.options);
			attr.options.values = EZ.get([].slice.call(el.options));
			/*
			attr.options.titles = [];
			attr.options.values.forEach(function(value, idx)
			{					
				if (value.startsWith('-'))
				attr.options.titles[idx] = value.substr(1);
			});
			*/
		}
		Object.keys(el.style).forEach(function(key)
		{											//get initial styles
			if (!isNaN(key)) return;
			var value = el.style[key];
			if (value == null) return;
			style[key] = value;
		});
		//____________________________________________________________________
		this.getInitialAttribute = function getInitialAttribute(name)
		{
			return this.attributes[name] || '';
		}
		//____________________________________________________________________
		this.resetInitialAttribute = function _resetInitialAttribute(name)
		{
			if (!isNaN(name) || typeof(name) != 'string')
				return EZ.oops('invalid attribute name: ' + name, name).message;

			if (name != 'options')
				this.el.setAttribute(name, this.getInitialAttribute(name));
			else
			{
				this.updateSelections('clear');		//EZfield.onChangeSelectMultiple
				EZ.displayDropdown(this.el, this.defaultListOptions, this.value);
			}
		}
		//____________________________________________________________________
		this.getInitialStyle = function _getInitialStyle(name)
		{
			return this.attributes[name] || '';
		}
		//____________________________________________________________________
		this.resetInitialStyle = function _resetInitialStyle(name)
		{
			if (!isNaN(name) || typeof(name) != 'string')
				return EZ.oops('invalid style name: ' + name, name).message;

			var value = this.getInitialStyle(name);
			this.el.style[name] = value;
		}
		//____________________________________________________________________
		EZfield.prototype.hasEvent = function hasEvent(name)
		{
			return '.'.concat(name).ov(this.eventList);
		}
		//____________________________________________________________________
		EZfield.prototype.addEvent = function addEvent(name, callback)
		{
			this.eventList = this.eventList || [];
			this.eventList[name] = '';
			EZ.event.add(this.el, name, callback);
		}
		//_________________________________________________________________________________________
		/**
		 *	return all non-title options 
		**/
		EZfield.prototype.getAllOptions = function getAllOptions()
		{
			var allOptions = [];
			for (var i=0; i<this.el.options.length; i++)
				if (!this.el.options[i].value.startsWith('*'))
					allOptions.push(this.el.options[i]);
			return allOptions;
		}
		//_________________________________________________________________________________________
		/**
		 *	TODO:
		 *		text: Array of slected options text
		**/
		EZfield.prototype.getAllSelectedOptions = function getAllSelectedOptions()
		{
			var allSelected = [];
			var allOptions = this.getAllOptions(); 
			for (var i=0; i<allOptions.length; i++)
				if (allOptions[i].selected)
					allSelected.push(allOptions[i]);
			return allSelected;
		}
		//_________________________________________________________________________________________
		/**
		 *		
		**/
		EZfield.prototype.setSelected = function setSelected(values)
		{
			var el = this.el;
			if (el.tagName != 'SELECT')
				return this.setValue(values);
			
			el.selectedIndex = -1;
			values = EZ.toArray(values || [], '|');
			this.getAllOptions().forEach(function(opt)
			{
				opt.selected = values.includes(opt.value);					
			});
			this.updateSelections();	//resets selections if EZonchange select-multiple
			return this.getSelected();
		}
		//_________________________________________________________________________________________
		/**
		 *	returns Array of selected values WITH the following named properties:
		 *		
		 *		value: true, false, number, joined values if select-multiple
		**/
		EZfield.prototype.getSelected = function getSelected()
		{
			var selections = [];						//base Array
			var unselected = selections.unselected = [];
			var allOptions = this.getAllOptions();
			allOptions.forEach(function(opt)
			{
				if (opt.selected)
					selections.push(opt.value);
				else
					unselected.push(opt.value);
			});
			selections.value = selections.join('|');
			selections.total = allOptions.length;
			selections.checked = selections.selected = (selections.length === 0) ? false
													 : (selections.length === selections.total) ? true
													 : 'some';

			selections.selectedIndex = (this.selectedIndex !== undefined) ? this.selectedIndex
									 									  : this.el.selectedIndex
			selections.selectedValue = this.selectedValue || '';
			return selections;
		}
		//_________________________________________________________________________________________
		/**
		 *	returns true if all list options selected, false if none or "some" if not all 
		**/
		EZfield.prototype.isAnyOptionSelected = function isAnyOptionSelected()
		{
			var allSelected = this.getAllSelectedOptions();
			if (allSelected.length === 0)
				return false;
			
			if (allSelected.length === this.getAllOptions().length)
				return true;
				
			return 'some';
		}
		//____________________________________________________________________
		this.getListOption = EZ.field.getListOption.bind(data, this);
		this.isChanged = EZ.field.isChanged.bind(data, this);
		this.setChanged = EZ.field.setChanged.bind(data, this);
		this.setClassName = EZ.field.setClassName.bind(data, this);
		this.update = EZ.field.update.bind(data, this);
		//____________________________________________________________________
													//build initial classList
		EZ.field.setClassName.call(this, this, el.className);
													  //------------------------------------\\
													 //----- update EZfieldData{} lists -----\\
		data.fieldList[tagValues.name] = this;		//----------------------------------------\\
		if (el.undefined) 						
		{											//fake pseudo field
			this.idx = -1;
			data.idMap[''] = -1;
			data.nameList[-1] = '';
			data.elementList[-1] = this;
			this.name = '-EZnone-';					//some logic may need??
			return;									//bail no other lists updated
		}
		EZfield_lists(data, el, this.name, this.tagType, this.outerHTML);
		_setupEvents(el, this);			
		
		work.added.push(name + '\t ' + this.value + '\t ' + this.defaultValue);
		work.fields.push(this);
		return this;

		//______________________________________________________________________________________________
		/**
		 *	update elementList, nameList, tagList and idMap -- does not update fieldMap or groups
		 */
		function EZfield_lists(data, el, name, tagType, outerHTML)
		{
			//var data = this;
			data.elementList.push(el);					//update lists and maps
			var idx = data.nameList.push(name);
			data.idMap[el.id] = idx;					//update idMap if id != name
			
			data.tagList.all.push(outerHTML);			//update tagList and tagType list
			data.tagList[tagType] = data.tagList[tagType] || [];
			data.tagList[tagType].push(el);
		}
		//______________________________________________________________________________________________
		/**
		 *
		 */
		function EZfield_setup(el)
		{
			var name = (el.name || el.id);
			
			var tagType = el.type || el.tagName || '';
			if (el.length) 								//html collection -- should not be possible here
				tagType = el[0].type || tagType;		//e.g. radio group
		
			var outerHTML = JSON.stringify(el, ['tagName', 'type', 'name', 'id', 'class']).replace(/"/g,'');
			var outerHTMLquoted = outerHTML;
			el.outerHTML.replace(/\s*(<[\s\S]*?>)[\s\S]*/, function(all,html)
			{
				if (el.undefined) 
					html = 'EZnone';
				outerHTMLquoted = html.replace(/\n/g, ' ');
				//outerHTML = outerHTMLquoted.replace(/"/g, '');
			});

			if (!name)									//if no name 
			{										
				if (data.elementList.includes(el))
				{
					work.existing.push(outerHTML);
					return false;
				}
				if (!el.undefined)
				{
					name = '_EZname_' + data.elementList.length;
					work.noName.push(name + ':' + outerHTML);
				}
				else if (data.fieldList['']) 			//if not 1st EZnone, bail
					return false;
			}
			
			var nameIdx = data.nameList.indexOf(name)	  //----------------------------------\\
			if (nameIdx != -1)							 // create group if dup name / diff el \\
			{											//--------------------------------------\\
				if (data.idMap[el.id]
				|| data.elementList[nameIdx] == el)
				{	
					work.existing.push(outerHTML);
					return false;
				}
				if (!data.groups[name])					//if group not found, create group
				{										//using nameIdx el as 1st member
					data.groups[name] = [data.elementList[nameIdx]];
					data.groupsList[name] = [data.fieldList[name].outerHTML];
				}
													
				var field = data.fieldList[name]; 		//get 1st member EZfield object
				field.count++;							//bump member count
				
				el.EZfield = field;
				EZfield_lists(data, el, name, tagType, outerHTML);
				_setupEvents(el, field);
				
				data.groups[name].push(el);				//add el as next group member
				data.groupsList[name].push(outerHTML);
				return false;
			}
				
			if (el.undefined) 							//pseudo field
				value = defaultValue = '';
			else
			{
				if (value != null)			
				{
					value = defaultValue || value;
					defaultValue = EZ.get(el);
					EZ.set(el, value);
		
					if (tagType == 'checkbox' && defaultValue === '')
						defaultValue = false;
				}
				else
				{
					value = EZ.get(el, true)			//TODO: why true?
					if (/^\[.*\]$/.test(value.trim()))
						value = EZ.set(el,'');
					defaultValue = value;
				}
		
				if (el.autocomplete != 'off' && tagType != 'hidden' && !tagType.startsWith('select'))
				{
					var attr = EZ.getAttributes(outerHTMLquoted);
					if (!attr.value)
					{
						defaultValue = undefined;
						data.noDefaultList.push(outerHTML);
					}
				}
			}
			//======================================================
			return {
				name: name, 
				tagType: tagType, 
				value: value, 
				defaultValue: defaultValue, 
				outerHTML:outerHTML
			}
			//======================================================
		}
		
		//______________________________________________________________________________________________
		/**
		 *	_setupEvents()
		 *
		 *	 1. Adds event handlers to all form field tags to track when the field value is changed by 
		 *		mouse click or keyboard entry.  The onChange() event is fired when leaving text fields
		 *		without making a change or when clicking on an existing option of a select field.
		 */
		function _setupEvents(el, field)
		{												//onclick on hidden alway run onload else...
			[EZfield_onArrive, EZfield_onLeave]
			
			var onChangeOpts = field.EZonchange = EZ.options.call(field.EZonchange || {});
			if (onChangeOpts.set)
				el.addEventListener('change', EZ.field.onChangeSet.bind(field));

			field.updateSelections = function()	{}		//for non-onChangeSelectMultiple
			
			switch (field.tagType)
			{
				/*03-06-2017: uncommented _setupEvents() call in EZfield() -- commented out below
				
				case 'text': 	
				case 'textarea': 	
				case 'password': 	
				{
					if (!el.onblur)
						el.onblur = EZfield_onArrive;
					if (!el.onfocus)
						el.onfocus = EZfield_onLeave;
					break;
				}
				case 'select-one':				
				case 'radio':
				{	
					if (!el.onmousedown)
						el.onmousedown = EZfield_onArrive;
					if (!el.onmouseup)
						el.onmouseup = EZfield_onLeave;
					break;
				}	
				*/
				case 'select-one':
				{
					break;
				}
				case 'select-multiple':
				{
					if (field.EZonchange)
					{									//convert to EZoptions object and bind
						field.EZonchange = EZ.options.call(field.EZonchange);
						
						el.onclick = EZ.field.onChangeSelectMultiple.bind(field, null);
						field.updateSelections = EZ.field.onChangeSelectMultiple.bind(field);
						
						field.onChange = el.onchange;
						el.onchange = null;
					}
				}

			}	
		}
		//__________________________________________________________________________________________________
		/**
		 *	called onFocus() for text / textarea fields or mouseDown() for SELECT fields.
		 *	Saves copy of current field value for EZfield_onLeave() processing.
		 */
		function EZfield_onArrive(evt)
		{
			var el = evt.srcElement;
			
			var EZ = window.EZ;
			var tagName = el.tagName.toLowerCase();
			if (tagName == 'option')
				el = el.parentElement;
			
			var field = el.EZfield || window.EZ.field(el);
			if (!field)
				return EZ.oops('EZfield not found', el);
			
			window.EZ.log.call('EZfieldevent', 'onArrive(' + evt.type + ')', field.outerHTML, '\n\t', evt);

			field._arrive.tagName = tagName;
			
			var value;
			switch (field.tagType)
			{
				case 'text': 	
				case 'textarea': 	
				case 'password': 	
				case 'hidden': 	
				case 'button': 	
				{
					value = el.value;
					break;
				}
				case 'image': 	
				{
					value = el.src;
					break;
				}	
				case 'radio':
				{	
					value = EZ.get(field.name);
					field._arrive.checked = el.checked;
					break;
				}
				case 'select-one':
			//	case 'select-multiple':
				{									
					var size = field._arrive.size = el.size || 0;
					if (size <= 1)					//1st mouseUp is still arrive for dropdown
						field._leave.ignore = true;	//2nd mouseUp is selection	
					else
					field._arrive.selectedIndex = el.selectedIndex;
					value = EZ.get(el);
					break;
				}
				default:
				{
					value = EZ.get(el);
				}
			}	
			field._arrive.value = value;
		}
		//__________________________________________________________________________________________________
		/**
		 *	called onBlur() for text / textarea fields or mouseUp() for SELECT fields.
		 *	if field value changed, sets isChanged=true, lastValue=value and value to current value.
		 *	calls fields onChange() handler if value did NOT change.
		 */
		function EZfield_onLeave(evt)
		{
			var el = evt.srcElement;
			var tagName = el.tagName.toLowerCase();
			if (tagName == 'option')
				el = el.parentElement;

			var field = el.EZfield || window.EZ.field(el);
			if (!field)
				return EZ.oops('EZfield not found', el);
			
			window.EZ.log.call('EZfieldevent', 'onLeave(' + evt.type + ')', field.outerHTML, '\n\t', evt);
			
			field._leave.tagName = tagName;
			if (field._leave.ignore)
			{
				field._leave.ignore = false;
				return true;
			}
			//______________________________________________________________________________________________
			/**
			 *	trigger nochange event if defined and value not changed
			 */
			var _triggerNoChange = function(value)
			{
				var evtName = (value != field._arrive.value) ? ''
							: (el.onnochange) ? 'onnochange'
							: (el.onchange && field.onNoChange) ? 'onchange'
							: ''
				if (evtName)
				{
					field._leave.value = value;
					//console.log('EZfield_onLeave: fire pseudo onChange because field value did not change')
					window.EZ.log.call('EZfieldpseudo', evtName + ' fired because field value did not change');
					EZ.event.trigger(el, evtName);
				}
			}
			//==============================================================================================
			var EZ = window.EZ;
			var rtnValue = null;
			
			var value	//, selectedIndex;
			switch (field.tagType)
			{
				case 'text': 	
				case 'textarea': 	
				case 'password': 	
				case 'hidden': 	
				{
					value = el.value;
					if (field.onNoChange && value != field._arrive.value)
						_triggerNoChange(value);
					break;
				}
				case 'hidden': 	
				case 'button': 	
				case 'image': 	
				{
					return true;
				}
				case 'radio': 					//could fake onChange
				{								//assume checked if mouseEvent but
					el.checked = true;			//checked not set before MouseUp
					value = field.value = EZ.get(el);
					field.setChanged(!field._arrive.checked);
					break;
				}
				case 'checkbox': 	
				{	
					value = EZ.get(el);
					break;
				}	
				case 'select-one':
				case 'select-multiple':
				{	
					value = EZ.get(el);
					if (field.onNoChange && value != field._arrive.value)
						_triggerNoChange(value);
					break;
				}	
				default:
				{
					return true;
				}
			}	
			
			field._leave.value = value;
			if (field._leave.value != field._arrive.value)
			{
				field.setChanged(true);					//updates field.value
			}
			return rtnValue;
		}
	}
	//______________________________________________________________________________________________
	/**
	 *
	 */
	EZfield.prototype.add = function EZfield_add(selector, value, defaultValue, depth)
	{
		var data = EZ.field.data = (EZ.field.data || EZ.field());
		/**
		 *
		 */
		var quit = function()
		{
			if (depth > 0) return;
			
			//nogo: takes forever and does not return anything meaningful
			//work.added = work.added.sort().format();
			data.log = work;
			
			data.noDefaultList = data.noDefaultList.concat(work.noDefault);
			data.noNameList = data.noNameList.concat(work.noName);
			
			var rtnValue = /(Element|String)/.test(selectorType) ? work.fields
						 : work.added[0] || data.fieldList[''];
			
			delete work.fields;
			delete work.options;
			return rtnValue;
		}
		//============================================================================================	
		var el, value, tags, options = value;
		var work = {				//started as log but morphed into work / rtnValue
		
			fields: [],				//EZfield Object associated with all specified elements
			added: [],				//added fields
			events: [],				//event run on setup -- has class: load=onClick
			noName: [],				//elements with no id or name
			noDefault: [],			//unknown if no value and autocomplete != off
			
			notFound: [],			//field probably deleted or renamed
			existing: [],			//no problem just noted
			dupNames: [],			//beta
		//	radioSkip: [],			//work-in-process
		//	processed: []			//internal
		}
		if (depth) 
		{
			work = this;
			options = work.options;
		}
		else 
		{
			depth = 0;
			(value instanceof Object) ? value = null
									  : options = null;
			options = work.options = EZ.options(options, EZ.field.options);
		}
		
		var selectorType = EZ.getType(selector);		//TODO: update EZ.isEl
		if (selectorType.startsWith('HTML') && selectorType != 'HTMLCollection')
			selectorType = 'Element'
			
		switch (selectorType)						
		{
			case 'Element': 
			{
				el = selector;
				break;
			}
			case 'String': 							//only 1st match -- use Array for all
			{
				if (selector == '*')
				{
					options.all = true;
					tags = document.body.getElementsByTagName('*');
					//[].unshift.call(document.body);
					EZ.field.add.call(work, tags, null, null, depth+1);
					return quit();
				}
				el = document.getElementById(selector) || EZ(selector);
				if (el.undefined)
					work.notFound.push(selector);
				break;							
			}
			case 'HTMLCollection':					//multiple elements
			case 'NodeList': 						//e.g. radio group
			{
				[].forEach.call(selector, function(el)		
				{
					if (!el.tagName || /(script|option)/.test(el.tagName)) 
						return;
					if (options.all && !el.id) 
						return;
					var field = EZ.field.add.call(work, el, value, defaultValue, depth+1);
					field = field;
				});
				return quit();
			}
			case 'Array': 							//selector(s) if Array
			{
				tags = EZ(selector, true);
				[].forEach.call(tags, function(el)		
				{
					EZ.field.add.call(work, el, value, defaultValue, depth+1);
				});
				return quit();
			}
			case 'Object': 							//Object of element name/value pairs
			{										//e.g. saved values
				Object.keys(selector).forEach(function(id)		
				{								
					if (!id) return;
					var value = selector[id];
					EZ.field.add.call(work, id, value, defaultValue, depth+1);
				});
				return quit();
			}
			default:
			{
				return 	EZ.oops('unreconized selector type: ' + selectorType, arguments);
			}
		}
		//============================================================
		// new EZ.field(...) creates field and updates associated lists
		//============================================================
		var field = new EZ.field(el, value, defaultValue, work)
		field.toString = function()
		{
			return 'EZfield: ' + this.value;
		}
		return quit();
	}
	//______________________________________________________________________________________________
	/**
	 *	return EZfield objects(s) for selector(s)
	 */
	EZfield.prototype.get = function EZfield_get(selector, isCreate)
	{
		var data = EZ.field.data;
		
		if (!selector)									//if no selector, return EZfieldData
			return data;
		
		if (EZ.is(selector, EZ.field))					//if selector IS an EZfield Object, just return it
			return selector;						
		
		var idx, name, fieldList = [];						
		if (EZ.isEl(selector))							//if selector is element...
		{												//...check elementList for existing object
			idx = data.elementList.indexOf(selector);
			if (idx != -1)								//if element found in list...
			{											//...return associate field data
				name = data.nameList[idx];
				fieldList = [data.fieldList[name]];
			}											
			else if (isCreate)		 					//otherwise if create specified
			{											//create field(s) for selected tags
				fieldList = EZ.field.add(selector);
			}
		}
		else											//if selector not element...
		{												
			EZ.toArray(selector, ', ').forEach(function(selector)
			{											//for each selector . . .
				var fields = data.fieldList[selector] 	//check fieldList by name then id 
						  || data.fieldList[ 'data.idMap.'.concat(selector).ov({}).name ];
				
				if (!fields && isCreate)				//if EZfield not found and create requested
					fields = EZ.field.add(selector);	//create EZfield for tag(s) matching selector
				
				if (fields)								//append all EZfield Object(s) to list of fields
					fieldList = fieldList.concat( EZ.toArray(fields) );
			});
		}
		fieldList = EZ.isArray(selector) 				//if selector is Array...
				  ? EZ.toArray(fieldList) 				//...return Array of all associated fields
				  : fieldList[0];						//otherwise return 1st EZfield matching selector
		return fieldList;
	}
	//__________________________________________________________________________________________________
	/**
	 *
	 */
	EZfield.prototype.getLog = function EZfield_getLog()
	{
		var data = EZ.field();
		var log = EZ.clone(data.log);
		log.lists = {
			tags: data.tagList.all,
			ids: Object.keys(data.idMap),
			names: data.nameList.slice(),
			noNames: data.noNameList.slice(),
			noDefaults: data.noDefaultList.slice(),
		//	events: data.eventList.all
		};
		
		log.fields = {};									//create pruned clone of data.fieldList
		Object.keys(data.fieldList).forEach(function(name)
		{													//for each field
			var values = log.fields[name] = {};
			var field = data.fieldList[name];
			
			Object.keys(field).forEach(function(key)		//copy all non-Object properties
			{
				if (field[key] instanceof Object) return;
				values[key] = field[key];
			});
		})
	
		log.counts = {}										//counts object has length of all lists
		Object.keys(log.lists).forEach(function(key)
		{
			log.counts[key] = log.lists[key].length;
		})
		log.lists.idMap = EZ.clone(data.idMap);
		return log;
	}
	//__________________________________________________________________________________________________
	/**
	 *
	 */
	EZfield.prototype.getChangedValues = function EZfield_getChangedValues(include, exclude)
	{
		var values = {};
		var data = EZ.field();
		data.nameList.slice(0).forEach(function(name)
		{
			if (name.startsWith('_'))		//&& !include.includes('_')
				return;
			var field = EZ.field(name, null);
			
			var el = field.el;
			if (include && !EZ.hasClass(el, include)) return;
			if (exclude && EZ.hasClass(el, exclude)) return;
			
			var value = EZ.get(el);
			if (value == field.defaultValue) return;		
			values[name] = value;
		});
		return values;
	}
	//__________________________________________________________________________________________________
	/**
	 *
	 */
	EZfield.prototype.getDefaultValues = function EZfield_getDefaultValues(classNames)
	{
		classNames = EZ.toArray(classNames);
		var data = EZ.field();
		var fieldValues = {};
		Object.keys(data.fieldList).remove().forEach(function(key)
		{
			var field = data.fieldList[key];
	//		if (classNames.length && !field.classList.includesPlus(classNames)) return;
				
			fieldValues[field.id] = field.defaultValue;
		});
		return fieldValues;
	}
	//__________________________________________________________________________________________________
	/**
	 *
	 */
	EZfield.prototype.getValue = function getValue()
	{
		var field = this,
			el = field.el,
			value = EZ.get(el);
		
		return (el.type == "select-multiple") ? EZ.toArray(value, '|') : value;
	}
	//__________________________________________________________________________________________________
	/**
	 *	set field / tag value using EZ.set()
	 *	For select-multiple, Array values 1st joined with "|"
	 *	Current selections reset for EZ onChangeSelectMultiple fields.
	 */
	EZfield.prototype.setValue = function setValue(value)
	{
		var field = this, el = field.el;
		
		if (el.type == "select-multiple")
		{
			value = value || this.getValue()
			if (EZ.isArrayLike(value))
				value = [].join.call(value, '|');
			
			//el.selectedIndex = -1;		//clear existing values
		}
	
		field.value = EZ.set(el, value + '');
		field.updateSelections('selected');
			
		return field.value;
	}
	//__________________________________________________________________________________________________
	/**
	 *	copies changed value to all element specified by data-EZonchange="set=..." attribute on html tag.
	 *	onchange event is trigger for each element except this.el
	**/
	EZfield.prototype.onChangeSet = function onChangeSet()
	{
		var timer;
		var pending = EZ.field.setListPending;
		if (!pending)
		{
		 	pending = EZ.field.setListPending = [];
			timer = setTimeout('delete EZ.field.setListPending',1000);
		}
		else if (pending.includes(this.el))
			return;						//each field only changed once
			
		var selector = this.EZonchange.set;
		if (!selector) 
			return;
		
		var tags = EZ( EZ.toArray(selector), null);
		if (!tags) 
			return;

		var setList = this.EZonchange.setList = [];
		pending.push(this.el);		
		
		var value = EZ.get(this.el);
		tags.forEach(function(el)		//for all selector tags not processed
		{
			if (setList.includes(el) || pending.includes(el))
				return;
		
			setList.push(el)
			pending.push(el);
			
			EZ.set(el, value);
			EZ.event.trigger(el, 'change');
			/*
			var idx = pending.indexOf(el);
			if (idx != -1)
				pending.splice(idx,1);
			*/
		});
		/*
		var idx = pending.indexOf(this.el);
		if (idx != -1)
			pending.splice(idx,1);
		
		if (pending.length === 0)
		{
		*/
			delete EZ.field.setListPending;
			clearTimeout(timer);
		//}
	}
	//__________________________________________________________________________________________________
	/**
	 *	Eliminate need for CTR key to select multiple options for select-multiple by using 
	 *	onclick event to implement toggle functionality.  Click on selected option, unselects
	 *	BUT restores all prior selected options from prior selections.
	 *
	 *	After options populated, call as el.click('reset') to set or reset current selections.
	 *	 
	 *	if data-onchange="...focus=false..."
	 *		remove focus so all selected options displayed with gradiate BG defined by css.
	 *
	 *	hide or show clearAll or selectAll based on number of options selected	 
	 *
	 *	bound to select-multiple tag if data-onchange attribute not blank, "no" or "false"
	 *	base code from: EZtest_assistant_data.js::_setupIgnorePopup()
	 *
	 *	TODO:
	 *		support: Ctrl + click
	 *		selections should be Array of options or options indexes not values
	 */
	EZfield.onChangeSelectMultiple = function onChangeSelectMultipleEZ(action, opt)
	{
		//local variables and functions {
		// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
		var field = this, 
			el = field.el,
			evt = opt,
			value,
			selected,
			allValues,
			getAllValues = function()
			{
				if (allValues) return allValues;
				
				allValues = [];
				for (var i=0; i<el.options.length; i++)
				{
					value = el.options[i].value
					if (!value.startsWith('*'))
						allValues.push(value);
				}
				return allValues;
			},
			getUnselected = function()
			{
				var unselected = [];
				var allValues = getAllValues();
				for (var i=0; i<allValues.length; i++)
				{
					var opt = allValues[i];
					if (!opt.selected)
						unselected.push(opt);
				}
				return unselected;
			},
			selectedIndex = el.selectedIndex;		
		// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . }
		
		this.selectedValue = '';
		if (!this.selections)						
			this.selections = getAllValues();
													//----------------------------\\
		if (action !== null)						//called as updateSelections() \\
		{											//------------------------------\\
			var idx = opt;
			if (action == 'clear')
				this.selections = [];
			
			else if (action == 'reset')
				this.selections = [];
			
			else if (action == 'all')				//reset to all options
				this.selections = getAllValues();
													//reset to selected options		
			else if (action === undefined || action == 'selected')			
				this.selections = this.getValue();
													//add or remove selections
			else if (!isNaN(idx) && idx >= 0 || idx < el.options.length)
			{
				value = el.options[idx].value;
				selected = el.options[idx].selected;
				idx = this.selections.indexOf(value);
				if (action == 'remove' && idx != -1)
					this.selections.splice(idx,1)
				else if (action == 'add' && selected && idx == -1)
					this.selections.push(value)
			}
		}
		else									//----------------------------------\\
		{										//----- called by onclick event -----\\
			evt = evt || window.event;			//------------------------------------\\
			var ctrlKey = evt.ctrlKey
			
			value = '';
			if (selectedIndex != -1)				//unlikely ??
				value = this.selectedValue = el.options[selectedIndex].value
						
			if (value.startsWith('*'))				//if title option clicked
			{
				if (value.toLowerCase().includes('clear'))
				{									//nothing selected
					value = undefined;
					this.selected = [];				
					this.selections = [];
					el.selectedIndex = -1;
				}
				else if (value.toLowerCase().includes('all'))
				{									//all non-title options
					this.selected = getAllValues();								
					this.selections = getAllValues();
				}
			}
			else									//non-title option clicked
			{
				if (ctrlKey) 
					this.selectedIndex = (selectedIndex == -1) ? getUnselected()[0]
															   : this.selectedIndex;
				else
				{
					this.selectedIndex = (selectedIndex == -1) ? this.selectedIndex
															   : selectedIndex;
				}
				var idx = this.selections.indexOf(value);
				if (idx == -1)
					this.selections.push(value);
				else 
				{
					this.selections.splice(idx, 1);
					el.options[selectedIndex].selected = false;
				}
			}
			
			if (this.selections.length)				//restore selections if any
			{
				el.selectedIndex=-1;
				EZ.set(el, this.selections.join('|'));
			}
		}
													//---------------------------------\\
		var titleOptions = {};						//hide or show clearAll / selectAll \\
		if (this.selections.length === 0)			//-----------------------------------\\
		{
			this.selectedIndex = el.selectedIndex = -1;
			titleOptions = {clearAll:'none', selectAll:''};	
		}
		else
		{
			var nonTitleCount = getAllValues().length;
			if (this.selections.length < nonTitleCount)	
				titleOptions = {clearAll:'none', selectAll:''};	
			
			else if (this.selections.length >= nonTitleCount)	
				titleOptions = {clearAll:'', selectAll:'none'};	
			
			else
				titleOptions = {clearAll:'', selectAll:'none'};	
		}
		for (var key in titleOptions)				//if clearAll and/or selectAll option exists
		{
			var opt = this.getListOption('*' + key);
			if (opt)
				opt.style.display = titleOptions[key];
		}
		
		if (action === null)						//if NOT called as updateSelections()
		{
			if (this.EZonchange.focus === false)	
				el.blur();							//remove focus() so BG gradiant used for selected
				
			if (typeof(field.onChange) == 'function')
				field.onChange.call(el, evt);
			//	EZ.event.trigger(el, 'onchange');	//onchange fn if exists
		}
	}
	//__________________________________________________________________________________________________
	/**
	 *
	 */
	EZfield.prototype.getListOption = function getListOption(selector, value, text)
	{
		var field = selector instanceof EZ.field ? selector : EZ.field.get(selector);
		var el = field.el;
		
		var textOpt = '';
		if (!field.tagType.startsWith('select'))
			return {};
			
		var opts = [];
		for (var idx=0; idx<el.options.length; idx++)
		{
			var opt = el.options[idx];
			if (value instanceof Array)
			{
				if (value.includes(opt.value))
					opts.push(opt);
			}
			else if (opt.value == value)
				return opt;					//return opt if value matches
			
			if (text != null && opt.text == text)
				return opt;					//if non-null text specified, return if match
			
			if (text !== null && !textOpt && opt.text == (text || value))
				textOpt = opt;				//return if no value match value
		}
		if (value instanceof Array)
			return opts;
		return textOpt;
	}
	//__________________________________________________________________________________________________
	/**
	 *
	 */
	EZfield.prototype.getDefaultListOptions = function EZfield_getDefaultListOptions(classNames)
	{
		classNames = EZ.toArray(classNames);
		var data = this.data;
		var listOptions = {};
		Object.keys(data.fieldList).remove().forEach(function(key)
		{
			var field = data.fieldList[key];
//			if (classNames.length && !field.classList.includesPlus(classNames)) return;
				
			if (!field.tagType.startsWith('select'))
				return;
				
			listOptions[field.id] = field.defaultListOptions;
		});
		return listOptions;
	}
	//__________________________________________________________________________________________________
	/**
	 *	selector: item, el.id or el.name or element selector
	 */
	EZfield.prototype.isChanged = function EZfield_isChanged(selector, newChanged)
	{
		var field = EZ.is(selector, EZfield) ? selector : EZ.field.get(selector);
		
		var changed = field.changed;
	///	if (!changed)
		{
			var el = field.el;
			var value = EZ.get(el);
			changed = field.changed = (value != field.lastValue);
			field.value = value;
		}
		if (newChanged !== undefined)
			EZ.field.setChanged.call(field, selector, newChanged);
		
		return changed;
	}
	//__________________________________________________________________________________________________
	/**
	 *
	 */
	EZfield.prototype.update = function EZfield_update(selector, value, caller)
	{
		if (!caller)
			delete EZ.field.update.rtnValue;
		var rtnValue = EZ.field.update.rtnValue = EZ.field.update.rtnValue || 
		{
			updated:[], ignored:[], notfound:[]
		}

		if (EZ.is(this, EZ.field.data))						//update single EZfield value
		{													//called from EZ.set/get()
			var field = EZ.is(selector, EZfield) ? selector : EZ.field.get(selector);
			if (field.value === value)
			{
				if (!rtnValue.updated.includes(field.id))	//gets called multiple times -- not sure why
					rtnValue.ignored.push(field.id);
				else
					void(0);
			}
			else
			{
				field.lastValue = field.value;
				field.value = value;
				field.caller = caller || arguments.callee.caller.name;
				field.timestamp = new Date() + '';
				field.changed = true;
				EZ.field.update.rtnValue.updated.push(field.id);
			}
		}
		else if (selector instanceof Object)				//update multiple field values
		{
			for (var key in selector)						
			{
				var el = EZ(key, null);
				if (!el)
					EZ.field.update.rtnValue.notfound.push(key);
				else										
				{											//logged above when EZ.set() calls
					var field = EZ.field(el, true);
					if (field)
						EZ.set(field.el, selector[key]);						
				}
			}
		}
		else 
			EZ.oops('unrecognized arguments', arguments);
		
		EZ.field.update.rtnValue.message = EZ.oops.message || '';
		return EZ.field.update.rtnValue;
	}
	//__________________________________________________________________________________________________
	/**
	 *
	 */
	EZfield.prototype.setClassName = function EZfield_setClassName(selector, className)
	{
		var field = (this == selector) ? selector : EZ.field(selector);
		field.classList = EZ.toArray(className, ' ');
		field.className = field.el.className = field.classList.join(' ');
	}
	//__________________________________________________________________________________________________
	/**
	 *
	 */
	EZfield.prototype.setChanged = function EZfield_setChanged(selector, isChanged)
	{
		if (isChanged == null)
			return EZ.oops('isChanged value not specified');
		
		var field = EZ.is(selector, EZfield) ? selector : EZ.field.get(selector);
		
		if (isChanged && !field.changed)
			field.lastValue = field.value;
		
		else if (!isChanged && field.changed)
			field.lastValue = field.value;
		
		field.changed = Boolean(isChanged);
	}
	//__________________________________________________________________________________________________
	/**
	 *	EZ.field.toggleCheckbox(el, next, is3way)
	 *
	 *	Supports standard or 3way checkbox (e.g. unchecked --> grey checked --> checked)
	 *
	  for 3way checkbox: false --> some || some --> true  ||  true -- > false
	 *
	 *	checkbox processed as 3way if is3way argument is true or input tag has .EZcheckbox3way class.
	 *	If is3way argument is true, EZcheckbox3way class added to input tag if not found.
	 *
	 *	When called by click event (next argument is NOT true, false or 'some')
	 *		if checked is false, keep false; (should not have 'some' class -- removed if found)
	 *		if checked and has 'some' class (grey checked), remove .some class -- keep checked=true
	 *		if checked, does not have 'some' class AND is 3way checkbox...
	 *		...add 'some' class and change checked to false;
	 *
	 *		returns false if onClick event must be canceled to keep el.checked when changed
	 *				otherwise true if event must NOT be canceled to keep el.checked set by event
	 *
	 *	When called with next argument (true, false or 'some'), el is selector and next specifies
	 *	next state for all tags matching the selector. Matching tags may or may not be 3way unless
	 *	is3way argument is true.
	 *
	 *	For non-3way tag, checked=true when next is "some"
	 *
	 *	TODO:
	 *		only tested for use by EZ.todo() which does not have "All Checked" field.
	 */
	EZfield.prototype.toggleCheckbox = function EZfield_toggleCheckbox(el, next, is3way)
	{
		var field = EZ.field.get(el, true);					//get or create EZfield object
		el = field.el;
		
		is3way = is3way || field.classList.includes('EZcheckbox3way');
		if (!is3way && is3way != null)
			is3way = false;
		EZ.addClass(el, 'EZcheckbox3way', is3way);
	
		var checked = el.checked;
		if (/(true|false|some)/.test(next+''))
		{
			field.checked = is3way ? next				//next if 3way
								   : Boolean(next);		//else simply true or false
		}
		else
		{
			checked = !checked							//prior value
			field.checked = checked ? false				//next state always false when checked is true
						  : !is3way || EZ.hasClass(el,'some')
								? true					//next state true if not 3way or now some class
								: 'some'				//otherwise next state is some (checked set false)
		}
		el.checked = (field.checked === true);
		EZ.addClass(el, 'some', field.checked == 'some')
		return field.checked;
	}
	//__________________________________________________________________________________________________
	/**
	 *	recreates EZfield_Data object.
	 */
	EZfield.prototype.reset = function EZfield_reset()
	{
		delete EZ.field.data;
		EZfield();
	}
	//==================================================================================================
	
	///////////////////////////////////////////////////////////////////////////////////////////
	// usually works -- except ocassionally 1st time dropdown selected
	///////////////////////////////////////////////////////////////////////////////////////////
	window.addEventListener('keyup', function()	
	{
		if (event.key != 'Escape')
			return true;						//ignore if not escape
		
		//console.log('ESCAPE', event.target+'', event);
		
		var el = event.target;
		if (el.type && el.type == 'select-one')
			setTimeout(function() {el.blur()}, 500);
		
		return true;
	
	}, false);
	///////////////////////////////////////////////////////////////////////////////////////////

	/*	
	var fn = EZfield;
	for (var key in fn)
		EZfield[key] = fn[key];

	//fn.options = EZ.options(EZ.defaultOptions.field);
	*/
	Object.keys(EZfield.prototype).forEach(function(key)
	{														//export / expose prototype functions
		var fn = EZfield.prototype[key];
		if (typeof(fn) == 'function')
			EZfield[key] = fn;
	});
	
	EZ.event.add(window, 'onload', _init);
	return EZfield;
})();

/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.filePlus = (function _____EZfilePlus_____()
{
	EZ.defaultOptions.filePlus = {						//default options
		
		baseFolders: ['Configuration/'],
		domian: '',
		configPath: '',

		format: 'EZtoString',
		formatOptions: { 
			tostring: {timestamp: false},
			stringify:{spaces:4} 
		},
		
		fileDefaults: {								//	
			protocol: ':',
			host: '',
			port: '',
			drive: '',
			origin: '',
			url: '',
			
			folder: '',
			pathname: '',
			fullpathname: '',
			
			filename: '',
			extension: '',
			filenameonly: '',
			basefolderpath: '',
			basefoldername: '',
			subfolder: '',
			shortpathfilename: '',
			size: '',
			
			meta: '',
		//	json: '',
			contents: '',
			timestamp: '',
			version: '10-09-2016'
		},
		
		name: 'EZ.file.options',
		version: '08-21-2016'
	}
	
	//______________________________________________________________________________________________
	/**
	 *	EZfile constructor
	 */
	function EZfilePlus(folder, filename, options)				
	{
		if ( !(this instanceof arguments.callee) )	//not called as constructor
		{
			if (folder instanceof arguments.callee)
				return folder;						
			return new EZ.filePlus(folder, filename);
		}											
													  //-------------------------------\\
		if (!EZ.filePlus)								 //----- called as constructor -----\\ 
		{											//-----------------------------------\\
			this._ = {};							//if called by _init() for global Object...
			return this;							//...create EZ.file._ and return
		}
		
		var file = this;							//otherwise create new EZfile Object for specific file
		if (!filename || filename instanceof Object)
		{
			options = filename;
			filename = folder;
			folder = '';
		}
		options = EZ.options.call(EZ.filePlus.options, options);
		for (var key in options.fileDefaults)
			if (options.fileDefaults.hasOwnProperty(key))
				file[key] = options.fileDefaults[key];
			else 
				EZ.oops();
		
		filename = (filename || '').toString().replace(/\\/g, '/');
		
		var pathTest = folder + filename;
		if (pathTest 
		&& !/C[:|]/.test(pathTest)
		&& !pathTest.includes(EZ.constant.configPath))
			folder = EZ.constant.configPath + folder;
		
		//folder = (folder || options.configPath).toString().replace(/\\/g, '/');
		folder = folder.replace(/\\/g, '/');
		
		if (folder && !folder.endsWith('/'))
			folder += '/';
		//if (!filename.includes('/'))
			filename = folder + filename;
		
		if (!filename)
			return
			
															//TODO: ??
		var url =  filename.includes(options.domain) ? filename : EZ.filePlus.urlFromFile(filename) || '' ;
		if (!url)
			EZ.oops('EZ.file.urlFromFile failed: ' + filename, arguments);
					
		file.url = url;
		file.pathfilename = EZ.filePlus.urlToFile(url) || 'unknown';
					
		var regex = /\s*(\w*):(\/{1,3})([\w\d]*)?(:\d*|\|)?(.*\/)(.*(\..*)|.*)?/;
				//	/.*?(.*\/)(.*?(\..*|$))/;
		
		//		http://localhost:8080/Users/[filename[.js]]
		//		C:/Users...
		//		file///C|Users/...
		var results = file.pathfilename.replace(regex, 
		function(all, protocol, slashes, host, port, folder, filename, extension)
		{										
			file.protocol = protocol + ':';
			file.host = host;
			file.port = port;
			file.drive = slashes == '/' ? file.protocol		// + ':'
					   : slashes == '///' ? file.host  + ':'
					   : '';
			if (!file.drive)
				file.origin = file.protocol + '//' + file.host 
							+ (file.protocol) ? ':' + file.protocol : '';
			else 
			{
				file.protocol = 'file:';
				if (slashes == '/')
					folder = file.host + folder;
			//	folder = file.drive + ':/'
				file.host = '';
				file.port = '';
				file.origin = '';
			}
			
			file.folder = folder.trimPlus('/') + '/';		//full folder slash sufix but no slash prefix
			file.pathname = '/' + folder.trimPlus('/') + '/' + filename;
															//TODO: ??
			file.fullpathname = file.drive + file.pathname;
			
			file.filename = file.filenameonly = filename;	//with extension and . prefix
			file.extension = extension;						//with dot prefix
			if (file.extension)
				file.filenameonly = filename.clip(extension.length);

			return '';
		});
		if (results) 
			EZ.oops('pathfilename parse failed: ' + file.pathfilename, arguments);
		
		file.basefolderpath = '';
		file.basefoldername = '';							//strip largest base folder
		file.subfolder = folder;
		EZ.filePlus.options.baseFolders.forEach(function(folder)
		{
			folder = folder.replace(/\\/g, '/').trimPlus('/');
			var regex = RegExp("(.*/" + folder + "/)(.*)");
			file.folder.replace(regex, function(all, basefolder, subfolder)
			{
				if (subfolder.length > file.subfolder.length) return;
				file.basefoldername = folder.match(/(.*\/)?(.*)/)[2];		
				file.basefolderpath = basefolder;		
				file.subfolder = subfolder;		
			});
		});
		file.shortpathfilename = '.../' + file.basefoldername + '/' + file.subfolder + file.filename;
		if (window.DWfile)
		{
			file.size = DWfile.getSize(url);
			file.timestamp = (file.size) ? EZ.formatDate(DWfile.getModificationDate(url)) : '';
		}
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZfilePlus.prototype.toString = function()
	{
		var str = this.name + ':'
				+ '...';
		return str;
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZfilePlus.prototype.getModificationDate = function EZfile_getModificationDate(url)
	{
		var file = EZ.filePlus(url);
		return DWfile.getModificationDate(file.url);
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZfilePlus.prototype.read = function EZfile_read(url)
	{
		var file = EZ.file(url);
		var contents = DWfile.read(file.url);
		if ('contents' in file)
			file.contents = contents;
		
		var json = (contents || '').trim();			//clean json if not blank
		var meta = file.meta = {};					//
													// remove leading comment and variable name
		if (contents)								// variable name = to end of line
		{											//             keep /or/
			var pattern = /^(var )?(\s*([\w.]*?)\s*=)?\s*([{[])(.*)([\s\S]*)/;
			json = json.replace(pattern, function(all, prefix, group, objName, start, comment, end)
			{
				meta.prefix = prefix;
				meta.objName = objName;
				meta.comment = comment;
				return start + end;
			});
		}
		if (json.startsWith('{') && json.endsWith('}'))
			meta.type = 'Object';
				
		else if (json.startsWith('[') && json.endsWith(']'))
			meta.type = 'Array';
		else
		{
			meta.type = '';
			if ('json' in file)
				file.json = json;
		}
		return contents;
	}
	//__________________________________________________________________________________________________
	/**
	 *	return Array or Object from json if valid otherwise empty string
	 *	if url is file Object, additional properties are avcailable: e.g. file.json, file.value and
	 *		file.data: {...}
	 */
	EZfilePlus.prototype.read.object = function EZfile_read_object(url)
	{
		var file = EZ.file(url);
		var json = EZ.file.read(file.url);	
		if ('json' in file)
			file.json = json;
		
		var value = '';
		try
		{
			if (json)
				eval('value=' + json);
		}
		catch (e) {}
		return value;		
	}
	//__________________________________________________________________________________________________
	/**
	 *	use or create EZ.file.info to read json -- then return EZoptions from json if valid json 
	 *	otherwise return defaultOptions if supplied or empty EZoptions()
	 *	
	 */
	EZfilePlus.prototype.read.options = function EZfile_read_options(filename, folder, defaultOptions)
	{
		if (/(Object|EZoptions)/.test(EZ.getType(filename)))
		{
			defaultOptions = filename;
			filename = '';
			folder = '';
		}
		else if (/(Object|EZoptions)/.test(EZ.getType(folder)))
		{
			defaultOptions = folder;
			folder = '';
		}
		var obj = EZ.options(defaultOptions, {});
		var file = EZ.file( (folder || obj.folder), (filename || obj.filename) );
		
		try
		{
			while (file.size)
			{	
				var json = DWfile.read(file.url);
				if (!json)
					break;
				
				json = json.trim();
				if (json.trim() == '{}' || !json.startsWith('{'))
					break;
					
				var savedObj = eval('savedObj=' + json);
				//savedObj.file = file;
				return EZ.options(savedObj, defaultOptions);
			}
		}
		catch (e) {}
		return obj;
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZfilePlus.prototype.write = function EZfile_write(url, value, timestampTag, errorMsgTag)
	{
		var file = EZ.file(url);
		
		var prunedObj;
		var json = value;
		var timestampKey = null;
		var timestamp = EZ.formatDate();
		if (value instanceof Object)
		{
			var keys = '.savedKeys ._savedKeys .extract ._extract';
			var extract = keys.ov(value) || [];
			extract = EZ.toArray(extract, ', ').remove(keys.replace(/\./g, '').split(/\s+/));
			
			timestampKey = ('timestamp' in value) ? 'timestamp'
						 : ('_timestamp' in value) ? '_timestamp'
						 : '';
			if (timestampKey)
				extract.push(timestampKey);
			
			prunedObj = {};
			Object.keys(value).forEach(function(key)
			{
				var type = EZ.getType(value[key])
				if ((extract.length && !extract.includes(key)) || type == 'Function')
					return;
				prunedObj[key] = value[key];
			});
			json = EZ.stringify(prunedObj);
			if ('json' in file)
			{
				json = EZ.stringify(prunedObj);
				if (file.json == json)
					return true;
			
				file.json = json;
			}
			if (timestampKey)
				prunedObj.timestampKey = timestamp;
			json = EZ.stringify(prunedObj);
		}
		
		if (EZ.file.options.nosave) 					//bail if save suspended
		{
		//	var detail = document.createElement('detail');
		//	detail.innerHTML = EZ.stringify(prunedObj);
			EZ.oops('save suspended [file:' + file.filename + ']', prunedObj);
		}	
		else if (!DWfile.write(file.url, json))
		{
			var tag = (errorMsgTag || timestampTag);
			if (tag)
				EZ.displayMessage('Technical Difficulty writing file: ' + file.url, tag);
			return false
		}
		file.size = value.length;
		file.timestamp = timestamp;
		if (timestampTag)
			EZ.set(timestampTag, EZ.formatTime());
		return file;
	}
	/*---------------------------------------------------------------------------------------------
	---------------------------------------------------------------------------------------------*/
	EZfilePlus.prototype.urlToFile = function EZfile_urlToFile(url)
	{
		return url.replace(new RegExp(EZ.file.options.domain), EZ.file.options.configPath);
	}
	/*---------------------------------------------------------------------------------------------
	---------------------------------------------------------------------------------------------*/
	EZfilePlus.prototype.urlFromFile = function EZfile_urlFromFile(pathfilename)
	{
		return pathfilename.replace(new RegExp(EZ.filePlus.options.configPath), EZ.file.options.domain);
	}
	
	/*---------------------------------------------------------------------------------------------
	---------------------------------------------------------------------------------------------*/
	var _init = function()
	{
		var fn = new EZfilePlus();
		for (var key in fn)
			EZfilePlus[key] = fn[key];
			
		EZ.event.add(window, 'onload', function()	//_init() initialize options plus...
		{
			var _ = EZ.filePlus._;
			var options = _.options = EZ.filePlus.options = EZ.options(EZ.defaultOptions.filePlus);
			for (var key in options._defaults)
				_[key] = options._defaults[key];

			var options = EZ.filePlus.options = EZ.options(EZ.defaultOptions.filePlus);
			options.configPath = 'EZ.constant.configPath'.ov("C:/Users/Dell/AppData/Roaming/Adobe/Dreamweaver CC 2014.1/en_US/Configuration/");
			options.domain = 'EZ.simulator.domain'.ov('http://localhost:8080/revize/dw.Configuration/');

			//options.baseFolders.push(EZ.constant.configPath);
			var testdataFolder = 'EZ.test.config.testdataFolder'.ov();
			if (testdataFolder)
				options.baseFolders.push(testdataFolder);	
		});
		return EZfilePlus;
	}
	//==================================================================================================
	return _init();
})();
//________________________________________________________________________________________
/**
 *	
 */
EZ.filePlus.test = function()
{	
	var msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, , rtnValue];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	var folder, filename;

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
	folder = "C:/Users/Dell/AppData/Roaming/Adobe/Dreamweaver CC 2014.1/en_US/Configuration/Shared/EZ/testdata/js/EZbasic.js/history"
	filename = "EZ.getType.RESULTS.SAVED.2016-10-09 @ 02_09_45.js"
	EZ.test.run( folder, filename )
	
	
	
	folder = "C:/Users/Dell/AppData/Roaming/Adobe/Dreamweaver CC 2014.1/en_US/Configuration/Shared/EZ/testdata/js/EZbasic.js"
	filename = "EZ.options.TODO.js"
	EZ.test.run( folder, filename )
	EZ.test.run( folder + '/' + filename )
	
}

/*--------------------------------------------------------------------------------------------------
EZ.file()

Created for EZtodo to eliminate redundant logic to save/load objects/options and validate,
avoid write of un-modified files, display error message or timestamp plus...

ARGUMENTS:

RETURNS:

REFEERENCE:
TODO:
	smarter or more generic base folder settings / processing
	add code for href / hash -- and test all parsing -- after EZtest Assistant polished
	assumed syntax:	file///C|folder ...not sure if slash after |
	just got working enough fo EZtodo system
--------------------------------------------------------------------------------------------------*/
EZ.file = (function _____EZfile_____()
{
	EZ.defaultOptions.file = {						//default options
		
		baseFolders: ['Configuration/'],

		format: 'EZtoString',
		formatOptions: { 
			tostring: {timestamp: false},
			stringify:{spaces:4} 
		},
		
		//defaults: {String:'script', Element:'sourceTag'},
		
		name: 'EZ.file.options',
		version: '08-21-2016'
	}
	
	function EZfile(filename, folder)				//EZfile constructor
	{
		if (this instanceof arguments.callee)
		{								
			return;
		}
		return EZ.file.info = EZfile_info(filename, folder);	//not called as constructor
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZfile.prototype.toString = function()
	{
		var str = this.name + ':'
				+ '...';
		return str;
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	var _init = function()
	{
		var options = EZ.file.options = EZ.options(EZ.defaultOptions.file);
		options.configPath = 'EZ.constant.configPath'.ov("C:/Users/Dell/AppData/Roaming/Adobe/Dreamweaver CC 2014.1/en_US/Configuration/");
		options.domain = 'EZ.simulator.domain'.ov('http://localhost:8080/revize/dw.Configuration/');
				
		//options.baseFolders.push(EZ.constant.configPath);
		var testdataFolder = 'EZ.test.config.testdataFolder'.ov();
		if (testdataFolder)
			options.baseFolders.push(testdataFolder);	
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	function EZfile_info(folder, filename)
	{
		var options = EZ.file.options;
		var file = folder;
		if (this instanceof arguments.callee)
		{
			file = this;
			file.name = arguments.callee.name;

			if (!filename)
			{
				filename = folder;
				folder = '';
			}
			
			filename = (filename || '').toString().replace(/\\/g, '/');
			if (folder && folder.substr(0,1) != '/')
				folder = EZ.constant.configPath + folder;

			
			folder = (folder || options.configPath).toString().replace(/\\/g, '/');
			
			if (!folder.endsWith('/'))
				folder += '/';
			if (!filename.includes('/'))
				filename = folder + filename;
			
			var url =  filename.includes(options.domain) ? filename : EZ.file.urlFromFile(filename) || '';
			if (!url)
				EZ.oops('EZ.file.urlFromFile failed: ' + filename, arguments);
						
			file.url = url;
			file.pathfilename = EZ.file.urlToFile(url) || 'unknown';
						
			var regex = /\s*(\w*):(\/{1,3})([\w\d]*)?(:\d*|\|)?(.*\/)(.*(\..*)|.*)?/;
					//	/.*?(.*\/)(.*?(\..*|$))/;
			
			//		http://localhost:8080/Users/[filename[.js]]
			//		C:/Users...
			//		file///C|Users/...
			var results = file.pathfilename.replace(regex, 
			function(all, protocol, slashes, host, port, folder, filename, extension)
			{										
				file.protocol = protocol + ':';
				file.host = host;
				file.port = port;
				file.drive = slashes == '/' ? file.protocol + ':'
						   : slashes == '///' ? file.host  + ':'
						   : '';
				if (!file.drive)
					file.origin = file.protocol + '//' + file.host 
								+ (file.protocol) ? ':' + file.protocol : '';
				else 
				{
					file.protocol = 'file:';
					if (slashes == '/')
						folder = file.host + folder;
				//	folder = file.drive + ':/'
					file.host = host;
					file.port = port;
					file.origin = '';
				}
				
				file.folder = folder.trimPlus('/') + '/';	//full folder slash sufix but no slash prefix
				file.pathname = '/' + folder.trimPlus('/') + '/' + filename;
	file.fullpathname = file.drive + file.pathname;
				
				file.filename = file.filenameonly = filename;					//with extension and . prefix
				file.extension = extension;					//with dot prefix
				if (file.extension)
					file.filenameonly = filename.clip(extension.length);

				return '';
			});
			if (results) 
				EZ.oops('pathfilename parse failed: ' + file.pathfilename, arguments);
			
			file.basefolderpath = '';
			file.basefoldername = '';							//strip largest base folder
			file.subfolder = folder;
			EZ.file.options.baseFolders.forEach(function(folder)
			{
				folder = folder.replace(/\\/g, '/').trimPlus('/');
				var regex = RegExp("(.*/" + folder + "/)(.*)");
				file.folder.replace(regex, function(all, basefolder, subfolder)
				{
					if (subfolder.length > file.subfolder.length) return;
					file.basefoldername = folder.match(/(.*\/)?(.*)/)[2];		
					file.basefolderpath = basefolder;		
					file.subfolder = subfolder;		
				});
			});
			file.shortpathfilename = '.../' + file.basefoldername + '/' + file.subfolder + file.filename;
			if (window.DWfile)
			{
				file.size = DWfile.getSize(url);
				file.timestamp = (file.size) ? EZ.formatDate(DWfile.getModificationDate(url)) : '';
			}
			return file;
		}
																  //-----------------------------------\\
		switch (EZ.getType(file))								 //----- not called as constructor -----\\
		{														//---------------------------------------\\
			case 'Function':
			case 'Object': 	
			case 'EZfile_info':
			{													//if already EZfile object return it
				if (EZ.is(file, EZ.file.info)
				||EZ.getConstructorName(file) == 'EZfile_info' 
				|| file.name == 'EZfile_info')
					return file;
					
				filename = '.filename ._filename'.ov(file, '');
				folder = '.folder ._folder'.ov(folder, folder);
				break;
			}
			case 'String': 
				break;
			
			case 'Null': 
			case 'Undefined': 
			case 'Boolean': 
			case 'NaN': 
			case 'Number':
			case 'Date':
			case 'RegExp':
			case 'Array': 	
			/* jshint ignore:start*/	//FALL-thru
			default:
			/* jshint ignore:end */
				filename = folder = '';
		}
		file = new EZfile_info(filename, folder);
		EZ.trace(file);
		return 	file;
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZfile.prototype.getModificationDate = function EZfile_getModificationDate(file)
	{
		var url = EZ.file(file);
		return DWfile.getModificationDate(url)		
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZfile.prototype.read = function EZfile_read(url)
	{
		var file = EZ.file.info = EZ.file(url);
		var value = DWfile.read(file.url);
		
		var json = (file.value || '').trim();	//clean json if not blank
		var data = EZ.file.data = {};			// remove............and.......
		if (value)								// [var/obj name] =] { [ [...$]
		{										//             keep /or/
			var pattern = /^(var )?(\s*([\w.]*?)\s*=)?\s*([{[])(.*)([\s\S]*)/;
			json = json.replace(pattern, function(all, prefix, group, objName, start, comment, end)
			{
				data.prefix = prefix;
				data.objName = objName;
				data.comment = comment;
				return start + end;
			});
		}
		if (json.startsWith('{') && json.endsWith('}'))
			data.type = 'Object';
				
		else if (json.startsWith('[') && json.endsWith(']'))
			data.type = 'Array';
		else
		{
			data.type = '';
		//	file.json = '';
		}
		return value;
	}
	//__________________________________________________________________________________________________
	/**
	 *	return Array or Object from json if valid otherwise empty string
	 *	if url is file Object, additional properties are avcailable: e.g. file.json, file.value and
	 *		file.data: {...}
	 */
	EZfile.prototype.read.object = function EZfile_read_object(url)
	{
		var file = EZ.file.info = EZ.file(url);
		var json = EZ.file.read(file);	
		
		var value = '';
		try
		{
			if (json)
				eval('value=' + json);
		}
		catch (e) {}
		return value;		
	}
	//__________________________________________________________________________________________________
	/**
	 *	use or create EZ.file.info to read json -- then return EZoptions from json if valid json 
	 *	otherwise return defaultOptions if supplied or empty EZoptions()
	 *	
	 */
	EZfile.prototype.read.options = function EZfile_read_object(filename, folder, defaultOptions)
	{
		if (/(Object|EZoptions)/.test(EZ.getType(filename)))
		{
			defaultOptions = filename;
			filename = '';
			folder = '';
		}
		else if (/(Object|EZoptions)/.test(EZ.getType(folder)))
		{
			defaultOptions = folder;
			folder = '';
		}
		var obj = EZ.options(defaultOptions, {});
		var file = EZ.file( (filename || obj.filename), (folder || obj.folder) );
		
		try
		{
			while (file.size)
			{	
				var json = DWfile.read(file.url);
				if (!json)
					break;
				
				json = json.trim();
				if (json.trim() == '{}' || !json.startsWith('{'))
					break;
					
				var savedObj = eval('savedObj=' + json);
				//savedObj.file = file;
				return EZ.options(savedObj, defaultOptions);
			}
		}
		catch (e) {}
		return obj;
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZfile.prototype.write = function EZfile_write(url, value, timestampTag, errorMsgTag)
	{
		var file = EZ.file(url);
		var prunedObj;
		var json = value;
		var timestampKey = null;
		var timestamp = EZ.formatDate();
		if (value instanceof Object)
		{
			var keys = '.savedKeys ._savedKeys .extract ._extract';
			var extract = keys.ov(value) || [];
			extract = EZ.toArray(extract, ', ').remove(keys.replace(/\./g, '').split(/\s+/));
			
			timestampKey = ('timestamp' in value) ? 'timestamp'
						 : ('_timestamp' in value) ? '_timestamp'
						 : '';
			if (timestampKey)
				extract.push(timestampKey);
			
			prunedObj = {};
			Object.keys(value).forEach(function(key)
			{
				var type = EZ.getType(value[key])
				if ((extract.length && !extract.includes(key)) || type == 'Function')
					return;
				prunedObj[key] = value[key];
			});
			json = EZ.stringify(prunedObj);
		}
		
		if (EZ.file.options.nosave) 					//bail if save suspended
		{
		//	var detail = document.createElement('detail');
		//	detail.innerHTML = EZ.stringify(prunedObj);
			EZ.oops('save suspended [file:' + file.filename + ']', prunedObj);
		}	
		else if (!DWfile.write(file.url, json))
		{
			var tag = (errorMsgTag || timestampTag);
			if (tag)
				EZ.displayMessage('Technical Difficulty writing file: ' + file.url, tag);
			return false
		}
		file.size = value.length;
		file.timestamp = timestamp;
		if (timestampTag)
			EZ.set(timestampTag, EZ.formatTime());
		return file;
	}
	/*---------------------------------------------------------------------------------------------
	---------------------------------------------------------------------------------------------*/
	EZfile.prototype.urlToFile = function EZfile_urlToFile(file)
	{
		return file.replace(new RegExp(EZ.options.configPath), EZ.file.options.domain);
	}
	/*---------------------------------------------------------------------------------------------
	---------------------------------------------------------------------------------------------*/
	EZfile.prototype.urlFromFile = function EZfile_urlFromFile(url)
	{
		return url.replace(new RegExp(EZ.file.options.domain), EZ.file.options.configPath);
	}
	//==================================================================================================
	var fn = new EZfile();
	for (var key in fn)
		EZfile[key] = fn[key];
		
	EZ.event.add(window, 'onload', _init);
	return EZfile;
})();
//________________________________________________________________________________________
/**
 *	
 */
EZ.file.test = function()
{	
	var msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, , rtnValue];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	var folder, filename;

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
	
	folder = "C:/Users/Dell/AppData/Roaming/Adobe/Dreamweaver CC 2014.1/en_US/Configuration/Shared/EZ/testdata/js/EZbasic.js"
	filename = "EZ.options.TODO.js"
	EZ.test.run( folder, filename )
	EZ.test.run( folder + '/' + filename )
	
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

TODO:
	EZ.popup.tooltip(): does not seem to get correct tags for EZtrace.html
--------------------------------------------------------------------------------------------------*/
EZ.popup = (function _____EZpopup_____()
{
	EZ.defaultOptions.popup = {					//default options
		tags: {
			close: {
				tagName: 'img',
				class: "floatRight close",
				src: "../images/close.png",
				onclick: "window.EZ.popup.close()"
			},
			details: {
				tagName: 'details',
				nodes: {
					summary: {},
					pre: {}
				}
			}
		}
	}
	
	function EZpopup()							//EZpopup constructor
	{
		if (this instanceof arguments.callee)
		{
			this.tags = [];
			this.outerHTML = [];
			//this.paddingTopSaved =  {};		//otionally created by add() -- deleted by remove()
			return;
		}
		return EZ.popup();
											  //-----------------------------------\\
		/*										 //----- NOT called as constructor -----\\
		if (!arguments.length) 					//---------------------------------------\\
			return EZ.log;						//return EZ.log.object if no arguments
			
		var args = [].slice.call(arguments)		//otherwise treat as EZ.log.add(...)
		return EZ.log.add.apply(this, args);
		*/
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZpopup.prototype.toString = function()
	{
		var str = '';
		if (this.paddingTopSaved && this.paddingTopSaved.el)
		{
			var json = JSON.stringify(this.paddingTopSaved.el, ['tagName', 'id']).replace(/"/g,'');
			str += 'paddingTopSaved:' + this.paddingTopSaved.paddingTop + ' ' + json + '\n'
		}
		if (this.tags && this.tags.length)
			str += '[' + this.tags.length + '] ' + this.outerHTML;
		else
			str += '[no popups open]';
		return str;
	}
	//______________________________________________________________________________________________
	/**
	 *
	 */
	EZpopup.prototype.add = function EZpopupAdd(el)
	{
		var tags = this.tags;
		//var detail = [];
		var outerHTML = this.outerHTML;
		EZ(el, true).forEach(function(el) 
		{
			if (el.undefined || el.tagName == 'IMG' || tags.includes(el))
				return;

			tags.push(el);
			outerHTML.push(el.toString('brief'))
		});
		if (tags.length > 2)
			EZ.oops('multiple popups open: ' + tags.length, outerHTML);
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZpopup.prototype.scrollInToView = function(el)
	{
		var offsets = EZ.getOffsets(el);
		var browserOffsets = EZ.getBrowserOffsets();
		var positionStyles = {};
				/*												//TODO: from EZ.test_assist... NOT refactored
				setTimeout(function()							//check fit after opened if display:none
				{									
					var offset = popup.clientHeight - EZ.getOffsets(el)[1] - padNow + 25;
					if (offset > 0)
						EZ('popupPad').style.paddingTop = offset + 'px';
				}, 0);
				*/
		//______________________________________________________________________________________________
		/**
		 *	get specified style value -- assume specified if whole number -- else render computed
		 */
		var _getPositionStyles = function()
		{
			['top', 'right', 'bottom', 'left'].forEach(function(style)
			{
				var value = EZ.getStyle(el,style);
				if  (EZ.toFloat(value) == EZ.toInt(value))
					positionStyles[style] = EZ.toInt(value);
			});
		}
		//______________________________________________________________________________________________
		/**
		 *	if too far right, decrement right and/or left
		 */
		var _isFitRight = function()
		{		
			var maxRight = browserOffsets.width 
						 - (browserOffsets.scrollbars !== false ? 15 : 0)
			var borderRightWidth = EZ.toInt(EZ.getStyle(el,'border-right-width'));
			var popupRight = offsets.right + borderRightWidth;
			var needRight = popupRight - maxRight;
			if (needRight > 0)
			{
				if (positionStyles.right !== undefined)
					el.style.right = (positionStyles.right + needRight) + 'px';
				
				if (positionStyles.left !== undefined)
					el.style.left = (positionStyles.left + needRight) + 'px';
			}
		}
		//______________________________________________________________________________________________
		/**
		 *	if too far left, bump right and/or left
		 */
		var _isFitLeft = function()
		{		
			if (offsets.left < 0)
			{
				if (offsets.offset.left < 0 && offsets.offset.left == positionStyles.left)
					el.style.right = 'initial';
				
				else if (positionStyles.right !== undefined)
					el.style.right = (offsets.left-10) + 'px';
				
				else if (positionStyles.left !== undefined)
					el.style.left = + '5px';
			}
		}
		//______________________________________________________________________________________________
		/**
		 *	if above top of browser window, add padding to EZ.popup.options.topPaddingTag or <body>
		 */
		var _isFitTop = function(el)
		{		
			var paddingTopNeeded = 0;
			var paddingTopNeeded = EZ.getStyle(el,'top-padding') || offsets.top;
			if (paddingTopNeeded < 0)
			{												//if bottom, add top padding to body
			//	if (EZ.toInt(EZ.getStyle(el,'bottom')) >= 0)
				if (positionStyles.bottom !== undefined)	//TODO: don't think needed
					paddingTopNeeded = -paddingTopNeeded;
				//else							
				//	el.style.top = padding + 'px';			//TODO: not much thought and NOT tested
			}
			else paddingTopNeeded = 0;
				
			if (paddingTopNeeded > 0)						//if padding needed to fit in browser win . . .
			{
				var el = EZ( [EZ.options.get('popup.topPaddingTag'), 'body'] )[0];
				var paddingTopSaved = EZ.toInt( EZ.getStyle(el , 'padding-Top'));
				EZ.popup.paddingTopSaved = {el:el, paddingTop:paddingTopSaved};
				//EZ.show.paddingTopOrig = EZ.show.paddingTopOrig || paddingTop;
				
				var paddingTop = paddingTopSaved + paddingTopNeeded + 10;
				EZ.el.style.paddingTop = (paddingTop) + 'px';
			}
		}
		//==============================================================================================
		_getPositionStyles();
		_isFitRight();
		_isFitLeft();
		_isFitTop();
		
		if (el.scrollIntoViewIfNeeded) el.scrollIntoViewIfNeeded();			
	}
	//______________________________________________________________________________________________
	/**
	 *	EZ.popup.createTag(name) -- 
	 *	
	 *	creates pre-defined popup related tags -- examples
	 *
	 *		EZ.popup.createTag('close') returns:
	 *		<img class="floatRight close" src="../images/close.png" onclick="window.EZ.popup.close()">
	 *	
	 *	RETURNS:
	 *		Element, String containing html -OR-
	 *		Object representation of tag which can be passed to EZ.createTag() to create tag Element
	 */
	EZpopup.prototype.createTag = function EZpopup_createTag(name, options)
	{
		options = options || '';
		var rtn = EZ.popup.createTag.value = {
			attributes: {},
			element: {},
			html: ''
		}
		do
		{
			if (!name) break;
			var tag = 'EZ.popup.options.tags.'.concat(name).ov();
			switch (EZ.getType(tag))
			{
				case 'Undefined':
					return; 
				case 'Element': 
				case 'String': 
				{
					rtn.object = EZ.format.Element(tag, 'object');
					break;
				}
				case 'Object': 	
				{
					rtn.object = tag;
					break;
				}
			}
			var attr = rtn.attributes;
			if (!attr) break;
			
			rtn.el = EZ.createTag(attr.tagName, attr, null)
			if (!rtn.el) break;
			
			rtn.html = rtn.el.outerHTML;
		}
		while (false)
		
		switch (options.format || '')
		{
			case 'all':
			case '*': 		return rtn;
			
			case 'attributes':
			case 'object': 	return rtn.attributes;
			default:		return rtn.element;
		}	
	}
	//______________________________________________________________________________________________
	/**
	 *
	 */
	EZpopup.prototype.remove = function EZpopup_remove(el, noClose)
	{
		el = EZ(el);
		var idx = this.tags.indexOf(el);
		if (idx != -1)
		{
			this.tags.splice(idx, 1);
			this.outerHTML.splice(idx, 1);
		}
		var paddingTopSaved = this.paddingTopSaved;
		if (paddingTopSaved && paddingTopSaved.el)
		{
			paddingTopSaved.el.style.paddingTop = paddingTopSaved.paddingTop;
			delete this.paddingTopSaved;
		}
		if (!noClose && el && el.onclose != null)
			EZ.event.trigger.call(el, el, 'close');
	}
	//______________________________________________________________________________________________
	/**
	 * not done or used
	EZpopup.prototype.getAll_TODO = function(el)
	{
		var tags = EZ(el, true);
		if (tags[0].undefined) return;
		
		tags = tags.remove().removeDups();
		var popup = EZ.popup();
		popup.tags = popup.tags.concat(tags);
	}
	 */
	//______________________________________________________________________________________________
	/**
	 *	not used or tested
	 */
	EZpopup.prototype.isPopup = function EZpopup_isPopup(el)
	{
		var isFound = this.tags.includes(el);
		return isFound;
	}
	//______________________________________________________________________________________________
	/**
	 *
	 */
	EZpopup.prototype.hide = function EZpopup_hide(el)
	{
		EZ.message.reset();
		var tags = !el ? this.tags.slice() 
				 : EZ.is(el, EZ.field) ? el.el
				 : EZ(el, true);
		EZ.toArray(tags).forEach(function(el)
		{
			if (EZ.popup.tags.includes(el))
				EZ.hide(el);
		});
	}
	//______________________________________________________________________________________________
	/**
	 *
	 */
	EZpopup.prototype.show = function EZpopup_show(el)
	{
		if (!el)
			return EZ.oops('no element specified');
			
		el = EZ(el);
		if (el.undefined) return;
		
		var img = el;
		if (/(IMG|IMAGE|BUTTON)/.test(el.tagName || ''))
			el = el.nextElementSibling;
		else
			img = el.previousElementSibling;
		if (img.src)
		{
			var pattern = /(plus|minus)/;
			if (pattern.test(img.src || ''))				//if opened by [+/-] icon, toggle
			{
				img.src = img.src.replace(pattern, 'minus');
				//if (el.onclose)
				//	EZ.oops('replaced onclose function tag: ' + el.toString('brief'), el.onclose)
				
				var popupClose = function EZpopupShow_onclose()
				{											//onclose, toggle icon back to [+]
					img.src = img.src.replace(pattern, 'plus');
					this.removeEventListener('close', popupClose);
				}
				el.addEventListener('close', popupClose);
			}
		}
		var outerPopup = EZ.getAncestor(el, 'helpBox', null);
		var tags = this.tags.slice().remove([el, outerPopup]);
		EZ.hide(tags);										//hide all other popups
		
		EZ.show(el);										//show specified popup
		if (EZ.getStyle(el, 'position') != 'absolute')
			EZ.popup.add(el);								//when EZ.show() does not call
		
		if (el.onload)										//call open event if defined
			EZ.event.trigger(el, 'onload');
		
		if (!el.onclick)										
		{
			el.onclick = function(evt)						//ignore click in popup container
			{
				if (evt.target != el || evt.target != evt.srcElement)
					return true;
				if (setAction)
					setAction('IGNORED click inside popup', el);
				window.EZ.event.cancel(evt,true);
			}
		}
		if (!el.onkeydown)									//no enter key bubble inside popup container
			el.onkeydown = function(evt)
			{
				if (evt.keyCode != 13) return;
				
				window.EZ.event.cancel(evt);
				//evt.target.onblur();
			}
		EZ.popup.scrollInToView(el);
	}
	//______________________________________________________________________________________________
	/**
	 *
	 */
	EZpopup.prototype.toggle = function EZpopup_toggle(tag)
	{
		var el = EZ(tag, null);
		if (!el)
			return EZ.oops('no element specified', tag);
			
		//var tagType = EZ.getTagType(el);
		//if (/(A|IMG|IMAGE|BUTTON)/i.test(tagType)) 
		
		while (!el.nextElementSibling 
		|| EZ.getStyle(el.nextElementSibling, 'position') != 'absolute')
		{
			el = el.parentElement;
			if (!el)
				return EZ.oops('popup not found');
		}
		el = el.nextElementSibling
		
		if (EZ.isHidden(el))
			EZ.popup.show(el);
		else 
			EZ.popup.hide(el);
	}
	//______________________________________________________________________________________________
	/**
	 *
	 */
	EZpopup.prototype.tooltip = function EZpopup_tooltip(el, html)
	{
		//return EZpopup.tooltip.set(el, html);
		
		var htmlTag = EZ(el);
		var tooltipTag = htmlTag;
		
		if (EZ.hasClass(htmlTag, 'tooltip'))
			tooltipTag = EZ('code', el);
		else
			tooltipTag = EZ.getAncestor(el, 'tooltip');
		
		if (!tooltipTag.onclick)
			tooltipTag.onclick = EZ.popup.tooltip.action.bind(this, 'click', tooltipTag);
		if (!htmlTag.onclick)
			htmlTag.onclick = EZ.popup.tooltip.action.bind(this, 'click', htmlTag);
		if (html)
			htmlTag.innerHTML = html;
			
		EZpopup.tooltip.action(null, 'setup');

		//var field = EZ.field(tooltipTag);
		//this.add(tooltipTag);
		var icon = tooltipTag.firstElementChild;
		if (icon && icon.isHidden())
			EZ.show(icon);
	}
	//______________________________________________________________________________________________
	/**
	 *	set el.innerHTML to html if supplied
	 *	if .tooltip tag onclick event handler not defined, set to call _tooltipUpdateStyle()
	 *
	 *	ARGUMENTS:
	 *		el		if el has class=tooltip, update sibbling "CODE" innerHTML with html
	 *				if tagName is "CODE" update innerHTML with html
	 *				if ancesstor of "CODE", then update specified innerHTML with html
	 *				if ancesstor of "CODE" but has parent with tooltip class update CODE
	 *
	 *	tooltip tag can optionally define EZ.log filter of the following form:
	 *		data-log-filter="EZtimeout"	
	 *	in which case, the tooltip is only active if EZ.log page filter is defined
	 */
	EZpopup.prototype.tooltip.set = function EZpopup_tooltip_set(tag, html)
	{
		var el = (EZ.getConstructorName(tag) == 'EZfield') ? tag.el : EZ(tag);
		if (!el)
			return EZ.oops('invalid tooltip selector', tag)
		
		var iconTag = el;
		var htmlTag = el;
		var codeTag = el;
		var tooltipTag = el;
		
		if (EZ.hasClass(tooltipTag, 'tooltip'))
		{											//specified sel is tooltip wrapper
			codeTag = htmlTag = EZ('code', el);
			iconTag = el.firstElementChild;
		}
		else if (el.tagName == 'CODE')
		{											//specified sel is code el
			tooltipTag = EZ.getAncestor(el, 'tooltip');
			iconTag = tooltipTag.firstElementChild;
		}
		else if (el = EZ.getAncestor(el, 'code'))
		{											//specified sel is inner code el
			tooltipTag = EZ.getAncestor(el, 'tooltip');
			iconTag = tooltipTag.firstElementChild;
		}
		else if (el = EZ.getAncestor(el, 'tooltip', {}))
		{											//specified sel is icon el
			tooltipTag = el;
			codeTag = htmlTag = EZ('code', el);
		}
		else
			return EZ.oops('invalid tooltip element', tag)
		
		var field = EZ.field(codeTag, true);
		
		var filter = tooltipTag.getAttribute('data-log-filter');
		var logFilters = EZ.options.get('log.filters.page') || [];
		var isActive = logFilters.includes(filter);
		if (!isActive)	
			return EZ.addClass(field, 'hidden');
		
		if (!field.tooltip)
		{
			if (!codeTag.onclick)
				codeTag.onclick = EZ.popup.tooltip.action.bind(this, 'click', codeTag);
				
			EZpopup.tooltip.action('setup', tooltipTag);
		}
		
		switch (EZ.getType(html))
		{
			case 'Array': 	
			{
				html = html.join('\n');
				break;
			}
			case 'Boolean': 
			case 'NaN': 
			case 'Number':
			case 'Date':
			case 'String': 
			{
				html + '';
				break;
			}
			case 'Object': 	
				html = EZ.createTag(html.tagName||'', html, null)
			
			/* jshint ignore:start*/	//FALL-thru
			case 'Element': 	
			/* jshint ignore:end */
			{
				codeTag.innerHTML = '';
				EZ.codeTag.append(html);
				html = '';
			}
			break;
			default:
			{
				html = '';
			}
		}
		if (html)
			EZ.set(codeTag, html);
		
		
		if (iconTag && iconTag.isHidden() && tooltipTag.isVisible)
			EZ.show(iconTag);
			
		EZ.removeClass(codeTag, ['hidden', 'invisible'], html);
	}
	//__________________________________________________________________________________________________
	EZpopup.prototype.tooltip.update_style = function update_tooltip_style(el, action) {
	/** {
		action = "click" 	when tooltip open, set visibility=hidden until not :hover
							when not open, display for tooltip seconds specified under advanced settings
							if tooptip not active (el.title being used), kill title and activate tooltip
		
		//----- disabled long ago -- overteched -----\\
		action = "show" 	current :hover css values for top, bottom, left and right set as tooltip tag
							style to support opacity transition on not :hover
							set at end of :hover transition or start of not :hover
							
							NOTE: only sets integer value -- decimals are assumed to be derived values
							only values >= 0 currenly supported
		
		action = "hide"		clears el css styles set by show action.
		\\------------------------------------------//
		
		NOTE:
			legacy code moved from EZtest_assistant_support.js 03-27-2017
			function update_tooltip_style(el, action)
	}**/
	if (action == 'click')
	{
		if (true) return EZ.popup.tooltip.action(action, el);
		
		var tooltip, parent;
		if (el.tagName == 'CODE')
		{
			tooltip = el;
			parent = EZ.getAncestor(el, 'tooltip', null);
			if (!parent) return;
		}
		else if (EZ.hasClass(el,'tooltipClick'))
		{
			parent = el.parentElement;
			EZ.addClass(parent, 'tooltip');			//activate tooltip if not already
			el.title = '';							//...and kill title
			tooltip = EZ('code', parent);
			EZ.addClass(tooltip, 'show');
			//tooltip.style.visibility = '';
		}
		else 
			return EZ.oops('not tooltip element:', el);
	
		if (EZ.getStyle(el,'opacity') <= 0)			//HACK but perhaps solid logic
			return;
													//activate or deactivate pseudoi code:hover
		var showClassName = EZ.toggleClass(parent, 'hover');
		if (!showClassName.includes('hover'))		//when clicked with tooltip showing...
		{											//...immediately hide tooltip while :hover
			tooltip.style.visibility = 'hidden';
			parent.onmouseout = function()			
			{										//restore visibility after not :hover...
				setTimeout(function()				//...but wait a bit to avoid flicker
				{
					parent.onmouseout = null;
					tooltip.style.visibility = '';
				}, 1000);
			}
		}
		else 										//clicked when not showing
		{											
			var tags = EZ('hover', true).remove(parent);
			EZ.removeClass(tags, 'hover');			//close any other open tooltips
			
			var delay = EZ.toInt( EZ.get('tooltipDelay') ) * 1000;
			if (delay)								//show for at least defined delay
				setTimeout(function() {EZ.removeClass(parent, 'show')}, delay);
		}
		return;
	}
	
	EZ.addClass(el,'show', action == 'show');			//activate or deactivate code:hover
	
	/* over-teched ... transition hide/show events ...
	if (true) return;
														  //-------------------------------------\\
														 //----- transition hide/show events -----\\
		g.tooltipOpen = g.tooltipOpen || [];			//-----------------------------------------\\
		if ((action == 'hide' && !g.tooltipOpen.includes(el))
		|| (action == 'show' && g.tooltipOpen.includes(el)))
			action = 'skip';
		
		else if (action == 'show' && g.tooltipOpen.includes(el))
		{												
			action = 'reset';
			g.tooltipOpen.splice(g.tooltipOpen.indexOf(el), 1);
		}
		else if (action == 'hide')
		{
			g.tooltipOpen.splice(g.tooltipOpen.indexOf(el), 1);
		}
		else
			g.tooltipOpen.push(el);
	
		var css = [];
		if (action != 'skip')
		{
			['top', 'right', 'bottom', 'left'].forEach(function(s)
			{												
				if (action == 'show')
				{
					var value = EZ.getStyle(el, s);
					if (EZ.toInt(value) < 0) return;
	
					el.style[s] = value;
					css.push(s + ':' + value);
				}
				else el.style[s] = '';	//hide or reset
			});
		}
		//console.log(el.previousElementSibling.className, action, css.join('; '));
		
		if (action == 'reset' && EZ.quit !== false)
			setTimeout( function() {update_tooltip_style(el, action)}, 0);
		*/
	}
	/*--------------------------------------------------------------------------------------------------
	09-18-2016: cloned from EZtest_assistant_support.js

	
	action = "click" 	when tooltip open, set visibility=hidden until not :hover
						when not open, display for tooltip seconds specified under advanced settings
						if tooptip not active (el.title being used), kill title and activate tooltip
	
	//----- disabled -----\\
	
	action = "show" 	current :hover css values for top, bottom, left and right set as tooltip tag
						style to support opacity transition on not :hover
						set at end of :hover transition or start of not :hover
						
						NOTE: only sets integer value -- decimals are assumed to be derived values
						only values >= 0 currenly supported
	
	action = "hide"		clears el css styles set by show action.	
	--------------------------------------------------------------------------------------------------*/
	EZpopup.prototype.tooltip.action = function EZpopup_tooltip_action(action, el, evt)
	{
		if (action instanceof Event)
		{
		}
		
		switch (action)
		{
			case 'setup': 	
			{												//===== <code> tooltip :hover / show =====
				var _toolTipTranstionEvent = function(evt)
				{
					var evtType = evt.type;
					var el = evt.srcElement;
					var start = evtType.includes('start');			
					var hide = EZ.getStyle(el, 'color').includes('1');
					var hideText = (hide ? 'hide' : 'show');
					var tag = el ? el.toString('brief') : 'NA';		//el.previousElementSibling.className
			
					//if (start) EZ.timer();	 
					EZ.log.call('tooltipEvents', evtType, hideText, tag);
//console.log(evtType, hideText, tag)					
					el = evt.scrElement;
					if (start && !hide)						//start of :hover or show -- always fired
						EZpopup.prototype.tooltip.action('show', el);	//even when prior transition not complete
			
					else if (!start && hide)				//end of hide -- may not fire if :hover
						EZpopup.prototype.tooltip.action('hide', el);	//does not last for transition duration
					
					EZ.log.call('tooltipEvents', evtType, hideText, tag);
					return true;
				}
				//======================================================================================
				EZ.event.createTransitionEvents();
				
				var field = EZ.field( EZ(el || 'body'), true );
				if (!field)
					return EZ.oops('tooltip setup did not complete', arguments);
				
				if (!field.hasEvent('transition-end'))	//attach pseudo events if not done yet
				{
					field.addEvent('transition-end', _toolTipTranstionEvent);
					field.addEvent('transition-start', _toolTipTranstionEvent);
				}
		
				if (el && !el.onclick)
					el.onclick = EZ.popup.tooltip.action.bind(this, 'click', el);
				
				break;
			}									
			case 'show': 								//hide or show action -- called by pseudo...
			case 'hide': 								//...transition-start / transition-end events
			{
				EZ.addClass(el,'show', action == 'show');	
				break;									//fall thru to over-teched code
			}											//...but disabled
			case 'click': 	
			{
				var codeTag, tooltipTag = el;
				if (el.tagName == 'CODE')					//clicked inside code
				{
					codeTag = el;
					tooltipTag = EZ.getAncestor(el, 'tooltip', null);
				}
				else if (EZ.hasClass(el,'tooltipClick'))	//.tooltip or child
				{
					if (!EZ.hasClass(el, 'tooltip'))
						tooltipTag = el.parentElement;
					
					EZ.addClass(tooltipTag, 'tooltip');		//activate tooltip if not already
					el.title = '';							//...and kill title
					codeTag = EZ('code', tooltipTag);
					//03-23-2017 done below
					//EZ.addClass(EZ('code', tooltipTag), 'show');
				}
				else if (!EZ.hasClass(el,'tooltip'))		//clicked inside tooltip container
					return EZ.oops('not tooltip element:', el);

				if (codeTag)
				{
					//03-23-2017
					//codeTag = EZ('code', tooltipTag);

					EZ.addClass(codeTag, 'show');
				
					if (codeTag.isVisible())					//open on refresh
						EZ.popup.tooltipOpenClick = codeTag;
				}
				if (EZ.getStyle(el,'opacity') <= 0)			//HACK but perhaps solid logic
					return;
															//activate or deactivate pseudo code:hover
				var showClassName = EZ.toggleClass(tooltipTag, 'hover');
				if (!showClassName.includes('hover'))		//when clicked with tooltip showing...
				{											//...immediately hide tooltip for :hover
					tooltipTag.style.visibility = 'hidden';
					tooltipTag.onmouseout = function()
					{										//restore visibility after not :hover...
						setTimeout(function()				//...but wait a bit to avoid flicker
						{
							tooltipTag.onmouseout = null;
							tooltipTag.style.visibility = '';
						}, 250);
					}
				}
				else 										//clicked when not showing
				{
					var tags = EZ('hover', true).remove(tooltipTag);
					EZ.removeClass(tags, 'hover');			//close any other open tooltips

					var delay = EZ.toInt( EZ.get('tooltipDelay') ) * 1000;
					if (delay)								//show for at least defined delay
						setTimeout(function() {EZ.removeClass(tooltipTag, 'show')}, delay);
				}
				if (evt)									//cancel bubble if evt known
					EZ.event.cancel(evt);
				return;
			}
			default:	
				return EZ.oops('unknown action: ' + action)
	
		}	
	
	//______________________________________________________________________________________	
	if (true) return;	/* over-teched: skip, hide or show action */
	//______________________________________________________________________________________	
													  //-------------------------------------\\
													 //----- transition hide/show events -----\\
		g.tooltipOpen = g.tooltipOpen || [];		//-----------------------------------------\\
		if ((action == 'hide' && !g.tooltipOpen.includes(el))
		|| (action == 'show' && g.tooltipOpen.includes(el)))
			action = 'skip';
		
		else if (action == 'show' && g.tooltipOpen.includes(el))
		{												
			action = 'reset';
			g.tooltipOpen.splice(g.tooltipOpen.indexOf(el), 1);
		}
		else if (action == 'hide')
		{
			g.tooltipOpen.splice(g.tooltipOpen.indexOf(el), 1);
		}
		else
			g.tooltipOpen.push(el);
	
		var css = [];
		if (action != 'skip')
		{
			['top', 'right', 'bottom', 'left'].forEach(function(s)
			{												
				if (action == 'show')
				{
					var value = EZ.getStyle(el, s);
					if (EZ.toInt(value) < 0) return;
	
					el.style[s] = value;
					css.push(s + ':' + value);
				}
				else el.style[s] = '';	//hide or reset
			});
		}
		//console.log(el.previousElementSibling.className, action, css.join('; '));
		
		if (action == 'reset' && EZ.quit !== false)
			setTimeout( function() {arguments.callee(el, action)}, 0);
	}
	//==================================================================================================
	var fn = new EZpopup();
	for (var key in fn)
	{
		EZpopup[key] = fn[key];
	}
	return EZpopup;
})();


//_________________________________________________________________________________________________
e = function _____EZls_____() {}	//convenience for DW functions list
//_________________________________________________________________________________________________


/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.ls = {group: location.pathname.replace(/.*\/(.*)\..*/, '$1')};
/**
 *	
 */
EZ.ls.getGroup = function EZls_getGroup()
{
	return EZ.ls.group;
}
/**
 *	
 */
EZ.ls.setGroup = EZ.setGroup = function EZls_setGroup(group, value)
{
	EZ.ls.group = value;
}
//__________________________________________________________________________________________________
/**
 *	TODO: dw not tested
 */
EZ.ls.get = EZ.getLS = function EZgetLS(key, defaultValue)
{
	delete EZ.ls.fault;
	if (!key) return '';
	
	var value = defaultValue;
	if (key.includes(':/'))			//read from file
	{
		try
		{
			var json = DWfile.read(key);
			if (json)
				eval('value=' + json);
			else
				EZ.ls.fault = '$DWfile.read() failed\n' + key;
		}
		catch (e)
		{
			EZ.techSupport(e, json, this);
		}
		return value;
	}
	
	var keys = key.trim().split('.');
	if (dw.isNotDW)					//TODO: perhaps ok for dw
	{
		if (keys[0])
			keys.unshift(EZ.ls.group.trim())
		else
			keys.shift();
	}
	var fullKey = keys.join('.');
	key = keys.pop();
	var group = keys.join('.');
	
	if (!dw.isNotDW)
	{
		if (group)
			value = EZ.getPref(group,key);
		else if (key)
			value = EZ.getPref(key);
		return value;
	}
	
	var value = localStorage.getItem(fullKey) || defaultValue;
	var types = JSON.parse(localStorage.getItem(group + '._types_') || '{}');
	switch (types[key])
	{
		case 'undefined': 
			return '';
		
		case 'boolean': 
			return value == 'true';
		
		case 'number':
			return EZ.toInt(value, defaultValue);
		
		case 'string':
			return value;
		
		case 'function':
		case 'object':		//TODO: embedded functions ignored
			return JSON.parse(value); 	
		
		default:
			return value;
	}
}
//__________________________________________________________________________________________________
/**
 *	TODO: handle group not filename
 */
EZ.ls.remove = function EZls_remove(group)
{
	delete EZ.ls.fault;
	if (!group.includes(':/'))		
		return EZ.oops();
		
	else if (DWfile.exists(group))		//delete file
	{
		if (!DWfile.remove(group))
			EZ.ls.fault = '$DWfile.remove() failed\n' + group;
	}
	return !EZ.ls.fault;	
}
//__________________________________________________________________________________________________
/**
 *	TODO: dw enviornment not tested
 *	set ls.fault() when group not file
 */
EZ.ls.set = EZ.setLS = function EZsetLS(key, value, name)
{
	delete EZ.ls.fault;
	if (!key || value === undefined) 
		return false;

	if (key.includes(':/'))			//write to file
	{
		try
		{
			var json = EZ.stringify(value, '*');
			if (name)
				json = name + '=\t\t//Saved @ ' 
					 + (EZ.formatDate ? EZ.formatDate('','spaces') : new Date())
					 + '\n' + json;
			
			if (DWfile.write(key, json))
				return true;
			EZ.ls.fault = '$DWfile.write() failed: + rtnValue + \n' + key;
		}
		catch (e)
		{
			EZ.ls.fault = EZ.techSupport(e, this);
		}
		return false;
	}
	
	var keys = key.trim().split('.');
	var keys = key.trim().split('.');
	if (dw.isNotDW)				//TODO: perhaps ok for dw
	{
		if (keys[0])
			keys.unshift(EZ.ls.group.trim())
		else
			keys.shift();
	}
	
	var fullKey = keys.join('.');
	key = keys.pop();
	var group = keys.join('.');
	
	if (!dw.isNotDW)
	{
		if (value instanceof Object)
		{
			Object.keys(value).forEach(function(key)
			{
				EZ.ls.set(group+key, value[key])
			});
		}
		else if (group)
			EZ.setPref(group, key, value);
		else if (key)
			EZ.setPref(key, value);
		return value;
	}
	var type = typeof(value);		//save value type 
	var types = JSON.parse(localStorage.getItem(group + '._types_') || '{}');
	types[key] = type;		
	localStorage.setItem(group + '._types_', JSON.stringify(types));
	switch (type)
	{
		case 'boolean': 
		{
			value = value ? 'true' : '';
			localStorage.setItem(fullKey, value);
			return value === true;
		}
		case 'number':
		{
			value = value.toInt()
			localStorage.setItem(fullKey, value+'');
			return value;
		}
		case 'string':
		{
			localStorage.setItem(fullKey, value);
			return value;
		}
		case 'function':
		case 'object':
		{
			value = JSON.stringify(value);
			localStorage.setItem(fullKey, value);
			return value;
		}
	}
}

//_________________________________________________________________________________________________
e = function _____EZstore_____() {}	//convenience for DW functions list
//_________________________________________________________________________________________________

/*--------------------------------------------------------------------------------------------------
localStorage / sessionStorage lightweight wrapper

Supports following variable types as item values w/o converting to String: 
	Array, Date, Boolean, Number, RegExp or Object -- TODO: function

key specified using dot notation represents group up to last dot.  By default group starts with the
location.pathname (excluding file extension if any)

ARGUMENTS:	(common)
	key 	String -- dot notation optional
			EZ.store.group prepended to key unless it starts with dot "." or slash "/".
			
-- local used when key ends with @ or seesion used if key ends with $			
			end key @ for localStorage -OR- $ for sessionStorage

TODO: 
	use DWfile for DW ??
	expire when browser closes
	embedded Date and RegExp
	merge upgraded from webspace_menu-editlist.EZ.js
		-recognizes Array at top level
		-auto determines type on get() if not found in _types_
		-better default value for set
		-default group: pathname "/revize" prefix if found and file extension trimmed
		
	support function and Array named properties if EZ.JSON available
	
REFFERENCE: good doc
	http://www.smashingmagazine.com/2010/10/local-storage-and-how-to-use-it/
--------------------------------------------------------------------------------------------------*/
EZ.store = function EZstore(key,options)	//constructor used by other functions 
{											//e.g. EZ.store.get(), set(), list(), remove()
	/**
	 *	TODO: EZ.isEmpty() canidate
	 */
	var _isEmpty = function(value)
	{
		switch (EZ.getType(value))
		{
			case 'Boolean': 
			case 'NaN': 
			case 'Number':
			case 'Date':
			case 'RegExp':
			case 'Function':
				return false;		//TODO: ??
				
			case 'null': 
			case 'undefined': 
			case 'Null': 
			case 'Undefined': 
				return true;
			
			case 'String': 
				return value === '';
			
			case 'Array': 	
				return value.length;
			
			case 'Object': 	
				return Object.keys(value).length;
			
			default:
				return false;		//safe
		}
	}
	//====================================================================================	
	key = (key || '_').trim();
	this.origKey = key;
	this.options = options;
	
	var type = EZ.store.type;
	var results = key.match(/(@|\$)$/);
	if (results)
	{
		key = key.substr(0,key.length-1);
		type = results[1] == '@' ? 'local' : 'session';
	}
	var keys = key.split('.');
	
	if (key.substr(0,1) == '/')		//group NOT prepended when key starts with slash "/"
		void(0);	
	else if (keys[0] === '')		//group NOT prepended when key starts with dot "."
		 keys.shift()	
	else							//prepend group
		 keys.unshift(EZ.store.group);		
	
	this.fullkey = keys.join('.');
	this.key = keys.pop();
	this.group = keys.join('.');
	this.type = type;
	/**
	 *	TODO: list ??
	 */
	this.list = function EZstoreList()
	{
		(this.type == 'local') ? localStorage.key()
							   : sessionStorage.key();
	}
	/**
	 *	remove item specified by key
	 */
	this.remove = function EZstoreRemove()
	{
		if (options !== true && 'EZ.debug.options.nosave'.ov())
			EZ.oops('remove suspended ['+ this.type + ':' + this.fullkey + ']', this.value());
		else
			(this.type == 'local') ? localStorage.removeItem(this.fullkey)
								   : sessionStorage.removeItem(this.fullkey);
	}
	/**
	 *	save specified value for key
	 */
	this.save = function EZstoreSave(value)
	{			
		var val = value;
		if (options !== true && 'EZ.debug.options.nosave'.ov())
			EZ.oops('save suspended ['+ this.type + ':' + this.fullkey + ']', value);
		else
		{
			if (_isEmpty(value))
				return this.remove();
			
			(this.type == 'local') ? localStorage.setItem(this.fullkey, value)
								   : sessionStorage.setItem(this.fullkey, value);
			val = EZ.store.get(this.origKey, value);
		}
		return val;
	}
	/**
	 *	return raw value of item specified by key
	 */
	this.value = function EZstoreValue()
	{
		return (this.type == 'local') ? localStorage.getItem(this.fullkey)
									  : sessionStorage.getItem(this.fullkey);
	}
	return this;
}
/*--------------------------------------------------------------------------------------------------
set default type: 'local' and group: /filename -- /pathname kept EZ.store.setGroup('*pathname')
--------------------------------------------------------------------------------------------------*/
EZ.store.type = 'local';

EZ.store.filename = location.pathname.replace(/.*\/(.*)\..*/, '$1');
EZ.store.pathname = location.pathname.replace(/^(\/revize)?(\/.*\/.*)/, '$2');	//strip: "/revize"
EZ.store.pathname = EZ.store.pathname.replace(/(.*)\..*/, '$1');				//strip file extension
EZ.store.group = EZ.store.filename;
/*--------------------------------------------------------------------------------------------------
get local storage value for specified key
--------------------------------------------------------------------------------------------------*/
EZ.store.get = EZ.storeGet = function EZstore_get(key, defaultValue)
{
	var store = new EZ.store(key);	
	var value = store.value();
	if (value == null)
		return defaultValue;
		
	var results = value.match(/^(.)(.*)(.)$/);
	if (results)
	{
		var beg = results[1];
		var end = results[3]
		var val = results[2];
		if (beg == '"' && end == '"')
			return val;
		
		if ((beg == '[' && end == ']')
		|| (beg == '{' && end == '}'))
			return JSON.parse(value);
		
		void(0);	//debugger breakpoint
	}
	if (/^(true|false)$/i.test(value))
		return Boolean(value == 'true');
	else if (!isNaN(value))
		return Number(value);
	else if (value == 'undefined')
		return undefined
	else if (value == 'null')
		return null;
	else if (/^new \w+\(.*\)$/.test(value))	//e.g. new Date()
		return eval(value);
	else
		void(0);	//debugger breakpoint
		
	return  value;
}
/*--------------------------------------------------------------------------------------------------
set local storage value for specified key.  
--------------------------------------------------------------------------------------------------*/
EZ.store.set = EZ.storeSet = function EZstore_set(key, value, options)
{
	var store = new EZ.store(key, options);
	var type = value === null ? 'null' : typeof(value);	
	switch (type)
	{
		case 'undefined': 
		case 'null': 
		case 'boolean':	return store.save(String(value));

		case 'number':	return store.save(value);
		
		case 'string':	return store.save('"' + value + '"');
		
		case 'array':
		case 'object':	
		{
			if (value.constructor == RegExp)
				return store.save(value + '');
			if (value.constructor == Date)
				return store.save('new Date(' + value.getTime() + ')');
				
			return store.save(JSON.stringify(value));
		}
		case 'function':	
			return 'TODO:  function';
	}
	return value + '';
}
/*--------------------------------------------------------------------------------------------------
TODO: return object containing all items matching key
--------------------------------------------------------------------------------------------------*/
EZ.store.list = function EZstore_list(key)
{
	key = key;
}
/*--------------------------------------------------------------------------------------------------
TODO: support * notation
--------------------------------------------------------------------------------------------------*/
EZ.store.remove = function EZstore_remove(key, options)
{
	var store = new EZ.store(key, options);	
	store.remove();
}
/*--------------------------------------------------------------------------------------------------
return current group
--------------------------------------------------------------------------------------------------*/
EZ.store.getGroup = function EZstore_getGroup()
{
	return EZ.store.group;
}
/*--------------------------------------------------------------------------------------------------
set default group prefix used when key does not start with dot "." or slash "/"

sets to page /path/filename if "/" specified or filename (default) if value omitted or undefined
--------------------------------------------------------------------------------------------------*/
EZ.store.setGroup = function EZstore_setGroup(value)
{
	value = (value || '').trim();
	EZ.store.group = !value ? EZ.store.filename
				   : value == '/' ? EZ.store.pathname
				   : value;
}
/*--------------------------------------------------------------------------------------------------
set default storage type used when key does not  with "@" or "$"

set to 'session' if "$" specified otherwise set to 'local' -- original default type is 'local'
--------------------------------------------------------------------------------------------------*/
EZ.store.setType = function EZstoreSetType(type)
{
	type = (type || '').trim();
	EZ.store.type = (/(session|\$)/i.test(type)) ? 'session' : 'local';
}
//______________________________________________________________________________
EZ.storeSet.test = function()
{
	var value, obj=null, ctx, ex, exfn, note = '';
	/*  jshint: future vars */
	e = [obj, ctx, ex, exfn, note];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	EZ.store.setGroup('EZtest');	
	EZ.store.setType('$');				//session

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	value = 'false';
	EZ.test.options({ex:value, note:typeof(value)})
	EZ.test.run('.EZtest.' + typeof(value), value);

	value = false;
	EZ.test.options({ex:value, note:typeof(value)})
	EZ.test.run('.EZtest.' + typeof(value), value);

	value = 99.8;
	EZ.test.options({ex:value, note:typeof(value)})
	EZ.test.run('.EZtest.' + typeof(value), value);

	value = {a:1, b:2, c:3};
	EZ.test.options({ex:value, note:typeof(value)})
	EZ.test.run('.EZtest.' + typeof(value), value);

	value = [1,2,3];
	EZ.test.options({ex:value, note:typeof(value)})
	EZ.test.run('.EZtest.' + typeof(value), value);

	value = /abc/i;
	EZ.test.options({ex:value, note:typeof(value)})
	EZ.test.run('.EZtest.' + typeof(value), value);

	value = new Date('1/1/1990');
	EZ.test.options({ex:value, note:typeof(value)})
	EZ.test.run('.EZtest.' + typeof(value), value);

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
//	EZ.test.run(-2, 		{EZ: {ex:-2	,	note:note	}})
	
	//______________________________________________________________________________
	EZ.store.setGroup();		
	EZ.store.setType();			
	return;
}


//_________________________________________________________________________________________________
e = function _____GENERAL_FUNCTIONS_____() {}	//convenience for DW functions list
//_________________________________________________________________________________________________

/*---------------------------------------------------------------------------------------------
display what in browser window 

	what		object or variable displayed -- formatted via EZ.stringify()
	name		what obj name -- window name (deaualt: "EZbrowser")
	linkTag		tag used to open browser -- creates tag at bottom of doc if not supplied
				remembers for next call
---------------------------------------------------------------------------------------------*/
EZ.displayBrowser = function EZdisplayBrowser(what, name, linkTag)
{
//	if (!what || what.startsWith('-'))
//		return;

	var tag = linkTag || EZ.displayBrowser.linkTag;
	if (tag && !EZ.isEl(tag))
		tag = EZ(tag);
	
	if (!tag || tag.undefined)
		tag = EZ.displayBrowser.linkTag = EZ.createLayer('', 'A');
	
	var url = EZ.constant.configPath + 'Shared/EZ/';
	var title = EZ.formatDate();
	var filename = '';	//what;
	var html = what;
	
	if (typeof(what) != 'string')				//assume filename if string
	{
		filename = '';
//		title = (name || '') + '\t\t @' + title
		html = EZ.stringify(what || EZ.UNDEFINED);
		html = html.replace(RegExp(EZ.DOT, 'g'), '&#8226;');
		html = html.replace(/</g, '&lt;');
		html = html.wrap('<pre>');
	}
	else if (!name)								//default: filename
		name = filename.replace(/.*\/(.*)/, '$1');

	DWfile.write(url + '_browser_object.html', html);

	tag.setAttribute('target', name || 'EZbrowser');
	tag.href = EZ.filePlus.urlFromFile(url) + '_browser_display_object.html'
			 + (filename ? '?' + filename : '')
			 + '#' + title + '#' + name;
	tag.click();
	return tag;
}

/*--------------------------------------------------------------------------------------------------
legacy function (very simple code) -- superceeded by EZ.counts() but fails in some scenarios

very solid with following limitations:
	only supports 2 levels
	loses top level count if susequently called with group and vis versa
	i.e. calls with same group value must all either specify or not specify non-blank msg

01-02-2017: update
	eliminate "x 1" except lower levels if any Alpha keys or Object properties
	collape consequtive numbers with count = 1 to ranges -- e.g.  1, 5-7, 10
	eliminated double newlines 
	
TODO:
	sort keys
	"x 1" perhap show at top level 0 if Objects -or- not at lower level with Objects

--------------------------------------------------------------------------------------------------*/
EZ.mergeMessages = EZ.collapseMessages = function EZmergeMessages(o, group, msg)
{
	if (!o) o = {};	//if (o == null || typeof(o) != 'object') return '';
	
	if (group)						
	{									//update msg / count
		o[group] = o[group] || (msg ? {} : 0);
			   
		msg ? (!o[group][msg] 
			? o[group][msg] = 1
			: o[group][msg]++)
			: o[group]++;
		return o;
	}

var isTest = EZ.test.isTestFunction(); 
void(isTest);

	var isLegacy = false;	//EZ.isLegacy();	
	var msg = mergeMessages(o);			//return formatted counters
		
	return msg;
	
	//______________________________________________________________________________________________
	/**
	 *
	**/
	function mergeMessages(o, level)
	{
		level = level || 0;
		var sep = (!level) ? '\n' : ', ';
		var msg = '';
		var cnt = Object.keys ? Object.keys(o).length : 0;
										
		if (!isLegacy)					//01-02-2017: eliminate "x 1" only 
		{								//lower levels if no Object and no Alpha keys
			var keys = Object.keys(o);
			var hasAlpha = /\D/.test(keys.join(''))
			var hasObj = keys.some(function(k){ return o[k] instanceof Object});	
			
			if (level === 0 || (level > 0 && !hasAlpha && !hasObj))
				cnt = 0;					
		}
		var numbers = [];
		for (var k in o)
		{
			var m = '';
			if (typeof(o[k]) == 'function') continue;
			
			if (typeof(o[k]) == 'object')
				m = k + ': ' + mergeMessages(o[k], level+1)

			else if (isNaN(o[k]))			//not sure what should be done here
				m = k + '=' + o[k] + '';

			else
				m = k + (o[k] > 1 || cnt > 1 ? ' x ' + o[k] : '');
			
			if (!__mergeRanges(m)) continue;
			
			var s = sep + ((msg + m).indexOf('\n') != -1 ? '\n' : '')
			if (!isLegacy && s == '\n\n') 
				s = '\n';
			
			msg += (!msg ? '' : s) + m;
		}
		__mergeRanges('');					//append pending number(s) to msg if any
		//======================
		return msg;
		//======================
		//________________________________________________________________________________
		/**
		 *	keep number keys at level 1, until non-number or end keys then append
		 *	to msg as range(s) via Array.toRanges();
		**/
		function __mergeRanges(m)
		{
			if (isLegacy) return false;
				
			if (m !== '' && !isNaN(m))		//if m is number, keep for potential ranges
			{
				numbers.push(Number(m));			
				return '';
			}
			if (numbers.length > 0)			//append pending number ranges(s) to msg if any
			{
				var ranges = numbers.toRanges();
				msg += (!msg ? '' : sep) + ranges;
				
				numbers.splice(0, numbers.length);
			}
			return m || '';
		}
	}
}
//___________________________________________________________________________________________
EZ.mergeMessages.test = function()
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
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	obj = {
		red: 1,
		yellow: 1,
		green: {
			light: 1,
			dark: 4
		}
	}
	EZ.test.run(obj)

	obj = {
		green: {
			light: 1,
			dark: 4
		}
	}
	EZ.test.run(obj)

	obj = {
		red: 1,
		yellow: 1,
		green: 1
	}
	EZ.test.run(obj)

	obj = {
		'one group testno': {
			1: 1,
			2: 1,
			3: 1,
			4: 1
		}
	}
	EZ.mergeMessages(obj, 'one group testno', 4)
	EZ.test.run(obj)

	obj = {
		red: 1,
		yellow: 2,
		green: 3
	}
	EZ.test.run(obj)


	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	obj = {
		'pink group testno': {
			1: 1,
			3: 1,
			4: 1,
			5: 1
		},
		'colors': {
			red: 1,
			yellow: 2,
			green: 3
		},
		'blue group testno': {
			4: 1
		}
	}
	EZ.test.run(obj)
	
	obj = {
		even: 2,
		'odd': 1,
		1: 3,
		4: 1
	}
	EZ.test.run(obj)

	//_______________________________________________________________________________________
 }


/*--------------------------------------------------------------------------------------------------
EZ.counts(group[, msg])

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

EXAMPLES:
	var counts = EZ.mergeCounts();
	counts.add(key);
	counts.add(groupName, key/msg);
	counts.add(dotName, msg);

TODO: formating options
--------------------------------------------------------------------------------------------------*/
EZ.counts = (function _____EZcounts_____()
{
	EZ.defaultOptions.counts = {						//default options

		format: 'EZtoString',
		formatOptions: { 
			tostring: {timestamp: false},
			stringify:{spaces:4} 
		},
		oops: true,								//call EZ.oops() when dotName invalid
		name: 'counts.options',
		version: '09-16-2016'
	}
	//__________________________________________________________________________________________________
	/**
	 *	constructor for _init() -- subsequently calls defaultFumctiom
	 */
	function EZcounts(counts)
	{									
		if (this instanceof arguments.callee)	
		{									//----- called as constructor -----\
			this._counts = {};
			//this._oops = '';				//most recent error message
			//this._dotName = [];			//most recent resolved dotName
			
			//for (var key in EZcounts.prototype)
			//	this[key] = EZcounts.prototype;
			return this;
		}
											//----- NOT called as constructor -----\\
		if (arguments.length === 0)
			return new EZ.counts();
		
		if (counts instanceof Object)		//if 1st argument is Object, create new EZcounts Object
		{									//...with specified Object counts if any TODO: not tested
			var obj = new EZ.counts();	
			for (var key in obj)
				if (counts[key] == null)
					counts[key] = obj[key];
			
			for (key in counts)				//return new counts Object
				obj[key] = counts[key];
			
			return obj;
		}
	}
	//__________________________________________________________________________________________________
	/**
	 *	creates new instance but copies all properties and prototypes to static function so counts()
	 *	still valid and calls defaultFumction with this context.
	 */
	var _init = function()
	{
		var fn = new EZcounts();
		for (var key in fn)
			EZcounts[key] = fn[key];
		
		EZ.event.add(window, 'onload', function()	//_init() initialize options plus...
		{
			EZ.counts._options = EZ.counts.options = EZ.options(EZ.defaultOptions.counts);
		});
		return EZcounts;
	}
	//__________________________________________________________________________________________________
	/**
	 *	returns formatted counts -- legacy: EZ.mergeMessages::mergeMessages(o, level) except arguments
	 *	TODO: support over 2 levels
	 */
	EZcounts.prototype.toString = function _toString(level)
	{
		if (this == EZcounts)
			return '...' + (EZ.counts ? 'initialized' : '');

		var o = (!level) ? this._counts : this;
		
		level = level || 0;
		var sep = (!level) ? '\n' : ', ';
		var msg = '';
		var cnt = 0;	//Object.keys ? Object.keys(o).length : 0;
		for (var k in o)
		{
			var m = '';
			if (typeof(o[k]) == 'function') continue;
			
			if (typeof(o[k]) == 'object')
			{
				m = k + ': ' + this.toString.call(o[k], level+1)
			}
			else if (isNaN(o[k]))	//not sure what should be done here
				m = k + '=' + o[k] + '';

			else
				m = k + (o[k] > 1 || cnt > 1
						   ? ' x ' + o[k]
						   : '');
			var s = sep + ((msg + m).indexOf('\n') != -1 ? '\n' : '')
			msg += (!msg
					? ''
					: s) + m;
		}
		return msg;
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 *	TODO: limited testing -- test all scenarios
	 */
	EZcounts.prototype.add = function _add(dotName, next)
	{
		if (next && next.includes('.'))
			void(0);

		var counts = this._counts;
		var args = [].slice.call(arguments);
		args.unshift(true);
		
		var obj = _getCountObject.call(this, args);
		 
		dotName = this._dotName.slice();
		var key = dotName.pop();
		void(key);
		if (this._dotName.length === 0)			//top level
		{
			obj = counts;
		}
		if (obj instanceof Object)			//existing count
		{
			obj._ = (obj._ || 0);
			obj._++;
		}
		else if (obj === undefined)			//new count -- create and set to 1
		{									
			'.'.concat(this._dotName.join('.'), '._=').ov(this._counts, {});
			obj = '.'.concat(this._dotName.join('.')).ov(counts);
			obj._ = 1;

			//obj = '.'.concat(this._dotName.join('.'), '._=').ov(counts, {});			
			//obj = '.'.concat(this._dotName.join('.')).ov(counts);
			//obj = 1;
			//obj = '.'.concat(dotName.join('.')).ov(counts);
			//obj[key] = 1;
		}
		//return counts;
	}
	//__________________________________________________________________________________________________
	/**
	 *	return Array of keys for this._counts.dotName -- empty Array if this._counts.dotName not Object
	 */
	EZcounts.prototype.getKeys = function _getKeys(dotName, msg)
	{
		[dotName, msg];									//DW lint -- arguments for docs
		var obj = _getCountObject(arguments);
		if (obj === undefined || typeof(obj) != 'object')
			return [];
			
		return Object.keys(obj);
	}
	//__________________________________________________________________________________________________
	/**
	 *	return total count for dotName and/or all child Objects
	 */
	EZcounts.prototype.getTotal = function _getTotal(dotName)
	{
		var obj = this;
	//	if (dotName === undefined && EZ.isObject(obj) && '_counts' in obj)
	//		obj = this._counts;
		
		if (EZ.getConstructorName(this) == 'EZcounts')
		{
			obj = _getCountObject.call(this, arguments);
			if (obj === undefined)
				return 0;
			dotName = this._dotName.join('.');
		}
		if (!isNaN(obj))
			return EZ.toInt(obj);
		
		var total = 0;
		for (var key in obj)
			total += EZ.counts.getTotal.call(obj[key], dotName + '.' + key);
		return total;
	}
	//__________________________________________________________________________________________________
	/**
	 *	delete this._counts[dotName] -- return undefined if not found otherwise deleted dotName property.
	 */
	EZcounts.prototype.remove = function _remove(dotName)
	{
		var obj = _getCountObject.call(this, arguments);
		if (obj === undefined)
			return undefined;
		
		dotName = this._dotName;						//dotName Array set by _getCountObject()
		var key = dotName.pop();
		var o = (dotName.length === 0) ? this._counts
									   : _getCountObject.call(this,dotName);
		delete o[key];
		return obj;
	}
	//__________________________________________________________________________________________________
	/**
	 *	build dotName from all caller arguments then return associated this._counts[dotName] value.
	 *	return undefined if no value associated with dotName and set this.oops to error message.
	 */
	var _getCountObject = function(args)
	{
		//var noOops = EZ.getConstructorName(this) == 'Boolean' ? this.valueOf() : false;
		var noOops = (typeof(args[0]) == 'boolean') ? args.shift() : false;

		var dotName = [];
		[].forEach.call(args, function(arg)
		{	
			var dotNameArray = arg === undefined ? []
							 : EZ.isArray(arg) ? arg
							 : arg.split('.');
			if (dotNameArray[0] == '.')
				dotNameArray.shift();
			dotName = dotName.concat(dotNameArray);
		});
		this._dotName = dotName;
		
		if (dotName.length === 0)
			return this._counts;
			
		var key = '.' + dotName.join('.');
		var obj = key.ov(this._counts);

		delete this._oops;
		if (obj == null && noOops !== true)
		{
			this._oops = 'unknown key: ' + key;
			if (this.options && this._oops)
				EZ.oops(this._oops);
		}
		return obj;
	}
	//__________________________________________________________________________________________________
	/**
	 *	TODO: should be created by test script
	 */
	EZcounts.prototype.testing = function(ctx)
	{
		if (this == window)
			return 'invalid context: ' + EZ.getType(this);
		var args = [].slice.call(arguments, 1)
		
		return this.apply(ctx, args); 
	}
	//==================================================================================================
	return _init();
})();
//________________________________________________________________________________________
/**
 *	
 */
//EZ.counts.testing = EZ.counts.prototype.testing;
EZ.counts.test = function()
{	
	var msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, , rtnValue];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	var _counts;
	exfn = function(results /*, testrun */)
	{
		_counts = EZ.clone(results);
		//testrun.results = results = {results: results}
	}
	notefn = function(testrun)
	{
		e = testrun;
	}
	//EZ.test.options( {exfn:exfn, note:''} )

	//EZ.test.skip(999)		//count to skip 
	//EZ.test.settings({group: 'persistant note'});
	//______________________________________________________________________________________
	var counts = EZ.counts();
	//EZ.test.run(counts.getTotal, counts)
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = ''


	ex = []
	ex[0] = {
	    _counts: {
			cat: {_:1}
		},
	    _dotName: ["cat"]
	}
	EZ.test.options( {args:ex, note:''} )
	EZ.test.run(counts.add, counts, 'cat')
	counts.add('cat');

	EZ.test.run(counts.add, counts, 'dog', 'lav')
	counts.add('dog', 'lav');

	EZ.test.run(counts.add, counts, 'cat.bo')
	counts.add('cat.bo');
	
	EZ.test.run(counts.add, counts, 'dog', 'lav.black')
	counts.add('dog', 'lav.black');
		
	EZ.test.run(counts.toString, counts)

	//console.log('counts.getTotal(): ', counts.getTotal(), ' [4] expected', '\n' + counts);
	
	//counts._counts = _counts;
	//EZ.test.run(counts.getTotal, counts)

	//______________________________________________________________________________________
	var calls = [
		"#0=ignored -- not Object",
		"#2=updated",
		"#2=converted to Number --> Object",
		
		"#2=created [Object]",
		"#2.b=updated",
		"#2=created [Object]",
		
		"#2.c=updated",
		
		"#3=updated",
		"#3=converted to Number --> Object",
		"#3=created [Object]",
		"#3.b=updated",
		"#3.b=updated",
		
		"#3=updated"
	]
	/*EZ.mergeMessages...
		ignored -- not Object: #0
		updated: #2 x 1, #2.b x 1, #2.c x 1, #3 x 2, #3.b x 2
		
		converted to Number --> Object: #2 x 1, #3 x 1
		
		created [Object]: #2 x 2, #3 x 1"
	*/
	/* counts...
		0: ignored: [object Object]
		#2: updated: [object Object], converted: [object Object], created: [object Object], b: [object Object], c: [object Object]
		
		#3: updated: [object Object], converted: [object Object], created: [object Object], b: [object Object]"
	*/
	
	var counts = EZ.counts();
	var i = 0;
	
	args = calls[i++].split('=');
	EZ.test.run(counts.add, counts, args[0], args[1])
	counts.add(args[0], args[1]);
	
	args = calls[i++].split('=');
	EZ.test.run(counts.add, counts, args[0], args[1])
	counts.add(args[0], args[1]);
	
	args = calls[i++].split('=');
	EZ.test.run(counts.add, counts, args[0], args[1])
	counts.add(args[0], args[1]);
	
	args = calls[i++].split('=');
	EZ.test.run(counts.add, counts, args[0], args[1])
	counts.add(args[0], args[1]);
	
	args = calls[i++].split('=');
	EZ.test.run(counts.add, counts, args[0], args[1])
	counts.add(args[0], args[1]);
	
	args = calls[i++].split('=');
	EZ.test.run(counts.add, counts, args[0], args[1])
	counts.add(args[0], args[1]);
	
	args = calls[i++].split('=');
	EZ.test.run(counts.add, counts, args[0], args[1])
	counts.add(args[0], args[1]);
	
	args = calls[i++].split('=');
	EZ.test.run(counts.add, counts, args[0], args[1])
	counts.add(args[0], args[1]);
	
	args = calls[i++].split('=');
	EZ.test.run(counts.add, counts, args[0], args[1])
	counts.add(args[0], args[1]);
	
	args = calls[i++].split('=');
	EZ.test.run(counts.add, counts, args[0], args[1])
	counts.add(args[0], args[1]);
	
	args = calls[i++].split('=');
	EZ.test.run(counts.add, counts, args[0], args[1])
	counts.add(args[0], args[1]);
	
	args = calls[i++].split('=');
	EZ.test.run(counts.add, counts, args[0], args[1])
	counts.add(args[0], args[1]);
	
	args = calls[i++].split('=');
	EZ.test.run(counts.add, counts, args[0], args[1])
	counts.add(args[0], args[1]);

	
	
//debugger;
/*


	calls.forEach(function(msg)
	{
		var keyMsg = msg.split('=');
		EZ.test.run(counts.add, counts, keyMsg[0], keyMsg[1])
		counts.add(keyMsg[0], keyMsg[1]);
	});


if (true) return;
EZ.test.skip(999)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	ctx = ""
	arg = ['1st arg'];
	obj = {}
	ex = [arg];
	ex.results = "supplied object variable is null"
	ex.ctx = ctx;
	
	EZ.test.options( {ex:ex, note:note} )
	EZ.test.run( ctx, arg, obj )
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	//______________________________________________________________________________
	EZ.test.options( {ex:ex, note:note})
	EZ.test.run(obj)	

	EZ.test.run(-2, 		{EZ: {ex:-2	,	note:note	}})
	
	//______________________________________________________________________________
	return;
*/
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
EZ.confirm = function EZconfirm(msg, callback)
{
	var _confirm = function()
	{
		EZ.confirm.rtnValue = confirm(msg);
		
		if (callback)
		{
			callback(EZ.confirm.rtnValue);
			delete EZ.confirm.rtnValue;
		}
		return EZ.confirm.rtnValue;
	}
	if (callback)
		setTimeout(_confirm, 0)	
	else
		return _confirm();
}
/*-----------------------------------------------------------------------------------
EZ.markers() utils
-----------------------------------------------------------------------------------*/
EZ.markers = function EZmarkers(markerName)
{
	if ( !(this instanceof arguments.callee) ) 	//if not called as constructor...
		return new EZmarkers(markerName);

	this.name = markerName + '';
	this.timestamp = new Date();
	this.list = {}

	/**
	 *	add className as marker
	 */
	this.add = function EZmarker_add(el, className, isTrue)
	{
		if (!className || arguments.length > 2 && !isTrue)
			return;

		EZ.addClass(el,className);
		this.list[className] = this.list[className] || [];
		this.list[className].push(el);
	}
	/**
	 *	clear list
	 */
	this.clear = function EZmarker_clear()
	{
		for (var className in this.list)					//clear existing markers
		{
			while (this.list[className].length)
				EZ.removeClass(this.list[className].shift(), className);
		}
		delete this.list[className];
	}
}
/*--------------------------------------------------------------------------------------------------
EZ.returnValue(ctx [, options])

whats up...

ARGUMENTS:
	ctx
	options		(optional) Object containing one or more of the following properties:
				skipCount	number of function to remove from top of stack
	...			blah blah
			Array or delimited string (values separated by commas or spaces)


RETURNS:
	new EZ.returnValue Object

REFEERENCE:
TODO:
	prototype test functions are automatically defined for caller. ??
	don't think needed since testrun Object is available
--------------------------------------------------------------------------------------------------*/
EZ.returnValue = (function _____EZreturnValue_____()
{
	//______________________________________________________________________________________________
	/**
	 *	Creates new instance of EZreturnValue() only used to copy all properties and prototypes to
	 * 	global (pseudo static) EZ.returnValue function() which acts as container for all associated
	 *	properties and prototype functions and can be called as a valid constructor.
	 */
	var _init = function()
	{
		var fn = new EZreturnValue();
		fn._data = {};
		for (var key in fn)
			EZreturnValue[key] = fn[key];
		return EZreturnValue;
	}
	//______________________________________________________________________________________________
	/**
	 *	EZ.returnValue() constructor -- does a lot of setup()
	 *	TODO:
	 *		call EZ.options
	 *		count recursive calls
	 */
	function EZreturnValue(ctx, options, rtnValue)
	{
		var caller = arguments.callee.caller;
		var _isCallerConstructor = (ctx && ctx != window && typeof(ctx) == 'object');

		var me = arguments.callee;
		if ( !(this instanceof me) )				//NOT called as constructor..
		{											
			if (rtnValue instanceof me)
				return rtnValue;
				
			else if (rtnValue !== true				//return current caller global if recursive
			&& caller.returnValue instanceof Object
			&& caller.returnValue.getReturnValueVersion
			&& caller.returnValue._EZreturnValueCount
			&& caller == caller.arguments.callee)
			{										//bump counter and return prior Object
				caller.returnValue._EZreturnValueCount++;
				return caller.returnValue;
			}
			return new me(ctx, options);
		}
		if (!EZ.returnValue) return;				//bail if called by _init()

		caller.rtnValue = caller.returnValue = this;//also save as caller static global

		this._EZreturnValueCount = 1;
		this._isCallerConstructor = _isCallerConstructor;
		this._options = options = options || {};
		this._version = '12-01-2016';
		var rtnValue = this;
		var data = this._data = {};					//data used by caller and returned
		
		data.value = undefined;						//defaults data properties
		data.success = true;
		
		data.message = [];							
		data.details = [];
		data.lists = {};
		data.values = {};
		
		if (_isCallerConstructor)					//save caller "this" context if constructor		
		{
			this._ctx = ctx;			 			
			ctx._data = data;
		}

		var callerName = caller.name || caller.displayName || '-NA-';
		var isTestCall = (EZ.test && EZ.test.running && EZ.test.running.includes(callerName))
		if (isTestCall)
		{
			this._testMode = true;
			this._testrun = EZ.test.run.testrun;
			EZ.test.run.rtnValue = rtnValue;
			EZ.test.run.options = options;
			if (options.returnType)						//temp backward compatibility
				options.returnFormat = options.returnType;
		}
		this.isTestMode = function()
		{
			return Boolean(this._testMode);
		}
		//______________________________________________________________________________________________
		/**
		 *	If options.bindReturnValue is true, bind all functions except toString() and valueOf()
		 *	to EZ.returnValue() caller "this" context.
		 *
		 *	This makes this Object available if EZ.returnValue()'s caller returns itself as a custom Object.
		 *	e.g. ... EZ.equals.getFormatted() -- may be better to bind EZ.equals fn's to rtnValue ??
		 */
		function _bind()
		{
			if (rtnValue._ctx)
			//if (rtnValue._isCallerConstructor)
			{
				Object.keys(rtnValue).forEach(function(key)
				{
					if (typeof(rtnValue[key]) == 'function')
						ctx[key] = rtnValue[key].bind(rtnValue);
				});
			}
		}
		//______________________________________________________________________________________________
		/**
		 *	None of these functions available to global EZ.returnValue()
		 */
		//if (!EZ.test && !EZ.test.running)			//may want to omit when testing any fn...
		{											//...does not play well with debugger
			this.toString = function(format)
			{										
				return (format) ? rtnValue.getValue(format) 
					 : (this._returnValue) ? this._returnValue	//set by this.save()
					 : this.valueOf('string');
			}
			this.valueOf = function(format)
			{
				var data = this.getData();
				return (format) ? this.getValue(format) 
								: data.value;
			}
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
		this.getReturnValueVersion = function()
		{
			return this._version || 'na';
		}
		/**
		 *	calls setValue(value) if value supplied
		 *	then returns value as specified returnType: use at end of function:
		 *
		 *		e.g. return rtnValue.save(value);
		 *
		 *	cleans up "this" data if testMode -- including removing testrun Object
		 */
		this.save = function(value, format)
		{
			var data = this.getData();
			if (arguments.length)
				this.setValue(value, format);

			Object.keys(data).forEach(function(key)
			{
				if (key == 'value') return;
				
				var val = data[key];
				if (val instanceof Object && Object.keys(val).length === 0)
					delete data[key]

				else if (key == 'lists')
				{
					for (var i in val)
					{							//consolidate mergedMessages lists
						if (val[i] instanceof Object && val[i].length === undefined)
							val[i] = EZ.mergeMessages(val[i]).replace(/ x 1(,|$)/g, '$1');
					}
				}
			});
			var ctx = this._ctx;
			delete  this._ctx;
			if (ctx 							//only avail if caller is constructor
			&& (format === ctx || format == 'this' || !this.getOptions().returnFormat))
				return ctx;				
			else if (format instanceof Object)
				return format;
				
			value = this.getValue(format);
			if (value instanceof Object || !ctx)
				return value;
			
			this._returnValue = value;			//used by toString()
			return this;
		}
		/**
		 *
		 */
		this.getOptions = function()
		{
			return this._options || {};
		}
		/**
		 *
		 */
		this.setOptions = function(options)
		{
			this._options = options;
		}
		/**
		 *
		 */
		this.setValue = function(value, format)
		{
			var data = this.getData();
			if (!format || format instanceof Object)
			{
				data.value = value;
				return this.getValue();				//return as specified returnType or "as-is"
			}
			else
			{
				data.valueFormats = data.valueFormats = (data.valueFormats || {});
				if (typeof(format) == 'string')
					format = format.trim().toLowerCase();
				data.valueFormats[format] = value;
				return value;
			}
		}
		/**
		 *	returns value as specified returnFormat otherwise value as-is if not supplied or "value"
		 *	for returnFormat=false, null, und=fined or blank,  returns value "as-is"
		 *	for returnFormat=true or "true", return "this" EZreturnValue Object with all functions
		 */
		this.getValue = function(returnFormat)
		{
			var data = this.getData();
			var value = data.value;

			var format = returnFormat || this.getOptions().returnFormat;
			format = (typeof(format) == 'string') ? format.trim().toLowerCase()
				   : !(format instanceof Object) ? format
				   : (format instanceof EZ.returnValue) ? 'this'
				   : EZ.isNative(format) ? typeof(format)
				   : format;
			if (format instanceof Object)
				return format;
			
			if (data.valueFormats && format in data.valueFormats)
				return data.valueFormats[format];
			
			else if (this._ctx && format === this._ctx)
				return this._ctx;				//only avail if caller is constructor
			
			switch (format || '')
			{
				case 'this': 
				case 'rtnValue': 
				case 'returnValue': 
				{
					return this;
				}
				case '': 
				{
					return value;				//return value as-is
				}
				case 'boolean':
				{
					return value instanceof Object ? Object.keys(value).length
						 : value;
				}
				case 'string':
				{
					return (value instanceof Object) ? EZ.stringify(value, '*')
													 : value + '';
				}
				case 'number':
				{
					return isNaN(value) ? NaN : Number(value);
				}
				case 'date':
				{
					return (value instanceof Date) ? value
						 : typeof(value) == 'number' ? new Date(value.getTime())
						 : new Date('')				//Invalid Date
				}
				case 'regexp':
				{
					if (value instanceof RegExp) return value;
					try
					{
						return new RegExp(value);
					}
					catch (e) {}
					return new RegExp()
				}
				case 'function':return value;		//TODO: ??
				case 'array': 	return EZ.toArray(value);	//TODO: EZ.toObjectLike()
				case 'object': 	return value;

				default:							//unlikely but added for completeness
				{									//true, false, null, undefined , NaN, Infinity
					return format;
				}
			}
			return value;
		}
		//______________________________________________________________________________________
		/**
		 *	set, get values
		 */
		this.set = function set(key, value)
		{
			var data = this.getData();
			data.values = data.values || {};
			data.values[key] = value;
			return this.get(key);
		}
		this.get = function get(key, defaultValue)
		{
			var data = this.getData();
			var values = data.values || {};
			return (key in values) ? values[key]
				 : (arguments.length > 1) ? defaultValue
				 : undefined;
		}
		//______________________________________________________________________________________________
		/**
		 *	return status of function -- "na" unless setOk() or setFail() called
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
		//______________________________________________________________________________________
		/**
		 *	info
		 */
		this.addInfo = function(msg)
		{
			var data = this.getData();
			data.info = data.info || [];
			(EZ.isArray(msg)) ? data.info = data.info.concat(msg).remove()
							  : data.info.push( (msg+'').trim() );
		}
		this.getInfo = function()
		{
			return this.getData('info') || [];
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
			{
				data.success = false;
				message.push(msg);
			}
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
		this.setKeyValue = function(name, key, value)
		{
			var data = this.getData();
			data.lists = data.lists = (data.lists || {})
			var list = data.lists[name] = (data.lists[name] || {})
			return list[key] = value;
		}
		this.getKeyValue = function(name, key)
		{
			var data = this.getData();
			data.lists = data.lists = (data.lists || {})
			var list = data.lists[name] || {};
			return list[key];
		}
		this.addListItem = function(name, value, dotName)
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
		this.getLists = function()
		{
			return this.getData('lists')
		}
		this.haveList = function(name)
		{
			var data = this._data;
			var lists = data.lists || {};
			return Boolean(lists[name]);
		}
		//==========
		_bind()
		//==========
	}
	//==================================================================================================
	return _init();
})();
/*--------------------------------------------------------------------------------------------------
EZ.returnValue_user_caller = function ____returnValue_user_caller(options)
{
	var value;
	options = options || {};
	if (options.asNew)
		value = new EZ.returnValue_user(options)
	else
		value = EZ.returnValue_user(options)
	g.value = value;	//research
	return value;		//always returns this when called as new
}
--------------------------------------------------------------------------------------------------*/
EZ.returnValue_testBridge = function ___returnValue_testBridge(value, options)
{
	var rtnValue = new EZ.returnValue(this, options);
	//rtnValue.set('keys', Object.keys(rtnValue))
	rtnValue.set('babe', 'Brenda')
	
	rtnValue.setValue(value)
	if (value.startsWith('return'))
		return rtnValue.save(value);
	
	var formats = {};
	var types = 'string number'.split(/\s+/);
	types.forEach(function(t)
	{
		formats[t] = rtnValue.getValue(t)
	});
	return rtnValue.save(formats);
}
EZ.returnValue_testBridge.test = function _____returnValue_test()
{
	var msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */
	e = [msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//======================================================================================
	/*NOTES:
	rtnValue.get('key') and rtnValue.set('key',value) update rtnValue._values.

	When test function called in testMode: EZ.test.run.values = rtnValue._values;
	*/
	exfn = function(testrun)
	{
		testrun.setResultsArgument('1st', EZ.test.run.values, 'EZ.test.run.values');
		testrun.appendNote('1st actual return argument set to ' + 'EZ.test.run.values'.wrap('<cite>'));

		var rtnValue = testrun.getReturnValue();
		var rtnValuePruned = rtnValue.removeKeys('','Function');

		testrun.setResultsArgument('2nd', rtnValuePruned, 'rtnValue')
		testrun.appendNote('2nd actual return argument set to pruned ' + 'rtnValue'.wrap('<cite>'));
	}
	//======================================================================================
	EZ.test.settings({exfn:exfn});
	//_______________________________________________________________________________________

	EZ.test.run('return value',   {returnType:false}, 		{EZ: {call:'', }})
	EZ.test.run('return rtnValue',{returnType:true}, 		{EZ: {call:'', }})
	EZ.test.run('return called as new'	 ,{},							{EZ: {call:'new'}})
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	EZ.test.run('return value',   	{returnType:false, testMode:false}, 	{EZ: {call:'', }})
	EZ.test.run('return rtnValue',	{returnType:true, testMode:false}, 		{EZ: {call:'', }})
	EZ.test.run('return called as new',	{testMode:false}, 						{EZ: {call:'new'}})
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	//_______________________________________________________________________________________
	EZ.test.settings({exfn:null});

	EZ.test.run('str', {returnFormat:''})
	EZ.test.run('str but new()', {returnFormat:'string'},	{EZ: {call:'new', }})
	EZ.test.run('str', {returnFormat:'string'})
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//EZ.test.options( {ex:ex, note:note} )
	//EZ.test.run( ctx, arg, obj )

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//_______________________________________________________________________________________
	if (true) return;
}

/*______________________________________________________________________________________________

functions ported from EASY js -- new functions and updates to be ported back to EASY js
______________________________________________________________________________________________*/

/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function EZisTrueLike(value, options)
{
	if (EZ.isTrueLike) return EZ.isTrueLike(value, options);
	
	if (value === true || value === 'true'
	|| value === 'on' || value === 'yes') return true;

	if (typeof(value) == 'object' && !EZ.isNone(value)) return true;

	return false;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function EZisFalseLike(value)
{
	if (value === false || value === 'false'
	|| value === null || value == EZ.undefined
	|| value === 'off' || value === 'no' || value === '') return true;

	if (EZ.isNone(value)) return true;
	return false;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
if (EZ && EZ.global && EZ.global.setup) EZ.global.setup('EZ', 'EZadvanced');
