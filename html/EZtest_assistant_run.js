/*global
setup:true,
	setupTestScriptFinish,
	disableOption,
	EZcommentStripper,

	getType,
	loadOptions, updateOptions, updateEval, 
	getTestResults, getExpected, setOverride, 
	toggleScroll, createLastRun,
	setOnlyList, displayCaptureCounts,
	processClick, getFieldValues,
	setAction,
	debugSave,
	saveData, saveLastRun,
	positionRightFlags, updateExpandAll, starburst, addInfo,

loadLastRun,
loadCache,
loadTestScript,
suggTestOptions,
loadTestResults,
getTestResultsFile,
resetTests,
loadTestOptions, setOnlyList,
saveOptions, saveTestOptions,
bindOverride,

	AllowClipboard,
	EZ, e:true, g, dw, DWfile
*/
var e;
(function jshint_globals_not_used() {	//global variables and functions defined but not used
e = [
quit, displayCaptureCounts, AllowClipboard,
setupTestScript, 
setTestStyles, updateTestStyles, ready, 
getFieldValues,
e, g, dw, DWfile]})
/*--------------------------------------------------------------------------------------------------
called by test script dropdown if selection needed, setupTestScript() if not autorun 
-or- updateScrollBars() when done (after test run)
--------------------------------------------------------------------------------------------------*/
function ready(msg)
{
	if (EZ.test.data.variants && EZ.test.data.variants.getState() == 'prescan')
		return setupTestScriptFinish();
	
	EZ.test.message('ready', msg);
	EZ.test.app.state = 'ready';
	
	EZ.dataFile.saveAll(msg);
	
	if (g.firstRun && 'EZ.test.app.reloadOptions'.ov())
	{										//development convenience
		var openPopup = 'EZ.test.app.reloadOptions.openPopup'.ov();
		EZ.toArray(openPopup, ',').forEach(function(popup)
		{
			EZ.popup.show(popup);					
		});
		if (openPopup = 'EZ.test.app.reloadOptions.tooltip'.ov())
		{
			var el = EZ(openPopup);
			EZ.popup.tooltipOpenClick = el;
			el = EZ.getAncestor(el, 'tooltip', null);
			EZ.addClass(el, 'hover');
		}
	}
	if (g.firstRunTests)
	{
		g.firstRunTests = false;
		updateExpandAll();
		
		if (!EZ('scrollbarShow').checked 
		&& 'EZ.test.data.scroll.counts.all'.ov(0) > 0)
			starburst('expandCollapseWrap');
			
		EZ.setTimeout(saveLastRun, 1000);
	}	

	EZ.removeClass('dataBody','dim');	
	EZ.removeClass('body', 'notSetup');
	
	if (g.firstRun)
	{
		g.firstRun = false;
		setTimeout(function()
		{
			saveData('options', 'loaded');		//save updated defaults or testOptions values
		}, 2000);
		return;
	}
	if (!EZ.debug.isSaveSuspended())
		saveData();
		//EZ.setTimeout(saveData, 5000);
		//setTimeout(saveData, 5000);
												//make sure body has focus -- element after #data was
												//...getting focus on rerun after debugger breakpoint
	setTimeout("document.activeElement.blur()", 500);
}
/*--------------------------------------------------------------------------------------------------
save all updated data or reload page if options
reset default values if options.includes('reset') -- can be resetAll or resetTest
-OR- reset default button
--------------------------------------------------------------------------------------------------*/
function quit(options)
{
	options = options || '';
	var state = EZ.test.app.state;

	//var canSave = (state == 'ready');			//false if javascript error
	
	quit.reload = false;
	if (options.includes('reload') || options.includes('reset'))
	{
		quit.reload = true;
		state = EZ.test.app.state = 'reload';
	}
	try
	{
		if (quit.ignore) 		
			return console.log('quit.ignore in quit -- should not get here');

		var json, reloadOptions;
		if (options)
		{
			//if (!options.includes('ready') && state == 'reload')
			if (quit.reload)
			{
				if (!quit.reloadOptions)
				{
					quit.reloadOptions = true;
					//=============================================================================
					var openPopup = [];
					var tags = (EZ.popup && EZ.popup.tags && EZ.popup.tags && EZ.popup.tags) || [];
					tags.forEach(function(el) { if (el.id) openPopup.push(el.id) });
					
					var el = EZ.popup && EZ.popup.tooltipOpenClick;
					var tooltip = (el instanceof Element && el.isVisible && el.isVisible()) ? el.id : '';
					
					reloadOptions = {		//before any other functions called
						openPopup: openPopup.join(','),
						tooltip: tooltip,
						options: options,
						state: state,
						//files: EZ.test.app.updateTimes,
						key: g.projectName + '.reload',
						timestamp: new Date() + ''
					}
					json = JSON.stringify(reloadOptions);
					localStorage.setItem(reloadOptions.key, json)
					//=============================================================================
					EZ.log.call('saveData','reloadOptions = ' + json);
				}
				if (state == 'quit' && !quit.onbeforeunload)
				{
					var el = EZ(['reload',  'reloadOptions'], false);
					if (EZ.message.wait('reloading page', el, this)) 
						return;
				}
			}
		}
		if (options.includes('resetTestOptions'))
			saveTestOptions('reset');
		
		else if (options.includes('reset'))
		{
			saveTestOptions('reset');
			saveOptions('resetAll');
		}
		else if (options.includes('reload'))	//save button code but options="reload" (not "debug")
		{
			
			var savelog = debugSave(null, 'reload');		
			if (reloadOptions)
			{
				reloadOptions.savelog = savelog;
				json = JSON.stringify(reloadOptions);
				localStorage.setItem(reloadOptions.key, json)
			}
		}
		else									//got over-teched when issue was really autocomplete
		{
		//	EZ.timer().reset();
			EZ.log.call('saveData', 'quit()  state:', state, '  options:', options);
			saveData(state);
		}
		//-----------------------------------------------------------------------------------
		// reload if requested
		//-----------------------------------------------------------------------------------
		/*
		EZ.displayMessage('saving options . . .');
		EZ.addClass('body','reloading')
		EZ.set('runTime', 'closing...');
		EZ.show(EZ.el);
		*/
		if (options)
		{
			quit.ignore = true;
			['.times', '.ready'].forEach(function(key)
			{
				//===========================================
				localStorage.removeItem(g.projectName + key);
				//===========================================
			});
			if (!quit.onbeforeunload)
				location.reload(true);
		}
	}
	catch (e)
	{
		//console.log(e);
		//if (!reloadOptions)
			EZ.oops(e.message);
		//else
		{
			//=============================================================================
			//reloadOptions.error = e;					//update if exception during quit
			//localStorage.setItem(g.projectName + '.reload', JSON.stringify(reloadOptions))
			//=============================================================================
		}
	}
}

//_________________________________________________________________________________________________
EZ.options.set('todo.folder', EZ.test.config.testdataFolder);

/*--------------------------------------------------------------------------------------------------
Called by page onload handler
--------------------------------------------------------------------------------------------------*/
setup = function _____SETUP_____()
{
	//event bubble vs capture -- https://jsfiddle.net/keysotis/3tkbd720/	
	/*
	Element.prototype.onEnter = function() {};
	Element.prototype.keyPress = function(evt) 
	{
		if (!evt.enter) return;
		var el = evt.srcElement;
		var rtn = el.onEnter.call(el, evt);
		if (rtn === false)
			evt.stopPropagation();
	}
	*/

	EZ.test.app = {
		files: {},
		updated:{}, 
		updatedTimes:{}
	};

	EZ.timer().open(g.projectName);		//displays log started before page reloaded
	EZ.timer().add('reload page');
										//	EZ.test.app.state:		consoladate many legacy globals
	EZ.test.app.state = 'setup';		//	=setup 	 -- setup not complete
										//  =mru	 -- processing test script dropdowns
	g.firstRun = true;					//	=script  -- test script loaded if MRU test function known
										//	=autorun -- script running if last test known and autorun set
	//g.firstRun set to false			//	=ready   -- waiting for user action
										//	=running -- script running after user selects and starts
										//	=rerun	 -- single test being rerun
										//	=quit    -- saving options before leaving page or reloading
	g.firstRunTests = false;
	g.cs = new EZcommentStripper();	
	
	EZ.addClass('body', 'live');
	EZ.removeClass('body', ['designView', 'loading', 'simulatorBodyzzz']);

	g.configPath = EZ.simulator.configPath;
	suggTestOptions('setup');
	//g.testMarkers = EZgetPref(EZ.pref.testMarkers);
	//if (!EZ.isArray(g.testMarkers)) g.testMarkers = [];

	//loadMRU();
	//loadOptions(['.opt', '.testOpt', '.mru']);		
	loadOptions(['.opt', '.testOpt']);					//sets field values to saved settings
	EZ.run(updateOptions);								//sets g.displayOptions

														//run class=onLoadEvent setup events
	EZ.test.app.onLoadEvent = EZ.event.trigger(['onLoadEvent']);	
	if (EZ.get('debugLog'))
	{
		EZ.log.setActive(true);							//activate log and show any queued messages
		setAction('onload');
	}
	EZ.log.call(loadOptions, 'onLoadEvent: ',EZ.test.app.onLoadEvent.length);
	EZ.timer('events', true)
	
	g.todoAll = EZ('todoGroup').cloneNode(true);		//create general todo tags
	EZ('todoAll').appendChild(g.todoAll);
	EZ('label', g.todoAll).title = 'TODO for all tests';
	
	g.resultsTags = EZ('resultsRow', true);				//get tags cloned for each EZ.test.run() call
	g.resultsRoot = g.resultsTags[0].parentNode;
	g.resultsTags.forEach(function(tag)
	{
		g.resultsRoot.removeChild(tag);
	});

	//location.hash = '';
	if (g.message)
		EZ.displayMessage(g.message);

	//EZ.test.capture.mode = EZget('captureMode');
	EZ.test.capture.mode = false;
	//EZ.capture.display('setup');
	
	//---------------------------------------------------------------------------------------------	
	// reload -- saved data integrity
	//---------------------------------------------------------------------------------------------	
	EZ.test.app.reloadOk = true;	
	EZ.test.app.updatedTimes = EZ.store.get('updatedTimes') || [];
	var loadedTime = EZ.test.app.loadedTime = EZ.store.get('loaded');
	while (loadedTime)										//if loadedTime must have .reload and .times
	{												
		EZ.test.app.reloadOk = false;
		var reloadOpts = EZ.test.app.reloadOptions = EZ.store.get('reload');
		if (!reloadOpts) break;		
		try
		{
			//reloadOpts = EZ.test.app.reloadOptions = JSON.parse(reloadOpts);
			if (reloadOpts && reloadOpts.savelog)
				console.log('savelog', {details: reloadOpts.savelog})
		}
		catch (e)
		{
			break;
		}
		var reloadTime = EZ.format.dateTime(reloadOpts.timestamp);
		if (EZ.getTime(reloadTime) < EZ.getTime(loadedTime))
			break;

		//if (EZ.getTime(times.timestamp) < EZ.getTime(loadedTime))
		
		EZ.test.app.reloadOk = true;				
		break;
	}
	if (!EZ.test.app.reloadOk)
		disableOption('autorun');
	EZ.store.set('loaded', EZ.format.dateTime());		//update loadedTime

	//---------------------------------------------------------------------------------------------	
	// setup event handlers
	//---------------------------------------------------------------------------------------------	
	EZ.event.createTransitionEvents();					//used for tooltip css effects
	document.body.addEventListener('transition-end', processClick);
	document.body.addEventListener('transition-start', processClick);
	/*
	*/
	EZ.event.add('form', 'onclick', function cancelSubmit(evt)
	{												//cancel submit from image button click
		var el = evt.srcElement;
		if (el.tagName == 'INPUT' && el.type == 'image')
		{
			setAction('onSubmit canceled', el);			

			EZ.event.cancel(evt, true);
			document.body.focus();
		}
	});

	EZ.event.add(window, 'resize', function()
	{
		EZ.setTimeout(positionRightFlags, 500);
	});
													//-----------------------\\
	window.onbeforeunload = function()				// onunload event handler \\		  
	{ 												//-------------------------\\ 
		if (!quit.ignore)							
		{											
			console.log('quit called from onbeforeunload');
			quit.onbeforeunload = true;				//was not working when coding stackLink	
			quit('reload');							//...maybe ok just wrong state
		}
		else
			console.log('quit.ignore in onbeforeunload');
	}

		
	var save = EZ.get('saveOptionsOnChange');
	EZ.addClass('messageWrap', save);				//----------------------------------\\	
	if (save != 'button')							// saveData() now or after user idle \\
	{												//------------------------------------\\
		var evts = EZ.event.userEvents.remove('mousemove')	
		EZ.event.add(window, evts, function(evt,phase)		
		{	
		//	evalResults.value += '.';
		//	if (EZ.activeElement != document.activeElement)
		//		console.log('document.activeElement', EZ.format.time('ms'), document.activeElement+'')
		//	EZ.activeElement = document.activeElement;
			
			var action = (phase == 'start') ? 'suspend' : 'resume';
			if (!EZ.debug.isSaveSuspended())
				saveData(action , 'userActions');
			//console.log('userActions', phase, evt);
		}, -2000, 'both');
	}
	else EZ.el.title = 'save button may be required';
	
	
	//---------------------------------------------------------------------------------------------	
	// setup finish
	//---------------------------------------------------------------------------------------------	
	EZ.test.setGlobalTestData();						//init shared global test variables
	
	EZ.test.mruTests();									//update test script dropdowns 
}														
//_________________________________________________________________________________________________
e = function _____SETUP_TEST_SCRIPT_____() {}	//convenience for DW functions list
//_________________________________________________________________________________________________

/*-------------------------------------------------------------------------------------------------
Validate and setup specified test script.

If called after page 1st loaded (el null), call EZ.test.runTestScript() if autorun checked, 
otherwise show blinking "runs tests" button.

	if (!cache.filename)
		return EZ.queue(folderSelected);
EZ.set('fnStatement')
EZ.test.data.fnStatement.replace(/\s+/g, '')		
-------------------------------------------------------------------------------------------------*/
function setupTestScript(funcName, scriptData)
{
	var url = scriptData.url
	resetTests();
	//var funcName = EZ.get('functionList');
	
	EZ.trace('@');
	EZ.options.set('trace.name', 'EZtest_assistant::' + funcName);

	var data = EZ.test.data = {
		funcName: funcName,
		url: url, 
		scriptData: scriptData,
		testrun:[] 
	};
	
	if (EZ.test.app.state == 'mru') 
	{
		EZ.timer();
		EZ.addClass( EZ('useCache').parentElement, 'highlight', false);
	}
	else
	{
		EZ.test.app.state = 'script';
		while (EZ.get('useCache'))
		{
			var cache = EZ.test.app.cache = loadCache();
			
			if (new Date(cache.cacheExpiredTime).getTime() < new Date().getTime())
				break;							//cache expired
			
			if (cache.testOptions)
				data.options = EZ.clone(cache.options);
			
			if (cache.savedResults)
				EZ.savedResults = EZ.clone(cache.options);
						
			break;
			/*			
			if (!cache.testdata) break;

			if (!cache.testdata)
			{
				EZ.addClass( EZ('useCache').parentElement, 'dim');
				break;							//no cached testdata or cache disabled
			}
							
			var funcUrl = EZ.test.app.savedFile.url;
			if (cache.filenameTimestamp != (new Date(DWfile.getModificationDate(funcUrl))+''))
				break;							//test fn file changed
			
			var timestamp = getTestResultsFile('script').timestamp;
			if (timestamp != cache.scriptTimestamp)
				break;							//external test script file changed
			
			data = EZ.test.data = EZ.clone(cache.testdata);
			data.useCache = true;
			*/
		}
	}
	EZ.test.app.cache = EZ.test.app.cache || {};

	  //--------------------------------\\
	 //----- test script validation -----\\
	//------------------------------------\\
	var testScript = '';
	data.testScriptFuncName = funcName + '.test';
	if (url.endsWith('.SCRIPS.js'))				
	{													//external test script
		data.lineno = 1;						
		var url = 'EZ.test.app.files.scriptFile.url'.ov();
//		if (!url)
			url = getTestResultsFile('script', funcName).url;

		var testScript = DWfile.read(url);
		if (!testScript)
			return ready('script file empty or corrupt<br>' + url.replace(/\//g, '\\'));
		
														//TODO: only works for: EZ.stringify.test = function...
		var regex = RegExp("([\\s\\S]*?" + data.testScriptFuncName + "[\\s\\S]*?)(function)(.*)","")
		var results = testScript.match(regex);
		if (!results)
			return ready('test script: "' + data.testScriptFuncName + '()" not found in:<p>' + url);
		
		var offset = results[1].length;
		data.lineno = EZ.getLineCount(testScript.substr(0,offset)) + 1;		
		testScript = testScript.substr(offset);
		
		eval('EZ.test.testScript=' + testScript);
	}
	else												//embedded test script
	{
		EZ.test.testScript = EZ.test.data.testScriptFuncName.ov();
		if (!EZ.test.testScript)
			return ready('test script: "' + data.testScriptFuncName + '()" not found');
		if (typeof(EZ.test.testScript) != 'function')
			return ready('test script: "' + data.testScriptFuncName + '()" not function');
		
		/*
		EZ.test.testScript = eval(data.testScriptFuncName);
		if (!EZ.test.testScript)
			return ready('test script: "' + data.testScriptFuncName + '()" not found');

		*/
		testScript = EZ.test.testScript.toString();
		data.lineno = _getLineno(url, funcName);
	}
	displayTestNotes(testScript);

	funcName = funcName.split('.');
	var offset = funcName.indexOf('prototype')
	data.funcProtoName = offset > 0						//name(s) after *.prototype.
					   ? funcName.slice(offset+1).join('.')
					   : '';
	data.funcProtoType = funcName[0];
	if (funcName[1] != 'prototype')
		data.funcProtoType = funcName.slice(0,-1).join('.').ov();
	funcName = funcName.join('.');						//full function name

	EZ.test.fn = funcName.ov();							//does function exists? -- i.e. window[funcName]
	if (!EZ.test.fn)
		return ready('test function: "' + funcName + '" not found');
	else if (typeof(EZ.test.fn) != 'function')
		return ready('test function: "' + funcName + '" not function');

	//______________________________________________________________________________________________
	/**
	 *	return list of all embedded function names
	**/
	var getInnerFnNames = function(fn, nameList)
	{
		nameList = nameList || [];
		for (var p in fn)
		{
			if (typeof(fn[p]) != 'function') continue;
			nameList.push(fn[p].name)
			getInnerFnNames(fn[p], nameList);
		}
	}
	data.funcInnerFnNames = getInnerFnNames(EZ.test.fn);
	
	if (typeof(EZ.test.fn.testing) == 'function')		//pseudo prototype -- backward compatibility
	{													//...superceeded by EZ.test.run.call(innerFn, ...
		data.funcProtoName = funcName;					
		data.funcProtoType = 'Function';
		data.funcProtoFake = true;
	}
	
	data.funcNameShort = data.funcProtoName || funcName;
	data.funcNameReal = EZ.test.fn.name;				//function statement name
	if (!data.funcNameReal)								
	{													//if anounmous fn -- TODO: not tested
		var displayName = data.funcNameShort;
		if (!displayName.includes('EZ') && funcName.includes('EZ'))
			displayName = '' + displayName;
		data.funcNameReal = EZ.test.fn.displayName = displayName;
	}
	
	testScript = g.cs.strip(testScript); 				//strip comments -- get offset to 1st test call
	//data.baseOffset = testScript.search(/^\s*EZ.test.run/m);
	data.baseOffset = testScript.search(/EZ.test.run/);
	 
	//var endOffset = testScript.substr(data.baseOffset).search(/^\s*return/m)	
														//offset to "//:quit" or end-of-script
	var endOffset = testScript.substr(data.baseOffset).search(/EZ\.test\.quit/);
	var baseScript = testScript.substr(data.baseOffset, endOffset != -1 ? endOffset : testScript.length);

//	var pattern = /(EZ.test.run\s*\(\s*)(.*)(?=,\s*\{EZ|\))/g;
	var pattern = /EZ.test.run(.call)?\s*\(\s*(.*)(?=,\s*\{EZ|\))/g;
	data.testCalls = baseScript.matchPlus(pattern);		//get all test calls in between
	
	EZ.removeClass('body', 'noTestScript');
	//==========================
	EZ.queue(parseTestScript);							 //parse script in background
	//==========================
	//______________________________________________________________________________________________
	/**
	 *	currently always re-calculates function lineno
	 *	TODO: use saved lineno if current
	 */
	function _getLineno(url, functionName)
	{
		var lineno = 1;
		var script = EZ.file.read(url);		
		if (script)
		{
			var regex = RegExp(functionName + '.test');
			var results = script.match(regex);
			if (results)
				lineno = EZ.getLineCount(script.substr(0,results.index)) + 1;
			else 
				addInfo('could NOT determine starting lineno', 'highlight');
		}
		return lineno;
	}
}		
//______________________________________________________________________________________________
/**
 *
 */
function displayTestNotes(testScript)
{
	var msg = ''
	if (testScript)
	{
		var results = testScript.match(/\/\*\s*NOTES:\s*?\n([\s\S]*?)\n\s*\*\//) || ['',''];
		msg = results[1].replace(/\n\s*?\n/g, '<p>');
		msg = msg.replace(/\n\s*[.]{3}/g, '<br>' + '&nbsp;'.dup(4));
		msg = msg.replace(/\n\s*/g, '<br>');				
	}
	EZ('testScriptNotesContent').innerHTML = msg;
	EZ.addClass(['testScriptNotes', 'testInfoNotes'], 'unhide', msg);
}
//__________________________________________________________________________________
/**
 *	called at end of parseTestScript() -OR- after legacy variants found (prescan)
 */
function setupTestScriptFinish()
{
	if (EZ.test.data.variants)
		EZ.test.data.variants.setState('firstRun');
	EZ.test.data.callCount = EZ.test.data.callArgNames.length;	
	_displayTestList();

	EZ.test.mruTests.setTestCallCount(EZ.test.data.callCount, EZ.test.data.funcName);		
	
	EZ.todo(getTestResultsFile('todo').filename);
	
	//=================================================
	//EZ.test.app.cache.testdata = EZ.clone(EZ.test.data);
	//=================================================	

	
	EZ.run(loadTestOptions);
	setOnlyList();
	suggTestOptions('scriptLoaded');

EZ.run(loadTestResults, true);
loadLastRun();

	if (g.firstRun && EZ.get('autorun'))
		EZ.test.runTestScript();
	else
	{
		EZ.test.message('testScriptSetup');
		ready();
	}
	delete EZ.test.app.firstRun;

	if (EZ('functionList').options[0].value == '-')
	{
		//var str = EZ.test.testScript+'';
		//f = EZ.file(EZ.constant.configPath + EZ.get('folderList') + '/' + EZ.get('fileList'));
		//s = DWfile.read(f)
		void(0)
	}
	//EZ('data').style.opacity = '1';
	//==================
	return;
	//==================
	
	//______________________________________________________________________________________________
	/**
	 *
	 */
	function _displayTestList()
	{
		var lines = ['testno\t lineno\t call statement\t'.toUpperCase()];
		EZ.test.data.testCalls.forEach(function(stmt, idx)
		{
			stmt = stmt.replace(/\t/g, ' ').replace(/\s+/g, ' ') + ')';
			stmt = stmt.replace(/\s*,\s*\{EZ:/g, '\t EZ:');
			var testno = (idx+1) + '';
			var values = 'EZ.test.data.variants.testCalls.'.concat(testno).ov({}).values || [];
			var msg = testno.pad(-3)
					+ (values.length ? values.length.wrap('[]') : '')
					+ '\t ' + EZ.test.data.callLineno[idx]
					+ '\t ' + stmt;
			lines.push(msg);
		});
		var fmtLines = lines.format().join('\n');
		fmtLines = fmtLines.replace(/{\d+:.*/mg, '');
		var html = '<line class="bold">' + fmtLines.split('\n').join('</line>\n<line>') + '</line>';
		EZ('testlistTooltip').innerHTML = html;
	}
}
//__________________________________________________________________________________
/**
 *	init testdata for specified test script
 */
function parseTestScript()
{
	var data = EZ.test.data;
	var script = Function.prototype.toString.call(EZ.test.fn);
	var funcParts = script.matchPlus(EZ.patterns.funcParts);
	var argNames = funcParts[2].replace(/\/\*[\s\S]*?\*\//g, '');

	data.argSuffix = [];
	data.argNames = EZ.toArray(argNames, ',');
	data.fnStatement = data.funcName;
	
	if (!data.funcProtoName)
		data.fnStatement += formatArgumentNames(data.argNames);
	
	else if (data.funcProtoType == 'Function')
	{
		EZ.test.fn = EZ.test.fn.testing
		//var funcPartsFake = EZ.test.fn.toString().matchPlus(EZ.patterns.funcParts);
		//var argNamesFake = funcPartsFake[2].replace(/\/\*[\s\S]*?\*\//g, '');
		//argNamesFake + data.fnStatement.wrap('[')
		
		data.fnStatement += '( ... )';
						 //+ formatArgumentNames(data.argNames);
	}
	else 
	{
		data.fnStatement = data.funcProtoType + '.prototype' + '.' + data.funcProtoName
						 + formatArgumentNames(data.argNames);
		data.argNames.splice(0,0,'"this"');
	}
	EZ.set('fnStatement', data.fnStatement);	//#data test heading
	
												//call statement pieces for processArguments()
	data.callPrefix = [];						//call stmt upto arguments
	data.callArgNames = [];						//call stmt argument names or expression
	data.callArgTypes = [];						//call arg type: var or expression
	data.callLineno = [];
	data.callbacks = {exfn:[], notefn:[]};
	
	var testScript = g.cs.strip( EZ.test.testScript.toString() );
	var fnScript = g.cs.strip(script);
	//-------------------------------------------------------------------------------------------
	data.variants = new EZ.test.variants(fnScript, testScript);	//TODO: make EZ.test.data() class
	//-------------------------------------------------------------------------------------------
	
	var offset = 0;
	data.testCalls.forEach(function forEachTestCall(testCall,idx)
	{											//For each EZ.test.run() calls in test script
		offset = data.baseOffset + data.testCalls.start[idx];
		data.callLineno.push(data.lineno + EZ.getLineCount(testScript.substr(0,offset)));

		// get arguments inside: EZ.call.run(... upto ",{EZ...})" -or- ")"
		var callParts = testCall.matchPlus(/EZ.test.run(.call)?\s*\(\s*(.*?)\s*,?(\s*\{\s*EZ\s*:|$)/);
		var argStr = callParts[2];

		// Array of call arg variable names or blank if not variable name
		var callArgs = getCallArgNames(argStr, data.callArgNames, data.callArgTypes);

		var callStmt = data.funcName;
		if (data.funcProtoName)
			callStmt = callStmt.replace(new RegExp(data.funcProtoType+ '.prototype'), callArgs[0]);

		data.callPrefix.push(callStmt);
	})
	data.testCalls = data.testCalls.slice();	//keep results Array but delete match properties
	EZ.timer('setupTestScript', true);	
													
	EZ.run(loadTestScript);						//TODO: queue ??
	
	if (!EZ('autorun').checked && prerunTestScript(data))
		return;
	//=====================
	setupTestScriptFinish();
	//=====================
	
	//______________________________________________________________________________________
	/**	
	 *	If prerun test option is checked, test script is quickly run without calling test fn 
	 *	or even creating testrun Object for each call.
	 *
	 *	Replicates properties associated with each test function call for each variant specified
	 *	in the test script -or- legacy code if legacy option checked,
	 *
	 *	TODO:
	 *	Also identifies additional call arguments not found from static parse of EZ.test.run(...)
	 *	call statemebt.
	 */
	function prerunTestScript(data)
	{
		var count = data.callArgNames.length;		//TODO: use "prerun" and "legacy" options
		//if (count && /EZ\.test\.settings\s*\([\s\S]*\b"?legacy"?\s*:/.test(testScript))
		if (count && EZ.get('prerun'))		//!data.options.autorun && 
		{											
			EZ.test.data.variants.setState('prescan');
			EZ.test.runTestScript();
			return true;
		}
	}
	//__________________________________________________________________________________
	/**	formatArgumentNames() -- setupTestScript internal function()
	 *
	 *	format arguments with spaces before and after arguments like below:
	 *
	 *		EZ.isArray()
	 *		EZ.isArray( o, nonArrayPropertiesOk )
	 *		function EZisArray( o,  nonArrayPropertiesOk )
	 *		String.prototype.dup(count)
	 *
	 *	prefix funcName or return with "function " or "String.prototype." for above format.
	 */
	function formatArgumentNames(argNames)
	{
		if (!argNames || !argNames.length)
			return ' ( ' + EZ.test.noArguments + ' )';

		var args = argNames.join(',   ');
		if (args)
			args = ' ' + args + ' ';

		if (data.funcProtoName)
		{
			data.argSuffix.push('"this"');
		}
		argNames.forEach(function(arg,idx)
		{
			data.argSuffix.push((idx+1).suffix() + ' arg ');
		});

		return ' (<i>' + args + '</i>)';
	}
	/**	getCallArgNames() -- setupTestScript internal function()
	 *
	 *	remove quoted strings, arrays, objects, parenthises groups, booleans and numbers ideally
	 *	leaving just variable, object or function names used to qualify caller arguments.
	 *
	 *	get call argument variable names -or- expressions: abbreviate if more than N characters
	 */
	function getCallArgNames(argStr, callArgNames, callArgTypes)
	{
		var str = argStr;

		/*----- legacy code -----*/
		// remove quoted strings, [...], {...}, and (...) -- these are not variable names
		str = str.replace(/\s*(["']).*?\1\s*/g, '###');

		// remove [...], {...} and (...) -- keep looping until all
		var results;
		while (results = str.match(/([\]})])/))
		{												//get associated close ch for open
			var begChar = {']':'[', '}':'{', ')':'('}[results[1]];
			var offset = str.lastIndexOf(begChar, results.index);
			if (offset == -1) return [];				//quit if confused

			str = str.substr(0,offset) + '###' + str.substr(results.index+1);
		}

		//create array of from comma delimited arg string -- embedded commas removed above
		var args = EZ.toArray(str, ',');

		//args.forEach(function(arg,idx)
		for (var idx=0; idx<args.length; idx++)	//now discard anything not variable name
		{
			var arg = args[idx];
			if (/(null|undefined)/.test(arg)		//if null, undefined or...
			|| !/^[a-z_$@][\w$@\d]*/i.test(arg))	//...not variable, clear name
				args[idx] = '';

			else if (/(true|false)/.test(arg))		//true/false not var name
				args[idx] = '';
		}
		//return args;

		  //---------------------------\\
		 //----- new code May 2016 -----\\
		//-------------------------------\\
		var argNames = [];
		var argTypes = [];
		var regex = {
			reserved:	'null undefined true false NaN'.split(/\s+/),
			quoted: 	/(["'])(.*?)\1/g,
			varName: 	/^[a-z_$@][\w$@\d]*/i,
			fnCall: 	/^([\w$]+\s*\((.*))\)/,
			array:  	/^\[(.*)\]$/,
			object: 	/^\{(.*)\}$/,
			newObj: 	/^(new [\w$]+\s*\((.*))\)/
		}
		argStr = argStr.replace(/[\n\r]/g, ' ');

		var quoted = [];
		var escaped = argStr.replace(regex.quoted, function(all, q, str)
		{													//escape quotes
			quoted.push(all);
			return str.wrap('###');
		});

		var args = EZ.toArray(escaped, ',')
		args.forEach(function(arg)							//for each argument . . .
		{
			var unescaped = arg.replace(/###.*?###/g, function()
			{
				return quoted.shift();						//unescape quotes
			});

			var type = '';
			if (regex.reserved.includes(arg))				//reserved word
				arg = '';

			else if (regex.newObj.test(arg))				//new constructor()
			{												//including new Date()
				type = 'new';
				arg = unescaped.replace(regex.newObj, function(all,beg,body)
				{
					return (body.length < 8) ? all : beg + '...)';
				});
			}
			
			else if (regex.varName.test(arg))				//variable name
				type = 'var';

			else if (regex.array.test(arg))					//Array [...]
			{
				type = '[]';
				arg = unescaped.replace(regex.array, function(all,body)
				{
					return (body.length < 8) ? all : '[...]';
				});
			}
			else if (regex.object.test(arg))				//Object {...}
			{
				type = '{}';
				arg = unescaped.replace(regex.array, function(all,body)
				{
					return (body.length < 8) ? all : '{...}';
				});
			}
			else if (regex.fnCall.test(arg))				//function call
			{												//including Boolean()...
				type = 'fn';
				arg = unescaped.replace(regex.fnCall, function(all,beg,body)
				{
					return (body.length < 8) ? all : beg + '...)';
				});
			}
			else											//assume expression
			{												//including pattern
				type = 'exp';
				arg = '';
			}
			argNames.push(arg);
			argTypes.push(type);
		});

		callArgNames.push(argNames);
		callArgTypes.push(argTypes);
		return argNames;
	}
}		
//________________________________________________________________________________________
EZ.test.runTestScript = function _____RUN_TEST_SCRIPT_____(testKey)
{
	EZ.test.data.variants.runTestScript(testKey);
}
/*----------------------------------------------------------------------------------
Following are functions are called by test script i.e. EZ.xxx.test(...)
----------------------------------------------------------------------------------*/
//e = function _____RUN_TEST_OPTIONS_____() {}	//convenience for DW functions list
/**
 *	global test script setting for all folowing EZ.test.run(...) calls
 *
 *	optionally called at beginning of test script, applies to all following tests.
 *	cleared before test script called by runTestScript() above.
 */
EZ.test.settings = function EZtest_settings(settings)
{
	EZ.test.data.settings = EZ.test.data.settings || {};
	if (!settings) return;

	for (var p in settings)							//update any specified setting
		EZ.test.data.settings[p] = settings[p];

	  //-----------------------------------\\
	 // settings applicable to each varient \\		//TODO: don't think variants implemented
	//---------------------------------------\\
	if ('exFrom' in settings)
		EZ.test.data.exFrom = settings.exFrom;
}
//________________________________________________________________________________________
/**
 *	Single EZ.test.run(...) call options
 *
 *	called by test script before each EZ.test.run() with Object containing one or more of
 *	the folowwing test options of the form:
 *
 *			{ctx:..., ex:..., fn:..., note:...)
 *
 *	ex		expected return results from function call with supplied arguments
 *	exfn	function called after return from tested function
 *	ctx		expected return value of prototype context e.g. String or Array
 *	note	String containing note displayed with test results
 *			can be function in test script called when displaying note
 *	notefn
 *
 *	Prior to 12-2015, these options were passed as last argument of EZ.test.run(...)
 */
EZ.test.options = EZ.test.results = function EZtest_options(obj)
{
	EZ.testOptions = {
		note: 'EZ.test.options() must be called with Object of the form:\n'
			+ '\t{ctx:..., ex:..., exfn:..., note:...}\n'
	};
	if (obj && typeof(obj) == 'object')
		EZ.testOptions = obj;
}
//________________________________________________________________________________________
/**
 *	return true if debugger option checked and the caller is function being tested.
 *	otherwise returns false;
 *
 *	Supports following added at top of many functions to optionlly capture live data
 *	and/or pause in debugger when called by test script via EZ.test.run()
 *
 *	if (EZ.test.capture()) {return EZ.test.capture(this)} else if (EZ.test.debug()) debugger;
	return EZ.test.debug
		   && 'object function'.indexOf(typeof EZ.test.debug) != -1
	       && EZ.test.debug['.callee.caller.name'.ov(arguments,'no caller name')];
 */
EZ.test.debug = function EZtestDebug(callerName)
{
	var rtnValue = EZ.test.debugList instanceof Object;
	if (rtnValue)
	{
		callerName = callerName || '.callee.caller.name'.ov(arguments,'no caller name');
		rtnValue = callerName in EZ.test.debugList;
	}
	return rtnValue;
}
//________________________________________________________________________________________
/**
 *	return true if caller is testFn and called by test sccript.
 *	does not require test fn to use EZ.returnValue()
 */
EZ.test.isTestFunction = EZ.test.isTest = function _____EZtest_isTestFunction(caller)
{
	var testName = 'EZ.test.running'.ov();
	if (!testName) return false;
	
	caller = caller || arguments.callee.caller;
	var callerName = caller.name || caller.displayName;
	return (testName == callerName);
}
//________________________________________________________________________________________
/**
 *	return testrun Object if called from function being tested otherwise undefined
 *	does not require test fn to use EZ.returnValue()
 */
EZ.test.getTestrun = function EZtest_getTestrun(caller)
{
	if (EZ.test && EZ.test.running && EZ.test.run && EZ.test.run.testrun)
	{ 
		caller = caller || arguments.callee.caller;
		if (EZ.test.isTestFunction(caller))
			return EZ.test.run.testrun;
	}
}
//________________________________________________________________________________________
/**
 *	return test script value if called from function being tested otherwise undefined
 */
EZ.test.getTestValue = function EZtest_getTestValue(key, defaultValue)
{
	var testrun;
	if (this.constructor == EZ.test.testrun)
		 testrun = this;
	else
	{
		var caller = (this != window && this != EZ && this != EZ.test) ? this 
				   : arguments.callee.caller;
		testrun = EZ.test.getTestrun(caller);
	}
	if (testrun)
		return testrun.getTestValue(key, defaultValue);
}
//________________________________________________________________________________________
/**
 *	sets test script value if called from function being tested.
 *	NOT sure is used or needed -- REVIEW use of EZ.test.running
 */
EZ.test.setTestValue = function EZtest_setTestValue_REVIEW(key, value)
{
	var testrun;
	if (this.constructor == EZ.test.testrun)
		 testrun = this;
	
	else if (EZ.test && EZ.test.running && EZ.test.run && EZ.test.run.testrun)
	{
		var caller = (this != window && this != EZ && this != EZ.test) ? this 
				   : arguments.callee.caller;
		testrun = EZ.test.getTestrun(caller);
	}
	if (testrun)
		testrun.setTestValue(key, value);
}
//________________________________________________________________________________________
/**
 *	only run tests specified as Array or comma/space delimited String
 */
EZ.test.only = function EZtest_only(value)
{
	setOnlyList('testOnlyList', value);
}
//________________________________________________________________________________________
/**
 *	skip next count tests or next if count not supplied -- resumes tests for count of 0
 */
EZ.test.skip = function EZtest_skip(value)
{
	setOnlyList('testSkipList', value);
}
//________________________________________________________________________________________
/**
 *	called by tested fn to add note displayed under note column
 *	ignored unless called by tested fn -- note arg can be any type of variable
 */
EZ.test.note = function EZtest_note(note)
{
	return EZ.oops('depricated -- note: ' + note) || note;
	/*	
	if (EZ.test.data.testFunc == EZ.getCallerName())
	{
//		var testrun = EZ.test.data.testrun[EZ.test.testno-1];
		var testrun = EZ.test.getTest(EZ.test.testno);
		testrun.testNote = note;
	}
	return note;			//return note as caller convenience when callled with object
	*/
}
/*---------------------------------------------------------------------------------------------
return cloned Object using function selected on debug settings popup
---------------------------------------------------------------------------------------------*/
EZ.test.cloneHow = function ___EZtest___cloneHow(obj, name, maxdepth)
{	
	var idx, className, cloneOpts, rtnValue;
	if (this.setClonedValue && isNaN(maxdepth))
	{
		idx = name;
		className = maxdepth || '';
		name += className.wrap('[]')
	}

	var testrun;	
	if ( !(obj instanceof Object) )
	{
		if (testrun)
			testrun.setClonedValue(idx,className,true);
		return obj;
	}

	var msg = '';
	var clone = obj;
	var cloneHow = EZ.test.app.cloneHow || '';
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
			cloneOpts = {maxdepth:maxdepth || 9};
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
	while (msg && testrun)
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
/*---------------------------------------------------------------------------------------------
return cloned Object using function selected on debug settings popup
---------------------------------------------------------------------------------------------*/
EZ.test.stringifyHow = function ___EZtest___stringifyHow(obj, name)
{
	var me = EZ.test.stringifyHow;
	me.rtnValue = '';
	var savedResults = obj;
	
	var json, errorNote, rtnValue;
	try
	{
		var saveWith = EZ.test.app.jsonHow || '';
		var saveOpts = EZ.test.app.jsonHowOpts || '';
		saveOpts = EZ.options.call(saveOpts);
		
		obj.jsonVersion = (saveWith || 'na') + ' options=';
		
		if (saveWith == 'jsonPlus')
		{
			var plusOpts = {
				validate:true, unquoteKeys:true, 
				ignore:'none'
			}
			obj.jsonVersion += JSON.stringify(plusOpts);
			
			json = JSON.plus.stringify(savedResults, plusOpts, 4);
			rtnValue = JSON.plus.stringify.rtnValue;
			
			if (!rtnValue.isOk())
				me.rtnValue = rtnValue;
		}
		else if (saveWith == 'jsonPlusV3')
		{
			var jsonOpts = {
				validate:true, unquoteKeys:true, name:name,
				ignore: EZ.get('objectTypeIgnore') ? 'constructor' : '',
				exclude: 'Function'
			}
			jsonOpts = EZ.options.call(jsonOpts, saveOpts);
			obj.jsonVersion += JSON.stringify(jsonOpts);
			
			rtnValue = new EZ.jsonPlusV3.stringify(savedResults, jsonOpts, 4);
			if (!rtnValue.isOk())
				me.rtnValue = rtnValue;
			
			json = rtnValue.getValue();
		}
		else	//EZ.stringify
		{
			obj.jsonVersion += JSON.stringify(saveOpts);
			json = EZ.stringify(savedResults, saveOpts, 4);
			json = json.replace(/(\n)\s*(\])$/, '$1$2');
			json = json.replace(/(no data", )/g, '$1\n    ');
			//////////////////////////////////////////////////////////////////////////////////////			
		//	EZ.test.savedResultsUpdated = savedResults;			//cheap validation if no exception
			errorNote = ' invalid json';						//message if eval exception
			var o = eval('e=' + json);							//updates EZ.test.savedResults
			errorNote = ''										//...clear message 		
			///////////////////////////////////////////			
			var isEqual = EZ.isEqual(o, obj, {showDiff:99, ignore:'objectType', exclude:'jsonVersion'} )
			if (!isEqual)
				EZ.oops('Object from EZ.stringify() != input obj',  EZ.equals.formattedLog);
			//////////////////////////////////////////////////////////////////////////////////////			
		}
	}
	catch (e)
	{
		EZ.oops(errorNote, {detail:json, error:e+''});
		addInfo(me.name + (name || '').wrap('[]') + ': ' + errorNote, 'stackTrace');
		return;
	}
	return json;
}
/*---------------------------------------------------------------------------------------------
testKey: Number, String, Element of vData Object
---------------------------------------------------------------------------------------------*/
EZ.test.getTest = function ___EZtest_getTest(testKey)
{
	var vData;
	if (testKey instanceof Element) 
	{
		testKey = EZ.test.getTestKey(testKey);
		if (!testKey || testKey == -1)
			return null;
	}
	else if (testKey instanceof Object) 
	{
		vData = testKey;
		testKey = vData.testKey;
	}
	var testrun = EZ.test.data.testrun[testKey];
	/*
	if (testrun) return testrun;			//if testrun found, return it
											//...otherwise search ??
	return EZ.test.data.variants.findTest(vData || testKey);
	*/
	return testrun;
}
/*---------------------------------------------------------------------------------------------
return testKey associated with el -or- false if el is not inside test data TR
---------------------------------------------------------------------------------------------*/
EZ.test.getTestKey = function ___EZtest_getTestKey(el)
{
	if (el instanceof Element === false)
		return -1;
		
	var tr = (el.tagName == 'TR') ? el :EZ.getAncestor(el,'.resultsRow', null);
	if (!tr) return -1;
	
	var testno = EZ.get( tr.EZ('.testno') );	// EZ.get( EZ('.testno', tr) );
	if (!testno) return -1;
	
	var key = EZ.get( tr.EZ('.testkey') ).trim();
	return testno + key;
}
//________________________________________________________________________________________
/**
 *	return testrun Object test is run -- i.e. not rerun test -or- testno in onlyList
 *
 *	derived testno/testKey is updated when update is true -- i.e. called from EZ.test.run()
 *	test script can call to determine if next EZ.test.run() is skipped or not (update false)
 */
EZ.test.isRun = function ___EZtest_isRun(update)	
{
	var onlyList = (EZ.test.isRerun) ? EZ.test.isRerun
									 : 'EZ.test.data.options.onlyList'.ov();
	var vData = EZ.test.data.variants.next(onlyList, update);
	return vData;		
}
//==========================================================================================
/*
*	MAIN UNIT TEST CODE -- called by test script to call test function
*
*	Calls test function, captures and displays initial call arguments and function results.
*
*	Compares results to expected results defined by test script or saved from prior run and
*	reports differences.
*
*	When testing prototype function, FIRST argument is the prototype target and required.
*
*	After test function called, restores any caller Objects if changed by test function,
**/
//==========================================================================================
EZ.test.run = (function _____RUN_SINGLE_TEST_SCRIPT_____() {
var testrun, testno, testIdx, testKey
var msg, results, rtnValue, testReturnValue;
//debugger;

var ___ = function EZtest_run() 
{
	while (true)		
	{
		testrun = EZ.test.isRun(true);
		if (!testrun) 
			return EZ.testOptions = null;			//test skipped or finding variants
		
		if (!testrun.testno) 
			return addInfo('testrun invalid: ' + EZ.stringify(testrun, '*'), 'highlight error');
		
//bindOverride(false)
		testno = testrun.testno;
		testIdx = testrun.testIdx;
		testKey = testrun.testKey;
		var args = [].slice.call(arguments);		
		
		msg = '@test #' + testKey;
		console.log(msg);	
		
		if (EZ.test.isRerun) EZ.trace('@');			//clear trace
		EZ.trace(msg + ' arguments', args)
		
		var tags = g.tags = testrun.tags;			//convenience reference
	
		if (!EZ.test.isRerun)
			EZ.addClass(tags, 'init');
		else
		{
			tags.EZ.set(['rerun'], '' + EZ.formatTime('','spaces'));
			EZ.removeClass(tags.EZ('edit', true), 'edit');
			delete testrun.edit;
	
			if (!EZ.test.data.options.markers.includes(testno))	
			{										//mark test highlighted
				EZ.addClass(tags, 'marker');
				EZ.removeClass(tags, 'dim');
				EZ.test.data.options.markers.push(testno);
			}
		}
		EZ.test.run.testrun = g.testrun = testrun;	
		EZ.test.run.options = EZ.test.run.rtnValue = null;
									
		delete testrun.ok;							  //--------------------------------------\\						
		delete testrun.ctxOk;						 //----- init starting testrun values -----\\
		delete testrun.argsOk;						//------------------------------------------\\
		delete testrun.errmsg;
		delete testrun.saveError;
		delete testrun.exception;
		delete testrun.notrun;
		delete testrun.expectedObjList;
		delete testrun.testNote;
		delete testrun.lists;
		delete testrun.testData;
		
		testrun.name = 'testrun';
		testrun.info = [];
		testrun.updated = false;
		testrun.ctxRequired = Boolean(EZ.test.data.funcProtoName);
		testrun.faults = 0;
		testrun.faultsDetail = [];
		testrun.expectedIcon = {};
		testrun.clonedValue = {};
		testrun.args_ignoredOkRules = EZ.toArray( EZ.get('okArgsIgnoredList'), '|' );
		
		g.e = function _____getTestOptions___processCallArgs_____() {}
		///////////////////////////////////////////////////////////////////////////////////////////
		testrun.testOptions = getTestOptions(testrun, args);		
		testrun.args = args;							//call args with {EZ:{...}} removed
		///////////////////////////////////////////////////////////////////////////////////////////
		processCallArgs(testrun, this);					//sets testrun: .argNames, .argsValueMap...
		///////////////////////////////////////////////////////////////////////////////////////////
		
		if (testrun.ctxRequired)
		{
			if (testrun.args.length === 0)
				testrun.errmsg = EZ.test.messages.ctxOmitted;
			else
			{
				var ctxType = testrun.callArgTypes.ctx;
				if (ctxType != EZ.test.data.funcProtoType)
				{
					var ctxTypeList = EZ.get(EZ('prototypeContext').EZ('input', true)).valueList;
					if (!ctxTypeList.includes(EZ.test.data.funcProtoType))
						testrun.errmsg = testrun.callArgNameCite.ctx + EZ.test.messages.ctxTypeInvalid;
				}
			}
		}
														  //-------------------------------------------\\
		if (!testrun.argNames)							 //----- get savedResults if 1st time call -----\\
		{												//-----------------------------------------------\\
			testrun.argNames = EZ.test.data.argNames;
			var saveNote = getTestResults(testrun);		//sets testrun.savedResults if found
			if (saveNote)								//if error getting found saved results
			{											//TODO: explain (id)*
				tags.EZ.set(['testnoFlag'], saveNote);
				tags.EZ('testnoTitle').title = "saved results found out of sequence";
				EZ.addClass(EZ.el, 'outOfSeq');
				EZ.addClass(tags, 'outOfSeq');
			}
			if (testrun.savedResults)
				EZ.removeClass(testrun.tags.EZ('deleteSaved '), 'invisible');
			
			testrun.matchKeys = EZ.test.getMatchKeys(testrun);
			testrun.compareFrom = (testrun.savedResults) ? 'saved' : 'expected';
		}
														  //---------------------------------------------\\
														 //----- determine source of expected values -----\\
														//-------------------------------------------------\\
		var expected = getExpected(testrun,'script');	//'script' option ignores "not specified" value(s)														
		var exFrom = EZ.get('exFrom');					//...initial value from testOptions -or-
		if (exFrom == 'script')							//...EZ.test.run.settings() if specified
		{
			void(0);									//test script is king even not specified
		}
		else if (exFrom == 'script-defined' && !expected && !testrun.savedResults)
		{												
			exFrom = 'saved';							//use saved if found
		}
		else if ((exFrom.startsWith('saved') && !testrun.savedResults)
		|| (exFrom == 'saved-ok' && !'.savedResults.ok'.ov(testrun)))
		{
			testrun.exFrom = 'script';					//revert to script if no saved results
		}
		else
		{											
			testrun.exFrom = 'saved';
			setOverride(testrun, expected);
		}
		testrun.expectedValueMap = EZ.valueMap(testrun.expected);		
		testrun.argsChanged = Array(testrun.args_idx.length);
		testrun.argsChangedDetails = Array(testrun.args_idx.length);
		testrun.argsDisplayed = Array(testrun.args_idx.length);
		testrun.argsChanged.results = true;
														  //----------------------------------------------------\\
														 // update html before test call so viewable if js error \\
		tags.EZ.set(['testno'], testrun.testno);		//--------------------------------------------------------\\
		tags.EZ.set(['lineno'],	EZ.test.data.callLineno[testIdx]);
		tags.EZ.set(['callArgs'], testrun.callArgs.replace(/ /g, '&nbsp;'));
		tags.EZ.set(['argDetail'], testrun.display_args);
		if (testrun.key)
		{
			tags.EZ.set(['testkey'], testrun.key);
			EZ.removeClass(testrun.tags.EZ('legacyNote'), 'invisible');
		}
	
		if (!EZ.test.isRerun)							//display expected if not rerun
			displayResults(testrun, 'expected');		//otherwise keep as-is as debugger convenience
		
		//---------------------------					//calls optional test script notefn() callback
		formatNote(testrun, 'prerun');					//TODO: check if any call arg values changed
		//----------------------------					
														//expectedScript used when saved results deleted
		testrun.expectedScript = deepClone(testrun.expected);	
	
		rtnValue = 'not completed'.wrap();
		if (!testrun.errmsg)
		{
			var isDebug = false;						//set debug flag -- if debugger option
			var debugField = EZ.field('debuggerRerun')
			if (EZ.test.isRerun && EZ.get('debuggerRerun'))
			{
				EZ.test.debugList = {}
				EZ.test.debugList[EZ.test.fn.name] = true;
				if (!debugField.el.className.includes('some'))
				{
					var script = Function.prototype.toString.call(EZ.test.fn);
					isDebug = !g.cs.strip(script).includes('debugger');
					if (!isDebug)
					{
						debugField.toggleCheckbox(debugField,'some', true);
						setTimeout(function() 
						{
							var msg = 'test fn has debugger statement -- check again to pause before calling';
							EZ.displayMessage(msg, debugField.el)
						},500);
					}
				}
				else isDebug = true;
			}
			var isTryCatch = !EZ.test.isRerun || EZ.get('tryCatch');
			
			var ctx = testrun.ctxClone != null ? testrun.ctxClone : window;
			var ctx = testrun.ctxClone || EZ.test.data.funcProtoType || window;
			var fn = EZ.test.data.funcProtoFake || testrun.calledFunc;
			if (fn)
				ctx = testrun.callArgValues.ctx
			//		: testrun.ctxClone || EZ.test.data.funcProtoType || window;
			
			var vData = testrun.vData;					  //------------------------\\
			if (vData && vData.value !== undefined)		 //----- variants setup -----\\
			{											//----------------------------\\
				testrun.legacy = EZ.global.legacy[EZ.test.data.funcNameReal];
				EZ.global.legacy[EZ.test.data.funcNameReal] = vData.value;
				tags.EZ('legacyNote').setAttribute('data-title', vData.textValue);
				EZ.addClass(EZ.el, 'default', (vData.value+'') == vData.legacyDefault);
			}
			
			//var stack = EZ.capture.get('faults', funcName);
			//if (stack[0]) stack[0] = 0;				//reset faults capture last time
			EZ.fault.count = 0;
			//EZ.capture.options.ready = true;
	
			var funcName = EZ.test.data.funcName;
			EZ.test.run.funcName = funcName;
			EZ.test.running = EZ.test.data.funcNameReal;
			EZ.test.testKey = testrun.testKey;			//for exception reporting by EZ.techSupport()
			EZ.test.fn.isTest = testrun.testKey;		//////////////////////
			
bindOverride(true)			
			if (isTryCatch)
			{					
				rtnValue = undefined;					/* jshint ignore:start *///...ignore below new()...
				var newArgs = [null].concat(testrun.argsClone);
				try	
				{
					//http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
					//******************************************************************************************
					if (isDebug) debugger;				//no debugger statement in function
					results = (fn) ? fn.apply(ctx,testrun.argsClone) 
								   : (testrun.testOptions.call != 'new') ? EZ.test.fn.apply(ctx, testrun.argsClone)
								   : new (EZ.test.fn.bind.apply(EZ.test.fn, newArgs));
					//*************************************************************************
				}
				catch (e) 
				{ 
					rtnValue = testrun.exception = e; 
				}
			} 
			else										//no try / catch
			{									
				//******************************************************************************************
				if (isDebug) debugger;					//no debugger statement in function
				results = (fn) ? fn.apply(ctx,testrun.argsClone)
							   : (testrun.testOptions.call != 'new') ? EZ.test.fn.apply(ctx, testrun.argsClone)
							   : new (EZ.test.fn.bind.apply(EZ.test.fn, newArgs));
				//******************************************************************************************
				function _____AFTER_TEST_FUNCTION_CALLED_____() {}					
														/* jshint ignore:end */
			}
			
bindOverride(false);
			
			delete EZ.test.fn.isTest;					//////////////////////
			EZ.test.run.funcName = EZ.test.running = EZ.test.testKey = '';	
			if (testrun.legacy !== undefined)
				EZ.global.legacy[EZ.test.data.funcNameReal] = testrun.legacy;
			//EZ.capture.options.ready = false;
			if (EZ.fault.count)
			{
				testrun.faults += EZ.fault.count;
				EZ.removeClass('goto_exceptions', 'hidden');				
			}
			EZ.test.debugList = {};
			EZ.test.running = '';
														
			results = testrun.testDone(results);		//returnValue cleanup and get results if undefined
			if (rtnValue === undefined)
				rtnValue = results;
			
			testrun.callArgValues.results = testrun.argsClone.results = results;
			testrun.callArgTypes.results = getType(results);	
														//02-04-17: updated and un-commented
			testrun.argsDeepClone.results = (testrun.testOptions.call == 'new') ? rtnValue
										  : deepClone(rtnValue, 'return value');
																	
			testrun.args_idx.forEach(function(idx)		//--------------------------------------
			{											//Element results converted to outerHTML
				var value = testrun.argsClone[idx];		//--------------------------------------
				if (EZ.getType(value) == 'Element')
				{										//use EZ.format.Element if not the tested fn
					value = (EZ.test.data.funcName == "EZ.format.Element") ? results.outerHTML 
																		   : results.toString('verbose')
					testrun.argsClone[idx] = value;
				}
			});
					
			testrun.actual = {};
			testrun.safe = {actual:{}, expected:{}};
			//______________________________________________________________________________________________
			/**
			 *	process all changed call arguments -- including actual return value
			 */
			var processChangedCallArgs = function _____processChangedCallArgs(idx)				
			{													
				var argReturnValue = testrun.argsClone[idx];
				testrun.setResultsArgument(idx, argReturnValue, '-run-');
				//testrun.actual[idx] = argReturnValue;	//save "return value" or returned argument values
														//but lost after restoring caller embedded Object
																
				if (idx == 'results')					//prevents loss after restoring caller embedded Object
				{										//unless EZ.clone() used for cloning
					testrun.safe.expected[idx] = deepClone(testrun.expected[idx], idx, 'expected');
					
														//02-04-17: un-commented
					testrun.safe.actual[idx] = testrun.testOptions.call == 'new' ? argReturnValue
											 : deepClone(argReturnValue, idx, 'actual');
					return;
				}
														//02-04-17: uncomment??
				//testrun.safe.actual[idx] = deepClone(argReturnValue, idx, 'actual');
				
				var argCallerValue = testrun.callArgValues[idx];
				if (argCallerValue instanceof Object)	//for Object arguments . . .
				{												
					var eqOpts = {showDiff:true, maxitems:3}
					var isEqual = EZ.equals( testrun.argsDeepClone[idx], argReturnValue, eqOpts );
					testrun.argsChangedDetails[idx] = EZ.equals.formattedLog || 'details: ...NA...';
					
					var mapOrig = testrun.argsValueMap[idx];
					var isDiff = !EZ.valueMap(argCallerValue,mapOrig);
					if (isDiff)							//embedded argument object changed
						testrun.argsChanged[idx] = 'indirect';
					else								//check if top level Object property changed
					{									//isKeysDiff probably redundant with EZ.equalsNew()
						var isKeysDiff = !(argReturnValue instanceof Object) 
									   || Object.keys(argReturnValue).join('.') != Object.keys(argCallerValue).join('.');
						
						testrun.argsChanged[idx] = isKeysDiff || !isEqual;
					}
				}
				else if (argCallerValue != argReturnValue)	
					testrun.argsChanged[idx] = true;	//for non-Object arguments . . .
				else 
					testrun.argsChanged[idx] = false;	//no change possible if not Object -- except callback
			}						 
			testrun.args_idx.forEach(processChangedCallArgs);
														//---------------------------------------
			if (testrun.testOptions.callback)			//if test script callback (exfn), call it
			{											//---------------------------------------
				var exResults = null;
				try										//may update testrun.actual or expected
				{										//returns updated expected if not undefined
					exResults = testrun.testOptions.callback(testrun);	
				}
				catch(e)
				{
					exResults = e.stack.formatStack().join('\n');
				}
				if (exResults != null)					//TODO: testrun functions superceed -- depricate ??
					testrun.setExpectedChanged('results', exResults);
															
														//re-process any changed call args
														//TODO: may have issues if callback chg values
														//		see notes in testdata.js::testrun Object
				testrun.getActualChangedList().forEach(processChangedCallArgs);
				testrun.checkUnknownExpectedChanged.call(testrun);
			}
		}
		else											//end of if (!testrun.errmsg) 
		{
			testrun.notrun = true;
			testrun.actual = 'test not run'.wrap();
			rtnValue = testrun.errmsg;
		}
		
		
		g.rtnValue = EZ.test.run.rtnValue;
		EZ.test.run.testrun = EZ.test.run.options = EZ.test.run.rtnValue = null;
		//===============================================================================================
		setTestOkStatus(testrun);
														//find changes from lastrun and savedResults
		findChanges(testrun);							//...MAY superceed validateResults()
		
		if (testrun.okChecked === undefined)				
		{
			var isOk = testrun.ok;
			if (isOk && testrun.saveOk === false)
				isOk = false;
			testrun.okChecked = EZ.toggleCheckbox(testrun.tags.EZ('ok'), isOk, testrun.saveOk);	
		}
		formatNote(testrun, 'final');
		setTestStyles(testrun);								
		//===============================================================================================
	
		if (!EZ.test.isRerun && !testrun.exfnLegacy)	//show results/ex when not rerun and no exfn()
		{												//otherwise keep prior as debugger convenience
			displayResults(testrun, 'results');
			displayResults(testrun, 'expected');
		}
	
		var isRedisplay = EZ.test.isRerun;				//---------------------------------------
		if (testrun.exfnLegacy)							//legacy callback if specified...
		{												//---------------------------------------
			var exResults = EZ.test.notSpecified;
			var keys = EZ.test.getResultsKeys(testrun);
			var obj = EZ.clone(testrun, keys);
			var resultsMap = EZ.valueMap(obj);
			try											
			{											//TODO: update testrun.safe??
				testrun.results = testrun.actual.results;	
				exResults = testrun.exfnLegacy(results,testrun);	
			}
			catch(e)
			{
				exResults = e.stack.formatStack().join('\n');
			}
			if (testrun.actual.results != testrun.results)
				testrun.actual.results = testrun.results;
	
			if (exResults != null)	// && exResults != EZ.test.notSpecified)
				isRedisplay = testrun.expected.results = exResults;
			else
				isRedisplay = !EZ.valueMap(EZ.clone(testrun, keys), resultsMap);
		}
	
		if (isRedisplay)								//display rerun and/or callback updated values
		{
			displayResults(testrun, 'expected');		
			displayResults(testrun, 'results');
		}
		msg = '';
		var compareFrom = EZ.test.getCompareFrom(testrun);
		testrun.matchKeys.forEach(function(key)
		{
			if (EZ.equals(testrun[key], compareFrom[key]))
				return;
			msg += ' ' + key;
			testrun.updated = true;
		});
		//tags.EZ('save').title = 'save updated:' + msg;
															
		if (EZ.test.isRerun)							//update clipboard and textarea with test script
		{												//...must preceed restoreArgValue() which can
			saveScript(testrun, 'evalResults');			//...un-intentionally reset return values
			saveScript(testrun);							
		}
														  //---------------------------------------------\\
		testrun.argsChanged.forEach(function(arg,idx)	 //restore arguments with changed embedded Objects\\
		{												//-------------------------------------------------\\
			if (arg === true || arg === false) 
				return;									//no embedded Objects changed by tested fn
			restoreArgValue(testrun, idx);
		});
	
		if (!EZ.test.isRerun)
		{							 					  //----------------------\\
			EZ.removeClass(tags, 'init');				 //----- display todo -----\\
														//--------------------------\\
			var title = EZ.test.data.testCalls[testIdx].trim()
			title = title.replace(/\( /, '(').trimPlus(')') + ')';
			title = title.replace(/EZ.test.run/, EZ.test.data.funcName);
			var ids = {id:testrun.id, id$:testrun.id$};
			var el = tags.EZ('todo_checkbox');
			EZ.todo.linkItem(el, testrun.testno, title, ids);
		}
		//--------------------------------------------------------------------------------
		if (testrun.vData)
		{
			testReturnValue = testReturnValue || [];
			testReturnValue.push(testReturnValue)
			if (EZ.test.data.variants.more(testrun))
				continue;
		}
		else testReturnValue = rtnValue;
		break;
	}
	//================================
	return testReturnValue;
	//================================
}
return ___;

//________________________________________________________________________________________
/**
 *	merge {EZ:{...}} from args if found with EZ.test.options and EZ.test.data.settings
 *	merged options stored where applicable usually EZ.test.data.testrun[...].expected
 *
 *	{EZ:{...}} removed frpm args so not used for test fn call
 *
 *	EZ.test.options deleted -- must be reset with EZ.test.optons() for each EZ.test.run()
 *	EZ.test.data.settings are persistant until explicitly changed by EZ.test.settings()
**/
function getTestOptions(testrun, args)
{
	var key, testOptions = {};
	
	if (EZ.test.data.settings instanceof Object)
		for (key in EZ.test.data.settings)
			testOptions[key] = EZ.test.data.settings[key];
	
	if (EZ.testOptions instanceof Object)
		for (key in EZ.testOptions)
			testOptions[key] = EZ.testOptions[key];
	
	EZ.testOptions = null;						//clear testOptions -- must be set for each test

	if (args.length)							//last arg of EZ.test.run(...) is testOptions
	{											//if of the form: { EZ:{...} } keys override
		var opts = args[args.length-1];
		if (opts instanceof Object && 'EZ' in opts && !opts.childNodes)
		{
			for (key in opts.EZ)
				testOptions[key] = opts.EZ[key];
			/*
			var exfn = testOptions.exfn;		//EZ.mergeAll() does not support function as of 05-18-2016
												//...also incorrectly converts Array to Object
			testOptions = !Object.keys(testOptions).length ? opts
														   : EZ.mergeAll(testOptions, opts.EZ);
			
			if (!opts.exfn)
				testOptions.exfn = exfn;
			/*/
			args.pop();
		}
	}
	if ('.ex.results'.ov(testOptions))			//move numeric keys --> testOptions.args
	{											//and non-numeric --> testOptions[key]
		for (var key in testOptions.ex)
			testOptions[key] = testOptions.ex[key];
		testOptions.args = EZ.isArray(testOptions.ex) ? testOptions.ex.slice() : [];
		testOptions.args.results = testOptions.ex.results;
		if ('ctx' in testOptions.ex)
			testOptions.args.ctx = testOptions.ex.ctx;
		delete testOptions.ex;
	}
	testOptions.callback = testOptions.exfn || testOptions.fn || null;
	delete testOptions.exfn;
	delete testOptions.fn;

	testrun.note = testOptions.note || '';
	if (typeof(testrun.note) == 'function')
	{
		testrun.notefn = testOptions.note;
		testrun.note = '';
	}
	testrun.notefn = testOptions.notefn || null;

	if (EZ.test.data.settings.group)				//prepemd group not if any
	{
		var note = EZ.test.data.settings.group.trim();
		note = '<b>' + note  + '</b>'
			 + (!note.endsWith(':') ? '\n' : ' ');

		note = note.replace(/\n\s*:\s*$/, ':\n') 	//prepend group note testOption not
			 + testrun.note	;
		testrun.note = note;
	}
	var exArgs = testOptions.args || [];
	if (exArgs && !EZ.isArray(exArgs))
		exArgs = [exArgs]

	var expected = {results: 'ex' in testOptions ? testOptions.ex : EZ.test.notSpecified};
	
	var argCount = EZ.test.data.argNames.length;	//number of args on test fn stmt
	if (testrun.ctxRequired)						//less pseudo ctx arg
	{
		argCount--;
		expected.ctx = ('ctx' in testOptions) ? testOptions.ctx 
											  : EZ.test.notSpecified;
	}

	argCount = Math.max(args.length, argCount);		//max of specified or number on fn stmt
	for (var i=0; i<argCount; i++)
		expected[i] = (i in exArgs) ? exArgs[i] : EZ.test.notSpecified;
	
	if ('ctx' in exArgs)
		expected.ctx = exArgs.ctx;
	if ('results' in exArgs)
		expected.results = exArgs.results;

	testrun.expected = expected;
	return testOptions;
}
//________________________________________________________________________________________
/**
 *	experimental -- but as of 09-21-2016 only used for argsChanged detail
**/
function deepClone(obj, name, maxdepth)
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
			cloneOpts = {maxdepth:maxdepth, name: name};
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
		
		msg.unshift('deepClone[' + cloneHow + '] failed -- object name: ' + (name || 'NA').wrap());

//debugger;		
		msg = EZ.getStack( {message:msg} ).toString('html');
	//	msg = msg.concat( EZ.getStackTrace() );
		
		testrun.faults++; 
		if (testrun.faultsDetail.length)
			testrun.faultsDetail.push('-'.repeat(40));
		testrun.faultsDetail = testrun.faultsDetail.concat(msg);
		break;
	}
	return clone;
}
/*----------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
function findChanges(testrun)
{
	var process = function(obj, what)
	{
		var was, now;
		if (what == 'args')
		{
			var keys = 'callArgNames callArgTypes callArgValues'.split(' ');
			was = deepClone(obj, keys);
			now = deepClone(testrun, keys);
		//	was = EZ.clone(obj, keys);
		//	now = EZ.clone(testrun, keys);
		}
		else
		{
			was = obj[what];
			now = testrun[what];
		}
		if (EZ.isEqual(was, now, 150))
			return [];

		return EZ.equals.formattedLog;
	}
	//========================================================================================
	var testIdx = testrun.testno - 1;
	var lastrun = 'EZ.test.app.lastrun.testrun.'.concat(testIdx, '=').ov({});

	var allOk = testrun.allOk;
	var validation = EZ.test.data.validation;
	
	  //------------------------------------------------------\\
	 //----- basic validation code from validateResults() -----\\
	//----------------------------------------------------------\\
	var is1st = testrun.ok1st.length;
	if (!is1st)
	{										//if filter not defined, define after validateResults()
		testrun.saveOk = '.savedResults.ok'.ov(testrun);	
		if (!testrun.ok && testrun.saveOk)
			testrun.ok = 'some';
	
		var filters = [];
		/*
		if (!testrun.savedResults)					//bail if no savedResults found
		{
			note = '<i>no saved results</i>';
			testrun.ok = false;
			displayNote(testrun, {validate:note});
			return filters;
		}
		*/

		if (validation == 'extended' && testrun.saveOk !== undefined)
			filters = validateResults(testrun)		//NA - legacy not refactored

		testrun.ok1st = [allOk.all ? 'pass' : 'fail'].concat(filters);
		testrun.ok1st.okChecked = allOk.all;
		
		if (testrun.ok == 'some')
			testrun.ok1st.push('failOk')
		testrun.ok1st.push(testrun.saveOk ? 'saved' : 'notsaved')		
	}
		
	[lastrun, testrun.savedResults].forEach(function(lastrun)
	{
		if (!lastrun) 							//bail if no prior results
			return;
		lastrun.changedDetail = {};
		if (!lastrun.callArgNames) return;		//bail if no test data for this testno
	
		['args', 'note', 'warn'].forEach(function(what)
		{
			lastrun.changedDetail[what] = process(lastrun, what);
		});
	});
}
//________________________________________________________________________________________
/**
 *	restore any arguments with embedded Objects changed by tested fn
**/
function restoreArgValue(testrun, idx)
{
	try											
	{
		var argIdx = (EZ.test.data.funcProtoFake || testrun.calledFunc) ? idx+1 : idx;
		var arg = testrun.args[idx];
		var obj = EZ.valueMap.reset(arg, testrun.argsValueMap[idx]);
		if (obj != testrun.args[argIdx])		
			testrun.errmsg = testrun.callArgNameCite[idx] + ' restore failed'
	}
	catch (e)
	{
		EZ.oops('exception reseting: ' + testrun.callArgNameLong[idx], e);
	}
}	
//________________________________________________________________________________________
/**
**/
function saveScript(testrun, el)
{													
	var type = el ? 'Text' : 'Clip';
	var argListOpt = EZ.get('rerun' + type + 'ArgList');
	if (argListOpt)
	{
		var options = {
			args_idx:[],
			argsChanged:[],
			callArgs: EZ.get('rerun' + type + 'CallArgs'),
			note: EZ.get('rerun' + type + 'Note'),
			comments: EZ.get('rerun' + type + 'Comments')
		}
		if (argListOpt != 'all') 
		{											//e.g. "results", "ctx", "args"
			var tags = EZ('rerun' + type).EZ('dependent').EZ('opt', true);
			//var checkboxes = EZ.options.getValues(tags);
			var checkboxes = EZ.get(tags).valueMap;
			var selected = {};
			var selectedUsed = {};
			var selectedChanged = {};
			Object.keys(checkboxes).forEach(function(key)
			{
				var value = checkboxes[key];
				if (value === '') return;			//not checked
				
				if (value.endsWith('*'))
					 selectedUsed[value.clip()] = true;
				else if (value.endsWith('+')) 
					selectedChanged[value.clip()] = true;
				else
					selected[value] = true; 
				
				/*					
				(!value.endsWith('*')) ? selected[value] = true
										: selectedUsed[value.clip()] = true;
				*/
			});
			testrun.args_idx.forEach(function(idx)
			{
				var argIdx = isNaN(idx) ? idx : 'args';
				
				if (!selected[argIdx]) return;		//arg_idx not selected
				if (selectedUsed[argIdx] && '.allOk.notUsed.'.concat(idx).ov(testrun)) return;
				if (selectedChanged[argIdx] && !testrun.argsChanged[idx])
					return;
				
				if (!options.args_idx.includes(argIdx))	//if not already added...
					options.args_idx.push(argIdx);		//include expected call arg in test script
			});
			options.argsChanged = testrun.argsChanged;
		}
		var script = EZ.test.createTestScript(testrun, options);
		if (el)
		{
			updateEval(script, 'script', 'test #' + testrun.testno)
			el = EZ(el);						
			if (el.select) el.select();
		}
		else
		{
			var msg = 'clipboard set to:\n' + script;
			if (script)
				EZ.clipboard.copy(script);
			else
				msg = 'test script blank:\nnot copied to clipboard';
			var delay = EZ.toInt(EZ.get('rerunClipMsgDelay'));
			if (delay > 0)
			{
				el = testrun.tags.EZ('toggleLast');
				EZ.displayMessage(msg, {floatNode:el, delay:delay*1000});
			}
		}
	}		
}
//________________________________________________________________________________________
/**
 *	Builds pseudo call statement from call argument variable name(s) and value(s) for display
 *	and associated detail when arg is variable or call statement has abbreviated value.
 *
 *	Creates SUPER-SAFE toplevel clone of EZ.test.run(...) call argument values via slice() 
 *	-AND- a valueMap used after test fn call to determine if any embedded argument Objects
 *	were changed and if so is then used to restore them to their original values.
 *
 *	Also creates saved results id for EZ.test.run(...) call used to find saved results.
 *
 *	RETURNS:
 *		testrun.arg_idx							//Array of numbers cooresponding to arguments plus...
 *												//...key names: "results" (and "ctx" if prototype)
 *		testrun.callArgValues = {};				//non-cloned arguments indexed by arg_idx
 *		testrun.argsClone						//cloned arguments indexed by arg_idx

 *		testrun.argsValueMap[]					//for each arg_idx except "results"
 *		testrun.argsObjListMap					//empty valueMap with objList of nested arg objects
 *		testrun.id								//full saved results id includes group/note
 *		testrun.id$								//saved results id -- only arg values
 *
 *		...and more...							//including various forms of call argument names
 *
 *	TODO: clone and tracking support for arguments typeof: function, RegExp, Date html objects
 */
function processCallArgs(testrun, ctx)
{
	testrun.id = '';
	testrun.argsClone = [];						//slice
	testrun.argsDeepClone = [];
	testrun.argsValueMap = [];
	testrun.args_idx = ['results'];
	testrun.args_omitted = [];
	testrun.setIgnoreArgs();
												//various forms of call argument names
	testrun.callArgNameCite = {results: 'return value'.wrap('<cite>')};
												//		-or-
												// 	<cite>"this"</cite>
												//	1st arg <cite>[myarg]</cite>
	testrun.callArgNameLong = {results: '"return value"'};
												//		-or-
												//	"this" (String)
												//	1st arg -or- 1st arg (varname)
	testrun.callArgNameShort = {results:'return value'};
												//		-or-
												//	varname if variable name
												//	else "this" or fn stmt arg name if any
												//	otherwise 1st arg, 2nd arg ...
	testrun.callArgNameScript = {results: 'ex'};
	testrun.callArgNameTestFn = {};				//set by testrun.setResultsArgument() if called

	testrun.callArgsCount = 0					//number of arguments on call statement
	testrun.callArgNames = {};					//var name on call stmt if variable else blank
	testrun.callArgTypes = {};					//constructor name of call stmt arguments
	testrun.callArgValues = {};					//non-cloned arguments

												//argument names defined on fn stmt
	var argNames_fnStmt = EZ.test.data.argNames.slice();	
	var callArgNames = (EZ.test.data.callArgNames[testIdx] || []).slice();
	var callArgTypes = (EZ.test.data.callArgTypes[testIdx] || []).slice();
	var callPrefix = EZ.test.data.callPrefix[testIdx];

	var callStatement = [];						//call statement pieces
	var callArgDetail = [];						//detail of call statement variables and/or values
	var argsObjList = [];						//list of nested objects in call arguments

	var argsWrap = testrun.tags.EZ('.args');	//estimated space to display call statement
	var width = argsWrap.clientWidth;			//values -- i.e. call argument not variable
	var maxchars = EZ.toInt(width / (EZ.getStyle(argsWrap, 'fontSize') + 4));
	//maxchars = Math.max(24, Math.min(30, EZ.toInt(maxchars/callArgNames.length)));

	//----------------------------------------------------------------------
	// format argument values for call statement and argument detail display
	//----------------------------------------------------------------------
	var argNo = 0, arg_idx;
	var argCount = Math.max(testrun.args.length, argNames_fnStmt.length)
	var args = testrun.args.slice();
	
	if (EZ.test.data.funcProtoFake)
	{												
		argNames_fnStmt.shift();
		callArgNames.shift();
		callArgTypes.shift();

		var ctx = args.shift();
		argCount--;
		testrun.callArgValues.ctx = ctx;
		testrun.callArgTypes.ctx = getType(ctx);
		testrun.argsClone.ctx = ctx;
		testrun.argsDeepClone = deepClone(ctx, 'Fake context'.wrap('<cite>'));

		callPrefix += '.' + ctx.name + '*';
		//callArgNames[0] += '.' + ctx.name;
	}
	else if (ctx && ctx != window && ctx != EZ && ctx != EZ.test)
	{												//EZ.test.run(object, method, args)
		if (typeof(args[0]) == 'function'			//TODO: don't assume args[1] is fn ??
		|| (typeof(args[0]) == 'object' && typeof(args[1]) == 'function'))
		{
			callArgNames.shift();					//1st 2 parsed args not real args
			callArgTypes.shift();
			callPrefix = callArgNames.shift();		//2nd parsed arg is calledFuncName
			callArgTypes.shift();

			argCount--;
			if (ctx == EZ.test)						//            /---1st callarg
			{										//EZ.test.run(ctx, calledFunc, ...)
				ctx = args.shift();
				argCount--;							//                      /---2nd callarg
				testrun.calledFunc = args.shift();	//EZ.test.run.call(ctx, calledFunc, ...)			
			}
			else									//                      /---1st callarg
				testrun.calledFunc = args.shift();	//EZ.test.run.call(ctx, calledFunc, ...)

			testrun.callArgValues.ctx = ctx;
			testrun.callArgTypes.ctx = getType(ctx);
			testrun.argsClone.ctx = ctx;
		}

		else if (typeof(ctx) == 'function')			//EZ.test.run.call(fn, ...)
		{											//02-16-2017: 3rd syntax idea
			var fn = ctx;
			callPrefix = callArgNames.shift();		//1st parsed call arg is ctx / called fn
			testrun.calledFunc = fn;
			testrun.callArgValues.ctx = fn;
			testrun.callArgTypes.ctx = getType(fn);
			testrun.argsClone.ctx = fn;
			if (fn.name.includes('bound '))			//if fn is bound, get ArgNames. . . TODO:
			{
				void(0);
			}
		}
	}	
	for (var idx=0; idx < argCount; idx++)			//for each call arg and/or fn statement arg
	{
		var arg = args[idx];						//args from EZ.test.run() can be undefined
		var isOmitted = (idx >= args.length);

		var argName = '';
		var argType = getType(arg);
		var callArgName = callArgNames.shift();		//blank if call arg not variable ??
		var callArgType = callArgTypes.shift();
		if (callArgType != 'var') 					//probably redundant test
			callArgName = '';
													
		var detailValue = formatArgument(arg);		//*undefined* if not on call stmt
		var callValue = displayCallValues(arg, maxchars);
													
		if (idx === 0 && testrun.ctxRequired 
		&& !EZ.test.data.funcProtoFake && !testrun.calledFunc)
		{											
			arg_idx = 'ctx';						//1st arg is ptototype context
			argNames_fnStmt.shift();

			testrun.callArgNameShort.ctx = '"this"';
			testrun.callArgNameLong.ctx = callArgName + ' "this" (' + argType + ')'.trim();
			testrun.callArgNameScript.ctx = 'ctx';
			testrun.callArgValues.ctx = arg;
			
			argName = (callArgName) ? callArgName.wrap('<i>') + ' ' : '';
			testrun.callArgNameCite.ctx = argName + 'this'.wrap('<cite>');

			callPrefix = (callArgName) ? callPrefix.replace(RegExp("^(" + callArgName + ")"), '$1'.wrap('<i>'))
					   : (callValue == detailValue) ? callValue.wrap('<cite>') + callPrefix
					   : callValue + callPrefix;
			argName = '"this"';
		}
		else										//fn arg -- not ptototype context
		{
			arg_idx = argNo++;
			if (!isOmitted)
				callStatement.push(callArgName || callValue);

			var argSuffix = (argNo).suffix() + ' arg ';
			argName = argNames_fnStmt.shift() || argSuffix;

			var name = callArgName || argName;
			testrun.callArgNameCite[arg_idx] = name ? argSuffix + name.wrap( '<cite>' )
											 : argSuffix.trim().wrap( '<cite>' );

			testrun.callArgNameLong[arg_idx] = name ? argSuffix + name.wrap( '(', ')' )
											 : argSuffix.trim().wrap( '(', ')' );

			testrun.callArgNameScript[arg_idx] = 'args[' + arg_idx + ']';
			testrun.callArgValues[arg_idx] = arg;
		}
		testrun.callArgNameShort[arg_idx] = (callArgName || argName)
		testrun.callArgNames[arg_idx] = callArgName;
		testrun.callArgTypes[arg_idx] = argType;

		if (isOmitted)									//arg on fn stmt but NOT on call stmt
		{
			testrun.args_omitted.push(arg_idx);
		}
		else											//arg on call stmt -- can be undefined
		{
			if (arg_idx != 'ctx')
				testrun.callArgsCount++;
			testrun.args_idx.push(arg_idx);
														
			
														//start with uncloned arg
			
			var argClone = testrun.argsDeepClone[arg_idx] = arg;
			if (arg instanceof Object && !testrun.isIgnoredArg(arg_idx))
			{											//get deep Clone if Object and not ignored
				testrun.argsDeepClone[arg_idx] = deepClone(arg, testrun.callArgNameLong[arg_idx]);
				
				if (testrun.argsDeepClone[arg_idx] == arg)
				{										//argClone NOT a clone: try EZ.clone()
					EZ.oops('deepClone failed[processCallArgs]: ' + testrun.callArgNameLong[arg_idx]);
					argClone = EZ.clone(arg, false);	
				}
				else									
					argClone = deepClone(arg, testrun.callArgNameLong[arg_idx], 1);
			}
			testrun.argsClone[arg_idx] = argClone;
			/*
														//get top level clone for valueMap
			testrun.argsClone[arg_idx] = deepClone(arg, testrun.callArgNameLong[arg_idx], 1);
			*/
			
			var valueMap = testrun.argsValueMap[arg_idx] 
						 = EZ.valueMap(arg, testrun.callArgNameLong[arg_idx]);
			
			argsObjList = argsObjList.concat(valueMap.objList);
														//03-08-2017:
														//only cloning Elements if specified by rules			
///			if (EZ.get('argElementChange') == 'clone')
														
			

			testrun.id += 'arg' + (idx + 1) + '=' + valueMap.id.replace(/,\./g, ',').replace(/^,/, '') + ',';

			if (callArgName 							//if var name or call stmt does not show full value
			|| EZ.get('showArgumentDetail')				//or if always show detail is checked
			|| callValue != displayCallValues(arg,99999))
			{											//********** append argument detail **********
				var citeName = testrun.callArgNameCite[arg_idx] || '';
				if (testrun.isIgnoredArg(arg_idx))
					detailValue = 'ignored: test script setting'.wrap();
				callArgDetail.push('' + formatArgumentDetail(detailValue, citeName));
			}
		}
	}
	if (!testrun.callArgsCount)							//if no call args, show *no argument* in fn stmt
		callStatement.push(EZ.test.noArguments);
	else												//otherwise list any omitted
	{			
		testrun.args_omitted.forEach(function(idx)
		{
			var name = testrun.callArgNameCite[idx];
			callArgDetail.push(formatArgumentDetail(EZ.test.omitted, name));
		})
	}
	if (testrun.testOptions.call == 'new')
		callPrefix = 'new ' + callPrefix;
	testrun.callArgs = '&nbsp;&nbsp;' 					//edit icon pad -- format call statement
					 + callPrefix 						//blank, prototype or "new "
					 + '( <i>' + callStatement.join('</i>, <i>') + '</i> )'

	testrun.display_args = callArgDetail.join('\n');	//format argDetail
	testrun.display_args = testrun.display_args.trim().replace(/(<\/pre>)\s*/g, '$1');

	testrun.argsObjListMap = new EZ.valueMap(0);		//empty valueMap with list of nested arg objects
	testrun.argsObjListMap.argsObjList = argsObjList.removeDups();

	testrun.id$ = testrun.id.clip(1);					//saved results id varients
	testrun.id += 'note:' + testrun.note.replace(/\s/g, '');

														//convenience / backward compatibility
	testrun.ctxClone = testrun.ctxRequired ? testrun.argsClone.ctx : null;
}
//________________________________________________________________________________________
/**
 *	Insert object name into formatted text from EZ.toString() just before text of
 *	form "(object type):" -- works for all formats of non-null Array or Object.
**/
function formatArgumentDetail(value, name)
{
	name = name || '';
	var html = 'N/A';
	if (value)
	{
		//	----- non-html format -- value starts object heading-----
		//	(HTMLDivElement):
		//
		//	----- html format -- object heading always has id span -----
		//	<pre class="EZtoString">
		//		 <span class="top" id="EZ_72930764_0">(ArrayLike Object) [1]: </span>
		//
		//	----- html format-- always collasped or expanded span (if enabled)
		//	<pre class="EZtoString" onclick="EZdisplayClick()">
		//	   <span class="expanded all">   <span id="EZ_72966138_0">(HTMLDivElement): </span>

		//----- put name after html formatting tags
		var regex = /(<pre class="EZtoString">)?(([\s\S]*?)@@@@@@@@@@)?\s*([\s\S]*)/
		if (!regex.test(value))
		{								//no match -- assume no formatting tags
			html = name + ' ' + value;
		}
		else
		{
			html = value.replace(regex, function(all, tag, group, prefix, detail)
			{
				if (!tag)
				{
					tag = '<pre>';
					detail += '</pre>';
				}
				prefix = prefix || '';
				if (name.startsWith('<cite>'))
					name = ' ' + name;
				return tag + prefix + name + ' ' + detail;
				/*TODO:
				if ('expand collapse'.indexOf(value) != -1)
				{
				}
				*/
			});
		}
	}
	return html.trim();
}
//________________________________________________________________________________________
/**
 *	return value formatted as json string if not too long:
 *		e.g. "abc", [1, 2, 3] or {a:1, b:2}
 *
 *	otherwise return "...", [...] or {...}
**/
function displayCallValues(value, maxchars)
{
	var wrapper = '';
	if (typeof(value) == 'string')
	{
		var results = value.trim().match(/^new (\w+) *\((.*?)(\)|$)/);
		if (results)
		{
			wrapper = ['new '+ results[1] + '(', ')'];
			value = results[2];
		}
	}
	var str = EZ.format.value(value, maxchars);
	if (str.startsWith('['))
	{
		var json;
		try
		{
			json = EZ.stringify(value, 'native', 0);		//=0 for [1,2] not [1, 2] and {a:1} not {a: 1}
			/*
			json = EZ.isObjectCircular(value)
			json = (json) ? JSON.stringify(json)
						  : JSON.stringify(value, null, 1);
			json = json.replace(/([{,]\s*)"([\w_]+?)":/gi,	//un-quote Object keys
			function(all, sep, key)
			{
				if ('null undefined'.indexOf(key) != -1) return all;
				return sep + key + ":"
			});
			*/
		/*not needed with JSON.stringify() wrapper of 11-04-2016
			json = json.replace(/\n/g, ' ').replace(/\s+/g, ' ');
			json = json.replace(/([{[]) /g, '$1').replace(/ ([\]}])/g, '$1');
		*/
			//json = json.replace(/\[\]/g, '[...]').replace(/\{\}/g, '{...}');	//??
			
		}
		catch (e)
		{
			json = value + e;
		}

		if (json.length <= maxchars)
			str = json;
		else
			str = (EZ.isArray(value) ? '[...]' : '{...}')
				+ (str.includes('Like') ? '*' : '');
	}
	if (wrapper)
		str = str.wrap(wrapper[0],wrapper[1]);
	return str;
}
})();
//==============================================================================================

/*----------------------------------------------------------------------------------------------
Display actual or expected results column which contains following:

	"return value" -- always display even if undefined
	ctx and argument(s) display, if changed or expected value specified

ARGUMENTS:
	className	"results" or "expected"

	testrun		specific test fn call Object

RETURNS:
	nothing -- updates results or expected className tag innerHTML

		expectedValue = getExpected(testrun);
		var results = (className == 'results') 					//always show results
					? testrun.actual : expectedValue;

		var name = msg ? '<cite>return value</cite>' : ''		//use name if other values displayed
		html = formatResults(results, name).trim();

		//if (expectedValue != EZ.test.notSpecified && !isOk(testrun,''))
		if (className == 'expected' && !isOk(testrun,''))
			html = html.wrap('<span class="fail">', '</span>');

		msg = html + sep + msg;
----------------------------------------------------------------------------------------------*/
function displayResults(testrun, className)
{
	var msg = '',
		pad = '',
		sep = '\n\n',	//EZ.test.MORE;
		sepTrim = '\n';	//EZ.test.morePattern;

	testrun.args_idx.forEach(function(idx)
	{
		var isFn = testrun.isFn(idx, 'actual') || testrun.isFn(idx, 'expected');
		if (!isFn && !'.argsDisplayed.'.concat(idx, ' .argsChanged.', idx).ov(testrun))
			return;

		var argName = testrun.getArgumentCiteName(idx, className);

		var html = '';
		if (className == 'results')							//actual "return value(s)"
		{
			if (testrun.notrun)
				html = testrun.actual;

			else if (testrun.exception)
			{
				html = testrun.exception.stack
					 ? testrun.exception.stackTrace('debug') + ''
				//	 ? testrun.exception.stack.formatStack().join('\n')
					 : 'EXCEPTION: ' + e;
				testrun.errmsg = EZ.test.messages.exception;
			}
			else
			{
				var value = testrun.actual[idx];
				if (testrun.isFn(idx, className))
				{
					html = '<img src="../images/fn_16.png" title="test script function">'
						 + formatResults(value, argName, className).trim();					
				}
				else
				{
					html = (formatResults(value, argName, className) + '').trim();
					if (testrun.argsChanged[idx] == 'invalid')
					{
						value = testrun.actual.safe[idx];
						html += '\n<b>argument restored: copy shown</i></b>';
					}
				}
			}
		}
		else												//expected "return value(s)"
		{													//skip when not specified, not results
			var expected = getExpected(testrun, idx);		//...and actual changed by script exfn()
			if (expected == EZ.test.notSpecified && idx != 'results' && testrun.isFn(idx, 'actual'))
				html = '';
			else
			{
				html = formatResults(expected, argName, className).trim();
				
				if (!isOk(testrun, idx))
					html = html.wrap('<span class="fail">', '</span>');
				else if (expected == EZ.test.notSpecified)
					html += '\n<img src="../images/smiley_frown.png"> '
						  + 'ok rules do not require';
				
				if (idx == 'results')
				{
					pad = testrun.expectedIcon[idx];
					if (!pad)								//img padded by css
						pad = '&nbsp;&nbsp;'
				//	pad = '&nbsp;&nbsp;' + testrun.expectedIcon[idx];				
				}
				else
					html = testrun.expectedIcon[idx] + html;
			}
		}
		msg += sep + html;
		msg = msg.trim();
	});
	msg = msg.trimPlus(sepTrim);

	if (EZ.get('sharedResultsFormatter') == 'EZtoString')
		msg = msg.trim().replace(/]\[/, ']\n[');			//unwanted from EZ.toString()

	testrun.tags.EZ.set([className], pad + msg);
	var key = 'display_' + className;
	testrun[key] = msg;

	//TODO: showDetails() currently disabled
	//showDetails(tags.EZ(className), EZ.test.isRerun);
}
//____________________________________________________________________________________
/**
 *	Called 2 (or 3 ?) times
 *		-before test function called (prerun)
 *		-after ok, ctxOk, okClass defined and exfn function called if supplied (final)
 *			show specified note prepended with error messages if any
 *			e.g. returned results not expected results
 *
 *	if note specified as function, it is called with expected ctx or other error messages
 *	as described above the testrun object for test being run by test script. if return value
 *	is not undefined, it is displayed as note.
 *
 *	After final call, the value testrun.ok determines if the pass or fail count is updated.
 */
function formatNote(testrun, phase)
{
	var msg = '';
	var note = '';
	var warn = '';
	//var info = '';
	var notSpecified = ' ' + EZ.test.notSpecified.replace(/ /g, '&nbsp;');
	var more = '\n' + EZ.MORE + '\n';
	var morePattern = RegExp(more);
	var expectedValue, expectedType;

	switch (phase)
	{
		case 'prerun': 						//when called before prototype test function called,
		{									//prepend expected change to ptototype target
			if (testrun.ctxRequired)
			{
				warn = testrun.expected.ctx == EZ.test.notSpecified
					 ? '(no change expected)'
					 : formatResults(testrun.ctxClone, 'expected value', 'expected');
				warn = 'this [' + EZ.test.data.funcProtoType + '] ' + warn;
			}
			//testrun.info = '';							//clear info notes
			break;
		}
		case 'final':
		case 'okChecked':
		{
			testrun.noteIgnored = [];
			if (testrun.errmsg) break;

			testrun.args_idx.forEach(function(idx)		//fn 'results', ['ctx'], [0-n]
			{
				var isIgnored = false;
				if ('.allOk.ignored'.ov(testrun, []).includes(idx))
					isIgnored = true;
				
				else if (isOk(testrun, idx))
					return;

				var argName = testrun.callArgNameCite[idx];
				if (idx == 'results')
				{
					expectedValue = getExpected(testrun, 'results');
					expectedType = getType(expectedValue);

					msg = expectedValue == EZ.test.notSpecified
						 ? 'expected ' + argName + notSpecified
						 : EZ.equals(testrun.actual[idx], expectedValue) ? ''
						 : (expectedType != expectedType
							 ? argName + ' NOT "' + expectedType + '" as expected'
							 : argName + ' NOT expected ' + expectedType);
				}
				else
				{
					expectedValue = getExpected(testrun, idx);
					expectedType = getType(expectedValue);

					msg = (expectedValue == EZ.test.notSpecified)
						? argName + ' changed; expected value' + notSpecified
						: argName + ' NOT expected ' + expectedType;
				}
				(isIgnored) ? testrun.noteIgnored.push(msg)
							: note += msg +  '\n';

				if (testrun.argsChanged[idx] == 'reset')
				{
					var log = testrun.actualMap[idx].log.slice();
					if (log.length > 3)
					{
						log.length = 3;
						log.push(EZ.MORE);
					}
					note += log.format().join('\n') + '\n';
				}
			});			
			
			if (g.firstRunTests	&& !testrun.okChecked	
			&& testrun.savedResults && testrun.savedResults.ok !== true)
				note += 'saved expected results NOT correct'.wrap('<em>') + '\n';			

			//note += (more + argNotes.trim());
			//note = note.trimPlus(morePattern);
			
			if (testrun.testNote)
				testrun.more = testrun.testNote;
			
			var msg = testrun.getListString('expectedChanged');
			if (msg)
				note += more 
					  + '<img src="../images/fn_16.png">'
					  + 'expected values changed by script callback fn:'.wrap('<i>')
					  + '\n' + msg;
			
			note = note.trimPlus(morePattern);
			testrun.warn = note;
			break;
		}
	}
	//--------------------------------------------------------------------\\
	 //----- call test script notefn or add testrun.testNote if defined -----\\
	//------------------------------------------------------------------------\\
	if (testrun.notefn)
	{
		note = testrun.notefn(testrun, phase)
		if (note)
			testrun.more = note;
	}
	if (phase != 'prerun')
		displayNote(testrun, {info:testrun.info.join('\n')});
}
/*----------------------------------------------------------------------------------
note column has 3 components:

	1. test script note
	2. error messages or warnings
	3. validate details when validating savedResults
	4. info from save
----------------------------------------------------------------------------------*/
function displayNote(testrun, options)
{
	options = options || {};
	var noteParts = [];
	var keys = 'note errmsg warn more validate'.split(' ');
	keys.forEach(function appendNote(key)
	{
		var note = options[key] || testrun[key] || '';
		note = noteToString(note, key);
		note = note.replace(/(^|<\/pre>)([\s\S]*?)(<pre|$)/g,
		function(all, before, note, after)
		{
			note = (note || '').trim();
			note = note.replace(/\n/g, '<br>');
			note = note.replace(/\t/g, ' &nbsp; &nbsp;');
			note = note.trimPlus(/<br>/);
			note = note.replace(/(<br>)/g, '$1\n');
			return before + note + after;
		});
		noteParts.push(note);
	})
	
	/*var info = (options.info || '').wrap('<div class="info">')
			 + (options.info ? '<hr>' : '');		//info from save results
	*/
												
	var info = (options.info) 						//always add info div -- has top tan border
			 ? options.info + '<hr>' : '';			//...append <hr> when not blank (save details)

	var html = info.wrap('<div class="info">') + noteParts.remove().join('<hr>');
	testrun.tags.EZ.set(['note'], html);

	if (options.info)
		setTimeout(function() {toggleScroll(EZ.set.el, 'expandUpdate')}, 0);
	//__________________________________________________________________________________________________
	/**
	 *
	 */
	function noteToString(note, key)
	{
		if (!note && note !== 0) return '';
		if (key == 'more')
			key = 'testrun.testNote';
		switch (EZ.getType(note))
		{
			case 'Array': 	return note.length ? note.join('\n') : '';
			case 'Object': 	return formatResults(note, key);
			default:		return note += '';
		}
	}
}
//________________________________________________________________________________________
/**
 *	what:
 *		=all or undefined		all Ok	-- legacy testOk
 *		='' or ='results' 		return value ok
 *		=# for args# 			ctx 0 if required otherwise 1st arg is 0
 *		='ctx'					ctx ok or not required
 *		='save'
 */
function isOk(testrun, what)
{
	if ('.allOk.all'.ov(testrun) == null)		//if not yet defined
		return true;
	
	what = (what == null) ? 'all'
		 : (what === '')   ? 'results'
		 : what + '';
	
	if (testrun.allOk[what] === undefined) 		//test probably not run
		return false;						

	return Boolean(testrun.allOk[what]);
}
//________________________________________________________________________________________
/**
 *	called after test runs, saved, results edited or from updateOk() when checkbox toggled.
 *
 *	update testrun Ok values based on test results using ok rules -- reference via isOk()
 *	Ok checkbox not set or change here -- but set based on testrun.okChecked only set here
 *	if undefined or rerun and reset on rerun test option.
 *
 *	testrun.okChecked can be undefined, true, false or "some".  Updated
 *
 *	testrun.okChecked is not used to set: oks.results, oks.ctx and oks[0...n].  They are set
 *	true or false based here using Ok rules.
 *
 *	also updates why tooltip associated with undelined "ok" checkbox label
 *
 *	displayResults() determines which actual and expected results are displayed based on ok
 *	values determined here and and argsChanges[] values set after test runs..
 *
 *	likewise formatNotes() determines appropriate warning messages.
 *
 *	NOT used as of 11-29-2016
 *	validateResults() decide which oks are relavent to determine if test passed or not and set
 *	ok checkbox and associated css color codes.
 *
 *	TODO:
 *		move into EZtestrun Class
 */
function setTestOkStatus(testrun)
{
	EZ.test.data.options.lastRunTime = EZ.formatDate();
	
	testrun.argDisplayCount = 0;
	testrun.ctxOk = testrun.argsOk = true;

	var allOk = testrun.allOk = {
		all: true,
		args: true,
		ignored: [],								//list of ignored idx's not ok
		used: [],									//list of idx's used for ok va
		override: '.allOk.override'.ov(testrun,[]),
		isNotSpecified: true						//true until used idx specified and not ok
	};
	var useAll = EZ.get('okReturnValueAll');
	
	testrun.why = [];								//why test pass / fail
	testrun.what = [];								//what arg_idx matters per rules
	if (testrun.notrun)
	{
		allOk.all = false;
		testrun.why.push('test NOT run'.wrap('<em>'));
		testrun.why.push(testrun.errmsg || 'reason N/A');
	}
	else
	{
		testrun.args_idx.forEach(function(idx)			//for: 'results', ['ctx'], [0-n]
		{
			var id = isNaN(idx) ? idx.substr(0,1).toUpperCase() + idx.substr(1) : 'Args';
			var why = [testrun.callArgNameCite[idx]];
			var expectedValue = getExpected(testrun, idx);

			if (useAll || EZ.get('ok'+id+'Validate'))				//argument must be ok			
			{ 
				if (!EZ.get('ok'+id+'NotSpecified') || expectedValue != EZ.test.notSpecified)
					testrun.what.push(idx);
			}
			var isOk = !testrun.argsChanged[idx]
					|| isEqual(testrun.actual[idx], expectedValue)
					|| isEqual(testrun.safe.actual[idx], expectedValue);
			var msg = testrun.isIgnoredArg(idx);
			if (msg)
			{
				isOk = allOk[idx] = true;
				testrun.argsDisplayed[idx] = false;
				why.push(msg);
				testrun.why.push(why.join('&nbsp;'));
				return;
			}
			var displayOpt = EZ.get('ok' + id + 'Show')
			testrun.argsDisplayed[idx] = displayOpt == 'always'
									  || (displayOpt.includes('changed') && testrun.argsChanged[idx])
									  || (displayOpt.includes('not') && !isOk)
									  || (displayOpt.includes('specified') && expectedValue != EZ.test.notSpecified)
			if (testrun.argsDisplayed[idx])
				testrun.argDisplayCount++;
			
			allOk[idx] = isOk;							//only set false if used

			if (isOk)
			{
				why.push('IS expected value');
				//why = [];
			}
			else
			{
				why.push('NOT expected value')
				allOk.some = false;						//something not ok but may not be used

				if (!useAll && !EZ.get('ok'+id +'Validate'))		
				{										//not used for ok value
					why.push('rules set to ignore')
					testrun.why.push(why.join('&nbsp;'));
					return allOk.ignored.push(idx);
				}
				if (expectedValue != EZ.test.notSpecified)
					allOk.isNotSpecified = false;

				else if (EZ.get('ok' + id + 'NotSpecified'))
				{
					why.push(EZ.test.notSpecified + ' ignored per rules')				
					testrun.why.push(why.join('&nbsp;'));
					return allOk.ignored.push(idx);		//not used when expected not specified
				}
				//why.push('caused test to fail');			
				allOk.all = false;						//only set false if used for ok value
				if (!isNaN(idx))
					allOk.args = testrun.argsOk = false;
			}
			allOk[idx] = isOk;							//only set false if used
			allOk.used.push(idx);
			testrun.why.push(why.join('&nbsp;'));
		});
	}	
	if (EZ.test.isRerun && EZ.test.data.okCheckedReset)
	{												//reset ok unless saved ok was false
		if (testrun.okChecked
		|| !testrun.savedResults || testrun.savedResults.ok === true)
			testrun.okChecked = undefined;
	}
		
	if (g.firstRunTests									//update why if 1st run
	&& testrun.savedResults && testrun.savedResults.ok !== true)
	{												//same code in formatNote()
		testrun.ok = testrun.testOk = allOk.all = false;
		testrun.why.push('saved expected results NOT correct'.wrap('<em>'));
	}
	else if (!testrun.notrun && allOk.all !== true)
	{
		testrun.why.push('Ok not checked'.wrap('<em>'));
	}
	EZ.set('okLabelDetails', testrun.why.join('\n'));
	
	allOk.run = allOk.all;
	if (testrun.okChecked !== undefined)
		allOk.all = Boolean(testrun.okChecked);

	testrun.ok = testrun.testOk = allOk.all;	//(allOk.all && allOk.results && allOk.save);
	if (allOk.isNotSpecified === true && allOk.all)
		delete allOk.isNotSpecified;
	//________________________________________________________________________________________
	/**
	 *	Determine if values are equal using okSettings rules
	 */
	function isEqual(fromValue, toValue)
	{	
		var opts = {
			keys: EZ.test.data.options.objectKeysSameOrder,
			ignore: EZ.test.data.options.objectTypeIgnore
		}
		var isEqual = EZ.isEqual(fromValue, toValue, opts);
		return isEqual;
	}
}
/*--------------------------------------------------------------------------------------------------
superceeds updateCounts() and depreicates lots of code in showCounts()

Determines all state based css (color code classes) for each test using  based on
current value of ok config settings, ok checkbox and test properties:

Uses EZ.markers() to remove prior test state based css classNames then sets those
for current test state.

called by validateResults() and updateOk() -- when Ok config not set to "legacy"
	if (EZ.get('validation') != 'legacy')

TODO:
	call from formatWarning()
--------------------------------------------------------------------------------------------------*/
function setTestStyles(testrun)
{
	var tip, okTitle, tooltip, style, testList = [];
	var testIdx = testrun.testno - 1;

	//__________________________________________________________________________________________
	/**
	 *	formatLog
	 */	
	var formatLog = function(log)
	{
		log = (EZ.isArray(log) && log.length) ? log.slice(1).join('\n')
											  : 'no details available';
		log = log.replace(/(!==)/g, '<em class="arrow">&#8596;</em>');
		return log;
	}
	//__________________________________________________________________________________________
	/**
	 *	set Ok (i.e. pass/fail) on TR and .okLabel styles / tooltip
	 */	
	var setOkStyles = function()
	{
		var okChecked = testrun.okChecked === true;	//pass or fail for BG color -- not 3way
		
		var okClass = okChecked ? 'pass' : 'fail';	//style set on TR
		testList.push(okClass);
		if (testrun.okChecked == 'some')
			testList.push('failOk');
	
		if (testrun.allOk.isNotSpecified)			//not ok because expected not specified
			testList.push('notSpecified');
	
		if (!testrun.argDisplayCount)
			 testList.push('noReturnValues');		//no results selected for display
		testrun.ok1st.forEach(function(filter)		//set styles for 1st time run
		{											//not updated if test rerun
			testList.push(filter + '1st');			//e.g. pass, fail, failOk, notsaved	
		});
		//______________________________________________________________________________
													//1st run
		var okChecked1st = '.ok1st.okChecked'.ov(testrun,okChecked);
		tip = 'test ' + (okChecked1st ? 'passed' : 'failed') + ' when 1st run ';
		if (okChecked != okChecked1st)
		{
			testList.push(okChecked ? 'passOkChecked1st' : 'failOkChecked1st');
			if (okChecked)
				tip += ' -- ' 
					 + (testrun.allOk.run ? 'now OK'.wrap('<i>') : '<i>OK checked</i>');
			else
				tip += ' -- ' 
					 + (!testrun.allOk.run ? 'NOT Ok now' : '<i>OK un-checked</i>');
		}
		okTitle.push( tip.wrap(okChecked ? '<b>' : '<em>') );
		EZ.set('okLabelDetails', testrun.why.join('\n'));
		return okChecked;
	}
	//__________________________________________________________________________________________
	/**
	 *	set lastrun changes styles
	 *	compares: lastrun to testrun.ok1st.okChecked -- ok color green or red if different
	 *			  only changes on reload or lastrun updated -- not rerun or ok checkbox
	 *
	 *		-AND- lastrun CallArgs, note, warnings to current test values (1st or rerun) ??
	 */	
	var setLastrunStyles = function(ok)	//true or false -- false for some
	{
		EZ.test.app.lastrun = EZ.test.app.lastrun || createLastRun();
		var oks = EZ.test.app.lastrun.oks = (EZ.test.app.lastrun.oks || {});
		
		var lastRunDiffAny = false;	
		var lastrun = EZ.test.app.lastrun.testrun[testIdx] || [];
		if (lastrun.okChecked !== undefined)	
		{												//lastrun defined
			var ok1st = lastrun.ok1st = (lastrun.ok1st || ok);			
			if (ok1st == lastrun.okChecked)
				testList.push('lastRunSameOk');
	
			else 
			{
				oks[testrun.testno] = lastrun.okChecked;				
				lastRunDiffAny = true
				testList.push('lastRunDiffOk');			
				testList.push(lastrun.okChecked ? 'lastRunPassOk' : 'lastRunFailOk');
				
				tip = lastrun.okRun ? 'test passed on last run'
									: 'test failed on last run';
				if (lastrun.okRun !== lastrun.okChecked)
					tip += ' but <i>"Ok was ' + (lastrun.okChecked ? 'checked' : 'un-checked') + '</i>"';
				okTitle.unshift(tip);	//.wrap('<p>')
			}
			if (lastRunDiffAny)
				testList.push('lastRunDiffAny');
												 		  //--------------------------------------\\
														 // changed args, note and warn tooltip(s) \\
			var tip = [];								//------------------------------------------\\
			var lastrun = 'EZ.test.app.lastrun.testrun.'.concat(testIdx).ov({});
			if (lastrun.changedDetail)					//changes found
			{											//may get called before changedDetail created
				var details = '';
				['args', 'note', 'warn'].forEach(function(key)
				{										
					var style = 'lastRunDiff' + key.toTitleCase();
					var tooltip = '.changedDetail.'.concat(key).ov(lastrun,[]).slice();
					if (tooltip.length)
					{
						tip.push(key);
						testList.push(style);
						details += key.wrap('<b>') 
								 + '<em class="floatRight marginLfetMore">'
								 + 'lastrun . . . now</em>\n'
						var text = formatLog(tooltip);	//TODO: more align / formatting?
						details += text + '\n';
					}
				});
				//var el = testrun.tags.EZ(style + 'Tip');
				var el = testrun.tags.EZ('lastRunDetails');
				EZ.set(el, details);
			}
			if (EZ.MSIE)								//TODO: html5 <details> tag -- not supported in IE
			{
				tip = tip.join(', ') + ' changed from lastrun -- click for details';
				testrun.tags.EZ('lastrunButton').title = tip;
			}
		}		
	}
	//__________________________________________________________________________________________
	/**
	 *	set style icon tooltips in note column
	 */	
	var setNoteStyles = function()
	{													//if any ignored return values failed but...
		if (testrun.allOk.ignored.length === 0)			//...not used for ok value -- frown icon
		 	tooltip = '...none...';
		else
		{											
			testList.push('ignored');
			tooltip = '.noteIgnored'.ov(testrun,['rerun for details']).join('\n');
		}	
		EZ.set(testrun.tags.EZ('ignoredTooltip'), tooltip);
		
		var details = [];
		var override = '.allOk.override'.ov(testrun, {});	//test script overrides
		var overrideList = Object.keys(override);
		if (overrideList.length === 0)
		 	tooltip = '...none...';
		else
		{											
			testList.push('override');
			tooltip = overrideList.join(', ');		
			
			overrideList.forEach(function(idx)				//override details
			{
				testList.push('scriptOver' + idx.toTitleCase());
				details.push( idx.wrap('<em>') );
				details.push( formatLog(override[idx]) );
			});
		}
		EZ.set(testrun.tags.EZ('overrideTooltip'), tooltip);
		EZ.set(testrun.tags.EZ('overrideDetails'), details.join('\n'));
		
		tooltip = [];										//changed args -- delta icon
		Object.keys(testrun.argsChanged).remove('results').forEach(function(idx)
		{
			if (!testrun.argsChanged[idx]) return;
			testList.push('argsChanged');
			var html = '<details onclick="EZ.event.cancel(event)">\n'
					 + '<summary>\n'
					 + '  <input type="image" src="../images/compare.png"'
					 + '   title="compare via winmerge"'
					 + '   onclick="compareResults({0},{1})"/>\n{2}\n'
					 + '</summary>\n'
					 + '<div class="pre">{3}</div>\n'
					 + '</details>';
			var values = [
				testrun.testno, idx.wrap("'"),
				testrun.callArgNameCite[idx],
				EZ.toArray(testrun.argsChangedDetails[idx]).join('\n')
			];
			tooltip.push( html.format(values) );
			if ((testrun.argsChangedDetails[idx]+'').includes('...NA...'))
				testList.push('argsChangedWarn');
		});
		if (tooltip.length)
		{
			var iconText = (tooltip.length <= 9) ? tooltip.length : '+';
			EZ.set(testrun.tags.EZ('argsChangedCount'), iconText);
			EZ.set(testrun.tags.EZ('argsChangedTooltip'), tooltip.join('\n'));
			
			var el = testrun.tags.EZ('argsChangedWrap');
			el.title = testList.includes('argsChangedWarn')
					 ? (el.getAttribute('alt') || '') : '';
		}
		
		//testrun.faults = 1
		if (!testrun.faults)								//faults	
		 	tooltip = '';
		else
		{							
			testList.push('faults');
			tooltip = EZ.s('# uncaught exceptions',testrun.faults);
			EZ.set(testrun.tags.EZ('faultsTooltipDetail'), testrun.faultsDetail.join('\n'));				
		}	
		EZ.set(testrun.tags.EZ('faultsTooltip'), tooltip);
	}
	//__________________________________________________________________________________________
	/**
	 *	set style associated with saved or not saved results
	 */	
	var setSaveStyles = function(okChecked)
	{
		if (!testrun.saveError)
			tooltip = '...none...';
		else 	
		{
			testList.push('saveError');
			tooltip = testrun.saveError;
		}
		EZ.set(testrun.tags.EZ('saveErrorTooltip'), tooltip);
		
		var tooltip = [];
		testList.push( testrun.savedResults ? 'saved' : 'notsaved')
		if (testrun.saveOk !== undefined) 		//if there are saved results
		{											
			tooltip.push('saved @ ' + testrun.savedResults.saveDateTime);
			var lastSaveDiffAny = false;
			if (okChecked == testrun.saveOk)
			{
				testList.push('lastSaveSameOk');
				testrun.tags.EZ('.okLabel').title = '';
			}
			else 
			{
				lastSaveDiffAny = true
				testList.push('lastSaveDiffOk');			
				testList.push(testrun.saveOk ? 'lastSavePassOk' : 'lastSaveFailOk');
			}
			if (lastSaveDiffAny)
				testList.push('lastSaveDiffAny');
	
			if (okChecked != testrun.saveOk)		//bright red/green border around save button if ok status
			{										//diff from saved ok status is clicked even for failOk
				style = (testrun.saveOk === true)  ? 'lastSavePass'
					  : (testrun.saveOk === false) ? 'lastSaveFail'
					  : (testrun.saveOk == 'some') ? 'lastSaveFailOk'
					  : '';
				testList.push(style);
			}
			else 	//if (!EZ.isEqual(testrun.actual, '.savedResults.actual'.ov(testrun)))
			{										//notify if results not same as saved...
				var opts = {						//...even if it does not matter for Ok
					keys: EZ.test.data.options.objectKeysSameOrder,
					ignore: EZ.test.data.options.objectTypeIgnore
				}
				var current = 'saved_current'
				testrun.args_idx.forEach(function(idx)				
				{													
					var actual = testrun.actual[idx]
					var saved = '.savedResults.actual.'.concat(idx).ov(testrun)
					if (EZ.isEqual(actual, saved, opts))
						return;							//saved still current
					
					if (testrun.what.includes(idx))	
						current = 'updated';			//out-of-date
					else if (current == 'saved_current')
						current = 'updatedNotUsed';		//updated but not used
				});
				testList.push(current);
				//if (current != 'updated')
				{
					style = (testrun.lastSaveOk === true) ? 'lastSavePass'
						  : (testrun.lastSaveOk === false) ? 'lastSaveFail'
						  : (testrun.lastSaveOk == 'some') ? 'lastSaveFailOk'
						  : '';
					if (style && testrun.lastSaveOk != testrun.saveOk)
						testList.push(style);
				}
			}
		}
		Object.keys(EZ.test.config.tooltips).forEach(function(style)
		{										//finish save tooltip from EZ.test.config.tooltips
			if (!style || testList.includes(style))
				tooltip.unshift(EZ.test.config.tooltips[style]);
		});
		//if (testrun.saveError)
		//	tooltip.push('technical difficulty on last save: '.wrap('<em>') + '\n' + testrun.saveError);
		
		testrun.tags.EZ('saveTooltip').innerHTML = tooltip.join('\n');
	}
	//__________________________________________________________________________________________
	/**
	 *	update test stlyes/stylesList if changed and associated counts
	 *	returns true if counts changed otherwise false;
	 */	
	var updateStyles = function()
	{											  //----------------------------------\\
		testList = testList.removeDups().sort(); //----- update testrun.styleList -----\\
		var priorList = testrun.styleList || [];//--------------------------------------\\
		if (EZ.isEqual(testList, priorList))		
			return false;						//bail if no changes
		
		var counts = 'EZ.test.data.counts='.ov({});
		while (style = priorList.shift())
			counts[style] = Math.max(0, counts[style]-1)
		testrun.styleList = testList;
												  //------------------------------------------\\
		if (testrun.markers)					 //----- update testrow styles and counts -----\\
			testrun.markers.clear();			//----------------------------------------------\\
	
		var markers = testrun.markers = EZ.markers(testrun.testno);
		var testStyles = EZ.test.config.testStyles;
		Object.keys(testStyles).forEach(function(className)
		{										//for all defined styles...
			counts[className] = counts[className] || 0;
			if (!testList.includes(className))
				return;							//skip className if test not using
	
			counts[className]++	
			var selectors = EZ.toArray(testStyles[className], ' ,');
			selectors.forEach(function(sel)
			{
				if (sel == '@')
					markers.add(testrun.tags, className);
				else if (sel.includes('='))
				{
					sel = sel.split('=');
					markers.add(testrun.tags.EZ(sel[0]), sel[1]);
				}
				else markers.add(testrun.tags.EZ(sel), className);
			});
		});
	}
	//==============================================================================================

	okTitle = [];
	var ok = setOkStyles();		//true or false -- false for some
	setLastrunStyles(ok);
	testrun.tags.EZ.set(['okLabelTooltip'], okTitle.join('<br>'));
	
	setSaveStyles(ok);
	setNoteStyles();
	
	return updateStyles();
}
/*-----------------------------------------------------------------------------------
update style for one or all tests
-----------------------------------------------------------------------------------*/
function updateTestStyles(testrun, isAll)
{
	var isAll = !testrun || isAll;
	var keys = (testrun) ? [testrun.testKey]
						 : Object.keys(EZ.test.data.testrun || []);

	keys.forEach(function(testKey)
	{
		var testrun = EZ.test.getTest(testKey);
		var isChange = setTestStyles(testrun);
		if (isChange && !isAll)		//update counts if style change and updating single test
			showCounts()
	})
	if (!testrun)
		showCounts()
}
/*----------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
function showCounts()
{
	var counts = EZ.test.data.counts;
	if (!counts)
		return;
	counts.all = counts.pass + counts.fail;						//update filter counts
	EZ.set('allCount', counts.all);
	EZ.set('passCount', counts.pass);
	EZ.set('failCount', counts.fail);
	EZ.set('failOkCount', counts.failOk);
	EZ.set('notSavedCount', counts.notsaved);

	EZ.set('savedCount', counts.saved);
	EZ.set('pass1stCount', counts.pass1st);
	EZ.set('fail1stCount', counts.fail1st);
	EZ.set('faultTestsCount', counts.faults);

	EZ.set('scriptOverCount', counts.override);
	EZ.set('scriptOverResultsCount', counts.scriptOverResults);
	EZ.set('scriptOverCtxCount', counts.scriptOverCtx);
	EZ.set('scriptOverArgsCount', counts.scriptOverArgs);

	EZ.set('lastRunDiffAnyCount', counts.lastRunDiffAny);	
	EZ.set('lastRunDiffOkCount', counts.lastRunDiffOk);
	EZ.set('lastRunSameOkCount', counts.lastRunSameOk);
	EZ.set('lastRunPassOkCount', counts.lastRunPassOk);
	EZ.set('lastRunFailOkCount', counts.lastRunFailOk);
	
	EZ.set('lastSaveDiffAnyCount', counts.lastSaveDiffAny);	
	EZ.set('lastSaveDiffOkCount', counts.lastSaveDiffOk);
	EZ.set('lastSaveSameOkCount', counts.lastSaveSameOk);
	EZ.set('lastSavePassOkCount', counts.lastSavePassOk);
	EZ.set('lastSaveFailOkCount', counts.lastSaveFailOk);
	
	EZ.set('lastRunDiffArgsCount', counts.lastRunDiffArgs);
	EZ.set('lastRunDiffNoteCount', counts.lastRunDiffNote);
	EZ.set('lastRunDiffWarnCount', counts.lastRunDiffWarn);
	
	EZ.set('lastSaveDiffArgsCount', counts.lastSaveDiffArgs);
	EZ.set('lastSaveDiffNoteCount', counts.lastSaveDiffNote);
	EZ.set('lastSaveDiffWarnCount', counts.lastSaveDiffWarn);

	if (EZ.get('validation') != 'legacy')
	{															//fail count BG red if any failed
		EZ.addClass('fail', 'failRed', counts.fail);
		EZ.addClass('fail1stButton', 'failRed', counts.fail1st);	

		EZ.addClass('scriptDiff','hidden', !counts.override);	//script override note

		if (counts.notsaved > 0)								//once shown, not hidden
			EZ.removeClass('notSavedButton', 'hidden');

		if (counts.failOk > 0)									//once shown, not hidden
			EZ.removeClass('failOkButton', 'invisible');

		//EZ.removeClass('saveAll', 'hidden', counts.all);		//update save all button
		var msg = (!counts.notsaved || counts.notsaved == counts.all)
				? 'All ' + (counts.all > 1 ? counts.all : '')
				: counts.notsaved + ' Updated';
		EZ('saveAll').value = 'Save ' + msg + ' Test Results';
		if (counts.saved)
			EZ.removeClass('deleteSaved','hidden');				//show top level delete icon
return;
	}
	//---------------------------------------------------------------------------------------
	// legacy mess
	//---------------------------------------------------------------------------------------
														//fail count BG red if any failed
	EZ('fail').style.backgroundColor = (counts.fail) ? 'red' : '';

//	var isSomeUpdated = !EZ('.save.hidden').undefined;
	/*
	var isSomeUpdated = EZ.get('alwaysShowSave') || EZ('.save',true).some(function(el)
	{													//show or hide  "save all" button
		return !EZ.hasClass(el, 'hidden');
	});
	EZ.removeClass('saveAll', 'hidden', isSomeUpdated);
	*/
	EZ.removeClass('allOk', 'some');					//remove .some from allOk
	var isSomeChecked = !EZ('.some').undefined;			//if any other checkbox has .some class

	var checked = isSomeChecked ? 'some'				//set allOk to .some if any other .some
				: counts.all == counts.pass ? true		//else set true if all checked
				: false;								//otherwise set checked false

	EZ.toggleCheckbox('allOk', checked, true);
	var is3way = isSomeChecked || EZ.test.data.testrun.some(function(testrun)
	{													//look for any unchecked 3way tests
		return (testrun.saveOk && !testrun.okChecked);
	});
	counts.is3way = is3way;
														//tr.controls has:notsaved saved updated
														//03-13-16: removed .updated
	//EZ.removeClass('saveAll', 'hidden', counts.all);	//update save all button
	var updateCount = EZ('.updated',true);
	updateCount = updateCount[0].undefined ? 0 : updateCount.length / 2;

	var msg = (updateCount == counts.all || updateCount === 0)
			? 'All ' + (counts.all > 1 ? counts.all : '')
			: updateCount + ' Updated';
	EZ('saveAll').value = 'Save ' + msg + ' Test Results';

	var notSavedCount = (EZ('.notsaved',true).length / 2 - 1)
					  - (EZ('.saved',true).length / 2 - 1)




	EZ.set('notSavedCount', notSavedCount);				//update not saved count
	if (notSavedCount > 0)
		EZ.removeClass('notSavedButton', 'hidden');
}
/*----------------------------------------------------------------------------------
Determines ok value and warning messages based on current Ok configuration settings.

called after each test function call, All OK checkbox clicked or Ok setting apply.

Validation determines if the test function returned the correct results.

There are 2 levels of validation one required and ther other optional.

	level 1:	Did function return the expected value or update object arguments
	required	as expected. For Array or Object prototype functions, is "this"
				supplied, the correct type and changed or not as expected?

	level 2:	Did the warning and/or error messages reported meet expectations?
	optional

Validation is usually simply based on whether or not the return value matches the
expected results

TODO: extended validation idea: 12-04-16
	.args innerHTML
		<span class="callArgs">&nbsp;&nbsp;EZ.returnValue_testBridge(&nbsp;<i>"return&nbsp;value"</i>,&nbsp;<i>{}</i>&nbsp;)</span><!-- allow wrap -->
		<div class="argDetail">
		  <pre>1st arg <cite>value</cite> "return value"</pre>
		  <pre>2nd arg <cite>options</cite> [Object]: 
		   returnType: *false*
		</pre>
		</div>
			

----------------------------------------------------------------------------------*/
function validateResults(testrun)
{
	var note = '';

	var reasons = [];
	testrun.ok = testrun.savedResults.ok === true;
	var ignoreHtml = EZ.get('validateIgnoreHtml');
	var ignoreWhitespace = EZ.get('validateIgnoreWhitespace');
	var validateKeys = EZ.test.getValidateKeys();

	testrun.matchKeys.remove('testno').forEach(function(key)
	{											//for each selected validateKey . . .
		if (!validateKeys.includes(key)) return;
		var was = testrun.savedResults[key];
		var now = prune(key);
												//ok if missing from both (e.g. errmsg)
		var msg = !(key in testrun) && !(key in testrun.savedResults) ? ''
				: !(key in testrun)              ? 'testrun.{0} missing'
				: !(key in testrun.savedResults) ? 'saved.{0} not found'
				: !EZ.equals(was, now)           ? 'testrun.{0} diff from saved'
				: '';
		if (msg)
		{
			msg = msg.format(key)
			reasons.push(msg);
		}
		/**
		 *	return testrun[key] -- prune if necessary
		 *	TODO: remove tags added by EZ.toString() for htmlformat EZ.equals(was, now)
		 *		  ignoreWhitespace and ignoreHtml validate settings
		 */
		function prune(key)
		{
			var value = testrun[key];
			if (key.startsWith('TODO: display_'))
			{
				if (ignoreWhitespace)
				{
					value = value.replace(/\s/g, '');
					was = was.replace(/\s/g, '');
				}
				if (ignoreHtml)
				{
					value = pruneHtml(value);
					was = pruneHtml(was);
				}
			}
			//===========
			return value;
			//===========
			function pruneHtml()
			{
				//value = value.replace(/id="EZ_[^"]*?"/g, 'id="EZ"');
				//replace(/<pre class="EZtoString"><span class="top" id="[^"]*">/g, '');
			}
		}
	});
	testrun.ok = testrun.saveOk;
	if (reasons.length > 0)
	{
		testrun.ok = (testrun.ok === true) ? 'some' : false;
		note = '<i>***TEST RESULTS DO NOT MATCH SAVED RESULTS***\n\t'
			 + reasons.join('\n\t')
			 + '</i>';
	}
	else
	{
		note = testrun.updated ? 'SELECTED validation results match saved results'
							   : 'All current test results match saved results (extended ??)';
		if (testrun.ok !== true)
			note += '\n<i>*** Ok NOT checked ***</i>';
	}
	if (note)
		testrun.note += note;
	//displayNote(testrun, {validate:note});
	//return filters;
}
/*-----------------------------------------------------------------------------------
-----------------------------------------------------------------------------------*/
function formatValue(obj, maxchars, callback)
{
	var value = EZ.format.value(obj, maxchars, callback);	//use if not [Object]

	if (value
	&& (value.startsWith('[') || value.startsWith('{')))
		value = callback ? callback() : value;				//otherwise get more detail

	else if (value === 'true')
		value = EZ.TRUE;

	else if (value === 'false')
		value = EZ.FALSE;

	else if (value === '')
		value = EZ.BLANK;

	else if (value === 'null')
		value = EZ.NULL;

	else if (value === 'undefined')
		value = EZ.UNDEFINED;

	else if (value === 'NaN')
		value = EZ.NAN;

	//already done in EZ.format.value()
	//else if (typeof(obj) == 'string')
	//	value = value.wrap('"');

	return value;
}
/*-----------------------------------------------------------------------------------
As of 06-01-2016: only used for argument detail
think idea is to use formatValue() when less than 40 char
	maxchars = maxchars || 40;
-----------------------------------------------------------------------------------*/
function formatArgument(obj, objName)
{
	//return formatObject(obj, EZ.get('displayFormatArgs'), objName);
	return formatValue(obj, 40, function()
	{
		var fmt = EZ('useResultsFormatterArg').checked ? 'Actual' : 'Args'
		var opts = {
			formatter:EZ.get('displayFormat' + fmt), 
			sort:EZ.get('displayFormatSort' + fmt) || false
		}
		//var opts = {formatter:EZ.get('displayFormatArgs'), sort:EZ.get('displayFormatArgsSort') || false}
		return formatObject(obj, opts, objName);
	});
}
/*-----------------------------------------------------------------------------------

-----------------------------------------------------------------------------------*/
function isNotSpecified(value)
{
	return typeof(value) == 'string' && value == EZ.test.notSpecified;
}
/*-----------------------------------------------------------------------------------

-----------------------------------------------------------------------------------*/
function formatResults(obj, objName, className)
{
	/*
	var objFn = function()
	{
		return formatObject(obj, EZ.get('sharedResultsFormatter'), objName);
	};

	return (obj != EZ.test.notSpecified) ? formatValue(obj, 40, objFn)
		  : (objName && objName != '@' ? objName + ' ' : '') + EZ.test.notSpecified;
	*/
	className = (className == 'expected') ? 'Expected' : 'Actual';
	var opts = {
		
		formatter:EZ.get('displayFormat' + className), 
		sort:EZ.get('displayFormatSort' + className)
		
	//	formatter:EZ.get('sharedResultsFormatter'), 
	//	sort:EZ.get('sharedResultsFormatterSort')
	}
	if (!opts.formatter)
	{
		addInfo('No formatter specified for: ' + (objName || 'results') + ' -- using EZ.toString()', true);
		opts.formatter = 'EZtoString';
	}


	var msg = !isNotSpecified(obj) ? formatObject(obj, opts, objName)
			: (objName && objName != '@' ? objName + ' ' : '') + EZ.test.notSpecified;
	return msg;

}
/*-----------------------------------------------------------------------------------
-----------------------------------------------------------------------------------*/
function formatObject(obj, options, objName)
{
	objName = objName || '';
	options = (options instanceof Object) ? options : {formatter:options};
	var formatter = options.formatter;
	
	var toStringOptions = {timestamp: false};
	var stringifyOptions = {all: true, spaces:2};

	var tags = EZ(['opt'], '.displayOptions');	
	tags.forEach(function(tag)					//get latest toString() or stringify() options
	{											
		var id = tag.id || '';
		var key = id.replace(/(toString|stringify|display)_/, '');
		//12-01-2016: was retuning true for display_exclude not value "Function"
		//var value = EZgetFieldValue(tag);
		var value = EZ.get(tag);

		if (id.startsWith('toString_'))
			toStringOptions[key] = value;

		else if (id.startsWith('stringify_'))
			stringifyOptions[key] = value;
		//	stringifyOptions += ' *' + key + '=' + value;

		else if (id.startsWith('display_'))
		{
			toStringOptions[key] = value;
			stringifyOptions[key] = value;
//			stringifyOptions += ' ' + key + '=' + value;
		}
	});
												//apply column format options
	stringifyOptions = EZ.options.call(stringifyOptions, options);
	toStringOptions = EZ.options.call(toStringOptions, options);
//	if (toStringOptions.sort != null && toStringOptions.sortkeys != null)
//		delete toStringOptions.sortkeys;		//sort has precedence
	
	var json;
	//----------------------------
	if (formatter == 'none')
	//----------------------------
	{
		json = obj + '';
		json = json.replace(/</g, '&lt;');
	}
	//----------------------------
	else if (formatter == 'EZtoString')
	//----------------------------
	{
		var excludeList = EZ.toArray( EZ.get('exclude_more_list'), ' ,');
		if (excludeList.length && EZ.get('exclude_more'))
			toStringOptions.exclude = EZ.toArray(toStringOptions.exclude).concat(excludeList);
		toStringOptions = EZ.options.call(toStringOptions, options);
		
		if (objName == '@')
			objName = '@'.dup(10);

		json = EZ.toString(obj, objName , toStringOptions);
	}
	//----------------------------------
	else if (formatter == 'EZstringify')
	//----------------------------------
	{										//RegExp displayed as object ??
		var type = getType(obj) == 'RegExp' ? 'object'
				 : typeof(obj);

		switch (type)
		{
			case 'undefined':
				json = EZ.UNDEFINED;
				break;

			case 'boolean':
				json = (obj) ? EZ.TRUE : EZ.FALSE;
				break;

			case 'number':
				json = isNaN(obj) ? EZ.NAN : obj;
				break;

			case 'function':				//TODO: how should functions display??
				break;

			case 'object':
			{
				if (obj == null)
					json = EZ.NULL;
				else
				{
					if (EZ.isObjectCircular(obj))
						json = EZ.toString(obj, objName , toStringOptions);
					else
						json = EZ.stringify(obj, stringifyOptions);
				}
				break;
			}
			case 'string':
			{
				json = !obj ? EZ.BLANK
					 : '"' + obj.replace(/"/g, '\\"') + '"';
				break;
			}
		}
		if (objName && objName != '@')
			json = objName + ' = ' + json;

		json + '\n';
	}
	//json = json.replace(/</g, '&lt;');
	return json;
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
(function jshint_global_bottom_not_used() {})	//does not work at top
