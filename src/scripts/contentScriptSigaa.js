import { scrapeGradesConsulting, scrapeHomepage } from '../utils/sigaa';
import {
  errorToast,
  redirectToast,
  processingToast,
  successToast,
} from '../utils/nextToasts';
import Axios from 'axios';
// import { ofetch } from 'ofetch';
const { ofetch } = await import('ofetch');

const sigaaURL = new URL(document.location.href);
const isDiscentesPath = sigaaURL.pathname.includes('discente.jsf');

if (
  isDiscentesPath &&
  document.contains(document.querySelector('#agenda-docente'))
) {
  const student = scrapeHomepage();
  const toast = redirectToast(student.name);
  localStorage.setItem('studentInfo', JSON.stringify(student));
  toast.showToast();
}

async function consume(history) {
  try {
    await ofetch('https://api.v2.ufabcnext.com/v2/histories/sigaa', {
      method: 'POST',
      body: history,
      timeout: 60 * 1 * 1000, // 1 minute
    });
    successToast.showToast();
  } catch (error) {
    console.log(error);
    errorToast.showToast();
  } finally {
    setTimeout(() => processingToast.hideToast(), 1000);
  }
}

if (isDiscentesPath && document.contains(document.querySelector('.notas'))) {
  processingToast.showToast();
  const studentHistory = scrapeGradesConsulting();
  consume(studentHistory);
}
