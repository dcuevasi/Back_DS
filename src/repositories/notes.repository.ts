import { prisma } from '../lib/prisma.js';
import type { Note, Category } from '../generated/prisma/client.js';

const include = {
  category: true,
};

export type NoteWithCategory = Note & { category: Category };

export interface NoteRepository {
  findAll(userId: number): Promise<NoteWithCategory[]>;
  findById(id: number): Promise<NoteWithCategory | null>;
  create(data: { title: string; content: string; categoryId: number; imageUrl?: string; latitude?: number; longitude?: number; userId: number }): Promise<NoteWithCategory>;
  update(id: number, data: { title?: string; content?: string; categoryId?: number; imageUrl?: string; latitude?: number; longitude?: number }): Promise<NoteWithCategory>;
  remove(id: number): Promise<void>;
}

export const noteRepository: NoteRepository = {
  findAll(userId) {
    return prisma.note.findMany({
      where: { userId },
      include,
      orderBy: { createdAt: 'desc' },
    });
  },

  findById(id) {
    return prisma.note.findUnique({ where: { id }, include });
  },

  create(data) {
    return prisma.note.create({ data, include });
  },

  update(id, data) {
    return prisma.note.update({ where: { id }, data, include });
  },

  remove(id) {
    return prisma.note.delete({ where: { id } }).then(() => undefined);
  },
};
