const db = firebase.database();

function startLookup() {
  const target = document.getElementById("inputTarget").value.trim();
  const output = document.getElementById("output");

  if (!target) return output.innerText = "Masukkan target terlebih dahulu.";

  output.innerText = "> Melacak target...\n";

  // Tentukan jenis data (IP, domain, username, nomor)
  let jenis = "unknown";
  if (/^\d+\.\d+\.\d+\.\d+$/.test(target)) jenis = "ip";
  else if (/^\d{10,13}$/.test(target)) jenis = "nomor";
  else if (/^[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,}$/.test(target)) jenis = "domain";
  else jenis = "username";

  // Simpan ke Firebase log
  db.ref("logs").push({
    target,
    jenis,
    waktu: new Date().toISOString(),
    ipClient: null // nanti bisa pakai IP public via fetch
  });

  // Lanjutkan fetch data sesuai jenis
  if (jenis === "ip") {
    fetch(`https://ipwho.is/${target}`)
      .then(res => res.json())
      .then(data => {
        output.innerText += `> IP: ${data.ip}\n> Negara: ${data.country}\n> Kota: ${data.city}\n> ISP: ${data.connection?.isp || '-'}\n`;
      });
  } else {
    output.innerText += `> Fitur untuk ${jenis} belum tersedia sepenuhnya.\n`;
  }
}
