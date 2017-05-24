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
	var x, y, o, obj, clone, note = '', ex;
	void(x, y, o, obj, clone, note, ex);

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//============================================================================================
	var exfn = function(testrun)			//show available return details
	{										
		var opts = testrun.getTestValue('options');
		var rtnValue = testrun.getTestValue('rtnValue');
		
		if (testrun.getResults() === false)	
		{									//TODO: only 1st diff if options.showDiff is not true
			var log;
			if (!opts.showDiff)
				testrun.appendNote('showDiff not specified');
			
			else if (log = rtnValue.getFormattedLog())
			{
				testrun.setResultsArgument('3rd', log, 'showDiff log');
				//var name = testrun.getArgumentCiteName('options')
				testrun.appendNote('return value for 3rd arg set to ' + 'showDiff log'.wrap('<cite>'))
			}
			else if (opts.showDiff)
				testrun.appendNote('showDiff log not available', 'alert');
		}
		if (rtnValue.haveList('circular'))		
		{									//circular details
		}
		
		if (rtnValue.haveList('ignored'))			
		{									//ignore details
		}
		
		if (rtnValue.haveList('excluded'))
		{									//exclude details
		}
	}
	//============================================================================================
	var notefn = function(testrun, phase)	//NOT USED
	{										//set options.rtnValue=true if options argument and
		if (phase == 'prerun')				//...options.rtnValue is undefined
		{
			var opts = testrun.getArgument('options');
			if (opts instanceof Object && opts.rtnValue === undefined)
			{
				opts = EZ.options.call( opts, {rtnValue:true} );
				testrun.setArgument('options', opts);
				testrun.appendNote('options.rtnValue set true')
			}
		}
	}
	void(notefn)
	//============================================================================================
	function setup(exArg)					//set test options {ex:ex, note:note}
	{										//...if ex undefined set true
		var opts = {}
		opts.ex = (exArg !== undefined) ? exArg
				: (ex !== undefined) ? ex 
				: true;
		opts.note = note || '';
		
		ex = undefined;
		note = '';

		if (EZ.test.isRun())				//test not skipped
			EZ.test.options(opts)
	}
	//============================================================================================
	EZ.test.settings( {exfn:exfn} );
	var showDiff = {showDiff:true}
	//============================================================================================

	//______________________________________________________________________________
	EZ.test.settings( {group:'showDiff tests:'} );

	x = {'a':1, b:2}
	y = {'a':0, b:''}	
	note = 'easy test'
	setup(false);
	EZ.test.run(x, y, showDiff)		
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	x = {'a':1, b:2}
	y = {'a':0, b:''}	
	note = 'easy test options.neq = "not"'
	setup(false);
	EZ.test.run(x, y, {showDiff:true, neq:'is not'})		
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	note = 'no showDiff option'
	setup(false);
	EZ.test.run(x, y, {})
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	note = 'no rtnValue'
	setup(false);
	EZ.test.run(x, y)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	note = 'showDiff true for Number but no rtnValue'
	setup(false);
	EZ.test.run(x, y, 6)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	note = 'diff array length'
	x = {numbers: [0,1]}
	y = {numbers: [0]}
	ex = false;
	setup();
	EZ.test.run(x, y, showDiff)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	note = 'diff array length'
	ex = false;
	setup();
	EZ.test.run([0,1], [0], showDiff)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	note = 'keys not in same order'
	x = {a:[0], b:2, c:false}
	y = {b:2, c:false, a:[0]}
	ex = false;
	setup();
	EZ.test.run(x, y, {showDiff:true, keys:'sameorder'})
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .


	x = {b:2, c:String.fromCharCode(13), a:[0]}
	y = {b:"2", c:false, d:4, a:[0], '':''}
	ex = false;
	setup();
	EZ.test.run(x, y, showDiff)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	x = {o:'{}'}
	y = {o:{}}
	ex = false;
	setup();
	EZ.test.run(x, y, showDiff)
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	x = {'':1, '1':1, a:1, b:2, aa:[0,1]}
	y = {'0':1, '1':1, b:2, c:3, aa:[0]}
	ex = false;
	setup();
	EZ.test.run(x, y, true);
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	
	//______________________________________________________________________________
	EZ.test.settings( {group: 'exclude:'} );


	//______________________________________________________________________________
	EZ.test.settings( {group: 'Circular Objects:'} );
	
	var x = {a:1};
	var y = {a:1};
	x.b = x;
	y.b = y;
	note = 'simple';
	setup();
	EZ.test.run(x, y		,{EZ: {ex:true	}})
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	var x = {a:'abc'};
	x.b = x;
	obj = {
		actual: {
			0: x,
		}
	}
	clone = {
		actual: {
			0: x,
		}
	}
	setup();
	EZ.test.run(obj, clone, {showDiff:true})
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	/*
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
	
	//______________________________________________________________________________
	EZ.test.settings( {group: 'Custom Object: EZoptions --> Object:'} );
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
	ex = false
	note = 'diff constructor -- NOT ingored'
	setup();
	EZ.test.run( x,y, {showDiff:true, console:true} )
	
	note = 'diff constructor -- but ingored'
	setup();
	EZ.test.run( x,y, {showDiff:true, console:true, ignore:'objectType'} )

	//______________________________________________________________________________
	EZ.test.settings( {group:'test ArrayLike / ObjectLike:'} );

	obj = {a:1, b:2};
	var array = [0,1];
	var arrayLike = {'0':0, '1':1, length:2}

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'x is array -- y is ArrayLike -- same keys and values'
	var x = array
	var y = arrayLike
	ex = false
	setup();
	EZ.test.run(x, y, showDiff)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'x & y both same Array'
	x = array
	y = array
	setup();
	EZ.test.run(x, y, showDiff)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'x & y diff Arrays with same indexes & values'
	x = array
	y = array.slice();
	setup();
	EZ.test.run(x, y, showDiff)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'x & y diff Arrays with same indexes but diff values'
	x = array
	y = array.slice();
	y[1] = 999;
	ex = false
	setup();
	EZ.test.run(x, y, showDiff)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'x & y diff Arrays with diff indexes'
	x = array
	y = [0];
	ex = false
	setup();
	EZ.test.run(x, y, showDiff)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'x & y diff Arrays with named key of extra with same value'
	x = array.slice()
	x.extra = 'xyz'
	y = array.slice()
	y.extra = 'xyz'
	setup();
	EZ.test.run(x, y, showDiff)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'x & y diff Arrays with named key of extra with diff value'
	x = array.slice()
	x.extra = 'abc'
	y = array.slice()
	y.extra = 'xyz'
	ex = false
	setup();
	EZ.test.run(x, y, showDiff)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'x & y save Array values -- x.extra="abc" y does not have extra'
	x = array.slice()
	x.extra = 'abc'
	y = array.slice()
	ex = false
	setup();
	EZ.test.run(x, y, showDiff)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'x & y save Array values -- x does not have extra y.extra="xyz"'
	x = array.slice()
	y = array.slice()
	y.extra = 'xyz'
	ex = false
	setup();
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
	setup();
	EZ.test.run(x, y, showDiff)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'diff obj -- same single key -- but x.obj / y.obj not same type'
	x = { obj: obj }
	y = { obj: [1, 2] }
	ex = false
	setup();
	EZ.test.run(x, y, showDiff)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'diff obj -- same single key -- x.obj is boolean,  y.obj is obj'
	x = { obj: obj }
	y = { obj: true }
	ex = false
	setup();
	EZ.test.run(x, y, showDiff)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'diff obj -- same single key -- x.obj is obj,  y.obj is boolean'
	x = { obj: false }
	y = { obj: obj }
	ex = false
	setup();
	EZ.test.run(x, y, showDiff)

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'diff obj -- same single key & values --but  x.obj is ArrayLike,  y.obj is Array'
	x = { obj: obj }
	y = { obj: [1, 2] }
	ex = false
	setup();
	EZ.test.run(x, y, showDiff)
	
	note = 'formattedLog incorrect'
	ex = false
	setup();
	EZ.test.run([1, undefined], [1, null], showDiff)


	//__________________________________________________________________________________________________
	EZ.test.settings( {group: 'tests from stackoverflow base code', exfn:exfn} )

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
	note = x+'\n'+y
	setup();
	EZ.test.run(new Date(x), new Date(y), showDiff)

	x = "03/14/2016 1:00:01 pm EST";
	y = "03/14/2016 06:00 pm GMT";
	note = x+'\n'+y
	ex = false
	setup();
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
	EZ.test.settings( {group: 'from comments on stackoverflow post'} );

	EZ.test.run([1, 2, undefined], [1, 2], 			true, {EZ:{ ex:false }});
	EZ.test.run([1, 2, 3], { 0: 1, 1: 2, 2: 3 }, 	true, {EZ:{ ex:false }});
	EZ.test.run(new Date(1234), 1234, 				true, {EZ:{ ex:false }});

	var func = function() { return true; };
	var funcSame = function() { return true; };
	var funcDiff = function() { return false; };

	note = 'FAILS as of 11-23-2016'.wrap('<em>')
	setup();
	EZ.test.run( {x: func, y: func }, 		{showDiff:true, strict:'Function'});
	
	note = 'FAILS as of 11-23-2016'.wrap('<em>')
	setup();
	EZ.test.run( func, func,		 		{showDiff:true, strict:'Function'});
			 
	note = 'NOT equal with same script when options.strict == "Function"'
	setup(false);
	EZ.test.run( func, funcSame,		 	{showDiff:true, strict:'Function'});
	
	note = 'IS equal with same script when options.strict != "Function"'
	setup();
	EZ.test.run( func, funcSame,		 	{showDiff:true});
	
	note = 'not same script'
	setup(false);
	EZ.test.run( func, funcDiff,		 	{showDiff:true});

	note = 'same script -- same enumerable properties'
	func.aKey = 'same value';
	funcSame.aKey = 'same value'
	setup(true);
	EZ.test.run(func, funcSame, showDiff);

	note = 'same script -- DIFFERENT enumerable properties'
	funcSame.aKey = 'diff value'
	setup(false);
	EZ.test.run(func, funcSame, showDiff);


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
	ex = false
	setup();
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
	ex = false
	setup();
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
	ex = false
	setup();
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
	setup();
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
	ex = false
	setup();
	EZ.test.run(obj, o)
	

	//______________________________________________________________________________
	EZ.test.settings( {group: 'live faults:'} );
	
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
	setup();
	EZ.test.run( x,y )

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'invalid dates should be equal'
	setup();
	EZ.test.run(new Date(''), new Date(''))

	x = {children:true, objects:Object, functions:false, maxdepth:4};
	y = EZ.cloneDev.object(x)
	setup();
	EZ.test.run(x, y)
}

