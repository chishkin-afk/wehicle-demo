"use client";

import NextLink, { useLinkStatus } from "next/link";
import type { ComponentProps } from "react";
import { createPortal } from "react-dom";

function NavigationStatus() {
  const { pending } = useLinkStatus();

  if (!pending) return null;

  return createPortal(
    <span className='sr-only' data-navigation-pending role='status'>
      Загружаем страницу…
    </span>,
    document.body,
  );
}

export default function Link({
  children,
  ...props
}: ComponentProps<typeof NextLink>) {
  return (
    <NextLink {...props}>
      {children}
      <NavigationStatus />
    </NextLink>
  );
}
