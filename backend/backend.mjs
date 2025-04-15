import PocketBase from 'pocketbase';

const pb = new PocketBase('https://emminent.noahrognon.fr:443');

export async function getTemplates() {
    const records = await pb.collection('Templates').getFullList();
    return records;
}


export async function addTemplate(data) {
    try {
        console.log("📤 Données envoyées à PocketBase :", data);

        await pb.collection("Templates").create({
            title: data.title,
            url: data.url,
            auteur: data.auteur 
        });

        return {
            success: true,
            message: "Le template a été ajouté avec succès.",
        };
    } catch (error) {
        console.error(" Erreur PocketBase :", error);
        return {
            success: false,
            message: " Une erreur est survenue : " + error.message,
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
export async function addPrompt(data) {
    try {
        console.log("📝 Ajout prompt :", data);
        await pb.collection("prompts").create(data);
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

export async function askGPTWithHistory(conversationId, question) {
    const history = await getMessages(conversationId);

    const messages = history.map(m => ({
        role: m.role,
        content: m.contenu
    }));

    messages.push({ role: "user", content: question });

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
    const reponse = data.choices?.[0]?.message?.content || "Réponse vide.";
    return reponse;
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
