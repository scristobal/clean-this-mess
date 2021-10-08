import { cleanup } from './index';

// @ts-ignore
jest.spyOn(process, 'exit').mockImplementation(() /** should return never */ => {});

describe('mock exit', () => {
    it('does not actually exit', () => {
        process.emit('exit', 0);
    });
});

describe('clean-this-mess 🧹 🧹 🧹 ', () => {
    it('calls a synchronous function after it is scheduled', () => {
        const task = jest.fn(() => {});

        const scheduler = cleanup();

        scheduler(task);

        process.emit('exit', 0);

        expect(task).toBeCalledTimes(1);
    });

    it('does NOT call a synchronous function if it was not scheduled', () => {
        const task = jest.fn(() => {});

        process.emit('exit', 0);

        expect(task).not.toBeCalled();
    });

    it('calls more than one scheduled function', () => {
        const task = jest.fn(() => {});
        const otherTask = jest.fn(() => {});

        const scheduler = cleanup();

        scheduler(task);
        scheduler(otherTask);

        process.emit('exit', 0);

        expect(task).toBeCalledTimes(1);
        expect(otherTask).toBeCalledTimes(1);
    });

    it('allows tasks to be unscheduled without affecting other scheduled tasks', () => {
        const task = jest.fn(() => {});
        const otherTask = jest.fn(() => {});

        const scheduler = cleanup();

        const remover = scheduler(task);

        scheduler(otherTask);

        remover();

        process.emit('exit', 0);

        expect(otherTask).toBeCalledTimes(1);
        expect(task).not.toBeCalled();
    });
});
