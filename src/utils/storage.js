import { USER_SESSION } from "~/utils/common/constant";

const setItem = (key, value) => {
  window.localStorage.setItem(key, value);
};

const getItem = (key) => {
  const value = window.localStorage.getItem(key);
  return value;
};

const removeItem = (key) => {
  window.localStorage.removeItem(key);
};

const setSessionInStorage = (value) => {
  setItem(USER_SESSION, value);
};

const clearSessionInStorage = () => {
  removeItem(USER_SESSION);
};

const getSessionInStorage = () => getItem(USER_SESSION);

export { getItem, setItem, removeItem, getSessionInStorage, setSessionInStorage, clearSessionInStorage };