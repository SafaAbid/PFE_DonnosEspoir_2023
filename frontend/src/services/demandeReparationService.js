import Api from "../axios/Api";
const DEMANDEREPARATION_API="demandesReparation/"

export const fetchDemandesReparations=async()=> {
return await Api.get(DEMANDEREPARATION_API+'allDemandes');
}
export const fetchDemandeReparationByAssociation=async(id)=> {
    return await Api.get(DEMANDEREPARATION_API+'association/'+id);
    }
export const fetchDemandeReparationAccepteesByEntreprise=async(id)=> {
    return await Api.get(DEMANDEREPARATION_API+'allDemandesAccepteesByEntreprise/'+id);
    }
export const addDemandeReparation=async(demandeReparation)=> {
    return await Api.post(DEMANDEREPARATION_API,demandeReparation);
    }
export const fetchDemandeReparationById=async(id)=> {
return await Api.get(DEMANDEREPARATION_API + id);
}
export const deleteDemandeReparation=async(id) =>{
    return await Api.delete(DEMANDEREPARATION_API+ id);
}
export const updateDescDemandeReparation=async(dmd) =>{
return await Api.put(DEMANDEREPARATION_API+ dmd.id,dmd);
}
