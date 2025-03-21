import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ResponseAllProcesso, SubprocessoDto } from '../../types/ResponseAllProcesso';
import './FormProcess.css'
interface Team {
  id: number;
  nome: string;
}


interface Process {
  id: string;
  nome: string;
  tools: string[];
  responsibleTeam: number;
  documents: string[]; // URLs ou identificadores dos arquivos
  subprocesses: SubprocessoDto[];
}

interface ProcessFormData {
  nome: string;
  ferramentas: string[];
  responsaveis: number;
  documentacoes: string[];
  subprocessos: SubprocessoDto[];
}

const ProcessForm = () => {
  const { departamentoId, processoId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProcessFormData>({
    nome: '',
    ferramentas: [],
    responsaveis: 0,
    documentacoes: [],
    subprocessos: []
  });
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processes, setProcesses] = useState<SubprocessoDto[]>([]);
  const [ferramentaInput, setFerramentaInput] = useState('');
  const [docInput, setDocInput] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsResponse, processResponse] = await Promise.all([
          axios.get<Team[]>('http://localhost:5174/api/equipes'),
          processoId ? axios.get<ResponseAllProcesso>(`http://localhost:5174/api/processos/getprocesso/${processoId}`) : Promise.resolve(null)
        ]);

        setTeams(teamsResponse.data);

        if (processResponse?.data) {
          console.log(processResponse.data)
          const { nome, ferramentas, responsaveis, documentacoes, subprocessos } = processResponse.data;
          setFormData({
            nome,
            ferramentas: ferramentas.map(f => f.nome),
            responsaveis: responsaveis.responsavelId,
            documentacoes: documentacoes.map(d => d.nome),
            subprocessos: []
          });

          const alterarId = (subprocessos: SubprocessoDto[]): SubprocessoDto[] => {
            return subprocessos.map(sub => ({
              ...sub,
              id: uuidv4(), // Altera o nome
              subprocessos: alterarId(sub.subprocessos) // Chama a função recursivamente para os subprocessos
            }));
          }

          setProcesses(alterarId(subprocessos))
        }
      } catch (err) {
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };


    
    fetchData();
  }, []);

  const handleToolsChange = () => {
    if (ferramentaInput) {
      setFormData(prev => ({
        ...prev,
        ferramentas: [...prev.ferramentas, ferramentaInput]
      }));
      setFerramentaInput('')
    }
  };

  const handleDocsChange = () => {
    if (docInput) {
      setFormData(prev => ({
        ...prev,
        documentacoes: [...prev.documentacoes, docInput]
      }));
      setDocInput('')
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(processes)
    if (!validateForm()) return;

    try {
      const payload = {
        id: processoId ? Number(processoId) : 0,
        nome: formData.nome,
        departamentoId: Number(departamentoId),
        ferramentas: formData.ferramentas,
        responsaveis: formData.responsaveis,
        subprocessos: JSON.parse(JSON.stringify(processes)),
        documentacoes: formData.documentacoes,
      };
      console.log(payload)
      if (processoId) {
        await axios.put(`http://localhost:5174/api/processos/`, payload);
      } else {
        await axios.post('http://localhost:5174/api/processos', payload);
      }

      navigate(`/processos/${departamentoId}`);
    } catch (err) {
      console.error('Erro ao salvar:', err);
      setError('Erro ao salvar processo');
    }
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.nome.trim()) errors.push('Nome é obrigatório');
    if (formData.ferramentas.length === 0) errors.push('Adicione pelo menos uma ferramenta');
    if (!formData.responsaveis) errors.push('Selecione uma equipe responsável');
    
    if (errors.length > 0) {
      setError(errors.join(', '));
      return false;
    }
    return true;
  };

  const handleSelectChange = (selectedOptions: any) => {
    setFormData({
      ...formData,
      responsaveis: selectedOptions.value
    });
  };

  const handleAddSubprocess = (parentPath: number[] | null = null) => {
    const newProcess: SubprocessoDto = {
      id: uuidv4(), // Gera ID único
      nome: '',
      subprocessos: [],
    };
    setProcesses((prevProcesses) => {
      const updatedProcesses = JSON.parse(JSON.stringify(prevProcesses));
      
      if (parentPath === null) {
        return [...updatedProcesses, newProcess];
      }

      let currentLevel = updatedProcesses;
      for (const index of parentPath) {
        currentLevel = currentLevel[index].subprocessos;
      }
      currentLevel.push(newProcess);

      return updatedProcesses;
    });
  };

  const handleInputChange = (path: number[], value: string) => {
    setProcesses((prevProcesses) => {
      const updatedProcesses = JSON.parse(JSON.stringify(prevProcesses));
      let currentLevel = updatedProcesses;
      
      for (let i = 0; i < path.length - 1; i++) {
        currentLevel = currentLevel[path[i]].subprocessos;
      }
      
      const finalIndex = path[path.length - 1];
      currentLevel[finalIndex].nome = value;
      
      return updatedProcesses;
    });
  };  


  const handleDeleteSubprocess = (processId: string) => {
    console.log(processId)
    setProcesses((prevProcesses) => {

      const deleteRecursively = (processList: SubprocessoDto[]): SubprocessoDto[] => {
        console.log(processList)
        return processList
          .filter(process => process.id !== processId)
          .map(process => ({
            ...process,
            subprocessos: deleteRecursively(process.subprocessos)
          }));
      };

    
      return  deleteRecursively(prevProcesses);
    });
  };

  const renderProcesses = (currentProcesses: SubprocessoDto[], parentPath: number[] = []) => {
  return currentProcesses.map((process, index) => {

  const currentPath = [...parentPath, index];

  return (
    <div 
      key={process.id}
      style={{ marginLeft: parentPath.length * 20,  position: 'relative' }}
    >
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', }}>
        <input
          type="text"
          value={process.nome}
          onChange={(e) => handleInputChange(currentPath, e.target.value)}
          placeholder="Nome do processo"
          style={{ }}
        />
        <button 
          type='button'
          onClick={() => handleAddSubprocess(currentPath)}
        >
          ➕
        </button>
        <button 
          type='button'
          onClick={() => handleDeleteSubprocess(process.id)}
        >
          ✖️
        </button>
      </div>
      {renderProcesses(process.subprocessos, currentPath)}
    </div>
  );
  });
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Ocorreu algum erro...</div>;

  const optionsTeams = teams.map(team => ({
    value: team.id,
    label: team.nome
  }))

  const defaultValues = teams.filter(time => formData.responsaveis == time.id).map(time => ({
    value: time.id,
    label: time.nome
  }))
  
  return (
    <div className="process-form-wrapper">
      <div className="process-form-container">
        <h2 style={{textAlign: 'center'}}>{processoId ? 'Editar' : 'Novo'} Processo</h2>

        <form onSubmit={handleSubmit}>
          {/* Campo Nome */}
          <div className="form-group">
            <label>Nome do Processo *</label>
            <input
              type="text"
              value={formData.nome}
              onChange={e => setFormData(prev => ({...prev, nome: e.target.value}))}
              required
            />
          </div>

          {/* Lista de Ferramentas */}
          <div className="form-group">
            <label>Ferramentas *</label>
            <div className='wrapper-input-button'>
              <input
                type="text"
                value={ferramentaInput}
                onChange={e => setFerramentaInput(e.target.value)}
                placeholder="Digite a ferramenta"
              />
              <button type='button' onClick={() => handleToolsChange()}>➕</button>
            </div>
            <div className="tags-container">
              {formData.ferramentas.map((tool, index) => (
                <span key={index} className="tag">
                  {tool}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      ferramentas: prev.ferramentas.filter((_, i) => i !== index)
                    }))}
                  >
                    ✖️
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Equipe Responsável */}
          <div className="form-group">
            <label>Equipe Responsável *</label>
            <Select
              options={optionsTeams}
              value={defaultValues}
              onChange={handleSelectChange}
              placeholder="Selecione..."
              noOptionsMessage={() => "Nenhum funcionário disponível"}
            />
          </div>

          {/* Documentos */}
          <div className="form-group">
            <label>Documentação</label>
            <div className='wrapper-input-button'>
              <input
                type="text"
                value={docInput}
                onChange={e => setDocInput(e.target.value)}
                placeholder="Digite a documentação"
                />
                <button type='button' onClick={() => handleDocsChange()}>➕</button>
            </div>
            <div className="files-list">
              {/* Documentos existentes */}
              <div className="tags-container">
              {formData.documentacoes.map((tool, index) => (
                <span key={index} className="tag">
                  {tool}
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      documentacoes: prev.documentacoes.filter((_, i) => i !== index)
                    }))}
                  >
                    ✖️
                  </button>
                </span>
              ))}
            </div>
            </div>
          </div>

          <div>
            <h3>Subrocessos</h3>
            {renderProcesses(processes)}
            <button 
              type='button'
              onClick={() => handleAddSubprocess()}
              style={{ marginTop: '20px' }}
            >
              Adicionar Subprocesso
            </button>
            
          </div>

          <div className="form-actions">
            <button type="button" className='cancel-button-process' onClick={() => navigate(`/processos/${departamentoId}`)}>
              Cancelar
            </button>
            <button type="submit">
              {processoId ? 'Salvar Alterações' : 'Criar Processo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProcessForm;
