EZ.test.savedResults=		//Saved @ 12-10-2016 06:40:26 am
[
{
    ok: true,
    testno: 1,
    id: "arg1=1st arg (obj):[results],1st arg (obj).results:{\n    a: \"abc\",\n    b: {\n        \"@JSON_escapeMarker@\": \"$.b=$\"\n    }\n},arg2=2nd arg (options):,note:markerinsidestring--notreal",
    note: "marker inside string -- not real\nisOk() is true clone:EZcloneV3 stringify:jsonPlusV3\n<b>no messages</b>",
    warn: "<img src=\"../images/fn_16.png\"><i>expected values changed by script callback fn:</i>\n\"return value\"",
    actual: {
        0: {
            results: "{\n    a: \"abc\",\n    b: {\n        \"@JSON_escapeMarker@\": \"$.b=$\"\n    }\n}"
        },
        1: "{\n    \"results\": \"{\\n    a: \\\"abc\\\",\\n    b: {\\n        \\\"@JSON_escapeMarker@\\\": \\\"$.b=$\\\"\\n    }\\n}\"\n}",
        results: {
            results: "{\n    a: \"abc\",\n    b: {\n        \"@JSON_escapeMarker@\": \"$.b=$\"\n    }\n}"
        }
    },
    expected: {
        1: "{\n    \"results\": \"{\\n    a: \\\"abc\\\",\\n    b: {\\n        \\\"@JSON_escapeMarker@\\\": \\\"$.b=$\\\"\\n    }\\n}\"\n}",
        results: {
            results: "{\n    a: \"abc\",\n    b: {\n        \"@JSON_escapeMarker@\": \"$.b=$\"\n    }\n}"
        }
    },
    saveDateTime: "12-10-2016 06:39:55 am"
}
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
	+ '    "saveDateTime": "12-10-2016 06:40:25 am"\n'
	+ '}'
,
	'"test #3 no data"'
,
	'"test #4 no data"'
,
	'"test #5 no data"'
]