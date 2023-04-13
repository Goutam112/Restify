import { ProfileName, ProfileEmail, ProfilePhone, ProfileImage } from '../../components/Profile/profileWrite';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../layouts/Header';
import Footer from '../../layouts/Footer';

import '../../assets/app.css';
import './profile.css';
import { FormError } from '../../components/Profile/formError';

const EditProfile = () => {
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        id: '',
        avatar: '',
        avatar_file: '',
        first_name: '',
        last_name: '',
        email: '',
        phone_number: ''
    });

    const [phoneError, setPhoneError] = useState(null);

    const getProfile = async () => {
        let profile_resp = await fetch(`http://localhost:8000/accounts/currentuser/`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!profile_resp.ok) {
            /* redirect to home page */
            console.log("You are not logged in.");
        }
        let json = await profile_resp.json();
        setProfile({
            ...profile, 
            id: json.id,
            first_name: json.first_name,
            last_name: json.last_name,
            email: json.email,
            phone_number: json.phone_number,
            avatar: json.avatar,
            avatar_file: null,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!profile.phone_number.match(/^[0-9]{10}$/)) {
            setPhoneError('Phone number should be 10 numbers.');
            return;
        } else {
            setPhoneError('');
        }

        const formData = new FormData();
        formData.append('first_name', profile.first_name);
        formData.append('last_name', profile.last_name);
        formData.append('phone_number', profile.phone_number);
        if (profile.avatar_file !== null) {
            formData.append('avatar', profile.avatar_file);
        }

        for (let x of formData.entries()) {
            console.log(x)
        }

        fetch(`http://localhost:8000/accounts/profile/edit/`, {
            method: 'PUT',
            headers: {
                // NOTE: Content-Type is explicitly not set to allow multipart/form-data to have a required boundary attribute
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        }).then(response => {
            if (!response.ok) {
                console.log('Failed to update profile.');
            } else {
                console.log('Successfully updated profile.');
                navigate(`/accounts/profile/view/${profile.id}`);
            }
        });
    }

    useEffect( () => {
        getProfile();
    }, []);

    return <>
        <Header />
        <main className="card d-block">
            <h1 className="mb-3">Profile</h1>
            <form className="p-3 mb-4 border border-3 rounded shadow-sm" id="editForm" onSubmit={e => handleSubmit(e)}>
                <h2>General Information</h2>
                <ProfileImage avatar={profile.avatar} 
                    onChange={e => {
                        URL.revokeObjectURL(profile.avatar);
                        let avatarFile = e.target.files[0];
                        let avatarURL = URL.createObjectURL(avatarFile)
                        setProfile({...profile, avatar: avatarURL, avatar_file: avatarFile})
                    }}/>
                <ProfileName firstName={profile.first_name} lastName={profile.last_name} 
                    onChangeFirst={e => setProfile({...profile, first_name: e.target.value})}
                    onChangeLast={e => setProfile({...profile, last_name: e.target.value})}/>
                <ProfileEmail email={profile.email} />
                <ProfilePhone phone={profile.phone_number} onChange={e => setProfile({...profile, phone_number: e.target.value})}/>
                <FormError errorMsg={phoneError}/>
            </form>
            <button type="submit" className="btn btn-outline-primary mb-3" form="editForm">Save</button>
        </main>
        <Footer />
    </>
}

export default EditProfile;