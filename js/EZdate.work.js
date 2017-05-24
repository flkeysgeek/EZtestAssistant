/*--------------------------------------------------------------------------------------------------
DW lint options -- function below not called
--------------------------------------------------------------------------------------------------*/
/*global EZ, e:true */

var e;
(function jshint_globals_not_used() {e = [e]});	//global variables / functions defined but not used

/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
EZ.options.date = {
	debug: true,
	baseDate: new Date('1/1/1970'),
	dateString: "smart",	//false or blank for native; 
							//"dashes" to only convert dashes in dates to slashs
							//"smart" for dashes and more formats -- see createDate()
							//e.g. 2016-01-12, 2-28, 12-1999

							//default blank to now -- native Date() returns invalid date
	asNow: ["''"],			//typeof(dateString) treated as new Date() i.e. now

	asNull: [undefined],	//"undefined object function false",	
							//typeof(dateString) treated as new Date(null) i.e. baseDate 
							//vs Invalid Date -- both new Date(null) and Invalid Date 
							//are less than any valid date
	
	invalidDate: null,		//"null" to return Invalid Date as null
							//allows if (!date)... vs if (date == false)...
	
	callback: false,		//false ignores EZ.date.prototype..._callback functions
							//planned for RZdate backward compatibility
							//option added as development convenience but left
	override: false,		//prototype can override EZ.date() nested functions -- value??

	formats: null,			//formats added to new EZ.date(...) -- set to defaultFormats
							//1st time EZ.date() called with any arguments
							//use $setFormats() or $removeFormats() to change global or
							//individual date instance values.

	defaultFormats:			
	{					
						//default format 				//12 hr clock with am/pm drops time if 0
		'*': 'mm-dd-yyyy hh:MM:tt.nnn ampm',			//drops seconds and milliseconds if both 0

						//dates -- all formats blank if no date component (i.e. date <= 1/1/1970)
		d:				'd',							//2 digit day of month
		dd:				'dd',							//2 digit day of month
		da:				"da",							//3 char day of week e.g. "Sun"
		day:			"dayName",						//full day of Week e.g. "Sunday"
		daySuffix:		"daySuffix",					//day of month with suffix e.g. 1st, 2nd 9th
		
		m:				'm',							//1 or 2 digit day of month: 1, 2 ... 12
		mm:				'mm',							//2 digit day of month: 01, 02 ... 12
		mo:				"mo",							//3 char month name e.g. "Jan"
		month:			"monthName",					//full month name e.g. "January"
		
		yr:				"yy",							//2 digit year
		yy:				"yy",							//2 digit year
		year:			"yyyy",							//4 digit year
		yyyy:			"yyyy",							//4 digit year
		
		dateBrief:		'mm-dd-yy',						//2 digits for month, day & year
		dateShort:		'mm-dd-yyyy',					//2 digits for month & day; 4 digit year
		dateLong:	 	'day month daySuffix, yyyy',	//full day of week, month name, day of month with suffix 
														//  4 digit year: e.g. Sunday January 3rd, 2016
														//  e.g. Monday January
		dateSmart:		'da mo d, yyyy',				//3 char day of week and month name, 1 or 2 digit day
														//  of month, 4 digit year: e.g. Sun Jan 3, 2016
														//	tip: use substr(4) to omit day of week
						//times
		ampm:			"ampm",							//either "am" or "pm" if date has time part
		AMPM:			"AMPM",							//always "AM" or "PM"
		
		HR:				'HR',							//always 1 or 2 digit hour (24 hour clock): 1 ... 23
		hr:				'h',							//always 1 or 2 digit hour (12 hour clock): 0 ... 12
		min:			'M',							//always 1 or 2 digit seconds: 0 ... 59
		sec:			's',							//always 1 or 2 digit seconds: 0 ... 59
		h:				"h",							//1 or 2 digit hour if > 0 (12 hour clock): 1 ... 12
		hh:				'hh',							//2 digit hour (12 hour clock): 00, 02 ... 12
		H:				"H",							//1 or 2 digit hour if > 0 (24 hour clock): 01 ... 23
		HH:				'HH',							//always 2 digit hour (24 hour clock): 00 ... 23
		M:				"M",							//1 or 2 digit minutes if > 0: 1 ... 59
		MM:				'MM',							//always 2 digit minutes: 0 ... 59
		s:				"s",							//1 or 2 digit seconds if > 0 : 0 ... 59
		ss:				'ss',							//2 digit seconds if > 0 : 1 ... 59
		S:				'S',							//always 1 or 2 digit seconds: 0, 1 ... 59
		SS:				'SS',							//always 2 digit seconds: 00, 01 ... 59
		t:				"t",							//1 or 2 digit seconds if > 0 or millisecond > 0
		tt:				'tt',							//2 digit if seconds if > 0 or millisecond > 0
		nnn:			"nnn",							//3 digit millisecond with "." prexix if > 0 else blank
		NNN:			"NNN",							//always 3 digit millisecond no prexix
		
		noon:			"noon",							//12 hour clock; blank if time part is 0 otherwise 
														// 1 or 2 digit hr, 2 digit minutes, no seconds
														// "noon" if 12:00 else  am or pm suffix 
														// e.g. "1:00 am", "noon" "12:01 pm", "11:59 pm" 
		NOON:			"NOON",	
		midnight:		"midnight",						//same as noon except "midnight" if time part is 0
		MIDNIGHT:		"MIDNIGHT",	
		
		zone:			"zone",							//3 char uppercase time zone: e.g. "EDT"
		zoneFull:		"zoneFull",						//time zone full words: "Eastern Daylight Time"
														//if browser returns full words
		
						//compound times: built from one or more of above time formats
						//	leading and trailing spaces or non-numeric, non-alpha characters TRIMMED after 
						//	all above base formats applied except as noted below.
						//	multiple space or any other non-numeric, non-alpha break characters collapsed
						//	to single occurance except as noted below.
						//
						//EXCEPTIONS:
						//	noon or NOON retain blank or &nbsp; prefix respectivly when timepart is not 0 
						//	midnight OR MIDNIGHT ALWAYS retains blank or &nbsp; prefix
						
		time: 			'H:MM:ss ampm',					//H:MM:ss ampm ??same as long except seconds dropped if 0
		seconds:		"s.nnn",						//e.g. "0", "0.001", "10.100"
		milliseconds:	"s.NNN",						//e.g. "0.000", "1.001", 10.100"
														//does not use noon or midnight
		timeBrief: 		'h:MM ampm',					//1 or 2 digits for hr; seconds always dropped
														//blank if timePart() == 0
														//Noon for 12:00:00; 12 hr clock
		timeFull: 		'HH:MM:ss.nnn',					//always 2 digits for hour; seconds dropped if 0
														//24 hour clock (hours are 00-23)
		timeLong: 		'midnight:SS ampm',				//1 or 2 digits for hr; seconds always displayed
														//Noon for 12:00:00; Midnight for 00:00:00
		timeMini:		'midnight:ss ampm',				//same as long except seconds dropped if 0
														//Noon for 12:00:00; Midnight for 00:00:00
		timeShort: 		'HH:MM:ss',						//always 2 digits for hour; seconds dropped if 0
														//24 hour clock (hours are 00-23)
		timeSmart:    	'noon:ss ampm',					//blank if no timePart(); single digit hr padded
														//Noon for 12:00:00; seconds dropped if 0
						//date time
		dateTimeBrief: 	'mm-dd-yy noon',	 		//time dropped if timePart() = 0
														//Noon for 12:00; seconds always dropped
		dateTimeShort:	'mm-dd-yyyy HH:MM:SS',		    //time always displayed with seconds
														//24 hour clock
		dateTimeLong:  	'da mo d, yyyy hh:MM:ss', 	//time dropped if timePart() = 0
														//Noon for 12:00:00
		dateTimeSmart: 	'd, yyyy h:MM:ss ampm', 		//time dropped if timePart() = 0
														//Noon for 12:00:00
		dateTimeFull:	'mm-dd-yyyy HH:MM:SS.NNN',	    //24 hour clock always show time with milliseconds
		dateTimeAll:	'mm-dd-yyyy HH:MM:SS.NNN zone', //24 hour clock time with milliseconds and time zone

						//timestamps
		timestamp: 		'yyyy-mm-dd.HH:MM:SS',			//HH is 24 hour always keeps time and seconds
		timestampDate: 	'yyyy-mm-dd',					//date only never time 			 -- legacy: revizeDate
		timestampSmart:	'yyyy-mm-dd HH:ss:tt.nnn',			//time dropped if timePart() = 0 -- legacy: revizeDate
														//HH is 24 hour time; seconds dropped if 0
		timestampShort: 'yyyy-mm-dd HH:MM',				//always keeps time without seconds
		timestampFull:	'yyyy-mm-dd HH:MM:SS.NNN',		//always keeps milliseconds

		timestamp_filename: 	 'yyyy-mm-dd.HH~MM~SS',
		timestampShort_filename: 'yyyy-mm-dd.HH~MM',
		timestampSmart_filename: 'yyyy-mm-dd.HH~MM~ss',
		timestampFull_filename:	 'yyyy-mm-dd.HH~MM~SS~NNN'
								
	}
}
/*---------------------------------------------------------------------------------------------
Extend Date class with additional properties and methods.

Smarter handling of Date String argument to recognize more formats -- most notably dashes by
Firefox and Chrome -- see createDate() for more details.
		 *
		 * 	for string argument, convert dashes --> slash and change several
		 *	un-recognized date formats to dates recognizable by native Date()

Smarter to supports dashes "-" in constructor for FF & Chrome:
	.e.g. new EZ.date('12-21-2012')

Plus 
The builtin Date() object is not extended to avoid different behavior caused
by adding prototypes directly.

---------------------------------------------------------------------------------------------*/
EZ.date = function EZdate(options)
{	
	var options = getDateOptions(this, arguments);
	if (options.message)
		return options.message;

	var rtnValue = options.rtnValue;
	///if(EZ.start(options)))
	{
		rtnValue = options.fnRun.apply(options.ctx, options.args);
				
		var callback = options.callback[options.fn];
		if (callback)
			rtnValue = callback.call(options.ctx, rtnValue);
	}
	//=====================
	return rtnValue
///	return EZ.finish(rtnValue);
	//=====================
	
	/**
	 *	returns date using specified format(s) or default if none found
	 */
	function _toString(args)
	{	
		var formattedDate = '';
		try
		{
			if  (updateFormattedDate(this)) 				//update _formattedDate property
			{
				var formats = this.getFormats();
				args.forEach(function(arg)
				{
					EZ.toArray(arg).forEach(function(fmt)	//for each format . . .
					{										//treat as literal if unknown fmt
						formattedDate += formats[fmt] ? this._formattedDate[fmt] : fmt;
					});
				});
				return formattedDate !== '' || this._formattedDate['*'];
			}
		}
		catch (e)
		{
			void(0);
		}
		return formattedDate || new Date(this).toString();
	}
	//____________________________________________________________________________________________
	/**
	 *	function updateFormattedDate(date)
	 *
	 *	_formattedDate date property updated with all above date formats -- toString() just looks up.
	 *
	 *	exposed so all formats are displayed by JavaScript debugger but should not be referenced 
	 *	directly to avoid js error if format name misspelled or names are changed in future.
	 *
	 *		e.g.	date.toString('shortDate')    -NOT-    date._formattedDate.shortDate
	 *
	 *	If names are changed or deprecated, backward compatibility will be provided via toString()
	 */
	function updateFormattedDate(date)
	{
		if (!date.isEZ || !EZ.options.date.formats)
			return false;
			
		var dateTime = date.getTime();					//remember value formatted
		if (date._formattedDate && date._dateTime == dateTime)
			return true;
		
		date._dateString = new Date(dateTime) + '';
		
		var dt = {
			day: date.getDate(),
			dayName: date.getDayName(),
			month: date.getMonth(),
			year: date.getFullYear(),
			monthName: date.getMonthName(),
			hours: date.getHours(),
			minutes: date.getMinutes(),
			seconds: date.getSeconds(),
			milliseconds: date.getMilliseconds()
		}
		dt.da = dt.dayName.substr(0,3);
		dt.mo = dt.monthName.substr(0,3);

		  //----------------------\\
		 //----- date formats -----\\
		//--------------------------\\
		dt.yyyy = dt.year + '';
		dt.yy = dt.yyyy.right(2);
		dt.mm = ('0'+(dt.month+1)).right(2);
		dt.m = dt.month + '';
		dt.dd = ('0'+dt.day).right(2);
		dt.d = dt.day + '';
		dt.daySuffix = dt.day.addSuffix();

		if (date.getTime() <= EZ.options.date.baseDate.getTime())
			dt.year = dt.mm = dt.m = dt.dd = dt.d = '';		//clear date formats if only time

		  //----------------------\\
		 //----- time formats -----\\
		//--------------------------\\
		dt.zoneFull = date._dateString.matchPlus(/\(([A-Za-z\s].*)\)/)[1];
		dt.zone = dt.zoneFull.replace(/[a-z\W]/g, '');		

		dt.HR = dt.hours + '';
		dt.H = dt.hours === 0 ? '' : dt.HR;
		dt.HH = ('0' + dt.hours).right(2);		
		dt.h = dt.hours === 0 ? ''
			 : dt.hours > 12 ? dt.hours - 12
			 : dt.hours + '';
		dt.hh = dt.hours ? ('0'+ dt.h).right(2): '';
		dt.MM = ('0' + dt.minutes).right(2);
		dt.M = dt.minutes + '';
		dt.SS = ('0' + dt.seconds).right(2);

		dt.S = dt.seconds + '';
		dt.ss = dt.seconds ? dt.SS : ''
		dt.s = dt.seconds ? dt.S : ''
		dt.t = (dt.seconds + dt.milliseconds) ? dt.S : '';
		dt.tt = (dt.seconds + dt.milliseconds) ? dt.SS : '';
		
		dt.NNN = ('000' + dt.milliseconds).right(3);
		dt.nnn = dt.milliseconds ? dt.NNN : '';
		
		dt.ampm = dt.AMPM = (dt.hours < 12) ? 'am' : 'pm';
		dt.noon = dt.midnight = dt.HH + ':' + dt.MM + ' ' + dt.AMPM;
		dt.NOON = dt.MIDNIGHT = dt.HH + ':' + dt.MM + ':' + dt.SS + ' ' + dt.AMPM;
	
		dt.noon = dt.midnight = dt.noon.replace(/12:00 pm/i,'noon');
		dt.NOON = dt.MIDNIGHT = dt.noon.replace(/12:00:00 pm/i,'noon');
		dt.noon = dt.noon.replace(/12:00 am/i,'');
		dt.NOON = dt.NOON.replace(/12:00:00 am/i,'');
		dt.midnight = dt.midnight.replace(/12:00 am/i,'midnight');
		dt.MIDNIGHT = dt.MIDNIGHT.replace(/12:00:00 am/i,'midnight');
	
		  //--------------------------------\\
		 //----- create formatted dates -----\\
		//------------------------------------\\
		var options = EZ.options.date;
		var formats = {}
		
		var keys = Object.keys(options.defaultFormats).sort(sortByLength);
		keys.forEach(function(key)						//---------------------------
		{												//set all base formats values
			var value = options.defaultFormats[key];	//---------------------------
			if (dt[value] == null) 
				return;
			
			formats[key] = dt[value] + '';				//no expressions			
			if (dt[value] == null)			
				dt[value] = value;			

		});
		e = logFormats('baseFormats');
		
		for (var key in options.defaultFormats)			//----------------------------
		{												//set remaining defaultFormats
			var value = options.defaultFormats[key];	//----------------------------
			if (dt[value] != null) continue;			//skip if base format

			formats[key] = setFormat(key,value);		//apply all key/values & expr
			dt[formats[key]] = formats[key];			
		}
		e = logFormats('defaultFormats');

		var dateFormats = date.getFormats();			//get format list for this date
		var formatList = Object.keys(dateFormats);			
		formatList.remove(Object.keys(formats)).forEach(function(key)
		{												//-------------------------
			if (formats.includes(key)) return;			//set custom formats if any
			var value = dateFormats[key];				//-------------------------
			formats[key] = setFormat(key, value);
		});
		e = logFormats('custom Formats');

		date._formattedDate = {};						//recreate _formattedDate property
		formatList.forEach(function(key)				//-------------------------
		{												//copy formats in date list
			var value = getFormat(formats[key]);		//--------------------------
			if (key.toLowerCase() != 'ampm' && /^(am|pm)$/i.test(value.trim()))
				value = '';
			date._formattedDate[key] = value;
		});
		e = logFormats('savedFormats', date._formattedDate);
		
		date._dateTime = dateTime;
		//======================
		return true;
		//======================
		/**
		 *	1. unescape format replacements made by setFormat() 
		 *	2. trim leading and trailing spaces or non-numeric, non-alpha characters
		 *	3. collapse multiple spaces or any other non-numeric, non-alpha break char
		 *	   to first character.
		 *	4. replace "^" or "&" placeholder at start of format with space or "&nbsp;"
		 *	   respectively.	 
		 */
		function getFormat(value)
		{	
			if (typeof(value) != 'string')
				return value;

			//value = value.replace(/-@-/g, '');
			value = value.replace(/([^\w\d^& ]{2,})/g, function(all,dups) 
			{
				return dups.substr(0,1)
			});
			value = value.replace(/([^\w\d,]\s+)/, function() {return ' '} );
			
			value = value.trim().trimPlus(/[^\w\d^&)]/);
			value = value.replace(/^\^/, ' ').replace(/^&/, '&nbsp;');
			/*TODO:
			*/
			return value;
		}
		/**
		 *	replace references in value to other format keys.
		 */
		function setFormat(key,value)
		{
			var isReplaced = false;
			var keys = Object.keys(dt);	//.sort(sortByLength);
			keys.remove(key).forEach(function(fmt)
			{
				if (fmt == '*') return;
				var regex = RegExp( '(\\b' + fmt + '\\b)', 'g');
				value = value.replace(regex, function()
				{
					isReplaced = true;
					return 'dt' + fmt + 'k' + dt[fmt] + 'v';
				})
			});
			if (isReplaced)
			{
				var val = value.replace(/dt.*?k(.*?)v/g, '$1');
				try
				{
					if (false)
					{
						eval('value='+value);
						dt[key] = value;
					}
					else value =  val;
				}
				catch (e)
				{
					value =  val;
				}
			}
			//======================
			return value;
			//======================
		}
		/**
		 *	sort Array of keys by length of key.
		 */
		function sortByLength(a, b)
		{	
			return (a.length > b.length) ? -1
				 : (a.length < b.length) ? 1
				 : 0;
		}
		/**
		 *	debugging
		 */
		function logFormats(note, fmt)
		{	
			fmt = fmt || formats
			var formatted = {};
			for (var key in fmt)						//append any formats in date list
				formatted[key] = getFormat(fmt[key]);
			console.log({note:note, count: Object.keys(formatted).length, formats: formatted});
			return formatted;
		}
	}
	//____________________________________________________________________________________________
	/**
	 *	createDate(year,month,day,hours,minutes,seconds,ms)
	 *
	 *	Create new Date() Object with additional properties and functions.
	 *	saves default toString() as toStringDefault() -- also accessible with toString('default')
	 */
	function createDate(year,month,day,hours,minutes,seconds,ms)
	{
		var date;
		switch (arguments.length)
		{
			case 0:
				date = new Date();
				break;
			case 1:
				date = getDate(year);
				break;
			case 2:
				date = new Date(year,month);
				break;
			case 3:
				date = new Date(year,month,day);
				break;
			case 4:
				date = new Date(year,month,day,hours);
				break;
			case 5:
				date = new Date(year,month,day,hours,minutes);
				break;
			case 6:
				date = new Date(year,month,day,hours,minutes,seconds);
				break;
			default:
				date = new Date(year,month,day,hours,minutes,seconds,ms);
				break;
		}

		if (isNaN(date)) // && EZ.date.settings.nullForInvalidDate)
			return null;								//return null for invalid date

		date._options = EZ.mergeAll(EZ.options.date);	//init date._options
		setProperties(date)								//append other properties and functions

		date.isEZ = true;
		updateFormattedDate(date);
		
		//=======================================
		return options.ctx = options.date = date;
		//=======================================
		//____________________________________________________________________________________________
		/**
		 *	Smarter handling of Date String argument to recognize more formats -- most notably dashes.
		 *
		 * 	for string argument, convert dashes --> slash and change several
		 *	un-recognized date formats to dates recognizable by native Date()
		 */
		function getDate(dateStr)
		{
			switch (getType(dateStr))
			{
				case 'String':
				{
					if (dateStr === '')		//if blank string, lookup override default
					{
						return EZ.options.date.asNow.includes('') ? new Date()
							 : EZ.options.date.asNull.includes('') ? new Date(null)
							 : new Date('');	//invalid
					}
					break;
				}
				case 'Undefined':			//treat undefined as null ??
				{
					return EZ.options.date.asNow.includes(undefined) ? new Date()
						 : EZ.options.date.asNull.includes(undefined) ? new Date(null)
						 : new Date('');	//invalid
				}

				case 'Null': 				//resolves as 12-31-1969 -- less than any real dates
				case 'Boolean': 			//treated same as native -- resolves to now
				case 'Number':
				case 'Date':
					return new Date(dateStr);
				default:
					return new Date(dateStr);
			}
			dateStr = dateStr.replace(/Noon/i,'12:00pm');
			dateStr = dateStr.replace(/Midnight/i,'12:00am');
			dateStr = dateStr.replace(/(\d)\-(\d)/g,'$1/$2');
			dateStr = dateStr.replace(/(\d{1,2}\/\d{1,2}\/)(\d{2})(?!\d)/, '$120$2');
			dateStr = dateStr.replace(/(\d)(am|pm)/, '$1 $2');

			if (dateStr.indexOf('/') == -1)								//prepend baseDate if no date part
				dateStr = '1/1/1970 ' + dateStr;						//e.g. "10:00 am" --> "1/1/1970 10:00 am"
			else
			{											 				//MM/dd --> MM/dd/yyyy current-year
				/*
				dateStr = dateStr.replace(/(\d{1,2}\/\d{1,2})(?!\d)/, '$1/' + new Date().getFullYear());
				if (!/\d{1,2}\/\d{1,2}\/\d/.test(dateStr))						//MM/yyyy --> MM/1/yyyy 1st day of month
					dateStr = dateStr.replace(/(\d{1,2})\/(\d{4})/, '$1/1/$2');

				dateStr = dateStr.replace(/(\d{4})\/(\d{1,2})(?!\/)/, '$2/1/$1');		//yyyy/MM --> MM/1/yyyy
				dateStr = dateStr.replace(/(\d{4})\/(\d{1,2}\/\d{1,2})(?!\/)/,'$2/$1');	//yyyy/MM/dd --> MM/dd/yyyy
				*/
			}
			dateStr = dateStr.trim();
			date = new Date(dateStr);
			if (!isNaN(date)) 					//if valid date, return it otherwise check for out of order dates
				return date;					//-OR- filename timestamps -- dashes already eliminated above

			dateStr = dateStr.replace(/(\d{1,2}\/\d{1,2}\/\d{4})\./, '$1 ');		//timestamps . after number year
			dateStr = dateStr.replace(/(\d{1,2})[~._](\d{1,2})(?!\d)/g, '$1:$2');	//##[~. _]## --> ##:##
			dateStr = dateStr.replace(/(\d{1,4})\s*@\s(\d{1,2})/g, '$1 $2');		//## @ ##    --> ## ##
																					//e.g. 12/2015 @ 10:30
			return new Date(dateStr);
		}
		//________________________________________________________________________________________
		/**
		 *	bind EZ.date.fn with nested instance functions and external EZ.date.* functions
		 *	-AND- EZ.date.prototype.{functionName}
		 *	-AND- EZ.date.prototype.callback.{functionName}
		 */
		function setProperties(date)
		{
			//date.toStringDefault = date.toString;			//copy native Date.toString()
			date.toString = EZ.date.bind(date, '_toString');
	
			date._options.bindNames = Object.keys(EZ.date.fnMap);
			for (var name in EZ.date.fnMap)					//bind nested instance date functions
				date[name] = EZ.date.bind(date, '_' + name);

			Object.keys(window.EZ.date).remove('test').forEach(function(name)
			{												//bind external EZ.date[fn] as instance
				var fn = window.EZ.date[name];
				if (typeof(fn) != 'function') return;
				
				date._options.bindNames.push(name);
				date[name] = fn.bind(date);
			});
																	
			Object.keys(EZ.date.prototype).remove('setup').forEach(function(key)
			{												//for each EZ.date.prototype . . .									
				var fn = window.EZ.date.prototype[key];
				if (typeof(fn) != 'function')				//save property if not function
					return date[key] = fn;
				
				var name = fn.name || key;					//if name not internal instance fn,
				if (!date._options.bindNames.includes[name])
					date[name] = fn.bind(date);				//bind directly as external instance fn 

				else if (EZ.options.date.callback)			//otherwise if callback enabled
					options.callback[name] = fn;		//save as callback fn
			});
		}
	}
	//____________________________________________________________________________________________
	/**
	 *	called by EZ.date() to initialize RZ.date() call options with:
	 *		fn, ctx, args, message, rtnValue, callback . . .
	 */
	function getDateOptions(date, args)
	{
		if (typeof(date) == 'object' && date.exception) return date;
		
		var options = {
			ctx: date,
			args: EZ.toArray(args),
			rtnValue: date,
			message: '',
			callback: {},			
		};
		do																						
		{												
			var fn = args[0];
			if (typeof(fn) != 'string' || fn.substr(0,1) != '_')
			{											//createDate call
				if (EZ.options.date.debug) console.clear();
				if (EZ.options.date.formats == null)
					dateSetup();
				date = new Date('');					//start with invalid date
 				options.date = date;
				fn = options.fn = 'createDate';
				options.fnRun = createDate;
				options.lock = true;
			}
			else										//other instance function  call
			{
				fn = options.fn = fn.substr(1);
				options.args.shift();
				
				var type = getType(date);				//must be called from date instance
				if (type != 'Date')
				{
					options.message = fn + '() only valid for EZ.Date' 
									+ (type != 'Window' ? ' not ' + type : '');
					break;
				}
	
				if (fn == 'toString')
				{											
					if (date.isEZ)						//if EZ.date initialized 
						options.fnRun = _toString;		//use internal toString() 
					//rtnValue = date.toStringDefault() || date.toStringDefault();
				}
				else if (!date._options.bindNames.includes(fn))
				{
					options.message = 'unknown EZ.date function: ' + fn;
					break;
				}
				else
				{
					options.fnRun = EZ.date.fnMap[fn];		//lookup internal function
				///	if (fn in date._options.callback)		//check for callback
				///		options.callback = date._options.callback[fn];
				}
			}
			//var lockList = 'createDate toString callback'.split(' ');
		}
		while (false)
		if (EZ.options.date.debug) console.log(options);

		//=============
		return options;
		//=============
	}
	/*--------------------------------------------*/
	/*BOOKMARK EZ.date date (instance) functions */
	/*------------------------------------------*/
	//____________________________________________________________________________________________
	/**
	 *	return full month name
	 */
	function _getMonthName()
	{
		return EZ.date.getMonthNames()[this.getMonth()];
	}
	/**
	 *	return full day name
	 */
	function _getDayName()		
	{
		return EZ.date.getDayNames()[this.getDay()];
	}
	/**
	 *	return number of days in date's month
	 */
	function _getDaysInMonth()
	{
		//                  1  2  3  4  5  6  7  8  9 10 11 12
		var daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
		var month = this.getMonth();
		var days = daysInMonth[month];
		if (month==1 && isLeapYear(this.getFullYear()))
			days=29;

		return this.callback(days);

		function isLeapYear(Year)
		{
			if (((Year % 4)===0) && ((Year % 100)!==0) || ((Year % 400)===0))
				return true;
			else
				return false;
		}
		/* alt from: http://msdn.microsoft.com/en-us/library/aa239571(v=vs.60).aspx
		// may not work in non-IE browsers
		eomDate = new Date();
		eomDate.setMonth(eomDate.getMonth() + 1 );
		eomDate.setDate(1);
		eomDate.setDate( eomDate.getDate() - 1);
		alert("Last day of this month = " + eomDate);
		*/
	}
	/**
	 *	return new EZdate with number of months added or subtracted -- default: +1
	 */
	function _addYears(number)
	{
		number = EZ.toInt(number, 1);
		return _addMonths(number * 12);
	}
	/**
	 *	return new EZdate with number of months added or subtracted -- default: +1
	 */
	function _addMonths(number)
	{
		number = EZ.toInt(number, 1);

///		var time = this.getTime();
		var year = this.getFullYear() + parseInt(number / 12);
		var month = (this.getMonth() + number) % 12;
		if (number > 0 && month < this.getMonth())
			year++;
		else if (number < 0 && month > this.getMonth())
			year--;
		var day = this.getDate();
		var hours = this.getSeconds();
		var minutes = this.getSeconds();
		var seconds = this.getSeconds();
		var milliseconds = this.getMilliseconds();
		
		var date = new Date(year,month,day,hours,minutes,seconds,milliseconds);
		
		date.setDate(1);				//advance to next month using day=1
		date.setYear(year);
		date.setMonth(month);
		
		day = Math.min(day, this.getDaysInMonth());	
		date.setDate(day);				//adjust date using current day or last day of month
		
		return createDate(date);
	}
	/**
	 *	return new EZdate with number of weeks added or subtracted -- default: +1
	 */
	function _addWeeks(number)
	{
		if (typeof number == 'undefined') number = 1;
		return _addDays(number*7);
	}
	/**
	 *	TODO: return new EZdate with number of days added or subtracted -- default: +1
	 *
	 *	Credit: http://www.w3schools.com/js/js_obj_date.asp
	 *	They say adding days goes into another month or year, Date object adjusts.
	 */
	function _addDays(number)
	{
		var milliseconds = EZ.toInt(number, 1) * (60 * 60 * 1000) * 24;
		return _addMilliseconds(milliseconds);
	}	
	/**
	 *	return new EZdate with number of hours added or subtracted -- default: +1
	 */
	function _addHours(number)
	{
		var milliseconds = EZ.toInt(number, 1) * (60 * 60 * 1000);
		return _addMilliseconds(milliseconds);
	}
	/**
	 *	return new EZdate with number of minutes added or subtracted -- default: +1
	 */
	function _addMinutes(number)
	{
		var milliseconds = EZ.toInt(number, 1) * (60 * 1000);
		return _addMilliseconds(milliseconds);
	}
	/**
	 *	return new EZdate with number of minutes added or subtracted -- default: +1
	 */
	function _addSeconds(number)
	{
		var milliseconds = EZ.toInt(number, 1) * (60 * 1000);
		return _addMilliseconds(milliseconds);
	}
	/**
	 *	return new EZdate with number of minutes added or subtracted -- default: +1
	 */
	function _addMilliseconds(number)
	{
		var milliseconds = EZ.toInt(number, 1);
		return createDate(this.getTime() + milliseconds);
	}
	/**
	 *	return new EZ.date() object containing only date part of this EZ.date().
	 */
	function _getDatePart()
	{
		var date = EZdate(this.getFullYear(),this.getMonth(),this.getDate())
		return this.callback( EZ.date(date) );
	}
	/**
	 *	return a new Date() object which is GMT representation of time component.
	 *
	 *	Therefore getTime() returns milliseconds since midnight not since GMT 12:00am
	 *	(e.g. 0 for midnight; 1*60*60*1000 = 3600000 for 1am, etc).
	 *	
	 *	However getHours() returns GMT hours not the hour specified when this EZ.date
	 *	object was created. Therefore EZ.date() with no time component (i.e. midnight)
	 *	returns 19 (7pm) from getHours() when local is EST since EST is GMT-5 hours.
	 */
	function _getTimePart()
	{
		var date = new Date(1970,0,1);
		date.setUTCHours(this.getHours(),
						 this.getMinutes(),
						 this.getSeconds(),
						 this.getMilliseconds());
		return this.callback( EZ.date(date) );
	}
	/**
	 *	Returns the week number for this date.
	 *	
	 *	@param int dowOffset (optional) day week starts on (0 to 6) 1 is Monday
	 *	@return int ISO 8601 week number
	 *	
	 *	Credit: Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com
	 */
	function _getWeek(dowOffset)
	{
		dowOffset = isNaN(dowOffset) ? 0 : dowOffset; //default dowOffset to zero

		var newYear = new Date(this.getFullYear(),0,1);
		var day = newYear.getDay() - dowOffset; //the day of week the year begins on
		day = (day >= 0 ? day : day + 7);
		var daynum = Math.floor((this.getTime() - newYear.getTime() -
					 (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
		var weeknum;

		//if the year starts before the middle of a week
		if(day < 4)
		{
			weeknum = Math.floor((daynum+day-1)/7) + 1;
			if(weeknum > 52)
			{
				var nYear = new Date(this.getFullYear() + 1,0,1);
				var nday = nYear.getDay() - dowOffset;
				var nday = nday >= 0 ? nday : nday + 7;
				/*if the next year starts before the middle of
				  the week, it is week #1 of that year*/
				weeknum = nday < 4 ? 1 : 53;
			}
		}
		else
			weeknum = Math.floor((daynum+day-1)/7);
		return this.callback(weeknum);
	}
	//_________________________________________________________________________________________
	/**
	 *	called before createDate() when EZ.options.date.formats undefined
	 *	-initialize EZ.options.date.formats to defaultFormats
	 *	-populated EZ.date.fnMap with internal functions
	 */
	function dateSetup()
	{
		EZ.date.fnMap = {
			addYears: _addYears,
			addMonths: _addMonths,
			addWeeks: _addWeeks,
			addDays: _addDays,
			addHours: _addHours,
			addMinutes: _addMinutes,
			addSeconds: _addSeconds,
			addMilliseconds: _addMilliseconds,
			
			getMonthName: _getMonthName,
			getDayName: _getDayName,
			getDaysInMonth: _getDaysInMonth,
			//getNthDayInMonth: _getNthDayInMonth,
			getWeek: _getWeek,
			//updateFormattedDate: _updateFormattedDate,
			
			getDatePart: _getDatePart,
			getTimePart: _getTimePart
			//toString: _toString
		}
		EZ.options.date.formats = EZ.mergeAll(EZ.options.date.defaultFormats);
		if (EZ.date.prototype.setup)
			EZ.date.prototype.setup();
	}
	//_________________________________________________________________________________________
	/**
	 *	return type as defined by Object.prototype.toString()
	 *	use constructor.name if type is lowercase e.g. window --> [object global]
	 */
	function getType(value)
	{
		var type = Object.prototype.toString.call(value);

		type = type.substring(8,type.length-1)
		if (type.toLowerCase() == type)
			type = value.constructor.name;
		return type;
	}
}
/*---------------------------------------------------------------------------------------------
EZ.date.getFormats(formats)

return Object of valid formats matching those specified or all valid formats if none specified.

ARGUMENTS:
	formatName	(optional) space delimited string or Array containing one or more format names

RETURNS:
	Object with valid format names as key and value as format notation.
	Use: date.toString(formatNames...) to get date formatted with specified format name(s).
---------------------------------------------------------------------------------------------*/
EZ.date.getFormats = function EZdate_getFormats(formatNames)
{
	if (EZ.options.date.formats == null) EZ.date();
	var formatOptions = this.isEZ ? this._formats || {} : EZ.options.date.formats;

	var formats = {};
	formatNames = formatNames || Object.keys(formatOptions);
	EZ.toArray(formatNames, true).forEach(function(key)
	{
		if (formatOptions[key])
			formats[key] = formatOptions[key];
	});
	return formats;
}
/*---------------------------------------------------------------------------------------------
EZ.date.setFormats(formats)

Adds or replaces date format strings.  If called on EZ.date Date Object, only applies to that 
date otherwise applies to any new EZ.date created via EZ.date(...)

ARGUMENTS:
	formats		Object containing key/values: format name as key and date notation as value.
		
RETURNS:
	Object of updated formats as returned by getFormats()
---------------------------------------------------------------------------------------------*/
EZ.date.setFormats = function EZdate_setFormats(formats)
{
	if (EZ.options.date.formats == null) EZ.date();
	var formatOptions = this.isEZ ? this._formats || {} : EZ.options.date.formats;
	
	formats = formats || EZ.options.date.defaultFormats;
	for (var key in formats)
		formatOptions[key] = formats[key] || EZ.options.date.defaultFormats[key] || '';
	
	if (this.isEZ)
		this.updateFormattedDate();
	
	return this.getFormats();
}
/*---------------------------------------------------------------------------------------------
EZ.date.removeFormats(formats)

ARGUMENTS:
	formats		space delimited Strimg or Array of formats to remove.
		
RETURNS:
	Object of updated formats as returned by getFormats()
---------------------------------------------------------------------------------------------*/
EZ.date.removeFormats = function EZdate_removeFormats(formatNames)
{
	if (EZ.options.date.formats == null) EZ.date();
	var formatOptions = this.isEZ ? this._formats || {} : EZ.options.date.formats;

	formatNames = formatNames || Object.keys(EZ.date.getFormats());	
	EZ.toArray(formatNames, true).forEach(function(key)
	{
		delete formatOptions[key];
	});
	if (this.isEZ)
		this.updateFormattedDate();
	
	//return this.getFormats();
	return EZ.mergeAll(formatOptions);
}
/*---------------------------------------------------------------------------------------------
EZ.date.getOption(key, defaultValue)

return value of option of specified by key.

ARGUMENTS:
	key		(String) specifies option key orname

RETURNS:
	EZ.date.option specified by key (date.option call on date otherwise global option)
	use toString(...) to return formatted date.
---------------------------------------------------------------------------------------------*/
EZ.date.getOption = function EZdate_getOption(key, defaultValue)
{
	key = key + '';
	var dateOptions = this.isEZ ? this._options : EZ.options.date.options;
	
	if (key in dateOptions === false && defaultValue != EZ.undefined)
		dateOptions[key] = defaultValue;
	
	return dateOptions[key];
}
/*---------------------------------------------------------------------------------------------
EZ.date.setOption(key)

return value of option of specified by key.

ARGUMENTS:
	key		(String) specifies option key orname

RETURNS:
	EZ.date.option specified by key (date.option call on date otherwise global option)
	use toString(...) to return formatted date.
---------------------------------------------------------------------------------------------*/
EZ.date.setOption = function EZdate_setOption(key,value)
{
	key = key + '';
	var dateOptions = this.isEZ ? this._options : EZ.options.date.options;
	if (value != EZ.undefined)
		dateOptions[key] = value;
	else
		delete dateOptions[key];
	return dateOptions[key];
}
/*---------------------------------------------------------------------------------------------
RZdate compatibility: 		
	
These callback functions are called with new date by adding or subtracting number
of specified years, months, weeks, days, hours, minutes, seconds, or milliseconds.

The current date is aet to the newDate and then returns number of:

	days added or subtracted by addYears, addMonths and addWeeks 
	-or- minutes added or subtracted by addHours 
	-or- seconds added or subtracted by addMinutes or addMilliseconds
---------------------------------------------------------------------------------------------*/
EZ.date.prototype.addYears = 
EZ.date.prototype.addMonths = 
EZ.date.prototype.addWeeks = function addWeeks(newDate)
{
	var oldTime = this.getTime();
	var newTime = newDate.getTime();
	this.setTime(newTime);
///	this.updateFormattedDate();
	
	var diff = (newTime-oldTime) / 24 / 60 / 60 / 1000; 	//number of days added
	return parseInt(diff + 0.5);	
}
EZ.date.prototype.addHours = function addHours(newDate)
{
	var oldTime = this.getTime();
	var newTime = newDate.getTime();
	this.setTime(newTime);
//	this.updateFormattedDate();
	
	var diff = (newTime-oldTime) / 60 / 60 / 1000; 			//number of minutes added
	return parseInt(diff + 0.5);	
}
EZ.date.prototype.addMinutes = function addMinutes(newDate)
{
	var oldTime = this.getTime();
	var newTime = newDate.getTime();
	this.setTime(newTime);
//	this.updateFormattedDate();
	
	var diff = (newTime-oldTime) / 60 / 1000; 				//number of seconds added
	return parseInt(diff + 0.5);	
}
/*---------------------------------------------------------------------------------------------
RZdate compatibility
---------------------------------------------------------------------------------------------*/
EZ.date.prototype.createDate = function EZdate_callback(date)
{
	/*---------------------------------------------------------------*/
	/*BOOKMARK EZ.date instance properties (backward compatibility) */
	/*		   superceeded by getter functions above               */
	/*------------------------------------------------------------*/

	EZ.date.prototype.baseDate = '01/01/1970';
	EZ.date.monthNames = ["January", "February", "March", "April",
						 "May", "June", "July", "August",
						 "September", "October", "November", "December"];
	EZ.date.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday",
					   "Thursday", "Friday", "Saturday"];

	EZ.date.prototype.monthNames = ["January", "February", "March", "April",
								   "May", "June", "July", "August",
								   "September", "October", "November", "December"];

	EZ.date.prototype.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday",
								  "Thursday", "Friday", "Saturday"];

	//	conflicts with native function
	//  USE: EZ.date.getMonthNames().indexOf(monthName);
	EZ.date.getMonth = function(monthName)
	{
		for (var i=0; i<EZ.date.monthNames; i++)
			if (EZ.date.monthNames[i] == monthName) return i;
		return -1;
	}

	/*--------------------------------------------------------------*/
	/*BOOKMARK EZ.date instance functions (backward compatibility) */
	/*------------------------------------------------------------*/
	EZ.date.prototype.addMonth = function(number)
	{	//backward compatibility
		return this.addMonths(number)
	}
	EZ.date.prototype.get = function(format) {return this.toString(format)}
	
	date.isRZdate = this.isEZ;
	return date;
}
/*----------------------------------------------------------*/
/*BOOKMARK EZ.date static functions (instance not required)*/
/* as convenience they are available as date functions    */
/*-------------------------------------------------------*/
EZ.date.getBaseDate = function EZdate_getBaseDate()
{
	return new Date('01/01/1970 GMT');
}
EZ.date.getDayNames = function EZdate_getDayNames()
{
	return ["Sunday", "Monday", "Tuesday", "Wednesday",
				      "Thursday", "Friday", "Saturday"];
}
EZ.date.getMonthNames = function EZdate_getMonthNames()
{
	return ["January", "February", "March", "April",
			"May", "June", "July", "August",
			"September", "October", "November", "December"];
}
//_____________________________________________________________________________________________
EZ.date.test = function()
{
	/*global ezdate:true */
	var obj=null, date,
		ex = 'na', exfn = exfn, note = '';
	
	var exfn = function(results, testrun)
	{
		//debugger
		if (!results) return;
		testrun.results = results._formattedDate || '_formattedDate is undefined';
	}
	function testSetup()
	{
		note = ex.note; 
		delete ex.note;
debugger;		
		EZ.date.setFormats();							//restore default formats
		var fmt = EZ.date.getFormats(Object.keys(ex));	//get test formats
		EZ.date.removeFormats();						//remove all formats
		EZ.date.setFormats(fmt);						//add test formats
		EZ.test.options({ex:ex, exfn:exfn, note:note})
	}
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
//return;
	
	date = "02-28-2016 03:22:00.877 am"
	ex = {
		timeBrief: "3:22:00.877 am", 
		timeFull:  "",
		timeLong:  "",
		timeMini:  "",
		timeShort: "",
		timeSmart: "",
		note: 'complex times'
	}
	testSetup();
	ezdate = EZ.test.run(date);

if (true)
return;
	

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = 'all default formats'
	date = "02-28-2016 03:22:00.877 am";
	obj = {}
	ex = {
		"dateTime": 1456647720877,
		"month": "February",
		"noon": "03:22am",
		"NOON": "03:22am",
		"midnight": "03:22am",
		"MIDNIGHT": "03:22am",
		"zoneFull": "Eastern Standard Time",
		"zone": "EST",
		"min": "22",
		"sec": "",
		"ampm": "am",
		"AMPM": "AM",
		"yyyy": "2016",
		"year": "2016",
		"yr": "16",
		"yy": "16",
		"dd": "28",
		"da": "Sun",
		"mo": "Feb",
		"daySuffix": "28th",
		"day": "Sunday",
		"mm": "02",
		"m": "1",
		"d": "28",
		"hr": "3",
		"hh": "03",
		"h": "3",
		"HH": "03",
		"H": "3",
		"MM": "22",
		"M": "22",
		"SS": "00",
		"S": "0",
		"ss": "",
		"s": "",
		"tt": "00",
		"t": "0",
		"nnn": "877",
		"NNN": "877",
		"dateBrief": "02-28-16",
		"dateShort": "02-28-2016",
		"dateLong": "Sunday February 28th, 2016",
		"dateSmart": "Sun Feb 28, 2016",
		"time": "3:22 am",
		"seconds": "877",
		"milliseconds": "877",
		"timeBrief": "3:22 am",
		"timeFull": "03:22:877",
		"timeLong": "03:22am:00 am",
		"timeMini": "03:22 am",
		"timeShort": "03:22",
		"timeSmart": "03:22 am",
		"dateTimeBrief": "02-28-16 03:22 am",
		"dateTimeShort": "02-28-2016 03:22:00",
		"dateTimeLong": "Sun Feb 28, 2016 03:22",
		"dateTimeFull": "02-28-2016 03:22:00.877",
		"dateTimeAll": "02-28-2016 03:22:00.877 EST",
		"timestamp": "2016-02-28.03:22:00",
		"timestampDate": "2016-02-28",
		"timestampSmart": "2016-02-28 03:00.877",
		"timestampShort": "2016-02-28 03:22",
		"timestampFull": "2016-02-28 03:22:00.877",
		"timestamp_filename": "2016-02-28.03~22~00",
		"timestampShort_filename": "2016-02-28.03~22",
		"timestampSmart_filename": "2016-02-28.03~22",
		"timestampFull_filename": "2016-02-28.03~22~00~877",
		"*": "02-28-2016 03:22:00.877 am"
	}
	EZ.test.options( {ex:ex, exfn:exfn, note:note})
	ezdate = EZ.test.run(date);

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	//______________________________________________________________________________
	return;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
if (EZ && EZ.global && EZ.global.setup) EZ.global.setup('EZ', 'EZdate');
