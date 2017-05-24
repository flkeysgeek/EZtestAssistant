EZ.test.savedResults=		//Saved @ 12-26-2016 06:39:14 am
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
	'"test #20 no data"'
,
	'"test #21 no data"'
,
	'"test #22 no data"'
,
	'"test #23 no data"'
,
	'"test #24 no data"'
,
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 25,\n'
	+ '    id: "arg1=arr \\"this\\" (Array):[0,1,2,3,4,5,6],arr \\"this\\" (Array)[0]:b,arr \\"this\\" (Array)[1]:a,arr \\"this\\" (Array)[2]:A,arr \\"this\\" (Array)[3]:11,arr \\"this\\" (Array)[4]:11,arr \\"this\\" (Array)[5]:2,arr \\"this\\" (Array)[6]:2,arg2=1st arg (options):[native],1st arg (options).native:true,note:<b>sortstrings--numberssortjustaboveassociatedstring</b>nativesort()",\n'
	+ '    note: "<b>sort strings -- numbers sort just above associated string</b>\\nnative sort()\\n1st actual return arg set to <cite>feedback</cite>",\n'
	+ '    warn: "<img src=\\"../images/fn_16.png\\"><i>expected values changed by script callback fn:</i>\\narr \\"this\\" (Array)",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            isLegacy: true,\n'
	+ '            sortedNumbers: 0,\n'
	+ '            sortedStrings: 0,\n'
	+ '            options: {\n'
	+ '                native: true,\n'
	+ '                sortOrder: "ascending",\n'
	+ '                sortCase: true,\n'
	+ '                removeDups: false,\n'
	+ '                sortType: "strings (typeof[0])",\n'
	+ '                isNumbers: false,\n'
	+ '                order: -1\n'
	+ '            }\n'
	+ '        },\n'
	+ '        results: [11, "11", 2, "2", "A", "a", "b"],\n'
	+ '        ctx: [11, "11", 2, "2", "A", "a", "b"]\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        0: {\n'
	+ '            isLegacy: true,\n'
	+ '            sortedNumbers: 0,\n'
	+ '            sortedStrings: 0,\n'
	+ '            options: {\n'
	+ '                native: true,\n'
	+ '                sortOrder: "ascending",\n'
	+ '                sortCase: true,\n'
	+ '                removeDups: false,\n'
	+ '                sortType: "strings (typeof[0])",\n'
	+ '                isNumbers: false,\n'
	+ '                order: -1\n'
	+ '            }\n'
	+ '        },\n'
	+ '        results: [11, "11", 2, "2", "A", "a", "b"],\n'
	+ '        ctx: [11, "11", 2, "2", "A", "a", "b"]\n'
	+ '    },\n'
	+ '    saveDateTime: "12-26-2016 06:39:13 am"\n'
	+ '}'
,
	'"test #26 no data"'
,
	'"test #27 no data"'
,
	'"test #28 no data"'
,
	'"test #29 no data"'
,
	'"test #30 no data"'
,
	'"test #31 no data"'
,
	'"test #32 no data"'
,

,
{
    ok: true,
    testno: 3,
    id: "arg1= \"this\" (Array):[0,1], \"this\" (Array)[0]:11, \"this\" (Array)[1]:2,note:<b>sortnumbers--stringssortafternumbers</b>",
    note: "<b>sort numbers -- strings sort after numbers</b>\n",
    warn: "<img src=\"../images/fn_16.png\"><i>expected values changed by script callback fn:</i>\n \"this\" (Array)",
    actual: {
        results: ["2", "11"],
        ctx: ["2", "11"]
    },
    expected: {
        results: ["2", "11"],
        ctx: ["2", "11"]
    },
    saveDateTime: "12-26-2016 01:03:17 am"
}
]