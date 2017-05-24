/*--------------------------------------------------------------------------------------------------
LINT options -- function below not called
--------------------------------------------------------------------------------------------------*/
/*global 
	EZ, e:true, g, dw, DWfile
*/
var e;
(function jshint_globals_not_used() {	//global variables and functions defined but not used
e = [
	e, g, dw, DWfile
]});

/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.event.names = ('abort autocomplete autocompleteerror beforecopy beforecut beforepaste'
			   + ' blur cancel canplay canplaythrough change click close contextmenu'
			   + ' copy cuechange cut dblclick drag dragend dragenter dragleave'
			   + ' dragover dragstart drop duratichange emptied ended error focus'
			   + ' input invalid keydown keypress keyup load loadeddata loadedmetadata'
			   + ' loadstart mousedown mouseenter mouseleave mousemove mouseout mouseover'
			   + ' mouseup mousewheel paste pause play playing progress ratechange'
			   + ' reset resize scroll search seeked seeking select selectstart show'
			   + ' stalled submit suspend timeupdate toggle volumechange waiting'
			   + ' webkitfullscreenchange webkitfullscreenerror wheel').split(' ');

  //----------------------------------------------------------\\
 //----- http://davidwalsh.name/essential-javascript-functions \\
//--------------------------------------------------------------\\

/*-----------------------------------------------------------------------------
EZ.event.add(eventObj, eventName, callback [, wait] [, immediate])

Add event handler for specified eventObj and eventName for callback function.
If wait specified, callback is not called for repeated events in specified wait
time interval (milli-seconds).

ARGUMENTS:
	eventObj	(required) HTML element or Object of event e.g. window
	
	eventNames	(required) Array or comma delimited String specifing one or more
				events for e.g. 'resize'.  All events share same wait interval.
	
	callback	(required) function called when event fires
	
	wait		(optional) if not supplied or 0, callback called for every event.
				otherwise specifies time interval in milliseconds in which repeated
				events are ignored -- i.e. callback only called at start and/or end 
				of wait interval -- negative if callback called on first event.
				default: 0 -- if NaN specifies immediate and default: 500
	
	immediate	(optional) If true, callback called at start of wait interval.	 
				If "both" callback called at start -AND- end of wait interval.
				default: false or true if wait is negitive number.

NOTES:
	Bouncing is the tendency of any two metal contacts in an electronic device to 
	generate multiple signals as the contacts close or open; debouncing is any kind 
	of hardware device or software that ensures only a single signal will be acted 
	upon for a single opening or closing of a contact within certian timeframe.

	Software examples are: mouse click, mouse drag or key pressed in form field.

USAGE:
	EZ.event.add(window, 'resize', myFunc, 500)
	EZ.event.add(g.txtLabels, 'keyup', updateGroupLabels, 1000);

TODO:
	group multiple event for same Object as single debounce ??

REFERENCE: base for wait logic
	http://davidwalsh.name/essential-javascript-functions	
-----------------------------------------------------------------------------*/
EZ.event.add = function EZeventAdd(eventObj, eventNames, callback, wait, immediate) 
{
	if (!eventObj || !eventNames || typeof(callback) != 'function') return;
	
	wait = wait || 0;
	if (isNaN(wait))
	{
		immediate = immediate || wait;
		wait = 500;	
	}
	immediate = immediate || wait < 0;
	
	var isLegacy = EZ.isLegacy();
	var fn, timeout = null;
	if (!wait)
		fn = callback
	else								//create event handler fn
	{	
		fn = function EZeventDebounce() 
		{
			var context = this;			//object containing event
			var args = arguments;		//event args
			var later = function EZeventDebounceLater() 
			{
				timeout = null;
				if (!immediate || immediate.toLowerCase() == 'both') 
					callback.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, Math.abs(wait));
			if (callNow) callback.apply(context, args);
		}
	}
	EZ.toArray(eventNames, ', ').forEach(function(eventName)
	{									//make lowerCase and remove "on" prefix if any
		if (typeof(eventName) == 'string')
		{
			eventName = eventName.indexOf('field') != -1 ? getFieldChangeEvent(eventObj)
					  : eventName.replace(/(on)?(.*)/, '$2').trim().toLowerCase();
		}
		if (!eventName) return;
			
		if (typeof(eventObj) != 'string' && isLegacy)
		{
			if (eventObj.addEventListener) eventObj.addEventListener(eventName, fn, false);
			else if (eventObj.attachEvent) eventObj.attachEvent('on' + eventName, fn);
			return;
		}
		EZ.toArray(EZ(eventObj,true)).forEach(function(eventObj)
		{								// activate event handler to call above fn
			if (eventObj.addEventListener) eventObj.addEventListener(eventName, fn, false);
			else if (eventObj.attachEvent) eventObj.attachEvent('on' + eventName, fn);
		});
	});

	//______________________________________________________________________________
	/**
	 *	EZ.field should superceed
	 */
	function getFieldChangeEvent(el)
	{
		if (!EZ.isEl(el)) return '';

		var tagType = el.type || el.tagName || '';
		if (el.length && el[0].tagName == 'radio')
			tagType = el[0].tagName;
		
		switch (tagType.toLowerCase())
		{
			case 'text': 	
			case 'textarea': 	
			case 'password': 	
				return 'blur';

			case 'img': 	
			case 'button': 	
			case 'radio': 
			case 'checkbox': 	
				return 'click';

			case 'select-one':
				return 'change';

			//case 'hidden': 	
			default:
				return '';
		}
	}	
}
/*----------------------------------------------------------------------------------
http://codepen.io/MadeByMike/pen/sBjzn
http://madebymike.com.au/writing/detecting-transition-start/
----------------------------------------------------------------------------------*/
EZ.event.createTransitionEvents = function createTransitionEvents()
{
	var whichTransitionEvent = function()
	{
		var el = document.createElement('fakeelement');
		var transitions = {
			'transition':'transitionend',
			'OTransition':'oTransitionEnd',
			'MozTransition':'transitionend',
			'WebkitTransition':'webkitTransitionEnd'
		};
		for (var t in transitions)
			if (el.style[t] !== undefined)
			  return transitions[t];
	};

	var transitionEvent = whichTransitionEvent();
	if (transitionEvent)
	{
		if (window.CustomEvent) 					//create transition-start/end custom event
		{
			var transitionStartEvent = new CustomEvent('transition-start',{'bubbles': true, 'cancelable': true});
			var transitionEndEvent = new CustomEvent('transition-end',{'bubbles': true, 'cancelable': true});
		} 
		else 
		{
			var transitionStartEvent = document.createEvent('CustomEvent');
			var transitionEndEvent = document.createEvent('CustomEvent');
			transitionStartEvent.initCustomEvent('transition-start', true, true);
			transitionEndEvent.initCustomEvent('transition-end', true, true);
		}
		document.body.addEventListener(transitionEvent, function(evnt) 
		{
			//console.log(evnt.elapsedTime);			// FF does not report the exact time here.
			if (evnt.elapsedTime <= 0.00001)
				evnt.target.dispatchEvent(transitionStartEvent);
			else
				evnt.target.dispatchEvent(transitionEndEvent);
		});
	}
}
/*--------------------------------------------------------------------------------------------------
Trigger eventName(s) on spectfied html element(s)

If eventName not specified, trigger all events found on specified elements.
--------------------------------------------------------------------------------------------------*/
EZ.event.trigger = function EZevent_trigger(el, eventName) 
{											
	var me = arguments.callee;
	var tagList = [];
	var tags = EZ(el, EZ.isArray(el)); 
	tags.forEach(function(el)
	{
		if (el.undefined) return;
		
		var evtList = eventName || _triggerAllEvents(el);
		if (!evtList.length) return;
		
		var outerHTML = el.outerHTML.replace(/\s*(<[\s\S]*?>)[\s\S]*/, function(all,html)
		{
			html = html.replace(/\s*\n\s*/g, ' ');//.replace(/"/g, '');
			html = html.replace(/(on\w+?=)/ig, '\n\t$1');
			return html;
		});
		evtList.forEach(function(evtName)
		{
			_trigger(el, evtName);
		})
//		console.log('triggered events', evtList, outerHTML)
		EZ.log.call(me, evtList, '\n', outerHTML)
		tagList.push(outerHTML);
	});
	return tagList;
	
	//______________________________________________________________________________________________
	/**
	 *	Cloned from EASY.formfields.js but not originally used
	 *	08-13-2016: fixed for non-IE browser and tested in EZtest_assistant for chrome
	 */
	function _trigger(el, eventName)
	{
		var evt, opts = {
			bubbles: false, 
			cancelable: true,
			view: window,
			ctrlKey:false, altKey:false,
			shiftKey:false, metaKey:false,
			detail:0, button:0,
			screenX:0, screenY:0, clientX:0, clientY:0,
			relatedTarget: undefined,
			trigger: true
		};
		
										
		if (EZ.MSIE || EZ.isIEw3c)		//OLD COMMENT: does not work (may have applied to chrome)...
		{								//...perhaps document.body.parentNode --> el.parentNode ??
			//http://marcgrabanski.com/simulating-mouse-click-events-in-javascript/
			var args = [eventName,
				opts.bubbles, opts.cancelable, opts.view, opts.detail,
				opts.screenX, opts.screenY, opts.clientX, opts.clientY,
				opts.ctrlKey, opts.altKey, opts.shiftKey, opts.metaKey,
				opts.button, document.body.parentNode
			]
			evt = eventName.startsWith('mouse') ? document.createEvent('MouseEvents')
				: eventName.startsWith('key') ? document.createEvent('KeyBoardEvents')	//??
				: document.createEvent('Events');										//??
			eventName.startsWith('mouse') ? evt.initMouseEvent.apply(el, args) :
			eventName.startsWith('key')   ? evt.initKeyboardEvent.apply(el, args) :
											evt.initEvent.apply(el, args);
		}
		else							//08-13-2016:
		{
			//https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
			evt = eventName.startsWith('mouse') ? new window.MouseEvent(eventName, opts)
				: eventName.startsWith('key') ? new window.KeyboardEvent(eventName, opts)
				: new Event(eventName, opts);								
		}
		try
		{
			el.dispatchEvent ? el.dispatchEvent(evt) 
							 : el.fireEvent('on' + eventName, evt);
			void(0);
		}
		catch (e)		//TODO: need wrapper to catch
		{
			EZ.oops('exception in event: ' + eventName, e);
		}
	}
	//______________________________________________________________________________________________
	/**
	 *	return all events for el except: EZfield_onArrive/onLeave
	 */
	function _triggerAllEvents(el)
	{
		var evtList = [];
		EZ.event.names.forEach(function(evtName)
		{
			var evt = el['on' + evtName];
			if (!evt || typeof(evt) != 'function' || evt.name.startsWith('EZfield_'))
				return;
			evtList.push(evtName);
		})
		return evtList;
	}
};
// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
//_____________________________________________________________________________________________
EZ.event.trigger.test = function()
{
	var win = window;
	var doc = win.document;
	doc = doc;
	EZ.test.run();
}
/*-----------------------------------------------------------------------------
EZ.poll(fn, callback, errback, timeout, interval)

USAGE:
	poll		// ensure element is visible
	(
		function() {
			return document.getElementById('lightbox').offsetWidth > 0;
		},
		function() {
			// Done, success callback
		},
		function() {
			// Error, failure callback
		}
	);

REFERENCE: base before enhancements
	http://davidwalsh.name/essential-javascript-functions	
-----------------------------------------------------------------------------*/
EZ.poll = function EZpoll(fn, callback, errback, timeout, interval) 
{
    var endTime = Number(new Date()) + (timeout || 2000);
    interval = interval || 100;

    (function p() 
	{
            // If the condition is met, we're done! 
            if(fn()) 
				callback();
            
            // If the condition isn't met but the timeout hasn't elapsed, go again
            else if (Number(new Date()) < endTime) 
                setTimeout(p, interval);
            
            // Didn't match and too much time, reject!
            else 
                errback(new Error('timed out for ' + fn + ': ' + arguments));
    })();
}
/*-----------------------------------------------------------------------------
EZ.once(fn, context) 

Only calls callback function once -- onload functionality

USAGE:
	var canOnlyFireOnce = once(function() {
		console.log('Fired!');
	});
	
	canOnlyFireOnce(); // "Fired!"
	canOnlyFireOnce(); // nada

REFERENCE: base before enhancements
	http://davidwalsh.name/essential-javascript-functions		
-----------------------------------------------------------------------------*/
EZ.once = function EZonce(fn, context) 
{ 
	var result;
	return function() 
	{ 
		if (fn) 
		{
			result = fn.apply(context || this, arguments);
			fn = null;
		}
		return result;
	};
}
/*-----------------------------------------------------------------------------
EZ.isNative(fn)

USAGE:
	isNative(alert); 			// true
	isNative(myCustomFunction); // false
-----------------------------------------------------------------------------*/
/*
;(function() {

  // Used to resolve the internal `[[Class]]` of values
  var toString = Object.prototype.toString;
  
  // Used to resolve the decompiled source of functions
  var fnToString = Function.prototype.toString;
  
  // Used to detect host constructors (Safari > 4; really typed array specific)
  var reHostCtor = /^\[object .+?Constructor\]$/;

  // Compile a regexp using a common native method as a template.
  // We chose `Object#toString` because there's a good chance it is not being mucked with.
  var reNative = RegExp('^' +
    // Coerce `Object#toString` to a string
    String(toString)
    // Escape any special regexp characters
    .replace(/[.*+?^${}()|[\]\/\\]/g, '\\$&')
    // Replace mentions of `toString` with `.*?` to keep the template generic.
    // Replace thing like `for ...` to support environments like Rhino which add extra info
    // such as method arity.
    .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );
  
  function isNative(value) {
    var type = typeof value;
    return type == 'function'
      // Use `Function#toString` to bypass the value's own `toString` method
      // and avoid being faked out.
      ? reNative.test(fnToString.call(value))
      // Fallback to a host object check because some environments will represent
      // things like typed arrays as DOM methods which may not conform to the
      // normal native pattern.
      : (value && type == 'object' && reHostCtor.test(toString.call(value))) || false;
  }
  
  // export however you want
  module.exports = isNative;
}());
*/
