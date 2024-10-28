import React from "react";

export default function Course({ params }: { params: { id: string } }) {
  return <div className="mt-32 text-4xl">{params.id}</div>;
}
