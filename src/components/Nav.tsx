import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const NavLinks = () => {
    return (
        <>
            <NavLink to="/cadastrarDenuncia"> Cadastrar Denúncia </NavLink>
            <NavLink to="/visualizarDenuncias"> Visualizar Denúncias </NavLink>
            <NavLink to="/sobre"> Sobre </NavLink>
        </>
    )
}

const Nav = () => {

    const [isOpen, setIsOpen] = useState(false);
    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    }

    return (
        <>
        <nav className="flex w-1/3 justify-end">
            <div className="hidden w-full justify-between md:flex">
                <NavLinks/>
            </div>
            <div className="md:hidden">
                <button onClick={toggleNavbar}>
                    {isOpen ? <X/> : <Menu/>}
                </button>
            </div>
        </nav>
        {isOpen && (
            <div className="flex flex-col items-center basis-full">

            </div>
        )}
        </>
    )
}

export default Nav;