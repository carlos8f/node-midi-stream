REPORTER = spec

test:
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter $(REPORTER) --timeout 20000

.PHONY: test
