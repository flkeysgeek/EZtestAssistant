/*global EZ, g, dw, DWfile */
var e;
(function jshint_globals_not_used() {	//list global variables and/or functions defined but not used
	e = [e, g, dw, DWfile]
})
/*--------------------------------------------------------------------------------------------------
http://javascriptissexy.com/javascript-apply-call-and-bind-methods-are-essential-for-javascript-professionals/
// Credit to Douglas Crockford for this bind method
--------------------------------------------------------------------------------------------------*/
if (!Function.prototype.bind) 
{	
	/*TODO:
	Function.prototype.bind = function (oThis) {
		if (typeof this !== "function") {
			// closest thing possible to the ECMAScript 5 internal IsCallable function
			throw new TypeError ("Function.prototype.bind - what is trying to be bound is not callable");
		}

		var aArgs = Array.prototype.slice.call (arguments, 1),
				fToBind = this,
				fNOP = function () {
				},
				fBound = function () {
					return fToBind.apply (this instanceof fNOP && oThis
							? this
							: oThis,
							aArgs.concat (Array.prototype.slice.call (arguments)));
				};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP ();

		return fBound;
	};
	*/
}
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
		var obj = eval(results[2]);
		if (obj.prototype[name]) return true;

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
if (EZ.createPrototype(function addSuffixEZprototypeNumber()
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
Number.prototype.addSuffix.test = function()
{
	var number = 1234;
	EZ.test.run(number,			{EZ: {ex:'1234th'}})
}
/*---------------------------------------------------------------------------------------------
Clip end of string by specified number of char (default: 1)
---------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function clipEZprototypeString(nochar)
{
	if (nochar == EZ.undefined) nochar = 1;
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
			if (!EZ.isEmpty(obj))

--------------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function cloneEZprototypeObject(options /*maxdepth*/, depth, dotName)
{
	//if (EZ.test.capture()) {return EZ.test.capture(this)} else if (EZ.test.debug()) debugger;

	var obj = this;
	if (!obj || 'object function'.indexOf(typeof(obj)) == -1) return obj;

	//----- initialize options and depth if top level
	if (dotName == EZ.undefined)
	{
		depth = depth || 0;
		dotName = '';
		options = typeof(options) == 'number' ? {maxdepth: options}
				: typeof(options) == 'object' && !null ? options
				: {}
		options.topDepth = depth;
		options.maxdepth = options.maxdepth || 9;
		options.objectsProcessed = [];
		options.clonedObjects = [];
		options.pendingClones = [];
		options.counter = 0;
	}
	if (++options.counter > 99) undefined.EZclone;
	if (EZ.quit) return obj;

	var clone = typeof(obj) != 'function' ? obj.constructor()
			  : eval('clone=' + obj.toString());

	//----- clone all enumerable Object properties
	Object.keys(obj).forEach(function(p)
	{
		var idx;
		var key = dotName + '.' + p;
		if (obj[p] instanceof Object === false)
			clone[p] = obj[p];							//copy value if not Object

		else if ((idx = options.objectsProcessed.indexOf(obj[p])) != -1)
		{												//if repeated object . . .
			if (idx < options.clonedObjects.length
			&& options.clonedObjects[idx] != EZ.undefined)
				clone[p] = options.clonedObjects[idx]		//use prior clone if found
			else
				options.pendingClones[idx] = key;			//or add to pendingClones list
		}
		else											//otherwise . . .
		{
			options.objectsProcessed.push(obj[p]);			//add to objectsProcessed list

			clone[p] = obj.childNodes
					 ? EZ.cloneNodes(obj)					//html node
					 : obj[p].clone(options, depth+1, key); 	//object

			idx = options.objectsProcessed.indexOf(obj[p])
			if (idx != -1 									//safety for unexpected
			&& options.clonedObjects[idx] == EZ.undefined) 	//if clone not yet saved...
				options.clonedObjects[idx] = clone[p];		//...save for pendingClones
		}
	});

	//----- if top level, populate pendingClones if any
	if (options.topDepth == depth)
	{
		options.pendingClones.forEach(function(key, idx)
		{
			if (!key || options.clonedObjects[idx] == EZ.undefined) return;
			var keys = key.split('.')
			var repeatKey = keys.pop();
			var repeatObj = keys.join('.').ov(clone);

			if (repeatObj instanceof Object
			&& !(repeatObj[repeatKey] in repeatObj))
				repeatObj[repeatKey] = options.clonedObjects[idx];
			else
				void(0);	//debugger breakpoint
		});
	}
	//============
	return clone;
	//============
}))
//_____________________________________________________________________________________________
Object.prototype.clone.test = function()
{
	var ex, ctx, json, note, obj, arr;

	// #1
	ex = {a:1, b:2, arr: [1,2]};
	obj = ex;
	note = 'Object with embedded Array'
	EZ.test.run(ex, 								{EZ: {ex:ex, ctx:ex, note:note}})
	//_______________________________________________________________________________

	// #2
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
	EZ.test.run(ex, 								{EZ: {ex:ex, ctx:ex, note:note}})
	//_______________________________________________________________________________

	// #3
	ex = EZ.test.data.fn
	note = 'function with named properties'
	EZ.test.run(ex, 								{EZ: {ex:ex, ctx:ex, note:note}})
	//_______________________________________________________________________________

	// #4
	arr = [1,2];
	ex = {a:1, b:2, arr:arr, repeat:arr};
	note = 'Object with repeated property'
	EZ.test.run(ex, 								{EZ: {ex:ex, ctx:ex, note:note}})
	//_______________________________________________________________________________

	// #5
	arr = [1];
	ex = {a:1};
	ex = ex.circular = ex;
	note = 'Object with circular property'
	EZ.test.run(ex, 								{EZ: {ex:ex, ctx:ex, note:note}})
	//_______________________________________________________________________________
return;

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
	var span = document.createElement('span');
	var divObj = {d:div}
	var bothObj = {d:span, s:span}

	EZ.test.run(divObj, 		{EZ: {ex:{d:div},       	note:''	}})
	EZ.test.run(bothObj, 		{EZ: {ex:{d:div, s:span},	note:''	}})

	var fn = function cloneTest(a,b) {return a*b}
	var results = EZ.test.run(fn, 		{EZ: {ex:fn,       	note:''	}})
	
	/* TODO: jshint: future vars - now unused */ e = [bothObj, results]	
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
	char = (typeof(char) == 'number') ? String.fromCharCode(char) : char;
	start = (!isNaN(start) && start > 0) ? start : 0;
	end = (!isNaN(end) && end > 0) ? end : this.length;

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
	if (str == null || str == EZ.undefined)
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
	if (str == null || str == EZ.undefined)
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

	//______________________________________________________________________________
	return //testend
}
/*--------------------------------------------------------------------------------------------------
Array.format(options)


ARGUMENTS:
	this		(Array)

	options		(optional) 	Object containing one or more of the following properties:
				how:	'seq' default

RETURNS:
	String formatted as decsribed above.
--------------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function formatEZprototypeArray(options)
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
}))
//_____________________________________________________________________________________________
Array.prototype.format.test = function()
{
	var arg, obj=null, ctx, ex, exfn, note = '';
	/*  jshint: future vars */	e = [arg, obj, ctx, ex, exfn, note];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
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

	if (EZ.stripConfigPath)
		stack = EZ.stripConfigPath(stack);
	else
		stack = stack.replace(/(http:.*?)\/(?=\w+\.(js|htm|html|php|jsp|asp))/g, '.../');
	if (EZ.stripUrlParameters)
		stack = EZ.stripUrlParameters(stack);

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
/*--------------------------------------------------------------------------------------------------
Object.keys
returns Array of owner properties for an Object

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
--------------------------------------------------------------------------------------------------*/
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
String.prototype.matchPlus = function matchPlus(regex, groupLabels, length)
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
/*---------------------------------------------------------------------------------------------
Object.ov(key,[defaultValue])
---------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function ov(key, defaultValue)
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

			if defaultValue is Object with 'null', 'undefined' and/or '' if specified default for
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
		if (o != EZ.undefined)		//falls thru if empty string (i.e. String starts with dot)
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
		while (o != EZ.undefined)			//1st or next property found if defined
		{
			if (!keys.length)
				return true;			//SUCCESS -- quit while AND sets loop
			var key = keys[0].match(/^\[(.*)\]/)
			if (key)
			{							//next key is Array contents
				key = isNaN(key[1]) ? key[1] : parseFloat(key[1]);
				var idx = [].indexOf.call(o,key);
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
	else if (defaultValue != EZ.undefined)
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
return new Object with properties specified by keys removed.
--------------------------------------------------------------------------------------------------*/
if (EZ.createPrototype(function removePlusEZprototypeObject(keys)
{
	  //---------------------------\\
	 //----- called for Object -----\\
	//-------------------------------\\
	if (!EZ.isArray(this))
	{
		var keys = arguments[0];
		keys = !keys ? []
			 : EZ.isObject(keys) ? Object.keys(keys)
			 : EZ.toArray(keys, ', ');
			 
		var returnObj = EZ.mergeAll(this);
		keys.forEach(function(key)
		{
			delete returnObj[key];
		});
		return returnObj;
	}
	
	  //--------------------------\\
	 //----- called for Array -----\\
	//------------------------------\\
	return null;
}))
//_______________________________________________________________________________
Object.prototype.removePlus.test = function()
{
return;
	
	var obj, ex, note = '';
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	var array = [1,2];
	EZ.test.run(array);	

	//______________________________________________________________________________
	obj = {a:1, b:2, c:3}
	ex = EZ.mergeAll(obj);
	delete ex.a;
	delete ex.b;
	
	EZ.test.options( {ex:obj, note:note})
	EZ.test.run(obj)	
	
	EZ.test.options( {ex:ex, note:note})
	EZ.test.runs([obj, 'a  b'], [obj, 'a, b'], [obj, ['a','b']], [obj, {a:0, b:0}])	
	
	//______________________________________________________________________________
	EZ.test.skip(99999);
}
/*--------------------------------------------------------------------------------------------------
Array.remove([fromIndex][,toIndex] | [value, value,...], [array-of-values])
Object.remove(keys...)

For Object:
	return new Object with specified properties removed.

For Array:

return new Array with specified items removed -- original Array is unchanged.

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
if (EZ.createPrototype(function removeEZprototypeArray()
{
	if (EZ.test.capture()) {return EZ.test.capture(this)} else if (EZ.test.debug()) debugger;
	
	var rtnArray = this.slice();
	var values = arguments[0];
	var fromIndex = arguments[0];
	var toIndex = arguments[1];

	//----- Determine if removing values or slice
	if (!arguments.length)
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
/*---------------------------------------------------------------------------------------------
String.slice(start,end)
---------------------------------------------------------------------------------------------*/
String.prototype.slice = function sliceEZprototypeString(start,end)
{
	return EZ.substring(this,start,end);
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
if (EZ.createPrototype(function includesIgnoreCaseEZprototypeString(searchString, offset)
{
	searchString = (searchString != EZ.undefined ? searchString + '' : '').toLowerCase();
	return this.toLowerCase().indexOf(searchString, offset) != -1;
}))
//_______________________________________________________________________________
String.prototype.includesIgnoreCase.test = function()
{
}
/**
 *
 */
if (EZ.createPrototype(function containsEZprototypeString() /* alternative name */
{
	return String.prototype.indexOf.apply(this, arguments) != -1;
}))
//_______________________________________________________________________________
String.prototype.contains.test = function()
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
Number.prototype.toInt = function toIntEZprototypeNumber()
{
	return parseInt(this + 0.5);
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
		value = parseInt(value + 0.5);
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
	wrapLeft = wrapLeft != EZ.undefined ? wrapLeft : String.fromCharCode(8226);
	wrapRight = wrapRight != EZ.undefined ? wrapRight+'' : wrapLeft;
	return wrapLeft + this + wrapRight;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
EZ.global.setup('EZ', 'prototypes');
