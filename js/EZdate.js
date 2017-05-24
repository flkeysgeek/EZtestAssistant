/*--------------------------------------------------------------------------------------------------
DW lint options -- function below not called
--------------------------------------------------------------------------------------------------*/
/*global EZ, e:true */

var e;
(function jshint_globals_not_used() {e = [e]});	//global variables / functions defined but not used

/*---------------------------------------------------------------------------------------------
TODO:
	updateFormattedDate --> instance fn
	formats: null,			//formats added to new EZ.date(...) -- set to defaultFormats
							//1st time EZ.date() called with any arguments
							//use $setFormats() or $removeFormats() to change global or
							//individual date instance values.
---------------------------------------------------------------------------------------------*/
EZ.defaultOptions = EZ.defaultOptions || {};
EZ.defaultOptions.date = {

	debug: true,
	baseDate: new Date(0),
	dateString: true,		//false or blank for native new Date(dateStr) parsing; 
							//=true for all additional dateStr parsing see createDate()
							//="-" to just convert dashes in dates to slashes
							//e.g. 2016-01-12, 2-28, 12-1999

							//default blank to now -- native Date() returns invalid date
	asNow: [""],			//also allows: ??

	asNull: [undefined],	//suported typeof values: undefined
							//typeof(dateString) treated as new Date(null) i.e. baseDate 
							//vs Invalid Date -- both new Date(null) and Invalid Date 
							//are less than any valid date

	invalidDate: null,		//"null" to return Invalid Date as null
							//allows if (!date)... vs if (date == false)...

	callback: false,		//false ignores EZ.date.prototype..._callback functions
							//planned for RZdate backward compatibility
							//option added as development convenience but left

	override: false,		//prototype can override EZ.date() nested functions -- TODO: ??

	formats:			
	{					
						//default format 				//12 hr clock with am/pm drops time if 0
						//            hh
		'$':		 	'{mm-dd-yyyy }[h:MM:tt.nnn AMPM]',//drops seconds and milliseconds if both 0
		
		dateOnly:		'dateOnly',
		dateTime:		'dateTime',
		timeOnly:		'timeOnly',

						//base date values
		d:				'd',							//2 digit day of month
		dd:				'dd',							//2 digit day of month
		day:			'dd',
		da:				"da",							//3 char day of week e.g. "Sun"
		dayName:		"dayName",						//full day of Week e.g. "Sunday"
		daySuffix:		"daySuffix",					//day of month with suffix e.g. 1st, 2nd 9th
		
		m:				'm',							//1 or 2 digit day of month: 1, 2 ... 12
		mm:				'mm',							//2 digit day of month: 01, 02 ... 12
		month:			"mm",
		mo:				"mo",							//3 char month name e.g. "Jan"
		monthName:		"monthName",					//full month name e.g. "January"
		
		yr:				"yy",							//2 digit year
		yy:				"yy",							//2 digit year
		year:			"yyyy",							//4 digit year
		yyyy:			"yyyy",							//4 digit year
		
						//dates -- all formats blank if no date component (i.e. date <= 1/1/1970)
		dateFull:		'{mm-dd-yyyy}',					//2 digits for month & day; 4 digit year
		dateLong:		'{da mo d, yyyy}',				//3 char day of week and month name, 1 or 2 digit day
														//  of month, 4 digit year: e.g. Sun Jan 3, 2016
														//	tip: use substr(4) to omit day of week
		dateLonger:	 	'{dayName monthName daySuffix, yyyy}', 
														//full day of week, month name, day of month with suffix 
														//  4 digit year: e.g. Sunday January 3rd, 2016
														//  e.g. Monday January
		dateShort:		'{mm-dd-yy}',					//2 digits for month, day & year
						//base time values
						
		AMPM:			"AMPM",							//always "AM" or "PM"
		
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
		tt:				'tt',							//2 digit if seconds > 0 or millisecond > 0
		
		T:				'T',							//1 or 2 digit seconds - rounded by milliseconds
		TT:				'TT',							//always 2 digit seconds - rounded by milliseconds
		nnn:			"nnn",							//3 digit millisecond with "." prexix if > 0 else blank
		NNN:			"NNN",							//always 3 digit millisecond no prexix
		
		hr:				'hr',							//always 2 char; 1st is space or 1 (12 hour clock)
		HR:				'HR',							//always 2 char; 1st is space or 1 (24 hour clock)
		min:			'M',							//always 1 or 2 digit minutes: 0 ... 59
		sec:			's',							//always 1 or 2 digit seconds: 0 ... 59
		seconds:		"S.nnn",						//e.g. "0", "0.001", "10.100"
		milliseconds:	"S.NNN",						//e.g. "0.000", "1.001", 10.100"
														//does not use noon or midnight
		
		noon:			"noon",							//12 hour clock; blank if time part is 0 otherwise 
														// 1 or 2 digit hr, 2 digit minutes, no seconds
														// "noon" if 12:00 else  am or pm suffix 
														// e.g. "1:00 am", "noon" "12:01 pm", "11:59 pm" 
		NOON:			"NOON",							//same as noon except 24 hr clock
		
		midnight:		"midnight",						//same as noon except "midnight" if time part is 0
		MIDNIGHT:		"MIDNIGHT",						//same as midnight except 24 hr clock
						
		ZZZ:			"ZZZ",							//3 char uppercase time zone: e.g. "EDT"
		ZZZZ:			"ZZZZ",							//time zone from browser: "Eastern Daylight Time"

						//following time formats blank if no timePart and [...]
		
		
		
						//compound times: built from one or more of above time formats
						//	leading and trailing spaces or non-numeric, non-alpha characters TRIMMED after 
						//	all above base formats applied except as noted below.
						//	multiple space or any other non-numeric, non-alpha break characters collapsed
						//	to single occurance except as noted below.
						//
						//EXCEPTIONS:
						//	noon or NOON retain blank or &nbsp; prefix respectivly when timepart is not 0 
						//	midnight OR MIDNIGHT ALWAYS retains blank or &nbsp; prefix
						
//TODO: don't think these add value
		ampm:			"[AMPM]",						//either "am" or "pm" if date has time part
		zzz:			"[ZZZ]",						//same as zzz except blank if no time part
		zzzz:			"[ZZZZ]",						//same as zzzz except blank if no time part
		
		
		timeFull: 		'HH:MM:TT.NNN',					//always 2 digits for hour, minutes and seconds
														//3 digits for ms; 24 hour clock (hours are 00-23)
		timeLong: 		'hh:MM:SS AMPM',				//12 hour clock 2 digits for hr, min and seconds
						//longTime=MIDNIGHT	//  NOT noon for 12:00:00 pm; midnight for 12:00:00 am
//		timeMini:		'midnight',						//same as long except seconds dropped if 0
//midnight
													
		timeShort: 		'HH:MM:ss',						//always 2 digits for hour; seconds dropped if 0
														//24 hour clock (hours are 00-23)

//noon
//		time: 			'h:MM:ss ampm',					//seconds dropped if 0
//		timeBrief: 		'[h:MM ampm]',					//1 or 2 digits for hr; seconds always dropped
														//blank if timePart() == 0
														//Noon for 12:00:00; 12 hr clock
//		timeSmart:    	'[noon]',						//blank if no timePart(); single digit hr padded
														//Noon for 12:00:00; seconds dropped if 0
						//date time
//dateTime ??
		dateTimeBrief: 	'{mm-dd-yy }[noon]',	 		//time dropped if timePart() = 0
														//Noon for 12:00; seconds always dropped
		dateTimeShort:	'{mm-dd-yyyy }HH:MM:SS',		//time always displayed with seconds
														//24 hour clock
		dateTimeLong:  	'{da mo d, yyyy }[hh:MM:ss]', 	//time dropped if timePart() = 0
														//Noon for 12:00:00
//		
		dateTimeSmart: 	'{d, yyyy }[h:MM:ss ampm]', 	//time dropped if timePart() = 0
														//Noon for 12:00:00
		dateTimeFull:	'{mm-dd-yyyy }HH:MM:SS.NNN',	//24 hour clock always show time with milliseconds
		dateTimeZone:	'{mm-dd-yyyy }HH:MM:SS.NNN ZZZ',//24 hour clock time with milliseconds and time zone

						//timestamps
		timestamp: 		'{yyyy-mm-dd.}HH:MM:SS',		//HH is 24 hour always keeps time and seconds
		timestampDate: 	'yyyy-mm-dd',					//date only never time 			 -- legacy: revizeDate
		timestampSmart:	'{yyyy-mm-dd }[HH:ss:tt.nnn]',	//time dropped if timePart() = 0 -- legacy: revizeDate
														//HH is 24 hour time; seconds dropped if 0
		timestampShort: '{yyyy-mm-dd }HH:MM',			//always keeps time without seconds
		timestampFull:	'{yyyy-mm-dd }HH:MM:SS.NNN',	//always keeps milliseconds

		timestamp_filename: 	 '{yyyy-mm-dd.}HH~MM~SS',
		timestampShort_filename: '{yyyy-mm-dd.}HH~MM',
		timestampSmart_filename: '{yyyy-mm-dd.}HH~MM~ss',
		timestampFull_filename:	 '{yyyy-mm-dd.}HH~MM~SS~NNN'								
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
				
		//var callback = options.callback[options.fn];
		//if (callback)
		//	rtnValue = callback.call(options.ctx, rtnValue);
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
		var date = this;
		var formattedDate = '';
		try
		{
			while (updateFormattedDate(date)) 				//update _formattedDate property
			{
				var formats = date.getFormats();
				var keys = Object.keys(formats);
				if (!keys.length) break;
				
				if (!args) args = [keys[0]];
				args.forEach(function(arg)					//---------------------
				{											//for each format . . .
					EZ.toArray(arg).forEach(function(fmt)	//---------------------
					{										//treat as literal if unknown fmt
						formattedDate += formats[fmt] ? date._formattedDate[fmt] : fmt;
					});
				});
				formattedDate = formattedDate || date._formattedDate[keys[0]];
				return formattedDate;
			}
		}
		catch (e)
		{
			void(0);
		}
		return formattedDate || new Date(date).toString();
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
		if (!date.isEZ || !EZ.date.formats)
			return false;
			
		var dateTime = date.getTime();					//remember value formatted
		if (date._formattedDate && date._dateTime == dateTime)
			return true;
		
		if (EZ.date.options.debug) console.clear();
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
			milliseconds: date.getMilliseconds(),
//time: dateTime,
			native: date._dateString
		}
		dt.timePart = dt.hours   * 1000 * 60 * 60
					+ dt.minutes * 1000 * 60
					+ dt.seconds * 1000
					+ dt.milliseconds;
		dt.datePart = new Date(date.getFullYear(),date.getMonth(),date.getDate()).getTime();
		dt.dateTime = dt.datePart + '.' + dt.timePart;

		dt.timeOnly = (dt.year <= 1970);
		dt.dateOnly = dt.timePart === 0 && !dt.timeOnly;
		
		dt.dateTime = (!dt.timeOnly ? dt.datePart : '')
					+ (!dt.dateOnly ? '.' + dt.timePart : '');

		if (date.getTime() <= EZ.date.options.baseDate.getTime())
			dt.year = dt.yr = dt.mm = dt.m = dt.dd = dt.d = '';		//clear date formats if only time
		
		/*TODO
		dt.dateOnly = dt.timeOnly = false;

		dt.datePart = new Date(dt.year, dt.month, dt.day).getTime();
		dt.timePart = dt.hours   * 1000 * 60 * 60
					+ dt.minutes * 1000 * 60
					+ dt.seconds * 1000
					+ dt.milliseconds;
		if (dateTime < EZ.date.options.baseDate.getTime())	//clear date formats if only time
		{	
			dt.timeOnly = true;
			dt.datePart = dt.year = dt.month = dt.day = dt.mm = dt.m = dt.dd = dt.d = 0;		
			//dt.hours = dt.minutes = dt.seconds = dt.milliseconds = 0;
		}
		else if (dt.timePart === 0)	
			dt.dateOnly = true;
			
		dt.dateTime = dt.dateOnly + '.' + dt.timeOnly;
		*/

		  //----------------------\\
		 //----- date formats -----\\
		//--------------------------\\
		dt.da = dt.dayName.substr(0,3);
		dt.mo = dt.monthName.substr(0,3);
		
		dt.yyyy = dt.year + '';
		dt.yy = dt.yyyy.right(2);
		dt.mm = ('0'+(dt.month+1)).right(2);
		dt.m = dt.month + '';
		dt.dd = ('0'+dt.day).right(2);
		dt.d = dt.day + '';
		dt.daySuffix = dt.day.suffix();


		  //----------------------\\
		 //----- time formats -----\\
		//--------------------------\\
		dt.ZZZZ = dt.zzzz = date._dateString.matchPlus(/\(([A-Za-z\s].*)\)/)[1];
		dt.ZZZ = dt.zzz = dt.zzzz.replace(/[a-z\W]/g, '');	

		dt.HH = ('0' + dt.hours).right(2);
		dt.HR = dt.HH.replace(/^0/, '_');
		dt.H = dt.HH.replace(/^0/, '');
				 
		dt.hh = dt.HH > 12 ? '0' + (dt.hours - 12) 
			  : dt.HH == '00' ? '12'
			  : dt.HH;
		dt.hr = dt.hh.replace(/^0/, '_');
		dt.h = dt.hh.replace(/^0/, '');

		dt.MM = ('0' + dt.minutes).right(2);
		dt.M = dt.MM.replace(/^0/, '');

		dt.TT = ('0' + dt.seconds).right(2);
		dt.T = dt.TT.replace(/^0/, '');
		
		dt.t = (dt.seconds + dt.milliseconds) ? dt.T : '';
		dt.tt = (dt.seconds + dt.milliseconds) ? dt.TT : '';

		dt.seconds = (dt.seconds + dt.milliseconds / 1000).toInt();
		dt.SS = ('0' + dt.seconds).right(2);
		dt.S = dt.SS.replace(/^0/, '');
		
		dt.ss = dt.seconds ? dt.SS : ''
		dt.s = dt.seconds ? dt.S : ''
		
		dt.NNN = ('000' + dt.milliseconds).right(3);
		dt.nnn = dt.milliseconds ? dt.NNN : '';
		
		dt.AMPM = (dt.hours < 12) ? 'am' : 'pm';

		dt.noon = dt.midnight = dt.hr + ':' + dt.MM + ' ' + dt.AMPM;
		dt.NOON = dt.MIDNIGHT = dt.HR + ':' + dt.MM + ':' + dt.SS;
	
		dt.noon = dt.midnight = dt.noon.replace(/12:00 pm/i,'Noon');
		dt.NOON = dt.MIDNIGHT = dt.NOON.replace(/12:00:00/i,'Noon');
		
		dt.noon = dt.midnight = dt.midnight.replace(/12:00 am/i,'Midnight');
		dt.NOON = dt.MIDNIGHT = dt.MIDNIGHT.replace(/_0:00:00/i,'Midnight');
		if (!dt.timeOnly)	//noon and NOON blank for midnight if not timeOnly
		{
			dt.noon = dt.noon.replace(/Midnight/, '');
			dt.NOON = dt.NOON.replace(/Midnight/, '');
		}
			
		  //--------------------------------\\
		 //----- create formatted dates -----\\
		//------------------------------------\\
		var formats = {}
		var defaultFormats = EZ.defaultOptions.date.formats;
		
		var keys = Object.keys(defaultFormats).sort(sortByLength);
		keys.forEach(function(key)						//-----------------------------
		{												//set all base/dt format values
			var value = defaultFormats[key];			//-----------------------------
			if (dt[value] == null) return;
			
			formats[key] = dt[key] + '';					
		//	if (dt[value] == null)			
		//		dt[value] = value;			
		});
		e = logFormats('baseFormats');
		
		keys = Object.keys(defaultFormats).remove(Object.keys(formats))
		keys.forEach(function(key)						//----------------------------
		{												//set remaining defaultFormats
			var value = defaultFormats[key];			//----------------------------
			formats[key] = setFormat(key,value);		//apply all other key/values
		});
		e = logFormats('defaultFormats');

		var dateFormats = date.getFormats();			//get format list for this date
		var formatList = Object.keys(dateFormats);			
		
		formatList.remove(Object.keys(formats)).forEach(function(key)
		{												//-------------------------
			var value = dateFormats[key];				//set custom formats if any
			formats[key] = setFormat(key,value);		//----------------------------
		});
		e = logFormats('custom Formats');

		date._formattedDate = {};						//recreate _formattedDate property
		formatList.forEach(function(key)				//-------------------------
		{												//copy formats in date list
			date._formattedDate[key] = getFormat(key);	//--------------------------
		});
		e = logFormats('savedFormats', date._formattedDate);
		
		date._dateTime = dateTime;
		//======================
		return true;
		//======================
		//________________________________________________________________________________________
		/**
		 *	- trim leading and trailing spaces or non-numeric, non-alpha characters
		 *	- collapse multiple spaces or any other non-numeric, non-alpha break char
		 *	  to first character.
		 *	- replace "_" or "&" placeholder at start of format with space or "&nbsp;"
		 *	  respectively.	 
		 *	- remove time if no timepart and format contain $
		 */
		function getFormat(key)
		{	
			var value = formats[key];
			if (typeof(value) != 'string') return value;
			if ('native'.includes[key])
				return value;
			
			value = (dt.timeOnly) ? value.replace(/\{[^}].*\}/g, '')	//remove {...} when time only
								  : value.replace(/[{}]/g, '');			//otherwise remove { and }

			value = (dt.dateOnly) ? value.replace(/\[[^}].*\]/g, '')	//remove [...] when date only
								  : value.replace(/[[\]]/g, '');		//otherwise remove [ and ]
			
			value = value.replace(/[:.]+(?!\d)/g, ''); 					//remove separator w/o # prefix
			value = value.replace(/([^\d])[^\w\s_,]+/g, '');			//or suffix e.g. "1:00:" --> "1:00"
			

			value = value.replace(/ +/g, ' ');							//collapse whitespace to single space
			value = value.trim(); //.trimPlus(/[^\w\d_]/);
			
			value = value.replace(/^_/, ' ');
			//value = value.replace(/^_/, '');
			return value;
		}
		//________________________________________________________________________________________
		/**
		 *	replace references in value to other format keys.
		 */
		function setFormat(key, value)
		{
			var keys = Object.keys(formats); //.sort(sortByLength);
			keys.remove(key,'$').forEach(function(key)
			{
				var regex = RegExp( '\\b' + key + '\\b', '');
				var val = 'xyz' + formats[key] + 'xyz';
				var v=value
				value = value.replace(regex, val);
				if (v != value)
					void(0)
			});
			//======================
			if (value.includes('xyz'))
				void(0)
			return value.replace(/xyz/g, '');
			//======================
		}
		//________________________________________________________________________________________
		/**
		 *	sort Array of keys by length of key.
		 */
		function sortByLength(a, b)
		{	
			return (a.length > b.length) ? -1
				 : (a.length < b.length) ? 1
				 : 0;
		}
		//________________________________________________________________________________________
		/**
		 *	debugging
		 */
		function logFormats(note, fmt)
		{	
			if (!EZ.date.options.debug) return;

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

		date._options = EZ.mergeAll(EZ.date.options);	//init date._options
		date._options.formats = EZ.mergeAll(EZ.date.formats);
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
					if (dateStr === '')			//if blank string, lookup override default
					{
						return EZ.date.options.asNow.includes('') ? new Date()
							 : EZ.date.options.asNull.includes('') ? new Date(null)
							 : new Date('');	//invalid
					}
					if (EZ.date.options.dateString)
					{
						var now = EZ.date.options.now 			//use now option set by test script
								|| new Date();					//otherwise current date/time

						if (dateStr.includes('today'))			//create date for today w/o time
							return new Date(now.getFullYear(),now.getMonth(),now.getDate());
						
						if (dateStr.includes('now'))			//set date as current time w/o date
						{
							var baseDate = new Date(EZ.date.options.baseDate);
							var day = baseDate.getDate(),
								month = baseDate.getMonth(),
								year = baseDate.getFullYear(),
								hours = now.getHours(),
								minutes = now.getMinutes(),
								seconds = now.getSeconds(),
								ms = now.getMilliseconds()
							return new Date(year,month,day,hours,minutes,seconds,ms);
						}
					}
					break;
				}
				case 'Undefined':			//treat undefined as null ??
				{
					return EZ.date.options.asNow.includes(undefined) ? new Date()
						 : EZ.date.options.asNull.includes(undefined) ? new Date(null)
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
			
			while (EZ.date.options.dateString)
			{
				dateStr = dateStr.trim();
				dateStr = dateStr.replace(/(\d)\-(\d)/g,'$1/$2');
				if (EZ.date.options.dateString !== true) break;
				
				dateStr = dateStr.replace(/(\d{1,2}\/\d{1,2}\/)(\d{2})(?!\d)/, '$120$2');
			
				dateStr = dateStr.replace(/Noon/i,'12:00pm');
				dateStr = dateStr.replace(/Midnight/i,'12:00am');


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
				break;
			}
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

				else if (EZ.date.options.callback)			//otherwise if callback enabled
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
				if (!EZ.date.options)
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
//		if (EZ.date.options.debug) console.log(options);

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
		var date = EZ.date(this.getFullYear(),this.getMonth(),this.getDate())
		return date;
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
	 *	called before createDate() when EZ.date.options undefined
	 *	-initialize EZ.date.options to EZ.defaultOptions.date clone
	 *	-populated EZ.date.fnMap with internal functions
	 */
	function dateSetup()
	{
		EZ.date.options = EZ.defaultOptions.date.removeKeys('formats');
		EZ.date.formats = EZ.mergeAll(EZ.defaultOptions.date.formats);
		
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
	if (!EZ.date.options) EZ.date();	//always defined if date
	var formatOptions = this.isEZ ? this._options.formats || {} : EZ.date.formats;

	var formats = {};
	var keys = formatNames || Object.keys(formatOptions);	
	EZ.toArray(keys, ', ').removeDups(true).forEach(function(key)
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
EZ.date.setFormats = function EZdate_setFormats(formats, isReset)
{
	if (!EZ.date.options) EZ.date();	//always defined if date
	var formatOptions = this.isEZ ? this._options.formats || {} : EZ.date.formats;	
	if (isReset && !this.isEZ)			//reset EZ.date formats to default values
		 formatOptions = EZ.date.formats = EZ.mergeAll(EZ.defaultOptions.date.formats);

	
	var defaultFormats = EZ.defaultOptions.date.formats;
	formats = formats || defaultFormats;

	for (var key in formats)
		formatOptions[key] = formats[key] || defaultFormats[key] || '';
	
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
	if (!EZ.date.options) EZ.date();	//always defined if date
	var formatOptions = this.isEZ ? this._options.formats || {} : EZ.date.formats;	

	var keys = formatNames || Object.keys(EZ.date.getFormats());	
	EZ.toArray(keys, ', ').forEach(function(key)
	{
		delete formatOptions[key];
	});
	if (this.isEZ)
		this.updateFormattedDate();
	
	//return this.getFormats();
	return EZ.mergeAll(formatOptions);
}
/*---------------------------------------------------------------------------------------------
EZ.date.getOptions(keys)

return value of option of specified by key.

ARGUMENTS:
	key		(String) specifies options keys

RETURNS:
	Object containing all options or only specified option values.
---------------------------------------------------------------------------------------------*/
EZ.date.getOptions = function EZdate_getOptions(keys)
{
	if (!EZ.date.options) EZ.date();	//always defined if date
	
	var options = {};
	var currentOptions = this.isEZ ? this._options : EZ.date.options;

	var keys = EZ.isObject(keys) ? Object.keys(currentOptions) : EZ.toArray(keys, ', ');
	keys.forEach(function(key)
	{
		if (options[key])
			options[key] = currentOptions[key];
	});
	return options;
}
/*---------------------------------------------------------------------------------------------
EZ.date.setOption(optionValues)

Set one or more options to new values specified as key / value pairs.

ARGUMENTS:
	optionValues	object containing key / values to set -- required for date instance
					if not supplied, all options (except formats) set to default values.
					use setFormats() to change formats
RETURNS:
	Object containing all options after new values set.
---------------------------------------------------------------------------------------------*/
EZ.date.setOptions = function EZdate_setOptions(optionValues, isReset)
{
	if (!EZ.date.options) EZ.date();	//always defined if date
	var options = this.isEZ ? this._options : EZ.date.options;
	if (isReset && !this.isEZ)			//reset EZ.date.options to default values
		 options = EZ.date.options = EZ.mergeAll(EZ.defaultOptions.date.removeKeys('formats'));
	
	if (!EZ.isObject(optionValues))
		optionValues = (this.isEZ) ? {} : EZ.defaultOptions.date;
	
	Object.keys(optionValues).remove('formats').remove().forEach(function(key)
	{
		options[key] = optionValues[key];
	});
	return EZ.mergeAll(options);
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
	var formatted = {									//all dates are blank if no date component...
		briefDate:		'mm-dd-yy',						//2 digits for month, day & year
		shortDate:		'mm-dd-yyyy',					//2 digits for month & day; 4 digit year
		longDate:	 	'wwww mmmm d, yyyy',			//full day name & month name e.g. Monday January
		smartDate:		'mmm d, yyyy',					//3 char day of week (use substr(4) to omit or replace)
		revizeDate:		'yyyy-mm-dd',					//4 digit year, 2 digit month and day

		month:			'mm',							//2 digit month 01-12
		minutes:		'MM*',							//2 digit minutes
		seconds:		'ss*',							//2 digit seconds
		hours:			'h',							//1 or 2 digit hour; 12 hr clock
		hoursPadded:	'h',							//hours with &nbsp;&nbsp prefix if single digit
														//single digit prefixed with ' &nbsp'
														//Noon for 12:00:00; Midnight for 00:00:00

		hours12:		'hh',							//2 digit hours 12 hour format
		hours24:		'hh',							//2 digit hours 24 hour clock
		ampm:			'am/pm',						//am or pm

		day:			'dd',							//2 digit day 01-31
		daySuffix:		'ST',							//st, nd ... th
		dayLong:		'dST',							//1-2 digit: 1st, 2nd.. 30th

		dayName:     	'WWWW',							//full name of day e.g. Monday
		monthName:   	'mmmm',							//full name of month e.g. January

		briefTime: 		'[hh:MM am/pm]',				//2 digits for hr; seconds always dropped
														//blank if timePart() == 0
														//Noon for 12:00:00; 12 hr clock
		shortTime: 		'hh:MM[:ss]',					//always 2 digits for hour; seconds dropped if 0
														//24 hour clock (hours are 00-23)
		longTime: 		'MIDNIGHT*',					//2 digits for hr; seconds always displayed
					//EZ HH:MM:SS AMPM					//  Noon for 12:00:00; Midnight for 00:00:00
		
		miniTime:		'hh:MM{:ss] am/pm',				//same as longTime except seconds dropped if 0
														//Noon for 12:00:00; Midnight for 00:00:00
		ampmTime: 		'hh:MM{:ss] am/pm',				//same as longTime except seconds dropped if 0
														//does not use noon or midnight
		smartTime:    	' h:MM:ss am/pm',				//blank if no timePart(); single digit padded
														//Noon for 12:00:00; seconds dropped if 0
														//12 hour clock
		timeZone:		'zzzz',							//as shown in new Date().toString()
														//varies by browser

		briefDateTime: 	'mm-dd-yy [hh:mm am/pm]', 		//time dropped if timePart() = 0
														//Noon for 12:00; seconds always dropped
		shortDateTime:	'mm-dd-yyyy hh:MM:ss',		    //time always displayed with seconds
													    //24 hour clock
		longDateTime:  	'wwww mmm d, yyyy hh:MM:ss zzzz', //time dropped if timePart() = 0
														//Noon for 12:00:00
		smartDateTime: 	' d, yyyy [h:mm:ss am/pm zzzz]', //time dropped if timePart() = 0
														//Noon for 12:00:00
		revizeDateTime:	'yyyy-mm-dd hh:MM:ss',			//time dropped if timePart() = 0
														//hh is 24 hour time; seconds dropped if 0
		shortDateBriefTime: '',
		formattedTime:  0								//getTime() value used for all formatted
	}
	EZ.trace('RZdate formats', formatted);

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
//=============================================================================================
/*------------------------*/
/*BOOKMARK EZ.date tests */
/*----------------------*/
//=============================================================================================
EZ.date.test = function()
{
	var date, ex = 'na', exfn = exfn, note = '';

	var options = EZ.date.getOptions();
	var formats = EZ.date.getFormats();

	EZ.date.setOptions();		//restore default options
	EZ.date.setOptions( 		//set test options
	{
		now: new Date("02/29/2016 12:00:00.010 am")
	});
	
	var final = function()		//restore options and formats to prior values
	{
		EZ.date.setOptions(options, true);
		EZ.date.setFormats(formats, true);
	}
	EZ.test.settings({final: final});
	//______________________________________________________________________________
	note = 'default options createDate variants'
	ex = 'mm dd yyyy h hh HH'
	   + ' dateBrief dateLong dateLonger dateShort'
	   + ' time noon NOON midnight MIDNIGHT timeLong timeShort'
	
	testSetup("02-29-2016");
	EZ.test.run(date);
//return
	
	testSetup("02-29-2016 11:30");
	EZ.test.run(date);
	
	testSetup("02-29-2016 noon");
	EZ.test.run(date);
	
	testSetup("02-29-2016 1:15pm");
	EZ.test.run(date);
	
	testSetup("02-29-2016 1:15:30pm");
	EZ.test.run(date);
	
	ex += ' timeFull timeLong'
	testSetup("02-29-2016 12:00:00.010 am");
	EZ.test.run(date);
	
	ex = 'time noon midnight timeFull timeLong timeShort'
	testSetup(" 1:15pm");
	EZ.test.run(date);
	
	//______________________________________________________________________________
	note = 'basic test and initial challenges'
	ex = 'seconds milliseconds SS 00 s t 0 nnn '
	   + 'noon NOON midnight MIDNIGHT timeLong timeFull time';
	testSetup();
	EZ.test.run("02-28-2016 1:22:00.877");
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	ex = 'seconds milliseconds SS S ss s tt t nnn NNN '
	   + 'noon NOON midnight MIDNIGHT timeLong'
	testSetup();
	EZ.test.run("02-28-2016 1:22:00");
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	ex = 'noon NOON midnight MIDNIGHT timeLong'
	   + ' zzz zzzz ZZZ ZZZZ timePart'
	testSetup();
	EZ.test.run("02-28-2016");
	
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	ex = 'h H hr seconds milliseconds '
	   + 'noon NOON midnight MIDNIGHT timeLong timeFull'
	   + ' zzz zzzz ZZZ ZZZZ timePart'
	testSetup();
	EZ.test.run("02-28-2016 noon");
		
	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	ex = 'h H hr seconds milliseconds '
	   + 'noon NOON midnight MIDNIGHT timeLong timeFull'
	testSetup();
	EZ.test.run("02-28-2016 12:01");
	
	//______________________________________________________________________________
	note = 'complex times'
	
	ex = 'time noon NOON MIDNIGHT timeFull timeLong timeShort'
	testSetup();
	EZ.test.run("02-28-2016 13:22:00.877");
	
	testSetup();
	EZ.test.run('12:00:01');
	
	testSetup();
	EZ.test.run('12:00:00.500');
	
	testSetup();
	EZ.test.run('Noon');
	
	testSetup();
	EZ.test.run('1:22 pm');

	//______________________________________________________________________________
	note = 'all formats'
	ex = '';
	
	testSetup();
	EZ.test.run("02-28-2016 03:22:00.877 am");
	
	//______________________________________________________________________________
	note = 'enhanced dateStr parsing'
	ex = 'time noon NOON MIDNIGHT timeFull timeLong timeShort dateTime'
	
	var now = new Date('03/22/2016 13:21')
	EZ.date.setOptions( {now: now} );
	
	testSetup();
	EZ.test.run(null);
	
	testSetup();
	EZ.test.run(undefined);
		
	testSetup();
	EZ.test.run("NOON");
	
	testSetup();
	EZ.test.run("midnight");

	testSetup();
	EZ.test.run("now");
	
	testSetup();
	EZ.test.run("today");
	
	//______________________________________________________________________________
	note = 'blank, undefined same as new Date(null)'
	
	testSetup(null);
	EZ.test.run(date);
	
	testSetup("");
	EZ.test.run(date);
	
	testSetup(undefined);
	EZ.test.run(date);
	
	note = 'invalid date returns null'
	testSetup('invalid');
	EZ.test.run(date);
	
	//______________________________________________________________________________

	note = 'null, blank, undefined same as new Date()\n'
		 + 'test uses ' + date + ' as new Date()'
	
	testSetup(null);
	EZ.test.run(date);
	
	testSetup("");
	EZ.test.run(date);
	
	testSetup(undefined);
	EZ.test.run(date);
	
	//______________________________________________________________________________
	note = 'native options: blank, undefined, noon\n returned as invalid Date'
	
	EZ.date.setOptions({dateString:'', asNow:[], asNull:[], invalidDate: new Date('')})
	ex = '$';
	
	testSetup('noon');
	EZ.test.run(date);
	
	testSetup('');
	EZ.test.run(date);
	
	testSetup(undefined);
	EZ.test.run(date);

	EZ.date.setOptions();	//reset defaults
	
	//______________________________________________________________________________
	note = 'default options -- invalid dates -- returned as null'
	ex = '$';
	
	testSetup({});
	EZ.test.run(date);
	
	testSetup([]);
	EZ.test.run(date);
	
	testSetup(true);
	EZ.test.run(date);
	
	testSetup(false);
	EZ.test.run(date);
	
	testSetup(NaN);
	EZ.test.run(date);

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	//______________________________________________________________________________
	
	
	/*global ezdate:true */
	/**
	 *	set results to formats _formattedDate property
	 */
	function exfn(results, testrun)
	{
		ezdate = results;
		if (!results) return;
		testrun.results = results._formattedDate || '_formattedDate is undefined';
	}
	function testSetup(dateStr)
	{
		date = dateStr || date;
		var n = note;

		EZ.date.setFormats();								//restore default formats
		if (ex)
		{
			var keys = EZ.isObject(ex) ? Object.keys(ex)	//get test formats
					 : EZ.toArray(ex, ' ');
			keys.unshift('$');

			var fmt = EZ.date.getFormats(keys)
			EZ.date.removeFormats();						//remove all formats		
			EZ.date.setFormats(fmt);						//add specified test formats
			n += EZ.stringify(fmt,'*').substr(1).clip()
		}
		EZ.test.options({exfn:exfn, note:n})
	}
	return;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
if (EZ && EZ.global && EZ.global.setup) EZ.global.setup('EZ', 'EZdate');
