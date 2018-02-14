#!/bin/bash
set -x
eval "$(ssh-agent -s)"
chmod 600 ~/.travis/id_rsa
ssh-add ~/.travis/id_rsa
if [[ $TRAVIS_BRANCH = 'master' ]]
    ssh deploy@$IP -p $PORT <<EOF
        cd /var/www/
        git clone https://github.com/partio-scout/tosu-frontend.git
        cd tosu-frontend
        sudo kill -9 $(lsof -i :3001 | grep node | awk '{print $2}' | sed -n '1p') 
        npm install
        npm run-script build
        rm -rf /var/www/html
        cp -a /var/www/tosu-frontend/build/. /var/www/html/
        sudo service tosu-backend start
        cd ..
        rm -rf tosu-frontend
    EOF
fi
