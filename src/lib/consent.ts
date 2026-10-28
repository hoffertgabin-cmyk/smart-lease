export const CONSENT_KEY = "sl-consent-v1";

/** Inline script for <head>: flags a stored choice so CSS hides the banner without waiting for React. */
export const consentBootScript = `try{if(localStorage.getItem("${CONSENT_KEY}"))document.documentElement.setAttribute("data-consent","")}catch(e){}`;
