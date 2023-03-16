export interface Main {
    credit_amount:      number;
    debit_amount:       number;
    label:              Label;
    type:               Label;
    total:              number;
    percentage:         number;
    rects:              Rects;
    category:           'transaction' | 'description' | 'date' | 'day'| 'day_transactions';
    recent_transaction: RecentTransaction[];
    rects_children:     RectsChild[];
}

export enum Label {
    Credit = "credit",
    Debit = "debit",
}

export interface RecentTransaction {
    transaction_id:          string;
    transaction_date:        string;
    transaction_type:        string;
    sort_code:               SortCode;
    account_number:          number;
    transaction_description: string;
    debit_amount:            number;
    credit_amount:           number;
    balance:                 number;
    number:                  number;
    type:                    Label;
    day_of_week:             DayOfWeek;
    category_spend:          string;
    sub_category:            string;
}

export enum DayOfWeek {
    Friday = "Friday",
    Monday = "Monday",
    Wednesday = "Wednesday",
}

export enum SortCode {
    The309546 = "30-95-46",
}

export interface Rects {
    x:  number;
    y:  number;
    dx: number;
    dy: number;
}

export interface RectsChild {
    credit_amount: number;
    debit_amount:  number;
    type:          Label;
    label:         string;
    total:         number;
    rects:         Rects;
}
