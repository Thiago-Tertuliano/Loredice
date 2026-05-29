import { render, fireEvent } from '@testing-library/react-native';
import { PlayerScoreCard } from '../../src/components/scoreboard/PlayerScoreCard';

describe('PlayerScoreCard', () => {
  it('exibe nome e pontuação', () => {
    const { getByText } = render(
      <PlayerScoreCard
        name="Alice"
        score={5}
        isWinner={false}
        onIncrement={jest.fn()}
        onDecrement={jest.fn()}
      />,
    );
    expect(getByText('Alice')).toBeTruthy();
    expect(getByText('5')).toBeTruthy();
  });

  it('chama onIncrement ao pressionar +1', () => {
    const onIncrement = jest.fn();
    const { getByText } = render(
      <PlayerScoreCard
        name="Alice"
        score={0}
        isWinner={false}
        onIncrement={onIncrement}
        onDecrement={jest.fn()}
      />,
    );
    fireEvent.press(getByText('+1'));
    expect(onIncrement).toHaveBeenCalled();
  });
});
