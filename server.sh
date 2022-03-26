#!/usr/bin/env bash

# Make sure we don't start collecting core files
ulimit -c 0

# This script will take environment variables and put them into the files the script expects.
echo "steamlogin=anonymous" > .steamlogin

# Do something with SERVERNAME="DayZ on Linux for Linux"
if ! grep SERVERNAME serverDZ.cfg
then
  echo "Setting the SERVERNAME..."
  sed -i serverDZ.cfg -e "s/SERVERNAME/${SERVERNAME}/"
fi

./dayzserver start || find /home/user -name error.log -exec cat {} \;