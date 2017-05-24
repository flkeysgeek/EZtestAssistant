/*---------------------------------------------------------------------------------------
Lightweight script containing EZ dw simulator constants and code to load simulator api
if not loaded when html page loaded in browser instead of DW enviornment.
---------------------------------------------------------------------------------------------*/
if (typeof(EZ) == 'undefined') EZ = {};
EZ.simulator = {
	
	/**
	 *	constants
	 */
	domain: '',
	ajaxPath: 'Shared/EZ/simulator/EZsimulator.',
	apiFile: 'Shared/EZ/simulator/EZsimulator.api.js',
	settingsFile: 'startup/EZsimulator.settings.js',
	settings: {},
	version: '2015-06-16',
	
	/**
	 *	Load config file
	 */
	init: function()
	{
		if (location.href.indexOf('file:') == 0)
			alert('dw.simulator only available via http://\n\nNOT ' + unescape(location.href));
		
		var results = location.href.match(/((http|file).*?\/)*(commands|floaters|menus|inspectors|logs|objects|shared|translators|ExtractFunctions)\//i);
		if (!results) return;
		EZ.simulator.domain = results[1];

		var src = EZ.simulator.domain + EZ.simulator.settingsFile;
		var fileref = document.createElement('script');
		fileref.setAttribute("type","text/javascript");
		fileref.setAttribute("src", src);
		document.getElementsByTagName("head")[0].appendChild(fileref);
	},
	
	/**
	 *	Save/process settings then load EZ simulator api script.
	 *	Called from last line of .../settings.js after it loads.
	 */
	loadAPI: function()
	{
		for (var key in this.settings)				//copy settings to top level
			this[key] = this.settings[key];
			
		if (EZ.simulatorAPI != 'loaded')
		{											//load EZsimulator.api.js
			var src = this.domain + this.apiFile;		
			var fileref = document.createElement('script');
			fileref.setAttribute("type","text/javascript");
			fileref.setAttribute("src", src);
			document.getElementsByTagName("head")[0].appendChild(fileref);
		}
		else if (EZ.simulatorAPI != 'initialized')
		{
			DW.init();
		}
	},
	/**
	 *	Create or update .../EZsimulator.settings.js 
	 */
	saveSettings: function(settings,logNote)
	{
		var json = '';
		for (var o in settings)
			json += 'EZ.simulator.settings.' + o + "='" + settings[o] + "';\n";
		json += "if (!window.dw || dw.isNotDW) EZ.simulator.loadAPI();";
	
		logNote = 'EZ.simulator.settings' + (logNote || 'update');
		if (dw.log)
			dw.log(logNote, this.settingsFile);
	
		var fileURL = settings.configPath + this.settingsFile;
		var status = DWfile.write(fileURL, json);
		return 'DWfile.write=' + status;
	}
}
//----- Initailize and load EZ dreamweaver simulator if page opened in browser
if (!EZ.simulator.domain		// && EZ.simulatorAPI ??
&& (!window.dw || dw.isNotDW))
{
	EZ.simulator.init();
	//if (window.addEventListener) window.addEventListener("load", EZ.simulator.init, false);
	//else if (window.attachEvent) window.attachEvent("onload", EZ.simulator.init);
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
if (EZ && EZ.global && EZ.global.setup) EZ.global.setup('EZ', 'EZsimulator');
