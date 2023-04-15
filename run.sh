#!/bin/bash

source ~/.nvm/nvm.sh

source ~/.profile

source ~/.bashrc

nvm use 18;

cd frontend;

npm install;

npm start &

cd ../backend/restify;

source ./venv/bin/activate;

python3 ./manage.py makemigrations;

python3 ./manage.py migrate;

python3 ./manage.py runserver;