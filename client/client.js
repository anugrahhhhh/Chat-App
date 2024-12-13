const net = require('net');
const readline = require('readline');

// Konfigurasi koneksi
const HOST = '127.0.0.1';
const PORT = 3000;

// Membuat antarmuka input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Membuat koneksi ke server
const client = net.createConnection({ host: HOST, port: PORT }, () => {
    console.log(`Terhubung ke server di ${HOST}:${PORT}`);
    console.log('Ketik pesan Anda atau "exit" untuk keluar.');
    rl.prompt();
});

// Event: Menerima data dari server
client.on('data', (data) => {
    console.log(`\nPesan dari server: ${data.toString().trim()}`);
    rl.prompt();
});

// Event: Menangani input dari pengguna
rl.on('line', (line) => {
    if (line.trim().toLowerCase() === 'exit') {
        client.end(); // Tutup koneksi
    } else {
        client.write(line.trim()); // Kirim pesan ke server
    }
    rl.prompt();
});

// Event: Koneksi terputus
client.on('end', () => {
    console.log('Koneksi ke server terputus.');
    rl.close();
});

// Event: Menangani kesalahan
client.on('error', (err) => {
    console.error(`Kesalahan: ${err.message}`);
    rl.close();
});
