import PocketBase from 'pocketbase';

const pb = new PocketBase('https://emminent.noahrognon.fr:443');

export async function getTemplates() {
    const records = await pb.collection('Templates').getFullList();
    return records;
}


export async function addTemplate(data, userId) {
    try {
        console.log("📤 Ajout template :", data, "👤 Auteur :", userId);

        await pb.collection("Templates").create({
            ...data,
            author: userId, // ✅ relation identique à celle utilisée pour les prompts
        });

        return {
            success: true,
            message: "✅ Le template a été ajouté avec succès.",
        };
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout du template :", error);
        return {
            success: false,
            message: "❌ Erreur : " + error.message,
        };
    }
}



// Fonction backend PocketBase
export async function getPrompts() {
    const records = await pb.collection('prompts').getFullList({
        sort: '-created' // optionnel, pour les plus récents en premier
    });
    return records;
}
export async function addPrompt(data, userId) {
    try {
        console.log("📝 Ajout prompt :", data, "👤 Auteur :", userId);

        await pb.collection("prompts").create({
            ...data,
            author: userId, // 👈 relation vers l'utilisateur connecté
        });

        return {
            success: true,
            message: "✅ Le prompt a été ajouté avec succès.",
        };
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout :", error);
        return {
            success: false,
            message: "❌ Erreur : " + error.message,
        };
    }
}


export async function votePrompt(promptId, type = "like") {
    try {
        const prompt = await pb.collection("prompts").getOne(promptId);
        const likes = prompt.likes || 0;
        const dislikes = prompt.dislikes || 0;

        const newData =
            type === "like"
                ? { likes: likes + 1 }
                : { dislikes: dislikes + 1 };

        await pb.collection("prompts").update(promptId, newData);

        return {
            success: true,
            likes: newData.likes ?? likes,
            dislikes: newData.dislikes ?? dislikes
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

import 'dotenv/config';

import fs from "fs/promises";
import pdfParse from "pdf-parse";

export async function askGPTWithHistory(conversationId, question, systemPrompt, pdfFile = null) {
    const history = await getMessages(conversationId);

    let pdfContext = "";
    if (pdfFile) {
        try {
            const buffer = await fs.readFile(pdfFile);
            const parsed = await pdfParse(buffer);
            pdfContext = parsed.text.slice(0, 5000); // pour éviter les prompts trop longs
            console.log("📄 CONTENU DU PDF LU :", pdfContext.slice(0, 500));

        } catch (err) {
            console.error("❌ Erreur de lecture PDF :", err.message);
        }
    }

    // 🔍 Recherche de documents RAG (seulement si pas de PDF)
    let docContext = "";
    if (!pdfContext) {
        const docs = await matchDocuments(question);
        docContext = docs.map(d => d.contenu).join("\n\n");
    }

    // 🧠 Prompt enrichi
    const enhancedPrompt = `${systemPrompt}

${pdfContext
            ? `L'utilisateur a joint un document PDF. Voici son contenu. Tu dois absolument en tenir compte pour répondre à sa question :\n"""${pdfContext}"""`
            : "[Aucun contenu de PDF lisible ou fourni.]"}

${docContext
            ? `Voici des documents de référence MMI utiles :\n${docContext}`
            : ""}`.trim();

    

    const messages = [
        { role: "system", content: enhancedPrompt },
        ...history.map(m => ({ role: m.role, content: m.contenu })),
        { role: "user", content: question }
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "gpt-4-1106-preview",
            messages
        })
    });

    const data = await response.json();

    if (data.error) {
        console.error("❌ Erreur GPT :", data.error);
        return `Erreur : ${data.error.message}`;
    }

    return data.choices?.[0]?.message?.content || "Réponse vide.";
}




export async function saveConversation(userId, question, reponse) {
    try {
        await pb.collection("conversations").create({
            user: userId,
            question,
            reponse
        });
    } catch (err) {
        console.error("❌ Erreur sauvegarde historique :", err);
    }
}
export async function createConversation(userId) {
    const conv = await pb.collection("conversations").create({
        user: userId
    });
    return conv.id;
}

export async function addMessage(conversationId, role, contenu) {
    return await pb.collection("messages").create({
        conversation: conversationId,
        role,
        contenu
    });
}

export async function getMessages(conversationId) {
    return await pb.collection("messages").getFullList({
        filter: `conversation = "${conversationId}"`,
        sort: "created"
    });
}
// backend.mjs
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function searchRelevantChunks(question) {
    const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: question,
    });

    const queryEmbedding = embedding.data[0].embedding;

    const { data, error } = await supabase.rpc("match_documents", {
        query_embedding: queryEmbedding,
        match_count: 5
    });

    if (error) {
        console.error("Erreur Supabase RAG :", error);
        return "";
    }

    return data.map(d => d.contenu).join("\n\n");
}
export async function matchDocuments(question) {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // 1. Obtenir l'embedding de la question
    const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: question
    });

    const questionEmbedding = embeddingResponse.data[0].embedding;

    // 2. Appel RPC vers Supabase pour récupérer les chunks proches
    const { data, error } = await supabase.rpc("match_documents", {
        query_embedding: questionEmbedding,
        match_threshold: 0.78,
        match_count: 5
    });

    if (error) {
        console.error("❌ Erreur de recherche Supabase:", error.message);
        return [];
    }   

    return data;
}

export async function getDossiers() {
    const records = await pb.collection('Dossier').getFullList();
    return records;
}

export async function addDossier(data, userId) {
    try {
        console.log("📤 Ajout dossier :", data, "👤 Auteur :", userId);

        await pb.collection("Dossier").create({
            ...data,
            author: userId,
        });

        return {
            success: true,
            message: "✅ Le dossier a été ajouté avec succès.",
        };
    } catch (error) {
        console.error("❌ Erreur lors de l'ajout du dossier :", error);
        return {
            success: false,
            message: "❌ Erreur : " + error.message,
        };
    }
}
