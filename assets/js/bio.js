var bioBlock;
var categoryBlocks = {};

var availableRoles;
var availableTags;
var staffData;

// add more categories here if desired
var categories = {
	"exec": "Executive Team",
	"admin": "Directors and Admin",
	"mentor": "Mentors"
}

window.onload = function() {
	bioBlock = document.getElementById("wrapper");
	
	fetch('assets/data/available-roles.csv')
		.then(response => response.text())
		.then(data => availableRoles = data)
	
	fetch('assets/data/available-tags.csv')
		.then(response => response.text())
		.then(data => availableTags = data)
	
	fetch('assets/data/staff-data.csv')
		.then(response => response.text())
		.then(data => staffData = data)
	
	
	init_bioblock();
	
}

function Section(header_1=null, header_2=null, imgs=[],content=[]) {
	var section = document.createElement("section");

	for (var i = 0; i < imgs.length; i++) {
		var img = document.createElement("img");
		img.src = "images/" + imgs[i] + ".png";
		section.appendChild(img);
	}

	var contents = document.createElement("div");
	contents.classList.add("content");
	
	var inner = document.createElement("div");
	inner.classList.add("inner");
	
	if (header_1) {
		var h1 = document.createElement("h2");
		h1.innerHTML = header_1
		inner.appendChild(h1);
	}
	
	if (header_2) {
		var h2 = document.createElement("h2");
		h2.innerHTML = header_2
		inner.appendChild(h2);
	}
	
	for (var i = 0; i < content.length; i++) {
		var p = document.createElement("p");
		p.innerHTML = content[i]
		inner.appendChild(p);
	}
	
	contents.appendChild(inner);
	section.append(contents);
	
	return section;
}




function init_bioblock() {
	// let's first saturate the bioblock with dynamically generated categories
	
	for (var category in categories) { // loop over our categories
		var prettyCategory = categories[category];
		
		var newSection = document.createElement("section");
		newSection.id = category;
		newSection.classList.add("wrapper","style2","spotlights")

		// add the section head
		newSection.appendChild(Section(header_1=prettyCategory));
		
		categoryBlocks[category] = newSection; // store our new section
		bioBlock.appendChild(newSection);
	}
	
	var staffData = $.csv.toObjects(staffData)
	for (var j = 0; j < staffData.length; j++) {
		var firstName = staffData[j]["first-name"]
		var lastName = staffData[j]["last-name"]
		var role = staffData[j]["role"]
		var biotext = staffData[j]["biotext"]
		var tags = staffData[j]["tags"]
		var imgname = staffData[j]["imgname"]
		
		categoryBlocks["exec"].appendChild(Section(header_1=firstName + " " + lastName));
	}
}