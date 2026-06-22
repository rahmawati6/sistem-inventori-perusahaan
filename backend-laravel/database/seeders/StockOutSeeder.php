<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StockOut;

class StockOutSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stockOuts = [
            // Januari 2026
            [
                'item_id' => 3,  // Besi Hollow 4x4
                'date_out' => '2026-01-12',
                'quantity' => 20,
                'destination' => 'Produksi meja kantor',
                'notes' => 'Batch produksi MK-001',
                'user_id' => 1,
            ],
            [
                'item_id' => 7,  // Sekrup 5cm
                'date_out' => '2026-01-25',
                'quantity' => 30,
                'destination' => 'Produksi lemari',
                'notes' => 'Keperluan perakitan lemari pintu 3',
                'user_id' => 1,
            ],

            // Februari 2026
            [
                'item_id' => 5,  // Kayu Jati
                'date_out' => '2026-02-07',
                'quantity' => 15,
                'destination' => 'Produksi meja kantor',
                'notes' => 'Kayu jati untuk top table',
                'user_id' => 1,
            ],
            [
                'item_id' => 4,  // Busa Sofa
                'date_out' => '2026-02-14',
                'quantity' => 10,
                'destination' => 'Produksi sofa premium',
                'notes' => 'Busa untuk sandaran sofa',
                'user_id' => 1,
            ],
            [
                'item_id' => 8,  // Engsel Pintu
                'date_out' => '2026-02-22',
                'quantity' => 25,
                'destination' => 'Produksi lemari',
                'notes' => 'Lemari arsip kantor',
                'user_id' => 1,
            ],

            // Maret 2026
            [
                'item_id' => 6,  // Multiplex 18mm
                'date_out' => '2026-03-05',
                'quantity' => 12,
                'destination' => 'Produksi lemari',
                'notes' => 'Bahan dasar bodi lemari pakaian',
                'user_id' => 1,
            ],
            [
                'item_id' => 10, // Cat Kayu
                'date_out' => '2026-03-12',
                'quantity' => 8,
                'destination' => 'Proyek interior',
                'notes' => 'Interior kantor lantai 3',
                'user_id' => 1,
            ],
            [
                'item_id' => 15, // Kain Sofa
                'date_out' => '2026-03-20',
                'quantity' => 18,
                'destination' => 'Produksi sofa premium',
                'notes' => 'Sofa set ruang tamu',
                'user_id' => 1,
            ],

            // April 2026
            [
                'item_id' => 19, // Besi Siku 4x4
                'date_out' => '2026-04-03',
                'quantity' => 15,
                'destination' => 'Produksi meja kantor',
                'notes' => 'Rangka kaki meja kantor',
                'user_id' => 1,
            ],
            [
                'item_id' => 17, // Paku 7cm
                'date_out' => '2026-04-10',
                'quantity' => 40,
                'destination' => 'Produksi lemari',
                'notes' => 'Lemari pakaian custom',
                'user_id' => 1,
            ],
            [
                'item_id' => 12, // Thinner
                'date_out' => '2026-04-18',
                'quantity' => 15,
                'destination' => 'Proyek interior',
                'notes' => 'Campuran cat untuk backdrop',
                'user_id' => 1,
            ],
            [
                'item_id' => 1,  // Aluminium Profile
                'date_out' => '2026-04-25',
                'quantity' => 12,
                'destination' => 'Perawatan gedung',
                'notes' => 'Perbaikan partisi kantor',
                'user_id' => 1,
            ],

            // Mei 2026
            [
                'item_id' => 9,  // Handle Pintu
                'date_out' => '2026-05-06',
                'quantity' => 20,
                'destination' => 'Produksi lemari',
                'notes' => 'Aksesoris pintu lemari pakaian',
                'user_id' => 1,
            ],
            [
                'item_id' => 21, // MDF 12mm
                'date_out' => '2026-05-14',
                'quantity' => 10,
                'destination' => 'Proyek interior',
                'notes' => 'Backdrop ruang meeting',
                'user_id' => 1,
            ],
            [
                'item_id' => 16, // Kulit Sintetis
                'date_out' => '2026-05-22',
                'quantity' => 12,
                'destination' => 'Produksi sofa premium',
                'notes' => 'Sofa kulit untuk lobby',
                'user_id' => 1,
            ],

            // Juni 2026
            [
                'item_id' => 2,  // Amplas
                'date_out' => '2026-06-04',
                'quantity' => 80,
                'destination' => 'Produksi meja kantor',
                'notes' => 'Finishing meja batch Juni',
                'user_id' => 1,
            ],
            [
                'item_id' => 20, // Plat Besi 2mm
                'date_out' => '2026-06-12',
                'quantity' => 10,
                'destination' => 'Perawatan gedung',
                'notes' => 'Perbaikan fasilitas ruang tunggu',
                'user_id' => 1,
            ],
            [
                'item_id' => 11, // Vernis
                'date_out' => '2026-06-18',
                'quantity' => 10,
                'destination' => 'Proyek interior',
                'notes' => 'Finishing proyek interior hotel',
                'user_id' => 1,
            ],
        ];

        foreach ($stockOuts as $stockOut) {
            StockOut::create($stockOut);
        }
    }
}
