//Nahyun Kim
//nahyun.kim.4@stonybrook.edu

import React, { useState } from 'react';
import { useEffect } from "react";
import './App.css';
import { hashutil } from './hashutil/javascript/Hashutil.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './SignUp.js';

function App() {

  const [currentPage, setCurrentPage] = useState('home');
  const [selectedFacility, setSelectedFacility] = useState('Gym');
  const [formData, setFormData] = useState({
    date: '',
    people: 0,
    affiliation: '',
    purpose: ''
  });

  const [facilities, setFacilities] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
        fetch('http://localhost:3001/facilities') 
            .then(response => response.json())
            .then(data => {setFacilities(data);}) // update facilities
            .catch(error => {console.error("Error in fetching facilities:", error);});

        fetch('http://localhost:3001/reservations')
            .then(response => response.json())
            .then(data => setReservations(data))
            .catch(error => console.error("Error in fetching reservations:", error));

    }, []);

  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isNameModalOpen, setNameModalOpen] = useState(false);

  //Change page
  function showPage(page){
    setCurrentPage(page);
    checkCurrentF();
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

  //current Facility == facility that user want to reserv
  //const currentFacility = facilities[selectedFacility];
  const currentFacility = facilities.find(facility => facility.facility_name === selectedFacility);

  function checkCurrentF(){
    console.log("selectedF =" +  selectedFacility);
    console.log("CurrentFacility = "+currentFacility.facility_name);
  }
  

  function handleInputChange(e){
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  function updateFacilityInfo(e){
    setSelectedFacility(e.target.value);
  };

  
  async function reserveFacility(){
    //let reservStorage = JSON.parse(localStorage.getItem('reservStorage')) || [];
    const facility = document.getElementById('facility').value;
    const facilityData = facilities.find(facility => facility.facility_name === selectedFacility);

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

    const week = [ 'Sat','Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    const dayOfWeek = getDay(selectedDate);
    //console.log("day:"+dayOfWeek);
    if(!facilityData.available_days.includes(week[dayOfWeek])){
      alert('Cannot reserve. The selected date is not available.');
        return false;
    }
    if (peopleNum > facilityData.max_capacity || peopleNum < facilityData.min_capacity) {
        alert('Cannot reserve. The number of people is not correct.');
        return false;
    }
    if (facilityData.only_for_suny && affiliation == 'no') {
        alert('Cannot reserve. This facility is only available for SUNY Korea members.');
        return false;
    }

    // Check if there's already a reservation for the same facility
    const existingReservation = reservations.find(reservation =>reservation.reservation_name === facilityData.facility_name);
    if (existingReservation) {
      console.log(existingReservation);
      alert('Cannot reserve. You already have a reservation for this facility.');
      return false;
    }

    // Check if there's already a reservation for the same date
    const existingDateReservation = reservations.some(reservation => new Date(reservation.reservation_date).toDateString() === selectedDate.toDateString());
    if (existingDateReservation) {
        alert('Cannot reserve. You already have a reservation for another facility on this date.');
        return false;
    }

    const reservForm = {
        reservation_date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD
        user_number: peopleNum,
        is_suny_korea: facilityData.only_for_suny,
        purpose: document.getElementById('purpose').value,
        reservation_name: facilityData.facility_name,
        user_name: 'Nahyun Kim', 
        location: facilityData.location,
    };

    //console.log(facilityData.img,facilityData.name,document.getElementById('purpose').value,selectedDate,peopleNum.toString(),facilityData.location,facilityData.available);
    try {
        const response = await fetch('http://localhost:3001/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservForm)
        });

        if (!response.ok) {
            throw new Error('Failed to add reservation');
        }

        //setReservations([...reservations, reservForm]);
        await fetchReservations();
        //console.log("???:"+reservations); 
    } catch (error) {
        console.error("Error making reservation:", error);
        alert('Failed to make reservation.');
        return false;
    }
    
    //reservStorage.push(reservForm);
    //localStorage.setItem('reservStorage', JSON.stringify(reservStorage));// Save form data in localStorage
    //setReservations(reservStorage);
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
    //console.log(j);
    const k = year % 100;  // last two digits of the year
    //console.log(k);

    // cpompute days
    const d = (q + Math.floor((13 * (m + 1)) / 5) + k + Math.floor(k / 4) + Math.floor(j / 4) + (5*j)) % 7;

    return d; 
  }

  //serach image source from facilities table.
  function searchImage(reservation){
    const f = facilities.find(f=> f.facility_name === reservation.reservation_name);
    return f.image_source;
  }

  //Function for my Reservation page. Run this func->show what facility is reserved and save in localStorage
  function  displayReservations(){
    //let myReservations = JSON.parse(localStorage.getItem('reservStorage')) || [];
    if(reservations.length==0){
      //console.log("empty??");
      return <p  className="no-reservation">No Reservation Yet</p>;
    }
    else{
      return reservations.map((reservation,idx)=>{
        console.log("Reservation ID:", reservation.id); 
        const dateOnly = new Date(reservation.reservation_date).toISOString().split('T')[0]; 
        return (
        <div key={idx} className="reservedFacility">
          <img className="reservedImg" src={searchImage(reservation)} alt={reservation.reservation_name} />
          <div className="reservedInfo">
            <h2>{reservation.reservation_name}</h2>
            <p>📝 {reservation.purpose}</p>
            <p>
              📅 {dateOnly}
            </p>
            <p>
              👥 {reservation.user_name}  + {(reservation.user_number - 1)}
            </p>
            <p>
              📍 {reservation.location}
            </p>
            <p>
              ⚠️ {reservation.only_for_suny ? "Only for SUNY Korea" : "Available to all"}
            </p>
            <button onClick={() => cancelReservation(reservation.id)}>Cancel</button>
          </div>
        </div>
      );
      }
    )}
  }

  // reservations fetching
  async function fetchReservations() {
      try {
          const response = await fetch('http://localhost:3001/reservations');
          if (!response.ok) {
              throw new Error('Failed to fetch reservations');
          }
          const data = await response.json();
          setReservations(data); // reservations 상태 업데이트
          //console.log(reservations); 
      } catch (error) {
          console.error("Error fetching reservations:", error);
      }
  }

  async function cancelReservation(reservationId) {
    console.log(reservationId);
      try {
          const response = await fetch(`http://localhost:3001/reservations/${reservationId}`, {
              method: 'DELETE'
          });

          if (!response.ok) {
              throw new Error('Failed to cancel reservation');
          }

          await fetchReservations();
          console.log(reservations); 

          alert('Reservation cancelled successfully');
      } catch (error) {
          console.error("Error cancelling reservation:", error);
          alert('Failed to cancel reservation.');
      }
  };





  /*
      Sign In 
  */
    const [users, setUsers] = useState([]); // Store user data from `/register`
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); //When login -> set password / Not password in the database table
    const [name, setName] = useState('');
    const [isLogin, setLogin] = useState(false);

    // Fetch user data from `/register`
    useEffect(() => {
        fetch('http://localhost:3001/register') // Fetch all users from backend
            .then(response => {response.json();})
            .then(data => { setUsers(data); })// Store the user data locally
            .catch(error => {console.error("Error fetching user data:", error);});
    }, []);

    async function fetchRegisters() {
      try {
          const response = await fetch('http://localhost:3001/register');
          if (!response.ok) {
              throw new Error('Failed to fetch registers');
          }
          const data = await response.json();
          setUsers(data); 
          return data;
      } catch (error) {
          console.error("Error fetching regiater:", error);
           return []; 
      }
  }

    // Handle Sign-In Form Submission
    const handleSubmit = async (e) => {

      e.preventDefault();
      const fetchedUsers = await fetchRegisters();

      if (!Array.isArray(fetchedUsers)) {
          alert("Cannot load users.");
          return;
      }

      // Check if email exists in the fetchedUsers 
      const user = fetchedUsers.find(user => user.email === email);
        if (!user) {
            alert('Wrong Email');
            return;
        }

        const hashedPassword = hashutil(email, password); // hashing
        // Validate password
        if (user.password !== hashedPassword) {
            alert('Wrong password');
            return;
        }

        // Sign-In Successful
        setLogin(true);
        showPage('home');
        alert("User Registered Successfully!");
    };

    const handleEmail = (e) => {
        setEmail(e.target.value); 
    };

    const handlePassWord = (e) => {
        setPassword(e.target.value); 
    };

    function SignOutBtn(){
      setLogin(false);
      showPage('home');
      alert("User SignOut Successfully!");
    }

  /*
      Modal Condition
  */

      const [message, setMessage] = useState('');
      useEffect(() => {
        console.log("Password has been updated to: " + password);
      }, [password]);


      const changePassword=async(e) =>{
        e.preventDefault();

        console.log("change password");

        const oldPassword = document.getElementById('oldPassword').value;
        //console.log("old : "+oldPassword);
        const newPassword = document.getElementById('newPassword').value;
        //console.log("new : "+newPassword);

        //setPassword(email,oldPassword,newPassword);
        //console.log(passwordData);

        const oldHashPassword = hashutil(email, oldPassword);
        const newHashPassword = hashutil(email, newPassword);
        console.log(oldHashPassword);
        console.log(password);
        // Check if the old password is correct
        if (oldHashPassword !== hashutil(email, password)) {
          alert("Old password is incorrect!");
          return;
        }

        try {
            const response = await fetch('http://localhost:3001/change-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: email,
                  oldPassword: oldHashPassword,
                  newPassword: newHashPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to change password');
            }

            setMessage('Password changed successfully!');
        } catch (error) {
            setMessage(error.message);
        }

      fetchRegisters();
      setPassword(newPassword);
      setPasswordModalOpen(false);
      // Update the password
      alert("Password updated successfully!");
      
    }


//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------

  return (
    <div className="App">
      <nav >
        <div className="navContainer">
        <ul>
          <li className="HomeIcon"><a href="#" onClick={() => showPage('home')}>Home</a></li>
          <li className="hideOnMobile"><a href="#" onClick={() => isLogin ?  showPage('F_list'):showPage('SignIn')}>Facility List</a></li>
          <li className="hideOnMobile"><a href="#" onClick={() => isLogin ? showPage('F_reserv'):showPage('SignIn')}>Facility Reservation</a></li>
          <li className="hideOnMobile"><a href="#" id="myPageBtn" onClick={(e) => isLogin ?showSidebar('myPageBtn',e):showPage('SignIn')}>User 🔽</a></li>
          <li className="hideOnMobile"><a href="#" id="SignIn" onClick={() => isLogin ? showPage('SignOut'):showPage('SignIn')}>{isLogin?"Sign Out":"Sign In"}</a></li>
          <li className="ProfileIcon"><a href="#"><img src="http://res.cloudinary.com/dkeneeift/image/upload/v1730882083/user_gyjnlf.png" alt="Profile Icon"  width="40" height="40" /></a></li>
          <li className="Hamburger"><a href="#" onClick={(e) => showMenu(e)}><img src="http://res.cloudinary.com/dkeneeift/image/upload/v1730918352/Menu_ijcvu7.png" alt="Hambuger" width="30" height="30" /></a></li>
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
              
                {facilities.map(facility => (
                  <div className="F_type" key={facility.facility_name}>
                  <img src={facility.image_source} alt={facility.facility_name} />
                    <div className="F_info">
                      <h2>{facility.name}</h2>
                      <p>{facility.facility_description}</p>
                      <p>📅 {facility.available_days}</p>
                      <p>👥 {facility.min_capacity} - {facility.max_capacity}</p>
                      <p>📍 {facility.location}</p>
                      <p>⚠️ {facility.only_for_suny ? "Only for SUNY Korea" : "Available to all"}</p>
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
              {facilities.map(facility => (
                <option key={facility.id} value={facility.facility_name}>
                  {facility.facility_name}
                </option> 
              ))}
            </select>

            <div id="selectedF">
              <img id="selectedF_img" src={currentFacility.image_source} alt="Facility" />
              <div id="selectedFinfo">
                <h2>{currentFacility.facility_name}</h2>
                <p>{currentFacility.facility_description}</p>
                <p>📅 {currentFacility.available_days}</p>
                <p>👥 {currentFacility.min_capacity+'-'+currentFacility.max_capacity}</p>
                <p>📍 {currentFacility.location}</p>
                <p>⚠️ {currentFacility.only_for_suny ? "Only for SUNY Korea" : "Available to all"}</p>
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
            <img src="http://res.cloudinary.com/dkeneeift/image/upload/v1730882083/user_gyjnlf.png" alt="Profile" width="200" height="200" />
          </div>
          <button onClick={() => setImageModalOpen(true)}>Change Image</button>

          <p>Email: {email}</p>

          <div id="password">
            <p>Password: *****</p>
          </div>
            <button onClick={() => setPasswordModalOpen(true)}>Change Password</button>

          <div id="user_Name">
            <p>Name: {name}</p>
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
            <p>Original password</p>
            <input type="password" id="oldPassword" />
            <hr />
            <p>New Password</p>
            <input type="password" id="newPassword" />
            <hr />
            <button id="closeBtn"  onClick={() => setPasswordModalOpen(false)}>Close</button>
            <button id="PasswordSaveBtn" onClick={changePassword}>Save changes</button>
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

      {currentPage =='SignIn' && (
        <div id="SignIn">
            <div className="sign-container">
                <h2>Sign In</h2>
                <form className="sign-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">E-mail</label>
                    <input type="email" id="email" onChange={handleEmail} value={email}/>

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" onChange={handlePassWord} value={password}/>

                    <div className="button-group">
                    <button type="submit">Sign in</button>
                    <button type="button" onClick={() => showPage('SignUp')}>Sign up</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {currentPage =='SignUp' && (
        <div id="SignUp">
          <Router>
            <Routes>
                {/* <Route path="/" element={<h2>Home Page</h2>} /> */}
                <Route path="/" element={<SignUp showPage={showPage} />} />
            </Routes>
        </Router>
        </div>
      )}

      {currentPage == 'SignOut' && (
        <div id="SignOut">
          <div className="sign-container">
            <h1>Sign Out</h1>
            <button type='button' onClick={() => SignOutBtn()}>Sign Out</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;

