# Typescript over-inclusion of lib example

In recent days, it has become almost impossible to prevent TypeScript from over including libs this project is an minimal reproduction of the issue using a popular library `enzyme`.

## Reproduction Steps

```bash
npm install
npm run compile
```

Expected Behavior:
The compiler to throw an error because of the use of `BigInt` in [src/index.ts](src/index.ts)

Actual Behavior:
Code compiles without an error

## Root Cause

It appears like the problem is a result of the `@types/node` project adding [`<references lib="esnext.bigint" />`](https://github.com/DefinitelyTyped/DefinitelyTyped/commit/6e8dd401ba17be8b3941f48e03fc29a9495c5438#diff-6fc0ceb29b512e39a7cea31feba4ba5586b87d0d066336e02254ef7a4441fad7) (as well as es2018 and some others) to their base module deceleration export file.

Why is `@types/node` being included?

- The import of `enzyme` triggers the loading of its types
- The enzyme types import the [`cheerio` types](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/enzyme/index.d.ts#L20)
- Since Cheerio is designed to work in both node and the browser it imports the [`node` types](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/cheerio/index.d.ts#L14)

I have seen in the past arguments that this is a type definitions issue, but for this example the importing of node was brought up in an [issue](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34036) with `cheerio` two years ago, and the repository owners decided not to fix it because parts of cheerio do feature detection and have dependencies on the node types (which of course are not used in this case since enzyme is designed to be used in the browser).

## Workaround (or lack of)

The only work around that I am aware of is to duplicate the enzyme and cheerio types locally into a `.d.ts` file and in this local version remove cheerio's import of the node types.
