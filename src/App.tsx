import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout';
import {
  HomePage,
  PeoplePage,
  PersonDetailPage,
  PersonNewPage,
  PersonEditPage,
  MeetingsPage,
  MeetingNewPage,
  MeetingDetailPage,
  SettingsPage,
  ImportPage
} from './pages';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/people" element={<PeoplePage />} />
          <Route path="/people/new" element={<PersonNewPage />} />
          <Route path="/people/:id" element={<PersonDetailPage />} />
          <Route path="/people/:id/edit" element={<PersonEditPage />} />
          <Route path="/meetings" element={<MeetingsPage />} />
          <Route path="/meetings/new" element={<MeetingNewPage />} />
          <Route path="/meetings/:id" element={<MeetingDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/import" element={<ImportPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
