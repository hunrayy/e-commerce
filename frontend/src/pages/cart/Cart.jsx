


import "./cart.css"
import Navbar from "../../components/navbar/Navbar"
import Footer from "../../components/footer/Footer"
const Cart = () => {
    return <div className="cart-page-container">
        <Navbar />
        {/* bread crumbs */}
        <div className="" style={{marginTop: "108px", backgroundColor: "black"}}>
            <div className="container py-4">
            
                <nav className="d-flex">
                    <h6 className="mb-0">
                    <a href="" className="text-white-50">Home</a>
                    <span className="text-white-50 mx-2"> | </span>
                    <a href="" className="text-white"><u>Shopping cart</u></a>
                    </h6>
                </nav>

            </div>
        </div>
        {/* bread crumbs */}

        <section className="my-5">
            <div className="container">
                <div className="row">
                {/* <!-- cart --> */}
                <div className="col-lg-9">
                    <div className="card border shadow-0">
                    <div className="m-4">
                        <h4 className="card-title mb-4">Your shopping cart</h4>
                        <div className="row gy-3 mb-4">
                        <div className="col-lg-5">
                            <div className="me-lg-5">
                            <div className="d-flex">
                                <img src="data:image/jpeg;base64,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" className="border rounded me-3" style={{width: "96px", height: "96px"}} />
                                <div className="">
                                <a href="#" className="nav-link">Winter jacket for men and lady</a>
                                <p className="text-muted">Yellow, Jeans</p>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="col-lg-2 col-sm-6 col-6 d-flex flex-row flex-lg-column flex-xl-row text-nowrap">
                            <div className="">
                            <select style={{width: "100px"}} className="form-select me-4">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                            </select>
                            </div>
                            <div className="">
                            <span className="h6">$1156.00</span> <br />
                            <small className="text-muted text-nowrap"> $460.00 / per item </small>
                            </div>
                        </div>
                        <div className="col-lg col-sm-6 d-flex justify-content-sm-center justify-content-md-start justify-content-lg-center justify-content-xl-end mb-2">
                            <div className="float-md-end">
                            <a href="#!" className="btn btn-light border px-2 icon-hover-primary"><i className="fas fa-heart fa-lg px-1 text-secondary"></i></a>
                            <a href="#" className="btn btn-light border text-danger icon-hover-danger"> Remove</a>
                            </div>
                        </div>
                        </div>

                        <div className="row gy-3 mb-4">
                        <div className="col-lg-5">
                            <div className="me-lg-5">
                            <div className="d-flex">
                                <img src="data:image/jpeg;base64,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" className="border rounded me-3" style={{width: "96px", height: "96px"}} />
                                <div className="">
                                <a href="#" className="nav-link">Mens T-shirt Cotton Base</a>
                                <p className="text-muted">Blue, Medium</p>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="col-lg-2 col-sm-6 col-6 d-flex flex-row flex-lg-column flex-xl-row text-nowrap">
                            <div className="">
                            <select style={{width: "100px"}} className="form-select me-4">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                            </select>
                            </div>
                            <div className="">
                            <span className="h6">$44.80</span> <br />
                            <small className="text-muted text-nowrap"> $12.20 / per item </small>
                            </div>
                        </div>
                        <div className="col-lg col-sm-6 d-flex justify-content-sm-center justify-content-md-start justify-content-lg-center justify-content-xl-end mb-2">
                            <div className="float-md-end">
                            <a href="#!" className="btn btn-light border px-2 icon-hover-primary"><i className="fas fa-heart fa-lg px-1 text-secondary"></i></a>
                            <a href="#" className="btn btn-light border text-danger icon-hover-danger"> Remove</a>
                            </div>
                        </div>
                        </div>

                        <div className="row gy-3">
                        <div className="col-lg-5">
                            <div className="me-lg-5">
                            <div className="d-flex">
                                <img src="data:image/jpeg;base64,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" className="border rounded me-3" style={{width: "96px", height: "96px"}} />
                                <div className="">
                                <a href="#" className="nav-link">Blazer Suit Dress Jacket for Men</a>
                                <p className="text-muted">XL size, Jeans, Blue</p>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="col-lg-2 col-sm-6 col-6 d-flex flex-row flex-lg-column flex-xl-row text-nowrap">
                            <div className="">
                            <select style={{width: "100px"}} className="form-select me-4">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                            </select>
                            </div>
                            <div className="">
                            <span className="h6">$1156.00</span> <br />
                            <small className="text-muted text-nowrap"> $460.00 / per item </small>
                            </div>
                        </div>
                        <div className="col-lg col-sm-6 d-flex justify-content-sm-center justify-content-md-start justify-content-lg-center justify-content-xl-end mb-2">
                            <div className="float-md-end">
                            <a href="#!" className="btn btn-light border px-2 icon-hover-primary"><i className="fas fa-heart fa-lg px-1 text-secondary"></i></a>
                            <a href="#" className="btn btn-light border text-danger icon-hover-danger"> Remove</a>
                            </div>
                        </div>
                        </div>
                    </div>

                    <div className="border-top pt-4 mx-4 mb-4">
                        <p><i className="fas fa-truck text-muted fa-lg"></i> Free Delivery within 1-2 weeks</p>
                        <p className="text-muted">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip
                        </p>
                    </div>
                    </div>
                </div>
                {/* <!-- cart --> */}
                {/* <!-- summary --> */}
                <div className="col-lg-3">
                    <div className="card mb-3 border shadow-0">
                    <div className="card-body">
                        <form>
                        <div className="form-group">
                            <label className="form-label">Have coupon?</label>
                            <div className="input-group">
                            <input type="text" className="form-control border" name="" placeholder="Coupon code" />
                            <button className="btn btn-light border">Apply</button>
                            </div>
                        </div>
                        </form>
                    </div>
                    </div>
                    <div className="card shadow-0 border">
                    <div className="card-body">
                        <div className="d-flex justify-content-between">
                        <p className="mb-2">Total price:</p>
                        <p className="mb-2">$329.00</p>
                        </div>
                        <div className="d-flex justify-content-between">
                        <p className="mb-2">Discount:</p>
                        <p className="mb-2 text-success">-$60.00</p>
                        </div>
                        <div className="d-flex justify-content-between">
                        <p className="mb-2">TAX:</p>
                        <p className="mb-2">$14.00</p>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between">
                        <p className="mb-2">Total price:</p>
                        <p className="mb-2 fw-bold">$283.00</p>
                        </div>

                        <div className="mt-3">
                        <a href="#" className="btn w-100 shadow-0 mb-2" style={{backgroundColor: "purple", color: "white"}}> Clear Cart </a>
                        <a href="#" className="btn btn-light w-100 border mt-2"> Back to shop </a>
                        </div>
                    </div>
                    </div>
                </div>
                {/* <!-- summary --> */}
                </div>
            </div>
        </section>

        <Footer />



    </div>
}
export default Cart