/*--------------------------------------------------------------------------------------------------
Dreamweaver LINT options -- function below not called
--------------------------------------------------------------------------------------------------*/
/*global 
	EZ, e:true
*/
var e;
(function jshint_globals_not_used() {	//global variables and functions defined but not used
e = [
	RZloadjscssfile, e
]});
/*--------------------------------------------------------------------------------------------------
RZloadjscssfile(...)

original credit:
	http://stackoverflow.com/questions/3765364/javascript-how-to-inject-external-html-file-on-same-domain

callback credit:
	http://www.ejeliot.com/blog/109 however nogo for firefox

Arguments:
	filepath(s)	(required) string or string array containing filepath(s) to load
	type		(optional) type of file (css or js)
	callback 	(optional)	callback function

TODO:
	don't think callback works
--------------------------------------------------------------------------------------------------*/
function RZloadjscssfile(filepaths, filetypes, callback)
{
	var waiting = EZ('waiting');
	var type,fileref;
	if (RZloadjscssfile.isProcessing)	//will probably work with multiple instances
		return log('RZloadjscssfile called before prior files processed');
	
	RZloadjscssfile.isProcessing = true;
	RZfileloaded.startTime = new Date().getTime();

	if (!RZloadjscssfile.waitInterval) RZloadjscssfile.waitInterval = 500;
	if (!RZloadjscssfile.waitShowFiles) RZloadjscssfile.waitShowFiles = 5000;
	if (!RZloadjscssfile.waitTryLater) RZloadjscssfile.waitTryLater = 30000;

	if (!RZloadjscssfile.filesLoading) RZloadjscssfile.filesLoading = [];
	if (!RZloadjscssfile.scriptLoaded) RZloadjscssfile.scriptLoaded = {};

	//----- Get arguments
	filepaths = EZ.toArray(filepaths);
	if (filetypes == null || filetypes.constructor == Function)
	{
		callback = filetypes;
		filetypes = '';
	}
	RZloadjscssfile.callback = callback;

	//----- load each file...
	for (var i=0;i<filepaths.length;i++)
	{
		var filepath = filepaths[i];
		var filetype = filetypes;	//if single type for all files
		if (filetypes.constructor == Array)
		{
			if (i<filetypes.length)
				filetype = filetypes[i];
			else
				filetype = ''
		}

		//----- if type not specified, use file extension to determine type
		if (!filetype && filepath.lastIndexOf('.') != -1)
			filetype = filepath.substring(filepath.lastIndexOf('.')+1);
		if (!filetype) continue;	//no extension, ignore this file

		//----- get just filename (no path, no extension)
		var filename = filepath.substring(0,filepath.lastIndexOf('.'));
		if (filename.lastIndexOf('/') != -1)
			filename = filename.substring(filename.lastIndexOf('/')+1)

		if (filetype == 'css')
		{
			type = "text/css";
			fileref = document.createElement("link")
			fileref.setAttribute("rel", "stylesheet")
			fileref.setAttribute("type", type)
			fileref.setAttribute("href", filepath)
		}
		else if (filetype == 'js')
		{
			type = "text/javascript";
			fileref = document.createElement('script');
			fileref.setAttribute("type","text/javascript");
			//fileref.setAttribute("defer",true);		//don't think so, script must run
			fileref.setAttribute("src", filepath)

			//-----	FF and Chrome trigger onload but script may still be running; useful
			//		to shorten initial wait time; not sure if triggered when file not found
			if (typeof(fileref.onload) != 'undefined')
				fileref.onload = function() {RZfileloaded(fileref)};
			//fileref.onload = function() {RZfileloaded(fileref,true)};	//FF only
		}
		else	//will display error message
		{
			type = "unknown";
			fileref = {type:type, href:filepath};
		}

		//----- IE7 (plus ??) triggers loaded & complete events for js files
		//		Firefox / Chrome trigger onload BUT script may not have completed.
		//
		//		IE triggers event regardless of whether file is found (useful to stop waiting)
		//
		//		Don't believe any browser triggers events for css; If necessary, could probably
		//		wait for last selector to get applied (similar to javascript strategy).
		if (typeof(fileref.onreadystatechange) != 'undefined')
		{
			fileref.onreadystatechange = function() 	//IE 6 & 7 ??
			{
				if (this.readyState == 'complete' || this.readyState == 'loaded')
				{
					//debugger;
					RZfileloaded(fileref);
				}
			}
		}
		//----- Add the link or script tag to head to load the file
		if (type != 'unknown')
		{
			document.getElementsByTagName("head")[0].appendChild(fileref);
			RZloadjscssfile.filesLoading.push( {fileref:fileref,
												type:type,
												missing: false,
												waiting: false,
												filepath: filepath,
												filename: filename,
												callback:callback}
											 );
		}
	}
	RZfileloaded();
	return false;

	/*---------------------------------------------------------------------------------------------
	Hide loading layer after all files loaded
		check for file loaded every RZloadjscssfile.waitInterval seconds (default .5)
		after RZloadjscssfile.waitShowFiles seconds (default 5) display "waiting for..."
		after RZloadjscssfile.waitTryLater seconds (default 60) clear loading message,
			do not display calendar, put dim message to try later
	---------------------------------------------------------------------------------------------*/
	function RZfileloaded(filerefArg,isLoaded)
	{
		if (RZloadjscssfile.filesLoading.length === 0) return;

		var br = '<br/>';
		var file,fileref;
		var delayTime = 0;		//milliseconds before calling ourself (=0 no call to ourself);
		var now = new Date().getTime();
		var rules = document.all ? 'rules' : 'cssRules';
		var styleSheet = document.all ? 'styleSheet' : 'sheet';	//FF fileref property is sheet

		// All files are queued so when list is empty, call the callback
		if (typeof(filerefArg) != 'object') 	//FF quirk
		{
			filerefArg = null;
			isLoaded = false;
		}

		var isFilesDisplayed = false;
		var type;
		var filesWaiting = {};
		var filesMissing = {};

		//----- For files still loading...
		for (var f=RZloadjscssfile.filesLoading.length-1;f>=0;f--)
		{
			var isFileLoaded = false;
			file = RZloadjscssfile.filesLoading[f];
			fileref = file.fileref;

			// check if css file loaded
			try
			{
				if (file.type == 'text/css' && fileref && fileref[styleSheet])
				{
					// FF will throw exception if loading is incomplete
					if (fileref[styleSheet][rules] && fileref[styleSheet][rules].length > 0)
						isFileLoaded = true;
				}
			}
			catch (e)
			{
				filerefArg = null;
				EZ.techSupport(e)
			}

			// check if js file loaded
			if (file.type == 'text/javascript' && (isLoaded || RZloadjscssfile.scriptLoaded[file.filename]))
				isFileLoaded = true;

			if (isFileLoaded)
			{
				log('file loaded: ' + file.filepath);
				RZloadjscssfile.filesLoading.splice(f,1);	//remove loaded file from loading list
			}
			// display files after waiting waitShowFiles milliseconds (default 5 seconds)
			else
			{
				if (file.missing
				|| (filerefArg === fileref && file.type != 'text/javascript')
				|| now - RZfileloaded.startTime > RZloadjscssfile.waitTryLater)
				{
					isFilesDisplayed = true;
					if (!file.missing)
					{
						RZfileloaded.startTime = now;
						//if (file.waiting)	//if previously waiting, only show for half time
						//	RZfileloaded.startTime -= RZloadjscssfile.waitTryLater / 2;
					}
					file.missing = true;
					if (!filesMissing[file.type]) filesMissing[file.type] = [];
					filesMissing[file.type].push({type:file.type, filepath:file.filepath});
				}
				else if (file.waiting
				|| now - RZfileloaded.startTime > RZloadjscssfile.waitShowFiles)
				{
					isFilesDisplayed = true;
					if (!file.waiting)
						RZfileloaded.startTime = now;
					file.waiting = true;
					if (!filesWaiting[file.type]) filesWaiting[file.type] = [];
					filesWaiting[file.type].push({type:file.type, filepath:file.filepath});
				}
			}
		}

		//----- If all files loaded, call callback function
		if (RZloadjscssfile.filesLoading.length === 0)
		{
			//DCO 08-22-2015: clear message if any
			if (RZloadjscssfile.waiting)
			{
				waiting.style.display = 'none';
				RZloadjscssfile.waiting = false;
			}
			RZloadjscssfile.isProcessing = false;
			if (window.frameElement)
				window.title = '';

			if (RZloadjscssfile.callback)
			{
				log('all files loaded -- callback: ' + RZloadjscssfile.callback.name + '(...)');
				RZloadjscssfile.callback();
			}
		}

		//----- After waitTryLater (default one minute), display try later
		else if (now - RZfileloaded.startTime > RZloadjscssfile.waitTryLater)
		{
			RZloadjscssfile.isProcessing = false;
			waiting.style.display = 'block';
			waiting.className = 'unavailable';
			waiting.innerHTML = 'Some resources did not load' + br
							  + 'Clear browser cache or Try again later;' + br
							  + 'Contact Tech Support if this Persists';
		}

		//----- After RZloadjscssfile.waitShowFiles seconds or 404 error, display waiting or unavailable
		else if (isFilesDisplayed)
		{
			var html = '';
			delayTime = RZloadjscssfile.waitInterval;

			// t=0 for waiting files; t=1 for missing files (i.e. 404 error)
			for (var t=0;t<=1;t++)
			{
				var files = t===0 ? filesWaiting : filesMissing;
				for (type in files)
				{
					if (files[type].length === 0) continue;
					if (type == 'text/css')
					{
						if (t==1)
							html += br + '<b>Following Styles Unavailable:</b>' + br;
						else
							html += br + 'Waiting for following styles:' + br;
					}
					else
					{
						if (t==1)	//should not occur because no callback for script files??
							html += br + '<b>Following script file(s) unavailable:</b>' + br;
						else
							html += br + 'Waiting for following script file(s):' + br;
					}
					for (f=0;f<files[type].length;f++)
						html += files[type][f].filepath + br;
				}
			}
			if (html)
			{
				RZloadjscssfile.waiting = true;
				waiting.style.display = 'block';
			}
			waiting.innerHTML = html;
		}
		else
			delayTime = RZloadjscssfile.waitInterval;

		//----- Keep waiting if not called for specific file...
		if (delayTime > 0 && !filerefArg)
			setTimeout(RZfileloaded, delayTime);
	}
}
/*--------------------------------------------------------------------------------------------------
Display message in javascript console if available.

RETURNS:
	false as convenience for: return log(...)
--------------------------------------------------------------------------------------------------*/
function log(msg)
{
	var callerName = arguments && arguments.callee && arguments.callee.caller
				   ? arguments.callee.caller.name : '';
	if (window.console && console.log)
		console.log({caller:callerName, msg:msg});
	return false;
}