/**
 * @license
 * Fuse - Lightweight fuzzy-search
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
 * 	reformatted using EZ format conventions -- renamed to EZfuzzy
 *	defined as EZ.fuzzy scope used of global window scope if EZ object defined
 *
 *	Additional options: seconds, cancelable, items
 *	
 * 	added seconds option to return search time
 *	quit search if cancel set during processing
 *	support html form field as search argument
	*/
/*--------------------------------------------------------------------------------------------------
EZ.fuzzy(o [, options])  constructor

ARGUMENTS:
	list		specifies search strings as Array of Strings or Objects to search for matches
				for objects, the value of all or only specified object key(s) are searched
				TODO: Array or delimited string (values separated by commas or spaces)
	
	options		(optional) Object containing one or more of the following properties:
				location 		Approximately where in search strings is the searchWord expected
								e.g. =2 to start looking after "EZ" in "EZmyfunction" function name
								default: 0
								
				distance		Specifies how close the match must be to the specified location.
								An exact letter match which is 'distance' or morecharacters away from
								the location will score as a complete mismatch. A distance of '0' thus
								requires the match be at the exact location specified. A distance of 
								'1000' will require a perfect match to be within 800 characters of the
								speified location (using a 0.8 threshold).

				threshold		specifies when the match algorithm gives up. A threshold of '0.0' 
								requires a perfect match (letters and location); a threshold of '1.0'
								matches anything.

				keys			specifies Object keys searched when list is Array of Objects
				
				
				items			specified Object keys returned as Array item values -- true if list
								is an Array of Strings to return String
				
				seconds			returns milliseconds / 1000 used for search as results Array property
								e.g. 0.020 seconds
				
				cancelable		true to quit processing if this.cancel set during processing
				
				sort			true to sort results by score 
								TODO: comma delimited String to specify Object properties
								TODO: Function to specify function used for sort
				
				include			'score' to include calculated score in search results
								
USAGE:
	var list = [						
	{									
	  title: "Old Man's War",
	  author: {
		firstName: "John",
		lastName: "Scalzi"
	  }
	},
	{
	  title: "The Lock Artist",
	  author: {
		firstName: "Steve",
		lastName: "Hamilton"
	  }
	}]
	fuzzy = new EZ.fuzzy(list, options);
	results = fuzzy.search('Robb');
	
	fuzzy = new EZ.fuzzy(['apple', 'bannana', 'orange', 'peach'])
	results = fuzzy.search('paech');

RETURNS:
	new EZfuzzy Object created using specified list/options with the following function which
	can be repeatedly called with different arguments w/o need to re-create list hash when it
	has not been changed:
	
		EZfuzzy.search(searchWord)	
		
		ARGUMENTS:
			searchWord	string/pattern used to find matches in specified list can be specified as 
						String or TODO: html form field element
			options		TODO (optional) Object containing options that override default or explicit
						options initially defined by constructor.
		RETURNS:
			Array of items found matching searchWord
			sets Array 'seconds' property if seconds option specified
			sets Array 'cancel' property if EZfuzzy.cancel set during search

REFEERENCE:
	http://kiro.me/projects/fuse.html
	https://en.wikipedia.org/wiki/Bitap_algorithm

TODO:
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
			return {isMatch: true, score: 0};

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
		locations = [];

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
					if (score <= THRESHOLD) 
					{							//expect better than any existing match but check anyway.
            THRESHOLD = score;
            bestLoc = j - 1;
            locations.push(bestLoc);

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
		return {isMatch: bestLoc >= 0, score: score};
  };

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
    this.options = options = options || {};

    var i, len, key, keys;
    // Add boolean type options
		for (i = 0, keys = ['sort', 'shouldSort'], len = keys.length; i < len; i++) 
		{
      key = keys[i];
      this.options[key] = key in options ? options[key] : Fuse.defaultOptions[key];
    }
    // Add all other options
		for (i = 0, keys = ['searchFn', 'sortFn', 'keys', 'getFn', 'include'], len = keys.length; i < len; i++) 
		{
      key = keys[i];
      this.options[key] = options[key] || Fuse.defaultOptions[key];
    }
  };

	Fuse.defaultOptions = 
	{
    id: null,
    caseSensitive: false,

    // A list of values to be passed from the searcher to the result set.
    // If include is set to ['score', 'highlight'], each result
    //   in the list will be of the form: `{ item: ..., score: ..., highlight: ... }`
    include: [],
    shouldSort: true,

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

		sortFn: function(a, b) 		// Default sort function
		{
      return a.score - b.score;
    },
		getFn: Utils.deepValue,		// Default get function
    keys: []
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
   * Searches for all the items whose keys (fuzzy) match the pattern.
   * @param {String} pattern The pattern string to fuzzy search on.
	* @return {Array} A list of all search matches.
   * @public
   */
	Fuse.prototype.search = function(pattern) 
	{
    var searcher = new(this.options.searchFn)(pattern, this.options),
      j, item,
      list = this.list,
      dataLen = list.length,
      options = this.options,
      searchKeys = this.options.keys,
      searchKeysLen = searchKeys.length,
      bitapResult,
      rawResults = [],
      resultMap = {},
      existingResult,
			results = [],
			time = new Date();

		//___________________________________________________________________________
    /**
     * Calls <Searcher::search> for bitap analysis. Builds the raw result list.
     * @param {String} text The pattern string to fuzzy search on.
		 * @param {String|Number} entity 
		 *						  If the <data> is an Array, entity will be an index,
     *                            otherwise it's the item object.
     * @param {Number} index
     * @private
     */
		var analyzeText = function(text, entity, index) 
		{												//if the text can be searched
			if (text === undefined || text === null) return;
			if (typeof text === 'string') 
			{
				bitapResult = searcher.search(text);	//get the result

        // If a match is found, add the item to <rawResults>, including its score
				if (bitapResult.isMatch) 
				{										//if item already exists in our results
          existingResult = resultMap[index];
					if (existingResult)					//use the lowest score
            existingResult.score = Math.min(existingResult.score, bitapResult.score);
					else 
					{									//add it to the raw result list
						resultMap[index] = {item: entity, score: bitapResult.score};
            rawResults.push(resultMap[index]);
          }
        }
			} 
			else if (Utils.isArray(text)) 
			{
				for (var i = 0; i < text.length; i++)
          analyzeText(text[i], entity, index);
        }
    };
		if (typeof list[0] === 'string') 
		{
			// when first item in list is string -- assume every item is string
			for (var i = 0; i < dataLen; i++)			// Iterate over every item
			{
        analyzeText(list[i], i, i);
				if (this.cancel != undefined) break;
			}
      }
		else //TODO: if (typeof(list) == 'object'
		{
			// Otherwise, assume first item is an Object (hopefully), and thus 
			// searching is done on the values of the keys of each item.
			for (var i = 0; i < dataLen; i++) 
			{											// Iterate over every item
        item = list[i];
				for (j = 0; j < searchKeysLen; j++) 	// Iterate over every key
				{
          analyzeText(options.getFn(item, searchKeys[j]), item, i);
					if (this.cancel != undefined) break;
        }
				if (this.cancel != undefined) break;
      }
    }
		if (options.shouldSort) 
      rawResults.sort(options.sortFn);

		//___________________________________________________________________________
		/**
		 *	Helper function: replaces the item with its value, if specified option.
		 */
		var replaceValue = options.id 
						 ? function(i) {rawResults[i].item = options.getFn(rawResults[i].item, options.id)[0]} 
						 : function() {return};	// do nothing

		//___________________________________________________________________________
		/**
		 *	Helper function: returns the item formatted based on the options.
		 */
		var getItem = function(i) 
		{
      var resultItem;
			if(options.include.length > 0) 					// If `include` has values . . .
      {
        resultItem = {
          item: rawResults[i].item,
        };
        for(var i = 0; i < options.include.length; i++)
				{											//then include the includes
          var includeVal = options.include[i];
          resultItem[includeVal] = rawResults[i][includeVal];
        }
      }
      else
        resultItem = rawResults[i].item;
      return resultItem;
    };

    // From the results, push into a new array only the item identifier (if specified)
    // of the entire item.  This is because we don't want to return the <rawResults>,
    // since it contains other metadata;
		for (var i = 0, len = rawResults.length; i < len; i++) 
		{
      replaceValue(i);
      results.push(getItem(i));
    }

		if (options.seconds) 
		{
			var seconds = (new Date().getTime() - time.getTime()) / 1000;
			seconds = parseInt(seconds * 1000 + .5) / 1000;
			results.seconds = (seconds === 0 ? '0.000' : seconds) + ' seconds';
		}
    return results;
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

})(window.EZ || this);
