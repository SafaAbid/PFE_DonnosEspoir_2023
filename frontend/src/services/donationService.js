import Api from "../axios/Api";
const DONATION_API="donations/"

export const fetchDonationByAssociation=async(id)=> {
return await Api.get(DONATION_API+'association/'+id);
}
export const fetchDonationByDonateur=async(id)=> {
    return await Api.get(DONATION_API+'donateur/'+id);
    }
export const addDonation=async(donation)=> {
    return await Api.post(DONATION_API,donation);
    }
export const fetchDonationById=async(id)=> {
return await Api.get(DONATION_API + id);
}
export const editArchiveDonation=async(id)=>{
    return await Api.put(DONATION_API +'archive/'+ id);
}
export const editRepDonation=async(id)=>{
    return await Api.put(DONATION_API +'marquerReparation/'+ id);
}
