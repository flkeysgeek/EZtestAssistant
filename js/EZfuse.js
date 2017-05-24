/**
 * @license
 * Fuse - Lightweight FUzzy-SEarch
 *
 * Copyright (c) 2012 Kirollos Risk <kirollos@gmail.com>.
 * All Rights Reserved. Apache Software License 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Adapted from "Diff, Match and Patch", by Google
 *
 *   http://code.google.com/p/google-diff-match-patch/
 *
 * -----------------------------------------------
 * Modified by: Kirollos Risk <kirollos@gmail.com>
 * -----------------------------------------------
 * Details: the algorithm and structure was modified to allow the creation of
 * <Searcher> instances with a <search> method which does the actual
 * bitap search. The <pattern> (the string that is searched for) is only defined
 * once per instance and thus it eliminates redundant re-creation when searching
 * over a list of strings.
 *
 * -----------------------------------------------
 * EZ modifications 11-10-2015
 * -----------------------------------------------
 * 	reformatted using EZ format conventions
 *	Return create EZ.fuzzy Object if EZ scope, Common JS Loader or define.amd if
 *  either defined; otherwise as Fuse object in global window scope.
 *
 * --------------------------------------------------------------------
 * Additional and Expanded options 11-15-2015 -- Dave Otto EZ-coder.com
 * --------------------------------------------------------------------
 *		id 			allows multiple identifiers or "value" to return list value for
 *					list of String.
 *
 *		include		Allows include values to be returned in supplemental Arrays as
 *					property of the returned results Array instead of or in addition
 *					to an item property.
 *
 *					The following addtional searcher values returned:
 *						locations, offsets, matchedKeys*
 *						* set by Fuse.search().analyzeText()
 *
 *		keys		Searches all Object keys if not specified.
 *
 *		callback	If specified, function called after search completes or is canceled.
 *					Fuse.search() then returns after initializztion.
 *
 *		cancelable	If specified and true, search can be canceled by setting associated 
 *					Fuse Object canceled property non-null. Requires callback and pauseTime.
 *					The value of canceled property is retuned as canceled property of returned
 *					results Array.
 *					
 *		cancelTime	optional number of milliseconds allowed before search quits and calls
 *					the specified callback function. The search finishes analyizing all
 *					specified keys for list item currently being processed.  If search is
 *					canceled and sort will not start or terminates if started.  The values
 *					of the matched items found are returned as specified by id option.
 *
 *		maxResults	optionally specifies the number of matched items found with any score
 *					before quiting the search.
 *
 *		pauseTime	optionally defines number of milliseconds before search pauses to
 *					allow other script processing e.g. keyboard or mouse event handlers.
 *		
 *		searchTime	If specified and true, sets searchTime property in results Array with 
 *					number of milliseconds taken for search formated as: "n.mmm seconds".
 * 
 *		shouldSort	Support addtional following addtional sort options:
 *						"id" or "keys" for Objecs and "value" for Strings
 *
 *		sort		Alternative name for sort option -- shouldSort has precedence
 *
 *		truncateSearchPattern
 *					If specified and true, search pattern if truncated when it exceeds
 *					maxPatternLength rather than throwing an exception.
 *
 *		sortKeys	Defines sort keys if different from search keys
 *
 *		Fuse.search([{String}|{input text}|{textarea} [, list] [, options])
 *					searchPattern can be String, html text field or textarea
 *					updated list Array (optionally) follows searchPattern
 *					updated options Object follows searchPattern (or list if supplied)
 *	
 *	Created simple example html page to demonstrate all existing (except custom functions)
 *	and new functionality.
 *
 *		-Uses Pure JavaScript -- no libraries to eliminate dependencies  
 *		-Very little css to avoid clutter and keep focus on Fuse functionality
 *					
 */
/*--------------------------------------------------------------------------------------------------
EZ.fuzzy(list [, options])  constructor

ARGUMENTS:
	list		(required) Array of Strings or Objects to search for fuzzy matches. For list of 
				Objects, all Object properties are searched unless the keys options is specified.
				TODO: Array or delimited string (values separated by commas, spaces and/or newlines)
	
	options		(optional) Object containing one or more of the following properties:
				
				callback	The callback function called with results Array after search completes or
							canceled.  On cancel, results Array contains canceled property set to true.
				
				cancelTime	Specifies number of milli-seconds allowed before search is canceled.
							Ignored if 0 or callback not specified.
							default: 0
							
				pauseTime	Specifies number of milliseconds before pausing to process keyboard input,
							refresh display and allow other scripts (e.g. event handlers)to run; 
							if Fuse.canceled set while paused, search is canceled.  Ignored if 0 or
							callback function not specified.
							default: 500
	
				keys		Specifies Object properties searched when list is Array of Objects.
							Supports nested properties via dot notation e.g. "author.firstName"
							default: all Object properties
				
				id			For list of Objects, the Object identifier(s) i.e. properties returned as items
							in the search results Array.  When multiple ids are specified as comma delimited
							String or Array of Strings, an Object is returned containing the specified ids
							for each match.  If no id(s) specified, all Object properties are returned foe
							each match.

							For list of Strings, specify "value" to return the matched item value otherwise
							a list of Array indexes is returned.
							
							default: all Object properties -or- Array indexes for list of Strings
				
				sort -or-	true 	sort search results Array by score.
				shouldSort	"id" 	sort by identifier properties in the order specified.
							"keys" 	sort by sortKeys if specified else by keys if specified
									otherwise sort by all Object properties in order defined.
							"value" sort Array Strings by value
							default items not sorted - returned items in same order as list
				
				sortKeys	Array of list Object keys (i.e. properties) used for sort by "keys".
				
				include		Specifies the searcher's output values to include with the returned
							list of matched items.  Can be an Array of Strings containing the
							searcher's value names (e.g. "score"), an Object with properties 
							corresponding to the value names or both.
							
							When any searcher values are specified as Array items, each matched
							list item in the returned results Array will be of the form: 
								{ item: ..., include1: ..., include2: ... }.  
								
							Default searcher's returned values are:
								score		fuzzy match score -- lower is better -- 0 for exact match
								scoredKey	key of item with best i.e. lowest score
								matchedKeys	for list of Objects, Array of all matched keys
								itemIndex	index of item in list of Objects
								offsets		Array containing offset to 1st and last character matched
								locations	Array of offsets for each character matched
							
							For example, to include the score with each item:
								set include to: ['score'] 
							and the result would be:
							 	{ item: ..., score: ... } for each Array item.
							
							A separate supplemental Array is used for any include Object properties
							corresponding to any searcher output value name.  The returned results 
							Array will be of the form: 
								{ ['apple','orange'], length:2, score:[0.2,0.5] }
							
							Searcher output values can be returned as both an item property and as a
							separate Array by specifing the value name as both an Array item string
							and property name.
							
							For example, set include to: 
								{0:score, score:0} 
							and the returned results Array will be an ArrayLike Object of the form: 
								{ [{item:..., score:...}, ...], score:[item1, item2, ...] }
							
							Both results and results.score are Array's and both results.length and
							results.score.length will equal the number of matched items returned.  
				
				location 	Approximately where in search strings is the searchWord expected
							e.g. =2 to start looking after "EZ" in "EZmyfunction" function name
							default: 0
								
				distance	Specifies how close the match must be to the specified location.
							An exact letter match which is 'distance' or morecharacters away from
							the location will score as a complete mismatch. A distance of '0' thus
							requires the match be at the exact location specified. A distance of 
							'1000' will require a perfect match to be within 800 characters of the
							speified location (using a 0.8 threshold).
							default: 100

				threshold	Specifies when the match algorithm gives up. A threshold of '0.0' 
							requires a perfect match (letters and location); a threshold of '1.0'
							matches anything.
							default: 0.6

				maxResults	If specified, maximun items returned after sort if specified.
				
				maxPatternLength 
							The maximum length of the search text pattern. The longer the
							pattern the more intensive the search operation will be. Whenever 
							the pattern exceeds the maxPatternLength, an error will be thrown. 
							Why is this important? Read: http://en.wikipedia.org/wiki/Word_(computer_architecture)#Word_size_choice
				
				truncateSearchText
							If search text exceeds maxPatternLength, truncate; no exception thrown.
				
				searchTime	Sets searchTime property in returned Array to String of the form: "0.002 seconds"
							representing time for search as milliseconds / 1000.
								
				searchFn, sortFn, getFn -- See function descriptions below or README:
							https://github.com/krisk/Fuse/blob/master/README.md

RETURNS:
	new Fuse Object created with specified list/options with the following functions which
	can be repeatedly called with different arguments w/o need to re-create list hash when it
	has not been changed:
	
		search(text [, options])	
		
			Searches for all the items whose keys (fuzzy) match the pattern.
		
			ARGUMENTS:
				text		String used to find matches in specified list -OR- html input text 
							or textarea form field containing text String.
							
				options		(optional) Object of updated options -- replaces only those supplied.
			
			RETURNS:
				The returned result is always an Array type but may optionally contain
				additional properties based on options.
			
		set(list)
		
			Sets a new list for Fuse to match against.			
			
			ARGUMENTS:
				list	Array containing list
			RETURNS:
				Array containing the new list

EXAMPLE USAGE:
	EZfuse.html

REFEERENCE:
	http://kiro.me/projects/fuse.html
	https://en.wikipedia.org/wiki/Bitap_algorithm
--------------------------------------------------------------------------------------------------*/

(function(global) 
{
	var BitapSearcher = function(pattern, options) 
	{
		options = options || {};
		this.options = options;
		this.options.location = options.location || BitapSearcher.defaultOptions.location;
		this.options.distance = 'distance' in options ? options.distance : BitapSearcher.defaultOptions.distance;
		this.options.threshold = 'threshold' in options ? options.threshold : BitapSearcher.defaultOptions.threshold;
		this.options.maxPatternLength = options.maxPatternLength || BitapSearcher.defaultOptions.maxPatternLength;
		
		if (pattern > this.options.maxPatternLength && this.options.truncateSearchText)
			pattern = pattern.substr(0, this.options.maxPatternLength);

		this.pattern = options.caseSensitive ? pattern : pattern.toLowerCase();
		this.patternLen = pattern.length;
		
		if (this.patternLen > this.options.maxPatternLength)
			throw new Error('Pattern length is too long');
		
		this.matchmask = 1 << (this.patternLen - 1);
		this.patternAlphabet = this._calculatePatternAlphabet();
	};

	BitapSearcher.defaultOptions = 
	{
		location: 0,
		distance: 100,
		threshold: 0.6,
		maxPatternLength: 32	//Machine word size: A-Z0-9 =32 ??
	};

	/**
	* Initialize the alphabet for the Bitap algorithm.
	* @return {Object} Hash of character locations.
	* @private
	*/
	BitapSearcher.prototype._calculatePatternAlphabet = function() 
	{
		var i, mask = {};
		for (i = 0; i < this.patternLen; i++)
			mask[this.pattern.charAt(i)] = 0;
		
		for (i = 0; i < this.patternLen; i++)
			mask[this.pattern.charAt(i)] |= 1 << (this.pattern.length - i - 1);
	
		return mask;
	};

	/**
	* Compute and return the score for match with `e` errors and `x` location.
	*
	* @param {number} errors Number of errors in match.
	* @param {number} location Location of match.
	* @return {number} Overall score for match (0.0 = good, 1.0 = bad).
	* @private
	*/
	BitapSearcher.prototype._bitapScore = function(errors, location) 
	{
		var accuracy = errors / this.patternLen,
			proximity = Math.abs(this.options.location - location);
	
		if (!this.options.distance)		// Dodge divide by zero error.
			return proximity ? 1.0 : accuracy;
		return accuracy + (proximity / this.options.distance);
	};

	/**
	* Compute and return the result of the search
	* @param {String} text The text to search in
	* @return {Object} Literal containing:
	*                          {Boolean} isMatch Whether the text is a match or not
	*                          {Decimal} score Overall score for the match
	* @public
	*/
	BitapSearcher.prototype.search = function(text) 
	{
		text = this.options.caseSensitive ? text : text.toLowerCase();

		if (this.pattern === text) 		// Exact match
		{
			return {isMatch: true, score: 0, locations: [0], offsets:[0,text.length]};
		}
		var i, j,
			// Set starting location at beginning text and initialize the alphabet.
			textLen = text.length,
			LOCATION = this.options.location,
			binMin, binMid,
			binMax = this.patternLen + textLen,
			start, finish,
			bitArr, lastBitArr,
			charMatch,
			score = 1,
			locations = [],
			offsets = [];
		
		var THRESHOLD = this.options.threshold;				//score threshold to give up
		var bestLoc = text.indexOf(this.pattern, LOCATION);	//check for nearby exact match
		if (bestLoc != -1) 									
		{													
			THRESHOLD = Math.min(this._bitapScore(0, bestLoc), THRESHOLD);	//to right
			bestLoc = text.lastIndexOf(this.pattern, LOCATION + this.patternLen);
			if (bestLoc != -1) 												//to left
					THRESHOLD = Math.min(this._bitapScore(0, bestLoc), THRESHOLD);
		}
		bestLoc = -1;

		for (i = 0; i < this.patternLen; i++) 
		{
			// Scan for the best match; each iteration allows for one more error.
			// Run a binary search to determine how far from 'MATCH_LOCATION' 
			// we can stray at this error level.
			binMin = 0;
			binMid = binMax;
			while (binMin < binMid) 
			{
				if (this._bitapScore(i, LOCATION + binMid) <= THRESHOLD)
					binMin = binMid;
				else
					binMax = binMid;
				binMid = Math.floor((binMax - binMin) / 2 + binMin);
			}

			// Use the result from this iteration as the maximum for the next.
			binMax = binMid;
			start = Math.max(1, LOCATION - binMid + 1);
			finish = Math.min(LOCATION + binMid, textLen) + this.patternLen;
			
			// Initialize the bit array
			bitArr = Array(finish + 2);
			
			bitArr[finish + 1] = (1 << i) - 1;
			
			for (j = finish; j >= start; j--) 
			{
				// The alphabet <patternAlphabet> is a sparse hash, so the following line generates warnings.
				charMatch = this.patternAlphabet[text.charAt(j - 1)];
				
				if (i === 0) 					// First pass: exact match.
					bitArr[j] = ((bitArr[j + 1] << 1) | 1) & charMatch;
				else							// Subsequent passes: fuzzy match
					bitArr[j] = ((bitArr[j + 1] << 1) | 1) & charMatch | (((lastBitArr[j + 1] | lastBitArr[j]) << 1) | 1) | lastBitArr[j + 1];
        
				if (bitArr[j] & this.matchmask) 
				{
					score = this._bitapScore(i, j - 1);
					if (score <= THRESHOLD) 	//Don't expect better than any existing match but check anyway.
					{							//Told you so.
						THRESHOLD = score;
						bestLoc = j - 1;
						locations.push(bestLoc);
						offsets.push(bestLoc,finish);
											
						if (bestLoc > LOCATION) //if passing loc, don't exceed current distance from loc
							start = Math.max(1, 2 * LOCATION - bestLoc);
						else 					//already passed loc, downhill from here on in.
							break;
					}
				}
      		}
			// No hope for a (better) match at greater error levels.
			if (this._bitapScore(i + 1, LOCATION) > THRESHOLD) break;
			lastBitArr = bitArr;
    	}
		return {isMatch: bestLoc >= 0, score: score, locations: locations, offsets: offsets};
	};

	//___________________________________________________________________________
	/**
	  *	return list of values from obj for nested Object property specified by path
	  */
	var deepValueHelper = function(obj, path, list) 
	{
		var firstSegment, remaining, dotIndex;
		
		if (!path) 		// If there's no path left, we've gotten to the object we care about.
			list.push(obj);
		else 
		{
			dotIndex = path.indexOf('.');
			if (dotIndex !== -1) 
			{
				firstSegment = path.slice(0, dotIndex);
				remaining = path.slice(dotIndex + 1);
			} 
			else
				firstSegment = path;
		
			var value = obj[firstSegment];
			if (value) 
			{
				if (!remaining && (typeof value === 'string' || typeof value === 'number'))
					list.push(value);
				
				else if (Utils.isArray(value)) 	
				{					// Search each item in the array.
					for (var i = 0, len = value.length; i < len; i++)
						deepValueHelper(value[i], remaining, list);
				} 
				else if (remaining) // An object. Recurse further.
					deepValueHelper(value, remaining, list);
			}
		}
		return list;
	};
		
	//___________________________________________________________________________
	/**
	 *	get all nested Object keys
	 */
	function getObjectKeys(obj, dotName, keys)
	{
		Object.getOwnPropertyNames(obj).forEach(function(key)
		{
			var value = obj[key];
			if (value == null || Utils.isArray(value)) return;	//next key
			
			if (typeof(value) == 'object')
			{									
				var dotKey = dotName + key;		//only process each Object once
				if (getObjectKeys.processedObjects.indexOf(dotKey) != -1) return;
				processedObjects.push(dotName);	//avoids infinite loop
			
				keys.push(dotKey);
				keys = getObjectKeys(obj, dotKey + '.', keys)
			}
		});
		return keys;
	}
	
	
	var Utils = {
		/**
		* Traverse an object
		* @param {Object} obj The object to traverse
		* @param {String} path A . separated path to a key in the object. Example 'Data.Object.Somevalue'
		* @return {Object}
		*/
		deepValue: function(obj, path) 
		{
			return deepValueHelper(obj, path, []);
		},
		getKeys: function(obj) 
		{
			getObjectKeys.processedObjects = [];
			return getObjectKeys(obj, '', []);
		},
		isArray: function(obj) 
		{
			//return obj && typeof(obj) == 'object' && obj.constructor == Array;
			return Object.prototype.toString.call(obj) === '[object Array]';
		}
	};

	/**
	* @param {Array} list
	* @param {Object} options
	* @public
	*/
	function Fuse(list, options) 
	{
		this.list = list;
		this.options = options = options || {};		//copy options or create empty object
		this.options.shouldSort = this.options.shouldSort || this.options.sort;
		
		var i, len, key;
		var keys = 'cancelable caseSensitive shouldSort truncateSearchText'.split(' ');
		for (i = 0; i < keys.length; i++) 
		{											//Add boolean type options
			key = keys[i];
			var value = options[key];
			if (value === 'false') 
				value = false;		//"false" --> false
			else if(value == true)
				value = true;		//"true" --> true
				
			this.options[key] = key in options ? value : Fuse.defaultOptions[key];
		}		
		for (i = 0, keys = ['searchFn', 'sortFn', 'keys', 'getFn', 'include'], len = keys.length; i < len; i++) 
		{											//set other default values
			key = keys[i];
			this.options[key] = options[key] || Fuse.defaultOptions[key];
		}
		this.options.EZ = true;
	};												//searcher defaults set when instanciated

	Fuse.defaultOptions = 
	{
		id: null,
		callback: null,
		caseSensitive: false,
		
		// A list of values to be passed from the searcher to the result set.
		// If include is set to ['score', 'highlight'], each result
		// in the list will be of the form: `{ item: ..., score: ..., highlight: ... }`
		include: [],
		shouldSort: true,
		sortKeys: null,
		
		// The search function to use
		// Note that the default search function ([[Function]]) must conform to the following API:
		//
		//  @param pattern The pattern string to search
		//  @param options The search option
		//  [[Function]].constructor = function(pattern, options)
		//
		//  @param text: the string to search in for the pattern
		//  @return Object in the form of:
		//    - isMatch: boolean
		//    - score: Int
		//  [[Function]].prototype.search = function(text)
		searchFn: BitapSearcher,
		sortFn: null,				// Default sortFn defined as closure in search()
		getFn: Utils.deepValue,		// Default get function
		keys: []					// Object keys searched
	};

	/**
	* Sets a new list for Fuse to match against.
	* @param {Array} list
	* @return {Array} The newly set list
	* @public
	*/
	Fuse.prototype.set = function(list) 
	{
		this.list = list;
		return list;
	};
	/**
	 *	Populate specified topNode with list of items returned by search for specified
	 *	keys as a multi-level ul list.  Uses offsets from searcher if contained in
	 *	results Array to highlight matched characters for each list item or property.
	 */
	Fuse.prototype.formatResults = function(topNode, results, keys) 
	{
		while(topNode.childNodes.length)		//remove all childNodes
			topNode.removeChild(topNode.childNodes[0])
		
		var keyParts = [];						//split each key into parts
		keys.forEach(function(key)
		{
			keyParts.push(key.split('.'));
		});
		for (var index=0; index<results.length; index++)
		{
			var item = (this.options.include.length) ? results[index].item 
													 : results[index];
			var level, key, keyWork, keyLevel, nextLevel;
			var ulNode, ulStack, liNode, liStack, textNode, valueNode
			
			level = 0;
			ulNode = document.createElement('ul');
			ulStack = [ulNode];
			liStack = [];
			topNode.appendChild(ulNode);
			
			var scoredKey = getInclude.call(this,'scoredKey');
			var offsets = getInclude.call(this,'offsets') || {};
			
			for (var i=0; i<keys.length; i++)
			{
				keyWork = keyParts[i].slice();
				keyLevel = keyParts[i].length-1;
				nextLevel = (i < keys.length - 1) ? keyParts[i+1].length-1 : 0;
				
				while (level < keyLevel)		//move down ul list tree
				{
					liNode = document.createElement('li');
					liStack.push(liNode);
					ulStack[level].appendChild(liNode);
					
					key = keyWork.shift();
					textNode = document.createTextNode(key + ':');
					liNode.appendChild(textNode);
					
					ulNode = document.createElement('ul');
					ulStack.push(ulNode);
					liNode.appendChild(ulNode);
					level ++;
				}
				liNode = document.createElement('li');
				liStack.push(liNode);
				ulNode.appendChild(liNode);
				
				key = keyWork.shift();
				//=======================================
				valueNode = formatValue.call(this);
				//=======================================
				
				liNode.appendChild(valueNode);
				
				if (level > nextLevel)			//move up ul list tree
				{
					inc = nextLevel - level;
					len = liStack.length;
					liNode = liStack.splice(len-inc,inc)[inc-1];
					ulNode = ulStack.splice(len-inc,inc)[inc-1];
					level = nextLevel;
				}
			}
		}
		//____________________________________________________________________________
		/**
		 *	return span node for specified Object property value wrapping matched 
		 *	characteers in <b> tags if searcher offsets included in results .
		 */
		function formatValue()
		{
			var span = document.createElement('span');
			var textNode = document.createTextNode(key + ': ');
			span.appendChild(textNode);
			
			
			var text, tag, off, chPos = 0;
			var value = this.options.getFn(item, keys[i])[0];
			var itemOffsets = offsets[keys[i]] || [];
			for (var j=0; j < itemOffsets.length; j += 2)
			{
				text = value.substr(chPos,itemOffsets[j]);
				if (text)
					span.appendChild(document.createTextNode(text));
				
				tag = document.createElement('i')
				span.appendChild(tag);
				
				text = (value + '...........>>').substring(itemOffsets[j], itemOffsets[j+1]);
				tag.appendChild(document.createTextNode(text));
				chPos = itemOffsets[j+1];
			}
			text = value.substr(chPos);
			if (text)
				span.appendChild(document.createTextNode(text));
			
			while (keys[i] == scoredKey)
			{
				liNode.setAttribute('class', 'scored');
				var score = getInclude.call(this,'score') + '';
				if (score === '') break;
				
				var br = document.createElement('br');
				span.appendChild(br);
				textNode = document.createTextNode('score: ' + score.substr(0,6));
				span.appendChild(textNode);
				break;
			}
			return span;
		}
		//____________________________________________________________________________
		/**
		 *	return specified searcher value for current results item index.
		 */
		function getInclude(name)
		{
			return (this.options.include.indexOf(name) != -1) ? results[index][name]
				 : (this.options.include[name]) ? results[name][index] 
				 : '';
		}
	}

	/**
	* Searches for all the items whose keys (fuzzy) match the pattern.
	* @param {String} pattern The pattern string to fuzzy search on.
	* @param {Object} optional updated options -- replaces only those supplied
	* @return {Array} A list of all search matches.
	* @public
	*/
	Fuse.prototype.search = function(pattern, options) 
	{
		pattern = pattern || '';
		if (typeof(pattern) == 'object' && pattern.childNodes)
		{
			pattern.blur();		//flush all input to form field value then...
			pattern.focus();	//return focus -- for Dreamweaver enviornment
			pattern = pattern.value || '';			
		}
		pattern += '';			//make sure we have String
		
		if (options)			//update any options if specified
		{
			for (key in options)
				this.options[key] = options[key];
		}
		options = this.options;
		this.canceled = false;
		
		var searcher = new(this.options.searchFn)(pattern, this.options),
			i, j, item,
			message = '',
			list = this.list,
			isArray = false,
			dataLen = list.length,
			searchKeys = this.options.keys,
			searchKeysLen = searchKeys.length,
			bitapResult,
			rawResults = [],
			resultMap = {},
			existingResult,
			results = [],
			includeItems = [],
			includeArrays = [],
			returnedItems = options.id || [],
			ctx = this;
			callback = null;
			cancelTime = 0,
			pauseTime = 0,
			time = new Date().getTime();
		
		returnedItems = Utils.isArray(returnedItems) 
					  ? returnedItems 					//Array of id's
					  : returnedItems.split(/\s*,\s*/);	//comma delimited string
			
		// Split include into includeItems or includeArrays
		for (i in options.include)
		{
			if (isNaN(i))
			{
				if (i=='length' || !options.include.hasOwnProperty(i)) continue;
				includeArrays.push(i);
				results[i] = [];
			}
			else
				includeItems.push(options.include[i]);
		}
		if (typeof(options.callback) == 'function')
		{
			callback = options.callback;
			if (!isNaN(options.cancelTime) && options.cancelTime > 0)
				cancelTime = time + Number(options.cancelTime);
			
			if (!isNaN(options.pauseTime) && options.pauseTime > 0)
				pauseTime = time + Number(options.pauseTime);
		}
		
		//___________________________________________________________________________
		/**
		 * Calls <Searcher::search> for bitap analysis. Builds the raw result list.
		 * @param {String} text The pattern string to fuzzy search on.
		 * @param {String|Number} entity 
		 *						  If the <data> is an Array, entity will be an index,
		 *                        otherwise it's the item object.
		 * @param {Number} index
		 * @private
		 */
		var analyzeText = function(text, entity, index, key) 
		{												//if the text can be searched
			if (text === undefined || text === null) return;
			if (typeof text === 'string') 
			{
				bitapResult = searcher.search(text);	//get the result
				
				// If a match is found, add the item to <rawResults>, including its score
				if (bitapResult.isMatch) 
				{										//if item already exists in our results
					var map = resultMap[index];
					if (map)							//use the lowest score
					{
						if (map.score > bitapResult.score)
						{
							map.score = bitapResult.score;
							map.scoredKey = key;
						}
					}
					else 
					{									//add it to the raw result list
						map = resultMap[index] = {
							item: entity, 
							matchedKeys: [],			//not used for list of Strings
							locations: (key ? {} : []),
							offsets: (key ? {} : []),
							score: bitapResult.score
						};
						map.itemIndex = index;
						map.scoredKey = key;
						rawResults.push(map);
					}
					if (key)
					{
						map.matchedKeys.push(key);
						map.locations[key] = (map.locations[key] || []).concat(bitapResult.locations);
						map.offsets[key] = (map.offsets[key] || []).concat(bitapResult.offsets);
					}
					else
					{
						map.locations.push(bitapResult.locations);
						map.offsets.push(bitapResult.offsets);
					}
				}
			} 
			// TODO: 
			// Are there ever multiple Array items for an Object property?
			// Does this support Object properties containing Arrays?
			// if so, then more work is required to save locations & offsets
			else if (Utils.isArray(text)) 
			{
				for (var i = 0; i < text.length; i++)
				{
         			analyzeText(text[i], entity, index, key);
				}
			}
		};
		
		var analyze = function()
		{
			if (analyze.context.canceled && callback) 		//don't think possible w/o callback...
				return analyzeDone();						//...since no pause for other script
			
			for (;analyze.index < dataLen; analyze.index++)	// Iterate over every item
			{
				var i = analyze.index
				if  (isArray)								//Array index is key for searcher
					analyzeText(list[i], i, i);				//locations and offsets
				else
				{
					var item = list[i];
					for (j = 0; j < searchKeysLen; j++) 	// Iterate over every key
					{
						var key = searchKeys[j];
						analyzeText(options.getFn(item, key), item, i, key);
					}
				}
				if (options.maxResults && rawResults.length >= options.maxResults)
					return callback ? setTimeout(analyze, 0) : void(0);
			
				if (cancelTime > 0 || pauseTime > 0)
				{
					var time = new Date().getTime();
					if (cancelTime > 0 && time > cancelTime)
					{
						results.canceled = true;
						return analyzeDone(); 
					}
					else if (pauseTime > 0 && time > pauseTime)
					{ 
						pauseTime = new Date().getTime() + Number(options.pauseTime);
						return setTimeout(analyze, 0);
					}
				}
			}
			if (callback) analyzeDone();
		}
		
		if (!list || !Utils.isArray(list) || list.length == 0)
		{
			message = 'search list not found, invalid or empty';
		}
		// when first item in list is string -- assume every item is string
		else if  (typeof list[0] === 'string')
		{
			isArray = true;
			returnedItems = (options.id.indexOf('value') != -1);
		}
		// Otherwise, if first item is an Object searching is done on the values
		// of the keys of each item -OR- all top level keys found in first item.
		else if (typeof(list[0]) == 'object')
		{
			if (searchKeysLen == 0)
			{
				searchKeys = getKeys(list[0]);
				searchKeysLen = searchKeys.length;
			}
			if (options.id) 							
				returnedItems = Utils.isArray(options.id) 
							  ? options.id 						//Array of id's
							  : options.id.split(/\s*,\s*/);	//comma delimited string
		}
		else
		{
			message = 'list[0] does not containg String or Object';
			dataLen = 0;
		}
		
		  //----------------------\\
		 //----- analyze done -----\\
		//--------------------------\\
		var analyzeDone = function analyzeDone()
		{						//sort results if specified and search not canceled . . .
			if (options.shouldSort && !results.canceled)
			{
				if (options.sortfn)
					rawResults.sort(options.sortFn);	//Custom sort specified
				
				else
				{
					var sortKeys = options.shouldSort === true ? true	//sort by scpre
								 : isArray ? (options.sortKeys =='value')
								 : options.shouldSort == 'id' ? returnedItems
								 : options.shouldSort == 'keys' ? (options.sortKeys || searchKeys)
								 : Object.keys(list[0]);
					
					rawResults.sort(function(a, b)	 	//Default sort function . . .
					{
						if (results.canceled)
						
						if (sortKeys === true)
							return a.score - b.score;		//sort by score
						
						if (sortKeys === 'value')			//sort list of Strings by value
							return compare(list[a.item], list[b.item]);
						
						
						for (var i=0; i<sortKeys.length; i++)
						{									//deep Object sort on specified keys
							var key = sortKeys[i];
							var av = options.getFn(a.item, key)[0];
							var bv = options.getFn(b.item, key)[0];
							var value = compare(av, bv);
							if (value !== 0) 
								return value;
						}
						return 0;
						//___________________________________________________________
						function compare(a,b)
						{
							av = a + '';
							bv = b + '';
							var len = Math.min(av.length, bv.length);
							av = av.substr(0,len).toLowerCase();
							bv = bv.substr(0,len).toLowerCase();
							return av == bv ? 0 : 
								   av < bv ? -1 : 1;
						}
					});
				}
			}
			//___________________________________________________________________________
			/**
			 *	Helper function: replaces the item with its value based on options.
			 *	if returnedItems is true for Strings or Array for list of Objects.
			 */
			var replaceValue = returnedItems === true ?
			function(i)						 	//return item value for list of Strings
			{
				rawResults[i].item = list[rawResults[i].item];
			} 
			: returnedItems.length ? 	
			function(i) 						//list of Objects -- id(s) specified
			{
				if (returnedItems.length == 1)	//single id specified
					rawResults[i].item = options.getFn(rawResults[i].item, options.id)[0];
				else									
				{								//multiple ids specified
					var items = {};
					for (var j=0; j<returnedItems.length; j++)
					{
						var value = options.getFn(rawResults[i].item, returnedItems[j])[0];
						var deep = returnedItems[j].split('.');
						var obj = items;
						while (deep.length > 1)
						{
							var key = deep.shift();
							if (typeof(obj[key]) == 'undefined')
								obj[key] = {};
							obj = obj[key];
						}
						obj[deep.shift()] = value;
					}
					rawResults[i].item = items;
				} 
			} 
			: function() 							//no replace necessary
			{
				return; 
			};
	
			//___________________________________________________________________________
			/**
			 *	Helper function: returns the results item formatted per specified options.
			 */
			var getItem = function(i) 
			{
				var resultItem = rawResults[i].item;
				
				// If include has values, put the item under result.item
				if (includeItems.length > 0)
				{									
					resultItem = {item: rawResults[i].item};	
				
					// Then include the includes
					for (var j = 0; j < includeItems.length; j++)
					{								
						var includeVal = includeItems[j];
						resultItem[includeVal] = rawResults[i][includeVal];
					}
				}
				// For includes returned as results property Array
				if (includeArrays.length > 0)
				{
					for (var j = 0; j < includeArrays.length; j++)
					{									
						var includeVal = includeArrays[j];
						results[includeVal].push(rawResults[i][includeVal]);	
					}
				}
				return resultItem;
			};
			
			// From the results, push into a new array only the item identifier(s) if specified
			// OR the entire item.  This is because we don't want to return the <rawResults>,
			// since it contains other metadata;
			for (var i = 0, len = rawResults.length; i < len; i++) 
			{
				replaceValue(i);
				results.push(getItem(i));
			}
		
			if (options.searchTime) 
			{
				time = (new Date().getTime() - time) / 1000;
				seconds = parseInt(time * 1000 + .5) / 1000;
				results.searchTime = (seconds === 0 ? '0.000' : seconds) + ' seconds';
			}
			
			// Display formattedResults html container specified
			if (options.formattedResults)
			{
				var el = document.getElementById(options.formattedResults);
				this.formatResults(el, results, options.keys)
			}
			
			if (callback)
				callback(results);
			else
				return results;
	
		};
		
		  //-----------------------\\
		 //----- start analyze -----\\
		//---------------------------\\
		analyze.index = 0;			
		analyze.context = this;			
		if (callback) 
			return setTimeout(analyze,0);
		
		analyze();
		return analyzeDone.call(analyze.context);
	};

	// Export to Common JS Loader
	if (typeof exports === 'object') 
	{
		// Node. Does not work with strict CommonJS, but only CommonJS-like environments 
		// that support module.exports, like Node.
		module.exports = Fuse;
	} 
	else if (typeof define === 'function' && define.amd) 
	{
		// AMD. Register as an anonymous module.
		define(function() {return Fuse;});
	} 
	else 
	{
		// Browser globals (root is window)
		global.Fuse = Fuse;
	}

})(this);
