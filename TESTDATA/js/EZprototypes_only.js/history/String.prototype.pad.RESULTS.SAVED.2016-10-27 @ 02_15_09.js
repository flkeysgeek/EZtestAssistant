EZ.test.savedResults=		//Saved @ 10-27-2016 02:15:09 am
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
        saveDateTime: "10-25-2016 05:37:13 pm",
        saveError: "",
        changedDetail: {}
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
        saveDateTime: "10-25-2016 05:42:20 pm",
        saveError: "",
        changedDetail: {}
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
        saveDateTime: "10-25-2016 05:42:25 pm",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 5,
        id: "arg1=\"this\" (String):1,arg2=1st arg (size):000,note:",
        note: "",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>size</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: "length: 3",
            results: "001",
            ctx: "1"
        },
        expected: {
            0: "length: 3",
            results: "001"
        },
        saveDateTime: "10-26-2016 12:58:25 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 6,
        id: "arg1=\"this\" (String):1,arg2=1st arg (size):...,note:",
        note: "",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>size</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: "length: 3",
            results: "..1",
            ctx: "1"
        },
        expected: {
            0: "length: 3",
            results: "..1"
        },
        saveDateTime: "10-26-2016 01:02:29 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 7,
        id: "arg1=\"this\" (String):1,arg2=1st arg (size):2,arg3=2nd arg (ch):0,note:",
        note: "",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>size</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: "length: 2",
            1: "0",
            results: "10",
            ctx: "1"
        },
        expected: {
            0: "length: 2",
            results: "10"
        },
        saveDateTime: "10-26-2016 01:05:19 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 8,
        id: "arg1=\"this\" (String):12,arg2=1st arg (size):2,arg3=2nd arg (ch):0,note:",
        note: "",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>size</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: "length: 2",
            1: "0",
            results: "12",
            ctx: "12"
        },
        expected: {
            0: "length: 2",
            results: "12"
        },
        saveDateTime: "10-26-2016 01:40:32 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 9,
        id: "arg1=\"this\" (String):123,arg2=1st arg (size):2,arg3=2nd arg (ch):0,note:",
        note: "",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>size</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: "length: 2",
            1: "0",
            results: "12",
            ctx: "123"
        },
        expected: {
            0: "length: 2",
            results: "12"
        },
        saveDateTime: "10-26-2016 01:40:45 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 8,
        id: "arg1=\"this\" (String):1,arg2=1st arg (size):-2,arg3=2nd arg (ch):0,note:",
        note: "",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>size</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: "length: 2",
            1: "0",
            results: "01",
            ctx: "1"
        },
        expected: {
            0: "length: 2",
            results: "01"
        },
        saveDateTime: "10-26-2016 01:06:01 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 11,
        id: "arg1=\"this\" (String):12,arg2=1st arg (size):-2,arg3=2nd arg (ch):0,note:",
        note: "",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>size</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: "length: 2",
            1: "0",
            results: "12",
            ctx: "12"
        },
        expected: {
            0: "length: 2",
            results: "12"
        },
        saveDateTime: "10-27-2016 01:42:51 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 12,
        id: "arg1=\"this\" (String):123,arg2=1st arg (size):-2,arg3=2nd arg (ch):0,note:",
        note: "",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>size</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: "length: 2",
            1: "0",
            results: "23",
            ctx: "123"
        },
        expected: {
            0: "length: 2",
            results: "23"
        },
        saveDateTime: "10-27-2016 01:40:52 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 9,
        id: "arg1=\"this\" (String):123,arg2=1st arg (size):2,arg3=2nd arg (ch):0,note:",
        note: "",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>size</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: "length: 2",
            1: "0",
            results: "12",
            ctx: "123"
        },
        expected: {
            0: "length: 2",
            results: "12"
        },
        saveDateTime: "10-26-2016 01:40:45 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 9,
        id: "arg1=\"this\" (Number):1,arg2=1st arg (size):2,note:",
        note: "",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>size</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: "length: 2",
            results: "1 ",
            ctx: 1
        },
        expected: {
            0: "length: 2",
            results: "1 "
        },
        saveDateTime: "10-27-2016 02:02:18 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 15,
        id: "arg1=\"this\" (Number):1,arg2=1st arg (size):-2,note:",
        note: "",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>size</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: "length: 2",
            results: "01",
            ctx: 1
        },
        expected: {
            0: "length: 2",
            results: "01"
        },
        saveDateTime: "10-27-2016 02:09:07 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 15,
        id: "arg1=\"this\" (Number):12,arg2=1st arg (size):2,note:",
        note: "",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>size</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: "length: 2",
            results: "12",
            ctx: 12
        },
        expected: {
            0: "length: 2",
            results: "12"
        },
        saveDateTime: "10-27-2016 02:02:46 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 17,
        id: "arg1=\"this\" (Number):12,arg2=1st arg (size):3,note:",
        note: "",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>size</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: "length: 3",
            results: "12 ",
            ctx: 12
        },
        expected: {
            0: "length: 3",
            results: "12 "
        },
        saveDateTime: "10-27-2016 02:15:09 am"
    },
    "test #18 no data", 
    "test #19 no data", 
    "test #20 no data", 
    "test #21 no data", 
    "test #22 no data", 
    "test #23 no data", 
    "test #24 no data", 
    "test #25 no data", 
    "test #26 no data", 
    "test #27 no data"
]