#!/bin/bash

source ./venv/bin/activate;

python3 ./backend/manage.py makemigrations;

python3 ./backend/manage.py migrate;

python3 ./backend/manage.py runserver;