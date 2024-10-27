"use client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreatorCoursesTable({
  courses,
}: {
  courses:
    | {
        id: string;
        name: string;
        price: number;
        published: boolean;
      }[]
    | undefined;
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = courses?.filter((course) => {
    if (course.name)
      return course.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <Input
        type="text"
        placeholder="Search courses by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-6 p-2 w-full border border-gray-300 rounded-lg"
      />
      <Table className="">
        <TableCaption>A list of your created courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">Name</TableHead>
            <TableHead className="">Published</TableHead>
            <TableHead className="">Amount</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCourses?.map((item, index) => {
            return (
              <TableRow
                key={index}
                onClick={() => router.push(`/creator/course/${item.id}`)}
                className="cursor-pointer"
              >
                <TableCell className="">{item.name}</TableCell>
                <TableCell>
                  {item.published ? (
                    <Badge className="bg-green-500 hover:bg-green-400">
                      Published
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500 hover:bg-red-600">
                      Unpublished
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {item.price === 0 ? (
                    <Badge className="font-semibold">FREE</Badge>
                  ) : (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      ₹{item.price.toString()}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <ChevronRight />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}
