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
    locales \
	psmisc \
	wget \
	rename

# Set the locale
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && \
    locale-gen
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Setup a non-privileged user
RUN groupadd user && \
    useradd -l -m -g user user

# Add the server script.
# From https://steamcommunity.com/sharedfiles/filedetails/?id=1517338673
ADD dayzserver /home/user

# Add the serverDZ.cfg from the same URL as above
ADD serverDZ.cfg /home/user

# Add our wrapper too
ADD server.sh /home/user

# Make sure the volumes can be written to by the local user
RUN cd /home/user && \
    mkdir -p serverfiles serverprofile Steam steamcmd

# Create the files the dayzserver script expects so we can take charge of populating them
RUN cd /home/user && touch .steamlogin

RUN cd /home/user && chown user:user /home/user -R

# Use our non-privileged user
USER user

# The dayzserver script expects a home directory to itself.
WORKDIR /home/user

# Run the server.
CMD ["./server.sh"]
