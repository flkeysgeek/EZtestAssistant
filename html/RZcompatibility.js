/*----------------------------------------------------------------------------
Date subclass to supports dashes "-" in constructor for FF & Chrome:
	.e.g. new RZdate('12-21-2012')

Plus additional properties and methods.
The builtin Date() object is not extended to avoid different behavior caused
by adding prototypes directly.

TODO:
	date.formatted.revizeDate --> date.get('revizeDate')
----------------------------------------------------------------------------*/
function RZdate(year,month,day,hours,minutes,seconds,ms)
{
	var date = null;
	switch (RZdate.arguments.length)
	{
		case 0:
			date = new Date();
			break;
		case 1:		//milliseconds since midnight 1-1-70 -OR- date string
			if (typeof year == 'number')
				date = new Date(year)
			else
			{		//date object or string; replace dashs in date
				var dateStr = (year + '')
				dateStr = dateStr.replace(/Noon/i,'12:00pm');
				dateStr = dateStr.replace(/Midnight/i,'12:00am');
				dateStr = dateStr.replace(/(\d)\-(\d)/g,'$1/$2');

				dateStr = dateStr.replace(/(\d{1,2}\/\d{1,2}\/)(\d{2})(?!\d)/, '$120$2');
				dateStr = dateStr.replace(/(\d)(am|pm)/, '$1 $2');

				if (dateStr)
					date = new Date(dateStr);
				else
					date = new Date();
			}
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
	//----- If invalid date, return NaN
	if (isNaN(date)) return null;

	date.isRZdate = true;
	date.string = date.toString();	//only used show value in debugger
	//date.toString = function() ... may work better

	//----- Add additional properties and methods.
	//		calendar_app issues
	//		1. cloning does not get these properties and methods
	//		2. adding reference to homeframe freezes IE7
	//		   must explictly reference as homeframe.RZdate(...)
	//		3. valid date return true for isNaN beside invalid when
	//		   not called from homeframe
	for (var prop in RZdate.prototype)
		date[prop] = RZdate.prototype[prop];

	if (date.getFormatted)			//TODO: change to getFormat()
		date.getFormatted();		//set formatted data for constructor date
	return date;
}
/*----------------------------------------------------------*/
/*BOOKMARK RZdate static properties (instance not required)*/
/*--------------------------------------------------------*/
RZdate.baseDate = '01/01/1970';
RZdate.monthNames = ["January", "February", "March", "April",
				     "May", "June", "July", "August",
					 "September", "October", "November", "December"];
RZdate.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday",
				   "Thursday", "Friday", "Saturday"];

RZdate.getMonth = function(monthName)
{
	for (var i=0; i<RZdate.monthNames; i++)
		if (RZdate.monthNames[i] == monthName) return i;
	return -1;
}

/*-------------------------------------------------------------*/
/*BOOKMARK RZdate instance properties (backward compatibility)*/
/*-----------------------------------------------------------*/
RZdate.prototype.monthNames = ["January", "February", "March", "April",
							   "May", "June", "July", "August",
							   "September", "October", "November", "December"];

RZdate.prototype.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday",
							  "Thursday", "Friday", "Saturday"];

/*------------------------*/
/*BOOKMARK RZdate methods*/
/*----------------------*/
RZdate.prototype.get = function(key)		//return format property
{											//TODO: extend to get any property
	if (typeof this.formatted[key] == 'undefined')
		return key;

	this.getFormatted();
	return this.formatted[key];
}
RZdate.prototype.toString = function()		//return string for date
{
	return new Date(this.getTime()) + '';
}
RZdate.prototype.getMonthName = function()	//return full month name
{
	return this.monthNames[this.getMonth()];
}
RZdate.prototype.getDayName = function()	//return full day name
{
	return this.dayNames[this.getDay()];
}
RZdate.prototype.getDaysInMonth = function()
{
	//                  1  2  3  4  5  6  7  8  9 10 11 12
	var daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
	var month = this.getMonth();
	var days = daysInMonth[month];
	if (month==1 && isLeapYear(this.getFullYear()))
		days=29;
	return (days);

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
/*----------------------------------------------------------------------------
Add/substract number of months to current date.
return number of days added or subtracted
----------------------------------------------------------------------------*/
RZdate.prototype.addMonth = function(number)
{	//backward compatibility
	return this.addMonths(number)
}
RZdate.prototype.addMonths = function(number)
{
	if (typeof number == 'undefined') number = 1;
	number = parseInt(number);

	var time = this.getTime();
	var year = this.getFullYear() + parseInt(number / 12);
	var month = (this.getMonth() + number) % 12;
	if (number > 0 && month < this.getMonth())
		year++;
	else if (number < 0 & month > this.getMonth())
		year--;
	var day = this.getDate();

	// advance to next month using day=1
	this.setDate(1);
	this.setYear(year);
	this.setMonth(month);

	// adjust date using current day or last day of month
	day = Math.min(day,this.getDaysInMonth());
	this.setDate(day);
	this.getFormatted();

	time = this.getTime() - time;
	return time / 24 / 60 / 60 / 1000; 	//number of days added
}
/*----------------------------------------------------------------------------
Add/substract number of weeks to current date.
return number of minutes added or subtracted
----------------------------------------------------------------------------*/
RZdate.prototype.addWeeks = function(number)
{
	if (typeof number == 'undefined') number = 1;
	return this.addDays(number*7);
}
/*----------------------------------------------------------------------------
Add/substract number of days to current date.
return number of minutes added or subtracted

Credit: http://www.w3schools.com/js/js_obj_date.asp
They say if adding days goes into another month or year, Date object adjusts.
----------------------------------------------------------------------------*/
RZdate.prototype.addDays = function(number)
{
	if (typeof number == 'undefined') number = 1;
	number = parseInt(number);

	var time = this.getTime();
	this.setDate(this.getDate() + number);
	this.getFormatted();

	time = this.getTime() - time;
	return (time / 60 / 1000); 	//number of minutes added
}
/*----------------------------------------------------------------------------
Return new RZdate() object containing only the date portion of this RZdate().
----------------------------------------------------------------------------*/
RZdate.prototype.getDatePart = function()
{
	return new RZdate(this.getFullYear(),this.getMonth(),this.getDate());
}
/*----------------------------------------------------------------------------
Return a new Date() object which is GMT representation of time component.

Therefore getTime() returns milliseconds since midnight not since GMT 12:00am
(e.g. 0 for midnight; 1*60*60*1000 = 3600000 for 1am, etc).

However getHours() returns GMT hours not the hour specified when this RZdate
object was created. Therefore RZdate() with no time component (i.e. midnight)
returns 19 (7pm) from getHours() when local is EST since EST is GMT-5 hours.
----------------------------------------------------------------------------*/
RZdate.prototype.getTimePart = function()
{
	var date = new Date(1970,0,1);
	date.setUTCHours(this.getHours(),
					 this.getMinutes(),
					 this.getSeconds(),
					 this.getMilliseconds());
	return date;
}
/*----------------------------------------------------------------------------
Returns the week number for this date.

@param int dowOffset (optional) day week starts on (0 to 6) 1 is Monday
@return int ISO 8601 week number

Credit: Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com
----------------------------------------------------------------------------*/
RZdate.prototype.getWeek = function(dowOffset)
{
	if (isNaN(this)) return null;
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
	return weeknum;
}
/*---------------------------------------------------------------------------------------------
getNthDayInMonth(nth)
If nth specified, get date for nth occurance of this.date dayOfWeek -OR-
If no parameters, determine occurance of day of week in this.date month

----------------------
Parameters (optional):
----------------------
theDayOfWeek 	specifies day of week; 0-6 or day name (at least 3 characters)
theNth			specifies desired occurance of theDayOfWeek

--------
Returns:
--------
if parameters:	(RZdate) matching theNth occurance of theDayOfWeek in the month
otherwise		(String) 1st to 4th or 'last' if nth > 4th)

--------
Examples:
---------
this.date=01-01-2012
				getNthDayInMonth() 			returns '1st' 01-01-201 is 1nd Sun in Jan 2012
				getNthDayInMonth(1) 		returns RZdate('01-01-2012')
				getNthDayInMonth(4) 		returns RZdate('01-22-2012')
				getNthDayInMonth('last') 	returns RZdate('01-29-2012')
this.date=01-09-2012
				getNthDayInMonth() 			returns '2nd'; 01-09-201 is 2nd Mon in Jan 2012
				getNthDayInMonth(1) 		returns RZdate('01-02-2012')
				getNthDayInMonth(4) 		returns RZdate('01-23-2012')
				getNthDayInMonth('last') 	returns RZdate('01-23-2012')
---------------------------------------------------------------------------------------------*/
RZdate.prototype.getNthDayInMonth = function (nth,dayOfWeek)
{
	var day;
	var theDate = RZdate(this);		//work object that can be modified
	var daysInMonth = theDate.getDaysInMonth();
	var nthCount = 0;
	var dateTime = 0;

	//----- Compute nth day of current date in month
	if (arguments.length == 0)
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
			nthCount = RZnth(nthCount);
		return nthCount;
	}

	//----- Find date of nth dayOfWeek in month
	else
	{
		if (nth != 'last')
			nth = nth.substr(0,1);					//drop th; keep number
		for (day=1;day<=daysInMonth;day++)
		{
			theDate.setDate(day);
			if (theDate.getDay() == dayOfWeek)
			{
				if (nth == 'last')
					dateTime = theDate.getTime();
				else if (nth == ++nthCount)
					return RZdate(theDate);
			}
		}
		return RZdate(dateTime);
	}
}
/*---------------------------------------------------------------------------------------------
Return various formatted strings for RZdate() object and save for future reference.
---------------------------------------------------------------------------------------------*/
RZdate.prototype.getFormatted = function(isForceFormat)
{
	//----- Initialize return object; formats shown below replaced by subsequent code:
	var formatted = {									//all dates are blank if no date component...
		briefDate:		'mm-dd-yy',						//2 digits for month, day & year
		shortDate:		'mm-dd-yyyy',					//2 digits for month & day; 4 digit year
		longDate:	 	'wwww mmmm d, yyyy',			//full day name & month name e.g. Monday January
		smartDate:		'mmm d, yyyy',					//3 char day of week (use substr(4) to omit or replace)
		revizeDate:		'yyyy-mm-dd',					//4 digit year, 2 digit month and day

		month:			'mm',							//2 digit month 01-12
		minutes:		'MM',							//2 digit minutes
		seconds:		'ss',							//2 digit seconds
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
		longTime: 		'hh:MM:ss am/pm',				//2 digits for hr; seconds always displayed
														//Noon for 12:00:00; Midnight for 00:00:00
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
	// if not forcing formatting and date has not changed since last call, no need to run again
	if (!isForceFormat && this.formatted && this.formatted.formattedTime == this.getTime())
		return;

	formatted.formattedTime == this.getTime();			//remember value last used for formatted

	var day = this.getDate();
	var month = this.getMonth();
	var year = this.getFullYear()
	var dayOfWeek = this.getDay();

	// day suffix e.g. 1st, 2nd. 3rd, 4th ... 30th
	var suffix = ''
	if (day == 1 || day == 21 || day == 31)
		suffix = 'st';
	else if (day == 2 || day == 22)
		suffix = 'nd';
	else if (day == 3 || day == 23)
		suffix = 'rd';
	else
		suffix = 'th';
	formatted.daySuffix = suffix;
	formatted.dayLong = day + suffix;

	// Full dayName & monthName (use substr(0,3) for short names
	formatted.dayName = this.getDayName();
	formatted.monthName = this.getMonthName();

	//----- Extract time zone from Date.toString() function
	//		chrome: Sun Mar 18 2012 23:21:58 GMT-0400 (Eastern Daylight Time)
	//		FF:		Sun Mar 18 2012 23:42:25 GMT-0400 (Eastern Daylight Time)
	//		IE7-9:  Sun Mar 18 23:21:14 EDT 2012 (may show EST not EDT)
	var pattern = new RegExp( '(\\w*' + day + ')(.*)('+year+')' );	//for IE format...
	formatted.timeZone = this.toString();								//...move year before timezone
	formatted.timeZone = RZtrim(formatted.timeZone.replace(pattern,'$1, $3$2'));
	var results = formatted.timeZone.match(/.*\d (.*)$/mi);			//find time zone at end
	if (results)
		formatted.timeZone = results[1];
	else
		formatted.timeZone = '';

	//----- Dates...
	formatted.month = RZright('0'+(month+1),2);
	formatted.day = RZright('0'+day,2);

	if (month == 0 && day == 1 && year == 1970)		//no date component
	{
		formatted.briefDate = '';
		formatted.shortDate = '';
		formatted.longDate = '';
		formatted.smartDate = '';
		formatted.revizeDate = '';
	}
	else
	{
		formatted.briefDate = formatted.month + '-' + formatted.day + '-' + (year+'').substr(2);
		formatted.shortDate = formatted.month + '-' + formatted.day + '-' + year;
		formatted.longDate = formatted.dayName + ' ' + formatted.monthName + ' '  + day + ', ' + year;
		formatted.smartDate = formatted.dayName.substr(0,3) + ' '
						    + formatted.monthName.substr(0,3) + ' '  + day + ', ' + year;
		formatted.revizeDate = year + '-' +  formatted.month + '-' + formatted.day;
	}

	//----- Time formats...
	var hours = this.getHours();
	var minutes = this.getMinutes();
	var seconds = this.getSeconds();

	var ampm = (hours < 12) ? ' am' : ' pm';
	formatted.ampm = ampm.substr(1);
	formatted.minutes = RZright('0' + minutes,2);
	formatted.seconds = RZright('0' + seconds,2);

	formatted.hours24 = RZright('0' + hours,2);
	formatted.hours = hours <= 12 ? hours : hours -= 12;
	formatted.hours12 = RZright('0'+ (hours==0?'12':hours), 2);
	formatted.hoursPadded = (hours.toString().length == 1 ? '&nbsp;&nbsp;' : '') + hours;

	formatted.briefTime = ((hours + minutes) > 0)
					    ? formatted.hours12 + ':' + formatted.minutes + ampm : '';
	formatted.briefTime = formatted.briefTime.replace(/12:00 pm/i,'Noon');

	formatted.shortTime = formatted.hours24 + ':' + formatted.minutes
					    + (seconds > 0 ? ':' + formatted.seconds : '');

	formatted.longTime  = formatted.hours12 + ':' + formatted.minutes + ':' + formatted.seconds + ampm;
	formatted.longTime  = formatted.longTime.replace(/12:00:00 am/i,'Midnight');
	formatted.longTime  = formatted.longTime.replace(/12:00:00 pm/i,'Noon');

	formatted.ampmTime  = formatted.hours12 + ':' + formatted.minutes + ampm;

	formatted.miniTime  = formatted.ampmTime.replace(/12:00 am/i,'Midnight');
	formatted.miniTime  = formatted.miniTime.replace(/12:00 pm/i,'Noon');

	formatted.smartTime = ((hours + minutes + seconds) > 0)
					    ? (formatted.hoursPadded + ':' + formatted.minutes + ':' + formatted.seconds) + ampm : '';
	formatted.smartTime = formatted.smartTime.replace(/:00 /i,' ');			//drop seconds if zero
	formatted.smartTime = formatted.smartTime.replace(/12:00 pm/i,'Noon');

	//----- Combine Date and Time
	formatted.briefDateTime = formatted.briefDate   + (formatted.briefTime ? ' ' + formatted.briefTime : '');
	formatted.shortDateTime = formatted.shortDate   + ' ' + formatted.shortTime;
	formatted.longDateTime = formatted.longDate     + ' ' + formatted.longTime;
	formatted.smartDateTime = formatted.smartDate   + (formatted.smartTime ? ' ' + RZtrim(formatted.smartTime) : '');
	formatted.revizeDateTime = formatted.revizeDate + (formatted.briefTime ? ' ' + formatted.briefTime : '');

	// trim leading space in case there was no date or time component
	formatted.briefDateTime = RZtrim(formatted.briefDateTime);
	formatted.shortDateTime = RZtrim(formatted.shortDateTime);
	formatted.longDateTime = RZtrim(formatted.longDateTime);
	formatted.smartDateTime = RZtrim(formatted.smartDateTime);
	formatted.revizeDateTime = RZtrim(formatted.revizeDateTime);

	// Additional date & time combinations
	formatted.shortDateBriefTime = RZtrim(formatted.shortDate + ' ' + formatted.briefTime);

	this.string = this.toString();	//update value shown in debugger
	this.formatted = formatted;
	return formatted;
}
/*------------------------------------------------------------------------------
Remove any leading and ending blank spaces from string (trim)

Parameters:
	tmpStr - Input string

Returns:
	String with leading and trailing spaces removed
------------------------------------------------------------------------------*/
function RZtrim(tmpStr)
{
	if (typeof(tmpStr) == 'undefined' || tmpStr == null || tmpStr == '')
		return tmpStr;

	//----- need to strip \t besides ' '
	//while(tmpStr.substring(0,1) == ' ')
	while (/^\s/.test(tmpStr))
		tmpStr = tmpStr.substring(1, tmpStr.length);

	//while(tmpStr.substring(tmpStr.length-1,tmpStr.length) == ' ')
	while (/\s$/.test(tmpStr))
		tmpStr = tmpStr.substring(0, tmpStr.length - 1);

	return tmpStr;
}
/*---------------------------------------------------------------------------
returns rightmost number of characters specified

Parameters:
	str - Input String
	noChars - number of rightmost characters desired

Example:
	* right("1234",2) returns "34"
    * right("1234",0) returns ""
    * right("0",4) returns "0"

Returns:
	Rightmost substring possible; does not throw exception if string too short
----------------------------------------------------------------------------*/
function RZright( str, noChars )
{
	if (!str) return '';
	var len = str.length;
	if (len == 0) return "";

	if (noChars > len) noChars = len;
	return str.substring(len-noChars);
}
