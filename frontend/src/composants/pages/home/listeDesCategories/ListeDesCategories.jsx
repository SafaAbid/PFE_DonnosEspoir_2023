import React, { useCallback, useEffect } from 'react'
import SidebarAdmin from '../SideBarAdmin'
import NavBarAdmin from '../NavBarAdmin'
import Contenu from './Contenu'
import { getCategories, getCategoriesAdmin } from '../../../../features/categorieSlice'
import { useSelector, useDispatch } from 'react-redux';

const ListeDesCategories = () => {
    const { categories } = useSelector((state) => state.storeCategories);
    const { sousCategories } = useSelector((state) => state.storeSousCategories);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch()
    const initFetch = useCallback(() => {
        //if(user && !user.donateur &&  (user.user.role==="administrateur")  ) {
        dispatch(getCategoriesAdmin()).then(er => console.log(er));
        console.log("les categories  :", categories)
    }, [dispatch]
        //}
    )

    useEffect(() => {
        initFetch()

    }, [initFetch])
    return (
        <>
            <div class="wrapper">
                <SidebarAdmin />
                <div class="main" style={{ backgroundColor: "white" }}>
                    <NavBarAdmin />
                    <main style={{ backgroundColor: "white" }} class="content px-3 py-2">
                        <Contenu />
                    </main>


                </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/js/bootstrap.bundle.min.js"></script>
            <script src="js/script.js"></script>
        </>
    )
}

export default ListeDesCategories
