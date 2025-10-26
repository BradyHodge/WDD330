// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// added by me week 3
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}


// agrego Alan
export function renderListWithTemplate(templateFn, parentElement, list, position = 'afterbegin', clear = true) {
  if (!parentElement) return;
  if (clear) parentElement.innerHTML = '';
  const htmlStrings = list.map(templateFn).join('');
  parentElement.insertAdjacentHTML(position, htmlStrings);
}

export function renderWithTemplate(templateFn, parent, data, callback) {
// templateFn es una función async que retorna el HTML (string)
return templateFn().then((html) => {
parent.innerHTML = html;
if (callback && typeof callback === 'function') {
callback(parent, data);
}
});
}


export function loadTemplate(path) {
  return async function () {
    const res = await fetch(path);
    if (!res.ok) return '';
    return await res.text();
  };
}

export async function loadHeaderFooter() {
  const headerEl = document.getElementById('main-header');
  const footerEl = document.getElementById('main-footer');
  if (!headerEl || !footerEl) return;

  const headerTemplateFn = loadTemplate('/partials/header.html');
  const footerTemplateFn = loadTemplate('/partials/footer.html');

  await renderWithTemplate(headerTemplateFn, headerEl);
  await renderWithTemplate(footerTemplateFn, footerEl);
}
