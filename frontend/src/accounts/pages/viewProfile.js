import { ProfileName, ProfileEmail, ProfilePhone, ProfileImage } from '../components/profileReadOnly';
import { useEffect, useState } from 'react';

import '../../assets/css/app.css';
import '../../assets/css/profile.css';
import { Link, useParams } from 'react-router-dom';
import { ProfileComment, ProfileCommentModal } from '../components/profileComment';

const ViewProfile = () => {
    const { userID } = useParams();

    const [profile, setProfile] = useState({
        id: '',
        avatar: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    const [isProfileOwner, setIsProfileOwner] = useState(false);

    const [comments, setComments] = useState([]);

    const [nextCommentsPage, setNextCommentsPage] = useState(`http://localhost:8000/comments/user/${userID}/review/`);

    const [showAddReviewBtn, setShowAddReviewBtn] = useState(false);

    const getProfile = async () => {
        let profileResp = await fetch(`http://localhost:8000/accounts/profile/view/${userID}/`);
        if (!profileResp.ok) {
            /* redirect to home page */
            console.log("No user found.");
        }

        let currUserResp = await fetch(`http://localhost:8000/accounts/currentuser`, {
            headers: {
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjgwODE3OTgwLCJpYXQiOjE2ODA3MzE1ODAsImp0aSI6IjI0NmFhOTRiZGFmZTQyZjliMjUyMjkwZmUxMzI4Nzc0IiwidXNlcl9pZCI6MX0.lwhK2h2rDozPsAiqWMOcH1PZVUNuqPyMeX5V3KlqJL4'
            }
        });
        
        let profileJson = await profileResp.json();
        setProfile({
            ...profile, 
            id: profileJson.id,
            firstName: profileJson.first_name,
            lastName: profileJson.last_name,
            email: profileJson.email,
            phone: profileJson.phone_number,
            avatar: profileJson.avatar
        });

        if (currUserResp.ok) {
            // current user is logged in
            let currUserJson = await currUserResp.json();
            setIsProfileOwner(currUserJson.id === profileJson.id);
        } else {
            // current user is not logged in
            setIsProfileOwner(false)
        }
    };

    const getComments = async () => {
        if (nextCommentsPage === null) {
            return;
        }

        let commentsResp = await fetch(nextCommentsPage, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjgwODE3OTgwLCJpYXQiOjE2ODA3MzE1ODAsImp0aSI6IjI0NmFhOTRiZGFmZTQyZjliMjUyMjkwZmUxMzI4Nzc0IiwidXNlcl9pZCI6MX0.lwhK2h2rDozPsAiqWMOcH1PZVUNuqPyMeX5V3KlqJL4'
            }
        });
        if (!commentsResp.ok) {
            // user not allowed to see comments
            setComments(null);
            return;
        }
        
        let commentsJson = await commentsResp.json();

        let newComments = commentsJson.results;

        setComments(comments.concat(newComments));
        setNextCommentsPage(commentsJson.next);
    }

    const getCanPostComments = async () => {
        let canPostCommentResp = await fetch(`http://localhost:8000/comments/user/${userID}/review/cancreate`, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjgwODE3OTgwLCJpYXQiOjE2ODA3MzE1ODAsImp0aSI6IjI0NmFhOTRiZGFmZTQyZjliMjUyMjkwZmUxMzI4Nzc0IiwidXNlcl9pZCI6MX0.lwhK2h2rDozPsAiqWMOcH1PZVUNuqPyMeX5V3KlqJL4'
            }
        });
        if (!canPostCommentResp.ok) {
            setShowAddReviewBtn(false);
            return;
        }
        let json = await canPostCommentResp.json();

        console.log(json.can_leave_review);

        setShowAddReviewBtn(json.can_leave_review)
    }

    useEffect( () => {
        getProfile();
        getComments();
        getCanPostComments();
    }, []);

    const handleCommentScroll = (e) => {
        const atBottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

        if (atBottom) {
            getComments();
        }
    }

    const commentSection = ( comments === null ? <></> :
        <div className="p-3 mb-4 border border-3 rounded shadow-sm">
        <h2 className="mb-3">Reviews</h2>
        <div className="reviews overflow-auto mb-3" onScroll={ e => handleCommentScroll(e) }>
            {
                comments.map((comment, i) => {
                    return (
                        <ProfileComment key={i} firstName={comment.commenter.first_name} lastName={comment.commenter.last_name}
                        date={new Date(comment.post_datetime).toLocaleString()} rating={comment.rating} avatar={comment.commenter.avatar}
                        text={comment.content} />
                    );
                })
            }
        </div>
        {
            !showAddReviewBtn ? <></> :
            <button type="button" className="btn btn-warning shadow-sm" data-bs-toggle="modal"
                data-bs-target="#createComment">Add a Review</button>
        }
        </div>
    );

    return <>
        <ProfileCommentModal userID={userID} comments={comments} setComments={setComments} />
        <main className="card d-block">
            <h1 className="mb-3">Profile</h1>
            <form className="p-3 mb-4 border border-3 rounded shadow-sm">
                <h2>General Information</h2>
                <ProfileImage avatar={profile.avatar} />
                <ProfileName firstName={profile.firstName} lastName={profile.lastName} disabled={true} />
                <ProfileEmail email={profile.email} disabled={true} />
                <ProfilePhone phone={profile.phone} disabled={true} />
            </form>
            {
                isProfileOwner ? 
                (<Link className="btn btn-outline-primary mb-3" to="/accounts/profile/edit">Edit</Link>)
                : 
                (<></>)
            }
            
            {
                commentSection
            }
        </main>
    </>
}

export default ViewProfile;