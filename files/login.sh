#!/usr/bin/env bash

if [ -f ${HOME}/.steamlogin ]
then
  echo "The file .steamlogin already exists. Remove it first then run this again. (See README.md)"
  exit 1
else
  source /files/dayzserver
  fn_install_steamcmd
  echo "Setting up Steam credentials"
  cp /files/steamlogin "${HOME}/.steamlogin"
  source "${HOME}/.steamlogin"
  ${HOME}/steamcmd/steamcmd.sh +force_install_dir ${HOME}/serverfiles +login "${steamlogin}" +quit
fi
