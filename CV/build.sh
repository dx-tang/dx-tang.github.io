#!/bin/bash
set -euo pipefail

node build-cv.mjs
xelatex cv_tang.tex
xelatex cv_tang.tex
rm cv_tang.log
rm cv_tang.out
rm cv_tang.aux
rm -f cv_tang.fdb_latexmk
rm -f cv_tang.fls
