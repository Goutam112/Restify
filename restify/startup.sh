#!/bin/bash

sudo apt install python3-pip;

sudo apt install python3.8-venv;

python3 -m venv ./venv;

# Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted

# ./venv/Scripts/activate;


# cd ./venv/Scripts/;

# . activate;

source ./venv/bin/activate;

python3 -m pip install Django;

python3 -m pip install --upgrade pip;

python3 -m pip install --upgrade Pillow;

pip install djangorestframework;

pip install markdown;

pip install djangorestframework-simplejwt;

pip install django-apscheduler;


