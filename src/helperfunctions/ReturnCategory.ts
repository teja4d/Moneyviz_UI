export const ReturnCategory = (category: string) => {
    switch(category) {
        case 'transaction':
            return 'Incoming/Outgoing';
        case 'description':
            return 'Loyds category';
        case 'date':
            return 'Transaction description';
        case 'day':
            return 'Transaction date';
        default:
            return 'Transaction day';
    }
}