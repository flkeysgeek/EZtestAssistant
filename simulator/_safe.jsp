
<%@
include file="/util/setup_editlist_javascript.jsp"
%><%
/**********************************/
/*BOOKMARK Page specific JSP Code*/
/********************************/
String message = "";
String revizeFolder = "";
revizeFolder = getServletContext().getRealPath("/").replace('\\','/');
revizeFolder = revizeFolder.substring(0,revizeFolder.length()-1);

// http://localhost:8080/revize/util/EASY/test/easytest.jsp
String url = request.getRequestURL().toString();
String pathfilename = revizeFolder + url.substring(url.indexOf("/revize/")+7);
String pathname = pathfilename .substring(0,pathfilename.lastIndexOf("/"));
String filename = "easytest";
String datafilename = pathname + "/" + filename + "core.json";
String datafilenameNote = pathname + "/" + filename + "note.json";
String okMap = "{}";
String propertyMap = "{}";
String action = "";
try
{
	if (request.getParameter("ok") == null)		//if no posted field values...
	{
		action = "Reading";
		okMap = FileUtils.readFile(datafilename);		//...read saved json
		//if (FileUtils.FileExists("",datafilenameNote))
			propertyMap = FileUtils.readFile(datafilenameNote);
	}
	else										//if posted field values . . .
	{
		action = "Writing";								//...get field arrays
		String[] okArray = request.getParameterValues("ok");
		String[] exArray = request.getParameterValues("ex");
		String[] propertyArray = request.getParameterValues("note");
		okMap = "";
		propertyMap = "";
		for (int i=0;i<okArray.length;i++)				//...create json data
		{
			if (exArray[i].equals("na")) continue;
			okMap += ", " + StringUtils.convertStringForSource(okArray[i])
				   + ":" + StringUtils.convertStringForSource(exArray[i]);

			if (!propertyArray[i].equals(""))
				propertyMap = ", " + StringUtils.convertStringForSource(okArray[i])
						+ ":" + StringUtils.convertStringForSource(propertyArray[i]);
		}
		if (okMap.indexOf(", ") == 0)
			okMap = okMap.substring(2);
		if (propertyMap.indexOf(", ") == 0)
			propertyMap = propertyMap.substring(2);
		okMap = "{" + okMap + "}";
		propertyMap = "{" + propertyMap + "}";

		FileUtils.writeTextFile(datafilename, okMap);
		FileUtils.writeTextFile(datafilenameNote, propertyMap);
	}
}
catch (Exception e)
{
	message = e.getMessage() + "<br>" + action + " datafilename: " + datafilename;
}
/*-----------------------------------------------------------------------------
-----------------------------------------------------------------------------*/
function RZgetParent(el,tag,topTag)
{
	if (!el || !tag) return null;
	tag = tag.toUpperCase();
	if (topTag) topTag = topTag.toUpperCase();

	while (true)
	{
		if (el.tagName == tag || el.tagName == topTag) return el;
		if (!el.parentNode) break;
		el = el.parentNode;
	}
	return null;
}
/*-----------------------------------------------------------------------------------
Get value of html element or form field innerHTML or form field value independent of
element type. Keeps code independent of element type eliminating need to change if
element type changes and keeps code more readable.  More formally:

return empty string if null, undefined, false, or empty string
return comma delmited string of array elements if Array object
return el.value or el.innerHTML object property if defined (e.g. html element)
otherwise return string representation of el -- i.e. toString()

TODO: consider adding variant of code to RZgetfieldvalue()
-----------------------------------------------------------------------------------*/
function RZgetValue(el)
{
	switch (typeof el)
	{
		case 'undefined':
		case 'boolean':
			if (!el) el = '';

		case 'string':
		case 'number':
			return el + '';

		case 'object':
		{
			if (el == null) return '';
			if (el.constructor == Array) 	return el.join(',');
			if (el.value != undefined)	 	return el.value
			if (el.innerHTML != undefined)	return el.innerHTML;

			/*TODO: if other form field
			if (el.constructor == HTMLInputElement
			|| el.constructor == HTMLSelectElement)
			{
				return RZgetfieldvalue(el);
			}
			*/

			return '';
		}
		default:
			return '';
	}
}
/*-----------------------------------------------------------------------------------
Set html element innerHTML or form field el.value.  Keeps code independent of element
type eliminating need to change code if type changes and keeps code more readable.

More formally: set el.value or el.innerHTML to supplied value if either el property
defined and return value. Otherwise if niether element property exists, return null.

TODO: consider adding variant of code to RZsetfieldvalue().
-----------------------------------------------------------------------------------*/
function RZsetValue(el, value)
{
	if (typeof(el) != 'object') return null;	//cannot set pass by value argument

	var value = EZgetValue(value);				//always returns string
	return el.value != undefined
		 ? el.value = value 	: (el.innerHTML != undefined
		 ? el.innerHTML = value : null);
}
