<?php

namespace App\Http\Controllers;

use App\Models\Productos;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    public function index()
    {
        $productos = Productos::with('categoria')->get();

        return response()->json([
            'success' => true,
            'data' => $productos
        ]);
    }

    public function store(Request $request)
    {
        $producto = Productos::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $producto
        ], 201);
    }

    public function show($id)
    {
        return Productos::with('categoria')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $producto = Productos::findOrFail($id);
        $producto->update($request->all());

        return $producto;
    }

    public function destroy($id)
    {
        Productos::destroy($id);

        return response()->json([
            'success' => true
        ]);
    }
}