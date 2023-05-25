#!/usr/bin/env bash

# Set PS1 so we know we're in the container
if ! [ -f .bashrc ]
then
	echo "Creating .bashrc..."
	cat > .bashrc <<EOF
alias ls='ls --color'
export PS1="${debian_chroot:+($debian_chroot)}\u@dz-main:\w\$ "
EOF
fi

# Uncomment the lines below to run things manually in the container, then run:
# docker compose exec main bash
tail -f /dev/null
exit 0

# Otherwise, start the server normally
cd /web
npm i
node index.js
