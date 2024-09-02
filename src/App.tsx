import React, { useEffect, useState } from "react";
import { DocumentGrid } from "./components/DocumentGrid";
import {
  getLocalStorage,
  saveDocuments,
  setLocalStorage,
} from "./helper/session";

interface Document {
  type: string;
  title: string;
  position: number;
}

const App: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [saveDuration, setSaveDuration] = useState<number>(0);

  useEffect(() => {
    const storedDocs = getLocalStorage();
    if (!storedDocs) {
      const fetchDocuments = async () => {
        const response = await fetch("/api/documents");
        const data = await response.json();
        setDocuments(data);
        setLocalStorage(data);
      };

      fetchDocuments();
    } else setDocuments(storedDocs);
  }, []);

  useEffect(() => {
    if (hasChanges) {
      setLoading(true);
      const saveInterval = setInterval(async () => {
        const startTime = Date.now(); // Record the start time
        await saveDocuments(documents);
        const endTime = Date.now(); // Record the end time
        setLoading(false);
        setHasChanges(false);
        setSaveDuration(endTime - startTime);
      }, 5000);

      return () => {
        clearInterval(saveInterval);
      };
    }
  }, [documents, hasChanges]);

  const handleDocumentChange = (newDocuments: Document[]) => {
    setDocuments(newDocuments);
    setHasChanges(true);
  };

  console.log("loading: ", loading);

  return (
    <>
      <DocumentGrid
        documents={documents}
        handleDocumentChange={handleDocumentChange}
        loading={loading}
      />
      <div
        style={{
          marginLeft: "20%",
        }}
      >
        Time Taken for last Save: {saveDuration} ms
      </div>
      <div
        style={{
          marginLeft: "20%",
        }}
      >
        {loading && "Saving..."}
      </div>
    </>
  );
};

export default App;
