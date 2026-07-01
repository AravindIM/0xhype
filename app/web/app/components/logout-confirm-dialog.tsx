import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

export function LogoutConfirmDialog({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onCancel() }}>
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
          <Button className="w-full rounded-full" onClick={onConfirm}>
            Log out
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-full"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
