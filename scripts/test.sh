#!/bin/bash

yarn wait-then-test
if [ $? -eq 0 ]
then
  kill -9 $(lsof -t -i:5050)
  exit 0
else
  kill -9 $(lsof -t -i:5050)
  exit 1
fi
