import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { logger } from "redux-logger";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import localForage from "localforage";
import { encryptTransform } from "redux-persist-transform-encrypt";

import { DEBUG, ENCRYPTION_KEY } from "constants/config";
import api from "api";
import messagesReducer from "features/messages";
import drawerReducer from "features/drawer";
import authReducer from "features/auth/slice";

//Persists part of state in local storage and encrypt
const encryptor = encryptTransform({
  secretKey: ENCRYPTION_KEY,
  onError: (error) => {
    if (persistor) persistor.purge();
    console.warning(error);
    throw new Error(
      "Error while decrypting stored state. State has been purged"
    );
  },
});
const persistConfig = {
  key: "root",
  storage: localForage,
  transforms: [encryptor],
};

const credentials = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    messages: messagesReducer,
    drawer: drawerReducer,
    [api.reducerPath]: api.reducer,
    credentials,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware, ...(DEBUG ? [logger] : [])),
});

const persistor = persistStore(store);

setupListeners(store.dispatch);

export default { store, persistor };
