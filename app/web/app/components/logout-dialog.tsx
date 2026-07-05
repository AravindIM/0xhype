import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "~/context/auth-context";

interface LogoutDialogValue {
  open: () => void;
}

const LogoutDialogContext = createContext<LogoutDialogValue | null>(null);

export function LogoutDialogProvider({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Public surface is just `open`; `open` is a stable useCallback, so the value
  // never changes identity and consumers never re-render from context churn.
  const value = useMemo<LogoutDialogValue>(() => ({ open }), [open]);

  return (
    <LogoutDialogContext.Provider value={value}>
      {children}
      <Dialog open={isOpen} onOpenChange={(o) => { if (!o) close(); }}>
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
            <Button className="w-full rounded-full" onClick={logout}>
              Log out
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full"
              onClick={close}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </LogoutDialogContext.Provider>
  );
}

export function useLogoutDialog() {
  const ctx = useContext(LogoutDialogContext);
  if (!ctx)
    throw new Error("useLogoutDialog must be used within LogoutDialogProvider");
  return ctx;
}
