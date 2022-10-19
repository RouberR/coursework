const crypto = require('crypto');
const fs = require('fs');
const util = require('util');

const cipherData = fs.readFileSync(`${__dirname}/key.json`);
const { key, algorithm } = JSON.parse(cipherData);

const encryptMessage = (message) => {
  const iv = crypto.randomBytes(8).toString('hex');
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(message, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return `${encrypted}:${iv}`;
};

const decryptMessage = (message) => {
  const [encryptedMessage, iv] = message.split(':');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encryptedMessage, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');

  return decrypted;
};
