<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Offre extends Model
{
    //
    protected $fillable = [
        'atelier_id',
        'titre',
        'description',
        'prix',
    ];

    public function atelier(){
        return $this->belongsTo(Atelier::class);
    }
}
