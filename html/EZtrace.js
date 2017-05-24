/*global 
EZ, DWfile,

e:true, g:true, dw:true, f:true
*/
var e = null;
(function jshint_noref() {[	//global variables and functions defined but not referenced
processAction, filterToggle, changeSettings, 
resetDisplayerUpdates,
deleteTraceUpdates,

e, g, dw, DWfile]});
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
g = {};		//legacy -- very few references except filters not yet refactored
g.fnAll = 'fn_-ALL-';
f = {};		//fields -- initialized by setup() > loadFieldValues() > EZ.field.add()
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function resize()
{
	g.messagesOffset = f.controls.clientHeight + 4;
	f.messagesWrap.style.marginTop = g.messagesOffset + 'px';
	f.messagesWrap.style.height = f.body.clientHeight - g.messagesOffset;
}
/*---------------------------------------------------------------------------------------------
process html page events: onclick, onhange, etc...
---------------------------------------------------------------------------------------------*/
function processAction(evt)
{
	evt = evt || window.event;
	var evtType = '.type'.ov(evt,'').toLowerCase();	//event type or blank if not event
	var x = evt.pageX || '';
	var y = evt.pageY || '';
	
	var el = '.srcElement'.ov(evt, {});				//el from evt or empty object if no event
	var id = el.id || el.name || '';
	var field = el.EZfield;							//field if defined otherwise undefined
	var tagName = (el.tagName || '').toLowerCase();	
	var tagType = EZ.getTagType(el) || tagName;
	
	var className = (el.className || '').trim();
	var classList = el.classList ? [].slice.call(el.classList) : EZ.toArray(className, ' ');
	
	var title = el.title || '';
	var alt = el.getAttribute('alt') || title;		//pseudo key
	var value = el.value || '';						//simple value
	var href = el.href || '';
	var src = el.src || '';
													//DW lint ...pseudo references...
	[evtType, x, y, id, field, className, classList, alt, title, tagName, tagType, href, src, value];
	
	if (evtType.includes('click'))					//if click event. . .
	{ 
		if (/(text|select|option)/.test(tagType))	//ignore for text or select-[one|multiple]
			return true;							//use field pseudo event
		
		if (el.onclick != null 						//ignore if onclick defined and not this fn
		&& !/.*?\{\s*\}$/.test(el.onclick) 
		&& !(el.onclick+'').includes('processAction'))
			return true;							//...run onclick code
	}
	if (evt.code == 'Enter' && el.onkeydown)		//wait for pseudo event triggered by enter key ??
		return true;
													//==================
	if (!tagName) 									//bail if no element
		return true;								//==================
	
	if (classList.includes('goto'))
		goto(el);
	
	else if (classList.includes('pause'))
		togglePause(evt)
	
	else if (classList.includes('filter'))
		filterChange(el);
	
	else if (id == 'pageListReset')
		updatePageList(true);

	else if (/(pageList|addedMessages)/.test(id))
		pageChange(id);
	
	else if (/(showTraceOff|hideTraceOff)/.test(id))
		updateTraceOffMessages(id);
	
	else if (/(functionList)/.test(id))
		functionChange(el);
	
	else if (alt == 'clear')
	{
		clearMessages();
		updatePageList();
	}
	else if (classList.includes('traceOption'))
	{
		if (alt == 'traceFormat')
			formatChange(el);
		traceOptionChange(alt, EZ.get(el));	
	}
		
	if (classList.includes('opt'))					//save updated settings in case of crash
		saveFieldValues();
		
	//EZ.event.cancel(evt,true);
}
/*---------------------------------------------------------------------------------------------
get or create EZ.trace._displayerData
---------------------------------------------------------------------------------------------*/
function getDisplayerData()
{
	var displayerData = EZ.trace._displayerData;
	if (!displayerData)
	{
		//==========================================================================
		if (EZ.debug())				//this data not shared
			displayerData = EZ.store.get('.EZtrace.displayerData$') 	
		//==========================================================================
		if (!displayerData)
			displayerData = EZ.clone(g.defaults._displayerData, false);
		
		g.counts = displayerData.addedList = EZ.counts(displayerData.addedList);
		EZ.trace._displayerData = displayerData;
	}
	return displayerData;
}
/*---------------------------------------------------------------------------------------------
return pageData for specified or activePageName -- create if new page and add to pageDataList
---------------------------------------------------------------------------------------------*/
function getDisplayerPageData(pageName)
{
	pageName = pageName || getActivePageName();
	
	var displayerData = getDisplayerData();
	var pageData = displayerData.pageDataList[pageName];
	if (!pageData)								//if new page, initialize to default values
	{											//and add to displayerData.pageDataList			
		pageData = EZ.clone(g.defaults.pageData, false);
		pageData.name = pageName;
		pageData.counts = EZ.clone(g.defaults.pageDataCounts, false);
		
		displayerData.pageDataList[pageName] = pageData;
		//setActivePageName(pageName);			//add new page to dropdown
	}
	return pageData;
}
/*---------------------------------------------------------------------------------------------
get or create updates for specified or active page
setDisplayerUpdates() must be called to add to displayerUpdates if not empty.
---------------------------------------------------------------------------------------------*/
function getDisplayerUpdates(pageName)
{
	var ourUpdates = EZ.trace._displayerUpdates;
	if (!ourUpdates)
	{
		//======================================================================
		ourUpdates = EZ.store.get('.EZtrace.displayerUpdates@');
		//======================================================================
		ourUpdates = EZ.trace._displayerUpdates = (ourUpdates || g.defaults._displayerUpdates);
	}
	delete ourUpdates.EZtrace;
	
	if (!pageName)
		return ourUpdates;
		
	var page = ourUpdates[pageName];		
	if (!page)								//if new page, initialize to default values
		page = EZ.clone(g.defaults.displayerUpdatesPage, false);
	return page;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function setDisplayerUpdates(pageName, updates)
{
	var displayerUpdates = getDisplayerUpdates();

	if (EZ.isEmpty(updates.options))
		delete updates.options;
	
	if (updates.options || updates.time)
		displayerUpdates[pageName] = updates;
	
	else if (EZ.isEmpty(displayerUpdates[pageName]))
		delete displayerUpdates[pageName];
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function saveDisplayerUpdates(isTrue)
{
	var updates = getDisplayerUpdates();
	//==========================================================================
	var rtnValue = EZ.store.set('.EZtrace.displayerUpdates@', updates, isTrue);
	//==========================================================================
	var rtnValue = isTrue || !EZ.debug.isSaveSuspended();
	f.saveDisplayerUpdatesBtn.title = rtnValue ? '<<< saved updates'
									: 'auto save suspended - clice to save';
	EZ.popup.tooltip(f.saveDisplayerUpdatesDetail, EZ.toString(updates));
}
/*---------------------------------------------------------------------------------------------
clear _displayerUpdates and remove from local storage
called from trash debug button
---------------------------------------------------------------------------------------------*/
function resetDisplayerUpdates()
{
	EZ.trace._displayerUpdates = EZ.clone(g.defaults._displayerUpdates, false);
	//==========================================================================
	EZ.store.remove('.EZtrace.displayerUpdates@', true);
	//==========================================================================
	EZ.hide( [f.deleteDisplayerUpdates] );
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function deleteTraceUpdates()
{
	//==========================================================================
	EZ.store.remove('.EZtrace.traceUpdates@', true);
	//==========================================================================
	delete EZ.trace._traceUpdates;
	EZ.trace.getTraceUpdates();
	EZ.hide(f.deleteTraceUpdates);
	EZ.displayMessage('PAUSED...deleted queued messages...');
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function getMessages(pageName)
{
	//==========================================================================
	EZ.trace._messages = EZ.store.get('.EZtrace.messages.' + pageName + '@', []);
	//==========================================================================
	return EZ.trace._messages;			//save in _messages as debug aid
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function loadFieldValues() 
{
	f.body = EZ('body');
	//==========================================================================
	var fieldValues = EZ.store.get('.EZtrace.settings@');
	//==========================================================================
	if (fieldValues)
		EZ.field.add(fieldValues, {elements:f});		//create fields for  saved fieldValues
	EZ.field.add('*', {clearvalue:'[]', elements:f});	//...all other tags with id or name
	
	EZ.event.trigger(['onloadEvent']);					//run onload events after all fieldValues set
	//togglePause(Boolean(f.paused.value));

	while (fieldValues && EZ.debug())
	{
		//if (true) break;
		var ourData = loadDisplayerData()
		if (!ourData) break;
		setActivePageName(ourData.activePageName);
		break;
	}
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function saveFieldValues() 
{
	var fieldValues = EZ.field.getChangedValues('opt')
	//==========================================================================
	EZ.store.set('.EZtrace.settings@', fieldValues, true);
	//==========================================================================
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function loadDisplayerData() 
{
	//==========================================================================
	EZ.trace._displayerData = EZ.store.get('.EZtrace.displayerData$')	
	//==========================================================================
	return EZ.trace._displayerData;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function saveDisplayerData() 
{
	//==========================================================================
	EZ.store.set('.EZtrace.displayerData$', EZ.trace._displayerData)	
	//==========================================================================
}
/*---------------------------------------------------------------------------------------------
called if page change or updated trace options for active page
---------------------------------------------------------------------------------------------*/
function updateTraceOptionsFields(page)
{
	var tags = EZ('traceOption', true);
	tags.forEach(function(el)
	{
		var key = el.alt || el.title;
		var value = page.options[key];
		if (value === undefined) 
			return;
		EZ.set(el, value);
		EZ.addClass(EZ.el.parentElement, 'updated', 30);
	});
}
/*---------------------------------------------------------------------------------------------
called when trace options field changed
---------------------------------------------------------------------------------------------*/
function traceOptionChange(key,value)
{
	var pageName = getActivePageName(pageName);
	var page = getDisplayerPageData();

	if (page.options[key] != value
	|| (page.updatedOptions[key].value != value))
		page.updatedOptions[key] = value;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function getActivePageName() 
{
	var ourData = getDisplayerData();
	var name = ourData.activePageName;
	if (name == '-' || name === '0')
		name = '';
	return name;
}
/*---------------------------------------------------------------------------------------------
setActivePage: select name in pageList
	add option to pageList dropdown if needed
	
	rebuild message dropdown and messages layer with new activePage messages
	save any pending filter options of current page
	set filter and trace options html fields to new activePage values
---------------------------------------------------------------------------------------------*/
function setActivePageName(name) 
{	
	if (name == '0' || name == '-')
		name = '';
	var ourData = getDisplayerData();
	var pageName = getActivePageName();
	
	if (name != pageName)
	{
		var page = pageName ? getDisplayerPageData(pageName) : null
		_saveFilterOptions(page);					//save any pending filter changes
	
		while (!name && ourData.addedList.getKeys().length)	
		{											//if name blank, find page with new messages
			name = ourData.addedList.getKeys()[0];
			ourData.addedList.remove(name.replace(/\./g, '_'));
			if (name in ourData.pageDataList)
				break;
		}
		name = name || Object.keys(ourData.pageDataList)[0];
		//============================
		ourData.activePageName = name;				//set new activePageName
		//============================		
		f.messages.innerHTML = '';					//clear messages and dropdown list
		EZ.clearList(f.messageList, 'fastClear');
				
		if (!name)
			f.pageList.EZfield.resetInitialAttribute('options');
		else
		{
			if (EZ.set(f.pageList, name) != name)	//if name not in dropdown list, add & select it
				updatePageList();					//...beter be if called from updatePageList();
			
			ourData.addedList.remove(name.replace(/\./g, '_'));
			var text = f.pageList.options[f.pageList.selectedIndex].text;
			f.pageList.options[f.pageList.selectedIndex].text = text.replace(/\*.*/, '');
			
			page = getDisplayerPageData(name);
			_updateFilterFields(page);				//set filter field values to page values
			
			updateMessageList(page);			
			_updateFunctionList(page)
			
			updateTraceOptionsFields(page);
		
			page.messages.forEach(function(message)
			{										//display messages for this html page
				displayTraceMessage(message, page);			
			});
			displayStatus(page);	
		}
	}
	//==========
	return name;
	//==========
	//_____________________________________________________________________________
	/**
	 *	
	 */
	function _saveFilterOptions(page)
	{
		if (!page) return;
		
		var tags = EZ('.filter', true);
		page.filterOptions = page.filterOptions || {};
		[].forEach.call(tags, function(el)
		{
			page.filterOptions[el.id] = EZ.get(el);
		});
	}
	/**
	 *	rebuild function dropdown -- updateMessageList() must run 1st
	 */
	function _updateFunctionList(page)
	{
		if (!page) return;
		
		var listValues =  [ ['NA', '-'] ];
		while (page.functionList)
		{
			var keys = Object.keys(page.functionList).sort();
			if (keys.length === 0)
				break;

			if (keys.length == 1)
				listValues = [ [keys[0], g.fnAll] ];
			else
			{
				var total = 0;
				var hiddenCount = 0;
				keys.forEach(function(name)
				{
					var counts = page.functionList[name];
					total += counts.total;
					hiddenCount += counts.hidden;
					
					var className = 'fn_' + name.replace(/\./g, '_');
					var fnCounts = [];
					if (counts.displayed)
						fnCounts.push(counts.displayed);
					if (counts.hidden)
						fnCounts.push(counts.hidden + '*');
					listValues.push( [name + ' ' + fnCounts.join('/').wrap('['), className] );
					
					var selector = ''.concat('#messages:not(.', className, '):not(.', g.fnAll, ') .', className);
					createStyle(selector, 'display:none');
				});
				var text = 'all ' + keys.length + ' functions [' + total 
						 + (hiddenCount ? '/' + hiddenCount + '*] hidden*' : '] messages');
				listValues[0] = [text, g.fnAll];
			}
			var results = f.messages.className.match(/\bfn_[\w-]*/g);
			if (results)												//if existing fn filters, remove
				EZ.removeClass(f.messages, results);
			
			if (!page.functionList[page.selectedFunction])				//clear prior fn filter if no fn messages
				page.selectedFunction = '';
			
			var filter = page.selectedFunction || g.fnAll;				//set fn filter to prior or all
			EZ.addClass(f.messages, filter);
			break;
		}
		EZ.displayDropdown(f.functionList, listValues, '-all');	
		//__________________________________________________________________________________________________
		/**
		 *	09-15-2016 cloned from EZtest_assistant_support.js 
		 *	TODO: don't add if already added
		 */
		function createStyle(selector, rule)
		{
			var styleElement;
			if (document.all && document.createStyleSheet)
			{
				styleElement = document.createStyleSheet();
				styleElement.addRule(selector , rule)
			}
			else
			{
				styleElement = document.createElement("style");
				document.getElementsByTagName("head")[0].appendChild(styleElement);
	
				styleElement = document.styleSheets[document.styleSheets.length-1];
				styleElement.insertRule(selector + ' {' + rule + '}',0);
			}
			return styleElement;
		}
	}
	/**
	 *	
	 */
	function _updateFilterFields(page)
	{
		if (!page) return;
		
		var tags = EZ('.filter', true);
		[].forEach.call(tags, function(el)
		{
			var value = '.filterOptions.'.concat(el.id).ov(page);
			if (value !== undefined)
				EZ.set(el, value);
		});		 
		if (f.filterText.value) 
			filterChange(true);					//validate filter -- display warnings	
	}
}
//_____________________________________________________________________________
/**
 *	rebuild pageList dropdown with activePage selected
 */
function updatePageList(isPrune)
{
	var ourData = getDisplayerData();
	var pageName = getActivePageName();
	var msg = '';
	if (typeof(isPrune) == 'string')
	{
		msg = isPrune;
		isPrune = false;
	} 
	
	ourData.emptyList = [];
	for (var name in ourData.pageDataList)
	{
		var page = ourData.pageDataList[name];
		page.messages = page.messages || [];
		if (page.messages.length)
			continue;
		
		if (isPrune)						//if deleting pages with no messages...	
		{
			delete ourData.pageDataList[name];
			ourData.addedList.remove(name.replace(/\./g, '_'));
		}
		else ourData.emptyList.push(name);	//add page to no messages list
	}
	
	ourData.addedCount = 0;
	if (EZ.isEmpty(ourData.pageDataList))
		f.pageList.EZfield.resetInitialAttribute('options');
	else									//if no active page, get 1st with trace 
	{										//...enabled messages or 1st page added
		name = pageName 
			|| ourData.addedList.getKeys()[0]
			|| Object.keys(ourData.pageDataList)[0];
		ourData.addedList.remove(name.replace(/\./g, '_'));

		var listValues = [];				//rebuild pageList with new msg count suffix
		Object.keys(ourData.pageDataList).sort().forEach(function(name)
		{
			var added = ourData.addedList.getTotal(name.replace(/\./g, '_'));
			ourData.addedCount += added;
			added = (added) ? ' [+' + added + ']' : '';
			listValues.push( [name + added, name] );
		});
		EZ.displayDropdown(f.pageList, listValues, pageName);	
		
		if (!pageName && name)				//set activePage if none
			pageName = setActivePageName(name);
	}
	
	var page = ourData.pageDataList[pageName];
	if (page)
		displayStatus(page, msg);	
	else if (msg)
		EZ.displayMessage(msg);
	
	EZ.show(f.addedMessages, ourData.addedCount);
	f.addedMessages.title = EZ.s('# messages', ourData.addedCount) + ' added to other pages';
}
/*---------------------------------------------------------------------------------------------
update message list including counts called by +/- click
---------------------------------------------------------------------------------------------*/
function updateTraceOffMessages(action)
{	
	var ourData = getDisplayerData();
	var page = getDisplayerPageData();
	var msg, tags;
	if (action == 'showTraceOff')
	{
		tags = EZ('.traceOff', true);
		page.showTraceOffList = page.showTraceOffList.concat(tags);
		ourData.addedList.remove(page.name.replace(/\./g, '_'));	
	}
	else if (action == 'hideTraceOff')
	{
		tags = EZ('.showOff', true);
		page.showTraceOffList = [];				//reset hidden list
	}
	updateMessageList(page, action);
	EZ.addClass(f.messages, 'showingOff', action == 'showTraceOff');
	displayStatus(page, msg);
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function updateMessageList(page, action)
{	
	var filter = page.selectedFunction;
	if (page.name != getActivePageName())
		return EZ.oops(page.name.wrap('"') + ' not active page: ' + getActivePageName());
	
	page.counts = EZ.clone(g.defaults.pageDataCounts, false);
	page.functionList = {};					//counts for each function
	
	var listValues = [];
	page.messages.forEach(function(message)
	{
		var callerName = 'fn_' + message.callerName.replace(/\./g, '_');
		var isFiltered = (filter && callerName && filter != callerName);
		
		var mode = _updateCounts(message, page, isFiltered);
		
		if (!mode)
			return;
		
		var heading = message.heading.replace(/[<]/g, '&lt;').replace(/(.*$)[\s\S]*/, '$1');
		var text = EZ.formatDate(message.time,'time ms') + ' ' 
				 + (filter ? '' : message.callerName)
				 + ': ' + heading;
		
		listValues.push( [text.truncate(120, '...'), message.index] );
	});

	var title = (listValues.length > 0) ? EZ.s('# messages', listValues.length) : '';
	if (page.counts.hidden)
		title += ' ' + page.counts.hidden + ' *hidden';
	else if (page.counts.filtered)
		title += ' ' + page.counts.filtered + ' *filtered';
	
	EZ.addClass(f.scrollTo, 'hiddenOnly', !listValues.length && page.counts.hidden)
	
	listValues.unshift( [title, '-'] );
	EZ.displayDropdown(f.messageList, listValues);	
	f.messageList.selectedIndex = 0;
	
	EZ.show(f.clearMessages, listValues.length || page.counts.hidden);
	//================
	return;
	//================
	//_____________________________________________________________________________
	/**
	 *	update counts for page and each function
			
		var fn = message.callerName;
		if (fn)
		{
			page.functionList = page.functionList || {};
			page.functionList[fn] = page.functionList[fn] || 0;
			page.functionList[fn]++;
		}
	 */
	function _updateCounts(message, page, isFiltered)
	{
		var mode = (message.mode || page.mode);
		if (action == 'showTraceOff' || isFiltered === false)
			mode = true;
		var fn = message.callerName;
		var _update = function(count)
		{
			page.counts[count] = page.counts[count] || 0;
			page.counts[count]++;
			
			page.functionList[fn] = (page.functionList[fn] || EZ.clone(g.defaults.pageDataCounts, false));
			page.functionList[fn][count]++;
		}
		
		_update('total');
		//if (mode && page.name != activePageName)
		//	_update('added');
		
		if (!mode && isFiltered !== true)
		{
			mode = false;
			_update('hidden');
		}
		else if (message.filtered || isFiltered)
		{
			mode = false;
			_update('filtered');
		}		
		else
			_update('displayed');
		
		return mode;
	}
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function functionChange(el, msg)
{	
	var results = f.messages.className.match(/\bfn_[\w-]*/g);
	if (results)
		EZ.removeClass(f.messages, results);
	EZ.addClass(f.messages, EZ.get(el));

	var page = getDisplayerPageData();
	var value = EZ.get(el);
	if (value == g.fnAll)
		value = '';
	
	page.selectedFunction = value;
	EZ.addClass(f.messages, 'showingFn', value);
	updateMessageList(page);
	var msg = value ? 'function ' + value.substr(3) + '() messages'
					: 'messages from all functions';
	displayStatus(page, msg);
}
/*---------------------------------------------------------------------------------------------
action="pageListReset": remove pages from list with no messages
action="addedMessages": setActivePage to 1st name in addedList[]
action=[select.id || undefined]: show messages and options for page selected in dropdown
---------------------------------------------------------------------------------------------*/
function pageChange(action)
{	
	var ourData = getDisplayerData();
	var name = EZ.get(f.pageList);
	if (name == '-' || name === '0')
		name = '';
	
	if (action == 'addedMessages') 				//select next page with added messages
	{
		if (ourData.addedList.getKeys()[0] == name)
			ourData.addedList.remove(name.replace(/\./g, '_'));
		name = ourData.addedList.getKeys()[0];
		
		var total = ourData.addedList.getTotal();
		if (total)
			EZ.hide(f.addedMessages)
		else 
			f.addedMessages = f.addedMessages.replace(/\d+/, total);
	}
	
	var pageName = getActivePageName();
	if (name && name == pageName)
		return name;
		
	return setActivePageName(name);
}
/*---------------------------------------------------------------------------------------------
function saveUpdatedTraceOptions(pageName) 
{
	var pageData = getDisplayerPageData(pageName);
	var updates = getDisplayerUpdates(pageName);
	updates.options = pageData.updatedOptions = (pageData.updatedOptions || {});
	updates.options.time = EZ.formatDate(new Date(), 'ms');
}
---------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
TODO:
---------------------------------------------------------------------------------------------*/
function changeSettings(el)
{
e = el;
	processQueue();
}
/*---------------------------------------------------------------------------------------------
called by changePage() and processQueue()
---------------------------------------------------------------------------------------------*/
function displayStatus(page, msg)	
{	
	if (f.messageList.options.length === 0)
	{
		f.messageList.EZfield.resetInitialAttribute('options');
		EZ.oops('why ??');
	}
	
	var counts = page.counts;
	
	EZ.show(f.showTraceOff, counts.hidden);
	f.showTraceOff.title = EZ.s(f.showTraceOff.alt.trim(), counts.hidden);
	
	EZ.show(f.hideTraceOff, counts.hidden === 0 && page.showTraceOffList.length > 0);
	f.hideTraceOff.title = EZ.s('hide # hidden messages', page.showTraceOffList.length / 2);

	if (msg)
	{
		if (f.paused.value == 'true')
			msg = 'PAUSED...' + msg;
		EZ.displayMessage(msg);
	}
}
/*---------------------------------------------------------------------------------------------
doubleclick 1st triggers 2 click events
---------------------------------------------------------------------------------------------*/
function togglePause(evt)
{
	var isPaused = f.paused.value == 'true';
	var mode = isPaused;
	if (typeof(evt) != 'boolean')
	{
		var type = '.type'.ov(evt);
//console.log(type);
		if (type == 'dblclick')					//clear pending click and toggle pause
			togglePause.timer = clearTimeout(togglePause.timer);
		
		else if (!evt)							//if return from timeout, processQueue once
		{
			togglePause.timer = 0;
			if (isPaused)						//if not paused, fall thru to toggle
				return processQueue();			//...otherwise refresh once
		}
		else if (togglePause.timer)				//if waiting, do nothing
			return;
	
		else if (evt)							//otherwise wait before processing
			return togglePause.timer = setTimeout(function() {togglePause()}, 500);
	
		mode = !isPaused;						//toggle pause setting, class and title
	}
	f.paused.value = mode + '';
	EZ.addClass(f.paused, EZ.debug.options.enabledClass, mode);
	(mode) ? EZ.el.title = EZ.el.alt
		   : EZ.el.EZfield.resetInitialAttribute('title');
	saveFieldValues();
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function filterChange(evt)
{
	if (!f.filterWrap.isVisible())
		return;
		
	var	page = EZ.getDisplayerPageData();

	if (g.filterTimeout) clearTimeout(g.filterTimeout);
	g.filterTimeout = '';
	
	var isApplyNow = evt === true;
	
	//kill pending keyUp ??
	
	g.filterPending = {};
	EZ(['.filter']).forEach(function(el)			//for all filter options . . . 
	{
		var name = el.name || el.id;
		if (!name) return;
		
		name = name.substr(6,1).toLowerCase() + name.substr(7);
		
		var value = EZ.get(el);
		g.filterPending[name] = value === 'true' ? true
							 : value === 'false' ? false
							 : value;
	});

	if (isApplyNow || page.counts.active === 0)
		return filterApply();
	
	if (EZ.equals(g.filter, g.filterPending)) 		
		return EZ.displayMessage();					//return if filter already applied
	else
	{
		g.filterDisabled = false;
		EZ.removeClass(f.filterWrap, 'dim');
	}
	EZ.displayMessage('filter change pending . . .');
	g.filterTimeout = setTimeout('filterApply()', EZ.get('filterAutoApply')*1000);
}
/*---------------------------------------------------------------------------------------------
called by button to toggle filter
---------------------------------------------------------------------------------------------*/
function filterToggle()
{
	g.filterDisabled = !g.filterDisabled;
}
/*---------------------------------------------------------------------------------------------
Apply filter to message specified by headTag -OR- all messages if headTag not supplied.

If filter is not valid, warning message is displayed.
---------------------------------------------------------------------------------------------*/
function filterApply(headTag, page)
{
	if (!headTag)							//called by apply button, toggle or change page
	{
		page = getDisplayerPageData();
		if (!g.filterPending.text)
		{
			g.filter = g.filterPending = g.filterDisabled = false;
		}
		else if (g.filterPending.regex)
		{								
			try
			{								//create pattern	
				var pattern = '/' + g.filterPending.text + '/'		
							+ (g.filterPending.ignoreCase ? 'i' : '');
				''.match(pattern);			//use empty string to validate pattern	
				g.filterPattern = pattern;	//save pattern if valid
			}
			catch (e)
			{
				var msg = (e + '').replace(/SyntaxError\:?\s*/, '');
				return EZ.displayMessage(msg, 30000);
			}
		}
		g.filter = g.filterPending;			//update active filter to pending
	}
	
	if (g.filter) 
	{
		var hideCount = page.counts.hidden;
		
		page.counts.hidden = 0;
		var tags = headTag || EZ(['h2'], g.messages);
	
		EZ.toArray(tags).forEach(function(headTag)
		{									//for specified headTag or all messages
			if (headTag.undefined) return;
			//var message = page.messages[EZ.substring(headTag.className,1)];
			
			var textTag = headTag.nextElementSibling;
	
			var searchStr = g.filter.what == 'head' ? headTag.innerHTML
						  : g.filter.what == 'text' ? textTag.innerHTML
						  : headTag.innerHTML + textTag.innerHTML;
	
			var isMatch = !g.filter.text ? true
						: g.filter.regex ? searchStr.match(g.filterPattern)
						: !g.filter.ignoreCase ? searchStr.includes(g.filter.text)
						: searchStr.includesIgnoreCase(g.filter.text);
	
			var isHidden = (isMatch && !g.filter.show)
						|| (!isMatch && g.filter.show);
	
			EZ.addClass([headTag,textTag], 'hidden', isHidden && !g.filterDisabled);
			if (isHidden)
				page.counts.hidden++;
	
		});
		if (page.counts.hidden != hideCount)
		{
			var msg = !g.filter || page.counts.active === 0 ? ''
					: !g.filter.text ? 'filter cleared'
					:  g.filterDisabled ? 'filter disabled'
					: 'filter applied';
			EZ.displayMessage(msg, 10000)
		}
		filterNote();
	}
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function filterNote()
{
//return;	
	var page = getDisplayerPageData();
	var is = page.counts.active > 0 
		  && page.counts.hidden > 0 
		  && g.filter && !g.filterDisabled
	EZ.removeClass(f.filterShowAll, 'hidden', is);

	EZ.removeClass(f.filterWrap, 'dim', !g.filterDisabled);
	EZ.removeClass(f.filterDisabledNote, 'hidden', g.filterDisabled);
	
	var msg = !g.filter || !g.filter.text ? ''
			: page.counts.active === 0 ? 'no messages'
			: page.counts.hidden === 0 ? 'none hidden'
: g.filter.show 
			? (g.filterDisabled ? page.counts.active - page.counts.hidden + ' filtered'
							 	: page.counts.active - page.counts.hidden + ' hidden  ')
			: (g.filterDisabled ? page.counts.hidden + ' filtered'
								: page.counts.hidden + ' hidden  ');
	EZ.set(f.hideCountTag, msg);
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function goto(el)
{
	
	var idx = (el.value == 'top' && f.messageList.options.length > 1) ? 1
			: (el.value == 'bottom' && f.messageList.options.length > 1) ? f.messageList.options.length-1
			: (el.tagName == 'SELECT') ? el.selectedIndex
			: ''
	if (!idx) return;
	var hash = 'msg_' + idx;
	
	EZ.scrollTo(hash, -g.messagesOffset-10);
//	if (/(top|bottom)/.test(el.value))
//		f.messageList.selectedIndex = 0;
	
	setTimeout(function(){f.messageList.selectedIndex = 0}, 10000);
	//setTimeout("window.scrollBy(0,-g.messagesOffset-10)",500);
	
	EZ.removeClass(goto.highlight, 'highlight');	//un-highlight last selection
	EZ.removeClass(goto.option, 'highlight');		
	
	goto.option = el.options[idx];
	el = document.getElementById(hash);
	if (el)
	{
		goto.selectedIndex = idx;
		goto.highlight = el;
		EZ.addClass(el, 'highlight');				//highlight selected message heading
		EZ.addClass(goto.option, 'highlight');	
	}
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function formatChange()
{
	var	page = EZ.getDisplayerPageData();	
	if (page.counts.active <= 0) return;
	EZ(['h2','div'], g.messages).forEach(function(el)
	{
		el.innerHTML = format(el.innerHTML);
	});
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function format(obj, message, page)
{
	var type = EZ.getType(obj);
	var str = type.wrap();
	switch (type)
	{
		case 'Array': 	
		case 'Object': 	
		case 'RegExp':
		case 'Function':
		{
			//str = (formatMode == 'EZstringify') ? EZ.stringify(obj, null, fotmatOpts)
			var ourData = getDisplayerData();	
			var formatMode = message.format || '.options.format'.ov(page) || EZ.get(f.traceFormat);
			
			var formatOptions = EZ.options.call(ourData.formatOptions, page.formatOptions);
			formatOptions.timestamp = false;
			
			str = formatMode.includesIgnoreCase('toString') 	//EZ.toString
				? EZ.toString(obj, formatOptions)
		
				: !formatMode.includesIgnoreCase('stringify') 	//no formatting
				? obj.toString().trim().replace(/\t/g, '    ')
				
				: formatMode.includesIgnoreCase('EZ') 			//EZ.stringify
				? EZ.stringify(obj, null, formatOptions)
																//JSON.stringify
				: JSON.stringify(obj, null, formatOptions.spaces || 4);
			break;
		}
		case 'Date':
		case 'Number':
		case 'String':
		{
			str = (obj === '') ? EZ.BLANK
							 : obj + '';
			break;
		}
		case 'Null': 
		case 'Undefined': 
		case 'Boolean': 
		case 'NaN': 
		/* jshint ignore:start*/	//FALL-thru
		default:
		/* jshint ignore:end */
		{
		}
	}
	str = (f.showSpaces.checked)
		? str.replace(/ /g, EZ.DOT)
		: str;	//.replace(RegExp(EZ.DOT, 'g'), ' ');
		
	str = (f.showNewlines.checked)
		? str.replace(/\n/g, EZ.EOL + '\n')
		: str.replace(RegExp(EZ.EOL, 'g'), '');
		
	//str = str.replace(RegExp(EZ.EOL, 'g'), '&#172;');
	//str = str.replace(RegExp(EZ.DOT, 'g'), '&#8226;');
	return str;
}
/*---------------------------------------------------------------------------------------------
called by clear button -OR- processMessages() for active or non-active page
---------------------------------------------------------------------------------------------*/
function clearMessages(message, page)
{
	var msg = '';
	page = page || getDisplayerPageData();	
	page.counts = {};
	page.messages = [];
	//page.messageList = [];
	page.functionList = {};
	page.selectedFunction = '';
	page.showTraceOff = false;
	page.showTraceOffList = [];
	
	if (message)								//if cleared by EZ.trace('@')
	{
		msg = message.heading.substr(1) + ' @ ' + EZ.formatDate(message.time,'time');
		page.status = msg;
	}
	if (page.name == getActivePageName())
	{
		f.messageList.EZfield.resetInitialAttribute('options');
		msg = msg || 'cleared @ ' + EZ.formatDate('','time');
		EZ.displayMessage(msg);

		f.messages.innerHTML = '';
		filterNote();
	}
}
/*---------------------------------------------------------------------------
adds message to messages layer -- called by changePage() and processQueue()
----------------------------------------------------------------------------*/
function displayTraceMessage(message, page)
{
	if (page.name != getActivePageName()) 
		return;		
	
	var mode = (message.mode != 'undefined') ? message.mode
											 : page.mode;
	var className = (mode) ? 'traceOn' : 'traceOff';
	if (message.callerName)
		className += ' fn_' + message.callerName.replace(/\./g, '_');
	
	var tag = document.createElement('a');			//anchor tag -- TODO: scrowIntoView() ??
	var id = 'msg_' + message.index;
	tag.setAttribute('id', id);
	tag.setAttribute('name', id);
	f.messages.appendChild(tag);
	
	var tagName = 'h2';
	var callerName = '';
	if (message.callerName)
	{
		callerName = ' ' + message.callerName + ':';
		if (message.lineno)
			callerName += message.lineno;
	}
	
	var formattedTime = EZ.formatDate(message.time,'time ms');	//formatted time with ms
	var headText = formattedTime//	.clip(3) 
				 + callerName + ' ' + message.heading.wrap('<i>');
	
	var text = headText;
	if (message.stacktrace)	
	{
		tagName = 'details';
		text = message.stacktrace.join('\n');
	}
	
	var headTag = _appendTag(tagName, text);
	var textTag = _appendTag('div', message.text);	//text tag (even if blank for filter algorithm)
	
	if (message.stacktrace)	
	{
		tag = document.createElement('summary');	
		tag.innerHTML = headText;
		headTag.appendChild(tag);
	}
	
	var isHidden = message.filtered;
	if (message.filtered)
		EZ.addClass([headTag,textTag], 'filtered', isHidden && !g.filterDisabled);
 		
	//=========================
	filterApply(headTag, page);
	//=========================
	/**
	 *
	*/
	function _appendTag(tag,text)	
	{	
		if (!tag) return;
		var tag = document.createElement(tag);
		tag.className = className;
		
		if (text !== '')
			text = format(text, message, page);

		var textNode = document.createTextNode(text);
		tag.appendChild(textNode);
		f.messages.appendChild(tag);
		return tag;
	}
}
/*---------------------------------------------------------------------------
Checks trace queue for new messages, mode change or updated options.
----------------------------------------------------------------------------*/
function processQueue(isTimeout)
{
	if (isTimeout && processQueue.timeout) 
		clearTimeout(processQueue.timeout);		
	processQueue.timeout = 0;
	
	delete EZ.trace._traceUpdates;
	var traceUpdates = EZ.trace.getTraceUpdates();					//updated by EZ.trace() calls
	var ourData = getDisplayerData();								//updated by us
	
	var now = EZ.getTime();
	//var hourAgo = EZ.getTime(now, -(1000 * 60 * 60))
	var ourUpdateTime = EZ.getTime(ourData.time);
	
	var keys = Object.keys(traceUpdates.pages)
			  .concat(Object.keys(ourData.pageDataList)).removeDups();
		
	var count = 0;
	var hiddenCount = 0;
	var startCount = ourData.addedList.getTotal();
	
	var updateTime = EZ.formatDate(now, 'ms');
	var statusMsg = 'no updates @ ' + EZ.formatDate(updateTime, 'time ms');

	if (EZ.getTime(traceUpdates.time) > EZ.getTime(ourData.time))		//if nothing updated
	{
		keys.forEach(function(pageName)
		{
			var ourPageData = getDisplayerPageData(pageName) 
			var ourUpdates = getDisplayerUpdates(pageName);			  
			do
			{
				var tracePageUpdates = EZ.trace.getTraceUpdates(pageName);
				if (!tracePageUpdates)									//no trace updates for this page
				{
					ourPageData.status = 'no updates';
					if (EZ.isEmpty(ourPageData.updatedOptions))			//next if no options updated
						break;
				}
				if (!ourPageData.options								//if no options or EZ.trace() updated
				|| EZ.getTime('.optionsTime'.ov(tracePageUpdates,0)) > EZ.getTime('.updatedOptions.time'.ov(ourPageData,0)))
				{														//apply EZ.trace() saved options...
					_updatePageOptions(ourPageData, pageName);			//...remove applied from ourPageData.updatedOptions
					delete ourUpdates.options;							//...delete options from displayerUpdates
				}
				if (!EZ.isEmpty(ourPageData.updatedOptions))			//if new or more updated options
					ourUpdates.options = ourPageData.updatedOptions;	//...pass to EZ.trace() page
																	
				if (tracePageUpdates.messageCount)						//if queued messages, process
				{														
					if (EZ.getTime(tracePageUpdates.messageTime) > ourUpdateTime)
					{													//all messages not already processed. . .
						getMessages(pageName).forEach(function(message)			
						{
							message.name = pageName;
							if (!message.time || EZ.getTime(message.time) < ourUpdateTime) 
								return;
							
							var countPageName = pageName.replace(/\./g, '_');
							var countCallerName = (message.callerName || '').replace(/\./g, '_');
							if (message.heading.substr(0,1) == '@')
							{
								clearMessages(message, ourPageData);
								ourData.addedList.remove(countPageName, countCallerName);
							}
							count++;
							if (message.mode)							//if trace active
								ourData.addedList.add(countPageName, countCallerName);
							else 
								hiddenCount++;
							//-----------------------------------------
							message.index = ourPageData.messages.length
							ourPageData.messages.push(message);
							//-----------------------------------------
							displayTraceMessage(message, ourPageData);
						});
					}
					ourUpdates.time = EZ.formatDate(now, 'ms');			//always pass updated time until EZ.trace() 
				}														//...clears messagesCount
			}
			while (false)
			setDisplayerUpdates(pageName, ourUpdates);
		});
		var statusMsg = EZ.s('processed # messages', count) 
					  + ' @ ' + EZ.formatDate(updateTime, 'time ms');
		
		var tooltip = statusMsg
					+ ' (' + hiddenCount + ' hidden)'
					+ ' net adds: ' + (ourData.addedList.getTotal() - startCount) + '\n'
					+ ourData.addedList.toString();
		EZ.set('processStatus', tooltip.replace(/\n/g, '<br>'));
		
		//============================
		updatePageList(statusMsg);									//updates dropdown, displays status msg +++
		//============================						//...below used if paused or debug
		saveDisplayerUpdates();								//save updates for all EZ.trace() pages

		if (!EZ.debug.isSaveSuspended())
			ourData.time = updateTime;						//update last process time
	}	
	if (EZ.debug()) saveDisplayerData();					//save instance data -- development aid

var isPaused = Boolean(f.paused.value);
	if (!isPaused)
		processQueue.timeout = setTimeout('processQueue(true)', EZ.get('refreshSeconds')*1000);
	
	else if (traceUpdates.time)
		EZ.show('deleteTraceUpdates');

	//goto('bottom')
	//_____________________________________________________________________________
	/**
	 *	update trace options for page -- delete updatedOptions
	 */
	function _updatePageOptions(ourPageData, pageName)
	{	
		var traceOptions = EZ.trace.getSavedTraceOptions(pageName);
		ourPageData.options = ourPageData.options || {};
		for (var i in traceOptions)
		{
			ourPageData.options[i] = traceOptions[i];
			if (i in ourPageData.updatedOptions 
			&& EZ.equals(ourPageData.updatedOptions[i], traceOptions[i]))
				delete ourPageData.updatedOptions[i];
		}
		//if (EZ.isEmpty(ourPageData.updatedOptions))
		//	delete ourPageData.updatedOptions;			//delete after EZ.trace() processes
		
		if (pageName == getActivePageName())
		{
			updateTraceOptionsFields(ourPageData);
		}
		//return page.options;
	}
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function setup()
{
	g.defaults = EZ.trace.options.defaultProperties;
	
	/*-----------------------------------------------------------------------------
	open trace in new window if not detached from opener
	-----------------------------------------------------------------------------*/
	if (!location.href.includes(document.referrer))
	{
		var MSIE = navigator.appVersion.indexOf('MSIE') != -1;
		var isIEw3c = !MSIE && navigator.userAgent.indexOf('Trident') != -1 
					&& navigator.appCodeName.indexOf('Mozilla') != -1;
		
		//var width = '.options.displayerData.settings.defaultWidth'.ov(EZ.trace, 610);
		//var height = '.options.displayerData.settings.defaultHeight'.ov(EZ.trace, 970);
		
		var features = 'width=610,height=970,directories=no,status=no,scrollbars=yes,'
					 + 'location=no,menubar=no,resizable=yes,'
					 
					 + (!MSIE && !isIEw3c
					 ? 'screenX=' + (screen.availWidth-625) + ',screenY=10'
					 
					 : 'left=' + (screen.availWidth-625) + ',top=10');
		
		window.open('EZtrace.html', 'EZtrace', features);	//open in new window -- detached from caller
		window.close();										//close this one
		return;
	}
	var ourData = getDisplayerData();						//initializes EZ.trace._displayerData		
	var ourUpdates = getDisplayerUpdates();					//		''	  		   _displayerUpdates
	var traceUpdates = EZ.trace.getTraceUpdates();			//		''	  		   _traceUpdates
	
	loadFieldValues();
	
	EZ.addClass('body', 'live');
	EZ.removeClass('body', ['designView', 'loading']);
	EZ.displayMessage();									//clear loading msg
	
	resize();
	
	EZ.popup.tooltip(f.processStatus);
	EZ.popup.tooltip(f.tooltipTraceUpdates, EZ.toString(traceUpdates));
	EZ.popup.tooltip(f.tooltipDisplayerUpdates, EZ.toString(ourUpdates));
	EZ.show(f.tooltipDisplayerUpdates, Object.keys(ourUpdates).length)
	
	pageChange('pageListReset');							//update dropdowns if saved data
	
	if (f.paused.value != 'true')
	{
		//EZ.hide('deleteTraceUpdates');
		processQueue();
	}
	else
	{
		var msg = (Object.keys(traceUpdates.pages).length
				&& EZ.getTime(traceUpdates.time) > EZ.getTime(ourData.time))
				? 'new messages in queue...from ' + EZ.formatDate(traceUpdates.time, 'time')
				: 'no messages @ ' + EZ.formatTime();
	
		EZ.displayMessage('PAUSED...' + msg);
	}
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
(function jshint_global_bottom_not_used() {[setup]})	//does not work at top