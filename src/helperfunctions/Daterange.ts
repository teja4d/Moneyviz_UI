//format date
export const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
    };
export const generateRandomRGBA = () => {
    const o = Math.round, r = Math.random, s = 255;
    return `rgba(${o(r()*s)},${o(r()*s)},${o(r()*s)},${r().toFixed(1)})`;
    }

export const returnMonth = (month:number) =>{
    switch(month){
        case 1:
            return "January"
        case 2:
            return "February"
        case 3:
            return "March"
        case 4:
            return "April"
        case 5:
            return "May"
        case 6:
            return "June"
        case 7:
            return "July"
        case 8:
            return "August"
        case 9:
            return "September"
        case 10:
            return "October"
        case 11:
            return "November"
        case 12:
            return "December"
        default:
            return "Error"
    }
}