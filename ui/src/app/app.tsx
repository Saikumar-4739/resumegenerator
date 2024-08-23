import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserDetailsForm from './pages/userdeatils';
import { Experience } from './pages/experience';
import Academics from './pages/academics';
import { AddSkillsForm } from './pages/skilldetails';
import { PersonalDetailsForm } from './pages/personaldetails';
import { ImageUpload } from './pages/uploadimage';
import { PreviewResume } from './layouts/previewresume';
import { DownloadPage } from './layouts/downloadresume';
import LoginPage from './layouts/loginpage';
import { AppLayout } from './layouts/applayout';


const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="/user-form" element={<UserDetailsForm />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/skills" element={<AddSkillsForm />} />
        <Route path="/personal-details" element={<PersonalDetailsForm />} />
        <Route path="/upload-image" element={<ImageUpload />} />
        <Route path="/preview-resume" element={<PreviewResume />} />
        <Route path="/download-page" element={<DownloadPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  </Router>
);

export default App;
