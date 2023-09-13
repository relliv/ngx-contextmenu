export const evaluateIfFunction = <T>(
  value: boolean | ((value?: T) => boolean) | undefined,
  item?: T
): boolean => {
  if (value instanceof Function) {
    return value(item);
  }
  return !!value;
};
