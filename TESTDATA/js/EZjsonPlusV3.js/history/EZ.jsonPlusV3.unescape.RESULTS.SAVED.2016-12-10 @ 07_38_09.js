EZ.test.savedResults=		//Saved @ 12-10-2016 07:38:09 am
[
	'"test #1 no data"'
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
	+ '    "saveDateTime": "12-10-2016 07:38:09 am"\n'
	+ '}'
]