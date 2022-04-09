// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract TasksContract {
    uint public nextId = 0;

    constructor () {
        createTask("my first task", "To do something.");
    }
    event TaskCreated (
        uint256 id,
        string title,
        string description,
        bool done,
        uint createdAt
    );

    event TaskToggleDone(
        uint id,
        bool done
    );

    struct Task {
        uint256 id;
        string title;
        string description;
        bool done;
        uint createdAt;
    }
    //Task[] tasks;
    mapping (uint256 => Task) public tasks;

    function createTask(string memory _title , string memory _description ) public {
        //tasks.push(Task(nextId, _title, _description, false, block.timestamp));
        nextId++;
        tasks[nextId] = Task(nextId, _title, _description, false, block.timestamp);
        emit TaskCreated(nextId, _title, _description, false, block.timestamp);    
    }
    
    function toggleDone(uint _id) public {
        Task memory _task = tasks[_id];
        _task.done = !_task.done;
        tasks[_id] = _task;
        emit TaskToggleDone(_id, _task.done);
    }
    /*
    function findIndex(uint _id) internal view returns (uint){
        for (uint i=0; i < tasks.length; i++ ){
            if (tasks[i].id == _id ){
                return i;                
            }
        }
        
        revert("Task not found");
    }

    function readTask(uint _id) public view returns (uint, string memory, string memory) {
        uint index = findIndex(_id);
        return (tasks[index].id, tasks[index].name, tasks[index].description );
    }

    function updateTask(uint _id, string memory _name, string memory _description) public {
        uint index = findIndex(_id);
        tasks[index].name = _name;
        tasks[index].description = _description;
    }

    function deleteTask(uint _id) public {
        uint index = findIndex(_id);
        delete tasks[index];
    }
    */

}
