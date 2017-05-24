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
EZ.dotName = (function _____EZcustomObject_____()						
{								
	var options, CLASS, data;
	var defaultOptions = function()
	{
		return {
			quote: ''
		}
	}
	var dotName, quote;
	/**_________________________________________________________________________________________________
	 *
	 *__________________________________________________________________________________________________
	**/
	var ___ = function EZdotName(baseKey, q)
	{
		if (!CLASS.$) return this;				//called by _init()	when script loads
		if (this instanceof arguments.callee)
		{
			data = this._data_ = {};
			dotName = data.dotName = [baseKey + '' || '$'];
			quote = data.quote = (q)	// || CLASS.options.quote);
			
			_init.call(this, 'dotName, quote');		//add functions and save list of global variables
		}
		else return _init(baseKey);					//restore globals if 1st arg is instanceof CLASS
	}
	//______________________________________________________________________________________________
	/**
	 *
	**/
	___.prototype.toString = function(key, q)
	{
		if (!dotName)
			return 'no ' + CLASS.name + ' Object created'
		
		if (dotName[0] == '$') return false;
		var value = (!key) ? dotName 
				  : dotName.concat( _format(key, q) )
		
		return value.join('');
	}
	/**
	 *
	**/
	___.add = function(SETUP, key, q)
	{
		if (SETUP = ___(SETUP)) return SETUP;
		
		dotName.push( _format(key, q) );
		return dotName.toString();
	}
	/**
	 *
	**/
	___.prototype.get = function(key, q)
	{
		return dotName.toString(key, q);
	}
	/**
	 *
	**/
	___.prototype.clone = function(key, q)
	{
		var dotName = new EZ.dotName(dotName, q || quote)
		if (key)
			dotName.push( this.format(key, q) );
		return dotName;
	}
	/**
	 *
	**/
	___.format = function ___format(key, q)
	{
		return _format(key, q);
	}
	function _format(key, q)
	{
		q = q || quote;
		return (!isNaN(key)) 				  ? '[' + key + ']'
			 : (/^[A-Z_$][\w_$]*$/i.test(key)) ? '.' + key
			 : key.wrap("["+q, q + "]");
	}
	//__________________________________________________________________________________________________
	/**
	 *	creates global Object (pseudo static) -- valid constructor or can call a default function. 
	 */
	var _init = function _init(globals)
	{												
		if (!CLASS)
		{
			CLASS = ___;								//set after constructor 1st called
			CLASS.options = defaultOptions(); 				//create default CLASS options
			var fn = CLASS.$ = new ___();							//copy prototype functions to CLASS
			for (var key in fn) ___[key] = fn[key];		//...and other instance properties if any
			
			CLASS.$ = fn; 			
			
			CLASS.options = options;
			/*
			EZ.event.add(window, 'onload', function()	//initialization requiring DOM 
			{											
			});	
			*/
			//===============
			return CLASS;								//return initialized static global CLASS
			//===============
		}
		var ctx = this;
		if (ctx instanceof CLASS)
		{
			for (var fn in CLASS)						//bind CLASS functions to new Object			
			{											//created for each specific instances
				if (ctx[fn] || typeof(CLASS[fn]) != 'function') 
					continue;
														//bind CLASS functions
														//...perhaps the should be cloned ??
				ctx[fn] = CLASS[fn].bind(CLASS, ctx);
				for (var key in CLASS[fn])				//...and copy any missing properties
					if ( !(key in ctx[fn]) ) 				//...including functions but not bound
						ctx[fn][key] = CLASS[fn][key]; 	//...not sure abt non-functions
				
			}
			ctx._globals_ = globals;
			return ctx;
		}
		else if (globals instanceof CLASS)
		{
			CLASS._ctx_ = ctx;
			CLASS._data_ = ctx._data_;
			CLASS._options_ = data.options;
			CLASS._globals_ = ctx._globals_;
			if (ctx._globals_ instanceof Array)
			ctx._globals_.forEach(function(g)
			{
				void(g)
			});
		}
 	}
	//==================================================================================================
//debugger;	
	return _init();									//create and return global "static" Object
})();
var dotName;
function setup()
{
	dotName = new EZ.dotName('')
	//debugger;
void(0)
}
void(setup)
//EZ.test.someObject.fn();


