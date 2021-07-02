import React, { useEffect, useState, useRef } from 'react'
import QRCode from 'qrcode.react';
import { saveAs } from 'file-saver';

function GuestList(props) {
    const [guests, setGuests] = useState([]);
    const [codeGuest, setCodeGuest] = useState()
    const [viewCode, setViewCode] = useState(false)

    const form = useRef(null)

    useEffect(() => {
        getGuests()
    }, []);

    const getGuests = () => {
        fetch("https://ashkev.peterboroughtenants.app/api/guests")
            .then(response => response.json())
            .then(data => setGuests(data))
    }

    const deleteGuest = (id) => {
        fetch(`https://ashkev.peterboroughtenants.app/api/guests/${id}`, {
            method: 'DELETE'
        }).then(() => getGuests())
    }

    const nullifyEmptyStrings = (key, value) => {
        if (value === '') {
            return undefined
        }
        return value
    }

    const addNewGuest = (e) => {
        e.preventDefault()
        const formData = new FormData(form.current)
        let formJson = JSON.stringify(Object.fromEntries(formData), nullifyEmptyStrings)

        fetch('https://ashkev.peterboroughtenants.app/api/guests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: formJson
        })
            .then(response => {
                if (response.status !== 200) {
                    alert('There was a problem adding the new guest.')
                    return null
                }
                return response.json()
            })
            .then(data => {
                if (data === null) {
                    return
                }
                const updatedList = []
                updatedList.push(...guests, data)
                setGuests(updatedList)
            })
    }

    const downloadCode = () => {
        let guest = codeGuest
        let id = guest.id
        if (guest.linked_to !== null) {
            id = guest.linked_to
        }

        let canvas = document.getElementById("the-qr-code")
        canvas.toBlob(blob => saveAs(blob, `QR_${id}_${guest.last_name.toUpperCase()}.png`))
    }

    return (
        <React.Fragment>
            <header className="p-6">
                <h1 className="font-bold text-xl">Guest List</h1>
            </header>

            <form ref={form} className="p-6 print:hidden" style={{ maxWidth: '550px' }} onSubmit={addNewGuest}>
                <header className="mb-3 border-b pb-2 w-full">
                    Add new guest
                </header>
                <dl className="grid grid-cols-2 gap-3">
                    <dt className="font-bold col-start-1 col-span-1">Name</dt>
                    <dd className="col-start-2 col-span-1">
                        <input required className="w-full border shadow-inner p-2 mx-1" name="first_name" placeholder="First Name" />
                    </dd>
                    <dd className="col-start-2 col-span-1">
                        <input required className="w-full border shadow-inner p-2 mx-1" name="last_name" placeholder="Last Name" />
                    </dd>
                    <dt className="font-bold col-start-1 col-span-1">
                        Display Name
                    </dt>
                    <dd>
                        <input className="w-full border shadow-inner p-2 mx-1" name="display_name" />
                    </dd>
                    <dt className="font-bold col-start-1 col-span-1">
                        Parent ID
                    </dt>
                    <dd>
                        <input className="w-full border shadow-inner p-2 mx-1" name="linked_to" />
                    </dd>
                </dl>
                <button className="border-b-2 border-blue-400 bg-blue-200 text-blue-900 py-1 hover:bg-blue-100 px-3">Save</button>
            </form>

            <main className="overflow-y-hidden">
                <table className="w-full overflow-y-scroll pr-3">
                    <thead className="border-b-2 top-0 sticky bg-gray-100">
                        <tr>
                            <th className="py-3 px-3 text-left pl-6">Id</th>
                            <th className="py-3 px-3 text-left">Full Name</th>
                            <th className="py-3 px-3 text-left">Display Name</th>
                            <th className="py-3 px-3 text-left">Parent ID</th>
                            <th className="py-3 px-3 text-left">Attending</th>
                            <th className="py-3 px-3 text-left">Requirements</th>
                            <th className="py-3 px-3 text-left">Accomodation</th>
                            <th className="py-3 px-3 text-left print:hidden">QR Code</th>
                            <th className="print:hidden pr-6"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {guests.map(guest => (
                            <tr>
                                <td className="py-2 px-3 pl-6 border-b">
                                    {guest.linked_to === null && guest.id}
                                </td>
                                <td className="py-2 px-3 border-b">
                                    {guest.first_name} {guest.last_name}
                                </td>
                                <td className="py-2 px-3 border-b">
                                    {guest.display_name}
                                </td>
                                <td className="py- px-3 border-b">
                                    {guest.linked_to}
                                </td>
                                <td className="py-2 px-3 border-b">
                                    {guest.responded_at === null ? "" : (
                                        guest.attending ? "YES" : "NO"
                                    )}
                                </td>
                                <td className="py-2 px-3 border-b">
                                    {guest.requirements}
                                </td>
                                <td className="py-2 px-3 border-b">
                                    {guest.accomodation && "Required"}
                                </td>
                                <td className="py-2 px-3 border-b print:hidden">
                                    <button className="underline hover:text-blue-700" onClick={() => {
                                        setCodeGuest(guest)
                                        setViewCode(true)
                                    }}>
                                        View
                                    </button>
                                </td>
                                <td className="py-2 px-3 border-b print:hidden pr-6">
                                    <button className="underline hover:text-blue-700" onClick={() => deleteGuest(guest.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {guests.length === 0 && (
                    <div className="p-6 my-6 bg-gray-200 text-center">
                        There are no guests added.
                    </div>
                )}
            </main>

            {viewCode && (
                <section className="flex sticky bottom-0 w-full bg-white p-6 border-t-2 justify-between items-start">
                    <div className="flex gap-6">
                        <img alt="qr code" src={`https://ashkev.peterboroughtenants.app/api/qr-code/${codeGuest.linked_to || codeGuest.id}`} />
                        <aside className="pl-6 border-l flex flex-col gap-5">
                            <a href={`https://ashkev.peterboroughtenants.app/rsvp/${codeGuest.linked_to || codeGuest.id}`} target="_blank" className="block border-b-2 border-blue-400 bg-blue-200 text-blue-900 py-1 hover:bg-blue-100 px-3">
                                RSVP Page 
                            </a>
                            <a href={`https://ashkev.peterboroughtenants.app/api/qr-code/${codeGuest.linked_to || codeGuest.id}`} className="block border-b-2 border-green-400 bg-green-200 text-green-900 py-1 hover:bg-green-100 px-3">
                                Download
                            </a>
                        </aside>
                    </div>
                    <button className="underline hover:text-blue-700" onClick={() => setViewCode(false)}>Close</button>
                </section>
            )}
        </React.Fragment>
    )
}

export default GuestList