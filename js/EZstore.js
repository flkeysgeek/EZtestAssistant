/*--------------------------------------------------------------------------------------------------
Dreamweaver LINT options -- function below not called
--------------------------------------------------------------------------------------------------*/
/*global 
	EZ, e:true, g, dw, DWfile
*/

var e;
(function jshint_globals_not_used() {	//global variables and functions defined but not used
e = [
	e, g, dw, DWfile
]});
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
EZ.store = function EZstore(key)
{
	key = (key || '_').trim();
	this.origKey = key;
	
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
	 *	TODO: list
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
		(this.type == 'local') ? localStorage.removeItem(this.fullkey)
							   : sessionStorage.removeItem(this.fullkey);
	}
	/**
	 *	save specified value for key
	 */
	this.save = function EZstoreSave(value)
	{
		(this.type == 'local') ? localStorage.setItem(this.fullkey, value)
							   : sessionStorage.setItem(this.fullkey, value);
		var val = EZ.store.get(this.origKey, value);
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
EZ.store.set = EZ.storeSet = function EZstore_set(key, value)
{
	var store = new EZ.store(key);
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
EZ.store.remove = function EZstore_remove(key)
{
	var store = new EZ.store(key);	
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
