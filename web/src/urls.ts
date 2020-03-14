import routes from './routes';

export function staticMainImage(file: string): string {
  return `${routes.static.img.main}/${file}`;
}
