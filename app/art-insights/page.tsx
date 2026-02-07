import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArtInsightsFeed } from "@/components/features/art-insights/ArtInsightsFeed";

export const metadata = {
    title: "Арт-инсайты | Любовь",
    description: "Статьи об искусстве, интерьерном дизайне и выборе картин для вашего пространства",
};

export default function ArtInsightsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <ArtInsightsFeed />
            <Footer />
        </div>
    );
}
