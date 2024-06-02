const express = require('express');
const bodyParser = require('body-parser');
const tweetnacl = require('tweetnacl');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.post('/encrypt', (req, res) => {
    const { inputText } = req.body;

    // AES encryption (existing code)
    const aesObject = new AESCipher("Deep");
    const aesEncryptedText = aesObject.encrypt(inputText);

    // ChaCha20 encryption
    const key = tweetnacl.randomBytes(tweetnacl.secretbox.keyLength);
    const nonce = tweetnacl.randomBytes(tweetnacl.secretbox.nonceLength);
    const inputBytes = Buffer.from(inputText, 'utf-8');
    const encryptedBytes = tweetnacl.secretbox(inputBytes, nonce, key);
    const chachaEncryptedText = Buffer.concat([nonce, encryptedBytes]).toString('base64');

    res.send({ aesEncryptedText, chachaEncryptedText });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
