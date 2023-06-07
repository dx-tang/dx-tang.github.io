#!/bin/bash

#remote=linux.cs.uchicago.edu
remote=watson.millennium.berkeley.edu
#remote_dir=/home/totemtang/html
remote_dir=/home/eecs/totemtang/public_html

#scp icon.png $remote:$remote_dir/
scp *.html $remote:$remote_dir/
#scp CV/* $remote:$remote_dir/CV/
scp paper/* $remote:$remote_dir/paper/
#scp css/* $remote:$remote_dir/css/
#scp img/* $remote:$remote_dir/img/
#scp fonts/* $remote:$remote_dir/fonts/
scp js/w3.js $remote:$remote_dir/js/

