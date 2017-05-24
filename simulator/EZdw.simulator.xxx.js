// created by EZstartup.htm: Thu May 28 2015 13:10:58 GMT-0400 (Eastern Daylight Time)
if (typeof EZ == 'undefined') EZ = {};
EZ.simulatorConfig = {
	appName: 'Adobe Dreamweaver CC 2014',
	version: 'Dreamweaver CC 2014.1',
	configPath: 'C:/Users/Dell/AppData/Roaming/Adobe/Dreamweaver CC 2014.1/en_US/Configuration/',
	technology: 'jsp',
	ajaxPath: 'Shared/EZ/simulator/EZdw.simulator.',
	simulatorPath: 'C:/Users/Dell/AppData/Roaming/Adobe/Dreamweaver CC 2014.1/en_US/Configuration/Shared/EZ/simulator/',
	simulatorConfigFile: 'C:/Users/Dell/AppData/Roaming/Adobe/Dreamweaver CC 2014.1/en_US/Configuration/Shared/EZ/simulator/EZdw.simulator.config.js',
	domain: 'http://localhost:8080/revize/dw.Configuration/'
}
function EZsimulatorLoad()
{
	var fileref = document.createElement('script');
	fileref.setAttribute("type","text/javascript");
	fileref.setAttribute("src", EZ.simulatorConfig.domain + '/Shared/EZ/simulator/simulator.core.js');
	document.getElementsByTagName("head")[0].appendChild(fileref);
}
if (typeof dw == 'undefined')		//if NOT DW enviornment
{
	if (window.addEventListener) window.addEventListener("load", EZsimulatorLoad, false);
	else if (window.attachEvent) window.attachEvent("onload", EZsimulatorLoad);
}
