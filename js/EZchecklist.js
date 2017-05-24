/*---------------------------------------------------------------------------
Derived from: http://www.c82.net/samples/checklist-basic.html
Feel free to use the example on this page in your own works. If you choose
to do so, drop me a line. I'd like to hear how you used it:
http://www.c82.net/contact.php
----------------------------------------------------------------------------*/
EZ.checklist = function EZchecklist(checklists)
{
	this.checklists = checklists;	//save checklists by this instance

	this.properties = {
		counts: [],
		globalCounts: {
			flaggedTotal: 0,
			flaggedSelectedTotal: 0,
			otherTotal: 0,
			otherSelectedTotal: 0,
			selectedTotal: 0,		//currently selected total
			total: 0				//total number of items
		},
		currentValue: {},
		originalValue: {},
		callback: null
	}

	/**
	*	Ideally should be called by constructor but class objects undefined (e.g. properties)
	**/
	this.init = init;
	function init()
	{
		EZ.checklist = this;
		for (var p in this.properties.globalCounts)
			this.properties[p] = 0;

		for (var listIndex=0; listIndex<checklists.length; listIndex++)
		{
			this.properties.counts[listIndex] = {};
			for (var p in this.properties.globalCounts)
				this.properties.counts[listIndex][p] = 0;

			var list = this.checklists[listIndex];
			this.action(list,'setup');
		}
		/* not firing on IE7
		EZeventadd(document.XMLForm,'submit',save);
		*/
	}

	/**
	*	(internal function) returns list portion of list item element id
	**/
	this.getProperties = getProperties;
	function getProperties()
	{
		return this.properties;
	}

	/**
	*	(internal function) returns the item id with trailing asterick removed
	**/
	function getItemId(key)
	{
		var pos = key.indexOf('#');
		if (pos != -1) key = key.substring(pos+1);
		if (EZright(key,1) == '*')
			key = key.substring(0,key.length-1);
		return key;
	}

	/**
	*	(internal function) returns list portion of list item element id
	**/
	function getListId(key)
	{
		var pos = key.indexOf('#');
		if (pos != -1) key = key.substring(0,pos);
		return key;
	}

	/**
	*	Determine array index into this.checklists for named list
	**/
	this.getListIndex = getListIndex;
	function getListIndex(list)
	{
		if (typeof(list) == 'string')
			list = document.getElementById(list);

		// find listIndex into checklists array
		var listIndex = -1;
		if (list && this.checklists.length > 0)
		{
			for (listIndex=0; listIndex<this.checklists.length; listIndex++)
				if (list == this.checklists[listIndex]) break;
			if (listIndex >= this.checklists.length) listIndex = -1;
		}
		return listIndex;
	}

	/**
	*	Called to set checked property of checkbox element.
	*	Sets the value and updates counts.
	**/
	this.setChecked = setChecked;
	function setChecked(listIndex,el,value)
	{
		el.checked = value;
		this.updateCounts(listIndex,el)
		this.countUpdated = true;
	}

	this.updateCounts = updateCounts;
	function updateCounts(listIndex,el)
	{
		if (!el || !el.id || !el.value) return;
		if (listIndex < 0 || listIndex > this.checklists.length) return;

		// update counts
		var plusMinus = el.checked ? 1 : 0;		//used during setup
		if (typeof this.properties.currentValue[el.id] == 'undefined')
		{}	//do nothing
		else if (el.checked && !this.properties.currentValue[el.id])
			plusMinus = 1;
		else if (!el.checked && this.properties.currentValue[el.id])
			plusMinus = -1;
		else
			plusMinus = 0;
		this.properties.currentValue[el.id] = el.checked;

		this.properties.selectedTotal += plusMinus;
		this.properties.counts[listIndex].selectedTotal += plusMinus;
		if (EZright(el.value,1) == '*')
		{
			this.properties.flaggedSelectedTotal += plusMinus;
			this.properties.counts[listIndex].flaggedSelectedTotal += plusMinus;
		}
		else
		{
			this.properties.otherSelectedTotal += plusMinus;
			this.properties.counts[listIndex].otherSelectedTotal += plusMinus;
		}

		//----- original value not stored, do it here and bump totals
		if (typeof this.properties.originalValue[el.id] == 'undefined')
		{
			this.properties.originalValue[el.id] = el.checked;

			this.properties.total++;
			this.properties.counts[listIndex].total++;
			if (EZright(el.value,1) == '*')
			{
				this.properties.flaggedTotal++;
				this.properties.counts[listIndex].flaggedTotal++;
			}
			else
			{
				this.properties.otherTotal++;
				this.properties.counts[listIndex].otherTotal++;
			}
		}
	}
	/**
	*	Gets call by window event handler when checkbox clicked
	*	The event handler is initially called from window not this class
	*	As quick workaround, we stored this class in EZ.checklist but this
	*	will have issues if there are multiple EZclasslist objects on a page.
	**/
	this.change = change;
	function change(el)
	{
		if (window.EZ.checklist != this)
		{
			EZ.checklist.change(el)
			return;
		}
		// IE returns event object with srcElement; FF returns as currentElement
		el = el.currentTarget ? el.currentTarget : el = el.srcElement;

		var listid = getListId(el.id);
		var listIndex = this.getListIndex(listid);

		this.updateCounts(listIndex, el)
		if (this.properties.callback)
			this.properties.callback(this.properties);
	}

	/**
	*	callback is user function called whenever the check value changes
	*	return properties
	**/
	this.setStatusCallback = setStatusCallback;
	function setStatusCallback(callback)
	{
		this.properties.callback = callback;
		this.properties.callback(this.properties,'init');	//report initial status
	}

	/**
	*	Called on form submit
	**/
	this.save = save;
	function save()
	{
		for (i=0; i<checklists.length; i++)
		{
			list = checklists[i];
			this.action(list,'save');
		}
		return true;
	}

	/**
	*	Workhourse preforms setup/save for EACH list in this EZchecklist instance
	*	and determines if any flags are set in ANY of the lists if enabled.
	**/
	this.action = action;
	function action(list,action)
	{
		var i,el,value,values='';

		if (typeof(list) == 'string')
			list = document.getElementById(list);

		if (!list || !list.id) return;	//associated hidden text element must have id

		var listIndex = this.getListIndex(list)
		if (listIndex < 0) return;

		var listid = list.name + '_list';	//list uses hidden input id plus _list
		var listobj = document.getElementById(listid);
		if (!listobj) return;

		if (action == 'setup')
			values = list.value ? list.value : '';

		// for all checkboxes within list
		this.countUpdated = false;
		var checkboxes = listobj.getElementsByTagName('input');
		for (i=0; i<checkboxes.length; i++)
		{
			el = checkboxes[i];
			if (action == 'setup')
			{
				value = EZcheckoptions(values.replace(/\|/g,','),getItemId(el.id));
				this.setChecked(listIndex,el,value)

				// set event for value change
				EZeventadd(el,'click',this.change);
			}
			else if (action == 'save')
			{
				if (el.checked)
				{
					value = el.value;
					if (EZright(value,1) == '*')
						value = value.substring(0,value.length-1);
					values += '|' + value;
				}
			}
			else if (action == 'msg')
			{
				if (el.checked) values += '|' + el.value;
			}
			else if (action == 'setAll')
			{
				this.setChecked(listIndex,el,true);
			}
			else if (action == 'clearAll')
			{
				this.setChecked(listIndex,el,false);
			}
			else if (action == 'reset')
			{
				this.setChecked(listIndex,el,this.properties.originalValue[el.id]);
			}
			else if (action == 'selectFlagged')
			{
				if (EZright(el.value,1) == '*')
					this.setChecked(listIndex,el,true);
			}
		}
		// for save request, store values back in hidden input field for Revize
		if (action == 'save')
			list.value = values.substr(1);

		else if (this.countUpdated && this.properties.callback)
			this.properties.callback(this.properties);
	}

	this.setAll = setAll;
	function setAll(list)
	{
		this.action(list,'setAll');
	}

	this.clearAll = clearAll;
	function clearAll(list)
	{
		this.action(list,'clearAll');
	}

	this.reset = reset;
	function reset(list)
	{
		this.action(list,'reset');
	}

	this.selectFlagged = selectFlagged;
	function selectFlagged(list)
	{
		if (list)
			this.action(list,'selectFlagged');
		else
		{
			for (i=0; i<checklists.length; i++)
			{
				list = checklists[i];
				this.action(list,'selectFlagged');
			}
		}
	}

	//Add :hover functionality on labels for IE (part of contructor)
	//only needs to run once for page not for each EZchecklist instance
	if (!this.hoverInit)
	{
		this.hoverInit = true;
return;		
		EZeventadd(window, "load", function()
		{
			if (document.all && document.getElementById) {
				// Get all unordered lists
				var lists = document.getElementsByTagName("ul");

				for (var i = 0; i < lists.length; i++) {
					var theList = lists[i];

					// Only work with those having the class "EZchecklist"
					if (theList.className.indexOf("EZchecklist") > -1) {
						var labels = theList.getElementsByTagName("label");

						// Assign event handlers to labels within
						for (var j = 0; j < labels.length; j++) {
							var theLabel = labels[j];
							theLabel.onmouseover = function() { this.className += " hover"; };
							theLabel.onmouseout = function() { this.className = this.className.replace(" hover", ""); };
						}
					}
				}
			}
		})
	}  //end !this.hoverInit

}
