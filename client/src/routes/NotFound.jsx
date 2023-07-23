import { LinkButton } from "../components/Button"
import { TitleText } from "../components/Text"
import { BaseCard } from "../components/Card";

export function NotFound(){
  return <div className="flex justify-center items-center flex-col gap-16 bg-blue-400 h-screen">
    <BaseCard className="bg-red-500 absolute scale-[3.5]" symbol={4} center_symbol={0}/>
    <TitleText>not found</TitleText>
    <div className="flex justify-center items-center flex-col gap-4 z-10 top-10 relative">
      <LinkButton href="/">Back to menu</LinkButton>
    </div>
  </div>
}
