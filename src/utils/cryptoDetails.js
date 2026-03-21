import * as openpgp from 'openpgp';

// 1. Function to Encrypt
export const encryptFile = async (file, publicKeyArmored) => {
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
    const message = await openpgp.createMessage({ binary: new Uint8Array(await file.arrayBuffer()) });
    
    const encrypted = await openpgp.encrypt({
        message,
        encryptionKeys: publicKey,
        format: 'binary' // Very important for PDFs/Images
    });
    
    return new Blob([encrypted], { type: 'application/pgp-encrypted' });
};
export const getMimeTypeFromUrl = (url) => {
    if (!url) return 'application/octet-stream';
    const cleanUrl = url.split('?')[0].replace(/\.gpg$/, '');
    const extension = cleanUrl.split('.').pop().toLowerCase();
    
    switch (extension) {
        case 'png': return 'image/png';
        case 'jpg':
        case 'jpeg': return 'image/jpeg';
        case 'gif': return 'image/gif';
        case 'webp': return 'image/webp';
        case 'pdf': return 'application/pdf';
        case 'txt': return 'text/plain';
        default: return 'application/pdf'; // Default fallback
    }
};

// 2. Function to Decrypt
export const decryptFile = async (encryptedBlob, privateKeyArmored, passphrase, mimeType = 'application/pdf') => {
    let privateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });

    if (!privateKey.isDecrypted()) {
        try {
            // Wait, if it's already an old password-protected key and no passphrase was passed,
            // we will gently ask for it just once so it doesn't crash.
            let promptPass = passphrase;
            if (!promptPass) {
                const canPrompt = import.meta?.env?.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                if (canPrompt) {
                    promptPass = window.prompt("Legacy Secure Key detected. Please enter your ProDoc password to decrypt:");
                } else {
                    throw new Error("Passphrase required but not provided. In production, request access from the patient or use the patient's account to view records.");
                }
            }
            if (promptPass === null) throw new Error("Decryption cancelled.");

            privateKey = await openpgp.decryptKey({
                privateKey,
                passphrase: promptPass
            });
        } catch (error) {
            throw new Error("Incorrect password or failed to decrypt private key.");
        }
    }
    const message = await openpgp.readMessage({ binaryMessage: new Uint8Array(await encryptedBlob.arrayBuffer()) });
    
    const { data } = await openpgp.decrypt({
        message,
        decryptionKeys: privateKey,
        format: 'binary'
    });

    return new Blob([data], { type: mimeType });
};
