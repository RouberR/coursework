import CryptoJS from 'crypto-js';

export const crypto = (message, key) => {
  try {
    return CryptoJS.AES.encrypt(message, key).toString();
  } catch (err) {
    console.log(err);
  }
};

export const decrypted = (cryptoMessage, key) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(cryptoMessage, key).toString(CryptoJS.enc.Utf8);
    if (!decrypted || !cryptoMessage) {
      return 'Сообщение зашифровано, пожалуйста укажите секретный ключ!';
    }
    return decrypted;
  } catch (err) {
    console.log(err);
  }
};
