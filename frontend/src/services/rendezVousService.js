import Api from "../axios/Api";
const RENDEZVOUS_API="rendezVous/"

export const fetchRendezVousByDonateur=async(id)=> {
return await Api.get(RENDEZVOUS_API+'rendezVousDonateur/'+id);
}
export const fetchRendezVousByEntreprise=async(id)=> {
return await Api.get(RENDEZVOUS_API +'rendezVousEntreprise/' + id);
}
export const fetchRendezVousReparationsByEntreprise=async(id)=> {
        return await Api.get(RENDEZVOUS_API +'rendezVousEntrepriseReparation/' + id);
        }
export const fetchRendezVousReparationsByAssociation=async(id)=> {
        return await Api.get(RENDEZVOUS_API +'rendezVousAssociationReparation/' + id);
        }
export const fetchRendezVousByAssociation=async(id)=> {
    return await Api.get(RENDEZVOUS_API +'rendezVousAssociation/' + id);
    }
export const  fetchRendezVousByBenevole=async(id)=> {
        return await Api.get(RENDEZVOUS_API +'rendezVousBenevole/' + id);
        }
export const  fetchRendezVousById=async(id)=> {
        return await Api.get(RENDEZVOUS_API + id);
        }
export const affecterBenevoleRendezVous=async(objet) =>{
            return await Api.put(RENDEZVOUS_API + 'benevole/' + objet.id, objet);
        }
export const modifierBenevoleRendezVous=async(objet) =>{
            return await Api.put(RENDEZVOUS_API + 'modifbenevole/' + objet.id, objet);
        }
export const editRendezVous=async(rendezVous) =>{
return await Api.put(RENDEZVOUS_API  + rendezVous.id, rendezVous);
}
export const editRealiseRendezVous=async(id) =>{
        return await Api.put(RENDEZVOUS_API  + 'realise/'+id);
        }
        export const editNonRealiseRendezVous=async(id) =>{
                return await Api.put(RENDEZVOUS_API  + 'nonRealise/'+id);
                }