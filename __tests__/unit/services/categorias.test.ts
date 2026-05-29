jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    runSync: jest.fn(),
    getAllSync: jest.fn(),
  })),
}));

jest.mock('drizzle-orm/expo-sqlite', () => ({
  drizzle: jest.fn(() => ({
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  })),
}));

import { validarCategoria } from '../../../src/services/categorias';

describe('validarCategoria', () => {
  it('retorna success para nome válido', () => {
    const result = validarCategoria({ nome: 'Estratégia' });
    expect(result.success).toBe(true);
  });

  it('retorna failure para nome vazio', () => {
    const result = validarCategoria({ nome: '' });
    expect(result.success).toBe(false);
  });

  it('retorna failure para nome só com espaços', () => {
    const result = validarCategoria({ nome: '   ' });
    expect(result.success).toBe(false);
  });
});
