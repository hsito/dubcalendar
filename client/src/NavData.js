import * as Fa from 'react-icons/fa';
import * as Bs from 'react-icons/bs';
import * as Im from 'react-icons/im'
import * as Ai from 'react-icons/ai';

import React from 'react'

export const NavData = [
    {
        title: 'Calendar',
        path: '/calendar',
        // icon: <Ci.CiCalendar />,
        icon: <Bs.BsFillCalendarFill />,
        cName: 'nav-text'
    },
    {
        title: 'Courses',
        path: '/courses',
        // icon: <Tfi.TfiNotepad />,
        icon: <Im.ImBook/>,
        cName: 'nav-text',
    },
    {
        title: 'Ratings',
        path: '/ratings',
        icon: <Ai.AiFillStar />,
        cName: 'nav-text',
    },
    {
        title: 'Friends',
        path: '/friends',
        icon: <Fa.FaUserFriends />,
        cName: 'nav-text',
    }
]