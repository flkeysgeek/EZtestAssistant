EZ.test.savedResults=		//Saved @ 12-09-2016 07:16:44 am
[
	'"test #1 no data"'
,
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 7,\n'
	+ '    id: "arg1=1st arg (x):[a,b],1st arg (x).a:abc,1st arg (x).b:{1st arg (x)},arg2=2nd arg (plusOpts):[clone,validate,unquoteKeys,ignore],2nd arg (plusOpts).clone:keep,2nd arg (plusOpts).validate:true,2nd arg (plusOpts).unquoteKeys:true,2nd arg (plusOpts).ignore:none,note:<b>simpleJSON.stringify()circularobjects</b>",\n'
	+ '    note: "<b>simple JSON.stringify() circular objects</b>\\n\\nisOk() is true clone:EZcloneV3 stringify:jsonPlusV3\\n<b>no messages</b>\\n1st <em>actual</em> argument set to <cite>clone from json</cite>\\n2nd actual return argument set to <cite>returned lists</cite>",\n'
	+ '    warn: "",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            a: "abc",\n'
	+ '            b: {\n'
	+ '                "@JSON_escapeMarker@": "$.actual.0.b=$.actual.0"\n'
	+ '            }\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            escaped_values: [\n'
	+ '                "$.b=$"\n'
	+ '            ],\n'
	+ '            EZequals_options: [\n'
	+ '                {\n'
	+ '                    showDiff: 10,\n'
	+ '                    html: true,\n'
	+ '                    name: [\n'
	+ '                        "specified Object",\n'
	+ '                        "clone from json"\n'
	+ '                    ],\n'
	+ '                    exclude: []\n'
	+ '                }\n'
	+ '            ]\n'
	+ '        },\n'
	+ '        results: "{\\n    a: \\"abc\\",\\n    b: {\\n        \\"@JSON_escapeMarker@\\": \\"$.b=$\\"\\n    }\\n}"\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        0: {\n'
	+ '            a: "abc",\n'
	+ '            b: {\n'
	+ '                "@JSON_escapeMarker@": "$.expected.0.b=$.expected.0"\n'
	+ '            }\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            escaped_values: [\n'
	+ '                "$.b=$"\n'
	+ '            ],\n'
	+ '            EZequals_options: [\n'
	+ '                {\n'
	+ '                    showDiff: 10,\n'
	+ '                    html: true,\n'
	+ '                    name: [\n'
	+ '                        "specified Object",\n'
	+ '                        "clone from json"\n'
	+ '                    ],\n'
	+ '                    exclude: []\n'
	+ '                }\n'
	+ '            ]\n'
	+ '        },\n'
	+ '        results: "{\\n    a: \\"abc\\",\\n    b: {\\n        \\"@JSON_escapeMarker@\\": \\"$.b=$\\"\\n    }\\n}"\n'
	+ '    },\n'
	+ '    saveDateTime: "12-09-2016 04:59:02 am"\n'
	+ '}'
]