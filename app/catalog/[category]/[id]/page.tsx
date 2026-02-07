import { artworks } from '@/data/artworks';
import ProductContent from './ProductContent';

export async function generateStaticParams() {
    return artworks.map((artwork) => ({
        category: artwork.category,
        id: artwork.id,
    }));
}

export default function Page() {
    return <ProductContent />;
}
