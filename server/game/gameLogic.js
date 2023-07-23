const isMoveValid = (card, discardPile) => {
  if (card.symbol >= 4) return true;
  if (card.color == discardPile.color) return true;
  if (
    discardPile.symbol == 0 &&
    card.symbol == 0 &&
    card.value == discardPile.value
  )
    return true;
  if (
    card.symbol == discardPile.symbol &&
    discardPile.symbol != 0 &&
    card.symbol != 0
  )
    return true;
  return false;
};

module.exports = { isMoveValid };
