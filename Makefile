MAKEFLAGS += --warn-undefined-variables
PATH := node_modules/.bin:$(PATH)
SHELL := /bin/bash

.SHELLFLAGS := -eu -o pipefail -c
.DEFAULT_GOAL := all
.DELETE_ON_ERROR:
.SUFFIXES:

.PHONY:
node_modules: package.json
	@npm prune
	@npm install
	@touch $@

.PHONY:
clean:
	@$(RM) -fr node_modules
	@$(RM) -fr npm-debug.log
	@$(RM) -rf build
	@$(RM) -fr coverage

.PHONY: test
test: node_modules
	tape test/index.js

.PHONY: coverage
coverage: browser/main.js test/index.js node_modules
	@istanbul cover --report html --print detail ./test/index.js
	@touch coverage

.PHONY: coveralls
coveralls: coverage
	@istanbul report lcov && (cat coverage/lcov.info | coveralls)

.PHONY: travis
travis: test coveralls
