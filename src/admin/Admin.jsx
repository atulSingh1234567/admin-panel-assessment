import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Admin() {
    const [data, setData] = useState([]);
    const [showData, setShowData] = useState([]);
    const [pageNo, setPageNo] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteRow, setDeleteRow] = useState([]);
    const [searchQuery , setSearchQuery] = useState('');

    useEffect(
        () => {
            axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
                .then(
                    (response) => {
                        setData(response.data);
                        showTotalPages(response.data)
                        pageNoClicked(1, response.data)
                    }
                )
                .catch(
                    (err) => {
                        console.log(err);
                    }
                )
        }, []
    )

    // showData setup
    const pageNoClicked = function (pageNum = 1, currentdata = data) {
        setCurrentPage(pageNum);
        const exactNum = pageNum * 10;
        const exactData = currentdata.filter(function (item) {
            return item.id <= exactNum && item.id > exactNum - 10;
        })

        setShowData(exactData);

    }

    // set pageNo
    const showTotalPages = function (currentdata = data) {
        let totalLen = currentdata.length / 10;
        if (totalLen > Math.floor(totalLen)) {
            let array = [];
            let size = Math.floor(totalLen) + 1;
            for (let i = 0; i < size; i++) {
                array[i] = i + 1;
            }
            setPageNo(array);
        }
    }

    // delete rows
    const deleteSelectedRows = function(array){
        console.log(array)
        array.map(function(item1){
            const filtereddata = showData.filter(function(item2){
                return item1 != item2.id;
            })
            console.log(filtereddata)
            setShowData(filtereddata)
        })
    }    

    // search function
    function handleSearchClick() {
        if (searchQuery === "") { pageNoClicked(1 , data); showTotalPages(data); return; }
        const filterBySearch = data.filter((item) => {
            if (item.name.toLowerCase()
                .includes(searchQuery.toLowerCase()) || item.email.toLowerCase().includes(searchQuery.toLowerCase())
            || item.role.toLowerCase().includes(searchQuery.toLowerCase())) { return item; }
        })

        pageNoClicked(1, filterBySearch)
        showTotalPages(filterBySearch)
        // setShowData(filterBySearch)
    }

    console.log(deleteRow)
    console.log(searchQuery)
    return (
        <div className='flex flex-col justify-center items-center gap-8'>
            <input onKeyDown={(e)=>{
                if(e.key === 'Enter'){
                    handleSearchClick()
                }
            }} onChange={(e)=>setSearchQuery(e.target.value)} type="text" placeholder='Search name, email or role' className='border border-gray-200 w-[50%] h-12 px-2 rounded-xl focus:outline-none'/>
            <div className='w-full flex justify-center'>
                <table className='border border-gray-300'>
                    <thead>
                        <tr className='border border-b-2 w-[60%]'>
                            <th>Mark</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            showData.map(function (item) {
                                return <tr>
                                    <td><input defaultValue='false' type="checkbox" name="checkbox" onChange={(e) => {
                                        if (e.target.checked) {
                                            setDeleteRow((prev) => [...prev, item.id]);
                                        } else {
                                            setDeleteRow((prev) => prev.filter((id) => id !== item.id));
                                        }
                                    }} /></td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.role}</td>
                                    <td><button className='text-blue-500 pr-2'>edit</button> <button className='text-red-600' onClick={() => deleteSelectedRows([item.id]) }>delete</button></td>
                                </tr>
                            })
                        }
                        
                    </tbody>
                    

                </table>
            </div>
            {/* <button className='border bg-blue-400 rounded-xl p-2' onClick={()=>deleteSelectedRows(deleteRow)}>Delete selected rows</button> */}
            <div className='flex gap-4'>
                {pageNo.map(function (num) {
                    return (
                        <button
                            key={num} // Ensure each button has a unique key
                            onClick={() => pageNoClicked(num)}
                            className={`w-8 h-8 flex justify-center items-center rounded-full ${currentPage === num ? 'bg-blue-400' : 'bg-gray-200 hover:bg-blue-400'}`}
                        >
                            {num}
                        </button>
                    );
                })}
            </div>

        </div>
    )
}
