// EditTeamForm.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import '../TeamAdd/TeamForm.css'; // Reutilize o mesmo CSS

interface Employee {
  id: number;
  nome: string;
}

interface TeamDetails {
  id: number;
  nome: string;
  responsaveis: Employee[];
}

const EditTeamForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [teamDetails, setTeamDetails] = useState<TeamDetails | null>(null);
  const [formData, setFormData] = useState({
    teamName: '',
    selectedMembers: [] as number[]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamResponse, employeesResponse] = await Promise.all([
          axios.get<TeamDetails>(`http://localhost:5174/api/equipes/${id}`),
          axios.get<Employee[]>('http://localhost:5174/api/responsaveis')
        ]);

        setTeamDetails(teamResponse.data);
        const allEmployees = [
          ...(employeesResponse.data || []),
          ...(teamResponse.data.responsaveis || [])
        ] as Employee[];

        setEmployees(allEmployees);
        setFormData({
          teamName: teamResponse.data.nome,
          selectedMembers: teamResponse.data.responsaveis.map(m => m.id)
        });
      } catch (err) {
        setError('Erro ao carregar dados da equipe');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5174/api/equipes/${id}`, {
        nome: formData.teamName,
        responsaveis: formData.selectedMembers
      });
      navigate('/equipes');
    } catch (err) {
      console.error('Erro ao atualizar equipe:', err);
      setError('Erro ao salvar alterações');
    }
  };

  const handleSelectChange = (selectedOptions: any) => {
    setFormData({
      ...formData,
      selectedMembers: selectedOptions.map((option: any) => option.value)
    });
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!teamDetails) return <div>Equipe não encontrada</div>;

  const options = employees.map(employee => ({
    value: employee.id,
    label: employee.nome
  }));

  const defaultValues = employees.filter(employee => 
    formData.selectedMembers.includes(employee.id)
  ).map(employee => ({
    value: employee.id,
    label: employee.nome
  }));

  return (
    <div className="team-form-container">
      <h2>Editar Equipe</h2>
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
          <label>Membros da Equipe:</label>
          <Select
            isMulti
            options={options}
            value={defaultValues}
            onChange={handleSelectChange}
            className="multi-select"
            classNamePrefix="select"
            placeholder="Selecione os membros..."
            noOptionsMessage={() => "Nenhum funcionário disponível"}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/equipes')}>
            Cancelar
          </button>
          <button type="submit">Salvar Alterações</button>
        </div>
      </form>
    </div>
  );
};

export default EditTeamForm;