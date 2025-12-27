import CryptoJS from 'crypto-js';

export const encryptData = (data: unknown, password: string): string => {
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, password).toString();
};

export const decryptData = <T>(encryptedData: string, password: string): T | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, password);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedString) {
      return null;
    }
    
    return JSON.parse(decryptedString) as T;
  } catch (error) {
    console.error('復号化エラー:', error);
    return null;
  }
};
