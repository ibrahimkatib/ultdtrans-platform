export function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value, (_key, val) => val instanceof Date ? val.toISOString() : val));
}
