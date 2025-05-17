#!/bin/bash

# This file contains commands that should be run only once upon container creation.

# Install tools
sudo apt update -y

# allow ** globs in bash
shopt -s globstar