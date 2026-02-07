import { categoryThemes } from '@/data/artworks';
import CategoryContent from './CategoryContent';

export async function generateStaticParams() {
    return Object.keys(categoryThemes).map((category) => ({
        category: category,
    }));
}

export default function Page() {
    return <CategoryContent />;
}
