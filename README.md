# Boilerplate Express Modular API with Deno

## Prepare Deno...


### On Windows...
Using PowerShell (Windows):
```bash
irm https://deno.land/install.ps1 | iex
```

### On macOS & Linux...
```bash
curl -fsSL https://deno.land/x/install/install.sh | sh
```

### Upgrade Deno...
```bash
deno upgrade
```

## Prepare Project...

install first : deno task install
run seed (MongoDB) : deno task seed

## Run Development...

run dev : deno task dev
run unit test (run app first on other terminal) : deno task test
run compile : deno task compile
