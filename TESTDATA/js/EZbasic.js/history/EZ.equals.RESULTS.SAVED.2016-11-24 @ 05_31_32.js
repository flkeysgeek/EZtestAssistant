EZ.test.savedResults=		//Saved @ 11-24-2016 05:31:32 am
[
{
    ok: true,
    testno: 1,
    id: "arg1=1st arg (x):[a,b],1st arg (x).a:1,1st arg (x).b:2,arg2=2nd arg (y):[a,b],2nd arg (y).a:0,2nd arg (y).b:,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>showDifftests:</b>easytest",
    note: "<b>showDiff tests:</b> easy test\nreturn value for 3rd arg set to <cite>showDiff log</cite>",
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
            "1st [Object] \t ... 2nd [Object]",
            "  .a: 1 \t !== 0",
            "  .b: 2 \t !== •empty string•"
        ],
        results: false
    }
}
,
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 2,\n'
	+ '    id: "arg1=1st arg (x):[a,b],1st arg (x).a:1,1st arg (x).b:2,arg2=2nd arg (y):[a,b],2nd arg (y).a:0,2nd arg (y).b:,arg3=3rd arg (options):[showDiff,neq],3rd arg (options).showDiff:true,3rd arg (options).neq:is,note:<b>showDifftests:</b>easytestoptions.neq=\\"not\\"",\n'
	+ '    note: "<b>showDiff tests:</b> easy test options.neq = \\"not\\"\\nreturn value for 3rd arg set to <cite>showDiff log</cite>",\n'
	+ '    warn: "",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            a: 1,\n'
	+ '            b: 2\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            a: 0,\n'
	+ '            b: ""\n'
	+ '        },\n'
	+ '        2: [\n'
	+ '            "1st [Object] \\t .. 2nd [Object]",\n'
	+ '            "  .a: 1 \\t is 0",\n'
	+ '            "  .b: 2 \\t is •empty string•"\n'
	+ '        ],\n'
	+ '        results: false\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        2: [\n'
	+ '            "1st [Object] \\t .. 2nd [Object]",\n'
	+ '            "  .a: 1 \\t is 0",\n'
	+ '            "  .b: 2 \\t is •empty string•"\n'
	+ '        ],\n'
	+ '        results: false\n'
	+ '    }\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 3,\n'
	+ '    id: "arg1=1st arg (x):[a,b],1st arg (x).a:1,1st arg (x).b:2,arg2=2nd arg (y):[a,b],2nd arg (y).a:0,2nd arg (y).b:,arg3=3rd arg (options):[],note:<b>showDifftests:</b>noshowDiffoption",\n'
	+ '    note: "<b>showDiff tests:</b> no showDiff option\\nshowDiff not specified",\n'
	+ '    warn: "",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            a: 1,\n'
	+ '            b: 2\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            a: 0,\n'
	+ '            b: ""\n'
	+ '        },\n'
	+ '        2: {},\n'
	+ '        results: false\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        results: false\n'
	+ '    }\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 4,\n'
	+ '    id: "arg1=1st arg (x):[a,b],1st arg (x).a:1,1st arg (x).b:2,arg2=2nd arg (y):[a,b],2nd arg (y).a:0,2nd arg (y).b:,note:<b>showDifftests:</b>nortnValue",\n'
	+ '    note: "<b>showDiff tests:</b> no rtnValue\\nshowDiff not specified",\n'
	+ '    warn: "",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            a: 1,\n'
	+ '            b: 2\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            a: 0,\n'
	+ '            b: ""\n'
	+ '        },\n'
	+ '        results: false\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        results: false\n'
	+ '    }\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 5,\n'
	+ '    id: "arg1=1st arg (x):[a,b],1st arg (x).a:1,1st arg (x).b:2,arg2=2nd arg (y):[a,b],2nd arg (y).a:0,2nd arg (y).b:,arg3=3rd arg (options):6,note:<b>showDifftests:</b>showDifftrueforNumberbutnortnValue",\n'
	+ '    note: "<b>showDiff tests:</b> showDiff true for Number but no rtnValue\\nreturn value for 3rd arg set to <cite>showDiff log</cite>",\n'
	+ '    warn: "",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            a: 1,\n'
	+ '            b: 2\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            a: 0,\n'
	+ '            b: ""\n'
	+ '        },\n'
	+ '        2: [\n'
	+ '            "1st [Object] \\t ... 2nd [Object]",\n'
	+ '            "  .a: 1 \\t !== 0",\n'
	+ '            "  .b: 2 \\t !== •empty string•"\n'
	+ '        ],\n'
	+ '        results: false\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        2: [\n'
	+ '            "1st [Object] \\t ... 2nd [Object]",\n'
	+ '            "  .a: 1 \\t !== 0",\n'
	+ '            "  .b: 2 \\t !== •empty string•"\n'
	+ '        ],\n'
	+ '        results: false\n'
	+ '    }\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 6,\n'
	+ '    id: "arg1=1st arg (x):[numbers],1st arg (x).numbers:[0,1],1st arg (x).numbers[0]:0,1st arg (x).numbers[1]:1,arg2=2nd arg (y):[numbers],2nd arg (y).numbers:[0],2nd arg (y).numbers[0]:0,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>showDifftests:</b>diffarraylength",\n'
	+ '    note: "<b>showDiff tests:</b> diff array length\\nreturn value for 3rd arg set to <cite>showDiff log</cite>",\n'
	+ '    warn: "",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            numbers: [\n'
	+ '                0,\n'
	+ '                1\n'
	+ '            ]\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            numbers: [\n'
	+ '                0\n'
	+ '            ]\n'
	+ '        },\n'
	+ '        2: [\n'
	+ '            "1st [Object] \\t ... 2nd [Object]",\n'
	+ '            "  .numbers *keys do not match*",\n'
	+ '            "   +{1:} \\t ... na",\n'
	+ '            "  .numbers: [ObjectLike] \\t !== [ObjectLike]"\n'
	+ '        ],\n'
	+ '        results: false\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        2: [\n'
	+ '            "1st [Object] \\t ... 2nd [Object]",\n'
	+ '            "  .numbers *keys do not match*",\n'
	+ '            "   +{1:} \\t ... na",\n'
	+ '            "  .numbers: [ObjectLike] \\t !== [ObjectLike]"\n'
	+ '        ],\n'
	+ '        results: false\n'
	+ '    }\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 7,\n'
	+ '    id: "arg1=1st arg (x):[0,1],1st arg (x)[0]:0,1st arg (x)[1]:1,arg2=2nd arg (y):[0],2nd arg (y)[0]:0,arg3=3rd arg (options):[showDiff],3rd arg (options).showDiff:true,note:<b>showDifftests:</b>diffarraylength",\n'
	+ '    note: "<b>showDiff tests:</b> diff array length\\nreturn value for 3rd arg set to <cite>showDiff log</cite>",\n'
	+ '    warn: "",\n'
	+ '    actual: {\n'
	+ '        0: [\n'
	+ '            0,\n'
	+ '            1\n'
	+ '        ],\n'
	+ '        1: [\n'
	+ '            0\n'
	+ '        ],\n'
	+ '        2: [\n'
	+ '            "1st [ObjectLike] \\t ... 2nd [Array]",\n'
	+ '            "   *keys do not match*",\n'
	+ '            "   +{1:} \\t ... na",\n'
	+ '            "[ObjectLike] \\t !== [ObjectLike]"\n'
	+ '        ],\n'
	+ '        results: false\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        2: [\n'
	+ '            "1st [ObjectLike] \\t ... 2nd [Array]",\n'
	+ '            "   *keys do not match*",\n'
	+ '            "   +{1:} \\t ... na",\n'
	+ '            "[ObjectLike] \\t !== [ObjectLike]"\n'
	+ '        ],\n'
	+ '        results: false\n'
	+ '    }\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 8,\n'
	+ '    id: "arg1=1st arg (x):[a,b,c],1st arg (x).a:[0],1st arg (x).a[0]:0,1st arg (x).b:2,1st arg (x).c:false,arg2=2nd arg (y):[b,c,a],2nd arg (y).b:2,2nd arg (y).c:false,2nd arg (y).a:[0],2nd arg (y).a[0]:0,arg3=3rd arg (options):[showDiff,keys],3rd arg (options).showDiff:true,3rd arg (options).keys:sameorder,note:<b>showDifftests:</b>keysnotinsameorder",\n'
	+ '    note: "<b>showDiff tests:</b> keys not in same order\\nreturn value for 3rd arg set to <cite>showDiff log</cite>",\n'
	+ '    warn: "",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            a: [\n'
	+ '                0\n'
	+ '            ],\n'
	+ '            b: 2,\n'
	+ '            c: false\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            b: 2,\n'
	+ '            c: false,\n'
	+ '            a: [\n'
	+ '                0\n'
	+ '            ]\n'
	+ '        },\n'
	+ '        2: [\n'
	+ '            "1st [Object] \\t ... 2nd [Object]",\n'
	+ '            "   *keys diff order*",\n'
	+ '            "   {a:} \\t ... {b:}",\n'
	+ '            "   {b:} \\t ... {c:}",\n'
	+ '            "   {c:} \\t ... {a:}",\n'
	+ '            "[Object] \\t !== [Object]"\n'
	+ '        ],\n'
	+ '        results: false\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        2: [\n'
	+ '            "1st [Object] \\t ... 2nd [Object]",\n'
	+ '            "   *keys diff order*",\n'
	+ '            "   {a:} \\t ... {b:}",\n'
	+ '            "   {b:} \\t ... {c:}",\n'
	+ '            "   {c:} \\t ... {a:}",\n'
	+ '            "[Object] \\t !== [Object]"\n'
	+ '        ],\n'
	+ '        results: false\n'
	+ '    }\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 9,\n'
	+ '    id: "arg1=1st arg (x):[b,c,a],1st arg (x).b:2,1st arg (x).c:\\r,1st arg (x).a:[0],1st arg (x).a[0]:0,arg2=2nd arg (y):[b,c,d,a,],2nd arg (y).b:2,2nd arg (y).c:false,2nd arg (y).d:4,2nd arg (y).a:[0],2nd arg (y).a[0]:0,2nd arg (y)[]:,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>showDifftests:</b>",\n'
	+ '    note: "<b>showDiff tests:</b> \\nreturn value for 3rd arg set to <cite>showDiff log</cite>",\n'
	+ '    warn: "",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            b: 2,\n'
	+ '            c: "\\r",\n'
	+ '            a: [\n'
	+ '                0\n'
	+ '            ]\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            b: "2",\n'
	+ '            c: false,\n'
	+ '            d: 4,\n'
	+ '            a: [\n'
	+ '                0\n'
	+ '            ],\n'
	+ '            "": ""\n'
	+ '        },\n'
	+ '        2: [\n'
	+ '            "1st [Object] \\t ... 2nd [Object]",\n'
	+ '            "   *keys do not match*",\n'
	+ '            "   na \\t ... +{d:}",\n'
	+ '            "   na \\t ... +{\\"\\":}",\n'
	+ '            "[Object] \\t !== [Object]"\n'
	+ '        ],\n'
	+ '        results: false\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        2: [\n'
	+ '            "1st [Object] \\t ... 2nd [Object]",\n'
	+ '            "   *keys do not match*",\n'
	+ '            "   na \\t ... +{d:}",\n'
	+ '            "   na \\t ... +{\\"\\":}",\n'
	+ '            "[Object] \\t !== [Object]"\n'
	+ '        ],\n'
	+ '        results: false\n'
	+ '    }\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 10,\n'
	+ '    id: "arg1=1st arg (x):[o],1st arg (x).o:{},arg2=2nd arg (y):[o],2nd arg (y).o:[],arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>showDifftests:</b>",\n'
	+ '    note: "<b>showDiff tests:</b> \\nreturn value for 3rd arg set to <cite>showDiff log</cite>",\n'
	+ '    warn: "",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            o: "{}"\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            o: {}\n'
	+ '        },\n'
	+ '        2: [\n'
	+ '            "1st [Object] \\t ... 2nd [Object]",\n'
	+ '            "  .o: \\"{}\\" \\t !== [Object]"\n'
	+ '        ],\n'
	+ '        results: false\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        2: [\n'
	+ '            "1st [Object] \\t ... 2nd [Object]",\n'
	+ '            "  .o: \\"{}\\" \\t !== [Object]"\n'
	+ '        ],\n'
	+ '        results: false\n'
	+ '    }\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 11,\n'
	+ '    id: "arg1=1st arg (x):[1,,a,b,aa],1st arg (x)[1]:1,1st arg (x)[]:1,1st arg (x).a:1,1st arg (x).b:2,1st arg (x).aa:[0,1],1st arg (x).aa[0]:0,1st arg (x).aa[1]:1,arg2=2nd arg (y):[0,1,b,c,aa],2nd arg (y)[0]:1,2nd arg (y)[1]:1,2nd arg (y).b:2,2nd arg (y).c:3,2nd arg (y).aa:[0],2nd arg (y).aa[0]:0,arg3=3rd arg (options):true,note:<b>showDifftests:</b>",\n'
	+ '    note: "<b>showDiff tests:</b> \\nreturn value for 3rd arg set to <cite>showDiff log</cite>",\n'
	+ '    warn: "",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            1: 1,\n'
	+ '            "": 1,\n'
	+ '            a: 1,\n'
	+ '            b: 2,\n'
	+ '            aa: [\n'
	+ '                0,\n'
	+ '                1\n'
	+ '            ]\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            0: 1,\n'
	+ '            1: 1,\n'
	+ '            b: 2,\n'
	+ '            c: 3,\n'
	+ '            aa: [\n'
	+ '                0\n'
	+ '            ]\n'
	+ '        },\n'
	+ '        2: [\n'
	+ '            "1st [Object] \\t ... 2nd [Object]",\n'
	+ '            "   *keys do not match*",\n'
	+ '            "   +{\\"\\":} \\t ... +{0:}",\n'
	+ '            "   +{a:} \\t ... +{c:}",\n'
	+ '            "[Object] \\t !== [Object]"\n'
	+ '        ],\n'
	+ '        results: false\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        2: [\n'
	+ '            "1st [Object] \\t ... 2nd [Object]",\n'
	+ '            "   *keys do not match*",\n'
	+ '            "   +{\\"\\":} \\t ... +{0:}",\n'
	+ '            "   +{a:} \\t ... +{c:}",\n'
	+ '            "[Object] \\t !== [Object]"\n'
	+ '        ],\n'
	+ '        results: false\n'
	+ '    }\n'
	+ '}'
]