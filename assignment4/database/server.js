/** 
  name: Nahyun Kim
  email: nahyun.kim.4@stonybrook.edu
**/

// server.js
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3001;
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const fileUpload = require('express-fileupload');


app.use(cors());
app.use(express.json());
require('dotenv').config();
app.use(fileUpload({
    useTempFiles: true, // Enable Temp File Path
    tempFileDir: '/tmp/', // Set up a temporary file storage directory
}));



// MySQL 
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  //database: process.env.MYSQL_DATABASE 
});

// When connected
db.connect(err => {
    if (err) {
        console.error('MySQL is NOT CONNECTED:', err);
        return;
    }
    console.log('MySQL is CONNCECTED.');

    // create facilities table query
    const createFacilitiesTable = `
    CREATE TABLE IF NOT EXISTS facilities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        facility_name VARCHAR(255) NOT NULL,
        facility_description TEXT,
        image_source VARCHAR(255),
        available_days VARCHAR(255),
        min_capacity INT,
        max_capacity INT,
        location VARCHAR(50),
        only_for_suny BOOLEAN DEFAULT FALSE
    );
    `;

    const createReservationTable = `
    CREATE TABLE IF NOT EXISTS reservations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        reservation_date DATE NOT NULL,
        user_number INT NOT NULL,
        is_suny_korea BOOLEAN NOT NULL,
        purpose TEXT,
        reservation_name VARCHAR(255),
        user_name VARCHAR(255),
        location VARCHAR(50),
        email VARCHAR(255) NOT NULL
    );
    `;

    const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,    
        password varchar(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL
    );
    `;

    //create database
    db.query('CREATE DATABASE IF NOT EXISTS facility_reservation', (err) => {
        
        if (err) {
            console.error('Error creating database:', err);
            return;
        }
        console.log('Database created or already exists.');

        db.query('USE facility_reservation', err => {
            if (err) {
                console.error('Error switching to database:', err);
                return;
            }
            console.log('Use facility_reservation database.');


        db.query(createUsersTable, (err,result) => {
            if (err) {
                console.error("users table err:", err);
                return;
            }
            console.log("users table is created.");
        })

        db.query(createReservationTable, (err,result) => {
            if (err) {
                console.error("reserv table err:", err);
                return;
            }
            console.log("reserv table is created.");
        });


        db.query(createFacilitiesTable, (err, result) => {
            if (err) {
                console.error("facilities table err:", err);
                return;
            }
            console.log("facilities is created.");
            
            db.query("SELECT COUNT(*) AS count FROM facilities", (err, result) => {
                if (err) {
                    console.error("Error checking facilities table:", err);
                    return;
                }
                
                const count = result[0].count;
                if (count === 0) {
                    // Insert only table is empty
                        if (err) {
                            console.error("Error inserting default data into facilities table:", err);
                            return;
                        }
                        console.log("Default facilities data with images inserted successfully.");
                        insertFacilitiesData();
                } else {
                    console.log("Facilities data already exists. Skipping insertion.");
                }
            });
        });
        });
    });
});

app.get('/facilities', (req, res) => {
    const selectQuery = "SELECT * FROM facilities";
    db.query(selectQuery, (err, results) => {
        if (err) {
            console.error("Error in getting facilities:", err);
            res.status(500).send('Error in getting facilities...');
            return;
        }
        res.json(results); 
    });
});


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Mapping facility and URL
const facilityImageMapping = {
    Gym: 'gym',
    Auditorium: 'auditorium',
    'Swimming Pool': 'pool',
    'Seminar Room': 'seminar',
    'Conference Room': 'conference',
    Library: 'library'
};

// Bring URL in Cloudinary
const fetchImagesFromFolder = async () => {
    console.log("Cloudinary Config:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            resource_type: 'image',
            //prefix: 'CSE316_Images/', 
            max_results: 10
        });
        const imageUrls = {};
        result.resources.forEach(resource => {
            if (resource.asset_folder === 'CSE316_Images') { // asset_folder
                const fileName = resource.public_id.split('/').pop(); // Only filename

                // facilityImageMapping
                Object.keys(facilityImageMapping).forEach(facility => {
                    if (fileName.startsWith(facilityImageMapping[facility])) { // if file name is same -> mapping
                        imageUrls[facility] = resource.secure_url;
                    }
                });
            }
        });

        return imageUrls; // 각 시설에 매핑된 이미지 URL 객체 반환
    } catch (error) {
        console.error("Error fetching images from Cloudinary:", error);
    }
};


//fetchImagesFromFolder();

const insertFacilitiesData = async () => {
    const imageUrls = await fetchImagesFromFolder(); // 각 시설명에 대한 이미지 URL 매핑 객체

    const query = `
        INSERT INTO facilities (facility_name, facility_description, image_source, available_days, min_capacity, max_capacity, location, only_for_suny)
        VALUES 
        ('Gym', 'A place used for physical activity', '${imageUrls.Gym}', 'Mon, Tue, Wed, Thu, Fri, Sat, Sun', 1, 5, 'A101', FALSE),
        ('Auditorium', 'A place for large events', '${imageUrls.Auditorium}', 'Mon, Tue, Wed, Thu', 10, 40, 'A234', FALSE),
        ('Swimming Pool', 'A place for physical activity', '${imageUrls['Swimming Pool']}', 'Sun, Sat', 1, 8, 'B403', FALSE),
        ('Seminar Room', 'A place for large meetings', '${imageUrls['Seminar Room']}', 'Mon, Wed, Fri', 10, 30, 'B253', FALSE),
        ('Conference Room', 'A place for small but important meetings', '${imageUrls['Conference Room']}', 'Mon, Tue, Wed, Thu, Fri', 1, 10, 'C1033', TRUE),
        ('Library', 'A quiet place', '${imageUrls.Library}', 'Mon, Tue, Wed, Thu, Fri, Sat, Sun', 1, 20, 'A1011', TRUE)
        ON DUPLICATE KEY UPDATE facility_name = facility_name;
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error("Error inserting facilities data:", err);
            return;
        }
        console.log("Facilities data inserted successfully with images.");
    });
};

// add reservation.
app.post('/reservations', (req, res) => {
    const { reservation_date, user_number, is_suny_korea, purpose, reservation_name, user_name, location, email } = req.body;

    const insertQuery = `
        INSERT INTO reservations (reservation_date, user_number, is_suny_korea, purpose, reservation_name, user_name, location, email)
        VALUES (?, ?, ?, ?, ?, ?, ?,?)
    `;

     db.query(insertQuery, [reservation_date, user_number, is_suny_korea, purpose, reservation_name, user_name, location, email], (err, result) => {
        if (err) {
            console.error("Error adding reservation:", err);
            res.status(500).send("Failed to add reservation");
            return;
        }
        res.send("Reservation added successfully");
    });
});


app.get('/reservations', (req, res) => {
    const selectQuery = "SELECT * FROM reservations";
    db.query(selectQuery, (err, results) => {
        if (err) {
            console.error("Error in getting reservations:", err);
            res.status(500).send('Error in getting reservations...');
            return;
        }
        res.json(results); 
    });
});

// delete reservation with specific id
app.delete('/reservations/:id', (req, res) => {
    const reservationId = req.params.id;

    const deleteQuery = 'DELETE FROM reservations WHERE id = ?';
    db.query(deleteQuery, [reservationId], (err, result) => {
        if (err) {
            console.error("Error in removing reservation:", err);
            res.status(500).send("Error in removing...");
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).send("Cannot find the reservation.");
        } else {
            res.send("Successfully removed.");
        }
    });
});


app.post('/register', (req, res) => {
    const { email, username, password, image } = req.body;
    if (!email || !password || !username || !image) {
        console.error('Missing required fields:', { email, password, username, image });
        return res.status(400).json({ message: 'Missing required fields' });
    }
    else{
        console.log("not missing");
    }    

    // Check if email already exists
    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkQuery, [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Insert new user
        const insertQuery = 'INSERT INTO users (email, password, username, image) VALUES (?, ?, ?, ?)';
        db.query(insertQuery, [email, password, username, image], (err, results) => {
            
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).json({ message: 'Failed to create user...' });
            }

            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

app.get('/register', (req, res) => {
    const selectQuery = "SELECT * FROM users";
    db.query(selectQuery, (err, results) => {
        if (err) {
            console.error("Error in getting register:", err);
            res.status(500).send('Error in getting register...');
            return;
        }
        res.json(results); 
    });
});

app.put('/change-password', (req, res) => {
    const { email, oldPassword, newPassword } = req.body;
    if (!email || !oldPassword || !newPassword) {
        return res.status(400).send('All fields are required' );
    }

    // Check if the email exists 
    const selectQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(selectQuery, [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error' );
        }
        if (results.length === 0) {
            return res.status(404).send('Email not found' );
        }

        // Update the password
        const updateQuery = 'UPDATE users SET password = ? WHERE email = ?';
        db.query(updateQuery, [newPassword, email], (err, result) => {
            if (err) {
                console.error('Error updating password:', err);
                return res.status(500).send('Failed to update password' );
            }

            res.status(200).send('Password updated successfully' );
        });
    });
});

app.put('/change-name', (req, res) => {
    const { email, username } = req.body;
    if (!email || !username) {
        console.log(email,username);
        return res.status(400).send('All fields are required' );
    }

    // Check if the email exists
    const selectQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(selectQuery, [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error' );
        }
        if (results.length === 0) {
            return res.status(404).send('Email not found' );
        }

        // Update the Name
        const updateQuery = 'UPDATE users SET username = ? WHERE email = ?';
        db.query(updateQuery, [username, email], (err, result) => {
            if (err) {
                console.error('Error updating name:', err);
                return res.status(500).send('Failed to update name' );
            }

            res.status(200).send('Name updated successfully' );
        });
    });
});

app.post('/upload-profile-image', async (req, res) => {
    try {
        const file = req.files.image; 
        console.log('req.files:', req.files);

        if (!file) {
            return res.status(400).send('File dose not uploaded'); 
        }

        // UPload file into Cloudinary
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'CSE316_Images', 
            use_filename: true,
            unique_filename: false,
        });

        res.status(200).json({ imageUrl: result.secure_url }); // Return uploaded image URL
    } catch (error) {
        console.error('Cloudinary Upload Err:', error);
        res.status(500).send('Fail to upload image in cloudinary'); 
    }
});

//Update the image source in the user's batabase table
app.put('/update-Image', (req, res) => {
    const { email, image } = req.body;
    if (!email || !image) {
        return res.status(400).send('All fields are required' );
    }

    // Check if the email exists
    const selectQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(selectQuery, [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error' );
        }
        if (results.length === 0) {
            return res.status(404).send('Email not found' );
        }

        // Update the Image
        const updateQuery = 'UPDATE users SET image = ? WHERE email = ?';
        db.query(updateQuery, [image, email], (err, result) => {
            if (err) {
                console.error('Error updating image:', err);
                return res.status(500).send('Failed to update image' );
            }

            res.status(200).send('Image updated successfully' );
        });
    });
});


app.get('/', (req, res) => {
    res.send('Server is open');
});

app.listen(port, () => {
    console.log(`Server at ${port}.`);
});
