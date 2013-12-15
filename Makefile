
NPM = $(shell which npm)

node_modules: package.json
	@npm prune
	@npm install

clean:
	@$(RM) -rf build
	@$(RM) -fr node_modules
	@$(RM) -fr npm-debug.log

test: node_modules
	@$(NPM) run test

.PHONY: clean test
