"use client";

import { useState } from "react";
import { X } from "lucide-react";
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
import { formatPhoneNumber, isValidEmail, isValidPhone } from "@/lib/format";

// =============================================================================
// Order Form Modal Component
// =============================================================================

interface OrderFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName?: string;
    productPrice?: string;
    selectedOptions?: {
        size: string;
        frame: string;
        passepartout: string;
        glass: string;
        productType: string;
        finish?: string;
        fabric?: string;
    };
}

export const OrderFormModal = ({
    isOpen,
    onClose,
    productName,
    productPrice,
    selectedOptions,
}: OrderFormModalProps) => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        comment: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        if (name === "phone") {
            const input = e.target as HTMLInputElement;
            // Get raw digits to compare with previous state
            const digits = value.replace(/\D/g, "");
            const prevDigits = formData.phone.replace(/\D/g, "");

            // If user is deleting, we need to be careful not to get stuck in the mask
            // But actually formatPhoneNumber handles raw digits, so it should be fine
            // as long as we pass the new value.
            const formatted = formatPhoneNumber(value);
            setFormData(prev => ({ ...prev, [name]: formatted }));

            if (errors.phone) setErrors(prev => ({ ...prev, phone: false }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
            if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: boolean } = {};
        if (!formData.name.trim()) newErrors.name = true;
        if (!isValidPhone(formData.phone)) newErrors.phone = true;
        if (formData.email && !isValidEmail(formData.email)) newErrors.email = true;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formType: "Заказ товара",
                    product: productName || "Не указан",
                    price: productPrice || "Не указана",
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    message: formData.comment,
                    // Дополнительные характеристики
                    options: selectedOptions ? {
                        "Размер": selectedOptions.size,
                        "Рама": selectedOptions.frame,
                        "Паспарту": selectedOptions.passepartout,
                        "Стекло": selectedOptions.glass,
                        "Тип изделия": selectedOptions.productType,
                        "Отделка": selectedOptions.finish,
                        "Ткань": selectedOptions.fabric
                    } : null
                }),
            });

            if (response.ok) {
                setIsSuccess(true);
            } else {
                console.error("Failed to send order");
            }
        } catch (error) {
            console.error("Error submitting order:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({ name: "", phone: "", email: "", comment: "" });
        setErrors({});
        setIsSuccess(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] bg-background border-border">
                <DialogHeader>
                    <DialogTitle className="font-display text-2xl italic">
                        {isSuccess ? "Спасибо за заявку!" : "Оформить заказ"}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {isSuccess
                            ? "Мы свяжемся с вами в ближайшее время."
                            : productName
                                ? `Товар: ${productName}`
                                : "Заполните форму, и мы свяжемся с вами"}
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="py-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                            <span className="text-2xl">✓</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Мы перезвоним вам в течение дня для подтверждения.
                        </p>
                        <Button
                            onClick={handleClose}
                            className="mt-6"
                            variant="outline"
                        >
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
                                className={`bg-transparent border focus:border-accent ${errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-border'}`}
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
                                className={`bg-transparent border focus:border-accent ${errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-border'}`}
                            />
                            {errors.phone && <p className="text-[10px] text-red-500 mt-1">Введите корректный номер</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs uppercase tracking-wider">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="email@example.com"
                                className={`bg-transparent border focus:border-accent ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-border'}`}
                            />
                            {errors.email && <p className="text-[10px] text-red-500 mt-1">Некорректный email</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="comment" className="text-xs uppercase tracking-wider">
                                Комментарий
                            </Label>
                            <Textarea
                                id="comment"
                                name="comment"
                                value={formData.comment}
                                onChange={handleChange}
                                placeholder="Дополнительные пожелания..."
                                rows={3}
                                className="bg-transparent border-border focus:border-accent resize-none"
                            />
                        </div>

                        {productPrice && (
                            <div className="pt-2 border-t border-border">
                                <p className="text-sm text-muted-foreground">
                                    Ориентировочная стоимость:{" "}
                                    <span className="text-foreground font-medium">
                                        {productPrice}
                                    </span>
                                </p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-6 bg-foreground text-background hover:bg-accent hover:text-foreground transition-all text-xs uppercase tracking-widest font-semibold"
                        >
                            {isSubmitting ? "Отправка..." : "Отправить заявку"}
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

export default OrderFormModal;
