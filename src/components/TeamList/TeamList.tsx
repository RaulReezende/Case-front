// TeamList.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './team-list.css';

interface Team {
  id: number;
  nome: string;
}

const TeamList = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('http://localhost:5174/api/Equipes');
        if (!response.ok) throw new Error('Erro ao carregar equipes');
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        setError('Erro ao carregar lista de equipes');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleDelete = async (teamId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta equipe?')) {
      try {
        const response = await fetch(`http://localhost:5174/api/equipes/${teamId}`, { 
          method: 'DELETE' 
        });
        
        if (!response.ok) throw new Error('Erro ao excluir equipe');
        
        setTeams(teams.filter(team => team.id !== teamId));
      } catch (error) {
        console.error('Erro ao excluir equipe:', error);
        alert('Erro ao excluir equipe');
      }
    }
  };

  const navigateToAdd = () => {
    navigate('/equipes/add');
  };

  const navigateToEdit = (teamId: number) => {
    navigate(`/equipes/editar/${teamId}`);
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="team-list-container">
      <div className="team-list">
        {teams.map(team => (
          <TeamItem
            key={team.id}
            team={team}
            onDelete={handleDelete}
            onEdit={navigateToEdit}
          />
        ))}
      </div>
      <button className="add-button" onClick={navigateToAdd}>
        +
      </button>
    </div>
  );
};

interface TeamItemProps {
  team: Team;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const TeamItem = ({ team, onDelete, onEdit }: TeamItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="team-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span>{team.nome}</span>
      <div className={`actions ${isHovered ? 'visible' : ''}`}>
        <button className="edit-btn" onClick={() => onEdit(team.id)}>
          Editar
        </button>
        <button className="delete-btn" onClick={() => onDelete(team.id)}>
          Excluir
        </button>
      </div>
    </div>
  );
};

export default TeamList;