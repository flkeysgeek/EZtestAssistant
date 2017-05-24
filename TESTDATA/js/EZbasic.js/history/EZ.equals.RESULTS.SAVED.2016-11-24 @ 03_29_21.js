EZ.test.savedResults=		//Saved @ 11-24-2016 03:29:21 am
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
            "@JSON_escapeMarker@:$.expected.2=$.actual.2"
        ],
        results: false
    },
    saveDateTime: "11-24-2016 03:27:55 am",
    used: true
}
,
	'"test #2 no data"'
,
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
    saveDateTime: "11-24-2016 03:28:13 am",
    used: true
}
,
	'"test #4 no data"'
,
	'"test #5 no data"'
]