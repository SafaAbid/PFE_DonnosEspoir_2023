import React, { useCallback, useEffect } from 'react'
import SidebarAdmin from '../SideBarAdmin'
import NavBarAdmin from '../NavBarAdmin'
import Contenu from './Contenu'
import { useSelector, useDispatch } from 'react-redux';
import { getObjets } from '../../../../features/objetSlice';

const ListeDesPublications = () => {
    const {objets,isLoading,error} = useSelector((state)=>state.storeObjets);
    const dispatch=useDispatch();
    //const {user} = useSelector((state) =>state.auth);
    const initFetch = useCallback(() => {
      
          dispatch(getObjets()).then(er=>console.log(er));
     console.log("les demandes de cette associatuion :",objets)
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

export default ListeDesPublications
