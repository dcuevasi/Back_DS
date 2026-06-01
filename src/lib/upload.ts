import { writeFile, mkdir } from 'fs/promises';
import { randomUUID } from 'crypto';
import { extname } from 'path';

const UPLOADS_DIR = 'uploads';

export async function uploadFile(file: File): Promise<string> {
  await mkdir(UPLOADS_DIR, { recursive: true });

  const ext = extname(file.name) || '.jpg';
  const filename = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(`${UPLOADS_DIR}/${filename}`, buffer);

  return `/uploads/${filename}`;
}
