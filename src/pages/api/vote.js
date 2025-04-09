import { votePrompt } from "../../../backend/backend.mjs";

export async function POST({ request }) {
    const formData = await request.formData();
    const id = formData.get("id");
    const type = formData.get("type");

    if (!id || !["like", "dislike"].includes(type)) {
        return new Response(
            JSON.stringify({ success: false, message: "Requête invalide" }),
            { status: 400 }
        );
    }

    const result = await votePrompt(id, type);

    return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
    });
}
