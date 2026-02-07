import { Metadata } from 'next';
import PaymentDeliveryContent from './PaymentDeliveryContent';

export const metadata: Metadata = {
    title: 'Оплата и Доставка | Любовь — Галерея Интерьерного Искусства',
    description: 'Персональный консьерж-сервис по Москве и надежная доставка искусства по всему миру (DHL, СДЭК). Безопасная онлайн-оплата и страхование грузов.',
};

export default function PaymentDeliveryPage() {
    return <PaymentDeliveryContent />;
}
