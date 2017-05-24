/*-----------------------------------------------------------------------------
 *	return true if x and y are same typeof and equal
-----------------------------------------------------------------------------*/
function isEqual(x, y)
{
	if (x != null && y != null && typeof x != typeof y)
		return false;	//null and undefined compared by isEqualObjects()

	return 'object function'.indexOf(typeof x) != -1
		 ? isEqualObjects(x, y)
		 : x === y;
	//___________________________________________________________________________
	/**
	 *	http://stackoverflow.com/questions/201183/how-to-determine-equality-for-two-javascript-objects/16788517#16788517
	 */
	function isEqualObjects(x, y)
	{
		if (x === null || x === undefined || y === null || y === undefined)
			return x === y; 				//not both null or undefined

		if (x.constructor !== y.constructor)
			return false;

		// if they are functions, they should exactly refer to same one (because of closures)
		// EZ -- NO -- may be pseudo Objects
		if (x instanceof Function)
		{
			if (isEqualObjects(EZ.getFunctionParts(x) != EZ.getFunctionParts(y)))
				return false;
			//return x === y;
		}

		// if they are regexps, they should exactly refer to same one
		// (it is hard to better equality check on current ES)
		// NO -- check properties -- except lastIndex
		if (x instanceof RegExp)
		{
			return x.global == y.global && x.ignoreCase == y.ignoreCase
				&& x.multiline == y.multiline && x.source == y.source;
			//return x === y;
		}

		if (x === y || x.valueOf() === y.valueOf())
			return true;						//both same object

		if (EZ.isArray(x) && x.length !== y.length)
			return false;

		//TODO: ??
		if (x instanceof Date)
			return x.getTime() == y.getTime();
			return false;						//different dates

		// done before calling but need for recursion
		// if they are strictly equal, they both need to be object at least
		if (!(x instanceof Object) || !(y instanceof Object))
			return false;

		//--------------------------------
		// recursive object equality check
		//--------------------------------
		var p = Object.keys(x);
		return Object.keys(y).every(function (i)
		{
			return p.indexOf(i) !== -1;
		})
		&& p.every(function (i)
		{
			return isEqualObjects(x[i], y[i]);
		});
	}
}
function objectEqualsTest(x, y)
{
	///////////////////////////////////////////////////////////////
	/// The borrowed tests, run them by clicking "Run code snippet"
	///////////////////////////////////////////////////////////////
	var printResult = function (x) {
		if (x) { document.write('<div style="color: green;">Passed</div>'); }
		else { document.write('<div style="color: red;">Failed</div>'); }
	};
	var assert =
	{
		isTrue: function (x)
		{
			printResult(x);
		},
		isFalse: function (x)
		{
			printResult(!x);
		}
	}
	assert.isTrue(objectEquals(null,null));
	assert.isFalse(objectEquals(null,undefined));
	assert.isFalse(objectEquals(/abc/, /abc/));
	assert.isFalse(objectEquals(/abc/, /123/));
	var r = /abc/;
	assert.isTrue(objectEquals(r, r));

	assert.isTrue(objectEquals("hi","hi"));
	assert.isTrue(objectEquals(5,5));
	assert.isFalse(objectEquals(5,10));

	assert.isTrue(objectEquals([],[]));
	assert.isTrue(objectEquals([1,2],[1,2]));
	assert.isFalse(objectEquals([1,2],[2,1]));
	assert.isFalse(objectEquals([1,2],[1,2,3]));

	assert.isTrue(objectEquals({},{}));
	assert.isTrue(objectEquals({a:1,b:2},{a:1,b:2}));
	assert.isTrue(objectEquals({a:1,b:2},{b:2,a:1}));
	assert.isFalse(objectEquals({a:1,b:2},{a:1,b:3}));

	assert.isTrue(objectEquals({1:{name:"mhc",age:28}, 2:{name:"arb",age:26}},{1:{name:"mhc",age:28}, 2:{name:"arb",age:26}}));
	assert.isFalse(objectEquals({1:{name:"mhc",age:28}, 2:{name:"arb",age:26}},{1:{name:"mhc",age:28}, 2:{name:"arb",age:27}}));

	Object.prototype.equals = function (obj)
	{
		return objectEquals(this, obj);
	};
	var assertFalse = assert.isFalse,
		assertTrue = assert.isTrue;

	assertFalse({}.equals(null));
	assertFalse({}.equals(undefined));

	assertTrue("hi".equals("hi"));
	assertTrue(new Number(5).equals(5));
	assertFalse(new Number(5).equals(10));
	assertFalse(new Number(1).equals("1"));

	assertTrue([].equals([]));
	assertTrue([1,2].equals([1,2]));
	assertFalse([1,2].equals([2,1]));
	assertFalse([1,2].equals([1,2,3]));
	assertTrue(new Date("2011-03-31").equals(new Date("2011-03-31")));
	assertFalse(new Date("2011-03-31").equals(new Date("1970-01-01")));

	assertTrue({}.equals({}));
	assertTrue({a:1,b:2}.equals({a:1,b:2}));
	assertTrue({a:1,b:2}.equals({b:2,a:1}));
	assertFalse({a:1,b:2}.equals({a:1,b:3}));

	assertTrue({1:{name:"mhc",age:28}, 2:{name:"arb",age:26}}.equals({1:{name:"mhc",age:28}, 2:{name:"arb",age:26}}));
	assertFalse({1:{name:"mhc",age:28}, 2:{name:"arb",age:26}}.equals({1:{name:"mhc",age:28}, 2:{name:"arb",age:27}}));

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

	assertTrue(a.equals(b));
	assertFalse(a.equals(c));
	assertFalse(c.equals(d));
	assertFalse(a.equals(e));
	assertTrue(i.equals(j));
	assertFalse(d.equals(k));
	assertFalse(k.equals(l));

	// from comments on stackoverflow post
	assert.isFalse(objectEquals([1, 2, undefined], [1, 2]));
	assert.isFalse(objectEquals([1, 2, 3], { 0: 1, 1: 2, 2: 3 }));
	assert.isFalse(objectEquals(new Date(1234), 1234));

	// no two different function is equal really, they capture their context variables
	// so even if they have same toString(), they won't have same functionality
	var func = function (x) { return true; };
	var func2 = function (x) { return true; };
	assert.isTrue(objectEquals(func, func));
	assert.isFalse(objectEquals(func, func2));
	assert.isTrue(objectEquals({ a: { b: func } }, { a: { b: func } }));
	assert.isFalse(objectEquals({ a: { b: func } }, { a: { b: func2 } }));
}
