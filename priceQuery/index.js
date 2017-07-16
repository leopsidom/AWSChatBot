function elicitModel(sessionAttributes, make) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'ElicitSlot',
            intentName: "PriceConsulting",
            slots: {
                ymm: null,
               make: make,
               model: null,
            },
            slotToElicit: "model",
        },
    };
}

function elicitMake(sessionAttributes) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'ElicitSlot',
            intentName: "PriceConsulting",
            slots: {
                ymm: null,
               make: null,
               model: null,
            },
            slotToElicit: "make",
        },
    };
}

function queryDataBase( callback, sessionAttributes, make, model ) {
  const pgp = require('pg-promise')();
  const cn = {
    host: process.env.host,
    port: process.env.port,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password
  };
  const db = pgp(cn);
  make = make.toLowerCase();
  model = model.toLowerCase();
  var result = {};
  db.query(`select msrp from msrp_mm where lower(make)='${make}' and lower(model)='${model}';`).then(
      data => {
          console.log("returned data is: ", data);
          if(data.length === 0) {
              callback(
                  {
                      sessionAttributes,
                      dialogAction: {
                          type: "Close",
                          fulfillmentState: "Fulfilled",
                          message: {
                              contentType: "PlainText",
                              content: "Sorry, I don't know the price of the make and model you provided, yet!"
                          }
                      },
                  })
          } else {
              var msrp = data[0]['msrp'];
              var response = {
                  sessionAttributes,
                  dialogAction: {
                      type: "Close",
                      fulfillmentState: "Fulfilled",
                      message: {
                          contentType: "PlainText",
                          content: "The offical price from the original manufacturer is: " + msrp
                      }
                  },
              };
              console.log(response);
              callback(response);
          }
          pgp.end();
      }
  );
}

function stringMax(arr) {
  return arr.reduce(function (p, v) {
    return ( p.length < v.length ? v : p );
  }, '');
}

function dispatch(intentRequest, callback) {
    
    console.log(`request received for userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
    const sessionAttributes = intentRequest.sessionAttributes;
    const slots = intentRequest.currentIntent.slots;
    const ymm = slots.ymm;
    
    var makes = ['acura','gmc','nissan','honda','toyota','ford','chevy'];
    
    var inferMake = makes.filter(make => ymm.toLowerCase().indexOf(make) !== -1)
    inferMake = (inferMake.length === 0)?null:inferMake[0];
    const make = inferMake || slots.make;
    
    var models = ['CAMARO CONVERTIBLE','Corvette Stingray','Pathfinder','Sierra 3500 Denali HD','Frontier','Fiesta','NV200 Compact Cargo','Focus Electric','Civic Sedan','Corvette Z06 Convertible','Tahoe','Civic Coupe','Corvette Stingray Convertible','Prius','Sierra 1500 Denali','Sierra 1500','Chassis Cab','Altima','GT-R','Taurus','Acadia','4Runner','Sequoia','Corvette Grand Sport Convertible','Pilot','JUKE','Canyon Denali','Prius c','Yaris',
                  'SS SEDAN','C-HR','Maxima','Express Passenger','Terrain','Murano','CAMARO ZL1 CONVERTIBLE','Silverado 2500HD','Sierra 2500 Denali HD','Armada','TRANSIT','Civic Si Sedan','SILVERADO HD','Accord Hybrid','C-MAX Energi Titanium','Fusion Hybrid Titanium','Sonic Sedan','C-MAX Hybrid Titanium','Sierra 3500HD','86','Accord Coupe','Accord Sedan','Sienna','Malibu','Express Cargo','Tundra','Terrain Denali','NV200 Taxi','Yukon Denali',
                  'SILVERADO 2500 HD','Versa Sedan','Fusion Hybrid Platinum','Silverado 3500HD','Fusion Hybrid SE','Fusion Energi SE','Bolt EV','Camaro','Versa Note','Civic Type R','Camry','Yukon XL Denali','Corvette Z06','Traverse','Rogue Sport','LEAF','Acadia Denali','Corolla iM','Transit','Focus','City Express','Yaris iA','Civic Hatchback','Escape','Tacoma','HR-V','Fusion Hybrid S','Focus RS','Stripped Chassis','Civic Si Coupe','ILX',
                  '370Z Roadster','Sonic','Explorer','RAV4 Hybrid','Land Cruiser','Trax','MDX','Rogue','Fit','370Z Coupe','Ford F-650-750','Camaro ZL1','F-150','Ford F-150 Raptor','TLX','RDX','Mustang Shelby GT350','Yukon XL','Edge','C-MAX Hybrid SE','NV Cargo','Transit Connect','SILVERADO 1500','Camry Hybrid','Equinox','Colorado','RAV4','Suburban','Fusion Energi Titanium','Odyssey','Sierra 2500HD','Volt','Canyon','RLX','Low Cab Forward',
                  'Mustang','C-MAX','Avalon Hybrid','NV Passenger','Highlander Hybrid','Prius v','CR-V','Ford SuperDuty Commercial','TITAN','Silverado Chassis Cab','Avalon','NSX','Fusion','Ford Flex','Transit CC-CA','Spark','Express Cutaway','TITAN XD','Prius Prime','Cruze','Corolla','Fiesta ST','C-MAX Energi SE','Ford Econoline Cutaway','Focus ST','Sentra','Mirai','Impala','Silverado 1500','Corvette Grand Sport','Expedition','Ford SuperDuty',
                  'Ridgeline','Highlander','Fusion Energi Platinum','Yukon']
                  
    var inferModel = stringMax(models.filter(model => ymm.toLowerCase().indexOf(model.toLowerCase()) !== -1))
    const model = inferModel || slots.model;

    if(make === null) {
        callback(elicitMake(sessionAttributes))
    } else if(model === null) {
        callback(elicitModel(sessionAttributes, make))
    } else {
        queryDataBase(callback, sessionAttributes, make, model);
    }
}

exports.handler = (event, context, callback) => {
    try {
        dispatch(event,
            (response) => {
                callback(null, response);
            });
    } catch (err) {
        callback(err);
    }
};
