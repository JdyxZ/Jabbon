
/********************************** FRAMEWORK **********************************/

/***************** HTML ElEMENTS *****************/

if(typeof(Document) != "undefined")
{
	Document.prototype.get = function(selector)	{

		// Get query
		const query = this.querySelector(selector);

		if(query == null)
		{
			console.error(`WARNING: Selector '${selector}' has not been found in the DOM. Returning an empty div`);
			return this.createElement("div");
		}
		else
		{
			return query;
		}
	};

	Document.prototype.getAll = function(selector)
	{
		// Get query
		const query = this.querySelectorAll(selector);

		if(query == null)
		{
			console.error(`WARNING: Selector '${selector}' has not been found in the DOM. Returning an empty div`);
			return this.createElement("div");
		}
		else
		{
			return query;
		}
	};

	Document.prototype.when = function(event, callback)	{
		document.addEventListener(event, callback);
	};

	HTMLElement.prototype.getParents = function()
	{
		let parents = new Array();
		let current_element = this;
		
		while (current_element.parentNode != null)
		{
			let parent = current_element.parentNode;
			parents.push(parent);
			current_element = parent;
		}

		return parents;    
	};

	HTMLElement.prototype.get = function(selector)	{

		// Get query
		const query = this.querySelector(selector);

		if (this == null)
		{
			console.error("WARNING: The HTML Element you are trying to use is null");
			return null;
		}
		else if (query == null)
		{
			console.error(`WARNING: Selector '${selector}' has not been found in the following HTML Element:
			\t - tag: ${this.tagName} 
			\t - id: ${this.id ? this.id : 'none'} 
			\t - class: ${this.className ? this.className : 'none'}
			Returning an empty div`);

			console.log(this);

			return this.appendChild(document.createElement("div"));
		}
		else
		{
			return query;
		}
	};

	HTMLElement.prototype.getAll = function(selector)	{

		// Get query
		const query = this.querySelectorAll(selector);

		if (this == null)
		{
			console.error("WARNING: The HTML Element you are trying to use is null");
			return null;
		}
		else if (query == null)
		{
			console.error(`WARNING: Selector '${selector}' has not been found in the DOM. Returning an empty div`);
			return this.appendChild(document.createElement("div"));
		}
		else
		{
			return query;
		}

	};

	HTMLElement.prototype.when = function(event, callback)	{
		this.addEventListener(event, callback);
	};

	HTMLElement.prototype.show = function()
	{
		this.style.display = "";
	};

	HTMLElement.prototype.hide = function()
	{
		this.style.display = "none";
	};

};

/***************** NUMBER *****************/

Number.prototype.clamp = function(min, max) 
{
	return Math.min(Math.max(this.valueOf(), min), max);
};

Number.prototype.lerp = function(target, step) 
{
	const origin = this.valueOf();
	return origin * (1 - step) + target * step;
};

/***************** STRING *****************/

String.prototype.reverseString = function() 
{
	// Declare some vars
	var length = this.length;
	reversed_string = [];
	index = 0;

	for (var i = length - 1; i >= 0; i--) {
		reversed_string[index++] = this.charAt(i);
	}
	return reversed_string.join("");
 };

/***************** DATE *****************/

Date.prototype.getTime = function() 
{
	return `${this.getHours().toString().padStart(2,"0")}:${this.getMinutes().toString().padStart(2, "0")}`
};

Date.prototype.getDate = function() 
{
	return `${this.getDay().toString().padStart(2,"0")}/${this.getMonth().toString().padStart(2, "0")}/${this.getFullYear()}`;
};

/***************** ARRAY *****************/

Array.prototype.remove = function(element)
{
	return this.filter( (value) =>
	{
		return value != element;
	});
};

 Array.prototype.containsObject = function(property, value)
 {
	return this.reduce((acc, {property, _}) => acc | property == value, false) 
 };

 Array.prototype.getObject = function(property, value)
 {
	return this.filter(({property, _}) => property == value);
 };

 Array.prototype.getObjectIndex = function(property, value)
 {
	return this.reduce((acc, element , index) => {
		if (element[property] == value) acc = index;
		return acc;
	}, -1);
 };

 Array.prototype.clone = function()
 {
	return this.concat();
 };

 Array.prototype.toObject = function(prefix)
 {
	return this.reduce((obj, element, index) => {
		obj[`${prefix}${index}`] = element;
		return obj;
	}, {})
 };

 /***************** FUNCTIONS *****************/

 function getTime()
{
	const date = new Date();
	return date.getTime();
}

function getDate()
{
	const date = new Date();
	return date.getDate();
}

 function getKeyFromValue(array, value)
 {
	 const result = Object.entries(array).filter(([current_key, current_value]) => current_value == value);
 
	 switch(result.length)
	 {
		 case 0:
			 return result;
		 case 1:
			 return result[0][1];
		 default:
			 throw Error("The array you are trying to filter hasn't unique values");
			 return result;
	 }
	 
 };