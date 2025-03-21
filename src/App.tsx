
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import TeamListPage from './pages/Teams/TeamListPage';
import TeamAddPage from './pages/Teams/TeamAddPage';
import TeamEditPage from './pages/Teams/TeamEditPage';
import EmployeeList from './components/EmployeeList/EmployeeList';
import EmployeeForm from './components/EmployeeForm/EmployeeForm';
import ListProcessPage from './pages/Process/ListProcess';
import ProcessAddPage from './pages/Process/ProcessAdd';
import DepartamentoPage from './pages/DepartamentoPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />

      <Route path="/departamentos" element={<DepartamentoPage />} />

      <Route path="/processos/:id" element={<ListProcessPage />} />
      <Route path="/processos/form/:departamentoId/:processoId?" element={<ProcessAddPage />} />

      <Route path="/equipes" element={<TeamListPage />} />
      <Route path="/equipes/add" element={<TeamAddPage />} />
      <Route path="/equipes/editar/:id" element={<TeamEditPage />} />

      <Route path="/responsaveis" element={<EmployeeList />} />
      <Route path="/responsaveis/add" element={<EmployeeForm />} />
      <Route path="/responsaveis/editar/:id" element={<EmployeeForm />} />
    </Routes>
  );
};

export default App;