# HushSense Token  

A Hedera-based fungible token project powering the **HushSense ecosystem**. The project provides scripts for creating the token, minting NFTs, and handling metadata, all deployed securely on the Hedera network.  

---

## 📌 Features  
- Fungible token creation (`HUSH`) on Hedera  
- NFT creation and minting support  
- Metadata storage via IPFS (CID-based)  
- Secure environment variable handling  
- Ready for **Hedera mainnet deployment**  

---

## 📂 Project Structure  
hushsense-token/
├── token.js # Script to create HushSense fungible token
├── nftCreate.js # Script to create NFTs
├── nftMint.js # Script to mint NFTs
├── .env # Environment variables (not committed)
├── package.json # Project dependencies
└── README.md # Documentation


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

Create a .env file in the root directory:

MY_ACCOUNT_ID=0.0.xxxxx
MY_PRIVATE_KEY=302e020100300506032b6570...
HEDERA_NETWORK=mainnet
TOKEN_METADATA_CID=your-ipfs-metadata-cid

🚀 Usage
1️⃣ Create Fungible Token
node token.js

2️⃣ Create NFT
node nftCreate.js

3️⃣ Mint NFT
node nftMint.js

📦 Deployment Notes

Ensure HEDERA_NETWORK=mainnet in .env before mainnet runs

Keep enough HBAR in your treasury account for token fees and auto-renewal

The private key must remain secure and never be committed to source control

🛠️ Scripts Details
token.js

Creates the fungible HUSH token with configurable supply and metadata.

nftCreate.js

Creates a non-fungible token (NFT) under the HushSense ecosystem.

nftMint.js

Mints NFTs linked to IPFS metadata.

📜 License

This project is licensed under the Apache License 2.0.

Copyright 2025 HushSense

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
