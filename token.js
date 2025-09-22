import {
    Client,
    PrivateKey,
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
    Hbar,
    AccountId,
} from "@hashgraph/sdk";
import dotenv from "dotenv";

dotenv.config();

async function main() {
    // Load operator credentials
    const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
    const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

    // Connect to Hedera Testnet
    const client = Client.forTestnet().setOperator(operatorId, operatorKey);

    console.log("🚀 Creating HushSense Token...");

    // Load metadata from .env
    const metadataCID = process.env.TOKEN_METADATA_CID;

    // Create fungible token
    const tx = await new TokenCreateTransaction()
        .setTokenName("HushSense")
        .setTokenSymbol("HUSH")
        .setTokenType(TokenType.FungibleCommon)
        .setDecimals(0)
        .setInitialSupply(10000000)
        .setMaxSupply(50000000000)
        .setTreasuryAccountId(operatorId)
        .setAdminKey(operatorKey.publicKey)
        .setSupplyKey(operatorKey.publicKey)
        .setWipeKey(operatorKey.publicKey)
        .setPauseKey(operatorKey.publicKey)
        .setFreezeKey(operatorKey.publicKey)
        .setSupplyType(TokenSupplyType.Finite)
        .setMetadata(Buffer.from(metadataCID))
        .setAutoRenewAccountId(operatorId)
        .setAutoRenewPeriod(7890000) // ~91 days
        .setMaxTransactionFee(new Hbar(30))
        .freezeWith(client)
        .sign(operatorKey);

    const submitTx = await tx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    const tokenId = receipt.tokenId;

    console.log("✅ Token created successfully!");
    console.log("🆔 Token ID:", tokenId.toString());
    console.log("📦 Metadata CID:", metadataCID);
    console.log("🔑 Admin key set. Token can be updated/deleted in the future.");
    console.log("⏳ Auto-renew set to treasury account. Keep HBAR there to avoid expiry.");
}

main().catch(err => {
    console.error("❌ Error:", err);
});
