import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { activerCompte, desactiverCompte, fetchAllAssociations, fetchAllDonateurs, fetchAllEntreprises, fetchAllUtilisateurs, fetchUtilisateurByIdentifiant, fetchUtilisateurByNom, fetchUtilisateurByNum, getCompte, getCompteAssoByNum, getCompteByEmail, getCompteDonByNum } from '../services/utlisateurService';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
export const getComptes= createAsyncThunk(
    "utilisateurs/getComptes",
    async (_, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await fetchAllUtilisateurs();
            return res.data;
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const getAssociations= createAsyncThunk(
    "utilisateurs/getAssociations",
    async (_, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await fetchAllAssociations();
            return res.data;
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getDonateurs = createAsyncThunk(
    "utilisateurs/getdonateurs",
    async (_, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await fetchAllDonateurs();
            return res.data;
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const getEntreprises = createAsyncThunk(
    "utilisateurs/getEntreprises",
    async (_, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await fetchAllEntreprises();
            return res.data;
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const findCompteById = createAsyncThunk(
    "utilisateurs/findCompteById",
    async (id, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await getCompte(id);
            return res.data;
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const findCompteByEmail = createAsyncThunk(
    "utilisateurs/findCompteByEmail",
    async (email, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await getCompteByEmail(email);
            return res.data;
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const findCompteAssoByNum = createAsyncThunk(
    "utilisateurs/findCompteAssoByNum",
    async (email, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await getCompteAssoByNum(email);
            return res.data;
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const findCompteDonByNum = createAsyncThunk(
    "utilisateurs/findCompteDonByNum",
    async (email, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await getCompteDonByNum(email);
            return res.data;
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
/*export const updateCompte = createAsyncThunk(
    "utilisateurs/updateCompte",
    async (user, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await editCompte(user);
            return res.data
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);*/
export const updateActive = createAsyncThunk(
    "utilisateurs/updateActive",
    async (email, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await activerCompte(email);
            return res.data
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const updateDesactive = createAsyncThunk(
    "utilisateurs/updateDesactive",
    async (obj, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await desactiverCompte(obj);
            return res.data
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const findUtilisateurByNom = createAsyncThunk(
    "scategorie/findUtilisateurByNom",
    async (nom,thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try{
    const res = await fetchUtilisateurByNom(nom);
    return res.data;
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
    });
export const findUtilisateurByNum = createAsyncThunk(
    "scategorie/findUtilisateurByNum",
    async (nom,thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try{
    const res = await fetchUtilisateurByNum(nom);
    return res.data;
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
    });
export const findUtilisateurByIdentifiant = createAsyncThunk(
    "scategorie/findUtilisateurByIdentifiant",
    async (nom,thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try{
    const res = await fetchUtilisateurByIdentifiant(nom);
    return res.data;
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
    });
export const utilisateursSlice = createSlice({
    name: 'utilisateur',
    initialState: {
        utilisateurs: [],
        utilisateur: {},
        isLoading: false,
        success: null,
        error: null,
    },

    extraReducers: (builder) => {
        //get comptes
        builder
        .addCase(getComptes.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(getComptes.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.utilisateurs = action.payload;
        })
        .addCase(getComptes.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            console.log("impossible de se connecter au serveur")
        })
            .addCase(getAssociations.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAssociations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.utilisateurs = action.payload;
            })
            .addCase(getAssociations.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                console.log("impossible de se connecter au serveur")
            })
            .addCase(getDonateurs.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getDonateurs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.utilisateurs = action.payload;
            })
            .addCase(getDonateurs.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                console.log("impossible de se connecter au serveur")
            })
            .addCase(getEntreprises.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getEntreprises.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.utilisateurs = action.payload;
            })
            .addCase(getEntreprises.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                console.log("impossible de se connecter au serveur")
            })
            .addCase(findUtilisateurByNom.pending, (state, action) => {
                state.isLoading = true
                state.error=null;
                })
                .addCase(findUtilisateurByNom.fulfilled,(state, action) => {
                state.isLoading = false
                state.error = null
                state.utilisateur=action.payload;
                })
                .addCase(findUtilisateurByNom.rejected,(state, action) => {
                state.isLoading=false;
                state.error=action.payload;
                state.success=null;
                })
            .addCase(findUtilisateurByNum.pending, (state, action) => {
                state.isLoading = true
                state.error=null;
                })
                .addCase(findUtilisateurByNum.fulfilled,(state, action) => {
                state.isLoading = false
                state.error = null
                state.utilisateur=action.payload;
                })
                .addCase(findUtilisateurByNum.rejected,(state, action) => {
                state.isLoading=false;
                state.error=action.payload;
                state.success=null;
                })
            .addCase(findUtilisateurByIdentifiant.pending, (state, action) => {
                state.isLoading = true
                state.error=null;
                })
                .addCase(findUtilisateurByIdentifiant.fulfilled,(state, action) => {
                state.isLoading = false
                state.error = null
                state.utilisateur=action.payload;
                })
                .addCase(findUtilisateurByIdentifiant.rejected,(state, action) => {
                state.isLoading=false;
                state.error=action.payload;
                state.success=null;
                })
            //Modification compte
            .addCase(updateDesactive.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(updateDesactive.fulfilled, (state, action) => {
                state.utilisateurs = state.utilisateurs.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
                state.isLoading = false;
                state.error = null;
                state.success = action.payload;
                MySwal.fire({
                    icon: 'success',
                    title: `le compte du ${action.payload.nom} a été désactivé avec succés` ,
                })
            })
            .addCase(updateDesactive.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(updateActive.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(updateActive.fulfilled, (state, action) => {
                console.log(action.payload);
                state.utilisateurs = state.utilisateurs.map((item) =>
                item.id === action.payload.id ? action.payload : item
            );
                state.isLoading = false;
                state.error = null;
                state.success = action.payload;
                MySwal.fire({
                    icon: 'success',
                    title: `le compte du ${action.payload.nom} a été activé avec succés` ,
                    })
            })
            .addCase(updateActive.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
           /* .addCase(updateCompte.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(updateCompte.fulfilled, (state, action) => {
                state.utilisateurs = state.utilisateurs.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                );
                state.isLoading = false;
                state.error = null;
                state.success = action.payload;
            })
            .addCase(updateCompte.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })*/
            //Fetch compte
            .addCase(findCompteById.pending, (state, action) => {
                state.isLoading = true
                state.error = null;
            })
            .addCase(
                findCompteById.fulfilled, (state, action) => {
                    state.isLoading = false
                    state.error = null
                    state.utilisateur= action.payload;
                })
            .addCase(findCompteById.rejected, (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload;
                })
            .addCase(findCompteByEmail.pending, (state, action) => {
                state.isLoading = true
                state.error = null;
            })
            .addCase(
                findCompteByEmail.fulfilled, (state, action) => {
                    state.isLoading = false
                    state.error = null
                    state.utilisateur= action.payload;
                })
            .addCase(findCompteByEmail.rejected, (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload;
                })
            .addCase(findCompteAssoByNum.pending, (state, action) => {
                state.isLoading = true
                state.error = null;
            })
            .addCase(
                findCompteAssoByNum.fulfilled, (state, action) => {
                    state.isLoading = false
                    state.error = null
                    state.utilisateur= action.payload;
                })
            .addCase(findCompteAssoByNum.rejected, (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload;
                })
            .addCase(findCompteDonByNum.pending, (state, action) => {
                state.isLoading = true
                state.error = null;
            })
            .addCase(
                findCompteDonByNum.fulfilled, (state, action) => {
                    state.isLoading = false
                    state.error = null
                    state.utilisateur= action.payload;
                })
            .addCase(findCompteDonByNum.rejected, (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload;
                })
    }
})
export default utilisateursSlice.reducer; 