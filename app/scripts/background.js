chrome.runtime.onMessageExternal.addListener(
  function (request, sender, sendResponse) {
    if (request.method === "storage") {
      chrome.storage.local
        .get(request.key)
        .then(() => {
          item = item || {};
          sendResponse(response);
        })
        .catch((error) => {
          console.log("error on fetch", error);
          sendResponse(undefined);
        });
    }

    return true;
  },
);
