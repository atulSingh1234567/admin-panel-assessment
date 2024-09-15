import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Admin() {
    const [showData, setShowData] = useState([]);
    const [pageNo, setPageNo] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteRow, setDeleteRow] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [AfterSearchData, setAfterSearchData] = useState([]);

    useEffect(
        () => {
            axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
                .then(
                    (response) => {
                        localStorage.setItem("data", JSON.stringify(response.data))
                        showTotalPages(response.data)
                        pageNoClicked(1, response.data)
                        setAfterSearchData(response.data)
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
    const pageNoClicked = function (pageNum = 1, currentdata = JSON.parse(localStorage.getItem("data"))) {
        setCurrentPage(pageNum);
        const startIndex = (pageNum - 1) * 10;
        const endIndex = startIndex + 10;

        const exactData = currentdata.slice(startIndex, endIndex)
        setShowData(exactData)
    }

    // set pageNo
    const showTotalPages = function (currentdata = JSON.parse(localStorage.getItem("data"))) {
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
    const deleteSelectedRows = function (array) {
        const filteredData = AfterSearchData.filter(function (item) {
            return !array.includes(item.id);
        });

        const emptyArray = array.filter(function (item) {
            return !array.includes(item);
        })

        localStorage.setItem("data", JSON.stringify(filteredData));
        setDeleteRow(emptyArray)
        pageNoClicked(1, JSON.parse(localStorage.getItem("data")))
        showTotalPages(JSON.parse(localStorage.getItem("data")))
        setAfterSearchData(JSON.parse(localStorage.getItem("data")))
    }


    // search function
    function handleSearchClick() {
        if (searchQuery === "") {
            pageNoClicked(1, JSON.parse(localStorage.getItem("data")));
            setAfterSearchData(JSON.parse(localStorage.getItem("data")));
            showTotalPages(JSON.parse(localStorage.getItem("data")));
            return;
        }
        const filterBySearch = JSON.parse(localStorage.getItem("data")).filter((item) => {
            if (item.name.toLowerCase()
                .includes(searchQuery.toLowerCase()) || item.email.toLowerCase().includes(searchQuery.toLowerCase())
                || item.role.toLowerCase().includes(searchQuery.toLowerCase())) { return item; }
        })
        setAfterSearchData(filterBySearch)
        showTotalPages(filterBySearch)
        pageNoClicked(1, filterBySearch)

    }

    return (
        <div className='flex flex-col justify-between h-[100%] items-center gap-14'>
            <input
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleSearchClick()
                    }
                }} onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder='Search name, email or role' className='relative border border-gray-200 w-[50%] min-w-[350px] h-12 px-2 rounded-xl focus:outline-none' />
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
                                    <td><input checked={deleteRow.includes(item.id)} type="checkbox" name="checkbox" onChange={(e) => {
                                        if (e.target.checked) {
                                            setDeleteRow((prev) => [...prev, item.id]);
                                        } else {
                                            setDeleteRow((prev) => prev.filter((id) => id !== item.id));
                                        }
                                    }} /></td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.role}</td>
                                    <td>
                                        <button className='pr-4'><img className='w-4 h-4' src="edit.png" alt="" /></button>
                                        <button className='text-red-600' onClick={() => deleteSelectedRows([item.id])}> <img className='w-4 h-4' src="delete.png" alt="" /> </button></td>
                                </tr>
                            })
                        }

                    </tbody>


                </table>
            </div>
            <div className='relative bottom-4 w-full flex  items-center justify-center gap-10'>
                <button className='border bg-red-400 rounded-xl p-2' onClick={() => deleteSelectedRows(deleteRow)}>Delete Selected</button>
                <div className='flex p-2 gap-4'>
                    {pageNo.map(function (num) {
                        return (
                            <button
                                key={num} // Ensure each button has a unique key
                                onClick={() => pageNoClicked(num, AfterSearchData)}
                                className={`w-8 h-8 flex justify-center items-center rounded-full ${currentPage === num ? 'bg-blue-400' : 'bg-gray-200 hover:bg-blue-400'}`}
                            >
                                {num}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}
