/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
(function(global) 
{
	//________________________________________________________________________________________
	/**
	 *	TestData object for each test script.
	 */
	function TestData(name)	
	{	
		var time = new Date().getTime();
		var timeStr = dateTime(time);
		this.id = time;
		this.name = name || 'created ' + timeStr;
		this.status = 0;
		this.testFields = [];			//Array of fields, field names, ids or html collection
		this.testObjects = {};			//Additional testdata saved but not reset by EZtester()
		this.lastResults = null;
		this.passResults = null;
		this.lastRunTime = time;
		this.lastPassTime = '';
	}
	//____________________________________________________________________________________
	/**
	 *	constructor -- automatically called after script loads
	 */
	function EZtester()
	{
		var fields = this.fields = {};			//EZtester elements and form fields
		var menuItems = this.menuItems = {};	//EZtester center menu items
		
		// constants
		this.RUN_STATUS_ANY = 0;
		this.RUN_STATUS_FAIL = 1;
		this.RUN_STATUS_PASS = 2;
		this.RUN_STATUS_NA = 3;
		
		this.RUN_TIME_ALL = 0;
		this.RUN_TIME_TODAY = 1;
		this.RUN_TIME_HOUR = 2;
		this.RUN_TIME_MRU = 3;
		
		this.RUN_ORDER_ASIS = 0;
		this.RUN_ORDER_MRU = 1;
		this.RUN_ORDER_WORST = 2;
		this.RUN_ORDER_NEVER = 3;
		this.RUN_ORDER_FAIL = 4;
		this.RUN_ORDER_PASS = 5;
		this.RUN_ORDER_NA = 6;
		
		this.PAUSE_EACH = 0;
		this.PAUSE_FAIL = 1;
		this.PAUSE_PASS = 2;
		this.PAUSE_NA = 3;
		this.PAUSE_NONE = 4;
		
		this.RED = '#C00';
		
		// dummy field used for missing fields to eliminate need for if field... when used
		var missingField = document.createElement('select');
		missingField.parentElement = missingField;
		
		('wrap testCount top middle bottom '
		+ 'message load save run '
		+ 'testInfo name status lastRunTime lastPassTime '
		+ 'runTime runStatus runOrder runPause '
		+ 'note restore loading '
		+ 'list auto last').split(' ').forEach(function(id)
		{ 
			var el = document.getElementById('EZtester_' + id) || missingField;
			fields[id] = el; 
		});
		
		fields.loading.style.display = 'none';		//hide loading note
		if (fields.top == missingField) return;		//if no top tag, disable and quit
		
		'browse download runMenu testInfo'.split(' ').forEach(function(id)
		{ 
			var el = document.getElementById('EZtester_' + id) || missingField;
			menuItems[id] = el;
			fields[id] = el;
		});

		var projectName = location.pathname.replace(/.*\/(.*)\..*/, '$1') + '_EZtester_';;
		
		this.options = JSON.parse( localStorage.getItem(projectName + 'options') || '{}' ); 
		this.options.projectName = projectName;	
		this.scripts = JSON.parse( localStorage.getItem(projectName + 'scripts') || '[]' );
	}
	//________________________________________________________________________________________
	/**
	 */
	EZtester.prototype.init = function init()
	{
		var fields = this.fields;
		var options = this.options;
		options.runButtonDefaultText = fields.run.value;
		
		// set fixed height/width of top and middle divs after page 1st rendered
		// largest middle container should have visibility:hidden and NOT display:none
		// bottom container should have height defined, display:none for buttons and fields
		// except: <span id=EZtester_note>...loading message...</span>
		var maxWidth = 0;
		'top middle'.split(' ').forEach(function(id)
		{
			maxWidth = Math.max(maxWidth, fields[id].clientWidth);
			fields[id].style.width = fields[id].clientWidth + 'px'; 
			fields[id].style.height = fields[id].clientHeight + 'px'; 
		});
		fields.message.style.width = maxWidth + 'px';
		
		var msg = (this.scripts.length ? 'loaded ' + this.scripts.length : 'no') + ' test scripts';
		message(msg);
		
		// show bottom buttons
		fields.auto.parentElement.style.display = 'inline';		
		'list last'.split(' ').forEach(function(id)
			{fields[id].style.display = 'inline'; });
		
		// link or clear testdata object
		var testFields = null;
		if (options.testdata)					
		{							//prior testFields
			testFields = options.testdata.testFields;		
			var idx = findIndex();
			if (idx >= 0)			//link to script
			{
				options.testdata = this.scripts[idx];
				options.testdata.script = true;
			}
			else					//or clear
				options.testdata = null;			
		}
		
		updateDisplay();			
		
		//make all middle items visible									
		'top middle testInfo'.split(' ').forEach(function(id)
			{fields[id].style.visibility = 'visible'; });
		
		// restore MRU test field values
		if (testFields)
		{
			setTestFieldValues(testFields);
			note('Using Most Recent Test Field Settings');
			fields.restore.style.display = 'block';
		}
		
		if (window.addEventListener) window.addEventListener('beforeunload', saveLocalData, false)
		else if (window.attachEvent) window.attachEvent('onbeforeunload', saveLocalData)
	}
	/**
	 *	
	 */
	EZtester.prototype.restoreDefaults = function restoreDefaults(discardScripts) 
	{
		this.options.testdata = null;
		if (discardScripts)
			this.scripts = [];
		location.reload(true);		
	}
	//________________________________________________________________________________________
	/**
	 *	
	 */
	EZtester.prototype.callback = function callback(fn)
	{
		this.callback = fn;
	}
	//________________________________________________________________________________________
	/**
	 *	Test Scripts stored as json and loaded by script tag. Contains function call to:
	 *	EZ.tester.loadfileDone()
	 */
	EZtester.prototype.loadFile = function loadFile()
	{
		message();
		updateDisplay('browse');
	}
	//________________________________________________________________________________________
	/**
	 *	
	 */
	EZtester.prototype.upload = function upload(el)
	{
		this.fileref = document.createElement('script');
		this.fileref.setAttribute("type","text/javascript");
		//fileref.setAttribute("defer",true);		//don't think so, script must run
		var path = el.baseURI.replace(/(.*\/)(.*\..*)/, '$1')
				 + el.value.replace(/(.*\\)(.*\..*)/, '$2');
		this.fileref.setAttribute("src", path);
		document.head.appendChild(this.fileref);
	}
	//________________________________________________________________________________________
	/**
	 *	
	 */
	EZtester.prototype.uploadDone = function uploadDone()
	{
		this.options.testdata = null;
		var msg = 'no test scripts found';
		if (this.scripts.length)
		{
			 msg = this.scripts.length + ' test scripts loaded';
			 this.options.testdata = this.scripts[0];
		}
		message(msg);
		updateDisplay();
	}
	//________________________________________________________________________________________
	/**
	 *	
	 *	http://stackoverflow.com/questions/21012580/is-it-possible-to-write-data-to-file-using-only-javascript
	 */
	EZtester.prototype.saveFile = function saveFile()
	{
		var makeTextFile = function (text) 
		{
			var data = new Blob([text], {type: 'text/plain'});
			
			// If we are replacing a previously generated file we need to
			// manually revoke the object URL to avoid memory leaks.
			if (this.textFile)
				window.URL.revokeObjectURL(this.textFile);

			// returns a URL you can use as a href
		    return this.textFile = window.URL.createObjectURL(data);
		}
		message('click on "download" to save file');
		
		var json = JSON.stringify(this.scripts, null, 2);
		json = 'EZ.tester.scripts = ' + json + ';\n' + 'EZ.tester.uploadDone();'
		var el = this.menuItems.download.getElementsByTagName('A')[0];
		el.setAttribute('href', makeTextFile(json));
		
		updateDisplay('download');
	}
	//________________________________________________________________________________________
	/**
	 *	
	 */
	EZtester.prototype.listMenu = function listMenu()
	{
		message('future');
		updateDisplay();
	}
	//________________________________________________________________________________________
	/**
	 *	
	 */
	EZtester.prototype.closeMenu = function closeMenu()
	{
		message();
		updateDisplay();
	}
	//________________________________________________________________________________________
	/**
	 *	Save create, update or delete test script.
	 *	called if testdata field changed or last button clicked.
	 *	el set if testdata field changed otherwise undefined.
	 */
	EZtester.prototype.updateScript = function updateScript(el)		//last button
	{	
		var fields = this.fields;
		var scripts = this.scripts;
		var options = this.options;
		var testdata = this.options.testdata;
		
		if (fields.last.value.indexOf('discard') != -1)
			return this.restoreDefaults(true);
		
		if (!testdata) return;
		
		var action = 'update'
		if (!el || el == fields.last.value)
			action = (fields.last.value + '_').match(/(create|save|update|delete|remove|_)/i)[1];
		
		switch (action.toLowerCase())
		{
			case 'save': 	
			case 'create': 	
			case 'update': 	return saveTest();
			case 'delete': 	
			case 'remove': 	return deleteTest();
		}	
		/**
		 *	
		 */
		function saveTest()
		{	
			if (el == fields.passed && testdata.status != EZ.tester.PASS)
			{
				testdata.lastPassTime = testdata.lastRunTime;
				testdata.passResults = testdata.lastResults;
			}
			if (testdata.script)
				message('updated test script')
			else
			{
				testdata.script = true;
				scripts.push(options.testdata);
				message('created new test script');
			}
			updateDisplay();
		}
		/**
		 *	
		 */
		function deleteTest()
		{	
			if (!testdata.script) return;
			message('deleted test script');
			
			var idx = findIndex();
			if (idx >= 0)			
				scripts.splice(idx,1);
			
			options.testdata = (idx < scripts.length) ? scripts[idx] : null;
			
			updateDisplay();
		}			
	}
	//________________________________________________________________________________________
	/**
	 *	if only 1 script, display and run -- otherwise display runMenu
	 */
	EZtester.prototype.runMenu = function runMenu(el)
	{
		var options = EZ.tester.options;
		var fields = EZ.tester.fields;
		var tests = options.tests || [];
		
		if (fields.run.value.indexOf('stop') != -1
		|| fields.run.value.indexOf('cancel') != -1)
			tests = options.tests = [];
		
		if (tests.length == 0)
			return fields.run.value = options.runButtonDefaultText;
		
		message();
		if (fields.run.value.indexOf('START') != -1)		//runMenu displayed
		{
			var runTime = fields.runTime.selectedIndex;
			var runStatus = fields.runStatus.selectedIndex;
			var runOrder = fields.runOrder.selectedIndex;
			
			if (runTime == EZ.tester.RUN_TIME_MRU)
				runOrder = EZ.tester.RUN_ORDER_MRU
			
			options.tests = findTests(runTime, runStatus, runOrder);
			if (options.tests.length == 0) 
			{
				message('*no test scripts found');
				fields.run.value = ' cancel ';
				return;
			}
		}
		
		if (fields.run.value == options.runButtonDefaultText)
		{
			updateDisplay('runMenu');
			fields.run.value = 'START-->';
			return;
		}
		
		if (options.tests && options.tests.length)
			return setTimeout(runScripts,0);	//NEXT or START
		
		fields.run.value = options.runButtonDefaultText;
		updateDisplay();
	}
	//________________________________________________________________________________________
	/**
	 *	
	 */
	function runScripts()
	{
		var options = EZ.tester.options;
		var fields = EZ.tester.fields;
		var testdata = options.testdata = options.tests.shift();
		
		setTestFieldValues(testdata.testFields);
		
		/* update
		testdata.testObjects.forEach(function(obj)	
		{									//update testObjects
			obj[key] = obj[value];
		});
		*/
		
		updateDisplay();
		fields.run.value = 'stop tests';
		
		options.testScriptId = testdata.id;	//test script STARTED
		setTimeout(function() {EZ.tester.callback(testdata.testObjects)}, 0);
	}
	//________________________________________________________________________________________
	/**
	 *	clone results data -- auto create script or hold until create button clicked
	 */
	EZtester.prototype.results = function results(results, testObjects, testFields)	
	{	
		var fields = this.fields;
		var options = this.options;
		var scripts = this.scripts;
		var testdata = options.testScriptId ? options.testdata : new TestData();
		
		var msg = [];
		testdata.testObjects = cloneObject(testdata.testObjects);
		testdata.testFields = getTestFieldValues(testFields);
		
		if (options.testScriptId)			
		{
			options.testScriptId = 0;			//test script FINISHED
			testdata.saved = true;
			testdata.updated = true;
			
			idx = findIndex(testdata);
			testdata = this.testdata = scripts[idx] = testdata;
			
			if (compareObject(testdata.testObjects, scripts[idx].testObjects) > 0
			|| compareObject(testdata.testFields, scripts[idx].testFields) > 0)
			{
				msg.push('test input changed');	
			}
			if (testdata.passResults)
			{
				testdata.diff = compareObject(results, testdata.passResults, 'results');
				if (testdata.diff.length == 0) 
					this.passCount++
				else
				{
					this.failCount++
					msg.push('*' + testdata.diff.count + ' changes from passed results @ ' + dateTime(testdata.lastPassTime));
					
					if (testdata.status == EZ.tester.PASS) 
						testdata.status = EZ.tester.FAIL;
				}
			}
			else
			{
				testdata.diff = compareObject(results, testdata.lastResults, 'results');
				
				if (testdata.diff.length > 0)
				{
					msg.push('*' + testdata.diff.count
							   	 + ' different results from last run @ ' + dateTime(testdata.lastRunTime))
					msg = msg.concat(testdata.diff);
				}
				else if (testdata.status == EZ.tester.FAIL)
					msg.push('*same failed results from last run @ ' + dateTime(testdata.lastRunTime));
				
				//else
				//	msg.push('*different than results @ ' + dateTime(testdata.lastRunTime));
			}
		}
		testdata.lastResults = cloneObject(results);		//save copy of results
		
		updateDisplay();
		message(msg);
		
		if (options.tests && options.tests.length)			//if more scripts to run...
		{													//...check for pause
			if (options.runPause == EZ.tester.PAUSE_EACH
			|| (options.runPause == EZ.tester.PAUSE_PASS && testdata.status == EZ.tester.PASS)
			|| (options.runPause == EZ.tester.PAUSE_FAIL && testdata.status == EZ.tester.FAIL)
			|| (options.runPause == EZ.tester.PAUSE_NA && testdata.status == EZ.tester.NA))
				return fields.run.value = 'run NEXT';
			else
				log()
		}
		//==================================================
		setTimeout(this.runMenu, 0);	//return to run menu
		//==================================================
		//____________________________________________________________________________________
		/**
		 *	Internal results function
		 *	copy values of any specified html elements or form fields
		 */
		function getTestFieldValues()
		{
			var missingIds = [];
			var missingFields = [];
			[].forEach.call(testFields || [], function(id)
			{
				var el = id; 
				if (typeof(id) == 'string')			//find element(s) by name or id
				{
					el = document.getElementsByName(id);
					if (!el) 
						el = document.getElementById(el);
				}
				if (!el) 
					return missingFields.push(id);
				
				// for each element or group of elements (e.g. radio group), save value 
				[].forEach.call(el.tagName != 'SELECT' && el[0] != undefined ? el : [el], function(el)
				{
					if (!el || typeof(el) != 'object' || !el.childNodes) 
						return missingFields.push(id);	//skip if not a valid element
					
					if (!el.id)							//skip if element id not defined
						return missingIds.push(el.outerHTML.substr(0,30));
	
					var tagType = (el.type || el.tagName || '').toLowerCase();
					switch (tagType)
					{
						case 'text': 	
						case 'textarea': 	
						case 'password': 	
						case 'hidden': 	
						case 'button': 	
							return testdata.testFields.push( {id:el.id, type:'value', value:el.value} );
						
						case 'radio': 
						case 'checkbox': 	
							return testdata.testFields.push( {id:el.id, type:'checked', value:el.checked} );
						
						case 'select':
							return testdata.testFields.push( {id:el.id, type:'selected', value:el.selectedIndex} );
						
						case 'image': 	
							return testdata.testFields.push( {id:el.id, type:'src', value:el.src} );
						
						default:
							if (el.innerHTML) 
								testdata.testFields.push( {id:el.id, type:'innerHTML', value:el.innerHTML} );
					}	
				});
			});
			
			if (missingFields.length)
				msg.push( 'fields not found or saved: ' + missingFields.join(', ') );
			if (missingIds.length)
				msg.push( 'test field tags need id to save: ' + missingIds.join(', ') );
		}
	}
	//________________________________________________________________________________________
	/**
	 *	
	 */
	function setTestFieldValues(testFields)
	{
		testFields.forEach(function(field)	
		{
			var el = document.getElementById(field.id);
			if (!el) return;
			
			switch (field.type)
			{
				case 'value': return el.value = field.value;
				case 'checked': return el.checked = field.value;
				case 'selected': return el.selectedIndex = field.value;
			}
		});
	}
	//____________________________________________________________________________________
	/**
	 *	
	 */
	function compareObject(a, b, dotName, options) 
	{
	}
	//____________________________________________________________________________________
	/**
	 *	
	 */
	function cloneObject(obj, defaultObject) 
	{
		if (obj === null || typeof obj !== 'object') return defaultObject || obj;
		if (!cloneObject.processed)
		{
			defaultObject = true;			//remember top level
			cloneObject.processed = [];	//only process each object once
			cloneObject.objects = [];
		}
		
		var idx = cloneObject.processed.indexOf(obj);
		if (idx != -1) return idx;
			
		var clone = obj.constructor(); 		//give clone the original obj's constructor
		
		for (var key in obj) 
		{
			if (!obj.hasOwnProperty(key)) continue;
clone[key] = cloneObject(obj[key])
		}
		if (defaultObject)
			delete cloneObject.processed;
		return clone;
	}
	//________________________________________________________________________________________
	/**
	 *	return scripts index for specified testdata or 'new' if not found
	 */
	function findIndex(testdata)
	{
		if (!testdata) return undefined;
		var testno = EZ.tester.scripts.findIndex(function(item)
		{
			return item.id == testdata.id;
		});
		return (testno != -1 ? testno : 'new');
	}
	//________________________________________________________________________________________
	/**
	 *	
		this.RUN_TIME_ALL = 0;
		this.RUN_TIME_TODAY = 1;
		this.RUN_TIME_HOUR = 2;
		this.RUN_TIME_MRU = 3;
		
		this.RUN_STATUS_ANY = 0;
		this.RUN_STATUS_FAIL = 1;
		this.RUN_STATUS_PASS = 2;
		this.RUN_STATUS_NA = 3;
	 */
	function findTests(runTime, runStatus, runOrder)
	{
		if (runOrder > 0)
			sortTests(runOrder);
		
		var now = new Date()
		var today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
		var minTime = runTime == EZ.tester.RUN_TIME_TODAY ? today.getTime()
					: runTime == EZ.tester.RUN_TIME_HOUR ? now.getTime() - (60 * 60 * 1000)
					: 0;
				
		var tests = [];
		EZ.tester.scripts.some(function(item)
		{
			if (item.runTime < minTime) return false;
			if (runStatus && runStatus != item.status) return false;
			
			tests.push(item);
			if (runTime == EZ.tester.RUN_TIME_MRU)	//quit after 1st match
				return true;
		});
		return tests;
	}
	//________________________________________________________________________________________
	/**
	 *	
		this.RUN_ORDER_ASIS = 0;
		this.RUN_ORDER_MRU = 1;
		this.RUN_ORDER_WORST = 2;
		this.RUN_ORDER_NEVER = 3;
		this.RUN_ORDER_FAIL = 4;
		this.RUN_ORDER_PASS = 5;
		this.RUN_ORDER_NA = 6;
	 */
	function sortTests(runOrder)
	{	//             asis  mru   ok     never  now    now  na
		//			  /     /     /once  / ok   /fail  /ok  /
		var scores = [0,    1,   2,     3,     5,      6,  4]
		if (runOrder > 0)
			scrores[runOrder-1] = 0;		//selected sort set to zero
		
		EZ.tester.scripts.sort(function(a, b)
		{
			if (runOrder == 0)
				return a.time > b.time ? -1
					 : a.time < b.time ? 1 : 0;
			else
				return scores[a.score] < scores[b.score] ? -1
					 : scores[a.score] > scores[b.score] ? 1 : 0;
		});
	}
	//________________________________________________________________________________________
	/**
	 *	update menu layer and buttons text -- disable button if associated data NA
	 *	display test info in center area and update display
	 */
	function updateDisplay(layer)
	{	
		var fields = EZ.tester.fields;
		var menuItems = EZ.tester.menuItems;
		var scripts = EZ.tester.scripts;
		var options = EZ.tester.options;
		var testdata = options.testdata;
			
		if (testdata)
		{
			fields.name.value = testdata.name;
			fields.status.selectedIndex = testdata.status || 0;
			fields.lastRunTime.value = dateTime(testdata.lastRunTime);
			fields.lastPassTime.value = dateTime(testdata.lastPassTime);
		}
		
		updateMenu(layer);
		updateButtons()
		
		/**
		 *	hide all menuItems layers except layer if specified.
		 */
		function updateMenu(layer)
		{	
			for (var id in menuItems)
				menuItems[id].style.display = 'none';
	
			if (!testdata)
				layer = layer == 'testInfo' ? '' : layer;
			
			else if (!layer && testdata.script)
				layer = 'testInfo'
			
			if (layer != 'testInfo' && layer != 'runMenu') 
				fields.run.value = options.runButtonDefaultText;
			
			if (layer)
			{
				fields.note.style.display = 'none';
				fields.restore.style.display = 'none';
				menuItems[layer].style.display = 'inline';
			}
		}
		/**
		 *	enable or disable buttons that require testdata
		 */
		function updateButtons()
		{	
			'save run'.split(' ').forEach(function(id)
			{
				fields[id].style.display = scripts.length ? 'inline' : 'none';
			});
			fields.list.style.visibility = scripts.length == 0 
										 ? 'hidden' : 'visible';
			//update test count
			var testCount = scripts.length;
			if (testCount == 0)
				fields.testCount.innerHTML = '';
			else
				fields.testCount.innerHTML = testCount + ' ';
			fields.save.value = 'download ' + testCount + ' scripts';
			
			// update  text displayed on last button
			/*
			if (!testdata && scripts.length > 0)
			{
				fields.last.value = 'discard test scripts'
				fields.last.style.visibility = 'visible';
			}
			else
			*/
			{
				var idx = findIndex(testdata);
				fields.last.value = !testdata 		 ? 'waiting for results'	//hidden?
								  : testdatas.script ? 'delete test script'
															 : 'create test script'
				fields.last.style.visibility = testdata ? 'visible' : 'hidden';
				//fields.last.disabled = /wait/i.test(fields.last.value);
			}
		}
	}
	//________________________________________________________________________________________
	//________________________________________________________________________________________
	/**
	 *	formatted date/time as: mm-dd hh:mm [am|pm]
	 */
	function dateTime(time, pad)
	{
		if (!time) return '';
		var padding = pad ? ' ' : '';
		
		time = new Date(time||'');
		var hr = time.getHours();
		var hr = hr == 0 ? 12 : hr < 13 ? hr : hr-12;
		return (padding + (time.getMonth()+1)).substr(-2) + '-' 
			 + (padding + time.getDate()).substr(-2) + ' '
			 + (padding + hr).substr(-2) + ':'
			 + ('0' + time.getMinutes()).substr(-2) 
			 + (time.getHours() < 12 ? ' am' : ' pm')
	}
	//________________________________________________________________________________________
	/**
	 *	
	 */		
	function isArray(obj)
	{
		return Object.prototype.toString.call(obj) === '[object Array]';
	}
	//________________________________________________________________________________________
	/**
	 *	Display note in middle layer until menuItem displayed
	 */
	function note(msg)
	{
		var fields = EZ.tester.fields;
		fields.note.innerHTML = msg || '';
		fields.note.style.display = msg ? 'block' : 'hidden';
	}
	//________________________________________________________________________________________
	/**
	 *	Display message in red if it starts with *
	 */
	function message(msg)
	{
		var fields = EZ.tester.fields;
		var el = fields.message;
		
		msg = msg || '';
		msg = isArray(msg) ? msg.join('\n') : msg;
		
		if (msg.substr(0,1) != '*')
			el.style.color = EZ.tester.RED;
		else
		{
			el.style.color = '';
			msg = msg.substr(1);
		}
		el.innerHTML = msg ? msg : '&nbsp;'
		el.style.textAlign = (el.clientWidth <= el.clientWidth) ? 'center' : 'left';
	}
	//________________________________________________________________________________________
	/**
	 *	
	 */		
	EZtester.prototype.saveAll = function()	{saveLocalData()}
	function saveLocalData()
	{
		if (!EZ.tester.options) return;
		var items = {options: EZ.tester.options, scripts: EZ.tester.scripts};
		for (var key in items)
		{
			var itemName = EZ.tester.options.projectName + key;
			localStorage.setItem(itemName, JSON.stringify(items[key]));
		}
	}	
	  //------------------------------------------------------------\\
	 //----- Initalize EZ.tester framework if html tags defined -----\\
	//----------------------------------------------------------------\\
	if (!global.EZ) global.EZ = function EZ() {}
	
	// create singletion instance
	global.EZ.tester = new EZtester();
	global.EZ.tester.init();

})(this);
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
