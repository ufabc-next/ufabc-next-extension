import Axios from "axios";
import _ from "lodash";
import $ from "jquery";

import { NextAPI } from "./NextAPI";
import { toJSON } from "../utils/toJSON";
import { NextStorage } from "./NextStorage";

export const disciplinas_mudadas = {
  "Energia: Origens, Conversão e Uso": "Bases Conceituais da Energia",
  "Transformações nos Seres Vivos e Ambiente":
    "Biodiversidade: Interações entre organismos e ambiente",
  "Transformações Bioquímicas":
    "Bioquímica: Estrutura, Propriedade e Funções de Biomoléculas",
  "Origem da Vida e Diversidade dos Seres Vivos":
    "Evolução e Diversificação da Vida na Terra",
};

class UFABCMatricula {
  #matriculasURL =
    {
      dev: "http://localhost:8011/snapshot/assets/todasDisciplinas.js",
      prod: "https://matricula.ufabc.edu.br/cache/matriculas.js",
    }[process.env.NODE_ENV] || "http://localhost:8011/v1";
  #nextApi = NextAPI();

  constructor() {}

  // fetch matriculas again
  async #getMatriculas() {
    const disciplinas = await Axios.get(this.#matriculasURL);
    return toJSON(disciplinas.data) || {};
  }

  // check if we need to update our localStorage of professors
  // based when you did this last request
  async getProfessors() {
    try {
      const { data: professors } = await this.#nextApi.get("/disciplinas");
      await NextStorage.setItem("ufabc-extension-last", Date.now());
      await NextStorage.setItem("ufabc-extension-disciplinas", professors);
      return professors;
    } catch (e) {
      console.log("❌ Erro ao atualizar disciplinas");
      console.error(e);
    }
  }

  // fetch professors url and save them into localStorage
  async updateProfessors(lastUpdate) {
    const timeDiff = (Date.now() - lastUpdate) / (1000 * 60);

    await this.getProfessors();

    if (!lastUpdate || timeDiff > 0.2) {
      await this.getProfessors();
    }
  }

  // get matriculas by aluno_id
  async getMatriculasAluno(aluno_id) {
    const matriculas = await this.#getMatriculas();
    return _.get(matriculas, aluno_id);
  }

  // get current logged student
  getAlunoId() {
    let toReturn = null;

    $("script").each(function () {
      var inside = $(this).text();
      var test = "todasMatriculas";
      if (inside.indexOf(test) != -1) {
        var regex = /matriculas\[(.*)\]/;
        var match = regex.exec(inside);
        toReturn = parseInt(match[1]);
      }
    });

    return toReturn;
  }

  // find courseId for this season
  #findIdForCurso(name) {
    if (
      _.camelCase(name) == _.camelCase("Bacharelado em Ciências da Computação")
    ) {
      name = "Bacharelado em Ciência da Computação";
    }
    // normalize to camelCase
    name = _.camelCase(name);

    // check which row matches the name passed
    const course = $("#curso")
      .children()
      .filter(function (i, item) {
        return name == _.camelCase($(item).text());
      })[0];

    return $(course).val();
  }

  currentUser() {
    return $("#usuario_top")
      .text()
      .replace(/\s*/, "")
      .split("|")[0]
      .trim()
      .toLowerCase();
  }

  // send aluno data
  async sendAlunoData() {
    const storageUser = "ufabc-extension-" + this.currentUser();
    const storageRA = "ufabc-extension-ra-" + this.currentUser();
    const user = await NextStorage.getItem(storageUser);
    const ra = await NextStorage.getItem(storageRA);

    if (!user) return;

    // remove as disciplinas cursadas
    for (var i = 0; i < user.length; i++) {
      delete user[i].cursadas;
    }

    await this.#nextApi.post("/students", {
      aluno_id: this.getAlunoId(),
      cursos: user.map((info) => {
        info.curso_id = this.#findIdForCurso(info.curso);
        return info;
      }),
      ra,
      login: this.currentUser(),
    });
  }
}

export const ufabcMatricula = new UFABCMatricula();
