/*global 
EZ, dw:true, DWfile, g:true, f:true,

e:true
*/
var e;
(function jshint_globals_not_used() {	//global variables and functions defined but not used
e = [

e, g, dw, DWfile]
});
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
g = {};
g.groups = {};
f = {};			//fields

// off by default for regex assistant
EZ.global.legacy.EZeventAdd = false;
EZ.global.legacy.EZshowHide = false;
EZ.global.legacy.EZclassAction = false;
EZ.global.legacy.EZhasClass = false;
EZ.global.legacy.EZtechSupport = false;
EZ.global.legacy.EZdisplayMessage = false;
EZ.global.legacy.EZoptions = false;

/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function resize()
{
	g.messagesOffset = g.controls.clientHeight + 4;
	g.messagesWrap.style.marginTop = g.messagesOffset + 'px';
	g.messagesWrap.style.height = g.body.clientHeight - g.messagesOffset;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function filterChange(evt)
{
	var	group = EZ.getTraceGroup(EZ.trace.activeGroupName);

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

	if (isApplyNow || group.counts.active === 0)
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
function filterApply(headTag, group)
{
	if (!headTag)							//called by apply button, toggle or change group
	{
		group = getGroup(EZ.trace.activeGroupName);
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
		var hideCount = group.counts.hidden;
		
		group.counts.hidden = 0;
		var tags = headTag || EZ(['h2'], g.messages);
	
		EZ.toArray(tags).forEach(function(headTag)
		{									//for specified headTag or all messages
			if (headTag.undefined) return;
			var message = group.messages[EZ.substring(headTag.className,1)];
			
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
				group.counts.hidden++;
	
		});
		if (group.counts.hidden != hideCount)
		{
			var msg = !g.filter || group.counts.active == 0 ? ''
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
function goto(el)
{
	var hash = (el.value == 'top' && f.messageList.options.length > 1)
			 ? f.messageList.options[1].value
			 
			 : (el.value == 'bottom' && f.messageList.options.length > 1)
			 ? f.messageList.options[f.messageList.options.length-1].value
			
			 : (el.tagName == 'SELECT') ?  el.options[el.selectedIndex].value
			 : ''
	if (!hash) return;
	
	EZ.scrollTo(hash, -g.messagesOffset-10);
//	if (/(top|bottom)/.test(el.value))
//		f.messageList.selectedIndex = 0;
	
	setTimeout(function(){f.messageList.selectedIndex = 0}, 10000);
	//setTimeout("window.scrollBy(0,-g.messagesOffset-10)",500);
	
	EZ.removeClass(goto.highlight, 'highlight');
	el = document.getElementById(hash);
	if (el)
	{
		goto.highlight = el;
		EZ.addClass(el, 'highlight');
	}
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function formatChange()
{
	if (group.counts.active <= 0) return;
	EZ(['h2','div'], g.messages).forEach(function(el)
	{
		el.innerHTML = format(el.innerHTML);
	});
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function format(str)
{
	str = (f.showSpaces.checked)
		? str.replace(/ /g, EZ.DOT)
		: str.replace(RegExp(EZ.DOT, 'g'), ' ');
		
	str = (f.showNewlines.checked)
		? str.replace(/\n/g, EZ.EOL + '\n')
		: str.replace(RegExp(EZ.EOL, 'g'), '');
		
	return str;
}
/*---------------------------------------------------------------------------------------------
TODO:
---------------------------------------------------------------------------------------------*/
function changeSettings(el)
{
	processQueue();
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function setup()
{
	/*-----------------------------------------------------------------------------
	open code cloned from snippet_helper.js::RZtrace();
	-----------------------------------------------------------------------------*/
	if (!location.href.includes(document.referrer))
	{
		var MSIE = navigator.appVersion.indexOf('MSIE') != -1;
		var isIEw3c = !MSIE && navigator.userAgent.indexOf('Trident') != -1 
					&& navigator.appCodeName.indexOf('Mozilla') != -1;
		
		var features = 'width=610,height=970,directories=no,status=no,scrollbars=yes,'
					 + 'location=no,menubar=no,resizable=yes,'
					 
					 + (!MSIE && !isIEw3c
					 ? 'screenX=' + (screen.availWidth-625) + ',screenY=10'
					 
					 : 'left=' + (screen.availWidth-625) + ',top=10');
		window.open('EZtrace.html', 'EZtrace', features);	//open in new window detached from caller
		window.close();										//close this one
		return;
	}
	
	EZ.displayMessage();
	/*
	f.groupList = EZ('groupList');
	
	f.groupListDefault = f.groupList.options[0].text;		//default when no active groups
	f.messageListDefault = f.messageList.options[0].text;	//default when no messages
	*/

	f.body = EZ('body');
	EZ.field.add('*', {clearvalue:'[]', elements:f});
	var fieldValues = EZ.store.get('.EZtrace.html.fieldValues', {});
	EZ.field.update(fieldValues);
	//EZ.loadOptions('options');					//saved field values
	
	resize();
	var isDebug = EZ.setDebugMode();
	var traceSavedData = {};
	if (isDebug && EZ.trace.options.savedata)
		traceSavedData = EZ.store.get('.EZtrace.data') 	//saved global data
		
	var traceDefault = {
		_time: null,
		_activeGroupName: '',
		_groups: {},
		_displayUpdates: {
			groups: {}
		}
	}
	var traceData = EZ.mergeAll(traceDefault, traceSavedData);
	for (var i in traceData)
		EZ.trace[i] = traceData[i];
	/*
	g.trace = ''.ov(g.trace, traceDefault)
	g.trace = g.trace || {};					//initialize global data
	g.trace.time = g.trace.time || null;
	g.trace.activeGroupName = g.trace.activeGroupName || '';
	g.trace.groups = g.trace.groups || {};
	*/
	var groupNames = Object.keys(EZ.trace.groups);
	if (groupNames)
		EZ.displayDropdown(f.groupList, groupNames, EZ.trace.activeGroupName);
	
	processQueue();								//may update group dropdown
	/*
	if (g.groupList.options.length > 0)
	{
		if (g.groupList.selectedIndex == -1)
			g.groupList.selectedIndex = 0;
		groupChange();							//group selected -- display messsages
	}
	else
	{
		EZ.selectOptionAdd(g.groupList, 'no active trace pages');
		if (g.filterText.value) filterChange(true);	//validate filter -- display warnings
	}
	*/
	EZ.event.add(f.filterText, 'onKeyup', filterChange, 100);
}
e = setup;
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function processEvent(evt)
{
	var el = evt.srcElement;
	if (!el) return;
	
	if (EZ.hasClass(el, 'opt'))
	{
		EZ.updateOptions(el);
	}
	if (EZ.hasClass(el, 'goto'))
		goto(el);
	
	else if (EZ.hasClass(el, 'filter'))
		filterChange(el);
	
	else if (el.id == 'groupList')	
		groupChange();
		
	else
	{
		if (EZ.getAncestor(el, 'groupOption'))
		{
			var key = el.title;
			if (key = 'format')
				formatChange(el);
				
			groupOptionChange(key, EZ.get(el));	
		}
	}
		
	//EZ.event.cancel(evt,true);
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function groupOptionChange(key,value)
{
	var group = getGroup(EZ.trace.activeGroupName);
	if (group.options[key] != value
	|| (group.updatedOptions[key].value != value))
		group.updatedOptions[key] = value;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function groupChange()
{
	saveFilterOptions(EZ.trace.activeGroupName);				
	var name = EZ.get(f.groupList);
	if (name == EZ.trace.activeGroupName)
		return;
	var group = getGroup(name);
	EZ.trace.activeGroupName = name;
	
	updateFilterFields();
	
	f.messages.innerHTML = '';				//clear messages
	EZ.clearList(f.messageList, 'fast');	//clear messages dropdown
	if (!group.messages) 
		return;
	group.messages.forEach(function(message)
	{										//display messages for this group / html page
		displayMessage(message, group);			
	});
	displayMessageCount(group);
	
	if (f.filterText.value) filterChange(true);	//validate filter -- display warnings
	
	/**
	 *	
	 */
	 function updateFilterFields()
	 {
		 var tags = EZ('.filter');
		 [].forEach.call(tags, function(el)
		 {
//			 EZ.set(el, group.filterOptions[el.id]);
		 });		 
	 }
	/**
	 *	
	 */
	 function saveFilterOptions(group)
	 {
		 if (!group) return;
		 group.filterOptions = {};
		 var tags = EZ('.filter');
		 [].forEach.call(tags, function(el)
		 {
//			 group.filterOptions[el.id] = EZ.get(el);
		 });
	 }
}
/*---------------------------------------------------------------------------------------------
called by clear button -OR- processMessages() for active or non-active group
---------------------------------------------------------------------------------------------*/
function clearMessages(message, group)
{
	var msg;
	group = getGroup(EZ.trace.activeGroupName);	
	group.counts = {};
	group.messages = [];
	group.messageList = [];
	
	if (message)
	{
		msg = message.heading.substr(1) + ' @ ' + EZ.formatDate(message.time,'time');
		group.status = msg;
	}
	if (group.name == EZ.trace.activeGroupName)
	{
		f.messages.innerHTML = '';
debugger;
		f.messageList.EZfield.resetInitialAttributes('options');
		//EZ.clearList(f.messageList, 'fast defaultOptions');
		if (message)
		{
			EZ.displayMessage.blank = msg || 'cleared @ ' + EZ.formatDate('','time');
			EZ.displayMessage();
		}
//		f.messageList.options[0] = new Option(f.messageListDefault, '');
		filterNote();
	}
}
/*---------------------------------------------------------------------------
Checks trace queue for new messages, mode change or updated options.
----------------------------------------------------------------------------*/
function processQueue(isTimeout)
{
	if (isTimeout && g.queueTimeout) 
		clearTimeout(g.queueTimeout);		
	g.queueTimeout = 0;
	
	var traceUpdates = EZ.trace.getTraceUpdates();				//updated by html pages
	var displayUpdated = EZ.trace.getDisplayUpdates();
	if (EZ.getTime(EZ.trace.traceUpdates.time) > EZ.getTime(EZ.trace.displayUpdates.time))
	{
		var displayTime = EZ.getTime();
		var groupNames = Object.keys(EZ.trace.traceUpdates.groups).concat(Object.keys(EZ.trace.groups)).removeDups();
		groupNames.forEach(function(name)
		{
var group = EZ.trace.getGroup(name);
			var traceGroup = EZ.trace.traceUpdates.groups[name];
			if (!traceGroup)
			{
				return group.status = 'no updates';
			}
			else
			{
				var displayUpdate = EZ.trace.displayUpdates.groups[name] || {};

				group.options = traceGroup.options || {time:null};	//safety for unexpected
				
				if (EZ.getTime(traceGroup.options.time) >= EZ.getTime(group.options.time))
					delete EZ.trace.displayUpates.groups[name].options;			
				
				if (EZ.getTime(traceGroup.options.time) > EZ.getTime(group.options.time))
					group.options = updateGroupOptions(group, traceOptions);
				
				if (group.updatedOptions)
				{
					group.options = EZ.mergeAll(group.options, updatedOptions);
					group.options.time = EZ.formatDate(displayTime);
					displayUpdate.options = group.options;
				}
				
				if (traceGroup.messageCount && EZ.getTime(traceGroup.time) >= displayTime)
				{														//process queued messages
					var messages = EZ.store.get('.'.concat(name,'.EZtrace.messages'), [])
					
					if (!EZ.trace.activeGroupName)
						setActiveGroup(group);
					
					messages.forEach(function(message)			
					{
						if (!message.time || EZ.getTime(message.time) < displayTime) 
							return;
						
						if (message.heading.substr(0,1) == '@')
							clearMessages(message, group);
						
						group.messages.push(message);
						
						updateCounts(message, group);
						processMessage(message, group);
						displayMessage(message, group);
					});
					displayMessageCount(group);
					displayUpdate.time = EZ.formatDate(displayTime);
				}
				if (!EZ.isEmpty(displayUpdate))
					EZ.removeClass(EZ.trace, 'deleted')
				else
				{
					EZ.addClass(EZ.trace, 'deleted')
					EZ.trace.removeDisplayUpdates()
				}
				EZ.trace.displayUpdates.time = EZ.formatTime(displayTime);
			}
		});
		  //-----------------------------------------------\\
		 //----- prune and save EZ.trace.displayUpdates -----\\
		//---------------------------------------------------\\			
		if (!group.options 							//check for updated trace options
		|| group.time.options > groupTimes.options)		
		{
			var updatedOptions = EZ.trace.getOptions(name);
			if (Object.keys(updatedOptions).length)
			{
				group.options = groupUpdates.options;		
				groupTimes.options = updatedOptions.time;
			}
			else if (!group.options) 				//request trace options from html page
				groupTimes.options = 0;
		}
		else delete groupTimes.options;
		
		for (name in EZ.trace.displayUpdates.groups)
		{
			for (time in EZ.trace.displayUpdates.groups[name].times)
				if (EZ.trace.displayUpdates.groups[name].times[time] < lastHr)
					delete EZ.trace.displayUpdates.groups[name].times[time]
					
			if (Object.keys(EZ.trace.displayUpdates.groups[name].times).length == 0)
				delete EZ.trace.displayUpdates.groups[name];
		}
		EZ.saveDisplayUpdates(EZ.trace.displayUpdates);		//pass updated times to all html pages
		
		
		EZ.store.set('.EZtrace.data', EZ.trace)					//save instance data -- development aid
///		goto()
	}
									
	if (EZ.debugMode)				
		EZ.displayMessage('...paused...')
	else													//sch recheck if not paused
		g.queueTimeout = setTimeout('processQueue(true)', EZ.get('refreshSeconds')*1000);
	
	//_____________________________________________________________________________
	/**
	 *	
	 */
	function updateGroupOptions(group, traceOptions)
	{
		group.options = EZ.mergeAll(group.options, traceGroup.options);
		updateSettings(group);
		return group.options;
	}
	/**
	 *	
	 */
	function setActiveGroup(group)
	{
		EZ.trace.activeGroupName = name;
	}
	/**
	 *	
	 */
	function updateSettings(group)
	{
		//TODO: update fields if active 
	}
	/**
	 *	
	 */
	function updateGroupsList()
	{
		if (Object.keys(EZ.trace.groups).length == 1)
		{
			EZ.clearList(f.groupList, 'fast');
			var selectOption = new Option(name, name);
			f.groupList.options[f.groupList.options.length] = selectOption;
		}
	}
}
/*---------------------------------------------------------------------------
----------------------------------------------------------------------------*/
function processMessage(message, group)
{
	var mode = (message.mode || group.mode);
	var time = EZ.formatDate(message.time,'time ms');
	var heading = message.heading || '';
	var text = message.text || '';
	if (!heading && !text) return;				//bail if no text nor heading
	
	var selectValue = time;
	var selectText = heading.replace(/[<]/g, '<').replace(/\n/g, EZ.EOL).substr(0,50);
	selectText = selectValue + (selectText ? ':    ' + selectText : '');
	
	message.selectOption = {value:selectValue, text:selectText};	
	group.messageList.push(message.selectOption);
	group.lastHash = selectValue;
}
/*---------------------------------------------------------------------------
	if (typeof(text) == 'object')			//if text object -- EZ.toString()	
	{
		var toStringOptions = {timestamp:false}
		toStringOptions.html_keys = '';
		text = EZ.toString(text, toStringOptions);
	}
	if (!heading.trimPlus('@'))				//if heading is @ or blank, set to caller name
		heading = ('.callee.caller.name'.ov(arguments) || '') + '(...)';
		text += '\n' + stackTrace.slice(3).join('\n');
----------------------------------------------------------------------------*/
function displayMessage(message, group)
{
	var mode = (message.mode || group.mode);
	if (!mode || group.name != EZ.trace.activeGroupName) 
		return;										//bail if not activeGroupName
	
	var tag = document.createElement('a');	
	tag.setAttribute('id', message.time);
	tag.setAttribute('name', message.time);
	f.messages.appendChild(tag);
	
	var headTag = appendTag('h2', message.selectOption.value + ': ' + message.heading);	
	var textTag = appendTag('div', message.text);	//even if blank for filter algorithm
	 	
 	if (message.filtered)
		EZ.addClass([headTag,textTag], 'hidden', isHidden && !g.filterDisabled);
 		
	var selectOption = new Option(message.selectOption.text, message.selectOption.value);
	f.messageList.options[f.messageList.options.length] = selectOption;
	
	filterApply(headTag, group);
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function displayMessageCount(group)	
{	
	if (f.messageList.options.length == 0)
	{
:::		var selectOption = new Option(f.messageListDefault, '');
		f.messageList.options[f.messageList.options.length] = selectOption;
	}

	var counts = group.counts;
	if (counts.total > 0)
	{
		//var msg = counts.active == 1 ? '1 message' : 'goto message 1 - ' + counts.active;
		var msg = counts.active + EZ.s(' message',counts.active);
		f.messageList.options[0].text = msg;
	}
	if (counts.hidden)
		f.hiddenCount.value = 'show ' + counts.hidden + ' hidden messages'
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function appendTag(tag,text)	
{	
	if (!tag) return;
	var tag = document.createElement(tag);
	var textNode =  document.createTextNode(format(text || ''));
	tag.appendChild(textNode);
	f.messages.appendChild(tag);
	return tag;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function updateCounts(message, group)
{
	var mode = (message.mode || group.mode);
	update('total');
	
	if (!mode)
		update('hidden');
	
	else if (message.filtered)
		update('filtered');
	
	else
		update('displayed');
	
	function update(count)
	{
		group.counts[count] = group.counts[count] = 0;
		group.counts[count]++;
	}
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function filterNote()
{
return;	
	var is = group.counts.active > 0 
		  && group.counts.hidden > 0 
		  && g.filter && !g.filterDisabled
	EZ.removeClass(f.filterShowAll, 'hidden', is);

	EZ.removeClass(f.filterWrap, 'dim', !g.filterDisabled);
	EZ.removeClass(f.filterDisabledNote, 'hidden', g.filterDisabled);
	
	var msg = !g.filter || !g.filter.text ? ''
			: group.counts.active == 0 ? 'no messages'
			: group.counts.hidden == 0 ? 'none hidden'
: g.filter.show 
			? (g.filterDisabled ? group.counts.active - group.counts.hidden + ' filtered'
							 	: group.counts.active - group.counts.hidden + ' hidden  ')
			: (g.filterDisabled ? group.counts.hidden + ' filtered'
								: group.counts.hidden + ' hidden  ');
	EZ.set(f.hideCountTag, msg);
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/


