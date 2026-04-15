import conf from "../config/conf";

export async function uploadToCloudinary(file) {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", conf.cloudinaryUploadPreset);
  form.append("cloud_name", conf.cloudName);
  form.append("folder", "Menu");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${conf.cloudName}/image/upload`,
    { method: "POST", body: form }
  );
  if (!res.ok) throw new Error("Image upload failed");
  const json = await res.json();
  return json.secure_url;
}
