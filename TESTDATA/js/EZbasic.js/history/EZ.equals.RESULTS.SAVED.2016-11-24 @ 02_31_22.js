EZ.test.savedResults=		//Saved @ 11-24-2016 02:31:22 am
[
{
    ok: true,
    testno: 1,
    id: "arg1=1st arg (x):[a,b],1st arg (x).a:1,1st arg (x).b:2,arg2=2nd arg (y):[a,b],2nd arg (y).a:0,2nd arg (y).b:,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>showDifftests:</b>easytest",
    note: "<b>showDiff tests:</b> easy test\nreturn value for 3rd arg set to <cite>showDiff log</cite>",
    warn: "3rd arg <cite>showDiff</cite> NOT expected Array\n",
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
    },
    saveDateTime: "11-24-2016 02:30:13 am",
    saveError: "",
    changedDetail: {},
    used: true
}
+ '',
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
	+ '            "@JSON_escapeMarker@:$.expected.2=$.actual.2"\n'
	+ '        ],\n'
	+ '        results: false\n'
	+ '    },\n'
	+ '    saveDateTime: "11-23-2016 07:30:12 pm",\n'
	+ '    saveError: "",\n'
	+ '    changedDetail: {}\n'
	+ '}'
]