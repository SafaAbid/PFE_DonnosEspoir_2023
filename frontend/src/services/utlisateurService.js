import Api from '../axios/Api';
const UTI_API="utilisateurs"
// afficher la liste des comptes
export const fetchAllUtilisateurs = async () => {
    return await Api.get(UTI_API+'/');
}
// afficher la liste des associations 
export const fetchAllAssociations = async () => {
    return await Api.get(UTI_API+'/Allassociations');
}
// afficher la liste des donateurs
export const fetchAllDonateurs = async () => {
    return await Api.get(UTI_API+'/Alldonateurs');
}
// afficher la liste des entreprises 
export const fetchAllEntreprises = async () => {
    return await Api.get(UTI_API+'/Allentreprises');
}
//modifier un compte
/*export const editCompte= (user) => {
    return Api.put(UTI_API + '/' + user.user.id,user);
}*/
//afficher un compte
export const getCompte = async (id) => {
    return await Api.get(UTI_API + '/compte/' + id);
}
export const getCompteByEmail = async (email) => {
    return await Api.get(UTI_API + '/compteByEmail/'+email);
}
export const getCompteAssoByNum = async (num) => {
    return await Api.get(UTI_API + '/compteAssoByNum/'+num);
}
export const getCompteDonByNum = async (num) => {
    return await Api.get(UTI_API + '/compteDonByNum/'+num);
}

// activer un compte
export const activerCompte = async (email) => {
    return await Api.get(UTI_API + '/active/utilisateur?email='+email);
}
// desactiver un compte
export const desactiverCompte = async (obj) => {
    return await Api.put(UTI_API + '/desactive/utilisateur?email='+obj.email,obj);
}
export const fetchUtilisateurByNom=async(nom)=> {
return await Api.put(UTI_API + '/nom/Util' , nom);
    }
export const fetchUtilisateurByNum=async(nom)=> {
return await Api.put(UTI_API + '/num/Util' , nom);
    }
export const fetchUtilisateurByIdentifiant=async(nom)=> {
return await Api.put(UTI_API + '/identifiant/Util' , nom);
    }