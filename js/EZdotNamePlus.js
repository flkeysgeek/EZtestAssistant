/*--------------------------------------------------------------------------------------------------
Dreamweaver LINT global references and defined variables not used here {
--------------------------------------------------------------------------------------------------*/
/*global 

EZ, DWfile, dw:true, e:true, f:true, g:true
*/
var e;			//global used for try/catch
(function() {[	//global variables and functions defined but not used

DWfile, dw, e, f, g ]});
//. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .}

//__________________________________________________________________________________________________
(function _____EZdotNamePLUS_____() {
/*{-------------------------------------------------------------------------------------------------
. . .
-------------------------------------------------------------------------------------------------}*/
	var ___ = function _global_variables_(){};	//{
	var data, log, options;		//global varibles availible to all functions
	[log, options, data]
	
	var defaultOptions = function(q)
	{
		var opts = {
			quote: q || '',
			include: [],
			exclude: [],
			ignore: [],
			excludedList: true,		//=false no list, ="top" embedded excluded keys not listed
			name: 'EZ.dotName.options'
		}
		//if (options)				//apply global class defaults
		//	EZ.sync(opts, options, '@+');
		return EZ.dotName._options = opts;
	}

	var defaultData = function(dotName)
	{
		//var dotName = (key instanceof String || typeof(key) == 'string') 
		//			? [key + ''] : [];
		data = {
		//	dotName: dotName,
			dotNamePlus: dotName.slice(),
			excludedKeys: {			//populated by resetOptions()
				dot: [],
				not: []
			},
			lists: {				//populated by pop()
				excluded: []
			},
			pending: [],			//populated by getSkipList()
			priorPending: [],
			excludedStack: []
		}
		EZ.dotName._excludedStack = data.excludedStack;
		return EZ.dotName._data = data;
	}
void(defaultOptions, defaultData)
	var defaultPending = function(depth, keys, keepList, priorPending)
	{
		var skipList = keys.remove(keepList);
		var pending = {
			depth: depth,
			count: keys.length,
			keys: keys,
			keepList: keepList,
			skipList: skipList,
			skipCount: skipList.length,
			eq: true,
			notEqKey: undefined,
			priorPending: priorPending
		}
		return EZ.dotName._pending = pending;
	}
	// } . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//______________________________________________________________________________________________
	EZ.dotName.setup = function(dotName)
	{
		return dotName;
	}
	//______________________________________________________________________________________________
	EZ.dotName.toString = function(key)
	{
		if (!___)
			return 'no ' + EZ.dotName.name + ' Object created'

		var value;// = ['...'].concat(EZ.dotName._dotName);
		if (this instanceof ___)
		{
			EZ.dotName._dotName = data.dotName;
			value = (!key) ? data.dotName
				  : data.dotName.concat(_format(key, '') )
		}
		return value.join('');
	}
	//______________________________________________________________________________________________
	EZ.dotName.addListItem = function(name, value, dotName)
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
	//______________________________________________________________________________________________
	EZ.dotName.getLists = function()
	{
		return this.getData('lists')
	}
	//______________________________________________________________________________________________
	EZ.dotName.haveList = function(name)
	{
		var data = this.getData();
		var lists = data.lists || {};
		return Boolean(lists[name]);
	}
	//______________________________________________________________________________________________
	EZ.dotName.getList = function(name)
	{
		var list = this.getData('lists')[name];
		return (!list) ? []
			 : (list instanceof Array) ? list
			 : EZ.stringify(list);
	}
	//______________________________________________________________________________________________
	EZ.dotName.setOptions = function ___setOptions(opts)
	{
		___(this);
		var opts = EZ.options.call(opts);
		opts.exclude = EZ.toArray(opts.exclude, ', ');
		opts.include = EZ.toArray(opts.include, ', ');
		opts.ignore = EZ.toArray(opts.ignore, ', ');
		opts.sync = EZ.sync(opts, options, '@+^EZ.options');
		options = this._data.options = this._data._options = opts;
		data = this._data;

		var lists = {
			exclude:{dot:[], not:[]},
			include:{dot:[], not:[]},
			ignore:{dot:[], not:[]}
		};
		Object.keys(lists).forEach(function(listName)	//for each list...
		{												//...sort into keys with dot or not
			opts[listName].forEach(function(key)
			{
				(key.includes('.')) ? lists[listName].dot.push(key)
									: lists[listName].not.push(key);
			});
		});
		var excludedKeys = {dot:[], not:[]};
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
		});
		data.excludedKeys = {};
		data.excludedKeys.not = excludedKeys.not.removeDups();
		data.excludedKeys.dot = excludedKeys.dot.removeDups();
		if (!data.excludedKeys.not.length && !data.excludedKeys.dot.length)
			delete data.excludedKeys;
	}
	//______________________________________________________________________________________________
	EZ.dotName.concat = function ___concat(keys, q)
	{
		___(this);
		var clone = new EZ.dotName(this, q)
		keys.forEach(function(key)
		{
			clone.push(key);
		});
		return clone;
	}
	//______________________________________________________________________________________________
	EZ.dotName.push = function ___push(key, obj)
	{
		___(this);

		data.dotName.push(_format(key, options.quote));
		data.dotNameClean.push(key);

		if (!this.isExcluded(key,obj))					//if not excluded
			return '';

		var dotName = this.toString();
		data.excludedStack.unshift(dotName);
		return dotName;
	}
	//______________________________________________________________________________________________
	EZ.dotName.pop = function ___pop(eq) {
	/*---------------------------------------------------------------------------------------------{
	 *	log all not equal excluded keys -or- just parent (not nested)
	 *------------------------------------------------------------------------------------------- }*/
		___(this);
		var di = _getPending();

		var key = data.dotNameClean.pop();
		var displayKey = data.dotName.pop();
		[displayKey]
		//===========================================================================================
		while (di)									//if excludes
		{
			if (--di.count === 0)
				_removePending();					//no more keys
			if (di.skipCount === 0)
				break;								//no excludes at this depth

			var excl = di.skipList.includes(key);
			if (!excl)
				break;

			if (options.excludedList == 'all' || !di.priorPending)
			{										//not processing excluded key at lower depth
				if (!eq && excl)					//...or logging all not eq excluded keys
					this.addListItem('excluded', this.toString(key))

				//di.eq = di.eq && eq;
				//if (di.count)						//keep going if more keys
					return true;

				//return di.eq;
			}
			if (!eq && excl && !di.notEqKey)		//remember 1st not eq key
				di.notEqKey = key;

			if (di.count)							//more keys
				return true;

			if (!di.notEqkey)
				break;
													//log if not processing excluded at lowerlevel
			this.addListItem('excluded', di.notEqkey)
			return false;
		}
		//===========================================================================================
		return eq;									//return equal results for this key
	}
	//______________________________________________________________________________________________
	EZ.dotName.isExcluded = function ___isExcluded(key, x, y)
	{
		___(this);
		var keepList = [key];
		var di = _getPending();
		if (di)
			keepList = di.keepList;

		else if (x instanceof Object)
			keepList = this.getSkipList(x,y);

		return !keepList.includes(key);
	}
	//______________________________________________________________________________________________
	EZ.dotName.getSkipList = function ___getSkipList(x, y) {
	/*---------------------------------------------------------------------------------------------{
	 *	return non-excluded list of keys -- populates data.pending for current depth
	 *------------------------------------------------------------------------------------------- }*/
		___(this);
		var keys = Object.keys(x);
		if (y instanceof Object)
			keys = keys.concat(Object.keys(y)).removeDups();
		if (keys.length === 0)
			return;
		var keepList = keys.slice();

		var excludedKeys = data.excludedKeys;
		if (excludedKeys)
		{
			var removeList = excludedKeys.not.slice();
			excludedKeys.dot.forEach(function(key)
			{
				var dotNameObj = data.dotNameClean.slice(1, key.length).join('.');
				if (dotNameObj != key.slice(0,-1).join('.'))
					return;

				removeList.push( key.slice(-1)[0] );
			});

			keepList = keys.remove(removeList)

			keys.forEach(function(key)							//property excluded by type
			{
				if ( excludedKeys.not.includes( typeof(x[key]) )
				|| excludedKeys.not.includes( EZ.getType(x[key]) )
				|| (x[key] instanceof Object && excludedKeys.not.includes( x[key].constructor.name )))
					keepList = keepList.remove(key);

				if (y instanceof Object)
				{
					if ( excludedKeys.not.includes( typeof(y[key]) )
					|| excludedKeys.not.includes( EZ.getType(y[key]) )
					|| (y[key] instanceof Object && excludedKeys.not.includes( y[key].constructor.name )))
						keepList = keepList.remove(key);
				}
			});
		}
		_addPending(keys, keepList);
		return keepList;
	}
	//______________________________________________________________________________________________
	var _addPending = function(keys, keepList)
	{
		var depth = data.dotName.length;
		var di = data.pending[0];

		var di = defaultPending(depth, keys, keepList, data.priorPending.length);
		data.pending.unshift(di);
		if (di.skipCount)
			data.priorPending.unshift(depth);
	}
	//______________________________________________________________________________________________
	var _removePending = function()
	{
		var di = data.pending.shift();
		if (di.skipCount)
			data.priorPending.shift();
	}
	//______________________________________________________________________________________________
	var _getPending = function()
	{
		var depth = data.dotName.length - 1;
		var di = data.pending[0];
		if (!di || di.depth != depth)
			return '';

		return di;
	}
	//______________________________________________________________________________________________
	function _format(key, q)
	{
		var fmt = (!isNaN(key)) 				  ? '[' + key + ']'
				: (/^[A-Z_$][\w_$]*$/i.test(key)) ? '.' + key
				: key.wrap("["+q, q + "]");
		return fmt;
	}
	//==================================================================================================
	/*
	return _init();							//create and return global "static" Object
	//data = ___._data = ctx._data;			//update global data closure variable avail to all functions
	___._options = data._options;			//read only debugger convenience
	___._dotName = data.dotName;
	___._dotNameClean = data.dotNameClean;
	*/
})();
