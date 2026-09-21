export const modifyDotEnvConfig = (
  content: string,
  values: Record<string, string>,
) => {
  const lines = content.split('\n');
  const updatedKeys = new Set<string>();
  const resultLines = lines.map((line) => {
    const match = line.match(/^([^=#\s]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      if (key in values) {
        updatedKeys.add(key);
        return `${key}=${values[key]}`;
      }
    }
    return line;
  });

  for (const [key, value] of Object.entries(values)) {
    if (!updatedKeys.has(key)) {
      resultLines.push(`${key}=${value}`);
    }
  }

  return resultLines.join('\n');
};
