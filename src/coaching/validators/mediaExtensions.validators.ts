export const mediaFileFilter = (filename: string): boolean => {
  if (!filename.match(/\.(jpg|jpeg|png|mkv|mp4|mp3|ogg|flv|aac)$/i)) {
    return false;
  }
  return true;
};
