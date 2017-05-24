EZ.jsonPlus.parse = function JSON_parse(json, options)
{
	options = EZ.options.call(options)			//converts String delimited options to Object
///	options = EZ.options.call(JSON.plus.options.defaults.parse, options);
	var rtnValue = new JSON.plus.rtnValue();
	//______________________________________________________________________________________________
	/**
	 *
	 */
	function returnParseValue()					//returned value of parse or exception message 
	{											//as apparent type of value represented by json
		var value = rtnValue.get('value', undefined);
		var msg = rtnValue.get('syntaxError').concat(rtnValue.get('syntaxError'));
		if (msg.length)
		{										
			if (json.substr(0,1) == '{' || json.substr(-1) == ']}')
			{									//for apparant Object, return syntaxError property
				value = {message: msg.join('\n')}
			}
			else if (json.substr(0,1) == '[' && json.substr(-1) == ']')
			{									//for apparant Array, return empty Array also
				value = [];						//with named property key: message
				value.message = msg.join('\n');
				value.json = json;
			}			
			else								//otherwise return exception message pinpointing
				value = msg.join('\n');			//where parse failed if EZ.matchPlus() available
		}
		if (rtnValue.get('objname'))			//if objName/variable specified, set to rtnValue
			eval('"' + rtnValue.get('objname') + '=' + value + '"');
		
		return value;
	}
	//=========================================================================================
	
	//EZ.json.eval = null;
	//EZ.json.fault = null;			
	//EZ.json.syntaxError = '';
	//EZ.json.parse.message = '';		
	//EZ.json.parse.objname = '';
	//EZ.json.parse.fragments = '';
	//EZ.json.parse.details = true;	
	options.details = true;				//more details returned for parse exceptions

	json = json || '';
	json = json.trim();
	json = json.replace(/\\r/g, '\r');
	json = json.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
	
	if (!json) 							//json empty
	{
	///	return EZ.json.eval = '';
		rtnValue.addMessage('specified json empty string');
		return returnParseValue();
	}
	json = json.replace(/^\s*(.*)\s*=\s*/, function(all,objname)
	{									
		rtnValue.set('objname', objname);
	//	EZ.json.parse.objname = objname;
		return '';							//remove "objname = ..." prefix if any
	});

	  //------------------------\\
	 //----- eval full json -----\\
	//----------------------------\\
	try
	{
		var value = eval('value=' + json);
		rtnValue.set('value', value);
		return returnParseValue();			//good to go if no exception
	}
	catch (e)
	{
		rtnValue.addMessage(e.message);
		rtnValue.set('syntaxError', e);
	//	EZ.json.fault = EZ.techSupport(e, '$', arguments);	//get fault Object
	//	EZ.json.syntaxError = EZ.json.parse.message = e.message;
	}
	if (EZ.matchPlus === undefined)			//bail if EZ.matchPlus() NOT avail
		return returnParseValue();
		//return EZ.json.parse.message;

	  //--------------------------------------------------------\\
	 //----- eval json in fragments to isolate syntax error -----\\
	//------------------------------------------------------------\\
	var idx,
		msg = '',
		script = '';
	EZ.trace(json);

	//----- create shadow json with quoted strings neutered (except Object keys)
	var jsonShadow = json.replace(/(\\['"])/g, '@@');		//esc embedded quotes e.g. \" --> @@
	jsonShadow = jsonShadow.replace(/(['"])(.*?)\1(\s*)(\:?)/g,
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
	|  |        Object.keys(____properties____).forEach
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
		msg = '\n' + '-'.dup(50)
			+ '\nfragment #' + (idx + 1)
			+ ' offsets: [' + begOffset + ',' +endOffset + ']'
			+ '\n' + '-'.dup(50)
			+ '\n-->>' + openResults[idx].replace(/([\s\S*?])(\n)/, '$1<--$2')
			+  jsonShadow.substring(begOffset, endOffset)
			+ '<<--' + closeResults[idx] + '<--';
		rtnValue.addListItem('fragments', msg);
	});
	openResults.push('');					//fake for idx+1 references
	openOffsets.push(jsonShadow.length);

//	EZ.trace('FRAGMENTS', msg.substr(1));
options.details = false;

	  //------------------------------\\
	 //----- parse outer fragment -----\\
	//----------------------------------\\
	idx = 0;
	var offset = 0;
	jsonFragment();

	if (!msg && json.substr(offset))		//any remaining json is unexpected
	{
		msg = 'following unexpected';
		//out of scope function call
		//jsonAppend('=', '@@@error@@@', '@@@good@@@');
				//script += '@@@error@@@' + json.substr(offset);
				//offset += json.substr(offset).length;
	}
	if (msg) 								//add to exception from full json eval
	{
		EZ.json.message += '\nmore detail below...'

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
	EZ.json.message = 'SyntaxError: ' + EZ.json.message
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
					#>Object.keys(____properties____).forEach@@@@@@@@@
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
					if (options.details) script += '<#';
					jsonAppend(results.itemSep, '^', '^');
				}
				if (options.details) script += '<#';
			}
			catch (e)						//SyntaxError
			{
				msg = e.message;			//...set error message
				console.log(e.stack.replace(/([\s\S]*?\))[\s\S]*/,'$1'))
				item = item.trim();
			}
			if (!msg) continue;

			// add message to script and break
			//var padding = Math.max(0,script.length - script.lastIndexOf('\n') - 1);
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
		 *	specified and starts with "@@@" or options.details is true.
		 */
		function jsonAppend(code, prefix, suffix)
		{
			code = code || '';
			prefix = prefix || '';
			suffix = suffix || '';

			if (!options.details && prefix.indexOf('@@@') !== 0)
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
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.jsonPlus.parse.test = function JSON_parse_test()
{
	var msg, arr, ctx, arg, args, o, obj, json, note='', ex, exfn, notefn, fn, val, rtnValue;
	/*  jshint: avoid unused variable error  */	
	e = [msg, arr, ctx, arg, args, o, obj, json, note='', ex, exfn, notefn, fn, val, , rtnValue];
	ex = note = undefined;
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	//============================================================================================
 	function setupTest()
 	{
		if (!EZ.test.isRun())				//test IS skipped
			return;
 		
		json = JSON.stringify(ex, null, 4)
 		note += '<p>native JSON:<br>' + json.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')
 		json = EZ.stringify(ex, '*all');
		
		//	EZ.test.options(opts)
 	}
	//============================================================================================
	//EZ.test.settings( {exfn:exfn} );
 	var json = '';
 	var opts = '*NAN, *UNDEFINED, *FUNCTION';	//NA
	//============================================================================================
 	
	//______________________________________________________________________________
 	
	ex = {
		a:1, b:2
	};
 	note = 'easy'
 	setupTest();
 	EZ.test.run(json, opts,									{EZ: {ex:ex, note:note}})
 	
	//_______________________________________________________________________________
	EZ.test.settings( {group:'live faults'} );




	//EZ.test.settings({group: 'persistant note'});
	//EZ.test.settings( {exfn:exfn} )				//exfn called if EZ.test.options() not called
	
	obj =
	[
		''
		+ '{\n'
		+ '    ok: true,\n'
		+ '    testno: 1,\n'
		+ '    used: true\n'
		+ '}'
	+ '',
		''
		+ '{\n'
		+ '    ok: true,\n'
		+ '    testno: 2,\n'
		+ '    used: true\n'
		+ '}'
	]	
	json = EZ.jsonPlus.stringify(obj)
	EZ.test.run(obj)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	obj = [
	{
		ok: true,
		testno: 1,
		warn: "",
		actual: {
			0: {
				a: 1,
				b: 2
			},
			1: {
				a: 0,
				b: ""
			},
			2: [
				"1st [Object] \t ... 2nd [Object]",
				"  .a: 1 \t !== 0",
			],
			results: false
		},
		expected: {
			2: [
				"@JSON_escapeMarker@:$.expected.2=$.actual.2"
			],
			results: false
		},
		saveDateTime: "11-23-2016 06:52:18 pm",
		used: true
	},
		''
		+ '{\n'
		+ '    ok: true,\n'
		+ '    testno: 2,\n'
		+ '    warn: "",\n'
		+ '    actual: {\n'
		+ '        0: {\n'
		+ '            a: 1,\n'
		+ '            b: 2\n'
		+ '        },\n'
		+ '        1: {\n'
		+ '            a: 0,\n'
		+ '            b: ""\n'
		+ '        },\n'
		+ '        2: [\n'
		+ '            "1st [Object] \\t .. 2nd [Object]",\n'
		+ '            "  .a: 1 \\t is 0",\n'
		+ '        ],\n'
		+ '        results: false\n'
		+ '    },\n'
		+ '    expected: {\n'
		+ '        2: [\n'
		+ '            "@JSON_escapeMarker@:$.expected.2=$.actual.2"\n'
		+ '        ],\n'
		+ '        results: false\n'
		+ '    },\n'
		+ '    saveDateTime: "11-23-2016 07:30:12 pm",\n'
		+ '    used: true\n'
		+ '}'
	]
	json = EZ.jsonPlus.stringify(obj)
	EZ.test.run(obj)
	
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	//_______________________________________________________________________________________
	//EZ.test.options( {ex:ex, note:note} )
	//EZ.test.run( ctx, arg, obj )

	if (true) return;
}
