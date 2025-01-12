import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import http from "../../../../http";
import ITag from "../../../../interfaces/ITag";
import IRestaurante from "../../../../interfaces/IRestaurante";
import { formatDiagnosticsWithColorAndContext } from "typescript";


const FormularioPrato = () => {

    const [nomePrato, setNomePrato] = useState('');
    const [descricao, setDescricao] = useState('');
    
    const [tags, setTags] = useState<ITag[]>([]);
    const [tag, setTag] = useState('');

    const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
    const [restaurante, setRestaurante] = useState('');

    const [imagem, setImagem] = useState<File | null>(null);
 
    useEffect(() => {
        http.get< { tags: ITag[] } >('tags/')
            .then(response => {
                setTags(response.data.tags);
        http.get<IRestaurante[]>('restaurantes/')
            .then(response => {
                setRestaurantes(response.data)
            })
            })
    }, [])

    const selecionarArquivo = (evento: React.ChangeEvent<HTMLInputElement>) => {
        if (evento.target.files?.length) {
            setImagem(evento.target.files[0]);
        } else {
            setImagem(null);
        }
    }

    const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
        evento.preventDefault() // isso impede o comportamento de recarregar a página como comportamento default.

        const formData = new FormData();

        formData.append('nome', nomePrato);
        formData.append('descricao', descricao);
        formData.append('tag', tag);
        formData.append('restaurante', restaurante);

        if (imagem) {
            formData.append('imagem', imagem);
        }

        http.request({
            url: 'pratos/',
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        })
            .then(() => {
                setNomePrato('');
                setDescricao('');
                setTag('');
                setRestaurante('');
                alert('Prato cadastrado com sucesso')
            })
            .catch(erro => {
                console.log(erro)
            })
    }

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
                <Typography component={"h1"} variant="h6">Formulário de pratos</Typography>
                <Box component={"form"} sx={{ width: '100%' }} onSubmit={aoSubmeterForm}>
                    <TextField
                        value={nomePrato}
                        onChange={evento => setNomePrato(evento.target.value)}
                        label="Nome do Prato"
                        variant="standard"
                        fullWidth
                        required
                        margin="dense" />
                    <TextField
                        value={descricao}
                        onChange={evento => setDescricao(evento.target.value)}
                        label="Descrição"
                        variant="standard"
                        fullWidth
                        required
                        margin="dense" />
                    <FormControl margin="dense" fullWidth>
                        <InputLabel id="select-tag">Tag</InputLabel>
                            <Select labelId="select-tag" value={tag} onChange={evento => setTag(evento.target.value)}>
                                {tags.map(tag =>(
                                    <MenuItem key={tag.id} value={tag.value}>
                                        {tag.value}
                                    </MenuItem>)
                                )}
                            </Select>
                    </FormControl>
                    <FormControl margin="dense" fullWidth>
                        <InputLabel id="select-restaurante">Restaurante</InputLabel>
                            <Select labelId="select-restauramte" value={restaurante} onChange={evento => setRestaurante(evento.target.value)}>
                                {restaurantes.map(restaurante =>(
                                    <MenuItem key={restaurante.id} value={restaurante.id}>
                                        {restaurante.nome}
                                    </MenuItem>)
                                )}
                            </Select>
                    </FormControl>

                    <input type="file" onChange={selecionarArquivo}></input>

                    <Button sx={{ marginTop: 1 }} type="submit" fullWidth variant="outlined">Salvar</Button>
                </Box>
            </Box>
        </>
    )
}

export default FormularioPrato