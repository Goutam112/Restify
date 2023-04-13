export const ProfileImage = ({avatar, onChange}) => {
    return (
        <div className="mb-3 text-center">
            <img className="profile-pic img-thumbnail rounded-circle shadow mx-auto d-block"
                src={avatar} alt=""/>
            <label className="btn btn-link p-0" htmlFor="upload-pic-btn">Upload a new photo</label>
            <input type="file" id="upload-pic-btn" className="d-none" accept=".png, .jpg, .jpeg" onChange={onChange}></input>
        </div>
    );
};

export const ProfileName = ({firstName, lastName, onChangeFirst, onChangeLast}) => {
    return (
        <div className="row m-0">
            <div className="col-sm mb-2 me-sm-1 form-floating p-0">
                <input type="text" className="form-control" id="first-name" 
                    placeholder="First name" value={firstName} onChange={onChangeFirst} required />
                <label htmlFor="first-name" className="form-label text-muted">First name</label>
            </div>
            <div className="col-sm mb-2 ms-sm-1 form-floating p-0">
                <input type="text" className="form-control" id="last-name" 
                    placeholder="Last name" value={lastName} onChange={onChangeLast} required/>
                <label htmlFor="last-name" className="form-label text-muted">Last name</label>
            </div>
        </div>
    );
}

export const ProfileEmail = ({email}) => {
    return (
        <div className="form-floating mb-2">
            <input type="email" className="form-control" id="email" placeholder="Email" value={email} disabled required />
            <label htmlFor="email" className="form-label text-muted">Email</label>
        </div>
    );
}

export const ProfilePhone = ({phone, onChange}) => {
    return (
        <div className="form-floating mb-2">
        <input type="tel" className="form-control" id="phone" placeholder="Phone" value={phone} onChange={onChange} required />
        <label htmlFor="phone" className="form-label text-muted">Phone</label>
        </div>
    );
}