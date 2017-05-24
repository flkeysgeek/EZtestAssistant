/*---------------------------------------------------------------------------------------------
If a JavaScript file has the SHARE-IN-MEMORY directive and an HTML file references it
(by using the SCRIPT tag with the SRC attribute), Dreamweaver loads the JavaScript into
a memory location where the code is implicitly included in all HTML files thereafter.
Because JavaScript files that are loaded into this central location share memory, the
files cannot duplicate any declarations. If a share-in-memory file defines a variable
or function and any other JavaScript file defines the same variable or function, a name
conflict occurs. When writing new JavaScript files, be aware of these files and their
naming conventions.

NOTE: remove spaces before and after dashes below to activate directive.
---------------------------------------------------------------------------------------------*/
//SHARE - IN - MEMORY=true 

/*---------------------------------------------------------------------------------------------
Global data
---------------------------------------------------------------------------------------------*/
var theForm, theform;					//non RZ.??? global page convenience variables
if (typeof(g) == 'undefined') g = {};	//global page object (NOT used by any EZ... functions)

//if (typeof (dw) == 'undefined') dw = {isNotDW: true};	//avoid syntax error: if (!dw) ...
/*from EZcommon.safe.js
if (!window.dw) dw = {isNotDW: true};

if (!EZ.legacy)
	EZ.legacy = {getEl:false, getElnull:true, getStyle:false, hasClass:false};
*/

if (typeof(EZ) == 'undefined') EZ = {};
if (!EZ.doc) EZ.doc = {};
if (!EZ.tag) EZ.tag = {};
if (!EZ.global) EZ.global = {};
if (!EZ.constant) EZ.constant = {};
if (!EZ.patterns) EZ.patterns = {};

//----- Misc general purpose global variables
EZ.wait = 0					// restart counter
EZ.errorFlag = false;		// set true when error occures
EZ.errorCode = "";			// error code set by some functions
EZ.errorDetail = "";		// error details set for inspector display
EZ.thisFunction = '';		// name of executing function
EZ.cancel = false;
EZ.setupTime = '';

//----- EZgetGlobal keys
EZ.key = {};
EZ.key.codeDocOpened = 'docOpened';

/*******************/
/*BOOKMARK EZ.pref*/
/*****************/
// Stored in: HKEY_CURRENT_USER\Software\Adobe\Dreamweaver...\EZ Preferences
EZ.prefGroup = 'EZ Preferences'
EZ.pref = EZ.dw.pref;
if (!EZ.pref)
{
	EZ.pref = EZ.dw.pref = {};

	EZ.pref.about						= 'About';
	EZ.pref.debugPages 					= 'Debug Pages';
	EZ.pref.debugMode          		    = 'Debug Mode';

	EZ.pref.debugDisabled               = 'Debug Disabled';
	EZ.pref.debugScriptMRU           	= 'Debug Script MRU';
	EZ.pref.debugScriptHistoryMRU       = 'Debug Script History MRU';
	EZ.pref.debugScriptPageFilenameMRU  = 'Debug Script Page Filename MRU';
	EZ.pref.debugScriptPageMRU          = 'Debug Script Page MRU';
	EZ.pref.debugScriptBufferSize       = 'Debug Script Buffer Size';
	EZ.pref.debugResultsBufferSize      = 'Debug Results Buffer Size';
	EZ.pref.debugResultsStringSize      = 'Debug Results String Size';
	EZ.pref.debugUnitTests				= 'Debug Unit Tests';

	EZ.pref.displaySourceJavascript     = 'Display Source Javascript';

	EZ.pref.logging			           	= 'logging';
	EZ.pref.logBuffer			        = 'Log Buffer';
	EZ.pref.logMaxsize			        = 'Log Max Size';
	EZ.pref.traceSearch      			= 'Trace Search';

	EZ.pref.httpCallsPause           	= 'http Calls Pause';
//	EZ.pref.consoleNotes           	    = 'consoleNotes';		//let's use debugMode
	EZ.pref.enhancedReporting           = 'Enhanced Reporting';
	EZ.pref.warningMessages           	= 'Warning Messages';

	EZ.pref.displayMaxString      		= 'Display Max String';
	EZ.pref.displayMaxDepth      		= 'Display Max Depth';
	EZ.pref.displayMaxItems      		= 'Display Max Array Items';
	EZ.pref.displayMaxObjects			= 'Display Max Objects';

	EZ.pref.evalAppendResults           = 'Eval Append Results';
	EZ.pref.evalWrapResults             = 'Eval Wrap Results';
	EZ.pref.evalLogResults              = 'Eval Log Results';

	EZ.pref.workbenchTrace              = 'Workbench Trace';

	// OLD Code Functions & Bookmarks
	EZ.pref.codeDisplayType		        = 'Code Display Type';
//	EZ.pref.codeSortOrder           	= 'Code Sort Order';
//	EZ.pref.codeMostRecent           	= 'Code Most Recent';
//	EZ.pref.codeMostRecentLimit        	= 'Code Most Recent Limit';
//	EZ.pref.codeDebugger                = 'Code Debugger';
	EZ.pref.codeMostRecentSites         = 'Code Most Recent Sites';
	EZ.pref.codeEvalScript              = 'Code Eval Script';
	EZ.pref.codeEvalHistory             = 'Code Eval History';
	EZ.pref.codeEvalHistoryOptions      = 'Code Eval History Options';

	EZ.pref.codeSearchScope  			= 'Code Search Scope';
	EZ.pref.codeSearchFileFilter		= 'Code Search File Filter';
	EZ.pref.codeSearchHistory           = 'Code Search History';
	EZ.pref.codeSearchHistoryOptions    = 'Code Search History Options';

	// NEW bookmarks
	EZ.pref.bookmarksSort				= 'Bookmarks Sort';
	EZ.pref.bookmarksRecentEnabled		= 'Bookmarks Recent Enabled';
	EZ.pref.bookmarksRecentSort			= 'Bookmarks Recent Sort';
	EZ.pref.bookmarksRecentLimit		= 'Bookmarks Recent Limit';

	EZ.pref.bookmarksFilterEnabled		= 'Bookmarks Filter Enabled';
	EZ.pref.bookmarksFilterOver			= 'Bookmarks Filter Over';
	EZ.pref.bookmarksFilterString		= 'Bookmarks Filter String';
	EZ.pref.bookmarksFilterType			= 'Bookmarks Filter Type';

	// functions
	EZ.pref.functionsSort				= 'Functions Sort';
	EZ.pref.functionsRecentEnabled		= 'Functions Recent Enabled';
	EZ.pref.functionsRecentSort			= 'Functions Recent Sort';
	EZ.pref.functionsRecentLimit		= 'Functions Recent Limit';

	EZ.pref.functionsFilterEnabled		= 'Functions Filter Enabled';
	EZ.pref.functionsFilterOver			= 'Functions Filter Over';
	EZ.pref.functionsFilterString		= 'Functions Filter String';
	EZ.pref.functionsFilterType			= 'Functions Filter Type';

	EZ.pref.functionsShowAnonymous		= 'Functions Show Anonymous';
	EZ.pref.functionsFilterEnabled		= 'Functions Filter Enabled';
	EZ.pref.functionsFilterString		= 'Functions Filter String';
	EZ.pref.functionsFilterType			= 'Functions Filter Type';

	EZ.pref.functionsInnerDisplayMode	= 'Functions Inner Display Mode';
	EZ.pref.functionsListWhenInsideOuter= 'Functions List When Inside Outer';
	EZ.pref.functionsListAfterOuterClick= 'Functions List After Outer Click';

	// bookmarks and functions cache
	EZ.pref.functionsLastUrl			= 'Functions Last URL';
	EZ.pref.bookmarksRecentList			= 'Bookmarks Recent List';
	EZ.pref.functionsRecentList			= 'Functions Recent List';
	EZ.pref.functionsInnerList			= 'Functions Inner List';

	// timelog
	EZ.pref.timelog                     = 'Timelog'
	EZ.pref.backupLog = 'backup';
	EZ.pref.alerts = 'alerts';
	EZ.pref.log = EZ.pref.backupLog;	//TODO: clone from final backup
	EZ.pref.isCopyBackup = 'isCopyBackup';

	// unit test
	EZ.pref.testFolder                   = 'Test Folder'
	EZ.pref.testFilename                 = 'Test Filename'
	EZ.pref.testFunction                 = 'Test Function'
	EZ.pref.testMarkers                  = 'Test Markers'
	EZ.pref.testOptions                  = 'Test Options'

	EZ.pref.timelogLastActivity = 'timelogLastActivity';
	EZ.pref.timelogSite         = 'timelogSite';
	EZ.pref.timelogInterval     = 1000*60*30;

	//not used as of 05-29-2015 EZ or Revize
	//EZ.pref.values = {};		//instance values

	EZ.pref.defaultValues = {	//define default value if not false
		logMaxsize				: 500000,

		bookmarksRecentEnabled	: true,
		bookmarksRecentLimit	: 10,
		bookmarksFilterEnabled	: true,
		bookmarksFilterType		: 'exact',

		functionsRecentEnabled	: true,
		functionsRecentLimit	: 20,
		functionsFilterEnabled	: true,
		functionsFilterType		: 'exact',
		functionsInnerDisplayMode: 'all',
		functionsListWhenInsideOuter: true,
		functionsListAfterOuterClick: true,
		cache					: false
	}

	//----- Default DW preference values
	EZ.pref.updateLinkswhenfilechange   = {group: 'General Preferences',
										   type: 'int',	//default type is string
										   never: 0,	// ??
										   name:'Update Links when file change'}

	//----- Build arrays of variable names and registry keys
	EZ.pref._vars = [];
	EZ.pref._keys = [];
	for (var key in EZ.pref)
	{
		if (typeof(EZ.pref[key]) != 'object')	//EZ preference reg key
			EZ.pref._keys.push(EZ.pref[key]);

		else if (!EZ.pref[key].name)			//skip defaultValues objects
			continue;

		else									//save DW reg key
			EZ.pref._keys.push(EZ.pref[key].name);

		EZ.pref._vars.push(key);				//EZ.pref._keys[variable-name] to lookup reg key
	}
	EZ.pref.cache = {};							//initially just used by simulator
	EZ.pref.loaded = new Date();
}
/*---------------------------------------------------------------------------------------------
GLOBAL CONSTANTS -- TODO: move to EZ.dw..constant
---------------------------------------------------------------------------------------------*/
EZ.constant = {};
EZ.constant.spaces = EZdup(80,' ');

EZ.constant.copyright = String.fromCharCode(169);				//&copy; (c)
EZ.constant.tradeemark = String.fromCharCode(8482);				//&trade; tm &#x2122;

EZ.constant.DOT = String.fromCharCode(8226);
EZ.constant.EOL = String.fromCharCode(172);
EZ.constant.bigdot = String.fromCharCode(8226);			//used for null, empty, more, etc
EZ.constant.more = EZ.constant.bigdot + ' ' + EZ.constant.bigdot + ' ' + EZ.constant.bigdot;
EZ.constant.insert = EZ.constant.more + '][' + EZ.constant.more;

// http://www.degraeve.com/reference/specialcharacters.php
// http://www.ascii.cl/htmlcodes.htm
EZ.constant.left_angle = String.fromCharCode(171);  			//&laquo; <<
EZ.constant.left_3angles = EZdup(3,EZ.constant.left_angle);		//<<<
EZ.constant.right_angle = String.fromCharCode(187);				//&raquo; >>
EZ.constant.right_3angles = EZdup(3,EZ.constant.right_angle);	//>>>

EZ.constant.up_arrow = String.fromCharCode(8583);				//&uarr; ^
EZ.constant.right_arrow = String.fromCharCode(8594);			//&rarr; -->
EZ.constant.down_arrow = String.fromCharCode(8595);				//&darr; v
EZ.constant.left_arrow = String.fromCharCode(8592);				//&larr; <--

EZ.constant.CRLF = '\r\n';
if (navigator.platform.toLowerCase().substring(0,3) == 'mac')
{
	EZ.platform = 'mac'
	EZ.constant.newline = '\r';
}
else
{
	EZ.platform = 'win'
	EZ.constant.newline = EZ.constant.CRLF;
}
EZ.constant.xmlHeader = '<?xml version="1.0" encoding="utf-8"?>';


//----- FOLDERS
function EZfolders()
{
	EZ.constant.configPath = dw ? dw.getConfigurationPath() : '';
	if (!dw.isNotDW)	//appData path -- not Program Files...Configuration
	{
		var len = dw.getConfigurationPath().length+1;
		EZ.configPathname = document.URL.substr(0,len);

		EZ.configPrefix = document.URL.substr(len);
		EZ.configPrefix = EZ.configPrefix.replace(/[^\/]/g, '').replace(/\//g, '../');
		var dom = dw.getDocumentDOM(EZ.configPrefix + 'Extensions.txt');
		EZ.constant.configPath = dom.URL.replace(/(.*\/).*/, '$1');
		dw.releaseDocument(dom);
	}

	if (!dw.isNotDW)	//appData path -- not Program Files...Configuration
	{
		var dom = dw.getDocumentDOM('../Extensions.txt');
		EZ.constant.configPath = dom.URL.replace(/(.*\/).*/, '$1');
		dw.releaseDocument(dom);
	}
	EZ.constant.commandsPath	= EZ.constant.configPath + "Commands/"
	EZ.constant.logPath     	= EZ.constant.configPath + "Logs/"

	EZ.constant.EZpath       	= EZ.constant.configPath + "Shared/EZ/"
	EZ.constant.EZdataPath     	= EZ.constant.configPath + "Shared/EZ/data/"
	EZ.constant.EZimagesPath   	= EZ.constant.configPath + "Shared/EZ/images/"

	//----- FILES
	EZ.constant.logfile = "EZlog.htm";
	EZ.constant.logfileTemplate = "EZlogTemplate.htm";

	EZ.constant.debugHistoryFile = EZ.constant.EZdataPath + 'debugHistory.json';
	EZ.constant.debugResultsFile = EZ.constant.EZdataPath + 'debugResults.txt';
}
EZ.configPrefix = '';
EZ.configPathname = '';
if (window.dw && !dw.isNotDW) EZfolders()

/*---------------------------------------------------------------------------------------------
Usually called from body onLoad for common innitialization done for all commands.
EZstart() is called if found after common setup code is completed.
---------------------------------------------------------------------------------------------*/
function EZsetup(group)
{
	group = group ? group.toLowerCase() : '';
	if (window.dw && dw.isNotDW && typeof(DW) == 'undefined')
	{
		EZsetup.group = group || '';
		return;
	}
	if (EZgetPref(EZ.pref.debugMode))
	{
		EZ.debugMode = true;
		EZaddClass('body', 'debugBody');
	}
	if (EZ.floater) group = 'floater';	//recalled floater call
	switch (group)
	{
		case 'nosetup': return true;
		case 'floater':
		{
			EZ.isFloater = EZ.floater = true;
			if (dw.getActiveWindow() == null)
			{									//floater may only call EZsetup once...
				if (!EZ.isFloaterSetup) EZwait(true);		//...recall if not setup
				return false;
			}
			if (EZ.isFloaterSetup) return true;	//return if already setup
			break;
		}
		case '':
		{
		}
	}
	EZ.setupgroup = group;
	if (group == 'floater') EZ.isFloaterSetup = true;

	var e;
	try
	{
		// Define theForm and theorm convenience globals
		if (document.forms[0])
		{
			theForm = document.forms[0];
			theform = theForm;
		}

		//----- Init fields with name that matches EZ.pref value
		EZloadPrefs();
		EZ.setupTime = new Date();
		EZlog('-', 'started @ ' + EZ.setupTime);

		/*----- Set breakpoint, if specified
		if (document.URL == EZgetGlobal('breakpointCommand'))
		{
			var funcName = EZgetGlobal('breakpointFunction');
			var script = EZgetGlobal('breakpointScript');
			eval( 'script=' + script );		// convert to function object
			window[funcName] = script; 		// overwrite original function
		}
		*/
		
		//----- Save original display and visibility style properties for all elements
		//		TODO: too over the top but great test of EZ.getEl()
		var tags = document.getElementsByTagName('*');
		for (var i=0; i<tags.length; i++)
		{
			var el = tags[i];
break;			
			if (!el.style) continue;
			if (el == null)
			{
				debugger;
				if (EZ.quit) break;
			}
			
			var visibility = EZgetCurrentStyle(el,'visibility');
			if (visibility != 'hidden') 
				visibility = ''; 
			el.EZorigStyle = {display: EZgetStyle(el,'display'), visibility: visibility};
		}

		//----- Call EZstart()
		if (typeof(EZstart) == 'function')
		{
			//below line did not seem to return true
			//var status = EZgetPref(EZ.pref.enhancedReporting,'novalidate');
			//if (!dw.isNotDW)	// run inside try/catch if enabled
			EZstart();
		}
	}
	catch (e)
	{
		EZexception(e);
	}
	return true;
}
/*---------------------------------------------------------------------------------------------
If firstArg is typeof boolean, use new functionality as described below:

Always cancel prior pending timeout; then continue or queue this function with
current caller arguments (this instance is often the prior instance).

If firstArg is true, contunue to wait (return true)
otherwise return false indicating no waiting required.

Example Call:
	if (EZwait(!g.isSetupDone)) return;
---------------------------------------------------------------------------------------------*/
function EZwait(firstArg,type)
{
	//----------------------------------------------
	// New functionality (first argument is boolean)
	//----------------------------------------------
	if (typeof(firstArg) == 'boolean')
	{
		var ms = type;
		if (!ms) ms = 500;

		var funcObj = EZwait.caller;
		if (funcObj.timeout)
			cancelTimeout(funcObj.timeout);

		funcObj.timeout = 0;
		if (firstArg)
		{
			// get callers array-like arguments as real array
			var args = [].slice.call(arguments.callee.caller.arguments,0);
			setTimeout(function(){ funcObj.apply(this,args) }, ms);
		}
		return firstArg;
	}
	caller = firstArg;		//old functionality argement name

	//----------------------------------------------
	// Old functionality
	//----------------------------------------------
	if (!dw) return true;	//no document??
	if (type.indexOf('inspector') != -1) EZ.isInspector = true;

	var cmd = '';
	if (typeof(document) == 'object')
		cmd = EZgetFileInfo(document.URL).filenameFull;

	//----- Determine if floater is loaded (EZsetup() can be called before doc loaded)
	var isFloaterLoaded = (window.document && window.document.URL);

	//----- If done waiting return false
	if (EZ.global.prefs						//EZ.global.prefs loaded
	&& (!EZ.floater || isFloaterLoaded))	//not floater or floater loaded
	{
		if (EZ.wait > 0)					//should not be true
		{
			var jsFile = 'unknown'
			if (typeof EZfunctionFilename != 'undefined') jsFile = EZfunctionFilename

			EZalert( "EZwait: Code (" + EZ.wait + ") Caller: " + caller + "\n\n"
					+ "JavaScript File: " + jsFile + "\n\n"
					+ "If next screen displays correctly, please provide your Revize software\n"
					+ "distributor with the Code, JavaScript file and next screen name." )
		}
		return false;
	}

	//----- Bump wait counter
	EZ.wait ++;
	if (EZ.wait > 10)
	{
		if ( !confirm("Command waited 5 seconds to start.\n\nContinue waiting?") )
		{
			window.close();
			return true;	// Quit waiting
		}
		else
			EZ.wait = 0;
	}

	//----- Save command properties
	EZ.dw.commandType = type ? type : '';	//command type

	var currentdocument = false;	//assume NOT working on current doc

	if (EZ.dw.commandType == 'object'
	|| EZ.dw.commandType == 'document')
		currentdocument = true;

	EZ.dw.currentdocument = currentdocument;

	// if not DW simulator, restart caller in half a second
	if (!dw.isNotDW) setTimeout(caller, 500);
	return !dw.isNotDW;		//return true if dw; false for simulator
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function EZrecieveArguments(args,names)
{
return;
	EZ.arguments = [].slice.call(args); //all arguments
	EZ.arguments = [].slice.call(args).concat()

	for (var i=0;i<names.length;i++)	//define named arguments
	{
		var value = EZ.arguments[i];
		g[names[i]] = value;
	}
}
/*---------------------------------------------------------------------------------------------
Adds standard buttons if not defined; adds debug buttons if debug enabled

----------------
Input Arguments:
----------------
buttons		(optional) Array containing 2 elements for each button
			(1st is label; 2nd is javascript run when clicked)
			e.g. 	var buttons = ["Run Script", "evalCode();"];

If buttons is null, no buttons are defined (command does not use buttons)

Unless buttons defines OK, Cancel or Help, these buttons are added as follows:
	["OK", "process() ||EZobjectTag();"]		//added as first button
	["Cancel", "window.close();"]				//added after all other buttons
	["Help", "EZhelp(document.URL);"]	  		//  ''   ''     ''   ''    ''

"Clear Trace" & "Debugger" buttons are also added if debugMode is enabled.

***** NOTE: only 10 buttons function - (more display but to not function)
---------------------------------------------------------------------------------------------*/
function EZbuttons(buttons)
{
	if (!buttons || buttons.constructor != Array)
		buttons = [];		//init empty array

	//----- Process OK button
	var idx = buttons.indexOf('OK');
	if (idx == -1)				//no ok buttons
	{
		var func = null;
		if (typeof(process) == 'function')
			func = 'process()';
		else if (typeof(EZobjectTag) == 'function')
			func = 'EZobjectTag()';

		// add OK button to top of buttons array
		if (func)
		{
			//EZfun may have issues in RevizeDialog_sitename or could be issue with setTimeout
			//of form: setTimeout(myfunc,0) NOT of form: setTimeout('myfunc()',0)
			//OR improper use of EZselectOption() having multiple selected for select-one
			//func = 'EZrun("' + func + '")';
			buttons.unshift('OK', func);
		}
	}
	else if (!buttons[idx+1])
		buttons.splice(idx,2);

	//----- Add Cancel and/or Help if not defined
	if (buttons.indexOf('Cancel') == -1)
		buttons.push('Cancel', "window.close();");

	if (buttons.indexOf('Help') == -1)
		buttons.push('Help', "EZhelp(document.URL)");

	//----- Add 'Clear Trace' & 'Debugger' if debugMode
	if (EZisDebug())
	{
		buttons.push('Clear Trace', "EZlogReset()");
		if (buttons.indexOf('Debugger') == -1)
			buttons.push('Debugger'   , "EZrunCommand('EZdebugger.htm')");
		//	buttons.push('Debugger'   , "EZdebuggerBreakpoint()");
		buttons.push('test msg / size', "EZdisplayMessage('long msg ' + EZdup(30,' 1 2 3 4 5 6 7 8 9 0'))");
	}
	return buttons;
}
/*---------------------------------------------------------------------------------------------
Runs command from callers scope, passing all specified arguments)

command can set returnValue to variable or object to be returned.
---------------------------------------------------------------------------------------------*/
function EZrunCommand(cmdFile)
{
	var args = [];
	for (var i=1;typeof(EZrunCommand.arguments[i])!='undefined';i++)
		if (!isNaN(i)) args.push(EZrunCommand.arguments[i]);
	args.push(EZdisplayCaller())

	EZsetGlobal('commandStatus','MARKER');
	var cmdDOM = EZgetDOM(EZ.constant.commandsPath + cmdFile);
	dw.runCommand.apply(EZrunCommand, args);
	EZreleaseDOM(cmdDOM);

	var commandStatus;	//default to undefined
	if (EZgetGlobal('commandStatus') != 'MARKER')
		commandStatus = EZgetGlobal('commandStatus');
	return commandStatus;
}
/*---------------------------------------------------------------------------------------------
Save value of any field with name that matches EZ.pref & close window
---------------------------------------------------------------------------------------------*/
function EZclose(commandStatus)
{
	EZsavePrefs();
	EZcommandStatus(commandStatus)
	window.close();
}
/*---------------------------------------------------------------------------------------------
Save value of any field with name that matches EZ.pref & close window
---------------------------------------------------------------------------------------------*/
function EZcommandStatus(commandStatus)
{
	if (!commandStatus)
	{
		if (typeof(EZ.commandStatus) != 'undefined')
			commandStatus = EZ.commandStatus;
		else
			commandStatus = 'MARKER';		//treated as undefined
	}
	EZsetGlobal('commandStatus',commandStatus);
}
/*---------------------------------------------------------------------------------------------
return debug status
---------------------------------------------------------------------------------------------*/
function EZisDebug()
{
return true;
	if (dw.isNotDW)								//if DW simulator, always return true
		return true;

	else if (EZ.pref && EZ.pref.loaded)			//if EZ preferences initialized
		return EZgetPref(EZ.pref.debugMode)		//...return current setting

	else										//otherwise return false
		return false;
}
/*---------------------------------------------------------------------------------------------
Load pref for all input, select and textarea field tags
---------------------------------------------------------------------------------------------*/
function EZloadPrefs()
{
	var fields = EZgetTagsByClassName(['input','select','textarea']);
	var fieldsProcessed = {};

	for (var i=0;i<fields.length;i++)
	{
		var field = fields[i];
		var key = field.name;
		if (!key) continue;

		// Determine type and skip if button or image
		var type = field.tagName.toLowerCase();
		if (field.tagName == 'input')
			type = field.type.toLowerCase();
		if (/(button|image)/i.test(type)) continue;

		if (fieldsProcessed[key]) continue;		//radio button already processed
		fieldsProcessed[key] = true;

		// if known key
		if (EZ.pref[key])
		{
			var value = EZgetPref(EZ.pref[key]);

			/* TODO: name was required to get radio value in RevizeBookmarks.js::updatePrefs()
			// Find containing form
			var form = EZgetParent(field,'form');	 //see EZ.getAncestor()
			if (form === false) return;
			if (!form) continue;
			*/

			// if all select options stored as pref...
			if (field.options && EZ.pref[key+'Options'])
			{
				var defaultValue = value;	//keep 1st option selected
				if (field.options.length > 0) value = '';

				var options = EZgetPref(EZ.pref[key+'Options']).split(EZ.constant.EOL);
				//if (options.length > 0) EZclearList(field);

				EZselectInit(field);
				for (var i=0;i<options.length;i++)
				{
					value = options[i];
					var text = value;
					var offset = value.lastIndexOf(EZ.constant.DOT);
					if (offset != -1)		//both text and value was saved
					{
						text = value.substring(0,offset);
						value = value.substring(offset+1);
					}
					var selected = (defaultValue == text);
					EZselectOption(field,text,value,selected)
				}
				if (field.selectedIndex == -1) field.selectedIndex = 0;
				EZselectSave(field);
			}
			// quit if error setting field value and cancel button clicked
			else if (EZsetFieldValue(field,value) === false)
				break;
		}
	}
	EZ.pref.loaded = true;
}
/*---------------------------------------------------------------------------------------------
Save value of any field with name that matches EZ.pref

If el passed, only update that pref otherwise update pref for all input fields.
---------------------------------------------------------------------------------------------*/
function EZsavePref(field) {return EZsavePrefs(field)}
function EZsavePrefs(field)
{
	var fields = [];
	if (field)
		fields[0] = field;
	else
	{
		var fields = document.getElementsByTagName('input');
		fields = [].concat.call( [].slice.call(fields),
				 [].slice.call( document.getElementsByTagName('select')),
				 [].slice.call( document.getElementsByTagName('textarea')));
	}
	var fieldsProcessed = {};
	if (fields && fields.length > 0)
	{
		for (var i=0;i<fields.length;i++)
		{
			field = EZgetEl(fields[i]);
			if (field == null) continue;
			
			//below not needed because skipped if EZ.prefs(key) not defined
			//if (field.className && field.className.indexOf('notautopref') != -1) continue;
			var type = field.tagName;
			if (field.tagName == 'INPUT')
				type = field.type;
			if (/(button|image)/i.test(type)) continue;

			var key = field.name;
			if (!key && field[0]) key = field[0].name;
			if (!key) continue;
			if (fieldsProcessed[key]) continue;		//radio button already processed
			fieldsProcessed[key] = true;

			if (!EZ.pref[key]) continue;
			var value = EZgetFieldValue(field);
			EZsetPref(EZ.pref[key],value);

			// Save all select options if ...Option pref defined
			if (field.options && EZ.pref[key+'Options'])
			{
				var options = [];
				for (var i=0;i<field.options.length;i++)
					options.push(field.options[i].text + EZ.constant.DOT + field.options[i].value);
				EZsetPref(EZ.pref[key+'Options'],options.join(EZ.constant.EOL));
			}
		}
	}
	return true;
}
/*---------------------------------------------------------------------------------------------
Use in lieu of "setTimeout( func, 0)" to support enhancedReporting.  EZsetup() calls
EZstart() within a try/catch but of course is lost when setTimeout() starts new thread.
This function restablishes try/catch if enhancedReporting is active otherwise continues
in same manner as previously done with setTimeout calls.

If no arguments, call as follows:
	EZrun(functionObj);			// DCO 11-25-2011: was failing but possible due to
								// overteching object scenarios with apply command.
								// (setTimeout with this form may have also failed)
	EZrun('myfunction()');		// This form resolved issues in some scenarios and
								// probably good in all scenarios.

If arguments, use the following syntax:
	EZrun( function() {somefunction(arg1,arg2,...)} );

// DCO 11-25-2011: Below statement makes no sense since this is to be used in lieu
// of setTimout; same thread code disabled and tweaked object code for string type.
If functionObj is string, run in current thread
---------------------------------------------------------------------------------------------*/
function EZrun(functionObj,delay)
{
	var e;
	var enhancedReporting = EZgetPref(EZ.pref.enhancedReporting);
	if (!delay) delay = 0;

	//----- If functionObj is string...
	if (typeof functionObj != 'function')
	{
		if (enhancedReporting && !dw.isNotDW)
		{
			setTimeout(function()
			{
				var e;
				try { eval(functionObj); }
				catch (e) { EZexception(e); }
			}, delay);
		}
		else
		{
			try
			{
				return eval(functionObj);
			}
			catch (e)
			{
				EZexception(e);
			}
			return;
			setTimeout( function()
			{
				eval(functionObj);
			}, delay);
		}
		/****** DCO 11-25-2011: if using in lieu of setTimeout(), should always use new thread
		if (enhancedReporting)
		{
			var e;
			try { eval(functionObj); }
			catch (e) { EZexception(e); }
		}
		else
			eval(functionObj);
		******/
	}

	//----- If functionObj is function object...
	else
	{
		if (enhancedReporting && !dw.isNotDW)
		{
			setTimeout( function()
			{
				var e;
				try { functionObj(); }
				catch (e) { EZexception(e); }
			}, 0);
		}
		else
		{
			setTimeout( function()
			{
				functionObj();
			}, 0);
		}
	}
}
/*---------------------------------------------------------------------------------------------
Simulates JavaScript "debugger" command within the Dreamweaver API framework.

Starts Revize JavaScript debugger at current point in function or if called as command,
runs in global scope and only has access to global functions and data.

--------------------------------------------------
To call from a DW function: eval(EZdebugger(this))
--------------------------------------------------

Captures calling function scope by returning code to the eval command to creates an EZeval(cmd)
function that runs in the calling function scope.  The code returned to the eval then starts the
debugger which then uses EZeval() to run commands in the calling function scope.
---------------------------------------------------------------------------------------------*/
function EZdebugger(functionThis,errorCallback)
{
	var results,id;
	//if (dw.isNotDW) return;
	if (EZ.noDebug) return;
	var caller = EZdebugger.caller;
	var callerStr = caller ? caller.toString() : ''
	EZlog('caller', callerStr);

	// Define callback function using EZdebuggerEval function as base.
	// (used below and by debugger when calling functions)
	// Split code before first bracket (i.e. function xxx (...) and code
	// between to the first and last brackets
	results = EZdebuggerEval.toString().match(/([\s\S]*?)({[\s\S]*})/);
	EZdebugger.evalFunction = 'function(cmd)' + results[2] + ';';

	//----- Variables passed to EZdebugger or EZdebuggerBreakpoint -----\\
	EZdebuggerStart.theCaller = EZdebugger.caller;		//needed for hta enviornment
	EZdebuggerStart.functionThis = functionThis;		//calling function this object
	EZdebuggerStart.functionName = '_MAIN_';			//if called from main line
	results = callerStr.match(/\s*function\s*(\w*)[\s\(]/);
	if (results)										//called from function
	{
		EZdebuggerStart.functionName = results[1];		//function name
		if (!EZdebuggerStart.functionName) 				//blank function name
			EZdebuggerStart.functionName = 'anonymous';
	}
	EZlog('debug function', EZstripConfigPath(document.URL) + '::' + EZdebuggerStart.functionName);

	// Default code run after return from debugger in DW environment
	EZdebuggerStart.proceed = true;

	//----- return script run by the calling eval command -----\\
	//		assume call is of form: eval(EZdebugger(this))
	if (typeof(functionThis) == 'object')
	{
		var evalFunction = EZdebuggerStart.functionName + '.EZeval=' + EZdebugger.evalFunction;

		// For DW enviornment, code run after debugger window closes
		var proceedFunc = 'eval(EZdebuggerStart.proceed);';

		// For hta enviornment, if return not on same line as EZdebugger(), kill remaining script
		// (DW enviornment will move return to next line)
		if (dw.isNotDW && !callerStr.match(/eval\(EZdebugger\(this\)\);?\s*return.*/))
			proceedFunc = 'die()';

		// code run by calling eval command:
		//	1) define debugger eval function
		// 	2) start debugger
		//	3) code run after EZdebugger.htm window closes (or immediately for hta)
		return evalFunction + 'EZdebuggerStart();' + proceedFunc;

		// test code
		var callback = 'this.EZdebug=function(cmd){return eval(cmd)}';
		EZdebuggerStart.debuggerCall = 'EZdebuggerStart();eval(EZdebuggerStart.proceed)';
		EZdebuggerStart.callback = functionThis;			//this object of the caller
		var callback = 'testit.EZeval=function(cmd){return eval(cmd)}';
		return callback + ';' + EZdebuggerStart.debuggerCall;

		// prior code
		results = EZdebuggerEval.toString().match(/([\s\S]*?)({[\s\S]*})/);
		var callback = 'this.EZdebug=function(cmd)' + results[2];
		EZdebuggerStart.debuggerCall = 'EZdebuggerStart();eval(EZdebuggerStart.proceed)';
		return callback + ';' + EZdebuggerStart.debuggerCall;

		/*
		"this.EZdebug=function(cmd){
			return eval(cmd)
		};EZdebuggerStart();eval(EZdebuggerStart.proceed)"
		*/
	}

	//----- When functionThis not specified, run the EZdebuggerBreakpoint() command
	//		TODO: not complete
	else
	{
		var funcName = EZdebugger.callerStr.match(/function (\w*)/)[1];
		EZdebuggerBreakpoint(document.URL,funcName,0,'EZdebugger()');

		// Ideally we want to quite javascript processing at this point
		die();

		//TODO: need to update function so it does not continue
		var emptyFunction = new Function('', '');
		EZdebugger.caller = emptyFunction();	//does not stop function
		return;
	}

}
/*---------------------------------------------------------------------------------------------
This function created in caller scope to run script from debugger.
---------------------------------------------------------------------------------------------*/
function EZdebuggerEval(cmd)
{
	return eval(cmd)
}
/*---------------------------------------------------------------------------------------------
UNTESTED improved eval function to replace EZdebuggerEval()
---------------------------------------------------------------------------------------------*/
function EZdebuggerEvalBetter(cmd,cmdResults)
{
	//cmd = cmd.trim();

	var obj;	//used to capture cmd results inside eval
	if (/^[\[\{]/.test(cmd) || typeof(cmd) == 'object')
		cmd = 'obj='+cmd;
	else if (!/=/.test(cmd))
	{
		if (typeof cmd == 'string')
			cmd = cmd.toString().replace(/'/g,"\\'");
		cmd = 'obj="' + cmd + '"';	//"
	}

	var results = eval(cmd);
	if (/=/.test(cmd)) obj = results;

	if (cmdResults)
		cmdResults = EZdisplayObject(obj);
	return obj;
}
/*---------------------------------------------------------------------------------------------
Starts debugger;

debuggerCall=true when called from EZdebugger.hta to make a function call.
DW framework (i.e. EZdebugger.htm) handles these function calls differently.

Called from code returned by EZdebugger() call after defining eval function therefore
may need to be ignored if debugger already running.
---------------------------------------------------------------------------------------------*/
function EZdebuggerStart(debuggerCall)
{
	//if (!EZwarn('EZdebuggerStart: ready to launch JavaScript Debugger')) return;

	//----- When called from function being debugged; NOT called from within the debugger
	EZ.debugStack = EZgetGlobal('debugStack');
	if (!EZ.debugStack)
	{
		EZ.debugStack = [];
		EZsetGlobal('debugStack',EZ.debugStack);
	}
//?	if (!debuggerCall)
	{
		EZ.debugStack.push({
			functionThis: EZdebuggerStart.functionThis,
			functionName: EZdebuggerStart.functionName,
			parentFunctionName: '',
			selectedIndex: 0,
			callerStack: EZdisplayCaller()
		})
	}

	//----- Called via simulator
	if (dw.isNotDW)
	{
		var url = EZ.simulator.domain + 'Commands/EZdebugger.htm';
		var name = 'EZdebugger';
		var features = '';
		EZ.debuggerwin = window.open(url, name, features);
	}

	//----- Called from DW framework, run EZdebugger.htm command;
	else
	{
		////if (EZgetGlobal('debuggerRunning')) return;	//debugger running
		////EZsetGlobal('debuggerRunning',true);

		var cmdFile = "EZdebugger.htm";
		var cmdDOM = EZgetDOM(EZ.constant.commandsPath + cmdFile)

		// This statement does not return until the EZdebugger.htm command window is closed.
		//dw.runCommand(cmdFile, EZdebuggerStart.callback, callStack, EZdebuggerStart, this);
		dw.runCommand(cmdFile, EZdebuggerStart, this);

		EZreleaseDOM(cmdDOM);
		if (!EZdebuggerStart.proceed)			//if not empty, script canceled
			window.close();

		////EZsetGlobal('debuggerRunning',false);			//debugger not running
	}
}
/*---------------------------------------------------------------------------------------------
Called by debugger in simulator mode during setup
---------------------------------------------------------------------------------------------*/
function EZdebuggerReceiveArguments()
{
	EZ.debuggerwin.receiveArguments(EZdebuggerStart,this);
}
/*---------------------------------------------------------------------------------------------
Called at beginning of functions stepped into, to capture scope.
---------------------------------------------------------------------------------------------*/
function EZdebuggerScope(callerThis,fn)
{
	functionThis = callerThis;
	functionName = fn;
	return 'this.'+fn+'.EZeval=function(cmd){return eval(cmd)}'
}
/*---------------------------------------------------------------------------------------------
Called by Debugger button from most commands or when EZdebugger() statement within a function
and called w/o functionThis argument or from within an eval() statement.

The EZdebuggerBreakpoint.htm command runs and replaces the EZdebugger() call with the required
eval(EZdebugger(this)); command.

TODO: retain debugger breakpoints accross calls via prefs (with clear option)
---------------------------------------------------------------------------------------------*/
function EZdebuggerBreakpoint(url,fn,lineNumber,lineCode)
{
	EZsetPref(EZ.pref.debugDisabled,false)

	var cmdFile = EZ.constant.commandsPath + "EZdebuggerBreakpoint.htm";
	var cmdDOM = EZgetDOM(cmdFile);
	dw.runCommand("EZdebuggerBreakpoint.htm",this, url,fn,lineNumber,lineCode);
	EZreleaseDOM(cmdDOM);
}
/*---------------------------------------------------------------------------------------------
Run eval on specified Javascript; display results with EZdisplayObject()

Required fields: codeEvalScript, evalButton, resultEl
Optional field: codeEvalHistory

Arguments:
	resultsEl 	(required) form field for eval results
	resultsLines (optional) use trace if results no lines exceeds
---------------------------------------------------------------------------------------------*/
function EZeval(resultsEl, format /*resultsLines*/, formatOptions)
{
	var resultsLines = undefined;
	if (typeof format == 'number')
	{
		resultsLines = format;
		format = undefined;
	}
	var results, e;
	try
	{
		var evalBtn = document.getElementById('evalButton') || theForm.evalButton.value;
		if (!evalBtn) return EZevalError('field id=evalButton not defined');

		var scriptEl = document.getElementById('codeEvalScript') || theForm.codeEvalScript.value;
		if (!scriptEl || typeof(scriptEl) != 'object')
			return EZevalError('field theForm.codeEvalScript not defined or form element');

		resultsEl = EZgetEl(resultsEl);
		if (resultsEl == null)
		{	//get results field id from evalButton onclick handler
			//onClick=EZeval(document.theForm.evalResults) EZeval(el) EZeval(text)
			results = evalBtn.onclick.toString().match(/EZeval\(['"]?(.*?)['",) ]/);	//"
			if (results) resultsEl = results[1];

			resultsEl = EZgetEl([resultsEl,'evalResults']);
			if (resultsEl == null) return EZevalError('invalid results field');
		}
		EZshow(resultsEl);			// show results if hidden
		if (!EZisPref(EZ.pref.evalAppendResults))
			resultsEl.value = '';	// clear prior results if not appending
		else if (resultsEl.value)
			resultsEl.value = '\n' + resultsEl.value;

		// move off eval input field to update value of codeEvalScript field
		evalBtn.focus();
		var value = scriptEl.value;
		if (value.right(1) == ';') value = value.substr(0,value.length-1);

		//resultsEl.value = EZformatdate('','time') + ' Eval Result of: ' + value
		resultsEl.value = EZformatdate('','time') + ' eval() results'
						+ (format ? ' (format: ' + format + '):' : ':')
						+ '\n@results@\n' + resultsEl.value;

		//------------------------------------------------------------
		if (value === '') return;
		if (!format)
			results = eval('EZdisplayObject(' + value + ')');
		else
		{
			results = eval('results=' + value /* script */);
			
			results = format.includes('toString') 				//EZ.toString
					? EZ.toString(results, formatOptions || {})
					
					: !format.includes('stringify') 			//no formatting
					? results.toString().trim().replace(/\t/g, '    ')
			
					: format.includes('EZ') 
					? EZ.stringify(results, formatOptions||null, 4)	//EZ.stringify
					: JSON.stringify(results,null,formatOptions||4)	//JSON.stringify
		}
		//------------------------------------------------------------

		// if number of lines in results exceeds resultLines
		var count = results.match(/\n/gm);
		count = (count && resultsLines && count.length > resultsLines)
		if (count || EZisPref(EZ.pref.evalLogResults))
		{
			EZlog('results',results)
			if (count) results = 'EZ log contains full results\n' + results;
		}
		resultsEl.value = resultsEl.value.replace(/@results@/, results);

		if (scriptEl.lastValue != value)	//update history if new result
		{
			scriptEl.lastValue = value;
			EZsavePrefs(scriptEl);

			// if history field defined, update with this script
			var historyEl = EZ('codeEvalHistory'); //theForm.codeEvalHistory;
			if (historyEl)
			{
				var options = [value];
				for (var i=0;i<historyEl.options.length;i++)
				{
					if (value != historyEl.options[i].text)
						options.push(historyEl.options[i].text);
				}
				if (options.length > 20) options.length = 20;
				EZdisplayDropdown(historyEl,options,value);
				EZsavePrefs(historyEl);
			}
		}

		/* did not work -- just put trash before script field and remove onFocus() handler
		// restore onFocus() to eval script field in 1/2 sec, field gets focus now
		setTimeout(function() {theForm.codeEvalScript.onfocus="this.onfocus='';"
								+ "setTimeout('theForm.codeEvalScript.select()',10)"}, 500);
		*/
		//-------------------- done -------------------\\
		//if (scriptEl && scriptEl.id) setTimeout(scriptEl.id + '.focus()',10)
		//---------------------------------------------//
	}
	catch (e)
	{
		results = e.name + ': ' + e.message;
		if (resultsLines)
			results += '\n\nSee Trace Log for more details';

		EZlog('EZeval Javascript Exception', results);
		//EZlog('','\n'+EZdisplayObject(e,'Javascript Exception:'));

		if (resultsEl && typeof(resultsEl.value) == 'string')
			resultsEl.value = resultsEl.value.replace(/@results@/, results);
	}

	function EZevalError(msg)
	{
		if (scriptEl && typeof(scriptEl.value) == 'string') scriptEl.value = msg;
		EZlog(' ',msg);
		return false;
	}
}
/*---------------------------------------------------------------------------------------------
Determine Dreamweaver version
Example dw.appVersion() values:
	7.0.2052 [en] (Win32)
---------------------------------------------------------------------------------------------*/
function EZdwVersion()
{
	var version = parseFloat(dw.appVersion)
	if (isNaN(version)) version = 0
	return version
}
/*---------------------------------------------------------------------------------------------
Determine if object is empty -- do NOT use EZ.isTrue() it uses this function.

logacy: true if any propery or function defined

latest:
	true if o.valueOf() false and length == 0 -OR- has non-hasOwnProperties property
---------------------------------------------------------------------------------------------*/
function EZisEmpty(o, options)
{
	if (!o || typeof(o) != 'object') return true;
	
	// use options.legacy setting if defined otherwise EZ.legacy.isEmpty
	var isLegacy = 'options.legacy'.ov('EZ.legacy.isEmpty'.ov(true)) 
	
	if (!isLegacy && !o.valueOf() && (!EZisArrayLike(o) || o.length == 0)) 
		return false;
	
	for (var p in o) 
		if (!o.hasOwnProperties(p) || isLegacy) 
			return false
	
	return true;
}
/*---------------------------------------------------------------------------------------------
Determine Dreamweaver version
---------------------------------------------------------------------------------------------*/
function EZisMDI()
{
	var mdiMode = false
	if (EZdwVersion() >= 6) mdiMode = dw.isMDI()
	return mdiMode
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function EZshowLayer(layer,trueFalse)
{
	//alert(layer.id + ';' + layer.visibility + ' --> ' + trueFalse)

	if (typeof(layer) == 'string') layer = document.getElementById(layer);
	if (!layer) return;

	if (trueFalse)
	{
		if (layer.visibility != 'visible')
			layer.visibility = 'visible'
	}
	else
	{
		if (layer.visibility != 'hidden')
			layer.visibility = 'hidden'
	}
}
/*---------------------------------------------------------------------------------------------
Set el value to browse filename or location
---------------------------------------------------------------------------------------------*/
function EZbrowse(el)
{
	var value = dw.browseForFileURL("select", "Select Next URL", false, true);
	while (value.substr(0,3) == '../')
		value = value.substring(3);
	el.value = value;
}
/*---------------------------------------------------------------------------------------------
this function takes a string and removes any leading or ending blank spaces
---------------------------------------------------------------------------------------------*/
function EZencodeSpecialHtml(tmpStr)
{
	tmpStr = tmpStr.split('"').join('&quot;')
	tmpStr = tmpStr.split('<').join('&lt;')
	tmpStr = tmpStr.split('>').join('&gt;')
	return tmpStr;
}
/*---------------------------------------------------------------------------------------------
EZreplacesubstring(inStr, fromString, toString)

Replace all occurances of fromString with toString
(retain EZreplaceAll for backward compatibility)
---------------------------------------------------------------------------------------------*/
function EZreplaceAll( inStr, fromString, toString )
{ return EZreplacesubstring( inStr, fromString, toString ) }
function EZreplacesubstring( inStr, fromString, toString )
{
	var pos = 0
	var fromLen = fromString.length
	if (fromLen == 0) return inStr

	while (true)
	{
		pos = inStr.indexOf(fromString,pos)
		if (pos == -1) break
		inStr = EZsubstring( inStr, 0, pos )
		      + toString
		      + EZsubstring( inStr, pos + fromLen )
		pos += toString.length
	}
	return inStr
}
/*---------------------------------------------------------------------------------------------
Subsitute for substring method (does not produce javascript errors)

A null or empty input string returns empty string

Start and end positions outside boundries intrepreted as follows:

	if end position not specified or greater than string length,
	adjust to input string length

	if end position before 1st character,
	return empty string

	if start position greater than ending position,
	return empty string

	if start position less than 0,
	assume 0

Input Arguments
===============
	str			Input string
	startpos	Starting position
	endpos		Ending position (optional)

---------------------------------------------------------------------------------------------*/
function EZsubstring(str, startpos, endpos)
{
	if (typeof endpos == 'undefined') endpos = str.length + 1

	//----- Validate input string
	if (str == null ||str.length == 0)	//if null or empty string
		return "";						//...return empty string

	//----- Validate end position
	if (endpos > str.length )			//greater than string length
		endpos = str.length;			//...set to length

	else if( endpos <= 0 )				//if end position before 1st character
		return "";						//...return empty string

	//----- Validate start position
	if( startpos >= endpos )  			//if start position greater than ending position
		return "";						//...return empty string

	else if (startpos < 0) 				//if start position less than 0
		startpos = 0;					//...assume 0

	//----- Return the substring
	return str.substring(startpos,endpos);
}
/*---------------------------------------------------------------------------------------------
Display context sensitive help
---------------------------------------------------------------------------------------------*/
function EZhelp(helpId)
{
	var helpUrl = dw.getConfigurationPath()+ '/revize/help/' + helpId + '-Help.htm';
	if (!DWfile.exists(helpUrl) )
		alert('No Help file found.\n\nHelpId: ' + helpId + '-Help.htm' )
	else
		dreamweaver.browseDocument(helpUrl);
}
/*---------------------------------------------------------------------------------------------
Scroll to show current selection as first options displayed
---------------------------------------------------------------------------------------------*/
function EZselectScroll(field,selectedIndex)
{
return;
	if (typeof(field) != 'object') return;
	if (!selectedIndex) selectedIndex =field.selectedIndex;
	if (selectedIndex < 0) selectedIndex = 0;

	if (!field.EZscroll)
		field.EZscroll = {selectedIndex:-1};	//forces reset

	var scroll = field.EZscroll;
EZlog('EZselectScroll',scroll);
EZlog('',selectedIndex)

	// determine if display reset required
	// field.selectedIndex != scroll.selectedIndex
	if (scroll.selectedIndex == -1
	|| selectedIndex < scroll.top || selectedIndex >= scroll.bottom)
	{
		scroll.top				= selectedIndex;
		scroll.selectedIndex	= selectedIndex;
		scroll.bottom			= selectedIndex+field.size;
EZlog('','scrolling')

		// toggle div visibility
		var div = document.getElementById('dataUndefined');
		if (div)
		{
			var state = div.style.visibility;
			var stateChange = (state == 'hidden' ? 'visible' : 'hidden');
			div.style.visibility = stateChange;
			div.style.visibility = state;
		}
	}
	scroll.selectedIndex	= selectedIndex;
}
/*---------------------------------------------------------------------------------------------
SET Field value (exists in Dreamweaver...\RevizeCommon.js and \util\snippet_helper.js)
---------------------------------------------------------------------------------------------*/
function EZsetFieldValue(field, value, options )
{
	var i;
	if (typeof field == 'string') field = document.forms[0][field];
	if (!options) options = '';

	if (typeof field == 'undefined' || typeof field != "object")
		return EZwarn('field argument not an object: ' + field);

	//----- Setup for radio buttons
	var radioChecked = true;	//supresses message if not radio button

	// determine true / false interpretation of value
	var radioBoolean = false;
	if(value+''.toLowerCase() == 'on'
	|| value+''.toLowerCase() == 'yes'
	|| value+''.toLowerCase() == 'true')
		radioBoolean = true;

	//********** text fields **********\\
	if (field.type == 'text'
	|| field.type == 'Text'		// for DW
	|| field.type == 'textarea'
	|| field.type == 'password'
	|| field.type == 'hidden')
	{
		var disabled = null
		if (typeof value == 'undefined') value = '';
		if (typeof field.disabled != 'undefined')
		{
		  disabled = field.disabled
		  field.disabled = false
		  field.disabled = ''
		  field.value = value
		  field.disabled = disabled
		}
		else
		  field.value = value
	}

	//********** checkbox **********\\
	else if (field.type == 'checkbox')
	{
		if (value == null)
			value = false;

		if (value === false)			//avoids invalid use of toLowerCase()
			field.checked = false

		else if (value == true
		|| value == field.value
		|| value.toLowerCase() == 'on'
		|| value.toLowerCase() == 'yes'
		|| value.toLowerCase() == 'true' )
			field.checked = true
		else if (value)
			field.checked = false
	}

	//********** dropdown menu or list **********\\
	else if (field.type == 'select-one'
	|| typeof field.selectedIndex != 'undefined' )	//test undefined is DW hack
	{
		for (i=0; i<field.options.length; i++)
		{
			if (field.options[i].value == value)
			{
				if (EZcheckOptions(options,'trace'))
					dw.log('EZsetFieldValue',field.name+' value '+value+'('+i+') selected');
				field.options[i].selected = true
				if (window.EZselectScroll) EZselectScroll(field,i)
				break;
			}
		}
	}

	//********** array of radio button fields **********
	//(has checked property and not caught as checkbox above)
	else if (field.length > 0 && field[0].checked != 'undefined')
	{
		radioChecked = false;
		for (i=0; i<field.length; i++)
		{
			if (field[i].value == value+'')
			{
				field[i].checked = true;
				radioChecked = true;
				break;
			}

			// if non false value, uncheck default selection if there is value
			else if (field[i].checked && !radioBoolean && value)
				field[i].checked = false;
		}
	}

	//********** single dim radio button field EZsetup() **********
	else if (field.type == 'radio')
	{
		radioChecked = false;

		// find all other fields with same name
		var fieldGroup = [];
		var fields = document.getElementsByTagName('input');
		for (i=0;i<fields.length;i++)
			if (fields[i].name == field.name)
				fieldGroup.push(fields[i]);

		for (i=0; i<fieldGroup.length; i++)
		{
			// if passed value matches button value, select it
			if (fieldGroup[i].value == value+'')
				fieldGroup[i].checked = true;

			// if non false value, uncheck default selection if there is value
			else if (fieldGroup[i].checked && !radioBoolean && value)
				fieldGroup[i].checked = false;

			if (fieldGroup[i].checked)
				radioChecked = true;
		}
	}

	//********** unsupported type **********\\
	else
		return EZwarn( 'EZsetFieldValue does not support type: ' + field.type
			 		 + ' (field: ' + field.name + ')' )

	//----- if no radio button checked and non false value supplied, report error
	if (!radioChecked && value != '' && radioBoolean)
		return EZwarn('Radio button field ('+field[0].name+') no button for value: ' + value);

	return {'function': 'EZsetFieldValue()', fieldName: field.name, fieldValue: value};
}
/*---------------------------------------------------------------------------------------------
GET Field value (exists in Dreamweaver...\RevizeCommon.js and \util\snippet_helper.js)
  || field.type == 'Text'		// for DW
---------------------------------------------------------------------------------------------*/
function EZgetFieldValue(field,options)
{
	var i;
	var value = ''
	if (typeof field == 'string') field = document.forms[0][field];
	if (typeof options == 'undefined') options = '';

	if (typeof field == 'undefined' || typeof field != "object")
	{
		EZlog('EZgetFieldValue field invalid',field);
		return value;
	}

	if (field.type == 'text'
	|| field.type == 'textarea'
	|| field.type == 'password'
	|| field.type == 'hidden')
		value = field.value

	else if (field.type == 'checkbox')
	{
		if (options.indexOf('text') == -1)
			value = field.checked
		else
		{
			if (field.checked)
				value = field.value
			else
				value = ""
		}
	}

	else if (field.type == 'select-'				// select-one or select-multiple
	|| typeof field.selectedIndex != 'undefined' ) 	// undefined is DW hack
	{
		if (field.selectedIndex < 0)
		{
			if (typeof field.unchecked == 'undefined')
				value = '|'
			else
				value = field.unchecked
		}
		else
		{
			for (i=0; i<field.options.length; i++)
			{
				if (field.options[i].selected)
				{
					if (options.indexOf('text') >= 0 || field.text)
						value += '|' + field.options[i].text
					else
						value += '|' + field.options[i].value
				}
			}
		}
		if (value.substring(0,1) == '|') value = value.substring(1)
	}

	//********** array of radio buttons **********\\
	else if (field.length > 0 && field[0].checked != 'undefined')
	{
		for (i=0; i<field.length; i++)
		{
			if (field[i].checked)
			{
				value = field[i].value
				break;
			}
		}
	}

	//********** single dim radio button field EZsavePrefs() **********
	else if (field.type == 'radio')
	{
		// check all fields with same name
		var fields = document.getElementsByTagName('input');
		for (i=0;i<fields.length;i++)
			if (fields[i].name == field.name && field.checked)
				value = fields[i].value;
	}
  	else
		return EZwarn( 'EZgetFieldValue does not support type: ' + field.type
			  		 + '(name: ' + field.name + ')' )
	return value;
}
/*---------------------------------------------------------------------------------------------
Define EZoptionValues object.
TODO: this function is duplicated in RevizeCommon.js and RevizeError.htm  (avoids crash on MAC)
---------------------------------------------------------------------------------------------*/
function EZoptionValues()
{
	this.options = {};
	//this.values = new Array();
}
/*---------------------------------------------------------------------------------------------
Add new option and value to optionValues object (replace existing option)
TODO: this function is duplicated in RevizeCommon.js and RevizeError.htm  (avoids crash on MAC)
---------------------------------------------------------------------------------------------*/
function EZsetOptionValue(optionValues,option,value)
{
	optionValues.options[option] = value;

	/*
	var idx = optionValues.options.length;
	optionValues.options[idx] = option;
	optionValues.values[idx] = value;
	*/
}
/*---------------------------------------------------------------------------------------------
Insert snippet (substituding all value options)
TODO: this function was duplicated in RevizeError.htm to avoid crash on MAC
	  as of 04-18-2011 only defined in RevizeCommon.js
---------------------------------------------------------------------------------------------*/
function EZgetSnippetCode(filename, optionValues)
{
	var snippetCode;
	if (DWfile.exists(filename) == true)
	{
		snippetString = DWfile.read(filename);
		snippetCode = EZreplaceOptions(snippetString, optionValues.options);
	}
	else
		snippetCode = EZ.constant.RevizeError + ' Snippet (' + filename + ') Not Found"%>';

	dw.log('-',
	        filename +
	        '\n__________________________________________________________' +
	        '\n' + snippetCode +
	        '\n__________________________________________________________' )
	return snippetCode;
}
/*---------------------------------------------------------------------------------------------
Called to insert or replace ALL snippet options.
TODO: should check for @@arg@@ not just @@arg
TODO: this function is duplicated in RevizeCommon.js and RevizeError.htm  (avoids crash on MAC)
---------------------------------------------------------------------------------------------*/
function EZreplaceOptions(inStr, valueOptions, note)
{
	if (typeof(note) == 'undefined') note = '';
	var inStrLower, EZoption, beginOption
	var msg = ''
	var option = '';
	var options = valueOptions;
	if (typeof(valueOptions.options) == 'object')
		options = valueOptions.options;

	if (note != null) dw.log('EZreplaceOptions: '+note,'');
	if (!inStr) return '';

	inStrLower = inStr.toLowerCase();
	for (option in options)
	{
		msg += option + ' = ' + options[option] + '\n'
		var optionLower = option.toLowerCase();
		beginOption = inStrLower.indexOf('@@' + optionLower, 0);

		while(beginOption != -1)
		{
			inStr = inStr.substring(0,beginOption)
			      + options[option]
			      + inStr.substring(beginOption + optionLower.length + 4);  // +4 for +@
			inStrLower = inStr.toLowerCase();
			beginOption = inStrLower.indexOf('@@' + optionLower, beginOption + 1);
		}
	}

	if (note != null) dw.log('',msg)	// display all option values
	return inStr;
}
/*---------------------------------------------------------------------------------------------
Create folders for saveLocation if they do not already exist.
saveLocation is of the following form: file:///C|/revizenew/www/revize/demositeIII
---------------------------------------------------------------------------------------------*/
function EZcreateFolders(saveLocation,msg)
{
	if (typeof msg == 'undefined')
		msg = ''
	else msg += '\n\n';

	//----- Determine folder seperator
	var slash = '';
	if(saveLocation.indexOf("\\") != -1)
		slash = "\\";
	else if(saveLocation.indexOf("/") != -1)
		slash = "/";

	if (slash == '') return;	//no folders to create

	//----- Create folders coresponding to pathname.
	// starting pathIndex is either after file:/// or -1
	var pathTest = 'file:'+slash+slash+slash+slash+slash
	var pathIndex = saveLocation.indexOf(pathTest);
	if (pathIndex == -1)
	{
		var pathTest = 'file:'+slash+slash+slash
		var pathIndex = saveLocation.indexOf(pathTest);
	}
	if (pathIndex >= 0)
	{
		pathIndex += pathTest.length-1
		pathIndex = saveLocation.indexOf(slash,pathIndex+1);
	}

	while(pathIndex != -1)
	{
		pathIndex = saveLocation.indexOf(slash, pathIndex + 1);
		if (pathIndex == -1) break;

		path = saveLocation.substring(0,pathIndex);

		if(!DWfile.exists(path))
		{
			if (!DWfile.createFolder(path))
			{
				msg += 'Could not create folder (' + path + ')'
				return EZalert(msg);
			}
		}
	}
	return true;
}
/*---------------------------------------------------------------------------------------------
Determine path and filename of current doc (should use: dw.getDocumentPath() )
---------------------------------------------------------------------------------------------*/
function EZgetDocInfo(options)
{
	if (!dw.getActiveWindow()) return '';

	var pathname = dw.getActiveWindow().URL;
	if (pathname == '') return '';

	if (dw.getActiveRelatedFilePath)
		pathname = dw.getActiveRelatedFilePath();
	pathname = EZstripSiteRoot(pathname);

	var fileInfo = EZgetFileInfo(pathname);
	return fileInfo;
}
/*---------------------------------------------------------------------------------------------
Return contains of url or null if there is error
TODO: display error using revizeRecources.js functions
---------------------------------------------------------------------------------------------*/
function EZgetUrl(url)
{
	var returnObj = {status:'', data:''};
	var postReply = MMHttp.getText(url);
	if (postReply.statusCode != 200)
		return null;
	else
		return postReply.data;
}
/*---------------------------------------------------------------------------------------------
Get File Info for specifiec URL or file.

Description:
	Parses either a url or file and breaks apart into individual fully
	qualified components.  By default the input pathname is assumed to be a
	file if the	syntax is ambigious.  To intepret first component as domain
	as browsers do on the address line specify domain as an option.

	If port 80 is specified on input, it is omitted like IE location functions
	TODO: have not verified if Netscape location omits port 80

Parameters:
	pathname-		fully or partially qualified url or path/filename
	options-		=domain treat everything up to first / as domain
					(if protocol not specified e.g. http://)

Return Value List:
	page.domain     = 'http://localhost:8080'		//no trailing slash
	page.pathname   = '/revize/demositeIII'	//with leading slash but not trailing
	page.filename   = 'contacts'
	page.extension  = 'html'
	page.query      = '?webSpace=demositeII&recordid=1'	//contains leading ?
	page.hash       = 'trace'						//leading # omitted
	page.home       = 'http://localhost:8080//revize/demositeIII/index.html'

Notes:
	Regression test at .../revize/util/snippet_helper_getfileinfo_test

	TODO: some scenarios noted as in above test do not currently work properly.
	Many scenarios of domains ARE ONLY intrepreted correctly if domain option
	is specified and the input pathname ends with a slash when no filename.
	(remember page.href however is never returned with ending slash by design)
	See: .../revize/util/snippet_helper_getfileinfo_test for details.
---------------------------------------------------------------------------------------------*/
function EZgetFileInfo(pathname, options)
{
	var pos,idx,results
	var href=''
	var domain=''
	var filename=''
	var sep=''
	var extension=''
	var query=''
	var hash=''
	var home=''
	if (typeof options == 'undefined')
		options = '';
	else
		options += ','
	if (!pathname) pathname = '';
	if (pathname == '#') pathname = location.href
	if (pathname != '')
	{
		pathname = pathname.split('\\').join('/');

		//----- Determine domain
		domain = ''
		pos = pathname.indexOf(':')				//check for first colon :

		//----- If domain option & protocol is missing, prepend to pathname
		if (options.indexOf('domain,') != -1
		&& EZsubstring(pathname,pos+1,pos+3) != '//')
		{
			if (location.protocol != '')
				pathname = location.protocol + '//' + pathname
			else
				pathname = 'http://' + pathname
			pos = pathname.indexOf(':')			//reset colon pos
		}

		//----- If protocol present, e.g. //http:// https:// ftp://
		if (EZsubstring(pathname,pos+1,pos+3) == '//')
		{
			pos += 3
			if (pathname.indexOf('/',pos) != -1)	//if first slash following //:
				pos = pathname.indexOf('/',pos)		//domain goes up to slash
			else if (EZsubstring(pathname,0,4).toLowerCase() != 'file')
				pos = pathname.length				//assume domain is all of pathname
		}
		else if (pos == -1)		//not file type (e.g. C:) so use current page domain
		{
			if (options.indexOf('domain,') != -1
			|| EZsubstring(pathname,0,4).toLowerCase() == 'www.')
			{
				pos = pathname.indexOf('/')
				if (pos >= 0)
				{
					domain = pathname.substring(0,pos)
					pathname = pathname.substring(pos+1)
				}else
				{
					domain = pathname
					pathname = ''
				}
			}
			else
			{
				domain = document.location.host			//blank if file
				if (document.location.protocol != '')	//if not file
				{
					domain = document.location.protocol + '//' + domain
					pos = domain.length
					if (EZsubstring(pathname,0,1) != '/')
						pathname = '/' + pathname
					pathname = domain + pathname
				}
			}
		}

		//-----  if : found, file format of C: (split into domain and pathname)
		if (pos != -1)
		{
			if (pathname.substring(pos,pos+1) == ':')
				domain = pathname.substring(0,pos+1)
			else
				domain = pathname.substring(0,pos)

			pathname = pathname.substring(pos)
			if (pathname.substring(0,1) == ':')
				pathname = pathname.substring(1)
		}

		//----- Strip port 80 if present in domain
		pos = (domain+'/').indexOf(':80/')
		if (pos != -1)
			domain = domain.substring(0,pos);

		//----- Parse pathname and filename
		//		DCO 03-09-2012 previously simple lastIndexOf('/') incorecctly
		//		               found slash past hash "#" or query "?"
		//		e.g. /calendar_app/index.html#Master,03/09/2012
		//			 (both results[0] & results[1] have pathname
		results = pathname.match(/^([^#?]*\/)[^#?]*?/m);

		if (results)	//found slash PRECEEDING query "?" or hash "#"

		{	//results.lastIndex NA on IE9
			pos = results.index + results[1].length;
			filename = pathname.substr(pos);
			pathname = pathname.substr(0,pos-1);
			if (pathname.substr(0,1) != '/')
				pathname = '/' + pathname;
		}
		else			//safe to use lastIndexOf() when no query or hash
		{
			filename = pathname;
			pathname = '';
		}

		//------ Parse search (query)
		pos = filename.indexOf('?')
		if (pos == -1)
			query = ''
		else
		{
			query = filename.substring(pos)
			filename = filename.substring(0,pos)
		}

		//------ Parse hash
		pos = filename.indexOf('#')
		if (pos != -1)
		{
			hash = filename.substring(pos+1)
			filename = filename.substring(0,pos)
		}

		//------ Parse filename extension
		pos = filename.lastIndexOf('.')
		if (pos == -1)
			extension = ''
		else
		{
			extension = filename.substring(pos+1)
			filename = filename.substring(0,pos)
		}
		if (filename == '')		// use index.html when filename is blank
		{
			filename = ''
			extension = ''
		}

		//----- home page (questionable value)
		home = domain + pathname
		if (EZright(home,1) != '/' && pathname != '') home += '/'
	}

	//----- Return all the components
	var page = new Object();
	page.domain = domain;
	page.pathname = pathname;
	page.filename = filename;
	page.extension = extension;
	page.extention = extension;

	page.filenameFull = page.filename;
	if (page.extension)
		page.filenameFull += '.' + extension;
	page.pathfilename = page.filenameFull;
	if (page.pathname)
		page.pathfilename = page.pathname + '/' + page.pathfilename;

	page.query = query;
	page.search = query;
	page.hash = hash;
	page.home = home;

	page.sep = ((extension != '') ? '.' : '')
	page.href = domain
	page.href += pathname
	page.href += ((filename != ''&& EZright(page.href,1) != '/') ? '/' : '')
	page.href += filename + page.sep + extension + query
	if (hash != '') page.href += '#' + hash

	return page
}
/*---------------------------------------------------------------------------------------------
Strip DW/Configuration to .../Configuration

C:/Users/Dell/AppData/Roaming/Adobe/Dreamweaver CC 2014.1/en_US/Configuration
file:///C|/Users/Dell/AppData/Roaming/Adobe/Dreamweaver CC 2014.1/en_US/Configuration
C:\Program Files (x86)\Adobe\Adobe Dreamweaver CS5.5\configuration
C:\Program Files\Adobe\Adobe Dreamweaver CC 2014.1\configuration
---------------------------------------------------------------------------------------------*/
function EZclipConfigPath(url) {return EZstripConfigPath(url)}
function EZstripConfigPath(url)
{
	if (typeof (url) != 'string') return url;

	url = url.replace(/\\/g, '/');
	url = EZstripFileSlash(url);

	var repl = '.../Configuration$1';
	url = url.replace(/\w*?:.*\/en_US\/Configuration.*?(\/|$)/gim, repl);
	url = url.replace(/.*?\/Program Files.*?\/.*?Adobe\/.*?\/Configuration.*?(\/|$)/gim, repl);

	if (EZ.patterns.domain)
		url = url.replace(EZ.patterns.domain, '.../Configuration/$1');
	return url;
}
/*---------------------------------------------------------------------------------------------
Removes file:/// and replaces | with : (e.g. file:///C|/somepath --> C:/somepath
---------------------------------------------------------------------------------------------*/
function EZstripFileSlash(pathfilename)
{
	return pathfilename.replace(/file:\/\/\//,'').replace(/\|/,':')
}
/*---------------------------------------------------------------------------------------------
Strip url query parameters -- url may be string containing multiple url's

JAVASCRIPT Exception:  Cannot read property 'replace' of null
TypeError: Cannot read property 'replace' of null
    at EZstripConfigPath (.../ConfigurationShared/EZ/js/common.js:2106:11)
    at displayXmlFile (.../ConfigurationMenus/EZfunctions_Dynamic.htm?x=4&y=5&functionsInnerDisplay=main&functionsMRUdisplay=true&functionsMRUlimit=10&menuId=RevizeColors.htm&searchInput=&codeSearchHistory=--Prior+Search+Keywords--&codeSearchFileFilter=&menuType=false&functionsMenu=1:77:52)
    at simulatorSetup (.../ConfigurationMenus/EZfunctions_Dynamic.htm?x=4&y=5&functionsInnerDisplay=main&functionsMRUdisplay=true&functionsMRUlimit=10&menuId=RevizeColors.htm&searchInput=&codeSearchHistory=--Prior+Search+Keywords--&codeSearchFileFilter=&menuType=false&functionsMenu=1:68:24)
    at EZstart (.../ConfigurationMenus/EZfunctions_Dynamic.htm?x=4&y=5&functionsInnerDisplay=main&functionsMRUdisplay=true&functionsMRUlimit=10&menuId=RevizeColors.htm&searchInput=&codeSearchHistory=--Prior+Search+Keywords--&codeSearchFileFilter=&menuType=false&functionsMenu=1:40:25)
    at EZsetup (.../ConfigurationShared/EZ/js/common.js:290:4)
    at onload (.../ConfigurationMenus/EZfunctions_Dynamic.htm?x=4&y=5&functionsInnerDisplay=main&functionsMRUdisplay=true&functionsMRUlimit=10&menuId=RevizeColors.htm&searchInput=&codeSearchHistory=--Prior+Search+Keywords--&codeSearchFileFilter=&menuType=false&functionsMenu=1:457:111)
---------------------------------------------------------------------------------------------*/
function EZstripUrlParameters(url)
{
	return url.replace(/(.*?)(\?.*?)(\d*:\d*)/g, '$1?... $3');
}
/*---------------------------------------------------------------------------------------------
Strip any names appended by DW (e.g. -editlist or -editform) or Revize (e.g. *_T0_*)
---------------------------------------------------------------------------------------------*/
function EZstripDashName(filename)
{
	var text = filename

	//----- Strip Revize name(s) after first dash
	var pos = text.indexOf('-beforerevize')
	if (pos >= 0) text = text.substring(0,pos)

	var pos = text.indexOf('-editlist')
	if (pos >= 0) text = text.substring(0,pos)

	var pos = text.indexOf('-editform')
	if (pos >= 0) text = text.substring(0,pos)

	//----- Check for dependent template appended filename qualifiers
	var pos = text.indexOf('_T')
	if (pos >= 0) {
	var str = text.substring(pos+2);  // string after T up to next _
		posNext = str.indexOf('_')
	if (posNext > 0)
		if ( !isNaN(str.substring(0,posNext)) )
	  		text = text.substring(0,pos)
	}
	return text;
}
/*---------------------------------------------------------------------------------------------
Strip site root from url of form: file:///C|/ ...
TODO: does not work for site DW configuration site
---------------------------------------------------------------------------------------------*/
function EZstripSiteRoot(url)
{
	if (typeof url != 'string') return url;

	var siteRoot;
	if (site.getLocalPathToFiles)		//avail with MX+
	{
		siteRoot = site.getLocalPathToFiles();	//returns C:\...\

		// convert to file:///C| format
		siteRoot = siteRoot.replace(/:/,'|').replace(/\\/g,'/');
	}
	else	//not as reliable site currently selected
	{
		siteRoot = dw.getSiteRoot();			//returns file:///C|/ ... /
		siteRoot = siteRoot.substring(8);  		// strip leading (file:///)
	}
	if (!siteRoot) return url;

	siteRoot = siteRoot.substring(0,siteRoot.length-1)	// string trailing /

	var pos = url.toLowerCase().indexOf(siteRoot.toLowerCase())
	if (pos >=0)
		url = url.substring( pos + siteRoot.length+1 )	// strip root plus slash

	EZstripSiteRoot.siteRoot = siteRoot;
	return url;
}
/*---------------------------------------------------------------------------------------------
Return specified option value from the snippet (or default value if option not found)
---------------------------------------------------------------------------------------------*/
function EZgetOptionValueDefault(optionName, snippet, defaultValue)
{
	var optStr = EZgetOptionValue(optionName, snippet)
	if (optStr == null) optStr = defaultValue;
	return optStr;
}
EZGetOptionValueDefault = EZgetOptionValueDefault;
/*---------------------------------------------------------------------------------------------
Return specified option value from the snippet (or null if option not found)
---------------------------------------------------------------------------------------------*/
function EZgetOptionValue(optionName, snippet)
{
	var optStr = unescape(snippet);
	var optStrBeg = "<%-- Option:" + optionName + "="; // EZ.const.begLine;
	var optStrEnd = "--%>"; // EZ.const.endComment;
	var optPosBeg = optStr.indexOf(optStrBeg);
	var optPosEnd = optStr.indexOf(optStrEnd, optPosBeg);

	if(optPosBeg == -1 || optPosEnd == -1)
		return null;

	optStr = optStr.substring(optPosBeg + optStrBeg.length, optPosEnd);
	return EZtrim(optStr);
}
EZGetOptionValue = EZgetOptionValue;
/*---------------------------------------------------------------------------------------------
Dynamically replace text to a form since document.write is not supported.  The first and only
the first placeholder is replaced by given text and the new string returned.

Input Parameters:
	src: 		string containing placeholder to be replaced
	begComment: placeholder for where you want to insert text
	label: 		text you want inserted in string

Should be renamed EZreplace (EZwrite implies file writing)
---------------------------------------------------------------------------------------------*/
function EZwrite( src, begComment, label )
{
	var begCommentIndex = src.indexOf(begComment);
	if (begCommentIndex == -1) return src

	var beginDoc = src.substring( 0, begCommentIndex );
	var endDoc = src.substring( begCommentIndex + begComment.length, src.length );

	return beginDoc + label + endDoc;
}
/*---------------------------------------------------------------------------------------------
Find tag and return value (or defaultValue if tag not found)

TODO: conflicts with EZ.getTagValue
---------------------------------------------------------------------------------------------*/
function RZgetTagValue(tempDOM, tagName, defaultValue)
{
	if (typeof defaultValue == 'undefined') defaultValue = '';
	var tag = new Array();
	tag = tempDOM.getElementsByTagName(tagName)
	return RZattributeValue(tag, 'value', defaultValue)
}
function RZattributeValue( tag, key, defaultValue )
{
	if (tag.length == 0) return defaultValue;

	var value = tag[0].getAttribute(key);
	if (typeof value == 'undefined' || value == '')
		value = defaultValue
	return value;
}
/*---------------------------------------------------------------------------------------------
TODO: variation of this function in RevizeError.js (avoids crash on MAC)
---------------------------------------------------------------------------------------------*/
function EZflashingMessage(waitMsg,doneMsg)
{
	//----- Quit if done message visable
	if (EZ.flashing == 'start')
	{
		EZ.flashing = ''
		document[waitMsg].visibility = "visible";
		if (doneMsg != '')
			document[doneMsg].visibility = "hidden"
	}

	//----- Quit if done message visable
	else if (EZ.flashing == 'stop')
	{
		document[waitMsg].visibility = "hidden";
		if (doneMsg != '' && document[doneMsg])
			document[doneMsg].visibility = "visible"
		return;
	}

	//----- Otherwise toggle wait message and setTime for next toggle
	else
	{
		if (document[waitMsg].visibility != "visible")
			document[waitMsg].visibility = "visible";
		else
			document[waitMsg].visibility = "hidden";
	}
	setTimeout( 'EZflashingMessage("' + waitMsg + '","' + doneMsg + '")', 500 )
}
/*---------------------------------------------------------------------------------------------
Clear Trace Window
---------------------------------------------------------------------------------------------*/
function EZlogDisplay()
{
	if (!DWfile.exists(EZ.constant.logfile)) EZlogReset();	//create empty file
	dw.browseDocument(EZ.constant.logfile);
}
/*---------------------------------------------------------------------------------------------
Clear Trace Window
---------------------------------------------------------------------------------------------*/
function EZlogReset()
{
	EZ.logBuffer = null;
	DWfile.copy(EZ.constant.logfileTemplate, EZ.constant.logfile);
}
/*---------------------------------------------------------------------------------------------
Open Trace Window and Display Message
---------------------------------------------------------------------------------------------*/
function EZtrace(heading,textIn,options)
{ return EZlog(heading,textIn,options) }
/*---------------------------------------------------------------------------------------------
Add msg to log
document.getTitle()
---------------------------------------------------------------------------------------------*/
function EZlog(heading,textIn,options)
{
	if (!EZisPref(EZ.pref.logging)) return false;
	options = options || '';

	// clear logfile if too big
	EZlog.maxsize = EZlog.maxsize || EZisPref(EZ.pref.logMaxsize);
	var logsize = DWfile.getSize(EZ.constant.logfile);
	if (logsize > EZlog.maxsize)
	{
		var msg = 'EZ JavaScript Logfile over ( ' + logsize + ') characters Reset?'
		if (confirm(msg))
			EZlogReset();
		else
			EZlog.maxsize += EZlog.maxsize + logsize;
	}

	var caller = EZlog.caller;
	if (caller == EZtrace) caller = EZtrace.caller;
	else if (caller == EZtrace) caller = EZtrace.caller;
	heading = EZlogHeading(heading, caller);

	var e;
	try
	{
		//----- text argument may be passed by reference to save memory
		var text = ''
		if (textIn == null)
			text = '*null*';

		// just show textIn.XML if revize API call with xml
		else if (typeof textIn == 'object' && textIn.XML && heading.indexOf('forward=dw/Xml') != -1)
		{
			var regex = RegExp('(<' + 'script><!\\[CDATA\\[)([\\s\\S]*?)(\\]\\]></' + 'script>)');

			// remove revize template script
			text = 'XML: ' + textIn.XML.replace(regex, '<' + 'script>...NOT SHOWN...</' + 'script>)');

			//text = 'XML:' + textIn.XML.replace( /(.*<script>)[.\n]*(<\/script>.*)/g, '$1...$2' )
		}
		else if (textIn === true)
			text = '*true*';

		else if (textIn === false)
			text = '*false*';

		else if (typeof textIn == 'object')
			text = EZdisplayObject(textIn);

		else if ( typeof textIn == 'undefined')
			text = '*undefined*'

		else if (options == '--')
			text = textIn.toString().split('--').join('\n')

		else
			text = textIn;

		if (typeof(text) == 'string')
			text = text.replace( /\t/g, '    ' )	//expand tabs
	}
	catch (e)
	{
		text = e;
	}

	// dw.constructor.trace_textarea is textarea object in trace window
	//var value = dw.constructor.trace_textarea.value;
	//if (value == undefined) return;	//something amuck

	// Display at top if heading supplied
	if (heading != '')
	{
		heading = EZtimestamp().substr(11) + ' ' + heading;

		var dashes = '-'.dup(100);
		dashes = dashes.substr(0,heading.length+10)

		text = dashes + '\n' + heading + '\n' + dashes + '\n' + text + '\n';
	}
	/*
	// otherwise put text after last headind
	else if (text != '')
	{
		//           12                3                  4
		//  regex = /((-{10}.*)[\s\S]*?(-{10}.*)[\s\S]*?)?(-{10}|EOF)/;

		//           1         23                4                  5
		var regex = /([\s\S]*?)((-{10}.*)[\s\S]*?(-{10}.*)[\s\S]*?)?(-{10}|EOF)/;

		value = (value+'EOF').replace(regex, function (p0,p1,p2,p3,p4,p5)
		{
			// if heading found at beginning of trace, append text before next heading
			if (!p1)
				return p2 + (text ? '-'+text+'\n' : '') + '\n' + p5;

			// otherwise append text at bottom of trace
			else
				return p1 + '\n' + text;

		});
	}
	*/
	if (!text) return;
	EZlogBuffer(text);
	//dw.constructor.trace_textarea.value = value;
}
if (window.dw) dw.log = EZlog;

/*---------------------------------------------------------------------------------------------
add text to logBuffer or flush if no text specified
---------------------------------------------------------------------------------------------*/
function EZlogBuffer(text)
{
	if (text)
	{
		if (dw.isNotDW) text = '*' + text;
		if (!EZ.logBuffer) EZ.logBuffer = [];
		EZ.logBuffer.unshift(text);
		if (EZ.logBuffer.length < EZgetPref(EZ.pref.logBuffer)) return;
	}
	if (!EZ.logBuffer) return;

	if (!DWfile.exists(EZ.constant.logfile)) EZlogReset();	//create empty file
	var html = DWfile.read(EZ.constant.logfile);
	if (!html) return;		//something amuck

	var begStr = '([\\s\\S]*?<!-- LOG BEG -->\\s*<pre>\\s*)';	//1st LOG BEG
	var endStr = '(</pre>\\s*<!-- LOG END -->[\\s\\S]*)';		//last LOG END
	var regex = new RegExp(begStr + '([\\s\\S]*?)' + endStr);

	var results = html.match(regex);
	if (!results) return;	//something amuck

	var prefix = results[1];
	var value  = results[2];
	var suffix = results[3];

	html = prefix + EZ.logBuffer.join('\n') + value + suffix;
	DWfile.write(EZ.constant.logfile, html);
	EZ.logBuffer = null;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function EZlogHeading(heading,caller)
{
	if (heading.substr(0,1) != '')
	{
		var url = document.URL;
		var pos = url.indexOf('/Configuration')
		if (pos != -1)
		{
			url = url.substr(pos+1);				//up to Configuration
			pos = url.indexOf('/')
			if (pos != -1) url = url.substr(pos+1);	//up to slash after
			pos = url.indexOf('/')
			if (pos != -1) url = url.substr(pos+1);	//after next folder
		}
		var headingMore = heading;
		if (headingMore.substr(0,1) == '-')
			headingMore = headingMore.substr(1);
		heading = url;
		var results = caller.toString().match(/function\s*(\w*)/);
		if (results) heading +=  '::' + results[1] + '(...)';
		heading += ' ' + headingMore
}
	return heading;
}
/*---------------------------------------------------------------------------------------------
Clear Trace Window
---------------------------------------------------------------------------------------------*/
function EZtraceReset()
{
	EZlogReset();
}
/*---------------------------------------------------------------------------------------------
Scrolls highlighted list item into view (usually shown at top of list)
Requires a <div> with position:absolute as first div after <body> tag.
First looks for div id=displayRefresh then dataUndefinedMsg (legacy htm files)
Example:
	<div id="displayRefresh" style="position:absolute;top:-10px;fontSize:2px">...</div>
	(top and fontSize prevent displaying anything or pushing other elements down)
---------------------------------------------------------------------------------------------*/
function EZrefreshDisplay()
{
    var div = document.getElementById('refreshDisplay');
	if (!div) div = document.getElementById('dataUndefinedMsg');
    if (div)
    {
        var state = div.style.visibility;
        var stateChange = (state == 'hidden' ? 'visible' : 'hidden');
        div.style.visibility = stateChange;
        div.style.visibility = state;
    }
}
/*---------------------------------------------------------------------------------------------
Settings for object display
---------------------------------------------------------------------------------------------*/
EZdisplayObject.ITEMS_LIMIT = 50;		//max number of Array items displayed
EZdisplayObject.OBJECT_LIMIT = 50;		//max number of object properties
EZdisplayObject.OBJECT_DEPTH = 5;		//max depth for object display
EZdisplayObject.INDENT_SIZE = 3;		//max depth for object display
EZdisplayObject.MAXLINE = 500;			//max characters displayed for any value
EZdisplayObject.SHOW_PROTOTYPE = false;	//true to display prototype elements
EZdisplayObject.SHOW_TYPE = false;		//true to display non-object data types

EZdisplayObject.HTML_FORMAT = false;
EZdisplayObject.HTML_MAXDEPTH = 3;
EZdisplayObject.HTML_ATTRIBUTES = ['tagName', 'parent'];	//only these show by default
//EZdisplayObject.HTML_PROPERTIES_MAXLINE = ['value', 'innerHTML', 'outerHTML'];
EZdisplayObject.HTML_TEXT_MAXLINE = 25;
EZdisplayObject.HTML_TEXT_NODE = 3;

EZdisplayObject.OBJECT_SPACING = '\n';					//spacing before and after object

EZdisplayObject.MARKER = String.fromCharCode(8226);		//used for null, empty, etc
EZdisplayObject.EOL_MARKER = String.fromCharCode(172);	//used to show end of non-object value
EZdisplayObject.MORE_MARKER = (EZdisplayObject.MARKER + '&nbsp;').dup(3);
EZdisplayObject.DOTS_MARKER = ('&nbsp;.').dup(3);

EZdisplayObject.B_MARKER = EZdisplayObject.MARKER + 'blank' + EZdisplayObject.MARKER
EZdisplayObject.U_MARKER = EZdisplayObject.MARKER + 'undefined' + EZdisplayObject.MARKER
EZdisplayObject.N_MARKER = EZdisplayObject.MARKER + 'null' + EZdisplayObject.MARKER
EZdisplayObject.F_MARKER = EZdisplayObject.MARKER + 'false' + EZdisplayObject.MARKER
EZdisplayObject.T_MARKER = EZdisplayObject.MARKER + 'true' + EZdisplayObject.MARKER
/*---------------------------------------------------------------------------------------------
change defaults
---------------------------------------------------------------------------------------------*/
function EZdisplayObjectSetting(key,value)
{
	EZdisplayObject[key] = value;
}
/*---------------------------------------------------------------------------------------------
wrap msg with markers
---------------------------------------------------------------------------------------------*/
function EZdisplayMarker(msg)	//bracket msg with MARKER
{
	return EZdisplayObject.MARKER + msg + EZdisplayObject.MARKER;
}
/*---------------------------------------------------------------------------------------------
display onClick handler -- currently supports repested object links
---------------------------------------------------------------------------------------------*/
function EZdisplayClick(evt)
{
	evt = evt || window.event;
	var el = evt.srcElement;
	switch (el.tagName) 
	{
		case 'SPAN':	//assume repeated link clicked
		{
			//if ('expanded collapsed'.indexOf('.previousElementSibling.className'.ov(el,'-')) != -1)
			//	el = el.previousElementSibling;
			
			//----- Toggle expanded collapsed
			if ('expanded collapsed'.indexOf('.className'.ov(el,'-')) != -1)
			{
				el.className = el.className.replace(/(collapsed|expanded)/, function(all,mode)
				{
					if (mode == 'expanded')	//if collasping, let transition complete
					{
						function collapseDone() 
						{
							el.className = el.className.replace(/collapsing/, 'collapsed');
						}
						if (!['webkitTransitionEnd', 'transitionend'].some(function(fn)
						{	//nothing found for chrome
							if (el.style[fn] == undefined) return false;	//continue somme loop;
							el.style.EZtransitionEnd = fn;
							el.addEventListener(fn, collapseDone, false);
							return true;
						}))
						/*
						*/
						{
							el.style.EZtransitionEnd = setTimeout(collapseDone, 1000);
						}
					}
					// change class -- start transition
					return {collapsed:'expanded', expanded:'collapsing'}[mode];
				});
				
			}
			break;
		}
		case 'A':		//assume repeated link clicked
		{
			var addClass = (el.className.indexOf('highlight') == -1)
			var tags = EZ(['highlight'],el.parentNode)
			
			EZremoveClass(tags, 'highlight');	//clear all curently highlights
			
			var parts = el.href.matchPlus(/#(.*_)(\d*)/)
			var hashTime = parts[1];
			var seqno = parts[2];				//get seqno of 1st instancs of object

			tags = [el];
			while (seqno && (el = EZ('EZ_' + hashTime + seqno, null)))
			{
				tags.push(el);
				seqno = '.className'.ov(el,'').matchPlus(/EZ_(\d*)/i)[1];
			}
			EZaddClass(tags, 'highlight', addClass);
			return EZ.event.cancel(evt,true);	//cancel bubble and default browser action
		}
		break;
	}
	return true;
}
/*---------------------------------------------------------------------------------------------
Display all object values and expand embeddeded Object to OBJECT_DEPTH

Can also be used to return display value for other types (i.e. boolean, number or string) OR
	*undefined*, *empty*, *null*, *true*, *false*

TODO: typeof undefined is not displayed properly
	  html elemente have el.contructor == Element is true
---------------------------------------------------------------------------------------------*/
function EZdisplayObject(obj,name,opts/* legacy: indent=opts */)
{
	try
	{
		//---------------------------------------------------------------------------------
		// Initialize options via EZdisplatOptions()
		//---------------------------------------------------------------------------------
		var indent = 0;
		if (typeof name == 'object')
		{
			opts = name;
			name = '';
		}
		else if (typeof opts != 'object')
		{
			indent = opts;	//legacy indent argument
			opts = '{indent: opts}';
		}
		opts = new EZdisplatOptions(opts); 
		
		//---------------------------------------------------------------------------------
		// call EZformatObjectProcess() for heavy lifting
		//---------------------------------------------------------------------------------
		var depth = opts.depth;
		EZformatObjectProcess(obj, name, opts, {depth:opts.depth});
		appendCollapse(depth);
		
	
		// get formatted text cleanup blank lines
		var text = '.formattedText'.ov(opts).trim();
		var blanklines = text.matchPlus(/^\s*$/mg).length;
		if (blanklines == 1)
			text = text.replace(/\n/, '');	//if only one blank line, remove it
		if (text)
			text += '\n';					//if any text, append newline to end

		//------------------------------------------------------------------------------------
		// For 1st occurance of each repeated Object, append repeat count to displayed values.
		// ...if htmlformat, prepend anchor and wrap Object heading with span.
		//------------------------------------------------------------------------------------
		opts.repeatCount = 0;
		for (var o in opts.processedObjects)
		{
			var processedObj = opts.processedObjects[o];
			if (processedObj.count == 0)	
				continue;				//skip if processed and formatted but not repeated

			opts.repeatCount++;
			var parentSeqno = opts.parentSeqno[processedObj.seqno]
			var id = 'EZ_'+ opts.hashTime + '_' + processedObj.seqno;
			var className = 'repeat EZ_' + parentSeqno;
			
			var seqnoDebug = opts.showseqno ? opts.objectDepth[processedObj.seqno] + ')   #' + processedObj.seqno + '# ' : '';
			var parentSeqnoDebug = opts.showseqno ? ' [' + parentSeqno + ']' : '';

			// remove #id# marker at start of repeated Object and append repeat count
			var repl = '$2 repeated x' + processedObj.count + parentSeqnoDebug;

			if (!opts.htmlformat)		//if not using html just prepend leading spaces
				repl = '$1' + repl;
			else						//otherwise add anchor, spaces & wrap text in span
			{
				repl = '<a name="' + id + '"></a>'
					 + '$1<span id="' + id + '" class="' + className +'">'
					 + seqnoDebug + repl + '</span>';
			}
			var regex = new RegExp('#' + processedObj.seqno + '#' + '(\\s*)(.*)$', 'm');
			text = text.replace(regex, repl);
		}
		//----------------------------------------------------------------------------------
		// Remove #id# markers from all remaining objects headings.
		// if using html format, wrap Object heading with span to allow styling.
		//----------------------------------------------------------------------------------
		text = text.replace(/#(.*?)#(\s*)(.*)$/gm, function(all, seqno, space, heading)
		{
			if (all.indexOf('<span') != -1) 
				return all;		//already processed
			
			var useSpan = false;
			if (opts.htmlformat && opts.parentSeqno.indexOf(seqno) != -1)
			{
				useSpan = true;
				id = 'EZ_'+ opts.hashTime + '_' + seqno;
				parentSeqno = opts.parentSeqno[seqno];
				className = 'EZ_' + opts.parentSeqno[seqno];
			}
			else
			 useSpan = false; 

			seqnoDebug = opts.showseqno ? opts.objectDepth[seqno] + ')    #' + seqno + '#' : '';
			parentSeqnoDebug = opts.showseqno && parentSeqno ? ' [' + parentSeqno + ']' : '';
			
			return !useSpan 
				 ? space + seqnoDebug + heading		//no span needed
				 : space + '<span id="' + id + '" class="' + className +'">'
				 + seqnoDebug + heading + parentSeqnoDebug + '</span>';
		});

		text = formatCollapse(text);
		//---------------------------------------------------------------------
		// if using html,
		//---------------------------------------------------------------------
		if (!opts.collapse_nocleanup)
		{
			text.replace(/\s*?\n*\S/, '')	//remove leading newlines
			text = text.trimRight();		//remove all trailing whitespace
		}		
		if (opts.timestamp)
			text = opts.formattedTime + ' -- ' + text;
		
		if (text)
		{
			if (!opts.htmlformat)	//single trailing newline if not html format
				text += '\n';		
			else					//otherwise wrap with div
			{					
				text = '<pre class="EZdisplayObject"'
					 + (opts.repeatCount || 'expanded collapsed'.indexOf(text) != -1
					 ? ' onclick="EZdisplayClick()"' : '')
					 + '>\n' + text + '</pre>';
			}
		}
	}
	//____________________________________________________________________________________
	catch (e)
	{
		text = '.formattedText'.ov(opts).trim();
		if (!text)
			text = '...no formatted text...';
		
		else if (!'.showseqno'.ov(opts))
			text = text.replace(/^#\d*?#/gm, '');

		text += '\nException formatting: '+ '.dotName'.ov(opts) + '\n' 
			  + (e.message+'').replace(/:/g, ':\n');
		
		if (e.stack && window.EZformatStack)
		{
			var stackTrace = EZformatStack(e.stack);
			text += '\n' + stackTrace.join('\n');
		}
	}
	return text;
	//____________________________________________________________________________________
	/*
	*/
	function appendText(text)
	{
		if (!text) return;
		EZdisplayObject.display += text;
		opts.formattedText += text;
		if (!text.trim()) 
			return;
		
		var log = '_'.dup(50) + opts.dotName + '\n' + opts.formattedText.trim() + '\n' + '='.dup(70);
		console.clear();
		console.log(log);
		return EZdisplayObject.display;
	}
	//____________________________________________________________________________________
	/*
	*/
	function appendCollapse(depth, spaces)
	{
		var start = spaces != undefined;
		spaces = spaces || '';
		if (!opts.collapse)	return appendText(spaces);
		
		if (depth > opts.depth)
		{
			opts.depth = depth;
			appendText('____' + opts.depth + '@ ' + spaces.substr(3));
			return;
		}
		// start object heading but marker not required
		if (start && depth == opts.depth)
			return appendText('***' + spaces);
		/*
		else if (start && depth > opts.depth)
			return appendText('___' + spaces);
			//return appendText('___' + spaces);
		*/
		
		var minEnd = start ? 0 : 0;
		while (depth <= (opts.depth-minEnd))
		{
			appendText(opts.depth-- + '____@\n')
		}
		return appendText(spaces);
	}
	//____________________________________________________________________________________
	/**
	 *	format collapse markers as html for event handler
		formatCollapseRemoveSame();
	 */
	function formatCollapse(text)
	{
		/*
		*/ 
		if (opts.collapse_show_markers) return text;
		console.clear(); console.log('text: . . .\n' + text.substr(0,666) + ' . . .');
		text = text.trim();

		//---------------------------------------------------------------------------------
		//----- convert collapse markers to html
		//---------------------------------------------------------------------------------
		var regex = /____(\d+)@ (<.*?<\/span>)?(\s*)(.*)(\n*)([\s\S]*?)(\1____@)/m;
		var regexGroups = 'level, heading, spaces, detail, blanklines, moredetail,';
		
		while (regex.test(text))
		{						//iterates on single pattern match till none found
			text = text.replace(regex, 
			function(all,level,tags,spaces,heading,blanklines,detail)
			{
				level = (level || 0).toInt();
				
				var t = text.substr(0,555) + ' . . .'; 			
				console.clear(); console.log(all.substr(0,666) + ' . . .');
				 
				if (!tags)		//if heading plain text, wrap in span
					heading = '<span>' + heading + '</span>';
				
				else			//if heading inside span (repeated), tweak 
				{				
					detail = heading + spaces + detail;
					if (level == 0)
					{
						/*
						1 level: 0\n
						2 tags: <span class="top" id="EZ_24658369_0">(HTMLDivElement): </span>\n
						3 spaces: \n \n
						4 heading: tagName: DIV\n\n
						5 blanklines: \n \n
						6 detail: 
						parent: <form action="" method="p...\n
						id: EZtest_wrap\n\n
						____1@ style (CSSStyleDeclaration):\n
						*all values blank*\n
						1____@\n
						____1@ <a name="EZ_24658369_2"></a> <span id="EZ_24658369_2" 
						class="repeat EZ_undefined">childNodes (NodeList) [length:7]: repeated x3</span>\n
						  . . .
						
						1 level: 0\n
						2 tags: <span class="top" id="EZ_26980756_0">(HTMLCollection): </span>\n
						3 spaces: \n \n
						4 heading: ____1@ [0] (HTMLLabelElement)\n
						5 blanklines: \n \n
						6 detail:
						tagName: LABEL\n\n
						parent: <eztest_tag id="EZtest_ta...\n
						id: test_id1\n\n
						class: idandclass\n\n
						____2@ style (CSSStyleDeclaration):\n
						*all values blank*\n
						2____@\n
						  . . .
						*/
						if (detail.trim().indexOf(heading.trim()) != 0)
							detail = spaces + heading + spaces + detail
					}
					else
					{
						if (spaces.right(1) == '\n')
						{										//if spaces ends with newline, it belongs to detail
							/*
							0: ____1@ style (CSSStyleDeclaration):\n *all values blank*\n 1____@\n
							1 level: 1\n
							2 tags: *undefined*
							3 spaces: \n
							4 heading: style (CSSStyleDeclaration):\n
							5 blanklines: \n \n
							6 detail: *all values blank*\n \n
							7: 1____@\n
							*/						
							spaces = spaces.replace(/\s*\n/,'');	//remove leading spaces up to and including newlinw
							detail = spaces + detail;
							spaces = '';
						}
						else
						{
							/*
							1 level: 1\n
							2 tags: <a name="EZ_28173726_2"></a> <span id="EZ_28173726_2" class="repeat EZ_undefined">childNodes (NodeList) [length:7]: repeated x3</span>\n
							3 spaces: \n \n
							4 heading: ____2@ [0] (Text) *blank*\n
							5 blanklines: \n \n
							6 detail:2____@\n
									 ____2@ [1] (HTMLLabelElement)\n
									 tagName: LABEL\n\n
									 parent: <div id="EZtest_wrap">\n\n
									 id: EZtest_input\n\n
									 ____3@ style (CSSStyleDeclaration):\n
									 *all values blank*\n
									 3____@\n
							*/							
							while (spaces.substr(0,1) == '\n') 	//clip spaces newline prefix
								spaces = spaces.substr(1);	
						}
						if (tags.indexOf('<a') != -1) 			//remove spaces between <a...> and <span...>
						{
							spaces = ' '; //spaces.clip();
							tags = tags.replace(/> <span/, '><span');
						}
					}
					heading  = tags;

				}
				var html = '';
				if (detail.indexOf('\n') == 0 && level > 0 && !opts.collapse_keep_groups)
				{							// if no detail lines, just keep indented heading if one	
					if (heading.trim())
						html = spaces + '   ' + heading + '\n';	
				}
				else						
				{	
					var className = 'expanded'				//cannot check line counts	
								  + (level == 0 ? ' all'
								  : heading.indexOf('[') == -1 ? ' obj' : '')
								  + ' level_' + level;
						
					// wrap heading with collaspe arrow span -- wrap detail in div
					html = spaces + '<span class="' + className + '">' 
						 + (opts.collapse_show_depth ? level : ' ')
						 + '  ' 
						 + heading + '\n</span><div>' + detail.trimRight() 
						 + '</div><!-- level_' + level + ' -->';  		
				}
				console.clear(); console.log(html.substr(0,1200) + ' . . .');
				return html;
			});
		}
		//---------------------------------------------------------------------------------
		//----- remove empty or short groups -- auto collapse if maxlines reached
		//---------------------------------------------------------------------------------
		var regexGroup = /(\s)(<span[^>]*?level_(\d*).>...[\s\S]*?(<div>))([\s\S]*?)(<\/div>)(<!-- level_\3 -->)/
		var regexGroupLabels = 'indent,collapseBegToDiv,level,OpenDiv,detail,closeDiv,collaspeEnd';
		var collapseCount = (text+'\n').match(/<span[\s\S]*?level_(\d*).>/g).length-1;	//recursion safety
		
		if (!opts.collapse_keep_groups) text = collapsePrune(text,0)
		//____________________________________________________________________________________
		/**
		 *	traverse collapse groups tree, delete groups with lines <= opts.collaspe.minlines
		 *	TODO: auto collapse groups with lines >= opts.collaspe.maxlines
		 */
		function collapsePrune(text,level)
		{
			var ourGroup = text.matchPlus(regexGroup, regexGroupLabels);
			var detail = ourGroup.detail || text || '';
			var updatedDetail = '';
			while (true)				//for all collapse groups in ourGroup detail . . .
			{					
				var nextGroup = detail.matchPlus(regexGroup, regexGroupLabels);
				if (!nextGroup.isFound) break;
										
				level = nextGroup.level 
				updatedDetail += detail.substr(0, nextGroup.index);	//detail upto collapsed group found
				detail = detail.substr(nextGroup.lastIndexOf);		//remove all text for found group
				
				var groupText = nextGroup.detail.indexOf('\n') == -1
							  ? nextGroup.detail
							  : collapsePrune(nextGroup.detail);	//eval group
				updatedDetail += groupText; 						//append updated group text
			
				if (--collapseCount < 0)
					break;;
			}
			updatedDetail += detail; 	//detail after last group
						
			// after all inner collapse groups updated, count lines in this group
			var lineCount = (updatedDetail+'\n').match(/\n/g).length - 1;
			if (lineCount < opts.collapseminlines)
			{
				if (level == 0)			//for level 0 add na class
					ourGroup.collapseBegToDiv = ourGroup.collapseBegToDiv.replace(/\ball\b/, 'all na');
				else
				{														//remove outer arrow span
					var heading = ourGroup.collapseBegToDiv.replace(/<span[^>*]...([\s\S]*)<\/span>/, '$1');
					heading = heading.replace(/<span>()[\s\S]/, '$1');	//remove heading wrapper if added
					return ourGroup.indent + '   ' + heading + updatedDetail;
				}
			}
			if (lineCount > opts.collapsemaxlines)
				ourGroup.collapseBegToDiv = ourGroup.collapseBegToDiv.replace(/\bexpanded\b/, 'collapsed');
			
			return ourGroup.indent + ourGroup.collapseBegToDiv + updatedDetail + ourGroup.closeDiv;
		}
		
		//---------------------------------------------------------------------------------
		//----- TODO: ?? remove duplicate redundant collapse html -- re-eval expanded
		//---------------------------------------------------------------------------------
		
		
	
		//---------------------------------------------------------------------------------
		//----- cleanup blank linee
		//---------------------------------------------------------------------------------
		if (!opts.collapse_nocleanup)
		{
			text = text.replace(/^\s*\n/gm, '');
			text = text.replace(/<(\/)?div>\s*\n(\s*)/gm, '\n<$1div>$2');
			text = text.replace(/<(\/)?div>\s*\n(\s*)/gm, '\n<$1div>$2');
			text = text.replace(/\n\s*((<\/div>)*)\n/g, '$1');
			
			text = text.replace(/____0@/gm, '');
		}
		console.clear(); console.log(text);
		
		//==================
		return text; 
		//==================
	}
	//________________________________________________________________________________________
	/**
	 *	Init persistant display options shared at all recursion levels
	 */
	function EZdisplatOptions(opts)	
	{	
		opts = opts || {};
		
		//-----	set overrideable options to specified value or defaults 
		this.depth		= '.indent .depth'.ov(opts, 0).toInt();	
		this.indentsize = '.indentsize'.ov(opts, EZdisplayObject.INDENT_SIZE);
		
		this.maxline 	= '.maxline'.ov(opts)	|| EZgetPref(EZ.pref.displayMaxString, EZdisplayObject.MAXLINE);
		this.maxdepth 	= '.maxdepth'.ov(opts)	|| EZgetPref(EZ.pref.displayMaxDepth, EZdisplayObject.OBJECT_DEPTH);
		this.maxobjects = '.maxobjects'.ov(opts)	|| EZgetPref(EZ.pref.displayMaxObjects, EZdisplayObject.OBJECT_LIMIT);
		this.maxitems	= '.maxitems'.ov(opts)	|| EZgetPref(EZ.pref.displayMaxItems, EZdisplayObject.ITEMS_LIMIT);
		this.maxprompt	= '.maxprompt'.ov(opts, false);
		
		this.timestamp 	= '.timestamp'.ov(opts, true);
		this.htmldepth 	= '.htmldepth'.ov(opts, EZdisplayObject.HTML_DEPTH);
		this.htmlformat = '.htmlformat'.ov(opts, EZdisplayObject.HTML_FORMAT);
		
		this.showseqno 		= '.showseqno'.ov(opts, false);
		this.showtype 		= '.showtype'.ov(opts, EZdisplayObject.SHOW_TYPE);		
		this.showprototype 	= '.showprototype'.ov(opts, EZdisplayObject.SHOW_PROTOTYPE);		
		
		this.collapse	      = '.collapse'.ov(opts, false);
		this.collapsedepth	  = '.collapsedepth'.ov(opts, 3).toInt();
		this.collapseminlines = '.collapseminlines'.ov(opts, 5).toInt();
		this.collapsemaxlines = '.collapsemaxlines'.ov(opts, 10).toInt();
		
		// debug options
		this.collapse_show_depth  	= '.collapse_show_depth'.ov(opts, false);
		this.collapse_show_markers	= '.collapse_show_markers'.ov(opts, false);
		this.collapse_keep_groups 	= '.collapse_keep_groups'.ov(opts, false);
		this.collapse_nocleanup 	= '.collapse_nocleanup'.ov(opts, false);
		
		//----- internal usage mostly associated with recursion
		//		other variables set below on each call
		this.formattedText = '';
		
		var now = new Date().getTime();
		var today = new Date(EZformatdate(now).substr(0,10).replace(/-/g, '/')).getTime();
		
		this.formattedTime = EZformatdate(now,'time')
		this.hashTime = parseInt((now-today));	//now in minutes
		this.dotName = name;						
		this.objectCount = 0;
		this.lastTypeObject = false;
		this.first = true;
		this.firstObject = true;
		
		this.indentSpaces = '   ';
		
		this.processedObjects = {};
		this.parentSeqno = [];
		this.objectChildNodes = [];
		this.objectDepth = [];
		this.objectSeqno = 0;
		this.htmlBreak = []
		this.quit = false;
	}
	/*********************************************************************************************
	 *	WORK-HORSE: first called with toplevel Object or any other data type then recursively for
	 *	each property with typeof object or function and each Array item.
	 *
	 *	Objects are only formatted once. Duplicate or recursive references will show "...repeat..."
	 *	as value the Object -- the properties are not enumerated or reprocessed.
	 *
	 *	For html elements, all properties not not formatted as explained below:
	 *		1.	only properties specified or from html property list are formatted
	 *		2.	all non-blank attributes from the attributes property
	 *		3.	text nodes show text length and the 1st few char with whitespace compressed
	 *		
	 *
	 *	ARGUMENTS:
	 *	obj		toplevel Object, then embedded property or Array item to format recursivey
	 *	name	optional toplevel Object name then embedded property name or Array item index
	 *	opts	innitial options and global variables shared between recursion levels
	 *	depth	zero based recurrsion depth
	 *	isArray	true while formatting Array items
	 *	dotName	concatenated object/property name starting with name or type of toplevel object
	 *
	 *	RETURNS:
	 *		nothing	-- "opts.displayText" contains formatted text from all recursive calls.
	 *

		// local objects passed to recursive calls but not changed for caller
		var  depth =  '.depth'.ov(local, 0)
		var  dotName =  '.dotName'.ov(local, '')
		var  isArray =  '.isArray'.ov(local, false)
		var  formatOpts =  '.formatOpts'.ov(local, ','))
		var  objectSeqno =  '.objectSeqno'.ov(local, 0)
		var  parentSeqno =  '.parentSeqno'.ov(local, 0)


		var depth = depthOpts.shift() || 0;
		var dotName = depthOpts.shift() || '';
		var isArray = depthOpts.shift() || false;
		var formatOpts = EZ.toArray(depthOpts.shift(), ',');
		var objectSeqno = depthOpts.shift() || 0;
		var parentSeqno = depthOpts.shift() || 0;
	 
		
	 ********************************************************************************************/
	function EZformatObjectProcess(obj, name, opts, local)
	{
		//----- Determine data type and other properties used for displaying
		var i, e, html, idx, key, note, value, results;

		//NOTE: use opts object for global data updated at all recurrsion level
		//		use local for data passed to down to recursive calls but not changed or returned

		var formatOpts = '.formatOpts'.ov(local, [])
		formatOpts = EZ.toArray(formatOpts, ',');
		
		//----- Make copy of local data
		var local = {									
			depth: '.depth'.ov(local, 0),
			dotName: '.dotName'.ov(local, ''),
			isArray: '.isArray'.ov(local, false),
			formatOpts: formatOpts
		}
		
		// local legacy variables previously passed as arguments
		var depth = local.depth;
		var isArray = local.isArray;
		
		//---------------------------------------------------------------------------
		//***** If Not object -- addend formatted value and bail -- depth==0 ?? *****
		//------------------------------------------------------------
		if ('object function'.indexOf(typeof obj) == -1 || (depth==0 && obj == null))
		{
			if (depth != 0) debugger;
			html = getValue(obj);
			if (opts.htmlformat && depth == 0)
				html = '<span class="top" id="EZ_' + opts.hashTime + '_0">' 
					  + html + '</span>\n';
			return appendText(html);
		}
		
		var spaces = EZ.constant.spaces.substring(0, depth*opts.indentsize);
		var spacesPlus = spaces + EZ.constant.spaces.substring(0,opts.indentsize);
		var spacesPlusPlus = spacesPlus + EZ.constant.spaces.substring(0,opts.indentsize);
		
		var isDone = false;
		var isHTML = false;
		var isEmpty = true;
		var type = obj ? EZ.getFunctionParts(obj.constructor)[1] : '';
		var processedObj = '';
		
		var isArrayElement = (isArray && !isNaN(name))	//if recursive call 
		isArray = local.isArray = false;
		if (EZ.isArrayLike(obj))
		{
			isArray = local.isArray = true;
			type = type || (EZ.isArray(obj) ? type + ' array' : 'arraylike object');
		}
		else if (obj && obj.constructor == Function)
			type = (type + ' function').trim();
		
		else if (obj.childNodes != undefined)
		{
			isHTML = true;
			type = type || 'html element';
		}
		type = type.trim();

		//------------------------------------------------------------
		//----- headings for top level Array, Object ot html element
		//------------------------------------------------------------
		if (depth == 0)		
		{
opts.depth = -1;
appendCollapse(depth, '');
			
			local.dotName = name;
			var heading = name;
			if (!name || typeof name == 'object') 
			{
				name = '';
				local.dotName = type;
			}
			note = type == 'Array' ? ' [length: ' + obj.length + ']' : ''
			heading += '(' + type + ')' + note + ': ';
			
			if (opts.htmlformat)
				appendText('<span class="top" id="EZ_' + opts.hashTime + '_0">' 
						  + heading + '</span>\n');
			else
				appendText(heading + '\n');
			appendText('\n');
		}
		//--------------------------------------------------------------------
		//----- depth > 0: headings for embedded Array, Array item, Object ot html element
		//--------------------------------------------------------------------
		else
		{
			if (depth <= 1 && !opts.collapse) appendText('\n');
			
			appendCollapse(depth, spaces.substr(1));
			
			appendText('#' + (++opts.objectSeqno) + '#');
			opts.objectDepth[opts.objectSeqno] = depth;
			
			while (true)
			{
				//----- for Array items . . .
				if (isArrayElement)
				{
					local.dotName = local.dotName + '[' + name + ']';
					
					note = '';		
					if (isHTML)
					{							//if text or similar node, bail after heading	
						if ('.nodeType'.ov(obj) == EZdisplayObject.HTML_TEXT_NODE)
						{						//if text node show text and length
							isDone = true;
							var text = '.textContent'.ov(obj);
							text = !text ? '' : text.replace(/\s+/g, ' ').trim();
							note = !text ? ' ' + EZdisplayObject.B_MARKER
								 : ':' + 
								 (
									 text.length < EZdisplayObject.HTML_TEXT_MAXLINE
									 ? text 
									 : text.substr(0,EZdisplayObject.HTML_TEXT_MAXLINE) 
									 + EZdisplayObject.MORE_MARKER
								 )
								 + '[' + text.length + ']';
						}
						else if (!obj.attributes)
							isDone = true;
				
					}
					appendText('[' + name + ']' 
							  + (type ? ' (' + type + ')' :'') 
							  + note + '\n');
					break;
				}
				//----- for non-Array items . . .
				appendText(' ');
				name = EZstripConfigPath(name);
				local.dotName = local.dotName + '.' + name;

				note = (isArray) ? ' [length:' + obj.length + ']' : ''; 
				appendText(name + ' (' + type + ')' + note + ':\n');
				if (isDone) break;
				
				//----- check if maxobject depth reached
				if (depth >= opts.maxdepth) 
				{
					appendText(spacesPlusPlus + EZdisplayObject.MORE_MARKER);
					appendText('> maxdepth [' + opts.maxdepth + ']\n');
					isDone = true;
					break;
				}
				
				//----- check if called to process unique object
				if (obj.constructor != document.body.style.constructor)
				{
					processedObj = opts.processedObjects[obj];
					if (processedObj)
					{
						//========== object already processed ==========\\
						processedObj.count++;
						note = spacesPlus + '...repeat of:<a href="#' 
							 + opts.hashTime + '_' + processedObj.seqno + '">' 
							 + processedObj.name + '</a>'
							 + (opts.showseqno ? ' [' + processedObj.seqno + ']' : '')
							 + '\n';
						appendText(note);
						isDone = true;
						break;
						//===============================================//
					}
					else
					//============ 1st time object processed ============\\
					opts.processedObjects[obj] = {
						name: local.dotName, 
						seqno: opts.objectSeqno, 
						parentSeqno: parentSeqno,
						count: 0
					};
					opts.objectChildNodes[opts.objectSeqno] = parentSeqno
					opts.parentSeqno[opts.objectSeqno] = parentSeqno
					//===================================================//
				}
				break;
			}
		}
		opts.first = false;
		opts.dotName = local.dotName;		//save for exception reporting		
		if (isDone)
			 return appendCollapse(depth);
//		else if (depth > 0)
//			appendCollapse(depth)
		
		if (opts.quit) 				//safety for unexpected
			return '...quit ' + local.dotName + '...\n';	
		
		//-----------------------------------------------------------------------
		// For each Array item, Object property, html attribute or childNode. . .
		//------------------------------------------------------------------------
		while (true)
		{
			//=============\\
			// HTML elements\\
			//===============\\
			if (isHTML)
			{	
				EZdisplayObject.HTML_ATTRIBUTES.some(function(attr)
				{
					//var format = EZdisplayObject.HTML_ATTRIBUTES_MAXLINE.indexOf(key) == -1 ? ''
					//		   : 'maxlength:' + EZdisplayObject.HTML_TEXT_MAXLINE;
					if (attr != 'parent')
						formatItem(attr);	//, format);
					else
					{
						value = '.parentNode.outerHTML'.ov(obj, '');
						value = value.matchPlus(/(<.*?>)/)[1];
						if (value)
						{
							if (value.length > EZdisplayObject.HTML_TEXT_MAXLINE)
								value = value.substr(0,EZdisplayObject.HTML_TEXT_MAXLINE) + '...';
							value = displayEncode(value);
							formatItem(attr, 'value', value);
						}
					}
					if (opts.quit) return true;
				});
				if (opts.quit) break;
				
				for (var attr=0; attr<obj.attributes.length; attr++)
				{
					formatItem(obj.attributes[attr].name, 'attr');
					if (opts.quit) break;
				}
				if (obj.style)
					formatItem('style', 'ignoreBlank');
				
				if ('.childNodes.length'.ov(obj))
					formatItem('childNodes');
				
				isEmpty = false;
				break;;
			}
			
			//============\\
			// Array items \\
			//==============\\
			if (isArray)
			{
				for (var idx=0; (idx<obj.length && idx<opts.maxitems); idx++)
				{
					formatItem(idx);
					if (opts.quit) break;
				}
				if (obj.length > opts.maxitems)
					appendText( spacesPlusPlus + EZdisplayObject.MORE_MARKER
							  + (obj.length - opts.maxitems) + ' more array item(s)\n');
			}
			if (opts.quit) break;
			
			//==================\\
			// Object properties \\
			//====================\\
			for (var key in obj)
			{
				if (!obj.hasOwnProperty || !obj.hasOwnProperty(key)) continue;
				if (isArray						//skip Array properties for Arrays
				&& (key == 'length' || (!isNaN(key) && key < obj.length))) continue;
				
				formatItem(key, 'object');	//process property
				
				if (opts.quit) break;
			}
			break;
		}
		//____________________________________________________________________________________
		/**
		 *	formatItem() -- called for each Array item, Object porperty or html attributes
		 *	If item obj[key] if Array or Object, formatObject is recurusively called.
		 *			
		 *	ARGUMENTS:
		 *		key		Array index, Object property or html attribute -- designated by format
		 *			
		 *		format 	(string) 'attr' html attribute -- SEE switch below for current fotmats
		 *				(string) 'ignoreBlank' html element style properties
		 */
		function formatItem(key, format, value)
		{
			format = formatOpts.concat(EZ.toArray(format, ','));
			
			// process OBJECT properties typeof object or function -- except null 
			// (excluding: html el attribute -- including childnodes and styles)
			if (obj[key] != null
			&& !/(attr|value)/.test(format)
			&& 'object function'.indexOf(typeof obj[key]) != -1)
			{
				if (overLimit()) return false;
				
				//if (typeof(key) == 'function' && skipPrototype(key,Function)) return;
				if (typeof(obj[key]) == 'function')
				{												//simple formatting by getValue()
					if (obj[key].constructor == RegExp) return;
				}
				
				//***********************************************************************************
				//===================================================================================
				EZformatObjectProcess(obj[key], key, opts, 
					
					EZ.merge([], local, {depth: depth+1, formatOpts: format
								 /* isArray: local.isArray && format.indexOf('object') != -1 */
				}));
				//===================================================================================
				//***********************************************************************************
				
				opts.firstObject = false;
				opts.lastTypeObject = true;
				isEmpty = false;
			}
			// process NON-OBJECT element within obj
			else
			{
				if (!format.length) format = [''];	//force one pass thru forEachFormatOption()
				if (format.some(function forEachFormatOption(fmt)
				{
					switch(fmt)
					{
						case 'attr': 	
						{
							value = obj.getAttribute(key) ;
							break;
						}
						default:
						{
							//if (skipPrototype(key)) return;			//if not displaying prototype variables
							if (isArray && isArrayElement && !isHTML) 
								appendText(spaces);					// extra indentation for array objects
							value = obj[key];
						}
						case 'ignoreBlank': 	
						{
							if (!value && value !== 0) return true; 
							break;
						}
						case 'value':
							value = value;					//debugger placeholder
					}
				}))
				{
					return false;	// '  ' + EZdisplayMarker('all values blank');		
				}
				value = getValue(value, format) 				//determine non-object value
				
				if (isArray && !isArrayElement)
					key = spacesPlus.substr(1) + '[' + key + ']'
				else
					key = spacesPlus + key
																//apply indent to all lines
				value = (value + '').replace(/\n/gm,'\n'+spacesPlusPlus);
				
				//-----------------------------------------------------------------------------
				appendText(key + ': ' + value + '\n');
				//-----------------------------------------------------------------------------

				opts.lastTypeObject = false;
				isEmpty = false;
			}
		}

		//-----------------------------------------------------------------------------
		//Done iterating at current level if nothing displayed, indicate why
		//-----------------------------------------------------------------------------
		if (isEmpty)							//empty object (must test after function test above)
		{
			note = formatOpts.indexOf('ignoreBlank') != -1 
				 ? 'all values blank' 
				 : 'no elements';
			appendText(spacesPlus + EZdisplayMarker(note) + '\n');
		}
		else 
		{
			// extra indentation for array objects
			if (isArray) appendText(spaces);

			// special values: null, function, empty
			if (obj === null)							//null object
				appendText(spacesPlus + EZdisplayObject.MARKER + 'null' + EZdisplayObject.MARKER + '\n');

			else if (obj.constructor == Function)		//function (just show name and paramters)
			{
				results = obj.toString().match(/function\s*(\w*)\s*\(([^\)]*)\)/);
				if (results)
					appendText(spacesPlus + results[0] + '...\n');
				else									//name not found (should not get here)
					appendText(spacesPlus  + EZdisplayObject.MARKER+ 'unknown function' + EZdisplayObject.MARKER);
				opts.lastTypeObject = false;
			}
		}
		//===================
		return appendCollapse(depth);
		//===================
		// remove last newline (it gets added by caller)
		//EZdisplayObject.display = EZdisplayObject.display.substring(0,EZdisplayObject.display.length-1);
		//____________________________________________________________________________________
		/*
		*	Return true if not displaying any more nested objects.
		*/
		function overLimit()
		{
			if (opts.objectCount++ < opts.maxobjects) return false;
			
			var msg = opts.maxobjects + ' objects displayed';
			if (opts.maxprompt)
			{
				if (confirm(msg + '\n\nDisplay more?'))
				{
					opts.objectCount = 0;
					return false;
				}
			}
			appendText(spacesPlus + EZdisplayObject.MORE_MARKER + msg + '\n');
			opts.quit = true;
			return true;
		}
		//____________________________________________________________________________________
		/*
		*	Return true if not displaying prototype functions or variables.
		*	type (optional: Function if checking for Function constructor
		*/
		function skipPrototype(el,type)
		{
			var status = false;

			//js error from EZupdateFieldList trace after EZclearlist(...)
			if (!opts.showprototype
			&& obj && el && obj[el]
			&& obj[el].constructor
			&& obj[el].constructor.prototype)
			{
				if (type && type == Function
				&& obj[el].constructor.prototype.constructor == type)
					status = true;

				//else if (!type && obj[el].constructor.prototype == el)
				else if (!type
				&& (obj.constructor != Array || isNaN(el))	//added so array[0] displays
				&& obj[el].constructor.prototype == el)
					status = true;
			}
			return status;
		}
		//____________________________________________________________________________________
		/*
		*	determine non-object value
		*/
		function getValue(value, format)
		{
			var maxline = '.maxline'.ov(format, opts.maxline);
			
			var type = typeof(value);
			if (type === 'undefined')
				value = EZdisplayObject.U_MARKER;

			else if (value === '')
				value = EZdisplayObject.B_MARKER;

			else if (value === null)
				value = EZdisplayObject.N_MARKER;

			else if (value === true)
				value = EZdisplayObject.T_MARKER;

			else if (value === false)
				value = EZdisplayObject.F_MARKER;
			
			else if (type != 'string')
				value += EZdisplayObject.EOL_MARKER;
			
			else if (value.indexOf(EZdisplayObject.MORE_MARKER) == -1)
			{							//". . . [23]"
				value = EZstripConfigPath(value);
				if (value.length > (opts.maxline + 10))
				{
					value = getValueString(value.substr(0,maxline)) 
						  + EZdisplayObject.MORE_MARKER
						  + '  [' + value.length + ']';
				}
				else
				{
					value = getValueString(value,format)
						  + (!opts.showstrlength ? ''
						  : '  [' + value.length + ']');
				}
			}
			//----- if legacy type
			if (opts.showtype && !isHTML)
				value = '(' + type + '): ' + value
					  + (typeof(value) == 'string' 
					    && value.indexOf(EZdisplayObject.MORE_MARKER) == -1 ? ''
					  : EZdisplayObject.EOL_MARKER);
			
			return value;
				
		}
		//____________________________________________________________________________________
		/*
		*	display string as: "...", '...' or :...EOL
		*/
		function getValueString(value,format)
		{
			//var isValue = EZ.toArray(format, ',').indexOf('value') != -1;
			if (isHTML)
			{
				return value 
					 + (value.right(3) == '...' ? ''
					 : EZdisplayObject.EOL_MARKER);
			}
			if (opts.showtype)
				return value;
				
			return value.indexOf('"') == -1 ? '"' + value + '"'
				 : value.indexOf("'") == -1 ? "'" + value + "'"
				 : value + EZdisplayObject.EOL_MARKER;
		}
		//____________________________________________________________________________________
		/*
		*	Encode html tags when using html formatting
		*/
		function displayEncode(value)
		{
			return value.replace(/</, '&lt;');
		}
	}
}
EZdisplay = EZdisplayObject;
EZdisplayObjectDebug = EZdisplayObject;
/*---------------------------------------------------------------------------------------------
checkOptions(pOptions, pChoices)

Description:
        Look for specific option choice(s) in the options string.  Both options and choices
        use commas to seperate multiple individual options.

Input:
        options		valid options (e.g. "filter,editsingle,alt")
        choices		check if any?? or all?? of choices in options (e.g. alt,url,image)

Returns:
        True if at least one choice is contained in options
        False if none of the choice(s) are found

Example:
		EZcheckOptions('filter,editsingle,alt','alt,url,image') returns true	???
		EZcheckOptions('pam,tom,sandy,larry','pam') returns true
---------------------------------------------------------------------------------------------*/
function EZcheckOptions(pOptions, pChoices)
{
	if (!pOptions || !pChoices) return false;
	var inputOpts = "," + pOptions + ",";
	inputOpts = inputOpts.toLowerCase();

	var searchOpts = pChoices.toLowerCase();
	var str;
	var pos;

	//----- For each desired choice ...
	while ( !searchOpts == "" )
	{
		str = searchOpts;
		pos = str.indexOf(",");
		if (pos == 0)
		{
			searchOpts = str.substring(pos+1);	//strip comma
			continue;
		} else if (pos > 0)
		{
			searchOpts = str.substring(pos+1);
			str = str.substring(0,pos);
		} else
		{// no commaa
			searchOpts = "";
		}
		// check for this choice
		if (inputOpts.indexOf("," + str + ",") >= 0) return true;
		if (inputOpts.indexOf("," + str + "=") >= 0) return true;
	}
	return false;
}
/*---------------------------------------------------------------------------------------------
Return specified option value from the snippet (or null if option not found)
---------------------------------------------------------------------------------------------*/
function EZgetOptionValue(optionName, snippet)
{
	var optStr = unescape(snippet);
	var optStrBeg = "<%-- Option:" + optionName + "="; // EZ.const.begLine;
	var optStrEnd = "--%>"; // EZ.const.endComment;
	var optPosBeg = optStr.indexOf(optStrBeg);
	var optPosEnd = optStr.indexOf(optStrEnd, optPosBeg);

	if(optPosBeg == -1 || optPosEnd == -1)
		return null;

	optStr = optStr.substring(optPosBeg + optStrBeg.length, optPosEnd);
	return EZtrim(optStr);

}
EZGetOptionValue = EZgetOptionValue;
/*---------------------------------------------------------------------------------------------
Looks for a key=value in the options string and returns the value portion.
(clone of getValue in EZTagSupport)

Parameters:
	options - String searched for key=value
	key - Key to find in options string

Returns:
	Associated value when key is found, otherwise returns blank string
---------------------------------------------------------------------------------------------*/
function EZgetOption(pOptions, pKey, defaultValue)
{
	var pos, str, keyEqual;
	if (!pOptions) pOptions = '';
	if (typeof defaultValue == 'undefined') defaultValue = '';

	//----- Search for key=
	keyEqual = pKey + "=";
	str = "," + pOptions;
	pos = str.toLowerCase().indexOf( keyEqual.toLowerCase() );

	if (pos == -1) 	// key not found
		str = defaultValue;
	else
	{
		//----- Keep everything after = up to ,
		str = pOptions.substring(pos + keyEqual.length - 1);
		pos = str.indexOf(",");
		if (pos >= 0) str = str.substring( 0, pos );	// value
	}
	//----- For backward compatibility: only map to true or false
	//		if defaultValue specified as boolean type
	if (typeof defaultValue == 'boolean')
		str = EZistrue(str)
	return str;
}
EZgetoption = EZgetOption;
/*---------------------------------------------------------------------------------------------
EZgetKeyValue

Description:
        Looks for a key = value string in the input string and returns the value portion.

Parameters:
        options		String to be searched
        key			Key searching for in options

Returns:
        If key is found, the associated value is returned, otherwise return blank string.
---------------------------------------------------------------------------------------------*/
function EZgetKeyValue( pOptions, pKey)
{
	var pos;
	var str;
	var keyEqual;

	//----- Search for key=
	keyEqual = pKey + "=";
	str = "," + pOptions;
	pos = str.toLowerCase().indexOf( keyEqual.toLowerCase() );

	if (pos == -1) 	// key not found
		str = "";
	else
	{
		//----- Keep everything after =
		str = pOptions.substring(pos + keyEqual.length - 1);
		pos = str.indexOf(",");
		if (pos >= 0) str = str.substring( 0, pos );	// value
	}
	return str;
}
EZgetkeyvalue = EZgetKeyValue;
/*---------------------------------------------------------------------------------------------
Explicity run translator
---------------------------------------------------------------------------------------------*/
function EZrunTranslator(dom)
{
	var runIt = false;
	if (!dom) dom = EZ.doc.dom;

	var isNewDom = false;
	if (dom == null)
	{
		isNewDom = true;
		dom = EZgetDOM("document");
	}

	if (dom == null)
		runIt = null;

	else
		runIt = true;

	/* As of 199e, use lock translater to keep from running
	{
		var pos = dom.documentElement.outerHTML.indexOf(EZ.constant.revizeProperties);
		if (pos == -1)
			dom.documentElement.outerHTML.indexOf(EZ.constant.revizePropertiesOld);
				+ EZ.constant.revizeProperties.length;
		if (dom.documentElement.outerHTML.substring(pos,pos+1) == ':')
			runIt = true;
	}
	*/

	dw.log('EZrunTranslator ','runIt='+runIt);
	if (runIt)
		dom.runTranslator("Revize Translator");

	if (dom && isNewDom)
		EZreleaseDOM(dom);
}
/*---------------------------------------------------------------------------------------------
Call EZwarn() if enabled; else show alert and return false.

returns 	false if EZwarn not enabled as convenience to caller.
			(e.g. return EZalert(...) to quit based EZwarn response)
			otherwise returns EZwarn() return value
---------------------------------------------------------------------------------------------*/
function EZalert(msg,more)
{
	if (EZgetPref(EZ.pref.warningMessages,'novalidate'))
	{
		if (more)
			return EZwarn(more,msg);
		else
			return EZwarn(msg);
	}
	else
	{
		alert(msg);
		return false;
	}
}
/*---------------------------------------------------------------------------------------------
Warning message: always display if name, filepath or lineNumber supplied otherwise only display
				 if Warning Messages enabled under Revize > Diagnostics > Advanced Settings

If comment is object, name is displayed by passing it to EZdisplayObject()
If name is object append to msg via EZdisplayObject() usually called from EZexception()

called by EZalert if warning messages enabled under: Revize > Advanced Settings

EZexception calls as follows:
	EZwarn(msg,'',e.fileName,e.lineNumber);

----------
Arguments:
----------

comment		string or object displayed before stack trace
name		passed to EZdisplayObject() when comment is object
---------------------------------------------------------------------------------------------*/
function EZerror(comment,name,filepath,lineNumber)
{
	if (!filepath && !lineNumber) filepath = -1
	return EZwarn(comment,name,filepath,lineNumber);
}
function EZwarn(comment,name,filepath,lineNumber)
{
	if (!comment) comment = '';
	if (!name) name = '';
	if (!filepath) filepath = '';
	if (!lineNumber) lineNumber = '';

	var isError = (filepath || lineNumber) && !EZ.suppressErrors;

	var heading = 'Warning Message';
	var msg = comment;

	if (typeof(comment) == 'object')
		msg = EZdisplayObject(comment,name);

	msg = EZstripConfigPath(msg);

	// error object if called from EZexception
	if (typeof(name) == 'object')
	{
		msg += EZdisplayObject(name,name.name) + '\n';
		if (typeof(name.stack) == 'string')
			name.stack = EZstripConfigPath(name.stack);
	}
	else if (name)
		heading = name;

	// Display script 3 lines above and 3 lines after lineNumber
	var stack = EZdisplayScript(filepath,lineNumber,3) 
	var caller = EZdisplayCaller();
	stack += '\n' + caller;
	
	var brief = heading + '\n' + msg;
	msg = brief + '\n' + stack;
		
	if (window.dw)
	{	
		if (dw.log) dw.log(heading,msg);		//always call trace
		if (dw.isNotDW) 
			return dw.techSupport(stack, brief.replace(/\n/g, ' -- '));
	}
	if (EZ.suppressErrors) return;

	//----- return w/o display if warning not enabled and not error
	if (!isError && !EZgetPref(EZ.pref.warningMessages)) return true;
	//if (!EZgetPref(EZ.pref.warningMessages)) return true;

	msg = heading + ' '  + msg + '\n';
	msg += '\n'
		 + '___________________________________________________\n'

	msg += 'Press "OK" to Keep Displaying Warnings or Errors\n'
		 + 'Press "Cancel" to Disable\n\n'
	if (!confirm(msg)) EZ.suppressErrors = true;

	return true;
}
EZnote = EZwarn;
/*---------------------------------------------------------------------------------------------
window.onerror = EZexception; is no go on DW
but try/catch on EZsetup and use of EZrun should work just fine.
TODO: launch EZdebugger()
---------------------------------------------------------------------------------------------*/
function EZexception(e,msg)
{
	if (e.toString() == 99999) return;	//EZdebugger stopped script

	g.exception = e;
	var msg = '';
	var stack = '';
	var fileName = ''
	var lineNumber = '';
	var header = 'JAVASCRIPT Exception: '

	// format message
	if (typeof(e) == 'object')
	{
		var stack = e.stack || '';	//.replace(/@:0$/m, '');;
		if (typeof(EZstripConfigPath) == 'function')
			stack = EZstripConfigPath(stack);
		stack = stack.replace(/@/g, '		');

		EZlog(header, e.message + '\n' + stack);
		msg = header + ' ' + e.message;
		stack = msg + '\n' + stack;

		fileName = e.fileName || 'NA';
		lineNumber = e.linenumber || 'NA';
	}
	else
	{
		EZlog(header, e);
		msg = header + ' ' + e;
		stack = EZdisplayCaller(msg)
	}

	// simulator display
	if ('dw.techSupport'.ov())
		return dw.techSupport(stack, msg);

	// DW enviornment display
	var el = EZgetEl(['evalResults']);
	if (el == null)
		return EZsetValue(el, msg + '\n' + stack);

	if (!lineNumber)
		msg + '\n' + stack;
	/*
	var cmdFile = "EZdebugger.htm";
	var cmdDOM = EZgetDOM(EZ.constant.commandsPath + cmdFile)

	// This statement does not return until the EZdebugger.htm command window is closed.
	//dw.runCommand(cmdFile, EZdebuggerStart.callback, callStack, EZdebuggerStart, this);
	dw.runCommand(cmdFile, EZdebuggerStart, this);
	*/
	EZwarn(msg, e, fileName, lineNumber);
}
EZdisplayException = EZexception;
/*---------------------------------------------------------------------------------------------
Display script from filepath before and after range at lineNumber.
---------------------------------------------------------------------------------------------*/
function EZdisplayScript(filepath,lineNumber,range)
{
	msg = '';

	// Display javascript at lineNumber, if requested
	while (filepath && lineNumber)
	{
		//----- Read script file
		var script = DWfile.read(filepath);
		if (!script) break;

		// make all lines endinde with \r only \n only or \r\n to just \n
		script = EZeolSame({script:script});

		// find lines a bit before and bit affer lineNumber
		var count = 0;
		var offset = 0;
		var pattern = /(.*)\n/;
		var scriptLine = '';
		var offsetLine = 0;
		var scriptArray = [];
		var scriptNew = ''

		// go through all line starting at the beginning of the script file
		while (true)
		{
			count++;
			if (count>10000) break;
			var results = script.substring(offset).match(pattern)
			if (results == null) break;

			// Odd but results[1] is empty & results.index is EOL
			//results[1] = script.substring(offset,offset+results.index);
			offset += results.index + results[0].length;
			var line = count + ': ' + results[1];

			// save lines for note dialog box
			if (count >= (lineNumber-range))
			{
				var pointer = '    ';		//not the offending line
				var pointerDash = '';
				if (count == lineNumber)
				{
					EZdisplayScript.line = results[1];
					pointer = '\n->';
					pointerDash = '------------------------------------------';
					offsetLine = offset;
				}
				scriptNew = pointer + count + ': '
						  + results[1].replace(/\t/g,'    ') + '\n';

				scriptLine += pointerDash + scriptNew;
				if (EZtrim(pointer) != '')
					scriptLine += '------------------------------------------\n'

				scriptArray.push({lineno:count, script:scriptNew});
				if (count > (lineNumber + range)) break;
			}
		}
		EZdisplayScript.script = scriptArray;

		// if there is script
		if (scriptLine)
		{
			var filepathDisplay = EZstripConfigPath(filepath)

			// find last function name by backing up from current line offset
			var funcName = '';
			offset = offsetLine-1;	//points to end of error line so this will find error line
			count = 0;
			while (offset > 0)
			{
				if (count++ > 500) break;
				offsetLine = script.lastIndexOf('\n',offset);	//get prior \n
				if (offsetLine < 0) break;

				results = script.substring(offsetLine+1,offset-1).match(/\s*function\s*(\w*)[\s\(]/);
				if (results)
				{
					funcName = results[1];
					funcName = '::' + funcName + '(...)';
					break;
				}
				offset = offsetLine - 1;
			}
			msg += '___________________________________________________\n'
				 + filepathDisplay + funcName + '\n'
				 + scriptLine
				 + '___________________________________________________\n';

			EZdisplayScript.filepathDisplay = filepathDisplay;
			EZdisplayScript.funcName = funcName;
		}
		break;
	}
	return msg;
}
/*---------------------------------------------------------------------------------------------
Display call stack
---------------------------------------------------------------------------------------------*/
function EZdisplayCaller(msg)
{
    if (!msg) msg = '';
    if (msg) msg += '\n\n';
    var funcName = '';
    var trace = msg + 'CALLED FROM...\n';
	for (var func = EZdisplayCaller.caller; func != null; func = func.caller)
	{
		funcName = func.toString().match(/function (\w*)/)[1];
		if (funcName == null || funcName.length == 0)
			funcName = "anonymous"

		trace += '   ' + funcName + "\n";
		if (func.caller == func) break;	//NS 4.0 bug workaround
	}
	EZdisplayCaller.fn = funcName;
	var cmd = '-Dreameaver API-';
	if (document && document.URL)
	{
		cmd = EZgetFileInfo(document.URL).filenameFull;
		EZdisplayCaller.filename = cmd;
	}
	trace += '   ' + cmd;
	return trace;
}
EZcaller = EZdisplayCaller;
/*---------------------------------------------------------------------------------------------
Display call stack

Options:
	debug		pause in debug mode (TODO: for DW)
	debug=???	only pause if EZdebugoption[???] is true
	force		pause even if not in debug mode
	yes			assume yes rather using comfirm
---------------------------------------------------------------------------------------------*/
EZdisplayCaller.MAX_FUNCTIONS_SHOW_ARGS = 3;
EZdisplayCaller.MAX_FUNCTIONS = 15;
function EZdisplayCaller(msg,options)
{
    if (!msg) msg = '';
	if (msg) msg += '\n\n';
	if (!options) options = '';

	var isDebug = EZcheckOptions(options,'debug')
	var isDebugForce = EZcheckOptions(options,'force')
	if (isDebugForce) isDebug = true;

	var e = '';
	var funcName = '';
	var indentFunc = isDebug ? 0 : 4;
	var indentArgs = indentFunc + 4;
	var trace = msg;
	try											//don't want js error for users
	{
		if (isDebug)
		{
			if (!EZisDebug() && !isDebugForce)		//EZ.debug can be typeof unknown
				return false;
			var isDebugYes = EZcheckOptions(options,'yes');
			var debugOption = EZgetOption(options,'debug');	//debug=
			if (!debugOption || !EZisDebugOption(debugOption)) return false;
		}

		var i, count = 0;
		var patternFunction = /function\s*(\w*)\s*\((.*?)\)[^{]*{([\s\S]*)}/
		//                                 1         2           3
		//								   name      args        body
		for (var func = EZdisplayCaller.caller; func != null; func = func.caller)
		{
			var script = func.toString();
			var results = funcName = script.match(patternFunction);
			if (!results)
				funcName = '*unknown*';
			else
			{
				funcName = results[1] + '(' + results[2] + ')';
				if (!results[1])
					funcName = "anonymous" + funcName;
			}

			// display args for 1st few functions
			if (++count <= EZdisplayCaller.MAX_FUNCTIONS_SHOW_ARGS)
			{
				msg = funcName + '\n';

				// display args and current values
				var args = results[2];
				if (args)
				{
					args = args.split(',');
					for (i=0;i<args.length;i++)
					{
						var value = 'undefined';
						if (i < func.arguments.length) 	//value supplied
						{
							var indentValue = indentArgs + args[i].length + 1;
							value = func.arguments[i] + '';
							value = value.replace(/\t/g,'    ');
							if (value.length > 20)
								value = EZtrim(value.substr(0,20)) + '...';
							value = value.replace(/\n/g,'\n' + EZdup(indentValue,' '));
						}
						msg += EZdup(indentArgs,' ') + args[i] + '='
							   + value
							   + '\n';
					}
				}
				funcName = msg;
			}
			// for anonymous, display first non-blank line of function body
			if (funcName.indexOf('anonymous(') != -1)
			{
				results = results[3].match(/\s*(\w+.*)/);
				if (results)
				{
					funcName += EZdup(indentArgs,' ') + '{' + results[1] + '...}\n';
				}
			}
			if (count == 1)
			{
				if (isDebug)
					trace += 'DEBUG MODE pause in: ' + funcName + 'CALLED FROM...\n';
				else
					trace += 'CALLED FROM...\n' + EZdup(indentFunc,' ') + funcName;
			}
			else
				trace += '\n    ' + funcName + "";

			if (func.caller == func) break;		//NS 4.0 bug workaround
			if (count > EZdisplayCaller.MAX_FUNCTIONS) break;	//probably in recursive loop (e.g. calendar setup())
		}	// end trace stack

		// append main html file
		EZdisplayCaller.fn = funcName;
		var filepath = location.pathname;
		filepath = filepath.replace(/\\/g,'/');
		EZdisplayCaller.filename = filepath;
		filepath = filepath.substr(filepath.lastIndexOf('/')+1)
		trace += '    ' + filepath;

		if (isDebug)
			return isDebugYes || confirm(trace + '\n\nStart Debugger?');
	}
	catch (e) {}	//ignore js errors

	return trace;
}
/*---------------------------------------------------------------------------------------------
this function gets called before dw.runCommand(errors.htm).
It sets the error message and action in a temp DOM loaded with error.htm to display below
values in a popup error window.

Was moved from errors.htm because when calling function in errors.htm from site menu,
returned dom(errors.htm) as null and gave errors.

NOTE: although some parameters are global, all are passed as parameters for future cleanup.

Parameters:
	errorMessage	Error message & url constructed from returned http code & data
	postInfo		Object containing revize request properties
					XML			Xml string passed in request (primarily for http trace calls)
					postAction	Revize action
	msgFilename		optional parameter specifing template used to display errorMessage
					e.g. RevizeWarning.htm (default is RevizeErrors.htm)
---------------------------------------------------------------------------------------------*/
function EZdisplayErrorMessage(errorMessage, postInfo, msgFilename )
{
	//----- If the error message is a URL containing the servlet request (e.g. trace call),
	//		then display the XML instead of the action on the small popup error window
	//		(it's usually more meaningfull and avoids the need to use the show request
	//		button to follow the program flow).  Original action is passed to popup window
	//		for use by the Xml request button.
	//
	var action = "Revize Action: " + postInfo.Action;
	if (errorMessage.indexOf("XmlRequestServlet") >= 0)
	{
		action = unescape(postInfo.XML).substr(0,1000)
		action = action.split('<').join('&lt;')
		action = action.split('>').join('&gt;')
	}

	if (typeof msgFilename == 'undefined')
		msgFilename = "RevizeErrors.htm"
	else
		action = '';

	//----- Save message for inspector and others.
	EZ.errorDetail = errorMessage;

	//----- If Inspector exit
	if (EZ.isInspector) return

	//----- Update error doc template and run command
	var theErrorDoc = EZgetDOM(EZ.constant.commandsPath + msgFilename);
	var src = theErrorDoc.documentElement.outerHTML;

	// message placeholder
	var beginReqError = src.indexOf('<!-- RequestError -->');
	var endReqError = src.indexOf('<!-- EndRequestError -->');

	// action (or URL) placeholder
	var beginReqURL = src.indexOf('<!-- RequestURL -->');
	var endReqURL = src.indexOf('<!-- EndRequestURL -->');

	// doc pieces
	var beginDoc = src.substring(0,beginReqError + 21);
	var midDoc = src.substring(endReqError, beginReqURL + 19);
	var endDoc = src.substring(endReqURL, src.length);

	// reassemble adding data
	theErrorDoc.documentElement.outerHTML = beginDoc + errorMessage
	                                      + midDoc + action + endDoc;

	dw.runCommand(msgFilename,
	              postInfo.Action,
	              postInfo.Server,
	              postInfo.URL,
	              postInfo.XML,
	              EZ.postReply.data);
	EZreleaseDOM(theErrorDoc);

	return true;
}
/*---------------------------------------------------------------------------------------------
Display Error and set global error flag.

Arguments:
	errorCode	(optional) either div layer element or string with custom error message
				OR blank if just clearing prior error messages.
				Starts with dash or space for status message vs error message which is
				displayed as bold red and beeps when using dataUndefined generic div.

	focusField	(optional) either field element to give focus -OR-
				string with message for 2nd line (always normal, black)

Returns:
	true 	if called to clear messages
	false 	if message displayed so calling function can call with return statement
			that conveniently returns false to their caller.
			e.g. return EZdisplayError('bad...argument or whatever')

Updated:
11-16-2011	dataUndefined div never hidden once made visible (avoids reset on select tags)
			EZdisplayMessage.msgDiv and EZdisplayMessage.msgText updated whenever message
			is displayed or cleared.
			Any div with id starting with 'data' and position=absolute is cleared.
			Message not logged in trace unless error message.
---------------------------------------------------------------------------------------------*/
function EZdisplayMessage(errorCode, focusField)
{
	var isBeep = true;
	var isRed = true;
	var isConnecting = false;
	if (!errorCode) errorCode = '';

	// Is errorCode empty string or starts with non-beep character
	if (typeof(errorCode) == 'string'
	&& (errorCode == '' || errorCode && /^( |-|\*)/.test(errorCode)))
	{
		isBeep = false;
		if (errorCode.substr(0,1) != '*')
			isRed = false;
		errorCode = errorCode.substring(1);
	}
	else if (errorCode)
	{
		//----- If errorCode refers to div id
		if (typeof errorCode == 'string' && typeof document[errorCode] != 'undefined')
			errorCode = document.getElementById(errorCode);

		if (typeof errorCode == 'object')
		{
			if (errorCode.id == 'connectMessage')
			{
				isBeep = false
				isConnecting = true;
				MM.setBusyCursor();
				EZdisplayMessage.busy = true;
			}
			else if (errorCode.className && errorCode.className.indexOf('nobeep') != -1)
				isBeep = false;
		}
		if (!isConnecting)
			EZlog('EZdisplayMessage',errorCode);
	}
	var msg = errorCode;
	/*---------------------------------------------------------------------------------------------
	// Called from /startup/RevizeSetup.htm ?
	if (document.URL.indexOf('/RevizeSetup.htm') != -1)
	{
		msg = EZtimestamp() + ' ' + msg + '\n';

		if (DWfile.exists(EZ.constant.setupLogLile))
			DWfile.write(EZ.constant.setupLogLile, msg, "append");
		else
			DWfile.write(EZ.constant.setupLogLile, msg);

		if (!dw.constructor.startupMessage)
			dw.constructor.startupMessage = 'startup: ';
		dw.constructor.startupMessage += '\n' + msg;

		return !msg;
	}
	---------------------------------------------------------------------------------------------*/
	// turn off busyCursor if not connectMessage and turned on
	if (!isConnecting && EZdisplayMessage.busy)
	{
		MM.clearBusyCursor();
		EZdisplayMessage.busy = false;
	}

	//----- Hide connecting div, any div with data prefix, and most recent msg saved
	//		in EZdisplayMessage.msgDiv (historically saved in EZ.errorCode)
	show(EZdisplayMessage.msgDiv,false);
	var divs = document.getElementsByTagName('div')
	for (var i=0;i<divs.length;i++)
	{
		var div = divs[i];
		if (div.id && div.id.substr(0,4) == 'data' && div.style.position == 'absolute')
			show(div,false);
	}
	EZdisplayMessage.msgDiv = '';
	EZdisplayMessage.msgText = '';
	show(document.connectMessage,isConnecting);		//hide or show connecting

	//----- Done if just clearing messages
	//08-02-2015 DCO: clear Loading...
	//	if (!errorCode) return true;	//no new message

	if (EZdisplayMessage.defaultMsg)
		setTimeOut(function() {EZdisplayMessage(EZdisplayMessage.defaultMsg);}, 10000);

	EZ.errorCode = null;			//legacy (not cleared unless new message)
	if (isConnecting) return true;

	//----- If errorCode refers to div id
	if (typeof errorCode == 'object')
	{
		EZ.errorCode = errorCode;	//legacy (only set if errorCode references div)
		show(errorCode,true);
	}
	//----- Use div id="dataUndefined" if defined, otherwise use alert
	else
	{
		var msgElement = document.getElementById('dataUndefined');
		if (msgElement)		//legacy processing for Revize
		{							
			// if msg layer has child (e.g. <font...>), update msg container to child
			if (msgElement.childNodes.length > 0)
				msgElement = msgElement.childNodes[0];

			errorCode = errorCode.replace(/\n/g,'<br>');

			// set msgElement style for error or non-error message
			if (!isRed)
			{
				msgElement.style.color="black";
				msgElement.style.fontWeight="normal";
			}
			else
			{
				msgElement.style.color="#FF3333";
				if (errorCode.indexOf('<b>') == -1)
					msgElement.style.fontWeight="bold";
			}

			if (focusField && typeof(focusField) != 'object')
			{
				errorCode = '<font size="2">' + errorCode + '<br>'
						  + '<font style="color:black;font-weight:normal">'
						  + focusField + '</font></font>'
			}

			msgElement.innerHTML = errorCode;
			show('dataUndefined',true,errorCode);
		}
		//08-02-2015 DCO: at least look for id=message
		else if (msgElement = document.getElementById('message'))
		{
			msgElement.innerHTML = errorCode;
			if (errorCode && dw.isNotDW && 'dw.displayMessage'.ov())
				dw.displayMessage(errorCode);
		}
		else
		{
			EZalert(errorCode);
		}
		if (isBeep) EZdisplayMessage.msgText = errorCode;
	}

	//---- give focus to field if specified
	if (focusField && focusField.focus)
		focusField.focus();

	return false;

	/**
	 *	show or hide message
	 *	el either div, div id
	 **/
	function show(errorCode,trueFalse)
	{
		if (!errorCode) return;

		var el = errorCode;
		if (typeof(el) != 'object')
			el = document.getElementById(el);
		if (el == null) return;

		var visible = (trueFalse ? 'visible' : 'hidden');

		// div id="dataUndefined" never hidden once visible (html just cleared)
		if (el.id == 'dataUndefined')
		{
			if (visible == 'hidden') el.innerHTML = '';
			visible = 'visible'
		}

		//----- Change visibilty property if necessary
		el.visibility = visible;

		//----- If displaying message, remember div and message text
		if (trueFalse)
		{
			EZdisplayMessage.msgDiv = el;
			beepError();
		}
	}

	// if not blank or "-" prefix, beep
	function beepError()
	{
		if (!isBeep
		|| errorCode.length == 0
		|| errorCode == 'connectMessage')
			return;
		setTimeout('dw.beep()',300);
	}
	/**
	 *	show or hide message
	 *	el either div, div id
	 **/
	function show(errorCode,trueFalse)
	{
		if (!errorCode) return;

		var el = errorCode;
		if (typeof(el) != 'object')
			el = document.getElementById(el);
		if (el == null) return;

		var visible = (trueFalse ? 'visible' : 'hidden');

		// div id="dataUndefined" never hidden once visible (html just cleared)
		if (el.id == 'dataUndefined')
		{
			if (visible == 'hidden') el.innerHTML = '';
			visible = 'visible'
		}

		//----- Change visibilty property if necessary
		el.visibility = visible;

		//----- If displaying message, remember div and message text
		if (trueFalse)
		{
			EZdisplayMessage.msgDiv = el;
			beepError();
		}
	}
}
EZclearMessages = EZdisplayMessage;
EZdisplayError = EZdisplayMessage;
/*---------------------------------------------------------------------------------------------
display message if debug mode
---------------------------------------------------------------------------------------------*/
function EZdisplayIfDebug(msg, focusField)
{
	if (EZisDebug())
		EZdisplayMessage(msg, focusField);
	return false;
}
EZdisplayDebug = EZdisplayIfDebug;
/*---------------------------------------------------------------------------------------------
Return text with 's' appended if count > 0
---------------------------------------------------------------------------------------------*/
function EZs(text,count,suffix)
{
	if (!suffix) suffix = 's'
	if (count != 1) text += suffix;
	return text;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function EZsentenceCase(msg)
{
	return msg.replace(/(^|\s)(\w)/g,function(all,p1,p2)
	{
		return p1 + p2.toUpperCase();
	})
}
/*---------------------------------------------------------------------------------------------
http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
---------------------------------------------------------------------------------------------*/
function EZgetRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/*---------------------------------------------------------------------------------------------
Return parent of el with specified tagName and/or className
---------------------------------------------------------------------------------------------*/
function EZgetParent(el,tagName,className)
{
	el = EZgetEl(el);
	if (el == null) return false;
	tagName = (tagName || '').toUpperCase();
	if (tagName == '*') tagName = '';
	var name = tagName + (el.id ? '#' + el.id : '')+ (className ? '.' + className : '')
	
	var count = 0;
	while (count++ < 17)
	{
		el = el.parentNode;
		if (!EZisEl(el)) break;
		
		if (className && !EZhasClass(el, className)) continue;
		if (tagName && (!el.tagName || el.tagName.toUpperCase() != tagName)) continue;
			return el;
	}
	//dw.setFloaterVisibility('RevizeTrace',true);
	var msg = tagName + className + ' parent not found in ' + count + ' generations of: ';
	EZlog('-',msg);
	return EZwarn(msg);
}
/*---------------------------------------------------------------------------------------------
Find all tagName elements with className

tagName & className can be string or string array.

If className not supplied, all tagName(s) tags are returned.
---------------------------------------------------------------------------------------------*/
function EZgetTagsByClassName(tagName,className)
{
	var i,j;
	if (typeof(tagName) == 'string') tagName = [tagName];

	if (!className) className = '';
	if (typeof(className) == 'string') className = [className];

	// Get all elements matching tagName(s)
	var elements = [];
	for (i=0;i<tagName.length;i++)
	{
		var els = document.getElementsByTagName(tagName[i]);
		for (j=0;j<els.length;j++)
			elements.push(els[j]);
	}

	// Find all tags matching className(s)
	var tags = [];
	for (i=0;i<elements.length;i++)
	{
		for (j=0;j<className.length;j++)
		{
			if (!className[j]
			|| (elements[i].className[j]+' ').indexOf(className[j]+' ') != -1)
			{
				tags.push(elements[i]);
				break;
			}
		}
	}
	return tags;
}
/*---------------------------------------------------------------------------------------------
Return offset to start of line (i.e. just after \r & \n)

Input Parameters
	doc				doc.source contains source to search
	offset			(optional) offset in EZ.doc.source to start search (default=0)
	options			(optional) future
---------------------------------------------------------------------------------------------*/
function EZsol(doc,offset,options)
{
	if (!offset) offset = 0;
	if (!options) options = '';
	var lineno = doc.dom.source.getLineFromOffset(offset)
	while (offset > 0 && doc.dom.source.getLineFromOffset(offset-1) == lineno)
		offset--;
	return offset;
}
/*---------------------------------------------------------------------------------------------
Return offset to end of line (i.e. just after \r & \n)

Input Parameters
	doc				doc.source contains source to search
	offset			(optional) offset in EZ.doc.source to start search (default=0)
	options			(optional) TODO: "after" to return after \r & \n
---------------------------------------------------------------------------------------------*/
function EZeol(doc,offset,options)
{
	if (!offset) offset = 0;
	if (!options) options = '';
	var lineno = doc.dom.source.getLineFromOffset(offset)
	while (doc.dom.source.getLineFromOffset(offset+1) == lineno)
		offset++;
	while (offset < doc.source.length && EZcheckOptions(options,'after')
	&& doc.source.substring(offset,offset+1).search(/[\r\n]/) != -1)
		offset++;
	return offset;
}
/*---------------------------------------------------------------------------------------------
Make all lines end with just \n (not \r or \r\n)
Use obj parameter to avoid large string copy when passing parameter by value.
---------------------------------------------------------------------------------------------*/
function EZeolSame(obj)
{
	var pattern = /(\r\n|\n|\r)/g;
	if (typeof(obj) == 'object')
	{
		for (var i in obj)
		{
			return obj[i].replace(pattern,'\n');
		}
	}
	else
		return obj.replace(pattern,'\n');
}
/*---------------------------------------------------------------------------------------------
Following is test case for eolPattern
---------------------------------------------------------------------------------------------*/
function EZeolSameTest()
{
	var html = 'line=0\n\nline=2 (line1 empty)\r\rline=4 (line3 empty)\nline=5\rline=6\r\n'
			 + 'line=7\r\nline=8\r\n';
	EZeolSame({html:html})
	var showlines = html.match(/(.*)\n/g);						//create array with each line
	delete showlines.input; delete showlines.index;				//remove clutter
	return showlines;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function EZfileToUrl(file)
{
	return file.replace(new RegExp(EZ.simulator.configPath), EZ.simulator.domain);
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function EZurlToFile(url)
{
	return url.replace(new RegExp(EZ.simulator.domain), EZ.simulator.configPath);
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
if (EZ && EZ.global && EZ.global.setup) EZ.global.setup('EZ', 'EZcommon');
