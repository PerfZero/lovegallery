<?php
/**
 * PHP-обработчик для отправки данных с форм сайта Любовь
 * 
 * Настройка: в строке 15 замените email на почту заказчика.
 */

// Основные настройки
$toEmail = "moraamethyst@virgilian.com"; // <-- ЗАМЕНИТЕ НА НУЖНУЮ ПОЧТУ
$subjectPrefix = "Заявка с сайта Любовь: ";

// Заголовки для корректной обработки JSON и CORS
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Получаем данные
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (!$data) {
        echo json_encode(["status" => "error", "message" => "Invalid JSON"]);
        exit;
    }

    $formType = isset($data["formType"]) ? $data["formType"] : "Общая форма";
    $name = isset($data["name"]) ? strip_tags($data["name"]) : "Не указано";
    $phone = isset($data["phone"]) ? strip_tags($data["phone"]) : "Не указано";
    $email = isset($data["email"]) ? strip_tags($data["email"]) : "Не указано";
    $message = isset($data["message"]) ? strip_tags($data["message"]) : "Нет сообщения";
    $product = isset($data["product"]) ? strip_tags($data["product"]) : null;
    $price = isset($data["price"]) ? strip_tags($data["price"]) : null;
    $options = isset($data["options"]) ? $data["options"] : null;
    $subjectLabel = isset($data["subject"]) ? strip_tags($data["subject"]) : $formType;

    // Формируем список опций
    $optionsHtml = "";
    if ($options && is_array($options)) {
        $optionsHtml .= "<h3>Характеристики заказа:</h3><ul>";
        foreach ($options as $key => $value) {
            if ($value) {
                $optionsHtml .= "<li><strong>$key:</strong> $value</li>";
            }
        }
        $optionsHtml .= "</ul>";
    }

    // Формируем тело письма (HTML)
    $emailSubject = $subjectPrefix . $subjectLabel;
    
    $emailBody = "
    <html>
    <head>
        <title>$emailSubject</title>
    </head>
    <body style='font-family: sans-serif; line-height: 1.6;'>
        <h2>Новая заявка с сайта Любовь</h2>
        <p><strong>Тип формы:</strong> $formType</p>
        <hr>
        <p><strong>Имя:</strong> $name</p>
        <p><strong>Телефон:</strong> $phone</p>
        <p><strong>Email:</strong> $email</p>
        " . ($product ? "<p><strong>Товар:</strong> $product</p>" : "") . "
        " . ($price ? "<p><strong>Цена:</strong> $price</p>" : "") . "
        $optionsHtml
        <p><strong>Сообщение:</strong><br>$message</p>
        <hr>
        <p style='font-size: 12px; color: #666;'>Это письмо отправлено автоматически с вашего сайта.</p>
    </body>
    </html>
    ";

    // Заголовки письма
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: no-reply@lubov-art.ru" . "\r\n";

    // Отправка
    if (mail($toEmail, $emailSubject, $emailBody, $headers)) {
        echo json_encode(["status" => "success", "message" => "Mail sent successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Mail function failed"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Only POST requests allowed"]);
}
?>
