export interface Artwork {
    id: string;
    category: 'painting' | 'photo' | 'textile' | 'pet-furniture' | 'collections';
    title: string;
    artist?: string;
    price: string;
    image: string;
    videoSrc?: string;
    images?: string[];
    aspectRatio: 'portrait' | 'square' | 'landscape';
    tags: string[];
    description?: string;
    isNew?: boolean;
    options?: {
        sizes?: string[];
        finishes?: string[];
        fabrics?: string[];
    }
}

export const artworks: Artwork[] = [
    {
        id: '1',
        category: 'painting',
        title: 'Abstract Form I',
        price: '100 000 — 150 000 ₽',
        image: '/images/gallery-1.webp',
        aspectRatio: 'portrait',
        tags: ['Черный', 'Белый'],
    },
    {
        id: '2',
        category: 'painting',
        title: 'Deep Textures',
        price: '120 000 — 180 000 ₽',
        image: '/images/gallery-4.webp',
        aspectRatio: 'portrait',
        tags: ['Текстура', 'Черный'],
    },
    {
        id: '3',
        category: 'painting',
        title: 'Minimalist Intersect',
        price: '110 000 — 160 000 ₽',
        image: '/images/gallery-3.webp',
        aspectRatio: 'portrait',
        tags: ['Пастель', 'Линии'],
    },
    {
        id: '4',
        category: 'photo',
        title: 'Urban Silence',
        price: '80 000 — 120 000 ₽',
        image: '/images/gallery-6.webp',
        aspectRatio: 'portrait',
        tags: ['ЧБ', 'Архитектура'],
    },
    {
        id: '5',
        category: 'textile',
        title: 'Woven Memory',
        price: '200 000 — 250 000 ₽',
        image: '/images/custom_fabric_craftsmanship.webp',
        aspectRatio: 'landscape',
        tags: ['Натуральный', 'Шерсть'],
    },
    {
        id: 'p1',
        category: 'painting',
        title: 'The Muse',
        price: '130 000 — 190 000 ₽',
        image: '/images/uploaded_image_1767543292473.webp',
        aspectRatio: 'portrait',
        tags: ['Фигура', 'Линии'],
    },
    {
        id: 'ph1',
        category: 'photo',
        title: 'Morning Mist',
        price: '75 000 — 110 000 ₽',
        image: '/images/gallery-7.webp',
        aspectRatio: 'landscape',
        tags: ['Природа', 'Утро'],
    },
    {
        id: 'ph2',
        category: 'photo',
        title: 'Geometric Shadows',
        price: '90 000 — 140 000 ₽',
        image: '/images/gallery-2.webp',
        aspectRatio: 'portrait',
        tags: ['Минимализм', 'Геометрия'],
    },
    {
        id: 't1',
        category: 'textile',
        title: 'Earth Tones Rug',
        price: '180 000 — 240 000 ₽',
        image: '/images/gallery-3.webp',
        aspectRatio: 'landscape',
        tags: ['Шерсть', 'Земляной'],
    },
    {
        id: 'pf-velvet',
        category: 'pet-furniture',
        title: 'Velvet',
        price: 'Цена по запросу',
        image: '/images/velvet-1.webp',
        images: ['/images/velvet-1.webp', '/images/velvet-2.webp', '/images/velvet-3.webp'],
        aspectRatio: 'landscape',
        tags: ['Комфорт', 'Люкс'],
        description: 'Velvet — это элегантное место для отдыха собак, которые наслаждаются плавными линиями. Он уютно обнимает вашу собаку изогнутой и покрытой лаком для защиты от повреждений рамой. Его дышащая водоотталкивающая подушка со съемным чехлом, который можно стирать, обеспечивает идеальное сочетание поддержки и комфорта, что идеально подходит для дневного отдыха или крепкого ночного сна вашего любимца.',
        options: {
            sizes: ['85*50*30h', '120*55*40h'],
            finishes: ['Дуб', 'Орех', 'Венге'],
            fabrics: ['Ткань 1', 'Ткань 2', 'Ткань 3', 'Ткань 4', 'Подбор эксперта']
        }
    },
    {
        id: 'pf-orbis',
        category: 'pet-furniture',
        title: 'Orbis',
        price: 'Цена по запросу',
        image: '/images/orbis-1.webp',
        images: ['/images/orbis-1.webp', '/images/orbis-2.webp', '/images/orbis-3.webp', '/images/orbis-4.webp', '/images/orbis-5.webp', '/images/orbis-6.webp', '/images/orbis-7.webp', '/images/orbis-8.webp'],
        aspectRatio: 'landscape',
        tags: ['Круглый', 'Игривый'],
        description: 'Весело. Ловко. Шаловливо. Orbis вдохновлен собакой, которая любит гоняться за собственным хвостом. Поэтому, естественно, его кровать-тёзка имеет круглую форму, которая достигается за счёт точной резки для идеальной симметрии. Orbis изготовлен из инженерного массива и покрыт натуральным селективным шпоном дуба, ореха или венге. Благодаря низкому профилю и гладкой, очень мягкой подушке Eco-Soft со съемным чехлом, который можно стирать, Orbis создает уютную атмосферу для отдыха.',
        options: {
            sizes: ['90*12h'],
            finishes: ['Дуб', 'Орех', 'Венге'],
            fabrics: ['Ткань 1', 'Ткань 2', 'Ткань 3', 'Ткань 4', 'Подбор эксперта']
        }
    },
    {
        id: 'pf-canoa',
        category: 'pet-furniture',
        title: 'Canoa',
        price: 'Цена по запросу',
        image: '/images/canoa-1.webp',
        images: ['/images/canoa-1.webp', '/images/canoa-2.webp', '/images/canoa-3.webp'],
        aspectRatio: 'landscape',
        tags: ['Натуральный', 'Стиль'],
        description: 'Кровать Canoa, названная в честь энергичной собаки, которая умеет находить самые уютные места в доме, имеет изящную форму и предназначена для собак, которые ценят стиль и комфорт. Шпон из натурального дерева имеет характерный рисунок, придающий эстетики, а нежная, но водонепроницаемая подушка со съемным чехлом, который можно стирать, упрощает уход. Модель Canoa, обработанная вручную и покрытая лаком для сохранения естественной красоты древесины, представляет собой изысканное место для отдыха, которое органично впишется в ваш интерьер и обеспечит вашей собаке максимальный комфорт.',
        options: {
            sizes: ['83*50*30h', '112*55*30h'],
            finishes: ['Дуб', 'Орех', 'Венге'],
            fabrics: ['Ткань 1', 'Ткань 2', 'Ткань 3', 'Ткань 4', 'Подбор эксперта']
        }
    },
    {
        id: 'pf-eredita',
        category: 'pet-furniture',
        title: 'Eredita',
        price: 'Цена по запросу',
        image: '/images/eredita-1.webp',
        images: ['/images/eredita-1.webp', '/images/eredita-2.webp', '/images/eredita-3.webp', '/images/eredita-4.webp'],
        aspectRatio: 'landscape',
        tags: ['Классика', 'Премиум'],
        description: 'Eredita, вдохновлённая привычками своих хозяев, напоминает классическую диванетку, достойную пунктуального щенка, который всегда первым выбегает за дверь, чтобы отправиться на прогулку. Дизайн модели отличается чёткими линиями, которые привлекают внимание. Каждая деталь покрыта высококачественным лаком, который защищает натуральный шпон и подчёркивает его текстуру. В сочетании с водоотталкивающей подушкой со съёмным моющимся чехлом Eredita станет местом, где даже самые серьезные собаки смогут расслабиться.',
        options: {
            sizes: ['90*50*35h', '120*55*35h'],
            finishes: ['Дуб', 'Орех', 'Венге'],
            fabrics: ['Ткань 1', 'Ткань 2', 'Ткань 3', 'Ткань 4', 'Подбор эксперта']
        }
    },
    {
        id: 'ts1',
        category: 'textile',
        title: 'Перетяжка мебели',
        price: 'от 50 000 ₽',
        image: '/images/reupholstery_craft_1767627447361.webp',
        aspectRatio: 'landscape',
        tags: ['Услуга', 'Премиум'],
        description: 'Профессиональная перетяжка мебели с использованием эксклюзивных тканей из нашей коллекции.'
    },
    {
        id: 'ts2',
        category: 'textile',
        title: 'Пошив декоративных подушек',
        price: 'от 5 000 ₽',
        image: '/images/custom_cushions_1767627463013.webp',
        aspectRatio: 'square',
        tags: ['Услуга', 'Декор'],
        description: 'Индивидуальный пошив подушек любых форм и размеров из премиального текстиля.'
    },
    {
        id: 'ts3',
        category: 'textile',
        title: 'Пошив штор',
        price: 'Цена по запросу',
        image: '/images/luxury_curtains_1767627477543.webp',
        aspectRatio: 'portrait',
        tags: ['Услуга', 'Интерьер'],
        description: 'Создание уникальных текстильных решений для ваших окон. Подбор тканей и профессиональный пошив.'
    },
    {
        id: 'coll-shantaram',
        category: 'collections',
        title: 'Коллекция ШАНТАРАМ',
        price: 'Цена по запросу',
        image: '/images/artcore_concept.webp',
        videoSrc: '/videos/about-video.mp4',
        aspectRatio: 'landscape',
        tags: ['САНГИТА', 'ШИНАМ'],
        description: 'В коллекцию входят панно САНГИТА и ковер ШИНАМ. Идеальное сочетание для вашего интерьера.',
        isNew: true
    },
    {
        id: 'coll-nachalo',
        category: 'collections',
        title: 'Коллекция НАЧАЛО',
        price: 'Цена по запросу',
        image: '/images/gallery-4.webp',
        aspectRatio: 'landscape',
        tags: ['UNIvers', 'Уно'],
        description: 'В коллекцию входят панно UNIvers и ковер Уно. Эстетика минимализма для вашего пространства.'
    },
    {
        id: 'coll-3',
        category: 'collections',
        title: 'Коллекция 3 (В разработке)',
        price: 'Скоро',
        image: '/images/gallery-1.webp',
        aspectRatio: 'square',
        tags: ['Coming Soon'],
        description: 'Новая коллекция находится в процессе создания.'
    },
    {
        id: 'coll-4',
        category: 'collections',
        title: 'Коллекция 4 (В разработке)',
        price: 'Скоро',
        image: '/images/gallery-2.webp',
        aspectRatio: 'square',
        tags: ['Coming Soon'],
        description: 'Новая коллекция находится в процессе создания.'
    },
    {
        id: 'coll-5',
        category: 'collections',
        title: 'Коллекция 5 (В разработке)',
        price: 'Скоро',
        image: '/images/gallery-3.webp',
        aspectRatio: 'square',
        tags: ['Coming Soon'],
        description: 'Новая коллекция находится в процессе создания.'
    },
    {
        id: 'coll-6',
        category: 'collections',
        title: 'Коллекция 6 (В разработке)',
        price: 'Скоро',
        image: '/images/gallery-5.webp',
        aspectRatio: 'square',
        tags: ['Coming Soon'],
        description: 'Новая коллекция находится в процессе создания.'
    },
    {
        id: 'coll-7',
        category: 'collections',
        title: 'Коллекция 7 (В разработке)',
        price: 'Скоро',
        image: '/images/gallery-6.webp',
        aspectRatio: 'square',
        tags: ['Coming Soon'],
        description: 'Новая коллекция находится в процессе создания.'
    },
];

export const categoryThemes: Record<string, { title: string, subtitle: string, accentColor: string, subnav: (string | { label: string, href: string })[] }> = {
    painting: {
        title: 'Живопись',
        subtitle: 'Наши арты — это не просто картины, а объект, созданный для вашего вдохновения.',
        accentColor: 'from-orange-950/20 to-transparent',
        subnav: [
            { label: 'Как выбрать цвет', href: '/art-insights/how-to-choose-art-for-interior' },
            { label: 'Картина или принт', href: '/art-insights/original-vs-print' },
            { label: 'Психология цвета', href: '/art-insights/color-psychology-in-art' }
        ]
    },
    photo: {
        title: 'Фото',
        subtitle: 'Искусство момента, запечатленное сквозь призму вечности.',
        accentColor: 'from-slate-900/20 to-transparent',
        subnav: [
            { label: 'Форматы печати', href: '/art-insights/printing-formats' },
            { label: 'Оформление в багет', href: '/art-insights/framing-guide' }
        ]
    },
    textile: {
        title: 'Текстиль',
        subtitle: 'Тепло и тактильная эстетика вашего дома.',
        accentColor: 'from-amber-900/20 to-transparent',
        subnav: [
            { label: 'Материалы', href: '/art-insights/textile-in-interior' },
            { label: 'Уход за изделием', href: '/art-insights/caring-for-artwork' }
        ]
    },
    'pet-furniture': {
        title: 'Мебель для животных',
        subtitle: 'Коллекция ТЕССЕРА. Премиальная мебель для любимых питомцев',
        accentColor: 'from-emerald-900/20 to-transparent',
        subnav: [
            { label: 'Размерная сетка', href: '/art-insights/how-to-choose-pet-furniture-size' },
            { label: 'Материалы', href: '/art-insights/pet-furniture-materials' }
        ]
    },
    collections: {
        title: 'КОЛЛЕКЦИИ',
        subtitle: 'Идеальная синергия наших изделий в каждой капсуле.',
        accentColor: 'from-zinc-900/20 to-transparent',
        subnav: [
            { label: 'Шантарам', href: '/art-insights/collection-shantaram' },
            { label: 'Начало', href: '/art-insights/collection-nachalo' },
            { label: 'UniVers', href: '/art-insights/collection-univers' },
            { label: 'Уно', href: '/art-insights/collection-uno' },
            { label: 'Эредина', href: '/art-insights/collection-eredina' },
            { label: 'Орбис', href: '/art-insights/collection-orbis' },
            { label: 'Вельвет', href: '/art-insights/collection-velvet' }
        ]
    },
};
