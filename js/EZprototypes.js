/*__________________________________________________________________________________________________

Flagship or salient differiencators are:
	-returns pseudo elementwhen no element match selector to avoid js error
	 when following assumes element(s) are always returned
	-built-in unit testing and documentation
	-works as standalone lightwieght jquery-like library or as jquery wrapper
	-easy error and/or stacktrack repoting
----------------------------------------------------------------------------------------------------
For new organizational structure, functions moving from EZ.core to one of the following files:

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

Object prototypes defined to avoid need to check hasOwnProperty in loops.

Function.prototype.bindTODO = function bindEZprototypeFunction(scope)
{	//Breaks EZsortable drag
    var fn = this;
    return function () { return fn.apply(scope) };
}
__________________________________________________________________________________________________*/

/*--------------------------------------------------------------------------------------------------
EZ(el,options) -- primary EZ Object defined as Function

returns single element or Array of elements if el is Array of selectors.
--------------------------------------------------------------------------------------------------*/
function EZ(el, options)
{
	var args = [].slice.call(arguments).concat([ {defaults:{legacy:false}} ]);
	return EZgetEl.apply(this, args);
	return EZ.getEl(el, options == false);	//from unit test
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
EZ.test.capture = function EZtestCapture() {return false}
EZ.test.capture.mode = false;
EZ.test.debug = function EZtestDebug() {return false}
EZ.test.run = function EZtestRun() {return false}
EZ.testSample = function EZtestSample(arg,other) {return arg}
EZ.testSample.test = function()
{
//	EZ.test.run(1,		{EZ: {ex:1		}})
	EZ.test.run([1,2],	{EZ: {ex:[1,2]	}})
}
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
 *	Stubs for functions with full script in other files
 */
EZ.dom = {};
EZ.json = {};
EZ.event = {};
EZ.util = {};
EZ.getPref = function EZgetPref(key, defaultValue) {return defaultValue};


/*---------------------------------------------------------------------------------------------
Diagnostic and research tool
---------------------------------------------------------------------------------------------*/
EZ.json.nodeLogger = function nodeLogger(key, value)
{
	var log = EZ.json.log = EZ.json.log || [];
	log.push(
		'key=' + JSON.stringify(key).replace(/"/g,'')
		+ '\t\t' +
		'value=' + JSON.stringify(value) + '\n\t\t' +
		JSON.stringify(this).replace(/"/g,'') // parent
	);
	return value;
}
/*---------------------------------------------------------------------------------------------
EZ.json.parse(value)

Extend navive JSON.parse to support pseudo json created by EZ.json.stringify() for named Array
properties and Regular Expressions -- For Details: see EZ.json.stringify()

Removes \n and quotes Object keys before parsing if necessary.  Returns value is not String.
---------------------------------------------------------------------------------------------*/
EZ.json.parse = function EZjson_parse(value)
{
	if (typeof(value) != 'string') return value;
	value = value.trim();

	var pattern = /([{,]\s*)(\w+):(?!=\/)/g;
	if (pattern.test(value))
		value = value.replace(pattern, '$1"$2":');	//quote keys

	if (/\\n/.test(value))
		value = value.replace(/\n/g, '');			//remove newlines

	if (/\n/.test(value))
		value = value.replace(/\n/g, '');			//remove newlines

	//======================================
	var obj = JSON.parse(value, EZjson_format);
	return obj;
	//======================================
	//__________________________________________________________________________________________
	/**
	 *	called for children before parents
	if (value.indexOf('@__') != -1)					//multiline Strings
	{
		value = value.replace(/@__\n([\s\S]+?)__@/gi, function(all, str)
		{											//drop prefix/suffix
			return str.replace(/@\n/g, '\\n');		//unescape @\n --> \\n
		});
	}
	function EZjson_format(key, value)
	{
		//return RegExp object for string of form "RegExp:/.../gim"
		if (typeof(value) == 'string')
		{

			if (value == '@@undefined@@')
			{
				return undefined;
			}
			else if (value.indexOf('RegExp:/') == 0)	//RegExp
			{
				var e;
				try
				{
					var regex = value.match(/^RegExp:\/([\s\S]*)\/([gim]*)/);
					if (regex)
						return new RegExp(regex[1], regex[2]);
				}
				catch (e) {}
			}
			return value;
		}
		if (typeof(value) == 'string' && value.indexOf('RegExp:/') == 0)	//RegExp
	 */
	function EZjson_format(key, value)
	{
		//return RegExp object for Object of form "{"RegExp":"/.../gim}"
		if (Object.prototype.toString.call(value) === '[object Object]'
		&& Object.keys(value).join('') == 'RegExp' && typeof value.RegExp == 'string')
		{
			var e;
			try
			{
				var regex = value.RegExp(/^\/([\s\S]*)\/([gim]*)/);
				if (regex)
					return new RegExp(regex[1], regex[2]);
			}
			catch (e) {}
			return value;
		}

		// if Array and last item is pseudo properties Object of the form:
		//		{"_____keys____": # {key1: value1, key1: value1, ...}
		// remove item from Array and use to create named Array properties.
		var isArray = Object.prototype.toString.call(value) === '[object Array]';
		while (isArray && value.length)
		{
			var properties = value[value.length-1];
			if (!properties || typeof(properties) != 'object') break;

			var keys = Object.keys(properties);
			if ((keys.length-1) !== properties['_____keys_____']) break;

			keys.forEach(function(key)			//transfer key values to Array object
			{
				if (key != '_____keys_____')
					value[key] = properties[key];
			});
			value.splice(value.length-1, 1);	//then delete pseudo Array item
			break;
		}
		return value;
	}
}
//_____________________________________________________________________________________________
EZ.json_parse = EZ.json.parse;
EZ.json_parse.test = function()
{
	var ex = 'na';
	var note = '';
	var json = '';
	//______________________________________________________________________________

	// #1
	ex = EZ.global.testdata.include;
													note = 'ObjectLike Array with '
														 + 'named keys'
	jsonHTML();
	EZ.test.run(json,										{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #2
	ex = EZ.global.testdata.person
													note = 'Object same as native\n'
														 + 'except keys not quoted'
	jsonHTML();
	EZ.test.run(json,										{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #3
	ex = EZ.global.testdata.array
													note = 'Pure Array -- no item '
														 + 'contains an object so: '
														 + 'Array is not indented '
														 + 'but space after comma'
	jsonHTML();
	EZ.test.run(json,										{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #4
	ex = EZ.global.testdata.arraySparse
	//ex = ex.replace(/null/, /undefined/)
													note = 'Array sparely poulated '
														 + 'item[2] undefined but '
														 + 'native stringify treats '
														 + 'as null'
	jsonHTML();
	ex[2] = null;
	EZ.test.run(json,										{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #5
	ex = EZ.global.testdata.personArrayLike
													note = 'ArrayLike Object: same '
														 + 'as native stringify '
														 + 'except: keys not quoted '
	jsonHTML();
	EZ.test.run(json,										{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #6
	ex = '';										note = 'empty string exactly '
														 + 'as native stringify '
	jsonHTML();
	EZ.test.run(json,										{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #7
	ex = null;										note = 'null exactly same '
														 + 'as native stringify '
	jsonHTML();
	EZ.test.run(json,										{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #8
	ex = EZ.global.testdata.objectLike;
													note = 'ObjectLike Array has\n'
														 + 'named keys - IGNORED '
														 + 'by native stringify'
	jsonHTML();
	EZ.test.run(json,										{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #9
	var a = EZ.global.testdata.array.slice();
	a.push(EZ.global.testdata.person)
	ex = a;

	note = 'Array format same as native when ANY array item contains object '
		 + 'except: keys unquoted and spaces after Array item commas'
	jsonHTML();
	EZ.test.run(json,										{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #10
	ex = EZ.global.testdata.fuse;

	note = 'Fuse Object with embedded ObjectLike include Array with named keys'
	jsonHTML();
	EZ.test.run(json,										{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #11
	ex = EZ.global.testdata.arraySparsePlus;
														note = 'complex Array with '
															 + 'no ObjectLike Arrays '
	jsonHTML();
	EZ.test.run(json,										{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #12
	ex = EZ.global.testdata.objectLikeMore;
														note = 'complex ObjectLike'
	jsonHTML();
	EZ.test.run(json,										{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #13
	ex = /\s*(a|b|c)/gim;
														note = 'RegExp Standalone'
	jsonHTML();
	EZ.test.run(json,										{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #14
	ex = [/\s*(a|b|c)/gim];								note = 'RegExp in Array'
	jsonHTML();
	EZ.test.run(json,										{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #15
	ex = {pattern: /\s*(a|b|c)/gim};
														note = 'RegExp in Object'
	jsonHTML();
	EZ.test.run(json,										{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #16
	ex = EZ.global.testdata.arraySparsePlus;
														note = '20 items'
	jsonHTML();
	EZ.test.run(json,										{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #17
	ex = EZ.global.testdata.multiline;
														note = 'multiline String'
	jsonHTML();
	EZ.test.run(json,										{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________



	function jsonHTML()
	{
		json = JSON.stringify(ex, null, 4)
		note += '<br>native JSON:<br>' + json.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')
		json = EZ.stringify(ex);
	}
}

/*---------------------------------------------------------------------------------------------
EZ.json.stringify(value, replacer, spaces)

Extend navive JSON.stringify() as follows:

	Non-numeric enumerable Array keys are stringified by creating Object of the following form
	and adding to the Array as pseudo item:

	 	{
			_____keys_____: <keyCount>,
			key1: value1,
			key2: value2 ...
		}

	RegExp Objects stringify as a String of the following form:

		"RegExp:/\\s*(a|b|c)gim"

	Multiline String are formatted in the following form:
			@--
			John Tyler III, President@
			Keys Adventures, Inc@
			123 Palms, Suite Q@
			Key Largo, FL 80209__@

	Array items are only indented on a separate line, if they contain Object, Array, RegExp, multiline
	or large String.
	Otherwise items formatted together on a single line with a single space after
	the comma separator (up to items per line limit)
	up to:

NOTE:
	EZ.json.parse() removes the pseudo item and uses to create named Array keys,
	creates RegExp and converts multiline String to standard json format.


EXAMPLES:
	[1, 2, 3, "x", "y', "z", true, false]
-OR-
	[
		1, 2, 3, true, false,
		{
			letters: 'abcdefghijklmnopqreswxyz',
			numbers: '0123456789'
		}
		"red", "yellow", "green",
		{
			_____keys_____: 2,
			pattern: "RegExp:/\\s*(a|b|c)/gim",
			sisters: ["Pam", "Sandy"]
		}
	]

ARGUMENTS:		same as JSON.stringify

	value		object to stringify

	replacer	Array or key names extracted from Object and converted to json.  Names prefixed
				with minus sign (-) are not extracted -- all others formatted as json.
				DOES NOT allow nodeVisitor function.  Uses the internal EZformat() function.

	spaces		Number of spaces to indent each json level or String prefix. If omitted and
				replacer is number or string, it defined spaces.
				default: 4

TODO:
	support nodeVisitor replacer function
	support undefined values??
	break long list of Array items into multiple lines

REFERRENCE: nice JSON doc
	http://speakingjs.com/es5/ch22.html
---------------------------------------------------------------------------------------------*/
EZ.json.stringify = function EZstringify(value, replacer, spaces, options)
{
	//----- process arguments
	if ('object function'.indexOf(typeof replacer) == -1)
	{									//replacer omitted -- shift arguments
		options = spaces;
		spaces = replacer;
		replacer = null;
	}
	if  (Object.prototype.toString.call(spaces) == '[object Object]')
	{									//spaces omitted -- shift arguments
		options = spaces;
		spaces = null;
	}
	else if (Object.prototype.toString.call(options) != '[object Object]')
		options = {};					//options omitted -- default
	spaces = spaces || 4;

	//----- Set default options
	options.keepNaN 		= options.keepNaN || false;
	options.keepUndefined 	= options.keepUndefined || false;
	options.keepRegExp 		= options.keepRegExp || true;
	options.keepArrayKeys 	= options.keepArrayKeys || true;
	options.keepFunctions 	= (options.keepFunctions || true) //requires...
						 ///	&& Function.getArguments && Function.getBody;

	options.maxItemsPerLine = options.maxItemsPerLine		|| EZ.json.stringify.MAX_ITEMS_PER_LINE;
	options.maxItemsLineLength = options.maxItemsLineLength || EZ.json.stringify.MAX_ITEMS_LINE_LENGTH;

	//----- setup work varibles
	var arrayLevel = 0,
		skip = [],						//do not extract / stringify keys
		only = '', 						//only extract keys -- overrides only
		padding = isNaN(spaces) 		//padding specifed by spaces with \n prefix
				? spaces : '\n' + '      '.substr(0,spaces || ''),
										//called for every node before EZjson_format()
		nodeVisitor = typeof(replacer) != 'function' ? null : replacer;

	if  (Object.prototype.toString.call(replacer) === '[object Array]')
	{
		replacer.forEach(function(key)	//for each specified key . . .
		{
			if (typeof(key) != 'string') return;

			if (key.substr(0,1) == '-')
				skip.push(key.substr(1));	//skip key if starts with dash
			else
				(only || []).push(key);		//otherwise, add to only list
		});
	}

	//------------------------------------------------------
	var json = JSON.stringify(value, EZjson_format, spaces);
	//------------------------------------------------------
	if (json == undefined) return json;

	//----- unescape EZjson_format() escape codes
	json = json.replace(/("@@=@|@=@@"?)/g, '');		//remove outer quotes
	json = json.replace(/@@~@@/g, '"');				//unescape inner quotes

	json = json.replace(/\\n/g, '\n');				//convert \\n --> \n
	json = json.replace(/@@#@@/g, '\\\\');			//unescape backslashes
	json = json.replace(/@@EOL@@/g, '\n');			//... \n
	json = json.replace(/@@@@/g, '\\n');			//... \\n

	json = json.replace(/([{,]\s+)"([\w_]+?)":/gi, function(all, sep, key)
	{												//un-quote Object keys
		if ('null undefined'.indexOf(key) != -1) return all;
		return sep + key + ":"
	});
	//==========
	return json;
	//==========
	//______________________________________________________________________________
	/**
	 *	process Array, RegExp or multiline String
	 */
	function EZjson_format(key, value)
	{
		if (nodeVisitor)						//TODO: not tested
		{
			value = nodeVisitor(value, EZjson_format, spaces);
		}
		var json = '';
		if (value === null) return null;

		  //--------------------------\\
		 //----- format undefined -----\\
		//------------------------------\\
		if (value == undefined)					//TODO: not complete
		{
			return options.keepUndefined ? undefined : null;
		}

		  //--------------------\\
		 //----- format NaN -----\\
		//------------------------\\
		if (typeof(value) == 'number' && isNaN(value))
		{											//TODO: not tested
			return options.keepNaN ? NaN : null;
		}

		  //---------------------------------\\
		 //----- format multiline String -----\\
		//-------------------------------------\\
		else if (typeof(value) == 'string' && value.includes('\n'))
		{											//TODO: check option
			return '@@EOL@@' + value.replace(/\n/g, '@@@@@@EOL@@');
		}

		  //---------------=--------------------\\
		 //----- convert function to Object -----\\
		//----------------------------------------\\
		else if (typeof(value) == 'function')
		{
			var obj = {};
			// keep function definition properties if option specified
			if (options.keepFunctions)
			{
				var pattern = /function\s*(\w*)\s*\(([\s\S]*?)\)[^{]*{\s*([\s\S]*)}/;
				var results = value.toString().match(pattern);
				obj.function = {
					name: results[1] || '',
					arguments: (results[2].length ? results[2].split(',') : []),
					body: results[3].trim().split('\n'),
					_constructorName: value.constructor.name
				}
			}
			// always keep function properties
			Object.keys(value).forEach(function(key)
				{ obj[key] = value[key]; });

			return obj;
		}

		  //--------------=------------------\\
		 //----- no change if not Object -----\\
		//------------------------------------\\
		else if (typeof(value) != 'object')
		{
			return value;
		}

		  //--------------------------------\\
		 //----- format json for RegExp -----\\
		//------------------------------------\\
		else if (value.constructor == RegExp)
		{
			if (!options.keepRegExp) return value;

			var clone = {_constructorName: value.constructor.name};
			Object.getOwnPropertyNames(value).forEach(function(key)
				{ clone[key] = escapeChar(value[key]) });
			return clone;
		}

		  //--------------------------------\\
		 //----- no change if not Array -----\\
		//------------------------------------\\
		else if (value.constructor != Array)
			return value;

		  //--------------------------------\\
		 //----- format json for Array -----\\
		//------------------------------------\\
		else
		{
			arrayLevel++;

			//----- Create new Object() for any non-numeric enumerable Array keys.
			//		If any found, clone Array and push new Object() onto the cloned
			// 		Array as pseudo item that will subequently stringify into json.
			var properties = {_____keys_____: 0};
			if (Object.keys(value).join('').replace(/\d*/g,''))
			{
				Object.keys(value).forEach(function(key)
				{
					if (!value.hasOwnProperty(key)) return;
					if (skip.indexOf(key) != -1) return;
					if (only && only.indexOf(key) != -1) return;

					if (isNaN(key) || parseInt(key) >= value.length)
					{
						properties._____keys_____++;
						properties[key] = value[key];
					}
				});
				if (properties._____keys_____)	//named Array keys found
				{
					value = value.slice();
					value.push(properties);
				}
			}

			//----- stringify Array items including pseudo item added above
			var delim = '';
			var itemCount = 0;
			var isMultiline = false;
			var jsonForLine = '';

			for (var idx=0; idx<value.length; idx++)
			{										//item json -- remove outer quotes
				var jsonForItem = JSON.stringify(value[idx], EZjson_format, spaces);
				jsonForItem = jsonForItem.replace(/(^"@@=@|@=@@"$)/g, '');

				var useSepLine = false;
				jsonForLine += delim + jsonForItem;
				if (typeof(value[idx]) == 'string'
				&& jsonForItem.indexOf('@@EOL@@') != -1)
				{
					useSepLine = true;					//multiline String
					json += delim
					delim = '';
				}
				if (typeof(value[idx]) == 'object' && value[idx] != null)
					useSepLine = true;					//separate line for Object json

				else if (options.maxItemsLineLength && jsonForLine.length > options.maxItemsLineLength)
					useSepLine = true;					//separate line for long json String

				else if ((options.maxItemsPerLine && itemCount >= options.maxItemsPerLine)
				|| (options.maxItemsLineLength && (jsonForLine+jsonForItem).length > options.maxItemsLineLength))
				{										//start newline after too many items
					json += delim.replace(/ /, '\n')
					delim = '';
					itemCount = 0;
					jsonForLine = jsonForItem;
					isMultiline = true;
				}

				if (useSepLine)
				{
					json += delim.replace(/ /, '\n')
						  + jsonForItem
						  + (idx < (value.length - 1) ? ',\n' : '');
					delim = '';
					itemCount = 0;
					isMultiline = true;
					jsonForLine = '';
				}
				else
				{										//append to current line
					json += delim + jsonForItem;
					delim = ', ';
					itemCount++;
				}
			}

			//----- wrap json with [...] and indent as needed
			var endPadding = '';
 			if (isMultiline)							//when isMultiline, indent ITEMS
			{
				json = padding + json.replace(/\n/g, padding);

				if (arrayLevel > 1)						//indent more if nested Array
					json = json.replace(/\n/g, padding) + padding;

				else if (key)
					endPadding = padding;

				else
					endPadding = '\n';
			}
			if (key)									//not top level, indent entire ARRAY
				json = json.replace(/\n/g, padding);

			json = '[' + json + endPadding + ']';
			arrayLevel--;
		}
		  //---------------------------------------\\
		 //----- return escaped json for value -----\\
		//-------------------------------------------\\
		json = '@@=@' + json + '@=@@';			//wrap json with prefix/suffix escape codes...
		return escapeChar(json);				//...to discard outer quotes added upon return
	}
	/**
	 *
	 */
	function escapeChar(json)
	{
		if (typeof(json) != 'string') return json;
		json = json.replace(/\n/g, '@@EOL@@');	//escape embedded newlines
		json = json.replace(/"/g, '@@~@@');		//...quotes
		json = json.replace(/\\/g, '@@#@@');	//...backslashes
		return json;
	}
}
EZ.json.stringify.MAX_ITEMS_PER_LINE = 10;
EZ.json.stringify.MAX_ITEMS_LINE_LENGTH = 80;
//_____________________________________________________________________________________________
EZ.stringify = EZ.json.stringify;	//test framework does not support nested function names
EZ.stringify.test = function()
{
	// shared data
	var ex = 'na';
	var note = '';
	var obj, json, regex;
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	// #1
	ex = '[\n'
	   + '    "score", "offsets",\n'
	   + '    {\n'
	   + '        _____keys_____: 2,\n'
	   + '        score: true,\n'
	   + '        scoredKey: true\n'
	   + '    }\n'
	   + ']'
													note = 'ObjectLike Array with'
														 + 'named keys'
	EZ.test.run(EZ.global.testdata.include, 4,				{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #2
	ex = JSON.stringify(EZ.global.testdata.person, null, 4); format()
													note = 'Object same as native\n'
														 + 'except keys not quoted'
	EZ.test.run(EZ.global.testdata.person, 4,				{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #3
	ex = JSON.stringify(EZ.global.testdata.array);
	ex = ex.replace(/,/g, ', ');					note = 'Pure Array -- no item '
														 + 'contains an object so: '
														 + 'Array is not indented '
														 + 'but space after comma'
	EZ.test.run(EZ.global.testdata.array,					{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #4
	ex = JSON.stringify(EZ.global.testdata.arraySparse); format();
	//ex = ex.replace(/null/, /undefined/)
													note = 'Array sparely poulated '
														 + 'item[2] undefined but '
														 + 'native stringify treats '
														 + 'as null'
	EZ.test.run(EZ.global.testdata.arraySparse,				{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #5
	ex = JSON.stringify(EZ.global.testdata.personArrayLike, null, 4); format();
													note = 'ArrayLike Object: same '
														 + 'as native stringify '
														 + 'except: keys not quoted '
	EZ.test.run(EZ.global.testdata.personArrayLike,			{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #6
	ex = JSON.stringify('', null, 4);				note = 'empty string exactly '
														 + 'as native stringify '
	EZ.test.run('',										{EZ: {ex:'""', note:note}})
	//_______________________________________________________________________________

	// #7
	ex = JSON.stringify('', null, 4);				note = 'null exactly same '
														 + 'as native stringify '
	EZ.test.run(null,									{EZ: {ex:'null', note:note}})
	//_______________________________________________________________________________

	// #8
	json = JSON.stringify(EZ.global.testdata.objectLike).replace(/,/g, ', ')
	// [1,2,null,null,null,"five"]
	json = json.replace(/\[/g, '[\n    ').replace(/]/, ',\n    {\n        '
		 + '_____keys_____: 1,\n        ');

	ex = 'person: ' + JSON.stringify(EZ.global.testdata.person, null, 4); format();
	ex = json + ex.replace(/\n/g, '\n        ') + '\n    }\n]';

													note = 'ObjectLike Array has\n'
														 + 'named keys - IGNORED '
														 + 'by native stringify'
	EZ.test.run(EZ.global.testdata.objectLike,				{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #9
	var a = EZ.global.testdata.array.slice();
	a.push(EZ.global.testdata.person, true, false, 'xyz')

	ex = JSON.stringify(a, null, 4); format();
	ex = ex.replace(/1,[\s\S]*?2,/, '1, 2,')
	ex = ex.replace(/true,[\s\S]*?"/, function(all) {return all.replace(/,\n\s*/g, ', ') })

	note = 'Array format same as native when ANY array item contains object '
		 + 'except: keys unquoted and spaces after Array item commas'
	EZ.test.run(a,											{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #10
	ex = JSON.stringify(EZ.global.testdata.fuse,null,4); format();

	json = '\n        {\n            _____keys_____: 2,'
	for (key in EZ.global.testdata.fuse.include)
	{	// append options.include Array named keys
		if (EZ.global.testdata.fuse.include.hasOwnProperty(key) && isNaN(key))
			json += '\n            ' + key + ': ' + EZ.global.testdata.fuse.include[key] + ',';
	}
	ex = ex.replace(/],/, ',' + json.clip() + '\n        }\n    ],');
	ex = ex.replace(/\[/, '[\n        ');

	note = 'Object with embedded ObjectLike include Array with named keys'
	EZ.test.run(EZ.global.testdata.fuse,					{EZ: {ex:ex,note:note}})
	//______________________________________________________________________________

	// #11
	ex = JSON.stringify(EZ.global.testdata.arraySparsePlus, null, 4); format();
	ex = ex.replace(/(\[\s*)([\s\S]*?)(?=]|,\s*\{)/gi,
	function(all,bracket,items)
	{
		return bracket + items.replace(/,\s*/g, ', ');
	});
	ex = ex.replace(/\s\[\s*"O([^\]]*?)\s+\]/gi, '\n    ["O$1]')
	ex = ex.replace(/\[\s*"J([^{]*?)\s*\]/g, '["J$1]'.replace(/\s+/g, ' '))
														note = 'complex Array with '
															 + 'no ObjectLike Arrays '
	EZ.test.run(EZ.global.testdata.arraySparsePlus,			{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #12
	ex = JSON.stringify(EZ.global.testdata.objectLikeMore.person, null, 4); format();
	json = ex.replace(/\n/g, '\n    ')
	json = '{\n'
		 + '    _____keys_____: 1,\n'
		 + '    person: ' + json + '\n'
		 + '}'
	json = '    ' + json.replace(/\n/g, '\n    ');

	ex = JSON.stringify(EZ.global.testdata.objectLikeMore,null,4); format();
	ex = ex.replace(/(\[\s*)([\s\S]*?)(?=]|,\s*\{)/gi,
	function(all,bracket,items)
	{
		return bracket + items.replace(/,\s*/g, ', ');
	});
	ex = ex.replace(/(2,) /, '$1');
	ex = ex.replace(/(    ])/, '$1,\n' + json);

	json = '"score", "offsets",\n'
	     + '{\n'
		 + '    _____keys_____: 2,\n'
		 + '    score: true,\n'
		 + '    scoredKey: true\n'
		 + '}';
	json = json.replace(/\n/g, '\n        ');
	ex = ex.replace(/\[\s*"score"[\s\S]*?"offsets"/,'\n    [\n        ' + json);

														note = 'complex ObjectLike'
	EZ.test.run(EZ.global.testdata.objectLikeMore,			{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #13
	obj = cloneObject(EZ.global.testdata.regex);
	ex = JSON.stringify(obj,null,4); format();
														note = 'RegExp Standalone'
	EZ.test.run(EZ.global.testdata.regex,					{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #14
	obj = [cloneObject(EZ.global.testdata.regex)];
	ex = JSON.stringify(obj,null,4); format();
														note = 'RegExp in Array'
	EZ.test.run([EZ.global.testdata.regex],					{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #15
	obj = {regex: cloneObject(EZ.global.testdata.regex)};
	ex = JSON.stringify(obj,null,4); format();
														note = 'RegExp in Object'
	EZ.test.run({regex: EZ.global.testdata.regex},			{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #16
	var manyItems = [0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9]
	ex = '[\n    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,\n    0, 1, 2, 3, 4, 5, 6, 7, 8, 9\n]'
														note = '20 items'
	EZ.test.run(manyItems,									{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #17
	ex = JSON.stringify(EZ.global.testdata.multiline, null, 4); format();
	ex = ex.replace(/1,[\s\S]*"John/, '1, "a", "\nJohn');
	ex = ex.replace(/\\n/g, '\\n\n');
	ex = ex.replace(/"x[\s\S]*?z"/, '"x", "y", "z"');

														note = 'multiline String'
	EZ.test.run(EZ.global.testdata.multiline,				{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________


	// #18
	ex = ''
														note = 'function'
	EZ.test.run(EZ.testSample,									{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #19
	ex = ''
														note = 'function'
	EZ.test.run(EZ.testSample,									{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________


	//...............................................................................
	/**
	 *  Internal test helper function
	 *	convert most native stringify to EZ.stringify
	 */
	function format()
	{
		//ex = ex.replace(/"(\w*?)":/gi,'$1:');		//un-quote keys
		ex = ex.replace(/([{,]\s+)"([\w_]+?)":/gi, function(all, sep, key)
		{
			if ('null undefined'.indexOf(key) != -1) return all;
			return sep + key + ":"
		});


		ex = ex.replace(/(\w*: \[)([\s\S]*?])/gi, 	//collapse Arrays to single line
		function(all, name, value)
		{
			return '' + name + value.replace(/\s*/g, '');
		});

		ex = ex.replace(/\[(.*?)\]/mg,function(all)	//for single line Arrays
		{											//add space after comma
			return all.replace(/,/g, ', ')
		});
		ex = ex.replace(/, $/mg, ',')
	}
	/**
	 *	recursive function to clone an object. If a non object parameter
	 *	is passed in, that parameter is returned and no recursion occurs.
	 *  REFERENCE: http://heyjavascript.com/4-creative-ways-to-clone-objects/
	 */
	function cloneObject(obj, construct)
	{
		if (obj === null || typeof obj !== 'object')
			return obj;

		var clone = {_constructorName: obj.constructor.name};

		Object.getOwnPropertyNames(obj).forEach(function(key)
			{ clone[key] = cloneObject(obj[key], construct) });
		return clone;
	}
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
		: EZget_basic(el, defaultValue);					//otherwise basic function
}
//__________________________________________________________________________________
/**
 *	calls EZ.set_basic until and if EZ.setValue loaded
 */
EZ.set = function EZset(el, value)
{
    return (window.EZsetValue)			//use full functionality if loaded
		 ? EZsetValue.apply(this,EZ.context(this))
		 : EZset_basic(el, value);
}
//__________________________________________________________________________________
/**
 *	calls EZ.get() or EZ.set()
 */
EZ.val = function EZval(el,value)
{
	return arguments.length == 0 ? '' 				//if no args, return blank
		 : arguments.length == 1 ? EZgetValue(el) 	//if single arg, call getValue()
		 : EZsetValue.apply(this,[].slice.call(arguments));	//otherwise call setValue()
}
//__________________________________________________________________________________
/**
 *
 */
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
   	return EZtechSupport.apply(this,[].slice.call(arguments));
}
EZ.console = function EZconsole(e,msg)
{
   	if ('console.log'.ov())
		console.log({msg:msg||'N/A', exception:e});
	return 	'';
}
//__________________________________________________________________________________
/**
 *
 */
EZ.techSupport = function EZtechSupport(e,msg)
{
	if ('dw.techSupport'.ov())
		dw.techSupport.apply(dw, [].slice.call(arguments));

	else if ('console.log'.ov())
		console.log({msg:msg||'N/A', exception:e});

	else if (EZgetPref(EZ.pref.debugMode) || EZgetPref(EZ.pref.warningMessages))
		return EZexception(e,msg);

	else if (EZ.createLayer && EZ.display && 'dw.isNotDW'.ov())
	{
		var showDetails = '';
		var layer = EZ.createLayer('EZtechSupportDetail','<div class="debug">');
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
		EZdisplayMessage( EZ.messages.techSupport + showDetails);
	}
	else
	{
		alert('Technical Difficult -- try again or contact support');
///		g.deferedMessageTimer = -1;
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
EZ.messageCodes = function (codes, type)
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
EZ.message = function (code, values)
{
	if (!code) code = 'oops';
	values = EZ.toArray(values, ' ,');

	var keys = (code || '').trim().split('.').remove();
	if (keys.length == 0)
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

	if (keys.length == 0)
		return defaultValue;

	key = '';
	for (var i=0; i<keys.length; i++)
		key += '.' + keys.slice(i).join('.') + ' ';

	var value = key.clip().ov(baseObj);
	if (value == undefined && defaultValue != undefined)
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

	if (keys.length == 0)
		return value;

	var obj;
	for (var i=0; i<keys.length-1; i++)
	{									//look for existing key
		key = '.' + keys.slice(i).join('.');
		obj = key.ov(EZ.global, {});
		if (typeof obj[key] == 'undefined') continue;

		key = keys.shift();				//*** option found ***
		if (value != undefined)
			return obj[key] = value;	//set & return specified value

		value = obj[key];
		delete obj[key];				//delete option
		return value;					//return current value
	}
										//*** option NOT found ***
	if (value === undefined)
		return undefined;				//no new option created

	obj = baseObj;						//*** create option ***
	while (keys.length > 0)				//for each key component
	{
		key = keys.shift();

		if (typeof obj[key] != 'undefined')
			obj = obj[key];

		else if (keys.length == 0)
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

	var i, opts = el;
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
			if (opts.length == 0) return '';
		}
		case 'radio':
		{
			if (opts.length > 0)	//if not single radio button
			{
				value = 'value';
				do					//select or radio group
				{
					for (i=0; i<opts.length; i++)
					{
						val = checked == 'selected'
							? opts[i][value]
							: EZ.getTagValue(opts[i]);

						if (opts[i][value] != value) continue;
						opt[i][checked] = true;
						return value;
					}
					if (value == 'text') break;
					value = 'text';
				}
				while (checked == 'selected')
				return '';
			}
		}
		case 'checkbox':
		{							//checkbox or single radio button
			var val = EZ.getTagValue(el);
			el.checked = (val === value || EZ.isTrueLike(value))
			return val || el.checked;
		}
		case 'label':				//TODO: copy to full functionality
		{							//fall thru to default if for attribute
			if (!el.getAttribute('for'))
			{						//otherwise find 1st non-blank text node
				var nodes = el.childNodes;
				var textNode = '';
				for (i=0; i<nodes.length; i++)
				{
					if (nodes[i].nodeType != 3) continue;
					textNode = nodes[i];
					if (nodes[i].nodeValue.trim())
						return nodes[i].nodeValue = value;
				}
				if (textNode)		//all text nodes blank, update last
					return textNode.nodeValue = value;
				return value;		//no text nodes
			}
		}
		default:	//inclues label with "for" attribute
			return el.innerHTML != undefined
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
/*_______________________________________________________________________________
|                                                                                |
|Remainder of file contains prototpes and related varients in alphabetical order |
|________________________________________________________________________________|
*/
/*--------------------------------------------------------------------------------------------------
String.ov([ob] [,defaultValue])

return value for specified property of specified Object if defined with specified property -AND-
property has not-null/undefined value; otherwise return defaultValue (or undefined if omitted).

Very useful for checking or getting an Object property value when not absolutely certian the
Object, property or value is defined and initialized to non-null / non-undefined value.

Used through out the EZ script library as a safety for the unexpected even when the object,
property or value should never be null or undefined.

ARGUMENTS
	String	specifies object and/or property as String using dot notation
			e.g. 'EZ.global.legacy.EZgetEl'.ov()

	obj		(optional) specified object when String starts with dot

	defaultValue (optional)
			specifies a defualt value returned when object, property or value is undefined or null

			if defaultValue is Object with 'null', 'undefined' and/or '' if specified default for
			undefined, null property value or property not found respectfully.  If defaultValue not
			specified, either value of property returned or undefined if property not found.

EXAMPLES:
	if ('EZ.global.legacy.EZgetEl'.ov()) ...
	var color = "EZ.defaults.editform.fields.textarea.color".ov('red');
-vs-
	if (window.EZ && EZ.global && EZ.global.legacy && EZ.legacy.global.EZgetEl == undefined) ...

	var color = 'red';
	if (window.EZ && EZ.defaults && EZ.defaults.editform && EZ.defaults.editform.fields
	&& EZ.defaults.editform.fields.textarea && EZ.defaults.editform.fields.textarea.color != undefined)
		color = EZ.defaults.editform.fields.textarea.color;
--------------------------------------------------------------------------------------------------*/
String.prototype.ov = function ovEZprototypeString(o, defaultValue)
{
//	if (EZ.test.capture()) {return EZ.test.capture(this)} else if (EZ.test.debug()) debugger;

	var o, defaults;
	var obj;			//initialized by 1st set of properties -- does not change
	var value = true;	//value of 1st set of properties found with null/undefined value
						//...used if no set of properties is not null or undefined

	var args = [].slice.call(arguments);	//initial arguments
	var sets = this.split(' ');				//split String into set(s) of properties

	//----- for each set of properties . . .
	if (sets.some(function(set)
	{							//loop till non null or undefined property value found
		var keys = set.split('.');
		o = keys.shift();
		if (o != undefined)		//falls thru if empty string (i.e. String starts with dot)
		{						//when string starts with dot -- object is 1st arg...
			if (o === '') 		//...saved as obj for property sets after 1st
				o = obj = (obj || args.shift());
			else				//otherwise object is global scope
				o = typeof(window[o]) != 'undefined' ? window[o] : undefined;
		}
		if (args)				//get defaultValue from args if 1st set of properties
		{
			defaultValue = args.shift();		//defaultValue same for all scenarios...
			defaults = typeof(defaultValue) == 'object' 		//...unless object with...
					&& ['','null','undefined'].some(function(p)	//...one of these properties
						{if (p in defaultValue) return true});
			args = '';			//clear args -- only processed once
		}
		if ('object function'.indexOf(typeof o) == -1)
		{					//object null, undefined or NOT object -- quit some
			o = undefined;
			return true;
		}
		//-----------------------------------------------------------------------
		// specified objecst found if o is not undefined when first arriving here
		//-----------------------------------------------------------------------
		while (o != undefined)			//1st or next property found if defined
		{
			if (keys.length == 0)
				return true;			//SUCCESS -- quit while AND sets loop
			var key = keys[0].match(/^\[(.*)\]/)
			if (key)
			{							//next key is Array contents
				key = isNaN(key[1]) ? key[1] : parseFloat(key[1]);
				idx = [].indexOf.call(o,key);
				if (!(idx in o)) return false;
				o = o[idx];
				keys.shift();
			}
			else if (!(keys[0] in o))
				return false;			//next propery undefined -- try next set of properties
			else
				o = o[keys.shift()];		//next property exists...

			if (keys.length > 0 && 'object function'.indexOf(typeof o) == -1)
				return false;			//...if key and NOT object -- try next set of properties
		}
		if (!keys.length && value) 		//value of 1st property found with null/undefined value...
			value = o;					//...used when none of other property sets find non-
										//...null/undefined value -- try next set of properties
	}))
	//----- specified object and property found with non-null/non-undefined value
	while (true)
	{
		// 1st check for mapped value when multiple defaultValues specified...
		if (defaults
		&& (o == null || 'object function'.indexOf(typeof o) == -1)
		&& o in defaultValue)			//...and mapped value defined...
			return defaultValue[o];		//...return mapped property value

		var defaultType = defaults 		//get type of notFound defaultValue
						? typeof(defaults['undefined']) != 'undefined'
						? typeof(defaults['undefined']) : ''
						: typeof(defaultValue) != 'undefined'
						? typeof(defaultValue) : '';

		// if found object / property is object but spefified defaultValue is not...
		if (typeof(o) == 'object' && defaultType && defaultType != 'object')
			break;						//...fall thru to return defaultValue

		// otherwise return found object or property value as is
		return o;
	}
	//----- specified object or property NOT found with non-null non-undefined value . . .
	if (defaults)
	{									//if multiple defaultValues specified and...
		if (value === true)
		{								//property not found
			if ('' in defaultValue)
				return defaultValue[''];
		}
		else if (value in defaultValue)	//if defaultValue defined for this scenario, return it
			return defaultValue[value];
	}
	else if (defaultValue != undefined)
		return defaultValue				//else return single defaultValue if specified

	return value !== true				//else if property found with null/undefined value
		 ? value						//...return value
		 : undefined					//otherwise return undefined
}
//______________________________________________________________________________________________
String.prototype.ov.test = function()
{
	var obj = { a:'a', b:'b', '0':0, z:'0', f:false, t:true, u:undefined, n:null,
		l1: {
			va:'va', v0:0, a:'a','0':0, u:undefined, n:null,
				l2: { v:'val' }
		},
		arr_empty: [],
		arr_items: [1,2,3]
	}
	var defaults = {'':'na', 'undefined':'u', 'null':'n', '0':'zero', a:'A', t:'t', f:'f'}

	var note = 'obj is local scope'
	var str = '.a';

	EZ.test.run('.arr_items.[2]', obj,	{EZ: {ex:2, 		note:"('.a', obj)" }});
	EZ.test.run('.arr_items.2', obj,	{EZ: {ex:3, 		note:"('.a', obj)" }});

	EZ.test.run(str, obj, 				{EZ: {ex:'a', 		note:"('.a', obj)" }});
	EZ.test.run('.a', obj, 				{EZ: {ex:'a', 		note:note }});
	EZ.test.run('.b', obj, 				{EZ: {ex:'b', 		note:note }});
	EZ.test.run('.0', obj, 				{EZ: {ex:0, 		note:note }});
	EZ.test.run('.z', obj, 				{EZ: {ex:'0', 		note:note }});
	EZ.test.run('.t', obj, 				{EZ: {ex:true, 		note:note }});
	EZ.test.run('.f', obj, 				{EZ: {ex:false, 	note:note }});

	EZ.test.run('.l1.l2.v', obj, 		{EZ: {ex:'val', 	note:note }});
	EZ.test.run('.x .l1.l2.v', obj,		{EZ: {ex:'val', 	note:note }});

	EZ.test.run('.x .n', obj, 			{EZ: {ex:null,
				note: 'should return value of n=null after not finding x property'}});
	EZ.test.run('.n .x', obj, 			{EZ: {ex:null,
				note: 'should return value of n=null after looking for but not finding x'}});

	EZ.test.run('.a', obj, defaults, 	{EZ: {ex:'A', 		note:note }});
	EZ.test.run('.b', obj, defaults, 	{EZ: {ex:'b', 		note:note }});
	EZ.test.run('.0', obj, defaults, 	{EZ: {ex:'zero',	note:note }});
	EZ.test.run('.z', obj, defaults, 	{EZ: {ex:'zero',	note:note }});
	EZ.test.run('.t', obj, defaults, 	{EZ: {ex:true, 		note:note }});
	EZ.test.run('.f', obj, defaults, 	{EZ: {ex:false, 	note:note }});

	EZ.test.run('',	 					{EZ: {ex:undefined, note:note }});
	EZ.test.run('.x', '*', 				{EZ: {ex:undefined, note:note }});
	EZ.test.run('.x',	 				{EZ: {ex:undefined, note:note }});
	EZ.test.run('.x', null,	 			{EZ: {ex:undefined, note:note }});
	EZ.test.run('.x', undefined,		{EZ: {ex:undefined, note:note }});

	EZ.test.run('.x', obj, 				{EZ: {ex:undefined, note:note }});
	EZ.test.run('.u', obj, 				{EZ: {ex:undefined, note:note }});
	EZ.test.run('.n', obj, 				{EZ: {ex:null, 		note:note }});
	EZ.test.run('.a', null, 			{EZ: {ex:undefined, note:note }});

	EZ.test.run('.x', obj, defaults, 	{EZ: {ex:'na', 		note:note }});
	EZ.test.run('.u', obj, defaults, 	{EZ: {ex:'u', 		note:note }});
	EZ.test.run('.n', obj, defaults,	{EZ: {ex:'n', 		note:note }});
	EZ.test.run('.a', null, defaults,	{EZ: {ex:'na', 		note:note }});

	EZ.test.run('.arr_empty', obj,		{EZ: {ex:obj.arr_empty,	note:'' }});
	EZ.test.run('.arr_items', obj,		{EZ: {ex:obj.arr_items,	note:'' }});

	note = 'EZ.test.tstobj is global reference to obj initialized by test';
	EZ.test.tstobj = obj;

	EZ.test.run('EZ.test.tstobj.a',				{EZ: {ex:'a', 		note:note }});
	EZ.test.run('EZ.test.tstobj.a', defaults,	{EZ: {ex:'A', 		note:note }});
	EZ.test.run('EZ.test.tstobj.l1.l2.v', 		{EZ: {ex:'val', 	note:note }});

	EZ.test.run('EZ.test.tstobj.x', defaults, 	{EZ: {ex:'na', 		note:'.x undefined property' }});
	EZ.test.run('EZ.test.tstobj.u', 		 	{EZ: {ex:undefined,	note:'.u value=undefined' }});
	EZ.test.run('EZ.test.tstobj.u', defaults, 	{EZ: {ex:'u', 		note:note }});
	EZ.test.run('EZ.test.tstobj.n',				{EZ: {ex:null, 		note:'.n value=null' }});
	EZ.test.run('EZ.test.tstobj.n', defaults,	{EZ: {ex:'n', 		note:note }});

	EZ.test.run('.notFound', {notFound:[]}, 'def',	{EZ: {ex:'def',
			note: 'set to str because array empty and defaultValue not Object' }});
}
/*--------------------------------------------------------------------------------------------------
Append parentNode(s) with node(s)
--------------------------------------------------------------------------------------------------*/
EZ.append = function EZappend(parentNodes, nodes)
{
	if (arguments.length == 0)
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
	if (callerArgs.length == 0) return [];

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
	if (!tags || typeof(tags) != 'object' || (EZ.isArrayLike(tags) && tags.length == 0))
		return tags;

	bindElement(tags)
	if (EZisArrayLike(tags))
	{
		Array.prototype.forEach.call(tags, function bindTag(tag)
		{
			bindElement(tag);
		});
	}
	//======================
	return tags;
	//======================
	/**
	 *
	 */
	function bindElement(tag)
	{
		if (tag.EZ != undefined) return;	//alread bound

		// Must use new function to avoid inheriting non-dom functions
		tag.EZ = function() { return EZ.apply(tag, [].slice.call(arguments)) };
		//tag.EZ = EZ.bind(tag);  //nogo

		tag.EZ.set = EZ.set.bind(tag);

		//think these work but add redundant function layer
		//tag.EZ.get = function() { return EZ.get.apply(tag, [].slice.call(arguments)) };
		//tag.EZ.set = function() { return EZ.set.apply(tag, [].slice.call(arguments)) };

		//TODO: all functions bound to last stub EZ.val() -- probably need prototype.bind
		//for (var o in (EZ.stubs || {}))
		//	tag[o] = function () { debugger;return EZ.stubs[o].call(tag, arguments[0], tag) };


		// add dom utils if defineed
		//if (EZ.dom && EZ.dom.utils) node.EZ.dom = new EZ.dom.utils(node);



		//works but add redundant function layer
		tag.EZgetEl = function() { return EZgetEl.apply(tag, [].slice.call(arguments)) };
		//??  tag.EZgetEl = tag.EZ;

	}
}
/**	bind tests
el.y = function(){debugger}
el.y()
q = el.y.bind(el)
b()
q()
2undefined
q()
this
//----- this works
qq = EZ.bt.bind(el)
 */
EZ.bt = function()
{
	debugger;
	el = document.createElement('span')
	el.EZset = EZ.set.bind(el)

}

/*---------------------------------------------------------------------------------------------
Clip end of string by specified number of char (default: 1)
---------------------------------------------------------------------------------------------*/
String.prototype.clip = function clip(nochar)
{
	if (nochar === undefined) nochar = 1;
	if (nochar == 0)
		return this + '';
	else if (nochar >= this.length)
		return '';
	else if (nochar < 0)
		return this.substr(-nochar);
	else
		return this.substr(0,this.length-nochar);
}
//_______________________________________________________________________________
String.prototype.clip.test = function()
{
	var str = 'abc';
	EZ.test.run(str,			{EZ: {ex:'ab', 	ctx:str}})
	EZ.test.run(str, 0,			{EZ: {ex:'abc',	ctx:str}})
	EZ.test.run(str, 2,			{EZ: {ex:'a',	ctx:str}})
	EZ.test.run(str, 3,			{EZ: {ex:'',	ctx:str}})
	EZ.test.run(str, 4,			{EZ: {ex:'',	ctx:str}})
	EZ.test.run(str, -1,		{EZ: {ex:'bc',	ctx:str}})
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
	if (EZ.isArray(obj)) return obj.slice();		//Array

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
		case 'object':
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
		default:
		{
			return obj;
		}
	}
};
//_____________________________________________________________________________________________
EZ.clone.test = function()
{
	var obj = {a:1, b:2, arr: [1,2]};
	EZ.test.run(obj, 		{EZ: {ex:obj,       	note:''	}})

	var div = document.createElement('div');
	var span = document.createElement('span');
	var divObj = {d:div}
	var bothObj = {d:span, s:span}

	EZ.test.run(divObj, 		{EZ: {ex:{d:div},       	note:''	}})
//	EZ.test.run(bothObj, 		{EZ: {ex:{d:div, s:span},	note:''	}})

	var fn = function cloneTest(a,b) {return a*b}
	var results = EZ.test.run(fn, 		{EZ: {ex:fn,       	note:''	}})
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
	if (EZ.test.capture()) {return EZ.test.capture(this)} else if (EZ.test.debug()) {debugger};

	if (arg == null || arg == undefined || arg === '')	return [];

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
	EZ.test.run(obj					, {EZ: {ex:obj, note:'non-array object'	}})
	EZ.test.run({key:'this is the time for all good men to enjoy life'}
									, {EZ: {ex:obj, note:'non-array object'	}})
	EZ.test.run({key:'this is obj'}	, {EZ: {ex:{key:'this is obj'} }})

	EZ.test.run({}					, {EZ: {ex:{}			}})
	EZ.test.run({a:1,b:2}			, {EZ: {ex:{a:1,b:2}	}})
}
/*--------------------------------------------------------------------------------------------------
EZ.collapseMessages(o, group[, msg])

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
EZ.collapseMessages = function (o, group, msg)
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

	var msg = collapseMessages(o);	//return formatted counters
	return msg;

	function collapseMessages(o, level)
	{
		level = level || 0;
		var sep = (level == 0) ? '\n' : ', ';
		var msg = '';
		var cnt = Object.keys ? Object.keys(o).length : 0;
		for (var k in o)
		{
			var m = '';
			if (typeof(o[k]) == 'object')
				m = k + ': ' + collapseMessages(o[k], level+1)

			else if (isNaN(o[k]))	//not sure what should be done here
				m = k + '=' + o[k] + '';

			else
				m = k + (o[k] > 1 || cnt > 1
						   ? ' x ' + o[k]
						   : '');
				//m += ']'
			var s = sep + ((msg + m).indexOf('\n') != -1 ? '\n' : '')
			msg += (msg == ''
					? ''
					: s) + m;
		}
		return msg;
	}
}
/*--------------------------------------------------------------------------------------------------
TODO: mayby use toArray()
--------------------------------------------------------------------------------------------------*/
String.prototype.collapse = function collapseEZprototypeString(str)
{
	return this.toString();
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
Array.prototype.collapse = function collapseEZprototypeArray(str)
{
	if (length == 0)  return '';
	if (str) return o.join(str+'');
	return o[0];
}
/*--------------------------------------------------------------------------------------------------
Object.compare()

Not refactored as prototype
Never tested -- Used EZ.stringify()
--------------------------------------------------------------------------------------------------*/
if (Object.defineProperty)
{
	Object.defineProperty(Object.prototype, 'compare',
	{
		value: function compareEZprototypeObject(obj, dotName, options)
		{
			var topLevel = false;
			if (!options)
			{
				topLevel = true;
				dotName = dotName || ''
				options = {
					maxItems: Math.min(maxItems || 11, 100),
					log: {diff:[], same:[], skip:[]},
					processed: []	//only process each object once
				};
			}

			// if either a or b is not Object ...
			if (a === null || typeof a !== 'object'
			|| b === null || typeof b !== 'object')
			{
				if (a === b)
					options.log.same.push([dotName,a,b]);

				else if (options.skip.include(dotName))
					options.log.skip.push([dotName,a,b]);

				else
					options.log.diff.push([dotName,a,b]);
			}
			else if (options.processed.indexOf(a) != -1 || options.processed.indexOf(b) != -1)
			{
				return;
			}
			else
			{
				// get list of unique keys from a and/or b
				var keys = Object.getOwnPropertyNames(a);
				Object.getOwnPropertyNames(b).forEach(function(key)
				{
					if (keys.indexOf(key) == -1) keys.push(key);
				});

				// for all keys
				keys.every(function(key)
				{
					var dotNamePlus = dotName + isNaN(key) ? '.' + key : '[' + key + ']';

					if (!(key in a))
						options.log.diff.push([dotNamePlus,undefined,b[key]]);

					else if (!(key in b))
						options.log.diff.push([dotNamePlus,a[key],undefined]);

					compareObject(a[key], b[key], dotNamePlus, options);
					if (options.diff.count > options.maxItems)
						return false;
				});
			}
			return options;
		}
	});
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//_____________________________________________________________________________________________
	Object.prototype.compare.test = function()
	{
		var a = [1,2,3];

		EZ.test.run(arg0, 							{EZ: {ex:'',	note:''	}})
	}
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
EZ.concat = function EZconcat(strings, separator)
{
	var array = EZ.arrayFromArguments(arguments);
	separator = (typeof(strings) != 'string' ? separator : '') || '\n';

	//----- convert all array elements to strings -- discarding if blank
	for (var i=0; i<array.length; i++)
	{
		while (i<array.length)
		{
			if (array[i] == undefined)
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
EZ.concatStrings = EZ.concat;
/*--------------------------------------------------------------------------------------------------
String.count(char[, [start,] end])

Count number of char found in String -- from start if specified -- up to end if specified

ARGUMENTS:
	2nd argument is "end" when function called with only 2 arguments

	char	(required)	character to count -- use number to specify unicode

	start	(optional) 	position in String to start count    (default: 0)
						default used when not specified (< 3 arguments), NaN, blank or < 0

	end		(optional)	position in String to stop counting   (default: String.length)
						default used when not specified, NaN, blank or <= 0

RETURNS:
	count of char in String from start to end
--------------------------------------------------------------------------------------------------*/
String.prototype.count = function countEZprototypeString(char,start,end)
{
	switch(arguments.length)
	{
		case 0: return 0;	//or insert undefined for 2nd argument\\
		case 1: Array.prototype.splice.call(arguments,1,0,undefined)
	}
	char = (typeof(char) == 'number') ? String.fromCharCode(char) : char;
	start = (!isNaN(start) && start > 0) ? start : 0;
	end = (!isNaN(end) && end > 0) ? end : this.length;

	var e;
	try
	{
		var regex = new RegExp('\\' + char, 'g')
		var results = this.substr(start,end).match(regex);
		return results ? results.length : 0;
	}
	catch (e)
	{
		EZ.oops(e);
		return 0;
	}
}
String.prototype.count.displayName = 'String.prototype.count';
/*--------------------------------------------------------------------------------------------------
Return unescaped cookie value or blank if cookie not found.
Note: cookies only available when html file run from server
--------------------------------------------------------------------------------------------------*/
EZ.cookie.get = function EZcookieGet(name)
{
    value = '';

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
--------------------------------------------------------------------------------------------------*/
EZ.displayMessage = function EZdisplayMessage(msg, timer)
{
	if (msg === true) msg = '';
	if (!msg) msg = '';
	var el = document.getElementById('message')
		  || document.getElementsByClassName('message')[0];

	if (el)			//if message el . . .
	{
		el.innerHTML = msg;
		var wrap = el.parentNode;
		if (wrap)
		{
			if (EZ.hasClass(wrap, 'hidden')
			|| wrap.style.position == 'absolute')
				EZ.displayMessage.hidden = true;
			if (EZ.displayMessage.hidden)
				wrap.style.display = (msg) ? 'block' : 'none';
		}
		// if timer, clear/restore message after timer milliseconds
		if (msg && timer)
		{
			clearTimeout(EZ.displayMessage.timer);
			EZ.displayMessage.timer = setTimeout(function()
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
String.dup(times[,maxlength])

return string duplicated specified number of times.
optional maxlength argument specified maximun length of returned string.
--------------------------------------------------------------------------------------------------*/
String.prototype.dup = function dupEZprototypeString(times,maxlength)
{
	times = EZ.toInt(times,80);
	if (times <= 0) return '';

	var str = ''
	for (var i=0;i<times;i++) str += this;

	if (maxlength && !isNaN(maxlength) && maxlength > 0)
		str = str.substr(0,maxlength)
	return str;
}
/*--------------------------------------------------------------------------------------------------
String.equals(str)

return true if str not null or undefined and equal to String otherwise return false.
--------------------------------------------------------------------------------------------------*/
String.prototype.equals = function equalsEZprototypeString(str)
{
	if (str == null || str == undefined)
		return false;
	else
		return this === str;
}
/*--------------------------------------------------------------------------------------------------
String.equalsIgnoreCase(str)

return true if str not null or undefined and case insenitive equal to String otherwise false.
--------------------------------------------------------------------------------------------------*/
String.prototype.equalsIgnoreCase = function equalsEZprototypeString(str)
{
	if (str == null || str == undefined)
		return false;
	else
		return this.toLowerCase() === str.toLowerCase();
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
Array.fill(value [, start = 0 [, end = this.length]])   --   ECMAScript 2015 (ES6) standard.

Fill all the elements of Array from start index to end index with specified value.

Changes this Array besides returning filled Array.  Does not increase Array length.

Provides easy way to initialize Array to values other than undefined as follows:

	new Array(5).fill(0) creates Array with 5 item set to 0.

	For objects, call as follows: obj = [].fill.call({length:5}, 0)

ARGUMENTS:
	value		(required) specifies fill value
	start		(optional) start index (default: 0)
	end			(optional) end index   (default: Array length)

RETURNS:
	filled Array -- throws error if this is null ([].fill.call(object, ...))

REFEENCE:
	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
--------------------------------------------------------------------------------------------------*/
if (!Array.prototype.fill)
{
	Array.prototype.fill = function fillEZprototypeArray(value, start, end)
	{
		// Steps 1-2.
		if (this == null)
			throw new TypeError('fill called with null or not defined');

		var obj = Object(this);			//clone

		// Steps 3-5.
		var len = obj.length >>> 0;		//returns 0 for undefined

		// Steps 6-7.
		var start = arguments[1];
		var relativeStart = start >> 0;

		// Step 8.
		var k = relativeStart < 0
			  ? Math.max(len + relativeStart, 0)
			  : Math.min(relativeStart, len);

		// Steps 9-10.
		var end = arguments[2];
		var relativeEnd = end === undefined
						? len
						: end >> 0;

		// Step 11.
		var final = relativeEnd < 0
				  ? Math.max(len + relativeEnd, 0)
				  : Math.min(relativeEnd, len);

		// Step 12.
		while (k < final)
		{
			obj[k] = value;
			k++;
		}

		// Step 13.
		return obj;
	};
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
			instr = ''
		case 'boolean':
		case 'number':
		case 'string':
			str = instr + '';
			break;

		case 'function':
		case 'object':
		default:
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
EZ.fill.displayName = 'EZ.fill';
/*--------------------------------------------------------------------------------------------------
Array.find(callback[, thisObj])

Calls the specified callback function for each item of Array until callback returns true then
returns the VALUE of that Array item or undefined if callback never returns true.

Very useful for getting specific object from an Array of Object:

	// get first div with class containing of 'hidden'
	var el = [].find.call( document.getElementsByTagName('div'), function(tag)
	{
		return tag.className && className.indexOf('hidden') != -1;
	});

Of course there are alternatives for above example, but often not for Array of custom Objects.

ARGUMENTS:
	callback	(required) function which returns true if Array item meets selection critera
	thisObj		(optional) value of this keyword in the callback function

RETURNS:
	value of 1st Array item meeting selection critera of callback function
	-OR- undefined if none of the Array items meet the callback selection critera.

REFEENCE:
	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
--------------------------------------------------------------------------------------------------*/
if (!Array.prototype.find)
{
	Array.prototype.find = function findEZprototypeArray(callback, thisObj)
	{
		thisObj = thisObj || this;			//TODO: leave as undefined ??
		var name = arguments.callee.name;

		if (this === null)
			throw new TypeError(name + ' called on null or undefined Object');

		if (typeof callback !== 'function')
			throw new TypeError(name + ' callback must be a function');

		var list = Object(this);
		var length = list.length >>> 0;		//return 0 if length undefined
		var value = undefined;

		for (var i = 0; i < length; i++) 	//for all Array items . . .
		{
			var value = list[i];
			if (callback.call(thisObj, value, i, list))
				return value;
		}
		return undefined;
	};
}
/*--------------------------------------------------------------------------------------------------
Array.findIndex(callback[, thisObj])

Calls the specified callback function for each item of Array until callback returns true then
returns the INDEX of that Array item or -1 if callback never returns true.

ARGUMENTS:
	callback	(required) function which returnS true if Array item meets selection critera
	thisObj		(optional) value of this keyword in the callback function

RETURNS:
	index of 1st Array item meeting selection critera of callback function
	-OR- -1 if none of the Array items meet the callback selection critera.
--------------------------------------------------------------------------------------------------*/
if (!Array.prototype.findIndex)
{
	Array.prototype.findIndex = function findIndexEZprototypeArray(callback)
	{
		thisObj = thisObj || this;			//TODO: leave as undefined ??
		var name = arguments.callee.name;

		if (this === null)
			throw new TypeError(name + ' called on null or undefined Object');

		if (typeof callback !== 'function')
			throw new TypeError(name + ' callback must be a function');

		var list = Object(this);
		var length = list.length >>> 0;
		var value = undefined;

		for (var i = 0; i < length; i++)
		{
			value = list[i];
			if (callback.call(thisObj, value, i, list)) {
			return i;
		}
		return -1;
		};
	};
}
/*--------------------------------------------------------------------------------------------------
Array.forEach(callback, thisObject)

Implements forEach and associated variants for older browsers -- calls the callback function
for each array elenemt with the following arguments: element, index, array

Variants:
	every():	quits loop and returns false when callback function returns false;
				i.e. must return true to keep looping
	some():		quits loop and returns true when callback function returns true;

ARGUMENTS:
	callback	function called for each defined array element
	thisObject 	Object used as this when executing callback function

RETURNS:
	nothing

TODO:
	filter 		(creates a new array including elements where the filter function returns true
				and omitting the ones where it returns false)
	map 		(creates a new array from the values returned by the iterator function)
	reduce 		(builds up a value by repeated calling the iterator, passing in previous values;
				see the spec for the details; useful for summing the contents of an array and many other things)
	reduceRight (like reduce, but works in descending rather than ascending order)

REFERENCE:
	http://www.tutorialspoint.com/javascript/array_foreach.htm
	http://stackoverflow.com/questions/9329446/for-each-over-an-array-in-javascript
	http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.16 (forEvery #hash)
--------------------------------------------------------------------------------------------------*/
Array.prototype.EZforEach = function forEachEZprototypeArray(callback, thisObj)
{
	if (typeof callback != "function")
		throw new TypeError();

	var callerName = arguments.callee.caller.displayName || '';
	var o = arguments[0] || this;
	var l = o.len || 1;				//range set before 1st call
	for (var i = 0; i < l; i++)
	{
		if ((i in o) == false) continue; //element no longer exists

		if (!callback.call(o, o[i], i, o))
		{
			if (callerName.indexOf('every') != -1) return false;
		}
		else
		{
			if (callerName.indexOf('some')) return false;
		}
	}
	return (callerName.indexOf('every') != -1) ? true
		 : (callerName.indexOf('some') != -1) ? false
		 : undefined;
}
if (!Array.prototype.forEach)
{
	Array.prototype.forEach = function(callback, thisObj)
	{ return this.EZforEach(callback, thisObj) }

	Array.prototype.every = function(callback, thisObj)
	{ return this.EZforEach(callback, thisObj) }

	Array.prototype.some = function(callback, thisObj)
	{ return this.EZforEach(callback, thisObj) }
}
/* initially added for testing EZforEach() in browsers with native forEach() */
Array.prototype.forEvery = function(callback, thisObj)
{ return this.EZforEach(callback, thisObj) }
/*--------------------------------------------------------------------------------------------------
String.format(args)

Format String by replacing parameters contained within the string of the form {0}, {1} ... {n}

Replacement arguments can optionally contain size of the form: {2: 20}

Replacement markers
	{align} 	fill each line with spaces to align all lines up to the {align} marker

with cooresponding arguments. Parameters outside the range of arguments ignored allowing multiple
formats to be applied to String.  Calling format with no arguments removes all parameters.

If the argument cooresponding to a parameter is an Array, its json representation replaces the
parameter -- Example:

	for argument value: [1,'abc',true] --> replacement value is: 1,'abc',true

	array.toString() is passed as the argument, replacement value is: 1,abc,true

EXAMPLE:
	"Today is {0} with high temperature {1} and low {2}".format('sunny',80);
		returns-->  "Today is sunny with high temperature 80 and low {2}"
	"Today is sunny with high temperature 80 and low {2}".format()
		returns-->  "Today is sunny with high temperature 80 and low"

ARGUMENTS:
	Any number of arguments can be specified cooresponding to parameters in string.
	If only one argument is supplied and its an array, it specifies the arguments values.
	if no arguments are supplied, any remaining parameters in string are cleared

RETURNS:
	string with parameters replaced by cooresponding arguments

REFERENCE:
	http://stackoverflow.com/questions/1353408/messageformat-in-javascript-parameters-in-localized-ui-strings
--------------------------------------------------------------------------------------------------*/
String.prototype.format = function formatEZprototypeString()
{
	if (!arguments.length)	//if no arguments supplied, clear all parameters from string
		return this.replace(/( ?\{(\d+)\} ?)/g, '$1'.replace(/  /,' ') );

	var args = [].slice.call(arguments,0);
	if (arguments.length == 1 && EZ.isArray(args[0]))
		args = args[0];					//if only argument is array, args passed as array


	// replace all parameters in string with supplied argument value
	var rtnValue = this.replace(/(( ?)\{(\d+):?(\d*)\}( ?))/g,
	function(str,param,leadindSpaces,idx,size,trailingSpaces)
	{
		if (idx >= args.length)			//if no more values, return single leading space if any
			return param;

		var value = '';
		if (EZ.isArray(args[idx]))		//if value is array of items return as quoted string...
		{								//...of array items keeping leading/trailing spaces
			value = ("'" + args[idx].join("','") + "'").replace(/'(\d+|true|false)'/g,'$1')
		}
		else							//otherwise replace and compress spaces
		{
			value = (leadindSpaces + args[idx] + trailingSpaces).replace(/  /,' ');
		}
		if (!isNaN(size) && size > 0)				//if size specified, pad or truncate value
		{
			value = (value + ' '.dup(size)).substr(0,size);
		}
		return value;
    });
	
	//----- replace {align} marker with spaces to align all containing lines
	var pattern = /(.*)(\{align})/g;
	var results = rtnValue.matchPlus(pattern);
	if (results.isFound && results.length > 0)
	{
		var maxCol = 0;
		rtnValue.replace(pattern, function(all,before,align)
		{
			maxCol = Math.max(maxCol, displayLength(before));
		});
		rtnValue = rtnValue.replace(pattern, function(all,before,align)
		{
			return before + ' '.dup(maxCol - displayLength(before));
		});
		function displayLength(all)
		{
			all = all.replace(/(['"])(.*)\1/gm, function(all)
			{
				return all.replace(/\t/g, '@@');
			});
			all = all.replace(/["\\]/g, '@');
			all = all.replace(/\t/gm, '@@@@');
			return JSON.stringify(all).length;
		}
	}

	return rtnValue;
}

//_____________________________________________________________________________________________
String.prototype.format.test = function()
{
	var arg, obj, values
		ctx = 'na', ex = 'na', exfn = null, note = '';
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	arg = ''
		+ 'RegExp( ""\n'
		+ '		"line\t" {align}{0}\n'
		+ "		'other\t' {align}{0}\n"
		+ '		bigger line {align}{1}\n'
	values = ['apple', 'pear'];
	EZ.test.results = {ex:ex, fn:exfn, ctx:arg, note:note};
	EZ.test.run(arg, values)
	//______________________________________________________________________________
	return //testend
}
/*--------------------------------------------------------------------------------------------------
String.formatStack(options)

Create Array from String split on \n so each items for represents a separate line -- next insert
a newline containing the notable immediately after the 1st line if it contains an error message
or as the 1st line if there is no error message.

The notable function is first function found with name not ending with start or setup -and-
not starting with skipprefix -- which defines libaray function name prefixes.

ARGUMENTS:
	this		(String) 	assumed to contain stacktrace -- stack property of error Object

	options		(optional) Object containing one or more of the following properties:
				skipCount	number of functions to remove from top of stack
				skipPrefix	Array or String delimited with commas or spaces specifing library
							function name prefixes not to be considered as a notable function
							default: EZ,RZ,DW

				wrapTag		html tag used to wrap reformatted Array converted to String
				noteTag		specifies html tag to wrap notable function name / lineno
RETURNS:
	Array reformatted as decsribed above.
	String if wrap specified of form: <wrap>reformattedArray.join('\n')<wrap>
--------------------------------------------------------------------------------------------------*/
String.prototype.formatStack = function formatEZprototypeString(options)
{
	var stack = this;					//string containing stacktrace
	if (!stack) return [];

	if (EZ.stripConfigPath) stack = EZ.stripConfigPath(stack);
	if (EZ.stripUrlParameters) stack = EZ.stripUrlParameters(stack);

	options = !options ? {}
			: typeof(options) == 'object' ? options
			: {skipCount: options};		//legacy options was skipCount

	var maxCount = '.maxCount .max'.ov(options, 10);
	var skipCount = '.skipCount .skip'.ov(options, 0);

	var skipPrefix = EZ.toArray('.skipPrefix .prefix'.ov(options, 'EZ RZ DW'), ', ');
	var skipPattern = skipPrefix.length == 0 ? ''						//no skipPrefix
					: RegExp('(' + skipPrefix.join('|') + ')', 'i');	//create skipPattern

	var wrap = '.wrapTag .wrap'.ov(options, '');
	var note = '.noteTag .note'.ov(options, '');
	var begNote = note ? '<' + note + '>' : '@...';
	var endNote = note ? '</' + note + '>' : '...@';

	stack = stack.replace(/#?(:\d*):\d*/g, '$1');	//remove column
	stack = stack.replace(/(\w*:).*(\/.*Configuration(\.\d)?)/g, '...$2');
	stack = stack.split('\n');

	/*
		ReferenceError: slice is not defined
		doScript() lineno:2077
		   at EZtoString_format:400                 (http://localhost:8080/revize/debug/EZregex/js/EZtoString.js:400)
		   at Function.EZtoString [as toString]:47  (http://localhost:8080/revize/debug/EZregex/js/EZtoString.js:47)
		   at doScript:2077                         (http://localhost:8080/revize/debug/EZregex/js/EZregex.js:2077)
		   at HTMLTextAreaElement.eval:4            (eval at setupEvents (http://localhost:8080
	*/

	var funcMaxSize = 15;
	[true,false].forEach(function(maxSizePass)	//pre-process to determine funcMaxSize
	{
		var skip = skipCount;
		var offset = - skipCount;
		var stackLine = -1;
		var funcInserted = false;
		stack.slice().forEach(function(item, i)
		{										//reformat & put 1st non-EZ function on top
			if (stackLine < 0)
			{
				if (!/^\s*at/i.test(item)) return;
				stackLine = i;
			}
			if (skip-- > 0)
				return maxSizePass || stack.splice(stackLine,1);

			// groups:    1       2   3         4                5         6
			var labels = 'spaces, at, funcname, pathfile_lineno, filename, lineno';
			var pattern = /\n?(\s*?)(at)\s*([^(]+)\s*.*?(\((.*)(:[<>\d]*).*)?/;
			var results = item.matchPlus(pattern, labels);

			var funcname = results.funcname.trim();
			funcname = funcname.replace(/\s*\[.*?\]/, '');		//remove [as ...]
			funcname = funcname.replace(/Function\.EZ/, 'EZ');	//Function.EZ --> EZ
			results.set('funcname', funcname + (results.lineno || ''));

			results.set('pathfile_lineno', unescape(results.pathfile_lineno + ''));
			if (!results.filename)
				results.pathfile_lineno = '(...)'

			if (maxSizePass)
				return (funcMaxSize = Math.max(funcMaxSize, results.funcname.length+2));

			//----- add this function name/lineno after error message...
			while (!funcInserted)	//...if none yet added and this function is...
			{						//...not start or function with skipPattern
				if (results.funcname.right(5) != 'start'
				&& results.funcname.right(5) != 'setup'
				&& skipPattern && skipPattern.test(results.funcname))
					break;			//not notable function

				funcInserted = true;
				if (results.funcname && i != stackLine)
				{
					stack.splice(stackLine,0, begNote + results.funcname.trim()
								+ '() lineno'
								+ results.lineno + endNote);
					offset++;
				}
				break;
			}
			var format = ('{1}{2} {3:' + funcMaxSize + '} {4}').format(results);
			stack[i+offset] = format;
		});
	});
	return wrap ? '<' + wrap + '>' + stack.join('\n') + '</' + wrap + '>'
		 		: stack;	//return array
}
/*--------------------------------------------------------------------------------------------------
EZ.getCallerName([fn])

ARGUMENTS:
	fn		(optional) fn to find caller name (default is immediate caller)

RETURNS:
	name of the calling function's caller -OR- fn caller if specified.
--------------------------------------------------------------------------------------------------*/
EZ.getCallerName = function EZcallerName(fn)
{
	fn = fn || arguments.callee.caller;
	var caller = '.arguments.callee.caller'.ov(fn);
	return !caller ? 'NA'
	//	  : caller.EZgetName ? caller.EZgetName()
		  : caller.name || caller.displayName || 'anonymous';
}
/*--------------------------------------------------------------------------------------------------
EZ.getFunctionParts(fn)

	var fnName = funcParts[1];			//function statement name -- not same as oops funcName
	var argNames = funcParts[2];
	var code = funcParts[3];
--------------------------------------------------------------------------------------------------*/
EZ.getFunction = EZ.getFunctionParts = function EZgetFunction(fn)
{
	var fnObject
	var labels = 'name,args,body';
	var matches = (fn+'').matchPlus(EZ.patterns.fn, labels);

	//input[0]:	function (all /**/) { replace }
	//
	//	name[1]:	•empty•
	//	args[2]:	all /**/
	//	body[3]:	replace
	matches.set('name', matches.get('name', 'anonymous'));
	matches.set('args', matches.args.replace(/(.*)\s*(\/\*.*\*\/)/, '$1'.trim()));
	return matches;
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
EZ.indexOf.displayName = 'EZ.indexOf';
/*--------------------------------------------------------------------------------------------------
Array.indexOf(obj, fromIndex) -- Implements Array indexOf() function for older browsers

returns zero based index of first array element containing specified object or -1 if not found.

EXAMPLE:
	array.indexOf(1) returns first index that has a value of 1
	array.indexOf(obj) returns first index that references obj

ARGUMENTS:
	obj			obj to search for in array
	fromIndex 	starting index in array to start searching

RETURNS:
	returns zero based index of first array item containing specified object or -1 if not found

REFERENCE:
	Revize Dreamwaever Extension -- consider below:
	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
--------------------------------------------------------------------------------------------------*/
if (!Array.prototype.indexOf)
{
	Array.prototype.indexOf = function indexOfEZprototypeArray(obj, fromIndex)
	{
		if (fromIndex == null)
			fromIndex = 0;
		else if (fromIndex < 0)
			fromIndex = Math.max(0, this.length + fromIndex);

		for (var i=fromIndex; i<this.length; i++)
			if (this[i] === obj) return i;

		return -1;
	};
	Array.prototype.indexOf.displayName = 'Array.prototype.indexOf';
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

	prefix = prefix || '';
	suffix = suffix || '';
	delimiter = suffix + (delimiter || '') + prefix

	if (array.length == 0 || (array.length == 1 && array[0] === '')) return '';

	return prefix + [].join.call(array,delimiter) + suffix;
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
{ return EZ.join(array, delimiter || ', ', prefix, suffix); }

/**
 *	EZ.joinWithSuffix(array, suffix[, delimiter])
 *
 *	join array with specified suffix using delimiter ", " or supplied delimiter
 */
EZ.joinWithSuffix = function EZjoinWithSuffix(array, suffix, delimiter)
{ return EZ.join(array, delimiter || ', ', prexix, suffix); }

/**
 *	Array.prototype.joinWithPrefixAndSuffix(prefix, suffix[, delimiter])
 *
 *	join array with specified prefix and suffix using default delimiter ","
 */
Array.prototype.joinWithPrefixAndSuffix = function joinWithPrefixAndSuffixEZprototypeArray(prefix, suffix, delimiter)
{ return EZ.join(this, delimiter || ', ', prefix, suffix); }

/**
 *	Array.prototype.joinWithPrefix(prefix[, delimiter])
 *
 *	join array with specified prefix using delimiter ", " or supplied delimiter
 */
Array.prototype.joinWithPrefix = function joinWithPrefixEZprototypeArray(prefix, delimiter)
{ return EZ.join(this, delimiter || ', ', prefix, suffix); }

/**
 *	Array.prototype.joinWithSuffix(suffix[, delimiter])
 *
 *	join array with specified suffix using delimiter ", " or supplied delimiter
 */
Array.prototype.joinWithSuffix = function joinWithSuffixEZprototypeArray(suffix, delimiter)
{ return EZ.join(this, delimiter || ', ', prexix, suffix); }
/*--------------------------------------------------------------------------------------------------
Object.keys(o)

returns Array of owner properties for an Object

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) Object.keys = (function EZkeysObject()
{
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj)
	{
      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
}());
--------------------------------------------------------------------------------------------------*/
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
--------------------------------------------------------------------------------------------------*/
Array.prototype.is = function isEZprototypeArray(choices)
{
	return EZ.is(choices);
}
Boolean.prototype.is = function isEZprototypeBoolean(choices)
{
	return EZ.is(choices);
}
Number.prototype.is = function isEZprototypeNumber(choices)
{
	return EZ.is(choices);
}
String.prototype.is = function isEZprototypeString(choices)
{
	return EZ.is(choices);
}
/*--------------------------------------------------------------------------------------------------
EZ.isCaller()

ARGUMENTS:
	fn		one or more functions -- Array required for multiple functions.

RETURNS:
	true if any of specified functions in call stack; otherwise false.
--------------------------------------------------------------------------------------------------*/
EZ.isCaller = function EZisCaller(fn)
{
	fn = EZ.toArray(fn);
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
	EZ.test.run(null, 				{EZ: {ex:false		}});
	EZ.test.run(0, 					{EZ: {ex:false 		}});
	EZ.test.run('', 				{EZ: {ex:false 		}});

	EZ.test.run(t_divs,[],			{EZ: {ex:false		}});
	EZ.test.run(t_divs,[null],		{EZ: {ex:false		}});
	EZ.test.run(t_divs,null,			{EZ: {ex:false		}});

	EZ.test.run(t_divs[0],tags[0],	{EZ: {ex:true		}});
	EZ.test.run(t_divs[1],tags[0],	{EZ: {ex:false		}});
	EZ.test.run(t_divs[1],tags,		{EZ: {ex:true		}});
	EZ.test.run(tags[0],tags,		{EZ: {ex:false		}});
	EZ.test.run(t_divs,tags,			{EZ: {ex:true		}});

	EZ.test.run(t_divs,'body',		{EZ: {ex:true		}});
	EZ.test.run(t_divs,'div',			{EZ: {ex:true		}});
	EZ.test.run(tags[0],radios,		{EZ: {ex:false		}});
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
	hybrid = [1,2,3];
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
	if (obj.length === 0 && options !== true && typeof(obj) == 'function') return false;
--------------------------------------------------------------------------------------------------*/
EZ.isArrayLike = function EZisArrayLike(obj, options)
{
	if (obj == null || typeof(obj) != 'object') return false;
	if (obj.constructor == Array) return true;

	if (obj.length == undefined || isNaN(obj.length)) return false;
	if (obj.length != Math.floor(obj.length)) return false;

	if (obj.childNodes != undefined) return false;

	EZ.styleConstructor = EZ.styleConstructor || 'document.body.style.constructor'.ov();
	if (obj.constructor == EZ.styleConstructor) return false;

	// if obj iterates like array w/o error, return true for ArrayLike
	var e;
	try
	{
		if ([].some.call(obj,function()
		{
			return true;	// only iterate on 1st item (or none if zero length array)
		}))
			return (obj.length > 0);	//behaved like non-zero length array
		else
			return (obj.length == 0);	//behaved like zero length array
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
	EZ.test.run(null			, {EZ: {ex:false  }})
	EZ.test.run(undefined		, {EZ: {ex:false  }})
	EZ.test.run(true			, {EZ: {ex:false  }})
	EZ.test.run(false			, {EZ: {ex:false  }})
	EZ.test.run([]				, {EZ: {ex:true  }})
	EZ.test.run([1,2,3]			, {EZ: {ex:true  }})

	EZ.test.run(tstFn				, {EZ: {ex:false  }})
	EZ.test.run(tstObj			, {EZ: {ex:false  }})
	EZ.test.run(tstObjArrayLike	, {EZ: {ex:true	  }})
	EZ.test.run(tstObjEmptyArray, {EZ: {ex:true   }})

	EZ.test.run(doc				, {EZ: {ex:false  }});
	EZ.test.run(none 			, {EZ: {ex:false  }});
	EZ.test.run(tags 			, {EZ: {ex:true   }});
	EZ.test.run(tags[0]			, {EZ: {ex:false  }});
	EZ.test.run(wrap.style		, {EZ: {ex:false  }});
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
EZ.isEl(arg, optrions)

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

	var rtnValue = undefined;
	EZ.toArray(arg).every(function(el)			//for each array item . . .
	{											//set rtnValue: true, false or undefined
		rtnValue = el == null || typeof(el) != 'object' ? false
				 : el.undefined === true ? undefined
				 : !el || el.childNodes == undefined ? false
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
	EZ.test.run(none, 			{EZ: {ex:undefined,		}});

	EZ.test.run(wrap, 			{EZ: {ex:true, 			note:'el'		}});
	EZ.test.run(radio01, 		{EZ: {ex:true, 			note:'array'		}});
	EZ.test.run(radios, 		{EZ: {ex:true, 			note:'collection'	}});
	EZ.test.run(tags, 			{EZ: {ex:true,	 		note:'collection'	}});

	EZ.test.run(mixed, 			{EZ: {ex:false,	 		note:'mixed'	}});
	EZ.test.run(mixed,'any', 	{EZ: {ex:true,	 		note:'mixed'	}});

	EZ.test.run(document,		{EZ: {ex:true,	 		note:'document'	}});
	EZ.test.run(document,true,	{EZ: {ex:false,	 		note:'document'	}});
	EZ.test.run(html,true,		{EZ: {ex:false,	 		note:'html'		}});
	EZ.test.run(head,true,		{EZ: {ex:false,	 		note:'head'		}});
	EZ.test.run(title,true,		{EZ: {ex:false,	 		note:'title'	}});
}
/*--------------------------------------------------------------------------------------------------
 *	return true if x and y are same typeof and equal
--------------------------------------------------------------------------------------------------*/
EZ.isEqual = function EZisEqual(x, y)
{

return isEqualObjects(x, y)
//	if (x != null && y != null && typeof x != typeof y)
//		return false;

	//null and undefined quickly compared by isEqualObjects()

	//==============================================
	return 'object function'.indexOf(typeof x) != -1
		 ? isEqualObjects(x, y)
		 : x === y;
	//==============================================
	/**
	 *	http://stackoverflow.com/questions/201183/how-to-determine-equality-for-two-javascript-objects/16788517#16788517
	 */
	function isEqualObjects(x, y)
	{
		if (x === null || x === undefined || y === null || y === undefined)
			return x === y; 				//not both null or undefined

		if (x.constructor !== y.constructor)
			return false;

		// if they are functions, they should exactly refer to same one (because of closures)
		// EZ -- NO -- may be pseudo Objects
		if (x instanceof Function)
		{
			if (isEqualObjects(EZ.getFunctionParts(x) != EZ.getFunctionParts(y)))
				return false;
			//return x === y;
		}

		// if they are regexps, they should exactly refer to same one
		// (it is hard to better equality check on current ES)
		// NO -- check properties -- except lastIndex
		if (x instanceof RegExp)
		{
			return x.global == y.global && x.ignoreCase == y.ignoreCase
				&& x.multiline == y.multiline && x.source == y.source;
			//return x === y;
		}

		if (x === y || x.valueOf() === y.valueOf())
			return true;						//both same object

		if (EZ.isArray(x) && x.length !== y.length)
			return false;

		//TODO: ??
		if (x instanceof Date)
			return x.getTime() == y.getTime();
			//return false;						//different dates

		// done before calling but need for recursion
		// if they are strictly equal, they both need to be object at least
		if (!(x instanceof Object) || !(y instanceof Object))
			return false;

		//--------------------------------
		// recursive object equality check
		//--------------------------------
		var p = Object.keys(x);
		return Object.keys(y).every(function (i)
		{
			return p.indexOf(i) !== -1;
		})
		&& p.every(function (i)
		{
			return isEqualObjects(x[i], y[i]);
		});
	}
}
//__________________________________________________________________________________________________
	/*
	EZ.test.run({1:{name:"mhc",age:28},
				 2:{name:"arb",age:26}},
				 {1:{name:"mhc",age:28},
				  2:{name:"arb",age:26}}, {EZ:{ ex:true }});
	EZ.test.run({1:{name:"mhc",age:28},
				 2:{name:"arb",age:26}},
				{1:{name:"mhc",age:28},
				2:{name:"arb",age:27}}, {EZ:{ ex:false }});
	*/
EZ.isEqual.test = function(x, y)
{
	EZ.test.run(null,null, 				{EZ:{ ex:true }});
	EZ.test.run(null,undefined,			{EZ:{ ex:false }});
	EZ.test.run(/abc/, /abc/, 			{EZ:{ ex:true }});
	EZ.test.run(/abc/, /123/, 			{EZ:{ ex:false }});

	var r = /abc/;
	EZ.test.run(r, /abc/, 				{EZ:{ ex:true }});
	EZ.test.run(r, /ab/, 				{EZ:{ ex:false }});

	EZ.test.run("hi","hi",				{EZ:{ ex:true }});
	EZ.test.run(5,5, 					{EZ:{ ex:true }});
	EZ.test.run(5,10, 					{EZ:{ ex:false }});

	EZ.test.run([],[], 					{EZ:{ ex:true }});
	EZ.test.run([1,2],[1,2], 			{EZ:{ ex:true }});
	EZ.test.run([1,2],[2,1],			{EZ:{ ex:false }});
	EZ.test.run([1,2],[1,2,3], 			{EZ:{ ex:false }});

	EZ.test.run({},{}, 					{EZ:{ ex:true }});
	EZ.test.run({a:1,b:2},{a:1,b:2},	{EZ:{ ex:true }});
	EZ.test.run({a:1,b:2},{b:2,a:1}, 	{EZ:{ ex:true }});
	EZ.test.run({a:1,b:2},{a:1,b:3}, 	{EZ:{ ex:false }})

	EZ.test.run({},null, 				{EZ:{ ex:false }});
	EZ.test.run({},undefined, 			{EZ:{ ex:false }});

	EZ.test.run("hi","hi", 				{EZ:{ ex:true }});
	EZ.test.run(new Number(5),5, 		{EZ:{ ex:true }});
	EZ.test.run(new Number(5),10, 		{EZ:{ ex:false }});
	EZ.test.run(new Number(1),"1", 		{EZ:{ ex:false }});

	EZ.test.run([],[], 					{EZ:{ ex:true }});
	EZ.test.run([1,2],[1,2], 			{EZ:{ ex:true }});
	EZ.test.run([1,2],[2,1], 			{EZ:{ ex:false }});
	EZ.test.run([1,2],[1,2,3], 			{EZ:{ ex:false }});

	EZ.test.run(new Date("2011-03-31"),new Date("2011-03-31"), {EZ:{ ex:true }});
	EZ.test.run(new Date("2011-03-31"),new Date("1970-01-01"), {EZ:{ ex:false }});

	EZ.test.run({},{}, 				 	{EZ:{ ex:true }});
	EZ.test.run({a:1,b:2},{a:1,b:2}, 	{EZ:{ ex:true }});
	EZ.test.run({a:1,b:2},{b:2,a:1}, 	{EZ:{ ex:true }});
	EZ.test.run({a:1,b:2},{a:1,b:3}, 	{EZ:{ ex:false }});

	//moved too wide tests

	var a = {a: 'text', b:[0,1]};
	var b = {a: 'text', b:[0,1]};
	var c = {a: 'text', b: 0};
	var d = {a: 'text', b: false};
	var e = {a: 'text', b:[1,0]};
	var i = {
		a: 'text',
		c: {
			b: [1, 0]
		}
	};
	var j = {
		a: 'text',
		c: {
			b: [1, 0]
		}
	};
	var k = {a: 'text', b: null};
	var l = {a: 'text', b: undefined};

	EZ.test.run(a,b, {EZ:{ ex:true }});
	EZ.test.run(a,c, {EZ:{ ex:false }});
	EZ.test.run(c,d, {EZ:{ ex:false }});
	EZ.test.run(a,e, {EZ:{ ex:false }});
	EZ.test.run(i,j, {EZ:{ ex:true }});
	EZ.test.run(d,k, {EZ:{ ex:false }});
	EZ.test.run(k,l, {EZ:{ ex:false }});

	// from comments on stackoverflow post
	EZ.test.run([1, 2, undefined], [1, 2], 			{EZ:{ ex:false }});
	EZ.test.run([1, 2, 3], { 0: 1, 1: 2, 2: 3 }, 	{EZ:{ ex:false }});
	EZ.test.run(new Date(1234), 1234, 				{EZ:{ ex:false }});

	// no two different function is equal really, they capture their context variables
	// so even if they have same toString(), they won't have same functionality
	var func = function (x) { return true; };
	var func2 = function (x) { return true; };

	EZ.test.run(func, func, 							{EZ:{ ex:true }});
	EZ.test.run(func, func2, 							{EZ:{ ex:true }});
	EZ.test.run({ a: { b: func } }, { a: { b: func } }, {EZ:{ ex:true }});
	EZ.test.run({ a: { b: func } }, { a: { b: func2 } },{EZ:{ ex:true }});

	EZ.test.run(t_divs[0], t_divs[0].cloneNode(true),		{EZ:{ ex:true }});
	EZ.test.run(t_divs[0], t_divs[0].cloneNode(),			{EZ:{ ex:false }});
	EZ.test.run(radios, radios,			{EZ:{ ex:true }});

}
/*--------------------------------------------------------------------------------------------------
EZ.isObject(o, isEl)

return true if NOT null, undefined, not EZnone object -AND- either constructor is Object
-OR- is any other typeof object (except Array) and object does not have childNodes property.

isEl to return true for html element, Array or collection of elements.
--------------------------------------------------------------------------------------------------*/
EZ.isObject = function EZisObject(o, isEl)
{
	if (o == null || o == undefined || EZ.isArray(o)
	|| typeof(o) != 'object' || o.valueOf() == false)
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
	true if o.valueOf() false and length == 0 -OR- has non-hasOwnProperty property
--------------------------------------------------------------------------------------------------*/
EZ.isEmpty = function EZisEmpty(o, options)
{
	if (o == null || 'object function'.indexOf(typeof(o)) == -1) return true;

	// Only Revize extension reference is in RevizeResouces::RZgetTemplateList()
	if (EZ.isLegacy(options))
	{
		for(var i in o) {return false;}
		return true;
	}

	// true (i.e. empty) when valueOf() false and length == 0
	if (!o.valueOf() && (!EZ.isArrayLike(o) || o.length == 0)) return true;

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
	if ('.legacy'.ov(options) != undefined)
		return options.legacy;		//if options contains legacy property, return value

	key = ('EZ.global.legacy.') + (args.shift() || EZ.getCallerName());
	defaultValue = args[0] != undefined ? args.shift() : true;
									//else return EZ.global.legacy.callerName if defined
	return (key.ov(defaultValue));	//if not defined, return defaultValue if supplied
									//otherwise true
}
/*--------------------------------------------------------------------------------------------------
EZ.isNone(value) -- LEGACY

Must use if value could be object since no Object protoTypes are defined.
Does not use EZ.getOptions() -- can be used during options setup
--------------------------------------------------------------------------------------------------*/
EZ.isNone = function EZisNone(value)
{
	if (typeof(value) == 'unknown' || value == undefined || value === null)
		return true;

	switch (typeof value)
	{
		case 'string'	: return value === '';
		case 'number'	: return isNaN(value);
		case 'boolean':
		case 'function': return false;
		case 'object':
		{
			if (EZ.isArrayLike(value)) 	return (value.length == 0);
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
		return EZisTrueLike(arg, ['-0 -# -* +no +yes'].merge(options) )

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
	if (typeof(value) == 'object' && !EZisNone(value)) return true;

	// Revize extension variant always returns false here

	//additions of all false values except 0 in lieu of always false to support zerovalue option
	if (value === false || value === 'false' || value === 'off' || value === 'no'
	|| value === null || value === undefined || value === '')
		return false;

	//addition for EZnone
	if (EZ.isNone(value)) return false;

	switch (options.zerovalue + '')
	{
		case 'false' : return false;
		case 'true'  : return true;
		case 'value' :
		default      : return arg;	//0 or "0" effectively false if caller just uses EZ.isTrue()
	}
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
/**
 *	return true if trueLike else false
 */
Boolean.prototype.isTrue = function EZisTrueBoolean()
{
}
/**
 *	return true if trueLike else false
 */
Number.prototype.isTrue = function EZisTrueNumber()
{
}
/**
 *	return true if trueLike else false
 */
String.prototype.isTrue = function EZisTrueString()
{
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
		false if fake/none HTML element unless EZ.none() in options

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
			if (isTrueFalse != undefined) return isTrueFalse;

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
			if (isTrueFalse != undefined) 			//...return if found
				return isTrueFalse;
													//check for empty object (checks ArrayLike length)...
			if (EZ.isEmpty(arg,{legacy:false})) 		//...html collection never empty (except EZnone)
				return false;						//return false -- when empty

			if (isRule('EZvalue') && EZ.is(arg))		//if arg is html collection and value option specifed
			{
				value = EZgetValue(arg)					//get value of 1st element or radio group
				isTrueFalse = checkValues(value);		//check truefalse values...
				if (isTrueFalse != undefined) 			//...if affirmative true/false result, return it
					return isTrueFalse;
				return value;							//...otherwise return element value
			}
			value == arg.valueOf();
			if (arg === value) 						//return true if valueOf() is arg itself as default...
				return true;						//...valueOf() returns (including html collection)

			while (typeof(value) == 'object') 		//while valueOf() is another Object . . .
			{
				if (rules.objectValues[value] != undefined)		//if have valueOf() for Object, return...
					return rules.objectValues[value] == true;	//...true/false based value (enen if Object)
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
		return rules.keys[opt] != undefined;
	}
	/**
	 *	return false for: ===undefined ===null ==='' ===false -OR- true for ===true
	 *  else return true or false if exact match in trueValues or falseValues
	 *	otherwise return undefined
	 */
	function checkValues(arg)
	{
		//----- check certian values
		if (arg === undefined || arg === null || arg === '' || arg === false) return false;
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
/**
 *	return true if trueLike else false
 */
Boolean.prototype.isTrueLike = function isTrueLikeEZprototypeBoolean()
{
}
/**
 *	return value
 */
Number.prototype.isTrueLike = function isTrueLikeEZprototypeNumber()
{
}
/**
 *	return true if trueLike else false
 */
String.prototype.isTrueLike = function isTrueLikeEZprototypeString()
{
}
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
	var ruleGroups = {
		'js-spec': ['-0 +# +* -[] -{} -yes, -no', '+0 +# +* +[] +{} +yes, +no']
	}

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
	if (/(boolean|number|string)/.test(typeof arg) && arg.isFalse() == false) return true;

	if (arg == undefined || arg == null || typeof(arg) != 'object') return true;

	if (arg.childNodes != undefined && arg.tagName == 'none') return true;

	if (EZ.isArrayLike(arg) && length < 1) return true;

	if (EZ.isFalse(arg) == false) return true;

	if (EZ.isEmpty(arg)) return true;
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
/**
 */
Boolean.prototype.isFalse = function isFalseEZprototypeBoolean()
{
	if (this == false) return true;;
}
/**
 */
Number.prototype.isFalse = function isFalseEZprototypeNumber()
{
	if (this == 0 || isNaN(this)) return false;
}
/**
 */
String.prototype.isFalse = function isFalseEZprototypeString()
{
		return this.isTrueLike();
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
--------------------------------------------------------------------------------------------------*/
/**
 *	return value
 */
Boolean.prototype.isTrueFalseValue = function isTrueFalseValueEZprototypeBoolean()
{
}
/**
 *	return true if trueLike; false if falseLike otherwise number
 */
Number.prototype.isTrueFalseValue = function isTrueFalseValueEZprototypeNumber()
{
	if (this.isTrueLike()) return true;
	if (this.isFalseLike()) return false;
	return this.toString();
}
/**
 *	return true if trueLike; false if falseLike otherwise value -- '0' returned as '0'
 */
String.prototype.isTrueFalseValue = function isTrueFalseValueEZprototypeString()
{
	if (this.isTrueLike()) return true;
	if (this.isFalseLike()) return false;
	return this.toString();
}
/*--------------------------------------------------------------------------------------------------
String.join(strings, separator)

Joins non-empty strings -- separated with specified separator (default: \n)
Great for combining messages -- or other strings that may be empty -- eliminates need to check
both strings before inserting separator.

USAGE:
	append msg if not blank with \n inserted between message and msg
	message = EZ.concatStrings(message,msg)
	message = EZ.concatStrings([message,msg], '<br>')

ARGUMENTS:
	strings		if Array-Like object, contains strings to combine.
				otherwise all arguments are combined using default separator.

	separator	(optional) specifies separator inserted between non-blank strings
				only recognized if strings is array otherwise its one of the strings.
				(default: \n)

RETURNS:
	joins all non-blank strings separated with specified separator or \n
--------------------------------------------------------------------------------------------------*/
String.prototype.join = function joinEZprototypeString(strings, separator)
{
	var array = EZ.arrayFromArguments(arguments);
	array.unshift(this);	//1st string is the String -- may be blank
	separator = (typeof(strings) != 'string' ? separator : '') || '\n';

	//----- convert all array elements to strings -- skipping if blank or undefined
	for (var i=0; i<array.length; i++)
	{
		while (i<array.length)
		{
			if (array[i] == undefined)
				array[i] = '';
			array[i] = array[i] + '';
			if (array[i] === '')
				array.splice(i,1);
			else
				break;
		}
	}

	//----- return string from array elements -- join using separator if length > 1
	switch(array.length)
	{
		case 0: return '';
		case 1: return array[0];
		default: return array.join(separator);
	}
}
String.prototype.join.displayName = 'String.prototype.join';
/*--------------------------------------------------------------------------------------------------
EZ.left(str, noChars)

return empty string if str not typeof string
--------------------------------------------------------------------------------------------------*/
EZ.left = function EZleft(str, noChars)
{
	if (typeof(str) != 'string') return '';
	return str.substr(noChars);
}
EZ.left.displayName = 'EZ.left';
/*--------------------------------------------------------------------------------------------------
String.left(number)

return leftmost number of string characters up to length of string or leftmost character if
number not supplied.  Empty string returned if number is NaN, less than or equal zero.
--------------------------------------------------------------------------------------------------*/
if (!String.prototype.left)
{
String.prototype.left = function leftEZprototypeString(number)
{
	if (number == undefined) number = 1;
	if (isNaN(number) || number <= 0) return '';

	return this.substr(0, number);
}
}
/*--------------------------------------------------------------------------------------------------
EZ.matchPlus(inStr,regex,flags,length)

call String.matchPlus.prototype with specified searchStr (or empty String if null or undefined)
--------------------------------------------------------------------------------------------------*/
EZ.matchPlus = function EZmatchPlus(searchStr,regex,flags,length)
{
	if (searchStr == undefined) searchStr = '';;
	return (searchStr + '').matchPlus(regex,flags,length);
}
/*--------------------------------------------------------------------------------------------------
String.prototype.matchPlus(regex, labels, length)

Same as String.match() with following enhancements:
	Always returns Array Object even when no match found never null
	All Array items blank when no matches found
	All undefined items set to blank regardless of is group undefined

ARGUMENTS:
	regex		RegExp or String used to create RegExp
	labels	(optional) Array or comma delimited string containing names associated
				groups in specified regex -- returned defines results property for each
				group name and sets to associated Array item or blank if out of bounds.

	length		(optional) minimum length of returned Array -- 2nd arg if flags omitted

RETURNS: results Array with same properties as String.match() with the following differences:

	index 		-1 if no match

	lastIndex 	character position following the last matched String -- 0 if no match found

	length		number of groups in regex even if no match found -OR-
				number of matches if global search (if none then length of prototype String)
				(all Array items blank when no matches found)
	
	count		number of matches

	start		(Array) containing offset to each matched sub-string (global) or group (non-global)
				if no matches, all items are 0
	end			(Array) set to character position following matched sub-string or 0 if no match

	isFound		=true if match found otherwise false

	results Array returns false when no match for conditionals of the following form:
		if (String.matchPlus(...) == false)
		if (String.matchPlus(...)) is always true for any Array (as required by ECMA spec)
--------------------------------------------------------------------------------------------------*/
String.prototype.matchPlus = function matchPlusEZprototypeString(regex, groupLabels, length)
{
	length = !isNaN(length) ? length : 0;
	if (arguments.length == 2 && !isNaN(groupLabels))
	{
		length = groupLabels;
		groupLabels = '';
	}
	groupLabels = EZ.toArray(groupLabels, ', ')

	var isLegacy = true;	//09-18-2015	EZ.isLegacy();
	var isFound = true;
	var isGlobal = true;
	var groupCount = length || this.length;
	var results = null;
	var e, i;
	try
	{
		if (regex == undefined) regex = '';
		if (regex.constructor != RegExp)
		{
			if (typeof(regex) == 'string')
				regex += '';

			// 1st check for pattern-like string e.g.. /abc/i
			results = regex.match(/^\/(.*)\/([gmi]*)$/i);
			if (results)
				regex = new RegExp(results[1].replace(/\\/g,'\\\\'),results[2]);

			else
				regex = new RegExp(regex);
		}
		if (regex.source.indexOf(' ~ ') != -1)		//remove " ~ " from pattern
		{
			var flags = (regex.global ? 'g' : '') + (regex.ignoreCase ? 'i' : '') + (regex.multiline ? 'm' : '');
			regex = RegExp(regex.source.replace(/ ~ /g, ''), flags);
		}
		//----------------------------------------------------
		//----- RegExp at this point -- exception thown if not
		//----------------------------------------------------
		isGlobal = regex.global;
		var groups = ')' + regex.source.replace(/\\[()]/g,'').replace(/[^()]/g, '');
		if (!isGlobal)
		{
			groupCount = groups.count('(');		//estimate -- use if no match
			if (groupCount) groupCount++

			/* old group count algorithm
			regex = new RegExp( '(^|' + regex.source + ')' );
			groupCount = this.match(regex).length-1;
			*/
		}
		//==========================
		results = this.match(regex);
		//==========================

		if (results)	//if matches found . . .
		{
			results.count = groupCount = results.length;
			try					//safety to continue if logic error
			{
				if (isGlobal)	//find global: index, lasIndex, start & end
				{
					results.start = [];
					results.end = [];

					//--------------------------------------------------------------------
					// 08-15-3015: use exec() to populate results.start[]/end[]
					// 			   exec() issues with /^\s*$/gm
					//--------------------------------------------------------------------
					if (!isLegacy)
					{
						var eachResult;
						while (eachResult = regex.exec(this))
						{
							results.start.push(eachResult.index);
							results.end.push(eachResult.index + eachResult[0].length);
						}
						results.index = results.start[0];
						results.lastIndex = results.end[results.end.length-1];
					}
					//--------------------------------------------------------------------
					// legacy code
					//--------------------------------------------------------------------
					else
					{
						var flags = regex.ignoreCase ? 'i' : ''
								  + regex.multiline ? 'm' : '';

						regex = new RegExp(regex.source, flags);	//use non-global varient of regex to...
						results.index = this.search(regex);			//...determine start/end offsets all groups

						results.lastIndex = 0;						//update as group offsets found
						for (i=0; i<results.length; i++)
						{
							results.lastIndex += this.substr(results.lastIndex).search(regex);
							results.start.push(results.lastIndex);
							results.lastIndex += results[i].length;
							results.end.push(results.lastIndex);
						}
					}
				}
				//----- for non-global match populate start/end Arrays with sub-expression(s) offsets
				else
				{
					var offset = 0;
					if (!results.lastIndex)
						results.lastIndex = results.index + results[0].length;

					results.start = [results.index];
					results.end = [results.lastIndex];

					var groupsOffset = 0;
					var depth = 0;
					var depthOffsets = [0];
					for (i=1; i<results.length; i++)
					{
						if (results[i] == undefined)
							results[i] = '';
						offset = getGroupOffset();	//complexity here
						offset = results[0].indexOf(results[i], offset);
						results.start.push(offset);
						offset += results[i].length
						results.end.push(offset);

						depthOffsets[depth] = offset;
					}
				}
			}
			catch (e)
			{
				EZ.oops(e, 'Unable to determine some or all group start/end offsets');
			}
		}
	}
	catch (e)
	{
		EZ.log(e);
		results = null;
		regex = null;
	}

	//--------------------------------------------------------------------
	//----- create pseudo results Array if no matches
	//--------------------------------------------------------------------
	length = Math.max(length,groupCount);

	if (!results)
	{
		isFound = false;
		results = new Array(length);
		results.count = 0;
		results.input = this.toString();
		results.index = 0;
		results.lastIndex = 0;
		results.start = new Array(groupCount)
		results.end = new Array(groupCount);
		results.undefined = true;
	}

	//----- make sure all groups defined -- actual plus pseudo if length specified
	for (i=0;i<results.length;i++)
	{
		if (results[i] == undefined) results[i] = '';
		// no match found or exception determining group offsets
		if (results.start[i] == undefined)
		{
			results.start[i] = isGlobal ? 0 : results.start[i-1];
			results.end[i] = isGlobal ? 0 : results.end[i-1];
		}
	}
	results.isFound = isFound;

	//----- populate results.offsets -- //1:[0,4], 2:[6-28]...
	results.offsets = ''	//all:[0,4], 1:[6-28], ...
	var labels = [''].concat(groupLabels);
	for (i=0; i<results.start.length; i++)
	{
		var label = (!isGlobal && labels[i]) ? labels[i] : i;
		results.offsets += label + ':[' + results.start[i] + ',' + + results.end[i] + '], ';
	}
	results.offsets = results.offsets.clip(2);

	//----- set values for group specified labels if not global regex
	results.keys = ['input'];
	results.values = {};
	if (groupLabels && !isGlobal)
	{										//append specified groupLabels
		results.keys = results.keys.concat(groupLabels);
		for (var i=0; i < groupLabels.length; i++)
		{
			var key = groupLabels[i];
			if (key == undefined || !isNaN(key) || key in results ) continue;
			var value = (i+1) < results.length ? results[i+1] : '';
			results.values[key] = value;
			if (!results[key]) 				//also set results property if label...
				results[key] = value;		//...not existing  results property
		}
	results.labels = results.values;		//backward compatibility
	}

	  //----------------------------------\\
	 //----- define results functions -----\\
	//--------------------------------------\\
	/**
	 *	get value of sub-expression associated with specified group label (key)
	 *	if unknown key and defaultValue not undefined, create new values object
	 */
	results.get = function(key, defaultValue)
	{
		key = key || '_undefined';
		if (!this.values) this.values = {};

		var value = this.values[key];

		if (typeof(this.values[key]) == 'undefined' && defaultValue != undefined)
			return this.set(key, defaultValue);
		return value;
	}
	/**
	 *	set existing or new values object of specified key to specified value
	 */
	results.set = function(key, value)
	{
		key = key || '_undefined';
		if (!this.values) this.values = {};

		this.values[key] = value;
		var idx = this.keys.indexOf(key);
		if (idx != -1)
			this[idx] = value;		//update Array item associated with key (groupLabel)


		if (!/(get|set|values)/.test(key))
			this[key] = value;

		return value;			//return value as convenience
	}
	//----- define return value as isFound in returned results or via valueOf()
	// 		to support:  "if (results == false) ..."
	results.valueOf = function()
	{
		return this.isFound;	//null cannot be tested
	}
	/*
	results.toString = function()
	{
		return this.isFound ? true : null;
	}
	*/
	//======================
	return results;
	//======================
	/**
	 *	Internal helper function for computing sub-expression offsets
	 *	deceptively simple algorithm to find embedded parentheses groups
	 *	TODO: not sure all possible scenarios handled.
	 */
	function getGroupOffset()
	{
		groupsOffset = groups.indexOf('(', groupsOffset) + 1;
		var groupStr = groups.substring(0,groupsOffset);
		var openCount = groupStr.match(/\(/g).length
		var closeCount = groupStr.match(/\)/g).length;
		var depth = openCount - closeCount;

		offset = results.start[i-depth-1];
		if (depth < depthOffsets.length)
			offset = depthOffsets[depth];

		else if (depth == depthOffsets.length)
			depthOffsets[depth] = offset;

		else if (depth < depthOffsets.length - 1)		//discard higher depth offsets
			depthOffsets.splice(depth, depthOffsets.length - depth);
	}
}
String.prototype.matchPlus.displayName = 'String.prototype.matchPlus';
//_____________________________________________________________________________________________
String.prototype.matchPlus.test = function()
{
	var note, str, instr, regex, results;

	/* not finished
	instr = 'abc';
	regex = /c/;
	results = instr.match(regex);
	EZ.test.run(instr, regex,		{EZ: {ex:results, note:''	}})
	*/

	//------------------------------------------------------------------------
	note = 'results.start[]/end[] may not be correct with legacy code'
	//------------------------------------------------------------------------
	str = '____0@ <span id="EZ_73308395_0">(HTMLDivElement): </span>'	+ '\n'
		+ ''											+ '\n'
		+ '   tagName: DIV¬'							+ '\n'
		+ '   parent: &lt;form action="" method="p...'	+ '\n'
		+ '   id: EZtest_wrap¬'							+ '\n'
		+ ''											+ '\n'
		+ '  ____1@  style (CSSStyleDeclaration):'		+ '\n'
		+ ''											+ '\n'
		+ '<a name="EZ_73308395_2"></a> <span id="EZ_73308395_2" '
		+ 'class="repeat EZ_undefined">childNodes (NodeList): repeated x3</span>'			+ '\n'
		+ '     ____2@ [0] (Text) •blank•'				+ '\n'
		+ '[1] (HTMLLabelElement)'						+ '\n'
		+ '         tagName: LABEL¬'					+ '\n'
		+ '         parent: &lt;div id="EZtest_wrap">¬'					+ '\n'
		+ '         id: EZtest_input¬'					+ '\n'
		+ '        ____3@  style (CSSStyleDeclaration) [0]:'			+ '\n'
		+ ' childNodes (NodeList):'										+ '\n'
		+ '            ...repeat of:<a href="#73308395_2">HTMLDivElement.childNodes</a>'	+ '\n'
		+ '      3____@'								+ '\n'
		+ '[2] (Text) •blank•'							+ '\n'
		+ '[3] (HTMLUnknownElement)'					+ '\n'
		+ '         tagName: EZTEST_TAG¬'				+ '\n'
		+ '         parent: &lt;div id="EZtest_wrap">¬'					+ '\n'
		+ '         id: EZtest_tag0¬'					+ '\n'
		+ '         class: EZtest_class0¬'				+ '\n'
		+ '        ____3@  style (CSSStyleDeclaration) [0]:'			+ '\n'
		+ ' childNodes (NodeList):'						+ '\n'
		+ '            ...repeat of:<a href="#73308395_2">HTMLDivElement.childNodes</a>'	+ '\n'
		+ '      3____@'								+ '\n'
		+ '[4] (Text) •blank•'							+ '\n'
		+ '[5] (HTMLUnknownElement)'					+ '\n'
		+ '         tagName: EZTEST_TAG¬'				+ '\n'
		+ '         parent: &lt;div id="EZtest_wrap">¬'					+ '\n'
		+ '         id: EZtest_tag1¬'					+ '\n'
		+ '         class: EZtest_class1¬'				+ '\n'
		+ '        ____3@  style (CSSStyleDeclaration) [0]:'			+ '\n'
		+ ' childNodes (NodeList):'						+ '\n'
		+ '            ...repeat of:<a href="#73308395_2">HTMLDivElement.childNodes</a>'	+ '\n'
		+ '      3____@'								+ '\n'
		+ '[6] (Text) •blank•'							+ '\n'
		+ '   2____@'									+ '\n'
		+ '1____@'										+ '\n'
		+ '0____@'										+ '\n'
		+ ''											+ '\n'
	results =
		[/* 0: */ '4____@'								+ '\n'
				+ '[2] (Text) •blank•'					+ '\n'
				+ '[3] (HTMLSpanElement)'				+ '\n'
				+ '				tagName: SPAN¬'  		+ '\n'
				+ '				parent: &lt;label id="test_id1" clas...'	+ '\n'
				+ '			   ____4@ '
		,/* 1: */ '2____@'  + ''						+ '\n'
				+ '[1] (HTMLInputElement)'				+ '\n'
				+ '      tagName: INPUT¬'				+ '\n'
				+ '      parent: &lt;label>¬'			+ '\n'
				+ '      name: EZtest_radio¬'			+ '\n'
				+ '      type: radio¬'					+ '\n'
				+ '      value: some¬'					+ '\n'
				+ '      id: EZtest_radio1¬'			+ '\n'
				+ '      class: test_id1 idandclass¬'	+ '\n'
				+ '     ____2@ '
		,/* 2: */ '2____@'								+ '\n'
				+ ' test_id1 (HTMLLabelElement):'		+ '\n'
				+ '     [tagName]: LABEL¬'				+ '\n'
				+ '     [id]: test_id1¬'				+ '\n'
				+ '     ____2@ '
		,/* 3: */ '2____@'								+ '\n'
				+ '<a name="EZ_79357510_17"></a> <span id="EZ_79357510_17" class="repeat ' 	/*...*/
				+ 'EZ_undefined">EZtest_radio1 (HTMLInputElement): repeated x1</span>' 		+ '\n'
				+ '     [tagName]: INPUT¬'				+ '\n'
				+ '     [name]: EZtest_radio¬'			+ '\n'
				+ '     [type]: radio¬'					+ '\n'
				+ '     [value]: some¬'					+ '\n'
				+ '     [id]: EZtest_radio1¬'			+ '\n'
				+ '     ____2@ '
		];
		results.start = [770,1133,1384,1616];
		results.end = [915,1346,1477,1888];
		results.index = 770;
		results.lastIndex = 1888;
		results.isFound = true;

	EZ.test.run(str, /(\d*)____@\n([\s\S]*?)____\1@ /g,		{EZ: {ex:results, note:note	}})
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
EZ.merge = function EZmerge(options, baseObj, from)
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
/**
 *
 */
EZ.merge.test = function()
{
	var o = {a:1, b:2};		//use clone below to retain "as is" for all sebsequent tests
	EZ.test.run(EZ.clone(o), {}				, {EZ:{ex:o }})
	EZ.test.run(EZ.clone(o), {a:11, b:22}	, {EZ:{ex:{a:11, b:22} }})

	var div = document.createElement('div');
	var span = document.createElement('span');
	divObj = {d:div}
	spanObj = {d:span}
	EZ.test.run({},divObj,spanObj, 		{EZ: {ex:{d:div, s:span},	note:''	}})

return;
	EZ.test.results.push( EZ.merge() );
	EZ.test.results.push( EZ.merge({}) );
	EZ.test.results.push( EZ.merge({}, {a:11, b:22, c:33}) );
	EZ.test.showResults();
}
/*--------------------------------------------------------------------------------------------------
In place merge all items from newArray into this Array first by deleting duplicates in this
Array then appending to to the end.
--------------------------------------------------------------------------------------------------*/
Array.prototype.merge = function mergeEZprototypeArray(newArray)
{
	if (!newArray) return this;
	newArray = EZ.toArray(newArray);

	var idx;
	return [].slice.call(newArray).forEach(function(item)
	{
		while ((idx = this.indexOf(item)) != -1)
			this.splice(idx,1);
		this.push(item);

	});
	return this;
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
TODO: DW & EASY different code
String.right(number)

Return rightmost number of string characters or rightmost character if number not supplied.
Empty string returned if number is NaN, greater than string length, less than or equal zero.
--------------------------------------------------------------------------------------------------*/
if (!String.prototype.right)
{
	String.prototype.right = function rightEZprototypeString(number)
	{
		if (number == undefined) number = 1;
		if (isNaN(number) || number <= 0 || number > this.length) return '';

		return this.substr(this.length - number);
	}
}
/*--------------------------------------------------------------------------------------------------
Array.remove([fromIndex][,toIndex] | [value, value,...], [array-of-values])

returns new Array with specified items removed -- original Array is unchanged.

If no arguments, remove blank, null or undefined Array items.
If first argument is not number, remove all items matching value of any argument.
If first argument is an Array or ArrayLike object, remove any item matching any of the Array items.

otherwise when fromIndex is number, remove slice of elements starting with fromIndex thru
toIndex if specified or to end of Array -- i.e. splice() alternative w/o changing original Array.

NOTE: called by EZ.toArray() to elimanate blank items converting delimited string to Array.

	var rest = this.slice((toIndex || fromIndex) + 1 || this.length);
	this.length = fromIndex < 0 ? this.length + fromIndex : fromIndex;
	return this.push.apply(this, rest);

	if (arguments.length == 0)
		fromIndex = [];
--------------------------------------------------------------------------------------------------*/
Array.prototype.remove = function removeEZprototypeArray()
{
	if (EZ.test.capture()) {return EZ.test.capture(this)} else if (EZ.test.debug()) debugger;

	var rtnArray = this.slice();
	var values = arguments[0];
	var fromIndex = arguments[0];
	var toIndex = arguments[1];

	//----- Determine if removing values or slice
	if (arguments.length == 0)
		values = ['', null, undefined];
	else if (values == null)
		values = [values];

	var isRemoveValues = EZ.isArrayLike(values) || values.constructor == RegExp;
	if (!isRemoveValues)
	{
//		if ('object function'.indexOf(typeof values) != -1)
//			return this;

		if (typeof(values) == 'boolean'
		|| isNaN(values) || values == null || !values.toString())
		{
			values = [].slice.call(arguments);
			isRemoveValues = true;
		}
	}

	//----- return copy of this Array w/o items containing any specified values
	if (isRemoveValues)
	{
		rtnArray = [];
		this.forEach(function(item)
		{
			if (values.constructor == RegExp)
			{
				if (typeof(item) == 'string' && values.test(item)) return;
			}
			else if (values.indexOf(item) != -1) return;

			rtnArray.push(item);
		});
	}
	//----- return Array with fromIndex, toIndex slice removed
	else
	{
		fromIndex = Math.max(0, fromIndex || 0);
		toIndex = Math.min(this.length, (toIndex || this.length-1) + 1);
		rtnArray.splice(fromIndex, toIndex-fromIndex);
	}
	return rtnArray;
}
//_____________________________________________________________________________________________
Array.prototype.remove.test = function()
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
	EZ.test.run(values, 				{EZ: {ex:values_wo_default		,ctx:values}})
	EZ.test.run(values, '',				{EZ: {ex:values_wo_blank		,ctx:values}})
	EZ.test.run(values, null,			{EZ: {ex:values_wo_null			,ctx:values}})
	EZ.test.run(values, undefined,		{EZ: {ex:values_wo_undefined	,ctx:values}})
	EZ.test.run(values, true,			{EZ: {ex:values_wo_true			,ctx:values}})
	EZ.test.run(values, false,			{EZ: {ex:values_wo_false		,ctx:values}})

	EZ.test.run(values, 'b',			{EZ: {ex:values_wo_b			,ctx:values}})
	EZ.test.run(values, 'a', 'b', 1,	{EZ: {ex:values_wo_a_b			,ctx:values}})
	EZ.test.run(values, ['a', 'b'],		{EZ: {ex:values_wo_a_b			,ctx:values}})
	EZ.test.run(values, true, false,	{EZ: {ex:values_wo_true_false	,ctx:values}})
	EZ.test.run(values, [true, false],	{EZ: {ex:values_wo_true_false	,ctx:values}})

	EZ.test.run(values, /[ab]/,			{EZ: {ex:values_wo_a_b	,ctx:values}})
	EZ.test.run(values, /(a|b)/,		{EZ: {ex:values_wo_a_b	,ctx:values}})

	var note = 'remove slice';
	var array = [0,1,2,3];

	EZ.test.run(array, -1,		{EZ: {ex:[],	ctx:array	}})
	EZ.test.run(array, 1,		{EZ: {ex:[0],	ctx:array 	}})
	EZ.test.run(array, 1, 99,	{EZ: {ex:[0], 	ctx:array	}})
	EZ.test.run(array, 2, 3,	{EZ: {ex:[0,1], ctx:array	}})
	EZ.test.run(array, 0,		{EZ: {ex:[], 	ctx:array,	}})
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
/*---------------------------------------------------------------------------------------------
Array.removeDups()

returns new Array with duplicate items removed -- original Array is unchanged.

REFERENCE:
	http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array
---------------------------------------------------------------------------------------------*/
Array.prototype.removeDups = function removeDupsEZprototypeArray()
{
	var rtnArray = [];
    for (var i=0; i<this.length; i++)
	{
        if (rtnArray.indexOf(this[i]) != -1) continue;
		rtnArray.push(this[i]);
    }
    return rtnArray;
}
//_____________________________________________________________________________________________
Array.prototype.removeDups.test = function()
{
	var objA = {a:1, b:2}
	var objX = {x:24, y:25}
	var inArray = [1,2,3,3,'a',objA,objX,objA];
	var exArray = [1,2,3,'a',objA,objX];
	EZ.test.run(inArray.slice(),				{EZ: {ex:exArray,	note:''	}})
}
/*---------------------------------------------------------------------------------------------
Return text with specified suffix (default:'s') appended if count is either number and not =1
-OR- count NaN but evaluates to true
---------------------------------------------------------------------------------------------*/
EZ.s = function EZs(text,count,suffix)
{
	text = text || '';
	suffix = suffix  || 's';
	switch (typeof count)
	{
		case 'boolean':
			return text += (count ? suffix : '');

		case 'object':
			if (count == null) return text;
			count = typeof(count.valueOf()) == 'object' ? count.valueOf() : count + '';

		case 'string':
			count = count.toInt(1);

		case 'number':
			if (isNaN(count)) return text;
			return text + (count != 1 ? suffix : '');

		case 'function':
		default:
			return text;
	}
}
//_____________________________________________________________________________________________
EZ.s.test = function()
{
	var str = '';
	EZ.test.run('match',0,'es', 		{EZ: {ex:'matches',	note:''	}})
	EZ.test.run('match','0','es', 		{EZ: {ex:'matches',	note:''	}})
	EZ.test.run('match',1,'es', 		{EZ: {ex:'match',	note:''	}})
	EZ.test.run('match','1','es', 		{EZ: {ex:'match',	note:''	}})
	EZ.test.run('match',2,'es', 		{EZ: {ex:'matches',	note:''	}})
	EZ.test.run('match','2','es', 		{EZ: {ex:'matches',	note:''	}})
	EZ.test.run('exist',false,			{EZ: {ex:'exist',	note:''	}})
	EZ.test.run('exist',NaN,			{EZ: {ex:'exist',	note:''	}})
	EZ.test.run('exist',null,			{EZ: {ex:'exist',	note:''	}})
	EZ.test.run('exist',undefined,		{EZ: {ex:'exist',	note:''	}})
	EZ.test.run('',true, 				{EZ: {ex:'s',	note:''	}})
}

/*---------------------------------------------------------------------------------------------
String.slice(start,end)
---------------------------------------------------------------------------------------------*/
String.prototype.slice = function sliceEZprototypeString(start,end)
{
	return EZ.substring(this,start,end);
}
String.prototype.slice.displayName = 'String.prototype.slice';
/*---------------------------------------------------------------------------------------------
array.sortSlice(start, end): sort part of array
sortFunc [sort function | 'nocase' | 'ignoreCase' | 'anyCase' | 'caseInsensitive']
---------------------------------------------------------------------------------------------*/
Array.prototype.sortSlice = function sortSliceEZprototypeArray(fromIndex, toIndex, sortFunc)
{
	if (this.length <= 1) return this;
	if (arguments.length == 1 && isNaN(fromIndex))
		sortFunc = [].shift.call(arguments);
	if (arguments.length == 2 && isNaN(toIndex))
		sortFunc = [].pop.call(arguments);

	fromIndex = Math.max(0, Math.min(EZ.toInt(fromIndex), this.length-1));
	toIndex = Math.max(this.length-1, Math.min(EZ.toInt(toIndex), fromIndex));
	if (fromIndex == toIndex) return this;

	sortFunc = sortFunc || '';
	while (typeof(sortFunc) != 'function')
	{
		sortFunc = sortFunc.toString().toLowerCase();
		if (!sortFunc) break;

		var nocase = /(nocase|anycase|ignorecase|insensitive|caseinsensitive)/.test(sortFunc);
		var asc = /(asc|ascending)/.test(sortFunc);
		var desc = /(dsc|desc|descending)/.test(sortFunc);
		if (nocase || asc || desc)
			sortFunc = sortProcess;
		else
			sortFunc = '';
		break;
	}

	var isSlice = (fromIndex > 0 || toIndex < this.length-1);
	var sorted = isSlice ? this.slice(fromIndex, toIndex+1) : this;
	sorted = sortFunc ? sorted.sort(sortFunc) : sorted.sort();

	if (isSlice)	//replace slice if whole array not sorted
	{
		sorted.unshift(fromIndex, toIndex-fromIndex+1);
		this.splice.apply(this, sorted);
	}
	return this;

	/**
	 * 	sort independent of case
	 */
	function sortProcess(a, b)
	{
		if (nocase)
		{
			a = a.toLowerCase()
			b = b.toLowerCase()
		}
		if (!desc)
		{
			if (a < b)
				return -1;
			if (a > b)
				return 1;
		}
		else
		{
			if (a > b)
				return -1;
			if (a < b)
				return 1;
		}
		return 0;
	}
};
/*---------------------------------------------------------------------------------------------
EZ.substring(str, start, end)

* return substring as follows without throwing exception:
* return empty string if instr undefined, null, empty string or not a string
* start adjusted to min value of 0 and max value of str length.
* end if specified adjusted  to min of start value and max of str length
---------------------------------------------------------------------------------------------*/
EZ.substring = function EZsubstring(str, start, end)
{
	if (!str || typeof(str) != 'string') return "";
	start = Math.min( Math.max(0,EZ.toInt(start)), str.length);
	end = end || str.length;
	end = Math.max( Math.min(start,EZ.toInt(end)), str.length);
	return str.substring(start,end);
}
EZ.substring.displayName = 'EZ.substring';
/*---------------------------------------------------------------------------------------------
String.endsWith(searchString[, offset])	--	ECMAScript 2015 (ES6) standard

Determine if this String ends with specified String.

ARGUMENTS:
	searchString	String containing characters to search
	offset			(optional) search within String as if String were only this long
					default: String length
RETURNS:
	true if searchString found at end or offset into String; otherwise false

REFFERENCE:
	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
---------------------------------------------------------------------------------------------*/
if (!String.prototype.endsWith)
{
	String.prototype.endsWith = function(searchString, offset)
	{
		var subjectString = this.toString();
		if (offset === undefined || offset > subjectString.length)
			offset = subjectString.length;

		offset -= searchString.length;

		var lastIndex = subjectString.indexOf(searchString, offset);
		return lastIndex !== -1 && lastIndex === offset;
	}
}
/*--------------------------------------------------------------------------------------------------
String.includes(searchString[, offset])                          ECMAScript 2015 (ES6) standard
String.contains(searchString[, offset])                          EZ-lib: alternative name
String.includesIgnoreCase(searchString[, offset])                EZ-coder: extension

Determine if this String includes specified String -- search is case sensitive.

ARGUMENTS:
	searchString	String containing characters to search
	offset			(optional) offset in String to begin search for searchString (defaults 0)

RETURNS:
	true if searchString found in String at offset; otherwise false

REFFERENCE:
	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
--------------------------------------------------------------------------------------------------*/
if (!String.prototype.includes)
{
	String.prototype.includes = function includesEZprototypeString(searchString, offset)
	{
		return String.prototype.indexOf.apply(this, arguments) != -1;
	}
}
String.prototype.contains = function containsEZprototypeString() /* alternative name */
{
	return String.prototype.indexOf.apply(this, arguments) != -1;
}
String.prototype.includesIgnoreCase = function includesIgnoreCaseEZprototypeString(searchString, offset)
{
	searchString = (searchString != undefined ? searchString + '' : '').toLowerCase();
	return this.toLowerCase().indexOf(searchString, offset) != -1;
}
/*--------------------------------------------------------------------------------------------------
String.startsWith(searchString[, offset])	--	ECMAScript 2015 (ES6) standard

Determine if this String starts with specified String -- search is case sensitive.

ARGUMENTS:
	searchString	String containing characters to search at the start of this String
	offset			(optional) offset in String to begin search for searchString (defaults 0)

RETURNS:
	true if searchString found at start or offset into String; otherwise false

REFFERENCE:
	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
--------------------------------------------------------------------------------------------------*/
if (!String.prototype.startsWith)
{
	String.prototype.startsWith = function(searchString, offset)
	{
		offset = offset || 0;
		return this.indexOf(searchString, offset) === offset;
	}
}
/*--------------------------------------------------------------------------------------------------
String.enclosedWith([startString [,endString]])                           //EZ-coder: extension

Determine if this String starts and/or ends with specified String(s).
Checks for String enclosed with double quotes (") if no arguments supplied.

ARGUMENTS:
	startString	(optional) specifies starting character(s) -- default is double quote: "
				can be String or RegExp allowed -- same as endsWith(endString) if blank

	endString	(optional) specifies ending character(s) -- default is same as startString
				can be String or RegExp allowed -- same as startsWith(startString) if blank
RETURNS:
	true 	if String starts startString (or any char if startString is blank)
			-AND- String ends with endString (or any char if endString is blank)
	false	otherwise

TODO:
	Allow regex for startString and endString
--------------------------------------------------------------------------------------------------*/
String.prototype.enclosedWith = function enclosedWithEZprototypeString(startString, endString)          //EZ-coder: extension
{
	startString = (startString != undefined ? startString + '' : '"');
	endString = (endString != undefined ? endString + '' : startString);

	return this.startsWith(startString) && this.startsWith(startString);
}
/*--------------------------------------------------------------------------------------------------
String.trim()

removes any leading or ending whitespace

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
--------------------------------------------------------------------------------------------------*/
if (!String.prototype.trim)
{
	String.prototype.trim = function trimEZprototypeString()
	{
		return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	};
}
/*--------------------------------------------------------------------------------------------------
String.trimLeft()

removes any leading whitespace
--------------------------------------------------------------------------------------------------*/
if (!String.prototype.trimLeft)
{
	String.prototype.trimLeft = function trimLeftEZprototypeString()
	{
		return this.replace(/^[\s\uFEFF\xA0]+/g, '');
	};
}
/*--------------------------------------------------------------------------------------------------
String.trimRight()

removes any ending whitespace
--------------------------------------------------------------------------------------------------*/
if (!String.prototype.trimRight)
{
	String.prototype.trimRight = function trimRightEZprototypeString()
	{
		return this.replace(/[\s\uFEFF\xA0]+$/g, '');
	};
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
TODO: DW & EASY different code
String.trimPlus([chars [, flags]])

Remove any of specified char or regular expression(s) from start and end of String.
If no arguments are supplied, removes leading & trailing whitespace.

ARGUMENTS:
	chars	character(S) or regex to trim -- default: whitespace (i.e. \s)
			if not supplied, undefined, null, empty string.

	flags	(optional) String containg one or more of the following:

			"i" ignoreCase of specified chars -- can also be specified as regex flag
			"m" multiline -- trim all lines in String -- newlines preserved
				can also be specified as regex flag
			"^" left trim only
			"$" right trim only

TODO:
	s1, s2...	one or more arguments or arrays containing strings or regular expresssions.

RETURNS:
	String with all specified characters or character trimmed.
--------------------------------------------------------------------------------------------------*/
String.prototype.trimPlus = function trimPlusEZprototypeString(chars, flags)
{
	flags = flags || '';

	var multiline = /m/i.test(flags);
	var ignoreCase = /i/i.test(flags);
	var isTrimLeft = !/\$/i.test(flags);
	var isTrimRight = !/\^/i.test(flags);

	var str = this + '';
	try
	{											//undefined, null, empty string
		if (chars == undefined || chars === '')
			chars = '\\s';

		else if (chars.constructor != RegExp)	//String -- escape special char
		{
			chars = '[' + chars.replace(/([\].*?+()|^$]+)/g, '\\$1') + ']';
		}
		else									//RegExp . . .
		{
			multiline = multiline || chars.multiline;
			flags = ignoreCase || chars.ignoreCase ? 'i' : '';
			chars = chars.source;				//extract pattern
		}
		flags = flags.replace(/[^i]/g, '');		//only keep "i" flag

		str = trimPlusProcess(str);				//trim full string
		if (multiline)
		{										//trim each line if multiline
			var lines = str.split('\n');
			for (var i=0; i<lines.length; i++)
				lines[i] = trimPlusProcess(lines[i]);;
			str = lines.join('\n');
		}
	}
	catch (e)
	{
		EZ.techSupport(e);
	}
	//======================
	return str;
	//======================
	//________________________________________________________________________________________
	/**
	 *
	 */
	function trimPlusProcess(str)
	{
		if (isTrimLeft)
			str = str.replace(RegExp('^' + chars + '+', flags), '');
		if (isTrimRight)
			str = str.replace(RegExp('' + chars + '+$', flags), '');
		return str;

		if (isTrimLeft)
			str = str.replace(Regex('^(' + chars + ')([\s\S]*)', flags), '$2');
		if (isTrimRight)
			str = str.replace(Regex('([\s\S]*?)(' + chars + ')$', flags), '$1');
	}
}
//_____________________________________________________________________________________________
String.prototype.trimPlus.test = function()
{
	var str = ' \n "A \nb c"; \n';

	EZ.test.run(' x y z ',					{EZ: {ex:'x y z'			,note:'no args'		}})
	EZ.test.run(str, 						{EZ: {ex:'"A \nb c";'		,note:'no args'		}})
	EZ.test.run(str, '',					{EZ: {ex:'"A \nb c";'		,note:'blank'		}})
	EZ.test.run(str, '', '^',				{EZ: {ex:'"A \nb c"; \n'	,note:'left Trim'	}})
	EZ.test.run(str, '', '$',				{EZ: {ex:' \n "A \nb c";'	,note:'Right Trim'	}})
	EZ.test.run(str, /[;\s"]/, 				{EZ: {ex:'A \nb c'			,note:''			}})
	EZ.test.run(str, /[;\s"]/i,				{EZ: {ex:'A \nb c'			,note:''			}})
	EZ.test.run(str, /[;\s"]/i,				{EZ: {ex:'A \nb c'			,note:''			}})
	EZ.test.run(str, ';\\s"', 'i',			{EZ: {ex:'A \nb c'			,note:''			}})
	EZ.test.run(str, /[\s"ac;]/i,  			{EZ: {ex:'b'				,note:''			}})
	EZ.test.run('xyz', /(x|z)/m,  			{EZ: {ex:'y'				,note:''			}})
	EZ.test.run(str, /[\s";]/m,  			{EZ: {ex:'A\nb c'			,note:'multiline'	}})
}
/*------------------------------------------------------------------------------------------------
returns fully qualified absolute url using String as relative url
backslashes "\" converted to slashes "/" then duplicate slashes removed.

If String starts with slash or path specified, url is absolute to current page domain/host
else if path is specified and path contained in current page url, returned url
includes current page url up thru specified path otherwise url relative to current page url;

EXAMPLES:
	for current page url: 	http://localhost:8080/revize/demo/departments/my.html
	"/my.html".toAbsoluteUrl() --> "http://localhost:8080/my.html"
	"my.html".toAbsoluteUrl('demo')  --> "http://localhost:8080/revize/demo/departments/my.html"

	"/my.html".toAbsoluteUrl() --> "http://localhost:8080/my.html"
	"my.html".toAbsoluteUrl('demo')  --> "http://localhost:8080/revize/demo/departments/my.html"
--------------------------------------------------------------------------------------------------*/
String.prototype.toAbsoluteUrl = function toAbsoluteUrlEZprototypeString(path)
{
	var url = this;
	if (path)								//prepend and append slash to path then...
	{										//...remove dup slashes and convert "\" --> "/"
		path = ('/' + path + '/').replace(/[\/\\]+/, "/");
											//up thru last slash
		var pagePath = location.pathname.replace(/(.*\/).*/, '$1');
		if (pagePath.contains(path))		//if path in pagePage prepend to url
			url = pagePath.replace( RegExp('(.*'+path+').*'), '$1') + url;
		else
			url = '/' + url;				//if not, make url absolute to page host/domain
	}
	url = url.replace(/[\/\\]+/, "/");		//remove dup slashes and convert "\" --> "/"

	var a = document.createElement('a');
	a.href = url;							//create fully qualified url
	return a.href;
}
//__________________________________________________________________________________________________
String.prototype.toAbsoluteUrl.test = function()
{
	var url = 'my.html';
	var baseAbs = location.protocol + '//' + location.host;
	var baseRel = baseAbs + location.pathname;
	baseRel = baseRel.replace(/(.*\/).*/, '$1');	//keep up thru last /

	EZ.test.run('my.html',				{EZ: {ex:baseRel+'my.html',			note:''	}})
	EZ.test.run('my.html',				{EZ: {ex:baseRel+'my.html',			note:''	}})
	EZ.test.run('/my.html',				{EZ: {ex:baseAbs+'/my.html',		note:''	}})
	EZ.test.run('//my.html',			{EZ: {ex:baseAbs+'/my.html',		note:''	}})
	EZ.test.run('path\\my.html',		{EZ: {ex:baseRel+'path/my.html',	note:''	}})
	EZ.test.run('path//\\my.html',		{EZ: {ex:baseRel+'path/my.html',	note:''	}})

	EZ.test.run('my.html','revize',		{EZ: {ex:baseAbs+'/revize/my.html'	}})
	EZ.test.run('my.html','Commands',	{EZ: {ex:baseAbs+'/revize/dw.Configuration/Commands/my.html'}})
	EZ.test.run('my.html','dw.Configuration/Commands',
										{EZ: {ex:baseAbs+'/revize/dw.Configuration/Commands/my.html'}})
	EZ.test.run('my.html','not',		{EZ: {ex:baseAbs+'/my.html',
				note:'path not in location - use current page domain only'	}})
}
/*--------------------------------------------------------------------------------------------------
EZ.toArray(arg, delimiter)
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
EZ.toArray.test = function(opts)
{
	divsClone = EZ.cloneNodes(t_divs,false);
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
	if (defaultValue == undefined || isNaN(defaultValue)) defaultValue = 0;
	if (number === null) number = defaultValue;
	if (number != undefined)
	{
		try
		{
			if (isNaN(number))
			{	//pattern taken from EZ.parse.java for consistancy -- more complex than needed
				var pattern = new RegExp("^\\s*(0*(\\d+))(\\.?(0*)(\\d*))(.*)","")
				number = number.replace(pattern,'$2$3');
			}
			value = parseFloat(number);
		}
		catch (e) {}
	}
	if (isNaN(value)) value = defaultValue;
	return value;
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
EZ.toInt = function EZtoInt(number, defaultValue)
{
	return parseInt( EZ.toFloat(number, defaultValue) + 0.5 );
}
EZ.integer = EZ.toInt;
/*---------------------------------------------------------------------------------------------
this function converts number to the nearest integer

defaultValue (optional) value to use if string is not a number
---------------------------------------------------------------------------------------------*/
Number.prototype.toInt = function toIntEZprototypeNumber()
{
	return parseInt(this+.5);
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
String.prototype.toInt = function toIntEZprototypeString(defaultValue)
{
	if (typeof defaultValue == 'undefined') defaultValue = 0;
	var value = parseInt(this);
	if (isNaN(value))
		value = defaultValue;
	else
		value = parseInt(value+.5);
	return value;		//will convert object type to number
}
/*---------------------------------------------------------------------------------------------
String.toSentenceCase()
---------------------------------------------------------------------------------------------*/
String.prototype.toSentenceCase = function toSentenceCaseEZprototypeString()
{
	return this.replace(/(\s*)([^.]+)/g, function(p0,p1,p2)
{
		return p1 + p2.charAt(0).toUpperCase() + p2.substr(1).toLowerCase();
	})
}
String.prototype.toSentenceCase.displayName = 'String.prototype.toSentenceCase';

String.prototype.toSentenceCase.test = function()
{
	var words = 'the quick bwown brown fox';
	var ex = 'The quick bwown brown fox';
	EZ.test.run(words,  {EZ: {ex:ex }})
}
/*---------------------------------------------------------------------------------------------
String.toTitleCase()

TODO:
	option to include short prepositions, 'or', 'and'

REFERENCE:
	http://brandintellect.in/convert-string-title-case-javascript/
	https://www.englishclub.com/grammar/prepositions-list.htm
---------------------------------------------------------------------------------------------*/
String.prototype.toTitleCase = function toTitleCaseEZprototypeString(options)
{
	var exclude = 'as at by in of on to up to and or'.split(' ');
	return this.replace(/[\w\(\)]+/g, function(word)
	{
		if (exclude.indexOf(word) != -1)
			return word;
		return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
	});
}
String.prototype.toTitleCase.displayName = 'String.prototype.toTitleCase';

String.prototype.toTitleCase.test = function()
{
	var str = 'the quick brown fox';
	var rtn = 'The Quick Brown Fox';
	EZ.test.run(str,  {EZ: {ex:rtn }})
}
/*---------------------------------------------------------------------------------------------
return true if trueLike else false
---------------------------------------------------------------------------------------------*/
String.prototype.isTrueLike = function isTrueLikeEZprototypeString()
{
	var str = this + '';
	if (str === 'true' || str === 'on' || str === 'yes') return true;
	return false;
}
/*---------------------------------------------------------------------------------------------
return true if falseLike else false
---------------------------------------------------------------------------------------------*/
String.prototype.isFalse = function isFalseEZprototypeString()
{
		return this.isTrueLike();
}
/*---------------------------------------------------------------------------------------------
return true if trueLike; false if falseLike otherwise value -- '0' returned as '0'
---------------------------------------------------------------------------------------------*/
String.prototype.isTrueFalseValue = function isTrueFalseValueEZprototypeString()
{
	if (this.isTrueLike()) return true;
	if (this.isFalseLike()) return false;
	return this.toString();
}/*---------------------------------------------------------------------------------------------
return true if trueLike else false
---------------------------------------------------------------------------------------------*/
Boolean.prototype.isTrue = function isTrueEZprototypeBoolean()
{
	return true == this;
}
Boolean.prototype.isTrueLike = Boolean.prototype.isTrue;
Boolean.prototype.isTrueFalseValue = Boolean.prototype.isTrue;
/*---------------------------------------------------------------------------------------------
return true if trueLike else false
---------------------------------------------------------------------------------------------*/
Number.prototype.isTrue = function isTrueEZprototypeNumber()
{
	return true == this;
}
Number.prototype.isTrueLike = Number.prototype.isTrue;
/*---------------------------------------------------------------------------------------------
return true if falseLike else false
---------------------------------------------------------------------------------------------*/
Number.prototype.isFalse = function isFalseEZprototypeNumber()
{
	return false == this;	// == 0 || isNaN(this);
}
Number.prototype.isNone = Number.prototype.isFalse;
/*---------------------------------------------------------------------------------------------
return true if trueLike; false if falseLike otherwise number
---------------------------------------------------------------------------------------------*/
Number.prototype.isTrueFalseValue = function isTrueFalseValueEZprototypeNumber()
{
	if (this.isTrueLike()) return true;
	if (this.isFalseLike()) return false;
	return this.toString();
}
/*---------------------------------------------------------------------------------------------
return true if falseLike else false
---------------------------------------------------------------------------------------------*/
Boolean.prototype.isFalse = function isFalseEZprototypeBoolean()
{
	return false == this;
}
Boolean.prototype.isFalseLike = Boolean.prototype.isFalse;
/*--------------------------------------------------------------------------------------------------
return true if falseLike else false
--------------------------------------------------------------------------------------------------*/
String.prototype.isFalseLike = function isFalseLikeEZprototypeString()
{
	var str = this + '';
	if (str === 'false' || str === 'off' || str === 'no' || str === '') return true;
	return false;
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
--------------------------------------------------------------------------------------------------*/
String.prototype.wrap = function wrapEZprototypeString(wrapLeft, wrapRight)
{
	wrapLeft = wrapLeft != undefined ? wrapLeft : String.fromCharCode(8226);
	wrapRight = wrapRight != undefined ? wrapRight+'' : wrapLeft;
	return wrapLeft + this + wrapRight;
}
/*--------------------------------------------------------------------------------------------------
Clone stubs potentailly overridden and define unit tests.
--------------------------------------------------------------------------------------------------*/
EZ.getEl_basic = EZ.clone(EZ.getEl);
// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
EZ.getEl_basic.test = function()
{
	EZ.test.run(arg0, 							{EZ: {ex:'',	note:''	}})
}
/*--------------------------------------------------------------------------------------------------
global constants
--------------------------------------------------------------------------------------------------*/
EZ.EOL = String.fromCharCode(172);	//used to show end of non-object value
EZ.DASH = '&#8209;';		//non-breaking dash
EZ.DOT = String.fromCharCode(8226);	//base marker -- used to create compound marker
EZ.DOTS = ('&nbsp;.').dup(3);
EZ.MORE = (EZ.DOT + '&nbsp;').dup(3);
EZ.LINE = '&#8212;'
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
if (!window.dw) dw = {isNotDW: true};
EZ.MSIE = navigator.appVersion.contains('MSIE');
EZ.isIEw3c = !EZ.MSIE && navigator.userAgent.contains('Trident') && !navigator.appCodeName.contains('Mozilla');
EZ.isEdge = navigator.userAgent.contains('Edge');
EZ.isChrome =  navigator.appVersion.contains('Chrome');
EZ.isnavigator = !EZ.MSIE;
/**
 *
 */
EZ.bindings = {						//TODO: use to replace hardcoding in EZgetEl.bindElements()
//	basic: [ez, ez$, ez_],
	other: {EZcss:EZ.css, EZget:EZ.get, EZset:EZ.set, EZval:EZ.val}
};
EZ.global = {
	legacy: {
		na:undefined, n:null,	//test data??
		EZmatchPlus: true,
		EZisEmpty: false,
		EZbindElements: true,
		EZgetEl:false, EZgetEl_notFoundnull:true,
		EZgetStyle:false, EZhasClass:false
	},
	messages: {		//EZ.init() copies to EZ.messages
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

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	testdata:
	{
		array: [1,2],
		arraySparse: ['a', 'b',,null,5],
		fruit: {apple: 'APPLE', lemon: 'LEMON'},
		girls: ['Jane', 'Brenda', 'Dyan'],
		guys: ['Otis', 'Ghost'],
		multiline: [1, 'a',
			'John Tyler III, President\n' +
			'Keys Adventures, Inc\n' +
			'123 Palms, Suite Q\n' +
			'Key Largo, FL 80209', 'x', 'y', 'z' ],
		regex: /\s*(a|b|c)/gim,
		person: {
			name: "Jim Cowart",
			location: {
				city: {
					name: "Chattanooga",
					population: 167674
				},
				state: {
					name: "Tennessee",
					abbreviation: "TN",
					population: 6403000
				}
			},
			company: "appendTo",
		},
		personArrayLike: {
			'null': null,
			name: "Jim Cowart",
			location: {
				city: {
					name: "Chattanooga",
					population: 167674
				}
			}
		},
		fuse: {
			shouldSort: true,
			distance: 55,
			threshold: 0.4,
			truncateSearchText: "true",
			include: [
				"score",
				"offsets"
			],
			maxResults: 0,
			keys: ["title", "author.firstName"],
			sortKeys: ["author.firstName","title"],
			id: "title, author.firstName"
		}
	}
}
//EZ.global.testdata.array['5'] = 'five'
EZ.global.testdata.arraySparsePlus = EZ.global.testdata.arraySparse.slice();
EZ.global.testdata.arraySparsePlus.push(EZ.global.testdata.guys)
EZ.global.testdata.arraySparsePlus.push(EZ.global.testdata.fruit)
EZ.global.testdata.arraySparsePlus.push(EZ.global.testdata.girls)

EZ.global.testdata.personArrayLike[0] = 'a'
EZ.global.testdata.personArrayLike[1] = 'b'
EZ.global.testdata.personArrayLike.length = 2;

EZ.global.testdata.fuse.include.score = true
EZ.global.testdata.fuse.include.scoredKey = true
EZ.global.testdata.include = EZ.global.testdata.fuse.include;

EZ.global.testdata.objectLike = EZ.global.testdata.array.slice();
EZ.global.testdata.objectLike.person = EZ.global.testdata.person;

EZ.global.testdata.objectLikeMore = EZ.global.testdata.array.slice();
EZ.global.testdata.objectLikeMore.person = EZ.global.testdata.person;
EZ.global.testdata.objectLikeMore.push(EZ.global.testdata.include)

EZ.testSample.testdata = EZ.global.testdata;
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
	'':''
}
EZ.patterns.funcParts = EZ.patterns.fn;
EZ.patterns.types = /(nan|null|undefined|boolean|number|string|function|object)/;

//----- PATTERNS -- from DW EZ code base
EZ.patterns.offsetPairssDisplay = /(.+?,.+?,)\s?/g	//from EZgetSelection()
//	html = html.replace(/(\r\n|\n|\r)/g, EZ.constant.EOL) //EZdomWorkbench.htm::process()
EZ.patterns.configPath = /.*?\/en_US\/Configuration.*?(\/|$)/im;
//                                 1         2           3
EZ.patterns.funcParts = /function\s*(\w*)\s*\((.*?)\)[^{]*{([\s\S]*)}/
EZ.patterns.funcParts = /function\s*(\w*)\s*\((.*?)\)[^{]*{\s*([\s\S]*)}/;	//from EZ.clone
//TODO: accomodate embedded comments: function (/** Event */evt...)

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
Create displayName for all EZ functions, map to non-oops name and define element bindings.
---------------------------------------------------------------------------------------------*/
EZ.global.setup = function EZglobal_setup(prefix, filename)
{
	EZglobal_createDisplayNames(prefix);
	EZglobal_mapFunctions(prefix+'.', prefix);
	EZ.global.scripts[filename] = new Date();		//note script loaded
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
					if (window[name] == undefined)
						window[name] = oopsFrom[fn];
				}
				else if (oopsTo[oopsName] == undefined)
				{
					oopsTo[fn] = oopsFrom[fn];
					oopsTo[fn].displayName = fromPrefix + '.' + fn;
				}
			}
		}
		//TODO: !oopsFrom ??
	}
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
EZ.global.setup('EZ', 'prototypes');
