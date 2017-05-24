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
String.prototype.ov = function ovEZprototypeString(o, defaultValue)
{
	//if (EZ.test.capture()) {return EZ.test.capture(this)} else if (EZ.test.debug()) debugger;
	var o, defaults;
	var obj;			//initialized by 1st set of properties -- does not change
	var value = true;	//return value of 1st set of properties found with null/undefined value
						//...used if no set of properties is not null or undefined
	
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
	if (sets.some(function(set)
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
				defaults = defaultValue != null 
						   && typeof(defaultValue) == 'object' 			//...unless object with...
						   && ['','null','undefined'].some(function(p)	//...one of these properties
						   {
								if (p in defaultValue) return true;
						   });
			}
			args = '';			//clear args -- only processed once
		}
		if ('object function'.indexOf(typeof o) == -1)
		{						//object null, undefined or NOT object -- quit some
			o = undefined;
			return true;
		}
		//-----------------------------------------------------------------------
		// specified object found if o is not undefined when first arriving here
		//-----------------------------------------------------------------------
		while (o !== undefined)			//1st or next property found if defined
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
			else if (!(keys[0] in o))	//next key missing...
			{							//---------------------------------------------
				if (initializeValue)	//if initialize, set property from defaultValue
					o = o[keys.shift()] = setDefaultValue(set, keys);
				else					//----------------------------------------------
					return false;		//otherwise try next set of properties if any
			}
			else
				o = o[keys.shift()];	//next property exists...

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
	else if (defaultValue !== undefined)
		return defaultValue				//else return single defaultValue if specified

	return value !== true				//else if property found with null/undefined value
		 ? value						//...return value
		 : undefined					//otherwise return undefined

	//________________________________________________________________________________________
	/**
	 *	TODO: need to match object level
	 */
	function setDefaultValue(/*TODO: set, keys*/)	
	{
		return defaultValue;	
	}

}
