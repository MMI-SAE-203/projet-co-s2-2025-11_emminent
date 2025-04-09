const params: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
};

const formatter = new Intl.DateTimeFormat('fr-FR', params);

export function formatDate(date: Date): string {
    return formatter.format(date);
}