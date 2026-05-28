import type { ComponentProps, ReactNode } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/components/ui/utils";

export function AuthScreenShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-white px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-6rem] top-[-5rem] h-56 w-56 rounded-full bg-sky-100 blur-3xl" />
        <div className="absolute right-[-5rem] top-24 h-48 w-48 rounded-full bg-blue-100/80 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-zinc-200/70 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {children}
      </div>
    </div>
  );
}

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="w-full rounded-[24px] border border-border/80 bg-card/95 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur">
      {children}
    </div>
  );
}

export function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="space-y-2 text-center">
      <h1 className="text-[28px] font-semibold leading-tight text-foreground">{title}</h1>
      <p className="text-[13px] leading-5 text-muted-foreground">{subtitle}</p>
    </div>
  );
}

export function AuthField({
  label,
  error,
  className,
  ...props
}: ComponentProps<typeof Input> & {
  label: string;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <Input
        {...props}
        className={cn("h-11 border-border bg-input-background text-foreground placeholder:text-muted-foreground", className)}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

export function ErrorBanner({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2">
      <p className="text-sm leading-5 text-red-300">{message}</p>
    </div>
  );
}

export function SuccessBanner({ message }: { message?: ReactNode }) {
  if (!message) return null;

  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
      <div className="text-sm leading-5 text-emerald-700">{message}</div>
    </div>
  );
}

export function PrimaryButton({
  children,
  className,
  ...props
}: ComponentProps<typeof Button>) {
  return <Button {...props} className={cn("h-11 w-full rounded-xl text-sm font-semibold", className)}>{children}</Button>;
}

export function TelegramButton({
  children,
  className,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className={cn(
        "h-11 w-full rounded-xl border border-[#229ED9] bg-[#229ED9] text-sm font-semibold text-white hover:bg-[#1f8fc9]",
        className
      )}
    >
      {children}
    </Button>
  );
}

export function DividerLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="h-px flex-1 bg-border" />
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{children}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

export function InlineLink({
  children,
  muted,
  className,
  ...props
}: ComponentProps<typeof Link> & { children: ReactNode; muted?: boolean }) {
  return (
    <Link
      {...props}
      className={cn(
        "text-sm font-semibold underline-offset-4 hover:underline",
        muted ? "text-muted-foreground hover:text-foreground" : "text-primary",
        className
      )}
    >
      {children}
    </Link>
  );
}
