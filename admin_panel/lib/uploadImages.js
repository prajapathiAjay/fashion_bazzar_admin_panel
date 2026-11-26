// The upload route takes at most 5 files per request (multer), so files go up in groups of 5.
const UPLOAD_BATCH = 5;

// Replaces File entries in an ordered [url | File] list with their uploaded URLs,
// keeping the original order (so the chosen cover image stays first).
export async function resolveImageUrls(images, uploadFiles, folder) {
  const files = images.filter((img) => img instanceof File);
  if (!files.length) return images;

  const uploaded = [];
  for (let start = 0; start < files.length; start += UPLOAD_BATCH) {
    const batch = files.slice(start, start + UPLOAD_BATCH);
    uploaded.push(...(await uploadFiles({ files: batch, folder }).unwrap()));
  }
  let i = 0;
  return images.map((img) => (img instanceof File ? uploaded[i++].url : img));
}
