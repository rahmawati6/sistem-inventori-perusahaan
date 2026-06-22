<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StockIn;
use App\Models\Item;
use Illuminate\Support\Facades\DB;

class StockInController extends Controller
{
    /**
     * Display a listing of stock ins.
     */
    public function index(Request $request)
    {
        $query = StockIn::with(['item:id,code,name,unit', 'user:id,name']);

        // Search
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('supplier', 'like', "%{$search}%")
                  ->orWhereHas('item', function ($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%")
                         ->orWhere('code', 'like', "%{$search}%");
                  });
            });
        }

        $stockIns = $query->orderBy('date_in', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $stockIns,
        ], 200);
    }

    /**
     * Store a newly created stock in and auto-increment item stock.
     */
    public function store(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'date_in' => 'required|date',
            'quantity' => 'required|integer|min:1',
            'supplier' => 'required|string|max:120',
            'notes' => 'nullable|string|max:255',
        ], [
            'item_id.required' => 'Barang wajib dipilih.',
            'item_id.exists' => 'Barang tidak ditemukan.',
            'date_in.required' => 'Tanggal masuk wajib diisi.',
            'date_in.date' => 'Format tanggal tidak valid.',
            'quantity.required' => 'Jumlah wajib diisi.',
            'quantity.integer' => 'Jumlah harus berupa angka.',
            'quantity.min' => 'Jumlah minimal 1.',
            'supplier.required' => 'Supplier wajib diisi.',
            'supplier.max' => 'Supplier maksimal 120 karakter.',
            'notes.max' => 'Catatan maksimal 255 karakter.',
        ]);

        try {
            DB::beginTransaction();

            $stockIn = StockIn::create([
                'item_id' => $request->item_id,
                'date_in' => $request->date_in,
                'quantity' => $request->quantity,
                'supplier' => $request->supplier,
                'notes' => $request->notes,
                'user_id' => $request->user()->id,
            ]);

            // Auto-increment item stock
            $item = Item::findOrFail($request->item_id);
            $item->increment('stock', $request->quantity);

            DB::commit();

            $stockIn->load(['item:id,code,name,unit', 'user:id,name']);

            return response()->json([
                'success' => true,
                'message' => 'Barang masuk berhasil ditambahkan.',
                'data' => $stockIn,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menyimpan data.',
            ], 500);
        }
    }

    /**
     * Display the specified stock in.
     */
    public function show(string $id)
    {
        $stockIn = StockIn::with(['item:id,code,name,unit', 'user:id,name'])->find($id);

        if (!$stockIn) {
            return response()->json([
                'success' => false,
                'message' => 'Data barang masuk tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $stockIn,
        ], 200);
    }

    /**
     * Update the specified stock in and adjust stock accordingly.
     */
    public function update(Request $request, string $id)
    {
        $stockIn = StockIn::find($id);

        if (!$stockIn) {
            return response()->json([
                'success' => false,
                'message' => 'Data barang masuk tidak ditemukan.',
            ], 404);
        }

        $request->validate([
            'item_id' => 'required|exists:items,id',
            'date_in' => 'required|date',
            'quantity' => 'required|integer|min:1',
            'supplier' => 'required|string|max:120',
            'notes' => 'nullable|string|max:255',
        ], [
            'item_id.required' => 'Barang wajib dipilih.',
            'item_id.exists' => 'Barang tidak ditemukan.',
            'date_in.required' => 'Tanggal masuk wajib diisi.',
            'date_in.date' => 'Format tanggal tidak valid.',
            'quantity.required' => 'Jumlah wajib diisi.',
            'quantity.integer' => 'Jumlah harus berupa angka.',
            'quantity.min' => 'Jumlah minimal 1.',
            'supplier.required' => 'Supplier wajib diisi.',
            'supplier.max' => 'Supplier maksimal 120 karakter.',
            'notes.max' => 'Catatan maksimal 255 karakter.',
        ]);

        try {
            DB::beginTransaction();

            $oldQuantity = $stockIn->quantity;
            $oldItemId = $stockIn->item_id;

            // If item changed, revert old item stock and update new item stock
            if ($oldItemId != $request->item_id) {
                // Revert old item stock
                $oldItem = Item::findOrFail($oldItemId);
                $oldItem->decrement('stock', $oldQuantity);

                // Update new item stock
                $newItem = Item::findOrFail($request->item_id);
                $newItem->increment('stock', $request->quantity);
            } else {
                // Same item, adjust difference
                $item = Item::findOrFail($oldItemId);
                $difference = $request->quantity - $oldQuantity;
                if ($difference > 0) {
                    $item->increment('stock', $difference);
                } elseif ($difference < 0) {
                    // Check if reverting would cause negative stock
                    if ($item->stock + $difference < 0) {
                        DB::rollBack();
                        return response()->json([
                            'success' => false,
                            'message' => 'Stok tidak mencukupi untuk perubahan jumlah ini.',
                        ], 422);
                    }
                    $item->decrement('stock', abs($difference));
                }
            }

            $stockIn->update([
                'item_id' => $request->item_id,
                'date_in' => $request->date_in,
                'quantity' => $request->quantity,
                'supplier' => $request->supplier,
                'notes' => $request->notes,
            ]);

            DB::commit();

            $stockIn->load(['item:id,code,name,unit', 'user:id,name']);

            return response()->json([
                'success' => true,
                'message' => 'Barang masuk berhasil diperbarui.',
                'data' => $stockIn,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui data.',
            ], 500);
        }
    }

    /**
     * Remove the specified stock in and revert stock.
     */
    public function destroy(string $id)
    {
        $stockIn = StockIn::find($id);

        if (!$stockIn) {
            return response()->json([
                'success' => false,
                'message' => 'Data barang masuk tidak ditemukan.',
            ], 404);
        }

        try {
            DB::beginTransaction();

            // Revert item stock
            $item = Item::findOrFail($stockIn->item_id);
            if ($item->stock < $stockIn->quantity) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak dapat menghapus. Stok barang saat ini tidak mencukupi untuk pengembalian.',
                ], 422);
            }
            $item->decrement('stock', $stockIn->quantity);

            $stockIn->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Barang masuk berhasil dihapus.',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menghapus data.',
            ], 500);
        }
    }
}
