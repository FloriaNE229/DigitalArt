<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Atelier extends Model
{
    use HasFactory;

    protected $table = 'ateliers';

    protected $fillable = [
        'artisan_id',
        'nom',
        'description',
        'image_principale',
        'localisation',
        'domaine',
        'suspendu',
    ];

    protected $casts = [
        'suspendu' => 'boolean',
    ];

    // Injecte image_url dans chaque réponse JSON automatiquement
    protected $appends = ['image_url'];

    // ── Relations ─────────────────────────────────────────────

    public function artisan(): BelongsTo
    {
        return $this->belongsTo(Artisan::class, 'artisan_id');
    }

    public function offres(): HasMany
    {
        return $this->hasMany(Offre::class, 'atelier_id');
    }

    public function galerie(): HasMany
    {
        return $this->hasMany(GalerieAtelier::class, 'atelier_id');
    }

    public function rendezVous(): HasMany
    {
        return $this->hasMany(RendezVous::class, 'atelier_id');
    }

    public function services(): HasMany
    {
        return $this->hasMany(Service::class, 'atelier_id');
    }

    public function avis(): HasMany
    {
        return $this->hasMany(Avis::class, 'atelier_id');
    }

    public function oeuvres(): HasMany
    {
        return $this->hasMany(Oeuvre::class, 'atelier_id');
    }

    public function horaires(): HasMany
    {
        return $this->hasMany(Horaire::class, 'atelier_id');
    }

    public function indisponibilites(): HasMany
    {
        return $this->hasMany(Indisponibilite::class, 'atelier_id');
    }

    // ── Accesseurs ────────────────────────────────────────────

    /**
     * URL publique complète — corrige aussi les URLs sans port stockées en DB.
     * Ex: http://localhost:8000/storage/ateliers/image.jpg
     */
    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image_principale) return null;

        $appUrl = rtrim(config('app.url'), '/');

        if (str_starts_with($this->image_principale, 'http')) {
            // Corrige http://localhost/storage → http://localhost:8000/storage
            return preg_replace(
                '#^https?://[^/]+/storage#',
                $appUrl . '/storage',
                $this->image_principale
            );
        }

        return Storage::disk('public')->url($this->image_principale);
    }

    public function noteMoyenne(): float
    {
        return (float) $this->avis()->avg('note') ?? 0;
    }
}