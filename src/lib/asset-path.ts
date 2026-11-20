// Static files in /public are not auto-prefixed with basePath by Next, so GitHub Pages needs this.
export function assetPath(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;
}
