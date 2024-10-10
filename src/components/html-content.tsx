"use client";

import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface HtmlContentProps {
  html: string;
  className?: string;
}

export const HtmlContent = ({ html, className = "" }: HtmlContentProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <span className="flex items-center justify-start h-5">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </span>
    );
  }

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html || "" }}
    />
  );
};
