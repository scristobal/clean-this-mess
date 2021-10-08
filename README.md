# clean-this-mess

A simple utility to subscribe and run tasks before closing a nodejs program

## Usage

### Adding tasks to the exit queue

Import the `cleanup` factory as a named ESM export. Upon calling it, `cleanup` creates a subscription. Pass any function (even asynchronous) that you want to run before the program exits.

```typescript
import { cleanup } from './src/index.ts';

const scheduler = cleanup();

scheduler(() => 'Goodbye 👋');
```

Note: order of execution is not warrantied, if your functions are async they do not wait for each other, they are added to the micro task queue at once, eg. `Promise.all`

### Remove tasks from the exit queue

If you change your mind and want to remove a task from the schedule, the scheduler method returns a unscheduler method that can be called to remove the task from the scheduled list.

```typescript
import { cleanup } from './src/index.ts';

const scheduler = cleanup();

const sayGoodBye = () => 'Goodbye 👋';

const removeSayGoodbye = scheduler(sayGoodBye);

removeSayGoodbye();
```
