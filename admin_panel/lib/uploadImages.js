// Replaces File entries in an ordered [url | File] list with their uploaded URLs,
// keeping the original order (so the chosen cover image stays first).
export async function resolveImageUrls(images, uploadFiles, folder) {
  const files = images.filter((img) => img instanceof File);
  if (!files.length) return images;

  const uploaded = await uploadFiles({ files, folder }).unwrap();
  let i = 0;
  return images.map((img) => (img instanceof File ? uploaded[i++].url : img));
}
