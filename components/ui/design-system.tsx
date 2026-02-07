import React from 'react';

// =============================================================================
// Typography Atoms
// =============================================================================

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    level?: 'h1' | 'h2' | 'h3' | 'h4';
    visually?: 'h1' | 'h2' | 'h3' | 'normal';
    italic?: boolean;
}

export const DSHeading = ({
    children,
    level = 'h2',
    visually,
    italic = true,
    className = '',
    ...props
}: HeadingProps) => {
    const Tag = level;

    // Base styles for all headings
    const baseStyles = "font-display font-light leading-tight";
    const italicStyle = italic ? "italic" : "";

    // Size variants matching the site's luxury scale
    // Default to strict mapping if 'visually' is not provided
    const visualLevel = visually || level;

    const sizeStyles = {
        h1: "text-3xl md:text-5xl lg:text-6xl", // Hero headers
        h2: "text-2xl md:text-4xl lg:text-5xl", // Section headers
        h3: "text-xl md:text-3xl",              // Subsection headers
        h4: "text-lg md:text-xl",
        normal: "text-base",
    }[visualLevel];

    return (
        <Tag className={`${baseStyles} ${sizeStyles} ${italicStyle} ${className}`} {...props}>
            {children}
        </Tag>
    );
};

export const DSLabel = ({
    children,
    className = '',
    as: Tag = 'span',
    ...props
}: React.AllHTMLAttributes<HTMLElement> & { as?: any }) => {
    return (
        <Tag className={`block text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-muted-foreground font-body ${className}`} {...props}>
            {children}
        </Tag>
    );
};

export const DSText = ({
    children,
    className = '',
    size = 'base',
    ...props
}: React.HTMLAttributes<HTMLParagraphElement> & { size?: 'sm' | 'base' | 'lg' }) => {
    const sizes = {
        sm: "text-sm",
        base: "text-sm md:text-base",
        lg: "text-lg md:text-xl",
    };

    return (
        <p className={`font-body text-gray-600 leading-relaxed text-muted-foreground ${sizes[size]} ${className}`} {...props}>
            {children}
        </p>
    );
};

// =============================================================================
// Layout Atoms
// =============================================================================

export const DSContainer = ({
    children,
    className = '',
    size = 'default'
}: React.HTMLAttributes<HTMLDivElement> & { size?: 'default' | 'narrow' | 'wide' }) => {
    const maxWidths = {
        default: "max-w-7xl",
        narrow: "max-w-4xl",
        wide: "max-w-[1920px]",
    };

    return (
        <div className={`container mx-auto px-6 md:px-12 w-full ${maxWidths[size]} ${className}`}>
            {children}
        </div>
    );
};

export const DSSection = ({
    children,
    className = '',
    spacing = 'default',
    ...props
}: React.HTMLAttributes<HTMLElement> & { spacing?: 'none' | 'sm' | 'default' | 'lg' }) => {
    const spacings = {
        none: "",
        sm: "py-12 md:py-20",
        default: "mb-20 md:mb-32 last:mb-0",
        lg: "py-24 md:py-40",
    };

    return (
        <section className={`${spacings[spacing]} ${className}`} {...props}>
            {children}
        </section>
    );
};

// =============================================================================
// Decorative Atoms
// =============================================================================

export const DSDecorativeAsterisk = ({ className = '' }: { className?: string }) => (
    <div className={`opacity-60 select-none ${className}`} aria-hidden="true">
        <span className="font-display text-lg text-muted-foreground">(</span>
        <span className="font-display text-lg text-muted-foreground">*</span>
        <span className="font-display text-lg text-muted-foreground">)</span>
    </div>
);
