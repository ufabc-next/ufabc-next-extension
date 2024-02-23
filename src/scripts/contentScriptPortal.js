import "@/styles/portal.css";

import $ from "jquery";
import _ from "lodash";
import Axios from "axios";
import toastr from "toastr";
import Toastify from "toastify-js";

import { extensionUtils } from "@/utils/extensionUtils";
import { NextAPI } from "@/services/NextAPI";
import { NextStorage } from "@/services/NextStorage";

const getURL = chrome.runtime.getURL ?? ((path) => path);
const toast = new Toastify({
  text: `
    <div class='toast-loading-text' style='width: 250px'>
      <img src=${getURL(
        "/assets/logo-white.svg",
      )} width="120" style="margin-bottom: 8px" />
      <p style="padding-bottom: 8px;">Atualizando suas informações...</p>\n\n
      <b>NÃO SAIA DESSA PÁGINA,</b>
      <p>apenas aguarde, no máx. 5 min 🙏</p>
    </div>`,
  duration: -1,
  close: false,
  gravity: "bottom",
  position: "right",
  className: "toast-loading",
  escapeMarkup: false,
  avatar: getURL("/assets/loading.svg"),
  style: {
    background: "linear-gradient(to right, #2E7EED, rgba(46, 126, 237, 0.5));",
  },
});

const nextApi = new NextAPI().init();

const basePortalAlunoURL = new URL(document.location.href);
const isPortalAluno = basePortalAlunoURL.pathname === "/dados_pessoais";
const isFichasIndividuais =
  basePortalAlunoURL.pathname === "/fichas_individuais";
const isStudentFicha = basePortalAlunoURL.pathname === "/ficha_individual";

if (isPortalAluno) {
  const anchor = document.createElement("div");
  anchor.setAttribute("id", "app");
  document.body.append(anchor);

  extensionUtils.injectStyle("dist/contentScripts/style.css");

  toastr.info(
    "Clique em <a href='https://aluno.ufabc.edu.br/fichas_individuais' style='color: #FFF !important;'>Ficha Individual</a> para atualizar suas informações!",
  );
} else if (isFichasIndividuais) {
  extensionUtils.injectStyle("dist/contentScripts/style.css");
  toast.showToast();

  iterateTabelaCursosAndSaveToLocalStorage();
} else if (isStudentFicha) {
  extensionUtils.injectStyle("dist/contentScripts/style.css");
}

function iterateTabelaCursosAndSaveToLocalStorage() {
  const tabelaCursos = $("tbody").children().slice(1);
  let count = 0;

  tabelaCursos.each(async function () {
    const linhaCurso = $(this).children();

    const coursename = $(linhaCurso[0]).children("a").text();
    const fichaAlunoURL = $(linhaCurso[1]).children("a").attr("href");
    const gradeYear = $(linhaCurso[2]).text();

    const curso = await getFichaAluno(fichaAlunoURL, coursename, fichaAlunoURL);
    console.log(curso);
    if (count === 0) {
      toast.hideToast();
    }

    count++;

    if (!curso) {
      return;
    }

    curso.curso = linhaCurso[0].innerText.replace("Novo", "");
    curso.turno = linhaCurso[3].innerText;

    await saveToLocalStorage(curso);

    await saveStudentsToLocalStorage(curso);
  });
}

async function getFichaAluno(fichaAlunoUrl, nomeDoCurso, anoDaGrade) {
  const STUDENT_FICHA_TIMEOUT = 60 * 1000;
  try {
    const curso = {};
    const ficha_url = fichaAlunoUrl.replace(".json", "");

    const { data: ficha } = await Axios.get(
      `https://aluno.ufabc.edu.br${ficha_url}`,
      {
        timeout: STUDENT_FICHA_TIMEOUT,
      },
    );

    const parsedStudentFicha = $($.parseHTML(ficha));

    const info = parsedStudentFicha.find(".coeficientes tbody tr td");
    const rawStudentCourseAndRa = parsedStudentFicha
      .find("#page")
      .children("p")[2].innerText;

    const [, ra] = /.*?(\d+).*/g.exec(rawStudentCourseAndRa);

    const storageRA = `ufabc-extension-ra-${emailAluno()}`;
    await NextStorage.setItem(storageRA, ra);

    const { data: jsonFicha } = await Axios.get(
      `https://aluno.ufabc.edu.br${fichaAlunoUrl}`,
      {
        timeout: STUDENT_FICHA_TIMEOUT,
      },
    );

    const disciplinasCategory = parsedStudentFicha.find(
      ".quantidades:last-child tbody tr td",
    );

    // free
    const totalCreditsCoursedFree = toNumber(disciplinasCategory[2]);
    const totalPercentageCoursedFree = toNumber(disciplinasCategory[3]);
    const totalCreditsFree = Math.round(
      (totalCreditsCoursedFree * 100) / totalPercentageCoursedFree,
    );

    // mandatory
    const totalCreditsCoursedMandatory = toNumber(disciplinasCategory[7]);
    const totalPercentageCoursedMandatory = toNumber(disciplinasCategory[8]);
    const totalCreditsMandatory = Math.round(
      (totalCreditsCoursedMandatory * 100) / totalPercentageCoursedMandatory,
    );

    // limited
    const totalCreditsCoursedLimited = toNumber(disciplinasCategory[12]);
    const totalPercentageCoursedLimited = toNumber(disciplinasCategory[13]);
    const totalCreditsLimited = Math.round(
      (totalCreditsCoursedLimited * 100) / totalPercentageCoursedLimited,
    );

    const userHistory = {
      ra,
      disciplinas: jsonFicha,
      curso: nomeDoCurso,
      grade: anoDaGrade,

      // credits total
      mandatory_credits_number: totalCreditsMandatory,
      limited_credits_number: totalCreditsLimited,
      free_credits_number: totalCreditsFree,
      credits_total:
        totalCreditsMandatory + totalCreditsLimited + totalCreditsFree,
    };

    await nextApi.post("/histories", userHistory, {
      timeout: STUDENT_FICHA_TIMEOUT,
    });

    curso.ra = ra;
    curso.cp = toNumber(info[0]);
    curso.cr = toNumber(info[1]);
    curso.ca = toNumber(info[2]);
    curso.quads = parsedStudentFicha.find(".ano_periodo").length;

    curso.cursadas = jsonFicha;

    return curso;
  } catch (err) {
    console.error("some bad happened", err);
    Toastify({
      text: `
        <div style="width: 228px; display: flex; align-items: end; margin-right: 12px;">
          <img style="margin-right: 16px;" width="32" height="32" src="${getURL(
            "/assets/error.svg",
          )}" />
            Não foi possível salvar seus dados, recarregue a página e aguarde.
        </div>`,
      duration: -1,
      close: true,
      gravity: "top",
      position: "right",
      className: "toast-error-container",
      escapeMarkup: false,
      style: {
        background: "#E74C3C;",
      },
    }).showToast();
  }
}

async function saveToLocalStorage(curso) {
  const storageUser = `ufabc-extension-${emailAluno()}`;
  let user = await NextStorage.getItem(storageUser);

  if (!user || _.isEmpty(user)) {
    user = [];
  }

  user.push(curso);

  user = _.uniqBy(user, "curso");

  await NextStorage.setItem(storageUser, user);

  const SUCCESS_TOAST_TTL = 100000;

  toastr.success(
    `Suas informações foram salvas! Disciplinas do curso do ${curso.curso}
      para o usuário ${emailAluno()}.
      `,
    { timeout: SUCCESS_TOAST_TTL },
  );
}

async function saveStudentsToLocalStorage(curso) {
  const storageUser = `ufabc-extension-${emailAluno()}`;
  const cursos = await NextStorage.getItem(storageUser);
  const ra = curso?.ra || null;

  let allSavedStudents = [];
  const students = await NextStorage.getItem("ufabc-extension-students");
  if (students?.length) {
    allSavedStudents.push(...students);
  }

  allSavedStudents = allSavedStudents.filter((student) => student.ra !== ra);
  const student = {
    cursos,
    ra,
    name: emailAluno(),
    lastUpdate: Date.now(),
  };

  allSavedStudents.unshift(student);
  await NextStorage.setItem("ufabc-extension-students", allSavedStudents);
}

function toNumber(el) {
  return parseFloat(el.innerText.replace(",", "."));
}

function emailAluno() {
  const alunoUFABCHTMLHeader = $("#top li").last();
  const [rawAlunoLoginName] = alunoUFABCHTMLHeader
    .text()
    .replace(/\s*/, "")
    .split("|");
  const alunoLoginName = rawAlunoLoginName.replace(" ", "").toLowerCase();
  return alunoLoginName;
}
