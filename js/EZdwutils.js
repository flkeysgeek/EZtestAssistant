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
		var tags = document.getElementsByTagName('*');
		for (var i=0; i<tags.length; i++)
		{
			var el = tags[i];
			if (!el.style) continue;

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
			var form = EZgetParent(field,'form');
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
refresh floater by reloading extensions
---------------------------------------------------------------------------------------------*/
function EZrefreshFloater()
{
	dw.reloadExtensions();
}
