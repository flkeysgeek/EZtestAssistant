EZ.test.savedResults=		//Saved @ 11-17-2016 04:07:48 pm
JSON.plus._temp=[
    {
        ok: true,
        testno: 1,
        id: "arg1=1st arg (obj):[0,1],1st arg (obj)[0]:0,1st arg (obj)[1]:1,arg2=2nd arg (options):[],note:easyArray",
        note: "easy Array\n<em>no clone info available</em>",
        warn: "",
        actual: {
            0: [
                0,
                1
            ],
            1: {},
            results: [
                0,
                1
            ]
        },
        expected: {
            results: [
                0,
                1
            ]
        },
        saveDateTime: "11-17-2016 08:18:14 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 2,
        id: "arg1=1st arg (div.childNodes):[0],1st arg (div.childNodes)[0]:[],arg2=2nd arg (options):[],arg3=3rd arg (info()):[_,toString,isOk,getData,save,addMessage,getMessage,addDetails,getDetails,mergeListItem,addListItem,getList,haveList],3rd arg (info())._:[success],3rd arg (info())._.success:undefined,3rd arg (info()).toString:[],3rd arg (info()).isOk:[],3rd arg (info()).getData:[],3rd arg (info()).save:[],3rd arg (info()).addMessage:[],3rd arg (info()).getMessage:[],3rd arg (info()).addDetails:[],3rd arg (info()).getDetails:[],3rd arg (info()).mergeListItem:[],3rd arg (info()).addListItem:[],3rd arg (info()).getList:[],3rd arg (info()).haveList:[],note:<b>html</b>NodeList:singlespan",
        note: "<b>html</b>\nNodeList: single span\nsuccess=true so expected results set to actual results\n<hr><em>HTML created from clone:</em>\n&lt;span name=\"span_name\" id=\"span_id\" class=\"class1 class2\">&lt;/span>",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n\n•&nbsp;•&nbsp;•&nbsp;\n<i>expected values changed by test script fn</i>",
        actual: {
            0: {
                0: {
                    tagName: "span",
                    name: "span_name",
                    id: "span_id",
                    class: "class1 class2",
                    "@JSON_escapeMarker@": "$.1.actual.0.0=@HTML@"
                }
            },
            1: "{\n    lists: {\n        html_tags: \"SPAN: $.0\"\n    },\n    success: true\n}",
            2: {
                _: {
                    lists: {
                        html_tags: "SPAN: $.0"
                    },
                    success: true
                },
                toString: {
                    "@JSON_escapeMarker@": "$.1.actual.2.toString=undefined"
                },
                isOk: {
                    "@JSON_escapeMarker@": "$.1.actual.2.isOk=undefined"
                },
                getData: {
                    "@JSON_escapeMarker@": "$.1.actual.2.getData=undefined"
                },
                save: {
                    "@JSON_escapeMarker@": "$.1.actual.2.save=undefined"
                },
                addMessage: {
                    "@JSON_escapeMarker@": "$.1.actual.2.addMessage=undefined"
                },
                getMessage: {
                    "@JSON_escapeMarker@": "$.1.actual.2.getMessage=undefined"
                },
                addDetails: {
                    "@JSON_escapeMarker@": "$.1.actual.2.addDetails=undefined"
                },
                getDetails: {
                    "@JSON_escapeMarker@": "$.1.actual.2.getDetails=undefined"
                },
                mergeListItem: {
                    "@JSON_escapeMarker@": "$.1.actual.2.mergeListItem=undefined"
                },
                addListItem: {
                    "@JSON_escapeMarker@": "$.1.actual.2.addListItem=undefined"
                },
                getList: {
                    "@JSON_escapeMarker@": "$.1.actual.2.getList=undefined"
                },
                maxdepthCount: 0
            },
            results: {
                0: {
                    tagName: "span",
                    name: "span_name",
                    id: "span_id",
                    class: "class1 class2",
                    "@JSON_escapeMarker@": "$.1.actual.2.haveList.results.0=@HTML@"
                }
            }
        },
        expected: {
            1: "{\n    lists: {\n        html_tags: \"SPAN: $.0\"\n    },\n    success: true\n}",
            2: {
                "@JSON_escapeMarker@": "$.1.actual.2.expected.2=$.1.actual.2"
            },
            results: {
                0: {
                    tagName: "span",
                    name: "span_name",
                    id: "span_id",
                    class: "class1 class2",
                    "@JSON_escapeMarker@": "$.1.actual.2.expected.2.results.0=@HTML@"
                }
            }
        },
        saveDateTime: "11-17-2016 04:07:48 pm"
    },
    {
        ok: true,
        testno: 3,
        id: "arg1=1st arg (div.children):[0,span_id,span_name],1st arg (div.children)[0]:[],1st arg (div.children).span_id:{1st arg (div.children)[0]},1st arg (div.children).span_name:{1st arg (div.children)[0]},arg2=2nd arg (options):[],arg3=3rd arg (info()):[_,toString,isOk,getData,save,addMessage,getMessage,addDetails,getDetails,mergeListItem,addListItem,getList,haveList],3rd arg (info())._:[success],3rd arg (info())._.success:undefined,3rd arg (info()).toString:[],3rd arg (info()).isOk:[],3rd arg (info()).getData:[],3rd arg (info()).save:[],3rd arg (info()).addMessage:[],3rd arg (info()).getMessage:[],3rd arg (info()).addDetails:[],3rd arg (info()).getDetails:[],3rd arg (info()).mergeListItem:[],3rd arg (info()).addListItem:[],3rd arg (info()).getList:[],3rd arg (info()).haveList:[],note:<b>html</b>HTMLCollection:singlespan",
        note: "<b>html</b>\nHTMLCollection: single span\nsuccess=true so expected results set to actual results\n<hr><em>HTML created from clone:</em>\n&lt;span name=\"span_name\" id=\"span_id\" class=\"class1 class2\">&lt;/span>",
        warn: "<i>expected values changed by test script fn</i>",
        actual: {
            0: {
                0: {}
            },
            1: "{\n    lists: {\n        html_tags: \"SPAN: $.0\"\n    },\n    success: true\n}",
            2: "",
            results: {
                0: {}
            }
        },
        expected: {
            1: "{\n    lists: {\n        html_tags: \"SPAN: $.0\"\n    },\n    success: true\n}",
            2: "",
            results: {
                0: {}
            }
        },
        saveDateTime: "11-17-2016 08:18:14 am"
    },
    {
        ok: true,
        testno: 4,
        id: "arg1=1st arg (div):[],arg2=2nd arg (options):[],arg3=3rd arg (info()):[_,toString,isOk,getData,save,addMessage,getMessage,addDetails,getDetails,mergeListItem,addListItem,getList,haveList],3rd arg (info())._:[success],3rd arg (info())._.success:undefined,3rd arg (info()).toString:[],3rd arg (info()).isOk:[],3rd arg (info()).getData:[],3rd arg (info()).save:[],3rd arg (info()).addMessage:[],3rd arg (info()).getMessage:[],3rd arg (info()).addDetails:[],3rd arg (info()).getDetails:[],3rd arg (info()).mergeListItem:[],3rd arg (info()).addListItem:[],3rd arg (info()).getList:[],3rd arg (info()).haveList:[],note:<b>html</b>divwithchild:span,text",
        note: "<b>html</b>\ndiv with child: span, text\nsuccess=true so expected results set to actual results\n<hr><em>HTML created from clone:</em>\n&lt;div>\n\t&lt;span name=\"span_name\" id=\"span_id\" class=\"class1 class2\">&lt;/span>\n\toutside span\n&lt;/div>",
        warn: "<i>expected values changed by test script fn</i>",
        actual: {
            0: {},
            1: "{\n    lists: {\n        html_tags: \"DIV: $\n                    SPAN: $.div\"\n    },\n    success: true\n}",
            2: "",
            results: {}
        },
        expected: {
            1: "{\n    lists: {\n        html_tags: \"DIV: $\n                    SPAN: $.div\"\n    },\n    success: true\n}",
            2: "",
            results: {}
        },
        saveDateTime: "11-17-2016 08:18:14 am"
    },
    {
        ok: true,
        testno: 5,
        id: "arg1=1st arg (div):[],arg2=2nd arg (options):[],arg3=3rd arg (info()):[_,toString,isOk,getData,save,addMessage,getMessage,addDetails,getDetails,mergeListItem,addListItem,getList,haveList],3rd arg (info())._:[success],3rd arg (info())._.success:undefined,3rd arg (info()).toString:[],3rd arg (info()).isOk:[],3rd arg (info()).getData:[],3rd arg (info()).save:[],3rd arg (info()).addMessage:[],3rd arg (info()).getMessage:[],3rd arg (info()).addDetails:[],3rd arg (info()).getDetails:[],3rd arg (info()).mergeListItem:[],3rd arg (info()).addListItem:[],3rd arg (info()).getList:[],3rd arg (info()).haveList:[],note:<b>html</b>divwithchild:spaninnerText,text",
        note: "<b>html</b>\ndiv with child: span innerText, text\nsuccess=true so expected results set to actual results\n<hr><em>HTML created from clone:</em>\n&lt;div>\n\t&lt;span name=\"span_name\" id=\"span_id\" class=\"class1 class2\">\n\tinside span\n&lt;/span>\n\toutside span\n&lt;/div>",
        warn: "<i>expected values changed by test script fn</i>",
        actual: {
            0: {},
            1: "{\n    lists: {\n        html_tags: \"DIV: $\n                    SPAN: $.div\"\n    },\n    success: true\n}",
            2: "",
            results: {}
        },
        expected: {
            1: "{\n    lists: {\n        html_tags: \"DIV: $\n                    SPAN: $.div\"\n    },\n    success: true\n}",
            2: "",
            results: {}
        },
        saveDateTime: "11-17-2016 08:18:14 am"
    },
    {
        ok: true,
        testno: 6,
        id: "arg1=1st arg (div.childNodes):[0,1],1st arg (div.childNodes)[0]:[],1st arg (div.childNodes)[1]:[],arg2=2nd arg (options):[],arg3=3rd arg (info()):[_,toString,isOk,getData,save,addMessage,getMessage,addDetails,getDetails,mergeListItem,addListItem,getList,haveList],3rd arg (info())._:[success],3rd arg (info())._.success:undefined,3rd arg (info()).toString:[],3rd arg (info()).isOk:[],3rd arg (info()).getData:[],3rd arg (info()).save:[],3rd arg (info()).addMessage:[],3rd arg (info()).getMessage:[],3rd arg (info()).addDetails:[],3rd arg (info()).getDetails:[],3rd arg (info()).mergeListItem:[],3rd arg (info()).addListItem:[],3rd arg (info()).getList:[],3rd arg (info()).haveList:[],note:<b>html</b>NodeList:span,text",
        note: "<b>html</b>\nNodeList: span, text\nsuccess=true so expected results set to actual results\n<hr><em>HTML created from clone:</em>\n&lt;span name=\"span_name\" id=\"span_id\" class=\"class1 class2\">&lt;/span>\noutside span",
        warn: "<i>expected values changed by test script fn</i>",
        actual: {
            0: {
                0: {},
                1: {}
            },
            1: "{\n    lists: {\n        html_tags: \"SPAN: $.0\"\n    },\n    success: true\n}",
            2: "",
            results: {
                0: {},
                1: {}
            }
        },
        expected: {
            1: "{\n    lists: {\n        html_tags: \"SPAN: $.0\"\n    },\n    success: true\n}",
            2: "",
            results: {
                0: {},
                1: {}
            }
        },
        saveDateTime: "11-17-2016 08:18:15 am"
    },
    {
        ok: true,
        testno: 7,
        id: "arg1=1st arg (div.childNodes):[0,1],1st arg (div.childNodes)[0]:[],1st arg (div.childNodes)[1]:[],arg2=2nd arg (options):[ignore],2nd arg (options).ignore:constructors,arg3=3rd arg (info()):[_,toString,isOk,getData,save,addMessage,getMessage,addDetails,getDetails,mergeListItem,addListItem,getList,haveList],3rd arg (info())._:[success],3rd arg (info())._.success:undefined,3rd arg (info()).toString:[],3rd arg (info()).isOk:[],3rd arg (info()).getData:[],3rd arg (info()).save:[],3rd arg (info()).addMessage:[],3rd arg (info()).getMessage:[],3rd arg (info()).addDetails:[],3rd arg (info()).getDetails:[],3rd arg (info()).mergeListItem:[],3rd arg (info()).addListItem:[],3rd arg (info()).getList:[],3rd arg (info()).haveList:[],note:<b>html</b>NodeList:span,text--clonedasObject",
        note: "<b>html</b>\nNodeList: span, text -- cloned as Object\nsuccess=true so expected results set to actual results",
        warn: "<i>expected values changed by test script fn</i>",
        actual: {
            0: {
                0: {},
                1: {}
            },
            1: "{\n    lists: {\n        ignored_constructors: \"NodeList: $\",\n        html_tags: \"SPAN: $.0\"\n    },\n    success: true\n}",
            2: "",
            results: {
                0: {},
                1: {}
            }
        },
        expected: {
            1: "{\n    lists: {\n        ignored_constructors: \"NodeList: $\",\n        html_tags: \"SPAN: $.0\"\n    },\n    success: true\n}",
            2: "",
            results: {
                0: {},
                1: {}
            }
        },
        saveDateTime: "11-17-2016 08:18:15 am"
    },
    {
        ok: true,
        testno: 8,
        id: "arg1=1st arg (div.children):[0,span_id,span_name],1st arg (div.children)[0]:[],1st arg (div.children).span_id:{1st arg (div.children)[0]},1st arg (div.children).span_name:{1st arg (div.children)[0]},arg2=2nd arg (options):[],arg3=3rd arg (info()):[_,toString,isOk,getData,save,addMessage,getMessage,addDetails,getDetails,mergeListItem,addListItem,getList,haveList],3rd arg (info())._:[success],3rd arg (info())._.success:undefined,3rd arg (info()).toString:[],3rd arg (info()).isOk:[],3rd arg (info()).getData:[],3rd arg (info()).save:[],3rd arg (info()).addMessage:[],3rd arg (info()).getMessage:[],3rd arg (info()).addDetails:[],3rd arg (info()).getDetails:[],3rd arg (info()).mergeListItem:[],3rd arg (info()).addListItem:[],3rd arg (info()).getList:[],3rd arg (info()).haveList:[],note:<b>html</b>HTMLCollection:span,text",
        note: "<b>html</b>\nHTMLCollection: span, text\nsuccess=true so expected results set to actual results\n<hr><em>HTML created from clone:</em>\n&lt;span name=\"span_name\" id=\"span_id\" class=\"class1 class2\">&lt;/span>",
        warn: "<i>expected values changed by test script fn</i>",
        actual: {
            0: {
                0: {}
            },
            1: "{\n    lists: {\n        html_tags: \"SPAN: $.0\"\n    },\n    success: true\n}",
            2: "",
            results: {
                0: {}
            }
        },
        expected: {
            1: "{\n    lists: {\n        html_tags: \"SPAN: $.0\"\n    },\n    success: true\n}",
            2: "",
            results: {
                0: {}
            }
        },
        saveDateTime: "11-17-2016 08:18:15 am"
    },
    {
        ok: true,
        testno: 9,
        id: "arg1=1st arg (div.children):[0,span_id,span_name],1st arg (div.children)[0]:[],1st arg (div.children).span_id:{1st arg (div.children)[0]},1st arg (div.children).span_name:{1st arg (div.children)[0]},arg2=2nd arg (options):[ignore],2nd arg (options).ignore:constructors,arg3=3rd arg (info()):[_,toString,isOk,getData,save,addMessage,getMessage,addDetails,getDetails,mergeListItem,addListItem,getList,haveList],3rd arg (info())._:[success],3rd arg (info())._.success:undefined,3rd arg (info()).toString:[],3rd arg (info()).isOk:[],3rd arg (info()).getData:[],3rd arg (info()).save:[],3rd arg (info()).addMessage:[],3rd arg (info()).getMessage:[],3rd arg (info()).addDetails:[],3rd arg (info()).getDetails:[],3rd arg (info()).mergeListItem:[],3rd arg (info()).addListItem:[],3rd arg (info()).getList:[],3rd arg (info()).haveList:[],note:<b>html</b>HTMLCollection:span,text--clonedasObject",
        note: "<b>html</b>\nHTMLCollection: span, text -- cloned as Object\nsuccess=true so expected results set to actual results",
        warn: "<i>expected values changed by test script fn</i>",
        actual: {
            0: {
                0: {}
            },
            1: "{\n    lists: {\n        ignored_constructors: \"HTMLCollection: $\",\n        html_tags: \"SPAN: $.0\"\n    },\n    success: true\n}",
            2: "",
            results: {
                0: {}
            }
        },
        expected: {
            1: "{\n    lists: {\n        ignored_constructors: \"HTMLCollection: $\",\n        html_tags: \"SPAN: $.0\"\n    },\n    success: true\n}",
            2: "",
            results: {
                0: {}
            }
        },
        saveDateTime: "11-17-2016 08:18:15 am"
    },
    {
        ok: true,
        testno: 10,
        id: "arg1=1st arg (tags):[0,1,EZtest_tag0,EZtest_tag1],1st arg (tags)[0]:[],1st arg (tags)[1]:[],1st arg (tags).EZtest_tag0:{1st arg (tags)[0]},1st arg (tags).EZtest_tag1:{1st arg (tags)[1]},arg2=2nd arg (options):[],arg3=3rd arg (info()):[_,toString,isOk,getData,save,addMessage,getMessage,addDetails,getDetails,mergeListItem,addListItem,getList,haveList],3rd arg (info())._:[success],3rd arg (info())._.success:undefined,3rd arg (info()).toString:[],3rd arg (info()).isOk:[],3rd arg (info()).getData:[],3rd arg (info()).save:[],3rd arg (info()).addMessage:[],3rd arg (info()).getMessage:[],3rd arg (info()).addDetails:[],3rd arg (info()).getDetails:[],3rd arg (info()).mergeListItem:[],3rd arg (info()).addListItem:[],3rd arg (info()).getList:[],3rd arg (info()).haveList:[],note:<b>html</b>hugeHTMLCollection",
        note: "<b>html</b>\nhuge HTMLCollection\nsuccess=true so expected results set to actual results\n<hr><em>HTML created from clone:</em>\n&lt;eztest_tag id=\"EZtest_tag0\" class=\"EZtest_class0\">\n\t_____tagName=EZtest_tag id=\"EZtest_tag0\" class=\"EZtest_class0\"_____\n\t\n\t\n\t\n&lt;/eztest_tag>\n&lt;eztest_tag id=\"EZtest_tag1\" class=\"EZtest_class1\">\n\ttest tag1\n\t\n\t\n\t\n\t\n&lt;/eztest_tag>",
        warn: "<i>expected values changed by test script fn</i>",
        actual: {
            0: {
                0: {},
                1: {}
            },
            1: "{\n    lists: {\n        html_tags: \"EZTEST_TAG: $.0, $.1\"\n    },\n    success: true\n}",
            2: "",
            results: {
                0: {},
                1: {}
            }
        },
        expected: {
            1: "{\n    lists: {\n        html_tags: \"EZTEST_TAG: $.0, $.1\"\n    },\n    success: true\n}",
            2: "",
            results: {
                0: {},
                1: {}
            }
        },
        saveDateTime: "11-17-2016 08:18:15 am"
    },
    {
        ok: true,
        testno: 11,
        id: "arg1=1st arg (tags):[0,1,EZtest_tag0,EZtest_tag1],1st arg (tags)[0]:[],1st arg (tags)[1]:[],1st arg (tags).EZtest_tag0:{1st arg (tags)[0]},1st arg (tags).EZtest_tag1:{1st arg (tags)[1]},arg2=2nd arg (options):[ignore],2nd arg (options).ignore:constructors,arg3=3rd arg (info()):[_,toString,isOk,getData,save,addMessage,getMessage,addDetails,getDetails,mergeListItem,addListItem,getList,haveList],3rd arg (info())._:[success],3rd arg (info())._.success:undefined,3rd arg (info()).toString:[],3rd arg (info()).isOk:[],3rd arg (info()).getData:[],3rd arg (info()).save:[],3rd arg (info()).addMessage:[],3rd arg (info()).getMessage:[],3rd arg (info()).addDetails:[],3rd arg (info()).getDetails:[],3rd arg (info()).mergeListItem:[],3rd arg (info()).addListItem:[],3rd arg (info()).getList:[],3rd arg (info()).haveList:[],note:<b>html</b>hugeHTMLCollection--clonedasObject",
        note: "<b>html</b>\nhuge HTMLCollection -- cloned as Object\nsuccess=true so expected results set to actual results",
        warn: "<i>expected values changed by test script fn</i>",
        actual: {
            0: {
                0: {},
                1: {}
            },
            1: "{\n    lists: {\n        ignored_constructors: \"HTMLCollection: $\",\n        html_tags: \"EZTEST_TAG: $.0, $.1 x 1\n                    BR: $.0.eztest_tag#EZtest_tag0.EZtest_class0\n                    \n                    DIV: $.0.eztest_tag#EZtest_tag0.EZtest_class0\n                    \n                    INPUT: $.1.eztest_tag#EZtest_tag1.EZtest_class1\n                    \n                    SELECT: $.1.eztest_tag#EZtest_tag1.EZtest_class1\n                    \n                    OPTION: $.1.eztest_tag#EZtest_tag1.EZtest_class1.select#EZtest_select x 2\"\n    },\n    success: true\n}",
            2: "",
            results: {
                0: {},
                1: {}
            }
        },
        expected: {
            1: "{\n    lists: {\n        ignored_constructors: \"HTMLCollection: $\",\n        html_tags: \"EZTEST_TAG: $.0, $.1 x 1\n                    BR: $.0.eztest_tag#EZtest_tag0.EZtest_class0\n                    \n                    DIV: $.0.eztest_tag#EZtest_tag0.EZtest_class0\n                    \n                    INPUT: $.1.eztest_tag#EZtest_tag1.EZtest_class1\n                    \n                    SELECT: $.1.eztest_tag#EZtest_tag1.EZtest_class1\n                    \n                    OPTION: $.1.eztest_tag#EZtest_tag1.EZtest_class1.select#EZtest_select x 2\"\n    },\n    success: true\n}",
            2: "",
            results: {
                0: {},
                1: {}
            }
        },
        saveDateTime: "11-17-2016 08:18:16 am"
    }
];JSON.plus.unescape(JSON.plus._temp);