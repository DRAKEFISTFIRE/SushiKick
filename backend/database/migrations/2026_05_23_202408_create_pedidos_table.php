<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->json('productos');
            $table->json('unidades');

            $table->enum('estado', [
                'pendiente',
                'preparando',
                'enviado',
                'entregado',
                'cancelado'
            ])->default('pendiente');

            $table->decimal('total', 10, 2)->default(0);

            $table->string('direccion_local');
            $table->string('direccion');

            $table->timestamp('hora_pedido')->useCurrent();
            $table->timestamp('tiempo_preparacion')->useCurrent();

            $table->text('notas')->nullable();

            $table->enum('tipo_pago', [
                'efectivo',
                'tarjeta',
                'paypal',
                'bizum'
            ])->default('efectivo');

            $table->json('datos_pago')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};