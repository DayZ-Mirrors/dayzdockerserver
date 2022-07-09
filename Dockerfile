FROM debian:bullseye

# Set debconf to run non-interactively and agree to the SteamCMD EULA
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections \
    && echo steam steam/question select "I AGREE" | debconf-set-selections \
    && echo steam steam/license note '' | debconf-set-selections \
    && dpkg --add-architecture i386

# Add contrib and backports
RUN sed -i /etc/apt/sources.list -e 's/main/main contrib non-free/'

RUN echo 'deb http://deb.debian.org/debian bullseye-backports main non-free' >> /etc/apt/sources.list

# Install _only_ the necessary packages
RUN apt-get update && apt-get -y upgrade && apt-get -y install --no-install-recommends \
    nano \
    curl \
    ca-certificates \
    git \
    jq \
    lib32gcc-s1 \
    lib32stdc++6 \
    libcurl4:i386 \
    libsdl2-2.0-0:i386  \
    libcap2 \
    locales \
    procps \
    python3-pip \
    wget \
    rename \
    steamcmd

RUN update-alternatives --install /usr/bin/python python /usr/bin/python3.9 1
RUN update-alternatives --install /usr/bin/pip pip /usr/bin/pip3 1

# Set the locale
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Add py3rcon
RUN cd /usr/local && git clone https://github.com/indepth666/py3rcon.git

# steamcmd ends up in /usr/games
ENV PATH /usr/games:/usr/local/py3rcon:${PATH}

# Setup a non-privileged user
RUN groupadd user && \
    useradd -l -g user user && \
    mkdir /home/user && \
    chown user:user /home/user

# Add the dayzserver to a directory in PATH. Might as well be /usr/games!
#ADD files/dayzserver /usr/games

# Use our non-privileged user
USER user

# The dayzserver script expects a home directory to itself.
WORKDIR /home/user

# Run the server.
CMD ["dayzserver", "start"]
