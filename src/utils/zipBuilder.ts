/**
 * Pure TypeScript PKZIP (ZIP 2.0 Store Mode) archive builder & validator.
 * Works identically in Node.js and browser environments (Uint8Array)
 * with zero external dependencies and guaranteed compatibility with
 * Windows Explorer, WinRAR, 7-Zip, macOS Archive Utility, and Linux unzip.
 */

export interface ZipEntryInput {
  /** Relative path inside the ZIP archive (use forward slashes, e.g. "android/build.gradle") */
  path: string;
  /** File content as UTF-8 string or raw binary Uint8Array */
  data: string | Uint8Array;
}

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

export function computeCrc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC32_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writeUInt16LE(buf: Uint8Array, value: number, offset: number): void {
  buf[offset] = value & 0xff;
  buf[offset + 1] = (value >>> 8) & 0xff;
}

function writeUInt32LE(buf: Uint8Array, value: number, offset: number): void {
  buf[offset] = value & 0xff;
  buf[offset + 1] = (value >>> 8) & 0xff;
  buf[offset + 2] = (value >>> 16) & 0xff;
  buf[offset + 3] = (value >>> 24) & 0xff;
}

/**
 * Builds a standard PKZIP archive buffer (Uint8Array) from a list of files.
 */
export function buildZipArchive(entries: ZipEntryInput[]): Uint8Array {
  const encoder = new TextEncoder();

  const prepared = entries.map((entry) => {
    const normalizedPath = entry.path.replace(/^\/+/, '').replace(/\\/g, '/');
    const nameBytes = encoder.encode(normalizedPath);
    const dataBytes =
      typeof entry.data === 'string' ? encoder.encode(entry.data) : entry.data;
    const crc = computeCrc32(dataBytes);
    return {
      nameBytes,
      dataBytes,
      crc,
    };
  });

  // Calculate total byte size
  let localAreaSize = 0;
  let centralDirSize = 0;
  for (const item of prepared) {
    localAreaSize += 30 + item.nameBytes.length + item.dataBytes.length;
    centralDirSize += 46 + item.nameBytes.length;
  }
  const totalSize = localAreaSize + centralDirSize + 22;
  const out = new Uint8Array(totalSize);

  // Fixed DOS timestamp (2026-10-24 12:00:00)
  const dosTime = (12 << 11) | (0 << 5) | 0;
  const dosDate = ((2026 - 1980) << 9) | (10 << 5) | 24;

  const localOffsets: number[] = [];
  let offset = 0;

  // 1. Write Local File Headers + File Data
  for (const item of prepared) {
    localOffsets.push(offset);

    // Local file header signature (0x04034b50 = "PK\x03\x04")
    writeUInt32LE(out, 0x04034b50, offset);
    // Version needed to extract (2.0)
    writeUInt16LE(out, 20, offset + 4);
    // General purpose bit flag (bit 11 = UTF-8 filename)
    writeUInt16LE(out, 0x0800, offset + 6);
    // Compression method (0 = Store)
    writeUInt16LE(out, 0, offset + 8);
    // Last mod file time & date
    writeUInt16LE(out, dosTime, offset + 10);
    writeUInt16LE(out, dosDate, offset + 12);
    // CRC-32
    writeUInt32LE(out, item.crc, offset + 14);
    // Compressed size
    writeUInt32LE(out, item.dataBytes.length, offset + 18);
    // Uncompressed size
    writeUInt32LE(out, item.dataBytes.length, offset + 22);
    // File name length
    writeUInt16LE(out, item.nameBytes.length, offset + 26);
    // Extra field length
    writeUInt16LE(out, 0, offset + 28);

    offset += 30;
    out.set(item.nameBytes, offset);
    offset += item.nameBytes.length;
    out.set(item.dataBytes, offset);
    offset += item.dataBytes.length;
  }

  const centralDirOffset = offset;

  // 2. Write Central Directory Headers
  for (let i = 0; i < prepared.length; i++) {
    const item = prepared[i];
    // Central directory file header signature (0x02014b50 = "PK\x01\x02")
    writeUInt32LE(out, 0x02014b50, offset);
    // Version made by (2.0)
    writeUInt16LE(out, 20, offset + 4);
    // Version needed to extract (2.0)
    writeUInt16LE(out, 20, offset + 6);
    // General purpose bit flag (UTF-8)
    writeUInt16LE(out, 0x0800, offset + 8);
    // Compression method (0 = Store)
    writeUInt16LE(out, 0, offset + 10);
    // Last mod time & date
    writeUInt16LE(out, dosTime, offset + 12);
    writeUInt16LE(out, dosDate, offset + 14);
    // CRC-32
    writeUInt32LE(out, item.crc, offset + 16);
    // Compressed size
    writeUInt32LE(out, item.dataBytes.length, offset + 20);
    // Uncompressed size
    writeUInt32LE(out, item.dataBytes.length, offset + 24);
    // File name length
    writeUInt16LE(out, item.nameBytes.length, offset + 28);
    // Extra field length
    writeUInt16LE(out, 0, offset + 30);
    // File comment length
    writeUInt16LE(out, 0, offset + 32);
    // Disk number start
    writeUInt16LE(out, 0, offset + 34);
    // Internal file attributes
    writeUInt16LE(out, 0, offset + 36);
    // External file attributes
    writeUInt32LE(out, 0, offset + 38);
    // Relative offset of local header
    writeUInt32LE(out, localOffsets[i], offset + 42);

    offset += 46;
    out.set(item.nameBytes, offset);
    offset += item.nameBytes.length;
  }

  // 3. Write End of Central Directory Record (EOCD)
  // Signature (0x06054b50 = "PK\x05\x06")
  writeUInt32LE(out, 0x06054b50, offset);
  // Number of this disk
  writeUInt16LE(out, 0, offset + 4);
  // Disk where central directory starts
  writeUInt16LE(out, 0, offset + 6);
  // Number of central directory records on this disk
  writeUInt16LE(out, prepared.length, offset + 8);
  // Total number of central directory records
  writeUInt16LE(out, prepared.length, offset + 10);
  // Size of central directory
  writeUInt32LE(out, centralDirSize, offset + 12);
  // Offset of start of central directory
  writeUInt32LE(out, centralDirOffset, offset + 16);
  // Comment length
  writeUInt16LE(out, 0, offset + 20);

  return out;
}

/**
 * Verifies that a binary payload is a valid PKZIP archive and not an HTML fallback page.
 */
export function isValidZipBuffer(bytes: Uint8Array): boolean {
  if (!bytes || bytes.length < 22) return false;
  // Must start with "PK\x03\x04" (0x50, 0x4b, 0x03, 0x04)
  if (bytes[0] !== 0x50 || bytes[1] !== 0x4b || bytes[2] !== 0x03 || bytes[3] !== 0x04) {
    return false;
  }
  // Must end with EOCD signature "PK\x05\x06" at length - 22 (when comment length is 0)
  const eocdOffset = bytes.length - 22;
  return (
    bytes[eocdOffset] === 0x50 &&
    bytes[eocdOffset + 1] === 0x4b &&
    bytes[eocdOffset + 2] === 0x05 &&
    bytes[eocdOffset + 3] === 0x06
  );
}

/**
 * Verifies that a binary payload is NOT an HTML fallback response from a Service Worker.
 */
export function isNotHtmlFallback(bytes: Uint8Array): boolean {
  if (!bytes || bytes.length === 0) return false;
  const head = new TextDecoder().decode(bytes.subarray(0, Math.min(64, bytes.length))).trimStart().toLowerCase();
  return !head.startsWith('<!doctype html') && !head.startsWith('<html');
}
