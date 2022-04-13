console.log('App tasks Running');
App = {
    contracts: [],
    init:() => {
        console.log('Loaded');
        App.LoadEthereum();
        App.loadContracts();
        App.loadAccount()
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
    },

    createTask: async (title, description) => {
        const result = await App.tasksContract.createTask(title, description, { from: App.account});
        console.log(result.logs[0].args);
    }
}

App.init()