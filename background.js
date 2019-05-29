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

async function postData(endpoint, payload) {
  try {
    let res = await fetch(endpoint, {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    res = await res.json();
    //log(res);
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
