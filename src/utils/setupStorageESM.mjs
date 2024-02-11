// will only support chrome storage for now
export function setupStorageESM() {
  document.addEventListener("requestStorage", (event) => {
    const key = event.detail.key;
    const date = event.detail.date;
    const value = event.detail.value;
    const method = event.detail.method.split("-")[0];
    const eventType = event.type;
    if (!key || !date || !method || eventType != "requestStorage") return;

    const eventMethod = event.detail.method;

    console.log(`[${method} | ${key}] Using chrome.storage 🔵`);
    // maybe below is actually resolve(data && data[key]) - please check

    if (method == "setStorage") {
      chrome.storage.local.set({ [key]: value });
      return document.dispatchEvent(
        new CustomEvent(eventMethod, {
          detail: {
            key: key,
            value: value,
          },
        })
      );
    } else if (method == "getStorage") {
      return chrome.storage.local.get(key, (data) => {
        document.dispatchEvent(
          new CustomEvent(eventMethod, {
            detail: {
              key: key,
              value: data && data[key],
            },
          })
        );
      });
    }
  });
}
