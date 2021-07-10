const getSessionValue = (name) => {
  if(isNaN(parseInt(localStorage.getItem(name), 10)))
    return localStorage.getItem(name);
  return parseInt(localStorage.getItem(name), 10);
  
}

const setSessionValue = (key, value) => {
  localStorage.setItem(key, value);
};


export {
  getSessionValue,
  setSessionValue }