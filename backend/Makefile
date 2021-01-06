.PHONY: all
all: words-alive

.PHONY: words-alive
words-alive:
	GO111MODULE=on go build -v ./cmd/words-alive

.PHONY: test
test:
	GO111MODULE=on go test -v ./...

.PHONY: lint
lint:
	find . -path '*/vendor/*' -prune -o -name '*.go' -type f -exec gofmt -l -d -s -e {} \;

.PHONY: lint\:fix
lint\:fix:
	find . -path '*/vendor/*' -prune -o -name '*.go' -type f -exec gofmt -l -d -s -e -w {} \;
