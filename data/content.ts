// =============================================================================
// Hero Section Content
// =============================================================================

/**
 * Hero section text content - separated for easy editing
 */
export const heroContent = {
    /** Decorative element text */
    decorativeElement: '(*)',

    /** Main tagline parts */
    tagline: {
        intro: 'Студия интерьерного дизайна полного цикла,',
        emphasis: 'специализирующаяся на',
        highlight: 'искусстве и деталях.',
    },

    /** Description parts */
    description: {
        main: 'Мы помогаем пространству обрести связь с людьми',
        continuation: 'через',
        adjectives: ['уникальный', 'выразительный'],
        suffix: 'подход.',
    },
} as const;

/**
 * Contact section text content
 */
export const contactContent = {
    decorativeElement: '(*)',

    headline: {
        line1: 'Есть проект в планах?',
        line2: 'Давайте воплотим его в жизнь.',
    },

    cta: {
        label: 'Напишите мне на почту',
    },
} as const;

/**
 * Footer section labels
 */
export const footerLabels = {
    designBy: 'Дизайн',
    allRightsReserved: 'Все права защищены',
} as const;
