EZ.test.savedResults=		//Saved @ 12-10-2016 06:36:37 am
[
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 1,\n'
	+ '    id: "arg1=1st arg (obj):[results],1st arg (obj).results:{\\n    a: \\"abc\\",\\n    b: {\\n        \\"@JSON_escapeMarker@\\": \\"$.b=$\\"\\n    }\\n},arg2=2nd arg (options):,note:markerinsidestring--notreal",\n'
	+ '    note: "marker inside string -- not real\\nisOk() is true clone:EZcloneV3 stringify:jsonPlusV3\\n<b>no messages</b>",\n'
	+ '    warn: "<img src=\\"../images/fn_16.png\\"><i>expected values changed by script callback fn:</i>\\n\\"return value\\"",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            results: "{\\n    a: \\"abc\\",\\n    b: {\\n        \\"@JSON_escapeMarker@\\": \\"$.b=$\\"\\n    }\\n}"\n'
	+ '        },\n'
	+ '        1: "{\\n    \\"results\\": \\"{\\\\n    a: \\\\\\"abc\\\\\\",\\\\n    b: {\\\\n        \\\\\\"@JSON_escapeMarker@\\\\\\": \\\\\\"$.b=$\\\\\\"\\\\n    }\\\\n}\\"\\n}",\n'
	+ '        results: {\n'
	+ '            results: "{\\n    a: \\"abc\\",\\n    b: {\\n        \\"@JSON_escapeMarker@\\": \\"$.b=$\\"\\n    }\\n}"\n'
	+ '        }\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        1: "{\\n    \\"results\\": \\"{\\\\n    a: \\\\\\"abc\\\\\\",\\\\n    b: {\\\\n        \\\\\\"@JSON_escapeMarker@\\\\\\": \\\\\\"$.b=$\\\\\\"\\\\n    }\\\\n}\\"\\n}",\n'
	+ '        results: {\n'
	+ '            results: "{\\n    a: \\"abc\\",\\n    b: {\\n        \\"@JSON_escapeMarker@\\": \\"$.b=$\\"\\n    }\\n}"\n'
	+ '        }\n'
	+ '    },\n'
	+ '    saveDateTime: "12-10-2016 06:36:36 am"\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    "ok": true,\n'
	+ '    "testno": 2,\n'
	+ '    "id": "arg1=1st arg (obj):[a,b],1st arg (obj).a:abc,1st arg (obj).b:[@JSON_escapeMarker@],1st arg (obj).b.@JSON_escapeMarker@:$.b=$,arg2=2nd arg (options):,note:realcircularmarker",\n'
	+ '    "note": "real circular marker\\nisOk() is true clone:EZcloneV3 stringify:jsonPlusV3\\n<b>no messages</b>",\n'
	+ '    "warn": "<img src=\\"../images/fn_16.png\\"><i>expected values changed by script callback fn:</i>\\n\\"return value\\"",\n'
	+ '    "actual": {\n'
	+ '        "0": {\n'
	+ '            "a": "abc",\n'
	+ '            "b": {\n'
	+ '                "@JSON_escapeMarker@": "$.b=$"\n'
	+ '            }\n'
	+ '        },\n'
	+ '        "1": "{\\n    \\"a\\": \\"abc\\",\\n    \\"b\\": {\\n        \\"@JSON_escapeMarker@\\": \\"$.b=$\\"\\n    }\\n}",\n'
	+ '        "results": {\n'
	+ '            "a": "abc",\n'
	+ '            "b": {\n'
	+ '                "@JSON_escapeMarker@": "$.b=$"\n'
	+ '            }\n'
	+ '        }\n'
	+ '    },\n'
	+ '    "expected": {\n'
	+ '        "1": "{\\n    \\"a\\": \\"abc\\",\\n    \\"b\\": {\\n        \\"@JSON_escapeMarker@\\": \\"$.b=$\\"\\n    }\\n}",\n'
	+ '        "results": {\n'
	+ '            "a": "abc",\n'
	+ '            "b": {\n'
	+ '                "@JSON_escapeMarker@": "$.b=$"\n'
	+ '            }\n'
	+ '        }\n'
	+ '    },\n'
	+ '    "saveDateTime": "12-10-2016 06:36:36 am"\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    "ok": false,\n'
	+ '    "testno": 3,\n'
	+ '    "id": "arg1=1st arg (obj):[a,b],1st arg (obj).a:abc,1st arg (obj).b:[@JSON_escapeMarker@],1st arg (obj).b.@JSON_escapeMarker@:$.b=$.not,arg2=2nd arg (options):,note:realmarkerbutinvalid",\n'
	+ '    "note": "real marker but invalid\\nisOk() is <em>false</em> clone:EZcloneV3 stringify:jsonPlusV3",\n'
	+ '    "warn": "<cite>return value</cite> NOT expected String\\n\\n•&nbsp;•&nbsp;•&nbsp;\\n<img src=\\"../images/fn_16.png\\"><i>expected values changed by script callback fn:</i>\\n\\"return value\\"",\n'
	+ '    "actual": {\n'
	+ '        "0": {\n'
	+ '            "a": "abc",\n'
	+ '            "b": {\n'
	+ '                "@JSON_escapeMarker@": "$.b=$.not"\n'
	+ '            }\n'
	+ '        },\n'
	+ '        "1": "JSON.plus.unescape(): Invalid JSON escape marker: \\n\\t[$.not] is undefined at JSON line 4:\\n\\t\\"@JSON_escapeMarker@\\": \\"$.b=$.not\\"\\n1:{\\n2:    \\"a\\": \\"abc\\",\\n3:    \\"b\\": {\\n4:        \\"@JSON_escapeMarker@\\": \\"$.b=$.not\\"\\n5:    }\\n6:}\\n\\n",\n'
	+ '        "results": "[object Object]\\n<em>message:</em>\\nJSON.plus.unescape(): Invalid JSON escape marker: \\n\\t[$.not] is undefined at JSON line 4:\\n\\t\\"@JSON_escapeMarker@\\": \\"$.b=$.not\\"\\nJSON.plus.unescape() [1 error] -- to see json: \\nJSON.plus.unescape.returnValue.getDetails()"\n'
	+ '    },\n'
	+ '    "expected": {\n'
	+ '        "results": "test failed"\n'
	+ '    },\n'
	+ '    "saveDateTime": "12-10-2016 06:36:37 am"\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    "ok": false,\n'
	+ '    "testno": 4,\n'
	+ '    "id": "arg1=1st arg (obj):[ok,testno,id,note,warn,actual,expected,used,saveDateTime],1st arg (obj).ok:true,1st arg (obj).testno:1,1st arg (obj).id:arg1=1st arg (value):value,arg2=2nd arg (options):[returnType],2nd arg (options).returnType:false,note:,1st arg (obj).note:,1st arg (obj).warn:expected <cite>return value</cite> *not&nbsp;specified*\\n,1st arg (obj).actual:[0,1,results],1st arg (obj).actual[0]:[babe],1st arg (obj).actual[0].babe:Brenda,1st arg (obj).actual[1]:[_data,value],1st arg (obj).actual[1]._data:[success],1st arg (obj).actual[1]._data.success:na,1st arg (obj).actual[1].value:value,1st arg (obj).actual.results:value,1st arg (obj).expected:[0,1,results],1st arg (obj).expected[0]:[babe],1st arg (obj).expected[0].babe:Brenda,1st arg (obj).expected[1]:[@JSON_escapeMarker@],1st arg (obj).expected[1].@JSON_escapeMarker@:$.actual.1.expected.1=$.actual.1,1st arg (obj).expected.results:value,1st arg (obj).used:true,1st arg (obj).saveDateTime:12-03-2016 12:14:27 am,arg2=2nd arg (options):[],note:",\n'
	+ '    "note": "isOk() is <em>false</em> clone:EZcloneV3 stringify:jsonPlusV3",\n'
	+ '    "warn": "<cite>return value</cite> NOT expected String\\n\\n•&nbsp;•&nbsp;•&nbsp;\\n<img src=\\"../images/fn_16.png\\"><i>expected values changed by script callback fn:</i>\\n\\"return value\\"",\n'
	+ '    "actual": {\n'
	+ '        "0": {\n'
	+ '            "ok": true,\n'
	+ '            "testno": 1,\n'
	+ '            "id": "arg1=1st arg (value):value,arg2=2nd arg (options):[returnType],2nd arg (options).returnType:false,note:",\n'
	+ '            "note": "",\n'
	+ '            "warn": "expected <cite>return value</cite> *not&nbsp;specified*\\n",\n'
	+ '            "actual": {\n'
	+ '                "0": {\n'
	+ '                    "babe": "Brenda"\n'
	+ '                },\n'
	+ '                "1": {\n'
	+ '                    "_data": {\n'
	+ '                        "success": "na"\n'
	+ '                    },\n'
	+ '                    "value": "value"\n'
	+ '                },\n'
	+ '                "results": "value"\n'
	+ '            },\n'
	+ '            "expected": {\n'
	+ '                "0": {\n'
	+ '                    "babe": "Brenda"\n'
	+ '                },\n'
	+ '                "1": {\n'
	+ '                    "@JSON_escapeMarker@": "$.actual.1.expected.1=$.actual.1"\n'
	+ '                },\n'
	+ '                "results": "value"\n'
	+ '            },\n'
	+ '            "used": true,\n'
	+ '            "saveDateTime": "12-03-2016 12:14:27 am"\n'
	+ '        },\n'
	+ '        "1": "JSON.plus.unescape(): Invalid JSON escape marker: \\n\\t[$.actual.1.expected.1] is undefined at JSON line 24:\\n\\t\\"@JSON_escapeMarker@\\": \\"$.actual.1.expected.1=$.actual.1\\"\\n 1:{\\n 2:    \\"ok\\": true,\\n 3:    \\"testno\\": 1,\\n 4:    \\"id\\": \\"arg1=1st arg (value):value,arg2=2nd arg (options):[returnType],2nd arg (options).returnType:false,note:\\",\\n 5:    \\"note\\": \\"\\",\\n 6:    \\"warn\\": \\"expected <cite>return value</cite> *not&nbsp;specified*\\\\n\\",\\n 7:    \\"actual\\": {\\n 8:        \\"0\\": {\\n 9:            \\"babe\\": \\"Brenda\\"\\n10:        },\\n11:        \\"1\\": {\\n12:            \\"_data\\": {\\n13:                \\"success\\": \\"na\\"\\n14:            },\\n15:            \\"value\\": \\"value\\"\\n16:        },\\n17:        \\"results\\": \\"value\\"\\n18:    },\\n19:    \\"expected\\": {\\n20:        \\"0\\": {\\n21:            \\"babe\\": \\"Brenda\\"\\n22:        },\\n23:        \\"1\\": {\\n24:            \\"@JSON_escapeMarker@\\": \\"$.actual.1.expected.1=$.actual.1\\"\\n25:        },\\n26:        \\"results\\": \\"value\\"\\n27:    },\\n28:    \\"used\\": true,\\n29:    \\"saveDateTime\\": \\"12-03-2016 12:14:27 am\\"\\n30:}\\n\\n",\n'
	+ '        "results": "[object Object]\\n<em>message:</em>\\nJSON.plus.unescape(): Invalid JSON escape marker: \\n\\t[$.actual.1.expected.1] is undefined at JSON line 24:\\n\\t\\"@JSON_escapeMarker@\\": \\"$.actual.1.expected.1=$.actual.1\\"\\nJSON.plus.unescape() [1 error] -- to see json: \\nJSON.plus.unescape.returnValue.getDetails()"\n'
	+ '    },\n'
	+ '    "expected": {\n'
	+ '        "results": "test failed"\n'
	+ '    },\n'
	+ '    "saveDateTime": "12-10-2016 06:36:37 am"\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    ok: false,\n'
	+ '    testno: 5,\n'
	+ '    id: "arg1=1st arg (json):{\\n    ok: true,\\n    testno: 7,\\n    actual: {\\n        0: {\\n            a: \\"abc\\",\\n            b: {\\n                \\"@JSON_escapeMarker@\\": \\"$.actual.0.b=$.actual.0.b\\"\\n            }\\n    saveDateTime: \\"11-28-2016 10:53:46 pm\\"\\n},arg2=2nd arg (opts):[rtnValue],2nd arg (opts).rtnValue:true,note:",\n'
	+ '    note: "",\n'
	+ '    warn: "expected <cite>return value</cite> •not&nbsp;specified•\\n",\n'
	+ '    actual: {\n'
	+ '        0: "{\\n    ok: true,\\n    testno: 7,\\n    actual: {\\n        0: {\\n            a: \\"abc\\",\\n            b: {\\n                \\"@JSON_escapeMarker@\\": \\"$.actual.0.b=$.actual.0.b\\"\\n            }\\n    saveDateTime: \\"11-28-2016 10:53:46 pm\\"\\n}",\n'
	+ '        1: {\n'
	+ '            "@JSON_escapeMarker@": "$.actual.1=undefined"\n'
	+ '        },\n'
	+ '        results: {\n'
	+ '            "@JSON_escapeMarker@": "$.actual.results=undefined"\n'
	+ '        }\n'
	+ '    },\n'
	+ '    expected: {},\n'
	+ '    saveDateTime: "12-10-2016 06:36:37 am"\n'
	+ '}'
]