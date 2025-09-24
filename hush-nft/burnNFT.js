// burnNFT.js
import "dotenv/config";
import {
  Client,
  AccountId,
  PrivateKey,
  TokenId,
  TokenInfoQuery,
  TokenBurnTransaction,
} from "@hashgraph/sdk";

/**
 * Usage:
 *   node burnNFT.js <serial>        e.g. node burnNFT.js 5
 *   node burnNFT.js 1,3,7          e.g. node burnNFT.js 1,3,7
 *   node burnNFT.js latest         auto-fetch highest serial and burn it
 */

async function main() {
  const operatorIdStr = process.env.OPERATOR_ID ?? process.env.MY_ACCOUNT_ID;
  const operatorKeyStr = process.env.OPERATOR_KEY ?? process.env.MY_PRIVATE_KEY;
  const tokenIdStr = process.env.HUSHSENSE_NFT_ID;

  if (!operatorIdStr || !operatorKeyStr) {
    console.error("❌ Missing operator credentials (OPERATOR_ID/OPERATOR_KEY or MY_ACCOUNT_ID/MY_PRIVATE_KEY) in .env");
    process.exit(1);
  }
  if (!tokenIdStr) {
    console.error("❌ Missing HUSHSENSE_NFT_ID in .env");
    process.exit(1);
  }

  const operatorId = AccountId.fromString(operatorIdStr);
  const operatorKey = PrivateKey.fromString(operatorKeyStr);

  const network = (process.env.HEDERA_NETWORK ?? "testnet").toLowerCase();
  const client = network === "mainnet" ? Client.forMainnet() : Client.forTestnet();
  client.setOperator(operatorId, operatorKey);

  const tokenId = TokenId.fromString(tokenIdStr);

  // parse CLI arg
  const arg = process.argv[2];
  if (!arg) {
    console.log("Usage: node burnNFT.js <serial>   (e.g. node burnNFT.js 1  OR  node burnNFT.js 1,2,3 OR node burnNFT.js latest)");
    await client.close?.();
    process.exit(0);
  }

  // get token info and supplyKey presence
  let tokenInfo;
  try {
    tokenInfo = await new TokenInfoQuery().setTokenId(tokenId).execute(client);
  } catch (err) {
    console.error("❌ Failed to fetch token info:", err);
    await client.close?.();
    process.exit(1);
  }

  if (!tokenInfo.supplyKey) {
    console.error("❌ Token has no supply key (immutable). You cannot burn NFTs for this token.");
    await client.close?.();
    process.exit(1);
  }

  // helper to parse comma separated serials
  const parseSerials = (s) =>
    s
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
      .map((n) => {
        const v = Number(n);
        if (!Number.isInteger(v) || v <= 0) throw new Error(`Invalid serial number: ${n}`);
        return v;
      });

  let serialsToBurn;
  if (arg.toLowerCase() === "latest") {
    // use token totalSupply as latest serial (if present)
    let totalSupply = 0;
    try {
      // tokenInfo.totalSupply may be a Long-like object; convert robustly
      totalSupply = typeof tokenInfo.totalSupply?.toNumber === "function"
        ? tokenInfo.totalSupply.toNumber()
        : Number(tokenInfo.totalSupply?.toString() ?? 0);
    } catch {
      totalSupply = Number(tokenInfo.totalSupply?.toString() ?? 0);
    }

    if (!totalSupply || totalSupply <= 0) {
      console.error("⚠️ Token totalSupply indicates no NFTs minted yet.");
      await client.close?.();
      process.exit(1);
    }
    serialsToBurn = [totalSupply];
  } else {
    try {
      serialsToBurn = parseSerials(arg);
    } catch (err) {
      console.error("❌ Invalid serial argument:", err.message);
      await client.close?.();
      process.exit(1);
    }
  }

  console.log(`Burning serial(s) [${serialsToBurn.join(", ")}] from token ${tokenIdStr} on ${network}...`);

  // Optional sanity check: warn if operator pubkey doesn't obviously match supplyKey
  try {
    const supplyKeyStr = tokenInfo.supplyKey.toString();
    const opPubStr = operatorKey.publicKey.toString();
    if (supplyKeyStr !== opPubStr) {
      console.warn("⚠️ Supply key string does not match operator public key string.");
      console.warn("   This may be normal (KeyLists or different key formats). If burn fails due to signature, you need to sign with the token's actual supply private key.");
    }
  } catch { /* ignore */ }

  // perform the burn
  try {
    const burnTx = await new TokenBurnTransaction()
      .setTokenId(tokenId)
      .setSerials(serialsToBurn)
      .freezeWith(client)
      .sign(operatorKey); // must sign with supply key's private key (operatorKey assumed)

    const burnSubmit = await burnTx.execute(client);
    const burnReceipt = await burnSubmit.getReceipt(client);

    console.log("🔥 Burn status:", burnReceipt.status.toString());
  } catch (err) {
    console.error("❌ Error burning NFT:", err);
  } finally {
    await client.close?.();
  }
}

main().catch((err) => {
  console.error("❌ Uncaught error:", err);
  process.exit(1);
});
