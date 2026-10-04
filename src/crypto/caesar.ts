/**
 * Classical Cryptography - Caesar Cipher Implementation
 * Designed for Computer Engineering / Cybersecurity Laboratory Demonstrations.
 *
 * Mathematical Principles:
 * - Alphabet size (Z₂₆): N = 26
 * - Plaintext numerical representation: P ∈ {0, 1, ..., 25}
 * - Key / Shift value: k ∈ {1, 2, ..., 25}
 * - Encryption function: C = (P + k) mod 26
 * - Decryption function: P = (C - k) mod 26
 *
 * Rules:
 * 1. Uppercase English letters (A-Z, ASCII 65-90) remain uppercase.
 * 2. Lowercase English letters (a-z, ASCII 97-122) remain lowercase.
 * 3. Digits, spaces, punctuation, and special symbols are strictly preserved without modification.
 */

export interface CipherStep {
  char: string;
  ascii: number;
  isAlpha: boolean;
  isUpper: boolean;
  pVal?: number;
  kVal?: number;
  cVal?: number;
  resChar: string;
  formula: string;
}

/**
 * Encrypt plaintext using Caesar Cipher: C = (P + k) mod 26
 */
export function caesarEncrypt(text: string, shift: number): string {
  // Normalize shift to standard modulo 26 range [0, 25]
  const k = ((shift % 26) + 26) % 26;
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);

    // Uppercase letter A-Z: ASCII [65, 90]
    if (code >= 65 && code <= 90) {
      const P = code - 65; // Numerical value 0-25
      const C = (P + k) % 26; // C = (P + k) mod 26
      result += String.fromCharCode(65 + C);
    }
    // Lowercase letter a-z: ASCII [97, 122]
    else if (code >= 97 && code <= 122) {
      const P = code - 97; // Numerical value 0-25
      const C = (P + k) % 26; // C = (P + k) mod 26
      result += String.fromCharCode(97 + C);
    }
    // Special characters, spaces, punctuation, numbers remain unchanged
    else {
      result += text[i];
    }
  }

  return result;
}

/**
 * Decrypt ciphertext using Caesar Cipher: P = (C - k) mod 26
 */
export function caesarDecrypt(text: string, shift: number): string {
  // Normalize shift to standard modulo 26 range [0, 25]
  const k = ((shift % 26) + 26) % 26;
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);

    // Uppercase letter A-Z: ASCII [65, 90]
    if (code >= 65 && code <= 90) {
      const C = code - 65; // Numerical value 0-25
      // JavaScript handles negative modulo by adding 26: P = ((C - k) % 26 + 26) % 26
      const P = (((C - k) % 26) + 26) % 26;
      result += String.fromCharCode(65 + P);
    }
    // Lowercase letter a-z: ASCII [97, 122]
    else if (code >= 97 && code <= 122) {
      const C = code - 97; // Numerical value 0-25
      const P = (((C - k) % 26) + 26) % 26;
      result += String.fromCharCode(97 + P);
    }
    // Special characters, spaces, punctuation, numbers remain unchanged
    else {
      result += text[i];
    }
  }

  return result;
}

/**
 * Generates detailed calculation steps for student viva / laboratory presentation.
 */
export function explainCaesarSteps(
  text: string,
  shift: number,
  mode: 'encrypt' | 'decrypt'
): CipherStep[] {
  const k = ((shift % 26) + 26) % 26;
  const steps: CipherStep[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const code = text.charCodeAt(i);

    if (code >= 65 && code <= 90) {
      const origVal = code - 65;
      let targetVal: number;
      let formula: string;

      if (mode === 'encrypt') {
        targetVal = (origVal + k) % 26;
        formula = `(${origVal} + ${k}) mod 26 = ${targetVal}`;
      } else {
        targetVal = (((origVal - k) % 26) + 26) % 26;
        formula = `(${origVal} - ${k}) mod 26 = ${targetVal}`;
      }

      const resChar = String.fromCharCode(65 + targetVal);
      steps.push({
        char: ch,
        ascii: code,
        isAlpha: true,
        isUpper: true,
        pVal: origVal,
        kVal: k,
        cVal: targetVal,
        resChar,
        formula,
      });
    } else if (code >= 97 && code <= 122) {
      const origVal = code - 97;
      let targetVal: number;
      let formula: string;

      if (mode === 'encrypt') {
        targetVal = (origVal + k) % 26;
        formula = `(${origVal} + ${k}) mod 26 = ${targetVal}`;
      } else {
        targetVal = (((origVal - k) % 26) + 26) % 26;
        formula = `(${origVal} - ${k}) mod 26 = ${targetVal}`;
      }

      const resChar = String.fromCharCode(97 + targetVal);
      steps.push({
        char: ch,
        ascii: code,
        isAlpha: true,
        isUpper: false,
        pVal: origVal,
        kVal: k,
        cVal: targetVal,
        resChar,
        formula,
      });
    } else {
      steps.push({
        char: ch,
        ascii: code,
        isAlpha: false,
        isUpper: false,
        resChar: ch,
        formula: 'Unchanged (non-alphabetic)',
      });
    }
  }

  return steps;
}
