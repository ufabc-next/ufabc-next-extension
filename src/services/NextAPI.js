import Axios from "axios";

function resolveEndpoint(env) {
  return (
    {
      development: "http://localhost:8011/v1",
      staging: "https://ufabc-matricula-test.cdd.naoseiprogramar.com.br/v1",
      prod: "https://api.ufabcnext.com/v1",
    }[env] || "http://localhost:8011/v1"
  );
}

export class NextAPI {
  static #nextApiInstance;
  #baseURL = resolveEndpoint(process.env.NODE_ENV);
  #REQUEST_TIMEOUT = 5_000;
  #DEFAULT_HEADERS = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  static nextInstance() {
    if (!NextAPI.#nextApiInstance) {
      NextAPI.#nextApiInstance = new NextAPI();
    }

    return NextAPI.#nextApiInstance;
  }

  init() {
    const nextApi = Axios.create({
      baseURL: this.#baseURL,
      timeout: this.#REQUEST_TIMEOUT,
      headers: this.#DEFAULT_HEADERS,
    });

    return nextApi;
  }
}
