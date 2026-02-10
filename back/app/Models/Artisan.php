<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Artisan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'telephone',
        'domaine',
        'specialites'
    ];

    /**
     * Un artisan appartient à un utilisateur
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Un artisan a un atelier
     */
    public function atelier()
    {
        return $this->hasOne(Atelier::class);
    }
}
