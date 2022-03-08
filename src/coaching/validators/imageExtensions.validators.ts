export const imageFileFilter = (filename: string): boolean => {
  const extension = filename.split('.')[1];
  if (!extension.match(/\.(jpg|jpeg|png)$/)) {
    return false;
  }
  return true;
};
