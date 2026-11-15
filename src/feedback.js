export const FEEDBACK_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSe2RLRGNW1jGAGT5utIXmYD8MPDOUPm1rQaKFUr_e_3AGCKVQ/viewform';
export function feedbackLinkMarkup() {
  return `<a class="feedback-link" href="${FEEDBACK_FORM_URL}" target="_blank" rel="noopener noreferrer">Give feedback ↗</a>`;
}
export function mountFeedbackLinks() {
  document.querySelectorAll('[data-feedback-link]').forEach(link => {
    link.href = FEEDBACK_FORM_URL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
}
