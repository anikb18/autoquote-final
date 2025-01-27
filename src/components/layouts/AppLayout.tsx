"use client";

import * as Headless from "@headlessui/react";
import React, { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "../dashboard/DashboardSidebar";

function MobileSidebar({
  open,
  close,
  children,
}: React.PropsWithChildren<{ open: boolean; close: () => void }>) {
  return (
    <Headless.Transition show={open}>
      <Headless.Dialog onClose={close} className="lg:hidden">
        <Headless.TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Headless.TransitionChild>
        <Headless.TransitionChild
          enter="ease-in-out duration-300"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <Headless.DialogPanel className="fixed inset-y-0 w-full max-w-72 bg-white p-4 shadow-xl">
            {children}
          </Headless.DialogPanel>
        </Headless.TransitionChild>
      </Headless.Dialog>
    </Headless.Transition>
  );
}

export function AppLayout({ children }: React.PropsWithChildren) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="relative isolate flex min-h-screen w-full bg-white max-lg:flex-col lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 w-72 max-lg:hidden">
        <DashboardSidebar />
      </div>

      {/* Mobile sidebar */}
      <MobileSidebar open={showSidebar} close={() => setShowSidebar(false)}>
        <DashboardSidebar />
      </MobileSidebar>

      {/* Mobile header */}
      <header className="flex h-16 items-center gap-4 border-b px-4 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSidebar(true)}
          className="shrink-0"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open navigation</span>
        </Button>
        <div className="flex min-w-0 flex-1 items-center justify-between">
          <img className="h-8 w-auto" src="/logo/dark.svg" alt="AutoQuote24" />
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col pb-2 lg:min-w-0 lg:pl-72 lg:pr-2 lg:pt-2">
        <div className="grow rounded-lg bg-white p-6 shadow-sm ring-1 ring-zinc-950/5 dark:bg-zinc-900 dark:ring-white/10 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </div>
      </main>
    </div>
  );
}
