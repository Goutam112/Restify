import '../css/error.css';

export const FormError = ({errorMsg}) => {
    if (errorMsg !== null && errorMsg !== "") {
        return (
            <div>
                <span className="errorMsg">{errorMsg}</span>
            </div>
        );
    } else {
        return <></>
    }
}