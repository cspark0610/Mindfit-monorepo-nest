export const imageFileFilter = (filename: string): boolean => {
  if (!filename.match(/\.(jpg|jpeg|png)$/i)) {
    return false;
  }
  return true;
};
