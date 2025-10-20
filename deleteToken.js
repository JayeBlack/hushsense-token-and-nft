// delete-token.js
import {
    Client,
    PrivateKey,
    TokenDeleteTransaction,
    AccountId,
    Hbar,
} from "@hashgraph/sdk";
import dotenv from "dotenv";

dotenv.config();

console.log("Loaded Account ID:", process.env.MY_ACCOUNT_ID);
console.log("Loaded Private Key:", process.env.MY_PRIVATE_KEY);
async function main() {
    // --- START: CRITICAL ---
    // PASTE YOUR TOKEN ID HERE
    // You can get this from your token.js output or a block explorer
    const TOKEN_ID_TO_DELETE = "0.0.9974467"; 
    // --- END: CRITICAL ---

   

    // Load operator credentials
    const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
    const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
    const network = process.env.HEDERA_NETWORK || "mainnet"; // Ensure this is 'mainnet'

    if (network !== "mainnet") {
        console.warn(`\n⚠️ WARNING: You are configured to run on ${network}, not mainnet.\n`);
    }

    // Connect to Hedera
    const client = network === "mainnet" ? Client.forMainnet() : Client.forTestnet();
    client.setOperator(operatorId, operatorKey);

    console.log(`🚀 Attempting to delete token ${TOKEN_ID_TO_DELETE} on ${network}...`);

    // Create the token delete transaction
    // This must be signed by the token's Admin Key (which is your operatorKey)
    const tx = await new TokenDeleteTransaction()
        .setTokenId(TOKEN_ID_TO_DELETE)
        .freezeWith(client)
        .sign(operatorKey); // Explicitly sign with the Admin Key

    const submitTx = await tx.execute(client);
    const receipt = await submitTx.getReceipt(client);

    console.log("✅ Token deleted successfully!");
    console.log("Transaction Status:", receipt.status.toString());

    
}

main().catch(err => {
    console.error("❌ Error:", err.message);
});