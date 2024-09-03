import React, { useEffect, useState } from "react";
import { Box, Grid2 } from "@mui/material";
import { makeStyles } from "@mui/styles";
import DocumentCard from "./DocumentCard";
import DocumentOverlay from "./DocumentOverlay";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

// const useStyles = makeStyles({
//   grid: {
//     display: "flex",
//     flexWrap: "wrap",
//     justifyContent: "center",
//   },
// });

interface Document {
  type: string;
  title: string;
  position: number;
}

interface DocumentGridProps {
  documents: Document[];
  handleDocumentChange: (newDocuments: Document[]) => void;
  loading: boolean;
}

export const DocumentGrid = ({
  documents,
  handleDocumentChange,
  loading,
}: DocumentGridProps) => {
  // const classes = useStyles();
  const [items, setItems] = useState<Document[]>([]);
  const [overlayImage, setOverlayImage] = useState<string | null>(null);

  useEffect(() => {
    setItems(documents);
  }, [documents]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    // Reorder items based on drag and drop result
    const reorderedItems = Array.from(items);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setItems(reorderedItems);
    handleDocumentChange(reorderedItems);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="top-row" direction="horizontal">
        {(provided) => (
          <Box
            display="grid"
            gridTemplateColumns="repeat(4, 1fr)" // +1 extra space for card to slide
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              placeItems: "center",
              width: "100%",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            {items.slice(0, 3).map((document, index) => (
              <Draggable
                key={document.type}
                draggableId={document.type}
                index={index}
              >
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      opacity: snapshot.isDragging ? 0.5 : 1,
                      transition: "transform 0.2s ease, opacity 0.2s ease",
                      boxShadow: snapshot.isDragging
                        ? "0 2px 10px rgba(0,0,0,0.2)"
                        : "none",
                    }}
                    sx={{
                      gridColumn: "span 1",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <DocumentCard
                      loading={loading}
                      title={document.title}
                      imageUrl={`/images/${document.type}.jpg`}
                      onClick={() =>
                        setOverlayImage(`/images/${document.type}.jpg`)
                      }
                    />
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>

      <Droppable droppableId="bottom-row" direction="horizontal">
        {(provided) => (
          <Box
            display="grid"
            gridTemplateColumns="repeat(3, 1fr)" // +1 extra space for card to slide
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              placeItems: "center",
              width: "100%",
              maxWidth: "400px",
              margin: "20px auto 0",
            }}
          >
            {items.slice(3, 5).map((document, index) => (
              <Draggable
                key={document.type}
                draggableId={document.type}
                index={index + 3} // Adjust index for the bottom row
              >
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      opacity: snapshot.isDragging ? 0.5 : 1,
                      transition: "transform 0.2s ease, opacity 0.2s ease",
                      boxShadow: snapshot.isDragging
                        ? "0 2px 10px rgba(0,0,0,0.2)"
                        : "none",
                    }}
                    sx={{
                      gridColumn: "span 1",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <DocumentCard
                      loading={loading}
                      title={document.title}
                      imageUrl={`/images/${document.type}.jpg`}
                      onClick={() =>
                        setOverlayImage(`/images/${document.type}.jpg`)
                      }
                    />
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>

      {overlayImage && (
        <DocumentOverlay
          imageUrl={overlayImage}
          onClose={() => setOverlayImage(null)}
        />
      )}
    </DragDropContext>
  );
};
