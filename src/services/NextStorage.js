export const NextStorage = {
  setItem(key, value) {
    return new Promise((resolve, reject) => {
      try {
        const date = Date.now();
        const event = new CustomEvent("requestStorage", {
          detail: {
            method: `setStorage-${key}-${date}`,
            date: date,
            key: key,
            value: value,
          },
        });
        document.addEventListener(`setStorage-${key}-${date}`, (evt) => {
          resolve(evt.detail.value);
        });
        document.dispatchEvent(event);
      } catch (err) {
        console.error(err);
      }
    });
  },
  getItem(key) {
    return new Promise((resolve, reject) => {
      try {
        const date = Date.now();
        const event = new CustomEvent("requestStorage", {
          detail: {
            method: `getStorage-${key}-${date}`,
            key: key,
            date: date,
          },
        });
        document.addEventListener(`getStorage-${key}-${date}`, (evt) => {
          resolve(evt.detail.value);
        });
        document.dispatchEvent(event);
      } catch (err) {
        console.error(err);
      }
    });
  },
};
