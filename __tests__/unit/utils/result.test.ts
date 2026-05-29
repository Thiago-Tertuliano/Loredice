import { success, failure } from '../../../src/utils/results';

describe('result', () => {
  it('success cria resultado com data', () => {
    const r = success(42);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toBe(42);
  });

  it('failure cria resultado com erro', () => {
    const r = failure('deu ruim');
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error).toBe('deu ruim');
  });
});
