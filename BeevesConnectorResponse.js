class BeevesConnectorResponse {
    constructor(
        beevesFileContents,
        status,
        cardName = false
    ) {
        this.status = status;
        if(cardName){
            this.card = beevesFileContents["cards"][cardName];
        }
    }

    log(){
        console.log(this);
    }
}