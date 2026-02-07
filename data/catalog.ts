export interface CatalogCategory {
    id: string;
    title: string;
    description: string;
    videoPlaceholderColor: string;
    videoSrc?: string;
}

export const catalogContent = {
    hero: {
        title: "Каталог интерьерного искусства",
        subtitle: "выберите направление для вдохновения и подбора",
    },
    categories: [
        {
            id: 'painting',
            title: 'Живопись',
            description: 'Эмоциональный центр вашего пространства',
            videoPlaceholderColor: 'from-orange-900 to-amber-900',
            videoSrc: '/videos/painting-hover.mp4',
        },
        {
            id: 'photo',
            title: 'Фотография',
            description: 'Запечатленные моменты вечности',
            videoPlaceholderColor: 'from-slate-900 to-gray-900',
            videoSrc: '/videos/photo-hover.mp4',
        },
        {
            id: 'textile',
            title: 'Текстиль',
            description: 'Тепло и тактильный комфорт',
            videoPlaceholderColor: 'from-amber-900 to-yellow-900',
            videoSrc: '/videos/textile-hover.mp4',
        },
        {
            id: 'pet-furniture',
            title: 'Мебель для животных',
            description: 'Эстетика для любимых питомцев',
            videoPlaceholderColor: 'from-emerald-900 to-teal-900',
            videoSrc: '/videos/pet-furniture-hover-revised.mp4',
        },
        {
            id: 'collections',
            title: 'Коллекции',
            description: 'Идеальная синергия наших изделий в каждой капсуле',
            videoPlaceholderColor: 'from-zinc-900 to-neutral-900',
        },
    ] as CatalogCategory[],
};
