const encriptionKey = process.env.AES_ENCRIPTION;

function encrypt(field) {
  return `AES_ENCRYPT('${field}','${encriptionKey}')`;
}

function decrypt(field) {
  return `CAST(AES_DECRYPT(${field},'${encriptionKey}') AS CHAR)`;
}

module.exports = { encrypt, decrypt };
