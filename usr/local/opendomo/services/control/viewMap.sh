#!/bin/sh
#desc:View map
#plugin:odivi
#author:opalenzuela

# Copyright(c) 2014 OpenDomo Services SL. Licensed under GPL v3 or later

if ! test -d /etc/opendomo/ivi/; then
	mkdir /etc/opendomo/ivi/
fi
echo "list:`basename $0`"
echo "#LOAD Loading"
echo 