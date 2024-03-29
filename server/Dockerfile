FROM debian:bullseye

# Set debconf to run non-interactively and agree to the SteamCMD EULA
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# Add contrib and backports
RUN sed -i /etc/apt/sources.list -e 's/main/main contrib non-free/'

RUN echo 'deb http://deb.debian.org/debian bullseye-backports main non-free' >> /etc/apt/sources.list

# Install _only_ the necessary packages
RUN apt-get update && apt-get -y upgrade && apt-get -y install --no-install-recommends \
    curl \
    ca-certificates \
    git \
    gwenhywfar-tools \
    jq \
    libsdl2-2.0-0 \
    libcap2 \
    libxml2-utils \
    locales \
    nano \
    patch \
    python3 \
    procps \
    wget \
    xmlstarlet

RUN update-alternatives --install /usr/bin/python python /usr/bin/python3.9 1

# Set the locale
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Add our scripts directory to PATH
ENV PATH /files/bin:/server/bin:${PATH}

# Add py3rcon
RUN cd /usr/local && git clone https://github.com/indepth666/py3rcon.git

# Setup a non-privileged user
ARG USER_ID

RUN groupadd -g ${USER_ID} user && \
    useradd -l -u ${USER_ID} -m -g user user && \
    mkdir -p /home/user /serverfiles/mpmissions /mods /mpmissions /profiles && \
    chown -R user:user /home/user /serverfiles /mods /mpmissions /profiles

# Use our non-privileged user
USER user

# The dayzserver script expects a home directory to itself.
WORKDIR /home/user

# Run the server.
ENTRYPOINT ["entrypoint.sh"]
CMD ["start.sh"]
