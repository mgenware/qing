FROM golang:1.19.1

WORKDIR /qing/server
COPY . .
CMD ["go", "test", "./..."]
