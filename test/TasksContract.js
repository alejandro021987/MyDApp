const TasksContract = artifacts.require("TasksContract")

contract("TasksContract", () => {
    before(async () => {
        this.tasksContract = await TasksContract.deployed()
    })

    it('migrate deployed successfully', async () => {
        const address = this.tasksContract.address
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, '');
    })

    it('get tasks List', async () => {
        const taskCounter = await this.tasksContract.nextId();
        console.log('taskCounter:' + JSON.stringify(taskCounter));
        const task = await this.tasksContract.tasks(taskCounter);
        //console.log('title: ' + task.title);
        assert.equal(task.id.toNumber(), taskCounter);
        assert.equal(task.title, "my first task");
        assert.equal(task.description, "To do something.");
        assert.equal(task.done, false);
        assert.equal(taskCounter, 1);
    })

    it('task created successfully', async () => {
        const result = await this.tasksContract.createTask('some task', 'this is a description' );
        const taskEvent = result.logs[0].args;
        const taskCounter = await this.tasksContract.nextId();
        console.log('taskCounter:' + JSON.stringify(taskCounter));
        const task = await this.tasksContract.tasks(taskCounter);
        console.log(task.title);
        assert.equal(task.title, 'some task');
        assert.equal(task.description, 'this is a description');
        console.log('description: ' + task.description);
        assert.equal(taskEvent.id.toNumber(), 2);
        assert.equal(taskEvent.title, 'some task');
        assert.equal(taskCounter, 2);
    })

    it('test toggle it works', async () => {
        const taskCounter = await this.tasksContract.nextId();
        console.log('taskCounter:' + taskCounter.toNumber() );
        const taskFoundBefore = await this.tasksContract.tasks(taskCounter);
        console.log('BEFORE : taskFound.done: ' + taskFoundBefore.done);
        const result = await this.tasksContract.toggleDone(taskCounter);
        const taskEvent = result.logs[0].args;
        const taskFoundAfter = await this.tasksContract.tasks(taskCounter);
        console.log('AFTER : taskEvent.done: ' + taskEvent.done);
        console.log('AFTER : taskFoundAfter.done: ' + taskFoundAfter.done);
        assert.equal(taskEvent.id.toNumber(), taskCounter.toNumber());
        assert.equal(taskEvent.done, true);
        assert.equal(taskFoundAfter.done, true);
    });
})