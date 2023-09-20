FROM denoland/deno:alpine

# The port that your application listens to.

WORKDIR /app
COPY . .

# Prefer not to run as root.
USER deno

COPY deps.ts .
RUN deno cache deps.ts
ADD . .

EXPOSE 1337
CMD ["run", "--allow-read", "--allow-env", "--allow-net", "index.ts"]
