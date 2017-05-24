/*--------------------------------------------------------------------------------------------------
created 11-01-2016 for legacy functions to reduce bloat in non-legacy js files
--------------------------------------------------------------------------------------------------*/

//	Dreamweaver LINT global references and definitions not used here are below:
/*global 
EZ, DWfile, 

e:true, g:true, dw:true, f:true
*/
var e;			//global var for try/catch
(function() {[	//global variables and functions defined but not used

e, f, g, dw, DWfile ]});

/*--------------------------------------------------------------------------------------------------
EZ.equals(x, y [, showDiff])												legacy as of: 11-01-2016

Determine if Objects (or variables) have equal values using following critera (scope can vary):

	Array		equal length, item values plus same owner named properties and values
	Objects 	same constructor and owner properties, with same typeof and equal values 
	Function 	same critera as Object plus same name and script (excluding comments)
	RegExp		same flags and source pattern -- lastIndex can vary
	Date		same date and time zone -- i.e. same getTime() and getTimeZoneOffset()
	other		equal if same typeof and value -- primitive and non-primitive equal

ARGUMENTS:
	x, y		specifies Objects or variables compared
	
	showDiff	(optional) any true value to show 1st difference on javascript console

RETURNS:
	true if Objects or variables equal based on specified critera otherwise false

REFEERENCE:
	http://stackoverflow.com/questions/201183/how-to-determine-equality-for-two-javascript-objects/16788517#16788517
--------------------------------------------------------------------------------------------------*/
EZ.equals.legacy = function EZequals_legacy(x, y, showDiff)
{
	var processedObj = {x:[], y:[]};	//only compare Objects once to avoid circular loop
	var matchedObj   = {x:[], y:[]};
	var unmatchedObj = {x:[], y:[]};
	var dotName = [];

	/**
	 *	keep Array of all compared Objects
	 */
	var getObjectIdx = function(xy, obj)
	{
		var idx = processedObj[xy].indexOf(obj)
		if (idx == -1)
		{
			idx = processedObj[xy].length;
			processedObj[xy].push(obj);
			matchedObj[xy].push([]);
			unmatchedObj[xy].push([]);
		}
		return idx;
	}
	
	var is = isEqualObjects(x, y, 0);
	
//	if (EZ.test.running == 'EZequals')
//		EZ.test.data.details = EZ.mergeAll({processedObj:processedObj, matchedObj:matchedObj, unmatchedObj:unmatchedObj});
	return is;

	/**
	 *	recursively called for each embedded or nested object not previously processed.
	 *	
	 */
	function isEqualObjects(x, y, depth)
	{
		if (x === null || x === undefined || y === null || y === undefined)
			return x === y; 					//not both null or undefined

		if (x.constructor !== y.constructor)
			return false;						//not both same constructor

		if (typeof(x) == 'number' && isNaN(x) && isNaN(y))
			return true;						//required because NaN === NaN is false

		// if they are functions, they should exactly refer to same one (because of closures)
		// NO: same name and script except comments (if comment stripper available)
		if (x instanceof Function)
		{
			//if (!x.name && x.name != y.name && x !== y)
			if (x.name !== y.name)
				return false;

			if ((x + '').trim() !== (y + '').trim())
				return false;
		}

		// if they are regexps, they should exactly refer to same one
		// (it is hard to better equality check on current ES)
		// NO -- only check flags and source patter properties -- NOT lastIndex
		if (x instanceof RegExp)
		{
			return x.global == y.global && x.ignoreCase == y.ignoreCase
				&& x.multiline == y.multiline && x.source == y.source;
			//return x === y;
		}

		if (x === y || x.valueOf() === y.valueOf())
			return true;							//both same object ??

		if (x instanceof Array && x.length !== y.length)
			return false;

		// Date: date and time zone besides owner properties (e.g. EZ.date)
		if (x instanceof Date)
		{
			if (x.getTime() != y.getTime())
				return false;						//different dates
		}
		
		// not Object: if they are strictly equal, they both need to be object at least
		if (!(x instanceof Object) || !(y instanceof Object))
			return false;

		//------------------------------------------
		// embedded object properties equality check
		//------------------------------------------
		var keys = Object.keys(x).concat(Object.keys(y)).removeDups();
		var is = keys.every(function(i)					//use is as debugger convenience
		{
			return i in x && i in y && typeof(x[i]) == typeof(y[i]);
		})
		if (!is && !showDiff)							//quit if keys do not match
			return false;

		//if (EZ.test.debug('EZequals')) debugger;
		is = keys.every(function(key)
		{
			while (x[key] instanceof Object)			//for function or object properties . . .
			{			
				if (x[key] == y[key]) return true;		//same Object
				
//if (!showDiff && EZ.test.running != 'EZequals') 
//	break;								//skip repeat logic UNLESS TESTING
//if (true) break;

				var i = getObjectIdx('x', x[key]);		//index of processed x Objects
				if (matchedObj.x[i].includes(y[key]))
					return true;						//...previously matched y[key]
				if (unmatchedObj.x[i].includes(y[key]))
					return false;						//...previously did NOT match y[key]

				var j = getObjectIdx('y', y[key]);		//index of processed y Objects
				if (matchedObj.y[j].includes(x[key]))
					return true;						//...previously matched x[key]
				if (unmatchedObj.y[j].includes(x[key]))
					return false;						//...previously did NOT match x[key]

				dotName.push(key);
				var isEqual = isEqualObjects(x[key], y[key], depth+1);
				dotName.pop();
				if (isEqual)
				{										//objects match -- remember for future
					matchedObj.x[i].push(y[key]);				
					matchedObj.y[j].push(x[key]);
					return true;
				}
				else
				{										//remember NOT matched
					unmatchedObj.x[i].push(y[key]);
					unmatchedObj.y[j].push(x[key]);
					return false;
				}
			}
			var isEqual = isEqualObjects(x[key], y[key], depth+1);
			if (!isEqual && showDiff)
			{
				var msg = 'x.' + key + ': ' + x[key] + '\t\ty.' + key + ': ' + y[key];
				console.log(msg);
			}
			return isEqual;
		});
		return is;
	}
}
/*--------------------------------------------------------------------------------------------------
As of 11-11-2016 only used by exfnLegacy -- changed to EZ.clone
--------------------------------------------------------------------------------------------------*/
EZ.test.jsonClone = function EZtest_jsonClone(obj, onlyKeys)
{
	switch (getType(obj))
	{
		case 'Null': 
		case 'Undefined': 
		case 'Boolean': 
		case 'String': 
		case 'Number':
			return obj;
		
		case 'Date':
			return new Date(obj);
		
		case 'RegExp':
			return cloneRegExp(obj)
		
		default:
			if (obj instanceof Object) break;
			return obj;
	}
	
	var clone = {};
	if (onlyKeys)
	{
		onlyKeys.forEach(function(key)
		{
			var value = obj[key];
			if (value == null) return;
			clone[key] = EZ.isObjectCircular(value) || value;
		});
		obj = clone
	}
	
	//var json = EZ.stringify(clone, '* -keys');	//has issue with unquoting object keys
	var json = JSON.stringify(clone, null, 4);	
	try
	{
		clone = eval(json);
	}
	catch (e)
	{
		clone = EZ.parse(json);
	}
	return clone;
	//________________________________________________________________________________________
	/**
	 *	
	 */
	function cloneRegExp(obj)
	{
		var clone = new RegExp(obj);
		clone.lastIndex = obj.lastIndex;
		return clone;
	}
	/**
	 *	
	 */
	 function getType(value)
	 {
		var type = Object.prototype.toString.call(value);
		type = type.substring(8,type.length-1)
	 	return type
	 }
}
