import React, { useState, useEffect, useRef, createRef } from 'react'
import { useParams } from 'react-router'
import monogram from './Monogram.svg'
import date from './web-invite-datelayoutdesign.svg'
import designLeft from './bg-left.svg'
import designRight from './bg-right.svg'

function Rsvp(props) {
    let { token } = useParams();
    const [guests, setGuests] = useState([])
    const [sentIds, setSentIds] = useState([])

    const forms = useRef([])

    useEffect(() => {
        getGuests()
    }, []);

    const getGuests = () => {
        fetch(`https://ashkev.peterboroughtenants.app/api/rsvp/${token}`)
            .then(response => response.json())
            .then(data => setGuests(data))
    }

    const Names = (props) => {
        let name = [];

        if (guests.length === 0) {
            name[0] = "Loading..."
        }

        if (guests.length === 1) {
            name[0] = guests[0].display_name || `${guests[0].first_name} ${guests[0].last_name}`
        }

        if (guests.length === 2) {
            let g1 = guests[0].display_name || guests[0].first_name + (guests[0].last_name === guests[1].last_name ? '' : ' ' + guests[0].last_name)
            let g2 = guests[1].display_name || `${guests[1].first_name} ${guests[1].last_name}`

            name[0] = g1 + ' & ' + g2
        }

        if (guests.length > 2) {
            name = []
            guests.forEach((guest, i) => {
                name[i] = guest.display_name || `${guest.first_name} ${guest.last_name}`
            })

        }

        return (
            <p className="font-bold my-6 text-2xl capitalize">
                <span className="text-sm">TO: </span>
                {name.join(", ")}
            </p>
        )
    }

    const stringToBool = (key, value) => {
        if (value === "true") {
            return true
        }
        if (value === "false") {
            return false
        }

        return value
    }

    const handleSend = (e, guest, i) => {
        e.preventDefault()
        const formData = new FormData(forms.current[i])
        let formJson = JSON.stringify(Object.fromEntries(formData), stringToBool)

        fetch(`https://ashkev.peterboroughtenants.app/api/rsvp/${guest.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: formJson
        }).then(response => {
            if (response.status !== 200 ) {
                return
            }

            let idList = []
            idList.push(...sentIds, guest.id) 
            setSentIds(idList)
        })
    }

    return (
        <React.Fragment>
            <main className="grid grid-cols-1 grid-rows-1 border-fat border-gold max-w-prose mx-auto">
                <img alt="Grey whirl" src={designLeft} className="col-span-full row-span-full w-1/2 self-end" />
                <img alt="Another grey whirl" src={designRight} className="col-span-full row-span-full w-1/2 self-end justify-self-end" />
                <div className="col-span-full row-span-full">
                    <img alt="Ashley & Kevin" src={monogram} className="w-full object-cover object-center h-auto mb-12" />
                    <header className="font-serif text-center px-8 mt-12 mb-6">
                        <h1 className="uppercase my-6">
                            The marriage of Ashley Beech & Kevin Goodger
                        </h1>
                        <Names />
                        <p className="text-gray-600 text-sm">
                            Please RSVP using the form below
                        </p>
                    </header>
                    <img alt="Saturday 30th July 2022 at 2PM" src={date} className="w-full object-contain object-center h-auto px-8 mb-6" />
                    <p className="font-serif text-center uppercase px-6 mx-6 mb-10">
                        We would like to request the pleasure of your company to join us
                        in celebrating our love
                    </p>
                </div>
            </main>
            <section className="border-fat border-gold max-w-prose mx-auto border-t-0 pt-6">
                {guests.map((guest, i) => (
                    <form key={guest.id} ref={(ref) => forms.current.push(ref)} onSubmit={e => handleSend(e, guest, i)} className="px-6 mb-6 font-serif">
                        <h2 className="text-center underline">{guest.first_name} {guest.last_name}:</h2>
                        <div className="md:flex gap-3 my-3">
                            <div className="p-2 divide-solid w-1/3">
                                <p className="font-bold md:text-xs">Can you attend?</p>
                                <label className="md:text-xs block my-2">
                                    <input className="mr-2" type="radio" name="attending" value="true" />
                                    Yes
                                </label>
                                <label className="md:text-xs block my-2">
                                    <input className="mr-2" type="radio" name="attending" value="false" />
                                    No
                                </label>
                            </div>

                            <div className="p-2 divide-solid w-1/3">
                                <p className="font-bold md:text-xs">Do you require accomodation?</p>
                                <label className="md:text-xs block my-2">
                                    <input className="mr-2" type="radio" name="accomodation" value="true" />
                                    Yes
                                </label>
                                <label className="md:text-xs block my-2">
                                    <input className="mr-2" type="radio" name="accomodation" value="false" />
                                    No
                                </label>
                            </div>

                            <div className="p-2 divide-solid">
                                <label className="font-bold md:text-xs">Do you have any other requirements (e.g. dietary)</label>
                                <textarea className="my-2 p-1 md:text-xs w-full border shadow-inner" name="requirements"></textarea>
                            </div>
                        </div>
                        <footer className="flex">
                            <button className="p-2 bg-gray-200 hover:bg-gray-900 hover:text-gold">Send</button>
                            {sentIds.includes(guest.id) && (
                                <span className="p-2 bg-green-200 mx-3">Saved</span>
                            )}
                        </footer>
                    </form>
                ))}
            </section>
        </React.Fragment>
    )
}

export default Rsvp