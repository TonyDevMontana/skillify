import React from "react";

interface ChapterPageProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

function Chapter({ params }: ChapterPageProps) {
  return <div className="mt-24 text-4xl">{params.chapterId}</div>;
}

export default Chapter;
