if (!testnoRun)						//not rerun
	initClipboard('lineno');


/*-----------------------------------------------------------------------------
Init ZeroClipboard for clipboard COPY and AllowClipboard for PASTE if chrome.

For each copy image button, attach ZeroClipboard and define text copied.
For each paste button, attach pasteClipbord() event handler and paste target.

REFEERENCE:
	http://davidwalsh.name/demo/zero-clipboard.php
	http://help.dottoro.com/external/examples/ljinpbdi/getData_2.htm
	http://fartersoft.com/blog/2010/11/20/accessing-operating-system-clipboard-in-chromium-chrome-extensions/
	http://stackoverflow.com/questions/6969403/cant-get-execcommandpaste-to-work-in-chrome/7100464#7100464
-----------------------------------------------------------------------------*/
function initClipboard(tags)
{
	//----- paste setup for chrome
	//if (window.AllowClipboard)
	//	EZ.clipboardClient = new AllowClipboard.Client.ClipboardClient();

	//----- ZeroClipboard COPY setup for all browsers
	//var tags = document.getElementsByClassName('copy');

	tags = EZ(tags, true);
	var client = new ZeroClipboard(tags);
	client.on( "ready", function(readyEvent)
	{
		e = readyEvent;
		console.log("ZeroClipboard SWF is ready!");

		// beforecopy event handler -- event.target is element clicked
		client.on("beforecopy", function(event)
		{
			//var id = event.target.id;
			var el = event.target;
			var td = EZ.getAncestor(el, 'td');
			var testno = EZ.get(EZ('testno',td))
			var testrun = EZ.test.data.testrun[ Number(testno) - 1];
			var value = EZ.test.jsonValue(testrun.safe.actual.results);
			ZeroClipboard.setData("text/plain", value);
		});
		client.on( "aftercopy", function( event )
		{
			var text = event.data["text/plain"];
			if (text === undefined)
				return console.log('clipboard: Copy Failed');	//returns undefined

			var msg = 'clipboard set to actual return value:\n' + text;
			EZ.displayMessage(msg, event.target);
			console.log( {clipboard: 'copy', 'actual return value': text} );
		});
	});
}
