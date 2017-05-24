EZ.test.savedResults=		//Saved @ 10-19-2016 01:39:26 am
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
        id: "arg1=1st arg (el):historyOptionsPopup,arg2=2nd arg (options):[extract,format,maxdepth,maxchild],2nd arg (options).extract:basic children,2nd arg (options).format:object,2nd arg (options).maxdepth:1,2nd arg (options).maxchild:1,note:<b>historyOptionsPopup</b>",
        note: "<b>historyOptionsPopup</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "historyOptionsPopup",
            1: "<div style=\"white-space: normal;\">&lt;div id=\"historyOptionsPopup\" class=\"helpBox hidden absolute left\">\n	<br>&lt;img src=\"../images/close.png\">\n	<br>&lt;warn>[13] more children...<br>&lt;/warn>\n<br>&lt;/div></div>",
            results: {
                tagName: "div",
                id: "historyOptionsPopup",
                class: "helpBox hidden absolute left",
                children: [
                    {
                        tagName: "img",
                        src: "../images/close.png"
                    },
                    {
                        warn: {
                            text: "[13] more children..."
                        }
                    }
                ]
            }
        },
        expected: {
            1: "<div style=\"white-space: normal;\">&lt;div id=\"historyOptionsPopup\" class=\"helpBox hidden absolute left\">\n	<br>&lt;img src=\"../images/close.png\">\n	<br>&lt;warn>[13] more children...<br>&lt;/warn>\n<br>&lt;/div></div>",
            results: {
                tagName: "div",
                id: "historyOptionsPopup",
                class: "helpBox hidden absolute left",
                children: [
                    {
                        tagName: "img",
                        src: "../images/close.png"
                    },
                    {
                        warn: {
                            text: "[13] more children..."
                        }
                    }
                ]
            }
        },
        saveDateTime: "10-19-2016 01:39:26 am"
    },
    "test #4 no data",
    {
        ok: true,
        testno: 3,
        id: "arg1=1st arg (el):historyOptionsPopup,arg2=2nd arg (options):[extract,format],2nd arg (options).extract:all,2nd arg (options).format:object,note:<b>historyOptionsPopup</b>",
        note: "<b>historyOptionsPopup</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "historyOptionsPopup",
            1: "<div style=\"white-space: normal;\">&lt;div id=\"historyOptionsPopup\" class=\"helpBox hidden absolute left\" class=\"helpBox hidden absolute left\" style=\"left: -550px; padding-left:5px\" onload=\"saveHistory().open('window.EZ.test.app.savedFile.historyTimestamp'.ov())\" onclose=\"saveHistory().update()\" onfocus=\"\"></div>",
            results: {
                tagName: "div",
                id: "historyOptionsPopup",
                class: "helpBox hidden absolute left",
                style: "left: -550px; padding-left:5px",
                onload: "saveHistory().open('window.EZ.test.app.savedFile.historyTimestamp'.ov())",
                onclose: "saveHistory().update()",
                onfocus: ""
            }
        },
        expected: {
            1: "<div style=\"white-space: normal;\">&lt;div id=\"historyOptionsPopup\" class=\"helpBox hidden absolute left\" class=\"helpBox hidden absolute left\" style=\"left: -550px; padding-left:5px\" onload=\"saveHistory().open('window.EZ.test.app.savedFile.historyTimestamp'.ov())\" onclose=\"saveHistory().update()\" onfocus=\"\"></div>",
            results: {
                tagName: "div",
                id: "historyOptionsPopup",
                class: "helpBox hidden absolute left",
                style: "left: -550px; padding-left:5px",
                onload: "saveHistory().open('window.EZ.test.app.savedFile.historyTimestamp'.ov())",
                onclose: "saveHistory().update()",
                onfocus: ""
            }
        },
        saveDateTime: "10-19-2016 01:29:42 am",
        saveError: "",
        changedDetail: {}
    }
]