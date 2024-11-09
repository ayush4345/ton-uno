import { clsx, type ClassValue } from "clsx"
import { ethers } from "ethers";
import { twMerge } from "tailwind-merge"

const ALPHABET = "0123456789abcdef".split("");

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to decode URL-safe Base64 to Hex string
export function decodeBase64To32Bytes(base64String: string) {
  // Convert URL-safe Base64 to regular Base64 (replace '-' with '+' and '_' with '/')
  const standardBase64 = base64String.replace(/-/g, '+').replace(/_/g, '/');

  // Decode the Base64 string into bytes
  const decodedBytes = Buffer.from(standardBase64, 'base64');

  // Convert the bytes into a valid hex string using ethers
  let hexString = ethers.hexlify(decodedBytes);

  // hexString = encode72to64(hexString)
  // console.log(hexString)
  const bytesFromHex = ethers.keccak256(hexString)

  return bytesFromHex;
}

// Function to encode Hex string into URL-safe Base64
export function encodeHexToBase64(hexString: string) {
  // Convert hex string to bytes (Uint8Array)

  // hexString = decode64to72(hexString)
  // console.log(hexString)

  const bytes = ethers.toBeArray(hexString);

  // Convert the bytes back to standard Base64
  let base64String = Buffer.from(bytes).toString('base64');

  // Convert standard Base64 to URL-safe Base64 (replace '+' with '-' and '/' with '_')
  const urlSafeBase64 = base64String.replace(/\+/g, '-').replace(/\//g, '_');

  return urlSafeBase64;
}

function encode72to64(input: string) {

  input = input.toLowerCase().replace('0x', '');

  if (input.length !== 72) {
    throw new Error('Input must be exactly 72 characters');
  }

  let result = '';

  // Process in blocks of 36 characters (half of input)
  for (let i = 0; i < input.length; i += 36) {
    const chunk = input.slice(i, i + 36);
    let value = 0n;  // Using BigInt for larger numbers

    // Convert chunk to number
    for (let j = 0; j < chunk.length; j++) {
      value = value * 64n + BigInt(ALPHABET.indexOf(chunk[j]));
    }

    // Convert to 32 characters (half of output)
    for (let j = 0; j < 32; j++) {
      const index = Number(value % 64n);
      result = ALPHABET[index] + result;
      value = value / 64n;
    }
  }

  return "0x" + result;
}

function decode64to72(input: string) {

  input = input.toLowerCase().replace('0x', '');

  if (input.length !== 64) {
    throw new Error('Input must be exactly 64 characters');
  }

  let result = '';

  // Process in blocks of 32 characters
  for (let i = 0; i < input.length; i += 32) {
    const chunk = input.slice(i, i + 32);
    let value = 0n;

    // Convert chunk back to number
    for (let j = 0; j < chunk.length; j++) {
      value = value * 16n + BigInt(ALPHABET.indexOf(chunk[j]));
    }

    // Convert back to 36 characters
    for (let j = 0; j < 36; j++) {
      const index = Number(value % 16n);
      result = ALPHABET[index] + result;
      console.log(value)
      value = value / 16n;
    }
  }

  return "0x" + result;
}