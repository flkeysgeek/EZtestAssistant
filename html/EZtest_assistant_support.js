/* global

EZgetPref, EZsetPref, EZgetInt, EZgetValues, EZgetValue, EZsetValue,
EZaddClass, EZremoveClass,
isOk, formatNote, folderSelected, quit,

showCounts, formatObject,
updateTestStyles, displayResults, setTestOkStatus, EZurlToFile, EZfileToUrl,

saveData,
updateOptions,
deleteTestResults,
saveTestOptions, suggTestOptions,
displayTestNotes,

nosaveUpdate,
updateTestResults,
displayTestResultsWarn,
displayTestResultsNote,
unescape,

EZ, g, dw, DWfile
*/
/*
*/
var e;
(function jshint_glmoreRadioobals_not_used() {	//global variables and functions defined but not used
e = [
getType, processClick, 
getExpected, 
showLastSelected, displayTestResultsWarn,
showDetails, getParent, doScript, toggleFilter, 
resetTests, resetHighLight, convertToString, createTestScript,
showAppData, setupShowApp,
disableOption,
bindOverride,
	
setOverride,
setOpenLink,
displayCaptureCounts, 
toggleDebug, toggleLog,
showAppDataSelect, debugActionSelect,
compareVariants,
addInfo, addAlert,
	
e, g, dw, DWfile, EZgetPref
]});
/*----------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
function addInfo(msg, className, detail)
{
	return EZ.test.message.info(msg, className, detail);
}
//______________________________________________________________________________________________
function addAlert(msg, className, detail)
{						
	return EZ.test.message.infoAlert(msg, className, detail);
}
//______________________________________________________________________________________________


//______________________________________________________________________________________________
/**
 *	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
**/
function bindOverride(isTrue)
{
	if (!isTrue)
		return Function.prototype.bind = bindOverride.currentBind;

	bindOverride.currentBind = bindOverride.currentBind || Function.prototype.bind;
	Function.prototype.bind = function(bindToThis) 
	{
		if (typeof this !== "function") 
			return EZ.oops('cannot bind type: ' + typeof this);
	
		var ctx = this, 
			args = Array.prototype.slice.call(arguments, 1);
		
		ctx["~bind"] = args.length;
		//______________________________________________________________________________________
		var binder = function()
		{
		}
		//______________________________________________________________________________________
		var bound = function bound() 
		{
			return ctx.apply
			(
				bindToThis, 	//this instanceof binder && bindToThis ? this :
				args.concat(Array.prototype.slice.call(arguments))
			);
		}
		//======================================================================================
		binder.prototype = this.prototype;
		bound.prototype = new binder();
		return bound;
	}
}

/*--------------------------------------------------------------------------------------------------
show last processClick action
--------------------------------------------------------------------------------------------------*/
function setAction(action, detail)
{						
	if (!document.body) 
		return;
	
	if (!setAction.el)				//1st call with DOM
	{
		setAction.el = EZ('eventActionLast', null);
		setAction.elTip = EZ('eventActionHistory', null);
		setAction.elCount = EZ('eventActionCount', null);
		setAction.elShowing = EZ('eventActionShowing', null);
		setAction.size = EZ.toInt(EZ.get('eventActionSize'), 10);
		setAction.filter = EZ.get('eventActionFilter');
		setAction.display = setAction.display || [];
		setAction.history = setAction.history || [];
	}
	if (setAction.el === null) return;
	//______________________________________________________________________________________________
	/**
	 *	
	**/
	var _filterAllows = function(text)
	{
		return setAction.filter === '' || text.toLowerCase().includes(setAction.filter.toLowerCase())
	}
	var _filterAll = function()
	{
		setAction.display = [];
		for (var i=0; i<setAction.history.length; i++)
		{
			if (!_filterAllows(setAction.history[i])) 
				continue;
			setAction.display.push(setAction.history[i]);
			if (setAction.display.length >= setAction.size)
				break;
		}
		setAction.display.reverse();
	}
	//==============================================================================================
	var alt = '', text = '';
	try
	{
		switch (action || '')
		{
			//case '': 									//event actions link clicked
			//	return EZ('eventActionHistory').select();
			
			case 'top': 									
				return EZ.addClass('testInfoTop', 'top')
			case 'under': 									
				return EZ.removeClass('testInfoTop', 'top')
			case 'size': 
			{											
				if (!detail) return;
				
				var size = EZ.toInt(detail.srcElement.value, 10);
				if (size == setAction.size)
					return EZ('eventActionFilter').select();
					
				setAction.display = [];
				setAction.size = detail.srcElement.value = size;
				setTimeout(function() {detail.srcElement.select()},100)
				break;
			}
			case 'filter':
			{
				setAction.display = [];
				setAction.filter = detail.srcElement.value = detail.srcElement.value.toLowerCase();
				setTimeout(function() {detail.srcElement.select()},100)
				break;
			}
			case 'clear':
			{
				setAction.display = [];
				setAction.history = [];
				break;
			}
			default:											//add new event action
			{
				if (!EZ.debug.getMode()
				|| !EZ.log.isActive('processClick')) 
				{	
					if (setAction.el.innerHTML !='disabled')
						setAction.el.innerHTML='disabled';
					return;
				}
				if (detail instanceof Element)
				{
					alt = detail.getAttribute('alt') || '';
					if (alt == '@') return;						//if disabled for tag
					if (!alt.startsWith('@'))
					{											//if id, that is enough
						alt = detail.toString('brief').replace(/(.*#.*?)\..*/g, '$1...>');
						alt = alt.truncate(40, '...');
					}
					else
						alt = ':' + alt;
				}
				else alt = (detail instanceof Event) ? detail.type : detail || '';
				
				text = EZ.format.time('ms') + ' '
				action = action.replace(/^(hover (.*)): (on|off)(.*)/, function(all, action, hover,onOff)
				{
					if (hover == 'beg')
						alt = alt.replace(/:/, (onOff == 'on' ? '::hover' : ''))
					//return (!/(beg|end)/.test(action) ? action : ':hover ' + onOff);
					return all;
				});
				if (alt.startsWith(':')) alt = alt.substr(1);
				
				action = action.replace(/^tooltip fastHide/, '.fastHide');
				text += action + ' \t' + alt;
				setAction.history.unshift(text);
				if (setAction.history.length > setAction.size*5)
					setAction.history.length = setAction.size*5;
			}
		}	
		if (action && text && _filterAllows(text))
		{
			EZ.set(setAction.el, action);
			setAction.display.unshift(text);
		}
		else if (setAction.display.length === 0)
			_filterAll();
		
		var html = setAction.display.slice(0,setAction.size).format().join('\n')
		var showing = (setAction.display.length == setAction.history.length) ? 'showing all'
					: setAction.display.length + ' of ' + setAction.history.length + ' showing';
		
		setAction.elShowing.innerHTML = showing;
		setAction.elCount.innerHTML = setAction.history.length;
																				
		//if (EZ.log.isActive('processClick', 'page'))
			setAction.elTip.innerHTML = html.replace(/</g, '&lt;');
		if (EZ.log.isActive('processClick', 'console') || EZ.log.isActive('processClick', 'trace'))
			EZ.log.call('processClick', setAction.history[0]);
	}
	catch (e)
	{
		setAction.el = null;
		EZ.oops('setAction() disabled after exception: ' + e);
	}
}
/*--------------------------------------------------------------------------------------------------
dim other tests NOT clicked as debugger convenience (even if not rerun)
--------------------------------------------------------------------------------------------------*/
function dimOther(testrun, isDim)
{
	if (!testrun) return;
	EZ.addClass('data', ['processing'], isDim);
	EZ.addClass(testrun.tags, ['processing'], isDim);
}
/*--------------------------------------------------------------------------------------------------
called on all mouse or keyboard events including input image (+/-) clicks

TODO:
	checkbox onClick() seems to lose checked
		if (field.undefined)
			EZ.oops('EZ.field(' + id + ') unknown');
--------------------------------------------------------------------------------------------------*/
function processClick(arg)
{
	var msg = '';
	var isFound = true;
	var parent, rtnValue = true;

	var evt = arg || window.event;
	var x = evt ? evt.pageX : -1;
	var y = evt ? evt.pageY : -1;
	evt = evt || {};
	//var x = evt.pageX;
	//var y = evt.pageY;

	var el = (arg instanceof Element) ? arg
		   : (evt instanceof Event) ? evt.srcElement
		   : '';
		   
	//var el = evt ? evt.srcElement : '';				//TODO: onFocus() and onResize() ignored
	if (!el || !el.tagName) 						//tagName undefined if el == window
	{												//onFocus() was scrolling window and 
		if (evt.type == 'focus')					//...ignoring mouse click ???
		{											//11-10-2016: disabled body onFocus()
			EZ.event.cancel(evt,true);
			return false;
		}
		return true;
	}
	
	var field = el.EZfield;							//get field if defined 
	var id = el.id || el.name || '';
	var tagName = el.tagName.toLowerCase();	
	var tagType = el.type || tagName;

	var classList = el.classList ? [].slice.call(el.classList) : EZ.toArray(el.className);
	var title = el.title || '';
	var href = el.href || '';
	var src = el.src || '';
	var value = el.value || '';	
	value = value;
	var popupsOpen = EZ.popup.tags.slice();
	
	//if (id == 'clipboardCopy')	//zeroClipboard??
	//	return true;

///	EZ.timer.clearTimeout(true);						//clear all pending timers	

	
	var evtType = (evt.type || '').toLowerCase();
	if (evtType.includes('click'))
	{ 
		if (/(text|select|option)/.test(tagType))
			return true;
		
		var blurTag = (tagName == 'summary') ? el
					: (el.parentElement.tagName == 'SUMMARY') ? el.parentElement
					: '';
		if (blurTag)
		{
			setAction('blur()', blurTag);
			setTimeout(function() {blurTag.blur()},10);
		}
		if (el.onclick != null 
		&& !/.*?\{\s*\}$/.test(el.onclick) 
		&& !(el.onclick+'').includes('processClick'))
			return true;								//tag has onClick handlwe
	}
	
	if (evt.code == 'Enter' && el.onkeydown)
		return setAction('Enter Key') || true;														
														//=================================
	if (evtType == 'transition-start')					//===== tooltip :hover change =====
	{													//=================================
		if (tagName != 'code')							//always fires??
			return false;								//if not tooltip <code>, ignore
		
		setTimeout(function() 						
		{
			var hover = EZ.getStyle(el, 'color').includes('1') 	? 'on' : 'off';
			EZ.removeClass(el, 'hover', hover == 'off');
			setAction('.hover ' + hover, el);
		}, 500);
		EZ.removeClass([el,EZ.popup.fastHide],'fastHide');	
		setAction('tooltip fastHide-del', EZ.popup.fastHide);
		delete EZ.popup.fastHide;
		
		/*
		if (hover == 'off')								//remove immediately
			EZ.removeClass(el, 'hover');
		else											//or add shortly if still :hover
			setTimeout(function() 						//other than the tooltip <code>
			{
				if (EZ.getStyle(el,'color').includes('1'))
					EZ.addClass(el, 'hover')
			}, 500);
		*/
		var hover = EZ.getStyle(el, 'color').includes('1') 	? 'on' : 'off';
		
		return setAction('hover beg: ' + hover, el) || true;
		//return setAction('hover beg: hide now', el) || true;
	}
	if (evtType == 'transition-end')					
	{													//only fires if :hover same as start
		if (tagName != 'code')
			return false;
		
		//var margin = EZ.getStyle(el, 'margin-left');
		var hover = EZ.getStyle(el, 'color').includes('1') 	? 'on' : 'off';
		if (hover == 'on')
		{
			setTimeout(function() 						
			{
				EZ.popup.fastHide = el;
				EZ.addClass(el, 'fastHide')	
				setAction('tooltip fastHide-add', el);
			}, 1000);
		}
		return setAction('hover end: ' + hover, el) || true;
	}
	//========================================================================================================
	g.el = el;											//debugger breakpoint not ignored not transition event
	g.evt = evt;										//el / evt saved as development aid
	//========================================================================================================
	var isRerun = title.includes('rerun');
	
	if (href.includes('EZtrace.html'))					//===== trace link clicked =====
   	{													//morph >> trace help buttom
   		EZ.toggle('helpTrace');
		EZ.removeClass('appOptions', 'less');
   		EZ.event.cancel(evt,true);
   		el = EZ('tracePopup');
		setAction('trace');
   	}
	else if (EZ.hasClass(el,['popup','popupMore']))		//===== help popup button =====
	{
		EZ.popup.toggle(el);
		return setAction('popup toggle', el) || false;
   	}
	else if (EZ.hasClass(el,'href'))					//standard html link
		return setAction('href') || true;

	else isFound = null;								//TODO: move below up	
	//--------------------------------------------------------------------------------
	if (evt.clientX
	&& !EZ.getAncestor(el,'helpBox',null))				//if not clicked on	popup icon...
	{													//...hide all popups
		//var els = EZ('.helpBox', true);
		//(isRerun) ? EZ.addClass(els, 'hidden')
		setAction('popup hide-disabled', el);
//		EZ.popup.hide();					
	}
 	//--------------------------------------------------------------------------------
	if (src.includes('/close.png') 
	&& EZ.hasClass(el.parentNode, 'helpBox'))			//===== popup close icon =====
	{													
		EZ('popupPad').style.paddingTop = '';			
 		if (g.popupOnClose && !g.popupOnClose())
			return setAction('popup onClose()') || false;
 		
		setAction('popup close', el.parentNode);
 		EZ.popup.hide(el.parentNode);
   	}
	
	else if (classList.includes('tooltipClear')				//===== tooltipClear icon =====
	&& evt && evt.offsetX < 16 && evt.offsetY < 18)
	{
		setAction('tooltipClear', el);
		el.innerHTML = '';
		isFound = true;
	}
 	//--------------------------------------------------------------------------------
	if (isFound)
		void(0);

/*
	//	color 1e-05s ease 0s, opacity 1.75s ease-out 3.25s, margin-left 1e-05s ease 5s
	else if (EZ.hasClass(el,'tooltipDelayShow'))		//===== tooltip delays =====			
	{
		var sels = g.transition.show;
		var transition = EZ.css.get(sels[0]);
		transition = transition.replace();
		EZ.css.set(sels, transition);
		return true;
	}
	else if (EZ.hasClass(el,'tooltipDelayHide'))				
	{
		var sels = g.transition.hide;
		var transition = EZ.css.get(sels[0]);
		transition = transition.replace();
		EZ.css.set(sels, transition);
		return true;
	}
*/
	
  	else if (EZ.hasClass(el,'okSettingsOpt'))			//===== Ok legend / helpbox  =====
   	{
   		EZaddClass('okSettingsLayer', 'noLegend')
   		g.popupOnClose = function()
   		{												//if not canceled or another popup openned
			EZremoveClass('okSettingsLayer', 'noLegend')
			return setAction('Ok rules popup') || true;
   		}
		if (!popupsOpen.includes( EZ('okSettings').nextElementSibling ))
			setAction('Ok settings click') || EZ('okSettings').click();
   	}
	else if (EZ.hasClass(el,'toggleFilter'))			//===== change display filter =====
		toggleFilter(el);
	
	else if (id == 'exFrom')							//===== exFrom dropdown =====
		saveTestOptions(el);
	
	else if (id == 'saveLastRun')						//===== save lastrun =====
	{
		setAction('saveLastRun');
		//msg = saveLastRun(true);
	}
	else if (EZ.hasClass(el,'resetHighLight'))			//===== clear highlight =====
		setAction('resetHighLight') || resetHighLight();

	else if (EZ.hasClass(el,'goto_lastselection'))		//===== goto last selection =====
		msg = setAction('goto_lastselection') || showLastSelected('goto');
	/*
	else if (EZ.hasClass(el,'warnings'))				//===== scroll to save warnings =====
	{
		EZ.addClass('orphanNote', 'highlight');
		location.hash = 'warnings';
		setAction('warnings');
   	}
//	else if (EZ.hasClass(el,'faults'))					//===== scroll to stacktrace =====
//		location.hash = 'faultAnchor';					//think now std #hash

	else if (el.id == 'orphanNote')						//===== scroll to save note =====
	{
		EZ.addClass('warnings', 'hidden');
		displayTestResultsWarn();
		setAction('orphanNote');
   	}
	*/
	else if (/(testOnlyList|testSkipList)/.test(id))	//===== only / skip onChange =====
	{													
		/* cancels focus -- still odd bubble
		if (el.lastValue == el.value)
			return false;
		*/
		if (el.lastValue != el.value)
		{
			saveTestOptions(el);						//merge only/skip lists
			if (g.reloadRequired)						//set starburst here because
				starburst();							//el.lastValue = el.value;
			el.lastValue = el.value;
		}
		setAction('only/skip list');
	}
	else if (EZ.hasClass(el,['expandOptionsMore', 'expandOptionsLess']))
	{													//===== [+/-] top options =====
		if (!evt.clientX) return true;					//bail if not bubbled event
		EZ.removeClass('appOptions', 'hide');
		EZ.toggleClass('appOptions', 'less');
		EZ.set('showTestOptions', EZ.hasClass('appOptions', 'less'));
		setAction('expandOptions More/Less');
	}

	else if (el.id.startsWith('reload')					//===== reload icon =====
	|| EZ.hasClass(el, 'reload'))
		return setAction('reload') || quit('reload');

	else if (el.id == 'testRunAll')						//===== only/skip (*) icon =====
	{
		saveTestOptions(el)
		return setAction('testRunAll') || quit('reload');
	}
	else if (el.id == 'runDisplayedTests')				//===== run displayed tests =====
	{
		saveTestOptions('runDisplayedTests')
		return setAction('runDisplayedTests') || quit('reload');
	}
	else if (el.id == 'runHighlightedTests')			//===== run highlighted tests =====
	{
		saveTestOptions('runHighlightedTests')
		return setAction('runHighlightedTests') || quit('reload');
	}
	else if (EZ.hasClass(el, 'runButton'))				//===== Run Test Button =====
	{
		EZ.addClass(el, 'hidden');
		setAction('runButton') || EZ.test.runTestScript();
	}

	else if (el.id == 'allDefaultOptions')				//===== reset ALL options =====
		return setAction('allDefaultOptions') || quit('resetAll');

	else if (el.id == 'defaultTestOptions')				//===== reset test options =====
		return setAction('defaultTestOptions') || quit('resetTestOptions');

	else if (el.id == 'assistantTests')					//===== Assistant Tests button =====
	{													//...keep changing wording
		EZsetValue('folderList',EZ.test.config.assistant.folder);
		folderSelected(EZ.test.config.assistant.filename);
		return setAction('assistantTests') || false;
	}
	else if (el.id == 'EZnoneLog')						//===== show EZnone log =====
	{													//broke - deprecated by EZ.beep.EZnone ??
		EZ.toggle('EZnone');
		location.hash='EZnoneAnchor';
		setAction('EZnoneLog');
   	}

	else if (el.id == 'allOk' || el.id == 'allOkLabel')
	{
		return setAction('allOk') || updateOk(el);
	}
	else if (el.id == 'saveAll')						//===== save all button =====
	{
		updateTestResults();
		showCounts();
		setAction('saveAll');
	}
	else if (el.id == 'deleteSaved')					//===== delete all button =====
		setAction('deleteSaved') || deleteTestResults();

	else if (EZ.hasClass(el,'updateTestStyles'))		//===== update test styles =====
		setAction('updateTestStyles') || updateTestStyles();								//no btn as of 10-09-2016

	else if (classList.includes('nosave'))				//===== save / no saved =====
		setAction('nosave') || nosaveUpdate(el)
	
	else if (EZ.hasClass(el,'createScripts'))			//===== capture create script =====
		setAction('createScripts') || createTestScript(el.innerHTML);

	else if (el.id.startsWith('minWidth'))				//===== column minWidth =====
		setAction('minWidth') || EZ.set(el, Math.max(el.value, 100));

	else if (el.id.startsWith('maxWidth'))				//===== column maxWidth =====
   	{
		var tag = EZ('minWidth'+el.id.substr(8));
		EZ.set(el, Math.max(el.value, tag.value));
		setAction('maxWidth');
	}
	else if (el.id.startsWith('expandCol'))				//===== column autofit =====
   	{
		var tag = EZ('maxWidth'+el.id.substr(8));
		tag.disabled = el.checked;
		if (!el.checked && (!tag.value || isNaN(tag.value)))
			EZ.set(tag, '250');
		setAction('expandCol');
	}
	else if (el.id == 'scrollbarShow')					//===== show/hide scrollbars =====
	{
		EZ.addClass('dataBody', 'scrollbarShow', el.checked);
		EZ.removeClass(el.parentElement, 'starburst');
		setAction('scrollbarShow');
	}
	else if (el.id == 'expandAll')						//===== [+/-] all rows/cols =====
		setAction('expandAll') || toggleScroll(el, 'expandAll');

	else if (/(plus|minus)/.test(src) 
	&& el.id.includes('ExpandColumn'))					//===== [+/-] all columns =====
	{
		toggleScroll(el, 'ExpandColumn');				
		setAction('ExpandColumn');
	}
	else
	{
		isFound = false;
		if (tagName == 'code' 
		|| EZ.hasClass(el,['tooltipClick']))			//===== tooltip click =====
		{
			isFound = true;
			//update_tooltip_style(el, 'click');			
			EZ.popup.tooltip.update_style(el, 'click');			
			setAction('tooltipClick:', el);
		}
		else if (parent = EZ.getAncestor(el, 'code', null))
		{
			if (tagName == 'a')							//stacktrace link
			{
				EZ.addClass(el,'blink=8000')
				return setAction('&lt;code> &lt;a> click', el) || false;
			}
			if (tagName == 'summary')					
			{
				EZ.event.cancel(evt);					//cancel bubble
				return setAction('summary click ignored', el) || true;
			}
			//update_tooltip_style(parent, 'click');
			EZ.popup.tooltip.update_style(parent, 'click');			
			setAction('tooltip code click:', parent);
		}
	}
	if (isFound !== false)	
	{													
		isFound = true;
		var wrapEl = EZ.getAncestor(el, ['displayOptions','options'], null);
		if (!wrapEl)									//if inside displayOptions wrapper...
			updateOptions(wrapEl);						//... update display options
		
		setAction('displayOptions click');
	}

	  //-----------------------------\\
	 //----- single test buttons -----\\
	//---------------------------------\\
	while (!isFound) 
	{
		var testrun = EZ.test.getTest(el);
		if (!testrun)									//***** bail if NOT single test event *****
		{
			setAction('processClick ignored click', el);			
			break;
		}
		var testKey = testrun.testKey;
													
		if (EZ.hasClass(el, 'todo'))					//===== TODO =====
		{
			var todo = EZ.test.data.options.todo = EZ.test.data.options.todo || [];
			todo[testKey] = el.checked;
			
			setAction('todo');
			return true;
		}
		else if (/(img)/i.test(tagName) && classList.includes('todo'))
		{
			rtnValue = EZ.todo.action(el, testKey);
			setAction('todo img');
		}
		
		var isDim = false;
		if (EZ.test.data.topRowsDisplayed <= 5			//too expensive??
		&& !EZ.hasClass(el, ['highlightOff', 'highlightOn']))			
		{												//===== dim other if not highlight btn =====
			isDim = true;
			dimOther(testrun, true);
		}

		if (isRerun)									//======== rerun =========
		{												//don't fall thru to undim
			if (!isDim)									//========================
				dimOther(testrun, true);
			
			setAction('rerun') 
			EZ.test.runTestScript(testKey);						
			updateLastSelected(testKey, 'rerun');	
			return rtnValue;							
		}
		else if (EZ.hasClass(el, ['ok']))				//===== ok checkbox =====
		{
			setAction('ok checkbox');
			rtnValue = updateOk(el, testrun);
			updateLastSelected(testKey, 'ok');
			autoSave(testrun);
		}
		else if (EZ.hasClass(el,'okSettings'))			//===== Ok settings helpBox single test =====
		{
			setAction('ok rules test row');
			EZremoveClass('okSettingsLayer', 'noLegend')
			g.popupOnClose = function _popupClose()		//rerun test after settings updated onClose
			{											//if not canceled or another popup openned
				setTimeout(EZ.test.runTestScript, 100);
				return true;
			}
			EZ('okSettings').click();
			if (!EZ.isInView(EZ.el, true))				//if not fully in view
				EZ.scrollTo(EZ.el);
			return true;
		}
		else if (title.includes('compare'))				//===== compare ======
		{
			setAction('compare');
			updateLastSelected(testKey, 'compare');	
			EZ.timer.setTimeout(function() {compareResults(testKey)}, 0);
		//	setTimeout(function() {compareResults(testKey)}, 0);
		}
		else if (EZ.hasClass(el, 'highlightOn'))		//===== highlight On =====
			setAction('highlightOn') || updateHighlight(testrun, 'highlightOn');
		
		else if (EZ.hasClass(el, 'highlightOff'))		//===== highlight off =====
			setAction('highlightOff') || updateHighlight(testrun, 'highlightOff');

		else if (EZ.hasClass(el, 'save'))				//===== save results button =====
		{
			setAction('save testrun');
			updateLastSelected(testKey, 'save');	
		///	EZ.timer.setTimeout(function _saveResults()
			setTimeout(function _saveResults()
			{
				updateTestResults(testKey);
				showCounts();
			}, 100)
		}
		else if (EZ.hasClass(el, 'deleteSaved'))		//===== delete results button =====
		{
			setAction('deleteSaved testrun');
			updateLastSelected(testKey, 'save');	
			updateTestResults(testKey, true);
			//showCounts();
		}
		else if (EZ.getAncestor(el,'editContent',null))
		{												//===== popup edit control =====
			setAction('editContent');
			editContent(el, testrun);					// e.g. save / close -- NOT open
		}
														  //------------------------------\\
		else if (EZ.hasClass(el, 'expandOne'))			 //----- expand/collapse/edit -----\\
		{												//----------------------------------\\
			setAction('expandOne');
			var isPlus = toggleScroll(el, 'expandOne');
			updateLastSelected(testKey, isPlus ? 'plus' : 'minus');
		}
		else 
		{
			isFound = false;

			if (EZ.hasClass(el, 'lastSelected')) 		//===== lastSelected =====
				setAction('lastSelected', el) || updateLastSelected(testKey, 'toggle');					
															
			else if (EZ.hasClass(el, ['toggleLast', 'mostRecent']))
				setAction('toggleLast', el) || updateLastSelected(testKey, 'toggle');	
			
			else if (/(td|div|pre|span)/i.test(tagName))	//if not actual upperleft corner
			{												//or TD has edit icon
				var td = (tagName == 'td') ? el : EZ.getAncestor(el,'td',null);
				if (td)
					updateLastSelected(testKey, EZ.hasClass(td, 'first') ? '1stCol' : 'otherCol');	
				
				parent = el.parentElement;
				x -= el.offsetLeft;
				y -= el.offsetTop;

				if (el.tagName == 'TD' && x <= 12 && y <= 12
				&& !EZ.hasClass(el, 'actual'))			//===== edit content =====
				{
					setAction('edit actual');					
					updateLastSelected(testKey, 'edit');
					editContent(el, testrun, 'open');
				}
				else if (el.tagName == 'DIV' 			//===== scroll div clicked =====
				&& EZ.hasClass(parent, 'scroll'))
				{ 										//if clicked on scrollbar [+/-] icon
					var isPlus = false;
					x -= parent.offsetLeft;
					y -= parent.offsetTop;

					if (x >= (el.offsetWidth-15) && y <= 15
					&& EZ.hasClass(el, 'scrollHeight'))
						isPlus = setAction('toggle scrollHeight') || toggleScroll(el, 'expandHeight')

					else if (x <= 15 && y > (el.offsetHeight-15)
					&& EZ.hasClass(el, 'scrollWidth'))	//lower left corner
						isPlus = setAction('toggle scrollWidth') || toggleScroll(el, 'expandWidth')

					else								//clicked inside container but not +/- icon
					{
						isPlus = undefined;
					///	EZ.timer.setTimeout(function() {toggleScroll(el, 'expandUpdate')},500);
					}
					if (isPlus !== undefined)
						updateLastSelected(testKey, isPlus ? 'plus' : 'minus');
				}
				rtnValue = false;
			}
		}
		
		dimOther(testrun, false);						//un dim non-selected test
		break;
	}
	
	if (isFound && msg)
		EZ.displayMessage(msg);


	if (field && field.isChanged(false))				//check and note any field value change
	{													
		if (el.checked === false && el.className.includes('some'))
			EZ.removeClass(el, 'some');
		setAction('value change:' + field.el)
		

		if (EZ.get('saveOptionsOnChange') != 'idle')	
		{
			//saveData('options', 'changed');
			setTimeout(function() {saveData('options', 'changed')}, 500);
		}
		if (classList.includes('reloadRequired'))
		{												//reload required for change to have effect
			g.reloadRequired = true;
			starburst();
			//EZ.displayMessage('reload required', el);
		}
	}
	
	if (evt.code == 'Enter')							//===== ENTER key event =====
	{
		setAction('Enter key');
		EZ.event.cancel(evt, true);						//cancel bubble (01-13-17: and default action)
		if (EZ.test.data && EZ.test.data.variants)
		{
			var isNotRun = EZ.hasClass('body', 'notRun');
			switch (EZ.get('enterKeyAction'))
			{
				case ('always'): break; 								
				case ('none'): return rtnValue; 								
				case ('reloadRequired'):
				{
					if (!g.reloadRequired && !isNotRun)
					{ 
						EZ.track('enter key dead code')
						/*01-02-2016: disabled when warnings div disabled -- don't think worked anyway
						var opts = {delay: 1000, floatNode: el}
						if (tagType == 'body')
						{
							opts.el = EZ('warnings');
							opts.left = '';
							opts.right = '10px';
							opts.top = EZ('body').scrollTop + (EZ.getBrowserOffsets().height / 2);
						}
						EZ.displayMessage('no reload required', opts);
						*/
						return rtnValue;
					}
					break;
				}
				default: 
				{
					EZ.oops('invalid ENTER key setting');
					return rtnValue;
				}
			}
			return isNotRun ? EZ('runButton').click()
							: quit('reload');
		}
		return rtnValue; 				//if true don't stop propagation or default action
	}									//TODO: if false stop propagation ??
	else if (el.blur) el.blur();

}
/*----------------------------------------------------------------------------------
called by: updateScrollBars() (indirectly by toggleFilter()) -or- rightArrow click
----------------------------------------------------------------------------------*/
function showLastSelected(action /* scroll if called by addScroll */)
{
	var testKey;
	var testnoList = 'EZ.test.data.scroll.testnoList'.ov([]);
	var lastno = EZ.test.data.options.testnoLastSelected;
	if (action == 'scroll')
	{
		if (lastno											//scrollTo lastSelected if not done yet,
		&& testnoList.includes(lastno)						//not set elsewhere and now displayed
		&& EZ.hasClass('goto_lastselection', 'hidden'))
			testKey = lastno;
		else return;
	}
	if (testKey)
	{
		if (testKey != lastno || !EZ.test.data.tagLastSelected)
			updateLastSelected(testKey);

		if (!testnoList.includes(testKey))
			return 'most recently selected test not displayed -- select "Show All Tests"';
	}
	var tag = EZ.test.data.tagLastSelected;
	if (tag.scrollIntoViewIfNeeded)
		tag.scrollIntoViewIfNeeded();
	
	else if (!EZ.isInView(tag))		//not reliable
		EZ.scrollTo(tag, true);
	return testKey;
}
/*----------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
function updateLastSelected(testKey, from)
{
	var options = EZ.test.data.options;
	var lastno = options.testnoLastSelected;
//	var testrun = EZ.test.data.testrun[testno-1];
	var testrun = EZ.test.getTest(testKey);
	if (!testrun) 
		return EZ.oops('testrun NA for test # ' + testKey);
	var tags = testrun.tags;
	var el = tags.EZ('mostRecent');
	
	if (from == 'toggle')
	{
		if (testKey == lastno) testKey = '';
	}
	else if (from)									//ignore if settings not checked
	{
		from = from.charAt(0).toUpperCase() + from.substr(1);
		if (!'Edit 1stCol OtherCol'.includes() && EZ('highlight' + from).checked)
			updateHighlight(testrun, 'highlightOn')		
		
		if (!EZ('mru' + from).checked)
			return;
	} 
	if (testKey)
	{
		if (testKey != lastno)
			EZremoveClass(EZ.test.data.tagLastSelected, 'lastSelected');

		options.testnoLastSelected = testKey;		
		EZ.test.data.tagLastSelected = el;
		EZaddClass(el, 'lastSelected');
		el.title = "most recently selected test";
		EZremoveClass('goto_lastselection', 'hidden')	//show arrow (not hiiden once on)
	}
	else if (options.testnoLastSelected)
	{													//keep tag for right edge arrow
		options.testnoLastSelected = '';				//but clear testKey and unhighlight
		el = EZ.test.data.tagLastSelected;
		EZremoveClass(el, 'lastSelected');
		EZ.el.title = "";
	}
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
function autoSave(testrun)
{
	var saveAutoWhen = EZ.get('saveAutoWhen');
	if (saveAutoWhen == 'always'
	|| (testrun.okChecked && saveAutoWhen == 'ok')
	|| (!testrun.okChecked && saveAutoWhen == 'notOk'))
		updateTestResults(testrun.testKey);		
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
function updateHighlight(testrun, from)
{
	var tr = testrun.tags[1];	//.EZ('topTestRow');
	//var testnoStr = testrun.testno + '';
	var markerIdx = EZ.test.data.options.markers.indexOf(testrun.testKey);
	
	if (from == 'highlightOn')
	{
		if (EZ.hasClass(tr, 'unMarker'))
		{
			EZ(from).title = 'click to highlight';
			EZ.removeClass(testrun.tags, ['marker', 'unMarker']);
		}
		else
		{
			if (!EZ.hasClass(tr, 'marker'))
				EZ.addClass(testrun.tags, 'marker');

			EZ.removeClass(testrun.tags, 'unMarker');
			if (markerIdx == -1)
				EZ.test.data.options.markers.push(testrun.testKey);
			//EZsetPref(EZ.pref.testMarkers, g.testMarkers);
		}
	}
	else if (from == 'highlightOff')
	{
		EZsetPref(EZ.pref.lastSelected, 0);
		if (EZ.hasClass(testrun.tags.EZ('toggleLast'),'lastSelected'))
			dimOther(testrun, 'toggle');

		EZ.addClass(testrun.tags, 'unMarker');
		if (markerIdx != -1)
			EZ.test.data.options.markers.splice(markerIdx,1);
		
		EZ('highlightOn').title = 'was highlighted click again to hide'
		//						+ (EZ.hasClass('data',['plus','showMarkers']) ? 'hide' : 'clear')

		//EZsetPref(EZ.pref.testMarkers, g.testMarkers);
	}
	toggleRunHighlightedButton();
}
/*--------------------------------------------------------------------------------------------------
	var sel = EZ.hasClass('body', 'notRun') ? ['runButton'] : ['reload'];
--------------------------------------------------------------------------------------------------*/
function starburst(el)
{
	var el = EZ(el || ['reload']);
//	if (el.length)
//		el = (EZ.getStyle(el[0], 'display') != 'none') ? el[0] : el[1];
	if (!el)
		return EZ.oops('no element specified');
		
	EZ.addClass(el, 'starburst');
}
/*--------------------------------------------------------------------------------------------------
Edit argument, expected results or notes

ARGUMENTS:
	String		...
	options		(optional) Object containing one or more of the following properties:
				skipCount	number of function to remove from top of stack
	...			blah blah
			Array or delimited string (values separated by commas or spaces)


RETURNS:
	true if ... otherwise ...

REFEERENCE:
TODO:

if (EZ.quit === false) return;
--------------------------------------------------------------------------------------------------*/
function editContent(el, testrun, action)
{
	var td = el.tagName == 'TD' ? el : EZ.getAncestor(el, 'td', null);
	if (!td) return;
	
	var textarea = EZ('textarea', td);
	var list = EZ('editWhat', td);
	var typeList = EZ('editType', td);

	var div = EZ('div', td);
	var scrollClass = typeof(el) == 'string' ? el
					: EZ.hasClass(div,'args') ? 'args'
					: EZ.hasClass(div,'expected') ? 'expected'
					: EZ.hasClass(div,'note') ? 'note'
					: '';
	if (!scrollClass) return;

	var defaultEdit = {
		saved:{}, work:{}, type:{}, init:true,
		copyList: {
			args: [],
			expected: ['expected', 'actual'],
			note: []
		}
	};
	var edit = g.edit = '.edit.'.concat(scrollClass, '=').ov(testrun, defaultEdit);

	var idx = edit.idx;							//most recently used dropdown idx / type
	var type = EZ.get(typeList) || '.edit.type.'.concat(idx).ov(testrun);
	var value = textarea.value;
	var json, msg = '';
												  //-------------------------------------------\\
	switch (action || el.title)					 //----- action: tag title if not argument -----\\
	{											//-----------------------------------------------\\
		case 'clear':
		{
			var defaultValue = getDefaultValue(type);
			textarea.value = (value == defaultValue) ? '' : defaultValue;
			return;
		}
		case 'close': 							//CLOSE: if empty String or emply value, discard
		{
			if (value !== '')	// || value == getDefaultValue(testrun.edit.type[idx]))
			{
				if (scrollClass == 'expected')
					editContent_createScript(value, type, idx);
			}
			else
			{
				textarea.value = '';
				delete edit.idx;
				delete edit.work[idx];
				delete edit.saved[idx];
				msg = 'discarded';
			}
			td.style.height = '';
			EZ.removeClass(td, 'edit');

			setTimeout("EZ('evalResults').select()", 500);
			break;
		}
		case 'copy': 							//COPY:
		{

			var copyIdx = (edit.copyIdx + 1) % defaultEdit.copyList[scrollClass].length;
			var idx = defaultEdit[scrollClass].copyList[copyIdx];
			editContent_setContent();
			/*
			value = textarea.value = EZ.test.jsonValue( testrun.actual[idx] );
			type = testrun.edit.type[idx] = testrun.callArgTypes[idx];

			EZ.set(typeList, type);
			editContent_createScript(value, type, idx);
			*/
			return;
		}
		case 'open':							//OPEN: with minWidth for controls
		{
			EZ.addClass(td, 'edit');
			var wrap = EZ('editControls',td);
			textarea.style.width = Math.max(100, td.clientWidth - 15) + 'px';
			setTimeout(function()
			{									//don't need much height -- e.g true/false
				var height = td.clientHeight - wrap.clientHeight-10;
				textarea.style.height = Math.max(50, height) + 'px';
			},0);

			if (edit.init && list)
			{
				idx = undefined;
				type = '';
				value = textarea.value = '';
				EZ.clearList(list);
				EZ.clearList(typeList);
				testrun.args_idx.concat(testrun.args_omitted).forEach(function(idx)
				{								//'results', ['ctx'], [0-n] call args and omitted
					if (idx == 'results' && scrollClass != 'expected') return;
					var arg = testrun.callArgNameShort[idx];
					if (arg == null) return;

					EZ.selectOptionAdd(list, arg.trim(), idx+'', idx == 'results');
				});
				if (list.selectedIndex == -1);
					list.selectedIndex = 0;

				list.onchange = function()		//list dropdown onchange -- calls us
				{
					editContent(scrollClass, testrun, 'select');
				}
				edit.copyIdx = 0;				//init copy sources
				EZ.addClass(EZ('editCopy', td),'hidden', defaultEdit.copyList[scrollClass].length);
			}
			delete edit.init;

			if (edit.idx === undefined)
				editContent_setContent();
			else
				editContent_createScript(value,type,idx)

			//setTimeout(function() {textarea.focus()}, 250);
			//TODO: scroll to top
			break;
		}
		case 'reset':							//RESET:
		{
			delete edit.saved[idx];
			msg = 'reset';
			editContent_createScript(value, type, idx);
			edit.idx = null;
			editContent_setContent();
			break;
		}
		case 'save':							//SAVE:
		{
			try
			{
				type = edit.type[idx] = EZ.get(typeList);
				json = jsonFromValue(value, type);

				if (value === '')
					value = EZ.test.notSpecified;
				if (value != EZ.test.notSpecified)
					editContent_createScript(value, type, idx)

				var saved = edit.saved[idx];
				delete edit.saved[idx];

				var currentValue = editContent_getValue(edit.copyIdx);
				if (EZ.equals(value, currentValue))
				{
					if (saved && saved != currentValue)
						msg = 'reset';
				}
				else
				{
					edit.saved[idx] = value;
					msg = 'updated'
				}

				if (msg && scrollClass == 'expected')
				{
					setTestOkStatus(testrun);
					var checked = isOk(testrun);
					var checkbox = EZ('ok',testrun.tags);
					checkbox.checked = checked;
					updateOk(testrun.tags.EZ('ok'), testrun);
					displayResults(testrun, 'expected');
				}
				delete edit.idx
				delete edit.work[idx];
				textarea.value = '';
				EZ.removeClass(td, 'edit');
			}
			catch (e)
			{
				EZ.techSupport(e, 'saving expected value');
			}
			break;
		}
		case 'select':							//CHANGE edit value
		{
			edit.idx = null;
			return editContent_setContent();
		}
		default:	return EZ.oops()			//UNKNOWN ACTION
	}	//end switch
	if (msg)
	{
		msg = scrollClass + ': ' + testrun.callArgNameCite[idx] + msg;
		testrun.info = ['<i>' + msg + '<i>'];
		formatNote(testrun, 'edit');
	}
	//____________________________________________________________________________________
	/**
	 *	setContent()
	 *	update textarea with selected expected value: return value, ctx, arg#
	 */
	function editContent_setContent(idx)
	{
		idx = idx || edit.idx || EZ.get(list);			//argName from drop down
		var lastIdx = idx;
		idx = edit.idx = EZ.get(list);					//argName from drop down
		if (idx != lastIdx && lastIdx !== undefined)	//save prior editted content if any
			edit.work[lastIdx] = textarea.value.trim();

		switch (idx)
		{
			case 'object':
			{
				break;
			}
			case 'object':
			{
				break;
			}
			default:	return EZ.oops()			//safety for unexpected
		}

		var type = edit.type[idx] || testrun.callArgTypes[idx];
		var value = editContent_getValue();

		edit.idx = idx;
		edit.work[idx] = textarea.value = value;
		edit.type[idx] = type;
		EZ.set(typeList, type);

		el.scrollLeft = 0;								//move cursor to top /left
		el.scrollTop = 0;
		EZ.range.removeAll();
		
		editContent_createScript(value, type, idx);
	}
	//____________________________________________________________________________________
	/**
	 *	getValue()
	 */
	function editContent_getValue(idxArg)
	{
		idx = idxArg || idx;
		var json = edit.work[idx] || getExpected(testrun, idx, 'json' );

		if (json != EZ.test.notSpecified.wrap('"'))		//update type unless value not specified
			type = edit.type[idx] || getType(EZ.parse(json));

		var value = (type != 'String') ? json			//handle embedded quotes, multline
				  : EZ.parse(json)
		return value;
	}
	//____________________________________________________________________________________
	/**
	 *	For most types, EZ.stringify() preserves type even when value is not valid
	 *	Invalid types will be simply saved as Strings if not corrected.
	 *	TODO: EZ.base ??
	 */
	function jsonFromValue(value, type)
	{
		switch (type)
		{
			case 'null':
			case 'undefined':
				return typeof(value) == value ? value : EZ.stringify(value);

			case 'Boolean':
				return (Boolean(value)+'') == value ? value : EZ.stringify(value);

			case 'Date':
				return !isNaN(new Date(value)) ? EZ.stringify(value)
					                          : ( 'new Date(' + value + ')' ).wrap('"');
			case 'NaN':
			case 'Number':
				return (parseFloat(value)+'') == value ? value : EZ.stringify(value);

			case 'RegExp':
				return getType(value) == 'RegExp' ? value : EZ.stringify(value);

			case 'Function':												//TODO:??
				return getType(value) == 'Function' ? value : EZ.stringify(value);

			case 'String':
				return EZ.stringify(value, '*');

			case 'Array':
				return EZ.isArrayLike(EZ.parse(value)) ? value : EZ.stringify(value);

			case 'Object':
				return typeof(EZ.parse(value)) == 'object' ? value : EZ.stringify(value);

		}
		return EZ.stringify(value, '*');		//unknown
	}
	//____________________________________________________________________________________
	/**
	 *	return default / empty value content for specified type
	 */
	function getDefaultValue(type)
	{
		//if (true) return EZ.test.notSpecified;
		switch (type)
		{
			case 'null':
			case 'unknown':
			case 'undefined':
				return type;
			case 'Boolean':
				return 'false';
			case 'String':
				return '';
			case 'NaN':
			case 'Number':
				return '0';
			case 'Date':
				return 'new Date()';
			case 'RegExp':
				return '/.../';
			case 'Function':
				return 'function()\n{\n\n\n}';
			case 'Array':
				return '[]';
			case 'Object':
				return '{}';
			default:
				return '';
		}
	}
	//____________________________________________________________________________________
	/**
	 *	createScript()
	 *
	 */
	function editContent_createScript(value, type, idx)
	{
		if (value === '' || value == EZ.test.notSpecified)
			return;
		var varName = testrun.callArgNameScript[idx]
		json = jsonFromValue(value, type);

		var script = varName + ' = ';
		var pad = ' '.dup(script.length-1);
		if (type == 'String')
		{											//format multiline String
			if (json.includes('\n'))
			{
				json = json.replace(/""\s*\+ /, '');
				json = json.replace(/^\s*\+/gm, pad + '+');
				json = json.replace(/\n"/g, '\\n"');
			}
			script += json;
		}
		else
		{
			pad += ' '.dup(4);
			pad = '';
			json = json.split('\n');
			var multiline = json.shift() + '\n' + pad
						  + (json.join('\n' + pad));
			var oneline = multiline.replace(/\s+/g, ' ');

			if ((oneline.count('{') + oneline.count('[')) < 3 && oneline.length < 50)
				script += oneline;
			else
				script += multiline;
		}
		script = '// ' + scrollClass + ': ' + testrun.callArgNameLong[idx]
			   + ' @ ' + EZ.formatTime() + '\n'
			   + script.trim() + '\n';

		updateEval(script, 'script', 'edit');
	}
}
//______________________________________________________________________________
/**
 *	3-way toggle: false --> some --> true --> false
 */
function updateOk(el, testrun)
{
	var isAll = !testrun;
	var onlySaveOk = false;
	var next = el.checked;
	var changed = [];
	if (isAll)
	{
		EZ.toggleCheckbox(el, null, Boolean(EZ.test.data.counts.is3way));
		next = EZ.toggleCheckbox.state;
	}

	(!isAll ? [testrun] : EZ.test.data.testrun).forEach(function(testrun)
	{
		var el = testrun.tags.EZ('ok');
		var checked = el.checked;			//normal non-3way value
		var wasOk = '.savedResults.ok'.ov(testrun) === true;
		if (isAll)
		{									//if next not false and allOk or test not 3way
			checked = !next || !EZ.test.data.counts.is3way ? next
					: !testrun.saveOk
					? checked				//keep checked "as is"
					: wasOk || next 		//otherwise ok true for wasOk else next value
			if (EZ.toggleCheckbox(el, checked, testrun.saveOk) == testrun.okChecked)
			{
				onlySaveOk = onlySaveOk || !testrun.saveOk;
				return;						//continue if no change
			}
			changed.push(testrun.testKey);
		}
		else 								//for single test checkbox . . .
		{
			EZ.toggleCheckbox(el,null,testrun.saveOk == 'some');
		}
		if (!checked && wasOk)				//when unchecking test that was ok
		{									//set as 3way to recheck later
			testrun.saveOk = true;
			EZ.test.data.counts.is3way = true;
		}
		//var now = testrun.okChecked;
		testrun.okChecked = EZ.toggleCheckbox.state;
		updateTestStyles(testrun, isAll);

		if (!isAll)
		{
			//toggleExpected(el.checked);
			setTestOkStatus(testrun);
			formatNote(testrun, 'okChecked');
		}
	});
	if (isAll)
		showCounts();

	if (isAll)
	{
		var msg = 'ok status changed for '
		var count = changed.length;
		if (count == EZ.test.data.counts.all)
			msg += 'ALL tests';
		else if (!count)
			msg = 'ok status NOT changed for any test';
		else if (count == 1)
			msg += 'for test #' + changed[0];
		else
			msg += count  + ' tests: ' + changed.format();

		if (onlySaveOk)
			msg += '&nbsp; &nbsp; &nbsp; (saved results passed)';

		EZ.displayMessage(msg);
		//toggleExpected(el.checked);
	}

	var rtnValue = (next == el.checked)	//cancel click event to keep change
	//======================
	return rtnValue;
	//======================
	/**
	 *	updated expected displayed to specified or actual based on Ok checkbox
	 */
	/*10-18-2016: replaced call with single line of code below
	function toggleExpected()
	{
		//displayResults(testrun, 'expected');
		setTestOkStatus(testrun);
	}
	*/
}
/**
 *	Support for 3way checkbox: false --> some, some --> true and true -- > false
 *
 *	Considered 3way checkbox if is3way argument is true or checkbox has 'EZcheckbox3way'
 *	class.  If is3way argument is true, EZcheckbox3way class added if not found.
 *
 *	When called by click event (next argument is NOT true, false or 'some')
 *		if checked is false, keep false; (should not have 'some' class -- removed if found)
 *		if checked and has 'some' class (some state), remove class -- keep checked=true
 *		if checked, does not have 'some' class AND is 3way checkbox...
 *		...add 'some' class and change checked to false;
 *
 *		returns false if onClick event must be canceled to keep el.checked when changed
 *				otherwise true if event must NOT be canceled to keep el.checked set by event
 *
 *	When called to apply next (true, false or 'some') e.g. from all checkbox click
 *
 */
EZ.toggleCheckbox = function EZtoggleCheckbox(el, next, is3way)
{
	el = EZ(el);
	is3way = is3way !== false && Boolean(is3way || EZ.hasClass(el, 'EZcheckbox3way'));
	EZ.addClass(el, 'EZcheckbox3way', is3way);

	var checked = el.checked;
	var rtnValue = '';
	if (/(true|false|some)/.test(next+''))
	{
		EZ.toggleCheckbox.state = is3way ? next		//next if 3way
								: Boolean(next);	//else affrimative true or false
		rtnValue = EZ.toggleCheckbox.state;
	}
	else
	{
		EZ.toggleCheckbox.state = !checked ? false	//next state always false when checked is false
								: !is3way || EZ.hasClass(el,'some')
									? true			//next state true if not 3way or has some class
								 	: 'some'		//otherwise next state is some (checked set false)
		rtnValue = checked == el.checked;
	}
	el.checked = EZ.toggleCheckbox.state === true;
	EZ.addClass(el, 'some', EZ.toggleCheckbox.state == 'some')
	return rtnValue;
}

//_________________________________________________________________________________________________
e = function _____GENERAL_SUPPORT_FUNCTIONS_____() {}	//convenience for DW functions list
//_________________________________________________________________________________________________

/*---------------------------------------------------------------------------------------------
position rightFlags on right edge of #data table
called by window resize or restoreScrollState() (or toggleScroll() with tr)
---------------------------------------------------------------------------------------------*/
function positionRightFlags(tr)
{
	EZ.clearTimeout(positionRightFlags);							
	var width = EZ('data').clientWidth;
	EZ('messageWrap').style.width = width + 'px';
	
	var right = Math.min(width + 10, EZ('body').clientWidth-1);
	EZ('rightFlagsWrap').style.left = right + 'px';
	
	var pending = EZ.test.app.expandPending;
	if (tr && pending)
	{
		var idx = pending.indexOf(tr);
		if (idx != -1)
			pending.splice(idx,1);
	}
	if (pending)
	{
		EZ.removeClass('restoreScrollStateIcon', 'hidden', pending.length);
		EZ.el.title = EZ.s(EZ.el.title, pending.length);
	}
}
/*----------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
function disableOption(opt, displayName)
{
	var msg = '';
	if (EZ(opt).checked)
	{
		var el = EZ.el;
		var name = displayName || el.name || el.id || opt;
		msg = '-- ' + name + ' disabled';
		EZ.set(el, false);
	}
	return msg;
}
/*----------------------------------------------------------------------------------
called by onClick
----------------------------------------------------------------------------------*/
function toggleDebug(el)
{
	EZ.debug.setMode(el.checked);
	EZ.addClass('body', 'debugOptions', el.checked);
}
/*----------------------------------------------------------------------------------
called by onClick
----------------------------------------------------------------------------------*/
function toggleLog(evt)
{
	var elAll = EZ('debugLog', null);
	var el = evt.srcElement;
	if (el != elAll && el.checked && !elAll.checked)
		elAll.click()
	EZ.event.cancel(evt);		//cancel bubble
}
/*--------------------------------------------------------------------------------------------------
Expand or collapse scrolled column for testKey implied by el or all tests

EZ.addClass(el, toggleClass, isPlus);

expandOne and expandColumn shows dimmed [+] when some expanded (but not all)
	clicking on dim or bright [+] expands all -- clicking on [-] collapses all

TODO: consider EZsetSelectorStyle()
--------------------------------------------------------------------------------------------------*/
function toggleScroll(el, toggleClass, isPlus)
{
	//EZ.timer.clearTimeout();
	var tag;
	if (isPlus === undefined)
	{											//isPlus not specified, toggle class or src
		if (el.src)
		{
			isPlus = el.src.includes('plus');	//clicked on plus
			el.src = el.src.replace(/(plus|minus)/, !isPlus ? 'plus' : 'minus');
		}
		else									//isPlus if updatedClass includes "expand"
			isPlus = (EZ.toggleClass(el, toggleClass).includes(toggleClass))
	}
	var tr = (el.tagName == 'TR') ? el : EZ.getAncestor(el, 'tr', null);
	if (!tr) return;
	
	var scroll = EZ.test.data.scroll;
	var tagIndex = scroll.tagIndex.indexOf(el);
	var tagData = scroll.tagData[tagIndex];		//may be undefined
	var scrollClass = '.scrollClass'.ov(tagData);
	switch (toggleClass)
	{
		case 'expandUpdate':
		{
			if (EZ.hasClass(el, 'expandHeight') && el.scrollHeight > el.clientHeight)
				toggleScroll(el, 'expandHeight');
			if (EZ.hasClass(el, 'expandWidth') && el.scrollWidth > el.clientWidth)
				toggleScroll(el, 'expandWidth');
			return isPlus;
		}
		case 'expandHeight': 					//change height of clicked row for all columns
		{										//inherited from tbody so just set or clear tr height
			if (!tagData) return;
			var height = updateScrollList(el, 'fullHeight');
			if (height === undefined)
				return isPlus;
												
			if (isPlus)							//bump up if content has expanded e.g. note
				height = Math.max(el.scrollHeight, height);
			tr.style.height = height !== 0 ? height + 'px' : '';
			break;
		}
		case 'expandWidth': 					//bit more work if column expanded...
		{										//..keep all scrolled columns in sync
			if (!tagData) return;
			var width = updateScrollList(el, 'fullWidth');
			if (width === undefined)
				return isPlus;
			else if (width === 0)
				width = scroll.autofit.maxAutoWidth[scrollClass];
//			else
//				width = Math.max(el.scrollWidth, width) + 15;
			
			scroll.tagLists[scrollClass].forEach(function(div)
			{
				//div.parentElement.style.width = width + 'px';
				div.style.width = (width) + 'px';

				var tr = EZ.getAncestor(div, 'tr', null);
				if (!tr) return;
				
				var el = EZ('note', tr);
				if (el == div)
					void(0);
				else if (!isPlus)
					el.style.right = el.EZright;
				else
				{
					 el.EZright = el.style.right;
					 var adj = width - scroll.autofit.maxAutoWidth[scrollClass];
					 var right = Math.max(1, scroll.autofit.noteRight - adj);
					 scroll.autofit.noteRight
					 el.style.right = right + 'px';
				}
			});
			break;
		}
		case 'expandBoth': 						//expand both width and height
		{
			if (EZ.hasClass(el, 'scrollWidth'))
			{
				EZ.addClass(el, 'expandWidth', isPlus);
				toggleScroll(el, 'expandWidth', isPlus);
			}
			if (EZ.hasClass(el, 'scrollHeight'))
			{
				EZ.addClass(el, 'expandHeight', isPlus);
				toggleScroll(el, 'expandHeight', isPlus);
			}
			return isPlus;
		}
		case 'expandAll': 						//toggle all
		{
			scroll.rowList.forEach(function(tr)
			{
				toggleScroll(tr, 'expandOne', isPlus);
			});
			return isPlus;
		}
		case 'expandOne': 						//toggle all testKey scroll columns
		{
			EZ(scroll.classNames, tr).forEach(function(div)
			{
				toggleScroll(div, 'expandBoth', isPlus);
			});
			return isPlus;
		}
		case 'expandOneUpdate': 				//update expandOne class / title
		{
			break;
		}
		case 'expandColumn':
		case 'ExpandColumn': 					//toggle scrollClass columns for all rows
		{
			scrollClass = el.id.clip('ExpandColumn'.length);
			scroll.tagLists[scrollClass].forEach(function(div)
			{
				toggleScroll(div, 'expandHeight', isPlus);
			//	toggleScroll(div, 'expandBoth', isPlus);
			});
			return isPlus;
		}
		default:
		{
			return EZ.oops('unknown toggleClass', arguments);
		}
	}
	if (tr)
	{
		EZ.range.removeAll();					//clear all selected text ranges
		
		if (scrollClass)						//update column +/- className/title
		{
			tag = EZ(scrollClass+'ExpandColumn');
			updateScrollControl(tag ,scroll.tagLists[scrollClass], 'row');
		}
		tag = tr.EZ('expandOne');				//update expandOne +/- className/title
		updateScrollControl(tag, tr.EZ(['scrollWidth','scrollHeight']).removeDups(), 'column');

		var isAnyExpand = !tr.EZ(['expandWidth', 'expandHeight'])[0].undefined;
		EZ.addClass(tr, 'scrollbarShow', isAnyExpand);

		if (!g.firstRun)
		{
			positionRightFlags(tr);
			EZ.timer.setTimeout(updateExpandAll, 200);
		}
	}
	//======================
	return isPlus;
	//======================
	//________________________________________________________________________________________
	/**
	 *	Add or remove specified div to specified list and return largest value of specified key
	 */
	function updateScrollList(div, key /* fullHeigh / fullWidth */)
	{
		var which = key.substr(4);			//"Width" or "Height"
		var list = scroll.expanded.widths[scrollClass];
		var value = div['scroll' + which];	//TODO: probably incorrect but may not matter
		if (key == 'fullHeight')
		{
			list = scroll.expanded.heights[tagData.rowIdx];
			value = scroll.autofit.autoRowHeights[tagData.rowIdx];
		}

		var idx = list.indexOf(div);
		if (isPlus && idx == -1)			//add clicked div
			list.push(el);
		else if (!isPlus && idx != -1)		//remove
			list.splice(idx,1);
		else if (value <= div['client' + which])
			return undefined;				//no change

		list.forEach(function(div)
		{									//find widest expanded column
			var idx = scroll.tagIndex.indexOf(div);
			value = Math.max(value, scroll.tagData[idx][key]);
		});
		return value;
	}

	/**
	 *	update [+/-] src and title for expandOne row and scrollClass column
	 */
	function updateScrollControl(el, tags, col)
	{
		var count = 0;			//# of col not fully expanded
		var total = 0;			//scroll columns
		var part = 0;			//partly expanded
		EZ.toArray(tags).forEach(function(el)
		{
			total++;
			if ((EZ.hasClass(el, 'scrollWidth') && !EZ.hasClass(el, 'expandWidth'))
			|| (EZ.hasClass(el, 'scrollHeight') && !EZ.hasClass(el, 'expandHeight')))
			{
				count++;
				if (EZ.hasClass(el, ['expandWidth', 'expandHeight']))
					part++;
			}
		});
		el.title = (!count)         ? EZ.s('collapse # ' + col, total)
				 : (part) 			? EZ.s('fully expand # ' + col, count)
				 : (count == total) ? EZ.s('expand # ' + col, count)
				 : (count < total)  ? EZ.s('expand # remaining ' + col, count)
				 : '';				//safety for unexpected

		el.src = el.src.replace(/(plus|minus)/, count ? 'plus' : 'minus');
		EZ.addClass(el,'some', (count && count < total));
	}
}
/*--------------------------------------------------------------------------------------------------
update expandAll test rows img src and title
--------------------------------------------------------------------------------------------------*/
function updateExpandAll()
{
	var rows = EZ('expandOne', true);
	if (rows[0].undefined)
		rows = [];
	var totalCount = 0;
	var expandCount = 0;
	rows.forEach(function(el)
	{
		if (el.isHidden()) return;

		totalCount++
		if (EZ.hasClass(el, 'some') || el.src.includes('minus'))
			expandCount++;
	});
	
	var dim = false;
	var src = 'plus';
	var title = 'expand all rows';
	if (expandCount)
	{
		src = 'minus';
		title = 'collapse '
			  + (expandCount < totalCount ? EZ.s('# expanded rows', expandCount) 
										  : 'all expanded rows');
		dim = (expandCount < totalCount)
	}
	var el = EZ('expandAll');
	el.title = title;
	el.src = el.src.replace(/(plus|minus)/, src);
	EZ.addClass(el, 'some', dim);
	
	EZ.timer.setTimeout(saveScrollState, 5000, 'expandAllWrap');		
	
	//EZ('scrollProgress').style.visibility = 'hidden';	//don't know why needed
}
/*--------------------------------------------------------------------------------------------------
 *	save list of current expanded columns -- runs in background 5 seconds after scroll change
--------------------------------------------------------------------------------------------------*/
function saveScrollState()
{
	EZ.clearTimeout();	
	if (!'EZ.test.data.options'.ov())
		return;

	delete EZ.test.data.options.expandedScroll;

	var expanded = {};
	var scroll = EZ.test.data.scroll;
	var rows = EZ.test.data.topRowsDisplayed || [];	//.remove(scroll.testsDone);

	rows.forEach(function(tr)	//for all displayed rows...
	{
//		var testno = EZ.get(EZ('testno', tr));
//		var testrun = EZ.test.data.testrun[ EZ.toInt(testno) - 1];
		var testrun = EZ.test.getTest(tr);
		var testExpanded = {};
		scroll.classNames.forEach(function(className)	//for all scroll columns...
		{
			var ovKey = '.' + className + '=';
			var el = testrun.tags.EZ(className);
			if (EZ.hasClass(el, 'expandWidth'))
				ovKey.ov(testExpanded, []).push('expandWidth');
			if (EZ.hasClass(el, 'expandHeight'))
				ovKey.ov(testExpanded, []).push('expandHeight');
		});
		if (Object.keys(testExpanded).length)
			expanded[testrun.testKey] = testExpanded;
	});
	EZ.test.data.options.expandedScroll = expanded;
}
//______________________________________________________________________________
/**
 *	return type as constructor: Undefined, Null for undefined or null respectively
 *	else Array, Boolean, Function, Number, Object, RegExp
 *
 *	TODO: use EZ.getType()
 */
function getType(value)
{
	var type = Object.prototype.toString.call(value);
	return type.substring(8,type.length-1);
}
//______________________________________________________________________________
/**
 *	TODO: if no more...
 *		EZ.addClass(EZ('scriptDiff'), 'hidden');
 *	isOverride: idx or false
 */
function setOverride(testrun, expected)
{
	var isOverride = false;
	if (expected === false)
		delete testrun.override;

	else
	{
		var expectedSave = getExpected(testrun, 'saved');
		
		testrun.override = {};
		testrun.args_idx.forEach(function(idx)	
		{											//ck if saved expected diff from test script
			if ( !(idx in expected) || expected[idx] == EZ.test.notSpecified)
				return;
			
			if (EZ.isEqual(expected[idx], expectedSave[idx], true))
				return;
	
			testrun.override[idx] = EZ.equals.formattedLog;
			isOverride = true;
		});
	 }
}
/*---------------------------------------------------------------------------------------------
called by compare button
---------------------------------------------------------------------------------------------*/
function compareVariants(el, what)
{
	var testrun = EZ.test.getTest(el);
 	if (!testrun.vData) return;

	var leftObj, rightObj;
	var compareOpts = {
		waitEl: el,
		formatter: 'EZtoString',
		formatOpts: g.displayOptions
	}
	switch (what)
	{
		case 'future': 	
		{
			break;
		}
		default: 	
		{
			leftObj = EZ.test.getTest(testrun.testno + 'Y');
			rightObj = EZ.test.getTest(testrun.testno + 'N');
			compareOpts.dl = leftObj.vData.textValue + ' ' + leftObj.testKey.wrap('[]');
			compareOpts.dr = rightObj.vData.textValue + ': ' + rightObj.testKey;
		}
	}	
	if (!leftObj || !rightObj) 
		return;

	EZ.compare(leftObj.actual, rightObj.actual, compareOpts);
}
/*---------------------------------------------------------------------------------------------
called by compare button to compare actual results to expected

idx if supplied is single argument to compare
---------------------------------------------------------------------------------------------*/
function compareResults(testKey, idx, el)
{
	var options = EZ.options.call(g.displayOptions);
	options.htmlformat = false;
	options.collapse = false;
	
	var diff = {oldText:'', newText:''}
	var testrun = EZ.test.getTest(testKey);
	if (idx !== undefined)
	{
		diff.oldText = testrun.argsDeepClone[idx];
		diff.newText = testrun.safe.actual[idx];
	}
	else
	{
		testrun.args_idx.forEach(function(idx)
		{
			var name = testrun.callArgNameLong[idx];
			diff.oldText += EZ.toString( testrun.actual[idx], name, options) + '\n';
			diff.newText += EZ.toString( getExpected(testrun,idx), name, options) + '\n';
		})
	}
	if (el)								//display wait for 2 seconds
		EZ.message.wait(el,2000);
	EZ.compare(diff.oldText, diff.newText);
}
/*----------------------------------------------------------------------------------
return expected value for specified idx: "results", "ctx" or # of test fn argument

For pseudo idx: script, saved, fromEx: return top level Object clone of all expected
values (excluding "not specified") -or-- null if all are "not specified".

idx			"script" or "saved" while determining  testrun.fromEx
			"all" when creating or comparing valueMap

options		"safe" when saving results

		var expected = getExpected(testrun, 'script');
		var expectedSave = getExpected(testrun, 'saved');
----------------------------------------------------------------------------------*/
function getExpected(testrun, idx, options)
{
	if (!idx && idx !== 0) idx = 'results';

	/*
	if (idx == 'all')						//not used??
	{
		var clone = {};
		for (idx in testrun.expected)
		{
			var value  = getExpected(testrun, idx);
			//if (value != EZ.test.notSpecified)
				clone[idx] = value;
		}
		return clone;
	}
	else if (/(script|saved)/.test(idx))	//pseudo idx
	{
		exFrom = idx;
	}
	*/
	if (/(all|script|saved)/.test(idx))		//get all expected -- called before testrun.exFrom set
	{
		var exFrom = testrun.exFrom;
		var clone = {};
		if (idx != 'all')
			testrun.exFrom = idx;

		testrun.args_idx.forEach(function(idx)
		{
			var value  = getExpected(testrun, idx);
			if (value != EZ.test.notSpecified)
				clone[idx] = value;
		});
		testrun.exFrom = exFrom;
		return clone;
	}

	testrun.expectedIcon[idx] = '<img src="../images/script_16.png"'
							  + ' title="test script">';

	var obj = testrun.expected;
	var edit = '.edit.expected'.ov(testrun);
	var saved = '.savedResults.expected'.ov(testrun, {})
	
	if (edit && idx in edit.saved)
	{
		obj = edit.saved		//saved edit value has precedence
		testrun.expectedIcon[idx] = '';
	}
	else if (testrun.isExpectedChanged(idx))
	{
		testrun.expectedIcon[idx] = '<img src="../images/fn_16.png"'
								  + ' title="test script function">';
	}
	else if (testrun.exFrom == 'saved'
	|| (obj[idx] == saved[idx] && obj[idx] != testrun.expectedScript[idx])) 
	{
	//	obj = '.savedResults.expected'.ov(testrun, {})
		obj = saved;
		if (idx in obj)
			testrun.expectedIcon[idx] = '<img src="../images/save.png"'
									  + ' title="saved value">';
	}
	else if (options == 'safe')
	{
		testrun.safe.expected || {};
		testrun.expectedIcon[idx] = '';
	}
	/*
	var obj = (edit && idx in edit.saved) ? edit.saved		//saved edit value has precedence
			: (testrun.exFrom == 'saved') ? '.savedResults.expected'.ov(testrun, {})
			: (options == 'safe') ? testrun.safe.expected || {}
			: testrun.expected;
	*/
	//var value = '.'.concat(idx).ov(obj, EZ.test.notSpecified);
	var value = (idx in obj) ? obj[idx] : EZ.test.notSpecified;

	if (options == 'json')
		value = EZ.test.jsonValue(value);

	return value;
}
/*----------------------------------------------------------------------------------
depricated by: EZ.capture.display()
----------------------------------------------------------------------------------*/
function displayCaptureCounts(action)
{
	var capture = EZ.capture.get();
	if (action == 'reset')
		capture.counts = {};

	//EZ.removeClass('captureResetBtn', 'hidden', counters);

	var html = '';
	Object.keys(capture.counts).forEach(function(key)
	{
		if (!capture.counts[key]) return;
		var limit = capture.limits[key] || '';		//show blank if zero
		html += '<tr>'
			  + '<td>' + key + '</td>'
			  + '<td>' + capture.counts[key] + '</td>'
			  + '<td>' + limit + '</td>'
			  + '</tr>';
	});
	//html += '<tr><td colspan=2 align=center> @ ' + EZ.formatTime() + '</td></tr>';
	EZ.set('captureTime', EZ.formatTime());
	EZ.set('captureCounts', html);

	html = '';
	Object.keys(capture.mode).forEach(function(key)
	{
		var fn = key || 'default';
		html += '<tr>'
			  + '<td>' + fn + '</td>'
			  + '<td>' + capture.mode[key] + '</td>'
			  + '</tr>';
	});
	EZ.set('captureActive', html);
	EZ.set('captureActiveDefault', capture.mode['']);

	EZ.set('captureScriptsCount', capture.queue.counts.scripts);
	EZ.set('captureFaultsCount', capture.queue.counts.faults);
}
/*----------------------------------------------------------------------------------
TODO: prompt to saved test results
----------------------------------------------------------------------------------*/
function resetTests()
{
	var tags = EZ('reset',true);				//clear all test option html tags
	[].forEach.call(tags,function(el)
	{
		if (el.tagName == 'SELECT')
			el.selectedIndex = -1;
		else if (el.tagName == 'SPAN')
			el.innerHTML = '';
		else if (el.type == 'text')
			el.value = '';
	});

	EZ.displayMessage();
	EZsetValue('noteHeading', '');
	addInfo(null);								//clear info, alerts and mimimize [-]
	displayTestNotes(null);						//clear / close test script notes
	
	EZ.field('saveAll', true).resetInitialAttribute('value');
	EZ.hide(['noteHelpIcon']);
	
	EZ.addClass('defaultTestOptions', 'invisible');

	g.testFunction = '';
	EZsetValue('datafilename', '');
	displayTestResultsNote('');
	//EZ('data').style.opacity = '';				//revert to css value

	EZaddClass('body', ['notRun', 'noTestScript']);
	if (EZ.test.data)							// delete prior test script html tags
	{
		var tags = EZ('resultsRow',true);
		if (!'.0.undefined'.ov(tags))
		{
			tags.forEach(function(tag)
			{
				tag.parentElement.removeChild(tag);
			});
			saveData('testOptions', 'resetTests');
		}
	}
	
	EZ.set('testInfoText', '');
	EZ.removeClass('testInfoNotes', 'unhide');
	suggTestOptions('resetTests');
}
/*----------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
function resetHighLight()
{
	EZ.toArray(EZ(['.marker'])).forEach(function(el)
	{
		if (EZ.hasClass(el,'resultsRow'))		//unMark any marker rows
			EZ.addClass(el,'unMarker', EZ.hasClass(el,'marker'));
		//	EZ.addClass(el,'dim');
	});
	if (EZ.hasClass(g.lastSelectedTag,'lastSelected'))
		dimOther(g.lastSelectedTest, 'toggle');

	//EZsetPref(EZ.pref.testMarkers, '');
	EZ.test.data.options.markers = [];
	toggleRunHighlightedButton();
	starburst();
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
function toggleRunHighlightedButton()
{
	var markers = 'EZ.test.data.options.markers'.ov([]);
	var testsDisplayed = 'EZ.test.data.testsDisplayed'.ov([]);
	var count = markers.extract(testsDisplayed).length;
	EZ.addClass('runHighlightedTests', 'visible', count);
}
/*--------------------------------------------------------------------------------------------------
called by setup and when show i.e. filter radio buttons or Plus Highlighted checkbox clicked
Also if more filter option checkbox clicked

#moreRadio is display only singleton radio button used for display only -- clicks are trapped
and call this fn (they do not changed checked value -- it is only changed by code in this fn).
--------------------------------------------------------------------------------------------------*/
function toggleFilter(el)
{
	var value = EZgetValue('show');
	if (!value) return EZ.oops('no filter selected');

	var valuePlus = EZgetValue('plusHighlighted');
	if (el && el.value == 'plus')
	{
		if (el.id != 'plusHighlighted')
			value = el.value;
	}
	if (el && el.value != value)
		value = el.value;					//complex filter with options 

	var primaryFilters = 'showAll hidePass hideFail plus showMarkers showFailOk showNotSaved'.split(' ');
	var simpleMoreFilters = 'showSaved showPass1st showFail1st showFaults ShowDiffLegacy'.split(' ');
	var complexMoreFilters = 'scriptOver lastRun'.split(' ');

	EZremoveClass('data', primaryFilters.concat(simpleMoreFilters,complexMoreFilters));
	removeStyle(toggleFilter.moreStyle);	//remove complex filter if defined
	delete toggleFilter.moreStyle;

	EZaddClass('data', 'plus', valuePlus);	//add "plus" if plus highlighted checked

	EZaddClass('data', value);
	if (primaryFilters.includes(value))
	{
		EZ('#moreRadio').checked = false;
		EZ.removeClass(EZ.el.parentElement, 'more');
	}
	else									//create rules for more filters
	{
		EZ('#moreRadio').checked = true;
		EZ.addClass(EZ.el.parentElement, 'more');
		
		if (!simpleMoreFilters.includes(value))
		{									//build css selector based on checked options
			var nots = [];
			var tags = EZ('.' + value, true);
			tags.forEach(function(el)
			{
				if (value == el.id || !el.checked) return;
				nots.push(el.id)
			});
			toggleFilter.moreStyle = createStyle(nots);
		}
	}
	if ('EZ.test.data.testrun'.ov())			//if tests run i.e. not called by setup(), update scroll
	{
		EZ.message.wait('applying filter', el);
		//setTimeout("addScrollButton(true)", 0);
		setTimeout("EZ.test.data.variants.updateScrollBars(true)", 0);
	}

	//__________________________________________________________________________________________________
	/**
	 *	#data.scriptOver tr:not(.scriptOverResults):not(.scriptOverCtx)::not(.scriptOverArgs) {
	 *		display: none;
	 *	}
	 */
	function createStyle(nots)
	{
		var styleElement,
			rule = "display:none",
			selector = '#data.scriptOver tr.resultsRow'
					 + (nots.length > 0 ? ':not(.' + nots.join('):not(.') + ')' : ':not(.override)');

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
	//__________________________________________________________________________________________________
	/**
	 *
	 */
	function removeStyle(style)
	{
		if (!style) return;
		//style.parentNode.removeChild(style);
		style.removeRule(style.cssRules[0]);		//TODO: works but does not delete style
	}
}
/*----------------------------------------------------------------------------------
called to auto expand collapsed EZtoString elements if rerun or not many lines
TODO: showDetailLines NOT defined

tags is: td.args, td.results or td.expected
----------------------------------------------------------------------------------*/
function showDetails(tags, isRerun)
{
return	//messes up highlight after rerun

	var outerDivs = EZ(['EZtoString'], tags);
	if (outerDivs.undefined)
		return EZ.displayMessage('showDetails: could not find detail tags');

	var isShow = (isRerun)	 			//always show if rerun
	if (!isShow)						//otherwise check if lines <= showDetailLines
	{
		var value = EZgetValues(outerDivs).join('\n');
		value = value.split('\n').remove('');	//drop blank lines
		isShow = (value.length <= EZgetInt('showDetailLines'));
	}
	if (!isShow) return;

	/*TODO:
	var img = EZ('expandOne ', outerDivs[0].parentElement);	//get +/- button from 1st td
	//var img = outerDivs[0].parentElement.getElementsByTagName('img')[0];
	//okClick(img, isShow);
	if (isShow)							//show divs
	{
		var el = tags.EZ('img')
		if (!el.src) return;			//nothing to expand
		el.src = el.src.replace(/plus/,'minus')

		EZshow(tags.EZ(['div']));
	}
	*/
}
/*-----------------------------------------------------------------------------
called from TestData() and validateForm() -- renamed to getParent()
-----------------------------------------------------------------------------*/
function getParent(el,tag,topTag)
{
	if (!el || !tag) return null;
	tag = tag.toUpperCase();
	if (topTag) topTag = topTag.toUpperCase();

	while (true)
	{
		if (el.tagName == tag || el.tagName == topTag) return el;
		if (!el.parentNode) break;
		el = el.parentNode;
	}
	return null;
}
/*-----------------------------------------------------------------------------
-----------------------------------------------------------------------------*/
function doScript(el)
{
	EZ.oops('legacy eval script interface', el)
	//if (!el) return EZ.runScript();					//init history
}
/*--------------------------------------------------------------------------------------------
For all saved exception data (EZ.faults) create test script of the following form:

	//______________________________________________________________________________________')
	EZ.test.skip(1)		//skip next 1 tests for: ...[[function name]...

	note = 'created @ ...[date/time]...<hr><pre>'
		 +  '...stacktrace...</pre>'

	ctx = ".EZ"			... if prototype function
	args = []			... if multiple args
	args[1] = 'abc'		... 1-based -- args[0] not used
	args[2] = 'xyz'		-OR-	arg = 'single str'  -OR-  true, 66. [...]
	EZ.test.options( {ex:null, note:note} )
	EZ.test.run( ctx, args[1], args[2] )
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

--------------------------------------------------------------------------------------------*/
EZ.createTestScript = function EZcreateTestScript(el, callArgNames)
{
	var el = EZ(el);
	var faults = EZ.faults || {};
	var argsDim = 'args = []'

	var lines = [];
	Object.keys(faults).forEach(function(fn)
	{
		if (typeof(fn) != 'object') return;		//skip counters

		lines.push( '//______________________________________________________________________________________')
		var heading = 'EZ.test.skip({0})\t\t//skip next {0} tests for: {1}';
		lines.push( heading.format(faults[fn].length, fn) );

		faults[fn].forEach(function(fault)
		{
			var args =  [fault.ctx].concat(fault.args);
			var notes = 'created @ ' + EZ.formatDate() + '<hr><pre>"\n'
					  + '\t\t + "'
					  + fault.stacktrace.join('\\n"\n\t\t + "')
					  + '</pre>';


			lines.push( '' );
			lines.push( 'note = "' + notes + '"' );

			var callArgs = [];
			args.forEach(function(arg, idx)
			{
				if (idx === 0 && !fault.ctx)
					return;
				else if (idx === 1 && args.length > 2)
					lines.push( argsDim );

				var argName = getArgName(idx);
				var json = getArgValue(idx);

				callArgs.push(argName);
				lines.push( argName + ' = ' + json );
			});
			cleanup();
			lines.push( 'EZ.test.options( {note:note} )' );
			lines.push( 'EZ.test.run( '  + callArgs.join(', ') + ' )' );
		});
		lines.push( '// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .' );
		lines.push( '' );
	});
	var text = '\t' + lines.join('\n\t') + '\n';

	EZ.set(el, text);
	el.select();
	/**
	 *
	 */
	function getArgName(idx)
	{
		var argName = callArgNames ? callArgNames[idx]
					: (idx === 0)  ? 'ctx'
					: 'args[' + idx + ']'

		if (argName.indexOf('args[') != -1 && lines.indexOf('args = []') == -1)
			lines.push( 'args = []' );
		return argName;
	}
	/**
	 *
	 */
	function getArgValue(arg)
	{
		var json = (arg === null) ? 'null'
				 : (arg === undefined) ? 'undefined'
				 : (arg instanceof Date || arg instanceof RegExp) ? EZ.format.value(arg, 999)
				 : (typeof(arg) == 'object') ? EZ.stringify(arg, '*')
				 : EZ.format.value(arg, 999);
		return json;
	}
	/**
	 *	if only "args[0] = ..." 	change to "arg = ..."
	 *	if no "args[...] = ..." 	remove: "args = []"
	 */
	function cleanup()
	{
		var str = lines.join('\n');
		var argsCount = (str.match(/args\[/g) || []).length;
		if (argsCount === 0 || !str.match(/args\[[123456789]/))
		{
			str = str.replace(/args\[0/, 'arg');
			lines = str.split('\n');
			lines.splice( lines.indexOf(argsDim) ,1);
		}
	}
}
/*-----------------------------------------------------------------------------
-----------------------------------------------------------------------------*/
function createTestScript(text)
{
	var from = (text.includes('exceptions')) ? 'faults' : 'scripts';
	var to = EZ.get('testScriptTarget');
	var target = (to == 'file') ? EZ.test.data.scriptFilename
								: EZ(to)
	EZ.test.createTestScript(target, from);
}

/*-----------------------------------------------------------------------------
TODO: \s --> \\\\s
-----------------------------------------------------------------------------*/
function convertToString(el)
{
	var text = (el instanceof Element) ? EZ.get(el) : el;
	text = text.replace(/\\n/g, '###eol###')
	text = text.replace(/\n/g, '###EOL###')
	text = text.replace(/\\/g, "\\\\")
	text = text.replace(/###eol###/g, '\\\\n')

	if (el instanceof Element)
	{
		text = text.replace(/###EOL###/g, "\\n'\n\t   + '")
		text = "\t" + "ex = ''"
			 + "\n\t   + '"
			 + text
			 + "';\n";
		EZ.set(el, text);
		el.select();
	}
	else
	{
		text = text.replace(/###EOL###/g, "\\n'\n\t+ '")	
		text = "\t''"
			 + "\n\t+ '"
			 + text
			 + "'";
		return text;
	}
}
/*---------------------------------------------------------------------------------------------
update eval textarea
---------------------------------------------------------------------------------------------*/
function debugActionSelect(el)
{
	var action = EZ.get(el);
	EZ.set('debugActionValue', action);
	el.selecyedIndex = 0;
	//setTimeout(function() {el.selecyedIndex=0}, 3000);
}
/*---------------------------------------------------------------------------------------------
update eval textarea
---------------------------------------------------------------------------------------------*/
function updateEval(text, title, desc)
{
	text = (text+='') || EZ.test.notSpecified;
	title = (!title || title == 'js') ? 'JavaScript Results'
		  : (title == 'script') ? 'Generated Test Script'
		  : (title || '&nbsp;');
	desc = (desc || '') + ' @ ' + EZ.formatTime();

	EZ.set('evalResults', text);
	EZ.set('evalTitle', title);
	EZ.set('evalDesc', desc);
}

//_________________________________________________________________________________________________
e = function _____SHOW_APP_____() {}	//convenience for DW functions list
//_________________________________________________________________________________________________

/*---------------------------------------------------------------------------------------------
		EZ.set('showAppFilename', el.value.match(/.*\/(.*)/)[1])
		
---------------------------------------------------------------------------------------------*/
function setupShowApp(el)
{
	var app = EZ.get('showApp');
	var where = EZ.get('showAppWhere');
	var folder = EZ.get('showAppFolder').trim();
	var filename = EZ.get('showAppFilename').trim();

	if (g.firstRun) 			//called by setup
	{
		var showAppIcon = app == '-' ? 'showAppNot'
						: app        ? 'showAppGood'
						: where == 'app' ? 'showAppUnknown'
						: '';
		var title = {showAppGood: 'app found', showAppNot: 'app NOTfound', 
					 showAppUnknown: 'click to locate app', '':''}
		EZ.addClass('showAppIcon', showAppIcon);
		EZ.el.title = title[showAppIcon] || '';
		EZ.addClass('showAppDetail', 'dim', where != 'app');
		
		showAppMRU( EZ.get('showAppLastObj') );
		return;
	}
	
	var id = el.id;
	if (id == 'showAppFile')
		EZ.set('showAppFilename', el.value.match(/.*\/(.*)/)[1])

	if (id != 'showAppWhere')
		where = EZ.set('showAppWhere', 'app');

	if (id == 'showAppIcon')
	{
		app = EZ.set('showApp', '');
		EZ.displayMessage();
		EZ.removeClass('showAppIcon', ['showAppGood', 'showAppNot', 'showAppUnknown']);	
		EZ.addClass('showAppIcon', 'showAppSpinner');
		setTimeout(findShowApp, 500);	//wait a bit before processor locks up
	}
	else 
	{
		if (where == 'app' 
		&& (id = 'showAppFile'
		|| EZ.fieldValues.changed('showAppFolder') 
		|| EZ.fieldValues.changed('showAppFilename')))
			app = EZ.set('showApp', '');
		
		if (!app.clip())			//"-" if failed last check
			EZ.removeClass('showAppIcon', ['showAppGood', 'showAppNot']);	
		
		if ((where == 'app' || app == '-') && (folder || filename))
		{
			EZ.addClass('showAppIcon', 'showAppUnknown');
			EZ.el.title = 'click to locate app';
			var msg = 'click on <span class="showAppUnknown"></span> to locate app';
			if (where == 'app')
				EZ.displayMessage(msg, EZ.el, msg);
		}
		else if (!folder && !filename)
			EZ.removeClass('showAppIcon', ['showAppGood', 'showAppNot', 'showAppUnknown']);	
			
	}
	EZ.addClass('showAppDetail', 'dim', where != 'app');

	//__________________________________________________________________________________________________
	/**
	 *
	 */
	function findShowApp()
	{
		var msg = '';
		var app = '';
		var folder = '';
		var filename = EZ.get('showAppFilename').trim();
		if (!filename)
			msg = 'app not specified';
		else
		{
			var showAppFolder = EZ.get('showAppFolder').trim();
			var folders = [showAppFolder].concat(EZ.test.config.appFolders).remove();
			folders.some(function(dir)
			{
				dir = dir.replace(/\\/g, '/').trimPlus('/');
				folder = dir;
				while (!DWfile.exists(folder + '/' + filename))
				{
					var folderList = DWfile.listFolder(folder, 'directories');
					var isFound = folderList.some(function(subdir)
					{
						folder = dir + '/' + subdir;
						return DWfile.exists(folder + '/' + filename);
					});
					if (isFound) break;
					return;					//next folder
				}
				app = folder + '/' + filename;
				return true;
			});
			if (!app)
				msg = 'app not found'
		}
		EZ.removeClass('showAppIcon', 'showAppSpinner');
		if (msg)
		{
			EZ.set(EZ('showApp'), '-');
			EZ.addClass('showAppIcon', 'showAppNot');
			EZ.el.title = 'app NOT found';
			EZ.displayMessage(msg, EZ.el);
		}
		else
		{		
			EZ.set(EZ('showApp'), app);
			EZ.set(EZ('showAppWhere'), 'app');
			EZ.set(EZ('showAppFilename'), filename);
			EZ.set(EZ('showAppFolder'), folder);
			EZ.addClass('showAppIcon', 'showAppGood');
			EZ.el.title = 'app found';
		}
		return app;
	}
}

/*----------------------------------------------------------------------------------
----------------------------------------------------------------------------------*/
function showAppMRU(name)
{
	if (!name)
	{
		var type = EZ.get('debugShowAppListType');
		name = EZ.get(type);
	}
	if (!name || name.startsWith('-')) 
		return;

	EZ('showAppLastObjLink').href = name;
	var results = name.match(/.*\/(.*)/);
	var objName = results ? results[1] : name;

	EZ.el.title = 'show ' + objName;
	EZ.set('showAppLastObj', objName);			
}
/*----------------------------------------------------------------------------------
Display file or object -- called by 
----------------------------------------------------------------------------------*/
function showAppDataSelect(el)
{
	var type = EZ.get('debugShowAppListType');
	var list = EZ(type);
	var isShow = (list && !EZ.get(list).startsWith('-'));	

	EZ.addClass('debugShowAppPromptArrow', 'blink=15000', isShow);
	EZ.removeClass('debugShowAppPrompt', 'invisibile', isShow);

	if (el.type == 'radio')
		setTimeout(function() {list.focus()}, 500);
	else if (el.id)
		EZ.set('debugShowAppListType', el.id);	
}
/*----------------------------------------------------------------------------------
Display file or object -- called by 
----------------------------------------------------------------------------------*/
function showAppData(where, el)
{
	if (where == 'last')
		where = showAppData.where || EZ.get('showAppWhere')
	
	showAppData.where = where;

	if (where == 'app' && !EZ.get('showApp').clip())
		return EZ.displayMessage('no view app defined', el);
	
	var filename = '';
	var type = EZ.get('debugShowAppListType');
	if (!type) return;

	var objName = EZ.get(type);
	var obj;

	if (/\/\\/.test(objName))
		filename = objName;
	
	else if (!(obj = objName.ov()))
	{
		obj = {};
		var processed = [];
		var tags = EZ(objName, true);
		[].forEach.call(tags, function(tag)
		{
			var name = tag.name || tag.id;
			if (!name) return;
			
			if (processed.indexOf(name) != -1) 
				return;
			
			else if (tag.type == 'radio')
				processed.push(name);
	
			obj[name] = EZ.get(tag, true);
		});
	}
	openFile(filename, obj, objName, where);
}
/*--------------------------------------------------------------------------------------------------
07-30-2016:  only called by loadTestScript() and loadTestResults()
--------------------------------------------------------------------------------------------------*/
function setOpenLink(el, filename /*, funcName, noText*/)
{
	var text = filename.replace(/^(.*?)(\/testdata\/)/, '...$2');
	EZ.set(el, text);
	EZ.el.href = filename;
	return filename;
}
/*---------------------------------------------------------------------------------------------
view file or global object 
---------------------------------------------------------------------------------------------*/
function openFile(evt, obj, objName, where)
{
	if (!evt && !obj)
		return EZ.oops('openFile(): requires event or object argument');

	var el, filename, formattedObj = '';
	var folder = EZ.constant.configPath + 'Shared/EZ/';
	var where = where || EZ.get('showAppWhere');
	
	if (evt)						
	{
		if (typeof(evt) == 'object')			//assume evt
		{
			if (where != 'browser')
				EZ.event.cancel(evt,true);
			
			var el = EZ(evt.srcElement);
			if (!el.href && el.parentElement.tagName == 'A')
				el = el.parentElement;
			
			var url = el.href;
			objName = url.match(/.*\/(.*)/)[1];
			obj = objName.ov();					//if href is objName
			if (!obj)
				filename = unescape(url).replace(/.*\{?TESTDATA\}?\/?/, EZ.test.config.testdataURL);

			//showAppMRU(filename || objName);
		}
		else if (!filename.includes('/'))		//href is url / file
			filename = folder + filename;
	}


	if (obj)									//if obj, format with stringify
	{
		do
		{
			var formattedObj = '';
			var formatHow = EZ.get('showAppFormat');
			var title = EZ.isArray(obj) ? obj.length + ' Array items '
					  : obj instanceof Object ? Object.keys(obj).length + ' Object properties ' 
					  : '';			
			title = '//    ' + (title + ' '.dup(30)).substr(0,25) + ' ' + EZ.formatTime() + '\t ' + objName
			var notes = [title];
			if (!obj)
				notes.push('\t[undefined Object]');
			else if (EZ.isEmpty(obj))
				notes.push('\t[empty Object]');
			else
			{
				if (EZ.isObjectCircular(obj))
				{
					notes.push('\t[Circular Object -- formatted with EZ.toString()]');
					formatHow = 'EZtoString';
				}
				obj = [].sortPlus.call(obj);
				formattedObj = formatObject(obj, formatHow, objName); //EZ.stringify(obj,'*');
			}
			formattedObj = (notes.join('\n') + '\n' + formattedObj).trim();
			formattedObj = formattedObj.replace(/\\n/g, '\n');
			if (where == 'browser')
			{
				formattedObj = formattedObj.replace(RegExp(EZ.DOT, 'g'), '&#8226;');
				formattedObj = formattedObj.replace(/</g, '&lt;');
				formattedObj = formattedObj.wrap('<pre>');
			}
			else
			{
				//formattedObj = formattedObj.replace(RegExp(EZ.EOL, 'g'), '\n');
			}	
		}
		while (false)
	}
	if (evt && !filename)
		EZ.event.cancel(evt, true);

	if (where == 'browser' && evt && filename)
	{
		el.target = objName;
		if (filename) return;					//let link open browser
	}
	else if (where == 'textarea')				//read and display file
	{
		if (filename)
			formattedObj = DWfile.read(filename);
		if (!formattedObj)
			formattedObj = 'file empty\n' + filename;
		updateEval(formattedObj, 'object: ' + objName);
		return false;
	}
	else if (!filename)							//create file if obj
	{											//prepend heading to file
		filename = folder + '_view.[' + objName.replace(/\./g, '_') + '].'
				 + (where == 'browser' ? 'html' : 'js');
		DWfile.write(filename, formattedObj);
	}
	
	var app = EZ.get('showApp');
	if (where == 'app' && app.clip())			//show file in app if defined
	{		
		filename = EZurlToFile(filename);
		var script = 'prompt $g\n'				//create _run.bat script
				   + 'set filename=' + filename.replace(/\//g, '\\') + '\n'
				   + 'set cmd=' + app.replace(/\//g, '\\') + '\n'
		//		   + 'set cmd=C:\\Program Files (x86)\\TextPad 4\\TextPad.exe\n'
				   + 'start "" "%cmd%" "%filename%"'
	
		var cmd = folder + '_run.bat';			//create bat file
		if (!DWfile.write(cmd, script))
			return EZ.oops('Error writing: ' + cmd);

		var args = '';							//TODO: don't know how tu use
		dw.launchApp('"' + cmd + '"', args);	//		so using bat file
	}
	else										//display in browser
	{
		EZ('browserTab').href = EZfileToUrl(filename);
		EZ.el.target = objName.replace(/\./g, '_');
		EZ.el.click();
	}
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
