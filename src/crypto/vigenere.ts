/**
 * Classical Cryptography - Vigenère Cipher Implementation
 * Designed for Computer Engineering / Cybersecurity Laboratory Demonstrations.
 *
 * Mathematical Principles:
 * - Alphabet mapping: A = 0, B = 1, ..., Z = 25
 * - For each alphabetic character i in plaintext P:
 *     Encryption: C[i] = (P[i] + K[j]) mod 26
 *     Decryption: P[i] = (C[i] - K[j] + 26) mod 26
 * - Key repetition:
 *     The key repeats across alphabetic characters.
 *     IMPORTANT: The key pointer advances ONLY when an English alphabetic character is processed.
 *
 * Rules:
 * 1. Uppercase English letters remain uppercase.
 * 2. Lowercase English letters remain lowercase.
 * 3. Spaces, numbers, punctuation, and special characters remain unchanged.
 */

export interface VigenereValidationResult {
  isValid: boolean;
  error?: string;
}

export interface VigenereStep {
  char: string;
  ascii: number;
  isAlpha: boolean;
  isUpper: boolean;
  keyChar?: string;
  keyShift?: number;
  pVal?: number;
  cVal?: number;
  resChar: string;
  formula: string;
}

/**
 * Validates the Vigenère key:
 * - Must not be empty.
 * - Must contain English letters (A-Z, a-z) only.
 */
export function validateVigenereKey(key: string): VigenereValidationResult {
  if (!key || key.trim() === '') {
    return {
      isValid: false,
      error: 'Please enter a key for Vigenère Cipher.',
    };
  }

  // Check if key contains English letters only
  if (!/^[a-zA-Z]+$/.test(key)) {
    return {
      isValid: false,
      error: 'Key must contain English letters only.',
    };
  }

  return { isValid: true };
}

/**
 * Helper to get numeric shift value K ∈ [0, 25] for any English letter.
 */
function getKeyShift(char: string): number {
  const code = char.charCodeAt(0);
  if (code >= 65 && code <= 90) {
    return code - 65;
  }
  if (code >= 97 && code <= 122) {
    return code - 97;
  }
  return 0;
}

/**
 * Encrypt plaintext using Vigenère Cipher: C = (P + K) mod 26
 */
export function vigenereEncrypt(text: string, key: string): string {
  if (!key || key.length === 0) return text;

  let result = '';
  let keyIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);

    // Uppercase English letter: A-Z [65, 90]
    if (code >= 65 && code <= 90) {
      const P = code - 65;
      const K = getKeyShift(key[keyIndex % key.length]);
      const C = (P + K) % 26;
      result += String.fromCharCode(65 + C);
      keyIndex++;
    }
    // Lowercase English letter: a-z [97, 122]
    else if (code >= 97 && code <= 122) {
      const P = code - 97;
      const K = getKeyShift(key[keyIndex % key.length]);
      const C = (P + K) % 26;
      result += String.fromCharCode(97 + C);
      keyIndex++;
    }
    // Numbers, spaces, punctuation, special symbols are unmodified
    // Key index does NOT advance
    else {
      result += text[i];
    }
  }

  return result;
}

/**
 * Decrypt ciphertext using Vigenère Cipher: P = (C - K + 26) mod 26
 */
export function vigenereDecrypt(text: string, key: string): string {
  if (!key || key.length === 0) return text;

  let result = '';
  let keyIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);

    // Uppercase English letter: A-Z [65, 90]
    if (code >= 65 && code <= 90) {
      const C = code - 65;
      const K = getKeyShift(key[keyIndex % key.length]);
      const P = (((C - K) % 26) + 26) % 26;
      result += String.fromCharCode(65 + P);
      keyIndex++;
    }
    // Lowercase English letter: a-z [97, 122]
    else if (code >= 97 && code <= 122) {
      const C = code - 97;
      const K = getKeyShift(key[keyIndex % key.length]);
      const P = (((C - K) % 26) + 26) % 26;
      result += String.fromCharCode(97 + P);
      keyIndex++;
    }
    // Numbers, spaces, punctuation, special symbols are unmodified
    // Key index does NOT advance
    else {
      result += text[i];
    }
  }

  return result;
}

/**
 * Generates detailed calculation steps for student viva / laboratory presentation.
 */
export function explainVigenereSteps(
  text: string,
  key: string,
  mode: 'encrypt' | 'decrypt'
): VigenereStep[] {
  if (!key || key.length === 0) return [];

  const steps: VigenereStep[] = [];
  let keyIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const code = text.charCodeAt(i);

    if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
      const isUpper = code >= 65 && code <= 90;
      const baseCode = isUpper ? 65 : 97;
      const val = code - baseCode;

      const currentKeyChar = key[keyIndex % key.length];
      const K = getKeyShift(currentKeyChar);

      let targetVal: number;
      let formula: string;

      if (mode === 'encrypt') {
        targetVal = (val + K) % 26;
        formula = `(${val} + ${K}) mod 26 = ${targetVal}`;
      } else {
        targetVal = (((val - K) % 26) + 26) % 26;
        formula = `(${val} - ${K} + 26) mod 26 = ${targetVal}`;
      }

      const resChar = String.fromCharCode(baseCode + targetVal);
      steps.push({
        char: ch,
        ascii: code,
        isAlpha: true,
        isUpper,
        keyChar: currentKeyChar.toUpperCase(),
        keyShift: K,
        pVal: mode === 'encrypt' ? val : targetVal,
        cVal: mode === 'encrypt' ? targetVal : val,
        resChar,
        formula,
      });

      keyIndex++;
    } else {
      steps.push({
        char: ch,
        ascii: code,
        isAlpha: false,
        isUpper: false,
        resChar: ch,
        formula: 'Unchanged (key paused)',
      });
    }
  }

  return steps;
}
