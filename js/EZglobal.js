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

//----- PATTERNS
EZ.patterns.offsetPairssDisplay = /(.+?,.+?,)\s?/g	//from EZgetSelection()
//	html = html.replace(/(\r\n|\n|\r)/g, EZ.constant.EOL) //EZdomWorkbench.htm::process()
EZ.patterns.configPath = /.*?\/en_US\/Configuration.*?(\/|$)/im;
EZ.patterns.functionStatement = new RegExp("\\s*(var)?((this\\.)?\\s*(.*?)[=:].*?)?\\bfunction\\s*(\\w*)\\s*\\(","");
EZ.patterns.functionAfterEnd = /(^\s*[\w.]+\s*=\s*['"\w.]+\s*;?.*?)[\n\r]/;		//"

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
