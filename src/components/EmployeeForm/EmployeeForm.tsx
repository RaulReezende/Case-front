import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EmployeeForm.css';

interface EmployeeFormData {
  nome: string;
  cargo: string;
  email: string;
}

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<EmployeeFormData>({
    nome: '',
    cargo: '',
    email: '',
  });
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchEmployee = async () => {
        try {
          const response = await axios.get(`http://localhost:5174/api/responsaveis/getresponsavel/${id}`);
          console.log(response.data)
          setFormData(response.data);
        } catch (err) {
          setError('Responsáveis não encontrado');
        } finally {
          setLoading(false);
        }
      };
      fetchEmployee();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:5174/api/responsaveis/${id}`, formData);
      } else {
        await axios.post('http://localhost:5174/api/responsaveis', formData);
      }
      navigate('/responsaveis');
    } catch (err) {
      setError('Erro ao salvar responsável');
      console.error(err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="employee-form-container">
      <h2>{id ? 'Editar' : 'Novo'} Responsável</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Cargo:</label>
          <input
            type="text"
            name="cargo"
            value={formData.cargo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>


        <div className="form-actions">
          <button type="button" onClick={() => navigate('/responsaveis')}>
            Cancelar
          </button>
          <button type="submit">
            {id ? 'Salvar Alterações' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;