EZ.test.savedResults=		//Saved @ 11-05-2016 05:58:31 am
JSON._temp=[
    "test #1 no data",
    "test #2 no data",
    "test #3 no data",
    "test #4 no data",
    "test #5 no data",
    "test #6 no data",
    {
        ok: true,
        testno: 7,
        id: "arg1=1st arg (x):[a,b],1st arg (x).a:abc,1st arg (x).b:{1st arg (x)},arg2=2nd arg (replacer):native,note:<b>simpleJSON.stringify()circularobjects</b>",
        note: "<b>simple JSON.stringify() circular objects</b>\n\n<em>1st expected argument is Object created from json</em>\n<b>returned json GOOD -- expected results set to actual<b><pre>[Object]: \n   circularList (Array) (length=1):\n     [0]: \"$.b=$\"\n   objectList (Array) (length=1):\n     [0]: \"$\"\n</pre>",
        warn: "<i>expected values changed by test script</i>",
        actual: {
            0: {
                a: "abc",
                b: {
                    "@circular@": "$.6.actual.0.b=$.6.actual.0"
                }
            },
            1: "native",
            results: "JSON._temp={\n    a: \"abc\",\n    b: {\n        \"@circular@\": \"$.b=$\"\n    }\n};JSON.setCircular(JSON._temp)"
        },
        expected: {
            results: "JSON._temp={\n    a: \"abc\",\n    b: {\n        \"@circular@\": \"$.b=$\"\n    }\n};JSON.setCircular(JSON._temp)"
        },
        saveDateTime: "11-05-2016 05:58:31 am"
    },
    "test #8 no data",
    "test #9 no data",
    "test #10 no data",
    "test #11 no data",
    "test #12 no data",
    "test #13 no data",
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
        saveDateTime: "11-04-2016 04:25:05 pm",
        saveError: "",
        changedDetail: {}
    },
    "test #15 no data",
    "test #16 no data",
    "test #17 no data",
    "test #18 no data",
    "test #19 no data",
    "test #20 no data",
    "test #21 no data",
    "test #22 no data",
    "test #23 no data",
    "test #24 no data",
    "test #25 no data",
    "test #26 no data",
    "test #27 no data",
    "test #28 no data",
    "test #29 no data",
    "test #30 no data",
    "test #31 no data",
    "test #32 no data"
];JSON.setCircular(JSON._temp)