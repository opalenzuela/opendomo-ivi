#!/bin/sh
#desc:Configure map
#package:odivi
#type:local

# This script will allow the configuration of OD's IVI

CFGDIR="/etc/opendomo/ivi"
CFGFILE="$CFGDIR.conf"

if ! test -d "$CFGDIR" 
then
	mkdir $CFGDIR
	echo "FLOORS=1" > $CFGFILE
fi
touch $CFGFILE


if test -z "$1" 
then
	# If NO parameters are specified, we move the images to TMP, so they can be edited
	cp $CFGDIR/* $TMPDIR/
else
	# If parameters are specified, we save it
	echo "FLOORS=$1" > $CFGFILE
	echo "Saving floors to $1"
	for i in `seq 1 $FLOORS`
	do
		test -f $TMPDIR/floor$i.png && cp $TMPDIR/floor$i.png $CFGDIR/ 
	done	
fi

source $CFGFILE

echo "#>Configure map"
echo "form:`basename $0`"
echo "	floors	Number of floors	number	$FLOORS"
for i in `seq 1 $FLOORS`
do
	echo "	floor1	Floor number [$i]	file	floor$i.png"
done
echo 
