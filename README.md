# Observability-driven Hexagonal Architecture in TypeScript

This is a small example implementation to accompany a talk of the same name I originally gave at a [TampereJS](https://tamperejs.github.io/) meetup on 4.4.2024. The public slides are found in the repository root: [Observability-driven hexagonal architecture in TypeScript [public].pdf](/Observability-driven_hexagonal_architecture_in_TypeScript_public.pdf)

## Playing with it

With a modern enough ™️ Nodejs installed, install dependencies

```shell
npm i
```

Then you can run the very trivial view -> service -> connectors stack with

```shell
npx ts-node src/views/orderPaymentServiceCli.ts
```

With the default configuration everything works and it returns and reports a success. Then you can alter e.g. the connector return values to see how different errors are reported.
