/*global EZ, g, dw, DWfile */
var e;
(function jshint_globals_not_used() {	//list global variables and/or functions defined but not used
	e = [e, g, dw, DWfile]
})

EZ.prototypeFunctions = EZ.prototypeFunctions || {"String":[], "Number":[], "Boolean":[]};
/*--------------------------------------------------------------------------------------------------
EZ.createPrototype(fn)

Create non-enumerable prototype function using Object.defineProperty if available or __proto__ for
dw enviornment, otherwise create with prototype keyword if EZ.isPrototypeFunctionAllowed !== false.

ARGUMENTS:
	obj		specifies Object (e.g. Array or Object)
	fn		specifies named function -- cannot be anouymous

REFFERENCE:
	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
	https://github.com/es-shims/es5-shim

TODO:
	if (!dw.isNotDW)
	else if isPrototypeAllowed return false
//	var fnName = name + 'EZprototype' + Object.prototype.toString.call(obj).substr(8);
//	var fnName = obj.prototype[name] = name + 'EZprototype'
//			   + Object.prototype.toString.call(obj).substr(8)
--------------------------------------------------------------------------------------------------*/
EZ.createPrototype = function EZcreatePrototype(fn)
{
	if (typeof(fn) != 'function' || !fn.name) return false;
	try
	{
		var results = fn.name.match(/(.*)EZprototype(.*)/i);
		if (!results) return false;

		var name = results[1];
		var objName = results[2];
		var obj = eval(objName);
		if (obj.prototype[name]) return true;
		
		if (EZ.prototypeFunctions[objName])
			EZ.prototypeFunctions[objName].push(name)

		if (Object.defineProperty)
			Object.defineProperty(obj.prototype, name, {value: fn})

		/*TODO:
		else if (!dw.isNotDW) 	//use __proto__ if dw supports for non-enumerable prototype
		{
		}
		else if (EZ.isPrototypeFunctionAllowed !== false)
			return false
		*/
		else
			obj.prototype[name] = fn;

		return true;
	}
	catch (e)
	{
		return EZ.techSupport(e);
	}
}

/*		 _______________________________________________________________________________
		|                                                                                |
		|Remainder of file contains prototpes and related varients in alphabetical order |
		|________________________________________________________________________________|
*/
/*---------------------------------------------------------------------------------------------
Add ordinal suffix to any number: e.g. 1st, 2nd, 3rd, 4th ...

http://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
---------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function suffixEZprototypeNumber()
{
    var n=this.toString().split('.')[0];
    var lastDigits=n.substring(n.length-2);
    
    if (lastDigits==='11' || lastDigits==='12' || lastDigits==='13')
        return this+'th';				//add exception just for 11, 12 and 13
   
    switch (n.substring(n.length-1))
	{
        case '1': return this+'st';
        case '2': return this+'nd';
        case '3': return this+'rd';
        default : return this+'th';
    }
}))
//_______________________________________________________________________________
Number.prototype.suffix.test = function()
{
	var number = 1234;
	EZ.test.run(number,			{EZ: {ex:'1234th'}})
}
/*---------------------------------------------------------------------------------------------
Clip end of string by specified number of char (default: 1)
---------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function clipEZprototypeString(nochar)
{
	if (nochar == null) nochar = 1;
	if (!nochar)
		return this + '';
	else if (nochar >= this.length)
		return '';
	else if (nochar < 0)
		return this.substr(-nochar);
	else
		return this.substr(0,this.length-nochar);
}))
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
Number.pad(size, ch)
String.pad(size, ch)

pads AND truncates Number or String to specified size.  If no argument is specified or size is zero,
return String without padding or truncating.

ARGUMENTS:
	size		(Number) specifies padding size -- >0 for right padding <0 for left padding
				(String), specifies character(s) used for padding -- size is length of size String.
						  right padding if numeric e.g. "0..." -- otherwise left padding
				
	ch			(optional) specifies padding character(s) when size is Number.
				default is blank character for String or Number when size is > 0
				default is "0" for Number when size < 0 
				
EXAMPLES:
	'1'.pad('00') 	returns: "01"
	1.pad('00')
	'1'.pad(-2)
	1.pad(-2)
	1.pad(2)			returns: " 1"
	1.pad('...')		"..1"
	
	"abc".pad(5)		returns: "abc  "
	"abc".pad(-5)		returns: "  abc"
	"abc".pad('..')		returns: "ab"
	"abc".pad(-2,'.')	returns: "bc"
	"abc".pad('...')	returns: "abc"
	"abc".pad('....')	returns: "abc."
	"abc".pad(-5,'.')	returns: "..abc"

RETURNS:
	padded / truncated String
--------------------------------------------------------------------------------------------------*/
String.prototype.pad = function pad_EZ_String(size, ch)
{
	if (size == null)
		return this + '';

	switch (typeof size)
	{
		case 'number':
		{
			ch = (ch !== undefined) ? ch + ''
			   : (size < 0 && this instanceof Number) ? '0'
			   : ' ';
			break;
		}
		case 'string':
		{
			ch = size + '';
			size = ch.length;

			//if (!isNaN(Number(ch)) && typeof(this) == 'number')
			//if (!isNaN(Number(ch)) && !isNaN(Number(this)))
			if (!isNaN(Number(this)))
				size = -size;
			break;
		}
		default:
		{
			return this;
		}
	}
	if (size < 0)
		return String(ch.dup(-size) + this).slice(size);

	else if (size > 0)
		return String(this + ch.dup(size)).slice(0, size);	
	
	else
		return this + '';
}
//________________________________________________________________________________________
/**
 *	
 */
String.prototype.pad.test = function()
{	
	var msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, , rtnValue];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	exfn = function(results, expected, testrun)
	{
		void( [results, expected, testrun] )	//jshint
		testrun.exfnDone = true;				//don't call as legacy

		//if (typeof(testrun.argsClone[0]) == 'number')
		if (results != null)
			testrun.argsClone[0] = 'length: ' + results.length;
		
		//else if (typeof(testrun.argsClone[1] == 'number'))
		//	testrun.argsClone[1] = (results.length)
	}
	
	//_______________________________________________________________________________________
	EZ.test.settings( {exfn:exfn} )
	
	ctx = 'abcdefg'
	EZ.test.run('abc', 10)
	EZ.test.run('xyz', -10)

	EZ.test.run('abc', 5, '0')
	EZ.test.run('abc', -5, '0')
	
	EZ.test.run('1', '000')
	EZ.test.run('1', '...')
	
	EZ.test.run('1', 2, '0')
	EZ.test.run('12', 2, '0')
	EZ.test.run('123', 2, '0')

	EZ.test.run('1', -2, '0')
	EZ.test.run('12', -2, '0')
	EZ.test.run('123', -2, '0')
	EZ.test.run('123', 2, '0')

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	EZ.test.run(1, 2)
	EZ.test.run(1, -2)
	
	EZ.test.run(12, 2)
	EZ.test.run(12, 3)
	EZ.test.run(12, 0)
	EZ.test.run(12, '0')
	EZ.test.run(12, '00')
	EZ.test.run(12, '000')
	EZ.test.run(123, '000')
	EZ.test.run(1234, '000')
	
	EZ.test.run(1, '00')
	EZ.test.run(1, '...')
	EZ.test.run(1, 3, '...')
	EZ.test.run(1, -3, '...')

	if (true) return;
}
/*--------------------------------------------------------------------------------------------------
truncate String if more than specified size
--------------------------------------------------------------------------------------------------*/
String.prototype.truncate = function truncate_EZ_String(size, more)
{
	var str = this.toString();
	size = EZ.toInt(size);
	more = (more === '' || more) ? more : EZ.MORE;
	
	if (size && str.length > size)
		str = str.substr(0,size).trim() + more;
	return str;
}
/*---------------------------------------------------------------------------------------------
EZ.merge([options,] obj, object(s)...)

Merge all properties from each in newObj into 1st object replacing existing properties and
appending new ones. if 1st Object is undefined or null, clone as next non-null, non-empty
Object that follows or new Object if none follow.

When any property is an object type, it is cloned upto the maxdepth option described below.

ARGUMENTS:

	this		Object merged with properties from all the folowing objects
				use empty object to merge all objects into new object

	options		(optional)	1st argument if Object containing mergeOptions property which is Object
				containing any of the following options:

				maxdepth	Object properties at this level are not cloned (top level is 0)
							they are copied as a reference to the original (default: 9)

				exclude		Array or comma delimited String containing Property names excluded.

	objects		all arguments following options specify one or more objects to merge

RETURNS:
	new Object containing Object with merged properties from all other specified Objects.

//if (!fromObj || fromObj == null || typeof(fromObj) != 'object') return;
--------------------------------------------------------------------------------------------------*/
EZ.mergeObj = function EZmergeObj(options, obj)
{
	obj = obj;		//jshint: document var -- code uses arguments
	var newObj;
	var args = [].slice.call(arguments);

	//----- options is 1st arg if object with mergeOptions property
	options = '.mergeOptions'.ov(options) ? (args.shift().mergeOptions).clone() : {};
	var mergeOptions = {
		depth: 0,
		maxdepth: 	'.maxdepth'.ov(options,	9),
		append: 	EZ.toArray('.append'.ov(options, [])),
		exclude: 	EZ.toArray('.exclude'.ov(options, []))
	}
	if (mergeOptions.append.indexOf('*all') != -1)
		mergeOptions.append = '*all';

	// Create new Object using constructor of 1st Object
	while (true)
	{
		if (!args.length) return {};
		newObj = args.shift();
		if (!(newObj instanceof Object)) continue;

		newObj = newObj.clone(options);
		break;
	}

	// remaining args are objects merged into newObj
	args.forEach(function EZmergeObjects(fromObj)
	{
		Object.keys(fromObj).forEach(function(p)
		{
			if (mergeOptions.exclude.indexOf(p) != -1) return;

			if (p in newObj
			&& (mergeOptions.append == '*all' || mergeOptions.append.indexOf(p) != -1))
				return;

			if (fromObj[p] instanceof Object)
			{
				newObj[p] = fromObj[p].clone(mergeOptions.maxdepth);
				if (EZ.isArray(fromObj[p]) && newObj[p].length == EZ.undefined)
					newObj[p].length = fromObj[p].length;
			}
			else
				newObj[p] = fromObj[p];
		});
		if (EZ.isArray(fromObj) && newObj.length == EZ.undefined)
		{
			newObj.length = fromObj.length;
		}
	});
	return newObj;
}
/*--------------------------------------------------------------------------------------------------

// . . . . . . . .  . . . . . . . . . . . . . . .  . . . . . . . . . . . . . . . .

if (EZ.createPrototype(function mergeEZprototypeObject(options)
{
	var args = [].slice.call(arguments);
	var idx = (options instanceof Object && options.mergeOptions != EZ.undefined) ? 1 : 0;
	args.splice(idx,0,this);
	return EZ.mergeObj.apply(EZ.mergeObj, args);
}))
// . . . . . . . .  . . . . . . . . . . . . . . .  . . . . . . . . . . . . . . . .
Object.prototype.merge.test = function()
{
	var ex, ctx, note, obj;

	// #1
	var objectLike = [1,2]
	objectLike.x = 24
	objectLike.y = 25

	obj = {a:1, b:2}
	ex = {
	   0: 1, 1: 2, length: 2,
	    a: 1, b: 2,
	    x: 24, y: 25
	};
	EZ.test.run(obj,objectLike,	 				{EZ:{ex:ex, ctx:obj, note:note}})

	EZ.test.run(obj,{mergeOptions:{exclude:'x'}},objectLike,
												{EZ:{ex:ex, ctx:obj, note:note}})

	var fn = function(arg) {return arg};
	fn.z = 66;
	EZ.test.run(fn, obj,objectLike,	 				{EZ:{ex:ex, ctx:fn, note:note}})

	//____________________________________________________________________________

	// #2
	obj = {array: objectLike}
	ex = obj
	EZ.test.run(obj,	 						{EZ:{ex:ex, ctx:ctx, note:note}})
	//____________________________________________________________________________

	obj = {a:1, b:2};
	ex = {b:2, a:11, c:22}
	EZ.test.run(obj, {a:11, c:22},	 			{EZ:{ex:ex, ctx:ctx, note:note}})
	//______________________________________________________________________________
return;

	var div = document.createElement('div');
	var span = document.createElement('span');
	var divObj = {d:div}
	var spanObj = {d:span}
	EZ.test.run({},divObj,spanObj, 		{EZ: {ex:{d:div, s:span},	note:''	}})

	EZ.test.results.push( EZ.merge() );
	EZ.test.results.push( EZ.merge({}) );
	EZ.test.results.push( EZ.merge({}, {a:11, b:22, c:33}) );
	EZ.test.showResults();
}
--------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------------------------------------------------------
TODO: mayby use toArray()
--------------------------------------------------------------------------------------------------*/
String.prototype.collapse = function collapseEZprototypeString()
{
	return this.toString();
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function collapseEZprototypeArray(str)
{
	var o;
	if (!length)  return '';
	if (str) return o.join(str+'');
	return o[0];
}))
//_______________________________________________________________________________
Array.prototype.collapse.test = function()
{
}

/*--------------------------------------------------------------------------------------------------
Object.compare()

Not refactored as prototype
Never tested -- Used EZ.stringify()
--------------------------------------------------------------------------------------------------*/
/*
if (EZ.createPrototype(function compareEZprototypeObject(obj, dotName, options)
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
}))
//_____________________________________________________________________________________________
Object.prototype.compare.test = function()
{
	var a = [1,2,3];

	EZ.test.run(arg0, 							{EZ: {ex:'',	note:''	}})
}
*/
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
	var str = this.toString();
	char = (typeof(char) == 'number') ? String.fromCharCode(char) : char;
	start = (!isNaN(start) && start > 0) ? start : 0;
	end = (!isNaN(end) && end > 0) ? end : str.length;

	try
	{
		var regex = new RegExp('\\' + char, 'g')
		var results = str.substr(start,end).match(regex);
		return results ? results.length 
					   : str.length ? 1 : 0;
	}
	catch (e)
	{
		EZ.oops(e);
		return 0;
	}
}
/*--------------------------------------------------------------------------------------------------
String.dup(times[,maxlength])

return string duplicated specified number of times.
optional maxlength argument specified maximun length of returned string.
--------------------------------------------------------------------------------------------------*/
String.prototype.dup = function dupEZprototypeString(times,maxlength)
{
	times = parseInt(times) || 80;
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
	if (str == null || str === undefined)
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
	if (str == null || str === undefined)
		return false;
	else
		return this.toLowerCase() === str.toLowerCase();
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
/* jshint ignore:start*/
if (EZ.createPrototype(function fillEZprototypeArray(value, start, end)
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
	var relativeEnd = end == EZ.undefined
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
}))
/* jshint ignore:end */
//_______________________________________________________________________________
Array.prototype.fill.test = function()
{
	EZ.test.run();
	EZ.test.run(new Array(2), 1);
}
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
if (EZ.createPrototype(function findEZprototypeArray(callback, thisObj)
{
	thisObj = thisObj || this;			//TODO: leave as undefined ??
	var name = arguments.callee.name;

	if (this === null)
		throw new TypeError(name + ' called on null or undefined Object');

	if (typeof callback !== 'function')
		throw new TypeError(name + ' callback must be a function');

	var list = Object(this);
	/* jshint ignore:start*/
	var length = list.length >>> 0;		//return 0 if length undefined
	/* jshint ignore:end */
	var value = EZ.undefined;

	for (var i = 0; i < length; i++) 	//for all Array items . . .
	{
		var value = list[i];
		if (callback.call(thisObj, value, i, list))
			return value;
	}
	return undefined;
}))
//_______________________________________________________________________________
Array.prototype.find.test = function()
{
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
if (EZ.createPrototype(function findIndexEZprototypeArray(callback)
{
	var thisObj = thisObj || this;			//TODO: leave as undefined ??
	var name = arguments.callee.name;

	if (this === null)
		throw new TypeError(name + ' called on null or undefined Object');

	if (typeof callback !== 'function')
		throw new TypeError(name + ' callback must be a function');

	var list = Object(this);
	/* jshint ignore:start*/	
	var length = list.length >>> 0;
	/* jshint ignore:end */
	var value = EZ.undefined;

	for (var i = 0; i < length; i++)
	{
		value = list[i];
		if (callback.call(thisObj, value, i, list)) {
		return i;
	}
	return -1;
	}
}))
//_______________________________________________________________________________
Array.prototype.findIndex.test = function()
{
}
/*--------------------------------------------------------------------------------------------------
Array.forEach(callback, thisObject)

Implements forEach and associated variants for older browsers -- calls the callback function
for each array elenemt with the following arguments: element, index, array

Variants:
	every():	quits loop and returns false when callback function returns false;
				i.e. must return true to keep looping
				otherwise returns true after every item processed

	some():		quits loop and returns true when callback function returns true;
				otherwise returns false if all items return false
				i.e. acts like includes() -- quits on 1st success

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
if (EZ.createPrototype(function EZforEachEZprototypeArray(callback, thisObj)
{
	if (typeof callback != "function")
		throw new TypeError();

	var callerName = arguments.callee.caller.displayName || '';
	var o = thisObj || this;
	var l = o.len || 1;				//range set before 1st call
	for (var i = 0; i < l; i++)
	{
		if (!(i in o)) continue; //element no longer exists

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
}))
//_______________________________________________________________________________
/**
 * initially added for testing EZforEach() in browsers with native forEach()
 */
Array.prototype.EZforEach.test = function()
{
}
//_______________________________________________________________________________
/**
 *
 */
EZ.createPrototype(function forEachEZprototypeArray(callback, thisObj)
{
	return this.EZforEach(callback, thisObj);
})
//_______________________________________________________________________________
/**
 *
 */
EZ.createPrototype(function everyEZprototypeArray(callback, thisObj)
{
	return this.EZforEach(callback, thisObj);
})
//_______________________________________________________________________________
/**
 *
 */
EZ.createPrototype(function someEZprototypeArray(callback, thisObj)
{
	return this.EZforEach(callback, thisObj);
})
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
String.prototype.forEach = function(fn)
{
	var str = this;
	EZ.toArray(str).forEach(fn)
}

//_________________________________________________________________________________________________
e = function _____FORMAT_FUNCTIONS_____() {}	//convenience for DW functions list
//_________________________________________________________________________________________________

/*--------------------------------------------------------------------------------------------------
String.prototype.fromRanges(highest)												 created: 06-17-2016

returns Array of numbers or letters from string of ranges: e.g. -2, 4-8,11, 14-
cloned and updated code originally created for: EZ.test_assistant onlyList.

Array.fromRanges(): creates String of ranges from Array of numbers.


ARGUMENTS:
	highest 	(optional) highest number allowed (+/-) if >0 return all numbers for enpty string
				if omitted range of form: "14-" interpreted as "14" only
RETURNS:
	Array of sorted unique numbers

TODO:
	letter ranges
--------------------------------------------------------------------------------------------------*/
String.prototype.fromRanges = function fromRanges_String_EZprototype(highest)			
{
	highest = parseInt(highest);
	var str = this.trim();
	var list = [];
	if (str === '')
	{
		if (!isNaN(highest))		//all numbers
		for (var i=0; i<highest; i++)
			list[i] = i + 1;
		return list;
	}
	EZ.toArray(str, ', ').forEach(function(range)
	{										
		var n = range.split('-');
		n[0] = parseInt(n[0]);
		switch (n.length)
		{
			case 1: 
			{
				if (range.startsWith('-'))
					n[0] = 1;		//e.g -12
				else if (range.endsWith('-'))
					n[1] = Math.abs(highest || n[0]);
				else
					n[1] = n[0];
				break;	
			}
			case 2: 
			{
				n[1] = parseInt(n[1]);
				if (n[1] < n[0]) return;
				break;
			}
			default: return
		}
		for (var i=n[0]; i<= n[1]; i++)
			list.push(EZ.toInt(i));
	});
	return list.removeDups().sortPlus();
}
//________________________________________________________________________________________
String.prototype.fromRanges.test = function()
{	
	var msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, , rtnValue];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	//EZ.test.skip(999)		//count to skip 
	//EZ.test.settings({group: 'persistant note'});
	//______________________________________________________________________________________
	arg = '-2, 4-8,11, 14-'
	EZ.test.run(arg, 		{EZ: {ex:ex,	note:note	}})
	EZ.test.run(arg, 10,	{EZ: {ex:ex,	note:note	}})
	EZ.test.run('', 5,		{EZ: {ex:ex,	note:note	}})

	arg = '4-8, 11-10, -2, 14-'
	EZ.test.run(arg, 15,	{EZ: {ex:ex,	note:note	}})
	
	EZ.test.run('1', 3,		{EZ: {ex:[1],	note:note	}})
}
/*--------------------------------------------------------------------------------------------------
Array.toRanges(options)

Extracted from: Array.prototype.format() -- bad naming convention.
Originally created for EZ.testAssistant::loadTestResults()

String.toRanges(): creates Array of numbers.

If Array contains numbers, format range of numbers: 1-2, 5, 7-9

If Array contains String . . . TODO:

1st Array element determines above type.

ARGUMENTS:
	this		(Array)

	options		(optional) 	Object containing one or more of the following properties:
				how:	'seq' (default) ???

RETURNS:
	Array of Strings: rnumber ranges -or- aligned strings.
--------------------------------------------------------------------------------------------------*/
Array.prototype.toRanges = function toRanges_Array_EZprototype(options)
{
	if (!this.length) return '';
	var isNumber = !isNaN(this[0]);
	if (isNumber)
	{
		var str = '';
		options = options || {how:'sequence'}
		switch (options.how)
		{
			case 'sequence':
			{
				var first = '', last = '', numbers = this.slice();
				numbers.push(99999);
				while (true)
				{
					var next = numbers.shift();
					if ((next-1) === last)
						last++
					else
					{
						str += (first === '') ? ''
							 : first === last ? first + ', '
							 : first + '-' + last + ', ';
						first = last = next;
					}
					if (next === 99999)
						return str.clip(2);
				}
				break;
			}
			default:
			{
				return EZ.stringify(this);
			}
		}
	}
	else			//TODO: string ranges
	{
		EZ.oops('Strings not currently supported');
	}
}
//_____________________________________________________________________________________________
Array.prototype.toRanges.test = function()
{
	var arg, obj=null, ctx, ex, exfn, note = '';
	/*  jshint: future vars */	e = [arg, obj, ctx, ex, exfn, note];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	//______________________________________________________________________________
	//EZ.test.settings( {group: 'numbers'} );
	
	note  = ''
	ctx = [1,2,5,7,8,9];
	ex = '1-2, 5, 7-9'
	EZ.test.options({ex:ex, note:note});
	EZ.test.run(ctx)

	ctx = [5,2, 1];
	ex = '1-2, 5'
	EZ.test.options({ex:ex, note:'numbers asout of seq'});
	EZ.test.run(ctx)
	
	ctx = ['5','2', '1'];
	ex = '1-2, 5'
	EZ.test.options({ex:ex, note:'Array is numbers as strings'});
	EZ.test.run(ctx)

	ctx = [];
	ex = ''
	EZ.test.options({ex:ex, note:note});
	EZ.test.run(ctx)

	ctx = [0];
	ex = '0'
	EZ.test.options({ex:ex, note:note});
	EZ.test.run(ctx)
	//______________________________________________________________________________
	return;
}
/*--------------------------------------------------------------------------------------------------
Array.prototype.sortPlus(options)												 created: 06-17-2016

Sort Array of strings and/or numbers in either ascending (default) -OR- descending order 
If called with Object, property keys are sorted.
case sensitive (default) -OR- insensitive with identical strings except case next to each other.


ARGUMENTS:	legacy
	options	(optional) Array or delimited string one or more of the following:
	
			asc		sort in ascending order (default)
			desc	sort in decending order -- asc has precedence if also true
			
			strings		sort Array items as strings (default: typeof 1st Array item)
			numbers		sort Array items as numbers -- strings option has precedence

			sortCase:	=true (default) case sensitive sort -- all uppercase strings sorted before all
						lowercase (ascending) same as native sort -OR- after lowercase (descending)
						
						=false or "uppercase" case insensitive sort -- identical strings except case
						sorted next to each other NOT before/after all strings of sane case: e.g
							["a". "b", "B"] --> ["a", "B", "b"] (ascending)
										 or --> ["b", "B", "a"] (descending)
			
			nodups		=true, false, case (default) -- returned Array has dups removed of same case
			TODO:		if true and/or difference case if "case".specified
			
			(Boolean)	true/false interpreted as: asc or desc respectively


ARGUMENTS:
	options	(Boolean) true/false interpreted as: sortOrder=asc or =desc respectively
			
			otherwise Array, Object or delimited string containing one or more of the following:
			
			sortOrder	+, a, asc or true: sort in ascending order (default)
						-, d, desc or false for decending order -- asc has precedence if also true

			sortCase	=true (default) case sensitive sort -- all uppercase strings sorted before all
						lowercase (ascending) same as native sort -OR- after lowercase (descending)
						
						=false or "uppercase" case insensitive sort -- identical strings except case
						sorted next to each other NOT before/after all strings of sane case: e.g
							["a". "b", "B"] --> ["a", "B", "b"] (ascending)
										 or --> ["b", "B", "a"] (descending)
						
			sortType	number, numbers or string, strings
						="top" strings sorted before numbers -- "bottom" number 1st
						(default: strings 1st if asc -- numbers 1st is desc)
			
			toInt
			toFloat
			
			number		any combination of the following case insensitive values
						strict		typeof
						"loose" 
						="isNaN", "NaN", NaN (default) -- use isNaN() to determine if item is Number
						false -or- "native" treat numbers as strings -- 11 sorts before 1
						"startsWith": 8.5a treated as number sorts before 8b after 8a and 8.5
			
			new			true to only return new Array or Object -- otherwise Array or Object sorted in-place
						new Array or Object is always returned -AND- the existing Array or Object 
						is also sorted in-place -- if new option specified and not false, the
						the existing Array or Object is left "as is"
			
			nodups		=true, false (default) -- returned Array has dups removed of same case
						TODO: case: if true and/or difference case if "case".specified
			
RETURNS:
	sorted Array (dups removed if specified) -- Array with dups sorted in place like native sort()
	
TODO:
	remove EZ.merge() call
	string and number sort needs review (even refactored code)
		  [0]: 0
		  [1]: 7
		  [2]: "8.5"	number sort ?? -- opt to convert !isNaN() to Number ??
		  [3]: 9
		  [2]: "8.5"	string sort ??
		  [4]: "8a"
		  [5]: "a"
	EZ.options.defaultValues() has idea for validating options
--------------------------------------------------------------------------------------------------*/
Array.prototype.sortPlus = function sortPlus_Array_EZprototype(options)
{
	if (!/(Object|Array)/.test(this.constructor.name)) 
		return this;									//bail if not Object or Array
		
	var rtnValue;
	var isLegacy;
	var nonLegacyOpts = 'number new nodups'.split(/\s+/);
//	if (EZ.test.isTestFunction()) debugger;
	
	if (options === false)
		options = {desc: true}
	else if (options === true)
		options = {asc: true}
	else
	{
		options = EZ.options.call(options);
		if (options.legacy === undefined)
		{
			if (Object.keys(options).extract(nonLegacyOpts).length)
				isLegacy = false;	
		}
	}
	if (isLegacy === undefined)
		isLegacy = EZ.isLegacy('sortPlus');	
	
	options.sortOrder = (options.desc === true && !options.asc)	? 'descending' : 'ascending'
	options.sortCase = (options.case !== undefined) ? options.case : true;
	options.removeDups = (options.removeDups !== undefined) ? options.removeDups : false;
	options.sortType = (options.strings) ? 'strings'
					 : (options.numbers) ? 'numbers'
					 : '';
	
	if (!options.sortType)
	{
		options.sortType = (typeof(this[0]) == 'number' || !isNaN(this[0]) ? 'numbers' : 'strings') 
		options.sortType += ' (typeof[0])';
	}
	var isNumbers = options.isNumbers = options.sortType.includes('numbers');
	var order = options.order = (options.sortOrder == 'descending') ? 1 : -1;

	var sortedNumbers = 0,  
		sortedStrings = 0;
	//__________________________________________________________________________________________________
	/**
	 *	typeof() == 'number' convenience
	 */
	var isNumber = function(str)		
	{
		return (typeof(str) == 'number' || !isNaN(str));
		//return (typeof(str) == 'number');
	}
	//__________________________________________________________________________________________________
	/**
	 *	sort numbers -- NaN sorts greater than Number -- String greater than NaN
	 *	Matching string sort below cooresponding number
	 */
	var sortNumbers = function(a, b)
	{
		var sortValue = function(str)	//NaN only for typeof() == 'number'
		{
			return (!isNaN(str) || typeof(str) == 'number') ? Number(str) : str.toString();
		}
		var aVal = sortValue(a);
		var bVal = sortValue(b);
						
		var rtnValue = a === b ? 0
					 : (!isNumber(a) && !isNumber(b)) ? sortStrings(a, b)
					 : (!isNumber(a) && isNumber(b) && aVal == bVal) ? -order
					 : (isNumber(a) && !isNumber(b) && aVal == bVal) ? order
					 : isNaN(aVal) && isNaN(bVal) ? 0
					 : isNaN(a) && !isNaN(b) ? -order
					 : !isNaN(a) && isNaN(b) ? order
					 : (aVal > bVal ? -order : aVal < bVal ? order : 0);
		
		sortedNumbers++;
		return rtnValue;
	}
	//__________________________________________________________________________________________________
	/**
	 *	sort strings -- does toString() for items not typeof() == 'string' but
	 *	numbers sort before string equivelents
	 */
	var sortStringsLegacy = function(a, b)
	{
		var aStr = a + '';
		var bStr = b + '';		
		var aLower = aStr.toLowerCase();
		var bLower = bStr.toLowerCase();
		if (options.sortCase === true)
		{
			aLower = aStr;
			bLower = bStr;
		}
		var rtnValue = a === b ? 0
					 : isNumber(a) && isNumber(b) ? sortNumbers(Number(a), Number(b))
					 : aLower > bLower ? -order
					 : aLower < bLower ? order
					 : aStr < bStr ? -order 
					 : aStr > bStr ? order
					 						//toString() same -- equal if both strings
					 : (!isNumber(a) && !isNumber(b) && aStr == bStr) ? 0
					 						//one is number other is not 
					 : isNumber(a) && !isNumber(b) ? order : -order;
					 
		sortedStrings++;
		return rtnValue;
	}
	//__________________________________________________________________________________________________
	/**
	 *	sort strings 1st -- does toString() for items not number or string
	 *	numbers sort before string equivelents
	 */
	var sortStrings = function(a, b)
	{
		var aStr = a + '';
		var bStr = b + '';		
		var aLower = aStr.toLowerCase();
		var bLower = bStr.toLowerCase();
		if (options.sortCase === true)
		{
			aLower = aStr;
			bLower = bStr;
		}
		var rtnValue = a === b ? 0
					 : isNumber(a) && isNumber(b) ? sortNumbers(Number(a), Number(b))
				//	 : (!isNumber(a) && !isNumber(b) && aStr == bStr) ? 0
					 						
					 									//one is number other is not 
					 : (isNumber(a) && !isNumber(b)) ? -order 
					 : (isNumber(b) && !isNumber(a)) ? order 
					 									//both Strings
					 : aLower > bLower ? -order
					 : aLower < bLower ? order
					 : aStr < bStr ? -order 
					 : aStr > bStr ? order
					 : 0;
					 	
		sortedStrings++;
		return rtnValue;
	}
	//=================================================================================
	if (!EZ.isArray(this) && !EZ.isArrayLike(this))		
	{									
		var obj = this;					//sort Object keys
		var clone = {};						
		var keys = Object.keys(obj);
		if (keys.length)
		{
			
			keys.sortPlus( EZ.mergeAll(options, {sortType:'numbers'}) );
			keys.forEach(function(key)
			{
				clone[key] = obj[key];		//topLevel clone
				delete obj[key];			//delete all keys 
			});

			keys.forEach(function(key)
			{
				obj[key] = clone[key];		//add keys back in sorted order		
			});
		}
		rtnValue = clone;
	}
	//==================================================================================
	else
	{
		rtnValue = this;
		if (this.length) 
		{
			var sorted = (options.native) ? this.sort()			
					   : (isNumbers) ? this.sort(sortNumbers) 
					   : (isLegacy) ? this.sort(sortStringsLegacy)
					   : this.sort(sortStrings);
			rtnValue = (!options.removeDups) ? sorted : sorted.removeDups(options.removeDups);
		}
	}
	//==================================================================================
	if (EZ.test.isTestFunction && EZ.test.isTestFunction())
	{
		var feedback = {
			isLegacy: isLegacy,
			__sortedNumbers: sortedNumbers,  
			__sortedStrings: sortedStrings
		}
		var returnValue = new EZ.returnValue(null, options);
		returnValue.set('feedback', feedback);
	}
	//==============
	return rtnValue;
	//==============
}
//________________________________________________________________________________________
Array.prototype.sortPlus.test = function()
{	
	var msg, arr, ctx, arg, args, o, opt, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [msg, arr, ctx, arg, args, o, opt, obj, note='', ex, exfn, notefn, fn, val, , rtnValue];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//_______________________________________________________________________________________
	//=======================================================================================
	/*	
	NOTES:
	If NOT isOK() or message returned...
	...append message to actual results -- sets expected to "test failed" if not specified
	*/
	//__________________________________________________________________________________________
	var exfn = function exfn(testrun)
	{
		var msg;
		void(msg)
		
		var rtnValue = testrun.getReturnValue();
		var feedback = rtnValue.get('feedback') || {};
		feedback.options = testrun.getOptions();
		testrun.setResultsArgument(0, feedback, 'feedback');
		
		if (testrun.isArgumentChanged('ctx') 
		&& !testrun.isExpectedArgument('ctx'))
			testrun.setExpectedArgument('ctx', testrun.getArgument('ctx'));
	} 
	//=======================================================================================
	EZ.test.settings( {exfn:exfn} );
	EZ.test.settings( {legacy:'exclude=isLegacy'} );

	//______________________________________________________________________________________
	EZ.test.settings({group: 'live faults:'});

	arg = ['results', 0, 1]
	ex = ['results', 0, 1]
	EZ.test.run(arg,					{EZ: {ex:ex	}})
	//______________________________________________________________________________________
	EZ.test.settings({group: 'sort object keys'});
	
	obj = {b:'4th', a:'3rd', '2':'1st', '11':'2nd'}
	ex = {
		2: "1st",
		11: "2nd",
		a: "3rd",
		b: "4th"
	}
	EZ.test.run(obj, {EZ: {ex:ex} });
//EZ.test.quit	
	
	//______________________________________________________________________________________
	EZ.test.settings({group: 'sort numbers -- isNaN() strings sort after numbers'});
	
	EZ.test.run(['2','11'],				{EZ: {ex:["2", "11"]	}})
	EZ.test.run(['11','2'],				{EZ: {ex:["2", "11"]	}})
	EZ.test.run([4,2,11], 				{EZ: {ex:[2,4,11]	}})
	
	EZ.test.run(['b','a','2','11'],				{EZ: {ex:["2", "11", 'a', "b"]	}})
//	EZ.test.run(['b','a','2','11'], 'sort1st',	{EZ: {ex:['a', "b", "2", "11"]	}})
//	EZ.test.run(['b','a','2','11'], 'strict',	{EZ: {ex:["11", "2", 'a', "b"]	}})
	
	arr = [4,2,11]
	opt = false 
	EZ.test.run(arr,opt,		{EZ: {ex:[11,4,2]	}})

	EZ.test.run([1, 14, 3], 		{EZ: {ex:[1,3,14], note:'numbers'	}})


	arr = [14, 13, 3, 6, 7, 8, 9, 10, 11, 12, 2, 1, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
	ex = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
	ex = [1, 2, 3, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
	EZ.test.run(arr, 		{EZ: {ex:ex, note:'numbers 1-25'	}})


	
	arr = [9,'8.5','8a',7,'a', 0]
	ex = ["a", "8a", 9, "8.5", 7, 0]
	EZ.test.run(arr, false,		{EZ: {ex:ex, note:'DESC non-numeric strings at top'	}})
	
	ex = ["a", "8a", 9, "8.5", 7, 0]
	EZ.test.run(arr, true,		{EZ: {ex:ex, note:'ASC non-numeric strings at top'	}})

	arr = [9,'8.5','8a',7,'a', 0]
	ex = ["a", "8a", 9, "8.5", 7, 0]
	EZ.test.run(arr, false,		{EZ: {ex:ex, note:'DESC non-numeric strings at top'	}})

	ex = [0, 7, "8.5", 9, "8a", "a"]
	EZ.test.run(arr,			{EZ: {ex:ex, note:'8a is string'	}})

	note = 'native sort() -- 8a sorted above 9'
	ex = [0, 7, "8.5", "8a", 9, "a"];
	opt = {native:true}
	EZ.test.run(arr, opt,	{EZ: {ex:ex, note:note, legacy:'EZsortPlus' }})
	
	//______________________________________________________________________________________
	EZ.test.settings({group: 'sort strings'});
	
	arr = ['b', 'a', 'c']
	EZ.test.run(arr, 		{EZ: {ex: ["a", "b", "c"]	}})
	
	//______________________________________________________________________________________
	EZ.test.settings({group: 'sort strings -- no numbers'});
	
	note = 'native keeps in exitsting order'
	arr = ['9', 9, 1]
	EZ.test.run(arr, {native:true},		{EZ: {ex:[1, '9', 9], note:note	}})
	arr = [9, '9', 1]
	EZ.test.run(arr, {native:true},		{EZ: {ex:[1, 9, '9'], note:note	}})
	
	arg = ['99', '9', '1', '10']
	ex = ["1", "10", "9", "99"]
	EZ.test.run(arg, {native:true},		{EZ: {ex:ex	}})
	EZ.test.run(arg,					{EZ: {ex:ex	}})
	
	arg = ['99', '9', '1', '10']
	ex = ["99", "9", "10", "1"]
	EZ.test.run(arg, false,				{EZ: {ex:ex	}})
	
	//______________________________________________________________________________________
	EZ.test.settings({group: 'sort strings -- numbers sort just above associated string '});

	ex = [1, 9, "9", 10] 
	EZ.test.run([1, '9', 9, 10],		{EZ: {ex:ex	}})
	EZ.test.run([9, '9', 1, 10],		{EZ: {ex:ex	}})
	
	ex = [1, 10, 9, "9"] 
	EZ.test.run(['9', 9, 1, 10], {strings:true}, {EZ: {ex:ex, note:'sorts diff as string'}})
	
	ex = [10, "9", 9, 1]
	EZ.test.run([1, '9', 9, 10], false,	{EZ: {ex:ex, note:'DESC'	}})
	EZ.test.run(['9', 9, 1, 10], false,	{EZ: {ex:ex, note:'DESC'	}})
	
	arr = ['b', 'a', 'A', 11, "11", 2, '2']
	ex = [11, "11", 2, "2", "A", "a", "b"];
	EZ.test.run(arr, {native:true},	{EZ: {ex: ex, note:'native sort()'	}})
	
	ex = [11, "11", 2, "2", "A", "a", "b"];
	EZ.test.run(arr, 		{EZ: {ex: ex	}})
	
	arr = ['b', 'a', 'A', "11", 11, '2', 2]
	EZ.test.run(arr, 		{EZ: {ex: ex	}})
	
	ex = [11, "11", 2, "2", "A", "a", "b"]
	EZ.test.run(arr,		{EZ: {ex:ex		}})
	EZ.test.run(arr, true,	{EZ: {ex:ex		}})
	
	ex = ["b", "a", "A", "2", 2, "11", 11]
	EZ.test.run(arr, false,	{EZ: {ex: ex	}})
	
	//______________________________________________________________________________
	return;
}

/*--------------------------------------------------------------------------------------------------
Array.format(options)

If Array contains numbers, format range of numbers: 1-2, 5, 7-9 a.j

If Array contains String, embedded tabs are aligned using String.format()

1st Array element determines above type.



ARGUMENTS:
	this		(Array)

	options		(optional) 	Object containing one or more of the following properties:
				how:	'seq' default

RETURNS:
	Array of Strings: rnumber ranges -or- aligned strings.
--------------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function formatEZprototypeArray(options)
{
	if (this.length === 0) return [];
	
	  //---------------------------------\\
	 //----- format range of numbers -----\\
	//-------------------------------------\\
	if (typeof(this[0]) == 'number')
	{
		var str = '';
		options = options || {how:'sequence'}
		switch (options.how)
		{
			case 'sequence':
			{
				var first = '', last = '', numbers = this.slice();
				numbers.push(99999);
				while (true)
				{
					var next = numbers.shift();
					if ((next-1) === last)
						last++
					else
					{
						str += (first === '') ? ''
							 : first === last ? first + ', '
							 : first + '-' + last + ', ';
						first = last = next;
					}
					if (next === 99999)
						return str.clip(2);
				}
				break;
			}
			default:
			{
				return EZ.stringify(this);
			}
		}
	}
	  //---------------------------------\\
	 //----- format array of Strings -----\\
	//-------------------------------------\\
	var args
	var lineItems = [];
	var itemSizes = [];
	var lines = this;
	for (var i=0; i<lines.length; i++)
	{
		var ln = lines[i] || '';
		ln = ln.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, EZ.EOL);
		if (!ln) continue;
		
		args = ln.split(/ *\t */g);
		if (args.length < 2)
			lineItems.push(ln + '');		//no tabs
		else
		{
			var items = [];
			for (var j=0; j<args.length; j++)
			{
				var item = args[j] || '';
				items.push(item);
				itemSizes[j] = Math.max(item.length + 1, itemSizes[j] || 0);
			}
			lineItems.push(items);
		}
	}
	var format = '';
	for (var j=0; j<itemSizes.length; j++)
	{
		var size = itemSizes[j] > 0 ? ':' + itemSizes[j] : '';
		format += '{' + j + size + '}';
	}
	
	var formattedLines = [];
	for (var i=0; i<lineItems.length; i++)
	{
		args = lineItems[i];
		if (typeof(args) == 'string')
			formattedLines.push(args);
		else
		{
			var text = format.format(args);
			text = text.format();
			if (text.clip) text = text.clip();
			formattedLines.push(text);
		}
	}
	return formattedLines;
}))
//_____________________________________________________________________________________________
Array.prototype.format.test = function()
{
	var arg, obj=null, ctx, ex, exfn, note = '';
	/*  jshint: future vars */	e = [arg, obj, ctx, ex, exfn, note];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	//______________________________________________________________________________
	EZ.test.settings( {group: 'strings'} );
	
	note  = ''
	ctx = [];
	ctx[0] = 'Apple\tfruit';
	ctx[1] = ' ';
	ctx[2] = 'Ground Beef\tmeat';
	ex = '';
	EZ.test.options({ex:ex, note:note});
	EZ.test.run(ctx)


	//______________________________________________________________________________
	EZ.test.settings( {group: 'numbers'} );
	
	note  = ''
	ctx = [1,2,5,7,8,9];
	ex = '1-2, 5, 7-9'
	EZ.test.options({ex:ex, note:note});
	EZ.test.run(ctx)

	ctx = [];
	ex = ''
	EZ.test.options({ex:ex, note:note});
	EZ.test.run(ctx)

	ctx = [0];
	ex = '0'
	EZ.test.options({ex:ex, note:note});
	EZ.test.run(ctx)
	//______________________________________________________________________________
	return;
}
/*--------------------------------------------------------------------------------------------------
Array.formatStack()
--------------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function formatStackEZprototypeArray()
{
	var stackTrace = this.join('\n').formatStack();
	if (stackTrace[0].startsWith('@'))
		stackTrace.shift();
		
	return stackTrace.formatStack();
}))
//_________________________________________________________________________________________________
Array.prototype.formatStack.test = function()
{
}
/*--------------------------------------------------------------------------------------------------
Error.format()
--------------------------------------------------------------------------------------------------*/
Error.prototype.format = function format_EZ_Error_prototype()
{
	var stackTrace = this.stack.formatStack();
	if (stackTrace[0].startsWith('@'))
		stackTrace.shift();
		
	return stackTrace;
}
//_____________________________________________________________________________________________
Error.prototype.format.test = function()
{
}

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
String.prototype.format = function EZformat_String()
{
	if (!arguments.length)				//if no arguments supplied, clear all parameters from string
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
	//var results = rtnValue.matchPlus(pattern);
	//if (results.isFound && results.length > 0)
	var results = rtnValue.match(pattern);
	if (results)
	{
		var maxCol = 0;
		rtnValue.replace(pattern, function(all,before,align)
		{
			/*  jshint: future vars - now unused */	e = [align];
			maxCol = Math.max(maxCol, displayLength(before));
		});
		rtnValue = rtnValue.replace(pattern, function(all,before,align)
		{
			/*  jshint: future vars - now unused */	e = [align];
			return before + ' '.dup(maxCol - displayLength(before));
		});
	}

	//==============
	return rtnValue;
	//==============
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

//_____________________________________________________________________________________________
String.prototype.format.test = function()
{
	var arg, obj, values,
		ctx = 'na', ex = 'na', exfn = null, note = '';
	/*  jshint: future vars */	e = [arg, obj, values, ctx, ex, exfn, note];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	arg = ''
		+ 'RegExp( ""\n'
		+ '		"line\t" {align}{0}\n'
		+ "		'other\t' {align}{0}\n"
		+ '		bigger line {align}{1}\n'
	values = ['apple', 'pear'];
	EZ.test.results = {ex:ex, fn:exfn, ctx:arg, note:note};
	EZ.test.run(arg, values)

	arg = ''
	   + 'RegExp( ""\n'
	   + '        "(^\\\\s*)"{align} //{0}\n'
	   + '        "(\\\\(function\\\\(\\\\)\\\\s*\\\\{|\\\\{|\\\\[)"{align}\n'
	   + '        "\\\\s*"{align}\n'
	   + '        "([\\\\s\\\\S]*?)"{align}\n'
	   + '        "(\\\\}\\\\)\\\\(\\\\)|\\\\}|\\\\])"{align}\n'
	   + '        ".*"{align}\n'
	   + '        , "");"';
	EZ.test.results = {ex:ex, fn:exfn, ctx:arg, note:note};
	EZ.test.run(arg, values)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	values  = '1st [ObjectLike] ... 2nd [Array]\n'
			+ '[0] "b"          !== 11         \n'
			+ '[2] "A"          !== 2          \n'
			+ '[4] "11"         !== "A"        \n'
	EZ.test.run('{0}', values)
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
String.prototype.formatStack = function EZformatStack_String(options)
{
	var stack = this + '';					//string containing stacktrace
	if (!stack) return [];

	if (EZ.stripConfigPath)
		stack = EZ.stripConfigPath(stack);
	else
		stack = stack.replace(/(http:.*?)\/(?=\w+\.(js|htm|html|php|jsp|asp))/g, '.../');
	
	if (EZ.stripUrlParameters)
		stack = EZ.stripUrlParameters(stack);

	if (typeof(options) == 'string')
	{
		stack = options + '\n' + stack;
		options = '';
	}
	options = !options ? {}
			: typeof(options) == 'object' ? options
			: {skipCount: options};		//legacy options was skipCount

	//var maxCount = '.maxCount .max'.ov(options, 10);
	var skipCount = '.skipCount .skip'.ov(options, 0);

	var skipPrefix = EZ.toArray('.skipPrefix .prefix'.ov(options, 'EZ RZ DW'), ', ');
	var skipPattern = !skipPrefix.length ? ''						//no skipPrefix
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

			/* jshint ignore:start*/	// unescape
			results.set('pathfile_lineno', unescape(results.pathfile_lineno + ''));
			/* jshint ignore:end */
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
			//------------------------------------------------------------------
			var format = ('{1}{2} {3:' + funcMaxSize + '} {4}').format(results);
			//------------------------------------------------------------------
			stack[i+offset] = format;
		});
	});
	return wrap ? '<' + wrap + '>' + stack.join('\n') + '</' + wrap + '>'
		 		: stack;	//return array
}
//________________________________________________________________________________________
/**
 *	
 */
String.prototype.formatStack.test = function()
{	
	var msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
		e = [msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, , rtnValue];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	ex = EZ.test.notSpecified;

	exfn = function(results, testrun)
	{
		testrun.results = results = {results: results}
	}
	notefn = function(testrun)
	{
		e = testrun;
	}
	//EZ.test.skip(999)		//count to skip 

	//______________________________________________________________________________________
	//EZ.test.settings({group: 'persistant note'});

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = ''
	ex = EZ.test.notSpecified;
	
	msg = ''
		+ '"**validating: input json\n'
		+ 'ReferenceError: bad is not defined\n'
		+ '    at eval (eval at EZjson_unquoteKeys (http://localhost:8080/revize/dw.Configuration/Shared/EZ/js/EZstringify.js:2069:28), <anonymous>:1:7)\n'
		+ '    at Object.EZjson_unquoteKeys [as unquoteKeys] (http://localhost:8080/revize/dw.Configuration/Shared/EZ/js/EZstringify.js:2069:15)\n'
		+ '    at EZ.unquoteKeys (http://localhost:8080/revize/dw.Configuration/Shared/EZ/js/EZstringify.js:2095:17)\n'
		+ '    at Function.EZtest_run [as run] (http://localhost:8080/revize/dw.Configuration/Shared/EZ/html/EZtest_assistant_run.js:240:37)\n'
		+ '    at Function.EZ.unquoteKeys.test [as testScript] (http://localhost:8080/revize/dw.Configuration/Shared/EZ/js/EZstringify.js:2148:10)\n'
		+ '    at http://localhost:8080/revize/dw.Configuration/Shared/EZ/html/EZtest_assistant_run.js:772:11"';
	
	EZ.test.options( {ex:ex, note:'note as options argument -- String not Object' } )
	EZ.test.run( msg, 'additional note' )
	
	EZ.test.options( {ex:ex, note:'skipcount options argument -- Number not Object' } )
	EZ.test.run( msg, 2 )
	
	//______________________________________________________________________________________
	note = 'hangs when passed already formatted stacktrace'
	msg = [
		"TypeError: Converting circular structure to JSON",
		"   at JSON.stringify                   ",
		"   at EZstringify:2109                 (.../EZbasic.js:2109)",
		"   at displayCallValues:1601           (.../EZtest_assistant_run.js:1601)",
		"   at processCallArgs:1414             (.../EZtest_assistant_run.js:1414)",
		"   at EZtest_run:750                   (.../EZtest_assistant_run.js:750)",
		"   at EZ.stringify.test:2311           (.../EZbasic.js:2311)",
		"   at .../EZtest_assistant_run.js:391  "
	]
	//EZ.test.run(msg)
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
String.prototype.matchPlus = function matchPlus_EZ_String(regex, groupLabels, length)
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
	var i;
	try
	{
		if (regex == EZ.undefined) regex = '';
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
						if (results[i] == EZ.undefined)
							results[i] = '';
						offset = _getGroupOffset();	//complexity here
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
		if (results[i] == EZ.undefined) results[i] = '';
		// no match found or exception determining group offsets
		if (results.start[i] == EZ.undefined)
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
		results.offsets += label + ':[' + results.start[i] + ',' + results.end[i] + '], ';
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
			if (key == EZ.undefined || !isNaN(key) || key in results ) continue;
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

		if (typeof(this.values[key]) == 'undefined' && defaultValue != EZ.undefined)
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
	function _getGroupOffset()
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
//_____________________________________________________________________________________________
String.prototype.matchPlus.test = function()
{
	var note='na', str, instr, regex, results;

	instr = 'abc';
	regex = /c/;
	results = instr.match(regex);
	EZ.test.results({ex:results, note:note});
	EZ.test.run(instr, regex);

	note = 'invalid pattern'
	instr = '/*/';

	note = 'Invalid regular expression: missing /()'
	regex = '/[/';

	//results = instr.match(regex);
	EZ.test.results({ex:results, note:note});
	EZ.test.run(instr, regex);


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
		+ '   tagName: DIV'							+ '\n'
		+ '   parent: &lt;form action="" method="p...'	+ '\n'
		+ '   id: EZtest_wrap'							+ '\n'
		+ ''											+ '\n'
		+ '  ____1@  style (CSSStyleDeclaration):'		+ '\n'
		+ ''											+ '\n'
		+ '<a name="EZ_73308395_2"></a> <span id="EZ_73308395_2" '
		+ 'class="repeat EZ_undefined">childNodes (NodeList): repeated x3</span>'			+ '\n'
		+ '     ____2@ [0] (Text) *blank*'				+ '\n'
		+ '[1] (HTMLLabelElement)'						+ '\n'
		+ '         tagName: LABEL'					+ '\n'
		+ '         parent: &lt;div id="EZtest_wrap">'					+ '\n'
		+ '         id: EZtest_input'					+ '\n'
		+ '        ____3@  style (CSSStyleDeclaration) [0]:'			+ '\n'
		+ ' childNodes (NodeList):'										+ '\n'
		+ '            ...repeat of:<a href="#73308395_2">HTMLDivElement.childNodes</a>'	+ '\n'
		+ '      3____@'								+ '\n'
		+ '[2] (Text) *blank*'							+ '\n'
		+ '[3] (HTMLUnknownElement)'					+ '\n'
		+ '         tagName: EZTEST_TAG'				+ '\n'
		+ '         parent: &lt;div id="EZtest_wrap">'					+ '\n'
		+ '         id: EZtest_tag0'					+ '\n'
		+ '         class: EZtest_class0'				+ '\n'
		+ '        ____3@  style (CSSStyleDeclaration) [0]:'			+ '\n'
		+ ' childNodes (NodeList):'						+ '\n'
		+ '            ...repeat of:<a href="#73308395_2">HTMLDivElement.childNodes</a>'	+ '\n'
		+ '      3____@'								+ '\n'
		+ '[4] (Text) *blank*'							+ '\n'
		+ '[5] (HTMLUnknownElement)'					+ '\n'
		+ '         tagName: EZTEST_TAG'				+ '\n'
		+ '         parent: &lt;div id="EZtest_wrap">'					+ '\n'
		+ '         id: EZtest_tag1'					+ '\n'
		+ '         class: EZtest_class1'				+ '\n'
		+ '        ____3@  style (CSSStyleDeclaration) [0]:'			+ '\n'
		+ ' childNodes (NodeList):'						+ '\n'
		+ '            ...repeat of:<a href="#73308395_2">HTMLDivElement.childNodes</a>'	+ '\n'
		+ '      3____@'								+ '\n'
		+ '[6] (Text) *blank*'							+ '\n'
		+ '   2____@'									+ '\n'
		+ '1____@'										+ '\n'
		+ '0____@'										+ '\n'
		+ ''											+ '\n'
	results =
		[/* 0: */ '4____@'								+ '\n'
				+ '[2] (Text) *blank*'					+ '\n'
				+ '[3] (HTMLSpanElement)'				+ '\n'
				+ '				tagName: SPAN'  		+ '\n'
				+ '				parent: &lt;label id="test_id1" clas...'	+ '\n'
				+ '			   ____4@ ',
		 /* 1: */ '2____@'  + ''						+ '\n'
				+ '[1] (HTMLInputElement)'				+ '\n'
				+ '      tagName: INPUT'				+ '\n'
				+ '      parent: &lt;label>'			+ '\n'
				+ '      name: EZtest_radio'			+ '\n'
				+ '      type: radio'					+ '\n'
				+ '      value: some'					+ '\n'
				+ '      id: EZtest_radio1'			+ '\n'
				+ '      class: test_id1 idandclass'	+ '\n'
				+ '     ____2@ ',
		 /* 2: */ '2____@'								+ '\n'
				+ ' test_id1 (HTMLLabelElement):'		+ '\n'
				+ '     [tagName]: LABEL'				+ '\n'
				+ '     [id]: test_id1'				+ '\n'
				+ '     ____2@ ',
		 /* 3: */ '2____@'								+ '\n'
				+ '<a name="EZ_79357510_17"></a> <span id="EZ_79357510_17" class="repeat ' 	/*...*/
				+ 'EZ_undefined">EZtest_radio1 (HTMLInputElement): repeated x1</span>' 		+ '\n'
				+ '     [tagName]: INPUT'				+ '\n'
				+ '     [name]: EZtest_radio'			+ '\n'
				+ '     [type]: radio'					+ '\n'
				+ '     [value]: some'					+ '\n'
				+ '     [id]: EZtest_radio1'			+ '\n'
				+ '     ____2@ '
		];
		results.start = [770,1133,1384,1616];
		results.end = [915,1346,1477,1888];
		results.index = 770;
		results.lastIndex = 1888;
		results.isFound = true;

	EZ.test.run(str, /(\d*)____@\n([\s\S]*?)____\1@ /g,		{EZ: {ex:results, note:note	}})
}

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
if (EZ.createPrototype(function indexOfEZprototypeArray(obj, fromIndex)
{
	if (fromIndex == null)
		fromIndex = 0;
	else if (fromIndex < 0)
		fromIndex = Math.max(0, this.length + fromIndex);

	for (var i=fromIndex; i<this.length; i++)
		if (this[i] === obj) return i;

	return -1;
}))
//_______________________________________________________________________________
Array.prototype.indexOf.test = function()
{
}
/*--------------------------------------------------------------------------------------------------
Array.joinWithPrefixAndSuffix(prefix, suffix[, delimiter])

join array with specified prefix and suffix using default delimiter ","
--------------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function joinWithPrefixAndSuffixEZprototypeArray(prefix, suffix, delimiter)
{
	return EZ.join(this, delimiter, prefix, suffix);
}))
//_______________________________________________________________________________
Array.prototype.joinWithPrefixAndSuffix.test = function()
{
}
/*--------------------------------------------------------------------------------------------------
Array.joinWithPrefix(prefix[, delimiter])

join array with specified prefix using delimiter ", " or supplied delimiter
--------------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function joinWithPrefixEZprototypeArray(prefix, delimiter)
{
	return EZ.join(this, delimiter || ', ', prefix, undefined);
}))
//_______________________________________________________________________________
Array.prototype.joinWithPrefix.test = function()
{
}
/*--------------------------------------------------------------------------------------------------
Array.joinWithSuffix(suffix[, delimiter])

join array with specified suffix using delimiter ", " or supplied delimiter
--------------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function joinWithSuffixEZprototypeArray(suffix, delimiter)
{
	return EZ.join(this, delimiter || ', ', undefined, suffix);
}))
//_______________________________________________________________________________
Array.prototype.joinWithSuffix.test = function()
{
}
/*--------------------------------------------------------------------------------------------------
Object.keys
returns Array of owner properties for an Object

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (EZ.createPrototype(function keysEZprototypeObject(obj)
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

    return function()
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
}))
//_______________________________________________________________________________
Object.prototype.keys.test = function()
{
}
--------------------------------------------------------------------------------------------------*/

/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function isEZprototypeArray(choices)
{
	return EZ.is(choices);
}))
//_______________________________________________________________________________
Array.prototype.is.test = function()
{
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

//_________________________________________________________________________________________________
e = function _____TRUTHY_FUNCTIONS_____() {}	//convenience for DW functions list
//_________________________________________________________________________________________________

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
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
/**
 */
Boolean.prototype.isFalse = function isFalseEZprototypeBoolean()
{
	if (!this) return true;
}
/**
 */
Number.prototype.isFalse = function isFalseEZprototypeNumber()
{
	if (this === 0 || isNaN(this)) return false;
}
/**
 */
String.prototype.isFalse = function isFalseEZprototypeString()
{
		return this.isTrueLike();
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
			if (array[i] == EZ.undefined)
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
/*--------------------------------------------------------------------------------------------------
String.left(number)

return leftmost number of string characters up to length of string or leftmost character if
number not supplied.  Empty string returned if number is NaN, less than or equal zero.
--------------------------------------------------------------------------------------------------*/
EZ.createPrototype(function leftEZprototypeString(number)
{
	if (number == EZ.undefined) number = 1;
	if (isNaN(number) || number <= 0) return '';

	return this.substr(0, number);
});
/*---------------------------------------------------------------------------------------------
Object.ov(key,[defaultValue])
---------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function ov__EZ__Array(key, defaultValue)
{
	return key.ov(this, defaultValue);
}))
//________________________________________________________________________________
Object.prototype.ov.test = function()
{
	var ex = {a:1, b:2, c:3}
	var ctx = {mergeOptions:ex}
	var note = '...'
	EZ.test.run(ctx, 'mergeOptions', 			{EZ: {ex:ex, ctx:ctx, note:note}})
	//____________________________________________________________________________
return;

	/*
	var timesDefault = { times: {mode:0,options:0,messages:0} }
	var groupTimes = group.ov(timeUpdates.groups, timesDefault);

	if (!timeUpdates.groups[name])
		timeUpdates.groups[name] = {};
	if (!timeUpdates.groups[name].times)
		timeUpdates.groups[name].times = {};
	var times = timeUpdates.groups[name].times;
	*/
}
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
	
			if defaultValue is Object with 'null', 'undefined' and/or '' it specified default for
			undefined, null property value or property not found respectfully.  If defaultValue not
			specified, either value of property returned or undefined if property not found.

EXAMPLES:
	if ('EZ.global.legacy.EZgetEl'.ov()) ...
	var color = "EZ.defaults.editform.fields.textarea.color".ov('red');
-vs-
	if (window.EZ && EZ.global && EZ.global.legacy && EZ.legacy.global.EZgetEl == EZ.undefined) ...

	var color = 'red';
	if (window.EZ && EZ.defaults && EZ.defaults.editform && EZ.defaults.editform.fields
	&& EZ.defaults.editform.fields.textarea && EZ.defaults.editform.fields.textarea.color != EZ.undefined)
		color = EZ.defaults.editform.fields.textarea.color;
--------------------------------------------------------------------------------------------------*/
e = function _____STRING__OV_____() {}	//convenience for DW functions list
String.prototype.ov = function ovEZprototypeString(o, defaultValue)
{
	//if (EZ.capture(this,true)) {return EZ.capture()} else if (EZ.test.debug()) debugger;
	try
	{
		var defaults 
		var obj;					//initialized by 1st set of properties -- does not change
		var value = true;			//1st set of properties found with null/undefined value
		var isFound = false;		//used when no set of properties is not null or undefined

		var dotName = this.trim();				//get ctx String containing 1 or more sets
												//property key in dot name format
		var initializeValue = false;
		if (dotName.endsWith('='))
		{
			initializeValue = true;				//when ctx String ends with '"', any missing object
			dotName = dotName.clip();			//properties are copied from the defaultValue object
		}
		var args = [].slice.call(arguments);	//initial arguments
		var sets = dotName.split(' ');			//split ctx String into set(s) of properties
		
		//----- for each set of properties . . .
		if (sets.some(function ov_sets(set)
		{							//loop till non null or undefined property value found
			var keys = set.split('.');
			o = keys.shift();
			if (o !== undefined)	//falls thru if empty string (i.e. String starts with dot)
			{						//when string starts with dot -- object is 1st arg...
				if (o === '') 		//...saved as obj for property sets after 1st
					o = obj = (obj || args.shift());
				else				//otherwise object is global scope
					o = typeof(window[o]) != 'undefined' ? window[o] : undefined;
			}
			if (args)				//defaultValue is next arg, when processing first dotname set
			{
				defaultValue = args.shift();		
				if (!initializeValue)
				{											//defaultValue same for all scenarios...
					defaults = defaultValue != null 					//...unless object has one
							   && typeof(defaultValue) == 'object' 		//...of below properties
							   && ['','null','undefined'].some(function ov_defaultValue(p)
							   {
									if (p in defaultValue) return true;
							   });
				}
				args = '';
			}
			if ('object function'.indexOf(typeof o) == -1)
			{								//specified Object is not an Object
				o = getDefaultValue(o, false)
				o = undefined;				//...below code checks for null 
				return true;				//break -- no point trying any dotName sets
			}
			//-----------------------------------------------------------------------
			// specified object found if o is not undefined when first arriving here
			//-----------------------------------------------------------------------
			while (o != null)				//1st or next property found if defined
			{
				if (!keys.length)
					return isFound = true;	//SUCCESS -- quit while AND sets loop
				
				var next = keys[0];			//TODO: keys[0] could be null??
				if (next == null) 
					next += ''; 
				var key = next.match(/^\[(.*)\]/)
				if (key)
				{							//next key is Array contents
					key = isNaN(key[1]) ? key[1] : parseFloat(key[1]);
					var idx = [].indexOf.call(o,key);
					if (!(idx in o)) return false;
					o = o[idx];
					keys.shift();
				}
				else if (!(next in o))		//Object does not have next key 
				{							
					if (initializeValue)	//...if initialize, set property from defaultValue
						return setDefaultValue(keys);
						//o = o[keys.shift()] = setDefaultValue(next, keys);
					
					else					
						return false;		//...otherwise try next set of properties if any
				}
				else
					o = o[keys.shift()];	//next property exists...

				if (keys.length > 0 && 'object function'.indexOf(typeof o) == -1)
					return false;			//...if key and NOT object -- try next set of properties
			}
			if (!keys.length && value) 		//value found for 1st specified dotname but value is 
				value = o;					//null or undefined -- try next dotname set if any but 
											//save for use when no non-null/undefined value found
		}))
		{
			//----- specified object and property found with non-null/non-undefined value
			while (true)	//isFound
			{
				// 1st check for mapped value when multiple defaultValues specified...
				if (defaults
				&& (o == null || 'object function'.indexOf(typeof o) == -1)
				&& o in defaultValue)			//...and mapped value defined...
					return defaultValue[o];		//...return mapped property value

				/*04-18-2016 DCO: NO...default value may be error message
				var defaultType = defaults 		//get type of notFound defaultValue
								? typeof(defaults['undefined']) != 'undefined'
								? typeof(defaults['undefined']) : ''
								: typeof(defaultValue) != 'undefined'
								? typeof(defaultValue) : '';

				// if found object / property is object but spefified defaultValue is not...
				if (typeof(o) == 'object' && defaultType && defaultType != 'object')
					break;						//...fall thru to return defaultValue
				*/

				// otherwise return found object or property value as is
				return o;
			}
		}										//none of dotname properties found (value == true)
		return getDefaultValue(value,!value);	//or value is 1st found but null or undefined value
	}
	catch (e)
	{
		 EZ.techSupport(e, arguments, this);
	}
	//________________________________________________________________________________________
	/**
	 *
	 */
	function getDefaultValue(value, isFound)	
	{
		if (defaults)						//if multiple defaultValues specified . . .
		{									
			if (isFound) void(0);
			if (value === true)
			{								//none of specified dotName properties found
				if ('' in defaultValue)
					return defaultValue[''];
			}
			else if (value in defaultValue)	//if defaultValue defined for this scenario, return it
				return defaultValue[value];
		}
		else if (defaultValue !== undefined)
			return defaultValue				//else return single defaultValue if specified

		else if (value !== true)			//else return value of 1st dotName property 
			return value;					//found with null or undefined value if any
		
		else 						
			 return undefined;				//otherwise return undefined
	}
	//________________________________________________________________________________________
	/**
	 *	set mode -- initialize missing properties
	 *	TODO: need to match object level
	 */
	function setDefaultValue(keys)	
	{
		while (keys.length > 0)
		{
			var next = keys.shift();
			if (keys.length === 0)
			{
				o = o[next] = defaultValue;			//TODO: defaultValue could be dotName=value;
				isFound = true;
				break;
			}
			o[next] = isNaN(next) ? {} : [];
			o = o[next];
		}
		return true;
	}
}
/*--------------------------------------------------------------------------------------------------
TODO: DW & EASY different code
String.right(number)

Return rightmost number of string characters or rightmost character if number not supplied.
Empty string returned if number is NaN, greater than string length, less than or equal zero.
--------------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function rightEZprototypeString(number)
{
	if (number == EZ.undefined) number = 1;
	if (isNaN(number) || number <= 0 || number > this.length) return '';

	return this.substr(this.length - number);
}))
/*--------------------------------------------------------------------------------------------------
Return rightmost number of string characters or rightmost character if number not supplied.
Empty string returned if number is NaN, greater than string length, less than or equal zero.
--------------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function rightEZprototypeNumber(number)
{
	var str = this.toString();
	return str.right(number);
}))
//_______________________________________________________________________________
String.prototype.right.test = function()
{
}
/*--------------------------------------------------------------------------------------------------
Object.remove(keys...)

return new Array or Object with specified keys and/or types removed.

If not Object constructor the existing Object is ALSO updated to preserve existing constructor

TODO:
	if Array, remove named keys DO NOT treat as [].remove
--------------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function removeKeysEZprototypeObject(keys, types)
{
	var obj = this;
	if ( !(obj instanceof Object) ) return obj;

	  //---------------------------\\
	 //----- called for Object -----\\
	//-------------------------------\\
	if (!EZ.isArray(obj))
	{
		var isCustom = obj.constructor.name != 'Object';
		var _deleteKey = function(key)
		{
			delete returnObj[key];
			if (isCustom)
				delete obj[key];
		}
		var _toArrayArg = function(arg)
		{
			return !arg ? []
				 : EZ.isObject(arg) ? Object.keys(arg)	//??
				 : EZ.toArray(arg, ', ');
		}
		//=====================================================================================
		//var returnObj = EZ.mergeAll(this);			//does not preserve nested constructors
		var returnObj = {};
		Object.keys(obj).forEach( function(key) {returnObj[key] = obj[key]} );
		
														//remove specified keys if any
		_toArrayArg(keys).forEach( function(key) {_deleteKey(key)} );
		
		types = _toArrayArg(types);
		if (types.includes('Number'))
			types.push('NaN');
		
		if (types.length)								//remove specified types if any
		{
			Object.keys(returnObj).forEach(function(key)
			{
				var value = returnObj[key];
				
				if (types.includes(typeof value))
					_deleteKey(key)
				
				else if (types.includes(EZ.getType(value, 'NaN Element Function')))
					_deleteKey(key)
				
				else if (value instanceof Object && types.includes(value.constructor.name))
					_deleteKey(key)
			});
		}
		return returnObj;
	}
	  //--------------------------\\
	 //----- called for Array -----\\					//treat as [].remove() ??
	//------------------------------\\
	//var obj = this;
	var args = [].slice.call(arguments);
	return Array.prototype.remove.apply(obj, args);
}))
//_______________________________________________________________________________
Object.prototype.removeKeys.test = function()
{	
	var obj, ex, note = '';
	var exfn = function(testrun)
	{
		var results = testrun.getResults();
		var obj = testrun.argsClone.ctx;
		var keys = Object.keys(obj).remove(Object.keys(results))
		if (keys.length === 0)
			keys = ['none'];
		testrun.setResultsArgument(0, keys.join(', '),'removed keys');
	}

	//______________________________________________________________________________
	obj = {a:1, b:2, c:3}
	ex = EZ.mergeAll(obj);
	delete ex.a;
	delete ex.b;
	
	EZ.test.options( {ex:obj, note:note})
	EZ.test.run(obj)	
	
	//______________________________________________________________________________
	EZ.test.settings( {group:'keys only -- test before types options', ex:ex} )
	
	EZ.test.run(obj, 'a  b')	
	EZ.test.run(obj, 'a, b')	
	EZ.test.run(obj, ['a','b'])	
	EZ.test.run(obj, {a:0, b:0})	
	
	//______________________________________________________________________________
	EZ.test.settings( {group:'keys and/or types', exfn:exfn, ex:EZ.test.notSpecified} )
	
	var fn = function fn(){};
	var opts = EZ.options('z')
	obj = {obj:[{a:1,b:2}], o:{array:[1,2]}, n:1, "NaN":NaN, s:'str', b:false, f:fn, opts:opts}
	
	EZ.test.run(obj, 'a', 'Number')	
	EZ.test.run(obj, '', 'NaN')	
	EZ.test.run(obj, null, 'String')	
	EZ.test.run(obj, null, 'string')	
	EZ.test.run(obj, null, 'Function')	
	EZ.test.run(obj, null, 'Object')	
	EZ.test.run(obj, null, 'Array')	
	EZ.test.run(obj, null, 'object')	
	EZ.test.run(obj, null, 'EZoptions')	
	
	//______________________________________________________________________________
	return;
}
/*--------------------------------------------------------------------------------------------------
Array.extract([array-of-values])

Opposite of Array.remove() removes duplicates and all items expect supplied values.

ARGUMENTS:
	values		list of values to extract from Array specified as comma or space delimited String
				or Array -- must use Arrray to extract undefined, null or comma.

TODO:
	extract named Array properties
--------------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function extractEZprototypeArray(extractValues)
{														
	extractValues = EZ.toArray(extractValues, {type:true, delimiter:', '}).removeDups();
	
	var arrayValues = [].slice.call(this).removeDups();		//supports ArrayLike i.e. arguments	
	var removeValues = arrayValues.remove(extractValues);
	
	return arrayValues.remove(removeValues);
}))
//_____________________________________________________________________________________________
Array.prototype.extract.test = function()
{
	var msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, , rtnValue];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	ex = note = undefined;
	var exfn = function(results, expected, testrun)
	{
		void( [results, expected, testrun] )	//jshint
		testrun.exfnDone = true;				//don't call as legacy
		
		var exResults;
		if (ex !== undefined)
			exResults = ex;
		else
		{
		 	exResults = EZ.toArray(testrun.args[1], ', ').slice().removeDups();
		}
		if (note !== undefined)
			testrun.note = note;
			
		ex = note = undefined;
		return exResults;
	}
	//_______________________________________________________________________________________
	EZ.test.settings( {exfn:exfn} )				//exfn called if EZ.test.options() not called
	note = ''
	ctx = [0, 1, 2, 9, undefined, null, ''];	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	EZ.test.run( ctx, [1,2] );
	EZ.test.run( ctx, [0, 1,2] );
	EZ.test.run( ctx, [''] );
	EZ.test.run( ctx, [] );
	EZ.test.run( ctx, '' );
	
	EZ.test.options( {ex:[]} )
	EZ.test.run( ctx, [','] );
	EZ.test.run( [1, ','], [','] );
	
	EZ.test.run( ctx, [undefined] );
	EZ.test.run( ctx, [null] );
	
	EZ.test.options( {ex:[2]} )
	EZ.test.run( ctx, [2,3] );

	EZ.test.options( {ex:[0,1,2], note:'was EZ.toArray() bug'} )
	EZ.test.run( ctx, '0, 1,2' );
	ex = undefined

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	ctx = ['a', 'b']
	EZ.test.run( ctx, 'a b' );

	ctx = ['a', 'b', 'b']
	EZ.test.run( ctx, 'a b b' );	
	EZ.test.run( ctx, ['a', 'b', 'b'] );	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	//______________________________________________________________________________
	//arg = [1,2]
	//EZ.test.options( {ex:ex, note:note} )
	//EZ.test.run( arg, ex )
	
	//______________________________________________________________________________
	return;
}
/*--------------------------------------------------------------------------------------------------
Array.remove([fromIndex][,toIndex] | [value, value,...], [array-of-values])

return new Array with specified items removed -- original Array is unchanged.

If no arguments, remove blank, null or undefined Array items (and duplicates if not legacy)
Duplicate not removed if 1st or 2nd argument is false.

If first argument is not number, remove all items matching value of any argument.
If first argument is an Array or ArrayLike object, remove any item matching any of the Array items.

otherwise when fromIndex is number, remove slice of elements starting with fromIndex thru
toIndex if specified or to end of Array -- i.e. splice() alternative w/o changing original Array.

NOTE: called by EZ.toArray() to elimanate blank items when converting delimited string to Array.

For Object, delete keys:
	[].remove.apply(o,keys)
	EZ.remove(o, keys) ??

	var rest = this.slice((toIndex || fromIndex) + 1 || this.length);
	this.length = fromIndex < 0 ? this.length + fromIndex : fromIndex;
	return this.push.apply(this, rest);

	if (arguments.length == 0)
		fromIndex = [];

TODO:
	vendors.filter(function(vendor){ return vendor.Name === "Magenic" });
	stackoverflow.com/questions/8217419/how-to-determine-if-javascript-array-contains-an-object-with-an-attribute-that-e
--------------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function removeEZprototypeArray(fromIndex /* values */, toIndex)
{
	//if (EZ.test.capture()) {return EZ.test.capture(this)} else if (EZ.test.debug()) debugger;
	
	var rtnArray = this.slice();
	/*
	var isLegacy = EZ.isLegacy();
	var values = fromIndex;
	if (isLegacy && typeof(values) == 'boolean' || toIndex === undefined)
	{
		if (values === true)
			EZ.oops('potential backward compatibility issue: remove(true)');
		values = undefined;
	}
	*/
	var values = arguments[0];
	var fromIndex = arguments[0];
	var toIndex = arguments[1];

	//----- Determine if removing values or slice
	if (arguments.length === 0)
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
		/*
		rtnValue = this.filter(function(item)
		{ 
			if (values.constructor == RegExp)
			{
				if (typeof(item) == 'string' && values.test(item)) return;
			}
			else if ([].indexOf.call(values,item) != -1) return;
			return true;
		});
		*/
		rtnArray = [];
		this.forEach(function(item)
		{
			if (values.constructor == RegExp)
			{
				if (typeof(item) == 'string' && values.test(item)) return;
			}
			else if ([].indexOf.call(values,item) != -1) return;

			rtnArray.push(item);
		});
	///	if (fromIndex !== false && toIndex !== false)	//removeDups
	///		rtnValue = rtnValue.removeDups();
	}
	//----- return Array with fromIndex, toIndex slice removed
	else
	{
		fromIndex = Math.max(0, fromIndex || 0);
		toIndex = Math.min(this.length, (toIndex || this.length-1) + 1);
		rtnArray.splice(fromIndex, toIndex-fromIndex);
	}
	return rtnArray;
}))
//_____________________________________________________________________________________________
Array.prototype.remove.test = function()
{
	var note;
	
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

	//______________________________________________________________________________	
	note = 'Array remove values';
	EZ.test.run(values, 				{EZ: {ex:values_wo_default		,ctx:values, note:note}})
	EZ.test.run(values, '',				{EZ: {ex:values_wo_blank		,ctx:values, note:note}})
	EZ.test.run(values, null,			{EZ: {ex:values_wo_null			,ctx:values, note:note}})
	EZ.test.run(values, undefined,		{EZ: {ex:values_wo_undefined	,ctx:values, note:note}})
	EZ.test.run(values, true,			{EZ: {ex:values_wo_true			,ctx:values, note:note}})
	EZ.test.run(values, false,			{EZ: {ex:values_wo_false		,ctx:values, note:note}})

	EZ.test.run(values, 'b',			{EZ: {ex:values_wo_b			,ctx:values, note:note}})
	EZ.test.run(values, 'a', 'b', 1,	{EZ: {ex:values_wo_a_b			,ctx:values, note:note}})
	EZ.test.run(values, ['a', 'b'],		{EZ: {ex:values_wo_a_b			,ctx:values, note:note}})
	EZ.test.run(values, true, false,	{EZ: {ex:values_wo_true_false	,ctx:values, note:note}})
	EZ.test.run(values, [true, false],	{EZ: {ex:values_wo_true_false	,ctx:values, note:note}})

	EZ.test.run(values, /[ab]/,			{EZ: {ex:values_wo_a_b	,ctx:values, note:note}})
	EZ.test.run(values, /(a|b)/,		{EZ: {ex:values_wo_a_b	,ctx:values, note:note}})

	//______________________________________________________________________________	
	note = 'remove slice';
	var array = [0,1,2,3];

	EZ.test.run(array, -1,		{EZ: {ex:[],	ctx:array	, note:note}})
	EZ.test.run(array, 1,		{EZ: {ex:[0],	ctx:array 	, note:note}})
	EZ.test.run(array, 1, 99,	{EZ: {ex:[0], 	ctx:array	, note:note}})
	EZ.test.run(array, 2, 3,	{EZ: {ex:[0,1], ctx:array	, note:note}})
	EZ.test.run(array, 0,		{EZ: {ex:[], 	ctx:array	, note:note}})
}
/*---------------------------------------------------------------------------------------------
Array.removeDups()

returns new Array with duplicate items removed -- original Array is unchanged.

REFERENCE:
	http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array
---------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function removeDupsEZprototypeArray(isRemoveEmpty)
{
	var rtnArray = [];
	var thisArray = isRemoveEmpty ? this.remove() : this;
    for (var i=0; i<thisArray.length; i++)
	{
        if (rtnArray.indexOf(thisArray[i]) != -1) continue;
		rtnArray.push(thisArray[i]);
    }
    return rtnArray;
}))
//_____________________________________________________________________________________________
Array.prototype.removeDups.test = function()
{
	var arg, obj=null, ctx, ex, exfn, note = '';
	/*  jshint: future vars */	e = [arg, obj, ctx, ex, exfn, note];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	ctx = [1,2,3];
	ex = [1,2,3];

	EZ.test.results({ctx:ctx, ex:ex, note:note});
	EZ.test.run(ctx)

	ctx = [1,1,1,2,2,3];
	ex = [1,2,3];

	EZ.test.results({ctx:ctx, ex:ex, note:note});
	EZ.test.run(ctx)

	note = 'empty array'
	ctx = [''];
	ex = [''];

	EZ.test.results({ctx:ctx, ex:ex, note:note});
	EZ.test.run(ctx)

	ex = [];
	EZ.test.results({ctx:ctx, ex:ex, note:note});
	EZ.test.run(ctx, true)

	//______________________________________________________________________________
	return //endtest

	var objA = {a:1, b:2}
	var objX = {x:24, y:25}
	var inArray = [1,2,3,3,'a',objA,objX,objA];
	var exArray = [1,2,3,'a',objA,objX];
	EZ.test.run(inArray.slice(),				{EZ: {ex:exArray,	note:''	}})
}
/*--------------------------------------------------------------------------------------------------
Array.swap(a, b)

Swap 2 elements of Array if both are within bounds.

ARGUMENTS:
	a		index of 1st element
	b		index of 2nd element

RETURNS:
	Array with elements swapped if within Array bounds otherwise Array unchanged.

REFEERENCE:
	http://stackoverflow.com/questions/872310/javascript-swap-array-elements
TODO:
	implement EZ.swap(a, b, c, ...)
--------------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function swapEZprototypeArray(a, b)
{
	if (arguments.length == 2 && !isNaN(a) && !isNaN(b)
	&& a >= 0 && a < this.length && b >= 0 && b < this.length)		
		this[a] = [this[b], this[b] = this[a]][0];
		
	return this;
}))
//_______________________________________________________________________________
Array.prototype.swap.test = function()
{
	var note = '';
	var list = [1,2,3,4,5]
	var ex = [1,4,3,2,5]
	
	EZ.test.options( {ex:ex, ctx:ex, note:note})
	EZ.test.run(list.slice(), 3, 1);
	
	EZ.test.options( {ex:ex, ctx:ex, note:note})
	EZ.test.run(list.slice(), '3', 1);
	
	note = 'no change';
	EZ.test.options( {ex:list, ctx:list, note:note})
	EZ.test.run(list.slice(), '3');
	
	EZ.test.options( {ex:list, ctx:list, note:note})
	EZ.test.run(list.slice());
}
	/**
	 */
/*--------------------------------------------------------------------------------------------------
Object.slicePlus(start, end[, exludedKeys])

	Same as slice except named Array properties are also copied and supports ArrayLike objects
	such as arguments -- always returns Array with named properties.
	
	Array items or named property values refer to the same Objects as original Array.prototype.
	
	See EZ.merge(...)  or EZ.mergeAll(...) to clone referenced Objects

ARGUMENTS:
	start	(optional) specifies where to start the selection (The first element has an index of 0). 
			Use negative numbers to select from the end of an array -- default: 0
			
	end		(optional). specifies where to end the selection. If omitted, all elements from the 
			start position and to the end of the array will be selected. 
			Use negative numbers to select from the end of an array	a		

RETURNS:
	new Array containing specified items and named properties not excluded
--------------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function slicePlusEZprototypeObject(start, end, excludedKeys)
{
	var args = [];
	if (arguments.length > 1 || !isNaN(start))
	{
		args.push([].shift.call(arguments).toInt());
		if (arguments.length > 1 || !isNaN(end))
			args.push([].shift.call(arguments).toInt());
	}
	excludedKeys = EZ.toArray([].shift.call(arguments, ', '));

	var obj = this;
	var clone = !EZ.isArrayLike(obj) ? []
			  : [].slice.apply(EZ.toArray(obj), args);
	
	excludedKeys.push('length');
	Object.keys(obj).forEach(function(key)
	{
		if (isNaN(key) && !excludedKeys.includes(key))
				clone[key] = obj[key];
	});
	return clone;
}))
//_______________________________________________________________________________
Object.prototype.slicePlus.test = function()
{
	var arg, obj=null, ctx, ex, exfn, note = '';
	/*  jshint: future vars */	e = [arg, obj, ctx, ex, exfn, note];
	
	//______________________________________________________________________________
	EZ.test.settings( {group: 'Arrays'} )
EZ.test.only(5);
	ctx = [1,2,3];
	
	EZ.test.options( {ex: ctx.slice() });
	EZ.test.run(ctx);	
	
	EZ.test.options( {ex: ctx.slice() });
	EZ.test.run(ctx, 0);	
	
	EZ.test.options( {ex: ctx.slice(1) });
	EZ.test.run(ctx, 1);	
	
	EZ.test.options( {ex: ctx.slice(0,1) });
	EZ.test.run(ctx, 0,1);	
	
	ctx.color = 'red';
	ex = ctx.slice(-1)
	ex.color = ctx.color;
	EZ.test.options( {ex: ex});
	EZ.test.run(ctx, -1);	
	
	ctx.color = 'red'
	ex = ctx.slice(-2, -1);
	
	EZ.test.options( {ex: ex});
	EZ.test.run(ctx, -2, -1, 'color');	
	
	ex = ctx.slice(-2);
	EZ.test.options( {ex: ex});
	EZ.test.run(ctx, -2, 'color');	
	
	ex = ctx.slice(0);
	ex.city = ctx.city = 'Key Largo';
	EZ.test.options( {ex: ex});
	EZ.test.run(ctx, 'color');	
	
	//______________________________________________________________________________
	EZ.test.settings( {group: 'ArrayLike'} )
	obj = {0:1, 1:2, 2:3, length:3};
	
	EZ.test.options( {ex: ctx.slice() });
	EZ.test.run(obj);	
	
	EZ.test.options( {ex: ctx.slice() });
	EZ.test.run(obj, 0);	
	
	ex = EZ.mergeAll(ctx);
	EZ.test.options( {ex: ctx.slice(1) });
	EZ.test.run(obj, 1);	
	
	EZ.test.options( {ex: ctx.slice(0,1) });
	EZ.test.run(obj, 0,1);	
	
	obj.color = 'red';
	ex = ctx.slice(-1)
	ex.color = ctx.color;
	EZ.test.options( {ex: ex});
	EZ.test.run(obj, -1);	
	
	ctx.color = 'red'
	ex = ctx.slice(-1);
	//ex.color = ctx.color;
	
	EZ.test.options( {ex: ex});
	EZ.test.run(obj, -1, 'color');	
	
	EZ.test.options( {ex: ctx.slice() });
	EZ.test.run(obj, 'color');	
	
	//______________________________________________________________________________
	EZ.test.settings( {group: 'Object no Array items'} )
	obj = {color:'green'};
	ex = [];
	ex.color = obj.color;
	EZ.test.options( {ex: ex});
	EZ.test.run(obj);	
	
	delete ex.color;
	EZ.test.options( {ex: ex});
	EZ.test.run(obj, 'color');	
	
	//______________________________________________________________________________
	return;
}
/*---------------------------------------------------------------------------------------------
array.sortSlice(start, end): sort part of array
sortFunc [sort function | 'nocase' | 'ignoreCase' | 'anyCase' | 'caseInsensitive']
---------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function sortSliceEZprototypeArray(fromIndex, toIndex, sortFunc)
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
	function sortProcess(aCase, bCase)
	{
		var a = aCase;
		var b = bCase;
		if (nocase)
		{
			a = aCase.toLowerCase()
			b = bCase.toLowerCase()
		}
		if (!desc)
		{
			return (a < b) ? -1
				 : (a > b) ? 1
				 : (aCase > bCase) ? -1		//lowerCase before upperCase
				 : (aCase < bCase) ? 1
				 : 0;
		}
		else
		{
			return (a > b) ? -1
				 : (a < b) ? 1
				 : (aCase < bCase) ? -1		//lowerCase after upperCase
				 : (aCase > bCase) ? 1
				 : 0;
		}
	}
}))
//_______________________________________________________________________________
Array.prototype.sortSlice.test = function()
{
}
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
if (EZ.createPrototype(function endsWithEZprototypeString(searchString, offset)
{
	var subjectString = this.toString();
	if (offset == EZ.undefined || offset > subjectString.length)
		offset = subjectString.length;

	offset -= searchString.length;

	var lastIndex = subjectString.indexOf(searchString, offset);
	return lastIndex !== -1 && lastIndex === offset;
}))
//_______________________________________________________________________________
String.prototype.endsWith.test = function()
{
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
if (EZ.createPrototype(function includesEZprototypeString(searchString, offset)
{							/* jshint: doc only */   e = [searchString, offset];
		return String.prototype.indexOf.apply(this, arguments) != -1;
}))
//_______________________________________________________________________________
String.prototype.includes.test = function()
{
}
/**
 *
 */
String.prototype.includesIgnoreCase = function includesIgnoreCase_EZ_String(searchString, offset)
{
	searchString = (searchString != EZ.undefined ? searchString + '' : '').toLowerCase();
	return this.toLowerCase().indexOf(searchString, offset) != -1;
}
//_______________________________________________________________________________
String.prototype.includesIgnoreCase.test = function()
{
}
/**
 *
 */
String.prototype.contains = function contains_EZ_String() /* alternative name */
{
	return String.prototype.indexOf.apply(this, arguments) != -1;
}
//_______________________________________________________________________________
String.prototype.contains.test = function()
{
}
/*--------------------------------------------------------------------------------------------------
Array.includesPlus([searchString|Array|Regex] [, offset] [, true|false])

see: String.includesPlus()
--------------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function includesPlusEZprototypeArray(searchString, offset, ignoreCase)
{
	return String.prototype.call(this, searchString, offset, ignoreCase);
}))
//_______________________________________________________________________________
Array.prototype.includesPlus.test = function()
{
}
/*--------------------------------------------------------------------------------------------------
String.includesPlus([searchString|Array|Regex] [, offset] [, true|false])
String.includesAll()
String.includesAny()

Determine if this String includes specified String -- search is case sensitive.

ARGUMENTS:
	searchString	String, Array, Date or RegExp to search for in String or Array

	offset			(optional) offset in String or Array to begin search (default: 0)

RETURNS:
	true if searchString found in String at offset; otherwise false
	
TODO:	could not resist coding but deferred testing until EZtest_assistant polished.

	use with EZ.options() -- refactored _isOptions() 
	//------------------------------------------------------------------------------
	SEE: EZ.message.wait(text, el, ctx, delay)
	var _isOptions = function(arg)
	{
		var isTrue = arg instanceof Object
					&& Object.keys(arg).includesAny(text, el, ctx, delay)
		return isTrue;
	}
	var options = arguments.getOptions('text, el, ctx, delay', _waitArgs);	??
	

--------------------------------------------------------------------------------------------------*/
String.prototype.includesPlus = function includesPlus_EZcoder(searchString, offset, ignoreCase)
{
	if (/String|Array/.test(EZ.getType(this)))
		return EZ.oops('un-supported type, this') || false;
	
	var str = this.slice(offset || 0);
	switch (EZ.getType(searchString))
	{
		case 'Null': 
		case 'Undefined': 
		case 'Boolean': 
		case 'NaN': 
		case 'Number':
		case 'String': 
		{
			return (ignoreCase) ? this.includesIgnoreCase(searchString, offset)
								: this.includes(searchString, offset);
		}
		case 'Date':
		{
			var time = searchString.getTime();
			return EZ.toArray(str).some(function(str)
			{
				return (EZ.is(str, Date) && str.getTime() == time)
			});
		}
		case 'RegExp':
		{
			return EZ.toArray(str).some(function(str)
			{
				return searchString.test(str);
			});
		}
		case 'Array': 	
		{
			return searchString.some(function(searchStr)
			{
				return str.includes(searchStr);
			});
		}
		case 'Object': 	
		{
			return searchString.some(function(searchStr)
			{
				return str.includes(searchStr);
			});
		}
		default:
		{
			return EZ.oops('un-supported search argument', this) || false;
		}
	}
}
//_______________________________________________________________________________
String.prototype.includesPlus.test = function()
{
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
if (EZ.createPrototype(function startsWithEZprototypeString(searchString, offset)
{
	offset = offset || 0;
	return this.indexOf(searchString, offset) === offset;
}))
//_______________________________________________________________________________
String.prototype.startsWith.test = function()
{
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
	startString = (startString != EZ.undefined ? startString + '' : '"');
	endString = (endString != EZ.undefined ? endString + '' : startString);

	return this.startsWith(startString) && this.startsWith(startString);
}
/*--------------------------------------------------------------------------------------------------
String.trim()

removes any leading or ending whitespace

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
--------------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function trimEZprototypeString()
{
	return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}))
//_______________________________________________________________________________
String.prototype.trim.test = function()
{
}
/*--------------------------------------------------------------------------------------------------
String.trimLeft()

removes any leading whitespace
--------------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function trimLeftEZprototypeString()
{
	return this.replace(/^[\s\uFEFF\xA0]+/g, '');
}))
//_______________________________________________________________________________
String.prototype.trimLeft.test = function()
{
}
/*--------------------------------------------------------------------------------------------------
String.trimRight()  --  removes any ending whitespace
--------------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function trimRightEZprototypeString()
{
	return this.replace(/[\s\uFEFF\xA0]+$/g, '');
}))
//_______________________________________________________________________________
String.prototype.trimRight.test = function()
{
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
		if (chars == EZ.undefined || chars === '')
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
				lines[i] = trimPlusProcess(lines[i]);
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
		if (isTrimLeft)
			str = str.replace(Regex('^(' + chars + ')([\s\S]*)', flags), '$2');
		if (isTrimRight)
			str = str.replace(Regex('([\s\S]*?)(' + chars + ')$', flags), '$1');
	 */
	function trimPlusProcess(str)
	{
		if (isTrimLeft)
			str = str.replace(RegExp('^' + chars + '+', flags), '');
		if (isTrimRight)
			str = str.replace(RegExp('' + chars + '+$', flags), '');
		return str;
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
	EZ.test.run(str, '/+/',  					{EZ: {			note:'invalid regex'	}})
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
	//var url = 'my.html';
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
/*---------------------------------------------------------------------------------------------
this function converts number to the nearest integer

defaultValue (optional) value to use if string is not a number
---------------------------------------------------------------------------------------------*/
Number.prototype.toInt = function toIntEZprototypeNumber(defaultValue)
{
	return EZ.toInt(this, defaultValue);
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
String.prototype.toInt = function toIntEZprototypeString(defaultValue)
{
	return EZ.toInt(this, defaultValue);
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
	/*  jshint: future vars - now unused */	e = [options];
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
	return !false;
}
Boolean.prototype.isTrueLike = Boolean.prototype.isTrue;
Boolean.prototype.isTrueFalseValue = Boolean.prototype.isTrue;
/*---------------------------------------------------------------------------------------------
return true if trueLike else false
---------------------------------------------------------------------------------------------*/
Number.prototype.isTrue = function isTrueEZprototypeNumber()
{
	return !false;
}
Number.prototype.isTrueLike = Number.prototype.isTrue;
/*---------------------------------------------------------------------------------------------
return true if falseLike else false
---------------------------------------------------------------------------------------------*/
Number.prototype.isFalse = function isFalseEZprototypeNumber()
{
	return !true;	// == 0 || isNaN(this);
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
	return !true;
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
--------------------------------------------------------------------------------------------------*/
String.prototype.wrap = function wrapEZprototypeString(wrapLeft, wrapRight)
{
	var pairs = {'[':']', '{':'}', '(':')', '<':'>'}
	var pairsGroup = '[] {} () <>'.split(/\s+/);
	
	wrapLeft = wrapLeft != null ? wrapLeft //if left not specified use big dot
								: String.fromCharCode(8226);
								
	if (wrapRight == null)					//if right wrap is not specified...
	{						
		if (pairsGroup.includes(wrapLeft))	//for readibility, allow:		10-08-2016 update
		{									//	'...'.wrap('[]') besides '...'.wrap('[')
			wrapRight = wrapLeft.substr(-1);
			wrapLeft = wrapLeft.clip(1);
		}
		else								//matching pair, same as left or html close tag
		{
			wrapRight = pairs[wrapLeft] || wrapLeft;
			wrapRight = wrapRight.replace(/^<(\w+)([\s\S]*)(?=>)/, '</$1');
		}

	}
	return wrapLeft + this + wrapRight;
}
/*--------------------------------------------------------------------------------------------------
Add most String functions as Boolean and Number prototypes -- Eliminate need to convert to String 
when using String function -- especially when EZ.get() or EZ.set() returns Boolean or Number.
--------------------------------------------------------------------------------------------------*/
Object.keys(EZ.prototypeFunctions || {}).forEach(function(objName)
{
	if (!/(Boolean|Number)/.test(objName)) return;
	var p = (objName == 'Boolean') ? Boolean.prototype		
								   : Number.prototype;

	var native = ('includes indexOf lastIndexOf match replace search trim trimLeft trimRight repeat'
			   + ' left right slice charAt charCodeAt codePointAt concat'
			   + ' bold italics link strike sub big blink small fixed fontColor fontSize'
			   + ' toLowerCase toUpperCase slice substr substring startsWith endsWith') .split(/\s+/)
	
	var fnList = Object.keys(String.prototype).concat(EZ.prototypeFunctions.String, native);
	fnList.forEach(function(name)
	{
		var fn = ''[name];
		if (!fn || p[name]) 
			return;
		/*
		 *	String fn can check caller (=null when not called from here)
		 */
		p[name] = function()
		{										
			var args = [].slice.call(arguments);
			return fn.apply(String(this), args);
		}
	});
});

//_________________________________________________________________________________________________
e = function _____ELEMENT_PROTOTYPES_____() {}	//convenience for DW functions list
//_________________________________________________________________________________________________


/*--------------------------------------------------------------------------------------------------
Element.isVisible(reasons)

Checks if a DOM element is truly visible bases on: display visibility opacity and offsets of element
and parents.

ARGUMENTS:
	reasons		(optional) Array or delimited String of reasons checked -- all checked if omitted

RETURNS:
	true if visible otherwise false
--------------------------------------------------------------------------------------------------*/
Element.prototype.isVisible = function(styles, mode) 
{
	if (!/(String|Array)/.test(EZ.getType(styles)))
	{
		mode = styles;
		styles = '';
	}
	mode = (mode === null) ? mode : !mode
	return !this.isHidden(styles, mode);
}
/*--------------------------------------------------------------------------------------------------
Element.isHidden(styles)

Checks if a DOM element is truly hidden bases on: display visibility opacity and offsets of element
(and parents unless mode === null).

ARGUMENTS:
	styles		(optional) Array or delimited string containing one or more of the following:
					"display", "visibility", "opacity", "offsets" or "document"
				(default: all of above)
				becomes mode argument if not String or Array
	
	mode		(optional) if null, only the specified element is checked (not parents) 
				if false, interpret as isVisible(): return true or false -- no reasons why
				for any other value, return false if elements and parent not hidden otherwise 
					return Array containing all specified styles hiding element (and parents)
	
RETURNS:
	if mode is false meaning isVisible(), return true in not hidden else false.
	otherwise...
	
	false if not hidden (i.e visible) based on specified styles
	else an Array of reasons why hidden: 
		
		if parents not checked, reasons Array contains specified styles hiding element
			e.g. ['display']
		
		if parents checked, reasons Array contains Objects with properties: "el" and "why" 
			where 
				el: is the hidden el or parent
				why: is Array of any specified styles hiding el
		
			The return Array also has named properties cooresonding to any style hiding el or
			parent (not just specified styles) -- each named property is an Array of elements 
			hidden by that property / style:
			
			Example:
				for styles = 'display, visibility';
				reasons = [							
					{el: <parent>, why: ['display'],
					{el: <el>, why: ['display', 'visibility'],
				]
				reasons.display = [<parent>, <el>];
				reasons.visibility = [<el>];
				reasons.opacity = [<parent>];
		
			Note: offsets are not accurate for any element with display:none or its decendents and
				  thus Arrays are ordered with ancestor / parents preceeding the specified element.
				  
REFEERENCE:	
	* Author: Jason Farrell
	* Author URI: http://useallfive.com/
	*
	* Description: Checks if a DOM element is truly visible.
	* Package URL: https://github.com/UseAllFive/true-visibility
	
	renamed to isHidden() in order to reasons why hidden
	
TODO: 
	test: especially offsets
	not ultimately used as 1st thought for EZ.show()
	use as replacement for EZ.isHidden()
--------------------------------------------------------------------------------------------------*/
Element.prototype.isHidden = function(styles, mode) 
{
	'use strict';
	if (!/(String|Array)/.test(EZ.getType(styles)))
	{
		mode = styles;
		styles = '';
	}
	var isVisible = (mode != null && !mode);	//if false but not null or undefined

	//mode = !(mode === null || Boolean(mode));
	var checkParents = (mode !== null)
	
	styles = styles || 'document display visibility opacity offsets';
	var styles = EZ.toArray(styles, ', ');
	
	function EZvisibleState()
	{
		this.hiddenCount = 0;
		this.styles = styles,
		this.absolute = [],						//list absolute ancestor
		this.reasons = []						//Array of specified reasons element hidden
		this.valueOf = function()
		{
			return Boolean(this.hiddenCount);
		}
	}											//also has named property list of elements
	
	
	var rtnValue = new EZvisibleState();		//hidden for any reason
	var reasons = rtnValue.reasons;				
												
	//______________________________________________________________________________________________
	/**
	 * Checks if a DOM element is visible. Takes into
	 * consideration its parents and overflow.
	 *
	 * @param (el)      the DOM element to check if is visible
	 *
	 * These params are optional that are sent in recursively,
	 * you typically won't use these:
	 *
	 * @param (t)       Top corner position number
	 * @param (r)       Right corner position number
	 * @param (b)       Bottom corner position number
	 * @param (l)       Left corner position number
	 * @param (w)       Element width number
	 * @param (h)       Element height number
	 */
	var _isHidden = function(el, t, r, b, l, w, h) 
	{
		var p = el.parentNode, VISIBLE_PADDING = 2;
		var why = [];
		//______________________________________________________________________________________________
		/**
		 *	if hidden by specified style, add to why Array()
		 */
		var _isWhy = function(el, style, hiddenStyleValue) 
		{
			if (hiddenStyleValue === true 					//caller indicates hidden
			|| EZ.getStyle(el, style) == hiddenStyleValue) 	//otherwise check if style is hidden value
			{
				if (styles.includes(style)) 				//if specified style, add to why Array
				{
					why.push(style);
					rtnValue.hiddenCount++;
				}
				reasons[style] = reasons[style] || [];		//always add why hidden to reasons object
				reasons[style].unshift(el);					
			}
		}
		//______________________________________________________________________________________________
		/**
		 *
		 */
		var _elementInDocument = function(element) 
		{
			while (element = element.parentNode) 
			{
				if (element == document) return true;
				if (EZ.getStyle(element, 'position') == 'absolute')
					rtnValue.absolute.unshift(el);
			}
			
			return false;
		}
		//===============================================================================================
		if ( 9 === el.nodeType )					//document node -- always visible
			return;
		
		if ( !_elementInDocument(el) )
			_isWhy(el, 'document', 'none');
		
		_isWhy(el, 'display', 'none');
		_isWhy(el, 'visibility', 'hidden');
		_isWhy(el, 'opacity', '0');
		
		if (										//if recursive call
			'undefined' === typeof(t) ||
			'undefined' === typeof(r) ||
			'undefined' === typeof(b) ||
			'undefined' === typeof(l) ||
			'undefined' === typeof(w) ||
			'undefined' === typeof(h)
		) {
			t = el.offsetTop;
			l = el.offsetLeft;
			b = t + el.offsetHeight;
			r = l + el.offsetWidth;
			w = el.offsetWidth;
			h = el.offsetHeight;
		}
		if (p && checkParents) 						//continue if parent
		{											//and checking offset and not display:none
			if (styles.includes('offsets') && reasons.display != null)		
			{										//if parent can hide children
				if ('hidden' === EZ.getStyle(p, 'overflow') || 'scroll' === EZ.getStyle(p, 'overflow')) 
				{									
					if (l + VISIBLE_PADDING > p.offsetWidth + p.scrollLeft	//el right of parent
					|| l + w - VISIBLE_PADDING < p.scrollLeft				//el left of parent
					|| t + VISIBLE_PADDING > p.offsetHeight + p.scrollTop	//el under parent
					|| t + h - VISIBLE_PADDING < p.scrollTop)				//el above parent
					{
						_isWhy(el, 'offsets', true);
					}
				}
				if ( el.offsetParent === p ) 		//Add parent left/top coords to el offset:
				{
					l += p.offsetLeft;
					t += p.offsetTop;
				}
			}
			_isHidden(p, t, r, b, l, w, h);			//recursively check upwards
		}
		if (why.length)
			reasons.unshift( {el:el, why:why} );
	}
	//==============================================================================================	
	_isHidden(this);
	if (isVisible)
		return reasons.length === 0
	
	if (reasons.length === 0)
		return false;
		
	if (checkParents)
		return reasons;

	return reasons[0].why;
}
/*--------------------------------------------------------------------------------------------------
returns chrome debugger watch type-like formatted String

	<div#someId.someClass>[#n/#e]	#n is number or nodes if any -- #e element nodes

Uses EZ.format.Element() if extract argument not defaultValue or any other arguments supplied.

EZ.format.defaultElement.value (boot.js variant) defines default argument value.

NOTE:
	may get called by EZ.format.value() bootstrap code before all other script loaded
	most like scenario is EZ.log() call to EZ.format.value() while page loads. 

02-10-2017: stripped original code used as base for EZ.format.Element -- only do as described above.
--------------------------------------------------------------------------------------------------*/
Element.prototype.toString = function toString_Element_EZprototype(extract, options) 
{
	var el = (this instanceof Object) ? this : this + '';	//in case this is not Element/Object
	
	var defaultValue = 'EZ.format.toStringElement.defaultValue'.ov();	
	if (extract === undefined)
		extract = defaultValue;

	if (!defaultValue || !extract || extract == 'native')	//use native Element.toString()	
		return Object.prototype.toString.call(el);

	var extractKeys = 'className id name tagName type';		//only recognized attributes here
	
	var attributes = EZ.format.toStringElement.defaultAttributes.split(/\s+/).sort().join(' ');
	if (attributes != extractKeys 
	|| arguments.length > 1 || extract != defaultValue)		//if un-recognized attr or extract value
	{														//...call EZ.format.Element() if available
		if (EZ.format.Element)
			return EZ.format.Element(el, extract, options);
	}														//...otherwise do our best
															
	//extractKeys.push('tagName');							
	var json = JSON.stringify(this, extractKeys.split(/\s+/), 4)
	var obj = JSON.parse(json);
	
	//var tagClose = el.outerHTML.substr(-2);	//chrome does not keep
	//if (tagClose.substr(0,1) != '/') 
	//	tagClose = tagClose.substr(1);
	
	var tag = '<' + obj.tagName.toLowerCase()
			+ (obj.id ? '#' + obj.id : '')
			+ (obj.className ? '.' + obj.className.replace(/ /g, '.') : '')
	//		+ tagClose;
	
	var nodeCount = el.childNodes.length;
	var children = el.children.length;
	tag += (nodeCount === 0) ? '/>'
		 : (nodeCount == children || children === 0) ? '>[' + nodeCount + ']'
		 : '>[' + nodeCount + ':' + children + ']'
	//	 :  '>[' + nodeCount + ']'
	
	return tag;
}
//______________________________________________________________________________________________
Element.prototype.valueOf = function valueOf__Element_EZprototype() 
{
	return Element.prototype.toString.apply(this, [].slice.call(arguments));
}
//==============================================================================================
Error.prototype.stackTrace = function EZstackTrace(caller, options) {
//______________________________________________________________________________________________
/**{
returns EZstackTrace Object created from Error.stack which includes caller function name, formatted
stack trace including lineno and filename -- toString() return Object dotName when if stack shows
caller as member of another Object or function name if not.

ARGUMENTS:
	caller		(optional) if omitted, returns info for immediate caller of our caller
				(Function) return properties for specified function name if found on stack
				(Number) return caller n calls before our caller (=0 for our caller)
			
	exclude		Array or delimited String of functions and/or function names to skip -- blank to 
				ignore anounmous functions -- returns info for 1st fn on stack not skipped.
				
RETURNS:
	EZ.caller() Object with stackTrace starting specified caller if found otherwise full stack.
	if specified function or function name not found, returns info for 1st function on stack.

REFERENCES:
	Idea inspired from url below -- but code is refactored EZ.formatStack()
	http://stackoverflow.com/questions/29572466/
		how-do-you-find-out-the-caller-function-in-javascript-when-use-strict-is-enabled
________________________________________________________________________________________________
}**/										
	"use strict";
	var msg, 
		error = this,
		stackLines = [],					//Array of properties for line of stack
		defaultStackLine = function(values, stackIdx) 
		{
			values = values || {};
			var obj = {},
				strings = 'prefix suffix name asName dotName filename line lineno url',
				arrays = 'names';
			
			if (values instanceof Object)
			{
				strings.split(/\s+/).forEach(function(k) {obj[k] = values[k] || ''});
				arrays.split(/\s+/).forEach(function(k) {obj[k] = values[k] || []});
			}
			obj.anonymous = values.anonymous;			
			obj.stackIdx = stackIdx;
			return obj;
		},
		message = [],						//message from stack 
		stack = '',							//error.stack with message removed
		stackOriginal = '',					//orig stack with message unless new stack created
		stackNoExclude = [],				//formatted stack -- top lines removed but none excluded
		
		stackTrace = [], 					//formatted stack -- filename only
		stackTraceConsole = [],				//formatted stack with url:line:col
		stackTraceHTML = [],				//html with <a href=console.log(url:line:col)...

		log = [],
		_log = function(msg)
		{
			log.push(msg);
			message += '\n...' + msg;
		}	
	//==============================================================================================
	var _MAIN = function()					//main code on top as debugger convenience
	{
		try
		{
			stackOriginal = stack;
			_formatStack();
			_processCalls();
		}
		catch (e)
		{
			msg = e + '\n...formatting stack' 
			_log(msg + ': returned original un-filtered stack');
			
			stackLines = [defaultStackLine()];
			stack = stackOriginal 
				  = (stackOriginal || new Error(msg + '...\n').stack);
			stackTrace = stackTraceHTML = stackNoExclude = stackTraceConsole = stack.split('\n');
		}
		//========================
		return new EZstackTrace();
		//========================
	}
	//______________________________________________________________________________________________
	/**
	 *	extract message from stack if any -- parse and reformat
	**/
	var _formatStack = function()
	{											//remove message from stack if any
		stack = stack.replace(/([\s\S]*?)\n(\s*at )/, function(all, msg, at)
		{
			if (!all.includes('at '))				
			{									
				if (msg)
					message.push(msg);
				return at;
			}
			return all;
		});
		var fn = {},
			stackIdx = 0,									
			pattern = /^\s*at (new |[\w_$]+\.)?(.*?)( .*?(([\d:]*)\))|[\d:]*$)/gm;
												//parse stack via replace -- fill Arrays
		stack = stack.replace(pattern, function(all, pre, name, url, skip, line)
		{											
			var filename, anonymous = false, asName = '', prefix = '';	
			if (name.includes('anonymous'))			
			{
				line = url;
				url = ''
				name = 'anonymous'
				anonymous = true;
			}
			else if (name.includes('://'))
			{
				line = url;
				url = name
				name = ''
			}
			else 
			{
				url = url.replace(/\s*(\[as (.*)\]\s*)?\((.*\/.*?)[\d:]*\)/, function(all, skip, as, url)
				{
					asName = (as) ? as : '';
					return url;
				});
			}
			filename = url.replace(/.*\/(.*)/, '$1');
			if (!filename)
				line = '';
			var lineno = line.replace(/:(\d*):.*/, '$1').trim();
			
			var flag = '';
			if (!fn.name && !line)				//use prior line url and line
			{									//|| url.includes('(native)'))		
				flag = '...';
				fn = defaultStackLine(fn, stackIdx++)
				stackLines.pop();
				stackTrace.pop();
				stackTraceHTML.pop();
			}
			else
			{
				fn = {									
					filename: filename, 
					line: line,
					lineno: (lineno !== '') ? Number(lineno) : '',
					url: url
				}
				fn = defaultStackLine(fn, stackIdx++)
			}
			
			pre = (pre || '');					//ignore pre if native and pre.name is not
			if (pre == 'new ')
			{
				prefix = pre;
				pre = '';
			}
			else if (pre)
			{
				pre = pre.slice(0,-1);
				while ((window[pre] || '').toString().includes('[native'))
				{
					anonymous = true;
					if ((window[pre][name] || '').toString().includes('[native'))
						break;
					if ((window[pre].prototype && window[pre].prototype[name]))
						break;
					pre = prefix = '';
				}
				if (pre) pre += '.';
			}
			
			if (name)
			{
				fn.prefix = prefix;
				fn.suffix = '()';
				fn.anonymous = anonymous;
				
				fn.name = name;
				fn.dotName = pre + (asName || name);
				if (asName) 
					fn.asName = pre + asName;
					
				fn.names = [name];
				if (pre) fn.names.push(pre+name);
				if (asName && asName != name) 
				{
					fn.names.push(asName);
					if (pre) fn.names.push(pre+asName);
				}
			}			
			stackLines.push(fn);
														//reformat stack trace
			msg = 'at ' + fn.prefix + fn.dotName
				+ '\t ' + (fn.lineno ? fn.lineno.pad(-5,'~') + '.' : '~'.dup(6))
			stackTrace.push(msg + fn.filename);
			
			var script = 'void(' 
					   + (fn.filename ? "console.log('" + fn.url + fn.line + "')" : "0") 
					   + ')'
			var link = '<a href="javascript:' + script + '">' + fn.filename + '</a>';
			stackTraceHTML.push(msg + link);
			
			msg = (!fn.dotName) ? msg.replace(/^at/, '...') + filename
				: (flag) ? 'at ' + fn.prefix + fn.dotName + ' \t~~...'
				: msg + fn.filename;
			
			stackNoExclude.push(msg);
			stackTraceConsole.push(msg + ' \t' + fn.url + fn.line);
			//stackTraceConsole.push(fn.dotName + ' \t' + fn.url + fn.line);

			[stack]	//watch: stackTrace.format().join('\n').replace(/~/g, ' ').split('\n')
			return '';
		});
	}
	
	//______________________________________________________________________________________________
	/**
	 *	skip top stack calls if skip count or starting function or fn name specified
	 *	remove stack calls anywhere matching any name in the excludeList
	**/
	var _processCalls = function()						//---------------------------------------\\
	{													//determine if any calls on stack skipped \\
		var	skipToIdx = 1,								//-----------------------------------------\\
			skipToName = '',
			skipAnonymous = false,						//skip anonymous at top of call stack
			excludeCalls = [],
			excludeRegEx = options.excludeRegEx = [],
			excludeNames = options.excludeNames
						 = (options.exclude instanceof Array) ? options.exclude.slice() 
						 : (options.exclude && window.EZ && EZ.toArray) ? EZ.toArray.call(options.exclude, ', ') 
						 : (typeof(options.exclude) == 'string') ? options.exclude.split('\n') 
						 : [];
		excludeNames.forEach(function(fn, idx)
		{
			(fn instanceof RegExp)		? excludeRegEx.push(fn) :
			(typeof(fn) == 'function') 	? excludeNames[idx] = fn.name :
			(fn == 'anonymous')         ? '' :
			(typeof(fn) == 'string') 	? excludeNames[idx] = fn : 
										_log('ignored invalid exclude name type: ' + typeof(fn));
		})
		
		if (typeof(caller) == 'function')
			 skipToName = caller.name;
		else if (!isNaN(caller))
			skipToIdx = Math.min(0, Number(caller) + 1);
		else if (typeof(caller) == 'string') 
			skipToName = caller;
		
		if (skipToIdx >= stackLines.length)
			_log('ignored skip count[' + skipToIdx + '] -- exceeds stack size[' + stackLines.length + ']');
		else if (skipToIdx)
		{
			stackLines.splice(0,skipToIdx);
			stackTrace.splice(0,skipToIdx);
			stackTraceHTML.splice(0,skipToIdx);
		}
		skipToIdx = 0;									//-------------------------------\\						
		for (var idx=0; idx<stackLines.length; idx++)	//find skipped and excluded calls \\
		{												//---------------------------------\\
			var stackItem = stackLines[idx];
			if (skipToName && stackItem.names.includes(skipToName))
			{											
				skipToName = '';						//found 1st call
				skipToIdx = idx;
			}
			var isExcluded = stackItem.names.some(function(name)
			{											//check if any name is excluded
				return excludeNames.includes(name);
			});
			isExcluded = isExcluded || excludeRegEx.some(function(regex)
			{											//check if any regex excludes any name
				return stackItem.names.some(function(name)
				{
					return regex.test(name);
				});
			});
			if (isExcluded 
			|| (stackItem.anonymous && skipAnonymous))
			{
				skipAnonymous = true;					//skip anonymous between excluded calls
				excludeCalls.push(idx);
			}
			else skipAnonymous = false;
		}
		if (skipToName)
			_log('ignored skip to name "' + skipToName + '" -- not found');
		
		if (excludeCalls.length < stackLines.length)
		{												//remove excluded calls if not all calls
			while (excludeCalls.length)
			{
				idx = excludeCalls.pop();
				stackLines.splice(idx,1);
				stackTrace.splice(idx,1);
				stackTraceHTML.splice(idx,1);
			}
		}
		else if (excludeCalls.length)
		{
			stackLines.length = stackTrace.length = stackTraceHTML.length = 0;
			_log('all stack calls excluded');	
		}
	}
	//______________________________________________________________________________________________
	/**
	 *	create EZstackTrace Object
	**/
	function EZstackTrace()				
	{
		var obj = stackLines[0] || defaultStackLine();
		obj["~name"] = 'EZstackTrace';
		
		obj.callerName = obj.name;
		obj.displayName = obj.dotName;

		obj.options = options;
		
		log = log.join('\n').trim();
		if (log)
			log = 'Error.EZstackTrace()...' + log;
		obj.log = log
		
		message = message.join('\n');
		obj.message = message.trim();
		
		stack = stackTrace.format().join('\n').replace(/~/g, ' ').trim(); 
		obj.stackLines = stack.split('\n');
		obj.stack = message + stack;
		obj.stackTrace = stack;		
		obj.original = stackOriginal;
		obj.console = stackTraceConsole.format().join('\n').replace(/~/g, ' ').trim();
		
		var idx = obj.stackIdx
		if (stackNoExclude[idx])
			stackNoExclude[idx] = stackNoExclude[idx].replace(/^at (.*?)(?=\t )/, '==>$1<==');
		obj.console = stackNoExclude.format().join('\n').replace(/~/g, ' ').trim();
		
		obj.html = obj.debug = stackTraceHTML.format().join('\n').replace(/~/g, ' ').trim()
				 + '<details style="margin:5px 0 0 0">'
				 + '<summary>un-filtered stack ('+ stackNoExclude.length +' lines)</summary>'
				 + obj.console.wrap('<div class="pre">')
				 + '</details>';
		//______________________________________________________________________________
		obj.valueOf = function(format)
		{
			return this.toString(format);
		}
		//______________________________________________________________________________
		/**
		 *	=undefined or null:	returns options.format if defined else "stack" which is
		 *						formatted stack prefixed with message if any
		 *	=blank or 0: 		returns "stackTrace" which is formatted stack w/o message
		 *	=Number, !isNaN: 	returns "stackTrace" with starting at line [Number]
		 *						if negitive returns last [Number] lines
		 *	any other:			returns coresponding property if found else same as null
		**/
		obj.toString = function(format)
		{
			format = (format == null) ? this.options.format || 'stack'
				   : (!isNaN(format)) ? Number(format)
				   : (!format) ? 'stackTrace'
				   : format || '';
			
			if (typeof(format) == 'number')
				this.stackLines.slice(format);
				
			return this[format] || this[format.toLowerCase()] || this.dotName;
		}
		//______________________________________________________________________________
		if (g) g.st = obj;
		if (log)
			console.log(log, {stack: {formatted:obj.console, original:obj.original}});
		return obj;
	}
	//==============================================================================================
	if (arguments < 2 && caller instanceof Object && !caller.stack)			
	{												
		options = caller;							//1st arg is options
		caller = '';
	}
	options = (options instanceof Array) ? {exclude: options}
			: (options instanceof Object) ? options
			: (options && window.EZ && EZ.options) ? EZ.options.call(options) 
			: {};	
	
	var skip = 2;
	if ( !(error instanceof Error) )				//called by another function: e.g. EZgetCaller()
	{												//...will be used by many more legacy functions
		skip = 3;
		error = caller;
		options.format = options.format || (this && this.format) || '';
	}
	if (error instanceof EZstackTrace
	|| (error instanceof Object && error["~name"] == 'EZstackTrace'))
	{												//TODO: check for diff options
		return error;								//existing EZstackTrace Object
	}
	if (error instanceof Object)
	{
		stack = (error.stack instanceof Array) ? error.stack.join('\n') 
			  : (typeof(error.message) == 'string') ? error.message.split('\n') 
			  : '';
		message = (error.message instanceof Array) ? error.message 
				: (typeof(error.message) == 'string') ? error.message.split('\n') 
				: [];
	}

	msg = 'no stack';
	stack = (stack instanceof Array) ? stack.join('\n') : stack + '';
	if (stack && !/\n\s*at /.test(stack))
	{
		msg = 'un-recognized stack';
		stack = '';
	}
	if (!stack)
	{											
		stack = new Error().stack.split('\n');		//create new stack -- remove message and
			stack = stack.slice(skip).join('\n');	//...EZstackTrace() if called by another fn
		if (skip != 3)
			_log(msg + ': using new Error().stack');
	}
	//=================
	return _MAIN();
	//=================
}
/*--------------------------------------------------------------------------------------------------
TODO:
Element.prototype.onEnterKey = function() 
{
    'use strict';
    return true;
}
--------------------------------------------------------------------------------------------------*/
