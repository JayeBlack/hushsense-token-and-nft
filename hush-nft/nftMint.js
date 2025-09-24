// nft.js - Mint HushSense NFT
import "dotenv/config";
import {
  Client,
  PrivateKey,
  AccountId,
  TokenMintTransaction,
} from "@hashgraph/sdk";

// 🌍 Load from .env
const {
  HEDERA_NETWORK,
  MY_ACCOUNT_ID,
  MY_PRIVATE_KEY,
  HUSHSENSE_NFT_ID,
  NFT_METADATA_CID,
} = process.env;

async function main() {
  if (!MY_ACCOUNT_ID || !MY_PRIVATE_KEY) {
    throw new Error("❌ Please set MY_ACCOUNT_ID and MY_PRIVATE_KEY in .env");
  }
  if (!HUSHSENSE_NFT_ID) {
    throw new Error("❌ Please set HUSHSENSE_NFT_ID in .env");
  }
  if (!NFT_METADATA_CID) {
    throw new Error("❌ Please set NFT_METADATA_CID in .env");
  }

  // ✅ Client setup
  const client = Client.forName(HEDERA_NETWORK);
  client.setOperator(
    AccountId.fromString(MY_ACCOUNT_ID),
    PrivateKey.fromString(MY_PRIVATE_KEY)
  );

  console.log(`\n🚀 Minting NFT on ${HEDERA_NETWORK}...`);
  console.log(`📦 NFT Collection ID: ${HUSHSENSE_NFT_ID}`);
  console.log(`📝 Metadata CID: ${NFT_METADATA_CID}`);

  // 🔗 Mint NFT
  const mintTx = await new TokenMintTransaction()
    .setTokenId(HUSHSENSE_NFT_ID)
    .setMetadata([Buffer.from(NFT_METADATA_CID)]) // IPFS CID as metadata
    .freezeWith(client)
    .sign(PrivateKey.fromString(MY_PRIVATE_KEY));

  const mintSubmit = await mintTx.execute(client);
  const mintReceipt = await mintSubmit.getReceipt(client);

  console.log(`✅ NFT Minted! Serial Number: ${mintReceipt.serials[0].low}`);
  console.log(
    `🔗 View on HashScan: https://hashscan.io/${HEDERA_NETWORK}/token/${HUSHSENSE_NFT_ID}`
  );

  await client.close();
}

main().catch((err) => {
  console.error("❌ Error minting NFT:", err);
});
