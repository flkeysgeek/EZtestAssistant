/*--------------------------------------------------------------------------------------------------
LINT options -- function below not called
--------------------------------------------------------------------------------------------------*/
/*global 
	EZ, e:true, g, dw, DWfile, 
	define, Encoder:true, EZwarn
*/

var e;
(function jshint_globals_not_used() {	//global variables and functions defined but not used
	e = [e, g, dw, DWfile,
e]});
/*---------------------------------------------------------------------------------------
Determine if offsets are inside markers[0] and markers[1] characters by counting each and
returning the difference of markers[0] - markers[1].

If offsets[0] is markers[0] then inside until diff <= 0 (equal or more markers[1]'s)
If offsets[0] is past markers[0] then inside until diff < 0 (more markers[1]'s)

TODO: handle reqular expression; escapeRegEx is one test case
---------------------------------------------------------------------------------------------*/
EZ.countDiff = function EZcountDiff(doc,markers,offsets)
{
	if (arguments.length > 3) EZwarn('Too Many Arguments');
	
	// if markers specifies tag
	if (typeof(markers) == 'string')
		markers = ['<' + markers, '</' + markers];
	
	var charBegCount = 0;
	var charEndCount = 0;
	var charBegPattern = new RegExp( EZ.escapeRegEx(markers[0]), 'gi');
	var charEndPattern = new RegExp( EZ.escapeRegEx(markers[1]), 'gi');
	var results;
	
	var source = 'source';
	if (typeof(doc[source]) == 'undefined')
		source = 'outerHTML';
	if (typeof(doc[source]) == 'undefined')
		return 0;	
	
	if (!doc[source]) return 'empty string';
	if (offsets[1] <= offsets[0]) return 'end <= beg';	//have not moved past the start

	// count of markers[0] occurances
	results = doc[source].substring(offsets[0],offsets[1]).match(charBegPattern);
	if (results != null) charBegCount = results.length;

	// count of markers[1] occurances
	results = doc[source].substring(offsets[0],offsets[1]).match(charEndPattern);
	if (results != null) charEndCount = results.length;

	//---------------------------------
	return charBegCount - charEndCount;		//return difference
	//---------------------------------
}
/*---------------------------------------------------------------------------------------------
Called by EZcountDiff() and other bookmark functions.
---------------------------------------------------------------------------------------------*/
EZ.escapeRegEx = function EZescapeRegEx(regex)
{
	var special = '^$.*+?=!:|()[]{}\\';
	var specialEscaped = '';
	for (var i=0;i<special.length;i++)
		specialEscaped += '\\' + special.charAt(i);
	specialEscaped = new RegExp('([' + specialEscaped + '])','g');
	regex = regex.replace(specialEscaped,'\\$1');
	return regex;
}
/*--------------------------------------------------------------------------------------------------
EZ.fuzzySearch(searchWord, searchList) 

Does simple fuzzy search for specified searchWord in specified searchList Array and returns Array
indexes of all matching items,

If EZ.fuzzySearch.cancel set true any RegExp error occures, search terminates and returns intermeiate 
results and cancel time or error object and failing RegExp.

ARGUMENTS:
	searchWord	String containing search string.
	searchList	Array containing Strings to search.

RETURNS:
	results as Array Object containing Array indexes of fuzzy matches
	results.pattern String containing pattern used for search
	results.seconds Number as fractional seconds taken for search as s.mmm
	results.cancel set to EZ.fuzzySearch.cancel when search canceled
	
https://github.com/krisk/Fuse
http://kiro.me/projects/fuse.html
--------------------------------------------------------------------------------------------------*/
EZ.fuzzySearch = function EZfuzzySearch(searchWord, searchList, maxItems) 
{
	var i;
	var now = new Date();
	var results = [];
	results.items = [];
	delete EZ.fuzzySearch.cancel;
	
	if (!searchWord || !searchList) return results;
	searchWord = searchWord.trim().toLowerCase();
	searchList = EZ.toArray(searchList);
	
	var pattern = ''
	for (i=0; i<searchWord.length; i++)		//build regex from searchWord
	{
		var ch = searchWord.substr(i,1);
		if (ch == ']') ch = '\\]';
		pattern += '[^' + ch + ']*' + ch;
	}
	results.pattern = pattern;
	try										//find all matches
	{
		var regex = new RegExp(pattern,'i');
		for (i=0; i<searchList.length; i++)	
		{
			if (EZ.fuzzySearch.cancel)
			{
				results.cancel = EZ.fuzzySearch.cancel;
				break;
			}
			var listWord = searchList[i].trim().toLowerCase();
			if (listWord.indexOf(searchWord) == -1
			&& searchWord.indexOf(listWord) == -1
			&& !regex.test(searchList[i])) 
				continue;
			results.items.push(i);
			results.push(searchList[i]);
			if (maxItems && results.length >= maxItems) break;
		}
	}
	catch (e)
	{
		//EZ.techSupport(e);
	}
	results.seconds = (new Date().getTime()-now.getTime()) / 1000 / 60;
	return results;
}
// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
//_____________________________________________________________________________________________
EZ.fuzzySearch.test = function()
{
	var list = 'abc abcdef xyz wxyz '
//			 + 'EZwait EZrecieveArguments EZbuttons EZrunCommand EZclose EZcommandStatus '
//			 + 'EZisDebug EZloadPrefs EZsavePref EZsavePrefs restablishes EZrun object or '
//			 + 'scope that scope EZdebugger using as xxx this name so created';
	list = EZ.toArray(list, ' ');
	EZ.test.run('abd',list, 							{EZ: {ex:[],	note:''	}})
	EZ.test.run('bc',list, 								{EZ: {ex:[],	note:''	}})
}

/**
 * A Javascript object to encode and/or decode html characters using HTML or Numeric entities that handles double or partial encoding
 * Author: R Reid
 * source: http://www.strictly-software.com/htmlencode
 * Licences: GPL, The MIT License (MIT)
 * Copyright: (c) 2011 Robert Reid - Strictly-Software.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * Revision:
 *  2011-07-14, Jacques-Yves Bleau: 
 *       - fixed conversion error with capitalized accentuated characters
 *       + converted arr1 and arr2 to object property to remove redundancy
 *
 * Revision:
 *  2011-11-10, Ce-Yi Hio: 
 *       - fixed conversion error with a number of capitalized entity characters
 *
 * Revision:
 *  2011-11-10, Rob Reid: 
 *		 - changed array format
 */

Encoder = {

	// When encoding do we convert characters into html or numerical entities
	EncodeType : "entity",  // entity OR numerical

	isEmpty : function(val){
		if(val){
			return ((val===null) || val.length===0 || /^\s+$/.test(val));
		}else{
			return true;
		}
	},
	
	// arrays for conversion from HTML Entities to Numerical values
	arr1: ['&nbsp;','&iexcl;','&cent;','&pound;','&curren;','&yen;','&brvbar;','&sect;','&uml;','&copy;','&ordf;','&laquo;','&not;','&shy;','&reg;','&macr;','&deg;','&plusmn;','&sup2;','&sup3;','&acute;','&micro;','&para;','&middot;','&cedil;','&sup1;','&ordm;','&raquo;','&frac14;','&frac12;','&frac34;','&iquest;','&Agrave;','&Aacute;','&Acirc;','&Atilde;','&Auml;','&Aring;','&AElig;','&Ccedil;','&Egrave;','&Eacute;','&Ecirc;','&Euml;','&Igrave;','&Iacute;','&Icirc;','&Iuml;','&ETH;','&Ntilde;','&Ograve;','&Oacute;','&Ocirc;','&Otilde;','&Ouml;','&times;','&Oslash;','&Ugrave;','&Uacute;','&Ucirc;','&Uuml;','&Yacute;','&THORN;','&szlig;','&agrave;','&aacute;','&acirc;','&atilde;','&auml;','&aring;','&aelig;','&ccedil;','&egrave;','&eacute;','&ecirc;','&euml;','&igrave;','&iacute;','&icirc;','&iuml;','&eth;','&ntilde;','&ograve;','&oacute;','&ocirc;','&otilde;','&ouml;','&divide;','&oslash;','&ugrave;','&uacute;','&ucirc;','&uuml;','&yacute;','&thorn;','&yuml;','&quot;','&amp;','&lt;','&gt;','&OElig;','&oelig;','&Scaron;','&scaron;','&Yuml;','&circ;','&tilde;','&ensp;','&emsp;','&thinsp;','&zwnj;','&zwj;','&lrm;','&rlm;','&ndash;','&mdash;','&lsquo;','&rsquo;','&sbquo;','&ldquo;','&rdquo;','&bdquo;','&dagger;','&Dagger;','&permil;','&lsaquo;','&rsaquo;','&euro;','&fnof;','&Alpha;','&Beta;','&Gamma;','&Delta;','&Epsilon;','&Zeta;','&Eta;','&Theta;','&Iota;','&Kappa;','&Lambda;','&Mu;','&Nu;','&Xi;','&Omicron;','&Pi;','&Rho;','&Sigma;','&Tau;','&Upsilon;','&Phi;','&Chi;','&Psi;','&Omega;','&alpha;','&beta;','&gamma;','&delta;','&epsilon;','&zeta;','&eta;','&theta;','&iota;','&kappa;','&lambda;','&mu;','&nu;','&xi;','&omicron;','&pi;','&rho;','&sigmaf;','&sigma;','&tau;','&upsilon;','&phi;','&chi;','&psi;','&omega;','&thetasym;','&upsih;','&piv;','&bull;','&hellip;','&prime;','&Prime;','&oline;','&frasl;','&weierp;','&image;','&real;','&trade;','&alefsym;','&larr;','&uarr;','&rarr;','&darr;','&harr;','&crarr;','&lArr;','&uArr;','&rArr;','&dArr;','&hArr;','&forall;','&part;','&exist;','&empty;','&nabla;','&isin;','&notin;','&ni;','&prod;','&sum;','&minus;','&lowast;','&radic;','&prop;','&infin;','&ang;','&and;','&or;','&cap;','&cup;','&int;','&there4;','&sim;','&cong;','&asymp;','&ne;','&equiv;','&le;','&ge;','&sub;','&sup;','&nsub;','&sube;','&supe;','&oplus;','&otimes;','&perp;','&sdot;','&lceil;','&rceil;','&lfloor;','&rfloor;','&lang;','&rang;','&loz;','&spades;','&clubs;','&hearts;','&diams;'],
	arr2: ['&#160;','&#161;','&#162;','&#163;','&#164;','&#165;','&#166;','&#167;','&#168;','&#169;','&#170;','&#171;','&#172;','&#173;','&#174;','&#175;','&#176;','&#177;','&#178;','&#179;','&#180;','&#181;','&#182;','&#183;','&#184;','&#185;','&#186;','&#187;','&#188;','&#189;','&#190;','&#191;','&#192;','&#193;','&#194;','&#195;','&#196;','&#197;','&#198;','&#199;','&#200;','&#201;','&#202;','&#203;','&#204;','&#205;','&#206;','&#207;','&#208;','&#209;','&#210;','&#211;','&#212;','&#213;','&#214;','&#215;','&#216;','&#217;','&#218;','&#219;','&#220;','&#221;','&#222;','&#223;','&#224;','&#225;','&#226;','&#227;','&#228;','&#229;','&#230;','&#231;','&#232;','&#233;','&#234;','&#235;','&#236;','&#237;','&#238;','&#239;','&#240;','&#241;','&#242;','&#243;','&#244;','&#245;','&#246;','&#247;','&#248;','&#249;','&#250;','&#251;','&#252;','&#253;','&#254;','&#255;','&#34;','&#38;','&#60;','&#62;','&#338;','&#339;','&#352;','&#353;','&#376;','&#710;','&#732;','&#8194;','&#8195;','&#8201;','&#8204;','&#8205;','&#8206;','&#8207;','&#8211;','&#8212;','&#8216;','&#8217;','&#8218;','&#8220;','&#8221;','&#8222;','&#8224;','&#8225;','&#8240;','&#8249;','&#8250;','&#8364;','&#402;','&#913;','&#914;','&#915;','&#916;','&#917;','&#918;','&#919;','&#920;','&#921;','&#922;','&#923;','&#924;','&#925;','&#926;','&#927;','&#928;','&#929;','&#931;','&#932;','&#933;','&#934;','&#935;','&#936;','&#937;','&#945;','&#946;','&#947;','&#948;','&#949;','&#950;','&#951;','&#952;','&#953;','&#954;','&#955;','&#956;','&#957;','&#958;','&#959;','&#960;','&#961;','&#962;','&#963;','&#964;','&#965;','&#966;','&#967;','&#968;','&#969;','&#977;','&#978;','&#982;','&#8226;','&#8230;','&#8242;','&#8243;','&#8254;','&#8260;','&#8472;','&#8465;','&#8476;','&#8482;','&#8501;','&#8592;','&#8593;','&#8594;','&#8595;','&#8596;','&#8629;','&#8656;','&#8657;','&#8658;','&#8659;','&#8660;','&#8704;','&#8706;','&#8707;','&#8709;','&#8711;','&#8712;','&#8713;','&#8715;','&#8719;','&#8721;','&#8722;','&#8727;','&#8730;','&#8733;','&#8734;','&#8736;','&#8743;','&#8744;','&#8745;','&#8746;','&#8747;','&#8756;','&#8764;','&#8773;','&#8776;','&#8800;','&#8801;','&#8804;','&#8805;','&#8834;','&#8835;','&#8836;','&#8838;','&#8839;','&#8853;','&#8855;','&#8869;','&#8901;','&#8968;','&#8969;','&#8970;','&#8971;','&#9001;','&#9002;','&#9674;','&#9824;','&#9827;','&#9829;','&#9830;'],
		
	// Convert HTML entities into numerical entities
	HTML2Numerical : function(s){
		return this.swapArrayVals(s,this.arr1,this.arr2);
	},	

	// Convert Numerical entities into HTML entities
	NumericalToHTML : function(s){
		return this.swapArrayVals(s,this.arr2,this.arr1);
	},


	// Numerically encodes all unicode characters
	numEncode : function(s){
		
		if(this.isEmpty(s)) return "";

		var e = "";
		for (var i = 0; i < s.length; i++)
		{
			var c = s.charAt(i);
			if (c < " " || c > "~")
			{
				c = "&#" + c.charCodeAt() + ";";
			}
			e += c;
		}
		return e;
	},
	
	// HTML Decode numerical and HTML entities back to original values
	htmlDecode : function(s){

		var c,m,d = s;
		
		if(this.isEmpty(d)) return "";

		// convert HTML entites back to numerical entites first
		d = this.HTML2Numerical(d);
		
		// look for numerical entities &#34;
		var arr=d.match(/&#[0-9]{1,5};/g);
		
		// if no matches found in string then skip
		if(arr!=null){
			for(var x=0;x<arr.length;x++){
				m = arr[x];
				c = m.substring(2,m.length-1); //get numeric part which is refernce to unicode character
				// if its a valid number we can decode
				if(c >= -32768 && c <= 65535){
					// decode every single match within string
					d = d.replace(m, String.fromCharCode(c));
				}else{
					d = d.replace(m, ""); //invalid so replace with nada
				}
			}			
		}

		return d;
	},		

	// encode an input string into either numerical or HTML entities
	htmlEncode : function(s,dbl){
			
		if(this.isEmpty(s)) return "";

		// do we allow double encoding? E.g will &amp; be turned into &amp;amp;
		dbl = dbl || false; //default to prevent double encoding
		
		// if allowing double encoding we do ampersands first
		if(dbl){
			if(this.EncodeType=="numerical"){
				s = s.replace(/&/g, "&#38;");
			}else{
				s = s.replace(/&/g, "&amp;");
			}
		}

		// convert the xss chars to numerical entities ' " < >
		s = this.XSSEncode(s,false);
		
		if(this.EncodeType=="numerical" || !dbl){
			// Now call function that will convert any HTML entities to numerical codes
			s = this.HTML2Numerical(s);
		}

		// Now encode all chars above 127 e.g unicode
		s = this.numEncode(s);

		// now we know anything that needs to be encoded has been converted to numerical entities we
		// can encode any ampersands & that are not part of encoded entities
		// to handle the fact that I need to do a negative check and handle multiple ampersands &&&
		// I am going to use a placeholder

		// if we don't want double encoded entities we ignore the & in existing entities
		if(!dbl){
			s = s.replace(/&#/g,"##AMPHASH##");
		
			if(this.EncodeType=="numerical"){
				s = s.replace(/&/g, "&#38;");
			}else{
				s = s.replace(/&/g, "&amp;");
			}

			s = s.replace(/##AMPHASH##/g,"&#");
		}
		
		// replace any malformed entities
		s = s.replace(/&#\d*([^\d;]|$)/g, "$1");

		if(!dbl){
			// safety check to correct any double encoded &amp;
			s = this.correctEncoding(s);
		}

		// now do we need to convert our numerical encoded string into entities
		if(this.EncodeType=="entity"){
			s = this.NumericalToHTML(s);
		}

		return s;					
	},

	// Encodes the basic 4 characters used to malform HTML in XSS hacks
	XSSEncode : function(s,en){
		if(!this.isEmpty(s)){
			en = en || true;
			// do we convert to numerical or html entity?
			if(en){
				s = s.replace(/\'/g,"&#39;"); //no HTML equivalent as &apos is not cross browser supported
				s = s.replace(/\"/g,"&quot;");
				s = s.replace(/</g,"&lt;");
				s = s.replace(/>/g,"&gt;");
			}else{
				s = s.replace(/\'/g,"&#39;"); //no HTML equivalent as &apos is not cross browser supported
				s = s.replace(/\"/g,"&#34;");
				s = s.replace(/</g,"&#60;");
				s = s.replace(/>/g,"&#62;");
			}
			return s;
		}else{
			return "";
		}
	},

	// returns true if a string contains html or numerical encoded entities
	hasEncoded : function(s){
		if(/&#[0-9]{1,5};/g.test(s)){
			return true;
		}else if(/&[A-Z]{2,6};/gi.test(s)){
			return true;
		}else{
			return false;
		}
	},

	// will remove any unicode characters
	stripUnicode : function(s){
		return s.replace(/[^\x20-\x7E]/g,"");
	},

	// corrects any double encoded &amp; entities e.g &amp;amp;
	correctEncoding : function(s){
		return s.replace(/(&amp;)(amp;)+/,"$1");
	},


	// Function to loop through an array swaping each item with the value from another array e.g swap HTML entities with Numericals
	swapArrayVals : function(s,arr1,arr2){
		if(this.isEmpty(s)) return "";
		var re;
		if(arr1 && arr2){
			//ShowDebug("in swapArrayVals arr1.length = " + arr1.length + " arr2.length = " + arr2.length)
			// array lengths must match
			if(arr1.length == arr2.length){
				for(var x=0,i=arr1.length;x<i;x++){
					re = new RegExp(arr1[x], 'g');
					s = s.replace(re,arr2[x]); //swap arr1 item with matching item from arr2	
				}
			}
		}
		return s;
	},

	inArray : function( item, arr ) {
		for ( var i = 0, x = arr.length; i < x; i++ ){
			if ( arr[i] === item ){
				return i;
			}
		}
		return -1;
	}

}
/*---------------------------------------------------------------------------------------------
Reference: https://github.com/moagrius/stripcomments
---------------------------------------------------------------------------------------------*/
EZ.commentStripper = (function (window) 
{
    var SLASH = '/';
    var BACK_SLASH = '\\';
    var STAR = '*';
    var DOUBLE_QUOTE = '"';
    var SINGLE_QUOTE = "'";
    var NEW_LINE = '\n';
    var CARRIAGE_RETURN = '\r';

    var EZcommentStripper = function() {};
    EZcommentStripper.prototype = {
        string: '',
        length: 0,
        position: 0,
        output: null,
		isClean: false,

        getCurrentCharacter: function () {return this.string.charAt(this.position)},
        getPreviousCharacter: function () {return this.string.charAt(this.position - 1)},
        getNextCharacter: function () {return this.string.charAt(this.position + 1)},
		
		getRestOfLine: function () 
		{
			return this.string.substr(this.position).replace(/(.*)([\s\S]*)/, '$1');
		},
		
        add: function () {this.output.push(this.getCurrentCharacter())},
        next: function () {this.position++},
        atEnd: function () {return this.position >= this.length},

        isEscaping: function () 
		{
            if (this.getPreviousCharacter() == BACK_SLASH) 
			{
                var offset = 1;
                var escaped = true;
                while ((this.position - offset) > 0) 
				{
                    escaped = !escaped;
                    var current = this.position - offset;
                    if (this.string.charAt(current) != BACK_SLASH) return escaped;
                    offset++;
                }
                return escaped;
            }
            return false;
        },
        processSingleQuotedString: function () 
		{
            if (this.getCurrentCharacter() == SINGLE_QUOTE) 
			{
                this.add();
                this.next();
                while (!this.atEnd()) 
				{
                    if (this.getCurrentCharacter() == SINGLE_QUOTE && !this.isEscaping()) return;
                    if (!this.isClean) this.add();
                    this.next();
                }
            }
        },
        processDoubleQuotedString: function () 
		{
            if (this.getCurrentCharacter() == DOUBLE_QUOTE) 
			{
                this.add();
                this.next();
                while (!this.atEnd()) 
				{
                    if (this.getCurrentCharacter() == DOUBLE_QUOTE && !this.isEscaping()) return;
                    if (!this.isClean) this.add();
                    this.next();
                }
            }
        },
        processRegex: function () 
		{
            if (this.getCurrentCharacter() == SLASH) 
			{
                if (this.getNextCharacter() != STAR 
                && this.getNextCharacter() != SLASH
                && this.getRestOfLine().substr(1).indexOf('/') != -1) 	//DCO 03-09-2016
				{
                    if (this.isClean)
					{
						this.add();				//add slash
						this.output.push('.');	//dummy char
					}
					while (!this.atEnd()) 
					{
	                    if (!this.isClean) this.add();
                        this.next();
                        if (this.getCurrentCharacter() == SLASH && !this.isEscaping()) return;
                    }
                }
            }
        },
        processSingleLineComment: function () 
		{
            if (this.getCurrentCharacter() == SLASH) 
			{
                if (this.getNextCharacter() == SLASH) 
				{
                    this.next();
                    while (!this.atEnd()) 
					{
                        this.next();
                        if (this.getCurrentCharacter() == NEW_LINE || this.getCurrentCharacter() == CARRIAGE_RETURN)
                            return;
                    }
                }
            }
        },
        processMultiLineComment: function () 
		{
            if (this.getCurrentCharacter() == SLASH) 
			{
                if (this.getNextCharacter() == STAR) 
				{
                    if (this.isClean)
					{
						this.output.push('/* */');	//placeholder
					}
                    this.next();
                    while (!this.atEnd()) 
					{								//retain lines
                        if (this.getCurrentCharacter() == NEW_LINE) this.add();
						this.next();
                        if (this.getCurrentCharacter() == STAR) 
						{
                            if (this.getNextCharacter() == SLASH) 
							{
                                this.next();
                                this.next();
                                return;
                            }
                        }
                    }
                }
            }
        },
        process: function () 
		{
            while (!this.atEnd()) 
			{
                this.processRegex();
                this.processDoubleQuotedString();
                this.processSingleQuotedString();
                this.processSingleLineComment();
                this.processMultiLineComment();
                if (!this.atEnd()) 
				{
                    this.add();
                    this.next();
                }
            }
        },
        reset: function () 
		{
            this.string = '';
            this.length = 0;
            this.position = 0;
            this.output = [];
        },
		/** DCO 06-01-2015: new function
		 * 	removes comments -AND- colapses strings to empty strings and regex to /./
		 *	used by EZgetFunctionList() to determine nesting level by counting brackets.
		 */
        clean: function (string) 
        {
			this.strip(string, true)
		},
        strip: function (string, isClean) 
		{
            this.reset();
			this.isClean = isClean;
            this.string = string;
            this.length = this.string.length;
            this.process();
            return this.output.join('');
        }
    };
    if (typeof define === 'function') 
	{
        define('EZcommentstripper', [], function () 
		{
            return EZcommentStripper;
        });
    }
    return window.EZcommentStripper = EZcommentStripper;

})(window);


/*--------------------------------------------------------------------------------------------------
EZ.getFunctionName(skip, rtnObj)

Originally created for EZ.capture() including EZ.techSupport() new capture and EZ.fault() interfaces.

Consolidates a lot of function and call statement parsing as well as new logic to derive fn from
call stack when function name property is blank (e.g. closures and Object properties).

Works quite well when called with fn String or Regex -- using know stack position -- Chrome always 
has fn name on call stack (even for unnmed fn) will use variable or Object key assigned to function.
Is not nested name.

ARGUMENTS:
	fn			(required)	specifies function or fn name -- If blank or omitted get immediate caller.
				(String) 	name or regular expression of stack line immediately proceeding the function
				(RegExp)	name returned.  
				
				(Function) 	return name for this function -- if the function does not have name property,
							the stack is searched for matching function (stack name must have global scope)
							If not found on stack, the script containing the function is searched for the
							variable or Object key containing function statement.
	
	rtnObj	(optional)	If Object, following fn properties returned:
						filename:
						lineno:
						column:
						
						TODO: ...
						statement:	string containing call statement
						argNames:	Array containing named arguments on function state
						callNames:	Array containing variable names from call statement or json
						 			representaion of expression if call argument not a variable
						script:		function script if available
						
						arguments:	current fn arguments Object if from is function -or-
									fn name has global scope
	
	
RETURNS:
	specified from function name
	rtnObj set to fn properties descibed above

TODO:
	only implemented funtionality used by EZ.capture
	find function name by recursively looking for macth to an Object in the from context.	
--------------------------------------------------------------------------------------------------*/
EZ.functions.getName = function EZfunctions_getName(fn, rtnObj)
{
	var isNext = false
	switch (EZ.getType(fn, NaN))
	{						//sort arguments
		case 'String':
		case 'RegExp':
			isNext = true;	//next fn on stack
			break;
		case 'Number':		//no of fn before us on stack
		case 'Function':	//get name for specified fn 
			break;			//good as-is
		
		case 'Array': 	
		case 'Object': 		//fn omitted
		{
			rtnObj = fn;
			fn = 0;
			break;
		}
		default:			//including NaN
			fn = 0;			//immediate caller on stack
	}

	var name, stack;
	while (true)
	{
		if (typeof(fn) == 'function')
			name = fn.name || fn.displayName;
		if (name) break;
//345678901234                	
		stack = EZ.stackx(fn, isNext);	//get fn from stack 
		if (!stack.fault) 
		{			
			name = stack.get('name');
			if (name) break;
		}
		//TODO: not tested
		//name = EZ.functions.mapName(fn);	
		//if (name) break;
		
		return '';		//fn name not found
	}
	  //-------------------------------------------------\\
	 //----- return fn properties if rtnObj supplied -----\\
	//-----------------------------------------------------\\
	while (typeof(rtnObj) == 'object')
	{
		if (!stack) stack = EZ.stackx(name);			
		if (stack.fault) break;							//bail if fn name not found on stack
		
		var url = stack.get('url');						//call stack url, lineno, column
		url = url.replace(/(http:.*?)\/(?=\w+\.(js|htm|html|php|jsp|asp))/g, '.../');	//TODO: ??
		rtnObj.url = url;
		rtnObj.lineno = stack.get('lineno');
		rtnObj.column = stack.get('column');
	
		/*TODO:	needs work -- but EZ.capture not using yet
		var args = EZ.stack.get('arguments',stack,fn);	//get fn and call statement arguments
		if (!args) break;								//bail if not available
		
														//save fn statement 
		
		rtnObj.arguments = [];							//save json of call arguments values
		for (var i=0; i<args.length; i++)
			rtnObj.arguments[i] = EZ.stringify(args[i], '*');
		*/											
		break;
	}
	//==========
	return name;
	//==========
}
/*--------------------------------------------------------------------------------------------------
EZ.stack([sliceTo,] [stack])

Always removes messages at top of stack (and line containing EZstack function if stack not supplied)

ARGUMENTS:
	sliceTo	(optional) 	specifies lines removed from top of stack if supplied as follows:
			(Number)	number of lines removed after messages -- can be 0
			
			(String)	specifies function name -- all lines preceeding the last line containing
			(RegExp)	the specified name are removed.
			
			(function)	All lines proceeding last occurance are removed -OR- all lines if function
						NOT found.  The function must have name property or global scope.
	
	stack	(optional) 	If omitted current stack is used with messages and EZstack line are removed.
						can be stack (Array or String) or function. If function, all lines proceeding
						function are removed from current stack before removing lines specified by "sliceTo"

RETURNS:
	stack as Array with lines removed as explained above and the following named Array properties:
		messages	all messages at top of stack as Array if any otherwise undefined
		fault		EZfault Object if any exceptions occured	

TODO:
	
Creates new stack object containing the following properties:
 *		name, url, linenno, column parsed from stack
 *		statement, argNames, callNames, callTypes come from fn script
 *		callee: fn Object if supplied or name on top fn on stack has global scope
 				TODO: -or- useMap is true
				
 *		arguments comes from function arguments property
 			always added if fn argument is fn or name on stack has global scope
			
 is json representation of currents values from arguments stack

--------------------------------------------------------------------------------------------------*/
EZ.stackx = function EZstack(sliceTo,stack,options,c)
{
	if ( !(this instanceof arguments.callee) ) 	//if not called as constructor...
	{
		var c = arguments.callee.caller;
		return new EZ.stackx(sliceTo,stack,options,c);
	}
	if (EZ.getConstructorName(sliceTo) == 'EZstack')
	{									//is 1st arg prior EZstack Object
		options = stack;
		stack = sliceTo;
		sliceTo = 0;
	}
	if (EZ.getConstructorName(stack) == 'EZstack')	
	{									//use prior stack if supplied
		this.lines = stack.lines;	
		this.fnValues = stack.fnValues;	
	}
	else 
	{
		options = stack;
		stack = '';
	}
	options = EZ.getOptionsNew(options, 'useMap');

	this.lines = stack ? [] : new Error().stack.split('\n').slice(3);
	this.fn	= null;							//fn object if available

	this.values = {						
		nestedName: '',					//from fnList if requested TODO:
		
		name: '',						//parsed from call stack
		lineno: '',
		column: '',
		url: '',
		
		statement: '',					//parsed from fn script if avail
		argNames: [],					//		''
		
		arguments: null,				//parsed from caller script if avail -- TODO:
		callNames: [],					//		''
		callTypes: [],					//		''
		
		stale: true						//get() clears -- sliceTo() resets to true
	}
	//options = options && typeof(options) == 'object' ? options : {useMap: Boolean(options)}
	
	var init = function(caller)
	{
		  //-------------------------------------------------\\
		 //----- map unique functions on arguments stack -----\\
		//-----------------------------------------------------\\
		var processed = [];				//avoid circular loop
		for (var fn = caller; fn != null; fn = fn.caller)
		{
			if (processed.includes(fn)) break;
			processed.push(fn);
			EZ.functions.add(fn)		//add to fn list if not there
		}
		
		this.sliceTo(sliceTo, options);				
		return this;
	}
	//________________________________________________________________________________________
	/**
	 *	slice stack lines upto fn if after omitted or false otherwise slice thru fn.
	 *	if fn is number, it specifies number of lines == same as stack.lines.slice(#) except
	 *	messages are 1st prepended to stack.messages.
	 *
	 *	if fn is typeof function or string slice up to fisrt occurance if RegExp slice upto
	 *	last occurance.
	 *
	 *	returns true if fn found otherwise false
	 *		stack.fault set to EZfault object if js error occurs -- usually bad RegExp
	 */
	this.sliceTo = function(fn, after /* todo */)
	{
		var fn, name, count;		
		var options = EZ.getOptionsNew(after, 'after');
		var stack = this;

		if (!isNaN(fn))
			fn = parseInt(fn) || 0;
		switch (EZ.getType(fn))
		{
			case 'Number':
			{
				count = fn;
				fn = '';
				break;
			}
			case 'String':
			case 'RegExp':	break;
			case 'Function':
			{
				stack.fn = fn;
				name = fn.name || fn.displayName;
				break;
			}
			default:
			{
				return false;
			}
		}
		var lines = stack.lines.slice();		//clone stack.lines
		var messages = [];						//remove messages
		while (lines.length && !lines[0].includes(' at '))
			messages.push(lines.shift())
		
		try										//slice
		{
			var isFound = false;
			if (count !== undefined)			//specified # lines
			{
				isFound = true;
				lines = lines.slice(count);
			}
			else if (name)						//slice to name
			{
				var pattern = name;
				if (EZ.getType(pattern) == 'RegExp')
					pattern = pattern.source.replace(/\//g, '\\/');	//.replace(/\\/g, '\\\\');
				else if (/^(["'])(.*?)\1$/.test(name))	
					pattern = pattern.substr(1).clip();
		
				pattern = pattern.replace(/\/(.*)\/.*/, '$1');
			
				pattern = "[\\s\\S]*"
						+ "(    at (Function\\.)?" 	//start of to line
						+ pattern + "[\\s\\S]*)"; 
						+ " .*)"					//end of to line
				if (EZ.getType(name) != 'RegExp')
						+ "(\\s*?)( [\\s\\S]*)";
				
				var lines = stack.lines.join('\n');
				lines = lines.replace(RegExp(pattern), function(all, line, rest)
				{
					isFound = true;
					return (options.sliceThru ? line : '') + rest;
				});
				lines = lines.split('\n');
				if (!isFound)
					return false;
				
			}
			else									//slice to fn with unknown name
			{
				//var map = {}
				//var notGlobal = false;
				var lines = stack.lines.slice(0);
				while (true)				
				{
					var fn;
					isFound = !lines.some(function(line)
					{
						var pattern = /[\s\S]*\s+at ((Function|Object)\.)?(\S+)/;
						var results = line.match(pattern);
						while (results && results[3])
						{
							var stackName = results[3] || '';
							if (!stackName) break;		//ignore stack lines w/o function name
							if (name != stackName)		
							{							//if names don't match, compare fn Object
								fn = stackName.ov();
								if (fn != sliceTo) return;
							}
							return true;
						}
						lines.shift();					//remove next line from stack returned
					});
					if (!isFound) return false;
					if (fn)
						stack.fn = fn;
					break; 
				}
			}
		}
		catch (e) 
		{
			stack.fault = EZ.techSupport(e,this);
			return false;
		}
		stack.values.stale = true;
		stack.lines = lines;
		if (messages.length)
			stack.messages = messages.concat(stack.messages || []);
		return stack;
	}
	//__________________________________________________________________________________________________
	/**
	 *	update stack.fn properties if stale then return property specified by key or all if key omitted.
	 *	when properties stale or do not exist update using fn if supplied or updated EZ.functions.map().
	 
		at EZfunctions_getName:660                  (.../EZcommonParse.js:660)
		at myfn:1133                                (.../EZcommonParse.js:1133)
		at EZ.functions.getNameStackTest:1145       (.../EZcommonParse.js:1145)
		at EZtest_run:525                           (.../EZtest_assistant_run.js:525)
		at EZ.functions.getNameStackTest.test:1190  (.../EZcommonParse.js:1190)
		at .../EZtest_assistant_run.js:65           "
   	 */
	this.get = function(key, fn, options)
	{
		var stack = this;
		if (typeof(key) == 'function')
		{
			options = fn;
			fn = key;
			key = '';
		}
		if (typeof(fn) != 'function')
		{
			options = fn;
			fn = '';
		}
		key = key || '';
		options = EZ.getOptionsNew(options, 'map')
		
		var values = stack.values;
		while (!values || values.stale)
		{
			values = {};
			var line = stack.lines[0];
			if (!line) break;					//bail if no stack line (i.e. only messages or length = 0)
			
			var results = line.match(/[\s\S]*\s+at ((Function|Object)\.)?(\S+)(.*)/);
			while (results) 					//at least fn name found from top of stack
			{									
				values = stack.values = {};
				values.name = results[3] || '';
				if (!fn)						//if fn not supplied, try name in global scoope
					fn = values.name.ov()
				
				results = (results[4] || '').match(/.*\((.*\..*?):(.*)\)/);
				if (!results) break;			//bail if parse for url... failed
				
				var url = results[1] || '';
				values.url = url;
				
				var lineCol = results[2].split(':');
				values.lineno = Number(lineCol[0]) || '';
				values.column = Number(lineCol[1]) || '';
				break;
			}
			fn = fn || stack.fn;
			if (fn)
				EZ.functions.add(fn, values);
			else if (key == 'arguments')
			{
				fn = EZ.functions.find(values);
			}
			stack.fn = fn || stack.fn || '';			//update stack fn if changed
			break;
		}
		return key ? values[key] : values;
	}
	init.call(this, c);
}


/*--------------------------------------------------------------------------------------------------
EZ.functions.mapName(fn)

Find function name the hard way (from script)

First look in function map for matching function script.  If not found, scan each script until a
match is found -- as each script is scanned, its added to map to avoid scanning more than once.

ARGUMENTS:
	fn

RETURNS:
	function name if found
	
TODO:
	NOT TESTED -- does not appear needed for EZ.capture on chrome -- stack has name 
				  (not nested name but so what)
	stript comments

	EZ.functionMap = EZ.functionMap || {scripts:[]};
	name = EZ.functionMap[fn];

	if (!name && !EZ.functionMap.scripts.includes(options.url))
	{									//index fn script file if not done yet
		var fnList = EZ.getFunctionList(options.url);
		EZ.functionMap = EZ.functionMap.concat(fnList.xxx);
		EZ.functionMap.scripts.push(options.url);
		name = EZ.functionMap[fn];
	}
--------------------------------------------------------------------------------------------------*/
EZ.functions.add = function(fn, name /* values */, url, lineno, column)
{
	var map = EZ.functions();
	var idx = map.list.includes(fn); 
	if (idx != -1) return;
	
	idx = map.list.push(fn) - 1;
	var code = map.code[idx] = fn.toString().trim();
	
	//cross ref to related: EZ.getFunction, EZ.getFunctionParts, function EZgetFunction
	//EZ.patterns.funcParts, EZ.patterns.functionStatement, EZ.patterns.functionnDetail
	e = /function\s*(\w*)\s*\((.*?)\)[^{]*{([\s\S]*)}/
	e = /function\s*(\w*)\s*\((.*?)\)[^{]*{\s*([\s\S]*)}/;	//from EZ.clone
	
	var pattern = /(function\s*(\w+?)?\s*(\([\w,\s]*?\))\s*)([\s\S]*)/
	
	var labels = 'statement, name, argNames, script';
	var matches = code.matchPlus(pattern, labels);
	
	var info = map.info[idx] = {
		statement: matches[1],
		name: matches[2] || name, 
		arguments: matches[3].split(/\s*,\s*/),
		url: url || '', 
		lineno: lineno || '',
		column: column || '',
		names: []
	}
	
	e = [name, fn.name, info.name]
	
	e.forEach(function(name)	
	{
		if (!name || info.names.includes(name)) return;
		map.names[name] = idx;
		info.names.push(name);
	});
}
/*--------------------------------------------------------------------------------------------------
EZ.functions.get(values)

find or add fn values.name to functions.map -- values: name, url, lineno, column
				var script = DWfile.read(values.url)
--------------------------------------------------------------------------------------------------*/
EZ.functions.find = function(values)
{
	var name = values.name;
	var map = EZ.functions();
	var idx = map.list.indexOf(name);
	if (idx == -1)
	{												//update map if not done and script supplied
		//var fnCode = fn + '';						//fn script from dom
		[].some.call(document.scripts, function(script)
		{
			if (EZ.hasClass(script, 'EZmapped')) return;
			
			var src = script.src || script.innerHTML;
			if (src)
			{	
				var fnList = EZ.getFunctionList(src);
				script = fnList.script.split('\n');
				fnList.forEach(function(fn)			//for each fn found . . .
				{									
					var code = script.slice(fn.lineno, fn.linenoEnd);
													//remove code before fn statement
					code[0] = code[0].replace(/.*?(function[\s\S]*)/, '$1');	
					code = code.join('\n').trim();
					
					//var idx = map.code.indexOf(code);
					if (!map.code[code])
					{
						map.code[code] = fn.nestedName;
						///if (code == fnCode)
						///name = p.nestedName;
					}
					else
					{
					}
				});
				if (name) return true
			}
			EZ.addClass(script, 'EZmapped');
			if (name) return true
		});
	}
	if (values)
	{
		Object.keys(values).forEach(function(key)
		{
			var value = values[key];
			if (key != name)
				map.info[idx][key] = value || map.info[idx][key];
			else if (!map.names.includes(value))
			{
				map.names[value] = idx;
				map.info.names.push(value);
			}
		});
	}
}
/*----------------------------------------------------------------------------------
test wrapper fn -- global scope
	//if (EZ.capture.check(this)) {return EZ.capture()} else if (EZ.test.debug()) debugger;
----------------------------------------------------------------------------------*/
EZ.functions.getNameStackTest = function(action, name, rtnObj)
{										
	var fnName = 'EZ.functions.getNameStackTest';
	
	/*
		at Object.EZfunctions_getName:664          (.../EZcommonParse.js:664)
		at myfn:774                                (.../EZcommonParse.js:774)
		at EZ.functions.getNameStackTest:786       (.../EZcommonParse.js:786)
		at EZtest_run:525                          (.../EZtest_assistant_run.js:525)
		at EZ.functions.getNameStackTest.test:821  (.../EZcommonParse.js:821)
		at .../EZtest_assistant_run.js:65	
	*/
	var myfn = function()
	{
		return EZ.functions.getName('', rtnObj);
	}
	var myNew = function()
	{
		this.objfn = function()
		{
			return EZ.functions.getName('', rtnObj);
		}
	}
	
	switch (action)							//which fn calls EZ.functions.getName()
	{
		case 'myfn': 	return myfn();		//fn with local scope
		case 'myNew': 		
		{
			var my = new myNew()
			return my.objfn();
		}
		default:			
			fnName = EZ.functions.getName(name, rtnObj);
			return fnName;
	}
}
/*--------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------*/
EZ.functions.getNameStackTest.test = function()
{
	var rtnObj = {};
	var fn = EZ.functions.getNameStackTest;
	var fnName = 'EZ.functions.getNameStackTest';
	var pattern = '/EZ.functions.getNameStack/';
	var regex = /EZ.functions.getNameStack/;

	/*
    at Function.EZstack [as stack] (http://localhost:8080/revize/dw.Configuration/Shared/EZ/js/EZbase.js:817:11)
    at Object.EZfunctions_getName [as getName] (http://localhost:8080/revize/dw.Configuration/Shared/EZ/js/EZcommonParse.js:659:14)
    at myfn (http://localhost:8080/revize/dw.Configuration/Shared/EZ/js/EZcommonParse.js:774:23)
    at EZ.functions.getNameStackTest (http://localhost:8080/revize/dw.Configuration/Shared/EZ/js/EZcommonParse.js:786:24)
    at Function.EZtest_run [as run] (http://localhost:8080/revize/dw.Configuration/Shared/EZ/html/EZtest_assistant_run.js:537:37)
    at Function.EZ.functions.getNameStackTest.test [as testScript] (http://localhost:8080/revize/dw.Configuration/Shared/EZ/js/EZcommonParse.js:821:10)
    at http://localhost:8080/revize/dw.Configuration/Shared/EZ/html/EZtest_assistant_run.js:65:11"
	*/

	//________________________________________________________________________________________
	//EZ.test.settings({group:'get EZtest_run'})
	EZ.test.options({ex:'EZ.functions.getNameStackTest'})
	EZ.test.run('', fn		, rtnObj)

	//________________________________________________________________________________________
	EZ.test.settings({group:'EZ.functions.getNameStackTest'})	
	EZ.test.run('', fnName)

	//________________________________________________________________________________________
	EZ.test.settings({group:'EZtest_assistant_run.js'})	
	EZ.test.run('', pattern	, rtnObj)
	EZ.test.run('', regex)
	//________________________________________________________________________________________
	EZ.test.settings({group:'get fn preceeding ' + fnName})
	EZ.test.run('myfn', '', rtnObj)
	EZ.test.run('myNew', '', rtnObj)
	//________________________________________________________________________________________
EZ.test.skip(999)	
}


/*--------------------------------------------------------------------------------------------------
EZ.getFunctionList(dom)

ARGUMENTS:
	dom		dom, url or script (if contains \n or \r)

RETURNS:
	Array of objects containing properties for each javascript function
--------------------------------------------------------------------------------------------------*/
EZ.getFunctionList = function EZgetFunctionList(dom)
{
	var functionList = [];				//Array of Objects containing properties of each fn
	functionList.script = '';			//script from src url or innerHTML
	functionList.names = [];			//name of each fn found i.e. fn.name
	functionList.nestedNames = [];		//nestedName of each fn found i.e. fn.nestedName
	functionList.functionMap = {};		//crossref -- {fn.nestedName: fn}
	var lineno = 1;
	var html = '';
	var src = '';
	var scripts = [];

	if (!dom || dom == 'document')
		dom = EZ.getDOM(dom);			//dom is specified
	
	if (dom && dom.documentElement && dom.documentElement.outerHTML)
	{
		if (EZ.getFileInfo(document.URL).extension.toLowerCase() == 'js')
		{
			scripts = [dom.documentElement.outerHTML];
			functionList.script = dom.documentElement.innerHTML;		
		}
		else
		{
			scripts = dom.getElementsByTagName('script');
			if (dw.isNotDW && dom.URL)
			{
				html = DWfile.read(dom.URL) || '';
				functionList.script = html;		
			}
		}
	}
	else if (typeof(dom) == 'string' && /[\n\r]/.test(dom))
	{									//dom is script if string containing \n or \r
		scripts = [dom];
	}	
	else								//dom is url -- use contents if js, otherwise create dom	
	{
		var url = dom.URL || dom || '';
		if (!url) return functionList;
		
		html = DWfile.read(url);
		if (!html) return functionList;
		
		if (EZ.getFileInfo(url).extension.toLowerCase() == 'js')
		{
			scripts = [html];
			functionList.script = html;	
		}
		else					
		{								//create DOM and get internal script tags
			dom = EZ.getDOM(url,'',html);
			if (!dom) return functionList;
			
			scripts = dom.getElementsByTagName('script');
			functionList.script = scripts;	
		}
	}
	if (scripts.length === 0) 
		return functionList;			//bail if no script tags
	
	if (typeof(scripts[0]) == 'object')
	{
		src = dom.documentElement.outerHTML;
		
										//adjust lineno if 1st script tag lineno diff in dom as src
		if (html && html.search(/<script/i) != src.search(/<script/i))
			lineno += EZ.getLineCount( html.substr(0,html.search(/<script/i)) )
					- EZ.getLineCount( src.substr(0,src.search(/<script/i)) );
		
//			lineno += ('\n' + html.substr(0,html.search(/<script/i))).match(/\n/g).length
//					- ('\n' + src.substr(0,src.search(/<script/i))).match(/\n/g).length;
	}
	var srcLowerCase = src.toLowerCase();
///	var regex = new RegExp("\\s*(var)?((this\\.)?\\s*(.*?)[=:].*?)?\\bfunction\\s*(\\w*)\\s*\\(","");
	var cs = new EZ.commentStripper();
	
	var offset = 0;
	for (var s=0; s<scripts.length; s++)			//parse each script
	{
		if (typeof(scripts[s]) == 'object')
		{
			var offsetNext = srcLowerCase.indexOf('<script',offset);
			var results = ('\n'+srcLowerCase.substring(offset,offsetNext)).match(/\n/gm);
			lineno += results ? results.length-1 : 0;
			offset = srcLowerCase.indexOf('</' + 'script', offsetNext);
		}
		//var time = new Date().getTime();
		
		getFunctions(scripts[s], lineno);
		
		//var elasped = new Date().getTime() - time;
		//console.log(elasped)
		void(0);
	}
	//======================
	return functionList;	
	//======================
	/**
	 *  Returns an array of objects containing the following properties:
	 *		name, level, lineno
	 *		nestedName:		e.g. CommentStripper.getCurrentCharacter.another
	 *		nestedCount:		number of nested functions
	 *		lineno and find[string containing function statement]
	 *	TODO: new Function(...)
	 *		
	 *	Function names are recognized for the following function definitions:
	 *
	 *  	function EZstart()
	 *  	this.z = function()
	 *  	var CommentStripper = (function (window)
	 *  	getCurrentCharacter: function () {return this.string.charAt(this.position)},
	 *  	strip: function (string, isClean)
	 *  
	 *	Closures like the following (or forms not listed above) are returned as anonymous:
	 *      define('commentstripper', [], function () 
	 *		{
     *      	return CommentStripper;
     *   	});
	 *
	 *  ARGUMENTS:
	 *		tag 		script element or script string
	 *		lineno		optional base lineno -- e.g lineno of script tag in document
	 */
	function getFunctions(tag, lineno)
	{
		lineno = lineno || 0;
		var src = (typeof tag == 'object') ? tag.innerHTML : tag;
		if (typeof(src) != 'string' || !src.trim()) return [];	
		
		src = cs.strip(src, true);						//strip comments and colapse strings
		
		src = src.replace(/((\.(forEach|some|every|replace).*\(.*?))function/gim, function()
		{												//ignore tight closures - very expensive
			return arguments[1]							//TODO: catch function stmt on next line
		});												//e.g. replace(regex, \n function...
		
		// get all lines containing function statement
		var resultsList = src.match(/^.*\bfunction\b.*$/mg);
		if (resultsList)								
		{												//functions found 
			var level = 0;
			var nestedName = [];
			var topIndex = functionList.length;
			var topOffset = 0;
			var offset = 0;
			
			var offsetNext = src.search(/\S/);
			var code = src.substring(offset,offsetNext);
			lineno += EZ.getLineCount(code);
			offset = offsetNext;
			
			for (var i=0; i<resultsList.length; i++)	//for each line containing function
			{
				//var time = new Date().getTime();
				
				// get to line containing function 
				offsetNext = src.indexOf(resultsList[i],offset);
				if (offsetNext == -1) continue;			//safety for unexpected
				
				code = src.substring(offset,offsetNext);
				//offsetNext += code.search(/(function)/i) + 9; 
				var linenoNext = EZ.getLineCount(code);
				
				//------------------------------------------------------------------------------------------
				var fn = {lineno:lineno+linenoNext, linenoDesc:0, find:resultsList[i], nestedCount:0};
				fn.lines = getFunctionLines(offsetNext);
				fn.linenoEnd = fn.lineno + fn.lines - 1;
				
				// determine function name
				var results = src.substr(offsetNext).match(EZ.patterns.functionStatement);
				
				//TODO: nogo for nested anonymous -- e.g. EZdisplayMessage()
				// 		if name not found, search from AFTER last function statement
				//if (!results || (!results[4] && !results[5]))	
				//	results = src.substr(offset).match(EZ.patterns.functionStatement);
				
				if (results) 								
				{
					if (results[5])
						fn.name = results[5];			//name after function statement
					if (results[4])
						fn.name = results[4];			//prototype or OPPS function name before function
				}
				if (!fn.name)							//assume anonymous closure
					fn.name = 'anonymous_' + (lineno + linenoNext);
				
				fn.name = fn.name.trim();				//trim() needed
				
				// look for multiline comments at end of code before function statement
				fn.linenoDesc = -getFunctionDesc(code, fn.name);
				
				// now let's determine nested level 
				// TODO: may not completely accomodate function inside conditional
				if (i > 0)
				{
					var bracketsBeg = code.match(/\{/g);
					var bracketsEnd = code.match(/\}/g);
					bracketsBeg = bracketsBeg ? bracketsBeg.length : 0;
					bracketsEnd = bracketsEnd ? bracketsEnd.length : 0;
					if (bracketsBeg < bracketsEnd)
						level++;
					if (bracketsBeg > bracketsEnd)		//??
						level = Math.max(0, level--);
					else
						level = 0;
					level = bracketsBeg - bracketsEnd;
				}
				
				// ignore anonymous or oops wrappers with same name as inner function
				// TODO: should be level dependent
				if (level > 0 && nestedName.indexOf(fn.name) != -1)
				{					
					offset = offsetNext;
					lineno += linenoNext;
					continue;					
				}
				if (level < 0)		//happens when wrappers ignored
					level = 0;
				
				// updated nested name(s)
				nestedName.splice(level,nestedName.length-level,fn.name);
				fn.nestedName =  nestedName.join('.');
				fn.level = level;
				
				if (level > 0)
				{
					functionList[topIndex].nestedCount++;
					fn.topIndex = topIndex;
				}
				else	//level 0
				{
					topIndex = functionList.length;
					topOffset = offsetNext;
					offset = offsetNext;
					lineno += linenoNext;
				}
				//fn.elasped = new Date().getTime() - time;
				functionList.push(fn);
				functionList.names.push(fn.name);
				functionList.nestedNames.push(fn.nestedName);
				functionList.functionMap[fn.nestedName] = fn;
			}
			if (topIndex >= 0 && !functionList[topIndex].lines)	//if any function added
			{
				functionList[topIndex].lines = getFunctionLines(topIndex, offsetNext);
			}
		}
		//==================
		return functionList;
		//==================
		/**
		 *	return nolines in function in src at offset
		 */
		function getFunctionLines(offset)
		{
			//----- find offset to closing function bracket "}"
			var offsetBeg = offset;
			while (true)
			{
				offset = src.indexOf('}',offset) + 1;
				if (offset <= 0) break;
				
				var begCount = (src.substring(offsetBeg,offset)+'{').match(/\{/g).length;
				var endCount = (src.substring(offsetBeg,offset)+'}').match(/\}/g).length;
				if (begCount == endCount) break;
			}
			//----- include lines after closing bracket the of form:
			//		String.prototype.dup.displayName = 'String.prototype.dup';
			//		EZtraceReset = EZlogReset;
			while (true)
			{
				var results = src.substr(offset).match(EZ.patterns.functionAfterEnd);
				if (!results) break;
				offset += results[1].length;
			}
			return EZ.getLineCount(src.substring(offsetBeg, offset)) + 1;
		}
		/**
		 *	return number of lines at end of code containing multiline comment
		 */
		function getFunctionDesc(code, name)	//name passed for debugging
		{
			void(name);
			var regex = /([\s\S]*)(\/\*[\s\S]*\*\/)\s*$/;
			var results = code.match(regex);	//check for multiline comment prefix
			if (results)
				return EZ.getLineCount(code.substr(results[1].length));
			else
				return 0;
		}		
	}
}
//_____________________________________________________________________________________________
EZ.getFunctionList.test = function()
{
	var script, arg, obj=null, ctx, ex, exfn, note = '';
	/*  jshint: future vars */	e = [arg, obj, ctx, ex, exfn, note];

	// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	function test()
	{
		var dt = {}
		dt.t = (dt.seconds + dt.milliseconds) ? dt.S : '';
		dt.tt = (dt.seconds + dt.milliseconds) ? dt.SS : '';

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
		dt.NOON = dt.MIDNIGHT = dt.NOON.replace(/12:00:00 pm/i,'Noon');
		
		dt.noon = dt.midnight = dt.midnight.replace(/12:00 am/i,'Midnight');
		dt.NOON = dt.MIDNIGHT = dt.MIDNIGHT.replace(/_0:00:00/i,'Midnight');
		if (!dt.timeOnly)	//noon and NOON blank for midnight if not timeOnly
		{
			dt.noon = dt.noon.replace(/Midnight/, '');
			dt.NOON = dt.NOON.replace(/Midnight/, '');
		}
		function test1()
		{
		}
		test1()
	}
	//______________________________________________________________________________
	note = '... "/ 1000" is not comment or regex'
	script =  test.toString();
	EZ.test.options({note:note})
	EZ.test.run( script )	
}

/**
 *	return number of \n in text
 */
EZ.getLineCount = function EZgetLineCount(text)
{
	return ('\n'+text).match(/\n/gm).length-1;
}
/**
 *	return offset to lineno / column in str
 */
EZ.offsetFromLineno = function EZoffsetFromLineno(str,lineno,col)
{
	var offset = 0;
	for (var i=0; i<lineno-1; i++)
	{
		var index = str.indexOf('\n', offset);
		if (index == -1) index = str.indexOf('\r', offset);
		if (index == -1) return str.length-1;
		
		offset = index + 1;
		if (str.substr(offset,1) == '\r')
			offset++;
	}
	return offset + (col || 0);
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
if (EZ && EZ.global && EZ.global.setup) EZ.global.setup('EZ', 'EZcommonParse');
