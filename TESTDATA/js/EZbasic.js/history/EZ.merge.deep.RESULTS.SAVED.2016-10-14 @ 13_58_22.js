EZ.test.savedResults=		//Saved @ 10-14-2016 01:58:22 pm
[
    {
        ok: true,
        testno: 1,
        id: "arg1=1st arg (list):[0,1],1st arg (list)[0]:[a,b],1st arg (list)[0].a:1,1st arg (list)[0].b:2,1st arg (list)[1]:[b,c],1st arg (list)[1].b:22,1st arg (list)[1].c:3,arg2=2nd arg (options):[clone],2nd arg (options).clone:true,note:<b>simpletests-2objects</b>appendandreplace",
        note: "<b>simple tests - 2 objects</b>\nappend and replace",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: [
                {
                    a: 1,
                    b: 2
                },
                {
                    b: 22,
                    c: 3
                }
            ],
            1: {
                clone: true
            },
            results: {
                a: 1,
                b: 22,
                c: 3
            }
        },
        expected: {
            results: {
                a: 1,
                b: 22,
                c: 3
            }
        },
        saveDateTime: "10-13-2016 05:43:26 pm",
        changedDetail: {},
        saveError: ""
    },
    {
        ok: true,
        testno: 2,
        id: "arg1=1st arg (list):[0,1],1st arg (list)[0]:[a,b],1st arg (list)[0].a:1,1st arg (list)[0].b:2,1st arg (list)[1]:[b,c],1st arg (list)[1].b:22,1st arg (list)[1].c:3,arg2=2nd arg (options):[replace,clone],2nd arg (options).replace:false,2nd arg (options).clone:true,note:<b>simpletests-2objects</b>appendonly",
        note: "<b>simple tests - 2 objects</b>\nappend only",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: [
                {
                    a: 1,
                    b: 2
                },
                {
                    b: 22,
                    c: 3
                }
            ],
            1: {
                replace: false,
                clone: true
            },
            results: {
                a: 1,
                b: 2,
                c: 3
            }
        },
        expected: {
            results: {
                a: 1,
                b: 2,
                c: 3
            }
        },
        saveDateTime: "10-13-2016 05:43:27 pm",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 3,
        id: "arg1=1st arg (list):[0,1],1st arg (list)[0]:[a,b],1st arg (list)[0].a:1,1st arg (list)[0].b:2,1st arg (list)[1]:[b,c],1st arg (list)[1].b:22,1st arg (list)[1].c:3,arg2=2nd arg (options):[append],2nd arg (options).append:false,note:<b>simpletests-2objects</b>replaceonly",
        note: "<b>simple tests - 2 objects</b>\nreplace only",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>list</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: [
                {
                    a: 1,
                    b: 22
                },
                {
                    b: 22,
                    c: 3
                }
            ],
            1: {
                append: false
            },
            results: {
                a: 1,
                b: 22
            }
        },
        expected: {
            0: [
                {
                    a: 1,
                    b: 22
                },
                {
                    b: 22,
                    c: 3
                }
            ],
            results: {
                a: 1,
                b: 22
            }
        },
        saveDateTime: "10-13-2016 05:43:27 pm",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 4,
        id: "arg1=1st arg (list):[0,1,2,3],1st arg (list)[0]:null,1st arg (list)[1]:[a,b],1st arg (list)[1].a:1,1st arg (list)[1].b:1,1st arg (list)[2]:[b,c],1st arg (list)[2].b:2,1st arg (list)[2].c:2,1st arg (list)[3]:[a,b,c,d],1st arg (list)[3].a:3,1st arg (list)[3].b:3,1st arg (list)[3].c:3,1st arg (list)[3].d:3,note:<b>simpletests-3objects</b>appendandreplacealways(default)",
        note: "<b>simple tests - 3 objects</b>\nappend and replace always (default)",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>list</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: [
                null,
                {
                    a: 3,
                    b: 3,
                    c: 3,
                    "d": 3
                },
                {
                    b: 2,
                    c: 2
                },
                {
                    a: 3,
                    b: 3,
                    c: 3,
                    "d": 3
                }
            ],
            results: {
                a: 3,
                b: 3,
                c: 3,
                "d": 3
            }
        },
        expected: {
            0: [
                null,
                {
                    a: 3,
                    b: 3,
                    c: 3,
                    "d": 3
                },
                {
                    b: 2,
                    c: 2
                },
                {
                    a: 3,
                    b: 3,
                    c: 3,
                    "d": 3
                }
            ],
            results: {
                a: 3,
                b: 3,
                c: 3,
                "d": 3
            }
        },
        saveDateTime: "10-13-2016 05:43:27 pm",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 5,
        id: "arg1=1st arg (list):[0,1,2,3],1st arg (list)[0]:null,1st arg (list)[1]:[a,b],1st arg (list)[1].a:1,1st arg (list)[1].b:1,1st arg (list)[2]:[b,c],1st arg (list)[2].b:2,1st arg (list)[2].c:2,1st arg (list)[3]:[a,b,c,d],1st arg (list)[3].a:3,1st arg (list)[3].b:3,1st arg (list)[3].c:3,1st arg (list)[3].d:3,arg2=2nd arg (options):[append,replace],2nd arg (options).append:1st,2nd arg (options).replace:false,note:<b>simpletests-3objects</b>append1sttimeonly-noreplace",
        note: "<b>simple tests - 3 objects</b>\nappend 1st time only - no replace",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>list</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: [
                null,
                {
                    a: 1,
                    b: 1,
                    c: 2,
                    "d": 3
                },
                {
                    b: 2,
                    c: 2
                },
                {
                    a: 3,
                    b: 3,
                    c: 3,
                    "d": 3
                }
            ],
            1: {
                append: "1st",
                replace: false
            },
            results: {
                a: 1,
                b: 1,
                c: 2,
                "d": 3
            }
        },
        expected: {
            0: [
                null,
                {
                    a: 1,
                    b: 1,
                    c: 2,
                    "d": 3
                },
                {
                    b: 2,
                    c: 2
                },
                {
                    a: 3,
                    b: 3,
                    c: 3,
                    "d": 3
                }
            ],
            results: {
                a: 1,
                b: 1,
                c: 2,
                "d": 3
            }
        },
        saveDateTime: "10-13-2016 05:43:27 pm",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: "some",
        testno: 6,
        id: "arg1=1st arg (list):[0,1,2,3],1st arg (list)[0]:null,1st arg (list)[1]:[a,b],1st arg (list)[1].a:1,1st arg (list)[1].b:1,1st arg (list)[2]:[b,c],1st arg (list)[2].b:2,1st arg (list)[2].c:2,1st arg (list)[3]:[a,b,c,d],1st arg (list)[3].a:3,1st arg (list)[3].b:3,1st arg (list)[3].c:3,1st arg (list)[3].d:3,arg2=2nd arg (options):[append,replace],2nd arg (options).append:1st,2nd arg (options).replace:true,note:<b>simpletests-3objects</b>append1sttimeonly--replacealways",
        note: "<b>simple tests - 3 objects</b>\nappend 1st time only -- replace always",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>list</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: [
                null,
                {
                    a: 1,
                    b: 1,
                    c: 2,
                    "d": 3
                },
                {
                    b: 2,
                    c: 2
                },
                {
                    a: 3,
                    b: 3,
                    c: 3,
                    "d": 3
                }
            ],
            1: {
                append: "1st",
                replace: true
            },
            results: {
                a: 1,
                b: 1,
                c: 2,
                "d": 3
            }
        },
        expected: {
            0: [
                null,
                {
                    a: 1,
                    b: 1,
                    c: 2,
                    "d": 3
                },
                {
                    b: 2,
                    c: 2
                },
                {
                    a: 3,
                    b: 3,
                    c: 3,
                    "d": 3
                }
            ],
            results: {
                a: 1,
                b: 1,
                c: 2,
                "d": 3
            }
        },
        saveDateTime: "10-13-2016 05:43:27 pm",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 7,
        id: "arg1=1st arg (list):[0,1,2,3],1st arg (list)[0]:null,1st arg (list)[1]:[a,b],1st arg (list)[1].a:1,1st arg (list)[1].b:1,1st arg (list)[2]:[a,b,c],1st arg (list)[2].a:2,1st arg (list)[2].b:[x,z],1st arg (list)[2].b.x:2,1st arg (list)[2].b.z:9,1st arg (list)[2].c:[x],1st arg (list)[2].c.x:2,1st arg (list)[3]:[a,b,c],1st arg (list)[3].a:null,1st arg (list)[3].b:[x,y],1st arg (list)[3].b.x:3,1st arg (list)[3].b.y:3,1st arg (list)[3].c:2,arg2=2nd arg (options):[replace],2nd arg (options).replace:true,note:<b>replacescenarioswithObjects</b>embeddedObjectsreplaceexisting",
        note: "<b>replace scenarios with Objects</b>\nembedded Objects replace existing",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: [
                null,
                {
                    a: 2,
                    b: {
                        x: 3,
                        y: 3
                    },
                    c: 2
                },
                {
                    a: 2,
                    b: {
                        x: 2,
                        z: 9
                    },
                    c: {
                        x: 2
                    }
                },
                {
                    a: null,
                    b: {
                        x: 3,
                        y: 3
                    },
                    c: 2
                }
            ],
            1: {
                replace: true
            },
            results: {
                a: 2,
                b: {
                    x: 3,
                    y: 3
                },
                c: 2
            }
        },
        expected: {
            0: [
                null,
                {
                    a: 2,
                    b: {
                        x: 3,
                        y: 3
                    },
                    c: 2
                },
                {
                    a: 2,
                    b: {
                        x: 2,
                        z: 9
                    },
                    c: {
                        x: 2
                    }
                },
                {
                    a: null,
                    b: {
                        x: 3,
                        y: 3
                    },
                    c: 2
                }
            ],
            results: {
                a: 2,
                b: {
                    x: 3,
                    y: 3
                },
                c: 2
            }
        },
        saveDateTime: "10-13-2016 07:21:35 pm",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 8,
        id: "arg1=1st arg (list):[0,1,2,3],1st arg (list)[0]:null,1st arg (list)[1]:[a,b],1st arg (list)[1].a:1,1st arg (list)[1].b:1,1st arg (list)[2]:[a,b,c],1st arg (list)[2].a:2,1st arg (list)[2].b:[x,z],1st arg (list)[2].b.x:2,1st arg (list)[2].b.z:9,1st arg (list)[2].c:[x],1st arg (list)[2].c.x:2,1st arg (list)[3]:[a,b,c],1st arg (list)[3].a:null,1st arg (list)[3].b:[x,y],1st arg (list)[3].b.x:3,1st arg (list)[3].b.y:3,1st arg (list)[3].c:2,arg2=2nd arg (options):[clone,replace,includeTypes],2nd arg (options).clone:true,2nd arg (options).replace:true,2nd arg (options).includeTypes:[0],2nd arg (options).includeTypes[0]:null,note:<b>replacescenarioswithObjects</b>nullnotignored--replacesnon-null",
        note: "<b>replace scenarios with Objects</b>\nnull not ignored -- replaces non-null",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: [
                null,
                {
                    a: 1,
                    b: 1
                },
                {
                    a: 2,
                    b: {
                        x: 2,
                        z: 9
                    },
                    c: {
                        x: 2
                    }
                },
                {
                    a: null,
                    b: {
                        x: 3,
                        y: 3
                    },
                    c: 2
                }
            ],
            1: {
                clone: true,
                replace: true,
                includeTypes: ["null"]
            },
            results: {
                a: null,
                b: {
                    x: 3,
                    y: 3
                },
                c: 2
            }
        },
        expected: {
            results: {
                a: null,
                b: {
                    x: 3,
                    y: 3
                },
                c: 2
            }
        },
        saveDateTime: "10-13-2016 07:47:34 pm",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 9,
        id: "arg1=1st arg (list):[0,1,2,3],1st arg (list)[0]:null,1st arg (list)[1]:[a,b],1st arg (list)[1].a:1,1st arg (list)[1].b:1,1st arg (list)[2]:[a,b,c],1st arg (list)[2].a:2,1st arg (list)[2].b:[x,z],1st arg (list)[2].b.x:2,1st arg (list)[2].b.z:9,1st arg (list)[2].c:[x],1st arg (list)[2].c.x:2,1st arg (list)[3]:[a,b,c],1st arg (list)[3].a:null,1st arg (list)[3].b:[x,y],1st arg (list)[3].b.x:3,1st arg (list)[3].b.y:3,1st arg (list)[3].c:2,arg2=2nd arg (options):[replace],2nd arg (options).replace:false,note:<b>replacescenarioswithObjects</b>appendonly",
        note: "<b>replace scenarios with Objects</b>\nappend only",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>list</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: [
                null,
                {
                    a: 1,
                    b: 1,
                    c: 2
                },
                {
                    a: 2,
                    b: {
                        x: 2,
                        z: 9
                    },
                    c: {
                        x: 2
                    }
                },
                {
                    a: null,
                    b: {
                        x: 3,
                        y: 3
                    },
                    c: 2
                }
            ],
            1: {
                replace: false
            },
            results: {
                a: 1,
                b: 1,
                c: 2
            }
        },
        expected: {
            0: [
                null,
                {
                    a: 1,
                    b: 1,
                    c: 2
                },
                {
                    a: 2,
                    b: {
                        x: 2,
                        z: 9
                    },
                    c: {
                        x: 2
                    }
                },
                {
                    a: null,
                    b: {
                        x: 3,
                        y: 3
                    },
                    c: 2
                }
            ],
            results: {
                a: 1,
                b: 1,
                c: 2
            }
        },
        saveDateTime: "10-13-2016 07:51:24 pm",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 10,
        id: "arg1=1st arg (list):[0,1,2,3],1st arg (list)[0]:null,1st arg (list)[1]:[a,b],1st arg (list)[1].a:1,1st arg (list)[1].b:1,1st arg (list)[2]:[a,b,c],1st arg (list)[2].a:2,1st arg (list)[2].b:[x,z],1st arg (list)[2].b.x:2,1st arg (list)[2].b.z:9,1st arg (list)[2].c:[x],1st arg (list)[2].c.x:2,1st arg (list)[3]:[a,b,c],1st arg (list)[3].a:null,1st arg (list)[3].b:[x,y],1st arg (list)[3].b.x:3,1st arg (list)[3].b.y:3,1st arg (list)[3].c:2,arg2=2nd arg (options):[replace,append],2nd arg (options).replace:false,2nd arg (options).append:1st,note:<b>replacescenarioswithObjects</b>append1stonly",
        note: "<b>replace scenarios with Objects</b>\nappend 1st only",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>list</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: [
                null,
                {
                    a: 1,
                    b: 1,
                    c: {
                        x: 2
                    }
                },
                {
                    a: 2,
                    b: {
                        x: 2,
                        z: 9
                    },
                    c: {
                        x: 2
                    }
                },
                {
                    a: null,
                    b: {
                        x: 3,
                        y: 3
                    },
                    c: 2
                }
            ],
            1: {
                replace: false,
                append: "1st"
            },
            results: {
                a: 1,
                b: 1,
                c: {
                    x: 2
                }
            }
        },
        expected: {
            0: [
                null,
                {
                    a: 1,
                    b: 1,
                    c: {
                        x: 2
                    }
                },
                {
                    a: 2,
                    b: {
                        x: 2,
                        z: 9
                    },
                    c: {
                        x: 2
                    }
                },
                {
                    a: null,
                    b: {
                        x: 3,
                        y: 3
                    },
                    c: 2
                }
            ],
            results: {
                a: 1,
                b: 1,
                c: {
                    x: 2
                }
            }
        },
        saveDateTime: "10-13-2016 07:51:46 pm",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 11,
        id: "arg1=1st arg (list):[0,1,2,3],1st arg (list)[0]:null,1st arg (list)[1]:[a,b],1st arg (list)[1].a:1,1st arg (list)[1].b:1,1st arg (list)[2]:[a,b,c],1st arg (list)[2].a:2,1st arg (list)[2].b:[x,z],1st arg (list)[2].b.x:2,1st arg (list)[2].b.z:9,1st arg (list)[2].c:[x],1st arg (list)[2].c.x:2,1st arg (list)[3]:[a,b,c],1st arg (list)[3].a:null,1st arg (list)[3].b:[x,y],1st arg (list)[3].b.x:3,1st arg (list)[3].b.y:3,1st arg (list)[3].c:2,arg2=2nd arg (options):[replace,append,clone],2nd arg (options).replace:false,2nd arg (options).append:1st,2nd arg (options).clone:true,note:<b>replacescenarioswithObjects</b>append1stonly",
        note: "<b>replace scenarios with Objects</b>\nappend 1st only",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n",
        actual: {
            0: [
                null,
                {
                    a: 1,
                    b: 1
                },
                {
                    a: 2,
                    b: {
                        x: 2,
                        z: 9
                    },
                    c: {
                        x: 2
                    }
                },
                {
                    a: null,
                    b: {
                        x: 3,
                        y: 3
                    },
                    c: 2
                }
            ],
            1: {
                replace: false,
                append: "1st",
                clone: true
            },
            results: {
                a: 1,
                b: 1,
                c: {
                    x: 2
                }
            }
        },
        expected: {
            results: {
                a: 1,
                b: 1,
                c: {
                    x: 2
                }
            }
        },
        saveDateTime: "10-13-2016 07:52:09 pm",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: true,
        testno: 12,
        id: "arg1=1st arg (list):[0,1,2,3],1st arg (list)[0]:null,1st arg (list)[1]:[a,b],1st arg (list)[1].a:1,1st arg (list)[1].b:1,1st arg (list)[2]:[a,b,c],1st arg (list)[2].a:2,1st arg (list)[2].b:[x,z],1st arg (list)[2].b.x:2,1st arg (list)[2].b.z:9,1st arg (list)[2].c:[x],1st arg (list)[2].c.x:2,1st arg (list)[3]:[a,b,c],1st arg (list)[3].a:null,1st arg (list)[3].b:[x,y],1st arg (list)[3].b.x:3,1st arg (list)[3].b.y:3,1st arg (list)[3].c:2,arg2=2nd arg (options):[replace,append],2nd arg (options).replace:@,2nd arg (options).append:@,note:<b>replacescenarioswithObjects</b>onlyreplobjwithobj--non-objwithnon-obj",
        note: "<b>replace scenarios with Objects</b>\nonly repl obj with obj -- non-obj with non-obj",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>list</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: [
                null,
                {
                    a: 2,
                    b: 1,
                    c: {
                        x: 2
                    }
                },
                {
                    a: 2,
                    b: {
                        x: 2,
                        z: 9
                    },
                    c: {
                        x: 2
                    }
                },
                {
                    a: null,
                    b: {
                        x: 3,
                        y: 3
                    },
                    c: 2
                }
            ],
            1: {
                replace: "@",
                append: "@"
            },
            results: {
                a: 2,
                b: 1,
                c: {
                    x: 2
                }
            }
        },
        expected: {
            0: [
                null,
                {
                    a: 2,
                    b: 1,
                    c: {
                        x: 2
                    }
                },
                {
                    a: 2,
                    b: {
                        x: 2,
                        z: 9
                    },
                    c: {
                        x: 2
                    }
                },
                {
                    a: null,
                    b: {
                        x: 3,
                        y: 3
                    },
                    c: 2
                }
            ],
            results: {
                a: 2,
                b: 1,
                c: {
                    x: 2
                }
            }
        },
        saveDateTime: "10-13-2016 08:30:20 pm",
        saveError: "",
        changedDetail: {}
    },
    {
        ok: false,
        testno: 13,
        id: "arg1=1st arg (list):[0,1,2,3],1st arg (list)[0]:null,1st arg (list)[1]:[a,b],1st arg (list)[1].a:1,1st arg (list)[1].b:1,1st arg (list)[2]:[a,b,c],1st arg (list)[2].a:2,1st arg (list)[2].b:[x,z],1st arg (list)[2].b.x:2,1st arg (list)[2].b.z:9,1st arg (list)[2].c:[x],1st arg (list)[2].c.x:2,1st arg (list)[3]:[a,b,c],1st arg (list)[3].a:null,1st arg (list)[3].b:[x,y],1st arg (list)[3].b.x:3,1st arg (list)[3].b.y:3,1st arg (list)[3].c:2,arg2=2nd arg (options):[replace,append],2nd arg (options).replace:+@,2nd arg (options).append:+@,note:<b>replacescenarioswithObjects</b>objcanreplnon-objbutnon-objcannotreplobj",
        note: "<b>replace scenarios with Objects</b>\nobj can repl non-obj but non-obj cannot repl obj",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>list</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: [
                null,
                {
                    a: 2,
                    b: {
                        x: 3,
                        y: 3
                    },
                    c: {
                        x: 2
                    }
                },
                {
                    a: 2,
                    b: {
                        x: 2,
                        z: 9
                    },
                    c: {
                        x: 2
                    }
                },
                {
                    a: null,
                    b: {
                        x: 3,
                        y: 3
                    },
                    c: 2
                }
            ],
            1: {
                replace: "+@",
                append: "+@"
            },
            results: {
                a: 2,
                b: {
                    x: 3,
                    y: 3
                },
                c: {
                    x: 2
                }
            }
        },
        expected: {},
        saveDateTime: "10-13-2016 10:25:56 pm"
    },
    {
        ok: true,
        testno: 14,
        id: "arg1=1st arg (list):[0,1,2,3],1st arg (list)[0]:null,1st arg (list)[1]:[a,b],1st arg (list)[1].a:1,1st arg (list)[1].b:1,1st arg (list)[2]:[a,b,c],1st arg (list)[2].a:2,1st arg (list)[2].b:[x,z],1st arg (list)[2].b.x:2,1st arg (list)[2].b.z:9,1st arg (list)[2].c:[x],1st arg (list)[2].c.x:2,1st arg (list)[3]:[a,b,c],1st arg (list)[3].a:null,1st arg (list)[3].b:[x,y],1st arg (list)[3].b.x:3,1st arg (list)[3].b.y:3,1st arg (list)[3].c:2,arg2=2nd arg (options):[replace,append],2nd arg (options).replace:+@r,2nd arg (options).append:+@,note:<b>replacescenarioswithObjects</b>embeddedbobjmergedreplexisting",
        note: "<b>replace scenarios with Objects</b>\nembedded b obj merged repl existing",
        warn: "expected <cite>return value</cite> •not&nbsp;specified•\n1st arg <cite>list</cite> changed; expected value •not&nbsp;specified•\n",
        actual: {
            0: [
                null,
                {
                    a: 2,
                    b: {
                        x: 3,
                        y: 3
                    },
                    c: {
                        x: 2
                    }
                },
                {
                    a: 2,
                    b: {
                        x: 2,
                        z: 9
                    },
                    c: {
                        x: 2
                    }
                },
                {
                    a: null,
                    b: {
                        x: 3,
                        y: 3
                    },
                    c: 2
                }
            ],
            1: {
                replace: "+@r",
                append: "+@"
            },
            results: {
                a: 2,
                b: {
                    x: 3,
                    y: 3
                },
                c: {
                    x: 2
                }
            }
        },
        expected: {
            0: [
                null,
                {
                    a: 2,
                    b: {
                        x: 3,
                        y: 3
                    },
                    c: {
                        x: 2
                    }
                },
                {
                    a: 2,
                    b: {
                        x: 2,
                        z: 9
                    },
                    c: {
                        x: 2
                    }
                },
                {
                    a: null,
                    b: {
                        x: 3,
                        y: 3
                    },
                    c: 2
                }
            ],
            results: {
                a: 2,
                b: {
                    x: 3,
                    y: 3
                },
                c: {
                    x: 2
                }
            }
        },
        saveDateTime: "10-13-2016 09:43:12 pm"
    }
]