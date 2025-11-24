if (typeof window.ethereum !== "undefined") {
  console.log("MetaMask Terdeteksi");
} else {
  alert("MetaMask belum terpasang!");
}

// Inisialisasi Web3
const web3 = new Web3(window.ethereum);
let contract;
let contractABI = [];
let contractAddress = "";

// === Load ABI & Address dari file JSON ===
async function loadContractJSON() {
  try {
    const res = await fetch("./build/contracts/MessageBoard.json"); // sesuaikan path
    const artifact = await res.json();

    // Ambil ABI
    contractABI = artifact.abi;

    // Ambil network ID dari MetaMask
    const networkId = await web3.eth.net.getId();

    // Pastikan JSON memiliki data untuk network tersebut
    if (!artifact.networks[networkId]) {
      alert(`Kontrak tidak ditemukan di network ID ${networkId}`);
      return;
    }

    // Ambil alamat kontrak sesuai network
    contractAddress = artifact.networks[networkId].address;

    // Buat instance kontrak
    contract = new web3.eth.Contract(contractABI, contractAddress);
    console.log("Contract Loaded:", contractAddress);

    // Setelah kontrak siap → muat pesan awal
    loadMessage();
  } catch (err) {
    console.error("Gagal memuat JSON kontrak:", err);
  }
}

// Panggil fungsi untuk memuat JSON kontrak
loadContractJSON();

// === Ambil akun MetaMask ===
async function loadAccount() {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  return accounts[0];
}

// === Tampilkan pesan dari blockchain ===
async function loadMessage() {
  try {
    const data = await contract.methods.getMessage().call();
    document.getElementById("pesan").innerText = data;
  } catch (err) {
    console.error("Gagal load message:", err);
  }
}

// === Kirim pesan ke blockchain ===
async function kirimPesan() {
  try {
    const akun = await loadAccount();
    const isi = document.getElementById("inputPesan").value;
    await contract.methods.setMessage(isi).send({ from: akun });
    loadMessage(); // refresh tampilan pesan
  } catch (err) {
    console.error("Error mengirim pesan:", err);
  }
}
