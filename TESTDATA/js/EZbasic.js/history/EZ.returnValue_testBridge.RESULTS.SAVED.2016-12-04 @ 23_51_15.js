EZ.test.savedResults=		//Saved @ 12-04-2016 11:51:15 pm
[
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 1,\n'
	+ '    id: "arg1=1st arg (value):return value,arg2=2nd arg (options):[returnType],2nd arg (options).returnType:false,note:",\n'
	+ '    note: "1st actual return argument set to <cite>EZ.test.run.values</cite>",\n'
	+ '    warn: "expected <cite>return value</cite> •not&nbsp;specified•\\n",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            babe: "Brenda"\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            _data: {\n'
	+ '                success: "na"\n'
	+ '            },\n'
	+ '            _EZreturnValue: true,\n'
	+ '            value: "return value"\n'
	+ '        },\n'
	+ '        results: "return value"\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        0: {\n'
	+ '            babe: "Brenda"\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            _data: {\n'
	+ '                success: "na"\n'
	+ '            },\n'
	+ '            _EZreturnValue: true,\n'
	+ '            value: "return value"\n'
	+ '        },\n'
	+ '        results: "return value"\n'
	+ '    },\n'
	+ '    used: true,\n'
	+ '    saveDateTime: "12-04-2016 11:50:00 pm"\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 2,\n'
	+ '    id: "arg1=1st arg (value):return rtnValue,arg2=2nd arg (options):[returnType],2nd arg (options).returnType:true,note:",\n'
	+ '    note: "1st actual return argument set to <cite>EZ.test.run.values</cite>\\n2nd actual return argument set to pruned <cite>rtnValue</cite>",\n'
	+ '    warn: "expected <cite>return value</cite> •not&nbsp;specified•\\n1st arg <cite>value</cite> changed; expected value •not&nbsp;specified•\\n2nd arg <cite>options</cite> changed; expected value •not&nbsp;specified•\\n",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            babe: "Brenda"\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            _data: {\n'
	+ '                success: "na",\n'
	+ '                returnType: true\n'
	+ '            },\n'
	+ '            _EZreturnValue: true,\n'
	+ '            value: "return rtnValue"\n'
	+ '        },\n'
	+ '        results: {\n'
	+ '            _data: {\n'
	+ '                success: "na",\n'
	+ '                returnType: true\n'
	+ '            },\n'
	+ '            _EZreturnValue: true,\n'
	+ '            value: "return rtnValue"\n'
	+ '        }\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        0: {\n'
	+ '            babe: "Brenda"\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            _data: {\n'
	+ '                success: "na",\n'
	+ '                returnType: true\n'
	+ '            },\n'
	+ '            _EZreturnValue: true,\n'
	+ '            value: "return rtnValue"\n'
	+ '        },\n'
	+ '        results: {\n'
	+ '            _data: {\n'
	+ '                success: "na",\n'
	+ '                returnType: true\n'
	+ '            },\n'
	+ '            _EZreturnValue: true,\n'
	+ '            value: "return rtnValue"\n'
	+ '        }\n'
	+ '    },\n'
	+ '    used: true,\n'
	+ '    saveDateTime: "12-04-2016 11:51:08 pm"\n'
	+ '}'
,
	''
	+ '{\n'
	+ '    ok: true,\n'
	+ '    testno: 3,\n'
	+ '    id: "arg1=1st arg (value):called as new,arg2=2nd arg (options):[],note:",\n'
	+ '    note: "1st actual return argument set to <cite>EZ.test.run.values</cite>\\n2nd actual return argument set to pruned <cite>rtnValue</cite>",\n'
	+ '    warn: "expected <cite>return value</cite> •not&nbsp;specified•\\n1st arg <cite>value</cite> changed; expected value •not&nbsp;specified•\\n2nd arg <cite>options</cite> changed; expected value •not&nbsp;specified•\\n",\n'
	+ '    actual: {\n'
	+ '        0: {\n'
	+ '            babe: "Brenda"\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            _data: {\n'
	+ '                success: "na"\n'
	+ '            },\n'
	+ '            _EZreturnValue: true,\n'
	+ '            value: "called as new"\n'
	+ '        },\n'
	+ '        results: {\n'
	+ '            _data: {\n'
	+ '                "@JSON_escapeMarker@": "$.actual.results._data=$.actual.1._data"\n'
	+ '            }\n'
	+ '        }\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        0: {\n'
	+ '            babe: "Brenda"\n'
	+ '        },\n'
	+ '        1: {\n'
	+ '            _data: {\n'
	+ '                success: "na"\n'
	+ '            },\n'
	+ '            _EZreturnValue: true,\n'
	+ '            value: "called as new"\n'
	+ '        },\n'
	+ '        results: {\n'
	+ '            _data: {\n'
	+ '                success: "na"\n'
	+ '            },\n'
	+ '            toString: {\n'
	+ '                "@JSON_escapeMarker@": "$.expected.results.toString=$.actual.results.toString"\n'
	+ '            },\n'
	+ '            valueOf: {\n'
	+ '                "@JSON_escapeMarker@": "$.expected.results.valueOf=$.actual.results.valueOf"\n'
	+ '            },\n'
	+ '            save: {\n'
	+ '                "@JSON_escapeMarker@": "$.expected.results.save=$.actual.results.save"\n'
	+ '            },\n'
	+ '            setValue: {\n'
	+ '                "@JSON_escapeMarker@": "$.expected.results.setValue=$.actual.results.setValue"\n'
	+ '            },\n'
	+ '            getValue: {\n'
	+ '                "@JSON_escapeMarker@": "$.expected.results.getValue=$.actual.results.getValue"\n'
	+ '            },\n'
	+ '            isOk: {\n'
	+ '                "@JSON_escapeMarker@": "$.expected.results.isOk=$.actual.results.isOk"\n'
	+ '            },\n'
	+ '            setOk: {\n'
	+ '                "@JSON_escapeMarker@": "$.expected.results.setOk=$.actual.results.setOk"\n'
	+ '            },\n'
	+ '            setFail: {\n'
	+ '                "@JSON_escapeMarker@": "$.expected.results.setFail=$.actual.results.setFail"\n'
	+ '            },\n'
	+ '            getData: {\n'
	+ '                "@JSON_escapeMarker@": "$.expected.results.getData=$.actual.results.getData"\n'
	+ '            },\n'
	+ '            addInfo: {\n'
	+ '                "@JSON_escapeMarker@": "$.expected.results.addInfo=$.actual.results.addInfo"\n'
	+ '            },\n'
	+ '            getInfo: {\n'
	+ '                "@JSON_escapeMarker@": "$.expected.results.getInfo=$.actual.results.getInfo"\n'
	+ '            },\n'
	+ '            addMessage: {\n'
	+ '                "@JSON_escapeMarker@": "$.expected.results.addMessage=$.actual.results.addMessage"\n'
	+ '            },\n'
	+ '            getMessageString: {\n'
	+ '                "@JSON_escapeMarker@": "$.expected.results.getMessageString=$.actual.results.getMessageString"\n'
	+ '            },\n'
	+ '            getMessageObject: {\n'
	+ '                "@JSON_escapeMarker@": "$.expected.results.getMessageObject=$.actual.results.getMessageObject"\n'
	+ '            },\n'
	+ '            getMessage: {\n'
	+ '                "@JSON_escapeMarker@": "$.expected.results.getMessage=$.actual.results.getMessage"\n'
	+ '            },\n'
	+ '            set: {\n'
	+ '                "@JSON_escapeMarker@": "$.expected.results.set=$.actual.results.set"\n'
	+ '            },\n'
	+ '            get: {\n'
	+ '                "@JSON_escapeMarker@": "$.expected.results.get=$.actual.results.get"\n'
	+ '            },\n'
	+ '            addDetails: {\n'
	+ '                "@JSON_escapeMarker@": "$.expected.results.addDetails=$.actual.results.addDetails"\n'
	+ '            },\n'
	+ '            getDetails: {\n'
	+ '                "@JSON_escapeMarker@": "$.expected.results.getDetails=$.actual.results.getDetails"\n'
	+ '            },\n'
	+ '            mergeListItem: {\n'
	+ '                "@JSON_escapeMarker@": "$.expected.results.mergeListItem=$.actual.results.mergeListItem"\n'
	+ '            },\n'
	+ '            addListItem: {\n'
	+ '                "@JSON_escapeMarker@": "$.expected.results.addListItem=$.actual.results.addListItem"\n'
	+ '            },\n'
	+ '            getList: {\n'
	+ '                "@JSON_escapeMarker@": "$.expected.results.getList=$.actual.results.getList"\n'
	+ '            },\n'
	+ '            haveList: {\n'
	+ '                "@JSON_escapeMarker@": "$.expected.results.haveList=$.actual.results.haveList"\n'
	+ '            }\n'
	+ '        }\n'
	+ '    },\n'
	+ '    saveDateTime: "12-04-2016 11:51:14 pm"\n'
	+ '}'
,
	'"test #4 no data"'
,
	'"test #5 no data"'
,
	'"test #6 no data"'
]