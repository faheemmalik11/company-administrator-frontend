import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Alert from 'UI/Alert';
import Select from 'react-select';
import { getAllCategories } from 'services/inventory_categories';
import { addInventoryStore, getAllStores } from 'services/inventory_stores';
import { IaddItem } from 'app/interfaces/inventory_addItem';
import { addInventoryItem } from 'services/inventory_items';

const itemInitialValues: IaddItem = {
    name: '',
    quantity: '',
    description: '',
    category_id: null,
    store_id: null
};

interface CategoryOption {
    label: string,
    value: number | null
}
const AddInventoryItem = () => {
    const [CategoryOption, setCategoryOption] = useState<CategoryOption[]>([])
    const [storeOption, setStoreOption] = useState<CategoryOption[]>([])
    const [isAlert, setIsAlert] = useState<boolean>(false);
    const [showLink, setShowLink] = useState<boolean>(false);
    const [responseMessage, setResponseMessage] = useState<string>('');
    const [selectCategories_errorMessage, setSelectCategories_ErrorMessage] = useState<string>('');
    const [selectStore_errorMessage, setSelectStore_ErrorMessage] = useState<string>('');
    const [selectCategories_isTouched, setSelectCategories_IsTouched] = useState<boolean>(false);
    const [selectStore_isTouched, setSelectStore_IsTouched] = useState<boolean>(false);
    const [selectedOptionsCategories, setSelectedOptionsCategories] = useState<CategoryOption>({ label: '', value: 0 });
    const [selectedOptionsStores, setSelectedOptionsStores] = useState<CategoryOption>({ label: '', value: 0 });
    // const [categoriesId, setCategoriesId] = useState<number[] | null>([]);
    // const [storeId, setStoreId] = useState<number[] | null>([]);


    useEffect(() => {
        const getCategory = async () => {
            const response = await getAllCategories();
            const category: CategoryOption[] = [];
            for (let i = 0; i < response.length; i++) {
                category.push({
                    label: response[i].name,
                    value: response[i].id
                });
            }
            setCategoryOption(category)
        }
        const getStore = async () => {
            const response = await getAllStores();
            const store: CategoryOption[] = [];
            for (let i = 0; i < response.length; i++) {
                store.push({
                    label: response[i].name,
                    value: response[i].id
                });
            }
            setStoreOption(store)
        }
        getCategory()
        getStore();
    }, [])

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        quantity: Yup.number().required('Quantity is required'),
        description: Yup.string().max(255, 'Must be 255 characters or less').min(3, 'Minimum 3 characters'),
    });
    const onSubmit = async (values: IaddItem, { resetForm }: any) => {
        const name = values.name;
        const description = values.description;
        const quantity = values.quantity;
        const category_id = selectedOptionsCategories.value;
        const store_id = selectedOptionsStores.value;

        const response = await addInventoryItem({
            name,
            quantity,
            description,
            category_id,
            store_id
        });
        if (response.code === 200) {
            setResponseMessage(response.data.message);
            setShowLink(true)

        }
        else {
            setResponseMessage(response.message)
        }
        // if(location.state !== null){
        //     location.state=null;
        // }
        setIsAlert(true);
        resetForm();
        setSelectedOptionsStores({ label: '', value: 0 })
        setSelectedOptionsCategories({ label: '', value: 0 })
    };

    const validateSelectionCategories = () => {
        if (selectedOptionsCategories.value === 0) {
            setSelectCategories_ErrorMessage('Please select an option.');
        } else {
            setSelectCategories_ErrorMessage('');
        }
    };

    const validateSelectionStore = () => {
        if (selectedOptionsStores.value === 0) {
            setSelectStore_ErrorMessage('Please select an option.');
        } else {
            setSelectStore_ErrorMessage('');
        }
    };

    const handleSelectCategories = (e: any) => {
        let category: CategoryOption = { label: '', value: null };
        category.label = e.label,
        category.value = e.value
      //  setCategoriesId(e.value);
        setSelectedOptionsCategories(category)
        if (selectCategories_isTouched) {
            validateSelectionCategories();
        }

        // const categories: CategoryOption[] = [];
        // const catId = [];
        // for (let i = 0; i < e.length; i++) {
        //     categories.push({
        //         label: e[i].label,
        //         value: e[i].value
        //     });
        //     catId.push(e[i].value);
        // }
        // setSelectedOptionsCategories(categories)
        // setCategoriesId(catId);
        // if (select_isTouched) {
        //     validateSelection(rolesDataId);
        // }
    };

    const handleSelectStore = (e: any) => {
        let store: CategoryOption = { label: '', value: null };
        store.label = e.label,
        store.value = e.value
     //  setStoreId(e.value);
        setSelectedOptionsStores(store)
        if (selectStore_isTouched) {
            validateSelectionStore();
        }      
    };

    const handleBlurCategories = () => {
        setSelectCategories_IsTouched(true);
        validateSelectionCategories();
    };
    const handleBlurStore = () => {
        setSelectStore_IsTouched(true);
        validateSelectionStore();
    };
    return (
        <React.Fragment>
            {isAlert && <Alert
                responseMessage={responseMessage}
                setIsAlert={setIsAlert}
                showLink={showLink}
                setShowLink={setShowLink} 
                linkValue='Items'/>}
            <h1>Add Item Data</h1>
            <Formik initialValues={itemInitialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                {({ errors, status, touched, resetForm }) => {
                    return (
                        <Form className="login__card-form">
                            
                            <br />
                            <div>Select Store
                                <Select
                                    required
                                    value={selectedOptionsStores}
                                   // isMulti
                                    name='finance_category_id'
                                    options={storeOption}
                                    onChange={handleSelectStore}
                                    onBlur={handleBlurStore}
                                    className="basic-multi-select"
                                    classNamePrefix="select" />
                                {selectStore_errorMessage && 
                                <p style={{ color: 'red' }}>{selectStore_errorMessage}</p>}
                            </div>
                            <br />
                            <div>Select category
                                <Select
                                    required
                                    value={selectedOptionsCategories}
                                    //isMulti
                                    name='finance_category_id'
                                    options={CategoryOption}
                                    onChange={handleSelectCategories}
                                    onBlur={handleBlurCategories}
                                    className="basic-multi-select"
                                    classNamePrefix="select" />
                                {selectCategories_errorMessage &&
                                 <p style={{ color: 'red' }}>{selectCategories_errorMessage}</p>}
                            </div>
                            <div>
                                <label>Name</label>
                                <br />
                                <div style={{ border: '1px solid black' }}>
                                    <Field
                                        border="1px solid black"
                                        name="name"
                                        type="text"
                                    //  className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')}
                                    />
                                </div>
                            </div>
                            <div style={{ color: 'red' }}>
                                <ErrorMessage name="name" />
                            </div>
                            
                            <div>
                                <label>Quantity</label>
                                <br />
                                <div style={{ border: '1px solid black' }}>
                                    <Field
                                        name="quantity"
                                        type="number"
                                    // className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')}
                                    />
                                </div>
                            </div>
                            <div style={{ color: 'red' }}>
                                <ErrorMessage name="quantity" />
                            </div>
                            <div>
                                <label>Description</label>
                                <br />
                                <div style={{ border: '1px solid black' }}>
                                    <Field
                                        name="description"
                                        type="text"
                                    //    className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')}
                                    />
                                </div>
                            </div>
                            <div style={{ color: 'red' }}>
                                <ErrorMessage name="description" />
                            </div>

                            <div className="login__buttons">
                                <button className="btn login__card-btn" type="submit" disabled={false} onClick={() => {
                                    if (selectedOptionsCategories.value === 0) {
                                        setSelectCategories_ErrorMessage('Please select an option.');
                                    } else {
                                        setSelectCategories_ErrorMessage('');
                                    }
                                    if (selectedOptionsStores.value === 0) {
                                        setSelectStore_ErrorMessage('Please select an option.');
                                    } else {
                                        setSelectStore_ErrorMessage('');
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

export default AddInventoryItem;
