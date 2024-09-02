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
      <Droppable droppableId="documents" direction="horizontal">
        {(provided) => (
          <Box
            display="grid"
            gridTemplateColumns="repeat(3, 1fr)"
            gap={2}
            padding={"2% 16%"}
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              placeItems: "center",
            }}
          >
            {items.map((document, index) => (
              <Draggable
                key={document.type}
                draggableId={document.type}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      opacity: snapshot.isDragging ? 0.5 : 1,
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
                  </div>
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
