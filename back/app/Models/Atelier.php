<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Atelier extends Model
{
    use HasFactory;


    protected $fillable = [
        'artisan_id',
        'nom',
        'description',
        'image_principale',
        'localisation',
        'domaine',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    /**
     * Un atelier appartient à un artisan
     */
    public function artisan()
    {
        return $this->belongsTo(Artisan::class);
    }

    /**
     * Un atelier a plusieurs offres
     */
    public function offres()
    {
        return $this->hasMany(Offre::class);
    }

    /**
     * Un atelier a plusieurs avis
     */
    public function avis()
    {
        return $this->hasMany(Avis::class);
    }
}
