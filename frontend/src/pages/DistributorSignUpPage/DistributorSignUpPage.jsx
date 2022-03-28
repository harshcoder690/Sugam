import React from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import './DistributorSignUpPage.css';
import { OtpContext } from "../../store/otp";
import { UserContext } from "../../store/user";
import { otpReducer } from "../../reducer/otp";
import SignUpBox from "../../components/SignUpBox/SignUpBox";
import OtpBox from "../../components/OtpBox/OtpBox";
import { storeUser } from "../../actions/user";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { storePhoneNo } from "../../actions/otp";

const DistributorSignUpPage = () => {

    const { user, dispatchUser } = React.useContext(UserContext);

    const [ code, dispatchCode ] = React.useReducer(otpReducer,{
        phoneNo:null,
        otp:null
    });

    const provider = {
        code,
        dispatchCode
    }

    const navigate=useNavigate();

    React.useEffect(() => {

        window.recaptchaVerifier=new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
            }
        }, auth);

    }, []);

    React.useEffect(() => {
        
        let appVerifier = window.recaptchaVerifier;
        console.log(code.phoneNo)

        signInWithPhoneNumber(auth, `+91${code.phoneNo}`, appVerifier)
        .then((confirmationResult) => {

            window.confirmationResult=confirmationResult;

        }).catch((error) => {
            console.log(error)
        });

    }, [code.phoneNo]);

    React.useEffect(() => {

        if (!window.confirmationResult) {
            return;
        }

        window.confirmationResult.confirm(code.otp)
            .then((result) => {
                dispatchUser(storeUser(result.user));
                navigate(`/distributor/${result.user.uid}/details`);

            }).catch((error) => {
                console.log(error);

                toast.error("Error! Try Again.", {
                    position: toast.POSITION.BOTTOM_LEFT,
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'colored'
                });

                dispatchCode(storePhoneNo(null));
            })

    }, [code.otp]);

    console.log(user)

    return (

        <OtpContext.Provider value={provider}>
            <div className="signup-page">
                {
                    code.phoneNo === null ? <SignUpBox type = "Distributer"/> : <OtpBox type = "Distributer" number ={`+91${code.phoneNo}`}/>
                }
                <div id="recaptcha-container"></div>
                <ToastContainer />
            </div>
        </OtpContext.Provider>
    );
}

export default DistributorSignUpPage;
