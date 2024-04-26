import { Link } from 'react-router-dom'; // Import Link for routing

interface NavLink {
  path: string;
  label: string;
}

const navigationLinks: NavLink[] = [
  { path: '/', label: 'Início' },
  { path: '/cadastrar-denuncia', label: 'Cadastre sua Denúncia' },
  { path: '/ver-denuncias', label: 'Veja as Denúncias' },
];
