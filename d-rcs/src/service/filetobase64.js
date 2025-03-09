export const dataToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const blobToFile = (theBlob, fileName) => {
  return new Promise((resolve, reject) => {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    resolve(theBlob);
    // return theBlob;
  });
};
