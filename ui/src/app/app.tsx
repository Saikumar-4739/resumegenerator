// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Experience } from './pages/experience';
import Academics from './pages/academics';
import { AddSkillsForm } from './pages/skilldetails';
import { PersonalDetailsForm } from './pages/personaldetails';
import { ImageUpload } from './pages/uploadimage';
import { PreviewResume } from './layouts/previewresume';
import { DownloadPage } from './layouts/downloadresume';
import LoginPage from './layouts/loginpage';
import { AuthProvider } from './layouts/authentication';
import { AppLayout } from './layouts/applayout';
import UserDetailsForm from './pages/userdeatils';
import ProtectedRoute from './layouts/protectroute';

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      
    <ProtectedRoute />
      <Routes>
            <Route path="/login" element={<LoginPage />} />
            {/* <Route element={<ProtectedRoute />}> */}
            <Route path="/" element={<AppLayout />}>
              <Route path="/user-form" element={<UserDetailsForm />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/academics" element={<Academics />} />
              <Route path="/skills" element={<AddSkillsForm />} />
              <Route path="/personal-details" element={<PersonalDetailsForm />} />
              <Route path="/image" element={<ImageUpload />} />
              <Route path="/preview-resume" element={<PreviewResume />} />
              <Route path="/download-page" element={<DownloadPage />} />
              <Route path="*" element={<Navigate to="/user-form" />} /> 
            </Route>
            {/* </Route>
        <Route path="*" element={<Navigate to="/login" />} /> */}
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
