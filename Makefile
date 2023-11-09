.PHONY: help build

help:
	@cat $(firstword $(MAKEFILE_LIST))

build: \
	dist/index.js

dist/index.js: src/index.ts dist
	npx --no -- esbuild $< --bundle --platform=node --target=es2020 --format=cjs --outdir=dist

lint:
	npx --no -- eslint 'src/**/*.ts' --fix

test:
	npx --no -- jest

clean:
	rm -rf dist/index.js

dist:
	test -d $@ || mkdir $@
