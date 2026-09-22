import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { addDonation, editArchiveDonation, editRepDonation, fetchDonationByAssociation, fetchDonationByDonateur, fetchDonationById } from '../services/donationService';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
export const getDonationByAssociation = createAsyncThunk(
"donation/getDonationByAssociation",
async (id, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try {
const res = await fetchDonationByAssociation(id);
return res.data;
}
catch (error) {
return rejectWithValue(error.message);
}
}
);
export const getDonationByDonateur = createAsyncThunk(
    "donation/getDonationByDonateur",
    async (id, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    try {
    const res = await fetchDonationByDonateur(id);
    return res.data;
    }
    catch (error) {
    return rejectWithValue(error.message);
    }
    }
    );
export const createDonation= createAsyncThunk(
"donation/createDonation",
async (donation, thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res= await addDonation(donation);
return res.data
}
catch (error) {
return rejectWithValue(error.message);
}
}
);
export const findDonationByID = createAsyncThunk(
"donation/findDonationByID",
async (id,thunkAPI) => {
const { rejectWithValue } = thunkAPI;
try{
const res = await fetchDonationById(id);
return res.data;
}
catch (error) {
return rejectWithValue(error.message);
}
});
export const updateArchive = createAsyncThunk(
    "donation/updateArchive",
    async (id, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await editArchiveDonation(id);
            return res.data
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const updateRep = createAsyncThunk(
    "donation/updateRep",
    async (id, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await editRepDonation(id);
            return res.data
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
export const donationSlice = createSlice({
name: 'donation',
initialState:{
donations:[],
donation:{},
isLoading: false,
success:null,
error:null,
},

extraReducers: (builder) => {
//get categories
builder
.addCase(getDonationByAssociation.pending, (state, action) => {
state.isLoading=true;
state.error=null;
})
.addCase(getDonationByAssociation.fulfilled, (state, action) => {
state.isLoading=false;
state.error = null;
state.donations=action.payload;
})
.addCase(getDonationByAssociation.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
console.log("impossible de se connecter au serveur")
})
.addCase(getDonationByDonateur.pending, (state, action) => {
state.isLoading=true;
state.error=null;
})
.addCase(getDonationByDonateur.fulfilled, (state, action) => {
state.isLoading=false;
state.error = null;
state.donations=action.payload;
    })
.addCase(getDonationByDonateur.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
console.log("impossible de se connecter au serveur")
    })
//insertion donation
.addCase(createDonation.pending, (state, action) => {
state.isLoading=true;
state.error=null;
state.success=null;
})
.addCase(createDonation.fulfilled, (state, action) => {
state.donations.push(action.payload);
state.isLoading=false;
state.error=null;
state.success=action.payload;
MySwal.fire({
    icon: 'success',
    text: "Nous tenons à vous informer qu'une nouvelle donation a été créée pour cet objet. Par conséquent, les autres demandes pour le même objet ont été refusées.",
    })
    // .then((result) => {
    //     if (result.isConfirmed) {
    //       window.location.reload();
    //     }});
})
.addCase(createDonation.rejected, (state, action) => {
state.isLoading=false;
state.error=action.payload;
state.success=null;
})
//Fetch donation
.addCase(findDonationByID.pending, (state, action) => {
state.isLoading = true
state.error=null;
})
.addCase(findDonationByID.fulfilled,(state, action) => {
state.isLoading = false
state.error = null
state.donation=action.payload;
})
.addCase(findDonationByID.rejected,(state, action) => {
state.isLoading=false;
state.error=action.payload;
state.success=null;
})
.addCase(updateArchive.pending, (state, action) => {
    state.isLoading = true;
    state.error = null;
    state.success = null;
})
.addCase(updateArchive.fulfilled, (state, action) => {
    state.donations = state.donations.map((item) =>
        item.id === action.payload.id ? action.payload : item
    );
    state.isLoading = false;
    state.error = null;
    state.success = action.payload;
})
.addCase(updateArchive.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
})
.addCase(updateRep.pending, (state, action) => {
    state.isLoading = true;
    state.error = null;
    state.success = null;
})
.addCase(updateRep.fulfilled, (state, action) => {
    state.donations = state.donations.map((item) =>
        item.id === action.payload.id ? action.payload : item
    );
    state.isLoading = false;
    state.error = null;
    state.success = action.payload;
})
.addCase(updateRep.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
})
}
}
)
export default donationSlice.reducer;