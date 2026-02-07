import Link from "next/link";
import { DSContainer, DSHeading, DSText } from "@/components/ui/design-system";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import { ShareSection } from "@/components/features/art-insights/ShareSection";
import { BackButton } from "@/components/ui/BackButton";

// Демо-статьи (в реальном проекте хранились бы в CMS или отдельных файлах)
const articles: Record<string, {
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    image: string;
    content: string;
}> = {
    "how-to-choose-art-for-interior": {
        title: "Как выбрать картину для интерьера: полное руководство",
        excerpt: "Разбираемся, как подобрать произведение искусства, которое идеально впишется в ваше пространство.",
        category: "Гайды",
        date: "10 января 2026",
        readTime: "8 мин",
        image: "/images/gallery-1.webp",
        content: `
## Введение

Выбор картины для интерьера — это не просто покупка декора. Это возможность создать особую атмосферу, выразить свою индивидуальность и превратить пространство в настоящее произведение искусства.

## 1. Определите стиль вашего интерьера

Прежде чем начать поиск, важно понять общий стиль вашего пространства:

- **Минимализм** — выбирайте лаконичные работы с чёткими линиями
- **Классика** — подойдут академические портреты и пейзажи
- **Современный** — экспериментируйте с абстракцией и поп-артом
- **Скандинавский** — природные мотивы и приглушённые тона

## 2. Учитывайте размер

Размер картины должен соответствовать размеру стены:

- Над диваном — картина шириной 2/3 от ширины дивана
- В узком коридоре — вертикальные форматы
- На большой пустой стене — крупный формат или композиция

## 3. Цветовая гармония

Картина может либо гармонировать с интерьером, либо стать ярким акцентом:

- Ищите 1-2 цвета из картины, которые повторяются в комнате
- Не бойтесь контраста — он создаёт динамику
- Нейтральные работы подойдут для любого пространства

## Заключение

Главное правило — картина должна вызывать у вас эмоции. Если работа «цепляет» — это ваш выбор.
        `,
    },
    "color-psychology-in-art": {
        title: "Психология цвета в живописи: как картины влияют на настроение",
        excerpt: "Изучаем, как цветовая гамма произведений искусства может менять атмосферу комнаты.",
        category: "Теория",
        date: "5 января 2026",
        readTime: "6 мин",
        image: "/images/gallery-2.webp",
        content: `
## Влияние цвета на эмоции

Цвет — самый мощный инструмент в арсенале художника. Он способен вызывать радость, умиротворение, или напротив — тревогу и возбуждение.

## Тёплые цвета

**Красный** — энергия, страсть, сила. Используйте в гостиных и столовых.

**Оранжевый** — оптимизм, творчество. Идеален для рабочего пространства.

**Жёлтый** — радость, тепло. Подойдёт для кухни и детской.

## Холодные цвета

**Синий** — спокойствие, доверие. Лучший выбор для спальни.

**Зелёный** — гармония, природа. Универсален для любой комнаты.

**Фиолетовый** — роскошь, мистика. Создаёт атмосферу загадочности.

## Нейтральные тона

Белый, серый, бежевый — создают ощущение пространства и покоя. Идеальный фон для ярких акцентов.
        `,
    },
    "original-vs-print": {
        title: "Оригинал или принт: что выбрать для своего дома?",
        excerpt: "Сравниваем преимущества оригинальных картин и качественных принтов.",
        category: "Советы",
        date: "28 декабря 2025",
        readTime: "5 мин",
        image: "/images/gallery-3.webp",
        content: `
## Оригинальные работы

**Преимущества:**
- Уникальность — вы владеете единственным экземпляром
- Инвестиционная ценность
- Особая энергетика ручной работы
- Текстура и объём красок

**Недостатки:**
- Высокая стоимость
- Требуют специального ухода

## Качественные принты

**Преимущества:**
- Доступная цена
- Широкий выбор репродукций мировых шедевров
- Лёгкость в уходе
- Возможность заменить при смене интерьера

**Недостатки:**
- Нет уникальности
- Не являются инвестицией

## Наш совет

Начните с качественных принтов, чтобы понять свои предпочтения. А когда найдёте «своего» художника — инвестируйте в оригинал.
        `,
    },
    "caring-for-artwork": {
        title: "Как ухаживать за картинами: советы экспертов",
        excerpt: "Профессиональные рекомендации по хранению, чистке и защите произведений искусства от повреждений.",
        category: "Уход",
        date: "20 декабря 2025",
        readTime: "7 мин",
        image: "/images/gallery-4.webp",
        content: `
## Правильное размещение

Место размещения картины — один из самых важных факторов её сохранности.

- Избегайте прямых солнечных лучей — они вызывают выцветание
- Не вешайте над источниками тепла
- Оптимальная влажность — 45-55%
- Избегайте резких перепадов температуры

## Чистка и уход

Регулярный уход продлевает жизнь произведения:

- Используйте мягкую сухую щётку для удаления пыли
- Никогда не используйте воду или химические средства
- Для стекла — специальные салфетки без ворса
- Раз в год — профессиональный осмотр

## Хранение

Если нужно убрать картину на хранение:

- Оберните в acid-free бумагу
- Используйте специальные короба
- Храните вертикально, не штабелируя
- Проветриваемое помещение без влаги
        `,
    },
    "framing-guide": {
        title: "Искусство багетного оформления: как подобрать раму",
        excerpt: "Полный гайд по выбору багета, паспарту и стекла для идеального оформления вашей картины.",
        category: "Гайды",
        date: "15 декабря 2025",
        readTime: "10 мин",
        image: "/images/gallery-5.webp",
        content: `
## Выбор багета

Рама — это продолжение произведения искусства.

- **Классика** — резные позолоченные рамы
- **Модерн** — тонкие металлические профили
- **Минимализм** — рамы-невидимки или без рамы
- **Скандинавский** — светлое дерево, белый

## Паспарту

Паспарту создаёт «воздух» вокруг работы:

- Ширина обычно 5-10 см
- Цвет — нейтральный или подчёркивающий тон картины
- Для акварели и графики — обязательно
- Для масла — по желанию

## Тип стекла

Защита и восприятие:

- Обычное — бюджетный вариант, даёт блики
- Антибликовое — матовое, без отражений
- Музейное — UV-защита, безбликовое
- Без стекла — для масляных картин
        `,
    },
    "textile-in-interior": {
        title: "Текстиль как искусство: тренды интерьерного текстиля",
        excerpt: "Как декоративный текстиль может стать полноценным арт-объектом и преобразить ваш интерьер.",
        category: "Тренды",
        date: "10 декабря 2025",
        readTime: "6 мин",
        image: "/images/gallery-6.webp",
        content: `
## Текстиль как арт-объект

Современный интерьерный текстиль давно вышел за рамки функционального декора.

- Тканые панно вместо картин
- Макраме как скульптура
- Ковры ручной работы как centerpiece
- Декоративные подушки с авторскими принтами

## Тренды 2026

Что выбирают дизайнеры:

- Натуральные материалы: лён, хлопок, шерсть
- Ручная работа и ремесленные техники
- Нейтральные тона с акцентами
- Крупные формы и statement pieces

## Как внедрить

Простые шаги трансформации:

- Начните с одного крупного элемента
- Добавьте текстуры через подушки и пледы
- Повесьте тканое панно вместо картины
- Замените типовой ковёр на авторский
        `,
    },
    "how-to-choose-pet-furniture-size": {
        title: "Как выбрать размер мебели для питомца: полное руководство",
        excerpt: "Разбираемся в габаритах и эргономике лежанок, чтобы вашему любимцу было максимально комфортно.",
        category: "Гайды",
        date: "15 января 2026",
        readTime: "6 мин",
        image: "/images/velvet-1.webp",
        content: `
## Как определить нужный размер

Правильно выбранный размер лежанки — залог качественного сна и здоровья суставов вашего питомца.

## 1. Замерьте питомца

Измерьте вашего питомца в его любимой позе для сна:
- Если он спит, вытянувшись во весь рост — замерьте длину от кончика носа до основания хвоста.
- Если он спит, свернувшись калачиком — замерьте диаметр этого "калачика".

К полученному значению прибавьте 15-20 см — это и будет идеальная длина лежанки.

## 2. Учитывайте особенности породы

- **Мелкие породы** (чиххуахуа, шпицы) — предпочитают более закрытые, уютные пространства.
- **Средние породы** (корги, бигли) — нуждаются в пространстве для маневра.
- **Крупные породы** (лабрадоры, ретриверы) — важно наличие бортиков для поддержки головы.

## 3. Наши размеры

- **Размер M** (85 см) — для собак до 15-20 кг.
- **Размер L** (120 см) — для крупных пород или тех, кто любит простор.

## Заключение

Если вы сомневаетесь — лучше выбрать размер больше. Лишнее пространство никогда не помешает, а теснота может вызвать дискомфорт.
        `,
    },
    "pet-furniture-materials": {
        title: "Особенности материалов мебели для животных",
        excerpt: "Почему мы выбираем натуральный шпон и специализированные ткани для создания премиального комфорта.",
        category: "Материалы",
        date: "12 января 2026",
        readTime: "5 мин",
        image: "/images/canoa-1.webp",
        content: `
## Эстетика и практичность

Мы верим, что мебель для животных должна быть такой же качественной и красивой, как и мебель для людей.

## 1. Натуральный дерево и шпон

Мы используем инженерный массив и натуральный шпон дуба, ореха и венге. Это обеспечивает:
- Долговечность и прочность конструкции.
- Экологичность — никаких вредных испарений.
- Неповторимый природный рисунок.

## 2. Специализированные ткани

Все наши ткани проходят строгий отбор:
- **Антивандальные свойства** — устойчивость к когтям.
- **Водоотталкивающая пропитка** — легкая чистка.
- **Гипоаллергенность** — безопасно для чувствительной кожи питомцев.
- **Съемные чехлы** — возможность стирки в машинке.

## 3. Безопасные покрытия

Все деревянные детали покрыты премиальным лаком на водной основе, который защищает дерево от влаги и повреждений и абсолютно безопасен при контакте.

## Уход за изделием

Просто протирайте деревянные части мягкой влажной тканью, а чехлы подушек стирайте при 30 градусах в деликатном режиме.
        `,
    },
    "collection-shantaram": {
        title: "Коллекция ШАНТАРАМ: Мистическая Индия в современном интерьере",
        excerpt: "История создания капсульной коллекции, объединяющей панно САНГИТА и ковер ШИНАМ.",
        category: "Коллекции",
        date: "25 января 2026",
        readTime: "7 мин",
        image: "/images/artcore_concept.webp",
        content: `
## Философия коллекции

Шантарам — это поиск внутреннего покоя через визуальный и тактильный опыт. Коллекция вдохновлена эстетикой востока, переосмысленной в минималистичном ключе.

## Состав капсулы

**Панно САНГИТА**
Центральный объект коллекции. Сложная многослойная техника создания создает эффект объема и глубины, меняющийся в зависимости от освещения.

**Ковер ШИНАМ**
Тактильное продолжение коллекции. Ручная работа, натуральные материалы и сложный геометрический паттерн, перекликающийся с линиями панно.

## Интерьерные решения

Коллекция идеально подходит для создания медитативной зоны в гостиной или спальне. Рекомендуется сочетать с теплыми источниками света и натуральным деревом.
        `,
    },
    "collection-nachalo": {
        title: "Коллекция НАЧАЛО: Возвращение к истокам",
        excerpt: "Чистые линии и первозданная эстетика коллекции UNIvers и Уно.",
        category: "Коллекции",
        date: "20 января 2026",
        readTime: "6 мин",
        image: "/images/gallery-4.webp",
        content: `
## Концепция

«Начало» — это коллекция-манифест, призывающая отбросить всё лишнее и сосредоточиться на форме и цвете.

## Ключевые объекты

**Панно UNIvers**
Работа с пространством через отсутствие лишнего. Монохромная палитра и игра теней на фактурной поверхности.

**Ковер Уно**
Лаконичное основание интерьера. Идеально ровный ворс и приглушенные природные тона.

## Особенности коллекции

Подходит для интерьеров в стиле Soft Minimalism и Japandi. Позволяет создать пространство, свободное от визуального шума.
        `,
    },
    "printing-formats": {
        title: "Гайд по форматам печати и размерам",
        excerpt: "Как правильно выбрать масштаб фотографии для вашего пространства.",
        category: "Гайды",
        date: "18 января 2026",
        readTime: "5 мин",
        image: "/images/gallery-7.webp",
        content: `
## Масштаб имеет значение

Выбор правильного формата — это 50% успеха в оформлении интерьера фотографией.

## Популярные форматы

- **40x60 см** — идеален для небольших комнат или композиций.
- **50x70 см** — стандарт, который отлично смотрится над рабочим столом.
- **70x100 см** — эффектный формат для гостиной.
- **Коллекционный формат (от 100 см)** — для больших пространств и галерейной развески.

## Тип носителя

Мы предлагаем печать на архивной хлопковой бумаге музейного качества, которая сохраняет цветопередачу до 100 лет.
        `,
    },
    "collection-velvet": {
        title: "Коллекция VELVET: Мягкость и комфорт",
        excerpt: "Почему серия Velvet стала бестселлером среди владельцев питомцев.",
        category: "Коллекции",
        date: "28 января 2026",
        readTime: "4 мин",
        image: "/images/velvet-1.webp",
        content: `
## В разработке

Эта коллекция сейчас находится в детальной проработке. Мы тестируем новые материалы и формы, чтобы обеспечить максимальный комфорт вашим любимцам.

Скоро здесь появится полная история создания и концепция коллекции.
        `,
    },
    "collection-univers": {
        title: "Коллекция UNIVERS: Пространство и форма",
        excerpt: "Исследование бесконечности через интерьерное искусство.",
        category: "Коллекции",
        date: "29 января 2026",
        readTime: "5 мин",
        image: "/images/gallery-1.webp",
        content: `## В разработке...`,
    },
    "collection-uno": {
        title: "Коллекция UNO: Один на один с искусством",
        excerpt: "Сила одиночного акцента в интерьере.",
        category: "Коллекции",
        date: "30 января 2026",
        readTime: "3 мин",
        image: "/images/gallery-2.webp",
        content: `## В разработке...`,
    },
    "collection-eredina": {
        title: "Коллекция EREDINA: Наследие и традиции",
        excerpt: "Как классические формы обретают новую жизнь.",
        category: "Коллекции",
        date: "31 января 2026",
        readTime: "6 мин",
        image: "/images/eredita-1.webp",
        content: `## В разработке...`,
    },
    "collection-orbis": {
        title: "Коллекция ORBIS: Совершенство круга",
        excerpt: "Геометрия как основа гармонии в доме.",
        category: "Коллекции",
        date: "1 февраля 2026",
        readTime: "4 мин",
        image: "/images/orbis-1.webp",
        content: `## В разработке...`,
    },
};

// Генерация статических параметров для всех статей
export function generateStaticParams() {
    return Object.keys(articles).map((slug: string) => ({
        slug,
    }));
}


interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params;
    const article = articles[slug];

    if (!article) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <Header />
                <main className="pt-32 pb-20">
                    <DSContainer>
                        <div className="text-center">
                            <h1 className="font-display text-3xl italic mb-4">
                                Статья не найдена
                            </h1>
                            <Link href="/art-insights" className="text-accent hover:underline">
                                Вернуться к статьям
                            </Link>
                        </div>
                    </DSContainer>
                </main>
                <Footer />
            </div>
        );
    }

    // Get related articles
    const relatedArticles = Object.entries(articles)
        .filter(([key]: [string, any]) => key !== slug)
        .slice(0, 3)
        .map(([key, value]: [string, any]) => ({ slug: key, ...value }));

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />


            <main>
                {/* Hero Section */}
                <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                    {/* Background Image */}
                    <img
                        src={article.image}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

                    {/* Content */}
                    <DSContainer className="relative h-full flex flex-col justify-end pb-16 md:pb-24">
                        {/* Back Link */}
                        <div className="absolute top-32 left-6 md:left-12 lg:left-16">
                            <BackButton
                                label="Вернуться назад"
                                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white hover:text-white transition-colors group px-3 py-2 bg-black/20 backdrop-blur-md rounded-sm border border-white/10"
                            />
                        </div>

                        {/* Article Info */}
                        <div className="max-w-4xl">
                            {/* Category */}
                            <span className="inline-block px-4 py-2 bg-accent text-accent-foreground text-[9px] uppercase tracking-[0.2em] font-semibold mb-6">
                                {article.category}
                            </span>

                            {/* Title */}
                            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white italic mb-8 leading-tight drop-shadow-md">
                                {article.title}
                            </h1>

                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-6 text-sm text-white/90 drop-shadow-sm">
                                <span className="flex items-center gap-2">
                                    <Calendar size={14} />
                                    {article.date}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Clock size={14} />
                                    {article.readTime} чтения
                                </span>
                            </div>
                        </div>
                    </DSContainer>
                </section>

                {/* Article Content */}
                <section className="py-16 md:py-24">
                    <DSContainer>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                            {/* Main Content */}
                            <article className="lg:col-span-8">
                                {/* Lead Paragraph */}
                                <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed mb-12 font-light">
                                    {article.excerpt}
                                </p>

                                {/* Divider */}
                                <div className="flex items-center gap-4 mb-12">
                                    <div className="flex-1 h-px bg-border" />
                                    <span className="text-accent text-lg">✦</span>
                                    <div className="flex-1 h-px bg-border" />
                                </div>

                                {/* Article Body */}
                                <div className="prose-custom">
                                    {article.content.split('\n').map((paragraph, index) => {
                                        if (paragraph.startsWith('## ')) {
                                            return (
                                                <h2 key={index} className="text-2xl md:text-3xl font-display italic mt-16 mb-8 text-foreground">
                                                    {paragraph.replace('## ', '')}
                                                </h2>
                                            );
                                        }
                                        if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                                            return (
                                                <p key={index} className="text-lg font-medium mt-8 mb-4 text-foreground">
                                                    {paragraph.replace(/\*\*/g, '')}
                                                </p>
                                            );
                                        }
                                        if (paragraph.startsWith('- ')) {
                                            return (
                                                <li key={index} className="text-foreground/80 ml-6 mb-2 list-disc">
                                                    {paragraph.replace('- ', '')}
                                                </li>
                                            );
                                        }
                                        if (paragraph.trim()) {
                                            return (
                                                <p key={index} className="text-lg text-foreground/80 leading-relaxed mb-6">
                                                    {paragraph}
                                                </p>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>

                                {/* Tags */}
                                <div className="mt-16 pt-8 border-t border-border">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
                                        Теги
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-4 py-2 bg-muted text-xs">{article.category}</span>
                                        <span className="px-4 py-2 bg-muted text-xs">Искусство</span>
                                        <span className="px-4 py-2 bg-muted text-xs">Интерьер</span>
                                    </div>
                                </div>
                            </article>

                            {/* Sidebar */}
                            <aside className="lg:col-span-4">
                                <div className="lg:sticky lg:top-32 space-y-8">
                                    {/* Share */}
                                    <ShareSection title={article.title} />

                                    {/* CTA Card */}
                                    <div className="p-8 bg-gradient-to-br from-accent/10 to-muted/30">
                                        <p className="font-display text-xl italic mb-4">
                                            Нужна помощь в выборе?
                                        </p>
                                        <p className="text-sm text-muted-foreground mb-6">
                                            Наши эксперты помогут подобрать идеальное произведение для вашего интерьера
                                        </p>
                                        <Link
                                            href="/catalog"
                                            className="block w-full py-4 bg-foreground text-background text-center text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-accent hover:text-foreground transition-all"
                                        >
                                            Смотреть каталог
                                        </Link>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </DSContainer>
                </section>

                {/* Related Articles */}
                <section className="py-16 md:py-24 bg-muted/20">
                    <DSContainer>
                        <div className="text-center mb-12">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
                                Продолжить чтение
                            </p>
                            <h2 className="font-display text-3xl md:text-4xl italic">
                                Похожие статьи
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedArticles.map((relatedArticle) => (
                                <Link
                                    key={relatedArticle.slug}
                                    href={`/art-insights/${relatedArticle.slug}`}
                                    className="group"
                                >
                                    <div className="aspect-[4/3] overflow-hidden mb-4">
                                        <img
                                            src={relatedArticle.image}
                                            alt={relatedArticle.title}
                                            className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                        />
                                    </div>
                                    <span className="text-[9px] uppercase tracking-[0.2em] text-accent">
                                        {relatedArticle.category}
                                    </span>
                                    <h3 className="font-display text-lg italic mt-2 group-hover:text-accent transition-colors line-clamp-2">
                                        {relatedArticle.title}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </DSContainer>
                </section>
            </main>

            <Footer />
        </div>
    );
}

