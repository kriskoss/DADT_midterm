// controllers/result4Controllers.js

const geolib = require('geolib');
const assert = require('assert');

// Displays available tables in the database.

function getNSEWlimitingCoord(startPoint, altnMaxDistNM){
    assert(
        startPoint.latitude <= 70 && startPoint.latitude >= -70,
        "Latitude out of range. An implementation for high latitudes is necessary"
        );
    const distNM = altnMaxDistNM*1.5;

    // nautical miles to meters (1 nm = 1852 meters)
    const distMeters = distNM * 1852;

    // Compute the destination points:
    const northLimit = geolib.computeDestinationPoint(startPoint, distMeters, 0);   // 0 degrees for north
    const southLimit = geolib.computeDestinationPoint(startPoint, distMeters, 180); // 180 degrees for south
    const eastLimit = geolib.computeDestinationPoint(startPoint, distMeters, 90);  // 90 degrees for east
    const westLimit = geolib.computeDestinationPoint(startPoint, distMeters, 270); // 270 degrees for west

    return [northLimit, southLimit, eastLimit, westLimit];
};

function calculateDistNM(startPoint, endPoint) {
    // Calculate distance in meters using geolib
    const distanceMeters = geolib.getDistance(startPoint, endPoint);

    // Convert meters to nautical miles (1 NM = 1852 meters)
    const distanceNM = distanceMeters / 1852;

    return distanceNM;
}


// Define the starting point

function templateRenderer(response, altnMaxDistNM){
	// Return a renderer function with the res object built in
return function(error, resultCoordinates, fields){
		if(error){
			throw error;
		}
        if (resultCoordinates.length == 0) {
            return response.send('Destination airport not found.');
        }        


        let destCoords = {latitude: resultCoordinates[0].latitude_deg, longitude: resultCoordinates[0].longitude_deg};
        
        let [northLimit, southLimit, eastLimit, westLimit] = getNSEWlimitingCoord(destCoords, altnMaxDistNM);

        let altnQuery = "SELECT * FROM airports WHERE scheduled_service=1 AND latitude_deg< ? AND latitude_deg > ? AND longitude_deg > ? AND longitude_deg< ? ";
        db.query(altnQuery, [northLimit.latitude, southLimit.latitude, westLimit.longitude, eastLimit.longitude], function(err, resultsAltns) {
            if (err) {
                throw err;
            }
            
            aptWithinRange = [];
            for (let i=resultsAltns.length-1; i>=0; i--){
                let apt = resultsAltns[i]
                // let aptIden = apt.ident;
                let aptCoors = { latitude: apt.latitude_deg, longitude: apt.longitude_deg};

                let distNM = Math.round(calculateDistNM(destCoords, aptCoors));
                if (distNM<altnMaxDistNM && distNM > 0){
                    apt.distNMToAltn = distNM;
                    aptWithinRange.push(apt);
                }
               if (i==0){
                  response.send(aptWithinRange);
               }; 
            };            
        });
    // response.render('result4', { data: results} );
    
	}
}

exports.get= (req, res) => { 
    let fromFormAptIdent=req.query.iataCode;
    let maxAltrDistNM = req.query.maxDist;
    let query = "SELECT * FROM airports WHERE ident=?";
    db.query(query, fromFormAptIdent, templateRenderer(res, maxAltrDistNM));

};