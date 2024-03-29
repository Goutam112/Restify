import { useEffect, useState, React, createContext, useContext } from "react"
import { useNavigate } from 'react-router-dom'

// import the global app CSS
import '../../assets/app.css'

// import our page specific CSS file
import './style.css'

import RentalUnitRow from "../../components/MyRentalUnits/MyRentalUnitRow"

import { MyRentalUnitsContext } from "../../contexts/MyRentalUnitsContext"

import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'

const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Authorization', `Bearer ${localStorage.getItem("token")}`);

// console.log(localStorage.getItem("token"));


// export default function MyRentalUnits() {

    // const [rentalUnits, setRentalUnits] = useState([]);

    // useEffect(() => {
    //     setRentalUnits(getRentalUnits());
    //   }, []);


//     return <MainBody></MainBody>;
// }

async function getRentalUnitsFromBackend(page, setNumPages) {
    try {
        let response = await fetch(`http://localhost:8000/properties/retrieve/user/?page=${page}`, {
            method: "GET",
            headers: headers,
        });

        if (!response.ok) {
            console.error("Problem fetching user rental properties");
        }
        let json = await response.json();

        setNumPages(Math.ceil(json.count / 8));

        return json.results;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function deleteRentalUnit(propertyID, deletePropertyPath, rentalUnits, setRentalUnits) {
    // propertyID will later be used to delete the property from our state

    let rentalUnitToDelete = rentalUnits.find(
        (rentalUnit) => {
            return rentalUnit.id === propertyID
        }
    );

    try {
        let response = await fetch(deletePropertyPath,
            {
                method: "DELETE",
                headers: new Headers({'Authorization': `Bearer ${localStorage.getItem("token")}`}),
            });
            // rentalUnits.splice(rentalUnits.indexOf(rentalUnitToDelete), 1)
            // Physically update rentalUnits to cause its useEffect dependency to update in MyRentalUnits.jsx
            // Note: Mutating an array does NOT cause useEffect dependecies to update
            // and this is true for ANY mutating operation.
        if (!response.ok) {
            console.log("Error while trying to delete a property");
        } else {
            // Delete our local copy of the property
            setRentalUnits(rentalUnits.filter((rentalUnit) => rentalUnit !== rentalUnitToDelete));
            console.log(JSON.stringify(rentalUnits));
            console.log(rentalUnits.length);
        }
    } catch (error) {
        console.log(error);
    }
}

function DeletionMsg({propertyID}) {
    let deletePropertyPath = `http://localhost:8000/properties/delete/${propertyID}/`;
    let {rentalUnits, setRentalUnits} = useContext(MyRentalUnitsContext);;
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
                    <button type="button" data-bs-dismiss="modal" onClick={() => deleteRentalUnit(propertyID, deletePropertyPath, rentalUnits, setRentalUnits)} 
                    class="btn btn-danger">Yes, please proceed</button>
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

function PageNumberElement({pageNum, setPage}) {
    return (
        <li class="page-item">
            <button onClick={() => {
                setPage(pageNum);
            }} class="page-link" href="#">{pageNum}</button>
        </li>
    );
}

function PageNumber({numPages, setPage}) {
    let pageNumberComponents = [];

    console.log("Page number:")
    console.log(numPages);

    for (let i = 0; i < numPages; i++) {
        pageNumberComponents.push(<PageNumberElement setPage={setPage} key={i + 1} pageNum={i + 1}></PageNumberElement>)
    }

    return (
        <ul class="pagination justify-content-center">
            {pageNumberComponents}
        </ul>
    );
}

export default function MyRentalUnits() {

    const [rentalUnits, setRentalUnits] = useState([]);
    const [rows, setRows] = useState([]);

    const [page, setPage] = useState(1);
    const [numPages, setNumPages] = useState(1);

    const loginNavigate = useNavigate();

    const [selectedPropertyID, setSelectedProperty] = useState(undefined);

    useEffect(() => {
        if (localStorage.getItem("token") === null) {
            loginNavigate("/login/");
        }

    }, []);

    // let rows = [];


    useEffect(() => {
        getRentalUnitsFromBackend(page, setNumPages).then((data) => {
            // console.log(`Data: ${JSON.stringify(data)}`);
            setRentalUnits(data);
            // console.log(`Rental units: ${rentalUnits}`)
        });

        }, [page]);


    useEffect(() => {
        console.log("RENTAL UNITS")
        console.log(rentalUnits);

        console.log(JSON.stringify(rentalUnits));

        let newRows = []

        setRows([])

        console.log("ROWS HAVE BEEN REDRAWN");

        for (let rentalUnit of rentalUnits) {
            console.log(`ROW: ${rentalUnit}`)
            newRows.push(<RentalUnitRow key={rentalUnit.id} propertyID={rentalUnit.id} location={rentalUnit.address} imgPath={rentalUnit.property_images[0].image} propertyName={rentalUnit.name} setTargetReservationID={setSelectedProperty}/>)
        }

        setRows(newRows);

        }, [rentalUnits]);

        return (
            <body>
                <main className="card d-block">
                
                    <Header></Header>
                    <div className="container">
                        <div className="table-responsive text-start overflow-auto">
                            <table className="table border align-middle table-hover">
                                <thead>
                                    <tr>
                                        <th>Rental Unit</th>
                                        <th>Location</th>
                                    </tr>
                                </thead>
                                <tbody className="table-group-divider">
                                    <CreatePropertyRedirectButton />
                                    <MyRentalUnitsContext.Provider value={{rentalUnits, setRentalUnits}}>
                                        <DeletionMsg propertyID={selectedPropertyID}></DeletionMsg>
                                        {rows}
                                    </MyRentalUnitsContext.Provider>
                                </tbody>
                            </table>
                            <PageNumber numPages={numPages} setPage={setPage}></PageNumber>
                        </div>
                    </div>
                    <Footer></Footer>
                </main>
            </body>
            );
}