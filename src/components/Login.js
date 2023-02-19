import React from 'react';
import {useNavigate} from 'react-router-dom';
import Form from './Form'
import useForm from '../hooks/useForm';
import * as auth from '../utils/auth'


const Login = ({handleLogin, handleToolTipStatus, handleInfoTooltipOpen}) => {
  const {values, handleChange, setValues} = useForm({});
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();
    auth.authorize(values.password, values.email)
      .then((data) => {
        if (data.token){
          setValues({password: '', email: ''});
          handleLogin();
          navigate('/', {replace: true});
      }
      })
      .catch(err => {
        handleToolTipStatus('error')
        handleInfoTooltipOpen()
      } );
  }

  return (
    <Form title='Вход'  buttonText='Войти' values={values} onSubmit={handleSubmit}  onChange={handleChange}/>        
    )
}

export default Login;