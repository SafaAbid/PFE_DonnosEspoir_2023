import Api from '../axios/Api';
const OBJET_API="objets"
//ajouter un objet
export const addObjet = async (objet) => {
    return await Api.post(OBJET_API, objet);
}
// afficher la liste des objets
export const fetchObjets = async () => {
    return await Api.get(OBJET_API+'/');
}
// afficher la liste des objets disponibles et publies(valider de la part de l'administrateur)
export const fetchObjetsDispoEtValide = async () => {
    return await Api.get(OBJET_API+'/disponibles');
}
// afficher la liste des objets disponibles et publiee(valider de la part de l'administrateur) et non demandé par une association
export const fetchObjetsDispoEtNonDemande = async (id) => {
    return await Api.get(OBJET_API+ '/disponiblesAssociation/' + id);
}
// afficher la liste des objets disponibles et publiee(valider de la part de l'administrateur) et demandé par une association
export const fetchObjetsDispoEtDemande = async (id) => {
    return await Api.get(OBJET_API+ '/disponiblesDemandesAssociation/' + id);
}
// afficher les objets réparés pour une association 
export const fetchObjetsreparesByAssociation = async (id) => {
    return await Api.get(OBJET_API+ '/repareAssociation/' + id);
}
// afficher les objets d'un donateur.
export const fetchObjetsByDonateur = async (id) => {
    return await Api.get(OBJET_API+ '/donateur/' + id);
}
// afficher les objets d'une categorie.
export const fetchObjetsByCat = async (id) => {
    return await Api.get(OBJET_API+ '/cat/' + id);
}
// afficher les objets d'une sous categorie.
export const fetchObjetsByScat = async (id) => {
    return await Api.get(OBJET_API+ '/sCat/' + id);
}
//afficher un ojbet
export const getObjet = async (id) => {
    return await Api.get(OBJET_API + '/' + id);
}
//rendre l'objet non disponible
export const editNonDispo = async (objet) => {
    return await Api.put(OBJET_API +'/nondisponible/' + objet.id , objet);
}
//rendre l'objet disponible
export const editDispo = async (id) => {
    return await Api.put(OBJET_API +'/disponible/' + id);
}
//valider un objet 
export const editValide = (id) => {
    return Api.put(OBJET_API + '/validation/' + id );
}
//refuser un objet 
export const editRefus = (obj) => {
    return Api.put(OBJET_API + '/refus/' + obj.id,obj);
}
//modifier un objet 
export const editObjet= (objet) => {
    return Api.put(OBJET_API + '/modification/' + objet.id,objet);
}
//supprimer un objet 
export const deleteObjet = async (id) => {
    return await Api.put(OBJET_API + '/archive/' + id);
}