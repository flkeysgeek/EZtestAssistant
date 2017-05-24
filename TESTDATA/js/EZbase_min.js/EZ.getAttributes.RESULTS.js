EZ.test.savedResults=		//Saved @ 08-05-2016 05:06:46 am
[
    {
        ok: false,
        testno: 1,
        id: "arg1=1st arg (arg):input type=text value=160 size=5 id=maxHeightTestRows onchange=EZ.copyValue('maxHeightTestRows', this.value),note:numberattrvaluenotquoted",
        note: "number attr value not quoted",
        warn: "<cite>return value</cite> NOT expected Object\n",
        actual: {
            0: "input type=text value=160 size=5 id=maxHeightTestRows onchange=EZ.copyValue('maxHeightTestRows', this.value)",
            results: {
                input: "",
                type: "text",
                value: "",
                size: "5",
                id: "maxHeightTestRows",
                onchange: "EZ",
                copyValue: "",
                maxHeightTestRows: "",
                this: ""
            }
        },
        expected: {
            results: {
                input: "",
                type: "text",
                value: "160",
                size: "5",
                id: "maxHeightTestRows",
                onchange: "EZ.copyValue('maxHeightTestRows', this.value)"
            }
        },
        saveDateTime: "08-05-2016 05:06:45 am",
        used: true
    },
    {
        ok: false,
        testno: 2,
        id: "arg1=1st arg (arg):input type=text value=\"160\" size=\"5\" id=maxHeightTestRows onchange=EZ.copyValue('maxHeightTestRows', this.value),note:numberattrvaluenotquoted",
        note: "number attr value not quoted",
        warn: "<cite>return value</cite> NOT expected Object\n",
        actual: {
            0: "input type=text value=\"160\" size=\"5\" id=maxHeightTestRows onchange=EZ.copyValue('maxHeightTestRows', this.value)",
            results: {
                input: "",
                type: "text",
                value: "",
                size: "5",
                id: "maxHeightTestRows",
                onchange: "EZ",
                copyValue: "",
                maxHeightTestRows: "",
                this: ""
            }
        },
        expected: {
            results: {
                input: "",
                type: "text",
                value: "160",
                size: "5",
                id: "maxHeightTestRows",
                onchange: "EZ.copyValue('maxHeightTestRows', this.value)"
            }
        },
        saveDateTime: "08-05-2016 05:06:45 am",
        used: true
    },
    {
        ok: true,
        testno: 3,
        id: "arg1=1st arg (arg):input type=text value=160 size=5 id=maxHeightTestRows onchange=\"EZ.copyValue('maxHeightTestRows', this.value)\",note:numberattrvaluenotquoted",
        note: "number attr value not quoted",
        warn: "",
        actual: {
            0: "input type=text value=160 size=5 id=maxHeightTestRows onchange=\"EZ.copyValue('maxHeightTestRows', this.value)\"",
            results: {
                input: "",
                type: "text",
                value: "160",
                size: "5",
                id: "maxHeightTestRows",
                onchange: "EZ.copyValue('maxHeightTestRows', this.value)"
            }
        },
        expected: {
            results: {
                input: "",
                type: "text",
                value: "160",
                size: "5",
                id: "maxHeightTestRows",
                onchange: "EZ.copyValue('maxHeightTestRows', this.value)"
            }
        },
        saveDateTime: "08-05-2016 05:06:46 am",
        used: true
    }
]