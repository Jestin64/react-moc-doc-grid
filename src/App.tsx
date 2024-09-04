import React, { useEffect, useState } from "react";
import { DocumentGrid } from "./components/DocumentGrid";
import {
  getLocalStorage,
  saveDocuments,
  setLocalStorage,
} from "./helper/session";
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
  const [timeSinceLastSave, setTimeSinceLastSave] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);

  // Fetch documents on initial load
  useEffect(() => {
    const storedDocs = getLocalStorage();
    if (!storedDocs) {
      const fetchDocuments = async () => {
        const response = await fetch("/api/documents");
        const data = await response.json();
        setDocuments(data);
        setLocalStorage(data);
      };

      fetchDocuments().catch((error) => {
        console.error("Error fetching documents: ", error);
        setError(error);
      });
    } else {
      setDocuments(storedDocs);
    }
  }, []);

  // Auto saving every 5 sec only if there are changes
  useEffect(() => {
    const saveInterval = setInterval(async () => {
      if (hasChanges) {
        setLoading(true);
        const startTime = Date.now();
        await saveDocuments(documents)
          .then(() => {
            const endTime = Date.now();
            setSaveDuration(endTime - startTime);
            setHasChanges(false);
            setLoading(false);
            setTimeSinceLastSave(0);
          })
          .catch((error) => {
            console.error("Error saving documents: ", error);
            setError(error);
            setLoading(false);
          });
      }
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [documents, hasChanges]);

  // Track time since the last save
  useEffect(() => {
    const timeInterval = setInterval(() => {
      if (!loading) {
        setTimeSinceLastSave((prevTime) => prevTime + 1);
      }
    }, 1000); // Increment every second

    return () => clearInterval(timeInterval);
  }, [loading]);

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
      {!error ? (
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
            <span
              style={{
                fontWeight: 600,
                fontSize: "1.2em",
              }}
            >
              {loading
                ? "Saving..."
                : hasChanges
                ? "Unsaved changes....saving in 5 seconds"
                : "All changes saved"}
            </span>
          </div>
          <div
            style={{
              marginLeft: "20%",
            }}
          >
            <span
              style={{
                fontWeight: 600,
                fontSize: "1.2em",
              }}
            >
              Last saved {timeSinceLastSave} seconds ago
            </span>
          </div>
          <div
            style={{
              marginLeft: "20%",
            }}
          >
            Time Taken for Last Save:
            <span
              style={{
                fontWeight: 600,
                fontSize: "1.2em",
              }}
            >
              {saveDuration}
            </span>
            ms
          </div>
        </>
      ) : (
        <Box
          sx={{
            marginLeft: "20%",
          }}
        >
          <h1>Something went wrong</h1>
          <p>{error.message}</p>
        </Box>
      )}
    </Box>
  );
};

export default App;
