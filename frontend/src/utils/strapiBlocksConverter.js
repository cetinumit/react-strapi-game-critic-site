// 1. Tiptap JSON formatını -> Strapi Blocks JSON formatına çevirir (Kaydederken kullanılır)
export const tiptapToStrapi = (tiptapJson) => {
  if (!tiptapJson || !tiptapJson.content) return [];

  const convertNode = (node) => {
    const strapiNode = { type: node.type };

    // Tiptap'taki 'content' dizisini -> Strapi'deki 'children' dizisine çevir
    if (node.content) {
      strapiNode.children = node.content.map(convertNode);
    } else if (node.type === "text") {
      strapiNode.text = node.text;

      // Formatları (Kalın, italik vb.) Strapi'nin istediği boolean değerlere çevir
      if (node.marks) {
        node.marks.forEach((mark) => {
          if (mark.type === "bold") strapiNode.bold = true;
          if (mark.type === "italic") strapiNode.italic = true;
        });
      }
    } else {
      // Eğer boş bir paragrafsa Strapi hata vermesin diye boş text node'u ekliyoruz
      strapiNode.children = [{ type: "text", text: "" }];
    }

    // Başlık seviyelerini (H1, H2, H3 vb.) eşleştir
    if (node.type === "heading") {
      strapiNode.level = node.attrs?.level || 1;
    }

    return strapiNode;
  };

  return tiptapJson.content.map(convertNode);
};

// 2. Strapi Blocks JSON formatını -> Tiptap JSON formatına çevirir
export const strapiToTiptap = (strapiBlocks) => {
  if (!Array.isArray(strapiBlocks) || strapiBlocks.length === 0) {
    return { type: "doc", content: [{ type: "paragraph" }] }; // Tamamen boşsa Tiptap hata vermesin diye varsayılan paragraf döndür
  }

  const convertNode = (node) => {
    const tiptapNode = { type: node.type };

    if (node.children) {
      // .filter(Boolean) ekledik: null dönen boş text node'larını diziden temizler
      tiptapNode.content = node.children.map(convertNode).filter(Boolean);
    } else if (node.type === "text") {
      // TIPTAP DÜZELTMESİ: Eğer text alanı boşsa null döndür (yukarıdaki filter bunu silecek)
      if (!node.text) return null;

      tiptapNode.text = node.text;

      const marks = [];
      if (node.bold) marks.push({ type: "bold" });
      if (node.italic) marks.push({ type: "italic" });

      if (marks.length > 0) {
        tiptapNode.marks = marks;
      }
    }

    if (node.type === "heading") {
      tiptapNode.attrs = { level: node.level };
    }

    return tiptapNode;
  };

  return {
    type: "doc",
    // Yine en dışta da filter(Boolean) kullanıyoruz ki patlamasın
    content: strapiBlocks.map(convertNode).filter(Boolean),
  };
};
