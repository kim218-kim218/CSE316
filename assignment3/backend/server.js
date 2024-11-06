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

app.use(cors());
app.use(express.json());
require('dotenv').config();

// MySQL 
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE 
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

app.get('/facilities', (req, res) => {
    const selectQuery = "SELECT * FROM facilities";
    db.query(selectQuery, (err, results) => {
        if (err) {
            console.error("데이터 조회 오류:", err);
            res.status(500).send('데이터 조회 중 오류 발생');
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

// app.post('/upload-images', async (req, res) => {
//     const filePaths = req.body.filePaths; // get filePaths

//     if (!Array.isArray(filePaths) || filePaths.length === 0) {
//         return res.status(400).send("No files provided");
//     }

//     try {
//         // For all path -> uploade
//         const uploadPromises = filePaths.map(filePath => 
//             cloudinary.uploader.upload(filePath)
//         );

//         // Wait for iimage uploaded
//         const uploadResults = await Promise.all(uploadPromises);
//         const imageUrls = uploadResults.map(result => result.secure_url);

//         res.json({ imageUrls }); 
//     } catch (error) {
//         console.error("Error uploading images:", error);
//         res.status(500).send("Failed to upload images");
//     }
// });

// const gymImageUrl = 'https://res.cloudinary.com/cloud_name/image/upload/v1234567890/gym.png';
// const auditoriumImageUrl = 'https://res.cloudinary.com/cloud_name/image/upload/v1234567890/auditorium.png';
// const swimmingPoolImageUrl = 'https://res.cloudinary.com/cloud_name/image/upload/v1234567890/swimming_pool.png';
// const seminarRoomImageUrl = 'https://res.cloudinary.com/cloud_name/image/upload/v1234567890/seminar_room.png';
// const conferenceRoomImageUrl = 'https://res.cloudinary.com/cloud_name/image/upload/v1234567890/conference_room.png';
// const libraryImageUrl = 'https://res.cloudinary.com/cloud_name/image/upload/v1234567890/library.png';

// 시설명과 이미지 이름 매핑
const facilityImageMapping = {
    Gym: 'gym',
    Auditorium: 'auditorium',
    'Swimming Pool': 'pool',
    'Seminar Room': 'seminar',
    'Conference Room': 'conference',
    Library: 'library'
};

// 특정 폴더에서 이미지 URL 가져오기
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
            //prefix: 'CSE316_Images/', // 폴더 경로 지정
            max_results: 10
        });
console.log("Result from Cloudinary API:", result);
        // 이미지 이름과 URL 매핑
        const imageUrls = {};
        result.resources.forEach(resource => {
            if (resource.asset_folder === 'CSE316_Images') { // asset_folder 확인
                const fileName = resource.public_id.split('/').pop(); // 파일명만 추출
                console.log("Extracted fileName:", fileName);

                // facilityImageMapping에 있는 파일명과 비교하여 매핑
                Object.keys(facilityImageMapping).forEach(facility => {
                    if (fileName.startsWith(facilityImageMapping[facility])) { // 파일명이 일치하는 경우
                        imageUrls[facility] = resource.secure_url;
                    }
                });
            }
        });
        // result.resources.forEach(resource => {
        //     const fileName = resource.public_id.split('/').pop(); // 파일명만 추출
        //     console.log(fileName);
        //     Object.keys(facilityImageMapping).forEach(facility => {
        //         if (fileName === facilityImageMapping[facility]) {
        //             imageUrls[facility] = resource.secure_url;
        //         }
        //     });
        // });

        console.log("Image URLs by Facility:", imageUrls);
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





app.get('/', (req, res) => {
    res.send('Server is open');
});

app.listen(port, () => {
    console.log(`Server at ${port}.`);
});
