export const setLocalStorage = (value) => {
  localStorage.setItem("documents", JSON.stringify(value));
};

export const getLocalStorage = () => {
  return JSON.parse(localStorage.getItem("documents"));
};

export const saveDocuments = async (documents) => {
  // code line to simulate throwing error
  // throw new Error("Network Error");
  return new Promise((resolve) => {
    setTimeout(() => {
      setLocalStorage(documents);
      resolve();
    }, 500); // to simulate network delay
  });
};

// hypothetical rest api calls

// export const fetchDocuments = async () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const documents = getLocalStorage();
//       resolve(documents);
//     }, 500); // to simulate network delay
//   });
// };

// export const deleteDocument = async (id) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const documents = getLocalStorage();
//       const updatedDocuments = documents.filter((doc) => doc.id !== id);
//       setLocalStorage(updatedDocuments);
//       resolve();
//     }, 500); // to simulate network delay
//   });
// };

// export const addDocument = async (document) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const documents = getLocalStorage();
//       const updatedDocuments = [...documents, document];
//       setLocalStorage(updatedDocuments);
//       resolve();
//     }, 500); // to simulate network delay
//   });
// };

// export const updateDocument = async (document) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const documents = getLocalStorage();
//       const updatedDocuments = documents.map((doc) =>
//         doc.id === document.id ? document : doc
//       );
//       setLocalStorage(updatedDocuments);
//       resolve();
//     }, 500); // to simulate network delay
//   });
// };
