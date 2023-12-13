export function toTitleCase(input: string): string {
  const result = input?.replace(/([A-Z])/g, ' $1');
  return result?.charAt(0)?.toUpperCase() + result?.slice(1);
}
export function toCapitalizeFirst(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1);
}
