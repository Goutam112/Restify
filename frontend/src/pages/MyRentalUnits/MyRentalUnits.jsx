import { useEffect, useState, React, createContext } from "react"
import { useNavigate } from 'react-router-dom'

// import the global app CSS
import '../../assets/app.css'

// import our page specific CSS file
import './style.css'

import RentalUnitRow from "../../components/MyRentalUnits/MyRentalUnitRow"

import { MyRentalUnitsContext } from "../../contexts/MyRentalUnitsContext"

const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Authorization', `${localStorage.getItem("authorizationToken")}`);


// export default function MyRentalUnits() {

    // const [rentalUnits, setRentalUnits] = useState([]);

    // useEffect(() => {
    //     setRentalUnits(getRentalUnits());
    //   }, []);


//     return <MainBody></MainBody>;
// }

async function getRentalUnitsFromBackend() {
    try {
        let response = await fetch("http://localhost:8000/properties/retrieve/user/", {
            method: "GET",
            headers: headers,
        });

        if (!response.ok) {
            console.error("Problem fetching user rental properties");
        }
        let json = await response.json();

        return json.results;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export function MyRentalUnitsHeader() {
    return (
        <header>
            <nav className="navbar bg-body-tertiary fixed-top mb-5">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/csc309-restify/views/home.html">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#0d6efd"
                            className="bi bi-r-square-fill align-text-bottom" viewBox="0 0 16 16">
                            <path
                                d="M6.835 5.092v2.777h1.549c.995 0 1.573-.463 1.573-1.36 0-.913-.596-1.417-1.537-1.417H6.835Z" />
                            <path
                                d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Zm3.5 4.002h3.11c1.71 0 2.741.973 2.741 2.46 0 1.138-.667 1.94-1.495 2.24L11.5 12H9.98L8.52 8.924H6.836V12H5.5V4.002Z" />
                        </svg>
                        <span className="fs-2 fw-bold">Restify</span>
                    </a>
                    <div>
                        <a href="/csc309-restify/views/notifications.html" className="notification-btn btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#0d6efd"
                                className="bi bi-bell-fill" viewBox="0 0 16 16">
                                <path
                                    d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
                            </svg>
                            <span className="badge badge-dark bg-primary">3</span>
                        </a>
                        <div className="dropdown">
                            <button className="avatar-btn btn dropdown-toggle" type="button" id="dropdownMenuButton"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#0d6efd"
                                    className="bi bi-person-circle" viewBox="0 0 16 16">
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                    <path fillRule="evenodd"
                                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                                </svg>
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <li><a className="dropdown-item" href="/csc309-restify/views/users/profile_view.html">My
                                        profile</a></li>
                                <li><a className="dropdown-item"
                                        href="/csc309-restify/views/reservations/my_reservations.html">My
                                        reservations</a></li>
                                <li><a className="dropdown-item"
                                        href="/csc309-restify/views/reservations/my_rental_units.html">My
                                        properties</a></li>
                                <li><a className="dropdown-item" href="/csc309-restify/views/home-2.html">Sign out</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

function DeletionMsg() {
    return (<div className="modal fade" id="deletion-modal" tabindex="-1" aria-labelledby="deletion-modal-label" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="deletion-modal-label">Confirm the deletion of this unit</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    Are you sure you want to delete this unit? Warning: You cannot undo this operation.
                </div>
                <div className="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Nevermind</button>
                    <button type="button" class="btn btn-danger">Yes, please proceed</button>
                </div>
            </div>
        </div>
    </div>
    );
}

function CreatePropertyRedirectButton() {
    const navigate = useNavigate();
    return (
        <tr>
            <td colspan="4" class="text-center">
                <div class="align-middle">
                    <button style={{'border': 'none', 'background': 'none'}} onClick={() => {
                        navigate("/properties/create")
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="blue" class="bi bi-plus-square" viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    );
}


export default function MyRentalUnits() {

    const [rentalUnits, setRentalUnits] = useState([]);
    const [rows, setRows] = useState([]);

    // let rows = [];


    useEffect(() => {
        getRentalUnitsFromBackend().then((data) => {
            // console.log(`Data: ${JSON.stringify(data)}`);
            setRentalUnits(data)
            // console.log(`Rental units: ${rentalUnits}`)
        });

        }, []);


    useEffect(() => {
        console.log("RENTAL UNITS")
        console.log(rentalUnits);

        console.log(JSON.stringify(rentalUnits));

        let newRows = []

        setRows([])

        console.log("ROWS HAVE BEEN REDRAWN");

        for (let rentalUnit of rentalUnits) {
            console.log(`ROW: ${rentalUnit}`)
            newRows.push(<RentalUnitRow key={rentalUnit.id} propertyID={rentalUnit.id} location={rentalUnit.address} imgPath={rentalUnit.property_images[0].image} propertyName={rentalUnit.name}/>)
        }

        setRows(newRows);

        }, [rentalUnits]);

        return (
            <body>
                <MyRentalUnitsHeader />
                <main className="card d-block">
                    <div className="container">
                        <div className="table-responsive text-start overflow-auto">
                            <table className="table border align-middle table-hover">
                                <thead>
                                    <tr>
                                        <th>Rental Unit</th>
                                        <th>Location</th>
                                        {/* <th>Status</th> */}
                                    </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                    <CreatePropertyRedirectButton></CreatePropertyRedirectButton>
                                    <tr>
                                        <td colSpan="4" className="text-center">
                                            <div className="align-middle">
                                                <a href="/csc309-restify/views/properties/property_create.html">
                                                    <i className="fs-2 bi bi-plus-square"></i>
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                    <MyRentalUnitsContext.Provider value={{rentalUnits, setRentalUnits}}>
                                        {rows}
                                    </MyRentalUnitsContext.Provider>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </body>
            );
}