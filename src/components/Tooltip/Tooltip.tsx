import React from 'react';
import './style.css'; 
import { ResponseAllProcesso } from '../../types/ResponseAllProcesso';

const Tooltip: React.FC<{ text: ResponseAllProcesso, children: React.ReactNode }> = ({ text, children }) => {

  return (
    <div className='tooltip-wrapper'>
      <div  className="tooltip-container">
        {children}
          <div className="tooltip">
            <p><b>Ferramentas: </b><span>{text.ferramentas.map(ferramenta => ferramenta.nome).join(', ')}</span></p>
            <p><b>Responsável: </b><a href={`/equipes/editar/${text.responsaveis.responsavelId}`}>{text.responsaveis.nome}</a></p>
            <p><b>Documentação: </b><span>{text.documentacoes.map(doc => doc.nome).join(', ')}</span></p>
            
          </div>
      </div>
    </div>
  );
};

export default Tooltip;