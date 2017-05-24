/*--------------------------------------------------------------------------------------------------
Dreamweaver LINT global references and definitions  not used here
--------------------------------------------------------------------------------------------------*/
/*global
EZ, DWfile,

e:true, g:true, dw:true, f:true
*/
var e;			//global var for try/catch
(function() {[	//global variables and functions defined but not used

e, f, g, dw, DWfile ]});
//__________________________________________________________________________________________________
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
