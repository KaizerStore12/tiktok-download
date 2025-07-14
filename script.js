import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function startLookup() {
  const target = document.getElementById("inputTarget").value.trim();
  const output = document.getElementById("output");
  if (!target) return output.innerText = "Masukkan target terlebih dahulu.";

  output.innerText = "> Melacak target...\n";

  let jenis = "unknown";
  if (/^\d+\.\d+\.\d+\.\d+$/.test(target)) jenis = "ip";
  else if (/^\d{10,13}$/.test(target)) jenis = "nomor";
  else if (/^[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(target)) jenis = "domain";
  else jenis = "username";

  push(ref(db, "logs"), {
    target,
    jenis,
    waktu: new Date().toISOString()
  });

  if (jenis === "ip") {
    fetch(`https://ipwho.is/${target}`)
      .then(res => res.json())
      .then(data => {
        output.innerText += `> IP: ${data.ip}\n> Negara: ${data.country}\n> Kota: ${data.city}\n> ISP: ${data.connection?.isp || '-'}\n`;
      });
  }

  else if (jenis === "domain") {
    fetch(`https://api.api-ninjas.com/v1/whois?domain=${target}`, {
      headers: { 'X-Api-Key': 'QRXZJc1caVVmCbpaLczAuA==bHWG5U5XEzy1Fkao' }
    })
      .then(res => res.json())
      .then(data => {
        output.innerText += `> Registrar: ${data.registrar_name}\n> Created: ${data.creation_date}\n> Expired: ${data.expiration_date}\n`;
      });
  }

  else if (jenis === "username") {
    fetch(`https://api.github.com/users/${target}`)
      .then(res => res.json())
      .then(data => {
        if (data.login) {
          output.innerText += `> GitHub: ✅ Ditemukan\n> Nama: ${data.name || '-'}\n> Bio: ${data.bio || '-'}\n`;
        } else {
          output.innerText += `> GitHub: ❌ Tidak ditemukan\n`;
        }
      });
  }

  else if (jenis === "nomor") {
    fetch(`http://apilayer.net/api/validate?access_key=534a161c80671bada8cd2158bf6723a0&number=${target}&format=1`)
      .then(res => res.json())
      .then(data => {
        output.innerText += `> Negara: ${data.country_name}\n> Operator: ${data.carrier}\n> Valid: ${data.valid ? '✅ Ya' : '❌ Tidak'}\n`;
      });
  }
}

window.startLookup = startLookup;
