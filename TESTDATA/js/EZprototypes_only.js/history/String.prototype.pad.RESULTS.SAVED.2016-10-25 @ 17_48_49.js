EZ.test.savedResults=		//Saved @ 10-25-2016 05:48:49 pm
[
    {
        ok: true,
        testno: 1,
        id: "arg1=\"this\" (String):abc,arg2=1st arg (size):10,note:",
        note: "",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "length: 10",
            results: "abc       ",
            ctx: "abc"
        },
        expected: {
            0: "length: 10",
            results: "abc       "
        },
        saveDateTime: "10-25-2016 05:33:45 pm",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 2,
        id: "arg1=\"this\" (String):xyz,arg2=1st arg (size):-10,note:",
        note: "",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>size</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: "length: 10",
            results: "       xyz",
            ctx: "xyz"
        },
        expected: {
            0: "length: 10",
            results: "       xyz"
        },
        saveDateTime: "10-25-2016 05:37:13 pm"
    },
    {
        ok: true,
        testno: 3,
        id: "arg1=\"this\" (String):abc,arg2=1st arg (size):5,arg3=2nd arg (ch):0,note:",
        note: "",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>size</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: "length: 5",
            1: "0",
            results: "abc00",
            ctx: "abc"
        },
        expected: {
            0: "length: 5",
            results: "abc00"
        },
        saveDateTime: "10-25-2016 05:42:20 pm"
    },
    {
        ok: true,
        testno: 4,
        id: "arg1=\"this\" (String):abc,arg2=1st arg (size):-5,arg3=2nd arg (ch):0,note:",
        note: "",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>size</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: "length: 5",
            1: "0",
            results: "00abc",
            ctx: "abc"
        },
        expected: {
            0: "length: 5",
            results: "00abc"
        },
        saveDateTime: "10-25-2016 05:42:25 pm"
    },
    {
        ok: false,
        testno: 5,
        id: "arg1=\"this\" (String):1,arg2=1st arg (size):000,note:",
        note: "",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>size</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: "length: 3",
            results: "100",
            ctx: "1"
        },
        expected: {
            0: "length: 3",
            results: "100"
        },
        saveDateTime: "10-25-2016 05:48:49 pm"
    },
    "test #6 no data", 
    "test #7 no data", 
    "test #8 no data", 
    "test #9 no data", 
    "test #10 no data", 
    "test #11 no data", 
    "test #12 no data", 
    "test #13 no data"
]