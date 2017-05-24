EZ.returnValueV3 = (function _____EZreturnValueV3_____()
{
	//______________________________________________________________________________________________
	/**
	 *	global closure variables -- data structures
	 *	returnValue Object has: _data, data and non-data functions and metaData ~*
	 *	_data.options 
	 *______________________________________________________________________________________________
	**/
	var data, log, options,
		fnName = arguments.callee.name; [fnName]
	//----------------------------------------------------------------------------------------------
	var defaultData = function(name) {		//default data properties
	//----------------------------------------------------------------------------------------------
	return {
		options: {},
		success: undefined,			//valueOf()		toString() if undefined
		returnValue: undefined,		//toString()	native toString() if undefined
		values: {},
		message: [],
		details: [],
		lists: {},
		info: {},
		"~name": (name || '') + '.data'
	}}
	//----------------------------------------------------------------------------------------------
	var defaultOptions = function(name) {
	//----------------------------------------------------------------------------------------------
	return {
		"~name": (name || '') + '.options'
	}}
	//----------------------------------------------------------------------------------------------
	var defaultLog = function() {
	//----------------------------------------------------------------------------------------------
	return {
		count: 0,
		sync: {}
	}}
	//----------------------------------------------------------------------------------------------
	var CIDS;
	var getCaller = function(cid)
	{
		return CIDS[cid];
	}
	var getCallerId = function(caller)
	{
		if (typeof caller != 'function')	// || caller.name.includes('Clutter'))
			return '';
		var id = CIDS.indexOf(caller);
		if (id == -1)
			id = CIDS.push(caller) - 1;
		return id;
	}
	var getName = function(ctx)				//currently no index or map so Object don't linger
	{
		return ctx["~name"];
	}
	//----------------------------------------------------------------------------------------------
	var defaultMeta = function(cid, seq) {
	//----------------------------------------------------------------------------------------------
	return {
		"~cid": cid,
//		"~ver": 'V3',
//		"~debug": 'options'
		"~name": getCaller(cid).name + (seq ? ':' + seq : '')
	}}
	//==============================================================================================
	/**
	 *	EZ.returnValue global Object constructor -AND- initializer for new() caller Objects
	**/
	//==============================================================================================
	var ___ = function EZreturnValue(updatedData, callback)
	{
		if (!___["~name"] || arguments[0] == null)	//called as script loads -or-
			return this;
		
		var caller = arguments.callee.caller

		if ((this instanceof ___ && !CIDS) 			//called as EZ.returnValue script loads
		|| caller == initReturnValue)
			return this;

		var cid = (!isNaN(updatedData)) ? updatedData : undefined;
		var ctx = this;
		var obj = caller;
		if (caller.name.includes("initStatic"))	//called by another fn while its script loads
		{											//...fall-thru to create global data / functions
			ctx = obj = this;
			cid = getCallerId(obj);
			initStatic.call(obj, obj, callback);
			caller = '';
		}
		else if ( !(this instanceof caller) )		//ctx is not new Object -- global caller.returnValue
		{											//...is updated -or- set to new EZreturnValue Object
			ctx = initReturnValue.call(caller, ctx, updatedData);
		}
		else void(0);								//extend new caller Object by adding EZreturnValue properties
													//...caller/returnValue data functions are bound to ctx._data
		cid = (cid !== undefined) ? cid : getCallerId(caller);
		initMeta.call(ctx, cid);

		if (!ctx._data || updatedData				//if no existing data or updated data supplied
		|| ctx._data['~cid'] != cid)				//...or data.~cid != ctx.~cid, add/updata data
			initData.call(ctx, updatedData);		//...ctx._data created or updated 

		initObject.call(ctx, obj, ctx._data);		//bind data functions to ctx and ctx._data, non-prototype
													//functions bound to ctx ...plus...

		if (ctx == caller && caller.returnValue != ctx)
			caller.returnValue = ctx;				//always update caller.returnValue for both new caller Objects 
													//-or- called from static global context
		return ctx;
	}
	//______________________________________________________________________________________________
	/**
	 *	add or update EZreturnValue meta data
	**/
	var initMeta = function(cid)
	{
		var ctx = this;							
		var caller = getCaller(cid)
		
		if (!ctx['~cid']
		|| ctx['~cid'] != cid)						
		{
			var seq = caller["~nextseq"]++;
			var meta = defaultMeta(cid,seq);
			EZ.sync(ctx, meta, '@^', 0);
		}
		ctx.isTest = (EZ.test && EZ.test.running == caller.name);
		//if (ctx.isTest)
		//	EZ.test.run.rtnValue = ctx;
	}
	//______________________________________________________________________________________________
	/**
	 *	create new EZreturnValue() Object -or- update and return existing
	**/
	var initReturnValue = function(caller, data)
	{
		var cid = getCallerId(caller);
		var ctx = this;
		if (ctx == caller)
		{
			var isRecursive = caller = caller.arguments.callee;
			if (!isRecursive && ctx == caller)
				delete caller.returnValue;

			else if (caller.returnValue)
				caller.returnValue['~calls']++
		}

		var rtnValue;
		if (data instanceof ___)					//if data is EZreturnValue Object
		{
			if (ctx == caller)
				delete caller.returnValue;

			var priorReturnValue = data;			//...use it and its data
			if (priorReturnValue['~cid'] != cid)
			{										//copy if diff caller id
				var rtnValue = new ___();
				var sync = EZ.sync(rtnValue, priorReturnValue, '@^' + caller.name + '.rtnValue', 1);
				log.add.call(this, 'sync', sync);
			}
		}

		rtnValue = rtnValue || caller.returnValue;
		if (!rtnValue)
			rtnValue = new ___();

		return rtnValue;
	}
	//______________________________________________________________________________________________
	/**
	 *
	**/
	var initData = function(updatedData)
	{
		if (typeof(updatedData) == 'function')					//e.g. caller defaultData() function
			updatedData = updatedData();
		else if (updatedData instanceof Object && typeof(updatedData.getData) == 'function')
			updatedData = updatedData.getData();						//e.g. data is instanceof some caller()
		else
			updatedData = null;								//only minimal data	for now

		var ctx = this;
		var cid = ctx['~cid'];
		if (!updatedData)
			updatedData = defaultData(cid);

		if (!this._data)
			this._data = {};
		if (updatedData || updatedData['~cid'] != cid)
			___.setData.call(this, updatedData);
	}
	//______________________________________________________________________________________________
	/**
	 *	bind functions to new Object (including static global Object -- except EZ.returnValue)
	**/
	var initObject = function(caller, data)
	{
		var ctx = this;							//new caller() Object
		//__________________________________________________________________________________________
		/**
		 *
		**/
		var _bind = function(obj, data)
		{
			for (var fn in obj)					//bind functions to new caller Object
			{
				if (typeof(obj[fn]) != 'function') continue;

				ctx[fn] = (!data) ? obj[fn].bind(ctx)
								  : obj[fn].bind(ctx, data)

				for (var k in obj[fn])			//...and copy nested properties and fn
					if ( !(k in ctx[fn]) ) 		//...including un-bound functions ??
						ctx[fn][k] = obj[fn][k];
			}
		}
		//=======================================================================================
		var dataFunctions = caller.data || {};
		
		_bind(caller);							//bind caller functions to ctx
		_bind(caller.data, data);				//bind caller data functions to ctx and data
		
		var dataFnKeys = Object.keys(dataFunctions);
		if (dataFnKeys.length)
		{										//probably only need on global Object
			caller.data = dataFunctions;
			log.add.call(caller, 'bind', '[' + getName(ctx) + '] restored bound data functions: ' + dataFnKeys);
		}
		_bind(___.prototype);					//bind EZ.returnValue -- non-data functions
		_bind(___.data, data);					//bind EZ.returnValue -- data functions
	}
	//______________________________________________________________________________________________
	/**
	 *	Creates global Object (pseudo static) -- then used as constructor for new Objects.
	 *
	 *	callback is used if DOM, other script or global Object required to complete initialization.

	 	EZ.returnValue:		return initStatic.call(___);
	 	others				EZ.returnValueV3.call(___, ctx, callback) -->
	 							ctx = initStatic.call(ctx, data, callback);
	 *______________________________________________________________________________________________
	**/
	var initStatic = function _initStatic(callback)
	{
		var obj = this;
		var fn = new obj();						//...create new this() to capture instance properties
		for (var p in fn) obj[p] = fn[p];		//...copy instance properties to global CLASS Object

		if (this == ___)						//initializing global EZ.returnValue
		{										//...create global default EZ.returnValue options
			options = this._options = defaultOptions();
			log = new ___.log();
			this._logs = log.logs;
			CIDS = this.CIDS = [___];
		}
		[callback]
	//	if (callback)
	//		window.addEventListener('load', callback, false);

		obj['~nextseq'] = 0;
		return obj;								//return populated global Object for EZ.returnValue
	}
	//______________________________________________________________________________________________
	/**
	 *	return _data.returnValue in not undefined
	**/
	___.prototype.toString = function(format)
	{
		var data = this.getData()
		if (format
		|| (data.returnValue !== undefined))
			return this.getReturnValue(format);

		return (typeof(this) == 'function') ? Function.toString.call(this)
											: {}.toString.call(this)
	}
	//______________________________________________________________________________________________
	/**
	 *	same as toString() if format specified or data.success is undefined otherwise
	 *	returns data.success -- is used by if (rtnValue === true) -or- if (rtnValue == str)
	 *	NOTE:
	 *		if (rtnValue) always true for Objects per original JavaScript specificaion.
	 *______________________________________________________________________________________________
	**/
	___.prototype.valueOf = function(format)
	{
		if (this == ___)						//this is EZ.returnValue global Object
		{
			return {}.toString.call(this);
		}
		var value = this.isOk.call(this, this._data);
		if (value === undefined || format)
			value = this.toString.call(this,format)
		return value;
	}
	//______________________________________________________________________________________________
	/**
	 *	add logs are kept in EZ.returnValues._logs to contain clutter.
	**/
	___.prototype.log = function ___log()
	{
		this.logs = {};
		var that = this;
		//______________________________________________________________________________
		this.get = function(type)
		{
			var name = (typeof(this) == 'function') ? this.name || '(fn)'
					 : (this instanceof String) ? this + ''
					 : this;
			if (name instanceof Object)
			{
				if (name["~cid"])
				{
					var cid = this["~cid"];
					var seq = this["~seq"];
					name = (getCaller(cid).name || 'cid['+cid+']') + (seq ? '[' + seq + ']' : '');
				}
				else name = name.name
			}
			else
				void(0);
			name = name || '';

			var log = that.logs[name] = (that.logs[name] || defaultLog())
			if (type)
				log = log[type] = (log[type] || []);
			return log;
		}
		//______________________________________________________________________________
		this.add = function(type, msg)
		{
			if (!msg || !msg.length) return;
			type = type || 'notes';
			
			var log = that.get.call(this, type);
			if (msg instanceof Array === false)
				msg = [msg];
			
			[].unshift.apply(log, msg);
			that.get.call(this).count += msg.length;
			
			log = that.get.call('-all-', type);
			
			that.get.call('-all-').count += msg.length;
			msg.unshift( getName(this) + ' \t\t ' + EZ.format.time('ms') );
			[].unshift.apply(log, msg);
		}
		//______________________________________________________________________________
		this.reset = function()
		{
			var log = that.get.call(this);
			log.splice(0, log.length);
		}
	}
	//________________________________________________________________________________________________
	/**
	 *	returns instance data Object -OR- if key supplied, existing data Object property if defined
	 *	otherwise defaultValue if specified (or if not {}) -- but does not create new data proprty.
	 *
	 *	EXAMPLES:
	 *		getData('myKey', []) returns existing data property or new Array if undefined.
	 *		getData('myObj') OR getData('myObj', {}) returns new Object if data.myObj not defined.
	**/
	___.prototype.getData = function ___getData(key, defaultValue)
	{
		var value = this._data || {};
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
	//________________________________________________________________________________________________
	/**
	 *	updates existing bound data Object by removing all keys then adding from supplied data
	**/
	___.prototype.setData = function ___setData(updatedData, note)
	{
		var data = ___.getData.call(this);			//this.getData() not always avail

		note = note || 'set';
		var debug = ''
		if (data)
		{
			debug = data["~debug"] || '';
			Object.keys(data).forEach(function(key) { delete data[key] });
		}

		var cid = this['~cid'];
		var caller = getCaller(cid);

		var sync = EZ.sync(data, updatedData, '@^' + caller.name + '.rtnValue', 1);
		log.add.call(this, 'sync', sync);

		data['~cid'] = cid;		//constructor reference
		data["~name"] = (caller.name || '') + '.data';
		data["~note"] = note + ' @ ' + EZ.format.time('ms');

		var debugKeys = (data["~debug"] || debug).split(/\s/);
		for (var key in EZ.toArray(debugKeys)) 		//update debugger convenience values
		{
			var _key = '_' + key;
			if (data[key])
				this[_key] = data[key];
		}
		return data;
	}
	//______________________________________________________________________________________________
	/**
	 *	get/set testrun value --
	 */
	___.prototype.testrun = function()
	{
		return (this.isTest) ? EZ.test.run.testrun : ___.testrun = ___.testrun || function()
		{
			this.get = function(key, defaultValue) { return this[key] || defaultValue };
			this.set = function(key, value) { return this[key] = value };
		}
	}
	___.prototype.getTestValue = function ___getTestValue(key, defaultValue)
	{
		return this.testrun().get(key, defaultValue);
	}
	___.prototype.setTestValue = function ___setTestValue(key, value)
	{
		return this.testrun().set(key, value);
	}
	//______________________________________________________________________________________________
	/**
	 *	called by EZ.test.run() after return from test function call
	**/
	___.prototype.removeClutter = function ___removeClutter(rtnValue)
	{
		var ctx = this;
		var data = ctx.getData();
		if (rtnValue)
		{
			var fn = new ___();				//get new EZreturnValue() for fn list
			ctx = {};
			Object.keys(rtnValue).forEach(function(key)
			{
				if (typeof(fn[key]) == 'function')	// || key.startsWith('~'))
					return;

				if (key in fn
				&& key != '_data'
				&& rtnValue[key] instanceof Object
				&& (key.startsWith('_') || Object.keys(rtnValue[key]).length ===0))
					return;

				ctx[key] = rtnValue[key];
			});
			/*
			Object.keys(rtnValue).forEach(function(key)
			{										//...and properties starting with "_" except "_data"
				if (key.startsWith('_') && key != '_data'
				&& ctx[key] instanceof Object)
					delete ctx[key];
			});
			*/
		}
		Object.keys(data).forEach(function(key)		//remove empty data Objects
		{
			if (key == 'returnValue') return;

			var value = data[key];
			if (value instanceof Object && Object.keys(value).length === 0)
				delete data[key]

			else if (key == 'lists')				//collapse mergedMessages lists
			{
				for (var list in value)
				{
					if (value[list] instanceof Object && value[list].length === undefined)
						value[list] = EZ.mergeMessages(value[list]);
				}
			}
		});
		return ctx;
	}
	//______________________________________________________________________________________________
	/**
	 *	resetOptions(options, defaultOptions)		//reset global static options
	**/
	___.prototype.resetOptions = function ___setOptions(options, defaultOptions)
	{
		options = data.options = ___.data.resetOptions.call(___, data, options, defaultOptions);
		return options;
	}
	//________________________________________________________________________________________________
	___.prototype.updateOptions = function ___updateOptions(options)
	{
		return this.resetOptions(options, data.options);
	}
	//________________________________________________________________________________________________
	___.data = function _____DATA_FUNCTIONS_____() {}
	//________________________________________________________________________________________________
	/**
	 *	return status of function -- "na" unless setOk() or setFail() called
	 */
	___.data.isOk = function(data)
	{
		return data.success;
	}
	___.data.setOk = function(data)
	{
		return data.success = true;
	}
	___.data.setFail = function(data)
	{
		return data.success = false;
	}
	//________________________________________________________________________________________________
	/**
	 *	get/set data property
	 *		get returns defaultValue if no existing but does NOT update data
	 *		set updates any existing "_key" convenience reference in data and/or this
	**/
	___.data.get = function ___get(data, key, defaultValue)
	{
		return (key in data) ? data[key]
			 : (data.values && key in data.values) ? data.values[key]
			 : defaultValue
	}
	//________________________________________________________________________________________________
	___.data.set = function ___set(data, key, value)
	{
		if (key == 'options' && !data.options)
			data.options = data._options = {};

		if (key in data) 							//update top level value
		{
			data[key] = value;
													//update debugger convenience vars if any
			var _key = '_' + key;
			if (_key in data) data[_key] = value;	//if _key in data, update

			if (this.CLASS && _key in this.CLASS)	//...likewise for CLASS
				this.CLASS[_key] = value;

			if (data["~note"])
				data["~note"] = 'updated @ ' + EZ.format.time('ms');
		}
		else										//update data.values[key]
		{											//...create data.values if not defined
			data.values = data.values || {};
			data[key] = value;
		}
		return value;
	}
	//________________________________________________________________________________________________
	/**
	 *	get/setReturnValue()
	 *	returns value as specified returnFormat otherwise value as-is if not supplied or "value"
	 *	for returnFormat=false, null, und=fined or blank,  returns value "as-is"
	 *	for returnFormat=true or "true", return "this" EZreturnValue Object with all functions
	 */
	___.data.getReturnValue = function(data, returnFormat)
	{
		var value = data.returnValue;

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
	//________________________________________________________________________________________________
	/**
	 *
	**/
	___.data.setReturnValue = function(data, value, format)
	{
		data.returnValue = value;

		if (!format || format instanceof Object)
			return this.getReturnValue();		//return as specified returnType or "as-is"

		else
		{
			data.valueFormats = data.valueFormats = (data.valueFormats || {});
			if (typeof(format) == 'string')
				format = format.trim().toLowerCase();

			data.valueFormats[format] = value;
			return value;
		}
	}
	//______________________________________________________________________________________________
	/**
	 *	save([value [, format])												EZ.returnValue V2
	 *
	 *	calls setReturnValue() if value supplied -- removesClutter from this and data
	 *
	 *	returns value as specified format or returnType if format omitted
	 *
	 *	used at end of function -- e.g. return this.save(value)
	 *______________________________________________________________________________________________
	**/
	___.data.save = function ___save(data, value, format)
	{
		if (arguments.length > 1)
			this.setReturnValue(value, format);

		this.removeClutter();
		return this.getReturnValue(format);
	}
	//______________________________________________________________________________________________
	/**
	**/
	___.data.getOption = function ___get(data, key, defaultValue)
	{
		return this.get('options')[key] || defaultValue;
	}
	//______________________________________________________________________________________________
	___.data.setOption = function ___setOption(data, key, value)
	{
		this.get('options')[key] = value;
		_setExcludeKeys(options);
		return value;
	}
	//______________________________________________________________________________________________
	/**
	**/
	var _setExcludeKeys = function(options)
	{
		if (!/(exclude|include|ignore)/.test(Object.keys(options)))
			delete options.excludedKeys;
		else
		{
			options.exclude = EZ.toArray(options.exclude, ', ');
			options.include = EZ.toArray(options.include, ', ');
			options.ignore = EZ.toArray(options.ignore, ', ');

			var lists = { 									//create excludedKeys lists
				exclude:{dot:[], not:[]},
				include:{dot:[], not:[]},
				ignore:{dot:[], not:[]}
			};
			Object.keys(lists).forEach(function(listName)	//for each list...
			{												//...sort into keys with dot or not
				if (!options[listName]) return;
				options[listName].forEach(function(key)
				{
					(key.includes('.')) ? lists[listName].dot.push(key)
										: lists[listName].not.push(key);
				});
			});

			var excludedKeys = options.excludedKeys = {dot:[], not:[]};
			['dot', 'not'].forEach(function(type)			//for dot and not exclude list
			{												//...append ignore
				var list = lists.exclude[type].concat(lists.ignore[type]);
				list.forEach(function(key)
				{											//skip key if in include list and not ignore list
					if (lists.include[type].includes(key) && !lists.ignore[type].includes(key))
						return;

					(type == 'not') ? excludedKeys.not.push(key)
									: excludedKeys.dot.push(key.substr(1).split('.'))
				});
				options.excludedKeys[type] = excludedKeys[type].removeDups();
			});

			if (!options.excludedKeys.not.length && !options.excludedKeys.dot.length)
				delete options.excludedKeys;
		}
	}
	//______________________________________________________________________________________________
	/**
	 *	resetOptions(options, defaultOptions)						superceeds setOptions(options)
	 *
	 *	can be called as EZ.setOptions() or from initialized CLASS as this.setOptions()
	**/
	___.data.resetOptions = function ___resetOptions(data, options, defaultOptions)
	{
		options = EZ.options.call(options);					//create EZoptions object
		options = EZ.options.call(defaultOptions,options);
															//add any omitted global defaults
		var name = (options['~name'] || '$') + '.options';
		var sync = EZ.sync(options, defaultOptions, '@+^' + name);
		log.add.call(this, 'sync', sync);

		_setExcludeKeys(options);
		if (this != ___)									//set data.options if no EZ.returnValue global
		{
			this.set.call(this, this._data,'options', options);
			if (this.isTest)
				EZ.test.run.options = options;
			if (options.returnType)							//temp backward compatibility ??
				options.returnFormat = options.returnType;
		}
		return options;
	}
	//______________________________________________________________________________________________
	___.data.getOptions = function ___getOptions(data)
	{														//backward compatibility
		return data.options;
	}
	//______________________________________________________________________________________________
	___.data.setOptions = function ___setOptions(data, options, defaultOptions)
	{														//backward compatibility
		return this.resetOptions(data, options, defaultOptions);
	}
	//______________________________________________________________________________________________
	/**
	 *	updateOptions(options) -- update existing options
	**/
	___.data.updateOptions = function ___updateOptions(data, options)
	{
		return this.resetOptions(options, data.options);
	}
	//______________________________________________________________________________________________
	/**
	 *	return data.lists Object or {} if no lists exist
	**/
	___.data.getAllLists = function ___getLists(data)
	{
		return data.lists || {};
	}
	/**
	 *
	**/
	___.data.getList = function ___getList(data, name)
	{
		var list = this.getData('lists')[name];
		return (!list) ? []
			 : (list instanceof Array) ? list
			 : EZ.stringify(list);
	}
	/**
	 *	returns length of specifed list -- zero if empty or undefined
	**/
	___.data.haveList = function ___haveList(data, name)
	{
		var lists = data.lists || {};
		return (lists[name] || []).length;
	}
	//______________________________________________________________________________________________
	/**
	 *	add value or concat Array to data.lists[name] -- create if necessary
	 *	uses EZ.mergeMessage list if dotName supplied
	**/
	___.data.addListItem = function ___addListItem(data, name, value, dotName)
	{
		switch (arguments.length)
		{
			case 3:
			{
				data.lists = data.lists = (data.lists || {})
				var list = data.lists[name] = (data.lists[name] || [])

				if (value instanceof Array)
					data.lists[name] = list.concat(value);
				else
					list.push(value);
				return list;
			}
			case 4: return this.mergeListItem(name, value, dotName)
		}
	}
	//______________________________________________________________________________________
	/**
	 *	add item to EZ.mergeMessage list								was mergeListItem()
	 */
	___.data.addMergeListItem = function(data,name, msg, dotName)
	{
		dotName = dotName || '$';

		data.lists = (data.lists || {})
		var list = data.lists[name] = (data.lists[name] || {})

		if (EZ.isArray(dotName))
		{
			dotName = dotName.join('.');
			if (!dotName.startsWith('$'))
				dotName = '$' + dotName;
		}
		EZ.mergeMessages(list, msg, dotName)
		return list;
	}
	//______________________________________________________________________________________________
	___.data.getKeyValue = function(data, name, key)
	{
		return this.getListValue(name, key);
	}
	/**
	 *	getListValue(name, key, defaultValue)							was getKeyValue
	**/
	___.data.getListValue = function ___getListValue(data, name, key, defaultValue)
	{
		data.lists = data.lists = (data.lists || {})
		var list = data.lists[name] || {};
		return (key in list) ? list[key] : defaultValue;
	}
	//______________________________________________________________________________________________
	___.data.setKeyValue = function(data, name, key, value)
	{
		this.setListValue(name, key, value);
	}
	/**
	 *	setListValue(name, key, value)									was setKeyValue
	**/
	___.data.setListValue = function ___setListValue(data, name, key, value)
	{
		data.lists = (data.lists || {})
		var list = data.lists[name] = (data.lists[name] || {})
		return list[key] = value;
	}
	//______________________________________________________________________________________
	/**
	 *	info
	**/
	___.data.addInfo = function(data, msg)
	{
		data.info = data.info || [];
		(EZ.isArray(msg)) ? data.info = data.info.concat(msg).remove()
						  : data.info.push( (msg+'').trim() );
	}
	___.data.getInfo = function(data)
	{
		return data.info || [];
	}
	//______________________________________________________________________________________
	/**
	 *	add, get details
	**/
	___.data.addDetails = function(data, msg)
	{
		msg = msg || '...message NA...'
		data.details = EZ.toArray(data.details);
		(EZ.isArray(msg)) ? data.details = data.details.concat(msg)
						  :	data.details.push(msg);
	}
	___.data.getDetails = function(data)
	{
		return EZ.toArray(data.details).join('\n').trim();
	}
	//______________________________________________________________________________________
	/**
	 *	add, get message
	**/
	___.data.addMessage = function(data, msg)
	{
		var message = data.message || [];
		if (EZ.isArray(msg))
			msg = msg.join('\n').trim();

		if (!msg)
			void(0);
		else
		{
			data.success = false;
			message.push(msg);
		}
		return this.getMessageObject();		//return message obj as convenience -- not clone
	}
	___.data.getMessageString = function(data)
	{
		return (data.message || []).join('\n').trim();
	}
	___.data.getMessageObject = function(data)		//create if necessary
	{
		return data.message || [];
	}
	___.data.getMessage = function(data)
	{
		var message = data.message || [];
		if (message.includes(''))
			return message.remove();		//remove blank items -- return clone
		return message.slice();
	}
	//__________________________________________________________________________________________________
	/**
	 *
	**/
	___.data.getTag = function ___getTag(data, name)
	{
		var options = data.options;
		if (!name || !options) return;
		options.tags = options.tags || {};

		var el = options.tags[name];
		if (el instanceof Element)
			return el;

		return options.tags[name] = EZ(el || name, null);
	}
	//__________________________________________________________________________________________________
	/**
	 *
	**/
	___.data.setTag = function ___setTag(data, name, value)
	{
		var tag = this.getTag(name);
		if (!tag) return;
		return EZ.set(tag, value || '');
	}
	//================================================================================================
	//debugger;
	return initStatic.call(___);
})();
