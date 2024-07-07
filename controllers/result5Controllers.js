const geolib = require('geolib');
const assert = require('assert');
const db = require('../config/db'); // Assuming you have a db config file for database connection

// Helper function to convert db.query to return a promise
function queryDB(query, params) {
    return new Promise((resolve, reject) => {
        db.query(query, params, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

// Displays available tables in the database.
function getNSEWlimitingCoord(startPoint, altnMaxDistNM){
    assert(
        startPoint.latitude <= 70 && startPoint.latitude >= -70,
        "Latitude out of range. An implementation for high latitudes is necessary"
    );
    const distNM = altnMaxDistNM * 1.5;

    // nautical miles to meters (1 nm = 1852 meters)
    const distMeters = distNM * 1852;

    // Compute the destination points:
    const northLimit = geolib.computeDestinationPoint(startPoint, distMeters, 0);   // 0 degrees for north
    const southLimit = geolib.computeDestinationPoint(startPoint, distMeters, 180); // 180 degrees for south
    const eastLimit = geolib.computeDestinationPoint(startPoint, distMeters, 90);  // 90 degrees for east
    const westLimit = geolib.computeDestinationPoint(startPoint, distMeters, 270); // 270 degrees for west

    return [northLimit, southLimit, eastLimit, westLimit];
}

function calculateDistNM(startPoint, endPoint) {
    // Calculate distance in meters using geolib
    const distanceMeters = geolib.getDistance(startPoint, endPoint);

    // Convert meters to nautical miles (1 NM = 1852 meters)
    const distanceNM = distanceMeters / 1852;

    return distanceNM;
}

async function templateRenderer(response, htmlQuery, resultCoordinates) {
    if (resultCoordinates.length === 0) {
        return response.send('Destination or alternate airport not found.');
    }

    let destApt = htmlQuery.iataCode;
    let altnMaxDistNM = htmlQuery.maxDist;
    let destCoords = { latitude: resultCoordinates[0].latitude_deg, longitude: resultCoordinates[0].longitude_deg };
    let [northLimit, southLimit, eastLimit, westLimit] = getNSEWlimitingCoord(destCoords, altnMaxDistNM);

    let altnQuery = `SELECT 
        a.ident, 
        a.name as apt_name, 
        a.iso_country AS iso_country,
        a.local_code AS local_code,
        c.name AS country_name,
        r.name AS region_name, 
        co.name AS continent_name, 
        a.municipality, at.apt_type, 
        a.elevation_ft, a.latitude_deg, a.longitude_deg
        FROM airports a 
        JOIN countries c ON a.iso_country = c.code
        JOIN regions r ON a.local_code = r.local_code AND a.iso_country = r.iso_country
        JOIN airporttypes at ON a.type = at.apt_type
        JOIN continents co ON c.continent = co.code
        WHERE scheduled_service=1
        AND (at.apt_type="large_airport" OR at.apt_type="medium_airport")
        AND latitude_deg < ? 
        AND latitude_deg > ? 
        AND longitude_deg > ? 
        AND longitude_deg < ?
    ;`;

    try {
        let resultsAltns = await queryDB(altnQuery, [northLimit.latitude, southLimit.latitude, westLimit.longitude, eastLimit.longitude]);
        let aptWithinRange = [];
        let rwyPromises = [];

        resultsAltns.forEach(apt => {
            let aptCoors = { latitude: apt.latitude_deg, longitude: apt.longitude_deg };
            let distNM = Math.round(calculateDistNM(destCoords, aptCoors));

            if (distNM == 0) {
                destApt = apt;
            } else if (distNM < altnMaxDistNM) {
                apt.distNMToAltn = distNM;
                aptWithinRange.push(apt);
                let rwyQuery = `SELECT * FROM runways r JOIN airports a ON r.airport_ident=a.ident WHERE a.ident = ?`;
                rwyPromises.push(queryDB(rwyQuery, [apt.ident]).then(runways => {
                    apt.runways = runways;
                    return apt;
                }));
            }
        });

        let airportsWithRunways = await Promise.all(rwyPromises);

        airportsWithRunways.sort((a, b) => a.distNMToAltn - b.distNMToAltn);
        response.render('result5', { airports: airportsWithRunways, destination: destApt });
    } catch (error) {
        response.status(500).send('Internal Server Error');
    }
}

exports.get = async (req, res) => {
    let htmlQuery = req.query;
    let destAptIdent = req.query.iataCode;
    let query = "SELECT * FROM airports WHERE ident=?";

    try {
        let resultCoordinates = await queryDB(query, [destAptIdent]);
        await templateRenderer(res, htmlQuery, resultCoordinates);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};
