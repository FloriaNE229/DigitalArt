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
        Schema::create('atelier', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artisan_id')->constrained();
            $table->string("nom",150);
            $table->string("image_principale")->nullable();
            $table->text("description");
            $table->string("domaine",100);
            $table->string("localisation",255);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('atelier');
    }
};
