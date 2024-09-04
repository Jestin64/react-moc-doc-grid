import { useState, useCallback, memo } from "react";
import { Box } from "@mui/material";
import DocumentCard from "./DocumentCard";
import DocumentOverlay from "./DocumentOverlay";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

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

const MemoisedCard = memo(DocumentCard);

export const DocumentGrid = ({
  documents,
  handleDocumentChange,
  loading,
}: DocumentGridProps) => {
  const [overlayImage, setOverlayImage] = useState<string | null>(null);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    // Reorder items based on drag and drop result
    const reorderedItems = Array.from(documents);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    handleDocumentChange(reorderedItems);
  };

  const handleOverlay = useCallback((documentType: string) => {
    setOverlayImage(`/images/${documentType}.jpg`);
  }, []);

  return (
    <>
      {documents && documents.length > 0 && (
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
                {documents.slice(0, 3).map((document, index) => (
                  <Draggable
                    key={`${document.type}_${index}`}
                    draggableId={`${document.type}_${index}`}
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
                        <MemoisedCard
                          loading={loading}
                          title={document.title}
                          imageUrl={`/images/${document.type}.jpg`}
                          onClick={() => handleOverlay(document.type)}
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
                {documents.slice(3, 5).map((document, index) => (
                  <Draggable
                    key={`${document.type}_${index + 3}`}
                    draggableId={`${document.type}_${index + 3}`}
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
                        <MemoisedCard
                          loading={loading}
                          title={document.title}
                          imageUrl={`/images/${document.type}.jpg`}
                          onClick={() => handleOverlay(document.type)}
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
      )}
    </>
  );
};
