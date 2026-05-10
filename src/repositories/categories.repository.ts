import { prisma } from '../lib/prisma.js';
import type { Category } from '../generated/prisma/client.js';

export interface CategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: number): Promise<Category | null>;
  create(data: { name: string }): Promise<Category>;
  remove(id: number): Promise<void>;
}

export const categoryRepository: CategoryRepository = {
  findAll() {
    return prisma.category.findMany({ orderBy: { name: 'asc' } });
  },

  findById(id) {
    return prisma.category.findUnique({ where: { id } });
  },

  create(data) {
    return prisma.category.create({ data });
  },

  remove(id) {
    return prisma.category.delete({ where: { id } }).then(() => undefined);
  },
};
