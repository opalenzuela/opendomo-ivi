#!/bin/bash

VERSION=`date '+%Y%m%d'`
ARCH=noarch
PKG="odcgi_scada"
USR="--owner 1000 --group 1000 --same-permissions "
EXCLUDE=" --exclude '*~' --exclude .svn "


# packages
mkdir -p pkg
rm -fr pkg/*.gz
tar cfz ./pkg/$PKG-$VERSION.od.$ARCH.tar.gz usr etc var $USR $EXCLUDE


