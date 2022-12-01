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