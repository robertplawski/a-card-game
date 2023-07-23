export function BaseCard(props){
  const { symbol, centerSymbol = symbol, className, color, onClick} = props;
  return <div onClick={onClick} className={`text-[1em] w-20 overflow-hidden drop-shadow-sharp-sm aspect-[22/35] h-auto rounded-xl font-bold border-white outline-2 outline-black border-8 text-white flex justify-between items-center select-none flex-col ${className || ""} ${color || ""}`}>
    <div className="h-full w-full p-[0.5em] py-[0.25em] flex flex-col justify-between items-center">
      <div className={`underline-offset-4 self-start justify-start flex text-shadow-sharp-sm decoration-white ${(symbol == 6 || symbol == 9) ? 'underline' : ''}`}>{symbol}</div>
      <div className={`underline-offset-8 flex justify-center items-center decoration-white text-[2em] font-bolder text-shadow-sharp-sm ${(symbol == 6 || symbol == 9) ? 'underline' : ''}`}>{centerSymbol}</div>
      <div className={`underline-offset-4 self-end  justify-start rotate-180 text-shadow-sharp-sm decoration-white ${(symbol == 6 || symbol == 9) ? 'underline' : ''}`}>{symbol}</div>
    </div>
    {/*<div className="border-[0.3rem] border-white flex-1 w-[90%] h-full absolute rounded-[50%] rotate-[30deg]"></div>*/}
  </div>
}


const Color = {
  5: 'bg-neutral-600',
  0: 'bg-rose-500',
  1: 'bg-blue-500',
  2: 'bg-yellow-500',
  3: 'bg-green-500',
  4: 'bg-black'
}

const Symbol = {
  1: "+",
  2: "⇅",
  3: "⊘",
  4: "W",
  5: "+",
};


export function PlayingCard(props){
  const { card, className, onClick} = props;

  return <BaseCard 
  onClick={onClick}
  color={(card.symbol >= 4 && !card.color) ? Color[4] : Color[card.color]} 
  symbol={(card.symbol > 0) ? Symbol[card.symbol] : card.value}
  className={`min-w-[4rem] ${className || ""}`}/>
}