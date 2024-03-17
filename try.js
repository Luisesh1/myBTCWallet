const crypto = require('crypto');
const bs58check = require('bs58check');

function deriveBTCAddress(privateKeyHex) {
  // Paso 1: Calcular la clave pública a partir de la clave privada
  const privateKeyBuffer = Buffer.from(privateKeyHex, 'hex');
  const ecdh = crypto.createECDH('secp256k1');
  ecdh.setPrivateKey(privateKeyBuffer);

  const publicKey = ecdh.getPublicKey('hex', 'compressed'); // 'compressed' o 'uncompressed'

  // Paso 2: Aplicar la función de resumen SHA256 y luego RIPEMD160 a la clave pública
  const publicKeyBuffer = Buffer.from(publicKey, 'hex');
  const sha256Hash = crypto.createHash('sha256').update(publicKeyBuffer).digest();
  const ripemd160Hash = crypto.createHash('ripemd160').update(sha256Hash).digest();

  // Paso 3: Agregar el byte de versión (0x00 para la red principal de Bitcoin)
  const versionByte = Buffer.from('00', 'hex');
  const hashedPublicKey = Buffer.concat([versionByte, ripemd160Hash]);

  // Paso 4: Calcular el checksum de los primeros 21 bytes (versión + RIPEMD160)
  const checksum = crypto.createHash('sha256').update(hashedPublicKey).digest();
  const doubleChecksum = crypto.createHash('sha256').update(checksum).digest().slice(0, 4);

  // Paso 5: Concatenar la dirección con el checksum y codificar en Base58Check
  const addressBuffer = Buffer.concat([hashedPublicKey, doubleChecksum]);
  const btcAddress = bs58check.encode(addressBuffer);

  return btcAddress;
}

// Ejemplo de uso
const privateKeyHex = '0f22748db0e7fda896f7e7bc583e42c86006a42cb2ede2085a31ab89b70b9812';
const btcAddress = deriveBTCAddress(privateKeyHex);
console.log('BTC Address:', btcAddress);
