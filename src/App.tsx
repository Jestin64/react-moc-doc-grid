import React, { useCallback, useEffect, useState } from "react";
import { DocumentGrid } from "./components/DocumentGrid";
import {
  getLocalStorage,
  saveDocuments,
  setLocalStorage,
} from "./helper/session";
import _ from "lodash";
import { Box } from "@mui/material";

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

  // comment:  works as expected but removed to due reduce code complexity
  // const debouncedSetDocuments = useCallback(
  //   _.debounce((newDocuments: Document[]) => {
  //     setDocuments(newDocuments);
  //     setHasChanges(true);
  //   }, 2000),
  //   [] // Dependencies array is empty to ensure the function is memoized
  // );

  // const handleDocumentChange = (newDocuments: Document[]) => {
  //   debouncedSetDocuments(newDocuments);
  // };

  const handleDocumentChange = (newDocuments: Document[]) => {
    setDocuments(newDocuments);
    setHasChanges(true);
  };
  return (
    <Box
      sx={{
        padding: "30px 0",
        backgroundColor: "#faebd7",
        overflow: "hidden",
        maxWidth: "100vw",
        maxHeight: "100vh",
      }}
    >
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
        {loading && (
          <span
            style={{
              fontWeight: 600,
              fontSize: "1.2em",
            }}
          >
            Saving...
          </span>
        )}
      </div>
      <div
        style={{
          marginLeft: "20%",
        }}
      >
        Time Taken for last Save:{" "}
        <span
          style={{
            fontWeight: 600,
            fontSize: "1.2em",
          }}
        >
          {saveDuration}
        </span>{" "}
        ms
      </div>
    </Box>
  );
};

export default App;
