import {
  validarJogadores,
  calcularVencedor,
  formatarTempo,
} from '../../../src/services/scoreboard';

describe('validarJogadores', () => {
  it('retorna success para 2+ jogadores válidos', () => {
    const result = validarJogadores(['Alice', 'Bob']);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual(['Alice', 'Bob']);
  });

  it('retorna failure para menos de 2 jogadores', () => {
    const result = validarJogadores(['Alice']);
    expect(result.success).toBe(false);
  });

  it('retorna failure para nomes vazios', () => {
    const result = validarJogadores(['', '']);
    expect(result.success).toBe(false);
  });

  it('retorna failure para nomes duplicados', () => {
    const result = validarJogadores(['Alice', 'Alice']);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toContain('repetir');
  });
});

describe('calcularVencedor', () => {
  it('retorna null quando ninguém atingiu o limite', () => {
    expect(
      calcularVencedor(
        [
          { nome: 'A', pontuacao: 5 },
          { nome: 'B', pontuacao: 3 },
        ],
        12,
      ),
    ).toBeNull();
  });

  it('retorna o nome do jogador que atingiu o limite', () => {
    expect(
      calcularVencedor(
        [
          { nome: 'A', pontuacao: 12 },
          { nome: 'B', pontuacao: 5 },
        ],
        12,
      ),
    ).toBe('A');
  });
});

describe('formatarTempo', () => {
  it('formata 0 segundos', () => expect(formatarTempo(0)).toBe('00:00'));
  it('formata 65 segundos', () => expect(formatarTempo(65)).toBe('01:05'));
  it('formata 3661 segundos', () => expect(formatarTempo(3661)).toBe('61:01'));
});
