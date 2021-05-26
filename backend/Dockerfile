FROM docker.io/alpine:3.12 AS builder

RUN apk --no-cache add \
    ca-certificates \
    go \
    make

ADD . /build

WORKDIR /build
RUN CGO_ENABLED=0 make

FROM scratch

COPY --from=builder /build/words-alive /words-alive
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
ADD ./migrations /migrations

USER 1000
ENV USER=1000
ENTRYPOINT ["/words-alive"]
