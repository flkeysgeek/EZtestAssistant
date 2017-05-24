

/*--------------------------------------------------------------------------------------------------
Dreamweaver LINT global references and definitions not used here
--------------------------------------------------------------------------------------------------*/
/*global 
getTestResultsFile,
updateTestStyles,
setOpenLink,
EZfileToUrl,
setTestOkStatus,
displayResults, formatNote, setOverride, getExpected, showCounts, 
quit,
updateEval,
addInfo, addAlert,

EZ, g, dw, DWfile
*/
var e;			//global var for try/catch
(function() {[	//global variables and functions defined but not used

debugSave, debugLogToggle, debugAction, saveDebugCopy,
restoreData,
nosaveLoad, nosaveUpdate,

loadOptions, saveOptions, updateOptions,
loadCache, removeCache, saveCache, 
loadLastRun, saveLastRun,

loadTasks,
loadTestOptions, saveTestOptions, testOptionsReset, saveTestOptions, suggTestOptions,
getTestResults,
loadTestScript, 
loadTestResults, deleteTestResults, sortTestResults,
saveData,
debugLogToggle,
quit,


e, g, dw, DWfile ]});
//__________________________________________________________________________________________________

/*----------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
function restoreData(key)
{
	var files = EZ.test.app.files[key];
	if (!files)
		return EZ.oops('EZ.test.app.files[' + key + '] properties not defined');	
	
	var url = files.file.url;
	var backup = url.replace(/(.*\/)(.*)(\..*)/, '$1$2.backup$3');
	if (!DWfile.exists(backup))
		return EZ.oops('file not found: ' + backup);	
		
	if (DWfile.copy(backup, url))
	{
		delete EZ.test.app.updated[key];
		quit('reload');
	}
	else
		EZ.oops('restore failed: ' + backup);	
}
/*--------------------------------------------------------------------------------------------------
log specified or all changed data -- then save data if not suspended
also used delay processing until idle (no user events for a bit)

TODO: add support for test results
--------------------------------------------------------------------------------------------------*/
function saveData(action, options)
{
	var me = arguments.callee;
	var _ = me._ = me._ || 
	{
		callerName: '',
		state: '',
		stateQueue: [],
		functionQueue: [],
		functionList: {
			options: saveOptions,
			testOptions: saveTestOptions,
			//mru: EZ.test.mruTests.save,
			lastrun: saveLastRun,
			cache: saveCache
		},
		saveOptions: '',
		saveKeys: [],
		saveList: '',							//set when not updating all data
		waitList: {},
		history: [],
		tooltip: [],
		tags: {
			details: {
			  tagName: "details",
			  nodes: [
			  {
				tagName: "summary",
				class: 'sub-header'
			  },
			  {
				tagName: "div",
				class: "pre"
			  }
			]
		  }
		}
	}
	
	EZ.clearTimeout(me);
	if (action)										//good as is if no action or updated below
		_.saveNow = EZ.get('saveOptionsOnChange');	//optimize save queue processing
	
	switch (action)
	{
		case 'resume': 								//resume _saveProcessing() for current queue
		{											//...or future save request
			if (options)
				_saveWaitUpdate('remove');
				
			if (_.saveNow == 'idle') 
			{
				options = 'ready';
				_.saveList = '';
				break;
				//return;
			}
			if (_.stateQueue.length)				//note resume save in progress
				EZ.log('='.dup(50), '>>>>>');			
			break;
		}
		case 'suspend': 							//suspend starting or finishing _saveProcessing()
		{											//wait for no user actions
			_saveWaitUpdate('add');
			if (_.saveNow == 'now') 
				return;
			
			if (_.stateQueue.length)				//note suspend of save in progress
			EZ.log('='.dup(50), '<<<<<');
			return;
		}
		case 'options':								//schedule or call saveOptions()
		{											
			if (quit.reload)						//ignore if page reloading
				return;
				
			if (_.stateQueue.length === 0)			//if no save in process, start options only save
				_.saveList = ['options'];
			else
			{										//otherwise re-start all / ready save
				_.saveList = '';
				_.stateQueue = [];						
			}
			break;
		}
		case 'testOptions':							//schedule or call saveTestOptions()
		{											
			if (quit.reload)						//ignore if page reloading
				return;
				
			if (_.stateQueue.length === 0)			//if no save in process, start options only save
			{
				_.saveList = ['testOptions'];
			}
			else
			{										//otherwise re-start all / ready save
				_.saveList = '';
				_.stateQueue = [];						
			}
			break;
		}
		case 'reload': 								//set or reset state queues for page reload
		{											//called by quit or page reload
			_.state = EZ.test.app.state;
			_.stateQueue = ['', 'safety', 'reload'];
			EZ.log('='.dup(100));
			break;
		}
		case 'ready':								//same as default -- save any changes not suspended
		{											//...
			_.saveList = '';
			_.stateQueue = [];
			break;
		}
		case 'spare':							
		{											
			break;
		}
		default:
		{
			void(0);
		}
	}	
	if (_.stateQueue.length === 0)					//reset if stateQueue if empty
	{
		_.callerName = EZ.getStackTrace(me, '    caller NA');
		if (!action)
			_.saveList = '';
			
		_.saveKeys = _.saveList || Object.keys(_.functionList);
		_.saveOptions = options || '';
		_.state = EZ.test.app.state;
		_.stateQueue = ['', EZ.test.app.state];		
		_.saveNow = EZ.get('saveOptionsOnChange');
		if (_.waitList.length > 0 && _.saveNow == 'idle')
			return EZ.setTimeout(saveData, 5000);	//wait 5 sec if save now
	}
	
	if (_.stateQueue[0] === '')						//if just starting queued save
	{			
		_.stateQueue.shift();
		
		EZ.log('='.dup(100), '[beg save]');
		var logItem = EZ.test.app.state.wrap().pad(9)
					+ 'dataList: ' + _.saveKeys.join(', ');
		
		EZ.log( [logItem].concat(_.callerName).join('\n\t'+' '.dup(7)) );
		_.logSize = EZ.log.history.length;
	}
	//----------------------------------------------------------------------------------------
	var count =  _saveDataProcessQueue(action);		//process 1st or all (reload) queued items
	//----------------------------------------------------------------------------------------
	if (!count)
	{
		EZ.test.app.state = _.state || 'ready';
		return EZ.setTimeout(me,500);				//pause for possible user action
	}
	action = action || 'na';
	if (EZ.debug.isSaveSuspended())
		EZ.log('SAVE SUSPENDED', 'action:' + action.wrap('"'), 'saveOptions:' + _.saveOptions.wrap('"'));
	
	//if (_.logSize != 'EZ.log.history'.ov([]).length)
		EZ.log('='.dup(100), '[end save]');			//queues processed
	//else if (EZ.log.history && _.logSize > 0)
	//	EZ.log.history.length = _.logSize - 1;
	
	//________________________________________________________________________________________
	/**
	 *	calls specified save...() function for specified states
	 *	updates id="updatedData" with summary and details from save functions
	 */
	function _saveDataProcessQueue()
	{
		while (true)
		{
			var state = _.stateQueue[0];
			if (!state)								//done if state queue empty
				break;	
			
			EZ.test.app.state = state;
			
			if (_.functionQueue.length === 0)		//reset fn queue for next state
				_.functionQueue = _.saveKeys;
			
			while (_.functionQueue.length)
			{
				var key = _.functionQueue.shift();
				var fn = _.functionList[key];		//EZ.test.app.updated[key] set by safety pass
													//...for "reload" state -- DON'T THINK SO
				if (state != 'reload' || EZ.test.app.updated[key])
				{
					var msg = fn(_.saveOptions)
					if (msg)
						_.tooltip.push(EZ.format.time('ms') + ' ' + msg);		
					if (!quit.reload && _.saveNow == 'idle')
						return false;				//take breather for user action
				}
			}
			_.stateQueue.shift();
		}
		
		EZ.test.app.state = _.state || 'ready';
		
		if (!quit.reload)							//display summary of changes if not reload
		{											//hidden if not debug mode but can inspect
			var updated = [];							
			var saved = [];
			//var json = JSON.stringify(EZ.test.app.updated);
			for (var key in EZ.test.app.updated)
			{
				if (EZ.test.app.updated[key] == 'saved')
				{
					delete EZ.test.app.updated[key];
					saved.push(key);
				}
				else updated.push(key);
			}
			var msg = [];
			if (updated.length)
				msg.push('updated: ' + updated.join(', '))
			if (saved.length)
				msg.push('saved: ' + saved.join(', '))
			
			//|| json != JSON.stringify(EZ.test.app.updated))
			if (!msg.length && _.noUpdateCount === undefined)
				msg.push('no data updated or saved');
			
			if (!msg.length)						//no change if no update msg
			{										//...bump count and highlight for a bit
				EZ.set('updatedDataCount', ' x ' + (++_.noUpdateCount+1));	
				EZ.addClass(EZ.el, 'noUpdates=30000');
			}
			else									//no changes
			{
				_.noUpdateCount = 0;
				EZ.set('updatedDataCount', '');	
				
				msg = EZ.format.time() + ': ' + msg.join(' ');
				EZ.log.call('saveData', EZ.test.app.state.wrap().pad(9), msg);
				
				EZ.set('updatedData', msg);					
				if (_.tooltip.length > 0)
				{
					var details = EZ.createTag('details', _.tags.details, null);
					EZ.set( EZ('summary', details), msg);
					EZ.set( EZ('pre', details), _.tooltip.join('\n'));
					
					var history = EZ('updatedDataHistory');
					if (history.children.length === 0)
						history.appendChild(details);
					else
					{
						history.insertBefore(details, history.children[0]);
						if (history.children.length > 10)
							history.removeChild(history.lastChild);
					}
				}
			}
		}
		return true;
	}
	//________________________________________________________________________________________
	/**
	 *	update wait list
	 */
	function _saveWaitUpdate(action)
	{
		switch (action)
		{
			case 'add': 	
			{
				_.waitList[options] = EZ.format.time('ms')
				break;
			}
			case 'remove': 	
			{
				delete _.waitList[options];
				break;
			}
			default:	return EZ.oops('unknown action: ' + action)
		}	
		var list = [];
		for (var key in _.waitList)
			list.push('wait[' + key + '] @ ' + _.waitList[key]);
		EZ.set('updatedDataWaitList', list.join('\n'));
	}
}
/*----------------------------------------------------------------------------------
call when data loaded or saved -- updated title with timestamp if specified

All 4 parameters required when first called (usually when loaded)

----------------------------------------------------------------------------------*/
function setTitle(key, timestamp, tooltip, noSaveId)
{
	var msg = '';
	var prefix = '';
	var files = EZ.test.app.files[key];
	if (!files)
		return key + ' file not loaded';	
	var props = files._props;
	
	if (!props && tooltip)
	{												//called from load fn
		var code = '';
		var id = key || '';	//'id NA';
		var el = EZ(tooltip, null);
		if (el)
		{
			id = el.getAttribute('data-name') || el.alt || el.id;
			code = el.EZ('code', null);
			//code = EZ('code', EZ.getAncestor(el,'tooltip'));
			//if (!code || code.undefined)
			//	code = '';
		}
		props = EZ.test.app.files[key]._props = {
			id: id,
			el: el, 
			code: code,
			noSaveId: noSaveId || '',
			noSaveEl: EZ(noSaveId, null),
		}
		var stack = EZ.stack(setTitle)
		var callerName = (stack.lines[2].formatStack()+'' || '');	//.trim();
		msg = 'loaded ' + key.pad(12) 
			+ ' [saved @ ' + EZ.format.dateTime(timestamp, 'today-time') + '] ' 
			+ (callerName || ''); 
		//EZ.log.call('saveData', msg)
	}
	
	if (!msg)
	{
		var why = props.why || props.noSaveWhy || '';
		prefix = key.pad(19);	//props.id.pad(25)
	
		if (tooltip == 'safety')
		{			
			msg += ' safety saved ';						
		}
		else if (props.isSaved)							//set by canSave() when canSave is true
		{												//saved occures when canSave() returns
			msg += ' file updated ';					//setTitle called after save
			
			if (props.safetyTimestamp)
			//&& EZ.getTime(props.safetyTimestamp) < EZ.getTime(timestamp))
			{
				msg += ' (safety deleted) ';
				props.safetyTimestamp = false;
				//====================================================================
				EZ.store.remove('safety.' + key);		
				//====================================================================	
			}
			//files.saved = EZ.clone(props.value);
			files.saved = EZ.test.cloneHow(props.value, key);
			
			props.isPending = '';
			props.isChanged = false;
			EZ.test.app.updated[key] = 'saved';
			if (false)		
				delete EZ.test.app.files[key].loaded
		}
		else if (props.isPending)						//isDataChanged() sets if called with why arg
			msg += ' pending save ' + why;				//not cleared until saved
		
		else if (props.isChanged)						//isDataChanged() sets if changed from saved
			msg += ' NOT saved ' + why;					//clears if data restored to saved values

		else if (EZ.test.app.state == 'safety')
			msg += ' up-to-date:';
	}
	if (!quit.reload)									//update html if not reloading
	{
		var el = props.el;
		/*
		if (timestamp)
			EZ.show(el);				//show button if hidden (e.g. mruReset)
		else
			void(0);					//debug aid
		*/
//?		EZ.addClass(el, 'pending', props.isPending || msg);
		if (props.isSaved)
			EZ.addClass(el, 'saved=15000');
		
		var text = '';
		if (props.isPending)
		{
			text = el.getAttribute('data-title-suffix') || '';
			text = text.replace(/(.*?) changes pending/, '') + ' changes pending';
		}
		else if (timestamp == -1)
			text = '';
		else if (timestamp !== undefined)
			text = 'saved @ ' + EZ.formatDate(timestamp, 'today-time')
		
text = msg + '' + text;
		text = (text || '').trim()
		if (text)
			el.setAttribute('data-title-suffix', ' ' + text);
if (msg)
{
	el.setAttribute('data-title-prefix', '');
	el.setAttribute('data-title', '');
}
	}
	
	msg = msg.trim();
	if (msg)
	{
		msg = prefix + msg;
		var state = EZ.test.app.state.wrap().pad(9);
		var time = EZ.format.time('ms');
		EZ.log.call('saveData', state, time, msg + ' ' + (props.callerName || ''));
		msg = time.replace(/\s+/g, '') + ' ' + msg;
	}
	return msg;
}
/*----------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------
Safety copies are made whenever save...() is called unless save is suspended.

Whenever changes are made, the changes show in the javascript console, trace log and 
on page tooltip if enabled.

when reloading or leaving html page, quit() first sets EZ.test.app.state="safety"
to save any changes to localStorage (as safety) in case browser crashes then sets 
EZ.test.app.state="reload" to save any changes to the associated file(s).

If all files are updated sucessfully, the localStorage safety copies are deleted.
----------------------------------------------------------------------------------*/
function isDataChanged(key, value, isPending)
{
	var files = EZ.test.app.files[key];
	if (!files)
		return EZ.oops(key + ' properties not defined');
	var props = files._props;
	
	if (!props.callerName)
	{
		var stack = EZ.stack(isDataChanged)
		props.callerName = (stack.lines[2].formatStack()+'' || '').trim();
	}
	if (isPending instanceof Object && isPending.backup)
		return true;

	props.value = value;
	props.isPending = isPending || '';						
	props.why = props.isPending;								
	//props.safetyUpdated = false;
	
	var state = EZ.test.app.state;
	if (state == 'reload')						//file saved on return if updated and can save
	{
		return props.isSaved;
	//	return (EZ.test.app.updated[key] + '').includes('updated');
	}
	
	var el, code, codeHtml, isChanged;			
	var saved = files.saved || files.loaded;
	
	if (quit.reload && state == 'safety')		//no dom changes
	{
		isChanged = (value == 'reset') ? true
				  : !EZ.isEqual(saved, value);	//basic equals test 
		isPending = '';
	}
	else
	{
		el = props.el;
		code = props.code;
		var isTooltip = (code && EZ.log.isActive('saveData', 'page'));
		if (!isTooltip)
			EZ.addClass(code, 'hidden');
		
		isChanged = (saved) ? _isChanged()
							: _isCreated()
	}
	props.isChanged = isChanged;
	
	if (isChanged)
	{
		//EZ.test.app.updated[key] = isPending ? 'pending' : 'updated';		
			
		if (code && codeHtml)						//update tooltip
		{
			EZ.removeClass(code, 'hidden');		
			code.innerHTML = codeHtml.innerHTML;
		}
		//setTitle(key);
	}
	else
	{
		props.isPending = '';
	}
	//======================
	return isChanged;
	//======================
	//________________________________________________________________________________________
	/**
	 *	
	 */
	function _isCreated()	
	{
		var text = ' created: ' + props.id
		EZ.log.call('saveData',text);
		
		if (isTooltip)
		{
			var tags = {
				nodes: {
					em: {
						nodes: {
							text: text
						}
					}
				}
			}
			codeHtml = EZ.createTag('code', tags);
		}
		return true;	
	}
	//________________________________________________________________________________________
	/**
	 *	
	 */
	function _isChanged()	
	{	
		var opts = {
			showDiff:5, 
			//console: true,
			//log: true,
			name: [key, 'CHANGES ...'],
			ignore: 'objectType'
		};
		var isEqual = EZ.isEqual(saved, value, opts);
		if (!isEqual)
		{
			var formattedLog = window.EZ.isEqual.formattedLog;
			if (formattedLog && code)
			{
				var was = 'window.EZ.test.app.files.' + key + '.lastSaved';
				var now = 'window.EZ.test.app.files.' + key + '.nextSaved';
				//var name = EZ(el).getAttribute('alt') || EZ.el.id;
				var log = ' [was] ... [now]:\n\t'
						+ formattedLog.join('\n\t');
				EZ.log.call('saveData',log);
				
				if (isTooltip)
				{								//create (.lastSave / .nextSaved) clones for compare 
					files.nextSaved = EZ.clone(value);
					files.lastSaved = EZ.clone(files.saved);
					var tags = {
						nodes: {
							em: {
								nodes: {
									text: name + ' [was] ... [now]'
								}
							},
							div: {
								class: 'pre',
								nodes: {
									input: {
										type: "image",
										title: 'full compare via winmerge',
										src: "../images/compare.png",
										onclick: 'window.EZ.compare(' + was + ',' + now + ')'
									},
									text: '\t' + formattedLog.join('\n\t')
								}
							}
						}
					}
					codeHtml = EZ.createTag('code', tags, null);
					[].sortPlus.call(was.ov());
					[].sortPlus.call(now.ov());
				}
			}
		}
		return !isEqual;
	}
}
/*----------------------------------------------------------------------------------
Only called if data changed 
----------------------------------------------------------------------------------*/
function canSave(key, timestamp, options)
{
	var files = EZ.test.app.files[key];
	if (!files)
		return EZ.oops('EZ.test.app.files[' + key + '] properties not defined');	
	var props = files._props;
	
	if (options instanceof Object)
	{
		var url = files.file.url;
		if (options.backup)
			url = url.replace(/(.*\/)(.*)(\..*)/, '$1$2.backup$3');
		options.url = url;
	}
	else options = {};
	
	var isSaved = false;
	var why = '';
	//while (EZ.test.app.state != 'debug')
	do
	{
		if (options.backup)
		{
			isSaved = true;
			break;
		}
		if (EZ.debug.isSaveSuspended())
		{
			why = 'all saves suspended';
			break;
		}
		var noSaveId = props.noSaveId;
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
else if (key == 'lastrun')
	void(0);
			else if (!props.noSaveEl || !props.noSaveEl.checked)
			{
				why = noSaveId + ' not checked';
				break;
			}
		}
		/*
		else if (!noSaveId)
		{
			why = 'save not allowed for' + noSaveId;
			break;
		}
		*/
		isSaved = true;
		props.timestamp = timestamp || props.timestamp;
		EZ.test.app.updated[key] = 'saved';
		_updateSafety();				//save safety copy
		setTitle(key, props.timestamp, 'safety');
		//props.safetyUpdated = true;
		
		break;
	}
	while (false)
	
	props.isSaved = isSaved;
	props.noSaveWhy = why;
	return isSaved;
	
	function _updateSafety()
	{
		var times = EZ.test.app.updatedTimes
		times.timestamp = EZ.format.dateTime();
		times[key] = times[key] || {};
		times[key].timestamp = timestamp || times.timestamp;
		
		EZ.test.app.updated[key] = 'updated-safety'
		//====================================================================
		EZ.store.set('updatedTimes', EZ.test.app.updatedTimes);
		EZ.store.set('safety.' + key, props.value);		
		//====================================================================
	}
}

/*----------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
function loadTasks()
{
	var filename = 'EZtestAssistant.TASKS.js'
	var file = EZ.filePlus(EZ.test.config.testdataFolder, filename);
	//================================================================================
	var text = DWfile.read(file.url);	
	//================================================================================
	EZ('testTasksText').innerHTML = text;
}

//_________________________________________________________________________________________________
e = function _____OPTIONS_____() {}	//convenience for DW functions list
//_________________________________________________________________________________________________

/*----------------------------------------------------------------------------------
Load all options and update field values
----------------------------------------------------------------------------------*/
function loadOptions(classNames)
{
	EZ.test.app.files.options = {
		status: false, 
		file: '',
		defaultValueMap: EZ.get(['opt']).valueMap,
		logs:{}
	};
	
	var options = {};
	try
	{
		var file = EZ.filePlus(EZ.constant.configPath + EZ.test.config.testdataFolder + 'options.js');
		EZ.test.app.files.options.file = file;
		//================================================================================
		var json = DWfile.read(file.url);	
		//================================================================================
		if (json == 'reset')
			EZ.test.app.files.options.status = 'options reset';

		else if (json && json.includes('options='))
		{
			EZ.test.app.files.options.status = true;
			eval('EZ.test.app.files.options.loaded = ' + json);
			options = eval(json);
		}
	}
	catch (e)
	{
		EZ.log.call('saveData', 'saved options corrupt');
	}
	options = options || {};
	var isEmpty = EZ.isEmpty(options);

	var timestamp = EZ.test.app.files.options.file.timestamp || 0;
	setTitle('options', timestamp, 'optionsData', 'debugNoSaveOptions');
	
	classNames = EZ.toArray(classNames);		//use array to get all matching tags
	
	/*03-09-2017: 1st thought default values lost for some checkboxes
	EZ.test.app.files.options.defaultValues = EZ.get(classNames).valueMap;
	var log = EZ.sync(options, EZ.test.app.files.options.defaultValues, '^@options', 1);
	*/

	//----------------------					
	EZ.field.add(options);						
	//----------------------					
	var log = EZ.field.getLog();
	log.added = log.added || [];
	var logItem = EZ.log(log.added.length + ' saved options', {added:log.added, notFound:log.notFound});
	EZ.test.app.files.options.logs.loaded = logItem;
	
	//if (!log.added.length)
	if (isEmpty)				
	{
		EZ.addClass('allDefaultOptions', 'dim');
		EZ.el.value = 'default options';
		EZ.removeClass('appOptions', 'less');
		EZ.set('showTestOptions',false);
		EZ.log('----------------------- no saved options ----------------------------')
	}
	else 
	{
		EZ.test.app.files.options.all = EZ.get(['opt']).valueMap;
		//setTitle('optionsData', EZ.test.app.files.options.file.timestamp || 0);
		if (EZ.debug())
		{
			var value = EZ('allDefaultOptions').value;
			EZ.el.value = value.replace(/(all|\(\d*\))/i, '(' + log.added.length + ')');
		}
	}
	//	/*03-09-2017: not necessary with above EZ.sync code but not deployed
	//------------------------------------------------------------------------------------
	EZ.field.add(classNames);					
	//------------------------------------------------------------------------------------
	log = EZ.field.getLog();			
	logItem = EZ.log(log.counts.tags + ' total options', {added:log.added, existing:log.existing});
	EZ.test.app.files.options.logs.all = logItem;
	
	log.dupNames = log.dupNames || [];	
	if (log.dupNames.length)
		EZ.oops('dupNames: ' + log.dupNames.join('\n\t'))
	//*/
	
	EZ.test.app.files.options.logs.summary = {fields:log.fields, lists:log.lists, events:log.events};
	var counts = EZ.stringify(log.counts).substr(2).clip(2).trim().replace(/\n\s*/g, '  ');
	EZ.test.app.files.options.logs.counts = counts;
	
	EZ.log({'EZ.test.app.files.options.summary': EZ.test.app.files.options.summary}, counts);

	EZ.timer('setup fields', true); 			//above EZ.field.add() calls approx: 1 SECOND
	EZ.test.app.state = 'loaded';
	
	  //----------------------------------------\\
	 //----- apply options not auto applied -----\\	
	//--------------------------------------------\\
	g.scriptOptions = {							//initially debugger aid ??
		stringify: '.js_stringify',
		tostring: '.js_tostring',
		maxlines: '.scriptOption=maxlines',
		history_maxitems: '.scriptOption=history_maxitems',
		saveall: '.scriptOption=saveall',
		append: '.scriptOption=append',
		format: '.scriptOption=format',
		enterkey: '.scriptOption=enterkey'
	}

												//TODO: probably not needed or out-of-date
	//EZ.runScript();								//init javascript eval
	
	/*
	var cache = localStorage.getItem(g.projectName + '.cache');
	EZ.removeClass(EZ('useCache').parentElement, 'dim', cache);
	EZ.test.app.cache = JSON.parse(cache || '{}');
	*/
	
	/*----------------------------------------------------------------------------------
													<input type="checkbox" name="validationLimited" id="validationLimited"
													 class="dim opt testOpt onLoadEvent"
													 onload="window.EZ.addClass('okSettings', this.value)">
	----------------------------------------------------------------------------------*/
}
/*----------------------------------------------------------------------------------
Save values of all fields with opts class
----------------------------------------------------------------------------------*/
function saveOptions(options)
{
	EZ.clearTimeout(saveOptions);					//clear any pending save
	
	options = EZ.options.call(options);				//if String, keys w/o "=" set to true
				
	var opts, rtnValue = '';		
	var timestamp = 0;
	var file = EZ.test.app.files.options.file;
	if (options.resetAll)													
		opts = 'reset';								//should reload after return
	
	var exclude = options.resetTestOptions ? 'testOpt' : '';
	opts = opts || EZ.field.getChangedValues('opt', exclude);
		
	var saveKey = 'options';
	if (opts == 'reset' 
	|| options.reload
	|| isDataChanged(saveKey, opts, options))
	{			
		var json, count = 0;
		//timestamp = EZ.test.app.files.updatedTimes.options || EZ.format.dateTime();
		timestamp = EZ.format.dateTime();
		//=====================================================================================
		if (canSave(saveKey, timestamp, options))
		{
			if (opts instanceof Object)				//if not "reset"
			{
				count = Object.keys(opts).length;
				[].sortPlus.call(opts);
				//if ('EZ.test.app.files.updatedTimes.options'.ov())
				//opts.timestamp = timestamp;
				json = 'EZ.test.app.options= \t\t//Saved @ ' + timestamp + '\n' + EZ.stringify(opts);
			}
			else json = opts;
			
			
			file.timestamp = timestamp;	
			DWfile.write(options.url, json);
			//localStorage.setItem(g.projectName + '.options', json);
			//localStorage.setItem(g.projectName + '.nosave', json);
			localStorage.removeItem(g.projectName + '.nosave');
		}
		//=====================================================================================
		else									
		{											//save .nosave options if options not saved
			var fieldValues = EZ.get(['nosave']);
			json = JSON.stringify(fieldValues.valueMap);
			localStorage.setItem(g.projectName + '.nosave', json);
		}
		//=====================================================================================			
		if (opts)										//reset ??
		{
			var value = EZ('allDefaultOptions').value;
			value = (count === 0) ? 'default options'
				  : (EZ.debug()) ? 'reset (' + count + ') options'
				  : 'reset all options';
			EZ.el.value = value;						//update button displayed text
		}
	}
	rtnValue = setTitle(saveKey, timestamp);
	return rtnValue;
}
/*----------------------------------------------------------------------------------
Called by options table container onClick or onChange()

Update g.displayOptions from children of .displayObjectOptions containers

save all fields with .opt class
----------------------------------------------------------------------------------*/
function updateOptions(wrapEl)
{
	if (!wrapEl || EZ.hasClass(wrapEl, 'displayOptions'))
	{
		var tags = EZ(['opt'], '.displayOptions');	//save all displayOptions

		g.displayOptions = {timestamp: false};
		tags.forEach(function(tag)
		{											//update display options
			var key = tag.id.replace(/(toString|stringify)_/, '');
			g.displayOptions[key] = EZ.get(tag);
		});
	}
//	setTimeout(saveOptions,0);
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
function createLastRun()
{
	var lastrun = {
		lastOks: {},
		testrun: {},
		timestamp: '',	//EZ.formatDate(),
		version: '01-06-2017'
	}
	return lastrun;
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
function loadLastRun()
{
	EZ.removeClass(['saveLastRunBtn','lastrunLink'], 'hidden', EZ.debug());
	
	var file = getTestResultsFile('lastrun');	
	
	EZ.test.app.lastrun = {}
	EZ.test.app.files.lastrun = {
		saved: {},
		file: file
	};
	
	var lastrun = createLastRun();	
	if (file.timestamp)
	{
		EZ.test.app.lastrun = EZ.ls.get(file.filename, EZ.test.app.lastrun) || {};
		if (EZ.ls.fault)
			EZ.oops(EZ.ls.fault);
	}
	if ('EZ.test.app.lastrun.version'.ov() != lastrun.version)
		EZ.test.app.lastrun = lastrun;
	else
		EZ.test.app.files.lastrun.save = EZ.test.app.lastrun.cloneObject();

	EZ.test.app.lastrun.filename = file.filename;
	file.timestamp ? EZ.format.time(file.timestamp) : 'empty';

	setTitle('lastrun', file.timestamp || 0,  'lastrunTime', '')
	//EZ.set('lastrunTime', timestamp);
	
	EZ('lastrunLink').href = file.url;
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
function saveLastRun(action, options) 				//action: button, ready, close, debug
{
	/*
	if (!EZ.test.app.firstRun						//deleted when test script loaded
	||  !EZ.test.data.counts)
		return 'lastrun data not loaded';			//set true 1st time tests runn -- false below
	*/
	
	options = options || '';
	var opt = EZ.get('lastrunSaveOpt')
	
	action = action || 'ready';
	switch (action)
	{	
		case 'button':
		case 'debug': 	
			break;			
		
		case 'ready': 	
			if (EZ.test.app.firstRun) 
			{
				if (opt.includes('1st')) break;
			}
			else if (opt.includes('rerun')) break;
			return;
		
		case 'reload': 	
		case 'close': 	
			if (opt.includes('close')) break;
			return;
		
		case '': 	
			return;
		
		default: return EZ.oops('unknown action: ' + action);
	}
	//EZ.test.app.firstRun = false;
	if (!EZ.test.data.counts)
		return;
														//get current counts
	var countKeys = ['lastRunDiffAny', 'lastRunSameOk', 'lastRunDiffOk', 'lastRunPassOk', 'lastRunFailOk'];
	var counts = EZ.clone( EZ.test.data.counts, countKeys);	
	
	var oks = 'EZ.test.app.lastrun.oks'.ov({});
	var testList = Object.keys(oks);
	
	var lastrun = createLastRun();

	var keys = EZ.test.config.lastrunKeys.concat(['changed', 'changedDetail']);														
	var keys = 'testno okChecked'.split(/\s*/);			//TODO: add args after EZ.merge.deep() avail??
	//(EZ.test.data.testrun || []).forEach(function(testrun, idx)
	
	Object.keys(EZ.test.data.testrun || []).forEach(function(testKey)
	{
		var testrun = EZ.test.data.testrun[testKey];
		lastrun.lastOks[testKey] = testrun.okChecked;
		lastrun.testrun[testKey] = EZ.clone(testrun, keys);
		lastrun.testrun[testKey].okRun = testrun.allOk.run;
	});

	//var filename = EZ.test.app.lastrun.filename;
	var url = 'EZ.test.app.lastrun.filename'.ov();
	if (!url)
		url = getTestResultsFile('lastrun').url;
		
	lastrun = [].sortPlus.call(lastrun);	
	lastrun.testFolder = EZ.get('folderList');				//after sort
	lastrun.testFilename = EZ.get('fileList');
	lastrun.testFuncName = EZ.test.data.funcName;
	lastrun.filename = lastrun.filename || url;
	//-------------------------------------------------------------------------------------------------------\\
	var timestamp = 'EZ.test.app.lastrun.timestamp'.ov('');	 // show changes as tooltip (skip update if none) \\
															//-------------------------------------------------\\
	var msg = '';
	var saveKey = 'lastrun';
	if (isDataChanged(saveKey, lastrun /*, why */))	
	{
		EZ.test.app.lastrun = lastrun;
		timestamp = EZ.format.dateTime();
		if (canSave(saveKey, timestamp))
		{
			lastrun.timestamp = timestamp;
			//saveDebugCopy(lastrun, 'lastrun', 'all');
			//==================================================
		//	var json = EZ.jsonPlusV3.stringify(lastrun);
			var json = EZ.test.stringifyHow(lastrun);
			if (!json)
				msg = 'invalid json';
			else
			{
				msg = DWfile.write(lastrun.filename, json);
				msg = msg ? '' : 'DWfile.write(lastrun) failed\n  filename: ' + lastrun.filename;
			}
			/*
			EZ.ls.set(filename, lastrun, 'EZ.test.app.lastrun');
			if (EZ.ls.fault)
				EZ.techSupport(EZ.ls.fault);
			*/
			//==================================================
		}
	}
	//-------------------------------------------------------------------------------------------------------//
	var rtnValue = setTitle(saveKey, timestamp);
	//var rtnValue = msg || timestamp.replace(/.*? /, '');
	//EZ.set('lastrunTime', msg);
	
	if (EZ.test.app.lastrun == lastrun)
	{
		//updateTestStyles();										//clears lastrun oks;
		
		msg = saveLastRun.message = '';
		if (counts.lastRunDiffAny)								//append counts to msg
		{
			msg += 'last run updated';
			msg += EZ.s(' -- cleared #  ok differences', counts.lastRunDiffAny);
			if (testList.length)
				msg += EZ.s(' (tests', testList.length) + ': ' + testList.toRanges() + ')';
		}
		else if (timestamp)
			msg = 'no Ok changes from lastrun';
//		if (msg)
			
	}
	return rtnValue;
}
/*----------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
function loadCache()
{
	var json = localStorage.getItem(g.projectName + '.cache')
	EZ.test.app.cache = json ? JSON.parse(json) : {};
	
	setTitle('cache', EZ.test.app.cache.timestamp, 'deleteCache', 'useCache');
	return EZ.test.app.cache;
}
/*----------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
function removeCache()
{
	EZ.test.app.cache.deleted = true;
	localStorage.removeItem(g.projectName + '.cache');
	setTitle('deleteCache', -1);
}
/*----------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
function saveCache()
{
	var cache = EZ.test.app.cache

	if (!cache || cache.deleted || !EZ.get('useCache'))
	{
		localStorage.removeItem(g.projectName + '.cache');
		return 'test script cache ' 
			 + (EZ.get('useCache') ? 'not active' : 'deleted');
	}
	
	var timestamp = cache.timestamp;
		
	if (cache.deleted || !EZ.get('useCache'))
	{
		timestamp = -1;
		cache = '';
		localStorage.removeItem(g.projectName + '.cache');
	}
	
	var saveKey = 'cache';
	if (isDataChanged(saveKey, cache))
	{
		timestamp = EZ.format.dateTime();
		if (canSave(saveKey, timestamp))
		{
			cache.timestamp = timestamp;
			cache.cacheExpiredTime = new Date().getTime() + (5*60*1000);	//good for 5 mins
			localStorage.setItem(g.projectName + '.cache', JSON.stringify(cache));
		}
	}
	return setTitle(saveKey, timestamp);
}

//_________________________________________________________________________________________________
e = function _____TEST_OPTIONS_____() {}	//convenience for DW functions list
//_________________________________________________________________________________________________

/*----------------------------------------------------------------------------------
update EZ.test.data.options.onlyList from only and skip ranges
----------------------------------------------------------------------------------*/
function setOnlyList(el, value)
{
	var options = EZ.test.data.options;
	if (!options)
		return;
	var count = EZ.test.data.callCount;

	var onlyValue = EZ.get('testOnlyList', '').trim();
	var skipValue = EZ.get('testSkipList', '').trim();
	var onlyListNow = onlyValue.fromRanges(count);
	var skipListNow = skipValue.fromRanges(-count);
	
	var allList = ''.fromRanges(count);
	var onlyList = options.onlyList || [];
	var skipList = options.skipList || [];

	var onlyListWas = onlyList.slice();
	var onlyRangeWas = onlyList.length === 0 ? allList
					 : (onlyList[0] + '-' + onlyList[onlyList.length-1]).fromRanges();
	var skipListWas = (options.skipList || []).remove( allList.remove(onlyRangeWas) );

	//________________________________________________________________________________________
	/**
	 *	 find shortest representation of values -- work-in-process
	 */
	var shortValues = function()										  
	{
		if (!skipStr && !onlyStr) return;
		
		if (onlyList.length && skipList.length
		&& EZ.isEqual(onlyList.concat(skipList), skipList.concat(onlyList)))
		{
			void(0)					//think blend handles
		}

		if (true) return;

		var onlyStrLessSkip = onlyList.remove( skipList ).toRanges();
		var skipStrLessOnly = skipList.remove( allList.remove(onlyList) ).toRanges();
		
		if (onlyStr && onlyStr.length < skipStrLessOnly.length)
			skipStr = '';

		else if (skipStr && skipStr.length < onlyStrLessSkip.length)
			onlyStr = '';

		else
		{
			onlyStr = onlyStrLessSkip;
			skipStr = skipStrLessOnly;
		}
	}
	//________________________________________________________________________________________
	/**
	 *	blend onlyList and skipList if both had values
	 */
	var blendLists = function()
	{
		var saveList = onlyListNow;
		onlyListNow = !onlyValue && !skipValue ? allList
					: onlyValue && !skipValue  ? onlyListNow.concat(skipListWas).sortPlus()
					: !onlyValue && skipValue  ? allList.remove(skipListNow)
					: null;
		if (onlyListNow) return;

		var addList = [];
		var delList = [];
		if (id == 'testOnlyList')						//only changed
		{
			addList = onlyListNow.remove(onlyList);
			delList = onlyList.remove(onlyListNow);
			skipListNow = skipListNow.concat(delList).remove(addList);
		}
		else if (id == 'testSkipList')					//skip changed
		{
			addList = skipListNow.remove(skipList);
			delList = skipValue.fromRanges().remove(skipListNow);	//skipList.remove(skipListNow);
			onlyListNow = onlyListNow.concat(delList).remove(addList);
		}
		else 
			onlyListNow = saveList
		//var wasList = options.onlyList || allList;		
		//var newList = wasList.concat(addList).remove(delList);
		
		onlyList = onlyListNow.length ? onlyListNow : allList;
		var onlyRangeNow = (onlyList[0] + '-' + onlyList[onlyList.length-1]).fromRanges();
		var outsideRange = allList.remove(onlyRangeNow);
		skipList = skipListNow.remove(outsideRange);
	
		onlyListNow = onlyList;
		skipListNow = skipList;
	}
	//========================================================================================
	var id = '.id'.ov(el, '');
	var isAll = (id == 'testRunAll');
	if (isAll)							//run button [*]
	{
		id = '';
		onlyList = onlyListNow = allList
		skipList = skipListNow = [];
	}
	else if (typeof(el) == 'string')	//call from test script
	{
		if (!value) return;

		if (el = 'testOnlyList')
			onlyList = EZ.isArray(value) ? value : value.toString().fromRanges(count);

		else if (el = 'testSkipList')
		{
			//01-05-2017: before testKey/variants -- there were issuse with only and skip
			//			  EZ.test.testnoNext was always 1 -- EZ.testnoNext undefined
			//var range = EZ.test.testnoNext + '-' + (EZ.toInt(value) - 1 + EZ.testnoNext);
			var range = 1 + '-' + (EZ.toInt(value));		//01-05-2017
			skipList.push(range.fromRanges(count));
		}
		else return;
	}
	else								//on field change
	{
		blendLists();					//optional
		onlyList = onlyListNow;
		skipList = skipListNow;
	}
	var onlyStr = EZ.isEqual(onlyList, allList) ? '' : onlyList.toRanges();
	var skipStr = skipList.toRanges();
	shortValues();						//optional
	
	EZ.set('testOnlyList', onlyStr);
	EZ.set('testSkipList', skipStr);
	
	options.onlyList = (onlyList.length) ? onlyList.remove(skipList)
										 : allList.remove(skipListNow);	
	options.skipList = skipList;
										
	var text = (!count) ? '<b>no tests found</b>'
			 : (count == 1 && !onlyList.length) ? '<b>skip only test found</b>'
			 : (count == 1 && onlyList.length == 1) ? 'run single test found'
			 : (count <= onlyList.length) ? EZ.s('run all # test', onlyList.length) + ' found'

			 : (!onlyList.length) ? '<b>skip all ' + count + ' tests</b>'

			 : (EZ.get('testOnlyList')) ? EZ.s('run # test', onlyList.length) + ' of ' + count
			 : (EZ.get('testSkipList')) ? EZ.s('skip # test', skipList.length) + ' of ' + count
			 : (skipList.length == 1) ? 'skipping 1 test of ' + count
			 : EZ.s('run # test', onlyList.length) + ' of ' + count;

	EZ.set('runCount', text);
	//EZ.removeClass('testRunAll', 'invisible', count > 0 && count > onlyList.length);
	EZ.show('testRunAll', count > 0 && count > onlyList.length);

	if (isAll || !el)
		EZ.removeClass(['testOnlyList', 'testSkipList'], 'fromScript');

	else if (el.value && EZ.hasClass(el, 'testOnlyList'))
		EZ.addClass(el,'fromScript');						//indicate found in test script

	else if (el.value && EZ.hasClass(el, 'testSkipList'))
		EZ.addClass(el,'fromScript');

	return !EZ.isEqual(options.onlyList, onlyListWas) || !EZ.isEqual(options.skipList, skipListWas)
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
function loadTestScript()
{
	var cache = EZ.test.app.cache || {};
	
	//var file = getTestResultsFile('script');
	var scriptData = EZ.test.data.scriptData;
	
	var file = EZ.test.data.results_file;
	setOpenLink('scriptsFile', scriptData.external_file);	
	
	EZ.test.message('loadScriptScript', scriptData.external_file);
	
	EZ.test.app.scriptFile = cache.scriptFile = file;
}
/*--------------------------------------------------------------------------------------------------
called by setupTestScript()
--------------------------------------------------------------------------------------------------*/
function loadTestOptions()
{
	EZ.test.app.files.testOptions = {};
	var cache = EZ.test.app.cache || {};
	var testOptionsFile = cache.testOptionsFile = getTestResultsFile('options');
	
	EZ.test.app.files.testOptions.file = testOptionsFile;
	
	var timestamp = testOptionsFile.timestamp || 0;
	if (!EZ.test.data.options)						//if test options not loaded from cache
	{
		var json;
		if (timestamp)								//if test options file exists
		{
			EZ.test.app.files.testOptions.file = testOptionsFile;
			//======================================================================================			
			json = DWfile.read(testOptionsFile.filename);
			//======================================================================================			
		}
		if (json)										//if test options file not empty
		{
			try
			{											//1st eval for loaded / saved copy
				EZ.test.app.files.testOptions.loaded = EZ.test.app.files.testOptions.saved = eval(json);
				
				EZ.test.app.testOptions = eval(json);	//then eval for EZ.test.data.options
				
				EZ.test.data.options =  EZ.test.data.options || {};
				for (var key in EZ.test.app.testOptions)
				{										//remove any deprecated values
					var field = EZ.field(key);
					if (key == 'suggRules' 
					|| (field && field.className.includes('testOpt')))
						EZ.test.data.options[key] = EZ.test.app.testOptions[key];	
					else
						delete EZ.test.app.testOptions[key];	
				}
				
				EZ.removeClass(['defaultTestOptions', 'testOptionsData'] , ['dim', 'invisible']);
				EZ.el.value = 'Reset Test Options';
				cache.options = EZ.clone(EZ.test.app.testOptions);
				delete EZ.test.data.options[''];
				
				//---------------------------------------------------------
				var log = EZ.field.update(EZ.test.data.options);	
				//---------------------------------------------------------
				
				EZ.test.app.files.testOptions.fieldLog = log;
				var opts = EZ.get(['testOpt']).valueMap;
				opts.markers = 'EZ.test.app.files.testOptions.loaded.markers'.ov([]).slice()
				
				if (!EZ.isEqual(opts, EZ.test.data.options, {showDiff:99}))
				{
					EZ.log.call('saveData', '/'.dup(100))
					EZ.log.call('saveData', (EZ.isEqual.formattedLog || []).join('\n'))
					EZ.log.call('saveData', '/'.dup(100))
				}
			}
			catch (e)
			{
				EZ.oops(e.message, json);
				json = '';
			}
		}
		if (!json || !EZ.get('validation'))			//if test options json corrupt
		{
			timestamp = 0;
			EZ.test.data.options = {};
			EZ.addClass('defaultTestOptions', 'dim, blink');
			EZ.el.value = 'default test options';
		}
	}
	else
	{
		EZ.set('testOnlyList', EZ.test.data.options.testOnlyList || '');
		EZ.set('testSkipList', EZ.test.data.options.testSkipList || '');
	}
	
	if (!EZ.isArray(EZ.test.data.options.markers))	//add markers Array to old versions
		EZ.test.data.options.markers = [];
		
	setTitle('testOptions', timestamp, 'testOptionsData', 'debugNoSaveTestOptions');
	EZ('runCount').href = testOptionsFile.url;
	/*
	EZ.copyValue('maxHeightTestRowsShared');
	EZ.copyValue('displayFormatResults');

	EZ.copyValue('displayFormatResultsFormat');
	EZ.copyValue('displayFormatResultsSort');
	updateColumnFormat();	
	*/
	EZ(['expandCol']).forEach(function(el)		//dim maxWidth if auto expand checked
	{
		if (el.checked)
			EZ('maxWidth' + el.id.substr(9)).disabled = true;
	});
	//EZ.test.app.files.testOptionsFile = testOptionsFile;
	EZ.test.app.savedFile = getTestResultsFile();
	
	EZ.test.options.todoKey = EZ.test.app.savedFile.key;
}
/*--------------------------------------------------------------------------------------------------
called by quit()									refactored: 06-17-2016 to use EZ.options.save
and when fields changed -- only need if skip or only

save current class="testOpt" html values if loaded and changed
--------------------------------------------------------------------------------------------------*/
function saveTestOptions(el, options)
{
	if (!EZ.test.data.funcName || !EZ.test.data.options) 
		return 'no test options loaded'					//bail if no test script loaded
	
	if (typeof(el) == 'string') 
	{
		options = el;
		el = null
	}
	options = EZ.options.call(options);					//clone or create Object from String
	
	EZ.test.app.files.testOptions = EZ.test.app.files.testOptions || {file: {}};
	var filename = EZ.test.app.files.testOptions.filename;	
	if (!filename)
	{
		EZ.test.app.files.testOptions.file = getTestResultsFile('options');
		filename = EZ.test.app.files.testOptions.file.filename;
	}
if (filename.includes('*')) return;
	if (options.reset)
	{
		DWfile.remove(filename);
		return 'test options reset';
	}
	var lastOks = 'EZ.test.data.options.lastOks'.ov([]);
	Object.keys(EZ.test.data.testrun).forEach(function(testrun)		//get list of checked ok checkboxes
	{
		 //lastOks.push(testrun.okChecked);
		 lastOks[testrun.testKey] = testrun.okChecked;
	});
	
	if (options.runDisplayedTests)
	{
		var tests = [];
		EZ('testno',true).forEach(function(el)
		{
			if(el.isVisible())
				tests.push(el.innerHTML)
		});
		EZ.set('testOnlyList', tests.join(','));
		EZ.set('autorun',true);
	}
	setOnlyList(el);									//update testonly... fields
	if (!el && EZ.test.data.options.onlyList.length >= EZ.test.data.count)
		EZ.set('testOnlyList', '');						//clear only list if all tests and quit call

	
	//done in background??
	//if (EZ.test.data.options.expandedScroll)
	//	saveScrollState();
	
	var timestamp = EZ.test.app.files.testOptions.file.timestamp;
	
	//var opts = EZ.field.getChangedValues('testOpt');	//TODO: really need prompt to carry over options
														//		by category: advanced, formatting, ok rules ??
	
	var opts = EZ.get(['testOpt']).valueMap;			//save ALL test options not just changed so test options
	delete opts[''];									//left from prior test are NOT used.
	opts.markers = EZ.test.data.options.markers || [];
	
	var otherKeys = Object.keys(EZ.test.data.options).remove(Object.keys(opts));
	otherKeys.forEach(function(key)
	{
		opts[key] = EZ.test.data.options[key];
	});
	
	var saveKey = 'testOptions';
	if (options.reload
	|| isDataChanged(saveKey, opts, options))
	{
		//-------------------------------------------------------------------------
		timestamp = EZ.format.dateTime();
		if (canSave(saveKey, timestamp, options))
		{ 													//no need to clone
			EZ.test.app.files.testOptions.file.timestamp = timestamp;
			opts = [].sortPlus.call(opts);
			//====================================================================
			EZ.ls.set(options.url, opts, 'EZ.test.app.testOptions');
			//====================================================================
			if (EZ.ls.fault)
				EZ.oops(EZ.ls.fault);
		}
		EZ.show('defaultTestOptions');
	}
	//-------------------------------------------------------------------------
	return setTitle(saveKey, timestamp);

	/*
	if (el && !EZ.hasClass(el, 'exFrom')				//if called from exFrom dropdown
	&& !EZ.hasClass('runButton',['blink', 'starburst']))
	{
		setTimeout("EZ.addClass('reloadWrap', ['blink', 'starburst'])", 1000);
		setTimeout("EZ.removeClass('reloadWrap', 'blink')", 7000);
	}
	*/
	//saveLastRun();
}
//________________________________________________________________________________________________
/**
 *	
**/
function suggTestOptions(action, what, evt)	
{	
	//DATA STRUCTURES {
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	evt = (this instanceof Event) ? this 
		: (evt instanceof Event) ? evt 
		: ''
		
	var el = (this instanceof Element) ? this
		   : (evt) ? evt.target
		   : '',
		
		field = el && el.EZfield,
		validation = EZ.get('validation'),
		
		//____________________________________________________________________________
		onChangeEvent = function(action)
		{
			suggTestOptions.call(this, action);
		},
		//____________________________________________________________________________
		onClickEvent = function(action, what)
		{
			var el = this;
			if (action == 'click')
			{
				setTimeout(function() {el.click()}, 11);
				return EZ.event.cancel(event, true);
			}
			var evt = event;
			setTimeout(function() {suggTestOptions.call(el, action, what, evt)}, 0);
		},
		//____________________________________________________________________________
		defaultData = function()
		{
			var okRuleGroups = 'basic extended other'.split(/\s+/),
				formatGroups = 'arg actual expected note'.split(/\s+/),
				data = {
					setup: false,
					tags: {},
					groupKeys: {},
					okRuleGroups: okRuleGroups,
					formatGroups: formatGroups,
					allGroups: okRuleGroups.concat(formatGroups),
					
					currentValues: {},
					defaultValues: {},
					defaultUndoValues: {},
			isDefaultValues: false,
					
					suggRules: defaultSuggRules(),
			//		suggRulesExist: false,				//have okRules options.suggRules
					suggCount: {},						//current sugg key count by group
					diffKeys: {},						//by group -- updated by setBorders()
					diffValues: {},
			scriptLoaded: false,
			scriptOptions: false,
			scriptRules: false,
	
					//argsAutoOpen: false,
					argsListOpen: '',
					argsListChanged: false,				//curently using argsListOpen
					deadCount: 0,

					
					isAll: false,
					isArgsSome: false,
					isAllSugg: false,
					isArgsSomeSugg: false,
					
					allKey: 'okReturnValueAll',
					allNotKeys: ['okResultsValidate', 'okCtxValidate', 'okArgsValidate'],
														//keep values when data reset
					keepKeys: ('setup tags groupKeys okRuleGroups formatGroups allGroups'
							+ ' currentValues defaultValues suggRules'
					//		+ ' suggRulesExist suggCount'
							+ '').split(/\s+/),
					timestamp: ''
				}
			data.tags = defaultTags(data);				//Arrays: all, groups{...}
			return data;
		},
		defaultTags = function(data)
		{
			var tagNames = ['input', 'select', 'textarea'];
			var tags = {							//slice() dumps EZ()... functions
				all: [],
				allRules: EZ(['validation']).slice(),	
				sharedFormat: {
					arg: EZ(['sharedValue'], 'argFormatSettings').slice(),
					actual: EZ(['sharedValue'], 'actualFormatSettings').slice(),
					expected: EZ(['sharedValue'], 'expectedFormatSettings').slice(),
					note: EZ(['sharedValue'], 'noteFormatSettings').slice()
				},
				
formatWraps: [
	EZ('nowrapArg'),
	EZ('nowrapActual'),
	EZ('nowrapExpected'),
	EZ('nowrapNote')
],

				groups: {							
					basic: EZ(tagNames, 'validationBasic').slice(),
					extended: EZ(tagNames, 'validationExtended').slice(),
					other: EZ(tagNames, 'otherRules').slice(),
					arg: EZ(tagNames, 'argFormatSettings').slice(),
					actual: EZ(tagNames, 'actualFormatSettings').slice(),
					expected: EZ(tagNames, 'expectedFormatSettings').slice(),
					note: EZ(tagNames, 'noteFormatSettings').slice()
				},
				tooltip: [],						//populated by __setupEvents()

				dataHead: EZ('dataHead'),
				note: EZ('suggRulesNote', null) || {},
				argsList: EZ('okArgsList'),
				okArgsValidate: EZ('okArgsValidate'),
				suggFormatAllNote: EZ('suggFormatAllNote')
			}
			tags.suggFormatAllCount = EZ('span', tags.suggFormatAllNote);
			tags.suggFormatAllCode = EZ('div', tags.suggFormatAllNote);

			for (var g in tags.groups)				//for each group. . .
			{
				data.groupKeys[g] = [];	
				for (var t=tags.groups[g].length-1; t>=0; t--)
				{
					var el = tags.groups[g][t];
					if (!el.className.includes('testOpt'))
					{								//remove tag if not .testOpt class
						tags.groups[g].splice(t,1);		
						continue;
					}
					var name = el.name || el.id
					if (name && !data.groupKeys[g].includes(name))
						data.groupKeys[g].push(name);
					
					if ('basic extended other'.includes(g))
						tags.allRules.push(el);
					tags.all.push(el);
				}
			}
			return tags;
		},
		defaultSuggRules = function()
		{
			return {
				timestamp: '',
				funcName: '',			
				validation: 'basic',
				
				basic: {},
				extended: {},
				other: {},
				arg: {},
				actual: {},
				expected: {},
				note: {},
			}
		},	
		isSuggValue = function __isSuggValue(nowValue, suggValue, id)
		{
			if (id == data.allKey)
			{
				//if (nowValue && nowValue != suggValue)
				//	return false;
				
				if (data.isAll && data.isAllSugg)
					return true;
				
				//if (!nowValue && !data.isAllSugg) 
				//	return false;
				
				if (!data.isAll && suggValue)	//just show individual diff
					return true;
			}
			else if (data.allNotKeys.includes(id))
			{
				/*
				if (data.isAll && data.isAllSugg)
					return true;
				
				if (data.isAll && !data.isAllSugg) 
					nowValue = "true";
				*/
				if (id == 'okArgsValidate')
				{ 
					if (data.isArgsSome)		//validate args is checked-dim
						nowValue = 'some';
					if (data.isArgsSomeSugg)
						suggValue = 'some';
				}
				else if (!data.isAll && data.isAllSugg) 
					suggValue = "true";
			}
			
			return (suggValue == nowValue);
		},
					
		data = suggTestOptions.data = (suggTestOptions.data || {}),
		isFormat = function(what) {	
			return data.formatGroups.some(function(g) { return what.includes(g) });
		},
		isOkRule = function(what) {	
			return data.okRuleGroups.some(function(g) { return what.includes(g) });
		},
		haveSugg = function(what)
		{
			return data.suggCount[what] && data.suggCount[what] > 0;
		},
		getElGroup = function(el) 
		{
			for (var g in data.tags.groups)
				if (data.tags.groups[g].includes(el)) return g;
			return '';
		},
		suggRules = data.suggRules;
		
	//EZ.sync(data, defaultData(), '^@suggData', 0);
	data = suggTestOptions.data = EZ.options.call(defaultData(), data);
	delete data.basicValueMap;				//rebuilt by __updateCurrentValues()
	
	what = (what instanceof Array) ? what
		 : (what == 'allFormat') ? data.formatGroups
		 : (typeof(what) == 'string') ? [what]
		 : ''	//data.okRuleGroups;
	
	// } . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	//---MAIN LINE CODE--- {
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .	
	try
	{
		console.log('suggTestOptions', {action:action, what:what});	//, event:evt||''}, '\n' + el
		switch (action || '')
		{
			case 'setup':					//before testOpt fields initialized
			{
				//EZ.field('okArgsList',true),
				data.defaultValues.all		= EZ.get(data.tags.all).valueMap;
				data.defaultValues.rules	= EZ.get(data.tags.allRules).valueMap;
				data.defaultValues.arg		= EZ.get(data.tags.groups.arg).valueMap;
				data.defaultValues.actual	= EZ.get(data.tags.groups.actual).valueMap;
				data.defaultValues.expected = EZ.get(data.tags.groups.expected).valueMap;
				data.defaultValues.note		= EZ.get(data.tags.groups.note).valueMap;
				return;
			}
			case 'pageLoaded':				//fields set to options values
			case 'resetTests': 				//from EZtest_assistant_support.js::resetTests()
			case 'toggleDefaults': 	
			case 'scriptLoaded': 
			{											
				what = data.allGroups;
				__resetData(what);
				break;
			}
			case 'openIgnoredList':	
			{
				data.argsListChanged = false;
				data.argsListOpen = data.tags.argsList.EZfield.getSelected().join('|');
				return;
			}
			case 'changeIgnored': 				//called by ignoredList onChange()
			{
				data.argsListChanged = true;
				field = data.tags.argsList.EZfield;
				var selections = field.getSelected();
				if (selections.selectedValue == '*sugg')
				{
					var fieldValues = EZ.get( EZ(['.sugg'], data.tags.argsList) );
					selections = field.setSelected(fieldValues.valueList);
				}
				EZ.set('okArgsIgnoredList', selections.unselected.join('|'));
				__updateValidateArgs();
				break;
			}
			case 'close':						//via processClick()
			case 'closeIgnoredList':			//from okArgsIgnored tag onClose="..."
			{				
				__updateValidateArgs();			//if ignoreList popup open
				break;
			}
			case 'formatSettingsClose': 		//app format settings popup closed (top of page options)
			{									//TODO: not used yet //what = 'displayOptions';
				return;								
			}
			case 'resetDefaultFormat': 
			{
				__setTagValues(data.defaultValues[what])
				__clearBorders(what);
				break;
			}
			case 'formatChange': 
			{
				var tagAction = el.getAttribute('data-action') || '';
				switch (tagAction)
				{
					case 'nowrap': 	
		                EZ.removeClass('dataBody', el.id, el.checked);
						break;
					case 'minWidth': 	
					{
						break;
					}
					case 'maxWidth': 	
					{
						break;
					}
					case 'maxHeight': 	
					{
						break;
					}
					default:
					{
						if (EZ.hasClass(el, 'formatHeading'))
							__updateColumnFormatHeading();
					}
				}	
				what = data.formatGroups;					//refresh all for shared values
				break;
			}
			case 'useSavedFormat': 
			{
				if (what == 'allFormat')
					what = data.formatGroups;
					
				what.forEach(function(what)
				{
					__setTagValues(suggRules[what])
					//__clearBorders(what);		//setBorders does plus
				})
				break;
			}
			case 'clearFormat':
			case 'saveFormat':
			{
				if (!what) 
					return EZ.oops('what not specified')
				suggRules.timestamp = EZ.format.dateTime();
				
				what.forEach(function(what)
				{
					suggRules[what] = (action == 'clearFormat') ? {}
									: __getTagValues(what);				
				});
				EZ.test.data.options.suggRules = suggRules;
				__resetSuggData(what)
				break;
			}
			case 'saveRules': 					//WAS via: saveTestOptions('updateSuggRules=rules')">
			{
				suggRules.timestamp = data.timestamp = EZ.format.dateTime();
				suggRules.validation = validation;
				
				__updateCurrentValues();		
				what = data.okRuleGroups
				what.forEach(function(key)
				{
					EZ.test.data.options.suggRules[key] = data.currentValues[key];
				});
				//__clearBorders(what);			//setBorders does plus
				__clearBorders(what);
				break;
			}
			case 'clearRules': 					//WAS via: saveTestOptions('clearSuggRules=rules')">
			{
				suggRules.timestamp = data.timestamp = EZ.format.dateTime();
				suggRules.validation = __getTagValues(data.validation)
				suggRules.other = __getTagValues('other')
				
				EZ.test.data.options.suggRules = suggRules;
				__clearBorders(what);
				__updateCurrentValues();
				break;
			}
			case 'useSavedRules': 
			{
				validation = data.validation = EZ.set('validation', validation);
				__setTagValues(data.defaultValues.rules)
				
				//__setTagValues(suggRules[validation])
				//__setTagValues(suggRules.other)
				__clearBorders(what);
				break;
			}
			case 'removeIgnoredDead': 						//trash button clicked
			{
				__removeIgnoredDead()
				break;
			}
			case 'suggValueClick': 							
			{
				var value = evt.target.getAttribute('data-sugg');
				EZ.set(el, value);
				
				if (el.EZfield)								//propagates value if shared
					el.EZfield.onChangeSet();	
				
				
				if (isFormat(what))
					return onChangeEvent.call(el,'formatChange');
					
				else if (!isOkRule(what))
					return suggTestOptions.call(el,'refresh');
				
				
				//if (!el.what)
				//	return EZ.oops('suggTestOptions[suggValueClick]: what unknown', arguments);
				
				
				//if (data.tags.sharedFormat[what])
				
				action = 'change';
				/* jshint ignore:start*/					//FALL-thru to change
			}
			case 'change': 									//select onChange()
			{
				/* jshint ignore:end */
				__updateCurrentValues();
				what = data.okRuleGroups;
				data.validation = validation;
				__updateValidateArgs();						//update data.isArgsSome		
				break;
			}
			case 'refresh': 
			{
				what = data.allGroups;
				__updateValidateArgs();
				break;
			}
			case 'select-one-blur': 
			{
				field.lastSelectedIndex = -1;
				return;
			}
			case 'select-one-click': 						//not perfect but probably handles click
			{												//TODO: keyPress esc perhaps others
				if (field.lastSelectedIndex >= 0 
				&& field.lastSelectedIndex == el.selectedIndex)
				{
					el.blur();
					field.lastSelectedIndex = -1;
				}
				else field.lastSelectedIndex = el.selectedIndex;
				return;
			}
		}	
		if (field && action.toLowerCase().includes('change'))
		{
			field.lastSelectedIndex = -1;
			el.blur();
		}
		//------------------------
		__setBorders(what);
		//------------------------
		__updateIgnoredPrompts();
		if (data.timestamp != suggRules.timestamp)
		{
			data.timestamp != suggRules.timestamp;
			EZ.set('suggRulesUpdated', EZ.format.dateTime(suggRules.timestamp, '@'));
			EZ.addClass(EZ.el, 'invisible', suggRules.timestamp == 'created');
		}
	}
	catch (e)
	{
		addAlert('suggTestOptions(' + action + ')', e);
		console.log('suggTestOption() EXCEPTION', {message: EZ.test.message.infoAlert.message, detail:EZ.test.message.infoAlert.detail});
	}	
	EZ.set('suggTooltipTime', EZ.format.time())
	return true;
	// } . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 

	//____________________________________________________________________________________________
	/**		move to field getValue
	**/
	function __getTagValues(what)
	{
		var tags = data.tags.groups[what];
		var values = EZ.get(tags).valueMap;	//data.currentValues[what] ||
		//values['~name'] = what + ' tags';
		
		data.currentValues[what] = values;
		return values;
	}
	//____________________________________________________________________________________________
	/**		
	**/
	function __getSuggValues(what)
	{
		var values = suggRules[what] || {};
		/*
		//if (EZ.isEmpty(values))
		{
			data.groupKeys[what].forEach(function(id)
			{
				values[id] = (values[id] !== undefined) ? values[id]
						   								: data.defaultValues.all[id];
				//if (id == 'validation')
				//	values[id] = validation;
			});
		}
		*/
		delete values.validation;
		//values['~name'] = what + ' suggRules';
		return values;
	}
	//____________________________________________________________________________________________
	/**
	 *	format suggRules tooltip in notes column		
	 *	replaced with diffCount and rules button
	**/
	function __setTagValues(valueMap)
	{
		for (var el in valueMap)
			EZ.set(el, valueMap[el]);
	}
	//____________________________________________________________________________________________
	/**														
	**/
	function __updateCurrentValues()
	{
		data.allGroups.forEach(function(g)
		{
			var values = EZ.get(data.tags.groups[g]).valueMap;
			delete values.validation;
			switch (g)
			{
				case 'other': 	
				{
					break;
				}
				case 'extended': 	
				{
					break;
				}
				case 'basic': 	
				{
					var isAll = (values[data.allKey] && !data.allNotKeys.includes(el.id))
					if (!isAll && !data.isArgsSome)
						isAll = data.allNotKeys.every(function(key) {return values[key]});
					data.isAll = isAll;
					//isAll = data.isAll = (isAll && !data.isArgsSome);
					
					if (isAll != values[data.allKey])
					{
						values[data.allKey] = isAll;
					//	if (el.id != data.allKey)
					//		EZ.set(data.allKey, isAll);
					}
					
					var className = validation;
					if (!isAll
					&& (data.isArgsSome
					|| !values.okResultsValidate || !values.okCtxValidate || !values.okArgsValidate
					|| values.okResultsNotSpecified || values.okCtxNotSpecified || values.okArgsNotSpecified))
					{
						if (validation != 'extended')
							className = 'limited';
						EZ('validationLimited').checked = true;
					}
					else EZ('validationLimited').checked = false;
													//update border on okSettings icon (above test rows)
					var tags = EZ('suggSettings', true);
					EZ.removeClass(tags, ['basic', 'limited', 'extended']);
					EZ.addClass(tags, className);
					//EZ.addClass('validationExtended', 'dimmer', validation != 'extended');
					break;
				}
			}	
			data.currentValues[g] = values;
		});
	}
	//____________________________________________________________________________________________
	/**
	 *	convert EZ.test.data.options.suggRules (if necessary) and store in data.suggRules
	**/
	function __getSuggRules()
	{
		var suggRules = 'EZ.test.data.options.suggRules'.ov({timestamp:'created'});
		if (!suggRules.timestamp) 						//convert to timestamp format
			suggRules = EZ.test.data.options.suggRules = {rules:suggRules};
		
		if (suggRules.rules && 'okResults' in suggRules) 
		{												//convert to new field names
			var rules = suggRules.rules;
			['okResults', 'okCtx', 'okArgs'].forEach(function(key)
			{
				rules[key+'Validate'] = rules[key];
				delete rules[key];
			});
		}

		if (suggRules.rules && !suggRules.basic)		//convert to groups
			suggRules.basic = suggRules.rules
								// { basic:suggRules.rules, extended:{}, other:{} };
		
		suggRules = EZ.options.call(defaultSuggRules(), suggRules);
		//EZ.sync(suggRules, defaultSuggRules(), '^@suggRules', 1);
		
		//data.allsuggRules = {};
		//data.allGroups.forEach(g)
		//	data.allsuggRules = EZ.options.call(data.allsuggRules, suggRules[g]);
		return suggRules;
	}
	//____________________________________________________________________________________________
	/**														
	**/
	function __resetData(what)
	{
		do 
		{
			if ('toggleDefaults'.includes(action))
			{
				if ('UNDO use'.includes(el.value))
				{
					EZ('okToggleDefaults').value = 'reset defaults';
					__setTagValues(data.defaultUndoValues);
				}
				else
				{
					EZ('okToggleDefaults').value = 'UNDO defaults';
					data.defaultUndoValues = EZ.get(data.tags.allRules).valueMap;
					__setTagValues(data.defaultValues.rules);
				}
											//TODO: probably applicable everywhere if onClick
				EZ.event.cancel(evt, true);	//don't double process ??
			}
				
			var resetDefault = false;
			suggRules = data.suggRules = __getSuggRules();
			if (action == 'pageLoaded')
			{
				__setupEvents();
				//if (!EZ.get('okFunctionName'))
				//	resetDefault = true;
			}
			else if (action == 'resetTests')
			{
				if (data.tags.argsList) 
					EZ.clearList(data.tags.argsList);
					
				if ('EZ.test.data.options'.ov())	//if test options loaded
					resetDefault = true;
			}
			else
			{
				if (suggRules.timestamp == data.timestamp)							
					resetDefault = true;
			}
			
			if (resetDefault)
			{
				var keepData = {};					//keep some data e.g. tags
				for (var key in data.keepKeys)
					keepData[key] = data[key];
				keepData.defaultUndoValues = data.currentValues;
													//reset data to default values
				//--------------------------------------------------------------------
				data = suggTestOptions.data = EZ.options.call(defaultData(), keepData);
				//--------------------------------------------------------------------
													//set fields to default values
				__setTagValues(data.defaultValues.all);
				EZ.set('okFunctionTitle', 'default values');
				//EZ.set('suggRulesUpdated', EZ.format.dateTime(suggRules.timestamp, '@'));
				
				if (suggRules.funcName)				
					EZ('okToggleDefaults').value = 'use ' + suggRules.funcName + ' values';
				else
					EZ('okToggleDefaults').value = 'UNDO defaults';
				
				EZ.addClass('okToggleDefaults', 'hidden');
				
				//if ('EZ.test.data.options.suggRules'.ov(''))
				//	delete EZ.test.data.options.suggRules;
				
				if (action == 'resetTests')
					break;
			}
			else if (EZ.test.data.argNames)
			{
				EZ.set('okArgNamesPrior', EZ.get('okArgNames', '') );
				
				var ctxRequired = Boolean(EZ.test.data.funcProtoName);
				var argNames = EZ.test.data.argNames.slice(ctxRequired ? 1 : 0);
				EZ.set('okArgNames', argNames);
				suggRules.funcName = EZ.test.data.funcName;
				EZ.set('okFuncName', suggRules.funcName);
			}
		
			//data.isDefaultValues = false;
			EZ.set('okFunctionTitle', suggRules.funcName + '()');
			EZ('okToggleDefaults').value = 'reset defaults';
			EZ.removeClass('okToggleDefaults', 'hidden');
			
			data.tags.formatWraps.forEach(function(el)
			{
                EZ.removeClass('dataBody', el.id, el.checked);
			});

		}
		while(false)
		
		__updateCurrentValues();			//sets data.isAll
		__resetSuggData(what)
		
		__clearBorders(what);
		__updateColumnFormatHeading();
	}
	//____________________________________________________________________________________________
	function __resetSuggData(what)
	{
		data.isArgsSomeSugg = Boolean(suggRules.basic.okArgsIgnoredList);
		var isAll = suggRules.basic[data.allKey];
		if (!isAll)
			isAll = data.allNotKeys.every(function(key) {return suggRules.basic[key]});
		data.isAllSugg = isAll;	
						
		data.suggCount.all = 0;
		data.suggCount.rules = 0;
		data.suggCount.format = 0;
		data.allGroups.forEach(function(g)
		{
			data.suggCount[g] = 0;	
			var gType = (data.okRuleGroups.includes(g)) ? 'rules' : 'format';
			
			for (var k in suggRules[g])
			{ 
				if (!data.groupKeys[g].includes(k)) continue;
				
				 if (suggRules[g][k] == null)
					suggRules[g][k] = data.defaultValues.all[k];
				else
				{
					data.suggCount[g]++;
					data.suggCount.all++;
					data.suggCount[gType]++;
				}
			}
		});
		if (isOkRule(what))
		{
			__setupIgnoredList();				
			__updateValidateArgs();				//sets argsList related classNames and prompt
		}
	}
	//____________________________________________________________________________________________
	function __clearBorders(what)
	{
		EZ.toArray(what).forEach(function(g)
		{
			EZ.removeClass(data.tags.groups[g], 'sugg');
		});
	}
	//____________________________________________________________________________________________
	/**														
	**/
	function __setBorders(what)
	{
		what = EZ.toArray(what);
		var note, tag,
			isSuggExist,
			updateRules = isOkRule(what), 
			updateFormat = isFormat(what),
						
		//______________________________________________________________________________________
		/**
		 *	update suggValue data-sugg attr if next sibbling and .textBox if following sibling
		**/
		_setSuggValueTag = function(tag, isDiff, suggValue)
		{									
			var nextTag = tag.nextElementSibling;
			if (!nextTag || !nextTag.className.includes('suggValue'))
				return;
			
			if (!isSuggExist)
			{
				nextTag.removeAttribute('data-sugg');
			}
			else if (isDiff)
			{
				suggValue = suggValue || '-blank-';
				nextTag.setAttribute('data-sugg', suggValue);
				//EZ.addClass(nextTag, 'short', suggValue.length < 3);
			}
			else							//must keep data-sugg until transition completes
			{
				//nextTag.removeAttribute('data-sugg');
				//EZ.removeClass(nextTag, 'short');
			} 
			var helpBox = nextTag.nextElementSibling;
			if (helpBox && helpBox.className.includes('helpBox'))
				EZ.set(helpBox, suggValue);
		}
		//==========================================================================================
		
		if (updateRules)
			data.diffKeys.rules = [];
		if (updateFormat)							//update all format groups if any one changes
			what = what.concat(data.formatGroups).removeDups();
		
		what.forEach(function(g)					//update tooltip with current values 
		{											//...and suggValue if they exist
			var gType = (data.okRuleGroups.includes(g)) ? 'rules' : 'format';
			data.diffKeys[g] = [];
			data.diffValues[g] = {};			
		//	if (isSuggExist)						
		//	{
				var valueMap = __getTagValues(g);	//TODO: get from currentValues
				delete valueMap.validation;
				delete valueMap.okArgsIgnoredList;
				
				var suggValues = __getSuggValues(g);
				isSuggExist = isOkRule(g) ? haveSugg('rules') : haveSugg(g);
				
				for (var id in valueMap)			//for each tag in group
				{									//...id is name for radio
					var field = EZ.field(id);
					if (!field) continue;
					//if (id == 'shareFormater') continue;
						
					var el = field.el;
					
					var nowValue = valueMap[id];
					var suggValue = suggValues[id];
					
					var isDiff = isSuggExist && !isSuggValue(nowValue, suggValue, id)
					if (isDiff
					&& (g != 'extended' || validation == 'extended'))
					{
						var key = el.getAttribute('data-name') || id;
						data.diffKeys[g].push(key);
						data.diffValues[g][key] = suggValue;
					}
					switch (field.tagType)
					{
						case 'text': 	
						case 'textarea': 	
						case 'password': 	
						{
							EZ.addClass(el,'sugg', isDiff && isSuggExist);
							_setSuggValueTag(el, isDiff, suggValue);
							break;
						}
						case 'radio': 
						{
							if (!isDiff)
								EZ.removeClass(EZ(el.name,true), 'sugg');
							else
							{
								EZ(el.name,true).every(function(el)
								{						//continue until match found
									if (el.value != suggValue) return true;
									EZ.addClass(el,'sugg', isSuggExist);
								});
							}
							break;
						}
						case 'checkbox': 	
						{
							EZ.addClass(el,'sugg', isDiff && isSuggExist);
							break;
						}
						case 'select-one':				//add sugg class select tag and sugg option
						{	
							EZ.addClass(el,'sugg', isDiff && isSuggExist);
							if (!isDiff)
								EZ.removeClass([].slice.call(el.options), 'sugg');
							else
								EZ.addClass(field.getListOption(suggValue), 'sugg', isDiff);
							
							_setSuggValueTag(el, isDiff, suggValue);
							break;
						}	
						case 'select-multiple':			//mark select tag and all sugg options
						{							
							EZ.addClass(el,'sugg', isDiff && isSuggExist);
							if (!isDiff || !isSuggExist)
								EZ.removeClass([].slice.call(el.options), 'sugg');
							else
							{							//add .sugg to suggested options
								var allOpts = field.getListOption( EZ.toArray(suggValue, '|') );
								EZ.addClass(allOpts, 'sugg')
							}	
							if (el == data.tags.argsList)
								EZ.addClass(['okArgsIgnoredPlus'],'sugg', isDiff && isSuggExist);
							break;
						}	
					}
														//-------------------------------------\\
					if (id in data.tags.tooltip)		//----- update tooltip value/class -----\\
					{									//---------------------------------------\\
						tag = data.tags.tooltip[id];
						EZ.set(tag, nowValue);
						EZ.addClass(tag, 'sugg', isDiff && isSuggExist);
						_setSuggValueTag(tag, isDiff, suggValue);		
					}
				}
		//	}
			if (gType == 'rules') 							
			{												//fields diff from suggValuue (or defaultValue)
				data.diffKeys.rules = data.diffKeys.rules.concat(data.diffKeys[g]);
				__updateTooltip(g);							//updates argsList -or- extended/other details tag
			}
			else											//updated format colunm
			{											
				var diffCount = data.diffKeys[g].length;	
				var id = g + 'TooltipFormatHead';			//e.g. argTooltipFormatHead
				EZ.set(EZ('diffCount', id), diffCount.wrap('()'))
				EZ.set(EZ('code', id), data.diffKeys[g].join(', '))
				EZ.removeClass(EZ.el, 'hidden', diffCount && haveSugg(g));
														
//				EZ.addClass(id, 'suggDiff', diffCount && haveSugg(g));
//				var tags = [id, g + 'TooltipNoneExists']; 	
//				EZ.addClass(tags, 'suggNone', !haveSugg(g));
				
				var col = g.toTitleCase();						//used by css for okRules popup and tooltip
				EZ.addClass(data.tags.dataHead, 'suggFormatExists' + col, haveSugg(g));
				EZ.addClass('dataHead', 'suggFormatDiff' + col, diffCount);
			}
		});	//...end of updating
		
		var note, diffCount;
		if (updateRules)							//----- after all okRule groups updated -----\\
		{
			EZ.set('okValidation', validation);
			EZ.addClass('okRules', 'isAll', EZ.get(data.allKey));
			EZ.addClass(data.tags.dataHead, 'suggRulesExist', haveSugg('rules'));
			
			diffCount = data.diffKeys.rules.length;							
			EZ.set(EZ('diffCount', 'suggBasicSummary'), diffCount.wrap('()'));
			
			note = (!haveSugg('rules')) ? 'No suggested rules exist'
				 : (diffCount === 0) ? 'using all suggested rules'
				 : EZ.s('# Ok rules', diffCount) + ' NOT suggested';
			
			data.tags.note.innerHTML = note;		//footer note for ok rules popup
			var el = data.tags.note.parentElement;	//...and tooltip
			EZ.set(EZ('div', el), data.diffKeys.rules.join(', '));
			EZ.removeClass(EZ('code', el), 'hidden', diffCount);
													//...also inner tooltip on rules tooltip
			EZ.set(EZ('code', 'suggBasicSummary'), data.diffKeys.rules.join(', '));
			
					
												
			if (haveSugg('rules') && diffCount)			//sugg tooltip hover text in note column
				note = EZ.s('# un-suggested ok rules', diffCount);	
			EZ('suggTitle').innerHTML = note;		
			EZ.addClass(EZ.el.parentElement, 'sugg', diffCount);
		
		//	EZ.addClass('dataHead', 'suggRulesDiff', diffCount);
		//	EZ.addClass('dataHead', 'suggRulesExist', haveSugg('rules'));
		}
		
		if (updateFormat)									//----- after all format groups updated -----\\							
		{
			data.diffKeys.format = [];	
			var total = 0, 
			diffList = {};

			data.formatGroups.forEach(function(what)
			{
				var haveFormatSugg = haveSugg(what);
				var keys = data.diffKeys[what];				//can have diffKeys shared??
				diffCount = (haveFormatSugg) ? keys.length : 0;
				total += diffCount;
				if (diffCount)
				{
					keys.forEach(function(k) { EZ.mergeMessages(diffList, k)} );
					
					var uniqueKeys = keys.remove(data.diffKeys.format);
					data.diffKeys.format = data.diffKeys.format.concat(uniqueKeys);
				}
															//format popup footer note -- keep brief
				note = (!haveFormatSugg) ? 'no suggested formats defined'
					 : (diffCount === 0) ? 'all values match sugg'
					 : EZ.s('# settings', diffCount) + ' -- NOT suggested';
				//	 : EZ.s('# un-suggested settings', diffCount);
				EZ(what + 'FormatNote').innerHTML = note;

				var el = EZ.el.parentElement;				//embedded tooltip on format popup and
				var noteTip = 'diff from '					//each format col on okRules popup
							+ (haveFormatSugg ? 'sugg: ' : 'default: ') 
							+ keys.join(', ');
				EZ.set(EZ('div', el), noteTip);				
				EZ.removeClass(EZ('code', el), 'hidden', keys.length);
															//set classNames used by css for format popups
				EZ.addClass(what + 'FormatSettings', 'suggNone', !haveFormatSugg);
				EZ.addClass(what + 'FormatSettings', 'suggDiff', diffCount);
			});			
			EZ.addClass('dataHead', 'haveSuggFormat', haveSugg('format'));
			
			diffCount = data.diffKeys.format.length;
			
			note = !haveSugg('format') ? 'No suggested formats defined'
				 : (diffCount === 0) ? 'all formats match sugg defined'
				 : EZ.s('# un-suggested format settings', diffCount);			
			EZ('suggFormatTitle').innerHTML = note;	
			
			EZ.set(data.tags.suggFormatAllCount, diffCount);
			
			var dups = total - diffCount;
			EZ.addClass(data.tags.suggFormatAllNote, 'shared', dups);
			
			var html = EZ.mergeMessages(diffList).replace(/ x /g, '&nbsp;x&nbsp;').replace(/\n/g, ',\n') 
					   + (dups ? EZ.s('<br><br>* total excludes (#) duplicate shared settings', dups) : '');
			
			data.tags.suggFormatAllCode.innerHTML = html;
		}
																//set classes used by css for tooltip popup		
		var show = EZ('sugg', 'suggTooltipCode');
		EZ.addClass('notSuggNote', 'hidden', show.undefined);
		
		show = EZ('notSugg', 'okIgnoredArgs');
		EZ.addClass('notSuggSelectedNote', 'hidden', show.undefined);
			
		show = EZ('notSelected', 'okIgnoredArgs');
		EZ.addClass('notSelectedSuggNote',  'hidden', show.undefined);
	}
	//________________________________________________________________________________________
	/**														
	 *	Additional tooltip updates not done while updating fields
	**/
	function __updateTooltip(what)
	{											
		//	variables and internal functions {
		// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
		var count, total, html, suggValues, isEq, fmt, el,
			
			suggValues = __getSuggValues(what),
			values = __getTagValues(what),
			
			eqOpts = {
				name: ['USING...'.bold().wrap('<i>'), 'SUGGESTED settings'.bold().wrap('<i>')],
				neq: '<=>'
			},
			//________________________________________________________________________________
			_showDetails = function (what, tag)
			{
				isEq = new EZ.equals(values, suggValues, eqOpts);
				
				html = isEq._data.formattedLog.join('\n');
				html = html.replace(/^\$./mg, '');
				EZ(tag).innerHTML = html;
			};
		// } . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
		//========================================================================================
		switch (what)
		{
			case 'extended': 	
			{
				total = data.tags.groups.extended.length;		
				count = data.diffKeys.extended.length;
				html = (validation != 'extended') ? 'NOT selected'
					 : (count === 0) ? 'All ' + total.wrap('()') + ' match suggested'
					 : ('&nbsp;' + count + ' of ' + total 
					   + ' -- NOT suggested&nbsp;').wrap('<span class="sugg">');
				
				EZ('okExtendedSummary').innerHTML = html;
				_showDetails(what, 'okExtendedDetails')
				break;
			}
			case 'other': 	
			{
				total = data.tags.groups.other.length;
				count = data.diffKeys.other.length;
				html = (count === 0) ? 'All ' + total.wrap('()') + ' match suggested'
					 : ('&nbsp;' + count + ' of ' + total 
					   + ' -- NOT suggested&nbsp;').wrap('<span class="sugg">');
				
				EZ('okOtherSummary').innerHTML = html;
				_showDetails(what, 'okOtherDetails')
				break;									
			}
			case 'basic': 	
			{												//-------------------------------//
				html = [];									//----- selected arguments -----//
				fmt = '<line class="{1}">{0}</line>';		//-----------------------------//
	
				var el = data.tags.argsList;
				var isDiff = EZ.hasClass(el, 'sugg');		//true if sugg ArgsList exists
				el.EZfield.getAllOptions().forEach(function(opt)
				{
					var className = (!haveSugg('rules') && opt.selected) ? 'selected'
								  : (!isDiff) ? ''
								  : opt.selected && !EZ.hasClass(opt, 'sugg') ? 'notSugg'
								  : !opt.selected && EZ.hasClass(opt, 'sugg') ? 'sugg'
								  : '';
					if (opt.selected || className)
					{
						className += (opt.selected) ? ' selectBG' : ' notSelected';
						html.push( fmt.format([opt.text, className.trim()]) )
					}
				});
				if (html.length === 0)
					html.push('-none-')
				EZ.set('okIgnoredArgs', html.join('\n'));
				break;
			}
			default:
			{												
				/*
				if (!data.suggCount[what])						//remove sugg class when not found
				{
					EZ.removeClass( EZ([what], 'suggTooltipFormat'), 'sugg')
					el = EZ('format' + what.toTitleCase() + 'FormatterSugg');
					el.innerHTML = 'No suggested settings';
					EZ.addClass(el, 'sugg');
					return;
				}
				*/
			}
		}					
	}
	//________________________________________________________________________________________
	/**
	 *	called after test options loaded -OR- column format field associated with sugessted
	 *	settings is changed.
	 *
	 *	updates formatter name displayed in heading aboved test data columns, sort icon
	 *	-AND- suggested
	 *	setting tooltip in test data note column heading.
	**/
	function __updateColumnFormatHeading()	
	{	
		EZ.set('displayFormatArgsFormatter', EZ.get('displayFormatArgs') + '()');
		EZ.addClass('displayFormatArgsFormatter', 'sort', EZ.get('displayFormatArgsSort'));
		
														//shared actual / expected
		EZ.set('displayFormatResultsFormatter', EZ.get('displayFormatActual') + '()');
		EZ.addClass('displayFormatResultsFormatter', 'sort', EZ.get('displayFormatActualSort'));
		
		//suggTestOptions('updateColumnFormat', what);
		return true;
	}
	//____________________________________________________________________________________________
	/**
	 *	called by setup or checkbox onchange to update [+/-] icon and checkbox appropriately.
	 *	on setup, checkbox checked-dim if some but not all options selected from saved data
	 *	onchange calls to toggles checked from unchecked to dim checked to undim checked (all)
	 *
	 *	called when argsList popup closed to update checkbox if selections diff from open
	 *
	 *	when top rules popup closed, all options unselected if checkbox not checked and (partial)
	 *	options meaningless when all or none selected -- checked or unchecked has same meaning
	**/
	function __updateValidateArgs()
	{											
		var isAllChecked = EZ.get(data.allKey);
		var checkbox = data.tags.okArgsValidate;
		var checked = checkbox.checked;
		var dim = EZ.hasClass(checkbox, 'dimMore');
		checked = dim ? 'some' : checked;			//true false or "some"
		
		var selections = data.tags.argsList.EZfield.getSelected();
		var selected = selections.checked;

		var plusNotDefined = selections.includes('.');
		if (plusNotDefined)
			selections.length--;
		selections.total--;
		
		//if (selections.length == (selections.total))
		//	selected = true;						//treat all but remaining as all
												
		if (action == 'change' && el == checkbox)	//---------------------------\\		
		{											//update checked and selected...
			/*
			if (el.checked)							
				checked = dim ? true 				
					//	: 'some'
						: selected ? 'some'			//if some selected --> dim
						: true;						//otherwise --> checked-undim
			*/			
			if (dim)								//dim --> checked-undim regardless of selected
				checked = el.checked = true;
			else if (checked 
			&& (selections.value || selected == 'some'))	
				checked = 'some';	
			
			if ((checked == 'some' && !data.tags.argsList.isVisible())
			|| (checked != 'some' && data.tags.argsList.isVisible() ))
			{
				EZ('okArgsIgnoredPlus').click();
			///	data.argsAutoOpen = (checked == 'some');
				data.argsListChanged = false;
				//data.argsListOpen = data.tags.argsList.EZfield.getSelected().join('|');
			}
			//else data.argsAutoOpen = false;
		}											//-------------------------------------\\
		else if (action.includes('close'))			//if closing argsList and/or main popup...
		{											
			//data.argsAutoOpen = false;
			if (selected == 'some') 		//if argsList popup open and selections changed...
			{
				if (data.argsListChanged)
					checked = checkbox.checked = true;
				else
					selected = checked;
			}
			else //if (data.tags.argsList.isVisible()) 		//if argsList popup open and selections changed...
			{
				checked = checkbox.checked = selected;	
				data.tags.argsList.EZfield.setValue(-1);
				EZ.set('okArgsIgnoredList', '');
			}
			checked = selected;
			
			/*
			&& data.argsListOpen == data.tags.argsList.EZfield.getSelected().join('|'))
			{										
				checked = selected;					//sync checkbox with selected: true/false/"some"
				checkbox.checked = selected || !Boolean(selected);
			}
			*/
			if (action == 'close' 					//if closing main popup and...
			&& !EZ.get(data.allKey))				//..."ALL return values" not checked. . .
			{										
				if (checked == 'some' && selected != 'some')
					checked = checkbox.checked = !selected;
				if (checked != 'some')				//unselect all options -- when not used
					data.tags.argsList.EZfield.setValue(-1);
			}
		}
		data.isArgsSome = (checked == 'some');		//used by isSuggValue()
													//-------------------------------------------
													//checkbox: dim/undim  [+] yellow highlight
													//-------------------------------------------
		EZ.addClass(['okArgsValidate','_okArgsValidate'], 'dimMore', checked == 'some');
		EZ.addClass('okArgsIgnoredPlus', 'selected', selections.selected == 'some');	
		
													//-------------------------------------------
													//#okSetting and #suggTooltipCode argList note
													//-------------------------------------------
		EZ.removeClass(['okArgsIgnoredWarnAll', 'okArgsIgnoredWarnArg', 'okArgsIgnoredWarn'], 'notUsed');
		
		var tip = '', warnClass = '', noteTitle = '';
		var note = (!selected) ? '<-- click to select specific arguments'
				 : (selected === true) ? 'All arguments selected'
				 : (selections.length + ' of ' + selections.total + ' on fn statement') 
				 	+ (!plusNotDefined ? ' NOT un-listed' : ' plus un-listed');
		if (isAllChecked)
		{
			tip = 'ALL overrides';
			noteTitle = 'not used when "ALL return values..." checked';
			warnClass = 'okArgsIgnoredWarnAll';
		}
		else if (checked != 'some')
		{
			if (checked != 'some' && selections.value)
			{
				noteTitle = 'not used unless arguments checkbox is dimly checked';
				warnClass = 'okArgsIgnoredWarnArg';
			}
			tip = (checked) ? 'all args checked' : 'args unchecked';
		}
		else
		{
			tip = note;
		}
		EZ.set('okArgsIgnoredNote', note);			//display argsList note (okRules popup)
		EZ.el.title = noteTitle;
		
		
		tip = tip.replace(/(on fn statement|"|\*)/gi, '');
		tip = tip.replace(/ plus un-listed/i, '<span class="unlisted">unlisted</span>');
		tip = tip.replace(/not un-listed/i, '<span class="lineThru red italic">unlisted</span>');
													//tooltip note under validate... arguments
		EZ.set('okArgsIgnoredWarnTip', checked == 'some' ? tip : '');
		
													//tooltip arguments selected... note
		//tip = tip.replace(/\+unlisted/, '').replace(/(on fn statement|"|\*)/gi, '');
		EZ.set('suggTooltipArgsListNote', tip);
		//EZ.set('suggTooltipArgsListCode', warnClass ? tip : '');
		EZ.addClass([warnClass, 'okArgsIgnoredWarn'], 'notUsed', warnClass);
	}
	//____________________________________________________________________________________________
	/**														
	 *	Populate ignored select list options using current test script argument names for text.
	 *	and select option(s) listed in EZ.test.data.options.okArgsIgnoredList
	 *
	 *	DOES NOT set sugg class on select or any option -- done by __setBorders()
	 *	Current or updated values get saved with all other test options in normal manner.
	 
	**/
	function __setupIgnoredList()				//WAS: setupOkRulesFields()
	{													
		var list = data.tags.argsList;
		if (!list) return;
												//belong elsewhere ??
		//---------------------------------------------------------------------------
		var ignoredList = EZ.get('okArgsIgnoredList');
		
		var isIgnored = true;
		//var savedList = list.EZfield.getValue();		
		var savedList = EZ.toArray('EZ.test.data.options.okArgsList'.ov(''),'|');
		if (savedList.length)
			isIgnored = false;
		else
			savedList = EZ.toArray(ignoredList, '|');

		var checked = Boolean(EZ.get('okArgsValidate'));
		if (ignoredList.length > 0 && !EZ.get(data.allKey))
		{
			EZ.addClass(data.tags.okArgsValidate, 'dimMore');
			checked = 'some';
		}
		data.isArgsSome = (checked == 'some');
		//---------------------------------------------------------------------------
		
		list.EZfield.resetInitialAttribute('options');
													
		var fnName = EZ.get('okFuncName')
		var fnStmt = (fnName || 'function') + '(<i>';
													//populate with test fn args if any
		var argNames = EZ.toArray(EZ.get('okArgNames'), ', ');
		var idx = '';
		for (var i=0; i<argNames.length; i++)
		{
			idx = savedList.indexOf(i + '');
			if (idx != -1)
				savedList.splice(idx, 1);
			if (argNames[i])
				fnStmt += argNames[i] + ',';
			
			var text = (i+1).suffix() + ' arg  "' + (argNames[i] || '-na') + '"';
			var selected = (isIgnored) ? idx == -1 : idx != -1;
			EZ.selectOptionAdd(list, text, i, selected);
		}
		var allSelected = savedList.includes('.');
				
		data.deadCount = 0;
		while (idx = savedList.shift())
		{											//prior named fn args
			if (isNaN(idx)) continue;
													//add to list
			var el = EZ.selectOptionAdd(list, (Number(idx)+1).suffix(), idx, true);
			data.deadCount++;
			EZ.addClass(el, 'dead');				//...but mark dead
		}
		EZ.selectOptionAdd(list, '...not listed on fn statememt', '.', allSelected);	
		EZ.selectOptionAdd(list, 'select suggested', '*sugg');	
		
		EZ.addClass('okArgsIgnoredDead', 'hidden', data.deadCount === 0);
		
		if (fnStmt.endsWith(','))
			fnStmt = fnStmt.clip();
		
		EZ.set('okArgsFnStmt', fnStmt + '</i>)');
		return checked;
	}
	//____________________________________________________________________________________________
	/**
	 *	dim or undim suggested rule prompts 
	**/
	function __updateIgnoredPrompts()
	{	
		var border = false,
			lineThrough = false,
			opts = data.tags.argsList.EZfield.getAllOptions();
		
		opts.forEach(function(opt)
		{
			if (opt.className.includes('sugg') && !opt.selected)
				border = true;			//related css ...option.sugg:not(:checked):before
			if (opt.className.includes('sugg') && opt.selected)
				lineThrough = true;		//related css ...option:not(.sugg):checked
		});
		EZ.removeClass('okArgsIgnoredSugg', 'dimMore', border);
		EZ.removeClass('okArgsIgnoredNotSugg', 'dimMore', lineThrough);
	}
	//____________________________________________________________________________________________
	/**
	 *	remove all options with dead class
	 *	called by <input id=okArgsIgnoredDead onClick=""...>
	**/
	function __removeIgnoredDead()
	{	
		var opts = data.tags.argsList.options
		for (var i=0; i<opts.length; i++)
			if (EZ.hasClass(opts[i], 'dead')) 
				EZ.selectOptionRemove(data.tags.argsList, i);
		data.deadCount = 0;
		EZ.addClass('okArgsIgnoredDead', 'hidden');
	}
	//____________________________________________________________________________________________
	/**																//WAS: setupOkRulesFields()
	 *	update okRules fields and associated styles not auto polulated.
	 *	called by setupTestScriptFinish() after test script parsed and EZ.test.data initialized.
	**/
	function __setupEvents()							//adds onclick handler to update setting 
	{													//when span.suggValue textbox is clicked 
		var _linkSuggValue = function(tag, el, what)
		{												
			var nextTag = tag.nextElementSibling;		
			if (!nextTag || !nextTag.className.includes('suggValue'))	//!/(span|div)i/.test(nextTag.tagName)
				return;
													
			nextTag.onclick = onClickEvent.bind(el,'suggValueClick', what);
		}
		//==========================================================================================
		
		for (var what in data.tags.groups)				//add onchange() to settings fields
		{												//...to update tooltip, prompts and buttons 
			var changeAction = (data.formatGroups.includes(what)) ? 'formatChange' : 'change'
			data.tags.groups[what].forEach(function(el)
			{											//EZ.getTagType() only returns 'select'
				var tagType = el.type || EZ.getTagType(el);
				switch (tagType)
				{
					case 'select-multiple':				//handled by EZonChange
						break;
													
					case 'select-one':					//TODO: move into EZ.field()
														/* jshint ignore:start*/
						el.onclick = onChangeEvent.bind(el,'select-one-click');
						el.onblur = onChangeEvent.bind(el,'select-one-blur');
														/* jshint ignore:end */	//FALL-thru
					case 'radio': 						
					case 'checkbox': 	
					
					case 'text': 	
					case 'textarea': 	
					case 'password': 	
					{									
						el.onchange = onChangeEvent.bind(el,changeAction);
						_linkSuggValue(el, el, what);	//add onclick to span.suggValue if found
						break;
					}
				}	
			});
		}
		data.tags.tooltip = {};							//get tooltip tags associated with settings field
		var tags = EZ('suggTooltipCode').getElementsByTagName('*');
		[].forEach.call(tags, function(tag)
		{
			var results = tag.className.match(/\b_(\S*)/);
			if (!results) return;
			
			var id = results[1];
			var el = EZ(id, null);
			if (!el) return;							//bail if no associated setting field found
			
			var tagType = el.type || EZ.getTagType(el)
			switch (tagType)							//add onclick to update some settins from tooltip
			{
				case 'radio': 						
				case 'checkbox': 						//update setting field via el.click()
					tag.onclick = onClickEvent.bind(el, 'click');
					break;
				
				default:								//suggValue span follows, bind onClick
				{										//to setting fieels and what group
					var what = getElGroup(el);
					if (what)
						_linkSuggValue(tag, el, what);
				}
			}
			data.tags.tooltip[id] = tag;
		});
	}
}
/*--------------------------------------------------------------------------------------------------
TODO: move into EZ.set plus... NOT used
--------------------------------------------------------------------------------------------------*/
function testOptionsReset(what, values)
{
	var options = EZ.test.data.options;
	switch (what)
	{
		case 'formatCallArgs':
		{
			options.nowrapCallArgs = EZ.set('nowrapCallArgs' , values[0]);
			options.minWidthCallArgs = EZ.set('minWidthCallArgs' , values[1]);
			options.maxWidthCallArgs = EZ.set('maxWidthCallArgs' , values[2]);
			EZ.copyValue('maxHeightTestRowsShared', values[3]);
			break;
		}
		case 'formatActual':
		{
			options.nowrapActual = EZ.set('nowrapActual' , values[0]);
			options.minWidthActual = EZ.set('minWidthActual' , values[1]);
			options.maxWidthActual = EZ.set('maxWidthActual' , values[2]);
			EZ.copyValue('maxHeightTestRowsShared', values[3]);
			break;
		}
		case 'formatExpected':
		{
			options.nowrapExpected = EZ.set('nowrapExpected' , values[0]);
			options.minWidthExpected = EZ.set('minWidthExpected' , values[1]);
			options.maxWidthExpected = EZ.set('maxWidthExpected' , values[2]);
			EZ.copyValue('maxHeightTestRowsShared', values[3]);
			break;
		}
		case 'formatNote':
		{
			options.nowrapNote = EZ.set('nowrapNote' , values[0]);
			options.minWidthNote = EZ.set('minWidthNote' , values[1]);
			options.maxWidthNote = EZ.set('maxWidthNote' , values[2]);
			EZ.copyValue('maxHeightTestRowsShared', values[3]);
			break;
		}
		default:
		{
			return EZ.oops();
		}
	}
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/

e = function _____SAVED_TEST_RESULTS_____() {}	//convenience for DW functions list

/*----------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
function displayTestResultsNote(msg, className)
{
	msg = msg.trim() ? EZ.formatTime('','spaces') + ': ' + msg : msg;

	var el = EZ('dataNote');
	EZ.set(el, msg);

	if (displayTestResultsNote.className)			//clear prior className if any
		EZ.removeClass(el, displayTestResultsNote.className);

	if (className)						//set className if specified
		EZ.addClass(el, className);

	displayTestResultsNote.className = className;
	return addInfo(msg.replace(/.*?(am|pm): /, ''));	//, className
}
/*----------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
function displayTestResultsWarn(msg, className)
{
	return addInfo(msg, className);
	/*
	msg = msg || '';
	msg = msg.trim();

	var el = EZ('orphanNote');
	EZ.set(el, msg);

	if (displayTestResultsWarn.className)			//clear prior className if any
		EZ.removeClass(el, displayTestResultsWarn.className);

	if (msg)
	{
		if (className)									//set className if specified
		{
			className = className === true ? 'highlight' : className;
			EZ.addClass(el, className);
			EZ.removeClass(['orphanNote','warnings'], 'hidden');
		}
		displayTestResultsWarn.className = className;
	}
	return !msg;
	*/
}
/*----------------------------------------------------------------------------------
find savedResults keeping in mind testno may have changed
----------------------------------------------------------------------------------*/
function getTestResults(testrun)
{
	var saveNote = '';
	
//if (true) return;
	
	//var testIdx = testrun.testno-1;
	var testIdx = testrun.testIdx;
	
	//testrun.id = getTestResultsId(testrun);
	//...........................................??
	if (testrun.id == ('EZ.test.savedResults.' + testIdx + '.id').ov())
	{
		testrun.saveIdx = testIdx;
		EZ.test.savedResults.counts.current++;
		///'EZ.test.savedResults.counts.current'.ov(0)++;
	}
	else testrun.saveIdx = findSaveIdx()

	if (testrun.saveIdx != -1)
	{
		testrun.savedResults = EZ.test.savedResults[testrun.saveIdx] || {};
		testrun.savedResults.saveError = '';
		
		//try
		//{
			//var json = testrun.savedResults.json;
			
		//	var obj = testrun.savedResults.json;
			/*TODO: probably needs to be saved as string
			if (json)
			{
				var obj = {};
				eval('obj=' + json);
				testrun.savedResults = EZ.mergeAll(testrun.savedResults, obj);
			}
			*/
		//	if (obj)
		//		testrun.savedResults = EZ.mergeAll(testrun.savedResults, obj);
		//	else
		//		return saveNote;	//'no saved results';
		//}
		//catch (e)
		//{
		//	testrun.savedResults.saveError = 'saved results json: ' + e.message;
		//}
		EZ.test.savedResults.used = EZ.test.savedResults.used || {}
		EZ.test.savedResults.used[testrun.id] = testrun.saveIdx;
		EZ.test.savedResults[testrun.saveIdx].used = true;
	}
	//======================
	return saveNote;
	//======================

	//______________________________________________________________________________
	/**
	 *
	 */
	function findSaveIdx()
	{
		var saveIdx = findNextId(EZ.test.savedResults.map.all);
		if (saveIdx == -1)
		{
			//testrun.id = getTestResultsId(testrun,'-note');
			saveIdx = findNextId(EZ.test.savedResults.map['-note']);
		}

		if (saveIdx != -1)
		{
			saveNote = '*';
			EZ.test.savedResults.counts.found++;		//savedResults found by id

			var testno = testIdx+1;
			var testnoSave = 'EZ.test.savedResults.'.concat(saveIdx,'.testno').ov(testno)
			if (testnoSave != testno)					//update saveNote if not save testno
				saveNote = '(' + testnoSave + ')*';
		}

		//=============
		return saveIdx;
		//=============
		function findNextId(map)
		{
			saveIdx = map.indexOf(testrun.id);
			var idx = EZ.test.savedResults.used[testrun.id];
			if (idx != -1)
				idx = map.indexOf(testrun.id, idx+1);
			if (idx != -1)
				saveIdx = idx;
			return saveIdx;
		}
	}
}

//__________________________________________________________________________________________________
/**
 *	what: [options | script | results (default)]
 */
function getTestResultsFile(what)
{
	what = what || 'results';
	var funcName = EZ.test.data.funcName || '';

	var folder = EZ.get('folderList')
	var filename = EZ.get('fileList');
	var pathname = EZ.constant.configPath + EZ.test.config.testdataFolder
				 + folder.replace(/.*\/(.*)/,'$1')
				 + '/' + filename;
	var pathfilename = pathname + '/' + funcName + '.' + what.toUpperCase() +  '.js';
	
	var timestamp = DWfile.getModificationDate(pathfilename);
	timestamp = (timestamp <= 0) ? '' : EZ.formatDate(timestamp);
	
	var key = [
		folder.replace(/.*\/(.*)/, '$1'),
		filename.replace(/\./g, '_'),
		funcName.replace(/\./g, '_')
	]
	return { 
		key: key,
		timestamp:timestamp, 
		folder:pathname, 
		filename:pathfilename, 
		url:EZfileToUrl(pathfilename) 
	};
}
//__________________________________________________________________________________________________
/**
 *
 */
function deleteTestResults(testKey)
{
	updateTestResults(testKey, true);
	if (!testKey)
	{
		DWfile.remove(getTestResultsFile().url);
		EZ.addClass('deleteSaved', 'hidden');
		EZ.addClass(EZ('deleteSaved', true), '.invisible');
		displayTestResultsNote('deleted ALL saved results');
	}
}
//__________________________________________________________________________________________________
/**
 *
 */
function loadTestResults()
{
	var msg = '', 
		json,
		loaded = [],
		omitted = [],
		map = {all:[], '-note':[]},
		counts = {total:0, used:0, found:0, current:0, noid:0};

	var file = getTestResultsFile();
	var filename = file.filename;
	EZ.test.app.savedFile = file;
	
	setOpenLink('datafilename', file.url);
	
	try
	{
		var cache = EZ.test.app.cache || {};
		if (cache.testResultsTimestamp != file.timestamp)
			cache.savedResults = '';
		
		EZ.test.savedResults = cache.savedResults;
		if (!cache.savedResults)
		{
			json = DWfile.read(filename) || '[]';
			if (json && json.trim().includes('EZ.test.savedResults='))
			{
				EZ.removeClass('deleteSaved', 'hidden');	//in case of exception
				//----------------------------------------------------------------------------------
				eval(json);
				//----------------------------------------------------------------------------------
				json.replace(/@\s(.*)/, function(all, timestamp)	
				{											//get timestamp form top comment
					EZ.test.app.savedFile.historyTimestamp = timestamp.trim();
				})
			}
			else EZ.test.savedResults = [];
		}
		/*
		var len = Math.max(EZ.test.data.callCount, EZ.test.savedResults.length);
		for (var i=0; i<len; i++)
		{
		*/			
		Object.keys(EZ.test.savedResults).forEach(function(i)		
		{
		//	if (i < EZ.test.savedResults.length)
			if (i in EZ.test.savedResults)					//works for Array or Object
			{
				var results = EZ.test.savedResults[i];
				if (typeof(results) == 'string')			//if results saved as js json String	
				{											//...convert to Object		
					var json = results;
					results = EZ.test.savedResults[i] = parseResults(results, i);
					results._json = json;
				}
				//else if (results instanceof Object)
			}
		//	if (i < EZ.test.savedResults.length
			if (i in EZ.test.savedResults					//works for Array or Object
			&& EZ.test.savedResults[i] instanceof Object)
			{
				/*TODO: getTestResultsId() DELETED
				var id = getTestResultsId(EZ.test.savedResults[i]);
				EZ.test.savedResults[i].id = id;
				map.all.push(id);
				map['-note'].push(getTestResultsId(EZ.test.savedResults[i], '-note'));
				*/
				var id = EZ.test.savedResults[i].id;		
				if (!id)									//ignore if no id
				{											//TODO: may revisit with variants
					counts.noid++;
					return;
				}
				map.all.push(id);
				map['-note'].push(id.replace(/(.*),note:.*/,'$1'));
				delete EZ.test.savedResults[i].used;		//reset when test script runs
				loaded.push(i);
				counts.total++;								//results loaded
			}
			else
			{
				omitted.push(i+1);
				map.all.push('*OMITTED*');
				map['-note'].push('*OMITTED*');
				EZ.test.savedResults[i] = null;
			}
		});
		EZ.removeClass('deleteSaved', 'hidden', counts.total);
		if (counts.total === 0)
			displayTestResultsNote('no saved results found', 'error');
		else
		{
			if (loaded.length < EZ.test.data.callCount)
			{
				msg = loaded.length < omitted.length
					? EZ.s('# saved test results', loaded.length) + ': #' + loaded.format()
					: ' no saved results for: test #' + omitted.format() + '';
				addInfo(msg);
			}
			msg = ''
			msg = EZ.s('loaded # saved results', loaded.length)
				+ ' (saved @ ' 
				+ EZ.formatDate(EZ.test.app.savedFile.historyTimestamp, 'today-time') 
				+ ')'
			//01-02-2017
			//	+ msg.wrap('<i class="nowrap paddingLeftLess">');
			
			displayTestResultsNote(msg);
			if (!EZ.test.savedResults)
			{
				filename = filename.replace(/.js$/, '.ids.js');
				json = DWfile.read(filename);
				if (json) eval(json);								//EZ.test.savedResults.ids

			}
		}
		if (!cache.testResults)
		{
			cache.testResultsfile = file;
		//	cache.testResults = EZ.clone(EZ.test.savedResults);
		}
	}
	catch(e)
	{
		msg = 'Error Loading Saved Results ';
		cache.testResults = '';
		EZ.techSupport(e, msg + '\n' + filename);
		displayTestResultsNote(msg, 'error');
	}
	EZ.test.savedResults = EZ.test.savedResults || [];
	EZ.test.savedResults.map = map;
	EZ.test.savedResults.counts = counts;
	EZ.test.savedResults.used = [];

//	EZ.trace('EZ.test.savedResults.map', EZ.test.savedResults.map);
	//__________________________________________________________________________________________________
	/**
	 *	parse single test savedResults json to Object -- save original json as obj.json
	 */
	function parseResults(json, testKey)
	{
		var obj, rtnValue;
		if (typeof(json) != 'string' 					//if not String
		|| !/[\s'+]*{/.test(json))						//-or- not Object json e.g "test #19 no data"
			return json;								//return json as-is
		try
		{
			console.log('parseResults savedResults[' + testKey + ']');
			switch (EZ.get('saveResults_stringifyWith'))
			{
				//EZ.stringify()
				case 'native': 	
				{
					obj = eval('obj=' + json);
					break;
				}
				case 'jsonPlus': 	
				{
					obj = eval('obj=' + json);
					if (json.includes('@JSON_escapeMarker@'))
					{									//not real marker if inside String but so what
						rtnValue = JSON.plus.unescape(obj, {rtnValue:true});	
						if (!rtnValue.isOk())
							throw 'json failed';
						else
							obj = rtnValue.clone;
					}
					break;
				}
				//case 'jsonPlusV3': 	
				default:
				{
					rtnValue = new EZ.jsonPlusV3.parse(json);
					if (!rtnValue.isOk())
					{
						EZ.log.call('json', rtnValue.getMessageString());
						throw 'json failed';
					}
					else
						obj = rtnValue.getValue();
					break;
				}
			}	
			if (obj && json)
			{
				var script = scriptTestResults(json);
				if (script != null)							//embedded EZ.oops(...)
					obj.json = script;
			}
		}
		catch (e)
		{
			EZ.oops(e + '');
			void(0);
		}
		return obj;
	}
}
//__________________________________________________________________________________________________
/**
 *	create script from json
 */
function scriptTestResults(json)
{
	var rtnValue = new JSON.plusV3.toScript(json);	
	if (rtnValue.isOk())
		return rtnValue.getValue();
	
	EZ.oops(rtnValue.getMessage());
	return null;
}
//__________________________________________________________________________________________________
/**
 *	create json for savedResults -- single test
 */
function jsonTestResultsOneTest(testrun, jsonOpts, testKey)
{
	var savedResults = testrun.savedResults;
	if (!savedResults) return;

	console.log('jsonTestResultsOneTest -- create json: ', testKey || testrun.testKey, savedResults);
	var json = jsonTestResults(savedResults, jsonOpts);
	if (json === undefined)
		return;
	
	var format = EZ.get('savedResultsTestFormat');
	if (format != 'json')
	{
		var script = scriptTestResults(json);
		if (script != null)
			json = script;
	}
	return json;
}

//__________________________________________________________________________________________________
/**
 *	create json for savedResults -- single testno or all
			switch (EZ.get('useCloneObject'))
			{
				case 'json': 	
				{
					break;
				}
				case 'EZ.clone.object': 	
				{
					break;
				}
				case 'objectClone': 	
				{
					break;
				}
				//case 'EZcloneV3': 	
				default:
				{
					break;
				}
			}	
 */
function jsonTestResults(savedResults, jsonOpts)
{
	jsonTestResults.rtnValue = '';
	var json, errorNote, rtnValue;
	try
	{
		var saveWith = EZ.get('saveResults_stringifyWith');
		var saveOpts = EZ.get('savedResults_stringifyOpts');
		saveOpts = EZ.options.call(saveOpts);
		
		if (saveWith == 'jsonPlus')
		{
			var plusOpts = {
				validate:true, unquoteKeys:true, 
				ignore:'none'
			}
			json = JSON.plus.stringify(savedResults, plusOpts);
			rtnValue = JSON.plus.stringify.rtnValue;
			
			if (!rtnValue.isOk())
				jsonTestResults.rtnValue = rtnValue;
		}
		else if (saveWith == 'jsonPlusV3')
		{
			var jsonOpts = {
				validate:true, unquoteKeys:true, name:'savedResults',
				ignore: EZ.get('objectTypeIgnore') ? 'constructor' : '',
				exclude: 'Function'
			}
			jsonOpts = EZ.options.call(jsonOpts, saveOpts);
			rtnValue = new EZ.jsonPlusV3.stringify(savedResults, jsonOpts);
			//if (!rtnValue.isOk())
				jsonTestResults.rtnValue = rtnValue;
			
			json = rtnValue.getValue();
		}
		else	//EZ.stringify
		{
			json = EZ.stringify(savedResults, saveOpts);
			json = json.replace(/(\n)\s*(\])$/, '$1$2');
			json = json.replace(/(no data", )/g, '$1\n    ');
			//////////////////////////////////////////////////////////////////////////////////////			
			EZ.test.savedResultsUpdated = savedResults;			//cheap validation if no exception
			errorNote = ' invalid json';						//message if eval exception
			eval('e=' + json);									//updates EZ.test.savedResults
			errorNote = ''										//...clear message 		
			///////////////////////////////////////////			
			if (!EZ.isEqual(EZ.test.savedResultsUpdated,
			EZ.test.savedResultsUpdated, {showDiff:99, ignore:'objectType'}))
				EZ.oops('saved results json not valid',  EZ.equals.formattedLog);
			//////////////////////////////////////////////////////////////////////////////////////			
		}
	}
	catch (e)
	{
		var msg = 'Error saving updated results' + errorNote;
		EZ.oops(errorNote, msg, {detail:json, error:e+''});
		//EZ.techSupport(e, msg);
	//	testrun.saveError = errorNote;
		displayTestResultsNote('technical difficulty saving results', 'error');
		return;
	}
	return json;
}
//__________________________________________________________________________________________________
/**
 *	DEPRICATED
 */
function saveTestIds()
{
	var rtnValue = EZ.deferred;
	/*TODO:
	if (!EZ('keepOrphanSavedResults').checked) return;

	var testIds = [];
	EZ.test.data.testrun.forEach(function(testrun)
	{
		testIds.push( getTestResultsId(testrun) );
	});

	var json = 'EZ.test.savedResults.ids = \t\t//Saved @ ' + EZ.formatDate('','spaces')
			 + '\n' + JSON.stringify(testIds,null,'\n');

	var filename = getTestResultsFilename();
	filename = filename.replace(/.js$/, '.ids.js');

	return DWfile.write(filename, json);
	*/
	return rtnValue;
}
//__________________________________________________________________________________________________
/**
 *	sort EZ.test.savedResults replicating any used by multiple tests.
 *	replicated when multiple tests had or now have same arguments.
 */
function sortTestResults()
{
	var msg = '';
	saveTestIds();

	var keys = Object.keys(EZ.test.savedResults)
	if (EZ.test.savedResults instanceof Array && /\w/.test(keys))
	{
		EZ.test.savedResults.forEach(function(testrun)
		{
			if (!testrun || testrun.used)
				return;

			if ('.testno'.ov(testrun,999) > EZ.test.data.testrun.length && testrun.used)
				EZ.test.savedResults.counts.used++;
		});
	}
	else
	{
		keys.forEach(function(key)
		{
			var results = EZ.test.savedResults[key];
			if (results instanceof Object === false) 
				return;

			if (results.used)
			{
				EZ.test.savedResults.counts.used++;
				delete EZ.test.savedResults[key];
				return;
			}
			EZ.test.savedResults.counts.unused++;
		});
	}

	if (EZ.test.savedResults.counts.found)
		msg += '* ' + EZ.test.savedResults.counts.found
			 + ' saved ' + EZ.s('result', EZ.test.savedResults.counts.found)
			 + ' found with diff arguments or out of sequence --';
	if (EZ.test.savedResults.counts.used)
		msg += ' used ' + EZ.test.savedResults.counts.used + ' of ' + EZ.test.savedResults.counts.total
			 + ' saved results from prior test script --';
	else
	{
		EZ.test.savedResults.counts.unused = EZ.test.savedResults.counts.total
										   - EZ.test.savedResults.counts.found
										   - EZ.test.savedResults.counts.current;
		if (EZ.test.savedResults.counts.unused)
			msg += ' ' + EZ.test.savedResults.counts.unused
				 + ' saved results NOT used by current test script --';
	}
	msg = msg.clip(3);
	displayTestResultsWarn(msg, true);
	saveHistory().addNote(msg);
}
//__________________________________________________________________________________________________
/**
 *	update or delete testrun.savedResults then create or update test results file
 *
 *	Uses testno to easily call from debugger console -- if not specified all tests saved
 */
function updateTestResults(testKey, isDelete)
{
	var testrun, msg = '';
	var isAll = !testKey;
	var el = (isAll) ? 'saveAll' : EZ.test.data.testrun[testKey].tags.EZ('saveWrap');
	if (EZ.message.wait('saving results', el, this)) 
	{		
		if (testKey)
		{
			testrun = EZ.test.data.testrun[testKey];
			testrun.info = ['saving...'];
			formatNote(testrun,'saved');	
		}
		return;							
	}
	//EZ.timer.clearTimeout('_saveResults');

	//var count = 0, 
	var unchanged = [], updated = [];					//used by saveTestResults
	var updatedOnly = !testKey && !EZ('saveAll').value.includesIgnoreCase('all');
	var jsonSaveOpts = {};
	var savedResults;

	EZ.test.app.saveDetails = [];
//	var len = (testno || EZ.test.data.testrun.length);
//	for (var i=(testno||1); i <= len; i++)
	var testrunKeys = testKey ? testKey : Object.keys(EZ.test.data.testrun);
	testrunKeys.forEach(function(testKey)
	{
		//var testIdx = i - 1;
		var testrun = EZ.test.data.testrun[testKey];
		if (!testrun) return;
		
		setOverride(testrun, false);
		testrun.saveError = '';
		
		try
		{
			if (isDelete)
			{
				delete testrun.saveOk;
				delete testrun.savedResults
				testrun.expected = EZ.clone(testrun.expectedScript);
				updateTestDisplay();
				
				updateTestStyles(testrun, isAll, 'delete');
	
				testrun.info = ['deleted saved results @ ' + EZ.formatTime()];
				formatNote(testrun,'saved');
			}
			else
			{
				var saveOpts = EZ.get('savedResults_stringifyOpts');
				saveOpts = EZ.options.call(saveOpts);
				var jsonSaveOpts = {
					validate:true, unquoteKeys:true, name:'savedResults',
					ignore: EZ.get('objectTypeIgnore') ? 'constructor' : '',
					exclude: 'Function',
					showDiff: 5
				}
				jsonSaveOpts = EZ.options.call(jsonSaveOpts, saveOpts);
	
				var haveSaved = Boolean(testrun.savedResults)
				
				savedResults = testrun.savedResults = (testrun.savedResults || {});
	delete savedResults.changedDetail;
				testrun.savedResults.ok = testrun.okChecked;	//updated savedResults.ok
				testrun.lastSaveOk = testrun.saveOk;			//used by setTestStyle()
				testrun.saveOk = testrun.okChecked;				//saveOk originally set by setTestOkStatus()
				
				var saveKeys = EZ.test.getSaveKeys(testrun);
				mergeValues(saveKeys);							//non-Object SaveKeys values from testrun
	
	if (false && !EZ.get('validation'))			//TODO:additional properties for extended validation
					mergeValues( EZ.test.getValidateKeys(testrun) );
				
				delete savedResults.saveDateTime;				
				var keys = Object.keys(savedResults);			//delete keys not in SaveKeys
				keys = keys.remove(saveKeys.concat(['actual', 'expected']));
				keys.forEach(function(key) {delete savedResults[key]});
				
																//prior saved actual and expected
				savedResults.actual = '.savedResults.actual'.ov(testrun, {});
				savedResults.expected = '.savedResults.expected'.ov(testrun, {});
	
				msg = '&nbsp;NOT\n <== updated to actual return value\n' + '&nbsp;'.dup(9);
				testrun.info = [];
				var saveActualWhen = EZ.get('saveActualWhen');	//actual as expected -- if not editted
				var useActualForExpected = false
				
				if (saveActualWhen == 'always')
					useActualForExpected = true;
				
				else if (saveActualWhen == 'never')
						saveActualWhen = '\n&nbsp;never updated to actual return value';
				
				else if (saveActualWhen == 'ok')
					testrun.okChecked ? useActualForExpected = true
									  : saveActualWhen = msg + 'when Ok NOT checked';
				
				else if (saveActualWhen == 'notOk')
					!testrun.okChecked ? useActualForExpected = true
									   : saveActualWhen = msg + 'when Ok IS checked';
				
				var useActualArgs = EZ.get('saveActualWhenChanged');
	
				
				var eqOpts = {showDiff:6, rtnValue:true}
				var rtnValue = EZ.equals(savedResults.actual, testrun.safe.actual, eqOpts);
				if (!rtnValue.isOk())
				{												//update actual results if changed from prior saved
					testrun.info.push('changed saved actual results');
					if (Object.keys(savedResults.actual).length === 0)
						testrun.info.push('     no prior saved values');
					else
					{
						//testrun.info.push('     ' + rtnValue.getFormattedLog('\n     '));
						if (rtnValue.haveList('added'))
							testrun.info.push('     added:  ' + argSuffix(rtnValue.getList('added').join(', ')));
						if (rtnValue.haveList('deleted'))
							testrun.info.push('     deleted: ' + argSuffix(rtnValue.getList('deleted').join(', ')));
						if (rtnValue.haveList('changed'))
							testrun.info.push('     updated: ' + argSuffix(rtnValue.getList('changed').join(', ')));
					}
					savedResults.actual = _cloneUpdatedValue(testrun.safe.actual);
				}
				var isUpdated = false;
				var isAnyExpected = false;						//update expected results if changed
				testrun.args_idx.forEach(function(idx)
				{
					var msg = '';
					var expected = getExpected(testrun, idx, 'safe');
					var expectedSaved = (idx in savedResults.expected) ? savedResults.expected[idx]
																	   : EZ.test.notSpecified
					var isChanged = testrun.argsChanged[idx] || testrun.isFn(idx,'actual');
					var isEqual = EZ.equals(expected, testrun.safe.actual[idx]);
					var isActualChanged = isChanged && !isEqual ;
					if (isActualChanged)
					{
						if (!useActualForExpected) 
						{
							isActualChanged = false;
							testrun.info.push('expected ' + testrun.callArgNameCite[idx] + saveActualWhen);
						}
						else if (idx != 'results')				//arguments
						{
							switch (useActualArgs)
							{
								case 'expected': 	
								{
									if (!testrun.isExpectedArgument(idx))
										isActualChanged = false;
									break;
								}
								case 'testfn': 	
								{
									if (!testrun.isFn(idx,'actual'))
										isActualChanged = false;
									break;
								}
								case 'script': 	
								{
									if (testrun.isFn(idx,'actual'))
										isActualChanged = false;
									break;
								}
								case 'never': 	
								{
									isActualChanged = false;
									break;
								}
								default:	//always
						
							}	
							if (!isActualChanged)
								testrun.info.push( testrun.callArgNameCite[idx] + ' not changed');
						}
					}
					var edit = '.edit.expected'.ov(testrun);
					if (edit && 'saved' in edit)
					{
						savedResults.expected[idx] = edit.saved[idx];
						msg = 'updated to editted value';
					}											
					else if (isActualChanged)		
					{											//save actual for expected
						var value = _cloneUpdatedValue(testrun.safe.actual[idx], idx, 'actual');
						savedResults.expected[idx] = testrun.expected[idx] = value;
						
						msg = 'updated to '
							+ (testrun.isFn(idx, 'actual') ? 'script fn value'
														   : 'actual return value');
					}
					else if (EZ.equals(expectedSaved, expected))
					{
						if (expectedSaved != EZ.test.notSpecified)
							isAnyExpected = true;
					}
					else if (expected != EZ.test.notSpecified)
					{
						savedResults.expected[idx] = _cloneUpdatedValue(expected,idx,'expected');
						msg = 'updated to ' + testrun.exFrom + ' value';
					}
					else
					{
						delete savedResults.expected[idx];
						msg = 'discarded';
					}
					if (expectedSaved != EZ.test.notSpecified)
						isAnyExpected = true;
	
					if (msg)
					{
						isUpdated = true;
						if (msg != 'discarded') isAnyExpected = true;
						var argName = testrun.getArgumentCiteName(idx, 'actual');
						testrun.info.push('expected ' + argName + '...\n' + '&nbsp; <== ' + msg);
					}
				});	//end forEach testrun.args_idx
				
				if (!isAnyExpected)
					testrun.info.push('no expected values saved');
				
				//EZ.test.savedResults[testIdx] = EZ.clone(savedResults);
	
				testrun.saveDateTime = testrun.savedResults.saveDateTime = EZ.formatDate('','spaces');
				//------------------------------------------------------------
				delete testrun.savedResults._json;
				var json = jsonTestResultsOneTest(testrun, jsonSaveOpts);
				testrun.savedResults._json = json;
				//------------------------------------------------------------
				if (jsonTestResults.rtnValue && jsonTestResults.rtnValue.isOk() !== true)
				{
					msg = 'stringify() messages '
						+ '<img src="../images/flag_red.png" width="12" height="12">';
					testrun.info.unshift(msg.wrap('<em>'));
					
					msg = jsonTestResults.rtnValue.getList('validate_details').join('\n');
					testrun.saveError += msg.trim() + '<hr>';		
				}
				msg = 'saved @ ' + EZ.formatTime();
				if (haveSaved && !isUpdated)
					msg += ' no changes';
				else
				{
					var historyNote = 'test #' + testrun.testKey + '\n' 
									+ testrun.info.join('\n')
					EZ.test.app.saveDetails.push(historyNote);
				}
				testrun.info.unshift(msg);
	
				msg = 'see advanced settings >&nbsp;save&nbsp;options'.wrap('<em>');
				testrun.info.push(msg);		
				formatNote(testrun,'saved');	
				do
				{
					if (updatedOnly)			//saving updated tests
					{
						var isUpdated = EZ.test.data.counts.updated;
						if (isUpdated)
						{
							unchanged.push(testrun.testKey);
							break;
						}
					}
					//count++;
					updated.push(testrun.testKey);
					updateTestStyles(testrun, isAll, 'save');
				}
				while (false)
			}
		}
		catch (e) 
		{
			msg = (isDelete ? 'delete' : 'save') + ' failed';
			testrun.info.unshift(msg.wrap('<cite>'), e.message);
			testrun.saveError += e.stack.formatStack().join('\n') + '\n';
		}
		testrun.saveError = testrun.saveError.trim();
		if (testrun.info.length > 1)					//update results and note columns
			updateTestDisplay();
	});	//end for each testKey
	if (!isAll)
		showCounts()

	//===============================
	saveTestResults(isAll, isDelete);
	//===============================
	//______________________________________________________________________________
	/**
	 *
	 */
	function mergeValues(keys)
	{
		keys.forEach(function(key)						//create new (safe) savedResults Object from
		{												//prior saved values or current testrun copy
			var value = testrun.savedResults[key] || testrun[key];
			if (value == null || value instanceof Object)
				return;									//safety for unexpected
			savedResults[key] = value;
		});
	}
	//______________________________________________________________________________
	/*
	 *
	 */
	function updateTestDisplay()
	{
		setTestOkStatus(testrun);
		//testrun.okChecked = EZ.toggleCheckbox( testrun.tags.EZ('ok'), testrun.allOk.run);
		displayResults(testrun,'expected');
		formatNote(g.testrun,'final');
	}
	//______________________________________________________________________________
	/**
	 *	change [0] to [1st arg]
	 */
	function argSuffix(str)
	{
		return str.replace(/\[(\d+)\]/g, function(all, idx)
		{
			return '[' + (EZ.toInt(idx)+1).suffix() + ' arg]';
		});
	}
	//______________________________________________________________________________
	/**
	 *	clone if not previously cloned or set by test script function
	 */
	function _cloneUpdatedValue(value, idx, className)
	{
		if (testrun.isClonedValue(idx,className))
			return value;
			
		if (!(value instanceof Object) || !Object.keys(value).length)
			return value;
			
		var rtnValue =  new EZ.cloneV3.object(value, jsonSaveOpts);	//
		if (rtnValue.isOk())
			return rtnValue.getValue();
		
		var msg = 'unable to clone '.concat(className + ' results:').wrap('<em>')
				+ '<img src="../images/flag_red.png" width="12" height="12">'
				+ '\n  '
				+ testrun.getArgumentCiteName(idx,className);
		testrun.info.push(msg);
		
		msg = rtnValue.getDetails().join('\n');
		testrun.saveError += msg.trim() + '<hr>';
		
		return value;
	}
	//______________________________________________________________________________
	/**
	 *	TODO: may be issue saving when testnos not stored in order -- e.g. #35 before #30
	 *		  may occure when tests are reordeed in test script -- FIXED by sortTestResults() ??
	 * 		
	 *	NOTE: loaded EZ.test.savedResults NOT updated  -- keep for orphans ??
	 */
	function saveTestResults(isAll, isDelete)
	{
		var testrun, jsonOne;
		var msg='', warn='', errorNote = '', 
		heading, historyTitle;
		if (!EZ.test.data) return;
			
		//var savedResults = [];
		var counts = {total:0, unused:0, stale:0};
		displayTestResultsWarn('');

		if (!isAll || !isDelete)
		{
			var timestamp = new Date(); 
			var jsonAll = ['EZ.test.savedResults=\t\t//Saved @ ' + EZ.formatDate(timestamp,'spaces')];
			jsonAll.push('[');
	
			var prefix = '\t' + "'" + '"';
			var suffix = '"' + "'";
			
			var savedList = [];									//use Array if possible as safety
			var testrunKeys = Object.keys(EZ.test.data.testrun || []).sort();
			if (/\w/.test(testrunKeys))
				savedList = {};
			
			testrunKeys.forEach(function(testKey)
			{
				var jsonSavedResults = prefix + 'test #' + testKey + ' no data' + suffix;
				var results = EZ.test.data.testrun[testKey].savedResults;
				if (results) 
				{
					jsonOne = results._json
					if (!jsonOne)
						jsonSavedResults = prefix + 'test #' + testKey + ' invalid json' + suffix;
					else
					{
					//	savedResults[idx] = results;				//remant from json all tests
						delete results.used;
						jsonSavedResults = jsonOne;
					}
				}
				counts.total++;
				savedList.push(testKey);
				jsonAll.push(jsonSavedResults);
				jsonAll.push(',');
			});
			if (EZ('keepOrphanSavedResults').checked)				//save unused test results
			{
				var keepDays = EZ.get('keepOrphanDays',0).toInt();
				var staleTime = (keepDays === 0) ? 1
							  : new Date().getTime() - 1000 * 60 * 60 * 24 * keepDays;
				var staleDate = EZ.formatDate(staleTime, 'date');

				//EZ.test.savedResults.forEach(function(results)		
				Object.keys(EZ.test.savedResults).forEach(function(testKey)		
				{
					var results = EZ.test.savedResults[testKey];
					if ( !(results instanceof Object) )
						return;
				//	if (savedList.includes(idx))
				//		return;
				//	if (savedResults[idx] || !(results instanceof Object))
																	//saved Date or 1979 if none
					var saveDateTime = results.saveDateTime || '0';	//EZ.format.date();
					saveDateTime = new Date(saveDateTime.replace(/-/g,'/'));
					
					if (EZ.getTime(saveDateTime) < EZ.getTime(staleDate))
						counts.stale++;
					else											//not stale -- save
					{							
						jsonOne = results._json;
						if (!jsonOne)
						{
							var testrun = {savedResults: results};
							var testKey = 'unused: ' + results.testKey;
							jsonOne = jsonTestResultsOneTest(testrun, jsonSaveOpts, testKey);
							if (!jsonOne) return;
						}
						counts.total++;
						counts.unused++
					//	savedResults[idx] = results;
					//	delete savedResults[idx].used;

						jsonAll.push(results._json);
						jsonAll.push(',');
					}
				});

				if (counts.unused)
					warn = (counts.unused) + ' unused results saved --';
				if (counts.stale)
					warn += counts.stale + ' stale results discarded --';
				warn = warn.clip(3);
				displayTestResultsWarn(warn, true);
			}
			if (jsonAll.length > 2)
				jsonAll.pop();
			jsonAll.push(']');
			jsonAll = jsonAll.join('\n');

			/*
			var jsonAll = jsonTestResults(savedResults);
			jsonAll = 'EZ.test.savedResults=\t\t//Saved @ ' + EZ.formatDate(timestamp,'spaces') + '\n'
				 	+ jsonAll;

			*/
			
			var file = getTestResultsFile();
			var folder = file.filename.replace(/(.*\/)(.*)/, '$1history/');
			//============================================================
			if (!DWfile.exists(folder))
				DWfile.createFolder(folder)
			//============================================================
			
			var historyFile = file.filename.replace(/(.*\/)(.*)/, '$1history/$2');
			var dateStr = EZ.timestampFilename(timestamp);
			dateStr = dateStr.replace(/\./,' @ ');
			historyFile = historyFile.replace(/(.*)\.(.*)/, '$1.SAVED.' + dateStr + '.$2');
			
			EZ.test.app.savedFile.historyFilename = historyFile.substr(folder.length);
			EZ.test.app.savedFile.historyTimestamp = EZ.formatDate(timestamp);
			
			var errorNote;
			//============================================================
			if (!DWfile.write(historyFile, jsonAll)) 
				errorNote = 'failed saving results in history'
			else if (!DWfile.copy(historyFile, file.filename))
				errorNote = 'failed saving RESSULTS.js'
			//============================================================
			if (errorNote)
				return displayTestResultsNote('save results fault: ' + errorNote, 'error');
			//return;
		}
		heading = EZ.s('saved # test results', counts.total);
		historyTitle = (counts.total === 1) ? 'one test' : EZ.s('[#] tests', counts.total);
		
		if (isAll && isDelete)
		{
			heading = 'deleted saved results for all tests';
			historyTitle = '';
		}
		else
		{												//updated and unchanges from updateTestResults()
			msg = (updated.length ? ": updated test #: " + updated.format() : '')
				+ (unchanged.length ? ' (' + unchanged.length + ' unchanged)' : '');
			heading += msg;
			historyTitle += msg;
		}
		displayTestResultsNote(heading);

		if (warn)
			historyTitle +=  ' ' + warn.wrap('()');
		var note = EZ.test.app.saveDetails.join('\n');	//individual test notes
		saveHistory().addFile(historyTitle, note);		//add filename to saved results history
		
		if (!isAll)										//update styles after file written
			updateTestStyles(testrun)					//...called by updateTestResults() if saveAll

		if (g.savedResultsisLegacy)
			EZ.removeClass('deleteSaved', 'hidden');	//show top level delete icon
		else if (isAll)					
			showCounts();								//called by updateTestResults() if not saveAll
	}	
}

//_________________________________________________________________________________________________
e = function _____saveHistory_____() {}	//convenience for DW functions list
//_________________________________________________________________________________________________

/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function saveHistory()
{												//this.data used by _init if...
	var dataDefault = {							//...EZ.*.HISTORY.js not found or outdated
		files: [],
		notes: {},
		titles: {},
		testCount: 0,
		timestampRestored: '',
		timestamp: '',
		version: '10-08-2016'
	}											  //-------------------------------\\
	if (this instanceof arguments.callee) 		 //----- called as constructor -----\\
	{											//-----------------------------------\\
		/**
		 *	called by EZ.popup.show() when icon clicked
		 *	currentlt just restores float msg
		 */
		this.open = function _open(timestamp)
		{	
			this.message();						//display prior or pending msg
			if (!timestamp) return
												//annotate current file if listed
			var idx = this.filesList.indexOf(timestamp);
			if (idx == -1) return;
			var opt = this.currentOpt = this.list.options[idx];
			
			this.list.selectedIndex = idx;
			EZ.addClass(this.currentOpt, 'current');
			if (opt.value == this.data.filenameRestored)
			{
				timestamp = EZ.formatDate(this.data.timestampRestored, 'today-time');
				this.message('restored @ ' + timestamp);
			}
			this.select()
			var list = this.list;
			setTimeout(function() {list.focus()}, 100)														
		}
		/**
		 *	called by saveTestResults() with initial title and note
		 */
		this.addFile = function _addFile(title, note)
		{
			this.data.timestampRestored = '';
			var filename = EZ.test.app.savedFile.historyFilename;
			
			this.data.titles[filename] = title || '';
			if (note)
				this.data.notes[filename] = note.replace(/&nbsp;/g, ' ');

			
			delete EZ.test.app.saveHistory;		//force re-build of dropdown and associated lists
			this.message('reset');
			this.save();
		}
		/**
		 *	called by sortTestResults() after test 1st run if saved results
		 *
		 *	derive history filename from timestamp -- example:
		 *
		 *		EZ.getType.RESULTS.SAVED.2016-10-08 @ 17_46_14.js
		 */
		this.addNote = function _addNote(note)
		{
			if (!note) return;
			note = note.trim().trimPlus('*').trim();
												//create filename using 24hr timestamp 
			var timestamp = new Date(EZ.test.app.savedFile.historyTimestamp);
			var dateStr = EZ.timestampFilename(timestamp).replace(/\./,' @ ');
			var filename = this.historyFilePrefix + dateStr + '.js';
			//EZ.test.app.savedFile.historyFilename = filename;
			
			var noteSaved = this.data.notes[filename] || '';
			if (!noteSaved.includes(note))
			{
				note = EZ.formatDate() + '\n' + note.replace(/&nbsp;/g, ' ');
				if (noteSaved)
					noteSaved = '-'.dup(120) + '\n' + noteSaved;
				this.data.notes[filename] = note.concat('\n', noteSaved || '').trim()
				
				var idx = this.data.files.indexOf(filename);
				if (idx != -1)
				{
					var opt = this.list.options[idx];
					opt.text = EZ.SPACE + opt.text.substr(1);
					if (idx == this.list.selectedIndex)
						EZ.set('historyNote', this.data.notes[filename]);
				}
				else void(0);					//debugger convenience
			}
		}
		/**
		 *	show current note in browser window
		 */
		this.browseNote = function _browseNote()
		{	
			var note = EZ.get('historyNote').replace(/\n/g, '<br>')
			EZ.displayBrowser(note, 'SAVED RESULTS NOTE');
		}
		/**
		 *	delete all but most recent saved results history
		 */
		this.deleteAll = function _deleteAll(el)
		{	
			EZ.message.wait('deleting files', el, this)
			var folder = this.historyFolder;
			var data = this.data;
			var keep = EZ.get('historyKeep');
			var date;
			var delList = [];
			this.filesList.forEach(function(dateTime, idx)
			{
				var fileDate = dateTime.substr(0,10)
				if (!date)	
					return date = fileDate;
				else if (keep == 'each' && date != fileDate)
					return date = fileDate;
				
				var filename = data.files[idx];
				if ((data.titles[filename] || '').includes('CERTIFIED'))
					return;
				
				delList.push(data.files[idx]);
				//============================================================				
				DWfile.remove(folder + '/' + filename);
				//============================================================
			})
			//if (true) return EZ.log.call('saveData', delList, data.files.remove(delList));
			data.timestamp = '';
			this.save();
			delete EZ.test.app.saveHistory;		//force re-build of dropdown...
			setTimeout(saveHistory, 500);
		}
		/**
		 *	delete history file then remove from dropdown and associated lists
		 */
		this.delete = function _delete()
		{	
			var filename = EZ.get(this.list);
			if (!filename) return;
			
			var filepath = this.historyFolder + '/' + filename;
			//================================================================
			DWfile.remove(filepath);
			//================================================================
			
			var idx = this.list.selectedIndex;
			var opt = this.list.options[idx];
			EZ.removeClass(opt, 'current');
			if (EZ.hasClass(opt, 'nextDate') 
			&& EZ.formatDate(this.filesList[idx], 'date') == EZ.formatDate(this.filesList[idx+1], 'date'))
				EZ.addClass(this.list.options[idx+1], 'nextDate') ;

			this.data.files.splice(idx,1);
			this.filesList.splice(idx,1);
			
			EZ.selectOptionRemove(this.list, idx);
			if (this.list.selectedIndex == -1)
				this.list.selectedIndex = idx;
			this.id = '';
			this.select();
			this.save();
			var list = this.list;
			setTimeout(function() {list.focus()}, 100)
		}
		/**
		 *
		 */
		this.restore = function _restore()
		{
			var filename = EZ.get(this.list);
			if (!filename) 
				return this.message('reset');
			
			var filepath = this.historyFolder + '/' + filename;
			//================================================================
			DWfile.copy(filepath, getTestResultsFile().filename);
			//================================================================ 
			
			this.data.filenameRestored = filename;
			this.data.timestampRestored = EZ.formatDate();
			
			this.message('restored', 'restored'); 
			EZ.addClass('historyReload', ['starburst', 'unhide']);
			EZ.removeClass(this.currentOpt, 'current');		
			this.list.selectedIndex = -1;
			this.save();
		}
		/**
		 *	
		 */
		this.compare = function _compare(el)
		{	
			if (!el)
				return this.message('reset');
		
			var compareOpts = this.compareOpts
			if (this.list.selectedIndex == -1)
			{
				if (!compareOpts)
					EZ.message('file must be selected', {floatNode:el, delay:5});
				else
				{	
					EZ.removeClass([compareOpts.fromOption, compareOpts.toOption], 'compare');
					delete this.compareOpts;
				}
				return;
			}
			if (!this.compareOpts)				//enter compare mode if not already
			{									
				this.message('reset');
				compareOpts = this.compareOpts = {			//save from file
					fromFile: EZ.get(this.list),
					fromOption: this.list.options[this.list.selectedIndex],
				//	btnField: EZ.field(el, true)
				}
				//el.title = el.getAttribute('alt');
				EZ.addClass(compareOpts.fromOption, 'compare');
				this.message('select another file to compare');
				this.list.selectedIndex = -1;
			}
			else								//save to file and call compare
			{									//ok if same file winmerge tells us
				compareOpts.toFile = EZ.get(this.list);
				compareOpts.toOption = this.list.options[this.list.selectedIndex];
				this.message('reset');
												
				EZ.addClass(compareOpts.toOption, 'compare');
				EZ.message.wait('comparing', compareOpts.toOption);
				this.list.selectedIndex = -1;	//un-select so compare class shows
				
				var fromFile = EZ.filePlus(this.historyFolder, this.compareOpts.fromFile);
				var toFile = EZ.filePlus(this.historyFolder, this.compareOpts.toFile);
				setTimeout( function() {EZ.compare(fromFile, toFile)}, 250);
				
				var ctx = this;
				var fn = function() 				//leave compare mode onFocus
				{
					window.removeEventListener('focus', fn, true);

					if (!compareOpts.toFile)
						return EZ.oops('toFile blank', EZ.compare.rtnValue)
			
					//ctx.compareOpts.btnField.resetInitialAttribute('title');
					EZ.removeClass([compareOpts.fromOption, compareOpts.toOption], 'compare');
					EZ.message.reset();
					delete ctx.compareOpts;
				}
				window.addEventListener('focus', fn, true)				
				ctx.list.selectedIndex = -1;		
				return;
			}
		}
		/**
		 *	called onChange from dropdown -- display title and note -OR- compare			
		 */
		this.certify = function _certify(el)
		{
			var idx = this.list.selectedIndex;
			if (idx == -1)
				return;
			var isTrue = (typeof(el) == 'boolean') ? el : !EZ.hasClass(el, 'certified');
			var opt = this.list.options[idx];
			var id = opt.value;
			var title = EZ.get('historyTitle').replace(/\s*certified/i, '').trim()
					  + (isTrue ? ' CERTIFIED' : '');
			EZ.set('historyTitle', title)
			this.data.titles[id] = title;
			opt.text = (this.data.notes[id] || '' ? EZ.DOT : EZ.SPACE)
					 + this.filesList[idx] + ' ' + title;
					 
			EZ.addClass(['historyCertify', opt], 'certified', isTrue);
			this.save();			
			var list = this.list;
			setTimeout(function() {list.focus()}, 100);
		}
		/**
		 *	called onChange from dropdown -- display title and note -OR- compare			
		 */
		this.select = function _select(el)
		{
			if (this.compareOpts)					//if in compare mode. . .
				return this.compare(el)
										
			this.update();							//save title and/or note of prior selection

			var title = '';
			this.id = EZ.get(this.list);			
			if (this.id)
			{									//if file selected, update tilte/note fields
				title = this.data.titles[this.id] || '';
				EZ.set('historyTitle', title);
				EZ.set('historyNote', this.data.notes[this.id] || '');
			}
			EZ.addClass('historyCertify', 'certified', title.includes('CERTIFIED'));
		}
		/**
		 *	save updated title and/or note
		 */
		this.update = function _update()
		{
			var id = this.id;
			if (!id) return;
			
			var data = this.data;
			var isUpdated = false;
			var value;
			['Title', 'Note'].forEach(function(p)
			{
				var key = p.toLowerCase() + 's';
				value = EZ.get('history'+p);
				if (value == EZ.el.getAttribute('alt'))
					value = ''
				if (data[key][id] != value)
				{
					isUpdated = true;
					(value) ? data[key][id] = value
							: delete data[key][id];
				}
			});
			var idx = this.data.files.indexOf(id);
			if (idx != -1)
			{
				var opt = this.list.options[idx];
				opt.text = (data.notes[id] || '' ? EZ.DOT : EZ.SPACE)
						 + this.filesList[idx] + ' '
						 + (data.titles[id] || '');
				//opt.text = opt.text.replace(/m[*-] /, value ? 'm* ' : 'm-');
			}
			if (this.compareOpts)
			{
				this.message('reset');
				delete this.compareOpts;
			}
			if (isUpdated)
				this.save();
		}
		/**
		 *	
		 */
		this.save = function _save()
		{
			EZ.set('historyCount', this.list.options.length);
			var json = EZ.stringify(this.data, '*arrayitemsperline=1')
			//=========================================================================
			if (!DWfile.write(this.file.url, json))
				EZ.oops('DWfile failed', DWfile.fault);
			//=========================================================================
		}
		/**
		 *
		 */
		this.message = function _message(msg, className)
		{
			if (msg && this.messageText)				//clear prior or pending
			{
				if (this.messageClass)
					EZ.removeClass(this.messageNode, this.messageClass);
				
				delete this.messageText;
				delete this.messageNode;
				EZ.message.reset();
			}
			else if (msg)								//new message / className
			{
				this.messageText = msg;
				this.messageNode = this.list.options[this.list.selectedIndex];
				
				if (className)
				{
					EZ.addClass(this.messageNode, className);
					if (className != 'compare')			//compare class not cleared by us	
						this.messageClass = className;
				}
			}
			
			var node = this.messageNode;				//if prior or pending message
			if (node && node.isVisible())				//display message if popup open
				EZ.message(this.messageText, 
					{floatNode:node, delay:0, close:false, marginTop: '-18px'}); 
		}
		return this;									//don't fall thru to non-constructor call
	}
	//______________________________________________________________________________________________
	/**
	 *	called from below if EZ.test.app.saveHistory != new saveHistory()
	 */
	function _init()
	{
		this.list = EZ('historySaveList');
		this.file = getTestResultsFile('history');
		this.historyFolder = this.file.folder + '/history';
		this.historyFilePrefix = EZ.test.data.funcName + '.RESULTS.SAVED.';
		
		//=========================================================================
		var json = DWfile.read(this.file.url) || '{}';
		//=========================================================================
		eval('this.data=' + json);
		if (this.data.version != dataDefault.version)
			this.data = dataDefault;
														
		var timestamp = this.file.timestamp;
		if (!this.data.timestamp 
		|| EZ.getTime(this.data.timestamp) < EZ.getTime(timestamp))
		{													//rebuild dropdown list
			var mask = this.historyFolder + '/' + this.historyFilePrefix + '*';
			this.data.files = DWfile.listFolder(mask);			
			this.data.timestamp = timestamp;
		}
		var list = [];
		var selected = '';
		var filesList = this.filesList = [];	
		var certified = [];			
		
		var data = this.data;
		data.files.sort().reverse().forEach(function(filename)
		{
			filename.replace(/.*RESULTS.SAVED.(.*) @ (.*?)\.js/, function(id, date, time)
			{
				var dateTime = EZ.formatDate(date + ' ' + time.replace(/_/g, ':'));
				filesList.push(dateTime);					//12 hr timestamp
				
				if (dateTime == data.timestampRestored)
					selected = id;
				
				var text = (data.notes[id] ? EZ.DOT : EZ.SPACE)
						 + dateTime + ' '
						 + (data.titles[id] || '');
				list.push( [text, id] );
				if (text.includes('CERTIFIED'))
					certified.push(list.length-1)
			});
		});
		EZ.displayDropdown(this.list, list, selected);
		
		var lastDate = '';
		for (var opt=0; opt<this.list.options.length; opt++)
		{
			var date = EZ.formatDate(filesList[opt], 'date')
			if (lastDate == date) continue;
			if (lastDate)
				EZ.addClass(this.list.options[opt], 'nextDate');
			lastDate = date;
		}
		
		for (var opt=0; opt<this.list.options.length; opt++)
			if (certified.includes(opt))
				EZ.addClass(this.list.options[opt], 'certified');
				
		EZ.set('historyCount', this.list.options.length);
		if (this.list.selectedIndex != -1)
			this.select();
															//delete orphan notes / titles
		data.notes = EZ.clone(data.notes, Object.keys(data.notes || {}).extract(data.files));
		data.titles = EZ.clone(data.titles, Object.keys(data.titles || {}).extract(data.files));
															//not saved as safety
	}
	//============================================================================================
	if (!EZ.test.app.saveHistory)
	{
		EZ.test.app.saveHistory = new saveHistory();
		_init.call(EZ.test.app.saveHistory);
	}
	return EZ.test.app.saveHistory;
}
/*----------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
function debugSave(el, options)	//only options is "reload"
{
	if (el && EZ.message.wait('Saving', el, this)) 	//nogo if caller expects rtnValue
		return;									//...or results from this function
		
	var msg = [];
	var fn = {
		options: saveOptions,
		mruSelections: EZ.test.mruTests.save,
		'testdata cache': saveCache,
		'lastRun status': saveLastRun, 
		'test options': saveTestOptions
	}
	for (var name in fn)
	{
		try
		{
			var saveFn = fn[name];
			if (options != 'reload')
				msg.push( fn[name]('debug') || name + ' NOT saved');
				
			//else if (!EZ.test.app.fileChanged[saveFn.name])
			//	msg.push(name + ' not changed')
			else
				msg.push('saving... ' + name + '... ' + saveFn(options));
		}
		catch (e)
		{
			EZ.oops(e+'');
			msg.push(name + ' EXCEPTION:\n' + EZ.oops.stacktrace.html);
		}
	}
	
	msg.push('test results not saved');
	if (el)
		EZ.message(msg.join('\n\n'), {floatNode:el});
	return msg;
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
function saveDebugCopy(obj, name, state)
{
	state = state || 'quit';
	if (EZ.get('debugCopySavedData'))
	{	
		if (state != 'all' && state != EZ.test.app.state) return;
		
		name = g.projectName.concat('.LAST_', state.toUpperCase(), '.', name);
		var json = EZ.stringify(obj, '*');
		sessionStorage.setItem(name, json);
	}
}
/*----------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
function debugLogToggle(evt)
{
	var el = evt.srcElement;
	var tags = (el.name) ? [el] : EZ(['<input>'], el);
	
	tags.forEach(function(el)
	{	
		var type = el.value;
		var filter = el.name.match(/.*_(.*)/)[1];
		
		var key = 'log.filters.'.concat(type);
		var filterList = EZ.options.get(key);
		if (!filterList)
			return EZ.oops('unknown filter name: ' + type, el);
		
		var idx = filterList.indexOf(filter);
		if (el.checked && idx == -1)
			filterList.push(filter);
		else if (!el.checked && idx != -1)
			filterList.splice(idx,1);
	});
	if (EZ.debug() && evt.x)			//debug mode and not onLoadEvent
		updateEval(EZ.stringify(EZ.log.status()), 'log status');
}
/*----------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
function debugAction(action, className, filename)
{
	var count, file, msg = '', detail = '';
	var json, fieldValues;
	try
	{
		className = className.trimPlus('.');
		switch (action)
		{
			case 'backup': 	
			{
				fieldValues = EZ.field.getChangedValues(className);
				var sortedValues = [].sortPlus.call(fieldValues);
				json = EZ.stringify(sortedValues,null,4);
				detail = json;
			
				file = EZ.file(EZ.constant.configPath + EZ.test.config.testdataFolder + filename);
				count = Object.keys(fieldValues).length;
				msg = 'backup: FAILED: ' + count + ' options to:' + file.shortpathfilename;
			
				if (EZ.file.write(file, json))
					msg = msg.replace(/FAILED/, 'saved');
				
				break;
			}
			case 'restore': 	
			{
				file = EZ.file(EZ.constant.configPath + EZ.test.config.testdataFolder + filename);
				json = EZ.file.read(file);
				
				eval('fieldValues=' + json);
				count = Object.keys(fieldValues).length;
				var rtnValue = EZ.field.update(fieldValues);
				
				msg = 'updated ' + '.updated'.ov(rtnValue,[]).length + ' of ' + count + ' options '
					+ 'from: ' + file.shortpathfilename;
				detail = EZ.stringify(rtnValue,2);
				break;
			}
			default:	return EZ.oops('unknown action: ' + action)
	
		}	
		if (msg)
			EZ.message(msg, {floatNode:'debugActionMsg', detail:detail})
	}	
	catch (e)
	{
		EZ.techSupport(e, action)
	}
}

//_________________________________________________________________________________________________
e = function _____nosave_options_____() {}	//convenience for DW functions list
//_________________________________________________________________________________________________
/*----------------------------------------------------------------------------------
create obj clone -- initially used for reporting purposes only
function dataClone(obj)
{
	var clone = obj;
	var msg = '';
	try
	{
		//..............................................
		clone = obj.cloneObject();
		//..............................................
		msg = EZ.clone.message;
	}
	catch (e)
	{
		msg = [e + ''];
	}
	if (msg)
	{
		msg.unshift('cloning: ' + name);
		return {message: msg}
	}
	return clone;
}
----------------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------------
load nosave options -- onLoadEvent
----------------------------------------------------------------------------------*/
function nosaveLoad()
{
	//================================================================================
	var fieldValues = EZ.store.get('nosave$', {});
	//================================================================================
	var rtnValue = EZ.field.update(fieldValues);
	void(rtnValue);
}
/*----------------------------------------------------------------------------------
update nosave checkbox values -- saved immediately via EZ.store()
----------------------------------------------------------------------------------*/
function nosaveUpdate(el)
{
	var id = el.id;
	var checked = el.checked;
	if (EZ.hasClass(el, 'EZnosaveImage'))	//default EZ.debug() nosave btn
	{
		checked = EZ.debug.getSaveSuspended();
		id = 'debugNoSaveData';
		EZ(id, checked);
	}
	if (id == 'debugNoSaveData')
	{
		EZ.options.set('file.nosave', checked);
		EZ.set(['nosave'], checked);
		if (!checked)
		{
			if (EZ.get('useCache'))
			{
				EZ.set(EZ.el, false);
				EZ.addClass(EZ.el.parentElement, 'blink=15000');
			}
			if (EZ.get('lastrunSaveOpt') != 'button')
			{
				EZ.set(EZ.el, 'button');
				EZ.addClass(EZ.el.parentElement, 'blink=10000');
			}
		}
	}												//highlight if any no saved checked
	//EZ.addClass('nosaveImage', 'nosave', EZ.get(['nosave']).valueList.includes(true));
	
	var fieldValues = EZ.get(['nosave']);
	//========================================================================================
	EZ.store.set('nosave$', fieldValues.valueMap, true);	//session storage -- alwasys saved
	//========================================================================================
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/