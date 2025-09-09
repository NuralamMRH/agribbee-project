// utils
import localStorageAvailable from '../utils/localStorageAvailable';

function currentLang() {
  const storageAvailable = localStorageAvailable();

  const langStorage = storageAvailable ? localStorage.getItem('i18nextLng') : 'vi';
  return langStorage;
}

export default currentLang;
