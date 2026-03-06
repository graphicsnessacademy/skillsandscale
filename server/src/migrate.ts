import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const SOURCE_URI = process.env.SOURCE_URI || ""; 
const TARGET_URI = process.env.TARGET_URI || "";

const migrate = async () => {
  try {
    console.log("🚀 STARTING TYPE-SAFE MIGRATION...");

    const sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
    const targetConn = await mongoose.createConnection(TARGET_URI).asPromise();

    // Safety Check for TypeScript
    if (!sourceConn.db || !targetConn.db) {
      throw new Error("❌ Could not establish database objects.");
    }

    console.log(`📂 Source: '${sourceConn.name}' | 🎯 Target: '${targetConn.name}'`);

    const collections = await sourceConn.db.listCollections().toArray();

    for (const colInfo of collections) {
      const colName = colInfo.name;
      if (colName.startsWith('system.')) continue;

      console.log(`\n--- Processing Collection: ${colName} ---`);

      let documents = await sourceConn.collection(colName).find({}).toArray();
      console.log(`📦 Found ${documents.length} documents in source.`);

      if (documents.length > 0) {
        
        // 🛠 SPECIAL FIX: Handle 'projects' position conflict
        if (colName === 'projects') {
          console.log("🛠 Repairing position fields for Projects...");
          const seenPositions = new Set();
          let nextSafePos = 1;

          documents = documents.map((doc) => {
            // If position is null, duplicate, or missing, give it a new unique number
            if (doc.position == null || seenPositions.has(doc.position)) {
              while (seenPositions.has(nextSafePos)) { nextSafePos++; }
              doc.position = nextSafePos;
              nextSafePos++;
            }
            seenPositions.add(doc.position);
            return doc;
          });
        }

        // --- SAFE DROP & INSERT ---
        try {
          // Use non-null assertion (!) because we checked it above
          await targetConn.db!.dropCollection(colName);
          console.log(`🗑 Dropped existing ${colName} in Target to reset indexes.`);
        } catch (e) {
          // Collection might not exist in target yet, ignore error
        }

        const result = await targetConn.collection(colName).insertMany(documents);
        console.log(`✅ Migrated ${result.insertedCount} items to ${colName}`);
      }
    }

    console.log("\n---------------------------------------");
    console.log("🎉 MIGRATION SUCCESSFUL!");
    console.log("---------------------------------------");

    await sourceConn.close();
    await targetConn.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ MIGRATION FAILED:", err);
    process.exit(1);
  }
};

migrate();