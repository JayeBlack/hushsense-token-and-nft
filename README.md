# HushSense Token

A Hedera-based fungible token project powering the **HushSense ecosystem**. The repository provides SDK scripts to create and manage the HUSH HTS token and its NFT collection.

🔗 Live Assets on Hedera Mainnet
- HTS Fungible Token (HUSH): [0.0.10048362](https://hashscan.io/mainnet/token/0.0.10048362)  
- Manager Smart Contract: [0.0.10047928](https://hashscan.io/mainnet/contract/0.0.10047928)  
- HTS NFT Collection: [0.0.10050668](https://hashscan.io/mainnet/token/0.0.10050668)

## 📌 Features  
- Fungible token creation (`HUSH`) on Hedera  
- NFT creation and minting support  
- Metadata storage via IPFS (CID-based)  
- Secure environment variable handling  
- Ready for **Hedera mainnet deployment**  

---

## 📂 Project Structure  
hushsense-token/
├── hush-token/
│   └── token.js            # Script to create HushSense fungible token (HTS)
├── hush-nft/
│   ├── nftCreate.js        # Script to create the NFT collection
│   ├── nftMint.js          # Script to mint NFTs
│   └── burnNFT.js          # Script to burn NFT serial(s)
├── .env                    # Environment variables (not committed)
├── package.json            # Project dependencies
└── README.md               # Documentation


---

## ⚙️ Prerequisites  
- **Node.js** v18 or later  
- **npm** or **yarn**  
- Hedera account with sufficient HBAR for fees  
- IPFS CID for metadata  

---

## 📥 Installation  
Clone the repository and install dependencies:  

```bash
git clone https://github.com/your-username/hushsense-token.git
cd hushsense-token
npm install

🔑 Environment Setup

Create a `.env` file in the root directory:

```
MY_ACCOUNT_ID=0.0.xxxxx
MY_PRIVATE_KEY=302e020100300506032b6570...
HEDERA_NETWORK=mainnet
TOKEN_METADATA_CID=your-ipfs-metadata-cid
```

🚀 Usage

1) Create Fungible Token (from the `hush-token` folder)
```bash
node hush-token/token.js
```

2) Create NFT Collection
```bash
node hush-nft/nftCreate.js
```

3) Mint NFT
```bash
node hush-nft/nftMint.js
```

📦 Deployment Notes

Ensure `HEDERA_NETWORK=mainnet` in `.env` before running on mainnet.

Keep enough HBAR in your treasury account for token fees and auto-renewal.

The private key must remain secure and never be committed to source control.
