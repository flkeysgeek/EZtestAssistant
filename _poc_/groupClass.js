/*--------------------------------------------------------------------------------------------------
Dreamweaver LINT global references and definitions  not used here
--------------------------------------------------------------------------------------------------*/
/*global 
EZ:true, DWfile:true, 

e:true, g:true, dw:true, f:true
*/
var e;			//global var for try/catch
(function() {[	//global variables and functions defined but not used
DWfile,

e, f, g, dw]});
//. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 
if (!window.DWfile) DWfile = {};
if (!window.EZ)
{
	EZ = function EZ$() 
	{	
	}
	EZ.test = function() {};
	EZ.sync = function() {};
	EZ.oops = function(msg)
	{
		console.log(msg)
	}
	EZ.options = function(options) {return options || {};};
}

//________________________________________________________________________________________________

/*--------------------------------------------------------------------------------------------------
EZ.someObject(o, options)
String.formatStack(options)

whats up...

ARGUMENTS:
	String		...
	options		(optional) Object containing one or more of the following properties:
				skipCount	number of function to remove from top of stack
	...			blah blah
			Array or delimited string (values separated by commas or spaces)


RETURNS:
	true if ... otherwise ...

REFEERENCE:
TODO:
--------------------------------------------------------------------------------------------------*/
EZ.test.someObject = (function _____EZcustomObject_____()						//01-14-2017
{										//following global variables availible to all internal
	var msg;							//and Object functions since the are all closures.
	var options, data;	 				//options initialzed by _init() and constructor
	var topContext;						//_init() sets to ___ after calling constructor
	var work = {};
	var instanceMap = {};
	
	var defaultOptions = function()
	{
		return {
			sample1: '',
			sample2: [],
			tags: {
			},
			defaults: {									
				_: {						//"_" defines "this._" key/value(s) populated by _init()
					key: 'value'
				},										
				String:'', 
				Element:'',
				optionGroups: {				
					basic: {				
						all: 'sample1, sample2'
					}
				}
			},
			formatter: 'EZtoString',
			formatOptions: { 
				tostring: {timestamp: false},
				stringify:{spaces:4} 
			},
			name: 'EZ.someObject.defaultOptions',
			version: '01-20-2017',
		}
	}
	var defaultData = function()
	{
		return {
			tags: {},
			timestamp: '',
			version: '01-20-2017',
		}
	}
	/**_________________________________________________________________________________________________
	 *
	 *	return existing or new Object for managed dataFile identified by specified unique key.
	 *	
	 *	ARGUMENTS:		
	 *		key			unique key associated with managed dataFile
	 *		options		see defaultOptions above
	 *					
	 *	RETURNS:
	 *		new or existing SOME Object for specified key
	 *__________________________________________________________________________________________________
	**/
	var ___ = function EZsomeObject(key, someOpts)			
	{
		if (topContext === undefined) return this;	//called by _init()												
		//return ___;
		//===============================================================================================
		// check for existing EZtest_dataFile Object
		//===============================================================================================
		if (!key) return undefined;					//key required
		
		var SOME = (key instanceof ___) ? key	//set SOME to existing Object
				 	: instanceMap[key += '']
		if (SOME)									//if existing Object...
		{											//reset topContext Object specific global
			msg = '';
			data = topContext.__data__ = SOME.data;						
			options = topContext.__options__ = data.options;				
			topContext.__key__ = key;	
			return SOME;				
		}
		//===============================================================================================
		// create and setup new Object EZtest_dataFile using specified key and someOpts
		//===============================================================================================
		if (this instanceof arguments.callee)		//if called as constructor, carry on
		{
			SOME = instanceMap[key] = this;		//save dataFile Object and carry on
			
			for (var fn in topContext)				//bind Object functions	to new Object			
			{										//prototype functions added by default
				if (!SOME[fn] && typeof(topContext[fn]) == 'function')
					SOME[fn] = topContext[fn].bind(topContext)
			}
		}
		else if (!someOpts) 						//if no options, return null -- probably...
			return null;							//...if ((SOME = ___(SOME)) == null) return;
		else										
			return new ___(key, someOpts);			//if NOT called as constructor, make is so	

		data = SOME.data = defaultData(key);		//initialize data and options
		options = data.options = EZ.options.call(someOpts);
		___(SOME);									//reset topContext closure variables
		
		data.tags.noSaveEl = options.noSaveId && EZ(options.noSaveId, null);

		//==========================
		return SOME;
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	___.prototype.toString = function()
	{
		return false;
	}
	//__________________________________________________________________________________________________
	/**
	 *	Internal support function 
	 */
	var _getEl = function(tag)
	{
		if (!tag) return '';
			
		var el = EZ(tag);
		if (el.undefined)
			return '';
			
		return el;
	}
	[_getEl]
	//__________________________________________________________________________________________________
	/**
	 *	Internal function 
	 */
	function _getTag(name)
	{
		var tag = EZ.someObject.options.tags[name];
		if (!tag) return;
		
		return EZ(tag, null);
	}
	void(_getTag);			//avoid DW lint error until used

	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	___.fn = function()
	{
		void(___);
		_support()
		return [1,2,3]
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	___.resume = function()
	{
		//debugger;
		void(0);
		this.fn()
		console.log({'this': this, 'arguments':arguments})
	}
	function _support()
	{
		var v=1;
		return setTimeout(function() 
		{
			debugger;
			_inside(arguments)
		}, 0);
		function _inside()
		{
			console.log({'this': this, 'arguments':arguments},v)
		}
		void(0);
	}
	//__________________________________________________________________________________________________
	/**
	 *	
	 */
	___.pause = function()
	{
		debugger;
		return setTimeout(function() 
		{
			debugger;
			___.resume(this, arguments)
			pause_inside(arguments)
		}, 0);
		function pause_inside()
		{
			console.log({'this': this, 'arguments':arguments})
		}
	}
	//__________________________________________________________________________________________________
	/**
	 *	creates topContext Object (pseudo static) -- valid constructor or can call a default function. 
	 */
	var _init = function _init()
	{												//if Object properties or prototype function
		var fn = new ___();							//create Object -- copy new Object properties
		for (var key in fn) ___[key] = fn[key]		//including prototype functions
			
		topContext = ___;							//initialized after constructor called above
	
	//	for (var key in ___)						//bind other functions to topContext
	//		if (typeof(___[key]) == 'function')	
	//			___[key] = ___[key].bind(___);		
		
		options = defaultOptions(); 				//create default options for topContext
													
		topContext._options = options 			//debugger convenience
		topContext._instanceMap = instanceMap;
		topContext._data = data;
		topContext._work = work;
		/*
		EZ.event.add(window, 'onload', function()	//initialization requiring DOM 
		{											
		});	
		*/
		return topContext;							//return updated topContext
	}
	//==================================================================================================
	return _init();									//create and return global "static" Object
})();
/*--------------------------------------------------------------------------------------------------
Dreamweaver LINT global references and definitions  not used here
--------------------------------------------------------------------------------------------------*/
var SOME;
[SOME]
EZ.sync.getSet = function(obj, dotName)
{
	var bindList = {
		
		get: function _get(key, defaultValue)
		{
			if (key == null || key in this === false) 
				return EZ.oops(this.errmsg(key, 'invalid key')) || defaultValue;
			
			return (key in this && this[key] !== undefined) ? this[key]
															: defaultValue || '000';
		},
		
		set: function _set(key, value)
		{
			//var msg = 'set ' + this.dotName + key + '=' + value + ' -- '; 
			if (key == null || key in this === false) 
				return EZ.oops(this.errmsg(key, 'invalid key')) || value;
			
		//	if (EZ.getType(value) !== EZ.getType(this[key]))
		//		return EZ.oops(msg + 'incorrect type') || this[key];
			
			return this.key = value;
		},
		
		errmsg: function(key, value, msg)
		{
			var msg = dotName.join('.')
					+ arguments.callee.caller.name.substr(1) + '(' + key
					+ (arguments.length > 2 ? '=' + value : '')
					+ ') -- ' + arguments[arguments.length-1]; 
			return msg;
		}
	}
	if (!dotName.endsWith('.'))
		dotName += '.';
	dotName = dotName.split('.');
	for (var fn in bindList)
	{
		if (fn != 'errmsg')
			obj[fn] = bindList[fn].bind(obj)
		else
			obj[fn] = bindList[fn].bind(dotName)
	}
}
function myObj()
{
	this.n = 1;
	this.o = {};
	this.a = [];
}
function setup()
{
	//debugger;
	EZ.my = new myObj()
	EZ.sync.getSet(EZ.my, 'happy.gilbert')
	EZ.my.get('aa');
void(0)
	
	
	//SOME = new EZ.test.someObject('mru', {a:1})
	//debugger;
	//SOME.pause();
	//console.log(SOME);
}
void(setup)
//EZ.test.someObject.fn();


