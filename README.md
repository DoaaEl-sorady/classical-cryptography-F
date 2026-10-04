# Classical Cryptography

Implementations of classical cryptography ciphers (Caesar, Vigenère), built with React, TypeScript, and Vite.

## Features

- **Caesar Cipher**: encrypt and decrypt text by shifting letters by a fixed key
- **Vigenère Cipher**: encrypt and decrypt text using a keyword
- Runs in the browser, no server needed

## Tech Stack

- React + TypeScript
- Vite

## Run Locally

**Prerequisites:** Node.js (v18 or newer)

1. Clone the repository:
```bash
   git clone https://github.com/DoaaEl-sorady/classical-cryptography-F.git
   cd classical-cryptography-F
```
2. Install dependencies:
```bash
   npm install
```
3. Create a `.env.local` file in the project root and add your key (only needed if the app uses Gemini):
```
   GEMINI_API_KEY=your_api_key_here
```
4. Start the dev server:
```bash
   npm run dev
```

## Project Structure

```
src/            Application source code
index.html      Entry point
vite.config.ts  Vite configuration
.env.example    Example environment variables
```

## Author

DoaaEl-sorady
