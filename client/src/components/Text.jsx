export function TitleText(props){
  const {children, className} = props;
  return <p className={`text-8xl text-stroke-2 font-black text-yellow-400 z-0 text-shadow-sharp-md ${className || ""}`}>{children}</p>
}

export function SubtitleText(props){
  const {children, className} = props;
  return <p className={`text-4xl font-black text-shadow-sharp-sm ${className || ""}`}>{children}</p>
}
