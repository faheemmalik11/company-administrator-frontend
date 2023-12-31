import React, { useEffect, useState } from 'react'
import { IEmployee } from 'app/interfaces/employee';
import { getCompanyEmployees } from 'services/employees';
import { Link, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
//import StatusPopup from './statusPopup';
import { dateFormat } from 'utils/date';
import DeletePopup from 'UI/deletePopup';
import Modal from 'UI/Modal';
import { customStyles } from 'UI/tableStyle';
import { deleteCompanyEmployeeById } from "services/employees";

interface Props {
    update_id: number | undefined,
}

const Employees: React.FC<Props> = ({ update_id }) => {
    const navigate = useNavigate();
    const [employeeData, setEmployeeData] = useState<IEmployee[]>([]);
    const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
    const [highlightedId, setHighlightedId] = useState<number>();
    const [isStatusPopup, setIsStatusPopup] = useState<boolean>(false);
    const [isDeletePopup, setIsDeletePopup] = useState<boolean>(false);
    const [employeeId, setEmployeeId] = useState<number>();
    const [deleteDependency, setDeleteDependency] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {

        const getAllEmployees = async () => {
            setDeleteDependency(false);
            setHighlightedId(update_id)

            const response = await getCompanyEmployees();
            for (let i = 0; i < response.length; i++) {
                if (response[i].date_of_birth) {
                    const date = dateFormat(response[i].date_of_birth);
                    response[i].date_of_birth = date
                }
            }
            setEmployeeData(response)
        }
        getAllEmployees();
    }, [isStatusPopup, deleteDependency])

    useEffect(() => {
        setIsHighlighted(true)
        setTimeout(() => {
            setIsHighlighted(false);
            setHighlightedId(0)
        }, 3000);
    }, [update_id])

    // const statusHandler = (id: number) => {
    //     setEmployeeId(id)
    //     setIsStatusPopup(true)
    // }

    const divClickHandler = () => {
        if (isStatusPopup) {
            setIsStatusPopup(false)
        }
    }
    const handleAddEmployee = () => {
        navigate('/add_employee')
    }
    const incrementHandler = (id: number) => {
        navigate(`/incrementHistory_employee/${id}`)
    }
    const deleteEmployeeHandler = (id: number) => {
        setEmployeeId(id);
        setIsDeletePopup(true)
    }

    const deleteHandlerInPopup = async (id: number | undefined) => {
        setIsLoading(false)
        const response = await deleteCompanyEmployeeById(id);
        if (response.code === 200) {
            setIsDeletePopup(false);
            setDeleteDependency(true);
        }
        else {

        }
    }
    
    
    const columns = [
        {
            name: 'Id',
            cell: (row: IEmployee) => row.id
        },
        {
            name: 'Name',
            cell: (row: IEmployee) => <Link title='update' to={`/update_employee/${row.id}`}>{row?.name}</Link>
        },
        {
            name: 'City',
            cell: (row: IEmployee) => row?.city || ''
        },
        {
            name: 'DOB',
            cell: (row: IEmployee) => row.date_of_birth
        },

        {
            name: 'Email',
            cell: (row: IEmployee) => row.email
        },
        {
            name: 'Cnic',
            cell: (row: IEmployee) => row.cnic
        },
        {
            name: 'Status',
            cell: (row: IEmployee) => row.status.name
        },
        // {
        //     name: 'Status',
        //     selector: (row: any) => <button title='update status' onClick={() => { statusHandler(row.id) }}>
        //     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
        //     <path  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        // </svg>
        // </button>

        // },
        {
            name: 'Action',
            cell: (row: IEmployee) => <button title='increment history' onClick={() => { incrementHandler(row.id) }}><svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                //strokewidth="1.5"
                stroke="currentColor"
                className="h-8 w-8">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg></button>

        },
        {
            name: 'Delete',
            cell: (row: IEmployee) => <button title='delete Employee' onClick={() => { deleteEmployeeHandler(row.id) }}>
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                    <path d="M19 0H1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1ZM2 6v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6H2Zm11 3a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8a1 1 0 0 1 2 0h2a1 1 0 0 1 2 0v1Z" />
                </svg>
            </button>

        }
    ]
    return (
        <div onClick={divClickHandler}>
            {/* <Modal isOpen={isStatusPopup} onClose={() => { setIsStatusPopup(false) }}>
                {isStatusPopup && <StatusPopup setIsStatusPopup={setIsStatusPopup} employeeId={employeeId} />}
            </Modal> */}
            <Modal isOpen={isDeletePopup} onClose={() => { setIsDeletePopup(false) }}>
                {isDeletePopup && <DeletePopup
                    deleteHandlerInPopup={deleteHandlerInPopup}
                    setIsDeletePopup={setIsDeletePopup}
                    id={employeeId}
                    isLoading={isLoading} />}
            </Modal>
            <button className="bg-sky-400" onClick={handleAddEmployee}>Add new employee</button>
            
            <DataTable
                
                columns={columns}
                data={employeeData}
                pagination
                fixedHeader
                fixedHeaderScrollHeight='550px'
                customStyles={customStyles} />
{/* <tr className={((highlightedId == employee.id) && isHighlighted) ? `border-2 border-green-600` : 'border-2'} key={employee.id}></tr> */}
            
        </div>
    )
}

export default Employees