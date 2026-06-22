<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StockIn;

class StockInSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stockIns = [
            // Januari 2026
            [
                'item_id' => 3,  // Besi Hollow 4x4
                'date_in' => '2026-01-08',
                'quantity' => 50,
                'supplier' => 'PT Baja Makmur',
                'notes' => 'Pembelian rutin awal tahun',
                'user_id' => 1,
            ],
            [
                'item_id' => 5,  // Kayu Jati
                'date_in' => '2026-01-15',
                'quantity' => 30,
                'supplier' => 'CV Kayu Sejahtera',
                'notes' => 'Stok kayu jati grade A',
                'user_id' => 1,
            ],
            [
                'item_id' => 7,  // Sekrup 5cm
                'date_in' => '2026-01-22',
                'quantity' => 100,
                'supplier' => 'PT Hardware Indonesia',
                'notes' => 'Restock sekrup ukuran 5cm',
                'user_id' => 1,
            ],

            // Februari 2026
            [
                'item_id' => 4,  // Busa Sofa
                'date_in' => '2026-02-05',
                'quantity' => 20,
                'supplier' => 'PT Foamindo Jaya',
                'notes' => 'Busa densitas tinggi',
                'user_id' => 1,
            ],
            [
                'item_id' => 15, // Kain Sofa
                'date_in' => '2026-02-12',
                'quantity' => 40,
                'supplier' => 'CV Tekstil Interior',
                'notes' => 'Kain sofa warna netral',
                'user_id' => 1,
            ],
            [
                'item_id' => 10, // Cat Kayu
                'date_in' => '2026-02-20',
                'quantity' => 15,
                'supplier' => 'PT Finishing Warna Abadi',
                'notes' => 'Warna natural dan walnut',
                'user_id' => 1,
            ],

            // Maret 2026
            [
                'item_id' => 19, // Besi Siku 4x4
                'date_in' => '2026-03-03',
                'quantity' => 35,
                'supplier' => 'PT Baja Makmur',
                'notes' => 'Pembelian untuk proyek meja',
                'user_id' => 1,
            ],
            [
                'item_id' => 6,  // Multiplex 18mm
                'date_in' => '2026-03-10',
                'quantity' => 25,
                'supplier' => 'CV Kayu Sejahtera',
                'notes' => 'Pembelian multiplex untuk lemari',
                'user_id' => 1,
            ],
            [
                'item_id' => 8,  // Engsel Pintu
                'date_in' => '2026-03-18',
                'quantity' => 60,
                'supplier' => 'PT Hardware Indonesia',
                'notes' => 'Engsel stainless steel',
                'user_id' => 1,
            ],

            // April 2026
            [
                'item_id' => 1,  // Aluminium Profile
                'date_in' => '2026-04-02',
                'quantity' => 30,
                'supplier' => 'PT Baja Makmur',
                'notes' => 'Profil aluminium untuk rangka',
                'user_id' => 1,
            ],
            [
                'item_id' => 14, // Rotan
                'date_in' => '2026-04-08',
                'quantity' => 40,
                'supplier' => 'UD Rotan Sejahtera',
                'notes' => 'Rotan kualitas ekspor',
                'user_id' => 1,
            ],
            [
                'item_id' => 12, // Thinner
                'date_in' => '2026-04-15',
                'quantity' => 25,
                'supplier' => 'PT Finishing Warna Abadi',
                'notes' => 'Thinner untuk campuran cat kayu',
                'user_id' => 1,
            ],
            [
                'item_id' => 17, // Paku 7cm
                'date_in' => '2026-04-22',
                'quantity' => 80,
                'supplier' => 'PT Hardware Indonesia',
                'notes' => 'Paku galvanis anti karat',
                'user_id' => 1,
            ],

            // Mei 2026
            [
                'item_id' => 16, // Kulit Sintetis
                'date_in' => '2026-05-05',
                'quantity' => 30,
                'supplier' => 'CV Tekstil Interior',
                'notes' => 'Kulit sintetis premium',
                'user_id' => 1,
            ],
            [
                'item_id' => 21, // MDF 12mm
                'date_in' => '2026-05-12',
                'quantity' => 20,
                'supplier' => 'CV Kayu Sejahtera',
                'notes' => 'MDF kualitas standar',
                'user_id' => 1,
            ],
            [
                'item_id' => 20, // Plat Besi 2mm
                'date_in' => '2026-05-19',
                'quantity' => 25,
                'supplier' => 'PT Baja Makmur',
                'notes' => 'Plat besi untuk meja kerja',
                'user_id' => 1,
            ],
            [
                'item_id' => 9,  // Handle Pintu
                'date_in' => '2026-05-26',
                'quantity' => 50,
                'supplier' => 'PT Hardware Indonesia',
                'notes' => 'Handle model minimalis',
                'user_id' => 1,
            ],

            // Juni 2026
            [
                'item_id' => 2,  // Amplas
                'date_in' => '2026-06-02',
                'quantity' => 200,
                'supplier' => 'PT Hardware Indonesia',
                'notes' => 'Amplas grit 120 dan 240',
                'user_id' => 1,
            ],
            [
                'item_id' => 11, // Vernis
                'date_in' => '2026-06-10',
                'quantity' => 20,
                'supplier' => 'PT Finishing Warna Abadi',
                'notes' => 'Vernis glossy dan doff',
                'user_id' => 1,
            ],
            [
                'item_id' => 22, // Dempul Kayu
                'date_in' => '2026-06-16',
                'quantity' => 15,
                'supplier' => 'PT Finishing Warna Abadi',
                'notes' => 'Dempul untuk menutup pori kayu',
                'user_id' => 1,
            ],
        ];

        foreach ($stockIns as $stockIn) {
            StockIn::create($stockIn);
        }
    }
}
