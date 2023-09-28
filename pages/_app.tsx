import CartContextProvider from "@/components/CartContext";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

  @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300&display=swap');

  body{
    padding:0;
    margin: 0;
    background-color: #eee;
    font-family: 'Roboto Slab', serif;
  }
  hr{
    border-color: #eee;
    background-color: #eee;
  }
`;

interface AppWithSessionProps extends AppProps {
  session: Session;
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppWithSessionProps) {
  return (
    <>
      <GlobalStyles />
      <SessionProvider session={session}>
        <CartContextProvider>
          <Component {...pageProps} />
        </CartContextProvider>
      </SessionProvider>
    </>
  );
}
