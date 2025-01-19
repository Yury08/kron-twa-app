import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";
import "./jetton_default_wallet";


@interface("org.ton.jetton.master")
trait Jetton with Ownable {
    totalSupply: Int;
    mintable: Bool;
    owner: Address;
    content: Cell?;

    receive(msg: TokenUpdateContent){
        self.requireOwner();
        self.content = msg.content;
    }

    receive(msg: TokenBurnNotification){
        self.requireWallet(msg.owner);
        self.totalSupply -= msg.amount;

        // Cashback
        if (msg.responseAddress != null) {
            send(SendParameters{
                to: msg.responseAddress!!,
                value: 0,
                bounce: false,
                mode: SendRemainingValue + SendIgnoreErrors,
                body: TokenExcesses{queryId: msg.queryId}.toCell()
            });
        }
    }

    fun mint(to: Address, amount: Int, responseAddress: Address?) {
        self.totalSupply += amount;
        let init: StateInit = self.getJettonWalletInit(to);
        let walletAddress: Address = contractAddress(init);
        send(SendParameters{
            to: walletAddress,
            value: 0,
            bounce: false,
            mode: SendRemainingValue,
            body: TokenTransferInternal{
                queryId: 0,
                amount: amount,
                from: myAddress(),
                responseAddress: responseAddress,
                forwardTonAmount: 0,
                forwardPayload: emptySlice()
            }.toCell(),
            code: init.code,
            data: init.data
        });
    }

    fun requireWallet(owner: Address) {
        let ctx: Context = context();
        let init: StateInit = self.getJettonWalletInit(owner);
        require(contractAddress(init) == ctx.sender, "Invalid sender");
    }

    virtual fun getJettonWalletInit(address: Address): StateInit {
        return initOf JettonDefaultWallet(myAddress(), address);
    }

    get fun get_wallet_address(owner: Address): Address {
        let init: StateInit = self.getJettonWalletInit(owner);
        return contractAddress(init);
    }

    get fun get_jetton_data(): JettonData {
        let code: Cell = self.getJettonWalletInit(myAddress()).code;
        return JettonData{
            totalSupply: self.totalSupply,
            mintable: self.mintable,
            owner: self.owner,
            content: self.content,
            walletCode: code
        }
    }
}

message Mint {
    amount: Int;
    receiver: Address;
}

contract SampleJetton with Deployable, Jetton {
    totalSupply: Int as coins;
    mintable: Bool;
    owner: Address;
    content: Cell?;

    // max_supply: Int as coins; 

    init(owner: Address, content: Cell?) {
        self.totalSupply = 0;
        self.owner = owner;
        self.mintable = true;
        self.content = content;

        // self.max_supply = max_supply;
    }

    receive(msg: Mint) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Not Owner");
        require(self.mintable, "Can't Mint Anymore");
        self.mint(msg.receiver, msg.amount, self.owner);
    }
}
