
.2015-08-17.before-expanded & collasped classnames

		//----- Process spaces in text

		var regex = /(<\s*\w+?)?( | )+(\s*>|\s*\w+=".*?"[\s\S]*?>)/g;
		html = html.replace(regex, function(all, tagBeg, spaces, tagEnd)
		{
		})
	}
	//======================
	return html;
	//======================
	//________________________________________________________________________________________
	/**
	 *
	 */
	function formatSpecial_spaces(text)
	{
		html = html.replace(/( +)/g, function formatSpecial_spaces(all,text)
		{
			var bigdot = '•'
			var dots = bigdot.repeat(spaces.length);

			if (spaces.length > 5)		// not inside tag -- collaspe over 5 spaces
				dots = bigdot + '[' + (spaces.length-2) + ']' + bigdot;

			return tagBeg + '<span class="EZformat_spaces">' + dots + '</span>' + tagEnd;
		});
		return html;
	}


		var regex = /(<\s*\w+?)?( | )+(\s*>|\s*\w+=".*?"[\s\S]*?>)/g;
		html = html.replace(regex, function(all, tagBeg, spaces, tagEnd)
		{
		})


		var regex = /(<\s*\w+?)?( | )+(\s*>|\s*\w+=".*?"[\s\S]*?>)/g;
		html = html.replace(regex, function(all, tagBeg, spaces, tagEnd)
		{
			tagBeg = tagBeg || '';
			tagEnd = tagEnd || '';
			if (tagEnd.indexOf('class="EZformat') != -1)
				return all;				// keep Reg Assistant formating spans "as is"

			var bigdot = '•'
			//bigdot = 'X'
			var dots = bigdot.repeat(spaces.length);

			if (tagBeg)					// inside html tag - replace all spaces
			{
				return tagBeg.replace(/ /g, bigdot) + ' ' + dots + ' ' + tagEnd.replace(/ /g, bigdot)
			}
			if (spaces.length > 5)		// not inside tag -- collaspe over 5 spaces
				dots = bigdot + '[' + (spaces.length-2) + ']' + bigdot;

			return tagBeg + '<span class="EZformat_spaces">' + dots + '</span>' + tagEnd;
		})


						/*
						if (space.indexOf('\n') != -1)
						{								//when space contains newline, it belongs to detail
							detail = space + detail;
							space = '';
						}
						*/
				//TODO: will need somwhere...  var padding = ' '.dup(opts.indentsize*level-4);


				/* cannot check minlines yet -- lower levels may rollup
				// If not enough lines to collapse, replace markers with spaces
				else if (lineCount < opts.collapseminlines && level > 0 && !opts.collapse_keep_groups)
				{
					html = space + '   ' + (tags || heading) + '\n' + detail;
				}
				*/


((\\s)(<span[\\s\\S]*?level_(\\d*).*?>)([\\s\\S]*?)<div>)([\\s\\S]*)(</div>)<!-- level_\\4 -->

		regex = new RegExp( "(\\s)"								//indent before collaspse arrow
						  // (... start collapseBegToDiv combo
						  + "(<span[\\s\\S]*?level_(\\d*).>"	//arrow span tag
						  + ".*<span.*>"							//up to heading
						  + "([\\s\\S]*?)"						//heading
						  + "(<\/span>[\\s\\S]*?)"				//close spans
						  + "(<div>))"							//open div
						  //     ...) end combo
						  +	"([\\s\\S]*?)"                      //detail
						  // (... start combo
			              + "(<\/div>)"							//close div
						  + "(<!-- level_\\3 -->)");			//end collaspe group

		var regexNames = 'indent,collapseBegToDiv,level,header,closeSpans,OpenDiv,detail,closeDiv,collaspeEnd'

			function collaspeGroups(text, names)
			{
				var results = text.matchPlus(regex);
				EZ.toArray(names, ',').forEach(function(name, idx)
				{
					results[name] = results[idx];
				});
				results.detail = results.isFound ? results.detail : text;
				return results;
			}


			var detail = text;
			var updatedDetail =  '';

			var results;

			while (nextGroup = detail.match(regex))

				//                          __<pre...>
				//    EZdisplayObject()    /       __<span...>
				//    ...return text	   |      /           __...object type...
				//                         |      |			 /
				//    regex groups()       |      |			 |      __</span>...</pre>
				//                         |      |			 |    /
				//                         1      2          3    4
				var results = value.match(/(.*\s*)(<span.*?>)(.*?)(<\/span>[\s\S]*)/);
				if (results == false)
	html = '\n' + results[1] + results[2] + name + results[3] + results[4];


  <!--
    <div id="EZtest_wrap" class="EZtest_wrap">
	  <EZtest_tag id="EZtest_tag1" class="EZtest_class1">test tag1
	  <label>
		<input name="EZtest_radio" type="radio" id="EZtest_radio1" value="true" checked="checked"/>
		All </label>
		<div id="EZtest_div1" class="EZtest EZtest_div_class1">
		  ______________div1______________
		</div>
	  </EZtest_tag>
	  <EZtest_tag id="EZtest_tag2" class="EZtest_class2">test tag2
		<input name="EZtest_input" type="text" id="EZtest_input">
		<div id="EZtest_div2" class="EZtest EZtest_div_class2">
		  ______________div2______________
		  <label>
			<input name="EZtest_radio" type="radio" id="EZtest_radio2" value="some"/>
			Some</label>
		</div>
		  <label>
			<input name="EZtest_radio" type="radio" value="false" />
			none</label>
	  </EZtest_tag>
	</div>
-->

		//detailValue = detailValue.replace(/\n/g, '\n  ').trim() + '\n';

formatReturnValue
	var groups = value.matchPlus(/(.*)([\s\S]*)/);
	groups[1] = groups[1].trim();
	groups[2] = groups[2].trim();

	// if 2nd line does not start with <div...>, separate lines with double newline
	if (!/^<div/i.test(groups[2]))
		groups[1] += '\n\n';

	value = (!groups || !groups[2] ? ''
		  : '<img src="../images/folder_plus.gif" width="12" height="12" \n/> ')
		  + groups[1] + groups[2];
	return value;


		// 1st eliminate collapse markers for short levele
		var results, regex = /(\d*)____@\n([\s\S]*?)____\1@ /g;
		while (results = regex)
		{
			var results = text.matchPlus();
			if (results == false) break;
			for (var i=results.length-1; i>=0; i--)
			{
				var beg = results.start[i];
				var end = results.end[i];
				var str = results[i];
				var lines = str.matchPlus(/\n/g).length;
				var blanklines = str.matchPlus(/^\s*$/mg).length
				if ((lines-blanklines) < opts.collapselinesmin)
				{
					isFound = true;
					var len = str.indexOf('@')
					text = text.substring(0, end-len) + text.substr(end+1);
					text = text.substring(0, beg-1) + text.substr(beg+len);
				}
			}
		}

				// if too few lines to collapse, leave with parent level
				if (lineCount < opts.collapseminlines)
				{
					html = '   ' + space + (tags || heading) + detail.trimRight()
				}
				else
				{
				}
		function formatCollapseRemoveSame()
		{
return;
			var before = text;
			text = text.replace(/(\d*)____@\s*____\1@ /g, '');
			//if (before != text) debugger;
		}
//return text;
		formatCollapseRemoveSame();
//return text;

		//----- eliminate collapse markers for levels with only a few lines (default: 5)
		while (opts.collapseminlines)
		{
			var isFound = false;
			var results = text.matchPlus(/(\d*)____@\n([\s\S]*?)____\1@ /g, {legacy:false});
			for (var i=results.length-1; i>=0; i--)
			{
				var beg = results.start[i];
				var end = results.end[i];
				var str = results[i];
				var lines = str.matchPlus(/\n/g).length;
				var blanklines = str.matchPlus(/^\s*$/mg).length
				if ((lines-blanklines) <= opts.collapseminlines)
				{
					isFound = true;
					var len = str.indexOf('@') + 1;
					text = text.substring(0, end-len-1) + text.substr(end);
					text = text.substring(0, beg) + '______' + text.substr(beg+len+1);
				}
			}
			if (!isFound) break;
		}

	//  #24#      parentNode (HTMLLabelElement): repeats x2
	var isRepeat = false;
	for (var o in opts.processedObjects)
	{
		var processedObj = opts.processedObjects[o];
		if (processedObj.count == 0)
			continue;
		isRepeat = true;
		var regex = new RegExp('^#' + processedObj.id + '#' + '(\\s*)(.*)$', 'm');
		var id = opts.hashTime + '_' + processedObj.id;
		var parent = '2';
		var repl = '<a name="EZ_'+ id + ' class="EZ_' + parent
				 + '"></a>$1<span class="repeat" id="' + id + '">'
				 + '$2 repeated x' + processedObj.count + '</span>';
		text = text.replace(regex, repl);
	}
	// Add span to ...
	text = text.replace(/^#(.*?)#(\s*)(.*)$/gm, function(g0,g1,g2,g3)
	{
		return g3.indexOf('<span') == 0 ? g2 + g3
			 : g2 + '<span id="EZ_'+ opts.hashTime + '_' + g1 + '">' + g3 + '</span>'
			// : g1 + g2 + '<span id="'+ opts.hashTime + '_' + g1 + '">' + g3 + '</span>'
	});
	// wrap all lines except 1st with onClick handler
	var wrapper = '<div class="EZdisplayObject"'
				+ (!isRepeat ? ''
				: ' onclick="EZdisplayClick()"')
				+ '\n>';
	text = text.trim().replace(/\n/, wrapper) + '</div>';
	console.clear();console.log(text);
	return text;

	/*	was working but haedcoded to always use html
	//  #24#      parentNode (HTMLLabelElement): repeats x2
	var isRepeat = false;
	for (var o in opts.processedObjects)
	{
		var processedObj = opts.processedObjects[o];
		if (processedObj.count == 0)
			continue;
		isRepeat = true;
		var regex = new RegExp('^#' + processedObj.id + '#' + '(\\s*)(.*)$', 'm');
		var id = opts.hashTime + '_' + processedObj.id;
		var parent = '2';
		var repl = '<a name="EZ_'+ id + ' class="EZ_' + parent
				 + '"></a>$1<span class="repeat" id="' + id + '">'
				 + '$2 repeated x' + processedObj.count + '</span>';
		text = text.replace(regex, repl);
	}
	// Add span to ...
	text = text.replace(/^#(.*?)#(\s*)(.*)$/gm, function(g0,g1,g2,g3)
	{
		return g3.indexOf('<span') == 0 ? g2 + g3
			 : g2 + '<span id="EZ_'+ opts.hashTime + '_' + g1 + '">' + g3 + '</span>'
			// : g1 + g2 + '<span id="'+ opts.hashTime + '_' + g1 + '">' + g3 + '</span>'
	});
	// wrap all lines except 1st with onClick handler
	var wrapper = '<div class="EZdisplayObject"'
				+ (!isRepeat ? ''
				: ' onclick="EZdisplayClick()"')
				+ '\n>';
	text = text.trim().replace(/\n/, wrapper) + '</div>';
	*/









	tstArrayObj = [1];
	tstArrayObj.abc = '123';
	tstFn = function(a) {};
	tstObj = {}
	tstObjArrayLike = [1];
	tstObjArrayLike.xyz = '789';
	tstObjEmptyArray = {length:0};


	//----- shared global convenience test data and elementss
	t_doc = document.cloneNode();
	t_html = document.getElementsByTagName('html')[0];
	t_head = document.getElementsByTagName('head')[0];
	t_title = document.getElementsByTagName('title')[0];

	t_body = document.getElementsByTagName('body')[0];
	t_wrap = document.getElementById('EZtest_wrap');
	t_input = t_wrap.getElementsByTagName('input')
	t_forms = document.forms;
	t_fm = t_forms[0];

	t_none = EZnone();
	t_tags = t_wrap.getElementsByTagName('EZtest_tag');
	t_array = [].slice.call(t_tags)

	t_divs = t_wrap.getElementsByTagName('div');
	t_radios = t_fm.EZtest_radio;
	t_radio01 = [].slice.call(t_radios); t_radio01.pop();
	t_mixed = [].slice.call(t_divs); t_mixed.push('str');
	t_idandclass = document.getElementsByClassName('idandclass')

  <div id="EZtest_wrap">
    <label id="EZtest_input">
      <input name="EZtest_radio" id="EZtest_tag" type="radio" value="false" />
      none</label>
    <EZtest_tag id="EZtest_tag0" class="EZtest_class0">test tag0
      <label id="test_id1" class="idandclass">
        <input name="EZtest_radio" type="radio" id="EZtest_class1" value="true" checked="checked"/>
        <span>All</span> </label>
      <div id="EZtest_div0" class="EZtest EZtest_div_class0">
        ______________div0______________
      </div>
    </EZtest_tag>
    <EZtest_tag id="EZtest_tag1" class="EZtest_class1">test tag1
      <input name="EZtest_input" type="text" id="EZtest_input">
      <div id="EZtest_div1" class="EZtest EZtest_div_class1">
        ______________div1______________
        <label>
          <input name="EZtest_radio" type="radio"
          id="EZtest_radio1" value="some" class="test_id1 idandclass"/>
          Some</label>
      </div>
    </EZtest_tag>
  </div>


			var argName = argNames[idx] || '';
			argName = '[' + (argNo++) + '] '
					+ (argName ? argName + ' ' : '');

		/*
		var callStmt = testdata.calls[testIdx]
					 + (callArgs.length == 0 ? EZ.test.noArguments + ' )'
					 : callArgs.join(',  ') + ' )')
		*/
		// prepend pseudo call statement



			funcProtoCallArg = callArgs[0]
			callArgs.forEach(function(arg, idx)
			{
				callArgs[idx] = (arg == "''")
							  ? EZdisplayObject.B_MARKER
							  : EZ.test.callArgNameMap[arg] || arg;
			});

			var callArgsArray = EZ.toArray(parts[1].trim(), ',');
			if (funcProtoName)
				callArgs[0] = funcProtoType;

			// clear callArg name when object
			callArgs.forEach(function(name,idx)
			{
				if (typeof(name) == 'object')
					callArgNames[idx] = '';
			});

		var args = EZ.toArray(str, ',');		//create array of arguments
		args.forEach(function(arg,idx)
		{
			if (/./.test(arg))					//if not variable, clear name
				args[idx] = '';
			else								//unescape quotes
				args[idx] = arg.replace(/@,@/g, ',');
		});

		str = str.replace(/(["'])(.*?)\s*\1/, function(g0, g1, g2)
		{
			return g2.replace(/,/g, '@@@');		//remove quoted strings
		});

		while (/["']/.test(str))					//remove quoted strings
			str = str.replace(/(["']).*?\1/g, '');
		str = str.replace(/(["'])(.*?)\s*\1/, '@@@');	//remove quoted strings

		var results;
		while (results = str.match(/([\]})])/))			//remove [...], {...} and (...)
		{											//get associated open ch for close
			var begChar = {']':'[', '}':'{', ')':'('}[results[1]];
			var offset = str.lastIndexOf(begChar, results.index);
			if (offset == -1) return [];			//quit if confused

			str = str.substr(0,offset) + str.substr(results.index+1);
		}

		["''", '""', '[]', '{}', '()'].forEach(function(pair)
		{
			var regex = new RegExp('\\' + pair.substr(0,1)
								  + '(.*?)\s*'
								  + '\\' + pair.substr(0,1), 'g');
			str = str.replace(regex, '###');
		});


String: 'a'

o: obj (Object):
   0:(number):0¬
   a:(string):a¬
   b:(string):b¬
   z:(string):0¬
   f:•false•
   t:•true•
   u:•undefined•
   n:•null•
   l1 (Object):
      0:(number):0¬
      va:(string):va¬
      v0:(number):0¬
      a:(string):a¬
      u:•undefined•
      n:•null•
      l2 (Object):
         v:(string):val¬
   arr_empty (Array):
       •no elements•
   arr_items (Array):
     [0]:(number):1¬
     [1]:(number):2¬
     [2]:(number):3¬

defaultValue •omitted•


			///callArgs = callArgs.matchPlus(/((['"]|.+)).??(\2|\3)/g)	//[callArg0, callArg1, ...]
			///callArgNames.push( formatCallArguments(callArgs) );	//"( callArg0, callArg1... )"

			callArgNames.push(
				callArgs.forEach(function(arg,idx)
				{
					/^['"[{]/.test(arg) ? '' 	//quoted string, array or object
					: arg;						//variable name
					//if (EZ.get('showSpaces'))
					//	callArgs[idx] = arg.replace(/ /g, EZ.constant.bigdot)
				})
			);

//callArgs = callArgs.matchPlus(/(([^'",]+)|(['"]).*\2)(?=\s*,|$)/g)
			/*
			callArgs.forEach(function(arg,idx)
			{								//save argument variables names
				if (arg = /['"]/.test(arg))	//if quoted string
				{
					//if (!EZ.get('showSpaces'))
					//	callArgs[idx] = arg.replace(/ /g, EZ.constant.bigdot);
					arg = '';
				}
				else if (arg = /[[{]/.test(arg))
					arg = '';
				callArgNames.push(arg)
			});

			*/
