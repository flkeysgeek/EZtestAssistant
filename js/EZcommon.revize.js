/*---------------------------------------------------------------------------------------------
For new organizational structure, functions moved from EZ.core to one of the following files:

	EZ/RZprototypes.js	(same file) and should also match EASY.prototypes.js
									prototypes and related functions
	EZ/RZgetset.js		(same file) future replacement for EASY.core.js::EZ(...)
	EZ/RZcommon.js		(same file) common functions from RevizeCommon.js non-dreamweaver specific
									and partial port of EASY.js functions
	EZdwutils.js 		(latest)	Dreamweaver/Revize specific functions: e.g. getDOM()
	RZdwutils.js		(legacy)	old versions of DW functions used by Revize Extension

---------------------------------------------------------------------------------------------*/
if (typeof(EZ) == 'undefined') EZ = {};		//safety for unexpected
if (!EZ.dw)
{									//global data shared by all commands
	EZ.dw = window.dw ? dw.constructor.EZ : {};
	if (!EZ.dw) EZ.dw = dw.constructor.EZ = {};
}
if (!window.dw) dw = {isNotDW: true};

if (!EZ.legacy)
	EZ.legacy = {getEl:false, getElnull:true, getStyle:false, hasClass:false};

/*---------------------------------------------------------------------------------------------
http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
---------------------------------------------------------------------------------------------*/
EZgetRandomInt = function EZgetRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/*---------------------------------------------------------------------------------------------
fit element width to value -- only select and input tags supported
cloned from EASY.js beta -- works for arial 12px; font normal
probably only works for dw.simulator
---------------------------------------------------------------------------------------------*/
EZfitWidth = function EZfitWidth(el,extra,base,wide,narrow)
{
	el = EZ.getEl(el);
	if (!el) return false;

	extra = extra || 0;
	base = base || 6.5;		//for testing
	wide = wide || 3;		//		''
	narrow = narrow || 3;	//		''

	var me = arguments.callee;

	var plus = 0;
	var value = el.value;
	if (el.tagName == 'SELECT')
	{								//add fitWidth() to onchange if not already
		addChangeCall('onchange');
		if (el.selectedIndex == -1) return false;
		value = el.options[el.selectedIndex].text;
		plus = 15;
	}
	else if (el.tagName == 'INPUT')
	{
		addChangeCall('onkeyup');
	}
	else
	{
		return false;	//not yet supported
	}
	var width = ((value.length + 1) * base) + extra + plus;

	// cludge for wide chars: uppercase char, m w & _
	width += ('_' + value).match(/[A-Z_mw]/g).length * wide;

	// cludge for narrow chars: some puncation
	width -= ('.' + value).match(/[.,;!'|filrtI]/g).length * narrow;
	width = parseInt(width+.5);
	el.style.width = Math.max(width,5) + 'px';
	//======================
	return true;
	//======================
	/**
	 *	make sure we EZgetEl called when value changes
	 */
	function addChangeCall(onName)
	{
		if (!EZfitWidth.calls)
			EZfitWidth.calls = {};
		if (EZfitWidth.calls[el]) return;		//already added
			EZfitWidth.calls[el] = true;

		// check onName el event handler or source of anounyous
		if (el[onName] == me || (el[onName] + '').indexOf('EZ.fitWidth(') != -1) return;

		// add event handler -- may already have one but now there are 2
		var callMe = function() {EZ.fitWidth(el,extra)};
		if (el.addEventListener) el.addEventListener(onName.substr(2), callMe, false);
		else if (el.attachEvent) el.attachEvent(onName, callMe);
	}
}
/*---------------------------------------------------------------------------------------------
Warning message: always display if name, filepath or lineNumber supplied otherwise only display
				 if Warning Messages enabled under Revize > Diagnostics > Advanced Settings

If comment is object, name is displayed by passing it to EZ.displayObject()
If name is object append to msg via EZ.displayObject() usually called from EZ.exception()

called by EZalert if warning messages enabled under: Revize > Advanced Settings

EZexception calls as follows:
	EZ.warn(msg,'',e.fileName,e.lineNumber);

----------
Arguments:
----------

comment		string or object displayed before stack trace
name		passed to EZ.displayObject() when comment is object
---------------------------------------------------------------------------------------------*/
EZerror = function EZerror(comment,name,filepath,lineNumber)
{
	if (!filepath && !lineNumber) filepath = -1
	return EZ.warn(comment,name,filepath,lineNumber);
}
/*---------------------------------------------------------------------------------------------
this function gets called before dw.runCommand(errors.htm).
It sets the error message and action in a temp DOM loaded with error.htm to display these
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
displayErrorMessage = function displayErrorMessage(errorMessage, postInfo, msgFilename )
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

	if (!msgFilename)
		msgFilename = "RevizeErrors.htm"
	else
		action = '';

	//----- Cleanup and Save message for inspector and others.
	errorMessage = errorMessage.replace(/\**?WEBS..CE\**?: (\w*)/, '<p>');
	errorMessage = errorMessage.replace(/(\s*?)at com.caucho.*[\s\S]*/, '');

	var regex = /com.caucho.jsp.JspParseException:((.*?):(.*?)):([\s\S]*)/;
	errorMessage = errorMessage.replace(regex, '<p>$4...<p>Error @ $1</p>');
	//errorMessage = errorMessage.replace(/:/, ':<br>');

	RZ.errorDetail = errorMessage;

	//----- If Inspector exit
	if (RZ.isInspector) return

	if (postInfo.callback)
	{
		postInfo.callback(errorMessage, postInfo, msgFilename);
		return;
	}

	//----- Update error doc template and run command
	var theErrorDoc = EZ.getDOM(RZ.constant.configPath + '/commands/'+msgFilename);
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

	dw.runCommand( msgFilename,
	               postInfo.Action,
	               postInfo.Server,
	               postInfo.URL,
	               postInfo.XML,
	               RZ.postReply.data );
	EZ.releaseDOM(theErrorDoc);
}
/*---------------------------------------------------------------------------------------------
Display Error and set global error flag.

Arguments:
	errorCode	either div layer element or string with custom error message
				OR blank if just clearing prior error messages
---------------------------------------------------------------------------------------------*/
EZclearMessages = function EZclearMessages() {EZ.displayError() }
EZdisplayMessage = function EZdisplayMessage(msg, focusField) {EZ.displayError(msg, focusField) }
/*---------------------------------------------------------------------------------------------
Use EZ.warn() if enabled; else show alert and return false as shortcut to caller.

EZwarn returns true or false as shortcut to call

(e.g. return EZ.alert(...) to quit based EZwarn response)
---------------------------------------------------------------------------------------------*/
EZalert = function EZalert(alertStr)
{
	var msg
	if (typeof RZ.global != 'undefined')
	{
		if (typeof RZ.global.prefs != 'undefined')
		{
			if (EZ.getPref(RZ.pref.warningMessages))
				return EZ.warn(alertStr);

			alert(msg);
			return false;
		}
	}

	//----- RZ.global or RZ.global.prefs is not defined, display alert
	msg = '*******************************************************************\n\n'
		+ 'Debug Message (RZ.global or RZ.global.prefs not defined)\n'
		+ '*******************************************************************\n\n'
	alert(msg + alertStr);
	return false;
}
EZnote = function EZnote(comment,name,filepath,lineNumber)
{ return EZ.warn(comment,name,filepath,lineNumber) }
EZwarn = function EZwarn(comment,name,filepath,lineNumber)
{
	if (!comment) comment = '';
	if (!name) name = '';
	if (!filepath) filepath = '';
	if (!lineNumber) lineNumber = '';

	var isError = (filepath || lineNumber) && !RZ.suppressErrors;

	var heading = 'Warning Message';
	var msg = comment;

	if (typeof(comment) == 'object')
		msg = EZ.displayObject(comment,name);

	msg = EZ.stripConfigPath(msg);

	// error object if called from RZexception
	if (typeof(name) == 'object')
	{
		msg += EZ.displayObject(name,name.name) + '\n';
		if (typeof(name.stack) == 'string')
			name.stack = EZ.stripConfigPath(name.stack);
	}
	else if (name)
		heading = name;

	msg += '\n';

	// Display script 3 lines above and 3 lines after lineNumber
	msg += EZ.displayScript(filepath,lineNumber,3);

	msg += '\n' + EZ.displayCaller();
	dw.log(heading,msg);		//always call trace
	if (RZ.suppressErrors) return;

	//----- return w/o display if warning not enabled and not error
	if (!isError && !EZ.getPref(RZ.pref.warningMessages)) return true;
	//if (!EZ.getPref(RZ.pref.warningMessages)) return true;

	msg = heading + ' '  + msg + '\n';
	msg += '\n'
		 + '___________________________________________________\n'

	msg += 'Press "OK" to Keep Displaying Warnings or Errors\n'
		 + 'Press "Cancel" to Disable\n\n'
	if (!confirm(msg)) RZ.suppressErrors = true;

	return true;
}
/*---------------------------------------------------------------------------------------------
Display call stack
---------------------------------------------------------------------------------------------*/
EZdisplayCaller = function EZdisplayCaller(msg)
{
    if (!msg) msg = '';
    if (msg) msg += '\n\n';
    var funcName = '';
    var trace = msg + 'CALLED FROM...\n';
	for (var func = RZdisplayCaller.caller; func != null; func = func.caller)
	{
		funcName = func.toString().match(/function (\w*)/)[1];
		if (funcName == null || funcName.length == 0)
			funcName = "anonymous"

		trace += '   ' + funcName + "\n";
		if (func.caller == func) break;	//NS 4.0 bug workaround
	}
	RZdisplayCaller.fn = funcName;
	var cmd = '-Dreameaver API-';
	if (document && document.URL)
	{
		cmd = EZ.getFileInfo(document.URL).filenameFull;
		RZdisplayCaller.filename = cmd;
	}
	trace += '   ' + cmd;
	return trace;
}
RZcaller = RZdisplayCaller;
EZdisplayError = function EZdisplayError(errorCode, focusField)
{
	var isBeep = true;
	if (errorCode && errorCode.substr(0,1) == '-')
	{
		isBeep = false;
		errorCode = errorCode.substring(1);
	}

	// turn off prior messages
	if (document.connectMessage)
		document.connectMessage.visibility = "hidden";	// turn off connect message
	if (document.dataUndefined)
		document.dataUndefined.visibility = "hidden";
	if (RZ.errorCode && typeof document[RZ.errorCode] != 'undefined')
		document[RZ.errorCode].visibility = "hidden";

	if (!errorCode) return true;		//no new error code

	RZ.errorCode = null;
	if (typeof document[errorCode] != 'undefined')		// if cooresponding error msg, display
	{
		RZ.errorCode = errorCode;
		document.getElementById(errorCode).visibility = "visible";
		beepError();
	}
	else
	{
		var msgElement = document.getElementById('dataUndefined');
		if (msgElement)
		{
			msgElement.visibility = "visible";
			// if msg layer has child (e.g. <font...>), update msg container to child
			if (msgElement.childNodes.length > 0)
				msgElement = msgElement.childNodes[0];
			if (!isBeep)
			{
				msgElement.style.color="black";
				msgElement.style.fontWeight="normal";
			}
			else
			{
				msgElement.style.color="#FF3333";
				msgElement.style.fontWeight="bold";
			}
			msgElement.innerHTML = errorCode;
			EZ.trace('RZdisplayMessage',errorCode);

			beepError();
		}
		else
		{
			alert(errorCode);
		}
	}
	if (focusField && focusField.focus)
		focusField.focus();
	return false;

	// if not blank or "-" prefix, beep
	function beepError()
	{
		if (!isBeep
		|| errorCode.length == 0
		|| errorCode == 'connectMessage')
			return;
		setTimeout('dw.beep()',300);
	}
}
/*---------------------------------------------------------------------------------------------
window.onerror = EZexception; is no go on DW
but try/catch on EZsetup and use of EZrun should work just fine.
TODO: launch EZ.debugger()
---------------------------------------------------------------------------------------------*/
EZexception = function EZexception(e,msg)
{
	if (e.toString() == 99999) return;	//RZdebugger stopped script

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
		if (typeof(RZstripConfigPath) == 'function')
			stack = EZ.stripConfigPath(stack);
		stack = stack.replace(/@/g, '		');

		EZ.log(header, e.message + '\n' + stack);
		msg = header + ' ' + e.message;
		stack = msg + '\n' + stack;

		fileName = e.fileName || 'NA';
		lineNumber = e.linenumber || 'NA';
	}
	else
	{
		EZ.log(header, e);
		msg = header + ' ' + e;
		stack = EZ.displayCaller(msg)
	}

	// simulator display
	if (!window.dw) return;
	if (dw.isNotDW)
	{
		dw.displayMessage(msg);
		dw.displayStacktrace(stack);
		return;
	}

	// DW enviornment display

	var el = EZ.getEl(['evalResults']);
	if (el)
		return EZ.setValue(el, msg + '\n' + stack);

	if (!lineNumber)
		msg + '\n' + stack;
	/*
	var cmdFile = "RZdebugger.htm";
	var cmdDOM = EZ.getDOM(RZ.constant.commandsPath + cmdFile)

	// This statement does not return until the RZdebugger.htm command window is closed.
	//dw.runCommand(cmdFile, RZdebuggerStart.callback, callStack, RZdebuggerStart, this);
	dw.runCommand(cmdFile, RZdebuggerStart, this);
	*/
	EZ.warn(msg, e, fileName, lineNumber);
}
EZdisplayObjectSetting = function EZdisplayObjectSetting(key,value)
{
	RZdisplayObject[key] = value;
}
/*---------------------------------------------------------------------------------------------
Display all object values and expand contained object to OBJECT_DEPTH

Can also be used to return display value for other types (i.e. boolean, number or string) OR
	*undefined*, *empty*, *null*, *true*, *false*

TODO: typeof undefined is not displayed properly
	  html elemente have el.contructor == Element is true
---------------------------------------------------------------------------------------------*/
EZdisplayObject = function EZdisplayObject(obj,name,indent,isArray)
{
	try
	{
		RZdisplayObject.maxline = EZ.getPref(RZ.pref.displayMaxString, RZdisplayObject.MAXLINE);
		RZdisplayObject.maxdepth = EZ.getPref(RZ.pref.displayMaxDepth, RZdisplayObject.OBJECT_DEPTH);

		return EZ.displayObjectProcess(obj,name,indent,isArray);
	}
	catch (e)
	{
		RZdisplayObject.display += '\nException Displaying Object:\n' + e.description;
		return RZdisplayObject.display;
	}
	EZdisplayObject = function EZdisplayObjectProcess(obj,name,indent,isArray,depth)
	{
		var i, e, results;
		RZdisplayObject.display = '';
		if (!indent || depth == undefined)	//assume top level starting point, initialize variables
		{
			indent = 0;
			depth = 0;
			RZdisplayObject.objectCount = 0;
			RZdisplayObject.quit = false;
			RZdisplayObject.lastTypeObject = false;
			RZdisplayObject.firstObject = true;
		}
		else
		{

		}

		var spaces = EZ.constant.spaces.substring(0,indent * RZdisplayObject.INDENT_SIZE);
		var spacesPlus = spaces + EZ.constant.spaces.substring(0,RZdisplayObject.INDENT_SIZE);
		var spacesPlusPlus = spacesPlus + EZ.constant.spaces.substring(0,RZdisplayObject.INDENT_SIZE);

		var type = '';
		var isEmpty = true;
		var isObject = true;
		var isArrayElement = false;
		if (isArray && !isNaN(name))
			isArrayElement = true;
		var objAdjust = obj;

		//----- Determine type
		if (obj && obj.constructor == Array)
		{
			type = 'array';
			isArray = true;
			//objAdjust = {length: obj.length}
			//for (i in obj) {objAdjust[i] = i};
		}

		else if (obj && obj.constructor == Function)
			type = 'function';

		//----- Not called with object, display value of obj argument
		else if (typeof(obj) != 'object' || (indent==0 && obj === null))
			return getValue(obj);

		//----- Headings
		if (type) type += ' ';
		if (indent == 0)	//display for top level
		{
			if (isObject)
			{
				if (!name) name = '[' + type + 'object]: ';
				name = ' ' + EZ.formatdate('','time') + ' -- ' + name;
				RZdisplayObject.display += name + '\n';
				indent = 1;
			}
		}
		else
		{
			RZdisplayObject.display += spaces;
			if (isArrayElement)
				RZdisplayObject.display += '[' + name + ']: (' + type + 'object)\n';
			else
				RZdisplayObject.display += '(' + type + 'object): '
										 + EZ.stripConfigPath(name) + '\n';
			//RZdisplayObject.display += spaces + '[object' + type + ']: ' + name + '\n';
		}

		//----- Iterate through the elements in obj; NOTE: when typeof(obj)==function, no iteration takes place
		//		Use objAdjust defined above since for (i in obj) does not find array length property
		for (i in objAdjust)
		{
			// process OBJECT within obj (including functions)
			if (typeof(obj[i]) == 'object' || typeof(obj[i]) == 'function')		//expand nested object
			{
				if (overLimit()) continue;
				if (typeof(obj[i]) == 'function' && skipPrototype(Function)) continue;

				var prefix = '';
				if (RZdisplayObject.firstObject && !RZdisplayObject.lastTypeObject)
					prefix = RZdisplayObject.OBJECT_SPACING;

				if (depth >= RZdisplayObject.maxdepth)
					RZdisplayObject.display += RZdisplayObject.OBJECT_SPACING + '. . . maxdepth[' + RZdisplayObject.OBJECT_DEPTH + ']';
				else
				{
					RZdisplayObject.display += prefix + spaces + EZ.displayObjectProcess(obj[i],i,indent,isArray, depth+1);
					if (EZ.displayObject.display.substr(RZdisplayObject.display.length-2,1) != '\n')		//don't need newline if returned from nested call
						RZdisplayObject.display += RZdisplayObject.OBJECT_SPACING;
				}
				RZdisplayObject.firstObject = false;
				RZdisplayObject.lastTypeObject = true;
				isEmpty = false;
			}
			// process NON-OBJECT element within obj
			else
			{
				if (skipPrototype()) continue;		// if not displaying prototype variables
				if (isArray && isArrayElement) RZdisplayObject.display += spaces;		// extra indentation for array objects

				var value = getValue(obj[i]) 		// determine non-object value
				value = value.replace(/\n/gm,'\n'+spacesPlusPlus);	//apply indent to all lines
				value = RZdisplayObject.display += spacesPlus + i + ': ' + value + '\n';

				RZdisplayObject.lastTypeObject = false;
				isEmpty = false;
			}
		}

		//----- Done iterating through elements, if nothing displayed, indicate why
		if (isEmpty)
		{
			// extra indentation for array objects
			if (isArray) RZdisplayObject.display += spaces;

			// special values: null, function, empty
			if (obj === null)							//null object
				RZdisplayObject.display += spacesPlus + RZdisplayObject.MARKER + 'null' + RZdisplayObject.MARKER + '\n';

			else if (obj.constructor == Function)		//function (just show name and paramters)
			{
				results = obj.toString().match(/function\s*(\w*)\s*\(([^\)]*)\)/);
				if (results)
					RZdisplayObject.display += spacesPlus + results[0] + '...\n'
				else									//name not found (should not get here)
					RZdisplayObject.display += spacesPlus  + RZdisplayObject.MARKER+ 'unknown function' + RZdisplayObject.MARKER;
				RZdisplayObject.lastTypeObject = false;
			}
			else if (isEmpty)							//empty object (must test after function test above)
				RZdisplayObject.display += spacesPlus + RZdisplayObject.MARKER + 'no elements' + RZdisplayObject.MARKER + '\n';
		}
		// remove last newline (it gets added by caller)
		RZdisplayObject.display = EZ.displayObject.display.substring(0,RZdisplayObject.display.length-1);
		return RZdisplayObject.display;

		/*
		*	Return true if not displaying any more nested objects.
		*/
		function overLimit()
		{
			if (RZdisplayObject.quit || indent >= RZdisplayObject.OBJECT_LIMIT) return true;
			if (++RZdisplayObject.objectCount > RZdisplayObject.OBJECT_LIMIT)
			{
				if ( confirm(RZdisplayObject.OBJECT_LIMIT + ' objects expanded\n'
				   + 'Display ' + RZdisplayObject.OBJECT_LIMIT + ' more?'))
					RZdisplayObject.objectCount = 0;
				else
					RZdisplayObject.quit = true;
			}
			return false;
		}
		/*
		*	Return true if not displaying prototype functions or variables.
		*	type (optional: Function if checking for Function constructor
		*/
		function skipPrototype(type)
		{
			var status = false;
			/* was throwing exceptions (replaced with code below)
			if (!RZdisplayObject.SHOW_PROTOTYPE
			|| !obj[i].hasOwnProperty(obj))
				status = true;
			else
				status = false;
			*/

			//js error from RZupdateFieldList trace after EZ.clearlist(...)
			if (!RZdisplayObject.SHOW_PROTOTYPE
			&& obj && i && obj[i]
			&& obj[i].constructor
			&& obj[i].constructor.prototype)
			{
				if (type && type == Function
				&& obj[i].constructor.prototype.constructor == type)
					status = true;

				//else if (!type && obj[i].constructor.prototype == i)
				else if (!type
				&& (obj.constructor != Array || isNaN(i))	//added so array[0] displays
				&& obj[i].constructor.prototype == i)
					status = true;
			}
			return status;
		}
		/*
		*	determine non-object value
		*/
		function getValue(value)
		{
			var type = typeof(value);

			if (type === 'undefined')
				value = RZdisplayObject.MARKER + 'undefined' + RZdisplayObject.MARKER;

			else if (value === '')
				value = RZdisplayObject.MARKER + 'empty string' + RZdisplayObject.MARKER;

			else if (value === null)
				value = RZdisplayObject.MARKER + 'null' + RZdisplayObject.MARKER;

			else if (value === true)
				value = RZdisplayObject.MARKER + 'true' + RZdisplayObject.MARKER;

			else if (value === false)
				value = RZdisplayObject.MARKER + 'false' + RZdisplayObject.MARKER;

			else
			{
				if (type == 'string')
					value = EZ.stripConfigPath(value);
				if (value.length > RZdisplayObject.MAXLINE)
					value = value.substr(0,RZdisplayObject.MAXLINE) + '...' + RZdisplayObject.EOL_MARKER;
				else
					value += RZdisplayObject.EOL_MARKER;
			}
			if (RZdisplayObject.SHOW_TYPE && type !== 'undefined'
			&& value.indexOf(RZdisplayObject.MARKER + 'empty') != 0
			&& value.indexOf(RZdisplayObject.MARKER + 'null') != 0)
				value = '(' + type + '): ' + value;

			return value;
		}
	}
}
/*---------------------------------------------------------------------------------------------
Display script from filepath before and after range at lineNumber.
---------------------------------------------------------------------------------------------*/
EZdisplayScript = function EZdisplayScript(filepath,lineNumber,range)
{
	msg = '';

	// Display javascript at lineNumber, if requested
	while (filepath && lineNumber)
	{
		//----- Read script file
		var script = DWfile.read(filepath);
		if (!script) break;

		// make all lines endinde with \r only \n only or \r\n to just \n
		script = EZ.eolSame({script:script});

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
					RZdisplayScript.line = results[1];
					pointer = '\n->';
					pointerDash = '------------------------------------------';
					offsetLine = offset;
				}
				scriptNew = pointer + count + ': '
						  + results[1].replace(/\t/g,'    ') + '\n';

				scriptLine += pointerDash + scriptNew;
				if (EZ.trim(pointer) != '')
					scriptLine += '------------------------------------------\n'

				scriptArray.push({lineno:count, script:scriptNew});
				if (count > (lineNumber + range)) break;
			}
		}
		RZdisplayScript.script = scriptArray;

		// if there is script
		if (scriptLine)
		{
			var filepathDisplay = EZ.stripConfigPath(filepath)

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

			RZdisplayScript.filepathDisplay = filepathDisplay;
			RZdisplayScript.funcName = funcName;
		}
		break;
	}
	return msg;
}
/*---------------------------------------------------------------------------------------------
Return string of the form: YYYY-MM-DD_HH.MM.SS
---------------------------------------------------------------------------------------------*/
EZdateTime = function EZdateTime(date)
{
	if (!date) date = new Date();
	var str = date.getFullYear() + '-'
			+ EZ.right('0'+(date.getMonth()+1),2) + '-'
			+ EZ.right('0'+date.getDate(),2) + '_'
			+ EZ.right('0'+date.getHours(),2)  + '.'
			+ EZ.right('0'+date.getMinutes(),2)  + '.'
			+ EZ.right('0'+date.getSeconds(),2);
	return str;
}
/*---------------------------------------------------------------------------------------------
Format date as: mm-dd-yyyy hh:mm am/pm

Options is an optional String representing one of the following
	(default)		Return date and time if not 0
	datetime		Always return date and time
	date, dateonly	Return date only
	time, timeonly	Return time only


	if options not specified or any other value, return date (and time if not 12:00am)
---------------------------------------------------------------------------------------------*/
EZformatDate = function EZformatDate(theDate, options)
{
	var value = ''
	var theDateOrig = theDate;
	if (typeof options == 'undefined') options = ''

	if (!theDate) theDate = '';
	if (theDate.constructor != Date)
	{
		theDate = theDate ? new Date(theDate) : new Date();
		if (isNaN(theDate.getTime()))
		{
			//EZ.warn(theDateOrig,'Invalid Date');
			return theDateOrig + '';
		}
	}

	var hours = theDate.getHours() % 12
	if (hours == 0) hours = 12

	var year = theDate.getYear()			//js 1.1 compatible
	if (year < 1000) year += 1900			//broswer quirks
	if (year < 2000)
	{
		//see if the 4 digit year matches a string in the date field
		//if not then they we need to add 100 to the year
		if (fieldValue.indexOf(year.toString()) == -1)
			year += 100
	}

	var dateString = EZ.right('0'+(theDate.getMonth()+1).toString(),2) + '-'
	               + EZ.right('0'+theDate.getDate(),2) + '-'
	               + year

	var timeString = EZ.right('0'+hours.toString(),2) + ':'
                   + EZ.right('0'+theDate.getMinutes(),2) + ':'
                   + EZ.right('0'+theDate.getSeconds(),2)
                   + (theDate.getHours() < 12 ? 'am' : 'pm'); //no space to avoid wrap

	switch(options)
	{
		case 'datetime':
			value = dateString + ' ' + timeString
			break;

		case 'date':
		case 'dateonly':
			value = dateString
			break;

		case 'time':
		case 'timeonly':
			value = timeString
			break;

		default:
			if (theDate.getHours() == 0 && theDate.getMinutes() == 0)
				value = dateString
			else
				value = dateString + ' ' + timeString
			break;
	}
	return value;
}
RZformatdate = RZformatDate;
/*---------------------------------------------------------------------------------------------
Determine path and filename of current doc (should use: dreamweaver.getDocumentPath() )
---------------------------------------------------------------------------------------------*/
EZgetDocInfo = function EZgetDocInfo()
	{
	var sourceDOM = dw.getDocumentDOM("document");
		if (sourceDOM == null) return '';

	var pathname = sourceDOM.URL;
	dw.releaseDocument(sourceDOM);
	var fileInfo = {};
	fileInfo = EZ.getFileInfo(pathname)
	return fileInfo
}
/*---------------------------------------------------------------------------------------------
Following is test case for eolPattern
---------------------------------------------------------------------------------------------*/
EZeolSameTest = function EZeolSameTest()
{
	var html = 'line=0\n\nline=2 (line1 empty)\r\rline=4 (line3 empty)\nline=5\rline=6\r\n'
			 + 'line=7\r\nline=8\r\n';
	EZ.eolSame({html:html})
	var showlines = html.match(/(.*)\n/g);						//create array with each line
	delete showlines.input; delete showlines.index;				//remove clutter
	return showlines;
}
/*---------------------------------------------------------------------------------------------
Find the beginning and ending of the Revize Header HTML comment.
returns true if comments were found (comments returned in global commentCode)

Called by EZ.findComments() and RevizeTranslator

Assumes EZ.doc.source contains html source to be processed
Returns true if Revize doc (RevizeProperties exists)
---------------------------------------------------------------------------------------------*/
EZextractComments = function EZextractComments()
{
	//----- Re-determine document build everytime doc url changes
	//		(As of 08-20-2011, RZ.build only used by text inspector)
	if (RZ.doc.url != dw.getDocumentPath("document"))
	{
		RZ.doc.url = dw.getDocumentPath("document")

		RZ.doc.build = 0.0
		RZ.doc.newlist = true		// assume using new lists

		// use build 30 snippets unless page contains old lists
		if (EZ.doc.source.indexOf('RZlist1data') == -1 )
			RZ.doc.build = 0.30
		else
			RZ.doc.build = 0.27
	}

	//----- Re-determine see if newer list snippets also on if old version
	if ( typeof RZ.doc.build != 'undefined' && (RZ.doc.build*1) <= 0.27 )
	{
		if (EZ.doc.source.indexOf('rz.listsetup') == -1 )
			RZ.doc.newlist = false
		else
			RZ.doc.newlist = true
	}

	//----- Set Revize properties
	var endString=''
	var pattern = /(<%--\s{0,1}#RevizeProperties|<!-- #Revize.*?page head.*?)/
   	RZ.doc.revizeHeaderBeg = EZ.doc.source.search(pattern);
   	RZ.doc.revizeHeaderEnd = -1
   	if (RZ.doc.revizeHeaderBeg != -1)
   	{
		RZ.doc.revizeHeaderType = EZ.doc.source.substring(RZ.doc.revizeHeaderBeg,
		                                                  RZ.doc.revizeHeaderBeg+2)
		if (RZ.doc.revizeHeaderType == '<!') 	//old style
		{
			endString = '<!-- #end Revize -->'
			RZ.doc.propBeg = '<!--';
			RZ.doc.propEnd = '-->';
		}
		else									//new style
		{
			endString = '--%>'
			RZ.doc.propBeg = '\n';
			RZ.doc.propEnd = '\r\n';
		}
		RZ.doc.revizeHeaderEnd = EZ.doc.source.indexOf(endString,RZ.doc.revizeHeaderBeg)
	}

	//----- For compatibility with older calls, set old global variables
   	beginIndex = RZ.doc.revizeHeaderBeg
	endIndex = RZ.doc.revizeHeaderEnd

	//----- If Revize header NOT found
	if(RZ.doc.revizeHeaderBeg == -1
	|| RZ.doc.revizeHeaderEnd == -1
	|| RZ.doc.revizeHeaderBeg >= RZ.doc.revizeHeaderEnd)
	{
		RZ.doc.revizeHeader = "";	// Global holds Revize Header
		commentCode = "";			// global used by older calls
		return false;
	}
	else
	{
		RZ.doc.revizeHeaderEnd += endString.length

		RZ.doc.revizeHeader = EZ.doc.source.substring(	RZ.doc.revizeHeaderBeg,
		                                                RZ.doc.revizeHeaderEnd );
		commentCode = RZ.doc.revizeHeader;	// global used by older calls

		//----- If "//<script>" follows header, append to header offset
		RZ.doc.script = false;
		var results = EZ.doc.source.substring(RZ.doc.revizeHeaderEnd).match(RZ.constant.scriptPattern);
		if (results != null)
		{
			RZ.doc.revizeHeaderEnd += results[0].length;
			RZ.doc.script = true;
		}

		//----- if new style, check for MAC scenarios
		//		(even on windows since files could be transfered)
		if (RZ.doc.revizeHeaderType != '<!')
		{
			// if newlines (\n) exist, assume Mac line breaks using return (\r)
			if (EZ.doc.revizeHeader.indexOf('\n') == -1)
			{
				RZ.doc.propBeg = '\r';
				RZ.doc.propEnd = '\r';
			}
			// if no CRLF use LF as terminator
			else if (EZ.doc.revizeHeader.indexOf('\r\n') == -1)
				RZ.doc.propEnd = '\n';
		}
		return true;
	}
}
/*---------------------------------------------------------------------------------------------
Create folders for saveLocation if they do not already exist.
saveLocation is of the following form: file:///C|/revizenew/www/revize/demositeIII
---------------------------------------------------------------------------------------------*/
EZcreateFolders = function EZcreateFolders(saveLocation,msg)
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
				return EZ.alert(msg);
			}
		}
	}
	return true;
}
/*---------------------------------------------------------------------------------------------
Clear a list by setting all options to null.  Setting length does not do the job.
---------------------------------------------------------------------------------------------*/
EZclearList = function EZclearList(theList,options)
{
	if (typeof theList != 'object')
		return EZ.warn(theList,'RZclearList: Invalid menu/list');

	// clear current list
	if (!EZ.checkOptions(options,'noclear'))
	{
		for(var i=theList.options.length-1;i>-1;i--)
			theList.options[i] = null;
		theList.options.length = 0
	}

	// setup html if fastselect
	if (EZ.checkOptions(options,'fastselect'))
		EZ.selectInit(theList,options);
}
/*---------------------------------------------------------------------------------------------
Fast select options builder: add option
---------------------------------------------------------------------------------------------*/
EZselectOption = function EZselectOption(selectElement, text, value, isSelected)
{
	var name = EZ.selectValidate(selectElement, text, value);
	if (!name) return false;

	// add option to this active menu/list
	var selected = '';
	if (isSelected)
	{
		selected = ' selected';
		RZ.selectList[name].selected = true;
	}
	var html = '<option value="' + value + '"' + selected + '>' + text + '</option>\n';

	RZ.selectList[name].html += html;
	return true;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
EZattributeValue = function EZattributeValue( tag, key, defaultValue )
{
	if (tag.length == 0) return defaultValue;

	var value = tag[0].getAttribute(key);
	if (typeof value == 'undefined' || value == '')
		value = defaultValue
	return value;
}
/*---------------------------------------------------------------------------------------------
this function takes a string and removes any leading or ending blank spaces
---------------------------------------------------------------------------------------------*/
EZencodeSpecialHtml = function EZencodeSpecialHtml(tmpStr)
{
	tmpStr = tmpStr.split('"').join('&quot;')
	tmpStr = tmpStr.split('<').join('&lt;')
	tmpStr = tmpStr.split('>').join('&gt;')
	return tmpStr;
}
