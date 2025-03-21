// TeamForm.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import './TeamForm.css';

interface Employee {
  id: number;
  nome: string;
}

interface TeamFormData {
  teamName: string;
  members: number[];
}

const TeamForm = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState<TeamFormData>({
    teamName: '',
    members: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get<Employee[]>('http://localhost:5174/api/responsaveis/');
        console.log(response.data)
        setEmployees(response.data);
      } catch (err) {
        setError('Erro ao carregar lista de funcionários');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5174/api/equipes', {
        nome: formData.teamName,
        responsaveis: formData.members
      });
      navigate('/equipes');
    } catch (err) {
      console.error('Erro ao criar equipe:', err);
      setError('Erro ao salvar equipe');
    }
  };

  const handleSelectChange = (selectedOptions: any) => {
    setFormData({
      ...formData,
      members: selectedOptions.map((option: any) => option.value)
    });
  };

  if (loading) return <div>Carregando funcionários...</div>;
  if (error) return <div className="error">{error}</div>;

  const options = employees.map(employee => ({
    value: employee.id,
    label: employee.nome
  }));

  return (
    <div className="team-form-container">
      <h2>Criar Nova Equipe</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="teamName">Nome da Equipe:</label>
          <input
            type="text"
            id="teamName"
            value={formData.teamName}
            onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Selecione os Membros:</label>
          <Select
            isMulti
            options={options}
            onChange={handleSelectChange}
            className="multi-select"
            classNamePrefix="select"
            placeholder="Selecione os funcionários..."
            noOptionsMessage={() => "Nenhum funcionário encontrado"}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/equipes')}>
            Cancelar
          </button>
          <button type="submit">Salvar Equipe</button>
        </div>
      </form>
    </div>
  );
};

export default TeamForm;