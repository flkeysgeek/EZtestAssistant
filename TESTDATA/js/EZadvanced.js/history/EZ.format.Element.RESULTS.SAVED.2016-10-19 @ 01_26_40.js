EZ.test.savedResults=		//Saved @ 10-19-2016 01:26:40 am
[
    {
        ok: true,
        testno: 1,
        id: "arg1=1st arg (el):EZtest_div1,arg2=2nd arg (options):[extract,format],2nd arg (options).extract:basic,2nd arg (options).format:json,note:",
        note: "",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "EZtest_div1",
            1: "<div style=\"white-space: normal;\">&lt;div id=\"EZtest_div1\" class=\"EZtest EZtest_div_class1\"></div>",
            results: "{\n    tagName: \"div\",\n    id: \"EZtest_div1\",\n    class: \"EZtest EZtest_div_class1\"\n}"
        },
        expected: {
            1: "<div style=\"white-space: normal;\">&lt;div id=\"EZtest_div1\" class=\"EZtest EZtest_div_class1\"></div>",
            results: "{\n    tagName: \"div\",\n    id: \"EZtest_div1\",\n    class: \"EZtest EZtest_div_class1\"\n}"
        },
        saveDateTime: "10-19-2016 01:24:28 am",
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
            1: "<div style=\"white-space: normal;\">&lt;div id=\"historyOptionsPopup\" class=\"helpBox hidden absolute left\"></div>",
            results: {
                tagName: "div",
                id: "historyOptionsPopup",
                class: "helpBox hidden absolute left"
            }
        },
        expected: {
            1: "<div style=\"white-space: normal;\">&lt;div id=\"historyOptionsPopup\" class=\"helpBox hidden absolute left\"></div>",
            results: {
                tagName: "div",
                id: "historyOptionsPopup",
                class: "helpBox hidden absolute left"
            }
        },
        saveDateTime: "10-19-2016 01:26:40 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 3,
        id: "arg1=1st arg (el):historyOptionsPopup,arg2=2nd arg (options):[extract,format],2nd arg (options).extract:all,2nd arg (options).format:object,note:<b>historyOptionsPopup</b>",
        note: "<b>historyOptionsPopup</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "historyOptionsPopup",
            1: "<div style=\"white-space: normal;\">&lt;div id=\"historyOptionsPopup\" class=\"helpBox hidden absolute left\" style=\"left: -550px; padding-left:5px\" onload=\"saveHistory().open('window.EZ.test.app.savedFile.historyTimestamp'.ov())\" onclose=\"saveHistory().update()\"></div>",
            results: {
                tagName: "div",
                id: "historyOptionsPopup",
                class: "helpBox hidden absolute left",
                style: "left: -550px; padding-left:5px",
                onload: "saveHistory().open('window.EZ.test.app.savedFile.historyTimestamp'.ov())",
                onclose: "saveHistory().update()"
            }
        },
        expected: {
            1: "<div style=\"white-space: normal;\">&lt;div id=\"historyOptionsPopup\" class=\"helpBox hidden absolute left\" style=\"left: -550px; padding-left:5px\" onload=\"saveHistory().open('window.EZ.test.app.savedFile.historyTimestamp'.ov())\" onclose=\"saveHistory().update()\"></div>",
            results: {
                tagName: "div",
                id: "historyOptionsPopup",
                class: "helpBox hidden absolute left",
                style: "left: -550px; padding-left:5px",
                onload: "saveHistory().open('window.EZ.test.app.savedFile.historyTimestamp'.ov())",
                onclose: "saveHistory().update()"
            }
        },
        saveDateTime: "10-18-2016 04:23:17 pm",
        saveError: "",
        changedDetail: {}
    },
    "test #4 no data", 
    "test #5 no data"
]