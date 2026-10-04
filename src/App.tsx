/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Lock,
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  Info,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';
import {
  caesarEncrypt,
  caesarDecrypt,
  explainCaesarSteps,
  CipherStep,
  vigenereEncrypt,
  vigenereDecrypt,
  validateVigenereKey,
  explainVigenereSteps,
  VigenereStep,
} from './crypto';

export default function App() {
  // Application State
  const [algorithm, setAlgorithm] = useState<'caesar' | 'vigenere'>('caesar');
  const [plainText, setPlainText] = useState<string>('DEFEND THE EAST WALL');
  const [shift, setShift] = useState<number>(3);
  const [key, setKey] = useState<string>('LEMON');
  const [keyError, setKeyError] = useState<string | null>(null);

  const [encryptionResult, setEncryptionResult] = useState<string>(
    'GHIHQG WKH HDVW ZDOO'
  );
  const [decryptionResult, setDecryptionResult] = useState<string>(
    'DEFEND THE EAST WALL'
  );

  // UI Feedback States
  const [copiedEnc, setCopiedEnc] = useState<boolean>(false);
  const [copiedDec, setCopiedDec] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [lastAction, setLastAction] = useState<'encrypt' | 'decrypt'>('encrypt');

  // Handle Algorithm Switch
  const handleAlgorithmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as 'caesar' | 'vigenere';
    setAlgorithm(selected);
    setKeyError(null);
  };

  // Handle Shift input change ensuring bounds [1, 25]
  const handleShiftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      setShift(1);
    } else {
      const clamped = Math.min(25, Math.max(1, val));
      setShift(clamped);
    }
  };

  // Handle Key input change with dynamic validation
  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setKey(val);
    if (keyError) {
      if (!val || val.trim() === '') {
        setKeyError('Please enter a key.');
      } else if (!/^[a-zA-Z]+$/.test(val)) {
        setKeyError('Key must contain English letters only.');
      } else {
        setKeyError(null);
      }
    }
  };

  // Encrypt action:
  // - Caesar: C = (P + k) mod 26
  // - Vigenère: C = (P + K) mod 26
  const handleEncrypt = () => {
    if (algorithm === 'caesar') {
      setKeyError(null);
      const encrypted = caesarEncrypt(plainText, shift);
      setEncryptionResult(encrypted);
      setLastAction('encrypt');
    } else {
      const validation = validateVigenereKey(key);
      if (!validation.isValid) {
        setKeyError(validation.error || 'Key must contain English letters only.');
        return;
      }
      setKeyError(null);
      const encrypted = vigenereEncrypt(plainText, key);
      setEncryptionResult(encrypted);
      setLastAction('encrypt');
    }
  };

  // Decrypt action:
  // - Caesar: P = (C - k) mod 26
  // - Vigenère: P = (C - K + 26) mod 26
  const handleDecrypt = () => {
    if (algorithm === 'caesar') {
      setKeyError(null);
      const decrypted = caesarDecrypt(plainText, shift);
      setDecryptionResult(decrypted);
      setLastAction('decrypt');
    } else {
      const validation = validateVigenereKey(key);
      if (!validation.isValid) {
        setKeyError(validation.error || 'Key must contain English letters only.');
        return;
      }
      setKeyError(null);
      const decrypted = vigenereDecrypt(plainText, key);
      setDecryptionResult(decrypted);
      setLastAction('decrypt');
    }
  };

  // Clear button: resets all inputs, outputs, shift, key and validation messages
  const handleClear = () => {
    setPlainText('');
    setShift(3);
    setKey('');
    setKeyError(null);
    setEncryptionResult('');
    setDecryptionResult('');
    setCopiedEnc(false);
    setCopiedDec(false);
  };

  // Copy to clipboard helper
  const handleCopy = (text: string, type: 'enc' | 'dec') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'enc') {
      setCopiedEnc(true);
      setTimeout(() => setCopiedEnc(false), 2000);
    } else {
      setCopiedDec(true);
      setTimeout(() => setCopiedDec(false), 2000);
    }
  };

  // Character breakdown for laboratory demonstration
  const activeText =
    plainText || (lastAction === 'encrypt' ? encryptionResult : decryptionResult);

  const caesarSteps: CipherStep[] =
    algorithm === 'caesar'
      ? explainCaesarSteps(activeText, shift, lastAction)
      : [];

  const vigenereSteps: VigenereStep[] =
    algorithm === 'vigenere' && key && /^[a-zA-Z]+$/.test(key)
      ? explainVigenereSteps(activeText, key, lastAction)
      : [];

  return (
    <div className="min-h-screen bg-[#0c131f] text-[#dce2f4] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      {/* Top Header with Icon */}
      <header className="flex flex-col items-center mb-6 text-center select-none">
        <div className="w-12 h-12 rounded-xl bg-[#111927] border border-[#1b2b3f] flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(6,182,212,0.18)]">
          <Lock className="w-5 h-5 text-[#06b6d4]" strokeWidth={2.2} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Classical Cryptography
        </h1>
        <p className="text-sm text-slate-400 mt-1 font-normal tracking-wide">
          Encryption and Decryption Tool
        </p>
      </header>

      {/* Main Interactive Card */}
      <main className="w-full max-w-[620px] bg-[#111723] border border-[#1e2c3f] rounded-2xl p-6 sm:p-7 shadow-2xl relative">
        {/* Section: Choose Algorithm */}
        <div className="mb-5">
          <label
            htmlFor="algorithm-select"
            className="text-[11px] font-mono tracking-widest text-slate-400 uppercase font-medium mb-2 block"
          >
            CHOOSE ALGORITHM
          </label>
          <div className="relative">
            <select
              id="algorithm-select"
              value={algorithm}
              onChange={handleAlgorithmChange}
              className="w-full h-11 bg-[#090e17] border border-[#1f2d42] rounded-lg px-4 text-sm text-slate-200 font-sans focus:outline-none focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] appearance-none cursor-pointer pr-10 transition-colors"
            >
              <option value="caesar">Caesar Cipher</option>
              <option value="vigenere">Vigenère Cipher</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Section: Plain Text */}
        <div className="mb-5">
          <label
            htmlFor="plain-text"
            className="text-[11px] font-mono tracking-widest text-slate-400 uppercase font-medium mb-2 block"
          >
            PLAIN TEXT
          </label>
          <textarea
            id="plain-text"
            rows={4}
            value={plainText}
            onChange={(e) => setPlainText(e.target.value)}
            placeholder="Enter text..."
            className="w-full bg-[#090e17] border border-[#1f2d42] rounded-lg p-3.5 font-mono text-sm tracking-wider text-[#38bdf8] focus:outline-none focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] transition-colors resize-y min-h-[105px] placeholder:text-slate-600"
          />
        </div>

        {/* Dynamic Parameter Section */}
        {algorithm === 'caesar' ? (
          /* Shift (1-25) - Only visible when Caesar Cipher is selected */
          <div className="mb-6">
            <label
              htmlFor="shift-input"
              className="text-[11px] font-mono tracking-widest text-slate-400 uppercase font-medium mb-2 block"
            >
              SHIFT (1-25)
            </label>
            <div className="relative flex items-center">
              <input
                id="shift-input"
                type="number"
                min={1}
                max={25}
                value={shift}
                onChange={handleShiftChange}
                className="w-full h-11 bg-[#090e17] border border-[#1f2d42] rounded-lg px-4 pr-16 font-mono text-sm text-slate-200 focus:outline-none focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-3.5 font-mono text-xs text-slate-400 select-none pointer-events-none">
                k = {shift}
              </span>
            </div>
          </div>
        ) : (
          /* Key (Vigenère) - Only visible when Vigenère Cipher is selected */
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="vigenere-key"
                className="text-[11px] font-mono tracking-widest text-slate-400 uppercase font-medium"
              >
                KEY (VIGENÈRE)
              </label>
              {key && /^[a-zA-Z]+$/.test(key) && (
                <span className="text-[11px] font-mono text-cyan-400">
                  Length: {key.length}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                id="vigenere-key"
                type="text"
                value={key}
                onChange={handleKeyChange}
                placeholder="Enter key (e.g. LEMON)..."
                className={`w-full h-11 bg-[#090e17] border rounded-lg px-4 font-mono text-sm text-slate-200 focus:outline-none transition-colors placeholder:text-slate-600 ${
                  keyError
                    ? 'border-rose-500/80 focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                    : 'border-[#1f2d42] focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4]'
                }`}
              />
            </div>
            {keyError && (
              <p className="text-xs text-rose-400 font-mono mt-1.5 flex items-center gap-1.5 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{keyError}</span>
              </p>
            )}
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Encrypt Button */}
          <button
            type="button"
            onClick={handleEncrypt}
            className="h-10 px-5 rounded-lg bg-[#06b6d4] hover:bg-[#22d3ee] active:bg-[#0891b2] text-[#051a24] font-semibold text-sm flex items-center shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all cursor-pointer select-none"
          >
            <Lock className="w-4 h-4 mr-2" strokeWidth={2.4} />
            <span>Encrypt</span>
          </button>

          {/* Decrypt Button */}
          <button
            type="button"
            onClick={handleDecrypt}
            className="h-10 px-5 rounded-lg bg-[#0e1624] border border-[#22354c] hover:bg-[#152033] hover:border-[#324a68] text-slate-200 font-medium text-sm flex items-center transition-all cursor-pointer select-none"
          >
            <Lock className="w-4 h-4 mr-2 text-slate-400" strokeWidth={2} />
            <span>Decrypt</span>
          </button>

          {/* Clear Button */}
          <button
            type="button"
            onClick={handleClear}
            className="h-10 px-4 rounded-lg bg-transparent border border-[#22354c] hover:bg-[#152033] hover:border-[#324a68] text-slate-300 font-medium text-sm flex items-center ml-auto transition-all cursor-pointer select-none"
          >
            <RotateCcw className="w-4 h-4 mr-2 text-slate-400" />
            <span>Clear</span>
          </button>
        </div>

        {/* Subtle Horizontal Divider */}
        <div className="border-t border-[#1b283b] my-6" />

        {/* Results Section */}
        <div className="space-y-4">
          {/* ENCRYPTION Result */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase font-medium">
                ENCRYPTION
              </span>
              <button
                type="button"
                onClick={() => handleCopy(encryptionResult, 'enc')}
                disabled={!encryptionResult}
                className={`text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer select-none ${
                  copiedEnc
                    ? 'text-cyan-400 font-medium'
                    : 'text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
              >
                {copiedEnc ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="w-full min-h-[58px] bg-[#090e17] border border-[#1f2d42] rounded-lg p-3.5 font-mono text-sm tracking-wider text-[#4ade80] flex items-center break-all select-all">
              {encryptionResult || (
                <span className="text-slate-600 font-mono text-xs tracking-normal">
                  Encrypted ciphertext will be displayed here...
                </span>
              )}
            </div>
          </div>

          {/* DECRYPTION Result */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase font-medium">
                DECRYPTION
              </span>
              <button
                type="button"
                onClick={() => handleCopy(decryptionResult, 'dec')}
                disabled={!decryptionResult}
                className={`text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer select-none ${
                  copiedDec
                    ? 'text-cyan-400 font-medium'
                    : 'text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
              >
                {copiedDec ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="w-full min-h-[58px] bg-[#090e17] border border-[#1f2d42] rounded-lg p-3.5 font-mono text-sm tracking-wider text-[#f1f5f9] flex items-center break-all select-all">
              {decryptionResult || (
                <span className="text-slate-600 font-mono text-xs tracking-normal">
                  Decrypted plaintext will be displayed here...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Collapsible Lab Demo Notes & Mathematical Breakdown for Students */}
        <div className="mt-6 pt-4 border-t border-[#1b283b]/60">
          <button
            type="button"
            onClick={() => setShowExplanation(!showExplanation)}
            className="w-full flex items-center justify-between text-xs font-mono text-slate-400 hover:text-cyan-400 py-1 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                Lab Demo: Mathematical Formulas & Steps (
                {algorithm === 'caesar' ? 'Caesar' : 'Vigenère'})
              </span>
            </span>
            {showExplanation ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showExplanation && (
            <div className="mt-3 p-3.5 bg-[#090e17] border border-[#1b2b3f] rounded-lg text-xs font-mono space-y-3 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                <div className="p-2.5 bg-[#111927] rounded border border-[#1f2d42]">
                  <span className="text-cyan-400 font-semibold block mb-1">
                    Encryption Formula
                  </span>
                  {algorithm === 'caesar' ? (
                    <>
                      <code>C = (P + k) mod 26</code>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Adds shift k = {shift} to character position P (0-25).
                      </p>
                    </>
                  ) : (
                    <>
                      <code>C = (P + K) mod 26</code>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Repeats key &quot;{key || 'LEMON'}&quot;; key advances only on
                        letters.
                      </p>
                    </>
                  )}
                </div>
                <div className="p-2.5 bg-[#111927] rounded border border-[#1f2d42]">
                  <span className="text-cyan-400 font-semibold block mb-1">
                    Decryption Formula
                  </span>
                  {algorithm === 'caesar' ? (
                    <>
                      <code>P = (C - k) mod 26</code>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Subtracts shift k = {shift} with wrap-around (+26).
                      </p>
                    </>
                  ) : (
                    <>
                      <code>P = (C - K + 26) mod 26</code>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Subtracts repeating key character shift K with wrap-around.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Character inspection table */}
              <div>
                <span className="text-slate-400 block mb-1.5 text-[11px]">
                  Step-by-step Transformation ({lastAction.toUpperCase()}):
                </span>
                <div className="max-h-40 overflow-y-auto border border-[#1f2d42] rounded">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead className="bg-[#111927] text-slate-400 sticky top-0">
                      <tr>
                        <th className="p-1.5 border-b border-[#1f2d42]">Char</th>
                        <th className="p-1.5 border-b border-[#1f2d42]">ASCII</th>
                        {algorithm === 'vigenere' && (
                          <th className="p-1.5 border-b border-[#1f2d42]">Key</th>
                        )}
                        <th className="p-1.5 border-b border-[#1f2d42]">Formula</th>
                        <th className="p-1.5 border-b border-[#1f2d42]">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1f2d42]/50 text-slate-300">
                      {algorithm === 'caesar'
                        ? caesarSteps.slice(0, 15).map((step, idx) => (
                            <tr key={idx} className="hover:bg-[#111a2a]">
                              <td className="p-1.5 font-bold text-cyan-300">
                                {step.char === ' ' ? '␣ (Space)' : step.char}
                              </td>
                              <td className="p-1.5 text-slate-400">{step.ascii}</td>
                              <td className="p-1.5 text-slate-400">{step.formula}</td>
                              <td className="p-1.5 font-bold text-[#4ade80]">
                                {step.resChar === ' ' ? '␣' : step.resChar}
                              </td>
                            </tr>
                          ))
                        : vigenereSteps.slice(0, 15).map((step, idx) => (
                            <tr key={idx} className="hover:bg-[#111a2a]">
                              <td className="p-1.5 font-bold text-cyan-300">
                                {step.char === ' ' ? '␣ (Space)' : step.char}
                              </td>
                              <td className="p-1.5 text-slate-400">{step.ascii}</td>
                              <td className="p-1.5 text-cyan-400">
                                {step.keyChar ? `${step.keyChar} (${step.keyShift})` : '—'}
                              </td>
                              <td className="p-1.5 text-slate-400">{step.formula}</td>
                              <td className="p-1.5 font-bold text-[#4ade80]">
                                {step.resChar === ' ' ? '␣' : step.resChar}
                              </td>
                            </tr>
                          ))}
                      {((algorithm === 'caesar' ? caesarSteps.length : vigenereSteps.length) >
                        15) && (
                        <tr>
                          <td
                            colSpan={algorithm === 'vigenere' ? 5 : 4}
                            className="p-1.5 text-center text-slate-500 italic"
                          >
                            ... and{' '}
                            {(algorithm === 'caesar'
                              ? caesarSteps.length
                              : vigenereSteps.length) - 15}{' '}
                            more characters
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="mt-6 text-center select-none">
        <p className="text-xs text-slate-500 font-mono tracking-wider">
          Computer Engineering • Cybersecurity Lab
        </p>
      </footer>
    </div>
  );
}
