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



function init() {
	bioBlock = document.getElementById("wrapper");
	
	fetch('assets/data/available-roles.csv')
		.then(response => response.text())
		.then(data => availableRoles = data)
	
	fetch('assets/data/available-tags.csv')
		.then(response => response.text())
		.then(data => console.log(data))
	
	fetch('assets/data/staff-data.csv')
		.then(response => response.text())
		.then(data => staffData = data)
		.then(res => init_bioblock())
	
	availableTags = {
		"neuroscience": "rgb(201, 127, 111)", 
		"cog-sci": "rgb(214, 141, 161)", 
		"computation": "rgb(161, 175, 201)", 
		"biology": "rgb(145, 201, 158)", 
		"comp-sci": "rgb(142, 133, 199)"
	}
	availableRoles = {
		"founder": "Founder",
		"pres": "President",
		"ceo": "CEO"
	};

	
}

init(); // we need this to init before main.js at least (for dynamic img adjustments)






function Section(header_1=null, header_2=null, imgs=[],content=[],tags=[]) {
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
				tag.style.backgroundColor = availableTags[tags[i]]
				tag.classList.add("tag");
				tag.innerHTML = "# " + tags[i];
				tagBox.appendChild(tag);
			}
			h1.appendChild(tagBox);
		}
	}
	
	
	
	if (header_2) {
		var h3 = document.createElement("h3");
		h3.innerHTML = header_2
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



function apply_prettify(list, prettifier) {
	var res = [];
	for (var l = 0; l < list.length; l++) {
		res.push(prettifier[list[l]]);
	}
	return res;
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
	/*var staffData = [{
		"first-name": "Ally",
		"last-name": "Kim",
		"role": "founder/pres/ceo",
		"biotext": "As the first in her immigrant family to pursue scientific research, Ally witnessed the hurdles in gaining access to research training. She founded Sci-MI with the goal of increasing access to training and empowering diverse scientists.#Beyond Sci-MI, Ally works at the Broad Institute of MIT and Harvard to bridge the diversity gap in genomics research.",
		"tags": "neuroscience/computation/cog-sci/biology/comp-sci",
		"imgname": ""
	}];*/
	
	for (var j = 0; j < staffData.length; j++) {
		var firstName = staffData[j]["first-name"]
		var lastName = staffData[j]["last-name"]
		var role = staffData[j]["role"]
		var biotext = staffData[j]["biotext"]
		var tags = staffData[j]["tags"]
		var imgname = staffData[j]["imgname"]
		
		//"img-" + (imgname == "" ? firstName.toLowerCase() : imgname)
		
		var section = Section(header_1=firstName + " " + lastName,
			header_2=apply_prettify(role.split("/"), availableRoles).join(", "),
			imgs=["img-" + (imgname == "" ? firstName.toLowerCase() : imgname)],
			content=biotext.split("#"),
			tags=tags.split("/"));
		
		categoryBlocks["exec"].appendChild(section);
	}
}