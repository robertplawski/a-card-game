const Color = {
  Red: 0,
  Blue: 1,
  Yellow: 2,
  Green: 3,
};
const Action = {
  Draw: 0,
  Play: 1,
};

const Symbol = {
  Number: 0,
  Draw: 1,
  Reverse: 2,
  Skip: 3,
  Wild: 4,
  WildDraw: 5,
};

const generateNumbers = () => {
  const result = [];
  for (const color in Color) {
    for (let i = 1; i < 10; i++) {
      result.push({
        color: Color[color],
        symbol: Symbol.Number,
        value: i,
      });
    }
  }
  console.log(result);
  return result;
};

const generateSpecial = (type) => {
  const result = [];
  for (const color in Color) {
    result.push({
      color: Color[color],
      symbol: type,
    });
  }
  console.log(result);
  return result;
};

const generateSpecials = () => {
  const result = [];
  for (const symbol in Symbol) {
    if (Symbol[symbol] == 0) continue;
    if (Symbol[symbol] >= 4) break;
    result.push(...generateSpecial(Symbol[symbol]));
  }

  return result;
};

const generateCards = () => {
  return [
    ...generateNumbers(),
    ...generateSpecials(),
    { symbol: 4 },
    { symbol: 5 },
  ];
};

const cards = [...generateCards()];

module.exports = {
  cards,
  Symbol,
  Action,
  Color,
};
