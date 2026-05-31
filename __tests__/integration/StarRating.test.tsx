import { render, fireEvent } from '@testing-library/react-native';
import { StarRating } from '../../src/components/ui/StarRating';

describe('StarRating', () => {
  it('renderiza 5 estrelas', () => {
    const { getAllByRole } = render(<StarRating value={3} />);
    expect(getAllByRole('button')).toHaveLength(5);
  });

  it('chama onChange ao clicar em uma estrela', () => {
    const onChange = jest.fn();
    const { getAllByRole } = render(<StarRating value={0} onChange={onChange} />);
    fireEvent.press(getAllByRole('button')[3]!);
    expect(onChange).toHaveBeenCalledWith(4);
  });
});
