export function optimizeImage(
  base64: string,
  maxWidth: number,
  maxHeight: number,
  quality: number
): string {
  base64 = base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
  base64 = `data:image/jpeg;base64,${base64}`;

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  const image = new Image();
  image.src = base64;

  const ratio = Math.min(maxWidth / image.width, maxHeight / image.height);
  canvas.width = image.width * ratio;
  canvas.height = image.height * ratio;

  context?.drawImage(image, 0, 0, canvas.width, canvas.height);

  const result = canvas.toDataURL('image/jpeg', quality);

  return result.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
}
