#!/usr/bin/env bash

# Make sure we don't start collecting core files
ulimit -c 0

# This script will take environment variables and put them into the files the script expects.
echo "steamlogin=anonymous" > .steamlogin

sed -i serverDZ.cfg -e "s/SERVERNAME/${SERVERNAME}/"

./dayzserver start || (
  echo
  echo "========================================== error.log =========================================="
  find /home/user -name error.log -exec cat {} \; -exec rm -f {} \;
  echo
  echo "========================================== script*.log =========================================="
  find /home/user -name "script*.log" -exec cat {} \; -exec rm -f {} \;
  echo
  echo "========================================== *.RPT =========================================="
find /home/user -name "*.RPT" -exec cat {} \; -exec rm -f {} \;
)