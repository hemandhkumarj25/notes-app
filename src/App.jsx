import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import NotesPage from "./pages/NotesPage";
import ArchivePage from "./pages/ArchivePage";
import TrashPage from "./pages/TrashPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<NotesPage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/trash" element={<TrashPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
