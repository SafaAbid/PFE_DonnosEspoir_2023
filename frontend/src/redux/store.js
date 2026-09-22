import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../features/AuthSlice"
import objetsReducer from "../features/objetSlice"
import utilisateursReducer from "../features/utilisateurSlice"
import scategorieReducer from "../features/sousCategorieSlice"
import demandesObjetsReducer from "../features/demandeObjetSlice"
import donationsReducer from "../features/donationSlice"
import rendezVousReducer from "../features/rendezVousSlice"
import categorieReducer from "../features/categorieSlice"
import benevoleReducer from "../features/benevoleSlice"
import activiteReducer from "../features/activiteSlice"
import besoinReducer from "../features/besoinSlice"
import demandeReparationReducer from "../features/demandeReparationSlice"
import reparationReducer from "../features/reparationSlice"
import notificationReducer from "../features/notificationSlice"
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
const persistConfig = {
key: 'root',
version: 1,
storage,

}

const persistedReducer = persistReducer(persistConfig, authReducer)
const store = configureStore({
reducer: {
storeObjets:objetsReducer,
storeDemandesObjets:demandesObjetsReducer,
storeDonations:donationsReducer,
storeUtilisateurs:utilisateursReducer,
storeSousCategories:scategorieReducer,
storeRendezVous:rendezVousReducer,
storeCategories:categorieReducer,
storeBenevoles:benevoleReducer,
storeDemandesReparations:demandeReparationReducer,
storeReparations:reparationReducer,
auth:persistedReducer,
storeActivites:activiteReducer,
storeBesoins:besoinReducer,
storeNotifications:notificationReducer
}
})
export default store