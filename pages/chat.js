import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import {useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)


function escutaMensagensEmTempoReal(adicionaMensagem){
    return supabaseClient
    .from('mensagens')
    .on('INSERT', (respostaLive) => {
        adicionaMensagem(respostaLive.new);
    })
    .subscribe();
}

export default function ChatPage() {
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username;
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
    
    React.useEffect( () => {
        supabaseClient
        .from('mensagens')
        .select('*')
        .order('id', {ascending: false})
        .then(({data}) => {
        console.log('dadosDaConsulta', data);
        setListaDeMensagens(data);
            });
            escutaMensagensEmTempoReal((novaMensagem) => {
                    console.log('Criando mensagem', novaMensagem);
            setListaDeMensagens((valorAtualDaLista) => {
                return [
                    novaMensagem,
                    ...valorAtualDaLista,
                ]
            });
            });
    }, []);
    
   

    //Regras de negócio de um chat
    /*
    1. Usuário digita no input "textarea"
    2. Usuário pressiona tecla enter para enviar
    3. As mensagens trocadas são listadas e exibidas na tela

    Tarefas de Dev:
    1. Criar um componente para o input de texto
    2. Utilizar onChange para capturar o texto digitado
    3. Utilizar onKeyPress para capturar a tecla enter
    4- Usar state para armazenar o texto digitado
    */

    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
          //  id: listaDeMensagens.length + 1,
            de: usuarioLogado,
            texto: novaMensagem,
        }

        supabaseClient
        .from('mensagens')
        .insert([
            // Tem que ser um objeto com  os MESMOS CAMPOS criados no Supabase
            mensagem
        ])
         .then(({data}) => {
        
            
        });
        
        setMensagem('');
    }
    
    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundImage: `url(https://i.postimg.cc/6Q3syjpw/Screen-Shot-2023-02-14-at-22-20-37.png)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header/>
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList mensagens={listaDeMensagens} />
                    {/* listaDeMensagens.map((mensagemAtual) => {
                        return(
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    }) */}
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                            
                        />
                        <Button
                            type='button'
                            label='Enviar'

                            onClick={(e) => {
                                if (mensagem != '') {
                                    e.preventDefault()
                                    handleNovaMensagem(mensagem)
                                }
                            }}
                            styleSheet={{
                                borderRadius: '5px',
                                padding: '13px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                marginBottom: '7px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}

                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[500],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],
                            }}
                        />
                        {/* Callback */}
                        <ButtonSendSticker
                        onStickerClick= {(sticker) => {
                          console.log('salva o sticker no BD', sticker);
                          handleNovaMensagem(':sticker: ' + sticker);
                        }}
                        
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                CSI Pathology Chat 
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    console.log(props);

    
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagemAtual) => {
                return (
                    <Text
                        key={mensagemAtual.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        /8}}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagemAtual.de}.png`}
                            />
                            <Text tag="strong">
                                {mensagemAtual.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {/*mensagemAtual.texto.startsWith(':sticker:').toString()*/}
                        {mensagemAtual.texto.startsWith(':sticker:') 
                        ? (
                            <image src={mensagemAtual.texto.replace(':sticker:', '')} />
                        )
                        : (
                            mensagemAtual.texto
                        )}
                        
                    </Text>

                );


            })}
            

        </Box>
    )
}