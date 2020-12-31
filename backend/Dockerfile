FROM alpine:3.12 AS builder

RUN apk --no-cache add \
    go \
    make

ADD . /build

WORKDIR /build
RUN CGO_ENABLED=0 make

FROM scratch

COPY --from=builder /build/words-alive /words-alive
COPY ./migrations /migrations

USER 1000
ENV USER=1000
CMD ["/words-alive"]
