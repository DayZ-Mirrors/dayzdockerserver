#!/usr/bin/env bash

# Set PS1 so we know we're in the container
if ! [ -f .bashrc ]
then
	echo "Creating .bashrc..."
	cat > .bashrc <<EOF
alias ls='ls --color'
export PS1="${debian_chroot:+($debian_chroot)}\u@dz-server:\w\$ "
EOF
fi

# Uncomment the line below to run things manually in the container, then run:
# docker compose exec main bash
tail -f /dev/null

# Otherwise, start the server normally
#/files/dayzserver start
