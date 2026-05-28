<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {

            // 🔥 IMPORTANTE: asegurar InnoDB para foreign keys
            $table->engine = 'InnoDB';

            $table->id();

            $table->string('nombre');
            $table->text('info')->nullable();
            $table->string('imagen')->nullable();

            $table->decimal('precio', 10, 2);

            // 🔥 FK correcta y explícita
            $table->foreignId('categoria_id')
                ->constrained('categorias', 'id')
                ->cascadeOnDelete();

            $table->integer('stock')->default(0);

            $table->string('sku')->unique()->nullable();

            $table->boolean('activo')->default(true);

            $table->decimal('peso', 8, 2)->nullable();

            $table->decimal('descuento', 5, 2)->default(0);

            $table->boolean('destacado')->default(false);

            $table->integer('tiempo_preparacion')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};