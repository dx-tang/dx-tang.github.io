#!/bin/bash

remote=linux.cs.uchicago.edu
remote_dir=/home/totemtang/html

scp index.html $remote:$remote_dir/
scp CV/* $remote:$remote_dir/CV/
scp paper/* $remote:$remote_dir/paper/

