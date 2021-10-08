import cleanup from './index';

const mockExit = jest.spyOn(process, 'exit');

jest.mock('console', () => ({ log: () => {} }));

beforeEach(() => {
    mockExit
        .mockReset() // @ts-ignore
        .mockImplementationOnce(() => {
            process.emit('exit', 0);
        }) // @ts-ignore
        .mockImplementation(() => {});
});

describe('mock exit', () => {
    it('does not actually exit', () => {
        process.exit(0);

        // @ts-ignore: code is actually reachable
        expect(mockExit).toBeCalledTimes(1);
    });
});

describe('clean-this-mess 🧹 🧹 🧹 ', () => {
    it('calls a synchronous function after it is scheduled', () => {
        const task = jest.fn(() => {});

        cleanup(task);

        process.exit(0);

        // @ts-ignore: code is actually reachable
        expect(task).toBeCalledTimes(1);
        // @ts-ignore: code is actually reachable
        expect(mockExit).toBeCalledTimes(1);
    });

    it('does NOT call a synchronous function if it was not scheduled', () => {
        const task = jest.fn(() => {});

        process.exit(0);

        // @ts-ignore: code is actually reachable
        expect(task).not.toBeCalled();
        // @ts-ignore: code is actually reachable
        expect(mockExit).toBeCalledTimes(1);
    });

    it('calls more than one scheduled function', () => {
        const task = jest.fn(() => {});
        const otherTask = jest.fn(() => {});

        cleanup(task);
        cleanup(otherTask);

        process.exit(0);

        // @ts-ignore: code is actually reachable
        expect(task).toBeCalledTimes(1);
        // @ts-ignore: code is actually reachable
        expect(otherTask).toBeCalledTimes(1);
        // @ts-ignore: code is actually reachable
        expect(mockExit).toBeCalled();
    });

    it('allows tasks to be unscheduled without affecting other scheduled tasks', () => {
        const task = jest.fn(() => {});
        const otherTask = jest.fn(() => {});

        const remover = cleanup(task);

        cleanup(otherTask);

        remover();

        process.exit(0);

        // @ts-ignore: code is actually reachable
        expect(otherTask).toBeCalledTimes(1);
        // @ts-ignore: code is actually reachable
        expect(task).not.toBeCalled();
        // @ts-ignore: code is actually reachable
        expect(mockExit).toBeCalled();
    });

    it('does not call functions prematurely', () => {
        const task = jest.fn(() => {});

        cleanup(task);

        expect(task).not.toBeCalled();

        process.exit(0);

        // @ts-ignore: code is actually reachable
        expect(task).toBeCalled();
        // @ts-ignore: code is actually reachable
        expect(mockExit).toBeCalled();
    });

    it('waits for promises to complete', (done) => {
        const asyncTask = jest.fn(
            async () =>
                new Promise<void>(() => {
                    setTimeout(() => {
                        done();
                    }, 100);
                })
        );

        cleanup(asyncTask);

        expect(asyncTask).not.toBeCalled();

        process.exit(0);

        // @ts-ignore: code is actually reachable
        expect(asyncTask).toBeCalled();
        // @ts-ignore: code is actually reachable
        expect(mockExit).toBeCalled();
    });
});

afterAll(() => {
    mockExit.mockRestore();
});
