import { log } from 'console';
import chalk from 'chalk';

const { yellowBright, redBright, red } = chalk;

type Task = () => void | Promise<void>;

const cleanup = () => {
    const tasks: Task[] = [];

    process.on('exit', async () => {
        log(yellowBright(`\nRunning ${tasks.length} scheduled tasks... : 🧹 `));

        await Promise.all(tasks.map(async (task) => await task()));

        process.exit();
    });

    process.on('SIGINT', () => {
        log(redBright(`\nGracefully shutting down from SIGINT (Ctrl-C)`));
        process.exit(2);
    });

    process.on('uncaughtException', (error) => {
        console.log(red(`\nExiting not so gracefully due to an uncaught Exception...`));
        console.log(error.stack);
        process.exit(99);
    });

    return function schedule(task: Task) {
        tasks.push(task);

        return () => tasks.pop();
    };
};

export { cleanup };
