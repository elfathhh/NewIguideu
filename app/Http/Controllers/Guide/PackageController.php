<?php

namespace App\Http\Controllers\Guide;

use App\Http\Controllers\Controller;
use App\Models\TourPackage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PackageController extends Controller
{
    public function index(Request $request)
    {
        $packages = TourPackage::where('guide_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('guide/packages', [
            'packages' => $packages
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration_hours' => 'required|numeric|min:1',
            'max_persons' => 'required|integer|min:1',
            'includes' => 'nullable|array',
            'excludes' => 'nullable|array',
        ]);

        $validated['guide_id'] = $request->user()->id;

        TourPackage::create($validated);

        return redirect()->back()->with('success', 'Paket tur berhasil ditambahkan.');
    }

    public function update(Request $request, TourPackage $package)
    {
        if ($package->guide_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration_hours' => 'required|numeric|min:1',
            'max_persons' => 'required|integer|min:1',
            'includes' => 'nullable|array',
            'excludes' => 'nullable|array',
        ]);

        $package->update($validated);

        return redirect()->back()->with('success', 'Paket tur berhasil diperbarui.');
    }

    public function destroy(Request $request, TourPackage $package)
    {
        if ($package->guide_id !== $request->user()->id) {
            abort(403);
        }

        $package->delete();

        return redirect()->back()->with('success', 'Paket tur berhasil dihapus.');
    }
}
