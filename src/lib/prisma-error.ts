import type { ContentfulStatusCode } from 'hono/utils/http-status';

type PrismaErrorMeta = { code?: string };

function isPrismaError(error: unknown): error is { code: string; meta?: PrismaErrorMeta } {
  return typeof error === 'object' && error !== null && 'code' in (error as Record<string, unknown>);
}

export function parsePrismaError(error: unknown): { status: ContentfulStatusCode; message: string } {
  if (isPrismaError(error)) {
    switch (error.code) {
      case 'P2002':
        return { status: 409, message: 'Ya existe un registro con ese valor único' };
      case 'P2003':
        return { status: 422, message: 'El registro referenciado no existe' };
      case 'P2025':
        return { status: 404, message: 'Registro no encontrado' };
      default:
        return { status: 500, message: `Error de base de datos (${error.code})` };
    }
  }

  return { status: 500, message: 'Error interno del servidor' };
}
