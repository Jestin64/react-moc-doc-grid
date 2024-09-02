import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { worker } from "./mock-server";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const enableMockServer = async () => {
  await worker.start();
};

enableMockServer().then(() => {
  root.render(<App />);
});
