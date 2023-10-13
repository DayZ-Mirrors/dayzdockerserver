#!/usr/bin/env bash

# Set PS1 so we know we're in the container
if ! echo .bashrc | grep -q "dz-web"
then
	echo "Adding PS1 to .bashrc..."
	cat >> .bashrc <<EOF
alias ls='ls --color'
export PS1="${debian_chroot:+($debian_chroot)}\u@dz-web:\w\$ "
EOF
fi

# Shut steamcmd up
if ! [ -d ${HOME}/.steam ]
then
	mkdir -p ${HOME}/.steam
fi

cd /web
npm i
export DEBUG='express:*'
npx nodemon web.js &

cd docroot
npm i
exec npm run dev
