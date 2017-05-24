/*--------------------------------------------------------------------------------------------------
Dreamweaver LINT global references and definitions  not used here
--------------------------------------------------------------------------------------------------*/
/*global 
EZ, DWfile, 
formatObject, getExpected,

e:true, g:true, dw:true, f:true
*/
var e;			//global var for try/catch
(function() {[	//global variables and functions defined but not used

e, f, g, dw, DWfile ]});
//__________________________________________________________________________________________________

/*--------------------------------------------------------------------------------------------------
create testrun Object
--------------------------------------------------------------------------------------------------*/
EZ.test.testrun = function EZtest_testrun(vData)	
{
	var testrun = this;
	var testno, key = '';
	if (vData instanceof Object)
	{
		if (!vData.testno) 
			return EZ.oops('invalid argument', vData) || this;

		testno = vData.testno;
		key = vData.key || '';
		if (vData.key !== undefined && vData.lastIdx != -1)
			testrun.vData = vData;
	}
	else if (!isNaN(vData))
		testno = Number(vData);
	else	
		return null;
		
	testrun.testno = testno;
	testrun.testIdx = testno - 1;
	testrun.key = key;
	var testKey = testrun.testKey = testrun._testKey = (testno + key);
	
	EZ.test.data.testrun[testrun.testKey] = testrun;
	if (key && EZ.test.data.testrun instanceof Array)
	{											//convert to Object -- debugger convenience  
		var obj = {};							//...chrome does not show named Array properties
		Object.keys(EZ.test.data.testrun).forEach(function(key)	
		{
			obj[key] = EZ.test.data.testrun[key];
		});
		EZ.test.data.testrun = EZ.test.data.variants._testrun = obj;
	}
	
	testrun.ok1st = [];							
												//add tags for test display
	var newTags = EZ.clone(g.resultsTags);		//use EZ.clone() to keep EZ binds
	testrun.tags = EZ.append(g.resultsRoot, newTags);
	
	EZ('btn').className = testKey;
	EZ('compare').className = testKey;
	
	var name = testrun.tags.EZ('a').name = 'test' + testKey;
	testrun.tags[1].id = name;
	
	var marker = EZ.test.data.options.markers.indexOf(testKey) != -1;
	EZ.addClass(testrun.tags, 'marker', marker);
	
	if (!vData || vData.idx === 0)
	{
		if (EZ.test.data.options.exfn)
			EZ.test.data.callbacks.exfn.push(testno);
		if (EZ.test.data.options.notefn)
			EZ.test.data.callbacks.notefn.push(testno);
	}

	//______________________________________________________________________________________________
	/**
	 *	return arg_idx, ctx, results or <0 if none of these
	 *		var idx = this.getIndex(key);
	 */
	this.getIndex = function(key, names)
	{
		names = names || this.argNames;
		return (/(results|ctx)/.test(key)) ? key : EZ.getIndex(key, names);
	}
	this.getActual = function __getActual()
	{
		var vidx = (this.vData) ? this.vData.idx : 0;
		var actual = testrun.actual;
		var actualSafe = testrun.safe.actual;
		if (vidx)
		{
			testrun.variants = testrun.variants || {};
			actual = testrun.variants.actual = testrun.variants.actual || {};
			actualSafe = testrun.variants.actualSafe = testrun.variants.actualSafe || {};
		}
	}
	//______________________________________________________________________________________________
	/**
	 *	get/set testrun value -- called by EZ.returnValue.get/setTestValue()
	 */	
	this.get = function __get(key, defaultValue)
	{
		return (key in this) ? this[key] : defaultValue;
	}
	this.set = function __set(key, value)
	{
		return this[key] = value;
	}
	//______________________________________________________________________________________________
	/**
	 *	get returned fn options
	 *		var rtnValue = testrun.getOptions()
	 */	
	this.getOptions = function __getOptions()
	{
		return EZ.test.run.options || {};
	}
	/**
	 *	get returnValue
	 *		var rtnValue = testrun.getReturnValue()
	 */	
	this.getReturnValue = function __getReturnValue()
	{
		var rtnValue = EZ.test.run.rtnValue; 
		if (!rtnValue)
		{
			this.appendNote('rtnValue Object NA -- returned new EZ.returnValue()'.wrap('<em>'));
			rtnValue = new EZ.returnValue()
		}
		return rtnValue;
	}
	this.getRtnValue = function()			//what is value ??
	{
		EZ.oops('depricated')
		return this.getReturnValue();
		//return EZ.test.getTestValue.call(this, 'rtnValue')		
	}
	this.getVariantData = function __getVariantData_TODO(key)
	{
		var vData = testrun.vData && testrun.vData.getData();
		return (!key) ? vData
					  : vData[key];
	}
	
	//______________________________________________________________________________________________
	/**
	 *	call by EZ.test.run() after return from test fn -- code moved here from EZ.test.run()
	 */
	this.testDone = function __testDone(results)
	{
		var rtnValue = EZ.test.run.rtnValue;
		if (testrun.testOptions.call == 'new')
		{													//if Object not returned for new testFn(...)
			if (results === undefined && rtnValue)			//...get from rtnValue if available
				results = rtnValue._ctx;
				
			else if (results instanceof Object && !rtnValue && results._data)
				rtnValue = EZ.test.run.rtnValue = results;	
		}
		if (rtnValue)										//if rtnValue exists, delete clutter...
		{												
			if (results instanceof Object && results._EZreturnValueCount)
				results.removeKeys('','Function');			//V2...remove functions
		}													
		if (results instanceof Object && results._EZreturnValueCount)
			delete results._ctx;							//V2
		
		//if (results instanceof Object && results.removeClutter)
		//	results = results.removeClutter(results);		//V3+

		return results;
	}
	
	//______________________________________________________________________________________________
	/**
	 *	TODO:
	 */
	this.setOk = function __setOk_TODO(value)
	{
		void(value);
	}
	/**
	 *	
	 */
	this.getArgumentCiteName = function __getArgumentCiteName(idx, className)
	{
		if (className == 'results') className = 'actual';
		var argName = !this.isFn(idx,className) ? this.callArgNameCite[idx] || ''
					: this.callArgNameTestFn[idx][className] || this.callArgNameCite[idx] || 'NA';
		return argName.trim();
	}
	this.setArgumentCiteName = function __setArgumentCiteName(idx, name, className, value)
	{
		if (className == 'results') className = 'actual';
		var argName = (!isNaN(idx)) ? (idx+1).suffix() + ' arg'
					: idx == 'results' ? 'return value'
					: idx == 'ctx' ? '"this"'
					: '';
		name = name ? name.wrap('<cite>') + ' ' + argName : argName.wrap('<cite>')
			// + ' (' + argName + ')';

		this.callArgNameTestFn[idx] = this.callArgNameTestFn[idx] || {};
		this.callArgNameTestFn[idx][className] = name;
		this.setClonedValue(idx, className, false);
		
		while (!isNaN(idx))
		{
			if (this.args_idx[idx] === undefined)		//TODO: not call arg
			{
				//this.args_idx.push(idx);	
				break;
			}
														//getExpected(...) ??
			var currentValue = (className == 'expected') ? this.expected[idx]
													   	 : this.actual[idx];
			if (!EZ.equals(currentValue, value))
			{
				this.argsChanged[idx] = true;
				this.argsChangedDetails[idx] = 'updated by test script callback fn';
			}
			break;
		}	
	}
	/**
	 *	find expected changed w/o calling setExpected()
	 */
	this.checkUnknownExpectedChanged = function __checkUnknownExpectedChanged()
	{											//use getExpected(...) ??
		if (!EZ.valueMap(this.expected, this.expectedValueMap))
			this.mergeListItem('expectedChanged', '...NA...not changed via setExpected fn...');	
	}
	
	this.getActualChangedList = function __getActualChangedList()
	{
		var list = [];
		this.args_idx.forEach(function(idx)
		{
			if (testrun.isActualChanged(idx))
				list.push(idx);
		});
		return list;
	}
	
	this.isActualChanged = function __isActualChanged(key)
	{
		var idx = this.getIndex(key);
		return this.isFn(idx, 'actual') ? idx : '';
	}

	this.setExpectedChanged = function __setExpectedChanged(args_idx, value)
	{
		this.checkUnknownExpectedChanged();
		
		this.expected[args_idx] = value;		//getExpected(...) ??
		this.expectedValueMap = EZ.valueMap(this.expected);
				
		var name = this.callArgNameLong[args_idx];
		this.mergeListItem('expectedChanged', name);
	}
	
	this.isFn = function __isFn(idx,className)
	{
		if (className == 'results') className = 'actual';
		return (this.callArgNameTestFn[idx] && className in this.callArgNameTestFn[idx])
	}
	
	this.isClonedValue = function __isClonedValue(idx,className)
	{
		if (className == 'results') className = 'actual';
		return (this.clonedValue[idx] && this.clonedValue[idx][className])
	}
	
	this.setClonedValue = function __setClonedValue(idx,className, isTrue)
	{
		if (className == 'results') className = 'actual';
		this.clonedValue[idx] = this.clonedValue[idx] || {};
		this.clonedValue[idx][className] = isTrue;
	}
	//______________________________________________________________________________________________
	/**
	 *	set ignore arg for this test from ignoreArgs test settings
	 */
	this.setIgnoreArgs = function __setIgnoreArgs()
	{
		this.args_ignored = [];
		EZ.toArray('EZ.test.data.settings.ignoreArgs'.ov(''), ', ').forEach(function(arg)
		{
			testrun.args_ignored.push( this.getIndex(arg) );
		});
	}
	/**
	 *	returns message if arg is ignored by okRules -or- ignoreArgs test setting otherwise blank.
	 *	Ignored args are not validated against call arg value, value changed by test functiom or 
	 *	set by test script callback function..
	 */
	this.isIgnoredArg = function __isIgnoredArg(key)
	{
		var idx = this.getIndex(key);
		if (this.args_ignored.includes(idx))		
			return 'ignored per test script settings';
		
		if (this.args_ignoredOkRules.includes(idx+''))	
			return 'ignored per Ok rules';
		
		return '';
	}
	/**
	 *	return value / (actual) call arguments 
	 */
	this.appendResults = function __appendResults(value, name)
	{
		var results = this.getResults()
		name = ('_' + (name || '')).wrap('<em>');
		if (results instanceof Object)
			results[name] = value;
		else if (value instanceof Object)
			results += '\n' + name + ': ' + EZ.stringify(value, '*');
		else
			results += '\n' + name + ': ' + value;
		this.setResults(results, null);
		this.appendNote('_message'.wrap('<em>') + ' appended to actual return value');		
	}
	this.getResults = function __getResults()
	{
		return this.argsClone.results;
	}
	this.isResults = function __isResults()
	{
		return this.argsClone.results != null;
	}
	this.setResults = function __setResults(value, name)
	{
		this.setResultsArgument('results', value, name);
		//this.setClonedValue('results', 'actual', false);
		//this.argsClone.results = value;
	}
	this.setResultsArgument = function __setResultsArgument(key, value, name)
	{
		name = name || '';
		var isRunCall = (name == '-run-');

		if (isRunCall && this.isFn(key,'results')) 
			return;				//02-02-17 added to preserve values set by script
		
		var idx = this.getIndex(key);
		//var results = this.getActual();
		testrun.actual[idx] = value;	
		testrun.safe.actual[idx] = (testrun.call == 'new' || isRunCall) ? value
								 : testrun.deepClone(value, idx, 'actual');
		if (isRunCall) 
			return;
	
		if (!this.args_idx.includes(idx))
			this.args_idx.push(idx);
		this.setArgumentCiteName(idx, name, 'actual', value);

		var argName = (!isNaN(idx)) ? (idx+1).suffix() + ' actual return arg'
					: idx == 'results' ? 'actual return value'
					: idx == 'ctx' ? '"this" return value'
					: '';
		if (name)
			this.appendNote(argName + ' set to ' + name.wrap('<cite>'));	
	}
	/**
	 *	call arguments -- 
	 */
	this.haveArgument = function __haveArgument(key)
	{
		var idx = EZ.getIndex(key, this.argNames);
		return (this.args_idx.includes(idx));
	}
	this.isArgumentChanged = function __isArgumentChanged(key)		
	{
		var idx = this.getIndex(key, this.argNames);
		return !this.argsChanged || this.argsChanged[idx];
	}
	this.getArgument = function __getCallArgument(key)
	{
		var idx = this.getIndex(key, this.argNames);
		//if (isNaN(idx))
		//	return;
		return this.argsClone[idx];
	}
	this.setArgument = function __setCallArgument(key, value)		//before test run ??
	{
		EZ.oops('use: setResultsArgument()');
		var idx = EZ.getIndex(key, EZ.test.data.argNames);
		this.setClonedValue(idx, 'args', false);
		if (isNaN(idx))
			return;
		
		if (idx >= 0 && this.argsClone[idx] !== value)
		{										//TODO: only works if detail displayed for all args
			this.argsClone[idx] = value;
			var argDetail = this.tags.EZ('argDetail').EZ('pre', true);
			EZ.addClass(argDetail[idx], 'notefnChanged');
			var msg = 'EZ.test.run call value displayed but changed by test script callback fn';
			EZ.el.setAttribute('title', msg);
			return true;
		}
		return false;
	}
	//______________________________________________________________________________________________
	/**
	 *	expected results
	 */
	this.getExpectedArgument = function __getExpectedArgument(key)
	{
		var idx = this.getIndex(key)
		return getExpected(this, idx);
		//return this.expected[this.getIndex(key)];
	}
	this.isExpectedArgument = function __isExpectedArgument(key)
	{
		var idx = this.getIndex(key);
		return getExpected(this, idx) != EZ.test.notSpecified;
	}
	this.setExpectedArgument = function __setExpectedArgument(key, value, name)
	{
		var idx = this.getIndex(key)
		if (getExpected(this, idx) != value)
			this.setExpectedChanged(idx, value);
		this.setArgumentCiteName(idx, name, 'expected', value);
		return value;
	}
	this.getExpectedResults = function __getExpectedResults()
	{
		return getExpected(this,'results');
	}
	this.isExpectedResults = function __isExpectedResults()
	{
		return getExpected(this,'results') != EZ.test.notSpecified;
	}
	this.setExpectedResults = function __setExpectedResults(value, name)
	{
		return this.setExpectedArgument('results', value, name);
	}
	this.isExpectedChanged = function __isExpectedChanged(args_idx)
	{
		var list = this.getList('expectedChanged');
		return list[this.callArgNameLong[args_idx]];
	}
	/**
	 *	lists
	 */
	this.mergeListItem = function __mergeListItem(name, msg)
	{
		var data = this;	
		this.lists = this.lists || {};
		var list = data.lists[name] = (data.lists[name] || {});
		EZ.mergeMessages(list, msg)
		return list;
	}
	this.addListItem = function __addListItem(name,value)
	{
		var data = this._;	
		data.lists = data.lists || {};
		var list = data.lists[name] = (data.lists[name] || []);
		(EZ.isArray(value)) ? list = data.lists[name] = list.concat(value)
							: list.push(value);
		return list;
	}
	this.getListString = function __getListString(name)
	{
		var list = this.getList(name);
		return (typeof(list) == 'object') ? EZ.mergeMessages(list).replace(/x 1/g,'')
			 : list.length ? list.join('\n') : '';
	}
	this.getList = function __getList(name)
	{
		var data = this;	
		var lists = data.lists || {};
		return lists[name] || [];
	}		
	this.haveList = function __haveList(name)
	{
		var data = this._;	
		var lists = data.lists || {};
		return Boolean(lists[name]);
	}
	//______________________________________________________________________________________________
	/**
	 *	get supplemental test script data
	 */
	this.getTestValue = function __getTestValue_review(key)
	{
		var data = this.testData || {};
		return (key != null) ? data[key] : data;
	}
	//______________________________________________________________________________________________
	/**
	 *	set supplemental test script data
	 */
	this.setTestValue = this.setExtra = function __setTestValue_review(key, value)
	{
		var isEqual = true;
		switch (arguments.length)
		{
			case 1:							//single argument is value only
			{								//TODO: ??
if (true) return;		
				this.testData = value = key;
				if (value instanceof Object)
				{
					var opts = {ignore:'script, constructor, objectType', exclude:'Function'};
					this.testData = EZ.cloneDev.object(value, opts);
					
					//var info = EZ.cloneDev.info(this.testData);
					opts = EZ.options.call(opts, {html:true, showDiff:9, console:true});
					isEqual = EZ.equals(value,this.testData, opts);
					if (!isEqual) 
						EZ.compare(value,this.testData);
				} 
				return isEqual;
			}
			case 2:							//key and value arguments
			{
				if (!this.testData)
					this.testData = {};
				else if ( !(this.testData instanceof Object) )
					this.testData = {"": this.testData}
				
				//value = (value instanceof Object) ? value.cloneObject() : value;
				return this.testData[key] = value;
			}
		}
	}
	//______________________________________________________________________________________________
	/**
	 *	note
	 */
	this.appendNote = function __appendNote(value, action)
	{
		var note = this.getNote()
		
		if (EZ.isArray(value))
			value = value.join('\n').wrap('<pre>');
		
		else if (value instanceof Object)
			value = formatObject(value, 'EZtoString').wrap('<pre>');
		
		else if (note && typeof(value) == 'string')
			value = '\n' + value;
		
		switch (action)
		{
			case 'alert': 	
				this.setOk(false);
				value = value.wrap('<em>');
				break;
			
			case 'warn': 	
				value = value.wrap('<em>')
				break;
			
			case 'bold': 	
				value = value.wrap('<b>')
				break;
		}	
		this.setNote(note + value);
	}
	
	this.getNote = function __getNote()
	{
		return this.note;
	}
	
	this.setNote = function __setNote(value)
	{
		value = (EZ.isArray(value)) ? value.join('\n').wrap('<pre>')
			  : (value instanceof Object) ? EZ.stringify(value)
			  : value + '';
		this.note = value;
	}
	//______________________________________________________________________________________________
	/**
	 *
	 */
	this.deepClone = function deepClone(obj, name, maxdepth)
	{	
		var idx, className, cloneOpts, rtnValue;
		if (this.setClonedValue && isNaN(maxdepth))
		{
			//testrun = this;
			idx = name;
			className = maxdepth || '';
			name += className.wrap('[]')
		}
		
		if ( !(obj instanceof Object) )
		{
			if (testrun)
				testrun.setClonedValue(idx,className,true);
			return obj;
		}
		var msg = '';
		var clone = obj;
		var cloneHow = EZ.get('useCloneObject')
		try
		{
			var opts = (typeof(name) != 'string') ? name : undefined;
			if ( !(obj instanceof Object) || cloneHow == 'json' || opts !== undefined)
			{
			//	console.log('deepClone calling EZ.clone()', name, obj, 'maxdepth',maxdepth);
				//---------------------------------------------
				clone = EZ.clone(obj, opts);
			}
			//..............................................
			else if (cloneHow == 'objectClone')
			{
				//---------------------------------------------
				clone = obj.cloneObject(maxdepth);
				//---------------------------------------------
				msg = EZ.clone.message;
			}
			else if (cloneHow != 'EZcloneV3')
			{
			//	EZ.log.call('clone', 'deepClone calling EZ.clone.object', name, 'maxdepth',maxdepth);
				rtnValue = new EZ.rtnValue();
				cloneOpts = {maxdepth:maxdepth, rtnValue:rtnValue};
				//----------------------------------------------
				clone = EZ.cloneDev.object(obj, cloneOpts);
				//----------------------------------------------
				cloneHow = 'EZ.cloneDev.object'
				if (!rtnValue || !rtnValue.isOk) 
					msg = ['fail -- see EZ.log: [clone]']
				
				else if (rtnValue.isOk())
				{
					//if (clone.rtn)
				}
				else msg = rtnValue.getMessage();	//empty Array if success
			}
			else		//EZcloneV3
			{
				cloneHow = 'EZ.cloneV3.object'
				cloneOpts = {maxdepth:maxdepth};
				//----------------------------------------------
				rtnValue = new EZ.cloneV3.object(obj, cloneOpts);
				clone = rtnValue.getValue()
				//----------------------------------------------
				if (!rtnValue.isOk()) 
					msg = rtnValue.getMessage();
			}
			//..............................................
		}
		catch (e)
		{
			msg = [e + ''];
		}
		while (msg)
		{
			if (msg.length === 0)
				break;
			else if (msg.length !== undefined)
				msg = EZ.toArray(msg, '\n');
			
			msg.unshift('deepClone[' + cloneHow + '] failed -- name: ' + (name || 'NA').wrap());
			msg = msg.concat( EZ.getStackTrace() );
			
			testrun.faults++; 
			if (testrun.faultsDetail.length)
				testrun.faultsDetail.push('-'.repeat(40));
			testrun.faultsDetail = testrun.faultsDetail.concat(msg);
			break;
		}
		return clone;
	}
}

/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.test.getUrl = function EZtest_getUrl(filename)
{
	var url = EZ.test.config.testdataURL	// + EZ.test.config.testdataFolder;
	switch (filename)
	{
		case 'todo': 	return url + 'todo.html'
		default:		return url;
	}	
}

  //-------------------------------------------\\
 //----- EZ test assistant config settings -----\\
//-----------------------------------------------\\
EZ.test.config = {
	
	jsonKeys: 'args results expected'.split(' '),
	lastrunKeys: 'testno okChecked callArgNames callArgTypes callArgValues note warn'.split(' '),
	saveKeys: 'testno id ok note warn saveDateTime used'.split(' '),
	extendedKeys: [],		//TODO: extended validation
	
	resultsKeys: 'expected actual safe note'.split(' '),
	displayKeys: 'display_args display_results display_expected'.split(' '),
	
	matchKeys: ('testno ok ctxOk argsOk testOk ctxRequired ctx args '
			   +'actual expected safe note errmsg warn').split(' '),
	
	testdataFolder: 'Shared/EZ/testdata/',
	testdataURL: 'http://localhost:8080/revize/dw.Configuration/Shared/EZ/testdata/',
	
	appFolders: ['C:/Program Files', 'C:/Program Files (x86)'],
	
	assistant: {
		folder: 'EZ/html',
		filename: 'EZtestdata.js',
		resultsFilename: '_assistant_testResults.json',
		/*
		matchKeysBase: 'testno'.split(' '),
		matchKeysStatus: 'testOk ctxOk argsOk'.split(' '),
		matchKeysResults: 'results expected'.split(' '),
		matchKeysArgs: 'ctxRequired ctx args'.split(' '),
		matchKeysNote: 'note'.split(' '),
		matchKeysWarn: 'warn'.split(' '),
		matchKeysFormat: 'callArgs display_args display_results display_expected'.split(' '),
		*/
		noteHelpHTML: 'defined in EZtest_assistant.html'
	},
	title: {
	},
	tooltips: {							//only save buttun
		notsaved: 'none currently saved',
		lastSavePass: 'last saved results passed',
		lastSaveFail: 'last saved results failed',
		updated: 'return values changed since saved',
		updatedNot: 'return values not used for ok not saved',
		saved_current: 'saved results up-to-date',
		'': 'click to save current results'.wrap('<em>')
	},
	testStyles: {
		pass: '@, actual',
		fail: '@, actual',
		failOk: '@, first',
										//status after 1st run -- used to pass filters
		pass1st: '@',				
		fail1st: '@',
		failOk1st: '@',
		notsaved1st: '',
		saved1st: '',
		
		scriptOverResults: '@',
		scriptOverCtx: '@',
		scriptOverArgs: '@',
										//ok checkbox border / tooltip
										//ok tooltip disabled if nothing to say

		passOkChecked1st: 'okLabel okLabel=tooltipClick',
		failOkChecked1st: 'okLabel okLabel=tooltipClick',
		
		lastRunDiffAny: 'okLabel okLabel=tooltipClick',		
		lastRunSameOk: '',
		lastRunDiffOk: '',
		lastRunPassOk: '@ .okLabel',
		lastRunFailOk: '@ .okLabel',		

		lastSaveDiffAny: '',		
		lastSaveSameOk: '',
		lastSaveDiffOk: '',
		lastSavePassOk: '',
		lastSaveFailOk: '',		

		lastRunDiffArgs: '@ lastrunButton=visible lastrunTooltip=show',
		lastRunDiffNote: '@ lastrunButton=visible lastrunTooltip=show',
		lastRunDiffWarn: '@ lastrunButton=visible lastrunTooltip=show',

		lastSaveDiffArgs: '',
		lastSaveDiffNote: '',
		lastSaveDiffWarn: '',
		
		faults: '@ faultsButton=visible',
		ignored: 'ignoredButton=visible',
		argsChanged: 'argsChangedWrap=visible',
										//.warn set BG pink
		argsChangedWarn: 'argsChangedWrap=warn argsChangedTooltip=warn',
		override: '@, overrideButton=visible expectedWrap=scriptDiff',
		notSpecified: 'actual',
		
		updated: 'results_changed=save', //all-notsaved
		saved: 'deleteSaved=visible', 						
		notsaved: '@ first', 
		saved_current: '@, save', 
		saveError: 'saveErrorButton=visible, saveTooltip',	//, save
		
		noReturnValues: 'okSettings',		//no return values displayed
		scriptDiff: 'expectedWrap',		//testrun.isOverride
		displayed: '',					//counts only
		is3way: ''						//	''	  ''
	}
}
EZ.test.messages = {			//error messages
	ctxOmitted: 'prototype function requires "this" as 1st arg',
	ctxTypeInvalid: ' invalid type for prototype',
	exception: 'exception occured in test function',
	'': 'test not run -- reason unknown'
}								//constants
EZ.test.noArguments = 'no arguments'.wrap();
EZ.test.noNamedArguments = 'no named arguments'.wrap();
EZ.test.omitted = 'omitted'.wrap();
EZ.test.notSpecified = 'not specified'.wrap();
EZ.test.MORE = '\n' + EZ.MORE + '\n';
EZ.test.morePattern = RegExp(EZ.test.more);
//____________________________________________________________
/**
 *	
	return testrun.compareFrom == 'saved'
		 ? testrun.savedResults || {}
	 	 : testrun.expected;		//expected is saved if fromEx is saved
		if (keys.length == 1)
		{
			diff.oldText =  compareFrom[key];
			diff.newText =  compareTo[key];
		}
		else
		{
 */
/*global formatResults */
EZ.test.getCompareData = function EZtest_getCompareData(testno)
{
//	testno = EZ.toInt(testno);
//	var testrun = EZ.test.data.testrun[testno-1];
	var testrun = EZ.test.getTest(testno);
	
	var diff = {oldText:{}, newText:{}};
	
	var compareFrom = testrun;	//for simple ok, testrun
	var compareTo = testrun.expected;
	
	var keys = EZ.test.getCompareKeys(testrun);
	keys.forEach(function(key)
	{					
		diff.oldText[key] = compareFrom[key];
		diff.newText[key] = compareTo[key];
	});
	
	var name = 'TEST #' + testno;
	diff.newText = formatResults(diff.newText, name).replace(/ \[Object\](.*)/, '$1');
	diff.oldText = formatResults(diff.oldText, name).replace(/ \[Object\](.*)/, '$1');
	return diff;
}
//____________________________________________________________
/**
 *	
 */
EZ.test.getCompareFrom = function EZtest_getCompareFrom(testrun)
{
	return testrun.compareFrom == 'saved'
		 ? testrun.savedResults || {}
	 	 : testrun.expected;		//expected is saved if fromEx is saved
}
//____________________________________________________________
/**
 *	getter compareKeys -- originally for compareResults()
 */
EZ.test.getCompareKeys = function EZtest_getCompareKeys(testrun)
{
	if (EZ.get('validation') || true)
		return EZ.test.config.matchKeys.concat(EZ.test.config.displayKeys);
	
	var keys = ['ctx', 'args', 'results'];
	if (!testrun.ctxRequired)					//not prototype
		keys = keys.remove('ctx');

//	if (testrun.argsOk && !'.expected.args.length'.ov(testrun))	//no expected args
//		keys = keys.remove('args');
	
	return keys;
}
//____________________________________________________________
/**
 *	getter for EZ.test.config.displayKeys
 */
EZ.test.getDisplayKeys = function EZtest_getDisplayKeys()
{
	var keys = {full: EZ.test.config.displayKeys};
	return keys;
}
//____________________________________________________________
/**
 *	getter for EZ.test.config.jsonKeys
 *	used to determine if savedResults needs updating
 */
EZ.test.getJsonKeys = function EZtest_getJsonKeys(/* testrun */)
{
	var keys = EZ.test.config.jsonKeys;
	return keys;
}
EZ.test.getResultsKeys = function EZtest_getResultsKeys(/* testrun */)
{
	var keys = EZ.test.config.resultsKeys;
	return keys;
}
//____________________________________________________________
/**
 *	getter for EZ.test.config.matchKeys
 *	used to determine if savedResults needs updating
 */
EZ.test.getMatchKeys = function EZtest_getMatchKeys(testrun)
{
	var matchKeys = EZ.test.getCompareKeys(testrun).remove(['testno', 'ok']);
	return matchKeys;
}
//____________________________________________________________
/**
 *	getter for save keys -- originally same as compare
 */
EZ.test.getSaveKeys = function EZtest_getSaveKeys(testrun)
{
	var keys = EZ.test.config.saveKeys;
	if (!testrun.ctxRequired)					//not prototype
		keys = keys.remove('ctxClone');
	return keys;
}
//____________________________________________________________
/**
 *	getter for validateKeys -- defined in html checkboxes
 */
EZ.test.getValidateKeys = function EZtest_getValidateKeys()
{
	var validateKeys = [];
	var validateBy = EZ.get('validateBy');

	EZ('savedResultsWhat').EZ('input',true).forEach(function(el)
	{
		if (!el.checked) return;
		var keys = EZ.toArray(EZ.get(el), ', ');
		keys.forEach(function(key)
		{
			var idx = EZ.test.config.displayKeys.indexOf('display_' + key);
			if (idx != -1)
			{
				switch (validateBy)
				{
					case 'value':
						return validateKeys.push(key);
					case 'display':
						return validateKeys.push(EZ.test.config.displayKeys[idx]);
					default:
						validateKeys.push(key,EZ.test.config.displayKeys[idx]);
				}
			}
			else validateKeys.push(key);
		});
		//validateKeys = validateKeys.concat(keys);
	});
	return validateKeys;
}
/*----------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
e = function _____GENERAL_FUNCTIONS_____() {}	//convenience for DW functions list
/*----------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
EZ.test.jsonValue = function EZtest_jsonValue(obj)
{
	var json = (obj == null) ? '"' + obj + '"'
			 : EZ.isObjectCircular(obj) ? 'circular [Object]'
			 : EZ.stringify(obj, '*');
	return json;
}
/*-----------------------------------------------------------------------------------
-----------------------------------------------------------------------------------*/
EZ.test.setGlobalTestData = function EZtest_setGlobalTestData()
{
	eval(EZ.get('testdata_varibles'));					
	
	EZ.global.testdata =
	{
		array: [1,2],
		arraySparse: ['a', NaN,undefined,null,5],
		fruit: {apple: 'APPLE', lemon: 'LEMON'},
		girls: ['Jane', 'Brenda', 'Dyan'],
		guys: ['Otis', 'Ghost'],
		multiline: [1, 'a',
			'John Tyler "III", President\n' +
			'Keys Adventures, Inc\n' +
			'123 Palms, Suite Q\n' +
			'Key Largo, FL 80209', 'x', 'y', 'z' ],
		regex: /\s*(a|b|c)/gim,
		person: {
			name: "Jim Cowart",
			location: {
				city: {
					name: "Chattanooga",
					population: 167674
				},
				state: {
					name: "Tennessee",
					abbreviation: "TN",
					population: 6403000
				}
			},
			company: "appendTo",
		},
		personArrayLike: {
			'null': null,
			name: "Jim Cowart",
			location: {
				city: {
					name: "Chattanooga",
					population: 167674
				}
			}
		},
		fuse: {
			shouldSort: true,
			distance: 55,
			threshold: 0.4,
			truncateSearchText: "true",
			include: [
				"score",
				"offsets"
			],
			maxResults: 0,
			keys: ["title", "author.firstName"],
			sortKeys: ["author.firstName","title"],
			id: "title, author.firstName"
		}
	}
	//EZ.global.testdata.array['5'] = 'five'
	EZ.global.testdata.arraySparsePlus = EZ.global.testdata.arraySparse.slice();
	EZ.global.testdata.arraySparsePlus.push(EZ.global.testdata.guys)
	EZ.global.testdata.arraySparsePlus.push(EZ.global.testdata.fruit)
	EZ.global.testdata.arraySparsePlus.push(EZ.global.testdata.girls)
	
	EZ.global.testdata.personArrayLike[0] = 'a'
	EZ.global.testdata.personArrayLike[1] = 'b'
	EZ.global.testdata.personArrayLike.length = 2;
	
	EZ.global.testdata.fuse.include.score = true
	EZ.global.testdata.fuse.include.scoreKey = true
	EZ.global.testdata.include = EZ.global.testdata.fuse.include.cloneObject();
	
	EZ.global.testdata.objectLike = EZ.global.testdata.array.slice();
	EZ.global.testdata.objectLike.person = EZ.global.testdata.person;
	
	EZ.global.testdata.objectLikeMore = EZ.global.testdata.array.slice();
	EZ.global.testdata.objectLikeMore.person = EZ.global.testdata.person;
	EZ.global.testdata.objectLikeMore.push(EZ.global.testdata.include)
	
	EZ.global.testdata.fnSimple = function test(arg) {return arg}
	EZ.global.testdata.fnSimple.fn = function(other) {return other}
	EZ.global.testdata.fnSimple.include = EZ.global.testdata.fuse.include;
	EZ.global.testdata.fnSimple.arraySparse = EZ.global.testdata.arraySparse;
}
/*
//________________________________________________________________________________

EZ.test.data.include_json = ''
	   + '[\n'
	   + '    "score",\n'
	   + '    "offsets",\n'
	   + '    {\n'
	   + '        ____properties____: {\n'
	   + '            score: true,\n'
	   + '            scoreKey: true\n'
	   + '        }\n'
	   + '    }\n'
	   + ']';
// . . . . . . . .  . . . . . . . . . . . . . . .  . . . . . . . . . . . . . . . .

EZ.test.data.fn = function test(arg) {return arg}
EZ.test.data.fn.include = EZ.global.testdata.fuse.include;
EZ.test.data.fn.arraySparse = EZ.global.testdata.arraySparse;
EZ.test.data.fn_json = ''
	   + 'function test(arg) \n'
	   + '{\n'
	   + '    return arg;\n'
	   + '    ____properties____ = {\n'
	   + '        include: [\n'
	   + '            "score", "offsets",\n'
	   + '            {\n'
	   + '                ____properties____: {\n'
	   + '                    score: true,\n'
	   + '                    scoreKey: true\n'
	   + '                }\n'
	   + '            }\n'
	   + '        ],\n'
	   + '        arraySparse: ["a", NaN, undefined, null, 5]\n'
	   + '    }\n'
	   + '}';
//________________________________________________________________________________

EZ.test.data.jsonSampleFormat = ''		//all indent scenarios (hopefully)
								+ '[\n'
								+ '    88, "abc",\n'
								+ '    {\n'
								+ '        o: {\n'
								+ '            a: 1\n'
								+ '        },\n'
								+ '        a: [1, 2],\n'
								+ '        score: true\n'
								+ '    },\n'
								+ '    [1, 2, 3]\n'
								+ ']';
//________________________________________________________________________________

EZ.testSample = function EZtestSample(arg) {return arg}
EZ.testSample.test = function()
{
	EZ.test.run(1,		{EZ: {ex:1		}})
	EZ.test.run([1,2],	{EZ: {ex:[1,2]	}})
}

EZ.testSample.testdata = EZ.global.testdata
EZ.test.data.testSample = ''
	   + 'function EZtestSample(arg,other) \n'
	   + '{\n'
	   + '    return arg;\n'
	   + '    ____properties____ = {\n'
	   + '        test: function ()\n'
	   + '        {\n'
	   + '            EZ.test.run(1,        {EZ: {ex:1        }})\n'
	   + '            EZ.test.run([1,2],    {EZ: {ex:[1,2]    }})\n'
	   + '        },\n'
	   + '        displayName: "EZ.testSample",\n'
	   + '        testdata: {\n'
	   + '            array: [1, 2],\n'
	   + '            arraySparse: ["a", NaN, undefined, null, 5],\n'
	   + '            fruit: {\n'
	   + '                apple: "APPLE",\n'
	   + '                lemon: "LEMON"\n'
	   + '            },\n'
	   + '            girls: ["Jane", "Brenda", "Dyan"],\n'
	   + '            guys: ["Otis", "Ghost"],\n'
	   + '            multiline: [\n'
	   + '                1, "a", ""\n'
	   + '                + "John Tyler \\\\"III\\\\", President"\n'
	   + '                + "Keys Adventures, Inc"\n'
	   + '                + "123 Palms, Suite Q"\n'
	   + '                + "Key Largo, FL 80209",\n'
	   + '                "x", "y", "z"\n'
	   + '            ],\n'
	   + '            regex: /\\\\s*(a|b|c)/gim,\n'
	   + '            person: {\n'
	   + '                name: "Jim Cowart",\n'
	   + '                location: {\n'
	   + '                    city: {\n'
	   + '                        name: "Chattanooga",\n'
	   + '                        population: 167674\n'
	   + '                    },\n'
	   + '                    state: {\n'
	   + '                        name: "Tennessee",\n'
	   + '                        abbreviation: "TN",\n'
	   + '                        population: 6403000\n'
	   + '                    }\n'
	   + '                },\n'
	   + '                company: "appendTo"\n'
	   + '            },\n'
	   + '            personArrayLike: {\n'
	   + '                0: "a",\n'
	   + '                1: "b",\n'
	   + '                "null": null,\n'
	   + '                name: "Jim Cowart",\n'
	   + '                location: {\n'
	   + '                    city: {\n'
	   + '                        name: "Chattanooga",\n'
	   + '                        population: 167674\n'
	   + '                    }\n'
	   + '                },\n'
	   + '                length: 2\n'
	   + '            },\n'
	   + '            fuse: {\n'
	   + '                shouldSort: true,\n'
	   + '                distance: 55,\n'
	   + '                threshold: 0.4,\n'
	   + '                truncateSearchText: "true",\n'
	   + '                include: [\n'
	   + '                    "score", "offsets",\n'
	   + '                    {\n'
	   + '                        ____properties____: {\n'
	   + '                            score: true,\n'
	   + '                            scoreKey: true\n'
	   + '                        }\n'
	   + '                    }\n'
	   + '                ],\n'
	   + '                maxResults: 0,\n'
	   + '                keys: ["title", "author.firstName"],\n'
	   + '                sortKeys: ["author.firstName", "title"],\n'
	   + '                id: "title, author.firstName"\n'
	   + '            },\n'
	   + '            arraySparsePlus: [\n'
	   + '                "a", NaN, undefined, null, 5,\n'
	   + '                ["Otis", "Ghost"],\n'
	   + '                {\n'
	   + '                    apple: "APPLE",\n'
	   + '                    lemon: "LEMON"\n'
	   + '                },\n'
	   + '                ["Jane", "Brenda", "Dyan"]\n'
	   + '            ],\n'
	   + '            include: [\n'
	   + '                "score", "offsets",\n'
	   + '                {\n'
	   + '                    ____properties____: {\n'
	   + '                        score: true,\n'
	   + '                        scoreKey: true\n'
	   + '                    }\n'
	   + '                }\n'
	   + '            ],\n'
	   + '            objectLike: [\n'
	   + '                1, 2,\n'
	   + '                {\n'
	   + '                    ____properties____: {\n'
	   + '                        person: {\n'
	   + '                            name: "Jim Cowart",\n'
	   + '                            location: {\n'
	   + '                                city: {\n'
	   + '                                    name: "Chattanooga",\n'
	   + '                                    population: 167674\n'
	   + '                                },\n'
	   + '                                state: {\n'
	   + '                                    name: "Tennessee",\n'
	   + '                                    abbreviation: "TN",\n'
	   + '                                    population: 6403000\n'
	   + '                                }\n'
	   + '                            },\n'
	   + '                            company: "appendTo"\n'
	   + '                        }\n'
	   + '                    }\n'
	   + '                }\n'
	   + '            ],\n'
	   + '            objectLikeMore: [\n'
	   + '                1, 2,\n'
	   + '                [\n'
	   + '                    "score", "offsets",\n'
	   + '                    {\n'
	   + '                        ____properties____: {\n'
	   + '                            score: true,\n'
	   + '                            scoreKey: true\n'
	   + '                        }\n'
	   + '                    }\n'
	   + '                ],\n'
	   + '                {\n'
	   + '                    ____properties____: {\n'
	   + '                        person: {\n'
	   + '                            name: "Jim Cowart",\n'
	   + '                            location: {\n'
	   + '                                city: {\n'
	   + '                                    name: "Chattanooga",\n'
	   + '                                    population: 167674\n'
	   + '                                },\n'
	   + '                                state: {\n'
	   + '                                    name: "Tennessee",\n'
	   + '                                    abbreviation: "TN",\n'
	   + '                                    population: 6403000\n'
	   + '                                }\n'
	   + '                            },\n'
	   + '                            company: "appendTo"\n'
	   + '                        }\n'
	   + '                    }\n'
	   + '                }\n'
	   + '            ],\n'
	   + '            fnSimple: function test(arg) \n'
	   + '            {\n'
	   + '                return arg;\n'
	   + '                ____properties____ = {\n'
	   + '                    fn: function (other) {return other},\n'
	   + '                    include: [\n'
	   + '                        "score", "offsets",\n'
	   + '                        {\n'
	   + '                            ____properties____: {\n'
	   + '                                score: true,\n'
	   + '                                scoreKey: true\n'
	   + '                            }\n'
	   + '                        }\n'
	   + '                    ],\n'
	   + '                    arraySparse: ["a", NaN, undefined, null, 5]\n'
	   + '                }\n'
	   + '            }\n'
	   + '        }\n'
	   + '    }\n'
	   + '}';
*/
/*----------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
EZ.fiddle = function(rtnValue)
{									
	//rtnValue = rtnValue ? EZ.fiddle.rtnValue(rtnValue) : new EZ.fiddle.rtnValue();
	var rr = EZ.fiddle.rtnValue(rtnValue)
	return rr;
}
EZ.fiddle.rtnValue = function yes(rtnValue)
{
	var me = arguments.callee;
	if (this instanceof me)
	{
		this.del = function del()
		{
			return 'delete';
		}
		return this;
	}
	else if (!rtnValue)	
		return new EZ.fiddle.rtnValue();
	
	//me = new me();
	Object.keys(me).forEach(function(key)
	{
		rtnValue[key] = me[key];
	});
	return rtnValue;
}
EZ.fiddle.rtnValue.add = function()
{
}
//_____________________________________________________________________________________________
EZ.fiddle.test = function()
{
	var msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, , rtnValue];

	//_______________________________________________________________________________________

	
	//_______________________________________________________________________________________	
	var rtnValue = {};
	var r = EZ.fiddle();
	var results = EZ.fiddle(rtnValue);
	EZ.test.run();
	console.log(results, r);
}
/*-----------------------------------------------------------------------------------
-----------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------
EZ.getType(value, options)

return value type via Object.prototype.toString.call(value) for more grandularity vs typeof()

ALWAYS return...
	"Boolean", "Function", "Number", "String", "Object", "Null", "Undefined"
	
	when typeof(value) == 'function', "Function" only returned if not constructor 	

	
ALSO return...
	"Array", "Date", "RegExp"	when value is: "Array", "Date", "RegExp" 
								-AND- unless options === false
								i.e. options omitted, undefined, null, true or blank
										
	"NaN",  					if options === true, NaN -or- includes NaN or "NaN"
	
	"ArrayLike"					if options === true -or- includes "ArrayLike"
								and value is Object with only length and numeric keys

	"ObjectLike"				if options === true -or- includes "ObjectLike"
								and value is Array with named keys other than length

								-or- Object with only numeric Keys and length property

	constructor name 			when options === true (not just "Array"  "Date", "RegExp")
								e.g. EZoptions, Arguments, Element, HTMLCollection
	
	TODO: arguments				-OR- if (options.includes(value.constructor.name)	
								-OR- if Object.prototype.toString.call(value) is all lowercase: 
										e.g. "Window" for [object global] -- snenario forgotten
RETURNS: 
	(String) representing value type as explained above.
--------------------------------------------------------------------------------------------------*/
EZ.getTypeNew = function EZgetType(value, options)
{
	//______________________________________________________________________________________________
	/**
	 *
	 */
	var _getLegacyType = function(value, options /* types */, type)
	{
		//__________________________________________________________________________________________
		/**
		 *	Always false
		 */
		var isArrayLike = function()					
		{
			var keys = Object.keys(value).sort();
			if (keys.includes('length'))
				keys.splice(keys.includes('length'),1);
			
			var arr = [].slice.call(value);
			return (Object.keys(arr).sort().join(' ') == keys.join(' '))
		}
		//__________________________________________________________________________________________
		/**
		 *	Always true if length > 0
		 */
		var isObjectLike = function()
		{
			var keys = Object.keys(value).sort();
			return (JSON.stringify(keys).includes('"'));
		}	
		//===========================================================================================
		if (arguments.length < 2 || options === null || options === undefined 
		|| options === '' || options === true && value)		//??
		{
			while (options === true)
			{				
				if (type == 'Object'
				&& typeof(value) == 'object' && 'length' in value)
				{
					if (isArrayLike())
						return "ArrayLike";
					break;
				}
				else if (type == 'Array'
				&& value && typeof(value) == 'object' && 'length' in value)
				{
					if (isObjectLike())			//always returns true if length > 0 ??
						return "ObjectLike";
					break;
				}
				break;
			}
			return type;
		}
		if (options === false && /(Array|Date|RegExp)/.test(type))
			return "Object";
		
		if (type == 'Number' && isNaN(value))
		{
			if ((options === true ||options === 'NaN' || isNaN(options))
			|| (EZ.isArray(options) && options.includes(NaN))
			|| (typeof(options) == 'string') && /\bNaN\b/.test(options))
				return "NaN";
			else
				return type;
		}
		if (!(value instanceof Object))
			return type;
		
		if (options == null || /(undefined|boolean|number)/.test(typeof(options)) || options === '')
			return type;
		
		var name = value.constructor.name;
		if (typeof(options) == 'function' && options.constructor.name == name)
			return name;
		
		while (typeof(value) == 'object')
		{	
			options = EZ.toArray(options, ', ');		
			if (options.includes(name) || options.includes(value.constructor))
				return name;					//return constructor name
			
			if (options.includes('ArrayLike') && isArrayLike())
				return "ArrayLike";				
			
			if (options.includes('ObjectLike') && isObjectLike())
				return "ObjectLike";			
			
			break;
		}
		//======================
		return type;
		//======================
	}
	//================================================================================================
	var types = (options == null) ? []
			  : (typeof(options) == 'boolean') ? [options]
			  : (typeof(options) == 'string') ? EZ.toArray(options, ' ,')
			  : EZ.isArray(options) ? options.slice()
			  : !(options instanceof Object) ? []
			  : (options.types !== undefined) ? options.types
			  : (Object.keys(options.length) || options.constructor.name == 'Object') ? []
			  :	[options.constructor.name]
	
	options = (options instanceof Object && Object.keys(options.length)) ? options
																		 : {types: types};
	var rtnValue = new EZ.returnValue(this, options);
	
	var isLegacy = options.legacy !== undefined ? options.legacy 
				 : (this instanceof arguments.callee) ? false
				 : EZ.isLegacy();
	//===========================================================================================
	var type = Object.prototype.toString.call(value);
	type = type.substring(8,type.length-1)
	//===========================================================================================
	rtnValue.set('basic', type);
	
	var constructorName = value.constructor.name;
	type = (type.toLowerCase() == type) ? constructorName
		 : (value instanceof Object) ? constructorName
		 : type;
		
	if (type.endsWith('Element') && types.includes('Element'))
		type = 'Element';
	
	else if (isLegacy)										//not called as constructor
		type = _getLegacyType(value, types, type);
														
	var extendedType;
	if (/(Array|Date|RegExp)/.test(constructorName))
		extendedType = constructorName;						//Array, Date, RegExp
	
	else if (constructorName == 'Object' 
	&& 'length' in value && EZ.isArrayLike())
		extendedType = "ArrayLike";							//Object with length property
		
	else if (constructorName == 'Array' && EZ.isObjectLike(value))
		extendedType = "ObjectLike";						//Array with named properties other than length

	else if (type == 'Number' && isNaN(value))
		extendedType = "NaN";
	
	else if (!(value instanceof Object))					//pseudo=constructor name if not Object
		extendedType = constructorName = type;				//e.g. Number, Boolean
	
	else if (typeof(value) == 'function' && constructorName == 'Function')							
		extendedType = value.name;
	
	else
		extendedType = constructorName;
	
	rtnValue.set('constructorName', constructorName);	
	rtnValue.set('extended', extendedType);															
															  //--------------------------------------------\\
	if (isLegacy)											 //determine which type returned based on options\\
		void(0);											//------------------------------------------------\\
															
	else if (value == null)
		type = type.toLowerCase(type);						//Undefined or Null -->	undefined or null
	
	else if (types.length === 0 || types[0] === '' || types[0] === false
	|| /(undefined|number)/i.test(typeof(types)) )
		void(0);											//return basic i.e typeof(value) -or- Window
	
	else if (types[0] !== false								
	&& /^(Array|Date|RegExp)$/.test(extendedType))			
		type = extendedType;	
	
	else if (types[0] === true || types.includes(extendedType))			
		type = extendedType;	

	return rtnValue.saveValue(type);
}
//________________________________________________________________________________________
EZ.getTypeNew.test = function()
{	
	var msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, , rtnValue];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	ex = note = undefined;
	exfn = function(results, expected, testrun)
	{
		void( [results, expected, testrun] )	//jshint
		testrun.exfnDone = true;				//don't call as legacy
		//testrun.results = results = {results: results}
		
		var exResults;
		if (ex !== undefined)
			exResults = ex;
		else
		{
		 	exResults = EZ.toArray(testrun.args[1], ', ').slice();
		}
		if (note !== undefined)
			
		ex = note = undefined;
		return exResults;
	}
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	notefn = function(testrun, phase)
	{
		void( [testrun] )	//jshint
		switch (phase)
		{
			case 'prerun': 	//disabled
			{
				break;
			}
			case 'final': 	
			{
				if (typeof(testrun.actual.results) == 'object')
				{
					testrun.info.push('legacy not same as new'.wrap('<em>'));
					if (testrun.okChecked === true)
						testrun.okChecked = 'some';
				//testrun.note += (note || '');
				}
				break;
			}
		}	
	}
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//EZ.test.skip(999)		//count to skip 
	//EZ.test.settings({group: 'persistant note'});
	//EZ.test.run(-2, 		{EZ: {ex:-2	,	note:note	}})
	//_______________________________________________________________________________________
	
	//EZ.test.settings( {exfn:exfn} )				//exfn called if EZ.test.options() not called
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	//______________________________________________________________________________
	note = ''
	//EZ.test.run.legacy = false;	
	//EZ.test.settings({group: 'legacy: ' + EZ.test.run.legacy + ' (legacy issues)'});
	EZ.test.settings({group: ' (legacy issues)', notefn:notefn});
	
	//EZ.global.legacy.EZgetType = false;
	//var opts = {types:true, legacy:false}

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	obj = EZ.options();
	EZ.test.run(obj);
	EZ.test.run(obj, true);
	EZ.test.run(EZ.options);	
	EZ.test.run(EZ.options,true);	
	
	obj = new Date('01/01/2016')
	EZ.test.run(obj, true);

	//______________________________________________________________________________
	//EZ.test.settings({group: 'legacy: ' + EZ.test.run.legacy, exfn:notefn});
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	EZ.test.settings({group:'Boolean, Function, Number, String, Object, Null, Undefined'});	
	
	EZ.test.run(true)
	EZ.test.run(true, undefined)
	EZ.test.run(true, null)
	EZ.test.run(true, '')
	EZ.test.run(true, NaN)
	EZ.test.run(true, "NaN")
	EZ.test.run(true, [NaN])
	EZ.test.run(true, ["NaN"])
	EZ.test.run(true, true)
	EZ.test.run(true, false)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	fn = function myfn() {}
	EZ.test.run(fn)
	EZ.test.run(fn		, undefined)
	EZ.test.run(fn		, null)
	EZ.test.run(fn		, '')
	EZ.test.run(fn		, NaN)
	EZ.test.run(fn		, "NaN")
	EZ.test.run(fn		, [NaN])
	EZ.test.run(fn		, ["NaN"])
	EZ.test.run(fn		, true)
	EZ.test.run(fn		, false)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .	
	EZ.test.run(1)
	EZ.test.run(1		, undefined)
	EZ.test.run(1		, null)
	EZ.test.run(1		, '')
	EZ.test.run(1		, NaN)
	EZ.test.run(1		, "NaN")
	EZ.test.run(1		, [NaN])
	EZ.test.run(1		, ["NaN"])
	EZ.test.run(1		, true)
	EZ.test.run(1		, false)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	EZ.test.run('')
	EZ.test.run(''		, undefined)
	EZ.test.run(''		, null)
	EZ.test.run(''		, '')
	EZ.test.run(''		, NaN)
	EZ.test.run(''		, "NaN")
	EZ.test.run(''		, [NaN])
	EZ.test.run(''		, ["NaN"])
	EZ.test.run(''		, true)
	EZ.test.run(''		, false)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	EZ.test.run({})
	EZ.test.run({}		, undefined)
	EZ.test.run({}		, null)
	EZ.test.run({}		, '')
	EZ.test.run({}		, NaN)
	EZ.test.run({}		, "NaN")
	EZ.test.run({}		, [NaN])
	EZ.test.run({}		, ["NaN"])
	EZ.test.run({}		, true)
	EZ.test.run({}		, false)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	EZ.test.run(null)
	EZ.test.run(null	, undefined)
	EZ.test.run(null	, null)
	EZ.test.run(null	, '')
	EZ.test.run(null	, NaN)
	EZ.test.run(null	, "NaN")
	EZ.test.run(null	, [NaN])
	EZ.test.run(null	, ["NaN"])
	EZ.test.run(null	, true)
	EZ.test.run(null	, false)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	EZ.test.run(undefined)
	EZ.test.run(undefined	, undefined)
	EZ.test.run(undefined	, null)
	EZ.test.run(undefined	, '')
	EZ.test.run(undefined	, NaN)
	EZ.test.run(undefined	, "NaN")
	EZ.test.run(undefined	, [NaN])
	EZ.test.run(undefined	, ["NaN"])
	EZ.test.run(undefined	, true)
	EZ.test.run(undefined	, false)
/*	
	//______________________________________________________________________________
	//"Array", "Date", "RegExp", "NaN", "Arguments", "Window"
	EZ.test.run([])
	EZ.test.run([]	, undefined)
	EZ.test.run([]	, null)
	EZ.test.run([]	, '')
	EZ.test.run([]	, NaN)
	EZ.test.run([]	, "NaN")
	EZ.test.run([]	, [NaN])
	EZ.test.run([]	, ["NaN"])
	EZ.test.run([]	, true)
	EZ.test.run([]	, false)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	arg = new Date('06/13/2016');
	EZ.test.run(arg)
	EZ.test.run(arg	, undefined)
	EZ.test.run(arg	, null)
	EZ.test.run(arg	, '')
	EZ.test.run(arg	, NaN)
	EZ.test.run(arg	, "NaN")
	EZ.test.run(arg	, [NaN])
	EZ.test.run(arg	, ["NaN"])
	EZ.test.run(arg	, true)
	EZ.test.run(arg	, false)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	arg = /patteern/;
	EZ.test.run(arg)
	EZ.test.run(arg	, undefined)
	EZ.test.run(arg	, null)
	EZ.test.run(arg	, '')
	EZ.test.run(arg	, NaN)
	EZ.test.run(arg	, "NaN")
	EZ.test.run(arg	, [NaN])
	EZ.test.run(arg	, ["NaN"])
	EZ.test.run(arg	, true)
	EZ.test.run(arg	, false)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	arg = NaN;
	EZ.test.run(NaN)
	EZ.test.run(arg	, undefined)
	EZ.test.run(arg	, null)
	EZ.test.run(arg	, '')
	EZ.test.run(arg	, NaN)
	EZ.test.run(arg	, "NaN")
	EZ.test.run(arg	, [NaN])
	EZ.test.run(arg	, ["NaN"])
	EZ.test.run(arg	, true)
	EZ.test.run(arg	, false)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	obj = {'0':'ArrayLike', length:1}
	EZ.test.run(obj)
	EZ.test.run(obj	, undefined)
	EZ.test.run(obj	, null)
	EZ.test.run(obj	, '')
	EZ.test.run(obj	, NaN)
	EZ.test.run(obj	, "ArrayLike")
	EZ.test.run(obj	, [NaN])
	EZ.test.run(obj	, ["ArrayLike"])
	EZ.test.run(obj	, true)
	EZ.test.run(obj	, false)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	arg = [1,2,'abc'];
	arg.hi = 'xyz';
	EZ.test.run(arg)
	EZ.test.run(arg	, undefined)
	EZ.test.run(arg	, null)
	EZ.test.run(arg	, '')
	EZ.test.run(arg	, NaN)
	EZ.test.run(arg	, "ObjectLike")
	EZ.test.run(arg	, [NaN])
	EZ.test.run(arg	, ["ObjectLike"])
	EZ.test.run(arg	, true)
	EZ.test.run(arg	, false)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	arg = document.createElement('div')
	//EZ.test.run(arg)		//test assistant issue

	
	//______________________________________________________________________________
	arg = arguments;		//not found
	arg = window;			//test assistant issue
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
*/	
}
