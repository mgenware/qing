FROM golang:1.18.3

WORKDIR /qing/server
COPY . .
CMD ["go", "test", "./..."]
