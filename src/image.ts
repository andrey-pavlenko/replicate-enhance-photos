import nFs from 'node:fs';
import nPath from 'node:path';
import mime from 'mime-types';
import axios from 'axios';

export function localFileToBase64(path: string): string {
  try {
    nFs.accessSync(path, nFs.constants.R_OK);
  } catch {
    throw new Error(`unable access to ${path}`);
  }
  const mimeType = mime.lookup(path);
  if (!mimeType) {
    throw new Error(`unknown mime type of ${path}`);
  }
  if (!mimeType.startsWith('image/')) {
    throw new Error(`${path} is not an image`);
  }
  const prefix = `data:${mimeType};base64,`;
  const content = nFs.readFileSync(path);
  return prefix + content.toString('base64');
}

export async function downloadImage(url: string, path: string) {
  const response = await axios.get(url, { responseType: 'stream' });
  // console.info(response.headers);
  // console.info(response.headers['content-type']);
  const extension = mime.extension(response.headers['content-type']?.toString() ?? '');
  const file = nPath.format({
    ...nPath.parse(path),
    base: '',
    ext: extension ? `.${extension}` : ''
  });
  await response.data.pipe(nFs.createWriteStream(file));

  return file;
}

export function replaceDirectory(path: string, directory: string): string {
  return nPath.resolve(directory, nPath.parse(path).base);
}
