export const getConfigOrThrow = (name: string) => {
  const x = process.env[name];
  if (!x) throw new Error(`${name} is not defined in config`);
  return x;
};
