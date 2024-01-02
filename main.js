const crypto = require('crypto');
const elliptic = require('elliptic');
const bs58 = require('bs58');
const readline = require('readline');

// Función para generar la clave privada desde un texto
function generatePrivateKeyFromText(text) {
    // Aplicar una función hash criptográfica (SHA-256) al texto completo
    const hashedText = crypto.createHash('sha256').update(text, 'utf-8').digest('hex');
    console.log(hashedText);
    // La longitud de la clave privada debe ser de 32 bytes (64 caracteres hexadecimales)
    const privateKey = hashedText.slice(0, 64);
    return privateKey;
}

// Función para convertir la clave privada a formato WIF
function privateKeyToWIF(privateKey) {
    const versionByte = '80'; // Versión principal de la red de Bitcoin para claves privadas
    const privateKeyWithVersion = versionByte + privateKey;
    const firstSha256 = crypto.createHash('sha256').update(Buffer.from(privateKeyWithVersion, 'hex')).digest();
    const secondSha256 = crypto.createHash('sha256').update(firstSha256).digest();
    const checksum = secondSha256.slice(0, 4).toString('hex');
    const privateKeyWIFBuffer = Buffer.from(privateKeyWithVersion + checksum, 'hex');
    const privateKeyWIF = bs58.encode(privateKeyWIFBuffer);
    return privateKeyWIF;
}

const main = (semilla) => {
    // Paso 1: Generar una clave privada aleatoria
    // const privateKey = crypto.randomBytes(32).toString('hex');
    const privateKey = generatePrivateKeyFromText(semilla);
    console.log('Private Key:', privateKey);

    // Imprimir la clave privada en formato WIF
    const privateKeyWIF = privateKeyToWIF(privateKey);
    console.log('Private Key (WIF):', privateKeyWIF);

    // Paso 2: Derivar la clave pública de la clave privada
    const ec = new elliptic.ec('secp256k1');
    const keyPair = ec.keyFromPrivate(privateKey, 'hex');
    const publicKey = keyPair.getPublic().encode('hex');
    console.log('Public Key:', publicKey);

    // Paso 3: Derivar la dirección de Bitcoin de la clave pública
    const publicKeyHash = crypto.createHash('ripemd160').update(publicKey, 'hex').digest('hex');
    const versionByte = '00'; // Versión principal de la red de Bitcoin
    const addressPayload = versionByte + publicKeyHash;
    const checksum = crypto.createHash('sha256').update(crypto.createHash('sha256').update(addressPayload, 'hex').digest()).digest('hex').substr(0, 8);
    const bitcoinAddress = bs58.encode(Buffer.from(addressPayload + checksum, 'hex'));
    console.log('Bitcoin Address:', bitcoinAddress);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Pregunta al usuario
rl.question('ingresa semilla: ', (respuesta) => {
  console.log(`semilla: ${respuesta}`);
  main(respuesta);
  
});

// Evento que se dispara cuando la interfaz readline se cierra
rl.on('close', () => {
  console.log('¡Adiós!');
  process.exit(0);
});