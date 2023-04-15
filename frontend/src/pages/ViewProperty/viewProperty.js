import { useEffect, useState } from "react";
import { PropertyAmenities, PropertyBookings, PropertyCommentAdd, PropertyCommentAddModal, PropertyComments, PropertyDescription, PropertyHostInfo, PropertyImageCarousel, PropertyInfoPanel, PropertyReplyModal, PropertyTitle, PropertyViewModal, ReservationSubmission } from "../../components/ViewProperty/property";
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';
import $ from 'jquery';

import '../../assets/app.css';
import './property_view.css';

export const ViewProperty = () => {
    const { propertyID } = useParams();

    const navigate = useNavigate();

    const [propertyInfo, setPropertyInfo] = useState({
        price_modifiers: [ 
            {'month': 1, 'price_modifier': 1.00},
            {'month': 2, 'price_modifier': 1.00},
            {'month': 3, 'price_modifier': 1.00},
            {'month': 4, 'price_modifier': 1.00},
            {'month': 5, 'price_modifier': 1.00},
            {'month': 6, 'price_modifier': 1.00},
            {'month': 7, 'price_modifier': 1.00},
            {'month': 8, 'price_modifier': 1.00},
            {'month': 9, 'price_modifier': 1.00},
            {'month': 10, 'price_modifier': 1.00},
            {'month': 11, 'price_modifier': 1.00},
            {'month': 12, 'price_modifier': 1.00},
        ],
        month_availabilities: [
            {'id': 1, 'month': 1, 'is_available': true},
            {'id': 2, 'month': 2, 'is_available': true},
            {'id': 3, 'month': 3, 'is_available': true},
            {'id': 4, 'month': 4, 'is_available': true},
            {'id': 5, 'month': 5, 'is_available': true},
            {'id': 6, 'month': 6, 'is_available': true},
            {'id': 7, 'month': 7, 'is_available': true},
            {'id': 8, 'month': 8, 'is_available': true},
            {'id': 9, 'month': 9, 'is_available': true},
            {'id': 10, 'month': 10, 'is_available': true},
            {'id': 11, 'month': 11, 'is_available': true},
            {'id': 12, 'month': 12, 'is_available': true},
        ],
        property_images: [{image: null}, {image: null}, {image: null}, {image: null}, {image: null}, {image: null}],
        amenities: [],
        name: "",
        description: "",
        address: "",
        country: "",
        state: "",
        city: "",
        max_num_guests: 0,
        num_beds: 0,
        num_baths: 0,
        nightly_price: 0,
        owner: null
    });

    const [avgRating, setAvgRating] = useState(0);

    const [numRatings, setNumRatings] = useState(0);

    const [comments, setComments] = useState([]);

    const [nextCommentsPage, setNextCommentsPage] = useState(`http://localhost:8000/comments/property/${propertyID}/review/`);

    const [host, setHost] = useState({});

    const [user, setUser] = useState({});

    const [startDate, setStartDate] = useState({
        year: "YYYY",
        month: "MM",
        day: "DD"
    });

    const [endDate, setEndDate] = useState({
        year: "YYYY",
        month: "MM",
        day: "DD"
    });

    const [monthlyBreakdown, setMonthlyBreakdown] = useState([{
        year: 2023,
        month: 1,
        nights: 30,
        nightly_price: 100
    }]);

    const [secondsBeforeExpiry, setSecondsBeforeExpiry] = useState(null);

    const [submitError, setSubmitError] = useState("");

    const [canCreatePropertyReview, setCanCreatePropertyReview] = useState(false);

    const [canCreatePropertyReply, setCanCreatePropertyReply] = useState([]);

    const [replyID, setReplyID] = useState(null);

    const fetchData = async () => {
        const response = await fetch(`http://localhost:8000/properties/retrieve/${propertyID}/`);
        const json = await response.json();
        console.log(json)
        setPropertyInfo(json);

        setHost(json.owner);
    }

    const fetchComments = async () => {

        if (nextCommentsPage === null) {
            return;
        }
        const response = await fetch(nextCommentsPage);
        const commentsJson = await response.json();

        setComments(comments.concat(commentsJson.results));
        setNextCommentsPage(commentsJson.next);

        console.log(commentsJson);
    }

    const fetchCurrentUser = async () => {
        let response = await fetch(`http://localhost:8000/accounts/currentuser/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            setUser(null);
        }
        let json = await response.json();
        setUser({
            ...user, 
            id: json.id,
            first_name: json.first_name,
            last_name: json.last_name,
            email: json.email,
            phone_number: json.phone_number,
            avatar: json.avatar,
        });
    }

    const fetchRatingInfo = async () => {
        let response = await fetch(`http://localhost:8000/comments/property/${propertyID}/ratinginfo/`);

        let json = await response.json();

        setAvgRating(json.avg_rating);
        setNumRatings(json.num_ratings);
    }

    const fetchCanCreatePropertyComment = async () => {
        let response = await fetch(`http://localhost:8000/comments/property/${propertyID}/review/cancreate/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            setCanCreatePropertyReview(false);
        }
        let json = await response.json();
        setCanCreatePropertyReview(json.can_leave_review);
    }

    useEffect(() => {
        fetchData();
        fetchComments();
        fetchCurrentUser();
    }, []);

    const updateReplyAbility = async () => {
        let newCanCreatePropertyReply = [];
        for (let comment of comments) {
            let response = await fetch(`http://localhost:8000/comments/property/${propertyID}/reply/${comment.id}/cancreate/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            
            if (!response.ok) {
                newCanCreatePropertyReply.push(false);
                console.log("Can reply: " + newCanCreatePropertyReply);
                continue;
            }

            let json = await response.json();
            newCanCreatePropertyReply.push(json.can_leave_review);
        }
        setCanCreatePropertyReply(newCanCreatePropertyReply);
    }

    // Update review/reply functionality and ratings on comments
    useEffect(() => {
        fetchCanCreatePropertyComment();
        updateReplyAbility();
        fetchRatingInfo();
    }, [comments]);

    // Update monthly breakdown
    useEffect(() => {
        if (startDate.year === "YYYY" || startDate.month === "MM" || startDate.day === "DD" || endDate.year === "YYYY" || endDate.month === "MM" || endDate.day === "DD") {
            setMonthlyBreakdown([]);
            return;
        }
        let startYear = parseInt(startDate.year);
        let endYear = parseInt(endDate.year);

        let startMonth = parseInt(startDate.month);
        let endMonth = parseInt(endDate.month);

        let startDay = parseInt(startDate.day);
        let endDay = parseInt(endDate.day);

        let startDateObj = new Date(startYear, startMonth - 1, startDay);
        let endDateObj = new Date(endYear, endMonth - 1, endDay);

        let numDays = Math.round((endDateObj - startDateObj) / (1000 * 60 * 60 * 24));

        let baseNightlyPrice = propertyInfo.nightly_price;

        let newMonthlyBreakdown = [];

        let currYear = startYear;
        let currMonth = startMonth;

        while (numDays > 0) {
            let totalDaysInCurrMonth = daysInMonth(currYear, currMonth);

            if (currYear === startYear && currMonth === startMonth) {
                totalDaysInCurrMonth = daysInMonth(currYear, currMonth) - startDay + 1;
            }

            if (numDays <= totalDaysInCurrMonth) {
                newMonthlyBreakdown.push({year: currYear, month: currMonth, nights: numDays, nightly_price: baseNightlyPrice * getPriceModifier(currMonth, propertyInfo.price_modifiers)});
                numDays = 0;
            } else {
                newMonthlyBreakdown.push({year: currYear, month: currMonth, nights: totalDaysInCurrMonth, nightly_price: baseNightlyPrice * getPriceModifier(currMonth, propertyInfo.price_modifiers)});
                numDays -= totalDaysInCurrMonth;
            }
            currMonth += 1;
            if (currMonth > 12) {
                currMonth = 1;
                currYear += 1;
            }
        }
        setMonthlyBreakdown(newMonthlyBreakdown);
    }, [propertyInfo, startDate, endDate]);

    const daysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    }

    const getPriceModifier = (monthNumber, priceModifiers) => {
        for (let priceModifier of priceModifiers) {
            if (parseInt(priceModifier.month) === monthNumber) {
                return parseFloat(priceModifier.price_modifier);
            }
        }
        return 1.0;
    }

    const handleCommentScroll = (e) => {
        const atBottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 10;

        if (atBottom) {
            fetchComments();
        }
    }

    const submitReservation = async (e) => {
        e.preventDefault();

        let request = fetch("http://localhost:8000/reservations/create/", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                start_date: startDate.year + "-" + startDate.month + "-" + startDate.day,
                end_date: endDate.year + "-" + endDate.month + "-" + endDate.day,
                property: propertyID,
                seconds_before_expiry: secondsBeforeExpiry
            })
        });

        request.then(response => {
            if (!response.ok) {
                response.json().then(json => {
                    console.log(JSON.stringify(json));
                    setSubmitError(json.non_field_errors);
                    $('.btn-close').trigger('click');
                });
            } else {
                response.json().then(json => {
                    console.log(JSON.stringify(json));
                });
                $('.btn-close').trigger('click');
                navigate(`/reservations/retrieve/all/`);
            }
        });
    }

    const handleSecondsBeforeExpiry = (e) => {
        if (e.target.value <= 0) {
            setSecondsBeforeExpiry(null);
        } else {
            setSecondsBeforeExpiry(e.target.value);
        }
    }

    return <>
        <Header />
        <PropertyViewModal onSubmit={e => {submitReservation(e)}}/>
        <PropertyCommentAddModal propertyID={propertyID} comments={comments} setComments={setComments} />
        <PropertyReplyModal propertyID={propertyID} replyToID={replyID} comments={comments} setComments={setComments}/>
        <main className="card d-block">
            {
                user?.id === host.id ? <Link class="btn btn-outline-danger shadow-sm mb-2" to={`/properties/update/${propertyID}`}>Edit Details</Link> : <></>
            }
            <PropertyTitle title={propertyInfo.name} avgRating={avgRating} numRatings={numRatings}/>
            <PropertyImageCarousel imgUrls={propertyInfo.property_images.map(json => json.image)} />
            <PropertyInfoPanel numGuests={propertyInfo.max_num_guests} numBeds={propertyInfo.num_beds} numBaths={propertyInfo.num_baths} />
            <PropertyHostInfo hostID={host.id} hostFirstName={host.first_name} hostLastName={host.last_name} hostEmail={host.email}
                hostPhone={host.phone_number} hostAvatar={host.avatar} />
            <PropertyDescription address={propertyInfo.address} city={propertyInfo.city} state={propertyInfo.state}
                country={propertyInfo.country} description={propertyInfo.description} />
            <PropertyAmenities amenities={propertyInfo.amenities.map(json => json.name)}/>
            <PropertyComments comments={comments} hostID={host.id} canCreatePropertyReply={canCreatePropertyReply} onScroll={(e) => handleCommentScroll(e)} setReplyID={setReplyID}/>
            {
                canCreatePropertyReview ? <PropertyCommentAdd /> : <></>
            }
            <PropertyBookings startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate}
                baseNightlyPrice={propertyInfo.nightly_price} monthlyBreakdown={monthlyBreakdown} secondsBeforeExpiry={secondsBeforeExpiry} handleSecondsBeforeExpiry={e => handleSecondsBeforeExpiry(e)}
                monthAvailabilities={propertyInfo.month_availabilities} />
            <ReservationSubmission disabled={startDate.year === "YYYY" || startDate.month === "MM" || startDate.day === "DD" || endDate.year === "YYYY" || endDate.month === "MM" || endDate.day === "DD" || user.id === undefined} 
                error={submitError} />
        </main>
        <Footer />
    </>;
}