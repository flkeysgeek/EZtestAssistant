EZ.test.savedResults=		//Saved @ 11-18-2016 06:30:20 pm
JSON.plus._temp=[
    {
        ok: true,
        testno: 1,
        id: "arg1=1st arg (obj):[a,b],1st arg (obj).a:1,1st arg (obj).b:[x,y],1st arg (obj).b.x:x-ray,1st arg (obj).b.y:99,arg2=2nd arg (lists_keys_quoted):[clone,validate,unquoteKeys],2nd arg (lists_keys_quoted).clone:keep,2nd arg (lists_keys_quoted).validate:true,2nd arg (lists_keys_quoted).unquoteKeys:false,note:<b>simplenon-circularJSON.stringify()</b>",
        note: "<b>simple non-circular JSON.stringify()</b>\n\n1st <em>actual</em> argument set to Object created from json\n1st <em>expected</em> argument set to input obj\n<b>no Errors found -- expected results set to actual</b>\n2nd actual return argument set to returned lists\n<hr>JSON.stringify() info messages: none",
        warn: "<i>expected values changed by test script fn:</i>\n1st arg (obj) \n\"return value\" x 2",
        actual: {
            0: {
                a: 1,
                b: {
                    x: "x-ray",
                    y: 99
                }
            },
            1: "no returned lists",
            results: "{\n    \"a\": 1,\n    \"b\": {\n        \"x\": \"x-ray\",\n        \"y\": 99\n    }\n}"
        },
        expected: {
            0: {
                a: 1,
                b: {
                    x: "x-ray",
                    y: 99
                }
            },
            1: "no returned lists",
            results: "{\n    \"a\": 1,\n    \"b\": {\n        \"x\": \"x-ray\",\n        \"y\": 99\n    }\n}"
        },
        saveDateTime: "11-18-2016 06:30:18 pm",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 2,
        id: "arg1=1st arg (obj):[a,b],1st arg (obj).a:1,1st arg (obj).b:[x,y],1st arg (obj).b.x:x-ray,1st arg (obj).b.y:99,arg2=2nd arg (JSON_stringify_LISTS):[clone,validate,unquoteKeys,circular,escape,info],2nd arg (JSON_stringify_LISTS).clone:keep,2nd arg (JSON_stringify_LISTS).validate:true,2nd arg (JSON_stringify_LISTS).unquoteKeys:true,2nd arg (JSON_stringify_LISTS).circular:true,2nd arg (JSON_stringify_LISTS).escape:Undefined, NaN, Date, RegExp, Array, Function, Element,2nd arg (JSON_stringify_LISTS).info:constructors, escaped_values, changed_values, functions, html_elements,note:<b>simplenon-circularJSON.stringify()</b>",
        note: "<b>simple non-circular JSON.stringify()</b>\n\n1st <em>actual</em> argument set to Object created from json\n1st <em>expected</em> argument set to input obj\n<b>no Errors found -- expected results set to actual</b>\n2nd actual return argument set to returned lists\n<hr>JSON.stringify() info messages: none",
        warn: "<i>expected values changed by test script fn:</i>\n1st arg (obj) \n\"return value\" x 2",
        actual: {
            0: {
                a: 1,
                b: {
                    x: "x-ray",
                    y: 99
                }
            },
            1: "no returned lists",
            results: "{\n    a: 1,\n    b: {\n        x: \"x-ray\",\n        y: 99\n    }\n}"
        },
        expected: {
            0: {
                a: 1,
                b: {
                    x: "x-ray",
                    y: 99
                }
            },
            1: "no returned lists",
            results: "{\n    a: 1,\n    b: {\n        x: \"x-ray\",\n        y: 99\n    }\n}"
        },
        saveDateTime: "11-18-2016 06:30:18 pm"
    },
    {
        ok: true,
        testno: 3,
        id: "arg1=1st arg (obj):[a,b,c,d],1st arg (obj).a:1,1st arg (obj).b:[x,y],1st arg (obj).b.x:x-ray,1st arg (obj).b.y:99,1st arg (obj).c:[0,1],1st arg (obj).c[0]:1,1st arg (obj).c[1]:cat,1st arg (obj).d:dog,arg2=2nd arg (lists_keys_quoted):[clone,validate,unquoteKeys],2nd arg (lists_keys_quoted).clone:keep,2nd arg (lists_keys_quoted).validate:true,2nd arg (lists_keys_quoted).unquoteKeys:false,note:<b>simplenon-circularJSON.stringify()</b>",
        note: "<b>simple non-circular JSON.stringify()</b>\n\n1st <em>actual</em> argument set to Object created from json\n1st <em>expected</em> argument set to input obj\n<b>no Errors found -- expected results set to actual</b>\n2nd actual return argument set to returned lists\n<hr>JSON.stringify() info messages: none",
        warn: "<i>expected values changed by test script fn:</i>\n1st arg (obj) \n\"return value\" x 2",
        actual: {
            0: {
                a: 1,
                b: {
                    x: "x-ray",
                    y: 99
                },
                c: [
                    1,
                    "cat"
                ],
                d: "dog"
            },
            1: "no returned lists",
            results: "{\n    \"a\": 1,\n    \"b\": {\n        \"x\": \"x-ray\",\n        \"y\": 99\n    },\n    \"c\": [\n        1,\n        \"cat\"\n    ],\n    \"d\": \"dog\"\n}"
        },
        expected: {
            0: {
                a: 1,
                b: {
                    x: "x-ray",
                    y: 99
                },
                c: [
                    1,
                    "cat"
                ],
                d: "dog"
            },
            1: "no returned lists",
            results: "{\n    \"a\": 1,\n    \"b\": {\n        \"x\": \"x-ray\",\n        \"y\": 99\n    },\n    \"c\": [\n        1,\n        \"cat\"\n    ],\n    \"d\": \"dog\"\n}"
        },
        saveDateTime: "11-18-2016 06:30:18 pm"
    },
    {
        ok: true,
        testno: 4,
        id: "arg1=1st arg (obj):[a,b,c,d],1st arg (obj).a:1,1st arg (obj).b:[x,y],1st arg (obj).b.x:x-ray,1st arg (obj).b.y:99,1st arg (obj).c:[0,1],1st arg (obj).c[0]:1,1st arg (obj).c[1]:cat,1st arg (obj).d:dog,arg2=2nd arg (JSON_stringify_LISTS):[clone,validate,unquoteKeys,circular,escape,info],2nd arg (JSON_stringify_LISTS).clone:keep,2nd arg (JSON_stringify_LISTS).validate:true,2nd arg (JSON_stringify_LISTS).unquoteKeys:true,2nd arg (JSON_stringify_LISTS).circular:true,2nd arg (JSON_stringify_LISTS).escape:Undefined, NaN, Date, RegExp, Array, Function, Element,2nd arg (JSON_stringify_LISTS).info:constructors, escaped_values, changed_values, functions, html_elements,note:<b>simplenon-circularJSON.stringify()</b>",
        note: "<b>simple non-circular JSON.stringify()</b>\n\n1st <em>actual</em> argument set to Object created from json\n1st <em>expected</em> argument set to input obj\n<b>no Errors found -- expected results set to actual</b>\n2nd actual return argument set to returned lists\n<hr>JSON.stringify() info messages: none",
        warn: "<i>expected values changed by test script fn:</i>\n1st arg (obj) \n\"return value\" x 2",
        actual: {
            0: {
                a: 1,
                b: {
                    x: "x-ray",
                    y: 99
                },
                c: [
                    1,
                    "cat"
                ],
                d: "dog"
            },
            1: "no returned lists",
            results: "{\n    a: 1,\n    b: {\n        x: \"x-ray\",\n        y: 99\n    },\n    c: [\n        1,\n        \"cat\"\n    ],\n    d: \"dog\"\n}"
        },
        expected: {
            0: {
                a: 1,
                b: {
                    x: "x-ray",
                    y: 99
                },
                c: [
                    1,
                    "cat"
                ],
                d: "dog"
            },
            1: "no returned lists",
            results: "{\n    a: 1,\n    b: {\n        x: \"x-ray\",\n        y: 99\n    },\n    c: [\n        1,\n        \"cat\"\n    ],\n    d: \"dog\"\n}"
        },
        saveDateTime: "11-18-2016 06:30:19 pm"
    },
    {
        ok: true,
        testno: 5,
        id: "arg1=1st arg (x):[a,b],1st arg (x).a:abc,1st arg (x).b:[key],1st arg (x).b.key:99,arg2=2nd arg (JSON_stringify_LISTS):[clone,validate,unquoteKeys,circular,escape,info],2nd arg (JSON_stringify_LISTS).clone:keep,2nd arg (JSON_stringify_LISTS).validate:true,2nd arg (JSON_stringify_LISTS).unquoteKeys:true,2nd arg (JSON_stringify_LISTS).circular:true,2nd arg (JSON_stringify_LISTS).escape:Undefined, NaN, Date, RegExp, Array, Function, Element,2nd arg (JSON_stringify_LISTS).info:constructors, escaped_values, changed_values, functions, html_elements,note:<b>simplenon-circularJSON.stringify()</b>",
        note: "<b>simple non-circular JSON.stringify()</b>\n\n1st <em>actual</em> argument set to Object created from json\n1st <em>expected</em> argument set to input obj\n<b>no Errors found -- expected results set to actual</b>\n2nd actual return argument set to returned lists\n<hr>JSON.stringify() info messages: none",
        warn: "<i>expected values changed by test script fn:</i>\n1st arg (x) \n\"return value\" x 2",
        actual: {
            0: {
                a: "abc",
                b: {
                    key: 99
                }
            },
            1: "no returned lists",
            results: "{\n    a: \"abc\",\n    b: {\n        key: 99\n    }\n}"
        },
        expected: {
            0: {
                a: "abc",
                b: {
                    key: 99
                }
            },
            1: "no returned lists",
            results: "{\n    a: \"abc\",\n    b: {\n        key: 99\n    }\n}"
        },
        saveDateTime: "11-18-2016 06:30:19 pm"
    },
    {
        ok: true,
        testno: 6,
        id: "arg1=1st arg (x):[a,b],1st arg (x).a:abc,1st arg (x).b:{1st arg (x)},arg2=2nd arg (lists_keys_quoted):[clone,validate,unquoteKeys],2nd arg (lists_keys_quoted).clone:keep,2nd arg (lists_keys_quoted).validate:true,2nd arg (lists_keys_quoted).unquoteKeys:false,note:<b>simpleJSON.stringify()circularobjects</b>circularobj[$.b]deleted",
        note: "<b>simple JSON.stringify() circular objects</b>\ncircular obj [$.b] deleted\n1st <em>actual</em> argument set to Object created from json\n<hr><em>JSON.stringify() messages:</em>\nJSON.plus.validate() failed\n1 deleted_value\n4 validate_details\n2nd actual return argument set to returned lists\n<em>Object created from json NOT same as input obj</em>\n<hr>JSON.stringify() info messages: none",
        warn: "",
        actual: {
            0: {
                a: "abc"
            },
            1: {
                deleted_values: [
                    "$.b"
                ],
                validate_details: [
                    "[Object] ... [Object]",
                    "*keys do not match*",
                    "+b:      ... -       ",
                    "[Object] !== [Object]"
                ]
            },
            results: "{\n    \"a\": \"abc\"\n}"
        },
        expected: {
            0: {
                a: "abc"
            },
            1: {
                deleted_values: [
                    "$.b"
                ],
                validate_details: [
                    "[Object] ... [Object]",
                    "*keys do not match*",
                    "+b:      ... -       ",
                    "[Object] !== [Object]"
                ]
            },
            results: "{\n    \"a\": \"abc\"\n}"
        },
        saveDateTime: "11-18-2016 06:30:19 pm"
    },
    {
        ok: true,
        testno: 7,
        id: "arg1=1st arg (x):[a,b],1st arg (x).a:abc,1st arg (x).b:{1st arg (x)},arg2=2nd arg (JSON_stringify_LISTS):[clone,validate,unquoteKeys,circular,escape,info],2nd arg (JSON_stringify_LISTS).clone:keep,2nd arg (JSON_stringify_LISTS).validate:true,2nd arg (JSON_stringify_LISTS).unquoteKeys:true,2nd arg (JSON_stringify_LISTS).circular:true,2nd arg (JSON_stringify_LISTS).escape:Undefined, NaN, Date, RegExp, Array, Function, Element,2nd arg (JSON_stringify_LISTS).info:constructors, escaped_values, changed_values, functions, html_elements,note:<b>simpleJSON.stringify()circularobjects</b>",
        note: "<b>simple JSON.stringify() circular objects</b>\n\n1st <em>actual</em> argument set to Object created from json\n1st <em>expected</em> argument set to input obj\n<b>no Errors found -- expected results set to actual</b>\n2nd actual return argument set to returned lists\n<hr>JSON.stringify() info messages: 1 escaped_value\n",
        warn: "<i>expected values changed by test script fn:</i>\n1st arg (x) \n\"return value\" x 2",
        actual: {
            0: {
                a: "abc",
                b: {
                    "@JSON_escapeMarker@": "$.6.actual.0.b=$.6.actual.0"
                }
            },
            1: {
                escaped_values: [
                    "$.b=$"
                ]
            },
            results: "{\n    a: \"abc\",\n    b: {\n        \"@JSON_escapeMarker@\": \"$.b=$\"\n    }\n}"
        },
        expected: {
            0: {
                a: "abc",
                b: {
                    "@JSON_escapeMarker@": "$.6.expected.0.b=$.6.expected.0"
                }
            },
            1: {
                "@JSON_escapeMarker@": "$.6.expected.1=$.6.actual.1"
            },
            results: "{\n    a: \"abc\",\n    b: {\n        \"@JSON_escapeMarker@\": \"$.b=$\"\n    }\n}"
        },
        saveDateTime: "11-18-2016 06:30:19 pm"
    },
    {
        ok: true,
        testno: 8,
        id: "arg1=1st arg (obj):[a,b,c,d],1st arg (obj).a:1,1st arg (obj).b:[x,y],1st arg (obj).b.x:x-ray,1st arg (obj).b.y:99,1st arg (obj).c:[0,1],1st arg (obj).c[0]:1,1st arg (obj).c[1]:cat,1st arg (obj).d:{1st arg (obj).c},arg2=2nd arg (JSON_stringify_LISTS):[clone,validate,unquoteKeys,circular,escape,info],2nd arg (JSON_stringify_LISTS).clone:keep,2nd arg (JSON_stringify_LISTS).validate:true,2nd arg (JSON_stringify_LISTS).unquoteKeys:true,2nd arg (JSON_stringify_LISTS).circular:true,2nd arg (JSON_stringify_LISTS).escape:Undefined, NaN, Date, RegExp, Array, Function, Element,2nd arg (JSON_stringify_LISTS).info:constructors, escaped_values, changed_values, functions, html_elements,note:<b>simpleJSON.stringify()circularobjects</b>",
        note: "<b>simple JSON.stringify() circular objects</b>\n\n1st <em>actual</em> argument set to Object created from json\n1st <em>expected</em> argument set to input obj\n<b>no Errors found -- expected results set to actual</b>\n2nd actual return argument set to returned lists\n<hr>JSON.stringify() info messages: 1 escaped_value\n",
        warn: "<i>expected values changed by test script fn:</i>\n1st arg (obj) \n\"return value\" x 2",
        actual: {
            0: {
                a: 1,
                b: {
                    x: "x-ray",
                    y: 99
                },
                c: [
                    1,
                    "cat"
                ],
                d: [
                    "@JSON_escapeMarker@:$.7.actual.0.d=$.7.actual.0.c"
                ]
            },
            1: {
                escaped_values: [
                    "$.d=$.c"
                ]
            },
            results: "{\n    a: 1,\n    b: {\n        x: \"x-ray\",\n        y: 99\n    },\n    c: [\n        1,\n        \"cat\"\n    ],\n    d: [\n        \"@JSON_escapeMarker@:$.d=$.c\"\n    ]\n}"
        },
        expected: {
            0: {
                a: 1,
                b: {
                    x: "x-ray",
                    y: 99
                },
                c: [
                    1,
                    "cat"
                ],
                d: [
                    "@JSON_escapeMarker@:$.7.expected.0.d=$.7.expected.0.c"
                ]
            },
            1: {
                "@JSON_escapeMarker@": "$.7.expected.1=$.7.actual.1"
            },
            results: "{\n    a: 1,\n    b: {\n        x: \"x-ray\",\n        y: 99\n    },\n    c: [\n        1,\n        \"cat\"\n    ],\n    d: [\n        \"@JSON_escapeMarker@:$.d=$.c\"\n    ]\n}"
        },
        saveDateTime: "11-18-2016 06:30:19 pm"
    },
    {
        ok: true,
        testno: 9,
        id: "arg1=1st arg (obj):[a,b,c,d],1st arg (obj).a:1,1st arg (obj).b:[x,y],1st arg (obj).b.x:x-ray,1st arg (obj).b.y:{1st arg (obj)},1st arg (obj).c:[0,1],1st arg (obj).c[0]:1,1st arg (obj).c[1]:cat,1st arg (obj).d:{1st arg (obj).c},arg2=2nd arg (JSON_stringify_LISTS):[clone,validate,unquoteKeys,circular,escape,info],2nd arg (JSON_stringify_LISTS).clone:keep,2nd arg (JSON_stringify_LISTS).validate:true,2nd arg (JSON_stringify_LISTS).unquoteKeys:true,2nd arg (JSON_stringify_LISTS).circular:true,2nd arg (JSON_stringify_LISTS).escape:Undefined, NaN, Date, RegExp, Array, Function, Element,2nd arg (JSON_stringify_LISTS).info:constructors, escaped_values, changed_values, functions, html_elements,note:<b>simpleJSON.stringify()circularobjects</b>",
        note: "<b>simple JSON.stringify() circular objects</b>\n\n1st <em>actual</em> argument set to Object created from json\n1st <em>expected</em> argument set to input obj\n<b>no Errors found -- expected results set to actual</b>\n2nd actual return argument set to returned lists\n<hr>JSON.stringify() info messages: 2 escaped_values\n",
        warn: "<i>expected values changed by test script fn:</i>\n1st arg (obj) \n\"return value\" x 2",
        actual: {
            0: {
                a: 1,
                b: {
                    x: "x-ray",
                    y: {
                        "@JSON_escapeMarker@": "$.8.actual.0.b.y=$.8.actual.0"
                    }
                },
                c: [
                    1,
                    "cat"
                ],
                d: [
                    "@JSON_escapeMarker@:$.8.actual.0.d=$.8.actual.0.c"
                ]
            },
            1: {
                escaped_values: [
                    "$.b.y=$",
                    "$.d=$.c"
                ]
            },
            results: "{\n    a: 1,\n    b: {\n        x: \"x-ray\",\n        y: {\n            \"@JSON_escapeMarker@\": \"$.b.y=$\"\n        }\n    },\n    c: [\n        1,\n        \"cat\"\n    ],\n    d: [\n        \"@JSON_escapeMarker@:$.d=$.c\"\n    ]\n}"
        },
        expected: {
            0: {
                a: 1,
                b: {
                    x: "x-ray",
                    y: {
                        "@JSON_escapeMarker@": "$.8.expected.0.b.y=$.8.expected.0"
                    }
                },
                c: [
                    1,
                    "cat"
                ],
                d: [
                    "@JSON_escapeMarker@:$.8.expected.0.d=$.8.expected.0.c"
                ]
            },
            1: {
                "@JSON_escapeMarker@": "$.8.expected.1=$.8.actual.1"
            },
            results: "{\n    a: 1,\n    b: {\n        x: \"x-ray\",\n        y: {\n            \"@JSON_escapeMarker@\": \"$.b.y=$\"\n        }\n    },\n    c: [\n        1,\n        \"cat\"\n    ],\n    d: [\n        \"@JSON_escapeMarker@:$.d=$.c\"\n    ]\n}"
        },
        saveDateTime: "11-18-2016 06:30:19 pm"
    },
    {
        ok: true,
        testno: 10,
        id: "arg1=1st arg (obj):[a,b],1st arg (obj).a:1,1st arg (obj).b:[0,1,2],1st arg (obj).b[0]:0,1st arg (obj).b[1]:1,1st arg (obj).b[2]:{1st arg (obj)},arg2=2nd arg (JSON_stringify_LISTS):[clone,validate,unquoteKeys,circular,escape,info],2nd arg (JSON_stringify_LISTS).clone:keep,2nd arg (JSON_stringify_LISTS).validate:true,2nd arg (JSON_stringify_LISTS).unquoteKeys:true,2nd arg (JSON_stringify_LISTS).circular:true,2nd arg (JSON_stringify_LISTS).escape:Undefined, NaN, Date, RegExp, Array, Function, Element,2nd arg (JSON_stringify_LISTS).info:constructors, escaped_values, changed_values, functions, html_elements,note:<b>simpleJSON.stringify()circularobjects</b>",
        note: "<b>simple JSON.stringify() circular objects</b>\n\n1st <em>actual</em> argument set to Object created from json\n1st <em>expected</em> argument set to input obj\n<b>no Errors found -- expected results set to actual</b>\n2nd actual return argument set to returned lists\n<hr>JSON.stringify() info messages: 1 escaped_value\n",
        warn: "<i>expected values changed by test script fn:</i>\n1st arg (obj) \n\"return value\" x 2",
        actual: {
            0: {
                a: 1,
                b: [
                    0,
                    1,
                    {
                        "@JSON_escapeMarker@": "$.9.actual.0.b.2=$.9.actual.0"
                    }
                ]
            },
            1: {
                escaped_values: [
                    "$.b.2=$"
                ]
            },
            results: "{\n    a: 1,\n    b: [\n        0,\n        1,\n        {\n            \"@JSON_escapeMarker@\": \"$.b.2=$\"\n        }\n    ]\n}"
        },
        expected: {
            0: {
                a: 1,
                b: [
                    0,
                    1,
                    {
                        "@JSON_escapeMarker@": "$.9.expected.0.b.2=$.9.expected.0"
                    }
                ]
            },
            1: {
                "@JSON_escapeMarker@": "$.9.expected.1=$.9.actual.1"
            },
            results: "{\n    a: 1,\n    b: [\n        0,\n        1,\n        {\n            \"@JSON_escapeMarker@\": \"$.b.2=$\"\n        }\n    ]\n}"
        },
        saveDateTime: "11-18-2016 06:30:20 pm"
    },
    {
        ok: true,
        testno: 11,
        id: "arg1=1st arg (obj):[],arg2=2nd arg (JSON_stringify_LISTS):[clone,validate,unquoteKeys,circular,escape,info],2nd arg (JSON_stringify_LISTS).clone:keep,2nd arg (JSON_stringify_LISTS).validate:true,2nd arg (JSON_stringify_LISTS).unquoteKeys:true,2nd arg (JSON_stringify_LISTS).circular:true,2nd arg (JSON_stringify_LISTS).escape:Undefined, NaN, Date, RegExp, Array, Function, Element,2nd arg (JSON_stringify_LISTS).info:constructors, escaped_values, changed_values, functions, html_elements,note:<b>simpleJSON.stringify()circularobjects</b>",
        note: "<b>simple JSON.stringify() circular objects</b>\n\n1st <em>actual</em> argument set to Object created from json\n1st <em>expected</em> argument set to input obj\n<b>no Errors found -- expected results set to actual</b>\n2nd actual return argument set to returned lists\n<hr>JSON.stringify() info messages: none",
        warn: "<i>expected values changed by test script fn:</i>\n1st arg (obj) \n\"return value\" x 2",
        actual: {
            0: [],
            1: "no returned lists",
            results: "[]"
        },
        expected: {
            0: [],
            1: "no returned lists",
            results: "[]"
        },
        saveDateTime: "11-18-2016 06:30:20 pm"
    }
];JSON.plus.unescape(JSON.plus._temp);