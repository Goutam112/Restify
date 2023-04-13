import { useEffect, useState, React, createContext, useContext } from "react"

// import the global app CSS
import '../../assets/app.css'

// import '../../assets/app.css'

// import '../../App.css'

import './style.css';

import { Link, useNavigate, useParams } from 'react-router-dom'

import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'


const headers = new Headers();
// headers.append('Content-Type', 'application/json');
headers.append('Authorization', `Bearer ${localStorage.getItem("token")}`);


const MyReservationsContext = createContext();

function makeEnum(values) {
    let object = {};
    for (let value of values) {
        object[value.toUpperCase()] = value;
    }

    // console.log(object);
    return Object.freeze(object);
}

const reservationStatusTypes = ["Pending", "Denied", "Expired", "Approved", "Cancelled", "Terminated", "Completed", "CancellationRequested"];

const ReservationStatus = makeEnum(reservationStatusTypes);


function NavigationTabs() {
    return (
        <nav>
            <div class="nav nav-tabs mb-3" id="nav-tab" role="tablist">
                <button class="nav-link active" id="outgoing-reservations-tab" data-bs-toggle="tab"
                    data-bs-target="#outgoing-reservations" type="button" role="tab"
                    aria-controls="outgoing-reservations" aria-selected="true">Outgoing Reservations</button>
                <button class="nav-link" id="nav-incoming-reservations-tab" data-bs-toggle="tab"
                    data-bs-target="#nav-incoming-reservations" type="button" role="tab"
                    aria-controls="nav-incoming-reservations" aria-selected="false">Incoming Reservations</button>
                <FilterDropdown class="nav-link"></FilterDropdown>
            </div>
        </nav>
    );
}

function OutgoingTable() {

    let [outgoingReservations, setOutgoingReservations] = useContext(MyReservationsContext).outgoingReservations;
    let outgoingReservationComponents = [];

    for (let outgoingReservationDict of outgoingReservations) {
        // console.log(outgoingReservationDict);
        
        let propertyDict = outgoingReservationDict.property;

        if (propertyDict === undefined) {
            console.log("UNDEFINED")
            // console.log(outgoingReservations)
            console.log(outgoingReservationDict);
        }
        // console.log(propertyDict);
        let propertyID = propertyDict.id;
        // console.log(propertyID);
        let reservationStatus = outgoingReservationDict.status;
        let reservationStartDate = outgoingReservationDict.start_date;
        let reservationEndDate = outgoingReservationDict.end_date;
        let reservationID = outgoingReservationDict.id;


        let propertyName = propertyDict.name;
        let propertyLocation = propertyDict.address + ", " + propertyDict.state + ", "  + propertyDict.city + ", " + propertyDict.country;

        let propertyImage = propertyDict.property_images[0].image;

        // console.log(propertyName);
        // console.log(propertyLocation);

        let newComponent = <ReservationRow 
            key={propertyID + reservationID}
            outgoingOrIncoming={"outgoing"}
            imgPath={propertyImage}
            name={propertyName}
            reservationID={reservationID}
            propertyID={propertyID}
            address={propertyLocation}
            status={reservationStatus}
            startDate={reservationStartDate}
            endDate={reservationEndDate}
            ></ReservationRow>;

        // console.log(`COMPONENTS: ${[...outgoingReservationComponents].concat(newComponent)}`);
        outgoingReservationComponents = [...outgoingReservationComponents].concat(newComponent);
    }

    return (
        <table class="table border align-middle table-hover">
            <OutgoingTableHeader></OutgoingTableHeader>
            <tbody class="table-group-divider">
                {outgoingReservationComponents}
            </tbody>
        </table>
    );
}

function OutgoingTableHeader() {
    return (
        <thead>
            <tr>
                <th>Rental Unit</th>
                <th>Location</th>
                <th>Status</th>
                <th>Check-in</th>
                <th>Check-out</th>
            </tr>
        </thead>
    );
}

function IncomingTableHeader() {
    return (
        <tr>
            <th>Rental Unit</th>
            <th>Location</th>
            <th>Reserver</th>
            <th>Status</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th colspan="2">Action</th>
        </tr>
    );
}

function ThreeDots() {
    return (
        <button class="btn text-black bg-transparent" type="button"
            data-bs-toggle="dropdown" aria-expanded="false">
            {/* <!-- This is the "vertical three dots" --> */}
            &#xFE19;
        </button>
    );
}

function RequestCancelReservationButton({reservationID, status, setStatus}) {

    let buttonText = status === ReservationStatus.PENDING ? "Cancel" : "Request to Cancel";

    return (
        <ul class="rounded p-0 dropdown-menu">
            <li>
                {/* <!-- We have to manually make the terminate button darken upon hover because buttons need extra work to match the styling of dropdown-item --> */}
                <button type="button"
                    class="rounded dropdown-item delete-btn text-light"

                    onClick={(event) => {
                        let request = fetch(`http://localhost:8000/reservations/req_cancellation/${reservationID}/`,
                        {
                            method: "PUT",
                            headers: headers
                        });
                        request.then((response) => {
                            if (response.ok) {
                                if (status === ReservationStatus.PENDING) {
                                    setStatus(ReservationStatus.CANCELLED);
                                } else { // Status must be APPROVED
                                    setStatus(ReservationStatus.CANCELLATIONREQUESTED)
                                }
                            } else {
                                response.json().then((json) => console.log(json));
                            }
                        })}
                    }>
                    {buttonText}
                </button>
            </li>
        </ul>
    );
}

function OutgoingActionComponent({reservationID, status, setStatus}) {

    if ([ReservationStatus.PENDING, ReservationStatus.APPROVED].includes(status)) { // If you can cancel
        return (
            <>
            <ThreeDots></ThreeDots>
            <RequestCancelReservationButton reservationID={reservationID} status={status} setStatus={setStatus}></RequestCancelReservationButton>
            </>
        );
    }
}

function DenyReservationButton({reservationID, setStatus}) {
    return (
        <button type="button" class="btn rounded btn-sm delete-btn text-light"
            onClick={(event) => {
                let request = fetch(`http://localhost:8000/reservations/deny/${reservationID}/`,
                {
                    method: "PUT",
                    headers: headers
                });

                request.then((response) => {
                    if (response.ok) {
                        setStatus(ReservationStatus.DENIED);
                    }
                });
                
            }}>
            &#128473;
            </button>
    );
}

function ApproveReservationButton({reservationID, setStatus}) {
    return (
        <button type="button" class="btn rounded btn-sm approve-btn text-light"
            onClick={(event) => {
                let request = fetch(`http://localhost:8000/reservations/approve/${reservationID}/`,
                {
                    method: "PUT",
                    headers: headers
                });

                request.then((response) => {
                    if (response.ok) {
                        setStatus(ReservationStatus.APPROVED);
                    }
                });
                
            }}>
            &#10003;
            </button>
    );
}

function TerminateReservationButton({reservationID, setStatus}) {
    return (
        <button type="button" class="btn rounded btn-sm delete-btn text-light"
            onClick={(event) => {
                let request = fetch(`http://localhost:8000/reservations/terminate/${reservationID}/`,
                {
                    method: "PUT",
                    headers: headers
                });

                request.then((response) => {
                    if (response.ok) {
                        setStatus(ReservationStatus.TERMINATED);
                    }
                });
                
            }}>
            &#128473;
            </button>
    );
}

function DenyCancellationButton({reservationID, setStatus}) {
    return (
        <button type="button" class="btn rounded btn-sm delete-btn text-light"
            onClick={(event) => {
                let request = fetch(`http://localhost:8000/reservations/deny_cancellation_req/${reservationID}/`,
                {
                    method: "PUT",
                    headers: headers
                });

                request.then((response) => {
                    if (response.ok) {
                        setStatus(ReservationStatus.APPROVED);
                    }
                });
                
            }}>
            &#128473;
            </button>
    );
}

function ApproveCancellationButton({reservationID, setStatus}) {
    return (
        <button type="button" class="btn rounded btn-sm approve-btn text-light"
            onClick={(event) => {
                let request = fetch(`http://localhost:8000/reservations/cancel/${reservationID}/`,
                {
                    method: "PUT",
                    headers: headers
                });

                request.then((response) => {
                    if (response.ok) {
                        setStatus(ReservationStatus.CANCELLED);
                    }
                });
                
            }}>
            &#10003;
            </button>
    );
}

function IncomingApproveDenyButtons({reservationID, status, setStatus}) {

    let denyButton = undefined;

    let approveButton = undefined;

    if (status === ReservationStatus.PENDING) {
        denyButton = <DenyReservationButton reservationID={reservationID} setStatus={setStatus}></DenyReservationButton>;
        approveButton = <ApproveReservationButton reservationID={reservationID} setStatus={setStatus}></ApproveReservationButton>;
    } else if (status === ReservationStatus.APPROVED) {
        // Be able to terminate it
        denyButton = <TerminateReservationButton reservationID={reservationID} setStatus={setStatus}></TerminateReservationButton>
    } else if (status === ReservationStatus.CANCELLATIONREQUESTED) {
        denyButton = <DenyCancellationButton reservationID={reservationID} setStatus={setStatus}></DenyCancellationButton>
        approveButton = <ApproveCancellationButton reservationID={reservationID} setStatus={setStatus}></ApproveCancellationButton>
    }

    return (
        <>
            <td>
                <div>
                    <div>
                        {denyButton}
                    </div>
                </div>
            </td>
            <td>
                {approveButton}
            </td>
        </>

    );

}

function IncomingActionComponent({reservationID, status, setStatus}) {
    return <IncomingApproveDenyButtons reservationID={reservationID} status={status} setStatus={setStatus}></IncomingApproveDenyButtons>
}

function IncomingReservationRow({name, reservationID, propertyID, reserverID, imgPath, address, status, startDate, endDate, reserverName, reserverPicture}) {
    let statusStyle = "bg-primary";

    let [currentStatus, setCurrentStatus] = useState(status);

    let [filteredStatus, setFilteredStatus] = useContext(MyReservationsContext).filteredStatus;

    // Set colour of the pill to match the current status
    if ([ReservationStatus.CANCELLED, ReservationStatus.TERMINATED, ReservationStatus.DENIED].includes(currentStatus)) {
        statusStyle = "bg-danger";
    } else if ([ReservationStatus.EXPIRED, ReservationStatus.PENDING].includes(currentStatus)) {
        statusStyle = "bg-secondary";
    } else if ([ReservationStatus.APPROVED].includes(currentStatus)) {
        statusStyle = "bg-success";
    } else if ([ReservationStatus.COMPLETED].includes(currentStatus)) {
        statusStyle = "bg-primary";
    } else if ([ReservationStatus.CANCELLATIONREQUESTED].includes(currentStatus)) {
        statusStyle = "bg-warning";
    }

    let locationClass = `badge rounded-pill ${statusStyle}`;

    let ActionComponent = undefined;

    ActionComponent = 
        <div class="dropdown float-end">
            <IncomingActionComponent reservationID={reservationID} status={currentStatus} setStatus={setCurrentStatus}></IncomingActionComponent>
        </div>


    if (currentStatus.toLowerCase() === filteredStatus.toLowerCase() || filteredStatus.toLowerCase() === "no status filtered") {
        return (
            <tr class="reservation-row">
                <td>
                    <div>
                        <Link to={`/properties/view/${propertyID}`} class="no-decor">
                            <img src={imgPath}
                                class="reservation-img img-fluid" />
                            <p class="ms-2 text-nowrap d-inline reservation-row">{name}</p>
                        </Link>
                    </div>
                </td>
                <td>
                    {address}
                </td>
                <td class="text-center">
                    <Link to={`/accounts/profile/view/${reserverID}`} class="no-decor">
                        <img class="reserver-avatar"
                            src={reserverPicture}
                            className="reservation-img img-fluid" />
                        <p class="ms-2 text-nowrap d-inline reservation-row">{reserverName}</p>
                    </Link>
                </td>
                <td>
                    <span className={locationClass}>{currentStatus}</span>
                </td>
                <td>
                    {startDate}
                </td>
                <td>
                    {endDate}
                </td>
                <td>
                    {ActionComponent}
                </td>
            </tr>
        );
    } else {
        return <div></div>
    }
}

function ReservationRow({name, outgoingOrIncoming, reservationID, propertyID, imgPath, address, status, startDate, endDate}) {

    let statusStyle = "bg-primary";

    let [currentStatus, setCurrentStatus] = useState(status);

    let [filteredStatus, setFilteredStatus] = useContext(MyReservationsContext).filteredStatus;

    // Set colour of the pill to match the current status
    if ([ReservationStatus.CANCELLED, ReservationStatus.TERMINATED, ReservationStatus.DENIED].includes(currentStatus)) {
        statusStyle = "bg-danger";
    } else if ([ReservationStatus.EXPIRED, ReservationStatus.PENDING].includes(currentStatus)) {
        statusStyle = "bg-secondary";
    } else if ([ReservationStatus.APPROVED].includes(currentStatus)) {
        statusStyle = "bg-success";
    } else if ([ReservationStatus.COMPLETED].includes(currentStatus)) {
        statusStyle = "bg-primary";
    } else if ([ReservationStatus.CANCELLATIONREQUESTED].includes(currentStatus)) {
        statusStyle = "bg-warning";
    }

    let locationClass = `badge rounded-pill ${statusStyle}`;

    let ActionComponent = undefined;

    if (outgoingOrIncoming === "outgoing") {
        ActionComponent = (
            <div class="dropdown float-end">
                <OutgoingActionComponent reservationID={reservationID} status={currentStatus} setStatus={setCurrentStatus}></OutgoingActionComponent>
            </div>
        );
    } else {
        // TODO: IMPLEMENT THIS TO HAVE IncomingActionComponent
    }


    if (currentStatus.toLowerCase() === filteredStatus.toLowerCase() || filteredStatus.toLowerCase() === "no status filtered") {
        return (
            <>
            <tr class="reservation-row">
                <td>
                    <div>
                        <Link to={`/properties/view/${propertyID}`} class="no-decor">
                            <img src={imgPath}
                                class="reservation-img img-fluid" />
                            <p class="ms-2 text-nowrap d-inline reservation-row">{name}</p>
                        </Link>
                    </div>
                </td>
                <td>
                    {address}
                </td>
                <td>
                    <span className={locationClass}>{currentStatus}</span>
                </td>
                <td>
                    {startDate}
                </td>
                <td>
                    {endDate}
                </td>
                <td>
                    {ActionComponent}
                </td>
            </tr>
            </>
        );
    } else {
        return <div></div>
    }
}

function TestIncomingRow() {
    return (
        <tr class="reservation-row">
            <td>
                <div>
                    <a href="/csc309-restify/views/properties/property_view_host.html" class="no-decor">
                        <img src="/csc309-restify/resources/img/house.jpg"
                            class="reservation-img img-fluid" />
                        <p class="ms-2 text-nowrap d-inline reservation-row">Property 1</p>
                    </a>
                </div>
            </td>
            <td>
                123 Random Street, Boring, Oregon, USA
            </td>
            <td class="text-center">
                <a href="/csc309-restify/views/users/profile_view_host.html" class="no-decor">
                    <img class="reserver-avatar"
                        src="https://vectorified.com/images/generic-avatar-icon-1.jpg"
                        class="reservation-img img-fluid" />
                    <p class="ms-2 text-nowrap d-inline reservation-row">Albert Einstein</p>
                </a>
            </td>
            <td>
                <span class="badge rounded-pill bg-secondary">Pending</span>
            </td>
            <td>
                01/01/2023
            </td>
            <td>
                02/01/2023
            </td>
            <td>
                <div>
                    <div>
                        <button type="button" class="btn rounded btn-sm delete-btn text-light"
                            data-bs-toggle="modal" data-bs-target="#deny-modal">
                            &#128473;
                        </button>
                    </div>
                </div>
            </td>
            <td>
                <button type="button" class="btn rounded btn-sm approve-btn text-light"
                    data-bs-toggle="modal" data-bs-target="#accept-modal">
                    &#10003;
                </button>
            </td>
        </tr>
    );
}

function Reservations({incomingOrOutgoing, setPage, numPages}) {
    if (incomingOrOutgoing === "outgoing") {
        return (
            <div class="tab-content" id="nav-tabContent">
                <div class="tab-pane fade show active" id="outgoing-reservations" role="tabpanel"
                    aria-labelledby="outgoing-reservations-tab">
                    <div class="container">
                        <div class="table-responsive text-start overflow-auto">
                            <OutgoingTable></OutgoingTable>
                        </div>
                    </div>
                    <PageNumber setPage={setPage} numPages={numPages}></PageNumber>
                </div>
                
            </div>
        );
    } else {
        return (
            <div class="tab-content" id="nav-tabContent">
                <div class="tab-pane fade" id="nav-incoming-reservations" role="tabpanel"
                    aria-labelledby="nav-incoming-reservations-tab">
                    <div class="container">
                        <div class="table-responsive text-start overflow-auto">
                        <IncomingTable></IncomingTable>
                        </div>
                    </div>
                    <PageNumber setPage={setPage} numPages={numPages}></PageNumber>
                </div>
                
            </div>
        );
    }
}

// function IncomingTable() {
//     return (
//         <table class="table border align-middle table-hover">
//             <IncomingTableHeader></IncomingTableHeader>
//             <tbody class="table-group-divider">
//                 <TestIncomingRow></TestIncomingRow>
//             </tbody>
//         </table>
//     );
// }

function IncomingTable() {

    let [incomingReservations, setIncomingReservations] = useContext(MyReservationsContext).incomingReservations;
    let incomingReservationComponents = [];

    for (let incomingReservationDict of incomingReservations) {
        // console.log(incomingReservationDict);
        let propertyDict = incomingReservationDict.property;
        let propertyID = propertyDict.id;
        let reservationStatus = incomingReservationDict.status;
        let reservationStartDate = incomingReservationDict.start_date;
        let reservationEndDate = incomingReservationDict.end_date;
        let reservationID = incomingReservationDict.id;

        let reserverName = incomingReservationDict.reserver.first_name + " " + incomingReservationDict.reserver.last_name;
        let reserverPicture = incomingReservationDict.reserver.avatar;
        let reserverID = incomingReservationDict.reserver.id;


        let propertyName = propertyDict.name;
        let propertyLocation = propertyDict.address + ", " + propertyDict.state + ", "  + propertyDict.city + ", " + propertyDict.country;

        let propertyImage = propertyDict.property_images[0].image;

        let newComponent = <IncomingReservationRow 
            key={propertyID + reservationID}
            imgPath={propertyImage}
            name={propertyName}
            reservationID={reservationID}
            propertyID={propertyID}
            reserverID={reserverID}
            address={propertyLocation}
            status={reservationStatus}
            startDate={reservationStartDate}
            endDate={reservationEndDate}
            reserverName={reserverName}
            reserverPicture={reserverPicture}
            ></IncomingReservationRow>;

        // console.log(`COMPONENTS: ${[...incomingReservationComponents].concat(newComponent)}`);
        incomingReservationComponents = [...incomingReservationComponents].concat(newComponent);
    }

    return (
        <table class="table border align-middle table-hover">
            <IncomingTableHeader></IncomingTableHeader>
            <tbody class="table-group-divider">
                {incomingReservationComponents}
            </tbody>
        </table>
    );
}

function FilterDropdown() {

    let [filteredStatus, setFilteredStatus] = useContext(MyReservationsContext).filteredStatus;

    let buttons = [];

    for (let status of reservationStatusTypes) {
        buttons.push(<li>
            <button class="dropdown-item" onClick={(event) => {
            setFilteredStatus(status);
            }}>{status}</button>
        </li>);
    }

    return (
        <>
            <div class="dropdown">
                <button class="btn text-dark bg-transparent btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    {filteredStatus}
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li>
                        <button class="dropdown-item" onClick={(event) => {
                        setFilteredStatus("No Status Filtered");
                        }}>No Status Filtered</button>
                    </li>
                    {buttons}
                </ul>
            </div>
        </>
    );
}

async function loadReservations(outgoingReservations, setOutgoingReservations, incomingReservations, setIncomingReservations, outgoingPage, incomingPage, setNumOutgoingPages, setNumIncomingPages, filter) {
    for (let type of ["outgoing", "incoming"]) {
        let request = undefined;
        if (filter === "No Status Filtered") {
            request = fetch(`http://localhost:8000/reservations/retrieve/all/?type=${type}&page=${type === "outgoing" ? outgoingPage : incomingPage}`, {
                headers: headers
            });
        } else {
            request = fetch(`http://localhost:8000/reservations/retrieve/all/?type=${type}&page=${type === "outgoing" ? outgoingPage : incomingPage}&status=${filter}`, {
            headers: headers
            });
        }
        

        request.then((response) => {
            let jsonPromise = response.json();
            return jsonPromise
        }).then(json => {
            console.log(json)
            if (type === "outgoing") {
                setNumOutgoingPages(Math.ceil(parseInt(json.count) / 3));
            } else {
                setNumIncomingPages(Math.ceil(parseInt(json.count) / 3));

            }
            if (type === "outgoing") {
                setOutgoingReservations(json.results);
            } else {
                setIncomingReservations(json.results);
            }
        });
    }
}

function PageNumberElement({pageNum, setPage}) {
    return (
        <li class="page-item">
            <button onClick={() => {
                console.log("CLICK");
                setPage(pageNum);
            }} class="page-link" href="#">{pageNum}</button>
        </li>
    );
}

function PageNumber({numPages, setPage}) {
    let pageNumberComponents = [];

    for (let i = 0; i < numPages; i++) {
        pageNumberComponents.push(<PageNumberElement setPage={setPage} key={i + 1} pageNum={i + 1}></PageNumberElement>)
    }

    return (
        <ul class="pagination justify-content-center">
            {pageNumberComponents}
        </ul>
    );
}


export default function MyReservations() {

    const loginNavigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token") === null) {
            loginNavigate("/login/");
        }

    }, []);

    let [incomingReservations, setIncomingReservations] = useState([]);

    let [incomingReservationComponents, setIncomingReservationComponents] = useState([]);

    let [outgoingReservations, setOutgoingReservations] = useState([]);

    let [outgoingReservationComponents, setOutgoingReservationComponents] = useState([]);

    let [filteredStatus, setFilteredStatus] = useState("No Status Filtered");

    let [outgoingPage, setOutgoingPage] = useState(1);

    let [numOutgoingPages, setNumOutgoingPages] = useState(1);

    let [incomingPage, setIncomingPage] = useState(1);

    let [numIncomingPages, setNumIncomingPages] = useState(1);

    useEffect(() => {
        loadReservations(outgoingReservations, setOutgoingReservations, incomingReservations, setIncomingReservations, outgoingPage, incomingPage, setNumOutgoingPages, setNumIncomingPages, filteredStatus);
    }, []);

    useEffect(() => {
        setIncomingPage(1);
        setOutgoingPage(1);
        loadReservations(outgoingReservations, setOutgoingReservations, incomingReservations, setIncomingReservations, 1, 1, setNumOutgoingPages, setNumIncomingPages, filteredStatus);
        
    }, [filteredStatus]);

    useEffect(() => {
        loadReservations(outgoingReservations, setOutgoingReservations, incomingReservations, setIncomingReservations, outgoingPage, incomingPage, setNumOutgoingPages, setNumIncomingPages, filteredStatus);
    }, [outgoingPage, incomingPage]);

    

    

    return (
        <main class="card d-block">
            <Header></Header>
            <MyReservationsContext.Provider value={
            {
                outgoingReservations: [outgoingReservations, setOutgoingReservations],
                outgoingReservationComponents: [outgoingReservationComponents, setOutgoingReservationComponents],
                incomingReservations: [incomingReservations, setIncomingReservations],
                filteredStatus: [filteredStatus, setFilteredStatus]
            }}>
                <NavigationTabs></NavigationTabs>
                <Reservations incomingOrOutgoing={"outgoing"} setPage={setOutgoingPage} numPages={numOutgoingPages}></Reservations>
                <Reservations incomingOrOutgoing={"incoming"} setPage={setIncomingPage} numPages={numIncomingPages}></Reservations>
            </MyReservationsContext.Provider>
            <Footer></Footer>
        </main>
    );
}