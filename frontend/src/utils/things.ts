export function generateRandomAlphabets(length: number = 5): string {
  const alphabets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabets.length);
    result += alphabets[randomIndex];
  }

  return result;
}
