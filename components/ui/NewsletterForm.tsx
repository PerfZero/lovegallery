"use client";

import { useState } from "react";
import { isValidEmail } from "@/lib/format";

export const NewsletterForm = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            setStatus("error");
            setErrorMsg("Введите корректный email");
            return;
        }

        setStatus("loading");
        setErrorMsg("");

        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formType: "Подписка на рассылку",
                    email: email,
                    subject: "Новый подписчик на рассылку",
                    message: "Запрос на подписку на новости и статьи."
                }),
            });

            if (response.ok) {
                setStatus("success");
                setEmail("");
            } else {
                setStatus("error");
                setErrorMsg("Ошибка при отправке. Попробуйте позже.");
            }
        } catch (error) {
            console.error("Newsletter error:", error);
            setStatus("error");
            setErrorMsg("Ошибка сетевого соединения.");
        }
    };

    if (status === "success") {
        return (
            <div className="py-4 animate-in fade-in duration-700">
                <p className="text-accent font-display italic text-xl mb-2">Спасибо за подписку!</p>
                <p className="text-sm text-muted-foreground">Лучшие материалы уже на пути к вам.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === "error") setStatus("idle");
                    }}
                    placeholder="Ваш email"
                    className={`flex-1 px-6 py-4 bg-background border text-sm focus:outline-none focus:border-accent transition-colors ${status === "error" ? 'border-red-500' : 'border-border'}`}
                />
                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="px-8 py-4 bg-foreground text-background text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-accent hover:text-foreground transition-all disabled:opacity-50"
                >
                    {status === "loading" ? "..." : "Подписаться"}
                </button>
            </div>
            {status === "error" && (
                <p className="text-[10px] text-red-500 text-left mt-1">{errorMsg}</p>
            )}
        </form>
    );
};
