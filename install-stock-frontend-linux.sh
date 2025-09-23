#!/bin/bash
#
#
PROJECT=stock-frontend
PROFILE=linux
HOME_DIR=/home/andold
INSTALL_SCRIPT_FILE_NAME=install-$PROJECT-$PROFILE.sh
DEPLOY_SCRIPT_FILE_NAME=deploy-$PROJECT-$PROFILE.sh
SOURCE_DIR=$HOME_DIR/src/github/$PROJECT
#DEPLOY_DIR=$HOME_DIR/deploy/apache2
DEPLOY_DIR=$(pwd)
#
#
date
#
#
# source checkout
#
git config --global core.quotepath false
cd	$SOURCE_DIR
git config pull.rebase false
git config pull.ff only
git stash
git clean -f
git pull
git log --pretty=format:"%h - %an, %ai:%ar : %s" -8
#
#
# copy deploy script file
#
cp $SOURCE_DIR/$DEPLOY_SCRIPT_FILE_NAME	$DEPLOY_DIR
#
#
cd $DEPLOY_DIR
chmod a+x $DEPLOY_SCRIPT_FILE_NAME
bash $DEPLOY_SCRIPT_FILE_NAME
#
