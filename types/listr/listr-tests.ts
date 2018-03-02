import * as Listr from "listr";
import * as fs from "fs";

const tasks = new Listr([
    {
        title: 'Git',
        task: () => {
            return new Listr([
                {
                    title: 'Checking git status',
                    task: () => new Promise(resolve => resolve())
                        .then(result => {
                        if (result !== '') {
                            throw new Error('Unclean working tree. Commit or stash changes first.');
                        }
                    })
                },
                {
                    title: 'Checking remote history',
                    task: () => new Promise(resolve => resolve())
                        .then(result => {
                        if (result !== '0') {
                            throw new Error('Remote history differ. Please pull changes.');
                        }
                    })
                }
            ],
            { concurrent: true });
        }
    },
    {
        title: 'Install package dependencies with Yarn',
        task: (ctx, task) => new Promise(resolve => resolve())
            .catch(() => {
                ctx.yarn = false;

                task.skip('Yarn not available, install it via `npm install -g yarn`');
            })
    },
    {
        title: 'Install package dependencies with npm',
        enabled: ctx => ctx.yarn === false,
        task: () => new Promise(resolve => resolve())
    },
    {
        title: 'Run tests',
        task: () => new Promise(resolve => resolve())
    },
    {
        title: 'Publish package',
        task: () => new Promise(resolve => resolve())
    }
]);

tasks.run().catch(err => {
});

const tasks2 = new Listr([
    {
        title: 'Success',
        task: () => 'Foo'
    },
    {
        title: 'Failure',
        task: () => {
            throw new Error('Bar');
        }
    }
]);

const tasks3 = new Listr([
    {
        title: 'Success',
        task: () => Promise.resolve('Foo')
    },
    {
        title: 'Failure',
        task: () => Promise.reject(new Error('Bar'))
    }
]);

const tasks4 = new Listr([
    {
        title: 'File',
        task: () => fs.createReadStream('data.txt', 'utf8')
    }
]);

const tasks5 = new Listr([
    {
        title: 'Task 1',
        task: () => Promise.resolve('Foo')
    },
    {
        title: 'Can be skipped',
        skip: () => {
            if (Math.random() > 0.5) {
                return 'Reason for skipping';
            }
        },
        task: () => 'Bar'
    },
    {
        title: 'Task 3',
        task: () => Promise.resolve('Bar')
    }
]);

const tasks6 = new Listr([
    {
        title: 'Install package dependencies with Yarn',
        task: (ctx, task) => new Promise(resolve => resolve())
            .catch(() => {
                ctx.yarn = false;

                task.skip('Yarn not available, install it via `npm install -g yarn`');
            })
    },
    {
        title: 'Install package dependencies with npm',
        enabled: ctx => ctx.yarn === false,
        task: () => new Promise(resolve => resolve())
    }
]);

const tasks7 = new Listr([
    {
        title: 'Task 1',
        skip: ctx => ctx.foo === 'bar',
        task: () => Promise.resolve('Foo')
    },
    {
        title: 'Can be skipped',
        skip: () => {
            if (Math.random() > 0.5) {
                return 'Reason for skipping';
            }
        },
        task: ctx => {
            ctx.unicorn = 'rainbow';
        }
    },
    {
        title: 'Task 3',
        task: ctx => Promise.resolve(`${ctx.foo} ${ctx.bar}`)
    }
]);

tasks.run({
    foo: 'bar'
}).then(ctx => {
    console.log(ctx);
});
