export const setLocalStorage = (value) => {
  localStorage.setItem("documents", JSON.stringify(value));
};

export const getLocalStorage = () => {
  return JSON.parse(localStorage.getItem("documents"));
};

// export const fetchDocuments = async () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const documents = getLocalStorage();
//       resolve(documents);
//     }, 500); // to simulate network delay
//   });
// };

export const saveDocuments = async (documents) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      setLocalStorage(documents);
      resolve();
    }, 500); // to simulate network delay
  });
};
