EZ.test.savedResults=		//Saved @ 12-04-2016 11:50:32 pm
[
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 1,\n'
	+ '    id: "arg1=1st arg (value):return value,arg2=2nd arg (options):[returnType],2nd arg (options).returnType:false,note:",\n'
	+ '    note: "1st actual return argument set to <cite>EZ.test.run.values</cite>",\n'
	+ '    warn: "expected <cite>return value</cite> •not&nbsp;specified•\\n",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            babe: "Brenda"\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            _data: {\n'
	+ '                success: "na"\n'
	+ '            },\n'
	+ '            _EZreturnValue: true,\n'
	+ '            value: "return value"\n'
	+ '        },\n'
	+ '        results: "return value"\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        0: {\n'
	+ '            babe: "Brenda"\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            _data: {\n'
	+ '                success: "na"\n'
	+ '            },\n'
	+ '            _EZreturnValue: true,\n'
	+ '            value: "return value"\n'
	+ '        },\n'
	+ '        results: "return value"\n'
	+ '    },\n'
	+ '    used: true,\n'
	+ '    saveDateTime: "12-04-2016 11:50:00 pm"\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    ok: false,\n'
	+ '    testno: 2,\n'
	+ '    id: "arg1=1st arg (value):return rtnValue,arg2=2nd arg (options):[returnType],2nd arg (options).returnType:true,note:",\n'
	+ '    note: "1st actual return argument set to <cite>EZ.test.run.values</cite>\\n2nd actual return argument set to pruned <cite>rtnValue</cite>",\n'
	+ '    warn: "expected <cite>return value</cite> •not&nbsp;specified•\\n1st arg <cite>value</cite> changed; expected value •not&nbsp;specified•\\n2nd arg <cite>options</cite> changed; expected value •not&nbsp;specified•\\n",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            babe: "Brenda"\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            _data: {\n'
	+ '                success: "na",\n'
	+ '                returnType: true\n'
	+ '            },\n'
	+ '            _EZreturnValue: true,\n'
	+ '            value: "return rtnValue"\n'
	+ '        },\n'
	+ '        results: {\n'
	+ '            _data: {\n'
	+ '                success: "na",\n'
	+ '                returnType: true\n'
	+ '            },\n'
	+ '            _EZreturnValue: true,\n'
	+ '            value: "return rtnValue"\n'
	+ '        }\n'
	+ '    },\n'
	+ '    expected: {},\n'
	+ '    saveDateTime: "12-04-2016 11:50:00 pm"\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    ok: false,\n'
	+ '    testno: 3,\n'
	+ '    id: "arg1=1st arg (value):called as new,arg2=2nd arg (options):[],note:",\n'
	+ '    note: "1st actual return argument set to <cite>EZ.test.run.values</cite>\\n2nd actual return argument set to pruned <cite>rtnValue</cite>",\n'
	+ '    warn: "expected <cite>return value</cite> •not&nbsp;specified•\\n1st arg <cite>value</cite> changed; expected value •not&nbsp;specified•\\n2nd arg <cite>options</cite> changed; expected value •not&nbsp;specified•\\n",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            babe: "Brenda"\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            _data: {\n'
	+ '                success: "na"\n'
	+ '            },\n'
	+ '            _EZreturnValue: true,\n'
	+ '            value: "called as new"\n'
	+ '        },\n'
	+ '        results: {\n'
	+ '            _data: {\n'
	+ '                "@JSON_escapeMarker@": "$.actual.results._data=$.actual.1._data"\n'
	+ '            }\n'
	+ '        }\n'
	+ '    },\n'
	+ '    expected: {},\n'
	+ '    saveDateTime: "12-04-2016 11:50:00 pm"\n'
	+ '}'
,
	'"test #4 no data"'
,
	'"test #5 no data"'
,
	''
	+ '{\n'
	+ '    ok: false,\n'
	+ '    testno: 6,\n'
	+ '    id: "arg1=1st arg (value):called as new,arg2=2nd arg (options):[testMode],2nd arg (options).testMode:false,note:",\n'
	+ '    note: "1st actual return argument set to <cite>EZ.test.run.values</cite>",\n'
	+ '    warn: "<cite>return value</cite> NOT expected String\\n1st arg <cite>value</cite> changed; expected value •not&nbsp;specified•\\n\\n•&nbsp;•&nbsp;•&nbsp;\\n<img src=\\"../images/fn_16.png\\"><i>expected values changed by test script fn:</i>\\n\\"return value\\"",\n'
	+ '    actual: {\n'
	+ '        0: null,\n'
	+ '        1: {\n'
	+ '            testMode: false\n'
	+ '        },\n'
	+ '        results: {\n'
	+ '            _data: {\n'
	+ '                success: "na"\n'
	+ '            }\n'
	+ '        }\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        results: "TypeError: Cannot read property 'removeKeys' of null\\n@...Function._____returnValue_test:922() lineno:922...@\\n   at EZtest_testrun.exfn:906             (.../EZbasic.js:906)\\n   at EZtest_run:1088                     (.../EZtest_assistant_run.js:1088)\\n   at Function._____returnValue_test:922  (.../EZbasic.js:922)\\n   at .../EZtest_assistant_run.js:406     "\n'
	+ '    },\n'
	+ '    saveDateTime: "12-04-2016 11:50:01 pm"\n'
	+ '}'
]