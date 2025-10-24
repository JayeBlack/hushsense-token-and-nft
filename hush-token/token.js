import {
    Client,
    PrivateKey,
    TokenCreateTransaction,
    TokenType,
    TokenSupplyType,
    Hbar,
    AccountId,
    ContractId, // This import is correct
} from "@hashgraph/sdk";
import dotenv from "dotenv";

dotenv.config();

// Load IDs from .env
const CONTRACT_ID = process.env.HUSHSENSE_MANAGER_CONTRACT_ID;
const ACCOUNT_ID = process.env.MY_ACCOUNT_ID;
const PRIVATE_KEY = process.env.MY_PRIVATE_KEY;
const NETWORK = process.env.HEDERA_NETWORK || "mainnet";

async function main() {
    if (!ACCOUNT_ID || !PRIVATE_KEY || !CONTRACT_ID) {
        throw new Error(
            "Missing critical .env variables. Check MY_ACCOUNT_ID, MY_PRIVATE_KEY, and HUSHSENSE_MANAGER_CONTRACT_ID."
        );
    }

    // Load operator credentials
    const operatorId = AccountId.fromString(ACCOUNT_ID);
    const operatorKey = PrivateKey.fromString(PRIVATE_KEY); // Using MY_PRIVATE_KEY as requested
    const client = NETWORK === "mainnet" ? Client.forMainnet() : Client.forTestnet();
    
    client.setOperator(operatorId, operatorKey);
    client.setDefaultMaxTransactionFee(new Hbar(5));

    console.log(`🚀 Creating HushSense HTS Token on ${NETWORK}...`);
    console.log(`Setting Supply Key to Contract: ${CONTRACT_ID}`);

    // Load metadata (optional)
    const metadataCID = process.env.TOKEN_METADATA_CID;

    const tx = await new TokenCreateTransaction()
        .setTokenName("HushSense")
        .setTokenSymbol("HUSH")
        .setTokenType(TokenType.FungibleCommon)
        .setDecimals(0)
        .setInitialSupply(10_000_000) // 10 Million
        .setMaxSupply(50_000_000_000) // 50 Billion
        .setSupplyType(TokenSupplyType.Finite)
        .setTreasuryAccountId(operatorId) // account holds the initial supply
        .setAutoRenewAccountId(operatorId)
        .setAutoRenewPeriod(7890000) // ~91 days
        .setMaxTransactionFee(new Hbar(10)) 

        //account is the Admin (can delete token, update keys)
        .setAdminKey(operatorKey.publicKey)
        
        // The CONTRACT controls minting/burning
        .setSupplyKey(ContractId.fromString(CONTRACT_ID)) 
        
        .setPauseKey(ContractId.fromString(CONTRACT_ID)) 

        .setFreezeKey(null)
        .setWipeKey(null)
        .setKycKey(null);

    if (metadataCID) {
        tx.setMetadata(Buffer.from(metadataCID));
    }
        
    const frozenTx = await tx.freezeWith(client).sign(operatorKey);
    const submitTx = await frozenTx.execute(client);
    const receipt = await submitTx.getReceipt(client);
    const tokenId = receipt.tokenId;

    console.log("✅ HTS Token created successfully!");
    console.log("🆔 Token ID:", tokenId.toString());
    console.log("🆔 Token Solidity Address:", tokenId.toSolidityAddress());
    console.log("🔐 Admin Key: Your operator key.");
    console.log("Supply & Pause Key: Contract " + CONTRACT_ID);
}

main().catch(err => {
    console.error("❌ Error:", err.message);
});