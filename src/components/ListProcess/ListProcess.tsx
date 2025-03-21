import axios from "axios";
import { useEffect, useState } from "react";
import Tooltip from "../Tooltip/Tooltip";
import { ResponseAllProcesso, SubprocessoDto } from "../../types/ResponseAllProcesso";
import { useNavigate, useParams } from "react-router-dom";
import mermaid from "mermaid";
import './ListProcess.css';

mermaid.initialize({
  startOnLoad: true,
});

const ListProcess = () => {
  const { id } = useParams();
  const [diagram, setDiagram] = useState('');
  const [processos, setProcessos] = useState<ResponseAllProcesso[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoverId, setHoverId] = useState<number | null>(null);

  const navigate = useNavigate();
  
  useEffect(() => {
    const carregarProcessos = async () => {

      try {
        const response = await axios.get<ResponseAllProcesso[]>(`http://localhost:5174/api/processos/${id}`);
        console.log(response.data)
        setProcessos(response.data)
      }
      catch(err) {
        setError('Erro ao buscar processos!')
        console.error('Erro ao buscar processos:', err)
      }
      finally {
        setLoading(false);
      }
    }

    carregarProcessos();
  }, []);
  useEffect(() => {
    mermaid.contentLoaded();
  })

  interface SubprocessoDto {
    id: string;
    nome: string;
    subprocessos?: SubprocessoDto[];
  }
  
  const generateMermaidDiagram = (subprocessos: SubprocessoDto[], processoPrincipal: { id: string, nome: string }): string => {
    // Configurações de estilo e direção
    let diagram = '%%{init: { "theme": "default", "flowchart": { "useMaxWidth": true, "htmlLabels": true }} }%%\n';
    diagram += 'graph TD\n';
  
    // Adiciona o processo principal com cor diferenciada
    diagram += `  ProcessoPrincipal[${processoPrincipal.nome}]\n`;
    diagram += `  style ProcessoPrincipal fill:#3f10a1,stroke:#444,color:white\n`;
  
    // Função recursiva para subprocessos
    const addSubprocessos = (subs: SubprocessoDto[], parentId: string = "ProcessoPrincipal") => {
      subs.forEach(sub => {
        const nodeId = `Sub${sub.id}`;
        
        // Conecta ao pai (processo principal ou subprocesso pai)
        diagram += `  ${parentId} --> ${nodeId}\n`;
        
        // Adiciona o nó
        diagram += `  ${nodeId}[${sub.nome}]\n`;
        
        // Chama recursivamente para subprocessos filhos
        if (sub.subprocessos) {
          addSubprocessos(sub.subprocessos, nodeId);
        }
      });
    };
  
    addSubprocessos(subprocessos);
    return diagram;
  };

  const handleExcluir = async (id: number) => {
    const originalData = processos;
    try {
      
      setProcessos(prev => prev.filter(proce => proce.processoId !== id));

      await axios.delete(`http://localhost:5174/api/processos/${id}`);
      
    } catch (err) {
      setProcessos(originalData);
      setError('Erro ao excluir processo!');
    }
  };

  return (
    <div className="list-process-container">
      <h1>Processos</h1>

      <div className="list-process-wrapper">
        {processos.map(processo => (
          <div key={processo.processoId} className="list-item">
            <div
              className="wraper-h2-butoes"
              onMouseEnter={() => setHoverId(processo.processoId)}
              onMouseLeave={() => setHoverId(null)}
            >
              <h2>{processo.nome}</h2>
              {(hoverId === processo.processoId) && (
                <div className="botoes-acao">
                  <button
                    onClick={() => navigate(`/processos/form/${id}/${processo.processoId}`)}
                    className="editar-btn"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleExcluir(processo.processoId)}
                    className="excluir-btn"
                  >
                    Excluir{/* {processingIds.includes(depto.id) ? 'Excluindo...' : 'Excluir'} */}
                  </button>
                </div>
              )}
            </div>
            <Tooltip text={processo}>
            {
              <div className="mermaid mermaid-container" 
              style={{ minWidth: processo.subprocessos.length < 3 ? '200px' : '60vw', 
                  }}>
                  {generateMermaidDiagram(processo.subprocessos, {id: processo.processoId.toString() , nome: processo.nome})}
              </div>
              
            
            }
            </Tooltip>
          </div>
        ))} 
        <div className="wrapper-button-add">
          <button onClick={() => navigate(`/processos/form/${id}`)}>Adicionar</button>
        </div>
      </div>
    </div>
  )
}

export default ListProcess;