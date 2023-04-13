import { useState } from "react";

export const ProfileComment = ({firstName, lastName, date, rating, avatar, profileLink, text}) => {
    return (
        <div className="d-flex flex-column p-1 mb-2"> 
            <div className="d-flex flex-row mb-1">
                <ProfilePicture avatar={avatar} profileLink={profileLink} />
                <ProfileInfo firstName={firstName} lastName={lastName} date={date} rating={rating} />
            </div>
            <ProfileReview text={text}/>
        </div>
    );
}

export const ProfileCommentModal = ({userID, comments, setComments}) => {
    const [rating, setRating] = useState(3);
    const [content, setContent] = useState("");

    const addComment = async () => {
        const addedCommentResp = await fetch(`http://localhost:8000/comments/user/${userID}/review/create/`, {
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
    }

    return (
        <div className="modal fade" id="createComment" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Add a Rating</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <label className="me-2">Rating:
                            <span id="userRatingLabelRating"> { rating } </span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="gold" width="16" height="20"
                                className="bi bi-star-fill align-text-bottom" viewBox="0 0 16 16">
                                <path
                                    d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                            </svg>
                        </label>
                        <div>
                            <input type="range" className="form-range w-75" id="userRating" min="1" max="5" step="1"
                                value={rating} onChange={e => setRating(e.target.value)} />
                        </div>
                        <div>
                            <label className="mb-2">Comments:</label>
                            <div>
                                <textarea className="w-100 h-100" rows="5" 
                                    value={content} 
                                    onChange={ e => setContent(e.target.value) } 
                                    required />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" disabled={content===""}
                            onClick={() => addComment()}>Add Rating</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ProfilePicture = ({avatar, profileLink}) => {
    return (
        <div className="d-flex flex-column me-2">
            <a href={profileLink}>
                <img className="commenter-pic img rounded-circle" src={avatar} alt=""/>
            </a>
        </div>
    );
}

const ProfileInfo = ({firstName, lastName, date, rating}) => {
    return (
        <div className="d-flex flex-column">
            <div className="fw-bold">{firstName} {lastName}</div>
            <div>{date}</div>
            <span>
                <span>{rating}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="gold" width="16" height="20"
                    className="bi bi-star-fill align-text-bottom" viewBox="0 0 16 16">
                    <path
                        d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                </svg>
            </span>
        </div>
    );
}

const ProfileReview = ({text}) => {
    return (
        <div>
            <div className="">
                {text}
            </div>
        </div>
    );
}