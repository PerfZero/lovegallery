"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";
import { formatPhoneNumber, isValidPhone } from "@/lib/format";

interface ExpertHelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ExpertHelpModal = ({ isOpen, onClose }: ExpertHelpModalProps) => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        question: "",
        requestType: "consultation" as "consultation" | "capsule" | "designer",
    });
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        if (name === "phone") {
            const formatted = formatPhoneNumber(value);
            setFormData(prev => ({ ...prev, [name]: formatted }));
            if (errors.phone) setErrors(prev => ({ ...prev, phone: false }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
            if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: boolean } = {};
        if (!formData.name.trim()) newErrors.name = true;
        if (!isValidPhone(formData.phone)) newErrors.phone = true;

        // Question is optional for specific request types if needed, 
        // but let's keep it required for "consultation" or general context.
        if (formData.requestType === 'consultation' && !formData.question.trim()) {
            newErrors.question = true;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            const subjects = {
                consultation: "Консультация с экспертом",
                capsule: "Заявка на капсульную подборку",
                designer: "Выезд дизайнера на объект"
            };

            const response = await fetch('/api/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formType: "Помощь экспертов",
                    name: formData.name,
                    phone: formData.phone,
                    subject: subjects[formData.requestType],
                    message: formData.question || "Без комментария",
                    options: {
                        "Тип запроса": subjects[formData.requestType]
                    }
                }),
            });

            if (response.ok) {
                setIsSuccess(true);
            } else {
                console.error("Failed to send form");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({ name: "", phone: "", question: "", requestType: "consultation" });
        setErrors({});
        setIsSuccess(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] bg-background border-border">
                <DialogHeader>
                    <DialogTitle className="font-display text-2xl italic flex items-center gap-3">
                        <MessageCircle size={24} className="text-accent" />
                        {isSuccess ? "Заявка отправлена!" : "Помощь экспертов"}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {isSuccess
                            ? "Наш эксперт свяжется с вами в ближайшее время."
                            : "Получите бесплатную консультацию от наших арт-экспертов"}
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="py-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                            <span className="text-2xl">✓</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Менеджер свяжется с вами по указанному номеру телефона.
                        </p>
                        <Button onClick={handleClose} variant="outline">
                            Закрыть
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs uppercase tracking-wider">
                                Имя *
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ваше имя"
                                className={`bg-transparent border-border focus:border-accent ${errors.name ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                            />
                            {errors.name && <p className="text-[10px] text-red-500 mt-1">Пожалуйста, введите имя</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-xs uppercase tracking-wider">
                                Телефон *
                            </Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+7 (___) ___-__-__"
                                className={`bg-transparent border-border focus:border-accent ${errors.phone ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                            />
                            {errors.phone && <p className="text-[10px] text-red-500 mt-1">Введите корректный номер телефона</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="question" className="text-xs uppercase tracking-wider">
                                Ваш вопрос *
                            </Label>
                            <Textarea
                                id="question"
                                name="question"
                                value={formData.question}
                                onChange={handleChange}
                                placeholder="Опишите, чем мы можем вам помочь..."
                                rows={4}
                                className={`bg-transparent border-border focus:border-accent resize-none ${errors.question ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                            />
                            {errors.question && <p className="text-[10px] text-red-500 mt-1">Пожалуйста, введите ваш вопрос</p>}
                        </div>

                        <div className="space-y-3">
                            <Label className="text-xs uppercase tracking-wider">
                                Тип обращения
                            </Label>
                            <div className="grid grid-cols-1 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, requestType: 'consultation' }))}
                                    className={`p-3 text-left border rounded-lg text-xs transition-all ${formData.requestType === 'consultation'
                                        ? 'border-accent bg-accent/5 text-foreground'
                                        : 'border-border text-muted-foreground hover:border-accent/50'
                                        }`}
                                >
                                    <span className="font-semibold block mb-0.5">Консультация эксперта</span>
                                    <span className="text-[10px] opacity-80">Помощь с выбором, размеры, оформление</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, requestType: 'capsule' }))}
                                    className={`p-3 text-left border rounded-lg text-xs transition-all ${formData.requestType === 'capsule'
                                        ? 'border-accent bg-accent/5 text-foreground'
                                        : 'border-border text-muted-foreground hover:border-accent/50'
                                        }`}
                                >
                                    <span className="font-semibold block mb-0.5">Капсульная подборка</span>
                                    <span className="text-[10px] opacity-80">Индивидуальная подборка нескольких картин</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, requestType: 'designer' }))}
                                    className={`p-3 text-left border rounded-lg text-xs transition-all ${formData.requestType === 'designer'
                                        ? 'border-accent bg-accent/5 text-foreground'
                                        : 'border-border text-muted-foreground hover:border-accent/50'
                                        }`}
                                >
                                    <span className="font-semibold block mb-0.5">Выезд дизайнера</span>
                                    <span className="text-[10px] opacity-80">Пригласить эксперта на объект (Москва и МО)</span>
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-6 bg-foreground text-background hover:bg-accent hover:text-foreground transition-all text-xs uppercase tracking-widest font-semibold"
                        >
                            {isSubmitting ? "Отправка..." : "Получить консультацию"}
                        </Button>

                        <p className="text-[10px] text-center text-muted-foreground">
                            Нажимая кнопку, вы соглашаетесь с{" "}
                            <a href="/privacy" className="underline hover:text-accent">
                                политикой конфиденциальности
                            </a>
                        </p>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ExpertHelpModal;
