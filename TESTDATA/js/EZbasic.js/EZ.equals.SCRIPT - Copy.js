/*--------------------------------------------------------------------------------------------------
Dreamweaver LINT global references and definitions  not used here
--------------------------------------------------------------------------------------------------*/
/*global 
EZ, DWfile, 

e:true, g:true, dw:true, f:true
*/
var e;			//global var for try/catch
(function() {[	//global variables and functions defined but not used

e, f, g, dw, DWfile ]});
//__________________________________________________________________________________________________

/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.equals.test = function EZequals_test()
{
	var x, y, o, obj, note = '', ex, showDiff;
	[x, y, o, obj, note, ex, showDiff];

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//============================================================================================
	var exfn = function(testrun)
	{
		var opts = testrun.getArgument('3rd');
		
		var rtnValue = opts ? opts.rtnValue : '';
		if (!rtnValue)
		{
			testrun.appendNote('no rtnValue available'.wrap('<em>'));
			return;
		}
		if (testrun.getResults() === false && 'showDiff' in opts)
		{
			var log = rtnValue.log ? rtnValue.log.format().join('\n') : '';
			if (log)
			{
			}	
			else
			{	 
				//'EZ.equals.log missing');
			}
//			if (testrun.expected.results === false)
//				return false + '\n' + log;
		}
		if (true) return;

		/* beta circular stats -- NA to refactored circular code 
		var counts = {matched: 0, unmatched: 0, repeated_x_objects:[]};
		var matched = '.details.matchedObj.x'.ov(EZ.test.data, []);
		var unmatched = '.details.unmatchedObj.x'.ov(EZ.test.data, []);
		'.details.processedObj.x'.ov(EZ.test.data, []).forEach(function(obj, idx)
		{
			var json = EZ.stringify(obj, '*').replace(/\s/g, '');
			counts.repeated_x_objects.push( json );
			if (matched[idx].length)
				counts.matched++;
			if (unmatched[idx].length)
				counts.unmatched++;

		});
		*/
		//testrun.results = {equals:testrun.results, repeated:counts}
	}
	//============================================================================================
	var notefn = function(testrun, phase)	
	{
		if (phase == 'prerun')
		{
			var opts = EZ.options(testrun.getArgument('3rd'));	//clone opts arg via EZ.options()
			opts.rtnValue = {};	// new EZ.equals().rtnValue()	//append rtnValue Object 
			testrun.setArgument('3rd', opts);
		}
		if (ex !== undefined)
			testrun.setExpectedResults(ex);
		if (note !== undefined)
			testrun.setNote(note);
		ex = note = undefined;
	}
	//============================================================================================
	var exNote = 'expected results defined -- ';
	EZ.test.settings( {group: exNote, notefn:notefn, exfn:exfn} );
	//============================================================================================
	function setup(opts)
	{
		if (!EZ.test.isRun()) return;

		opts = opts || {ex:true, note:note}
		e = exfn;
		opts.exfn = exfn;


		showDiff = false;			//EZ.test.run() argument
		if (opts.ex === false || opts.showDiff)
		{
			showDiff = EZ.test.data.argNames.slice(0,2).join(',');
		}
		EZ.test.options(opts)
	}
	//==============================================================================
	EZ.test.settings( {group: exNote + 'easy test'} );


	//______________________________________________________________________________
	EZ.test.settings( {group: exNote + 'exclude'} );


	//______________________________________________________________________________
	EZ.test.settings( {group: exNote + 'showDiff'} );

	note = '';
	x = {b:2, c:String.fromCharCode(13), a:[0,1], o:'{}'}
	y = {b:"2", c:false, a:[0], '':'', o:{}}
	ex = ''
	   + 'false\n'
	   + 'x [Object] ... y       \n'
	   + ' .b: 2     !== "2"     \n'
	   + ' .c: "' + EZ.EOL + '"   !== false   \n'
	   + ' .a[1]: 1  !== NA      \n'
	   + ' .o: "{}"  !== [Object]\n'
	   + ' ."": NA   !== ""      ';

	//setup({ex:ex, showDiff:true});
	ex = false;
	EZ.test.run(x, y, {showDiff:true})

	x = {'':1, '1':1, a:1, b:2, aa:[0,1]}
	y = {'0':1, '1':1, b:2, c:3, aa:[0]}
	ex = ''
	   + 'false\n'
	   + 'x [Object]  ... y \n'
	   + ' [0]: NA    !== 1 \n'
	   + ' ."": 1     !== NA\n'
	   + ' .a: 1      !== NA\n'
	   + ' .aa[1]: 1  !== NA\n'
	   + ' .c: NA     !== 3 ';

	setup({ex:ex, showDiff:true});
	EZ.test.run(x, y, showDiff);
	ex = null;

	//______________________________________________________________________________
	EZ.test.settings( {group: exNote} );
	//______________________________________________________________________________
	note = 'simple Circular Objects';
	
	var x = {a:1};
	var y = {a:1};
	x.b = x;
	y.b = y;
	EZ.test.run(x, y		,{EZ: {ex:true	}})
	
	//______________________________________________________________________________
	note = "Custom Object: EZoptions --> Object"
	x = EZ.options(
	{
	    2: "1st",
	    11: "2nd",
	    b: "4th",
	    a: "3rd"
	});
	y = {
		11: "2nd",
		2: "1st",
		a: "3rd",
		b: "4th"
   	}
	EZ.test.options( {ex:false, note:'diff constructor -- NOT ingored'} )
	EZ.test.run( x,y, {showDiff:true, console:true} )
	
	EZ.test.options( {ex:true, note:'diff constructor -- but ingored'} )
	EZ.test.run( x,y, {showDiff:true, console:true, ignore:'objectType'} )

	//______________________________________________________________________________
	EZ.test.settings( {group: exNote + 'test ArrayLike / ObjectLike'} );

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	obj = {a:1, b:2};
	var array = [0,1];
	var arrayLike = {'0':0, '1':1, length:2}

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'x is array -- y is ArrayLike -- same keys and values'
	var x = array
	var y = arrayLike
	setup({ex:false, note:note})
	EZ.test.run(x, y, showDiff)

//EZ.test.skip(99999)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'x & y both same Array'
	x = array
	y = array
	setup({ex:true, note:note})
	EZ.test.run(x, y, showDiff)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'x & y diff Arrays with same indexes & values'
	x = array
	y = array.slice();
	setup({ex:true, note:note})
	EZ.test.run(x, y, showDiff)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'x & y diff Arrays with same indexes but diff values'
	x = array
	y = array.slice();
	y[1] = 999;
	setup({ex:false, note:note})
	EZ.test.run(x, y, showDiff)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'x & y diff Arrays with diff indexes'
	x = array
	y = [0];
	setup({ex:false, note:note})
	EZ.test.run(x, y, showDiff)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'x & y diff Arrays with named key of extra with same value'
	x = array.slice()
	x.extra = 'xyz'
	y = array.slice()
	y.extra = 'xyz'
	setup({ex:true, note:note})
	EZ.test.run(x, y, showDiff)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'x & y diff Arrays with named key of extra with diff value'
	x = array.slice()
	x.extra = 'abc'
	y = array.slice()
	y.extra = 'xyz'
	setup({ex:false, note:note})
	EZ.test.run(x, y, showDiff)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'x & y save Array values -- x.extra="abc" y does not have extra'
	x = array.slice()
	x.extra = 'abc'
	y = array.slice()
	setup({ex:false, note:note})
	EZ.test.run(x, y, showDiff)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'x & y save Array values -- x does not have extra y.extra="xyz"'
	x = array.slice()
	y = array.slice()
	y.extra = 'xyz'
	setup({ex:false, note:note})
	EZ.test.run(x, y, showDiff)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'diff obj but same keys and values\n'
		 + 'x.o & x.obj is same obj -- x.obj & y.obj same object'
	x = {
		argsOk: true,
		obj: obj,
		o: obj,
		used: true
	}
	y = {
		argsOk: true,
		obj: {a:1, b:2},
		o: obj,
		used: true
	}
	setup({ex:true, note:note})
	EZ.test.run(x, y, showDiff)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'diff obj -- same single key -- but x.obj / y.obj not same type'
	x = { obj: obj }
	y = { obj: [1, 2] }
	setup({ex:false, note:note})
	EZ.test.run(x, y, showDiff)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'diff obj -- same single key -- x.obj is boolean,  y.obj is obj'
	x = { obj: obj }
	y = { obj: true }
	setup({ex:false, note:note})
	EZ.test.run(x, y, showDiff)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'diff obj -- same single key -- x.obj is obj,  y.obj is boolean'
	x = { obj: false }
	y = { obj: obj }
	setup({ex:false, note:note})
	EZ.test.run(x, y, showDiff)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'diff obj -- same single key & values --but  x.obj is ArrayLike,  y.obj is Array'
	x = { obj: obj }
	y = { obj: [1, 2] }
	setup( {ex:false, note:note} )
	EZ.test.run(x, y, showDiff)
	
	EZ.test.options( {note: 'formattedLog incorrect'} )
	EZ.test.run([1, undefined], [1, null], {showDiff:true})


	//__________________________________________________________________________________________________
	EZ.test.settings( {group: exNote + 'tests from stackoverflow base code', exfn:exfn} )

	EZ.test.run(null,null, 					{EZ:{ ex:true }});
	EZ.test.run(null,undefined,true,		{EZ:{ ex:false }});
	EZ.test.run(/abc/, /abc/, 				{EZ:{ ex:true }});
	EZ.test.run(/abc/, /123/,true,			{EZ:{ ex:false }});

	var r = /abc/g;
	EZ.test.run(r, /abc/g, 					{EZ:{ ex:true }});
	EZ.test.run(r, /abc/,true,				{EZ:{ ex:false }});
	r.lastIndex = 2;
	EZ.test.run(r, /abc/g,true, 			{EZ:{ ex:false }});

	EZ.test.run("hi","hi",					{EZ:{ ex:true }});
	EZ.test.run("hi","hi ",true,			{EZ:{ ex:false }});

	EZ.test.run(5,5, 						{EZ:{ ex:true }});
	EZ.test.run(5,10,true,					{EZ:{ ex:false }});

	EZ.test.run(Number(5),5,				{EZ:{ note:note, ex:true }});
	EZ.test.run(Number(5),10,true, 			{EZ:{ note:note, ex:false }});
	EZ.test.run(Number(1),"1",true,			{EZ:{ note:note, ex:false }});

	EZ.test.run(true,true, true,			{EZ:{ ex:true }});
	EZ.test.run(true,false, true,			{EZ:{ ex:false }});

	note = 'EZ.equals(Boolean(true),true, true)\ncall args not displayed correctly'
	EZ.test.run(Boolean(true),true, true,	{EZ:{ note:note, ex:true }});
	EZ.test.run(Boolean(true),false, true,	{EZ:{ note:note, ex:false }});
	note = '';

	var d1 = new Date("2016/03/31 8:00 am")
	var d2 = new Date("2016/03/31 8:00:00.010")
	EZ.test.run(d1,d2, true,									{EZ:{ ex:false }});
	EZ.test.run(d1,new Date("2016/03/31 8:00:10 pm"), true,		{EZ:{ ex:false }});

	EZ.test.run(new Date("2011/03/31"), new Date("2011/03/31"), {EZ:{ ex:true }});
	EZ.test.run(new Date("2011/03/31"), new Date(""),true,		{EZ:{ ex:false }});

	//date.getTimezoneOffset()/60 }
	x = "03/14/2016 1:00 pm EST";
	y = "03/14/2016 06:00 pm GMT";
	setup({note:x+'\n'+y, ex:true})
	EZ.test.run(new Date(x), new Date(y), showDiff)

	x = "03/14/2016 1:00:01 pm EST";
	y = "03/14/2016 06:00 pm GMT";
	setup({note:x+'\n'+y, ex:false})
	EZ.test.run(new Date(x), new Date(y), showDiff)


	//______________________________________________________________________________

	EZ.test.run([],[],true, 				{EZ:{ ex:true }});
	EZ.test.run([1,2],[1,2], 				{EZ:{ ex:true }});
	EZ.test.run([1,2],[2,1],true,			{EZ:{ ex:false }});
	EZ.test.run([1,2],[1,2,3],true,			{EZ:{ ex:false }});

	EZ.test.run({},{},true,					{EZ:{ ex:true }});
	EZ.test.run({a:1,b:2},{a:1,b:2},		{EZ:{ ex:true }});
	EZ.test.run({a:1,b:2},{b:2,a:1}, 		{EZ:{ ex:true }});
	EZ.test.run({a:1,b:2},{a:1,b:3},true,	{EZ:{ ex:false }})

	EZ.test.run({},null,true, 				{EZ:{ ex:false }});
	EZ.test.run({},undefined,true, 			{EZ:{ ex:false }});

	EZ.test.run([],[], 						{EZ:{ ex:true }});
	EZ.test.run([1,2],[1,2], 				{EZ:{ ex:true }});
	EZ.test.run([1,2],[2,1],true,			{EZ:{ ex:false }});
	EZ.test.run([1,2],[1,2,3],true,			{EZ:{ ex:false }});

	EZ.test.run({},{}, 				 		{EZ:{ ex:true }});
	EZ.test.run({a:1,b:2},{a:1,b:2}, 		{EZ:{ ex:true }});
	EZ.test.run({a:1,b:2},{b:2,a:1}, 		{EZ:{ ex:true }});
	EZ.test.run({a:1,b:2},{a:1,b:3},true, 	{EZ:{ ex:false }});

	//moved too wide tests

	var a = {a: 'text', b:[0,1]};
	var b = {a: 'text', b:[0,1]};
	var c = {a: 'text', b: 0};
	var d = {a: 'text', b: false};
	var e = {a: 'text', b:[1,0]};
	var i = {
		a: 'text',
		c: {
			b: [1, 0]
		}
	};
	var j = {
		a: 'text',
		c: {
			b: [1, 0]
		}
	};
	var k = {a: 'text', b: null};
	var l = {a: 'text', b: undefined};

	EZ.test.run(a,b,true, {EZ:{ ex:true }});
	EZ.test.run(a,c,true, {EZ:{ ex:false }});
	EZ.test.run(c,d,true, {EZ:{ ex:false }});
	EZ.test.run(a,e,true, {EZ:{ ex:false }});
	EZ.test.run(i,j,true, {EZ:{ ex:true }});
	EZ.test.run(d,k,true, {EZ:{ ex:false }});
	EZ.test.run(k,l,true, {EZ:{ ex:false }});

	//______________________________________________________________________________
	EZ.test.settings( {group: exNote + 'from comments on stackoverflow post'} );

	EZ.test.run([1, 2, undefined], [1, 2], 			true, {EZ:{ ex:false }});
	EZ.test.run([1, 2, 3], { 0: 1, 1: 2, 2: 3 }, 	true, {EZ:{ ex:false }});
	EZ.test.run(new Date(1234), 1234, 				true, {EZ:{ ex:false }});

	// no two different function is equal really, they capture their context variables
	// so even if they have same toString(), they won't have same functionality
	var func = function() { return true; };
	var func2 = function() { return true; };
	var func3 = function() { return false; };

	EZ.test.run(func, func, 							true, {EZ:{ ex:true }});
	EZ.test.run(func, func2, 							true, {EZ:{ ex:true }});
	EZ.test.run(func, func3, 							true, {EZ:{ ex:false }});

	EZ.test.run({ a: { b: func } }, { a: { b: func } }, true, {EZ:{ ex:true }});
	EZ.test.run({ a: { b: func } }, { a: { b: func2 } },true, {EZ:{ ex:true }});

	func.a = 'same';
	func2.a = 'same'
	//EZ.test.run(func, func2, 							true, {EZ:{ ex:true }});

	func2.a = 'diff'
	//EZ.test.run(func, func2, 							true, {EZ:{ ex:false }});


	/*
	EZ.test.run(t_divs[0], t_divs[0].cloneNode(true),		true, {EZ:{ ex:true }});
	EZ.test.run(t_divs[0], t_divs[0].cloneNode(),			true, {EZ:{ ex:false }});
	EZ.test.run(t_radios, t_radios,			true, {EZ:{ ex:true }});
	*/

	//__________________________________________________________________________________________________
	EZ.test.settings( {group: 'issues from test assistant'} );

	note = 'diff keys -- ok has diff values'
	obj = {
		argsOk: true,
		testOk: false,
		display_results: "@test not run@",
		ok: false,
		used: true
	}
	o = {
		argsOk: true,
		testOk: false,
		display_results: "@test not run@",
		ok: true
	}
	setup({ex:false, note:note})
	EZ.test.run(obj, o)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'diff keys -- same values'
	obj = {
		argsOk: true,
		testOk: false,
		display_results: "@test not run@",
		ok: false,
		used: false
	}
	o = {
		argsOk: true,
		testOk: false,
		display_results: "@test not run@",
		ok: false
	}
	setup({ex:false, note:note})
	EZ.test.run(obj, o)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'same keys --  ok has diff values'
	obj = {
		argsOk: true,
		testOk: false,
		display_results: "@test not run@",
		ok: false,
		used: true
	}
	o = {
		argsOk: true,
		testOk: false,
		display_results: "@test not run@",
		ok: true,
		used: true
	}
	setup({ex:false, note:note})
	EZ.test.run(obj, o)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'same keys --  same values'
	obj = {
		argsOk: true,
		testOk: false,
		display_results: "@test not run@",
		ok: true,
		used: true
	}
	o = {
		argsOk: true,
		testOk: false,
		display_results: "@test not run@",
		ok: true,
		used: true
	}
	setup({ex:true, note:note})
	EZ.test.run(obj, o)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'more keys -- not equal'

	obj = {
		note: ""
		+ "test options: none\n"
		 + "this undefined",
		expected: {
			args: [],
			ctx: "@not specified@",
			results: "@not specified@"
		},
		ctxRequired: true,
		args: [],
		display_args: ""
		+ "<pre><i>Array </i> @undefined@\n"
		 + "</pre>",
		ctx: undefined,
		errmsg: "\"this\" not same type as function prototype",
		testno: 5,
		display_expected: "@no expected values supplied@",
		results: "@test not run@",
		ctxOk: true,
		argsOk: true,
		testOk: false,
		display_results: "@test not run@",
		ok: false,
		used: true
	}
	o = {
		note: ""
		+ "test options: none\n"
		 + "this undefined",
		expected: {
			args: [],
			ctx: "@not specified@",
			results: "@not specified@"
		},
		ctxRequired: true,
		args: [],
		display_args: ""
		+ "<pre><i>Array </i> @undefined@\n"
		 + "</pre>",
		ctx: undefined,
		errmsg: "\"this\" not same type as function prototype",
		testno: 5,
		display_expected: "@no expected values supplied@",
		results: "@test not run@",
		ctxOk: true,
		argsOk: true,
		testOk: false,
		display_results: "@test not run@",
		ok: true
	}
	setup({ex:false, note:note})
	EZ.test.run(obj, o)
	

	//______________________________________________________________________________
	EZ.test.settings( {group: 'live faults'} );
	//______________________________________________________________________________
	note = "created @ 07-05-2016 03:08:51pm"
	x = {
	    2: "1st",
	    11: "2nd",
	    b: "4th",
	    a: "3rd"
	}
	y = {
		11: "2nd",
		2: "1st",
		a: "3rd",
		b: "4th"
   	}
	EZ.test.options( {ex:true, note:note} )
	EZ.test.run( x,y )

	//______________________________________________________________________________
	EZ.test.options( {note:'invalid dates should be equal'} )
	EZ.test.run(new Date(''), new Date(''))

	x = {children:true, objects:Object, functions:false, maxdepth:4};
	y = EZ.cloneDev.object(x)
	EZ.test.options( {note:''} )
	EZ.test.run(x, y)
}

/*
	//______________________________________________________________________________
	var objClone	;
	EZ.test.settings( {group: 'repeated objects'} );


	note = '';
	obj = {a:1}
	x = {a:obj, b:obj}
	y = {a:obj, b:obj}

	setup( {ex:true, note:note} )
	EZ.test.run(x, y, showDiff)

	objClone = EZ.mergeAll(obj);
	y = {a:objClone, b:objClone}

	setup( {ex:true, note:note} )
	EZ.test.run(x, y, showDiff)

	x.c = {};
	y.c = y.b;
	setup( {ex:false, note:note} )
	EZ.test.run(x, y, showDiff)

	EZ.test.skip(1)		//circular reference
	x.c = x;
	y.c = x;
	setup( {ex:false, note:note} )
	EZ.test.run(x, y, showDiff)


	//obj.b = obj;
*/
