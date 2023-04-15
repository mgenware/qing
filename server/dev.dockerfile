FROM golang:1.20.3

WORKDIR /qing/dev/server
CMD ["go", "run", "main.go"]
