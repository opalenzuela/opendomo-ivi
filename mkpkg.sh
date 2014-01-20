#!/bin/sh

VERSION=`date '+%Y%m%d'`
PKGID="odivi"
USR="--owner 1000 --group 1000 --same-permissions "
EXCLUDE=" --exclude '*~' --exclude .svn "


# packages
tar cfz $PKGID-$VERSION.tar.gz usr var $USR $EXCLUDE


