const fs = require('fs/promises');
const { PDFParse } = require('pdf-parse');
const AppError = require('../utils/AppError');

const PDF_SIGNATURE = '%PDF-';
const MIN_TEXT_LENGTH = 100; // below this the PDF is treated as empty / image-only
const MAX_TEXT_LENGTH = 50000;

// Do not trust the filename or MIME type: check the file's first bytes ("magic number").
async function assertPdfSignature(filePath) {
  const handle = await fs.open(filePath, 'r');
  try {
    const buffer = Buffer.alloc(PDF_SIGNATURE.length);
    await handle.read(buffer, 0, PDF_SIGNATURE.length, 0);
    if (buffer.toString('latin1') !== PDF_SIGNATURE) {
      throw new AppError('The uploaded file is not a valid PDF.', 400);
    }
  } finally {
    await handle.close();
  }
}

function cleanText(rawText) {
  return rawText
    .replace(/\u0000/g, '')
    .replace(/^-- \d+ of \d+ --$/gm, '') // page markers added by the parser
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t\f\v]+/g, ' ')
    .replace(/ ?\n ?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, MAX_TEXT_LENGTH);
}

async function extractText(filePath) {
  const buffer = await fs.readFile(filePath);
  const parser = new PDFParse({ data: buffer });

  let result;
  try {
    result = await parser.getText();
  } catch {
    throw new AppError('This PDF could not be read. It may be corrupted or password-protected.', 422);
  } finally {
    await parser.destroy().catch(() => {});
  }

  const text = cleanText(result.text || '');
  if (text.length < MIN_TEXT_LENGTH) {
    throw new AppError('No readable text was found in this PDF. Scanned or image-only resumes are not supported - export a text-based PDF instead.', 422);
  }
  return { text, pageCount: result.total || 1 };
}

// Validate and extract in one step; callers delete the file if this throws.
async function processPdf(filePath) {
  await assertPdfSignature(filePath);
  return extractText(filePath);
}

module.exports = { processPdf, cleanText };
