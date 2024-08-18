export default function Message({ ownedByMe, text, alias }: { ownedByMe: boolean, text: string, alias: string }) {
  return (
    <div className={`${ownedByMe ? "flex justify-end text-white" : ""} text-sm md:text-base`}>
      <div className={`${ownedByMe ? "bg-blue-500" : "bg-gray-300"} 
         rounded-md w-1/2 md:w-1/3 p-2 px-4 break-words 
         font-semibold whitespace-pre-wrap`}>
         <p className="text-gray-900 font-bold">{ownedByMe ? "" : `${alias}:`}</p>
         <p className="pl-1">{text}</p>
      </div>
    </div>

  )
}
