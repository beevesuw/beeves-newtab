class BeevesConnector {
  constructor(
    beevesFileContents,
    beevesActionHandler,
    shouldLogInvoke = true,
    shouldLogIncomingMessages = true
  ) {
    // handlers should be like:
    // {'hotword' : hotword_fn, 'stt' : stt_fn, 'nlu'}

    this.beevesFileContents = beevesFileContents;
    this.beevesActionHandler = beevesActionHandler;
    this.shouldLogInvoke = shouldLogInvoke;
    this.shouldLogIncomingMessages = shouldLogIncomingMessages;
    this.registerSkillWithBackend();
    console.log("Created BeevesConnector");
  }

  async handleIncomingMessageFromBeeves(message, sender, sendResponse) {
    console.log(beevesConnector.shouldLogIncomingMessages);
    if (beevesConnector.shouldLogIncomingMessages)
      console.log(`BeevesConnector: got message: ${message}`);

    if (message["type"]) {
      try {
        switch (message["type"]) {
          case "beevesRPC":
            let invocationResult = await beevesConnector.invoke(message);
            return Promise.resolve(invocationResult);
            break;
          default:
            return Promise.resolve(
              console.log("BeevesConnector: no understood type in message")
            );
        }
      } catch (err) {
        console.log("BeevesConnector: messageHandler failed: " + err);
      }
    } else
      return Promise.resolve(
        console.log(
          "BeevesConnector: handleIncomingMessageFromBeeves: Message has no type field, skipping"
        )
      );
  }

  async registerSkillWithBackend() {
    let sending = await browser.runtime.sendMessage(
      "beeves@beeves.dev",
      //{'request' : 'registerSkillWithBackend', 'beevesFileContents' : this.beevesFileContents}
      this.beevesFileContents,
      {}
    );
  }

  async invoke(messageFromBeeves) {
    if (messageFromBeeves["functionName"]) {
      const functionName = messageFromBeeves["functionName"];
      if (this.beevesActionHandler[functionName]) {
        try {
          const result = this.beevesActionHandler[functionName].apply(
            globalThis,
            messageFromBeeves["arguments"]
          ); // is globalThis neessary?
          if (this.shouldLogInvoke) console.log("Invoke: " + JSON.stringify(result));
          return Promise.resolve(result);
        } catch (err) {
          console.log("BeevesConnector: invoke failed: " + err);
        }
      }
    }
  }

  createResponse(status, cardName = false){
    let response = new BeevesConnectorResponse(this.beevesFileContents, status, cardName);
    return response;
  }
}

class BeevesConnectorResponse {
  constructor(
      beevesFileContents,
      status,
      cardName = false
  ) {
      this.status = status;
      if(cardName){
          this.card = beevesFileContents["beeves"]["cards"][cardName];
      }
  }

  log(){
      console.log(this);
  }
}