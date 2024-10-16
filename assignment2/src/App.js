import React, { useState } from 'react';
import { useEffect } from "react";
import './App.css';

function App() {

  const [currentPage, setCurrentPage] = useState('home');
  const [selectedFacility, setSelectedFacility] = useState('gymreserv');
  const [formData, setFormData] = useState({
    date: '',
    people: 0,
    affiliation: '',
    purpose: ''
  });

    const facilities = {
    gymreserv: {
      name: 'Gym',
      description: 'sports hall',
      days: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun',
      groupSize: '1-5',
      location: 'C1033',
      available: 'Available to all',
      img: 'AssignImages/gym.jpg',
    },
    auditoriumreserv: {
      name: 'Auditorium',
      description: 'The Auditorium Theater',
      days :        ' Mon, Tue, Wed, Thu ',
      groupSize: '10-30',
      location: 'A234',
      available: 'Available to all',
      img: 'AssignImages/auditorium.jpg',
    },
    poolreserv: {
      name: 'Swimming Pool',
      description: 'aquatic center',
      days: 'Sun, Sat',
      groupSize: '1-8',
      location: 'C1033',
      available: 'Available to all',
      img: 'AssignImages/pool.jpg',
    },
    seminarreserv: {
      name: 'Seminar Room',
      description: 'lecture hall',
      days: 'Mon, Wed, Fri',
      groupSize: '10-30',
      location: 'C1033',
      available: 'Available to all',
      img: 'AssignImages/seminar.jpg',
    },
    conferencereserv: {
      name: 'Conference Room',
      description: 'meeting space',
      days: 'Mon, Tue, Wed, Thu, Fri',
      groupSize: '1-10',
      location: 'C1033',
      available: 'Only for SUNY Korea',
      img: 'AssignImages/conference.jpg',
    },
    libraryreserv: {
      name: 'Library',
      description: 'study and read books',
      days: ' Mon, Tue, Wed, Thu, Fri, Sat, Sun',
      groupSize: '1-20',
      location: 'C1033',
      available: 'Only for SUNY Korea',
      img: 'AssignImages/library.jpg',
    }
  };

  //Change page
  function showPage(page){
    setCurrentPage(page);
    const menunav = document.querySelector('.MenuNav');
    if(menunav.style.display=='flex'){
        menunav.style.display = 'none';
    }
  };

  //When click My Page -> show sidebar
  function showSidebar(id,event){
    console.log("showSidebar");
    const sidebar = document.querySelector('.sidebar');
    const Button = document.getElementById(id);

    if (sidebar.style.display == 'flex') { // Sidebar == 'flex' -> hide sidebar
        //console.log(isSidebar);
        sidebar.style.display = 'none';

        document.removeEventListener('click', hideSidebar);
        window.removeEventListener('resize', hideSidebar);
    } else { // Sidebar == 'none' -> show sidebar
        sidebar.style.display = 'flex';
        //console.log(isSidebar);
        // locate sidebar right below the "Mt Page" Btn
        const rect = Button.getBoundingClientRect();

        sidebar.style.top = `${rect.bottom + window.scrollY}px`; // set distance top-context
        sidebar.style.left = `${rect.left}px`; // set distance left-context
        sidebar.style.display = 'flex';
        console.log("show");

        // if resize or click -> hide sidebar
        document.addEventListener('click', hideSidebar);
        window.addEventListener('resize', hideSidebar);
        event.stopPropagation();
    }
  }

  function hideSidebar(event){
      const sidebar = document.querySelector('.sidebar');
      sidebar.style.display = 'none';
      document.removeEventListener('click', hideSidebar);
      window.removeEventListener('resize', hideSidebar);
  }

  function showMenu(event){
    event.preventDefault();
    console.log("show Hamburger Menu");
    const menunav = document.querySelector('.MenuNav');
    menunav.style.display = 'flex';

    const home = document.getElementById('home');
    const F_list = document.getElementById('F_list');
    const F_reserv = document.getElementById('F_reserv');
    const myInfo = document.getElementById('myInfo');
    const myReserv = document.getElementById('myReserv');
    const menuNavHeight = menunav.offsetHeight;

    // shifting down the page content 
    switch (currentPage) {
        case 'home':
            home.style.marginTop = `${menuNavHeight-100}px`;
            break;
        case'F_list':
            F_list.style.marginTop = `${menuNavHeight-60}px`;
            break;
        case 'F_reserv':
            F_reserv.style.marginTop = `${menuNavHeight}px`;
            break;
        case 'myInfo':
            myInfo.style.marginTop = `${menuNavHeight}px`;
            break;
        case 'myReserv':
            myReserv.style.marginTop = `${menuNavHeight}px`;
            break;
        default:
            break;
    }
  }

  return (
    <div className="App">
      <nav >
        <div className="navContainer">
        <ul>
          <li className="HomeIcon"><a href="#" onClick={() => showPage('home')}>Home</a></li>
          <li className="hideOnMobile"><a href="#" onClick={() => showPage('F_list')}>Facility List</a></li>
          <li className="hideOnMobile"><a href="#" onClick={() => showPage('F_reserv')}>Facility Reservation</a></li>
          <li className="hideOnMobile"><a href="#" id="myPageBtn" onClick={(e) => showSidebar('myPageBtn',e)}>My Page</a></li>
          <li className="ProfileIcon"><a href="#"><img src="AssignImages/user.png" alt="Profile Icon"  width="40" height="40" /></a></li>
          <li className="Hamburger"><a href="#" onClick={(e) => showMenu(e)}><img src="AssignImages/Menu.png" alt="Hambuger" width="30" height="30" /></a></li>
        </ul>
        </div>
      </nav>
      <nav>
        <ul className="sidebar">
            <li><a href="#" onClick={() => showPage('myInfo')}>My information</a></li>
            <li><a href="#" onClick={() => showPage('myReserv')}>My Reservation</a></li>
        </ul>
    </nav>
    <nav>
        <ul className="MenuNav">
            <li><a href="#" onClick={() => showPage('F_list')}>Facility List</a></li>
            <li><a href="#" onClick={() => showPage('F_reserv')}>Facility Reservation</a></li>
            <li><a href="#" id="MenumyPageBtn" onClick={(e) => showSidebar('MenumyPageBtn',e)}>My Page</a></li>
        </ul> 
    </nav>

    {/* //home page */}
    {currentPage == 'home' && (
        <div id="home" className="page">
          <ul>
          <h1>Facility Reservation</h1>
          <ul>
          <li style ={{fontSize:'25px'}}><strong>Facility List</strong></li>
          <ol>
            <li> Reservation Date should be the date after today</li>
            <li> The number of users should be between the maximum and minimum number of people</li>
            <li> If the facility is available only for SUNY Korea, user should be in SUNY Korea</li>
            <li> The reservation date must be made on the available day of the week</li>
            <li> The same person cannot book another facility on the same date</li>
          </ol>
            <p>If all conditions are met, data is stored in local storage.</p>

          <li style ={{fontSize:'25px'}}><strong>User Information</strong></li>
          <ol>
            <li> User profile, user email, user password, user name</li>
            <li> All other details can be modified except for the user email</li>
            <li> If the user profile is changed, the image in the navbar will also change</li>
          </ol>

          <li style ={{fontSize:'25px'}}><strong>Reservation History</strong></li>
          <ul>
            <p>Load the reservation data stored in the local storage:</p>
            <p>Reservation ID, facility name, purpose, peopleNum, isSUNY, booker name, date</p>
            <p>Can cancel reservation</p>
          </ul>
        </ul>
        </ul>
        </div>
      )}

      {/* Facility List Page */}
      {currentPage == 'F_list' && (
        <div id="F_list" className="page">
          <ul>
          {Object.values(facilities).map((facility) => (
            <div className="F_type" key={facility.name}>
              <img src={facility.img} alt={facility.name} />
              <div className="F_info">
                <h2>{facility.name}</h2>
                <p>{facility.description}</p>
                <p>📅 {facility.days}</p>
                <p>👥 {facility.groupSize}</p>
                <p>📍 {facility.location}</p>
                <p>⚠️ {facility.available}</p>
              </div>
            </div>
          ))}
          </ul>
        </div>
      )}

      {currentPage == 'F_reserv' && (
        <div id="F_reserv" className="page">
          
        </div>
      )}

      {/* My page -> My information */}
      {currentPage == 'myInfo' && (
        <div id="myInfo" className="page">
          <h1>User Information</h1>
          <div id="profile_Image">
            <img src="AssignImages/user.png" alt="Profile" width="300" height="300" />
          </div>
          <button>Change Image</button>

          <p>Email: abc@stonybrook.edu</p>

          <div id="password">
            <p>Password: *****</p>
          </div>
            <button>Change Password</button>

          <div id="user_Name">
            <p>Name: Nahyun Kim</p>
          </div>
            <button>Change Name</button>
          
        </div>
      )}

      {currentPage =='myReserv' && (
        <div id="myReserv" className="page">
          
        </div>
      )}
    </div>
  );
}

export default App;

