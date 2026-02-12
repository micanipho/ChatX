export class CryptoUtils {
    /**
     * Generates a random salt.
     * @returns {string} Hex string salt.
     */
    static generateSalt() {
        const array = new Uint8Array(16);
        globalThis.crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Hashes a password with a salt using SHA-256.
     * @param {string} password 
     * @param {string} salt 
     * @returns {Promise<string>} Hex string hash.
     */
    static async hashPassword(password, salt) {
        const msgUint8 = new TextEncoder().encode(password + salt);
        const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
}
