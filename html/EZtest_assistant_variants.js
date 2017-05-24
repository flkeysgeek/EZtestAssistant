/*--------------------------------------------------------------------------------------------------
Dreamweaver LINT global references and definitions  not used here
--------------------------------------------------------------------------------------------------*/
/*global 
EZ, DWfile, 

addInfo, showCounts, showLastSelected,
sortTestResults, EZformatdate, dimOther,
ready, 
toggleScroll, toggleRunHighlightedButton,
positionRightFlags,
starburst,
bindOverride,

e:true, g:true, dw:true, f:true
*/
var e;			//global var for try/catch
(function() {[	//global variables and functions defined but not used
bindOverride,

e, f, g, dw, DWfile ]});
/*--------------------------------------------------------------------------------------------------
EZ.test.message(o, options)
String.formatStack(options)

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
EZ.test.message = (function _____EZtest_message_____()
{
	//__________________________________________________________________________________________________
	/**
	 *	constructor for _init() -- subsequently calls defaultFunction
	 */
	function EZtest_message(messageName, opt)
	{
		var me = arguments.callee;
		if (this instanceof me)						//called as constructor...	[1] code at top variant
		{			
			return this;
		}
		//______________________________________________________________________________________________
		/**
		 *	display and/or log message -- remove message clutter from more important logic
		 *
		 *	HUGE help in runTestScript_before() and runTestScript_finish()
		**/
		var msg, more;
		var messages = {};							//saved messages
		var v = '.test.data.variants._vShared'.ov(EZ);
		var critical = 'highlight warn';
		var highlight = 'highlight';
		
		switch (messageName)
		{
			//EZ.test.message('messageName');
			//------------------------------------------------------------------------------------
			case 'messageName': 	
			//------------------------------------------------------------------------------------
			{
				break;
			}
			//------------------------------------------------------------------------------------
			case 'messageName': 	
			//------------------------------------------------------------------------------------
			{
				break;
			}
			//------------------------------------------------------------------------------------
			case 'ready': 	
			//------------------------------------------------------------------------------------
			{
				EZ.timer('ready', true);
				if (opt)
					EZ.displayMessage(opt);
				EZ.message.reset();
				
				var optionsLoaded = !g.firstRun || 'EZ.test.app.files.options.status'.ov();
				if (optionsLoaded !== true)
				{
					addInfo('options not loaded: ' + optionsLoaded, critical)
				}
				else if (optionsLoaded == 'restored')
				{
					addInfo('options restored'.bold(), highlight);
					EZ.show('debugSettings');
				}
				return;
			}
			//------------------------------------------------------------------------------------
			case 'testScriptSetup': 	
			//------------------------------------------------------------------------------------
			{
				EZ.removeClass('runButton', 'hidden');
				starburst('runButton');
				EZ('data').style.opacity = '1';
				
				var msg = EZ.test.data.funcName + '()'
						+ EZ.s(' &nbsp;# test', EZ.test.data.testCalls.length) + ' found ';
				
				if (v.counts.prescan)
					msg += EZ.s('# variants', v.counts.prescan.wrap('()'));
				
				addInfo(msg);
				messages.loaded = msg;
				
				var total = EZ.timer('').total;
				addInfo(EZ.format.seconds(total) + ' seconds');
				
				break;
			}
			//------------------------------------------------------------------------------------
			case 'loadScriptScript': 	
			//------------------------------------------------------------------------------------
			{
				var file = opt;
				
				var note = '';
				//var size = 0;
				if (!file.timestamp)
					note = ' (does not exist)';
				
				//else if (file.timestamp != cache.scriptTimestamp)
				//	size = file.size = DWfile.getSize(file.filename);
				
				note = note || (file.size ? ' (empty)' : '')
				if (EZ.test.data.url != file.url)
					note = 'running embedded test script  -- external script: ' + note;
				EZ.set('scriptFileNote', note + ':');
				break;
			}
			//------------------------------------------------------------------------------------
			case 'testScriptBeforeAny': 	
			//------------------------------------------------------------------------------------
			{
				msg = (v && v.state == 'prescan') ? 'finding variants'
					: (EZ.test.isRerun) ? 'Rerun test #' + EZ.test.isRerun
					: 'Running ' + EZ.s(EZ.test.data.options.onlyList.length, 'test');
				msg +=	' for: ' + EZ.test.data.fnStatement;
				EZ.addClass('message','blink', !EZ.test.isRerun);

				EZ.removeClass('runButton' ,['blink', 'starburst'])
				EZ.addClass(['noteHeading', 'noteHelpIcon'], 'hidden');
				//EZ.hide('.helpBox');
				EZ.popup.hide();
				break;
			}
			//------------------------------------------------------------------------------------
			case 'testScriptBefore_prescan': 	
			//------------------------------------------------------------------------------------
			{
				addInfo('test function ' + (v.legacyCode ? 'DOES' : 'does NOT') + ' contain legacy code');
				addInfo('test script ' + (v.argumentVariants ? 'DOES' : 'does NOT') + ' contain argument variants');
				addInfo('prescan test script...')
				break;
			}
			//------------------------------------------------------------------------------------
			case 'testScriptBefore_firstRun': 	
			//------------------------------------------------------------------------------------
			{
				addInfo('test script first run...')
				EZ.test.mruTests.updateTestList();

				if (!v) break;
				v.legacyOpts = EZ.get('testLegacyOpts') || '';
				v.legacyEnabled = EZ.get('testLegacyEnabled');
				v.legacyValues = EZ.get('testLegacyValues').split(/\s+/);
				v.legacyValues = [EZ.el.options[0].value, EZ.el.options[1].value].extract(v.legacyValues);
				
				v.legacyTextValues = [EZ.el.options[0].text, EZ.el.options[1].text];														
				if (v.legacyValues.length == 1)
					v.legacyTextValues.splice(EZ.selectedIndex,1);
				for (var i=0; i<v.legacyValues.length; i++)
					v.legacyTextValues[i] += v.legacyValues[i] == (v.legacyDefault += '')
										? ' (default)' : ' (not default)';
							
				if (v.legacyEnabled && !v.legacyCode)
				{
					v.legacyEnabled = false;
					addInfo('test function does NOT contain legacy code -- option ignored');	
				}
				
				v.argumentVariantsEnabled = EZ.get('testVariants');
				if (v.argumentVariantsEnabled && !v.argumentVariants)
				{
					v.argumentVariantsEnabled
					addInfo('test script does NOT contain argument variants -- option ignored')
				}
				break;
			}
			//------------------------------------------------------------------------------------
			case 'prescan-done': 	
			//------------------------------------------------------------------------------------
			{
				if (v.counts.prescan)
					msg = EZ.s('# variants', v.counts.prescan) + ' found';
				else
					msg = 'no variants found';
				addInfo(msg);
				return ready(msg);
			}
			//------------------------------------------------------------------------------------
			case 'anyRun_done': 	
			//------------------------------------------------------------------------------------
			{
				var cloneFails = 'EZ.clone.counts.fails'.ov();
				if (cloneFails)
				{
					EZ.removeClass('goto_exceptions', 'hidden');
					msg = EZ.s('# EZ.cloneObject fails',cloneFails) + ' -- for details see EZ.log[clone]';
					EZ.el.title = msg;
				}
		
				if (opt === 0)				//&& disableOption('autorun');
					msg = 'No tests completed -- ' 	+ messages.loaded;
																		
				break;
			}
			//------------------------------------------------------------------------------------
			case 'firstRun_done': 	
			//------------------------------------------------------------------------------------
			{
				//================
				var counts = opt;
				//================
				v.legacyOpts = (EZ.get('testLegacyOpts') || '');
				v.compare = (v.legacyOpts.includes('compare') 
						  && v.legacyEnabled && v.legacyValues.length > 1);
		
				if (EZ.test.data.callbacks.exfn.length)
					addInfo('exfn callback for tests: ' + EZ.test.data.callbacks.exfn.toRanges())
				if (EZ.test.data.callbacks.notefn.length)
					addInfo('notefn callback for tests: ' + EZ.test.data.callbacks.notefn.toRanges())
				
				if (v.compare)
				{
					if (v.diffLegacyResults)
						addInfo('tests with DIFF legacy/non-legacy results: ' + v.diffLegacyResults.toRanges());
					else
						addInfo('ALL test return SAME results for legacy/non-legacy')
					
					msg = EZ.mergeMessages(v.compareMessage);
					if (msg)
						addInfo('test script legacy options: ' + msg);
					
					EZ.set('diffLegacyCount', v.counts.diffLegacy);
				}
				
				var vCount = '.counts.run'.ov(v,0);
				msg = EZ.s('# tests', counts.all - vCount) + ' completed'
				if (vCount)
					msg += ' ' + EZ.s('# variants', vCount).wrap('()');
				msg += counts.fail ? ' ' + counts.fail + ' FAILED' : ' sucessfully';
				addInfo(msg);
				
				if ('EZ.test.app.lastrun.testrun'.ov())	
				{
					more = (counts.lastRunDiffAny === 0 ? 'NO ok changes'				
						 : EZ.s('# ok changes', counts.lastRunDiffAny))
						 + ' from last run';	
					var timestamp = 'EZ.test.app.files.lastrun.timestamp'.ov();
					if (timestamp)
						more += '  @ ' + timestamp;	
					msg += ' -- ' + more;
					addInfo(more.toLowerCase());
				}
				
				var total = EZ.timer('').total;
				//	if (EZ.timer.log)
				//		msg += '\n' + EZ.timer.log.slice().format().join('\n');
				addInfo(EZ.format.seconds(total) + ' seconds');
				
				EZ.timer(null);								//clear timer
				///	EZ.timer.stop();							//stop timer
				break;
			}
			//------------------------------------------------------------------------------------
			case 'rerun_done': 	
			//------------------------------------------------------------------------------------
			{
				var testrun = EZ.test.getTest(EZ.test.isRerun);
				var ok = testrun.ok;
				msg = 'Test ' + testrun.testKey + ' rerun and '
					+ (ok ? 'passed' : 'FAILED')
					+ ' @ ' + EZformatdate('','time');
				EZ.displayMessage(msg);
				dimOther(testrun, false);			//un dim non-rerun test
				break;
			}
			//------------------------------------------------------------------------------------
			default:	return EZ.oops('unknown message name: ' + messageName, opt)
			//------------------------------------------------------------------------------------
		}	
		EZ.displayMessage(msg);
	}
	//__________________________________________________________________________________________________
	/**
	 *	Creates new instance of EZreturnValue() only used to copy all properties and prototypes to 
	 * 	global (pseudo static) EZ.test.message function() which acts as container for all associated
	 *	properties and prototype functions and can be called as a valid constructor.
	 *	...or...
	 *	creates new instance but copies all properties and prototypes to global instance (pseudo static)
	 *	 EZ.test.message() is valid constructor -or- can call defaultFunction with "this" context.
	 */
	var _init = function _init()
	{
		var fn = new EZtest_message();					//create instance for EZ.clone
		for (var key in fn)
			EZtest_message[key] = fn[key];
			
		return EZtest_message;
	}	
	//==================================================================================================
	return _init(arguments.callee.name);
})();
//________________________________________________________________________________________
/**
 *	runs test once for each argument -- each argument is array passed as call arguments
 *	TODO: preliminary variants -- doubt ever completed NOT well tested
 */
EZ.test.runs = function EZtestRuns()
{
	var testOptions = EZ.testOptions;
	[].slice.call(arguments).forEach(function(args, idx)
	{
		EZ.testOptions = testOptions;
		EZ.test.run.apply(Number(idx), args);
	});
}

/*--------------------------------------------------------------------------------------------------
EZ.test.variants() class -- called from setupTestScript()

Initially created for variants but also includes: runTestScript() and scrollbar functions
added because they were so closely coupled to each other.

TODO: is really becoming: EZ.test.data() class
--------------------------------------------------------------------------------------------------*/
EZ.test.variants = function ___EZtest_variants___(fnScript, testScript)
{
	this._testrun = EZ.test.data.testrun;	//convenience reference

	addInfo();
	EZ.set('testInfoName', EZ.test.data.funcNameReal);
	
	//______________________________________________________________________________________________
	/**
	 *	internal interface
	**/
	function ___MESSAGE___(name, opt)
	{
		return EZ.test.message(name, opt);
	}
	
	//_________________________________________________________________________________________________
	e = function _____RUN_ALL_TEST_SCRIPTS_____() {}
	//_________________________________________________________________________________________________
	/**
	 *	called by "rerun" button -or- setupTests() if autorun after specified test script parsed
	 *	and EZ.test.data initialized for specified test script.
	 *	
	 *	calls test script which contains calls to EZ.test.run() for each test -- when called by
	 *	rerun button (EZ.test,isRerun > 0), EZ.test.run() only runs test associated with button
	**/
	this.runTestScript = function ___runTestScript(testKey)
	{
		//========================================================================
		EZ.test.data.variants.runTestScript_before(testKey);
		//========================================================================
		setTimeout( function()						//new thread so screen updates
		{											
			//bindOverride(true)
			EZ.test.testScript();
			//bindOverride(false)
			//====================================================================
			EZ.test.data.variants.runTestScript_finish();
			//====================================================================
		}, 250);									//give hourglass time to load
	}
	//______________________________________________________________________________________________
	/**
	 *	called before test script starts -- new code added for variants
	 *	testKey supplied to rurun test (currently single variant).
	**/
	this.runTestScript_before = function runTestScript_before(testKey)
	{
		this.testnoReset();					//reset testno / testkey
		EZ.cloneDev.infoClear();
		delete EZ.clone.counts;
		
		EZ.addClass('dataBody','dim');
		EZ.addClass('goto_exceptions', 'hidden');
		EZ.el.title = EZ.el.alt;
		
		EZ.test.data.settings = {};
		EZ.test.skipCount = 0;
		EZ.test.onlyList = '.options.onlyList'.ov(EZ.test.data, []);
		EZ.test.skipList = '.options.skipList'.ov(EZ.test.data, []);
	
		EZ.test.data.exFrom = EZ.get('exFrom');
	
		EZ.test.isRerun = testKey;
		if (EZ.test.isRerun) 
			EZ.timer();
	
		___MESSAGE___('testScriptBeforeAny');

		EZ.test.app.state = (EZ.test.isRerun) ? 'rerun' 
						  : (EZ.test.app.state != 'ready') ? 'autorun' : 'running';
		
		EZ.test.data.okCheckedReset = EZ.get('rerunOkCheckedReset');
		EZ.test.data.validation = EZ.get('validation');
		
		EZ.removeClass('body', 'notRun');
		
		if (EZ.test.app.firstRun === undefined)
			EZ.test.app.firstRun = true;
													
		if (this.getState() == 'prescan')						
		{
			___MESSAGE___('testScriptBefore_prescan');
		}
		else if (this.getState() == 'firstRun')				//for firstRun get current options
		{													//...and init legacyTextValues
			___MESSAGE___('testScriptBefore_firstRun');
		}
		else if (this.getState() != 'prescan')
		{
			this.setState('rerun');
		}
	}
	//______________________________________________________________________________________________
	/**
	 *	called after test script done -- previously: displayStatus();
	 */
	this.runTestScript_finish = function runTestScript_finish()
	{
		var state = this.getState();
		EZ.removeClass('message','blink');
		
		if (state == 'prescan')					//bail if just finding variants
			return ___MESSAGE___('prescan-done');

		else if (state == 'firstRun')
			this.setState('testsRun');
		
		if (EZ.test.data.settings && EZ.test.data.settings.final)
			EZ.test.data.settings.final();		//final test script callback
		
		var testCount = Object.keys(EZ.test.data.testrun).length;
				
		___MESSAGE___('anyRun_done', testCount);
		
		if (!testCount) return ready();

		if (!EZ.test.isRerun)
			g.firstRunTests = true;

		var counts = EZ.test.data.counts;
		if (!counts) return;
		
		if (counts.failOk > 0)
		{										//removed but not added
			if (EZ.hasClass('failOkButton', 'invisible'))
				EZ.removeClass('failOkButton', 'invisible');
		}
		showCounts();							//set EZ.test.data.topTagsDisplayed[]
												//and EZ.test.data.testsDisplayed[]
		if (!EZ.test.isRerun)					//display status msg after all tests 1st run
		{
			sortTestResults();					//put savedResults in proper order
			___MESSAGE___('firstRun_done', counts);
			
			//var count = EZ.toInt(EZ.get('todoOrphanCount'));
			//EZ.addClass('todoCountWrap', 'orphans', count);
		}
		else									//display status msg after single test rerun
		{
			___MESSAGE___('rerun_done');
		}

		//EZ.capture.display();					//update capture display

		/*before capture
		if (EZ.fault.count)
		{
			EZ.set('createScriptCount', EZ.fault.count);
			EZ.removeClass(EZ('createScript'), 'hidden');
		}
		*/
		
		EZ.test.data.variants.initScroll(EZ.test.isRerun);
		
		EZ.message.wait('applying scrollbar settings', 'expandAllWrap');
	}
	//______________________________________________________________________________________________
	e = function _____scrollbar_functions_____() {}
	//______________________________________________________________________________________________
	/**
	 *	set div.width = minWidth etc...
	 */
	this.initScroll = function initScroll(testKey)
	{
		var isFilterChange = (testKey === true);
		var scrollDefault = {
			isCollapse: false,
			height: 0,
			maxWidths: {},		//set to column format settings
			minWidths: {},		//			''		''		''
			autofit: {			//TODO:
				expandCol: {},
				allowTableScroll: {},
				maxAutoWidth: {args:0, results:0, expected:0, note:0},
				maxWrapWidth: {args:0, results:0, expected:0, note:0},
				extra: 9999,
				need: 0,
				usedWidth: {args:0, results:0, expected:0, note:0},
				autoRowHeights: []
			},
			testsDone: [],
			tagData: [],		//scrolled div tags
			tagIndex: [],		//index into tagData by scroll element
			tagLists: {},		//list of tag indexes by scrollClass
			rowList: [],		//list of updated scroll rows
			testnoList: [],
			expanded: {			//list of expanded div tags
				widths: {},		//...by scrollClass
				heights: {}		//...by test row
			},					//list of all currently expanded tags
	
			counts: {all:0, args:0, results:0, expected:0, note:0},
			classNames: ['args', 'results', 'expected', 'note'],
			settings: ['CallArgs', 'Actual', 'Expected', 'Note'],
			cssRunTags: {}		//css set by EZ.test.run() for each test run
		}
		var options = EZ.test.data.options || {};
		var scroll = EZ.test.data.scroll = scrollDefault;		//(EZ.test.data.scroll ||);
	
		EZ('fnStatement').style.display = 'none';		//hide to analyize scroll columns
	//	var fnStatement = EZ('fnStatement');
	//	fnStatement.style.display = 'none';				//hide to analyize scroll columns
	//	EZ('fnStatementCol').style.width = fnStatement.style.width = '';
	
		var dataBody = EZ('dataBody');
		var height = EZ.get('maxHeightTestRows') + 'px';
		dataBody.style.height = '';
		dataBody.style.minHeight = height;				//TODO: new setting ??
		dataBody.style.maxHeight = height;
	
		EZ.removeClass(EZ('scrollWidth', true), 'scrollWidth');
		EZ.removeClass(EZ('scrollHeight', true), 'scrollHeight');
		EZ.removeClass(EZ('expandWidth', true), 'expandWidth');
		EZ.removeClass(EZ('expandHeight', true), 'expandHeight');
		scroll.classNames.forEach(function(className, idx)
		{												//get each scroll column settings for widths
			var settings = scroll.settings[idx];
			if (!settings) return;
	
			var minWidth = scroll.minWidths[className] = Math.max(options['minWidth' + scroll.settings[idx]], 100);
			scroll.maxWidths[className] = Math.max(options['maxWidth' + scroll.settings[idx]], minWidth);
			scroll.autofit.expandCol[className] = '.expandCol'.concat(settings).ov(options, false);
			scroll.autofit.allowTableScroll[className] = '.allowTableScroll'.concat(settings).ov(options, false);
		});
	
		EZ.addClass('dataBody','dim');
	
		EZ.test.data.testsDisplayed = [];				//list of displayed tests for updateScrollBars()
		EZ.test.data.topRowsDisplayed = [];
		var topRows = EZ('topTestRow', true);
		[].forEach.call(topRows, function(tr)
		{
			if (EZ.getStyle(tr, 'display') == 'none') return;
			EZ.test.data.topRowsDisplayed.push(tr);
	//		var testno = tr.EZ('testno').innerHTML;
			var testrun = EZ.test.getTest(tr);
			var testKey = testrun.testKey;
			EZ.test.data.testsDisplayed.push(EZ.toInt(testKey));
		});
	
		var rows = EZ.test.data.topRowsDisplayed;
		rows.forEach(function(tr)						//init scroll td/div column css
		{
			if (testKey && testKey !== true && false) 
				return;									//TODO: only clearing rerun test
	
			scroll.classNames.forEach(function(className)
			{
				var div = tr.EZ(className);
				var td = div.parentElement;
				td.style.width = '';
				div.style.marginRight = '';
				div.style.maxWidth = '';
				div.style.width = scroll.minWidths[className] + 'px'
				div.style.overflow = 'scroll';		//always scrollbars until div/td widths set
			//	div.style.background =  'grey',		//test aid
			});
		});
		if (isFilterChange)
		{
			EZ('data').style.width = '';
			EZ.test.data.variants.updateScrollBars();
		}
		else EZ.queue(EZ.test.data.variants.updateScrollBars);
	}
	//______________________________________________________________________________________________
	/**
	restore scroll state for last testKey (after scroll settings applied) 
	or all rows if right flag [+] clicked
	
	update data table width and positionRightFlags.
	 */
	this.restoreScrollState = function restoreScrollState(testnoLastSelected)
	{
		var scroll = EZ.test.data.scroll;						
		
		var expandPending = EZ.test.app.expandPending;
		if (expandPending)
			testnoLastSelected = '';
		else
			expandPending = EZ.test.app.expandPending = [];
		
		var rows = EZ.test.data.topRowsDisplayed;
		rows.forEach(function(tr)				
		{										
	//		var testno = EZ.toInt(EZ('testno', tr));
	//		var testrun = EZ.test.data.testrun[testno - 1];
			var testrun = EZ.test.getTest(tr);
			var testKey = testrun.testKey;
			
			var expandedRow = '.options.expandedScroll.'.concat(testKey).ov(EZ.test.data);
			if (!expandedRow)
				return;
			else if (testKey != testnoLastSelected && testnoLastSelected)
				return expandPending.push(tr);
			
			var isAnyExpand = false;
			scroll.classNames.forEach(function(className)	//for all scroll columns...
			{
				var expanded = expandedRow[className] || [];
				EZ.toArray(expanded).forEach(function(scrollClass)		//for all prior expanded columns...
				{
					var el = testrun.tags.EZ(className);
					toggleScroll(el, scrollClass, true);	//expand
					EZ.addClass(el, scrollClass);
					isAnyExpand = true;
				});
			});
			if (isAnyExpand)
				toggleScroll(testrun.tags.EZ('expandOne'), 'expandOneUpdate');
		});
																//data table width
		var width = (2 * EZ.toInt( EZ.getStyle('data','border-width')) )
				  + EZ.toInt( EZ.getStyle('data','width'));
		EZ('data').style.width = width;
			
		positionRightFlags();
				
		EZ.queue(ready);
	}
	EZ('restoreScrollStateIcon').onClick = this.restoreScrollState;
	
	//______________________________________________________________________________________________
	/**
	1st sync td column and inner div width / height -- then add scroll icons where needed.
	
	Called after tests 1st run, when toggleFilter changes (if new 1st tests displayed) and after any
	test rerun.  Must be called after screen display updated i.e. via setTimeout().
	
	//1st sync width/height of <td> / <td><div>
	//for all displayed tests not already done
	
	Assumes showCounts() has created: EZ.test.data.topTagsDisplayed[] / testsDisplayed[]
	 */
	this.updateScrollBars = function updateScrollBars(isFilterChange)
	{
		var filter = EZ.get(EZ('show',true)).getCheckedTags('radio')[0];
		if (filter)
		{
			var count = EZ.test.data.counts[filter.alt];
			var total = EZ.test.data.counts.all;
			var isShow = count && count < total;
			EZ.addClass('runDisplayedTests', 'visible', isShow);
			toggleRunHighlightedButton();
		}
		
		var scroll = EZ.test.data.scroll;
		if (isFilterChange)							//on filter change, check for new rows
		{
			var isRowDisplayed = false;
			var topRows = EZ('topTestRow', true);	//list of all test rows
			var isNewRows = ![].every.call(topRows, function(tr)
			{
				if (EZ.getStyle(tr, 'display') == 'none')
					return true;					//continue if not displayed
				
				isRowDisplayed = true;
				return EZ.test.data.topRowsDisplayed.includes(tr);
			});
			EZ.removeClass('dataHead', 'noTestsDisplayed', isRowDisplayed);
			if (!isNewRows) 
			{
				return EZ.message.reset();
			}
			EZ.addClass('dataBody','dim');
			setTimeout("initScroll(true)", 0);
			return;
		}
	
		var rows = EZ.test.data.topRowsDisplayed;	//.remove(scroll.testsDone);
		EZ.removeClass('dataHead', 'noTestsDisplayed', rows.length > 0);
		
		for (var pass=1; pass<=3; pass++)
		{
			rows.forEach(function(tr, rowIdx)
			{
				var totalScrollCols = 0;
				var testnoCount = 0;
				var extra = 0;
				var need = 0;
				var maxRowHeight = 0;
			//	var testno = EZ.toInt( EZ.get(EZ('testno',tr)) );
				var testrun = EZ.test.getTest(tr);
				var testKey = testrun.testKey;
				
				var isDisplayed = (EZ.getStyle(tr, 'display') == 'none');
				void(isDisplayed);
	
				scroll.classNames.forEach(function(className)
				{										//for each scroll column . . .
					var div = EZ(className, tr);
					var td = div.parentElement;
					var tagIdx = scroll.tagIndex.indexOf(div);
					var data = (pass < 3) ? getScrollData(div, td, className, pass==2)
										  : scroll.tagData[tagIdx];
					data.rowIdx = rowIdx;
	
					if (pass == 1)
					{
						scroll.tagIndex.push(div);
						scroll.tagData.push(data);
	
						scroll.expanded.widths[className] = scroll.expanded.widths[className] || [];
						scroll.expanded.heights[rowIdx] = scroll.expanded.heights[rowIdx] || [];
	
						scroll.tagLists[className] = scroll.tagLists[className] || [];
						scroll.tagLists[className].push(div);
	
						extra += data.extraWidth;
						need += data.needWidth;
						scroll.height = Math.max(scroll.height, data.autoHeight);
						maxRowHeight = Math.max(maxRowHeight, data.autoHeight);
					}
					else if (pass == 2)						//determine widest widths
					{
						scroll.tagData[tagIdx] = data;
						var autoWidth = Math.max(scroll.autofit.maxAutoWidth[className], data.autoWidth);
						var wrapWidth = Math.max(scroll.autofit.maxWrapWidth[className], data.wrapWidth);
						var usedWidth = Math.max(scroll.autofit.usedWidth[className], data.usedWidth);
	
						scroll.autofit.maxAutoWidth[className] = autoWidth;
						scroll.autofit.maxWrapWidth[className] = wrapWidth;
						scroll.autofit.usedWidth[className] = usedWidth;
	
						if (data.isHscroll || data.isVscroll)
						{
							scroll.counts.all++;
							scroll.counts[className]++;
							testnoCount++;
							totalScrollCols++
						}
					}
					else if (pass == 3)						//finally set width etc...
					{										//wrapWidth 0 for note
						var wrapWidth = scroll.autofit.maxWrapWidth[className];
						td.style.width = className != 'note' ? wrapWidth + 'px' : '';
	
						var autoWidth = scroll.autofit.maxAutoWidth[className];
				//		scroll.autoWidths[className] = autoWidth;	//redundant but so what
	
	
						div.style.width = autoWidth + 'px';
						div.style.marginRight = data.marginRight + 'px';
	
						if (className == 'note')
						{
							div.style.right = scroll.autofit.noteRight + 'px';
							EZ('noteTooltips',td).style.width = wrapWidth + 'px';
						}
						div.style.overflow = '';					//revert to css value
						EZ.addClass(div, 'scrollWidth', data.isHscroll);
						EZ.addClass(div, 'scrollHeight', data.isVscroll);
						//EZ.addClass(td, 'scrollBoth', data.isHscroll && data.isVscroll);
					}
				});
				if (pass == 1)								//all scroll divs done for rowIdx testKey
				{
					scroll.autofit.extra = Math.min(extra, scroll.autofit.extra);
					scroll.autofit.need = Math.max(need, scroll.autofit.need);
				}
				else if (pass == 2)
				{
					//scroll.autofit.used += maxAutoWidth[className];
					//scroll.autofit.extra -= wrapWidth;
	
					if (totalScrollCols)
					{
						scroll.rowList.push(tr);
						scroll.testnoList.push(testKey);
						scroll.autofit.autoRowHeights.push(maxRowHeight);
					}
					var el = EZ('expandOne', tr);			//show [+] in 1st td if any scrolled columns
					EZ.removeClass(el, 'invisible', testnoCount);
					el.title = EZ.s('expand # column', testnoCount);
				}
			});
			if (pass == 1)
			{
				var width = EZ.toInt(EZ.getStyle('data','width'));
				//scroll.autofit.unused = scroll.autofit.extra - scroll.autofit.used;
				scroll.autofit.extra += EZ('body').clientWidth - width;
			}
			else if (pass == 2)
			{
				scroll.autofit.unused = EZ('data').clientWidth - EZ('first').clientWidth - 5;
				scroll.classNames.forEach(function(className)
				{
					//scroll.autofit.used[className] = scroll.autofit.maxWrapWidth[className];
					scroll.autofit.unused -= scroll.autofit.usedWidth[className];
				});
			}
			scroll.autofit.noteRight = Math.max(scroll.autofit.unused-12, 1);
		}
		var dataBody = EZ('dataBody');
		dataBody.style.height = scroll.height + 'px';		//TODO: by row ??
		dataBody.style.minHeight = '';
		dataBody.style.maxHeight = '';
	
		var argsWidth = scroll.autofit.maxAutoWidth.args + 'px';
	//	var fnStatement = EZ('fnStatement');
	//	EZ('fnStatementCol').style.width = fnStatement.style.width = argsWidth;
		EZ('fnStatement').style.maxWidth = argsWidth;
		EZ.el.style.display = '';
	
		//if (EZ.test.app.firstRun)
		//	scrollLoad();
		
		EZ.removeClass('expandCollapseAll', 'invisible', scroll.rowList.length > 1);
		EZ.removeClass(['expandCollapseWrap', 'expandAllWrap'], 'invisible', scroll.counts.all > 0);
		EZ.set('scrollbarCount', EZ.s('for # rows', scroll.rowList.length));
	
		scroll.classNames.forEach(function(className)			//counts for each scroll column . . .
		{
			var count = scroll.counts[className];
			var el = EZ(className+'ExpandColumn');
			EZ.removeClass(el, 'hidden', count > 1);
			el.title = 'expand column in ' + count + ' rows';
		});
		
		//called by restoreScrollState() after data table width set
		//positionRightFlags();									
		var testKey = showLastSelected('scroll');			//scrollTo lastSelected if not set and now displayed				
		setTimeout(function() {EZ.test.data.variants.restoreScrollState(testKey)}, 100);
		//___________________________________________________________________________________
		/**
		 *	Determines td (wrapWidth), div (autoWidth) for scroll columns and scrollbars
		 *	displayed for each div.  Also the full width and height of content in each div.
		 *
		 *	Insidious determination ideally distilled as much as feasible:
		 *  	Initially all td widths cleared and div widths set to column minWidth settings
		 *		scrollWidth then used to determine the widest required width for all columns
		 *		(td is wider than maxWidth if other html (e.g. thead) or css expands table)
		 *
		 *	All extra width ultimately shows in note column (td width blank) but not in div.
		 *	Idea is to keep all data as far left as implied by scroll column format settings.
		 *
		 *	TODO: not perfect but damm close --
		 *		height slightly more than column format setting
		 *
		 *
		 *	NOTE:
		 *		Array.prototype.sortPlus() -- good test case
		 */
		function getScrollData(div, td, className, isFinalFit)
		{
			var scroll = EZ.test.data.scroll;
			var data = {
				div: {
					width: EZ.toInt(EZ.getStyle(div,'width')),
					height: EZ.toInt(EZ.getStyle(div,'height')),
					clientWidth: div.clientWidth,
					clientHeight: div.clientHeight,
					scrollWidth: div.scrollWidth,
					scrollHeight: div.scrollHeight,
					padding: EZ.getStyle(div,'padding')		//analysis only as of 07-2016
				},
				td: {
					width: EZ.toInt(EZ.getStyle(td,'width')),
					height: EZ.toInt(EZ.getStyle(td,'height')),
					clientWidth: td.clientWidth,
					clientHeight: td.clientHeight,
					scrollWidth: td.scrollWidth,
					scrollHeight: td.scrollHeight
				},
				scrollClass: className
			}
			if (className == 'note')
				div.scrollHeight += div.EZ('info').offsetTop + 1;
			
			data.padWidth = EZ.toInt(EZ.getStyle(div,'padding-left'))
						  + EZ.toInt(EZ.getStyle(div,'padding-right'));
			var padHeight = EZ.toInt(EZ.getStyle(div,'padding-top'))
						  + EZ.toInt(EZ.getStyle(div,'padding-bottom'));
	
			data.fullWidth = data.div.scrollWidth;
	
			var minWidth = scroll.minWidths[className];
			var maxWidth = data.maxWidth = scroll.maxWidths[className];
			var mostWidth = maxWidth;
			var expandCol = scroll.autofit.expandCol[className];
			if (isFinalFit && expandCol)
			{
				maxWidth = minWidth;
				mostWidth = (scroll.autofit.allowTableScroll[className]) ? 9999
						  : maxWidth + Math.max(0,scroll.autofit.extra-18);
			}
			//var divWidth = div.clientWidth + (div.scrollHeight > div.clientHeight ? 15 : 0);	//??
			data.isHscroll = div.scrollWidth > div.clientWidth && div.scrollWidth > (mostWidth+15);
	
			data.isVscroll = div.scrollHeight > (div.clientHeight
						   + (div.scrollWidth > div.clientWidth ? 15 : 0));
	
			  //------------------------------------------------\\
			 //----- either scrollbar can trigger the other -----\\
			//----------------------------------------------------\\
			while (!data.isHscroll || !data.isVscroll)
			{										//no worries if close e.g. 14
				if (data.isVscroll && (data.fullWidth+14) > mostWidth)
					data.isHscroll = true;			//14 ok ??
				else if (data.isHscroll && (data.div.height+15) > data.td.height)
					data.isVscroll = true;			//14 nogo for vertical scroll
				else
					break;
			}
			//data.fullWidth += data.isVscroll ? 15 : 0;
			data.autoWidth = Math.min(data.fullWidth, mostWidth);
			data.extraWidth = Math.min(data.td.width - data.autoWidth);
			data.needWidth = Math.max(0, data.fullWidth - data.autoWidth);
			data.usedWidth = data.autoWidth + data.padWidth;
	
													//TODO: height probably needs tweaking
			data.fullHeight = data.div.scrollHeight + (data.isHscroll ? 15 : 0);
			data.autoHeight = Math.min(data.td.clientHeight-padHeight, data.fullHeight);
			data.minHeight = Math.min(data.td.clientHeight-2, data.fullHeight);
	
			if (isFinalFit)
			{
				//data.wrapWidth = Math.max(data.autoWidth, data.td.width);
				data.wrapWidth = data.autoWidth;
				if (expandCol)						//deduct any extra width used
					scroll.autofit.extra -= Math.max(0, data.autoWidth - maxWidth);
	
				//---------------------------------------------------------
				// keep scrollbar at right edge of td (at least for chrome)
				//---------------------------------------------------------
				if (!data.isVscroll)
					data.marginRight = '';			//offset of note vscroll [+/-] icon
	
				else if (className == 'note')		//note td has un-used table width
				{									//...data.wrapWidth not used
					data.autoWidth += data.padWidth;
					data.marginRight = '';
				}
				else if (!data.isHscroll
				|| className == 'expected')			//edit icon ??
				{
					data.autoWidth += 1;
					data.marginRight = '-1';
				}
				else data.autoWidth += data.padWidth;
			}
			return data;
		}
	}
	//_________________________________________________________________________________________________
	e = function _____VARIANTS_DATA_____() {}	
	//_________________________________________________________________________________________________
	var testCalls = this._testCalls = {};
	var dataCommit = this._dataCommit = __defaultData();	
	var data = this._dataWork = __defaultData();	//working copy of dataCommit
	var msg;
	 	
	
	var v = this._vShared = {						//class data shared by all test calls
		state: 'firstRun',
		compareMessage: {},
		diffLegacyResults: [],
		counts: {
			prescan:0, run:0, diffLegacy:0
		},
		legacyEnabled: EZ.get('testLegacyEnabled'),
		legacyCode: fnScript.includes('EZ.isLegacy'),
		legacyDefault: EZ.isLegacy(EZ.test.data.funcNameReal),
		legacyValues: EZ.get('testLegacyValues').split(/\s+/),

		argumentVariantsEnabled: EZ.get('testVariants'),
		argumentVariants: testScript.includes('EZ.test.argumentVariants')	
	};
	
	var el = EZ('testLegacyValues');				//advanced settings > variants > legacy css
	EZ.addClass(el.parentElement, 'dimMore', !v.legacyCode);
	EZ.addClass(el.options[0], 'default', v.legacyCode && v.legacyDefault);
	EZ.addClass(el.options[1], 'default', v.legacyCode && !v.legacyDefault);
	
	msg = 'test function ' + (v.legacyCode ? 'contains' : 'does NOT contain') + ' legacy code ';
	if (v.legacyCode)
	{
		var val = v.legacyValues[0] == 'true';
		var def = (val == v.legacyDefault) ? ' (default)' : ' (not default)';
		var opt = (!v.legacyEnabled) ? ''
				: (v.legacyValues.length > 1) ? 'both'
				: (val) ? 'legacy code ' + def
				: 'non-legacy' + def
		msg += (opt) ? ' -- test ' + opt : ' -- legacy testing disabled';
	}
	addInfo(msg);
	
	//if (EZ.get('autorun'))
	{
		if (!v.argumentVariantsEnabled && v.argumentVariants)
			addInfo('test script HAS argument variants -- option NOT selected');	
	}
	//_________________________________________________________________________________________________
	e = function _____internal_variant_functions_____() {}
	//_________________________________________________________________________________________________
	/**
	 *
	**/
	function __defaultData(testno)
	{
		return {
			testno: testno || 0,
			idx: 0,
			lastIdx: -1,
			keys: [],
			values: []
		//	variants: v	
		}
	}
	/**
	 *
	**/
	function __commit(update)
	{
		if (!update) return;
		__copy(data, dataCommit)
	}
	/**
	 *
	**/
	function __copy(from, to)
	{
		to = to || {};
		Object.keys(from).forEach(function(key)
		{
			to[key] = from[key];
		});
		return to;
	}
	/**
	 *	set work data to copy of current dataCommit
	**/
	function __setupData()
	{
		__copy(dataCommit, data);
	}
	/**
	 *	update work data to vData
	**/
	function __updateData(vData)
	{
		__copy(vData, data);
	}
	/**
	 *	split testKey into testno / key
		document.write(JSON.stringify(__toTestnoKey('1a')),'<br>')
		document.write(JSON.stringify(__toTestnoKey('1')),'<br>')
		document.write(JSON.stringify(__toTestnoKey('a')),'<br>')
		document.write(JSON.stringify(__toTestnoKey('')),'<br>')
	
		var testnoKey = __testnoKey(testKey);
		var testno = testnoKey.testno;
		var key = testnoKey.key;
	
	**/
	function __testnoKey(testKey)
	{
		testKey += '';
		var results = testKey.match(/(\d*)(.*)/) || ['',testKey];
		
		__testnoKey.testno = results[1];
		__testnoKey.key = results[2] || '';
		return {testno:results[1], key:results[2] || ''}
	}
	[__testnoKey];
	//_________________________________________________________________________________________________
	e = function _____variant_getters_setters_____() {}
	//_________________________________________________________________________________________________
	/**
	 *	return variant counts
	 */
	this.getCounts = function getCounts()
	{
		return v.counts || {};
	}
	/**
	 *	get current variant state
	 */
	this.getState = function getState()
	{
		return v.state;
	}
	/**
	 *	set variant state
	 */
	this.setState = function setState(state)
	{
		v.state = state;
	}
	/**
	 *	reset testno / testkey
	 */
	this.testnoReset = function testnoReset()
	{
		//__updateData(__defaultData());
		//commit(true);
		__copy(__defaultData(), dataCommit);
	}
	//_________________________________________________________________________________________________
	e = function _____VARIANTS_FUNCTIONS_____() {}	//generate testno / testKey / variants
	//_________________________________________________________________________________________________
	/**
	 *	backward compatibility -- called from EZ.test.getTest() when testrun not found
	 *	loop thru all varients for testno
	
	 */
	this.findTest = function findTest(vData)
	{
		var testrun;
		if (!testrun && !isNaN(vData))
		{
			var testno = EZ.toInt(vData);
			if (testno && EZ.test.data.testrun)				//search all testno variants
			{
				var keys = '.'.concat(testno,'.keys').ov(testCalls, [])
				keys.some(function(key)		
				{											//some() quits loop if testrun found	
					return testrun = EZ.test.data.testrun[testno+key];
				});
				if (testrun) return testrun;				//if testrun found, return it
			}
		}
		/*
		else if (v.state == 'firstRun')
		{
			testrun = new EZ.test.testrun(vData);
		}
		*/
		return testrun;
	}	
	//______________________________________________________________________________________________
	/**
	 *	Does all te heavy lifting for variants with help from nested fn getVariants()
	 *
	 *	Determines next testno and variants for each test call and advances to next testKey
	 *
	 *	returns false if next testKey is not run (i.e. skipped) -- otherwise returns testno 
	 *	or vData Object used to get existing testrun Object (rerun) or create (firstRun)
	**/
	this.next = function _____NEXT_____(onlyList, update)
	{
		void(dataCommit);
		onlyList = onlyList || [];
		if (this.getState() == 'prescan')
		{
			__getVariants();
			return false;						//always skip test calls
		}

		__setupData();							//creates snapshot of current data
		// . . . . . . . . . . . . . . . . .
		switch (EZ.getType(onlyList))
		{
			case 'String': 						//=======================
			case 'Number':						//rerun testno or testKey
			{									//=======================
				__getNextTestno('')	
				var testKey = onlyList;
				var testno = EZ.toInt(testKey);
				
				if (testno != data.testno)
					testKey = false;			//skip if not rerun testno
				else
					testKey = EZ.test.getTest(testKey);
				//========================================================
				__commit(update);				//return testno or testkey
				return testKey;					//testrun Object exists
				//========================================================
			}
			case 'Array': 	
				break;
			default:
				onlyList = [];					
		}
		var vData = __getNextTestKey(onlyList);	//advance to next key or testno	
		if (vData)								//testno not skipped
		{	
			if (data.lastIdx < 0)				//testno has NO variants
				vData = data.testno;
			else
			{									//fill Object with associated with this variant
				vData = {};
				var idx = vData.idx = data.idx;
				Object.keys(data).forEach(function(key)
				{
					if (data[key] instanceof Array)
					{
						var k = key.replace(/s$/, '');
						vData[k] = data[key][idx];
					}
					else
						vData[key] = data[key];
				});
				if (idx > 0)						//if not 1st variant...
				{
					v.counts.run++;
					if (vData.legacySetting)
						EZ.mergeMessages(v.compareMessage, v.legacySetting.wrap('"') + ' testno', data.testno);	
				}
			}
		}
		if (vData && update && v.state == 'firstRun')
			vData = new EZ.test.testrun(vData);

		//==============================
		__commit(update);
		return vData;
		//==============================
		//______________________________________________________________________________________________
		/**
		 *	not called by rerum
		 *	Advance to next variant or next testno if on last variant value
		 *	always on last variant if none or only one value
		**/
		function __getNextTestKey(onlyList)
		{
			var idx = ++data.idx;						
			if (idx < data.values.length)
				return data;
				
			return __getNextTestno(onlyList);		
		}
		//______________________________________________________________________________________________
		/**
		 *
		 */
		function __getNextTestno(onlyList)
		{
			testno = data.testno + 1;
			
			if (!onlyList						//rerun
			|| (onlyList.length && !onlyList.includes(testno)))
			{
			 	__updateData(__defaultData(testno));
				return false;
			}
			
			var vData = __getVariants();
			if (vData.values.length > 1 && v.legacyValues.length == 1)		
			{									//for single variant values, discard unused
				var idx = vData.values.indexOf(v.legacyValues[0]);
				vData.lastIdx = 0;
				vData.keys = [vData.keys[idx]];
				vData.values = [vData.values[idx]];
			}
			__updateData(vData);				
			return vData;
		}
		//______________________________________________________________________________________________
		/**
		 *	get variants for this test call if any -- always called for prescan 
		 *	otherwise only called if testno not skipped
		**/
		function __getVariants()
		{
			var testno = data.testno + 1;
			vData = __defaultData(testno);								
			
			if (v.state == 'prescan')
				v.counts.prescan++;
			
			else if (!v.legacyEnabled)					//safety for unexpected
				return vData;							
			
			vData.values = v.legacyValues.slice();
			vData.textValues = v.legacyTextValues.slice();
			vData.lastIdx = vData.values.length - 1;
			if (vData.values.length)		
			{											
				vData.legacyDefault = v.legacyDefault;
				vData.keys = [];
				vData.values.forEach(function(val, idx)
				{
					val = (val == 'true') ? true
						: (val == 'false') ? false
						: val;
					var key = (val === true) ? 'Y'
							: (val === false) ? 'N'
							: String.fromCharCode('A'.charCodeAt(0) + idx);
					vData.keys.push(key);
					vData.values[idx] = val;
				});
				vData.legacySetting = EZ.test.data.settings.legacy || '';
				if (vData.legacySetting)
					vData.legacyOptions = EZ.getAttributes(vData.legacySetting);
			}	
			//==========================
			testCalls[testno] = vData;				//save variants for this test call
			return vData;
			//==========================   
			//________________________________________________________________________________________
			/**
			 *	TODO:
			function ___getArgumentVariants()	
			{	
				var args = {						//from EZ.cloneV3.object.test()
					options: [						//append and/or replace options argument properties
						{ignore:'', exclude:''},
						{ignore:'', exclude:'Function'},
						{ignore:'script', exclude:''},
						{ignore:'script', exclude:'Function'},
						{ignore:'script, constructor', exclude:''},
						{ignore:'script, constructor', exclude:'Function'}
					]	
				}
				//EZ.test.variants(args)
				return args;
			}
			**/
		}
	}
	//______________________________________________________________________________________________
	/**
	 *	return true if more variants exist -- called at end of EZ.test.run() outer loop
	 *	compare legacy and non-legacy actual results if enabled
	**/
	this.more = function _____MORE_____(testrun)
	{
		var vData = testrun.vData;
		if (!vData) return false;
			
		var isMore = vData.idx < vData.lastIdx && !EZ.test.isRerun;
		
		var isEqual = true;
		while (v.legacyOpts.includes('compare'))
		{													
			if (!EZ.test.isRerun && vData.idx === 0) break;

			var ourValue = vData.value;
			if (typeof(ourValue) != 'boolean') break;
			
			var shared = testCalls[testrun.testno];
			if (shared.values.length < 2) break;
			
			var idx = shared.values.indexOf(!ourValue);
			var testKey = testrun.testno + shared.keys[idx];
			var testrunOther = EZ.test.getTest(testKey);
			if (!testrunOther) 
				break;
			
			var eqOpts = vData.legacyOptions || {};
			isEqual = EZ.isEqual(testrun.actual, testrunOther.actual, eqOpts);
	
			[testrun, testrunOther].forEach(function(testrun, idx, both)
			{
				EZ.addClass(testrun.tags.EZ('legacyNote'), 'diff', !isEqual);
				var msg = both[1-idx].vData.textValue.replace(/(\S*)(.*)/, '$1');
				(EZ.el.getAttribute('data-title') == 'true') ? 'false' : 'true';
				EZ.el.setAttribute('data-title-suffix', ' -- click to compare with ' + msg);
			
				EZ.addClass(testrun.tags, 'diffLegacy', !isEqual);
			});
			
			if (!EZ.test.isRerun && !isEqual)
				v.diffLegacyResults.push(testrun.testno);
			break;
		}
		//================================
		return isMore;
		//================================
	}
}
