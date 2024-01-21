export function pagination(pageNumber: number, size: number) {
  const page = pageNumber ? pageNumber : 1;
  const limit = size ? size : 10;
  return [page, limit];
}
