"use client";

import { useState } from 'react';
import { Share2, Link as LinkIcon, Send, MessageCircle, Pin } from 'lucide-react';

interface ShareSectionProps {
    title: string;
}

export const ShareSection = ({ title }: ShareSectionProps) => {
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    const shareLinks = [
        {
            name: 'TG',
            icon: <Send size={14} />,
            href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
            color: 'hover:text-[#26A5E4] hover:border-[#26A5E4]'
        },
        {
            name: 'VK',
            icon: <span className="font-bold text-[10px]">VK</span>,
            href: `https://vk.com/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`,
            color: 'hover:text-[#0077FF] hover:border-[#0077FF]'
        },
        {
            name: 'WA',
            icon: <MessageCircle size={14} />,
            href: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + shareUrl)}`,
            color: 'hover:text-[#25D366] hover:border-[#25D366]'
        },
        {
            name: 'PI',
            icon: <Pin size={14} />,
            href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(title)}`,
            color: 'hover:text-[#BD081C] hover:border-[#BD081C]'
        }
    ];

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    url: shareUrl,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            handleCopyLink();
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="p-6 bg-muted/30">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
                Поделиться
            </p>
            <div className="flex flex-wrap gap-2">
                {/* Native Share */}
                <button
                    onClick={handleNativeShare}
                    className="w-10 h-10 flex items-center justify-center border border-border hover:border-accent hover:text-accent transition-colors"
                    title="Поделиться через систему"
                >
                    <Share2 size={16} />
                </button>

                {/* Social Links */}
                {shareLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 flex items-center justify-center border border-border transition-colors ${link.color}`}
                        title={`Поделиться в ${link.name}`}
                    >
                        {link.icon}
                    </a>
                ))}

                {/* Copy Link */}
                <button
                    onClick={handleCopyLink}
                    className={`w-10 h-10 flex items-center justify-center border border-border transition-colors ${copied ? 'text-accent border-accent' : 'hover:border-accent hover:text-accent'}`}
                    title="Копировать ссылку"
                >
                    {copied ? <span className="text-[9px] font-bold">OK!</span> : <LinkIcon size={16} />}
                </button>
            </div>
        </div>
    );
};
