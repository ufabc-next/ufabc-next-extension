import toast from "toastify-js";
import logoWhite from '@/public/logo-white.svg'
import loading from '@/public/loading.svg'
import errorImg from '@/public/error.svg'

export const successToast = toast({
  text: `
      <div class='toast-loading-text' style='width: 250px'>
        <img src=${logoWhite} width="120" style="margin-bottom: 8px" />
        <p>Obrigado por utilizar o UFABC next 💙</p>
        <p style="padding-bottom: 8px; font-weight: 700;">Sincronizado com sucesso! 📋✅</p>\n\n
      </div>`,
  duration: 5000,
  close: false,
  gravity: 'bottom',
  position: 'right',
  escapeMarkup: false,
  style: {
    background: '#E74C3C;',
  },
})

export const processingToast = toast({
  text: `
      <div class='toast-loading-text' style='width: 250px'>
        <img src=${logoWhite} width="120" style="margin-bottom: 8px" />
        <p style="padding-bottom: 8px;">Atualizando suas informações...</p>\n\n
        <b>NÃO SAIA DESSA PÁGINA,</b>
        <p>apenas aguarde, no máx. 5 min 🙏</p>
      </div>`,
  duration: -1,
  close: false,
  gravity: 'bottom',
  position: 'right',
  className: 'toast-loading',
  escapeMarkup: false,
  avatar: loading,
  style: {
    background: 'linear-gradient(to right, #2E7EED, rgba(46, 126, 237, 0.5));',
  },
});

export const errorToast = toast({
  text: `
    <div style="width: 228px; display: flex; align-items: end; margin-right: 12px;">
      <img style="margin-right: 16px;" width="32" height="32" src=${errorImg} />
        Não foi possível salvar seus dados, recarregue a página e aguarde.
    </div>`,
  duration: -1,
  close: true,
  gravity: 'bottom',
  position: 'right',
  className: 'toast-error-container',
  escapeMarkup: false,
  style: {
    background: '#E74C3C;',
  },
});

export const scrappingErrorToast = (msg: string) => toast({
  text: `
    <div style="width: 228px; display: flex; align-items: end; margin-right: 12px;">
      <img style="margin-right: 16px;" width="32" height="32" src=${errorImg} />
        ${msg}
    </div>`,
  duration: -1,
  close: true,
  gravity: 'bottom',
  position: 'right',
  className: 'toast-error-container',
  escapeMarkup: false,
  style: {
    background: '#E74C3C;',
  },
});
