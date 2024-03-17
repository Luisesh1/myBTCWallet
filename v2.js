// const bitcoin = require('bitcoinjs-lib');
// const axios = require('axios');

// // Función para obtener el balance de una dirección Bitcoin
// async function getBalance(privateKey) {
//   try {
//     // Crear una instancia de la clave privada y obtener la dirección correspondiente
//     const keyPair = bitcoin.ECPair.fromWIF(privateKey);
//     const address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey }).address;
//     console.log(address, 'sss');
//     // Obtener el historial de transacciones de la dirección
//     const response = await axios.get(`https://blockchain.info/rawaddr/${address}`);
//     const transactions = response.data.txs || [];

//     // Calcular el saldo sumando las transacciones no gastadas (UTXOs)
//     let balance = 0;
//     transactions.forEach((tx) => {
//       tx.out.forEach((output) => {
//         if (output.addr === address) {
//           balance += output.value;
//         }
//       });
//     });

//     console.log(`Balance de la dirección ${address}: ${balance / 1e8} BTC`);
//   } catch (error) {
//     console.error('Error al obtener el balance:', error.message);
//   }
// }

// // Reemplaza 'tu_llave_privada' con tu propia llave privada en formato WIF
// const privateKey = '5HvxB4g6txobbWYHAsf42XTJizd7zkZq2XLnew5jxznBeEepwPQ';

// // Llamar a la función para obtener el balance
// getBalance(privateKey);





// const bitcoin = require('bitcoinjs-lib');

// // Inserta tu llave privada en formato hexadecimal aquí
// const private_key_hex = '0f22748db0e7fda896f7e7bc583e42c86006a42cb2ede2085a31ab89b70b9812';

// // Convierte la llave privada de hexadecimal a un objeto de llave privada
// const privateKey = bitcoin.ECPair.fromPrivateKey(Buffer.from(private_key_hex, 'hex'));

// // Deriva la dirección pública desde la llave privada
// const { address } = bitcoin.payments.p2pkh({ pubkey: privateKey.publicKey });

// console.log('Dirección Bitcoin derivada:', address);


const bitcoin = require('bitcoinjs-lib');
const crypto = require('crypto');

function generatePrivateKeyFromText(text) {
    // Aplicar una función hash criptográfica (SHA-256) al texto completo
    const hashedText = crypto.createHash('sha256').update(text, 'utf-8').digest('hex');
    // La longitud de la clave privada debe ser de 32 bytes (64 caracteres hexadecimales)
    const privateKey = hashedText.slice(0, 64);
    return privateKey;
}


// Función para convertir una clave privada a formato WIF
function privateKeyToWIF(privateKey) {
  const keyPair = bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'));
  const wif = keyPair.toWIF();
  return wif;
}

// Reemplaza 'tu_clave_privada' con tu propia clave privada en formato hexadecimal
const privateKeyHex = generatePrivateKeyFromText('hola que hace');

try {
  const wifKey = privateKeyToWIF(privateKeyHex);
  const keyPair = bitcoin.ECPair.fromWIF(wifKey);
  const address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey }).address;
  console.log('Clave privada:', privateKeyHex);
  console.log('Clave privada en formato WIF:', wifKey);
  console.log('Clave publica:', keyPair.publicKey.toString('hex'));
  console.log('Direccion:', address);

} catch (error) {
  console.error('Error al convertir la clave privada a WIF:', error.message);
}