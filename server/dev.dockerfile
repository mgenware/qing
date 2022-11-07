FROM golang:1.19.1

WORKDIR /qing/dev/server
CMD ["go", "run", "main.go"]
