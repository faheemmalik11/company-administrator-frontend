import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { IaddFinance } from 'app/interfaces/add_finance';
import * as Yup from 'yup';
import { addFinanceData, getAllFinanceCategories } from 'services/finance';
import Select from 'react-select';
import Alert from 'UI/Alert';
import { labelStyle, inputStyle } from 'UI/formStyle';

const financeInitialValues: IaddFinance = {
    finance_category_id: '',
    amount: '',
    tax_deduction: '',
    check_number: '',
    description: '',
};
interface CategoryOption {
    label: string,
    value: number
}
const AddFinance = () => {
    const [financeCategoryOption, setFinanceCategoryOption] = useState<CategoryOption[]>([])
    const [select_errorMessage, setSelect_ErrorMessage] = useState<string>('');
    const [select_isTouched, setSelect_IsTouched] = useState<boolean>(false);
    const [selectedOptions, setSelectedOptions] = useState<CategoryOption>({ label: '', value: 0 });
    const [isAlert, setIsAlert] = useState<boolean>(false);
    const [showFinanceLink, setShowFinanceLink] = useState<boolean>(false);
    const [responseMessage, setResponseMessage] = useState<string>('');

    useEffect(() => {
        const getFinanceCategory = async () => {
            const response = await getAllFinanceCategories();
            const category: CategoryOption[] = [];
            for (let i = 0; i < response.finance_category.length; i++) {
                category.push({
                    label: response.finance_category[i].name,
                    value: response.finance_category[i].id
                });
            }
            setFinanceCategoryOption(category)
        }
        getFinanceCategory()
    }, [])
    const validationSchema = Yup.object({
        amount: Yup.number().required('Amount is required'),
        check_number: Yup.string().required('Check No. is required'),
        description: Yup.string().max(255, 'Must be 255 characters or less').min(3, 'Minimum 3 characters'),
    });
    const onSubmit = async (values: IaddFinance, { resetForm }: any) => {
        const finance_category_id = selectedOptions.value;
        const amount = values.amount;
        const check_number = values.check_number;
        const description = values.description;
        const tax_deduction = values.tax_deduction;


        const response = await addFinanceData({
            finance_category_id,
            amount,
            check_number,
            description,
            tax_deduction,
        });
        if (response.code === 200) {
            setResponseMessage(response.data.message);
            setShowFinanceLink(true)

        }
        else {
            setResponseMessage(response.message)
        }
        // if(location.state !== null){
        //     location.state=null;
        // }
        setIsAlert(true);
        resetForm();
        setSelectedOptions({ label: '', value: 0 });
    };
    const validateSelection = () => {
        if (selectedOptions.value === 0) {
            setSelect_ErrorMessage('Please select an option.');
        } else {
            setSelect_ErrorMessage('');
        }
    };

    const handleSelect = (e: any) => {
        let category: CategoryOption = { label: '', value: 0 };
        category.label = e.label,
            category.value = e.value
        setSelectedOptions(category)
        if (select_isTouched) {
            validateSelection();
        }
    };

    const handleBlur = () => {
        setSelect_IsTouched(true);
        validateSelection();
    };
    return (
        <React.Fragment>
            {isAlert && <Alert
                responseMessage={responseMessage}
                setIsAlert={setIsAlert}
                showLink={showFinanceLink}
                setShowLink={setShowFinanceLink}
                linkValue='finance' />}
            <h1>Add Finance Data</h1>
            <Formik initialValues={financeInitialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                {({ errors, status, touched, resetForm }) => {
                    return (
                        <Form className="login__card-form">
                            <br />
                            <div>
                                <label className={labelStyle}>Select a finance Category</label>
                                <Select
                                    required
                                    //value={selectedOptions}
                                    name='finance_category_id'
                                    options={financeCategoryOption}
                                    onChange={handleSelect}
                                    onBlur={handleBlur}
                                    className="basic-multi-select"
                                    classNamePrefix="select" />
                                {select_errorMessage && <p style={{ color: 'red' }}>{select_errorMessage}</p>}
                            </div>
                            <br/>
                            <div>
                                <label className={labelStyle}>Amount</label>
                                <br />
                                <div >
                                    <Field
                                        border="1px solid black"
                                        name="amount"
                                        type="number"
                                        className={inputStyle}
                                    />
                                </div>
                            </div>
                            <div style={{ color: 'red' }}>
                                <ErrorMessage name="amount" />
                            </div>
                            <div>
                                <label className={labelStyle}>Tax Deduction</label>
                                <br />
                                <div >
                                    <Field
                                        name="tax_deduction"
                                        type="number"
                                        className={inputStyle}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelStyle}>Check Number</label>
                                <br />
                                <div >
                                    <Field
                                        name="check_number"
                                        type="text"
                                        className={inputStyle}
                                    />
                                </div>
                            </div>
                            <div style={{ color: 'red' }}>
                                <ErrorMessage name="check_number" />
                            </div>
                            <div>
                                <label className={labelStyle}>Description</label>
                                <br />
                                <div >
                                    <Field
                                        name="description"
                                        type="text"
                                        className={inputStyle}
                                    />
                                </div>
                            </div>
                            <div style={{ color: 'red' }}>
                                <ErrorMessage name="description" />
                            </div>

                            <div className="login__buttons">
                                <button className="btn login__card-btn bg-sky-400" type="submit" disabled={false} onClick={() => {
                                    resetForm;
                                    if (selectedOptions.value === 0) {
                                        setSelect_ErrorMessage('Please select an option.');
                                    } else {
                                        setSelect_ErrorMessage('');
                                    }
                                }}>
                                    Submit
                                </button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </React.Fragment>
    );
}

export default AddFinance;
