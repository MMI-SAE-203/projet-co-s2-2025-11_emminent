import pdfParse from "pdf-parse";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 🧠 Stockage temporaire en mémoire
const uploads = new Map(); // key = conversationId

export async function POST({ request }) {
    const form = await request.formData();
    const file = form.get("pdf");
    const conversationId = form.get("conversationId");

    if (!file || !conversationId) {
        return new Response("Fichier ou conversation manquant", { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await pdfParse(buffer);
    const text = data.text;
    const chunks = text.match(/(.|\s){1,500}/g) || [];

    const embeddedChunks = [];

    for (const chunk of chunks) {
        const embeddingRes = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: chunk,
        });

        embeddedChunks.push({
            contenu: chunk,
            embedding: embeddingRes.data[0].embedding,
        });
    }

    uploads.set(conversationId, {
        filename: file.name,
        chunks: embeddedChunks,
    });

    return new Response("PDF indexé avec succès");
}

// Exporte les fonctions pour ia.astro
export function getUploads(conversationId) {
    return uploads.get(conversationId);
}

export function clearUploads(conversationId) {
    uploads.delete(conversationId);
}
