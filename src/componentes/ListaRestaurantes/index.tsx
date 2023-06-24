import React, { useEffect, useState } from 'react';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
import axios, { AxiosRequestConfig } from 'axios';
import { IPaginacao } from '../../interfaces/IPaginacao';
import { Button, TextField } from '@mui/material';

interface IParametrosBusca {
  ordering?: string,
  search?: string
}

const ListaRestaurantes = () => {

  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState('');
  const [retornaPagina, setRetornaPagina] = useState('');
  const [busca, setBusca] = useState('');

  const carregarDados = (url: string, opcoes: AxiosRequestConfig = {}) => {
    axios.get<IPaginacao<IRestaurante>>(url, opcoes)
    .then(response => {
      setRestaurantes(response.data.results)
      setProximaPagina(response.data.next)
      setRetornaPagina(response.data.previous)
    })
    .catch(erro => {
      console.log(erro)
    })
  }

  const buscar = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    const opcoes = {
      params: {

      } as IParametrosBusca
    }
    if (busca) {
      opcoes.params.search = busca;
    }
    carregarDados('http://localhost:8000/api/v1/restaurantes/', opcoes);
  }

  useEffect(() => {
    // obter restaurantes
    carregarDados('http://localhost:8000/api/v1/restaurantes/')
  }, [])

  return (<section className={style.ListaRestaurantes}>
    <h1>Os restaurantes mais <em>bacanas</em>!</h1>
    <form onSubmit={buscar}>
      <TextField
      value={busca}
      onChange={evento => setBusca(evento.target.value)}
      label='Digite para buscar'
      variant="standard">
      </TextField>
      <Button type='submit' variant='outlined'>Buscar</Button>
    </form>
    {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}
    {<button onClick={() => carregarDados(retornaPagina)} disabled={!retornaPagina}>
      Página anterior
    </button>}
    {<button onClick={() => carregarDados(proximaPagina)} disabled={!proximaPagina}>
      Próxima página
    </button>}
  </section>)
}

export default ListaRestaurantes