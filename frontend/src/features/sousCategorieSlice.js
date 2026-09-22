import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import
{fetchSCategories,addSCategorie,editSCategorie,fetchSCategorieById, archiverSousCategorie, fetchSCategorieByCat, fetchScategorieByNom, fetchSCategorieByCatAdmin, desarchiverSousCategorie
} from "../services/sousCategorieService"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
export const getScategories = createAsyncThunk(
"scategorie/getScategories",
async (_, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try {
const res = await fetchSCategories();
return res.data;
}
catch (error) {
return rejectWithValue(error.message);
}
}
);
export const getScategoriesByCat = createAsyncThunk(
    "scategorie/getScategoriesByCat",
    async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
    const res = await fetchSCategorieByCat(id);
    return res.data;
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
    }
    );
export const getScategoriesByCatAdmin = createAsyncThunk(
    "scategorie/getScategoriesByCatAdmin",
    async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
    const res = await fetchSCategorieByCatAdmin(id);
    return res.data;
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
    }
    );
export const createScategorie = createAsyncThunk(
"scategorie/createScategorie",
async (scategorie, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res= await addSCategorie(scategorie);
return res.data
}
catch (error) {
return rejectWithValue(error.message);

}
}
);
export const archiverScategorie = createAsyncThunk(
    "scategorie/archiverScategorie",
    async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try{
    const res= await archiverSousCategorie(id);
    return res.data
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
    }
);
export const desarchiverSCategorie = createAsyncThunk(
    "scategorie/desarchiverScategorie",
    async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try{
    const res= await desarchiverSousCategorie(id);
    return res.data
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
    }
);

export const updateScategorie = createAsyncThunk(
"scategorie/updateScategorie",
async (scategorie, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res= await editSCategorie(scategorie);
return res.data
}
catch (error) {
return rejectWithValue(error.message);
}
}
);
export const findScategorieByID = createAsyncThunk(
"scategorie/findScategorieByID",
async (id,thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res = await fetchSCategorieById(id);
return res.data;
}
catch (error) {
return rejectWithValue(error.message);
}
});
export const findScategorieByNom = createAsyncThunk(
    "scategorie/findScategorieByNom",
    async (nom,thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try{
    const res = await fetchScategorieByNom(nom);
    return res.data;
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
    });
export const scategorieSlice = createSlice({
name: 'scategorie',
initialState:{
scategories:[],
scategorie:{},
isLoading: false,
success:null,
error:null,
},

extraReducers: (builder) => {
//get scategories
builder
.addCase(getScategories.pending, (state, action) => {
state.isLoading=true;
state.error=null;
})
.addCase(getScategories.fulfilled, (state, action) => {
state.isLoading=false;
state.error = null;
state.scategories=action.payload;
})
.addCase(getScategories.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
console.log("impossible de se connecter au serveur")
})
.addCase(getScategoriesByCat.pending, (state, action) => {
    state.isLoading=true;
    state.error=null;
})
    .addCase(getScategoriesByCat.fulfilled, (state, action) => {
    state.isLoading=false;
    state.error = null;
    state.scategories=action.payload;
})
    .addCase(getScategoriesByCat.rejected, (state, action) => {
    state.isLoading=false;
    state.error=action.payload;
    console.log("impossible de se connecter au serveur")
})
.addCase(getScategoriesByCatAdmin.pending, (state, action) => {
    state.isLoading=true;
    state.error=null;
})
    .addCase(getScategoriesByCatAdmin.fulfilled, (state, action) => {
    state.isLoading=false;
    state.error = null;
    state.scategories=action.payload;
})
    .addCase(getScategoriesByCatAdmin.rejected, (state, action) => {
    state.isLoading=false;
    state.error=action.payload;
    console.log("impossible de se connecter au serveur")
})
.addCase(findScategorieByNom.pending, (state, action) => {
    state.isLoading=true;
    state.error=null;
})
    .addCase(findScategorieByNom.fulfilled, (state, action) => {
    state.isLoading=false;
    state.error = null;
    state.scategorie=action.payload;
})
    .addCase(findScategorieByNom.rejected, (state, action) => {
    state.isLoading=false;
    state.error=action.payload;
    console.log("impossible de se connecter au serveur")
})
//insertion scategorie
.addCase(createScategorie.pending, (state, action) => {
state.isLoading=true;
state.error=null;
state.success=null;
})
.addCase(createScategorie.fulfilled, (state, action) => {
state.scategories.push(action.payload);
state.isLoading=false;
state.error=null;
state.success=action.payload;
MySwal.fire({
    icon: 'success',
    text: 'la sous catégorie a été créée avec succès  !',
    })
})
.addCase(createScategorie.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
state.success=null;
})
//Modification scategorie
.addCase(updateScategorie.pending, (state, action) => {
state.isLoading=true;
state.error=null;
state.success=null;
})
.addCase(updateScategorie.fulfilled, (state, action) => {
state.scategories = state.scategories.map((item) =>
item.id === action.payload.id ? action.payload : item
);
state.isLoading=false;
state.error=null;
state.success=action.payload;
MySwal.fire({
    icon: 'success',
    text: 'la sous catégorie a été modifiée avec succès !',
    })
})
.addCase(updateScategorie.rejected, (state, action) => {
    state.isLoading=false;
    state.error=action.payload;
    state.success=null;
    })
//archiver
.addCase(archiverScategorie.pending, (state, action) => {
state.isLoading=true;
state.error=null;
state.success=null;    
    })
.addCase(archiverScategorie.fulfilled, (state, action) => {
state.scategories = state.scategories.map((item) =>
item.id === action.payload.id ? action.payload : item);
    state.isLoading=false;
    state.error=null;
    state.success=action.payload;
    MySwal.fire({
        icon: 'success',
        text: 'la sous catégorie a été désactivée avec succès  !',
        })
   // window.location.reload()
    })
.addCase(archiverScategorie.rejected, (state, action) => {
        state.isLoading=false;
        state.error=action.payload;
        state.success=null;
        })
//desarchiver
.addCase(desarchiverSCategorie.pending, (state, action) => {
state.isLoading=true;
state.error=null;
state.success=null;    
    })
.addCase(desarchiverSCategorie.fulfilled, (state, action) => {
state.scategories = state.scategories.map((item) =>
item.id === action.payload.id ? action.payload : item);
    state.isLoading=false;
    state.error=null;
    state.success=action.payload;
    MySwal.fire({
        icon: 'success',
        text: 'la sous catégorie a été activée avec succès  !',
        })
   // window.location.reload()
    })
.addCase(desarchiverSCategorie.rejected, (state, action) => {
        state.isLoading=false;
        state.error=action.payload;
        state.success=null;
        })
//Fectch scategorie
.addCase(findScategorieByID.pending, (state, action) => {
state.isLoading = true
state.error=null;
})
.addCase(
findScategorieByID.fulfilled,(state, action) => {
state.isLoading = false
state.error = null
state.scategorie=action.payload;
})
.addCase(findScategorieByID.rejected,(state, action) => {
state.isLoading=false;
state.error=action.payload;
state.success=null;
})
}
}
)

export default scategorieSlice.reducer;