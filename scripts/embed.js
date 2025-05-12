import fs from "fs";
import pdfParse from "pdf-parse";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

// 🧠 Config .env
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 📄 Lecture du PDF
async function loadPDF(path) {
    const buffer = fs.readFileSync(path);
    const data = await pdfParse(buffer);
    return data.text;
}

// ✂️ Split texte en chunks
function splitText(text, maxLength = 500) {
    const chunks = [];
    const paragraphs = text.split("\n").filter(p => p.trim().length > 0);
    let current = "";

    for (const para of paragraphs) {
        if ((current + para).length < maxLength) {
            current += para + " ";
        } else {
            chunks.push(current.trim());
            current = para + " ";
        }
    }

    if (current.trim()) chunks.push(current.trim());
    return chunks;
}

// 🧠 Embedding + insertion Supabase
async function embedAndStore(chunks, source) {
    for (const chunk of chunks) {
        const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: chunk,
        });

        const vector = embedding.data[0].embedding;

        const { error } = await supabase.from("documents").insert({
            contenu: chunk,
            source: source,
            embedding: vector,
        });

        if (error) console.error("❌ Erreur Supabase :", error.message);
        else console.log("✅ Chunk inséré !");
    }
}

// 🚀 Lancement
(async () => {
    const texte = await loadPDF("scripts/mmitest.pdf");
 // 📝 Remplace par ton vrai fichier
    const morceaux = splitText(texte);
    await embedAndStore(morceaux, "mmitest.pdf");
})();
