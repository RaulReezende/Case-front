import { useState, useEffect } from 'react';
import axios from 'axios';
import './DepartList.css';
import { useNavigate } from 'react-router-dom';

interface Departamento {
  id: string;
  nome: string;
}

const ListaDepartamentos = () => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [novoNome, setNovoNome] = useState('');
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [novoDepartamento, setNovoDepartamento] = useState('');
  const [criando, setCriando] = useState(false);

  const navigate = useNavigate();

  
  useEffect(() => {
    const carregarDepartamentos = async () => {
      try {
        const response = await axios.get<Departamento[]>('http://localhost:5174/api/departamentos');
        setDepartamentos(response.data);
      } catch (err) {
        setError('Erro ao carregar departamentos');
      } finally {
        setLoading(false);
      }
    };

    carregarDepartamentos();
  }, []);

  const handleCriarDepartamento = async () => {
    if (!novoDepartamento.trim()) {
      setError('Nome do departamento é obrigatório');
      return;
    }

    try {
      setCriando(true);
      setError('');
      
      const response = await axios.post<Departamento>('http://localhost:5174/api/departamentos', {
        nome: novoDepartamento.trim()
      });

      setDepartamentos(prev => [...prev, response.data]);
      setNovoDepartamento('');
    } catch (err) {
      setError('Erro ao criar departamento');
    } finally {
      setCriando(false);
    }
  };

  const handleEditar = (id: string, nomeAtual: string) => {
    setEditandoId(id);
    setNovoNome(nomeAtual);
    setHoverId(null);
  };

  const handleConfirmarEdicao = async (id: string) => {
    const originalData = departamentos;
    try {
      setProcessingIds(prev => [...prev, id]);
      
      setDepartamentos(prev =>
        prev.map(depto => depto.id === id ? { ...depto, nome: novoNome } : depto)
      );

      await axios.put(`http://localhost:5174/api/departamentos/`, { nome: novoNome, id: id });
      
    } catch (err) {
      setDepartamentos(originalData);
      setError('Erro ao atualizar departamento');
    } finally {
      setProcessingIds(prev => prev.filter(pid => pid !== id));
      setEditandoId(null);
      setNovoNome('');
    }
  };

  const handleExcluir = async (id: string) => {
    const originalData = departamentos;
    try {
      setProcessingIds(prev => [...prev, id]);
      
      setDepartamentos(prev => prev.filter(depto => depto.id !== id));

      await axios.delete(`http://localhost:5174/api/departamentos/${id}`);
      
    } catch (err) {
      setDepartamentos(originalData);
      setError('Erro ao excluir departamento');
    } finally {
      setProcessingIds(prev => prev.filter(pid => pid !== id));
    }
  };

  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="lista-departamentos">
      <div className="form-criacao">
        <input
          type="text"
          value={novoDepartamento}
          onChange={(e) => setNovoDepartamento(e.target.value)}
          placeholder="Novo departamento"
          disabled={criando}
        />
        <button
          onClick={handleCriarDepartamento}
          disabled={criando || !novoDepartamento.trim()}
          className="criar-btn"
        >
          {criando ? 'Adicionando...' : 'Adicionar'}
        </button>
      </div>

      {departamentos.map(depto => (
        <div
          key={depto.id}
          className="departamento-item"
          onMouseEnter={() => setHoverId(depto.id)}
          onMouseLeave={() => setHoverId(null)}
        >
          {editandoId === depto.id ? (
            <div className="edit-container">
              <input
                type="text"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                className="edit-input"
                autoFocus
                disabled={processingIds.includes(depto.id)}
              />
              <button
                onClick={() => handleConfirmarEdicao(depto.id)}
                className="confirmar-btn"
                disabled={processingIds.includes(depto.id)}
              >
                {processingIds.includes(depto.id) ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          ) : (
            <div className="content-container">
              <a href={`/processos/${depto.id}`} className="departamento-nome">{depto.nome}</a>
              {(hoverId === depto.id) && (
                <div className="botoes-acao">
                  <button
                    onClick={() => handleEditar(depto.id, depto.nome)}
                    className="editar-btn"
                    disabled={processingIds.includes(depto.id)}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleExcluir(depto.id)}
                    className="excluir-btn"
                    disabled={processingIds.includes(depto.id)}
                  >
                    {processingIds.includes(depto.id) ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ListaDepartamentos;