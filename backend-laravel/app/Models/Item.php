<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'code',
        'name',
        'category',
        'unit',
        'stock',
        'minimum_stock',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'stock' => 'integer',
        'minimum_stock' => 'integer',
    ];

    /**
     * Get all stock in entries for this item.
     */
    public function stockIns()
    {
        return $this->hasMany(StockIn::class);
    }

    /**
     * Get all stock out entries for this item.
     */
    public function stockOuts()
    {
        return $this->hasMany(StockOut::class);
    }
}
