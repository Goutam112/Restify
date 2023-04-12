import { useContext, useEffect, useState } from "react"

// import the global app CSS
import '../../assets/app.css'

// import our page specific CSS file
import '../../pages/MyRentalUnits/style.css'
import { MyRentalUnitsContext } from "../../contexts/MyRentalUnitsContext";
import { Link } from "react-router-dom";

function RentalUnitImgAndName({propertyViewPath, imgPath, propertyName}) {
    return (
    <td>
        <div>
            <a href={propertyViewPath} className="no-decor">
                <img src={imgPath} className="my-rental-units-img img-fluid"/>
                <p className="ms-2 text-nowrap d-inline my-rental-unit-row">{propertyName}</p>
            </a>
        </div>
    </td>
    );
}

function RentalUnitLocation({location}) {
    return <td>{location}</td>
}


// function RentalUnitStatus() {
//     return (
//     <td>
//         <span className="badge rounded-pill bg-success">Reserved</span>
//     </td>
//     );
// }

function EditButton({propertyEditPath}) {
    return (
        <Link className="rounded-top dropdown-item" to={propertyEditPath}>Edit this property</Link>
    );
}

// function DeletionMsg() {
//     return (<div className="modal fade" id="deletion-modal" tabindex="-1" aria-labelledby="deletion-modal-label" aria-hidden="true">
//         <div className="modal-dialog">
//             <div className="modal-content">
//                 <div className="modal-header">
//                     <h1 className="modal-title fs-5" id="deletion-modal-label">Confirm the deletion of this unit</h1>
//                     <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                 </div>
//                 <div className="modal-body">
//                     Are you sure you want to delete this unit? Warning: You cannot undo this operation.
//                 </div>
//                 <div className="modal-footer">
//                     <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Nevermind</button>
//                     <button type="button" class="btn btn-danger">Yes, please proceed</button>
//                 </div>
//             </div>
//         </div>
//     </div>
//     );
// }

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
                headers: new Headers({'Authorization': `${localStorage.getItem("authorizationToken")}`}),
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

function DeleteButton({propertyID, deletePropertyPath}) {
    let {rentalUnits, setRentalUnits} = useContext(MyRentalUnitsContext)
    {/* We have to manually make this Delete button darken upon hover because buttons need extra work to match the styling of dropdown-item */}
    return (
    // <button type="button" className="rounded-bottom dropdown-item delete-btn text-light" data-bs-toggle="modal" data-bs-target="#deletion-modal">
    <button type="button" onClick={() => deleteRentalUnit(propertyID, deletePropertyPath, rentalUnits, setRentalUnits)} className="rounded-bottom dropdown-item delete-btn text-light">Delete</button>
    );
}

function RentalUnitThreeDots({propertyID}) {

    console.log(`http://localhost:3000/properties/update/${propertyID}/`)

    return (
        <td>
            <div className="dropdown float-end">
                <button className="my-rental-unit btn text-black bg-transparent" type="button"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    {/* This is the "vertical three dots" */}
                    &#xFE19; 
                </button>
                <ul className="rounded p-0 dropdown-menu">
                    <li>
                        <EditButton propertyEditPath={`http://localhost:3000/properties/update/${propertyID}/`}/>
                    </li>
                    <li>
                        <DeleteButton propertyID={propertyID} deletePropertyPath={`http://localhost:8000/properties/delete/${propertyID}/`}></DeleteButton>
                    </li>
                </ul>
            </div>
        </td>
    )
}

export default function RentalUnitRow({propertyID, propertyName, location, propertyViewPath, imgPath}) {

    // console.log(`Rental units: ${rentalUnits}`)

    // console.log(propertyID);
    
    let row = (
        <tr>
            <RentalUnitImgAndName propertyViewPath={"/csc309-restify/views/properties/property_view_host.html"} imgPath={imgPath} propertyName={propertyName} />
            <RentalUnitLocation location={location}/>
            <RentalUnitThreeDots propertyID={propertyID} />
        </tr>
    );

    return row;
}