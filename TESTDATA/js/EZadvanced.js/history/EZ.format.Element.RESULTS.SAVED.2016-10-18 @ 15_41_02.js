EZ.test.savedResults=		//Saved @ 10-18-2016 03:41:02 pm
[
    {
        ok: true,
        testno: 1,
        id: "arg1=1st arg (el):EZtest_div1,arg2=2nd arg (options):[extract,format],2nd arg (options).extract:basic,2nd arg (options).format:json,note:",
        note: "",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "EZtest_div1",
            1: "<div style=\"white-space: normal;\">&lt;div id=\"EZtest_div1\"></div>",
            results: "{\n    tagName: \"div\",\n    id: \"EZtest_div1\"\n}"
        },
        expected: {
            1: "<div style=\"white-space: normal;\">&lt;div id=\"EZtest_div1\"></div>",
            results: "{\n    tagName: \"div\",\n    id: \"EZtest_div1\"\n}"
        },
        saveDateTime: "10-18-2016 12:25:05 pm",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 2,
        id: "arg1=1st arg (el):historyOptionsPopup,arg2=2nd arg (options):[extract,format],2nd arg (options).extract:basic,2nd arg (options).format:object,note:<b>historyOptionsPopup</b>",
        note: "<b>historyOptionsPopup</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "historyOptionsPopup",
            1: "<div style=\"white-space: normal;\">&lt;div id=\"historyOptionsPopup\"></div>",
            results: {
                tagName: "div",
                id: "historyOptionsPopup"
            }
        },
        expected: {
            1: "<div style=\"white-space: normal;\">&lt;div id=\"historyOptionsPopup\"></div>",
            results: {
                tagName: "div",
                id: "historyOptionsPopup"
            }
        },
        saveDateTime: "10-18-2016 12:31:45 pm",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: false,
        testno: 3,
        id: "arg1=1st arg (el):historyOptionsPopup,arg2=2nd arg (options):[extract,format],2nd arg (options).extract:all,2nd arg (options).format:object,note:<b>historyOptionsPopup</b>",
        note: "<b>historyOptionsPopup</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "historyOptionsPopup",
            1: "<div style=\"white-space: normal;\">&lt;div id=\"historyOptionsPopup\"></div>",
            results: {
                tagName: "div",
                id: "historyOptionsPopup"
            }
        },
        expected: {
            1: "<div style=\"white-space: normal;\">&lt;div id=\"historyOptionsPopup\"></div>",
            results: {
                tagName: "div",
                id: "historyOptionsPopup"
            }
        },
        saveDateTime: "10-18-2016 03:41:01 pm",
        saveError: "",
        changedDetail: {}
    }
]