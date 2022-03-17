export const imageFileFilter = (filename: string): boolean => {
  if (!filename.match(/\.(jpg|jpeg|png)$/i)) {
    return false;
  }
  return true;
};

export const videoFileFilter = (filename: string): boolean => {
  if (!filename.match(/\.(mkv|mp4|mp3|ogg|flv|aac)$/i)) {
    return false;
  }
  return true;
};
