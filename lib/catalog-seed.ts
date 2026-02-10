import { artworks } from "@/data/artworks";
import db, { createCatalogItem } from "@/lib/db";

export function ensureCatalogSeeded() {
  const row = db
    .prepare("SELECT COUNT(*) as count FROM catalog_items")
    .get() as {
    count: number;
  };

  if (row.count > 0) return;

  artworks.forEach((artwork, index) => {
    createCatalogItem({
      slug: artwork.id,
      category: artwork.category,
      title: artwork.title,
      artist: artwork.artist || null,
      price: artwork.price,
      image: artwork.image,
      videoSrc: artwork.videoSrc || null,
      imagesJson: artwork.images ? JSON.stringify(artwork.images) : null,
      aspectRatio: artwork.aspectRatio,
      tagsJson: artwork.tags ? JSON.stringify(artwork.tags) : null,
      description: artwork.description || null,
      isNew: Boolean(artwork.isNew),
      optionsJson: artwork.options ? JSON.stringify(artwork.options) : null,
      status: "active",
      sortOrder: index,
    });
  });
}
