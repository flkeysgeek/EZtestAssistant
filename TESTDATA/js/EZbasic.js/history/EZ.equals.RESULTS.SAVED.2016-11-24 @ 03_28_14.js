EZ.test.savedResults=		//Saved @ 11-24-2016 03:28:14 am
[
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 1,\n'
	+ '    id: "arg1=1st arg (x):[a,b],1st arg (x).a:1,1st arg (x).b:2,arg2=2nd arg (y):[a,b],2nd arg (y).a:0,2nd arg (y).b:,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>showDifftests:</b>easytest",\n'
	+ '    note: "<b>showDiff tests:</b> easy test\\nreturn value for 3rd arg set to <cite>showDiff log</cite>",\n'
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
	+ '            "@JSON_escapeMarker@:$.expected.2=$.actual.2"\n'
	+ '        ],\n'
	+ '        results: false\n'
	+ '    },\n'
	+ '    saveDateTime: "11-24-2016 03:27:55 am",\n'
	+ '    used: true\n'
	+ '}'
,
	'"test #2 no data"'
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
	+ '    },\n'
	+ '    saveDateTime: "11-24-2016 03:28:13 am",\n'
	+ '    used: true\n'
	+ '}'
,
	'"test #4 no data"'
,
	'"test #5 no data"'
]