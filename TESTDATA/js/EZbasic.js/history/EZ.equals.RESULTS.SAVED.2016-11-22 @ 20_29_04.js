EZ.test.savedResults=		//Saved @ 11-22-2016 08:29:04 pm
JSON.plus._temp=[
    {
        ok: true,
        testno: 1,
        id: "arg1=1st arg (x):[a,b],1st arg (x).a:1,1st arg (x).b:2,arg2=2nd arg (y):[a,b],2nd arg (y).a:0,2nd arg (y).b:,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>showDifftests:</b>easytest",
        note: "<b>showDiff tests:</b> easy test\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                a: 1,
                b: 2
            },
            1: {
                a: 0,
                b: ""
            },
            2: [
                "1st [Object] \t ... 2nd [Object]",
                "  .a: 1 \t !== 0",
                "  .b: 2 \t !== •empty string•"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.0.expected.2=$.0.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:35 pm"
    },
    {
        ok: true,
        testno: 2,
        id: "arg1=1st arg (x):[a,b],1st arg (x).a:1,1st arg (x).b:2,arg2=2nd arg (y):[a,b],2nd arg (y).a:0,2nd arg (y).b:,arg3=3rd arg (options):[showDiff,neq],3rd arg (options).showDiff:true,3rd arg (options).neq:is,note:<b>showDifftests:</b>easytestoptions.neq=\"not\"",
        note: "<b>showDiff tests:</b> easy test options.neq = \"not\"\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                a: 1,
                b: 2
            },
            1: {
                a: 0,
                b: ""
            },
            2: [
                "1st [Object] \t .. 2nd [Object]",
                "  .a: 1 \t is 0",
                "  .b: 2 \t is •empty string•"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.1.expected.2=$.1.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:36 pm"
    },
    {
        ok: true,
        testno: 3,
        id: "arg1=1st arg (x):[a,b],1st arg (x).a:1,1st arg (x).b:2,arg2=2nd arg (y):[a,b],2nd arg (y).a:0,2nd arg (y).b:,arg3=3rd arg (options):[],note:<b>showDifftests:</b>noshowDiffoption",
        note: "<b>showDiff tests:</b> no showDiff option\nshowDiff not specified",
        warn: "",
        actual: {
            0: {
                a: 1,
                b: 2
            },
            1: {
                a: 0,
                b: ""
            },
            2: {},
            results: false
        },
        expected: {
            results: false
        },
        saveDateTime: "11-22-2016 08:28:36 pm"
    },
    {
        ok: true,
        testno: 4,
        id: "arg1=1st arg (x):[a,b],1st arg (x).a:1,1st arg (x).b:2,arg2=2nd arg (y):[a,b],2nd arg (y).a:0,2nd arg (y).b:,note:<b>showDifftests:</b>nortnValue",
        note: "<b>showDiff tests:</b> no rtnValue\nshowDiff not specified",
        warn: "",
        actual: {
            0: {
                a: 1,
                b: 2
            },
            1: {
                a: 0,
                b: ""
            },
            results: false
        },
        expected: {
            results: false
        },
        saveDateTime: "11-22-2016 08:28:36 pm"
    },
    {
        ok: true,
        testno: 5,
        id: "arg1=1st arg (x):[a,b],1st arg (x).a:1,1st arg (x).b:2,arg2=2nd arg (y):[a,b],2nd arg (y).a:0,2nd arg (y).b:,arg3=3rd arg (options):6,note:<b>showDifftests:</b>showDifftrueforNumberbutnortnValue",
        note: "<b>showDiff tests:</b> showDiff true for Number but no rtnValue\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                a: 1,
                b: 2
            },
            1: {
                a: 0,
                b: ""
            },
            2: [
                "1st [Object] \t ... 2nd [Object]",
                "  .a: 1 \t !== 0",
                "  .b: 2 \t !== •empty string•"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.4.expected.2=$.4.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:36 pm"
    },
    {
        ok: true,
        testno: 6,
        id: "arg1=1st arg (x):[numbers],1st arg (x).numbers:[0,1],1st arg (x).numbers[0]:0,1st arg (x).numbers[1]:1,arg2=2nd arg (y):[numbers],2nd arg (y).numbers:[0],2nd arg (y).numbers[0]:0,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>showDifftests:</b>diffarraylength",
        note: "<b>showDiff tests:</b> diff array length\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                numbers: [
                    0,
                    1
                ]
            },
            1: {
                numbers: [
                    0
                ]
            },
            2: [
                "1st [Object] \t ... 2nd [Object]",
                "  .numbers *keys do not match*",
                "   +{1:} \t ... na",
                "  .numbers: [ObjectLike] \t !== [ObjectLike]"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.5.expected.2=$.5.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:37 pm"
    },
    {
        ok: true,
        testno: 7,
        id: "arg1=1st arg (x):[0,1],1st arg (x)[0]:0,1st arg (x)[1]:1,arg2=2nd arg (y):[0],2nd arg (y)[0]:0,arg3=3rd arg (options):[showDiff],3rd arg (options).showDiff:true,note:<b>showDifftests:</b>diffarraylength",
        note: "<b>showDiff tests:</b> diff array length\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: [
                0,
                1
            ],
            1: [
                0
            ],
            2: [
                "1st [ObjectLike] \t ... 2nd [Array]",
                "   *keys do not match*",
                "   +{1:} \t ... na",
                "[ObjectLike] \t !== [ObjectLike]"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.6.expected.2=$.6.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:37 pm"
    },
    {
        ok: true,
        testno: 8,
        id: "arg1=1st arg (x):[a,b,c],1st arg (x).a:[0],1st arg (x).a[0]:0,1st arg (x).b:2,1st arg (x).c:false,arg2=2nd arg (y):[b,c,a],2nd arg (y).b:2,2nd arg (y).c:false,2nd arg (y).a:[0],2nd arg (y).a[0]:0,arg3=3rd arg (options):[showDiff,keys],3rd arg (options).showDiff:true,3rd arg (options).keys:sameorder,note:<b>showDifftests:</b>keysnotinsameorder",
        note: "<b>showDiff tests:</b> keys not in same order\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                a: [
                    0
                ],
                b: 2,
                c: false
            },
            1: {
                b: 2,
                c: false,
                a: [
                    0
                ]
            },
            2: [
                "1st [Object] \t ... 2nd [Object]",
                "   *keys diff order*",
                "   {a:} \t ... {b:}",
                "   {b:} \t ... {c:}",
                "   {c:} \t ... {a:}",
                "[Object] \t !== [Object]"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.7.expected.2=$.7.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:37 pm"
    },
    {
        ok: true,
        testno: 9,
        id: "arg1=1st arg (x):[b,c,a],1st arg (x).b:2,1st arg (x).c:\r,1st arg (x).a:[0],1st arg (x).a[0]:0,arg2=2nd arg (y):[b,c,d,a,],2nd arg (y).b:2,2nd arg (y).c:false,2nd arg (y).d:4,2nd arg (y).a:[0],2nd arg (y).a[0]:0,2nd arg (y)[]:,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>showDifftests:</b>",
        note: "<b>showDiff tests:</b> \n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                b: 2,
                c: "\r",
                a: [
                    0
                ]
            },
            1: {
                b: "2",
                c: false,
                d: 4,
                a: [
                    0
                ],
                "": ""
            },
            2: [
                "1st [Object] \t ... 2nd [Object]",
                "   *keys do not match*",
                "   na \t ... +{\"\":}",
                "   na \t ... +{d:}",
                "[Object] \t !== [Object]"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.8.expected.2=$.8.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:38 pm"
    },
    {
        ok: true,
        testno: 10,
        id: "arg1=1st arg (x):[o],1st arg (x).o:{},arg2=2nd arg (y):[o],2nd arg (y).o:[],arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>showDifftests:</b>",
        note: "<b>showDiff tests:</b> \n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                o: "{}"
            },
            1: {
                o: {}
            },
            2: [
                "1st [Object] \t ... 2nd [Object]",
                "  .o: \"{}\" \t !== [Object]"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.9.expected.2=$.9.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:38 pm"
    },
    {
        ok: true,
        testno: 11,
        id: "arg1=1st arg (x):[1,,a,b,aa],1st arg (x)[1]:1,1st arg (x)[]:1,1st arg (x).a:1,1st arg (x).b:2,1st arg (x).aa:[0,1],1st arg (x).aa[0]:0,1st arg (x).aa[1]:1,arg2=2nd arg (y):[0,1,b,c,aa],2nd arg (y)[0]:1,2nd arg (y)[1]:1,2nd arg (y).b:2,2nd arg (y).c:3,2nd arg (y).aa:[0],2nd arg (y).aa[0]:0,arg3=3rd arg (options):true,note:<b>showDifftests:</b>",
        note: "<b>showDiff tests:</b> \n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                1: 1,
                "": 1,
                a: 1,
                b: 2,
                aa: [
                    0,
                    1
                ]
            },
            1: {
                0: 1,
                1: 1,
                b: 2,
                c: 3,
                aa: [
                    0
                ]
            },
            2: [
                "1st [Object] \t ... 2nd [Object]",
                "   *keys do not match*",
                "   +{\"\":} \t ... +{0:}",
                "   +{a:} \t ... +{c:}",
                "[Object] \t !== [Object]"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.10.expected.2=$.10.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:38 pm"
    },
    {
        ok: true,
        testno: 12,
        id: "arg1=1st arg (x):[a,b],1st arg (x).a:1,1st arg (x).b:{1st arg (x)},arg2=2nd arg (y):[a,b],2nd arg (y).a:1,2nd arg (y).b:{2nd arg (y)},note:<b>CircularObjects:</b>simple",
        note: "<b>Circular Objects:</b> simple",
        warn: "",
        actual: {
            0: {
                a: 1
            },
            1: {
                a: 1
            },
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:39 pm"
    },
    {
        ok: true,
        testno: 13,
        id: "arg1=1st arg (x):[2,11,b,a],1st arg (x)[2]:1st,1st arg (x)[11]:2nd,1st arg (x).b:4th,1st arg (x).a:3rd,arg2=2nd arg (y):[2,11,a,b],2nd arg (y)[2]:1st,2nd arg (y)[11]:2nd,2nd arg (y).a:3rd,2nd arg (y).b:4th,arg3=3rd arg (options):[showDiff,console],3rd arg (options).showDiff:true,3rd arg (options).console:true,note:<b>CustomObject:EZoptions-->Object:</b>diffconstructor--NOTingored",
        note: "<b>Custom Object: EZoptions --> Object:</b> diff constructor -- NOT ingored\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                2: "1st",
                11: "2nd",
                b: "4th",
                a: "3rd"
            },
            1: {
                2: "1st",
                11: "2nd",
                a: "3rd",
                b: "4th"
            },
            2: [
                "1st [EZoptions] \t ... 2nd [Object]",
                "[EZoptions] \t !== [Object]"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.12.expected.2=$.12.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:39 pm"
    },
    {
        ok: true,
        testno: 14,
        id: "arg1=1st arg (x):[2,11,b,a],1st arg (x)[2]:1st,1st arg (x)[11]:2nd,1st arg (x).b:4th,1st arg (x).a:3rd,arg2=2nd arg (y):[2,11,a,b],2nd arg (y)[2]:1st,2nd arg (y)[11]:2nd,2nd arg (y).a:3rd,2nd arg (y).b:4th,arg3=3rd arg (options):[showDiff,console,ignore],3rd arg (options).showDiff:true,3rd arg (options).console:true,3rd arg (options).ignore:objectType,note:<b>CustomObject:EZoptions-->Object:</b>diffconstructor--butingored",
        note: "<b>Custom Object: EZoptions --> Object:</b> diff constructor -- but ingored",
        warn: "",
        actual: {
            0: {
                2: "1st",
                11: "2nd",
                b: "4th",
                a: "3rd"
            },
            1: {
                2: "1st",
                11: "2nd",
                a: "3rd",
                b: "4th"
            },
            2: {
                showDiff: true,
                console: true,
                ignore: "objectType"
            },
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:39 pm"
    },
    {
        ok: true,
        testno: 15,
        id: "arg1=1st arg (x):[0,1],1st arg (x)[0]:0,1st arg (x)[1]:1,arg2=2nd arg (y):[0,1,length],2nd arg (y)[0]:0,2nd arg (y)[1]:1,2nd arg (y).length:2,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>testArrayLike/ObjectLike:</b>xisarray--yisArrayLike--samekeysandvalues",
        note: "<b>test ArrayLike / ObjectLike:</b> x is array -- y is ArrayLike -- same keys and values\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: [
                0,
                1
            ],
            1: {
                0: 0,
                1: 1,
                length: 2
            },
            2: [
                "1st [ObjectLike] \t ... 2nd [Object]",
                " \t !== [Object]"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.14.expected.2=$.14.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:40 pm"
    },
    {
        ok: true,
        testno: 16,
        id: "arg1=1st arg (x):[0,1],1st arg (x)[0]:0,1st arg (x)[1]:1,arg2=2nd arg (y):[0,1],2nd arg (y)[0]:0,2nd arg (y)[1]:1,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>testArrayLike/ObjectLike:</b>x&ybothsameArray",
        note: "<b>test ArrayLike / ObjectLike:</b> x & y both same Array",
        warn: "",
        actual: {
            0: [
                0,
                1
            ],
            1: [
                0,
                1
            ],
            2: {
                showDiff: true
            },
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:40 pm"
    },
    {
        ok: true,
        testno: 17,
        id: "arg1=1st arg (x):[0,1],1st arg (x)[0]:0,1st arg (x)[1]:1,arg2=2nd arg (y):[0,1],2nd arg (y)[0]:0,2nd arg (y)[1]:1,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>testArrayLike/ObjectLike:</b>x&ydiffArrayswithsameindexes&values",
        note: "<b>test ArrayLike / ObjectLike:</b> x & y diff Arrays with same indexes & values",
        warn: "",
        actual: {
            0: [
                0,
                1
            ],
            1: [
                0,
                1
            ],
            2: {
                showDiff: true
            },
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:40 pm"
    },
    {
        ok: true,
        testno: 18,
        id: "arg1=1st arg (x):[0,1],1st arg (x)[0]:0,1st arg (x)[1]:1,arg2=2nd arg (y):[0,1],2nd arg (y)[0]:0,2nd arg (y)[1]:999,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>testArrayLike/ObjectLike:</b>x&ydiffArrayswithsameindexesbutdiffvalues",
        note: "<b>test ArrayLike / ObjectLike:</b> x & y diff Arrays with same indexes but diff values\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: [
                0,
                1
            ],
            1: [
                0,
                999
            ],
            2: [
                "1st [ObjectLike] \t ... 2nd [Array]",
                "  [1]: 1 \t !== 999"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.17.expected.2=$.17.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:40 pm"
    },
    {
        ok: true,
        testno: 19,
        id: "arg1=1st arg (x):[0,1],1st arg (x)[0]:0,1st arg (x)[1]:1,arg2=2nd arg (y):[0],2nd arg (y)[0]:0,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>testArrayLike/ObjectLike:</b>x&ydiffArrayswithdiffindexes",
        note: "<b>test ArrayLike / ObjectLike:</b> x & y diff Arrays with diff indexes\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: [
                0,
                1
            ],
            1: [
                0
            ],
            2: [
                "1st [ObjectLike] \t ... 2nd [Array]",
                "   *keys do not match*",
                "   +{1:} \t ... na",
                "[ObjectLike] \t !== [ObjectLike]"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.18.expected.2=$.18.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:41 pm"
    },
    {
        ok: true,
        testno: 20,
        id: "arg1=1st arg (x):[0,1,extra],1st arg (x)[0]:0,1st arg (x)[1]:1,1st arg (x).extra:xyz,arg2=2nd arg (y):[0,1,extra],2nd arg (y)[0]:0,2nd arg (y)[1]:1,2nd arg (y).extra:xyz,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>testArrayLike/ObjectLike:</b>x&ydiffArrayswithnamedkeyofextrawithsamevalue",
        note: "<b>test ArrayLike / ObjectLike:</b> x & y diff Arrays with named key of extra with same value",
        warn: "",
        actual: {
            0: [
                0,
                1,
                {
                    "@JSON_escapeMarker@": "$.19.actual.0",
                    extra: "xyz"
                }
            ],
            1: [
                0,
                1,
                {
                    "@JSON_escapeMarker@": "$.19.actual.0.1",
                    extra: "xyz"
                }
            ],
            2: {
                showDiff: true
            },
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:41 pm"
    },
    {
        ok: true,
        testno: 21,
        id: "arg1=1st arg (x):[0,1,extra],1st arg (x)[0]:0,1st arg (x)[1]:1,1st arg (x).extra:abc,arg2=2nd arg (y):[0,1,extra],2nd arg (y)[0]:0,2nd arg (y)[1]:1,2nd arg (y).extra:xyz,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>testArrayLike/ObjectLike:</b>x&ydiffArrayswithnamedkeyofextrawithdiffvalue",
        note: "<b>test ArrayLike / ObjectLike:</b> x & y diff Arrays with named key of extra with diff value\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: [
                0,
                1,
                {
                    "@JSON_escapeMarker@": "$.19.actual.20.actual.0",
                    extra: "abc"
                }
            ],
            1: [
                0,
                1,
                {
                    "@JSON_escapeMarker@": "$.19.actual.20.actual.0.1",
                    extra: "xyz"
                }
            ],
            2: [
                "1st [ObjectLike] \t ... 2nd [Array]",
                "  .extra: \"abc\" \t !== \"xyz\""
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.19.actual.20.actual.expected.2=$.19.actual.20.actual.0.1.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:41 pm"
    },
    {
        ok: true,
        testno: 22,
        id: "arg1=1st arg (x):[0,1,extra],1st arg (x)[0]:0,1st arg (x)[1]:1,1st arg (x).extra:abc,arg2=2nd arg (y):[0,1],2nd arg (y)[0]:0,2nd arg (y)[1]:1,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>testArrayLike/ObjectLike:</b>x&ysaveArrayvalues--x.extra=\"abc\"ydoesnothaveextra",
        note: "<b>test ArrayLike / ObjectLike:</b> x & y save Array values -- x.extra=\"abc\" y does not have extra\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: [
                0,
                1,
                {
                    "@JSON_escapeMarker@": "$.19.actual.20.actual.21.actual.0",
                    extra: "abc"
                }
            ],
            1: [
                0,
                1
            ],
            2: [
                "1st [ObjectLike] \t ... 2nd [Array]",
                "   *keys do not match*",
                "   +{extra:} \t ... na",
                "[ObjectLike] \t !== [ObjectLike]"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.19.actual.20.actual.21.actual.expected.2=$.19.actual.20.actual.21.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:42 pm"
    },
    {
        ok: true,
        testno: 23,
        id: "arg1=1st arg (x):[0,1],1st arg (x)[0]:0,1st arg (x)[1]:1,arg2=2nd arg (y):[0,1,extra],2nd arg (y)[0]:0,2nd arg (y)[1]:1,2nd arg (y).extra:xyz,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>testArrayLike/ObjectLike:</b>x&ysaveArrayvalues--xdoesnothaveextray.extra=\"xyz\"",
        note: "<b>test ArrayLike / ObjectLike:</b> x & y save Array values -- x does not have extra y.extra=\"xyz\"\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: [
                0,
                1
            ],
            1: [
                0,
                1,
                {
                    "@JSON_escapeMarker@": "$.19.actual.20.actual.21.actual.22.actual.1",
                    extra: "xyz"
                }
            ],
            2: [
                "1st [ObjectLike] \t ... 2nd [Array]",
                "   *keys do not match*",
                "   na \t ... +{extra:}",
                "[ObjectLike] \t !== [ObjectLike]"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.19.actual.20.actual.21.actual.22.actual.expected.2=$.19.actual.20.actual.21.actual.22.actual.1.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:42 pm"
    },
    {
        ok: true,
        testno: 24,
        id: "arg1=1st arg (x):[argsOk,obj,o,used],1st arg (x).argsOk:true,1st arg (x).obj:[a,b],1st arg (x).obj.a:1,1st arg (x).obj.b:2,1st arg (x).o:{1st arg (x).obj},1st arg (x).used:true,arg2=2nd arg (y):[argsOk,obj,o,used],2nd arg (y).argsOk:true,2nd arg (y).obj:[a,b],2nd arg (y).obj.a:1,2nd arg (y).obj.b:2,2nd arg (y).o:[a,b],2nd arg (y).o.a:1,2nd arg (y).o.b:2,2nd arg (y).used:true,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>testArrayLike/ObjectLike:</b>diffobjbutsamekeysandvaluesx.o&x.objissameobj--x.obj&y.objsameobject",
        note: "<b>test ArrayLike / ObjectLike:</b> diff obj but same keys and values\nx.o & x.obj is same obj -- x.obj & y.obj same object",
        warn: "",
        actual: {
            0: {
                argsOk: true,
                obj: {
                    a: 1,
                    b: 2
                },
                o: {
                    "@JSON_escapeMarker@": "$.19.actual.20.actual.21.actual.22.actual.23.actual.0.o=$.19.actual.20.actual.21.actual.22.actual.23.actual.0.obj"
                },
                used: true
            },
            1: {
                argsOk: true,
                obj: {
                    a: 1,
                    b: 2
                },
                o: {
                    a: 1,
                    b: 2
                },
                used: true
            },
            2: {
                showDiff: true
            },
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:42 pm"
    },
    {
        ok: true,
        testno: 25,
        id: "arg1=1st arg (x):[obj],1st arg (x).obj:[a,b],1st arg (x).obj.a:1,1st arg (x).obj.b:2,arg2=2nd arg (y):[obj],2nd arg (y).obj:[0,1],2nd arg (y).obj[0]:1,2nd arg (y).obj[1]:2,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>testArrayLike/ObjectLike:</b>diffobj--samesinglekey--butx.obj/y.objnotsametype",
        note: "<b>test ArrayLike / ObjectLike:</b> diff obj -- same single key -- but x.obj / y.obj not same type\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                obj: {
                    a: 1,
                    b: 2
                }
            },
            1: {
                obj: [
                    1,
                    2
                ]
            },
            2: [
                "1st [Object] \t ... 2nd [Object]",
                "  .obj: [Object] \t !== [ObjectLike]"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.19.actual.20.actual.21.actual.22.24.expected.2=$.19.actual.20.actual.21.actual.22.24.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:43 pm"
    },
    {
        ok: true,
        testno: 26,
        id: "arg1=1st arg (x):[obj],1st arg (x).obj:[a,b],1st arg (x).obj.a:1,1st arg (x).obj.b:2,arg2=2nd arg (y):[obj],2nd arg (y).obj:true,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>testArrayLike/ObjectLike:</b>diffobj--samesinglekey--x.objisboolean,y.objisobj",
        note: "<b>test ArrayLike / ObjectLike:</b> diff obj -- same single key -- x.obj is boolean,  y.obj is obj\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                obj: {
                    a: 1,
                    b: 2
                }
            },
            1: {
                obj: true
            },
            2: [
                "1st [Object] \t ... 2nd [Object]",
                "  .obj: [Object] \t !== •true•"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.19.actual.20.actual.21.actual.22.25.expected.2=$.19.actual.20.actual.21.actual.22.25.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:43 pm"
    },
    {
        ok: true,
        testno: 27,
        id: "arg1=1st arg (x):[obj],1st arg (x).obj:false,arg2=2nd arg (y):[obj],2nd arg (y).obj:[a,b],2nd arg (y).obj.a:1,2nd arg (y).obj.b:2,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>testArrayLike/ObjectLike:</b>diffobj--samesinglekey--x.objisobj,y.objisboolean",
        note: "<b>test ArrayLike / ObjectLike:</b> diff obj -- same single key -- x.obj is obj,  y.obj is boolean\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                obj: false
            },
            1: {
                obj: {
                    a: 1,
                    b: 2
                }
            },
            2: [
                "1st [Object] \t ... 2nd [Object]",
                "  .obj: •false• \t !== [Object]"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.19.actual.20.actual.21.26.expected.2=$.19.actual.20.actual.21.26.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:44 pm"
    },
    {
        ok: true,
        testno: 28,
        id: "arg1=1st arg (x):[obj],1st arg (x).obj:[a,b],1st arg (x).obj.a:1,1st arg (x).obj.b:2,arg2=2nd arg (y):[obj],2nd arg (y).obj:[0,1],2nd arg (y).obj[0]:1,2nd arg (y).obj[1]:2,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>testArrayLike/ObjectLike:</b>diffobj--samesinglekey&values--butx.objisArrayLike,y.objisArray",
        note: "<b>test ArrayLike / ObjectLike:</b> diff obj -- same single key & values --but  x.obj is ArrayLike,  y.obj is Array\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                obj: {
                    a: 1,
                    b: 2
                }
            },
            1: {
                obj: [
                    1,
                    2
                ]
            },
            2: [
                "1st [Object] \t ... 2nd [Object]",
                "  .obj: [Object] \t !== [ObjectLike]"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.19.actual.20.actual.21.27.expected.2=$.19.actual.20.actual.21.27.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:44 pm"
    },
    {
        ok: true,
        testno: 29,
        id: "arg1=1st arg (x):[0,1],1st arg (x)[0]:1,1st arg (x)[1]:undefined,arg2=2nd arg (undefined]):[0,1],2nd arg (undefined])[0]:1,2nd arg (undefined])[1]:null,arg3=3rd arg (options):[showDiff],3rd arg (options).showDiff:true,note:<b>testArrayLike/ObjectLike:</b>formattedLogincorrect",
        note: "<b>test ArrayLike / ObjectLike:</b> formattedLog incorrect\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: [
                1,
                {
                    "@JSON_escapeMarker@": "$.19.actual.20.actual.28.actual.0.1=undefined"
                }
            ],
            1: [
                1,
                null
            ],
            2: [
                "1st [ObjectLike] \t ... 2nd [Array]",
                "  [1]: •undefined• \t !== •null•"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.19.actual.20.actual.28.expected.2=$.19.actual.20.actual.28.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:44 pm"
    },
    {
        ok: true,
        testno: 30,
        id: "arg1=1st arg (x):null,arg2=2nd arg (y):null,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n",
        warn: "",
        actual: {
            0: null,
            1: null,
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:44 pm"
    },
    {
        ok: true,
        testno: 31,
        id: "arg1=1st arg (x):null,arg2=2nd arg (y):undefined,arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: null,
            1: {
                "@JSON_escapeMarker@": "$.19.actual.20.30.actual.1=undefined"
            },
            2: [
                "1st [Null] \t ... 2nd [undefined]",
                "•null• \t !== •undefined•"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.19.actual.20.30.expected.2=$.19.actual.20.30.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:45 pm"
    },
    {
        ok: true,
        testno: 32,
        id: "arg1=1st arg (x):[],arg2=2nd arg (y):[],note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n",
        warn: "",
        actual: {
            0: {
                "@JSON_escapeMarker@": "$.19.actual.31.actual.0=/abc/;"
            },
            1: {
                "@JSON_escapeMarker@": "$.19.actual.31.actual.1=/abc/;"
            },
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:45 pm"
    },
    {
        ok: true,
        testno: 33,
        id: "arg1=1st arg (x):[],arg2=2nd arg (y):[],arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                "@JSON_escapeMarker@": "$.19.32.actual.0=/abc/;"
            },
            1: {
                "@JSON_escapeMarker@": "$.19.32.actual.1=/123/;"
            },
            2: [
                "1st [RegExp] \t ... 2nd [RegExp]",
                "// \t !== //"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.19.32.expected.2=$.19.32.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:45 pm"
    },
    {
        ok: true,
        testno: 34,
        id: "arg1=1st arg (r):[],arg2=2nd arg (y):[],note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n",
        warn: "",
        actual: {
            0: {
                "@JSON_escapeMarker@": "$.19.33.actual.0=/abc/g;"
            },
            1: {
                "@JSON_escapeMarker@": "$.19.33.actual.1=/abc/g;"
            },
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:46 pm"
    },
    {
        ok: true,
        testno: 35,
        id: "arg1=1st arg (r):[],arg2=2nd arg (y):[],arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                "@JSON_escapeMarker@": "$.34.actual.0=/abc/g;"
            },
            1: {
                "@JSON_escapeMarker@": "$.34.actual.1=/abc/;"
            },
            2: [
                "1st [RegExp] \t ... 2nd [RegExp]",
                "// \t !== //"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.34.expected.2=$.34.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:46 pm"
    },
    {
        ok: true,
        testno: 36,
        id: "arg1=1st arg (r):[],arg2=2nd arg (y):[],arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                "@JSON_escapeMarker@": "$.35.actual.0=/abc/g;#.lastIndex=2"
            },
            1: {
                "@JSON_escapeMarker@": "$.35.actual.1=/abc/g;"
            },
            2: [
                "1st [RegExp] \t ... 2nd [RegExp]",
                "// \t !== //"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.35.expected.2=$.35.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:46 pm"
    },
    {
        ok: true,
        testno: 37,
        id: "arg1=1st arg (x):hi,arg2=2nd arg (y):hi,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n",
        warn: "",
        actual: {
            0: "hi",
            1: "hi",
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:47 pm"
    },
    {
        ok: true,
        testno: 38,
        id: "arg1=1st arg (x):hi,arg2=2nd arg (y):hi ,arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: "hi",
            1: "hi ",
            2: [
                "1st [String] \t ... 2nd [String]",
                "\"h\" \t !== \"h\""
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.37.expected.2=$.37.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:47 pm"
    },
    {
        ok: true,
        testno: 39,
        id: "arg1=1st arg (x):5,arg2=2nd arg (y):5,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n",
        warn: "",
        actual: {
            0: 5,
            1: 5,
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:47 pm"
    },
    {
        ok: true,
        testno: 40,
        id: "arg1=1st arg (x):5,arg2=2nd arg (y):10,arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: 5,
            1: 10,
            2: [
                "1st [Number] \t ... 2nd [Number]",
                "5 \t !== #"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.39.expected.2=$.39.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:48 pm"
    },
    {
        ok: true,
        testno: 41,
        id: "arg1=1st arg (Number(5)):5,arg2=2nd arg (y):5,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n",
        warn: "",
        actual: {
            0: 5,
            1: 5,
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:48 pm"
    },
    {
        ok: true,
        testno: 42,
        id: "arg1=1st arg (Number(5)):5,arg2=2nd arg (y):10,arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: 5,
            1: 10,
            2: [
                "1st [Number] \t ... 2nd [Number]",
                "5 \t !== #"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.41.expected.2=$.41.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:48 pm"
    },
    {
        ok: true,
        testno: 43,
        id: "arg1=1st arg (Number(1)):1,arg2=2nd arg (y):1,arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: 1,
            1: "1",
            2: [
                "1st [Number] \t ... 2nd [String]",
                "1 \t !== \"1\""
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.42.expected.2=$.42.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:48 pm"
    },
    {
        ok: true,
        testno: 44,
        id: "arg1=1st arg (x):true,arg2=2nd arg (y):true,arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n",
        warn: "",
        actual: {
            0: true,
            1: true,
            2: true,
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:49 pm"
    },
    {
        ok: true,
        testno: 45,
        id: "arg1=1st arg (x):true,arg2=2nd arg (y):false,arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: true,
            1: false,
            2: [
                "1st [Boolean] \t ... 2nd [Boolean]",
                "•true• \t !== •false•"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.44.expected.2=$.44.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:49 pm"
    },
    {
        ok: true,
        testno: 46,
        id: "arg1=1st arg (Boolean(true)):true,arg2=2nd arg (y):true,arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>EZ.equals(Boolean(true),true,true)callargsnotdisplayedcorrectly",
        note: "<b>tests from stackoverflow base code</b>\nEZ.equals(Boolean(true),true, true)\ncall args not displayed correctly",
        warn: "",
        actual: {
            0: true,
            1: true,
            2: true,
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:49 pm"
    },
    {
        ok: true,
        testno: 47,
        id: "arg1=1st arg (Boolean(true)):true,arg2=2nd arg (y):false,arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>EZ.equals(Boolean(true),true,true)callargsnotdisplayedcorrectly",
        note: "<b>tests from stackoverflow base code</b>\nEZ.equals(Boolean(true),true, true)\ncall args not displayed correctly\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: true,
            1: false,
            2: [
                "1st [Boolean] \t ... 2nd [Boolean]",
                "•true• \t !== •false•"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.46.expected.2=$.46.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:50 pm"
    },
    {
        ok: true,
        testno: 48,
        id: "arg1=1st arg (d1):[],arg2=2nd arg (d2):[],arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                "@JSON_escapeMarker@": "$.47.actual.0=new Date('03/31/2016 08:00:00.000 am')"
            },
            1: {
                "@JSON_escapeMarker@": "$.47.actual.1=new Date('03/31/2016 08:00:00.010 am')"
            },
            2: [
                "1st [Date] \t ... 2nd [Date]",
                "#date \t !== #date"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.47.expected.2=$.47.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:50 pm"
    },
    {
        ok: true,
        testno: 49,
        id: "arg1=1st arg (d1):[],arg2=2nd arg (new Date(###2016/03/31 8:00:10 pm###)):[],arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                "@JSON_escapeMarker@": "$.48.actual.0=new Date('03/31/2016 08:00:00.000 am')"
            },
            1: {
                "@JSON_escapeMarker@": "$.48.actual.1=new Date('03/31/2016 08:00:10.000 pm')"
            },
            2: [
                "1st [Date] \t ... 2nd [Date]",
                "#date \t !== #date"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.48.expected.2=$.48.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:50 pm"
    },
    {
        ok: true,
        testno: 50,
        id: "arg1=1st arg (new Date(###2011/03/31###)):[],arg2=2nd arg (new Date(###2011/03/31###)):[],note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n",
        warn: "",
        actual: {
            0: {
                "@JSON_escapeMarker@": "$.49.actual.0=new Date('03/31/2011')"
            },
            1: {
                "@JSON_escapeMarker@": "$.49.actual.1=new Date('03/31/2011')"
            },
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:51 pm"
    },
    {
        ok: true,
        testno: 51,
        id: "arg1=1st arg (new Date(###2011/03/31###)):[],arg2=2nd arg (new Date(######)):[],arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                "@JSON_escapeMarker@": "$.50.actual.0=new Date('03/31/2011')"
            },
            1: {
                "@JSON_escapeMarker@": "$.50.actual.1=new Date('''')"
            },
            2: [
                "1st [Date] \t ... 2nd [Date]",
                "#date \t !== Invalid Date"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.50.expected.2=$.50.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:51 pm"
    },
    {
        ok: true,
        testno: 52,
        id: "arg1=1st arg (new Date(x)):[],arg2=2nd arg (new Date(y)):[],arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>testsfromstackoverflowbasecode</b>03/14/20161:00pmEST03/14/201606:00pmGMT",
        note: "<b>tests from stackoverflow base code</b>\n03/14/2016 1:00 pm EST\n03/14/2016 06:00 pm GMT",
        warn: "",
        actual: {
            0: {
                "@JSON_escapeMarker@": "$.51.actual.0=new Date('03/14/2016 02:00:00.000 pm')"
            },
            1: {
                "@JSON_escapeMarker@": "$.51.actual.1=new Date('03/14/2016 02:00:00.000 pm')"
            },
            2: {
                showDiff: true
            },
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:51 pm"
    },
    {
        ok: true,
        testno: 53,
        id: "arg1=1st arg (new Date(x)):[],arg2=2nd arg (new Date(y)):[],arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>testsfromstackoverflowbasecode</b>03/14/20161:00:01pmEST03/14/201606:00pmGMT",
        note: "<b>tests from stackoverflow base code</b>\n03/14/2016 1:00:01 pm EST\n03/14/2016 06:00 pm GMT\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                "@JSON_escapeMarker@": "$.52.actual.0=new Date('03/14/2016 02:00:01.000 pm')"
            },
            1: {
                "@JSON_escapeMarker@": "$.52.actual.1=new Date('03/14/2016 02:00:00.000 pm')"
            },
            2: [
                "1st [Date] \t ... 2nd [Date]",
                "03-14-2016 02:00:01 PM \t !== 03-14-2016 02:00 PM"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.52.expected.2=$.52.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:52 pm"
    },
    {
        ok: true,
        testno: 54,
        id: "arg1=1st arg (x):[],arg2=2nd arg (y):[],arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n",
        warn: "",
        actual: {
            0: [],
            1: [],
            2: true,
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:52 pm"
    },
    {
        ok: true,
        testno: 55,
        id: "arg1=1st arg (x):[0,1],1st arg (x)[0]:1,1st arg (x)[1]:2,arg2=2nd arg (y):[0,1],2nd arg (y)[0]:1,2nd arg (y)[1]:2,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n",
        warn: "",
        actual: {
            0: [
                1,
                2
            ],
            1: [
                1,
                2
            ],
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:52 pm"
    },
    {
        ok: true,
        testno: 56,
        id: "arg1=1st arg (x):[0,1],1st arg (x)[0]:1,1st arg (x)[1]:2,arg2=2nd arg (y):[0,1],2nd arg (y)[0]:2,2nd arg (y)[1]:1,arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: [
                1,
                2
            ],
            1: [
                2,
                1
            ],
            2: [
                "1st [ObjectLike] \t ... 2nd [Array]",
                "  [0]: 1 \t !== 2",
                "  [1]: 2 \t !== 1"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.55.expected.2=$.55.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:52 pm"
    },
    {
        ok: true,
        testno: 57,
        id: "arg1=1st arg (x):[0,1],1st arg (x)[0]:1,1st arg (x)[1]:2,arg2=2nd arg (y):[0,1,2],2nd arg (y)[0]:1,2nd arg (y)[1]:2,2nd arg (y)[2]:3,arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: [
                1,
                2
            ],
            1: [
                1,
                2,
                3
            ],
            2: [
                "1st [ObjectLike] \t ... 2nd [Array]",
                "   *keys do not match*",
                "   na \t ... +{2:}",
                "[ObjectLike] \t !== [ObjectLike]"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.56.expected.2=$.56.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:53 pm"
    },
    {
        ok: true,
        testno: 58,
        id: "arg1=1st arg (x):[],arg2=2nd arg (y):[],arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n",
        warn: "",
        actual: {
            0: {},
            1: {},
            2: true,
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:53 pm"
    },
    {
        ok: true,
        testno: 59,
        id: "arg1=1st arg (x):[a,b],1st arg (x).a:1,1st arg (x).b:2,arg2=2nd arg (b:2}):[a,b],2nd arg (b:2}).a:1,2nd arg (b:2}).b:2,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n",
        warn: "",
        actual: {
            0: {
                a: 1,
                b: 2
            },
            1: {
                a: 1,
                b: 2
            },
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:53 pm"
    },
    {
        ok: true,
        testno: 60,
        id: "arg1=1st arg (x):[a,b],1st arg (x).a:1,1st arg (x).b:2,arg2=2nd arg (b:2}):[b,a],2nd arg (b:2}).b:2,2nd arg (b:2}).a:1,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n",
        warn: "",
        actual: {
            0: {
                a: 1,
                b: 2
            },
            1: {
                b: 2,
                a: 1
            },
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:54 pm"
    },
    {
        ok: true,
        testno: 61,
        id: "arg1=1st arg (x):[a,b],1st arg (x).a:1,1st arg (x).b:2,arg2=2nd arg (b:2}):[a,b],2nd arg (b:2}).a:1,2nd arg (b:2}).b:3,arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                a: 1,
                b: 2
            },
            1: {
                a: 1,
                b: 3
            },
            2: [
                "1st [Object] \t ... 2nd [Object]",
                "  .b: 2 \t !== 3"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.60.expected.2=$.60.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:54 pm"
    },
    {
        ok: true,
        testno: 62,
        id: "arg1=1st arg (x):[],arg2=2nd arg (y):null,arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {},
            1: null,
            2: [
                "1st [Object] \t ... 2nd [null]",
                " \t !== •null•"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.61.expected.2=$.61.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:54 pm"
    },
    {
        ok: true,
        testno: 63,
        id: "arg1=1st arg (x):[],arg2=2nd arg (y):undefined,arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {},
            1: {
                "@JSON_escapeMarker@": "$.62.actual.1=undefined"
            },
            2: [
                "1st [Object] \t ... 2nd [undefined]",
                " \t !== •undefined•"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.62.expected.2=$.62.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:55 pm"
    },
    {
        ok: true,
        testno: 64,
        id: "arg1=1st arg (x):[],arg2=2nd arg (y):[],note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n",
        warn: "",
        actual: {
            0: [],
            1: [],
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:55 pm"
    },
    {
        ok: true,
        testno: 65,
        id: "arg1=1st arg (x):[0,1],1st arg (x)[0]:1,1st arg (x)[1]:2,arg2=2nd arg (y):[0,1],2nd arg (y)[0]:1,2nd arg (y)[1]:2,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n",
        warn: "",
        actual: {
            0: [
                1,
                2
            ],
            1: [
                1,
                2
            ],
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:55 pm"
    },
    {
        ok: true,
        testno: 66,
        id: "arg1=1st arg (x):[0,1],1st arg (x)[0]:1,1st arg (x)[1]:2,arg2=2nd arg (y):[0,1],2nd arg (y)[0]:2,2nd arg (y)[1]:1,arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: [
                1,
                2
            ],
            1: [
                2,
                1
            ],
            2: [
                "1st [ObjectLike] \t ... 2nd [Array]",
                "  [0]: 1 \t !== 2",
                "  [1]: 2 \t !== 1"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.65.expected.2=$.65.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:55 pm"
    },
    {
        ok: true,
        testno: 67,
        id: "arg1=1st arg (x):[0,1],1st arg (x)[0]:1,1st arg (x)[1]:2,arg2=2nd arg (y):[0,1,2],2nd arg (y)[0]:1,2nd arg (y)[1]:2,2nd arg (y)[2]:3,arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: [
                1,
                2
            ],
            1: [
                1,
                2,
                3
            ],
            2: [
                "1st [ObjectLike] \t ... 2nd [Array]",
                "   *keys do not match*",
                "   na \t ... +{2:}",
                "[ObjectLike] \t !== [ObjectLike]"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.66.expected.2=$.66.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:56 pm"
    },
    {
        ok: true,
        testno: 68,
        id: "arg1=1st arg (x):[],arg2=2nd arg (y):[],note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n",
        warn: "",
        actual: {
            0: {},
            1: {},
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:56 pm"
    },
    {
        ok: true,
        testno: 69,
        id: "arg1=1st arg (x):[a,b],1st arg (x).a:1,1st arg (x).b:2,arg2=2nd arg (b:2}):[a,b],2nd arg (b:2}).a:1,2nd arg (b:2}).b:2,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n",
        warn: "",
        actual: {
            0: {
                a: 1,
                b: 2
            },
            1: {
                a: 1,
                b: 2
            },
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:56 pm"
    },
    {
        ok: true,
        testno: 70,
        id: "arg1=1st arg (x):[a,b],1st arg (x).a:1,1st arg (x).b:2,arg2=2nd arg (b:2}):[b,a],2nd arg (b:2}).b:2,2nd arg (b:2}).a:1,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n",
        warn: "",
        actual: {
            0: {
                a: 1,
                b: 2
            },
            1: {
                b: 2,
                a: 1
            },
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:57 pm"
    },
    {
        ok: true,
        testno: 71,
        id: "arg1=1st arg (x):[a,b],1st arg (x).a:1,1st arg (x).b:2,arg2=2nd arg (b:2}):[a,b],2nd arg (b:2}).a:1,2nd arg (b:2}).b:3,arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                a: 1,
                b: 2
            },
            1: {
                a: 1,
                b: 3
            },
            2: [
                "1st [Object] \t ... 2nd [Object]",
                "  .b: 2 \t !== 3"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.70.expected.2=$.70.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:57 pm"
    },
    {
        ok: true,
        testno: 72,
        id: "arg1=1st arg (a):[a,b],1st arg (a).a:text,1st arg (a).b:[0,1],1st arg (a).b[0]:0,1st arg (a).b[1]:1,arg2=2nd arg (b):[a,b],2nd arg (b).a:text,2nd arg (b).b:[0,1],2nd arg (b).b[0]:0,2nd arg (b).b[1]:1,arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n",
        warn: "",
        actual: {
            0: {
                a: "text",
                b: [
                    0,
                    1
                ]
            },
            1: {
                a: "text",
                b: [
                    0,
                    1
                ]
            },
            2: true,
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:57 pm"
    },
    {
        ok: true,
        testno: 73,
        id: "arg1=1st arg (a):[a,b],1st arg (a).a:text,1st arg (a).b:[0,1],1st arg (a).b[0]:0,1st arg (a).b[1]:1,arg2=2nd arg (c):[a,b],2nd arg (c).a:text,2nd arg (c).b:0,arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                a: "text",
                b: [
                    0,
                    1
                ]
            },
            1: {
                a: "text",
                b: 0
            },
            2: [
                "1st [Object] \t ... 2nd [Object]",
                "  .b: [ObjectLike] \t !== 0"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.72.expected.2=$.72.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:58 pm"
    },
    {
        ok: true,
        testno: 74,
        id: "arg1=1st arg (c):[a,b],1st arg (c).a:text,1st arg (c).b:0,arg2=2nd arg (d):[a,b],2nd arg (d).a:text,2nd arg (d).b:false,arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                a: "text",
                b: 0
            },
            1: {
                a: "text",
                b: false
            },
            2: [
                "1st [Object] \t ... 2nd [Object]",
                "  .b: 0 \t !== •false•"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.73.expected.2=$.73.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:58 pm"
    },
    {
        ok: true,
        testno: 75,
        id: "arg1=1st arg (a):[a,b],1st arg (a).a:text,1st arg (a).b:[0,1],1st arg (a).b[0]:0,1st arg (a).b[1]:1,arg2=2nd arg (e):[a,b],2nd arg (e).a:text,2nd arg (e).b:[0,1],2nd arg (e).b[0]:1,2nd arg (e).b[1]:0,arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                a: "text",
                b: [
                    0,
                    1
                ]
            },
            1: {
                a: "text",
                b: [
                    1,
                    0
                ]
            },
            2: [
                "1st [Object] \t ... 2nd [Object]",
                "  .b[0]: 0 \t !== 1",
                "  .b[1]: 1 \t !== 0"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.74.expected.2=$.74.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:58 pm"
    },
    {
        ok: true,
        testno: 76,
        id: "arg1=1st arg (i):[a,c],1st arg (i).a:text,1st arg (i).c:[b],1st arg (i).c.b:[0,1],1st arg (i).c.b[0]:1,1st arg (i).c.b[1]:0,arg2=2nd arg (j):[a,c],2nd arg (j).a:text,2nd arg (j).c:[b],2nd arg (j).c.b:[0,1],2nd arg (j).c.b[0]:1,2nd arg (j).c.b[1]:0,arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n",
        warn: "",
        actual: {
            0: {
                a: "text",
                c: {
                    b: [
                        1,
                        0
                    ]
                }
            },
            1: {
                a: "text",
                c: {
                    b: [
                        1,
                        0
                    ]
                }
            },
            2: true,
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:28:59 pm"
    },
    {
        ok: true,
        testno: 77,
        id: "arg1=1st arg (d):[a,b],1st arg (d).a:text,1st arg (d).b:false,arg2=2nd arg (k):[a,b],2nd arg (k).a:text,2nd arg (k).b:null,arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                a: "text",
                b: false
            },
            1: {
                a: "text",
                b: null
            },
            2: [
                "1st [Object] \t ... 2nd [Object]",
                "  .b: •false• \t !== •null•"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.76.expected.2=$.76.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:59 pm"
    },
    {
        ok: true,
        testno: 78,
        id: "arg1=1st arg (k):[a,b],1st arg (k).a:text,1st arg (k).b:null,arg2=2nd arg (l):[a,b],2nd arg (l).a:text,2nd arg (l).b:undefined,arg3=3rd arg (options):true,note:<b>testsfromstackoverflowbasecode</b>",
        note: "<b>tests from stackoverflow base code</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                a: "text",
                b: null
            },
            1: {
                a: "text",
                b: {
                    "@JSON_escapeMarker@": "$.77.actual.1.b=undefined"
                }
            },
            2: [
                "1st [Object] \t ... 2nd [Object]",
                "  .b: •null• \t !== •undefined•"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.77.expected.2=$.77.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:28:59 pm"
    },
    {
        ok: true,
        testno: 79,
        id: "arg1=1st arg (x):[0,1,2],1st arg (x)[0]:1,1st arg (x)[1]:2,1st arg (x)[2]:undefined,arg2=2nd arg (y):[0,1],2nd arg (y)[0]:1,2nd arg (y)[1]:2,arg3=3rd arg (undefined]):true,note:<b>fromcommentsonstackoverflowpost</b>",
        note: "<b>from comments on stackoverflow post</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: [
                1,
                2,
                {
                    "@JSON_escapeMarker@": "$.78.actual.0.2=undefined"
                }
            ],
            1: [
                1,
                2
            ],
            2: [
                "1st [ObjectLike] \t ... 2nd [Array]",
                "   *keys do not match*",
                "   +{2:} \t ... na",
                "[ObjectLike] \t !== [ObjectLike]"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.78.expected.2=$.78.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:29:00 pm"
    },
    {
        ok: true,
        testno: 80,
        id: "arg1=1st arg (x):[0,1,2],1st arg (x)[0]:1,1st arg (x)[1]:2,1st arg (x)[2]:3,arg2=2nd arg (y):[0,1,2],2nd arg (y)[0]:1,2nd arg (y)[1]:2,2nd arg (y)[2]:3,arg3=3rd arg (options):true,note:<b>fromcommentsonstackoverflowpost</b>",
        note: "<b>from comments on stackoverflow post</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: [
                1,
                2,
                3
            ],
            1: {
                0: 1,
                1: 2,
                2: 3
            },
            2: [
                "1st [ObjectLike] \t ... 2nd [Object]",
                " \t !== [Object]"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.79.expected.2=$.79.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:29:00 pm"
    },
    {
        ok: true,
        testno: 81,
        id: "arg1=1st arg (new Date(1234)):[],arg2=2nd arg (y):1234,arg3=3rd arg (options):true,note:<b>fromcommentsonstackoverflowpost</b>",
        note: "<b>from comments on stackoverflow post</b>\n\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                "@JSON_escapeMarker@": "$.80.actual.0=new Date('12/31/1969 07:00:01.234 pm')"
            },
            1: 1234,
            2: [
                "1st [Date] \t ... 2nd [Number]",
                " \t !== #"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.80.expected.2=$.80.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:29:00 pm"
    },
    "test #82 no data",
    "test #83 no data",
    {
        ok: true,
        testno: 84,
        id: "arg1=1st arg (func):[],arg2=2nd arg (funcSame):[],arg3=3rd arg (options):[showDiff,strict],3rd arg (options).showDiff:true,3rd arg (options).strict:Function,note:<b>fromcommentsonstackoverflowpost</b>NOTequalwithsamescriptwhenoptions.strict==\"Function\"",
        note: "<b>from comments on stackoverflow post</b>\nNOT equal with same script when options.strict == \"Function\"\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            2: [
                "1st [clone] \t ... 2nd [Function]",
                "function clone()\n{ lines: 0 } \t !== function clone()\n{ lines: 0 }"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.83.actual.expected.2=$.83.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:29:01 pm"
    },
    {
        ok: true,
        testno: 85,
        id: "arg1=1st arg (func):[],arg2=2nd arg (funcSame):[],arg3=3rd arg (options):[showDiff],3rd arg (options).showDiff:true,note:<b>fromcommentsonstackoverflowpost</b>ISequalwithsamescriptwhenoptions.strict!=\"Function\"",
        note: "<b>from comments on stackoverflow post</b>\nIS equal with same script when options.strict != \"Function\"",
        warn: "",
        actual: {
            2: {
                showDiff: true
            },
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:29:01 pm"
    },
    {
        ok: true,
        testno: 86,
        id: "arg1=1st arg (func):[],arg2=2nd arg (funcDiff):[],arg3=3rd arg (options):[showDiff],3rd arg (options).showDiff:true,note:<b>fromcommentsonstackoverflowpost</b>notsamescript",
        note: "<b>from comments on stackoverflow post</b>\nnot same script\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            2: [
                "1st [clone] \t ... 2nd [Function]",
                "function clone()\n{ lines: 0 } \t !== function clone()\n{ lines: 0 }"
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.83.actual.84.actual.85.actual.expected.2=$.83.actual.84.actual.85.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:29:01 pm"
    },
    {
        ok: true,
        testno: 87,
        id: "arg1=1st arg (func):[aKey],1st arg (func).aKey:same value,arg2=2nd arg (funcSame):[aKey],2nd arg (funcSame).aKey:same value,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>fromcommentsonstackoverflowpost</b>samescript--sameenumerableproperties",
        note: "<b>from comments on stackoverflow post</b>\nsame script -- same enumerable properties",
        warn: "",
        actual: {
            0: {
                aKey: "same value"
            },
            1: {
                aKey: "same value"
            },
            2: {
                showDiff: true
            },
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:29:01 pm"
    },
    {
        ok: true,
        testno: 88,
        id: "arg1=1st arg (func):[aKey],1st arg (func).aKey:same value,arg2=2nd arg (funcSame):[aKey],2nd arg (funcSame).aKey:diff value,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>fromcommentsonstackoverflowpost</b>samescript--DIFFERENTenumerableproperties",
        note: "<b>from comments on stackoverflow post</b>\nsame script -- DIFFERENT enumerable properties\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "",
        actual: {
            0: {
                aKey: "same value"
            },
            1: {
                aKey: "diff value"
            },
            2: [
                "1st [clone] \t ... 2nd [Function]",
                "  .aKey: \"same value\" \t !== \"diff value\""
            ],
            results: false
        },
        expected: {
            2: [
                "@JSON_escapeMarker@:$.83.actual.84.actual.85.actual.87.expected.2=$.83.actual.84.actual.85.actual.87.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-22-2016 08:29:02 pm"
    },
    {
        ok: true,
        testno: 89,
        id: "arg1=1st arg (obj):[argsOk,testOk,display_results,ok,used],1st arg (obj).argsOk:true,1st arg (obj).testOk:false,1st arg (obj).display_results:@test not run@,1st arg (obj).ok:false,1st arg (obj).used:true,arg2=2nd arg (o):[argsOk,testOk,display_results,ok],2nd arg (o).argsOk:true,2nd arg (o).testOk:false,2nd arg (o).display_results:@test not run@,2nd arg (o).ok:true,note:<b>issuesfromtestassistant</b>diffkeys--okhasdiffvalues",
        note: "<b>issues from test assistant</b>\ndiff keys -- ok has diff values\nshowDiff not specified",
        warn: "",
        actual: {
            0: {
                argsOk: true,
                testOk: false,
                display_results: "@test not run@",
                ok: false,
                used: true
            },
            1: {
                argsOk: true,
                testOk: false,
                display_results: "@test not run@",
                ok: true
            },
            results: false
        },
        expected: {
            results: false
        },
        saveDateTime: "11-22-2016 08:29:02 pm"
    },
    {
        ok: true,
        testno: 90,
        id: "arg1=1st arg (obj):[argsOk,testOk,display_results,ok,used],1st arg (obj).argsOk:true,1st arg (obj).testOk:false,1st arg (obj).display_results:@test not run@,1st arg (obj).ok:false,1st arg (obj).used:false,arg2=2nd arg (o):[argsOk,testOk,display_results,ok],2nd arg (o).argsOk:true,2nd arg (o).testOk:false,2nd arg (o).display_results:@test not run@,2nd arg (o).ok:false,note:<b>issuesfromtestassistant</b>diffkeys--samevalues",
        note: "<b>issues from test assistant</b>\ndiff keys -- same values\nshowDiff not specified",
        warn: "",
        actual: {
            0: {
                argsOk: true,
                testOk: false,
                display_results: "@test not run@",
                ok: false,
                used: false
            },
            1: {
                argsOk: true,
                testOk: false,
                display_results: "@test not run@",
                ok: false
            },
            results: false
        },
        expected: {
            results: false
        },
        saveDateTime: "11-22-2016 08:29:02 pm"
    },
    {
        ok: true,
        testno: 91,
        id: "arg1=1st arg (obj):[argsOk,testOk,display_results,ok,used],1st arg (obj).argsOk:true,1st arg (obj).testOk:false,1st arg (obj).display_results:@test not run@,1st arg (obj).ok:false,1st arg (obj).used:true,arg2=2nd arg (o):[argsOk,testOk,display_results,ok,used],2nd arg (o).argsOk:true,2nd arg (o).testOk:false,2nd arg (o).display_results:@test not run@,2nd arg (o).ok:true,2nd arg (o).used:true,note:<b>issuesfromtestassistant</b>samekeys--okhasdiffvalues",
        note: "<b>issues from test assistant</b>\nsame keys --  ok has diff values\nshowDiff not specified",
        warn: "",
        actual: {
            0: {
                argsOk: true,
                testOk: false,
                display_results: "@test not run@",
                ok: false,
                used: true
            },
            1: {
                argsOk: true,
                testOk: false,
                display_results: "@test not run@",
                ok: true,
                used: true
            },
            results: false
        },
        expected: {
            results: false
        },
        saveDateTime: "11-22-2016 08:29:03 pm"
    },
    {
        ok: true,
        testno: 92,
        id: "arg1=1st arg (obj):[argsOk,testOk,display_results,ok,used],1st arg (obj).argsOk:true,1st arg (obj).testOk:false,1st arg (obj).display_results:@test not run@,1st arg (obj).ok:true,1st arg (obj).used:true,arg2=2nd arg (o):[argsOk,testOk,display_results,ok,used],2nd arg (o).argsOk:true,2nd arg (o).testOk:false,2nd arg (o).display_results:@test not run@,2nd arg (o).ok:true,2nd arg (o).used:true,note:<b>issuesfromtestassistant</b>samekeys--samevalues",
        note: "<b>issues from test assistant</b>\nsame keys --  same values",
        warn: "",
        actual: {
            0: {
                argsOk: true,
                testOk: false,
                display_results: "@test not run@",
                ok: true,
                used: true
            },
            1: {
                argsOk: true,
                testOk: false,
                display_results: "@test not run@",
                ok: true,
                used: true
            },
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:29:03 pm"
    },
    {
        ok: true,
        testno: 93,
        id: "arg1=1st arg (obj):[note,expected,ctxRequired,args,display_args,ctx,errmsg,testno,display_expected,results,ctxOk,argsOk,testOk,display_results,ok,used],1st arg (obj).note:test options: none\nthis undefined,1st arg (obj).expected:[args,ctx,results],1st arg (obj).expected.args:[],1st arg (obj).expected.ctx:@not specified@,1st arg (obj).expected.results:@not specified@,1st arg (obj).ctxRequired:true,1st arg (obj).args:[],1st arg (obj).display_args:<pre><i>Array </i> @undefined@\n</pre>,1st arg (obj).ctx:undefined,1st arg (obj).errmsg:\"this\" not same type as function prototype,1st arg (obj).testno:5,1st arg (obj).display_expected:@no expected values supplied@,1st arg (obj).results:@test not run@,1st arg (obj).ctxOk:true,1st arg (obj).argsOk:true,1st arg (obj).testOk:false,1st arg (obj).display_results:@test not run@,1st arg (obj).ok:false,1st arg (obj).used:true,arg2=2nd arg (o):[note,expected,ctxRequired,args,display_args,ctx,errmsg,testno,display_expected,results,ctxOk,argsOk,testOk,display_results,ok],2nd arg (o).note:test options: none\nthis undefined,2nd arg (o).expected:[args,ctx,results],2nd arg (o).expected.args:[],2nd arg (o).expected.ctx:@not specified@,2nd arg (o).expected.results:@not specified@,2nd arg (o).ctxRequired:true,2nd arg (o).args:[],2nd arg (o).display_args:<pre><i>Array </i> @undefined@\n</pre>,2nd arg (o).ctx:undefined,2nd arg (o).errmsg:\"this\" not same type as function prototype,2nd arg (o).testno:5,2nd arg (o).display_expected:@no expected values supplied@,2nd arg (o).results:@test not run@,2nd arg (o).ctxOk:true,2nd arg (o).argsOk:true,2nd arg (o).testOk:false,2nd arg (o).display_results:@test not run@,2nd arg (o).ok:true,note:<b>issuesfromtestassistant</b>morekeys--notequal",
        note: "<b>issues from test assistant</b>\nmore keys -- not equal\nshowDiff not specified",
        warn: "",
        actual: {
            0: {
                note: "test options: none\nthis undefined",
                expected: {
                    args: [],
                    ctx: "@not specified@",
                    results: "@not specified@"
                },
                ctxRequired: true,
                args: [],
                display_args: "<pre><i>Array </i> @undefined@\n</pre>",
                ctx: {
                    "@JSON_escapeMarker@": "$.83.actual.84.92.actual.0.ctx=undefined"
                },
                errmsg: "\"this\" not same type as function prototype",
                testno: 5,
                display_expected: "@no expected values supplied@",
                results: "@test not run@",
                ctxOk: true,
                argsOk: true,
                testOk: false,
                display_results: "@test not run@",
                ok: false,
                used: true
            },
            1: {
                note: "test options: none\nthis undefined",
                expected: {
                    args: [],
                    ctx: "@not specified@",
                    results: "@not specified@"
                },
                ctxRequired: true,
                args: [],
                display_args: "<pre><i>Array </i> @undefined@\n</pre>",
                ctx: {
                    "@JSON_escapeMarker@": "$.83.actual.84.92.actual.1.ctx=undefined"
                },
                errmsg: "\"this\" not same type as function prototype",
                testno: 5,
                display_expected: "@no expected values supplied@",
                results: "@test not run@",
                ctxOk: true,
                argsOk: true,
                testOk: false,
                display_results: "@test not run@",
                ok: true
            },
            results: false
        },
        expected: {
            results: false
        },
        saveDateTime: "11-22-2016 08:29:03 pm"
    },
    {
        ok: true,
        testno: 94,
        id: "arg1=1st arg (x):[2,11,b,a],1st arg (x)[2]:1st,1st arg (x)[11]:2nd,1st arg (x).b:4th,1st arg (x).a:3rd,arg2=2nd arg (y):[2,11,a,b],2nd arg (y)[2]:1st,2nd arg (y)[11]:2nd,2nd arg (y).a:3rd,2nd arg (y).b:4th,note:<b>livefaults:</b>created@07-05-201603:08:51pm",
        note: "<b>live faults:</b> created @ 07-05-2016 03:08:51pm",
        warn: "",
        actual: {
            0: {
                2: "1st",
                11: "2nd",
                b: "4th",
                a: "3rd"
            },
            1: {
                2: "1st",
                11: "2nd",
                a: "3rd",
                b: "4th"
            },
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:29:03 pm"
    },
    {
        ok: true,
        testno: 95,
        id: "arg1=1st arg (new Date(######)):[],arg2=2nd arg (new Date(######)):[],note:<b>livefaults:</b>invaliddatesshouldbeequal",
        note: "<b>live faults:</b> invalid dates should be equal",
        warn: "",
        actual: {
            0: {
                "@JSON_escapeMarker@": "$.83.94.actual.0=new Date('''')"
            },
            1: {
                "@JSON_escapeMarker@": "$.83.94.actual.1=new Date('''')"
            },
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:29:04 pm"
    },
    {
        ok: true,
        testno: 96,
        id: "arg1=1st arg (x):[children,objects,functions,maxdepth],1st arg (x).children:true,1st arg (x).objects:[],1st arg (x).functions:false,1st arg (x).maxdepth:4,arg2=2nd arg (y):[children,objects,functions,maxdepth],2nd arg (y).children:true,2nd arg (y).objects:[],2nd arg (y).functions:false,2nd arg (y).maxdepth:4,note:<b>livefaults:</b>",
        note: "<b>live faults:</b> ",
        warn: "",
        actual: {
            0: {
                children: true,
                functions: false,
                maxdepth: 4
            },
            1: {
                children: true,
                objects: {
                    "@JSON_escapeMarker@": "$.83.95.actual.0.1.objects=$.83.95.actual.0.objects"
                },
                functions: false,
                maxdepth: 4
            },
            results: true
        },
        expected: {
            results: true
        },
        saveDateTime: "11-22-2016 08:29:04 pm"
    }
];JSON.plus.unescape(JSON.plus._temp);