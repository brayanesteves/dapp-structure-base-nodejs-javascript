// const addressContract = '0xa76Cc8291228E3702879356766E32b20f06A7126';
// const addressContract = '0x04fbe96e0400cf6f00fd94721b5f0adb6bf2b738';
const addressContract = '0xA423771e5cae910cb0e986da20D37198108997e0';

// TODO: Incomplete
const abi = [{ "inputs": [{ "internalType":"string", "name":"name_", "type":"string" }, { "interbalType":"string", "name":"" }] }];

const Toast = Swal.mixin({
                toast:true,
             position:'bottom-end',
    showConfirmButton:false,
                timer:2000,
     timerProgressBar:false,
});

let web3;
let account;
let MyCoin;

function init() {
    if(typeof window.ethereum !== 'undefined') {
        const metamaskBtn = document.getElementById('enableEthereumButton');
        metamaskBtn.classList.remove('d-none');

        metamaskBtn.addEventListener('click', async () => {
            const accounts = await ethereum.request({ method:'eth_requestAccounts', });
            account = accounts[0];

            metamaskBtn.classList.add('d-none');
            document.getElementById('accountSelected').innerHTML = account;
            document.getElementById('accountSelected').classList.add('border');

            Toast.fire({
                 icon:'success',
                title:'Cuenta conectada',
            });

            detectChangeAccount();
            contract();

            document.getElementById('login').style.display = 'none';
            document.getElementById('main').classList.remove('d-none');
        });
    }
}

function detectChangeAccount() {
    window.ethereum.on('accountsChanged', function(accounts) {
        console.log(account);
        account = accounts[0];
        document.getElementById('accountSelected').innerHTML = account;

        Toast.fire({
            icon:'success',
           title:'Cuenta conectada',
       });
    });
}

function contact() {
    web3   = new Web3(window.ethereum);
    MyCoin = new web3.eth.Contract(abi, addressContract);

    interact();
}

function interact() {
    const btnGetBalance = document.getElementById('btnGetBalance');
    btnGetBalance.addEventListener('click', () => {
        const address = document.getElementById('addressGetBalance');
        const value   = address.value;

        MyCoin.methods.balanceOf(value).call().then((res) => {
            const amount    = web3.utils.fromWei(res, 'ether');
            const valueSpan = document.getElementById('balance');

            valueSpan.innerHTML = amount;
        });
    });

    const transfer = document.getElementById('transferir');
    transfer.addEventListener('click', () => {
        const address      = document.getElementById('addressBenediaria');
        const addressValue = address.value;

        const amount         = document.getElementById('cantidad');
        const amountString   = amount.value.toString();
        const amountTransfer = web3.utils.toWei(amountString, 'ether');

        MyCoin.methods.transfer(addressValue, amountTransfer).send({ from:account }).then((res) => {
            address.value = '';
            amount.value  = 0;

            Toast.fire({
                icon:'success',
               title:'Transferencia realizada',
           });
        });
    });
}

window.onload = init();