#!/bin/sh
#desc:View map
#plugin:odivi
#author:opalenzuela

# Copyright(c) 2014 OpenDomo Services SL. Licensed under GPL v3 or later

CFGDIR="/etc/opendomo/ivi"
CFGFILE="$CFGDIR.conf"

if test -d "$CFGDIR" && test -f "$CFGFILE"
then
	#TODO Check if odauto is working. Otherwise, it makes no sense to load IVI

	
	if test "$1" == "saveconf" && ! test -z "$3" 
	then
		echo "$3" | sed -e 's/,/;/g' -e 's/@/\n#/g' > $CFGDIR/.$2.css
	fi
	
	cp /etc/opendomo/ivi/* /var/www/data/
	source $CFGFILE
	echo "#LOAD Loading"
	echo "list:`basename $0`"
	cd /etc/opendomo/ivi/
	for i in *.png
	do
		echo "	$i	$i	image floor	$i"
	done
	
else
	# If it's not configured, we invoke the configuration
	/usr/local/opendomo/configureIVI.sh
fi

echo 