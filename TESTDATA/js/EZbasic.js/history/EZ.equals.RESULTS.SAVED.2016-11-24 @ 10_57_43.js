EZ.test.savedResults=		//Saved @ 11-24-2016 10:57:43 am
[
	'"test #1 no data"'
,
	'"test #2 no data"'
,
	'"test #3 no data"'
,
	'"test #4 no data"'
,
	'"test #5 no data"'
,
	'"test #6 no data"'
,
	'"test #7 no data"'
,
	'"test #8 no data"'
,
	'"test #9 no data"'
,
	'"test #10 no data"'
,
	'"test #11 no data"'
,
	'"test #12 no data"'
,
	'"test #13 no data"'
,
	'"test #14 no data"'
,
	'"test #15 no data"'
,
	'"test #16 no data"'
,
	'"test #17 no data"'
,
	'"test #18 no data"'
,
	'"test #19 no data"'
,
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 20,\n'
	+ '    id: "arg1=1st arg (x):[0,1,extra],1st arg (x)[0]:0,1st arg (x)[1]:1,1st arg (x).extra:xyz,arg2=2nd arg (y):[0,1,extra],2nd arg (y)[0]:0,2nd arg (y)[1]:1,2nd arg (y).extra:xyz,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>testArrayLike/ObjectLike:</b>x&ydiffArrayswithnamedkeyofextrawithsamevalue",\n'
	+ '    note: "<b>test ArrayLike / ObjectLike:</b> x & y diff Arrays with named key of extra with same value",\n'
	+ '    warn: "",\n'
	+ '    actual: {\n'
	+ '        0: [\n'
	+ '            0,\n'
	+ '            1,\n'
	+ '            {\n'
	+ '                "@JSON_escapeMarker@": "$.actual.0",\n'
	+ '                extra: "xyz"\n'
	+ '            }\n'
	+ '        ],\n'
	+ '        1: [\n'
	+ '            0,\n'
	+ '            1,\n'
	+ '            {\n'
	+ '                "@JSON_escapeMarker@": "$.actual.0.1",\n'
	+ '                extra: "xyz"\n'
	+ '            }\n'
	+ '        ],\n'
	+ '        2: {\n'
	+ '            showDiff: true\n'
	+ '        },\n'
	+ '        results: true\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        results: true\n'
	+ '    },\n'
	+ '    saveDateTime: "11-24-2016 10:57:42 am"\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 21,\n'
	+ '    id: "arg1=1st arg (x):[0,1,extra],1st arg (x)[0]:0,1st arg (x)[1]:1,1st arg (x).extra:abc,arg2=2nd arg (y):[0,1,extra],2nd arg (y)[0]:0,2nd arg (y)[1]:1,2nd arg (y).extra:xyz,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>testArrayLike/ObjectLike:</b>x&ydiffArrayswithnamedkeyofextrawithdiffvalue",\n'
	+ '    note: "<b>test ArrayLike / ObjectLike:</b> x & y diff Arrays with named key of extra with diff value\\nreturn value for 3rd arg set to <cite>showDiff log</cite>",\n'
	+ '    warn: "",\n'
	+ '    actual: {\n'
	+ '        0: [\n'
	+ '            0,\n'
	+ '            1,\n'
	+ '            {\n'
	+ '                "@JSON_escapeMarker@": "$.actual.0",\n'
	+ '                extra: "abc"\n'
	+ '            }\n'
	+ '        ],\n'
	+ '        1: [\n'
	+ '            0,\n'
	+ '            1,\n'
	+ '            {\n'
	+ '                "@JSON_escapeMarker@": "$.actual.0.1",\n'
	+ '                extra: "xyz"\n'
	+ '            }\n'
	+ '        ],\n'
	+ '        2: [\n'
	+ '            "1st [ObjectLike] \\t ... 2nd [Array]",\n'
	+ '            "  .extra: \\"abc\\" \\t !== \\"xyz\\""\n'
	+ '        ],\n'
	+ '        results: false\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        2: [\n'
	+ '            "1st [ObjectLike] \\t ... 2nd [Array]",\n'
	+ '            "  .extra: \\"abc\\" \\t !== \\"xyz\\""\n'
	+ '        ],\n'
	+ '        results: false\n'
	+ '    },\n'
	+ '    saveDateTime: "11-24-2016 10:57:43 am"\n'
	+ '}'
]