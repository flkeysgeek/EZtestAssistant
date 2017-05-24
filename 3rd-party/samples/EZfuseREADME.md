EZ.fuzzy(list [, options])  constructor

ARGUMENTS:
	list		(required) Array of Strings or Objects to search for fuzzy matches. For list of 
				Objects, all Object properties are searched unless the keys options is specified.
				TODO: Array or delimited string (values separated by commas, spaces and/or newlines)
	
	options		(optional) Object containing one or more of the following properties:
	
				keys		Specifies Object properties searched when list is Array of Objects.
							Supports nested properties via dot notation e.g. "author.firstName"
							default: all Object properties
				
				id			The name of Object identifier(s) i.e. properties returned as an item 
							in the returned search results Array when list is Array of Objects.
							Specified as String for single identifier (backward compatibility) 
							-or- Array for one or more Object identfier properties.
							default: all Object properties

				itemValue	true to return Array item value when list is Array of Strings.
							default: false -- return Array item index
				
				sort -or-	true 	sort search results Array by score.
				shouldSort	"id" 	sort by identifier properties in the order specified.
							"keys" 	sort by sortKeys if specified else by keys if specified
									otherwise sort by all Object properties in order defined.
							"value" sort Array Strings by value
							default no sort - items in same order as list
				
				sortKeys	Array of list Object keys (i.e. properties) used for sort by "keys".
				
				include		Specifies the searcher's output values to include with the returned
							list of matched items.  Can be an Array of Strings containing the
							searcher's value names (e.g. "score"), an Object with properties 
							corresponding to the value names or both.
							
							When any searcher values are specified as Array items, each matched
							list item in the returned results Array will be of the form: 
								{ item: ..., include1: ..., include2: ... }.  
							
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

				threshold	specifies when the match algorithm gives up. A threshold of '0.0' 
							requires a perfect match (letters and location); a threshold of '1.0'
							matches anything.
							default: 0.6
				
				cancelable	true to quit processing if this.cancel set during processing
							default: false

				maxResults	If specified, maximun items returned after sort if specified.
				
				maxPatternLength 
							The maximum length of the search text pattern. The longer the
							pattern the more intensive the search operation will be. Whenever 
							the pattern exceeds the maxPatternLength, an error will be thrown. 
							Why is this important? Read: http://en.wikipedia.org/wiki/Word_(computer_architecture)#Word_size_choice
				
				truncateSearchText
							if search text exceeds maxPatternLength, truncate in lieu of exception.
				
				searchTime	Sets searchTime property in returned Array to String of the form: "0.002 seconds"
							representing time for search as milliseconds / 1000.
								
				searchFn, sortFn, getFn -- see function descriptiond below or README:
							https://github.com/krisk/Fuse/blob/master/README.md

RETURNS:
	new Fuse Object created with specified list/options with the following functions which
	can be repeatedly called with different arguments w/o need to re-create list hash when it
	has not been changed:
	
		search(text)	
		
			Searches for all the items whose keys (fuzzy) match the pattern.
		
			ARGUMENTS:
				searchWord	string/pattern used to find matches in specified list can be specified as 
							String or TODO: html form field element
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
