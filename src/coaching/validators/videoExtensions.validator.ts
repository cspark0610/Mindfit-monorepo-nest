export const videoFileFilter = (filename: string): boolean => {
  if (!filename.match(/\.(mkv|mp4|mp3|ogg|flv|aac)$/i)) {
    return false;
  }
  return true;
};
