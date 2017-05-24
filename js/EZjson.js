/*---------------------------------------------------------------------------------------------
===============================================================================================
12-22-2016: code moved to another file or not used ?? -- last updated: 12-18-2015 @ 01:23:24 AM 
===============================================================================================

EZ.json.format(o [,name] [,level], [work | options]) -- setup safe

Create json from Object or Array -- recursively calls itself for embedded arrays or objects.

ARGUMENTS:		
	o			Object, Array or ArrayLike object to create json
	name		String specified Object or Array name (default is json)
	
	level,work	Internal use when recursive calls made for embedded array and/or object
	
	options		Object any one or more of the following properties
					name: Object or Array name -- argument takes precedence if supplied
					collapse: [true | false]
					decode: [true | false]
					encode: [true | false]
					only: [keys...]  
					omit: [keys...] 
					newline=[keys,...][,'arrays'][,'objects']

RETURNS:
	string containing json representation of specified object or array.
---------------------------------------------------------------------------------------------*/
EZ.json.format = function(o, name, level, work)
{
	if (!o || 'object function'.indexOf(typeof(o)) == -1) return o;
	if (EZ.isEl(o,true)) return EZ.cloneNodes(o);
	
	///does not format embedded objects
	///if (EZ.isArray(o)) return o.slice();
	
	//----- Initialize work data object if top level call -- recursive calls pass as argument
	if (!work)
	{	
		if (EZ.isNone(o)) return '';		
		
		//EZ.init();
		///options = EZ.getOptions(arguments);		//not passed on recursive calls
		
		/// options is 2nd or 3rd argument if object
		var options = level || {};
		if (typeof(name) == 'object')	//2nd arg
		{
			options = name;
			name = '';
		}
		
		level = 0;	
		name = name || '.name'.ov(options, 'json');
		
		///var maxdepth = options.get('maxdepth', EZ.global.maxdepth);
		work = {
			
			json:'', jsonGroup:'', options:options, 
			maxdepth: '.maxdepth'.ov(options) || 'EZ.global.maxdepth'.ov(9),
			newline: '.newline'.ov(options, []),	//array of options
			indent: '.indent .indentSize'.ov(options) || 'EZ.json.indentSize'.ov(4),
			
			messages: {}	//new EZ.messages()
		};
	}
	EZ.json.format.work = work;
	
	//----- Create the json
	var pad = EZ.dup( (level+1) * work.indent,' ');
	var padPlus = '\n' + pad + ' '.dup(work.indent);
	var padMinus = '\n' + pad.substr(4);
	var pad = '\n' + pad;
	
	var p, json = '';
	var enclosed = '';
	var isEmpty = !work.jsonGroup;	
	if (EZ.quit) { appendKeyValue(true,false); return work.json; };
	
	var keyValue = name ? name + ':' : '';
	var lastKeys = 'displayName _name'.split(' ');
	if (EZ.isArrayLike(o))
		lastKeys.unshift('length');
	
	//if newline specified for this object key/property name
	var isNewline = ('.newline.['+name+']').ov(work);	
	///var isNewline = work.options.is('newline',name);
//isNewline =true;
	
var str = o == null ? '' : Object.keys(o).join('').replace(/(length|_name)/g,'');
	var isArray = Array.isArray(o) && !/[^\d]/.test(str);
	if (isArray)
	{					//normal array w/o any non-numeric keys
		enclosed = '[]';
		keyValue += enclosed.left();
		//if (level && !isNewline) isNewline = work.options.is('newline','array');
		if (level && !isNewline) isNewline = '.newline.[array]'.ov(work);
	}
	else
	{
		enclosed = '{}';
		keyValue += enclosed.left();
		//if (level && !isNewline) isNewline = work.options.is('newline','object');
		if (level && !isNewline) isNewline = '.newline.[object]'.ov(work);
		
		for (p in o)	//for non-array items
		{
			if (o.hasOwnProperty(p) && !omitted(p) 
			&& lastKeys.indexOf(p) == -1
			&& (isNaN(p) || typeof(p) == 'object'))
				formatItem(p);
		}
	}
	if (EZ.isArrayLike(o))
	{									//array items
		for (p=0; p<o.length; p++)
			formatItem(p);
	}
	if (!isArray)
	{
		isNewline = true;
		for (p=0; p<lastKeys.length; p++)	//keys displayed last
//if (p == null || o == null) debugger;

if (p != null && o != null
			&& o[lastKeys[p]] != undefined)
				formatItem(lastKeys[p]);
	}
	if (level == 0)	appendKeyValue(true);

	appendKeyValue(isNewline, enclosed);
	work.json += json;	//only for quit??
	//==============================
	if (level > 0) return json;
	//==============================
	
	if (EZ.log.json) console.clear();
	if (work.messages+'')
		EZ.oops(work.messages+'');
	if (EZ.log.json) EZ.log(json);
	
	//===============
	return json;
	//===============
	/**
	 *	Format object property -- append to line and/or work.line
	 */
	function formatItem(key)
	{
		if (EZ.quit) return;
		
		value = o[key];
		if (isEmpty) 
			appendKeyValue(true);
		
		// start keyvalue with key: unless o is array or value is object...
		if (typeof(value) != 'object' && !isArray)
			keyValue += key + ':';		
		
		switch(typeof value)
		{
			case 'function':
			{
				var funcObj = EZ.objectFromFunction(value);
				if (funcObj.name == 'anonymous') 
					funcObj.name = '';
				funcObj.name = funcObj.name || name;
				
				//----- check for function defined outside of object
				if (funcObj.name 
				&& eval('typeof ' + funcObj.name) == 'function'
				&& eval(funcObj.name) == value) 
				{
					keyValue += funcObj.name;
					break;
				}
				
				appendKeyValue(true);	//force newline for key
				
				//----- Start prior object values on newline if not already 
				//		(may nned to reach into work.json)
				var offset = json.lastIndexOf('\n') + 1;
				offset = json.substr(offset).lastIndexOf(enclosed.right()) + offset + 1;
				offset = json.substr(offset).lastIndexOf(enclosed.left()) + offset + 1;
				if (offset != -1 && json.substr(offset-1,1) == enclosed.left())
					json = json.substr(0,offset) + pad + json.substr(offset);
				
				//----- append function name and arguments to keyValue
				keyValue = 'function ' + funcObj.name + '(' + funcObj.arguments + ')';
				
				//----- append function body to keyValue...
				if (funcObj.body.length < EZ.json.maxLineChar && !/(\n|\\\\|\\\*)/.test(funcObj.body))
				{								//...on same line if body is short single line 
					keyValue += '{' + funcObj.body.trim() + '}';
				}
				else	
				{								//...otherwise append body on newline
					appendKeyValue(true);
					work.jsonGroup += keyValue
									+ padPlus + '{\n'
									+ EZ.join(funcObj.body.split('\n'),'', padPlus)
									+ padPlus + '}'
					keyValue = '';
					appendKeyValue(true);
				}
				if (!Object.keys(value).length) break;
				preview();		
				//fall thru to process function properties i.e. global varibles
			}
			case 'object':
			{
				if (o == null)
				{
				 	//do nothing -- fall thru to undefined
				}
				else if (!work.maxdepth || level > work.maxdepth) 
				{
					value = EZ.messages.maxdepth + work.maxdepth;
					work.messages.add(value);
				}
				else
				{
					var val = keyValue;
					//---------------------------------------------------
					var isValueArray = EZ.isArray(value);
					keyValue = EZ.json.format(value, key, level+1, work);
					//if (isValueArray)
					//	keyValue = keyValue.replace(/^\s{4}/mg,'').replace(/^\s{4}/,'');
					//---------------------------------------------------
					if (funcObj)
					{
						keyValue = keyValue.substr(key.length+1);
						keyValue = val + (keyValue == '{}' ? '' : ',' + keyValue.substr(1));
					}
					break;
				}
			}
			case 'undefined':
			case 'number':
			case 'boolean':	keyValue += value;
				break;
				
			case 'string':
			{				//embed inside single quotes
				keyValue += "'" + value.replace(/'/g, "\\'") + "'"; 
				break;
			}
		}
							//start newline if room on current line
		appendKeyValue();
		preview();		
		isEmpty = false;
	}
	/**
	 *	Display json with pending jsonGroup (keyValues grouped on same line)
	 *	and optionally pending keyValue formatting work in progress.
	 */
	function preview()
	{
		if (!EZ.log.json) return;
		
		var msg = json 
				+ itemSeparator(json)
				+ work.jsonGroup 
				+ itemSeparator(work.jsonGroup) 
				+ keyValue;
		
		console.clear();
		EZ.log(null, msg);
	}
	/**
	 *	Start new jsonGroup (i.e. newline) if isNewline is true (1st append jsonGroup to json).
	 *	Append keyValue to new or existing jsonGroup which are keyValue(s) grouped on same line.
	 *  if useCloseChar true, also append closeChar to close all object or array keyValues.
	 */
	function appendKeyValue(useNewline,useCloseChar)
	{								//object closeChar
		var ch = useCloseChar ? enclosed.right() : '';	
		
		//----- If useNewline specified, isNewline requested for key
		//		or current jsonGroup and keyValue too big for current line
		if (useNewline || isNewline
		|| (work.jsonGroup + keyValue).length > EZ.json.maxLineChar)
		{		
			var sep = itemSeparator(json) + pad;
			json = json.join([work.jsonGroup], sep);
			work.jsonGroup = keyValue;
			
			// if key or value type (e.g. array, object) specified newline
			if (work.jsonGroup && isNewline)
			{
				json = json.join([work.jsonGroup], sep);
				work.jsonGroup = '';
			}
			if (ch) 
				json += padMinus + ch;
		}
		//----- newline not needed -- append keyValue to jsonGroup (i.e. current line)
		else	
		{	
			var sep = itemSeparator(work.jsonGroup) + pad;
			work.jsonGroup = work.jsonGroup.join([keyValue], sep);
			work.jsonGroup += ch;	//appendClose(work.jsonGroup,ch);
		}
		///if (keyValue) isEmpty = false;
		keyValue = '';
		if (useCloseChar) 
		{
			enclosed = '';
			isEmpty = true;
		}
		return useNewline;
	}
	/**
	 *	return item separator if needed otherwise return blank.
	 */
	function itemSeparator(json)
	{
		return enclosed && json && ('{[:,'.indexOf(json.right()) == -1) ? ',' : '';
	}
	/**
	 *	return true to skip key as determined via only or omit option
	 */
	function omitted(key)
	{
return false;
		///TODO: work.options.get/is NOGO
		if (work.options.get('only'))
			return !work.options.is('only',key);
		else
			return work.options.omit.is(key);
	}
}	
//_____________________________________________________________________________________________
EZ.json.format.test = function()
{
	var obj = { a:'a', b:'b', '0':0, z:'0', f:false, t:true, u:undefined, n:null,
		l1: {
			va:'va', v0:0, a:'a','0':0, u:undefined, n:null,
				l2: { v:'val' }
		},
		arr_empty: [],
		arr_items: [1,2,3]
	}
	var defaults = {'':'na', 'undefined':'u', 'null':'n', '0':'zero', a:'A', t:'t', f:'f'}
	var simpleObj = {a:1};
	
	EZ.test.run(simpleObj, 'simpleObj'	, {EZ: {ex:'',	note:''	}})
	//EZ.test.run(obj,        'test'		, {EZ: {ex:'',	note:''	}})
}
/*---------------------------------------------------------------------------------------------
EZ.json.test(o, options)

DEPRECATED with EZ Unit Test 

ARGUMENTS:		
	arg			(*) blah blah

RETURNS:
	true if ... otherwise ...
---------------------------------------------------------------------------------------------*/
EZ.json.test = function()
{
	var obj = RZgetfieldvalue('json_test_options');
	var o = eval(obj);
	
	var json = EZ.json(o,'omit=_history');
	console.log(json);
}
EZ.json.test.displayName = 'EZ.json.test'
function EZjson_test()
{
	EZ.json.test();
}
/*---------------------------------------------------------------------------------------------
EZ.json.collapse(json)

ARGUMENTS:		
	json 	json string

RETURNS:
	json string with outer object name and brackets or braced removed.

EXAMPLE:
	EZ.options:{ omit=function,object }	-->  omit=function,object
---------------------------------------------------------------------------------------------*/
EZ.json.collapse = function(json)
{
}
/*---------------------------------------------------------------------------------------------
EZ.json.decode(json)

ARGUMENTS:		
	json 	json string

RETURNS:
	json string with outer object name and brackets or braced removed.

EXAMPLE:
	EZ.options:{ omit=function,object }	-->  omit=function,object
---------------------------------------------------------------------------------------------*/
EZ.json.decode = function(json)
{
}
/*---------------------------------------------------------------------------------------------
EZ.json.encode(json)

ARGUMENTS:		
	json 	json string

RETURNS:
	json string with outer object name and brackets or braced removed.

EXAMPLE:
	EZ.options:{ omit=function,object }	-->  omit=function,object
---------------------------------------------------------------------------------------------*/
EZ.json.encode = function(json)
{
}
/*---------------------------------------------------------------------------------------------
EZ.json.setup()

If json layer found, parse and update associated form fields with matching names.
Ff invalid json, append message with link to show syntax error to EZ.message and display.

ARGUMENTS:		
	none

RETURNS:
	nothing
---------------------------------------------------------------------------------------------*/
EZ.json.setup = function()
{
	var msg = '';	
	while (true)
	{	
		EZ.json.tag = EZ(EZ.layers.json)[0];
		if (EZ.isNone(EZ.json.tag)) break;					//no json container
		
		EZ.json.id = EZ.json.tag.id;
		EZ.json.script = EZ.json.tag.innerHTML;
	
		//-------------------------------------------------------
		EZ.json.data = EZ.json.parse(EZ.json.script,EZ.json.tag);
		//-------------------------------------------------------
		if (EZ.json.data)		 					
			EZ.json.loaded = true;						
		else							
		{
			EZ.json.data = {};			//json invalid -- create empty object
			if (EZ.json.script)			//Look for server message in json script
				msg = EZ.matchPlus(EZ.json.script,/[\s,]message:\s*'(.*?)'/)[1];
			
			// Append json error message to EZ.message
			EZ.message = EZ.concat(EZ.message, msg, EZ.json.parse.message);
			break;
		}
		EZ.fieldvalues = EZ.json.data.fieldvalues || {};
		EZ.submitvalues = EZ.json.data.submitvalues || {};
		if (!EZ.json.data.fieldvalues) break;					//fieldvalues unavailable		
		
		if (!document.forms || !window.RZsetfieldvalue) break;	//RZsetfieldvalue unavailable
		for (var f=0;f<document.forms.length;f++)				//Update form fields from fieldvalues
		{
			for (var name in EZ.fieldvalues) 
			{
				if (document.forms[f][name])					//field found in form f
				{
					var value = RZgetfieldvalue(name);			//get submited or default field value
					if (value != EZ.fieldvalues[name])			//if not blank ??
					{
						EZ.fieldvaluesUpdated++;
						EZ.submitvalues[name] = value;			//save original field value
						RZsetfieldvalue(name, EZ.fieldvalues[name]); 
					}
				}
			}	
		}
		break;
	}
}
EZ.json.setup.displayName = 'EZ.json.setup'
/*---------------------------------------------------------------------------------------------
EZ.json.parse(json [,layer])

Create Object or Array represented by specified json.

if json invalid (i.e. eval(json) throws exception, the innerHTML of the html element specified by 
layer is updated with the json and a notation near the syntax error.

ARGUMENTS:		
	json	string containing json representation of Array or Object of the following format:
				name: {...}		name={...}		{...}	
				name = [1,2,3,'x','y','z',true,false]
				
				where: "name ":" "=" and outer brackets { } or braces [ ] are all optional
						the name is removed from json -- not currently used or returned
	
	layer	(optional)  specifies layer used for reporting syntax errors -- can be html element
						-OR- string specifying tag or tagName used to create new layer 
						e.g. <pre id="EZjson" class="EZdebug">  or e.g. 'pre'
						
						default: <pre id="EZjson" class="EZdebug">  
						id defaults to "EZjson" if not specified in tag -- class defaults to "EZdebug"
						If id is not unique, a number is appended to make it unique.

RETURNS:
	Object or Array represented by specified json -- returns empty object if no json is blank. 
	
	If there is json syntax error, "EZ.json.parse.message" contains the followimng message:
	
		Unrecognized Data Returned from Server "Show Details"
	
	"Show Details" is link that displays json with notation near the syntax error.
	
	Example: EZ.display(EZ.json.parse.message)
	
	
	EZ.json.parse.objname
---------------------------------------------------------------------------------------------
			var comma = script.indexOf(',');
			var colon = script.indexOf(':');
			if (comma == -1 && colon == -1)
				msg = '??';
			else if (comma)
				msg = '??';
			break;
	if (arguments.length < 2)
	{
		tag = name;
		name = '';
	}
		
		obj = wrap[2] ? wrap[2] + '=' : ''
	//var script = EZ.matchPlus(json, /(^\s*[\w\s]*\s*:)?\s*(\{)?([\s\S]*?)(\})?\s*$/)[3];
---------------------------------------------------------------------------------------------*/
EZ.json.parse = function(json,layer)
{
	var msg = '';
	json = json || '';
	if (/^\s*$/.test(json)) return '';		//json empty
	
	//TODO: does not work if name: { missing -- first key treated as name														   
	
	//----- trim white space, get leading object or array name and inner script
	//		[2]=name    [3]=:|=|*empty*    [4],[6]={|[|*empty*    [5]=script 
	var results = EZ.matchPlus(json, EZ.patterns.jsonParts);
	EZ.json.parse.objname = results[2];
	var script = results[5];
	
	var wrap = ['{','}'];					//determine wrap { } or [ ]
	switch(results[2])
	{
		case '{': break;
		case '[': wrap = ['[',']']; break;
		default:
		{
			results = script.match();
			if (!results)
				msg = '??';
			else if (results[2])
				wrap = ['[',']'];
		}
	}
	
	//===============================================================
	var obj = jsonEval(script,wrap);
	if (obj) return obj;					//json good -- return obj
	//===============================================================
											
	var unbalencedBeg, unbalanceEnd = 0;	//pinpoint json syntax error	
	var start = json.indexOf(EZ.matchPlus(script,/^\s*(.*)/)[1]);
	var results, offsetGood = 0, offsetBad = -1;
	while (!msg)
	{										//try json up to next comma
		offsetGood = offsetBad + 1;
		offsetBad = script.indexOf(',',offsetGood);
		if (offsetBad == -1)				//end of json -- unexpected
		{
			msg = 'json not recognized';
			offsetGood = offsetBad = start;
		}
		else if (script.count("'",offsetBad) % 2 || script.count('"',offsetBad) % 2)
		{									//unbalanced single or double quotes				
			if (unbalencedEnd == 0)
			{	//move to next comma within next 80 char or until EOL
				unbalencedBeg = offsetGood + 1;
				unbalencedEnd = script.substr(offsetBad).search(/$/);
				if (unbalencedEnd == -1)
					unbalencedEnd = 200;
				unbalencedEnd = Math.max(200,unbalencedEnd) + offsetBad;
			}
			else if (offsetBad > unbalanceEnd)
			{	//bail after skipping to EOL
				//offsetBad = unbalanceBeg;
				offsetGood = unbalanceBeg;
				msg = 'Unbalanced quotes below';
				break;
			}
			continue;	
		}
		else unbalencedEnd = 0;
		
		//----------------------------------------------
		obj = jsonEval(script.substr(0,offsetBad), wrap)
		if (!obj) 		//bail from while
			msg = 'Unrecognized json below';
		//----------------------------------------------
	}
	if (offsetBad <= 0)
		start = offsetGood = offsetBad = 0;
	else 
		offsetBad++;

	//----- create json layer if not specified or not html element
	if (!EZ.isElement(layer)) 
		layer = EZ.createLayer('EZjson', layer || 'pre');

	//----- Wrap json layer and append bookmark above syntax error 
	var bookmark = layer.id + '_note';
	var layers = [layer.id, layer.id + '_wrapper', layer.id + '_note', layer.id + '_after'];

	layer.EZ.wrap('<div class="EZdebug" id="' + layers[1] + '">');
	
	layer.innerHTML = EZ.trim(json.substr(0,start),'\n')			//good json
				  + EZ.trim(script.substr(0,offsetGood),'\n')
				  + '\n';										
	
	var el = EZ.createElement('<a name="' + bookmark + '"></a>');	//bookmark 
	layer.parentNode.appendChild(el);			
	
	el = EZ.createElement(layer);						//syntax error with note
	el.setAttribute('id', layers[2]);
	el.EZ.addClass(EZ.css.className.jsonNote);
	el.innerHTML = EZ.dup(50,'_') + '\n'		
				  + '<b><i>' + msg  + EZ.dup(20,' .') + '</i></b>'
				  + EZ.trim(script.substring(offsetGood,offsetBad),'\n') + '\n'
				  + EZ.dup(50,'_');	// + '\n\n';
	layer.parentNode.appendChild(el);
	
	el = EZ.createElement(layer);					//json after 1st syntax error
	el.setAttribute('id', layers[3]);
	el.innerHTML = EZ.trim(script.substr(offsetBad),'\n');
	layer.parentNode.appendChild(el);
	
	// Create error message with link to show json with notation near syntax error
	var html = '<span class="{0}">{1} <a href="javascript:{2}">show details</a></span>'
				.format(EZ.css.className.errorMessage, EZ.messages.jsonBad);
						  
	var code = "EZ.show([{0}]);EZ.setframesize();setTimeout('location.hash=\\'#{1}\\'',500)"
				.format(layers, bookmark);
	
	EZ.json.parse.message = html.format('','',code);
	
	/*
	var link = "javascript:EZ.show(" + "['" + layers.join("','") + "']"  + ");"
			 + "EZ.setframesize();setTimeout('location.hash=\\'#" + bookmark + "\\'',500)";
	
	EZ.json.parse.message = '<span class="' 
						  + EZ.css.className.errorMessage + '">' 
						  + EZ.messages.jsonBad 
						  + ' <a href="' + link + '">show details</a></span>';
	*/
	//======================
	return '';
	//======================
	/**
	 *	run json with eval -- return obj if no error -- otherwise return empty string
	 */
	function jsonEval(script,wrap)
	{							
		var e, obj = ''
		try 
		{	
			jsonBalance();			//balance { } and [ ]
		
			//remove newlines, escape double quotes for eval
			script = script.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
			script = script.replace(/\n/g, ' ').replace(/"/g,'\\"');
			
			EZ.json.eval = 'obj=' + wrap[0] + script + wrap[1];
			eval(EZ.json.eval);
		}
		catch (e) {}
		return obj;
		/**
		 *	balance { } and [ ]
		 */
		function jsonBalance()
		{
			var aCount,bCount,fill,filled='';
			while (true) 
			{
				var aCountOpen  = script.count('[');
				var aCountClose = script.count(']');
				var oCountOpen  = script.count('{');
				var oCountClose = script.count('}');
				if (aCountOpen == aCountClose && oCountOpen == oCountClose) break;	//both balanced
				
				if (aCountOpen == aCountClose && oCountOpen != oCountClose)			//[ ] balanced -- { } not
					fill = '}';
				else if (aCountOpen != aCountClose && oCountOpen == oCountClose)	//{ } balanced -- [ ] not
					fill = ']';
				else if (script.lastIndexOf('[') > script.lastIndexOf('{'))			//niether balanced...
					fill = ']';														//...last [ after last {
				else
					fill = '}';														//...last { after last [
				
				filled += fill;
				script += '\n' + fill;
			}
		}
		return filled;
	}
}
EZ.json.parse.displayName = 'EZ.json.parse'
/*---------------------------------------------------------------------------------------
EZ.objectFromAny(o)

EZ.objectFrom... functions all return non-null object of some form.

Catch all for some useful algorithms -- object structures described for each function.
called by EZ.setupOptions()

???
EZ.objectFrom() creates object with keys from unique array values and EZ.toArrayMerge()
creates array containing keys but does not work if any array elements are objects.
	e.g. EZ.toArrayMerge( EZ.objectFromObject([1,2,2,3,3]) ) returns [1,2,3]
---------------------------------------------------------------------------------------*/
EZ.objectFromAny = function(o)
{
	if (EZ.quit) return null;
	if (EZ.isNone(o)) return {};

	switch(o.constructor)
	{
		case Array		: return EZ.objectFromArray(o)
		case Error		: return EZ.objectFromFunction(o)
	}
	switch(typeof o)
	{
		case 'string'	: return EZ.objectFromString(o);
		case 'function'	: return EZ.objectFromFunction(o);

		//TBD: for now returns {true} or {false}
		//TBD: for now returns { return number.toString(): number} e.g. {'1.3': 1.3}
		case 'boolean':
		case 'number':
			var str = o.toString()
			return { str: o };

		case 'object':
		{
			// convert array-like object to real Array object -- non-numeric keys dropped
			// object has length property but not Array constructor e.g. arguments object
			if (o.length && !isNaN(o))
				return Array.prototype.slice.call(o);

			return EZ.cloneObject(o);
		}
	}
	EZ.oops();
}
EZ.objectFromBoolean = function(o) { return EZ.objectFromAny(o); }
EZ.objectFromNumber  = function(o) { return EZ.objectFromAny(o); }
EZ.objectFromObject  = function(o) { return EZ.objectFromAny(o); }

EZ.objectFromAny.displayName 	 = 'EZ.objectFromAny';
EZ.objectFromBoolean.displayName = 'EZ.objectFromAny';
EZ.objectFromNumber.displayName  = 'EZ.objectFromNumber';
EZ.objectFromAny.displayName 	 = 'EZ.objectFromAny';
/*---------------------------------------------------------------------------------------
EZ.objectFromFunction(fn)

return object of the form {name: funcName, arguments: [...], body: ...}

For function: {name: funcName, arguments: [...], body: '...'}
	to recreate function: window[o.name] = new Function(o.arguments.join(','), o.body)
---------------------------------------------------------------------------------------*/
EZ.objectFromFunction = function(fn)
{
	if (typeof fn != 'function') fn = new Function();

	var results = fn.toString().match(EZ.patterns.fn);
	if (!results) results = ['*unknown*', '', ''];

	var func = {
		fn: fn,
		name: fn.displayName || fn.name || '',
		arguments: results[2].replace(/\s/g,'').split(','),
		values: [],
		keyvalues: {},
		body: '\t' + results[3]
	};
	func.desc = (func.name ? func.name : 'function') + '(' + results[2] + ')';
	func.name = func.displayName || func.name || 'anonymous';

	for (var i=0;i<func.arguments.length;i++)
	{
		var key = func.arguments[i];
		var value = undefined;
		if (func.arguments)		//if from call stack
		{
			if (i < func.arguments.length) 	//value supplied
				value = func.arguments[i];
			func.keyvalues[key] = value;
		}
		func.values.push(value);
	}

	switch (fn.constructor)
	{
		case Error:
		case EvalError:
		case RangeError:
		case ReferenceError:
		case SyntaxError:
		case TypeError:
		case URIError:
		{
			var o = {};
			for (var p in fn)
			{
				if (!fn.hasOwnProperty(p)) continue;
				if (fn[p] && typeof fn[p] == "object")
					o[p] = EZ.objectFromObject(p);
				else
					o[p] = fn[p];
			}
		}
	}
	return func;
}
/*---------------------------------------------------------------------------------------------
EZ.objectFromJson(str)

---------------------------------------------------------------------------------------------*/
EZ.objectFromJson = function(str)
{
	if (typeof str != 'string') return EZ.objectFromObject(str);
	EZ.oops(EZ.messages.untested);

	str = str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');	//unix-mac-win newlines --> \n
	str = str.replace(/\n/g, ' ').replace(/"/g,'\\"');		//replace newlines with space

	if (!/:\[/.test(str))				//if str does not contain : or [
		return EZ.fromArray(str);	//parse as delimited string

	// get prefix name if any
	var results = str.match(/^(.*?):(.*)/);
	if (results)
	{
		EZ.json.name = results[1];
		EZ.json.code = results[2];
	}
	else
	{
		EZ.json.name = '';
		EZ.json.code = str;
	}

	EZ.json.error = null;
	EZ.json.object = {};

	var e;
	try
	{
		eval('EZ.json.object=' + str);
	}
	catch (e) 		//not strictly valid json -- try parsing as keyValue pairs
	{				//e.g. color:red,white,blue eyes:blue,brown
		EZ.json.error = e;
		EZ.json.object = {};
		var keyValues = EZ.getKeyValues( str.replace(/:/g, '=') );	//attr format
		for (var key in keyValues)
			EZ.json.object[key] = EZ.objectFromJson(keyValues[key]);
	}
	return EZ.json.object;
}
EZ.objectFromJson.displayName = 'EZ.objectFromJson';
/*---------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------*/
if (EZ && EZ.global && EZ.global.setup) EZ.global.setup('EZ', 'EZjson');
