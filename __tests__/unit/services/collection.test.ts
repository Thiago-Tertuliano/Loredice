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

import { validarGame } from '../../../src/services/collection';

describe('validarGame', () => {
  it('retorna success para dados válidos', () => {
    const result = validarGame({ titulo: 'Catan' });
    expect(result.success).toBe(true);
  });

  it('retorna failure para título vazio', () => {
    const result = validarGame({ titulo: '' });
    expect(result.success).toBe(false);
  });

  it('retorna failure para avaliação > 5', () => {
    const result = validarGame({ titulo: 'Catan', avaliacaoPessoal: 6 });
    expect(result.success).toBe(false);
  });

  it('retorna failure para min > max', () => {
    const result = validarGame({ titulo: 'Catan', qtdJogadoresMin: 6, qtdJogadoresMax: 2 });
    expect(result.success).toBe(false);
  });
});
