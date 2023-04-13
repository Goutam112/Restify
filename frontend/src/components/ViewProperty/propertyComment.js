import { Link } from "react-router-dom";

export const Rating = ({content, rating, commentDate, commenterID, commenterFirstName, commenterLastName, commenterAvatar}) => {
    return (
        <div className="d-flex flex-column p-1 mb-2">
            {/* <!-- Profile picture + info --> */}
            <div className="d-flex flex-row mb-1">
                <ProfilePicture commenterID={commenterID} commenterAvatar={commenterAvatar} />
                <CommenterInfo commenterFirstName={commenterFirstName} commenterLastName={commenterLastName} commentDate={commentDate} rating={rating} />
            </div>
            <ReviewContent content={content} />
        </div>
    );
}

export const Reply = ({content, isHost, commentDate, commenterID, commenterFirstName, commenterLastName, commenterAvatar}) => {
    return (
        <div className="d-flex flex-column bg-light rounded p-2 mb-2 ms-3">
            {/* <!-- Profile picture + info --> */}
            <div className="d-flex flex-row mb-1">
                <ProfilePicture commenterID={commenterID} commenterAvatar={commenterAvatar} />
                <ReplyInfo commenterFirstName={commenterFirstName} commenterLastName={commenterLastName} commentDate={commentDate} isHost={isHost}/>
            </div>
            <ReviewContent content={content} />
        </div>
    );
}

const ProfilePicture = ({commenterID, commenterAvatar}) => {
    return <>
        <div className="d-flex flex-column me-2">
            <Link to={`/accounts/profile/view/${commenterID}`}>
                <img className="commenter-pic img rounded-circle" src={commenterAvatar} alt=""/>
            </Link>
        </div>
    </>
}

const CommenterInfo = ({commenterFirstName, commenterLastName, commentDate, rating}) => {
    return <>
        <div className="d-flex flex-column">
            <div className="fw-bold">{commenterFirstName} {commenterLastName}</div>
            <div>{commentDate}</div>
            <span>
                <span>{rating}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="gold" width="16" height="20"
                    className="bi bi-star-fill align-text-bottom" viewBox="0 0 16 16">
                    <path
                        d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                </svg>
            </span>
        </div>
    </>
}

const ReplyInfo = ({commenterFirstName, commenterLastName, commentDate, isHost}) => {
    const informational = isHost ? "Host Response" : "User Response";

    return <>
        <div className="d-flex flex-column">
            <div className="fw-bold">{commenterFirstName} {commenterLastName}</div>
            <div>{commentDate}</div>
            <div className="fst-italic">{informational}</div>
        </div>
    </>
}

const ReviewContent = ({content}) => {
    return <>
        <div>
            <div className="">{content}</div>
        </div>
    </>
}