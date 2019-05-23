// Documentation
// https://github.com/ethereum/wiki/wiki/JavaScript-API#web3fromwei


//1. Caricare web3 e lanciare la funzione startApp (che lavora come una main)
window.addEventListener('load', function() {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3js = new Web3(web3.currentProvider);
    } else {
        console.log('No web3? You should consider trying MetaMask!')
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    // Now you can start your app & access web3 freely:
    startApp()

});


//2. definisco la funzione startApp

var startApp = function () {

    //quando il documento è pronto
    $(document).ready(function () {

        var addressRow = $('#addressRow');


        //mostro in che rete siamo (sincrono)
        //uso una custom callback definita sotto.
        getNetwork(showNetwork);


        //chiama getBlockNumber per leggere il blocco corrente sulla rete in uso
        //ASINCRONO: OBBLIGATORIO USARE CALLBACK
        web3.eth.getBlockNumber(
            function (err, result) {
                //console.log(result);
                if (err != null) {
                    alert('There was an error reading block data.');
                } else {
                    //uso toDecimal per essere sicuro che sia un numero e lo mando alla funzione showblock
                    web3.toDecimal(result, showBlock(result));
                }
            });





        //controllo del form per mostrare il balance di un address
        $("#buttonSub").click(function () {
            addressRow.find(".addressBalanceError").text("");

            cAddress = document.getElementById("cAddress").value;
            //console.log(cAddress);

            //Verifico che sia un address valido (è sincrono e non serve callback)
            if (web3.isAddress(cAddress)) {
                //leggo il balance di un address (è asincrono e serve gestirlo con callback)
                web3.eth.getBalance(cAddress,

                    (err, result) => {

                        if (err != null) {
                            alert('There was an error fetching your accounts.');

                        } else {
                            //Trasformo il valore in wei decimali e lo mando a showBalance
                            web3.toDecimal(result, showBalance(result));
                        }
                    });

            }
            else {
                alert('There was an error fetching your accounts.');
                   addressRow.find(".addressBalanceError").html("" +
                       "<p class=\"text-danger\">This address is NOT valid!</p>");


            }
        });


    });
}


//


//3. funzioni di scrittura sulla pagina

var showBlock = function (value) {
    var blockRow = $('#blockRow');
    blockRow.find(".currentBlock").text(value);
}

var showNetwork = function (netstring) {
    var newtworkRow = $('#networkRow');
    newtworkRow.find(".network").html("<spam class=\"text-success\">"+netstring+"</spam>");
}

var showBalance = function (value) {
    var addressRow = $('#addressRow');
    addressRow.find(".addressBalance").text(value);
    //converto il numero in ether con fromWei
    addressRow.find(".addressBalanceEther").text(web3.fromWei(value,"ether"));

}


var getNetwork = function(callback) {
    var netString;
    web3.version.getNetwork(function(err, id) {
        switch (id){//(web3.version.getNetwork) {
            case "1":
                netString = 'mainnet';
                break;
            case "2":
                netString = 'deprecated Morden test';
                break;
            case "3":
                netString = 'ropsten test';
                break;
            case "4":
                netString = 'Rinkeby test';
                break;
            case "42":
                netString = 'Kovan test';
                break;
            default:
                netString = 'unknown';
        }
        callback(netString);

    });

}

