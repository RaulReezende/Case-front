import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Process {
  id: string;
  nome: string;
  subprocesses: Process[];
}

interface SubprocessFormProps {
  initialProcesses: Process[];
}

const SubprocessForm: React.FC<SubprocessFormProps> = ({  initialProcesses  }) => {
  const [processes, setProcesses] = useState<Process[]>(initialProcesses);

  const handleAddSubprocess = (parentPath: number[] | null = null) => {
    const newProcess: Process = {
      id: uuidv4(), // Gera ID único
      nome: '',
      subprocesses: [],
    };

    setProcesses((prevProcesses) => {
      const updatedProcesses = JSON.parse(JSON.stringify(prevProcesses));
      
      if (parentPath === null) {
        return [...updatedProcesses, newProcess];
      }

      let currentLevel = updatedProcesses;
      for (const index of parentPath) {
        currentLevel = currentLevel[index].subprocesses;
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
        currentLevel = currentLevel[path[i]].subprocesses;
      }
      
      const finalIndex = path[path.length - 1];
      currentLevel[finalIndex].nome = value;
      
      return updatedProcesses;
    });
  };


const handleDeleteSubprocess = (processId: string) => {
  setProcesses((prevProcesses) => {

    const deleteRecursively = (processList: Process[]): Process[] => {
      return processList
        .filter(process => process.id !== processId)
        .map(process => ({
          ...process,
          subprocesses: deleteRecursively(process.subprocesses)
        }));
    };

    const updatedProcesses = deleteRecursively(prevProcesses);
    return updatedProcesses;
  });
};

  const renderProcesses = (currentProcesses: Process[], parentPath: number[] = []) => {
  return currentProcesses.map((process, index) => {
  const currentPath = [...parentPath, index];
  return (
    <div 
      key={process.id}
      style={{ marginLeft: parentPath.length * 20, marginBottom: '10px', position: 'relative' }}
    >
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          value={process.nome}
          onChange={(e) => handleInputChange(currentPath, e.target.value)}
          placeholder="Nome do processo"
        />
        <button 
          onClick={() => handleAddSubprocess(currentPath)}
          className="add-button"
        >
          ➕ Sub
        </button>
        <button 
          onClick={() => handleDeleteSubprocess(process.id)}
          className="delete-button"
        >
          🗑️
        </button>
      </div>
      {renderProcesses(process.subprocesses, currentPath)}
    </div>
  );
  });
  };

  const handleSubmit = () => {
    console.log('Processos para enviar:', processes);
  };

  // Adicionar estilos CSS (pode ser em um arquivo separado)
  const styles = `
    .add-button {
      background-color: #4CAF50;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
    }

    .delete-button {
      background-color: #ff4444;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
    }

    .delete-button:hover {
      background-color: #cc0000;
    }

    .add-button:hover {
      background-color: #45a049;
    }
  `;
  return (
    
    <div style={{ padding: '20px' }}>
      <style>{styles}</style>
      {renderProcesses(processes)}
      <button 
        onClick={() => handleAddSubprocess()}
        style={{ marginTop: '20px' }}
      >
        Adicionar Processo Raiz
      </button>
      <button onClick={handleSubmit} style={{ marginLeft: '10px' }}>
        Enviar
      </button>
    </div>
  );
};

export default SubprocessForm;