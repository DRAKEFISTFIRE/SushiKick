<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();

            // Nombre del producto
            $table->string('nombre');

            // Descripción / información
            $table->text('info')->nullable();

            // Imagen del producto
            $table->string('imagen')->nullable();

            // Precio
            $table->decimal('precio', 10, 2);

            // Categoría
            $table->foreignId('categoria_id')
                  ->constrained('categorias')
                  ->onDelete('cascade');

            // Stock disponible
            $table->integer('stock')->default(0);

            // SKU o referencia interna
            $table->string('sku')->unique()->nullable();

            // Estado del producto
            $table->boolean('activo')->default(true);

            // Peso del producto
            $table->decimal('peso', 8, 2)->nullable();

            // Oferta / descuento
            $table->decimal('descuento', 5, 2)->default(0);

            // Producto destacado
            $table->boolean('destacado')->default(false);

            // Tiempo de preparación en minutos
            $table->integer('tiempo_preparacion')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};