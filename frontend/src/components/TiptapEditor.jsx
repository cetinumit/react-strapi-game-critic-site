import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
// Yeni yazdığımız fonksiyonları import ediyoruz
import { tiptapToStrapi, strapiToTiptap } from "../utils/strapiBlocksConverter";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const btn = (isActive) => `
    px-3 py-1.5 text-[10px] font-data font-bold uppercase tracking-widest
    border transition-colors
    ${
      isActive
        ? "bg-phosphor text-black border-phosphor"
        : "bg-transparent text-zinc-500 border-line hover:text-white hover:border-zinc-600"
    }
  `;

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-void border-b border-line">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        className={btn(editor.isActive("bold"))}
      >
        Kalın
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        className={btn(editor.isActive("italic"))}
      >
        İtalik
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }}
        className={btn(editor.isActive("heading", { level: 3 }))}
      >
        H3 Başlık
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBlockquote().run();
        }}
        className={btn(editor.isActive("blockquote"))}
      >
        Alıntı
      </button>
    </div>
  );
};

const TiptapEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      // horizontalRule'un Strapi Blocks'ta karşılığı yok; StarterKit'in
      // "---" kısayolu yüzünden kazayla oluşup kaydı bozabiliyor.
      StarterKit.configure({ horizontalRule: false }),
    ],
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
        // DİKKAT: burası React değil, ProseMirror'a giden ham DOM özniteliği.
        // "className" yazılırsa hiçbir sınıf uygulanmaz — "class" olmalı.
        // prose-* varyantları da kullanılamıyor (@tailwindcss/typography kurulu
        // değil), o yüzden alt elemanları doğrudan hedefliyoruz.
        class: [
          "p-4 min-h-[320px] focus:outline-none text-zinc-300 leading-relaxed",
          "[&_p]:mb-4",
          "[&_h3]:text-white [&_h3]:font-gaming [&_h3]:font-black [&_h3]:text-lg",
          "[&_h3]:uppercase [&_h3]:tracking-tight [&_h3]:mt-6 [&_h3]:mb-3",
          "[&_strong]:text-white [&_strong]:font-bold",
          "[&_em]:italic",
          "[&_blockquote]:border-l-2 [&_blockquote]:border-phosphor",
          "[&_blockquote]:pl-4 [&_blockquote]:text-zinc-400 [&_blockquote]:italic",
          "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
          "[&_li]:mb-1",
        ].join(" "),
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
    <div className="flex flex-col border border-line bg-void focus-within:border-phosphor transition-colors">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
