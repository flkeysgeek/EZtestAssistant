/*--------------------------------------------------------------------------------------------------
Dreamweaver LINT global references and definitions  not used here
--------------------------------------------------------------------------------------------------*/
/*global
EZ, DWfile,
resetTests, quit,
ready, setupTestScript,

e:true, g:true, dw:true, f:true
*/
var e;			//global var for try/catch
(function() {[	//global variables and functions defined but not used

e, f, g, dw, DWfile ]});
//. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
//__________________________________________________________________________________________________
EZ.dataFile = (function _____EZtest_dataFile_____(){											
//__________________________________________________________________________________________________
/*{
EZ.dataFile(key, options)			created as global EZtest_dataFile() Object as js file loads

can be called to create unique EZtest_dataFile() Object for managing EZtest_assistant data files.

Provides functions to load, save, create, delete or compare data files changes.

update() function checkes if data has changed and optionally creates tooltip HTML showing summary
of changes with link to winMerge for full comparison of data file changes.

TODO:
	-integrate savedResults history functionality for all managed files.
//_______________________________________________________________________________________________
}*/
	var _ = {}, __ = {}; [_, __]	//following global variables availible to all internal
	//var data, log, options;		//and Object functions since the are all closures.
	//[log, options]	
	var ___ = function _____global_variables_____(){};	// {
	
	//var key, data;
	var MANAGED_FILES = {};			//map of EZtest_dataFile instances contains data for each instance

	//==============================================================================================
	(function _____data_structures_____(_) {
	//______________________________________________________________________________________________
	_.defaultOptions = function(key, callerOpts) 	
	{												//default for each EZtest_dataFile Object
		callerOpts = callerOpts || {};
		var defaultOpts = {
			file: callerOpts.file,
			key: '',
			name: '',						//optional long name (default is EZtest_dataFile key)
			sortKeysDepth: 0,
			eqOpts: {						//common EZ.equals options
				$sync:'+',
				showDiff:5,
				ignore: 'objectType',
				exclude: 'timestamp',
				//console: true,
				//log: true,
			},
			save: {
				exclude: 'function',
				eqOpts: {}
			},
			log: {								//"all" to log all log calls
				actions: 'setValue, save, update, change',
				change: {
					stack: true,
					eqOpts: {
						exclude: ''
					}
				},
				objects: {
					formatter: 'EZtoString',	//objects
					formatOpts: {
						$sync:'+',
						timestamp: false,
						html_keys: '',
					}
				},								//log winMerge compare icon
				compare: {
					formatter: 'EZtoString',
					formatOpts: {
						$sync:'+',
					//	timestamp: false,
						display_showSpaces: false,
						display_maxline: "200",
						spaces: "3",
						sort: "true",
						htmlformat: false,
						maxdepth: "6",
						maxobjects: "500"
					},
				},
			},
			tags: {
				dataFileLogHeading: '',
				dataFileLogDetails: '',
				noSaveId: '',
				saveStatus: '',						//was tooltip
				saveStatusTitle: '',
				updatesCount: '',
			},
		}
		if (!key) return defaultOpts;				//global options

		var merged = EZ.options.call(callerOpts);	//clone caller opts
													//...sync with defaultOpts
		var name = '@' + key.wrap('[]') + 'EZ.dataFile.options';
		EZ.sync(merged, defaultOpts, name, 9);
		EZ.sync(merged.save.eqOpts, merged.save.exclude, '+' + name + '.save.eqOpts', 9)
		EZ.sync(merged.save.eqOpts, merged.eqOpts, '+' + name + '.save.eqOpts', 9)
		EZ.sync(merged.log.change.eqOpts, merged.eqOpts, name + '.save.change.eqOpts', 9)
		//EZ.sync(options, defaultOptions(), '-' + key.wrap('[]') + 'EZ.dataFile.options');
		//merged.file = callerOpts.file;
		return merged;
	};
	//______________________________________________________________________________________________
	_.defaultData = function(key,options)			
	{									//default data for each managed file
		key = key || '';
		var data = {
			key: key,
			name: options.name,
			action: '',					//set or appended by everyone -- cleared by setTitle()
			isPending: false,			//set by save() if not canSave() -- cleared by save() if canSave()
			isChanged: false,			//set by updateValue() or save() -- cleared by save() if canSave()
			isUpdated: false,
			timestamp: '',				//updated by load(), save() and setValue()
			timestamp_loaded: '',
			timestamp_updated: '',
			timestamp_saved: '',
			timestamp_setValue: '',
			value: '',
			valueCloned: '',			//updated by setValue(), save() and update() before data.value updated
			valueLoaded: '',			//loaded value -- kept if log enabled
			compare: {
				note: '',
				caller: '',
				skips: 0,
				valueHistory: [],		//updated by compareUpdate()
				valueHistoryTitle: [],	//updated by compareTitle()
				valueHistoryEquals: [],	//updated by compareTitle()
			},
			options: options,
			file: options.file
		}								//adds get() and set()
		
		data.name = options.name;
		options.eqOpts.name = data.name || key;
		options.eqOpts.dotName = data.key;
		
		EZ.sync.getSet(data, key.wrap('[]') + ' EZ.dataFile.data.');
		return data;
	}
	})(_);//}...end of data structures
	//==============================================================================================
	(function _____EZdataFile_constructor_____() {
	//==============================================================================================
	/** {
	 *	return existing or new Object for managed dataFile identified by specified unique key.
	 *
	 *	ARGUMENTS:
	 *		key			unique key associated with managed dataFile
	 *		options		see defaultOptions above
	 *
	 *	RETURNS:
	 *		new or existing instance (i.e. custom Object) for specified key
	 *						instance of the class of objects known as EZ.dataFile
	 *________________________________________________________________________________________________
	}*/ 
	___ = function EZdataFile(key, dataOpts)
	{
		if (!EZ.dataFile) 
			return this;							//called as script loads
		//===========================================================================================
		// create and setup new EZdataFile Object with specified key and dataOpts
		//===========================================================================================
		var data, options;
		if (this instanceof ___)
		{												//if called as constructor, carry on
			options = _.defaultOptions(key, dataOpts)
			data = _.defaultData(key, options);
			EZ.common.call(this, ___, options, data);
			MANAGED_FILES[key += ''] = this;
		}
		else return new ___(key, dataOpts);			//if NOT called as constructor, make is so

		if (data.file)
			this.load();						//load data if file specified

		this.log('setup');
		//==========================
		return this;
		//==========================
	}
	})();	//end of constructor
	//==============================================================================================
	(function _____prototype_functions_____() {
	//______________________________________________________________________________________________
	//__________________________________________________________________________________________________
	/**
	 *	call when data loaded or saved -- updated title with timestamp if specified
	 */
	___.prototype.load = function ___load(file, defaultValue)
	{
		var data = this.getData();
		var options = data.options;
		options.defaultValue = (defaultValue || options.defaultValue)

		//data.file = data.file || EZ.filePlus(file || options.file);
		var url = data.file.url;
		if (!url)
			return EZ.oops('data file url NOT specified');

		data.timestamp_loaded = data.file.timestamp;
		//============================================================================
		data.json = DWfile.read(url) || '{}';
		var value = eval('value=' + data.json);
		//============================================================================
		if (options.defaultValue)
		{									//if defaultValue sync via getValue()
			data.value = value;
			value = this.getValue(defaultValue)
		}
		data.action = 'load';
		this.setValue(value);
		data.valueLoaded = data.valueCloned;
		return true;
	}
	//__________________________________________________________________________________________________
	/**
	 *	call when data loaded or saved -- updated title with timestamp if specified
	 */
	___.prototype.setTitle = function ___setTitle(timestamp)
	{
		var data = this.getData();
		/*
			loaded data save @

			NOT saved @ (why...)
			saved (pending changes) @
			[x] saved (... updates) @
			no changes (forced save) @

			updated and saved @
			updated @ (save pending)
		 */

		var action = data.action || '';
		data.action = '';
		if (!data.timestamp_setValue)		//'data not loaded'
			return;

		var msg = '';
		var why = data.why || data.noSaveWhy || '';
		var now = '@ ' + EZ.format.time('ms');
		timestamp = EZ.format.dateTime(timestamp || data.timestamp, '@');

		var isForced = action.includes('forced');
		var isPending = action.includes('pending');
		var isSaved = action.includes('save');

		switch (action.replace(/(\w+)/, '$1'))	//1st word
		{
			case 'loaded':
			{
				msg = 'loaded data saved ' + timestamp;
				break;
			}
			case 'update':
			{
				if (isSaved)
					msg = 'updated and saved ' + timestamp;
				else
					msg = 'updated ' + data.timestamp_updated + ' (save pending)';
				break;
			}
			case 'save':
			{
				if (data.isPending)		//IS pending
					msg = 'NOT saved ' + now + ' -- ' + why;

				else if (isPending)		//WAS pending
					msg = 'saved ' + timestamp + ' (pending changes)';

				else if (isForced)
					msg = 'no changes saved ' + timestamp + ' (forced)';

				else
					msg = 'saved chamges ' + timestamp;

				break;
			}
			default:	//return EZ.oops('unknown action: ' + action)
				msg = action + ' ' + timestamp;
		}
		/*
		if (data.isSaved)							//set by setValue() when saved
			msg = ' save';
		else if (!data.isUpdated)
			msg = ' update '
		if (!data.isPending)
			msg += 'd'
		else
			msg += ' pending ' + (why ? ' -- ' + why.wrap('[]') : '')
		*/
		//else if (data.isPending)						//isDataChanged() sets if called with why arg
		//	msg += ' pending save ' + why;				//not cleared until saved

		//else if (data.isChanged)						//isDataChanged() sets if changed from saved
		//	msg += ' NOT saved ' + why;					//clears if data restored to saved values

	//	else if (EZ.test.app.state == 'safety')
	//		msg += ' up-to-date: ';

		if (!quit.reload)									//update html if not reloading
		{

			var el = this.getTag('saveStatus');
			if (el)
			{
				EZ.addClass(el, 'pending', isPending);
				EZ.addClass(el, 'saved', isSaved);
			}

			el = this.getTag('saveStatusTitle');
			var text = '';
			if (el)
			{
				if (isPending)
				{
					//text = 'changes pending ' + why;
					el.setAttribute('data-title-prefix', '');
					el.setAttribute('data-title', '');		//eliminate clutter when pending
				}

				if (timestamp == -1)
					text = '';

				else if (timestamp !== undefined && timestamp != 'NA')
					text = ' @ ' + EZ.formatDate(timestamp, 'today time')

				text = msg + text;
				text = (text || '').trim()
				if (text)
					el.setAttribute('data-title-suffix', ' ' + text);
			}
		}
		msg = msg.trim();
		if (msg)			// && data.timestamp_setValue)
		{
			var prefix = '';
			prefix = data.name.pad(19);	//props.id.pad(25)

			msg = prefix + msg;
			var state = EZ.test.app.state.wrap().pad(9);
			var time = EZ.format.time('ms');
			EZ.log.call('saveData', state, time, msg + ' ' + (data.name || ''));
			msg = time.replace(/\s+/g, '') + ' ' + msg;
		}
		return msg;
	}
	//__________________________________________________________________________________________________
	/**
	 *	return all data including value and valueHistory
	 */
	___.prototype.getData = function ___getData()
	{
		return this.data;
	}
	//__________________________________________________________________________________________________
	/**
	 *	return value Object -- can be modified directly -- except replacing
	 *	use EZ.data.resetValue to clear or replace
	 */
	___.prototype.getValueObject = function ___getValueObject()
	{
		return this.data.value;
	}
	//__________________________________________________________________________________________________
	/**
	 *	returns synced value Object
	 */
	___.prototype.getValue = function ___getValue(defaultValue)
	{
		var data = this.getData();
		var options = data.options;
		
		defaultValue = defaultValue || options.defaultValue || null;
		var value = data.value;
		if (defaultValue != null)
		{
			if (value == null || (value instanceof Object) != (defaultValue instanceof Object))
				data.value = defaultValue;

			else if (defaultValue instanceof Object)
				EZ.sync(value, defaultValue);
		}
		return
	}
	//__________________________________________________________________________________________________
	/**
	 *	data.action should be set -- cleared here
	 */
	___.prototype.setValue = function(value, note, caller)
	{
		var data = this.getData();
		value = this.log('getInfo', value, note, caller).value;

		if (!value)
			this.log('message', 'setValue: no data loaded')

		else
		{
			var isFirst = !data.timestamp_setValue
			data.timestamp = data.timestamp_setValue = EZ.format.dateTime();
			if (!data.action)
				data.formattedLog = '';
			data.action = data.action || 'setValue';

			if (isFirst)									//1st set call
			{												//...called from load or externally
				data.valueCloned = __.cloneValue(value);
				data.value = value;
				this.log('setTitle', 'init');
			}
			else
			{
				data.valueCloned = __.cloneValue(data.value);
				data.value = value;
				this.log('setValue', note, caller);			//log if value changed
			}
		}
		this.setTitle();
	}
	//__________________________________________________________________________________________________
	/**
	 *
	 */
	___.prototype.setValueUpdated = function ___setValueUpdated(note, caller)
	{
		var data = this.getData();
		data.isUpdated = true;
		this.log('setValueUpdated', note, caller);				//log changed
	}
	//________________________________________________________________________________________
	/**
	 *	mark as updated if changed and set new value
	 *	only save if changed
	**/
	___.prototype.update = function(value, note, caller)
	{
		var data = this.getData();
		value = this.log('getInfo', value, note, caller).value;

		data.formattedLog = '';
		var isUpdated = data.isUpdated || this.isValueChanged(value);
		if (isUpdated)
		{
			data.isChanged = true;
			data.action = 'update'
			data.timestamp = data.timestamp_updated = EZ.format.dateTime();
			this.save(value, note, caller);		//save calls log.change
		}
		return isUpdated;
	}
	//__________________________________________________________________________________________________
	/**
	 *	not called by setValue, condictionally called by save or update
	**/
	___.prototype.isValueChanged = function ___isValueChanged(updatedValue)
	{
		var data = this.getData();
		var options = data.options;
		updatedValue = updatedValue || data.value;

		var formattedLog = EZ.equals(data.valueCloned, updatedValue, options.save.eqOpts) || EZ.equals.formattedLog;

		//======================================
		return data.formattedLog = formattedLog;		//saved for log.change
		//======================================
	},
	//________________________________________________________________________________________
	/**
	 *	always save even if no chahges -- use update to only save if changes
	**/
	___.prototype.save = function save(value, note, caller)
	{
		var data = this.getData();
		var options = data.options;
		value = this.log('getInfo', value, note, caller).value;

		data.action += '-save';

		data.formattedLog = '';
		var timestamp;
		if (__canSave())
		{
			if (false && options.sortKeysDepth)
				__sortKeys(data.value, options.sortKeysDepth);

			//=======================================================================
			DWfile.write(data.file.url, EZ.stringify(data.value, '*'));
			//=======================================================================
			data.action += (data.isPending ? '-pending' : '');
			data.action += (data.isChanged ? '-isChanged' : '');

			data.isChanged = '';
			data.isPending = '';
			timestamp = data.timestamp = EZ.format.dateTime('','ms');
		}
		else if (data.isUpdated || this.isValueChanged(value))
		{
			data.isPending = true;
		}
		data.valueCloned = __.cloneValue(value);
		this.log('save', value, note, caller);
		if (timestamp)
			data.timestamp_saved = timestamp;
		//__________________________________________________________________________________________________
		/**
		 *	Only called if data changed
		 */
		function __canSave()
		{
			var why = '';
			while (EZ.test.app.state != 'reload' && !quit.reload)
			{
				if (EZ.debug.isSaveSuspended())
				{
					why = 'all saves suspended';
					break;
				}
				var noSaveId = data.noSaveId;
				if (typeof(noSaveId) != 'boolean')
				{
					var fieldValues = EZ.get(EZ('nosave', true)).valueMap;
					if (noSaveId in fieldValues)
					{
						//if (fieldValues.debugNoSaveData)
						{
							if (fieldValues[noSaveId])
							{
								why = 'No Save checked ';	// + noSaveId + ' not';
								break;
							}
						}
					}
					else if (data.noSaveId && !data.noSaveId.checked)
					{
						why = noSaveId + ' not checked';
						break;
					}
				}
				break;
			}
			data.noSaveWhy = why;
			return data.canSave = !why;
		}
		//______________________________________________________________________________________________
		/**
		 *	TODO:
		 *		sortKeysDepth
		 *		originally created for mru -- needs recursive refactor
		 *
		 *	EZ.sortKeys refactor candidate
		**/
		function __sortKeys(obj /*, sortKeysDepth */)
		{
			[].sortPlus.call(obj);				//sort top 3 levels - debug convience
			Object.keys(obj).forEach(function(key)
			{
				if (obj[key] instanceof Array && !(obj[key] instanceof Object)) return;
				[].sortPlus.call(obj[key])
				var o = obj[key];
				Object.keys(o).forEach(function(key) {
					if (o[key] instanceof Array && !(o[key] instanceof Object)) return;
					[].sortPlus.call(o[key])

					var oo = o[key];
					Object.keys(oo).forEach(function(key) {
						if (oo[key] instanceof Array && !(oo[key] instanceof Object)) return;
						if (key === '')
							delete oo[key];
						else
							[].sortPlus.call(oo[key])
					});
				});
			});
		}
	}
	//__________________________________________________________________________________________________
	/**
	 *	call when data loaded or saved -- updated title with timestamp if specified
	 */
	___.prototype.log = function ___log(action, value, note, caller, logOptions)
	{
		var data = this.getData();
		var options = data.options;
		var logInfo = _getInfo.call(this, arguments)		//updates: action, value, note, caller, logOptions
		switch (action)
		{
			case 'getInfo':
			{
				logInfo.value = logInfo.value || data.value;
				return logInfo;
			}
			case 'setup':	return _log_setup.call(this);
			case 'setTitle':return _log_setTitle.call(this);
		}
		if (!logInfo.logTag) return logInfo;	//actions require logTag

		switch (action)
		{
			case 'clear': 	return _log_setTitle.call(this, 'reset');
			case 'value':
			case 'message':	return EZ.log.addDetails.call(logInfo);

			case 'change':
			case 'setValueUpdated':
												/* jshint ignore:start*/	//FALL-thru
				data.valueCloned = '';
												/* jshint ignore:end */
			case 'save':
			case 'setValue':
			case 'update':
			case 'setValue':
			{
				return _log_change.call(this);
			}
			case 'future':
			{
				break;
			}
			default:	return EZ.oops('unknown log action: ' + action)
		}
		return;
		//______________________________________________________________________________________________
		/**
		 *
		**/
		function _getInfo(args)
		{
			if (typeof(value) == 'function')
			{
				caller = value
				value = note = '';
			}
			else if (typeof(value) == 'string')
			{
				caller = note
				note = value;
				value = undefined;
			}
			if (typeof(note) == 'function')
			{
				caller = note
				note = '';
			}
			note = note || '';
			
			logOptions = args[args.length-1];
			if (EZ.getType(logOptions) != 'Object')
				logOptions = {};

			var logTag = EZ.log.isActive('saveData', 'page') && this.getTag('dataFileLogDetails');
			var logInfo = {
				logTag: logTag,
				action: data.action.replace(/(\w+).*/, '$1') || action,
				value: value,
				note: note,
				logOptions: logOptions,
				timestamp: ' @ ' + EZ.format.time('ms'),
				icon: {},
				formatter: options.log.objects.formatter,
				formatOpts: options.log.objects.formatOpts

			}
			var exclude = this.getFunctionNames().concat(['_getInfo']);
			caller = EZ.getCaller(caller, exclude);
			
			logInfo.name = EZ.SPACE.dup(3) + caller + '()';
			logInfo.stackHTML = caller.html;
			
		//	logInfo.stack = (data.options.log.change.stack) ? caller.stack
		//				  : 'set options.log.change.stack=true for stacktrace'
			return logInfo;
		}
		//______________________________________________________________________________________________
		/**
		 *
		**/
		function _log_setup()
		{
			note = 'setup';

			_log_setTitle()
			logInfo.openDetails = logInfo.closeDetails = false;

			_log_object(options, name, 'EZ.dataFile.options' + data.key.wrap('[]'));
			_log_object(data.valueLoaded, '', 'data loaded');
//			_log_object(EZ.sync, '', 'EZsync_log' + (EZ.returnValue.log.sync.count || '').wrap('[]'));
			
			/*
			//===============
			if (true) return;
			//===============
			var stack = EZ.stack(arguments.callee)
			var callerName = (stack.lines[2].formatStack()+'' || '');	//.trim();

			var msg = 'setup ' + key.pad(12)
				+ ' [saved @ ' + EZ.format.dateTime('today time') + '] '
				+ (callerName || '');

			EZ.log.call('saveData', msg, caller)
			*/
		}
		//__________________________________________________________________________________________________
		/**
		 *
		**/
		function _log_object(obj, name, notable)
		{
			delete logInfo.detailsHead;
			delete logInfo.detailsBody;
			delete logInfo.summary;
			logInfo.icon.class = 'invisible';
			logInfo.value = obj;
			logInfo.note = name || '';
			logInfo.notable = notable || '';
			logInfo.formatter = options.log.objects.formatter;
			logInfo.formatOpts = options.log.objects.formatOpts;
			EZ.log.addDetails(logInfo)
		}
		//__________________________________________________________________________________________________
		/**
		 *
		**/
		function _log_setTitle()
		{
			//options.log.compare.eqOpts = EZ.options(options.eqOpts, options.log.compare.eqOpts);
			var timestamp = data.timestamp_saved || data.timestamp_loaded;
			var title = EZ.format.dateTime(timestamp, '@');
			switch (note)
			{
				case 'setup':
					if (data.valueCloned) return;
					title = 'no data loaded';
					break;

				case 'init':
					title = '(1st loaded) -- saved ' + title;
					data.compare.valueHistoryEquals = [''];
					data.compare.valueHistoryTitle = ['1st loaded'];
					data.compare.valueHistory = [data.valueCloned];
					break;

				case 'reset':
				{
					data.compare.valueHistoryEquals.slice(-1);
					data.compare.valueHistoryTitle.slice(-1);
					data.compare.valueHistory.slice(-1);
					title = 'value updated ' + title;
					break;
				}
				default: title = logInfo.action;
			}
			if (logInfo.logTag)
			{
				this.setTag('dataFileLogHeading', 'changes to file ' + title);
				var offsets = EZ.getOffsets('mruSaveStatusTitle');
				var maxWidth = offsets.browser.width - offsets.right - 12;
				logInfo.logTag.style.maxWidth = maxWidth + 'px';
			}
		}
		//__________________________________________________________________________________________________
		/**
		 *	called by update, save, setValue or logChange
		 *	display value change from last call -or- last save
		**/
		function _log_change()
		{
			var clone = data.valueCloned;
			var timestamp = EZ.format.time('@ ms');
			//	timestamp = EZ.format.dateTime(data.timestamp,'@ ms');

			logInfo.iconTitle = 'full compare via winmerge with last displayed value';
			logInfo.summaryClass = 'summary';
			var priorHeadTags = [this.getTag('dataFileLogHeading')].concat(logInfo.logTag.EZ(['summary'], null));
			EZ.removeClass(priorHeadTags.remove(), ['highlight', 'roundLess']);

			logInfo.icon.class = 'unhide';
			var count = data.compare.valueHistory.length;
			var notable = count;
			var equalsNote = '';

			value = value || data.value;						//1st compare to last logged value
			var priorValue = data.compare.valueHistory[data.compare.valueHistory.length-1];

			var formattedLog = EZ.equals(priorValue, value, options.log.change.eqOpts)
							|| EZ.equals.formattedLog;

			if (formattedLog === true)
			{													//bail if same as last logged value
				if (action != 'save')							//...and not calld from save
					return data.compare.skips++;

				equalsNote = data.compare.valueHistoryEquals[notable-1];
				if (equalsNote.includes('equals'))
					notable = '';
				else
					equalsNote = 'equals '

				formattedLog = data.formattedLog || this.isValueChanged()
				if (formattedLog === true)						//if samed as last saved value...
				{
					timestamp = EZ.format.dateTime(data.timestamp_saved || data.timestamp_loaded, '@');
					logInfo.icon.class = 'invisible';
					formattedLog = ['no changes from file saved ' + timestamp];
					//logInfo.detailHead = 'no TRACKED changed from file saved ' + timestamp;
					logInfo.closeDetails = false;
				}
				else 											//otherwise show diff from last saved value
					logInfo.iconTitle = 'full compare via with last SAVED value winmerge';
			}
			else												//check if equal to any history value
			{
				data.compare.valueHistory.slice(0,-1).every(function(value, idx)
				{
					if (!EZ.equals(value, data.value, options.log.change.eqOpts))
						return true;

					equalsNote = 'equals '
					notable = (idx === 0) ? data.compare.valueHistoryTitle[0] : idx;

					logInfo.summaryClass += ' highlight roundLess';
					EZ.addClass(priorHeadTags[notable], logInfo.summaryClass);
				});
			}
			count = count.pad(2);
			if (data.compare.skips)
				count += '/' + data.compare.skips.pad(-2);
			this.setTag('updatesCount', count);
			if (data.compare.skips >= 99)
				data.compare.skips = 0;

			notable = equalsNote + (notable ? notable.wrap('()'): '');

			data.compare.valueHistoryEquals.push(notable);
			data.compare.valueHistoryTitle.push(timestamp);
			data.compare.valueHistory.push(clone || __.cloneValue(value));

			logInfo.notable = notable;
			logInfo.detailsHead = formattedLog.shift(),
			logInfo.detailsBody = formattedLog.join('\n')

			logInfo.timestamp = timestamp;

			var args = data.key.wrap("'") + ',this,' + count+''	//compare args: 'key', this, historyIdx
			logInfo.icon.onClick = "window.EZ.dataFile.compare(" + args + ")";

			EZ.log.addDetails(logInfo);
		}
	}
	//__________________________________________________________________________________________________
	/**
	 *
	**/
	___.compare = function ___compare(key, el, idx)
	{
		var data = ___.getData(key);
		var options = data.options;
		if (el instanceof Element)
		{
			var compareOpts = {
				waitEl: el,
				formatter: options.log.compare.formatter,
				formatOpts: options.log.compare.formatOpts,
				dl: data.key + ' ' + data.compare.valueHistoryTitle[idx-1] + ' ' + (idx-1).wrap('()'),
				dr: data.key + ' ' + data.compare.valueHistoryTitle[idx] + ' ' + (idx).wrap('()')
			}
			EZ.compare(data.compare.valueHistory[idx-1], data.compare.valueHistory[idx], compareOpts);
			return;
		}
	}
	//______________________________________________________________________________________________
	//..............................................................................................
	})();	//end of prototypes
	//===========================================================================================
	// check for existing EZtest_dataFile Object
	//===========================================================================================
	___.getAllFileKeys = function ___getAllFileKeys()
	{
		return Object.keys(MANAGED_FILES);
	}
	___.getFileObject = function ___getFileObject(key)
	{
		var ctx = MANAGED_FILES[key += ''];
		if (ctx)								//if existing Object...
		{											//...reset global closure variables
			return ctx;
		}
		if (!ctx)						
		{											
			EZ.oops('invalid EZ.datafile argument: ' + key)
			throw 'invalid EZ.datafile key';		//EZdataFile or key required
		}
	}
	//______________________________________________________________________________________________
	/**
	 *	save all managed data files
	**/
	___.saveAll = function ___saveAll(keys, force, note, caller)
	{
		var message = [];
		if (arguments.length < 3)
		{
			if (typeof(keys) == 'string')
				keys = [keys];

			if (keys instanceof Object && !(keys instanceof Array))
			{
				note = force;
				force = keys;
				keys = Object.keys(keys);
			}
		}
		___.getAllFileKeys().forEach(function(key)
		{
			var fileObj = ___.getFileObject(key)
			var msg = key.wrap('[]') + ' \t EZ.dataFile: '
			
			if (force)
				msg += fileObj.save(note || 'saveAll', caller);
			else
				msg += fileObj.update(note || 'saveAll', caller);

			message.push(msg);
		});
		return message.format().join('\n');
	}
	//==============================================================================================
	__ = {
	_: function _____INTERNAL_functions_____(){},
	//______________________________________________________________________________________________
	/**
	 *
	**/
	cloneValue: function(obj)
	{
		return EZ.test.cloneHow(obj);
	},
	//..............................................................................................
	"~":""
	}	//end of internal functions
	//==============================================================================================
	EZ.common(___, _.defaultOptions);
	
	___.MANAGED_FILES = MANAGED_FILES;
	return ___
})();	//end of EZ.dataFile
//__________________________________________________________________________________________________
EZ.log.addDetails = function ___addDetails(options){
/*-------------------------------------------------------------------------------------------------{
----------------------------------------------------------------------------------------------------
}*/
	var _getTags, _getValues;
	var MAIN = function()
	{
		var logTag = options.logTag;
		if (!logTag) return;

		var tagValues = _getValues(options);
		var tags = _getTags(tagValues);				//create tag Object from options

		if (tagValues.closeDetails)					//close prior details
		{
			[].forEach.call(logTag.children, function(el)
			{  el.removeAttribute('open');	});
		}

		var node = EZ.createTag(tags, null);
		logTag.appendChild(node);					//append new details

		if (tagValues.openDetails)
			node.setAttribute('open', 'on');		//...and open

		node.scrollIntoViewIfNeeded();
		return node;
	}
	//==========================================================================================
	/**
	  *	http://stackoverflow.com/questions/5239758/css-truncate-table-cells-but-fit-as-much-as-possible	
	**/
	_getValues = function(options)
	{
		//options = {};
		//EZ.sync(options, tagValues, 'tagValues', 1);				//clone tagValues

		var defaultValues = {
			detailsHead: '...',
			detailsBody:  '...',
			icon: {
				class: 'hidden',
				src: "../images/compare.png",
				title: 'full compare via winmerge',
				onClick: 'void(0)'
			},
			action: '',
			timestamp: '',
			name: '',
			summary: '...',
			summaryClass: '',
			detailsClass: 'pre details',
			tooltipClass: 'hidden',
			note: '',
			notable: '',
			closeDetails: true,
			openDetails: true,
			value: '',
			stack: '',
			stackHTML: '',
			formatter: '',
			formatOpts: '',
			/* moved to css
			detailsWrapStyles: {
				fontSize: '12px',
				lineHeight: '12px',
				margin: '0 4px 0 3px',
				padding: '0 1px',
				overflow: 'auto'
			},
			detailsBodyStyle: {
				background: '#f1f1f1',
				border: '2px outset #ececec',
				borderRadius: '3px'
			}
			*/			
		}
		
		EZ.sync(options, defaultValues, '@+^', 1);
		if (options.summary == '...')					//use composite value for summary if not supplied
			options.summary = options.action + ' ' + options.timestamp + ' ' + options.name + options.note;
		//options.summary = options.summary.truncate(76, '...')

		if (options.detailsHead == '...')
			options.detailsHead = (EZ.getType(options.value) != 'Object') ? options.value + '' : '';

		if (options.detailsBody == '...')
		{
			
			var str = (EZ.getType(options.value) != 'Object') ? EZ.format.value(options.value,50)
															  : EZ.format.value(options.value, options);
			//		  EZ.toString(options.value, options.formatOpts);
			options.detailsBody = str;
		}
		options.detailsBody = options.detailsBody.replace(/&nbsp;/g, '');
		if (options.detailsBody)
			options.detailsClass += ' box';
			
		//console.log({options:options, sync:sync})

		if (options.stack || options.stackHTML)
			options.tooltipClass = 'hidden';
		return options;
	}
	/**
	 *
	**/
	_getTags = function(tagValues)
	{
		return {
			details: {
				nodes: {
					summary: {
						styles: {
							margin: '1px 2px 2px 1px',
							padding: '0px 0px 2px 2px'
						},
						//onclick: 'e=this.parentNode;setTimeout(function() {e.scrollIntoViewIfNeeded(true)}, 500)',
						onclick: 'setTimeout(function() {event.target.scrollIntoViewIfNeeded(true)}, 500)',
						nodes: {
							span: {
								class: tagValues.summaryClass,
								nodes: [
									{
										tagName: 'span',
										styles: {
											display: 'table-cell',
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											maxWidth: '500px'
										},
										nodes: {
											input: {
												class: tagValues.icon.class,
												type: "image",
												title: tagValues.icon.title,
												src: tagValues.icon.src,
												onclick: tagValues.icon.onClick
											},
											text: ' ' + tagValues.summary
										}
									},
									{
										tagName: 'span',
										class: "tooltip stall",
										styles: {
											paddingLeft: '10px',
											paddingRight: '18px',
											display: 'table-cell',
											width: "1%",		//triggers pseudo table width=100%
										},
										nodes: {
											a: {				//hack to keep tooltip from leaking when not displayed
												onclick: "window.EZ.removeClass(this.parentElement,'hover', "
													   + "window.EZ.toggleClass(this.nextElementSibling,'hidden').includes('hidden')"
													   + " )",
												nodes: {
													text: tagValues.notable
												}
											},
											code: {
												class: tagValues.tooltipClass,
												styles: {
													position: "fixed",
													right: '6px'
												},
												//onclick: "debugger;if (event.target.tagName == 'A') window.EZ.event.cancel(event,true)",

												innerHTML: tagValues.stackHTML,
												nodes: {
													text: tagValues.stack
												},
											}
										}
									}
								]
							}
						}
					},
					div: {
						class: 'floatClear ' +  tagValues.detailsClass,
						styles:'',
						nodes: {
							span: {
								styles: {
									color: '#cc0000',
									fontWeight: 'bold',
								},
								nodes: {
									text: tagValues.detailsHead,
								}
							},
							text: (tagValues.detailsHead ? '\n' : '')
								+ tagValues.detailsBody
								+ (tagValues.detailsBody ? '\n' : '')
						}
					}
				}
			}
		}
	}
	//==========================================================================================
	return MAIN()
}
//__________________________________________________________________________________________________
EZ.test.mruTests = (function _____EZtest_mruTests_____() {				
//{						
/*--------------------------------------------------------------------------------------------------{
EZ.test.mruTests(options) -- instanciated as "common class" EZmruTests class when script loaded.

Subsequently called by setup() to load most recent selections and populate Test select lists.

ARGUMENTS:
	options		(optional) Object containing one or more of the following properties:
					--currently none--


EZ.test.mruTests.folderSelected()	called by folderList.onChange() -- and mruTests.load()
EZ.test.mruTests.fileSelected()		called by fileList.onChange()
EZ.test.mruTests.functionSelected()	called by functionList.onChange()

EZ.test.mruTests.setTestCallCount()	called by setupTestScriptFinish() if / after test test loaded

TODO:
--------------------------------------------------------------------------------------------------
}*/										//following global variables availible to all internal
	var topContext;						//and Object functions since the are all closures.

	var options, data;					//options initialzed by _init()

	var defaultOptions = function()
	{
		return {
			keep: ['recentTestList', 'recentTestListLimit'],

			mruFile: null,
			state: 'init',
			dataFileOptions: {
				key: 'mru',
				name: 'recent selections',	//mruTest.js
				sortKeysDepth: 4,
				save: {
					exclude: 'set',
				},
				log: {
					change: {
						eqOpts: {
							exclude: 'set ._filename, ._functionName, ._selectedList, timestamp',
						}
					},
					objects: {
						formatter: 'EZtoString',		//objects
						formatOpts: {
							timestamp: false,
							exclude: ['file','tags'],
							include: ['file.url'],
							htmlFormat: 'brief'
						}
					}
				},
				tags: {
					saveStatus: 'mruSaveStatus',
					saveStatusTitle: 'mruSaveStatusTitle',
					updatesCount: 'mruUpdatesCount',
					noSaveId: 'debugNoSave_mruTests',
					dataFileLogHeading: 'mruLogHeading',
					dataFileLogDetails: 'mruLogDetails'
				}
			},
			listSize: 15,
			recentLimit: 10,
											//TODO: populated after global Object created BY BELOW
			tags: {							//		onLoad="window.EZ.options.set('test.mruTests.tags.fnList_timestamp', this)"
				fnList_timestamp: '',
				excludeList: '',
				excludeListRegRxp: '',
				updatesCount: 'mruUpdatesCount',
			},								//USES key if property not defined

			fileListRecentHeading: '',		//part of topInfo displayed on top right of page
			functionListRecentHeading: ''
		}
	}
	/*
	var work;
	var defaultWork = function() 		//defines all fields save
	{
		return {
			tags: {}
		}
	}
	*/
	//______________________________________________________________________________________________
	/**
	 *	all global data Objects and properties defined below
	 *
	 *	Object created or synced using properties returned by associated functions defined befow.
	 *	insure all expected properties exist and deprecated properties deleted.
	**/
	var mruDATA;						//convenience reference for EZ.dataFile mruTests Object

	var message = '';
	var folderList, fileList, fnList;	//initialized by EZ.mruTests.setup()

	var folder, filename, functionName
	var folderInfo, fnInfo;

	var scriptData = '';				//passed to setupTestScript() -- set by _setMRU()
	var setScriptData = function()		//called from _setMRU(folder, filename)
	{
		scriptData = {
			url: folderInfo.url + filename,
			resultsFolder: folderInfo.resultsFolder,
			external_file: fnInfo.resultsFolder.url + '/' + functionName + '/SCRIPTS.js'
		}
	}

	var fileLists = {};					//filelist for each folder create 1st time folder selected
										//not saved too cheap to biild

	var mru = {};						//saved data:
	var defaultData = function() 		//defines all fields save
	{
		return {
			_folder: '',
			_filename: '',
			_functionName: '',
			_selectedList:{},			//last selected file or fn for each folder or folder:filename
										//...folder used for last selected folder
			folderInfo: {},				//for each folder: most recently selected files
			fnLists: {},				//for each filepath: function dropdown (value/text/selectrf)
										//					 linenos, recent, timestamp, url
			timestamp: 'NA',

			recentTestList: [],			//most recent test functions
			recentTestListLimit: 10,	//...not deleted when above mru recent selections cleared...
		}
	}
	var FolderInfoDefault = function()
	{									//folderInfo[folder]
		return {						//folders properties for each folder
			recent: [],
			url: ''
		}
	}
	var fnInfoDefault = function()
	{									//fnInfo[folder][filename]
		return {						//test script properties for each script file
			functionList: [],
			resultsFolder: '',
			listStatus: '',
			buildSeconds: '',
			recent:	[],
			test_counts: {},
			timestamp: 0
		}
	}

	var fileListOptions = function(folderInfo, filename)
	{
		var opts = {
			itemList: fileLists[folder],
			recentList: folderInfo.recent,
			selectedItem: filename,
			listSize: options.listSize,
			listRecentHeading: options.fileListRecentHeading,
			callback: ___.callback
		}
		return opts;
	}
	var fnListOptions = function(fnInfo, functionName)
	{
		var opts = {
			itemList: fnInfo.functionList,
			recentList: fnInfo.recent,
			selectedItem: functionName,
			listSize: options.listSize,
			listEmptyHeading: fnInfo.listStatus,
			listRecentHeading: options.functionListRecentHeading,
			test_counts: fnInfo.test_counts,		//passed to itemFormatter()
			itemFormatter: _fnItemFormatter,
			callback: ___.callback
		}
		return opts;
	}

	//__________________________________________________________________________________________________
	/**
	 *	constructor for _init() -- if not called as constructor... "this" is EZ.test
		if (this instanceof arguments.callee)	//called as constructor -- return new Object
	 */
	var ___ = function EZmruTests()
	{
		if (topContext === undefined)			//called by _init()
			return this;

		EZ.timer('screen update',true);			//initialize global variables requiring document DOM

		folderList = EZ('folderList');
		fileList = EZ('fileList');
		fnList = EZ('functionList');

		options.fileListRecentHeading = fileList.options[0].text,
		options.functionListRecentHeading = fnList.options[0].text
//debugger;
		options.mruFile = EZ.filePlus(EZ.test.config.testdataFolder, 'EZtestAssistant.MRUtests.js'),
		options.dataFileOptions.file = options.mruFile;

		mruDATA = new EZ.dataFile(options.dataFileOptions.key, options.dataFileOptions);
												//get data Object created from json loaded by EZ.data()
		mru = data = mruDATA.getValueObject();	//...can modify directly

		g.mruDATA = topContext._DATA = mruDATA;	//mru testData Object
		g.data =	topContext._data = data;	//saved data Object --

		_displayRecentRunTest();
		setTimeout(EZ.test.mruTests.folderSelected, 0);
	}
	//______________________________________________________________________________________________
	/**
	 *	compare snapshot
	**/
	___.update = function ___update()
	{
		//var callerName = arguments.callee.caller.arguments.callee.caller.name;
		//var callerName = ___update.caller.caller.name; 
		
		var caller = EZ.getCaller(2); 			//not tested
		mruDATA.updateValue(data, caller);
	}
	//______________________________________________________________________________________________
	/**
	 *	save MRUtests.js
	**/
	___.save = function ___save()
	{
		mruDATA.save();
	}
	//______________________________________________________________________________________________
	/**
	 *	dispatcher
	**/
	___.prototype.callback = function __callback(msg)
	{
		mruDATA.log('change', 'callback',  EZ.getCaller());
		msg = msg || message;
		message = '';
		if (msg)
			return setTimeout(function() {ready(msg)}, 0);

		if (!filename || filename == '*')
			return setTimeout("EZ.test.mruTests.folderSelected()", 0);

		if (!functionName || functionName == '*')
			return setTimeout("EZ.test.mruTests.fileSelected()", 0);

		if (!scriptData)
			return setTimeout("EZ.test.mruTests.functionSelected()", 0);

		return setTimeout(function() 
		{ 
			setupTestScript(functionName, scriptData) 
		}, 0);
	}
	//==============================================================================================[1]
	/**
	 *	populate or update fileList dropdown -- initially called by setup subsequently
	 *	subsequently called when folderList option clicked
	**/
	___.prototype.folderSelected = function ___folderSelected()
	{
		folder = EZ.get(folderList);
		do
		{
			var filenameMRU = _setMRU('folder')
			if (filenameMRU === false)
				break;

			if (!filename && filenameMRU)
				filename = filenameMRU;

			var items = fileLists[folder];
			if (!items)									//rebuild filename list 1st time selected
			{
				items = DWfile.listFolder(EZ.constant.configPath + folder + '/*.js');
				items = _getExcludeFiles(items);
				if (!items)								//invalid RegExp -- wait for user
					break;
				fileLists[folder] = items.sortPlus();	//case-insensitive sort
			}

			//========================================================================================
			var recentList = _updateDisplay(fileList, fileListOptions(folderInfo, filename));
			//========================================================================================

			folderInfo.set('recent', recentList.slice(), folderInfo.recent);
			message = message || recentList.message;
			filename = recentList.selectedItem;

			if (recentList.action == 'callback')
				return;								//callback pending

			if (filename)
				_setMRU(folder, filename);
			else
				message = 'select filename';
		}
		while (false)
		___.callback();
	}
	//==============================================================================================[2]
	/**
	 *	populate or update fileList dropdown -- called fileList clicked() -OR-
	 *	after folder changed and MRU filename defined for selected folder.
	 *
	 *	moves selected filename to top, updates recentList then populates functionList -and-
	 *	auto selects function if MRU function know for selected folder/filename.
	**/
	___.prototype.fileSelected = function ___fileSelected()
	{
		filename = EZ.get(fileList);
		do
		{
			if (_setMRU('folder') === false)			//gets folderInfo if not false
				break;									//message set

			if (_setMRU('filename') === false)			//message set
				break;
			//========================================================================================
			var recentList = _updateDisplay(fileList, fileListOptions(folderInfo, filename));
			//========================================================================================

			folderInfo.set('recent', recentList.slice(), folderInfo.recent);
			message = message || recentList.message;
			filename = recentList.selectedItem;

			if (filename)
				_setRefreshTime(fnInfo.timestamp);

			if (recentList.action == 'callback')
				return;								//callback pending

			_setMRU('filename');
		}
		while (false)
		if (filename)
			functionName = _setMRU('filename');

		if (!message)
				return _displayFunctionList();
		//	else
		//		message = 'select function for ' + filename;
		//}
		___.callback();
	}
	//==============================================================================================[3a]
	/**
	 *	internal function called by ___fileSelected() or _buildFunctionList()
	 *	if functionName defined, after _updateDisplay(), callback() dispatcher calls setupTestScript()
	**/
	var _displayFunctionList = function ___displayFunctionList()
	{
		do
		{											//gets fnInfo if not false
			var functionNameMRU = _setMRU('filename')
			if (functionNameMRU === false)			//filename not selected -- message set
				break;

			functionName = functionNameMRU || '';

			if (!fnInfo.functionList || !fnInfo.listStatus || Number(fnInfo.buildSeconds) < 0.250
			|| fnInfo.functionList[0] instanceof Array)
				return _buildFunctionList();

			//========================================================================================
			var recentList = _updateDisplay(fnList, fnListOptions(fnInfo, functionName));
			//========================================================================================

			fnInfo.set('recent', recentList.slice(), fnInfo.recent);
			message = message || recentList.message;

			functionName = recentList.selectedItem;

			if (recentList.action == 'callback')	//callback pending
				return;

			_setMRU('functionName');
		}
		while (false)
		___.callback();
	}
	//==============================================================================================[3b]
	/**
	 *	called after function selected from functionSelected()
	 *	populate or update functions dropdown -- called from fileSelected() when file clicked
	 *
	 *	update selectedList
	 *	update recent (mru data and dropdown)
	 *	update lineno
	**/
	___.prototype.functionSelected = function ___functionSelected()
	{
		functionName = EZ.get(fnList);
		do
		{
			if (_setMRU('filename') === false)
				break;									//message set

			//========================================================================================
			var recentList = _updateDisplay(fnList, fnListOptions(fnInfo, functionName));
			//========================================================================================

			fnInfo.set('recent', recentList.slice(), fnInfo.recent);
			message = message || recentList.message;
			functionName = recentList.selectedItem;

			if (recentList.action == 'callback')		//callback pending
				return;

			_setMRU('functionName');					//sets scriptData or message
		}
		while (false)
		___.callback();
	}
	//================================================================================================[4]
	/**
	 *	called after test calls found from setupTestScriptFinish()
	**/
	___.prototype.setTestCallCount = function ___setTestCallCount(count, funcName)
	{
		if (!count || !fnList.options.length)
			return;

		var idx = fnList.selectedIndex;
		if (idx == -1 || fnList.options[idx].value != funcName)
			return;

		var text = fnList.options[idx].text.replace(/\(.*\)/, count.wrap('()'));
		fnList.options[idx].text = text;

		if (!fnInfo) return;

		fnInfo.test_counts[name] == count;
		mruDATA.update();
		/*
		if (fnInfo.test_counts[funcName] != count)
		{
			fnInfo.test_counts[name] == count;
			mruDATA.setValueUpdated(' [test_counts] ' + arguments.callee.name);
			___.save();
		}
		*/
	}
	//______________________________________________________________________________________________
	/**
	 *
	 */
	___.prototype.refreshList = function ___refreshList(el)
	{
		var action = (el instanceof Element) ? el.value : 'script';
		if (action == 'script')
		{
			_setMRU('filename');
			_buildFunctionList();
		}
	}
	//______________________________________________________________________________________________
	/**
	 *	updates most recently run test from any folder / file
	 *	displayed by mruTests constructor
	**/
	___.prototype.updateTestList = function ___updateTestList()
	{
		var regex = RegExp('^<a href="#">' + functionName + '</a>'
				  + '\\s+' + filename + '\\s+' + folder
				  + "\\s*\\[(\\d*)\\].*\\s*","m");
		var count = 1;
		var list = (data.recentTestList || '').join('\n');
		list = list.replace(regex, function(all,c)
		{
			count += Number(c);
			return '';
		});
		list = '<a href="#">' + functionName + '</a> \t' 
			 + filename + ' \t' + folder
			 + ' \t' + count.wrap('[]') + ' \t' + EZ.format.dateTime()
			 + '\n' + list;

		data.recentTestList = list.trim().split('\n');
		
		var limit = EZ.toInt(EZ.get('recentTestListLimit'), 20);
		data.recentTestList.length = Math.min(limit, data.recentTestList.length);
	}
	//_________________________________________________________________________________________________
	/**
	 *	called by init
	**/
	function _displayRecentRunTest()
	{
																//display recent test functions
		var title = ['Function    \t Filename    \t Folder    \t runs \t last time tested...'];
		var lines = title.concat(data.recentTestList).format();
		EZ.set('recentTestListCount', (lines.length-1).wrap('[]'));
		
		lines[0] = lines[0].wrap('<b class="pre">');
		EZ('recentTestList').innerHTML = lines.join('\n');
	}
	//______________________________________________________________________________________________
	/**
	 *	called from delete icon (debug mode)
	**/
	___.resetAll = function ___resetAll(what)
	{
		if (true) return EZ.todo()
		switch (what)
		{
			case 'recentSelected':
			{
				break;
			}
			case 'recentRunTests':
			{
				break;
			}
			default:	return EZ.oops('unknown action: ' + what)

		}

		var mruDefault = defaultData();
		for (var key in data) 						//preserve data global
			if (!mruDefault.keep.includes(key)) delete data[key]
		for (var key in mruDefault)					//preserve data global
			if (key != 'keep') data[key] = mruDefault[key];

		folderList.selectedIndex = -1;
		EZ.clearList(fileList);
		EZ.clearList(fnList);
		folder = filename = functionName = '';
		message = 'cleared all saved recent selection';
	}
	//______________________________________________________________________________________________
	/**
	 *	called when RegExp filter changed
	**/
	___.resetFolders = function ___resetFolders(el)
	{
		options.excludeList = el.value;
		fileLists = [];

		EZ.clearList(fileList);
		EZ.clearList(fnList);
		filename = functionName = '';
		___.folderSelected()
	}

	//_________________________________________________________________________________________________
	e = function _____shared_internal_functions_____() {}
	//______________________________________________________________________________________________
	/**
	 *	Power-house EZ.displatDropdown() wrapper to updating select lists with recent selections
	 */
	var _updateDisplay = function _____updateDisplay_____(list, options)
	{
		var action = '';									//defined if redisplay required
		var items = (options.itemList || []).remove(['', '-']).removeDups();
		var selectedItem = options.selectedItem;
		var rtnValue = {
				action: '',
				options: options,
				message: '',
				selectedItem: selectedItem,
				listHeading: '',
				items: items,
				listOptions: {}
		}
		var recentList = options.recentList.extract(items);
		var selectedIdx = list.selectedIndex;
		var selectedValue =  (selectedIdx != -1) ? list.options[selectedIdx].value : undefined;
		do
		{
			var dashOpt = list.EZ('listOptionsSeparator', null);
			if (dashOpt)
				EZ.removeClass(dashOpt, 'listOptionsSeparator');

			if (selectedValue == '-')
			{
				rtnValue.message = 'no selections available';
				break;
			}
			if (selectedValue == '*')
			{
				recentList = [];
				action = 'recentReset';
				rtnValue.message = 'recent selections cleared';
			}
			else
			{
				var idx = recentList.indexOf(selectedItem);
				if (idx != -1) recentList.splice(idx,1);
				if (selectedItem && items.includes(selectedItem))
					recentList.unshift(selectedItem);
				else
					selectedItem = rtnValue.selectedItem = '';

				if (recentList.length > options.recentLimit)		//if over-limit, re-display
				{
					recentList.length = options.recentLimit;
					action = 'recentLimit';
				}
			}
			items = rtnValue.items = recentList.concat(items.remove(recentList))


			if (recentList.length && options.listRecentHeading)
			{
				var text = EZ.s(options.listRecentHeading, recentList.length) + ' on top';
				rtnValue.listHeading = [text, '*', false, 'highlight'];
			}
			else if (options.listEmptyHeading)
				rtnValue.listHeading = [options.listEmptyHeading, '-', false, 'highlight empty'];

			if (items.length === 0)							//if no items, display empty prompt show
				list.selectedIndex = -1;
			/*
			{												//...empty prompt not already showing
				action = 'empty';
				break;
			}
			*/
			var offset = (list.options.length === 0) ? 0
				   	   : list.options[0].value.startsWith('*') ? 1 : 0;

			if (list.options.length < items.length + offset)
				action = 'empty';
															//TODO: isVisiable ??
			else if (list.selectedIndex >= (options.listSize-2) && recentList.length)
				action =  'reset';							//scroll to top

			else if (offset != rtnValue.listHeading)		//redisplay to show or hide heading
				action = (rtnValue.listHeading ? 'show' : 'hide') + ' heading ';

			else if (!selectedItem)
				list.selectedIndex = -1;

			else
			{
				if (list.selectedIndex == -1 && selectedItem)
					EZ.set(list, selectedItem);

				if (list.selectedIndex != offset)				//1st option is (optional) heading
				{												//make selected item not 2nd option,
					//--------------------------------------------------------
					EZ.selectOption.move(list, list.selectedIndex, offset);
					//--------------------------------------------------------
					list.size = Math.min(options.listSize, list.options.length);
				}
				else if (list.options.length > recentList.length)	//add separator class if any items
				{													//... after recent items
					var dashIdx = recentList.length + offset;
					if (dashIdx < list.options.length)
						EZ.addClass(list.options[dashIdx], 'listOptionsSeparator');
				}
			}
		}
		while (false)

		rtnValue.action = action;
		rtnValue.selectedItem = selectedItem;
		EZ.sync(recentList, rtnValue, '-+@rtnValue');

		if (action && options.itemFormatter)			//call itemFormatter if specified
			items = options.itemFormatter(items, options);

		var listOptions = rtnValue.listOptions = {
			sep: recentList.length,
			size: options.listSize
		}

		if (rtnValue.listHeading)						//if list heading...
		{
			if (listOptions.sep)
				listOptions.sep++;
			if (action)						//...prepend -or-
				items.unshift(rtnValue.listHeading);
			else if (!action)							//...update recent heading
				list.options[0].text = rtnValue.listHeading;
		}

		if (action == 'reset')							//if list scrolled
		{												//...scroll to top so heading in view
			EZ.clearList(list)							//TODO: scroll into view ??
			setTimeout(function()
			{
				EZ.displayDropdown(list, items, selectedItem, listOptions);
				options.callback(recentList);
			}, 250);
		}
		else if (action)
		{
			EZ.removeClass(list, ['invisible', 'dimMore']);
			EZ.displayDropdown(list, items, selectedItem, listOptions);
		}
		//================
		return recentList;								//dropdown may not be displayed
		//================
	}
	//______________________________________________________________________________________________
	/**
	 *
	**/
	function _fnItemFormatter(items, opts)
	{
		var counts = opts.test_counts;
		var itemList = [];
		items.forEach(function(value)				//expand each name to Array of the form:
		{											//	 [text, value, selected, className]
			var text = EZ.SPACE + value;
			var className = '';
			if (value.endsWith('.SCRIPT'))			//external script
			{
				text = EZ.DOT + value.clip(7);				//prepend DOT to value
				className = 'external';				//...and set className
			}
			var cnt = counts[value] || '';
			text += cnt.wrap('()');

			itemList.push( [text, value, '', className] );
		});
		return itemList;
	}
	//______________________________________________________________________________________________
	/**
	 *
	 */
	function _buildFunctionList()
	{
		EZ.addClass(fnList, 'dimMore');
		if (EZ.message.wait('building list', 'functionListWait', this))
			return;

		var functionList = [];
		var test_counts = {};
		var startTime = new Date();
		//=============================================================================
var filePath = folder.replace(/.*\/(.*)/, '$1') + '/' + filename;
var resultsFolder = EZ.filePlus(EZ.test.config.testdataFolder + filePath);
		var scriptFiles = DWfile.listFolder(resultsFolder.url + '/*.SCRIPT.js');
		//=============================================================================
		scriptFiles.forEach(function(name)		//find external test scripts
		{
			var fileSize = 1;						//TODO: if not empty file
			if (!fileSize) return;
													//keep ".SCRIPT" suffix
			var value = name.clip(3); 				//but drop: ".js" file ext
			functionList.push(value);
			if (fnInfo.test_counts[value])
				test_counts[value] = fnInfo.test_counts[value];
		});

		//=============================================================================
		var scriptFile = EZ.filePlus(folder + '/' + filename);
		var script = DWfile.read(scriptFile.url);
		//=============================================================================
		var scriptFunctionList = EZ.getFunctionList(script);
		scriptFunctionList.forEach(function(fn)
		{												//find embedded test scripts
			if (fn.name.right(5).toLowerCase() == '.test')
			{
				var value = fn.name.clip(5);			//drop: ".test" from fn name
				functionList.push(value);
			}
		});
		var elapsedTime = new Date().getTime() - startTime;
		fnInfo.buildSeconds = EZ.format.seconds(elapsedTime);

		//					functions(371) scripts(27) lines:(12610)
		fnInfo.listStatus = 'functions:' + scriptFunctionList.names.length.wrap('()')
						  + ' scripts:' + functionList.length.wrap('()')
						  + ' lines:' + EZ.getLineCount(script, script.length).wrap('()')
		console.log(fnInfo.listStatus, fnInfo.buildSeconds, 'seconds')

		functionList.sortPlus();

		fnInfo.set('recent', fnInfo.recent.extract(functionList));

		fnInfo.set('resultsFolder', resultsFolder);
		fnInfo.set('functionList', functionList);
		fnInfo.set('test_counts', test_counts);

		var timestamp = new Date();
		fnInfo.set('timestamp', EZ.format.dateTime(timestamp));
		_setRefreshTime(timestamp, fnInfo.buildSeconds);
		_displayFunctionList(fnInfo);
	}
	//______________________________________________________________________________________________
	/**
	 *
	**/
	function _setMRU(action)
	{
		var note = '';
		var caller =  EZ.getCaller();
		var process = function()
		{
			var rtnValue = '';
			switch (action)
			{
				case 'folder':
				{
					var folderMRU = __getMRU();
					if (options.state == 'init')
					{
						options.state = 'called';
						folder = EZ.set(folderList,folderMRU);
						if (folder)
						{
							EZ.set(folderList, folder);
							filename = __getMRU(folder);
						}
					}
					if (!folder || folder != folderMRU)
					{
						filename = functionName = scriptData = '';
						EZ.clearList(fileList);
						EZ.clearList(fnList);
						if (folderMRU)
							resetTests();
					}
					if (!folder)
					{
						folderList.selectedIndex = -1;
						message = 'select folder';
						folderInfo = '';
						return false;
					}
					folderInfo = __getFolderInfo();
					data._folder = folder;
					
					rtnValue = __getMRU(folder);			//get mru filename for this folder
					if (data._selectedList[''] == folder) 
						return rtnValue;
						
					data._selectedList[''] = folder;
						
					if (!rtnValue)
					{
						folderList.selectedIndex = -1;
						message = 'select filename';
						fnInfo = '';
						return false;
					}

					break;
				}
				case 'filename':
				{
					var filenameMRU = __getMRU(folder);
					if (!filename || filename != filenameMRU)
					//if (filename && data._filename != filename)
					{
						functionName = scriptData = '';
						EZ.clearList(fnList);
						if (filenameMRU)
							resetTests();
					}
					if (!filename)
					{
						folderList.selectedIndex = -1;
						message = 'select filename';
						fnInfo = '';
						return false;
					}
					if (filename == '*')
						filename = __getMRU(folder)
					rtnValue = __getMRU(folder, filename);
					fnInfo = __getFileInfo();

					data._filename = filename;
					if (data._selectedList[folder] == filename) return rtnValue;
					data._selectedList[folder] = filename;
					break;
				}
				case 'functionName':
				{
					var functionNameMRU = __getMRU(folder, filename);
					if (!functionName || functionName != functionNameMRU)
					{
						scriptData = '';
						if (functionNameMRU)
							resetTests();
					}
					if (!functionName)
					{
						message = 'select function';
						return false;
					}

					setScriptData();

					data._functionName = functionName;
					var key = folder.concat(':', filename);
					if (data._selectedList[key] == functionName) return;
					data._selectedList[key] = functionName;
					break;
				}
			}
			//mruDATA.setValueUpdated();
			//================
			return rtnValue;
			//================
		}
		//_________________________________________________________________________________________________
		/**
		 *
		**/
		var __getMRU = function(folder, filename)
		{
			EZ.test.app.state = 'mru';									//prevent until until ready()
			var selected = data._selectedList || {};
			switch (arguments.length)
			{
				case 0: return selected[''] || '';
				case 1: return selected[folder] || '';
				case 2: return selected[ (folder || '').concat(':', filename) ] || '';
			}
		}
		//_________________________________________________________________________________________________
		/**
		 *
		**/
		function __isValueChanged(obj, dotName, key, value, currentValue)
		{
			if (key in obj === false)
				return EZ.oops('invalid key: ' + dotName + key);

			currentValue = currentValue || data.value;
			if (currentValue === undefined)				//prior value not specified
			{
				if (obj[key] === value) return;
			}
			else if (EZ.equals(currentValue, value))
				return;

			obj[key] = value;
		}
		[__isValueChanged]
		//__________________________________________________________________________________________
		/**
		 *	return folder properties from data.folderInfo[folder] -- create if necessary
		**/
		var __getFolderInfo = function()
		{
			var folderInfo = data.folderInfo[folder] = data.folderInfo[folder] || {};
			delete folderInfo.set;

			EZ.sync(folderInfo, FolderInfoDefault(), '@mru.folderInfo' + folder.wrap('[]'));

			folderInfo.set = function(key, value /*, currentValue */)
			{
				if (folderInfo[key] === value) return;

				folderInfo[key] = value;
				mruDATA.setValueUpdated('folderInfo.set[' + key + ']',  EZ.getCaller());



				//var dotName = 'folderInfo.' + folder + '.' + key;
				/*
				var isChanged = __isValueChanged(folderInfo, dotName, key, value, currentValue);
				if (!isChanged)
					return;
				*/
				//var name = dotName + key;
				//EZ.sync(folderInfo, FolderInfoDefault(),  '@' + name);
				//mruDATA.setValueUpdated(' mru.folderInfo.' + name + ' @ ' +  EZ.getCaller().name);
			}
			return folderInfo;
		}
		//__________________________________________________________________________________________
		/**
		 *	return data.fnLists item for folder / filename -- create if necessary
		**/
		var __getFileInfo = function()
		{												//create lists if NA TODO: EZ.sync ??
			var fnFolder = data.fnLists[folder] = data.fnLists[folder] || {};
			fnInfo = fnFolder[filename] = fnFolder[filename] || {};
			delete fnInfo.set;

			if (!fnInfo.resultsFolder)
			{
				var filePath = folder.replace(/.*\/(.*)/, '$1') + '/' + filename;
				fnInfo.resultsFolder = EZ.filePlus(EZ.test.config.testdataFolder + filePath);
				note = '[fnLists].resultsFolder created'
			}

			var name = 'mru.fnLists' + folder.wrap('[]')  + filename.wrap('[]');
			if (EZ.sync(fnInfo, fnInfoDefault(), '@' + name))
				note = 'fnInfo EZ.sync updated';

			mruDATA.log('change', note, caller);					//log changes if any
			//______________________________________________________________________________________________
			/**
			 *	updates fnInfo if value changed -- not sure of value with latest EZ.dataFile()
			 *	EZ.sync.getSet probably better
			**/
			fnInfo.set = function(key, value /*, currentValue */)
			{
				if (fnInfo[key] === value) return;

				fnInfo[key] = value;
				mruDATA.setValueUpdated('fnInfo.set[' + key + ']',  EZ.getCaller());
				/*
				var dotName = 'fnInfo.' + folder + '.' + filename + '.';
				var name = dotName + key;
				EZ.sync(fnInfo[key], fnInfoDefault(),  '@' + name);

				note = 'mru.fnLists.' + name
				//mruDATA.log('change', note, caller);
				//mruDATA.setValueUpdated( + ' @ ' +  EZ.getCaller().name);
				*/
			}
			return fnInfo;
		}
		//==========================================================================================
		return process();
	}
	//______________________________________________________________________________________________
	/**
	 *	return data.fnLists item for folder / filename -- create if necessary
	 */
	function _setRefreshTime(timestamp, seconds)
	{
		var tag = _getTag('fnList_timestamp')
		if (tag)
		{
			var note = (seconds) ? ' (' + seconds + ' seconds)' : '';
			timestamp = EZ.format.dateTime(timestamp, 'today time date');
			tag.setAttribute('data-title-suffix', timestamp + note);

			if (seconds)						//if updated show title for a bit
				EZ.addClass(tag, 'show=5000', timestamp);
		}
	}
	//______________________________________________________________________________________________
	/**
	 *
	 */
	function _getExcludeFiles(items)
	{
		//if (items && !EZ.get(data.tags.excludeList))
		//	return items;

		if (items) return items.remove(/( Copy|\.safe|\.work|\.after*|\.before*|\.deleteme)/);

		//var regex = EZ.get(data.tags.excludeListRegex).trim().replace(/\s+/g, '|');
		var regex = (EZ.get(_getTag('excludeListRegex'), null) || '').trim().replace(/\s+/g, '|');
		if (regex)
		{
			try
			{
				if (regex.includes('|'))
					regex = '' + regex.replace(/^\(/, '').replace(/\)$/, '') + ')'
				EZ.set('excludeListRegex', regex);
					regex = regex.replace(/\./g, '\\.');
				regex = RegExp(regex);

				//regex = /( Copy|\.safe|\.work|\.after*|\.before*|\.deleteme)/;
			}
			catch (e)
			{
				message = 'Invalid Regular Expression';
				EZ.displayMessage(message);
				EZ.removeClass('excludeListRegex','hidden');
				setTimeout("EZ('excludeListRegExp').focus()",500)
				return false;
			}
		}
		if (items)
			items.remove(regex);
		else if (regex)
			EZ('excludeList').checked = true;
	}
	//__________________________________________________________________________________________________
	/**
	 *	Internal function
	 */
	function _getTag(name)
	{
		if (!name || !options) return;
		options.tags = options.tags || {};

		var el = options.tags[name];
		if (el instanceof Element)
			return el;

		return options.tags[name] = EZ(el || name, null);
	}
	//__________________________________________________________________________________________________
	/**
	 *	creates topContext Object (pseudo class) -- valid constructor or can call a default function.
	 */
	var _init = function _init()
	{
		var fn = new ___();							//create Object -- copy new Object properties
		for (var key in fn) ___[key] = fn[key]		//including prototype functions
		topContext = ___;							//initialized after constructor called above

		options = defaultOptions(); 				//create global options save as topContext Object
		topContext.options = topContext._options = options;

		//topContext._data = data;
		/*
		EZ.event.add(window, 'onload', function()	//initialization requiring DOM
		{
		});
		*/
		return topContext;							//return updated topContext
	}
	//==================================================================================================
	return _init();
})();	
//}	end of EZ.mruTests
//________________________________________________________________________________________
EZ.logPlus.test = function()
{
	var msg, arr, ctx, arg, args, o, obj, note, ex, exfn, notefn, fn, val, rtnValue;
	e=[ msg, arr, ctx, arg, args, o, obj, note, ex, exfn, notefn, fn, val, rtnValue ];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//=======================================================================================
	/*NOTES:				do not prefix with *				displayed by EZtest Assistant

	*/
	exfn = function(testrun)
	{
		var msg;
		var results = testrun.getResults();
		//var rtnValue = testrun.getReturnValue();
		var options = testrun.getOptions();

		void(msg, results, rtnValue, options)
	}
	//=======================================================================================
	notefn = function(testrun)
	{
		e = testrun;
	}
	//=======================================================================================
	EZ.test.settings( {exfn:exfn} );
	//EZ.test.settings( {legacy:'exclude=isLegacy'} );
	//EZ.test.run(-2, 		{EZ: {ex:-2	,	note:note	}})
	//EZ.test.options( {ex:ex, note:note} )
	//EZ.test.run( ctx, arg, obj )
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	EZ.test.run('simply log message')
	EZ.test.run.call('myLog', 'simply log message')
	EZ.test.run.call('myLog', 'simply log message', 'myKey')
	//_______________________________________________________________________________________
	if (true) return;
	EZ.test.quit;	//script continues but all following test skipped
}	//end of EZ.logPlus.test
//__________________________________________________________________________________________________
EZ.fakeMore = (function _____EZfakeMore_____()
{
	//______________________________________________________________________________________________
	/**
	 *	global closure variables -- data structures
	 *______________________________________________________________________________________________
	**/
	var data, options
	[data, options]

	var defaultOptions = function()
	{
		return {
			colors: 'red yellow green',
		}
	}

	var defaultData = function()
	{
		return {
		}
	}
	//==============================================================================================
	/**
	 	constructor -- creates options, data and adds/binds EZ.returnValue functions

	 	change options:	resetOptions(options [,defaultOptions]), updateOptions(options)
		  ...option...	getOption(key [,defaultValue]), setOption(key, value)

	 	change data: 	resetData(data,defaultData), updateData(data)
	 	  ...value...	get(key, [,defaultValue]), set(key, value)
	 	  				getValue(key, [,format]), setValue(key, value)

		  toString()	setReturnValue()
		   valueOf()	setOk([value -- default true]), setFail() -- same as toString() until set
	**/
	//==============================================================================================
	var ___ = function EZfakeMore(options)
	{												//called as script loads
		if (!___._commonObj)			//called as script loads
			return this;
		
		if (arguments.callee.caller.name == "_initStatic") //!___['~seq']
			return this;

		var ctx = (this instanceof ___) ? this 		//if called as new ___(), carry on
										: new ___();//otherwise call new ___() then carry on
		//------------------------------------------------------------------
		var obj = EZ.returnValueV3.call(ctx, data);
		//------------------------------------------------------------------
		obj.resetOptions.call(obj, options, defaultOptions);	//setup options -- saved in data.options
		return obj;
	}
	//______________________________________________________________________________________________
	/**
	 *
	**/
	function _callback()
	{
	}
	[_callback];
	//______________________________________________________________________________________________
	/**
	 *	
	**/
	function initStatic(callback)
	{
		//--------------------------------------------------------------------------------------
		var obj = EZ.returnValueV3.call(___, defaultData(), callback);
		//--------------------------------------------------------------------------------------		
		//obj.resetOptions(options, defaultOptions);	//setup options -- saved in data.options
		return obj;
	}
	[initStatic]
	//______________________________________________________________________________________________
	/**
	 *
	___.prototype.toString = function()
	{
		var str = fnName + '()';
		if (CLASS && CLASS.$)
		{
			str = fnName + '(' + CLASS.$ + ')'
			if (CLASS._data)
				str += ': ' + CLASS._data["~note"];
		}
		return str;
	}
	**/
	//______________________________________________________________________________________________
	/**
	 *
	**/
	___.prototype.someProto = function someProto(value)
	{
		return 'someProto called with: ' + value;
	}
	//______________________________________________________________________________________________
	___.DATA = function _____bound_DATA_functions_____()
	{
		this.$data = function() {return data}
		this.someData = function ___someData(data, color)
		{
			[data, color]
			this.setOption('color', 'red')
			var options = this.getOptions();
			this.addMessage('good day to be alive')
			return options;
		}
	}
	//______________________________________________________________________________________________
	___.dotNameFun = function(obj)
	{
		if (obj == null)
		{
			var dotName = EZ.dotNameDev();
			return dotName.toString('o');
		}
		
		var o = {}
		var sync = EZ.sync(o,obj,'@?dotNameFun')
		return sync;
	}
	//______________________________________________________________________________________________
	/**
	 *
	**/
	___.something = function(options)
	{												//creates something.returnValue or appends to this
		var rtnValue = EZ.returnValueV3(this);		//if something called as constructor

		var options = rtnValue.resetOptions(options,defaultOptions);
		var options = EZ.returnValueV3.resetOptions(options,defaultOptions);

		var data = ___.getData(this);
		var data = rtnValue.getData();
		var data = EZ.returnValueV3.getData(this);	//this required if 1st EZ.returnValueV3() fn used
													//to extend this with returnValues functions
													//this ignored if not called as constructor
		[options, data];
		var isTestFunction = EZ.test.isTestFunction();
		[rtnValue, isTestFunction]
		void(0);
	}
	//==================================================================================================
	//debugger;
	//EZ.common(___,defaultOptions /* data, callback*/).caller;
	return ___;	
})();	//end of EZ.fakeMore
//___________________________________________________________________________________________
EZ.fakeMore.test = function()
{
	var msg, arr, ctx, arg, args, o, obj, note, ex, exfn, notefn, fn, val, rtnValue;
	e=[ msg, arr, ctx, arg, args, o, obj, note, ex, exfn, notefn, fn, val, rtnValue ];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//=======================================================================================
	/*NOTES:				do not prefix with *				displayed by EZtest Assistant

	*/
	exfn = function(testrun)
	{
		var msg;

		var results = testrun.getResults();
		var rtnValue = testrun.getReturnValue();
		var options = testrun.getOptions();

		void(msg, results, rtnValue, options)
	}
	//=======================================================================================
	notefn = function(testrun)
	{
		e = testrun;
	}
	//=======================================================================================
	EZ.test.settings( {exfn:exfn} );
	//EZ.test.settings( {legacy:'exclude=isLegacy'} );

	//_______________________________________________________________________________________
	//EZ.test.run(-2, 		{EZ: {ex:-2	,	note:note	}})
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//EZ.test.options( {ex:ex, note:note} )
	//EZ.test.run( ctx, arg, obj )

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	var fake;

	EZ.test.settings( {call:'new', note:''} )
	
	fake = EZ.test.run({girls: 'jane brenda'});
	if (fake) g.fake = fake;
	
	EZ.test.settings( {call:'', note:''} )

	EZ.test.run(g.fake, g.fake.someData, 'abc');
	EZ.test.run.call(g.fake, g.fake.someData, 'abc');

if (true) return;
EZ.test.quit;	//script continues but all following test skipped

	EZ.test.run(g.fake, g.fake.someProto, 'abc');


	obj = {	a:1, b: {x:7, y:8}, c:3 }
	EZ.test.run(g.fake, g.fake.dotNameFun, null);
	EZ.test.run(g.fake, g.fake.dotNameFun, obj);

	fake = EZ.test.run({colors: 'pink'});
	if (fake) g.fake = fake;


	//_______________________________________________________________________________________
}
//__________________________________________________________________________________________________
EZ.returnValueV3 = (function _____EZreturnValueV3_____(){
/*--------------------------------------------------------------------------------------------------{
Robust set of returnValue functions -- including standadized exclude, include and extract functionality.

Appends returnValue functions and data to new caller Object, creates and/or updates caller global static
returnValue (i.e. caller.returnValue) when caller not called as new Object -OR- if just called as new
EZreturnValue constructor, intializes and returns standalone EZreturnValue Object.

Originally used by: EZ.dotName() first added to EZ.equals(), EZ.toString() and EZ.sync() providing common
exclude, include and extract functionality along with common returnValue interface. Should easily port to
EZ.clonePlus() and JSON.plus.stringify/parse() and many more.

		if (this == arguments.callee.caller.arguments[0])
		{											//essoteric ___(this) -- reset globals
			var data = EZ.core.call(this);			//TODO: maybe with sync but variant of getData() better
		}
		//return data;								//return data object
--------------------------------------------------------------------------------------------------
}*/
	//______________________________________________________________________________________________
	/**
	 *	global variables and data structures
	 *______________________________________________________________________________________________
	**/
	var data, log, options;
	//----------------------------------------------------------------------------------------------
	var defaultData = function() {				//default data properties
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
	}}
	//----------------------------------------------------------------------------------------------
	var defaultOptions = function() {
	//----------------------------------------------------------------------------------------------
	return {
		
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
	var ___ = function EZreturnValue(updatedData)
	{
		if (!___["~cid"]) 
			return this;						//called as script loads to setup pseudo global class
		
		var caller = arguments.callee.caller

		if (caller == initReturnValue)
			return this;

		var cid = (!isNaN(updatedData)) ? updatedData : undefined;
		var ctx = this;
		/*
		var obj = caller;
		if (caller.name.includes("initStatic"))	//called by another fn while its script loads
		{											//...fall-thru to create global data / functions
			ctx = obj = this;
			cid = getCallerId(obj);
			initStatic.call(obj, obj, callback);
			caller = '';
		}
		*/
		if ( !(this instanceof caller) )			//ctx is not new Object -- so global caller.returnValue
		{											//...is updated -or- set to new EZreturnValue Object
			ctx = initReturnValue.call(caller, ctx, updatedData);
		}
													//extend new caller Object by adding EZreturnValue properties
													//...caller/returnValue data functions are bound to ctx._data
		cid = (cid !== undefined) ? cid : getCallerId(caller);
		initMeta.call(ctx, cid);

		if (!ctx._data || updatedData				//if no existing data or updated data supplied
		|| ctx._data['~cid'] != cid)				//...or data.~cid != ctx.~cid, add/updata data
			initData.call(ctx, updatedData);		//...ctx._data created or updated 

		initObject.call(ctx, caller, ctx._data);		//bind data functions to ctx and ctx._data, non-prototype
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
		var obj = this;							
		var caller = getCaller(cid)
		
		if (!obj['~cid']
		|| obj['~cid'] != cid)						
		{
			var seq = caller["~nextseq"]++;
			var meta = defaultMeta(cid,seq);
			EZ.sync(obj, meta, '@^', 0);
		}
		obj.isTest = (EZ.test && EZ.test.running == caller.name);
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
			//log.add.call(caller, 'bind', '[' + getName(ctx) + '] restored bound data functions: ' + dataFnKeys);
		}
		_bind(___.prototype);					//bind EZ.returnValue -- non-data functions
		_bind(___.data, data);					//bind EZ.returnValue -- data functions
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
[sync]		
		//log.add.call(this, 'sync', sync);

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
	___.data = {
	_: function _____Data_Functions_____(){},
	//________________________________________________________________________________________________
	/**
	 *	return status of function -- "na" unless setOk() or setFail() called
	 */
	isOk:function(data)
	{
		return data.success;
	},
	setOk: function(data)
	{
		return data.success = true;
	},
	setFail: function(data)
	{
		return data.success = false;
	},
	//________________________________________________________________________________________________
	/**
	 *	get/set data property
	 *		get returns defaultValue if no existing but does NOT update data
	 *		set updates any existing "_key" convenience reference in data and/or this
	**/
	get: function ___get(data, key, defaultValue)
	{
		return (key in data) ? data[key]
			 : (data.values && key in data.values) ? data.values[key]
			 : defaultValue
	},
	//________________________________________________________________________________________________
	set: function ___set(data, key, value)
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
	},
	//________________________________________________________________________________________________
	/**
	 *	get/setReturnValue()
	 *	returns value as specified returnFormat otherwise value as-is if not supplied or "value"
	 *	for returnFormat=false, null, und=fined or blank,  returns value "as-is"
	 *	for returnFormat=true or "true", return "this" EZreturnValue Object with all functions
	 */
	getReturnValue: function(data, returnFormat)
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
	},
	//________________________________________________________________________________________________
	/**
	 *
	**/
	setReturnValue: function(data, value, format)
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
	},
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
	save: function ___save(data, value, format)
	{
		if (arguments.length > 1)
			this.setReturnValue(value, format);

		this.removeClutter();
		return this.getReturnValue(format);
	},
	//______________________________________________________________________________________________
	/**
	**/
	getOption: function ___get(data, key, defaultValue)
	{
		return this.get('options')[key] || defaultValue;
	},
	//______________________________________________________________________________________________
	setOption: function ___setOption(data, key, value)
	{
		this.get('options')[key] = value;
		EZ.options.setExcludeKeys(data.options);
		return value;
	},
	//______________________________________________________________________________________________
	/**
	 *	resetOptions(options, defaultOptions)						superceeds setOptions(options)
	 *
	 *	can be called as EZ.setOptions() or from initialized CLASS as this.setOptions()
	**/
	resetOptions: function ___resetOptions(data, options, defaultOptions)
	{
		options = EZ.options.call(options);					//create EZoptions object
		options = EZ.options.call(defaultOptions,options);
															//add any omitted global defaults
		var name = (options['~name'] || '$') + '.options';
		var sync = EZ.sync(options, defaultOptions, '@+^' + name);
[sync]		
		//log.add.call(this, 'sync', sync);

		EZ.options.setExcludeKeys(options);
		if (this != ___)									//set data.options if no EZ.returnValue global
		{
			this.set.call(this, this._data,'options', options);
			if (this.isTest)
				EZ.test.run.options = options;
			if (options.returnType)							//temp backward compatibility ??
				options.returnFormat = options.returnType;
		}
		return options;
	},
	//______________________________________________________________________________________________
	getOptions: function ___getOptions(data)
	{														//backward compatibility
		return data.options;
	},
	//______________________________________________________________________________________________
	setOptions: function ___setOptions(data, options, defaultOptions)
	{														//backward compatibility
		return this.resetOptions(data, options, defaultOptions);
	},
	//______________________________________________________________________________________________
	/**
	 *	updateOptions(options) -- update existing options
	**/
	updateOptions: function ___updateOptions(data, options)
	{
		return this.resetOptions(options, data.options);
	},
	//______________________________________________________________________________________________
	/**
	 *	return data.lists Object or {} if no lists exist
	**/
	getAllLists: function ___getLists(data)
	{
		return data.lists || {};
	},
	/**
	 *
	**/
	getList: function ___getList(data, name)
	{
		var list = this.getData('lists')[name];
		return (!list) ? []
			 : (list instanceof Array) ? list
			 : EZ.stringify(list);
	},
	/**
	 *	returns length of specifed list -- zero if empty or undefined
	**/
	haveList: function ___haveList(data, name)
	{
		var lists = data.lists || {};
		return (lists[name] || []).length;
	},
	//______________________________________________________________________________________________
	/**
	 *	add value or concat Array to data.lists[name] -- create if necessary
	 *	uses EZ.mergeMessage list if dotName supplied
	**/
	addListItem: function ___addListItem(data, name, value, dotName)
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
	},
	//______________________________________________________________________________________
	/**
	 *	add item to EZ.mergeMessage list								was mergeListItem()
	 */
	addMergeListItem: function(data,name, msg, dotName)
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
	},
	//______________________________________________________________________________________________
	getKeyValue: function(data, name, key)
	{
		return this.getListValue(name, key);
	},
	/**
	 *	getListValue(name, key, defaultValue)							was getKeyValue
	**/
	getListValue: function ___getListValue(data, name, key, defaultValue)
	{
		data.lists = data.lists = (data.lists || {})
		var list = data.lists[name] || {};
		return (key in list) ? list[key] : defaultValue;
	},
	//______________________________________________________________________________________________
	setKeyValue: function(data, name, key, value)
	{
		this.setListValue(name, key, value);
	},
	/**
	 *	setListValue(name, key, value)									was setKeyValue
	**/
	setListValue: function ___setListValue(data, name, key, value)
	{
		data.lists = (data.lists || {})
		var list = data.lists[name] = (data.lists[name] || {})
		return list[key] = value;
	},
	//______________________________________________________________________________________
	/**
	 *	info
	**/
	addInfo: function(data, msg)
	{
		data.info = data.info || [];
		(EZ.isArray(msg)) ? data.info = data.info.concat(msg).remove()
						  : data.info.push( (msg+'').trim() );
	},
	getInfo: function(data)
	{
		return data.info || [];
	},
	//______________________________________________________________________________________
	/**
	 *	add, get details
	**/
	addDetails: function(data, msg)
	{
		msg = msg || '...message NA...'
		data.details = EZ.toArray(data.details);
		(EZ.isArray(msg)) ? data.details = data.details.concat(msg)
						  :	data.details.push(msg);
	},
	getDetails: function(data)
	{
		return EZ.toArray(data.details).join('\n').trim();
	},
	//______________________________________________________________________________________
	/**
	 *	add, get message
	**/
	addMessage: function(data, msg)
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
	},
	getMessageString: function(data)
	{
		return (data.message || []).join('\n').trim();
	},
	getMessageObject: function(data)		//create if necessary
	{
		return data.message || [];
	},
	getMessage: function(data)
	{
		var message = data.message || [];
		if (message.includes(''))
			return message.remove();		//remove blank items -- return clone
		return message.slice();
	},
	//__________________________________________________________________________________________________
	/**
	 *
	**/
	getTag: function ___getTag(data, name)
	{
		var options = data.options;
		if (!name || !options) return;
		options.tags = options.tags || {};

		var el = options.tags[name];
		if (el instanceof Element)
			return el;

		return options.tags[name] = EZ(el || name, null);
	},
	//__________________________________________________________________________________________________
	/**
	 *
	**/
	setTag: function ___setTag(data, name, value)
	{
		var tag = this.getTag(name);
		if (!tag) return;
		return EZ.set(tag, value || '');
	},
	//______________________________________________________________________________________________
	"~":"last key DW collapse hack"
	}	//end of data functions
	//______________________________________________________________________________________________
	/**
	 *	Creates global Object (pseudo class) -- then used as constructor for new Objects.
	 *
	 *	callback is used if DOM, other script or global Object required to complete initialization.

	 	EZ.returnValue:		return initStatic.call(___);
	 	others				EZ.returnValueV3.call(___, ctx, callback) -->
	 							ctx = initStatic.call(ctx, data, callback);
	 *______________________________________________________________________________________________
	**/
	function _initStatic()
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

		obj['~nextseq'] = 0;
		return obj;								//return populated global Object for EZ.returnValue
	}
	[_initStatic]
	//================================================================================================
	//debugger;
	CIDS = ___.CIDS = [___];
	//EZ.common(___,defaultOptions /* data, callback*/).caller;
	return ___;
})();	//end of EZ.returnValueV3
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
