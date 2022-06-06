var bioBlock;
var searchBar;
var search;
var categoryBlocks = {};


var availableRoles;
var availableTags;
var staffData;

var activeTags = [];

var inactiveTagColour = "rgba(0,0,0,0)"

// add more categories here if desired
var categories = {
	"exec": "Executive Team",
	"admin": "Directors and Admin",
	"mentor": "Mentors"
}



function init() {
	bioBlock = document.getElementById("bio");
	searchBar = document.getElementById("searchbar");
	
	fetch('assets/data/available-roles.csv')
		.then(response => response.text())
		.then(data => availableRoles = data)
		.then(() => {
			fetch('assets/data/available-tags.csv')
				.then(response => response.text())
				.then(data => availableTags = data)
				.then(() => {
					fetch('assets/data/staff-data.csv')
						.then(response => response.text())
						.then(data => staffData = data)
						.then(() => init_bioblock(availableTags, availableRoles, staffData))
				})
		})
}

init(); // we need this to init before main.js at least (for dynamic img adjustments)


function removeAll(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}

function apply_filter() {
	var tokens = search.value == "" ? null : search.value.split(" ");	
	
	if (! tokens && activeTags.length == 0) {
		for (var category in categoryBlocks) {
			var sectionHead = document.getElementById(category + "-head");
			sectionHead.style.display = "block";
		}
	} else {
		for (var category in categoryBlocks) {
			var sectionHead = document.getElementById(category + "-head");
			sectionHead.style.display = "none";
		}
	}

	
	for (var k = 0; k < staffData.length; k++) {
		var tags = staffData[k]["tags"].split("/");
		staffData[k]["section"].style.display = "none";
		
		if (tokens) {
			var flag = true;
			for (var t = 0; t < tokens.length; t++) {
				if (!staffData[k]["first-name"].toLowerCase().includes(tokens[t].toLowerCase()) && !staffData[k]["last-name"].toLowerCase().includes(tokens[t].toLowerCase())) {
					flag = false;
					break;
				}
			}
			if (!flag)
				continue;
		}
		
		if (activeTags.length > 0) {
			var flag = true;
			for (var t = 0; t < activeTags.length; t++) {
				if (!tags.includes(activeTags[t])) {
					flag = false;
					break;
					continue;
				}
			}
			if (!flag)
				continue;
		}
		
		staffData[k]["section"].style.display = "flex";
	}
}


function SectionSearch() {
	var section = document.createElement("section");

	var contents = document.createElement("div");
	contents.classList.add("content");
	
	var inner = document.createElement("div");
	inner.classList.add("inner");
	
	var h1 = document.createElement("h2");
	h1.innerHTML = "Search for a Mentor!"
	inner.appendChild(h1);
	
	var h3 = document.createElement("h2");
	inner.appendChild(h3);
	
	var searchDiv = document.createElement("div");
	search = document.createElement("input");
	search.classList.add("searchbar");
	search.placeholder = "> Search by Name";
	search.spellcheck = false;
	search.onkeydown=function() {
		if (event.keyCode==13) { 
			search.blur();
			return false;
		}
	}
	search.onchange = function() {
		apply_filter();
	}
	searchDiv.appendChild(search);
	h3.appendChild(searchDiv);
	
	var h4 = document.createElement("h3");
	h4.innerHTML = "Filter by tag(s):"
	inner.appendChild(h4);
	
	var h5 = document.createElement("h2");
	inner.appendChild(h5);
	
	var tagBox = document.createElement("div");
	for (var i = 0; i < availableTags.length; i++) {
		var tag = document.createElement("div");
		tag.style.backgroundColor = inactiveTagColour
		tag.classList.add("tag");
		tag.innerHTML = "# " + availableTags[i]["available-tags"];
		tag.id = availableTags[i]["available-tags"]
		
		tag.onclick = function(e) {
			var tagname = e.target.id;
			if (activeTags.includes(tagname)) {
				e.target.classList.remove("active");
				e.target.style.backgroundColor = inactiveTagColour;
				activeTags = removeAll(activeTags, tagname);
			} else {
				e.target.classList.add("active");
				e.target.style.backgroundColor = first_where(availableTags, "available-tags", tagname)["colour"]
				activeTags.push(tagname);
			}
			
			apply_filter();
		}
		
		tagBox.appendChild(tag);
	}
	h5.appendChild(tagBox);
	
	
	
	contents.appendChild(inner);
	section.appendChild(contents);
	
	return section;
}







function Section(header_1=null, roles=[], imgs=[],content=[],tags=[]) {
	var section = document.createElement("section");
	
	for (var i = 0; i < imgs.length; i++) {
		var a = document.createElement("a");
		a.classList.add("image");
		
		var img = document.createElement("img");
		img.src = "images/" + imgs[i] + ".jpg";
		img.alt = "";
		img.dataset.position = "center top";
		a.appendChild(img);
		section.appendChild(a);
	}

	var contents = document.createElement("div");
	contents.classList.add("content");
	
	var inner = document.createElement("div");
	inner.classList.add("inner");
	
	if (header_1) {
		var h1 = document.createElement("h2");
		h1.innerHTML = header_1
		inner.appendChild(h1);
		if (tags.length > 0) {
			var tagBox = document.createElement("div");
			for (var i = 0; i < tags.length; i++) {
				var tag = document.createElement("div");
				tag.style.backgroundColor = first_where(availableTags, "available-tags", tags[i])["colour"]
				tag.classList.add("tag");
				tag.innerHTML = "# " + tags[i];
				tagBox.appendChild(tag);
			}
			h1.appendChild(tagBox);
		}
	}

	if (roles.length > 0) {
		var h3 = document.createElement("h3");
		var res = []
		for (var i = 0; i < roles.length; i++) {
			res.push(first_where(availableRoles, "available-roles", roles[i])["pretty-print"])
		}
		h3.innerHTML = res.join(", ");
		inner.appendChild(h3);
	}
	
	for (var i = 0; i < content.length; i++) {
		var p = document.createElement("p");
		p.innerHTML = content[i]
		inner.appendChild(p);
	}
	
	contents.appendChild(inner);
	section.appendChild(contents);
	
	return section;
}

function first_where(df, col, val) {
	for (var k = 0; k < df.length; k++) {
		if (df[k][col] == val) {
			return df[k];
		}
	}
}


function init_searchbar() {
	var section = document.createElement("section");
	section.id = "bar";
	section.classList.add("wrapper","style2","spotlights")

	// add the section head
	section.appendChild(SectionSearch());
	searchBar.appendChild(section);
}

function load_bios(staffData) {
	
	for (var j = 0; j < staffData.length; j++) {
		var firstName = staffData[j]["first-name"]
		var lastName = staffData[j]["last-name"]
		var role = staffData[j]["role"]
		var biotext = staffData[j]["biotext"]
		var tags = staffData[j]["tags"]
		var imgname = staffData[j]["img-name"]
						
		var roles = role.split("/");
		
		var section = Section(header_1=firstName + " " + lastName,
			roles=roles,
			imgs=["img-" + (imgname ? imgname : firstName.toLowerCase())],
			content=biotext.split("#"),
			tags=(tags == "" ? [] : tags.split("/")));
		
		staffData[j]["section"] = section;
		
		var category = first_where(availableRoles, "available-roles", roles[0])["category"]
		
		categoryBlocks[category].appendChild(section); // change this
	}
}


function init_bioblock(tagsDF, rolesDF, data) {
	
	availableTags = $.csv.toObjects(tagsDF);
	availableRoles = $.csv.toObjects(rolesDF);
	staffData = $.csv.toObjects(data);
	
	init_searchbar();
	
	// let's first saturate the bioblock with dynamically generated categories
	
	for (var category in categories) { // loop over our categories
		var prettyCategory = categories[category];
		
		var newSection = document.createElement("section");
		newSection.id = category;
		newSection.classList.add("wrapper","style2","spotlights")

		var sectionHead = Section(header_1=prettyCategory);
		sectionHead.id = category + "-head";
		// add the section head
		newSection.appendChild(sectionHead);
			
		categoryBlocks[category] = newSection; // store our new section
		bioBlock.appendChild(newSection);
	}
	
	load_bios(staffData);
	
	loadMain();
}

function loadMain() {
	var script = document.createElement('script');
	script.src = "assets/js/main.js";
	document.documentElement.firstChild.appendChild(script);
}