"use client";

import { useState, useCallback } from "react";
import { siteConfig, navigationConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";
import { Z_INDEX } from "@/lib/constants";
import { DSLabel } from "@/components/ui/design-system";
import { ExpertHelpModal } from "@/components/modals/ExpertHelpModal";
import { MessageCircle, ChevronDown, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { categoryThemes } from "@/data/artworks";
import Link from "next/link";

// =============================================================================
// Header Component
// =============================================================================

/**
 * Fixed header with responsive navigation
 * Refactored to use DSLabel for unified typography.
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExpertModalOpen, setIsExpertModalOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 bg-background/60 backdrop-blur-lg"
        style={{ zIndex: Z_INDEX.header }}
      >
        {/* Main Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 md:px-12 lg:px-16 border-b border-black/5">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <DesktopNav />

          {/* Right Side Actions */}
          <div className="flex items-center justify-end gap-6 md:gap-10 flex-shrink-0">
            {/* Expert Help Button */}
            <button
              onClick={() => setIsExpertModalOpen(true)}
              className="hidden md:flex items-center gap-2 group"
            >
              <MessageCircle
                size={14}
                className="text-muted-foreground group-hover:text-accent transition-colors"
              />
              <DSLabel className="group-hover:text-accent transition-colors">
                ПОМОЩЬ
              </DSLabel>
            </button>
            <MenuToggle isOpen={isMenuOpen} onToggle={toggleMenu} />
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <MobileNav
            onNavClick={closeMenu}
            onExpertClick={() => {
              closeMenu();
              setIsExpertModalOpen(true);
            }}
          />
        )}
      </header>

      {/* Expert Help Modal */}
      <ExpertHelpModal
        isOpen={isExpertModalOpen}
        onClose={() => setIsExpertModalOpen(false)}
      />
    </>
  );
};

// =============================================================================
// Sub-components
// =============================================================================

const Logo = () => (
  <div className="flex-shrink-0">
    <a
      href="/"
      className="font-display text-2xl tracking-tighter hover:opacity-70 transition-opacity whitespace-nowrap italic"
    >
      {siteConfig.name}
    </a>
  </div>
);

const DesktopNav = () => (
  <nav className="hidden xl:flex items-center justify-center gap-10 mx-4">
    {navigationConfig.map((item) => {
      if (item.name === "Каталог") {
        return (
          <div
            key={item.name}
            className="relative group/catalog flex items-center"
          >
            <NavLink href={item.href}>
              <>
                {item.name}
                <ChevronDown
                  size={11}
                  className="text-muted-foreground/60 group-hover/catalog:rotate-180 transition-transform duration-500"
                />
              </>
            </NavLink>

            {/* Dropdown Menu */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/catalog:opacity-100 group-hover/catalog:visible transition-all duration-300 transform-gpu translate-y-2 group-hover/catalog:translate-y-0 z-50">
              <div className="bg-background/95 backdrop-blur-xl border border-border/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] min-w-[240px] p-2 rounded-lg">
                {Object.entries(categoryThemes).map(([slug, theme]) => (
                  <Link
                    key={slug}
                    href={`/catalog/${slug}`}
                    className="flex flex-col px-4 py-3 hover:bg-accent/5 rounded-md transition-all group/item"
                  >
                    <span className="text-[10px] tracking-[0.2em] font-semibold text-foreground group-hover/item:text-accent transition-colors">
                      {theme.title.toUpperCase()}
                    </span>
                    <span className="text-[9px] text-muted-foreground mt-1 lowercase tracking-wider line-clamp-1">
                      {theme.subtitle}
                    </span>
                  </Link>
                ))}
                <div className="mt-2 pt-2 border-t border-border/10">
                  <Link
                    href="/catalog"
                    className="flex items-center justify-center py-2 text-[9px] tracking-[0.1em] text-muted-foreground hover:text-accent transition-colors"
                  >
                    СМОТРЕТЬ ВЕСЬ КАТАЛОГ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      }
      return (
        <NavLink key={item.name} href={item.href}>
          {item.name}
        </NavLink>
      );
    })}
  </nav>
);

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const NavLink = ({ href, children, className, onClick }: NavLinkProps) => (
  <a href={href} className={cn("group relative", className)} onClick={onClick}>
    <DSLabel className="hover:text-accent transition-colors duration-300 !inline-flex items-center gap-1.5">
      {children}
    </DSLabel>
    <span className="absolute -bottom-1 left-0 w-full h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
  </a>
);

interface MenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MenuToggle = ({ isOpen, onToggle }: MenuToggleProps) => (
  <button
    className="xl:hidden group inline-flex items-center justify-center w-10 h-10"
    onClick={onToggle}
    aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
    aria-expanded={isOpen}
  >
    <span className="sr-only">{isOpen ? "Закрыть меню" : "Открыть меню"}</span>
    {isOpen ? (
      <X className="w-6 h-6 text-foreground/80" />
    ) : (
      <Menu className="w-6 h-6 text-foreground/80" />
    )}
  </button>
);

interface MobileNavProps {
  onNavClick: () => void;
  onExpertClick: () => void;
}

const MobileNav = ({ onNavClick, onExpertClick }: MobileNavProps) => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  return (
    <nav className="xl:hidden bg-background/95 backdrop-blur-xl border-b border-border fixed inset-x-0 top-[73px] max-h-[calc(100vh-73px)] overflow-y-auto">
      <div className="flex flex-col px-6 py-12 gap-6 items-center text-center">
        {navigationConfig.map((item) => {
          if (item.name === "Каталог") {
            return (
              <div
                key={item.name}
                className="flex flex-col items-center gap-4 w-full"
              >
                <button
                  onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                  className="flex items-center gap-2 group"
                >
                  <DSLabel className="group-hover:text-accent transition-colors">
                    {item.name}
                  </DSLabel>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "transition-transform duration-300",
                      isCatalogOpen && "rotate-180",
                    )}
                  />
                </button>

                <AnimatePresence>
                  {isCatalogOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden flex flex-col gap-4 w-full bg-accent/[0.03] py-4 rounded-lg"
                    >
                      {Object.entries(categoryThemes).map(([slug, theme]) => (
                        <Link
                          key={slug}
                          href={`/catalog/${slug}`}
                          onClick={onNavClick}
                          className="text-[10px] tracking-[0.2em] font-semibold text-muted-foreground hover:text-accent transition-colors"
                        >
                          {theme.title.toUpperCase()}
                        </Link>
                      ))}
                      <Link
                        href="/catalog"
                        onClick={onNavClick}
                        className="text-[9px] tracking-[0.1em] text-accent/60 mt-2"
                      >
                        СМОТРЕТЬ ВЕСЬ КАТАЛОГ
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }
          return (
            <NavLink key={item.name} href={item.href} onClick={onNavClick}>
              {item.name}
            </NavLink>
          );
        })}

        <div className="w-12 h-px bg-border/20 my-4" />

        {/* Expert Help in mobile menu */}
        <button
          onClick={onExpertClick}
          className="flex items-center gap-2 group"
        >
          <MessageCircle
            size={14}
            className="text-muted-foreground group-hover:text-accent transition-colors"
          />
          <DSLabel className="group-hover:text-accent transition-colors">
            ПОМОЩЬ ЭКСПЕРТОВ
          </DSLabel>
        </button>
      </div>
    </nav>
  );
};

export default Header;
