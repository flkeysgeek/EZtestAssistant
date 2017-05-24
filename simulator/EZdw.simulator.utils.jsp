<%@page import="java.text.*, java.util.*, java.io.*,
				java.util.regex.*,
				javax.servlet.http.*, idetix.util.* "
%><%
	errmsg = "";
	stacktrace = "";
	message = "";
	this.request = request;


  // set some headers to force various browsers to not cache pages
  response.setHeader("Cache-Control", "no-cache");
  response.setHeader("Pragma", "no-cache");

  // set expired date to previous day, tricking some browsers into
  // thinking that thier cache is too old.
  GregorianCalendar cal = new GregorianCalendar();
  cal.roll( Calendar.DAY_OF_MONTH, -1 );
  java.util.Date yesterday = cal.getTime();
  SimpleDateFormat formatter = new SimpleDateFormat();
  formatter.applyPattern( "EEE, dd MMM yyyy HH:mm:ss z" );
  String expiredDate = formatter.format(yesterday);
  response.setHeader("Expires", expiredDate );

%><%!
String errmsg;
String stacktrace;
static String message;
HttpServletRequest request;

/**
 *
 */
String getParameterString(String name) 
{ return getParameterString(name, ""); }

String getParameterString(String name, String defaultValue)
{
	String value = request.getParameter(name);
	if (value == null) value = defaultValue;
	return value;
}

/**
 *	return ArrayList<String> as json reprentation of array.
 *
 *	e.g. list.get(0)="a" -- list.get(1)="b" --> ["a","b"]
 */
String toJsonArray(List list)
{
	if (list.size() == 0) return "[]";
	String json = list.toString();
	json = json.substring(1,json.length()-1);
//	json = json.replace('[','"').replace(']','"');
	json = json.replaceAll(", ", "\",\"");
	return "[\"" + json + "\"]";
}
/**
 *	FormatException fe = new FormatException(e);
 *
 *	returns:
 *		fe.message
 *		fe.stacktrace
 *
 *	where
 *		fe.stacktrace	String representation of e.printStackTrace() w/o e.getMessage()
 *		fe.message either e.getMessage() -or- if null  or blank, message from stacktrace
 */
public class FormatException
{
	public String message = "";
	public String stacktrace = "";
	FormatException(Exception e)
	{
		message = e.getMessage();
		if (message == null) message = "";
		message = message.trim().replace('\\','/');
		stacktrace = StringUtils.convertStackTraceToString(e).replace('\\','/');
		process(e);
	}
	void process(Exception e)
	{
		try
		{	// if stacktrace starts with message, remove it
			int offset = stacktrace.indexOf(message);
			if (offset != -1)
			{
				stacktrace = stacktrace.substring(0,offset)
						   + stacktrace.substring(offset + message.length());
			}
			stacktrace = stacktrace.replaceAll("\n\\s*\n", "\n").trim();

			// format 1st line of stacktrace
			offset = stacktrace.indexOf('\n');
			if (offset != -1)
			{
				String first = stacktrace.substring(0,offset);
				String rest = stacktrace.substring(offset+1).trim();

				// find newline after 1st colon e.g. Revize.request.RevizeRequestException:
				offset = first.indexOf(':');
				if (offset != -1)
				{
					String more = first.substring(offset+1).trim();
					first = first.substring(0,offset+1).trim() + "\n";
					more = more.replaceAll("\\.", ".\n");
					more = more.replaceAll("\\(", "\n(");
					first += more;
				}
				first = first.replaceAll("\n\\s*\n", "\n").trim();

				stacktrace = stacktrace.replaceAll("\n\\s*\n", "\n").trim();

				if (message.length() == 0)
					message = first + " -- " + rest.substring(0, rest.indexOf('\n'));
			}
		}
		catch (Exception format) {}
		if (e instanceof NullPointerException && e.getCause() != null)
			stacktrace += "\n\n" + StringUtils.convertStackTraceToString(e.getCause());
	}
}
%>
