export const ProfileImage = ({avatar}) => {
    return <>
        <div className="mb-3">
            <img className="profile-pic img-thumbnail rounded-circle shadow mx-auto d-block"
                src={avatar} alt=""/>
        </div>
    </>
}

export const ProfileName = ({firstName, lastName, disabled}) => {
    return <>
        <div className="row g-sm-2 m-0">
            <div className="col-sm form-floating p-0">
                <input type="text" className="form-control-plaintext" id="first-name" placeholder="First name"
                    value={firstName} disabled={disabled} />
                <label htmlFor="first-name" className="col-form-label text-muted">First name</label>
            </div>
            <div className="col-sm form-floating p-0">
                <input type="text" className="form-control-plaintext" id="last-name" placeholder="Last name"
                    value={lastName} disabled={disabled} />
                <label htmlFor="last-name" className="form-label text-muted">Last name</label>
            </div>
        </div>
    </>
};

export const ProfileEmail = ({email, disabled}) => {
    return <>
        <div className="form-floating">
            <input type="email" className="form-control-plaintext" id="email" placeholder="Email"
                value={email} disabled={disabled} />
            <label htmlFor="email" className="form-label text-muted">Email</label>
        </div>
    </>
};

export const ProfilePhone = ({phone, disabled}) => {
    return <>
        <div className="form-floating">
            <input type="tel" className="form-control-plaintext" id="phone" placeholder="Phone" value={phone}
                disabled={disabled} />
            <label htmlFor="phone" className="form-label text-muted">Phone</label>
        </div>
    </>
};