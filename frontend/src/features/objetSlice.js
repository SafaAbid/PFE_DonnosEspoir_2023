import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import {  addObjet, deleteObjet, editDispo, editNonDispo, editObjet, editRefus, editValide, fetchObjets, fetchObjetsByCat, fetchObjetsByDonateur, fetchObjetsByScat, fetchObjetsDispoEtDemande, fetchObjetsDispoEtNonDemande, fetchObjetsDispoEtValide, fetchObjetsreparesByAssociation } from '../services/objetService';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
export const getObjets = createAsyncThunk(
    "objets/getObjets",
    async (_, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await fetchObjets();
            return res.data;
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const getObjetsDispoEtValide = createAsyncThunk(
    "objets/getObjetsDispoEtValide",
    async (_, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await fetchObjetsDispoEtValide();
            return res.data;
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const getObjetsDispoEtValideEtNonDemande = createAsyncThunk(
    "objets/getObjetsDispoEtValideEtNonDemande",
    async (id, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await fetchObjetsDispoEtNonDemande(id);
            return res.data;
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const getObjetsDispoEtValideEtDemande = createAsyncThunk(
    "objets/getObjetsDispoEtValideEtDemande",
    async (id, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await fetchObjetsDispoEtDemande(id);
            return res.data;
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const getObjetsreparesByAssociation  = createAsyncThunk(
    "objets/getObjetsreparesByAssociation",
    async (id, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await fetchObjetsreparesByAssociation(id);
            return res.data;
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const getObjetsByDonateur = createAsyncThunk(
    "objets/getObjetsByDonateur",
    async (id, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await fetchObjetsByDonateur(id);
            return res.data;
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const getObjetsByCat = createAsyncThunk(
    "objets/getObjetsByCat",
    async (id, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await fetchObjetsByCat(id);
            return res.data;
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const getObjetsByScat = createAsyncThunk(
    "objets/getObjetsByScat",
    async (id, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await fetchObjetsByScat(id);
            return res.data;
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const createObjet = createAsyncThunk(
    "objets/createObjet",
    async (objet, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await addObjet(objet);
            return res.data
        }
        catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const updateDispo = createAsyncThunk(
    "objets/updateDispo",
    async (id, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await editDispo(id);
            return res.data
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const updateNonDispo = createAsyncThunk(
    "objets/updateNonDispo",
    async (objet, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await editNonDispo(objet);
            return res.data
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const updateValide = createAsyncThunk(
    "objets/updateValide",
    async (id, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await editValide(id);
            return res.data
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const updateRefus = createAsyncThunk(
    "objets/updateRefus",
    async (obj, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await editRefus(obj);
            return res.data
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const delObjet = createAsyncThunk(
    "objets/delObjet",
    async (id, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
          const res=  await deleteObjet(id);
            return res.data;
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    });
export const updateObjet = createAsyncThunk(
    "objets/updateObjet",
    async (objet, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await editObjet(objet);
            return res.data
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const findObjetByID = createAsyncThunk(
    "objets/findObjetByID",
    async (id, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await getObjet(id);
            return res.data;
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    });
export const objetsSlice = createSlice({

    name: 'objet',
    initialState: {
        objets: [],
        objet: {},
        isLoading: false,
        success: null,
        error: null,
    },

    extraReducers: (builder) => {
        //get articles
        builder
            .addCase(getObjets.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getObjets.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.objets = action.payload;
            })
            .addCase(getObjets.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                console.log("impossible de se connecter au serveur")
            })
            .addCase(getObjetsDispoEtValide.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getObjetsDispoEtValide.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.objets = action.payload;
            })
            .addCase(getObjetsDispoEtValide.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                console.log("impossible de se connecter au serveur")
            })
            .addCase(getObjetsDispoEtValideEtNonDemande.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getObjetsDispoEtValideEtNonDemande.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.objets = action.payload;
            })
            .addCase(getObjetsDispoEtValideEtNonDemande.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                console.log("impossible de se connecter au serveur")
            })
            .addCase(getObjetsDispoEtValideEtDemande.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getObjetsDispoEtValideEtDemande.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.objets = action.payload;
            })
            .addCase(getObjetsDispoEtValideEtDemande.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                console.log("impossible de se connecter au serveur")
            })
            .addCase(getObjetsreparesByAssociation.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getObjetsreparesByAssociation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.objets = action.payload;
            })
            .addCase(getObjetsreparesByAssociation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                console.log("impossible de se connecter au serveur")
            })
            .addCase(getObjetsByDonateur.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getObjetsByDonateur.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.objets = action.payload;
            })
            .addCase(getObjetsByDonateur.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                console.log(action.payload)
            })
            .addCase(getObjetsByCat.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getObjetsByCat.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.objets = action.payload;
            })
            .addCase(getObjetsByCat.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                console.log("impossible de se connecter au serveur")
            })
            .addCase(getObjetsByScat.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getObjetsByScat.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.objets = action.payload;
            })
            .addCase(getObjetsByScat.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                console.log("impossible de se connecter au serveur")
            })
            //insertion objet
            .addCase(createObjet.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(createObjet.fulfilled, (state, action) => {
                //state.objets.push(action.payload);
                state.objets = [action.payload,...state.objets];
                state.isLoading = false;
                state.error = null;
                state.success = action.payload;
                MySwal.fire({
                    icon: 'success',
                    text: `Votre objet ${action.payload.nom} a été ajouté avec succès et est en attente de validation par l’administrateur`,
                    })
                    // .then((result) => {
                    //     if (result.isConfirmed) {
                    //       window.location.reload();
                    //     }
                    // });
            })
            .addCase(createObjet.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message;
                state.success = null;
            })
            //Modification objet
            .addCase(updateDispo.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(updateDispo.fulfilled, (state, action) => {
                state.objets = state.objets.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
                state.isLoading = false;
                state.error = null;
                state.success = action.payload;
                MySwal.fire({
                    icon: 'success',
                    text: `le rendez-vous a été marqué réalisé avec succès`,
                    }) 
            })
            .addCase(updateDispo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload.message;
            })
            .addCase(updateNonDispo.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(updateNonDispo.fulfilled, (state, action) => {
                state.objets = state.objets.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
                state.isLoading = false;
                state.error = null;
                state.success = action.payload;
            })
            .addCase(updateNonDispo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(updateValide.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(updateValide.fulfilled, (state, action) => {
                state.objets = state.objets.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
                state.isLoading = false;
                state.error = null;
                state.success = action.payload;
                MySwal.fire({
                    icon: 'success',
                    text: `la demande de publication a été accepté avec succès` ,
                    })
            })
            .addCase(updateValide.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(updateRefus.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(updateRefus.fulfilled, (state, action) => {
                state.objets = state.objets.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
                state.isLoading = false;
                state.error = null;
                state.success = action.payload;
                MySwal.fire({
                    icon: 'success',
                    text: `la demande de publication a été refusée avec succés` ,
                    })
            })
            .addCase(updateRefus.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(updateObjet.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(updateObjet.fulfilled, (state, action) => {
                state.objets = state.objets.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
                state.isLoading = false;
                state.error = null;
                state.success = action.payload;
                MySwal.fire({
                    icon: 'success',
                    text: `Votre objet ${action.payload.nom} a été modifié avec succès et est en attente de validation par l’administrateur`,
                    })
                    // .then((result) => {
                    //     if (result.isConfirmed) {
                    //       window.location.reload();
                    //     }
                    // });
            })
            .addCase(updateObjet.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            //Delete objet
            .addCase(delObjet.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(delObjet.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.objets=state.objets.filter((item)=> item.id!==action.payload.id)

            MySwal.fire({
                    icon: 'success',
                    title: "l'objet a été supprimé avec succés",
                    })
            })
            .addCase(delObjet.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            //Fectch objet
            .addCase(findObjetByID.pending, (state, action) => {
                state.isLoading = true
                state.error = null;
            })
            .addCase(
                findObjetByID.fulfilled, (state, action) => {
                    state.isLoading = false
                    state.error = null
                    state.objet = action.payload;
                })
            .addCase(findObjetByID.rejected, (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload;
                })
    }
})
export default objetsSlice.reducer; 