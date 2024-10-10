"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Placeholder from "@tiptap/extension-placeholder";
import { Toggle } from "@/components/ui/toggle";
import sanitizeHtml from "sanitize-html";

import {
  Bold,
  HeadingIcon,
  Italic,
  List,
  ListOrdered,
  SeparatorHorizontal,
  Strikethrough,
  UnderlineIcon,
} from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

const Tiptap = ({
  value,
  className,
  setValue,
  editable,
  placeholder,
}: {
  value: string;
  className?: string;
  setValue: (value: string) => void;
  editable: boolean;
  placeholder: string;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-4",
          },
        },

        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-4",
          },
        },
      }),
      Heading.configure({
        levels: [2],
      }),
      Underline,
      HorizontalRule,
      Placeholder.configure({
        placeholder: placeholder,
        emptyNodeClass:
          "first:before:text-gray-600 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none",
      }),
    ],
    onUpdate: ({ editor }) => {
      const content = sanitizeHtml(editor.getHTML());
      setValue(content);
    },
    editorProps: {
      attributes: {
        class: `${className} prose dark:prose-invert sm:max-w-none w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50`,
      },
    },
    content: value,
  });

  useEffect(() => {
    if (editor?.isEmpty) editor.commands.setContent(value);
  }, [value, editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  return (
    <div>
      {editor && (
        <div
          className={cn(
            "border rounded-md inline-flex mb-2 gap-x-2",
            !editable ? "hidden" : "visible"
          )}
        >
          <Toggle
            pressed={editor.isActive("bold")}
            size={"sm"}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="w-4 h-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            size={"sm"}
          >
            <Italic className="w-4 h-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("underline")}
            onPressedChange={() =>
              editor.chain().focus().toggleUnderline().run()
            }
            size={"sm"}
          >
            <UnderlineIcon className="w-4 h-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("orderedList")}
            onPressedChange={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
            size={"sm"}
          >
            <ListOrdered className="w-4 h-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("bulletList")}
            onPressedChange={() =>
              editor.chain().focus().toggleBulletList().run()
            }
            size={"sm"}
          >
            <List className="w-4 h-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("heading", { level: 2 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            size={"sm"}
          >
            <HeadingIcon className="w-4 h-4" />
          </Toggle>
          <Toggle
            pressed={false}
            onPressedChange={() =>
              editor.chain().focus().setHorizontalRule().run()
            }
            size={"sm"}
          >
            <SeparatorHorizontal className="w-4 h-4" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("strike")}
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            size={"sm"}
          >
            <Strikethrough className="w-4 h-4" />
          </Toggle>
        </div>
      )}
      <EditorContent editor={editor} className="" />
    </div>
  );
};

export default Tiptap;
