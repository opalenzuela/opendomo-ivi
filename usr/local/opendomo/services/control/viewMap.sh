#!/bin/sh
#desc:View map
#plugin:odivi
#author:opalenzuela

# Copyright(c) 2014 OpenDomo Services SL. Licensed under GPL v3 or later

CFGDIR="/etc/opendomo/ivi"
CFGFILE="$CFGDIR.conf"

if test -d "$CFGDIR" && test -f "$CFGFILE"
then
	cp /etc/opendomo/ivi/* /var/www/data/
	source $CFGFILE
	echo "#LOAD Loading"
	echo "list:`basename $0`"
	cd /etc/opendomo/ivi/
	for i in `seq 1 $FLOORS`
	do
		file= `ls floor$i*` 2>/dev/null
		echo "	floor$i floor$i	floor image $file"
	done
	
else
	# If it's not configured, we invoke the configuration
	/usr/local/opendomo/configureIVI.sh
fi

echo 