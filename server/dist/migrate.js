"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const SOURCE_URI = process.env.SOURCE_URI || "";
const TARGET_URI = process.env.TARGET_URI || "";
const migrate = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("🚀 STARTING TYPE-SAFE MIGRATION...");
        const sourceConn = yield mongoose_1.default.createConnection(SOURCE_URI).asPromise();
        const targetConn = yield mongoose_1.default.createConnection(TARGET_URI).asPromise();
        // Safety Check for TypeScript
        if (!sourceConn.db || !targetConn.db) {
            throw new Error("❌ Could not establish database objects.");
        }
        console.log(`📂 Source: '${sourceConn.name}' | 🎯 Target: '${targetConn.name}'`);
        const collections = yield sourceConn.db.listCollections().toArray();
        for (const colInfo of collections) {
            const colName = colInfo.name;
            if (colName.startsWith('system.'))
                continue;
            console.log(`\n--- Processing Collection: ${colName} ---`);
            let documents = yield sourceConn.collection(colName).find({}).toArray();
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
                            while (seenPositions.has(nextSafePos)) {
                                nextSafePos++;
                            }
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
                    yield targetConn.db.dropCollection(colName);
                    console.log(`🗑 Dropped existing ${colName} in Target to reset indexes.`);
                }
                catch (e) {
                    // Collection might not exist in target yet, ignore error
                }
                const result = yield targetConn.collection(colName).insertMany(documents);
                console.log(`✅ Migrated ${result.insertedCount} items to ${colName}`);
            }
        }
        console.log("\n---------------------------------------");
        console.log("🎉 MIGRATION SUCCESSFUL!");
        console.log("---------------------------------------");
        yield sourceConn.close();
        yield targetConn.close();
        process.exit(0);
    }
    catch (err) {
        console.error("❌ MIGRATION FAILED:", err);
        process.exit(1);
    }
});
migrate();
