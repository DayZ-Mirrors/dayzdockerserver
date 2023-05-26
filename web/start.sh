#!/usr/bin/env bash

# Set PS1 so we know we're in the container
if ! [ -f .bashrc ]
then
	echo "Creating .bashrc..."
	cat > .bashrc <<EOF
alias ls='ls --color'
export PS1="${debian_chroot:+($debian_chroot)}\u@dz-web:\w\$ "
EOF
fi

cd /web
npm i
export DEBUG='express:*'
npx nodemon web.js
