import Api from "../axios/Api";
const BENEVOLE_API="benevoles/";
export const fetchBenevolesByAssociation=async(id)=> {
    return await Api.get(BENEVOLE_API+'association/'+id);
    }
export const fetchBenevolesDisponibleByDateAndByAssociation=async(objet)=> {
return await Api.post(BENEVOLE_API+'disponible/'+ objet.id,objet);
        }
export const addBenevole=async(benevole)=> {
    return await Api.post(BENEVOLE_API,benevole);
    }
export const fetchBenevoleById=async(id)=> {
return await Api.get(BENEVOLE_API + id);
}
export const deleteBenevole=async(id) =>{
    return await Api.put(BENEVOLE_API +"archiveBenevole/" +id);
    }
export const editBenevole=async(benevole) =>{
    return await Api.put(BENEVOLE_API + benevole.id, benevole);
  }
export const fetchBenevoleByEmail=async(benevole) =>{
    return await Api.put(BENEVOLE_API + "emailBenevole",benevole);
  }
export const fetchBenevoleByNumTelephone=async(benevole) =>{
    return await Api.put(BENEVOLE_API + "numBenevole",benevole);
  }