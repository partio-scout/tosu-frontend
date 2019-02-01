#!/bin/bash
set -x
eval "$(ssh-agent -s)"
chmod 600 ~/.travis/id_rsa
ssh-add ~/.travis/id_rsa
ssh ubuntu@$IP <<EOF
    if [[ $TRAVIS_BRANCH = 'master' ]]
    then
        cd ~
        git clone https://github.com/partio-scout/tosu-frontend.git
        cd tosu-frontend
        npm install
        npm run-script build
        rm -rf /var/www/html
        cp -a ~/tosu-frontend/build/. /var/www/html/
        cd ..
        rm -rf tosu-frontend
	echo "Done"
    fi
EOF
