<?php

function multer($inputName = 'file', $folder = 'storage/uploads/')
{
    // Crear carpeta si no existe
    if (!file_exists($folder)) {
        mkdir($folder, 0777, true);
    }

    // Verificar archivo
    if (!isset($_FILES[$inputName])) {
        return [
            'success' => false,
            'message' => 'Archivo no enviado'
        ];
    }

    $file = $_FILES[$inputName];

    // Error upload
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return [
            'success' => false,
            'message' => 'Error al subir archivo'
        ];
    }

    // Extensiones permitidas
    $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if (!in_array($ext, $allowed)) {
        return [
            'success' => false,
            'message' => 'Formato inválido'
        ];
    }

    // Nombre único
    $filename = uniqid() . '_' . time() . '.' . $ext;

    $destination = rtrim($folder, '/') . '/' . $filename;

    // Guardar
    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        return [
            'success' => false,
            'message' => 'No se pudo guardar'
        ];
    }

    return [
        'success' => true,
        'file' => [
            'name' => $filename,
            'path' => $destination,
            'url'  => '/' . $destination,
            'size' => $file['size'],
            'type' => $file['type']
        ]
    ];
}

