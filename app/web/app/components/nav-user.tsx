import { useState } from "react"
import { ChevronsUpDown } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "~/context/auth-context"

export function NavUser() {
  const { user, logout } = useAuth()
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (!user) return null

  const initials = user.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="rounded-full h-14 pl-1.5 pr-4 justify-start data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar size="lg">
                <AvatarImage src={user.avatarUrl ?? undefined} alt={user.displayName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.displayName}</span>
                <span className="truncate text-xs text-muted-foreground">@{user.username}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-2xl p-0 overflow-hidden"
            side="top"
            align="end"
          >
            <DropdownMenuItem
              className="rounded-none px-4 py-3"
              onSelect={(e) => {
                e.preventDefault()
                setConfirmOpen(true)
              }}
            >
              Log out <span className="font-semibold">@{user.username}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent
          showCloseButton={false}
          className="flex flex-col items-center justify-center gap-6 top-0 left-0 translate-x-0 translate-y-0 max-w-none w-full h-dvh rounded-none border-0 px-6 text-center sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:max-w-sm sm:h-auto sm:rounded-lg sm:border sm:py-8"
        >
          <div className="flex flex-col gap-2">
            <DialogTitle className="text-xl">Log out of 0xhype?</DialogTitle>
            <DialogDescription>
              You can always log back in at any time.
            </DialogDescription>
          </div>
          <div className="flex w-full flex-col gap-2">
            <Button
              className="w-full rounded-full"
              onClick={() => {
                logout()
                setConfirmOpen(false)
              }}
            >
              Log out
            </Button>
            <DialogClose asChild>
              <Button variant="outline" className="w-full rounded-full">
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarMenu>
  )
}
