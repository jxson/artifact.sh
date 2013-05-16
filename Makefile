
build:
	./node_modules/haiku/bin/haiku build

deploy: build
	node deploy.js
