EZ.test.savedResults=		//Saved @ 11-04-2016 06:06:07 pm
JSON._temp=[
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    {
        ok: true,
        testno: 10,
        id: "arg1=1st arg (obj):[a,b],1st arg (obj).a:1,1st arg (obj).b:[0,1,2],1st arg (obj).b[0]:0,1st arg (obj).b[1]:1,1st arg (obj).b[2]:{1st arg (obj)},arg2=2nd arg (replacer):native,note:<b>simpleJSON.stringify()circularobjects</b>",
        note: "<b>simple JSON.stringify() circular objects</b>\n\n<em>1st expected argument is Object created from json</em>\n<b>returned json GOOD -- expected results set to actual<b><pre>[Object]: \n   circularList (Array) (length=1):\n     [0]: \"$.b.2=$\"\n   objectList (Array) (length=2):\n     [0]: \"$\"\n     [1]: \"$.b\"\n</pre>",
        warn: "<i>expected values changed by test script</i>",
        actual: {
            0: {
                a: 1,
                b: [
                    0,
                    1,
                    {
                        "@circular@": "$.9.actual.0.b.2=$.9.actual.0"
                    }
                ]
            },
            1: "native",
            results: "JSON._temp={\n    a: 1,\n    b: [\n        0,\n        1,\n        {\n            \"@circular@\": \"$.b.2=$\"\n        }\n    ]\n};JSON.setCircular(JSON._temp)"
        },
        expected: {
            results: "JSON._temp={\n    a: 1,\n    b: [\n        0,\n        1,\n        {\n            \"@circular@\": \"$.b.2=$\"\n        }\n    ]\n};JSON.setCircular(JSON._temp)"
        },
        saveDateTime: "11-04-2016 06:06:06 pm"
    },
    null,
    null,
    {
        ok: true,
        testno: 13,
        id: "arg1=1st arg (saveResults):[0,1,2,3,4],1st arg (saveResults)[0]:null,1st arg (saveResults)[1]:1,1st arg (saveResults)[2]:null,1st arg (saveResults)[3]:null,1st arg (saveResults)[4]:5,arg2=2nd arg (replacer):native,note:<b>saveResultsscenarios</b>",
        note: "<b>saveResults scenarios</b>\n\n<em>1st expected argument is Object created from json</em>\n<b>returned json GOOD -- expected results set to actual<b>",
        warn: "<i>expected values changed by test script</i>",
        actual: {
            0: [
                null,
                1,
                null,
                null,
                5
            ],
            1: {
                objectList: [
                    "$"
                ],
                circularList: []
            },
            results: "[\n    null,\n    1,\n    null,\n    null,\n    5\n]"
        },
        expected: {
            results: "[\n    null,\n    1,\n    null,\n    null,\n    5\n]"
        },
        saveDateTime: "11-04-2016 04:25:05 pm"
    }
];JSON.setCircular(JSON._temp)