export function BaseButton(props){
  const {children, className, onClick} = props;
  return <div onClick={onClick} className={`cursor-pointer p-4 drop-shadow-sharp-md hover:drop-shadow-sharp-sm hover:translate-y-[0.25rem] hover:-translate-x-[0.25rem] font-bold bg-white hover:bg-gray-200 rounded-xl transition-all ${className || ""}`}>{children}</div>  
}

export function LinkButton(props){
  const {children, href} = props;
  return <a href={href}><BaseButton>{children}</BaseButton></a>
}
