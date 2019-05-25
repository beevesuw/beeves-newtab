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

    browser.runtime.onInstalled.addListener(this.registerSkillWithBackend);
    browser.runtime.onMessageExternal.addListener(
      this.handleIncomingMessageFromBeeves
    );
    console.log("Created BeevesConnector");
  }

  async handleIncomingMessageFromBeeves(message, sender, sendResponse) {
    if (this.shouldLogIncomingMessages)
      console.log("BeevesConnector: got message: " + invocationResult);

    if ("type" in message) {
      try {
        switch (message["type"]) {
          case "beevesRPC":
            let invocationResult = await this.invoke(message);
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
    if ("functionName" in this.messageFromBeeves) {
      const functionName = this.messageFromBeeves["functionName"];
      if (functionName in this.beevesActionHandler) {
        try {
          const result = this.beevesActionHandler[functionName].apply(
            globalThis,
            message["arguments"]
          ); // is globalThis neessary?
          if (this.shouldLogInvoke) console.log("Invoke: " + result);
          return Promise.resolve(result);
        } catch (err) {
          console.log("BeevesConnector: invoke failed: " + err);
        }
      }
    }
  }
}
