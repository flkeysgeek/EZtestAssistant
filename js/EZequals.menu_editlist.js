/*--------------------------------------------------------------------------------------------------
EZ.equals(x, y [, options])

Determine if Objects (or variables) have equal values using following critera (scope can vary):

	Array		equal length, item values plus same owner named properties and values
	Objects 	same constructor and owner properties, with same typeof and equal values
	Function 	same critera as Object plus same name and script (excluding comments)
	RegExp		same flags and source pattern -- lastIndex can vary
	Date		same date and time zone -- i.e. same getTime() and getTimeZoneOffset()
	other		equal if same typeof and value -- primitive and non-primitive equal

ARGUMENTS:
	x, y		specifies Objects or variables compared

	options		(optional) one or more of the following properties:
	TODO
				strict		Objects
				depth
				scope
				arrayValues

			Array or delimited string (values separated by commas or spaces)

RETURNS:
	true if Objects or variables equal based on specified critera otherwise false

REFEERENCE:
	http://stackoverflow.com/questions/201183/how-to-determine-equality-for-two-javascript-objects/16788517#16788517

TODO:
	options
--------------------------------------------------------------------------------------------------*/
EZ.equals = EZ.isEqual = function EZequals(x, y, showDiff)
{
	var processedObj = {x:[], y:[]};	//only compare Objects once to avoid circular loop
	var matchedObj   = {x:[], y:[]};
	var unmatchedObj = {x:[], y:[]};
	var dotName = [];
	EZ.equals.log = [];

	var is = isEqualObjects(x, y, 0);

//	if (EZ.test.running == 'EZequals')
//		EZ.test.data.details = EZ.mergeAll({processedObj:processedObj, matchedObj:matchedObj, unmatchedObj:unmatchedObj});

	if (!EZ.equals.log.length)
		EZ.equals.log = '';

	else
	{
		EZ.equals.log = EZ.equals.log.format();
	}
	return is;

	/**
	 *	recursively called for each embedded or nested object not previously processed.
	 *
	 */
	function isEqualObjects(x, y, depth)
	{
		var rtnValue = false;

		while (!rtnValue)
		{
			if (x === null || x === undefined || y === null || y === undefined)
			{
				rtnValue = (x === y); 				//not both null or undefined
				break;
			}
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
					break;

				if ((x + '').trim() !== (y + '').trim())
					break;
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

			if (x instanceof Array)
			{
				if (x.length !== y.length)
					break;
			}

			// Date: date and time zone besides owner properties (e.g. EZ.date)
			if (x instanceof Date)
			{
				if (x.getTime() != y.getTime())
					break;						//different dates
			}

			// not Object: if they are strictly equal, they both need to be object at least
			if (!(x instanceof Object) || !(y instanceof Object))
				break;


			if (getType(x) != getType(y))
				break;

			//------------------------------------------
			// embedded object properties equality check
			//------------------------------------------
			var keys = Object.keys(x);
			var keysOther = Object.keys(y);
			if (getType(x) != 'array')
			{
				keys.sort();
				keysOther.sort();
			}
			if (keys.join('.') != keysOther.join('.'))
			{												//keys DO NOT must match
				if (!showDiff)
					break;									//quit if not logging diff

				if (getType(x) == 'array')					//use highest # of keys
					keys = x.length < y.length ? keysOther : keys;

				else
				{
					keysOther.forEach(function(key)			//get combined list of keys
					{
						if (keys.indexOf(key) == -1)
							keys.push(key);
					});
					keys.sort();
				}
			}

			keys.every(function(key)						//for every key until false returned . . .
			{
				//if (EZ.test.debug('EZequals')) debugger;

				dotName.push(key);
				do											//for function or object properties . . .
				{
					if (!(x[key] instanceof Object))
					{
						rtnValue = isEqualObjects(x[key], y[key], depth+1);
						break;
					}

					if (x[key] == y[key])
						return true;							//equal if same Object

					e = getObjectIdx;
					/*
					if (!showDiff && EZ.test && EZ.test.running != 'EZequals')
						break;								//skip repeat logic UNLESS TESTING

					var i = getObjectIdx('x', x[key]);		//index of processed x Objects
					if (matchedObj.x[i].includes(y[key]))
						return true;							//previously matched y[key]
					if (unmatchedObj.x[i].includes(y[key]))
						return false || showDiff;				//previously did NOT match y[key]

					var j = getObjectIdx('y', y[key]);		//index of processed y Objects
					if (matchedObj.y[j].includes(x[key]))
						return true;							//previously matched x[key]
					if (unmatchedObj.y[j].includes(x[key]))
						return false || showDiff;				//previously did NOT match y[key]
					*/

					rtnValue = isEqualObjects(x[key], y[key], depth+1);

					//if (!isEqual)
					//	logDiff(x[key], y[key]);

					/*
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
						return  || showDiff;				//previously did NOT match y[key]
					}
					*/
				}
				while (false)

				dotName.pop();
				return rtnValue || showDiff;
			});
			if (rtnValue)
				return true;
			else
				break;
		}
															//log if showDiff enabled
		while (!rtnValue && showDiff)	// )
		{
			if (getType(x) == getType(x)
			&& typeof(x) == 'object' && typeof(y) == 'object')
				break;										//already reported

			if (showDiff !== true)							//heading if not true
			{
				console.log(showDiff);
				showDiff = true;
			}
			var key = dotName.join('.');
			key = key ? '.' + key : '';
			key = key.replace(/\.(\d+)\b/, '[$1]');
			var msg = typeof(x) != typeof(y) && x != null && y != null

					? 'typeof(x' + key + '):\t' + typeof(x) + '\n'
					+ 'typeof(y' + key + '):\t' + typeof(y)

					: 'x' + key + ':\t' + x + '\n'
					+ 'y' + key + ':\t' + y;

			console.log('\t' + msg.replace(/:\t/g, ': ').replace(/\n/g, ' \t '));
			//console.log('\t' + msg);

			msg = msg.split('\n');
			EZ.equals.log.push(msg[0], msg[1], ' ');	//{key:dotName, x:x, y:y}
			break;
		}
		return rtnValue;
	}
	/**
	 *	keep Array of all compared Objects
	 */
	function getObjectIdx(xy, obj)
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

	/**
	 *
	 */
	 function getType(value)
	 {
		var type = value === null ? 'null'
			 : typeof(value) == 'object' && value.constructor == Array ? 'array'
			 : typeof(value);
	 	return type
	 }
}
