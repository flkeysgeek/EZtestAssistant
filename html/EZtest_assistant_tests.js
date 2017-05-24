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
EZ test assistant unit testing -- for proper ok and error notes
--------------------------------------------------------------------------------------------------*/
/*TODO: redo w/o defining Array Prototype
Array.prototype.testAssistant = function testAssistant(array, obj)
{
	var rtnValues = Array.prototype.testAssistant.rtnValues || {};

	var thisArray = this;
	if ('ctx' in rtnValues)
		Object.keys(rtnValues.ctx).forEach(function(key)
		{
			thisArray[key] = rtnValues.ctx[key];
		});

	if ('arr' in rtnValues)
		Object.keys(rtnValues.arr).forEach(function(key)
		{
			array[key] = rtnValues.arr[key];
		});

	if ('obj' in rtnValues)
		Object.keys(rtnValues.obj).forEach(function(key)
		{
			obj[key] = rtnValues.obj[key];
		});

	if ('ex' in rtnValues)
		return rtnValues.ex[0] === undefined ? undefined : rtnValues.ex;
}

//__________________________________________________________________________________
Array.prototype.testAssistant.test = function()
{
	var obj=null,
		ctx = 'na', exfn = null, notefn = null, note = '';
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	//
	//	Define test options (including note) and rtnValues used by test function.
	//
	//	Closure scope variables (e.g. ctx, ex note) passed via options Object.
	//
	function testSetup(actions, options)
	{
		if (!EZ.test.isRun()) return;		//this test skipped

		var rtnValues = {};
		var opts = {notefn:notefn, exfn:exfn};
		opts.note = 'test options: ' + (actions || 'none');
		opts.note += options.note ? '\n' + options.note : '';

		'ctx arr obj ex'.split(' ').forEach(function(key)
		{
			if (actions.includes(key))
			{
				//expected is always "xyz"
				//   ex omitted returns correct value but expected not specified
				//	 ex returns correct value: "xyz"
				//	-ex returns wrong value: "abc"
				//	+ex returns wrong type: true
				//	*ex returns undefined
				var rtnVal = actions.includes('-' + key) ? 'abc'
						   : actions.includes('+' + key) ? true
						   : actions.includes('*' + key) ? undefined
						   : "xyz";
				//var msg = 'returns';
				switch (key)
				{
					case 'ctx':
						//msg = '"this"';
						opts.ctx = EZ.clone(options.ctx)
						opts.ctx[0] = 'xyz';
						rtnValues.ctx = {0:rtnVal};
						break;
					case 'arr':			//1st argument
						//msg = '"array"';
						opts.args = opts.args || [];
						opts.args[0] = EZ.clone(options.arr)	//expected
						opts.args[0][0] = 'xyz';
						rtnValues.arr = {0:rtnVal};				//change 1st el of array
						break;

					case 'obj':			//2nd argument
						//msg = '"obj"';
						opts.args = opts.args || [];
						opts.args[1] = EZ.clone(options.obj)
						opts.args[1].a = 'xyz';
						rtnValues.obj = {a:rtnVal};
						//opts[key] = ['xyz'];
break;	//??

					case 'ex':
						opts.ex = EZ.clone(options.arr)
						opts.ex[0] = 'xyz';
						rtnValues.ex = options.arr.slice();
						rtnValues.ex[0] = rtnVal;
						break;
					default:
						debugger;
				}
			}
		});
		EZ.test.options(opts);
		Array.prototype.testAssistant.rtnValues = rtnValues;
	}
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	var settings = {
		noteHeading: 'EZ Test Assistant Testing - BG colors >>',
		noteHelpTitle: "BG color is Assistant Display Pass/Fail NOT test results",
		noteHelpHTML: 'defined in initial popup html'
	}
	settings.noteHelpHTML = EZ.test.config.assistant.noteHelpHTML;
	EZ.test.settings(settings);

	var rtn, arr, obj;
	ctx = ['abc'];
	arr = [1,2,3];
	obj = {a:1, b:2};


	  //-------------------------------------------------------------\\
	 //----- use testSetup() to define rtnValues, note, expected------\\
	//-----------------------------------------------------------------\\

	//______________________________________________________________________________
	note = 'this omitted'

	rtn = testSetup('', {ctx:ctx, arr:arr, obj:obj, note:note});
	EZ.test.run();

	rtn = testSetup('ctx arr obj ex', {ctx:ctx, arr:arr, obj:obj, note:note});
	EZ.test.run();

	rtn = testSetup('-ctx -arr -obj -ex', {ctx:ctx, arr:arr, obj:obj, note:note});
	EZ.test.run();
//return;

	note = 'this wrong type String'
	rtn = testSetup('', {ctx:ctx, arr:arr, obj:obj, note:note});
	EZ.test.run('str');

	note = 'this undefined'
	rtn = testSetup('', {ctx:ctx, arr:arr, obj:obj, note:note});
	EZ.test.run(undefined);

	note = 'extra arguments -- returns "xyz" as expected'
	rtn = testSetup('ex', {ctx:ctx, arr:arr, obj:obj, note:note});
	EZ.test.run([], arr, obj, '123', {z:99});

	//______________________________________________________________________________
	note = 'returns undefined -- expected results NOT specified \n no change to ctx or args'
	rtn = testSetup('', {ctx:ctx, arr:arr, obj:obj, note:note});
	EZ.test.run(ctx, arr, obj);

	note = 'returns "xyz" as expected \n no change to ctx or args'
	//EZ.test.options({ex:'xyz', note:note});
	//EZ.test.run(ctx, {ex:'xyz'}, arr, obj);
	rtn = testSetup('ex', {ctx:ctx, arr:arr, obj:obj, note:note});
	EZ.test.run(ctx, arr, obj);

	note = 'returns "abc" but "xyz" expected \n no change to ctx or args'
	rtn = testSetup('-ex', {ctx:ctx, arr:arr, obj:obj, note:note});
	EZ.test.run(ctx, arr, obj);
//return;

	note = 'returns true but "xyz" expected \n no change to ctx or args'
	rtn = testSetup('+ex', {ctx:ctx, arr:arr, obj:obj, note:note});
	EZ.test.run(ctx, arr, obj);

	note = 'returns undefined but "xyz" expected \n no change to ctx or args'
	rtn = testSetup('*ex', {ctx:ctx, arr:arr, obj:obj, note:note});
	EZ.test.run(ctx, arr, obj);

	//______________________________________________________________________________
	note = 'ctx variants (all others valid)'

	rtn = testSetup('ctx ex', {ctx:ctx, arr:arr, obj:obj, note:note});
	EZ.test.run(ctx, arr, obj);

	rtn = testSetup('-ctx ex', {ctx:ctx, arr:arr, obj:obj, note:note});
	EZ.test.run(ctx, arr, obj);

	rtn = testSetup('+ctx ex', {ctx:ctx, arr:arr, obj:obj, note:note});
	EZ.test.run(ctx, arr, obj);

	rtn = testSetup('*ctx ex', {ctx:ctx, arr:arr, obj:obj, note:note});
	EZ.test.run(ctx, arr, obj);

	//______________________________________________________________________________
	note = 'arr variants (all others valid)'

	rtn = testSetup('arr ex', {ctx:ctx, arr:arr, obj:obj, note:note});
	EZ.test.run(ctx, arr, obj);

	rtn = testSetup('-arr ex', {ctx:ctx, arr:arr, obj:obj, note:note});
	EZ.test.run(ctx, arr, obj);

	rtn = testSetup('+arr ex', {ctx:ctx, arr:arr, obj:obj, note:note});
	EZ.test.run(ctx, arr, obj);

	rtn = testSetup('*arr ex', {ctx:ctx, arr:arr, obj:obj, note:note});
	EZ.test.run(ctx, arr, obj);

	//______________________________________________________________________________
	note = 'mixed variants'

	testSetup('ctx arr obj ex', {ctx:ctx, arr:arr, obj:obj, note:note});
	EZ.test.run(ctx, arr, obj);

	rtn = testSetup('-ctx -arr -obj -ex', {ctx:ctx, arr:arr, obj:obj, note:note});
	EZ.test.run(ctx, arr, obj);

	note = 'returns unexcepted for everything'
	rtn = testSetup('+ctx +arr +obj +ex', {ctx:ctx, arr:arr, obj:obj, note:note});
	EZ.test.run(ctx, arr, obj);

	rtn = testSetup('*ctx *arr *obj *ex', {ctx:ctx, arr:arr, obj:obj, note:note});
	EZ.test.run(ctx, arr, obj);
}
*/
/*----------------------------------------------------------------------------------
non-prototype EZ test assistant - sample test
----------------------------------------------------------------------------------*/
EZ.sample = function EZsample(number,times)
{
	times = times || 2;
	var rtn = (number || 0) * times;

	//EZ.displayMessage('EZsample: arg=[' + arg + '] returning: ['+rtn+']');
	var myfn = function()
	{
		if (EZ.capture.check(this)) {return EZ.capture()} else if (EZ.test.debug()) debugger;

		var callerName = EZ.capture.getFunctionName();
		return callerName;
	}

	if (number == 'myfn')
		rtn = myfn();

	else if (number == 'myName')
		rtn = EZ.capture.getFunctionName();

	return rtn;
}

//_____________________________________________________________________________________________
EZ.sample.test = function()
{
	var three = 3;
	var lastarg;

	EZ.test.run('myfn')
	EZ.test.run('myName')

	EZ.test.run( 			{EZ: {ex:0	}})
	EZ.test.run(2,			{EZ: {ex:4	}})
	EZ.test.run(2,3,		{EZ: {ex:5, note:'test of not expected'	}})
	EZ.test.run(2,three,	{EZ: {ex:6	}})
	EZ.test.run(2,4,' ')
	EZ.test.run('1,2', [3,4], {a:[5,'a, b']}, lastarg, {EZ: {ex:NaN }});
}
/*---------------------------------------------------------------------------------------------
EZ.equals.setOption(optionValues)

Set one or more options to new values specified as key / value pairs.

ARGUMENTS:
	optionValues	object containing key / values to set -- required for date instance
					if not supplied, all options (except formats) set to default values.
					use setFormats() to change formats
RETURNS:
	Object containing all options after new values set.
---------------------------------------------------------------------------------------------*/
EZ.equals.setOptions = function EZdate_setOptions(optionValues)
{
	if (!EZ.equals.options) EZ.equals();

	var options = EZ.equals.options = (EZ.equals.options || EZ.defaultOptions.equals);

	if (typeof(optionValues) == 'object')
	{
		Object.keys(optionValues).forEach(function(key)
		{
			options[key] = optionValues[key];
		});
	}
	return options;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
EZ.set.test = function EZset_test()
{
	return;
	//var ex, obj, note;
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	//gets error if radio button does not have label tag
}

