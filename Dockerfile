FROM denoland/deno:alpine AS builder

WORKDIR /app
COPY . .

RUN deno compile --allow-read --allow-write --allow-net --allow-env --allow-sys --output run index.ts

# ===================================================================================================== #
# ===================================================================================================== #
# ===================================================================================================== #

FROM ubuntu

WORKDIR /app
COPY --from=builder /app/run .
COPY .env .env
COPY assets assets

RUN sed -i 's/localhost/host.docker.internal/g' .env

EXPOSE 1337
CMD ["./run"]
