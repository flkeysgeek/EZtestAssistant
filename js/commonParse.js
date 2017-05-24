/*---------------------------------------------------------------------------------------
Determine if offsets are inside markers[0] and markers[1] characters by counting each and
returning the difference of markers[0] - markers[1].

If offsets[0] is markers[0] then inside until diff <= 0 (equal or more markers[1]'s)
If offsets[0] is past markers[0] then inside until diff < 0 (more markers[1]'s)

TODO: handle reqular expression; escapeRegEx is one test case
---------------------------------------------------------------------------------------------*/
function EZcountDiff(doc,markers,offsets)
{
	if (arguments.length > 3) EZwarn('Too Many Arguments');
	
	// if markers specifies tag
	if (typeof(markers) == 'string')
		markers = ['<' + markers, '</' + markers];
	
	var charBegCount = 0;
	var charEndCount = 0;
	var charBegPattern = new RegExp( EZescapeRegEx(markers[0]), 'gi');
	var charEndPattern = new RegExp( EZescapeRegEx(markers[1]), 'gi');
	var results;
	
	var source = 'source';
	if (typeof(doc[source]) == 'undefined')
		source = 'outerHTML';
	if (typeof(doc[source]) == 'undefined')
		return 0;	
	
	if (doc[source] == "" ) return 'empty string';
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
function EZescapeRegEx(regex)
{
	var special = '^$.*+?=!:|()[]{}\\';
	var specialEscaped = '';
	for (i=0;i<special.length;i++)
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
	var i,e;
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
		EZ.techSupport(e);
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
			return ((val===null) || val.length==0 || /^\s+$/.test(val));
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
		arr=d.match(/&#[0-9]{1,5};/g);
		
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
var EZcommentStripper = (function (window) 
{
    var SLASH = '/';
    var BACK_SLASH = '\\';
    var STAR = '*';
    var DOUBLE_QUOTE = '"';
    var SINGLE_QUOTE = "'";
    var NEW_LINE = '\n';
    var CARRIAGE_RETURN = '\r';

    var EZcommentStripper = function () {};
    EZcommentStripper.prototype = 
	{
        string: '',
        length: 0,
        position: 0,
        output: null,
		isClean: false,

        getCurrentCharacter: function () {return this.string.charAt(this.position)},
        getPreviousCharacter: function () {return this.string.charAt(this.position - 1)},
        getNextCharacter: function () {return this.string.charAt(this.position + 1)},
		
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
                if (this.getNextCharacter() != STAR && this.getNextCharacter() != SLASH) 
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

/*---------------------------------------------------------------------------------------------
return array of objects for each javascrip function
dom is dom, url or script (if contains \n or \r)
---------------------------------------------------------------------------------------------*/
function EZgetFunctionList(dom)
{
	var functionList = [];
	var lineno = 1;
	var html = '';
	var src = '';
	var scripts = [];

	if (!dom || dom == 'document')
		dom = EZgetDOM(dom);
	
	// dom specified
	if (dom && dom.documentElement && dom.documentElement.outerHTML)
	{
		if (EZgetFileInfo(document.URL).extension.toLowerCase() == 'js')
			scripts = [dom.documentElement.outerHTML];
		else
		{
			scripts = dom.getElementsByTagName('script');
			if (dw.isNotDW && dom.URL)
				html = DWfile.read(dom.URL) || '';
		}
	}
	// script if dom contains \n or \r
	else if (typeof(dom) == 'string' && /[\n\r]/.test(dom))
	{
		scripts = [dom];
	}
	//dom arg is url -- use contents if js, otherwise create dom
	else			
	{
		var url = dom.URL || dom || '';
		if (!url) return functionList;
		
		html = DWfile.read(url);
		if (!html) return functionList;
		
		if (EZgetFileInfo(url).extension.toLowerCase() == 'js')
			scripts = [html];
		else					
		{								//create DOM and get internal script tags
			dom = EZgetDOM(url,'',html);
			if (!dom) return functionList;
			
			scripts = dom.getElementsByTagName('script');
		}
	}
	if (scripts.length == 0) return functionList;	//bail if no script tags
	
	if (typeof(scripts[0]) == 'object')
	{
		src = dom.documentElement.outerHTML;
		
		// adjust lineno if 1st script tag linene diff in dom as src
		if (html && html.search(/<script/i) != src.search(/<script/i))
			lineno += EZgetLineCount( html.substr(0,html.search(/<script/i)) )
					- EZgetLineCount( src.substr(0,src.search(/<script/i)) );
		
//			lineno += ('\n' + html.substr(0,html.search(/<script/i))).match(/\n/g).length
//					- ('\n' + src.substr(0,src.search(/<script/i))).match(/\n/g).length;
	}
	var srcLowerCase = src.toLowerCase();
///	var regex = new RegExp("\\s*(var)?((this\\.)?\\s*(.*?)[=:].*?)?\\bfunction\\s*(\\w*)\\s*\\(","");
	var cs = new EZcommentStripper();
	
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
		getFunctions(scripts[s], lineno);
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
		
		// get all lines containing function statement
		var resultsList = src.match(/^.*\bfunction\b.*$/mg);
		if (resultsList)								
		{												//functions found 
			var level = 0;
			var nestedName = [];
			var topIndex = functionList.length;
			var topOffset = 0;
			var offset = 0;
			
			var offsetLast;
			var offsetNext = src.search(/\S/);;
			var code = src.substring(offset,offsetNext);
			lineno += EZgetLineCount(code);
			offset = offsetNext;
			
			for (var i=0; i<resultsList.length; i++)	//for each line containing function
			{
				// get to line containing function 
				offsetNext = src.indexOf(resultsList[i],offset);
				if (offsetNext == -1) continue;			//safety for unexpected
				
				code = src.substring(offset,offsetNext);
				//offsetNext += code.search(/(function)/i) + 9; 
				var linenoNext = EZgetLineCount(code);
				
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
				functionList.push(fn);
			}
			if (topIndex >= 0 && !functionList[topIndex].lines)	//if function added
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
			return EZgetLineCount(src.substring(offsetBeg, offset)) + 1;
		}
		/**
		 *	return number of lines at end of code containing multiline comment
		 */
		function getFunctionDesc(code, name)	//name passed for debugging
		{
			var regex = /([\s\S]*)(\/\*[\s\S]*\*\/)\s*$/;
			var results = code.match(regex);	//check for multiline comment prefix
			if (results)
				return EZgetLineCount(code.substr(results[1].length));
			else
				return 0;
		}		
	}
}
/**
 *	return number of \n in text
 */
function EZgetLineCount(text)
{
	return ('\n'+text).match(/\n/gm).length-1;
}
/**
 *	return offset to lineno / column in str
 */
function EZoffsetFromLineno(str,lineno,col)
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
