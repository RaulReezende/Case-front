
import '../index.css';
const Home: React.FC = () => {

  return (
    <div>
      <h1>Home Page</h1>
      <h3 style={{textAlign: 'center'}}>Páginas para navegação</h3>

      <div className="edit-container">
        <a href='/departamentos' >
          Departamentos
        </a>
      </div>

      <div className="edit-container">
        <a href='/equipes' >
          Equipes
        </a>
      </div>

      <div className="edit-container">
        <a href='/responsaveis' >
          Responsáveis
        </a>
      </div>
      {/* <ListaDepartamentos /> */}
    </div>
  );
};

export default Home;