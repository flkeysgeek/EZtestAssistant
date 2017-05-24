EZ.test.savedResults=		//Saved @ 05-29-2016 02:48:14 pm
[
    {
        testno: 1,
        id: "arg1=json:[testno,id,safe,note],json.testno:1,json.id:arg1=number:1234,note:,json.safe:[actual,expected],json.safe.actual:[0,results],json.safe.actual[0]:1234,json.safe.actual.results:1234th,json.safe.expected:[0,results],json.safe.expected[0]:â€¢not specifiedâ€¢,json.safe.expected.results:1234th,json.note:,note:mistakes\"number:\"asunquotedobjectkey",
        note: "mistakes \"number:\" as unquoted object key",
        actual: {
            0: {
                testno: 1,
                id: "arg1=number:1234,note:",
                safe: {
                    actual: {
                        0: 1234,
                        results: "1234th"
                    },
                    expected: {
                        0: "â€¢not specifiedâ€¢",
                        results: "1234th"
                    }
                },
                note: ""
            },
            results: ""
            + "{\n"
            + "    testno: 1,\n"
            + "    id: \"arg1=number:1234,note:\",\n"
            + "    safe: {\n"
            + "        actual: {\n"
            + "            0: 1234,\n"
            + "            results: \"1234th\"\n"
            + "        },\n"
            + "        expected: {\n"
            + "            0: \"â€¢not specifiedâ€¢\",\n"
            + "            results: \"1234th\"\n"
            + "        }\n"
            + "    },\n"
            + "    note: \"\"\n"
            + "}"
        },
        ok: false,
        saveDateTime: "05-29-2016 02:48:14 pm",
        used: true
    }
]