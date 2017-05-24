/*global 
EZdisplayCaller,

EZ, dw:true, DWfile, e:true, g  */
var e;
(function jshint_globals_not_used() {	//global variables and functions defined but not used
e = [

e, g, dw, DWfile]
});

/*---------------------------------------------------------------------------
Add message to trace queue for display by EZtrace.html
Deletes messages already diplayed, more than hour old or more than last 500.

if 2 arguments and 1st (heading) can be options
----------------------------------------------------------------------------*/

EZ.trace = function EZtrace(heading, text, options)
{
	var rtnValue = '';
	var timeout = EZ.trace.save;
	//.........................................
	while (EZ.start({lock:true}))
	{
		//.....................................
//		try
		{
			EZ.trace.options = EZ.trace.options ||
			{
				mode: false,
				name: location.pathname.replace(/.*\/(.*)\..*/, '$1'),
				maxsize: 50,
				hiddensize: 10,			//TODO:
				format: 'EZ.toString'
			}
			
			  //---------------------------\\
			 //----- process arguments -----\\
			//-------------------------------\\
			switch (arguments.length)
			{
				case 0: return;
				case 1: 
				{
					if (typeof(heading) == 'boolean')		//if boolean, turn on or off trace
					{
						heading = setMode(heading) ? '@trace enabled' : '';
						text = options = '';
					}
					else if (heading.startsWith('@'))
					{
						text = options = '';
					}
					else
					{
						text = heading;
						heading = options = '';
					}
					break;
				}
				case 2: 
				{
					if (EZ.isOptions(heading, true))
					{
						options = heading;
						heading = '';
						break;
					}
				}
			}
			var formattedTime = traceSetup();
			
			options = EZ.getOptions(EZ.trace.options, options);
			if (heading.startsWith('@'))
				options.clear = true;

			  //----------------------------\\
			 //----- append new message -----\\
			//--------------------------------\\
			var msg = {
				time:		formattedTime, 
				caller: 	EZdisplayCaller ? EZdisplayCaller() : '',
				heading:	heading.toString(), 
				text:		text, 
				mode:		options.mode
			}
			if (options.stacktrace)
				msg.stackTrace = EZ.getStackTrace().slice(4);
			
			EZ.trace.messages = EZ.trace.messages || [];
			EZ.trace.messages.push(msg);
			timeout = EZ.trace.save;
			
			rtnValue = EZ.trace.messages.length + ' queued messages'
					 + (!options.mode ? ' (trace not enabled)' : '');
			
		}
//		catch (e)
//		{
//			EZ.techSupport(e);
//		}
		//.....................................
		break;
	} 
	//=========================================================================================
	return EZ.finish(rtnValue, {timeout:timeout});	//calls save after no activity for 1 second
	//=========================================================================================
	//.........................................
	/**
	 *	
	 */
	function traceSetup()
	{
	//	EZ.trace.time = EZ.date();
	//	var formattedTime = EZ.trace.time.toString();

		EZ.trace.time = new Date()
		var formattedTime = EZ.formatDate();

		if (EZ.trace.count) 
			EZ.trace.count++;
		else
		{
			EZ.trace.count = 1;
///			EZ.trace.options = getUpdatedOptions();
			EZ.trace.options.time = formattedTime;
			EZ.trace.mode = EZ.trace.mode || EZ.trace.options.mode;
		}
		return formattedTime;
		//_____________________________________________________________________________
		/**
		 *	merge global, saved and call options
		 */
		function getUpdatedOptions()
		{
			var savedOptions = EZ.ls.get('EZtrace.options', {});	//updated by us
//			var savedTime = EZ.date(savedOptions.time);
			var savedTime = new Date(savedOptions.time).getTime();
			var traceTime = new Date(savedOptions.time || 0).getTime();
			var traceOptionsTime = new Date(EZ.trace.options.time || 0).getTime();
			
			if (isNaN(savedTime)
			|| savedTime < traceTime - (1000 * 60 * 60 * 24)		//EZ.trace.time.addDays(-1)
			|| savedTime < traceOptionsTime)						//EZ.trace.options.time)
				savedOptions = {};
			
			var displayUpdates = EZ.trace.displayUpdates || {};		//updated by EZtrace.html
			var updatedOptions = displayUpdates.options || {};
			
//			var updatedTime = EZ.date(updatedOptions.time);
			var updatedTime = new Date(updatedOptions.time);
			if (isNaN(updatedTime)
			|| updatedTime < traceTime + (1000 * 60 * 60)			//EZ.trace.time.addHours(-1)
			|| updatedTime < traceOptionsTime						//EZ.trace.options.time
			|| updatedTime < savedTime)								//savedTime may be invalid ??
				updatedOptions = {};
	
			return EZ.mergeAppendOnly(EZ.trace.options, savedOptions, updatedOptions)
		}
	}
	/**
	 *	
	 */
	function getMode(options)
	{
		return EZ.trace.mode || options.mode || false;
	}
e = getMode;
	/**
	 *	
	 */
	function setMode(mode)
	{
		if (EZ.trace.options.mode != mode)
		{
			EZ.trace.options.mode = mode;
			EZ.trace.options.time = EZ.formatDate();	//EZ.date() + '';;
		}
		return EZ.trace.mode = mode;
	}
}
/*----------------------------------------------------------------------------------
EZ.trace.save()

----------------------------------------------------------------------------------*/
EZ.trace.save = function EZtrace_save()
{
	/**
		displayUpdates = {							//only updated by EZtrace.html
			time: 'formattedDateTime'				//time all groups updated
			groups: {
				name: {
					time: 'formattedDateTime'		//time messages displayed
					options: {						//only if updated
						time: "formattedDateTime",	//time options updated by EZtrace.html
						key: value,
						...
					}
				}
			}
		}
	 */
	EZ.trace.displayUpdates = EZ.ls.get('.EZtrace.displayUpdates', {groups:{}});
	//var displayTime = EZ.date(EZ.trace.displayUpdates.time || null);
	var displayTime = new Date(EZ.trace.displayUpdates.time);
	if (isNaN(displayTime))
		displayTime = new Date();
		
	var displayUpdates = getDisplayUpdates();
	var group = '.'.concat(EZ.trace.options.name,'=').ov(displayUpdates.groups, {});
	
//	displayTime = EZ.date(group.time || null) || displayTime;
	var dt = new Date(group.time)
	displayTime = (isNaN(dt)) ? displayTime : dt;
	
	var messages = EZ.trace.messages || [];
	if (messages.length)						//delete messages already displayed
	{											
//		while (messages.length && EZ.date(messages[0].time) < displayTime)
		while (messages.length && new Date(messages[0].time).getTime() < displayTime.getTime())
			messages.shift();				
	}
	
		
	  //-------------------------------------\\
	 //----- prune and save traceUpdates -----\\
	//-----------------------------------------\\
	/**
		traceUpdate = {								//only updated by EZ.trace.save()
			time: 'formattedDateTime'				//latest time updated by any html page
			pages: {
				name: {
					time: 'formattedDateTime'		//time group updated
					options: {						//only if updated
						time: "formattedDateTime",	//time options updated by html page
						key: value,
						...
					}
					messageCount: #
				}
			}
		}
	 */
	if (displayTime)
	{
		EZ.trace.traceUpdates = EZ.ls.get('.EZtrace.traceUpdates', {groups:{}});
		var traceUpdates = getTraceUpdates()
		
		var formattedTime =  EZ.trace.time.toString('timestampLong');
		traceUpdates.time = formattedTime; 
		traceUpdates.groups[EZ.trace.options.name] = {
			time: formattedTime,
			options: EZ.trace.options,
			messageCount: EZ.trace.messages.length
		}
		
		for (var name in traceUpdates.groups)
		{
//			var displayTime = displayUpdates[name];
			var group = traceUpdates.groups[name];
			if (!group) continue;
			
			//var time = RZtime(group.time)
			var time = new Date(group.time || 0).getTime();
			var traceTime = new Date(EZ.trace.time || 0).getTime() - (1000 * 60 * 60);
			if (!time || time < traceTime)	//EZ.trace.time.addHours(-1))	
				delete traceUpdates.groups[name];
		}
	}
	
	EZ.ls.set('.EZtrace.updates', EZ.trace.traceUpdates);
	EZ.ls.set('EZtrace.messages', messages);
	
	//_____________________________________________________________________________
	/**
	 *	
	 */
	function getDisplayUpdates()
	{
		var displayUpdates = EZ.trace.displayUpdates;
		
		return displayUpdates;
	}			
	
	//_____________________________________________________________________________
	function getTraceUpdates(displayUpdates)
	{
e = displayUpdates;		
		var traceUpdates = EZ.trace.traceUpdates;
		return traceUpdates;
	}
}
