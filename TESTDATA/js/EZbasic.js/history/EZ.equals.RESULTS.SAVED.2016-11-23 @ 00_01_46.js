EZ.test.savedResults=		//Saved @ 11-23-2016 12:01:46 am
JSON.plus._temp=[
    {
        ok: true,
        testno: 1,
        id: "arg1=1st arg (x):[a,b],1st arg (x).a:1,1st arg (x).b:2,arg2=2nd arg (y):[a,b],2nd arg (y).a:0,2nd arg (y).b:,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>showDifftests:</b>easytest",
        note: "<b>showDiff tests:</b> easy test\n<cite>showDiff log</cite> (3rd arg) return value set to \"showDiff log\"",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
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
        saveDateTime: "11-23-2016 12:01:46 am"
    }
];JSON.plus.unescape(JSON.plus._temp);