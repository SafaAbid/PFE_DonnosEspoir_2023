import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { addBesoin, deleteBesoin, editBesoin, fetchBesoinByCat, fetchBesoinsByAssociation } from '../services/besoinService';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
export const getBesoinsByAssociation = createAsyncThunk(
"besoin/getBesoinsByAssociation",
async (id, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try {
const res = await fetchBesoinsByAssociation(id);
return res.data;
}
catch (error) {
return rejectWithValue(error.message);
}
}
);
export const createBesoin= createAsyncThunk(
"besoin/createBesoin",
async (besoin, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res= await addBesoin(besoin);
return res.data
}
catch (error) {
return rejectWithValue(error.message);
}
}
);
export const findBesoinByID = createAsyncThunk(
"besoin/findBesoinByID",
async (id,thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res = await fetchBesoinById(id);
return res.data;
}
catch (error) {
return rejectWithValue(error.message);
}
});
export const delBesoin = createAsyncThunk(
    "besoin/delBesoin",
    async (id,thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try{
    await deleteBesoin(id);
    return id ;
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
    });
    export const updateBesoin = createAsyncThunk(
        "besoin/updateBesoin",
        async (besoin, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try{
        const res= await editBesoin(besoin);
        return res.data
        }
        catch (error) {
        return rejectWithValue(error.message);
        }
        }
        );
        export const findBesoinByCat = createAsyncThunk(
            "scategorie/findBesoinByCat",
            async (besoin,thunkAPI) => {
            const { rejectWithValue } = thunkAPI;
            try{
            const res = await fetchBesoinByCat(besoin);
            return res.data;
            }
            catch (error) {
            return rejectWithValue(error.message);
            }
            });
export const besoinSlice = createSlice({
name: 'besoin',
initialState:{
besoins:[],
besoin:{},
isLoading: false,
success:null,
error:null,
errorMessage: null,
},

extraReducers: (builder) => {
//get activites
builder
.addCase(getBesoinsByAssociation.pending, (state, action) => {
state.isLoading=true;
state.error=null;
})
.addCase(getBesoinsByAssociation.fulfilled, (state, action) => {
state.isLoading=false;
state.error = null;
state.besoins=action.payload;
    })
.addCase(getBesoinsByAssociation.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
console.log("impossible de se connecter au serveur")
    })
//insertion reparation
.addCase(createBesoin.pending, (state, action) => {
state.isLoading=true;
state.error=null;
state.success=null;
state.errorMessage=null;
})
.addCase(createBesoin.fulfilled, (state, action) => {
state.besoins=[action.payload,...state.besoins];
state.isLoading=false;
state.error=null;
state.success=action.payload;
state.errorMessage=null;
MySwal.fire({
    icon: 'success',
    text: `votre besoin a été ajouté avec succès` ,
})
})
.addCase(createBesoin.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload.message;
state.success=null;
state.errorMessage=action.error.msg ;

})
//Fetch donation
.addCase(findBesoinByID.pending, (state, action) => {
state.isLoading = true
state.error=null;
})
.addCase(findBesoinByID.fulfilled,(state, action) => {
state.isLoading = false
state.error = null
state.besoin=action.payload;
})
.addCase(findBesoinByID.rejected,(state, action) => {
state.isLoading=false;
state.error=action.payload;
state.success=null;
})
//refuser 
.addCase(updateBesoin.pending, (state, action) => {
    state.isLoading=true;
    state.error=null;
    state.success=null;    
        })
    .addCase(updateBesoin.fulfilled, (state, action) => {
    state.besoins = state.besoins.map((item) =>
    item.id === action.payload.id ? action.payload : item);
        state.isLoading=false;
        state.error=null;
        state.success=action.payload;
        MySwal.fire({
            icon: 'success',
            text: `votre besoin a été modifié avec succès` ,
        })
        })
    .addCase(updateBesoin.rejected, (state, action) => {
            state.isLoading=false;
            state.error=action.payload;
            state.success=null;
            })
//Delete demande
.addCase(delBesoin.pending, (state, action) => {
    state.isLoading=true;
    state.error=null;
    })
    .addCase(delBesoin.fulfilled, (state, action) => {
    state.isLoading=false;
    state.error=null;
    state.besoins=state.besoins.filter((item)=> item.id!==action.payload)
    MySwal.fire({
        icon: 'success',
        text: `votre besoin a été supprimé avec succès` ,
    })
    })
    .addCase(delBesoin.rejected, (state, action) => {
    state.isLoading=false;
    state.error=action.payload;
    })
    .addCase(findBesoinByCat.pending, (state, action) => {
        state.isLoading=true;
        state.error=null;
        state.success=null;    
            })
        .addCase(findBesoinByCat.fulfilled, (state, action) => {
        state.besoin = action.payload;
        state.isLoading=false;
        state.error=null;
            state.success=action.payload;
            })
        .addCase(findBesoinByCat.rejected, (state, action) => {
                state.isLoading=false;
                state.error=action.payload;
                state.success=null;
                })
}
}
)
export const selectErrorMessage = (state) => state.errorMessage;
export default besoinSlice.reducer; 