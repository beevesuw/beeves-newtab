//import BeevesConnector from "./BeevesConnector";

async function getJSONData(endpoint) {
  try {
    let res = await fetch(endpoint);
    res = await res.json();
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
}

let beevesActionHandler = {
  test: args => {
    console.log(`beevesRPC works! data: ${args}`);
    return true;
  },
  newTab: (room, color) => {
    const creating = browser.tabs.create({
      url: "https://example.org"
    });
    console.log("creating new tab!");
    response = beevesConnector.createResponse(0, 'confirmation');
    return response;
  }
};

async function initializeNewTabExtension() {
  const beevesFileEndpoint = browser.runtime.getURL("beeves.json");
  let beevesJSON = await getJSONData(beevesFileEndpoint);
  beevesConnector = new BeevesConnector(beevesJSON, beevesActionHandler);
  browser.runtime.onMessageExternal.addListener(
    beevesConnector.handleIncomingMessageFromBeeves
  );
}

let beevesConnector;
initializeNewTabExtension();
