FROM debian:bookworm

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Set debconf to run non-interactively
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# Add contrib and backports
RUN sed -i /etc/apt/sources.list -e 's/main/main contrib/'

RUN echo 'deb http://deb.debian.org/debian bookworm-backports main' >> /etc/apt/sources.list

# Add 32 bit arch for steam crap
RUN dpkg --add-architecture i386

# Install necessary packages
RUN apt-get update && apt-get -y upgrade && apt-get -y install \
	tmux \
	nano \
	htop \
	curl \
	lib32gcc-s1 \
	lib32stdc++6 \
	psmisc \
	wget \
	rename

# Setup a non-privileged user
RUN groupadd -g 1000 user && \
    useradd -l -u ${USER_ID} -m -g user user

RUN chown user:user /home/user -R

USER ${USER_ID}

WORKDIR /work

COPY . /home/user

CMD ["server.sh"]
