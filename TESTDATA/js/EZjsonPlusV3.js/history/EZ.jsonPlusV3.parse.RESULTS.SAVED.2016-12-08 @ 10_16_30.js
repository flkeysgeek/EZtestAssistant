EZ.test.savedResults=		//Saved @ 12-08-2016 10:16:30 am
[
	'"test #1 no data"'
,
	''
	+ '{\n'
	+ '    ok: false,\n'
	+ '    testno: 2,\n'
	+ '    id: "arg1=1st arg (json):{\\n    \\"ok\\": true,\\n    \\"actual\\": {\\n        \\"0\\": {\\n            \\"d\\": {\\n                \\"tagName\\": \\"div\\",\\n                \\"id\\": \\"testDiv\\",\\n                \\"@JSON_escapeMarker@\\": \\"$.actual.0.d=@HTML@\\"\\n            }\\n        }\\n    }\\n},arg2=2nd arg (options):,note:<b>livefaults</b><p>nativeJSON:<br>{<br>&nbsp;&nbsp;\\"ok\\":&nbsp;true,<br>&nbsp;&nbsp;\\"actual\\":&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;\\"0\\":&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\\"d\\":&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\\"tagName\\":&nbsp;\\"div\\",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\\"id\\":&nbsp;\\"testDiv\\",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\\"@JSON_escapeMarker@\\":&nbsp;\\"$.actual.0.d=@HTML@\\"<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;}<br>}",\n'
	+ '    note: "<b>live faults</b>\\n<p>native JSON:<br>{<br>&nbsp;&nbsp;\\"ok\\":&nbsp;true,<br>&nbsp;&nbsp;\\"actual\\":&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;\\"0\\":&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\\"d\\":&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\\"tagName\\":&nbsp;\\"div\\",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\\"id\\":&nbsp;\\"testDiv\\",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\\"@JSON_escapeMarker@\\":&nbsp;\\"$.actual.0.d=@HTML@\\"<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;}<br>}",\n'
	+ '    warn: "<cite>return value</cite> NOT expected Object\\n",\n'
	+ '    actual: {\n'
	+ '        0: "{\\n    \\"ok\\": true,\\n    \\"actual\\": {\\n        \\"0\\": {\\n            \\"d\\": {\\n                \\"tagName\\": \\"div\\",\\n                \\"id\\": \\"testDiv\\",\\n                \\"@JSON_escapeMarker@\\": \\"$.actual.0.d=@HTML@\\"\\n            }\\n        }\\n    }\\n}",\n'
	+ '        1: "",\n'
	+ '        results: {\n'
	+ '            ok: true,\n'
	+ '            actual: {\n'
	+ '                0: {\n'
	+ '                    d: {\n'
	+ '                        "@JSON_escapeMarker@": "$.actual.results.actual.0.d=<div></div>"\n'
	+ '                    }\n'
	+ '                }\n'
	+ '            }\n'
	+ '        }\n'
	+ '    },\n'
	+ '    expected: {\n'
	+ '        results: {\n'
	+ '            ok: true,\n'
	+ '            actual: {\n'
	+ '                0: {\n'
	+ '                    d: {\n'
	+ '                        tagName: "div",\n'
	+ '                        id: "testDiv",\n'
	+ '                        "@JSON_escapeMarker@": "$.actual.0.d=@HTML@"\n'
	+ '                    }\n'
	+ '                }\n'
	+ '            }\n'
	+ '        }\n'
	+ '    },\n'
	+ '    saveDateTime: "12-08-2016 10:16:29 am"\n'
	+ '}'
]