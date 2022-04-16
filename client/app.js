console.log('App tasks Running');
App = {
    contracts: [],
    init: async () => {
        console.log('Loaded');
        await App.LoadEthereum();
        await App.loadContracts();
        await App.loadAccount();
        App.render();
        await App.renderTask();
    },
    LoadEthereum: async () => {
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed!');
            App.web3Provider = window.ethereum;
            // connect app with metamask wallet
            await App.web3Provider.request({ method: 'eth_requestAccounts'});
        } else if (window.web3) {
            web3 = new Web3(window.web3.currentProvider);
        }
        else {
            console.log('No Ethereum browser is installed.');
        }
    },
    loadContracts: async () => {
        const res = await fetch("TasksContract.json");
        const tasksContractJSON = await res.json();
        console.log(tasksContractJSON);
        App.contracts.taskContract = TruffleContract(tasksContractJSON);
        App.contracts.taskContract.setProvider(App.web3Provider)
        App.tasksContract = await App.contracts.taskContract.deployed()
    },

    loadAccount: async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
        App.account = accounts[0];
        console.log('ACCOUNT: ' + App.account );
    },

    render: () => {
        document.getElementById("account").innerText = App.account;
    },

    renderTask: async () => {
        const taskCounter = await App.tasksContract.nextId();
        console.log(taskCounter.toNumber());
        let html = '';
        for (let i = 1; i < taskCounter.toNumber(); i++) {
            const task = await App.tasksContract.tasks(i);
            const taskId = task[0];
            const taskTitle = task[1];
            const taskDescription = task[2];
            const taskDone = task[3];
            const taskCreated = task[4];
            let taskElement = `
                <div class="card bg-dark rounded-0 mb-0">            
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>${taskTitle}</span>
                        <div class="form-check form-switch ">
                        <input class="form-check-input" data-id="${taskId}" type="checkbox" ${taskDone && "checked" }
                         onchange="App.toggleDone(this)" />
                        </div>
                    </div>
                    <div>
                        <span>${taskDescription}</span>
                        <p class="text-muted">Task was created ${ new Date(taskCreated * 1000).toLocaleString() }</p>
                    </div>
                </div>
            `;
            html += taskElement;
        };

        document.querySelector('#tasksList').innerHTML = html;
    },

    createTask: async (title, description) => {
        const result = await App.tasksContract.createTask(title, description, { from: App.account});
        console.log(result.logs[0].args);
    }, 

    toggleDone: async (element) => {
        console.log(element.dataset.id);
        const taskId = element.dataset.id;
        await App.tasksContract.toggleDone(taskId, {
            from: App.account
        });
        window.location.reload();
    }
}

App.init()