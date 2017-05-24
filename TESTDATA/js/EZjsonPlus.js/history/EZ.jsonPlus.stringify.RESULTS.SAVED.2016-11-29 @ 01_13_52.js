EZ.test.savedResults=		//Saved @ 11-29-2016 01:13:52 am
[
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 1,\n'
	+ '    id: "arg1=1st arg (obj):[a,b],1st arg (obj).a:1,1st arg (obj).b:[x,y],1st arg (obj).b.x:x-ray,1st arg (obj).b.y:99,arg2=2nd arg (keys_quoted):[clone,validate,unquoteKeys,ignore],2nd arg (keys_quoted).clone:keep,2nd arg (keys_quoted).validate:true,2nd arg (keys_quoted).unquoteKeys:false,2nd arg (keys_quoted).ignore:none,note:<b>simplenon-circularJSON.stringify()</b>",\n'
	+ '    note: "<b>simple non-circular JSON.stringify()</b>\\n\\n1st <em>actual</em> argument set to Object created from json\\n1st <em>expected</em> argument set to input obj\\n<b>no Errors found</b>\\n2nd actual return argument set to <cite>returned lists</cite>\\n<em>test script set expected value for </em><cite>returned lists</cite>\\n<hr>JSON.stringify() info messages: none",\n'
	+ '    warn: "<img src=\\"../images/fn_16.png\\"><i>expected values changed by test script fn:</i>\\n1st arg (obj)",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            a: 1,\n'
	+ '            b: {\n'
	+ '                x: "x-ray",\n'
	+ '                y: 99\n'
	+ '            }\n'
	+ '        },\n'
	+ '        1: "no returned lists",\n'
	+ '        results: "{\\n    \\"a\\": 1,\\n    \\"b\\": {\\n        \\"x\\": \\"x-ray\\",\\n        \\"y\\": 99\\n    }\\n}"\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        1: "no returned lists",\n'
	+ '        results: "{\\n    \\"a\\": 1,\\n    \\"b\\": {\\n        \\"x\\": \\"x-ray\\",\\n        \\"y\\": 99\\n    }\\n}"\n'
	+ '    },\n'
	+ '    saveDateTime: "11-29-2016 01:13:51 am"\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 2,\n'
	+ '    id: "arg1=1st arg (obj):[a,b],1st arg (obj).a:1,1st arg (obj).b:[x,y],1st arg (obj).b.x:x-ray,1st arg (obj).b.y:99,arg2=2nd arg (plusOpts):[clone,validate,unquoteKeys,ignore],2nd arg (plusOpts).clone:keep,2nd arg (plusOpts).validate:true,2nd arg (plusOpts).unquoteKeys:true,2nd arg (plusOpts).ignore:none,note:<b>simplenon-circularJSON.stringify()</b>",\n'
	+ '    note: "<b>simple non-circular JSON.stringify()</b>\\n\\n1st <em>actual</em> argument set to Object created from json\\n1st <em>expected</em> argument set to input obj\\n<b>no Errors found</b>\\n2nd actual return argument set to <cite>returned lists</cite>\\n<em>test script set expected value for </em><cite>returned lists</cite>\\n<hr>JSON.stringify() info messages: none",\n'
	+ '    warn: "<img src=\\"../images/fn_16.png\\"><i>expected values changed by test script fn:</i>\\n1st arg (obj)",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            a: 1,\n'
	+ '            b: {\n'
	+ '                x: "x-ray",\n'
	+ '                y: 99\n'
	+ '            }\n'
	+ '        },\n'
	+ '        1: "no returned lists",\n'
	+ '        results: "{\\n    a: 1,\\n    b: {\\n        x: \\"x-ray\\",\\n        y: 99\\n    }\\n}"\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        1: "no returned lists",\n'
	+ '        results: "{\\n    a: 1,\\n    b: {\\n        x: \\"x-ray\\",\\n        y: 99\\n    }\\n}"\n'
	+ '    },\n'
	+ '    saveDateTime: "11-29-2016 01:13:52 am"\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 3,\n'
	+ '    id: "arg1=1st arg (obj):[a,b,c,d],1st arg (obj).a:1,1st arg (obj).b:[x,y],1st arg (obj).b.x:x-ray,1st arg (obj).b.y:99,1st arg (obj).c:[0,1],1st arg (obj).c[0]:1,1st arg (obj).c[1]:cat,1st arg (obj).d:dog,arg2=2nd arg (keys_quoted):[clone,validate,unquoteKeys,ignore],2nd arg (keys_quoted).clone:keep,2nd arg (keys_quoted).validate:true,2nd arg (keys_quoted).unquoteKeys:false,2nd arg (keys_quoted).ignore:none,note:<b>simplenon-circularJSON.stringify()</b>",\n'
	+ '    note: "<b>simple non-circular JSON.stringify()</b>\\n\\n1st <em>actual</em> argument set to Object created from json\\n1st <em>expected</em> argument set to input obj\\n<b>no Errors found</b>\\n2nd actual return argument set to <cite>returned lists</cite>\\n<em>test script set expected value for </em><cite>returned lists</cite>\\n<hr>JSON.stringify() info messages: none",\n'
	+ '    warn: "<img src=\\"../images/fn_16.png\\"><i>expected values changed by test script fn:</i>\\n1st arg (obj)",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            a: 1,\n'
	+ '            b: {\n'
	+ '                x: "x-ray",\n'
	+ '                y: 99\n'
	+ '            },\n'
	+ '            c: [\n'
	+ '                1,\n'
	+ '                "cat"\n'
	+ '            ],\n'
	+ '            d: "dog"\n'
	+ '        },\n'
	+ '        1: "no returned lists",\n'
	+ '        results: "{\\n    \\"a\\": 1,\\n    \\"b\\": {\\n        \\"x\\": \\"x-ray\\",\\n        \\"y\\": 99\\n    },\\n    \\"c\\": [\\n        1,\\n        \\"cat\\"\\n    ],\\n    \\"d\\": \\"dog\\"\\n}"\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        1: "no returned lists",\n'
	+ '        results: "{\\n    \\"a\\": 1,\\n    \\"b\\": {\\n        \\"x\\": \\"x-ray\\",\\n        \\"y\\": 99\\n    },\\n    \\"c\\": [\\n        1,\\n        \\"cat\\"\\n    ],\\n    \\"d\\": \\"dog\\"\\n}"\n'
	+ '    },\n'
	+ '    saveDateTime: "11-29-2016 01:13:52 am"\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 4,\n'
	+ '    id: "arg1=1st arg (obj):[a,b,c,d],1st arg (obj).a:1,1st arg (obj).b:[x,y],1st arg (obj).b.x:x-ray,1st arg (obj).b.y:99,1st arg (obj).c:[0,1],1st arg (obj).c[0]:1,1st arg (obj).c[1]:cat,1st arg (obj).d:dog,arg2=2nd arg (plusOpts):[clone,validate,unquoteKeys,ignore],2nd arg (plusOpts).clone:keep,2nd arg (plusOpts).validate:true,2nd arg (plusOpts).unquoteKeys:true,2nd arg (plusOpts).ignore:none,note:<b>simplenon-circularJSON.stringify()</b>",\n'
	+ '    note: "<b>simple non-circular JSON.stringify()</b>\\n\\n1st <em>actual</em> argument set to Object created from json\\n1st <em>expected</em> argument set to input obj\\n<b>no Errors found</b>\\n2nd actual return argument set to <cite>returned lists</cite>\\n<em>test script set expected value for </em><cite>returned lists</cite>\\n<hr>JSON.stringify() info messages: none",\n'
	+ '    warn: "<img src=\\"../images/fn_16.png\\"><i>expected values changed by test script fn:</i>\\n1st arg (obj)",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            a: 1,\n'
	+ '            b: {\n'
	+ '                x: "x-ray",\n'
	+ '                y: 99\n'
	+ '            },\n'
	+ '            c: [\n'
	+ '                1,\n'
	+ '                "cat"\n'
	+ '            ],\n'
	+ '            d: "dog"\n'
	+ '        },\n'
	+ '        1: "no returned lists",\n'
	+ '        results: "{\\n    a: 1,\\n    b: {\\n        x: \\"x-ray\\",\\n        y: 99\\n    },\\n    c: [\\n        1,\\n        \\"cat\\"\\n    ],\\n    d: \\"dog\\"\\n}"\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        1: "no returned lists",\n'
	+ '        results: "{\\n    a: 1,\\n    b: {\\n        x: \\"x-ray\\",\\n        y: 99\\n    },\\n    c: [\\n        1,\\n        \\"cat\\"\\n    ],\\n    d: \\"dog\\"\\n}"\n'
	+ '    },\n'
	+ '    saveDateTime: "11-29-2016 01:13:52 am"\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 5,\n'
	+ '    id: "arg1=1st arg (x):[a,b],1st arg (x).a:abc,1st arg (x).b:[key],1st arg (x).b.key:99,arg2=2nd arg (plusOpts):[clone,validate,unquoteKeys,ignore],2nd arg (plusOpts).clone:keep,2nd arg (plusOpts).validate:true,2nd arg (plusOpts).unquoteKeys:true,2nd arg (plusOpts).ignore:none,note:<b>simplenon-circularJSON.stringify()</b>",\n'
	+ '    note: "<b>simple non-circular JSON.stringify()</b>\\n\\n1st <em>actual</em> argument set to Object created from json\\n1st <em>expected</em> argument set to input obj\\n<b>no Errors found</b>\\n2nd actual return argument set to <cite>returned lists</cite>\\n<em>test script set expected value for </em><cite>returned lists</cite>\\n<hr>JSON.stringify() info messages: none",\n'
	+ '    warn: "<img src=\\"../images/fn_16.png\\"><i>expected values changed by test script fn:</i>\\n1st arg (x)",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            a: "abc",\n'
	+ '            b: {\n'
	+ '                key: 99\n'
	+ '            }\n'
	+ '        },\n'
	+ '        1: "no returned lists",\n'
	+ '        results: "{\\n    a: \\"abc\\",\\n    b: {\\n        key: 99\\n    }\\n}"\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        1: "no returned lists",\n'
	+ '        results: "{\\n    a: \\"abc\\",\\n    b: {\\n        key: 99\\n    }\\n}"\n'
	+ '    },\n'
	+ '    saveDateTime: "11-29-2016 01:13:52 am"\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 6,\n'
	+ '    id: "arg1=1st arg (x):[a,b],1st arg (x).a:abc,1st arg (x).b:{1st arg (x)},arg2=2nd arg (opts):[clone,validate,unquoteKeys,ignore],2nd arg (opts).clone:keep,2nd arg (opts).validate:true,2nd arg (opts).unquoteKeys:true,2nd arg (opts).ignore:circular,note:<b>simpleJSON.stringify()circularobjects</b>circularobj[$.b]deleted",\n'
	+ '    note: "<b>simple JSON.stringify() circular objects</b>\\ncircular obj [$.b] deleted\\n1st <em>actual</em> argument set to Object created from json\\n<hr><em>JSON.stringify() messages:</em>\\nJSON.plus.validate() failed\\n1 deleted_value\\n4 validate_details\\n2nd actual return argument set to <cite>returned lists</cite>\\n<em>test script set expected value for </em><cite>returned lists</cite>\\n<em>Object created from json NOT same as input obj</em>\\n<hr>JSON.stringify() info messages: none",\n'
	+ '    warn: "",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            a: "abc"\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            deleted_values: [\n'
	+ '                "[$.b]: $.b"\n'
	+ '            ],\n'
	+ '            validate_details: [\n'
	+ '                "1st [Object] ... 2nd [Object]",\n'
	+ '                " . *keys do not match*",\n'
	+ '                "  + b:       ... na          ",\n'
	+ '                " . [Object]  !== [Object]    "\n'
	+ '            ]\n'
	+ '        },\n'
	+ '        results: "{\\n    a: \\"abc\\"\\n}"\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        0: {\n'
	+ '            a: "abc"\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            deleted_values: [\n'
	+ '                "[$.b]: $.b"\n'
	+ '            ],\n'
	+ '            validate_details: [\n'
	+ '                "1st [Object] ... 2nd [Object]",\n'
	+ '                " . *keys do not match*",\n'
	+ '                "  + b:       ... na          ",\n'
	+ '                " . [Object]  !== [Object]    "\n'
	+ '            ]\n'
	+ '        },\n'
	+ '        results: "{\\n    a: \\"abc\\"\\n}"\n'
	+ '    },\n'
	+ '    saveDateTime: "11-29-2016 01:13:52 am"\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 7,\n'
	+ '    id: "arg1=1st arg (x):[a,b],1st arg (x).a:abc,1st arg (x).b:{1st arg (x)},arg2=2nd arg (plusOpts):[clone,validate,unquoteKeys,ignore],2nd arg (plusOpts).clone:keep,2nd arg (plusOpts).validate:true,2nd arg (plusOpts).unquoteKeys:true,2nd arg (plusOpts).ignore:none,note:<b>simpleJSON.stringify()circularobjects</b>",\n'
	+ '    note: "<b>simple JSON.stringify() circular objects</b>\\n\\n1st <em>actual</em> argument set to Object created from json\\n1st <em>expected</em> argument set to input obj\\n<b>no Errors found</b>\\n2nd actual return argument set to <cite>returned lists</cite>\\n<em>test script set expected value for </em><cite>returned lists</cite>\\n<hr>JSON.stringify() info messages: 1 escaped_value\\n",\n'
	+ '    warn: "<img src=\\"../images/fn_16.png\\"><i>expected values changed by test script fn:</i>\\n1st arg (x)",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            a: "abc",\n'
	+ '            b: {\n'
	+ '                "@JSON_escapeMarker@": "$.actual.0.b=$.actual.0"\n'
	+ '            }\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            escaped_values: [\n'
	+ '                "$.b=[object Object]"\n'
	+ '            ]\n'
	+ '        },\n'
	+ '        results: "{\\n    a: \\"abc\\",\\n    b: {\\n        \\"@JSON_escapeMarker@\\": \\"$.b=$\\"\\n    }\\n}"\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        1: {\n'
	+ '            escaped_values: [\n'
	+ '                "$.b=[object Object]"\n'
	+ '            ]\n'
	+ '        },\n'
	+ '        results: "{\\n    a: \\"abc\\",\\n    b: {\\n        \\"@JSON_escapeMarker@\\": \\"$.b=$\\"\\n    }\\n}"\n'
	+ '    },\n'
	+ '    saveDateTime: "11-29-2016 01:13:52 am"\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 8,\n'
	+ '    id: "arg1=1st arg (x):[a,b],1st arg (x).a:abc,1st arg (x).b:{1st arg (x)},arg2=2nd arg (plusOpts):[clone,validate,unquoteKeys,ignore],2nd arg (plusOpts).clone:keep,2nd arg (plusOpts).validate:true,2nd arg (plusOpts).unquoteKeys:true,2nd arg (plusOpts).ignore:none,note:<b>simpleJSON.stringify()circularobjects</b>",\n'
	+ '    note: "<b>simple JSON.stringify() circular objects</b>\\n\\n1st <em>actual</em> argument set to Object created from json\\n1st <em>expected</em> argument set to input obj\\n<b>no Errors found</b>\\n2nd actual return argument set to <cite>returned lists</cite>\\n<em>test script set expected value for </em><cite>returned lists</cite>\\n<hr>JSON.stringify() info messages: 1 escaped_value\\n",\n'
	+ '    warn: "expected <cite>return value</cite> •not&nbsp;specified•\\n\\n•&nbsp;•&nbsp;•&nbsp;\\n<img src=\\"../images/fn_16.png\\"><i>expected values changed by test script fn:</i>\\n1st arg (x)",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            a: "abc",\n'
	+ '            b: {\n'
	+ '                "@JSON_escapeMarker@": "$.actual.0.b=$.actual.0"\n'
	+ '            }\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            escaped_values: [\n'
	+ '                "$.b=[object Object]"\n'
	+ '            ]\n'
	+ '        },\n'
	+ '        results: "{\\n    a: \\"abc\\",\\n    b: {\\n        \\"@JSON_escapeMarker@\\": \\"$.b=$\\"\\n    }\\n}"\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        1: {\n'
	+ '            escaped_values: [\n'
	+ '                "$.b=[object Object]"\n'
	+ '            ]\n'
	+ '        },\n'
	+ '        results: "{\\n    a: \\"abc\\",\\n    b: {\\n        \\"@JSON_escapeMarker@\\": \\"$.b=$\\"\\n    }\\n}"\n'
	+ '    },\n'
	+ '    saveDateTime: "11-29-2016 01:13:52 am"\n'
	+ '}'
]