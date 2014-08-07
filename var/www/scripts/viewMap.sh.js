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
		
	$("#ivi").html("<h1>OpenDomo IVI</h1><ul id='menu'></ul><div id='scada'></div>");
	
	$("#menu").html("<li onclick='reloadData();'><a href='#'><span class='ui-icon ui-icon-disk'></span>Recargar</a></li><li><a href='#'>Capas</a><ul id='capas'></ul></li>");
	
	$("#capas").html("<li>"
			" 	<a onclick=\"hideLayer('light');\" id='m_light'><span class='ui-icon ui-icon-radio-on'></span>Luces</a>"
			"	 	<a onclick=\"showLayer('light');\" id='b_light' style='display:none;'><span class='ui-icon ui-icon-radio-off'></span>Luces</a>"
			"	 </li>"
			"	 <li>"
			"	 	<a onclick=\"hideLayer('fanhot');hideLayer('fancool');\" id='m_fanhot'><span class='ui-icon ui-icon-radio-on'></span>Clima</a>"
			"	 	<a onclick=\"showLayer('fanhot');showLayer('fancool');\" id='b_fanhot' style='display:none;'><span class='ui-icon ui-icon-radio-off'></span>Clima</a>"
			"	 </li>"
			"	 <li>"
			"	 	<a onclick=\"hideLayer('cam');\" id='m_cam'><span class='ui-icon ui-icon-radio-on'></span>Cámaras</a>"
			"	 	<a onclick=\"showLayer('cam');\" id='b_cam' style='display:none;'><span class="ui-icon ui-icon-radio-off"></span>Cámaras</a>"
			"	 </li>"
			"	 <li>"
			"	 	<a onclick=\"hideLayer('gauge');\" id='m_gauge'><span class='ui-icon ui-icon-radio-on'></span>Sondas</a>"
			"	 	<a onclick=\"showLayer('gauge');\" id='b_gauge' style='display:none;'><span class='ui-icon ui-icon-radio-off'></span>Sondas</a>"
			"	 </li>");
	
	$("#scada").html("<h3 id='level1_label'>planta 1</h3>"
			"<div id='level1' class='container'>"
			"	<img src='/images/demo_planta1.jpg' class='floor'/>"
			"	<div id='el_alarm11' class='block alarm' ><a class='on'>alarm</a><div class='screen'><iframe src='/alerts_example.html'>Can't load frames</iframe></div></div>"
			"</div>");
});