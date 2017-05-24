/**************************************************************************************

EZ.getEl, upgraded and moved to EZget_set.js

***************************************************************************************/




/*---------------------------------------------------------------------------------------------
For new organizational structure, functions moved to one of the following files:

	EZ/RZprototypes.js	(same file) and should also match EASY.prototypes.js
									prototypes and related functions
	EZ/RZgetset.js		(same file) future replacement for EASY.core.js::EZ(...)
	EZ/RZcommon.js		(same file) common functions from RevizeCommon.js non-dreamweaver specific
									and partial port of EASY.js functions
	EZdwutils.js 		(latest)	Dreamweaver/Revize specific functions: e.g. getDOM()
	RZdwutils.js		(legacy)	old versions of DW functions used by Revize Extension
----------------------------------------------------------------------------------------------
Define global varibles if not defined -- EZ() requires EZprototypes.js
It is simply defined here to properly initialize the global EZ object as a function.
---------------------------------------------------------------------------------------------*/
/*global
EZgetTagType,
EZ, dw:true, e:true  */
/*global EZnone, EZtoArray, EZis, EZisEl, EZgetPref, EZsetPref, EZsetValue  */

var e;
(jshint_globals_not_used = function jshint_globals_not_used() {	//global variables and functions defined but not used
e = [e]
});
if (!window.dw) dw = {isNotDW: true};
if (!EZ.dw)
{									//global data shared by all commands
	EZ.dw = window.dw ? dw.constructor.EZ : {};
	if (!EZ.dw) EZ.dw = dw.constructor.EZ = {};
}

EZ.legacy = EZ.merge(EZ.legacy,
{
	//EZisEmpty: false,
	//EZgetEl:true,
	//EZgetEl_notFound:null,
	//EZgetStyle:false,
	//EZhasClass:false,
	'':''
});
/*---------------------------------------------------------------------------------------------
EZ.getEl(selectors, doc)       -- FULL FUNCTIONALITY --

If multiple elements match the selector or the selector is a collection al elements, only the
1st element is returned.  If the selector is an array, all elements matching all non-empty
selectors is returned.  To always get a single element for selector arrays, use EZ._().

if no element is found matching any of specified selectors, a generic element is returned not
connected to anything visible. It has all the most common properties and attibutes of any tag.

This avoids js errors when subsequent code assumes an element or field is returned which often
happens when selectors are mis-spelled or elements are deleted w/o deleting all related script.

Only enough selectors are tried until one or moe elements match form fields or elements
UNLESS called from EZ.getAll() in which case all selectors are processed. In either case,
selectors are used until match found for fieldname, id, tagName or className in that order.


ARGUMENTS:
	selectors	one or more html elements or a comma delimited string of selector(s), or array
				of elements and selectors (only one element or selector allow per array item)

	doc			(optional)	root element used to locate elements matching specified selectors
							defaults to document if only 2 args and 2nd arg is options

	options		(optional) 	determines how many elements are returned and/or an array containing
				(last arg)	one or more elements is returned as explained below:

				false	only one element returned
				true	only 1st element found is returned as single element array
				@		all elements matching any of the selectors always returned as
						array even if none are found

				default	=true when selectors arg is array =false otherwise

RETURNS:
	either single element or array of elements matching one or more selectors -- if no elements
	are found matching any of the supplied selectors, a pseudo element is created and returned.

TODO:
	support selector prefixes and only try matching associated type:
	"#" element id -- "." className -- "@" fieldName -- "<" tagName with or w/o ">" suffix
	when id or field name specified, only select if under doc root
	compound seelectors e.g. #someid.li ul
	multiple arguments containing more selectors ??


	// determine if stopping after 1st match or using all all selectors
	var patternfunction = /function\s*(\w*)\s*\((.*?)\)[^{]*{\s*([\s\S]*)}/;
	var callerName = EZ.matchPlus(arguments.callee.caller, patternfunction)[1];
	var stopAfterFirst = /^(RZ|EZ)_$/.test(callerName)		//always stop if caller EZ._()
					  || /^(RZ|EZ)\$$/.test(callerName) 	//never stop if caller EZ$() or ...
					  || (!EZ.is(els) && els.length > 1);	//...multiple selectors but not els

--------------------------------------------------------------------------------------------------*/
EZ.getEl = function EZgetEl(selectors, nodes)
{
	var settings = EZ.is(nodes, EZgetEl.getSettings)
				 ? EZ.merge(nodes, {selectors:selectors})		//called with pre-defined settings
				 : new EZ.getEl.getSettings(this, arguments); 	//breakpoint for settings not defined

	/**	PARTIAL LIST OF SETTINGS:
	 *
	 *	one:T/F only return 1st html element found -- all:T/F return Array of all tags for all selectors
	 *
	 *	root(s) starting dom nodes -- nodes: additional starting nodes -- doc: legacy single root
	 *
	 *	selectors: Array of selectors: only first match unless specified as Array (implicit all:true)
	 *
	 *	notFound: object returned if no tags found: EZnone by default -- null if nodes=null
	 */
	//--------------------------------------------------------------------
	// 	legacy code -- doc must be document object
	//	use above new code for correct doc value
	//--------------------------------------------------------------------
	if (settings.legacy)
	{
		var doc = settings.doc;
		var els = settings.selectors[0];
		for (var i=0; i<els.length; i++)
		{
			var el = els[i] || '';
			if (el == null) continue;

			if (typeof(el) != 'object' && doc.forms.length && doc.forms[0][el])
				el = doc.forms[0][el];			//el is form field

			if (typeof(el) != 'object') 		//if not object, try as id
				el = doc.getElementById(el + '');

			if (el == null)
			{
				var tags = document.getElementsByTagName(els[i]+'');
				if (tags.length) return tags[0];
			}
			if (el) return el;					//return if element
		}
		return null;							//null if el not found
	}

	//--------------------------------------------------------------------
	// newest code
	//--------------------------------------------------------------------
	var tags = [];

	//----- Nothing selected
	while (settings.selectors.length > 0 && settings.roots.length > 0)
	{
		//----------------------------------------------------------------------------------
		//----- FAST SELECT: all selectors are elements
		//----------------------------------------------------------------------------------
		if (EZ.isEl(settings.selectors))	//nodes exploded && (!settings.nodes.length || EZ.isEl(settings.nodes)))
		{									//keep tags in default or specified root(s)
			tags = settings.selectors;
			if (!EZ.getEl_getDescendants(tags, settings.roots))
				break;

			if (settings.nodes.length)
				EZ.getEl_getDescendants(tags, settings.nodes);
			break;
		}

		//----------------------------------------------------------------------------------
		//----- Full selection algorithm
		//----------------------------------------------------------------------------------
		[].every.call(settings.selectors, function forEverySpecifiedSelector(sel)
		{
			if (!EZ.getEl_isSelectorType(sel) || sel == null) return true;	//skip invalid type

			sel = EZ.toArray(sel, false);	//TODO ','
			[].every.call(settings.selectors, function forEveryCommaDelimitedSelector(sel)
			{
				if (!EZ.getEl_isSelectorType(sel) || sel == null) return true;

				return [].every.call(settings.roots, function forEveryRootElement(root)
				{
					//-----------------------------------------------------------------------------
					// recursively call EZ.getEl() for chained selections from:
					// 		optional nodes argument when called from context element...
					//							...fully exploded into elements by getSettings()
					//		-AND/OR- by space delimited selectors ... exploded below
					//-----------------------------------------------------------------------------
					var chainedSelections = EZ.toArray(sel,' ');
					sel = chainedSelections.pop();			//remove single selector or last in chain
					[
						settings.nodes, 					//1st apply nodes selector
						chainedSelections					//selector(s) exploded except last one
					].forEach(function forEachChain(nodes)
					{
	if (nodes.length > 0) debugger;
	if (EZ.quit) return false;
															//for ALL nodes and chained selections . . .
						nodes.forEach(function forEachChainedSelector(node)
						{									//get and save ALL matching tags  . . .
							EZ.getEl_addElements(nodes, EZ.getEl(node, settings.baseSetting));
						});									//last selector applied to all matches
					});

					//----- if selector is element, array of elements or html collection
					if (EZ.isEl(sel)							//...only add elements descendant of roots??
					&& EZ.getEl_getDescendants(sel,root))
						if (EZ.getEl_addElements(sel)) return;

					//----------------------------------------------------------------------------
					// for compound selector (e.g #footer.div.input) keep checking until any part
					// of selectors does not match or all parts checked.
					//-----------------------------------------------------------------------------
					var parts = EZ.getEl_getCompoundParts(sel);
					if (!parts) parts = [];
	if (parts.length > 1) debugger;
	if (EZ.quit) return false;

					return parts.every(function forEverySelectorPart(sel)
					{
						if (sel == null) return false;			//invalid compound
						if (EZ.isArray(sel)) 					//sel is Array of parts if compound . . .
						{
							return sel.every(function forEveryMatchingPart(sel)
							{
								if (!sel) return true;			//continue empty or EZnone selector
								el = EZ.getEl(el, settings.baseSettings);
								if (!el.length) 			//if not found, break out of loop
									return false;
								if (EZ.getEl_addElements(el)) 	//also break if one is enough
									return false;
							});
						}
						//??? NOTE: below code is only run via recursive if above compound code runs
						var e, prefix = '';
						if (typeof(sel) == 'string')
						{
							var groups = sel.matchPlus(/([#.<@])?(.*?)(>|$)/);
							prefix = groups[1];			//if selector qualified with: # . < -or- @
							sel = groups[2];						//remove qualifier
						}
						if ('@'.indexOf(prefix) < 1)
						{											//try for form field match
							e = EZ.getEl_getFormField(sel,root)
							if (e != null)
							{
								if (EZ.getEl_addElements(e)) 	//quit if one is enough
									return false;
							}
						}
						if ('#'.indexOf(prefix) < 1)
						{										//try for id match
							e = EZ.getEl.getDocument(root).getElementById(sel);
							if (EZ.isEl(e) && EZ.getEl_getDescendants(e,root) != null)
							{
								if (EZ.getEl_addElements(e)) 	//quit if one is enough
									return false;
							}
						}
						if ('<'.indexOf(prefix) < 1)
						{										//try as tagName
							e = root.getElementsByTagName(sel);
							if (EZ.isEl(e))
							{
								if (EZ.getEl_addElements(e)) 	//quit if one is enough
									return false;
							}
						}
						if ('.'.indexOf(prefix) < 1)
						{										//try as css class
							e = root.getElementsByClassName(sel)
							if (EZ.isEl(e))
							{
								if (EZ.getEl_addElements(e)) 	//quit if one is enough
									return false;
							}
						}
						return true;	//breakpoint here for not found or selecting all
					}); //end of compound parts
				});	//end of roots
			});	//end of comma delimited selector
		});	//end of selectors
		break;
	} //end Fast or Full selection

	//----- Set tags to settings.notFound if no tags selected
	if (!tags.length)
	{
		var notFound = '.notFound'.ov(settings) || 'EZnone';
		tags = notFound == 'EZnone'
			 ? [EZ.none(settings)]			//EZ.none() pseudo tag is default
			 : typeof(settings.notFound) == 'object'
			 ? settings.notFound			//e.g. [] or {} and null
			 : [settings.notFound];			//Array if notFound is not object
	}
	else
		tags = tags.removeDups();

	EZ.tags = tags;
	EZ.el = tags[0];
	//================================================================================
	if (settings.one && tags != null)		//if returning 1st tag...
		return EZ.bindElements(tags[0]) 			//...bind 1st tag if not yet bound
	else									//if returning Array or html collection...
		return EZ.bindElements(tags)				//...bind Array/collection and tags
	//================================================================================
	/**
	 *	Add nodes to tags array, return true to continue selecting elements
	 */
	EZ.getEl.addElements = function EZgetEl_addElements(nodes)
	{
		if (nodes == null) return true;

		if (settings.asis && !tags.length && EZ.isArrayLike(nodes))
			tags = nodes;		//save html collection as is if no other tags

		else
		{
			if (!EZ.isArrayLike(tags))			//html collection...
				tags = [].slice.call(tags);		//...copy to new Array

			EZ.toArray(nodes).forEach(function(el)
			{
				tags.push(el) 					//add each node to tags
			});
		}
		return !settings.all;	//return true to quit selecting more nodes
	}
	/**
	 *	return selector parts as Array of selectors for compound selectors
	 *	otherwise return selection as single element Array.
	 *
	 */
	EZ.getEl.getCompoundParts = function EZgetEl_getCompoundParts(sel)
	{
		if (typeof(sel) != 'string') return [sel];		//return if not string
		if (/:\]\[]/.test(sel)) return undefined;		//unsupported selector char
		if (!/[#.:\]\[\w\d]/.test(sel)) return null;	//invalid selector char

		var groups = sel.matchPlus(/(\S)(([#.])([\w\d]*))/);
		if (!groups == false) return [sel];				//if nothing found, not compound

		var parts = [];
		if (/^[\w\d]/.test(groups[0]))					//1st part is tag
			parts.push('<' + groups.shift());

		while (groups.length)							//process remaining parts
		{
			var prefix = groups.shift();
			if (!groups.length) return null;		//invalid if last taken
			if (/^[\w\d]/.test(groups[0])) return null;	//invalid if not followed by word
			parts.push(prefix + groups.shift());
		}
		return parts;
	}
	/**
	 *	Get html collection of all form field(s) matching selector -- return any that are decendents
	 *	of element that called EZ.getEl() -or- all elements if EZ.getEl() was not called from element.
	 *
	 *	return null if none found or none are decendents otherwise return those that are decendents.
	 */
	EZ.getEl.getFormField = function EZgetEl_getFormField(sel,root)
	{
		var tags = [];
		[].every.call(EZ.getEl.getDocument(root).forms, function forEveryForm(form)
		{
			if (!form[sel]) return true;	//keep looking until field(s) found

			if (false && !tags.length)
				tags = EZ.toArrayLike(form[sel]);	//retain html collection
			else
			{
				tags = [].slice.call(tags);
				tags = tags.concat(EZ.toArray(form[sel]));
			}

			//tags.push(form[sel]);
			if (EZ.getEl_getDescendants(tags,root) == null)
				return true;				//keep looking if no tags are descendants
		});
		return (tags.length > 0) ? tags : null;
	}
	/**
	 *	return tags that are decendents of element that called EZ.getEl()

	 disabled this test
	 -OR- all tags returned when
	 *	EZ.getEl() not called from an element i.e. EZgetEl.settingsroot is document object.
	 */
	EZ.getEl.getDescendants = function EZgetEl_getDescendants(tags, root)
	{
		if (tags == null) return tags;	// || root == document //could have diff document
		tags = EZ.toArray(tags, false);
		for (var idx=tags.length-1; idx>=0; idx--)
		{
			//if (root.indexOf(tags[0].ownerDocument) != -1) continue;

			if (!EZ.isAncestor(tags[idx], root))
				Array.prototype.splice.call(tags, idx, 1);	//remove tags[idx] is not decendent
		}
		return (tags.length > 0) ? tags : null;
	}
	/**
	 * 	return true if valid variable typeof and valid element, Array or collection of elements
	 * 	TODO: ^([.#a-zA-Z0-9_:[\])])+[,><a-zA-Z0-9_~=\"\":[\] ]*?$
	 */
	EZ.getEl.isSelectorType = function EZgetEl_isSelectorType(sel)
	{
		if ((!sel && sel !== '0')
		|| 'string number object'.indexOf(typeof(sel)) == -1)
			return false;	//skip empty or EZnone selector

		if (typeof(sel) == 'object' && !EZ.isEl(sel))
			return false;

		return true;
	}
}
//_____________________________________________________________________________________________
EZgetEl.test = function ()
{
	/*global
		tstArrayObj, tstArrayObj.abc, tstFn, tstObj, tstObjArrayLike, tstObjArrayLike.xyz,
		tstObjEmptyArray, t_doc, t_html, t_head, t_title, t_body, t_wrap, t_labels, t_inputs,
		t_forms, t_fm, t_none, t_tags, t_array, t_divs, t_radios, t_radio01, t_label_some,
		t_mixed, t_idandclass
	*/
	(function jshint_globals_not_used() {	//global variables and functions defined but not used
	e = [
		tstArrayObj, tstArrayObj.abc, tstFn, tstObj, tstObjArrayLike, tstObjArrayLike.xyz,
		tstObjEmptyArray, t_doc, t_html, t_head, t_title, t_body, t_wrap, t_labels, t_inputs,
		t_forms, t_fm, t_none, t_tags, t_array, t_divs, t_radios, t_radio01, t_label_some,
		t_mixed, t_idandclass
	]})

	EZ.test.run("----- backup copy of saved data -----", {EZ: {note:'not chained selector'}});
if (true) return;


	var ex_radios = [].slice.call(t_radios);
	EZ.test.run(['EZtest_radio'],	{EZ: {ex:ex_radios, 	note:'selector: radio group name'}});
	EZ.test.run(['test_id1'],t_wrap,	{EZ: {ex:t_idandclass, 	note:'id AND class'}});

	EZ.test.run('input',t_wrap,			{EZ: {ex:t_inputs[0], 	note:'field'}});
	EZ.test.run('EZTEST_TAG' ,t_wrap,	{EZ: {ex:t_tags[0],		note:'tag'	}});
	EZ.test.run('EZtest_class0',t_wrap,	{EZ: {ex:t_tags[0],		note:'class'}});
	EZ.test.run('test_id1',t_wrap,		{EZ: {ex:t_labels[1], 	note:'id selector'}});

	EZ.test.run('.test_id1',t_wrap,		{EZ: {ex:t_inputs[3], 	note:'class not id'	}});
	EZ.test.run('@input',t_wrap,		{EZ: {ex:t_inputs[0], 	note:'field'}});
	EZ.test.run('<tags',t_wrap,			{EZ: {ex:t_tags[0],		note:'tag'	}});
	EZ.test.run('.class1',t_wrap,		{EZ: {ex:t_tags[1],		note:'class'}});

	//EZ.test.run(tags.EZ, '', 			{EZ: {ex:t_none, 		note:''		}});
	EZ.test.run(null, 					{EZ: {ex:t_none, 		note:''		}});
	EZ.test.run(0, 						{EZ: {ex:t_none, 		note:''		}});
	EZ.test.run('0', 					{EZ: {ex:t_none, 		note:''		}});

	EZ.test.run('tag',  				{EZ: {ex:t_tags[0], 	note:''		}});
	EZ.test.run(['tag'],   				{EZ: {ex:t_tags, 		note:''		}});
	EZ.test.run(['tag'],false,			{EZ: {ex:t_tags[0], 	note:''		}});
	EZ.test.run('tag', true,  			{EZ: {ex:t_tags, 		note:''		}});
	EZ.test.run('tag', false, 	 		{EZ: {ex:t_tags[0], 	note:''		}});
	EZ.test.run('tag', null,  			{EZ: {ex:t_tags, 		note:''		}});
	EZ.test.run('notags',  				{EZ: {ex:t_none,		note:''		}});
	EZ.test.run('notags', null,  		{EZ: {ex:null,			note:''		}});

	EZ.test.run('div', t_tags[1],		{EZ: {ex:t_divs[1]      			}});
	EZ.test.run('div',			        {EZ: {ex:t_divs         	   		}});
	EZ.test.run('radio','div',			{EZ: {ex:t_radios[1]				}});

	EZ.test.run('radio',t_tags[1],		{EZ: {ex:t_radio01,					}});
	EZ.test.run('radio',				{EZ: {ex:t_radio01,	ctx:t_tags[1]	}});

	//not sure how these should work -- convert to chained ??
	EZ.test.run('radio',t_divs[1],		{EZ: {ex:null,		ctx:t_tags[1]	}});
	EZ.test.run('radio','div',			{EZ: {ex:null,		ctx:t_tags[1]	}});
	EZ.test.run('radio','notag',		{EZ: {ex:null,		ctx:t_tags[1]	}});

	note = 'not document descendant'
	var div = document.createElement('div');		//alot more descendand scenarios
	EZ.test.run(EZgetEl, div, 			{EZ: {ex:null, note:note}} );
}
EZ.test.run("----- backup copy of saved data -----", {EZ: {note:'not chained selector'}});
if (true) return;


	var ex_radios = [].slice.call(t_radios);
	EZ.test.run(['EZtest_radio'],	{EZ: {ex:ex_radios, 	note:'selector: radio group name'}});
	EZ.test.run(['test_id1'],t_wrap,	{EZ: {ex:t_idandclass, 	note:'id AND class'}});

	EZ.test.run('input',t_wrap,			{EZ: {ex:t_inputs[0], 	note:'field'}});
	EZ.test.run('EZTEST_TAG' ,t_wrap,	{EZ: {ex:t_tags[0],		note:'tag'	}});
	EZ.test.run('EZtest_class0',t_wrap,	{EZ: {ex:t_tags[0],		note:'class'}});
	EZ.test.run('test_id1',t_wrap,		{EZ: {ex:t_labels[1], 	note:'id selector'}});

	EZ.test.run('.test_id1',t_wrap,		{EZ: {ex:t_inputs[3], 	note:'class not id'	}});
	EZ.test.run('@input',t_wrap,		{EZ: {ex:t_inputs[0], 	note:'field'}});
	EZ.test.run('<tags',t_wrap,			{EZ: {ex:t_tags[0],		note:'tag'	}});
	EZ.test.run('.class1',t_wrap,		{EZ: {ex:t_tags[1],		note:'class'}});

	//EZ.test.run(tags.EZ, '', 			{EZ: {ex:t_none, 		note:''		}});
	EZ.test.run(null, 					{EZ: {ex:t_none, 		note:''		}});
	EZ.test.run(0, 						{EZ: {ex:t_none, 		note:''		}});
	EZ.test.run('0', 					{EZ: {ex:t_none, 		note:''		}});

	EZ.test.run('tag',  				{EZ: {ex:t_tags[0], 	note:''		}});
	EZ.test.run(['tag'],   				{EZ: {ex:t_tags, 		note:''		}});
	EZ.test.run(['tag'],false,			{EZ: {ex:t_tags[0], 	note:''		}});
	EZ.test.run('tag', true,  			{EZ: {ex:t_tags, 		note:''		}});
	EZ.test.run('tag', false, 	 		{EZ: {ex:t_tags[0], 	note:''		}});
	EZ.test.run('tag', null,  			{EZ: {ex:t_tags, 		note:''		}});
	EZ.test.run('notags',  				{EZ: {ex:t_none,		note:''		}});
	EZ.test.run('notags', null,  		{EZ: {ex:null,			note:''		}});

	EZ.test.run('div', t_tags[1],		{EZ: {ex:t_divs[1]      			}});
	EZ.test.run('div',			        {EZ: {ex:t_divs         	   		}});
	EZ.test.run('radio','div',			{EZ: {ex:t_radios[1]				}});

	EZ.test.run('radio',t_tags[1],		{EZ: {ex:t_radio01,					}});
	EZ.test.run('radio',				{EZ: {ex:t_radio01,	ctx:t_tags[1]	}});

	//not sure how these should work -- convert to chained ??
	EZ.test.run('radio',t_divs[1],		{EZ: {ex:null,		ctx:t_tags[1]	}});
	EZ.test.run('radio','div',			{EZ: {ex:null,		ctx:t_tags[1]	}});
	EZ.test.run('radio','notag',		{EZ: {ex:null,		ctx:t_tags[1]	}});

	note = 'not document descendant'
	var div = document.createElement('div');		//alot more descendand scenarios
	EZ.test.run(EZgetEl, div, 			{EZ: {ex:null, note:note}} );
}
/**
 *	return document object for el
 */
EZ.getEl.getDocument = function EZgetElGetDocument(el)
{
	return EZ.is(el, document.constructor)
		 ? el 				//el is document object
		 : el.ownerDocument
		 || document;		//safety for expected
}
/*---------------------------------------------------------------------------------------------
 *	1st arg is always selector(s); if more optional arguments . . .
 *
 *		options			last arg if boolean, null or any non-dom html object*
 *		defaultOptions 	2nd arg if more than 2 args and any non-dom html object*
 *
 *	 	nodes	 		2nd arg when 2nd arg is NOT options, defaultOptions,
 *						undefined, null or blank -and- IS dom html element object*
 *						or selector specified as string or Array otherwise...
 *						default: document
 *
 *	NOTE: * EZ.isNonElObject() or EZ.isEl() used to determine if dom object or not
-----------------------------------------------------------------------------------*/
EZ.getEl.getSettings = function EZgetElGetSettings(ctx, args)
{
	//----- context root element(s) -- EZget/EZset pass context elements as nodes
	this.roots = ctx == window || typeof(ctx) == 'function' ? []
			   : EZ.toArray(ctx);			//breakpoint here for element context

	var args = args.length ? [].slice.call(args) : [''];	//get real non-empty Array

	//----- get defaultOptions -- its last arg if object containing defaults property
	var defaultOptions = '.defaults'.ov(args[args.length-1])
					   ? args.pop().defaults
					   : '';

	//----- get options -- its now last arg if any of following:
	var options = args[args.length-1];
	options = (options === true) ? {all: true, one:false}
			: (options === false) ? {all: false, one:true}
			: (options === null) ? {notFound: false}
			: EZ.isObject(options) ? options
			: '';							//breakpoint here for options NOT found
	if (options)
		args.pop();							//breakpoint here for options found

	//----- get selectors argement -- now next item in args --
	this.selectors = args.shift();
	var isMultipleSelectors = (EZ.isArray(this.selectors) && !EZ.isEl(this.selectors));
														//keep ArrayLike html collection...
	this.selectors = EZ.toArray(this.selectors, false);	//...so it can returned "as is"

	//----- get nodes argument -- now next item in args
	this.nodes = EZ.toArray(args.shift());				//clone nodes html collection as...
														//...real Array its not returned

	//---------------------------------------------------------------------------------
	// set overrideable options to specified value or defaults
	//---------------------------------------------------------------------------------
	var settings = {						//value or object returned when no tags found
		notFound: 'EZ.legacy.EZgetEl.notFound'.ov('EZnone'),
		uniqueEZnone: false,				//use unique EZnone when needed
		all: isMultipleSelectors,			//return all tags found by all selectors
		one: !isMultipleSelectors,			//return 1st tag found only 1st tag of collection
		asis: false,						//html colections returned as is
		legacy: options ? false : 'EZ.legacy.EZgetEl'.ov(false)
	}
	this.baseSettings = EZ.merge({mergeOptions:{append:false}}, settings, defaultOptions, options);
	EZ.merge(this, this.baseSettings);

	// base settings for recursive calls to EZ.getEl()
	this.baseSettings = EZ.merge(settings, {legacy:false, notFound:[], all:true, one:false});

	//----- get elements for any context roots and/or nodes not specified as elements
	EZ.getEl.getElements(this.roots, this.baseSettings, document);
	EZ.getEl,getElements(this.nodes, this.baseSettings, this.roots);

	//------ if roots not specified, use for nodes if specified
	if (!this.roots.length && this.nodes.length > 0)
	{
		this.roots = this.nodes;
		this.nodes = [];
	}
	if (!this.roots.length)
		this.roots = [document];

	if (this.selectors.length > 1
	|| (this.nodes && this.nodes.length > 0)	//if not moved to roots
	|| (this.roots.length > 1 || !EZ.is(this.doc,document.constructor)))
		this.legacy = false;

	if (this.legacy)
		this.doc = this.roots[0];
	//_________________________________________________________________________________
	/**
	 *	recursive calls to EZ.getEl() to find elements for non-element selectors
	 *	no nodes filter, array of all selections, empty array if no tags found.
	 *	Uses pre-defined settings so EZ.getEl_getSettings() is not called again.
	 */
	function EZgetEl_getElements(tags, baseSettings, roots)
	{
		if (!tags) return;
		if (!EZ.isArrayLike(tags) && !EZ.isEl(tags)) return;
		if (EZ.isArrayLike(tags) && tags.length == 0) return;

		var root = roots && roots.length && roots.length > 0 ? roots : document;
		var settings = EZ.merge({mergeOptions:{maxdepth:0}}, baseSettings, {roots:root})

		for (var idx=tags.length-1; idx>=0; idx--)	//for each tag in reverse order
		{
			var el = tags[idx];	//replace each non-el selector with 0+ html elements
			if (!EZ.isEl(el))
			{
				el = EZ.getEl(el, settings);
				var spliceArgs = [].concat([idx,1], [].slice.call(el) );
				Array.prototype.splice.apply(tags, spliceArgs);
			}
		}
	}
}
}
/*-----------------------------------------------------------------------------------
EZ.none([selector(s)) -- return pseudo HTML element object

EZ.() variant return null if no elements found -OR-

Used to create

Custom toString() and valueOf() functions return "" and false respectfully ...BUT...

	if (!EZ.none()) IS true*
	if (!EZ.none() == false) -and- if (!EZ.none() === false) work just fine!!!

	EZ.isFalse(EZ.none()) / EZ.isFalse(EZ.none()) return false or true as expected.

ARGUMENTS:
	settings	1st arg if EZgetEl_settings
	selectors
	isUnique	1st arg if true -- create new EZnone element created
				TODO: currently creates new shared EZnone

RETURNS:
	new or existing EZnone

*JavaScript spec requires "if (Expression)..." or similar conditional be evaluated
 as true when the expression is an Object ... dating back to the beginning of time.
-----------------------------------------------------------------------------------*/
EZ.none = function EZnone(/* [settings | selectors | isUnique] */)
{
	var args = [].slice.call(arguments);
	if (!args.length) args.push('');

	var settings = EZ.is(args[0],EZgetEl.settings) ? args.shift() : '';
	var isUnique = settings ? '.uniqueEZnone'.ov(settings) : args.shift();
	var isOops = isUnique !== false;

	var selectors = EZ.toArray('.selectors'.ov(settings, 'unknown'));
	var item = EZ.collapse(selectors);		//1st selector

	if (!EZ.none) EZ.none = {}
	if (!EZ.none.nextId) EZ.none.nextId = 0;

	if (!EZ.noneTags)		// create pseudo parent for EZnone tags
	{
		EZ.noneTags = document.getElementById('EZnone');
		if (!EZ.noneTags)
		{
			EZ.noneTags = EZ.none_createElement('pre');
			EZ.noneTags.setAttribute('id', 'EZnone');
		}
		var textNode = document.createTextNode('...');
		EZ.noneTags.appendChild(textNode);
		EZ.noneTags.style.fontFamily = 'monospace';
		isUnique = true;
	}

	var node = EZ.noneTags.lastChild;
	if (isUnique || EZ.noneTags.childNodes.length == 0)
	{									//create new pseudo node returned
		var id = '';
		var name = '';
		node = EZ.none_createElement('select');
		node.setAttribute('id', id);
		node.setAttribute('name', name);

		node.style.width = '0px';		//fastselect loses attributes and styles
		node.style.height = '0px';
 		node.style.border = '0px';
		node.style.margin = '0px';
		node.style.padding = '0px';
 		node.style.display = 'none';
		node.valueOf = function()
		{
///			console.log('valueOf()');
			return null;
		}
		node.toString = function()
		{
///			console.log('toString'); return this.textContent;
		}
		EZ.noneTags.appendChild(node);

		// add attributes used by most most tags
		var attributes = ('accept accept-charset accesskey action align allowtransparency alt '
					   + 'border bottom center charset checked class cols coords disabled enctype '
					   + 'frameborder height href hspace id justify label left longdesc '
					   + 'marginheight marginwidth maxlength method middle multiple name onreset onsubmit '
					   + 'readonly rel rev right rows scrolling selected shape size src style '
					   + 'target title top type usemap value vspace width wrap' ).split(" ");

		for (var i=0; i<attributes.length; i++)
			if (!node.getAttribute(attributes[i]))
				node.setAttribute(attributes[i],'');

		node.checked = false;
		EZ.bindElements(node);
	}

	//----- Save selectors and stackTrace that created EZnone
	var e, msg = '';

	if (isOops && 'EZ.beep.options.EZnone'.ov())
		EZ.oops('EZnone selectors', selectors);

//	try
//	{
//	///	undefined['EZnone'];
//	}
//	catch (e)
//	{
//		var ee;
//		try
//		{
//			var stack = (e.stack+'').formatStack(1);
//			var calledFrom = stack[1];
//			stack[0] = selectors. join(', ');	//replace msg
//			var logStack = stack.slice();					//full stack for log
//
//			//for html text: drop all but last EZ.(and anounymous functions ??)
//			stack.splice(0,0,'-'.dup(50));
//			stack[2] = '-'.dup(50) + '+';
//
//			var fromIdx = 3;
//			var lastEZ = '';
//			while (/(at |\.)(EZ)/.test(stack[fromIdx])
//			&& stack[fromIdx].indexOf('.test') == -1)
//				lastEZ = stack.splice(fromIdx,1);
//			stack[fromIdx] = '...' + stack[fromIdx].trim() + '...'
//			if (lastEZ)
//				stack.splice(fromIdx,0,lastEZ[0]);	//put last one back
//
//	///		console.log({'EZnone for selector':selectors+'', 'in':calledFrom, 'stacktrace':logStack});
//
//			var msg = stack.join('\n');
//			EZ.noneTagsReferences = EZ.collapseMessages(EZ.noneTagsReferences, calledFrom, msg);
//			msg = EZ.collapseMessages(EZ.noneTagsReferences);
//
//			msg = msg.replace(/@.*?@:\s*/g, '');
//			msg = msg.replace(/,\s*----[\s\S]*+/g, ',\n').replace(/+/g, '');
//			msg = msg.replace(/x (\d*)/g, '-- $1 TIMES');
//
//			EZ.noneTags.firstChild.textContent = '\nSELECTORS NOT FOUND . . .\n' + msg;
//		}
//		catch (ee)
//		{
//			EZ.techSupport(ee);
//		}
//	}
	//======================
	return node;
	//======================
	/**
	 *
	 */
	function EZnone_createElement(tagName)
	{
		var node = document.createElement(tagName);
		node.undefined = true;
		node.className = 'EZnone';
		return node;
	}
}
EZ.noneTags.appendChild(node);

		// add attributes used by most most tags
		var attributes = ('accept accept-charset accesskey action align allowtransparency alt '
					   + 'border bottom center charset checked class cols coords disabled enctype '
					   + 'frameborder height href hspace id justify label left longdesc '
					   + 'marginheight marginwidth maxlength method middle multiple name onreset onsubmit '
					   + 'readonly rel rev right rows scrolling selected shape size src style '
					   + 'target title top type usemap value vspace width wrap' ).split(" ");

		for (var i=0; i<attributes.length; i++)
			if (!node.getAttribute(attributes[i]))
				node.setAttribute(attributes[i],'');

		node.checked = false;
		EZbindElements(node);
	}

	//----- Save selectors and stackTrace that created EZnone
	var e, msg = '';

	if (isOops && 'EZ.beep.options.EZnone'.ov())
		EZ.oops('EZnone selectors', selectors);

//	try
//	{
//	///	undefined['EZnone'];
//	}
//	catch (e)
//	{
//		var ee;
//		try
//		{
//			var stack = (e.stack+'').formatStack(1);
//			var calledFrom = stack[1];
//			stack[0] = selectors. join(', ');	//replace msg
//			var logStack = stack.slice();					//full stack for log
//
//			//for html text: drop all but last EZ (and anounymous functions ??)
//			stack.splice(0,0,'-'.dup(50));
//			stack[2] = '-'.dup(50) + '+';
//
//			var fromIdx = 3;
//			var lastEZ = '';
//			while (/(at |\.)(EZ)/.test(stack[fromIdx])
//			&& stack[fromIdx].indexOf('.test') == -1)
//				lastEZ = stack.splice(fromIdx,1);
//			stack[fromIdx] = '...' + stack[fromIdx].trim() + '...'
//			if (lastEZ)
//				stack.splice(fromIdx,0,lastEZ[0]);	//put last one back
//
//	///		console.log({'EZnone for selector':selectors+'', 'in':calledFrom, 'stacktrace':logStack});
//
//			var msg = stack.join('\n');
//			EZ.noneTagsReferences = EZcollapseMessages(EZ.noneTagsReferences, calledFrom, msg);
//			msg = EZcollapseMessages(EZ.noneTagsReferences);
//
//			msg = msg.replace(/@.*?@:\s*/g, '');
//			msg = msg.replace(/,\s*----[\s\S]*+/g, ',\n').replace(/+/g, '');
//			msg = msg.replace(/x (\d*)/g, '-- $1 TIMES');
//
//			EZ.noneTags.firstChild.textContent = '\nSELECTORS NOT FOUND . . .\n' + msg;
//		}
//		catch (ee)
//		{
//			EZ.techSupport(ee);
//		}
//	}
	//======================
	return node;
	//======================
}
/*---------------------------------------------------------------------------------------------
Return number occurances of chars (default char is dash)
---------------------------------------------------------------------------------------------*/
String.prototype.dup = function(number)
{
	return EZ.dup(number,this);
}
EZ.dup = function EZdup(number,char)
{
	var value = ''
	if (!char) char = '-';
	for (var i=0;i<number;i++)
		value += char;
	return value;
}
/*______________________________________________________________________________________________

functions ported from EASY js -- new functions and updates to be ported back to EASY js
______________________________________________________________________________________________*/
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
EZ.isTrueLike = function EZisTrueLike(value, options)
{
	if (EZ.isTrueLike) return EZ.isTrueLike(value, options);

	if (value === true || value === 'true'
	|| value === 'on' || value === 'yes') return true;

	if (typeof(value) == 'object' && !EZ.isNone(value)) return true;

	return false;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
EZ.isFalseLike = function EZisFalseLike(value)
{
	if (value === false || value === 'false'
	|| value === null || value == EZ.undefined
	|| value === 'off' || value === 'no' || value === '') return true;

	if (EZ.isNone(value)) return true;
	return false;
}
/*---------------------------------------------------------------------------------------------
return true if trueLike; false if falseLike otherwise value
zero is NOT falseLike
---------------------------------------------------------------------------------------------*/
EZ.trueFalseValue = function EZtrueFalseValue(value)
{
	if (EZ.isTrueLike(value)) return true;
	if (EZ.isFalseLike(value)) return false;
	return value;
}
/*---------------------------------------------------------------------------------------------
EZ.isTrue(value,options) --

Always returns true of false unless zerovalue:'value'
TODO: when should zero be interpreted as false -- why not just use: if (value)...
	  -or- EZ.trueFalseValue()

For value: true, 'true', 'on', 'yes', typeof(object or function) -- return true
For value: false, 'false', 'off', 'no' or EZ.isNone(value) -- return false
otherwise return value
---------------------------------------------------------------------------------------------*/
EZ.isTrue = function EZisTrue(value, options)
{
	//11-03-2015: causes infinite loop
	//if (EZ.isTrue) return EZ.isTrue(value, options);

	options = options || {zerovalue:false}

	if (EZ.isTrueLike(value)) return true;
	if (EZ.isFalseLike(value)) return false;

	switch(options.zerovalue + '')
	{
		case 'false' : return false;
		case 'true'  : return true;
		case 'value' :
		default      : return value;
	}
}
/*---------------------------------------------------------------------------------------------
EZ.isNone(value)

Does not use EZ.getOptions() -- can be used during options setup
---------------------------------------------------------------------------------------------*/
EZ.isNone = function EZisNone(value)
{
	if (typeof(value) == 'unknown' || value === undefined || value === null)
		return true;

	switch(typeof value)
	{
		case 'string'	: return value === '';
		case 'number'	: return isNaN(value);
		case 'boolean':
		case 'function': return false;
		case 'object':
		{
			if (EZ.isArrayLike(value)) 	return (value.length === 0);
			if (value.undefined)		return true;

			//e.g. IE events
			if (value.constructor != Object || !value.hasOwnProperty) return false;

			for (var p in value) 	//if any object property/element found, not none
				if (value.hasOwnProperty(p)) return false;
			return true;			//empty object considered none
		}
	}
	return true;	//unexpected scenario -- everything should be covered above
}
/*---------------------------------------------------------------------------------------------
Return text with 's' appended if count > 0
---------------------------------------------------------------------------------------------*/
EZ.s = function EZs(text,count,suffix)
{
	if (!suffix) suffix = 's'
	if (count != 1) text += suffix;
	return text;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
EZ.sentenceCase = function EZsentenceCase(msg)
{
	return msg.replace(/(^|\s)(\w)/g,function(all,p1,p2)
	{
		return p1 + p2.toUpperCase();
	})
}
/*---------------------------------------------------------------------------------------------
http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
---------------------------------------------------------------------------------------------*/
EZ.getRandomInt = function EZgetRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/*---------------------------------------------------------------------------------------------
Return parent tagName of el
---------------------------------------------------------------------------------------------*/
EZ.getParent = function EZgetParent(el,tagName)
{
	tagName = tagName || '';
	var name = el.name || el.id || el.outerHTML;	//name for error msg

	tagName = tagName.toUpperCase();
	var count = 0;
	while (count++ < 17)
	{
		//if (!el.parentNode)
		//	return EZ.warn(name + ' does not have ' + tagName + ' parent');
		el = el.parentNode;
		if (el == null) break;
		if (!tagName) return el;
		if (!el.tagName) continue;
		if (el.tagName.toUpperCase() == tagName) return el;
	}
	//dw.setFloaterVisibility('RevizeTrace',true);
	var msg = tagName + className + ' parent not found in ' + count + ' generations of ';
	EZ.log(msg,el.outerHTML);
	return EZ.warn(msg + '\nCheck Trace');
}
/*---------------------------------------------------------------------------------------------
EZ.isArray(value)

IE10- does not support: EZ.isArray(...)
Provided for completeness and documentation reference.
---------------------------------------------------------------------------------------------*/
EZ.isArray = function EZisArray(o)
{
	return (o != null && typeof(o) == 'object' && o.constructor == Array);
}
/*---------------------------------------------------------------------------------------------
EZ.isArrayLike(o)

Array-like object if not null, object with length property containing number.
object has length property but not Array constructor e.g. arguments object

TODO: better test for fake length than testing o.childNodes
	  how about testing for [0] or using some sort of Array prototype
---------------------------------------------------------------------------------------------*/
EZ.isArrayLike = function EZisArrayLike(o, makeSure)
{
	while (o != null && typeof(o) == 'object')
	{
		if (o.constructor == Array) return true;
		if (o.length == EZ.undefined || isNaN(o.length)) break;
		if (Math.floor(o.length) != o.length) return false;
		if (o.nodeType || o.childNodes || o.documentElement) break;
		/*
		//--------------------------------------------------------------------
		// http://stackoverflow.com/questions/24048547/checking-if-an-object-is-array-like
		//--------------------------------------------------------------------
		if (makeSure)			//more complete check (optional)
		{
			for (var i=0; i<len; ++i)
				if (!(i in o)) return false;	//something wrong
		}
		*/
		return true;
	}
	return false;
	//--------------------------------------------------------------------
	// legacy code
	//--------------------------------------------------------------------
	if (EZ.legacy.EZisArrayLike)
	{
	}
}
/*---------------------------------------------------------------------------------------------
return array of elements containing className in tagName under node

className	name of class to search -- blank for any class
tagName		name of tags to search -- omitted or * for all tags
node		html node to search -- omitted or blank for document
---------------------------------------------------------------------------------------------*/
EZ.getElementsByClassName = function EZgetElementsByClassName(className, tagName, node)
{
	var i,j;
	var classElements = [];

	className = className || '';
	tagName = tagName || '*';
	node = node || document;

	if (typeof(node) != 'object')
		node = document.getElementById(node+'');
	if (!node) node = document;

	var els = node.getElementsByTagName(tagName);
	var pattern = new RegExp("\\b"+className+"\\b");

	for (i = 0, j = 0; i < els.length; i++)
	{
		if ( pattern.test(els[i].className) )
		{
 			classElements[j] = els[i];
			 j++;
		}
	}
	return classElements;
}
/*______________________________________________________________________________________________

Alternative basic get element and get/set element/form field values

Originally taken from adv.importExportUtils.js which was cloned from EASY.js version 01-28-2015
Additional functions cloned from EASY.js as needed.

Includes enhancements and corrections.

Used by all EZ Dreamweaver extensions and dw.simulator ajax pages to test as standalone pages.
______________________________________________________________________________________________*/
/*---------------------------------------------------------------------------------------------
get all elements with tag name (and className if specified)
---------------------------------------------------------------------------------------------*/
EZ.getTags = function EZgetTags(tagName,className,doc)
{
	tagName = tagName || '*';
	if (typeof(className) == 'object')
		doc = [].pop.call(arguments);
	doc = doc || window.doc || document;	//if global doc defined

	var tags = doc.getElementsByTagName(tagName)
	if (typeof(className) == 'string')
	{										//if className supplied...
		var regEx = new RegExp( '\\s' + className + '(\\s|$)' );
		for (var i=0; i<tags.length; i++)
		{									//...and tag does not have className...
			while ( !regEx.test(' '+tags[i].className) )
				Array.prototype.splice.call(tags,i,1);	//...remove tag
		}
	}
	if (!tags.length)
		doc.getElementsByTagName('body');	//body tag default if nothing found
	return tags;
}
/*--------------------------------------------------------------------------------------------------
EZ.getCurrentStyle(el, style)

Get specified element(s) current style(s)

ARGUMENTS:
	arg			(*) blah blah
	...			blah blah

RETURNS:
	specified style value

TODO: blend EZ.getStyle() & EZ.getCurrentStyle()
--------------------------------------------------------------------------------------------------*/
EZ.getCurrentStyle = function EZgetCurrentStyle(el, style)
{
	if (!style) return '';
	var css = style.replace(/([A-Z])/g, '-$1'.toLowerCase());	//e.g. fontSize --> font-size
	var key = style.replace(/(-.)/g, '$1'.toUpperCase());		//e.g. font-size --> fontSize

	var value = '';
	if (document.all && el.currentStyle)
	{
		value = el.currentStyle[key];
	}
	else if (document.defaultView)
	{
		value = document.defaultView.getComputedStyle(el,'').getPropertyValue(css);
	}
	if (css.indexOf('color') != -1)
	{
		if (/rgba(0, 0, 0, 0)/.test(value))
			value = '';		//transparent
	}
	return value;
}
/*---------------------------------------------------------------------------------------------
get current styleProp of el -or- if value specified, el matching traversing up dom tree
TODO: blend EZ.getStyle() & EZ.getCurrentStyle()
---------------------------------------------------------------------------------------------*/
EZ.getStyle = function EZgetStyle(el, styleProp, value)
{
	el = EZ.getEl(el);
	if (!EZ.legacy.EZgetStyle)
	{
		if (value != EZ.undefined && !EZ.isArrayLike(value))
			value = [value];
		do
		{
			var val = [];
			var style = el && el.style;
			if (style)
			{
				if (document.defaultView && document.defaultView.getComputedStyle)
					val = document.defaultView.getComputedStyle(el, '');
				else if (el.currentStyle)
					val = el.currentStyle;
				else
					val = '';				//safety for unexpected
			}
			// return all or specified style if not searching for specific value(s)
			if (value == EZ.undefined)
				return !styleProp ? val : val[styleProp];

			// return el if specified property matches one of specified values
			if ([].indexOf.call(value,val[styleProp]) != -1)
				return el;
		}
		while (el = el.parentElement)	//move up dom tree

		return EZ.none();				//specified value not found in dom tree
	}
	//--------------------------------------------------------------------
	// legacy code -- get element or element for id if el not element
	//	TODO: may not work on chrome -- window.getComputedStyle is function
	//		  not sure if working in dw environment
	//--------------------------------------------------------------------
	var value = '';
	var currentStyle = null;

	if (window.getComputedStyle)	//chrome & FF work (others TBD per Ray)
		currentStyle = window.getComputedStyle;

	else if (el.currentStyle)		//pre IE11
		currentStyle = el.currentStyle

	if (currentStyle && currentStyle[style])
		value = currentStyle[style];

	return value;
}
//EZgetCurrentStyle = EZgetStyle;
EZgetCurrentStyleValue = EZgetStyle;
/*---------------------------------------------------------------------------------------------
return checked value of checkbox/radio -- undefined if invalid element
if no checked property, return element value true/false interpretation
---------------------------------------------------------------------------------------------*/
EZ.isChecked = function EZisChecked(el)
{
	el = EZ.getEl(el);
	if (el == null) return;		//return undefined (false)

	if (el.checked != EZ.undefined) return el.checked;

	return EZ.isTrue( EZ.getValue(el) );
}
EZgetChecked = EZisChecked;
/*---------------------------------------------------------------------------------------------
Set checked value of checkbox/radio -- returns input value as convenience
if no checked property for element, sets element value true or false.
---------------------------------------------------------------------------------------------*/
EZ.setChecked = function EZsetChecked(el, value)
{
	var els = EZ.getEl(el);
	if (els == null) return false;

	if (els.length > 1)
		return EZ.setValue(el, value)

	value = EZ.isTrue(value);
	if (el.checked != EZ.undefined)
		el.checked = value;
	else
		value = EZ.setValue(el, value);

	return value;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
EZ.toggleChecked = function EZtoggleChecked(el)
{
	return EZ.setChecked(el, !EZ.getValue(el));
}
/*---------------------------------------------------------------------------------------------
return true or false: check all true/false varients (0 or '0' retrun false
---------------------------------------------------------------------------------------------*/
EZ.getBoolean = function EZgetBoolean(el)
{
	var el = EZ.getEl(el);
	if (el == null) return false;
	return EZ.getFieldValue(el) == true;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
EZ.getInt = function EZgetInt(el, defaultValue)
{
	return EZ.toInt( EZ.getValue(el), defaultValue);
}
/*---------------------------------------------------------------------------------------------
return element value(s) as array -- useful for multi-select field
blank or no values returned as ??
---------------------------------------------------------------------------------------------*/
EZ.getValues = function EZgetValues(el, defaultValue)
{
	var tags = EZ.toArray(el);		//returns empty Array if el null, blank or undefined
	var values = [];
	[].forEach.call(tags,function(el)
	{
		var val = EZ.getValue(el, defaultValue);
		values = values.concat( EZ.toArray(val, '|') )
	});
	return values;
}
/*---------------------------------------------------------------------------------------------
return element value -- cloned from EASY.js beta:

if unknown el return defaultValue or undefined
if form field, return field value else el.innerHTML if defined otherwise null

TODO: defaultValue may not be complete
	  consolidate, merge or sync with EZ.get(), EZ.val() and EZ.get_basic()
---------------------------------------------------------------------------------------------*/
EZ.getValue = function EZgetValue(el, defaultValue)
{									//el arg is single element, html collection or selector(s)
	el = EZ.getEl(el,true)[0];		//get 1st element of collection or matching 1st selector
	if (!el || el.undefined)
		return defaultValue;		//TODO: return default or undefined??

	var name = el.name || el.id || '';
	var value = el.value != EZ.undefined ? el.value
			  : el.innerHTML != EZ.undefined ? el.innerHTML
			  : '';
	switch (EZ.getTagType(el))
	{
		case 'textarea':
		case 'text':
		case 'password':
		case 'hidden':
			return value;

		case 'radio':
		{											//get all radio group tags
			var tags = document.getElementsByName(el.name || el.id || '');
			if (el.name && tags.length > 1)			//fall thru to checkbox if single button
			{
				for (var i=0; i<tags.length; i++)
				{
					if (!tags[i].checked) continue;
					value = EZ.getTagValue(tags[i]);
					if (value !== '')				//return value if defined...
						return value.isTrueFalseValue();

					var id = tags[i].id;
					if (id && id != name)			//...return id if diff from name
						return id;
													//...return parent label text if any
					var label = EZ.getParent(tags[i], 'label');	//see EZ.getAncestor()
					if (!EZ.isNone(label))
						return EZ.trim(label.innerText).isTrueFalseValue();

					return '';		//no value, id or label text found for checked button
				}
				return '';			//no button checked
			}
		}
		case 'checkbox':
		{
			value = EZ.getTagValue(el);
			if (value !== '')
				return  el.checked ? value : '';
			else
				return el.checked;
		}
		case 'select':
		{				//use EZ.getFieldValue() if el.selectedIndex >= 0
			if (el.selectedIndex == -1) return '';
			if (typeof(EZgetFieldValue) == 'function')
				return EZ.getFieldValue(el);
			return el.options[el.selectedIndex].value || el.options[el.selectedIndex].text
		}
		default:
		{				//return innerHTML if defined
			if (el.innerHTML != EZ.undefined)
				return value;
		}
	}
	return null;		//TODO: should null ever be returned??
}
/*---------------------------------------------------------------------------------------------
set element value -- cloned from EASY.js beta:

set and for convenience return value

if form field, set field value otherwise set el.innerHTML

TODO: defaultValue may not be complete
	  consolidate, merge or sync with EZ.set(), EZ.val() and EZ.set_basic()

select/ text field -- .replace(/(\r\n|\n|\r)/g, EZ.constant.EOL);
	var type = /input/i.test(el.tagName || '')
				? el.type 				//use tag.type for input tag
				: el.tagName || '';		//otherwise tagName if defined
	switch (type.toLowerCase())
---------------------------------------------------------------------------------------------*/
EZ.setValue = function EZsetValue(el, value, defaultValue)
{
	var els = EZ.getEl(el,true);			//get all element(s)

	if (!els || els.undefined) 			//if no field or element found -- return blank
		return '';


	if (!EZ.isArray(el))				//only set 1st if el was not Array
		els = [els[0]]

	var values = [];
	els.forEach(function(el)
	{
		var tagName = (el.tagName || '').toLowerCase();
		var name = el.name || el.id || '';

		EZ.wasValue = '';

		value = (value != EZ.undefined) ? value		//value, defaultValue or blank
			  : (defaultValue !==  undefined) ? defaultValue	: '';
		var isValueTrueLike = EZ.isTrueLike(value);
		var isValueFalseLike = EZ.isFalseLike(value);

		switch (EZ.getTagType(el))
		{
			case 'textarea':
			case 'text':
			case 'password':
			case 'hidden':
			{
				EZ.wasValue = el.value;
				return values.push(el.value = value.toString());
			}
			case 'radio':
			{										//get all radio group tags
				var tags = document.getElementsByName(el.name || el.id || '');
				if (el.name && tags.length > 1)		//fall thru to checkbox if not radio group
				{									//length=1 is possible forgot when
					value = value.toString();
					var trueLikeButton = '';
					var falseLikeButton = '';
					var idButton = '';
					var blankButton = '';
					var labelEqualsButton = '';
					var labelContainsButton = '';
					var labelTrueLikeButton = '';
					var labelFalseLikeButton = '';

					for (var i=0; i<tags.length; i++)
					{
						var buttonValue = EZ.getTagValue(tags[i]);
						if (value !== '' && buttonValue.toLowerCase() === value.toLowerCase())
						{
							tags[i].checked = true;
							return values.push(EZ.getValue(name));		//return if matching value found
						}

						if (value === '')
						{
							if (blankButton === '')
								blankButton == tags[i];
						}
						if (EZ.isTrueLike(buttonValue))
						{									//button value is trueLike...
							if (!isValueTrueLike)
								tags[i].checked = false;	//...uncheck if value not trueLike
							if (!trueLikeButton)
								trueLikeButton = tags[i];	//...remember if 1st trueLike button
						}
						if (EZ.isFalseLike(buttonValue))
						{									//button value is falseLike...
							if (!isValueFalseLike)
								tags[i].checked = false;	//...uncheck if value not falseLike
							if (!falseLikeButton)
								falseLikeButton = tags[i];	//...remember if 1st falseLike button
						}

						var id = tags[i].id;
						if (value !== '' && id && id !== name && id === value)
							idButton = tags[i];				//non-blank value matches id diff from name

						while (true) 						//id has priority over label text so...
						{									//...only test label parent (not for="id")
							//var label = EZ.getParent(tags[i], 'label');	//see EZ.getAncestor()
							var label = EZ.getAncestor(tags[i], 'label');	//see EZ.getAncestor()
							if (!EZ.is(label)) break;

							var labelText = EZ.trim(label.innerText).toLowerCase();
							if (labelText === '') break;

							if (!labelEqualsButton && labelText === value.toLowerCase())
								labelEqualsButton = tags[i];

							if (!labelContainsButton && labelText.indexOf(value.toLowerCase()) != -1)
								labelContainsButton = tags[i];

							if (!labelTrueLikeButton && EZ.isTrueLike(labelText))
								labelTrueLikeButton = tags[i];

							if (!labelFalseLikeButton && EZ.isFalseLike(labelText))
								labelFalseLikeButton = tags[i];

							break;
						}
					}

					//-----	no button matched non-blank value . . .
					if (trueLikeButton && isValueTrueLike)			//if value trueLike...
						trueLikeButton.checked = true;				//...check 1st trueLikeButton if found

					else if (blankButton && value === '')			//if value blank...
						falseLikeButton.checked = true;				//...check 1st falseLikeButton if found

					else if (falseLikeButton && isValueFalseLike)	//if value falseLike...
						falseLikeButton.checked = true;				//...check 1st falseLikeButton if found

					else if (idButton)								//value matches a button id (not id=name)
						idButton.checked = true;
																	//check value to labelText...
					else if (labelEqualsButton)
						labelEqualsButton.checked = true;			//...value matches full labelText

					else if (labelTrueLikeButton && isValueTrueLike)
						labelTrueLikeButton.checked = true;			//...trueLike value matches trueLike label

					else if (labelFalseLikeButton && isValueFalseLike)
						labelFalseLikeButton.checked = true;		//...falseLike value matches falseLike label

					else if (labelContainsButton)
						labelContainsButton.checked = true;			//...value matches some labelText

					return values.push(EZ.getValue(name));
				}
			}
			case 'checkbox':
			{
				value = value.toString();
				var elValue = EZ.getTagValue(el);
				EZ.wasValue = !el.checked ? ''
							: elValue === '' ? true
							: elValue;

				//						...check if value matches checkbox value
				if (elValue.toLowerCase() === value.toLowerCase())
					el.checked = true;
				//						...check if value trueLike & checkbox trueLike or blank
				else if ((elValue === '' || !elValue.isFalseLike())  && value.isTrueLike())
					el.checked = true;
				//						...otherwise uncheck
				else
					el.checked = false;

				return values.push(EZ.getValue(el));
			}
			case 'select':
			{
				EZ.wasValue = [];
				var textIndex = [];
				for (i=0; i<el.options.length; i++)
				{
					if (el.options[i].checked)
						EZ.wasValue.push(el.options[i].value)

					if (el.options[i].value == value)
					{
						el.options[i].selected = true;
						if (el.type == 'select-one') break;
					}
					else if (el.options[i].text == value)
						textIndex.push(i);
				}
				EZ.wasValue = EZ.wasValue.join('|');
				if (i == el.options.length)
					textIndex.some(function(i)
					{
						el.options[i].selected = true;
						if (el.type == 'select-one') return values.push(true);
					});
				if (el.selectedIndex != -1 && window.EZselectScroll)
					EZ.selectScroll(el,i)				//scroll into view

				return values.push(EZ.getValue(el));
			}
			default:
			{
				while (tagName && tagName != 'input')
				{										//TODO: 1st empty innerHTML
					if (el.innerHTML != EZ.undefined)
					{									//return innerHTML if defined
						EZ.wasValue = el.innerHTML;
						return values.push(el.innerHTML = value);
					}
				}
			}
		}
	});
	return (EZ.isArray(el)) ? values : values[0]

if (EZ.quit != EZ.undefined)
debugger;
	return '';
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
EZ.toggleClass = function EZtoggleClass(el,className)
{
	el = EZ.getEl(el,true);
	if (el == null) return false;

	var rtn = true;
	el.forEach(function(el)
	{
		EZ.toArray(className, ',').forEach(function(className)
		{
			var names = el.className.replace(/\s+/g, ' ').trim().split(' ');
			var idx = names.indexOf(className);
			if (idx == -1)
				names.push(className);
			else
			{
				names.splice(idx,1);
				rtn = false;
			}
			el.className = names.join(' ');
		});
	});
	return rtn;
}
/*---------------------------------------------------------------------------------------------
add className
---------------------------------------------------------------------------------------------*/
EZ.addClass = function EZaddClass(el, className, trueFalse)
{
	if (trueFalse === false) return EZ.removeClass(el,className);

	el = EZ.getEl(el,true);
	if (el == null) return false;
	el.forEach(function(el)
	{
		EZ.toArray(className, ',').forEach(function(className)
		{
			var names = el.className.replace(/\s+/g, ' ').trim().split(' ');
			var idx = names.indexOf(className);
			if (idx == -1)
				names.push(className);

			el.className = names.join(' ');
		});
	});
}
/*---------------------------------------------------------------------------------------------
remove className
---------------------------------------------------------------------------------------------*/
EZ.removeClass = function EZremoveClass(el, className, trueFalse)
{
	if (trueFalse === false) return EZ.addClass(el,className);

	el = EZ.getEl(el,true);
	if (el == null) return false;
	el.forEach(function(el)
	{
		EZ.toArray(className, ',').forEach(function(className)
		{
			var names = el.className.replace(/\s+/g, ' ').trim().split(' ');
			var idx = names.indexOf(className);
			if (idx != -1)
				names.splice(idx,1);

			el.className = names.join(' ');
		});
	});
}
/*---------------------------------------------------------------------------------------------
return true if el contains any of specified className(s)
true if className empty, false if el not found.
---------------------------------------------------------------------------------------------*/
EZ.hasClass = function EZhasClass(el, className)
{
	if (!className) return true;

	el = EZ.getEl(el);
	if (!EZ.is(el) || !el.className) return false;

	if (!EZ.legacy.EZhasClass)
	{
		var classNames = EZ.toArray(className);
		return el.className.split(' ').some(function(elClass)
		{
			if (classNames.indexOf(elClass) != -1) return true;
		});
	}
	//--------------------------------------------------------------------
	// legacy code
	//--------------------------------------------------------------------
	className = className || '';
	var pattern = new RegExp("\\b" + className + "\\b");
	return pattern.test(el.className || '');
}
EZisClass = EZhasClass;	//alternate name
/*---------------------------------------------------------------------------------------------
show or hide element -- return false if el hidden; true is shown
---------------------------------------------------------------------------------------------*/
EZ.hide = function EZhide(el, trueFalse, useVisibility)
{
	el = EZ.getEl(el);
	if (el == null) return false;

	if (trueFalse == EZ.undefined) trueFalse = true;
	if (EZ.isFalseLike(trueFalse)) return EZ.show(el);

	useVisibility = typeof(useVisibility) == 'boolean' ? useVisibility
				  : useVisibility == 'visibility';

	if (EZ.isShow(el))		//if currently showing . . .
	{						//hide via visibilty if specified or previously hidden
		if (!el.EZorigStyle) el.EZorigStyle = {}
		if (useVisibility || el.EZorigStyle.visibility == 'hidden')
			el.style.visibility = 'hidden';
		else
		{					//otherwise set display to none after saving current value
			el.EZorigStyle.display = EZ.getStyle(el,'display')
			el.style.display = 'none';
		}
	}
	return false;	//convenience return value
}
/*---------------------------------------------------------------------------------------------
show or hide element -- use visibility=hidden to hide
---------------------------------------------------------------------------------------------*/
EZ.visible = function EZvisible(el, trueFalse)
{
	return trueFalse === true || EZ.isTrue(trueFalse) ? EZ.show(el) : EZ.hide(el, true, 'visibility');
}
/*---------------------------------------------------------------------------------------------
show or hide element -- return false if el hidden; true is shown
---------------------------------------------------------------------------------------------*/
EZ.show = function EZshow(el, trueFalse, useVisibility)
{
	var tags = EZ.getEl(el,true);					//=true to get all elements
	if (tags == null) return false;
	[].forEach.call(tags, function(el)
	{
		if (trueFalse == EZ.undefined) trueFalse = true;
		if (EZ.isFalseLike(trueFalse)) return EZ.hide(el, true, useVisibility);

		if (!el.EZorigStyle) el.EZorigStyle = 		//save display and visibilty style values
		{
			display: EZ.getStyle(el,'display'),
			visibility: EZ.getStyle(el,'visibility')
		}
		while (!EZ.isShow(el))						//if not currently showing
		{											//1st try clearing el visibility style
			if (el.style.visibility == 'hidden') el.style.visibility = '';
			if (el.style.display == 'none')	el.style.display = '';
			if (EZ.isShow(el)) break;				//bail if that did the trick

			//next try visibility=visible if visibility prop originally defined now hidden
			var visibility = EZ.getCurrentStyleValue(el,'visibility');
			if (visibility == 'hidden' || el.EZorigStyle.visibility)
				el.style.visibility = 'visible';
			if (EZ.isShow(el)) 						//if that did it, cool...
			{										//...save visibility for show if not yet saved
				if (!el.EZorigStyle.visibility) el.EZorigStyle.visibility = visibility;
				break;
			}
			//must use display property if still not showing...
			var display = EZ.getCurrentStyleValue(el,'display');
			if (el.EZorigStyle.display)
			{										//...1st try original display style if definned
				el.style.display = el.display;
				if (EZ.isShow(el)) break;
			}
			if (display == 'none')
			{										//...next try inherit
				el.style.display = 'inherit';
				if (EZ.isShow(el)) 					//if that did it, cool...
				{									//...save display for show if not yet saved
					if (!el.EZorigStyle.display) el.EZorigStyle.display = display;
					break;
				}
			}
			//http://stackoverflow.com/questions/6867254/browsers-default-css-for-html-elements
			var tagDefault = 						//lastly use tag defaukt display style
			{
				li: 	  'list-item',
				table:    'table',
				thead:    'table-header-group',
				tbody:    'table-row-group',
				tr:       'table-row',
				td:		  'table-cell',
				th:       'table-cell',
				tfoot:    'table-footer-group',
				col:      'table-column',
				colgroup: 'table-column-group',
				caption:  'table-caption',
				input:	  'inline-block',
				select:   'inline-block'
			}
			tagName = el.tagName || '';
			display = tagDefault[tagName.toLowerCase()] || 'block';
			el.style.display = display;
			break;
		}
	})
	return true;	//convenience return value
}
/*---------------------------------------------------------------------------------------------
is element displayed based on offsetHeight
---------------------------------------------------------------------------------------------*/
EZ.isShow = function EZisShow(el)
{
	el = EZ.getEl(el);
	if (el == null) return false;

	if (!dw.isNotDW)
		return el.offsetHeight > 0;

	if (EZ.getCurrentStyleValue(el,'display') == 'none') return false;
	if (EZ.getCurrentStyleValue(el,'visibility') == 'hidden') return false;
	return true;
}
/*---------------------------------------------------------------------------------------------
show or hide element or element with id
---------------------------------------------------------------------------------------------*/
EZ.toggleShow = function EZtoggleShow(el)
{
	return EZ.show(el, !EZ.isShow(el))
}
EZtoggle = EZtoggleShow;	//legacy
/*---------------------------------------------------------------------------------------------
refresh floater by reloading extensions
---------------------------------------------------------------------------------------------*/
EZ.refreshFloater = function EZrefreshFloater()
{
	dw.reloadExtensions();
}
/*---------------------------------------------------------------------------------------------
fit element width to value -- only select and input tags supported
cloned from EASY.js beta -- works for arial 12px; font normal
probably only works for dw.simulator
---------------------------------------------------------------------------------------------*/
EZ.fitWidth = function EZfitWidth(el,extra,base,wide,narrow)
{
	el = EZ.getEl(el);
	if (el == null) return false;

	extra = extra || 0;
	base = base || 6.5;		//for testing
	wide = wide || 3;		//		''
	narrow = narrow || 3;	//		''

	var me = arguments.callee;

	var plus = 0;
	var value = el.value;
	if (el.tagName == 'SELECT')
	{								//add fitWidth() to onchange if not already
		addChangeCall('onchange');
		if (el.selectedIndex == -1) return false;
		value = el.options[el.selectedIndex].text;
		plus = 15;
	}
	else if (el.tagName == 'INPUT')
	{
		addChangeCall('onkeyup');
	}
	else
	{
		return false;	//not yet supported
	}
	var width = ((value.length + 1) * base) + extra + plus;

	// cludge for wide chars: uppercase char, m w & _
	width += ('_' + value).match(/[A-Z_mw]/g).length * wide;

	// cludge for narrow chars: some puncation
	width -= ('.' + value).match(/[.,;!'|filrtI]/g).length * narrow;
	width = parseInt(width+.5);
	el.style.width = Math.max(width,5) + 'px';
	//======================
	return true;
	//======================
	/**
	 *	make sure we EZgetEl called when value changes
	 */
	function addChangeCall(onName)
	{
		if (!EZfitWidth.calls)
			EZfitWidth.calls = {};
		if (EZfitWidth.calls[el]) return;		//already added
			EZfitWidth.calls[el] = true;

		// check onName el event handler or source of anounyous
		if (el[onName] == me || (el[onName] + '').indexOf('EZ.fitWidth(') != -1) return;

		// add event handler -- may already have one but now there are 2
		var callMe = function() {EZ.fitWidth(el,extra)};
		if (el.addEventListener) el.addEventListener(onName.substr(2), callMe, false);
		else if (el.attachEvent) el.attachEvent(onName, callMe);
	}
}
if (el.addEventListener) el.addEventListener(onName.substr(2), callMe, false);
		else if (el.attachEvent) el.attachEvent(onName, callMe);
	}
}
/*---------------------------------------------------------------------------------------------
DCO 04-20-2015: changes to EZ.getDOM() and EZ.releaseDOM()

All calls to dw.getDocumentDOM(...) have been converted to EZ.getDOM(...)
and calls to dw.releaseDocument(...) are converted to EZ.releaseDOM(...)


------------------------
NEW ARGUMENTS 04-20-2015
------------------------
	docType		(optional) when specified always calls dw.getNewDocumentDOM(type)
	content 	(optional) specifies outerHTML content for existing or new DOM.

As of 04-20-2015, the new arguments only used in EZ.checkPostStatus()
---------------------------------------------------------------------------------------------*/
EZ.getDOM = function EZgetDOM(url, docType, content)
{
	var dom = null;
	if (url == document) url = 'document';
	if (!url && !docType) url = 'document';

	// get existing DOM if docType not specified and url exists
	// if url does not exist then invalid dw.getDocumentDOM() argument
	if (url == 'document' || (!docType && DWfile.exists(url)))
	{
		// if url in Configuration folder, use: ../ unless simulator
		if (!dw.isNotDW)
			url = EZ.stripConfigPath(url).replace(/\.\.\.\/Configuration/, '..');
		dom = dw.getDocumentDOM(url);
	}
	else		//get new DOM if docType specified or url does not exist
	{
		if (!docType)
		{
			switch(EZ.getFileInfo(url).extension.toLowerCase())
			{
				case 'js': doctype = 'JavaScript'; break;
				case 'xml': doctype = 'xml'; break;
				default: doctype = 'html';
			}
		}
		//------------------------------------------------
		dom = dw.getNewDocumentDOM(docType);
		//------------------------------------------------
		if (url) dom.URL = url;
		if (content)
		{
			dom.documentElement.outerHTML = content;
			if (url && !DWfile.exists(url))
			if (!DWfile.write(url, content))
			{
				var msg = EZ.stripConFigPath(url) + '\n' + url + '\n\n' + EZ.displayCaller();
				EZ.error(msg, 'getDOM: write to url failed');
			}
		}
	}
	return dom;
}
/*---------------------------------------------------------------------------------------------
release DOM: remove dom from open doms list and calls dw.releaseDocument()

Per API doc -- dw.releaseDocument() is relevant only for documents that were referenced by a URL,
are not currently open in a frame or document window, and are not extension files. Extension
files are loaded into memory at startup and are not released until you quit Dreamweaver.

dw.getDocumentList() -- does not include related files
---------------------------------------------------------------------------------------------*/
EZ.releaseDOM = function EZreleaseDOM(dom)
{
	if (dom != EZ.undefined)
		dw.releaseDocument(dom);
	dom = null;
	return null;
}
/*---------------------------------------------------------------------------------------------
//----- return dom source
---------------------------------------------------------------------------------------------*/
EZ.getSource = function EZgetSource(dom)
{
	if (!dom) dom = EZ.doc.dom;
	if (!dom || !dom.documentElement) return null;
	dom.synchronizeDocument();
	return dom.documentElement.outerHTML;
}
/*---------------------------------------------------------------------------------------------
get DOM, source, selected/highlighted text in codeview and offsets, release DOM
returns:
	EZ.doc.source
	EZ.doc.currentSelection
	EZ.doc.domSelection	 --  currentSelection expanded to full tag


return false if could get DOM for active window true if dom found  set
---------------------------------------------------------------------------------------------*/
EZ.setupDocDom = function EZsetupDocDom()
{
	EZ.doc.sourceSelectionString = '';

	EZ.doc.dom = EZ.getDOM("document");
	if (EZ.doc.dom == null) return false;

	EZ.doc.dom.synchronizeDocument();
	EZ.doc.source = EZ.doc.dom.documentElement.outerHTML;

	// get tag/jsp offsets if inside tag/jsp otherwise get the real selection or insertion point
	var theSel = EZ.doc.dom.source.getSelection();		//exact selection
	EZ.doc.sourceSelection = theSel;
	EZ.doc.sourceSelectionString = EZ.doc.source.substring(theSel[0],theSel[1]);

	var domSelection = EZ.doc.dom.getSelection(true);	//expands to full tag
	EZ.doc.domSelection = domSelection;
	if (domSelection[0] < theSel[0] || domSelection[1] > theSel[1])		//expanded
		theSel = domSelection;

	EZ.doc.currentSelection = theSel
	EZ.releaseDOM(EZ.doc.dom)
	return true;
}
/*---------------------------------------------------------------------------------------------
get Global dw.constructor value shared accross commands
---------------------------------------------------------------------------------------------*/
EZ.getGlobal = function EZgetGlobal(key, defaultValue)
{
	if (!key)
	{
		EZ.warn('invalid key: ' + key);
		return '';
	}
	return EZ.getConvertedValue(EZ.dw[key], defaultValue);
}
/*---------------------------------------------------------------------------------------------
set Global dw.constructor value shared accross commands
---------------------------------------------------------------------------------------------*/
EZ.setGlobal = function EZsetGlobal(key, value)
{
	if (!key)
	{
		EZ.warn('invalid key: ' + key);
		return '';
	}
	return EZ.dw[key] = EZ.setConvertedValue(value);
}
/*---------------------------------------------------------------------------------------------
validate preference key
---------------------------------------------------------------------------------------------*/
EZ.validatePref = function EZvalidatePref(key)
{
	if (EZ.pref._keys.indexOf(key) == -1)
	{
		if (EZ.warn('Undefined Preference: ' + key)) return false;
	}
	return true;
}
/*---------------------------------------------------------------------------------------------
get preference from registry for Dreamweaver EZ group
---------------------------------------------------------------------------------------------*/
EZ.isPref = function EZisPref(key,options)
{
	return EZ.getPref(key,options);
}
/*---------------------------------------------------------------------------------------------
get preference from registry for Dreamweaver EZ group
---------------------------------------------------------------------------------------------*/
EZ.getPref = function EZgetPref(key,options)
{
	key = EZ.pref && EZ.pref[key] != EZ.undefined
		? EZ.pref[key]
		: key

	var value = '';
	var defaultValue;
	if (options != 'novalidate')
	{
		defaultValue = options;
		options = '';
	}
	//if (EZ.pref._keys.indexOf(options) != -1)
	//	return EZ.warn('Invalid Option: ' + options + ' call EZ.setPref(...) NOT EZ.getPref(...)');

	if (typeof(key) == 'object')	//dreamweaver preference
	{
		if (!EZ.validatePref(key.name)) return '';
		if (key.type == 'int')
			value = dw.getPreferenceInt(key.group,key.name);
		else
			value = dw.getPreferenceString(key.group,key.name);
	}
	else							//EZ preference
	{
		if (!EZ.checkOptions(options,'novalidate') && !EZ.validatePref(key)) return null;
		if (!window.dw || !dw.getPreferenceString) return '';
		value = dw.getPreferenceString(EZ.prefGroup, key);

		if (value == '' && EZ.pref.defaultValues && EZ.pref._vars[EZ.pref._keys.indexOf(key)])
			//why not?? value = EZ.pref.defaultValues[key];
			value = EZ.pref.defaultValues[ EZ.pref._vars[EZ.pref._keys.indexOf(key)] ];

		if (typeof(value) == 'undefined')
			value = defaultValue || '';
	}
	//EZ.log('','EZgetPref:' + key + '=' + value);


	// value is empty string if undefined and no default defined
	return EZ.getConvertedValue(value, defaultValue);
}
/*---------------------------------------------------------------------------------------------
set preference in registry for Dreamweaver EZ group
---------------------------------------------------------------------------------------------*/
EZ.setPref = function EZsetPref(key, value, options)
{
	options = options || '';
	/*
	if (value === null)
		return EZ.warn('EZ Set Preference: ' + key + ' is null');

	else if (value && value.name)
		return EZ.warn('EZ Set Preference: ' + key + ' has value from: '
					 + value.name + ': ' + value.note)
	*/

	if (typeof(key) == 'object')	//dreamweaver preference
	{
		if (!EZ.validatePref(key.name)) return null;
		if (key.type == 'int')
		{
			value = value.toInt();
			dw.setPreferenceInt(key.group, key.name, value);
		}
		else
		{
			value += '';
			dw.setPreferenceString(key.group, key.name, value);
		}
	}
	else							//EZ Preference
	{
		if (!EZ.validatePref(key)) return null;

		value = EZ.setConvertedValue(value);
		dw.setPreferenceString(EZ.prefGroup, key, value+'');
	}
	return value;
	//return {name: 'EZsetPref', note:'key='+key};
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
EZ.getConvertedValue = function EZgetConvertedValue(value, defaultValue)
{
	if (value === null || value == EZ.undefined)
	{
		if (defaultValue != EZ.undefined) value = defaultValue;
	}
	else if (value == 'true')
		value = true;

	else if (value == 'false')
		value = false;

	else if (typeof(value) == 'string' && value.substr(0,1)+value.right(1) == '[]')
	{
		if (value == '[]')	//empty array
			value = [];
		else
			eval( 'value=' + value.split(',') );
	}
	return value;
}
/*---------------------------------------------------------------------------------------------
convert true, false and array
---------------------------------------------------------------------------------------------*/
EZ.setConvertedValue = function EZsetConvertedValue(value)
{
	if (value === null || value == EZ.undefined) return '';

	if (EZ.isArray(value))
	{
		if (value.length == 0)
			value = '[]';
		else
			value = "['" + value.join("','") + "']"
	}
	return value;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
if (EZ && EZ.global && EZ.global.setup) EZ.global.setup('EZ', 'EZcore');
