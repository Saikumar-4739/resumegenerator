import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './layouts/loginpage';
import { AppLayout } from './layouts/applayout';
import { AddAcademicsForm } from './pages/academics';
import { AddSkillsForm } from './pages/skilldetails';
import { PersonalDetailsForm } from './pages/personaldetails';
import { PreviewResume } from './layouts/previewresume';
import { DownloadPage } from './layouts/downloadresume';
import { Experience } from './pages/experience';
import { UserDetailsForm } from './pages/userdeatils';


const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<AppLayout />}>
        <Route path="user-form" element={<UserDetailsForm />} />
        <Route path="experience" element={<Experience />} />
        <Route path="academics" element={<AddAcademicsForm />} />
        <Route path="skills" element={<AddSkillsForm />} />
        <Route path="personal-details" element={<PersonalDetailsForm />} />
        <Route path="preview-resume" element={<PreviewResume />} />
        <Route path="download-page" element={<DownloadPage />} />
      </Route>
    </Routes>
  </Router>
);


export default App;
