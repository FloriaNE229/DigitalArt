<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Artisan;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ArtisanController extends Controller
{
    /**
     * Récupérer tous les artisans avec leurs informations
     */
    public function index(): JsonResponse
    {
        // SELECT all artisans avec leurs relations (user et atelier)
        $artisans = Artisan::with(['user', 'atelier'])->get();

        // Formater les données
        $data = $artisans->map(function ($artisan) {
            return [
                'id' => $artisan->id,
                'user_id' => $artisan->user_id,
                'telephone' => $artisan->telephone,

                // Informations de l'utilisateur
                'user' => [
                    'id' => $artisan->user->id,
                    'nom' => $artisan->user->nom,
                    'prenom' => $artisan->user->prenom,
                    'email' => $artisan->user->email,
                    'photo_profil' => $artisan->user->photo_profil
                        ? Storage::url($artisan->user->photo_profil)
                        : null,
                    'created_at' => $artisan->user->created_at->format('Y-m-d H:i:s'),
                ],

                // Informations de l'atelier (si existe)
                'atelier' => $artisan->atelier ? [
                    'id' => $artisan->atelier->id,
                    'nom' => $artisan->atelier->nom,
                    'description' => $artisan->atelier->description,
                    'image_principale' => $artisan->atelier->image_principale
                        ? Storage::url($artisan->atelier->image_principale)
                        : null,
                    'localisation' => $artisan->atelier->localisation,
                    'domaine' => $artisan->atelier->domaine,
                    'created_at' => $artisan->atelier->created_at
                        ? $artisan->atelier->created_at->format('Y-m-d H:i:s')
                        : null,
                ] : null,
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Liste des artisans récupérée avec succès.',
            'data' => $data,
        ], 200);
    }

    /**
     * Récupérer un artisan spécifique
     */
    public function show(int $id): JsonResponse
    {
        $artisan = Artisan::with(['user', 'atelier'])->find($id);

        if (!$artisan) {
            return response()->json([
                'success' => false,
                'message' => 'Artisan non trouvé.',
            ], 404);
        }

        $data = [
            'id' => $artisan->id,
            'user_id' => $artisan->user_id,
            'telephone' => $artisan->telephone,

            'user' => [
                'id' => $artisan->user->id,
                'nom' => $artisan->user->nom,
                'prenom' => $artisan->user->prenom,
                'email' => $artisan->user->email,
                'photo_profil' => $artisan->user->photo_profil
                    ? Storage::url($artisan->user->photo_profil)
                    : null,
                'created_at' => $artisan->user->created_at->format('Y-m-d H:i:s'),
            ],

            'atelier' => $artisan->atelier ? [
                'id' => $artisan->atelier->id,
                'nom' => $artisan->atelier->nom,
                'description' => $artisan->atelier->description,
                'image_principale' => $artisan->atelier->image_principale
                    ? Storage::url($artisan->atelier->image_principale)
                    : null,
                'localisation' => $artisan->atelier->localisation,
                'domaine' => $artisan->atelier->domaine,
                'created_at' => $artisan->atelier->created_at
                    ? $artisan->atelier->created_at->format('Y-m-d H:i:s')
                    : null,
            ] : null,
        ];

        return response()->json([
            'success' => true,
            'message' => 'Artisan récupéré avec succès.',
            'data' => $data,
        ], 200);
    }
}
