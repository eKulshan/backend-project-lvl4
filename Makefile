setup: install

install:
	npm install

build:
	npm run build

start:
	heroku local -f Procfile

start-backend:
	npx nodemon --exec npx babel-node server/bin/server.js

start-frontend:
	npx webpack serve

lint:
	npx eslint .

test:
	npm test -s
