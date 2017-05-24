/*--------------------------------------------------------------------------------------------------
LINT options -- function below not called
--------------------------------------------------------------------------------------------------*/
/*global EZ, e:true */

var e;
(function jshint_globals_not_used() {	//global variables and functions defined but not used
e = [e]
});

//EZ.stringify: 44, 45, 50, 53
EZ.json.options = {};
EZ.json.options.SPACES = 4;

//define default value as true if implicity enabled when all or script=true
//otherwise define as false if option must be explicitly specified
//options with numeric values set to 0 if -*all option specified
EZ.json.options.NAN = true;
EZ.json.options.INFINITY = true;
EZ.json.options.UNDEFINED = true;
EZ.json.options.REGEXP = true;
EZ.json.options.ARRAYKEYS = true;
EZ.json.options.ARRAYITEMSPERLINE = 10;
EZ.json.options.ARRAYMAXLINELENGTH = 80;
EZ.json.options.CIRCULAR = false;
EZ.json.options.FUNCTIONKEYS = true;
EZ.json.options.FUNCTIONSCRIPT = true;
EZ.json.options.FUNCTIONTYPE = false;	//retain typeof function when FUNCTIONSCRIPT=false
										//not sure of value
EZ.json.options.ROOT = '';
EZ.json.options.SCRIPT = false;
EZ.json.options.ALL = false;
/*---------------------------------------------------------------------------------------------
Diagnostic and research tool
---------------------------------------------------------------------------------------------*/
EZ.json.nodeLogger = function nodeLogger(key, value)
{
	var log = EZ.json.log = EZ.json.log || [];
	log.push(
		'key=' + JSON.stringify(key).replace(/"/g,'')
		+ '\t\t' +
		'value=' + JSON.stringify(value) + '\n\t\t' +
		JSON.stringify(this).replace(/"/g,'') // parent
	);
	return value;
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
		// use EZ.stringify() to create pseudo json then parse via eval()
		json = EZ.stringify(value,'*script');
		if (json != EZ.undefined) value = json;
		return value;	//return converted Object
	}
	
	//----- return value "as-is" if not String
	if (typeof(value) != 'string') return value;
	
	//----- if json prefixed with varible name, remove it (e.g. "varname = ...")
	value = value.replace(/^\s*.*\s*=\s*/, '');

	//----- if json contains function definitions,  use EZ.json.parse() 
	if (/^\s*\(function\(\)/.test(value))
	{										
		var obj = EZ.json.parse(value);	//parse via eval()
		return EZ.json.parse.message ? EZ.json.parse.message : obj;		
	}

	//------------------------------------------------------------------
	// parse json via JSON.parse() bt 1st escape unrecognized data types
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
	
	/**********************************************************
	* escape data types not recognized by native JSON.parse() *
	**********************************************************/
	
	value = value.replace(/\t/g, TAB);

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

	  //--------------------------------------------\\
	 //----- escape undefined, NaN and Infinity -----\\
	//------------------------------------------------\\
	// 	e.g.	NaN  		-->  "@@NaN@@"   	      //
	//			undefined 	-->  "@@undefined@@"	 //
	//-----------------------------------------------//
	value = value.replace(/(\b|^)(undefined|NaN)(\b|$)(?=[^"'])/g, '"@@$2@@"');

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

		return '"@@RegExp@@' + args[0].substring(1,args[0].length-1) + '/'
			 + (args[1] ?  args[1].substring(1,args[1].length-1) : '');
	});

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

	  //--------------------------------------------\\
	 //----- escape function [name](args) {...} -----\\
	//------------------------------------------------\\
	//	e,g.	function mine(arg) {				  //
	//				return arg;						 //
	//			}									//
	//		--> "@@function@@ myFunc(arg) {\\n...}"//
	//--------------------------------------------//
//	regex = /"____function____": "function(.*)"/g;
//	value = value.replace(regex, '"@@function@@$1"');

	//=======================================================================
	try
	{
		EZ.json.eval = JSON.parse(value.trim(), jsonExtendedParse);
		return EZ.json.eval;
	}
	catch (e)
	{
		value = value.replace(RegExp(TAB, 'g'), '\t');
		EZ.json.parse(value);
		return EZ.json.parse.message;		//parse via eval()
	}
	//=======================================================================

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
//__________________________________________________________________________________________
/**
 *	EZ.json.parse(json,layer)
 *
 *	parse json via eval -- if exception, eval json in fragments to isolate syntax error.
 *	
 *	ARGUMENTS:
 *		json	String containing json
 *		layer	html layer OR layer id used for error message
 *				TODO: for full backward compatible with original EASY.js
 *	
 *	RETURNS: 
 *		EZ.json.parse.objname set to name of variable if json of the form: objname = ...
 *		otherwise blank
 *
 *	with no exception:		
 *		EZ.json.eval (and EZ.json.parse.objname variable) set to value from json and returned.
 *		EZ.json.parse.message blank 
 *
 *	with SyntaxError exception:		
 *		EZ.json.eval set to null and returned -- EZ.json.parse.objname variable unchanged
 *		EZ.json.parse.message contains json fragments parsed sucessfully with message inserted
 *		before fragment with SyntaxError. 
 *
 *	FRAGMENTS:
 *		The outermost json Object or Function declaration and each nested Object/Function
 *		is considered as a fragment containing zero or more fragment items.  Fragments 
 *		items are either another fragment or non-object data type such as Boolean, 
 *		Number or String. Statements within a Function declartions are treated as a
 *		fragment item -- except as noted below.
 *
 *		Closure functions enclosed within paraenthesis take precedence as a fragment  
 *		over the function definition. 
 *
 *		Closure functions used as argements of forEach, every, some or replace are 
 *		treated as a complete fragment item of their containig function.
 *
 *		Fragments are passed to eval as found in json first with no fragment items,
 *		then each item added one at a time until all items are added or an exception
 *		occures.
 */
EZ.json.parse = function(json /*,layer */)
{
	EZ.json.eval = null;
	EZ.json.parse.objname = '';
	EZ.json.parse.message = '';
	EZ.json.parse.fragments = '';
	EZ.json.parse.details = true;	//more detail on returned script error message

	json = json || '';
	json = json.trim();
	json = json.replace(/\\r/g, '\r');
	json = json.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
	if (!json) 							//json empty
		return EZ.json.eval = '';
	
	json = json.replace(/^\s*(.*)\s*=\s*/, function(all,objname)
	{									//remove "objname = " prefix if any
		EZ.json.parse.objname = objname;
		return '';
	});
	
	  //------------------------\\
	 //----- eval full json -----\\
	//----------------------------\\
	try 
	{	
		eval('EZ.json.eval = ' + json);

		if (EZ.json.parse.objname)
			eval('"' + EZ.json.parse.objname + '=' + EZ.json.eval + '"');
		return EZ.json.eval;
	}
	catch (e) 
	{
		EZ.json.parse.message = e.message;
	}
	if (''.matchPlus == EZ.undefined)
		return EZ.json.parse.message;

	  //--------------------------------------------------------\\
	 //----- eval json in fragments to isolate syntax error -----\\
	//------------------------------------------------------------\\	
	var idx,
		msg = '',
		script = '';
	EZ.trace(json);

	//----- create shadow json with quoted strings neutered (except Object keys)
	var jsonShadow = json.replace(/(\\['"])/g, '@@');		//esc embedded quotes e.g. \" --> @@
	
	jsonShadow = jsonShadow.replace(/(['"])(.*?)\1(\s*)(\:?)/g, 	//to facitate simple parsing:
	function(all, quote, inner, spaces, colon)				//replace all quoted strings
	{														//with #...# e.g. "abc" --> "###"
		if (colon) return all;								//except Object keys
		return quote + '@'.dup(inner.length) + quote + spaces;
	});
	//----- also neuter "forEach(function(...){...});" to avoid parsing as fragments
	jsonShadow = jsonShadow.replace(/(forEach\()([\s\S]*?\}.*\n)/g, function(all,prefix,fn)
	{										
		return prefix + '@'.dup(fn.length);
	});
	/*___________________________________________________________________________________
	//
	//	SAMPLE JSON before pre-processing nueters quoted Strings and some anounmous
	//	functions to simplify parsing into fragments and fragment items.
	//___________________________________________________________________________________
	{
		guess: 123,
		fn: (function()
		{
			var ____properties____ = {
				color: "green",
				array: [1, 2, "red", true]
			};
			Object.keys(____properties____).forEach(function(key)
			{____function____[key] = ____properties____[key]})
			return ____function____;
		})()
	}
	-------------------------------------------------------------------------------------------
	OPEN FRAGMENT OFFSETS
	-------------------------------------------------------------------------------------------
	offsets: 	0:[0,1], 1:[18,43], 2:[44,74], 3:[75,95]
		[0]:	{
		[1]:	.... fn:. (function() .... {
		[2]:	.... var. ____properties____. =. {
		[3]:	.[12]. array:. [
	-------------------------------------------------------------------------------------------
	CLOSE FRAGMENT OFFSETS
	-------------------------------------------------------------------------------------------
	offsets: 0:[75,100], 1:[101,111], 2:[265,273], 3:[274,275]                           
		[0]:            array: [1, 2]
		[1]:        };
		[2]:    })()
		[3]:}
	
	-------------------------------------------------------------------------------------------
	//	SAMPLE NUETERED DATA - embedded quotes and forEach converted to @ for parsing
	//	start of fragments marked as -->>...<-- end of fragments marked as --<<...<--
	-------------------------------------------------------------------------------------------
	 __
	|  \................................fragment #0
	|   -->>
	|   {<--
	|    |  guess: 123,             
	|	 |_________________________________openOffsets[0] = openResults.end[0] = 1
	|	________        
	|  |    -->>\........................fragment #1
	|  |    fn: (function()
	|  |    {<--                        
	|  |   |_____________________________openOffsets[1] = openResults.end[1] = 43
	|  |   __________________________
	|  |  |                      -->>\.....fragment #2
	|  |  | var ____properties____ = {<--  
	|  |  |                           |____openOffsets[2] = openResults.end[2] = 74
	|  |  |       
	|  |  |         ________..............fragment #3
	|  |  |        |        \   ___________openOffsets[3] = openResults.end[0] = 95
	|  |  |        |         \ |   _______closeOffsets[3] = closeResults.end[0] = 100 - 1 = 99
	|  |  |        |      -->> <--|
	|  |  |        |   array: [1, 2]
	|  |  |        |           <<-- <--                                          end  - marker size
	|  |  |        |_______________/
	|  |  |     __________________________closeOffsets[2] = (closeResults.end[1] = 111) - 2 = 109
	|  |  |    |
	|  |  | <<--};<--
	|  |  |_______/  
	|  |        Object.keys(____properties____).forEach@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
	|  |        return ____function____;
	|  | <<--})()<--
	|  |________/
	|	    |______________________________closeOffsets[1] = (closeResults.end[2] = 273) - 4 = 269
	|   <<--
	|	}<--                              
	|  |_________________________________closeOffsets[0] = (closeResults.end[3] = 275) - 1 = 274
	|___/	
	*/
	var begWrapPattern = RegExp( "(\\n\\s*)?"      //prefix from line where marker starts
							   + "("               //open marker --	if function...
							   + "(\\(\\s*function||function)"  //optional closure & fn statement 
							   + "\\s*[\\w]*\\([^(]*\\)"		//optional fn name & (named args)
							   + "[\\s\\S]*?\\{" 				//optional comment & start of body
							   + "|\\{"            				//...or Object         
							   + "|\\["                			//...or Array
							   + ")"               //end of open marker
							   + "(\\s*?\\n?)",    //optional spaces up to optional newline
							     "g");
	
	var endWrapPattern = RegExp( "(.*)"    			//prefix from line where close marker starts
							   + "(" 				//start of close marker
							   + "\\}\\)\\(\\)" 	//end of optional closure -- TODO: expand
							   + "|\\}|\\];?"    	//end of fn, object, array
							   + ")"				//end of close marker
							   + "(\\s*?\\n*)",		//optional spaces up to optional newline
							     "g");
	var itemPatterns = {
		"[": /(\s*)(())?(([^,]*)\s*)(,?\n?)/,			//array -- value [,\n]
		"{": /(\s*)(([^:]*)[:]\s*)(([^,]*)\s*)(,?\n?)/,	//object -- key: value [,\n]
		"(": /(\s*)(())((.*?);?)(\n?)$/m				//function -- single lines .*[;]$
	}
	itemPatterns[')'] = itemPatterns['('];
	var begWrappers = 
	{						//use for eval if defined
		'{': 'EZ.obj={\n'		//Object
	}
	var endWrappers = {
		'[': ']',			//Array
		'{': '\n}',			//Object
		')': '\n}',			//function...
		'(': '\n})'			//(function...)
	}

	  //-----------------------------------------------\\
	 //----- find all start / end fragment markers -----\\
	//---------------------------------------------------\\
	var openTypes = [],
		openOffsets = [],
		closeOffsets = [],
		openResults = jsonShadow.matchPlus(begWrapPattern),
		closeResults = jsonShadow.matchPlus(endWrapPattern);

	idx = 0;
	jsonShadow.replace(begWrapPattern, function(all, prefix, marker, fn, eol)
	{											
		var type = !fn ? marker
				 : marker.substr(0,1) == '(' ? '(' 
				 : ')';
		var offset = openResults.end[idx] + eol.length - (eol ? 1 : 0);
		
		openResults[idx++] = marker + eol;
		openTypes.push(type);
		openOffsets.push(offset);
	});

	idx = 0;
	jsonShadow.replace(endWrapPattern, function(all,prefix,marker, eol)
	{											
		closeResults[idx] = marker + eol;		//?? prefix offsets may handle
		closeOffsets.push(closeResults.end[idx] - marker.length - 1);
		idx++;
	});
	
	  //--------------------------------------------------------\\
	 //----- reorder closeOffsets to align with openOffsets -----\\
	//------------------------------------------------------------\\
	openOffsets.forEach(function(begOffset,idx)	
	{	
		var begOffset = openOffsets[idx];
		var endOffset = jsonShadow.length;
		for (var i=idx; i<closeOffsets.length; i++)
		{
			for (var j=i+1; j<openOffsets.length; j++)
			{
				if (openOffsets[j] > closeOffsets[i]) 
					break;
			}
			if (j == i+1) 
				break;
		}
		if (i < closeOffsets.length)
		{										//swap closeOffsets
			endOffset = closeOffsets.splice(i,1)[0];
			closeOffsets.splice(idx,0,endOffset);
			var endWrap = closeResults.splice(i,1)[0];
			closeResults.splice(idx,0,endWrap);
		}
		EZ.json.parse.fragments += '\n' + '-'.dup(50) 
								 + '\nfragment #' + (idx + 1)
								 + ' offsets: [' + begOffset + ',' +endOffset + ']' 
								 + '\n' + '-'.dup(50) 
								 + '\n-->>' + openResults[idx].replace(/([\s\S*?])(\n)/, '$1<--$2')
								 +  jsonShadow.substring(begOffset, endOffset)
								 + '<<--' + closeResults[idx] + '<--';
	});
	openResults.push('');					//fake for idx+1 references
	openOffsets.push(jsonShadow.length);
	EZ.trace('FRAGMENTS', EZ.json.parse.fragments.substr(1));
EZ.json.parse.details = false;
	  //------------------------------\\
	 //----- parse outer fragment -----\\
	//----------------------------------\\
	idx = 0;
	var offset = 0;
	jsonFragment();

	if (!msg && json.substr(offset))		//any remaining json is unexpected
	{
		msg = 'following unexpected';
		jsonAppend('=', '@@@error@@@', '@@@good@@@');
		//script += '@@@error@@@' + json.substr(offset);
		//offset += json.substr(offset).length;
	}
	if (msg) 								//add to exception from full json eval
	{
		EZ.json.parse.message += '\nmore detail below...' 

		  //------------------------------\\
		 //----- format error message -----\\
		//----------------------------------\\
		if (msg.substr(-1) != '\n') msg += '\n';
		script = script.replace(/([\s\S]*\n)?([\s\S]*)@@@error@@@([\s\S]*)@@@good@@@(.*)(\n?)/, 
		function(all, linesBeforeBad, codeBeforeBad, bad, codeAfterBad)
		{
			linesBeforeBad = linesBeforeBad || '';
			var indent = Math.max(0,codeBeforeBad.length - 1);
			var indentBad = Math.max(0,indent + bad.length - 1);
			bad.replace(/[\s\S]*\n(.*)/, function(all, bad /*last line of bad*/)
			{
				indentBad = Math.max(0,bad.length - 1);
			});
			all = linesBeforeBad
				+ (linesBeforeBad ? '='.dup(50) : '')	//	~~~~~~~~~~~~~~~~~~~~~~
				+ '\n...' + msg + ''					//	...msg
				+ '_'.dup(indent) + '\n'				//	_______
				+ ' '.dup(indent) + '\\\n'				//	       \
				+ codeBeforeBad + bad + codeAfterBad	//	before  bad...after
				+ '\n' + '_'.dup(indentBad+1) + '/\n'	//  _____________/
				+ '...end of json parse\n'					//	...end of parse
				+ '='.dup(50) + '\n';					//	~~~~~~~~~~~~~~~~~~~~~~
			return all;
		});
	}
	script += json.substr(offset);
	EZ.trace('SCRIPT returned', script);
	
	//=============================================================
	EZ.json.parse.message = 'SyntaxError: ' + EZ.json.parse.message
						  + '\n'
			              + '-'.dup(50) + '\n'
						  + script;
	return null;
	//=============================================================
	//_______________________________________________________________________________		
	/**
	 *	recursively called for each json fragment until SyntaxError occurs.
	 */
	function jsonFragment(depth/*lastBegWrap, lastEndWrap, lastType*/)
	{
		depth = depth || 0;
		if (idx >= openOffsets.length) return;	//no more fragment markers
		
		var item,
			begWrap = openResults[idx],
			endWrap = closeResults[idx],
			begOffset = openOffsets[idx],
			endOffset = closeOffsets[idx],
			
			type = openTypes[idx],
			begWrapType = begWrappers[type] || begWrap,
			endWrapType = endWrappers[type],
			
			fragmentItems = '';
		
		jsonAppend(begWrap, '-->>', '<--');
		offset = begOffset;
		fragmentItems = begWrapType;			//reset fragmentItems

		  //--------------------------------\\
		 //----- for each fragment item -----\\
		//------------------------------------\\
		var thisFragment = '';
		var itemPattern = itemPatterns[type];
		var count = jsonShadow.matchPlus(/(function|\]|\})/g).length;
		do
		{
			//_______________________________________________________________________________
			//
			//	EXAMPLE: items marked as #>...#< -- item separators as ^...^
			//			 keys (or closure variable assignments) marked as !...!
			//_______________________________________________________________________________
			/*
			-->>{<--
				#>!guess: !"neutered quotes@red@"<#,
				#>!fn: !>>(function()
				-->>{<--
					#>!var ____properties____ = !-->>{<--#>!
						color: !"red"<#^,
						^#>!array: !-->>[<--#>1<#^, ^#>2<#--<<]<--
					--<<};<--
					#>Object.keys(____properties____).forEach@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@<#
					#>return ____function____;<#
				--<<})()<--<#
			--<<}<--
			*/
			var nextFragment = openOffsets[idx+1] - openResults[idx+1].length;
			thisFragment = jsonShadow.substring(offset, Math.min(nextFragment, endOffset));
			if (!thisFragment.length)
				break;
			var groups = "prefix, keyGroup, key, valueGroup, value, itemSep";
			var results = thisFragment.matchPlus(itemPattern, groups);
			if (!results.isFound) break;

			results.start.forEach(function(start,idx)
			{								//get un-neutered json results
				item = json.substr(offset+start, results[idx].length);
				results.set(results.keys[idx], item);thisFragment
			});

//fragmentItems += results.prefix;
			jsonAppend(results.prefix, '#>');
			
			if (!results.keyGroup && !results.valueGroup)
			{
				jsonAppend(results.itemSep, '^', '^');
				continue;
			}
			try
			{
				item = results.keyGroup + results.valueGroup;									
				if (type != '[' && item.substr(0,1) == '}')
				{						//end of function or object
					jsonAppend(item);
					break;
				}
				
				if (type == '[' && results.key)
					msg = 'name unexpected';
				else if (type == '{' && !results.key)
					msg = 'name required';
				else					
				{
					if (type == '{') 			//process key for Object
					{
						item = results.key;						
						eval('"' + results.key.trim().trimPlus('"') + '"');
						jsonAppend(results.keyGroup, '!', '!')
						item = results.valueGroup;
					}
					
					if (offset + item.length >= nextFragment)		
					{							//value is next fragment e.g. [...] or {...}
						jsonAppend(item);		//append json up to nextFragment
						
						idx++;
						item = jsonFragment(depth+1);
						if (msg) return;
						
						fragmentItems += item;	//append json returned from fragment(s)
						EZ.trace('fragmentItems return depth='+ depth, fragmentItems + endWrapType);
					}
					else
					{
						item = results.valueGroup;
						eval(fragmentItems + item + endWrapType);
						jsonAppend(item)	//append valueGroup
					}
					if (EZ.json.parse.details) script += '<#';
					jsonAppend(results.itemSep, '^', '^');
				}
				if (EZ.json.parse.details) script += '<#';
			}
			catch (e)						//SyntaxError
			{
				msg = e.message;			//...set error message
				console.log(e.stack.replace(/([\s\S]*?\))[\s\S]*/,'$1'))
				item = item.trim();
			}
			if (!msg) continue;
			
			// add message to script and break
			var padding = Math.max(0,script.length - script.lastIndexOf('\n') - 1);
			jsonAppend(item, '@@@error@@@', '@@@good@@@');

			json.substr(offset).replace(/.*\n/, function(all) 
			{
				jsonAppend(all); 
				return all;
			})
			break;
		}
		while (count-- > 0)					//safety for unexpected endless loop

		if (msg || thisFragment.trim()) return;

		if (!endWrap)
		{
			msg = 'expected: ' + endWrapType;
			jsonAppend('', '@@@error@@@', '@@@good@@@');
		}
		else								//append end of fragment wrapper and
		{									//replace begWrapType with real begWrap
			jsonAppend(endWrap, '<<--', '<--');	
			var regex = RegExp(begWrapType.replace(/([\[{(])/g,'\\$1'));
			return fragmentItems.replace(regex, begWrap);	
		}
	
		//_______________________________________________________________________________		
		/**
		 *	Append un-neutered json to script and fragmentItems from current offset 
		 *	corresponding to code (i.e. code.length).  Annotate with prefix and suffix if
		 *	specified and starts with "@@@" or EZ.json.parse.details is true.
		 */
		function jsonAppend(code, prefix, suffix)
		{
			code = code || '';
			prefix = prefix || '';
			suffix = suffix || '';

			if (!EZ.json.parse.details && prefix.indexOf('@@@') !== 0) 
				prefix = suffix = '';

			if (!code && !prefix && !suffix) return;

			fragmentItems += code;

			if (prefix == '<<--' || prefix == '-->>')	//complex annotate
				script += annotate(code, prefix, suffix);
			else										//simple annotate
				script += prefix + json.substr(offset, code.length) + suffix;

			offset += code.length;

			EZ.trace('fragmentItems depth='+ depth, fragmentItems + endWrapType);
			EZ.trace('SCRIPT: ' + code, script);
		}
		/**
		 *	returns annotated fragment marker
		 */
		function annotate(code, prefix, suffix)
		{
			return code.replace(/(\s*)([\s\S]*?)(\n?)$/, 
			function(all,before,marker,after)
			{
				before = before.endsWith('\n') || !before.length ? prefix + '\n' 
					   : before.substr(-4) + prefix 
				return before + marker + suffix + after;
			});
		}
	}
}
/*---------------------------------------------------------------------------------------------
EZ.json.stringify(value, replacer, spaces)

DESCRIPTION:

	-----------------------------
	Support following data types:
	-----------------------------

		NaN, Infinity, undefined, RegExp
		function (both script and enumerable properties)
		non-alphanumeric Array properties
		partial support for html Objects

		json format options specify if and how above additional data types
		are represented by json
		
		native JSON.stringify()	ignores or does not  exactly reprentsent 
		these type e.g. NaN formatted as null

	----------------------------
	Additional replacer options:
	----------------------------

		allowes multiple replacer functions
		blacklist of properties in addition to native whitelist

	----------------------------------
	Optional readibility improvements:
	----------------------------------

		individual Array items not intented -- formatted together on same line
		(space added after comma separating items)

		Multiline Strings formatted on multiple un-indented lines

		Object property / keys only enclosed in quotes for invalid varible names
		e.g. "*note" "*%$?"

	-------------------
	Other Enhancements:
	-------------------
		Objects repeated or with circular references are only formatted once
		
________________________________________________________________________________________

ARGUMENTS:		same as JSON.stringify plus . . .

	value		(required) Array, Object or value to stringify

	replacer	(Function) same as native JSON.stringify()
					specifies single REPLACER FUNCTION -- see below
				
				(Array) same as native JSON.stringify() plus enhacements described below
					An array of String and Number objects that serve as a whitelist for 
					selecting the properties of the value object to be included in the 
					JSON string. If this value is null or not specified all properties 
					of the object are included in the resulting JSON striing.
				
				(String) space delimited EZ.stringify() json format options described below
					of the following form:
					
						"NaN=true undefined=false arrayItemsPerLine=10 include=id,name"
				
				(Object) One or more EZ.stringify() json format options provided as key/value
					sof the following EZ.stringify() options as described below:

			----------------------
			OBJECT PROPERTY NAMES:
			----------------------

				When any property name is specified, Object properties are formatted or ignored
				based on the following rules:
***
					no prefix only format specified names (whitelist) native JSON.stringify()
					+ prefix always format property name in addition to whitelist names
					- prefix do not format property name (blacklist) most precendence


			-------------------
			REPLACER FUNCTIONS:
			-------------------

				One or more functions called for each value, Array, Object or Function before
				creating json. Each function called with the following arguments:

					key		property name or Array index of value -- blank for the root value
							specified as 1st argument to EZ.stringify()

					value	root value or Object property value -- may be nested Object

				this is the Object containing value i.e. this[key] === value

				returned value is passed to the next replacer function or formatted as json


			--------------------
			JSON FORMAT OPTIONS:
			--------------------

				The following case-insensitive format options enable functionality if prefixed 
				with "+" or have no prefix -or- disabled if prefixed with "-"; options shown 
				with numeric values below are set to either specified value, zero if no value
				specified and prefixed with minus "-" or default value for "+" prefix.

				DEFAULTS: options shown with numeric values default to the value shown
						  all other options except *root and *script default to true if
						  *script enabled (true) or false if *script not enabled (false)
						  default for *script is false and *root must explicitly specified.

				*all					enabled or disabled all options e.g. "*all" or "-*all"
										specific option(s) following take precedence

				*NaN					format as: NaN
										if not specified formatted as: null

				*Infinity				format as: Infinity or -Infinity
										if not specified formatted as: null

				*undefined				format as: undefined
										if not specified formatted as: null

				*RegExp					format regular expressions as: /.../gim
										if not specified formatted as: {}

				*html					format all attributes and non-false properties in addition
										to any OBJECT PROPERTY NAMES specified

				*arrayKeys				named Array properties included by either embedding bit
										of javascript if script option specified or by adding an
										additional pseudo Array item with new Object containing
										the named properties.

				*arrayItemsPerLine=10	number of Array items shown on single line
										value of 0, uses separate line for every item

				*arrayMaxLineLength=80 	maximum number of characters before using newline
										for Array items not an Object, Array or multiline
										String (always formatted on separate lines)
										value of 0, uses separate line for every item

				*functionKeys			=true include enumerable function properties including
										nested function and object properties formatted as
										Object json if script option otherwise bit of javascript
										embedded to recreate function Object type

										=false enumerable properties ignored formats as: {}
										

				*functionScript			=true include full function script either as pseudo
										pseudo Object property ____function____  or with bit of
										embedded javascript to create function when json parsed
										if script option specified
				
				*functionType			=true adds ____function____ property to Object json for
										functions when *functionScript not enabled so function
										is created by EZ.parse() -or- eval() if *script enabled

				*root={objName}			Specifies a root object variable name if specified,
										prepended to returned json e.g.
											objName = "...json..."

				*script or *			=true
										creates pseudo json using embedded javascript to represent
										some values such as function script or named Array properties

											parsible with EZ.parse() or eval()
											valid inside script tags or js file
											fully recreates all Array, Function and standard Objects
											and enumerable properties (e.g. not html elements)

										alphanumeric Object property names are not quoted e.g.
											{name:"Brenda", age:29, "*note":"tall", "null":false}

										multi line Strings formatted on separate lines: e.g.
											""
											+ "John Tyler \"III\", President"
											+ "Key Largo, FL 80209"

										=false
										pure json created: function script, named Array properties, 
										NaN, Infinity and undefined values formatted as pseudo
										property or String as described by each option

										All Object keys quoted -- multiline Strings use "\\n"

	spaces		If omitted and replacer argument is a number, its interpreted as spaces

				Specifies number of spaces to indent (up to 10) for each level of nested
				Array or Object -or- specified a String (up to 10 characters) repeated 
				by indent level and prepended to beginning of each indented line:  
				e.g. spaces = "." -->
					{
					."name": "Jim Cowart",
					."location": {
					.."city": {
					..."name": "Chattanooga",
					..}
					.}
					}

				Intentation is required therefore numbers less than 1 or empty String
				use default: 4 spaces
TODO:
	support replacer function
	expand support of html objects
	support no indent ??

REFERRENCE: nice JSON doc
	http://speakingjs.com/es5/ch22.html
---------------------------------------------------------------------------------------------*/
EZ.stringify = EZ.json.stringify = function EZstringify(value, replacer, spaces)
{
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
			repeatedObj = [],
			replacerFunctions = [],
			pad, padding,
			topKeys = [],
			topValue = value,
										//escape codes
			QUOTE = '@@~@@',
			QUOTE_EMBEDDED = '@@!@@',
			EOL = '@@eol@@',
			NEWLINE = '@@EOL@@',
			BACKSLASH = '@@/@@',
			NAN = '@@NaN@@',
			TAB = '@@tab@@',
			REGEXP = '@@RegExp@@',
			UNDEFINED = '@@undefined@@',
			INFINITY_PLUS = '@@Infinity@@',
			INFINITY_NEG = '@@-Infinity@@',
			PREFIX = '@@=@',
			SUFFIX = '@=@@',
			WRAPPER = RegExp('("' + PREFIX + '|' + SUFFIX + '")', 'g');	//("@@=@|@=@@")
	
		if (this != EZ.stringify)		//process arguments and create options
			jsonFormatOptions();
										//set global convenience variables
		pad = isNaN(options.SPACES) ? options.SPACES
			: '          '.substr(0,options.SPACES)
		pad = pad.substr(0,10);
		padding = '\n' + pad;
	
		//-------------------------------------------------------------
		var json = JSON.stringify(value, jsonReplacer, options.SPACES);
		//-------------------------------------------------------------
		if (json != EZ.undefined)
			json = json.replace(WRAPPER, '');	//remove outer quotes
	
		if (this == EZ.stringify)	//internal call from jsonReplacer()
			return json;
	
		//=======================
		return jsonFinalize(json);
		//========================
	}
	catch (e)
	{
		 EZ.techSupport(e, this, arguments);
		 throw(e);
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

		//----- un-quote Object keys when valid varible name i.e. alphaumeric
		if (options.SCRIPT)
		{
			json = json.replace(/([{,]\s*)"([\w_]+?)":/gi,
			function(all, sep, key)
			{
				if ('null undefined'.indexOf(key) != -1) return all;
				return sep + key + ":"
			});
		}
		return json
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
	 *	JSON replacer: WORKHORSE for extended json suporrted for EZ.stringify()
	 *
	 *	First calls any replacers specified as EZ.stringify() replacer arguments
	 *
	 *	Then process NaN, undefined, multiline String, Array, Function or RegExp
	 *	based on EZ.stringify() options.
	 */
	function jsonReplacer(key, value)
	{
		/*
		var replacers = replacerFunctions.slice();
		while (replacer.length)
		{								//TODO: not tested
			value = replacers.shift.call(this, key, value, options.SPACES);
		}
		*/

		  //---------------------------------------------------------------------------\\
		 //----- do EZ.stringify() replacements after specified replacer functions -----\\
		//-------------------------------------------------------------------------------\\
		var idx, isArray, json, padHere, pre, regex, results, script, 
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
										//-----------------------------------------------------
			case 'String':				// multiline String -- separate lines if SCRIPT enabled
			{							//-----------------------------------------------------
				value = value.replace(/"/g, QUOTE_EMBEDDED);
				if (options.SCRIPT && value.indexOf('\n') != -1)
				{							//breakup into multiple lines

					padHere = (objectStack.length > 1) ? padding : '\n';
					value = QUOTE + padHere + '+ ' + QUOTE
						  + value.replace(/\n/g, EOL + QUOTE + padHere + ' + ' + QUOTE)
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
								json = EZ.stringify.call(EZ.stringify, obj, options);
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
			return value;						//currently processing Object

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
					objectKeys[0].every(function(p,idx,keys)
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
		 *	The placeholders will be replaced in final json returned by EZ.stringify()
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
		function jsonValue(value, idx)
		{	
			//__________________________________________________________________________
			/**
			 *	
			 */
			function getClone(obj)	
			{	
				var clone = {};
				Object.keys(obj).forEach(function(key)
				{
					var value = obj[key];				
					if (value instanceof Object)
					{
						var idx = processedObj.indexOf(value);
						if (idx != -1)
						{
							repeatedObj.push(getDotName());
							value = '"{' + getDotName() + '=' + processedKey[idx] + '}"';
						}
						else value = getClone(obj);
					}
					clone[key] = value;
				});
				return clone;
			}
			//__________________________________________________________________________
			
			if (value instanceof Object && options.CIRCULAR && isCircularObject(value))
			{
				var value = getClone(value);
			}
			/*			
			if (options.CIRCULAR && value instanceof Object)
			{
				var idx = processedObj.indexOf(value);
				if (idx != -1)
				{
					repeatedObj.push(getDotName());
					return '"{' + getDotName() + '=' + processedKey[idx] + '}"';
				}
			}
			*/
			if (idx != null)
				nestedKeys.push(key);

			else if (typeof(value) == 'object')
			{
				processedObj.push(value);
				processedKey.push( getDotName() );
			}
			
			var	json = JSON.stringify.call(EZ.stringify, value, jsonReplacer, options.SPACES);
			
			if (idx != null)
				nestedKeys.pop();
			
			if (json !== undefined)
				json = json.replace(WRAPPER, '');
			
			//==========
			return json;
			//==========
			/**
			 *	
			 */
			function isCircularObject(obj)	
			{	
				if (obj instanceof Object)
				{
					try
					{
						JSON.stringify(obj);
						return false;
					}
					catch (e)
					{
						return /circular/i.test(e.message);
					}
				}
				return false;
			}
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
			for (idx=0; idx<value.length; idx++)	//TODO: why not EZ.stringify() ??
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
					delim = ', ';
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
				jsonForKeys = EZ.stringify.call(EZ.stringify, properties, options);
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

			var e, isEmpty = true, clone = {};
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
	 *	setup global varibles including options based on EZ.stringify() arguments.
	 *	returns options Object.
	 */
	function jsonFormatOptions(key, value)
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
					optionsString + ' *' + key;
					
				else						//add key=value to string
					optionsString + ' *' + key + '=' + replacer[key];
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
						(include || []).push(key);	//...explicit include if startes with "+"

					else if (pre == '-')
						(exclude || []).push(key);	//...explicit exclude if starts with "-"

					else if (pre === '')
						(extract || []).push(key);	//...add to extract list if no +/- prefix
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
		var type = Object.prototype.toString.call(value);
		return type.substring(8,type.length-1);
	}
}
//_____________________________________________________________________________________________
EZ.stringify.test = function()
{
	// shared data
	var ex = EZ.undefined, note = '';
	var exObj, obj, json;

	function setnote(msg)
	{
		if (!msg)
			msg = note;
		else
			note = msg;
		var objExpected = exObj;
		exObj = null;
	
		var exfn = function(results)
		{
			var o = EZ.parse(results);	//create new Object from json results
			if (EZ.isEqual(o ,(objExpected || obj))) return results;

			if (typeof(o) == 'string' && o.indexOf('SyntaxError:') != -1)
				return o;
			
			return (ex != 'na' ? ex + '\n<hr>': '')
				 + '<i>EZ.parse(json) DOES NOT MATCH input value:</i>\n' 
				 + EZ.stringify(o,'*');
		}								
		
		var notefn = function()
		{
			return (msg ? msg + '<hr>' : '')
				 + (EZ.json.stringify.options ? EZ.json.stringify.options + '<hr>' : '')
				 + 'native JSON\n' + JSON.stringify(obj,null,'.')
		}
		
		EZ.test.results({ex:'nogo', fn:exfn, note:notefn});
	}


	//NOTE: ***** this file must be saved in unix format for ex to match all tests results *****
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//_______________________________________________________________________________
	obj = {
		note: "",
		expected: {
			args: [],
			results: {
				keys: ["", ".a", ".b", ".b.a"],
				values: [
					{
						a:1,
						b:{a:1, b:"$.expected.results.values[0].b=$.expected.results.values[0]"},
						c:"$.expected.results.values[0].c=$.expected.results.values[0].b"
					},
					1,
					"$repeat:$.expected.results.values[2]=$.expected.results.values[0]",
					1
				],
				id: ",.a:1,.b.a:1,b:{.b},c:{.b},c:{.b}"
			}
		},
		id: "arg1=a:1,b.a:1,b:{.b},c:{.b},c:{.b},note:",
		argsClone: ["$repeat:argsClone[0]=$.$.expected.expected.results.results.values$"],
		testno: 2,
		ok: true
	}
	

	obj.expected.results.values[0]
	
	obj = 'tab-->	<--';
	ex = '\t'
	setnote('String with embedded tab')
	EZ.test.run(obj, '*all')
//return;	
	
	obj = {tab:'tab-->	<--'};
	ex = 'na'
	setnote('Object String with embedded tab')
	EZ.test.run(obj, '*all')
	//_______________________________________________________________________________

	obj = EZ.global.testdata.include
	ex = ''
	   + '[\n'
	   + '    "score", "offsets",\n'
	   + '    {\n'
	   + '        "____properties____": {\n'
	   + '            "score": true,\n'
	   + '            "scoreKey": true\n'
	   + '        }\n'
	   + '    }\n'
	   + ']';
	setnote('ObjectLike Array with named keys')
	EZ.test.run(obj, '*all')

	ex = ''
	   + '(function()\n'
	   + '{\n'
	   + '    var ____array____ = [\n'
	   + '        "score", "offsets"\n'
	   + '    ]\n'
	   + '    var ____properties____ = {\n'
	   + '        score: true,\n'
	   + '        scoreKey: true\n'
	   + '    }\n'
	   + '    Object.keys(____properties____).forEach(function(key)\n'
	   + '    {____array____[key] = ____properties____[key]})\n'
	   + '    return ____array____;\n'
	   + '})()';
	setnote()
	EZ.test.run(obj, '*')
	
	//_______________________________________________________________________________
	obj = EZ.global.testdata.person;
	ex = JSON.stringify(obj, null, 4); format(true)
	setnote('Object same as native except keys not quoted')
	EZ.test.run(obj, '*all')
	//_______________________________________________________________________________

	obj = EZ.global.testdata.array;
	ex = JSON.stringify(EZ.global.testdata.array);
	ex = ex.replace(/,/g, ', ');
	
	setnote ('Pure Array -- no item contains an object so: '
		  + 'Array is not indented but space after comma');
	EZ.test.run(obj, '*all')
	//_______________________________________________________________________________

	obj = EZ.global.testdata.arraySparse;
	ex = JSON.stringify(EZ.global.testdata.arraySparse); format();
	ex = ex.replace(/null/, 'NaN')
	ex = ex.replace(/null/, 'undefined')

	setnote ('Array sparely poulated: item[1]=NaN item[2]=undefined '
		  + 'native stringify treats as null')
	EZ.test.run(obj, '*all')
	//_______________________________________________________________________________

	obj = EZ.global.testdata.personArrayLike;
	ex = JSON.stringify(EZ.global.testdata.personArrayLike, null, 4); format(true);
	setnote('ArrayLike Object: same as native stringify')
	EZ.test.run(obj, '*all')
	//_______________________________________________________________________________

	obj = '';
	ex = JSON.stringify('', null, 4);
	setnote('empty string exactly as native stringify ')
	EZ.test.run(obj)
	//_______________________________________________________________________________

	obj = null
	ex = JSON.stringify(obj, null, 4);
	setnote('null exactly same as native stringify ')
	EZ.test.run(obj)
	//_______________________________________________________________________________

	obj = EZ.global.testdata.objectLike
	json = JSON.stringify(obj).replace(/,/g, ', ')
	// [1,2,null,null,null,"five"]
	json = json.replace(/\[/g, '[\n    ').replace(/]/, ',\n    {\n        '
		 + '"____properties____": {\n        ');

	ex = '    "person": ' + JSON.stringify(EZ.global.testdata.person, null, 4); format(true);
	ex = json + ex.replace(/\n/g, '\n            ')
	   + '\n        }\n    }\n]';

	setnote('ObjectLike Array has named keys - IGNORED by native stringify')
	EZ.test.run(obj, '*all')
	
	ex = ''
	   + '(function()\n'
	   + '{\n'
	   + '    var ____array____ = [\n'
	   + '        1, 2\n'
	   + '    ]\n'
	   + '    var ____properties____ = {\n'
	   + '        person: {\n'
	   + '            name: "Jim Cowart",\n'
	   + '            location: {\n'
	   + '                city: {\n'
	   + '                    name: "Chattanooga",\n'
	   + '                    population: 167674\n'
	   + '                },\n'
	   + '                state: {\n'
	   + '                    name: "Tennessee",\n'
	   + '                    abbreviation: "TN",\n'
	   + '                    population: 6403000\n'
	   + '                }\n'
	   + '            },\n'
	   + '            company: "appendTo"\n'
	   + '        }\n'
	   + '    }\n'
	   + '    Object.keys(____properties____).forEach(function(key)\n'
	   + '    {____array____[key] = ____properties____[key]})\n'
	   + '    return ____array____;\n'
	   + '})()';
	setnote()
	EZ.test.run(EZ.global.testdata.objectLike, '*')
	//_______________________________________________________________________________

	obj = EZ.global.testdata.array.slice();
	obj.push(EZ.global.testdata.person, true, false, 'xyz')

	ex = JSON.stringify(obj, null, 4); format(true);
	ex = ex.replace(/1,[\s\S]*?2,/, '1, 2,')
	ex = ex.replace(/true,[\s\S]*?"/, function(all) {return all.replace(/,\n\s*/g, ', ') })

	setnote('Array format same as native when ANY array item contains object '
		  + 'except: spaces after Array item commas')
	EZ.test.run(obj, '*all')
	//_______________________________________________________________________________

	obj = EZ.global.testdata.fuse;
	ex = JSON.stringify(obj,null,4); format(true);

	json = '\n        {\n            "____properties____": {'
	for (var key in EZ.global.testdata.fuse.include)
	{								// append options.include Array named keys
		if (EZ.global.testdata.fuse.include.hasOwnProperty(key) && isNaN(key))
			json += '\n                "' + key + '": '
			      + EZ.global.testdata.fuse.include[key] + ',';
	}
	ex = ex.replace(/],/, ',' + json.clip()
	   + '\n            }\n        }\n    ],');
	ex = ex.replace(/\[/, '[\n        ');
	
	setnote('Object with embedded ObjectLike include Array with named keys')
	EZ.test.run(obj, '*all')
	
	EZ.test.results({ex:'nogo',note:note,fn:function(json)
	{
		var o = eval('o='+json);
		if (EZ.isEqual(o,obj)) return json;
	}});
	EZ.test.run(obj, '*')
	//______________________________________________________________________________

	obj = EZ.global.testdata.arraySparsePlus;
	ex = JSON.stringify(obj, null, 4); format(true);
	ex = ex.replace(/(\[\s*)([\s\S]*?)(?=]|,\s*\{)/gi,
	function(all,bracket,items)
	{
		return bracket + items.replace(/,\s*/g, ', ');
	});
	ex = ex.replace(/\s\[\s*"O([^\]]*?)\s+\]/gi, '\n    ["O$1]')
	ex = ex.replace(/\[\s*"J([^{]*?)\s*\]/g, '["J$1]'.replace(/\s+/g, ' '))

	ex = ''
	   + '[\n'
	   + '    "a", NaN, undefined, null, 5,\n'
	   + '    ["Otis", "Ghost"],\n'
	   + '    {\n'
	   + '        "apple": "APPLE",\n'
	   + '        "lemon": "LEMON"\n'
	   + '    },\n'
	   + '    ["Jane", "Brenda", "Dyan"]\n'
	   + ']';
	setnote('complex Array with no ObjectLike Arrays ')
	EZ.test.run(obj, '*all')
	//_______________________________________________________________________________

	obj = EZ.global.testdata.objectLikeMore;
	ex = JSON.stringify(obj.person, null, 4); format(true);
	json = ex.replace(/\n/g, '\n    ')
	json = '"____properties____": {\n'
		 + '    "person": ' + json + '\n'
		 + '}'
	json = '        ' + json.replace(/\n/g, '\n        ')
		 + '\n    }';

	ex = JSON.stringify(obj,null,4); format(true);
	ex = ex.replace(/(\[\s*)([\s\S]*?)(?=]|,\s*\{)/gi,
	function(all,bracket,items)
	{
		return bracket + items.replace(/,\s*/g, ', ');
	});
	ex = ex.replace(/(2,) /, '$1');
	ex = ex.replace(/(    ])/, '$1,\n    {\n' + json) ;

	json = '"score", "offsets",\n{\n'
		 + '    "____properties____": {\n'
		 + '        "score": true,\n'
		 + '        "scoreKey": true\n'
		 + '    }\n'
		 + '}';
	json = json.replace(/\n/g, '\n        ');
	ex = ex.replace(/\[\s*"score"[\s\S]*?"offsets"/,'\n    [\n        ' + json);

	setnote('complex ObjectLike')
	EZ.test.run(obj, '*all')
	
	EZ.test.results({ex:'nogo',note:note,fn:function(json)
	{
		var o = eval('o='+json);
		if (EZ.isEqual(o,obj)) return json;
	}});
	EZ.test.run(obj, '*')
	//_______________________________________________________________________________

	obj = EZ.global.testdata.regex;
	ex = '/\\s*(a|b|c)/gim';
														setnote('RegExp Standalone')
	EZ.test.run(obj, '*all')
	//_______________________________________________________________________________

	obj = [EZ.global.testdata.regex];
	ex = ''
	   + '[\n'
	   + '    /\\s*(a|b|c)/gim\n'
	   + ']';
														setnote('RegExp in Array')
	EZ.test.run(obj, '*all')
	//_______________________________________________________________________________

	obj = {regex: EZ.global.testdata.regex};
	ex = ''
	   + '{\n'
	   + '    "regex": /\\s*(a|b|c)/gim\n'
	   + '}';
														setnote('RegExp in Object')
	EZ.test.run(obj, '*all')
	//_______________________________________________________________________________

	obj = [0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9]
	ex = '[\n    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,\n    0, 1, 2, 3, 4, 5, 6, 7, 8, 9\n]'
														setnote('20 items')
	EZ.test.run(obj, '*all')
	//_______________________________________________________________________________

	obj = EZ.global.testdata.multiline;
	ex = JSON.stringify(obj, null, 4);format(true)
	ex = ex.replace(/(1|x"|y"),\s*/g, '$1, ')
	
	setnote('multiline String')
	EZ.test.run(obj, '*all')
	
	json = ''
	   + '[\n'
	   + '    1, "a", ""\\n'
	   + '    + "John Tyler \\"III\\", President"\\n'
	   + '    + "Keys Adventures, Inc"\\n'
	   + '    + "123 Palms, Suite Q"\\n'
	   + '    + "Key Largo, FL 80209",\n'
	   + '    "x", "y", "z"\n'
	   + ']';
	ex = json.replace(/\\n/g, '\n')
	
	setnote()
	EZ.test.run(obj, '*')
	//_______________________________________________________________________________

	obj = EZ.global.testdata.multiline[2]
	ex = JSON.stringify(obj, null, 4);format(true)
	ex = ex.replace(/(1|x"|y"),\s*/g, '$1, ')
	
	setnote()
	EZ.test.run(obj, '*all')
	
	obj = EZ.global.testdata.multiline[2]
	ex = '""\n'
	   + '+ "John Tyler \\"III\\", President"\n'
	   + '+ "Keys Adventures, Inc"\n'
	   + '+ "123 Palms, Suite Q"\n'
	   + '+ "Key Largo, FL 80209"';
	setnote()
	EZ.test.run(obj, '*')
	//_______________________________________________________________________________
	
	// function with no properties
	var testfn = function test(arg) 
{
	var x = 2
	return arg * x
}
	obj = testfn;
	ex = '{}';
	exObj = {};		//obj expected from EZ.parse(json)
	setnote('standalone function (with no properties) keys only option<hr> pure json format')
	EZ.test.run(obj,'*all, -*functionScript')

	ex = ''
	   + '{\n'
	   + '    "____function____": "function test(arg) \\n{\\n    var x = 2\\n    return arg * x\\n}"\n'
	   + '}';
	setnote('standalone function (with no properties) script only option<hr> pure json format')
	EZ.test.run(obj,'*all, -*functionKeys')

	setnote('standalone function (with no properties) script and keys option<hr> pure json format')
	EZ.test.run(obj,'*all')

	ex = '{}';
	exObj = {};		//obj expected from EZ.parse(json)
	setnote('standalone function (with no properties) keys only option<hr> SCRIPT format')
	EZ.test.run(obj,'*, -*functionScript')
	
	ex = ''
	   + '{\n'
	   + '    "____function____": "function() {}"\n'
	   + '}';
	exObj = function() {}
	setnote()
	EZ.test.run(obj,'*all, -*functionScript, +*functionType')

	setnote('standalone function (with no properties) script only option<hr> SCRIPT format')
	EZ.test.run(obj,'*, -*functionKeys')

	setnote('standalone function (with no properties) script and keys option<hr> SCRIPT format')
	EZ.test.run(obj,'*')
	
	//_______________________________________________________________________________
	
	// function with Array
	testfn.array = EZ.global.testdata.array.slice();
	
	ex = ''
	   + '{\n'
	   + '    "array": [1, 2]\n'
	   + '}';
	setnote('standalone function (only Array property) keys only option<hr> pure json format')
	EZ.test.run(obj,'*all, -*functionScript')
	
	ex = ''
	   + '{\n'
	   + '    "____function____": "function() {}",\n'
	   + '    "array": [1, 2]\n'
	   + '}';
	setnote('standalone function (only Array property) keys and type option<hr> pure json format')
	EZ.test.run(obj,'*all,-*functionScript,+*functionType')

	ex = ''
	   + '{\n'
	   + '    "____function____": "function test(arg) \\n{\\n    var x = 2\\n    return arg * x\\n}"\n'
	   + '}';
	setnote('standalone function (only Array property) script only option<hr> pure json format')
	EZ.test.run(obj,'*all, -*functionKeys')

	ex = ''
	   + '{\n'
	   + '    "____function____": "function test(arg) \\n{\\n    var x = 2\\n    return arg * x\\n}",\n'
	   + '    "array": [1, 2]\n'
	   + '}';
	setnote('standalone function (only Array property) (only Array property) script and keys option<hr> pure json format')
	EZ.test.run(obj,'*all')

	setnote('standalone function (only Array property) keys only option<hr> SCRIPT format')
	EZ.test.run(obj,'*, -*functionScript')
	
	setnote()
	EZ.test.run(obj,'*all,-*functionScript,+*functionType')

	setnote('standalone function (only Array property) script only option<hr> SCRIPT format')
	EZ.test.run(obj,'*, -*functionKeys')

	setnote('standalone function (only Array property) script and keys option<hr> SCRIPT format')
	EZ.test.run(obj,'*')
	
	//_______________________________________________________________________________
	
	// Object containing function with no properties
	obj = {guess:123, fn:testfn}
	setnote('OBJECT with function (with no keys) keys only <hr> SCRIPT format')
	EZ.test.run(obj,'*, -*functionScript')
	
	setnote()
	EZ.test.run(obj,'*all,-*functionScript,+*functionType')
	
	setnote('OBJECT with function (with no keys) script  only <hr> SCRIPT format')
	note += '<hr>native JSON\n' + JSON.stringify(obj,null)
	EZ.test.run(obj,'*, -*functionKeys')
	
	setnote('OBJECT with function (with no keys) script and keys <hr> SCRIPT format')
	note += '<hr>native JSON\n' + JSON.stringify(obj,null)
	EZ.test.run(obj,'*')
	
	//_______________________________________________________________________________

	obj = EZ.test.data.fn;
	ex = EZ.test.data.fn_json;
	setnote('standalone function keys only <hr> pure json format')
	EZ.test.run(obj,'*all, -*functionScript')
	
	setnote()
	EZ.test.run(obj,'*all,-*functionScript,+*functionType')

	setnote('standalone function script only <hr> pure json format')
	EZ.test.run(EZ.test.data.fn,'*all, -*functionKeys')

	setnote('standalone function script and keys <hr> pure json format')
	EZ.test.run(EZ.test.data.fn,'*all')

	setnote('standalone function keys only <hr> SCRIPT format')
	EZ.test.run(EZ.test.data.fn,'*, -*functionScript')
	
	setnote()
	EZ.test.run(obj,'*all,-*functionScript,+*functionType')

	setnote('standalone function script only <hr> SCRIPT format')
	EZ.test.run(EZ.test.data.fn,'*, -*functionKeys')

	setnote('standalone function script and keys <hr> SCRIPT format')
	EZ.test.run(EZ.test.data.fn,'*')
	//_______________________________________________________________________________
return	//endtest

	ex = EZ.test.data.jsonSampleFormat;
	obj = eval(ex);
	setnote('All indent scenarios (hopefully)<hr>')
		 + JSON.stringify(obj,null,4).replace(/ /g, '.')//.replace(/\n/g, '<br>');
	EZ.test.run(obj, '*all')
	//_______________________________________________________________________________

	obj = EZ.global.testdata.include;
	ex = JSON.stringify(obj, null, 4);

	setnote('ObjectLike Array ***** replacer argument tests *****')
	EZ.test.run(obj, '-score, -scoreKey, *all, *arrayItemsPerLine=0')

	setnote()
	EZ.test.run(obj, 'zzz, *all, *arrayItemsPerLine=0')

	json = '"offsets",\n'
    	 + '    {\n'
         + '        ____properties____: {\n'
    	 + '            score: true\n'
    	 + '        }\n'
    	 + '    }'
	ex = ex.replace(/"offsets"/g, json);

	setnote()
	EZ.test.run(obj, 'score, *all, *arrayItemsPerLine=0')

	setnote()
	EZ.test.run(obj, '-scoreKey, *all, *arrayItemsPerLine=0')
	//_______________________________________________________________________________
	
	obj = EZ.global.testdata.include;
	ex = ''
	   + 'ez_json = ["score", "offsets"];\n'
	   + 'ez_json.score = true;\n'
	   + 'ez_json.scoreKey = true;';
	setnote('*script')
	EZ.test.run(obj, '*script=ez_json')
	//_______________________________________________________________________________

	//monster
	ex = EZ.test.data.testSample;					
	setnote('EZ.json.testSample_json')
	EZ.test.run(EZ.testSample,'*all')
	//_______________________________________________________________________________

	ex = ''
	   + '{\n'
	   + '    name: "EZtest_radio",\n'
	   + '    id: "EZtest_tag",\n'
	   + '    type: "radio",\n'
	   + '    value: "false",\n'
	   + '    formAction: "http://localhost:8080/revize/dw.Configuration/Shared/EZ/testing/EZunit_tests.html",\n'
	   + '    maxLength: 524288,\n'
	   + '    size: 20,\n'
	   + '    defaultValue: "false",\n'
	   + '    willValidate: true,\n'
	   + '    autocapitalize: "none"\n'
	   + '}';

	obj = t_radios[0];
	setnote('radio button')
	EZ.test.run(obj, '*all')
	return	//endtest
	//_______________________________________________________________________________

	//...............................................................................
	/**
	 *  Internal test helper function
	 *	convert most native stringify to EZ.stringify
	 */
	function format(isKeysQuoted)
	{
		if (!isKeysQuoted)
		{
			ex = ex.replace(/([{,]\s+)"([\w_]+?)":/gi, function(all, sep, key)
			{
				if ('null undefined'.indexOf(key) != -1) return all;
				return sep + key + ":"
			});
		}


		ex = ex.replace(/(\w*: \[)([\s\S]*?])/gi, 	//collapse Arrays to single line
		function(all, name, value)
		{
			return '' + name + value.replace(/\s*/g, '');
		});

		ex = ex.replace(/\[(.*?)\]/mg,function(all)	//for single line Arrays
		{											//add space after comma
			return all.replace(/,/g, ', ')
		});
		ex = ex.replace(/, $/mg, ',')
	}
	/**
	 *	return RegExp as Object
	 */
	function regexObject(obj)
	{
		if (obj === null || typeof obj !== 'object')
			return obj;

		var clone = {};

		Object.getOwnPropertyNames(obj).forEach(function(key)
			{ clone[key] = regexObject(obj[key]) });

		return {"_____RegExp_____": clone};
	}
}
//_____________________________________________________________________________________________
EZ.parse.test = function()
{
	var ex = 'na';
	var note = '';
	var json = '';
	var obj;
	var opts = '*NAN, *UNDEFINED, *FUNCTION';	//NA

	function setupTest()
	{
		json = JSON.stringify(ex, null, 4)
		note += '<p>native JSON:<br>' + json.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')
		json = EZ.stringify(ex, '*all');
	}
	//______________________________________________________________________________
	// #1
	ex = EZ.global.testdata.include;
	note = 'ObjectLike Array with named keys'
	setupTest();
	EZ.test.run(json, opts,									{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #2
	ex = EZ.global.testdata.person
	note = 'Object same as native except keys not quoted'
	setupTest();
	EZ.test.run(json, opts,									{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #3
	ex = EZ.global.testdata.array
	note = 'Pure Array -- no item contains an object so: '
		 + 'Array is not indented but space after comma'
	setupTest();
	EZ.test.run(json, opts,									{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #4
	ex = EZ.global.testdata.arraySparse
	note = 'Array sparely poulated: item[1]=NaN item[2]=undefined '
		 + 'native stringify treats as null'
	setupTest();
	EZ.test.run(json, opts,									{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #5
	ex = EZ.global.testdata.personArrayLike
	note = 'ArrayLike Object: same as native stringify except: keys not quoted '
	setupTest();
	EZ.test.run(json, opts,									{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #6
	ex = '';
	note = 'empty string exactly as native stringify '
	setupTest();
	EZ.test.run(json, opts,									{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #7
	ex = null;
	note = 'null exactly same as native stringify '
	setupTest();
	EZ.test.run(json, opts,									{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #8
	ex = EZ.global.testdata.objectLike;
	note = 'ObjectLike Array has named keys - IGNORED by native stringify'
	setupTest();
	EZ.test.run(json, opts,									{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #9
	var a = EZ.global.testdata.array.slice();
	a.push(EZ.global.testdata.person)
	ex = a;

	note = 'Array format same as native when ANY array item contains object '
		 + 'except: keys unquoted and spaces after Array item commas'
	setupTest();
	EZ.test.run(json, opts,									{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #10
	ex = EZ.global.testdata.fuse;

	note = 'Fuse Object with embedded ObjectLike include Array with named keys'
	setupTest();
	EZ.test.run(json, opts,									{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #11
	ex = EZ.global.testdata.arraySparsePlus.slice();
	note = 'complex Array with no ObjectLike Arrays '
	setupTest();
	//ex[2] = null;
	EZ.test.run(json, opts,									{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #12
	ex = EZ.global.testdata.objectLikeMore;
	note = 'complex ObjectLike'
	setupTest();
	EZ.test.run(json, opts,									{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #13
	obj = /\s*(a|b|c)/gim;
	ex = obj;
															note = 'RegExp Standalone'
	setupTest();
	EZ.test.run(json, opts,									{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #14
	ex = [obj];												note = 'RegExp in Array'
	setupTest();
	EZ.test.run(json, opts,									{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #15
	ex = {pattern: obj};									note = 'RegExp in Object'
	setupTest();
	EZ.test.run(json, opts,									{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #16
	ex = EZ.global.testdata.arraySparsePlus;				note = '20 items'
	setupTest();
	EZ.test.run(json, opts,									{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #17
	ex = EZ.global.testdata.multiline;						note = 'multiline String'
	setupTest();
	EZ.test.run(json, opts,									{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	// #18
	ex = EZ.test.data.fn;
	json = EZ.stringify(EZ.test.data.fn, '*all');
	EZ.test.run(json, opts,									{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	ex = EZ.global.testdata.fuse.include;
	json = EZ.stringify(ex, '-*')

	// #19
	obj = eval(json);
	note = 'parse Array with named property from eval(json)\n'
		 + json.replace(/ /g, '&nbsp;')
	EZ.test.run(obj,									{EZ: {ex:ex, note:note}})

	// #20
	obj = JSON.parse(json);
	note = 'parse Array with named property from JSON.parse()\n'
		 + json.replace(/ /g, '&nbsp;')
	EZ.test.run(obj,									{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	obj = [
		"score", "offsets",
		{
			____properties____: {
				score: true,
				scoreKey: true
			}
		}
	];
	ex = [
		"score", "offsets",
		{
			____properties____: {
				score: true,
				scoreKey: true
			}
		}
	]
	note = 'Array with named properties in pseudo item -- 1st calls EZ.stringify()'
	EZ.test.run(obj,									{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________

	obj = null;
	EZ.test.run(obj,									{EZ: {ex:obj, note:obj+''}})

	obj = true;
	EZ.test.run(obj,									{EZ: {ex:obj, note:obj+''}})

	obj = false;
	EZ.test.run(obj,									{EZ: {ex:obj, note:obj+''}})

	obj = 99;
	EZ.test.run(obj,									{EZ: {ex:obj, note:obj+''}})

	obj = /abc/;
	EZ.test.run(obj,									{EZ: {ex:obj, note:obj+''}})

	obj = function(a){return a};
	EZ.test.run(obj,									{EZ: {ex:obj, note:obj+''}})
	//_______________________________________________________________________________

	obj = ''
	   + 'ex = ["score", "offsets"];\n'
	   + 'ex.score = true;\n'
	   + 'ex.scoreKey = true;\n';
	eval(obj)
	note = 'script format json Array with named properties'
	EZ.test.run(obj,										{EZ: {ex:ex, note:note}})
	//_______________________________________________________________________________
}