import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

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
            auteur: data.auteur // 👈 ici on envoie le nom de l'utilisateur
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
