# clean-this-mess

A simple utility to subscribe and run tasks before closing a nodejs program

## Usage

Import the `cleanup` factory as a named ESM export. Upon calling it, `cleanup` creates a subscription. Pass any function (even asynchronous) that you want to run before the program exits.

```typescript
import { cleanup } from './src/index.ts';

const goodbye = cleanup();

goodbye(() => 'Goodbye 👋');
```

Note: order of execution is not warrantied, if your functions are async they do not wait for each other, they are added to the micro task queue at once, eg. `Promise.all`
