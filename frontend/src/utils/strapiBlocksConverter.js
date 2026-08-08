// Tiptap ile Strapi Blocks aynı blok adlarını kullanmıyor. Tipler olduğu gibi
// geçirilirse Strapi "Block node is of invalid type" hatası veriyor.
//
//   Tiptap                    Strapi Blocks
//   ------------------------  ---------------------------------
//   blockquote                quote
//   bulletList / orderedList  list  (+ format: unordered/ordered)
//   listItem                  list-item
//   codeBlock                 code
//   strike (mark)             strikethrough
//
// Yapısal fark: Strapi'de quote ve list-item'ın children'ı doğrudan metin
// düğümleridir; Tiptap'ta ise içeride bir paragraf katmanı vardır. Bu yüzden
// kaydederken düzleştiriyor, okurken paragrafa geri sarıyoruz.

/* ---------------------------------- Tiptap -> Strapi ---------------------- */

const inlineToStrapi = (node) => {
  if (node.type === "hardBreak") {
    // Strapi'de satır sonu düğümü yok; metne indirgiyoruz ki kaybolmasın
    return { type: "text", text: "\n" };
  }
  if (node.type !== "text") return null;

  const out = { type: "text", text: node.text || "" };
  (node.marks || []).forEach((mark) => {
    if (mark.type === "bold") out.bold = true;
    if (mark.type === "italic") out.italic = true;
    if (mark.type === "strike") out.strikethrough = true;
    if (mark.type === "code") out.code = true;
  });
  return out;
};

// İçteki paragraf katmanlarını düzleştirip yalnızca metin düğümleri bırakır
const flattenInline = (nodes = []) => {
  const out = [];
  nodes.forEach((n) => {
    if (n.content) out.push(...flattenInline(n.content));
    else {
      const t = inlineToStrapi(n);
      if (t) out.push(t);
    }
  });
  // Strapi boş children kabul etmiyor
  return out.length ? out : [{ type: "text", text: "" }];
};

const blockToStrapi = (node) => {
  switch (node.type) {
    case "heading":
      return {
        type: "heading",
        level: node.attrs?.level || 1,
        children: flattenInline(node.content),
      };

    case "blockquote":
      return { type: "quote", children: flattenInline(node.content) };

    case "codeBlock":
      return { type: "code", children: flattenInline(node.content) };

    case "bulletList":
    case "orderedList":
      return {
        type: "list",
        format: node.type === "orderedList" ? "ordered" : "unordered",
        children: (node.content || []).map((li) => ({
          type: "list-item",
          children: flattenInline(li.content),
        })),
      };

    case "paragraph":
    default:
      // Tanımadığımız bir blok gelirse paragrafa indiriyoruz; Strapi'ye
      // geçersiz tip göndermektense metni korumak daha iyi
      return { type: "paragraph", children: flattenInline(node.content) };
  }
};

export const tiptapToStrapi = (tiptapJson) => {
  if (!tiptapJson || !tiptapJson.content) return [];
  return tiptapJson.content.map(blockToStrapi);
};

/* ---------------------------------- Strapi -> Tiptap ---------------------- */

const inlineToTiptap = (node) => {
  if (!node || node.type !== "text" || !node.text) return null;

  const marks = [];
  if (node.bold) marks.push({ type: "bold" });
  if (node.italic) marks.push({ type: "italic" });
  if (node.strikethrough) marks.push({ type: "strike" });
  if (node.code) marks.push({ type: "code" });

  const out = { type: "text", text: node.text };
  if (marks.length) out.marks = marks;
  return out;
};

const inlineList = (children = []) =>
  children.flatMap((n) => {
    // Strapi'de link ayrı bir düğüm; StarterKit'te link eklentisi yok,
    // metnini koruyup biçimini düşürüyoruz
    if (n?.type === "link") return inlineList(n.children);
    const t = inlineToTiptap(n);
    return t ? [t] : [];
  });

// quote ve list-item Tiptap tarafında paragraf sarmalayıcı ister
const wrapInParagraph = (children) => {
  const inline = inlineList(children);
  return [inline.length ? { type: "paragraph", content: inline } : { type: "paragraph" }];
};

const blockToTiptap = (node) => {
  if (!node) return null;

  switch (node.type) {
    case "heading": {
      const content = inlineList(node.children);
      return {
        type: "heading",
        attrs: { level: node.level || 1 },
        ...(content.length ? { content } : {}),
      };
    }

    case "quote":
      return { type: "blockquote", content: wrapInParagraph(node.children) };

    case "code": {
      const content = inlineList(node.children);
      return { type: "codeBlock", ...(content.length ? { content } : {}) };
    }

    case "list":
      return {
        type: node.format === "ordered" ? "orderedList" : "bulletList",
        content: (node.children || []).map((li) => ({
          type: "listItem",
          content: wrapInParagraph(li.children),
        })),
      };

    case "image":
      // Editörde görsel desteklemiyoruz; bloğu düşürüyoruz ki Tiptap patlamasın
      return null;

    case "paragraph":
    default: {
      const content = inlineList(node.children);
      return { type: "paragraph", ...(content.length ? { content } : {}) };
    }
  }
};

export const strapiToTiptap = (strapiBlocks) => {
  if (!Array.isArray(strapiBlocks) || strapiBlocks.length === 0) {
    // Tamamen boşsa Tiptap hata vermesin diye varsayılan paragraf döndür
    return { type: "doc", content: [{ type: "paragraph" }] };
  }

  const content = strapiBlocks.map(blockToTiptap).filter(Boolean);
  return {
    type: "doc",
    content: content.length ? content : [{ type: "paragraph" }],
  };
};
