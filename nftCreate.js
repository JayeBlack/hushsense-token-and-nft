// createNFTCollection.js - Create HushSense NFT Collection
import dotenv from "dotenv";
import {
  Client,
  PrivateKey,
  AccountId,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
} from "@hashgraph/sdk";

dotenv.config();

// 🌍 Load from .env
const {
  HEDERA_NETWORK,
  MY_ACCOUNT_ID,
  MY_PRIVATE_KEY,
} = process.env;

async function main() {
  if (!MY_ACCOUNT_ID || !MY_PRIVATE_KEY) {
    throw new Error("❌ Please set MY_ACCOUNT_ID and MY_PRIVATE_KEY in .env");
  }

  // ✅ Setup client
  const client = Client.forName(HEDERA_NETWORK);
  const operatorId = AccountId.fromString(MY_ACCOUNT_ID);
  const operatorKey = PrivateKey.fromString(MY_PRIVATE_KEY);
  client.setOperator(operatorId, operatorKey);

  console.log(`\n🚀 Creating NFT Collection on ${HEDERA_NETWORK}...`);

  // 🎨 Create the NFT Collection
  const tx = await new TokenCreateTransaction()
    .setTokenName("testNFT_Collection1")
    .setTokenSymbol("HSNFT")
    .setTokenType(TokenType.NonFungibleUnique)
    .setSupplyType(TokenSupplyType.Infinite) // can mint unlimited NFTs
    .setTreasuryAccountId(operatorId)
    .setAdminKey(operatorKey)   // allows future deletion
    .setSupplyKey(operatorKey)  // allows minting
    .setWipeKey(operatorKey)    // allows wiping if needed
    .setFreezeDefault(false)    // don’t auto-freeze accounts
    .freezeWith(client)
    .sign(operatorKey);

  const submit = await tx.execute(client);
  const receipt = await submit.getReceipt(client);

  const tokenId = receipt.tokenId.toString();
  console.log(`✅ NFT Collection Created! Token ID: ${tokenId}`);
  console.log(`🔗 View on HashScan: https://hashscan.io/${HEDERA_NETWORK}/token/${tokenId}`);
}

main().catch((err) => {
  console.error("❌ Error creating NFT collection:", err);
});
