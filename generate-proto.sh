#!/bin/bash

for protofile in proto/*.proto; do
    base_name=$(basename "$protofile" .proto)  # Ambil nama dasar dari file tanpa ekstensi
    deno run --allow-read https://deno.land/x/grpc_basic@0.4.7/gen/dts.ts "$protofile" > "proto/${base_name}.d.ts"
done