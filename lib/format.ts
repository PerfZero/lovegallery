/**
 * Утилиты для форматирования и валидации данных форм
 */

/**
 * Применяет маску телефона +7 (XXX) XXX-XX-XX
 * @param value Строка ввода
 * @returns Отформатированная строка
 */
export const formatPhoneNumber = (value: string): string => {
    // Оставляем только цифры
    let phone = value.replace(/\D/g, "");

    // Если первая цифра 8, меняем на 7
    if (phone.startsWith('8')) {
        phone = '7' + phone.substring(1);
    }

    // Если пусто - возвращаем пусто или +7 при начале ввода
    if (!phone) return value.length > 0 ? "+7" : "";

    // Ограничиваем длину (11 цифр)
    phone = phone.substring(0, 11);

    // Форматируем
    let formattedValue = "+7";

    // Если ввели только 7, возвращаем +7
    if (phone === '7' && value.length <= 2) return "+7";

    // Убираем первую 7 для форматирования внутренностей
    const numbers = phone.startsWith('7') ? phone.substring(1) : phone;

    if (numbers.length > 0) {
        formattedValue += " (" + numbers.substring(0, 3);
    }
    if (numbers.length >= 4) {
        formattedValue += ") " + numbers.substring(3, 6);
    }
    if (numbers.length >= 7) {
        formattedValue += "-" + numbers.substring(6, 8);
    }
    if (numbers.length >= 9) {
        formattedValue += "-" + numbers.substring(8, 10);
    }

    return formattedValue;
};

/**
 * Валидация Email
 */
export const isValidEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

/**
 * Валидация телефона (проверка на количество цифр)
 */
export const isValidPhone = (phone: string): boolean => {
    const digits = phone.replace(/\D/g, "");
    return digits.length === 11;
};
