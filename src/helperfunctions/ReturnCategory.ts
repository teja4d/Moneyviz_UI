export type Category = 'transaction' | 'description' | 'date' | 'day'|'day_transactions';
export type labelCategory = 'Incoming/Outgoing' | 'Loyds category' | 'Transaction description' | 'Transaction date' | 'Transaction on day';

export type ReturnCategoryType = {
    label: labelCategory;
    parent: string;
    child: string;
    clicked?: boolean;
}

export const ReturnCategory = (category: Category,child:string,clicked=false) : ReturnCategoryType => {
    switch(category) {
        case 'transaction':
            return {
                label:'Incoming/Outgoing',
                parent: 'expense',
                child: child,
                clicked: clicked
            }
        case 'description':
            return {
                label:'Loyds category',
                parent: 'transaction',
                child: child,
                clicked: clicked
            }
        case 'date':
            return {
                label:'Transaction description',
                parent: 'description',
                child: child
            }
        case 'day':
            return {
                label:'Transaction date',
                parent: 'date',
                child: child,
                clicked: clicked
            }
        case 'day_transactions':
            return {
                label:'Transaction on day',
                parent: 'day',
                child: child,
                clicked: clicked
            }
        default:
            return {
                label:'Incoming/Outgoing',
                parent: 'expense',
                child: ''
            }
    }
}