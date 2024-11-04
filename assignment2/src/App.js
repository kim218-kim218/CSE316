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

  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isNameModalOpen, setNameModalOpen] = useState(false);

    const facilities = {
    gymreserv: {
      name: 'Gym',
      description: 'sports hall',
      days: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun',
      daysArray: [0,1,2,3,4,5,6],
      groupSize: [1,5],
      location: 'C1033',
      available: 'Available to all',
      img: 'AssignImages/gym.jpg',
      lock: false
    },
    auditoriumreserv: {
      name: 'Auditorium',
      description: 'The Auditorium Theater',
      days :        ' Mon, Tue, Wed, Thu ',
      daysArray:[2,3,4,5],
      groupSize: [10,30],
      location: 'A234',
      available: 'Available to all',
      img: 'AssignImages/auditorium.jpg',
      lock: false
    },
    poolreserv: {
      name: 'Swimming Pool',
      description: 'aquatic center',
      days: 'Sun, Sat',
      daysArray:[0,1],
      groupSize: [1,8],
      location: 'C1033',
      available: 'Available to all',
      img: 'AssignImages/pool.jpg',
      lock: false
    },
    seminarreserv: {
      name: 'Seminar Room',
      description: 'lecture hall',
      days: 'Mon, Wed, Fri',
      daysArray:[2,4,6],
      groupSize: [10,30],
      location: 'C1033',
      available: 'Available to all',
      img: 'AssignImages/seminar.jpg',
      lock: false
    },
    conferencereserv: {
      name: 'Conference Room',
      description: 'meeting space',
      days: 'Mon, Tue, Wed, Thu, Fri',
      daysArray: [2,3,4,5,6],
      groupSize: [1,10],
      location: 'C1033',
      available: 'Only for SUNY Korea',
      img: 'AssignImages/conference.jpg',
      lock: true
    },
    libraryreserv: {
      name: 'Library',
      description: 'study and read books',
      days: ' Mon, Tue, Wed, Thu, Fri, Sat, Sun',
      daysArray: [0,1,2,3,4,5,6],
      groupSize: [1,20],
      location: 'C1033',
      available: 'Only for SUNY Korea',
      img: 'AssignImages/library.jpg',
      lock: true
    }
  };

  //Change page
  function showPage(page){
    setCurrentPage(page);
    const menunav = document.querySelector('.MenuNav');
    if(menunav.style.display=='flex'){
        menunav.style.display = 'none';
    }
    displayReservations();
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

  const currentFacility = facilities[selectedFacility];

  function handleInputChange(e){
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  function updateFacilityInfo(e){
    setSelectedFacility(e.target.value);
  };

  const [reservations, setReservations] = useState([]);
  
  function reserveFacility(){
    let reservStorage = JSON.parse(localStorage.getItem('reservStorage')) || [];
    const facility = document.getElementById('facility').value;
    const facilityData = facilities[facility];

    const selectedDate = new Date(document.getElementById('date').value);
    const today = new Date();
    const peopleNum = parseInt(document.getElementById('people').value);
    const affiliationInput = document.querySelector('input[name="affiliation"]:checked');
    
    if(affiliationInput==null){
      alert('Cannot reserve. Please fill the all blank');
      return false
    }
    const affiliation=affiliationInput.value;
    //console.log(affiliation);

    if (selectedDate < today.setHours(0, 0, 0, 0)) {
        alert('Cannot reserve. The selected date is in the past.');
        return false;
    }
    const dayOfWeek = getDay(selectedDate);
    //console.log("day:"+dayOfWeek);
    if(!facilityData.daysArray.includes(dayOfWeek)){
      alert('Cannot reserve. The selected date is not available.');
        return false;
    }
    if (peopleNum > facilityData.groupSize[1] || peopleNum < facilityData.groupSize[0]) {
        alert('Cannot reserve. The number of people is not correct.');
        return false;
    }
    if (facilityData.lock && affiliation == 'no') {
        alert('Cannot reserve. This facility is only available for SUNY Korea members.');
        return false;
    }

    // Check if there's already a reservation for the same facility
    const existingReservation = reservStorage.find(reservation => reservation.facilityName === facilityData.name);
    if (existingReservation) {
        alert('Cannot reserve. You already have a reservation for this facility.');
        return false;
    }

        // Check if there's already a reservation for the same date
    const existingDateReservation = reservStorage.find(
        reservation => new Date(reservation.reservationDate).toDateString() === selectedDate.toDateString()
    );
    if (existingDateReservation) {
        alert('Cannot reserve. You already have a reservation for another facility on this date.');
        return false;
    }

    //Form for localStorage
    const reservForm = {
        img: facilityData.img,
        facilityName: facilityData.name,
        comment: document.getElementById('purpose').value,
        reservationDate: selectedDate,
        peopleCount: peopleNum.toString(),
        roomNumber: facilityData.location,
        affiliation: facilityData.available
    };

    //console.log(facilityData.img,facilityData.name,document.getElementById('purpose').value,selectedDate,peopleNum.toString(),facilityData.location,facilityData.available);

    reservStorage.push(reservForm);
    localStorage.setItem('reservStorage', JSON.stringify(reservStorage));// Save form data in localStorage
    setReservations(reservStorage);
    alert('Reservation successful!');
    displayReservations();

    return true;
  };

  function getDay(date) {
    const q = date.getDate();           // the day (1~31)
    let m = date.getMonth() + 1;        // the month (1~12)
    //console.log(m+"월"+q+"일");
    let year = date.getFullYear();      // the year (YYYY)
    
    if (m == 1 || m == 2) {
      m += 12;
      year -= 1;
    }

    const j = Math.floor(year / 100);  // first two digits of the year
    console.log(j);
    const k = year % 100;  // last two digits of the year
    console.log(k);

    // cpompute days
    const d = (q + Math.floor((13 * (m + 1)) / 5) + k + Math.floor(k / 4) + Math.floor(j / 4) + (5*j)) % 7;

    return d; 
  }

  //Function for my Reservation page. Run this func->show what facility is reserved and save in localStorage
  function  displayReservations(){
    let myReservations = JSON.parse(localStorage.getItem('reservStorage')) || [];
    if(myReservations.length==0){
      //console.log("empty??");
      return <p  className="no-reservation">No Reservation Yet</p>;
    }
    else{
      return myReservations.map((reservation,idx)=>{
        const dateOnly = new Date(reservation.reservationDate).toISOString().split('T')[0]; 
        return (
        <div key={idx} className="reservedFacility">
          <img className="reservedImg" src={reservation.img} alt={reservation.facilityName} />
          <div className="reservedInfo">
            <h2>{reservation.facilityName}</h2>
            <p>📝 {reservation.comment}</p>
            <p>
              📅 {dateOnly}
            </p>
            <p>
              👥 John Doe + {(reservation.peopleCount - 1)}
            </p>
            <p>
              📍 {reservation.roomNumber}
            </p>
            <p>
              ⚠️ {reservation.affiliation}
            </p>
            <button onClick={() => cancelReservation(idx)}>Cancel</button> {/* 취소 버튼 추가 */}
          </div>
        </div>
      );
      }
    )}
  }

  const cancelReservation = (index) => {
    // bring recent reservations from localStorage
    let myReservations = JSON.parse(localStorage.getItem('reservStorage')) || [];

    // remove reservation which placed in 'index'
    myReservations.splice(index, 1);

    // update localStorage 
    localStorage.setItem('reservStorage', JSON.stringify(myReservations));

    // set changed updated reservation on the list of reservation
    setReservations(myReservations);
};

  return (
    <div className="App">
      <nav >
        <div className="navContainer">
        <ul>
          <li className="HomeIcon"><a href="#" onClick={() => showPage('home')}>Home</a></li>
          <li className="hideOnMobile"><a href="#" onClick={() => showPage('F_list')}>Facility List</a></li>
          <li className="hideOnMobile"><a href="#" onClick={() => showPage('F_reserv')}>Facility Reservation</a></li>
          <li className="hideOnMobile"><a href="#" id="myPageBtn" onClick={(e) => showSidebar('myPageBtn',e)}>User 🔽</a></li>
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
            <li style ={{fontSize:'25px'}}><strong>Facility Reservation</strong></li>
              <ul className="homeUL">
              <li>Facility List</li>
              <ol>
                <li> Reservation Date should be the date after today</li>
                <li> The number of users should be between the maximum and minimum number of people</li>
                <li> If the facility is available only for SUNY Korea, user should be in SUNY Korea</li>
                <li> The reservation date must be made on the available day of the week</li>
                <li> The same person cannot book another facility on the same date</li>
              </ol>
                <p>If all conditions are met, data is stored in local storage.</p>

              <li>User Information</li>
              <ol>
                <li> User profile, user email, user password, user name</li>
                <li> All other details can be modified except for the user email</li>
                <li> If the user profile is changed, the image in the navbar will also change</li>
              </ol>

              <li>Reservation History</li>
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

      {/* Facility Reservation Page */}
      {currentPage == 'F_reserv' && (
        <div id="F_reserv" className="page">
          <form id="reservForm">
            <label htmlFor="facility">Select Facility:</label>
            <select id="facility" value={selectedFacility} onChange={updateFacilityInfo}>
              {Object.keys(facilities).map((facility) => (
                <option key={facility} value={facility}>
                  {facilities[facility].name}
                </option>
              ))}
            </select>

            <div id="selectedF">
              <img id="selectedF_img" src={currentFacility.img} alt="Facility" />
              <div id="selectedFinfo">
                <h2>{currentFacility.name}</h2>
                <p>{currentFacility.description}</p>
                <p>📅 {currentFacility.days}</p>
                <p>👥 {currentFacility.groupSize[0]+'-'+currentFacility.groupSize[1]}</p>
                <p>📍 {currentFacility.location}</p>
                <p>⚠️ {currentFacility.available}</p>
              </div>
            </div>

              <label htmlFor="date">Date to be Used:</label>
            <div className="checklist">
              <input type="date" id="date" value={formData.date} onChange={handleInputChange} />
            </div>

            
              <label htmlFor="people">Number of People:</label>
            <div className="checklist">
              <input type="number" id="people" value={formData.people} onChange={handleInputChange} />
            </div>

            
              <label>Are you affiliated with SUNY Korea?</label>
            <div className="checklist">
              <input type="radio" id="affiliated" name="affiliation" value="yes" onChange={handleInputChange} />
              <label htmlFor="yes">SUNY Korea</label>
              <input type="radio" id="affiliated" name="affiliation" value="no" onChange={handleInputChange} />
              <label htmlFor="no">NON-SUNY Korea</label>
            </div>

              <label htmlFor="purpose">Purpose of Use:</label>
            <div className="checklist">
              <textarea id="purpose" value={formData.purpose} onChange={handleInputChange}></textarea>
            </div>

            <button type="button" onClick={reserveFacility}>Reserve</button>
          </form>
        </div>
      )}

      {/* My page -> My information */}
      {currentPage == 'myInfo' && (
        <div id="myInfo" className="page">
          <h1>User Information</h1>
          <div id="profile_Image">
            <img src="AssignImages/user.png" alt="Profile" width="200" height="200" />
          </div>
          <button onClick={() => setImageModalOpen(true)}>Change Image</button>

          <p>Email: abc@stonybrook.edu</p>

          <div id="password">
            <p>Password: *****</p>
          </div>
            <button onClick={() => setPasswordModalOpen(true)}>Change Password</button>

          <div id="user_Name">
            <p>Name: Nahyun Kim</p>
          </div>
            <button onClick={() => setNameModalOpen(true)}>Change Name</button>
        </div>
      )}

      {/* Chang Image Modal */}
      {isImageModalOpen && (
        <div id="imageModal" className="modal" style={{ display: 'flex' }}>
          <div className="modal_body">
            <h2>Change your image</h2>
            <hr />
            <p>New Image</p>
            <input type="file" id="upload-image" accept="image/*" />
            <hr />
            <button id="closeBtn"  onClick={() => setImageModalOpen(false)}>Close</button>
            <button id="ImageSaveBtn">Save changes</button>
          </div>
        </div>
      )}

      {/* Chang password Modal */}
      {isPasswordModalOpen && (
        <div id="passwordModal" className="modal" style={{ display: 'flex' }}>
          <div className="modal_body">
            <h2>Change your password</h2>
            <hr />
            <p>New Password</p>
            <input type="password" id="password" value="******" />
            <hr />
            <button id="closeBtn"  onClick={() => setPasswordModalOpen(false)}>Close</button>
            <button id="PasswordSaveBtn">Save changes</button>
          </div>
        </div>
      )}

      {/* Chang Name Modal */}
      {isNameModalOpen && (
        <div id="nameModal" className="modal" style={{ display: 'flex' }}>
          <div className="modal_body">
            <h2>Change your name</h2>
            <hr />
            <p>New Name</p>
            <input type="name" id="name" value="" />
            <hr />
            <button id="closeBtn" onClick={() => setNameModalOpen(false)}>Close</button>
            <button id="NameSaveBtn">Save changes</button>
          </div>
        </div>
      )}

      {currentPage =='myReserv' && (
        <div id="myReserv" className="page myReserv">
          {displayReservations()}
        </div>
      )}
    </div>
  );
}

export default App;

