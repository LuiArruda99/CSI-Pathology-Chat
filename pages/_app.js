 export default function MyApp({ Component, pageProps }) {
    function GlobalStyle() {
        return (
            <style global jsx>{`
            *{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                list-style: none;
            }
    
            body {
                font-family: 'Roboto', sans-serif;
                font-size: 20px;
            }
            /* App fit Height */ 
            html, body, #__next {
              min-height: 100vh;
              display: flex;
              flex: 1;
            }
            #__next {
              flex: 1;
            }
            #__next > * {
              flex: 1;
            }
            /* ./App fit Height */ 
            `} </style>
        )
    };
    
    console.log('Roda em todas as páginas');
    return (
        <>
        <GlobalStyle/>
        <Component {...pageProps} />
        </>
    );
    
    
  }