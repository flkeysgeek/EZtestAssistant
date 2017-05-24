/*global 
	EZ, e:true, g, dw, DWfile,
	EZgetPref, EZgetEl, EZgetValue, EZsetValue, EZnone,


	t_doc, t_html, t_head, t_title, t_body, t_wrap, t_labels, t_inputs,
	t_forms, t_fm,  t_none, t_tags, t_array, t_divs, t_radios, t_radio01,
	t_label_some, t_mixed, t_idandclass

*/

var e;
(function jshint_globals_not_used() {	//list global variables and functions defined but not used
if (typeof(window) != 'undefined') window.dw = {isNotDW: true}
e = [
	e, g, dw, DWfile, EZgetPref,  
	EZgetPref, EZgetEl, EZgetValue, EZsetValue, EZnone,
	
	t_doc, t_html, t_head, t_title, t_body, t_wrap, t_labels, t_inputs,
	t_forms, t_fm,  t_none, t_tags, t_array, t_divs, t_radios, t_radio01,
	t_label_some, t_mixed, t_idandclass 
	
]})


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
//________________________________________________________________________________________
/**
 *	
 */
EZ.is.test = function()
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
	//EZ.test.settings({group: 'persistant note'});
	//_______________________________________________________________________________________
	//EZ.test.settings( {exfn:exfn} )				//exfn called if EZ.test.options() not called
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	note = '';
	ex = '';
	obj = EZ.options();
	
	EZ.test.run(obj, EZ.options,		{EZ: {ex:true,	note:note	}})
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	//_______________________________________________________________________________________
	//EZ.test.options( {ex:ex, note:note} )
	//EZ.test.run( ctx, arg, obj )

	if (true) return;
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
	//if (EZ.debug() || (EZ.test.debug && EZ.test.debug[arguments.callee.name])) debugger;
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

//	if (obj.childNodes != null) return false;
	if (obj instanceof Element) return false;

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
		EZ.oops('EZ.ArrayLike exception -- returns false', e)
		//EZ.techSupport(e, 'EZ.ArrayLike catch')
	}
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

Determine if argument is an html form field or any other document element (except EZnone) including
Array of elements -and- non-empty NodeList or HTMLCollection as described for options below:

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
EZ.isFault(obj)
--------------------------------------------------------------------------------------------------*/
EZ.isFault = function EZisFault(obj)	
{	
	return (obj instanceof Object && obj.constructor == EZ.fault)
}
/*--------------------------------------------------------------------------------------------------
EZ.EZisNative(fn)
--------------------------------------------------------------------------------------------------*/
EZ.isNative = function EZisNative(fn)	
{	
	if (typeof(fn) == 'function')
		return Function.prototype.toString.call(fn).includes('[native');
	
	if (fn instanceof Object)
		return Function.prototype.toString.call(fn.constructor).includes('[native');
	/*
	if (fn instanceof Object)
	{
		if (typeof(fn) == 'function')
			fn = fn.constructor;
		if (typeof(fn) != 'function')
			return false;
		var script = Function.prototype.toString.call(fn);
		return /\{\s*\[native code\]\s*\}/.test(script);
	}
	*/
	return false;
}


//___________________________________________________________________________________________
EZ.isNative.test = function()
{	
	var msg, arr, ctx, arg, args, o, obj, note, ex, exfn, notefn, fn, val, rtnValue;
	e=[ msg, arr, ctx, arg, args, o, obj, note, ex, exfn, notefn, fn, val, rtnValue ];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//_______________________________________________________________________________________
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	o = EZ.options()
	EZ.test.run(o			,{EZ: {ex:false}})
	EZ.test.run(true		,{EZ: {ex:true }})
	EZ.test.run(6			,{EZ: {ex:true }})
	EZ.test.run(String('6')	,{EZ: {ex:true }})
	EZ.test.run(Number('6')	,{EZ: {ex:true }})
	EZ.test.run(Date		,{EZ: {ex:true }})
	EZ.test.run(new Date()	,{EZ: {ex:false}})
	EZ.test.run(/./			,{EZ: {ex:false}})
	EZ.test.run(RegExp		,{EZ: {ex:true }})
	EZ.test.run(Function	,{EZ: {ex:true }})
	fn = function() {}
	EZ.test.run(fn			,{EZ: {ex:false}})
	
	EZ.test.run([]			,{EZ: {ex:true }})
	EZ.test.run([].forEach	,{EZ: {ex:true }})
	EZ.test.run([6]			,{EZ: {ex:false}})
	EZ.test.run([].remove	,{EZ: {ex:false}})

	//_______________________________________________________________________________________
	if (true) return;
	EZ.test.quit;	//script continues but all following test skipped
}
/*--------------------------------------------------------------------------------------------------
EZ.isObjectCircular(obj)

return empty string if Object NOT circular otherwise error message of the following form:
	circular Object.keys(): [a,1, ...];	

EZ.message set to returned message as convenience when calling as: if (EZ.isObjectCircular(obj))
EZ.object set to error message as object -- suitable for JSON.stringify()
EZ.json set to json form of error message -- e.g. "circular Object.keys()": ["a",1, ...];	

NOTE:
	EZ.stringify(...) eliminates need for this test
	EZ.stringify(obj,'native') will call JSON.stringify() and gracefully handle circular exceptions
--------------------------------------------------------------------------------------------------*/
EZ.isObjectCircular = function EZisObjectCircular(obj)	
{	
	var me = EZ.isObjectCircular;
	me.object = {};
	me.message = '';
	me.json;

	if (obj instanceof Object)
	{
		try
		{
			JSON.stringify(obj);
		}
		catch (e)
		{
			var o = { "circular Object.keys()": Object.keys(obj) };
			if (!/circular/i.test(e.message))
				o[e.constructor.name] = e.message;
			
			me.object = o;
			me.json = JSON.stringify(o);
			me.message = "circular Object.keys(): " + Object.keys(obj).join(',').wrap('[]');
		}
	}
	return me.message;
}
/*--------------------------------------------------------------------------------------------------
EZ.isObjectLike(obj)
--------------------------------------------------------------------------------------------------*/
EZ.isObjectLike = function EZisObjectLike(obj)
{
	if (!obj || typeof(obj) != 'object' || obj instanceof Element)
		return false;

	var keys = Object.keys(obj);
    return Boolean(keys.join('').match(/\D+/));
	
	/*
	if (!obj || typeof(obj) != 'object' || EZ.isEl(obj))
		return false;

	var keys = Object.keys(obj);
	return keys.match(/ \D+/g);
	*/
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
EZ.isConstructor = EZ.isFunction = function EZisConstructor(arg, choices)
{
	var is = EZ.toArray(choices).some(function(choices)
	{
		if (typeof(choices) == 'function')
			return (typeof arg == 'object' && arg.constructor == choices);
	
		else if (typeof(arg) == 'function')
			return (typeof choices == 'object' && choices.constructor == arg);
	});
	return is;
}
/*--------------------------------------------------------------------------------------------------
Determine if object is empty -- do NOT use EZ.isTrue() it uses this function.

legacy: true if any propery or function defined

latest:
	true if o.valueOf() false and length is 0 -OR- has non-hasOwnProperty property

TODO:
	use EZ.store _isEmpty()
--------------------------------------------------------------------------------------------------*/
EZ.isEmpty = function EZisEmpty(o, options)
{													//return true if not Object
	if (o == null || 'object function'.indexOf(typeof(o)) == -1) return true;

	// Only Revize extension reference is in RevizeResouces::RZgetTemplateList()
	if (EZ.isLegacy(options))
	{
		return EZ.oops('legacy code not tested')
		for(var i in o) {return false;}
		i = i;
		return true;
	}
	/*03-10-2017: depricated 
	if (Object.keys)
		return (!Object.keys(o).length)
	*/

	var keys = Object.keys(o);
	var isFound = keys.some(function(key)
	{
		return !key.startsWith('~');
	});
	if (isFound)
		return false;
	
	/*													
	// true (i.e. empty) when valueOf() false and length === 0
	if (!o.valueOf() && (!EZ.isArrayLike(o) || !o.length)) return true;

	// false (i.e. not empty) if has any property of its own (i.e. not from prototype)
	for (var p in o)
		if (p !== '' && (!o.hasOwnProperty || o.hasOwnProperty(p)))
			return false;
	*/

	return true;
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
	setRules(EZ.toArray(options,','));

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
return true if funcName is fn being tested otherwise false
--------------------------------------------------------------------------------------------------*/
EZ.isTestFunction = function EZtrueFalseValue(funcName)
{
	return (funcName && EZ.test && EZ.test.data && EZ.test.data.funcName == funcName);
}
/*-----------------------------------------------------------------------------
EZ.isNative(fn)

USAGE:
	isNative(alert); 			// true
	isNative(myCustomFunction); // false
-----------------------------------------------------------------------------*/
/*
;(function() {

  // Used to resolve the internal `[[Class]]` of values
  var toString = Object.prototype.toString;
  
  // Used to resolve the decompiled source of functions
  var fnToString = Function.prototype.toString;
  
  // Used to detect host constructors (Safari > 4; really typed array specific)
  var reHostCtor = /^\[object .+?Constructor\]$/;

  // Compile a regexp using a common native method as a template.
  // We chose `Object#toString` because there's a good chance it is not being mucked with.
  var reNative = RegExp('^' +
    // Coerce `Object#toString` to a string
    String(toString)
    // Escape any special regexp characters
    .replace(/[.*+?^${}()|[\]\/\\]/g, '\\$&')
    // Replace mentions of `toString` with `.*?` to keep the template generic.
    // Replace thing like `for ...` to support environments like Rhino which add extra info
    // such as method arity.
    .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );
  
  function isNative(value) {
    var type = typeof value;
    return type == 'function'
      // Use `Function#toString` to bypass the value's own `toString` method
      // and avoid being faked out.
      ? reNative.test(fnToString.call(value))
      // Fallback to a host object check because some environments will represent
      // things like typed arrays as DOM methods which may not conform to the
      // normal native pattern.
      : (value && type == 'object' && reHostCtor.test(toString.call(value))) || false;
  }
  
  // export however you want
  module.exports = isNative;
}());
*/
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
//called from EZ.prototype_only.js -- too early here
//if (EZ && EZ.global && EZ.global.setup) EZ.global.setup('EZ', 'EZis');
