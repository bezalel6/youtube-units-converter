export const endsWithNum = (str: string): number | null => {
  const regex = /[0-9]+(\s*?)$/gm;
  const m = regex.exec(str);
  return m ? Number(m[0]) : null;
};
