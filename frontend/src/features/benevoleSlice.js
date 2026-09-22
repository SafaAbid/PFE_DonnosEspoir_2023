import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { addBenevole, deleteBenevole, editBenevole, fetchBenevoleByEmail, fetchBenevoleByNumTelephone, fetchBenevolesByAssociation, fetchBenevolesDisponibleByDateAndByAssociation } from '../services/benevoleService';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
export const getBenevolesByAssociation = createAsyncThunk(
"benevole/getBenevolesByAssociation",
async (id, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try {
const res = await fetchBenevolesByAssociation(id);
return res.data;
}
catch (error) {
return rejectWithValue(error.message);
}
}
);
export const getBenevolesDisponibleByDateAndByAssociation = createAsyncThunk(
    "benevole/getBenevolesDisponibleByDateAndByAssociation",
    async (objet, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
    const res = await fetchBenevolesDisponibleByDateAndByAssociation(objet);
    return res.data;
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
    }
    );
export const createBenevole= createAsyncThunk(
"benevole/createBenevole",
async (benevole, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res= await addBenevole(benevole);
return res.data
}
catch (error) {
return rejectWithValue(error.message);
}
}
);
export const findBenevoleByID = createAsyncThunk(
"benevole/findBenevoleByID",
async (id,thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res = await fetchBenevolesById(id);
return res.data;
}
catch (error) {
return rejectWithValue(error.message);
}
});
export const delBenevole= createAsyncThunk(
    "benevole/delBenevole",
    async (id,thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try{
        const res = await deleteBenevole(id);
    return res.data ;
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
    });
    export const updateBenevole = createAsyncThunk(
        "benevole/updateBenevole",
        async (benevole, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try{
        const res= await editBenevole(benevole);
        return res.data
        }
        catch (error) {
        return rejectWithValue(error.message);
        }
        }
        );
        export const findBenevoleByEmail = createAsyncThunk(
            "scategorie/findBenevoleByEmail",
            async (benevole,thunkAPI) => {
            const { rejectWithValue } = thunkAPI;
            try{
            const res = await fetchBenevoleByEmail(benevole);
            return res.data;
            }
            catch (error) {
            return rejectWithValue(error.message);
            }
            });
        export const findBenevoleByNum = createAsyncThunk(
            "scategorie/findBenevoleByNum",
            async (benevole,thunkAPI) => {
            const { rejectWithValue } = thunkAPI;
            try{
            const res = await fetchBenevoleByNumTelephone(benevole);
            return res.data;
            }
            catch (error) {
            return rejectWithValue(error.message);
            }
            });
export const benevoleSlice = createSlice({
name: 'benevole',
initialState:{
benevoles:[],
benevole:{},
isLoading: false,
success:null,
error:null,
},

extraReducers: (builder) => {
//get activites
builder
.addCase(getBenevolesByAssociation.pending, (state, action) => {
state.isLoading=true;
state.error=null;
})
.addCase(getBenevolesByAssociation.fulfilled, (state, action) => {
state.isLoading=false;
state.error = null;
state.benevoles=action.payload;
    })
.addCase(getBenevolesByAssociation.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
console.log("impossible de se connecter au serveur")
    })
.addCase(getBenevolesDisponibleByDateAndByAssociation.pending, (state, action) => {
state.isLoading=true;
state.error=null;
        })
.addCase(getBenevolesDisponibleByDateAndByAssociation.fulfilled, (state, action) => {
 state.isLoading=false;
 state.error = null;
 state.benevoles=action.payload;
            })
.addCase(getBenevolesDisponibleByDateAndByAssociation.rejected, (state, action) => {
        state.isLoading=false;
        state.error=action.payload;
        console.log("impossible de se connecter au serveur")
            })
//insertion reparation
.addCase(createBenevole.pending, (state, action) => {
state.isLoading=true;
state.error=null;
state.success=null;
})
.addCase(createBenevole.fulfilled, (state, action) => {
state.benevoles=[action.payload,...state.benevoles];
state.isLoading=false;
state.error=null;
state.success=action.payload;
MySwal.fire({
    icon: 'success',
    text: `le bénévole ${action.payload.nom} a été ajouté avec succès `,
    })
})
.addCase(createBenevole.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
state.success=null;
})
//Fetch donation
.addCase(findBenevoleByID.pending, (state, action) => {
state.isLoading = true
state.error=null;
})
.addCase(findBenevoleByID.fulfilled,(state, action) => {
state.isLoading = false
state.error = null
state.benevole=action.payload;
})
.addCase(findBenevoleByID.rejected,(state, action) => {
state.isLoading=false;
state.error=action.payload;
state.success=null;
})
//refuser 
.addCase(updateBenevole.pending, (state, action) => {
    state.isLoading=true;
    state.error=null;
    state.success=null;    
        })
    .addCase(updateBenevole.fulfilled, (state, action) => {
    state.benevoles = state.benevoles.map((item) =>
    item.id === action.payload.id ? action.payload : item);
        state.isLoading=false;
        state.error=null;
        state.success=action.payload;
        MySwal.fire({
            icon: 'success',
            text: `le bénévole ${action.payload.nom} a été modifié avec succès`,
            })
        })
    .addCase(updateBenevole.rejected, (state, action) => {
            state.isLoading=false;
            state.error=action.payload;
            state.success=null;
            })
.addCase(findBenevoleByEmail.pending, (state, action) => {
    state.isLoading=true;
    state.error=null;
    state.success=null;    
        })
    .addCase(findBenevoleByEmail.fulfilled, (state, action) => {
    state.benevole = action.payload;
        state.isLoading=false;
        state.error=null;
        state.success=action.payload;
        })
    .addCase(findBenevoleByEmail.rejected, (state, action) => {
            state.isLoading=false;
            state.error=action.payload;
            state.success=null;
            })
.addCase(findBenevoleByNum.pending, (state, action) => {
    state.isLoading=true;
    state.error=null;
    state.success=null;    
        })
    .addCase(findBenevoleByNum.fulfilled, (state, action) => {
    state.benevole = action.payload;
        state.isLoading=false;
        state.error=null;
        state.success=action.payload;
        })
    .addCase(findBenevoleByNum.rejected, (state, action) => {
            state.isLoading=false;
            state.error=action.payload;
            state.success=null;
            })
//Delete demande
.addCase(delBenevole.pending, (state, action) => {
    state.isLoading=true;
    state.error=null;
    })
    .addCase(delBenevole.fulfilled, (state, action) => {
        state.benevoles = state.benevoles.map((item) =>
        item.id === action.payload.id ? action.payload : item);
    state.isLoading=false;
    state.error=null;
        MySwal.fire({
        icon: 'success',
        text: `le bénévole ${action.payload.nom} a été supprimé avec succès`,
        })
    })
    .addCase(delBenevole.rejected, (state, action) => {
    state.isLoading=false;
    state.error=action.payload;
    })
}
}
)

export default benevoleSlice.reducer;