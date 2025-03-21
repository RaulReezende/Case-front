
export interface ResponseAllProcesso {
  processoId: number;
  nome: string;
  ferramentas: FerramentasDto[];
  responsaveis: Responsaveis;
  documentacoes: DocumentacoesDto[];
  subprocessos: SubprocessoDto[];
}

export interface SubprocessoDto {
  id: string;
  nome: string;
  subprocessos: SubprocessoDto[];
}

export interface Responsaveis {
  responsavelId: number;
  nome: string;
}

export interface FerramentasDto {
  ferramentaId: number;
  nome: string;
}

export interface DocumentacoesDto {
  documentacaoId: number;
  nome: string;
}