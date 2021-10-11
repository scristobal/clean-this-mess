import { log } from 'console';

type Task = () => void | Promise<void>;

const cleanup = function () {
    const tasks: Task[] = [];

    process.on('exit', () => {
        log(`\nRunning ${tasks.length} scheduled tasks... : 🧹 `);

        async function runAsyncQueue() {
            await Promise.all(tasks.map(async (task) => await task()));

            process.exit(0);
        }

        runAsyncQueue();
    });

    process.on('SIGINT', () => {
        log(`\nGracefully shutting down from SIGINT (Ctrl-C)`);
        process.exit(2);
    });

    process.on('SIGTERM', () => {
        log(`\nGracefully shutting down from SIGTERM (Ctrl-C)`);
        process.exit(15);
    });

    process.on('uncaughtException', (error) => {
        console.log(`\nExiting not so gracefully due to an uncaught Exception...`);
        console.log(error.stack);
        process.exit(99);
    });

    function schedule(task: Task) {
        const index = tasks.push(task) - 1;

        return () => {
            tasks.splice(index, 1);
        };
    }

    Object.defineProperty(schedule, 'size', { get: () => tasks.length });
    Object.defineProperty(schedule, 'empty', { get: () => () => (tasks.length = 0) });

    return schedule as ((task: Task) => () => void) & { size: number; empty: () => void };
}.call(undefined);

export default cleanup;
