import logo from '../images/logo.svg';
import React from 'react';
import {Link} from 'react-router-dom';


function Header ({email, setEmail, location}) {
    const [path, setPath] = React.useState({link: '', text: ''});
    React.useEffect(() => {
        checkLocation();
      }, [location.pathname])

    function signOut(){
        if (location.pathname!== '/') {
            return
        }
        localStorage.removeItem('token');
        setEmail('')
        console.log(location)
  }

    function checkLocation() {
        if (location.pathname === '/sign-in') {
            setPath({link: '/sign-up', text:'Регистрация'})
        } else if (location.pathname === '/sign-up') {
            setPath({link: '/sign-in', text:'Вход'})
        } else {
            setPath({link: '/sign-in', text:'Выйти'})
        }
    }

    return (
        <header className="header">
            <img src={logo} alt="Логотип" className="header__logo"/>
            <p className="header__email">{email}</p>
            <Link to={path.link} onClick={signOut} className="header__link">{path.text}</Link>
        </header>
    )
}

export default Header;