import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmployeeList.css';

interface Employee {
  id: number;
  nome: string;
  cargo: string;
  email: string;
}

const EmployeeList = () => {
  const [responsaveis, setResponsaveis] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5174/api/responsaveis');
        setResponsaveis(response.data);
      } catch (err) {
        setError('Erro ao carregar funcionários');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      try {
        await axios.delete(`http://localhost:5174/api/responsaveis/${id}`);
        setResponsaveis(responsaveis.filter(emp => emp.id !== id));
      } catch (err) {
        console.error('Erro ao excluir:', err);
        alert('Erro ao excluir funcionário');
      }
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="employee-list-container">
      <div className="header">
        <h2>Responsáveis</h2>
        
      </div>
      
      <div className="employee-list">
        {responsaveis.map(responsavel => (
          <div key={responsavel.id} className="employee-item">
            <div className="info">
              <h3>{responsavel.nome}</h3>
              <p>{responsavel.cargo}</p>
              <p>{responsavel.email}</p>
            </div>
            <div className="actions">
              <button 
                className="edit-btn"
                onClick={() => navigate(`/responsaveis/editar/${responsavel.id}`)}
              >
                ✏️
              </button>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(responsavel.id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="add-button" onClick={() => navigate('/responsaveis/add')}>
          +
        </button>
    </div>
  );
};

export default EmployeeList;