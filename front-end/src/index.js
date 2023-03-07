import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { persistor, store } from "./redux";
import { Provider } from "react-redux";
import GlobalStyle from "./components/GlobalStyle/GlobalStyle";
import { PersistGate } from "redux-persist/integration/react";
import SocketProvider from "./components/sockerProvider/SocketProvider";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketProvider>
          <GlobalStyle>
            <App />
          </GlobalStyle>
        </SocketProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
