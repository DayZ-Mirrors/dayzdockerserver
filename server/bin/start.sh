#!/usr/bin/env bash

# Set PS1 so we know we're in the container, should we exec into it.
cat > .bashrc <<EOF
alias ls='ls --color'
export PS1="${debian_chroot:+($debian_chroot)}\u@dz-server:\w\$ "
EOF

# Start the server.
# If the DEVELOPMENT environment variable is set to 1, the container will just block and not start the server.
exec dz start
