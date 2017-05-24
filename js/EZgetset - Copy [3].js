/*global 
EZgetTagType,
EZgetFieldValue,

EZnone, EZsetValue,
EZgetEl:true,
EZ, dw:true, DWfile, e:true, g  */
var e;
(function jshint_globals_not_used() {	//global variables and functions defined but not used
e = [
e, g, dw, DWfile]
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
	var stopAfterFirst = /^(RZ|EZ)_$/.test(callerName)		//always stop if caller EZ_()
					  || /^(RZ|EZ)\$$/.test(callerName) 	//never stop if caller EZ$() or ...
					  || (!EZ.is(els) && els.length > 1);	//...multiple selectors but not els
	
--------------------------------------------------------------------------------------------------*/
EZ.getEl = EZgetEl = function EZgetEl(selectors, nodes)
{
	var settings = EZ.is(nodes, EZ.getEl.getSettings) 
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
			if (!EZgetEl_getDescendants(tags, settings.roots)) 
				break;
			
			if (settings.nodes.length)		
				EZgetEl_getDescendants(tags, settings.nodes);
			break;
		}
		
		//---------------------------------------------------------------------------------- 
		//----- Full selection algorithm
		//---------------------------------------------------------------------------------- 
		[].every.call(settings.selectors, function forEverySpecifiedSelector(sel)		
		{											
			if (!EZgetEl_isSelectorType(sel) || sel == null) return true;	//skip invalid type
			
			sel = EZ.toArray(sel, false);	//TODO ','
			[].every.call(settings.selectors, function forEveryCommaDelimitedSelector(sel)	
			{											
				if (!EZgetEl_isSelectorType(sel) || sel == null) return true;	
				
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
							EZgetEl_addElements(nodes, EZ.getEl(node, settings.baseSetting));
						});									//last selector applied to all matches
					});										
					
					//----- if selector is element, array of elements or html collection
					if (EZ.isEl(sel)							//...only add elements descendant of roots??
					&& EZgetEl_getDescendants(sel,root)) 		
						if (EZgetEl_addElements(sel)) return;
					
					//----------------------------------------------------------------------------
					// for compound selector (e.g #footer.div.input) keep checking until any part 
					// of selectors does not match or all parts checked.
					//-----------------------------------------------------------------------------
					var parts = EZgetEl_getCompoundParts(sel);
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
								if (EZgetEl_addElements(el)) 	//also break if one is enough
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
							e = EZgetEl_getFormField(sel,root)		
							if (e != null)
							{ 	
								if (EZgetEl_addElements(e)) 	//quit if one is enough
									return false;
							}
						}
						if ('#'.indexOf(prefix) < 1)
						{										//try for id match
							e = EZ.getEl.getDocument(root).getElementById(sel);		
							if (EZ.isEl(e) && EZgetEl_getDescendants(e,root) != null) 
							{ 	
								if (EZgetEl_addElements(e)) 	//quit if one is enough
									return false;
							}
						}
						if ('<'.indexOf(prefix) < 1)
						{										//try as tagName
							e = root.getElementsByTagName(sel);		
							if (EZ.isEl(e)) 
							{ 	
								if (EZgetEl_addElements(e)) 	//quit if one is enough
									return false;
							}
						}
						if ('.'.indexOf(prefix) < 1)
						{										//try as css class
							e = root.getElementsByClassName(sel)		
							if (EZ.isEl(e)) 
							{ 	
								if (EZgetEl_addElements(e)) 	//quit if one is enough
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
			 ? [EZnone(settings)]			//EZnone() pseudo tag is default
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
	function EZgetEl_addElements(nodes)
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
	function EZgetEl_getCompoundParts(sel)
	{
		if (typeof(sel) != 'string') return [sel];		//return if not string
		if (/:\]\[]/.test(sel)) return undefined;		//unsupported selector char
		if (!/[#.:\]\[\w\d]/.test(sel)) return null;	//invalid selector char
		
		var groups = sel.matchPlus(/(\S)(([#.])([\w\d]*))/);
		if (groups) return [sel];				//if nothing found, not compound 
		
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
	function EZgetEl_getFormField(sel,root)
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
			if (EZgetEl_getDescendants(tags,root) == null)
				return true;				//keep looking if no tags are descendants
		});
		return (tags.length > 0) ? tags : null;
	}
	/**
	 *	return tags that are decendents of element that called EZ.getEl() 
	 
	 disabled this test
	 -OR- all tags returned when
	 *	EZ.getEl() not called from an element i.e. EZ.getEl.settingsroot is document object.
	 */
	function EZgetEl_getDescendants(tags, root)
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
	function EZgetEl_isSelectorType(sel)
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
EZ.getEl.test = function ()
{
	/*global  
		tstArrayObj, tstFn, tstObj, tstObjArrayLike,
		tstObjEmptyArray, t_doc, t_html, t_head, t_title, t_body, t_wrap, t_labels, t_inputs,
		t_forms, t_fm, t_none, t_tags, t_array, t_divs, t_radios, t_radio01, t_label_some, 
		t_mixed, t_idandclass
	*/
	(function jshint_globals_not_used() {	//global variables and functions defined but not used
	e = [
		tstArrayObj, tstFn, tstObj, tstObjArrayLike, 
		tstObjEmptyArray, t_doc, t_html, t_head, t_title, t_body, t_wrap, t_labels, t_inputs,
		t_forms, t_fm, t_none, t_tags, t_array, t_divs, t_radios, t_radio01, t_label_some, 
		t_mixed, t_idandclass
	]})

	var note

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
	EZ.test.run(EZ.getEl, div, 			{EZ: {ex:null, note:note}} );
}
/**
 *	return document object for el
 */
EZ.getEl.getDocument = function EZgetEl_getDocument(el)
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
EZ.getEl.getSettings = function EZgetEl_getSettings(ctx, args)
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
	EZgetEl_getElements(this.roots, this.baseSettings, document);
	EZgetEl_getElements(this.nodes, this.baseSettings, this.roots);
	
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
		if (EZ.isArrayLike(tags) && tags.length === 0) return;

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

/*---------------------------------------------------------------------------------------------
return element value(s) as array -- useful for multi-select field
blank or no values returned as ??
---------------------------------------------------------------------------------------------*/
function EZgetValues(el, defaultValue)
{
	var tags = EZ.toArray(el);		//returns empty Array if el null, blank or undefined
	var values = [];
	[].forEach.call(tags,function(el)
	{
		var val = EZgetValue(el, defaultValue);
		values = values.concat( EZ.toArray(val, '|') )
	});
	return values;
}
/*---------------------------------------------------------------------------------------------
return element value -- cloned from EASY.js beta:

if unknown el return defaultValue or undefined
if form field, return field value else el.innerHTML if defined otherwise null

TODO: defaultValue may not be complete
	  consolidate, merge or sync with EZget(), EZval() and EZget_basic()
---------------------------------------------------------------------------------------------*/
function EZgetValue(el, defaultValue)	
{									//el arg is single element, html collection or selector(s)
	el = EZ.getEl(el,true)[0];		//get 1st element of collection or matching 1st selector
	if (!el || el.undefined) 				
		return defaultValue;		//TODO: return default or undefined??
									
	var name = el.name || el.id || '';
	var value = el.value != EZ.undefined ? el.value
			  : el.innerHTML != EZ.undefined ? el.innerHTML
			  : '';
	switch (EZgetTagType(el))
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
					value = EZgetTagValue(tags[i]);
					if (value !== '')				//return value if defined...
						return value.isTrueFalseValue();
	
					var id = tags[i].id;
					if (id && id != name)			//...return id if diff from name
						return id;
													//...return parent label text if any
					var label = EZgetParent(tags[i], 'label');	//see EZ.getAncestor()
					if (!EZisNone(label))
						return EZtrim(label.innerText).isTrueFalseValue();
	
					return '';		//no value, id or label text found for checked button
				}
				return '';			//no button checked
			}
		}
		case 'checkbox':
		{
			value = EZgetTagValue(el);
			if (value !== '')
				return  el.checked ? value : '';
			else
				return el.checked;
		}
		case 'select':
		{				//use EZgetFieldValue() if el.selectedIndex >= 0
			if (el.selectedIndex == -1) return '';
			if (typeof(EZgetFieldValue) == 'function')
				return EZgetFieldValue(el);
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
	  consolidate, merge or sync with EZset(), EZval() and EZset_basic()

select/ text field -- .replace(/(\r\n|\n|\r)/g, EZ.constant.EOL);
	var type = /input/i.test(el.tagName || '') 
				? el.type 				//use tag.type for input tag
				: el.tagName || '';		//otherwise tagName if defined
	switch (type.toLowerCase())
---------------------------------------------------------------------------------------------*/
function EZsetValue(el, value, defaultValue)
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
		var isValueTrueLike = EZisTrueLike(value);
		var isValueFalseLike = EZisFalseLike(value);

		switch (EZgetTagType(el))
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
						var buttonValue = EZgetTagValue(tags[i]);
						if (value !== '' && buttonValue.toLowerCase() === value.toLowerCase())
						{
							tags[i].checked = true;
							return values.push(EZgetValue(name));		//return if matching value found
						}

						if (value === '')
						{
							if (blankButton === '')
								blankButton == tags[i];
						}
						if (EZisTrueLike(buttonValue))
						{									//button value is trueLike...
							if (!isValueTrueLike)
								tags[i].checked = false;	//...uncheck if value not trueLike
							if (!trueLikeButton)
								trueLikeButton = tags[i];	//...remember if 1st trueLike button
						}
						if (EZisFalseLike(buttonValue))
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
							//var label = EZgetParent(tags[i], 'label');	//see EZ.getAncestor()
							var label = EZgetAncestor(tags[i], 'label');	//see EZ.getAncestor()
							if (!EZ.is(label)) break;

							var labelText = EZtrim(label.innerText).toLowerCase();
							if (labelText === '') break;

							if (!labelEqualsButton && labelText === value.toLowerCase())
								labelEqualsButton = tags[i];

							if (!labelContainsButton && labelText.indexOf(value.toLowerCase()) != -1)
								labelContainsButton = tags[i];

							if (!labelTrueLikeButton && EZisTrueLike(labelText))
								labelTrueLikeButton = tags[i];

							if (!labelFalseLikeButton && EZisFalseLike(labelText))
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

					return values.push(EZgetValue(name));
				}
			}
			case 'checkbox':
			{
				value = value.toString();
				var elValue = EZgetTagValue(el);
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

				return values.push(EZgetValue(el));
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
					EZselectScroll(el,i)				//scroll into view

				return values.push(EZgetValue(el));
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
