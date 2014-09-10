jQuery(function($) {
	var id = document.getElementById("ivi");
	
	var floors = $(".floor");
	if (floors.length==0) return;
	
	if (!id) {
		var b = document.body;
		var iviframe = document.createElement("div");
		iviframe.setAttribute("id","iviframe");
		var ivi = document.createElement("div");
		ivi.setAttribute("id","ivi");
		iviframe.appendChild(ivi);
		b.appendChild(iviframe);
	}
		
	$("#ivi").html("<div id='titlebar'><h1>OpenDomo IVI v</h1><ul id='menu'></ul></div><div id='scada'></div>")
	
	$("#menu").html("<li onclick='updatePorts();'><a href='#'><span class='ui-icon ui-icon-refresh'></span>Reload</a></li>\
		<li><a href='#'>Capas</a><ul id='capas'></ul></li>\
		<li onclick='configureIVI()'><a href='#'><span class='ui-icon ui-icon-gear'></span>Configure</a></li>\
		<li onclick='exitIVI()'><a href='#'><span class='ui-icon ui-icon-close'></span>Exit</a></li>");
	
	/*$("#capas").html(" \
		<li>\
			<a onclick=\"hideLayer('light');\" id='m_light'><span class='ui-icon ui-icon-radio-on'></span>Light</a>\
			<a onclick=\"showLayer('light');\" id='b_light' style='display:none;'><span class='ui-icon ui-icon-radio-off'></span>Light</a>\
		 </li>\
		 <li>\
			<a onclick=\"hideLayer('fanhot');hideLayer('fancool');\" id='m_fanhot'><span class='ui-icon ui-icon-radio-on'></span>Climate</a>\
			<a onclick=\"showLayer('fanhot');showLayer('fancool');\" id='b_fanhot' style='display:none;'><span class='ui-icon ui-icon-radio-off'></span>Climate</a>\
		 </li>\
		 <li>\
			<a onclick=\"hideLayer('cam');\" id='m_cam'><span class='ui-icon ui-icon-radio-on'></span>Cameras</a>\
			<a onclick=\"showLayer('cam');\" id='b_cam' style='display:none;'><span class='ui-icon ui-icon-radio-off'></span>Cameras</a>\
		 </li>\
		 <li>\
			<a onclick=\"hideLayer('gauge');\" id='m_gauge'><span class='ui-icon ui-icon-radio-on'></span>Sensors</a>\
			<a onclick=\"showLayer('gauge');\" id='b_gauge' style='display:none;'><span class='ui-icon ui-icon-radio-off'></span>Sensors</a>\
		 </li>");
	*/
	
	var htmlcode ="";
	var pages = $("#viewMap li");
	for (var f=0;f<floors.length;f++) {
		var floornum = f+1;
		var imagepath = "/data/" + pages[f].id;
		htmlcode = htmlcode +  "<h3 id='level" + floornum + "_label'>Floor " + floornum + "</h3>\
		<div id='level" + floornum + "' class='container'>\
			<img src='" + imagepath + "' class='floor'/>\
		</div>";
	}
	
	
	
	$("#scada").html(htmlcode);
	
	/*$("#scada").html("  \
		<h3 id='level2_label'>planta 2</h3>\
		<div id='level2' class='container'>\
			<img src='/images/demo_planta2.png' class='floor'/>\
		</div>\
		<h3 id='level1_label'>planta 1</h3>\
		<div id='level1' class='container'>\
			<img src='/images/demo_planta1.png' class='floor'/>\
		</div>");
		*/
		
	include_script("/scripts/vendor/jquery-ui.js");
	include_script("/scripts/vendor/jquery.ui.touch-punch.js");
	include_script("/scripts/vendor/raphael-min.js");
	include_script("/scripts/vendor/gauge.js");
	
	setTimeout(function(){
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
			if (configurationMode==true) return; // Ignore if we are dragging items
			if ($(this).hasClass("expanded")) {
				$(this).toggleClass("expanded");
				$(this).find("div.panel").hide();
			}else {
				$(this).toggleClass("expanded");
				$(this).find("div.panel").show();
			}
			
			$(this.childNodes[1]).toggle("highlight",{percent:0},500 );
		});

		$( document ).tooltip({
			track: true
		});		
		
		// Switching elements
		/*$("div.item").click(function () {
			if (configurationMode==true) return; // Ignore if we are dragging items
			var c = this.firstChild.className;
			var nc = c;
			// Switching 
			if (c == "on") 	nc="off";
			if (c == "off")	nc="on";	
			this.title=nc;			
			//alert(this.id);
			$.ajax({
				url: "/cgi-bin/od.cgi/listControlPorts.sh?port="+this.id.replace("_","/")+"&value="+nc+"&GUI=XML",
				context: this
				}).done(function() {
					$(this).toggle("highlight",{percent:0},500 );
					this.children[0].setAttribute("class",this.title);
				});
				
			//this.firstChild.setAttribute("class", nc);
		});*/
		
		// Enabling the menu
		$("#menu").menu();
		
		refreshAlarms();
			
/*		setInterval(reloadData,2000);
		reloadData(); */
	},1000);
});


var configurationMode = false;
function configureIVI() {
	//TODO Make it persistent
	configurationMode = true;	
	$(".item, .block").css("border","1px solid blue").css("border-radius","5px").draggable();;
	$("#titlebar").append("<input id='btnsaveconfig' type='button' value='Save changes' onclick='saveConfiguration()'>");
}

function saveConfiguration() {
	var cssfile = "";
	$(".item, .block").each(function(index){
		cssfile = cssfile + "@" + this.id + "{left:" + this.offsetLeft + "px, top: " + this.offsetTop + "px,}";
	});

	var saveurl = "/cgi-bin/od.cgi/viewMap.sh?saveconf=saveconf&floor=floor1&data=" + encodeURIComponent(cssfile);
	$.ajax({
		url: saveurl,
		context: this
		}).done(function() {
			alert("Configuration saved");
			$(".item, .block").css("border","none").css("border-radius","5px").draggable("destroy");
		});	
}

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
		url: "/cgi-bin/od.cgi/listControlPorts.sh?port="+this.parentNode.parentNode.id.replace("_","/")+"&value="+value+"&GUI=XML",
		context: this
	}).done(function() {
		$("#"+this.parentNode.parentNode.id+"_value").val(value);
	});
						
}
var donotsendupdate=0;

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

function exitIVI() {
	$("#iviframe").hide();
}


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

var portdata;
var portcoordinates;
function updatePorts()
{
	portdata = loadJSON("/data/odauto.json");
	//portcoordinates = loadJSON("/data/portcoordinates.json");
	//TODO: Allow level selection
	var floor = document.getElementById("level1");
	
	if (portdata==null) return;
	
	for(var i=0;i<portdata.ports.length;i++) {
		try{
			var port = portdata.ports[i];
			var id = port.Id.replace("/","_");
			var p = document.getElementById(id);
			//var t = port.Type[3].toLowerCase(); // The one-letter tag (or "_")
			var type = port.Type.toLowerCase(); // di|do|ai|ao ...
			var tag = port.Tag?port.Tag:"light";
			var value = port.Value.toLowerCase();
			/*switch(t){
				case "l":
				case "_":
					tag="light";
					break;
				case "c":
					tag="fanhot";
					break;
				case "s":
					tag="security";
					break;
				case "p":
					tag="power";
					break;
				case "m":
					tag="measure";
					break;
				case "a":
					tag="access";
					break;				
			}*/
			
			if (!p) {
				var p = document.createElement("div");
				p.setAttribute("id",id);
				var a  = document.createElement("a");
				a.setAttribute("id",port.Id.replace("/","_")+"_switch");
				a.appendChild(document.createTextNode(tag));
				a.setAttribute("title",port.Id);
				if (type=="do" || type=="dv") {
					p.className="item "+tag; 
					a.className = value;
					a.onclick = function() {
						var newval = this.className.indexOf("off")==-1?"off":"on";
						var portname = this.parentNode.id.replace("_","/");
						var uri = "/cgi-bin/od.cgi/listControlPorts.sh?port="+portname+"&value="+newval;
						$.get(uri,function(){
							//setTimeout(updatePorts,1000);
							}
						);
					}
				} else if (type=="di") { // Digital input. Ignore?
					p.className = "hidden";
					a.className = value;
				} else if (type=="ai"){ // Analog input
					p.className="block "+tag;  
					p.innerHTML = "<div class='screen'><p>Show the data here</p></div>";
					var c = document.createElement("canvas");
					c.className = "gauge";
					c.setAttribute("id",id + "_gauge");
					var g = new Gauge(c);
					g.setOptions(gauge_opts);
					value = parseFloat(value);
				} else if (type=="ao" ||type=="av"){ // Analog output or virtual
					p.className="block "+tag;  
					p.innerHTML = "<div class='panel'><input type='text' size='2' id='"+id+"_value'/>" +
						"<div id='"+id+"_slide' class='slider'></div></div>";
					p.onclick = function () {
						$(this.childNodes[1]).toggle("highlight",{percent:0},500 );
					};						
					value = parseFloat(value);
				} else if (type=="img"){ // Image
					p.className="item "+tag;  
					p.innerHTML = "<img src='" + value + "'>";

				} else {
					p.className = "hidden";
				}
				p.appendChild(a);
				floor.appendChild(p);
			}
			
			if (value=="") {
				$("#"+id+ " a").addClass("hidden");
			}else if(value=="on"){
				$("#"+id+ " a").removeClass("off");
				$("#"+id+ " a").addClass("on");
			} else if (value=="off"){
				$("#"+id+ " a").removeClass("on");
				$("#"+id+ " a").addClass("off");
			}
		}catch(e){
			console.log("Port " + id + " omitted: "+e.message);
		}
	}
	
	var gauge_array = document.getElementsByClassName("gauge");
	var gaugeitems = new Array();


	/*for (i=0;i<gauge_array.length;i++) {
		gaugeitems[i] = new Gauge(gauge_array[i]);
		gaugeitems[i].setOptions(gauge_opts);
		//gaugeitems[i].set(56);
		gauge_array[i].control = gaugeitems[i];
	} */	
}

		/* Some examples:
		<div id='el_alarm11' class='block alarm' ><a class='on'>alarm</a><div class='screen'><iframe src='/alerts_example.html'>Can't load frames</iframe></div></div>\
		<div id='ODC0004A340954F_lvent' class='item light'  ><a id='ODC0004A340954F_lvent_switch'>light</a></div>\
		<div id='ODC0004A340954F_lintr' class='item light'  ><a id='ODC0004A340954F_lintr_switch'>light</a></div>\
		<div id='ODC0004A340954F_lreun' class='item light'  ><a id='ODC0004A340954F_lreun_switch'>light</a></div>\
		<div id='ODC0004A340954F_m00cA' class='block light' ><a id='ODC0004A340954F_m00cA_switch'>light</a><div class='panel'><input type='text' size='2' id='ODC0004A340954F_m00cA_value'/><div id='ODC0004A340954F_m00cA_slide' class='slider'></div></div></div>				\
		<div id='el_fan21' 	 class='block fancool' ><a class='on'>fan</a><div class='panel'><input type='text' size='2' id='el_fan21_value'/><div id='el_fan21_slide' class='slider'></div></div></div>\
		<div id='el_fan22' 	 class='block fanhot' ><a class='on'>fan</a><div class='panel'><input type='text' size='2' id='el_fan22_value'/><div id='el_fan22_slide' class='slider'></div></div></div>\
		<div id='el_fan23' 	 class='item fanhot' 	><a class='off'>fan</a></div>\
		<div id='el_speak21' class='item speaker' ><a class='off'>music</a></div>\
		<div id='el_speak22' class='item speaker' ><a class='on'>music</a></div>\
		<div id='el_cam21'   class='block cam' ><a class='on'>cam</a><div class='screen'><img src='/images/whitenoise1.gif'/></div></div>\
		<div id='el_cam22'   class='block cam' ><a class='off'>cam</a><div class='screen'><img src='/images/whitenoise1.gif'/></div></div>\
		<div id='ODC0004A340954F_vt003'	 class='block' ><canvas id='ODC0004A340954F_vt003_gauge' class='gauge'>gauge</canvas><div class='screen'><p>Show the data here</p></div></div>\
		<div id='ODC0004A340954F_vt004'	 class='block' ><canvas id='ODC0004A340954F_vt004_gauge' class='gauge'>gauge</canvas><div class='screen'><p>Show the data here</p></div></div>\
		<div id='el_alarm11' class='block alarm' ><a class='off'>alarm</a><div class='screen'><iframe src='/noalerts_example.html'>Can't load frames</iframe></div></div> \		
		*/

function loadJSON(filePath) {
  // Load json file;
  var json = loadTextFileAjaxSync(filePath, "application/json");
  // Parse json
  return JSON.parse(json);
}   

// Load text with Ajax synchronously: takes path to file and optional MIME type
function loadTextFileAjaxSync(filePath, mimeType)
{
  var xmlhttp=new XMLHttpRequest();
  xmlhttp.open("GET",filePath,false);
  if (mimeType != null) {
    if (xmlhttp.overrideMimeType) {
      xmlhttp.overrideMimeType(mimeType);
    }
  }
  xmlhttp.send();
  if (xmlhttp.status==200)
  {
    return xmlhttp.responseText;
  }
  else {
    // TODO Throw exception
    return null;
  }
}



setInterval(updatePorts,2000);
