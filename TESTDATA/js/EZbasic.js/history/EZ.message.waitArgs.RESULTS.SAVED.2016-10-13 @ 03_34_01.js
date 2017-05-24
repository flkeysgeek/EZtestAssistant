EZ.test.savedResults=		//Saved @ 10-13-2016 03:34:01 am
[
    {
        ok: true,
        testno: 1,
        id: "note:",
        note: "",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            results: {
                text: undefined,
                el: undefined,
                ctx: undefined,
                delay: 0
            }
        },
        expected: {
            results: {
                text: undefined,
                el: undefined,
                ctx: undefined,
                delay: 0
            }
        },
        saveDateTime: "10-13-2016 03:03:37 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 2,
        id: "arg1=1st arg (text):give,arg2=2nd arg (el):[arg],2nd arg (el).arg:div,arg3=3rd arg (ctx):[arg],3rd arg (ctx).arg:this,arg4=4th arg (delay):1,note:",
        note: "",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "give",
            1: {
                arg: "div"
            },
            2: {
                arg: "this"
            },
            3: 1,
            results: {
                text: "give",
                el: "div",
                ctx: "this",
                delay: 1
            }
        },
        expected: {
            results: {
                text: "give",
                el: "div",
                ctx: "this",
                delay: 1
            }
        },
        saveDateTime: "10-13-2016 03:03:37 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 3,
        id: "arg1=1st arg (text):give,arg2=2nd arg (sel):body,arg3=3rd arg (ctx):[arg],3rd arg (ctx).arg:this,arg4=4th arg (delay):1,note:",
        note: "",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "give",
            1: "body",
            2: {
                arg: "this"
            },
            3: 1,
            results: {
                text: "give",
                el: "body",
                ctx: "this",
                delay: 1
            }
        },
        expected: {
            results: {
                text: "give",
                el: "body",
                ctx: "this",
                delay: 1
            }
        },
        saveDateTime: "10-13-2016 03:03:37 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 4,
        id: "arg1=1st arg (el):[arg],1st arg (el).arg:div,arg2=2nd arg (ctx):[arg],2nd arg (ctx).arg:this,arg3=3rd arg (ctx):1,note:<b>textomitted</b>",
        note: "<b>text omitted</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: {
                arg: "div"
            },
            1: {
                arg: "this"
            },
            2: 1,
            results: {
                text: "",
                el: "div",
                ctx: "this",
                delay: 1
            }
        },
        expected: {
            results: {
                text: "",
                el: "div",
                ctx: "this",
                delay: 1
            }
        },
        saveDateTime: "10-13-2016 03:03:37 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 5,
        id: "arg1=1st arg (sel):body,arg2=2nd arg (ctx):[arg],2nd arg (ctx).arg:this,arg3=3rd arg (ctx):1,note:<b>textomitted</b>",
        note: "<b>text omitted</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "body",
            1: {
                arg: "this"
            },
            2: 1,
            results: {
                text: "",
                el: "body",
                ctx: "this",
                delay: 1
            }
        },
        expected: {
            results: {
                text: "",
                el: "body",
                ctx: "this",
                delay: 1
            }
        },
        saveDateTime: "10-13-2016 03:03:37 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 6,
        id: "arg1=1st arg (ctx):[arg],1st arg (ctx).arg:this,arg2=2nd arg (el):1,note:<b>text/elomitted</b>",
        note: "<b>text/el omitted</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: {
                arg: "this"
            },
            1: 1,
            results: {
                text: "",
                el: undefined,
                ctx: "this",
                delay: 1
            }
        },
        expected: {
            results: {
                text: "",
                el: undefined,
                ctx: "this",
                delay: 1
            }
        },
        saveDateTime: "10-13-2016 03:03:37 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 7,
        id: "arg1=1st arg (text):1,note:<b>text/elomitted</b>",
        note: "<b>text/el omitted</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: 1,
            results: {
                text: undefined,
                el: undefined,
                ctx: undefined,
                delay: 1
            }
        },
        expected: {
            results: {
                text: undefined,
                el: undefined,
                ctx: undefined,
                delay: 1
            }
        },
        saveDateTime: "10-13-2016 03:03:37 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 8,
        id: "arg1=1st arg (text):give,note:<b>text1stvariants</b>",
        note: "<b>text 1st variants</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "give",
            results: {
                text: "give",
                el: undefined,
                ctx: undefined,
                delay: 0
            }
        },
        expected: {
            results: {
                text: "give",
                el: undefined,
                ctx: undefined,
                delay: 0
            }
        },
        saveDateTime: "10-13-2016 03:03:37 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 9,
        id: "arg1=1st arg (text):give,arg2=2nd arg (ctx):[arg],2nd arg (ctx).arg:this,note:<b>text1stvariants</b>",
        note: "<b>text 1st variants</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "give",
            1: {
                arg: "this"
            },
            results: {
                text: "give",
                el: undefined,
                ctx: "this",
                delay: 0
            }
        },
        expected: {
            results: {
                text: "give",
                el: undefined,
                ctx: "this",
                delay: 0
            }
        },
        saveDateTime: "10-13-2016 03:03:37 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 10,
        id: "arg1=1st arg (text):give,arg2=2nd arg (el):1,note:<b>text1stvariants</b>",
        note: "<b>text 1st variants</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "give",
            1: 1,
            results: {
                text: "give",
                el: undefined,
                ctx: undefined,
                delay: 1
            }
        },
        expected: {
            results: {
                text: "give",
                el: undefined,
                ctx: undefined,
                delay: 1
            }
        },
        saveDateTime: "10-13-2016 03:03:37 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 11,
        id: "arg1=1st arg (text):give,arg2=2nd arg (ctx):[arg],2nd arg (ctx).arg:this,arg3=3rd arg (ctx):1,note:<b>text1stvariants</b>",
        note: "<b>text 1st variants</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "give",
            1: {
                arg: "this"
            },
            2: 1,
            results: {
                text: "give",
                el: undefined,
                ctx: "this",
                delay: 1
            }
        },
        expected: {
            results: {
                text: "give",
                el: undefined,
                ctx: "this",
                delay: 1
            }
        },
        saveDateTime: "10-13-2016 03:03:37 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 12,
        id: "arg1=1st arg (text):give,arg2=2nd arg (el):[arg],2nd arg (el).arg:div,note:<b>text1stvariants</b>",
        note: "<b>text 1st variants</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "give",
            1: {
                arg: "div"
            },
            results: {
                text: "give",
                el: "div",
                ctx: undefined,
                delay: 0
            }
        },
        expected: {
            results: {
                text: "give",
                el: "div",
                ctx: undefined,
                delay: 0
            }
        },
        saveDateTime: "10-13-2016 03:03:38 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 13,
        id: "arg1=1st arg (text):give,arg2=2nd arg (sel):body,note:<b>text1stvariants</b>",
        note: "<b>text 1st variants</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "give",
            1: "body",
            results: {
                text: "give",
                el: "body",
                ctx: undefined,
                delay: 0
            }
        },
        expected: {
            results: {
                text: "give",
                el: "body",
                ctx: undefined,
                delay: 0
            }
        },
        saveDateTime: "10-13-2016 03:03:38 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 14,
        id: "arg1=1st arg (text):give,arg2=2nd arg (el):[arg],2nd arg (el).arg:div,arg3=3rd arg (ctx):1,note:<b>text1stvariants</b>",
        note: "<b>text 1st variants</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "give",
            1: {
                arg: "div"
            },
            2: 1,
            results: {
                text: "give",
                el: "div",
                ctx: undefined,
                delay: 1
            }
        },
        expected: {
            results: {
                text: "give",
                el: "div",
                ctx: undefined,
                delay: 1
            }
        },
        saveDateTime: "10-13-2016 03:03:38 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 15,
        id: "arg1=1st arg (text):give,arg2=2nd arg (sel):body,arg3=3rd arg (ctx):1,note:<b>text1stvariants</b>",
        note: "<b>text 1st variants</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "give",
            1: "body",
            2: 1,
            results: {
                text: "give",
                el: "body",
                ctx: undefined,
                delay: 1
            }
        },
        expected: {
            results: {
                text: "give",
                el: "body",
                ctx: undefined,
                delay: 1
            }
        },
        saveDateTime: "10-13-2016 03:03:38 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 16,
        id: "arg1=1st arg (el):[arg],1st arg (el).arg:div,note:<b>element1stvariants</b>",
        note: "<b>element 1st variants</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: {
                arg: "div"
            },
            results: {
                text: "",
                el: "div",
                ctx: undefined,
                delay: 0
            }
        },
        expected: {
            results: {
                text: "",
                el: "div",
                ctx: undefined,
                delay: 0
            }
        },
        saveDateTime: "10-13-2016 03:03:38 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 17,
        id: "arg1=1st arg (sel):body,note:<b>element1stvariants</b>",
        note: "<b>element 1st variants</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "body",
            results: {
                text: "",
                el: "body",
                ctx: undefined,
                delay: 0
            }
        },
        expected: {
            results: {
                text: "",
                el: "body",
                ctx: undefined,
                delay: 0
            }
        },
        saveDateTime: "10-13-2016 03:03:38 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 18,
        id: "arg1=1st arg (el):[arg],1st arg (el).arg:div,arg2=2nd arg (ctx):[arg],2nd arg (ctx).arg:this,note:<b>element1stvariants</b>",
        note: "<b>element 1st variants</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: {
                arg: "div"
            },
            1: {
                arg: "this"
            },
            results: {
                text: "",
                el: "div",
                ctx: "this",
                delay: 0
            }
        },
        expected: {
            results: {
                text: "",
                el: "div",
                ctx: "this",
                delay: 0
            }
        },
        saveDateTime: "10-13-2016 03:03:38 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 19,
        id: "arg1=1st arg (sel):body,arg2=2nd arg (ctx):[arg],2nd arg (ctx).arg:this,note:<b>element1stvariants</b>",
        note: "<b>element 1st variants</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "body",
            1: {
                arg: "this"
            },
            results: {
                text: "",
                el: "body",
                ctx: "this",
                delay: 0
            }
        },
        expected: {
            results: {
                text: "",
                el: "body",
                ctx: "this",
                delay: 0
            }
        },
        saveDateTime: "10-13-2016 03:03:38 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 20,
        id: "arg1=1st arg (el):[arg],1st arg (el).arg:div,arg2=2nd arg (el):1,note:<b>element1stvariants</b>",
        note: "<b>element 1st variants</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: {
                arg: "div"
            },
            1: 1,
            results: {
                text: "",
                el: "div",
                ctx: undefined,
                delay: 1
            }
        },
        expected: {
            results: {
                text: "",
                el: "div",
                ctx: undefined,
                delay: 1
            }
        },
        saveDateTime: "10-13-2016 03:03:38 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 21,
        id: "arg1=1st arg (sel):body,arg2=2nd arg (el):1,note:<b>element1stvariants</b>",
        note: "<b>element 1st variants</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "body",
            1: 1,
            results: {
                text: "",
                el: "body",
                ctx: undefined,
                delay: 1
            }
        },
        expected: {
            results: {
                text: "",
                el: "body",
                ctx: undefined,
                delay: 1
            }
        },
        saveDateTime: "10-13-2016 03:03:38 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 22,
        id: "arg1=1st arg (el):[arg],1st arg (el).arg:div,arg2=2nd arg (ctx):[arg],2nd arg (ctx).arg:this,arg3=3rd arg (ctx):1,note:<b>element1stvariants</b>",
        note: "<b>element 1st variants</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: {
                arg: "div"
            },
            1: {
                arg: "this"
            },
            2: 1,
            results: {
                text: "",
                el: "div",
                ctx: "this",
                delay: 1
            }
        },
        expected: {
            results: {
                text: "",
                el: "div",
                ctx: "this",
                delay: 1
            }
        },
        saveDateTime: "10-13-2016 03:03:38 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 23,
        id: "arg1=1st arg (sel):body,arg2=2nd arg (ctx):[arg],2nd arg (ctx).arg:this,arg3=3rd arg (ctx):1,note:<b>element1stvariants</b>",
        note: "<b>element 1st variants</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "body",
            1: {
                arg: "this"
            },
            2: 1,
            results: {
                text: "",
                el: "body",
                ctx: "this",
                delay: 1
            }
        },
        expected: {
            results: {
                text: "",
                el: "body",
                ctx: "this",
                delay: 1
            }
        },
        saveDateTime: "10-13-2016 03:03:38 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 24,
        id: "arg1=1st arg (ctx):[arg],1st arg (ctx).arg:this,note:<b>ctx1stvariants</b>",
        note: "<b>ctx 1st variants</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: {
                arg: "this"
            },
            results: {
                text: "",
                el: undefined,
                ctx: "this",
                delay: 0
            }
        },
        expected: {
            results: {
                text: "",
                el: undefined,
                ctx: "this",
                delay: 0
            }
        },
        saveDateTime: "10-13-2016 03:03:38 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 25,
        id: "arg1=1st arg (ctx):[arg],1st arg (ctx).arg:this,arg2=2nd arg (el):1,note:<b>ctx1stvariants</b>",
        note: "<b>ctx 1st variants</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: {
                arg: "this"
            },
            1: 1,
            results: {
                text: "",
                el: undefined,
                ctx: "this",
                delay: 1
            }
        },
        expected: {
            results: {
                text: "",
                el: undefined,
                ctx: "this",
                delay: 1
            }
        },
        saveDateTime: "10-13-2016 03:03:38 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 26,
        id: "arg1=1st arg (text):give,arg2=2nd arg (sel):none,arg3=3rd arg (ctx):[arg],3rd arg (ctx).arg:this,arg4=4th arg (delay):1,note:<b>non-existantselector</b>",
        note: "<b>non-existant selector</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "give",
            1: "none",
            2: {
                arg: "this"
            },
            3: 1,
            results: {
                text: "give",
                el: undefined,
                ctx: "this",
                delay: 1
            }
        },
        expected: {
            results: {
                text: "give",
                el: undefined,
                ctx: "this",
                delay: 1
            }
        },
        saveDateTime: "10-13-2016 03:03:39 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 27,
        id: "arg1=1st arg (sel):none,arg2=2nd arg (ctx):[arg],2nd arg (ctx).arg:this,arg3=3rd arg (ctx):1,note:<b>non-existantselector</b>mustassume1stargistextwhenelnotfound",
        note: "<b>non-existant selector</b>\nmust assume 1st arg is text when el not found",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "none",
            1: {
                arg: "this"
            },
            2: 1,
            results: {
                text: "none",
                el: undefined,
                ctx: "this",
                delay: 1
            }
        },
        expected: {
            results: {
                text: "none",
                el: undefined,
                ctx: "this",
                delay: 1
            }
        },
        saveDateTime: "10-13-2016 03:03:39 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 28,
        id: "arg1=1st arg (text):give,arg2=2nd arg (sel):none,note:<b>non-existantselector</b>",
        note: "<b>non-existant selector</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "give",
            1: "none",
            results: {
                text: "give",
                el: undefined,
                ctx: undefined,
                delay: 0
            }
        },
        expected: {
            results: {
                text: "give",
                el: undefined,
                ctx: undefined,
                delay: 0
            }
        },
        saveDateTime: "10-13-2016 03:03:39 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 29,
        id: "arg1=1st arg (text):give,arg2=2nd arg (sel):none,arg3=3rd arg (ctx):1,note:<b>non-existantselector</b>",
        note: "<b>non-existant selector</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "give",
            1: "none",
            2: 1,
            results: {
                text: "give",
                el: undefined,
                ctx: undefined,
                delay: 1
            }
        },
        expected: {
            results: {
                text: "give",
                el: undefined,
                ctx: undefined,
                delay: 1
            }
        },
        saveDateTime: "10-13-2016 03:03:39 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 30,
        id: "arg1=1st arg (sel):none,note:<b>non-existantselector</b>",
        note: "<b>non-existant selector</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "none",
            results: {
                text: "none",
                el: undefined,
                ctx: undefined,
                delay: 0
            }
        },
        expected: {
            results: {
                text: "none",
                el: undefined,
                ctx: undefined,
                delay: 0
            }
        },
        saveDateTime: "10-13-2016 03:03:39 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 31,
        id: "arg1=1st arg (sel):none,arg2=2nd arg (ctx):[arg],2nd arg (ctx).arg:this,note:<b>non-existantselector</b>",
        note: "<b>non-existant selector</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "none",
            1: {
                arg: "this"
            },
            results: {
                text: "none",
                el: undefined,
                ctx: "this",
                delay: 0
            }
        },
        expected: {
            results: {
                text: "none",
                el: undefined,
                ctx: "this",
                delay: 0
            }
        },
        saveDateTime: "10-13-2016 03:03:39 am",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 32,
        id: "arg1=1st arg (sel):none,arg2=2nd arg (ctx):[arg],2nd arg (ctx).arg:this,arg3=3rd arg (ctx):1,note:<b>non-existantselector</b>",
        note: "<b>non-existant selector</b>\n",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: "none",
            1: {
                arg: "this"
            },
            2: 1,
            results: {
                text: "none",
                el: undefined,
                ctx: "this",
                delay: 1
            }
        },
        expected: {
            results: {
                text: "none",
                el: undefined,
                ctx: "this",
                delay: 1
            }
        },
        saveDateTime: "10-13-2016 03:03:39 am",
        saveError: "",
        changedDetail: {}
    }
]