"use client";

import { siteConfig, footerConfig } from "@/data/site-config";
import { footerLabels } from "@/data/content";
import { Z_INDEX } from "@/lib/constants";
import { DSLabel, DSContainer } from "@/components/ui/design-system";

// =============================================================================
// Footer Component
// =============================================================================

/**
 * Site footer refactored to use Design System components.
 */
const Footer = () => {

    return (
        <footer
            className="w-full bg-background/80 backdrop-blur-xl pt-24 pb-16 border-t border-black/5"
            style={{ zIndex: Z_INDEX.footer }}
        >
            <DSContainer>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-12 lg:gap-24">
                    {/* Dynamic Footer Columns */}
                    {footerConfig.map((column, index) => (
                        <div key={column.title} className="space-y-6">
                            <DSLabel className="text-accent">
                                {column.title}
                            </DSLabel>
                            <div className="flex flex-col space-y-3">
                                {column.links.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className="text-[11px] font-body tracking-wider hover:text-accent transition-colors duration-300 w-fit"
                                        {...(link.href.startsWith('http') && { target: '_blank', rel: 'noreferrer' })}
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Credits & Legal Column */}
                    <div className="flex flex-col justify-end items-start md:items-end md:text-right space-y-6">
                        <div className="space-y-2">
                            <p className="text-[10px] tracking-widest text-muted-foreground">
                                © 2012-2026 — {siteConfig.name}
                            </p>
                            <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">
                                {footerLabels.allRightsReserved}
                            </p>
                        </div>
                        <div className="pt-4 border-t border-black/5 w-full md:w-auto">
                            <p className="text-[8px] leading-relaxed text-muted-foreground/40 md:ml-auto whitespace-nowrap">
                                * Деятельность META запрещена на территории РФ
                            </p>
                        </div>
                    </div>
                </div>
            </DSContainer>
        </footer>
    );
};

export default Footer;
