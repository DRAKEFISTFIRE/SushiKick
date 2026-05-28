<?php

namespace App\Http\Controllers;

use App\Models\Categorias; // 👈 ESTE ES EL IMPORT CORRECTO

class CategoriaController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Categorias::all()
        ]);
    }
}