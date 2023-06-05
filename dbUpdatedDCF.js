const { Connection, PublicKey } = require("@solana/web3.js");
const sqlite3 = require("sqlite3").verbose();

const DCF_FEE_WALLET = new PublicKey("h2oMkkgUF55mxMFeuUgVYwvEnpV5kRbvHVuDWMKDYFC");
const DCF_HOUSE_WALLET = new PublicKey("EWBFhigrnx6q5MMaGgxcg22dZtqTcZwiut8ZG7QCAFo");
const DCD_FEE_WALLET = new PublicKey("9dkpTtxnsDmJRh95QhkHsAUXasQwrmX6LE4AEVSVgn3Z");
const DCD_HOUSE_WALLET = new PublicKey("7iCme5EXAmigk84QXJmsVztdrLNxaWfq5rz85vM5utPu");

const rpc = "https://rpc.hel686943a7f";

// Initialize connection 
const connection = new Connection(rpc);


let db;
try {
  db = new sqlite3.Database("balances.db");
} catch (error) {
  console.error("Failed to connect to the database:", error);
  process.exit(1);
}


// Create the transactions table if it doesn't exist
db.serialize(() => {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS balances (
      blockTime INTEGER,
      DCFFeeWalletBalance INTEGER,
      DCFHouseWalletBalance INTEGER,
      DCDFeeWalletBalance INTEGER,
      DCDHouseWalletBalance INTEGER
    )
  `,
    (err) => {
      if (err) {
        console.error("Error creating table:", err);
        return;
      }
      console.log("Table created.");
    }
  );
});

const getBalanceWithRetry = async (wallet, retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await connection.getBalance(wallet);
    } catch (error) {
      console.error(`getBalance failed for ${wallet}, retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // wait before retrying
    }
  }
  throw new Error(
    `Failed to get balance for ${wallet} after ${retries} attempts`
  );
};

const getBalances = async () => {
  console.log("Getting balances...");
  const DCFFeeWalletBalance = await getBalanceWithRetry(DCF_FEE_WALLET) /1000000000;
  const DCFHouseWalletBalance = await getBalanceWithRetry(DCF_HOUSE_WALLET) /1000000000;
  const DCDFeeWalletBalance = await getBalanceWithRetry(DCD_FEE_WALLET) /1000000000;
  const DCDHouseWalletBalance = await getBalanceWithRetry(DCD_HOUSE_WALLET) /1000000000;
  // rest of your code...

  console.log("Balances:");

  console.log("DCFFeeWalletBalance:", DCFFeeWalletBalance);
  console.log("DCFHouseWalletBalance:", DCFHouseWalletBalance);
  console.log("DCDFeeWalletBalance:", DCDFeeWalletBalance);
  console.log("DCDHouseWalletBalance:", DCDHouseWalletBalance);

  return {
    DCFFeeWalletBalance,
    DCFHouseWalletBalance,
    DCDFeeWalletBalance,
    DCDHouseWalletBalance,
  };
};

const getBlockTime = async () => {
  const slot = await connection.getSlot();
  const blockTime = await connection.getBlockTime(slot);
  return blockTime;
};

const saveToDatabase = async () => {
    try {
      const balances = await getBalances();
      const blockTime = await getBlockTime();
  
      const stmt = db.prepare(
        `INSERT INTO balances (
          blockTime,
          DCFFeeWalletBalance,
          DCFHouseWalletBalance,
          DCDFeeWalletBalance,
          DCDHouseWalletBalance
        ) VALUES (?, ?, ?, ?, ?)`
      );
  
      stmt.run(
        blockTime,
        balances.DCFFeeWalletBalance,
        balances.DCFHouseWalletBalance,
        balances.DCDFeeWalletBalance,
        balances.DCDHouseWalletBalance,
        (err) => {
          if (err) {
            console.error("Error inserting data:", err);
            return;
          }
          console.log("Data inserted successfully.");
        }
      );
    } catch (error) {
      console.error("Failed to save to database:", error);
    }
  };
  

console.log();

// Call saveToDatabase immediately and then every 5 minutes
saveToDatabase();

setInterval(saveToDatabase, 5 * 60 * 1000);
