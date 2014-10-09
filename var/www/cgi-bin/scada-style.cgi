#!/bin/sh

# Copyright(c) 2014 OpenDomo Services SL. Licensed under GPL v3 or later

echo "Content-Type: text/css"
echo
echo "
.light {display:block;}
.fanhot {display:block;}
.fancold {display:block;}
.cam {display:block;}
.gauge {display:block;}
"

CFGDIR="/etc/opendomo/ivi"

cd $CFGDIR
cat .*.css
cat /var/www/css/scada.css