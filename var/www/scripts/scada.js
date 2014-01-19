function showLayer(layer) {
	var theRules = new Array();
	var reglayer = new RegExp(layer);	
	var new_label = document.getElementById("m_"+layer);
	var old_label = document.getElementById("b_"+layer);
				
	if (document.styleSheets[0].cssRules)
		theRules = document.styleSheets[0].cssRules
	else if (document.styleSheets[0].rules)
		theRules = document.styleSheets[0].rules

	for (i=0;i<theRules.length;i++) {
		if (theRules[i].selectorText.match(reglayer)) {
			theRules[i].style.display='block';					
		}
	}
	if(new_label) new_label.style.display='inherit';
	if(old_label) old_label.style.display='none';
}

function hideLayer(layer) {
	var theRules = new Array();
	var reglayer = new RegExp(layer);	
	var new_label = document.getElementById("b_"+layer);
	var old_label = document.getElementById("m_"+layer);
	
	if (document.styleSheets[0].cssRules)
		theRules = document.styleSheets[0].cssRules
	else if (document.styleSheets[0].rules)
		theRules = document.styleSheets[0].rules

	for (i=0;i<theRules.length;i++) {
		if (theRules[i].selectorText.match(reglayer)) {
			theRules[i].style.display='none';
		}
	}
	if(new_label) new_label.style.display='inherit';
	if(old_label) old_label.style.display='none';				
}		

function sendScrollValue (){
	if (donotsendupdate==1) return;
	var item =  $("#"+this.parentNode.parentNode.id+"_slide");
	var value = item.slider("value");
	this.parentNode.parentNode.lastChild.data = value;
	//$("#"+this.parentNode.parentNode.id+"_value").val(value);
	//alert(this.parentNode.parentNode.id + " " + value);
	$.ajax({
		url: "/cgi-bin/od.cgi/setPort.sh?port="+this.parentNode.parentNode.id+"&value="+value+"&GUI=XML",
		context: this
	}).done(function() {
		$("#"+this.parentNode.parentNode.id+"_value").val(value);
	});
						
}
var donotsendupdate=0;

function processData(xml) {

	var d = xml;
	var ivi = document.getElementById("scada");
	var lgf = document.getElementById("loginform");
	
	// No data or no login
	if( $(xml).find("error")[0]) {
		ivi.style.display='none';
		lgf.style.display='block';
	} else {
		lgf.style.display='none';
		ivi.style.display='block';	
	}

	$(xml).find("text").each(function()
	{
		value = this.childNodes[0].data;
//		if (this.children.length!=0) { 
			port = $(this).attr("id");
		
			var root_item = document.getElementById(port);
			var is_item = document.getElementById(port+"_switch");
			var is_slider = document.getElementById(port+"_slide");
			var is_gauge = document.getElementById(port+"_gauge");
			if (is_slider) {
				//$("#"+port+"_slide").val(value);
				if (root_item.childNodes[1].style.display=='none') {
					donotsendupdate=1;
					$("#"+port+"_slide").slider("value",value);
					donotsendupdate=0;
				}
				if (is_item) {
					if (parseFloat(value)==0) {
						is_item.setAttribute("class","off");
					} else {
						is_item.setAttribute("class","on");
					}
				}
			} else {
				if (is_item) {
					is_item.setAttribute("class",value);
				}
				if (is_gauge) {
					is_gauge.control.set(parseInt(value));
					//$("#"+port+"_gauge").set(value); 	
				}
			}
//		}
	});
}

function reloadData() {
	$.ajax({
		url: "/cgi-bin/od.cgi/listAllControlPorts.sh?GUI=XML",
		context: this,
		dataType: "xml",
		success: processData
	});		
}

function refreshAlarms(){
	// TODO use the jQuery "beautiful" code

	var alarm_array = document.getElementsByClassName("alarm-off");
	var n;
	for (i=0;i<alarm_array.length;i++) {
		n = alarm_array[i].parentNode.parentNode.id;
		g = document.getElementById(n + "_label");
		//$("#" + n+"_label")
		g.style.color="inherit";
	}
				
	var alarm_array = document.getElementsByClassName("alarm-on");
	var n;
	for (i=0;i<alarm_array.length;i++) {
		n = alarm_array[i].parentNode.parentNode.id;
		g = document.getElementById(n + "_label");
		//$("#" + n+"_label")
		g.style.color="red";
	}
	//$("a.alarm-on").parent("div").setAttribute("class","alarm");
}


$(function() {
	// Activate the accordion effect
	$("#scada").accordion();
	// Enable the sliders
	$(".slider").slider({
		step:10,
		orientation: "horizontal",
		range: "min",
		animate: true,
		slide: sendScrollValue,
		change: sendScrollValue
	});
	// Open/close panels
	$(".block").click(function () {
		$(this.childNodes[1]).toggle("highlight",{percent:0},500 );
	});

	// Switching elements
	$("div.item").click(function () {
		var c = this.firstChild.className;
		var nc = c;
		// Switching 
		if (c == "on") 	nc="off";
		if (c == "off")	nc="on";	
		this.title=nc;			
		//alert(this.id);
		$.ajax({
			url: "/cgi-bin/od.cgi/setPort.sh?port="+this.id+"&value="+nc+"&GUI=XML",
			context: this
			}).done(function() {
				this.children[0].setAttribute("class",this.title);
			});
			
		//this.firstChild.setAttribute("class", nc);
	});
	
	// Enabling the menu
	$("#menu").menu();
	
	refreshAlarms();
	
	var gauge_array = document.getElementsByClassName("gauge");
	var gaugeitems = new Array();
	var gauge_opts = {
		lines: 12, 
		angle: 0.15, 
		lineWidth: 0.5, 
		pointer: {
			length: 0.9, 
			strokeWidth: 0.035, 
			color: '#000000' 
		},
		min: 0,
		max: 100,
		colorStart:	'#6FADCF',   
		colorStop: 	'#8FC0DA',   
		strokeColor:	'#E0E0E0',  
		generateGradient: true
	};

	for (i=0;i<gauge_array.length;i++) {
		gaugeitems[i] = new Gauge(gauge_array[i]);
		gaugeitems[i].setOptions(gauge_opts);
		//gaugeitems[i].set(56);
		gauge_array[i].control = gaugeitems[i];
	}
	
	setInterval(reloadData,2000);
	reloadData();
});
