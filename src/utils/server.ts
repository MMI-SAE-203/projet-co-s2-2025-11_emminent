import PocketBase from "pocketbase";

export const pb = new PocketBase("https://emminent.noahrognon.fr:443");

export default async function getContext({ locals }) {
    locals.pb = pb;
}
