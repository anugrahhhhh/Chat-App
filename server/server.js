const net = require('net');
const fs = require('fs');
const path = require('path');

// Konfigurasi server
const PORT = 3000;
const LOG_FILE = path.join(__dirname, '../logs/server.log');

// Menyimpan koneksi klien
let clients = [];

// Fungsi untuk menulis log ke file
const logToFile = (message) => {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
};

// Fungsi untuk broadcast pesan ke semua klien kecuali pengirim
const broadcastMessage = (message, senderSocket) => {
    clients.forEach((client) => {
        if (client !== senderSocket) {
            client.write(message);
        }
    });
};

// Membuat server
const server = net.createServer((socket) => {
    const clientInfo = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`Klien terhubung: ${clientInfo}`);
    logToFile(`Klien terhubung: ${clientInfo}`);

    // Tambahkan klien baru ke array
    clients.push(socket);

    // Event: Data diterima dari klien
    socket.on('data', (data) => {
        const message = data.toString().trim();
        if (message) {
            console.log(`Pesan diterima dari ${clientInfo}: ${message}`);
            logToFile(`Pesan diterima dari ${clientInfo}: ${message}`);

            // Broadcast pesan ke klien lain
            broadcastMessage(`[${clientInfo}]: ${message}\n`, socket);
        } else {
            console.warn(`Pesan kosong diterima dari ${clientInfo}`);
            logToFile(`Pesan kosong diterima dari ${clientInfo}`);
        }
    });

    // Event: Koneksi klien terputus
    socket.on('end', () => {
        console.log(`Klien terputus: ${clientInfo}`);
        logToFile(`Klien terputus: ${clientInfo}`);
        clients = clients.filter((client) => client !== socket);
    });

    // Event: Kesalahan koneksi
    socket.on('error', (err) => {
        console.error(`Kesalahan dari ${clientInfo}: ${err.message}`);
        logToFile(`Kesalahan dari ${clientInfo}: ${err.message}`);
    });
});

// Menangani kesalahan server global
server.on('error', (err) => {
    console.error(`Kesalahan server: ${err.message}`);
    logToFile(`Kesalahan server: ${err.message}`);
});

// Jalankan server
server.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
    logToFile(`Server berjalan di port ${PORT}`);
});
