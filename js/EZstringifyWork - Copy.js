/*--------------------------------------------------------------------------------------------------
Dreamweaver LINT global references and definitions  not used here
--------------------------------------------------------------------------------------------------*/
/*global
EZ, DWfile,

e:true, g:true, dw:true, f:true
*/
var e;			//global var for try/catch
(function() {[	//global variables and functions defined but not used

e, f, g, dw, DWfile ]});
//__________________________________________________________________________________________________
EZ.stringifyWork = function EZstringifyWork(value, replacer, spaces)
{
	if (value == null) return '"' + value + '"';
	try
	{
		//----- if replacer argument omited, use as spaces argument
		if (arguments.length == 2 && typeof(replacer) == 'number')
		{
			spaces = replacer;
			replacer = null;
		}

		//----- define global varibles
		var options = replacer,
			include = [],				//properties included in addition to extract list
			exclude = [],				//properties ignored -- include has precedence
			extract = [],				//only extract these properties unless included
			nestedKeys = ['$'],			//nested key name -- not used but retained for future
			objectKeys = typeof(value) == 'object' ? [Object.keys(value)] : [],
			objectStack = [null],
			processedObj = [],
			processedKey = [],
		//	repeatedObj = [],
			replacerFunctions = [],
			pad, padding,
		//	errorObj,
		//	topKeys = [],
										//escape codes
			QUOTE = '@@~@@',
			QUOTE_EMBEDDED = '@@!@@',
			EOL = '@@eol@@',
			NEWLINE = '@@EOL@@',
			BACKSLASH = '@@/@@',
			NAN = '@@NaN@@',
		//	TAB = '@@tab@@',
			REGEXP = '@@RegExp@@',
			UNDEFINED = '@@undefined@@',
			INFINITY_PLUS = '@@Infinity@@',
			INFINITY_NEG = '@@-Infinity@@',
			PREFIX = '@@=@',
			SUFFIX = '@=@@',
			WRAPPER = RegExp('("' + PREFIX + '|' + SUFFIX + '")', 'g');	//("@@=@|@=@@")

		if (this != EZ.json.stringify)		//process arguments and create options
		{
			jsonFormatOptions();
			EZ.json.repeatList = [];
		}
void(0) 
if (EZ.quit) return '"quit"';

		pad = isNaN(options.SPACES) ? options.SPACES
			: '          '.substr(0,options.SPACES)
		pad = pad.substr(0,10);
		padding = '\n' + pad;
		
		/*
		//-----	if object is circular, returns Object of the form: 
		//		{"Object.keys()": "id, name ...", "TypeError": "Converting circular structure to JSON"}
		if (!options.CIRCULAR && (errorObj = EZ.isObjectCircular(value)))
		{
			value = errorObj;
			jsonReplacer = null;
		}
		*/
		//-------------------------------------------------------------
		var json = JSON.stringify(value, jsonReplacer, options.SPACES);
		//-------------------------------------------------------------
		if (json != EZ.undefined)
			json = json.replace(WRAPPER, '');	//remove outer quotes

		if (this == EZ.json.stringify)	//internal call from jsonReplacer()
			return json;

		//=======================
		return jsonFinalize(json);
		//========================
	}
	catch (e)
	{
		//e.format();
		EZ.techSupport(e, arguments, this);
		
		var errorObj = { 'Object.keys()': Object.keys(value).join(', ') }
		errorObj[e.constructor.name] = e.message;
		
		json = JSON.stringify(errorObj, null, options.SPACES);
		throw (json);
	}
	//______________________________________________________________________________
	/**
	 *	finalize -- convert or remove escape codes from final json
	 */
	function jsonFinalize(json)
	{
		if (options.ROOT)
			json = options.ROOT + ' = ' + (json || '""');
		else if (json === undefined)
			return '';

		json = json.replace(RegExp(QUOTE, 'g'), '"');

		// must follow un-escape QUOTE to remove nested outer quotes
		json = json.replace(WRAPPER, '');

		json = json.replace(RegExp(NEWLINE, 'g'), '\n');	//NEWLINE --> \n
		json = json.replace(RegExp(EOL, 'g'), '\\n');		//    EOL --> \\n
		json = json.replace(RegExp(BACKSLASH, 'g'), '\\');	//BACKSLASH --> \

		json = json.replace(RegExp('"' + UNDEFINED + '"','g'), 'undefined');
		json = json.replace(RegExp('"' + REGEXP + '(.*)"','g'), function(all,regex)
		{
			return '/' + regex.replace(/\\\\/g, '\\')		//do not need backslash
		});													//escaped for pattern

		json = json.replace(RegExp(QUOTE_EMBEDDED ,'g'), '\\"');

		json = json.replace(/\\t/g, '\t');					//	\\t --> \t

		// NAN, UNDEFINED, INFINITY_PLUS, INFINITY_NEG
		json = json.replace(/"@@(.*?)@@"/g , '$1');
		//json = json.replace(RegExp('"(@@' + NAN + '"','g'), 'NaN');

		//----- un-quote Object keys when valid variable name i.e. alphaumeric
		//	json = EZ.json.unquoteKeys(json);
		//if (options.SCRIPT && !options.KEYS)
		if (!options.KEYS)
		{
			json = json.replace(/([{,]\s*)"([\w_]+?)":/gi,
			function(all, sep, key)
			{
				if ('null undefined'.indexOf(key) != -1) return all;
				return sep + key + ":"
			});
		}
		
		return json;
	}
	//______________________________________________________________________________
	/**
	 *	escape embedded newlines, quotes and backslashes from json String so they
	 *	do not get escaped upon return to native JSON.stringify() from jsonReplacer()
	 */
	function jsonEscape(json, wrap)
	{
		if (wrap)							//wrap with escape codes to discard...
			json = PREFIX + json + SUFFIX;	//...outer quotes wrapped upon return

		if (typeof(json) != 'string')
			return json;

		json = json.replace(/"/g, QUOTE);
		json = json.replace(/\n/g, NEWLINE);
		json = json.replace(/\\/g, BACKSLASH);
		return json;
	}
	//______________________________________________________________________________
	/**
	 *	JSON replacer: WORKHORSE for extended json suporrted for EZ.json.stringify()
	 *
	 *	First calls any replacers specified as EZ.json.stringify() replacer arguments
	 *
	 *	Then process NaN, undefined, multiline String, Array, Function or RegExp
	 *	based on EZ.json.stringify() options.
	 */
	function jsonReplacer(key, value)
	{
		var ctx = this;					//development convenience
		[ctx]
console.log({key:key, value:value, ctx:this})		
		/*
		var replacers = replacerFunctions.slice();
		while (replacer.length)
		{								//TODO: not tested
			value = replacers.shift.call(this, key, value, options.SPACES);
		}
		*/

		  //---------------------------------------------------------------------------\\
		 //----- do EZ.json.stringify() replacements after specified replacer functions -----\\
		//-------------------------------------------------------------------------------\\
		var idx, isArray, json, padHere, pre, script,
			obj = {},
			json = '';

		switch (getType(value))
		{
			case 'Null':				//------------------------------------
			case 'Boolean':				// null, boolean -- return value as-is
				return value;			//------------------------------------

			case 'Array':				//------------------------------------------------
			case 'Object':				// Array, Object -- processed by code after switch
				break;					//------------------------------------------------

										//----------------------------------------------
			case 'Undefined': 			// undefined -- return escaped String if enabled
			{							//----------------------------------------------
				return options.UNDEFINED ? UNDEFINED
										 : value;	//value as-is if not enabled
			}
										//--------------------------------------------------
			case 'Number':				// NaN, Infinity -- return escaped String if enabled
			{							//---------------------------------------------------
				return isNaN(value) && options.NAN  ? NAN
					 : value === Infinity ? (options.INFINITY ? INFINITY_PLUS : null)
					 : value === -Infinity ? (options.INFINITY ? INFINITY_NEG : null)
					 : value;
			}
										//-----------------------------------------------
			case 'Element':				// html element -- extract or EZ.format.Element()
			{							//-----------------------------------------------
				if (extract.length)
					break;
					
				else if (!EZ.format || true)
				{
					value = _json_htmlExtract(value);
					break;
				}
				else if (EZ.format)
				{
					value = EZ.format.Element(value, options.htmlFormatter);
					if (typeof(value) != 'string')
						break;
				}
										/* jshint ignore:start*/	//FALL-thru
			}
										//-----------------------------------------------------
			case 'String':				// multiline String -- separate lines if SCRIPT enabled
			{							//-----------------------------------------------------
										/* jshint ignore:end */
				value = value.replace(/"/g, QUOTE_EMBEDDED);
				if (options.SCRIPT && value.indexOf('\n') != -1)
				{							//breakup into multiple lines

					padHere = (objectStack.length > 1) ? padding : '\n';
					value = QUOTE + padHere + '+ ' + QUOTE
						  + value.replace(/\n/g, EOL + QUOTE + padHere + '+ ' + QUOTE)
				}
				else
					value = value.replace(/\n/g, EOL);
				value = jsonEscape(value);
				return value;
			}
										//-------------------------------------------
			case 'RegExp':				// RegExp -- return escaped String if enabled
			{							//-------------------------------------------
				if (options.REGEXP)
				{
					value = REGEXP
						  + value.source + '/'
						  + (value.global ? 'g' : '')
						  + (value.ignoreCase ? 'i' : '')
						  + (value.multiline ? 'm' : '')
					return jsonEscape(value);
				}
				return value;
			}

			/* jshint ignore:start*/	//FALL-thru
			case 'Function':
			/* jshint ignore:end */
			default:
			{
				switch (typeof value)
				{						//----------------------------------------
					case 'function':	// Function constructor or typeof function
					{					//----------------------------------------
						if (!options.FUNCTIONKEYS && !options.FUNCTIONSCRIPT && !options.FUNCTIONTYPE)
						{								//if typeof function not enabled...
							return {};					//...return empty Object
						}
						script = untab(value+'');
						if (options.FUNCTIONSCRIPT)
							void(0);
						else if (options.FUNCTIONTYPE)	//empty script if keeping typeof function
							script = 'function() {}';
						else
							script = '';

						if (options.SCRIPT)				//if SCRIPT format . . .
						{
							if (options.FUNCTIONKEYS)
							{							//copy enumerable properties if any
								Object.keys(value).forEach(function(key) {obj[key] = value[key]});
								json = EZ.json.stringify.call(EZ.json.stringify, obj, options);
								if (json == '{}')
									json = '';
							}
							if (!json)
							{							//if no properties...
								if (!options.FUNCTIONSCRIPT && !options.FUNCTIONTYPE)
									return {};			//...return empty object if NOT keeping script
								json = script;			//...if keeping, return function declaration json
							}
							else						//if properties, use closure function with bit of
							{							//javascript so json parses as typeof function
								pre = '(function()\n'
									+ '{';

								if (script)
									script = padding + 'var ____function____ = ' + script + ';';

								if (json)
									json = 'var ____properties____ = '
										+ indent(json) + ';\n'
										+ pad + 'for (var key in ____properties____)\n'
										+ pad + '{____function____[key] = ____properties____[key];\n'

								json += pad + 'return ____function____;\n'
									  + '})()'

								if (objectStack.length > 1)
								{
									pre = indent(pre);
									json = indent(json);
								}
								json = pre + script + padding + json;
							}
							return jsonEscape(json,true);
						}
						else	//otherwise clone as Object to stringify enumerable properties
						{
							if (script)						//if script...
							{								//add '____function____' property
								key = '____function____';	//for all script from toString()
								obj[key] = script.replace(/\n/g, EOL);
							}
							if (options.FUNCTIONKEYS)		//keep enumerable properties if enabled
							{
								Object.keys(value).forEach(function(key)
								{
									if (value.hasOwnProperty(key))
										obj[key] = value[key];
								});
							}
							value = obj;					//set value to cloned Object
							break;							//then stringify as Object
						}
					}
											//-------------------------------------------
					/* jshint ignore:start*/	//FALL-thru
					case 'object':			// Object not created with Object constructor
					/* jshint ignore:end */
					{						//-------------------------------------------
						//TODO: html object incomplete -- see work in EZ.toString()

						// for HTML object, clone as standard Object with all attributes
						// and acessible properties if replacer argument does not exclude
						if (options.HTML && value.constructor.name.substr(0,4) == 'HTML')
						{
							[].forEach.call(value.attributes,function(key)
							{								//for all attributes . . .
								obj.attributes = obj.attributes || {};
								obj.attributes[key.name] = key.value;
							});
							obj.attributes = jsonExtractFilter(obj.attributes);
							/* jshint ignore:start*/
							if (value.__proto__ != EZ.undefined)
							{								//for all acessible properties
								value = jsonExtractFilter(value.__proto__);
								Object.keys(value).forEach(function(key)
								{
									var e;
									try
									{						//TODO: keep if not circular
										if (!value[key] instanceof Object)
											return;
										if (!(key in obj)) 	//if not already added e.g. attributes
											obj[key] = value[key];
									}
									catch(e)
									{
										void(0);
									}
								});
							}
							/* jshint ignore:end */
							value = obj;	//stringify cloned obj
						}
						break;				//break to complete object processing
					}
											//-------------------------------------------
					/* jshint ignore:start*/	//FALL-thru
					default: 				// process value as-is for any other types
					/* jshint ignore:end */
						return value;		//-------------------------------------------
				}
			}
		}

		  //------------------------------------\\
		 //----- Array or Object processing -----\\
		//----------------------------------------\\
		isArray = getType(value) == 'Array';
		if (value == objectStack[0])
		{
			if (key === '')
				return value;
			
			var repeatIdx = processedObj.indexOf(value);
			if (repeatIdx == -1)
				return value;						//currently processing Object
			
			else
			{
				return _processCircular(repeatIdx);
			}
		}
		if (!isArray)
		{
			value = jsonExtractFilter(value, key);
			if (value === undefined)
				return value;
		}

		//-----
		if (!key)
		{
			if (this[key] == value)
				key = nestedKeys.pop();
			else
			{
				var obj = objectStack[0];
				if (!obj)
					key = '$';
				else
				{
					objectKeys[0].every(function(p,idx)
					{
						if (obj[p] != value) return true;
						key = p;
						objectKeys[0].splice(idx,1);
					});
				}
			}
		}
		if (this[key] != value)
			void(0);							//debugger breakpoint

		objectStack.unshift(value);				//push Object onto process stack
		objectKeys.unshift(Object.keys(value));
		nestedKeys.push(key);

		if (!isArray)
		{
			json = jsonValue(value);
			if (objectStack.length > 2)
				json = indent(json);
		}
		
		//_______________________________________________________________________________
		/**
		 *	return dotName from nestedKeys
		 */
		function getDotName()
		{
			return nestedKeys.join('.').replace(/\.\[/g, '[');
		}

		//_______________________________________________________________________________
		/**
		 *	Get json for value if object already processed return the following String:
		 *
		 *		"{$.results.args[0]=$.results.arguments[0]}"
		 *
		 *	where:
		 *		$.results.args[0] is dotName of property from root
		 *		$.results..arguments[0] refers to Object already Strinified
		 *
		 *	The placeholders will be replaced in final json returned by EZ.json.stringify()
		 *	if not circular references such as {obj: {o:obj}}
		 *
		 *	If SCRIPT option is specified JavaScript similar to the following is used
		 *	when circular references are found:
		 *
		 *		(function()
		 *		{
		 *			$ = "json ...";
		 *			$.results.args[0]={$.results.arguments[0];
		 *				. . .
		 *			return $;
		 *		})();
		 */
		function _processCircular(repeatIdx)
		{
			var repeatKey = processedKey[repeatIdx];
			var repeatValue = EZ.isArray(processedObj[repeatIdx]) ? ["_[repeatKey]:" + repeatKey]
																  : {"_[repeatKey]": repeatKey};
			var item = {};
			item[getDotName(key)] = repeatKey;
			EZ.json.repeatList.push(item);
			
			if (options.CIRCULAR)
			{
			}
			//return jsonEscape(json, true);
			return EZ.isArray(value) ? [repeatValue]
									 : {'_[repeat]': repeatValue};
		}

		//_______________________________________________________________________________
		/**
		 *	
		 */
		function jsonValue(value, idx)
		{
			if (idx != null)								//Array ??
				nestedKeys.push(key);

			else if (typeof(value) == 'object')
			{
				processedObj.push(value);
				processedKey.push( getDotName() );
			}
			
			var sp = spaces === 0 ? 0 : options.SPACES;		//11-01-2016
			//var sp = options.SPACES;						//	 ''
			//=========================================================================
			var	json = JSON.stringify.call(EZ.json.stringify, value, jsonReplacer, sp);
			//=========================================================================

			if (idx != null)
				nestedKeys.pop();

			if (json !== undefined)
				json = json.replace(WRAPPER, '');

			//==========
			return json;
			//==========
		}

		  //-------------------------------\\
		 //----- create json for Array -----\\
		//-----------------------------------\\
		if (isArray)
		{
			var delim = '',
				useSepLine,
				itemCount = 0,
				needIndent = false,
				jsonForItem = '',
				jsonForLine = '',
				jsonForItems = '',
				jsonForKeys = '',
				properties = null;

			// Create new Object() for any non-numeric enumerable Array properties
			if (options.ARRAYKEYS)
			{
				Object.keys(value).forEach(function(key)
				{
					if (!isNaN(key) || !value.hasOwnProperty(key)) return;
					properties = properties || {};
					properties[key] = value[key];
				});

				if (properties && !options.SCRIPT)	//named Array properties found AND
				{									//not script format, clone Array items
					value = value.slice();			//then add pseudo item for properties
					value.push({"____properties____": properties});
				}
			}
			//--------------------------
			// for each Array item . . .
			//--------------------------
			for (idx=0; idx<value.length; idx++)	//TODO: why not EZ.json.stringify() ??
			{										//get deep json for each item
				var item = value[idx];
				var jsonForItem = jsonValue(item, idx);
				if (jsonForItem === undefined)
					continue;

				if (typeof(item) != 'object' 		//probably not used
				&& jsonForItem.indexOf('{') === 0)	//remove spaces and newlines
					jsonForItem = jsonForItem.replace(/\s/g, '');

				if (idx == (value.length-1) && properties && jsonForItem == '{}')
					continue;						//no named properties extracted

				useSepLine = false;
				jsonForLine += delim + jsonForItem;

				if (typeof(item) == 'string'
				&& jsonForItem.indexOf('"' + QUOTE + NEWLINE) === 0)
				{
					useSepLine = true;				//separate lines for multiline String
					json += delim
					delim = '';
				}
				if (item instanceof Object && !/(String|Number|Boolean)/.test(getType(item)))
				{
					useSepLine = true;				//separate line for Object json
					if (item.constructor == Array)
						jsonForItem = jsonForItem.replace(/\n/g, padding);
				}
				else if (jsonForItem.length > options.ARRAYMAXLINELENGTH)
				{									//TODO: split into multiple lines??
					useSepLine = true;				//separate line for long String
				}
				else if (itemCount >= options.ARRAYITEMSPERLINE
				|| jsonForItem.length > options.ARRAYMAXLINELENGTH)
				{									//start newline after too many items
					json += delim.replace(/ /, '\n')
					delim = '';
					itemCount = 0;
					jsonForLine = jsonForItem;
					needIndent = true;
				}
				if (useSepLine)
				{									//start newline
					json += delim.replace(/ /, '\n') + jsonForItem;
					delim = ',\n';
					itemCount = 0;
					needIndent = true;
					jsonForLine = '';
				}
				else								//append to current line
				{
					json += delim + jsonForItem;
				//	delim = ', ';					//11-01-2016
					delim = ',' + (spaces === 0 ? '' : ' ');
					itemCount++;
				}
			}
			//-----------------------------------------------------------
			// all Array items processed -- indent and/or wrap with [...]
			//-----------------------------------------------------------
			jsonForItems = json;

			padHere = '';
 			if (needIndent)			//indent Array ITEMS
			{
				json = padding + json.replace(/\n/g, padding);
				if (typeof objectStack[1] == 'object' && objectStack.length > 2)
					json = indent(json, true);
				else if (key)
					padHere = padding;
				else
					padHere = '\n';
			}
			json = '[' + json + padHere + ']';

			//----------------------------------------
			// SCRIPT format of named Array properties
			//----------------------------------------
			while (properties && options.SCRIPT)
			{
				jsonForKeys = EZ.json.stringify.call(EZ.json.stringify, properties, options);
				if (jsonForKeys == '{}') break;

				// encapulate Array json in closure function with named property
				// json and bit of javascript to restore values when json parsed
				json = ''
					 + '(function()\n'
					 + '{' + padding

					 + 'var ____array____ = ['
					 + padding
					 + indent(pad+jsonForItems)
					 + padding
					 + '];' + padding

					 + 'var ____properties____ = ' + indent(jsonForKeys) + ';\n'

					 + pad + 'Object.keys(____properties____).forEach(function(key)\n'
					 + pad + '{____array____[key] = ____properties____[key]});\n'
					 + pad + 'return ____array____;\n'
					 + '})()'
				if (objectStack.length > 2)
					json = indent(json);
				break;
			}
		}
		  //-----------------------------------------------------\\
		 //----- return escaped String as value to stringify -----\\
		//---------------------------------------------------------\\
		obj = objectStack.shift();
		objectKeys.shift();
		nestedKeys.pop();
		//============================
		return jsonEscape(json, true);
		//============================

		//______________________________________________________________________________
		/**
		 *
		 */
		function untab(all)
		{
			return all;
			/*TODO:
			all = all.replace(/(['"])(.*)\1/gm, function(all)
			{
				return all.replace(/\t/g, '##tab##')
			});
			all = all.replace(/\t/gm, '    ');
			all = all.replace(/##tab##/gm, '\t');
			return all;
			*/
		}
		//______________________________________________________________________________
		/**
		 *
		 */
		function indent(json, more)
		{
			var regex = RegExp('(' + NEWLINE + ')', 'g');
			json = json.replace(regex, '$1' + padding.substr(1));
			json = json.replace(/\n/g, padding) + (more ? padding : '');
			return json;
		}
		//______________________________________________________________________________
		/**
		 *	use options.include, options.exclude, options.extract to limit or expand
		 *	Object properties stringified.
		 */
		function jsonExtractFilter(value)
		{
			var includeKeys = [];
			var excludeKeys = [];
			if (extract.length > 0 || exclude.length > 0)
			{								//if extracted keys specified
				for (var key in value)			//for enumerated keys...
				{
					if (key.substr(0,4) == '____' && key.substr(-4) == '____')
					{
						if (exclude.indexOf(key) != -1)
							excludeKeys.push(key);	//...explicit omit
					}
					else if (include.indexOf(key) != -1)
						includeKeys.push(key);		//...explicit keep

					else if (exclude.indexOf(key) != -1)
						excludeKeys.push(key);		//...explicit omit

					else if (extract.indexOf(key) == -1
					&& extract.length > 0)
						excludeKeys.push(key);		//...implicit omit
				}
			}
			extract.concat(include).forEach(function(key)
			{									//for all specified keys...
				if (!(key in value)					//not enumerable
				&& typeof value[idx] != EZ.undefined) 	//but exists
					includeKeys.push(key);			//...add
			});

			if (!includeKeys.length && !excludeKeys.length)
				return value;				//bail if value good "as is"

			var extactKeys = Object.keys(value);
			excludeKeys.forEach(function(key)
			{								//remove excluded from enumerated
				var idxKey = extactKeys.indexOf(key);
				if (idxKey != -1 && includeKeys.indexOf(key) == -1)
					extactKeys.splice(idxKey,1);
			})

			var isEmpty = true, clone = {};
			extactKeys.concat(includeKeys).forEach(function(key)
			{								//clone value from enumerated list
				try							//plus included keys
				{
					clone[key] = value[key];
					if (key != '____properties____')
						isEmpty = false;
				}
				catch(e)
				{
					void(0);
				}
			});
			return !isEmpty ? clone 		//return clone if not empty
							: undefined;	//otherwise, return undefined
		}
	}
	
	//______________________________________________________________________________________
	/**
	 *	extract html element default properties -- avoids circular
	 */
	function _json_htmlExtract(value)
	{
		var extract = 'tagName id name type className'.split(/\s+/);
		var json = JSON.stringify(value, extract);
		return JSON.parse(json);
	}
	//______________________________________________________________________________
	/**
	 *	setup global varibles including options based on EZ.json.stringify() arguments.
	 *	returns options Object.
	 */
	function jsonFormatOptions(/* key, value */)
	{
		options = {};
		options.SPACES = (spaces || options.SPACES);

		  //----------------------------------------------\\
		 //----- process replacer specified as object -----\\
		//--------------------------------------------------\\
		if (getType(replacer) == 'Object')
		{
			var optionsString = '';
			Object.keys(replacer).forEach(function(key)
			{								//add directly to options
				if (/(include|exclude|extract)/.test(key))
					options[key] = EZ.toArray(replacer[key], ', ');

				else if (!replacer[key])	//add key to string
					optionsString += ' *' + key;

				else						//add key=value to string
					optionsString += ' *' + key + '=' + replacer[key];
			});
			replacer = optionsString.trim();
		}
		  //----------------------------------------------------------------\\
		 //----- process replacer argument as String, Array or Function -----\\
		//--------------------------------------------------------------------\\
		switch (getType(replacer))
		{
			case 'Function':
				replacerFunctions = [replacer];

			/* jshint ignore:start*/	//FALL-thru
			case 'String':						//convert comma/space delimited String to Array
			/* jshint ignore:end */
				replacer = replacer.split(/\s*[, ]\s*/);

			/* jshint ignore:start*/	//FALL-thru
			case 'Array':						//process extract properties and EZ options
			/* jshint ignore:end */
			{									//for each Array item . . .
				replacer.forEach(function(item)
				{
					if (typeof(item) == 'function')
						replacerFunctions.push(item);	//replacer function
					else if (typeof(item) != 'string' || !item)
						return;
												//extract property or EZ option
					var results = item.match(/([+-]?)(\*?)(\w*)=?(\w*)/);
					if (!results) return;

					var pre    = results[1] || '';
					var star   = results[2] || '';
					var key    = results[3] || 'SCRIPT';	//blank key
					var text   = results[4] || '';
					var number = results[4] || 0;
					if (star)						//----- EZ options start with * -----\\
					{
						key = key.toUpperCase();
						var defaultValue = EZ.json.options[key];
						options[key] = typeof(defaultValue) == 'boolean' ? pre != '-'
									 : typeof(defaultValue) == 'number' ? Number(number)
									 : typeof(defaultValue) == 'string' ? text
									 : '';
					}
													//----- extract property key name -----\\
					else if (pre == '+')
					{
						include = include || [];
						include.push(key);			//...explicit include if startes with "+"
					}
					else if (pre == '-')
					{
						exclude = exclude || [];
						exclude.push(key);			//...explicit exclude if starts with "-"
					}
					else if (pre === '')
					{
						extract = extract || [];
						extract.push(key);			//...add to extract list if no +/- prefix
					}
				});
			}
		}
		options.SPACES = (spaces || EZ.json.options.SPACES);	//non-zero non-blank required
		if (!isNaN(options.SPACES) && options.SPACES <= 0)
			options.SPACES = EZ.json.options.SPACES

		EZ.json.stringify.options = 'format options:';

		options.SCRIPT = options.SCRIPT || false;
		Object.keys(EZ.json.options).forEach(function(key)
		{
			if (!(key in options)) 					//set default for any non-specified options
			{
				var defVal = EZ.json.options[key];	//for boolean, true if option can be implicitly
				if (typeof(defVal) == 'boolean')	//... enabled -and- ALL or SCRIPT is true
					defVal = defVal  && (options.ALL || options.SCRIPT)
				else if (typeof(defVal) == 'number' && options.ALL === false)
					defVal = 0;						//for numeric, 0 if ALL explictly set false
				options[key] = defVal;
			}
			if (options[key] || options[key] === 0)
				EZ.json.stringify.options += ' ' + key + '=' + options[key];
		});
	}
	//______________________________________________________________________________
	/**
	 *	return type as constructor: Undefined, Null for undefined or null respectively
	 *	else Array, Boolean, Function, Number, Object, RegExp
	 *
	 */
	function getType(value)
	{
		if (value instanceof Element)
			return 'Element';
		var type = Object.prototype.toString.call(value);
		return type.substring(8,type.length-1);
	}
}
/*--------------------------------------------------------------------------------------------------
EZ.json.unquoteKeys(json)

Uses RegExp to find quoted keys --- 
As safety, returns json unchanged if initial -or- converted json does not eval() without exceptions.

ARGUMENTS:
	json		String containg json returned with Object keys unquoted if valid variable name.
				i.e. not reserved word, no spaces and startsi with "_" or alphabetic character

RETURNS:
	json with unquoted key -- valid JavaScript / eval() but not recognized by JSON.parse()
			if (regex.reserved.includes(arg))				//reserved word
--------------------------------------------------------------------------------------------------*/
EZ.json.unquoteKeys = function unquoteKeys(json)
{
	if (!json || typeof(json) != 'string') return json;
	
	var options = {json: json};
//	if (EZ.capture.check(this,options)) {return EZ.capture()} else if (EZ.test.debug()) debugger;

	var phase = 'validating input';
	try
	{
		var value = eval('value='+json);	
		var unquoted = json.replace(/([{,]\s*)"([\w_]+?)":/gi, function(all, sep, key)
		{
			if (EZ.json.INVALID_KEYS.indexOf(key) != -1) return all;
			return sep + key + ":";
		});
	
		phase = 'validating unquoted';
		var val = eval('val=' + unquoted);
	
		if (EZ.equals(val, value))
			json = unquoted;
		else
			throw new EZ.error('unable to unquote keys');
	}
	catch (e) 
	{ 
		EZ.json.fault = EZ.techSupport(e, '-' + phase, this, options);
		 
	}
	return json;
}
/*---------------------------------------------------------------------------------------------
EZ.json.parse(value)

Extend navive JSON.parse to support extended json created by EZ.json.stringify()

ARGUMENTS:

	value		(String) json parsed to create Array(s), Object(s), RegExp(s) or Function(s)
				(Object) create
---------------------------------------------------------------------------------------------*/
EZ.parse = function EZjson_parse(value)
{
	var json, obj, pattern;

	//----- if called with OBJECT (not String) . . .
	//		create named Array properties if any stored as last item of Array
	//		convert any pseudo function Objects to typeof 'function' Objects
	if (value instanceof Object)
	{
		// use EZ.json.stringify() to create pseudo json then parse via eval()
		json = EZ.json.stringify(value,'*script');
		if (json != EZ.undefined) value = json;
		return value;	//return converted Object
	}

	//----- return value "as-is" if not String
	if (typeof(value) != 'string') return value;

	if (value == 'undefined')
		return undefined;

	if (value == 'NaN')
		return NaN; 


	//----- if json prefixed with varible name, remove it (e.g. "varname = ...")
	value = value.replace(/^\s*.*\s*=\s*/, '');

	//----- if json contains function definitions,  use EZ.json.parse()
	if (/^\s*\(function\(\)/.test(value))
	{
		var obj = EZ.json.parse(value);	//parse via eval()
		return EZ.json.message ? EZ.json.message : obj;
	}

	value = value.trim();
	var isObject = /[\[{]/.test(value.substr(0,1)) && /[\]}]/.test(value.substr(-1));

	//------------------------------------------------------------------
	// parse json via JSON.parse() to 1st escape unrecognized data types
	// then un-escape via jsonExtendedParse() as each Object is created
	//------------------------------------------------------------------

	// global variables
	var undefinedValueList = [],	//Objects with undefined values
		undefinedValueKeys = [], 	//Object keys containing undefined values
		TAB = '@@tab@@',
		NAN = '"@@NaN@@"',
		UNDEFINED = '"@@undefined@@"',
		REGEXP = '"@@RegExp@@',
		FUNCTION = '"@@function@@',
		functionPattern = /function(\s*(\w*)\s*\(([\s\S]*?)\)([^{]*){(\s*[\s\S]*?)})/;

	//=============================================================================
	var extendedRules = 'keys tabs multiline moretypes regexp pattern'.split(/\s+/);
	//=============================================================================
	EZ.json.value = value;
	while (true)
	{
		try
		{
			EZ.json.eval = JSON.parse(value.trim(), jsonExtendedParse);
			break;
		}
		catch (e)								//incrementally apply extended rules
		{
			if (applyExtendedRule()) continue;

			if (!extendedRules.includes('tab'))
				value = value.replace(RegExp(TAB, 'g'), '\t');

			EZ.json.parse(value);				//pinpoint syntax error
			return EZ.json.message;
		}
		EZ.json.value = value;
	}
	while (applyExtendedRule())					//now apply remaining extended rules that
	{
		try										//return Object and do not throw exception
		{
			var testValue = JSON.parse(value.trim(), jsonExtendedParse);
			if (!isObject || testValue instanceof Object)
			{
				EZ.json.eval = testValue;
				EZ.json.value = value;
			}
			else value = EZ.json.value;
		}
		catch (e)								//incrementally apply extended rules
		{
			value = EZ.json.value;
		}
	}
	//=============================================================================
	return EZ.json.eval;
	//=============================================================================
	/**
	 *	incrementally escape data types not recognized by native JSON.parse()
	 *	TODO: all rules may not be apply to all types
	 */
	function applyExtendedRule()
	{
		var rule = extendedRules.shift();
		if (!rule) return false;

		switch (rule)
		{
			case 'keys':								//TODO: ignore pattern inside Strings
			{
				  //------------------------------------\\
				 //----- Object keys must be quoted -----\\
				//----------------------------------------\\
				value = value.replace(/([{,]\s*)([\w_]+?)(\s*:)/g, '$1"$2"$3');
				break;
			}
			case 'tabs':
			{
				value = value.replace(/\t/g, TAB);
				break;
			}
			case 'moretypes':								//TODO: ignore inside Strings
			{
				  //--------------------------------------------\\
				 //----- escape undefined, NaN and Infinity -----\\
				//------------------------------------------------\\
				// 	e.g.	NaN  		-->  "@@NaN@@"   	      //
				//			undefined 	-->  "@@undefined@@"	 //
				//-----------------------------------------------//
				NAN = NAN;
				UNDEFINED = UNDEFINED;
				value = value.replace(/(\b|^)(undefined|NaN)(\b|$)(?=[^"'])/g, '"@@$2@@"');
				break;
			}
			case 'multiline':
			{
				  //------------------------------------\\
				 //----- collapse multiline strings -----\\
				//----------------------------------------\\
				// 	e.g.	""
				//			+ "John Tyler\n"
				//			+ "President"
				//
				//	-->		"John Tyler\\nPresident"
				//----------------------------------------//
				value = value.replace(/(""\n\s*\+ "[\s\S]*?[^\\n]")(,?(\n|$))/g, function(all,str,eol)
				{
					str = str.replace(/""\s*\+ "/, '"');		//first line: 	"" + " 	 --> "
					str = str.replace(/\\n"\s*\+ "/g, '\\n');	//other lines:	\\n" + " --> \\n
					return str + eol;
				});
				break;
			}
			case 'regexp':
			{
				  //-------------------------------------------\\
				 //----- escape RegExp("pattern", "flags") -----\\
				//-----------------------------------------------\\
				//	e.g.	new RegExp("...", "...") 			 //
				//		--> "@@RegExp@@/...pattern.../gim"		//
				//---------------------------------------------//
				pattern = /\b(new\s*)?RegExp\s*\((.*?")\s*\)/g;
				value = value.replace(pattern, function(all,newPrefix,regex)
				{
					var args = regex.split(/\s*,\s*/);
					if (!args.length || args.length > 2) return all;

					return REGEXP + args[0].substring(1,args[0].length-1) + '/'
						 + (args[1] ?  args[1].substring(1,args[1].length-1) : '');
				});
				break;
			}
			case 'pattern':
			{
				  //--------------------------------------\\
				 //----- escape RegExp /pattern/flags -----\\
				//------------------------------------------\\
				//	e.g.	RegExp /.../gim  				//
				//		or  new RegExp /.../gim			   //
				//		--> "@@RegExp@@/...pattern.../gim"//
				//---------------------------------------//
				value = value.replace(/(^|[\[\{\s,]*)\/(.*\/[gim]*)(?=($|[\]\}\s,]))/gim,
				function(all,beg,regex)
				{
					return beg + '"@@RegExp@@' + regex.replace(/\\/g, '\\\\') + '"';
				});
				break;
			}
			case 'function':		//TODO:
			{
				  //--------------------------------------------\\
				 //----- escape function [name](args) {...} -----\\
				//------------------------------------------------\\
				//	e,g.	function mine(arg) {				  //
				//				return arg;						 //
				//			}									//
				//		--> "@@function@@ myFunc(arg) {\\n...}"//
				//--------------------------------------------//
				FUNCTION = FUNCTION;
				functionPattern = functionPattern;
			//	regex = /"____function____": "function(.*)"/g;
			//	value = value.replace(regex, '"@@function@@$1"');
				break;
			}
		}
		return true;
	}
	//__________________________________________________________________________________________
	/**
	 *	callback function WORKHORSE -- called for children before parents
	 *  processes: NaN, undefined, RegExp, Function -or- named Array properties
	 */
	function jsonExtendedParse(key, value)
	{
		var fn, idx, results;
		switch (typeof value)
		{
			case 'string':
			{
				  //--------------------\\
				 //----- pseudo tab -----\\
				//------------------------\\
				value = value.replace(RegExp(TAB, 'g'), '\t');

				  //-----------------------------------------\\
				 //----- pseudo NaN, undefined or RegExp -----\\
				//---------------------------------------------\\
				results = value.match(/^@@(.*?)@@(.*)/)
				if (!results)
					return value;
				switch (results[1])
				{
					case 'NaN':
						return NaN;
					case 'undefined':
					{
						if (!key) return undefined;		//return if value not Object property

						if ((idx = undefinedValueList.indexOf(this)) == -1)
						{
							idx = undefinedValueList.push(this) - 1;
							undefinedValueKeys[idx] = [];
						}
						undefinedValueKeys[idx].push(key);	//undefined value must be set later
						return null;
					}
					case 'RegExp':
					{
						results = results[2].match(RegExp("(.*)\\/(.*)",""));
						if (!results)
							return value;
						return new RegExp(results[1], results[2]);
						//return new RegExp(results[1].replace(/\\/g, '\\\\'), results[2]);
					}
				}
			}
			/* jshint ignore:start*/	//FALL-thru
			case 'object':
			/* jshint ignore:end */
			{
				  //-------------------------------\\
				 //----- null -- no processing -----\\
				//-----------------------------------\\
				if (!value) return value;

				  //---------------------------------------\\
				 //----- set undefined property values -----\\
				//-------------------------------------------\\
				if ((idx = undefinedValueList.indexOf(value)) != -1)
				{
					while (undefinedValueKeys.length)			//set undefined values
						value[undefinedValueKeys.shift()] = undefined;
					undefinedValueList.splice(idx,1);		//delete Object from list
				}

				  //-------------------------------------------\\
				 //----- Array -- process named properties -----\\
				//-----------------------------------------------\\
				if (value.constructor == Array)
				{
					if (!value.length) 				//bail if no Array items
						return value;

					var pseudoItem = value[value.length-1];
					if (pseudoItem == null
					|| typeof pseudoItem != 'object'	//bail if NO named properties
					|| ('____properties____' in pseudoItem) === false)
						return value;

					Object.keys(pseudoItem.____properties____).forEach(
					function(key)						//get named properties...
					{									//...from pseudoItem Object
						value[key] = pseudoItem.____properties____[key];
					});
					value.splice(value.length-1,1);		//...then delete pseudoItem
					return value;
				}
				  //-------------------------------------------\\
				 //----- Function (or TODO: custom Object) -----\\
				//-----------------------------------------------\\
				if ('____function____' in value)
				{
					try
					{									//create function
						eval('fn = ' + value.____function____)
						Object.keys(value).forEach(function(key)
						{								//copy any enumerable properties
							if (key != '____function____')
								fn[key] = value[key];
						});
						value = fn;						//return function
					}
					catch (e)
					{
						void(0); //debugger breakpoint
					}
					return value;
				}
			}
			/* jshint ignore:start*/	//FALL-thru
			default: return value;
			/* jshint ignore:end */
		}
	}
}
//__________________________________________________________________________________________________
EZ.stringifyWork.test = function()
{
	EZ.test.run({a:1, b:{}}, '*circular')

	var x = {a:'abc'};
	x.b = x;
	console.log({repeatList:EZ.json.repeatList, items:EZ.stringify(EZ.json.repeatList)})

 	//setnote('Circular Object')
	//EZ.test.run(x)
	//EZ.test.run(x, '*');
	EZ.test.run(x, '*circular');
}
