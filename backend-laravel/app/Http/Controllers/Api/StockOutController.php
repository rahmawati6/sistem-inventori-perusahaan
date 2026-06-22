<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StockOut;
use App\Models\Item;
use Illuminate\Support\Facades\DB;

class StockOutController extends Controller
{
    /**
     * Display a listing of stock outs.
     */
    public function index(Request $request)
    {
        $query = StockOut::with(['item:id,code,name,unit', 'user:id,name']);

        // Search
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('destination', 'like', "%{$search}%")
                  ->orWhereHas('item', function ($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%")
                         ->orWhere('code', 'like', "%{$search}%");
                  });
            });
        }

        $stockOuts = $query->orderBy('date_out', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $stockOuts,
        ], 200);
    }

    /**
     * Store a newly created stock out and auto-decrement item stock.
     */
    public function store(Request $request)
    {
        $request->validate([
            'item_id' => 'required|exists:items,id',
            'date_out' => 'required|date',
            'quantity' => 'required|integer|min:1',
            'destination' => 'required|string|max:120',
            'notes' => 'nullable|string|max:255',
        ], [
            'item_id.required' => 'Barang wajib dipilih.',
            'item_id.exists' => 'Barang tidak ditemukan.',
            'date_out.required' => 'Tanggal keluar wajib diisi.',
            'date_out.date' => 'Format tanggal tidak valid.',
            'quantity.required' => 'Jumlah wajib diisi.',
            'quantity.integer' => 'Jumlah harus berupa angka.',
            'quantity.min' => 'Jumlah minimal 1.',
            'destination.required' => 'Tujuan wajib diisi.',
            'destination.max' => 'Tujuan maksimal 120 karakter.',
            'notes.max' => 'Catatan maksimal 255 karakter.',
        ]);

        // Check stock availability
        $item = Item::findOrFail($request->item_id);
        if ($request->quantity > $item->stock) {
            return response()->json([
                'success' => false,
                'message' => 'Stok tidak mencukupi. Stok tersedia: ' . $item->stock . ' ' . $item->unit . '.',
            ], 422);
        }

        try {
            DB::beginTransaction();

            $stockOut = StockOut::create([
                'item_id' => $request->item_id,
                'date_out' => $request->date_out,
                'quantity' => $request->quantity,
                'destination' => $request->destination,
                'notes' => $request->notes,
                'user_id' => $request->user()->id,
            ]);

            // Auto-decrement item stock
            $item->decrement('stock', $request->quantity);

            DB::commit();

            $stockOut->load(['item:id,code,name,unit', 'user:id,name']);

            return response()->json([
                'success' => true,
                'message' => 'Barang keluar berhasil ditambahkan.',
                'data' => $stockOut,
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
     * Display the specified stock out.
     */
    public function show(string $id)
    {
        $stockOut = StockOut::with(['item:id,code,name,unit', 'user:id,name'])->find($id);

        if (!$stockOut) {
            return response()->json([
                'success' => false,
                'message' => 'Data barang keluar tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $stockOut,
        ], 200);
    }

    /**
     * Update the specified stock out and adjust stock accordingly.
     */
    public function update(Request $request, string $id)
    {
        $stockOut = StockOut::find($id);

        if (!$stockOut) {
            return response()->json([
                'success' => false,
                'message' => 'Data barang keluar tidak ditemukan.',
            ], 404);
        }

        $request->validate([
            'item_id' => 'required|exists:items,id',
            'date_out' => 'required|date',
            'quantity' => 'required|integer|min:1',
            'destination' => 'required|string|max:120',
            'notes' => 'nullable|string|max:255',
        ], [
            'item_id.required' => 'Barang wajib dipilih.',
            'item_id.exists' => 'Barang tidak ditemukan.',
            'date_out.required' => 'Tanggal keluar wajib diisi.',
            'date_out.date' => 'Format tanggal tidak valid.',
            'quantity.required' => 'Jumlah wajib diisi.',
            'quantity.integer' => 'Jumlah harus berupa angka.',
            'quantity.min' => 'Jumlah minimal 1.',
            'destination.required' => 'Tujuan wajib diisi.',
            'destination.max' => 'Tujuan maksimal 120 karakter.',
            'notes.max' => 'Catatan maksimal 255 karakter.',
        ]);

        try {
            DB::beginTransaction();

            $oldQuantity = $stockOut->quantity;
            $oldItemId = $stockOut->item_id;

            if ($oldItemId != $request->item_id) {
                // Item changed: revert old item stock and check new item stock
                $oldItem = Item::findOrFail($oldItemId);
                $oldItem->increment('stock', $oldQuantity);

                $newItem = Item::findOrFail($request->item_id);
                if ($request->quantity > $newItem->stock) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => 'Stok tidak mencukupi. Stok tersedia: ' . $newItem->stock . ' ' . $newItem->unit . '.',
                    ], 422);
                }
                $newItem->decrement('stock', $request->quantity);
            } else {
                // Same item, adjust difference
                $item = Item::findOrFail($oldItemId);
                $difference = $request->quantity - $oldQuantity;
                if ($difference > 0) {
                    // More stock going out
                    if ($difference > $item->stock) {
                        DB::rollBack();
                        return response()->json([
                            'success' => false,
                            'message' => 'Stok tidak mencukupi. Stok tersedia: ' . $item->stock . ' ' . $item->unit . '.',
                        ], 422);
                    }
                    $item->decrement('stock', $difference);
                } elseif ($difference < 0) {
                    // Less stock going out, revert some
                    $item->increment('stock', abs($difference));
                }
            }

            $stockOut->update([
                'item_id' => $request->item_id,
                'date_out' => $request->date_out,
                'quantity' => $request->quantity,
                'destination' => $request->destination,
                'notes' => $request->notes,
            ]);

            DB::commit();

            $stockOut->load(['item:id,code,name,unit', 'user:id,name']);

            return response()->json([
                'success' => true,
                'message' => 'Barang keluar berhasil diperbarui.',
                'data' => $stockOut,
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
     * Remove the specified stock out and revert stock.
     */
    public function destroy(string $id)
    {
        $stockOut = StockOut::find($id);

        if (!$stockOut) {
            return response()->json([
                'success' => false,
                'message' => 'Data barang keluar tidak ditemukan.',
            ], 404);
        }

        try {
            DB::beginTransaction();

            // Revert item stock (add back)
            $item = Item::findOrFail($stockOut->item_id);
            $item->increment('stock', $stockOut->quantity);

            $stockOut->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Barang keluar berhasil dihapus.',
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
