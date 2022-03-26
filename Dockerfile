FROM debian:bullseye

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Set debconf to run non-interactively
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# Add contrib and backports
RUN sed -i /etc/apt/sources.list -e 's/main/main contrib/'

#RUN echo 'deb http://deb.debian.org/debian bullseye-backports main' >> /etc/apt/sources.list

# Add 32 bit arch for steam crap
RUN dpkg --add-architecture i386

# Install necessary packages
RUN apt-get update && apt-get -y upgrade && apt-get -y install \
	nano \
	curl \
	lib32gcc-s1 \
	lib32stdc++6 \
    libcap2 \
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

# The volume needs to be owned by the user
RUN cd /home/user; rm -rf *; rm -rf .*; chown user:user /home/user -R

# Use our non-privileged user
USER user

# The dayzserver script expects a home directory to itself.
WORKDIR /home/user

# Run the server.
CMD ["/files/dayzserver", "start"]
