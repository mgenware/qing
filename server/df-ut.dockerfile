FROM golang:1.19.0

WORKDIR /qing/server
COPY . .
CMD ["go", "test", "./..."]
