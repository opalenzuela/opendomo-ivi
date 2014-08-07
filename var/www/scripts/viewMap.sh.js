jQuery(function($) {
	var id = document.getElementById("ivi");
	if (!id) {
		var b = document.body;
		var iviframe = document.createElement("div");
		iviframe.setAttribute("id","iviframe");
		var ivi = document.createElement("div");
		ivi.setAttribute("id","ivi");
		iviframe.appendChild(ivi);
		b.appendChild(iviframe);
	}
});