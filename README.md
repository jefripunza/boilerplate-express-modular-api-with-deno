# :rocket: Boilerplate Express Modular API with Deno

I created this service for research and development purposes regarding Deno and JavaScript as well as several tools such as RabbitMQ, Redis, and MongoDB. The case study I use is E-Commerce.

Demo : [https://boilerplate-express-modular-deno.jefriherditriyanto.com/swagger](https://boilerplate-express-modular-deno.jefriherditriyanto.com/swagger)

## :paperclip: Menu

- :bulb: [Features](#bulb-features)
- :hammer: [Project Setup](#hammer-project-setup)
- :bug: [Known Bugs](https://github.com/jefripunza/boilerplate-express-modular-api-with-deno/issues)

---

## :bulb: Features

| Tech     | link                                                                                       | Description                                                                                                                      |
|----------|--------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| Deno     | [doc](https://docs.deno.com/runtime/tutorials/how_to_with_npm/express/ "Express for Deno") | environment javascript language base on rust                                                                                     |
| Express  | [doc](https://expressjs.com/en/guide/routing.html "Express Tutorial")                      | Fast, unopinionated, minimalist web framework for Node.js                                                                        |
| MongoDB  | [doc](https://www.mongodb.com/ "MongoDB Homepage")                                         | cross-platform document-oriented database system. Classified as a "NoSQL" database                                               |
| Mongoose | [doc](https://mongoosejs.com/docs/guide.html "Mongoose Tutorial")                          | provides a straight-forward, schema-based solution to model your application data                                                |
| RabbitMQ | [doc](https://www.rabbitmq.com/#getstarted "RabbitMQ Installation")                        | the most widely deployed open source message broker.                                                                             |
| Redis    | [doc](https://redis.io/docs/getting-started/ "Redis Documentation")                        | The open source, in-memory data store used by millions of developers as a database, cache, streaming engine, and message broker. |
| SocketIO | [doc](https://socket.io/ "SocketIO Homepage")                                              | Bidirectional and low-latency communication for every platform                                                                   |

<br/>


## :hammer: Project Setup

### #Prepare Deno!

#### On Windows...
Using PowerShell (Windows):
```bash
irm https://deno.land/install.ps1 | iex
```


#### On macOS & Linux...
```bash
curl -fsSL https://deno.land/x/install/install.sh | sh
```


#### Upgrade Deno...
```bash
deno upgrade
```

### #Prepare Project!

1. Clone this repo `git clone https://github.com/jefripunza/boilerplate-express-modular-api-with-deno`
2. Open **VSCode** and open folder project
3. install first :
```bash
deno task install
```
4. run seed (MongoDB) : 
```bash
deno task seed
```


### #Run Development!

run app dev : 
```bash
deno task dev
```

run unit test (run app first on other terminal) : 
```bash
deno task test
```

run compile : 
```bash
deno task compile
```


### #Prepare Production!

- you can change in Dockerfile on ENV=development to ENV=production
- change git action what do you need

<br/>

## 💫 License

- Code and Contributions have **MIT License**

_Copyright (c)
2023 [Jefri Herdi Triyanto](http://github.com/jefripunza "My Github") ([@jefripunza](https://instagram.com/jefripunza "My Instagram"))_
