<?php

namespace App\Http\Controllers;

use App\Models\Productos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductoController extends Controller
{
    public function index()
    {
        $productos = Productos::with('categoria')->get();

        // 👇 añadir URL completa de imagen
        $productos->transform(function ($producto) {
            $producto->imagen_url = $producto->imagen
                ? asset('storage/' . $producto->imagen)
                : null;

            return $producto;
        });

        return response()->json([
            'success' => true,
            'data' => $productos
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->all();

        // 📸 subir imagen si viene
        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('uploads', 'public');
            $data['imagen'] = $path;
        }

        $producto = Productos::create($data);

        // 👇 añadir URL en respuesta
        $producto->imagen_url = $producto->imagen
            ? asset('storage/' . $producto->imagen)
            : null;

        return response()->json([
            'success' => true,
            'data' => $producto
        ], 201);
    }

    public function show($id)
    {
        $producto = Productos::with('categoria')->findOrFail($id);

        $producto->imagen_url = $producto->imagen
            ? asset('storage/' . $producto->imagen)
            : null;

        return $producto;
    }

    public function update(Request $request, $id)
    {
        $producto = Productos::findOrFail($id);

        $data = $request->all();

        // 📸 si llega nueva imagen, reemplazar
        if ($request->hasFile('imagen')) {

            // borrar anterior si existe
            if ($producto->imagen) {
                Storage::disk('public')->delete($producto->imagen);
            }

            $path = $request->file('imagen')->store('uploads', 'public');
            $data['imagen'] = $path;
        }

        $producto->update($data);

        $producto->imagen_url = $producto->imagen
            ? asset('storage/' . $producto->imagen)
            : null;

        return $producto;
    }

    public function destroy($id)
    {
        $producto = Productos::findOrFail($id);

        // borrar imagen del storage
        if ($producto->imagen) {
            Storage::disk('public')->delete($producto->imagen);
        }

        $producto->delete();

        return response()->json([
            'success' => true
        ]);
    }
}