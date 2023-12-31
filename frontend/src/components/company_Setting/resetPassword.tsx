import React, {useState} from "react";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { resetCompanyPassword } from 'services/companySetting';
import { useNavigate } from 'react-router-dom';
import Alert from 'UI/updateAlert';
import { IresetPassword } from "app/interfaces/resetPassword";
import { labelStyle, inputStyle } from 'UI/formStyle';

const initialValues: IresetPassword = {
    current_password: '',
    password: '',
    password_confirmation: '',
};

const ResetPassword = () => {
    const navigate = useNavigate();
    const [isAlert, setIsAlert] = useState<boolean>(false);
    const [responseMessage, setResponseMessage] = useState<string>('');

    const validationSchema = Yup.object({
        current_password: Yup.string().required('Current password is required'),
        password: Yup.string().required('Password is required'),
        password_confirmation: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Passwords must match').required('Confirm Password is required'),
    });

    const onSubmit = async (values: IresetPassword, { resetForm }: any) => {
        const current_password= values.current_password;
        const password = values.password;
        const password_confirmation = values.password_confirmation;
        const response = await resetCompanyPassword({
            current_password,
            password,
            password_confirmation,   
        });
        if (response.code === 200) {
            setResponseMessage(response.data.message);
            navigate('/dashboard');
        }
        else {
            setResponseMessage(response.message)
            setIsAlert(true);
        }
    };

    return(
        <React.Fragment>
            <h1>Reset Password</h1>
            {isAlert && <Alert responseMessage={responseMessage}
                setIsAlert={setIsAlert}
                 />}
            <br/>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}>
                {({ errors, status, touched, resetForm }) => {
                    return (
                        <Form className="login__card-form">
                            <br />

                            <div>
                                <label className={labelStyle}>Current Password</label>
                                <br />
                                <div >
                                    <Field
                                        name="current_password"
                                        type="password"
                                        className={inputStyle}
                                    />
                                </div>
                            </div>
                            <div style={{ color: 'red' }}>
                                <ErrorMessage name="current_password" />
                            </div>
                            <div>
                                <label className={labelStyle}>Password</label>
                                <br />
                                <div >
                                    <Field
                                        name="password"
                                        type="password"
                                        className={inputStyle}
                                    />
                                </div>
                            </div>
                            <div style={{ color: 'red' }}>
                                <ErrorMessage name="password" />
                            </div>
                            <div>
                                <label className={labelStyle}>Confirm Password</label>
                                <br />
                                <div >
                                    <Field
                                        name="password_confirmation"
                                        type="password"
                                        className={inputStyle}
                                    />
                                </div>
                            </div>
                            <div style={{ color: 'red' }}>
                                <ErrorMessage name="password_confirmation" />
                            </div>

                            <div className="login__buttons">
                                <button className="btn login__card-btn bg-sky-400" type="submit" disabled={false}>
                                    Submit
                                </button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </React.Fragment>
    )
}

export default ResetPassword;