FROM golang:1.21.5

WORKDIR /qing/dev/server
CMD ["go", "run", "main.go"]
