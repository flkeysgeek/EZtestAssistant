/*-----------------------------------------------------------------------------------
node = new EZ.dom.utils(node)

-----------------------------------------------------------------------------------*/
EZ.dom.utils = function(node)
{
	this.el = node;
	this.node = node;
	/*-----------------------------------------------------------------------------------
	test
	-----------------------------------------------------------------------------------*/
	function test(arg)
	{
		debugger;
	}
	this.test =	function(arg) { return test.call(this.node, arg); };
	/*-----------------------------------------------------------------------------------
	wrap this node with tag supplied as string or element
	-----------------------------------------------------------------------------------*/
	function wrap(tag)
	{
		var wrapper = EZ.createTag(tag);
		this.parentNode.insertBefore(wrapper,this);
		this.parentNode.removeChild(this);
		wrapper.appendChild(this);	

		//wrapper.appendChild(EZ.createTag(this));	//append clone of this node to wrapper		
		//wrapper.appendChild(this);	
		//this.parentNode.replaceChild(wrapper,this);
		return wrapper;
	}
	this.wrap =	function(tag) { return wrap.call(this.node, tag); };
	/*-----------------------------------------------------------------------------------
	-----------------------------------------------------------------------------------*/
	function hasClass(classNames)
	{
		classNames = EZ.toArray(classNames, ', ');	//EZ.toArrayMerge
		var regex = new RegExp( '( ' + classNames.join(' | ') + ' )' );
		return regex.test(' ' + this.className + ' ');
	}
	this.hasClass =	function(className) { return hasClass.call(this.node, className); };
	/*-----------------------------------------------------------------------------------
	add className(s)
	-----------------------------------------------------------------------------------*/
	function addClass(classNames)
	{
		classNames = EZ.toArray(classNames, ', ');	//EZ.toArrayMerge
		this.EZ.removeClass(classNames);	
		
		classNames = ' ' + classNames.join(' ');
		if (!this.className) classNames = classNames.substr(1);
		this.className += classNames;
	}
	this.addClass =	function(className) { return addClass.call(this.node, className); };
	/*-----------------------------------------------------------------------------------
	remove className(s)
	-----------------------------------------------------------------------------------*/
	function removeClass(classNames)
	{
		classNames = EZ.toArray(classNames, ', ');	//EZ.toArrayMerge
		var regex = ' ' + classNames.join(' | ') + ' ';
		this.className = EZ.trim((' ' + this.className + ' ').replace(regex,''));
	}
	this.removeClass =	function(className) { return removeClass.call(this.node, className); };
	/*-----------------------------------------------------------------------------------
	Insert node as first child
	-----------------------------------------------------------------------------------*/
	function addFirstChild(node)
	{
		if (typeof(node) == 'string')
			node = EZ.createElement(node, this.ownerDocument);
		return this.insertBefore(node, this.firstChild);
	}
	this.addFirstChild = function(node) { return addFirstChild.call(this.node, node); };
	this.insertChild = function(node) { return addFirstChild.call(this.node, node); };
	/*-----------------------------------------------------------------------------------
	Append node as last childNode
	-----------------------------------------------------------------------------------*/
	function addLastChild(node, root)
	{
		if (typeof(node) == 'string')
			node = EZ.createElement(node, this.ownerDocument);
		return this.appendChild(node);
	}
	this.addLastChild = function(node) { return addLastChild.call(this.node, node); };
	this.appendChild = function(node) { return addLastChild.call(this.node, node); };
	/*-----------------------------------------------------------------------------------
	crawl up dom tree for property value e.g. clientWidth not defined on all child nodes.
	-----------------------------------------------------------------------------------*/
	function computedProperty(property)
	{
		var node = this;
		while (node && property)
		{
			var value = node[property];
			if (value) return value;
			node = node.parentNode;
		}
		return '';
	}
	this.computedProperty = function(styleName) { return computedProperty.call(this.node, styleName); };
	/*-----------------------------------------------------------------------------------
	get current element style
	-----------------------------------------------------------------------------------*/
	function computedStyle(styleName)
	{
		if (document.all)
			return this.currentStyle[styleName];
		else
		{	//use default viewport
			var cssStyleName = styleName.replace(/([A-Z])/g,'-$1').toLowerCase();
			var renderedStyle = document.defaultView.getComputedStyle(this,'');
			return renderedStyle.getPropertyValue(cssStyleName)
		}
	}
	this.computedStyle = function(styleName) { return computedStyle.call(this.node, styleName); };
	/*-----------------------------------------------------------------------------------
	-----------------------------------------------------------------------------------*/
	this.addEvent = function(eventName, callback) 
	{ return EZ.event.add(this.node, eventName, callback); };
	
	this.removeEvent = function(eventName, callback)
	{ return EZ.event.remove(this.node, eventName, callback); };
	/*-----------------------------------------------------------------------------------
	crawl up dom tree for parent with specified tagName(s)
	-----------------------------------------------------------------------------------*/
	function parent(tagNames)
	{
		var tags = EZ.toArray(tagNames);	//TODO: EASY beta was using syncArray() ??
		var tags = tagNames.toLowerCase().split(',');
		var node = this;
		while (node)
		{
			node = node.parentNode;
			if (!node) break;
			if (!tagNames
			|| (node.tagName && EZ.indexOf(tags,node.tagName.toLowerCase()) != -1))
			{
				if (EZ.dom.utils && !node.EZ)
					node.EZ = new EZ.dom.utils(node);
				return node;
			}
		}
		return EZ.none();
	}
	this.parent = function(tagNames) { return parent.call(this.node, tagNames); };
	/*-----------------------------------------------------------------------------------
	-----------------------------------------------------------------------------------*/
	function isShow()
	{
		if (this.EZ.computedStyle('display') == 'none' 
		|| this.EZ.computedStyle('visibility') == 'hidden')
			return false;
		else
			return true;
	}
	this.isShow = function() { return isShow.call(this.node); };
	/*-----------------------------------------------------------------------------------
	-----------------------------------------------------------------------------------*/
	function show(show)
	{
		if (!this.EZ.originalStyle)
		{
			this.EZ.originalStyle = {};
			this.EZ.originalStyle.display = this.style.display;
			this.EZ.originalStyle.visibility = this.style.visibility;
			this.EZ.originalStyle.zIndex = this.style.zIndex;
		}
		show = EZ.isNone(show) ? !this.EZ.isShow()	//toggle if show not specified
			 : show = EZ.isTrue(show);				//otherwise use specified
		
		if (show)									//-----show layer-----\\
		{
			if (this.EZ.isShow()) return;			//done if already showing

			if (this.style.display == 'none')		//try clearing display:none from tag
				this.style.display = '';
			if (this.style.visibility == 'hidden')	//try clearing visibility:hidden
				this.style.display = '';
			if (this.EZ.isShow()) return;			//done if NOW showing
							
			if (this.EZ.computedStyle('display') == 'none' )
			{
				var displayBlock = 'inline';		//display=inline
				if ('div pre'.indexOf(this.tagName.toLowerCase()) != -1)
					displayBlock = 'block';			//display=block if div or pre
				this.style.display = displayBlock;
			}
			
			if (this.EZ.computedStyle('visibility') == 'hidden' )
			{
				this.style.visibility = 'visible';
				this.style.zIndex = 100;
			}
		}
		else 										//-----hide layer-----\\
		{	
			if (!this.EZ.isShow()) return;			//done if already not showing
		
			// restore original on tag css display
			if (this.EZ.originalStyle.display == 'none')
				this.style.display == 'none';
			if (this.EZ.originalStyle.visibility == 'hidden')
				this.style.visibility == 'hidden';
			if (this.style.zIndex != this.EZ.originalStyle.zIndex)
				this.style.zIndex = this.EZ.originalStyle.zIndex;
			if (!this.EZ.isShow()) return;			//done if NOW not showing
			
			if (this.style.visibility == 'visible')	//use visibility to hide if defined
				this.style.visibility = 'hidden'
			else
			{
				if (this.style.display != 'none')	//not sure if possible but why not try
					this.style.display = '';			
					if (!this.EZ.isShow()) return;
				
				if (this.style.display == '')
					this.style.display = 'none';
			}
		}
	}
	this.show =	function(trueFalse) { return show.call(this.node, trueFalse); };
}
/*---------------------------------------------------------------------------------------
EZ.cloneObject(o)

Clones object including embedded arrays and objects (i.e. embedded arrays and objects are 
copies not references to elements in the source object). Embedded functions are cloned if
not global.

REFERENCE:
	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create	
	Object.create(proto[, propertiesObject])
---------------------------------------------------------------------------------------*/
EZ.cloneObject = function(o)
{
	if (typeof(o) !='object') o = EZ.objectFromAny(o);
	
	var p, newObj;
	if (EZ.isArray(o))
		newObj = new Array();
	else
	{
		newObj = Object.create(o);
		for (p in o)
			if (o.hasOwnProperty(p) && typeof(p) != 'number')
				processElement();
	}
	if (EZ.isArrayLike(o))
	{
		for (p=0; p<o.length; p++)
			processElement();
	}
	//======================
	return newObj;
	//======================
	/**
	 *
	 */
	function processElement()
	{
		if (typeof o[p] == 'function')
		{
			var func = EZ.objectFromFunction(o[p]);
			var name = func.name != 'anonymous' ? func.name : ''
			if (name 				//e.g. newObj[p] == window['EZ']['debug']['setup']
			&& o[p] == eval("window['" + (name.split('.').join("']['")) + "']"))
				newObj[p] = o[p];
			else
			{	//clone if not global function -- TODO: or not embedded within global function
				var code = '\n//clone of: ' + func.name + '\n\t' + func.body + '\n';
				
				//TODO: cannot create named function and may not run in local scope therefore
				//		local var declared with same name as global var may reference global
				newObj[p] = new Function(func.arguments,code)
				
				/*does not handle comments in code
				var code = '\n{\t//clone of: ' + func.name + '\n\t' + func.body + '\n}';
				code =  code.replace(/"/g,'\\"').replace(/\n/g,'"\n"');
				//TODO: eval.call(o,...) ??
				eval("newObj[p] = function " + name  + code);
				*/
			}
		}		
		else if (typeof o[p] != 'object')
			newObj[p] = o[p];
		
		else if (o[p] == o)
			newObj[p] = newObj;
		
		else
			newObj[p] = EZ.cloneObject(o[p]);
		
		/*
		else if (!EZ.isArray(o[p]))
		
		else
		{
			newObj[p] = o[p].slice(0);
			for (var i=0;i<newObj[p].length;i++)
				if (newObj[p][i] == o)
					newObj[p] = newObj;
		}
		*/
	 }
}
EZ.cloneObject.displayName = 'EZ.cloneObject';
/*-----------------------------------------------------------------------------------
EZ.createElement(tag,root)

Create html element from specified string or clone if element supplied. 
Created in root if supplied otherwise document.
-----------------------------------------------------------------------------------*/
EZ.createElement = function(tag,root)
{
	if (root != document) 
		root = EZ.root(root);
	var i, regex, results;
	
	var node = EZ.none();
	var tagName, innerHTML = '';
	var selectedIndex = -1;
	var attr = {};
	
	//------ tag specified as string
	if (typeof(tag) == 'string')
	{
		tag = EZ.trim( tag.replace(/\n/,' ') );
		
		// check for innerHTML between open an close tag e.g. <p>some text</p>
		results = tag.match(/^\s*(<(\w+)[\s]([^>]*>))([\s\S]*)(<\/\2>)/);
		if (results)
		{
			tag = results[1];
			innerHTML = results[4];
			
			var selectOptions = innerHTML.match(/<option[^>]*?>/g);
			if (selectOptions)	//if innerHTML contains <options...>, look for selected
				for (i=selectOptions.length-1; i>=0; i--)		//keep lowest index
					if (/selected/i.test(selectOptions[i])) selectedIndex = i;
		}
		// check for attributes
		regex = /([-\w]+)(=("([^<>"]*)"|'([^<>']*)'|\w+))?/g;
		results = tag.match(regex);
		if (!results) return node;
		
		regex = regex.toString();			//drop global flag
		regex = new RegExp(regex.substring(1,regex.length-2));
		
		// tagName is 1st result
		tagName = results[0];
		for (i=1; i<results.length; i++)	//for all attributes
		{
			var attrValue = results[i].match(regex);
			if (!attrValue) continue;		//safety for unexpected
			
			//         [name]  value:  "[...]"         '[...]'  blank
			attr[attrValue[1]] = attrValue[5] || attrValue[4] || '';
		}
	}
	//------ tag supplied is not object or not html node object
	else if (typeof(tag) != 'object' || node.childNodes == undefined) 
	{
		return node;	//return pseudo element
	}
	//------ tag is html element -- clone it
	else
	{
		tagName = tag.tagName;
		attr = tag.attributes;
		innerHTML = tag.innerHTML;
		selectedIndex = tag.selectedIndex;
	}
	
	//------------------------
	//----- create new element
	//------------------------
	node = root.createElement(tagName);
	node.innerHTML = innerHTML;		//set select options if any
	if (typeof(tag) == 'object')
	{
		//node.innerHTML handles -- if needed here must also code for non-object
		//if (tag.options) node.options = tag.options;
		for (i=0;i<attr.length;i++)
		{
			var name = attr[i].name;
			if (name)
				node.setAttribute(name, tag.getAttribute(name));
		}
	}
	else
	{
		for (i in attr)	
			node.setAttribute(i,attr[i]);
	}
	if (node.options)				//if select options, set selectedIndex
		node.selectedIndex = selectedIndex;
	
	node.EZ = new EZ.dom.utils(node);
	return node;
}
EZ.createElement.displayName = 'EZ.createElement';

EZ.createTag = EZ.createElement;
EZ.createElement.displayName = 'EZ.createElement';
/*--------------------------------------------------------------------------------------------------
EZ.createLayer(id,tag)

Create layer if it does not already exist.

ARGUMENTS:

	id			(string) specifies id of existing layer -OR- specifies either tag or id prefix
				used to create and append new layer to body with unique html element id.
				tag if it starts with '<'	tag		script to eval
	
RETURNS:
	layer html element 
--------------------------------------------------------------------------------------------------*/
EZ.createLayer = function(id, tag)
{
	if (id.substr(0,1) != '<')
	{
		tag = id;
		id = '';
	}
	var layer = EZ('#'+id)[0];
	if (layer.undefined)
	{
		id = EZ.getUniqueId(id);
		tag = tag || '<pre class="EZdebug" id="' + id + '">'
		layer = EZ.createElement(tag);
		EZ('body')[0].EZ.addLastChild(layer);
	}
	return layer;
}
EZ.createLayer.displayName = 'EZ.createLayer';
/*---------------------------------------------------------------------------------------------
EZ.createObject(name)

whats up...

Although logic is virtually just one line of code, using function call usually yields much more 
readable code besides handling a few more end cases and avoids javascript errors if variables
are not of the form expected by native function (they are converted if possible).

ARGUMENTS:		
	arg			(*) blah blah

RETURNS:
	object containing _name property set to specified name
---------------------------------------------------------------------------------------------*/
EZ.createObject = function(name,o)
{
	var displayName = '';
	switch (typeof name)
	{
		case 'string':
		{
			if (o == undefined)
				o = [].shift.call(this,arguments);
			break;
		}
		case 'nan': 
		case 'null': 
		case 'unknown': 
		case 'undefined': 
		case 'boolean': 
		case 'number':
		{
			name = '';
			break
		}
		case 'function':
			displayName = EZ.getFunctionName(name)
		
		case 'object': 	
			name = displayName || name._name || '';
	}
	o = o || {}
	if (name)
		EZ.objectNames[o] = name;
	return o;
}
/*--------------------------------------------------------------------------------------------------
EZ.updateDebugLayer(id, varArray)

Update layer with variables listed in varArray -- append new layer to body if not found

ARGUMENTS:		all arguments are optional -- varArray is 1st arrar-like 

	id			passed to EZ.createLayer to create or get existing layer
	
	varArray	array containing list of comma delimited variable names to display in layer
				newline created for each array element -- Example:
					
					var varArray = [
						'dropdownSelectedIndex,dropdownSelectedValue',
						'selectedIndex','selectedValue',
						'RZ.editmodule',
						
						'RZ.lastedit_action,RZ.lastedit_pagetype',
						'RZ.lastedit_module,RZ.lastedit_recordid',
						'RZ.lastedit_url',
						''
					]	
RETURNS:
	specified or generated id
--------------------------------------------------------------------------------------------------*/
EZ.updateDebugLayer = function(id, varArray)
{
	if (EZ.quit || !EZ.get('EZ.debug.options.layers')) return '';
	
	if (EZ.isArrayLike(id))
	{
		varArray = id;
		id = '';
	}
	var tag = '<pre class="EZdebug" id="' + id + '">';
	var layer = EZ.createLayer(id, tag);
	/*
		debugLayer.innerHTML = EZ.concat(
		[
			EZ.debug.val('dropdownSelectedIndex','dropdownSelectedValue'),
			EZ.debug.val('selectedIndex','selectedValue'),
		'']);					
	*/
	if (EZ.isArrayLike(varArray))
	{
		var rows = [];
		for (var i=0;i<varArray;i++) 
			rows.push( EZ.debug.val(varArray[i]) );
		layer.innerHTML = EZ.concat(rows);					
	}
	return id;
}
EZ.updateDebugLayer.displayName = 'EZ.updateDebugLayer';
/*---------------------------------------------------------------------------------------------
EZ.showlayer(layerName,trueFalse,doc)

Wrapper for RZshowLayer() to support multiple layers specified as array.

ARGUMENTS:		
	??			(*) blah blah

RETURNS:
	nothing

TODO:
	use EZ.show(...) when stable
---------------------------------------------------------------------------------------------*/
EZ.showLayer = function(layerArray,trueFalseArray,docArray)
{
	var args = EZ.syncArrays(layerArray,trueFalseArray,docArray);	
	var layers = args[0];
	var trueFalses = args[1];
	var docs = args[2];
	
	for (var i=0; i<layers.length;i++)
	{
		var tags = EZ$(layers[i]);
		if (tags[0].undefined) continue;
		var trueFalse = trueFalses[i];
		var doc = docs[i];
		
		for (var j=0; j<tags.length; j++)
			RZshowlayer(tags[j], trueFalse, doc)
	}
}
EZ.showLayer.displayName = 'EZ.showLayer'
EZ.showlayer = EZ.showLayer;
/*---------------------------------------------------------------------------------------------
EZ.show(layerName,trueFalse,doc)

Wrapper for RZshowLayer() to support multiple layers specified as array.

ARGUMENTS:		
	??			(*) blah blah

RETURNS:
	nothing
---------------------------------------------------------------------------------------------*/
EZ.show = function(layerArray,trueFalseArray,docArray)
{
	var args = EZ.syncArrays(layerArray,trueFalseArray,docArray);	
	var layers = args[0];
	var trueFalses = args[1];
	var docs = args[2];
	
	for (var i=0; i<layers.length;i++)
	{
		var tags = EZ$(layers[i]);
		if (tags[0].undefined) continue;
		var trueFalse = trueFalses[i];
		var doc = docs[i];
		
		for (var j=0; j<tags.length; j++)
			tags[j].EZ.show(trueFalse);
	}
}
EZ.show.displayName = 'EZ.show'
/*---------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------*/
EZ.scripts.dom = new Date();