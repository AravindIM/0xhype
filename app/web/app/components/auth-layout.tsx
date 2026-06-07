import Logo from "@/assets/logo.svg?react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 bg-black items-center justify-center p-12">
        <Logo className="w-1/2 h-auto text-white" />
      </div>
      <div className="flex-1 flex flex-col p-8 md:px-16 md:py-12">
        <Logo className="size-8 text-primary mb-8 md:mb-10" />
        <div className="flex flex-col gap-4 max-w-sm">{children}</div>
      </div>
    </div>
  );
}
