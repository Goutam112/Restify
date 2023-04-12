import { useEffect, useState, React, createContext, useContext } from "react"

// import the global app CSS
import '../../assets/app.css'

import '../CreateProperty/style.css';

import { useNavigate, useParams } from 'react-router-dom'

// import {
//     PropertyNameField,
//     PropertyLocationFields, 
//     PropertyDescription, 
//     PropertyImage,
//     NumGuestsSlider,
//     NumBedsSlider,
//     NumBathsSlider,
//     Amenity,
//     Amenities,
//     NightlyPrice,
//     MonthPrice,
//     CustomPricing,
//     SubmitButton
// } from '../CreateProperty/CreateProperty';


const headers = new Headers();
// headers.append('Content-Type', 'application/json');
headers.append('Authorization', `${localStorage.getItem("authorizationToken")}`);

let CreatePropertyContext = createContext();

export function PropertyNameField() {
    let [propertyName, setPropertyName] = useContext(CreatePropertyContext).propertyName;
    return (
        <div className="row mb-3">
            <label className="form-label">Property Name
                <input type="email" value={propertyName} className="form-control" onChange={(event) => {
                    setPropertyName(event.target.value);
                }} />
            </label>
        </div>
    );
}

export function PropertyLocationFields() {
    let [propertyCountry, setPropertyCountry] = useContext(CreatePropertyContext).country;
    let [propertyAddress, setPropertyAddress] = useContext(CreatePropertyContext).propertyAddress;
    let [propertyCity, setPropertyCity] = useContext(CreatePropertyContext).city;
    let [propertyProvince, setPropertyProvince] = useContext(CreatePropertyContext).province;

    return <>
    <div className="row">
        <label>Country
            <div className="mb-3 input-group">
                <input type="text" value={propertyCountry} className="form-control" onChange={(event) => {
                    setPropertyCountry(event.target.value);
                }} />
            </div>
        </label>
    </div>

    <div className="row">
        <label>Province/State
            <div className="input-group mb-3">
                <input type="text" value={propertyProvince} className="form-control" onChange={(event) => {
                    setPropertyProvince(event.target.value);
                }}/>
            </div>
        </label>
    </div>

    <div className="row">
        <label>City
            <div className="input-group mb-3">
                <input type="text" value={propertyCity} className="form-control" onChange={(event) => {
                    setPropertyCity(event.target.value);
                }} />
            </div>
        </label>
    </div>

    <div className="row mb-3">
        <label className="form-label">Street Address
            <input type="text" value={propertyAddress} className="form-control" onChange={(event) => {
                setPropertyAddress(event.target.value);
            }}/>
        </label>
    </div>

    </>
}

export function PropertyDescription() {
    let [description, setDescription] = useContext(CreatePropertyContext).propertyDescription;
    return (
    <div className="row mb-3">
        <label className="form-label">Description
            <textarea type="text" value={description} className="form-control" rows="6" onChange={(event) => {
                setDescription(event.target.value);
            }}></textarea>
        </label>
    </div>
    );
}

// export function PropertyImage({number, imgPath}) {

//     let [propertyImages, setPropertyImages] = useContext(CreatePropertyContext).propertyImages
//     let [propertyImageURLs, setPropertyImageURLs] = useContext(CreatePropertyContext).propertyImageURLs

//     return (
//         <div className="image-upload">
//             <label htmlFor={`img${number}`}>
//                     <div className="img-container">
//                         <img className="image-editable"
//                             src={imgPath} />
//                         {/* <!-- "Edit" icon--> */}
//                         {/* <!-- Make it unclickable so that hover doesn't break when it's on top --> */}
//                         <i className="unclickable img-icon-centered text-black bi bi-pencil-square"></i>
//                     </div>
//             </label>
            
//             <input id={`img${number}`} type="file" onChange={(event) => {
//                 let image = event.target.files[0];
//                 let imgURL = URL.createObjectURL(image);

//                 let newPropertyImages = [...propertyImages];
//                 newPropertyImages[number] = image;
//                 setPropertyImages(newPropertyImages)
//                 let newPropertyImageURLs = [...propertyImageURLs];
//                 newPropertyImageURLs[number] = imgURL;

//                 // console.log(number);
//                 // console.log(newPropertyImageURLs);

//                 setPropertyImageURLs(newPropertyImageURLs)
//                 }} />
//         </div>
//     );
// }

export function PropertyImage({number}) {

    let [propertyImages, setPropertyImages] = useContext(CreatePropertyContext).propertyImages
    let [propertyImageURLs, setPropertyImageURLs] = useContext(CreatePropertyContext).propertyImageURLs

    return (
        <div className="image-upload">
            <label htmlFor={`img${number}`}>
                    <div className="img-container">
                        <img className="image-editable"
                            src={propertyImageURLs[number]} />
                        {/* <!-- "Edit" icon--> */}
                        {/* <!-- Make it unclickable so that hover doesn't break when it's on top --> */}
                        <i className="unclickable img-icon-centered text-black bi bi-pencil-square"></i>
                    </div>
            </label>
            
            <input id={`img${number}`} type="file" onChange={(event) => {
                let image = event.target.files[0];
                let imgURL = URL.createObjectURL(image);

                let newPropertyImages = [...propertyImages];
                newPropertyImages[number] = image;
                setPropertyImages(newPropertyImages)
                let newPropertyImageURLs = [...propertyImageURLs];
                newPropertyImageURLs[number] = imgURL;

                // console.log(number);
                // console.log(newPropertyImageURLs);

                setPropertyImageURLs(newPropertyImageURLs)
                console.log(`CHANGED PICTURE ${number} TO ${imgURL}`)
                }} />
        </div>
    );
}

export function PropertyImages() {
    let propertyImageComponents = [];
    for (let i = 0; i < 6; i++) {
        propertyImageComponents.push(<PropertyImage key={i} number={i}></PropertyImage>)
    }
    return propertyImageComponents;
}

export function NumGuestsSlider() {
    let [numGuests, setNumGuests] = useContext(CreatePropertyContext).numGuests;
    return (
        <div class="row form-group">
            <label for="formControlRange">Maximum Number of Guests: <span id="num-guests-value">{numGuests}</span>
                <input type="range" class="form-range" min="1" max="20" id="num-guests-slider"
                value={numGuests} onChange={(event) => setNumGuests(event.target.value)} />
            </label>
          </div>
    );
}

export function NumBedsSlider() {
    let [numBeds, setNumBeds] = useContext(CreatePropertyContext).numBeds;
    return (
        <div class="row form-group">
            <label for="formControlRange">Beds: <span id="num-beds-value">{numBeds}</span>
                <input type="range" class="form-range" min="0" max="10" id="num-beds-slider"
                value={numBeds} onChange={(event) => { setNumBeds(event.target.value) }} />
            </label>
        </div>
    );
}

export function NumBathsSlider() {
    let [numBaths, setNumBaths] = useContext(CreatePropertyContext).numBaths;
    return (
        <div class="row form-group">
            <label for="formControlRange">Baths: <span id="num-baths-value">{numBaths}</span>
            <input type="range" class="form-range" min="0" max="10" id="num-baths-slider"
                value={numBaths} onChange={(event) => setNumBaths(event.target.value)} />
            </label>
        </div>
    )
}


export function Amenity({amenityName, defaultChecked}) {
    let [amenities, setAmenities] = useContext(CreatePropertyContext).amenities;
    let [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        setIsChecked(amenities.includes(amenityName));
    }, [amenities]);

    // if (defaultChecked) {
    //     setIsChecked(true);
    // }

    // console.log(`IS CHECKED: ${isChecked}`);
    // console.log(`DEFAULT CHECKED: ${defaultChecked}`);

    return (
        <div class="me-3 form-check">
            <input class="form-check-input" type="checkbox" onChange={(event) => {
                if (!amenities.includes(amenityName)) {
                    // setIsChecked(true);
                    let newAmenitiesList = [...amenities];
                    newAmenitiesList.push(amenityName);
                    setAmenities(newAmenitiesList);
                    // event.target.checked = "";
                } else {
                    // setIsChecked(false);
                    // Remove this amenity from the list
                    let newAmenitiesList = [...amenities];
                    newAmenitiesList.splice(amenities.indexOf(amenityName), 1);
                    setAmenities(newAmenitiesList);
                    // event.target.checked = "on";
                }
            }} id={amenityName} checked={isChecked}/>
            <label class="form-check-label" for={amenityName}>
            {amenityName}
            </label>
        </div>
    );
}

// export function Amenity({amenityName}) {
    // let [amenities, setAmenities] = useContext(CreatePropertyContext).amenities;
    // let [isChecked, setIsChecked] = useState(false);
    // return (
    //     <div class="me-3 form-check">
    //         <input class="form-check-input" type="checkbox" onChange={(event) => {
    //             if (!isChecked) {
    //                 setIsChecked(true);
    //                 let newAmenitiesList = [...amenities];
    //                 newAmenitiesList.push(amenityName);
    //                 setAmenities(newAmenitiesList);
    //             } else {
    //                 setIsChecked(false);
    //                 // Remove this amenity from the list
    //                 let newAmenitiesList = [...amenities];
    //                 newAmenitiesList.splice(amenities.indexOf(amenityName), 1);
    //                 setAmenities(newAmenitiesList);
    //             }
    //         }} id={amenityName} />
    //         <label class="form-check-label" for={amenityName}>
    //         {amenityName}
    //         </label>
    //     </div>
    // );
// }

export function Amenities() {
    let [ amenities, setAmenities ] = useContext(CreatePropertyContext).amenities;
    // let existingAmenities = [];
    // for (let existingAmenity in amenities) {
    //     existingAmenities.push(existingAmenity)
    // }
    // console.log(existingAmenities);
    let newAmenities = [];
    // let amenities = [];
    let possibleAmenities = ["Indoor Pool", "Kitchen", "WiFi", "Backyard"]
    // console.log(`Existing amenities: ${amenities}`);
    // console.log(`possible amenities: ${possibleAmenities}`)
    for (let i = 0; i < possibleAmenities.length; i++) {
        let amenityInArr = possibleAmenities[i]
        if (amenities.includes(amenityInArr)) {
            // console.log(`amenityInArr succeeded: ${amenityInArr}`);
            newAmenities.push(<Amenity key={i} amenityName={amenityInArr} defaultChecked={true}></Amenity>)
        } else {
            // console.log(`amenityInArr: ${amenityInArr}`);
            newAmenities.push(<Amenity key={i} amenityName={amenityInArr} defaultChecked={false}></Amenity>)
        }
    };
    return (
        <div class="mb-3">
            <h5>Amenities</h5>
            <div class="d-flex flex-wrap flex-row justify-content-start">
                {newAmenities}
            </div>
        </div>
    );
}

// export function Amenities() {
    // let amenities = [];
    // let possibleAmenities = ["Indoor Pool", "Kitchen", "WiFi", "Backyard"]
    // for (let amenity of possibleAmenities) {
    //     amenities.push(<Amenity amenityName={amenity}></Amenity>)
    // };
    // return (
    //     <div class="mb-3">
    //         <h5>Amenities</h5>
    //         <div class="d-flex flex-wrap flex-row justify-content-start">
    //             {amenities}
    //         </div>
    //     </div>
    // );
// }

export function NightlyPrice() {
    let [nightlyPrice, setNightlyPrice] = useContext(CreatePropertyContext).nightlyPrice;
    return (
        <>
        <h3>Pricing</h3>

          <label for="nightly-price-input">Default Nightly Price</label>
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="">$</span>
            </div>
            <input type="number" min={0} class="form-control" id="nightly-price-input" value={nightlyPrice} onChange={(event) => {
                setNightlyPrice(event.target.value);
                console.log(event.target.value);
            }} />
          </div>

          <div class="mb-3">
            <div class="form-text">
              Here, you can control:
            </div>
            <div class="form-text">
              - Which months guests are not allowed to check-in to this property
            </div>
            <div class="form-text">
              - Custom nightly rates for each month, as a percentage of the regular nightly rate
            </div>
          </div>
        </>
    );
}

export function MonthPrice({month, monthNumber}) {
    let [priceModifiers, setPriceModifiers] = useContext(CreatePropertyContext).priceModifiers;
    let [monthsAvailable, setMonthsAvailable] = useContext(CreatePropertyContext).monthsAvailable;
    // let [isChecked, setIsChecked] = useState(false);

    // let checkedByDefault = monthsAvailable[monthNumber - 1] === true ? false : true;

    let checkedByDefault = monthsAvailable[monthNumber - 1] === true ? false : true;

    return (
        <tr>
            <td>{month}</td>
            <td class="text-center">
                <input class="form-check-input" type="checkbox" checked={checkedByDefault} onChange={(event) => {
                    let newMonthsAvailable = [...monthsAvailable];
                    if (event.target.checked) {
                        newMonthsAvailable[monthNumber - 1] = false;
                    } else {
                        newMonthsAvailable[monthNumber - 1] = true;
                    }

                    console.log(`Month ${month} is now ${newMonthsAvailable[month - 1]}`);
                    console.log(monthsAvailable);

                    setMonthsAvailable(newMonthsAvailable);
                    // setIsChecked(!isChecked);
                    
                }}/>
            </td>
            <td class="text-center">
            <div class="input-group input-group-sm mb-3">
                <input type="number" min={1} max={999}  class="form-control" placeholder="100"
                value={priceModifiers[monthNumber - 1]} onChange={(event) => {
                    let newPriceModifiers = [...priceModifiers]
                    newPriceModifiers[monthNumber - 1] = parseInt(event.target.value);
                    console.log(newPriceModifiers);
                    setPriceModifiers(newPriceModifiers)
                    event.target.value = priceModifiers[monthNumber - 1];
                }} />
                <span class="input-group-text" id="">%</span>
            </div>
            </td>
        </tr>
    );
}

export function CustomPricing() {

    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let monthRows = [];

    for (let i = 0; i < 12; i++) {
        let month = months[i];
        monthRows.push(<MonthPrice month={month} monthNumber={i + 1} />);
    }

    return (
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                <tr>
                    <th class="" scope="col">Month</th>
                    <th class="text-center" scope="col">Not Available?</th>
                    <th class="text-center" scope="col">Percentage of nightly price</th>
                </tr>
                </thead>
                <tbody>
                    {monthRows}
                </tbody>
            </table>
        </div>
    );
}

export function SubmitButton() {

    let context = useContext(CreatePropertyContext);

    let [propertyName, ] = useContext(CreatePropertyContext).propertyName;

    let [country, ] = context.country;

    let [province, ] = context.province;

    let [city, ] = context.city;

    let [propertyAddress, ] = context.propertyAddress;

    let [propertyDescription, ] = context.propertyDescription;

    let [propertyImages, ] = context.propertyImages;

    let [propertyImageURLs, ] = context.propertyImageURLs

    let [numGuests, ] = context.numGuests;

    let [numBeds, ] = context.numBeds;

    let [numBaths, ] = context.numBaths;

    let [amenities, ] = context.amenities;

    let [nightlyPrice, ] = context.nightlyPrice;

    let [priceModifiers, ] = context.priceModifiers;

    let [monthsAvailable, ] = context.monthsAvailable;

    let transformedAmenities = [];

    for (let i = 0; i < amenities.length; i++) {
        let amenityName = amenities[i];
        transformedAmenities.push({"name": amenityName})
    }

    let transformedPriceModifiers = [];

    for (let i = 0; i < priceModifiers.length; i++) {
        let priceModifier = parseFloat(priceModifiers[i]);
        transformedPriceModifiers.push({"month": Number(i) + 1, "price_modifier": priceModifier / 100});
        // console.log(transformedPriceModifiers);
    }

    let transformedMonthsAvailable = [];

    for (let i = 0; i < monthsAvailable.length; i++) {
        let isAvailable = monthsAvailable[i];
        transformedMonthsAvailable.push({"month": Number(i) + 1, "is_available": isAvailable});
    }

    let formData = new FormData();

    formData.append('price_modifiers', JSON.stringify(transformedPriceModifiers));

    console.log(`Image URLs: ${propertyImageURLs}`)

    // for (let i = 0; i < propertyImages.length; i++) {
    //     let image = propertyImages[i];
    //     if (image !== undefined) {
    //         console.log(`PICTURE ${i} SUCCESSFULLY ADDED`)
    //         formData.append("property_images", image)
    //     } else {
    //         console.log(`PICTURE ${i} IS UNDEFINED`)
    //     }
    // }

    // for (let image of propertyImages) {
    //     if (image !== undefined) {
    //         formData.append("property_images", image)
    //     }
    // }

    

    formData.append('amenities', JSON.stringify(transformedAmenities));
    // formData.append('month_availabilities', JSON.stringify([{"month": 1, "is_available": true}]));
    formData.append('month_availabilities', JSON.stringify(transformedMonthsAvailable));
    formData.append('name', propertyName);
    formData.append('description', propertyDescription);
    formData.append('address', propertyAddress);
    formData.append('country', country);
    formData.append('state', province);
    formData.append('city', city);
    formData.append('max_num_guests', numGuests);
    formData.append('num_beds', numBeds);
    formData.append('num_baths', numBaths);
    formData.append('nightly_price', nightlyPrice);

    const navigate = useNavigate();

    let { propertyID } = useParams();


    let dataIsValid = true;

    let validationStrings = [];

    if (propertyName.length === 0) {
        dataIsValid = false;
        validationStrings.push(<div>Property name cannot be empty.</div>);
    }

    if (country.length === 0 || province.length === 0 || city.length === 0 || propertyAddress.length === 0) {
        dataIsValid = false;
        validationStrings.push(<div>Property location fields cannot be empty.</div>);
    }

    console.log(typeof(propertyDescription));
    if (propertyDescription === undefined) {
        dataIsValid = false;
        validationStrings.push(<div>Property description cannot be empty.</div>);
    }
    
    if (isNaN(nightlyPrice)) {
        dataIsValid = false;
        validationStrings.push(<div>Nightly price cannot be empty.</div>);
    }

    if (priceModifiers.includes(NaN)) {
        dataIsValid = false;
        validationStrings.push(<div>Price modifiers cannot be empty.</div>);
    }



    return (
        <>
        <input type="submit" value={"Edit Property"} className="btn btn-primary" data-bs-toggle={!dataIsValid ? "modal" : ""} data-bs-target={!dataIsValid ? "#exampleModal" : ""} onClick={(event) => {
            event.preventDefault();

            let response = fetch("http://localhost:8000/accounts/currentuser/",
            {
                headers: headers,
                method: "GET"
            });

            if (!dataIsValid) {
                return;
            }

            let owner = undefined;

            response.then((response) => {
                return response.json(); // returns promise   
            }).then((json) => {
                // console.log(json);
                // console.log(localStorage.getItem("authorizationToken"));
                // console.log(JSON.stringify(json));
                owner = json.id;
                formData.append('owner', owner);

                // Create an object to hold the key-value pairs
                const formDataObj = {};

                // Loop through the FormData entries and add them to the object
                for (const [key, value] of formData.entries()) {
                    formDataObj[key] = value;
                }

                // Convert the object to a JSON string
                const formDataJson = JSON.stringify(formDataObj);

                console.log("FORM DATA: " + formDataJson);

                console.log(JSON.stringify(transformedPriceModifiers));

                console.log(JSON.stringify(transformedAmenities));


                formData.delete("property_images")

                for (let i = 0; i < propertyImages.length; i++) {
                    let image = propertyImages[i];
                    if (image !== undefined) {
                        console.log(`PICTURE ${i} SUCCESSFULLY ADDED`)
                        formData.append("property_images", image)
                    } else {
                        console.log(`PICTURE ${i} IS UNDEFINED`)
                    }
                }


                let request = fetch(`http://localhost:8000/properties/update/${propertyID}/`, {
                    headers: headers,
                    method: 'PUT',
                    body: formData
                });

                

                request.then((response) => {
                    // console.log(response);
                    // if (response.ok) {
                    console.log(response);
                    return response.json();
                    // } 
                }).then((json) => {
                    console.log("JSON: ")
                    console.log(json);
                    navigate('/properties/')
                })
            });
        }} />
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                {validationStrings}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
            </div>
        </div>
        </div>
        </>
    );
}

export default function UpdateProperty() {

    let [propertyName, setPropertyName] = useState('');

    let [country, setCountry] = useState('');

    let [province, setProvince] = useState('');

    let [city, setCity] = useState('');

    let [propertyAddress, setPropertyAddress] = useState('');

    let [propertyDescription, setPropertyDescription] = useState();

    let [propertyImages, setPropertyImages] = useState([undefined, undefined, undefined, undefined, undefined, undefined]);

    let [propertyImageURLs, setPropertyImageURLs] = useState([
        "https://www.pngkey.com/png/detail/233-2332677_image-500580-placeholder-transparent.png",
        "https://www.pngkey.com/png/detail/233-2332677_image-500580-placeholder-transparent.png",
        "https://www.pngkey.com/png/detail/233-2332677_image-500580-placeholder-transparent.png",
        "https://www.pngkey.com/png/detail/233-2332677_image-500580-placeholder-transparent.png",
        "https://www.pngkey.com/png/detail/233-2332677_image-500580-placeholder-transparent.png",
        "https://www.pngkey.com/png/detail/233-2332677_image-500580-placeholder-transparent.png"
    ]);

    // let [propertyImageComponents, setPropertyImageComponents] = useState([]);

    let [numGuests, setNumGuests] = useState(1);

    let [numBeds, setNumBeds] = useState(0);

    let [numBaths, setNumBaths] = useState(0);

    let [amenities, setAmenities] = useState([]);

    let [nightlyPrice, setNightlyPrice] = useState(0);

    let [priceModifiers, setPriceModifiers] = useState(Array(12).fill(100));

    let [monthsAvailable, setMonthsAvailable] = useState(Array(12).fill(true));


    let { propertyID } = useParams();

    let request = fetch(`http://localhost:8000/properties/update/${propertyID}/`, {
        headers: headers
    });

    useEffect(() => {
        console.log("NEW IMAGE DETECTED");
        console.log("CURRENT NUMBER OF NON-UNDEFINED IMAGES:")
        console.log(propertyImages.filter(function(value) { return value !== undefined }).length);
    }, [propertyImages]);

    useEffect(() => {
        request.then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json);
            let retrievedData = {
                address: json.address,
                amenities: json.amenities,
                city: json.city,
                country: json.country,
                description: json.description,
                id: json.id,
                maxNumGuests: json.max_num_guests,
                name: json.name,
                nightlyPrice: json.nightly_price,
                numBaths: json.num_baths,
                numBeds: json.num_beds,
                owner: json.owner,
                priceModifiers: json.price_modifiers,
                // monthsAvailable: json.months_available,
                propertyImages: json.property_images,
                province: json.state
            }
            
            // console.log("Retrieved data:");
            // console.log(retrievedData);
    
            setPropertyAddress(retrievedData.address);
            setCity(retrievedData.city);
            setPropertyName(retrievedData.name);
            setCountry(retrievedData.country);
            setPropertyDescription(retrievedData.description);
            setNumGuests(retrievedData.maxNumGuests)
            setPropertyName(retrievedData.name);
            setNightlyPrice(retrievedData.nightlyPrice);
            setNumBaths(retrievedData.numBaths);
            setNumBeds(retrievedData.numBeds);
            setProvince(retrievedData.province);
            
            
            let nonJsonifiedAmenities = [];
            for (let amenityDict of retrievedData.amenities) {
                nonJsonifiedAmenities.push(amenityDict.name)
            }
            // console.log(nonJsonifiedAmenities);
            setAmenities(nonJsonifiedAmenities);
            
            let existingPriceModifiers = Array(12).fill(undefined);

            // console.log(json);
            // console.log(json.price_modifiers);
            // console.log(json.price_modifiers[0])
            for (let i = 0; i < json.price_modifiers.length; i++) {
                console.log(json.price_modifiers[i])
                let month = json.price_modifiers[i].month;
                let priceModifier = json.price_modifiers[i].price_modifier;
                existingPriceModifiers[month - 1] = priceModifier * 100;
            }

            setPriceModifiers(existingPriceModifiers)

            let existingAvailableMonths = Array(12).fill(true);

            for (let i = 0; i < json.month_availabilities.length; i++) {
                let month = json.month_availabilities[i].month;
                let isAvailable = json.month_availabilities[i].is_available;
                existingAvailableMonths[month - 1] = isAvailable;
            }

            setMonthsAvailable(existingAvailableMonths);

            // console.log(existingPriceModifiers);

            // console.log("GOT HERE")

            // console.log(`EXISTING PRICE MODIFIERS: ${existingPriceModifiers}`);

            // let existingPropertyImages = [];
            let existingPropertyImageURLs = [];
            
            // setPropertyImages();
            for (let i = 0; i < json.property_images.length; i++) {



                let imageURL = json.property_images[i].image;
                console.log(`Setting image ${i} to ${imageURL}`);
                // console.log("IMAGE: " + imageURL)
                // console.log(`IMAGE: ${json.property_images[i]}`)
                // let imageURL = URL.createObjectURL(image);

                // existingPropertyImages.push(imageURL);
                existingPropertyImageURLs.push(imageURL);

                // console.log(existingPropertyImageURLS);
            }
            // setPropertyImages(existingPropertyImages);
            setPropertyImageURLs(existingPropertyImageURLs);
            // setPropertyImageComponents();

            // let imageBlobs = [];

            console.log(`Received ${existingPropertyImageURLs}`)

            let newPropertyImages = [...propertyImages];
            
            for (let i = 0; i < existingPropertyImageURLs.length; i++) {
            // for (let propertyImageURL of existingPropertyImageURLs) {
                let propertyImageURL = existingPropertyImageURLs[i];
                // console.log(`PROPERTY IMAGE URL: ${propertyImageURL}`);

                // let img = new Image();
                // img.src = propertyImageURL;

                // imageBlobs.push(img);

                const request = fetch(propertyImageURL, {
                    method: 'GET',
                    headers: headers,
                });
                request.then((response) => {
                    console.log(propertyImageURLs)
                    console.log(`Converting ${propertyImageURL} to blob...`)
                    return response;
                }).then((response) => {
                    // let json = response.json();
                    // json.then(() => {
                    //     console.log(json);
                    // });

                    let blobReq = response.blob();

                    blobReq.then((blob) => {
                        // console.log(`PROPERTY IMAGE URL: ${propertyImageURL}`);
                        
                        if (blob === undefined) {
                            console.log(`ERROR: Unsuccessful conversion for ${propertyImageURL}.`)

                            // newPropertyImages[i] = blob
                            // setPropertyImages(newPropertyImages);
                        } else {

                            let file = new File([blob], `image_${i}.png`, {type: blob.type, lastModified:new Date()});

                            console.log(file);

                            console.log(`PROPERTY IMAGE URLS: ${existingPropertyImageURLs}`)

                            newPropertyImages[i] = file
                            setPropertyImages(newPropertyImages);
                        }
                        
                        // setPropertyImages([]);
                    });
                    
                }).catch((error) => {
                    console.log(error);
                });
            }
            // setPropertyImages(imageBlobs);
        });

    }, [])

    // setAmenities(["Pool", "thing"]);

    
    

    // useEffect(() => {

    //     setPropertyImageComponents([])

    //     let imgComponents = []

    //     for (let i = 0; i < 6; i++) {

    //         let imgURL = propertyImageURLs[i];
            
    //         imgComponents.push(<PropertyImage key={i} number={i} imgPath={imgURL}></PropertyImage>);
    //     }

    //     setPropertyImageComponents(imgComponents)
    // }
    // , [propertyImages]);

    return (
        <main className="card d-block">
            <div className="container">
                <div>
                    <h1 className="text-center mb-4">Edit This Property</h1>
                </div>

                <h2 className="mb-3">General</h2>

                <form method="POST">
                    <CreatePropertyContext.Provider value={
                    {
                        propertyName: [propertyName, setPropertyName], 
                        country: [country, setCountry],
                        province: [province, setProvince],
                        city: [city, setCity],
                        propertyDescription: [propertyDescription, setPropertyDescription],
                        propertyAddress: [propertyAddress, setPropertyAddress],
                        propertyImages: [propertyImages, setPropertyImages],
                        propertyImageURLs: [propertyImageURLs, setPropertyImageURLs],
                        numGuests: [numGuests, setNumGuests],
                        numBeds: [numBeds, setNumBeds],
                        numBaths: [numBaths, setNumBaths],
                        amenities: [amenities, setAmenities],
                        nightlyPrice: [nightlyPrice, setNightlyPrice],
                        priceModifiers: [priceModifiers, setPriceModifiers],
                        monthsAvailable: [monthsAvailable, setMonthsAvailable]
                    }}>
                        <PropertyNameField></PropertyNameField>
                        <PropertyLocationFields></PropertyLocationFields>
                        <PropertyDescription></PropertyDescription>
                        {/* <PropertyImages propertyImageComponents={propertyImageComponents} setPropertyImageComponents={setPropertyImageComponents}></PropertyImages> */}
                        {/* {propertyImageComponents} */}
                        <PropertyImages></PropertyImages>
                        <NumGuestsSlider></NumGuestsSlider>
                        <NumBedsSlider></NumBedsSlider>
                        <NumBathsSlider></NumBathsSlider>
                        <Amenities></Amenities>
                        <NightlyPrice></NightlyPrice>
                        <CustomPricing></CustomPricing>
                        
                        <SubmitButton></SubmitButton>
                    </CreatePropertyContext.Provider>
                </form>
            </div>
        </main>
    );
}


