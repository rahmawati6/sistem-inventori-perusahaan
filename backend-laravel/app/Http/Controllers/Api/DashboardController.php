<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Item;
use App\Models\StockIn;
use App\Models\StockOut;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard summary data.
     */
    public function index()
    {
        // Basic counts
        $totalItems = Item::count();
        $totalStock = Item::sum('stock');
        $totalStockIn = StockIn::sum('quantity');
        $totalStockOut = StockOut::sum('quantity');
        $lowStockCount = Item::whereColumn('stock', '<=', 'minimum_stock')->count();

        // Monthly stock in/out for the last 6 months
        $sixMonthsAgo = Carbon::now()->subMonths(5)->startOfMonth();

        $monthlyStockIn = StockIn::select(
                DB::raw("DATE_FORMAT(date_in, '%Y-%m') as month"),
                DB::raw('SUM(quantity) as total')
            )
            ->where('date_in', '>=', $sixMonthsAgo)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $monthlyStockOut = StockOut::select(
                DB::raw("DATE_FORMAT(date_out, '%Y-%m') as month"),
                DB::raw('SUM(quantity) as total')
            )
            ->where('date_out', '>=', $sixMonthsAgo)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Generate all 6 month labels
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $months[] = $date->format('Y-m');
        }

        $monthLabels = array_map(function ($m) {
            return Carbon::createFromFormat('Y-m', $m)->translatedFormat('M Y');
        }, $months);

        // Map data to months
        $stockInMap = $monthlyStockIn->pluck('total', 'month')->toArray();
        $stockOutMap = $monthlyStockOut->pluck('total', 'month')->toArray();

        $monthlyStockInData = array_map(function ($m) use ($stockInMap) {
            return (int) ($stockInMap[$m] ?? 0);
        }, $months);

        $monthlyStockOutData = array_map(function ($m) use ($stockOutMap) {
            return (int) ($stockOutMap[$m] ?? 0);
        }, $months);

        // Stock by category
        $stockByCategory = Item::select('category', DB::raw('SUM(stock) as total_stock'))
            ->groupBy('category')
            ->orderBy('category')
            ->get()
            ->map(function ($item) {
                return [
                    'category' => $item->category,
                    'total_stock' => (int) $item->total_stock,
                ];
            });

        // Recent transactions
        $recentStockIn = StockIn::with('item:id,code,name,unit')
            ->orderBy('date_in', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $recentStockOut = StockOut::with('item:id,code,name,unit')
            ->orderBy('date_out', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total_items' => $totalItems,
                'total_stock' => (int) $totalStock,
                'total_stock_in' => (int) $totalStockIn,
                'total_stock_out' => (int) $totalStockOut,
                'low_stock_count' => $lowStockCount,
                'monthly_stock_in' => [
                    'labels' => $monthLabels,
                    'data' => $monthlyStockInData,
                ],
                'monthly_stock_out' => [
                    'labels' => $monthLabels,
                    'data' => $monthlyStockOutData,
                ],
                'stock_by_category' => $stockByCategory,
                'recent_stock_in' => $recentStockIn,
                'recent_stock_out' => $recentStockOut,
            ],
        ], 200);
    }
}
