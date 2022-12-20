export const formatText = (text: string) => {
    return text
      .toString()
      .split("_")
      .map((s: string) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(" ")
      .toUpperCase();
  };
