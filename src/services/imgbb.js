export async function uploadImageToImgBB(file) {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error("Falta configurar VITE_IMGBB_API_KEY en el archivo .env");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error("No se pudo subir la imagen a ImgBB");
  }

  return data.data.url;
}