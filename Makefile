setup: install db-migrate

install:
	npm install

db-migrate:
	npx knex migrate:latest

build:
	npm run build

prepare:
	touch .env

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
	
test-coverage:
	npm test -- --coverage --coverageProvider=v8
