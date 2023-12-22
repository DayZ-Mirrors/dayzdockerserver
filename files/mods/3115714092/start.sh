#!/usr/bin/env bash

# This is run in the directory with the target files

# Remove static trains
xmlstarlet ed -L -d '//eventposdef/event[@name="StaticTrain"]' cfgeventspawns.xml

# Remove spawn locations of former trains to prevent floating loot on tracks
xmlstarlet ed -L -d '//map/group[starts-with(@name,"Land_Train_")]' mapgrouppos.xml
