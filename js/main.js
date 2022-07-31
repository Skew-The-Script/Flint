let MAP;
let MAPLOC = { lat: 43.0202, lng: -83.6935 };
let MAPADDRESS = "E SECOND AVE";
let MAPLEAD = 1;
let coordData, leadData, addressData;
let numCoords, numLead, numAddress;

// GET HTML ELEMENTS
let addressLabel = document.getElementById("addressLabel");
let leadLabel = document.getElementById("leadLabel");

// get data

function processAddressRow(row){
    row.ParIDPack = +row.ParIDPack;
    let res = {
        'pid' : row.ParIDPack,
        'address' : row.ADDRESS};
    return res;
}

let addresses = [];

addresses.push(d3.csv("data/flint_address_data.csv", row =>processAddressRow(row)));
Promise.all(addresses)
    .then(function (data){
        console.log(data[0]);
        addressData = data[0];
        numAddress = data[0].length;
    });

function processLeadRow(row){
    row.pid = +row.pid;
    row.dangerous = +row.dangerous;
    let res = {
        'pid' : row.pid,
        'lead' : row.dangerous};
    return res;
}

let lead = [];

lead.push(d3.csv("data/flint_lead_data.csv", row =>processLeadRow(row)));
Promise.all(lead)
    .then(function (data){
        console.log(data[0]);
        leadData = data[0];
        numLead = data[0].length;
    });


function processCoordRow(row){
    row.pid = +row.pid;
    row.Latitude = +row.Latitude;
    row.Longitude = +row.Longitude;
    let res = {
        'pid' : row.pid,
        'lat' : row.Latitude,
        'lon' : row.Longitude};
    return res;
}

let coords = [];

coords.push(d3.csv("data/flint_coord_data.csv", row =>processCoordRow(row)));
Promise.all(coords)
    .then(function (data){
        console.log(data[0]);
        coordData = data[0];
        numCoords = data[0].length;
    });


// load new address
$('.load-map').on('click',function(){
    getNewAddress();
});


function getNewAddress(){
    let leadidx = Math.round(Math.random()*numLead);

    MAPLEAD = leadData[leadidx]['lead'] == 1;
    let pid = leadData[leadidx]['pid'];

    // get address based on pid
    for (let i = 0; i < numAddress; i++){
        if (addressData[i]['pid'] == pid){
            MAPADDRESS = addressData[i]['address'];
        }
    }

    // get lat/lon based on pid
    for (let i = 0; i < numCoords; i++){
        if (coordData[i]['pid'] == pid){
            MAPLOC = { lat: coordData[i]['lat'], lng: coordData[i]['lon'] };
        }
    }

    addressLabel.innerText = "Address: " + MAPADDRESS;
    leadLabel.innerText = MAPLEAD ? "Lead" : "No Lead";

    MAP = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: MAPLOC,
    });
    const marker = new google.maps.Marker({
        position: MAPLOC,
        map: MAP,
    });

}


function initMap() {
    MAP = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: MAPLOC,
    });
    const marker = new google.maps.Marker({
        position: MAPLOC,
        map: MAP,
    });
}

window.initMap = initMap;
