#!/bin/sh

# Copyright(c) 2014 OpenDomo Services SL. Licensed under GPL v3 or later

echo "Content-Type: text/html"
echo


CFGDIR="/etc/opendomo/ivi"
CTRLDIR="/var/opendomo/control_allports"

if ! test -d $CTRLDIR; then
	/usr/local/opendomo/listAllControlPorts.sh 2>/dev/null
fi

echo "
<!DOCTYPE html>
<html lang='es'>
	<head>
		<title>OpenDomo IVI configurator</title>
		<meta charset='utf-8' />
		<link type='text/css' href='/themes/scada/default.css' media='screen' rel='stylesheet' />						
	</head>
<body>
	<div id='formfield'>
		<a class='button' href='/cgi-bin/scada.cgi' target='_top'>Back</a>
		<ul>"
cd $CTRLDIR
for i in *; do
	echo "			<li><a href='/cgi-bin/scada-config.cgi?pname=$i' target='editframe'>$i</a></li>"
done

echo '
		</ul>
	</div>
</body>
</html>
'
