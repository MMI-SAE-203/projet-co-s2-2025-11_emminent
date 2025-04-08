import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

export async function getTemplates() {
    const records = await pb.collection('Templates').getFullList();
    return records;
}


export async function addTemplate(data) {
    try {
        console.log("📤 Données envoyées à PocketBase :", data); // <--- ajoute ça

        await pb.collection("Templates").create(data);
        return {
            success: true,
            message: "✅ Le template a été ajouté avec succès.",
        };
    } catch (error) {
        console.error("❌ Erreur PocketBase :", error);
        return {
            success: false,
            message: "❌ Une erreur est survenue : " + error.message,
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
