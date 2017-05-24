INLINE_CODE_NAME = 'script@'

/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function EZstart()
{
	g.note = EZgetValue('note');	//save initial text
	g.checklists = {};
	g.highlighted = [];
	
	g.extractedLayer = EZgetEl('extractedLayer');
	var node = g.extractedLayer.EZgetEl('extractedNode');
	g.extractedNodeClone = node.cloneNode(true);
	EZremoveClass(g.extractedNodeClone, 'hidden');
	g.extractedLayer.removeChild(node);
	
	g.extractFolderBase = EZ.constant.configPath + 'ExtractFunctions/'
	updateExistingFolders();
	
	setExtractFolder();		//show load options button if any saved for default extract folder
	setFunctionFiles();
	EZsetValue('functionFiles', 'EZtest.js');
	
	//EZ.legacy.EZgetElnull=false;
	//g.none = EZgetEl('monkey');
}
/*---------------------------------------------------------------------------------------------
Populate existingFolders
---------------------------------------------------------------------------------------------*/
function updateExistingFolders()
{
	g.existingFolders = DWfile.listFolder(g.extractFolderBase, 'folders');
	//g.existingFolders.unshift(EZgetEl('extractedExisting').options[0].text)
	EZdisplayDropdown('extractedExisting', g.existingFolders);
	setTimeout(function()
	{
		var el = EZgetEl('extractedExisting');
		el.size = Math.min(15, el.options.length);
	},500);
}
/*---------------------------------------------------------------------------------------------
Select functionFiles if specified e.g. loadOptions
---------------------------------------------------------------------------------------------*/
function setFunctionFiles(functionFiles)
{
	var folder = EZgetValue('functionsFolder');
	var files = DWfile.listFolder(EZ.constant.configPath + folder + '/*.js');
	var el = EZgetEl('functionFiles');
	EZdisplayDropdown(el, files);
	
	setTimeout(function()
	{
		var el = EZgetEl('functionFiles');
		el.size = Math.min(20, el.options.length);
		if (functionFiles)
			EZsetValue(el, functionFiles)
	},500)
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function selectFiles(el)
{
	g.files = EZgetValues('functionFiles');
	if (g.files.length == 1)
	{
		EZsetValue('extractFolder',EZgetFileInfo(g.files[0]).filename);
		setExtractFolder();
	}
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function changeExtractFolder(el)
{
	var value = EZgetValue(el);
	EZsetValue('extractFolder', value); 
	setExtractFolder();
	//TODO: ??
	//EZgetEl('extractFolder').select();
}
/*---------------------------------------------------------------------------------------------
set setExtractFolder -- chech for saved options
---------------------------------------------------------------------------------------------*/
function setExtractFolder()
{
	g.optionsFile = '';
	g.extractFolder = EZgetValue('extractFolder');
	if (g.extractFolder) 
	{
		g.extractFolder = g.extractFolderBase + g.extractFolder + '/'
		g.optionsFile = g.extractFolder.clip() + '.xml';
	}
	var isHide = !g.optionsFile || !DWfile.exists(g.optionsFile);
	EZaddClass('loadOptionsBtn', 'hidden', isHide);
	EZaddClass('deleteOptionsBtn', 'hidden', isHide);
	
	EZgetEl('extractedExisting').selectedIndex = -1;
///	if (!isHide) setTimeout('loadOptions()',1000);	
	
	return true;	//let event after onblur() proceed -- dont think has any effect
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function loadOptions()
{
	var dom = EZgetDOM(g.optionsFile);
	if (!dom)
		return displayMessage('*Error loading: ', g.optionsFile);
	
	var functionFiles = '';
	var fields = dom.getElementsByTagName("field");
	for (var i=0;i<fields.length;i++)
	{
		var name = fields[i].getAttribute("name");
		var value = fields[i].innerHTML.trim();
		if (name == 'functionFiles')
			functionFiles = value;
		EZsetValue(name,value);
	}
	EZreleaseDOM(dom);
	
	setFunctionFiles(functionFiles);
	setExtractFolder();
	showProtoNote();
	//showOppsCallNote();
	showOopsNote();
	displayMessage('options loaded from: ', g.optionsFile);
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function deleteOptions()
{
	DWfile.remove(g.optionsFile);
	setExtractFolder();
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function saveOptions(url)
{
	var xml = EZ.constant.xmlHeader + '\n<fields>\n'
	var fm = document.forms[0];
	var processedFields = {};				//used to skip duplicate fields
	for (var i = 0; i < fm.elements.length ; i++ )	//for all form elements
	{
		var el = fm.elements[i];
		var name = el.name || el.id || '';
		if (!name || processedFields[name] || EZhasClass(el, 'nosave')) continue;
		processedFields[name] = true;
		
		var value = EZgetValue(el);
		xml += '<field name="' + name + '">\n';
		if (value !== '')
			xml += value + '\n';
		xml += '</field>\n';
	}
	xml += '</fields>';
	DWfile.write(url, xml);
	setExtractFolder();
	if (url == g.optionsFile)
		displayMessage('options saved to: ', g.optionsFile);
}
/*---------------------------------------------------------------------------------------------
Show or hide opps function name after note
---------------------------------------------------------------------------------------------*/
function showProtoNote()
{
	EZremoveClass('optionsLayer', 'hidePrototype', EZgetChecked('includePrototype'));
}
/*---------------------------------------------------------------------------------------------
Show or hide dot after prefix options / note under fn statement & fn calls
hide both places if no old prefix
show under statement or call if associated option selected

if other text field, check or uncheck associated checkbox if value blank or not
---------------------------------------------------------------------------------------------*/
function showOppsCallNote(el)
{
	if (el && el.id.indexOf('PrefixOtherText') != -1)
	{
		var oldNew = el.id.substr(0,3);
		if (oldNew == 'old')
			EZsetChecked('oldFuncPrefixOther',el.value)	
		else if (oldNew == 'new' && el.value)
			EZsetValue('newFuncPrefix','other');	
	}
	var isOldPrefix = getOldPrefix().length > 0;
	EZremoveClass('optionsLayer', 'hideOopsCall', isOldPrefix);
	if (isOldPrefix)
	{
		EZvisible('functionCallDotAfter', EZgetValue('formatCalls'));
		EZvisible('functionNameDotAfter', EZgetValue('format') == 'oops');
	}
}
/*---------------------------------------------------------------------------------------------
Show or hide opps function name after note
---------------------------------------------------------------------------------------------*/
function showOopsNote()
{
	EZremoveClass('optionsLayer', 'hideOpps', EZgetValue('format') == 'oops');
	showOppsCallNote();
}
/*---------------------------------------------------------------------------------------------
Select options with text or value matching one of items in value array
---------------------------------------------------------------------------------------------*/
function EZselectListOptions(list, values)
{
	list = EZgetEl(list);
	if (typeof(list) != 'object' || !/select/i.test(list.tagName)) return;
	if (!EZisArray(values)) values = []; 	//use empty array to unselect all
	
	for (var i=list.options.length-1; i>=0; i--)
		list.options[i].selected = (values.indexOf(list.options[i].text) != -1
								|| values.indexOf(list.options[i].value) != -1)
}
/*---------------------------------------------------------------------------------------------
setup new eztract -- get current options -- clone new html container to display files
---------------------------------------------------------------------------------------------*/
function extract()
{
	// required fields
	g.files = EZgetValues('functionFiles');
	if (g.files.length && !g.files[0]) g.files.shift();	//drop blank	
	
	if (!g.files.length)
		return displayMessage('*No files selected');
	else if (!g.extractFolder)
		return displayMessage('*No folder selected');

	// old --> new prefix
	g.changePrefix = EZgetValue('changePrefix');
	g.dotAfterPrefix = EZgetValue('dotAfterPrefix');
	
	g.newFuncPrefix = '';
	if (g.changePrefix)
	{
		g.newFuncPrefix = EZgetValue('newFuncPrefix');
		if (g.newFuncPrefix == 'other') 
			g.newFuncPrefix = EZgetValue('newFuncPrefixOther');
	}
	// always get prefixes
	var patterns = getOldPrefix();
	if (!patterns.length)
		patterns.push('\\w+');
	
	g.descPrefixPattern = new RegExp( '\\b(' + patterns.join('|') + ')([\\w.]*)\\b', 'g');
	g.funcCallsPattern = new RegExp( '(\\bfunction\\s*)?\\b(' + patterns.join('|') + ')(\\.?)([\\w.]*)\\b\\s*\\(', 'g');
	g.oldPrefixPattern = new RegExp( '^(' + patterns.join('|') + ')(\\.?)(.*)');
			
	// remaining fields
	displayMessage('*Processing');
	
	g.includePrototype = EZgetValue('includePrototype');
	g.includeAnonymous = EZgetValue('includeAnonymous');	
	g.extractNested = EZgetValue('extractNested');	
	
	g.includeDesc = EZgetValue('includeDesc');
	g.updateDesc = EZgetValue('updateDesc');
	
	g.filter = EZgetValue('filter');
	if (g.filter && /[?*]/.test(g.filter))	//if regex...
		g.filter = new RegExp(g.filter);
	g.filterAction = EZgetValue('filterAction');
	
	g.format = EZgetValue('format');
	g.formatCalls = EZgetValue('formatCalls');
	g.oopsFuncName = EZgetValue('oopsFuncName');
	g.prototypeName = EZgetValue('prototypeName');
	g.prototypePrefix = EZgetValue('prototypePrefix');
	g.prototypePrefixKeep = EZgetValue('prototypePrefixKeep');
	
	g.filesPath = EZ.constant.configPath + EZgetValue('functionsFolder') + '/';
	
	g.isInline = false;
	g.fnNames = {};
	g.manifestList = [];
	g.manifestFile = g.extractFolder + '_export.log';
	g.mergeList = [];
	g.mergeBatch = g.extractFolder + '_merge.bat';

	g.fileSize = 0;
	for (var i=0; i<g.files.length; i++)
		g.fileSize = Math.max(g.fileSize, g.files[i].length);
	g.filePad = ' '.dup(g.fileSize + 1);
				  
	if (EZisChecked('deleteExisting'))
		DWfile.remove(g.extractFolder);		//rmdir
	DWfile.createFolder(g.extractFolder);	//mkdir
	
	// remove extracted list if found for existing extract To folder
	var extractFolderInfo = EZgetFileInfo(g.extractFolder.clip());
	var extractFolder = extractFolderInfo.filename; //.replace(/\./g, '_');
	if (g.checklists[extractFolder])
		extractClose(g.checklists[extractFolder]);
	
	// create new extracted list
	var div = g.extractedNodeClone.cloneNode(true);	//top container of each extract list
	g.extractedNode = EZgetEl(div);					//bind EZ... to top div
	g.extractedLayer.appendChild(div);
	g.extractedFrom = div.EZgetEl('extractedFrom');
	g.extractedNote = div.EZgetEl('extractedNote');
	g.extractedCount = div.EZgetEl('extractedCount');
	g.extractedControls = div.EZgetEl('extractedControls');
	
	g.extractedCancel = '';
	EZsetValue(g.extractedNote, extractFolder);		//display To...filename

	var from = g.files[0] + (g.files.length == 1 ? ''
			 : g.files.length-1 + ' others');
	EZsetValue(g.extractedFrom, from);				//display From...filename(s)

	
	var ul = div.EZgetEl('ul');
	var li = div.EZgetEl('li');
	
	ul.extractFromPath = g.filesPath;
	ul.extractPath = g.extractFolder;
	ul.extractFolder = extractFolder;
	ul.mergeBatch = g.mergeBatch;
	ul.mergeScript = g.extractFolder.clip(1) + '.js'
	ul.sortButtons = extractFolder + 'Sort';
	g.sortableList = ul;
	
	g.sortableItem = li.cloneNode(true);	//clone li for functions
	
	var checkbox = li.getElementsByTagName('input')[0];
	var checkAll = function()
	{										//delay lets double-click cancel checkAll
		setTimeout("checklistSelectAll('" + extractFolder + "')", 250);
		return true; 
	};
	if (window.addEventListener) checkbox.addEventListener("click", checkAll, false);
	else if (window.attachEvent) checkbox.attachEvent("onclick", checkAll);
	
	EZremoveClass(li, 'dragable');					//remove from check all
	EZremoveClass(g.sortableItem, 'not-dragable');	//remove for functions

	var sortButtons = div.EZgetEl(['sortBtn']);
	for (var i=0; i<sortButtons.length; i++)
		sortButtons[i].name = ul.sortButtons;
	
	g.checklists[extractFolder] = ul;				//list of checklists
	setTimeout("extractProcess()", 0);
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function getOldPrefix()
{
	var patterns = [];
	for (var el in {oldFuncPrefixEZ:0, oldFuncPrefixRZ:0, oldFuncPrefixOther:0})
	{
		var prefix = EZgetValue(el);
		if (!prefix) continue;
		if (prefix == 'other')
			prefix = EZgetValue('oldFuncPrefixOtherText');
		if (prefix)
			patterns.push(prefix);
	}
	return patterns;
}
/*---------------------------------------------------------------------------------------------
Create new EZsortable instance for extracted list
---------------------------------------------------------------------------------------------*/
function checklistEnableSortDrag(list)
{
if (EZ.quit !== false)
	list.sortable = EZsortable.create(list, 
	{
		group: {name: "checklist", pull: 'clone', put: true},
		filter: ".delete",		//specifies selector of tags that call onFilter onMouseDown
		draggable: '.dragable',	//toArray() only returns these elements (used by sort)
		handle: ".drag-handle",	//specifies selector of drag handle tag
		animation: 50,			//sort annimation delay but think store must be configured to sort
								//automatically after item moved -- radio button do sort on demand
		
		onStart:function(evt)
		{ 	// called after move starts -- not on mousedown				
			console.log('onStart:', [evt.item, evt.from, evt.clone]);
			
			EZremoveClass(evt.srcElement, 'notDragging');		//ul containing item being moved
			if (evt.clone && evt.item.exportProp)				//copy exportProp to clone kept when...
				evt.clone.exportProp && evt.item.exportProp;	//...item copied to another list
		},
		onMove: function (evt)
		{ 	//called everytime item moved diff allowed position above or below draggable item
			console.log('onMove:', [evt.dragged, evt.from]);
			
			// draggable selector controls where items can move -- css hides drag handle
			var status = evt;	//evt must be returned to allow move
			return status;		//return false if move disallowed 
		},
		onUpdate: function (evt)
		{	// called after item moved -- before sort
			console.log('onUpdate:', [evt.item, evt.from]); 
			return false;
		},
		onSort:function(evt)
		{ 	// called once for each list after updating with item in new position
			console.log('onSort:', [evt.item, evt.from]);
		},
		onEnd: function(evt)
		{ 	// called after move completed even if item not moved to new position
			console.log('onEnd:', [evt.item, evt.from]);
			
			EZsetValue(evt.from.sortButtons, 'none');	//set from sort "as displayed"
			EZaddClass(evt.from, 'notDragging');		//add back class to display item text
			var toList = getExtractList(evt.item);
			if (toList == evt.from)						//if item moved to new list . . .
				EZsetValue(toList.sortButtons, 'none');	//sort setting in from list
			else
			{
				EZsetValue(toList.sortButtons, 'none');	//sort setting in target list
				updateCount(toList, 1);
				var el = evt.item.getElementsByClassName('name')[0];
				var val = EZgetValue(el);
				if (val.right(1) != '+')
					EZsetValue(el, val + '+');
			}
		},
		onFilter: function(evt)
		{	// called onMouseDown for elements containing filter selector
			console.log('onFilter:', [evt.item, evt.from]);
			
			var idx = g.highlighted.indexOf(evt.item);		
			if (idx != -1) 
				g.highlighted.splice(idx,1);				//delete from selected array
			
			DWfile.remove(evt.item.extractProp.toPath);	//delete extracted file
			if (!evt.item.extractProp || !evt.item.extractProp.toPath)
				return;
			evt.item.parentNode.removeChild(evt.item)	//delete from extracted list
			updateCount(evt.from, -1);
		},
		name: 50
	});
	function updateCount(list, increment)
	{
		var node = getExtractNode(list);
		var el = node.getElementsByClassName('extractedCount')[0];
		EZsetValue(el, EZgetInt(el) + increment);
	}
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function checklistDeleteChecked(el)
{
	var countEl = getExtractNode(el).getElementsByClassName('extractedCount')[0];
	var count = EZgetInt(countEl);
	var tags = getExtractList(el).getElementsByTagName('li');
	for (var i=tags.length-1; i>0; i--)
	{
		if (!tags[i].getElementsByTagName('input')[0].checked) continue;
		DWfile.remove(tags[i].extractProp.toPath);	//delete extracted file
		tags[i].parentNode.removeChild(tags[i])		//delete from extracted list
		count--;
	}
	EZsetValue(countEl, count);
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function checklistSort(list)
{
	var items = list.sortable.toArray()
	var sortOpt = EZgetValue(list.sortButtons);
	items.sort(sortItems);
	
	var order = [];
	for (var i=0; i<items.length; i++)
	{
		var el = items[i];
		if (!el.id) el.id = list.sortable.generateId(el);
		order.push(el.id);
	}
	list.sortable.sort(order);
	displayMessage('function list sorted by: ' + sortOpt);
	
	//-----------------------------------------------------------------------
	// sort functions
	//-----------------------------------------------------------------------
	function sortItems(ela, elb)
	{
		switch(sortOpt)
		{
			case 'src': 	
			{
				var a = EZgetValue(ela.getElementsByTagName('span')[1]).toLowerCase();
				var b = EZgetValue(elb.getElementsByTagName('span')[1]).toLowerCase();
				break;
			}
			case 'name': 	
			{
				var a = EZgetValue(ela.getElementsByTagName('span')[2]).toLowerCase();
				var b = EZgetValue(elb.getElementsByTagName('span')[2]).toLowerCase();
				break;
			}
			case 'extract': 	
			default:
			{
				var a = ela.getElementsByTagName('input')[0].value.toInt();
				var b = elb.getElementsByTagName('input')[0].value.toInt();
				break;
			}
		}	
		if (a < b)
			return -1;
		if (a > b)
			return 1;
		return 0;		 
	}
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function checklistSelectAll(extractFolder)
{
	var list = g.checklists[extractFolder];
	if (!list) return true;
	
	var tags = list.getElementsByTagName('input');
	var checked = tags[0].checked;
	for (var i=1; i<tags.length; i++)
		tags[i].checked = checked;
	return true;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function extractProcess(nextFn)
{
	if (g.extractedCancel == g.sortableList.extractFolder) 
		return displayMessage('processing canceled');
	
	while (nextFn || g.files.length)
	{
		if (!nextFn)
		{
			g.linenoLast = 0;
			g.file = g.files.shift();
			g.script = DWfile.read(g.filesPath + g.file);
			if (!g.script) continue;
			g.totalLines = EZgetLineCount(g.script);
			g.linenoSize = g.totalLines.toString().length * 2 + 6;
			g.linenoPad = ' '.dup(g.linenoSize);
			g.functionList = EZgetFunctionList(g.script);			
		}
		while (g.functionList.length)
		{
			var fn = g.functionList.shift();
			if (!checkFilter(fn)) continue;
						
			var linenoBeg = fn.lineno + fn.linenoDesc;
			var linenoEnd = fn.lineno + fn.lines - 1;
			var linenoEnd = fn.linenoEnd;
			var offsetBegDesc = EZoffsetFromLineno(g.script, fn.lineno + fn.linenoDesc);
			var offsetEndDesc = EZoffsetFromLineno(g.script, fn.lineno);
			var offsetBegCode = EZoffsetFromLineno(g.script, fn.lineno);
			var offsetEndCode = EZoffsetFromLineno(g.script, fn.lineno + fn.lines);
				
			var name, code, desc, offset;
			//-------------------------------------------------------------------
			// inline code -- not in function
			//-------------------------------------------------------------------
			if (linenoBeg > g.linenoLast)
			{
				name = INLINE_CODE_NAME + g.linenoLast;
				offset = EZoffsetFromLineno(g.script, g.linenoLast);
				code = g.script.substring(offset, offsetBegDesc).trim();
				if (code)
				{
					var item = {name:name, fromFile:g.file, level:0, 
								linenoBeg:g.linenoLast, linenoEnd:linenoBeg-1};
					saveCode(name, code + '\n', item);
				}
			}
			g.linenoLast = linenoEnd + 1;
						
			// function name -- reformatted
			var nameOops = getOopsFunctionName(fn.name);	//opps name -- prefix replaced
			var nameNoDot = getCamelCaseName(nameOops);
			
			name = fn.name;
			desc = g.script.substring(offsetBegDesc, offsetEndDesc);
			code = g.script.substring(offsetBegCode, offsetEndCode);
			
			var results = code.match(EZ.patterns.functionStatement);
			while (results)			//safety for unexpected
			{						//create regex for function statement -- dropping (
				var funcStatement = results[0].trim().clip(1);
				var funcRegex = new RegExp(funcStatement,'g');	//use global to catch comments
				var nameAfterFunction = results[5];
				var oppsFunc = results[4];
				
				//-------------------------------------------------------------------
				// prototype statement
				//-------------------------------------------------------------------
				if (fn.name.indexOf('.prototype.') != -1)
				{
					// add function name after prototype function keyword ?...
					if (g.prototypeName == 'no'					
					|| (g.prototypeName == 'keep' && !nameAfterFunction))
						nameNoDot = ''							//...NO	name after function
					
					else										//...Yes, put name after function
					{													
						var prefixResults = nameOops.match(/(.*)\.prototype\.(.*)/);
						if (!prefixResults) break;				//safety for unexpected
						
						nameNoDot = prefixResults[prefixResults.length-1];
						
						while (g.prototypePrefix == 'yes')		//using object prefix...?
						{										//bail if name exists & keeping as is
							if (g.prototypePrefixKeep && nameAfterFunction)
							{
								nameNoDot = nameAfterFunction;
								break;
							}
							// create or update name after function with or w/o object prefix
							var prefix = prefixResults[1].replace(/\.(\w)/g, function()
										 { return arguments[1].toUpperCase() });
							
							nameNoDot = prefix 
									  + nameNoDot.replace(/(.)/, function() 
									  	{ return arguments[1].toUpperCase() });
							break;
						}
					}
					funcStatement = nameOops + ' = function ' + nameNoDot;
					name = nameOops;
				}
				//-------------------------------------------------------------------
				// Use opps function statements
				//-------------------------------------------------------------------
				else if (g.format == 'oops')				
				{
					if (g.oopsFuncName == 'no'		//if not putting name after function
					|| (g.oopsFuncName == 'keep' && !nameAfterFunction))
						nameNoDot = ''
					funcStatement = nameOops + ' = function ' + nameNoDot;
					name = nameOops;
				}
				//-------------------------------------------------------------------
				// Undo opps function statements
				//-------------------------------------------------------------------
				else if (g.format == 'not')				
				{
					funcStatement = 'function ' + nameNoDot;
					name = nameNoDot;
				}
				/* don't think this makes sence -- ui does not show options
				//-------------------------------------------------------------------
				// Keep function statement as is but change prefix if requested
				//-------------------------------------------------------------------
				else if (g.changePrefix)
				{
					funcStatement = (oppsFunc) ? nameOops + ' = function ' + nameAfterFunction
						 					   : 'function ' + nameNoDot;
					name = nameNoDot;
				}
				*/
				//-------------------------------------------------------------------
				// Keep function statement as is -- no changes
				//-------------------------------------------------------------------
				else
				{
				}
				code = code.replace(funcRegex, funcStatement.trimRight());
				if (fn.nestedCount && fn.name != nameOops)
				{
					regex = new RegExp('^' + fn.name);
					for (var i=0; i<fn.nestedCount; i++)
					{
						 if (i >= g.functionList.length) break;		//safety for unexpected
						 g.functionList[i].nestedName = g.functionList[i].nestedName.replace(regex, nameOops);
					}
				}
				break;
			}
			if (fn.level > 0) 
				name = fn.nestedName;
			else
				name = nameOops;
			
			if (g.fnNames[name] == undefined)		//check for dup function
				g.fnNames[name] = 0;
			else
				name += (g.fnNames[name]++);
				
			code = updateFunctionCalls(code);		//update function calls
			if (!g.includeDesc) 
				desc = '';
			else if (g.updateDesc) 
			{
				desc = updateFunctionCalls(desc);
				if (g.changePrefix)
					desc = desc.replace(g.descPrefixPattern, g.newFuncPrefix + '$2');
			}
			var item = {name:name, fromFile:g.file, toPath:'', level:fn.level, linenoBeg:linenoBeg, linenoEnd:linenoEnd};
			saveCode(name, desc + code, item);		//updates g.manifestList[]
			
			EZsetValue(g.extractedCount, g.manifestList.length);
			//EZsetValue(g.extractedList, EZgetValue(g.extractedList) + format(item));
			
			//-------------------------------------------------------------------
			// inline code -- after all functions
			//-------------------------------------------------------------------
			if (g.functionList.length == 0) 
			{
				name = INLINE_CODE_NAME + g.linenoLast;
				offset = EZoffsetFromLineno(g.script, g.linenoLast);
				code = g.script.substring(offset).trim();
				if (code)
				{
					var linenoEnd = EZgetLineCount(code);
					var item = {name:name, fromFile:g.file, level:0, 
								linenoBeg:g.linenoLast, linenoEnd:linenoEnd+1};
					saveCode(name, code + '\n', item);
				}
				break;
			}
			setTimeout("extractProcess(true)", 0);
			return;
		}
		if (g.files.length == 0) break;
		setTimeout("extractProcess()", 0);
		return;
	}
	displayMessage('processing done');
	updateExistingFolders();	//may have created new folder
	
	//--------------------------------------------------------------------
	// extract done -- wrap up - display controls -- apply default filters
	//--------------------------------------------------------------------
	var html = '';
	g.manifestList.sort(manifestSort)
	for (var i=0; i<g.manifestList.length; i++) 
		html += format(g.manifestList[i] + '\n')
	
	checklistEnableSortDrag(g.sortableList);		//attach sortable 
	EZshow(g.extractedControls);
	setTimeout( function()
	{
		if (!g.isInline)		//gray out inline options if no inline code
			EZaddClass(g.extractedNode, 'inlineDisable');
		else 
		{	
			EZremoveClass('inlineCodeHide', g.extractedNode.EZgetEl('showInlineCode').checked);
			EZremoveClass('srcLinenoHide', g.extractedNode.EZgetEl('showSrcLineno').checked);
		}
	}, 2000);
	/*
	setTimeout(function()
	{
		EZaddClass(g.extractedNode, 'srcLinenoHide');
		EZaddClass(g.extractedNode, 'inlineCodeHide');
	}, 1500);
	*/
	// save _manifest.log & _options.xml
	saveOptions(g.extractFolder + '_options.xml');
	DWfile.write(g.manifestFile, html);
	
	//extractMerge(g.extractedList, g.mergeList);
	
	// create _merge.bat
	var fileInfo = EZgetFileInfo(g.extractFolder.clip(1));
	var script = 'prompt $g\n'
			   + 'cd "' + g.extractFolder + '"\n'
			   + 'copy ' + g.mergeList.join('+') + ' "..\\' + fileInfo.filenameFull + '.js"\n'								  
	if (!DWfile.write(g.mergeBatch, script))
		return displayMessage('*Error on write: ', g.mergeBatch);
	
	var mergeBatch = g.extractFolder.clip(1) + '.js'
	var modifiedTime = DWfile.getModificationDate(mergeBatch);
	var status = dw.launchApp('"' + g.mergeBatch + '"');
	if (modifiedTime == DWfile.getModificationDate(mergeBatch))
		return displayMessage('*Error running: .../' + EZgetFileInfo(g.mergeBatch).filenameFull
							 + '\n' + status);

	/**
	 *	return oops function name e.g. EZmyfunction --> EZ.myfunction
	 */
	function getOopsFunctionName(name)
	{
		if (fn.name.indexOf('.prototype.') != -1) return name;
		
		return name.replace(g.oldPrefixPattern, function(p0,p1,p2,p3)
		{
var dotAfterPrefix = g.dotAfterPrefix || '';
			if (dotAfterPrefix.isTrueLike()) p2 = '.';
			if (dotAfterPrefix.isFalseLike()) p2 = '';
			if (g.newFuncPrefix) p1 = g.newFuncPrefix;
			return p1 + p2 + p3;
		});
	}
	/**
	 *	return camel case name from opps name with embedded dots.
	 */
	function getCamelCaseName(name)
	{
		var results = (name + '.').match(/\w+(?=\.)/g);
		if (!results || results.length < 1) 	//no inner dots in name 
			return name;
		
		var name = results[0];
		results.slice(1).forEach(function(item)
		{
			if (name.right(1).toLowerCase() == name.right(1))
				name += item.charAt(0).toUpperCase();
			else
				name += item.charAt(0).toLowerCase();
			name += item.substr(1);
		});
		return name;
	}
	/**
	 *	update function calls starting with prefix -- convert format if specified.
	 */
	function updateFunctionCalls(code)
	{
		return code.replace(g.funcCallsPattern, function(p0,p1,p2,p3,p4)
		{
			if (p1 != undefined) return p0;		//no change if fn statement
			if (g.newFuncPrefix) p2 = g.newFuncPrefix;
			if (g.formatCalls != 'keep')
			{
var formatCalls = g.formatCalls || '';
				if (formatCalls.isTrueLike()) p3 = '.';
				if (formatCalls.isFalseLike()) p3 = '';
			}
			if (p0.trim().right(1) == '(' && p4.trim().right(1) != '(')
				p4 += '(';
			return p2 + p3 + p4;
		});
	}
	/**
	 *	return number of \n in text
	 */
	function manifestSort(fnA, fnB) 
	{
		var a = fnA.name.toLowerCase();
		var b = fnB.name.toLowerCase();
		if (a < b)
			return -1;
		if (a > b)
			return 1;
		return 0;
	}
	/**
	 *	return true if no filter or name passes
	 */
	function checkFilter(fn)
	{
		var name = fn.name;
		if (!g.includePrototype && name.indexOf('.prototype.') != -1) return false;
		if (name.indexOf('anonymous') != -1) 
		{
			if (!g.includeAnonymous) return false;
		}
		else if (!g.extractNested && fn.level > 0) return false;
		
		if (!g.filter) return true;
		if (typeof(g.filter) == 'string')
			return name.indexOf(g.filter) != -1 ? g.filterAction : !g.filterAction;
		else
			return g.filter.test(name) ? g.filterAction : !g.filterAction;
	}
	/**
	 *	save code to name.js file in extract folder
	 */
	function saveCode(name, code, item)
	{
		item.toPath = g.extractFolder + name + '.js'; 
		item.extractFolder = g.sortableList.extractFolder; 
		g.manifestList.push(item);
														//drop trailing spaces
		code = code.replace(/^(.*?)[ \t]+(\r\n|\r|\n)/gm, '$1$2'); 
		DWfile.write(item.toPath, code);				//save code in file
		if (item.level == 0)							
			g.mergeList.push(name + '.js');				//add to _merge.bat
		
		var li = g.sortableItem.cloneNode(true);				
		li.extractProp = item;							//save export fn properties
		
		if (name.indexOf(INLINE_CODE_NAME) == 0) 
		{
			g.isInline = true;
			EZaddClass(li, 'inlineCode');				//inline code
		}
		if (item.level > 0) 
			EZaddClass(li, 'nested');					//nested function
		
		li.getElementsByTagName('input')[0].value = g.manifestList.length;
		var span = li.getElementsByTagName('span')
		span[1].innerHTML = format(item);
		span[2].innerHTML = name;
		
		g.sortableList.appendChild(li);					//append li to checklist
	}
	/**
	 *	returns string of following form from fn object: EZcore.js (1074:1092)
	 */
	function format(fn)
	{
		var text = ' (' + fn.linenoBeg + ':' + fn.linenoEnd + ')' + g.linenoPad;
		var filename = (fn.fromFile + g.filePad).substr(0,g.fileSize);
		return filename + text.substr(0,g.linenoSize);
	}
}
/*---------------------------------------------------------------------------------------------
set cancel processing flag, delete g.checklists item, g.highlighted items and html for list
---------------------------------------------------------------------------------------------*/
function extractClose(list)
{
	if (!list) return;						//safety for unexpected
	g.extractedCancel = list.extractFolder;	//for extractProcess()
	
	var extractNode = getExtractNode(list);
	if (!extractNode) return;				//safety for unexpected
	
	var extractFolder = list.extractFolder;
	while (extractFolder)					//safety for unexpected
	{
		delete g.checklists[extractFolder];
		for (var i=0; i<g.highlighted.length; i++)
		{
			var li = g.highlighted[i];
			if ((!list || !li || !li.extractProp)
			|| (EZgetFileInfo(EZgetFileInfo(li.extractProp.toPath).pathname).filename == extractFolder))
				g.highlighted.splice(i,1);
		}
		break;
	}
	g.extractedLayer.removeChild(extractNode);	//delete this extract list
}
/*---------------------------------------------------------------------------------------------
highlight selected text if text in function list
---------------------------------------------------------------------------------------------*/
function toggleHighlight(evt)
{
	var sel = window.getSelection();
    if (!sel.rangeCount || !sel.getRangeAt) return;
    var range = sel.getRangeAt(0);
	var el = range.startContainer;
	
	var li = EZgetParent(el, 'li');
	if (!li || typeof(li) != 'object') return;	//safety for unexpected
	var isAll = !EZhasClass(li,'dragable');		//type: ALL or function list item
	
	// always delete current selection if currently selected
	var idx = g.highlighted.indexOf(li);
	if (idx != -1) g.highlighted.splice(idx,1);
	
	// add back if selected -- only keep most recent 2 selections
	if (EZtoggleClass(li, 'selected'))
	{
		g.highlighted.push(li);
		while (g.highlighted.length > 2)
			EZremoveClass(g.highlighted.shift(), 'selected');
		
		// remove last selection if not same type as current
		if (g.highlighted.length == 2
		&& isAll == EZhasClass(g.highlighted[0],'dragable'))
			EZremoveClass(g.highlighted.shift(), 'selected')
	}
	sel.removeAllRanges();	//remove all selections
}
/*---------------------------------------------------------------------------------------------
compare selected / highlighted functions
---------------------------------------------------------------------------------------------*/
function compareHighlight(el)
{
	var cmd = '';
	var args = '';
	var list, file1, file2;
	if (g.highlighted.length == 2)			//two (2) items highlighted -- compare
	{
		cmd = g.extractFolderBase.replace(/\//g, '\\') + '_compare.bat';
		file1 = getCompareFile(0); 
		file2 = getCompareFile(1); 
		args = file1 + ' ' + file2 + getDesc(file1, file2);
	}
	else if (g.highlighted.length == 1)	//only 1 item highlighted
	{
		args = getCompareFile(0);
		if (args.right(1) != '\\') 		//single function item
		{
			if (confirm('Only 1 function selected -- View?'))
			{
				cmd = getCompareFile(0).replace(/\?/g, ' ');
				args = '';
			}
		}
		else							//single ALL item -- compare to from js file
		{
			list = getExtractList(el);
			file1 = '';
			file2 = list.mergeScript.replace(/\//g, '\\').replace(/ /g, '?');
			var tags = list.getElementsByTagName('li');
			for (var i=1; i<tags.length; i++)
			{
				var li = tags[i];
				if (list.extractFolder != li.extractProp.extractFolder) continue;
				
				if (!file1)		//1st unchecked
					file1 = list.extractFromPath + li.extractProp.fromFile;
				
				var checkbox = li.getElementsByTagName('input')[0];
				if (!checkbox || !checkbox.checked) continue;
				
				file1 = list.extractFromPath + li.extractProp.fromFile;
				break;
			}
			var desc = getDesc(file1, file2);
			if (confirm('compare ' + desc.replace(/ /g, '\n    ').replace(/\?/g,' ')))
			{
				cmd = g.extractFolderBase.replace(/\//g, '\\') + '_compare.bat';
				args = file1.replace(/\//g, '\\').replace(/ /g, '?') + ' ' 
					 + file2 + desc;
			}
		}
	}
	if (!cmd)
		return displayMessage('*highlight 2 functions to compare or 1 to view');
	//========================================
	return dw.launchApp('"' + cmd + '"', args);
	//========================================
	/**
	 *	get fully qualified path filename of highlighted selections
	 */
	function getCompareFile(idx)
	{
		var path;
		var li = g.highlighted[idx];
		var item = li.extractProp;
		if (item)
			path = item.toPath;
		else
			path = getExtractList(li).extractPath;
		
		return path.replace(/\//g, '\\').replace(/ /g, '?');
	}
	/**
	 *	get fully qualified path filename of highlighted selections
	 */
	function getDesc(left, right)
	{
		var left = EZstripConfigPath(left.replace(/\?/g, ' ').replace(/\\/g, '/'));
		var right = EZstripConfigPath(right.replace(/\?/g, ' ').replace(/\\/g, '/'));
		
		return ' ' + left.replace(/\//g, '\\').replace(/ /g, '?')
		     + ' ' + right.replace(/\//g, '\\').replace(/ /g, '?')
	}
}
/*---------------------------------------------------------------------------------------------
g.checklists[extractFolder] = ul
manifestlist = {name:, fromFile:, toPath:, level:, linenoBeg:, linenoEnd:}
ul.extractPath = g.extractFolder;
ul.extractFolder = extractFolder;
ul.mergeBatch = g.extractFolder.clip(1) + '.js'
ul.sortButtons = extractFolder + 'Sort';
---------------------------------------------------------------------------------------------*/
function mergeChecked(el)
{
	var node = getExtractNode(el);
	var mergeInlineCode = node.getElementsByClassName('mergeInlineCode')[0].checked;
	var count = 0;
	
	var errors = 0;
	var list = getExtractList(el);
	var tags = list.getElementsByTagName('li');
	DWfile.write(list.mergeScript, '');
	for (var i=1; i<tags.length; i++)
	{
		var li = tags[i];
		EZaddClass(li,'errorNote', false);
		
		var checked = true;
		var lastCount = count;
		var extractProp = li.extractProp;
		while (extractProp)	
		{
			checked = false;
			if (extractProp.level > 0) break;
			if (!mergeInlineCode && extractProp.name.indexOf(INLINE_CODE_NAME) == 0) break;
			
			var checkbox = li.getElementsByTagName('input')[0];
			if (!checkbox || !checkbox.checked) break;
			
			checked = true;
			var code = DWfile.read(li.extractProp.toPath);
			if (code == null) break;
			
			var status = DWfile.write(list.mergeScript, code, 'append');
			if (!status) break;
			
			count++;
			break;
		}
		if (checked && lastCount == count)
		{
			errors++;
			EZaddClass(li,'errorNote');
		}
	}
	//if (!isChecked) return displayMessage('*no checked items to merge');
	
	var msg = errors > 0 ? errors + ' items could not be merged<br>' : '';
	displayMessage(msg + count + ' items merged into: ', list.mergeScript);
}
/*---------------------------------------------------------------------------------------------
Not yet used
---------------------------------------------------------------------------------------------*/
function mergeExtracted(list, items)
{
	// create _merge.bat
	var script = 'prompt $g\n'
			   + 'cd "' + list.extractPath + '"\n'
			   + 'copy ' + items.join('+') + ' "..\\' + list.extractFolder + '.js"\n'
	
	if (!DWfile.write(list.mergeBatch, script))
		return displayMessage('*Error writing: ', list.mergeBatch);
	
	// do merge
	var modifiedTime = DWfile.getModificationDate(list.mergeBatch);
	var status = dw.launchApp('"' + list.mergeBatch + '"');
	if (modifiedTime == DWfile.getModificationDate(list.mergeBatch))
		return displayMessage('*Error running: ' + list.mergeBatch + '\n' + status);
	return true;
}
/*---------------------------------------------------------------------------------------------
returns ul element in extractedNode containing specified el
---------------------------------------------------------------------------------------------*/
function getExtractList(el)
{
	var div = getExtractNode(el);
	return div.getElementsByTagName('ul')[0];
}
/*---------------------------------------------------------------------------------------------
returns div.extractedNode containing specified el
---------------------------------------------------------------------------------------------*/
function getExtractNode(el)
{
	el = el.target || el;
	return EZgetParent(el, 'div', 'extractedNode')
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
function displayMessage(msg, filepath)
{
	if (filepath)
	{
		//filepath = EZstripConfigPath(filepath);
		if (filepath.right(1) == '/') filepath = filepath.clip();
		msg += '.../' + EZgetFileInfo(filepath).filenameFull;
	}
	EZsetValue('note', msg.replace(/\n/g, '<br>'));
	
	if (displayMessage.timer)
		clearTimeout(displayMessage.timer);
	displayMessage.timer = '';
	
	if (msg.substr(0,1) != '*')
		displayMessage.timer = setTimeout("EZsetValue('note', g.note)", 30000);
	else
		dw.beep();
	return !!msg;
}
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
