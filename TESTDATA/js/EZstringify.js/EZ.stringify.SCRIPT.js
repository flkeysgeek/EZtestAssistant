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
 	//==============================================================================
	EZ.test.run({a:1, b:2})

	var x = {a:1};
	x.b = x;

 	//setnote('Circular Object')
	EZ.test.run(x)
	EZ.test.run(x, '*');
	EZ.test.run(x, '*circular');
//EZ.test.quit

 	//_______________________________________________________________________________
 	//
 	//NOTE: ***** this file must be saved in unix format for advanced validation *****
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
EZ.test.quit
return;

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

 	/*global t_radios */
 	e = regexObject;

 	obj = t_radios[0];
 	setnote('radio button')
 	EZ.test.run(obj, '*all')
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
