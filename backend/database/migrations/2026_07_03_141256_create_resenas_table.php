<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resenas', function (Blueprint $table) {
            $table->id();

            // Usuario que hace la reseña
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');

            $table->enum('tipo', ['web', 'product', 'order'])->default('web');

            // Relación opcional según tipo
            $table->foreignId('product_id')
                ->nullable()
                ->constrained()
                ->onDelete('cascade');

            $table->foreignId('order_id')
                ->nullable()
                ->constrained()
                ->onDelete('cascade');

            // Contenido
            $table->tinyInteger('puntuacion'); // 1-5
            $table->text('comentario')->nullable();
            $table->string('titulo')->nullable();
            $table->json('imagenes')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resenas');
    }
};