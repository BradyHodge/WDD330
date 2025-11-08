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

// Team Activity 4: Render with template (modified from renderListWithTemplate)
export function renderWithTemplate(templateFn, parentElement, data, callback, position = "afterbegin", clear = true) {
  if (!parentElement) return;
  if (clear) parentElement.innerHTML = "";
  
  // Call the template function with data
  parentElement.insertAdjacentHTML(position, templateFn);
  
  // If callback exists, call it
  if (callback) {
    callback(data);
  }
}

// Team Activity 4: Load template using currying
export function loadTemplate(path) {
  // This returns a function that remembers the path (currying)
  return async function () {
    const res = await fetch(path);
    if (res.ok) {
      const html = await res.text();
      return html;
    }
  };
}

// Team Activity 4: Load header and footer
export async function loadHeaderFooter() {
  const headerTemplateFn = loadTemplate("/partials/header.html");
  const footerTemplateFn = loadTemplate("/partials/footer.html");
  
  const headerEl = document.querySelector("#main-header");
  const footerEl = document.querySelector("footer");
  
  const headerHTML = await headerTemplateFn();
  const footerHTML = await footerTemplateFn();
  
  renderWithTemplate(headerHTML, headerEl);
  renderWithTemplate(footerHTML, footerEl);
}