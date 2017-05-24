/*global 
EZfileToUrl,
EZ, dw:true, DWfile, e:true, g  */
var e;
(function jshint_globals_not_used() {	//global variables and functions defined but not used
e = [
e, g, dw, DWfile]
});
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.log = (function()
{
	EZ.defaultOptions.log = {					//default EZ.log.options
		active: false,
		pageTag: null,
		pendingCountTag: null,
		filters: { page: [], console: ['default'], trace:['default'] }
	}
	function EZlogItem(callerName, message)		//EZlogItem constructor
	{
		this.callerName = callerName;
		this.message = message;
		this.toString = function()
		{
			var str = '[' + callerName + '] ' + message.join(' ');
			return str;
		}
	}
	
	function EZlog()							//EZlog constructor
	{
		if (this instanceof arguments.callee)
		{
			this.active = false;
			this.history = [];					//processed log item
			this.pending = [];					//log items added when log not active
		//	this.callerNames = {};
			return;
		}										  //-----------------------------------\\
												 //----- NOT called as constructor -----\\
		if (!arguments.length) 					//---------------------------------------\\
			return EZ.log;						//return EZ.log.object if no arguments
			
		var args = [].slice.call(arguments)		//otherwise treat as EZ.log.add(...)
		var caller = this;
		return EZ.log.add.apply(caller, args);
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZlog.prototype.toString = function EZlog_toString()
	{
		var str = EZ.log.history.join('\n');
		return str;
	}
	//__________________________________________________________________________________________________
	/**
	 *	Add log item and display on page and console is not filtered.
	 *  arguments.callee.caller == EZ.log
		'.'.concat(callerName,' .default').ov();
	 */
	EZlog.prototype.add = function EZlog_add(callerName)
	{
		var args = [].slice.call(arguments);
		
		var callerName = EZ.getType(this) == 'String' ? this + ''
					   : (this != window && this != window.EZ) ? this.name
					   : arguments.callee.caller == EZ.log ? EZ.getCallerName(EZ.log)
					   : EZ.getCallerName(true);
					   
		var logItem = new EZlogItem(callerName, args);
		var options = EZ.options.get('log');
		
		var list = (options.active) ? 'history' : 'pending';
		var count = EZ.log[list].push(logItem);
		if (options.active)
			EZ.log.display(logItem);
		else if (options.pendingCountTag)
			options.pendingCountTag.title = EZ.s(count, '# pending messages');
				
		return logItem + '';
	}
	//__________________________________________________________________________________________________
	/**
	 *	clear all log items
	 */
	EZlog.prototype.display = function EZlog_display(logItem)
	{
		var callerName = logItem.callerName;
		var regex = new RegExp('(\\b' + callerName + '|\\bdefault\\b)', 'i')
		var filters = EZ.options.get('log.filters') || {};
		Object.keys(filters).forEach(function(logTarget)
		{
			if (!regex.test(filters[logTarget].join(' ')))
				return;
			switch (logTarget)
			{
				case 'console':
					return console.log.apply(window,['['+callerName+']'].concat(logItem.message));
				default:
					return EZ.opps(logTarget + ' log -- not implemented');
			}
		});
	}
	//__________________________________________________________________________________________________
	/**
	 *	Activate log
	 */
	EZlog.prototype.setActive = function EZlog_setActive(showPending)
	{
		if (!EZ.options.set('log.active', showPending !== false))
			return;
	
		var pending = 'EZ.log.pending'.ov([]);
		if (!showPending) 
			return pending.length;

		while (pending.length)
			EZ.log.display(pending.shift());
	
		EZ.hide(this.options.pendingCountTag);
	}
	//__________________________________________________________________________________________________
	/**
	 *	clear all log items
	 */
	EZlog.prototype.status = function EZlog_status(el)
	{
		var note = '';
		var status = {
			action: EZ.getCallerName() + note,
			active: this.options.active,
			counts: {history: this.history.length, pending:this.pending.length},
			filters: EZ.options.get('log.filters')
		}
		var msg = EZ.stringify(status,'*');
		
		if (EZ.isEl(el))
			EZ.displayMessage(msg, el);
		
		return status;
	}
	//__________________________________________________________________________________________________
	/**
	 *	clear all log items
	 */
	EZlog.prototype.clear = function EZlog_clear(isTrue)
	{
		if (isTrue === false) 
			return;
		
		var log = new EZlog();
		for (var key in log)
		{
			var o = log[key];
			if (typeof(o) != 'function')
				this[key] = o;
		}
	}	
	//==================================================================================================
	Object.keys(EZlog.prototype).forEach(function(key)
	{														//export / expose prototype functions
		var fn = EZlog.prototype[key];
		if (typeof(fn) == 'function')
			EZlog[key] = fn;
	});
	EZlog.clear();
	return EZlog;
})();
//________________________________________________________________________________________
/**
 *	
 */
EZ.log.test = function()
{	
	var msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, , rtnValue];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	exfn = function(results, testrun)
	{
		testrun.results = results = {results: results}
	}
	notefn = function(testrun)
	{
		e = testrun;
	}

	//EZ.test.skip(999)		//count to skip 
	//EZ.test.settings({group: 'persistant note'});
	//______________________________________________________________________________________

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = ''
	EZ.test.run( 'this is log message' )
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	//______________________________________________________________________________
	//EZ.test.run(-2, 		{EZ: {ex:-2	,	note:note	}})
	
	//______________________________________________________________________________
	return;
}
/*--------------------------------------------------------------------------------------------------
			if (!evalBtn) return EZ.evalError('field id=evalButton not defined');
			if (!scriptEl || typeof(scriptEl) != 'object')
				return EZ.evalError('field theForm.codeEvalScript not defined or form element');
		historyListTag: '',
		favoritesListTag: '',
		favoritesNameTag: '',

--------------------------------------------------------------------------------------------------*/
EZ.script = (function()
{
	EZ.defaultOptions.script = {			//default options
		
		name: 'EZ.script.options',
		version: '08-15-2016',

		listNames: ['history', 'favorites'],
		listTags: {},
		tags: {},
		
		listmaxsize: {history:50, favorites:100},
		
		format: 'EZtoString',
		formatOptions: { 
			tostring: {timestamp: false},
			stringify:{spaces:4} 
		},
		append: false,
		enterkey: true,
		saveall: false,						//true to save invalid script
		
		resultsmaxlines: '',
		resultsTarget: 'textarea',
		resultsTagStyles: {},				//used if resultsTag created
		resultsTagClassNames: ['textBox'],
		
		defaults: {String:'script', Element:'sourceTag'}
	}
	
	function EZscript(script)				//EZscript constructor
	{
		if (this instanceof arguments.callee)
		{								
			this.script = '';
			this.results = '';
			this.listOptions = {};
			return;
		}
		return EZ.script.run(script);		//not called as constructor
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZscript.prototype.toString = function()
	{
		var str = this.history.length.wrap('[',']') + ' history '
				+ this.favorites.length.wrap('[',']') + ' favorites'
				+ '\nlast script: ' + this.options.script;
		return str;
	}
	//__________________________________________________________________________________________________
	/**
	 *	
		var filename = EZ.constant.configPath + 'Shared/EZ/_browser.html';		
		var url = options.browserurl = this.options.browserurl || filename;
	 */
	EZscript.prototype.getBrowserTag = function EZscript_getBrowserTag(options)
	{
		var tag = this.options.tags.browserTag;
		if (tag && !EZ.isEl(tag))
			tag = this.options.tags.browserTag = EZ(tag);
		
		if (!tag || tag.undefined)
		{
			tag = this.options.tags.browserTag = EZ.createLayer('', 'A');
			tag.setAttribute('target', '_EZscript');
		}
		
		var url = options.browserurl || EZ.constant.configPath + 'Shared/EZ/_browser.html';
		tag.href = EZfileToUrl(url);
		
		var results = this.results.replace(RegExp(EZ.DOT, 'g'), '&#8226;');
		results = results.replace(/</g, '&lt;');
		results = results.wrap('<pre>');
		DWfile.write(url, results);
		
		return tag;
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZscript.prototype.getResultsTag = function EZscript_getResultsTag()
	{
		var tag = this.options.tags.results;
		if (tag)
			tag = EZ(tag);
		
		if (!tag || tag.undefined)				//create results tag if not defined or found
		{
			tag = this.options.tags.results
				= EZ.createLayer(this.options.resultsTagClassNames, {legacy:false});
		}
		return tag;
	}
	//______________________________________________________________________________________________
	/**
	 *
		Run eval on specified Javascript; display results with EZ.displayObject()
		
		Required fields: codeEvalScript, evalButton, resultEl
		Optional field: codeEvalHistory
		
		Arguments:
			resultsEl 	(required) form field for eval results
			resultsLines (optional) use trace if results no lines exceeds
		
		// move off eval input field to update value of codeEvalScript field
		//evalBtn.focus();


		//did not work before but was "theForm..." NOT "document.theForm..."
		// onFocus="setTimeout('document.theForm.codeEvalScript.select()"
		// just put trash before script field and remove onFocus() handler
		// restore onFocus() to eval script field in 1/2 sec, field gets focus now
		setTimeout(function() {theForm.codeEvalScript.onfocus="this.onfocus='';"
								+ "setTimeout('theForm.codeEvalScript.select()',10)"}, 500);
		
		//-------------------- done -------------------\\
		//if (scriptEl && scriptEl.id) setTimeout(scriptEl.id + '.focus()',10)
		//---------------------------------------------//
		if (el && !EZ.isEl(el))
			el = EZ.get(el)
		if (el && el.undefined)
			el = '';
	 */
	EZscript.prototype.run = function EZscript_run(el)
	{
		var options = EZ.options(el, this.options);
		
		el = options.sourceTag;								//TODO: alternative script tag
		var scriptTag = options.scriptTag;
		var script = options.script ? options.script
				   : (el ? EZ.get(el) : '') || (scriptTag ? EZ.get(scriptTag) : '');
		options.sourceTag = EZ.el;
		script = options.script = script.trim().trimPlus(';');
		
		if (!script)
			return EZ.displayMessage('EZ.script.run(): no script found', el);
			
		else if (scriptTag && scriptTag != el)				//history or favorite
			EZ.set(scriptTag, script);

		var results,
			isException = false,
			format = /(toString|stringify)/i.test(options.format) ? options.format : 'none',
			formatOptions = '.formatOptions.'.concat(format).ov(options,{}),
			resultsTarget = options.resultsTarget,
			resultsEl = (resultsTarget == 'textarea') ? this.getResultsTag(options) : '';
		try
		{	
			//--------------------------------------------------------------------
			results = eval('results=' + script /* script */);
			
			results = format.includesIgnoreCase('toString') 	//EZ.toString
				  ? EZ.toString(results, EZ.runScript.options.tostring)

				  : !format.includesIgnoreCase('stringify') 	//no formatting
				  ? results.toString().trim().replace(/\t/g, '    ')

				  : format.includesIgnoreCase('EZ') 			//EZ|JSON.stringify
				  ? EZ.stringify(results, formatOptions)
				  
				  : JSON.stringify(results, null, formatOptions.spaces || 4);
			//----------------------------------------------------------------------			
		}
		catch (e)
		{
			isException = true;
			results = e.name + ': ' + e.message;
		}
		var value = results;
		value = EZ.formatTime() + ' eval() results'
			  + ' (format: ' + format + '):\n' + value
		
		var maxlines = options.resultsMaxlines || 0;
		if (resultsEl && maxlines && value.count('\n') > maxlines)
		{														//or not all results shown
			EZ.log({script:script, format:format, results:value});
			var lines = value.split('\n');
			lines.length = maxlines;
			lines.push('EZ log contains full results');
			value = lines.join('\n')
		}
		
		if (!options.append)
			value+= '\n'.concat(this.results || '').trim();

		switch (resultsTarget)
		{
			case 'trace': 	
			{
				this.results = results;
				EZ.trace( {script:script, format:format, results:results}, true);
				value = 'runScript results (also in trace log):\n' + value;
				break;
			}
			case 'browser': 	
			{
				this.results = value;				
				var tag = this.getBrowserTag(options);		//writes value to browser url
				tag.click();
				break;
			}
			case 'textarea': 	
			{
				this.results = value;				
				EZ.set(resultsEl, value);
				EZ.show(resultsEl, 'all');
				setTimeout(function()
				{
					var y = EZ.getBrowserOffsets().scrollY;
					resultsEl.scrollIntoViewIfNeeded();
					if (y != EZ.getBrowserOffsets().scrollY)
						window.scrollBy(0,25);
				},500);
				break;
			}
			default:	return EZ.oops('unknown resultsTarget: ' + resultsTarget)
		}	
		
		if (!isException || options.saveall)
		{
			this.updateLists(options);
			this.script = script;
			this.saveData();
		}
		return value;
	}
	//__________________________________________________________________________________________________
	/**
	 *	
		var deleteList = listOptions.values.remove(values);
			listOptions.values.splice(idx,1);
			listOptions.values.splice(idx,1);
	 */
	EZscript.prototype.updateLists = function EZscript_updateLists(options)
	{
		var tag, text, value, timestamp = EZ.formatDate();
		if (this.script != options.script)
		{
			_updateList('history', options.script, timestamp);
			tag = options.tags.optionTime
			if (tag)
				EZ.set(tag, value);
		}
		text = options.script.replace(/([\w.()]+?)(\s|$)/, '$1 ' + timestamp)
		var isFav = options.sourceTag == options.listTags.favorites
		if (isFav)
			_updateList('favorites', text, options.script);
		tag = options.tags.addFavorite;
		if (tag)
			EZ.addClass(tag, 'dim', isFav)
		tag = options.tags.favoritesName;
		if (tag)
			EZ.set(tag, text);
		//______________________________________________________________________________________________
		/**
		 *
			//var valueList = [options.script].concat(listOptions.valueList);
//			var deleteList = listOptions.textList.remove(textList)
		 */
		function _updateList(name, defaultText, defaultValue)
		{
			var listOptions = EZ.script.listOptions[name];
			var textList = [options.script].concat(listOptions.textList).removeDups();
			textList.length = Math.min(textList.length, options.listmaxsize[name] || 20);
			
			var valuesList = [];
			var optionsList = [];
			textList.forEach(function(text)
			{
				var idx = listOptions.textList[text];
				var opt = (idx === undefined) ? [defaultText, defaultValue]
						: listOptions.optionsList[idx];
				valuesList.push(listOptions.valueList[idx] || defaultValue || defaultText);
				optionsList.push(opt);
			});
			listOptions.valuesList = valuesList;
			listOptions.optionsList = optionsList;
			text = optionsList[0][0];
			value = optionsList[0][1];
			
			var tag = options.listTags[name];
			if (tag)							
			{									// if history dropdown, update with this script
				tag = EZ(tag);
				if (!tag.undefined)
					listOptions = EZ.displayDropdown(tag, optionsList, defaultValue);
			}
		}
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZscript.prototype.remove = function EZscript_remove(list)
	{
		var tag = EZ(list);
		if (tag.tagName != 'SELECT')
			return EZ.oops('specified SELECT not found', list)
		
		if (tag == EZ(this.historyListTag))
			this.history = [];
		
		else if (tag == EZ(this.favoritesListTag))
			this.favorites = [];
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZscript.prototype.removeAll = function EZscript_removeAll(list)
	{
		var tag = EZ(list);
		if (EZ.getTagType(tag) == 'text')
			return tag.value = '';
			
		else if (tag.tagName != 'SELECT')
			return;
		
		EZ.clearList(tag, 'fastclear')
		
		if (tag == EZ(this.options.listTags.history))
			this.history = [];
		
		else if (tag == EZ(this.options.listTags.favorites))
			this.favorites = [];
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	EZscript.prototype.runOnEnterKey = function EZscript_runOnEnterKey(el,isTrue)
	{
		EZ.script.options.enterkey = isTrue;
		var tag = EZ(el);
		if (!tag)
			return EZ.oops('Enter key tag not specified or not found', el);
		
		if (!isTrue)
			return tag.onkeydown = null;
			
		tag.onkeydown = function(evt)
		{
			var keyCode = (window.event) ? event.keyCode : evt.keyCode;
			if (keyCode != 13) 				//bail when enter key NOT pressed
				return true;					

			EZ.event.cancel(evt, true);		//otherwise cancel evt defaultAction and bubble
			return EZ.script.run();			//then run script
		}
	}
	//__________________________________________________________________________________________________
	/**
	 *	called after page loaded -- before <body onload="...">
	 */
	EZscript.prototype.loadData = function EZscript_loadData()
	{
		try
		{													//create EZ.script.options from defaults
			var options = EZ.script.options = EZ.options(EZ.defaultOptions.script);		
			
			var json = localStorage.getItem('EZ.script.savedData')
			var savedData = json ? JSON.parse(json) : {}	//get savedData if available
			if (savedData.version != options.version)
				savedData = {version: options.version, timestamp:''};
			savedData.listValues = savedData.listValues || {}
			savedData.listOptions = savedData.listOptions || {};
			savedData.fieldValues = savedData.fieldValues || {};
			
			var log = EZ.field.add(savedData.fieldValues);	//restore saved fieldValues
			console.log('EZscript.loadData', 'restored fieldValues', log);
			
			log = EZ.field.add(['EZscript']);				//add fields with default values (not saved)
			console.log('EZscript.loadData', 'all EZscript fields', {log:log});
			
			log = EZ.event.trigger(['EZscript']);			//fire events to initialize EZ.script.options
			console.log('EZscript.loadData', {'onload events':log})
			
			setTimeout(function()							//after events run...
			{
				options.listNames.forEach(function(name)	//populate saved list(s) options
				{											//...and select save values
					var tag;
					var list = options.listTags[name];
					if (list)
					{
						var listValue = savedData.listValues[name] || EZ.get(list);
						var listOptions = '.'.concat(name,'.optionsList').ov(savedData.listOptions)
									   || [].slice.call(list.options);
						EZ.script.listOptions[name] = EZ.displayDropdown(list, listOptions);
						EZ.set(list, listValue); 
						tag = options.tags.timestamp
						if (tag)
							EZ.set(tag, listValue);
						
					}
				});
				EZ.script.saveData()
			}, 0 );
		}
		catch (e)
		{
			return EZ.oops(e);
		}
	}
	//__________________________________________________________________________________________________
	/**
	 *	
			var tags = document.getElementsByTagName('select');
			var lists = EZ(['EZscript'], tags);		//gets some <input> tags but no worries
			var selectValues = EZ.get(lists);
			
			var listValues = {};
			var listOptions = {};
			this.options.listNames.forEach(function(name)	//get list(s) options
			{												//...and select save values
				var list = EZ.script.options.listTags[name];
				if (list)
				{
					listValues[name] = EZ.get(list);
					listOptions[name] = [].slice.call(list.options);
				}
			});
	 */
	EZscript.prototype.saveData = function EZscript_saveData()
	{
		try
		{												//get non-default fieldValues
			var	fieldValues = EZ.field.getChangedValues(['EZscript']);
			console.log('EZscript.saveData', 'saved fieldValues', fieldValues);
			
			EZ.script.options.timestamp = EZ.formatDate();
			EZ.script.savedData = {
				listValues: EZ.get(this.options.listNames).fieldValues,
				listOptions: this.listOptions,
				fieldValues: [].sortPlus.call(fieldValues),
				version: this.options.version
			}
			var json = JSON.stringify(EZ.script.savedData);
			localStorage.setItem('EZ.script.savedData', json);
			if (EZ.script.options.tags.timestamp)
				EZ.set(EZ.script.options.tags.timestamp, '@ &nbsp;&nbsp;'+ EZ.script.options.timestamp);
		}
		catch (e)
		{
			EZ.oops(e);
		}
	}
	//==================================================================================================
	var fn = new EZscript();
	for (var key in fn)
		EZscript[key] = fn[key];
		
	EZ.event.add(window, 'onload', EZscript.loadData);
	return EZscript;
})();
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
if (EZ && EZ.global && EZ.global.setup) EZ.global.setup('EZ', 'EZdebug');
