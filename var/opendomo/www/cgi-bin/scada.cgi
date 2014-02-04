#!/bin/sh
echo "Content-Type: text/html"
echo


CFGDIR="/etc/opendomo/ivi"

if ! test -d $CFGDIR; then
	mkdir -p $CFGDIR/planta1
fi

cd $CFGDIR

echo '<!doctype html>

<html lang="es">
	<head>
		<title>IVI</title>
		<meta charset="utf-8" />	
		<link rel=”apple-touch-icon” href=”/apple-touch-icon.png”/>
		<meta name="apple-mobile-web-app-capable" content="yes" />	
		<link type="text/css" href="/cgi-bin/scada-style.cgi"   media="screen" rel="stylesheet" />
		<link type="text/css" href="/themes/scada/default.css" media="screen" rel="stylesheet" />
		<script type="text/JavaScript" src="/scripts/jquery.min.js"></script>	 
		<script type="text/JavaScript" src="/scripts/jquery-ui.js"></script>
		<script type="text/JavaScript" src="/scripts/jquery.ui.touch-punch.js"></script>
		<script type="text/JavaScript" src="/scripts/raphael-min.js"></script> 
		<script type="text/JavaScript" src="/scripts/gauge.js"></script>
		<script type="text/JavaScript" src="/scripts/scada.js"></script>		
	</head>
	<body>
		<div id="titlebar">
			<img src="/images/options.gif"/>
<!--			<h1>OpenDomo IVI</h1> -->
			<ul id="menu">
			  <li onclick="reloadData();"><a href="#"><span class="ui-icon ui-icon-disk"></span>Recargar</a></li>
<!--			  <li>
			    <a href="#">Capas</a>
			    <ul>
				 <li>
				 	<a title="light" onclick="hideLayer(this.title);" id="m_light">Luces</a>
				 	<a title="light" onclick="showLayer(this.title);" id="b_light" style="display:none;">Luces</a>
				 </li>
				 <li>
				 	<a title="fan" onclick="hideLayer(this.title);" id="m_fan">Clima</a>
				 	<a title="fan" onclick="showLayer(this.title);" id="b_fan" style="display:none;">Clima</a>
				 </li>
				 <li>
				 	<a title="fan" onclick="hideLayer(this.title);" id="m_cam">Cámaras</a>
				 	<a title="fan" onclick="showLayer(this.title);" id="b_cam" style="display:none;">>Cámaras</a>
				 </li>
				 <li>
				 	<a title="gauge" onclick="hideLayer(this.title);" id="m_gauge">Sondas</a>
				 	<a title="gauge" onclick="showLayer(this.title);" id="b_gauge" style="display:none;">Sondas</a>
				 </li>
			    </ul>
			  </li> -->
			  <li><a href="/ivi-config.html"><span class="ui-icon ui-icon-disk"></span>Reconfigurar</a></li>
			  <li><a href="/cgi-bin/od.cgi/control/?LOGOUT=1"><span class="ui-icon ui-icon-exit"></span>Salir</a></li>
			</ul>
 		</div>'
 
 		
 echo "<div id='scada'>"
 for i in *; do
 	if test "$i" != "*" && test -d "$i" ; then
 		if ! test -f $CFGDIR/$i/map.png
 		then
 			cp /var/www/images/demo_planta1.png $CFGDIR/$i/map.png
 		fi
 		if ! test -f /var/www/images/map_$i.png; then
	 		ln -s $CFGDIR/$i/map.png /var/www/images/map_$i.png
	 	fi
 		echo "			<h3 id='${i}_label'>$i</h3>
			<div id='$i' class='container'>
				<img src='/images/map_${i}.png' class='floor'/>"
 		cat $i/*.html
 	
 		echo "</div>"
 	fi
 done
 
 
 echo "</div>
 	<div id='loginform' style='display:none;'>
 		<form action='/cgi-bin/od.cgi' target='loginframe'>
			<ul id='formfield'>
				<li id='USER_lbl' class='input'><label for='USER'>Nombre de usuario:</label>
					<p><input id='USER' name='USER'  type='text'></p></li>
				<li id='PASS_lbl' class='password'><label for='PASS'>Clave de acceso:</label>
					<p><input id='PASS' name='PASS' type='password'></p></li>
			</ul>
			<button type='submit'>Entrar</button>
 		</form>
 		<iframe src='about:blank' name='loginframe' width='10' height='10'></iframe>
 	</div>
 </body>
 </html>"
