FROM debian:bookworm-slim

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Set debconf to run non-interactively
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# Add backports and contrib
RUN sed -i /etc/apt/sources.list.d/debian.sources -e 's/Components: main/Components: main contrib non-free/g'

# Install _only_ the necessary packages
RUN apt-get update && apt-get -y upgrade && apt-get -y install --no-install-recommends \
    gwenhywfar-tools \
    jq \
    libxml2-utils \
    locales \
    nano \
    patch \
    procps \
    wget \
    xmlstarlet

# Set the locale
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Add our scripts directory to PATH
ENV PATH /files/bin:/server/bin:${PATH}

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

# Run the server. The use of both ENTRYPOINT and CMD is to allow for development mode.
ENTRYPOINT ["entrypoint.sh"]
CMD ["start.sh"]
