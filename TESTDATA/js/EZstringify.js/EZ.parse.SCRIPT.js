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
 	
	//===============================================================================
	EZ.test.settings( {group: 'issues found while using'} )

	json = {
		testno: 1,
		id: "arg1=number:1234,note:",
		safe: {
			actual: {
				"0": 1234,
				results: "1234th"
			},
			expected: {
				"0": "*not specified*",
				results: "1234th"
			}
		},
		note: ""
	}
	EZ.test.options( {note:'mistakes "number:" as unquoted object key'})
	EZ.test.run(json)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	obj = {
		"testno": 1,
		"id": "arg1=ctx:.EZ,arg2=obj:null,arg3=defVal:supplied object variable is null,note:<b>issuesfoundduringusage</b>suppliedobjectvariableisnull",
		"note": "<b>issues found during usage</b>\nsupplied object variable is null"
	}

EZ.run.skip(1)
	json = JSON.stringify(obj,null,4)
	EZ.test.options( {note:'hangs'})
	EZ.test.run(json)

	//______________________________________________________________________________

	note = 'incorrectly identifies parse error:'.bold() + '\n'
	   + 'problem may be embedded \\r CR'
	   + 'SyntaxError: undefined\n'
	   + 'more detail below...\n'
	   + '--------------------------------------------------\n'
	   + '{\n'
	   + '    "funcName": "EZ.file",\n'
	   + '==================================================\n'
	   + '...Unexpected token ]\n'
	   + '_______________\n'
	   + '               \\\n'
	   + '    "testrun": [],\n'
	   + '________________/\n'
	   + '...end of json parse\n'
	   + '==================================================\n'
	   + '    "testScriptFuncName": "EZ.file.test",\n'
	   + '';


	json = ''
	   + '{\n'
	   + '    "funcName": "EZ.file",\n'
	   + '    "testrun": [],\n'
	   + '    "testScriptFuncName": "EZ.file.test",\n'
	   + '    "lineno": 2991,\n'
	   + '    "funcProtoName": "",\n'
	   + '    "funcProtoType": "EZ",\n'
	   + '    "baseOffset": 541,\n'
	   + '    "testCalls": (function()\n'
	   + '    {\n'
	   + '        var ____array____ = [\n'
	   + '            "EZ.test.run( folder, filename ", "EZ.test.run( folder + '/' + filename "\n'
	   + '        ];\n'
	   + '        var ____properties____ = {\n'
	   + '            "count": 2,\n'
	   + '            "start": [2, 36],\n'
	   + '            "end": [32, 73],\n'
	   + '            "index": 2,\n'
	   + '            "lastIndex": 73,\n'
	   + '            "isFound": true,\n'
	   + '            "offsets": "0:[2,32], 1:[36,73]",\n'
	   + '            "keys": ["input"],\n'
	   + '            "values": {},\n'
	   + '            "get": {},\n'
	   + '            "set": {},\n'
	   + '            "valueOf": {}\n'
	   + '        };\n'
	   + '        Object.keys(____properties____).forEach(function(key)\n'
	   + '        {____array____[key] = ____properties____[key]});\n'
	   + '        return ____array____;\n'
	   + '    })(),\n'
	   + '    "argSuffix": ["1st arg ", "2nd arg "],\n'
	   + '    "argNames": ["filename", "folder"],\n'
	   + '    "fnStatement": "EZ.file (<i> filename,   folder </i>)",\n'
	   + '    "callPrefix": ["EZ.file", "EZ.file"],\n'
	   + '    "callArgNames": [\n'
	   + '        ["folder", "filename"],\n'
	   + '        ["folder + ###/### + filename"]\n'
	   + '    ],\n'
	   + '    "callArgTypes": [\n'
	   + '        ["var", "var"],\n'
	   + '        ["var"]\n'
	   + '    ],\n'
	   + '    "callLineno": [3016, 3017],\n'
	   + '    "count": 2\n'
	   + '}';

	EZ.test.options( {note:note} )
	EZ.test.run(json)
}
