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
/*--------------------------------------------------------------------------------------------------
EZ.test.save()

whats up...

ARGUMENTS:
	String		...
	options		(optional) Object containing one or more of the following properties:
				skipCount	number of function to remove from top of stack
	...			blah blah
			Array or delimited string (values separated by commas or spaces)


RETURNS:
	true if ... otherwise ...

REFEERENCE:
TODO:
--------------------------------------------------------------------------------------------------*/
EZ.test.save = (function _____EZsave_____()
{										//variables defined here avail to all internal and
	//var ___;							//prototype functions since the are all closures.
	var topContext;						//They are referenced WITHOUT this
	
	var data, options;
	var saveFiles = {};					//list of SAVE instances by constructor key				
	
	var defaultData = function(key)		//default data for each SAVE instance
	{										
		var data = {							
			key: key || '',
			name: '',
			value: 'NA',
			timestamp: 'NA',
			
			compareData: {							
				saved: 'NA',
				savedLast: 'NA',
				saved_timestamp: 'NA',
				savedLast_timestamp: 'NA' 
			},
			tags: {
				tooltipCode: '',
				noSaveEl: '',
			}
		}
		return data;
	}
	var defaultOptions = function()			//default data for each SAVE instance
	{
		return {
			sortKeysDepth: 0,
			tooltip: '', 					//was el ??
			noSaveId: '',
			name: '',						//optional long name (default is instance key)
		}
	}
	//__________________________________________________________________________________________________
	/**
	 *	constructor called by _init() to create static instance of -- subsequently for each managed file
	 */
	var ___ = function EZsave(key, create)
	{
		if (this instanceof arguments.callee)		//called as constructor...
		{
			if (EZ.test.save === undefined)			//called by _init()
				return this;									
													//setup new instance for specified key
			var args = [].slice.call(arguments)
			return topContext.setup.apply(topContext, [this].concat(args));	
			//var args = [].slice.call(arguments)
			//return topContext.setup.apply(topContext, [this].concat(args));	
		}
		
		//__________________________________________________________________________________________________
		/**
		 *	when not called as constructor
		 */
		var SAVE = (key instanceof Object) ? key : saveFiles[key]
		if (!SAVE)
			SAVE = (create === false) ? null : new EZsave(key)
		
		//__________________________________________________________________________________________________
		/**
		 *	set topContext instance specific closure variables to this instance values 
		 */
		data = SAVE._data;
		options = SAVE._options;
		return SAVE;
	}
	//__________________________________________________________________________________________________
	/**
	 *	setup properties for SAVE instance for specified by key
	 */
	EZsave.prototype.setup = function ___setup(SAVE, key, options)
	{
		Object.keys(topContext).forEach(function(key)
		{
			if (typeof(topContext[key]) == 'function')
				SAVE[key] = topContext[key].bind(topContext, key);
		});
		
		var data = SAVE._data = defaultData(key);
		options = SAVE._options = EZ.options.call(options);
		this.migrate(options, defaultOptions());
		
		data.tags.noSaveEl = options.noSaveId && EZ(options.noSaveId, null);
		var el = data.tags.tooltip = options.tooltip && EZ(options.tooltip, null);
		if (el)
		{
			data.name = el.getAttribute('data-name') || el.alt || el.id || key;
			data.tags.tooltipCode = EZ('code', EZ.getAncestor(el,'tooltip'));
		}
		//_log.call(SAVE, 'setup');
		//this.log(SAVE, 'setup');
		//==========================
		return saveFiles[key] = SAVE;
		//==========================
		/*
			if (!options.tags.tooltipCode)
				options.tags.tooltipCode = 
			//isChanged = (saved) ? _isChanged()
			//					: _isCreated()
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
					codeTag = EZ.createTag('code', tags);
				}
				return true;	
			}
		*/		
	}
	//__________________________________________________________________________________________________
	/**
	 *	call when data loaded or saved -- updated title with timestamp if specified
	 */
	EZsave.prototype.log = function ___log(SAVE, msg, timestamp)
	{
		if ((SAVE = ___(SAVE, false)) == null) return;
		
if (true) return;
		var key = this.key;
		
		var stack = EZ.stack(arguments.callee)
		var callerName = (stack.lines[2].formatStack()+'' || '');	//.trim();
		var msg = 'setup ' + key.pad(12) 
			+ ' [saved @ ' + EZ.format.dateTime(timestamp, 'today time') + '] ' 
			+ (callerName || ''); 
		EZ.log.call('saveData', msg)
	}
	//__________________________________________________________________________________________________
	/**
	 *	call when data loaded or saved -- updated title with timestamp if specified
	 */
	EZsave.prototype.setTitle = function ___setTitle(SAVE, timestamp)
	{
		if ((SAVE = ___(SAVE)) == null) return;
		
		var prefix = '';
		var msg = '';
		var why = data.why || data.noSaveWhy || '';
		prefix = data.name.pad(19);	//props.id.pad(25)
	
		if (data.isSaved)							//set by canSave() when canSave is true
		{												//saved occures when canSave() returns
			msg += ' file ';	//updated						//setTitle called after save
		//	props.files.saved = EZ.clone(props.value, key);		//EZ.test.cloneHow
			
			data.isPending = '';
			data.isChanged = false;
			//EZ.test.app.updated[key] = 'saved';
		}
		else if (data.isPending)						//isDataChanged() sets if called with why arg
			msg += ' pending save ' + why;				//not cleared until saved
		
		else if (data.isChanged)						//isDataChanged() sets if changed from saved
			msg += ' NOT saved ' + why;					//clears if data restored to saved values

	//	else if (EZ.test.app.state == 'safety')
	//		msg += ' up-to-date: ';
		
		if (!quit.reload)									//update html if not reloading
		{
			var el = data.tags.tooltip;
			EZ.addClass(el, 'pending', (data.isPending || msg) && !data.isSaved);
			if (data.isSaved)
				EZ.addClass(el, 'saved=5000');
			
			var text = '';
			if (data.isPending)
			{
				text = el.getAttribute('data-title-suffix') || '';
				text = text.replace(/(.*?) changes pending/, '') + ' changes pending';
			}
			else if (timestamp == -1)
				text = '';
			else if (timestamp !== undefined)
				text = ' saved @ ' + EZ.formatDate(timestamp, 'today time')
			
	text = msg + '' + text;
			text = (text || '').trim()
			if (text && el)
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
			EZ.log.call('saveData', state, time, msg + ' ' + (data.name || ''));
			msg = time.replace(/\s+/g, '') + ' ' + msg;
		}
		return msg;
	}
	//__________________________________________________________________________________________________
	/**
	 *	Only called if data changed 
	 */
	EZsave.prototype.canSave = function ___canSave(SAVE, timestamp)
	{
		if ((SAVE = ___(SAVE)) == null) return;
		
		var isSaved = false;
		var why = '';
		do
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
				else if (!data.noSaveEl || !data.noSaveEl.checked)
				{
					why = noSaveId + ' not checked';
					break;
				}
			}
			isSaved = true;
			data.timestamp = timestamp || data.timestamp;
			break;
		}
		while (false)
		
		data.isSaved = isSaved;
		data.noSaveWhy = why;
		return isSaved;
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZsave.prototype.setValue = function ___setValue(SAVE, value, timestamp)
	{
		if ((SAVE = ___(SAVE)) == null) return;
		void(___)
		
		data.value = value;
		data.value.timestamp = data.timestamp = timestamp || new Date();
		
		data.compareData.saved = EZ.clone(value);
		data.compareData.saved_timestamp = timestamp;
		
		SAVE.setTitle(timestamp);
	}
	//________________________________________________________________________________________
	/**
		Whenever changes are made, the changes show in the javascript console, trace log and 
		on page tooltip if enabled.
		
		DEPRICATE or refactor ??
			when reloading or leaving html page, quit() first sets EZ.test.app.state="safety"
			to save any changes to localStorage (as safety) in case browser crashes then sets 
			EZ.test.app.state="reload" to save any changes to the associated file(s).
			
			If all files are updated sucessfully, the localStorage safety copies are deleted.
	 */
	EZsave.prototype.updateValue = function ___updateValue(SAVE, value, timestamp)
	{	
		if ((SAVE = ___(SAVE)) == null) return;
												//if changed save and return true otherwise false
		var isChanged =	SAVE.isChanged(value, timestamp);
		if (!isChanged) 						//bail if no changes
			return;

		if (SAVE.canSave(timestamp)
		|| EZ.test.app.state == 'reload' || quit.reload)
		{
			timestamp = EZ.format.dateTime();
			data.value.timestamp = timestamp;
			
			SAVE.sortKeys(data.value, 4);
			//=======================================================================
			DWfile.write(data.url, EZ.stringify(data.value, '*'));
			//=======================================================================
		}
		return SAVE.setTitle(timestamp);
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZsave.prototype.isValueChanged = function ___isValueChanged(SAVE, value, timestamp)
	{
		if ((SAVE = ___(SAVE)) == null) return;
		var key = SAVE.key;
		
		var eqOpts = {
			showDiff:5, 
			//console: true,
			//log: true,
			name: [key, 'CHANGES ...'],
			ignore: 'objectType'
		};
		data.compareData.equalsRtnValue = new window.EZ.equals(data.value, value, eqOpts);
		var isChanged = data.isChanged = !data.compareData.equalsRtnValue.isOK();
		if (!isChanged)
			return false;	

		var isSaved = SAVE.updateValue(value);
		var codeTag = data.tags.tooltipCode;	
		if (codeTag && EZ.log.isActive('saveData', 'page'))
		{		
			timestamp = timestamp || data.timestamp || 'NA';
			if (isSaved)
			{
				data.compareData.savedLast = data.compareData.saved;
				data.compareData.savedLast_timestamp = data.compareData.saved_timestamp;
			}
			data.compareData.saved = EZ.clone(data.value);
			data.compareData.saved_timestamp = EZ.format.dateTime(timestamp, 'today time date');
			
			//[].sortPlus.call(data.saved);
			/*
			var formattedLog = window.EZ.isEqual.formattedLog;
			if (formattedLog && props.code)
			{
				var log = ' [was] ... [now]:\n\t'
						+ formattedLog.join('\n\t');
				EZ.log.call('saveData',log);
				
			}
			*/
			var formattedLog = data.compareData.equalsRtnValue.getValue('formattedLog');
			
			var node = __createCompareNode();
			codeTag.innerHTML = node.innerHTML;
			
			data.isPending = '';
		}
		//======================
		return isChanged;
		//======================
		//__________________________________________________________________________________________________
		/**
		 *	
	
	[Object] mru (saved 12-11-2016) --> [Object] CHANGES @ 12:13 pm 
	[Object].fnLists.Shared/EZ/js.EZbase_min.js.linenos -- diff keys shown below:
	  "EZ.clone":[-]                ... "EZ.clone":[+]
	
	
	 .fnLists.Shared/EZ/js.EZbase_min.js.linenos [Object] !== [Object]
		 */
		function __createCompareNode()
		{
			
			var tags = {
				nodes: {
					em: {
						nodes: {
							input: {
								type: "image",
								title: 'full compare via winmerge',
								src: "../images/compare.png",
								//onclick: 'window.EZ.compare(' + was + ',' + now + ')'
								onclick: "window.EZ.test.save.compare('" + key + "')"
							},
							text: name + ' changes [was] ... [now]'
						}
					},
					div: {
						class: 'pre',
						nodes: {
							text: formattedLog.join('\n') + '\n'
						}
					}
				}
			}
			return EZ.createTag('code', tags);
		}
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZsave.prototype.compare = function ___compare(props, el)
	{
		if ((props = ___(props)) == null) return;
		var key = props.key;
		

		var data = this.getCompareData(key);
		var compareOpts = {
			waitEl: el,
			formatter: 'EZtoString',
			formatOpts: g.displayOptions,
			dl: data.key + ' @ ' + data.was_timestamp,
			dr: data.key + ' @ ' + data.was_timestamp
		}
		EZ.compare(data.was, data.now, compareOpts);		
	}
	//______________________________________________________________________________________________
	/**
	 *	sync obj top level properties with defaultValues -- missing added
	 *	deletes any not in defaultValues (depricated)
	 *	
	 */
	EZsave.prototype.migrate = function ___migrate(obj, defaultValues)
	{
		Object.keys(defaultValues).forEach(function(key)	//add missing properties
		{
			obj[key] = obj[key] ||  defaultValues[key];
		});
		var deleteKeys = Object.keys(obj).remove( Object.keys(defaultValues) );
		deleteKeys.forEach(function(key)		
		{
			delete obj[key];								//delete depricated properties
		});
	}
	//______________________________________________________________________________________________
	/**
	 *	TODO:	
	 *		sortKeysDepth
	 *		currently ONE-OFF for mru
	**/
	EZsave.prototype.sortKeys = function ___sortKeys(mru)
	{
		[].sortPlus.call(mru);				//sort top 3 levels - debug convience
		Object.keys(mru).forEach(function(key) 
		{ 
			if (mru[key] instanceof Array && !(mru[key] instanceof Object)) return;
			[].sortPlus.call(mru[key]) 
			var o = mru[key];
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
	//__________________________________________________________________________________________________
	/**
	 *	creates new instance but copies all properties and prototypes to global instance (pseudo static)
	 *	 EZ.save() is valid constructor -or- can call defaultFunction with "this" context.
	 */
	var _init = function _init()
	{
		var fn = new EZsave();						//create new instance of EZ.test.save
		___ = EZsave; 
	//	options = defaultOptions();			 		//set options to defaultValues and expose as
	//	fn.options = fn._options = options;			//...EZ.test.save.options and ... _options
		
		for (var key in fn)
			___[key] = fn[key];
													//exposes topContext variables as EZ.test.save...
		___._saveFiles = saveFiles;
		/*
		EZ.event.add(window, 'onload', function()	//initialization requiring DOM 
		{											
		});	
		*/
		return EZsave;
	}
	//==================================================================================================
	topContext = _init();
	return ___ = topContext;
})();


//_________________________________________________________________________________________________
e = function _____EZtest_mruTests_____() {}	//convenience for DW functions list
//_________________________________________________________________________________________________

EZ.test.mruTests = (function mruTests()
{											//variables defined here avail to all internal and
	var topContext, options;						//prototype functions since the are all closures.
									
	var SAVE;								//shortcut for EZ.test.save
	var folderList, fileList, fnList;		//initialized by EZ.mruTests.setup()
	var folder, filename, functionName;
	var message = '';
	
	var _optionsDefault = function() 
	{
		return {
			mruFile: null,
			state: 'init',
			save: {
				tooltip: 'mruReset',
				key: 'mru',
				noSaveId: 'debugNoSave_mruTests'
			},
		}
	}
	var mru = {};					//saved data	
	var _mruDefault = function() 
	{
		return {
			_folder: '',
			_filename: '',
			_functionName: '',
			_selectedList:{},			//last selected file or fn for each folder or folder:filename
										//...folder used for last selected folder
			fileInfo: {},				//for each folder: most recently selected files
			fnLists: {},				//for each filepath: function dropdown (value/text/selectrf) 
										//					 linenos, recent, timestamp, url
			timestamp: 0,
			
			recentTestList: [],			//most recent test functions
			recentTestListLimit: 10,	//...not deleted with above on delete...
			keep: ['recentTestList', 'recentTestListLimit']
		}
	}
	var dirInfoDefault = function() 	
	{									//folders properties for each folder
		return {	
			filenameList: [],
			recent: [],
			url: ''
		}
	}
	var fileInfoDefault = function() 	
	{									//folders properties for each folder
		return {	
			function_counts: 0,
			timestamp_functionList: 0
		}
	}
	var fnListsDefaultItem = function() 
	{									//fnList properties for each file
		return {
			functionList: [],
			recent:	[],
			test_counts: {},
			timestamp_functionList: 0
		}
	}
	//__________________________________________________________________________________________________
	/**
	 *	constructor for _init() -- subsequently setup for managed file
	 */
	function EZmruTests()
	{
		if (this instanceof arguments.callee)		//called as constructor
			return this;
		
		//__________________________________________________________________________________________________
		/**
		 *	load MRUtests.js and initialize global variables requiring document DOM
		 */
		EZ.timer('screen update',true);
		
		folderList = EZ('folderList');
		fileList = EZ('fileList');
		fnList = EZ('functionList');
		
		options.mruFile = EZ.filePlus(EZ.test.config.testdataFolder, 'EZtestAssistant.MRUtests.js'),
		options.filePrompt = fileList.options[0].text,
		options.functionPrompt = fnList.options[0].text
		
		//return topContext.load.apply(topContext, [].slice.call(arguments));	
		return setTimeout(function() { topContext.load.call(topContext) }, 0);
	}
	//______________________________________________________________________________________________
	/**
	 *
	**/
	EZmruTests.prototype.load = function ___load()
	{
		//============================================================================
		var json = this._json = DWfile.read(options.mruFile.url) || '{}';
		var saved = eval('saved=' + json);				
		//============================================================================
		this._mru = mru = {};								//expose as debug convenience
		var mruDefault = _mruDefault();
		for (var key in mruDefault)	
			if (key != 'keep')							
				mru[key] = saved[key] || mruDefault[key];
		
debugger;		
		SAVE = new EZ.test.save(options.save.key, options.save);
		SAVE.setValue(saved, mru.timestamp);
		
		_displayRecentRunTest();
		setTimeout(function() {topContext.folderSelected.call(topContext)}, 0);
	}
	//______________________________________________________________________________________________
	/**
	 *	dispatcher
	**/
	var callback = function __callback(url, isExternalFile)
	{
		if (message)					
		{
			setTimeout(function() { ready(message) }, 0);
			return message = '';
		}
		
		//debugger;		

		if (!filename || filename == '*')
			return setTimeout(function() { topContext.folderSelected.call(topContext) }, 0);
	
		if (!functionName || functionName == '*')									
			return setTimeout(function() { topContext.fileSelected.call(topContext) }, 0);
	
		if (url === undefined)
			return setTimeout(function() { topContext.functionSelected.call(topContext) }, 0);
		
		return setTimeout(function() { setupTestScript(functionName, url, isExternalFile) }, 0);
	}
	//======================================================================================[1]
	/**
	 *	populate or update fileList dropdown -- initially called by setup subsequently
	 *	called BEFORE filename selected from folderSelected() when folder selected.
	**/
	EZmruTests.prototype.folderSelected = function ___folderSelected()
	{		
		folder = EZ.get(folderList);
		var folderMRU = _getMRU();
		if (options.state == 'init')
		{
			options.state = 'folder';
			if (!folder)
				folder = folderMRU;
			if (folder)
				EZ.set(folderList, folder);
		}
		_setMRU(folder);	
		//...........................................................
		if (!folder || folder != folderMRU)
		{				
			filename = ''
			_dimList(fileList);
			_dimList(fnList);
		}
		//...........................................................		
		do
		{	
			if (!folder)
			{
				folderList.selectedIndex = -1;
				message = 'select folder';
				break;
			}
			var filenameMRU = _getMRU(folder);		
			
			var folderInfo = _getFileInfo(folder);
			if (filename == '*')					
			{
				folderInfo.recent = [];				
				folderInfo.filenameList.sortPlus()		//(_sortOptions);
				filename = filenameMRU;					//restore filename
				message = 'recent file selections cleared';
				_dimList(fileList);
			}
			if (filename != filenameMRU)
				_dimList(fnList);
			
			if (!filename && filenameMRU)
				filename = filenameMRU;		
			
			if (fileList.options.length <= _getOffset(fileList))
			{
				var items = folderInfo.filenameList;
				if (true || !items)
				{											//rebuild filename list
					items = DWfile.listFolder(EZ.constant.configPath + folder + '/*.js');	
					if (true || EZ.get('excludeList'))				
						items = items.remove(/( Copy|\.safe|\.work|\.after*|\.before*|\.deleteme)/);
					items.sortPlus();						//case-insensitive sort
				}
		
				var itemList = items.slice();
				folderInfo.recent = folderInfo.recent.remove();	
				var listOpts = {sep:folderInfo.recent.length, noItems:'no files in folder'};
				itemList = folderInfo.recent.concat(itemList.remove(folderInfo.recent));
		
				_displayDropdown(fileList, itemList, filename, listOpts);
				folderInfo.filenameList = itemList;
			}
		//	else if (filename)
		//		EZ.set(fileList, filename)
				
			filename = EZ.get(fileList);				//blank if deleted since last selected
			if (filename)								//...defer updating selected if blank
				_setMRU(folder, filename);
			else
			{
				fileList.selectedIndex = -1;
				message = 'select file'	;
			}
		}
		while (false)
		callback.call(this);
	}
	//======================================================================================[2]
	/**
	 *	populate or update functions dropdown -- called from fileSelected() when file clicked
	 *	or auto selected when most recently selected file for current folder is known.
	 *	
	 *	moves selected filename to top, updates recentList then populates functionList and
	 *	auto selects function most recently selected for filename.
	**/
	EZmruTests.prototype.fileSelected = function ___fileSelected()	
	{													
		filename = EZ.get(fileList);
		do
		{
			if (filename.startsWith('-') || fileList.options.length === 0) 	
			{
				message = 'no files found in folder';
				fnList.selectedIndex = -1;
				filename = '';
				break;
			}
			if (!filename || filename == '*')		//bail if clear recent clicked
				break;								
													  //--------------------------------------\\
													 //----- update files dropdown / data -----\\
													//------------------------------------------\\
			var folderInfo = _getFileInfo(folder);	//get recent file list for selected folder
			var updatedListItems = _updateRecent(fileList, filename, folderInfo, 'filenameList');
			if (updatedListItems === false)
				return setTimeout(function() { topContext.fileSelected.call(topContext, true) }, 250);
			
			if (updatedListItems || _isDisplay(fileList, folderInfo.recent))
			{										
				var listOpts = {sep: folderInfo.recent.length, noItem:'no files in folder'};
				_displayDropdown(fileList, folderInfo.filenameList, filename, listOpts)
			}										//save updated fileList select options
			folderInfo.filenameList = _getSelectOptions(fileList);
			_setMRU(folder, filename);
													  //---------------------------------------------\\
													 //----- always re-create function dropdown  -----\\
													//-------------------------------------------------\\
			var functionNameMRU = _getMRU(folder, filename);	
			var fnInfo = _getFunctionInfo(folder, filename); 
			if (functionName == '*')
			{										//clear recent -- retains current selection
				fnInfo.recent = [];				
				fnInfo.functionList.sort(_sortOptions);
				functionName = functionNameMRU;		//restore filename
				message = 'recent function selections cleared';
				_dimList(fnList);
			}
			else if (functionName != functionNameMRU)
				_dimList(fnList);
													//must match folder / filename -- NEVER
			functionName = functionNameMRU;			//use selected function on file change
			
			var listOpts = {sep: fnInfo.recent.length, noItem:'no test Scripts found in file'};
			
			if (fnInfo.functionList.length === 0 && fnInfo.test_counts[functionName] !== undefined)
			{										//build functionList, then _displayDropdown
				return _buildFunctionList.call(this, fnInfo, listOpts);	
			}
			else									//display existing functionList						
			{										//...returns undefined if callback used
				_displayDropdown(fnList, fnInfo.functionList, functionName, {sep:fnInfo.recent.length})
				if (functionName)								
					_setMRU(folder, filename, functionName);
				else
				{
					fnList.selectedIndex = -1;	
					message = 'select function'	;
				}
			}
		}
		while (false)
		callback.call(this);
	}
	//======================================================================================[4]
	/**
	 *	called after function selected from functionSelected()
	 *	
	 *	update selectedList 
	 *	update recent (mru data and dropdown)
	 *	update lineno
	**/
	EZmruTests.prototype.functionSelected = function ___functionSelected()
	{													
		functionName = EZ.get(fnList);
		var url, isExternalFile;		
		do
		{
			if (functionName.startsWith('-') || fnList.options.length === 0) 	
			{
				message = 'no test scripts found in file';
				fnList.selectedIndex = -1;
				functionName = '';
				break;
			}
			
			if (!functionName || functionName == '*')		//bail if clear recent clicked
				break;										//...let fileSelected() handle
				
			var fnInfo = _getFunctionInfo(folder, filename); 
															//updates items amd recent if needed
			var updatedListItems = _updateRecent(fnList, functionName, fnInfo, 'functionList');
			if (updatedListItems === false)					//list reset req'd
				return setTimeout(function() { topContext.functionSelected.call(topContext, true) }, 250);
			
			if (updatedListItems || _isDisplay(fnList, fnInfo.recent))
			{
				var listOpts = {sep: fnInfo.recent.length, noItem:'no test Scripts found in file'};
				_displayDropdown(fnList, fnInfo.functionList, functionName, listOpts)
			}
			fnInfo.filenameList = _getSelectOptions(fnList);
			_setMRU(folder, filename, functionName);
			
			var folderInfo = _getDirInfo(folder);
			folderInfo.function_counts = fnInfo.functionList.length;
			isExternalFile = (fnList.options[fnList.selectedIndex].text.substr(0,1) == EZ.DOT);
			url = folderInfo.url + filename;		
		}
		while (false)
		
		callback.call(this, url, isExternalFile);
	}
	//========================================================================================[5]
	/**
	 *	called after test calls found from setupTestScriptFinish()
		var test_counts = {};				
		if (!items.length)
			items.push('--no test scripts--');
	**/
	EZmruTests.prototype.setTestCallCount = function ___setTestCallCount(count)
	{													
		var list = fnList;
		if (!count || !list.options.length)
			return;
		
		var offset = list.options[0].value.startsWith('*') ? 1 : 0;		

		var fnInfo = _getFunctionInfo(folder, filename); 
		var functionList = fnInfo.functionList;
		if (!functionList) return;
		
		fnInfo.test_counts = fnInfo.test_counts || {};
		fnInfo.test_counts[name] = count
		
		functionList.every(function(fn, idx)
		{
			if (fn[1] != functionName) return true;
			fn[0] = fn[0].replace(/\(.*\)/, count.wrap('()'));
			list.options[idx+offset].text = fn[0];
		});
		this.save();
	}
	//______________________________________________________________________________________________
	/**
	 *
	**/
	EZmruTests.prototype.isSame = function ___isSame(us, legacy)
	{
		var eqOpts = {
			showDiff: 10,
			console: true,
			exclude: 'timestamp, items, recentTestList, recentTestListLimit'
		}
		var isEqual = EZ.equals(us, legacy, eqOpts);
		if (!isEqual)
			void(0);
		return us;
	}
	//______________________________________________________________________________________________
	/**
	 *
	 */
	EZmruTests.prototype.refreshList = function ___refreshList(el)
	{
		var action = (el instanceof Element) ? el.value : 'script';
		if (action == 'script')
		{
			var fnInfo = _getFunctionInfo();
			fnInfo.functionList = [];
			_dimList(fnList);
			_buildFunctionList.call(this, fnInfo);
		}
	}
	//______________________________________________________________________________________________
	/**
	 *	called from delete icon (debug mode)
	**/
	EZmruTests.prototype.remove = function ___remove()
	{
		//==============================================================
		DWfile.remove(options.mruFile.url);
		//==============================================================
		var mruDefault = _mruDefault();		
		for (var key in mru) 						//preserve mru global
			if (!mruDefault.keep.includes(key)) delete mru[key]
		for (var key in mruDefault)					//preserve mru global						
			if (key != 'keep') mru[key] = mruDefault[key];
		
		SAVE.setTitle(options.save.key, -1);
		
		folderList.selectedIndex = -1;
		_dimList(fileList);
		_dimList(fnList);
		folder = filename = functionName = '';
				
		this.load.call(this);
	}
	//______________________________________________________________________________________________
	/**
	 *	save MRUtests.js
	**/
	EZmruTests.prototype.save = function ___save()
	{
		var timestamp = mru.timestamp || 0;
		//SAVE.save(options.save.key, mru, timestamp);
		
		
		if (SAVE.isDataChanged(options.save.key, mru /*, why */))		
		{
			timestamp = EZ.format.dateTime();
			if (SAVE.canSave(options.save.key, timestamp))
			{
				SAVE.sortKeys(mru, 4);
				mru.timestamp = timestamp;
				//=======================================================================
				DWfile.write(options.mruFile.url, EZ.stringify(mru, '*'));
				//=======================================================================
			}
		}
		return SAVE.setTitle(options.save.key, timestamp);
	}
	//______________________________________________________________________________________________
	/**
	 *	updates most recently run test from any folder / file
	 *	displayed by mruTests constructor
	**/
	EZmruTests.prototype.updateTestList = function ___updateTestList()
	{
		var testName = functionName + ' \t ' + filename + ' \t ' + folder;
		var regex = RegExp(testName + '.*@');
		mru.recentTestList = (mru.recentTestList || []).remove(regex);
		mru.recentTestList.unshift(testName + ' \t ' + EZ.format.date());
		//var limit = EZ.toInt(EZ.get('recentTestListLimit'), 20);
		mru.recentTestList.length = Math.min(5, mru.recentTestList.length);
	}
	//_________________________________________________________________________________________________
	/**
	 *	called by init
	**/
	function _displayRecentRunTest()
	{
																//display recent test functions
		var title = ['Function    \t Filename    \t Folder    \t '];
		var lines = title.concat(mru.recentTestList).format();
		EZ.set('recentTestListCount', (lines.length-1).wrap('[]'));
		lines[0] = lines[0].wrap('<b class="pre">');
		EZ('recentTestList').innerHTML = lines.join('\n');
	}

	//_________________________________________________________________________________________________
	e = function _____internal_functions_____() {}
	//_________________________________________________________________________________________________
	/**
	 *	
	**/
	function _getMRU(folder, filename)
	{
		EZ.test.app.state = 'mru';									//prevent until until ready()
		var selected = mru._selectedList || {};
		switch (arguments.length)
		{
			case 0: return selected[''] || '';
			case 1: return selected[folder] || '';
			case 2: return selected[ (folder || '').concat(':', filename) ] || '';
		}
	}
	//______________________________________________________________________________________________
	/**
	 *	
	**/
	function _setMRU(folder, filename, functionName)
	{
		if (folder && mru._folder != folder)
			resetTests();
		else if (filename && mru._filename != filename)
			resetTests();
		else if (functionName && mru._functionName != functionName)
			resetTests();
		
		switch (arguments.length)
		{
			case 1: return mru._selectedList[''] = mru._folder = folder;
			case 2: return mru._selectedList[folder] = mru._filename = filename
			case 3: return mru._selectedList[folder.concat(':', filename)] = mru._functionName = functionName;
		}
	}
	//______________________________________________________________________________________________
	/**
	 *	return folder properties from mru.fileInfo[folder] -- create if necessary
	 */
	function _getDirInfo(folder) 
	{
		if (!folder)
			return dirInfoDefault();
		return _getFileInfo(folder);
	}
	/**
	 *	return file properties  from mru.fileInfo[folder][filename] -- create if necessary
	 */
	function _getFileInfo(folder, filename) 
	{
		if (!folder && !filename)
			void(0)
		
		var folderItem = mru.fileInfo[folder] = mru.fileInfo[folder] || {};
		folderItem.url = folderItem.url || EZ.filePlus(folder).url + '/';
		
		SAVE.migrate(folderItem, dirInfoDefault());
		
		if (!filename)
			return folderItem;
				
		var fileItem = folderItem[filename] = folderItem[filename] || {};
		SAVE.migrate(fileItem, fileInfoDefault());
		return fileItem;
	}
	//______________________________________________________________________________________________
	/**
	 *	return mru.fnLists item for folder / filename -- create if necessary
	 */
	function _getFunctionInfo(folder, filename) 
	{
		if (arguments.length === 0 || !folder || !filename)
		{
			folder = mru._folder, 
			filename = mru._filename
		}
														//create lists if NA 
		var fnInfo = mru.fnLists[folder] = mru.fnLists[folder] || {};
		fnInfo = fnInfo[filename] = fnInfo[filename] || {};
		
		SAVE.migrate(fnInfo, fnListsDefaultItem());
		return fnInfo;		
	}
	//______________________________________________________________________________________________
	/**
	 *	
	 */
	function _getOffset(list)
	{
		if (list.options.length === 0)
			EZ.field(list, true).resetInitialAttribute('options');
		var offset = (list.options.length === 0) ? 0
				   : list.options[0].value.startsWith('*') ? 1 : 0;
		return offset;		
	}
	//______________________________________________________________________________________________
	/**
	 *	returns copt of select options with class 'listOptionsSeparator' removed
	**/
	function _getSelectOptions(list)
	{
		var offset = _getOffset(list);		
		var opts = EZ.selectOption.getAll(list).slice(offset);
		opts.forEach(function(item)
		{
			if (item[3])
				item[3] = item[3].replace(/listOptionsSeparator/, '').trim()
		});
		return opts;
	}
	//______________________________________________________________________________________________
	/**
	 *
	**/
	function _isDisplay(list, recentList)
	{
		var offset = (recentList && recentList.length > 0) ? 1 : 0;
		return list.options.length <= offset || offset != _getOffset(list);
	}
	//______________________________________________________________________________________________
	/**
	 *
	 */
	function _buildFunctionList(fnInfo)
	{
		EZ.addClass(fnList, 'dimMore');
		if (EZ.message.wait('building list', 'functionListWait', this)) 
			return;							
		
		var filePath = folder.replace(/.*\/(.*)/, '$1') + '/' + filename;
		var scriptsFolder = EZ.constant.configPath + EZ.test.config.testdataFolder + filePath;
		var scriptsList = DWfile.listFolder(scriptsFolder + '/*.SCRIPT.js');
		
		var items = [];								
		scriptsList.sort().forEach(function(name)	//find external test scripts
		{												
			var fileSize = 1;						//TODO: if not empty file
			if (fileSize)
				items.push(name.clip(3));			//drop: ".js" file ext
		});
		
		var scriptFile = EZ.filePlus(folder + '/' + filename);
		var script = DWfile.read(scriptFile.url);
		//=============================================================================
		var functionList = EZ.getFunctionList(script);	
		//=============================================================================		
		var linenos = {};
		functionList.forEach(function(fn)			//find embedded test scripts		
		{												
			if (fn.name.right(5).toLowerCase() == '.test')
			{
				var name = fn.name.clip(5);			//drop: ".test" from fn name
				items.push(name);
				linenos[name] = fn.lineno;		//save line# for below
			}
		});
		
		items.sort(_sortOptions);
		fnInfo.recent = fnInfo.recent.extract(items);
		var pruned = items.remove(fnInfo.recent)
		var merged = fnInfo.recent.concat(pruned);
		
		items = [];
		var callCountsUpdate = {};
		merged.forEach(function(value)				//expand each name to Array of the form:
		{											//	 [text, value, className]
			var text = EZ.SPACE + value;
			var className = '';
			if (!linenos[value])					//external SCRIPT.js file
			{
				//value = value.clip(7);
				text = EZ.DOT + value;				//prepend DOT to value
				className = 'external';				//...and set className
			}
			if (text.substr(1,1) != '-')			//append (#) to text where
			{										//	# is test_counts if known
				var count = '.test_counts.value'.ov(fnInfo);
				if (count)
					callCountsUpdate[value] = count;
				text += '(' + (count || '') + ')';
			}
			else
				value = '--';
		//	items.push( [text, value] );
			items.push( [text, value, '', className] );
		});
		fnInfo.functionList = items;
		fnInfo.test_counts = callCountsUpdate;
													//save script file and functionList timestamp
		var fnItem = _getFunctionInfo(folder,filename);		
		fnInfo.timestamp = fnItem.timestamp_functionList = EZ.format.dateTime();
		
		_displayDropdown(fnList, fnInfo.functionList, functionName, {sep:fnInfo.recent.length})
		
		functionName = EZ.get(fnList);
		if (functionName)								//...defer updating selected if blank
			_setMRU(folder, filename, functionName);
		else
		{
			fnList.selectedIndex = -1;	
			message = 'select function'	;
		}
		
		callback.call(this);
	}
	//______________________________________________________________________________________________
	/**
	 *	click to refresh list -- built 12-17-2016
	 *	click to refresh list -- built @ 6:05 am
	**/
	function _dimList(list)
	{
		EZ.clearList(list);
	}
	//______________________________________________________________________________________________
	/**
	 *	click to refresh list -- built 12-17-2016
	 *	click to refresh list -- built @ 6:05 am
	**/
	function _displayDropdown(list, items, selected, options)
	{
		options = options || {};
		if (!options.sep)
		{
			EZ.clearList(list);
			EZ.removeClass(list, 'highlight', items.length);
			if (items.length === 0)
				items[0] = ['-', options.noItems || 'no items', false, 'noitems'];
			EZ.displayDropdown(list, items, selected, {size:15, noclear:true});
		}
		else
		{
			list.EZfield.resetInitialAttribute('options');
			EZ.addClass(list, ['highlight', 'recent']);
			EZ.displayDropdown(list, items, selected, {size:15, noclear:true, sep:options.sep+1});
		}
		EZ.removeClass(list, ['invisible', 'dimMore']);
		
		if (list == fnList)
		{
			var isExternal = EZ.hasClass(EZ(['option'], list), 'external');
			EZ.removeClass('externalScript', 'hidden', isExternal)
		}
		
		if (options.sep)
			list.options[0].text = EZ.s(list.options[0].text, options.sep) + ' on top';
		
		if (options.timestamp)
		{
			var text = EZ.format.dateTime(options.timestamp, 'today time date -seconds').trim();
			text = (text.includes('-')) ? text : ' @ ' + text;
			
			EZ(list.id+'Refresh').setAttribute('data-title-suffix', text);
			EZ.addClass(EZ.el, 'show=5000', options.refresh);
			/*
			text = EZ.format.dateTime(options.timestamp_js, 'today time date -seconds').trim();
			text = (text.includes('-')) ? text : ' @ ' + text;
			text = options.filename + ' ... ' + text;
			var opt = EZ.selectOptionAdd(list, text, '*');
			EZ.addClass(opt, 'highlight');
			*/
		}
	}
	//______________________________________________________________________________________________
	/**
	 *
	 */
	function _updateRecent(list, selectedItem, data, key)
	{
		if (!selectedItem) return;
		var offset = _getOffset(list);
		var selectedIndex = list.selectedIndex;
		
		if (list.selectedIndex !== offset)			//if selected item not already on top
		{
			//--------------------------------------------------------
			EZ.selectOption.move(list, list.selectedIndex, offset);
			//--------------------------------------------------------
			list.size = Math.min(15, list.options.length);
		}
		
		var recentLimit = EZ.toInt(list.getAttribute('data-recent'), 5);
		if (!data) return;
		
		var recentList = data.recent;
		var idx = recentList.indexOf(selectedItem);		//update mru function list
		if (idx != -1)									
			recentList.splice(idx,1);					//remove from current position
		recentList.unshift(selectedItem);				//add to top
		
		if (recentList.length > recentLimit)			//if over-limit, re-display
		{
			recentList.length = recentLimit;
			var items = _getSelectOptions(list);		//EZ.selectOption.getAll(list) wrapper
			items.sortSlice(offset + recentLimit, _sortOptions);
			data[key] = items;
			return true;
		}
		else if (selectedIndex >= 12)					//rebuild list if scrolled so top
		{												//...pseudo options displays
			data[key] = _getSelectOptions(list);
			EZ.clearList(list)	
			EZ.selectOptionAdd(list, selectedItem, selectedItem, true);
			return false;		
		}
		else if (offset && list.selectedIndex > 12)		//add separator class if any items
		{												//... after recent items
			var dashOpt = list.EZ('listOptionsSeparator', null);
			if (dashOpt)
				EZ.removeClass(dashOpt, 'listOptionsSeparator');
			
			var dashIdx = recentList.length + offset;
			if (dashIdx < list.options.length)
				EZ.addClass(list.options[dashIdx], 'listOptionsSeparator');	
															//update text of top pseudo option
			var msg = (list == fileList) ? options.filePrompt : options.functionPrompt;
			list.options[0].text = EZ.s(msg, recentList.length) + ' on top';
			//click to clear recent [5] files on top
		}
	}
	//______________________________________________________________________________________________
	/**
	 *
	 */
	function _sortOptions(a,b)
	{
		a = a[0].toLowerCase().trimPlus(EZ.dot).trim();
		b = b[0].toLowerCase().trimPlus(EZ.dot).trim();
		return (a < b) ? -1
			 : (a > b) ? 1
			 : 0;
	}
	//__________________________________________________________________________________________________
	/**
	 *	creates new instance but copies all properties and prototypes to global instance (pseudo static)
	 *	 EZ.save() is valid constructor -or- can call defaultFunction with "this" context.
	 */
	var _init = function _init()
	{
		var fn = new EZmruTests();					//create new instance
		
		options = _optionsDefault();		 		//set options to defaultValues
		fn.options = fn._options = options;			//exposes options created above
		
		for (var key in fn)
			EZmruTests[key] = fn[key];
			
		/*
		EZ.event.add(window, 'onload', function()	//initialization done after DOM loaded
		{											
			//console.log(EZsave.toString())
			//backupFilename: localStorage.getItem('EZ.save.backupFilename') || 'EZsave.backup.js'
		});	
		*/
		return EZmruTests;
	}
	//==================================================================================================
	return topContext = _init();
})();

