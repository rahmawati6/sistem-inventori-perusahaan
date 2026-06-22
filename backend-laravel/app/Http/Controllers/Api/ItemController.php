<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Item;

class ItemController extends Controller
{
    /**
     * Display a listing of items.
     */
    public function index(Request $request)
    {
        $query = Item::query();

        // Search by code, name, or category
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->has('category') && $request->category !== '') {
            $query->where('category', $request->category);
        }

        $items = $query->orderBy('name', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $items,
        ], 200);
    }

    /**
     * Store a newly created item.
     */
    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:30|unique:items,code',
            'name' => 'required|string|max:120',
            'category' => 'required|string|max:80',
            'unit' => 'required|string|max:30',
            'stock' => 'required|integer|min:0',
            'minimum_stock' => 'required|integer|min:0',
        ], [
            'code.required' => 'Kode barang wajib diisi.',
            'code.unique' => 'Kode barang sudah digunakan.',
            'code.max' => 'Kode barang maksimal 30 karakter.',
            'name.required' => 'Nama barang wajib diisi.',
            'name.max' => 'Nama barang maksimal 120 karakter.',
            'category.required' => 'Kategori wajib diisi.',
            'category.max' => 'Kategori maksimal 80 karakter.',
            'unit.required' => 'Satuan wajib diisi.',
            'unit.max' => 'Satuan maksimal 30 karakter.',
            'stock.required' => 'Stok wajib diisi.',
            'stock.integer' => 'Stok harus berupa angka.',
            'stock.min' => 'Stok tidak boleh kurang dari 0.',
            'minimum_stock.required' => 'Stok minimum wajib diisi.',
            'minimum_stock.integer' => 'Stok minimum harus berupa angka.',
            'minimum_stock.min' => 'Stok minimum tidak boleh kurang dari 0.',
        ]);

        $item = Item::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Barang berhasil ditambahkan.',
            'data' => $item,
        ], 201);
    }

    /**
     * Display the specified item.
     */
    public function show(string $id)
    {
        $item = Item::find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Barang tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $item,
        ], 200);
    }

    /**
     * Update the specified item.
     */
    public function update(Request $request, string $id)
    {
        $item = Item::find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Barang tidak ditemukan.',
            ], 404);
        }

        $request->validate([
            'code' => 'required|string|max:30|unique:items,code,' . $id,
            'name' => 'required|string|max:120',
            'category' => 'required|string|max:80',
            'unit' => 'required|string|max:30',
            'stock' => 'required|integer|min:0',
            'minimum_stock' => 'required|integer|min:0',
        ], [
            'code.required' => 'Kode barang wajib diisi.',
            'code.unique' => 'Kode barang sudah digunakan.',
            'code.max' => 'Kode barang maksimal 30 karakter.',
            'name.required' => 'Nama barang wajib diisi.',
            'name.max' => 'Nama barang maksimal 120 karakter.',
            'category.required' => 'Kategori wajib diisi.',
            'category.max' => 'Kategori maksimal 80 karakter.',
            'unit.required' => 'Satuan wajib diisi.',
            'unit.max' => 'Satuan maksimal 30 karakter.',
            'stock.required' => 'Stok wajib diisi.',
            'stock.integer' => 'Stok harus berupa angka.',
            'stock.min' => 'Stok tidak boleh kurang dari 0.',
            'minimum_stock.required' => 'Stok minimum wajib diisi.',
            'minimum_stock.integer' => 'Stok minimum harus berupa angka.',
            'minimum_stock.min' => 'Stok minimum tidak boleh kurang dari 0.',
        ]);

        $item->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Barang berhasil diperbarui.',
            'data' => $item,
        ], 200);
    }

    /**
     * Remove the specified item.
     */
    public function destroy(string $id)
    {
        $item = Item::find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Barang tidak ditemukan.',
            ], 404);
        }

        // Check if item has stock transactions
        if ($item->stockIns()->count() > 0 || $item->stockOuts()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Barang tidak dapat dihapus karena memiliki riwayat transaksi stok.',
            ], 422);
        }

        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Barang berhasil dihapus.',
        ], 200);
    }
}
