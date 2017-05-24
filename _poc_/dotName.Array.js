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
	var defaultOptions = function()
	{
		return {
			quote: ''
		}
	}
	//var ctx;
	var dotName;
	/**_________________________________________________________________________________________________
	 *
	 *__________________________________________________________________________________________________
	**/
	var ___ = function EZdotName(key, q)
	{
		if (this instanceof arguments.callee)
		{
			if (!CLASS.$) return this;				//called by _init()	when script loads
			return _init.call(this,key,q);
		}
		return key;
	}
	//__________________________________________________________________________________________________
	/**
	 *	creates global Object (pseudo static) -- valid constructor or can call a default function. 
	 */
	var _init = function _init(globals, q)
	{												
		if (!CLASS)
		{
			CLASS = ___;								
			CLASS.options = options = defaultOptions(); 			
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
			var key = globals;
			if (key instanceof CLASS)
				dotName = key.slice();
			else
				dotName = [key];
			
			dotName.quote = q || CLASS.options.quote;
			
			for (var fn in CLASS)						//bind CLASS functions to new Object			
			{											//created for each specific instances
				if (typeof(CLASS[fn]) != 'function') 
					continue;
														//bind CLASS functions
														//...perhaps the should be cloned ??
				dotName[fn] = CLASS[fn].bind(dotName);
			//	for (var key in CLASS[fn])				//...and copy any missing properties
			//		if ( !(key in dotName[fn]) ) 			//...including functions but not bound
			//			dotName[fn][key] = CLASS[fn][key]; 	//...not sure abt non-functions
				
			}
			//dotName._globals_ = globals;
		}
		else if (globals instanceof CLASS)
		{
			CLASS._dotName_ = dotName;
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
		return CLASS._dotName_ = dotName;
 	}
	//______________________________________________________________________________________________
	/**
	 *
	**/
	___.prototype.toString = function(key, q)
	{
		if (!CLASS || !dotName)
			return 'no ' + CLASS.name + ' Object created'
		
		//if (dotName[0] == '$') return false;
		var value = (!key) ? dotName 
				  : dotName.concat( _format(key, q) )
		
		return value.join('');
	}
	/**
	 *
	**/
	___.push = function(key)
	{
		var dotName = ___(this);
		void(key);
		//[].push.call(dotName, _format(key));
		
		[].forEach.call(arguments, function(key)
		{
			[].push.call(dotName, _format(key));
		});
		
		return dotName.toString();
	}
	/**
	 *
	**/
	___.prototype.format = function ___format(key, q)
	{
		var dotName = ___(this);
		[dotName]
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
debugger;	
	return _init();									//create and return global "static" Object
})();
var dotName;
function setup()
{
	dotName = new EZ.dotName('[mru] EZ.dataFile')
	console.log(dotName.push(0,'a',1))
dot.innerHTML = dotName+'';
	
	//debugger;
	void(0)
}
void(setup)
//EZ.test.someObject.fn();


