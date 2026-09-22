import React, { useCallback, useEffect } from 'react'
import Contenu from './Contenu'
import SidebarAdmin from '../SideBarAdmin'
import NavBarAdmin from '../NavBarAdmin'
import { useDispatch, useSelector } from 'react-redux'
import { getComptes } from '../../../../features/utilisateurSlice'

const ListeDesComptes = () => {
    const {utilisateurs} = useSelector((state) =>state.storeUtilisateurs);
    const dispatch=useDispatch()
    const initFetch = useCallback(() => {
        //if(user && !user.donateur &&  (user.user.role==="administrateur")  ) {
            dispatch(getComptes()).then(er=>console.log(er));
        console.log("les comptes :",utilisateurs)
}, [dispatch])
useEffect(() => {
    initFetch()
    }, [initFetch])
  return (
    <>
    <div class="wrapper">
        <SidebarAdmin/>
        <div class="main" style={{ backgroundColor: "white"}}>
  <NavBarAdmin/>
            <main  style={{backgroundColor:"white"}} class="content px-3 py-2">
             <Contenu/>
            </main>
           
           
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/script.js"></script>
    </>
  )
}

export default ListeDesComptes
