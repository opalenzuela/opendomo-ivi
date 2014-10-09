#!/bin/sh

# Copyright(c) 2014 OpenDomo Services SL. Licensed under GPL v3 or later

echo "Content-Type: text/html"
echo


CFGDIR="/etc/opendomo/ivi"
CTRLDIR="/var/opendomo/control_allports"

X=""
Y=""
DESC=""
TYPE=""
DIR=""
PNAME=""

mkdir -p "$CFGDIR"

QUERY=$(echo $QUERY_STRING | sed -e 's/&/ /g')

if ! test -z "$QUERY"; then
	for param in $QUERY; do
		varname=$(echo $param | cut -f1 -d=)
		varvalue=$(echo $param | cut -f2 -d=)
		
		test "$varname" = "x" && X=$varvalue
		test "$varname" = "y" && Y=$varvalue		
		test "$varname" = "desc" 	&& DESC=$varvalue
		test "$varname" = "port" 	&& PORT=$varvalue
		test "$varname" = "type" 	&& TYPE=$varvalue
		test "$varname" = "dir"  	&& DIR=$varvalue
		test "$varname" = "floor" 	&& FLOOR=$varvalue
		# If the port is sent as parameter, we might want to configure it
		test "$varname" = "pname" 	&& PNAME=$varvalue 
	done
fi

mkdir -p $CFGDIR/$FLOOR

if ! test -z "$X" &&  ! test -z "$Y"; then
	echo "#$PORT {left: ${X}px; top: ${Y}px;}" > $CFGDIR/$PORT.css
	case $DIR in
		'DO')
			echo "<div id='$PORT' class='item $TYPE'  ><a id='${PORT}_switch' title='$DESC'></a></div>" > $CFGDIR/$FLOOR/$PORT.html
		;;
		'AO')
			echo "<div id='$PORT' class='block $TYPE' ><a id='${PORT}_switch' title='$DESC'>light</a><div class='panel'><input type='text' size='2' id='${PORT}_value'/><div id='${PORT}_slide' class='slider'></div></div></div>"  >$CFGDIR/$FLOOR/$PORT.html
		;;
		'AI')
			echo "<div id='$PORT' class='block' ><canvas id='${PORT}_gauge' title='$DESC' class='gauge'></canvas><div class='screen'><p>More data</p></div></div>"  >$CFGDIR/$FLOOR/$PORT.html
		;;
	esac
else
	if ! test -z "$DESC"; then
		touch $CFGDIR/$DESC.css
	fi
fi


echo "
<!DOCTYPE html>
<html lang='es'>
	<head>
		<title>OpenDomo IVI configurator</title>
		<meta charset='utf-8' />				
		<link type='text/css' href='/themes/scada/default.css' media='screen' rel='stylesheet' />
		<script type='text/JavaScript' src='/scripts/jquery.min.js'></script>	
		<script type='text/JavaScript' src='/scripts/jquery-ui.js'></script>
	</head>
<body>"

echo "	<div id='formfield'>
		<form action='/cgi-bin/scada-config.cgi'>
			<input type='hidden' name='port' value='$PNAME'/>"
# FLOORS
echo "<select name='floor'>"
cd $CFGDIR
for i in *; do
	if test -d "$i"; then
		echo "<option onclick=\"myimg.src='/images/map_$i.png';\">$i</option>"
	fi
done

echo "</select>"
echo "
	Label: <input type='text' name='desc' size='50' value='$PNAME'/>
	<label><input type='radio' name='dir' value='DO' checked=yes/>Digital output</label>  
	<label><input type='radio' name='dir' value='AO'/>Adjustable</label>
	<label><input type='radio' name='dir' value='AI'/>Gauge</label>  
	Type: <select name='type'>"

for t in light fancool fanhot cam gauge speaker up down; do
	echo "<option>$t</option>"
done

 echo "</select>
  <input type='submit' value='Next'> <br/>
  <input id='myimg' type='image' src='/images/map_$i.png' alt='Submit' ><br/>
</form>
</div>"
echo "<!-- "
env
echo " -->"
echo '

</body>
</html>
'
