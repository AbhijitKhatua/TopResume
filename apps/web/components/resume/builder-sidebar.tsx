"use client"

import { BlockList } from "@/components/resume/block-list"
import { PersonalForm } from "@/components/resume/personal-form"
import { StylePanel } from "@/components/resume/style-panel"
import { UserMenu } from "@/components/resume/user-menu"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

export function BuilderSidebar() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <Tabs defaultValue="personal" className="flex min-h-0 flex-1 flex-col">
        <TabsList className="grid w-full grid-cols-3 rounded-none border-b bg-transparent p-0">
          <TabsTrigger value="personal" className="rounded-none">
            Personal
          </TabsTrigger>
          <TabsTrigger value="blocks" className="rounded-none">
            Blocks
          </TabsTrigger>
          <TabsTrigger value="style" className="rounded-none">
            Style
          </TabsTrigger>
        </TabsList>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <TabsContent value="personal" className="m-0">
            <PersonalForm />
          </TabsContent>
          <TabsContent value="blocks" className="m-0 p-4">
            <BlockList />
          </TabsContent>
          <TabsContent value="style" className="m-0">
            <StylePanel />
          </TabsContent>
        </div>
      </Tabs>

      <UserMenu />
    </div>
  )
}
