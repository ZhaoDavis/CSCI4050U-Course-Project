car_info = []

question_index = 0;

var input;

document.addEventListener("DOMContentLoaded", function() {

            input_section = document.getElementById("input");

            next_question();

            document.getElementById('submit').addEventListener('click', () => {
                console.log(question_index);
                getval();
                question_index++;
                next_question();
            });
            function next_question(){
                const question = document.getElementById("question");

                switch(question_index) {
                    case 0: //get manufacturer
                        question.textContent = questions[question_index];
                        dropdown(Object.keys(Manufacturers));
                        break;
                    case 1: //get model
                        question.textContent = questions[question_index];
                        car_brand = car_info[0]
                        dropdown(Manufacturers[car_brand]);
                        break;
                    case 2: //get kilometers driven
                        question.textContent = questions[question_index];
                        const numInput = document.createElement("input")
                        numInput.type = "number"
                        numInput.id = "input"
                        input_section.parentNode.replaceChild(numInput, input_section)

                        input_section = document.getElementById("input");
                        break;
                    case 3: //get production year
                        question.textContent = questions[question_index];
                        input_section.value = ""
                        break;
                    case 4: //get engine displacement
                        question.textContent = questions[question_index];
                        input_section.value = "";
                        break;
                    case 5: //get transmission type
                        question.textContent = questions[question_index];
                        const dropInput = document.createElement("select")
                        dropInput.value = "";
                        dropInput.id = "input"
                        input_section.parentNode.replaceChild(dropInput, input_section)

                        input_section = document.getElementById("input");
                        dropdown(transmissions);
                        break;
                    case 6: //get car colour
                        question.textContent = questions[question_index];
                        dropdown(colour);
                        break;
                    case 7: // get fuel/power type
                        question.textContent = questions[question_index];
                        dropdown(fuel);
                        break;
                    case 8: //get body type
                        question.textContent = questions[question_index];
                        dropdown(body_type)
                        break;
                    case 9: //get warranty status
                        question.textContent = questions[question_index];
                        dropdown(warranty_status)
                        break;
                    case 10: //get drivetrain type
                        question.textContent = questions[question_index];
                        dropdown(drivetrains);
                        break;
                    case 11://get exchangeable status
                        question.textContent = questions[question_index];
                        dropdown(exchangeable);
                        break;
                }

                if(question_index > 11) {
                    input_section.remove();
                    const button = document.getElementById("submit");
                    button.remove();

                    const div = document.getElementById("input_div");
                    div.innerHTML = "";

                    question.textContent = "submitting info..."
                    if (car_info[5] == "Manual") {
                        car_info[5] = "mechanical";
                    }
                    sendData();
                }
            }

            function dropdown(array) {
                for (const val in array) {
                    //input_section.textContent = "";

                    const option = document.createElement("option");
                    option.value = array[val]; 
                    option.textContent = array[val];     
                    input_section.appendChild(option); 
                }           
            }

            function getval() {
                if (input_section.tagName === "SELECT") {
                    input = input_section.value;
                    car_info[question_index] = input;
                    console.log(`inputted: ${input_section.value}; all car_info: ${car_info}; ${input_section.tagName}`);
                }
                else if (input_section.tagName === "INPUT") {
                    input = input_section.value;
                    car_info[question_index] = input;
                    console.log(`Current value: ${input_section.value}; all car_info: ${car_info}; ${input_section.tagName}`);
                }
                input_section.innerHTML = "";
            }

            async function sendData() {
                const data = {
                    manufacturer: car_info[0], 
                    model: car_info[1], 
                    odometer: car_info[2], 
                    year: car_info[3], 
                    engine_displacement: car_info[4],
                    transmission: car_info[5], 
                    colour: car_info[6], 
                    engine_fuel: car_info[7], 
                    body: car_info[8], 
                    has_warranty: car_info[9], 
                    drivetrain: car_info[10], 
                    is_exchangeable: car_info[11]
                }
                console.log(JSON.stringify(data))
                try {
                    console.log("submitting...")
                    const response = await fetch("http://127.0.0.1:8000/predict", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                    });

                    const result = await response.json();
                    console.log(result);
                    return result;
                } catch (error) {
                    console.error("Error occured when submitting data: ", error);
                }
                return -1;
            }
        });

const Manufacturers = {
"Audi": ['100', '200', '80', '90', 'A1', 'A2', 'A3', 'A4', 'A4 Allroad', 'A5', 'A6', 'A6 Allroad', 'A7', 'A8', 'Coupe', 'Q3', 'Q5', 'Q7', 'RS6', 'S4', 'S5', 'S6', 'S8', 'TT', 'V8'],
"BMW": ['116', '118', '120', '216', '218', '220', '225', '235', '315', '316', '318', '320', '322', '323', '324', '325', '328', '330', '335', '340', '420', '428', '435', '518', '520', '523', '524', '525', '528', '530', '535', '539', '540', '545', '550', '630', '635', '640', '645', '650', '725', '728', '730', '732', '735', '740', '745', '750', '760', 'Gran Turismo', 'M2', 'M3', 'M6', 'X1', 'X2', 'X3', 'X4', 'X5', 'X5 M', 'X6', 'X6 M', 'Z3', 'Z4', 'i3', 'М5'],
"Chevrolet":['Alero', 'Astro Van', 'Aveo', 'Blazer', 'C1500', 'Camaro', 'Captiva', 'Cavalier', 'Colorado', 'Cruze', 'Epica', 'Equinox', 'Express', 'HHR', 'Impala', 'Lacetti', 'Lanos', 'Lumina', 'Malibu', 'Matiz', 'Niva', 'Nubira', 'Orlando', 'Rezzo', 'Silver', 'Silverado', 'Spark', 'Suburban', 'Tahoe', 'Tracker', 'Trail Blazer', 'Trax', 'Venture', 'Volt'],
"Chrysler": ['180', '300', 'Aspen', 'Caravan', 'Cirrus', 'Concorde', 'Grand Voyager', 'Intrepid', 'LHS', 'Le Baron', 'Neon', 'PT Cruiser', 'Pacifica', 'Sebring', 'Stratus', 'Town&Country', 'Vision', 'Voyager'],
"Citroen": ['AX', 'BX', 'Berlingo', 'C-Crosser', 'C-ELYSÉE', 'C1', 'C2', 'C25', 'C3', 'C3 Picasso', 'C4', 'C4 AirCross', 'C4 Grand Picasso', 'C4 Picasso', 'C5', 'C6', 'C8', 'CX', 'DS4', 'DS5', 'Evasion', 'Jumper', 'Jumpy', 'Nemo', 'Saxo', 'XM', 'Xantia', 'Xsara', 'Xsara Picasso', 'ZX'],
"Dodge": ['1500', 'Avenger', 'Caliber', 'Caravan', 'Challenger', 'Charger', 'Dakota', 'Dart', 'Durango', 'Grand Caravan', 'Intrepid', 'Journey', 'Magnum', 'Neon', 'Nitro', 'Ram', 'Stealth', 'Stratus', 'Van'],
"Fiat": ['125', '500', '500L', '500X', 'Albea', 'Brava', 'Bravo', 'Cinquecento', 'Coupe', 'Croma', 'Doblo', 'Ducato', 'Fiorino', 'Freemont', 'Grande Punto', 'Idea', 'Lancia', 'Linea', 'Marea', 'Multipla', 'Palio', 'Panda', 'Punto', 'Scudo', 'Seicento', 'Siena', 'Stilo', 'Tempra', 'Tipo', 'Ulysse', 'Uno'],
"Ford": ['Aerostar', 'B-Max', 'C-Max', 'Contour', 'Cougar', 'Courier', 'Crown Victoria', 'E450', 'EcoSport', 'Econoline', 'Edge', 'Escape', 'Escort', 'Excursion', 'Expedition', 'Explorer', 'F150', 'F250', 'Fiesta', 'Focus', 'Freestyle', 'Fusion', 'Galaxy', 'Granada', 'Grand C-Max', 'Ka', 'Kuga', 'Maverick', 'Mondeo', 'Mustang', 'Orion', 'Probe', 'Puma', 'Ranger', 'S-Max', 'Scorpio', 'Sierra', 'Taunus', 'Taurus', 'Tempo', 'Thunderbird', 'Tourneo', 'Tourneo Custom', 'Transit', 'Windstar'],
"Honda": ['Accord', 'Aerodeck', 'CR-V', 'CR-Z', 'CRX', 'City', 'Civic', 'Concerto', 'Crosstour', 'Element', 'Elysion', 'FR-V', 'Fit', 'HR-V', 'Insight', 'Integra', 'Jazz', 'Legend', 'Logo', 'Odyssey', 'Passport', 'Pilot', 'Prelude', 'Ridgeline', 'S1000', 'S2000', 'Shuttle', 'Stream'],
"Hyundai": ['Accent', 'Atos', 'Coupe', 'Creta', 'Elantra', 'Equus', 'Galloper', 'Genesis', 'Getz', 'Grand Starex', 'Grandeur', 'H 100', 'H-1', 'Hd', 'Lantra', 'Matrix', 'Pony', 'Porter', 'S-Coupe', 'Santa Fe', 'Santamo', 'Solaris', 'Sonata', 'Starex', 'Terracan', 'Tiburon', 'Trajet', 'Tucson', 'XG 30', 'i10', 'i20', 'i30', 'i40', 'ix20', 'ix35', 'ix55'],
"Kia": ['Avella', 'Besta', 'Carens', 'Carnival', "Cee'd", 'Cerato', 'Clarus', 'Joice', 'Magentis', 'Mohave', 'Optima', 'Picanto', 'Pregio', 'Pride', "Pro Cee'd", 'Quoris', 'Retona', 'Rio', 'Sedona', 'Sephia', 'Shuma', 'Sorento', 'Soul', 'Spectra', 'Sportage', 'Venga'],
"Mazda": ['121', '2', '3', '323', '5', '6', '626', '929', 'BT-50', 'CX-3', 'CX-5', 'CX-7', 'CX-9', 'Demio', 'E2200', 'MPV', 'MX-3', 'MX-6', 'Millenia', 'Premacy', 'Protege', 'RX-8', 'Tribute', 'Xedos 6', 'Xedos 9'],
"Mercedes-Benz": ['190', 'A140', 'A150', 'A160', 'A170', 'A180', 'A190', 'A200', 'A210', 'AMG GT4', 'B150', 'B160', 'B170', 'B180', 'B200', 'C180', 'C200', 'C220', 'C230', 'C240', 'C250', 'C270', 'C280', 'C300', 'C320', 'C350', 'C63AMG', 'CL420', 'CL500', 'CL550', 'CLA180', 'CLA200', 'CLA220', 'CLA250', 'CLA45 AMG', 'CLK200', 'CLK230', 'CLK240', 'CLK270', 'CLK280', 'CLK320', 'CLS250', 'CLS320', 'CLS350', 'CLS400', 'CLS500', 'CLS55 AMG', 'CLS550', 'CLS63 AMG', 'Citan', 'E200', 'E220', 'E230', 'E240', 'E250', 'E260', 'E270', 'E280', 'E290', 'E300', 'E320', 'E350', 'E400', 'E420', 'E430', 'E50 AMG', 'E500', 'E63 AMG', 'G270', 'G300', 'G320', 'G350', 'G400', 'G500', 'G55 AMG', 'GL320', 'GL350', 'GL400', 'GL420', 'GL450', 'GL500', 'GL550', 'GL63', 'GLA200', 'GLA250', 'GLA45 AMG', 'GLC200', 'GLC250', 'GLC300', 'GLE300', 'GLE350', 'GLK220', 'GLK250', 'GLK300', 'GLK350', 'MB100', 'ML230', 'ML250', 'ML270', 'ML280', 'ML300', 'ML320', 'ML350', 'ML400', 'ML430', 'ML500', 'ML55 AMG', 'ML550', 'ML63 AMG', 'R280', 'R320', 'R350', 'R500', 'S220', 'S260', 'S280', 'S300', 'S320', 'S350', 'S400', 'S420', 'S430', 'S450', 'S500', 'S550', 'S560', 'S600', 'S63 AMG', 'S65 AMG', 'SL320', 'SL350', 'SL380', 'SL500', 'SLC200', 'SLK200', 'SLK350', 'Sprinter', 'T1', 'T2', 'V220', 'V250', 'Vaneo', 'Vario', 'Viano', 'Vito'],
"Mitsubishi": ['3000GT', 'ASX', 'Carisma', 'Colt', 'Eclipse', 'Eclipse Cross', 'Endeavor', 'Galant', 'Grandis', 'L200', 'L300', 'L400', 'Lancer', 'Lancer Evolution', 'Mirage', 'Montero', 'Outlander', 'Pajero', 'Pajero Pinin', 'Pajero Sport', 'RVR', 'Sigma', 'Space Gear', 'Space Runner', 'Space Star', 'Space Wagon'],
"Nissan": ['100NX', '200SX', '350Z', 'Almera', 'Almera Tino', 'Altima', 'Armada', 'Bluebird', 'Cabstar', 'Frontier', 'Interstar', 'Juke', 'L50', 'Leaf', 'Maxima', 'Micra', 'Murano', 'NV S', 'NV200', 'Navara', 'Note', 'Pathfinder', 'Patrol', 'Pixo', 'Prairie', 'Primastar', 'Primera', 'Pulsar', 'Qashqai', 'Qashqai+2', 'Quest', 'Rogue', 'Sentra', 'Serena', 'Skyline', 'Sunny', 'Teana', 'Terrano', 'Tiida', 'Titan', 'Urvan', 'Vanette', 'Versa', 'X-Trail'],
"Peugeot": ['1007', '106', '107', '2008', '205', '206', '207', '208', '3008', '301', '306', '307', '308', '309', '4007', '4008', '405', '406', '407', '408', '5008', '508', '605', '607', '806', '807', 'Bipper', 'Bipper Tepee', 'Boxer', 'Expert', 'Expert Tepee', 'J5', 'Partner', 'Partner Tepee'],
"Renault": ['11', '19', '21', '25', '5', '9', 'Captur', 'Clio', 'Coupe', 'Dokker', 'Duster', 'Espace', 'Express', 'Fluence', 'Grand Espace', 'Grand Modus', 'Grand Scenic', 'Kadjar', 'Kangoo', 'Kaptur', 'Koleos', 'Laguna', 'Latitude', 'Logan', 'Manager', 'Mascott', 'Master', 'Maxity', 'Megane', 'Megane Scenic', 'Modus', 'Rapid', 'Safrane', 'Sandero', 'Scenic', 'Symbol', 'Talisman', 'Thalia', 'Trafic', 'Twingo', 'Vel Satis'],
"Subaru": ['Forester', 'Impreza', 'Justy', 'Legacy', 'Leone', 'Libero', 'Outback', 'Tribeca', 'WRX', 'XV'],
"Suzuki": ['Aerio', 'Alto', 'Baleno', 'Forenza', 'Grand Vitara', 'Ignis', 'Jimny', 'Liana', 'SX4', 'SX4 S-Cross', 'Samurai', 'Splash', 'Swift', 'Verona', 'Vitara', 'Wagon R', 'XL7'],
"Toyota": ['4Runner', 'Alphard', 'Auris', 'Avensis', 'Avensis Verso', 'Aygo', 'Camry', 'Carina E', 'Carina II', 'Celica', 'Chaser', 'Corolla', 'Corolla Verso', 'Crown', 'Echo', 'FJ Cruiser', 'HiAce', 'Highlander', 'Hilux', 'IQ', 'Land Cruiser', 'MR2', 'Matrix', 'Model F', 'Paseo', 'Picnic', 'Previa', 'Prius', 'RAV4', 'Sequoia', 'Sienna', 'Solara', 'Starlet', 'Supra', 'Tacoma', 'Tundra', 'Urban Cruiser', 'Venza', 'Verso', 'Yaris'],
"Volkswagen": ['Amarok', 'Beetle', 'Bora', 'Caddy', 'Corrado', 'Crafter', 'Cross Polo', 'Eos', 'Fox', 'Gol', 'Golf', 'Golf Plus', 'Jetta', 'LT', 'Lupo', 'Passat', 'Passat CC', 'Phaeton', 'Pointer', 'Polo', 'Polo Sedan', 'Santana', 'Scirocco', 'Sharan', 'T2', 'T3', 'T3 Caravelle', 'T3 Multivan', 'T4', 'T4 Caravelle', 'T4 Multivan', 'T5', 'T5 Caravelle', 'T5 Multivan', 'T5 Shuttle', 'T6', 'T6 Caravelle', 'T6 Multivan', 'Teramont', 'Tiguan', 'Touareg', 'Touran', 'Up', 'Vento'],
"Volvo": ['240', '244', '264', '340', '360', '440', '460', '740', '850', '940', '960', 'C30', 'C70', 'S40', 'S60', 'S70', 'S80', 'S90', 'V40', 'V50', 'V60', 'V70', 'V90', 'XC60', 'XC70', 'XC90'],
}

const questions = [
    "What is the Manufacturer of your car?",
    "what model is your car?",
    "How many kilometers has your car been driven?",
    "What year was your car produced?",
    "What is the displacement of your car's engine?",
    "What transmission is your car?",
    "What colour is your car?",
    "What fuel/power type is your car?",
    "What body type is your car?",
    "Does your car still have a warranty?",
    "What type is the drivetrain?",
    "exchangeable?"
]

const transmissions = [
    "Automatic",
    "Manual"
]

const colour = [
    'black', 'blue', 'brown', 'green', 'grey', 'orange', 'other',
    'red', 'silver', 'violet', 'white', 'yellow'
    ]

const fuel = [
    'diesel', 'electric', 'gas', 'gasoline', 'hybrid-diesel',
    'hybrid-petrol'
]

const body_type = [
    'cabriolet', 'coupe', 'hatchback', 'liftback', 'limousine',
    'minibus', 'minivan', 'pickup', 'sedan', 'suv', 'universal', 'van'
]

const warranty_status = [
    true,
    false
]

const drivetrains = [
    'all', 'front', 'rear'
]

const exchangeable = [
    true,
    false
]

/*'manufacturer_name', 'model_name', 'odometer_value', 'year_produced', 
            'engine_capacity', 'transmission_mechanical', 'color_blue', 'color_brown', 
            'color_green', 'color_grey', 'color_orange', 'color_other', 'color_red', 
            'color_silver', 'color_violet', 'color_white', 'color_yellow', 
            'engine_fuel_electric', 'engine_fuel_gas', 'engine_fuel_gasoline', 
            'engine_fuel_hybrid-diesel', 'engine_fuel_hybrid-petrol', 'body_type_coupe', 
            'body_type_hatchback', 'body_type_liftback', 'body_type_limousine', 
            'body_type_minibus', 'body_type_minivan', 'body_type_pickup', 'body_type_sedan', 
            'body_type_suv', 'body_type_universal', 'body_type_van', 'has_warranty', 
            'drivetrain_front', 'drivetrain_rear', 'is_exchangeable' */