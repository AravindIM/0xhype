import { Plus } from "lucide-react";

interface FabProps {
  onClick: () => void;
}

export function Fab({ onClick }: FabProps) {
  return (
    <button
      onClick={onClick}
      className="md:hidden fixed bottom-6 right-6 z-50 size-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-transform"
      aria-label="Post"
    >
      <Plus className="size-6" />
    </button>
  );
}
