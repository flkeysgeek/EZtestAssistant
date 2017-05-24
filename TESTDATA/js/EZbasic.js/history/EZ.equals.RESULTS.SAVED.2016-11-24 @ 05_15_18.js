EZ.test.savedResults=		//Saved @ 11-24-2016 05:15:18 am
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
    },
    saveDateTime: "11-24-2016 04:23:19 am",
    used: true
}
]