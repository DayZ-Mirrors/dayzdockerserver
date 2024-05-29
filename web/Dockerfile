FROM debian:bookworm-slim

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Set debconf to run non-interactively and agree to the SteamCMD EULA
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections \
    && echo steam steam/question select "I AGREE" | debconf-set-selections \
    && echo steam steam/license note '' | debconf-set-selections \
    && dpkg --add-architecture i386

# Add backports and contrib
RUN sed -i /etc/apt/sources.list.d/debian.sources -e 's/Components: main/Components: main contrib non-free/g'

# Install _only_ the necessary packages
RUN apt-get update && apt-get -y upgrade && apt-get -y install --no-install-recommends \
    binutils \
    curl \
    gwenhywfar-tools \
    jq \
    libxml2-utils \
    locales \
    nano \
    procps \
    wget \
    rename \
    steamcmd \
    xmlstarlet

# Set the locale
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Steamcmd needs its path added, as it ends up in /usr/games.
# Our server script is bind mounted in /files in docker-compose.
ENV PATH /usr/games:/files/bin:/web/bin:${PATH}

# Install nodejs
RUN mkdir /usr/local/nvm
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 20.12.2
RUN echo $NODE_VERSION

# Install nvm with node and npm
RUN wget -O - https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Setup a non-privileged user
ARG USER_ID

RUN groupadd -g ${USER_ID} user && \
    useradd -l -u ${USER_ID} -m -g user user && \
    mkdir -p /home/user /serverfiles/mpmissions /serverfiles/steamapps/workshop/content /web && \
    chown -R user:user /home/user /serverfiles /web

# Shut steamcmd up
RUN cd /usr/lib/i386-linux-gnu && ln -s /web/bin/steamservice.so

# Add bercon https://github.com/WoozyMasta/bercon
RUN wget https://github.com/WoozyMasta/bercon/releases/download/1.0.0/bercon \
    && chmod +x bercon \
    && mv bercon /usr/bin

# Use our non-privileged user
USER user

# The dayzserver script expects a home directory to itself.
WORKDIR /home/user

# Run the web server
ENTRYPOINT ["entrypoint.sh"]
CMD ["start.sh"]
