export function hexToRgb(hex:string) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  // Parse the hexadecimal string and extract the R, G, and B values
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  // Return the RGB values 
  return `${r}, ${g}, ${b}`;
  
}


export const lightenRgbColor =  (color:string, amount:number) => {
    let rgbColor = `rgb(${hexToRgb(color)})`
    // Parse the color string and extract the R, G, and B values
    const match = rgbColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return color;
  
    let r = parseInt(match[1], 10);
    let g = parseInt(match[2], 10);
    let b = parseInt(match[3], 10);
  
    // Lighten the color by increasing the value of each channel
    r += amount;
    g += amount;
    b += amount;
  
    // Ensure that the values are within the valid range (0-255)
    r = Math.max(0, Math.min(r, 255));
    g = Math.max(0, Math.min(g, 255));
    b = Math.max(0, Math.min(b, 255));
  
    // Return the lighter color as a string in RGB format
    return `rgb(${r}, ${g}, ${b})`;
  }