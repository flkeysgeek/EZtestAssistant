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
		if (arguments.length == 2 && typeof(replacer) == 'number')
		{											
			spaces = replacer;						//if replacer argument omited, use as spaces argument
			replacer = null;
		}
		
		var options = replacer,						//----- define global varibles -----\\
			include = [],							//properties included in addition to extract list
			exclude = [],							//properties ignored -- include has precedence
			extract = [],							//only extract these properties unless included
			nestedKeys = ['$'],						//nested key name -- not used but retained for future
			objectKeys = typeof(value) == 'object' ? [Object.keys(value)] : [],
			objectStack = [null],
			processedObj = [],
			processedKey = [],
		//	repeatedObj = [],
			replacerFunctions = [],
			pad, padding,
		//	errorObj,
		//	topKeys = [],
													//escape codes used while creating enhanced json
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
			WRAPPER = RegExp('("' + PREFIX + '|' + SUFFIX + '")', 'g');	//("@@=@|@=@@"),

		var internal = 'EZ.json.stringify: main';	//development convenience
		if (this != EZ.json.stringify)				
		{											//if not internal call...
			jsonFormatOptions();					//...process arguments and create options
			EZ.stringify.repeatList = [];			//...and reset global variables
			EZ.stringify.message = '';
			EZ.stringify.details = '';
			EZ.stringify.circular =  '';
			
		}

		pad = isNaN(options.SPACES) ? options.SPACES
			: '          '.substr(0,options.SPACES)
		pad = pad.substr(0,10);
		padding = '\n' + pad;
		
		//-------------------------------------------------------------
		var json = JSON.stringify(value, jsonReplacer, options.SPACES);
		//-------------------------------------------------------------
		if (json !== undefined)
			json = json.replace(WRAPPER, '');		//remove outer quotes

		if (this == EZ.json.stringify)				//internal call from jsonReplacer()
			return json;
		
		else if (options.REPEAT)					//if repeat list requested...
			return EZ.stringify.repeatList;			//...return it

		//=======================					//...otherwise return tweaked json
		return jsonFinalize(json);					//EZ.stringify.repeatList is created while stringifing
		//========================					//should match as *REPEAT list available from Object
	}												//created with returned json
	catch (e)
	{												//safety for unexpected
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
		if (spaces === 0)									//11-01-2016 experimental
		{
			var regex = RegExp('\\n\\s' + options.SPACES.wrap('{}'), 'g');
			json = json.replace(regex, '');
		}
		return json;
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
		if (options.REPEAT)
		{
			var repeatName = (typeof(options.REPEAT) == 'string') ? options.REPEAT : '_[repeat]';
			options.include = [repeatName];
		}

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
console.log({ key:key, value:value, ctx:this, internal:internal })		
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
								//=============================================================
								internal = 'EZ.json.stringify: case Function';
								json = EZ.json.stringify.call(EZ.json.stringify, obj, options);
								internal = false;
								//=============================================================
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
			if (key === '')							//called with Object before calling for each key
				return value;
			
			var repeatIdx = processedObj.indexOf(value);
			if (repeatIdx == -1)					//??
				return value;						
			
			else
			{										//replace repeated object value
				json = jsonValue(_processCircular(repeatIdx));
				json = jsonEscape(json, true);
				return json;
			}
		}
		if (!isArray)
		{
			value = jsonExtractFilter(value, key);
			if (value === undefined)
				return value;
			if (options.REPEAT)
			{
				var item = {};
				item[getDotName()] = value;
				EZ.stringify.repeatList.push(item);
			}
		}

		if (!key)									//called with Object before called for each key
		{
			if (this[key] == value)					
				key = nestedKeys.pop();				
			else									
			{
				var obj = objectStack[0];			//top level Object
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
		function getDotName(key)
		{
			var keys = nestedKeys.concat(key ? [key] : []).join('.')
			return keys.replace(/\.\[/g, '[');
		}

		//_______________________________________________________________________________
		/**
		 *	_processCircular return json for repeated object in the following form:
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
			
			var item = {};
			item[getDotName(key)] = repeatKey;
			EZ.stringify.repeatList.push(item);
			
			return EZ.isArray(value) ? ["_[repeat]:" + repeatKey]
									 : {'_[repeat]': repeatKey};
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
			internal = 'JSON.stringify: jsonValue';
			var	json = JSON.stringify.call(EZ.json.stringify, value, jsonReplacer, sp);
			internal = false;
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
				//=========================================================================
				internal = 'EZ.json.stringify: Array script';
				jsonForKeys = EZ.json.stringify.call(EZ.json.stringify, properties, options);
				internal = false;
				//=========================================================================
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
--------------------------------------------------------------------------------------------------*/
EZ.json.restoreRepeat = function EZjson_restoreRepeat(obj, repeatList)
{
	repeatList = repeatList || EZ.stringifyWork(obj, '*repeat');
	repeatList.forEach(function(item)
	{
		for (var key in item)
		{
			var sourceKey = item[key].substr(1);
			var value = sourceKey ? sourceKey.ov(obj) : obj;
			
			var dotName = key.split('.').slice(1);
			var targetKey = dotName.pop();
			
			var targetObj = dotName.length ? dotName.join('.').ov(obj) : obj;
			targetObj[targetKey] = value;
			void(0);
		}
	});
}
//__________________________________________________________________________________________________
EZ.stringifyWork.test = function()
{
	var msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [msg, arr, ctx, arg, args, o, obj, note='', ex, exfn, notefn, fn, val, , rtnValue];
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	ex = note = undefined;
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	exfn = function(results, expected, testrun)
	{
		void( [results, expected, testrun] )	//jshint
		testrun.exfnDone = true;				//don't call as legacy

		var results = testrun.getResults()
		if (results != null)
		{
			testrun.setArgument(1, EZ.stringify.repeatList);
			var clone = eval('clone=' + results);
			EZ.json.restoreRepeat(clone, EZ.stringify.repeatList);
			
			var obj = testrun.getArgument(0);
			if (!EZ.equals(obj, clone, {showDiff:5}))
			{
				testrun.setOk(false);
				var msg = ['Object created from json NOT equal'].concat(EZ.equals.formattedLog);
				testrun.setNote(msg);
			}
			else testrun.setOk(true);
		}
	}
	
	//_______________________________________________________________________________________
	EZ.test.settings( {exfn:exfn} )
	EZ.test.run({a:1, b:{}})

	var x = {a:'abc', b:{key:99}};

	EZ.test.run(x);

	//______________________________________________________________________________
	EZ.test.settings( {group:'circular Objects'} )
	x.b = x;
	EZ.test.run(x, '*circular');
	
	console.log({repeatList:EZ.stringify.repeatList, items:EZ.stringifyWork(EZ.stringify.repeatList,'',0)})

}
