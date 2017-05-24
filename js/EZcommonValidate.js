/**********************************************************************************************
*	Common code for DW validation: Documents, ManageModules, SaveTemplate
**********************************************************************************************/

/*---------------------------------------------------------------------------------------------
ValidateString:
---------------

This validation function initially created for use by the Dreamweaver Revize extension.

This function and associated helper functions was subsequently ported to Revize for use
html edit forms and jsp pages.

Functions are stored in the following files:
	Dreamweaver: RevizeCommonValidate.js
	Revize: ...www/revize/util/snippet_helper_validate.js
	*******************************************************************
	*          Any changes should be put into the both files          *
	*                                                                 *
	*  Please list any changes not transfered to either DW or Revize  *
	*******************************************************************

Description
-----------
Check for for valid characters
Only letters, numbers and underscore allow besides additional validChar characters.
(validChar contains empty string or a string of additional valid characters)

First character must be letter unless first validChar is an underscore in which case
any valid character allowed as first character (other than dot).

Input Parameters
----------------
text		String to validate

options		Is a set of options from the list below seperated by commas

			firstchars=...	Addtional valid first character besides letters
							(empty means treat the same as all other characters)
			validchars=...	Addtional valid characters besides letters, numbers or underscores
							Note: don't include a comma because it terminates the option value
			comma			Allow commas (can't include , validchars since its options seperator)

			correct			return a valid string by converting invalid characters to underscore
							and/or appending rz to beginning of name if it does not start with a
							valid character.
			correctfirst	Append rz_ to string if first character is invalid

			filenameonly	Only validate and/or correct filename portion (assumes ext allowed)
			ext				String may contain a file extention (e.g. .html)

Example Calls
-------------
EZvalidateString(templateName)		// only letters, numbers or underscores allowed
									// (first character must be a letter)

EZvalidateString(path_filename, firstchar=!@#$()-/,validchars=.!@#$()-/)
									// allows all valid file & path chars (except . as 1st char)

EZvalidateString(description,'firstchar=,validchars= !@#$%^&*()-+={}[]|;:"\'<>/?.\n\r,comma')
									// pretty much allows any displayable character
									// plus linefeed and carriage return
									// first character treated same as any other character

Return Values
-------------
If converting (correct argument) to valid string, returns a valid string
If checking for valid string return empty string if valid; otherwise return error message

---------------------------------------------------------------------------------------------*/
function EZvalidateString( text, options )
{
	var pos, i, ch, chCode
	var msg = ''
	var ext = ''
	var convert = false;
	var firstCharTest = true;	// do first character test

	if (typeof options == 'undefined') options = ''
	options = ',' + options + ','

	if (options.indexOf(',correct') >= 0) convert = true

	validChars = EZgetKeyValue( options, 'validchars' )
	if (EZcheckOptions(options,'comma')) validChars += ','

	firstChars = EZgetKeyValue( options, 'firstchars' )
	if (firstChars == '' && (','+options).toLowerCase().indexOf(',firstchars') > 0)
		firstCharTest = false

	//----- Split filename and extension
	pos = text.lastIndexOf('.')
	if (pos == 0)
	{
		if (convert && options.indexOf(',correctfirst')>=0)
			convertedText = 'rz'
		else
			msg = 'First character can not be ( . )'
	}
	else if (pos > 0)
	{
		if(options.indexOf(',ext') >= 0				// if extension permitted
		|| options.indexOf(',filenameonly') >= 0)
		{
			ext = text.substring(pos+1)
			text = text.substring(0,pos)
		}

		if (options.indexOf(',filenameonly') >= 0)	// if just processing filename
			ext = ''
		else
			if (ext == '') text = text + '.'	// nothing after dot means no extension
	}

	//----- check first character of filename
	if (firstCharTest)
	{
		ch = text.charAt(0).toLowerCase()
		chCode = ch.charCodeAt(0)

		if ( (chCode < 'a'.charCodeAt(0) || chCode > 'z'.charCodeAt(0))
		&& (firstChars == '' || firstChars.indexOf(ch) < 0) )
		{
			if (!convert)
			{
				if (firstChars == '')
					msg = 'First character is not a letter'
				else
					msg = 'Invalid First character ( ' + ch + ' )'
			}
			else if ( options.indexOf(',correctfirst') >= 0 )
				text = 'rz_' + text;
		}
	}

	//----- If correcting, convert both parts
	if (convert)
	{
		text = EZvalidate( text, validChars, convert )
		if (ext != '')
			text += '.' + EZvalidate( ext, validChars, convert )
		return text
	}

	//----- If not correcting and not error validate each portions
	if (msg == '')
		msg = EZvalidate( text, validChars, convert )

	if (msg == '' && ext != '' )
		msg = EZvalidate( ext, validChars, convert )

	//----- if no errors return empty string
	if ( msg == '' ) return ''

	//----- otherwise return error message
	msg += '\n\n'
	    + 'The following are valid characters:\n\n'
	    + 'Letters ( A through Z upper or lower case)\n'
	    + 'Numbers ( 0 through 9)\n'
	    + 'Underscores ( _ )\n'

	if (validChars != '')
	{
		msg += 'or these special characters ( ' + validChars + ' )'
	}

	if ( firstCharTest )
	{
		msg += '\n\nFirst Character must be a letter'
		if (firstChars != '')
		{
			msg += '\nor these special characters ( ' + firstChars + ' )\n'
		}
	}

	return msg
}

/*---------------------------------------------------------------------------------------------
Used by EZvalidateString to validate or convert a invalid string
---------------------------------------------------------------------------------------------*/
function EZvalidate( text, validChars, convert )
{
	var pos, i, ch, chCode
	var msg = ''
	var convertedText = ''

	//----- check all characters (including first)
	for (i=0; i<text.length; i++)
	{
		if (msg != '') break;
		ch = text.charAt(i).toLowerCase()
		chCode = ch.charCodeAt(0)

		// if letter, number, underscore or permitted special char
		if( (chCode >= 'a'.charCodeAt(0) && chCode <= 'z'.charCodeAt(0) )
		||  (chCode >= '0'.charCodeAt(0) && chCode <= '9'.charCodeAt(0) )
		||  validChars.concat('_').indexOf(ch) >= 0 )
			convertedText += text.charAt(i)
		else	// invalid character
		{
			if (!convert)
			{
				ch = text.charAt(i)
				if (ch == ' ')
					msg = 'Spaces not allowed'
				else
					msg = 'Invalid Character ( ' + ch + ' )'
			}
			else
				convertedText += '_'
		}
	}

	//----- if converting, return conversion
	if (convert) return convertedText;

	return msg;
}
/*---------------------------------------------------------------------------------------------
EZgetKeyValue

Description:
        Looks for a key = value string in the input string and returns the value portion.

Parameters:
        options		String to be searched
        key			Key searching for in options

Returns:
        If key is found, the associated value is returned, otherwise return blank string.
---------------------------------------------------------------------------------------------*/
function EZgetKeyValue( pOptions, pKey)
{
	var pos;
	var str;
	var keyEqual;

	//----- Search for key=
	keyEqual = pKey + "=";
	str = "," + pOptions;
	pos = str.toLowerCase().indexOf( keyEqual.toLowerCase() );

	if (pos == -1) 	// key not found
		str = "";
	else
	{

		//----- Keep everything after =
		str = pOptions.substring(pos + keyEqual.length - 1);
		pos = str.indexOf(",");
		if (pos >= 0) str = str.substring( 0, pos );	// value
	}
	return str;
}
/*---------------------------------------------------------------------------------------------
EZcheckOptions

Description:
        Look for specific option choice(s) in the options string.  Both options and choices
        use commas to seperate multiple individual options.

Input:
        options		Caller supplied options (e.g. "filter,editsingle,alt")
        choices		specific option choices to look for (e.g. alt,url,image)

Returns:
        True if at least one choice is contained in options
        False if none of the choice(s) are found
---------------------------------------------------------------------------------------------*/
function EZcheckOptions( pOptions, pChoices )
{

	var inputOpts = "," + pOptions + ",";
	inputOpts = inputOpts.toLowerCase();

	var searchOpts = pChoices.toLowerCase();
	var str;
	var pos;

	//----- For each desired choice ...
	while ( !searchOpts == "" )
	{
		str = searchOpts;
		pos = str.indexOf(",");
		if (pos == 0)
		{
			searchOpts = str.substring(pos+1);	//strip comma
			continue;
		} else if (pos > 0)
		{
			searchOpts = str.substring(pos+1);
			str = str.substring(0,pos);
		} else
		{// no comma
			searchOpts = "";
		}
		// check for this choice
		if (inputOpts.indexOf("," + str + ",") >= 0) return true;
		if (inputOpts.indexOf("," + str + "=") >= 0) return true;
	}
	return false;
}
/*---------------------------------------------------------------------------------------------
Validate Number

Input Parameters:
	name		text string specifyin name of field being checked (used in error msg returned)
	number		number to validate
	options		optional set of options from list below separated by commas
				required or req: value required
				min=#: minumum value
				max=#: maximum value
Returns:
	empty string if number is valid otherwise a message indicating why not
---------------------------------------------------------------------------------------------*/
function EZvalidatenumber( name, number, options )
{
	if (typeof options == 'undefined') options = '';
	options = ',' + options + ',';

	var msg = '';
	var min = EZgetKeyValue( options, 'min' )
	var max = EZgetKeyValue( options, 'max' )
	if (!isNaN(min)) min = parseInt(min)
	if (!isNaN(max)) max = parseInt(max)

	if (number != '')
	{
		if (isNaN(number))
			msg = 'is not a number';
		else if (min != '' && !isNaN(min) && number < min)
			msg = 'is less than ' + min;
		else if (max != '' && !isNaN(max) && number > max)
			msg = 'is greater than ' + max;
	}
	else if ( EZcheckOptions(options,'req,required') )
		msg = 'must be specified';

	if (msg != '')
		msg = name + ' "' + number + '" ' + msg + '\n';

	return msg;
}
/**********************************************************************************************
* Remaining functions are for backward compatibility in DW and not shared with Revize
**********************************************************************************************/
/*---------------------------------------------------------------------------------------------
Validate Template Name
Only letters, numbers, '_', '-', and spaces allowed in name.
---------------------------------------------------------------------------------------------*/
function EZvalidateTemplateName(name)
{
	//----- If blank ...
	if ( name == '' )
	{
		EZdisplayError( 'dataTemplateNameBlank' )
		return false;
	}

	//----- If invalid ...
	msg = EZvalidateString(name)
	if ( msg != '' )
	{
		EZalert( 'Invalid Template Name\n' + msg )
		EZdisplayError( 'dataTemplateNameBad' )
		return false;
	}

	return true;
}
/*---------------------------------------------------------------------------------------------
Validate Name (or Location): old validation function

calls new EZvalidateString for validation (returns true or false)

For backward compatibility, only validates up to the last dot (anything allowed after last dot)
---------------------------------------------------------------------------------------------*/
function EZvalidateName( text, validChars )
{
	var options = 'filenameonly'

	if (typeof validChars == 'undefined')
		validChars = '';

	if (validChars != "_" && validChars != '')
		options += ',validchars=' + validChars

	if (validChars.substring(0,1) == "_")
		options += ',firstchars=0123456789_/'

	var msg = EZvalidateString( text, options)
	if (msg == '')
		return true
	else
		return false
}
/**********************************************************************************************
* Revize compatible functions added above
**********************************************************************************************/