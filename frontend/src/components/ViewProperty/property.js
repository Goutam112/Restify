import { Link } from "react-router-dom";
import { ImageCarousel } from "./imageCarousel";
import { Rating, Reply } from "./propertyComment";
import { useState } from "react";
import $ from 'jquery';

export const PropertyTitle = ({title, avgRating, numRatings}) => {
    return (
        <>
            <h1 className="mb-2">{title}</h1>
            <div className="mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="gold" width="16" height="20"
                    className="bi bi-star-fill align-text-bottom" viewBox="0 0 16 16">
                    <path
                        d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                </svg>
                <span className="">{parseFloat(avgRating).toFixed(2)} </span>
                <a className="" href="#ratings-section">({numRatings} {numRatings === 1 ? "Review" : "Reviews"})</a>
            </div>
        </>
    );
}

export const PropertyImageCarousel = ({imgUrls}) => {
    imgUrls = imgUrls.filter(imgUrl => !imgUrl?.includes("empty_image"));
    if (imgUrls.length === 0) {
        imgUrls.push("http://localhost:8000/media/empty_image.jpg");
    }
    return <>
        <ImageCarousel imgUrls={imgUrls} />
    </>
}

export const PropertyInfoPanel = ({numGuests, numBeds, numBaths}) => {
    return (
        <>
            <div className="d-flex flex-row mt-2 mb-3">
                <div className="p-2 border border-end-0 border-2">Up to {numGuests} Guest(s)</div>
                <div className="p-2 border border-2">{numBeds} Bed(s)</div>
                <div className="p-2 border border-start-0 border-2">{numBaths} Bath(s)</div>
            </div>
        </>
    );
}

export const PropertyHostInfo = ({hostID, hostFirstName, hostLastName, hostEmail, hostPhone, hostAvatar}) => {
    return (
        <>
            <div className="d-flex align-items-center mb-4">
                <div className="me-2">
                    <Link to={`/accounts/profile/view/${hostID}`}>
                        <img className="reviewer-pic img rounded-circle shadow" src={hostAvatar} alt=""/>
                    </Link>
                </div>
                <div>
                    <p className="m-0 mb-2">
                        <strong>Hosted by: <span className="fw-b"><u>{hostFirstName} {hostLastName}</u></span></strong>
                    </p>
                    <p className="m-0 small">Email: {hostEmail}</p>
                    <p className="m-0 small">Phone: {hostPhone}</p>
                </div>
            </div>
        </>
    );
}

export const PropertyDescription = ({address, city, state, country, description}) => {
    return (
        <>
            <div>
                <hr/>
                <h2>Your Next Destination</h2>
                <p>{address}, {city}, {state}, {country}</p>
                <p>{description}</p>
            </div>
        </>
    );
}

export const PropertyAmenities = ({amenities}) => {
    return (
        <>
            <div>
                <hr/>
                <h2>Amenities to Enjoy</h2>
                {
                    amenities.length > 0 ? 
                    <div className="mb-2">By staying here, you'll enjoy these amenities:</div> 
                    : <div className="mb-2">No additional amenities. What you see is what you get!</div>
                }
                
                <div className="d-flex flex-wrap">
                {
                    amenities.map((amenity, i) => {
                        return (
                            <div className="bg-info text-white rounded p-1 me-2 mb-1" key={i} >
                                {amenity}
                            </div>
                        )
                    })
                }
                </div>
            </div>
        </>
    );
}

const PropertyCommentChain = ({rating, replies, hostID, canReply, setReplyID}) => {
    return <>
        <Rating content={rating.content} rating={rating.rating} commentDate={new Date(rating.post_datetime).toLocaleString()}
            commenterID={rating.commenter.id} commenterFirstName={rating.commenter.first_name}
            commenterLastName={rating.commenter.last_name} commenterAvatar={rating.commenter.avatar} />
        {
            replies.map((reply, i) => {
                if (i === replies.length - 1) {
                    return <>
                        <Reply content={reply.content} isHost={reply.commenter.id === hostID} commentDate={new Date(reply.post_datetime).toLocaleString()} 
                            commenterID={reply.commenter.id} commenterFirstName={reply.commenter.first_name} 
                            commenterLastName={reply.commenter.last_name} commenterAvatar={reply.commenter.avatar} key={i} />
                        {
                            canReply ? <ReplyButton handleClick={() => setReplyID(rating.id)}/> : <></>
                        }
                    </>
                } else {
                    return <Reply content={reply.content} isHost={reply.commenter.id === hostID} commentDate={new Date(reply.post_datetime).toLocaleString()} 
                        commenterID={reply.commenter.id} commenterFirstName={reply.commenter.first_name} 
                        commenterLastName={reply.commenter.last_name} commenterAvatar={reply.commenter.avatar} key={i} />
                }
            })
        }
    </>
}

export const PropertyComments = ({comments, hostID, onScroll, canCreatePropertyReply, setReplyID}) => {

    return <>
        <div className="pb-3">
            <hr/>
            <h2 className="mb-3" id="ratings-section">What Others Are Saying</h2>
            <div className="overflow-auto border-top pt-2 border-bottom pb-1 ps-1 shadow-sm ratings" onScroll={onScroll}>
                {
                    comments.map((rating, i) => {
                        return <PropertyCommentChain rating={rating} replies={rating.replies} hostID={hostID} canReply={canCreatePropertyReply[i]} setReplyID={setReplyID} key={i} />
                    })
                }
            </div>
        </div>
    </>
}

const daysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
}

const getMonthAvailability = (monthNumber, monthAvailabilities) => {
    for (let availability of monthAvailabilities) {
        if (availability.month === parseInt(monthNumber)) {
            return availability.is_available;
        }
    }
    // should be unreachable
    return true;
}

const CheckInYearDropdown = ({startDate, setStartDate, setEndDate}) => {
    let availableYears = [];

    let thisYear = new Date().getFullYear();

    for (let i = thisYear; i <= thisYear + 2; i++) {
        availableYears.push(i)
    }
    
    return <>
        <select className="" onChange={e => {
            setStartDate({
                year: e.target.value,
                month: "MM",
                day: "DD"
            });
            setEndDate({
                year: "YYYY",
                month: "MM",
                day: "DD"
            });
        }} value={startDate.year}>
            <option>YYYY</option>
            {
                availableYears.map(year => {
                    return <option key={year}>{year}</option>
                })
            }
        </select>
    </>
}

const CheckOutYearDropdown = ({startDate, endDate, setEndDate, monthAvailabilities}) => {
    let disabled = false;
    
    if (startDate.year === "YYYY" || startDate.month === "MM" || startDate.day === "DD") {
        disabled = true;
    }
    
    let availableYears = [];

    let startYear = parseInt(startDate.year);

    if (startDate.month === "12" && startDate.day === "31") {
        availableYears.push(startYear + 1);
    } else {
        let nextYearUnavailable = false;
        for (let i = parseInt(startDate.month); i <= 12; i++) {
            if (getMonthAvailability(i, monthAvailabilities) === false) {
                nextYearUnavailable = true;
            }
        }

        if (nextYearUnavailable) {
            availableYears.push(startDate.year)
        } else {
            for (let i = startYear; i <= startYear + 1; i++) {
                availableYears.push(i)
            }
        }
    }

    return <>
        <select className="" onChange={e => {
            setEndDate({
                year: e.target.value,
                month: "MM",
                day: "DD"
            });
        }} value={endDate.year} disabled={disabled}>
            <option>YYYY</option>
            {
                availableYears.map(year => {
                    return <option key={year}>{year}</option>
                })
            }
        </select>
    </>
}

const CheckInMonthDropdown = ({startDate, setStartDate, setEndDate, monthAvailabilities}) => {    
    let disabled = false;

    if (startDate.year === "YYYY") {
        disabled = true;
    }

    let thisYear = new Date().getFullYear().toString();
    let thisMonth = new Date().getMonth() + 1;

    let availableMonths = [];

    if (startDate.year === thisYear) {
        for (let i = thisMonth; i <= 12; i++) {
            if (getMonthAvailability(i, monthAvailabilities) === true) {
                availableMonths.push(i)
            }
        }
    } else {
        for (let i = 1; i <= 12; i++) {
            if (getMonthAvailability(i, monthAvailabilities) === true) {
                availableMonths.push(i)
            }
        }
    }

    return <>
        <select className="" onChange={e => {
            setStartDate({
                ...startDate,
                month: e.target.value,
                day: "DD"
            });
            setEndDate({
                year: "YYYY",
                month: "MM",
                day: "DD"
            });
        }} value={startDate.month} disabled={disabled}>
            <option>MM</option>
            {
                availableMonths.map(month => {
                    return <option key={month}>{month}</option>
                })
            }
        </select>
    </>
}

const CheckOutMonthDropdown = ({startDate, endDate, setEndDate, monthAvailabilities}) => {
    let disabled = false;
    
    if (startDate.year === "YYYY" || startDate.month === "MM" || startDate.day === "DD" || endDate.year === "YYYY") {
        disabled = true;
    }

    let startYear = parseInt(startDate.year);
    let startMonth = parseInt(startDate.month);
    
    let availableMonths = [];

    if (endDate.year === startDate.year) {
        for (let i = startMonth; i <= 12; i++) {
            if (i === startMonth && parseInt(startDate.day) === daysInMonth(startYear, startMonth)) {
                continue;
            }
            availableMonths.push(i);
            if (getMonthAvailability(i, monthAvailabilities) === false) {
                break;
            }
        }
    } else if (parseInt(endDate.year) === startYear + 1) {
        for (let i = 1; i <= startMonth; i++) {
            availableMonths.push(i);
            if (getMonthAvailability(i, monthAvailabilities) === false) {
                break;
            }
        } 
    } else {
        for (let i = 1; i <= 12; i++) {
            availableMonths.push(i);
            if (getMonthAvailability(i, monthAvailabilities) === false) {
                break;
            }
        } 
    }

    return <>
        <select className="" onChange={e => {
            setEndDate({
                ...endDate,
                month: e.target.value,
                day: "DD"
            });
        }} value={endDate.month} disabled={disabled}>
            <option>MM</option>
            {
                availableMonths.map(month => {
                    return <option key={month}>{month}</option>
                })
            }
        </select>
    </>
}

const CheckInDayDropdown = ({startDate, setStartDate, setEndDate}) => {
    let disabled = false;

    if (startDate.year === "YYYY" || startDate.month === "MM") {
        disabled = true;
    }

    let thisYear = new Date().getFullYear().toString();
    let thisMonth = (new Date().getMonth() + 1).toString();
    let thisDay = new Date().getDate();

    let availableDays = [];

    if (startDate.year === thisYear && startDate.month === thisMonth) {
        for (let i = thisDay; i <= daysInMonth(startDate.year, startDate.month); i++) {
            availableDays.push(i)
        }
    } else {
        for (let i = 1; i <= daysInMonth(startDate.year, startDate.month); i++) {
            availableDays.push(i)
        }
    }

    return <>
        <select className="" onChange={e => {
            setStartDate({
                ...startDate,
                day: e.target.value
            });
            setEndDate({
                year: "YYYY",
                month: "MM",
                day: "DD"
            });
        }} value={startDate.day} disabled={disabled}>
            <option>DD</option>
            {
                availableDays.map(day => {
                    return <option key={day}>{day}</option>
                })
                
            }
        </select>
    </>
}

const CheckOutDayDropdown = ({startDate, endDate, setEndDate, monthAvailabilities}) => {
    let disabled = false;
    
    if (startDate.year === "YYYY" || startDate.month === "MM" || startDate.day === "DD" || endDate.year === "YYYY" || endDate.month === "MM") {
        disabled = true;
    }

    let startYear = parseInt(startDate.year);
    let startMonth = parseInt(startDate.month);
    let startDay = parseInt(startDate.day);
    
    let availableDays = [];

    if (endDate.year === startDate.year && endDate.month === startDate.month) {
        for (let i = startDay; i <= daysInMonth(startYear, startMonth); i++) {
            if (i === startDay) {
                continue;
            }
            availableDays.push(i)
        }
    } else if (parseInt(endDate.year) === startYear + 1 && endDate.month === startDate.month) {
        if (getMonthAvailability(parseInt(endDate.month), monthAvailabilities) === false) {
            availableDays.push(1);
        } else {
            for (let i = 1; i <= startDay; i++) {
                availableDays.push(i);
            } 
        }
    } else {
        if (getMonthAvailability(parseInt(endDate.month), monthAvailabilities) === false) {
            availableDays.push(1);
        } else {
            for (let i = 1; i <= daysInMonth(parseInt(endDate.year), parseInt(endDate.month)); i++) {
                availableDays.push(i);
           } 
        }
    }

    return <>
        <select className="" onChange={e => {
            setEndDate({
                ...endDate,
                day: e.target.value
            });
        }} value={endDate.day} disabled={disabled}>
            <option>DD</option>
            {
                availableDays.map(day => {
                    return <option key={day}>{day}</option>
                })
            }
        </select>
    </>
}

const MonthlyBreakdown = ({year, monthNumber, monthNightlyPrice, numNights}) => {
    let month = new Date();
    month.setMonth(monthNumber - 1);
    
    let monthName = month.toLocaleString('en-us', {month: 'short'});
    
    return <>
        <div><strong>{monthName} {year}</strong></div>
        <div>${parseFloat(monthNightlyPrice).toFixed(2)} x {numNights} night(s)</div>
    </>
}

const getTotal = (monthlyBreakdown) => {
    let total = 0;

    for (let monthInfo of monthlyBreakdown) {
        total += monthInfo.nightly_price * monthInfo.nights;
    }

    return total.toFixed(2);
}

export const PropertyBookings = ({startDate, setStartDate, endDate, setEndDate, baseNightlyPrice, monthlyBreakdown, secondsBeforeExpiry, handleSecondsBeforeExpiry, monthAvailabilities}) => {
    return (
        <>
            <div>
                <hr/>
                <h2 className="mb-3">Decided?</h2>
                <div className="mb-3">Request a reservation now!</div>
                <div>
                    <div><label className="mb-1"><b>How many seconds would you wait for a reservation confirmation?</b></label></div>
                    <div><input onChange={e => handleSecondsBeforeExpiry(e)} type="number" min="1" value={secondsBeforeExpiry === null ? "" : secondsBeforeExpiry}></input></div>
                </div>
                <h4 className="mt-4">Length of Stay</h4>
                <div className="d-flex flex-wrap ms-1 mb-4 p-0">
                    <div className="flex-column me-5">
                        <div><em>Check-in Date</em></div>
                        <div className="mb-1">
                            <CheckInYearDropdown startDate={startDate} setStartDate={setStartDate} setEndDate={setEndDate} />
                            <CheckInMonthDropdown startDate={startDate} setStartDate={setStartDate} setEndDate={setEndDate} monthAvailabilities={monthAvailabilities} />
                            <CheckInDayDropdown startDate={startDate} setStartDate={setStartDate} setEndDate={setEndDate} />
                        </div>
                    </div>
                    <div className="flex-column">
                        <div><em>Check-out Date</em></div>
                        <div className="mb-1">
                            <CheckOutYearDropdown startDate={startDate} endDate={endDate} setEndDate={setEndDate} monthAvailabilities={monthAvailabilities} />
                            <CheckOutMonthDropdown startDate={startDate} endDate={endDate} setEndDate={setEndDate} monthAvailabilities={monthAvailabilities} />
                            <CheckOutDayDropdown startDate={startDate} endDate={endDate} setEndDate={setEndDate} monthAvailabilities={monthAvailabilities} />
                        </div>
                    </div>
                </div>
                <h4>Subtotal</h4>
                <div className="d-flex mb-2">
                    <div className="flex-column align-items-start">
                        <div className="p-2 pe-5 border-top border-bottom border-primary border-3">
                            <div><strong>Nightly Rate:</strong></div>
                            <div>Your base nightly rate is: <em className="fs-5">${parseFloat(baseNightlyPrice).toFixed(2)}</em></div>
                        </div>
                        <div className="p-2 pe-5 border-bottom border-primary border-3">
                            {
                                monthlyBreakdown.map((monthInfo, i) => {
                                    return <MonthlyBreakdown key={i} year={monthInfo.year} monthNumber={monthInfo.month} 
                                        monthNightlyPrice={monthInfo.nightly_price} numNights={monthInfo.nights} />
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="mb-2">
                    <span>Your total is: </span><span className="fw-bold mt-2 mb-2 fs-3">${getTotal(monthlyBreakdown)}</span>
                </div>
            </div>
        </>
    );
}

export const ReservationSubmission = ({disabled, error}) => {
    return <>
        <div>
            <button type="button" className="btn btn-primary mt-1" data-bs-toggle="modal" disabled={disabled}
                data-bs-target="#staticBackdrop">
                Request Booking
            </button>
            {
                error === "" ? <></> : <div className="mt-2 text-danger">{error}</div> 
            }
        </div>
    </>
}

export const PropertyViewModal = ({onSubmit}) => {
    return <>
        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Confirm Booking Request</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        Are you sure you want to request a reservation?
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" className="btn btn-primary" onClick={e => onSubmit(e)}>Yes</button>
                    </div>
                </div>
            </div>
        </div>
    </>;
}

export const PropertyCommentAdd = () => {
    return <>
        <div>
            <h5>You stayed at this property before.</h5>
            <div className="mb-2">Care to share your thoughts?</div>
            <button type="button" className="btn btn-warning border shadow" data-bs-toggle="modal"
                data-bs-target="#createComment">Rate Your Experience</button>
        </div>
    </>
}

export const PropertyCommentAddModal = ({propertyID, comments, setComments}) => {
    const [rating, setRating] = useState(3);
    const [content, setContent] = useState("");

    const addRating = async (e) => {
        e.preventDefault();

        const addedCommentResp = await fetch(`http://localhost:8000/comments/property/${propertyID}/review/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/JSON',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                'content': content,
                'rating': rating
            })
        });

        const addedCommentJson = await addedCommentResp.json();

        const newComments = [addedCommentJson, ...comments];

        setComments(newComments);

        $('.btn-close').trigger('click');
    }

    return <>
        <div className="modal fade" id="createComment" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Add a Rating</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <label className="me-2">Rating:
                            <span id="userRatingLabelRating"> {rating} </span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="gold" width="16" height="20"
                                className="bi bi-star-fill align-text-bottom" viewBox="0 0 16 16">
                                <path
                                    d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                        </label>
                        <div>
                            <input type="range" className="form-range w-75" id="userRating" min="1" max="5" step="1" value={rating}
                                onChange={e => setRating(e.target.value)}/>
                        </div>
                        <form id="ratingForm">
                            <label className="mb-2">Comments:</label>
                            <textarea className="w-100 h-100" rows="5" value={content} onChange={e => setContent(e.target.value)} required></textarea>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" form="ratingForm" className="btn btn-primary" disabled={content === ""}
                            onClick={e => addRating(e)}>Add Rating</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export const PropertyReplyModal = ({propertyID, replyToID, comments, setComments}) => {
    const [content, setContent] = useState("");

    const submitReply = async (e) => {
        e.preventDefault();

        const replyResp = await fetch(`http://localhost:8000/comments/property/${propertyID}/reply/create/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/JSON',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                'content': content,
                'reply_to': replyToID
            })
        });

        const replyJson = await replyResp.json();

        let newComments = [...comments];

        for (let i = 0; i < comments.length; i++) {
            let comment = comments[i];
            if (comment.id === replyToID) {
                let newComment = {...comment}
                newComment.replies = [...comment.replies, replyJson];
                
                newComments[i] = newComment;
                setComments(newComments);
            }
        }

        $('.btn-close').trigger('click');
    }

    return <>
        <div className="modal fade" id="replyComment" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Reply to Rating</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form id="replyForm">
                            <label className="mb-2">Comments:</label>
                            <div>
                                <textarea className="w-100 h-100" rows="5" value={content} onChange={e => setContent(e.target.value)} required></textarea>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" form="replyForm" className="btn btn-primary"
                            onClick={e => submitReply(e)}>Reply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export const ReplyButton = ({handleClick}) => {
    return <>
        <div class="d-flex flex-column rounded ps-2 mb-2 ms-2">
            <div>
                <button type="button" class="btn btn-primary border" data-bs-toggle="modal"
                    data-bs-target="#replyComment" onClick={e => handleClick(e)}>Reply...</button>
            </div>
        </div>
    </>
}