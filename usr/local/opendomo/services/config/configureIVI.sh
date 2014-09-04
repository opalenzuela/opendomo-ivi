#!/bin/sh
#desc:Configure map
#package:odivi
#type:local

# This script will allow the configuration of OD's IVI
# If the configuration directory does not exist

CFGDIR="/etc/opendomo/ivi"
CFGFILE="$CFGDIR.conf"

if ! test -d "$CFGDIR" 
then
	mkdir $CFGDIR
fi
touch $CFGFILE

# If parameters are specified, we save it
if ! test -z "$3" 
then
	echo "FLOORS=$1" > $CFGFILE
	for i in `seq 1 $FLOORS`
	do
		cp $TMPDIR/floor$i.jpg $CFGDIR/ 
	done	
fi

source $CFGFILE

echo "#>Configure map"
echo "form:`basename $0`"
echo "	floors	Number of floors	number	$FLOORS"
for i in `seq 1 $FLOORS`
do
	echo "	floor1	Floor number [$i]	file	floor$i.jpg"
done
echo 
