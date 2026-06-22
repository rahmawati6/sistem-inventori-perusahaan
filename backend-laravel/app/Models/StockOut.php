<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockOut extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'stock_outs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'item_id',
        'date_out',
        'quantity',
        'destination',
        'notes',
        'user_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_out' => 'date',
        'quantity' => 'integer',
    ];

    /**
     * Get the item associated with this stock out.
     */
    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    /**
     * Get the user who created this stock out.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
