<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Item;
use App\Models\StockIn;
use App\Models\StockOut;

class ReportController extends Controller
{
    /**
     * Get all items for report.
     */
    public function items()
    {
        $items = Item::orderBy('name', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $items,
        ], 200);
    }

    /**
     * Get stock ins with optional date filters.
     */
    public function stockIns(Request $request)
    {
        $query = StockIn::with(['item:id,code,name,unit,category', 'user:id,name']);

        if ($request->has('start_date') && $request->start_date !== '') {
            $query->where('date_in', '>=', $request->start_date);
        }

        if ($request->has('end_date') && $request->end_date !== '') {
            $query->where('date_in', '<=', $request->end_date);
        }

        if ($request->has('item_id') && $request->item_id !== '') {
            $query->where('item_id', $request->item_id);
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
     * Get stock outs with optional date filters.
     */
    public function stockOuts(Request $request)
    {
        $query = StockOut::with(['item:id,code,name,unit,category', 'user:id,name']);

        if ($request->has('start_date') && $request->start_date !== '') {
            $query->where('date_out', '>=', $request->start_date);
        }

        if ($request->has('end_date') && $request->end_date !== '') {
            $query->where('date_out', '<=', $request->end_date);
        }

        if ($request->has('item_id') && $request->item_id !== '') {
            $query->where('item_id', $request->item_id);
        }

        $stockOuts = $query->orderBy('date_out', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $stockOuts,
        ], 200);
    }
}
