/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
EZ.options.date = {
	callback: false,		//false disables callback
	override: false,
	asNull: 'undefined',
	invalidDate: null,
	baseDate: new Date('1/1/1970'),
	formats: null,
	baseFormats: //base formats must be set in following order:
			   ('month noon NOON midnight MIDNIGHT zoneFull zone min sec ampm AMPM'
			   + ' yyyy year yr dd da mo dayNth day mm m d'
			   + ' hr hh h HH H MM M SS S ss s tt t nnn NNN').split(' '), 
	defaultFormats:			
	{					//dates -- all formats blank if no date component (i.e. date <= 1/1/1970)			

		d:				'd',							//2 digit day of month
		dd:				'dd',							//2 digit day of month
		da:				"dayName",						//full day of Week e.g. "Sunday"
		day:			"dayName.substr(0,3)",			//3 char day of week e.g. "Sun"
		dayNth:			"daySuffix",					//day of month with suffix e.g. 1st, 2nd 9th
		
		m:				'm',							//1 or 2 digit day of month: 1, 2 ... 12
		mm:				'mm',							//2 digit day of month: 01, 02 ... 12
		mo:				"monthName.substr(0,3)",		//3 char month name e.g. "Jan"
		month:			"monthName",					//full month name e.g. "January"
		
		yr:				"yyyy.right(2)",				//2 digit year
		year:			"yyyy",							//4 digit year
		yyyy:			"yyyy",							//4 digit year
		
		dateBrief:		'mm-dd-yr',						//2 digits for month, day & year
		dateShort:		'mm-dd-yyyy',					//2 digits for month & day; 4 digit year
		dateLong:	 	'day month dayNth, yyyy',		//full day of week, month name, day of month with suffix 
														//  4 digit year: e.g. Sunday January 3rd, 2016
														//  e.g. Monday January
		dateSmart:		'da mo d, yyyy',				//3 char day of week and month name, 1 or 2 digit day
														//  of month, 4 digit year: e.g. Sun Jan 3, 2016
														//	tip: use substr(4) to omit day of week
						//times
//		HR:				'HR',							//always 1 or 2 digit hour (24 hour clock): 1 ... 23
		hr:				'h',							//always 1 or 2 digit hour (12 hour clock): 0 ... 12
		min:			'M',							//always 1 or 2 digit seconds: 0 ... 59
		sec:			's',							//always 1 or 2 digit seconds: 0 ... 59
		ampm:			"' ' + ampm",							//either " am" or " pm"
		AMPM:			"' ' + ampm.toUpperCase()",			//either " AM" or " PM"
		
		h:				"hours ? h : ''",				//1 or 2 digit hour if > 0 (12 hour clock): 1 ... 12
		hh:				'hh',							//2 digit hour (12 hour clock): 00, 02 ... 12
		H:				"hours ? H : ''",							//1 or 2 digit hour if > 0 (24 hour clock): 01 ... 23
		HH:				'HH',							//always 2 digit hour (24 hour clock): 00 ... 23
		M:				"minutes ? M : ''",				//1 or 2 digit minutes if > 0: 1 ... 59
		MM:				'MM',							//always 2 digit minutes: 0 ... 59
		s:				"seconds ? S : ''",				//1 or 2 digit seconds if > 0 : 0 ... 59
		ss:				'ss',							//2 digit seconds if > 0 : 1 ... 59
		S:				'S',							//always 1 or 2 digit seconds: 0, 1 ... 59
		SS:				'SS',							//always 2 digit seconds: 00, 01 ... 59
		t:				"t",							//1 or 2 digit seconds if > 0 or millisecond > 0
		tt:				'tt',							//2 digit if seconds if > 0 or millisecond > 0
		nnn:			"nnn ? '.' + nnn : ''",			//3 digit millisecond with "." prexix if > 0 else blank
		NNN:			"NNN",							//always 3 digit millisecond no prexix
		
		noon:			"noon",							//12 hour clock; blank if time part is 0 otherwise 
														// 1 or 2 digit hr, 2 digit minutes, no seconds
														// "noon" if 12:00 else  am or pm suffix 
														// e.g. "1:00 am", "noon" "12:01 pm", "11:59 pm" 
		NOON:			"noon.replace(/^/g, '&')",	
		midnight:		"midnight",						//same as noon except "midnight" if time part is 0
		MIDNIGHT:		"midnight.replace(/^/g, '&')",	
		
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
		timeLong: 		'midnight:SS ampm',					//1 or 2 digits for hr; seconds always displayed
														//Noon for 12:00:00; Midnight for 00:00:00
		timeMini:		'midnight:ss ampm',					//same as long except seconds dropped if 0
														//Noon for 12:00:00; Midnight for 00:00:00
		timeShort: 		'HH:MM:ss',						//always 2 digits for hour; seconds dropped if 0
														//24 hour clock (hours are 00-23)
		timeSmart:    	'noon:ss ampm',					//blank if no timePart(); single digit hr padded
														//Noon for 12:00:00; seconds dropped if 0
						//date time
		dateTimeBrief: 	'mm-dd-yy noon ampm',	 		//time dropped if timePart() = 0
														//Noon for 12:00; seconds always dropped
		dateTimeShort:	'mm-dd-yyyy HH:MM:SS',		    //time always displayed with seconds
														//24 hour clock
		dateTimeLong:  	'da mo d, yyyy hh:MM:ss', 	//time dropped if timePart() = 0
														//Noon for 12:00:00
//		dateTimeSmart: 	'd, yyyy h:MM:ss ampm', 		//time dropped if timePart() = 0
														//Noon for 12:00:00
		dateTimeFull:	'mm-dd-yyyy HH:MM:SS.NNN',	    //24 hour clock always show time with milliseconds
		dateTimeAll:	'mm-dd-yyyy HH:MM:SS.NNN zone', //24 hour clock time with milliseconds and time zone

						//timestamps
		timestamp: 		'yyyy-mm-dd.HH:MM:SS',			//HH is 24 hour always keeps time and seconds
		timestampDate: 	'yyyy-mm-dd',					//date only never time 			 -- legacy: revizeDate
		timestampSmart:	'yyyy-mm-dd HH:ss:tt.nnn',			//time dropped if timePart() = 0 -- legacy: revizeDate
														//HH is 24 hour time; seconds dropped if 0
		timestampShort: 'yyyy-mm-dd HH:MM',				//always keeps time without seconds
		timestampFull:	'yyyy-mm-dd HH:MM:SS~NNN',		//always keeps milliseconds

		timestamp_filename: 	 'yyyy-mm-dd.HH~MM~SS',
		timestampShort_filename: 'yyyy-mm-dd.HH~MM',
		timestampSmart_filename: 'yyyy-mm-dd.HH~MM~ss',
		timestampFull_filename:	 'yyyy-mm-dd.HH~MM~SS~NNN',
								
						//default format 				//12 hr clock with am/pm drops time if 0
		'*': 'mm-dd-yyyy hh:MM:tt.nnn ampm'				//drops seconds and milliseconds if both 0
	}
}
/*---------------------------------------------------------------------------------------------
Extended Date class to supports dashes "-" in constructor for FF & Chrome:
	.e.g. new EZ.date('12-21-2012')

Plus additional properties and methods.
The builtin Date() object is not extended to avoid different behavior caused
by adding prototypes directly.

var me = arguments.callee;
---------------------------------------------------------------------------------------------*/
EZ.date = function EZdate(options)
{	
	var options = getDateOptions(this, arguments);
	if (options.message)
		return options.message;

	var rtnValue = options.rtnValue;
	///if(EZ.start(options)))
	{
		rtnValue = EZ.date.theFn.apply(options.ctx, options.args);
		if (EZ.options.date.callback && options.callback[fn])
			rtnValue = options.callback[fn].call(options.ctx, rtnValue);
	}
	//=====================
	return rtnValue
///	return EZ.finish(rtnValue);
	//=====================
	
	/**
	 *
	 */
	function _toString(args)
	{	
		var e;
		try
		{
			if (this._formattedDate.formattedTime != this.getTime())
				this.updateFormattedDate()				//update _formattedDate property if not current
			
			var date = this;
			var formats = _getFormats_();
			var formattedDate = '';
			if (args === undefined) args = '*';
			args.split(' ').forEach(function(format)			//find 1st valid format specified as argumnent
			{
				formattedDate += format === '' ? '*'
				               : formats[format] ? date._formattedDate[format] 
				               : format;
			});
			return formattedDate || date._formattedDate['*'];		//return formatted date
		}
		catch (e)
		{
			return this.toStringDefault();
		}
	}

//____________________________________________________________________________________________
/**
 *	function getFormats() -- static -- but most ofter referenced
 *
 *	Return new object containing available formats as keys and value representing format.
 */
function _getFormats_()
{
	return EZ.date == this ? window.EZ.options.date.formats
						   : window.EZ.options.date.formats;
}
	//____________________________________________________________________________________________
	/**
	 *	function updateFormattedDate()
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
	function _updateFormattedDate()
	{
		var dateTime = this.getTime();					//remember value formatted
		var dateString = new Date(this).toString();		//native toString()
		
		  //----------------------\\
		 //----- date formats -----\\
		//--------------------------\\
		var day = this.getDate();
		var month = this.getMonth();
		var year = this.getFullYear();
		
		var monthName = this.getMonthName();
		var dayName = this.getDayName();
		var daySuffix = day.right(1) == 1 ? 'st'
					  : day.right(1) == 2 ? 'nd'
					  : day.right(1) == 3 ? 'rd'
					  : 'th';
		
		var yyyy = year + '';
		var mm = ('0'+(month+1)).right(2);
		var m = month + '';
		var dd = ('0'+day).right(2);
		var d = day + '';

		if (this.getTime() <= EZ.options.date.baseDate.getTime())
			year = mm = m = dd = d = '';				//clear date formats if only time

		  //----------------------\\
		 //----- time formats -----\\
		//--------------------------\\
		var hours = this.getHours();
		var minutes = this.getMinutes();
		var seconds = this.getSeconds();
		var milliseconds = this.getMilliseconds();
		
		var zoneFull = dateString.matchPlus(/\(([A-Za-z\s].*)\)/)[1];
		var zone = zoneFull.replace(/[a-z\W]/g, '');		

		var HH = ('0' + hours).right(2);
		var H = hours + '';
		var h = (hours <= 12 ? hours : hours - 12) + '';
		var hh = ('0'+ h).right(2);

		var MM = ('0' + minutes).right(2);
		var M = minutes + '';
		
		var SS = ('0' + seconds).right(2);
		var S = seconds + '';
		var ss = seconds ? SS : ''
		var s = seconds ? S : ''
		var t = (seconds + milliseconds) ? S : '';
		var tt = (seconds + milliseconds) ? SS : '';
		
		var NNN = ('000' + milliseconds).right(3);
		var nnn = milliseconds ? NNN : '';
		
		var ampm = (hours < 12) ? 'am' : 'pm';
		var AMPM = ampm.toUpperCase()

		var noon = ((hours + minutes) > 0) ? HH + ':' + MM + ampm : '';
		if (hours && hours < 10) 
			noon = ' ' + noon;
		var midnight = noon;
		noon = noon.replace(/12:00 am/i,'midnight');
		noon = noon.replace(/12:00 pm/i,'noon');

		  //--------------------------------\\
		 //----- create formatted dates -----\\
		//------------------------------------\\
		var options = EZ.options.date;
		var formats = {}
		options.baseFormats.forEach(function(key)
		{												//set all base formats
			var value = options.defaultFormats[key];
			formats[key] = eval(value);
		});
		for (var fmt in options.defaultFormats)			//set all default formats
		{
			if (options.baseFormats.includes(fmt)) continue;
			var format = options.defaultFormats[fmt];
var val = format			
			for (var key in formats)
			{
				format = format.replace(RegExp(key, 'g'), formats[key] + '\\');
				if (val != format) debugger;
				val = format;
			}
			formats[fmt] = format;
		}
		
		var dateFormats = EZ.date('@getFormats');		//get formats for this date
		var formatList = Object.keys(dateFormats);			
		formatList.remove(Object.keys(formatList)).forEach(function(key)
		{												//set custom formats
			var format = dateFormats[key];
			for (var fmt in formats)
			{
				var regex = fmt.replace(RegExp('([*])', 'g'), '\\$1');
				format = format.replace(regex, formats[fmt])			
			}
			formats[key] = format;
		});

		this._formattedDate = {							//recreate _formattedDate property
			dateTime: dateTime,				
			dateString: dateString				
		};
		for (var key in formats)						//append any formats in date list
			if (!formatList.includes(key))		
				this._formattedDate[key] = trimFormat(formats[key]);
		//======================
		return this;
		//======================
		/**
		//compound times: built from one or more of above time formats
		//	leading and trailing spaces or non-numeric, non-alpha characters TRIMMED after 
		//	all above base formats applied except as noted below.
		//	multiple space or any other non-numeric, non-alpha break characters collapsed
		//	to single occurance except as noted below.
		//
		//EXCEPTIONS:
		//	noon or NOON retain blank or &nbsp; prefix respectivly when timepart is not 0 
		//	midnight OR MIDNIGHT ALWAYS retains blank or &nbsp; prefix
		*/
		function trimFormat(value)
		{	
			if (value == undefined)
				return value;
			value = value.replace(/([^\w\d^& ]{2,})/g, function(all,dups) 
			{
				return dups.substr(0,1)
			});
			value = value.replace(/([\W\D]\s+)/, function() {return ' '} );
			
			value = value.trim().trimPlus(/[^\w\d^&]/);
			value = value.replace(/^^/, ' ').replace(/^&/, '&nbsp;');
			return value;
		}
	}
	//____________________________________________________________________________________________
	/**
	 *	createDate(year,month,day,hours,minutes,seconds,ms)
	 *
	 *	Create new Date() Object with additional properties and functions.
	 *	saves default toString() as toStringDefault() -- also accessible with toString('default')
	 */
	function _createDate_(year,month,day,hours,minutes,seconds,ms)
	{
		var date = new Date(null);
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
			return null;							//return null for invalid date

		date.toStringDefault = date.toString;		//copy native Date.toString()
		date.toString = EZ.date.bind(date, '@toString');

		for (var fn in EZ.date.fn.bound)			//bind our date functions
			date[fn] = EZ.date.fn.bound[fn].bind(date);

		for (fn in EZ.date.fn.proto)				//alse attach our static functions
			date[fn] = EZ.date.fn.proto[fn].bind(EZ.date);

		date._options = EZ.mergeAll(EZ.options.date);

		date._formattedDate = EZ.date('@getFormats');	//get all curenltly defined formats
		date.isEZ = date.updateFormattedDate.call(date);

		//==================
		options.ctx = date;
		return date;
		//==================
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
					if (dateStr) break;		//treat empty String as null -- native returns invalid date

				case 'Undefined':			//treat undefined as null ??
				///	dateStr = null;

				case 'Null': 				//resolves as 12-31-1969 -- less than any real dates
				case 'Boolean': 			//treated same as native -- resolves to now

				case 'Number':
				case 'Date':
				default:
					return new Date(dateStr);

			}
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
			dateStr = dateStr.replace(/(\d{1,2}\/\d{1,2})(?!\d)/, '$1/' + new Date().getFullYear());
			if (!/\d{1,2}\/\d{1,2}\/\d/.test(dateStr))						//MM/yyyy --> MM/1/yyyy 1st day of month
				dateStr = dateStr.replace(/(\d{1,2})\/(\d{4})/, '$1/1/$2');

			dateStr = dateStr.replace(/(\d{4})\/(\d{1,2})(?!\/)/, '$2/1/$1');		//yyyy/MM --> MM/1/yyyy
			dateStr = dateStr.replace(/(\d{4})\/(\d{1,2}\/\d{1,2})(?!\/)/,'$2/$1');	//yyyy/MM/dd --> MM/dd/yyyy
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
	/**
	 *
	 */
	function getDateOptions(date, args)
	{
		if (typeof(date) == 'object' && date.exception) return date;
		if (EZ.options.date.formats == null)
			setup();
		do												
		{												//get options for this date fn
			var options = {
				args: EZ.toArray(args),
				rtnValue: undefined,
				message: '',
				callback: null,			
			};
			var fn = args[0];
			if (typeof(fn) == 'string' && fn.substr(0,1) == '@')
			{
				options.fn = fn.substr(1);
				options.args.shift();
			}
			else										//create new EZ.date
			{
				options.fn = 'createDate';
				options.rtnValue = new Date(undefined);
				if (!EZ.date.fn)						//get date and static functions
					getFunctions(args);
			}
			var lockList = 'createDate toString updateFormattedDate callback'.split(' ');
			options.lock = lockList.includes(options.fn)

			var type = getType(date);
			if (type != 'Date')
			{
				if (options.fn in EZ.date.fn.bound)
				{
					options.message = options.fn + '() only valid for EZ.Date' 
									+ (type != 'Window' ? ' not ' + type : '');
					break;
				}
			}

			if (options.fn in EZ.date.fn.bound)
			{
				options.ctx = date;
				EZ.date.theFn = EZ.date.fn.bound[options.fn]
				rtnValue = (options.fn == 'toString') ? this.toStringDefault() : this;
			}
			else if (options.fn in EZ.date.fn.proto)
			{
				options.ctx = EZ.date;
				EZ.date.theFn = EZ.date.fn.proto[options.fn]
			}
			else
			{
				options.message = 'unknown EZ.date function';
				break;
			}
		}
		while (false)
		//=============
		//console.log(options)
		return options;
		//=============
	}

	//____________________________________________________________________________________________
	/**
	 *	return full month name
	 */
	function _getMonthName()
	{
		return this.getMonthNames()[this.getMonth()];
	}
	/**
	 *	return full day name
	 */
	function _getDayName()		
	{
		return this.getDayNames()[this.getDay()];
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
			if (((Year % 4)==0) && ((Year % 100)!=0) || ((Year % 400)==0))
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
	}
	/**
	 *	return new EZdate with number of months added or subtracted -- default: +1
	 */
	function _addMonths(number)
	{
		number = EZ.toInt(number, 1);

		var time = this.getTime();
		var year = this.getFullYear() + parseInt(number / 12);
		var month = (this.getMonth() + number) % 12;
		if (number > 0 && month < this.getMonth())
			year++;
		else if (number < 0 & month > this.getMonth())
			year--;
		var day = this.getDate();
		var seconds = this.getSeconds();
		var millisecond = this.getMillisecond();
		
		var date = new Date(year,month,day,hours,minutes,seconds,ms);
		
		date.setDate(1);				//advance to next month using day=1
		date.setYear(year);
		date.setMonth(month);
		
		day = Math.min(day, this.getDaysInMonth());	
		date.setDate(day);				//adjust date using current day or last day of month
		
		return _createDate(date);
	}
	/**
	 *	return new EZdate with number of weeks added or subtracted -- default: +1
	 */
	function _addWeeks(number)
	{
		if (typeof number == 'undefined') number = 1;
		return this.callback( this.addDays(number*7) );
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
		return EZ.date(this.getTime() + milliseconds);
	}
	
	/**
	 *	return new EZdate with number of hours added or subtracted -- default: +1
	 */
	function _addHours(number)
	{
		var milliseconds = EZ.toInt(number, 1) * (60 * 60 * 1000);
		return this.callback( EZ.date(this.getTime() + milliseconds) );
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
		dowOffset = typeof(dowOffset) == 'int' ? dowOffset : 0; //default dowOffset to zero

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
				nYear = new Date(this.getFullYear() + 1,0,1);
				nday = nYear.getDay() - dowOffset;
				nday = nday >= 0 ? nday : nday + 7;
				/*if the next year starts before the middle of
				  the week, it is week #1 of that year*/
				weeknum = nday < 4 ? 1 : 53;
			}
		}
		else
			weeknum = Math.floor((daynum+day-1)/7);
		return this.callback(weeknum);
	}
	/**
	 *	getNthDayInMonth(nth)
	 *	If nth specified, get date for nth occurance of this.date dayOfWeek -OR-
	 *	If no parameters, determine occurance of day of week in this.date month
	 *	
	 *	----------------------
	 *	Parameters (optional):
	 *	----------------------
	 *	theDayOfWeek 	specifies day of week; 0-6 or day name (at least 3 characters)
	 *	theNth			specifies desired occurance of theDayOfWeek
	 *	
	 *	--------
	 *	Returns:
	 *	--------
	 *	if parameters:	(EZ.date) matching theNth occurance of theDayOfWeek in the month
	 *	otherwise		(String) 1st to 4th or 'last' if nth > 4th)
	 *	
	 *	--------
	 *	Examples:
	 *	---------
	 *	this.date=01-01-2012
	 *					getNthDayInMonth() 			returns '1st' 01-01-201 is 1nd Sun in Jan 2012
	 *					getNthDayInMonth(1) 		returns EZ.date('01-01-2012')
	 *					getNthDayInMonth(4) 		returns EZ.date('01-22-2012')
	 *					getNthDayInMonth('last') 	returns EZ.date('01-29-2012')
	 *	this.date=01-09-2012
	 *					getNthDayInMonth() 			returns '2nd'; 01-09-201 is 2nd Mon in Jan 2012
	 *					getNthDayInMonth(1) 		returns EZ.date('01-02-2012')
	 *					getNthDayInMonth(4) 		returns EZ.date('01-23-2012')
	 *					getNthDayInMonth('last') 	returns EZ.date('01-23-2012')
	 */
	function _getNthDayInMonth(nth,dayOfWeek)
	{
		var day;
		var theDate = EZ.date(this);			//work object that can be modified
		var daysInMonth = theDate.getDaysInMonth();
		var nthCount = 0;
		var dateTime = 0;

		
		if (arguments.length == 0)				//Compute nth day of current date in month
		{
			dayOfWeek = theDate.getDay();
			for (day=1;day<=daysInMonth;day++)
			{
				theDate.setDate(day);
				if (theDate.getDay() == dayOfWeek)
					nthCount++;
				if (theDate.getDatePart()+'' == this.getDatePart()+'')
					break;
			}
			if (nthCount > 4)
				nthCount = 'last';
			else
				nthCount = EZ.nth(nthCount);
			return nthCount;
		}

		else									//Find date of nth dayOfWeek in month
		{
			if (nth != 'last')
				nth = nth.substr(0,1);			//drop th; keep number
			for (day=1;day<=daysInMonth;day++)
			{
				theDate.setDate(day);
				if (theDate.getDay() == dayOfWeek)
				{
					if (nth == 'last')
						dateTime = theDate.getTime();
					else if (nth == ++nthCount)
						return EZ.date(theDate);
				}
			}
			return this.callback(EZ.date(dateTime));
		}
	}

/*--------------------------------------------*/
/*BOOKMARK EZ.date date (instance) functions */
/*------------------------------------------*/

	/**
	 *	populated EZ.date.fn with nested static and date instance functions
	 *	-AND- EZ.date.prototype.{functionName}
	 *	-AND- EZ.date.prototype.callback.{functionName}
	 */
	function setup()
	{
		var options = EZ.options.date;
		
		var baseFormats = {}
		options.baseFormats.forEach(function(format)
		{										//convert baseFormats to formats
			var key = Object.keys(format)[0];
			var value = format[key];
			baseFormats[key] = value;
		});
		options.formats = EZ.mergeAll(baseFormats, options.defaultFormats);
		
												//find all EZ.date internal and prototype functions
		EZ.date.fn = {bound:{toString:{}}, proto:{}, callback:{}};
		var script = EZ.date.toString();			
		var results = script.match(/function _(\w+_?)(?=\()/g);
		if (results)
		{
			results.forEach(function(fn)		//find all nested functions starting with "_"
			{								
				var name = fn.replace(/.* _(.+)/, '$1');
				var e;
				try 
				{
					var func = eval('_' + name);
					if (fn.endsWith('_'))		//static functions end with "_"
						EZ.date.fn.proto[name.clip()] = func;
					else						//date functions do not
						EZ.date.fn.bound[name] = func;
				}
				catch (e) {}					//skip if not function
			});
		}
		for (var name in EZ.date.prototype)
		{										//prototype static unless matches bound name
			//name = name.split('_');
			//if (name[0] == '')
			if (name.endsWith('_callback'))
				EZ.date.fn.callback[name.clip(9)] = EZ.date.prototype[name];
			
			else if (!EZ.options.date.override
			&& (name in EZ.date.fn.bound || name in EZ.date.fn.proto))
				continue;
			
			else if (name in EZ.date.fn.bound) //bound override
				EZ.date.fn.bound[name] = EZ.date.prototype[name];
				
			else
				EZ.date.fn.proto[name] = EZ.date.prototype[name];
		}
		if (EZ.date.prototype.setup_callback)
			EZ.date.prototype.setup_callback();
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
EZ.date.prototype.getFormats(formats)

return Object of valid formats matching those specified or all valid formats if none specified.

ARGUMENTS:
	formatName	(optional) space delimited string or Array containing one or more format names

RETURNS:
	object with valid format names as key and value as format notation.
	use toString(...) to return formatted date.
---------------------------------------------------------------------------------------------*/
EZ.date.prototype.getFormats = function EZdate_getFormats(formatNames)
{
	return EZ.date('@getFormats', formatNames)
}
/*---------------------------------------------------------------------------------------------
EZ.date.prototype.addFormats(formats)

Adds or replaces date format strings.  If called on EZ.date Date Object, only applies to that 
date otherwise applies to any new EZ.date created via EZ.date(...)

ARGUMENTS:
	formats		Object containing key/values: format name as key and date notation as value.
		
RETURNS:
	object containing all valid formats after specified formats added.
---------------------------------------------------------------------------------------------*/
EZ.date.prototype.addFormats = function EZdate_addFormats(formatNames)
{
	var formatOptions = this.isEZ ? this._formats : EZ.options.date.formats;
	for (var name in formatNames)
		formatOptions[name] = formatNames[name];
	
	if (this.isEZ)
		this.updateFormattedDate()
}
/*---------------------------------------------------------------------------------------------
EZ.date.prototype.addFormats(formats)

Adds or replaces date format strings.  If called on EZ.date Date Object, only applies to that 
date otherwise applies to any new EZ.date created via EZ.date(...)

ARGUMENTS:
	formats		space delimited Strimg or Array of formats to remove.
		
RETURNS:
	object containing all valid formats after specified formats removed.
---------------------------------------------------------------------------------------------*/
EZ.date.prototype.removeFormats = function EZdate_removeFormats(formats)
{
	var formatOptions = this.isEZ ? this._formats : EZ.options.date.formats;
	EZ.toArray(formatNames, ' ').forEach(function(format)
	{
		delete formatOptions.name;
	});
	if (this.isEZ)
		this.updateFormattedDate()
}
/*---------------------------------------------------------------------------------------------
EZ.date.prototype.getOption(key, defaultValue)

return value of option of specified by key.

ARGUMENTS:
	key		(String) specifies option key orname

RETURNS:
	EZ.date.option specified by key (date.option call on date otherwise global option)
	use toString(...) to return formatted date.
---------------------------------------------------------------------------------------------*/
EZ.date.prototype.getOption = function EZdate_getOption(key, defaultValue)
{
	key = key + '';
	var dateOptions = this.isEZ ? this._options : EZ.options.date.options;
	if (key in dateOptions == false && defaultValue != undefined)
		dateOptions[key] = defaultValue;
	return dateOptions[key];
}
/*---------------------------------------------------------------------------------------------
EZ.date.prototype.setOption(key)

return value of option of specified by key.

ARGUMENTS:
	key		(String) specifies option key orname

RETURNS:
	EZ.date.option specified by key (date.option call on date otherwise global option)
	use toString(...) to return formatted date.
---------------------------------------------------------------------------------------------*/
EZ.date.prototype.setOption = function EZdate_setOption(key,value)
{
	key = key + '';
	var dateOptions = this.isEZ ? this._options : EZ.options.date.options;
	if (value != undefined)
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
EZ.date.prototype.addYears_callback = 
EZ.date.prototype.addMonths_callback = 
EZ.date.prototype.addWeeks_callback = function RZdate_addWeeks(newDate)
{
	var time = this.getTime();
	this.setTime(newTime);
	this.updateFormattedDate();
	
	var diff = (newTime-oldTime) / 24 / 60 / 60 / 1000; 	//number of days added
	return parseInt(diff + .5);	
}
EZ.date.prototype.addHours_callback = function RZdate_addHours(newDate)
{
	var time = this.getTime();
	this.setTime(newTime);
	this.updateFormattedDate();
	
	var diff = (newTime-oldTime) / 60 / 60 / 1000; 			//number of minutes added
	return parseInt(diff + .5);	
}
EZ.date.prototype.addMinutes_callback = function RZdate_addMinutes(newDate)
{
	var time = this.getTime();
	this.setTime(newTime);
	this.updateFormattedDate();
	
	var diff = (newTime-oldTime) / 60 / 1000; 				//number of seconds added
	return parseInt(diff + .5);	
}
/*---------------------------------------------------------------------------------------------
RZdate compatibility
---------------------------------------------------------------------------------------------*/
EZ.date.prototype.createDate_callback = function EZdate_callback(fn)
{
	this.isRZdate = this.isEZ == true;

	/*---------------------------------------------------------------*/
	/*BOOKMARK EZ.date instance properties (backward compatibility) */
	/*		   superceeded by getter functions above               */
	/*------------------------------------------------------------*/
	EZ.date.baseDate = '01/01/1970';
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
}
/*----------------------------------------------------------*/
/*BOOKMARK EZ.date static functions (instance not required)*/
/* as convenience they are available as date functions    */
/*-------------------------------------------------------*/
EZ.date.prototype.getBaseDate = function EZdate_getBaseDate()
{
	return new Date('01/01/1970');
}
EZ.date.prototype.getDayNames = function EZdate_getDayNames()
{
	return ["Sunday", "Monday", "Tuesday", "Wednesday",
				      "Thursday", "Friday", "Saturday"];
}
EZ.date.prototype.getMonthNames = function EZdate_getMonthNames()
{
	return ["January", "February", "March", "April",
			"May", "June", "July", "August",
			"September", "October", "November", "December"];
}
/*---------------------------------------------------------------------------------------------
date.function getFormats()

Return new object containing available formats as keys and value representing format.
---------------------------------------------------------------------------------------------*/
EZ.date.prototype.getFormats = function EZdate_getFormats()
{
	return EZ.date.call(this, '@getFormats', arguments);
}

//_____________________________________________________________________________________________
EZ.date.test = function()
{
	var arg='', el='', obj=null,
		ctx = 'na', ex = 'na', exfn = exfn, note = '';
	
	var exfn = function(results, testrun)
	{
		//debugger
		testrun.results = results._formattedDate;
	}
	//exfn = fn;
	var notefn = function()
	{
	}
	//note = notefn;

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	note = ''
	obj = {}
	ex = ''

	EZ.test.options( {ex:ex, exfn:exfn, note:note})
	str = null
	e = EZ.test.run()

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

	//______________________________________________________________________________
	return;
}
