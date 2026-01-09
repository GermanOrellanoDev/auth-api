export const expiresInToDate = (expiresIn: string) => {
  const num = parseInt(expiresIn.replace(/\D/g, ""), 10);
  if (expiresIn.includes("m")) return new Date(Date.now() + num * 60 * 1000);

  if (expiresIn.includes("h"))
    return new Date(Date.now() + num * 60 * 60 * 1000);

  if (expiresIn.includes("d"))
    return new Date(Date.now() + num * 24 * 60 * 60 * 1000);

  return new Date(Date.now() + num);
};
