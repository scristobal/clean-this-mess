# clean-this-mess

A simple utility to subscribe and run tasks before closing a nodejs program

## Usage

### Adding tasks to the exit queue

Import the `cleanup` function as a default ESM export, pass any function(s) (even asynchronous) that you want to run before the program exits.

```typescript
import cleanup from './src/index.ts';

cleanup(() => 'Goodbye 👋');
```

> Note: order of execution is not warrantied, if your functions are async they do not wait for each other, they are added to the micro task queue at once, eg. `Promise.all`

### Remove tasks from the exit queue

If you change your mind and want to remove a task, the `cleanup` function returns a undo method that can be called to remove the task.

```typescript
import cleanup from './src/index.ts';

const removeSayGoodbye = cleanup(() => 'Goodbye 👋');

removeSayGoodbye();
```
