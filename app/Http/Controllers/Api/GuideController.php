<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\GuideProfile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class GuideController extends Controller
{
    /**
     * Display a listing of verified tour guides with search and filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::where('role', 'guide')
            ->whereHas('guideProfile', function ($q) {
                $q->where('verification_status', 'verified');
            })
            ->with(['guideProfile', 'tourPackages']);

        if ($request->filled('location')) {
            $location = $request->input('location');
            $query->whereHas('guideProfile', function ($q) use ($location) {
                $q->where('city', 'like', "%{$location}%")
                  ->orWhere('province', 'like', "%{$location}%");
            });
        }

        if ($request->filled('category')) {
            $category = $request->input('category');
            $query->whereHas('tourPackages', function ($q) use ($category) {
                $q->where('title', 'like', "%{$category}%")
                  ->orWhere('description', 'like', "%{$category}%");
            });
        }

        $guides = $query->paginate(12);

        return response()->json([
            'success' => true,
            'data' => $guides
        ]);
    }

    /**
     * Display the specified tour guide profile with packages and reviews.
     */
    public function show(int $id): JsonResponse
    {
        $guide = User::where('role', 'guide')
            ->with(['guideProfile', 'tourPackages', 'bookingsAsGuide.traveler'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $guide
        ]);
    }
}
