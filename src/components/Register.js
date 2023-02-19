import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import useForm from '../hooks/useForm';
import Form from './Form';
import * as auth from '../utils/auth'

const Register = ({handleInfoTooltipOpen, handleToolTipStatus}) => {
    const {values, handleChange} = useForm({});
    const navigate = useNavigate();


    const handleSubmit = (e) => {
      e.preventDefault();
      const {password, email} = values;
      auth.register(password, email)
      .then((res) => {
        navigate('/sign-in', {replace: true});
        handleToolTipStatus('ok');
        handleInfoTooltipOpen(true);
        })
      .catch(err => console.log(err));
    }

    return (
      <Form title='Регистрация'  buttonText='Зарегестрироваться' values={values} onSubmit={handleSubmit}  onChange={handleChange}>        
        <Link to="/sign-in" className="form__link">Уже зарегистрированы? Войти</Link>
      </Form>
      )
}

export default Register;