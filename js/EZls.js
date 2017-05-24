/*--------------------------------------------------------------------------------------------------
LINT options -- function below not called
--------------------------------------------------------------------------------------------------*/
/*global 
	EZ:true, e:true, g, dw:true, DWfile,
	EZgetPref, EZgetEl, EZgetValue, EZsetValue, EZnone

*/

(function jshint_globals_not_used() {	//list global variables and functions defined but not used
if (typeof(window) != 'undefined') window.dw = {isNotDW: true}
e = [
	e, g, dw, DWfile, 
	EZgetPref, EZgetEl, EZgetValue, EZsetValue, EZnone
]})
if (typeof(EZ) == 'undefined') EZ = {};
if (typeof(dw) == 'undefined') dw = {isNotDW: true}
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
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/

