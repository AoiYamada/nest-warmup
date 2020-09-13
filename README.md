## Installation

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

---

## Yarn setup:

```
sudo nano ~/.profile
```

add

```
# set PATH so it includes yarn bin if it exists
if [ -d "$HOME/.yarn/bin" ] ; then
    PATH="$HOME/.yarn/bin:$PATH"
fi
```

then

```
bash -l
```

## Extensions

[prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## CMD history:

```sh
yarn global add @nestjs/cli
nest new todo
mv ./todo/* ./
```
