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
	var options, CLASS;
	var defaultOptions = function(q)
	{
		return {
			quote: q || ''
		}
	}
	//var ctx;
	var dotName;
	/**_________________________________________________________________________________________________
	 *
	 d = new dotName(key)
	 *__________________________________________________________________________________________________
	**/
	var ___ = function EZdotName(key, q)
	{
		if (this instanceof arguments.callee)
		{
			if (!CLASS.$) return this;				//called by _init()	when script loads
			_init.call(this);
			
			this.options.quote = q || this.options.quote;
			
			if (key instanceof CLASS)
			{
				dotName = this.dotName = CLASS._dotName = key.dotName.slice();
			}
			else
				dotName = this.dotName = CLASS._dotName = [key];
			return this;
			//return _init.call(this,key,q);
		}
		return _init(this);
	}
	//__________________________________________________________________________________________________
	/**
	 *	creates global Object (pseudo static) -- valid constructor or can call a default function. 
	 */
	var _init = function _init(ctx)
	{												
		if (!CLASS)
		{
			CLASS = ___;								
			CLASS.options = CLASS.___options = options = defaultOptions(); 			
			var fn = CLASS.$ = new ___();				
			for (var p in fn) ___[p] = fn[p];		
			
			CLASS.$ = fn; 			
			/*
			EZ.event.add(window, 'onload', function()	//initialization requiring DOM 
			{											
			});	
			*/
			//===============
			return CLASS;								//return initialized static global CLASS
			//===============
		}
		if (this instanceof CLASS)						//new
		{
//			var args = [].slice.call(arguments);
			this.options = options = defaultOptions();
			this._options = CLASS._options = options;
			
			for (var fn in CLASS)						//bind CLASS functions to new Object			
			{											//created for each specific instances
				if (typeof(CLASS[fn]) != 'function') 
					continue;
														//bind CLASS functions
														//...perhaps the should be cloned ??
				this[fn] = CLASS[fn].bind(this);
			//	for (var key in CLASS[fn])				//...and copy any missing properties
			//		if ( !(key in this[fn]) ) 			//...including functions but not bound
			//			this[fn][key] = CLASS[fn][key]; 	//...not sure abt non-functions
				
			}
			//this._globals_ = globals;
			//CLASS._dotName = this;
			//CLASS._dotName = this;
			return this;
		}
		else if (ctx instanceof CLASS)
		{
			dotName = CLASS._dotName = ctx.dotName;
			options = CLASS._options = ctx.options;
			return ctx;
			/*
			CLASS._data_ = dotName._data_;
			CLASS._options_ = data.options;
			CLASS._globals_ = dotName._globals_;
			if (dotName._globals_ instanceof Array)
			dotName._globals_.forEach(function(g)
			{
				void(g)
			});
			*/
		}
 	}
	//______________________________________________________________________________________________
	/**
	 *
		//if (dotName[0] == '$') return false;
	**/
	___.prototype.toString = function(key, q)
	{
		if (!CLASS || !dotName)
			return 'no ' + CLASS.name + ' Object created'
		
		var value = dotName;
		if (this instanceof CLASS)
		{
			value = (!key) ? this.dotName 
				  : this.dotName.concat( _format(key, q) )
		}
		return value.join('');
	}
	/**
	 *
	**/
	___.push = function(key)
	{
		___(this);
		void(key);
		
		[].forEach.call(arguments, function(key)
		{
			dotName.push(_format(key));
		});
		
		return this.toString();
	}
	/**
	 *
	**/
	___.concat = function(keys, q)
	{
		___(this);
		var clone = new EZ.dotName(this, q)
		//EZ.toArray(keys).forEach(function(key)
		keys.forEach(function(key)
		{
			clone.dotName.push(_format(key));
		});
		return clone;
	}
	/**
	 *
	**/
	___.prototype.format = function ___format(key, q)
	{
		return _format(key, q);
	}
	function _format(key, q)
	{
		q = q || dotName.quote || CLASS.options.quote;
		var fmt = (!isNaN(key)) 				  ? '[' + key + ']'
				: (/^[A-Z_$][\w_$]*$/i.test(key)) ? '.' + key
				: key.wrap("["+q, q + "]");
		return fmt;
	}
	[_format]
	//==================================================================================================
//debugger;	
	return _init();									//create and return global "static" Object
})();

/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
var dotName, clone;
function setup()
{
	dotName = new EZ.dotName('[mru] EZ.dataFile')
	console.log(dotName.push(0,'a',1))
	clone = dotName.concat(['baby'])
document.getElementById('dot').innerHTML = dotName+'';
	
	//debugger;
	void(0)
}
void(setup)
//EZ.test.someObject.fn();


