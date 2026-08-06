import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
// Yeni yazdığımız fonksiyonları import ediyoruz
import { tiptapToStrapi, strapiToTiptap } from "../utils/strapiBlocksConverter";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const getButtonClass = (isActive) => `
    px-3 py-1.5 rounded-md text-sm font-medium transition-colors
    ${
      isActive
        ? "bg-zinc-700 text-white"
        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
    }
  `;

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-zinc-900 border-b border-zinc-700 rounded-t-md">
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        className={getButtonClass(editor.isActive("bold"))}
      >
        Kalın
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        className={getButtonClass(editor.isActive("italic"))}
      >
        İtalik
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }}
        className={getButtonClass(editor.isActive("heading", { level: 3 }))}
      >
        H3 Başlık
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBlockquote().run();
        }}
        className={getButtonClass(editor.isActive("blockquote"))}
      >
        Alıntı
      </button>
    </div>
  );
};

const TiptapEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    // Strapi'den gelen JSON'ı Tiptap'ın okuyabileceği formata çevirip veriyoruz
    content: value ? strapiToTiptap(value) : "",
    onUpdate: ({ editor }) => {
      // Editörde yazı yazıldıkça JSON çıktısını alıp Strapi'nin formatına çeviriyoruz
      const tiptapJson = editor.getJSON();
      const strapiBlocks = tiptapToStrapi(tiptapJson);
      onChange(strapiBlocks); // EditReview.jsx'teki state'i güncelliyor
    },
    editorProps: {
      attributes: {
        className:
          "prose prose-invert max-w-none p-4 min-h-[250px] focus:outline-none text-zinc-300 prose-headings:text-zinc-100 prose-a:text-blue-400",
      },
    },
  });

  // Strapi'den veri asenkron gelebileceği için, value sonradan değişirse editörü güncelliyoruz
  useEffect(() => {
    if (editor && value && editor.isEmpty) {
      editor.commands.setContent(strapiToTiptap(value));
    }
  }, [value, editor]);

  return (
    <div className="flex flex-col border border-zinc-700 rounded-md bg-zinc-950 focus-within:border-zinc-500 transition-colors">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
