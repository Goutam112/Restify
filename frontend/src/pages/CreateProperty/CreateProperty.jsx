import { useEffect, useState, React, createContext, useContext } from "react"

// import the global app CSS
import '../../assets/app.css'

// import our page specific CSS file
import './style.css'

import { useNavigate } from 'react-router-dom'

import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'

const headers = new Headers();
// headers.append('Content-Type', 'application/json');
headers.append('Authorization', `Bearer ${localStorage.getItem("token")}`);

let CreatePropertyContext = createContext();

export function PropertyNameField() {
    let [propertyName, setPropertyName] = useContext(CreatePropertyContext).propertyName;
    return (
        <div className="row mb-3">
            <label className="form-label">Property Name
                <input required type="text" className="form-control" onChange={(event) => {
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
                <input type="text" className="form-control" onChange={(event) => {
                    setPropertyCountry(event.target.value);
                }} />
            </div>
        </label>
    </div>

    <div className="row">
        <label>Province/State
            <div className="input-group mb-3">
                <input type="text" className="form-control" onChange={(event) => {
                    setPropertyProvince(event.target.value);
                }}/>
            </div>
        </label>
    </div>

    <div className="row">
        <label>City
            <div className="input-group mb-3">
                <input type="text" className="form-control" onChange={(event) => {
                    setPropertyCity(event.target.value);
                }} />
            </div>
        </label>
    </div>

    <div className="row mb-3">
        <label className="form-label">Street Address
            <input type="text" className="form-control" onChange={(event) => {
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
            <textarea type="text" className="form-control" rows="6" onChange={(event) => {
                setDescription(event.target.value);
            }}></textarea>
        </label>
    </div>
    );
}

export function PropertyImage({number, imgPath}) {

    // const handleImageUpload = (event) => {
    //     const imageFile = event.target.files[0];
    //     // Do something with the selected file
    //     return imageFile;
    //   };

    let [propertyImages, setPropertyImages] = useContext(CreatePropertyContext).propertyImages
    let [propertyImageURLs, setPropertyImageURLs] = useContext(CreatePropertyContext).propertyImageURLs

    return (
        <div className="image-upload">
            <label htmlFor={`img${number}`}>
                    <div className="img-container">
                        <img className="image-editable"
                            src={imgPath} />
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
                }} />
        </div>
    );
}

// function PropertyImages({propertyImageComponents, setPropertyImageComponents}) {

//     // let images = []

//     setPropertyImageComponents = []

//     for (let i = 0; i < 6; i++) {
//         propertyImageComponents.push(<PropertyImage key={i} number={i}></PropertyImage>);
//     }

//     return propertyImageComponents;
// }

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

export function Amenity({amenityName}) {
    let [amenities, setAmenities] = useContext(CreatePropertyContext).amenities;
    let [isChecked, setIsChecked] = useState(false);
    return (
        <div class="me-3 form-check">
            <input class="form-check-input" type="checkbox" onChange={(event) => {
                if (!isChecked) {
                    setIsChecked(true);
                    let newAmenitiesList = [...amenities];
                    newAmenitiesList.push(amenityName);
                    setAmenities(newAmenitiesList);
                } else {
                    setIsChecked(false);
                    // Remove this amenity from the list
                    let newAmenitiesList = [...amenities];
                    newAmenitiesList.splice(amenities.indexOf(amenityName), 1);
                    setAmenities(newAmenitiesList);
                }
            }} id={amenityName} />
            <label class="form-check-label" for={amenityName}>
            {amenityName}
            </label>
        </div>
    );
}

export function Amenities() {
    let amenities = [];
    let possibleAmenities = ["Indoor Pool", "Kitchen", "WiFi", "Backyard"]
    for (let amenity of possibleAmenities) {
        amenities.push(<Amenity amenityName={amenity}></Amenity>)
    };
    return (
        <div class="mb-3">
            <h5>Amenities</h5>
            <div class="d-flex flex-wrap flex-row justify-content-start">
                {amenities}
            </div>
        </div>
    );
}

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
                setNightlyPrice(parseInt(event.target.value));
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
    return (
        <tr>
            <td>{month}</td>
            <td class="text-center">
            <input class="form-check-input" type="checkbox" onChange={(event) => {
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

    for (let image of propertyImages) {
        if (image !== undefined) {
            formData.append("property_images", image)
        }
    }

    formData.append('amenities', JSON.stringify(transformedAmenities));
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
        <input value={"Create Property"} type="submit" className="btn btn-primary" data-bs-toggle={!dataIsValid ? "modal" : ""} data-bs-target={!dataIsValid ? "#exampleModal" : ""} onClick={(event) => {
            event.preventDefault();

            // if (propertyName.length === 0) {
            //     // alert("The property name cannot be empty.");
            //     return;
            // }

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


                let request = fetch('http://localhost:8000/properties/create/', {
                    headers: headers,
                    method: 'POST',
                    body: formData
                });

                

                request.then((response) => {
                    // console.log(response);
                    if (response.ok) {
                        return response.json();
                    }
                }).then((json) => {
                    if (json !== undefined) {
                        navigate('/properties/')
                    }
                })
            });
        }} />
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Form is incomplete</h5>
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

export default function CreateProperty() {

    const loginNavigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token") === null) {
            loginNavigate("/login/");
        }

    }, []);

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

    let [propertyImageComponents, setPropertyImageComponents] = useState([]);

    let [numGuests, setNumGuests] = useState(1);

    let [numBeds, setNumBeds] = useState(0);

    let [numBaths, setNumBaths] = useState(0);

    let [amenities, setAmenities] = useState([]);

    let [nightlyPrice, setNightlyPrice] = useState(0);

    let [priceModifiers, setPriceModifiers] = useState(Array(12).fill(100));

    let [monthsAvailable, setMonthsAvailable] = useState(Array(12).fill(true));



    useEffect(() => {

        setPropertyImageComponents([])

        let imgComponents = []

        for (let i = 0; i < 6; i++) {

            let imgURL = propertyImageURLs[i];
            
            imgComponents.push(<PropertyImage key={i} number={i} imgPath={imgURL}></PropertyImage>);
        }

        setPropertyImageComponents(imgComponents)
    }
    , [propertyImages]);

    
    

    return (
        <main className="card d-block">
            <Header></Header>
            <div className="container">
                <div>
                    <h1 className="text-center mb-4">New Rental Unit Creation</h1>
                </div>

                <h2 className="mb-3">General</h2>

                <form>
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
                        {propertyImageComponents}
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
            <Footer></Footer>
        </main>
    );
}