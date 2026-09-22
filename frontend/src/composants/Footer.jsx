import React from 'react'

const Footer = () => {
  return (
    <footer className="footer py-1" style={{
        backgroundColor: "rgba(167, 216, 137, 0.5)",
       
        bottom: 0,
        width: "100%",
        zIndex: "100000"
    }}>
        <div className="container">
            <div className="row align-items-center">
                <div className="col-lg-4 text-lg-start">Copyright &copy; Donnons Espoir</div>
                <div className="col-lg-4 my-3 my-lg-0">
                    <a className="btn btn-dark btn-social" href="#!" aria-label="Twitter" style={{ width: "30px", height: "30px" }}>
                        <i className="fab fa-twitter" style={{ fontSize: "10px" }}></i>
                    </a>
                    <a className="btn btn-dark btn-social mx-2" href="#!" aria-label="Facebook" style={{ width: "30px", height: "30px" }}>
                        <i className="fab fa-facebook-f" style={{ fontSize: "10px" }}></i>
                    </a>
                    <a className="btn btn-dark btn-social mx-2" href="#!" aria-label="LinkedIn" style={{ width: "30px", height: "30px" }}>
                        <i className="fab fa-linkedin-in" style={{ fontSize: "10px" }}></i>
                    </a>
                </div>
                <div className="col-lg-4 text-lg-end">
                    <a className="link-dark text-decoration-none me-3" href="#!"></a>
                    <a className="link-dark text-decoration-none" href="#!"></a>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer
