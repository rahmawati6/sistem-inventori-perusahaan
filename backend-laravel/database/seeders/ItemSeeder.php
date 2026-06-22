<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Item;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            ['code' => 'BES-004', 'name' => 'Aluminium Profile', 'category' => 'Besi', 'unit' => 'batang', 'stock' => 60, 'minimum_stock' => 20],
            ['code' => 'AKS-002', 'name' => 'Amplas', 'category' => 'Aksesoris', 'unit' => 'lembar', 'stock' => 500, 'minimum_stock' => 150],
            ['code' => 'BES-001', 'name' => 'Besi Hollow 4x4', 'category' => 'Besi', 'unit' => 'batang', 'stock' => 110, 'minimum_stock' => 30],
            ['code' => 'UPH-001', 'name' => 'Busa Sofa', 'category' => 'Upholstery', 'unit' => 'lembar', 'stock' => 37, 'minimum_stock' => 12],
            ['code' => 'KYU-001', 'name' => 'Kayu Jati', 'category' => 'Kayu', 'unit' => 'batang', 'stock' => 80, 'minimum_stock' => 25],
            ['code' => 'KYU-002', 'name' => 'Multiplex 18mm', 'category' => 'Kayu', 'unit' => 'lembar', 'stock' => 45, 'minimum_stock' => 15],
            ['code' => 'HDW-001', 'name' => 'Sekrup 5cm', 'category' => 'Hardware', 'unit' => 'box', 'stock' => 200, 'minimum_stock' => 50],
            ['code' => 'HDW-002', 'name' => 'Engsel Pintu', 'category' => 'Hardware', 'unit' => 'pasang', 'stock' => 150, 'minimum_stock' => 40],
            ['code' => 'HDW-003', 'name' => 'Handle Pintu', 'category' => 'Hardware', 'unit' => 'buah', 'stock' => 120, 'minimum_stock' => 30],
            ['code' => 'FIN-001', 'name' => 'Cat Kayu', 'category' => 'Finishing', 'unit' => 'kaleng', 'stock' => 35, 'minimum_stock' => 10],
            ['code' => 'FIN-002', 'name' => 'Vernis', 'category' => 'Finishing', 'unit' => 'kaleng', 'stock' => 40, 'minimum_stock' => 12],
            ['code' => 'FIN-003', 'name' => 'Thinner', 'category' => 'Finishing', 'unit' => 'liter', 'stock' => 60, 'minimum_stock' => 20],
            ['code' => 'AKS-001', 'name' => 'Lem Kayu', 'category' => 'Aksesoris', 'unit' => 'kg', 'stock' => 25, 'minimum_stock' => 8],
            ['code' => 'AKS-003', 'name' => 'Rotan', 'category' => 'Aksesoris', 'unit' => 'batang', 'stock' => 0, 'minimum_stock' => 15],
            ['code' => 'UPH-002', 'name' => 'Kain Sofa', 'category' => 'Upholstery', 'unit' => 'meter', 'stock' => 90, 'minimum_stock' => 30],
            ['code' => 'UPH-003', 'name' => 'Kulit Sintetis', 'category' => 'Upholstery', 'unit' => 'meter', 'stock' => 45, 'minimum_stock' => 15],
            ['code' => 'HDW-004', 'name' => 'Paku 7cm', 'category' => 'Hardware', 'unit' => 'box', 'stock' => 180, 'minimum_stock' => 50],
            ['code' => 'HDW-005', 'name' => 'Baut M8', 'category' => 'Hardware', 'unit' => 'box', 'stock' => 160, 'minimum_stock' => 40],
            ['code' => 'BES-002', 'name' => 'Besi Siku 4x4', 'category' => 'Besi', 'unit' => 'batang', 'stock' => 75, 'minimum_stock' => 20],
            ['code' => 'BES-003', 'name' => 'Plat Besi 2mm', 'category' => 'Besi', 'unit' => 'lembar', 'stock' => 50, 'minimum_stock' => 15],
            ['code' => 'KYU-003', 'name' => 'MDF 12mm', 'category' => 'Kayu', 'unit' => 'lembar', 'stock' => 55, 'minimum_stock' => 18],
            ['code' => 'FIN-004', 'name' => 'Dempul Kayu', 'category' => 'Finishing', 'unit' => 'kg', 'stock' => 30, 'minimum_stock' => 10],
            ['code' => 'HDW-006', 'name' => 'Kunci Drawer', 'category' => 'Hardware', 'unit' => 'buah', 'stock' => 90, 'minimum_stock' => 25],
        ];

        foreach ($items as $item) {
            Item::create($item);
        }
    }
}
