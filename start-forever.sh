source ./env
PORT=$EARTHQUAKES_PORT forever -a --uid earthquakes.benjie.me start bin/www
