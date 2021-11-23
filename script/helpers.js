export const fahrenheitConverter = (celsius) => {
  let fahrenheit = (celsius * 9) / 5 + 32;
  return Math.round(fahrenheit);
};
