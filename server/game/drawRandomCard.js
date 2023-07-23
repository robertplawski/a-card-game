const { cards } = require("./cards.js");

const drawRandomCard = () => {
  const random = cards[Math.floor(Math.random() * cards.length)];
  console.log(random);
  return random;
};

const drawRandomCards = (amount, excluded = []) => {
  const result = [];
  for (let i = 0; i < amount; i++) {
    let randomCard;
    while (true) {
      randomCard = drawRandomCard();
      if (excluded.includes(randomCard) === false) break;
    }
    result.push(randomCard);
  }
  return result;
};

module.exports = { drawRandomCard, drawRandomCards };
