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


function EditButton({propertyEditPath}) {
    return (
        <Link className="rounded-top dropdown-item" to={propertyEditPath}>Edit this property</Link>
    );
}

function DeleteButton({propertyID, setTargetReservationID}) {
    let {rentalUnits, setRentalUnits} = useContext(MyRentalUnitsContext)
    {/* We have to manually make this Delete button darken upon hover because buttons need extra work to match the styling of dropdown-item */}
    return (
        <button type="button" onClick={() => {
            setTargetReservationID(propertyID);
        }} data-bs-toggle="modal" data-bs-target="#deletion-modal" className="rounded-bottom dropdown-item delete-btn text-light">Delete</button>
    );
}

function RentalUnitThreeDots({propertyID, setTargetReservationID}) {

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
                        <DeleteButton propertyID={propertyID} setTargetReservationID={setTargetReservationID}></DeleteButton>
                    </li>
                </ul>
            </div>
        </td>
    )
}

export default function RentalUnitRow({propertyID, propertyName, location, propertyViewPath, imgPath, setTargetReservationID}) {

    // console.log(`Rental units: ${rentalUnits}`)

    // console.log(propertyID);
    
    let row = (
        <tr>
            <RentalUnitImgAndName propertyViewPath={`/properties/view/${propertyID}`} imgPath={imgPath} propertyName={propertyName} />
            <RentalUnitLocation location={location}/>
            <RentalUnitThreeDots propertyID={propertyID} setTargetReservationID={setTargetReservationID} />
        </tr>
    );

    return row;
}