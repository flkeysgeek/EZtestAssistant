EZ.test.savedResults=		//Saved @ 11-23-2016 06:00:20 pm
JSON.plus._temp=[
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
                "@JSON_escapeMarker@:$.0.expected.2=$.0.actual.2"
            ],
            results: false
        },
        saveDateTime: "11-23-2016 06:00:20 pm",
        json: "JSON.plus._temp={\\n'\n\t+ '    ok: true,\\n'\n\t+ '    testno: 1,\\n'\n\t+ '    id: \"arg1=1st arg (x):[a,b],1st arg (x).a:1,1st arg (x).b:2,arg2=2nd arg (y):[a,b],2nd arg (y).a:0,2nd arg (y).b:,arg3=3rd arg (showDiff):[showDiff],3rd arg (showDiff).showDiff:true,note:<b>showDifftests:</b>easytest\",\\n'\n\t+ '    note: \"<b>showDiff tests:</b> easy test\\\\nreturn value for 3rd arg set to <cite>showDiff log</cite>\",\\n'\n\t+ '    warn: \"\",\\n'\n\t+ '    actual: {\\n'\n\t+ '        0: {\\n'\n\t+ '            a: 1,\\n'\n\t+ '            b: 2\\n'\n\t+ '        },\\n'\n\t+ '        1: {\\n'\n\t+ '            a: 0,\\n'\n\t+ '            b: \"\"\\n'\n\t+ '        },\\n'\n\t+ '        2: [\\n'\n\t+ '            \"1st [Object] \\\\t ... 2nd [Object]\",\\n'\n\t+ '            \"  .a: 1 \\\\t !== 0\",\\n'\n\t+ '            \"  .b: 2 \\\\t !== •empty string•\"\\n'\n\t+ '        ],\\n'\n\t+ '        results: false\\n'\n\t+ '    },\\n'\n\t+ '    expected: {\\n'\n\t+ '        2: [\\n'\n\t+ '            \"@JSON_escapeMarker@:$.expected.2=$.actual.2\"\\n'\n\t+ '        ],\\n'\n\t+ '        results: false\\n'\n\t+ '    },\\n'\n\t+ '    saveDateTime: \"11-23-2016 06:00:20 pm\",\\n'\n\t+ '    used: true\\n'\n\t+ '};JSON.plus.unescape(JSON.plus._temp);"
    }
];JSON.plus.unescape(JSON.plus._temp);