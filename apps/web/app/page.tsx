import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"

export default function Page() {
  return (
    <div className="flex min-h-svh">
      <div className="w-[30%] h-screen bg-secondary/40">
        <div className="w-full h-10 flex items-center px-4 py-8 bg-secondary/80">Heading</div>
        <ul className="flex w-full gap-px">
          <li className="w-full"><Button className={"w-full border-none"}>Item 1</Button></li>
          <li className="w-full"><Button className={"w-full border-none"}>Item 2</Button></li>
          <li className="w-full"><Button className={"w-full border-none"}>Item 3</Button></li>
        </ul>
        <div className="flex flex-col gap-2 p-2">
          <p>Contacts</p>
          <div className="flex gap-2">
            <Input placeholder="First Name" className="w-full border-none" />
            <Input placeholder="Last Name" className="w-full border-none" />
          </div>
          <Input placeholder="Email" className="w-full border-none" />
          <Textarea placeholder="Message" className="w-full border-none" />
        </div>
      </div>
    </div>
  )
}
